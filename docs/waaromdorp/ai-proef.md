# Kleine AI-proef kanaal 1: echt en bijna echt (vr 20 nov 2026)

## Besluiten (nieuwste boven)
- **vr 20 nov 2026 ±17:54.** Andries in de sessie: *"maken we echte mensen of bijna echte mensen"*.
  - Op "Welke stijl testen we in de proef?": *"Allebei testen (Recommended)"*.
  - Op de vraag of de proef met Gemini Omni via Google AI Studio tot [bedrag weggelaten] mag kosten: *"Nog niet"*.
- **vr 20 nov 2026 ±17:00.** *"kunnen we met gemini dit goed doen?"* Uitkomst: alleen Gemini Omni 1.2 Flash via de betaalde Gemini API past (`docs/waaromdorp/gemini-onderzoek.md`).
- **vr 20 nov 2026 ±16:38.** Op de vraag welke dienst en welk bedrag (Gemini Omni of Kling): *"Something else"*.
- **vr 20 nov 2026 ±16:27.** Op "Welke 3D-route kies je?": *"Kleine AI-proef"*. Dit volgt op de Blender-proef (`docs/waaromdorp/3d-proef.md`).

**Stand:** er is niets betaald en niets aangemaakt. Dit plan ligt klaar, zodat de proef meteen kan starten na een OK per bedrag.
- Andries maakt het project in Google AI Studio aan (met vooruitbetaling en een uitgaveplafond) en zet de sleutel zelf op de pc, net als bij ElevenLabs.
- De sleutel komt nooit in git.
- Bedragen staan niet in deze openbare repo.

## Wat de proef moet laten zien
1. **Welke stijl werkt beter: echt of bijna echt?** Dezelfde drie scènes in beide stijlen, naast elkaar.
2. **Blijven ze gelijk?** In elke clip hetzelfde gezicht, haar en dezelfde kleding, en de twee nooit verwisseld of vermengd.
3. **Lopen ze echt door de ruimte?** Voeten op de vloer, geen extra ledematen of vingers en een achtergrond die niet verspringt.
4. **Klopt het detail?** "SOURCES" goed gespeld op de map, geen sneden in de clip, monden dicht en geen losse tekst in beeld.
5. **Wat kost een bruikbare seconde?** Dat bedrag geef ik alleen in de sessie.

## De twee stijlen
- **Echt:** fotorealistisch, als een echte film, met verzonnen mensen.
  - Volgens de EU AI-wet (artikel 50) geldt dit als deepfake. Dan hoort aan het begin "AI-generated" in beeld en een regel in de beschrijving.
  - YouTube: het label "AI gebruikt" moet aan.
- **Bijna echt:** filmische 3D-animatie. Licht, stof, materialen en ruimte gedragen zich echt, maar gezicht en verhoudingen zijn duidelijk geanimeerd.
  - Volgens de EU-definitie is dit waarschijnlijk geen deepfake, omdat het niet als echt overkomt.
  - YouTube vraagt geen label voor duidelijk geanimeerd beeld. Wij zetten het label toch aan, om de AI-stem.
  - Ik verwacht dat de figuren beter gelijk blijven en dat foutjes minder opvallen. Dat moet de proef laten zien.
- **Geen stijl van een bestaand bedrijf of bestaande film** in de prompts: alleen een beschrijving van de stijl zelf.

## De personages (verzonnen, zonder naam)
Beide zijn volwassen en verzonnen, en lijken niet op een bestaand persoon. Een naam kiest Andries later; voor gebruik zoek ik eerst na of die naam niet al bestaat.

Deze vaste tekst komt **woord voor woord** in elke prompt (advies van Google voor gelijkblijvende personages):
- **De rechercheur:**
  > a fictional woman in her late thirties, a detective: straight dark-brown chin-length bob, calm sharp eyes, long camel-coloured wool trench coat with a belt, rust-red knitted scarf, dark charcoal turtleneck, dark trousers, brown leather ankle boots
