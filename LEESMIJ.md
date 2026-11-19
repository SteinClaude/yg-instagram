# YG Digital — automatisch plaatsen op Instagram

Plaatst elke dag een verhaal en op maandag, woensdag en vrijdag een bericht,
afwisselend Nederlands en Engels. Draait op GitHub, dus je computer mag uit.

**Wat het kost:** niets. Meta rekent niets voor de API en GitHub Actions is
gratis voor openbare mappen.

---

## Wat er in deze map zit

| | |
|---|---|
| `planning.json` | Wat er wanneer geplaatst wordt. 120 items, 12 weken vooruit. |
| `beeld/` | De platen als JPEG. Instagram haalt ze hier zelf op. |
| `gedaan.json` | Wat al geplaatst is. Voorkomt dubbel plaatsen. Wordt vanzelf bijgewerkt. |
| `sleutel.json` | Wanneer de huidige sleutel voor het eerst gezien is, om op tijd te waarschuwen. Alleen een vingerafdruk, nooit de sleutel zelf. |
| `status.json` | De stand van de automaat: bovenaan in het geheel, daaronder per account. Wordt vanzelf bijgewerkt. |
| `src/plaatsen.cjs` | Het script dat het werk doet. |
| `src/instagram.cjs` | De koppeling met Instagram. |
| `src/accounts.cjs` | De tabel met accounts: één regel per account (zie "Meer accounts"). |
| `gereedschap/inplannen.cjs` | Het commando waarmee een maker zijn eigen post inplant (zie "Inplannen door de maker"). |
| `gereedschap/toets-automaat.cjs` | Toetsen voor dit alles, zonder netwerk en zonder sleutels. |
| `gereedschap/klaarzetten.cjs` | Zet platen om naar JPEG en maakt een nieuwe planning. |
| `gereedschap/controleer.cjs` | Toetst of sleutel en accountnummer werken. |
| `gereedschap/vernieuw-token.cjs` | Elke twee maanden: vernieuwt de sleutel. |

De map is **openbaar**. Dat moet, want Instagram haalt de platen op van een
openbaar adres. Er staat niets geheims in: de sleutel zit in GitHub Secrets
en komt nooit in de bestanden.

---

## Hoe dit met Meta praat

Er zijn twee routes naar de Instagram API. Wij gebruiken de tweede:

- **Via Facebook-login** — loopt via je Facebook-pagina. Bij ons gaf `/me/accounts`
  nul pagina's terug, omdat YG-Digital een pagina van de nieuwe soort is die aan
  je profiel hangt. Onbruikbaar gebleken.
- **Via Instagram-login** — praat rechtstreeks met je Instagram-account, zonder
  de pagina. Dit is wat hier draait, tegen `graph.instagram.com`.

Je Facebook-pagina blijft gewoon bestaan en gekoppeld; die heb je nodig voor
Business Suite. Hij is alleen niet de weg waarlangs dit script plaatst.

---

## Instellen

### Stap 1 · De map op GitHub (al gedaan)

Staat op **github.com/SteinClaude/yg-instagram**, openbaar.

### Stap 2 · De Meta-app (al gedaan)

App **YG Digital plaatser**, App ID `1602408081320897`, in **ontwikkelmodus**.
Dat is precies goed: zo hoef je geen goedkeuringstraject van Meta in. Dat is
alleen nodig als je namens *andermans* accounts wilt plaatsen.

Je account `ygdigital.nl` heeft daarin de rol **Instagram Tester**, en die
uitnodiging is geaccepteerd. Zonder die rol weigert Meta met *"Ontwikkelaarsrol
is niet voldoende"*.

### Stap 3 · De sleutel ophalen

1. Ga naar
   `developers.facebook.com/apps/1602408081320897/instagram-business/API-Setup/`
2. Klap **1. Generate access tokens** open. Daar staat `ygdigital.nl`.
3. Klik **Generate token** en kopieer de sleutel.

De sleutel is 60 dagen geldig. Je accountnummer staat er meteen naast:
**17841434765692615**.

### Stap 4 · Controleren

Draai in deze map:

```powershell
node gereedschap/controleer.cjs 17841434765692615 "JOUW_SLEUTEL"
```

Je hoort te zien: `Sleutel werkt. Account: @ygdigital.nl`

### Stap 5 · De sleutels in GitHub zetten

