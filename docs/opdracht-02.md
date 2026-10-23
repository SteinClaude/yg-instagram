# OPDRACHT 02 — Manon: batch 2 (2–13 november) en de afronding van de weggeefactie

**Van:** Eva (chef de staf) · **Voor:** Manon · **Datum:** vr 23 okt 2026 · **Status:** definitief voor Z01, W02 en A37-sjabloon; K04 en T02 volgen na levering 02 van Daan (ma 26 okt)
**Geldt naast:** `docs/opdracht-01.md` (formaat, stijl, hashtags, pakketmap), `CLAUDE.md` (harde regels), `docs/OPDRACHT-ACTUEEL.md` (wat nu).

## 1. Waarom batch 2 zo is opgebouwd

Batch 1 laat zien wat wij maken (K02, K03, W01) en waarom een site nodig is (T01). Batch 2 doet drie dingen die daar nog ontbreken: de weggeefactie **eerlijk afronden** (beloofd: "begin november maken wij bekend wie het geworden is, en waarom"), **één keer de prijs** noemen zodat een prospect weet waar hij aan toe is (Z01), en de ontwerpstudio laten zien als de drempelloze eerste stap (W02). Daarna volgt per week de sector die Daan aanlevert (K04) en een tweede feit (T02). Doel blijft I2: het profiel is de landingspagina van de DM's van Gijs.

## 2. Planning (plaatsing 19:00, één pakket per keer, elk met eigen "pakket OK")

| # | Datum | Code | Inhoud | Afhankelijk van |
|---|---|---|---|---|
| 1 | ma 2 nov | **A37** | bekendmaking weggeefactie: wie en waarom | de keuze van Andries (uiterlijk zo 1 nov) én zijn DM aan de gekozen ondernemer; sjabloon kun je nu al maken |
| 2 | wo 4 nov | **Z01** | zo werkt het — de enige post met een prijs | bevestiging van de prijs door Andries (zie §4, vraag 1) |
| 3 | vr 6 nov | **W02** | ontwerpstudio als schermafdrukken in telefoonkader | niets — kan nu |
| 4 | ma 9 nov | **K04** | conceptproject in de sector van levering 02 | planning van Eva na ma 26 okt |
| 5 | wo 11 nov | **T02** | tweede feit | idem |
| 6 | vr 13 nov | **W03** | het eerste ontwerp voor de gekozen ondernemer (echt werk, met toestemming) | A37 geplaatst én "ontwerp OK" van Andries |

Volgorde van maken: eerst de T01-correctie (zodra "T01 akkoord" er is), dan **W02**, dan **Z01** (pas als de prijs bevestigd is), dan het **A37-sjabloon**. Niets inplannen zonder "pakket OK" voor die code; het OK-citaat in je logboek en in de commit-boodschap.

## 3. De pakketten

### A37 — bekendmaking (sjabloon nu, definitief na de keuze)

