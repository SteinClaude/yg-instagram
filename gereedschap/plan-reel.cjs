// Zet één goedgekeurde reel in de planning (nieuwe contentlijn, vanaf 1 okt 2026). Tegenhanger van
// plan-carrousel.cjs, voor video.
//
//   node gereedschap/plan-reel.cjs <video.mp4> <omslag.jpg> <bijschrift.txt> <datum> <tijd> <code> [--omslag-ms 800] [--proef]
//   bv. node gereedschap/plan-reel.cjs pakket/reel.mp4 pakket/omslag.jpg pakket/bijschrift.txt 2026-10-06 19:00 R17 --proef
//
// Wat het doet:
//   * controleert de video met ffprobe: MP4 met H.264 en AAC, staand 9:16 (1080 x 1920), 23-60 beelden per
//     seconde, 3 s tot 15 min, kleiner dan 300 MB, en de moov-atom vooraan (dan kan Instagram meteen beginnen);
//   * controleert de omslag (JPEG van 1080 x 1920, kleiner dan 8 MB) en het bijschrift (tot 2200 tekens, tot 30 hashtags);
//   * weigert als de code, het id of het tijdstip al gebruikt is, of als precies deze video al in beeld/reels staat;
//   * kopieert video en omslag naar beeld/reels/<code>.mp4 en .jpg (de .jpg is ook de poster op het dashboard),
//     maakt mini/reels-<code>.jpg en zet één item in planning.json.
// Het item krijgt `omslag` (de eigen omslag, via cover_url) en `omslagMs` (het videobeeld als terugval, standaard
// 800 ms). Zonder die velden kiest de automaat het beeld op 4 seconden. Het item mag tot 18 uur te laat nog uit,
// omdat GitHub het uurschema soms uren overslaat.
// Alleen gebruiken na akkoord van Gijs op deze reel. Daarna committen en pushen; de automaat plaatst hem.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const stop = m => { console.error('STOP: ' + m); process.exit(1); };
const GEBRUIK = 'gebruik: node gereedschap/plan-reel.cjs <video.mp4> <omslag.jpg> <bijschrift.txt> <jjjj-mm-dd> <uu:mm> <CODE, bv. R17> [--omslag-ms 800] [--proef]';
const args = process.argv.slice(2), pos = [];
let PROEF = false, OMSLAG_MS = 800;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--proef') PROEF = true;
  else if (args[i] === '--omslag-ms') { if (!/^\d+$/.test(args[i + 1] || '')) stop('--omslag-ms vraagt een geheel aantal milliseconden'); OMSLAG_MS = Number(args[++i]); }
  else if (args[i].startsWith('--')) stop(`onbekende optie ${args[i]}\n${GEBRUIK}`);
  else pos.push(args[i]);
}
const [video, omslag, bijschrift, datum, tijd, code] = pos;
if (pos.length !== 6 || !/^\d{4}-\d{2}-\d{2}$/.test(datum || '') || !/^\d{2}:\d{2}$/.test(tijd || '') || !/^[A-Z]\d{2}$/.test(code || '')) stop(GEBRUIK);
for (const f of [video, omslag, bijschrift]) if (!fs.existsSync(f)) stop(`bestand niet gevonden: ${f}`);

// Datum en tijd: een bestaande dag, een bestaande tijd, en minstens een uur vooruit in Amsterdamse tijd.
// Tijden in planning.json zijn Amsterdamse tijd; src/plaatsen.cjs rekent net zo (wandklok, als UTC-minuten).
const [j, mnd, dg] = datum.split('-').map(Number), [uur, min] = tijd.split(':').map(Number);
const dag = new Date(Date.UTC(j, mnd - 1, dg));
if (dag.getUTCFullYear() !== j || dag.getUTCMonth() !== mnd - 1 || dag.getUTCDate() !== dg) stop(`${datum} is geen bestaande datum`);
if (uur > 23 || min > 59) stop(`${tijd} is geen bestaande tijd`);
const delen = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
  .formatToParts(new Date()).reduce((a, p) => (a[p.type] = p.value, a), {});
