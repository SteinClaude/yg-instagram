# De pakketkaart

Andries bekijkt en keurt alle kanalen in één venster: het YG-Social-paneel. Het paneel leest jouw map op zijn pc. Wat het over een pakket weet, haalt het uit twee kleine bestanden in de map van dat pakket:

| Bestand | Van wie | Wat erin staat |
|---|---|---|
| `pakket.json` | van jou, de maker | code, titel, welke keuring je vraagt, waar en wanneer het geplaatst wordt |
| `keuring.json` | van Andries | zijn besluiten, letterlijk, met datum en tijd |

Het paneel raadt niets. Staat een titel, een datum of een vraag niet op de kaart, dan ziet Andries hem niet.

## 1. `pakket.json`

```json
{
  "code": "X01",
  "titel": "De titel zoals hij gepubliceerd wordt",
  "soort": "short",
  "video": "media/X01/X01.mp4",
  "vraagt": { "pakket": "2026-11-14T11:04:00+01:00" },
  "opmerking": "Let op de stem in de eerste zin.",
  "plaatsen": [
    { "platform": "youtube", "stand": "ingepland", "wanneer": "2026-11-19T18:00:00+01:00" },
    { "platform": "instagram", "stand": "klaar", "noot": "Wacht op het account." }
  ]
}
```

| Veld | Moet | Uitleg |
|---|---|---|
| `code` | ja | De code van het pakket, gelijk aan de code in de mapnaam. |
| `titel` | ja | De titel zoals hij gepubliceerd wordt. |
| `soort` | nee | Vrij woord, bijvoorbeeld `short` of `lang`. |
| `video` | nee | Pad naar de hoofdvideo, vanaf de wortel van je map. Laat je het weg, dan zoekt het paneel zelf (zie het kanaalbestand). |
| `onderdelen` | nee | Extra video's bij dit pakket: `[{ "naam": "Short 1", "video": "media/…/short-1.mp4" }]`. |
| `vraagt` | nee | Welke keuring je nu vraagt, met het tijdstip van de vraag. Zie 2. |
| `opmerking` | nee | Eén of twee zinnen voor Andries. Hij leest ze boven de video. |
| `plaatsen` | nee | Waar en wanneer het pakket geplaatst wordt. Zie 4. |

Paden blijven binnen je eigen map: geen `..`, geen schijfletter. Tijden schrijf je als `2026-11-14T11:04:00+01:00` (de echte tijd, met `+01:00` of `+02:00`).

## 2. Een keuring vragen

Zet in `vraagt` de soort keuring met het tijdstip van nu, en commit en push:

```json
"vraagt": { "script": "2026-11-14T09:30:00+01:00" }
```

Welke soorten jouw kanaal kent (bijvoorbeeld `script`, `pakket`, `bijschrift`) staat in je regels. Het pakket verschijnt dan bij Andries op het scherm Keuren.

- **Opnieuw vragen** na een aanpassing: zet er een **nieuw tijdstip** in. Zonder nieuw tijdstip blijft het oude besluit gelden.
- **Niet meer nodig:** haal de regel weg.
- Een vraag in `vraagt` vervangt je melding in je oplevering niet; die blijft zoals je regels zeggen.

## 3. Het besluit lezen: `keuring.json`

Geeft Andries in het paneel een OK of een niet OK, dan schrijft het paneel dat in `keuring.json` in de pakketmap:

```json
{
  "code": "X01",
  "besluiten": [
    { "soort": "pakket", "uitkomst": "ok", "tekst": "pakket OK X01",
      "tijd": "2026-11-14T15:20:31+01:00", "via": "paneel", "door": "Andries",
      "opVraag": "2026-11-14T11:04:00+01:00" }
  ]
}
```

**Een besluit met `"via": "paneel"` is een OK van Andries zelf.** Het telt precies zoals een OK dat hij in je sessie typt. `tekst` zijn zijn letterlijke woorden, `tijd` is het moment.

