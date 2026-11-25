# Kleine AI-proef kanaal 1: echt en bijna echt (vr 20 nov 2026)

## Besluiten (nieuwste boven)
- **vr 20 nov 2026 ±17:54.** Andries in de sessie: *"maken we echte mensen of bijna echte mensen"*.
  - Op "Welke stijl testen we in de proef?": *"Allebei testen (Recommended)"*.
  - Op de vraag of de proef met Gemini Omni via Google AI Studio tot [bedrag weggelaten] mag kosten: *"Nog niet"*.
- **vr 20 nov 2026 ±17:00.** *"kunnen we met gemini dit goed doen?"* Uitkomst: alleen Gemini Omni 1.2 Flash via de betaalde Gemini API past (`docs/waaromdorp/gemini-onderzoek.md`).
- **vr 20 nov 2026 ±16:38.** Op de vraag welke dienst en welk bedrag (Gemini Omni of Kling): *"Something else"*.
- **vr 20 nov 2026 ±16:27.** Op "Welke 3D-route kies je?": *"Kleine AI-proef"*. Dit volgt op de Blender-proef (`docs/waaromdorp/3d-proef.md`).

**Stand:** er is niets betaald en niets aangemaakt. Dit plan ligt klaar, zodat de proef meteen kan starten na een OK per bedrag.
- **Wie wat doet.** Andries maakt het project in Google AI Studio aan, met vooruitbetaling en een uitgaveplafond, en zet de sleutel zelf op de pc, net als bij ElevenLabs. De sleutel komt nooit in git.
- **Wat het OK dekt.** Het OK per bedrag geldt voor alles wat via de API gaat:
  - de referentiebeelden met herkansingen, als ze niet gratis in Flow gemaakt worden;
  - de filtertoetsen;
  - de 12 clips;
  - elke aanpassing van een clip.

  Het uitgaveplafond in AI Studio staat op precies dat bedrag. Is het op, dan stop ik en vraag ik een nieuw OK. De geldvraag gaat dus over **de hele AI-proef via de Gemini API (beelden en clips)**.
- **Bedragen** staan niet in deze openbare repo.

**Nagekeken:** het plan is vr 20 nov nagelopen door twee controleurs. De ene keek naar de documentatie van Omni en de API, de andere naar onze regels en het beleid van Google, YouTube en de EU. Hun verbeteringen zijn verwerkt. Het citaat uit de voorwaarden en de punten uit de EU-richtsnoeren heb ik zelf in de bron nagekeken.

## Bijgesteld wo 25 nov 2026 (keuzebladen)
- **Stijlen:** A (echt filmbeeld), B (gepolijst echt) en D (getekend). Bijna echt (filmische 3D) vervalt (keuzeblad 1, zo 22 nov ±02:48).
- **De rechercheur:** paneel A van keuzeblad 2 (donkere bob). **De collega:** paneel D van keuzeblad 3: donkere huid, kort grijs haar, een snor zonder baard, een rond goudkleurig brilletje. De vaste tekst van de collega is daarop aangepast.
- **Kleuren:** camel en roest, met olijfgroen en bordeaux (keuzeblad 4, A). **Sfeer van het bureau:** zonsondergang (keuzeblad 5, A).
- **Wie bedient Flow:** Manon, na *"Ja, Flow mag"* (wo 25 nov ±10:24).
- **Voor welk account:** het nieuwe account op YouTube en Instagram (di 24 nov). Het Vraagteken en Peertje blijven op kanaal 1.
- De actuele prompts staan in `flow-stappen.md` (versie 2). De tekst hieronder is de eerste versie van het plan.

## Uitkomst clips wo 25 nov 2026
**Gemaakt.** Stijl B (gepolijst echt) en D (getekend), elk drie scènes van 8 s in 2 versies: 12 clips.
- Andries koos voor de clips: *"B, gepolijst echt (Recommended),D, getekend (Recommended)"* (±11:25).
- Instellingen: Omni Flash 1.2 in Flow, 9:16, 720p, met geluid.
- Alle clips staan buiten git in `tools/ai-proef/flow/`.

**Wat werkte:**
- **Een korte prompt** (±900 tekens) met **4 referentiebeelden**: per persoon het gezicht en het hele lichaam.
- De lange prompt uit `flow-stappen.md` (±3.300 tekens, 6 beelden) mislukte twee keer ("Er ging iets mis"). Andries koos daarna: *"Eenvoudiger proberen (Recommended)"* (±11:44).

