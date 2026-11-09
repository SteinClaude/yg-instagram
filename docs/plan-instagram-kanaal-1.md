# Plan — shorts van kanaal 1 als Reels op Instagram kanaal 1

**Opgesteld:** ma 9 nov 2026 — Manon · **Status:** gebouwd op tak `manon/instagram-kanaal-1` (commit 7fbf229, ma 9 nov 11:05), nog niet live: wacht op Eva (meekijken) en go van Andries (B30). Niets ingepland.

Andries, ma 9 nov 2026 ±10:35: *"zullen we de shorts die gemaakt zijn ook inplannen voor het instagram kanaal, dit wil ik het zelfde als voor het ygdigital.nl instagram, we plannen dat in via een extrene die plaats het dan automatisch ect"*. Op zijn keuzes daarna:

- **Ritme:** *"de short die al online staan plaatsen we dan op instagram zodat we bij lopen en dan is het daarna gelijk met youtube"*
- **Bijschrift:** "Eerst een keurlijst"
- **Automaat:** "Eerst alleen een plan"

Dit is dat plan. Er wordt niets gebouwd en niets ingepland zonder het volgende woord van Andries.

## 1. Hoe het straks loopt

1. Een short met "pakket OK" plus een goedgekeurd Instagram-bijschrift ("bijschrift OK <code>") komt als Reel-item in `planning.json`. Elk item krijgt het veld `"account": "kanaal-1"`.
2. De automaat (GitHub Actions, elk uur) plaatst het item op de geplande tijd op Instagram kanaal 1, net zoals hij dat voor @ygdigital.nl doet.
3. `gedaan.json` houdt bij wat geplaatst is. De automaat maakt vanzelf een melding als de sleutel bijna verloopt (elke 60 dagen).
4. Video en omslag komen uit het pakket. De video's staan al in deze openbare repo en Instagram haalt ze op via GitHub Pages.

@ygdigital.nl blijft op pauze. Items zonder `account` blijven van @ygdigital.nl, dus aan dat account verandert niets.

## 2. Wat Andries één keer doet (zelf; Manon logt niet in en koppelt geen apps)

1. **Instagram kanaal 1 een professioneel account maken.** Dit doe je in de app: Instellingen → Accounttype en hulpmiddelen → Overstappen naar professioneel account → Creator. De Instagram-API plaatst alleen op professionele accounts.
2. **Het account toevoegen aan de bestaande Meta-app** (dezelfde als voor @ygdigital.nl, in ontwikkelmodus): rol *Instagram Tester* geven en de uitnodiging in Instagram accepteren. Op die manier is ook @ygdigital.nl gekoppeld (zie `LEESMIJ.md`, stap 2–3).
3. **Een sleutel maken** (Generate token) voor kanaal 1.
4. **Twee geheimen in GitHub zetten** (Settings → Secrets → Actions): `IG_TOKEN_K1` (de sleutel) en `IG_USER_ID_K1` (het accountnummer). Het accountnummer van kanaal 1 komt **niet** in deze repo, alleen in de geheimen. De repo is openbaar en het nummer verwijst naar het account.

Ongeveer 15 minuten. De klikstappen staan in `LEESMIJ.md`, deel "Tweede account: Instagram van kanaal 1" (op de tak; na de go ook op main).

## 3. Wat er aan de automaat verandert (gebouwd op tak `manon/instagram-kanaal-1`, nog niet live)

| Bestand | Verandering |
|---|---|
| `.github/workflows/plaatsen.yml` | Ook `IG_TOKEN_K1` en `IG_USER_ID_K1` doorgeven. |
| `src/plaatsen.cjs` | Per item de sleutel kiezen op `account` (leeg = @ygdigital.nl). De leeftijd van de sleutel per account bijhouden (`sleutel.json`). De melding "Sleutel vernieuwen" noemt het account. |
| `gereedschap/plan-reel.cjs` | Optie `--account kanaal-1`. Codes `YSxx` toestaan (nu alleen één letter + twee cijfers). |
| `LEESMIJ.md` | Uitleg tweede account en sleutel vernieuwen. |

Voorzichtig te werk: eerst een proefdraai met de knop *Run workflow* → proefvideo. Instagram haalt dan één video op, maar er wordt niets geplaatst. Pas daarna het eerste echte item. Dit valt onder deploy-go (B30): **wie het bouwt en wanneer het live gaat, beslist Andries.**

## 4. Ritme: eerst bijlopen, dan gelijk met YouTube

- **Bijlopen:** alle shorts die op de startdag al openbaar zijn op YouTube, op volgorde vanaf YS01, met **3 per dag** (12:00, 15:00 en 18:00 Amsterdam). Elke dag komt er op YouTube één bij, dus per dag lopen we er twee in.
- **Daarna:** elke dag 18:00, dezelfde short als op YouTube.
- Voorbeeld: start ma 16 nov. Dan staan YS01–YS10 al online. Bijlopen duurt 16–19 nov, en vanaf vr 20 nov loopt het gelijk (YS14 op beide om 18:00).
- De precieze lijst met datums maak ik op de dag dat de automaat klaar is. Dan weet ik hoeveel er bij te lopen zijn.

## 5. Bijschrift: eigen tekst, eerst een keurlijst

Per short schrijf ik een Instagram-bijschrift. Die komen samen op de keurlijst, en een short gaat de planning pas in na **"bijschrift OK <code>"**. Het pakket OK voor script, bronnen en titel blijft gelden: de video is dezelfde.

Vorm (Engels, ±600 tekens, max. 5 hashtags, geen link, geen YG Digital):

```
Why is a stop sign an octagon? It used to be yellow.

In the early 1920s, US highway engineers ranked danger by shape, so drivers could react to a sign at night even when they couldn't read it. Round meant railroad crossing, the octagon meant stop, the diamond meant caution.

A 1924 report picked yellow for stop signs, because red was hard to see at night. Red only came in 1954, thanks to new fade-resistant finishes.

Source: U.S. Federal Highway Administration, "The Evolution of MUTCD" (archived, UNT Libraries).

New every day at 18:00 (Amsterdam).

#history #design #roadsigns #todayilearned #everydaythings
```

Verschillen met YouTube:
- Geen `#Shorts`.
- Kortere uitleg.
- De bron met naam, maar zonder lange link. Een link is op Instagram niet aanklikbaar. **Bij beelden met CC BY** (Wikimedia Commons) blijven maker, licentie en link er wél in. Dat is verplicht.

## 6. Open punten voor Andries

1. ~~Wie bouwt de aanpassing~~: Manon (Andries, 9 nov ±10:58: "Ja, Manon bouwt"). Gebouwd op tak `manon/instagram-kanaal-1`; live na meekijken Eva en jouw go.
2. **AI-label.** Uitgezocht na de proef (ma 9 nov): de Instagram-API heeft sinds juni 2026 een eigen veld, `is_ai_generated` (zelfmelding van AI, zet het label "AI-info" bij publiceren; niet achteraf). Advies: aanzetten bij elke Reel van kanaal 1, zoals het AI-label op YouTube. Vraagt een kleine aanpassing van de automaat.
3. **Tweede platform eerder dan gepland.** In de koers stond: tweede platform pas na de evaluatie van 30 dagen. Met dit besluit komt Instagram er eerder bij. Instagram betaalt in Nederland niet uit; het levert bereik op. Ik meld dit aan Eva, zodat zij de regel in de koers kan bijwerken.
4. **De keurlijst bijschriften.** Ik begin met de eerste 10 (YS01–YS10, de bijloop-week) zodra je dat zegt, of samen met de bouw.
