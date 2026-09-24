# Highlight Entree: voorstel voor drie verhalen

Stand 23 september 2026. Vertrekpunt: de teksten en beeldideeën van Gijs en ChatGPT.
Nog niets gemaakt, niets gegenereerd, niets geplaatst.

## Uitgangspunten voor alle drie

- Formaat 1080 x 1920, 24 beelden per seconde (tempo van clips en opnamen), H.264, stil bestand.
  Muziek zet Gijs er zelf in de app onder, zoals bij de eerdere verhalen.
- Tekst gaat er als laatste overheen met de tekenmachine van de platen (`platen/maak.cjs`):
  Playfair Display voor de kop, Montserrat voor de rest, goud `#C9A45C`, ivoor `#F3EEE4`.
  Zo blijft de tekst scherp en woord voor woord zoals afgesproken. Nooit tekst laten genereren.
- Veilige zone: tekst tussen 240 en 1440 (boven zit de voortgangsbalk, onder de antwoordbalk).
  Embleem bovenin, yg-digital.nl onderin, de plaat is van boven tot onder gevuld.
- Toon: u-vorm, rustig, geen effecten behalve zacht opkomen van tekst (0,4 s) en de camerabeweging zelf.
- Ieder verhaal is een los bestand; Gijs plaatst ze zelf in de volgorde 1, 2, 3 en zet ze daarna in
  Entree. Verhaal 3 krijgt in de app de linksticker; die kan niet via de automaat.
- Leesduur: een kop van vijf woorden vraagt 2 s, een zin van twaalf woorden 4 s. Alles blijft
  minstens twee keer zo lang staan als nodig, zodat ook een trage lezer klaar is.

## Verhaal 1: Welkom (8 seconden)

**Beeld en beweging.** Een echte entree: een stijlvolle deur of doorgang met warm licht, de camera
schuift heel langzaam naar voren of opzij (een paar procent over de hele clip). Geen mensen, geen
gezichten, geen leesbare naam of logo in beeld. Donker en warm, zodat het bij de site past.

**Tekst en leesduur.**

| moment | tekst | plek |
|---|---|---|
| 0,0 s | YG DIGITAL (bovenregel, goud, kleine kapitalen) | boven de kop |
| 0,6 s | De entree van uw bedrijf. (kop, Playfair) | onderste derde, rond 1180 |
| 2,4 s | Een goede eerste indruk begint online. (regel, Montserrat) | onder de kop, tot 1400 |

Alles blijft staan tot het einde; de kop staat 7 s, de regel 5,5 s.

**Duur.** 8 s. Korter voelt gehaast bij een langzame camerabeweging, langer voegt niets toe.

**Benodigd.** Eén staande clip van minstens 8 s, of 5 s clip plus 3 s doorzoom op het laatste beeld
(dat doet `gereedschap/reel.cjs` al voor de reels).

**Echt of Runway.** Echt. Voorkeur: een bestaande opname van Pexels (gratis, ook zakelijk, geen
naamsvermelding nodig). Pexels heeft staande entree-video's, maar veel met een hotelnaam in beeld;
selectie op: geen naam of logo, geen gezicht, trage camera, minstens 8 s, 4K of 1080p.
Tweede keus: een echte foto van Pexels als startbeeld en Runway alleen voor de beweging
(beeld naar video, 5 s op 1080p = 200 credits). Volledig genereren raad ik af: dat gaf eerder
de beelden die Gijs niet geloofwaardig vond. De bestaande clips in `platen/bron/clips/` vallen af:
de deur is al gebruikt in reel R01, de poort en de boogdeur ogen gegenereerd.

## Verhaal 2: Wat we doen (10 seconden)

**Beeld en beweging.** De echte startpagina van yg-digital.nl op telefoonbreedte, van boven naar
beneden gescrold in één rustige beweging: van de kop "De entree van uw bedrijf" tot en met het blok
YG Launch. Een schermopname, geen nabouw. De opname vult de hele plaat; boven en onder ligt een
zacht donker verloop (zoals op de bestaande platen) waarin de tekst staat.

**Tekst en leesduur.**

| moment | tekst | plek |
|---|---|---|
| 0,5 s | Uw website. Onze aandacht. (kop) | bovenin, rond 380 |
| 2,0 s | Met YG Launch bouwen we uw website en verzorgen we daarna het beheer. | onderin, 1180 tot 1340 |
| 6,0 s | Persoonlijk, met duidelijke afspraken. | eronder, tot 1420 |