**Wat goed ging, in beide stijlen:**
- De gezichten, het haar, de snor en het brilletje blijven gelijk binnen een clip.
- Het lopen en het omdraaien zien er natuurlijk uit.
- De camera staat stil, er zijn geen knippen en de monden blijven dicht.
- "SOURCES" is goed gespeld, al ligt het etiket soms ondersteboven (leesbaar voor hen, niet voor de kijker).

**Wat afwijkt:**
- **Het prikbord** hangt vol foto's van mensen. De korte prompt sloot dat niet uit. Volgende keer: *"the pinned photographs show only machines and buildings, no people"*.
- **Kleding:**
  - D1 versie 2: zij draagt pumps in plaats van enkellaarzen.
  - B1 versie 1: zij draagt hoge laarzen.
- **De hendel** in de machinekamer is nauwelijks te zien.

**Beste versie per scène:**
- **B:** scène 1 versie 2, scène 2 versie 2, scène 3 versie 2.
- **D:** scène 1 versie 1, scène 2 versie 1, scène 3 versie 1.
- Ze staan naast elkaar in `vergelijking-B-D.mp4` en `vergelijking-B-D.jpg`, met "AI-generated" in beeld.

**Volgende stap:**
1. Andries kiest de stijl.
2. Daarna schaal ik de beste clips gratis op naar 1080p.
3. Dan bouw ik een eerste proefshort van ±30 s, met stem.

## Wat de proef moet laten zien
1. **Welke stijl werkt beter: echt of bijna echt?** Dezelfde drie scènes in beide stijlen, naast elkaar.
2. **Blijven ze gelijk?** In elke clip hetzelfde gezicht, haar en dezelfde kleding, en de twee nooit verwisseld of vermengd.
3. **Lopen ze echt door de ruimte?** Voeten op de vloer, geen extra ledematen of vingers en een achtergrond die niet verspringt.
4. **Klopt het detail?** "SOURCES" goed gespeld op de map, geen sneden in de clip, monden dicht en geen losse tekst in beeld.
5. **Wat kost een bruikbare seconde?** Dat bedrag geef ik alleen in de sessie.

## De twee stijlen
**Echt:** fotorealistisch, als een echte film, met verzonnen mensen.
- **EU AI-wet: zeer waarschijnlijk een deepfake.**
  - Het is al genoeg dat een verzonnen persoon zou kunnen bestaan.
  - Volledig door AI gemaakte acteurs zorgen er waarschijnlijk voor dat beeld als echt overkomt.
  - De lichtere regel voor fictie geldt niet: onze video's zijn uitleg met bronnen, en bij een mix van uitleg en fictie gaat het informatieve voor.
  - Bron: artikel 3 punt 60, en de richtsnoeren van de Commissie bij artikel 50, C(2026) 7702 final, 5 nov 2026, punt 113, 114 en 122.
- **Dus: "AI-generated" duidelijk in beeld vanaf de eerste seconde.**
  - Kunnen kijkers later instappen (een lange video, hoofdstukken, een link met een tijdstip), dan komt de melding later terug, of staat ze klein en vast in een hoek zolang de AI-mensen in beeld zijn (punt 143).
  - Het onzichtbare SynthID telt niet als melding (punt 117).
  - Een melding die makkelijk gemist wordt telt ook niet (punt 142). Een regel in de beschrijving komt er dus alleen bij.
  - Bron: https://ec.europa.eu/newsroom/dae/redirection/document/131215. Dit is geen juridisch advies.
- **YouTube:** in Studio "Ja, er is AI gebruikt". Dat is verplicht bij beeld dat echt lijkt.

**Bijna echt:** filmische 3D-animatie. Licht, stof, materialen en ruimte gedragen zich echt, maar gezicht en verhoudingen zijn duidelijk geanimeerd. Beide figuren zijn duidelijk volwassen.
- **EU AI-wet: waarschijnlijk geen deepfake,** zolang gezicht en verhoudingen duidelijk geanimeerd zijn. Veel fotorealisme maakt een deepfake waarschijnlijker, maar beslist het niet alleen (punt 114).
  - Ik beoordeel dat per clip. Oogt een clip toch echt, dan behandel ik hem als "echt".
