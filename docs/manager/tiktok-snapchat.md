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

## Wat de makers nu al doen

- Per video een versie die ook op TikTok en Snapchat past: 1080×1920, geen YouTube-tekst in beeld ("abonneer"), en een eigen bijschrift met hashtags per platform, in het pakket.
- **TikTok betaalt alleen bij video's langer dan 1 minuut.** Kanaal 1 maakt nu shorts van ±40 seconden. Die gaan wel op TikTok, maar tellen niet voor uitbetaling. Langer maken is een keuze voor later (na de eerste cijfers).
- **Snapchat:** AI-stem en labels volgens de regels van Snap. De maker zoekt dat na voor de eerste upload.

## Volgende stappen

1. **Andries:** maakt een ontwikkelaarsapp bij TikTok for Developers aan en vraagt de audit aan. Dat duurt het langst, dus dit eerst.
2. **Andries:** vraagt bij Snap toegang tot de Public Profile API, of kiest een tussendienst (geld = OK per bedrag; boven het potje).
3. **Maker kanaal 1:** bouwt de automaat zodra er een koppeling is, op een eigen tak; naar main pas na go Andries (B30).
4. **Jesse:** neemt TikTok en Snapchat mee in het weekoverzicht zodra er geplaatst wordt.

## Kanttekening

Door "eerst een automaat" staat er waarschijnlijk weken niets op TikTok, vanwege de audit. Een tussenweg is: met de hand plaatsen tot de automaat er is (±5 minuten per video per platform). Dat beslist Andries; deze opdracht volgt nu zijn keuze.
