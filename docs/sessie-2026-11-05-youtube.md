> Openbare versie: namen en handles van de kanalen staan niet in deze repo.

# Draaiboek: YouTube-kanalen klaarmaken

**Donderdag 5 november 2026, 16:30–19:45.** Andries beslist, logt in en keurt. Manon werkt in haar sessie op de pc en via Claude in Chrome in zijn browser. Finn werkt in zijn eigen sessie, zonder browser. Eva leest mee in git.

**Hoe dit draaiboek gemaakt is:** door Eva op 5 nov tussen 12:15 en 13:42, met drie agents. Die maakten een inventaris van Manons map en zochten de stappen voor YouTube en Google uit, plus het beeld en de accountnamen. Een vierde agent die er niet aan meewerkte, controleerde elke stap; zijn verbeteringen zijn verwerkt. Daarna liep Eva de versie met Finn nog eens na tegen de bronnen, Manons map en je bureaublad.

**Dit draaiboek vervangt** Manons "Stappenlijst YG-Social (agenda do 5 en vr 6 nov)" op je bureaublad.

**Zo werkt het:** per stap staat wie het doet, wat precies, en een **controle** (hoe je ziet dat het goed is). Een stap is pas af als de controle klopt. Besluiten over kanaal 1 zeg je in de sessie van Manon, over kanaal 2 in die van Finn; zij citeren ze letterlijk in git (C27). Zinnen in **vet** typ je letterlijk.

**De kanalen (jouw besluiten van vandaag):**
- **Kanaal 1:** het hoofdkanaal. Hier komen YS ("waarom gewone dingen zijn zoals ze zijn") en vreemd maar waar (YH). Vanavond draait alles om dit kanaal.
- **Kanaal 2:** is van Finn, het nieuwe crewlid onder YG-Social (jouw keuze van 13:24). Vanavond voert Finn zijn eerste gesprek met jou over wat kanaal 2 wordt; het GTA 6-idee is daarbij achtergrond, geen opdracht. Verder alleen de beveiliging en de telefoonverificatie.

---

## 16:30–16:45 · Start (15 min)

- [ ] **R1 · Repo voor Finn:** ga naar github.com/new.
  - Eigenaar SteinClaude, naam `yg-kanaal-2`, **Private**, zonder README → Create repository.
  - Zeg in de chat bij Eva: **repo staat**. Eva zet Finns werkplek erin en antwoordt **werkplek staat** (±3 minuten). Wacht daarop: clone je eerder, dan is de map leeg en weet Finn niet wie hij is.
  - Krijgt Eva geen toegang tot de nieuwe repo, dan zegt ze welke ene stap jij doet (meestal: de repo toevoegen aan de Claude-app op GitHub).
- [ ] **R2 · Op je pc, na "werkplek staat":** open Terminal en typ: `git clone https://github.com/SteinClaude/yg-kanaal-2 C:\Users\gijsm\yg-kanaal-2`
- [ ] **R3 · Finn starten:** open in Claude Code een nieuwe sessie in de map `C:\Users\gijsm\yg-kanaal-2` en typ: **ga verder**. Vraagt Claude Code of je de map vertrouwt: ja.
  - Finn stelt zich voor en stelt zijn eerste vragen. Die mogen wachten tot blok F (na 17:40): hij doet niets tot jij antwoordt. Hij heeft vanavond geen Chrome nodig.
  - **Controle:** Finn noemt zijn naam en kanaal 2; Eva ziet zijn stand op "werkt" in git.
- [ ] **S1 · Andries:** open de sessie van Manon en typ: **ga verder**
- [ ] **S2 · Manon:** `git pull` en dit draaiboek lezen (`docs/sessie-2026-11-05-youtube.md`). Haar stand op "werkt" zetten en pushen.
  - Daarna wacht ze tot blok 1 klaar is: ze werkt pas in Chrome als jij haar het venster geeft (K4).
  - Intussen controleert ze of alle bestanden voor YS04–YS18 en YK01 klaarliggen.
- **Controle:** Manon meldt in haar sessie dat ze begonnen is; Eva ziet haar stand op "werkt" in git.

---

## 16:45–17:25 · Blok 1 · Werkplek en beveiliging (Andries, 40 min)

