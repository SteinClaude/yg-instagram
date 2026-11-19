# De automaat voor alle kanalen

**Opgesteld:** do 19 nov 2026 — Manon, als deelagent van Eva (`eva-automaat-3`, `eva-automaat-1`).
**Status:** gebouwd en getoetst op de tak `manon/automaat-alle-kanalen`. **Niet live.** Op `main` is niets veranderd; de automaat plaatst daar gewoon door voor kanaal 1. Eerst de controle van Eva, dan het ja van Andries (B30).

## De besluiten van Andries (letterlijk)

- do 19 nov 2026 ±19:32, knop, op de vraag van Eva *"[…] Voor kanaal 2 en account 3 werkt hij nog niet. Wil je dat hij daar ook Instagram gaat doen?"*: ***"Ja, kanaal 2 en account 3 (Recommended)"***
- do 19 nov 2026 19:43, aan Eva: ***"laat jij dit uitzoeken en maken voor de automaat we gaan dit in orde maken voor yg-social zodat de agents de post kunnen inplannen voor alle kanalen"***
- Zijn vaste wens, za 14 nov 2026 14:03 (over het paneel): *"maak het ook zo dat als er toekomstige kanalen komen dat dit ook makelijk toe te voegen is […] perfectie en geen fouten"*

## In het kort

- **Eén tabel met accounts** (`src/accounts.cjs`): @ygdigital.nl, kanaal 1, kanaal 2, account 3. Een volgend account is één regel plus twee geheimen.
- **Eén commando voor de makers** (`gereedschap/inplannen.cjs`): het kijkt de keuring van Andries na, de video, het bijschrift en of iets dubbel is, en legt dan één item vast. Alleen de eigen paden, alleen het eigen account. Met `--proef` verandert er niets.
- **Per account een eigen stand, sleutelteller, slot en melding.** Een account zonder werk (zoals het gepauzeerde account met de geweigerde sleutel) zet de rest niet meer op "staat stil".
- **Een fout raakt alleen het eigen account.** Een post die mislukt, wacht (10, 20, 40, 55 minuten) en houdt de andere accounts niet op.
- **46 toetsen, alle goed**, zonder netwerk en zonder sleutels.
- **Twee dingen los ik hiermee niet op:** de repo blijft groeien (zie A1) en GitHub start de automaat vaak te laat (zie A3). Voor beide ligt hieronder een voorstel met een besluit voor Andries.

---

## Deel A — wat ik uitzocht

Hoe ik las: "opgehaald" betekent dat ik de pagina vandaag (do 19 nov 2026) heb laten ophalen en de zinnen waar het om gaat eruit heb laten halen. Ik heb niet elke pagina van boven tot onder gelezen. Waar ik alleen een zoekresultaat of een kopie zag, staat dat erbij. De lijst met adressen staat onderaan.

### A1. Waar de video's staan, en de omvang

**Gemeten** (do 19 nov, `node gereedschap/omvang.cjs`; leest alleen, uit git):

| | Grootte | Bestanden |
|---|---|---|
| Werkmap op de laatste commit | 2.182 MB | ±1.700 |
| waarvan `pakketten/` | 1.936 MB | 788 |
| `pakketten/*/video.mp4` (de grote versie) | 1.189 MB | 49 |
| `pakketten/*/video-upload.mp4` (voor YouTube Studio) | 429 MB | 49 |
| `pakketten/*/instagram/reel.mp4` (wat Instagram ophaalt) | 237 MB | 27 |
| overige mp4 (`beeld/reels`, verhalen, platen) | 137 MB | 30 |
| **Nodig voor de 9 items die nog open staan** | **78 MB** | 18 |
| Video's die Instagram nooit ophaalt (`video.mp4`, `video-upload.mp4`) | 1.618 MB | 98 |
| Geschiedenis van git, ingepakt (meting Eva) | 2,09 GiB | |

De automaat heeft dus 78 MB nodig van een openbare site van ruim 2 GB. Driekwart van wat de site draagt, haalt Instagram nooit op.

**Wat GitHub zegt** (opgehaald):

- GitHub Pages: *"Published GitHub Pages sites may be no larger than 1 GB"*, bronrepo *"a recommended limit of 1 GB"*, en *"GitHub Pages deployments will timeout if they take longer than 10 minutes"*. Wie eroverheen gaat: *"we may not be able to serve your site"*, of een mail van GitHub met het advies iets anders te gebruiken, zoals releases.
- Onze site zit daar met ruim 2 GB al boven en werkt toch. Een verklaring: de stap van GitHub die de site neerzet, noemt in zijn foutmelding 10 GB als grens (*"total size is less than 10GB"*; gezien in een kopie van een melding bij `actions/deploy-pages`, niet op een pagina van GitHub zelf). De regel is 1 GB, de techniek houdt het langer vol. Daar kun je niet op bouwen.
- Repo: *"ideally less than 1 GB, and less than 5 GB is strongly recommended"*; een bestand boven 50 MiB geeft een waarschuwing, boven 100 MiB wordt het geweigerd. De pagina "Repository limits" noemt 10 GB voor de ingepakte geschiedenis als grens waarboven de repo traag wordt, en 2 GB per push.
- Release-bestanden: *"Each file included in a release must be under 2 GiB. There is no limit on the total size of a release, nor bandwidth usage."*