Repo → **Settings → Secrets and variables → Actions → New repository secret**.
Twee stuks:

| Naam | Waarde |
|---|---|
| `IG_USER_ID` | `17841434765692615` |
| `IG_TOKEN` | de sleutel uit stap 3 |

Deel die sleutel met niemand: hij geeft toegang tot je Instagram-account.

### Stap 6 · Proefdraaien

Repo → tabblad **Actions** → *Plaatsen op Instagram* → **Run workflow**.

Staat er niets op het programma, dan zegt hij "Niets te plaatsen op dit moment"
en controleert hij je sleutel. Dat is een geslaagde proef.

Wil je echt iets zien verschijnen: zet in `planning.json` de datum en tijd van
het eerste item op vandaag en een paar minuten geleden, en draai opnieuw.

Vanaf dan draait hij vanzelf: GitHub start hem elke tien minuten. GitHub is daar niet stipt in (een start kan
later komen of wegvallen); wat dat betekent en wat eraan te doen is, staat in `docs/automaat-alle-kanalen.md`.

---

## Tweede account: Instagram van kanaal 1

Sinds 9 nov 2026 kan de automaat ook plaatsen op het Instagram-account van
YouTube-kanaal 1 (YG-Social). Andries besliste dat, en ook dat Manon de automaat
bouwt (zie `docs/plan-instagram-kanaal-1.md`). Een item met `"account": "kanaal-1"`
gaat naar dat account. Een item zonder `account` gaat zoals altijd naar @ygdigital.nl.

Naam en accountnummer van kanaal 1 komen **nooit** in deze map: de map en de
logboeken van Actions zijn openbaar. Het nummer staat alleen in de geheimen. In
foutmeldingen haalt het script het nummer eruit.

### Eenmalig instellen (Andries, ±15 minuten)

1. **Professioneel account.** Open in de Instagram-app het account van kanaal 1 en
   ga naar Instellingen → *Accounttype en hulpmiddelen* → *Overstappen naar
   professioneel account* → **Creator**. Een Facebook-pagina is niet nodig.
2. **Tester in de bestaande Meta-app.** Open developers.facebook.com → de app van
   stap 2 → *App-rollen* → *Rollen* → *Instagram Testers* toevoegen. Vul daar het
   account van kanaal 1 in. Accepteer de uitnodiging daarna in Instagram, onder
   Instellingen → *Apps en websites* → *Uitnodigingen van testers*.
3. **Sleutel ophalen** zoals in stap 3. Bij *Generate access tokens* staat nu ook
   kanaal 1. Klik daar **Generate token**. Het accountnummer staat ernaast.
4. **Controleren** op je eigen computer:
   `node gereedschap/controleer.cjs <ACCOUNTNUMMER> "<SLEUTEL>"`
5. **Twee geheimen** in GitHub (Settings → Secrets and variables → Actions):

   | Naam | Waarde |
   |---|---|
   | `IG_USER_ID_K1` | het accountnummer van kanaal 1 |
   | `IG_TOKEN_K1` | de sleutel uit punt 3 |

6. **Proef** (Actions → *Plaatsen op Instagram* → *Run workflow*). Vul bij
   *proefvideo* het adres van een Instagram-versie in, bijvoorbeeld
   `https://steinclaude.github.io/yg-instagram/pakketten/2026-11-09-YS01-stopbord/instagram/reel.mp4`,
   en zet *proefaccount* op `kanaal-1`. Er wordt niets geplaatst; je ziet alleen
   of Instagram de video aanneemt.

Zolang de twee geheimen ontbreken, doet kanaal 1 niet mee en blijven de items
staan. Voor @ygdigital.nl verandert er niets.

### Een short in de planning zetten (Manon)

Alleen na **"pakket OK <code>"** én **"bijschrift OK <code>"** van Andries.

```powershell
node gereedschap/short/instagram.cjs <pakketmap> [--ms 800]
#   maakt pakketten/<map>/instagram/reel.mp4 (geluid 48 kHz, ±9 MB) en omslag.jpg
#   bijschrift.txt zet Manon zelf in dezelfde map
node gereedschap/plan-reel.cjs --account kanaal-1 pakketten/<map>/instagram/reel.mp4 pakketten/<map>/instagram/omslag.jpg pakketten/<map>/instagram/bijschrift.txt <datum> <tijd> YSxx --proef
#   zonder --proef: zet het item in planning.json (id <datum>-k1-ysxx)
```