- [ ] **B1 · Chrome-profiel "Kanaal 1":** klik op je profielicoon rechtsboven → Profiel toevoegen → aanmelden met het Google-account van kanaal 1.
  - Installeer in dat profiel Claude in Chrome uit de Chrome Web Store.
  - Meld de extensie aan met **hetzelfde Claude-account als de sessie van Manon**.
  - **Meteen testen:** typ in Manons sessie `/chrome` en kies bij "Select browser…" dit profiel. Laat Manon studio.youtube.com openen en de naam van het kanaal noemen (links, onder de kanaalfoto).
  - **Lukt de test niet binnen 5 minuten:** gebruik je gewone Chrome-profiel; daar werkte Claude in Chrome eerder wel. Meld je daar aan met het Google-account van kanaal 1 en wissel in Studio van kanaal via je accountfoto rechtsboven → "Account wisselen" (Engels: Switch account).
  - **Controle:** Manon leest de naam van kanaal 1 in Studio voor.
- [ ] **B2 · Chrome-profiel "Kanaal 2":** hetzelfde met het Google-account van kanaal 2. Claude in Chrome mag hier later; vanavond is dit profiel alleen voor jou.
  - **Controle:** studio.youtube.com toont in dit profiel de naam van kanaal 2.
- [ ] **B3 · Telefoon klaarzetten:** meld op je telefoon beide Google-accounts aan, bijvoorbeeld in de YouTube- of Gmail-app. De Google-melding van B4 komt daar binnen.
- [ ] **B4 · Tweestapsverificatie, per account:**
  - In het profiel van dat account: myaccount.google.com → Beveiliging (Engels: Security & sign-in) → Verificatie in 2 stappen → aanzetten met de Google-melding.
  - Daarna: back-upcodes (Engels: Backup codes) → codes ophalen → de 10 codes overschrijven op papier.
  - Eerst kanaal 1, dan kanaal 2.
  - **Controle:** Beveiliging toont "Verificatie in 2 stappen: aan"; het papier met 2 × 10 codes ligt in je map thuis.
  - De codes komen nooit in de chat, in een bestand, in een foto of bij Manon. Maak je later nieuwe codes aan, dan vervallen de oude.
  - Dit mag ook later: niets vanavond hangt ervan af. Kost het meer dan 20 minuten, ga dan door met B5.
- [ ] **B5 · Telefoonnummer verifiëren in YouTube, per kanaal:** Studio → Instellingen → Kanaal → Toegang tot functies → Aanvullende functies → Telefoonnummer verifiëren (sms of telefoontje). Staat het er al als "Ingeschakeld", sla het over.
  - **Waarom:** daarmee kun je video's langer dan 15 minuten uploaden en een eigen miniatuur kiezen; vooral handig voor kanaal 2. Voor de shorts van vanavond is het niet nodig.
  - **Niet voor de daglimiet:** een hogere daglimiet voor uploads hoort bij de geavanceerde functies. Die krijg je met genoeg kanaalgeschiedenis, of met verificatie met een identiteitsbewijs of een video; dat doe je vanavond niet.
  - Eén nummer kan per jaar 2 kanalen verifiëren. Voor een derde kanaal later heb je dan een ander nummer nodig.
  - **Controle:** bij Toegang tot functies staan de aanvullende functies op "Ingeschakeld".
- **Afvinken in het Kantoor:** t-c02 (profielen) en t-c04 (tweestapsverificatie), of zeg het Eva in de chat.

---

## 17:25–17:40 · Blok 2a · Kanaal 1: keuren en toestemming (Andries + Manon, 15 min)

- [ ] **K1 · YS15–YS18 keuren.** Bekijk ze op de pagina "YG-Social voorraad" (je Claude-artifacts) of in Manons map.
  - De avondronde van 4 nov vond ze technisch in orde (steekproef YS17 klopt met de bron) en adviseert pakket OK.
  - Typ per code: **pakket OK YS15**, **pakket OK YS16**, **pakket OK YS17**, **pakket OK YS18**, of zeg wat anders moet.
  - **Controle:** Manon citeert elk OK letterlijk met tijd in haar oplevering, onder "Besluiten met Andries", en pusht.
- [ ] **K2 · Toestemming om in te plannen:** typ **ja, plan YS04 t/m YS14 in en zet YK01**. Is K1 rond, typ dan ook **ja, ook YS15 t/m YS18**.
- [ ] **K3 · Bio en banner van kanaal 1:**
  - Lees de bio voor kanaal 1 in `02 YG-Social\Gegevens\01 Overzicht\Bio kanalen (ter keuring).txt`.
  - De bio en de banner van YK01 noemen alleen het YS-onderwerp, terwijl vreemd maar waar nu ook op kanaal 1 komt. Kies: zo zetten en later aanpassen, of eerst aanpassen.
  - Zo zetten: typ **bio OK kanaal 1, Manon mag hem zetten**.
  - Het deel "KANAAL 2" in dat bestand vervalt: kanaal 2 is van Finn.
  - **Controle:** Manon citeert het.

