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

Položky menu (`MainDish` pro denní menu, `MenuItem` pro stálý lístek) mají
nově volitelné pole `image?: { src, alt }` s ilustračním obrázkem jídla —
pokud položka pole nemá, zobrazí se beze změny jako dřív (bez obrázku).

---

## Redesign v2 (návrh, aditivní)

Nový design je samostatná stránka `src/pages/redesign/index.astro` se stylopisem
`src/styles/redesign.css`; stávající `/` ani `/jidelni-listek` se nezměnily.
Zaměnit `/` za redesign vyžaduje schválení Vlastimila (NEEDS_APPROVAL).

- Spuštění: `npm install && npm run dev`, pak `http://localhost:4321/redesign/`.
- Statický náhled: `npm run build:preview` (astro build + `scripts/make-preview.mjs` → `.jarvis-preview/`).
- Testy: `npm test` (beze změny, logika nedotčena).
- **Pozn.:** v běhu, který redesign vytvořil, nebylo povoleno spustit npm, takže
  `npm test`/`astro build` neproběhly a `.jarvis-preview/index.html` je sestaven ručně
  podle stránky; po `npm run build:preview` se přepíše skutečným buildem.
- Chybí: AI fotografie jídel (nástroj nebyl k dispozici; použity reálné fotky a stávající SVG ilustrace),
  oficiální odkaz na menu (odkaz vede na vzorový lístek), ověřená otevírací doba, ověřené menu a ceny.

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

## Testy a build

```sh
npm test            # spustí vitest (unit testy pro hours.ts a validaci formuláře)
npm run build        # vygeneruje statický build do ./dist
```

**Ověřeno 2026-10-02:**
- `npm test` → **28/28 testů PASS** (2 test soubory — `hours.test.ts` s 18
  testy, `reservationValidation.test.ts` s 10 testy).
- `npm run build` → proběhne **bez chyby**, vygeneruje 2 statické stránky
  (`/index.html`, `/jidelni-listek/index.html`) do `dist/`.

---

## Zveřejnění webu