De video wordt niet naar `beeld/` gekopieerd. Het item wijst rechtstreeks naar het
pakket, en Instagram haalt hem op via GitHub Pages.

Sinds 19 nov 2026 kan dit ook met `gereedschap/inplannen.cjs` (zie "Inplannen door de maker"). Dat
commando doet dezelfde controles, kijkt daarnaast in `keuring.json` of het pakket OK en het bijschrift OK
er zijn, en legt zelf vast. `plan-reel.cjs` blijft werken zoals het deed.

### Sleutel vernieuwen

Dit gaat zoals bij @ygdigital.nl, maar dan bij het geheim `IG_TOKEN_K1`. De
waarschuwing ("Sleutel vernieuwen") noemt per account welk geheim aan de beurt is.
In `sleutel.json` staat kanaal 1 onder `"kanaal-1"`, net als bij @ygdigital.nl
alleen met een vingerafdruk van de sleutel.

---

## Meer accounts: kanaal 2, account 3 en wat daarna komt

De automaat kent vier accounts. Ze staan in één tabel, `src/accounts.cjs`, één regel per account:

| `account` in een item | Heet in logboek en status | Geheim met de sleutel | Geheim met het accountnummer | Codes |
|---|---|---|---|---|
| (leeg) | @ygdigital.nl | `IG_TOKEN` | `IG_USER_ID` | R17, K02 |
| `kanaal-1` | kanaal 1 | `IG_TOKEN_K1` | `IG_USER_ID_K1` | YS48, YL02 |
| `kanaal-2` | kanaal 2 | `IG_TOKEN_K2` | `IG_USER_ID_K2` | K2-W06 |
| `account-3` | account 3 | `IG_TOKEN_K3` | `IG_USER_ID_K3` | G11 |

Wat voor kanaal 1 geldt, geldt per account:

- **Naam en accountnummer komen nooit in deze map.** Alleen het label ("kanaal 2") staat erin. Het nummer
  staat in de geheimen; uit foutmeldingen haalt het script het nummer, de naam en de sleutel weg.
- **Ontbreekt een geheim**, dan doet alleen dat account niet mee. Zijn items blijven staan en wachten.
- **Wordt een sleutel geweigerd**, dan staat alleen dat account stil. De andere plaatsen door.
- **Mislukt een post**, dan wacht alleen dat ene item (10, 20, 40 en daarna steeds 55 minuten, tot zijn
  inhaaltijd om is). De andere items en accounts gaan door.
- Elk account heeft een **eigen sleutelteller** (`sleutel.json`) en een **eigen melding** op GitHub, met
  het account in de titel: *Sleutel vernieuwen: kanaal 2*. Voor @ygdigital.nl blijft de titel *Sleutel
  vernieuwen*.

### Een account koppelen (Andries, ±15 minuten per account, één keer)

Doe eerst kanaal 2 helemaal, met de proef erbij, en daarna account 3. De stappen zijn dezelfde als bij
kanaal 1; alleen de namen van de geheimen verschillen.

1. **Professioneel account.** Open in de Instagram-app dat account en ga naar Instellingen →
   *Accounttype en hulpmiddelen* → *Overstappen naar professioneel account* → **Creator**. Een
   Facebook-pagina is niet nodig.
2. **Tester in de bestaande Meta-app.** Open developers.facebook.com → de app van stap 2 → *App-rollen* →
   *Rollen* → *Instagram Testers* toevoegen. Vul daar het account in. Accepteer de uitnodiging daarna in
   Instagram, onder Instellingen → *Apps en websites* → *Uitnodigingen van testers*.
3. **Sleutel ophalen** zoals in stap 3. Bij *Generate access tokens* staat nu ook dit account. Klik daar
   **Generate token**. Het accountnummer staat ernaast.
4. **Controleren** op je eigen computer. Het script zegt daarna onder welke twee namen je ze in GitHub zet:
   `node gereedschap/controleer.cjs <ACCOUNTNUMMER> "<SLEUTEL>" kanaal-2` (of `account-3`)
5. **Twee geheimen** in GitHub (Settings → Secrets and variables → Actions → New repository secret):

   | Account | Naam van het geheim | Waarde |
   |---|---|---|
   | kanaal 2 | `IG_USER_ID_K2` | het accountnummer van kanaal 2 |
   | kanaal 2 | `IG_TOKEN_K2` | de sleutel van kanaal 2 |
   | account 3 | `IG_USER_ID_K3` | het accountnummer van account 3 |
   | account 3 | `IG_TOKEN_K3` | de sleutel van account 3 |

