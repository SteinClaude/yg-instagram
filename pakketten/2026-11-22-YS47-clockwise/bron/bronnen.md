# Bronnen YS47

Gelezen op zo 15 nov 2026 (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: `teksten/shorts/YS47.cjs` · maken: `node gereedschap/short.cjs YS47` en `node gereedschap/short/pakket.cjs YS47`

## Brendan McWilliams, "Why clocks are designed to rotate the way they do", The Irish Times (27 okt 2001)
https://www.irishtimes.com/news/why-clocks-are-designed-to-rotate-the-way-they-do-1.334397

- De zon trekt van oost naar west "across the southern sky"; de schaduw "moves in what we now would call a clockwise direction around the graduations on the dial."
- Vroege klokmakers namen dat bekende patroon waarschijnlijk over (samengevat).
- Op het zuidelijk halfrond staat de zon in het noorden en "moves in an anti-clockwise sense around the dial"; als de tijdmeting daar was begonnen, liepen klokken misschien andersom (samengevat).

## The Old Farmer's Almanac, "Why do clocks run clockwise?" (feitje, geen datum op de pagina)
https://www.almanac.com/fact/why-do-clocks-run-clockwiser-before-the

- "Before the advent of clocks, we used sundials."
- "In the northern hemisphere, the shadows rotated in the direction we now call "clockwise.""
- "The clock hands were built to mimic the natural movement of the sun."
- "If clocks had been invented in the southern hemisphere, "clockwise" would mean just the opposite."

## Wat bewust niet gezegd is
- Niet gezegd: wie de eerste mechanische klok maakte, jaartallen, en dat de schaduw op een verticale zonnewijzer (aan een muur) juist andersom draait; de short gaat over de liggende zonnewijzer. "Copied the shadow" volgt de Irish Times ("waarschijnlijk overgenomen") en de Almanac ("built to mimic"); de short zegt niet dat dit bewezen is uit één document. Klokken, zonnewijzer, aardbol, decors en figuren zijn eigen tekenwerk.

## Beeld, letters en geluid
- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs). Stemmen: Engelse AI-stemmen van ElevenLabs (betaald abonnement met commerciële licentie volgens de prijspagina van de dienst, gelezen 14 nov 2026): Laura (het Vraagteken) en Liam (Peertje); gemaakt met gereedschap/short/elevenlabs.cjs, ingesproken tekst in bron/stem.txt. Figuren en decors: eigen tekenwerk (gereedschap/figuur.cjs, gereedschap/short/decor.cjs). Geen muziek, geen audio van anderen.
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