- **De collega:**
  > a fictional man around sixty, the detective's colleague: short neatly trimmed grey beard, round wire-rimmed glasses, white shirt with rolled-up sleeves, olive-green waistcoat, dark-grey trousers, brown shoes; he carries a brown cardboard folder with the word "SOURCES" printed in large black capital letters on the cover

De kleuren en de kleding komen uit de getekende ontwerpen (`docs/figuur/ontwerp-J.jpg`, `ontwerp-K.jpg`).

## Stap 1: referentiebeelden (6 per stijl, samen 12)
- **Model:** Nano Banana Pro (`gemini-3-pro-image`) via de API. Het kan ook gratis met de hand in Flow, door Andries.
- **Opzet:** per personage drie beelden, rechtop (9:16), op dezelfde effen lichtgrijze achtergrond en in hetzelfde licht.
  - (a) hoofd en schouders, van voren;
  - (b) tot het middel, driekwart van opzij;
  - (c) ten voeten uit, staand, van voren.
- **De map:** bij de collega staat de map met "SOURCES" in (b) en (c) groot en goed leesbaar in beeld.
- **Vast na de keuring:** zijn de beelden goed, dan blijven de bestanden voor alle clips precies gelijk.
- **Afkeuren:** een gezicht dat op een bekend persoon lijkt, maak ik opnieuw.

**Echt:**
> Photorealistic studio photograph of [VASTE TEKST]. [AANZICHT]. Plain light-grey seamless background, soft even studio light, 50mm lens, natural skin texture, realistic proportions. Only this one person in the image. No other text and no logos.

**Bijna echt:**
> High-end stylized 3D animated feature film character render of [VASTE TEKST]. [AANZICHT]. Slightly stylized proportions and facial features, clearly an animated character, with physically realistic hair, fabric and materials. Plain light-grey seamless background, soft even studio light. Only this one character in the image. No other text and no logos.

**Aanzichten:**
- (a) *"Head and shoulders, facing the camera"*
- (b) *"Waist up, three-quarter view"*
- (c) *"Full body, standing, head to toe, facing the camera"*

## Stap 2: drie scènes, elk in beide stijlen (6 shots × 2 pogingen = 12 clips)
**Instellingen:**
- model `gemini-omni-1.2-flash`, taak `reference_to_video`, met de 6 referentiebeelden van dezelfde stijl (3 per personage);
- 9:16, 720p, 10 s;
- `store=true`, zodat een clip later bij te werken is; meteen downloaden, want Google bewaart bestanden 48 uur.

**De eerste poging is meteen de filtertoets:** worden de verzonnen gezichten vanuit Nederland niet geweigerd?

**[STIJL]** is per stijl één van deze twee:
- **Echt:** *"Photorealistic live-action film look, shot on 35mm, natural skin texture, realistic proportions, cinematic lighting, shallow depth of field. Not animated, not a 3D render, not a video game."*
- **Bijna echt:** *"High-end stylized 3D animated feature film look: slightly stylized proportions and clearly animated faces, but physically realistic light, fabric, materials and space; cinematic lighting, shallow depth of field. Not photorealistic."*

**Elke prompt eindigt met:**
> In a single continuous shot, no scene cuts. The characters do not speak: no dialogue and no lip movement. Audio: quiet room tone only, no music. No captions or on-screen text, except the word SOURCES on the folder. No logos, no brand names, no other people.

**Scène 1: binnenlopen (test van het lopen)**
> Vertical 9:16, medium-wide shot. [STIJL]. A small detective office at dusk: a cork evidence board with photos, notes and red string on the back wall, venetian blinds with low warm sunlight, a wooden desk with a green banker's lamp, grey metal filing cabinets. The detective, [VASTE TEKST RECHERCHEUR], opens a frosted-glass door on the left and walks into the room at a calm pace; her coat moves naturally with each step and her feet stay firmly on the floor. The colleague, [VASTE TEKST COLLEGA], sits at the desk on the right and looks up at her. Slow camera push-in toward the desk.