const nuMin = Date.UTC(+delen.year, +delen.month - 1, +delen.day, +delen.hour, +delen.minute) / 60000;
const doelMin = Date.UTC(j, mnd - 1, dg, uur, min) / 60000;
if (doelMin - nuMin < 60) stop(`${datum} ${tijd} ligt niet minstens een uur in de toekomst (nu in Amsterdam: ${delen.year}-${delen.month}-${delen.day} ${delen.hour}:${delen.minute})`);
const leesbaar = dag.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

(async () => {
  const lees = f => JSON.parse(fs.readFileSync(path.join(WORTEL, f), 'utf8'));
  const planning = lees('planning.json'), gedaan = lees('gedaan.json');
  const id = `${datum}-reel-${code.toLowerCase()}`;
  const REELS = path.join(WORTEL, 'beeld', 'reels');
  if ([...planning.items, ...gedaan.items].some(i => i.id === id)) stop(`id ${id} bestaat al`);
  if (planning.items.some(i => i.datum === datum && i.tijd === tijd)) stop(`op ${datum} ${tijd} staat al iets gepland`);
  if (fs.readdirSync(REELS).some(f => f.startsWith(code + '.') || f.startsWith(code + '-'))) stop(`code ${code} is al in gebruik in beeld/reels`);

  // --- video ---
  const shaVideo = sha(video);
  const dubbel = fs.readdirSync(REELS).filter(f => f.endsWith('.mp4')).find(f => sha(path.join(REELS, f)) === shaVideo);
  if (dubbel) stop(`precies deze video staat al als beeld/reels/${dubbel}`);
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', video]).toString());
  const v = probe.streams.find(s => s.codec_type === 'video'), a = probe.streams.find(s => s.codec_type === 'audio');
  const duur = +probe.format.duration, grootte = +probe.format.size;
  const [fn, fd] = String(v && v.avg_frame_rate || '0/1').split('/').map(Number), fps = fd ? fn / fd : 0;
  if (!/mp4/.test(probe.format.format_name)) stop(`geen MP4: ${probe.format.format_name}`);
  if (!v || v.codec_name !== 'h264') stop(`video moet H.264 zijn, is ${v && v.codec_name}`);
  if (!a || a.codec_name !== 'aac') stop(`geluid moet AAC zijn, is ${a ? a.codec_name : 'afwezig'} (ook een stil spoor moet AAC zijn)`);
  if (v.width !== 1080 || v.height !== 1920) stop(`video is ${v.width}x${v.height}, verwacht 1080x1920`);
  if (fps < 23 || fps > 60) stop(`${fps.toFixed(2)} beelden per seconde, verwacht 23 tot 60`);
  if (duur < 3 || duur > 900) stop(`duur ${duur.toFixed(1)} s, verwacht 3 s tot 15 min`);
  if (grootte > 300 * 1024 * 1024) stop(`video is ${(grootte / 1048576).toFixed(0)} MB, maximaal 300 MB`);
  const kop = fs.readFileSync(video).subarray(0, 4 * 1024 * 1024);
  const moov = kop.indexOf('moov'), mdat = kop.indexOf('mdat');
  if (moov < 0 || (mdat > -1 && moov > mdat)) stop('de moov-atom staat niet vooraan; opnieuw opslaan met ffmpeg -movflags +faststart');
  if (OMSLAG_MS > duur * 1000) stop(`--omslag-ms ${OMSLAG_MS} ligt na het einde van de video (${duur.toFixed(1)} s)`);
  if (+a.sample_rate > 48000 || !(a.channels >= 1 && a.channels <= 2)) stop(`geluid is ${a.sample_rate} Hz met ${a.channels} kanalen; Meta wil hooguit 48 kHz, mono of stereo`);
  console.log(`video: ${path.basename(video)}, ${v.width}x${v.height}, ${fps.toFixed(2)} fps, H.264 + AAC ${a.sample_rate} Hz, ${duur.toFixed(2)} s, ${(grootte / 1048576).toFixed(1)} MB, sha ${shaVideo.slice(0, 12)}`);
  // Waarschuwingen: afwijkingen van Meta's reelspecificatie die Instagram in de praktijk vaak wel slikt.
  // Of hij ze slikt, laat een proefrun zien (Actions > Plaatsen op Instagram > Run workflow, met proefvideo/-omslag/-ms).
  const elst = (() => { let n = 0, i = -1; const m = kop.subarray(moov, moov + 1024 * 1024); while ((i = m.indexOf('elst', i + 1)) > -1) n++; return n; })();
  if (elst) console.log(`LET OP: de video bevat ${elst} edit list(s); Meta vraagt "no edit lists". Verliesvrij weg te halen met ffmpeg -i in.mp4 -map 0 -c copy -movflags +faststart -use_editlist 0 uit.mp4 (doe eerst een proefrun of vraag akkoord).`);
  if (+a.bit_rate > 128000) console.log(`LET OP: geluid ${(a.bit_rate / 1000).toFixed(0)} kbps; Meta noemt 128 kbps (Instagram zet het geluid meestal zelf om).`);

  // --- omslag ---
  const m = await sharp(omslag).metadata();
  if (m.format !== 'jpeg' || m.width !== 1080 || m.height !== 1920) stop(`omslag is ${m.format} ${m.width}x${m.height}, verwacht jpeg 1080x1920`);
  if (fs.statSync(omslag).size > 8 * 1024 * 1024) stop('omslag is groter dan 8 MB');
  console.log(`omslag: ${path.basename(omslag)}, ${m.width}x${m.height}, ${(fs.statSync(omslag).size / 1024).toFixed(0)} kB, sha ${sha(omslag).slice(0, 12)}; terugval videobeeld op ${OMSLAG_MS} ms`);

  // --- bijschrift ---
  const tekst = fs.readFileSync(bijschrift, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\s+$/, '');
  const tags = (tekst.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (!tekst) stop('bijschrift is leeg');
  if (tekst.length > 2200) stop(`bijschrift is ${tekst.length} tekens (max 2200)`);
  if (tags > 30) stop(`bijschrift heeft ${tags} hashtags (max 30)`);

  const item = { id, datum, tijd, soort: 'bericht', taal: 'nl', beeld: [`reels/${code}.mp4`], omslag: `reels/${code}.jpg`, omslagMs: OMSLAG_MS,
    titel: `Reel ${code}: ${tekst.split('\n')[0].slice(0, 60)}`, tekst, inhaaluren: 18, eenmalig: true };
  console.log(`\nitem ${id} op ${leesbaar} om ${tijd} (Amsterdamse tijd): bijschrift ${tekst.length} tekens en ${tags} hashtags`);
  console.log('\nBIJSCHRIFT:\n' + tekst);
  if (PROEF) return console.log('\n(proef: niets geschreven)');

  // Schrijven: lukt een stap niet, dan wat al geschreven was weer weghalen, zodat een nieuwe poging niet
  // vastloopt op "code al in gebruik".
  const geschreven = [];
  try {
    const doelMini = path.join(WORTEL, 'mini', `reels-${code}.jpg`), doelVideo = path.join(REELS, `${code}.mp4`), doelOmslag = path.join(REELS, `${code}.jpg`);
    await sharp(omslag).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(doelMini); geschreven.push(doelMini);
    fs.copyFileSync(video, doelVideo); geschreven.push(doelVideo);
    fs.copyFileSync(omslag, doelOmslag); geschreven.push(doelOmslag);
    if (sha(doelVideo) !== shaVideo || sha(doelOmslag) !== sha(omslag)) throw new Error('kopie wijkt af van het origineel');
    planning.items.push(item);
    planning.items.sort((x, y) => (x.datum + x.tijd).localeCompare(y.datum + y.tijd));
    fs.writeFileSync(path.join(WORTEL, 'planning.json'), JSON.stringify(planning, null, 2) + '\n', 'utf8');
  } catch (e) {
    for (const f of geschreven) fs.rmSync(f, { force: true });
    stop(`schrijven mislukt (${e.message}); ${geschreven.length} bestand(en) weer weggehaald, planning.json ongewijzigd`);
  }
  console.log(`\nplanning.json bijgewerkt. Nu committen en pushen:\n  git add planning.json beeld/reels/${code}.mp4 beeld/reels/${code}.jpg mini/reels-${code}.jpg`);
})().catch(e => stop(e.message));
