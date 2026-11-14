// Zet een sleutel (API-key) als omgevingsvariabele voor jouw Windows-account, zodat de crew op deze pc hem kan
// gebruiken. De sleutel komt NIET in een bestand, niet in git en niet in de chat: jij plakt hem zelf in je eigen
// terminal, het hulpje bewaart hem alleen in Windows (gebruikersvariabele).
//
//   node gereedschap/sleutel-zetten.cjs                 → ELEVENLABS_API_KEY (met een test bij ElevenLabs)
//   node gereedschap/sleutel-zetten.cjs ANDERE_NAAM     → een andere variabele (zonder test)
//   node gereedschap/sleutel-zetten.cjs --venster       → een klein venster met één verborgen vakje (Ctrl+V, Opslaan);
//                                                          handig als plakken in de terminal niet lukt
//
// Daarna zien nieuwe programma's de variabele vanzelf; de generator leest hem ook rechtstreeks uit Windows, dus
// herstarten is niet nodig. Weghalen kan in Windows: Start → "omgevingsvariabelen" → de regel verwijderen.
const { spawnSync } = require('child_process');
const ARG = process.argv.slice(2), VENSTER = ARG.includes('--venster');
const NAAM = ARG.find(a => !a.startsWith('--')) || 'ELEVENLABS_API_KEY';
if (!/^[A-Z][A-Z0-9_]{2,60}$/.test(NAAM)) { console.error('De naam mag alleen hoofdletters, cijfers en _ bevatten.'); process.exit(1); }

function vraagVerborgen(vraag) {
  return new Promise(klaar => {
    process.stdout.write(vraag);
    const inp = process.stdin;
    if (inp.isTTY && inp.setRawMode) {   // echte terminal: wat je plakt komt niet in beeld
      let tekst = '';
      inp.setRawMode(true); inp.resume(); inp.setEncoding('utf8');
      const op = stuk => {
        for (const c of stuk) {
          if (c === '\r' || c === '\n') { inp.setRawMode(false); inp.pause(); inp.off('data', op); process.stdout.write('\n'); return klaar(tekst); }
          if (c === '\u0003') { inp.setRawMode(false); process.stdout.write('\nGestopt; er is niets veranderd.\n'); process.exit(1); }
          if (c === '\u0008' || c === '\u007f') tekst = tekst.slice(0, -1); else if (c >= ' ') tekst += c;
        }
      };
      inp.on('data', op);
    } else {                             // geen echte terminal: de regel is even zichtbaar; daarna wissen we het scherm
      let tekst = ''; inp.setEncoding('utf8');
      inp.on('data', s => { tekst += s; if (tekst.includes('\n')) { inp.pause(); console.clear(); klaar(tekst.split('\n')[0]); } });
      inp.on('end', () => klaar(tekst));
    }
  });
}

// Venster met één verborgen invoervak. De tekst komt alleen bij dit proces terecht, niet in beeld of in een bestand.
function vraagVenster() {
  const ps = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Windows.Forms.Application]::EnableVisualStyles()
$f = New-Object Windows.Forms.Form
$f.Text = 'Sleutel instellen: ${NAAM}'
$f.ClientSize = New-Object Drawing.Size(520, 170)
$f.StartPosition = 'CenterScreen'; $f.TopMost = $true; $f.FormBorderStyle = 'FixedDialog'; $f.MaximizeBox = $false; $f.MinimizeBox = $false
$f.Font = New-Object Drawing.Font('Segoe UI', 10)
$l = New-Object Windows.Forms.Label
$l.Text = 'Plak hier de sleutel (Ctrl+V) en klik op Opslaan.' + [Environment]::NewLine + 'De tekst blijft verborgen en komt niet in een bestand.'
$l.SetBounds(20, 16, 480, 44)
$t = New-Object Windows.Forms.TextBox
$t.UseSystemPasswordChar = $true; $t.SetBounds(20, 68, 480, 28)
$b = New-Object Windows.Forms.Button
$b.Text = 'Opslaan'; $b.SetBounds(290, 116, 100, 34); $b.DialogResult = 'OK'
$c = New-Object Windows.Forms.Button
$c.Text = 'Annuleren'; $c.SetBounds(400, 116, 100, 34); $c.DialogResult = 'Cancel'
$f.Controls.AddRange(@($l, $t, $b, $c)); $f.AcceptButton = $b; $f.CancelButton = $c
$f.Add_Shown({ $f.Activate(); $t.Focus() })
if ($f.ShowDialog() -eq 'OK') { [Console]::Out.Write('OK:' + $t.Text) } else { [Console]::Out.Write('GESTOPT') }
`;
  const r = spawnSync('powershell', ['-NoProfile', '-STA', '-Command', ps], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const uit = String(r.stdout || '');
  if (r.status !== 0 && !uit) { console.log('Het venster kon niet openen: ' + String(r.stderr || '').trim().slice(0, 200)); process.exit(1); }
  if (!uit.startsWith('OK:')) { console.log('Geannuleerd; er is niets veranderd.'); process.exit(1); }
  return uit.slice(3);
}

(async () => {
  console.log(`Sleutel instellen: ${NAAM}`);
  if (VENSTER) console.log('Er opent een klein venster. Plak daar de sleutel en klik op Opslaan.');
  else console.log('Plak de sleutel hieronder en druk op Enter. Je ziet niets verschijnen; dat hoort zo.');
  const sleutel = (VENSTER ? vraagVenster() : await vraagVerborgen('Sleutel: ')).trim();
  if (!sleutel) { console.log('Geen sleutel ingevuld; er is niets veranderd.'); process.exit(1); }
  if (/\s/.test(sleutel)) { console.log('Er staat een spatie of regeleinde in; kopieer de sleutel opnieuw. Er is niets veranderd.'); process.exit(1); }

  // De waarde gaat via een tijdelijke omgevingsvariabele van dit ene proces naar Windows, niet via de opdrachtregel.
  const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
    `[Environment]::SetEnvironmentVariable('${NAAM}', $env:YG_SLEUTEL_TIJDELIJK, 'User')`],
    { env: { ...process.env, YG_SLEUTEL_TIJDELIJK: sleutel }, stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.status !== 0) { console.log('Het opslaan in Windows is niet gelukt: ' + String(r.stderr || '').trim().slice(0, 200)); process.exit(1); }
  console.log(`Opgeslagen: ${NAAM} staat nu op deze pc (${sleutel.length} tekens). Niet in een bestand, niet in git.`);

  if (NAAM === 'ELEVENLABS_API_KEY') {   // korte test: werkt de sleutel, en welk abonnement hoort erbij?
    try {
      const a = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': sleutel } });
      if (a.ok) { const j = await a.json();
        console.log(`Test geslaagd. Abonnement: ${j.tier || 'onbekend'} · tekens gebruikt deze periode: ${j.character_count ?? '?'} van ${j.character_limit ?? '?'}.`);
      } else if (a.status === 401) console.log('Let op: ElevenLabs weigert deze sleutel (401). Kijk of hij goed gekopieerd is, of dat hij rechten mist ("Text to Speech" en "User" aanzetten).');
      else console.log(`Opgeslagen, maar de test gaf status ${a.status}. De sleutel kan beperkte rechten hebben; voor de stemmen is "Text to Speech" nodig.`);
    } catch (e) { console.log('Opgeslagen, maar de test kon ElevenLabs niet bereiken (' + String(e.message).slice(0, 80) + ').'); }
  }
  console.log('Klaar. Zeg tegen Manon: "sleutel staat erop".');
})();
