# docs/stand — wat elk crewlid nú doet (machineleesbaar)

Besluit Andries 2 nov 2026 (20:46, 21:03): geen crewlid doet iets wat Eva of een ander crewlid niet kan zien.
Eén bestand per crewlid: `docs/stand/<lid>.json`. Bij elke "ga verder" **vervang** je de inhoud (niet erbij zetten),
commit en push hem. De hook in `.claude/` (akkoord Andries 2 nov) toont bij de start de crew-stand en houdt je bij het stoppen tegen als je werk deed zonder alles te committen, te pushen en dit bestand bij te werken (hoogstens 2 keer per sessie).
Je oplevering (`docs/oplevering-*.md`) blijft het logboek (KLAAR / KAN NIET VERDER-regels); dit bestand is wat nú geldt.

```json
{
  "lid": "bram",
  "tijd": "2026-11-02T21:40:00+01:00",
  "sessie": { "id": "<session_id of leeg>", "plek": "pc | cloud | deelagent", "sinds": "2026-11-02T20:55:00+01:00" },
  "status": "werkt | wacht | klaar | kan-niet-verder",
  "af": ["wat af is · <commit>"],
  "bezig": "één zin",
  "volgende": "één zin",
  "kanNietVerder": null,
  "vragen": [ { "vraag": "…", "aanname": "…", "ondertussen": "…", "blokkeert": false } ],
  "buitenGit": [ { "tijd": "…", "wat": "…", "waar": "…", "wie": "…" } ],
  "voorEva": [ { "id": "H-bram-1", "aan": "lotte", "wat": "…", "pad": "…" } ],
  "ontvangen": ["H-eva-3"],
  "raakt": ["kantoor-db", "supabase-echt", "netlify-main", "bots", "planning.json"]
}
```

- `status`: `werkt` alleen zolang je in deze sessie doorwerkt; aan het eind van een "ga verder" `klaar`, `wacht` of `kan-niet-verder`. Een andere sessie van jou ziet bij de start een waarschuwing als je stand `werkt` zegt en jonger is dan 2 uur.
- `kanNietVerder`: de enige actuele blokkade (`{"reden": "…", "nodig": "…", "van": "andries"}`) of `null`. Oude blokkades staan alleen in je logboek.
- `buitenGit`: alles wat niet vanzelf in git staat: een OK of antwoord dat Andries in je sessie typt (letterlijk), iets in een account of browser, een bestand buiten de repo, een taak, proces of herstart, een bericht van of aan een ander crewlid of hulp.
- `voorEva`: wat een ander crewlid raakt, met een eigen id. Eva zet het door; de ontvanger zet dat id in zijn `ontvangen`. Na 24 uur zonder ontvangst meldt Eva het als "overdracht hangt".
- `raakt`: gedeelde middelen die je deze sessie aanraakt; Eva bewaakt botsingen tussen crewleden.
- Openbare repo (yg-instagram): geen namen van klanten of prospects, geen bedragen, geen kanaalnaam of handle.
