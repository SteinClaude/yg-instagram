// Verhalen voor de highlights: 9:16, 24 beelden per seconde, bewegend beeld
// (een echte clip of een schermopname) met dezelfde tekstlagen, letters en
// plekken als de reels en de platen. De tekst gaat er als laatste overheen,
// scherp en letterlijk; er wordt nooit tekst gegenereerd.
//
//   node gereedschap/verhaal-video.cjs               alle verhalen uit teksten/highlights-nl.cjs
//   node gereedschap/verhaal-video.cjs H02           alleen dat verhaal
//   node gereedschap/verhaal-video.cjs H02 --proef   proefversie met nagebootste telefoonbalken
//                                                    en het vak voor de linksticker
//
// Resultaat: beeld/highlights/<map>/<code>.mp4 (stil audiospoor, anders weigert
// Instagram het bestand soms) plus een stilstaand beeld <code>.jpg. De proef en
// de tussenbestanden staan in platen/uit/highlights/<code>/ (niet in git).
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const M = require('../platen/maak.cjs');
const R = require('./reel.cjs');   // laag, VERLOOP, chroom, groep, regel: dezelfde plekken als de reels

const W = 1080, H = 1920, FPS = 24;
const k = M.K.donker, L = M.L, r3 = M.r3;
const WORTEL = path.join(__dirname, '..');
const BRON = path.join(WORTEL, 'platen', 'bron');
const WERK = path.join(WORTEL, 'platen', 'uit', 'highlights');
const UIT = path.join(WORTEL, 'beeld', 'highlights');
const MX = W / 2;

// Verloop voor een schermopname: de opname vult de hele plaat, zoals een clip
// in een reel. Bovenin licht dempen, tot ruim over de helft vrijwel niets, en
// onder de tekst stevig donker (steviger dan het reel-verloop, omdat de tekst
// van de site even groot en even licht is als de tekst van het verhaal). Een
// dicht vlak onderin was Gijs' eerste indruk: "half om half", 25 sep 2026.
const VERLOOP_OPNAME = `<defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#141414" stop-opacity="0.34"/>
<stop offset="12%" stop-color="#141414" stop-opacity="0.10"/>
<stop offset="46%" stop-color="#141414" stop-opacity="0.14"/>
<stop offset="55%" stop-color="#141414" stop-opacity="0.82"/>
<stop offset="62%" stop-color="#141414" stop-opacity="0.94"/>
<stop offset="100%" stop-color="#141414" stop-opacity="0.97"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#v)"/>`;