## 17:40–19:30 · Blok 2b · Kanaal 1: kanaalbeeld en inplannen (Manon, ±1 uur 50, in het venster van kanaal 1)

**Reken op ongeveer 12 minuten per short.** Op 2 nov kostten 3 shorts 36 minuten. Vanavond lukken er dus ongeveer 7 à 8; de rest volgt vrijdag 6 nov in je agendablok van 19:30. Dat is ruim op tijd: de eerste short die dan nog open staat, gaat op zijn vroegst 19 nov live (bijlage A).

- [ ] **K4 · Juiste venster:** jij geeft Manon het venster van kanaal 1 (`/chrome` → "Select browser…", zie B1). Manon kijkt vóór elke handeling in Studio of kanaal 1 actief is (naam links onder de kanaalfoto). Bij twijfel stopt ze en vraagt het jou.
- [ ] **K5 · Kanaalbeeld YK01 eerst** (10 min; jouw toestemming staat in K2):
  - Studio → Aanpassing → Profiel. Het oude "tabblad Branding" uit studio.txt heet nu zo.
  - Foto `profielfoto.png`, banner `banner.png` (2560×1440, 0,4 MB), watermerk `watermerk.png` (150×150) → Publiceren.
  - Naam en handle van het kanaal blijven ongemoeid.
  - **Controle:** de kanaalpagina toont de nieuwe foto en banner. Een nieuwe foto kan een paar minuten duren. In het voorbeeld van de banner staat de tekst op alle apparaten volledig in beeld.
- [ ] **K6 · Bio** (alleen na "bio OK kanaal 1, Manon mag hem zetten"): Aanpassing → Profiel → Beschrijving, plus een link (titel + adres yg-digital.nl) → Publiceren.
  - Klikbare links op de kanaalpagina horen bij de geavanceerde functies. Laat Studio de link nog niet toe, dan staat het adres alleen als tekst in de beschrijving; Manon meldt dat.
  - **Controle:** de kanaalpagina toont de beschrijving (en de link, als die er al kon).
- [ ] **K7 · Inplannen, één short per upload, op volgorde van datum.** Eerst YS04 (12 nov), dan YS05, enzovoort; YS15–YS18 alleen met een OK uit K1.
  - Kijk eerst in Studio → Content → Shorts of de titel er al staat: nooit iets dubbel.
  - Maken → Video's uploaden → `video-upload.mp4` van dat pakket (onder 10 MB).
  - Vul de velden in zoals in `studio.txt`, zoals bij YS01–YS03 op 2 nov: titel, beschrijving met bron, tags, gemaakt voor kinderen nee, geen leeftijdsbeperking, betaalde promotie nee, AI-label nee, taal Engels, categorie Onderwijs.
  - Zichtbaarheid → Plannen → datum en 18:00, tijdzone GMT+1 (Amsterdam) → Plannen.
  - **Controle per short:** Manon zet in haar oplevering wat Studio meldt ("Gepland" + datum en tijd) en vergelijkt het met bijlage A.
  - **Bij de melding van de daglimiet** ("Dagelijkse uploadlimiet bereikt", in het Engels "Daily upload limit reached"): stoppen. Manon meldt welke codes nog moeten; die gaan vrijdag verder.

**Andries tijdens blok 2b** (in een ander venster dan dat van Manon): eerst blok 3 (15 min), dan het gesprek met Finn (blok F, ±45 min), daarna als er tijd over is blok 4.

- **Controle van het hele blok:** Studio → Content → Shorts toont elke ingeplande short als "Gepland" met de juiste datum.
- **Afvinken:** t-c06 (YK01) en t-c05 (inplannen, zodra alle elf erin staan).

---

## Blok 3 · Vreemd maar waar op kanaal 1 (Andries + Manon, 15 min, tijdens blok 2b)

