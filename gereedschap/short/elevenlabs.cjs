// ElevenLabs-stem voor de shorts (betaald hulpmiddel; elk teken kost tegoed).
//
// De sleutel staat alleen als Windows-gebruikersvariabele ELEVENLABS_API_KEY op de pc van Andries (door hem zelf
// gezet met gereedschap/sleutel-zetten.cjs). Hij komt nooit in een bestand, in git of op het scherm: dit bestand
// leest hem, stuurt hem alleen naar api.elevenlabs.io en toont of bewaart hem nergens.
//
// Zuinig met tegoed:
//  - Elke zin wordt één keer ingesproken en daarna bewaard (map yg-stem-el in de tijdelijke map van de pc). Dezelfde
//    zin met dezelfde stem, hetzelfde model en dezelfde instellingen kost daarna niets meer.
//  - Elke aanroep geeft een plafond mee: het aantal tekens dat dit werk in totaal mag kosten. Het logboek
//    (verbruik.json naast de bewaarde zinnen, niet in git) telt per werk mee; boven het plafond wordt er niets
//    ingesproken.
//
// Gebruik in een script:
//   const EL = require('./short/elevenlabs.cjs');
//   const r = await EL.spreek({ tekst, stem: '<voice_id>', werk: 'stemproef', plafond: 2000 });
//   r.mp3 (pad), r.woorden ([{ w, start, eind }] in seconden), r.tekens (wat het kostte; 0 als hij bewaard was)
// Los:
//   node gereedschap/short/elevenlabs.cjs tegoed            → abonnement en verbruik (alleen lezen, kost niets)
//   node gereedschap/short/elevenlabs.cjs verbruik          → wat dit gereedschap per werk gebruikt heeft
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawnSync } = require('child_process');

const API = 'https://api.elevenlabs.io';
const MAP = path.join(os.tmpdir(), 'yg-stem-el');
const LOGBOEK = path.join(MAP, 'verbruik.json');
// Wat een teken kost per model (uit /v1/models, 14 nov 2026). Onbekend model: 1.
const KOSTEN = { eleven_v4: 1, eleven_v4_turbo: 0.5, eleven_v3: 1, eleven_v3_conversational: 0.5, eleven_multilingual_v2: 1,
  eleven_flash_v2_5: 0.5, eleven_turbo_v2_5: 0.5, eleven_turbo_v2: 0.5, eleven_flash_v2: 0.5 };

function sleutel() {
  let k = (process.env.ELEVENLABS_API_KEY || '').trim();
  if (!k && process.platform === 'win32') {   // een programma dat al draaide ziet een nieuwe variabele niet; lees hem uit Windows
    const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      "[Console]::Out.Write([Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User'))"], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    k = String(r.stdout || '').trim();
  }
  if (!k) throw new Error('De ElevenLabs-sleutel staat niet op deze pc. Andries zet hem met: node gereedschap/sleutel-zetten.cjs --venster');
  return k;
}

const leesLogboek = () => { try { return JSON.parse(fs.readFileSync(LOGBOEK, 'utf8')); } catch (e) { return { werk: {}, regels: [] }; } };
function verbruik(werk) { const l = leesLogboek(); return werk ? (l.werk[werk] || 0) : l; }

// Foutmelding van de dienst, zonder iets van de sleutel.
async function fout(antwoord) {
  let d = ''; try { const j = await antwoord.json(); d = (j.detail && (j.detail.message || j.detail.status)) || JSON.stringify(j).slice(0, 200); } catch (e) {}
  return new Error(`ElevenLabs gaf ${antwoord.status}${d ? ': ' + String(d).slice(0, 240) : ''}`);
}

async function tegoed() {
  const a = await fetch(API + '/v1/user/subscription', { headers: { 'xi-api-key': sleutel() } });
  if (!a.ok) throw await fout(a);
  const j = await a.json();
  return { abonnement: j.tier, gebruikt: j.character_count, limiet: j.character_limit, over: j.character_limit - j.character_count,
    nieuwePeriode: j.next_character_count_reset_unix ? new Date(j.next_character_count_reset_unix * 1000).toISOString().slice(0, 10) : null };
}

