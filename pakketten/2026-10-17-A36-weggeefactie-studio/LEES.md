# Pakket A36 — weggeefactie + ontwerpstudio (carrousel)

Gemaakt 14 oktober 2026 door de manager Instagram (Claude), op verzoek van Gijs: de
weggeefactie (A35, 21 sep) en reel R17 (2 okt) worden één carrousel, actie tot en met 31 oktober.

| Plaat | Bestand | Bron |
|---|---|---|
| 1 | `plaat-1.jpg` | `platen/actie.cjs` blok A36 (= A35 met "31 oktober"), `node platen/actie.cjs A36` |
| 2 | `plaat-2.mp4` | `beeld/reels/R17-publicatie.mp4` → 4:5 met ffmpeg, zie hieronder |

Waarom 4:5: Instagram snijdt alle platen van een carrousel naar de verhouding van plaat 1.
De 9:16-reel zou dan label, kop en telefoon verliezen. De 4:5-versie schaalt de reel naar 86 %
(928 × 1650), neemt daarvan 1350 rijen vanaf rij 175 en legt die op een vervaagde kopie van
dezelfde reel, zodat de randen van 76 px links en rechts hetzelfde papier tonen:

    ffmpeg -i beeld/reels/R17-publicatie.mp4 -filter_complex \
      "[0:v]split=2[a][b];[a]scale=1080:1920,crop=1080:1350:0:285,boxblur=40:3[bg];\
       [b]scale=928:1650,crop=928:1350:0:175[fg];[bg][fg]overlay=76:0:format=auto,format=yuv420p" \
      -r 30 -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 -pix_fmt yuv420p \
      -c:a copy -movflags +faststart -use_editlist 0 plaat-2.mp4

Bijschrift en alt-teksten: `bijschrift.txt`, `beeldbeschrijvingen.txt` (de video krijgt geen alt-tekst;
Instagram kent die alleen voor foto's). Inplannen, pas na "pakket OK" van Gijs:

    node gereedschap/plan-carrousel.cjs pakketten/2026-10-17-A36-weggeefactie-studio 2026-10-17 19:00 A36

Na plaatsing: in de app het nieuwe bericht vastzetten; de oude post (A35) en de oude reel archiveren, niet verwijderen.
