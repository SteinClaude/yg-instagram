# De Instagram-sleutel vernieuwen (voor Andries)

**Wanneer:** vóór ± 15 november 2026, en daarna elke twee maanden. Een sleutel gaat 60 dagen mee. Twaalf dagen voor het
einde zet de automaat zelf een melding op GitHub met de titel *Sleutel vernieuwen* (je krijgt daar een mail van).
Vernieuw je niet, dan **stopt het plaatsen stil**: geplande berichten gaan dan niet uit.

**Wie:** alleen jij. De sleutel geeft toegang tot het Instagram-account. Zet hem nergens anders neer dan in GitHub
Secrets: niet in de repo, niet in een issue of commit, niet in een chat met Eva of Manon, niet in een mail.

Duur: ± 10 minuten. Je hebt nodig: je Meta-ontwikkelaarsaccount (Facebook-login) en je GitHub-account.

---

## Route A · nieuwe sleutel ophalen bij Meta (altijd mogelijk, ook als de oude al verlopen is)

GitHub laat een opgeslagen sleutel nooit meer zien, dus de oude kun je daar niet terugvinden. Daarom is dit de
gewone route.

1. **Meta openen.** Ga naar developers.facebook.com, log in, kies rechtsboven **Mijn apps** en open de app
   **YG Digital plaatser**. (Het precieze adres van de pagina staat in `LEESMIJ.md`, stap 3.)
2. **Naar de Instagram-instellingen.** Kies links **Instagram** → **API-instellingen met Instagram-aanmelding**
   (in het Engels: *API setup with Instagram login*).
3. **Sleutel maken.** Klap **1. Generate access tokens** open. Naast het account `ygdigital.nl` klik je
   **Generate token**. Er gaat een venster van Instagram open: log daar in met het account `ygdigital.nl` als
   dat gevraagd wordt en klik **Toestaan**.
4. **Kopiëren.** Je ziet een lange reeks letters en cijfers. Kopieer die in één keer (knop **Kopiëren**, of alles
   selecteren). Plak hem nog nergens anders.
5. **(Mag, hoeft niet) controleren op je pc.** In de map `yg-instagram`, in een terminal:

   ```
   node gereedschap/controleer.cjs <accountnummer uit LEESMIJ.md> "<de gekopieerde sleutel>"
   ```

   Goed is: `Sleutel werkt. Account: @ygdigital.nl`. Sluit daarna de terminal, zodat de sleutel niet in beeld blijft.
6. **In GitHub zetten.** Ga naar github.com/SteinClaude/yg-instagram → **Settings** → links **Secrets and variables**
   → **Actions**. Bij de secret **`IG_TOKEN`** klik je het potloodje (**Update**), plak je de nieuwe sleutel en klik
   je **Update secret**. Aan **`IG_USER_ID`** verander je niets.
7. **Controleren dat de automaat werkt** (zie hieronder).

## Route B · de huidige sleutel verlengen (alleen als je de huidige sleutel zelf bewaard hebt)

Werkt alleen zolang de sleutel nog niet verlopen is en minstens 24 uur oud is.

1. In de map `yg-instagram`, in een terminal: `node gereedschap/vernieuw-token.cjs "<huidige sleutel>"`.
2. Het script geeft een nieuwe sleutel (60 dagen geldig). Zet die bij **`IG_TOKEN`** zoals in stap 6 van route A.
3. Controleren zoals hieronder.

Twijfel je: neem route A.

---

## Controleren dat de automaat weer werkt

1. Op GitHub: tabblad **Actions** → links **Plaatsen op Instagram** → rechts **Run workflow** → groene knop
   **Run workflow**. Laat het veld voor een proefvideo leeg.
2. Na ± 1 minuut staat de run er met een **groen vinkje**. Klik erop en open de stap *Plaatsen wat aan de beurt is*.
   Daar hoort te staan:
   - `Sleutel werkt, account @ygdigital.nl.`
   - `Nieuwe sleutel herkend; de teller loopt vanaf vandaag.`
   - `Sleutel is 0 dagen oud, nog ongeveer 60 dagen te gaan.`
   - en daarboven ofwel `Niets te plaatsen op dit moment.` ofwel het bericht dat aan de beurt was. Er gaat alleen iets
     uit als het in `planning.json` aan de beurt is; deze proef plaatst niets extra.
3. In het tabblad **Code** verschijnt kort daarna een commit van "YG plaatser" (`sleutel.json` bijgewerkt). Daarin
   staat alleen een vingerafdruk en de datum, nooit de sleutel zelf.
4. Staat er bij **Issues** nog een melding *Sleutel vernieuwen* open, sluit die dan (**Close issue**).

**Rood kruis in plaats van een groen vinkje?** Open de run en kijk naar de foutmelding:
- *"Sleutel werkt niet: …"* (vaak met *Invalid OAuth access token*): de sleutel is verkeerd geplakt (een spatie of een stuk
  te weinig). Doe stap 4 en 6 van route A opnieuw.
- *"Ontwikkelaarsrol is niet voldoende"*: het account `ygdigital.nl` heeft geen rol *Instagram Tester* meer in de app;
  zie `LEESMIJ.md`, stap 2.
- Iets anders: zet de foutmelding (zonder sleutel) in het Kantoor; Eva kijkt mee.

## Wat Manon en Eva doen

Niets met de sleutel zelf. Manon draait het plaatsingsscript niet op de pc (dat zou `status.json` overschrijven) en
ziet de sleutel nooit. Na je vernieuwing kijkt Eva in de avondronde of de volgende geplande plaatsing in `gedaan.json`
staat.
