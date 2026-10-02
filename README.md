# Demo web — Restaurace Benar (Litvínov)

Statický jednostránkový web (+ 1 podstránka s plným jídelním lístkem) postavený
v [Astro](https://astro.build) jako **obchodní ukázka (demo) produktu „weby pro
lokální restaurace"**.

> **Toto NENÍ objednávka od restaurace Benar.** Jde o pilotní/demo implementaci
> postavenou na veřejně dostupných faktech o konkrétním existujícím podniku
> (Restaurace Benar, Rooseveltova 279, Litvínov), určenou k obchodní prezentaci
> majiteli — ne o finální placenou zakázku ani o web vytvořený na objednávku
> restaurace.

Datový model webu v [`src/data/site.config.ts`](src/data/site.config.ts) je
**konkrétní instancí sdílené obecné šablony „Hospoda"** z master dokumentu
produktové řady. Case-by-case úpravy obsahu pro Benar patří sem; jakékoli
změny obecného datového modelu (nová pole, přejmenování bloků apod.) patří do
master šablony, ne do tohoto souboru.

---

## Jak spustit (vývoj)

```sh
npm install
npm run dev
```

Dev server běží na `http://localhost:4321`.

## Produkční náhled

```sh
npm run build      # vygeneruje statický build do ./dist
npm run preview    # spustí lokální náhled produkčního buildu
```

## Testy

```sh
npm test           # spustí vitest (unit testy pro hours.ts a validaci formuláře)
```

Aktuální stav: **28/28 testů PASS** (2 test soubory — `hours.test.ts`,
`reservationValidation.test.ts`), `npm run build` proběhne bez chyby a
vygeneruje 2 statické stránky (`/index.html`, `/jidelni-listek/index.html`).

---

## Nasazení na Cloudflare Pages

Zveřejnění webu (založení GitHub repozitáře, push kódu a napojení na
Cloudflare Pages) se **neřeší ručně v sandboxu** — dělá se centrálně přes
JARVIS, který má jako jediný přístup k GitHub a Cloudflare tokenům.

### Nejjednodušší cesta: JARVIS → ZVEŘEJNIT

1. V aplikaci JARVIS: **VÍCE → NA POZADÍ** → u projektu „Demo Benar"
   kliknout na tlačítko **ZVEŘEJNIT**, nebo jednoduše říct JARVISovi
   *„Zveřejni web Benaru"*.
2. JARVIS sám:
   - uloží aktuální kód do **nového soukromého GitHub repozitáře**,
   - založí projekt na **Cloudflare Pages** a napojí ho na tento
     repozitář,
   - spustí build (`npm run build`, výstup `dist`) a nasazení,
   - vrátí veřejnou URL tvaru `https://<projekt>.pages.dev`.
3. **Podmínka:** Vlastimil musí mít (jednou, cca 15 minut) nastavené
   **GitHub token** a **Cloudflare token** ve **VÍCE → NASTAVENÍ → API →
   WEBY** (přesný postup je v `docs/weby-github-cloudflare.md`). Pokud
   ještě nejsou nastavené, JARVIS na to při pokusu o zveřejnění sám
   upozorní a nasazení nedokončí, dokud tokeny nebudou doplněné.

### Manuální alternativa (kdyby Vlastimil chtěl repo založit sám)

Pro úplnost, kdyby se nechtělo čekat na centrální mechanismus nebo šlo o
jednorázovou ruční kontrolu:

1. Založit nový repozitář na GitHubu (např. `demo-restaurace-benar`) a
   napushovat do něj obsah tohoto projektu (`git remote add origin ...`,
   `git push -u origin main`).
2. Přihlásit se na [dash.cloudflare.com](https://dash.cloudflare.com).
3. V levém menu **Workers & Pages → Create → Pages → Connect to Git**.
4. Vybrat právě založený GitHub repozitář.
5. Nastavit parametry buildu:
   - **Framework preset:** `Astro` (pokud je v nabídce; jinak `None` a
     nastavit ručně dle bodů níže)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node verze:** 18 nebo vyšší (dle `package.json` →
     `engines.node: ">=22.12.0"`; v Cloudflare Pages nastavit proměnnou
     prostředí `NODE_VERSION=22`, pokud build prostředí defaultně
     používá starší Node)
6. Kliknout **Save and Deploy**.

V obou případech (automatická cesta přes ZVEŘEJNIT i manuální alternativa)
musí **propojení GitHub↔Cloudflare a potvrzení prvního deploye nakonec
udělat/schválit Vlastimil sám, na svých vlastních účtech** — tým (JARVIS i
agenti) kód i kompletní postup připravili a otestovali, ale dokončit
autorizaci účtů a spuštění za Vlastimila nemohou.

### Aktuální stav nasazení

Živé demo zatím **není nasazené na veřejné URL** a **GitHub repozitář
zatím není založen na GitHub.com** — existuje jen lokální git repozitář
v sandboxu (inicializovaný, s commit historií, bez nastaveného
`git remote`). Založení repozitáře proběhne automaticky při kliknutí na
**ZVEŘEJNIT**, nebo manuálně podle postupu výše. Build je mezitím lokálně
ověřený a čistý (`npm run build` + `npm run preview` fungují, viz sekce
„Testy" výše).

- **Live URL demo:** _zatím nenasazeno — doplní se po zveřejnění přes JARVIS_
- **GitHub repo:** _zatím nezaloženo na GitHubu — založí se automaticky při
  kliknutí ZVEŘEJNIT, nebo manuálně dle postupu výše_
- **Platforma:** Cloudflare Pages (primární a doporučená volba)
- Verze Astro: `astro@7.3.5` (dle `package.json`)

### Alternativy k Cloudflare Pages (zmínka)

Pokud by se z nějakého důvodu Cloudflare Pages nehodilo, stejně dobře
poslouží i **Vercel** (`vercel deploy`, framework preset „Astro" se
detekuje automaticky) nebo **Netlify** (`netlify deploy`, build command
`npm run build`, publish directory `dist`) — jde o stejný typ statického
Astro buildu bez speciálních závislostí na konkrétní platformě. I tyto
alternativy by ale šly přes centrální JARVIS mechanismus (jiné tokeny),
ne ručně ze sandboxu.

Nouzový fallback: obsah `dist/` (po `npm run build`) lze nahrát na
jakýkoli static hosting (FTP, GitHub Pages, firemní webhosting) nebo jen
lokálně prohlédnout přes `npm run preview` / `npx serve dist`.
## Předpoklady

Toto jsou rozhodnutí učiněná v plánovací fázi projektu (bez konzultace s
restaurací, protože jde o demo, ne o zakázku). Jsou zde zapsaná kvůli
transparentnosti vůči komukoli, kdo bude web prezentovat nebo dál upravovat.

1. **Denní obědové menu** je realisticky vymyšlený **vzorový den** — reálný
   dnešní jídelníček nebyl v době přípravy strojově dostupný z menicka.cz.
   Obsahuje 1 polévku a přesně 8 číslovaných hlavních jídel, u každého
   gramáž, alergeny a cenu v rozmezí 160–190 Kč. Je označen poznámkou
   „aktuální denní nabídku doplní restaurace".
2. **Stálý jídelní lístek** je reprezentativní výběr **18 položek v 11
   kategoriích**, sestavený podle struktury kategorií uvedené na Firmy.cz.
   Názvy jídel a texty jsou vlastní formulace, ne kopie cizího obsahu.
3. **Galerie reálných fotografií — Google Drive přístup opraven, fotky
   úspěšně staženy a integrovány (9/9).** Odkaz od Vlastimila na reálné
   fotky restaurace (Google Drive složka,
   [`1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y`](https://drive.google.com/drive/folders/1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y))
   byl původně nastaven jako privátní a stažení se opakovaně nezdařilo (4
   nezávislé metody, viz dřívější log v
   [`docs/google-drive-download-attempt.md`](docs/google-drive-download-attempt.md),
   commit `893f2a6`, pro historii). **Vlastimil sdílení opravil na
   „Komukoli s odkazem"** a v navazujícím běhu se podařilo stáhnout
   **všech 9 fotek ze složky úspěšně**.

   Fotky byly zpracovány a zapojeny do webu:
   - Každá z **9 fotek** je uložena ve dvou formátech (**WebP** + **JPEG
     fallback**) a dvou velikostech (**800 px** pro galerii, **1600 px**
     pro případné zvětšení/retina), vše v `public/images/benar/
     gallery-1…9-{800,1600}.{webp,jpg}`.
   - Jedna z fotek je navíc zpracována zvlášť jako **hero pozadí**
     (`public/images/benar/hero-{960,1920}.{webp,jpg}`) a použita v
     `Hero.astro`.
   - `src/components/Gallery.astro` i `Hero.astro` vykreslují
     `<picture><source type="image/webp">…<img loading="lazy">` — moderní
     prohlížeče dostanou WebP, starší automaticky JPEG fallback.
   - Datový model `GalleryImage` (`src/data/site.config.ts`) pro to má
     pole `webp?` + `jpg?` (dvojice pro `<picture>`) vedle staršího
     `src?` (fallback pro jediný zdroj) a povinné `alt`.
   - `gallery.note` v `site.config.ts` byl upraven na pravdivý text o
     reálných fotografiích (už needeklaruje „ukázkové"/„AI" fotky).
   - Staré SVG placeholdery (`gallery-01-interior.svg` …
     `gallery-10-exterier.svg`) byly nahrazeny a přesunuty do archivu
     (nejsou už součástí aktivní galerie).

   **Výběr, pořadí a pojmenování fotek (`gallery-1` … `gallery-9`) je
   čistě automatické** — podle pořadí staženého z Drive složky, **bez
   jakékoli ruční vizuální kurace obsahu** (tzn. nikdo fotky neprocházel
   a netřídil podle toho, co přesně zobrazují — interiér, jídlo, exteriér
   apod.). Alt texty jsou proto zatím obecné („Restaurace Benar —
   fotografie prostoru"). **Doporučení pro Vlastimila:** pokud bude chtít
   přesnější popisky nebo logičtější pořadí (např. nejprve interiér, pak
   jídlo, pak zahrádka), stačí volitelně později fotky podle skutečného
   obsahu přejmenovat/přeuspořádat a upravit odpovídající `alt` texty v
   `gallery.images` — žádný zásah do komponent ani datového typu není
   potřeba.

4. **Recenze hostů** jsou 3 fiktivní demo-citace v duchu reálného tónu
   veřejných hodnocení podniku (ne kopie skutečných recenzí), označené jako
   „ukázkové reference". Číselná hodnocení (92 % doporučení na Facebooku,
   4,2/5 na Tripadvisoru/Firmy.cz) jsou naopak reálná, veřejně dohledatelná
   fakta a jsou takto v obsahu i uvedena.
5. **Rezervační formulář** pouze validuje vstup a simuluje odeslání (zobrazí
   success stav) — **bez reálného backendu či e-mailového doručení**.
   Napojení na reálný rezervační systém/e-mail je mimo rozsah tohoto
   pilota/MVP.
6. **Adresa** (Rooseveltova 279, Litvínov), **telefon** (476 000 229) a odkaz
   na **Facebook** jsou reálné, veřejně dostupné kontaktní údaje podniku.
   Jsou použity záměrně, protože jde o demo konkrétního podniku připravené
   k obchodní ukázce jemu samotnému.
7. **Otevírací doba** (Po–Čt 11:00–22:00, Pá–So 11:00–23:00, Ne 11:00–22:00)
   je realistický ukázkový základ vycházející z dostupných zdrojů, s
   poznámkou „ověří restaurace".
8. **Nasazení**: primárně Cloudflare Pages (viz sekce „Nasazení na Cloudflare Pages" výše);
   Vercel/Netlify zůstávají jako rovnocenná alternativa, fallback je
   lokální/zip balíček `dist/` po `npm run build`.
9. **Jazyk** webu je pouze čeština — vícejazyčnost je mimo rozsah MVP.
10. **IČO/DIČ** v patičce záměrně chybí — nebylo v rámci přípravy dema
    ověřeno. Doplní se až při reálném onboardingu klienta, pokud by z dema
    vznikla skutečná zakázka.
11. **Galerie** je sekcí na hlavní stránce (ne samostatná podstránka) — MVP se
    drží záměrně štíhlé. Jedinou podstránkou je plný jídelní lístek na
    `/jidelni-listek`.
12. **Meta tagy `noindex, nofollow`**: web má v `<head>` nastaveno
    `noindex, nofollow`, protože jde o neveřejné obchodní demo, ne o ostrý
    web restaurace. To je úmyslné a správné pro tuto fázi — při případném
    přechodu na ostrý produkční web je nutné je odstranit/změnit (viz sekce
    „Přechod z dema na ostrý web" níže).
13. **GitHub repozitář a Cloudflare Pages čekají na centrální JARVIS
    mechanismus, ne na manuální krok v sandboxu.** Projekt má lokálně
    inicializovaný git (`git init`, commit historie existuje), ale **nemá
    nastavený žádný `git remote`** — založení repozitáře
    `demo-restaurace-benar` na GitHubu, push kódu a navazující Cloudflare
    Pages deploy se řeší centrálně přes JARVIS (GitHub i Cloudflare tokeny
    jsou výhradně na serveru JARVISe, agenti v sandboxu k nim nemají
    přístup — viz sekce „Nasazení na Cloudflare Pages" výše).

    Řešení: ve VÍCE → NA POZADÍ kliknout na **ZVEŘEJNIT** u tohoto
    projektu, nebo požádat *„Zveřejni web Benaru"*. JARVIS pak sám založí
    repozitář, pushne kód a spustí Cloudflare Pages build.

    Dokud toto nenastane, zůstává napojení na Cloudflare Pages odloženo,
    protože Cloudflare Pages (primární cesta nasazení) vyžaduje propojený
    GitHub repozitář jako zdroj buildu. Veškerý kód je mezitím hotový,
    otestovaný (28/28 testů) a buildovatelný (`npm run build` čistě
    projde) — čeká jen na spuštění zveřejnění.

---

## Struktura projektu

```text
/
├── src/
│   ├── data/site.config.ts     # veškerý obsah webu (instance šablony „Hospoda")
│   ├── components/              # Hero, About, DailyMenu, FullMenu, Gallery,
│   │                             # Reviews, ReservationForm, HoursBadge,
│   │                             # HoursTable, ContactMap, Footer, …
│   ├── layouts/                 # BaseLayout
│   ├── pages/
│   │   ├── index.astro          # hlavní jednostránkový web se všemi sekcemi
│   │   └── jidelni-listek.astro # jediná podstránka — plný stálý lístek
│   └── utils/
│       ├── hours.ts             # výpočet aktuálního stavu otevírací doby
│       └── reservationValidation.ts
├── public/images/
│   ├── benar/                    # reálné fotografie restaurace Benar
│   │                             # (hero + galerie, WebP+JPEG, 800/1600 px)
│   └── dish-*.svg                # ilustrační SVG ikony jednotlivých jídel
│                                 # v denním menu (nejde o fotografie)
└── dist/                        # produkční build (generováno, negenerovat ručně)
```

## Technologie

- **Astro** — statický build, žádný server/databáze
- Čisté CSS s design tokeny (barevná paleta a typografie šablony „Hospoda")
- **Vitest** — unit testy pro logiku otevírací doby a validaci rezervačního
  formuláře

---

## Přechod z dema na ostrý web

- [x] ~~Nahradit DEMO/placeholder fotografie reálnými~~ — hotovo: galerie
      i hero teď používají 9 reálných fotek restaurace Benar
      (`public/images/benar/`, WebP+JPEG, 800/1600 px) — viz sekce
      „Předpoklady" bod 3. Volitelně zbývá jen přejmenovat/setřídit fotky
      podle skutečného obsahu a doladit `alt` texty, pokud bude
      Vlastimil chtít přesnější popisky než obecné „fotografie prostoru".
- [ ] Nahradit fiktivní demo-recenze (3 citace) reálnými recenzemi hostů,
      nebo sekci zcela odstranit, pokud klient nedodá souhlas s jejich
      zveřejněním
- [ ] Ověřit a nahradit vzorové denní menu reálným, průběžně aktualizovaným
      obsahem (ideálně navázat na proces, jakým restaurace menu aktualizuje —
      ruční úprava `site.config.ts` nebo budoucí CMS/admin rozhraní)
- [ ] Ověřit/doplnit stálý jídelní lístek s restaurací (ceny, názvy,
      alergeny)
- [ ] Ověřit otevírací dobu přímo s restaurací
- [ ] Odstranit nebo upravit meta tagy `noindex, nofollow` na standardní
      indexování (SEO), jakmile je web schválen ke zveřejnění
- [ ] Doplnit IČO/DIČ do patičky, pokud je vyžadováno
- [ ] Napojit rezervační formulář na reálné doručení (e-mail/backend/
      rezervační systém)
- [ ] Zvážit vlastní doménu místo `*.pages.dev` (Cloudflare Pages podporuje
      custom domény zdarma)
