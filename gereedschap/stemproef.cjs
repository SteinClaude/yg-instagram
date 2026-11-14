// Stemproeven voor het duo (Vraagteken en Peertje) met ElevenLabs: elke kandidaat zegt één zin van het eigen
// personage. Uitkomst: per stem een mp3 en één filmpje waarin ze achter elkaar te horen zijn, met de naam in beeld.
//
//   node gereedschap/stemproef.cjs --map <uitmap> [--plafond 2000] [--model eleven_v4] [--droog]
//
// --droog telt alleen de tekens en spreekt niets in. De proeven komen niet in git (de uitmap ligt buiten de repo).
// Kost tegoed: zie gereedschap/short/elevenlabs.cjs (plafond per werk, bewaarde zinnen kosten niets).
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');
const F = require('./figuur.cjs'), EL = require('./short/elevenlabs.cjs');
const K = F.K;

const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
const UIT = arg('map'), PLAFOND = Number(arg('plafond') || 2000), MODEL = arg('model') || 'eleven_v4', DROOG = process.argv.includes('--droog');
const WERK = arg('werk') || 'stemproef';
if (!UIT) { console.error('Geef --map <uitmap> mee.'); process.exit(1); }

const ZIN = {
  A: 'Why on earth is this squiggle called an ampersand? Wait, what? A letter? No way!',
  D: 'Ooh, good one! Believe it or not, it used to be in the alphabet. Right at the end: number twenty-seven!',
};
const KANDIDATEN = [
  { figuur: 'A', naam: 'Jessica', stem: 'cgSgspJ2msm6clMCkdW9', aard: 'speels en helder' },
  { figuur: 'A', naam: 'Laura', stem: 'FGY2WhTYpPnrIDTdsKH5', aard: 'enthousiast, eigenwijs' },
  { figuur: 'A', naam: 'Hope', stem: 'tnSpp4vdxKPjI9w0GnoV', aard: 'vrolijk en duidelijk' },
  { figuur: 'D', naam: 'Liam', stem: 'TX3LPaxmHKxFdv7VOQHJ', aard: 'energiek, jong' },
  { figuur: 'D', naam: 'Charlie', stem: 'IKne3meq5aSn9XLyUdCD', aard: 'energiek, Australisch accent' },
  { figuur: 'D', naam: 'Callum', stem: 'N2lVS1w4EtoT3dr4eOWO', aard: 'hees, tekenfilmstem' },
];
const ROL = { A: 'Vraagteken', D: 'Peertje' };

const fontDir = path.join(__dirname, 'short', 'fonts');
const fontFiles = fs.readdirSync(fontDir).filter(f => f.endsWith('.ttf')).map(f => path.join(fontDir, f));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function breek(tekst, max) { const r = []; let l = ''; for (const w of tekst.split(' ')) { if ((l + ' ' + w).trim().length > max) { r.push(l.trim()); l = w; } else l += ' ' + w; } r.push(l.trim()); return r; }

function kaart(k, nr, van) {
  const w = 1080, h = 1080;
  let s = `<rect width="${w}" height="${h}" fill="${K.papier}"/>`;
  for (let y = 40; y < h; y += 64) s += `<path d="M 0 ${y} L ${w} ${y}" stroke="#E2DACB" stroke-width="2"/>`;
  s += `<text x="72" y="112" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${K.signaal}">STEMPROEF ${esc(ROL[k.figuur].toUpperCase())} · ${nr} VAN ${van}</text>`;
  s += `<text x="72" y="214" font-family="Instrument Sans" font-weight="700" font-size="96" fill="${K.inkt}">${esc(k.naam)}</text>`;
  s += `<text x="72" y="270" font-family="Instrument Sans" font-size="38" fill="${K.grijs}">${esc(k.aard)}</text>`;
  s += `<ellipse cx="540" cy="800" rx="170" ry="26" fill="${K.inkt}" opacity="0.12"/>` + F.teken(k.figuur, { x: 540, y: 800, s: 0.86, pose: 'wijst', mond: 'open', aan: k.figuur === 'D' ? 1 : undefined });
  breek(ZIN[k.figuur], 46).forEach((r, i) => s += `<text x="540" y="${900 + i * 46}" text-anchor="middle" font-family="Instrument Sans" font-size="34" fill="${K.inkt}">${esc(r)}</text>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`;
  return new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: w } }).render().asPng();
}

(async () => {
  const tekens = KANDIDATEN.reduce((n, k) => n + Math.ceil(ZIN[k.figuur].length * (EL.KOSTEN[MODEL] ?? 1)), 0);
  console.log(`${KANDIDATEN.length} proeven, model ${MODEL}: hoogstens ${tekens} tekens (plafond ${PLAFOND}; al gebruikt voor "${WERK}": ${EL.verbruik(WERK)}).`);
  if (DROOG) return;
  fs.mkdirSync(UIT, { recursive: true });
  const delen = []; let gekost = 0;
  const telPer = {};
  for (const k of KANDIDATEN) {
    telPer[k.figuur] = (telPer[k.figuur] || 0) + 1;
    const nr = telPer[k.figuur], van = KANDIDATEN.filter(x => x.figuur === k.figuur).length;
    const r = await EL.spreek({ tekst: ZIN[k.figuur], stem: k.stem, model: MODEL, werk: WERK, plafond: PLAFOND });
    gekost += r.tekens;
    const basis = `${ROL[k.figuur].toLowerCase()}-${nr}-${k.naam.toLowerCase()}`;
    const mp3 = path.join(UIT, basis + '.mp3'); fs.copyFileSync(r.mp3, mp3);
    const duur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString().trim());
    const png = path.join(UIT, basis + '.png'); fs.writeFileSync(png, kaart(k, nr, van));
    const deel = path.join(UIT, basis + '.mp4');
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-loop', '1', '-framerate', '30', '-i', png, '-i', mp3,
      '-af', 'adelay=500:all=1,loudnorm=I=-15:TP=-1.5:LRA=11,apad=pad_dur=1', '-c:v', 'libx264', '-tune', 'stillimage', '-crf', '20', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '2', '-t', (duur + 1.4).toFixed(2), deel]);
    delen.push(deel);
    console.log(`${ROL[k.figuur]} ${nr} · ${k.naam}: ${duur.toFixed(1)} s, ${r.bewaard ? 'bewaard (0 tekens)' : r.tekens + ' tekens'}, ${r.woorden.length} woorden met tijd`);
  }
  const lijst = path.join(UIT, 'lijst.txt'); fs.writeFileSync(lijst, delen.map(d => `file '${d.replace(/\\/g, '/')}'`).join('\n'));
  const film = path.join(UIT, 'stemproeven-duo.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lijst, '-c', 'copy', '-movflags', '+faststart', film]);
  for (const d of delen) { fs.unlinkSync(d); fs.unlinkSync(d.replace(/\.mp4$/, '.png')); }
  fs.unlinkSync(lijst);
  console.log(`Klaar: ${film}\nGekost in deze ronde: ${gekost} tekens; totaal voor "${WERK}": ${EL.verbruik(WERK)} van ${PLAFOND}.`);
})().catch(e => { console.error(String(e.message)); process.exit(1); });