**Scène 2: de map openslaan (test van handen en tekst)**
> Vertical 9:16, medium shot. [STIJL]. The same small detective office, warm light from the green desk lamp. The colleague, [VASTE TEKST COLLEGA], stands at the desk on the right and opens the brown folder with "SOURCES" on the cover with both hands, then points at a page. The detective, [VASTE TEKST RECHERCHEUR], stands on the left, leans in and reads. Static, locked-off camera.

**Scène 3: omdraaien (test van het hele lichaam en het gezicht)**
> Vertical 9:16, medium-wide shot. [STIJL]. A room inside a large machine: brass gears, copper pipes and a big brass lever, lit by warm lamps. The detective, [VASTE TEKST RECHERCHEUR], stands in the centre with her back to the camera, looking at the machine, then calmly turns around to face the camera. The colleague, [VASTE TEKST COLLEGA], stands on the right beside the lever with the folder under his arm. Static, locked-off camera.

## Stap 3: beoordelen per clip
Per clip een vinkje of een kruis. Ik let op:
- het gezicht en haar;
- de baard en het brilletje;
- de kleuren van jas, sjaal en gilet;
- dat de twee niet verwisseld of vermengd zijn;
- handen en ledematen;
- voeten op de vloer;
- "SOURCES" goed gespeld;
- geen losse tekst;
- de camerabeweging zoals gevraagd;
- geen snede;
- de mond dicht.

Per stijl tel ik het aantal bruikbare clips, kijk ik of de twee in alle zes clips herkenbaar dezelfde blijven, en reken ik de kosten per bruikbare seconde uit (die alleen in de sessie).

## Stap 4: monteren en vergelijken (lokaal, niets plaatsen)
- Het geluid gaat eraf. Ik gebruik geen nieuwe ElevenLabs-tekens (die bewaren we tot 14 dec): de proef krijgt de oude gratis stem of geen stem.
- Er komen ondertitels bij, en aan het begin staat "AI-generated" in beeld.
- Per stijl worden de drie scènes één filmpje. Daarnaast maak ik een vergelijkingsblad met stilstaande beelden van beide stijlen naast elkaar.
- **Opslag:** de clips staan buiten git, op de pc, in `C:\Users\gijsm\tools\ai-proef\`. In git komen alleen dit verslag en het vergelijkingsblad.

**Beslisregel, per stijl:** door alleen als minstens de helft van de clips bruikbaar is en de twee in alle clips herkenbaar dezelfde blijven. Daarna kiest Andries de stijl, of hij kiest ervoor bij de huidige stijl te blijven.

## Gratis voorproef (alleen als Andries dat wil)
In Flow krijgt iedereen elke dag een klein aantal gratis credits; daarvoor is geen API nodig.
- Andries kan daar met de hand scène 1 in beide stijlen maken, in 360p, met de prompts hierboven.
- Een clip in 360p is wel een andere clip dan in 720p. Het geeft dus een indruk, geen eindoordeel.
- Ik bedien Flow niet: dat kan alleen met de hand, en een bot is volgens de voorwaarden riskant.

## Voor later (na een OK per bedrag)
- **Een eigen hulpje** in `gereedschap/short/`:
  - de sleutel alleen uit een Windows-variabele;
  - een plafond per werk en een logboek buiten git;
  - elke clip meteen downloaden, met de prompt en het nummer van de opdracht erbij.
- **Aanroep:** `@google/genai` 2.3.0 of nieuwer, `ai.interactions.create`, met:
  - `model: 'gemini-omni-1.2-flash'`;
  - de referentiebeelden en de tekst als invoer;
  - `response_format` met `aspect_ratio '9:16'`, `resolution '720p'`, `duration '10s'` en `delivery 'uri'`;
  - `generation_config.video_config.task: 'reference_to_video'`.

  Bron: https://aistudio.google.com/docs/omni (gelezen vr 20 nov 2026).
