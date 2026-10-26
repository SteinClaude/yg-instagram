# De platen bouwen

Hier staat waar elke plaat vandaan komt. De gerenderde JPEG's die Instagram
ophaalt staan in `../beeld`; die maak je hier.

## Bouwen

    node platen/voorraad.cjs      de 52 verhalen en 26 losse berichtplaten
    node platen/maak.cjs          de 24 uitgewerkte berichtplaten
    node platen/extra.cjs         highlight-omslagen en lege achtergronden

Alles komt in `platen/uit/` (Nederlands) en `platen/uit/en/` (Engels). Die map
staat niet in git: het is het resultaat, niet de bron.

Daarna naar JPEG voor de automaat:

    node gereedschap/klaarzetten.cjs

## Waar wat staat

| Bestand | Wat erin staat |
|---|---|
| `voorraad.cjs` | de 26 verhaalplaten en 13 losse berichtplaten, per taal |
| `berichten.cjs` | de 12 uitgewerkte berichten, Nederlands |
| `berichten-en.cjs` | dezelfde twaalf, Engels |
| `bijschriften-en.cjs` | de Engelse bijschriften (Nederlandse staan in `../teksten`) |
| `blokken.cjs` | gedeelde bouwstenen: sfeerlagen en het poortembleem |
| `maak.cjs` | de tekenmachine zelf: letters naar paden, SVG naar PNG |
| `extra.cjs` | omslagen voor highlights en lege achtergronden |
| `bron/pexels/` | 39 branchefoto's, met `branches.json` als register |
| `fonts/` | Playfair Display en Montserrat, allebei open licentie |

## Wat er buiten deze map nodig is

Sinds 26 oktober 2026 (branch `cloud-gereedschap`) staan de pakketten gewoon in
`package.json` van de hoofdmap: `opentype.js`, `@resvg/resvg-js`, `sharp` en
`playwright-core`. Eén keer `npm install` in de hoofdmap, op de pc én in de
cloud; `node_modules/` blijft buiten git. Er wordt niets meer geleend uit een
andere map, en er staan geen pc-paden meer in de scripts.

Schermafdrukken (`gereedschap/raster-preview.cjs`, `schermfoto.cjs`,
`opname.cjs` en de `maak-*.cjs` in `pakketten/*/bron/`) starten de browser via
`gereedschap/browser.cjs`: eerst de Chromium die bij `playwright-core` hoort
(in de cloud klaargezet via `PLAYWRIGHT_BROWSERS_PATH`; de versie van
`playwright-core` in `package.json` hoort bij die browser, dus niet zomaar
verhogen), anders de geïnstalleerde Google Chrome (zoals op de pc).
Lettertypen komen uit `platen/fonts/`, altijd relatief aan het script.

Wat alleen op de pc kan: echte schermafdrukken van de live site met een
ingelogde browser (`studio-opname.cjs`), nieuwe Pexels-foto's ophalen en het
Windows-lettertype Bodoni MT in de nagebouwde klantsites (K02/K03); in de cloud
valt dat terug op een standaardletter.

## Let op bij het wijzigen

- **Prijzen staan op 21 platen.** Ze komen uit `W.nl.sub` / `W.en.sub` en
  `prijsOnder` bovenin `voorraad.cjs`, uit het prijsblok van V02, en uit het
  prijsblok in `berichten.cjs` / `berichten-en.cjs`. Verander je er een,
  verander ze dan allemaal en reken het btw-bedrag mee om.
- **Na renderen altijd opnieuw omzetten** met `gereedschap/klaarzetten.cjs`,
  anders plaatst de automaat nog de oude plaat.
- De tekenmachine schaalt tekst automatisch kleiner tot het past (het vierkante
  formaat is krap). Ziet een plaat er raar uit, kijk dan eerst of de kop te
  lang is.
