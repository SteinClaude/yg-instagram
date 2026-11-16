# TikTok en Snapchat — kanaal 1, kanaal 2 en account 3

**Jesse, manager YG-Social · ma 16 nov 2026.** Openbare repo: geen accountnamen of handles. Die staan bij Eva in het Project.

## Wat Andries meldde en koos (letterlijk)

- ma 16 nov 2026, in de sessie van Jesse: *"ik heb voor alle 3 de kanalen ook een snapchat acount, en heb nu ook 3 tiktok acounts"*
- Knoppen: wat erop → *"Zelfde video's, nu"* · wie plaatst → *"Eerst een automaat"*

**Dus:** elke video van kanaal 1, kanaal 2 en account 3 komt ook op TikTok en Snapchat (Spotlight). Er wordt pas geplaatst als er een automaat is. Tot dan gaat er niets op TikTok of Snapchat.

## Wat een automaat vraagt (nagezocht ma 16 nov)

| | TikTok | Snapchat |
|---|---|---|
| Koppeling | Content Posting API van TikTok, via een eigen app bij TikTok for Developers | Public Profile API van Snap; toegang alleen op uitnodiging (allowlist), aan te vragen bij Snap |
| Grote drempel | **Zonder audit door TikTok blijven alle posts privé**, en het account moet op privé staan. Pas na de audit worden posts openbaar. Duur volgens derden 2–6 weken; officieel niet bevestigd. | Toegang krijgen. Anders via een betaalde tussendienst die al toegang heeft (kost per maand). |
| Wie zet het op | Andries (app-koppelingen zijn van hem) | Andries |
| Wie bouwt de automaat | maker kanaal 1 (Manon bouwde ook de Instagram-automaat), na de koppeling | idem |

Bronnen: [TikTok Direct Post-reference](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) · [TikTok Content Sharing Guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines) · [Ayrshare, gids Snapchat-API](https://www.ayrshare.com/blog/complete-guide-to-snapchat-api-integration/) (verkoper; de eigen documentatie van Snap nog niet gelezen).

## Kanaal 1: eigen TikTok-video's van meer dan 1 minuut

Andries, ma 16 nov 2026 ±12:33: *"voor kanaal 1 maken we nieuwe videos die langer dan 1min zijn voor de tiktok,"*

- Kanaal 1 maakt **nieuwe video's van meer dan 1 minuut** voor TikTok (richtlijn 65–90 s), zodat ze meetellen voor uitbetaling. Het onderwerp, de bronnen en stijl 3 (het duo) blijven zoals ze zijn.
- Het zijn nieuwe pakketten, dus per code **pakket OK** (script, bronnen, titel). De stijl OK van stijl 3 geldt al.
- Langer betekent niet trager: de haak blijft in 2 seconden, en elke 10–15 seconden komt er een nieuw verrassend feit of een wending, zodat mensen blijven kijken.
- Hoe ze precies worden (een eigen code, ritme, opbouw) beslist Manon. Het ritme stelt ze voor in haar weekverslag. Ze mogen ook op YouTube (Shorts mogen tot 3 minuten), als Manon dat zinvol vindt.
- Plaatsen gaat pas via de automaat (zie boven).

## Wat de makers nu al doen

- Per video een versie die ook op TikTok en Snapchat past: 1080×1920, geen YouTube-tekst in beeld ("abonneer"), en een eigen bijschrift met hashtags per platform, in het pakket.
- **TikTok betaalt alleen bij video's langer dan 1 minuut.** Kanaal 2 en account 3 houden daar rekening mee (account 3: 61–90 s). Kanaal 1 maakt daarvoor eigen, langere video's (zie boven).
- **Snapchat:** AI-stem en labels volgens de regels van Snap. De maker zoekt dat na voor de eerste upload.

## Klaarmaken van de 6 accounts (Andries, ma 16 nov 2026 ±12:39)

*"oke ik wil nu voor alle 3 de snapchat en tiktok klaarmaken, en hun moeten ook weten dat dit er is en erop geplaats kan worden"*

**Wat Andries zelf doet (per account; wij loggen nergens in):**

| Stap | TikTok (3×) | Snapchat (3×) |
|---|---|---|
| 1. Soort account | Overschakelen naar **zakelijk account** (Instellingen → Account): dan komen statistieken en kun je later koppelen | Een **openbaar profiel** (Public Profile) aanmaken; zonder openbaar profiel kun je niet op Spotlight plaatsen |
| 2. Naam en handle | Zelfde naam als op YouTube; de handle zo gelijk mogelijk | idem |
| 3. Profielfoto, bio, link | Pas na **bio OK** per kanaal (de maker levert ze ter keuring) | idem |
| 4. Instellingen | Taal Engels; AI-label aanzetten bij video's met een AI-stem | idem |
| 5. Koppeling (automaat) | TikTok for Developers: één app, audit aanvragen | Toegang tot de Public Profile API aanvragen bij Snap |

**Wat de makers doen (elk voor hun eigen kanaal):**
- Profielfoto (de figuur of het logo van het kanaal) en een bio per platform, in het Engels, passend bij de bedoeling van het kanaal (`bedoeling-per-kanaal.md`), **ter keuring als "bio OK <kanaal> TikTok/Snapchat"**. Geen YG Digital-prijzen; YG Digital alleen in de bio als Andries dat wil.
- Vanaf nu bij elk pakket ook een TikTok/Snapchat-versie en een bijschrift met hashtags per platform. Kanaal 1 maakt daarnaast de langere TikTok-video's (hierboven).
- Alles wat klaarligt, blijft liggen tot de automaat (of een ander besluit van Andries). Niets zelf plaatsen.

## Volgende stappen

1. **Andries:** maakt een ontwikkelaarsapp bij TikTok for Developers aan en vraagt de audit aan. Dat duurt het langst, dus dit eerst.
2. **Andries:** vraagt bij Snap toegang tot de Public Profile API, of kiest een tussendienst (geld = OK per bedrag; boven het potje).
3. **Maker kanaal 1:** bouwt de automaat zodra er een koppeling is, op een eigen tak; naar main pas na go Andries (B30).
4. **Jesse:** neemt TikTok en Snapchat mee in het weekoverzicht zodra er geplaatst wordt.

## Kanttekening

Door "eerst een automaat" staat er waarschijnlijk weken niets op TikTok, vanwege de audit. Een tussenweg is: met de hand plaatsen tot de automaat er is (±5 minuten per video per platform). Dat beslist Andries; deze opdracht volgt nu zijn keuze.
