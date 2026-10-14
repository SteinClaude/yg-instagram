# OPDRACHT 01a — Weggeefactie + ontwerpstudio in één carrousel (prioriteit 0)

**Van:** manager Instagram · **Voor:** uitvoerder (Claude Code, sessie "yg digital instagram", map `C:\Users\gijsm\yg-instagram`) · **Datum:** 14 oktober 2026 · **Status: DEFINITIEF** (besluit Andries 14 okt 19:50). Gaat vóór §1 en pakket 1 van `docs/opdracht-01.md`; alle regels daaruit (§0) gelden ook hier.

## Wat Andries wil

Op het profiel staan nu twee berichten: de weggeefactie (plaat A35, 21 sep) en reel R17 (ontwerpstudio, 2 okt). Die worden **één carrousel**: plaat 1 = de weggeefactie, plaat 2 (na swipe) = de video van de ontwerpstudio. Nieuw bijschrift: actie tot en met **31 oktober**, zonder het blok "Waarom wij dit doen", korte uitleg. Het bijschrift is al geschreven en goedgekeurd door de manager: `pakketten/2026-10-17-A36-weggeefactie-studio/bijschrift.txt` — **woordelijk overnemen, niets herschrijven.**

## Waarom dit niet "gewoon even" kan

1. Instagram laat een bestaand bericht niet uitbreiden: het wordt een **nieuw** bericht; de oude twee gaan daarna in het **archief** (Andries, in de app — niet verwijderen, want de likes op de oude post zijn een deelnamevoorwaarde en moeten controleerbaar blijven).
2. Een carrousel heeft één beeldverhouding, die van de eerste plaat (4:5). De API snijdt elke video naar die verhouding, in het midden. R17 is 9:16; bij een 4:5-snede valt het label "DEMO · FICTIEF BEDRIJF" weg en staat de kop tegen de rand, de telefoon wordt onderaan afgesneden. **Dus: een 4:5-versie van R17 maken** (B), niet de 9:16 insturen.
3. `gereedschap/plan-carrousel.cjs` accepteert alleen JPEG's; `src/instagram.cjs` kent geen video-kind in een carrousel (C).
4. Op plaat A35 staat "tot en met 30 oktober" gedrukt → nieuwe plaat A36 met 31 oktober (A).

## A. Plaat A36

In `platen/actie.cjs` het blok `A35` kopiëren naar `A36`; enige wijziging: `30 oktober` → `31 oktober` in de tekstregel. Renderen naar `beeld/berichten/nl/A36.jpg` (1080×1350, jpeg). Verder niets aan de plaat veranderen — het is dezelfde plaat met een nieuwe datum.

## B. R17 in 4:5

`beeld/reels/R17-4x5.mp4`: 1080×1350, 30 fps, dezelfde tijdlijn en tekst (20,7 s), hetzelfde geluid, H.264 + AAC, zonder edit lists (zoals `R17-publicatie.mp4`). Opmaak opnieuw gezet voor het lagere kader: label, kop en de **hele** telefoon in beeld met ≥ 60 px marge boven en onder; tekst niet kleiner dan nodig. Bron: `gereedschap/reel.cjs` + `teksten/reels-nl.cjs`; schermopnamen in `platen/bron/opnamen/` (ontbreken ze: `gereedschap/opname.cjs`). Maak reel.cjs niet kapot voor 9:16: een optie/variant, geen vervanging. Lever ook `preview/A36-controle.jpg`: plaat A36 naast frame 1, 8 en 16 van de 4:5-video, zodat de manager de snede beoordeelt zonder te hoeven afspelen.

## C. Video in een carrousel via de automaat

`plan-carrousel.cjs` (of een nieuwe `plan-gemengd.cjs`) accepteert één `.mp4`-item naast de JPEG's; `src/instagram.cjs` maakt voor dat item een kind-container met `media_type=VIDEO`, `is_carousel_item=true` en `video_url` (het bestand staat na de push openbaar op GitHub, net als de reels), wacht tot de status van die container `FINISHED` is (video verwerkt Instagram asynchroon — `status_code` pollen, met time-out), en bouwt dan de carrousel-container met beide kinderen. Controleer de actuele videospecs voor carrousel-items in de Meta-documentatie (Instagram Platform → Content Publishing) en zet ze in de oplevering; R17-4x5 moet eraan voldoen (duur, codec, bestandsgrootte). De bestaande route voor JPEG-carrousels blijft ongewijzigd werken (K01 is de maat).

## D. Pakket

`pakketten/2026-10-17-A36-weggeefactie-studio/`: `plaat-1.jpg` (= A36) · `plaat-2.mp4` (= R17-4x5) · `bijschrift.txt` (staat er al) · `beeldbeschrijvingen.txt` (staat er al) · `bron/` (de .cjs-wijzigingen). Proefdraai: `node gereedschap/plan-carrousel.cjs <map> 2026-10-17 19:00 A36 --proef` zonder STOP. **Niets in `planning.json` vóór "pakket OK".**

## E. Na "pakket OK" van Andries

1. Inplannen op de eerstvolgende avond **19:00** (valt het OK na 17:00, dan de dag erna), committen, pushen; de automaat plaatst binnen het uur.
2. Na plaatsing: `git pull`, `gedaan.json` controleren, mediaId melden.
3. Andries, in de app: het nieuwe bericht **vastzetten** (··· → Vastzetten op je profiel), daarna de oude weggeefactie-post en de oude reel **archiveren** (··· → Archiveren). Niet verwijderen.

## F. Gevolg voor batch 1 (vervangt de tabel in opdracht-01 §3)

| # | Datum | Code | Inhoud |
|---|---|---|---|
| 0 | do 16 of vr 17 okt | A36 | weggeefactie + ontwerpstudio (deze opdracht) |
| 1 | ma 20 okt | K02 | conceptproject garage/autoschadeherstel, Alkmaar |
| 2 | wo 22 okt | W01 | entree van yg-digital.nl |
| 3 | vr 24 okt | T01 | feit |
| 4 | ma 27 okt | K03 | conceptproject restaurant, Alkmaar |
| 5 | wo 29 okt | Z01 | zo werkt het (enige post met prijs) |
| 6 | vr 31 okt | W02 | ontwerpstudio als schermafdrukken |

Batch 2 vanaf ma 3 nov, te beginnen met de bekendmaking van de weggeefactie. §1 van opdracht-01 (WIP veiligstellen) doe je direct na dit pakket, vóór K02.

## Klaar = dit werkt

1. `A36.jpg` en `R17-4x5.mp4` bestaan en voldoen aan A en B; `preview/A36-controle.jpg` staat er.
2. Proefdraai D slaagt; de JPEG-route (K01-stijl) werkt nog.
3. Bijschrift en alt-teksten woordelijk uit het pakket.
4. Niets geplaatst, nergens ingelogd, `planning.json` onaangeraakt tot "pakket OK".
5. `docs/oplevering-01a.md`: wat gemaakt, de videospecs, keuzes, open vragen.

**Vragen vooraf?** Bovenaan je eerste antwoord. Geen vragen → beginnen met B (de 4:5-video is het meeste werk).
