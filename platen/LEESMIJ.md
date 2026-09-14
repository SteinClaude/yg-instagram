# Instagram — startpakket YG Digital

Gemaakt 12 september 2026. Alles is **aangeleverd**, niet geplaatst: het account is niet aangeraakt.

De werkversie met alle bijschriften om te kopiëren staat als artifact in Claude
(zoek op "YG Digital op Instagram"). Open die op je telefoon terwijl je in de Instagram-app bezig bent.

## Besluiten die hierin verwerkt zitten

| | |
|---|---|
| Gebruikersnaam | `ygdigital.nl` (`@ygdigital` is bezet door een Turks bureau) |
| Weergavenaam | YG Digital |
| Accounttype | Zakelijk, categorie Webdesigner |
| Knoppen | E-mail, bellen, WhatsApp |
| Link in bio | yg-digital.nl |
| Toon | "wij", rustig en verzorgd, zoals de site |
| Bereik | Heel Nederland |
| Bedragen | Excl. btw met het incl.-bedrag erbij, net als op de site |
| Formaten | Elk bericht in 4:5 én 1:1 |

## Wat waar staat

- `uit/` — 36 berichtplaten (NL), 2 profielfoto's, 4 highlight-omslagen, 3 verhaalsjablonen
- `uit/en/` — dezelfde 36 berichtplaten in het Engels (`berichten-en.cjs`); de bijschriften in `bijschriften-en.cjs`
- `blokken.cjs` — de nagebouwde website (`sfeer`, met `nav` per taal) en het grote embleem, gedeeld door beide talen
- `uit/verhalen/nl/` en `uit/verhalen/en/` — 26 kant-en-klare verhalen per taal (1080×1920), zelfde nummers
- `uit/fotoberichten/nl/` en `uit/fotoberichten/en/` — 13 fotoberichten per taal (1080×1350)
- `bron/` — schermafdrukken van yg-digital.nl en ordepartner.nl
- `bron/pexels/` — de 36 branchefoto's uit de ontwerpstudio (Pexels, vrij te gebruiken); `branches.json` zegt welke bij welke branche hoort
- `web/` — kleine voorbeelden voor de webversie
- `overzicht.jpg` — alle twaalf berichten op één vel

Op het bureaublad staat `YG-GRAM` (OneDrive) met alles in drie mappen: verhaal, berichten, standaardtekst.
Die map wordt gebouwd door `bouw-ygram.cjs` in de scratchpad van de sessie van 12 sep; de teksten daarin komen uit `instagram.html` (de webpagina).

## Opnieuw maken

```
node instagram/maak.cjs          # de twaalf uitgewerkte berichten (of: node instagram/maak.cjs 03)
node instagram/voorraad.cjs      # verhalen en fotoberichten (of: node instagram/voorraad.cjs V14)
node instagram/extra.cjs         # profielfoto, omslagen, verhaalsjablonen
```

`voorraad.cjs` gebruikt de fotoachtergrond van `maak.cjs`: `achtergrond: { bron, helderheid, verzadiging, donkerte, positie }` en `uitlijn: 'onder'` zet de tekst onderaan.

De teksten op de platen staan in `berichten.cjs`; pas ze aan en draai `maak.cjs` opnieuw.
Een nieuwe schermafdruk maken:

```
node tools/paginaplaat.cjs <url> instagram/bron/<naam>.jpg 1440 900 beeld
node instagram/strook.cjs <url> instagram/bron/<naam>.jpg "<tekst op de pagina>" 1440 900 -120
```

## Valkuilen die we tegenkwamen

- **opentype.js geeft NaN-paden bij één bepaalde lettergrootte.** Het euroteken in Playfair
  brak op precies 136,000 px, maar niet op 136,01. `padVan()` in `maak.cjs` schuift daarom
  een honderdste op tot de vorm klopt. Niet weghalen.
- **Modules staan in `brand/node_modules`,** niet in de hoofdmap: `maak.cjs` vraagt
  opentype.js en resvg met een expliciet pad op.
- **Het vierkante formaat is krapper dan 4:5.** `kaart()` krimpt de inhoud stapsgewijs
  tot hij past, anders raakt de tekst de voetregel.
- **Instagram snijdt rondjes.** Profielfoto en highlight-omslagen hebben daarom geen rand
  en niets in de hoeken.
- **De link in de bio kan alleen in de telefoon-app,** niet op instagram.com.