Bij elke "ga verder", vóór je iets anders doet:

1. Kijk of er nieuwe besluiten zijn. Op de pc van Andries kan dat in één keer (zie 6); anders lees je `keuring.json` van de pakketten waarvoor je iets vroeg.
2. Staat er een nieuw besluit: **commit `keuring.json` meteen**, vóór je ernaar handelt. Vanaf dat moment kan Andries het niet meer intrekken en weet hij dat je het hebt.
3. Citeer het letterlijk (`tekst` en `tijd`) op de plekken waar je regels dat vragen: de commit, je oplevering en `buitenGit` van je stand.
4. Handel ernaar. Een OK geldt alleen voor wat er letterlijk staat, voor die ene code.

Verder:

- `uitkomst` is `ok`, `niet-ok` of `ingetrokken`. Bij `niet-ok` staat in `opmerking` wat er anders moet. Pas het aan en vraag opnieuw (nieuw tijdstip).
- `ingetrokken` betekent: het besluit ervoor telt niet meer; de vraag staat weer open.
- **Verander of verwijder nooit een besluit.** Het bestand groeit alleen.
- **Kreeg je de OK in je sessie**, dan zet je hem er zelf bij, met `"via": "sessie"` en de letterlijke woorden, en haal je de vraag uit `vraagt`:

```json
{ "soort": "script", "uitkomst": "ok", "tekst": "script OK alle drie",
  "tijd": "2026-11-14T10:24:00+01:00", "via": "sessie", "door": "Andries" }
```

## 4. Plaatsen

Elke regel in `plaatsen` is één plaatsing op één platform.

| Veld | Uitleg |
|---|---|
| `platform` | `youtube`, `instagram`, `tiktok` (kleine letters). |
| `stand` | `klaar` = af en goedgekeurd, nog nergens ingepland · `ingepland` = staat bij het platform ingepland · `geplaatst` = staat online · `vervalt` = gaat niet door. |
| `wanneer` | Dag (`2026-11-19`) of tijdstip (`2026-11-19T18:00:00+01:00`). Verplicht bij `ingepland`. |
| `wat` | Alleen als het niet het hele pakket is, bijvoorbeeld `short 2`. |
| `link` | Het adres van de geplaatste video, als je dat hebt. |
| `noot` | Eén zin, bijvoorbeeld waarop het wacht. |

Werk de kaart bij zodra er iets verandert: ingepland, geplaatst, verschoven. Uit deze regels maakt het paneel de kalender en de voorraad (hoeveel dagen er vooruit gepland staat).

Plaatst een automaat voor een platform (met een eigen `planning.json`), dan leest het paneel die planning en hoef je dat platform niet op de kaart te zetten.

## 5. Wat het paneel doet en niet doet

- Het leest je map; het enige wat het erin schrijft is `keuring.json`.
- Bij het openen haalt het je nieuwste werk van GitHub op, alleen vooruit. Werk dat je nog niet hebt vastgelegd raakt het niet aan.
- Het plaatst niets en plant niets in.
- Een kaart die niet klopt wordt niet half getoond: het paneel meldt wat er mis is en slaat dat stuk over.

## 6. Nakijken

Het paneel staat op de pc van Andries in de map `02 YG-Social\paneel` op zijn bureaublad. Vanuit elke map:

```
node "<bureaublad>/02 YG-Social/paneel/gereedschap/controle.cjs" <kanaal>
```

`<bureaublad>` is `$USERPROFILE/OneDrive/Desktop` (in PowerShell: `$env:USERPROFILE\OneDrive\Desktop`). De naam van je kanaal staat in je regels.

Je krijgt per pakket wat er niet klopt (`KLOPT NIET`), wat op Andries wacht, en onder **Nieuw uit het paneel** de besluiten die je nog niet hebt vastgelegd. Zonder meldingen is je kaart goed. Het programma schrijft niets.