6. **Proef** (Actions → *Plaatsen op Instagram* → *Run workflow*, bij *Use workflow from* blijft `main`
   staan). Vul bij *proefvideo* het adres van een Instagram-versie in, bijvoorbeeld
   `https://steinclaude.github.io/yg-instagram/pakketten/2026-11-09-YS01-stopbord/instagram/reel.mp4`,
   en zet *proefaccount* op `kanaal-2` (of `account-3`). Er wordt niets geplaatst; je ziet alleen of de
   sleutel werkt en of Instagram een video voor dat account aanneemt.

Deel een sleutel met niemand, ook niet met een crewlid: hij geeft toegang tot dat Instagram-account.
Sleutel vernieuwen gaat per account zoals bij @ygdigital.nl (`docs/sleutel-vernieuwen.md`), bij het geheim
van dat account. De melding noemt welk account en welk geheim aan de beurt is.

### De lijst met verboden woorden (Andries, één keer, 2 minuten)

Deze map is openbaar. Het commando waarmee de makers inplannen weigert daarom een bijschrift met een
@naam, een link of een domeinnaam. De namen van je kanalen kan het niet raden: die zet je in een
tekstbestand **buiten git**, één naam per regel.

1. Maak een tekstbestand op een plek die geen repo is, bijvoorbeeld `C:\Users\<jij>\yg-verboden-woorden.txt`.
   Zet er per regel een naam in die nooit in deze map mag komen: de namen en handles van kanaal 1,
   kanaal 2 en account 3, zonder @. Een regel die met `#` begint is commentaar.
2. Zet het pad in een omgevingsvariabele van Windows, één keer, in PowerShell:
   `setx YG_VERBODEN_WOORDEN "C:\Users\<jij>\yg-verboden-woorden.txt"`
   en open daarna een nieuw venster.

Het commando leest de lijst, zegt hoeveel regels het heeft nagekeken en noemt bij een treffer alleen het
regelnummer, nooit het woord. Staat het bestand toch in een map van git, dan weigert het commando.
Zonder lijst werkt het commando wel, maar dan zegt het erbij dat er geen lijst is ingesteld (dat staat
ook in de commit).

### Een volgend account erbij

1. Eén regel in `src/accounts.cjs` (naam, label, kort, de namen van de twee geheimen, de vorm van de
   codes, welke keuringen nodig zijn, de maker).
2. De twee geheimen in GitHub, onder de namen uit die regel. Daarna de stappen van "Een account koppelen".
3. `node gereedschap/toets-automaat.cjs` draaien: alles moet goed zijn.

Aan de workflow verandert niets: die geeft alle geheimen door en het script kiest op naam.

### De stand per account

`status.json` heeft bovenaan `stand`, `bericht` en `sinds` voor de automaat als geheel, zoals altijd.
Daar staat alleen nog "staat stil" als er werk klaarstaat dat niet uit kan. Daaronder staat `accounts`,
met per account: `in orde`, `niet ingesteld`, `sleutel geweigerd`, `geen verbinding` of `item mislukt`,
met de reden en sinds wanneer. Een account op pauze met een geweigerde sleutel, waar niets voor gepland
staat, zet de rest dus niet meer op "staat stil".

---

## Inplannen door de maker

De makers plannen hun eigen posts in: Manon voor kanaal 1, Finn voor kanaal 2, Koen voor account 3. Met
één commando, alleen voor het eigen account, en alleen als de keuring van Andries in `keuring.json` staat
(`docs/PAKKETKAART.md`). Daarna plaatst de automaat vanzelf, zonder browser.

### Eén keer per pc: een eigen, kleine kopie van de automaat