// Gouden afsluitregel, met een getekende pijl (geen lettertekenpijl: die zit
// niet betrouwbaar in Montserrat).
function slot(tekst, y, pijl) {
  const g = 30, sp = 0.10 * g, w = M.breedte(L.sansMed, tekst, g, sp);
  const pw = pijl ? 44 : 0, x = MX - (w + (pijl ? pw + 18 : 0)) / 2, basis = y + g * 0.72;
  let s = M.pad(L.sansMed, tekst, x, basis, g, sp, k.goud).svg;
  if (pijl) {
    const ax = x + w + 18, ay = basis - g * 0.34;
    s += `<path d="M${r3(ax)} ${r3(ay)} H${r3(ax + pw)} M${r3(ax + pw - 12)} ${r3(ay - 10)} L${r3(ax + pw)} ${r3(ay)} L${r3(ax + pw - 12)} ${r3(ay + 10)}" fill="none" stroke="${k.goud}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return R.laag(s);
}

// Nagebootste telefoonbalken voor de proef: voortgangsbalkjes, naam en de
// antwoordbalk zoals Instagram ze over een verhaal legt, plus het stickervak.
function telefoonbalken(v) {
  const wit = '#FFFFFF', n = 3, gap = 8, bw = (W - 48 - gap * (n - 1)) / n;
  let s = `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#000" stop-opacity="0.45"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></linearGradient></defs>
<rect width="${W}" height="260" fill="url(#b)"/><rect y="1660" width="${W}" height="260" fill="url(#o)"/>`;
  for (let i = 0; i < n; i++) s += `<rect x="${r3(24 + i * (bw + gap))}" y="84" width="${r3(bw)}" height="5" rx="2.5" fill="${wit}" opacity="${i === (v.nr || 0) ? 0.95 : 0.45}"/>`;
  s += `<circle cx="80" cy="152" r="38" fill="#EFE8DA"/>` + M.poort('#8c6f3a', 80 - 15, 130, 0.30);
  const naam = 'ygdigital.nl', gn = 30;
  s += M.pad(L.sansMed, naam, 138, 163, gn, 0, wit).svg;
  s += `<g opacity="0.7">${M.pad(L.sans, '3 u', 138 + M.breedte(L.sansMed, naam, gn, 0) + 18, 163, 28, 0, wit).svg}</g>`;
  s += `<circle cx="960" cy="152" r="4" fill="${wit}"/><circle cx="976" cy="152" r="4" fill="${wit}"/><circle cx="992" cy="152" r="4" fill="${wit}"/>`;
  s += `<path d="M1030 138 L1058 166 M1058 138 L1030 166" stroke="${wit}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<rect x="36" y="1748" width="820" height="88" rx="44" fill="none" stroke="${wit}" stroke-width="2.5" opacity="0.8"/>`;
  s += `<g opacity="0.75">${M.pad(L.sans, 'Bericht verzenden', 72, 1803, 30, 0, wit).svg}</g>`;
  s += `<path d="M930 1818 C916 1802 890 1782 890 1760 A22 22 0 0 1 930 1748 A22 22 0 0 1 970 1760 C970 1782 944 1802 930 1818 Z" fill="none" stroke="${wit}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M1000 1808 L1054 1782 L1000 1756 L1012 1782 Z M1012 1782 L1054 1782" fill="none" stroke="${wit}" stroke-width="4" stroke-linejoin="round"/>`;
  if (v.sticker) {
    const [a, b] = v.sticker, t = 'RUIMTE VOOR DE LINKSTICKER', g = 22, sp = 0.2 * g, w = M.breedte(L.sansMed, t, g, sp);
    s += `<rect x="140" y="${a}" width="800" height="${b - a}" rx="18" fill="none" stroke="${k.goud}" stroke-width="2" stroke-dasharray="10 8" opacity="0.8"/>`;
    s += `<g opacity="0.85">${M.pad(L.sansMed, t, MX - w / 2, (a + b) / 2 + g * 0.36, g, sp, k.goud).svg}</g>`;
  }
  return R.laag(s);
}

// Achtergrond: één bron, of een montage van stukken (van/tot in seconden,
// snelheid > 1 versnelt) achter elkaar zonder overgangen.
function achtergrond(v, werk) {
  const fps = v.fps || FPS;
  if (v.bron && v.naloop) return metNaloop(path.join(BRON, v.bron), werk, v.naloop, fps);
  if (v.bron) return path.join(BRON, v.bron);
  const uit = path.join(werk, 'achtergrond.mp4');
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  const delen = [];
  v.montage.forEach((d, i) => {
    args.push('-i', path.join(BRON, d.bron));
    const trim = `trim=start=${d.van || 0}${d.tot ? `:end=${d.tot}` : ''}`;
    delen.push(`[${i}:v]${trim},setpts=(PTS-STARTPTS)/${d.snelheid || 1},fps=${fps},scale=${W}:${H}:flags=lanczos,setsar=1,format=yuv420p[p${i}]`);
  });
  const filter = delen.join(';') + ';' + v.montage.map((_, i) => `[p${i}]`).join('') + `concat=n=${v.montage.length}:v=1:a=0[v]`;
  args.push('-filter_complex', filter, '-map', '[v]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', uit);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  return uit;
}


// Een korte clip verlengen zoals reel.cjs dat doet: eerst de clip, daarna het
// laatste beeld dat 'naloop' seconden langzaam doorzoomt (snel beginnend, uitlopend,
// vandaar de wortel), zodat de camera niet hoorbaar stilvalt als de clip afloopt.
function metNaloop(clipPad, werk, naloop, fps) {
  const slot = path.join(werk, 'slot.jpg'), slotGroot = path.join(werk, 'slot-groot.png'), uit = path.join(werk, 'achtergrond.mp4');
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-sseof', '-0.15', '-i', clipPad, '-frames:v', '1', '-q:v', '2', slot]);
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', slot, '-vf', `scale=${2 * W}:${2 * H}:flags=lanczos`, slotGroot]);
  const rf = Math.round(naloop * fps);
  const filter = [
    `[0:v]fps=${fps},scale=${W}:${H}:flags=lanczos,setsar=1,format=yuv420p[a]`,
    `[1:v]zoompan=z='1+0.10*sqrt(on/${rf})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${rf}:s=${W}x${H}:fps=${fps},setsar=1,format=yuv420p[b]`,
    '[a][b]concat=n=2:v=1:a=0[v]',
  ].join(';');
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', clipPad, '-loop', '1', '-framerate', String(fps), '-t', String(naloop + 1), '-i', slotGroot,
    '-filter_complex', filter, '-map', '[v]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', uit], { stdio: 'inherit' });
  return uit;
}

