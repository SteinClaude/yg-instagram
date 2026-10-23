# OPDRACHT-ACTUEEL — Manon

**Bijgewerkt:** vr 23 okt 2026, 16:05 — Eva

## Stand

- **Batch 1 staat volledig in de planning:** K02 vr 23 okt 19:00 (`f17231f`), K03 ma 26 okt (`d383968`), W01 wo 28 okt (`5a6a09f`), T01 vr 30 okt (`19445be`). Alle vier met een "pakket OK" van Andries in jouw sessie, geciteerd in je logboek en in de commit-boodschap. Precies zo hoort het; goed werk.
- **T01 krijgt één tekstcorrectie vóór plaatsing** (zie hieronder). Niet jouw fout: de kop is pakkend, maar hij klopt niet en hij is te specifiek.

## Nu: T01-correctie — pas uitvoeren na "T01 akkoord" van Andries

**Waarom.** De kop "1.400 volgers op Instagram. Nul resultaten als iemand 'kapper Alkmaar' googelt." heeft twee problemen: (1) "nul resultaten" is aantoonbaar onwaar — die zoekopdracht geeft een pagina vol resultaten, en een feit-post die niet klopt, ondermijnt de pijler "feit"; (2) de combinatie van een volgersaantal, een vak en een stad is zo specifiek dat hij op een echt bedrijf kan slaan — regel: geen echte bedrijven, ook niet herkenbaar omschreven.

**Nieuwe kop (voorstel Eva, wacht op akkoord):** "1.400 volgers op Instagram. Niet te vinden voor wie 'schilder Alkmaar' googelt." — waar (het gaat om "niet te vinden", niet om "nul resultaten"), geen herkenbaar bedrijf, en het is die week de vakmanweek (K03 is het fictieve schildersbedrijf).

**Wat je doet zodra Andries "T01 akkoord" zegt** (in jouw sessie of via Eva; geeft hij een andere tekst, gebruik die):
1. `pakketten/2026-10-30-T01-feit/bron/maak-t01.cjs`: de koptekst op plaat 1 vervangen; plaat 1 opnieuw renderen; `overzicht.jpg`, `telefooncontrole.jpg` en `preview/raster-T01.jpg` opnieuw maken. Plaat 2 blijft.
2. `bijschrift.txt`: regel 1 vervangen; hashtag `#kapper` → `#schilder`. De rest blijft.
3. `beeldbeschrijvingen.txt`: alt-tekst 1 aanpassen aan de nieuwe plaat.
4. `beeld/berichten/nl/T01-1.jpg` overschrijven met de nieuwe plaat 1 (niets verwijderen; `plan-carrousel.cjs` weigert een bestaande code, dus niet opnieuw inplannen).
5. In `planning.json`, item `2026-10-30-bericht-t01`: velden `titel`, `tekst` en `alt[0]` aanpassen (datum, tijd en beeld blijven). Controleer dat het bestand geldige JSON is (`node -e "JSON.parse(require('fs').readFileSync('planning.json','utf8'))"`).
6. Commit met het OK-citaat van Andries in de boodschap, push, regel in `docs/oplevering-manon.md`. Meld "T01 gecorrigeerd".

Zonder "T01 akkoord": niets aan T01 doen.

## Daarna, in deze volgorde (batch 2 — `docs/opdracht-02.md` is definitief)

1. **W02** ontwerpstudio (vr 6 nov 19:00): kan nu. Maken, pushen, "pakket W02 klaar" melden, wachten op OK.
2. **A37-sjabloon** bekendmaking weggeefactie (ma 2 nov 19:00): platen met een plaatshouder-bedrijf en een script dat naam + waarom-regels uit één tekstbestand haalt. Niet inplannen; het definitieve pakket volgt na de keuze van Andries (naam komt van Eva).
3. **Z01** zo werkt het (wo 4 nov 19:00): **pas beginnen als Eva de prijs van het beheer bevestigd heeft** (`docs/opdracht-02.md` §4 vraag 1). Tot die tijd niet maken.
4. K04 en T02: wachten op `OPDRACHT-ACTUEEL` na ma 26 okt.

- Na vr 23, ma 26 en wo 28 okt 19:00: `gedaan.json` controleren, "geplaatst" melden in je logboek met media-id. Plaatst de automaat niet binnen 6 uur: meld het; Eva stoot hem aan.
- `docs/highlights.md` blijft open tot batch 1 af is.

## Niet doen

Reels of video · nieuwe weggeefacties · iets met Runway · een pakket inplannen of wijzigen zonder OK voor die code.

## Vragen voor Eva of Andries

Bovenaan je antwoord in de chat en in `docs/oplevering-manon.md`.
