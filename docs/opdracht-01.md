# OPDRACHT 01 — Doorstart in de bestaande map + batch 1

**Project:** YG Digital Instagram (@ygdigital.nl) · **Van:** manager Instagram (Claude, project "YG-digital software") · **Voor:** uitvoerder (Claude Code, sessie "yg digital instagram", map `C:\Users\gijsm\yg-instagram`) · **Opdrachtgever:** Andries (ondertekent als Gijs) — hij beslist; de automaat plaatst.
**Datum:** 13 oktober 2026 · **Status: DEFINITIEF.** Andries gaf 13 okt 21:25 "alles akkoord" op BESLUIT-01. Daarna bleek dat er al een werkende Instagram-automaat bestaat (deze map); deze opdracht bouwt daarop voort in plaats van opnieuw te beginnen. Open feiten staan in §8 als aannames en blokkeren niets.

---

## 0. Lees dit eerst

Je werkt in de bestaande map `C:\Users\gijsm\yg-instagram` (openbare repo `SteinClaude/yg-instagram`). Daar draait sinds september een automaat die via de officiële Instagram-API plaatst wat in `planning.json` staat (GitHub Actions, elk uur). De oude contentlijn (verhalen en berichten uit `platen/voorraad.cjs`) is op 28 september gestopt (`gepauzeerd.json`, pauze blijft **aan**). De nieuwe lijn — conceptprojecten zoals de kapsaloncarrousel "Salon Avelijn" (K01, geplaatst 30 sep) — is precies wat we doorzetten.

**Lees vóór je iets doet, in deze volgorde:** `LEESMIJ.md` · `platen/LEESMIJ.md` · `platen/LEESMIJ-BOUWEN.md` · `gereedschap/plan-carrousel.cjs` (de kop) · `gepauzeerd.json` · `geparkeerd.json` · `docs/highlight-entree.md`. Daarna `git status` en `git log --oneline -15`.

**Doel van het account tot mijlpaal 1 (BESLUIT-01 A/B):** een ondernemer uit Alkmaar die een DM van Gijs krijgt, opent het profiel en ziet binnen tien seconden: websites · voor ondernemers zoals zij · Alkmaar en omgeving · eerste ontwerp vrijblijvend, vaste prijs, daarna beheerd · minstens twee voorbeelden van echt werk. Niets dat "net begonnen" uitstraalt. Geen bereikdoel, geen volgersdoel.

Zes regels boven alles:

1. **Je logt nooit in op Instagram en plaatst nooit zelf** — niet via browser, niet via de API buiten de automaat om. Het enige dat plaatst is `src/plaatsen.cjs` vanuit `planning.json`, en daar zet je alleen iets in na **"pakket OK"** van Andries (via de manager).
2. **Geen AI-beeldgeneratie (Runway e.d.), geen betaalde diensten.** Platen komen uit de tekenmachine in `platen/` (Playfair Display + Montserrat, goud `#C9A45C`, ivoor `#F3EEE4`, donker; `blokken.cjs`, `medaillon.cjs`) en de Pexels-branchefoto's in `platen/bron/pexels/`. Wil je toch een gegenereerd beeld: vraag het, maak het niet.
3. **Geen namen, logo's, foto's of screenshots van prospects of klanten.** Alleen eigen werk (yg-digital.nl) en fictieve bedrijven zoals Salon Avelijn.
4. **Huisstijl is heilig:** de drie berichten die nu op het profiel staan en K01 zijn de maat. Niets nieuws ontwerpen; bestaande bouwstenen hergebruiken.
5. **De repo is openbaar** (Instagram haalt de beelden daar op). Dus: niets privés erin. `sleutel.json` (alleen een vingerafdruk), `gedaan.json`, `src/` en `.github/` niet met de hand aanpassen. De ontvolgen-lijsten staan in `.gitignore`; zo laten.
6. **Niet buiten de scope:** geen reels, geen advertenties, geen DM-automatisering, geen koppeling met de software, geen content voor klanten, geen nieuwe weggeefactie.

## 1. Eerste taak: de map veilig stellen (vandaag)

`git status` toont onafgemaakt werk van de vorige sessie: `platen/profielfoto.cjs` (gewijzigd), `platen/highlights.cjs`, `platen/omslag-poort.cjs`, `beeld/omslagen-poort/` (vijf omslagen: entree, projecten, prijzen, contact, bij-ons), `beeld/highlights/…`, `platen/bron/highlights/`, `platen/bron/ai/magazijn.jpg`, `platen/bron/clips/magazijn.mp4`, `mini/highlights-entree-1.jpg`.

