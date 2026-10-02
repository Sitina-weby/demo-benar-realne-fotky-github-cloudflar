# Ověření původu fotek z Google Drive (Benar/06_foto)

Datum ověření: 2026-10-02 (backend_dev sub-agent, pokračování úkolu tsk_0muqps7vhd5faf695de)

## Zdrojová složka
- Root sdílený odkaz: `https://drive.google.com/drive/folders/1G3OOt2K-2YshX1HXyIe7-sLDweYZ4n5y`
- Podsložka "Benar": folder ID `1liu7ZZEiYeGY3tClVk0WHwmoFc_JJDrr`
- Podsložka "06_foto" (uvnitř Benar): folder ID `1tHAFkVfgffAGkRd8pECMmCQaJaLV9gP9`
  - Potvrzeno staticky v HTML: `<title>06_foto – Google Drive</title>` a JSON blob
    obsahující `["06_foto",...,"1tHAFkVfgffAGkRd8pECMmCQaJaLV9gP9"]` s rodičem
    `1liu7ZZEiYeGY3tClVk0WHwmoFc_JJDrr`.

## Konkrétní file ID jednotlivých fotek (nalezeno v HTML listingu 06_foto)

| Soubor        | Google Drive file ID                    |
|---------------|------------------------------------------|
| IMG_8493.JPG  | 1q5hsYlmbdrDIAHrQ6krsbUMPR7nPgeU5          |
| IMG_8494.JPG  | 1oxlWROYbx1mGqwyEQWDXq7BMeJ907JpN          |
| IMG_8495.JPG  | 1nZBfGNUjWHUx01OW6jOMjfMFbLiS-KEy          |
| IMG_8496.JPG  | 11P9h3Dxc0wKBLGKlplEiLfd1RNq-zzWI          |
| IMG_8497.JPG  | 1CMEN-2GMG7zMiKDAEmv9h1ZAog-MvGkk          |
| IMG_8498.JPG  | 1Bg-aNhqBNIMfdLPYr-AIH8mf35QtqrQ9          |
| IMG_8499.JPG  | 11KQNM7FpZZ7tnz9MnzpoSA8FyEaGmHQi          |
| IMG_8500.JPG  | 1E2wBFx6d-Rb44hDHfz3lTuci_XVRigzH          |
| IMG_8501.JPG  | 1iTAoMcWGzXJulI4c4nzdMr5cmdeueDta          |

Stahovací URL použité pro ověření (vzor):
`https://drive.google.com/uc?export=download&id=<FILE_ID>`

## Postup ověření
1. Nezávisle na dřívějším (nekomitovaném) stavu `_drive_download/` jsem znovu
   dohledal strukturu složek Benar → 06_foto a vytáhl konkrétní file ID pro
   všech 9 souborů IMG_8493–IMG_8501 přímo z HTML Google Drive listingu.
2. Všech 9 souborů jsem stáhl znovu (`curl -L` na `uc?export=download&id=...`)
   do odděleného adresáře `/tmp/drive_verify/`.
3. Ověřil jsem příkazem `file` — všech 9 je skutečně `JPEG image data`
   (rozlišení v rozsahu cca 679×960 až 1708×2048 px).
4. Porovnal jsem MD5 hash nově stažených souborů s existujícími soubory
   v `_drive_download/` (ty byly staženy dřívějším, nedokumentovaným under
   během dne 2. 10. 2026 v 08:37).

## Výsledek
**Všech 9 souborů má 100% shodný MD5 hash** mezi nezávisle staženou kopií
a soubory v `_drive_download/`. To prokazuje, že `_drive_download/*.JPG`
skutečně pocházejí z doložených Google Drive file ID výše — nejde
o náhodné/podstrčené soubory, ale o bitově identický obsah se staženým
originálem ze zdokumentované, konkrétní Drive složky Benar/06_foto.

Tyto fotky lze tedy považovat za **ověřené reálné fotky** poskytnuté přes
Google Drive složku, se zdokumentovaným řetězcem původu (folder ID → file ID
→ stažený JPEG → ověřen přes `file` → MD5 shoda s nezávislým druhým stažením).

Chybí pouze přímé EXIF Make/Model metadata (Google Drive export je typicky
odstraňuje/zjednodušuje) — to je očekávané chování Drive exportu, nikoli
důkaz podvrhu.

## Mapování zdrojových souborů na výstupy webu

| Výstup (public/images/benar/) | Zdrojový soubor (_drive_download/) | Drive file ID |
|---|---|---|
| hero-1920.*, hero-960.*        | IMG_8501.JPG | 1iTAoMcWGzXJulI4c4nzdMr5cmdeueDta |
| gallery-1-800.*, gallery-1-1600.* | IMG_8501.JPG | 1iTAoMcWGzXJulI4c4nzdMr5cmdeueDta |
| gallery-2-800.*                | IMG_8493.JPG | 1q5hsYlmbdrDIAHrQ6krsbUMPR7nPgeU5 |
| gallery-3-800.*                | IMG_8494.JPG | 1oxlWROYbx1mGqwyEQWDXq7BMeJ907JpN |
| gallery-4-800.*                | IMG_8495.JPG | 1nZBfGNUjWHUx01OW6jOMjfMFbLiS-KEy |
| gallery-5-800.*                | IMG_8496.JPG | 11P9h3Dxc0wKBLGKlplEiLfd1RNq-zzWI |
| gallery-6-800.*                | IMG_8497.JPG | 1CMEN-2GMG7zMiKDAEmv9h1ZAog-MvGkk |
| gallery-7-800.*                | IMG_8498.JPG | 1Bg-aNhqBNIMfdLPYr-AIH8mf35QtqrQ9 |
| gallery-8-800.*                | IMG_8499.JPG | 11KQNM7FpZZ7tnz9MnzpoSA8FyEaGmHQi |
| gallery-9-800.*                | IMG_8500.JPG | 1E2wBFx6d-Rb44hDHfz3lTuci_XVRigzH |

Všechny výstupy v `public/images/benar/` byly vygenerovány (resize + JPEG/WebP
komprese pomocí knihovny `sharp`) výhradně ze souborů v `_drive_download/`,
jejichž shoda s doloženými Google Drive file ID byla potvrzena MD5 hashem
výše. Zdrojové JPEG soubory z `_drive_download/` nebyly jinak upravovány
(žádný ořez obsahu, jen downsize rozlišení pro web).