- **Vier platen**, stijl van A36 (donker, goud, poortembleem): (1) "Gekozen." + bedrijfsnaam en wat het bedrijf doet · (2) **waarom** — in drie korte regels wat in de inzending de doorslag gaf, langs de vier punten uit A36 (wat het bedrijf doet en voor wie · wat de site moet oplossen · wat al geprobeerd is · wie de klant is) · (3) **wat er nu gebeurt**: eerste ontwerp binnen 48 uur, bouw, live — "wij laten het hier zien" · (4) "Ook een eerste ontwerp? Vrijblijvend via de link in onze bio."
- Maak het sjabloon met een **duidelijk nepbedrijf als plaatshouder** (bijv. "Voorbeeld B.V.") en zet in `bron/` een script dat naam en de drie waarom-regels uit één klein tekstbestand haalt, zodat het definitieve pakket op zo 1 of ma 2 nov in een kwartier klaar is.
- Bijschrift (≤ 80 woorden): dank aan iedereen die instuurde; wie gekozen is en in één zin waarom; wat de ondernemer krijgt (de zeven pagina's, teksten en logo uit A36 — geen nieuwe beloften); "iedereen die meedeed krijgt van ons een eerste ontwerp, vrijblijvend"; de link in de bio. Woordkeus: "gekozen", nooit "gewonnen/winnaar/winactie".
- Hashtags: de vaste vijf + `#ondernemen #mkb #kleinbedrijf` (geen sectorhashtags: die zijn pas bekend bij de keuze).
- **Niet** zelf een naam of bedrijf invullen; de naam komt van Eva, nadat de ondernemer via Gijs heeft gereageerd. Zonder reactie van de ondernemer wordt A37 niet geplaatst (schuift naar wo 4 nov; Z01 schuift dan mee).

### Z01 — zo werkt het (vier platen)

- (1) **Ontwerp**: "Zie in vijf minuten uw eerste ontwerp in de ontwerpstudio — of begin met een gesprek." · (2) **Gesprek en offerte**: één gesprek over het doel van de site, daarna een offerte met een vaste prijs · (3) **De prijs**: eenmalig **€ 750 excl. btw** voor ontwerp en bouw; beheer optioneel, **het maandbedrag zoals Andries het bevestigt (§4)**: technisch onderhoud en updates, back-ups, tot 30 minuten kleine tekst- en fotowijzigingen per maand; **hosting regelt en betaalt u rechtstreeks bij JouwWeb, zonder opslag** · (4) **Bouw en live**: u kijkt mee, twee gebundelde feedbackrondes, daarna live en (bij beheer) onderhouden vanaf de oplevering.
- Bijschrift: de vier stappen in vier korte zinnen; de prijs exact zoals op plaat 3 (excl./incl. btw erbij, zoals op yg-digital.nl/yg-launch); "hosting betaalt u rechtstreeks bij JouwWeb" — nooit "hosting inbegrepen"; eindigt met de link in de bio.
- Dit is de **enige** post met een prijs (I4). Elk bedrag moet letterlijk overeenkomen met `yg-digital.nl/yg-launch` op de dag van plaatsing — controleer dat zelf en zet de datum van je controle in `docs/oplevering-01.md`.

### W02 — ontwerpstudio (vier of vijf platen)

- Echte schermafdrukken van `yg-digital.nl/eerste-ontwerp`: de werelden-opening, een gekozen wereld, het ontwerp dat verschijnt, het resultaat op een telefoon — in het telefoonkader van W01. Neem de schermafdrukken zelf (zoals `bron/opname-w01.cjs`); geen reel (R17 bestaat al).
- Bijschrift: wat de studio doet (vijf minuten, vrijblijvend, geen account nodig als dat klopt — controleer het), wat de ondernemer daarna krijgt (een gesprek als hij wil), de link in de bio. Geen prijs.

### K04 en T02

Komen in `docs/OPDRACHT-ACTUEEL.md` zodra Eva de sector van levering 02 kent (ma 26 okt). K04 = fictief bedrijf in die sector, zelfde opzet als K02/K03; naam eerst zelf controleren (geen bestaand bedrijf), Eva controleert ook. T02 = een feit dat waar is en niet naar een bestaand bedrijf wijst (les van T01).

## 4. Vragen aan Andries (Eva stelt ze; jij wacht)

1. **Prijs van het beheer.** De projectdocumenten zeggen "€ 750 + € 49/mnd, excl. btw"; `yg-digital.nl/yg-launch` zegt € 750 excl. btw eenmalig en **€ 45 per maand inclusief btw (€ 37,19 excl.)**. Z01 moet gelijk zijn aan de site. Welke is juist — en moet de site worden aangepast?
2. De keuze van de weggeefactie uiterlijk **zo 1 nov**; A37 kan anders niet op ma 2 nov.
3. Toestemming van de gekozen ondernemer om genoemd te worden, via de DM van Gijs (A36 zegt alleen "dat wij het werk mogen laten zien").

## 5. Oplevering

Per pakket: pakketmap volgens het vaste formaat, `preview/raster-<code>.jpg`, regel in `docs/oplevering-manon.md`, "pakket <code> klaar" melden, wachten op OK. Vragen die je blokkeren: bovenaan je antwoord en in het logboek.
