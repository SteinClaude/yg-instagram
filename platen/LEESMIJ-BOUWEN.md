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

Twee pakketten die niet in deze repo zitten, omdat we hem zonder `npm install`
willen houden. Ze worden geleend uit de websitemap ernaast:

- `C:/Users/gijsm/yg-luxury/brand/node_modules/opentype.js`
- `C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js`
- `C:/Users/gijsm/yg-luxury/node_modules/sharp`

Staat die map ergens anders, dan moet je die drie paden aanpassen in
`maak.cjs` en `extra.cjs`. Verder heeft deze map geen afhankelijkheden.

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