async function bouw(v, proef) {
  const fps = v.fps || FPS;   // een clip van 30 fps houdt zijn tempo; 24 is de standaard van de opnamen
  const werk = path.join(WERK, v.code); fs.mkdirSync(werk, { recursive: true });
  const map = path.join(UIT, v.map); fs.mkdirSync(map, { recursive: true });
  const ontbreekt = (v.bron ? [v.bron] : v.montage.map(d => d.bron)).filter(b => !fs.existsSync(path.join(BRON, b)));
  if (ontbreekt.length) { console.log(`${v.code}: bron ontbreekt (${ontbreekt.join(', ')}), overgeslagen`); return; }
  const bg = achtergrond(v, werk);

  const lagen = [];
  const zet = (naam, png, tijd) => { const p = path.join(werk, naam + '.png'); fs.writeFileSync(p, png); lagen.push({ naam, p, ...tijd }); };
  // verloop 'geen' en chroom: false geven de opname schoon, zonder iets eroverheen
  // (Gijs, 25 sep 2026: "het filmpje compleet in beeld en duidelijk").
  if (v.verloop !== 'geen') zet('verloop', R.laag(v.verloop === 'opname' ? VERLOOP_OPNAME : R.VERLOOP(W, H)), { in: 0, d: 0 });
  if (v.chroom !== false) zet('chroom', R.chroom(), { in: 0.4, d: 0.8 });
  v.lagen.forEach((l, i) => {
    const png = l.soort === 'groep' ? R.groep(l.boven || '', l.kop, l.onderkant, l.kopGrootte || 96)
      : l.soort === 'regel' ? R.regel(l.tekst, l.bovenkant)
        : slot(l.tekst, l.y, l.pijl);
    zet('tekst' + i, png, { in: l.in, d: 0.6, uit: l.uit, rijst: true });
  });
  if (proef) zet('proef', telefoonbalken(v), { in: 0, d: 0 });

  // Zachte opkomst: in 0,7 s van 24 px lager naar zijn plek, tegelijk met de fade.
  const rijs = st => `'24*(1-min(1,max(0,(t-${st})/0.7)))'`;
  const filter = [`[0:v]fps=${fps},scale=${W}:${H}:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=${v.duur},format=rgba[v0]`];
  lagen.forEach((l, i) => {
    let f = `[${i + 1}:v]format=rgba`;
    if (l.d) f += `,fade=t=in:st=${l.in}:d=${l.d}:alpha=1`;
    if (l.uit) f += `,fade=t=out:st=${l.uit}:d=0.5:alpha=1`;
    filter.push(`${f}[o${i}]`, `[v${i}][o${i}]overlay=0:${l.rijst ? rijs(l.in) : 0}[v${i + 1}]`);
  });
  // Expliciet beperkt bereik en BT.709, anders vlagt x264 de video als full-range
  // 601 en loopt het zwart dicht bij spelers die 1080p als 709 aannemen.
  filter.push(`[v${lagen.length}]fade=t=out:st=${v.duur - 0.5}:d=0.5,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p[v]`);

  const uit = path.join(proef ? werk : map, v.code + (proef ? '-proef' : '') + '.mp4');
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-i', bg];
  for (const l of lagen) args.push('-loop', '1', '-framerate', String(fps), '-t', String(v.duur), '-i', l.p);
  args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000');
  args.push('-filter_complex', filter.join(';'), '-map', '[v]', '-map', `${lagen.length + 1}:a`, '-t', String(v.duur), '-r', String(fps),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-use_editlist', '0', uit);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });

  // Stilstaande beelden: één bij het echte verhaal, drie bij de proef (na elke tekst).
  const momenten = v.lagen.length
    ? (proef ? v.lagen.map(l => Math.min(v.duur - 0.3, l.in + 1.6)) : [Math.min(v.duur - 0.3, v.lagen[v.lagen.length - 1].in + 1.6)])
    : (proef ? [0.25, 0.6, 0.92].map(f => v.duur * f) : [v.duur * 0.6]);
  momenten.forEach((t, i) => {
    const jpg = uit.replace(/\.mp4$/, (proef ? `-${i + 1}` : '') + '.jpg');
    execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(t), '-i', uit, '-frames:v', '1', '-q:v', '3', jpg]);
  });
  const mb = Math.round(fs.statSync(uit).size / 1024 / 1024 * 10) / 10;
  console.log(`${v.code}  ${v.titel.padEnd(18)} ${v.duur} s  ${mb} MB  -> ${uit}`);
}

if (require.main === module) {
  (async () => {
    const argv = process.argv.slice(2), proef = argv.includes('--proef');
    const alleen = argv.find(a => !a.startsWith('--'));
    for (const v of require('../teksten/highlights-nl.cjs')) {
      if (alleen && v.code !== alleen) continue;
      await bouw(v, proef);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
