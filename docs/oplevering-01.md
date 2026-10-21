# Oplevering 01 — stand woensdag 21 oktober 2026

**Van:** Manon (uitvoerder, YG Crew) · **Voor:** Eva (manager) en Andries · **Bij:** `docs/opdracht-01.md`, met de wijzigingen van 21 oktober (nieuwe data, K03 wordt een schildersbedrijf, nieuwe bio-regel).

Gedaan in deze sessie: §1 (map veiliggesteld) en pakket 1 (K02). Niets geplaatst, nergens ingelogd, `planning.json` ongewijzigd, geen Runway-credits, geen echte bedrijven.

## Nieuwe planning batch 1 (21 okt)

| Datum | Code | Inhoud | Stand |
|---|---|---|---|
| vr 23 okt 19:00 | K02 | conceptproject autoschadebedrijf, Alkmaar | **pakket klaar, wacht op "pakket OK"** |
| ma 26 okt 19:00 | K03 | conceptproject **schildersbedrijf** (vakman), zelfde opzet als K01/K02 | nog te maken |
| wo 28 okt 19:00 | W01 | entree van yg-digital.nl | nog te maken |
| vr 30 okt 19:00 | T01 | feit | nog te maken |
| batch 2 (november) | Z01, W02 | zo werkt het · ontwerpstudio als schermafdrukken | later |

## §1 · Wat het oude ongecommitte werk was

Commit `2ef0cd0` (*WIP vorige sessie: highlight-omslagen (poort), profielfoto — stand 13 okt*), gepusht naar `origin/main`; `git status` is schoon.

1. `platen/omslag-poort.cjs` + `beeld/omslagen-poort/` — vijf highlight-omslagen in de stijl van de profielfoto (poortembleem, champagne, patina en korrel) met een symbool op de plek van de YG: Entree = sleutel, Projecten = map, Prijzen = euro, Contact = hoorn, Bij ons = twee mensen. Die symbolen waren op 23 sep al de definitieve keuze van Gijs; de alternatieven staan nog in het script.
2. `platen/profielfoto.cjs` — omgebouwd tot module (`plaat`, `afwerken`) zodat de omslagen letterlijk door dezelfde afwerking lopen; losse aanroep rendert nog steeds de profielfoto.
3. `platen/highlights.cjs` + `beeld/highlights/entree/1.jpg` — een nieuwe reeks stilstaande highlightplaten (champagne, foto achter ivoren waas); alleen plaat 1 van Entree is gerenderd ("De entree van uw bedrijf."), de foto's voor 2–6 zijn er niet en worden ook niet gemaakt (besluit 23 sep: geen credits).
4. `beeld/highlights/projecten/P02-zonder-claims.jpg` en `P03-beeld.jpg` — twee proefvarianten van de Projecten-verhalen (Ordepartner-screenshot zonder claims; de "Van logo tot complete website"-plaat met magazijnfoto).
5. Grote bronbestanden (`platen/bron/clips/magazijn.mp4`, `platen/bron/highlights/`) staan nu in `.gitignore`; `platen/bron/ai/magazijn.jpg` (176 kB) is wel gecommit, net als de andere ai-foto's.

**Oordeel voor §4:** de vier omslagen Entree · Projecten · Prijzen · Contact zijn klaar en bruikbaar zoals ze in `beeld/omslagen-poort/` staan (1080×1080, rond uitgesneden door Instagram, niets in de hoeken). "Bij ons" blijft bewaard. `docs/highlights.md` (welke verhalen onder welke highlight) is nog niet geschreven; dat is de volgende stap na K02.

## Pakket K02 · Autoschade Lindevoort (fictief)

Map: `pakketten/2026-10-23-K02-autoschade/`

