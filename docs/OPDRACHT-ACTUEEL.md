# OPDRACHT-ACTUEEL — Manon

**Bijgewerkt:** ma 26 okt 2026, 17:50 — Eva

## Nieuw van Andries

**Andries via Kantoor, ma 26 okt 2026 17:45: "Ga verder".** Z01 staat al ingepland (`e28765c`). Ga verder met §4: K04 en T02 (beauty) maken, pushen, "pakketten K04 en T02 klaar" melden. Niet inplannen zonder "pakket OK" per code.

## Stand

- **Batch 1 staat volledig in de planning en T01 is gecorrigeerd** (`1255824`). K02 geplaatst vr 23 okt (media-id in `gedaan.json`); K03 ma 26 okt 19:00, W01 wo 28 okt, T01 vr 30 okt lopen via de automaat. **W02 ingepland** vr 6 nov 19:00 (`bf1be32`, pakket OK van Andries 25 okt). Goed werk.
- **Je vraag over de site is beantwoord: yg-digital.nl/yg-launch toont sinds zo 25 okt ± 21:00 "€ 49 per maand, exclusief btw"** (Eva heeft het in JouwWeb gezet; controleer het zelf met WebFetch op de dag van plaatsing, zoals je opdracht zegt). Z01 kan dus ingepland worden — maar op een nieuwe datum, zie hieronder.
- **Nieuwe werkwijze (C20, Andries 25 okt 23:13 "akkoord"):** Eva start je binnenkort als deelagent in haar eigen cloudsessie, in een eigen kloon; Andries opent dan geen sessie meer op zijn pc. Je regels blijven gelijk. Vragen zet je onder "Vragen" in `docs/oplevering-manon.md` als *vraag · mijn aanname · wat ik ondertussen doe · blokkeert ja/nee* en je werkt door op je aanname; een "pakket OK" blijft een harde stop.

## Nu, in deze volgorde

### 1. Z01 inplannen op ma 2 nov 19:00 (OK is er; datum gewijzigd)

Andries in jouw sessie, 25 okt: "pakket OK voor Z01 (woensdag 4 november 19:00)". **Andries via Eva (chat), 25 okt 23:13, akkoord H: Z01 verhuist naar ma 2 nov 19:00 en A37 naar wo 4 nov 19:00** (zodat zondag 1 nov geen crunch is; de weggeefactie-post zegt "begin november", dat blijft waar). Plan Z01 dus in voor **2026-11-02 19:00** met `gereedschap/plan-carrousel.cjs`; citeer beide regels (het OK en de datumwijziging) in de commit-boodschap en in je logboek. De mapnaam `2026-11-04-Z01-zo-werkt-het` mag blijven (hernoemen alleen als je gereedschap dat vereist; dan ook de preview). Vóór het inplannen: WebFetch op `https://www.yg-digital.nl/yg-launch` en controleer dat "€ 49" en "exclusief btw" erin staan; zo niet: niet inplannen, melden.

### 2. Je gereedschap draagbaar maken (voorwaarde om in de cloud te werken) — branch `cloud-gereedschap`

Uit de technische toets van 25 okt (`crew/toets-aansturing/1-techniek.md` in het Project; jij hoeft dat niet te lezen): in de cloud bestaat `C:/Users/gijsm/yg-luxury/node_modules/...` niet en is er geen Chrome-kanaal. Jouw K03 is daar al volledig opnieuw gemaakt (17 s) ná deze aanpassingen — het werkt dus, het moet alleen in de repo:
1. `sharp`, `@resvg/resvg-js`, `opentype.js` als dependencies in `package.json` (naast `playwright-core`); `npm install` op de pc één keer.
2. De harde `require('C:/Users/gijsm/…')`-regels in `gereedschap/*.cjs`, `platen/maak.cjs`, `platen/extra.cjs` en `pakketten/*/bron/*.cjs` vervangen door pakketnamen, met terugval voor de pc als je dat nodig vindt: `let sharp; try { sharp = require('sharp'); } catch { sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp'); }` — liever helemaal zonder pc-pad als `npm install` het oplost.
3. Fontpaden (`file:///C:/Users/gijsm/yg-instagram/platen/fonts/`) relatief maken (`path.join(__dirname, …)`), en `chromium.launch({ channel: 'chrome' })` vervangen door een start zonder `channel` (met terugval naar `channel: 'chrome'` als die er is).
4. Bewijs op de branch: `node gereedschap/raster-preview.cjs K03 pakketten/2026-10-26-K03-schilder/plaat-1.jpg` maakt `preview/raster-K03.jpg` opnieuw; `node gereedschap/plan-carrousel.cjs pakketten/2026-10-26-K03-schilder 2026-12-01 19:00 K99 --proef` meldt "(proef: niets geschreven)"; `planning.json` ongewijzigd (`git diff main -- planning.json` leeg).
5. **Openbare repo:** geen nieuwe paden met `gijsm`, geen namen, geen bedragen. Push de branch, meld "cloud-gereedschap klaar"; Eva kijkt en zegt wanneer je naar `main` mag mergen.
Wat in de cloud níet kan en zo blijft: echte schermafdrukken van de live site (`studio-opname.cjs`), Pexels-foto's en het Windows-lettertype Bodoni MT — dat werk doe je op de pc of via Eva.