- [ ] **V1 · YH01 en YH02:** bekijk ze op de pagina "YG-Social voorraad" (bij kanaal 1). Zeg welke zinnen anders moeten; jouw keuze van 4 nov was "Eerst aanpassen", tekst of feiten.
- [ ] **V2 · Wikimedia Commons:** YH01 en YH02 gebruiken elk vier foto's van Wikimedia Commons (publiek domein, CC0 of CC BY, met naam van de maker in de beschrijving). Kies:
  - **ja, Commons mag voor vreemd maar waar**: het geldt voor YH01, YH02 en de volgende YH-shorts;
  - **nee**: dan heeft Manon een gratis Pexels-sleutel nodig, want Pexels en Pixabay weigerden automatisch ophalen. Die sleutel maak jij aan op pexels.com; hij komt alleen op je pc, nooit in git of in de chat. Of Manon gebruikt alleen eigen animatie.
  - Tot jouw antwoord gebruikt Manon geen nieuw Commons-beeld.
- [ ] **V3 · Ritme:** Manon stelt voor hoe vaak en hoe laat vreemd maar waar naast de YS-shorts (18:00) komt. Jij kiest.
- **Zo stoor je het inplannen niet:** typ je keuzes in Manons sessie zodra ze een short als "Gepland" meldt. Ze legt ze vast en gaat dan verder met de volgende short.
- **Controle:** de drie besluiten staan letterlijk in Manons oplevering. YH wordt vanavond nog niet ingepland: Manon past ze eerst aan en zet ze om naar kanaal 1. Ze staan nog als kanaal 2 in hun bestanden.

---

## Blok F · Finn en kanaal 2 (Andries + Finn, tijdens blok 2b, ±45 min)