**Hoe hard het groeit.** Eva schat 50 tot 70 MB per dag met vier accounts. Dat klopt met mijn telling: een Instagram-versie is ongeveer 9 MB, en het meeste komt van kanaal 1 zelf (per short staan er nu drie video's in git: 24 + 9 + 9 MB). Bij 60 MB per dag is de geschiedenis rond de jaarwisseling 5 GB en eind maart 10 GB.

**De vier wegen**

| | Wat het is | Wat het vraagt | Bewezen? | Wat er kapot kan |
|---|---|---|---|---|
| **a. In deze repo blijven** en de werkmap opschonen | zoals nu: de video in git, Instagram haalt hem op via Pages | niets nieuws | ja: 17 Reels van kanaal 1 geplaatst sinds 9 nov | de geschiedenis groeit door; Pages boven de regel van 1 GB; weigert Pages, dan staan alle accounts stil |
| **b. Release-bestanden** | de video als bijlage bij een release; na plaatsen echt weg te halen | een manier om te uploaden (het programma `gh` op de pc, één keer inloggen door Andries) | **nee**. Het adres verwijst door naar een tijdelijk adres en levert de video als `application/octet-stream` met "attachment" (zelf gemeten bij een openbare repo). Meta zegt alleen dat de video *"must be hosted on a publicly accessible server at the time of the attempt"* en: *"We cURL media used in publishing attempts."* Of Instagram een doorverwijzing en dit soort bestand aanneemt, staat er niet en weet ik niet. | neemt Instagram het niet aan, dan werkt het niet; één proef met de proefknop zegt het |
| **c. Rechtstreeks uploaden** (`upload_type=resumable`) | de automaat stuurt de video zelf naar Instagram | — | **kan niet met onze sleutel.** Meta, op twee pagina's: *"Only for apps that have implemented Facebook Login for Business"*. Wij gebruiken Instagram-login (`graph.instagram.com`, zie `src/instagram.cjs`); de Facebook-weg werkte bij ons niet (LEESMIJ, "Hoe dit met Meta praat"). | n.v.t. |
| **d. Een aparte openbare media-repo** die regelmatig wordt leeggemaakt | zelfde techniek als nu, in een repo waar alleen video's staan | een nieuwe repo (ja van Andries), Pages aan, een opruimtaak | de techniek ja, de opzet niet | twee repo's bijhouden; dezelfde regel van 1 GB geldt daar ook |

**Advies: blijf nu in deze repo (a) en houd hem klein met drie regels. Doe daarnaast één proef met een release-bestand (b), zodat we weten of die uitweg bestaat.**

Waarom: a is de enige weg die van begin tot eind bewezen is, en het commando voor de makers kan er vandaag mee werken. c valt af. b is de enige weg die de repo echt klein houdt zonder nieuwe repo, maar ik mag en kan hem nu niet proberen. d werkt zeker, maar vraagt een tweede repo om bij te houden. YG Flow neemt het plaatsen later over; tot dan moet dit het een paar maanden volhouden, en dat kan met de regels hieronder.

**Het opruimvoorstel** (alleen een voorstel; ik heb niets weggehaald):

1. **Alleen de Instagram-versie in deze repo, hoogstens 25 MB.** De makers van kanaal 2 en account 3 brengen alleen die ene video en een omslag (`beeld/<account>/<code>.mp4` en `.jpg`). Dat zit al in het commando. Voor kanaal 1 stel ik voor `video.mp4` van elke reeks buiten git te houden (zoals nu al bij YL) en per pakket één video in git te laten.
2. **De openbare site kleiner: wat Instagram niet ophaalt, niet publiceren.** Eén bestandje `_config.yml` in de hoofdmap met `exclude:` voor `pakketten/*/video.mp4` en `pakketten/*/video-upload.mp4`. De bestanden blijven in de repo; alleen de site wordt 1,6 GB kleiner (van 2,2 GB naar ±0,56 GB, onder de regel van 1 GB). Ik heb dit **niet** op de tak gezet: ik kan hier niet nagaan of Pages het patroon precies zo leest, en een fout daarin haalt de Reels van de site. Invoeren hoort met een controle: daarna de proefknop met een bestaande Reel (moet lukken) en het adres van een `video.mp4` (moet "niet gevonden" geven).
3. **Instagram-versies weg uit de werkmap, zeven dagen nadat ze zijn afgehandeld.** Nu al 80 MB (12 video's). Ik bouw de stap die dat doet pas na het ja van Andries.

Wat het oplevert: de site en elke verse kloon blijven klein. **Wat het niet doet:** de geschiedenis van git kleiner maken. Die groeit door tot er ooit één keer wordt schoongemaakt (alle makers opnieuw klonen) of tot de video's ergens anders staan (b of d). Wat er mis kan gaan: het dashboard toont van een oud item dan nog wel de omslag, maar niet meer de video.

**Niet kunnen nagaan:** hoe groot de site is die Pages nu werkelijk publiceert en hoe lang het neerzetten duurt (het adres van onze Pages-site en de pagina met runs zijn vanuit mijn werkplek geblokkeerd). En of Instagram een release-adres aanneemt.

### A2. Grenzen van Instagram per account

- **Posts per 24 uur.** Meta: *"Instagram accounts are limited to 100 API-published posts within a 24-hour moving period."* Een carrousel telt als één. Op dezelfde pagina staat bij carrousels 50. Wij plaatsen hoogstens een handvol per account per dag. Opvragen kan (`content_publishing_limit`; zit in `gereedschap/controleer.cjs`).
- **Klaargezette posts.** *"An Instagram account can only create 400 containers within a rolling 24 hour period"* en *"Containers expire after 24 hours"*. Elke poging om een Reel te plaatsen kost er één of twee. Mede daarom de wachttijd na een mislukte poging.
- **De sleutel.** Geldig 60 dagen. Vernieuwen kan zolang hij minstens 24 uur oud en nog niet verlopen is; de vernieuwde sleutel is weer 60 dagen geldig. Elk account heeft een eigen sleutel en wordt apart vernieuwd, met `gereedschap/vernieuw-token.cjs` en de sleutel van dat account. De automaat telt per account en waarschuwt twaalf dagen van tevoren, met een eigen melding per account. Een sleutel kan ook eerder ongeldig worden: op 13 nov meldde Instagram bij @ygdigital.nl *"The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons"*. Dan is een nieuwe sleutel nodig.
- **Zonder goedkeuring van Meta.** *"Standard Access … intended for apps that will only be used by people who have roles on them"*: daarom is elk account "Instagram Tester" in onze app. Dat blijft zo voor kanaal 2 en account 3.
- **Een video die nog niet verwerkt is.** De klaargezette post staat dan op `IN_PROGRESS`. Meta: *"We recommend querying a container's status once per minute, for no more than 5 minutes."* De automaat wacht vijf minuten en publiceert nooit eerder. Is de video dan nog niet klaar, dan blijft het item staan en volgt een nieuwe poging na de wachttijd.
- **Aantal aanroepen.** *"Calls within 24 hours = 4800 * Number of Impressions"*, per app en account. De automaat vraagt per start één keer per account of de sleutel werkt (was twee keer): hoogstens 144 per dag. Wat de grens is voor een account met nul vertoningen, stond niet op de pagina die ik las.
- **Inplannen bij Instagram zelf.** Op de pagina's die ik las, staat geen manier om via de API een tijdstip mee te geven. De automaat moet dus zelf op tijd wakker zijn (A3).

### A3. Op tijd plaatsen

**Wat GitHub zegt** (opgehaald): *"The `schedule` event can be delayed during periods of high loads of GitHub Actions workflow runs."* Drukke momenten zijn onder meer het begin van elk uur. *"If the load is sufficiently high enough, some queued jobs may be dropped."* En: *"The shortest interval you can run scheduled workflows is once every 5 minutes."* Elke tien minuten mag dus. **Het kost niets:** standaardrunners in een openbare repo zijn gratis.

**Wat wij zelf meten** (uit `planning.json` en `gedaan.json`, 17 Reels van kanaal 1):

| Periode | Starts | Te laat |
|---|---|---|
| 10–14 nov | elk uur | 0:34 · 1:59 · 3:20 · 3:42 · 5:32 (middelste: 3:20) |
| 15–19 nov, 18:00 en 20:00 | elk uur plus zes extra per uur rond die tijden | 0:38 · 1:52 · 2:00 · 2:12 · 2:34 · 3:52 |
| 15–19 nov, 12:00 | alleen elk uur | 0:17 · 1:46 · 1:55 |
| do 19 nov, 16:00 (YL01) | alleen elk uur | om 19:48 nog niet geplaatst |

De extra starts van 15 nov hebben iets geholpen (de middelste ging van 3:20 naar ±1:55), maar niet genoeg. Op wo 18 nov stonden er na 20:00 elf starts gepland vóór die van 22:05; geen daarvan heeft iets gedaan. De post ging om 22:12 uit. Er was ook geen mislukte poging, want die laat een spoor na in `status.json`. De automaat is in die tijd dus niet gestart, of zo vroeg gestrand dat er niets van te zien is. Meer starts inplannen is dus geen garantie. Waarom GitHub er zo weinig start, kan ik niet zien (de lijst met runs is vanuit mijn werkplek geblokkeerd). In een gesprek op het forum van GitHub (juli 2026) melden anderen hetzelfde, met als meest genoemde uitweg: de automaat van buitenaf starten. Dat is ervaring van gebruikers, geen uitspraak van GitHub.

**Wat ik op de tak heb gezet:** één regel, elke tien minuten op rustige minuten (`3,13,23,33,43,53`), de hele dag. Dat vervangt de losse regels per plaatstijd en de tak `manon/cron-1200-1600`: 12:00 en 16:00 zijn nu ook gedekt, en een account of een tijd erbij vraagt geen nieuwe regel. Een start zonder werk doet niets en maakt geen commit. De automaat haalt per start nog maar een paar MB op in plaats van ruim 2 GB.

**Een betrouwbaardere wekker, zonder kosten en zonder nieuw account.** De automaat heeft al een knop (`workflow_dispatch`); wie daar op het goede moment op drukt, is de wekker.

| Wekker | Kosten | Nieuw account | Wat het vraagt | Zwakte |
|---|---|---|---|---|
| De klok van GitHub, elke tien minuten (staat op de tak) | geen | nee | niets | onzeker, zie boven |
| **Een vaste taak van Eva** op de plaatstijden, die op de knop drukt | geen geld; een beetje verbruik van Claude per keer | nee | Eva moet de workflow mogen starten (één proef zegt het) | een taak kan ook een paar minuten later komen |
| Een klok bij Google onder het bestaande Google-account van Andries (Apps Script) | geen | nee | één nieuw geheim: een GitHub-sleutel die alleen deze workflow mag starten | een geheim erbij, buiten GitHub |
| Een taak op de pc van Andries | geen | nee | de pc moet aan staan; `gh` met inlog | de pc slaapt 's nachts en onderweg |
| YG Flow (Bram) | — | — | een server | later |

**Advies:** de regel van tien minuten live zetten, en een week lang een vaste taak van Eva op de plaatstijden laten meedrukken. Dan na die week meten met dezelfde tabel als hierboven. Blijft het boven een kwartier, dan de klok bij Google.

Bewust **niet** gebouwd: de automaat laten "wachten in de run" tot de plaatstijd. Dat houdt urenlang een computer van GitHub bezet om één Reel te plaatsen.

**De voorwaarden van GitHub.** Die zeggen (opgehaald; versie van 27 aug 2026) dat Actions niet bedoeld is voor *"Any activity that places a burden on our servers, where that burden is disproportionate to the benefits provided to users"*, met als voorbeeld: *"don't use Actions as a content delivery network or as part of a serverless application"*. Over Pages: *"primarily as a showcase for personal and organizational projects"*, met grenzen aan verkeer en gebruik. Mijn lezing: de automaat is klein gebruik, en met deze tak haalt hij per start veel minder op dan nu (een paar MB in plaats van ruim 2 GB). Maar een post-automaat met video's via Pages is niet waar die twee voor gemaakt zijn. Ik zie geen acuut gevaar; het is wel een reden om er niet zwaarder op te gaan leunen en om YG Flow als eindpunt te houden.

### A4. YouTube via een koppeling (alleen uitgezocht, niets gebouwd)

Documentatie van Google, opgehaald; de pagina's zeggen *"Last updated 2026-10-15 UTC"* (die over inloggen: 2026-05-22).

- **Kan het?** Ja. `videos.insert` uploadt een video. Inplannen gaat met `status.publishAt`: *"It can be set only if the privacy status of the video is private."* Je uploadt dus als privé met een tijdstip; YouTube zet hem dan zelf openbaar. Een tijdstip in het verleden publiceert meteen. Ook in te stellen: titel, beschrijving, tags, "gemaakt voor kinderen" en het AI-label (`status.containsSyntheticMedia`).
- **Blijven uploads van een niet-gecontroleerde app privé?** Volgens de pagina van nu: nee. *"Videos uploaded from unverified API projects are not restricted to private viewing mode."* Wat Eva op 2 nov schreef, klopt dus. (Vroeger stond daar het omgekeerde; dat weet ik uit mijn geheugen en heb ik vandaag niet nagelezen.)
- **Quota.** *"a default quota allocation of 100 `search.list` calls, 100 `videos.insert` calls, and 10,000 units per day combined"*. Meer vraagt een controle door YouTube. Honderd uploads per dag is ruim genoeg.
- **Wat het van Andries vraagt** (eenmalig; mijn schatting: een half uur, plus vijf minuten per kanaal): een project in Google Cloud (gratis), de YouTube Data API aanzetten, een toestemmingsscherm, en per kanaal één keer toestemming geven terwijl hij is ingelogd op het Google-account van dat kanaal. Dat levert per kanaal een eigen sleutel op, plus één paar gegevens van het project. Die komen in GitHub als geheimen, net als bij Instagram.
- **Risico's.**
  - Staat het toestemmingsscherm op "Testing", dan verloopt de toestemming elke 7 dagen (Google noemt *"the 7-day refresh token expiration limit for apps in the Testing status"*). Het moet dus op "Published". Zonder verificatie door Google krijg je bij het toestemming geven een waarschuwingsscherm en geldt een grens van 100 gebruikers; voor drie eigen kanalen is dat geen bezwaar.
  - De sleutel geeft uploadrecht op het hele kanaal. Hij hoort alleen in GitHub Secrets.
  - De video moet ergens staan waar de automaat hem kan pakken. Dat is opnieuw de vraag van A1; voor kanaal 2 en account 3 komen de YouTube-versies dan ook in deze repo, of het uploaden gebeurt vanaf de pc.
  - Een eigen miniatuur en video's langer dan 15 minuten vragen een geverifieerd kanaal (vandaag niet nagelezen).
- **Wat het oplevert:** het venster van YouTube Studio is niet meer nodig; de botsing tussen de makers (het vaste tijdvak, het verkeerde kanaal in beeld) verdwijnt.
- **Advies:** later, als de Instagram-kant een paar weken stabiel loopt. Het is hetzelfde patroon (tabel, geheimen per kanaal, één commando), dus de bouw is te overzien. Het is een besluit van Andries; ik heb er niets voor gebouwd.

### A5. TikTok en Snapchat

Niets gedaan. Die wachten op hun eigen koppeling (besluit van ma 16 nov, `docs/manager/tiktok-snapchat.md`). Er staat niets van in de code.

---

## Deel B — wat ik bouwde

| Bestand | Wat |
|---|---|
| `src/accounts.cjs` (nieuw) | De tabel. Per account: naam, label, de twee geheimen, de vorm van de codes, welke keuringen nodig zijn, de maker. |
| `src/plaatsen.cjs` | Leest de tabel. Alles per account. Nieuwe vorm van `status.json`. Een fout raakt alleen het eigen account. |
| `gereedschap/inplannen.cjs` (nieuw) | Het commando voor de makers, met `--proef` en `--intrekken`. |
| `.github/workflows/plaatsen.yml` | Geheimen voor kanaal 2 en account 3, de proefknop voor elk account, elke tien minuten, zuinig ophalen, een melding per account. |
| `gereedschap/plan-reel.cjs`, `plan-carrousel.cjs`, `controleer.cjs` | Lezen de tabel. Verder zoals ze waren. |
| `gereedschap/toets-automaat.cjs` (nieuw) | 46 toetsen. |
| `gereedschap/omvang.cjs` (nieuw) | Meet de omvang. Leest alleen. |
| `LEESMIJ.md` | "Meer accounts" en "Inplannen door de maker". |
| `.gitignore` | De map met meldingen. |

Niet aangeraakt: de inhoud van `planning.json`, `gedaan.json`, `sleutel.json` en `status.json`, het dashboard (`index.html`), de pakketten, `CLAUDE.md` en `docs/manager/`.

### De tabel

```js
{ naam: 'kanaal-2', label: 'kanaal 2', kort: 'k2', geheim: 'IG_TOKEN_K2', geheimId: 'IG_USER_ID_K2',
  codes: /^K2-[A-Z]+\d+$/, voorbeeld: 'K2-W06', keuringen: ['pakket'], maker: 'Finn', taal: 'en' },
```

Account 3: `account-3`, `IG_TOKEN_K3` en `IG_USER_ID_K3`, codes G plus een nummer (G11). Kanaal 1: YSxx en YLxx, keuringen pakket en bijschrift. Kanaal 2 en account 3 vragen voorlopig alleen `pakket`; dat is één woord in de tabel en hangt aan besluit 4 hieronder. De workflow geeft alle geheimen in één keer door (`IG_GEHEIMEN`), dus voor een vijfde account hoeft daar niets te veranderen. Dat is getoetst: één regel erbij, twee geheimen, en het account plaatst.

### De stand per account (`status.json`)

De drie velden bovenaan (`stand`, `bericht`, `sinds`) blijven, met dezelfde drie woorden die het dashboard kent. Erbij komt `accounts`:

```json
{
 "stand": "in orde",
 "bericht": "Verbonden met kanaal 1. Doet nu niet mee, er staat niets voor in de planning: @ygdigital.nl (sleutel geweigerd), kanaal 2 (niet ingesteld) en account 3 (niet ingesteld).",
 "sinds": "2026-11-19 20:32",
 "accounts": {
  "ygdigital": { "naam": "@ygdigital.nl", "stand": "sleutel geweigerd", "bericht": "…", "sinds": "…" },
  "kanaal-1": { "naam": "kanaal 1", "stand": "in orde", "bericht": "Verbonden.", "sinds": "…" },
  "kanaal-2": { "naam": "kanaal 2", "stand": "niet ingesteld", "bericht": "IG_TOKEN_K2 en IG_USER_ID_K2 ontbreken bij de geheimen van de repo.", "sinds": "…" },
  "account-3": { "naam": "account 3", "stand": "niet ingesteld", "bericht": "…", "sinds": "…" }
 }
}
```

Bovenaan staat alleen nog "staat stil" als er werk klaarstaat dat niet uit kan, of als er een post mislukt. De vorm van een item in `planning.json` en `gedaan.json` is niet veranderd; alleen de waarde bij `account` is nieuw.

### Wat er voor kanaal 1 verandert

Het gewone plaatsen is gelijk gebleven. Dat is getoetst door de versie van `main` en de nieuwe naast elkaar te draaien met dezelfde planning: dezelfde aanroepen naar Instagram, hetzelfde `gedaan.json`, hetzelfde `sleutel.json`. Wat wel anders is:

1. **Een post die mislukt** stopt de run niet meer. De andere accounts gaan door. Het mislukte item wordt opnieuw geprobeerd na 10, 20, 40 en daarna steeds 55 minuten, in plaats van bij elke start. In de tussentijd gaan latere items van hetzelfde account wel uit. Een run met een mislukte poging blijft rood (mail), maar niet meer bij elke start.
2. **De sleutel** wordt per start één keer nagevraagd in plaats van twee. Geen antwoord of een storing bij Meta heet nu "geen verbinding" en geeft geen melding "Sleutel vernieuwen" meer.
3. **Een item dat niet klopt** wordt niet geplaatst. Voorheen telde een tijd als "18.00" als "nu aan de beurt" en ging het item meteen uit; een item zonder `taal` liet elke run omvallen.
4. **Een onleesbaar `gedaan.json` of `planning.json`**: er wordt niets geplaatst. Voorheen gold een onleesbaar logboek als leeg, en dan zou alles binnen de inhaaltijd opnieuw uitgaan.
5. **Meldingen op GitHub** per account, op de precieze titel. Voorheen hield een open melding voor het ene account de waarschuwing voor het andere tegen. Staat de melding over de sleutel van @ygdigital.nl nog open, dan was de waarschuwing dat de sleutel van kanaal 1 bijna verloopt (die komt rond eind december) niet aangekomen.
6. **`--proef`** schrijft niets meer en heeft geen sleutels nodig.

### Het commando voor de makers

Wat het doet staat in `LEESMIJ.md`, "Inplannen door de maker". Hoe het vastlegt, is het belangrijkste:

- Het werkt **niet in de map waar het staat**. Het maakt een eigen tijdelijke kopie van de stand op GitHub, zonder werkmap en zonder inhoud (een paar honderd kB, ook al is de repo 2 GB), zet daar precies zijn eigen bestanden in en legt vast. De map van Manon op de pc wordt dus nooit aangeraakt, ook niet als daar werk open staat.
- Vóór het vastleggen kijkt het na dat de commit **alleen de toegestane paden** raakt (`planning.json`, `beeld/<account>/<code>.mp4` en `.jpg`, het kleintje in `mini/`) en dat de planning precies één item rijker is en verder gelijk.
- Legde iemand anders intussen iets vast, dan weigert GitHub. Het commando haalt de nieuwe stand op, kijkt **alles opnieuw na** (ook of de code of het tijdstip nu bezet is) en maakt een nieuwe commit. Er wordt nooit iets samengevoegd.
- Het weigert als het **niet de versie van GitHub** is: een oude kopie op de pc kent de regels van nu niet.

De makers hoeven de map van Manon niet te gebruiken. In `LEESMIJ.md` staat hoe je één keer een kleine eigen kopie van de automaat maakt (alleen `gereedschap/` en `src/`, zonder video's).

### Wat ik zelf heb beslist (hoe-vragen, met mijn aanname)

1. **`@` in een bijschrift.** In de opdracht staat "geen @". Ik weiger een @naam (een handle of e-mailadres), maar laat een los `@` toe: het bijschrift van YS04 gaat over het apenstaartje zelf.
2. **Domeinnamen.** Drie goedgekeurde bijschriften van kanaal 1 noemen een bron als domein ("timeanddate.com"). Standaard weigert het commando dat; de maker noemt de bron met `--bron timeanddate.com`, en dat staat dan in de commit. Adressen van eigen profielen (Instagram, YouTube, TikTok, een linkpagina) mogen nooit, ook niet als bron.
3. **Grootste video: 25 MB** per stuk (instelbaar per account in de tabel). Meta staat 300 MB toe; dit is onze grens voor de repo.
4. **Opnieuw gevraagd na het OK** (een nieuw tijdstip in `vraagt`): het oude OK telt dan niet meer. Zo lees ik `docs/PAKKETKAART.md`, punt 2. Een besluit telt alleen met `door: Andries` en `via: paneel` of `sessie`.
5. **`--intrekken`** stond niet in de opdracht. Zonder kan een maker niets terughalen als Andries zijn OK intrekt, en zou hij met de hand in de planning moeten.
6. **Kanaal 1** kan met het commando zijn eigen pakket in deze repo blijven gebruiken: het item wijst dan naar het pakket, zoals bij `plan-reel.cjs`. Beide maken precies hetzelfde item (getoetst).
7. **Het OK van Andries in de commit:** staat er een woord van de lijst met verboden woorden, een @naam of een link in zijn woorden, dan staat daar in de commit "[weggelaten]" (de repo is openbaar; zo doet Manon het nu met de hand).
8. **Minstens een uur vooruit** inplannen, zoals `plan-reel.cjs`: Pages heeft tijd nodig om de video klaar te zetten.
9. **De inlevermap uit `eva-automaat-1` vervalt:** de makers geven het commando de paden in hun eigen map.

---

## Hoe het getoetst is

`node gereedschap/toets-automaat.cjs`: **46 goed, 0 fout** (do 19 nov 2026). Zonder netwerk, zonder sleutels; ruim een halve minuut.

| Deel | Toetsen | Hoe |
|---|---|---|
| plaatsen | 22 | `src/plaatsen.cjs` draait in een tijdelijke map met nagemaakte accounts en een nagemaakte Instagram-module, die opschrijft wat er gevraagd wordt en alarm slaat als een account met de sleutel van een ander wordt aangesproken. |
| inplannen | 16 | Het commando draait tegen een nagemaakte GitHub (een kale git-map), met proefpakketten en proefvideo's die ffmpeg ter plekke maakt. |
| workflow | 6 | De twee stappen na het plaatsen zijn letterlijk uit `plaatsen.yml` gehaald (vergeleken met een YAML-lezer) en gedraaid in een werkmap zoals `actions/checkout` hem maakt. |
| plangereedschap | 2 | `plan-reel.cjs` en `plan-carrousel.cjs` met de tabel (alleen als `npm ci` is gedraaid). |

Wat de opdracht noemde, en waar het zit:

- **Een item zonder `account`** gaat naar het eerste account, met de sleutel van dat account.
- **Kanaal 1 doet wat het deed:** vergelijking met de versie van `main` (commit `9ea50eb`), met negen soorten items.
- **Een ontbrekende of geweigerde sleutel** raakt alleen dat account; de andere plaatsen in dezelfde run.
- **Er lekt geen accountnummer:** na elke run wordt alles wat openbaar wordt (logboek, `status.json`, `gedaan.json`, `sleutel.json`, de meldingen) doorzocht op het nummer, de naam en de sleutel van de nagemaakte accounts. Ook als Instagram ze zelf in een foutmelding zet.
- **Inplannen:** goed pakket, geen keuring, keuring van een ander pakket, ingetrokken, niet OK, opnieuw gevraagd, niet van Andries, fout bijschrift (zes soorten), dubbel (vier soorten), tegelijk inplannen door twee makers, tegelijk met een botsing, een video die omgezet moet worden, een video die niet kan, een verkeerde omslag, intrekken, een verouderd commando, een kapotte planning op GitHub.
- **De stap die `gedaan.json` bewaart:** niets nieuws geeft geen commit; een wijziging wordt vastgelegd; als een maker net iets vastlegde, wordt opgehaald en opnieuw geprobeerd; ook met een onbereikbare GitHub eindigt de stap goed. Zonder `sleutel.json` (de fout van 15 september) gaat het goed.
- **De echte bestanden van nu:** alle 72 items van `planning.json` horen bij een bekend account en de 9 open items kloppen.

De toetsen vonden twee dingen die ik heb hersteld: een gebruikersnaam in een foutmelding van Instagram kon in het logboek komen als de sleutel van dat account niet werkte, en mijn eigen toets las een stap uit de workflow verkeerd uit (daarom nu de vergelijking met een YAML-lezer).

**Niet getoetst, omdat het alleen op GitHub of bij Instagram kan:** de workflow zelf (het zuinige ophalen, de geheimen als JSON, de melding per account, de klok van tien minuten), en alles wat Instagram antwoordt. Daarom de volgorde hieronder.

---

## Volgorde van invoeren

1. **Eva kijkt de tak na.** Toetsen draaien: `node gereedschap/toets-automaat.cjs` (git en ffmpeg nodig; `npm ci` alleen voor de laatste twee toetsen). De workflow niet starten vanaf de tak.
2. **Ja van Andries → naar `main`.** Let op bij het samenvoegen: `docs/stand/manon.json` en de bovenste regels van `docs/oplevering-manon.md` botsen met wat de pc-sessie intussen schreef. Neem van die twee de versie van `main` en zet mijn regels erbij.
3. **Meteen daarna één keer met de hand:** Actions → *Plaatsen op Instagram* → *Run workflow* (op `main`, zonder proefvideo). In het logboek hoort: het ophalen duurt seconden, `Sleutel werkt, account kanaal 1.`, en daarna "Niets te plaatsen" of de post die aan de beurt was. `status.json` krijgt de nieuwe vorm. Is de run rood door iets in de workflow zelf: de samenvoeging terugdraaien. Dat kan zonder schade; de oude versie laat items van een account dat hij niet kent gewoon staan.
4. **De eerstvolgende post van kanaal 1 volgen** in `gedaan.json`.
5. **Andries:** de lijst met verboden woorden (2 minuten) en kanaal 2 koppelen (±15 minuten, `LEESMIJ.md`, "Meer accounts"), met de proefknop op `kanaal-2`.
6. **Eva:** de regel voor de makers (voorstel hieronder) in de opdracht en de regels van Finn; hij maakt de kleine kopie en draait zijn eerste pakket met `--proef`.
7. **Finn plant zijn eerste Reel in.** Eva of ik kijken de commit na; de automaat plaatst; nakijken op het account doet Andries.
8. **Daarna account 3,** op dezelfde manier.
9. **Na een week:** meten hoe laat de posts kwamen (A3) en hoe groot de repo is (`node gereedschap/omvang.cjs`).
10. De tak `manon/cron-1200-1600` kan weg: de nieuwe regel dekt 12:00 en 16:00.

---

## Besluiten voor Andries

**1. Openbaar vóór het plaatsen.**
Zodra Finn of Koen een Reel inplant, staan de video, de omslag en het bijschrift in deze openbare repo en op het openbare dashboard. Dat is bij kanaal 1 nu ook zo: Instagram kan een video alleen ophalen van een openbaar adres. De naam van het kanaal staat er niet bij, maar wie de tekst van een bijschrift zoekt, kan het account vinden.
- *Ja, zoals bij kanaal 1* **(advies)**
- *Nee, eerst een weg waarbij de video's niet in deze repo staan* (besluit 5, of een aparte media-repo; ook dan staat de video op een openbaar adres, alleen niet hier)
Advies: ja. Het hoort bij hoe de automaat werkt, en er komt geen naam, handle of link in de repo: het commando weigert die.

**2. Opruimen, zodat de repo klein blijft.**
- *Ja, alle drie de regels uit A1* **(advies)**: alleen de Instagram-versie in de repo, de site publiceert niet meer wat Instagram niet ophaalt, en een Instagram-versie mag zeven dagen na plaatsen weg uit de werkmap
- *Alleen de site kleiner* (regel 2)
- *Nu niets*
Er wordt niets weggehaald dat je nodig hebt: de pc houdt alles. Ik bouw de opruimstap pas na je ja.

**3. Op tijd plaatsen.**
GitHub start de automaat te laat; meer starts inplannen hielp maar half.
- *Een week proberen: elke tien minuten, en Eva drukt op de plaatstijden op de knop* **(advies)**
- *Alleen elke tien minuten, en afwachten*
- *Meteen een klok bij Google onder je eigen account* (vraagt één nieuwe sleutel)
- *Laten zoals het is tot YG Flow het overneemt*

**4. Hoeveel keuringen bij kanaal 2 en account 3?**
Bij kanaal 1 keur je het pakket en apart het bijschrift voor Instagram.
- *Eén OK: "pakket OK" dekt ook het bijschrift voor Instagram, als dat bij het keuren in het pakket zit* **(advies; zo staat het nu ingesteld)**
- *Twee, zoals bij kanaal 1: ook een "bijschrift OK" per code*
Advies: één. Het pakket OK dekt nu al het script, de bronnen en de titel (C30), en het scheelt je klikken. Het is één woord in de tabel; het commando weigert hoe dan ook een bijschrift met een @naam, een link of een naam van je lijst.

**5. Eén proef met een release-bestand.**
Dat is de enige weg die de repo echt klein houdt zonder nieuwe repo (A1, weg b). Of Instagram zo'n adres aanneemt, weet niemand tot we het proberen.
- *Ja, één proef* **(advies)**: jij of Eva zet één bestaande Reel als bijlage bij een release (vijf minuten, in de browser) en drukt op de proefknop met dat adres. Er wordt niets geplaatst.
- *Niet nodig; over twee maanden opnieuw kijken*

Daarna volgt, zoals altijd, je ja voor `main` zodra Eva de tak heeft nagekeken (B30). YouTube via een koppeling (A4) is nu geen besluit; dat komt terug als Instagram een paar weken loopt.

---

## Voorstel: de regel voor de makers

Dat de makers zelf inplannen, volgt uit de woorden van Andries van 19:43 (*"zodat de agents de post kunnen inplannen voor alle kanalen"*). Tot nu toe schreven Finn en Koen niet in deze repo; dit is de regel die dat regelt. Eva legt hem vast in hun regels, ik niet. Voor kanaal 2:

> **Instagram via de automaat.** Je Reels plan je zelf in met het commando `inplannen.cjs` uit de kleine kopie van de automaat op de pc (`yg-automaat`), met `--account kanaal-2`. In die repo doe je verder niets: je legt er alleen via het commando iets vast, alleen voor je eigen account, en je leest er alleen `LEESMIJ.md` ("Inplannen door de maker"). Je plant pas in als het "pakket OK" van Andries voor die code in `keuring.json` staat; het commando kijkt dat na en zet zijn woorden in de commit. Draai eerst met `--proef`. Geen naam, handle of link van je kanaal in het bijschrift, in een naschrift of in een reden: die repo is openbaar. Zegt het commando `STOP:`, dan is er niets gewijzigd; kun je het niet zelf oplossen, dan meld je `KAN NIET VERDER`. Je schrijft nooit met de hand in `planning.json`, start de workflow niet en vraagt of leest geen geheimen. Trekt Andries een OK in nadat je hebt ingepland, dan haal je het item terug met `--intrekken`. Met de hand plaatsen in de browser vervalt voor Instagram zodra je account is gekoppeld.

Voor account 3 hetzelfde met `--account account-3`. Voor Manon: kanaal 1 mag ook via het commando; `plan-reel.cjs` blijft werken.

---

## Voor Eva: wat ik vooral zou nakijken

1. **`src/plaatsen.cjs`, het stuk na een mislukte post** (`plaatsAlles` en `maakStand`): de wachttijd per item en dat latere items van hetzelfde account doorgaan. Dat is een bewuste verandering voor kanaal 1; zeg het als je de oude volgorde (het account wacht op het mislukte item) liever houdt.
2. **`.github/workflows/plaatsen.yml`:** het zuinige ophalen (`sparse-checkout: src`), `IG_GEHEIMEN: ${{ toJSON(secrets) }}` en de nieuwe stap voor meldingen. De stap die `gedaan.json` bewaart is gelijk gebleven, op vijf pogingen in plaats van drie na.
3. **De vorm van `status.json`:** leest het paneel of het Kantoor dat bestand? De drie velden bovenaan zijn gelijk gebleven.
4. **Het paneel voor kanaal 2 en account 3:** leest het de planning van de automaat ook voor die accounts? Zo niet, dan zetten Finn en Koen "instagram ingepland" op hun kaart; het commando zegt welke regel.
5. **De regel "geen @" en "geen domeinnaam"** zoals ik hem heb uitgelegd (hoe-vragen 1 en 2).
6. **De tak `manon/cron-1200-1600`** vervalt hiermee.

---

## Wat ik niet kon doen of nagaan

- **Niets tegen Instagram of GitHub Actions gedraaid** (mocht niet, en zo hoort het). De workflow is dus alleen als tekst en per stap getoetst, niet als geheel.
- **De openbare site en de lijst met runs** kon ik niet zien: beide adressen zijn vanuit mijn werkplek geblokkeerd. Daardoor weet ik niet hoe groot de site is die Pages nu publiceert, en niet hoe vaak GitHub de automaat werkelijk start.
- **Of Instagram een release-adres aanneemt:** onbekend (besluit 5).
- **Windows:** het commando is geschreven zonder shell-trucs (`path.join`, `execFile`), maar ik heb het alleen op Linux gedraaid.
- **De repo's van Finn en Koen** heb ik niet gelezen (regel). Het commando vraagt daarom alle paden als optie en gaat niet uit van hun bestandsnamen.
- **Een kale gebruikersnaam in een foutmelding** van een account waarvan de sleutel niet werkt, kan de automaat niet herkennen (hij kent de naam dan niet). Een @naam, het nummer en de sleutel gaan er altijd uit. In de foutmeldingen die we tot nu toe zagen, noemt Instagram alleen het nummer.

---

## Bronnen

Opgehaald op do 19 nov 2026, tenzij anders vermeld.

**GitHub**
- Pages, grenzen: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Grote bestanden en de grootte van een repo: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- Grenzen van een repo: https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits
- Releases: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- Geplande workflows (het deel over `schedule`): https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
- Kosten van Actions: https://docs.github.com/en/billing/concepts/product-billing/github-actions
- Forum, geplande runs die uren te laat komen (ervaringen van gebruikers, juli 2026): https://github.com/orgs/community/discussions/201738
- Voorwaarden voor Actions en Pages (versie van 27 aug 2026): https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
- `actions/checkout`, de optie `sparse-checkout`: gelezen in een kopie van de README (https://gitea.wp-staging.com/actions/checkout/src/tag/v6.0.0/README.md), niet op de pagina van GitHub zelf.
- De foutmelding met 10 GB bij het neerzetten van Pages: gelezen via een doorverwijzing naar melding 303 bij `actions/deploy-pages` (https://github-redirect.dependabot.com/actions/deploy-pages/issues/303).

**Meta**
- Content publishing (100 posts, cURL, alleen Facebook-login voor rechtstreeks uploaden, status van een container): https://developers.facebook.com/docs/instagram-platform/content-publishing/
- Rechtstreeks uploaden: https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads
- IG User Media (400 containers, eisen aan een Reel, bijschrift): https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media
- Sleutel vernieuwen: https://developers.facebook.com/documentation/instagram-platform/reference/refresh_access_token
- Overzicht (aanroepen per dag, toegangsniveaus, 60 dagen): https://developers.facebook.com/documentation/instagram-platform/overview

**Google**
- `videos.insert`: https://developers.google.com/youtube/v3/docs/videos/insert
- De velden van een video (`status.publishAt`): https://developers.google.com/youtube/v3/docs/videos
- Quota en controle: https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits
- Toestemmingsscherm, "Testing" en "Published": https://developers.google.com/identity/protocols/oauth2/production-readiness/overview

**Zelf gemeten**
- `raw.githubusercontent.com` levert een mp4 als `application/octet-stream` (kopregels opgevraagd).
- Een release-bestand van een willekeurige openbare repo: eerst een doorverwijzing (302) naar een tijdelijk adres, daar `application/octet-stream` met `Content-Disposition: attachment`.
- De omvang van de repo: `node gereedschap/omvang.cjs`. De vertragingen: `planning.json` tegen `gedaan.json`.