- Niets weggooien. Grote bronbestanden (`magazijn.mp4`, `platen/bron/highlights/`) **niet** in git: zet ze in `.gitignore` zoals de vorige sessie dat met `platen/bron/clips/entree.mp4` deed. De rest committen als `WIP vorige sessie: highlight-omslagen (poort), profielfoto — stand 13 okt`.
- Schrijf in `docs/oplevering-01.md` (§7) in vijf regels wat dit werk was en hoe ver het is. Beoordeel of de poort-omslagen klaar zijn voor §4; zo ja, gebruik ze.
- Dependencies worden geleend uit `C:\Users\gijsm\yg-luxury` (zie `platen/LEESMIJ-BOUWEN.md`). Werkt dat niet meer: melden, niet zelf `npm install` in deze map draaien.

## 2. Pakketformaat (vast, past op `plan-carrousel.cjs`)

Elk bericht is een **carrousel van 2–5 platen** (JPEG 1080×1350). Map `pakketten/<jjjj-mm-dd>-<CODE>-<naam>/` met:

- `plaat-1.jpg … plaat-N.jpg` — plaat 1 is de hoofdplaat (die staat in het raster);
- `bijschrift.txt` — ≤ 80 woorden, "u/uw", één gedachte, eindigt met één vraag of de aanroep naar de link in de bio; geen prijs (behalve pakket 5); daaronder 8–12 hashtags: `#alkmaar #ondernemersalkmaar #webdesign #websitelatenmaken #ygdigital` + 3–5 sectorhashtags;
- `beeldbeschrijvingen.txt` — alt-tekst per plaat, zoals het script verwacht;
- `bron/` — de `.cjs`/SVG waaruit de platen komen, zodat een wijziging opnieuw te renderen is.

`pakketten/` komt in git (de bron hoort erbij); `plan-carrousel.cjs` kopieert de platen naar `beeld/berichten/nl/<CODE>-n.jpg`. Codes: kies letters die nog vrij zijn (het script weigert gebruikte codes; `F`, `B`, `K01`, `R` zijn bezet). Voorstel: `K02–K03` conceptprojecten · `W01–W02` eigen werk · `T01` feit · `Z01` zo werkt het.

Verder per pakket: `preview/raster-<CODE>.jpg` — het profielraster zoals het eruit zal zien: de drie bestaande berichten (weggeefactie bovenaan, medaillon, K01) plus de nieuwe hoofdplaten in plaatsingsvolgorde. Voor de bestaande drie: hoofdplaten uit `beeld/berichten/nl/` (K01-1, F35/F26 — controleer in `gedaan.json` en `planning-oud-*.json` welke het zijn; vind je ze niet, dan placeholders en vragen).

## 3. Batch 1 — zes pakketten, automaat plaatst om 19:00

**Pakket 1 moet uiterlijk donderdag 16 oktober klaar zijn.** Volgorde van werken: §1 → pakket 1 → §4 (bio + omslagen) → pakketten 2–6.

| # | Datum | Code | Pijler | Inhoud |
|---|---|---|---|---|
| 1 | vr 17 okt | K02 | concept | **Autoschadeherstel / garage** in Alkmaar, fictieve naam, telefoonkader, 3–5 platen zoals K01 (sluit aan bij prospect 2) |
| 2 | ma 20 okt | W01 | werk | **Entree van yg-digital.nl** — homepage in laptop- én telefoonkader, echte schermafdrukken (`platen/strook.cjs` / `tools/paginaplaat.cjs` in de website-repo) |
| 3 | wo 22 okt | T01 | feit | Goud op donker, één zin per plaat: "1.400 volgers op Instagram. Nul resultaten als iemand 'kapper Alkmaar' googelt." + plaat 2 met de oplossing in één zin, zonder naam |
| 4 | vr 24 okt | K03 | concept | **Restaurant** in Alkmaar, fictieve naam (horeca is de tweede doelsector) |
| 5 | ma 27 okt | Z01 | zo werkt het | Vier platen: gesprek · eerste ontwerp vrijblijvend · vaste prijs **€ 750 + € 49/mnd, excl. btw** (de prijs van de site; de enige post met een prijs) · daarna beheerd. Hosting nooit "inbegrepen" noemen |
| 6 | wo 29 okt | W02 | werk | **Ontwerpstudio /eerste-ontwerp** — de werelden-opening en de studio in telefoonkader, als schermafdrukken (geen reel; R17 bestaat al) |

Batch 2 (opdracht 02, na 30 okt): bekendmaking van de weggeefactie, een derde conceptproject (vakman), tweede feit. Raster vol rond **wo 5 nov**.