De kop staat 9,5 s, de lange zin 8 s, de korte zin 4 s.

**Duur.** 10 s. De scroll zelf duurt ongeveer 7 s en komt de laatste seconden tot stilstand.

**Benodigd.** Een schermopname van de startpagina op 360 x 640 css-pixels met drievoudige schaal,
dus precies 1080 x 1920. Cookiemelding vooraf weggeklikt, geen muisaanwijzer, geen browserbalken.
Ik kan die opname scriptmatig maken met de Chrome of Edge die op de pc staat (beeld voor beeld,
dus de scroll is volmaakt gelijkmatig en na een sitewijziging in een minuut opnieuw te maken).
Alternatief: Gijs neemt het op met zijn iPhone en zet het bestand in `yg-luxury/opnames/`;
dan snijden we de Safari-balken eraf.

**Echt of Runway.** Alleen echt. Runway komt hier niet aan te pas; de site is het bewijs.

## Verhaal 3: Even binnenkijken (15 seconden)

**Beeld en beweging.** Een schermopname van de ontwerpstudio in drie stukken, achter elkaar
gemonteerd zonder overgangen:

1. 0 tot 4 s: "Open de poort": de boog die zichzelf tekent en de deuren die opengaan. Dit is echte
   schermanimatie van de site, geen Runway.
2. 4 tot 8 s: stap één: de naam "Uw bedrijf" wordt ingetypt en een branche wordt aangetikt.
   Versneld gemonteerd (het echte tikken duurt langer), zodat het als één handeling leest.
3. 8 tot 15 s: de onthulling op volledig scherm: het eerste ontwerp verschijnt en de studio loopt
   er rustig doorheen ("Wij lopen even met u mee").

De naam is bewust "Uw bedrijf": dan leest het als voorbeeld en niet als een klant die niet bestaat.
Welke branche we aantikken is een keuze: Kapper & salon geeft het warmste beeld, Kantoor &
dienstverlening het meest neutrale.

**Tekst en leesduur.**

| moment | tekst | plek |
|---|---|---|
| 0,8 s | Hoe zou uw website eruitzien? (kop) | bovenin, rond 380 |
| 4,5 s | Ontdek de ontwerpstudio en bekijk een eerste ontwerp voor uw bedrijf. | onderin, 1180 tot 1340 |
| 11,0 s | Bekijk uw eerste ontwerp → (afsluiting, goud) | 1390, met pijl |

Ruimte voor de linksticker: het vak 1460 tot 1620 blijft leeg en donker; dat is precies boven de
antwoordbalk. Gijs plaatst de sticker daar in de app; de bestemming is nog niet bevestigd
(logisch is yg-digital.nl/eerste-ontwerp).

**Duur.** 15 s. Dat is de bovengrens die ik aanhoud voor een kennismaking; korter dan 8 s voor de
onthulling en het ontwerp is niet te zien.

**Benodigd.** Drie schermopnamen van de studio op telefoonmaat (zelfde opzet als verhaal 2), plus
één keuze: branche en sfeer. De onthulling op "Volledig scherm" laten lopen, anders is het
voorbeeldvenster op een telefoon te klein.

**Echt of Runway.** Alleen echt. De poort van de studio is al de beweging die we zoeken.

## Kosten en middelen

- Runway-saldo op 23 september: 723 credits (173 uit het abonnement, 550 bijgekocht).
- Dit voorstel kost 0 credits als Pexels een goede entree oplevert, anders 200 voor verhaal 1.
- Verhaal 2 en 3 kosten geen credits: schermopnamen en eigen montage met ffmpeg.
- Eenmalig nodig voor de scriptmatige opnamen: het npm-pakket Playwright in de Instagram-repo,
  dat de aanwezige Chrome of Edge gebruikt (geen extra browser downloaden).

## Zwakke plekken, eerlijk gezegd

- Het huidige Entree-verhaal (23 september, lichte plaat met de deur) is licht en ivoor; deze drie
  zijn donker. Beslissen: die lichte plaat eruit, of het contrast accepteren.