### 3. A37 — bekendmaking, nu wo 4 nov 19:00

Het sjabloon staat (`2026-11-02-A37-bekendmaking`, `bron/gekozen.txt` + `maak-a37.cjs`). Nieuwe plaatsingsdatum **wo 4 nov 19:00**; de map mag blijven heten zoals hij heet of hernoemd worden naar `2026-11-04-…` — jouw keuze, zeg het in je logboek. Niet inplannen tot de naam en de "waarom"-regels van de gekozene hier als citaat staan (na zo 1 nov) en Andries "pakket OK A37" heeft gegeven.

### 4. K04 en T02 in één keer — sector van de week: beauty

**Sector van levering 02 (Daan, ma 26 okt): beauty** — nagelstudio's, kapsalons en schoonheidssalons zonder of met een zwakke site. (Levering 02 bevat ook vakmensen, maar K03 was al een schildersbedrijf; de beauty-zaken krijgen deze week de DM's van Gijs.) Maak **K04 en T02 direct achter elkaar**, push, meld "pakketten K04 en T02 klaar". Andries keurt ze in één bericht met beide codes; tot die tijd niet inplannen.
- **K04** (ma 9 nov 19:00): conceptproject voor een **fictieve nagelstudio of schoonheidssalon**, zelfde opzet als K02/K03 (eerste ontwerp uit de studio, vóór/na, de drie dingen die een klant direct ziet: afspraakknop bovenaan, reviews in beeld, telefoonnummer als tekst). Fictieve naam eerst zelf controleren (geen bestaand bedrijf, ook niet buiten Alkmaar); Eva controleert ook. Geen verwijzing naar een echte zaak, geen herkenbare combinatie van cijfers + vak + stad.
- **T02** (wo 11 nov 19:00, let op: de tabel in `docs/opdracht-02.md` zegt wo 11 nov; de vorige regel hier zei vr 13 nov — wo 11 nov geldt): één feit dat waar is en niet naar een bestaand bedrijf wijst, in de beauty-hoek. Voorbeeldrichting (zelf toetsen of het klopt): "Wie 'nagelstudio Alkmaar' googelt, ziet eerst de zaken mét website; een zaak zonder site staat alleen op de kaart." Formuleer als constatering, niet als cijfer dat je niet kunt bewijzen (les van T01).
- W03 (vr 13 nov) pas na A37 en "ontwerp OK" van Andries voor de gekozene.

### Doorlopend

- Na ma 26 en wo 28 okt 19:00: `gedaan.json` controleren, "geplaatst" melden in je logboek met media-id. Plaatst de automaat niet binnen 6 uur: meld het; Eva stoot hem aan.
- Sluit elke sessie af met één regel in `docs/oplevering-manon.md`: "gebruik bij afsluiten: `/usage` sessie x % · week y %" (als `/usage` bestaat in je sessie; anders "n.v.t.").
- `docs/highlights.md` blijft open tot batch 1 geplaatst is.

## Niet doen

Reels of video · nieuwe weggeefacties · iets met Runway · een pakket inplannen of wijzigen zonder OK voor die code · pc-paden of namen in deze openbare repo.

## Vragen voor Eva of Andries

Onder "Vragen" in `docs/oplevering-manon.md` (vraag · aanname · wat je ondertussen doet · blokkeert ja/nee) én bovenaan je verslag. Andries plakt niets meer over; Eva antwoordt hier als citaat.
