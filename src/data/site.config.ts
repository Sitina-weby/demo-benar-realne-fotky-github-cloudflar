// ---------------------------------------------------------------------------
// site.config.ts — JEDINÝ zdroj obsahu pro demo web Restaurace Benar.
// Toto je INSTANCE obecného datového modelu šablony "Hospoda" definovaného
// v master-sablony-weby-lokalni-podniky.md — nepřidávat sem pole, která tam
// nemají obdobu, bez promítnutí zpět do master dokumentu.
//
// Veškerý obsah je psán ručně, sousedským/přátelským tónem, bez lorem ipsum.
// Reálná fakta (adresa, telefon, FB, rok založení, hodnocení) vycházejí
// z veřejně dostupných zdrojů (viz technická specifikace v2, oddíl 3).
// Denní menu, stálý lístek, recenze a fotky jsou VZOROVÉ/DEMO obsahy.
// ---------------------------------------------------------------------------

export interface MainDish {
  number: number;
  weight: string;
  name: string;
  allergens: number[];
  price: number;
}

export interface MenuItem {
  name: string;
  weight: string;
  price: number;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Review {
  name: string;
  text: string;
  note: string;
}

export interface GalleryImage {
  /** Fallback/legacy single-source image (SVG placeholder nebo jednoduchý JPEG). */
  src?: string;
  /** WebP zdroj pro <picture><source>, použít spolu s `jpg`. */
  webp?: string;
  /** JPEG fallback pro <picture><img>, použít spolu s `webp`. */
  jpg?: string;
  alt: string;
}

export interface EventItem {
  title: string;
  date: string;
  description: string;
  note: string;
}

export const siteConfig = {
  business: {
    name: "Restaurace Benar",
    fullName: "Divadelní restaurace Benar",
    type: "Tradiční česká restaurace",
    claim: "Tradiční česká kuchyně a steaky v srdci Litvínova — v přízemí Docela velkého divadla",
    phone: "+420476000229",
    phoneDisplay: "476 000 229",
    email: null as string | null, // nebylo ověřeno, ponecháno prázdné (viz README - Předpoklady, bod 10)
    facebookUrl: "https://facebook.com/p/Restaurace-Benar-Litvínov-100063558610894",
    address: {
      street: "Rooseveltova 279",
      city: "Litvínov",
      zip: "436 01",
    },
    ico: null as string | null, // neověřeno, viz Předpoklady bod 10
  },

  hero: {
    headline: "Restaurace Benar",
    subheadline:
      "Poctivá česká kuchyně a steaky od roku 2004 — v přízemí Docela velkého divadla v Litvínově",
    images: [
      { src: "/images/hero-interior.svg", alt: "DEMO FOTO — interiér restaurace Benar s dřevěným obložením a reflektory jeviště" },
      { src: "/images/hero-steak.svg", alt: "DEMO FOTO — hovězí steak s přílohou na talíři" },
      { src: "/images/hero-garden.svg", alt: "DEMO FOTO — letní zahrádka restaurace Benar" },
    ],
    bullets: [
      "Denní obědové menu každý všední den",
      "Zahrádka, dětský koutek a vlastní parkoviště",
      "V přízemí Docela velkého divadla",
    ],
    ctaButtons: [
      { label: "Denní menu", href: "#denni-menu" },
      { label: "Jídelní lístek", href: "/jidelni-listek" },
      { label: "Rezervovat stůl", href: "#rezervace" },
    ],
  },

  about: {
    teaser:
      "Restaurace Benar vaří poctivou českou kuchyni v srdci Litvínova už od roku 2004 — a je jediný podnik ve městě, kde si k obědu můžete dát i kousek divadla.",
    paragraphs: [
      "Restauraci Benar najdete v přízemí Docela velkého divadla na Rooseveltově ulici, kde funguje nepřetržitě od roku 2004. Za tu dobu se z ní stalo místo, kam Litvínované chodí na nedělní oběd s rodinou, na sklenku po práci i na firemní oslavu — a odkud si pravidelní hosté odnášejí spíš pocit \"jdeme k Benarovi\" než \"jdeme do restaurace\".",
      "Divadelní sousedství není jen adresa navíc. Restaurace sdílí s divadlem i malé jeviště v jídelním sále, a tak se občas stane, že si dáváte svíčkovou a o pár stolů dál právě probíhá zkouška nebo krátké představení. Je to kombinace, kterou v Litvínově nemá žádný jiný podnik — a přesně proto se za ní vyplatí přijít.",
      "V kuchyni vaříme klasiku, na kterou jsou lidé v okolí zvyklí a mají ji rádi — svíčkovou, guláš, řízek — ale rádi se pouštíme i do něčeho víc: pořádný hovězí steak nebo minutka z vepřové panenky u nás nejsou výjimkou, ale běžná součást lístku. Naše kuchyně tak sedí jak rodině, co si zajde na oběd, tak dvojici, co slaví výročí.",
      "K restauraci patří i zahrádka, dětský koutek pro nejmenší, vlastní parkoviště přímo u budovy a nekuřácký salonek pro rodinné oslavy nebo firemní akce. Snažíme se, aby byl u nás spokojený úplně každý — od dítěte po babičku, od hosta na rychlý oběd po skupinu na celý večer.",
    ],
    foundedYear: 2004,
    theatreConnection:
      "Restaurace sídlí v přízemí Docela velkého divadla a sdílí s ním i malé jeviště — občas se tu odehrává divadelní představení přímo mezi stoly.",
  },

  dailyMenu: {
    note: "Ukázkové menu — aktuální denní nabídku doplní restaurace",
    servedTime: "11:00–14:00",
    date: "vzorový všední den",
    soup: {
      name: "Květáková polévka",
      allergens: [1, 3, 7],
      price: 42,
    },
    mainDishes: [
      { number: 1, weight: "150 g", name: "Hovězí guláš, houskový knedlík", allergens: [1, 3, 7], price: 169 },
      { number: 2, weight: "120 g", name: "Vepřový řízek, bramborový salát", allergens: [1, 3, 7], price: 179 },
      { number: 3, weight: "300 g", name: "Kuřecí prsa na žampionech, dušená rýže", allergens: [1, 7], price: 165 },
      { number: 4, weight: "150 g", name: "Svíčková na smetaně, houskový knedlík", allergens: [1, 3, 7, 9], price: 185 },
      { number: 5, weight: "250 g", name: "Zapečené těstoviny se šunkou a sýrem", allergens: [1, 3, 7], price: 162 },
      { number: 6, weight: "200 g", name: "Grilovaný losos, bramborové pyré, špenát", allergens: [1, 4, 7], price: 189 },
      { number: 7, weight: "350 g", name: "Segedínský guláš, houskový knedlík", allergens: [1, 3, 7], price: 172 },
      { number: 8, weight: "200 g", name: "Smažený sýr hermelín, vařený brambor, tatarská omáčka", allergens: [1, 3, 7, 10], price: 160 },
    ] as MainDish[],
    orderNote: "Objednávky na dnešní menu přijímáme na tel.: 476 000 229",
  },

  // Přesně 6 highlights položek — vybrané ze stálého lístku, steakový profil zdůrazněn.
  highlights: [
    {
      name: "Hovězí roštěná steak, pepřová omáčka",
      weight: "200 g",
      price: 359,
      description: "Naše nejžádanější položka — vyzrálá roštěná z pánve, podávaná se šťouchaným bramborem.",
      image: { src: "/images/dish-steak.svg", alt: "DEMO FOTO — hovězí steak s pepřovou omáčkou" },
    },
    {
      name: "Minutka z vepřové panenky na slanině",
      weight: "180 g",
      price: 249,
      description: "Panenka zabalená do slaniny, restovaná zelenina, brambor na másle.",
      image: { src: "/images/dish-panenka.svg", alt: "DEMO FOTO — minutka z vepřové panenky na slanině" },
    },
    {
      name: "Grilovaný losos na bylinkovém másle",
      weight: "220 g",
      price: 329,
      description: "Čerstvý losos z grilu, sezónní zelenina, citronové máslo.",
      image: { src: "/images/dish-losos.svg", alt: "DEMO FOTO — grilovaný losos s bylinkovým máslem" },
    },
    {
      name: "Gnocchi se špenátem a gorgonzolou",
      weight: "300 g",
      price: 219,
      description: "Domácí bramborové noky, smetanová omáčka s gorgonzolou a špenátem.",
      image: { src: "/images/dish-gnocchi.svg", alt: "DEMO FOTO — gnocchi se špenátem a gorgonzolou" },
    },
    {
      name: "Smažený hermelín s brusinkami",
      weight: "150 g",
      price: 189,
      description: "Klasika, která nikdy nezklame — s domácí tatarkou nebo brusinkovým kompotem.",
      image: { src: "/images/dish-hermelin.svg", alt: "DEMO FOTO — smažený hermelín s brusinkami" },
    },
    {
      name: "Dětský řízek s bramborovou kaší",
      weight: "80 g",
      price: 129,
      description: "Menší porce pro nejmenší hosty, přesně podle jejich chuti k jídlu.",
      image: { src: "/images/dish-detske.svg", alt: "DEMO FOTO — dětský řízek s bramborovou kaší" },
    },
  ],

  // Stálý jídelní lístek — přesně 11 kategorií, celkem přesně 18 položek.
  fullMenu: {
    note: "Stálý lístek — bez alergenové tabulky (uvedena u denního menu); ceny orientační, aktuální ceník ověří restaurace.",
    categories: [
      {
        name: "Studené předkrmy",
        items: [
          { name: "Domácí paštika s brusinkami a toastem", weight: "100 g", price: 99 },
          { name: "Šunková rolka s křenovou pěnou", weight: "120 g", price: 89 },
        ],
      },
      {
        name: "Polévky",
        items: [
          { name: "Hovězí vývar se játrovými knedlíčky", weight: "0,33 l", price: 45 },
          { name: "Česneková s krutony a sýrem", weight: "0,33 l", price: 42 },
        ],
      },
      {
        name: "Teplé předkrmy",
        items: [
          { name: "Utopenec zapečený se sýrem", weight: "150 g", price: 79 },
        ],
      },
      {
        name: "Pokrmy z kuřecího masa",
        items: [
          { name: "Kuřecí prsa plněná žampiony a sýrem", weight: "200 g", price: 219 },
          { name: "Kuřecí křídla na medu a bylinkách", weight: "300 g", price: 199 },
        ],
      },
      {
        name: "Ryby",
        items: [
          { name: "Grilovaný losos na bylinkovém másle", weight: "220 g", price: 329 },
          { name: "Smažený kapr, bramborový salát", weight: "200 g", price: 239 },
        ],
      },
      {
        name: "Těstoviny a gnocchi",
        items: [
          { name: "Gnocchi se špenátem a gorgonzolou", weight: "300 g", price: 219 },
          { name: "Tagliatelle s kuřecím masem a sušenými rajčaty", weight: "320 g", price: 209 },
        ],
      },
      {
        name: "Sýry",
        items: [
          { name: "Smažený hermelín s brusinkami", weight: "150 g", price: 189 },
        ],
      },
      {
        name: "Dětská jídla",
        items: [
          { name: "Dětský řízek s bramborovou kaší", weight: "80 g", price: 129 },
          { name: "Špagety s rajčatovou omáčkou a sýrem", weight: "150 g", price: 99 },
        ],
      },
      {
        name: "Hovězí steaky a speciality",
        items: [
          { name: "Hovězí roštěná steak, pepřová omáčka", weight: "200 g", price: 359 },
          { name: "Rib-eye steak s grilovanou zeleninou", weight: "250 g", price: 449 },
        ],
      },
      {
        name: "Minutky z vepřové panenky",
        items: [
          { name: "Minutka z vepřové panenky na slanině", weight: "180 g", price: 249 },
        ],
      },
      {
        name: "Saláty",
        items: [
          { name: "Caesar salát s kuřecím masem", weight: "300 g", price: 199 },
        ],
      },
    ] as MenuCategory[],
  },

  gallery: {
    note: "Ukázkové fotografie — reálné foto interiéru a jídel dodá restaurace",
    images: [
      { src: "/images/gallery-01-interior.svg", alt: "DEMO FOTO — hlavní jídelní sál restaurace" },
      { src: "/images/gallery-02-stage.svg", alt: "DEMO FOTO — malé divadelní pódium v sále restaurace" },
      { src: "/images/gallery-03-garden.svg", alt: "DEMO FOTO — letní zahrádka s dřevěným posezením" },
      { src: "/images/gallery-04-steak.svg", alt: "DEMO FOTO — servírovaný hovězí steak" },
      { src: "/images/gallery-05-svickova.svg", alt: "DEMO FOTO — svíčková na smetaně s knedlíkem" },
      { src: "/images/gallery-06-bar.svg", alt: "DEMO FOTO — výčep a barový pult" },
      { src: "/images/gallery-07-salonek.svg", alt: "DEMO FOTO — nekuřácký salonek pro oslavy" },
      { src: "/images/gallery-08-detsky-koutek.svg", alt: "DEMO FOTO — dětský koutek v restauraci" },
      { src: "/images/gallery-09-dezert.svg", alt: "DEMO FOTO — domácí dezert dne" },
      { src: "/images/gallery-10-exterier.svg", alt: "DEMO FOTO — vstup do budovy divadla a restaurace" },
    ] as GalleryImage[],
  },

  // Přesně 3 demo recenze, fiktivní jména, parafráze reálného tónu hodnocení.
  reviews: [
    {
      name: "Petr K. (demo recenze)",
      text: "Chodíme sem na nedělní obědy už roky, svíčková je pokaždé skvělá a personál nás zná jménem. Kluci si užijí dětský koutek, my klid na kávu.",
      note: "parafráze typického tónu recenzí",
    },
    {
      name: "Jana S. (demo recenze)",
      text: "Dali jsme si steak na oslavu výročí a byl to jeden z nejlepších, co jsem v Litvínově jedla. Navíc ta atmosféra s divadlem vedle je fakt neotřelá.",
      note: "parafráze typického tónu recenzí",
    },
    {
      name: "Tomáš H. (demo recenze)",
      text: "Byli jsme na firemním obědě, obsluha byla rychlá a milá i na plný sál. Zahrádka v létě je bonus, určitě se vrátíme.",
      note: "parafráze typického tónu recenzí",
    },
  ] as Review[],

  ratingsSummary: {
    facebookRecommend: "92 %",
    facebookReviewCount: 63,
    tripadvisor: 4.2,
    firmyCz: 4.2,
    sourceNote: "Veřejně dostupné souhrnné hodnocení (Facebook/Tripadvisor/Firmy.cz), stav v době přípravy dema.",
  },

  // 1–2 ukázkové položky, volitelný blok díky divadelní vazbě.
  events: [
    {
      title: "Divadelní představení v restauraci",
      date: "termín bude upřesněn",
      description:
        "Několikrát do roka se v jídelním sále odehraje krátké představení Docela velkého divadla přímo mezi stoly — večeře s kulturním zážitkem navíc.",
      note: "Příklad — termíny doplní restaurace",
    },
    {
      title: "Ochutnávka steaků",
      date: "termín bude upřesněn",
      description: "Sezónní večer zaměřený na naše steakové speciality s degustačním menu.",
      note: "Příklad — termíny doplní restaurace",
    },
  ] as EventItem[],

  reservation: {
    mode: "phone_primary_plus_form" as const,
    phone: "476 000 229",
    intro:
      "Nejrychlejší cestou k jistému stolu je zavolat přímo do restaurace. Rádi ale vezmeme v potaz i rezervaci přes formulář níže.",
  },

  ordering: {
    enabled: false,
  },

  contact: {
    address: "Rooseveltova 279, 436 01 Litvínov",
    mapEmbedQuery: "Restaurace Benar, Rooseveltova 279, Litvínov",
    facebookUrl: "https://facebook.com/p/Restaurace-Benar-Litvínov-100063558610894",
    amenities: [
      "Wi-Fi zdarma",
      "Zahrádka",
      "Dětský koutek",
      "Parkoviště",
      "Nekuřácký salonek",
      "Platba kartou",
    ],
  },

  hours: {
    note: "Ukázkové otevírací hodiny — přesné údaje ověří restaurace",
    schedule: {
      mon: "11:00–22:00",
      tue: "11:00–22:00",
      wed: "11:00–22:00",
      thu: "11:00–22:00",
      fri: "11:00–23:00",
      sat: "11:00–23:00",
      sun: "11:00–22:00",
    },
    kitchenNote: "Kuchyně zavírá 30 minut před koncem otevírací doby",
  },

  demoNotice: {
    text:
      "Toto je ukázkový (demo) web vytvořený jako obchodní ukázka produktu. Fotografie jsou ilustrační, denní menu a recenze jsou vzorové. Finální web pro Restauraci Benar by obsahoval reálné fotografie a aktuální obsah dodaný restaurací.",
  },
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
