import { describe, it, expect } from "vitest";
import { getHoursStatus, type HoursSchedule } from "./hours";
import { siteConfig } from "../data/site.config";

// TESTOVACÍ rozvrh pro ověření logiky getHoursStatus — NEJDE o skutečnou otevírací
// dobu restaurace (ta je na webu označena „doplní klient“).
const schedule: HoursSchedule = {
  mon: "11:00–22:00",
  tue: "11:00–22:00",
  wed: "11:00–22:00",
  thu: "11:00–22:00",
  fri: "11:00–23:00",
  sat: "11:00–23:00",
  sun: "11:00–22:00",
};

/**
 * Pomocná funkce: vytvoří Date odpovídající danému lokálnímu času v Praze.
 * Používáme UTC konstruktor s ručním posunem, abychom test nezávisleli na TZ
 * stroje, který test spouští — Europe/Prague je UTC+1 (zima) / UTC+2 (léto).
 * Pro jednoduchost a determinismus testujeme na zimních datech (UTC+1, bez DST),
 * kdy je posun stabilní a nehrozí problém s přechodem na letní čas.
 */
function pragueWinterDate(isoLocal: string): Date {
  // isoLocal např. "2026-01-12T13:30:00" interpretováno jako Europe/Prague (UTC+1 v lednu)
  const utcMs = new Date(isoLocal + "Z").getTime() - 1 * 60 * 60 * 1000;
  return new Date(utcMs);
}

describe("getHoursStatus", () => {
  it("scénář 1: všední den v provozu (úterý 13:30) -> otevřeno, zavíráme ve 22:00", () => {
    // 2026-01-13 je úterý
    const now = pragueWinterDate("2026-01-13T13:30:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(true);
    expect(status.nextChangeTime).toBe("22:00");
    expect(status.badgeText).toContain("22:00");
  });

  it("scénář 2: všední den mimo provoz (středa 08:00 ráno) -> zavřeno, otevíráme dnes v 11:00", () => {
    // 2026-01-14 je středa
    const now = pragueWinterDate("2026-01-14T08:00:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(false);
    expect(status.nextChangeTime).toBe("11:00");
    expect(status.label).toContain("dnes");
  });

  it("scénář 2b: všední den mimo provoz (středa 23:00 večer, po zavírací době) -> zavřeno, otevíráme zítra", () => {
    const now = pragueWinterDate("2026-01-14T23:00:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(false);
    expect(status.nextChangeDay).toBe("thu");
    expect(status.nextChangeTime).toBe("11:00");
  });

  it("scénář 3: víkendová otevírací doba (sobota 22:30) -> stále otevřeno (do 23:00)", () => {
    // 2026-01-17 je sobota
    const now = pragueWinterDate("2026-01-17T22:30:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(true);
    expect(status.nextChangeTime).toBe("23:00");
  });

  it("scénář 4: čas těsně po půlnoci v sobotu (00:15, tedy už neděle ráno) -> zavřeno, otevíráme dnes (neděle) v 11:00", () => {
    // 2026-01-18 00:15 je technicky neděle (Pá/So zavírací doba 23:00 v sobotu už skončila)
    const now = pragueWinterDate("2026-01-18T00:15:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(false);
    expect(status.nextChangeDay).toBe("sun");
    expect(status.nextChangeTime).toBe("11:00");
  });

  it("scénář 4b: čas těsně po půlnoci z pátku na sobotu (00:10) -> zavřeno, otevíráme dnes (sobota) v 11:00", () => {
    // 2026-01-17 00:10 je technicky sobota (Čt zavírací doba 22:00 v pátek už skončila)
    const now = pragueWinterDate("2026-01-17T00:10:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(false);
    expect(status.nextChangeDay).toBe("sat");
    expect(status.nextChangeTime).toBe("11:00");
  });

  it("neděle večer po zavírací době -> zavřeno, otevíráme v pondělí", () => {
    // 2026-01-18 je neděle, zavírací doba 22:00
    const now = pragueWinterDate("2026-01-18T22:30:00");
    const status = getHoursStatus(schedule, now);
    expect(status.isOpen).toBe(false);
    expect(status.nextChangeDay).toBe("mon");
    expect(status.nextChangeTime).toBe("11:00");
  });
});

describe("site.config.ts — ověřený obsah, žádná vymyšlená fakta", () => {
  it("kontaktní údaje jsou konzistentní (adresa, telefon)", () => {
    expect(siteConfig.business.address.street).toBe("Rooseveltova 279");
    expect(siteConfig.business.address.city).toBe("Litvínov");
    expect(siteConfig.business.phoneDisplay).toBe("476 000 229");
    expect(siteConfig.contact.address).toContain("Rooseveltova 279");
  });

  it("galerie obsahuje 8-12 reálných fotek", () => {
    expect(siteConfig.gallery.images.length).toBeGreaterThanOrEqual(8);
    expect(siteConfig.gallery.images.length).toBeLessThanOrEqual(12);
  });

  it("jídelní lístek má odkaz nebo viditelnou položku doplní klient", () => {
    expect(siteConfig.menu.url !== null || siteConfig.menu.pending.includes("doplní klient")).toBe(true);
    expect(siteConfig.menu.pagePath).toBe("/jidelni-listek");
  });

  it("neověřené údaje jsou vedeny v seznamu missing", () => {
    const labels = siteConfig.missing.map((m) => m.label);
    expect(labels).toContain("Otevírací doba");
    expect(labels).toContain("Jídelní lístek a ceny");
  });

  it("zmiňuje rok 2004 a divadlo", () => {
    expect(siteConfig.about.foundedYear).toBe(2004);
    expect(siteConfig.about.paragraphs.join(" ").toLowerCase()).toMatch(/divadl/);
  });
});
