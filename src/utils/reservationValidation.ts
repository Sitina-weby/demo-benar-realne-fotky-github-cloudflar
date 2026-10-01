// ---------------------------------------------------------------------------
// utils/reservationValidation.ts — čistá validační funkce pro rezervační
// formulář (DEMO — bez reálného odeslání, viz komentář v ReservationForm.astro).
//
// Design rozhodnutí (stejný vzor jako utils/hours.ts):
// - Funkce NIKDY nevolá `new Date()` sama uvnitř — aktuální čas (dnešní den)
//   se jí předává jako parametr `now`, aby šla deterministicky testovat.
// - Datum se porovnává jako KALENDÁŘNÍ DEN (rok/měsíc/den), ne jako přesný
//   timestamp — rezervace "dnes" ve 23:59 je platná, i když `now` je "dnes"
//   v 10:00 dopoledne. Porovnává se v časovém pásmu Europe/Prague pro
//   konzistenci s utils/hours.ts.
// - Telefon: regex akceptuje formáty s/bez předvolby +420 a s/bez mezer,
//   např. "476000229", "476 000 229", "+420476000229", "+420 476 000 229".
// - Počet osob: celé číslo 1–30 (rozumný rozsah pro rezervaci stolu/salonku).
// ---------------------------------------------------------------------------

export interface ReservationInput {
  name: string;
  phone: string;
  date: string; // očekávaný formát "YYYY-MM-DD" (input type="date")
  time: string; // očekávaný formát "HH:MM" (input type="time")
  guests: number | string;
  note?: string;
}

export interface ReservationFieldErrors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export interface ReservationValidationResult {
  valid: boolean;
  errors: ReservationFieldErrors;
}

// Akceptuje: "476000229", "476 000 229", "+420 476 000 229", "+420476000229",
// i s pomlčkami mezi trojčíslími. Vyžaduje 9 číslic na konci, volitelně +420 na začátku.
const PHONE_REGEX = /^(\+420[\s-]?)?(\d{3}[\s-]?){2}\d{3}$/;

function getPragueYMD(date: Date): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // en-CA formátuje jako YYYY-MM-DD
  const parts = dtf.formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value ?? "0");
  const month = Number(parts.find((p) => p.type === "month")?.value ?? "0");
  const day = Number(parts.find((p) => p.type === "day")?.value ?? "0");
  return { year, month, day };
}

function parseDateInput(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function compareYMD(
  a: { year: number; month: number; day: number },
  b: { year: number; month: number; day: number },
): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/**
 * Validuje vstup rezervačního formuláře.
 *
 * @param input Hodnoty z formuláře (vše jako stringy, jak přichází z <input>)
 * @param now Aktuální čas — VŽDY předávaný zvenčí (žádné new Date() uvnitř)
 */
export function validateReservation(
  input: ReservationInput,
  now: Date,
): ReservationValidationResult {
  const errors: ReservationFieldErrors = {};

  // --- Jméno: povinné ---
  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Vyplňte prosím jméno.";
  }

  // --- Telefon: povinný + formát ---
  if (!input.phone || input.phone.trim().length === 0) {
    errors.phone = "Vyplňte prosím telefon.";
  } else if (!PHONE_REGEX.test(input.phone.trim())) {
    errors.phone = "Telefon zadejte ve formátu 476 000 229 nebo +420 476 000 229.";
  }

  // --- Datum: povinné + nesmí být v minulosti (kalendářní den) ---
  if (!input.date || input.date.trim().length === 0) {
    errors.date = "Vyberte prosím datum rezervace.";
  } else {
    const parsed = parseDateInput(input.date);
    if (!parsed) {
      errors.date = "Datum není ve správném formátu.";
    } else {
      const today = getPragueYMD(now);
      if (compareYMD(parsed, today) < 0) {
        errors.date = "Datum nemůže být v minulosti.";
      }
    }
  }

  // --- Čas: povinný ---
  if (!input.time || input.time.trim().length === 0) {
    errors.time = "Vyberte prosím čas rezervace.";
  }

  // --- Počet osob: 1-30 ---
  const guestsNum =
    typeof input.guests === "number" ? input.guests : Number(String(input.guests).trim());
  if (input.guests === "" || input.guests === null || input.guests === undefined) {
    errors.guests = "Vyplňte prosím počet osob.";
  } else if (!Number.isFinite(guestsNum) || !Number.isInteger(guestsNum)) {
    errors.guests = "Počet osob musí být celé číslo.";
  } else if (guestsNum < 1 || guestsNum > 30) {
    errors.guests = "Počet osob musí být v rozmezí 1 až 30.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export { PHONE_REGEX };
