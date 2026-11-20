# Kan Gemini de rechercheurs goed maken? (onderzoek vr 20 nov 2026)

**Aanleiding.** Andries vroeg vr 20 nov 2026 ±17:00 in de sessie: *"kunnen we met gemini dit goed doen?"*. Het gaat om de twee verzonnen rechercheurs (`docs/waaromdorp/ai-proef.md`): echt lijkend beeld, rechtop (9:16), elke dag.

**Werkwijze.** Zes onderzoekers keken elk vanuit één invalshoek: modellen, prijs, voorwaarden, kwaliteit, YouTube en werkwijze. Per invalshoek zocht een controleur in officiële bronnen naar fouten. Een laatste stap voegde alles samen.

**Bedragen.** Die staan niet in deze openbare repo. Andries kreeg ze in de sessie.

## Kort antwoord: deels
Technisch kan het, maar voor dagelijks gebruik is het nog niet bewezen. Eén route van Google past: **Gemini Omni 1.2 Flash via de betaalde Gemini API** (Google AI Studio).

## Wat goed past
- **Twee vaste personages.** Omni 1.2 Flash houdt per clip twee personages vast, met 3 referentiebeelden per persoon. Van alle Google-modellen kan alleen dit model dat, en ook daarbuiten zijn er weinig. Het past precies bij de rechercheur en de collega.
- **Formaat.** Rechtop in 9:16 en clips van 3 tot 15 seconden. Is een clip bijna goed, dan kun je hem aanpassen in plaats van helemaal opnieuw te maken.
- **Aansturen vanuit onze eigen pijplijn.** Een script mag het model aansturen via de API (bij Midjourney mag dat niet). Er is een vast plafond voor uitgaven mogelijk.
- **Beelden en watermerk.** Google claimt de beelden niet. Wat via de betaalde API gaat, gebruikt Google niet om te trainen. Er is geen zichtbaar watermerk, alleen het onzichtbare SynthID.
- **Referentiebeelden.** De personagebladen, de lege decors en het label "SOURCES" maak je met het beeldmodel van Google (Nano Banana).

## Wat tegenvalt
- **Echte mensen in beweging zijn het zwakste punt.**
  - Op de lijst van onafhankelijke beoordelaars (Artificial Analysis) staat het model 6e voor tekst-naar-video en 15e voor beeld-naar-video. Voor het menselijk lichaam staat het 12e; die cijfers per onderdeel komen uit een tweedehands bron.
  - Bij de publieksstemming (Arena) staat het 1e.
  - Een concurrent buiten Google (Seedance 2.5) scoort beter op echt lijkende mensen.
- **Twee personages gelijk houden over veel clips is niet onafhankelijk getest.**
  - Er zijn meldingen dat gezichten en kleding verschuiven.
  - Verzonnen gezichten zijn ook wel geweigerd als "echte persoon".
- **Onze eigen stem kan er niet in.** De figuren kunnen niet lipsyncen op onze stem; het wordt een voice-over, met gesloten monden. Het model maakt altijd geluid, en dat halen we eraf.
- **De camera en het label.** Het model maakt uit zichzelf soms een snede, en de laatste camerabeweging slaat het vaak over. De tekst "SOURCES" op de map verschuift; die zetten we er beter zelf overheen.
- **Kosten.**
  - De kleine proef is te overzien.
  - Eén video van 60 seconden per dag kost per maand veel meer dan het potje.
  - Het hele ritme (een video en twee shorts per dag) kost een veelvoud daarvan.
  - Een nieuw account heeft de eerste tijd een maandplafond.
- **Andere wegen vallen af.**
  - De gratis AI-video in YouTube zelf is **niet beschikbaar in Nederland**.
  - Flow (de webtool van Google) geeft elke dag een klein aantal gratis credits. Dat is genoeg om met de hand te proberen, maar niet voor productie: er is geen API, en een bot is volgens de voorwaarden riskant.
  - Veo 3.1 is het oude model en verdwijnt in 2027. Het houdt maar één personage per clip vast.

## Regels
- **YouTube: label per video.** Bij elke video zet je in Studio "AI gebruikt" op Ja. Sinds mei 2026 staat het label bij Shorts in beeld. Volgens YouTube kost het label alleen geen bereik of geld.
- **YouTube: geld verdienen.**
  - Mag uitdrukkelijk: "een serie met een vaste set personages" en "eigen personages en verhalen met AI in beeld brengen".
  - Mag niet: "personages steeds in dezelfde situatie met dezelfde afloop", sjabloonmatig massawerk en losse AI-clips die niet op elkaar aansluiten.
  - Elke aflevering moet dus eigen onderzoek met bronnen, een eigen plek en een eigen ontknoping hebben.