- `plaat-1.jpg … plaat-5.jpg` — JPEG 1080×1350, dezelfde vijf-beeldenvorm als K01: (1) het sterke ontwerp groot met de foto als dominerend detail, (2) het zwakke ontwerp met drie markeringen, (3) het sterke ontwerp in dezelfde uitsnede met drie markeringen, (4) twee telefoons met de vaste balk *Bellen · Afspraak maken* vergroot eronder, (5) de uitnodiging voor de ontwerpstudio met een echt studioresultaat.
- `bijschrift.txt` — 71 woorden, u-vorm, één gedachte, eindigt met de aanroep naar de link in de bio; 9 hashtags (de vijf vaste + #autoschade #schadeherstel #garage #autobedrijf). Geen prijs.
- `beeldbeschrijvingen.txt` — alt-tekst per plaat (245–300 tekens).
- `overzicht.jpg`, `telefooncontrole.jpg` — de vijf naast elkaar, en op feedformaat (390 punten breed).
- `bron/` — alles om opnieuw te renderen (zie hieronder).
- `preview/raster-K02.jpg` — het profielraster met K02 erbij (gereedschap: `gereedschap/raster-preview.cjs`, nieuw, herbruikbaar voor K03 e.v.).

**Proef:** `node gereedschap/plan-carrousel.cjs pakketten/2026-10-23-K02-autoschade 2026-10-23 19:00 K02 --proef` slaagt zonder STOP (5 platen, bijschrift 545 tekens, 9 hashtags, alt-teksten 300/267/245/245/248). Niets geschreven.

### Opnieuw renderen

```
node pakketten/2026-10-23-K02-autoschade/bron/studio-opname.cjs   # beeld 5: live studio (internet nodig)
node pakketten/2026-10-23-K02-autoschade/bron/maak-k02.cjs        # foto-uitsneden, schermafdrukken, vijf platen, overzicht
node gereedschap/raster-preview.cjs K02 pakketten/2026-10-23-K02-autoschade/plaat-1.jpg
```

Bron: `garage-na.html` (sterk), `vergelijk-voor.html` / `vergelijk-na.html` (beeld 2 en 3, 760 breed), `garage-mobiel.html` (telefoon), `maak-k02.cjs` (afgeleid van het K01-maakscript), `beelden/` (medaillonachtergrond en logo uit de K01-bron, de Pexels-foto, het studioresultaat). De schermafdrukken in `bron/render/` en de gegenereerde `plaat-N.html` staan in `.gitignore`: afgeleid werk.

Chrome via `playwright-core` (zit in deze map), `sharp` geleend uit `yg-luxury` — dat werkt nog. Lettertypen: Playfair Display en Montserrat uit `platen/fonts` voor de platen, Bodoni MT (systeemletter, zoals K01) voor de garagesite.

### Keuzes

- **Naam:** Autoschade Lindevoort. Gezocht op 21 okt (web): geen bedrijf met die naam gevonden, ook niet als "Lindevoort" met garage/autobedrijf/autoschade. Sector autoschadeherstel/garage, "Alkmaar" in de kopbalk. Alleen voorbeeldinhoud: vier diensten met doorlooptijd (uitdeuken 1 dag, spuitwerk 3 dagen, ruitschade 1 uur, volledig herstel in overleg), openingsdagen, "vervangend vervoer in overleg". Geen prijzen, recensies, adres, telefoonnummer, webadres of claims.
- **Knoppen:** "Bellen" én "Afspraak maken" op elke versie van het sterke ontwerp (opdracht §3); voor een garage is bellen de belangrijkste knop, dus die staat in de vaste telefoonbalk links en gevuld. De drie verschilpunten: menu (lang over twee regels / kort), diensten (lopende tekst / kaarten met doorlooptijd), knop (belknop ontbreekt / bellen en afspraak maken vallen op).
- **Foto:** Pexels 6870314, "Person Using Paint Spray Gun" van Gustavo Fring, Pexels-licentie (vrij te gebruiken, ook commercieel; naamsvermelding niet verplicht, hier wel vastgelegd). Gezichtsloos, licht en warm, past bij de champagneserie. De branchefoto's in `platen/bron/pexels/` hebben geen garage; daarom één nieuwe foto, zoals K01 dat ook deed (8468125). Origineel in `bron/beelden/pexels-6870314-gustavo-fring.jpg`; `maak-k02.cjs` snijdt er de staande en liggende versie uit (het merklogo op het verfbakje valt buiten de uitsnede). De twee andere kandidaten (35149611, 37809549) vielen af: leesbare merksticker, of een gezicht.
- **Beeld 5, het studioresultaat:** de ontwerpstudio heeft geen garagebranche. "Bouw & vakwerk" geeft teksten over bouwen en verbouwen (klopt niet), dus branche **"Iets anders"**, sfeer warm, accent brons (#8a6d3b, zoals K01), deellink `yg-digital.nl/eerste-ontwerp#b=anders&s=warm&n=Autoschade%20Lindevoort&a=%238a6d3b`. De studio kiest voor "Iets anders" zelf een foto mét gezicht (Pexels 5240158), in elke sfeer. Daarom staat de opname zo dat alleen de onderrand van de polaroid met de handgeschreven naam, de kop "Uw verhaal, online zoals het hoort." en de twee knoppen in beeld zijn: gezichtsloos, wel echt. De regel "Dit voorbeeld maakt u zelf in onze ontwerpstudio." is overgenomen van K01.
- **Koppen:** "Vakwerk in de werkplaats. Laat uw website dat ook zien." · "Hetzelfde bedrijf. Een onduidelijke eerste indruk." · "Meer overzicht. Eén tik om te bellen." · "Ook op uw telefoon klopt het." · "Hoe zou uw bedrijf eruitzien?" — zelfde ritme als K01, zodat de lijn herkenbaar blijft. Label op 1–4: "Conceptproject · fictief autoschadebedrijf".
- **Raster:** `preview/raster-K02.jpg` toont A36 (vastgezet) · K02 · K01, en gedempt R17 en A35 — die horen na A36 gearchiveerd te zijn (opdracht 01a, E3). De "medaillon"-tegel uit opdracht §2 is de omslag van reel R17. Tegels in 3:4, zoals Instagram het raster sinds 2025 toont. De bio in de preview is het voorstel uit `docs/bio.md`.

### Aannames

1. Andries heeft A35 en R17 gearchiveerd na A36 (01a E3). Zo niet, dan schuiven ze onder K01; de preview laat beide zien.
2. Autoschade Lindevoort bestaat niet; gecontroleerd via webzoekopdrachten, niet via het KvK-register.
3. Pexels-foto's downloaden en gebruiken valt binnen "Pexels-branchefoto's" uit opdracht §0 regel 2, zoals bij K01.
4. De oude datum voor K02 (ma 19 okt) is vervallen; de nieuwe is vr 23 okt 19:00 (bericht van 21 okt).

### Open punten

- **Studio zonder garagebranche.** Voor volgende vakmanconcepten (K03 schilder valt wél onder "Bouw & vakwerk") is dit geen probleem; voor branches buiten de lijst blijft beeld 5 een compromis. Suggestie voor de site-sessie: een gezichtsloze foto voor "Iets anders", of een branche "Auto & techniek".
- **Doorlooptijden** op de kaarten zijn voorbeeldinhoud. Wil Andries liever geen tijden (zoals "3 dagen") op een fictieve garagesite, dan is dat één regel per kaart.
- **Hashtag #garage** is breed; alternatief #autoschadeherstel. Eén woord wisselen in `bijschrift.txt`.

## Nog te doen (volgorde opdracht §3)

1. "pakket OK" van Andries → `plan-carrousel.cjs` zonder `--proef`, commit `K02 gepland: vr 23 okt 19:00`, push; na 19:00 `git pull`, `gedaan.json` controleren, "geplaatst" melden met mediaId.
2. §4: `docs/bio.md` staat er (twee varianten); `docs/highlights.md` nog schrijven, de vier omslagen zijn klaar.
3. K03 (schildersbedrijf, ma 26 okt), W01 (wo 28 okt), T01 (vr 30 okt).
