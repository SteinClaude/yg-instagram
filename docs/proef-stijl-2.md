# Proef stijl 2 · dezelfde huisstijl, zichtbaar beter

**Gemaakt:** ma 9 nov 2026, Manon. Aanleiding, Andries in de sessie:
- ±18:30: *"kunnen we onze style een upgrade geven dat de kijkers ook verbetering zien maar welke de zelfde style."*
- ±18:47, na de eerste proef: *"kan het nog beter ik wil ook dat vootaan de no.(nummer) bovenaan de video eruit gaat dit is slordig, maar upgrade nog beter"*

**Wat hetzelfde blijft:** dossierpapier, inkt, signaalrood, de letters (Instrument Sans en IBM Plex Mono), de stem (Kokoro fenrir), de overgangen en geluiden, en vorm 3 (haak in de eerste seconde, kort, einde dat terugloopt).

**Wat er nieuw is:**

1. **Geen nummer en kop meer bovenaan.** "No. 33 · THE HASHTAG" en de lijn verdwijnen. De haak staat bovenaan, zonder iets ervoor.
2. **Voortgangsbalk.** Een dun spoor bovenaan het veilige vlak loopt rood vol terwijl de short speelt. Bij de lus loopt de balk weer leeg.
3. **Papier met structuur.** In plaats van een egale kleur heeft het papier fijne vezels en lichte vlekken, met vage lijnen. De donkere scènes krijgen dezelfde structuur.
4. **Markeerstift.** Nadat een sleutelwoord is geland, trekt er een gele markeerstift onder door. Op donkere scènes wordt dat een rode onderstreping.
5. **Krabbels.** Rode aantekeningen die zichzelf tekenen, zoals een onderzoeker op een dossier doet: een cirkel om het belangrijkste ding, een pijl ernaartoe, een onderstreping. Elke short kiest zelf waar die komen (`h.krabbel.cirkel`, `h.krabbel.pijl` en `h.krabbel.streep`).
6. **Bronstempel.** De bron staat in een stempel met een rood label SOURCE en komt met een zachte stempelklap neer. Op een telefoon is hij goed te lezen.
7. **Drukschaduw.** Onder de grote letters ligt een lichte schaduw, wat diepte geeft.

**Ronde 3, professionele afwerking.** Andries (±19:00): *"upgrade naar maximale kwaliteit en profesionele"*

8. **Tekst gelijk met de stem.** Elk woord van de kop verschijnt op het moment dat het wordt uitgesproken, met het beeld net voor het geluid (0,06 s), zoals in professionele montage. Het nieuwe `gereedschap/short/woordtijden.py` haalt de woordtijden uit de opname zelf:
   - eerst de pauzes;
   - dan de zinsdelen, die over de spraak worden verdeeld;
   - dan per woord het aantal klanken.

   Woorden die niet letterlijk gezegd worden (een # waar de stem "this symbol" zegt) vallen ertussen. Labels in tekeningen houden hun eigen tijden.
9. **Studiomix van de stem.** Dezelfde stem (Kokoro fenrir), maar gemixt: rommel onder 75 Hz weg, minder dreun, meer helderheid, een compressor voor een gelijkmatig volume en een de-esser tegen scherpe s-klanken. De luidheid blijft -14 LUFS.
10. **Geluid bij elke aantekening.** De markeerstift krijgt een zachte haal en een cirkel of pijl een pen die krast. De momenten worden automatisch uit het beeld gehaald.
11. **Levende camera.** Een heel lichte, doorlopende beweging, alsof er uit de hand gefilmd wordt. Het beeld staat daardoor nooit helemaal stil.
12. **Hogere beeldkwaliteit.** Gecodeerd met x264 CRF 17 en preset slow, waar het eerst CRF 20 was. De uploadversie blijft onder 10 MB.
13. **YS33-kaartjes.** De drie gestapelde berichten laten nu alle drie #sandiegofire zien.

**Voor en na:** `docs/proef-stijl-2-voor-na.jpg` (YS33, oud links en nieuw rechts).

**Techniek:**
- Aanzetten kan op twee manieren: zet `stijl: 2` in het script, of geef `--stijl 2 [--map <uitvoermap>]` mee aan `node gereedschap/short.cjs <code>`.
- Scripts zonder `stijl` worden gemaakt zoals voorheen.
- De krabbels in YS33 verschijnen alleen in stijl 2.

**Besluit:** "Stijl OK stijl 2" (Andries, ma 9 nov 2026, in de sessie). Stijl 2 geldt voor de YS-reeks vanaf YS33; YS01–YS32 blijven zoals gepland.
- Komt die OK, dan maak ik YS33–YS39 opnieuw in stijl 2, met krabbels per short. Script, bronnen en titels blijven gelijk.
- Daarna geldt stijl 2 voor alle nieuwe shorts.
- YS01–YS32 blijven zoals ze zijn, want die staan al gepland.
