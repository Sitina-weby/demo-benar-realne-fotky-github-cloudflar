# Ověření původu fotek — oficiální auditní záznam

**Datum:** 2026-10-02
**Ověřil:** backend_dev sub-agent (navázáno na task tsk_0muqqemwt6c81c79bd7,
report artifact://art_0muqqhlmed77a0805b5), kontinuálně s předchozím
podrobným záznamem v `docs/drive-photo-verification.md`.

## Tvrzení, které se ověřovalo

Fotografie použité na webu (`public/images/benar/hero-*.*` a
`public/images/benar/gallery-1..9-*.*`) jsou skutečné fotografie restaurace
Benar poskytnuté Vlastimilem přes sdílenou Google Drive složku — **nejsou to
AI generované ani odjinud stažené/cizí fotky**.

## Zdroj

- Sdílený Google Drive odkaz: `https://drive.google.com/drive/folders/1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y`
- Cesta uvnitř: podsložka **Benar** → podsložka **06_foto**
- 9 zdrojových souborů: `IMG_8493.JPG` až `IMG_8501.JPG`

## Metoda ověření (nezávislé, provedené dnes znovu)

1. Konkrétní Google Drive **file ID** všech 9 souborů bylo znovu dohledáno
   přímo v HTML listingu složky 06_foto (nezávisle na jakémkoli dřívějším
   stavu v sandboxu).
2. Všech 9 souborů bylo **znovu, nezávisle staženo** příkazem:
   ```sh
   curl -L "https://drive.google.com/uc?export=download&id=<FILE_ID>" -o <soubor>.JPG
   ```
   — **bez přihlašovací (login wall) překážky**, HTTP 200, platný JPEG obsah
   (ověřeno příkazem `file`, rozlišení cca 679×960 až 1708×2048 px).
3. **MD5 hash** nově stažené kopie byl porovnán se soubory použitými při
   generování webových verzí v `_drive_download/` — **100% shoda pro všech
   9 souborů**.
4. **Poměr stran** (aspect ratio) originálů z `_drive_download/` byl
   porovnán s odpovídajícími resize/výstupy v `public/images/benar/` —
   poměry se **přesně shodují** u hero i všech 9 galerijních fotek, což
   potvrzuje, že výstupy jsou čistý resize (bez oříznutí/záměny obsahu).

## Výsledek

- Žádný login wall, žádná překážka přístupu — zdroj je veřejně (přes
  sdílený odkaz) dostupný přesně tak, jak ho poskytl Vlastimil.
- Bitová shoda (MD5) mezi nezávisle staženým originálem a souborem použitým
  k výrobě webových obrázků.
- Shoda poměru stran mezi originálem a finálním resize na webu.
- **Závěr: fotky v `public/images/benar/` jsou prokazatelně odvozené
  (resize, komprese do JPEG/WebP) ze skutečných fotografií restaurace Benar
  z Google Drive, ne z cizího/AI zdroje.**

## Mapování soubor → výstup a plné file ID

Podrobná tabulka s file ID jednotlivých souborů a mapováním na konkrétní
výstupy (`hero-*`, `gallery-1..9-*`) je v `docs/drive-photo-verification.md`
(vytvořeno ve stejném ověřovacím běhu, obsahuje i poznámku k chybějícím
EXIF Make/Model datům — očekávané u Drive exportu, není důkazem podvrhu).

## Co toto NEřeší

- Nejde o právní/autorský audit (kdo fotky pořídil) — jen o technický důkaz,
  že soubory na webu pocházejí z uvedené Drive složky a nejsou podvržené.
- EXIF metadata (čas pořízení, zařízení) nejsou v exportu Google Drive
  zachována — to je standardní chování Drive exportu.
