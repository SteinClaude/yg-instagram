# Bronnen YS39

Gelezen op ma 9 nov 2026 (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: `teksten/shorts/YS39.cjs` · maken: `node gereedschap/short.cjs YS39` en `node gereedschap/short/pakket.cjs YS39`

## Kurt Kohlstedt, 99% Invisible (24 apr 2017)
https://99percentinvisible.org/article/modern-hieroglyphics-binary-logic-behind-universal-power-symbol/

- "An abstracted combination of 1 and 0 ('on' and 'off' in binary terms)"
- "In 2015, a campaign was launched and proposal accepted to add this and other power-related characters to Unicode."

## Eden, Loughry & Nordman, Unicode L2/14-009R (14 feb 2014)
https://www.unicode.org/L2/L2014/14009r-power-symbol.pdf

- "defined in IEC 60417, which is also ISO 7000:2012"
- "For the first time they would be searchable in plain text, something not possible with embedded graphics."

## Wat bewust niet gezegd is
- Niet gezegd: het verhaal over schakelaars in de Tweede Wereldoorlog (geen bron), het jaar 1973 (alleen Wikipedia), de nummers per symbool, en dat de commissie de 1 en 0 zo bedoelde (de video zegt "in binary", zoals 99% Invisible). Knop, lampjes, norm en toets zijn eigen tekenwerk.

## Beeld, letters en geluid
- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs). Stem: Engelse AI-stem Kokoro-82M (open source, Apache-2.0, stem "fenrir"), lokaal gemaakt; ingesproken tekst in bron/stem.txt. Geen muziek, geen audio van anderen.
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
