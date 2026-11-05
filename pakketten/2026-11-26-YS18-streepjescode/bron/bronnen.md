# Bronnen YS18

Gelezen op wo 4 nov 2026 (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: `teksten/shorts/YS18.cjs` · maken: `node gereedschap/short.cjs YS18` en `node gereedschap/short/pakket.cjs YS18`

## WYSO (NPR-zender, Ohio), "50 years ago, the first retail barcode was scanned at an Ohio grocery store" (Renee Wilde, 25 juni 2024)
https://www.wyso.org/news/2024-06-25/50-years-ago-the-first-retail-barcode-was-scanned-at-an-ohio-grocery-store

- idee in een strandstoel op een strand in Miami
- Woodland (uit een Smithsonian-artikel): "I remember I was thinking about dots and dashes when I poked my four fingers into the sand"
- "I pulled my hand toward me and I had four lines"; "they could be wide lines and narrow lines, instead of dots and dashes"
- "I took my four fingers—they were still in the sand—and I swept them round into a circle"; "That first barcode looked more like a bullseye."
- "Woodland and his former classmate Bernard Silver, refined the concept and applied for a patent in 1949."
- "the bullseye design tended to smear in the direction of the paper when running through the register"
- "George Lauer with IBM" ontwikkelde de rechthoekige UPC; eis: leesbaar "from any direction at any speed"
- "Fifty years ago at Marsh's grocery store in Troy" (artikel van juni 2024 → 1974); "a pack of Wrigley's Juicy Fruit gum became the first retail item scanned"

## Wat bewust niet gezegd is
- De plan-bron (GS1-persbericht) gaf op 4 nov een 403; daarom WYSO. Niet gezegd: de exacte dag en tijd (26 juni, 8:01 staat niet in deze bron), de prijs (bronnen elders spreken elkaar tegen), de naam van de kassière, en de naam van de IBM-ingenieur (de bron schrijft "Lauer"; elders "Laurer"): de video zegt alleen "at IBM". Zand, sporen en streepjescode zijn een eigen tekening.

## Beeld, letters en geluid
- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs). Stem: Engelse AI-stem Kokoro-82M (open source, Apache-2.0, stem "fenrir"), lokaal gemaakt; ingesproken tekst in bron/stem.txt. Geen muziek, geen audio van anderen.
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