- **EU AI-wet (artikel 50, sinds 2 aug 2026).** Echt lijkende AI-mensen gelden als deepfake. Bij uitleg met bronnen telt het informatieve deel het zwaarst, dus geldt de volle plicht: aan het begin "AI-generated" in beeld en een regel in de beschrijving, naast het label van YouTube. Dit is geen juridisch advies.
- **Belangrijk, los van Gemini: de drempels van YouTube gaan omhoog.**
  - Vanaf 1 februari 2027 heeft een nieuw kanaal voor het partnerprogramma 20 mln Shorts-weergaven in 90 dagen nodig (of 8.000 kijkuren in een jaar). Nu is dat 10 mln of 4.000 uur.
  - Wie al partner is, moet daarna minstens 10 mln Shorts-weergaven per 90 dagen halen om aan Shorts te verdienen.
  - Bronnen: YouTube-blog van 10 aug 2026 en de helppagina's over het partnerprogramma en Shorts-inkomsten.
  - Of de eis van 1.000 abonnees blijft, is niet bevestigd.
  - Gemeld aan Eva en Jesse, omdat het het doel "tot de uitbetaaldrempels" raakt.

## Voorstel voor een kleine proef (alleen na OK van Andries per bedrag)
**0. Account en sleutel (Andries).**
- Andries maakt in Google AI Studio een project aan met vooruitbetaling en zet een uitgaveplafond op het goedgekeurde bedrag.
- Hij zet de sleutel zelf op de pc, zoals bij ElevenLabs. De sleutel komt nooit in git.
- Ik maak niets aan en betaal niets.

**1. Personagebeschrijving (gratis).** Per rechercheur één vaste tekst, die woord voor woord in elke prompt komt.

**2. Referentiebeelden.**
- Per rechercheur 3 beelden: gezicht, ten voeten uit van voren, en van opzij.
- Daarnaast drie lege decors: bureau, museum en tijdmachine.

**3. Filtertoets.** Eén clip met alle zes referentiebeelden, om te zien of de verzonnen gezichten vanuit Nederland niet worden geweigerd.

**4. Zes shots, elk twee keer gemaakt, 720p, 9:16.**
- binnenlopen
- samen door het museum
- de map openslaan
- omdraaien in de tijdmachine
- van achteren door een deur
- één clip van 15 seconden met drie delen

Elke prompt eindigt met: "single continuous shot, no scene cuts, characters do not speak, no dialogue, no music, no captions".

**5. Beoordelen per poging.** Ik controleer of:
- het gezicht klopt;
- de kleding klopt;
- de twee niet verwisseld zijn;
- handen en voeten kloppen;
- SOURCES klopt;
- er geen snede in zit;
- de mond dicht blijft.

**6. Monteren.** Geluid eraf, onze stem en ondertitels erbij, "AI-generated" in beeld. Alleen lokaal bekijken; niets plaatsen.

**Beslisregel:** alleen doorgaan als minstens de helft van de pogingen bruikbaar is en de twee in alle pogingen herkenbaar dezelfde blijven. Anders houden we de huidige stijl, of proberen we, met een eigen OK, een model buiten Google.

## Onzeker of niet bevestigd
- De lijsten van onafhankelijke beoordelaars en de publieksstemming verschillen sterk. Geen enkele lijst test 9:16.
- Of video's uit de API C2PA-gegevens meekrijgen. Die gegevens geven op YouTube een vast AI-label.
- Of een zichtbaar watermerk in Flow in de EU verplicht is.
- Dat de eis van 1.000 abonnees na 1 feb 2027 blijft.
- Veel praktijktests komen van wederverkopers van AI-diensten, die belang hebben bij een goed oordeel.

## Belangrijkste bronnen (gelezen vr 20 nov 2026)
- Gemini API, Omni: https://aistudio.google.com/docs/omni · prijzen: https://aistudio.google.com/docs/pricing · limieten: https://aistudio.google.com/docs/rate-limits · voorwaarden: https://aistudio.google.com/docs/terms · regio's: https://aistudio.google.com/docs/available-regions
- Google, Omni 1.2 Flash (5 nov 2026): https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/ · modelkaart: https://deepmind.google/models/model-cards/gemini-omni-flash/ · promptgids: https://deepmind.google/models/gemini-omni/prompt-guide/
- Flow, credits: https://support.google.com/flow/answer/16526234?hl=en · personages: https://support.google.com/flow/answer/16935308?hl=en
- YouTube, AI-label: https://support.google.com/youtube/answer/14328491?hl=en · labels (27 mei 2026): https://blog.youtube/news-and-events/improving-ai-labels-for-viewers-and-creators/ · inkomstenbeleid: https://support.google.com/youtube/answer/1311392?hl=en · partnerprogramma 2027 (10 aug 2026): https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/ · Shorts-inkomsten: https://support.google.com/youtube/answer/12504220?hl=en · AI in Shorts, niet in de EER: https://support.google.com/youtube/answer/15260303?hl=en
- EU AI-wet, artikel 50: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50 · samenvatting van de richtsnoeren (DLA Piper, 10 aug 2026): https://www.dlapiper.com/insights/publications/2026/08/the-eus-new-guidelines-on-ai-transparency
- Kwaliteit: https://artificialanalysis.ai/video/leaderboard/text-to-video · https://artificialanalysis.ai/video/leaderboard/image-to-video · https://arena.ai/leaderboard/text-to-video
- Meldingen op het forum van Google: verzonnen personage geweigerd (16 nov 2026): https://discuss.ai.google.dev/t/gemini-api-http-400-original-fictional-character-blocked-in-video-generation/200914 · gezicht verschuift (jul 2026): https://discuss.ai.google.dev/t/major-identity-drift-and-character-consistency-failure-in-video-to-video-generation/173742