// Tijden per teken → tijden per woord (een woord is alles tussen spaties, zoals in de gesproken tekst).
function woordenUit(uitlijning) {
  if (!uitlijning || !uitlijning.characters) return [];
  const { characters: c, character_start_times_seconds: s, character_end_times_seconds: e } = uitlijning;
  const uit = []; let w = '', a = 0, b = 0;
  for (let i = 0; i < c.length; i++) {
    if (/\s/.test(c[i])) { if (w) uit.push({ w, start: +a.toFixed(3), eind: +b.toFixed(3) }); w = ''; continue; }
    if (!w) a = s[i];
    w += c[i]; b = e[i];
  }
  if (w) uit.push({ w, start: +a.toFixed(3), eind: +b.toFixed(3) });
  return uit;
}

// Spreekt één tekst in. `instellingen` = voice_settings van ElevenLabs (leeg = de standaard van de stem).
async function spreek({ tekst, stem, model = 'eleven_v4', instellingen = null, werk, plafond }) {
  if (!tekst || !stem) throw new Error('spreek: tekst en stem zijn nodig');
  if (!werk || !(plafond > 0)) throw new Error('spreek: geef werk en plafond mee (het aantal tekens dat dit werk in totaal mag kosten)');
  fs.mkdirSync(MAP, { recursive: true });
  const id = crypto.createHash('sha1').update(JSON.stringify([model, stem, instellingen, tekst])).digest('hex').slice(0, 16);
  const mp3 = path.join(MAP, id + '.mp3'), tijden = path.join(MAP, id + '.json');
  if (fs.existsSync(mp3) && fs.existsSync(tijden)) return { mp3, woorden: JSON.parse(fs.readFileSync(tijden, 'utf8')).woorden, tekens: 0, bewaard: true };

  const kost = Math.ceil(tekst.length * (KOSTEN[model] ?? 1)), log = leesLogboek(), al = log.werk[werk] || 0;
  if (al + kost > plafond) throw new Error(`Plafond bereikt voor "${werk}": al ${al} tekens gebruikt, deze zin kost ${kost}, het plafond is ${plafond}. Er is niets ingesproken.`);

  const a = await fetch(`${API}/v1/text-to-speech/${encodeURIComponent(stem)}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST', headers: { 'xi-api-key': sleutel(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: tekst, model_id: model, ...(instellingen ? { voice_settings: instellingen } : {}) }) });
  if (!a.ok) throw await fout(a);
  const j = await a.json();
  if (!j.audio_base64) throw new Error('ElevenLabs gaf geen geluid terug.');
  const woorden = woordenUit(j.alignment || j.normalized_alignment);
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
  fs.writeFileSync(tijden, JSON.stringify({ model, stem, instellingen, tekst, woorden }));
  log.werk[werk] = al + kost;
  log.regels.push({ tijd: new Date().toISOString(), werk, model, stem, tekens: kost });
  fs.writeFileSync(LOGBOEK, JSON.stringify(log, null, 1));
  return { mp3, woorden, tekens: kost, bewaard: false };
}

module.exports = { spreek, tegoed, verbruik, woordenUit, KOSTEN, MAP };

if (require.main === module) (async () => {
  const wat = process.argv[2];
  if (wat === 'tegoed') { const t = await tegoed(); console.log(`Abonnement ${t.abonnement}: ${t.gebruikt} van ${t.limiet} tekens gebruikt, ${t.over} over${t.nieuwePeriode ? '; nieuwe periode ' + t.nieuwePeriode : ''}.`); }
  else if (wat === 'verbruik') { const l = verbruik(); console.log(Object.keys(l.werk).length ? Object.entries(l.werk).map(([k, v]) => `${k}: ${v} tekens`).join('\n') : 'Nog niets gebruikt door dit gereedschap.'); }
  else if (wat === 'spreek') {   // voor de generator: opdracht als JSON op de invoer, uitkomst als JSON op de uitvoer
    const r = await spreek(JSON.parse(fs.readFileSync(0, 'utf8')));
    process.stdout.write(JSON.stringify(r));
  }
  else console.log('Gebruik: node gereedschap/short/elevenlabs.cjs tegoed | verbruik');
})().catch(e => { console.error(String(e.message)); process.exit(1); });
