# Bronnen YS34

Gelezen op ma 9 nov 2026 (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: `teksten/shorts/YS34.cjs` · maken: `node gereedschap/short.cjs YS34` en `node gereedschap/short/pakket.cjs YS34`

## Oorspronkelijke draad (CMU, site van Scott Fahlman)
https://www.cs.cmu.edu/~sef/Orig-Smiley.htm

- 16-Sep-82 17:21: "WARNING! Because of a recent physics experiment, the leftmost elevator has been contaminated with mercury."
- 16-Sep-82 21:34: "It is not an actual problem."
- 17-Sep-82 10:58: "Many people seem to have taken the notice about the physics department seriously." + voorstel * als grapteken; daarna % en & van anderen
- 19-Sep-82 11:44, Fahlman: "I propose that the following character sequence for joke markers: :-) Read it sideways." en ":-(" voor wat geen grap is
- "retrieved from the spice vax oct-82 backup tape by Jeff Baird on September 10, 2002"

## Scott E. Fahlman, "Smiley Lore :-)"
https://www.cs.cmu.edu/~sef/sefSmiley.htm

- "In at least one case, a humorous remark was interpreted by someone as a serious safety warning."
- "it occurred to me that the character sequence :-) would be an elegant solution"

## The Register (13 sep 2002)
https://www.theregister.com/2002/09/13/first_ever_smiley_found_preserved/

- teruggevonden door "Microsoft researcher Mike Jones and facilities staff at Carnegie Mellon University"

## Wat bewust niet gezegd is
- Niet gezegd: dat dit de allereerste smiley ooit was (Fahlman zelf: "at least one of the inventors"; eerdere tekentjes bij telexoperators), de namen van de andere schrijvers in de draad, en wie de band precies terugvond. De lift, het scherm en de band zijn een eigen ontwerp.

## Beeld, letters en geluid
- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs). Stem: Engelse AI-stem Kokoro-82M (open source, Apache-2.0, stem "fenrir"), lokaal gemaakt; ingesproken tekst in bron/stem.txt. Geen muziek, geen audio van anderen.
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
