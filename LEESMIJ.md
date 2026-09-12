# YG Digital — automatisch plaatsen op Instagram

Plaatst elke dag een verhaal en op maandag, woensdag en vrijdag een bericht,
afwisselend Nederlands en Engels. Draait op GitHub, dus je computer mag uit.

**Wat het kost:** niets. Meta rekent niets voor de API en GitHub Actions is
gratis voor openbare mappen.

---

## Wat er in deze map zit

| | |
|---|---|
| `planning.json` | Wat er wanneer geplaatst wordt. 120 items, 12 weken vooruit. |
| `beeld/` | De platen als JPEG. Instagram haalt ze hier zelf op. |
| `gedaan.json` | Wat al geplaatst is. Voorkomt dubbel plaatsen. Wordt vanzelf bijgewerkt. |
| `src/plaatsen.cjs` | Het script dat het werk doet. |
| `src/instagram.cjs` | De koppeling met Meta. |
| `gereedschap/klaarzetten.cjs` | Zet platen om naar JPEG en maakt een nieuwe planning. |
| `gereedschap/instellen.cjs` | Eenmalig: haalt je sleutel en accountnummer op. |
| `gereedschap/vernieuw-token.cjs` | Elke twee maanden: vernieuwt de sleutel. |

De map is **openbaar**. Dat moet, want Instagram haalt de platen op van een
openbaar adres. Er staat niets geheims in: de sleutel zit in GitHub Secrets
en komt nooit in de bestanden.

---

## Instellen — eenmalig, ongeveer een half uur

### Stap 1 · De map op GitHub zetten

1. Ga naar **github.com/new**.
2. Naam: `yg-instagram`. Kies **Public**. Niets aanvinken bij "Initialize".
3. Klik **Create repository**.
4. Draai daarna in deze map:

```bash
git remote add origin https://github.com/SteinClaude/yg-instagram.git
git branch -M main
git push -u origin main
```

Bij de eerste push opent er een venster om in te loggen bij GitHub. Dat is normaal.

### Stap 2 · Een Meta-app aanmaken

Dit is geen app die iemand ziet; het is de sleutelbos waarmee het script bij je
account mag. Hij blijft in **ontwikkelmodus** staan, en dat is precies goed:
zo hoef je geen goedkeuringstraject van Meta in. Dat traject is alleen nodig
als je namens *andermans* accounts wilt plaatsen.

1. Ga naar **developers.facebook.com/apps** en log in met je Facebook-account.
2. **Create App**. Kies als type **Business**.
3. Naam: `YG Digital plaatser`. Koppel hem aan je bedrijf als dat gevraagd wordt.
4. In het menu links: **App settings → Basic**. Noteer:
   - **App ID** (een lang nummer)
   - **App Secret** (klik op *Show*)
5. Voeg het product **Instagram** toe (of *Facebook Login for Business*, als
   Instagram er niet bij staat).

### Stap 3 · Een sleutel ophalen

1. Ga naar **developers.facebook.com/tools/explorer** (de Graph API Explorer).
2. Rechtsboven bij **Meta App**: kies `YG Digital plaatser`.
3. Bij **User or Page**: kies *User Token*.
4. Klik **Add a Permission** en vink aan:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
5. Klik **Generate Access Token**. Er opent een venster; vink daar de pagina
   **YG-Digital** aan. Doe je dat niet, dan vindt het script je account niet.
6. Kopieer de sleutel die verschijnt. Die is maar een uur geldig — dat geeft
   niet, de volgende stap ruilt hem om.

### Stap 4 · De lange sleutel maken

Draai in deze map, met de drie dingen uit stap 2 en 3:

```bash
node gereedschap/instellen.cjs <APP_ID> <APP_SECRET> <KORTE_SLEUTEL>
```

Je krijgt twee regels terug: `IG_USER_ID` en `IG_TOKEN`.

Bewaar je **App ID** en **App Secret** ook ergens veilig. Die heb je elke twee
maanden nodig om de sleutel te vernieuwen.

### Stap 5 · De sleutels in GitHub zetten

Ga naar je repo → **Settings → Secrets and variables → Actions → New repository secret**.
Maak er twee:

| Naam | Waarde |
|---|---|
| `IG_TOKEN` | de lange sleutel uit stap 4 |
| `IG_USER_ID` | het nummer uit stap 4 |

Deel die sleutel met niemand: hij geeft toegang tot je Instagram-account.

### Stap 6 · Proefdraaien

Ga naar je repo → tabblad **Actions** → *Plaatsen op Instagram* → **Run workflow**.

Staat er niets op het programma, dan zegt hij "Niets te plaatsen op dit moment"
en controleert hij je sleutel. Dat is een geslaagde proef.

Wil je echt iets zien verschijnen, zet dan in `planning.json` de datum en tijd
van het eerste item op vandaag en een paar minuten geleden, en draai opnieuw.

Vanaf dan draait hij vanzelf, elke twee uur.

---

## Onderhoud

### Elke twee maanden: de sleutel vernieuwen

Meta's sleutels verlopen na 60 dagen. Het script waarschuwt op tijd: je krijgt
een melding op GitHub (en dus een mailtje) met de titel *Sleutel vernieuwen*,
twaalf dagen van tevoren. Dan doe je:

```bash
node gereedschap/vernieuw-token.cjs <APP_ID> <APP_SECRET> <HUIDIGE_SLEUTEL>
```

en zet je de nieuwe waarde bij `IG_TOKEN` (knop **Update**).

**Doe je dit niet, dan stopt het plaatsen stil.** Daarom die waarschuwing.

### Als de voorraad op is

De planning loopt twaalf weken. Voor een nieuwe reeks:

```bash
node gereedschap/klaarzetten.cjs 2026-12-07 12
```

Daarna `git add -A`, `git commit -m "nieuwe planning"`, `git push`.

Heb je in `yg-luxury/instagram/` teksten of platen aangepast? Draai dan eerst
`node instagram/maak.cjs` en `node instagram/voorraad.cjs` daar, en daarna
`klaarzetten.cjs` hier. Dan loopt alles weer gelijk.

### Iets overslaan of wijzigen

Open `planning.json`, haal het item weg of verander de datum, en push.
Wat in `gedaan.json` staat wordt nooit opnieuw geplaatst.

---

## Als er iets misgaat

**De Action staat op rood.** Klik erop en lees de laatste regel. De meeste
meldingen van Meta zijn letterlijk leesbaar ("Meta weigert …").

**"Invalid OAuth access token"** — de sleutel is verlopen of verkeerd
gekopieerd. Doe stap 3 en 4 opnieuw.

**"Media could not be fetched"** — Instagram kon de plaat niet ophalen.
Controleer of de map op GitHub echt **Public** staat.

**Er verschijnt niets, maar de Action is groen.** Kijk in de logs naar
"Nu in Amsterdam"; waarschijnlijk was er simpelweg niets aan de beurt, of
het item stond al in `gedaan.json`.

**Alles moet stoppen.** Repo → Settings → Actions → *Disable actions*. Of
verwijder de twee secrets; dan stopt het script met een nette foutmelding.

---

## Wat dit niet doet

Reageren op reacties en berichten. Een account dat plaatst maar nooit
antwoordt doet het slechter dan een account dat minder plaatst en wel
reageert. Dat blijft handwerk — vijf minuten per dag, en het is het deel dat
klanten oplevert.
