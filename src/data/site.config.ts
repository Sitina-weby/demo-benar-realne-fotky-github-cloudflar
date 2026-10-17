// ---------------------------------------------------------------------------
// site.config.ts — JEDINÝ zdroj obsahu webu Restaurace Benar (redesign).
//
// PRAVIDLO: žádná vymyšlená fakta. Obsah je jen to, co už v projektu bylo
// jako ověřený podklad (adresa, telefon, Facebook, rok 2004, sídlo v přízemí
// Docela velkého divadla, vybavení) + reálné fotky z Google Drive restaurace
// (viz docs/foto-puvod-overeni.md). Vše ostatní (jídelní lístek, ceny, denní
// menu, otevírací doba, e-mail, recenze, akce) je v `missing` označeno jako
// „doplní klient“ a web to tak i zobrazuje.
// ---------------------------------------------------------------------------

export interface GalleryImage {
  webp: string;
  jpg: string;
  alt: string;
}

/** Položka seznamu chybějících údajů — zobrazí se na webu jako „doplní klient“. */
export interface MissingItem {
  label: string;
  note: string;
}

export const siteConfig = {
  business: {
    name: "Restaurace Benar",
    fullName: "Divadelní restaurace Benar",
    claim: "Česká kuchyně v přízemí Docela velkého divadla v Litvínově",
    phone: "+420476000229",
    phoneDisplay: "476 000 229",
    facebookUrl: "https://facebook.com/p/Restaurace-Benar-Litvínov-100063558610894",
    address: {
      street: "Rooseveltova 279",
      city: "Litvínov",
      zip: "436 01",
    },
  },

  hero: {
    eyebrow: "Litvínov · od roku 2004",
    headline: "Restaurace Benar",
    subheadline: "Česká kuchyně v přízemí Docela velkého divadla",
    image: {
      webp: "/images/benar/hero-1920.webp",
      jpg: "/images/benar/hero-1920.jpg",
      webpSmall: "/images/benar/hero-960.webp",
      jpgSmall: "/images/benar/hero-960.jpg",
      alt: "Restaurace Benar — fotografie prostoru",
    },
  },

  about: {
    foundedYear: 2004,
    heading: "Restaurace s divadlem pod jednou střechou",
    paragraphs: [
      "Restaurace Benar sídlí v přízemí Docela velkého divadla na Rooseveltově ulici v Litvínově a funguje od roku 2004.",
      "K restauraci patří zahrádka, dětský koutek, parkoviště a nekuřácký salonek.",
    ],
    image: {
      webp: "/images/benar/gallery-1-1600.webp",
      jpg: "/images/benar/gallery-1-1600.jpg",
      alt: "Restaurace Benar — fotografie prostoru",
    },
  },

  /**
   * Odkaz na jídelní lístek. Ověřená veřejná URL lístku nebyla k dispozici
   * (web ani lístek se v podkladech nenašly) → `url` je null a web zobrazí
   * „doplní klient“. Jakmile klient dodá odkaz nebo PDF, stačí sem vložit
   * URL (např. "/jidelni-listek.pdf" po nahrání do public/) a tlačítka
   * na webu povedou přímo na něj.
   */
  menu: {
    url: null as string | null,
    pagePath: "/jidelni-listek",
    heading: "Jídelní lístek",
    pending: "Jídelní lístek, denní menu a ceny doplní klient. Do té doby se na aktuální nabídku zeptejte telefonicky.",
  },

  gallery: {
    heading: "Prostory restaurace",
    note: "Reálné fotografie restaurace Benar poskytnuté provozovatelem.",
    images: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
      webp: `/images/benar/gallery-${n}-800.webp`,
      jpg: `/images/benar/gallery-${n}-800.jpg`,
      alt: `Restaurace Benar — fotografie ${n}`,
    })) as GalleryImage[],
    /** Ilustrační AI fotky jídel zatím nejsou (viz README, „Chybí / BLOCKED“). */
    aiNote: null as string | null,
  },

  amenities: ["Zahrádka", "Dětský koutek", "Parkoviště", "Nekuřácký salonek"],

  reservation: {
    heading: "Rezervace stolu",
    text: "Stůl si zarezervujte telefonicky.",
  },

  contact: {
    address: "Rooseveltova 279, 436 01 Litvínov",
    mapEmbedQuery: "Restaurace Benar, Rooseveltova 279, Litvínov",
    mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Restaurace%20Benar%2C%20Rooseveltova%20279%2C%20Litv%C3%ADnov",
  },

  missing: [
    { label: "Otevírací doba", note: "doplní klient" },
    { label: "Jídelní lístek a ceny", note: "doplní klient" },
    { label: "Denní menu", note: "doplní klient" },
    { label: "E-mail", note: "doplní klient" },
    { label: "Ilustrační AI fotky jídel", note: "nevygenerovány — chybí přístup k nástroji (viz README)" },
  ] as MissingItem[],

  demoNotice:
    "Toto je ukázkový redesign webu. Údaje označené „doplní klient“ nebyly ověřeny a nejsou zveřejněny.",
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
