# Seedance en Kling naast Gemini, voor de stijl "echt" (za 21 nov 2026)

**Aanleiding:** Andries vroeg za 21 nov 2026 ±01:30 in de sessie, op "Zal ik Seedance en Kling uitzoeken terwijl jij Flow doet?": *"Ja, uitzoeken"*. Eerder die nacht vroeg hij *"welke dienst wou je gebruiken wat het beste resultaat geeft"* en koos hij *"Toch allebei"* (echt en bijna echt).

**Werkwijze:** per dienst heeft een onderzoeker uitgezocht hoe het zit met vaste personages, gebruik in Nederland, de voorwaarden, aansturen via een script, prijs en kwaliteit. De beslissende feiten heb ik daarna zelf laten nakijken in de officiële bronnen. Bedragen staan alleen in de sessie, niet in deze openbare repo. Gemini staat in `docs/waaromdorp/gemini-onderzoek.md`.

## In het kort
| | Gemini Omni 1.2 Flash | Seedance 2.5 (ByteDance) | Kling 3.0 Omni / 4.0 (Kuaishou) |
|---|---|---|---|
| **Kwaliteit, onafhankelijke beoordelaars** | tekst-naar-video 6e, beeld-naar-video 15e; zwak in echte bewegende mensen | beeld-naar-video **1e**; volgens een tweedehands bron ook 1e voor menselijk lichaam en camera | rond het ijkpunt, duidelijk onder de andere twee; 4.0 staat nog niet op de lijsten |
| **Publieksstemming (Arena)** | 1e | 2e (beeld-naar-video) | niet in de top 15 |
| **Twee vaste personages** | officieel: 2 personages, elk met 3 beelden | officieel: beelden per personage aanwijzen ("Character 1 / Character 2"), tot 30 beelden | "Elements": een opgeslagen personage (vooraanzicht plus 1–3 andere aanzichten); bij 3.0 Omni een startbeeld plus 3 Elements |
| **Echte gezichten als referentie** | verzonnen gezichten worden soms geweigerd (meldingen op het forum) | **wordt geweigerd.** Uitzondering: beelden die op hetzelfde account met hun eigen model zijn gemaakt, **niet ouder dan 30 dagen en onbewerkt** | geen regel gevonden die verzonnen volwassenen blokkeert |
| **Prijs t.o.v. Gemini (720p)** | 1× | ±3× | 3.0 Omni ±1,2×; 4.0 ±2,2× |
| **Commercieel (YouTube)** | toegestaan via de API | toegestaan via de API (BytePlus); de web-app Dreamina is "generally private, non-commercial" | **API: toegestaan** (§6.4). **Web-app: niet** zonder schriftelijke toestemming, plus verplicht het merk Kling erop (§4.5, §4.6) |
| **Aansturen via script** | ja (API) | ja (API); een bot in de web-app is verboden | ja (API); een bot in de web-app is verboden (§3.1h) |
| **Nederland** | beschikbaar | BytePlus noemt Nederland | geen landenlijst gevonden; geen blokkade bekend |
| **Gratis proberen** | ja, in Flow | geen gratis video gevonden; activeren vraagt een vooruitbetaling (alleen in een tweedehands bron) | gratis plan met watermerk, zonder commercieel gebruik (bron: derden) |

## Seedance 2.5: het beste beeld, maar de gezichtsregel past slecht bij vaste personages
- **Het beste beeld.** Seedance 2.5 staat 1e bij beeld-naar-video, en ByteDance noemt zelf de stabiliteit bij meerdere personages nog een werkpunt.
- **Echte gezichten mogen niet in referentiebeelden.** De documentatie zegt letterlijk: "do not support directly uploading reference images or videos that contain real human faces".
- **Een uitzondering met voorwaarden.** Een beeld geldt als vertrouwd als het:
  - met Seedance of Seedream op hetzelfde account gemaakt is;
  - niet ouder is dan 30 dagen;
  - onbewerkt is ("Compressing or forwarding files may invalidate trust verification").

  Voor een reeks met dezelfde twee mensen, maandenlang, is dat lastig: na 30 dagen moet je de personages opnieuw laten maken, en dan kunnen ze net anders worden.
- **Kant-en-klare digitale mensen** van BytePlus mogen niet commercieel gebruikt worden.
- **Eigen "virtuele portretten"** vragen een bedrijfsverificatie en een beoordeling door BytePlus.
- **Startbeeld en referentiebeelden kunnen niet samen** in één opdracht. Geluid kan uit.
- **Mogelijk voordeel bij "bijna echt":** een duidelijk geanimeerd gezicht is geen echt gezicht. Of dat langs de filter komt, is **niet getest**.

