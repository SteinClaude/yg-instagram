# Proef stijl 3 · het duo: Vraagteken en Peertje

**Gemaakt:** za 14 nov 2026, Manon. Aanleiding (jesse-10, `docs/manager/animatie-koers.md`): vanaf YS40 een vaste eigen cartoonfiguur die elke short iets uitzoekt. Andries koos in de sessie, za 14 nov 2026:
- ±14:26: *"peertje"*
- ±14:28: *"met het vraag taken samen"* · *"je snapt waarom denk ik"* · *"bij vragen vraag tegen bij antwoorde peertje"* · *"zo veel mogelijk ect"*

**Het idee:** elke short is een gesprekje. Het **Vraagteken** stelt de vraag die de kijker ook heeft. **Peertje** geeft het antwoord en gaat branden op het moment van de ontdekking. Ze staan de hele short in beeld.

**Wat hetzelfde blijft:** het onderwerp (waarom gewone dingen zijn zoals ze zijn), altijd met bronnen, vorm 3 (haak in de eerste seconde, kort, einde dat terugloopt), en de huisstijl van stijl 2: papier, inkt, signaalrood, markeerstift, krabbels, bronstempel, voortgangsbalk, tekst gelijk met de stem.

**Wat er nieuw is in stijl 3:**

1. **Het duo staat onderin beeld**, de hele short. Het beeld erachter wisselt per scène; zij blijven staan.
2. **Wie praat, staat groter en vooraan.** Die beweegt de mond op de woorden van de stem en wijst naar het beeld. De ander luistert en kijkt naar de spreker.
3. **Vragen komen van het Vraagteken, antwoorden van Peertje.** Elke scène is een vraag of een antwoord.
4. **Peertje gaat aan** (met een zacht belletje) op het moment dat het antwoord valt.
5. **Twee stemmen:** het Vraagteken heeft een eigen stem (Kokoro "heart"), Peertje houdt de vaste stem van het kanaal (Kokoro "fenrir"). Beide zijn gratis en lokaal gemaakt.
6. **Kleine dingen die het levend maken:** knipperen, licht wiegen, een sprongetje bij het overnemen van het woord, en verbazing bij het Vraagteken.
7. **Indeling:** de kop bovenaan, het beeld in het midden (kleiner dan in stijl 2), de bronstempel daaronder en het duo onderaan. De gezichten blijven binnen het veilige vlak van YouTube en Instagram.
8. **Lus:** de short eindigt met Peertje die zegt "Go on. Ask me again.", waarna het Vraagteken de openingsvraag weer stelt.

**De proef: YS40, "Why is "&" called an ampersand?"**
- Script: `teksten/shorts/YS40.cjs` (8 scènes: vraag, antwoord, vraag, antwoord, vraag, drie keer antwoord).
- Bronnen, gelezen za 14 nov 2026: Dictionary.com, "What Character Was Removed From The Alphabet?" (7 sep 2020); Andy Hollandbeck, "In a Word: And & Ampersand", The Saturday Evening Post (2 sep 2021).
- Niet gezegd: een jaartal (de twee bronnen verschillen daarover).
- De video van de proef staat alleen lokaal; `docs/proef-stijl-3-overzicht.jpg` toont het eind van elke scène.

**Techniek:**
- Figuren: `gereedschap/figuur.cjs` (vector; ontwerp A en D). Generator: `gereedschap/short.cjs`, alleen voor scripts met `stijl: 3` en een `duo`. Scripts met stijl 1 of 2 worden gemaakt zoals voorheen (YS01–YS39 veranderen niet).
- Per scène: `wie: 'vraag' | 'antwoord'`, optioneel `pose` en `aha` (het moment waarop Peertje aangaat). Per figuur een stem in `stemmen`.
- Geen betaald hulpmiddel; het potje is niet aangesproken.

**Gevraagd:** "stijl OK stijl 3" (figuren, stemmen, indeling en beweging). Dat dekt de weergave voor de YS-reeks vanaf YS40. Script, bronnen en titel van YS40 komen daarna apart ter keuring ("pakket OK YS40").