- Verhaal 1 en het bestaande verhaal zeggen allebei "De entree van uw bedrijf." Dat is de merkzin,
  maar twee keer achter elkaar in dezelfde highlight is één keer te veel.
- Een schermopname van de studio toont een voorbeeldsite voor een kapper. Dat is de studio zelf,
  geen klantproject, maar de plaat moet dat ook laten zien: daarom de naam "Uw bedrijf" en de tekst
  "een eerste ontwerp voor uw bedrijf".
- Een linksticker dekt een deel van het beeld af; vandaar het lege vak. Als Gijs de sticker ergens
  anders zet, valt hij over de tekst.

## Stand 23 september, avond (na akkoord)

- Verhaal 2 en 3 staan als proef klaar: `platen/uit/highlights/H02/H02-proef.mp4` en
  `H03/H03-proef.mp4`, met nagebootste telefoonbalken en het stickervak erop getekend.
- Gereedschap: `gereedschap/opname.cjs` (site en studio), `gereedschap/verhaal-video.cjs`
  (montage en tekstlagen), spec in `teksten/highlights-nl.cjs`. Playwright-core gebruikt de
  Chrome op de pc; de lessen over de screencast staan bovenin opname.cjs.
- Afwijking van het voorstel: de kop staat bij alle drie ONDERIN, niet bovenin. Tekst
  bovenin botste met de tekst van de site zelf (even groot, even licht) en las als tekst
  over tekst. Onder ongeveer 880 pixels is het verloop nu vrijwel dicht.
- Verhaal 3: branche Kapper & salon, sfeer Warm & ambachtelijk (leest duidelijk als een
  andere site dan die van YG), naam "Uw bedrijf". De rondleiding van de studio scrolt op
  telefoonmaat niet vanzelf; het ontwerp wordt in de opname zelf rustig gescrold.
- Verhaal 1: Pexels-video 35466110 (hal met kroonluchter), de eerste acht seconden op
  looptempo, 30 beelden per seconde. Gekozen op mijn advies toen Gijs "gaan we verder" zei
  zonder nummer; ruilen is één download.

## Stand 24 september: af

De drie verhalen staan definitief in `beeld/highlights/entree/` (H01.mp4, H02.mp4, H03.mp4) en
op GitHub Pages: https://steinclaude.github.io/yg-instagram/highlights.html. Op die pagina
kan Gijs ze op de telefoon bewaren. Plaatsen gaat met de hand in de app: volgorde 1, 2, 3,
muziek naar keuze, op verhaal 3 de linksticker in het lege vak onderin, daarna elk verhaal
toevoegen aan de highlight Entree. Nog te beslissen: de lichte plaat die nu in Entree staat,
en de bestemming van de sticker (advies: yg-digital.nl/eerste-ontwerp).

## Aanvulling vanuit de YG-sitesessie (23 september, avond)

- Plaat entree-2 (`platen/highlights.cjs`) zei "Voor hosting, onderhoud en back-ups" bij het
  maandbedrag. Sinds 23 sep betaalt de klant JouwWeb zelf; op verzoek van Gijs is de tekst nu
  "Voor onderhoud, back-ups en kleine wijzigingen." Die plaat is nooit gerenderd of geplaatst
  (de foto `bron/highlights/entree-2.jpg` bestaat nog niet).
- "Antwoord binnen één werkdag" is weer een vaste afspraak van Gijs: staat sinds 23 sep op de
  contactpagina, in de Instagram-bio en in de Facebook-bio. Het verbod daarop in het commentaar
  van highlights.cjs is bijgewerkt.
- Bedragen YG Launch staan sinds 23 sep (avond) live op de site: EUR 750 eenmalig (907,50 incl.
  btw) en EUR 49 per maand (59,29 incl. btw). Vast bedrag, geen vanaf-prijs, nooit twee eenheden
  naast elkaar.
- **Besluit Gijs 23 sep: geen plaat entree-2 maken en geen credits uitgeven.** Het nieuwe
  Entree-plan met drie video's hierboven vervangt de oude platenreeks. De teksten in die video's
  volgen het nieuwe aanbod: het beheer is onderhoud, back-ups en kleine wijzigingen; de hosting
  betaalt de klant rechtstreeks aan JouwWeb, zonder opslag. Dus nergens "hosting" in het
  maandbedrag, en verhaal 2 ("verzorgen we daarna het beheer") klopt zo.