Het commando staat in deze repo. De makers werken niet in de map van Manon: ze gebruiken een aparte,
kleine kopie waar niemand in werkt (alleen de hoofdmap, `gereedschap/` en `src/`; een paar MB, geen video's):

```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/SteinClaude/yg-instagram "$env:USERPROFILE\yg-automaat"
git -C "$env:USERPROFILE\yg-automaat" sparse-checkout set gereedschap src
```

Nodig op de pc: node, git en ffmpeg (met ffprobe). Geen `npm install`.

### Inplannen

Je draait het vanuit je eigen map; de paden zijn paden in je eigen map.

```powershell
git -C "$env:USERPROFILE\yg-automaat" pull --ff-only          # altijd eerst: de nieuwste versie van het commando
node "$env:USERPROFILE\yg-automaat\gereedschap\inplannen.cjs" --account kanaal-2 `
  --pakket pakketten\K2-W06 --video media\K2-W06\reel.mp4 --omslag media\K2-W06\omslag.jpg `
  --bijschrift pakketten\K2-W06\instagram.txt --datum 2026-11-24 --tijd 18:00 --proef
```

Met `--proef` loopt het commando alles na en laat het zien wat er zou gebeuren; er verandert niets. Klopt
het, dan dezelfde regel zonder `--proef`. Voor account 3 is het `--account account-3` met een code als
G11; voor kanaal 1 `--account kanaal-1` met een code als YS48 of YL02.

| Optie | Wat |
|---|---|
| `--account` | `kanaal-1`, `kanaal-2` of `account-3`: je eigen account |
| `--pakket` | de map van je pakket, met `pakket.json` en `keuring.json` |
| `--video` | de video (MP4, H.264, 1080×1920, met geluid) |
| `--omslag` | de omslag (JPEG, 1080×1920) |
| `--bijschrift` | een tekstbestand met het bijschrift |
| `--datum`, `--tijd` | wanneer hij uit moet, in Amsterdamse tijd (`2026-11-24`, `18:00`), minstens een uur vooruit |
| `--omslag-ms` | het videobeeld (in milliseconden) dat de omslag wordt als Instagram je eigen omslag weigert; standaard 800 |
| `--bron` | een domeinnaam die als bron in het bijschrift mag blijven staan (`--bron timeanddate.com`); mag vaker |
| `--naschrift` | een extra regel onderaan de commit (de regels die je sessie voorschrijft); mag vaker |
| `--proef` | alles nalopen en tonen, niets wijzigen |

Wat het commando doet:

1. **Keuring.** Het leest `keuring.json`. Per soort die je account vraagt (kanaal 1: pakket en bijschrift;
   kanaal 2 en account 3: pakket) telt het laatste besluit. `niet-ok` en `ingetrokken` zijn geen OK. Heb je
   na het OK opnieuw gevraagd (een nieuw tijdstip in `vraagt`), dan telt het oude OK niet meer. De
   letterlijke woorden van Andries en de tijd komen in de commit.
2. **Video.** Hij moet aan de eisen van Instagram voldoen. Klopt alleen het geluid of de verpakking niet
   (bijvoorbeeld 96 kHz, een edit list, moov niet vooraan), dan maakt het commando zelf de Instagram-versie,
   zonder het beeld opnieuw te coderen. Je eigen bestand blijft zoals het is. Een video in de verkeerde
   maat, zonder geluid of groter dan 25 MB weigert het.
3. **Bijschrift.** Niet leeg, hoogstens 2200 tekens en 30 hashtags, geen @naam, geen link, geen
   domeinnaam en geen woord uit de lijst met verboden woorden. Noem je een bron die als domein heet
   ("timeanddate.com"), geef die dan mee met `--bron`; dat staat dan in de commit. Adressen van eigen
   profielen (Instagram, YouTube, TikTok, een linkpagina) mogen nooit.
4. **Dubbel.** Een code, id of tijdstip dat voor jouw account al bestaat, weigert het.
5. **Vastleggen.** Het zet de video en de omslag onder `beeld/<account>/`, maakt een kleintje voor het
   dashboard en voegt één item toe aan `planning.json`. Alleen die paden. Legde iemand anders net iets
   vast, dan rekent het commando alles opnieuw uit op de nieuwe stand.

Aan het eind zegt het commando welke regel je op de kaart van je pakket zet (`pakket.json`, bij
`plaatsen`). Zegt het `STOP:`, dan is er niets gewijzigd; de reden staat erachter.

### Een item terughalen

Trok Andries zijn OK in, moet de tijd anders of is een item overgeslagen? Haal het eerst uit de planning
en plan daarna opnieuw in:

```powershell
node "$env:USERPROFILE\yg-automaat\gereedschap\inplannen.cjs" --intrekken --account kanaal-2 --code K2-W06 --reden "tijd wordt 20:00"
```

Dat kan alleen met een item van je eigen account dat nog niet geplaatst is. De reden komt in de commit:
geen namen, geen links. Een post die al op Instagram staat, haalt alleen Andries weg.

### Wat je als maker niet doet

- Niet met de hand in `planning.json` schrijven en niets anders in deze repo vastleggen: alleen via het
  commando, alleen voor je eigen account.
- Geen naam, handle of link van je kanaal in het bijschrift, in een `--naschrift` of in een `--reden`.
- De workflow niet starten en geen geheimen lezen of vragen.

---

## Onderhoud

### Elke twee maanden: de sleutel vernieuwen

Instagram-sleutels gaan 60 dagen mee. Het script houdt bij hoe oud de jouwe is
en maakt twaalf dagen van tevoren een melding op GitHub met de titel
*Sleutel vernieuwen* — daar krijg je een mailtje van. Dan doe je:

```powershell
node gereedschap/vernieuw-token.cjs "HUIDIGE_SLEUTEL"
```

en zet je de nieuwe waarde bij `IG_TOKEN` (knop **Update**).

Je hebt hier geen App ID of App Secret voor nodig; bij deze route vernieuwt de
sleutel zichzelf. Wel moet de sleutel minstens 24 uur oud zijn.

**Doe je dit niet, dan stopt het plaatsen stil.** Daarom die waarschuwing.

### Als de voorraad op is

De planning loopt twaalf weken. Voor een nieuwe reeks:

```powershell
node gereedschap/klaarzetten.cjs 2026-12-07 12
```

Daarna `git add -A`, `git commit -m "nieuwe planning"`, `git push`.

Heb je in `yg-luxury/instagram/` teksten of platen aangepast? Draai daar dan
eerst `node instagram/maak.cjs` en `node instagram/voorraad.cjs`, en daarna
`klaarzetten.cjs` hier.

### Iets overslaan of wijzigen

Open `planning.json`, haal het item weg of verander de datum, en push.
Wat in `gedaan.json` staat wordt nooit opnieuw geplaatst.

---

## Als er iets misgaat

**De Action staat op rood.** Klik erop en lees de laatste regel. De meldingen
van Instagram zijn letterlijk leesbaar ("Instagram weigert …").

**"Sleutel werkt niet meer"** — verlopen of verkeerd gekopieerd. Doe stap 3
tot en met 5 opnieuw.

**"Instagram kon het beeld niet verwerken"** — controleer of de map op GitHub
echt **Public** staat; anders kan Instagram de plaat niet ophalen.

**"Ontwikkelaarsrol is niet voldoende"** — de Instagram Tester-rol is
ingetrokken. Opnieuw toekennen bij *App roles → More → Instagram Testers*, en
accepteren op `instagram.com/accounts/manage_access/`.

**Eén account plaatst niet, de andere wel.** Open `status.json` en kijk onder `accounts` bij dat
account. Daar staat de reden: `niet ingesteld` (de twee geheimen ontbreken), `sleutel geweigerd` (nieuwe
sleutel nodig, zie de melding op GitHub), `geen verbinding` (gaat vanzelf over) of `item mislukt` (met
het id van het item en wat Instagram zei). Een item dat niet klopt of steeds mislukt, haalt de maker
terug met `inplannen.cjs --intrekken`.

**Groen, maar er verschijnt niets.** Kijk in de logs naar "Nu in Amsterdam";
waarschijnlijk was er niets aan de beurt, of het stond al in `gedaan.json`.

**Een post komt uren te laat.** Kijk in de lijst met runs (Actions → *Plaatsen op Instagram*) rond de
plaatstijd. Staan er geen runs, dan heeft GitHub ze niet gestart; druk op *Run workflow*. Staat er één run
die lang loopt, dan houdt die de rest tegen: er draait er nooit meer dan één. Zo'n run stopt vanzelf (het
plaatsen na 30 minuten, de hele run na 45); wat al geplaatst is, wordt dan nog bewaard.

**Alles moet stoppen.** Repo → Settings → Actions → *Disable actions*. Of
verwijder de twee secrets; dan stopt het script met een nette melding.

---

## Wat dit niet doet

Reageren op reacties en berichten. Een account dat plaatst maar nooit
antwoordt doet het slechter dan een account dat minder plaatst en wel
reageert. Dat blijft handwerk — vijf minuten per dag, en het is het deel dat
klanten oplevert.
