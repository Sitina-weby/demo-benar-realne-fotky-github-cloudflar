// ---------------------------------------------------------------------------
// utils/hours.ts — čistá funkce pro výpočet stavu otevírací doby.
//
// Design rozhodnutí:
// - Funkce NIKDY nevolá `new Date()` sama uvnitř — aktuální čas se jí předává
//   jako parametr, aby šla snadno a deterministicky testovat (viz src/utils/hours.test.ts).
// - Časové pásmo: Europe/Prague. Protože v sandboxu/CI nemusí běžet systémový
//   čas v Praze, veškeré porovnání dne v týdnu a minut od půlnoci počítáme
//   explicitně přes Intl.DateTimeFormat s timeZone: "Europe/Prague", ne přes
//   lokální metody Date (getDay/getHours), které by v jiném TZ dávaly jiný den.
// - Podporuje edge-case přechodu přes půlnoc (Pá/So zavírací doba 23:00 je
//   ve stejný kalendářní den, ale funkce zvládá i obecně otevírací dobu,
//   která by přesahovala půlnoc, kdyby se to v budoucnu v datech změnilo).
// ---------------------------------------------------------------------------

export interface HoursSchedule {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export type DayKey = keyof HoursSchedule;

export interface HoursStatus {
  /** true = restaurace je v danou chvíli otevřená */
  isOpen: boolean;
  /** Lidsky čitelný popisek, např. "Otevřeno, zavíráme ve 22:00" */
  label: string;
  /** Den, kdy dojde k další změně stavu ("dnes" nebo "zítra" apod. jako den klíč) */
  nextChangeDay: DayKey;
  /** Čas další změny ve formátu HH:MM */
  nextChangeTime: string;
  /** Kombinovaný text pro badge, např. "Otevřeno do 22:00" / "Zavřeno, otevíráme v Pá 11:00" */
  badgeText: string;
}

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_LABEL_CS: Record<DayKey, string> = {
  mon: "pondělí",
  tue: "úterý",
  wed: "středa",
  thu: "čtvrtek",
  fri: "pátek",
  sat: "sobota",
  sun: "neděle",
};

const DAY_LABEL_SHORT_CS: Record<DayKey, string> = {
  mon: "Po",
  tue: "Út",
  wed: "St",
  thu: "Čt",
  fri: "Pá",
  sat: "So",
  sun: "Ne",
};

/** Parsuje "11:00–22:00" (nebo s obyčejnou pomlčkou) na minuty od půlnoci [start, end]. */
function parseRange(range: string): { start: number; end: number } {
  const cleaned = range.replace(/\s/g, "").replace("–", "-");
  const [startStr, endStr] = cleaned.split("-");
  const [startH, startM] = startStr.split(":").map(Number);
  const [endH, endM] = endStr.split(":").map(Number);
  return { start: startH * 60 + startM, end: endH * 60 + endM };
}

function formatMinutes(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/**
 * Vrátí den v týdnu (0 = pondělí .. 6 = neděle) a minuty od půlnoci
 * pro zadané `date`, vyhodnocené v časovém pásmu Europe/Prague —
 * bez ohledu na to, v jakém TZ běží stroj, který funkci volá.
 */
function getPragueDayAndMinutes(date: Date): { dayIndex: number; minutes: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(date);
  const weekdayShort = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const dayIndex = map[weekdayShort] ?? 0;
  return { dayIndex, minutes: hour * 60 + minute };
}

/**
 * Vypočítá aktuální stav otevírací doby pro dané rozvrhy a zadaný čas.
 *
 * @param schedule Týdenní rozvrh (7x string rozsah "HH:MM–HH:MM")
 * @param now Aktuální čas — VŽDY předávaný zvenčí (žádné new Date() uvnitř)
 */
export function getHoursStatus(schedule: HoursSchedule, now: Date): HoursStatus {
  const { dayIndex, minutes } = getPragueDayAndMinutes(now);
  const todayKey = DAY_ORDER[dayIndex];
  const todayRange = parseRange(schedule[todayKey]);

  // Zjisti, jestli jsme aktuálně uvnitř dnešního otevíracího okna.
  const isOpenToday = minutes >= todayRange.start && minutes < todayRange.end;

  if (isOpenToday) {
    return {
      isOpen: true,
      nextChangeDay: todayKey,
      nextChangeTime: formatMinutes(todayRange.end),
      label: `Otevřeno, zavíráme v ${formatMinutes(todayRange.end)}`,
      badgeText: `Otevřeno do ${formatMinutes(todayRange.end)}`,
    };
  }

  // Případ: jsme před dnešním otevřením (např. brzy ráno) -> otevíráme dnes.
  if (minutes < todayRange.start) {
    return {
      isOpen: false,
      nextChangeDay: todayKey,
      nextChangeTime: formatMinutes(todayRange.start),
      label: `Zavřeno, otevíráme dnes v ${formatMinutes(todayRange.start)}`,
      badgeText: `Zavřeno, otevíráme v ${formatMinutes(todayRange.start)}`,
    };
  }

  // Jinak jsme po dnešní zavírací době (včetně edge-case těsně po půlnoci,
  // kdy "dnešek" už reálně skončil a hledáme nejbližší budoucí otevírací den)
  // -> najdi nejbližší následující den s otevírací dobou (obvykle zítřek).
  for (let offset = 1; offset <= 7; offset++) {
    const nextIndex = (dayIndex + offset) % 7;
    const nextKey = DAY_ORDER[nextIndex];
    const nextRange = parseRange(schedule[nextKey]);
    const dayLabel = offset === 1 ? "zítra" : `v ${DAY_LABEL_CS[nextKey]}`;
    return {
      isOpen: false,
      nextChangeDay: nextKey,
      nextChangeTime: formatMinutes(nextRange.start),
      label: `Zavřeno, otevíráme ${dayLabel} v ${formatMinutes(nextRange.start)}`,
      badgeText: `Zavřeno, otevíráme ${dayLabel === "zítra" ? "zítra" : dayLabel} v ${formatMinutes(nextRange.start)}`,
    };
  }

  // Nedosažitelné (schedule má vždy 7 dní), ale TS chce návratovou hodnotu.
  return {
    isOpen: false,
    nextChangeDay: todayKey,
    nextChangeTime: formatMinutes(todayRange.start),
    label: "Zavřeno",
    badgeText: "Zavřeno",
  };
}

export { DAY_ORDER, DAY_LABEL_CS, DAY_LABEL_SHORT_CS, parseRange, formatMinutes, getPragueDayAndMinutes };
