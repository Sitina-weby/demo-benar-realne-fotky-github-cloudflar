import { describe, it, expect } from "vitest";
import { getHoursStatus, type HoursSchedule } from "./hours";
import { siteConfig } from "../data/site.config";

// Rozvrh dle site.config.ts: Po-Čt 11:00-22:00, Pá-So 11:00-23:00, Ne 11:00-22:00.
const schedule: HoursSchedule = siteConfig.hours.schedule;

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

describe("site.config.ts — kontrola přesných počtů dle akceptačních kritérií", () => {
  it("denní menu má přesně 8 hlavních jídel, každé v cenovém rozpětí 160-190 Kč", () => {
    expect(siteConfig.dailyMenu.mainDishes.length).toBe(8);
    siteConfig.dailyMenu.mainDishes.forEach((dish) => {
      expect(dish.price).toBeGreaterThanOrEqual(160);
      expect(dish.price).toBeLessThanOrEqual(190);
      expect(Array.isArray(dish.allergens)).toBe(true);
      expect(dish.allergens.length).toBeGreaterThan(0);
      expect(dish.weight).toMatch(/\d/);
    });
    // Čísla musí být 1-8 bez děr a duplicit
    const numbers = siteConfig.dailyMenu.mainDishes.map((d) => d.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("denní menu má přesně 1 polévku", () => {
    expect(siteConfig.dailyMenu.soup).toBeDefined();
    expect(siteConfig.dailyMenu.soup.name.length).toBeGreaterThan(0);
  });

  it("stálý lístek má přesně 11 kategorií", () => {
    expect(siteConfig.fullMenu.categories.length).toBe(11);
  });

  it("stálý lístek má celkem přesně 18 položek", () => {
    const totalItems = siteConfig.fullMenu.categories.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
    expect(totalItems).toBe(18);
  });

  it("obsahuje přesně 3 recenze", () => {
    expect(siteConfig.reviews.length).toBe(3);
  });

  it("obsahuje přesně 6 highlights položek", () => {
    expect(siteConfig.highlights.length).toBe(6);
  });

  it("galerie má 8-12 fotek", () => {
    expect(siteConfig.gallery.images.length).toBeGreaterThanOrEqual(8);
    expect(siteConfig.gallery.images.length).toBeLessThanOrEqual(12);
  });

  it("obsahuje 1-2 events položky", () => {
    expect(siteConfig.events.length).toBeGreaterThanOrEqual(1);
    expect(siteConfig.events.length).toBeLessThanOrEqual(2);
  });

  it("reálné kontaktní údaje jsou konzistentní (adresa, telefon, FB)", () => {
    expect(siteConfig.business.address.street).toBe("Rooseveltova 279");
    expect(siteConfig.business.address.city).toBe("Litvínov");
    expect(siteConfig.business.phoneDisplay).toBe("476 000 229");
    expect(siteConfig.contact.address).toContain("Rooseveltova 279");
    expect(siteConfig.contact.facebookUrl).toBe(siteConfig.business.facebookUrl);
  });

  it("about zmiňuje rok 2004 a divadlo", () => {
    expect(siteConfig.about.foundedYear).toBe(2004);
    const combined = siteConfig.about.paragraphs.join(" ") + siteConfig.about.teaser;
    expect(combined).toMatch(/2004/);
    expect(combined.toLowerCase()).toMatch(/divadl/);
  });

  it("hero zmiňuje divadlo v podnadpisu", () => {
    expect(siteConfig.hero.subheadline.toLowerCase()).toMatch(/divadl/);
    expect(siteConfig.hero.subheadline).toMatch(/2004/);
  });
});
