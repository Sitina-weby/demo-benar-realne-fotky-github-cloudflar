# Restaurace Benar — redesign webu (demo)

Statický web v Astro 7 + Tailwind 4. Veškerý obsah je v `src/data/site.config.ts`.
Nejde o oficiální web restaurace, je to ukázkový redesign (`noindex`).

## Spuštění

```sh
npm ci
npm run dev       # vývojový server
npm run build     # statický výstup do dist/
npm test          # Vitest (hours.ts, reservationValidation.ts, kontrola obsahu configu)
```

Nasazení (Cloudflare Pages / jiný statický hosting): build `npm run build`, výstup `dist/`.
Nasazení tímto repem neprovádí — schvaluje Vlastimil.

## Co redesign změnil

- Nový vzhled: celostránkové hero s fotkou, průhledná hlavička s navigací, dvousloupcová sekce „O nás“,
  tmavý pruh s odkazem na jídelní lístek, mozaiková galerie, kontakt s mapou, mobilní lepicí lišta.
- Odstraněn **veškerý dříve vymyšlený obsah**: denní menu, jídla a ceny, otevírací doba, recenze,
  hodnocení, akce, demo rezervační formulář, SVG „DEMO FOTO“ ilustrace jídel.
- Použité údaje: název, adresa, telefon, Facebook, rok 2004, sídlo v přízemí Docela velkého divadla,
  vybavení (zahrádka, dětský koutek, parkoviště, nekuřácký salonek) — převzato z podkladů projektu.
- Fotky: reálné fotografie restaurace z Google Drive (`public/images/benar/`, původ viz `docs/foto-puvod-overeni.md`).

## Chybí / doplní klient (nic nebylo hádáno)

| Údaj | Stav |
| --- | --- |
| Odkaz na jídelní lístek | Ověřená URL nebyla k dispozici. Web má stránku `/jidelni-listek` s vyznačením „doplní klient“. Po dodání URL/PDF stačí nastavit `menu.url` v `site.config.ts` — všechna tlačítka pak povedou přímo na něj. |
| Denní menu, jídla, ceny | doplní klient |
| Otevírací doba | doplní klient (kód `src/utils/hours.ts` zůstal pro budoucí použití) |
| E-mail | doplní klient |
| Ilustrační AI fotky jídel | **BLOCKED** — v tomto běhu nebyl dostupný nástroj pro generování obrázků ani větev `jarvis/assets-dev_ef3f536f385cc221a1bb8855`. Po dodání dát do `public/images/ai/` a použít `gallery.aiNote` v configu pro označení „ilustrační AI foto“. |
| Inspirace webem Srdcovka | Web nebyl v tomto běhu dostupný (síť/WebFetch zamítnuty); redesign je tedy jen obecně editorial styl, nikoli ověřená kopie jeho vzhledu. |

## Ověření v tomto běhu

`npm ci`, `npm run build` a `npm test` **nebyly spuštěny** (příkazy npm vyžadovaly schválení, které nebylo uděleno).
Adresář `.jarvis-preview/` proto nevznikl. Před mergem spusťte build a testy lokálně nebo v CI.