## Kling: geen gezichtsregel, wel lager op de lijsten en strengere voorwaarden in de web-app
- **Vaste personages.** De Elements zijn gemaakt om een personage in veel losse clips te hergebruiken. Er is geen onafhankelijke test van dezelfde twee personages over veel clips.
- **Kling 3.0 Omni past beter dan 4.0.**
  - Bij 3.0 Omni kan het geluid uit en mag een startbeeld samen met 3 Elements.
  - Bij 4.0 maakt het model altijd geluid en zet het altijd zelf sneden; dat kun je niet uitzetten.
- **Alleen via de API is commercieel gebruik toegestaan.** De web-app verbiedt het zonder schriftelijke toestemming.
- **Gegevens en geld.** De gegevens staan in Singapore, en de privacyverklaring van de API noemt geen AVG. Betaalde tegoeden worden niet terugbetaald. Via doorverkopers (fal, Replicate) betaal je per seconde, voor dezelfde prijs als officieel.
- **Kwaliteit.** De praktijktests prijzen het lopen en bewegen, maar handen, overlappende personen en afwijken van de referentie blijven zwak. Die tests komen meestal van doorverkopers.

## Advies
1. **Eerst de gratis voorproef met Gemini in Flow** (`docs/waaromdorp/flow-stappen.md`). Die kost niets en test beide stijlen.
2. **Valt "echt" bij Gemini tegen,** dan een kleine betaalde proef: **Gemini tegen Kling 3.0 Omni**, met dezelfde personagebladen. Kling via een doorverkoper waar je per seconde betaalt, zodat er geen groot pakket nodig is. Alleen na een OK per bedrag van Andries; hij maakt de accounts.
3. **Seedance alleen als "bijna echt" wint** en we eerst nagaan of een geanimeerd gezicht langs de filter komt. Voor "echt" met vaste personages past de gezichtsregel slecht, en het is ±3× zo duur als Gemini.

## Onzeker of niet bevestigd
- Kling: de officiële prijspagina laat zich alleen in een browser lezen. De prijzen van 4.0 en 3.0 Omni Pro kloppen bij fal en Replicate; die van 3.0 Omni in 720p niet nagekeken.
- Kling: of een betaald web-abonnement wel commercieel gebruik geeft. De betaalvoorwaarden zeggen dat volgens een tweedehands bron; zelf niet kunnen openen.
- Seedance: of een Nederlands persoonlijk account Seedance 2.5 kan activeren, en de vooruitbetaling bij het activeren (alleen in een niet-officiële kopie van de documentatie).
- Seedance: of verzonnen echt-ogende gezichten ook worden geweigerd (meldingen van gebruikers, niet officieel), en of geanimeerde gezichten erdoor komen.
- Geen enkele dienst heeft een onafhankelijke test van dezelfde twee personages over veel losse clips, of van rechtop beeld.

## Bronnen (gelezen za 21 nov 2026)
- **BytePlus Seedance:**
  - opdracht maken (gezichtsregel; startbeeld en referenties niet samen; 4–30 s; 9:16; geluid uit): https://ai.byteplus.com/ark/region:ap-southeast-1/docs/create-video-generation-task-api
  - vertrouwde beelden (zelfde account, 30 dagen, onbewerkt): https://ai.byteplus.com/ark/region:ap-southeast-1/docs/ModelArk/2608626
  - landen (Nederland): https://docs.byteplus.com/en/docs/ModelArk/availability (bijgewerkt 21 apr 2026)
  - prijzen: https://ai.byteplus.com/ark/region:ap-southeast-1/docs/ModelArk/1544106
  - kant-en-klare digitale mensen alleen voor interne proeven: https://ai.byteplus.com/ark/region:ap-southeast-1/docs/ModelArk/2275639
  - aankondiging: https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5 (31 jul 2026)
- **Dreamina, voorwaarden** (niet-commercieel, geen scripts): https://dreamina.capcut.com/clause/dreamina-terms-of-service (bijgewerkt 22 jan 2026)
- **Kling:**
  - gebruiksvoorwaarden §3.1(h), §4.4–4.6: https://kling.ai/docs/user-policy (21 apr 2026)
  - API-voorwaarden §5.1, §6.3–6.4, geen terugbetaling: https://kling.ai/document-api/guides/protocols/paid-service.md (21 apr 2026)
  - wijzigingen in de API: https://kling.ai/document-api/updates/api
  - handleiding 4.0: https://kling.ai/quickstart/kling-4-model-user-guide (4 nov 2026)
- **Prijzen bij doorverkopers:** https://fal.ai/models/fal-ai/kling-video/o3/pro/reference-to-video · https://replicate.com/kwaivgi/kling-v4.0 · https://replicate.com/kwaivgi/kling-v3-omni-video
- **Kwaliteit:** https://artificialanalysis.ai/video/leaderboard/image-to-video · https://artificialanalysis.ai/video/leaderboard/text-to-video · https://arena.ai/leaderboard/image-to-video