- **YouTube** vraagt alleen een label voor beeld dat echt lijkt; voor duidelijk geanimeerd beeld hoeft het niet (https://support.google.com/youtube/answer/14328491). Wij zetten "Ja, er is AI gebruikt" toch aan:
  - het hele beeld is met AI gemaakt;
  - YouTube kan het label ook zelf zetten (via C2PA);
  - een echt klinkende AI-stem krijgt volgens onze eigen regel een label.
- **Verwachting:** de figuren blijven beter gelijk en foutjes vallen minder op. Dat moet de proef laten zien.

**Voor beide stijlen:** in de prompts noem ik geen stijl van een bestaand bedrijf, een film of een reeks; ik beschrijf alleen de stijl zelf.

## De personages (verzonnen, zonder naam)
- **Volwassen en verzonnen.** Ze mogen niet op een bestaand persoon of personage lijken (zie Keuring).
- **Naam.** Die kiest Andries later; voor gebruik zoek ik eerst na of die naam niet al bestaat.
- **Geen naam in een prompt.** Een naam die ook bij een echt persoon hoort, kan het filter laten weigeren. In prompts blijven het "the detective" en "the colleague".

**Vaste tekst.** Deze komt woord voor woord in elke prompt. De rolwoorden staan er bewust niet in; het personageblok hieronder geeft de rollen.
- **De rechercheur:**
  > a fictional woman in her late thirties: slim build, light skin, a long oval face with a straight narrow nose and a firm jaw, narrow straight dark eyebrows, almond-shaped grey-green eyes, faint lines at the corners of her eyes; bare-headed, straight near-black chin-length bob with a side parting; long camel-coloured wool trench coat with a belt, rust-red knitted scarf, dark charcoal turtleneck, dark navy trousers, dark-brown leather ankle boots
- **De collega:**
  > a fictional man around sixty: sturdy build, warm medium-brown skin, a round face with deep smile lines, bald crown with short grey hair at the sides, thick grey eyebrows, short neatly trimmed grey beard and moustache, round thin dark-rimmed glasses; white shirt with rolled-up sleeves, narrow dark-burgundy tie, olive-green waistcoat with small gold buttons, dark grey-brown trousers, black shoes; his folder is a manila-yellow cardboard folder with a white label on the cover that reads "SOURCES" in large black capital letters

**Herkomst.** Kleuren en kleding komen uit de getekende ontwerpen (`docs/figuur/ontwerp-J.jpg`, `ontwerp-K.jpg`; kleurcodes in `gereedschap/figuur.cjs`). De gezichtstrekken zijn nieuw.
- **Waarom zo uitgebreid:** Google raadt voor gelijkblijvende personages aan de hele beschrijving ongewijzigd te herhalen, met vaste kenmerken als bouw, gezichtsvorm en ogen (https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice).
- **Voor Omni** raadt Google vooral referentiebeelden aan (https://deepmind.google/models/gemini-omni/prompt-guide/).
- **Kleuren uit elkaar:** de bordeauxrode das en de roestrode sjaal zijn bewust verschillend, en hij draagt zwarte schoenen en zij bruine laarzen. Zo lopen de kleuren van de twee niet in elkaar over.

**Personageblok.** Dit komt in elke Omni-prompt:
> The first three reference images show the detective, [VASTE TEKST RECHERCHEUR]. The last three reference images show her colleague, [VASTE TEKST COLLEGA]. Each of them looks exactly like their own three images for the whole shot (same face, hair, skin tone, glasses, beard, clothing colours and folder), and they never share or swap features or props. Use the reference images only for the two people and the folder; their plain grey studio background is not part of the scene.

## Stap 1: referentiebeelden (6 per stijl, samen 12)
**Model: Nano Banana Pro.**
- **Liefst gratis, met de hand in Flow, door Andries.** Beelden kosten daar geen credits; zonder abonnement mag je er 20 per dag maken met Nano Banana Pro (https://support.google.com/flow/answer/16729550).
- **Watermerk:** als het kan, zet hij vooraf het zichtbare watermerk uit. Een watermerk knippen of wegpoetsen we nooit.
- **Via de API** (`gemini-3-pro-image`) kost het geld, want er is geen gratis laag. Dan vallen deze beelden en elke herkansing onder het OK per bedrag.

**Volgorde** (zo is het overal hetzelfde gezicht, en vergelijken we de stijl en niet twee verschillende ontwerpen):
1. **Echt (a)** per personage, alleen uit tekst. Andries keurt het beeld.
2. **Echt (b) en (c),** met de goedgekeurde (a) als invoerbeeld. Bij (c) gaat (b) er ook bij.
3. **Bijna echt (a),** gemaakt van de goedgekeurde echte (a). Daarna bijna echt (b) en (c), met die (a), en bij (c) ook (b), als invoerbeeld.

**Aanzichten:**
- **(a), beide personages:** *"Head and shoulders, facing the camera, framed from the top of the head to mid-chest."* Bij de collega komt erbij: *"The folder is not in this picture."*
- **(b), rechercheur:** *"Waist up, three-quarter view, her empty hands relaxed at her sides."*
- **(b), collega:** *"Waist up, three-quarter view; he holds the closed folder upright against his chest with both hands, the front cover turned toward the camera so the word "SOURCES" is sharp and fully readable."*
- **(c), rechercheur:** *"Full body, standing, head to toe, facing the camera, her empty hands relaxed at her sides."*
- **(c), collega:** *"Full body, standing, head to toe, facing the camera; he holds the closed folder against his chest with one hand, front cover toward the camera, "SOURCES" fully readable, the other arm relaxed at his side."*

**[TEKSTREGEL]** is per beeld één van deze twee:
- als de map in beeld is: *"The only lettering in the image is the word "SOURCES" on the folder label; clothes and background are plain."*
- anders: *"Clothes and background are plain, without lettering."*

**Echt (a):**
> Photorealistic studio photograph of [VASTE TEKST]. [AANZICHT]. Plain light-grey seamless background, soft even studio light, 50mm lens, natural skin texture, realistic proportions. This one person is the only figure in the image. [TEKSTREGEL]

**Echt (b) en (c):**
> Photorealistic studio photograph of the same person as in the attached image, with exactly the same face, hairstyle, skin tone and clothing: [VASTE TEKST]. [AANZICHT]. The same plain light-grey seamless background and the same soft even studio light as the attached image, 50mm lens, natural skin texture, realistic proportions. This one person is the only figure in the image. [TEKSTREGEL]

**Bijna echt (a), van de goedgekeurde echte (a):**
> Recreate the person in the attached photograph as a high-end stylized 3D animated feature film character with the same face shape, hairstyle, hair colour, skin tone, clothing and colours: [VASTE TEKST]. Head and shoulders, facing the camera, framed from the top of the head to mid-chest. Slightly stylized proportions and facial features, clearly an animated character, but unmistakably an adult of the stated age: adult body proportions, a normal-sized head, normal-sized eyes and visible signs of age. An original character design that does not resemble any existing film, TV, game or cartoon character. Physically realistic hair, fabric and materials. Plain light-grey seamless background, soft even studio light. This one character is the only figure in the image. [TEKSTREGEL]

**Bijna echt (b) en (c):**
> High-end stylized 3D animated feature film character render of the same character as in the attached image, with exactly the same face, hairstyle, skin tone and clothing: [VASTE TEKST]. [AANZICHT]. Unmistakably an adult of the stated age, with adult body proportions. The same plain light-grey seamless background and the same soft even studio light as the attached image. This one character is the only figure in the image. [TEKSTREGEL]

**Keuring (Andries beslist):** in de volgende gevallen maak ik een nieuw beeld:
- een gezicht lijkt op een bekend persoon;
- een figuur lijkt op een bekend personage uit een film, serie, game of tekenfilm;
- de rechercheur kan jonger dan 18 ogen.

Ik vergelijk zelf geen gezichten met echte mensen; dat oordeel geeft Andries. Goedgekeurde bestanden blijven daarna precies gelijk.

## Stap 2: drie scènes, elk in beide stijlen (6 shots × 2 pogingen = 12 clips)
**Instellingen:**
- model `gemini-omni-1.2-flash`, taak `reference_to_video`;
- invoer in deze volgorde: eerst de 3 beelden van de rechercheur (a, b, c), dan de 3 van de collega, dan de tekst;
- 9:16; de filtertoets duurt 3 s in 360p, daarna 10 s in 720p;
- `store=true` (ook de standaard), zodat een clip later bij te werken is;
- meteen downloaden: het bestand achter de uri verdwijnt na 48 uur;
- de opdracht zelf (referentiebeelden, prompt en clip) bewaart Google bij een betaald project 55 dagen. In AI Studio kan dat korter (7, 14 of 28 dagen); na de proef kunnen de opdrachten verwijderd worden.

**Eerst de filtertoets, per stijl één goedkope clip:** 3 s in 360p, met alle 6 referentiebeelden van die stijl en de prompt van scène 1 zonder tijdcodes.
- Pas als een stijl erdoor komt, maak ik in die stijl de clips van 10 s in 720p.
- Of een geweigerde poging geld kost, staat niet in de documentatie. Andries kijkt na de toets in AI Studio wat er is afgeschreven.
- Doet Andries de gratis voorproef in Flow, dan doen we die eerst: een weigering daar is een gratis eerste aanwijzing.

**Wordt een stijl geweigerd, dan werk ik niet om het filter heen:**
- geen andere woorden om dezelfde beelden erdoor te krijgen;
- geen bijgesneden of vervormde versies;
- geen VPN of server in een ander land.

De voorwaarden van de Gemini API verbieden dat: *"You may not attempt to bypass these protective measures"* (https://aistudio.google.com/docs/terms, onder "Use Restrictions"). Ik noteer de foutmelding en leg het aan Andries voor. Een nieuw gezicht maken is een nieuw besluit van hem.

**Opbouw van elke prompt:** [OPENING EN CAMERA] [STIJL] [PERSONAGEBLOK] [DECOR] [HANDELING MET TIJDCODES] [SLOTBLOK]. Tijdcodes als [0-7s] staan in de documentatie van Omni.

**[STIJL]** is per stijl één van deze twee:
- **Echt:** *"Photorealistic live-action film look, as if shot on a 35mm film camera: natural skin texture, realistic proportions, cinematic lighting, deep focus so both faces stay sharp. It looks like real camera footage."*
- **Bijna echt:** *"High-end stylized 3D animated feature film look: slightly stylized proportions and clearly animated faces, with physically realistic light, fabric, materials and space; both characters are clearly adults with adult proportions; cinematic lighting, deep focus so both faces stay sharp."*

**[DECOR] voor scène 1 en 2:**
> A small detective office at sunset: a cork board on the back wall with pinned photographs of old machines and buildings (no people in them) and blank index cards joined by red string, venetian blinds letting in low warm sunlight in stripes, a wooden desk with a green banker's lamp, plain grey metal filing cabinets, wooden floorboards.

**[SLOTBLOK]:**
> Both people keep their mouths gently closed the whole time; no dialogue. Audio: quiet room tone only, no music. The only lettering anywhere in the frame is the word "SOURCES" on the colleague's folder; every other surface (walls, doors, board, papers, photographs, labels and machine parts) is plain and unmarked, and clothing and objects carry no logos or brand marks. These two people are the only people in the frame, also in photographs, and only the colleague holds the folder.

**Scène 1: binnenlopen (test van het lopen)**
> Vertical 9:16, one continuous shot with no cuts. Static, locked-off full-body wide shot at eye level; the camera does not move. [STIJL] [PERSONAGEBLOK] [DECOR] In the back wall is an open doorway; its solid plain dark-wood door already stands open. [0-7s] The detective walks in through the doorway and crosses the room toward the desk at a calm, steady pace; her coat swings with each step and each boot lands flat on the floorboards, and she stays visible from head to boots the whole time. [7-10s] She stops beside the desk. The colleague sits behind the desk in the right foreground, his folder lying closed in front of him, and looks up at her. [SLOTBLOK]

**Scène 2: de map openslaan (test van handen en tekst)**
> Vertical 9:16, one continuous shot with no cuts. Static, locked-off medium shot from slightly above desk height, both people visible from the waist up. [STIJL] [PERSONAGEBLOK] [DECOR] The room is lit warmly by the green desk lamp. The colleague stands behind the right half of the desk and the detective behind the left half, an arm's length apart. [0-3s] The closed folder lies flat on the desk in front of the colleague, cover up, the word "SOURCES" on its white label sharp and readable. [3-6s] He opens the cover with both hands; inside is one large black-and-white photograph of an old brass machine. [6-10s] He points at the photograph with his right index finger, and the detective leans forward over her own side of the desk to look at it. [SLOTBLOK]

**Scène 3: omdraaien (test van het hele lichaam en het gezicht)**
> Vertical 9:16, one continuous shot with no cuts. Static, locked-off full-body wide shot at eye level, both people visible from head to feet the whole time. [STIJL] [PERSONAGEBLOK] A room inside a large machine: a back wall of slowly turning brass gears, copper pipes along the side walls and a big brass lever on the right, lit by warm lamps; every metal surface is plain and unmarked. The colleague stands still beside the lever on the right, facing the camera, with the folder tucked under his left arm. [0-4s] The detective stands in the centre with her back to the camera, hands in her coat pockets, looking up at the turning gears. [4-8s] She calmly turns around on the spot until she faces the camera. [8-10s] She stands still and looks toward the camera. [SLOTBLOK]

## Stap 3: beoordelen per clip
Per clip een vinkje of een kruis. Ik let op:
- het gezicht en haar;
- de baard en het brilletje;
- de kleuren van jas, sjaal, das en gilet;
- dat ze volwassen ogen;
- dat de twee niet verwisseld of vermengd zijn;
- handen en ledematen;
- voeten op de vloer;
- "SOURCES" goed gespeld;
- geen losse tekst;
- de camera die stilstaat;
- geen snede;
- de mond dicht.

Per stijl tel ik het aantal bruikbare clips, kijk ik of de twee in alle zes clips herkenbaar dezelfde blijven, en reken ik de kosten per bruikbare seconde uit (die alleen in de sessie).

## Stap 4: monteren en vergelijken (lokaal, niets plaatsen)
- **Geluid en stem.** Het geluid van de clips gaat eraf. Ik gebruik geen nieuwe ElevenLabs-tekens (die bewaren we tot 14 dec): de proef krijgt de oude gratis stem of geen stem.
- **Ondertitels en melding.** Er komen ondertitels bij, en aan het begin staat "AI-generated" in beeld.
- **Per stijl één filmpje** met de drie scènes.
- **Vergelijkingsblad** met stilstaande beelden van beide stijlen naast elkaar.
  - In de kop staat "AI-generated · verzonnen personages".
  - Op elk beeld staat klein "AI-generated", zodat het label meegaat als iemand één beeld kopieert.
  - Er staan geen bedragen op.
- **Opslag.** De clips staan buiten git, op de pc, in `C:\Users\gijsm\tools\ai-proef\`. In git komen alleen dit verslag en het vergelijkingsblad.

**Beslisregel, per stijl:** door alleen als minstens de helft van de clips bruikbaar is en de twee in alle clips herkenbaar dezelfde blijven. Daarna kiest Andries de stijl, of hij kiest ervoor bij de huidige stijl te blijven.

## Gratis voorproef (alleen als Andries dat wil)
In Flow krijgt iedereen elke dag een klein aantal gratis credits; daarvoor is geen API nodig.
- **Wat Andries kan doen:**
  - met de hand de referentiebeelden maken (die kosten in Flow geen credits);
  - scène 1 in beide stijlen maken, in 360p, met de prompts hierboven.
- **Wat het oplevert:** een clip in 360p is een andere clip dan in 720p. Het geeft dus een indruk en een eerste filtertoets, geen eindoordeel.
- **Wat ik niet doe:** Flow bedienen. Dat kan alleen met de hand, en een bot is volgens de voorwaarden riskant.

## Voor later (na een OK per bedrag)
**Een eigen hulpje** in `gereedschap/short/`:
- de sleutel alleen uit een Windows-variabele;
- een plafond per werk en een logboek buiten git;
- elke clip meteen downloaden, met de prompt en het nummer van de opdracht erbij.

**Aanroep:** `@google/genai` 2.3.0 of nieuwer, `ai.interactions.create`, met:
- `model: 'gemini-omni-1.2-flash'`;
- als invoer eerst de 3 beelden van de rechercheur, dan de 3 van de collega, dan de tekst;
- `response_format` met `aspect_ratio '9:16'`, `resolution '720p'` (bij de filtertoets `'360p'`), `duration '10s'` (bij de filtertoets `'3s'`) en `delivery 'uri'`;
- `generation_config.video_config.task: 'reference_to_video'`.

**Ophalen:**
- de uri meteen uit het antwoord van `interactions.create` halen (`interaction.output_video.uri`);
- het bestand pollen tot het ACTIVE is;
- dan downloaden met `ai.files.download`.

Het nummer van de opdracht gaat in het logboek, zodat een clip na een mislukte download nog op te halen is (een latere GET geeft base64).

Bron: https://aistudio.google.com/docs/omni (gelezen vr 20 nov 2026).
