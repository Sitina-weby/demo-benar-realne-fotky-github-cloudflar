import { describe, it, expect } from "vitest";
import { validateReservation } from "./reservationValidation";

// Pevné referenční "teď" pro deterministické testy: 15. 6. 2026, 10:00 UTC
// (Europe/Prague je v létě UTC+2, tedy 12:00 místního času — netriviální,
// ale pro porovnání kalendářního dne to nehraje roli.)
const NOW = new Date("2026-06-15T10:00:00Z");

const validBase = {
  name: "Jana Nováková",
  phone: "476 000 229",
  date: "2026-06-20",
  time: "18:00",
  guests: 4,
  note: "",
};

describe("validateReservation", () => {
  it("vrátí valid: true pro kompletně validní vstup", () => {
    const result = validateReservation(validBase, NOW);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("vyžaduje povinná pole — prázdný formulář vrátí chyby pro všechna povinná pole", () => {
    const result = validateReservation(
      { name: "", phone: "", date: "", time: "", guests: "" },
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.date).toBeDefined();
    expect(result.errors.time).toBeDefined();
    expect(result.errors.guests).toBeDefined();
  });

  it("odmítne neplatný formát telefonu", () => {
    const result = validateReservation({ ...validBase, phone: "12345" }, NOW);
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it("akceptuje telefon s předvolbou +420 i bez mezer", () => {
    const withPrefix = validateReservation({ ...validBase, phone: "+420476000229" }, NOW);
    const withSpaces = validateReservation({ ...validBase, phone: "+420 476 000 229" }, NOW);
    const plain = validateReservation({ ...validBase, phone: "476000229" }, NOW);
    expect(withPrefix.errors.phone).toBeUndefined();
    expect(withSpaces.errors.phone).toBeUndefined();
    expect(plain.errors.phone).toBeUndefined();
  });

  it("odmítne datum v minulosti", () => {
    const result = validateReservation({ ...validBase, date: "2026-06-10" }, NOW);
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });

  it("akceptuje hraniční dnešní datum (kalendářní den, ne timestamp)", () => {
    // NOW je 2026-06-15T10:00:00Z -> v Praze je to 2026-06-15 (léto, UTC+2 -> 12:00)
    const result = validateReservation({ ...validBase, date: "2026-06-15" }, NOW);
    expect(result.valid).toBe(true);
    expect(result.errors.date).toBeUndefined();
  });

  it("odmítne počet osob mimo rozsah 1-30 (0 i 31)", () => {
    const tooFew = validateReservation({ ...validBase, guests: 0 }, NOW);
    const tooMany = validateReservation({ ...validBase, guests: 31 }, NOW);
    expect(tooFew.valid).toBe(false);
    expect(tooFew.errors.guests).toBeDefined();
    expect(tooMany.valid).toBe(false);
    expect(tooMany.errors.guests).toBeDefined();
  });

  it("akceptuje hraniční počet osob 1 a 30", () => {
    const min = validateReservation({ ...validBase, guests: 1 }, NOW);
    const max = validateReservation({ ...validBase, guests: 30 }, NOW);
    expect(min.valid).toBe(true);
    expect(max.valid).toBe(true);
  });

  it("odmítne neceločíselný počet osob", () => {
    const result = validateReservation({ ...validBase, guests: 2.5 }, NOW);
    expect(result.valid).toBe(false);
    expect(result.errors.guests).toBeDefined();
  });

  it("poznámka je nepovinná — validní vstup bez poznámky projde", () => {
    const { note, ...withoutNote } = validBase;
    const result = validateReservation(withoutNote, NOW);
    expect(result.valid).toBe(true);
  });
});