**Conceptprojecten (K):** een fictieve website als platen in een telefoonkader — géén screenshot van een echte site. Inhoud: fictieve bedrijfsnaam, sector, "Alkmaar", één sfeerbeeld uit `platen/bron/pexels/` (branche-register `branches.json`), knoppen "Afspraak maken" en "Bellen", rustige typografie. Niets dat op een bestaand bedrijf lijkt. Zelfde opbouw als K01 (medaillonserie), zodat de lijn herkenbaar blijft.

## 4. Profiel: bio en highlights (voorstel, Andries voert in)

- **Bio-tekst**, max 150 tekens, drie regels, met "Alkmaar" en de aanroep "Bekijk uw eerste ontwerp →" (link blijft yg-digital.nl). Lever twee varianten in `docs/bio.md`.
- **Categorie** moet "Webdesigner" worden (staat nu "Ondernemer") — alleen noteren; Andries zet het om.
- **Highlights** — vier: **Entree · Projecten · Prijzen · Contact** (de namen van de vorige sessie; "Werk" en "Hoe het werkt" uit BESLUIT-01 vervallen, want de omslagen in poort-stijl bestaan al). Lever de vier omslagen als `beeld/omslagen-poort/<naam>.jpg` plus in `docs/highlights.md` per highlight welke verhalen eronder horen (de verhalen H01–H03, P01–P03, C01–C02 zijn al geplaatst; wat nog mist maak je als stilstaande plaat 1080×1920, geen video). "Bij ons" blijft bewaard voor later.

## 5. Weggeefactie — niet aanraken

Loopt tot en met **30 oktober 2026, 23:59**; bekendmaking daarna (batch 2). In batch 1 niets over de actie. Het bericht blijft bovenaan doordat Andries het **vastzet** op zijn profiel; de vorige sessie hield daarvoor de hele feed stil — dat is voorbij.

## 6. Klaar = dit werkt (Andries en manager controleren)

1. §1 gecommit; geen grote bronbestanden in git; `git status` schoon.
2. Pakket 1 compleet (platen, bijschrift, alt-teksten, bron, raster-preview); `node gereedschap/plan-carrousel.cjs <map> 2026-10-17 19:00 K02 --proef` slaagt zonder STOP.
3. `preview/raster-K02.jpg`: de nieuwe hoofdplaat oogt naast de drie bestaande als één account.
4. Bijschriften Nederlands, ≤ 80 woorden, zonder prospectnamen, zonder prijs behalve Z01; hashtags volgens §2.
5. `docs/bio.md` en `docs/highlights.md` staan er; vier omslagen klaar.
6. Niets geplaatst, nergens ingelogd, `planning.json` ongewijzigd tot "pakket OK".

## 7. Oplevering en werkwijze daarna

`docs/oplevering-01.md`: wat gemaakt, hoe renderen, keuzes en aannames, open vragen. Meld na §1 en na elk pakket kort wat klaar is.

**Plaatsprotocol per pakket:**
1. Pakket klaar → melden ("pakket K02 klaar").
2. Manager beoordeelt; Andries geeft **"pakket OK"** in het Claude-project.
3. Jij: `plan-carrousel.cjs` zonder `--proef`, commit (`K02 gepland: vr 17 okt 19:00`), push.
4. De automaat plaatst binnen het uur na 19:00 (inhaalvenster 18 uur). Jij controleert na afloop `gedaan.json` (via `git pull`) en meldt "geplaatst" met de mediaId.
5. Gaat iets mis: niet improviseren, melden. Noodstop: planning-item weghalen en pushen, of de workflow uitzetten (LEESMIJ.md).

**Vragen vooraf?** Bovenaan je eerste antwoord, dan wachten op Andries. Geen vragen → beginnen met §1 en daarna pakket 1.

## 8. Aannames bij de start (13 okt) — gelden tot Andries anders meldt

1. **Weggeefactie:** loopt tot 30 okt; winnaar nog niet bekend; Andries zet het bericht vast.
2. **Green DC Hoveniers:** niet tonen tot Andries toestemming meldt.
3. **Beeldmateriaal:** gezichtsloos — medaillon, platen, Pexels-branchefoto's. De profielfoto uit §1 pas gebruiken na akkoord van Andries.
4. **Op het profiel staan drie berichten** (weggeefactie, medaillon, K01). Of reel R17 nog zichtbaar is, vraagt de manager aan Andries; verander daar zelf niets aan.
5. **Sleutel:** de API-sleutel is van ± 16 september en loopt ± 15 november af; GitHub maakt rond 3 november een melding. Vernieuwen doet Andries (LEESMIJ.md, "Onderhoud"); jij vraagt er nooit om.
6. **Doeldata** zijn herzien omdat de start op 13 okt viel: batch 1 vr 17 – wo 29 okt, raster vol rond wo 5 nov.