Tento projekt je připravený k zveřejnění přes JARVIS: stačí ve **VÍCE → NA
POZADÍ** u tohoto projektu kliknout **ZVEŘEJNIT** (nebo říct JARVISovi
„Zveřejni web Benaru"). JARVIS sám:

- uloží aktuální kód do soukromého GitHub repozitáře (organizace týmu),
- založí Cloudflare Pages projekt propojený s tím repozitářem,
- vrátí veřejný odkaz ve tvaru `https://<projekt>.pages.dev`.

Build nastavení pro Cloudflare Pages (pro referenci, JARVIS je nastaví sám):

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Framework preset:** `Astro`

**Podmínka:** ve **VÍCE → NASTAVENÍ → API** musí mít Vlastimil jednorázově
vyplněné GitHub a Cloudflare tokeny (skupina WEBY) — pokud ještě nejsou,
JARVIS při pokusu o zveřejnění řekne, co chybí.

---

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
3. **Galerie reálných fotografií — ověřeno a opraveno, fotky jsou skutečně
   reálné (1 hero + 9 galerie).** Odkaz od Vlastimila
   ([`1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y`](https://drive.google.com/drive/folders/1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y))
   nevedl přímo na fotky restaurace, ale na JARVIS mirror složku
   „weby-pro-restaurace". Procházením stromu této složky byla nalezena
   podsložka **`Benar/06_foto`** obsahující **16 reálných fotografií
   restaurace a okolí (Litvínov, Krušné hory)**. Konkrétně jde o soubory
   **`IMG_8493.JPG` až `IMG_8501.JPG`** (9 fotek), staženo přes konkrétní
   Google Drive file ID každého souboru, nezávisle ověřeno **MD5 shodou**
   mezi dvěma oddělenými staženími a kontrolou `file` (magic bytes) na
   skutečný `JPEG image data` (ne login-wall HTML stránka).
   Z nich bylo vybráno **1 (hero) + 9 (galerie)**, optimalizováno (WebP +
   JPEG fallback, responzivní šířky) a nasazeno do webu.

   **Oficiální auditní záznam** (stručné shrnutí ověření, metoda, žádný
   login wall, shoda poměru stran) je v
   [`docs/foto-puvod-overeni.md`](docs/foto-puvod-overeni.md).
   **Plný důkazní záznam** (folder ID, všech 9 file ID, postup ověření,
   MD5 hashe, mapování na výstupní soubory) je zapsaný v samostatném
   dokumentu [`docs/drive-photo-verification.md`](docs/drive-photo-verification.md).

   **Oprava dřívějšího nepravdivého tvrzení:** starší commit v historii
   repozitáře tvrdil, že fotky byly staženy přímo z Drive odkazu ze
   zadání, aniž by to bylo doloženo logem nebo skriptem stažení. Tento
   nesoulad byl zjištěn při nezávislé kontrole (tester) a nyní je
   napraven — fotky použité na webu pocházejí prokazatelně ze správné
   podsložky `Benar/06_foto` a jsou skutečně reálné fotografie restaurace.

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

   **Obrázky jídel v denním menu a stálém lístku jsou ilustrační SVG
   placeholdery** (`public/images/jidelni-listek/`), ne reálné fotky
   konkrétních pokrmů Benaru — stejně jako u fotek restaurace výše, šlo o
   dostupnou náhradu kvůli nedostupnosti AI image-gen nástroje v sandboxu;
   až bude k dispozici reálné fotodokumentace jídel, stačí je nahradit a
   doplnit `image.src`/`alt` u příslušných položek v `site.config.ts`.

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
8. **Nasazení**: přes JARVIS mechanismus „ZVEŘEJNIT" na Cloudflare Pages (viz
   sekce „Zveřejnění webu" výše); fallback je lokální/zip balíček `dist/`
   po `npm run build`.
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
13. **GitHub repozitář a Cloudflare Pages zatím nejsou založené** — to má na
    starosti JARVIS v okamžiku zveřejnění (viz sekce „Zveřejnění webu"
    výše), ne tým v sandboxu. Lokální git historie je mezitím kompletní,
    commitnutá a `git status` čistý; kód je otestovaný (28/28 testů) a
    buildovatelný (`npm run build` bez chyby) — je tedy plně připravený
    k zveřejnění přes JARVIS.

---

## Optimalizace obrázků

Cílové velikosti po kompresi: **< 60 kB** pro galerii @800px a **< 150 kB**
pro hero @1600/1920px (WebP jako primární formát, JPEG jako fallback pro
starší prohlížeče, obojí v responzivním `srcset`).

**Výsledek:** většina souborů cíl splňuje (např. `gallery-1-800.webp` 44 kB,
`gallery-9-800.webp` 48 kB, `hero-960.webp` 56 kB). U fotek s vysokým
detailem/texturou (jídlo zblízka, interiér s mnoha hranami a vzory —
`gallery-5`, `gallery-6`, `gallery-7`, `gallery-8`) zůstává WebP i po
agresivní kompresi o něco nad cílem, cca **84–160 kB**, a JPEG fallback
pak logicky ještě o kus výš (nad 150 kB u `hero-1920.jpg` a u `gallery-7/8`
přes 200 kB). Kvalita byla při kompresi ověřena měřením **PSNR > 29 dB**
(žádná viditelná ztráta kvality) — další ruční doladění komprese by zde už
jen degradovalo viditelnou kvalitu bez reálného přínosu ve velikosti,
protože jde o **fyzický limit obsahu** (množství detailu ve fotce), ne o
opomenutí nebo špatně zvolenou kompresní metodu.

Praktický dopad: moderní prohlížeče (naprostá většina návštěvníků) stáhnou
menší WebP variantu přes `<picture>`/`srcset`; JPEG fallback se použije jen
u starších prohlížečů bez WebP podpory. Celková velikost `public/images/benar/`
je cca 3 MB pro 24 souborů (1 hero + 9 fotek galerie, každá ve 2 formátech
a případně 2 šířkách) — pro webovou prezentaci restaurace v pořádku.

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
│   ├── benar/                    # reálné fotografie restaurace Benar,
│   │                             # optimalizované (hero + galerie,
│   │                             # formáty WebP + JPEG fallback, 800/1600 px)
│   └── jidelni-listek/           # ilustrační SVG obrázky jídel (denní menu
│                                 # i stálý lístek) — nejde o fotografie
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
