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
| `sleutel.json` | Wanneer de huidige sleutel voor het eerst gezien is, om op tijd te waarschuwen. Alleen een vingerafdruk, nooit de sleutel zelf. |
| `src/plaatsen.cjs` | Het script dat het werk doet. |
| `src/instagram.cjs` | De koppeling met Instagram. |
| `gereedschap/klaarzetten.cjs` | Zet platen om naar JPEG en maakt een nieuwe planning. |
| `gereedschap/controleer.cjs` | Toetst of sleutel en accountnummer werken. |
| `gereedschap/vernieuw-token.cjs` | Elke twee maanden: vernieuwt de sleutel. |

De map is **openbaar**. Dat moet, want Instagram haalt de platen op van een
openbaar adres. Er staat niets geheims in: de sleutel zit in GitHub Secrets
en komt nooit in de bestanden.

---

## Hoe dit met Meta praat

Er zijn twee routes naar de Instagram API. Wij gebruiken de tweede:

- **Via Facebook-login** — loopt via je Facebook-pagina. Bij ons gaf `/me/accounts`
  nul pagina's terug, omdat YG-Digital een pagina van de nieuwe soort is die aan
  je profiel hangt. Onbruikbaar gebleken.
- **Via Instagram-login** — praat rechtstreeks met je Instagram-account, zonder
  de pagina. Dit is wat hier draait, tegen `graph.instagram.com`.

Je Facebook-pagina blijft gewoon bestaan en gekoppeld; die heb je nodig voor
Business Suite. Hij is alleen niet de weg waarlangs dit script plaatst.

---

## Instellen

### Stap 1 · De map op GitHub (al gedaan)

Staat op **github.com/SteinClaude/yg-instagram**, openbaar.

### Stap 2 · De Meta-app (al gedaan)

App **YG Digital plaatser**, App ID `1602408081320897`, in **ontwikkelmodus**.
Dat is precies goed: zo hoef je geen goedkeuringstraject van Meta in. Dat is
alleen nodig als je namens *andermans* accounts wilt plaatsen.

Je account `ygdigital.nl` heeft daarin de rol **Instagram Tester**, en die
uitnodiging is geaccepteerd. Zonder die rol weigert Meta met *"Ontwikkelaarsrol
is niet voldoende"*.

### Stap 3 · De sleutel ophalen

1. Ga naar
   `developers.facebook.com/apps/1602408081320897/instagram-business/API-Setup/`
2. Klap **1. Generate access tokens** open. Daar staat `ygdigital.nl`.
3. Klik **Generate token** en kopieer de sleutel.

De sleutel is 60 dagen geldig. Je accountnummer staat er meteen naast:
**17841434765692615**.

### Stap 4 · Controleren

Draai in deze map:

```powershell
node gereedschap/controleer.cjs 17841434765692615 "JOUW_SLEUTEL"
```

Je hoort te zien: `Sleutel werkt. Account: @ygdigital.nl`

### Stap 5 · De sleutels in GitHub zetten

Repo → **Settings → Secrets and variables → Actions → New repository secret**.
Twee stuks:

| Naam | Waarde |
|---|---|
| `IG_USER_ID` | `17841434765692615` |
| `IG_TOKEN` | de sleutel uit stap 3 |

Deel die sleutel met niemand: hij geeft toegang tot je Instagram-account.

### Stap 6 · Proefdraaien

Repo → tabblad **Actions** → *Plaatsen op Instagram* → **Run workflow**.

Staat er niets op het programma, dan zegt hij "Niets te plaatsen op dit moment"
en controleert hij je sleutel. Dat is een geslaagde proef.

Wil je echt iets zien verschijnen: zet in `planning.json` de datum en tijd van
het eerste item op vandaag en een paar minuten geleden, en draai opnieuw.

Vanaf dan draait hij vanzelf, elk uur.

---

## Onderhoud

### Elke twee maanden: de sleutel vernieuwen

Instagram-sleutels gaan 60 dagen mee. Het script houdt bij hoe oud de jouwe is
en maakt twaalf dagen van tevoren een melding op GitHub met de titel
*Sleutel vernieuwen* — daar krijg je een mailtje van. Dan doe je:

```powershell
node gereedschap/vernieuw-token.cjs "HUIDIGE_SLEUTEL"
```

en zet je de nieuwe waarde bij `IG_TOKEN` (knop **Update**).

Je hebt hier geen App ID of App Secret voor nodig; bij deze route vernieuwt de
sleutel zichzelf. Wel moet de sleutel minstens 24 uur oud zijn.

**Doe je dit niet, dan stopt het plaatsen stil.** Daarom die waarschuwing.

### Als de voorraad op is

De planning loopt twaalf weken. Voor een nieuwe reeks:

```powershell
node gereedschap/klaarzetten.cjs 2026-12-07 12
```

Daarna `git add -A`, `git commit -m "nieuwe planning"`, `git push`.

Heb je in `yg-luxury/instagram/` teksten of platen aangepast? Draai daar dan
eerst `node instagram/maak.cjs` en `node instagram/voorraad.cjs`, en daarna
`klaarzetten.cjs` hier.

### Iets overslaan of wijzigen

Open `planning.json`, haal het item weg of verander de datum, en push.
Wat in `gedaan.json` staat wordt nooit opnieuw geplaatst.

---

## Als er iets misgaat

**De Action staat op rood.** Klik erop en lees de laatste regel. De meldingen
van Instagram zijn letterlijk leesbaar ("Instagram weigert …").

**"Sleutel werkt niet meer"** — verlopen of verkeerd gekopieerd. Doe stap 3
tot en met 5 opnieuw.

**"Instagram kon het beeld niet verwerken"** — controleer of de map op GitHub
echt **Public** staat; anders kan Instagram de plaat niet ophalen.

**"Ontwikkelaarsrol is niet voldoende"** — de Instagram Tester-rol is
ingetrokken. Opnieuw toekennen bij *App roles → More → Instagram Testers*, en
accepteren op `instagram.com/accounts/manage_access/`.

**Groen, maar er verschijnt niets.** Kijk in de logs naar "Nu in Amsterdam";
waarschijnlijk was er niets aan de beurt, of het stond al in `gedaan.json`.

**Alles moet stoppen.** Repo → Settings → Actions → *Disable actions*. Of
verwijder de twee secrets; dan stopt het script met een nette melding.

---

## Wat dit niet doet

Reageren op reacties en berichten. Een account dat plaatst maar nooit
antwoordt doet het slechter dan een account dat minder plaatst en wel
reageert. Dat blijft handwerk — vijf minuten per dag, en het is het deel dat
klanten oplevert.
