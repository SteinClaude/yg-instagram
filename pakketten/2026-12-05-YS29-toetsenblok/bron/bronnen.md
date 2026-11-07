# Bronnen YS29

Gelezen op za 7 nov 2026 (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: `teksten/shorts/YS29.cjs` · maken: `node gereedschap/short.cjs YS29` en `node gereedschap/short/pakket.cjs YS29`

## R. L. Deininger, Bell System Technical Journal 39(4), juli 1960, p. 995–1012 (scan, volledige tekst gelezen)
https://www.vcalc.net/Documents/touchtone_hf.pdf

- "Sixteen different arrangements were selected for the first part of this study."
- "Notice that the arrangement frequently found in ten-key adding machines (arrangement I-A, Fig. 3) was not the best of the first three arrangements compared."
- "the same geometric configuration with a different numbering scheme (arrangement IV-A) was superior in keying performance"
- "However, the performance differences between the two were small: arrangement I-A had an average keying time of 5.08 seconds, and arrangement IV-A had an average of 4.92 seconds."

## Boston Globe, overlijdensbericht John E. Karlin (10 feb 2013)
https://www.bostonglobe.com/metro/obituaries/2013/02/10/john-karlin-industrial-psychologist-for-bell-labs/jfucVP0VRjWuDmV1zmp7pJ/story.html

- het toetsenblok met "1-2-3" "on the top row instead of the bottom, as on a calculator"
- "all sprang from research conducted or overseen by Mr. Karlin"

## Wat bewust niet gezegd is
- Niet gezegd: waarom rekenmachines 7-8-9 bovenaan hebben (geen betrouwbare bron), dat 1-2-3 "veel" sneller was (het verschil was 0,16 s), en verhalen over te snel typen of de letters ABC (alleen fora). Dat indeling I-A 7-8-9 bovenaan heeft, staat in Fig. 3 van Deininger (het rekenmachine-blok); de video toont het als "adding machine". De zestien schetsjes zijn een eigen illustratie, geen kopie van Fig. 3. Toetsenblokken zijn een eigen tekening, geen merk.

## Beeld, letters en geluid
- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs). Stem: Engelse AI-stem Kokoro-82M (open source, Apache-2.0, stem "fenrir"), lokaal gemaakt; ingesproken tekst in bron/stem.txt. Geen muziek, geen audio van anderen.
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