- [ ] **F1 · Gesprek:** Finn vraagt wat je met kanaal 2 wilt (doel, onderwerp, jouw tijd, je stem of spelen, shorts of lange video's), met de vragenknoppen. Daarna legt hij 3 richtingen voor, met wat ze opleveren, kosten en riskeren. Het GTA 6-idee van vandaag is er één van, geen opdracht.
- [ ] **F2 · Kiezen:** je kiest een richting of combineert. Finn legt je antwoorden letterlijk vast in git.
- [ ] **F3 · Plan:** daarna schrijft Finn `docs/plan-kanaal-2.md` ter keuring. Hij maakt niets vóór jouw **plan OK**.
- **Grenzen:** Finn logt nergens in, plaatst niets, downloadt geen beeld van anderen en geeft geen geld uit.
- **Controle:** Finns oplevering heeft een kop "Besluiten met Andries" met jouw antwoorden en tijden; zijn stand is gepusht.

---

## Blok 4 · Accountnamen vastleggen voor kanaal 1 (Andries, tijdens blok 2b, als er tijd over is)

Werk niet in het venster waar Manon bezig is. Accountnamen voor kanaal 2 wachten tot jij en Finn weten wat kanaal 2 wordt.

- [ ] **N1–N2 · Kanaal 1:** Instagram en TikTok, in profiel Kanaal 1.
- **X, Snapchat en Pinterest** doe je later.
- **Zo meld je aan:**
  - E-mailadres van het Google-account van dat kanaal, je geboortedatum, en de code die je per mail of sms krijgt.
  - Vraagt een platform om een telefoonnummer dat je niet wilt gebruiken: overslaan tot het tweede nummer er is (t-c10).
- **Regels:**
  - Wachtwoorden alleen in Google Wachtwoordmanager. Codes nooit aan Manon of in de chat.
  - Log af en toe in: een platform kan de naam van een ongebruikt account terugnemen.
- **Controle per account:** de profiellink opent. Zeg Eva welke gelukt zijn; zij zet ze in het Kantoor (Gegevens). **Afvinken:** t-c09 (deels).

---

## 19:30–19:45 · Afsluiten (15 min)

- [ ] **E1 · Manon:** oplevering bijwerken (per short "Gepland" + datum en tijd, alle besluiten letterlijk) en haar stand bijwerken. Bovenaan staat een KLAAR-regel, of KAN NIET VERDER met de codes die vrijdag nog moeten. Alles gepusht.
- [ ] **E2 · Finn:** besluiten en stand gepusht; bovenaan zijn oplevering KLAAR (plan ter keuring) of KAN NIET VERDER.
- [ ] **E3 · Andries:** zeg Eva kort in de chat wat af is, of vink af in het Kantoor.
- **Controle (Eva, dezelfde avond):** ik leg Manons oplevering naast bijlage A, lees Finns besluiten na en meld je elke afwijking.

---

## Bijlage A · Inplanlijst kanaal 1 (elke dag 18:00, Amsterdam)

| Datum | Code | Titel | Stand vóór de sessie |
|---|---|---|---|
| ma 9 nov | YS01 | Why is a stop sign an octagon? (It used to be yellow) | staat al in Studio |
| di 10 nov | YS02 | Why isn't your keyboard in alphabetical order? | staat al in Studio |
| wo 11 nov | YS03 | Why does your whole town share one clock? Blame the railways | staat al in Studio |
| do 12 nov | YS04 | Why is there an @ in every email address? | pakket OK, nog inplannen |
| vr 13 nov | YS05 | Why do Post-it Notes only half stick? | pakket OK, nog inplannen |
| za 14 nov | YS06 | Why your PIN has 4 digits (it was supposed to be 6) | pakket OK, nog inplannen |
| zo 15 nov | YS07 | Why do we say OK? It started as a newspaper joke | pakket OK, nog inplannen |
| ma 16 nov | YS08 | What does SOS stand for? Nothing. | pakket OK, nog inplannen |
| di 17 nov | YS09 | Fold A4 in half and it keeps its shape. Here's why | pakket OK, nog inplannen |
| wo 18 nov | YS10 | This moth was the first "actual" computer bug. The word is older | pakket OK, nog inplannen |
| do 19 nov | YS11 | The $ sign is probably not an S. It's two letters | pakket OK, nog inplannen |
| vr 20 nov | YS12 | Why is the emergency number 999? It started with a fire | pakket OK, nog inplannen |
| za 21 nov | YS13 | Velcro started with a walk with a dog | pakket OK, nog inplannen |
| zo 22 nov | YS14 | The world's first traffic light exploded | pakket OK, nog inplannen |
| ma 23 nov | YS15 | Why is the pound sign an L? | wacht op pakket OK |
| di 24 nov | YS16 | Why does longitude 0° run through Greenwich? | wacht op pakket OK |
| wo 25 nov | YS17 | Non-stick pans started with a gas cylinder that seemed empty | wacht op pakket OK |
| do 26 nov | YS18 | The barcode started as dots and dashes drawn in sand | wacht op pakket OK |

YH01 en YH02 (vreemd maar waar) worden vanavond niet ingepland: eerst V1–V3.

## Bijlage B · Wat klaarstaat (gecontroleerd 5 nov 12:30, git a1f259a)

- **Video's en uploadversies:** alle video's zijn 1080×1920; alle uploadversies zijn kleiner dan 10 MB (7,9–9,4 MB).
- **studio.txt:** titels korter dan 100 tekens; gemaakt voor kinderen nee; AI-label nee.
- **Kanaalbeeld YK01:**
  - profielfoto 800×800;
  - banner 2560×1440 (0,4 MB; maximum 6 MB);
  - watermerk 150×150 (3 kB; maximum 1 MB).
- **Pakket OK, letterlijk geciteerd in git:**
  - YS04–YS07 en YK01: "OK voor alle vijf" (2 nov, b2691db);
  - YS08–YS14: "OK voor alle zeven" (3 nov, 6495672);
  - YS15–YS18 hebben nog geen OK.
- **Openbare map:** geen kanaalnaam of handle, ook niet in de geschiedenis.
- **Bekende punten:**
  - studio.txt van YK01 noemt nog "tabblad Branding" en "Andries zet het zelf".
  - studio.txt van YS04–YS14 zegt nog "Andries (of Eva) plant in".
  - YH01 en YH02 staan in hun bestanden nog als kanaal 2 (19:00, fotostijl van kanaal 2).

## Bijlage C · Bronnen

- **YouTube:**
  - plannen en uploadlimiet: https://support.google.com/youtube/answer/57407 · https://support.google.com/youtube/answer/1270709
  - aanvullende en geavanceerde functies (telefoonverificatie, daglimiet, klikbare links): https://support.google.com/youtube/answer/9890437 · https://support.google.com/youtube/answer/9891124?hl=nl
  - kanaalbeeld en beschrijving: https://support.google.com/youtube/answer/10456525 · https://support.google.com/youtube/answer/2657964
- **Google:** tweestapsverificatie en reservecodes: https://support.google.com/accounts/answer/185839 · https://support.google.com/accounts/answer/1187538
- **Chrome en Claude:**
  - profielen: https://support.google.com/chrome/answer/2364824
  - Claude in Chrome: https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome · https://code.claude.com/docs/en/chrome (10 MB per upload, browser kiezen)
- **Accountnamen:** Instagram: https://help.instagram.com/513717858639392 · inactieve accounts (voorbeeld X): https://help.x.com/articles/15362-inactive-account-policy
