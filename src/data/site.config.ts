// ---------------------------------------------------------------------------
// site.config.ts — jediný zdroj obsahu. Redesign 2026-10: OBSAHUJE POUZE
// ověřené údaje (viz README → „Ověřený obsah"). Cokoli neověřeného (jídla,
// ceny, otevírací doba, e-mail, recenze, akce, vybavení) je záměrně pryč a
// je uvedeno v `missing`. Původní demo obsah: docs/archive / git commit a779d18.
// ---------------------------------------------------------------------------

export interface Photo {
  webp: string;
  jpg: string;
  alt: string;
}

const photo = (n: number): Photo => ({
  webp: `/images/benar/gallery-${n}-800.webp`,
  jpg: `/images/benar/gallery-${n}-800.jpg`,
  // Obsah fotek nebyl ručně zkurátorován → obecný popisek (viz docs/foto-puvod-overeni.md).
  alt: `Restaurace Benar — fotografie ${n}`,
});

export const siteConfig = {
  name: "Restaurace Benar",
  fullName: "Divadelní restaurace Benar",
  tagline: "Česká kuchyně v přízemí Docela velkého divadla v Litvínově",
  foundedYear: 2004,
  phone: "+420476000229",
  phoneDisplay: "476 000 229",
  facebookUrl: "https://facebook.com/p/Restaurace-Benar-Litvínov-100063558610894",
  address: { street: "Rooseveltova 279", zip: "436 01", city: "Litvínov" },
  mapQuery: "Restaurace Benar, Rooseveltova 279, Litvínov",

  hero: {
    webp: "/images/benar/hero-1920.webp",
    jpg: "/images/benar/hero-1920.jpg",
    alt: "Restaurace Benar — fotografie prostoru",
  } as Photo,
  storyPhoto: photo(2),

  // Ověřená hodnocení (veřejně dostupná, stav v době přípravy dema — README bod 4).
  ratings: [
    { value: "92 %", label: "doporučení na Facebooku (63 hodnocení)" },
    { value: "4,2 / 5", label: "Tripadvisor" },
    { value: "4,2 / 5", label: "Firmy.cz" },
  ],

  // Odkaz na jídelní lístek. Ověřená URL lístku NEEXISTUJE → null; odkaz vede
  // na stránku /jidelni-listek, která to transparentně říká a odkazuje na FB/telefon.
  menu: { externalUrl: null as string | null, pagePath: "/jidelni-listek" },

  gallery: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(photo),

  // Chybějící informace — vypsáno v README/PR, nehádat.
  missing: [
    "Odkaz na oficiální jídelní lístek (URL / PDF) — dodá restaurace",
    "Jídla, gramáže, alergeny a ceny — dodá restaurace",
    "Otevírací doba — nebyla ověřena",
    "E-mail a IČO/DIČ — nebyly ověřeny",
    "Vybavení (zahrádka, dětský koutek, parkoviště, Wi-Fi, platba kartou) — nebylo ověřeno",
    "AI ilustrační fotografie jídel — v tomto běhu nebylo možné vygenerovat (chybí nástroj pro generování obrázků)",
  ],
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
