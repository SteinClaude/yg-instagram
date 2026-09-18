// Bouwt de reels: 18 seconden, 1080x1920, 30 beelden per seconde. Een langzame
// zoom over het beeld, tekst die zacht opkomt in de huisstijl (dezelfde letters
// en kleuren als de platen), embleem boven en de voetregel onder. Alles lokaal
// met ffmpeg; muziek voegt Gijs in de Instagram-app toe. Er zit wel een stil
// audiospoor in, anders weigert Instagram het bestand soms.
//
//   node gereedschap/reel.cjs          alle reels uit teksten/reels-nl.cjs
//   node gereedschap/reel.cjs R03      alleen die
//
// Resultaat: beeld/reels/R01.mp4, een stilstaand beeld beeld/reels/R01.jpg
// (voor het dashboard) en mini/reels-R01.jpg.
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const M = require('../platen/maak.cjs');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const W = 1080, H = 1920, FPS = 30, DUUR = 18;
const k = M.K.donker, L = M.L, r3 = M.r3;
const WORTEL = path.join(__dirname, '..');
const BRON = path.join(WORTEL, 'platen', 'bron', 'ai');
const UIT = path.join(WORTEL, 'beeld', 'reels');
const MINI = path.join(WORTEL, 'mini');
const WERK = path.join(WORTEL, 'platen', 'uit', 'reels');   // tussenbestanden, niet in git

const laag = inhoud => new Resvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inhoud}</svg>`,
  { font: { loadSystemFonts: false }, fitTo: { mode: 'width', value: W } }).render().asPng();

// Het beeld op dubbele maat (voor een vloeiende zoom) met hetzelfde verloop als de platen.
async function achtergrond(beeld, doel) {
  const verloop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="3840">
<defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#141414" stop-opacity="0.34"/>
<stop offset="40%" stop-color="#141414" stop-opacity="0.14"/>
<stop offset="62%" stop-color="#141414" stop-opacity="0.58"/>
<stop offset="100%" stop-color="#141414" stop-opacity="0.94"/></linearGradient></defs>
<rect width="2160" height="3840" fill="url(#v)"/></svg>`);
  await sharp(path.join(BRON, beeld + '.jpg'))
    .resize(2160, 3840, { fit: 'cover', kernel: 'lanczos3' })
    .modulate({ brightness: 0.9, saturation: 0.9 })
    .composite([{ input: verloop }])
    .jpeg({ quality: 94 }).toFile(doel);
}

// De vaste laag: kader, embleem, voetregel. Instagram legt bij reels bovenin
// (± 220 px) en onderin (± 420 px) zijn eigen naam, bijschrift en knoppen over
// het beeld; embleem en voetregel staan daarom binnen de veilige zone.
const VEILIG_BOVEN = 236, VEILIG_ONDER = 1500;
function chroom() {
  const kader = 46;
  const voet = 'YG-DIGITAL.NL', gv = 19, spv = 0.2 * gv, wv = M.breedte(L.sansMed, voet, gv, spv);
  return laag(
    `<rect x="${kader}" y="${kader}" width="${W - 2 * kader}" height="${H - 2 * kader}" fill="none" stroke="${k.lijn}" stroke-width="1.4"/>` +
    M.poort(k.goud, W / 2 - 15, VEILIG_BOVEN, 0.30) +
    M.pad(L.sansMed, voet, W / 2 - wv / 2, VEILIG_ONDER - 16, gv, spv, k.goud).svg);
}

// Lijntje, bovenregel en kop; de onderkant van de groep op een vaste hoogte, zodat
// de tweede boodschap precies op de plek van de eerste komt.
const MAX = W - 200, MX = W / 2;
function groep(boven, kop, onderkant) {
  const gb = 23, spb = 0.24 * gb, rsB = boven ? M.breek(L.sansMed, boven.toUpperCase(), gb, spb, MAX) : [];
  let gk = 96, rsK = M.breek(L.serif, kop, gk, 0, MAX);
  while (rsK.length > 3 && gk > 40) { gk -= 3; rsK = M.breek(L.serif, kop, gk, 0, MAX); }
  const hB = rsB.length ? gb * 0.72 + gb * (rsB.length - 1) * 1.5 + 34 : 0;
  const hK = gk * 0.72 + gk * (rsK.length - 1) * 1.17;
  let y = onderkant - (1 + 30 + hB + hK), s = '';
  s += `<rect x="${MX - 34}" y="${r3(y)}" width="68" height="1" fill="${k.goud}"/>`; y += 31;
  if (rsB.length) { s += M.regels(L.sansMed, rsB, gb, spb, 1.5, k.goud, MX, y + gb * 0.72, 'midden'); y += hB; }
  s += M.regels(L.serif, rsK, gk, 0, 1.17, k.kop, MX, y + gk * 0.72, 'midden');
  return laag(s);
}
function regel(tekst, bovenkant) {
  const g = 34, rs = M.breek(L.sans, tekst, g, 0, MAX);
  return laag(M.regels(L.sans, rs, g, 0, 1.6, k.tekst, MX, bovenkant + g * 0.72, 'midden'));
}

async function bouw(r) {
  const werk = path.join(WERK, r.code); fs.mkdirSync(werk, { recursive: true });
  fs.mkdirSync(UIT, { recursive: true }); fs.mkdirSync(MINI, { recursive: true });
  const bg = path.join(werk, 'achtergrond.jpg');
  await achtergrond(r.beeld, bg);
  const lagen = {};
  const zet = (naam, png) => { lagen[naam] = path.join(werk, naam + '.png'); fs.writeFileSync(lagen[naam], png); };
  zet('chroom', chroom());
  // kop eindigt op 1330, de regel eronder loopt tot uiterlijk ± 1450: boven de voetregel en de balk van Instagram
  zet('kop1', groep(r.boven1, r.kop1, 1330)); zet('sub1', regel(r.sub1, 1366));
  zet('kop2', groep(r.boven2, r.kop2, 1330)); zet('sub2', regel(r.sub2, 1366));

  // tijdlijn in seconden
  const T = { chroom: 0.5, kop1: 1.6, sub1: 4.4, uit1: 10.2, kop2: 11.0, sub2: 13.2, einde: 17.3 };
  const rijs = (st, d = 0.9) => `'30*(1-min(1,max(0,(t-${st})/${d})))'`;   // zachte opkomst van 30 px
  const frames = DUUR * FPS;
  const filter = [
    `[0:v]zoompan=z='1+0.10*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},format=rgba[bg]`,
    `[1:v]format=rgba,fade=t=in:st=${T.chroom}:d=0.8:alpha=1[c]`,
    `[2:v]format=rgba,fade=t=in:st=${T.kop1}:d=0.9:alpha=1,fade=t=out:st=${T.uit1}:d=0.6:alpha=1[k1]`,
    `[3:v]format=rgba,fade=t=in:st=${T.sub1}:d=0.9:alpha=1,fade=t=out:st=${T.uit1}:d=0.6:alpha=1[s1]`,
    `[4:v]format=rgba,fade=t=in:st=${T.kop2}:d=0.9:alpha=1[k2]`,
    `[5:v]format=rgba,fade=t=in:st=${T.sub2}:d=0.9:alpha=1[s2]`,
    `[bg][c]overlay=0:0[v1]`,
    `[v1][k1]overlay=0:${rijs(T.kop1)}[v2]`,
    `[v2][s1]overlay=0:${rijs(T.sub1)}[v3]`,
    `[v3][k2]overlay=0:${rijs(T.kop2)}[v4]`,
    // Expliciet naar beperkt bereik en BT.709, anders vlagt x264 de video als
    // full-range 601 (uit de PNG/JPEG-lagen) en loopt het zwart dicht bij spelers
    // die 1080p als 709 aannemen. Instagram hercodeert alles, dus dat telt.
    `[v4][s2]overlay=0:${rijs(T.sub2)},fade=t=out:st=${T.einde}:d=0.7,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p[v]`,
  ].join(';');

  const mp4 = path.join(UIT, r.code + '.mp4');
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-i', bg];
  for (const naam of ['chroom', 'kop1', 'sub1', 'kop2', 'sub2']) args.push('-loop', '1', '-framerate', String(FPS), '-t', String(DUUR), '-i', lagen[naam]);
  args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-filter_complex', filter, '-map', '[v]', '-map', '6:a', '-t', String(DUUR), '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart', '-use_editlist', '0',          // Meta wil geen edit lists
    mp4);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });

  // Stilstaand beeld op 9 seconden: dan staan kop én onderregel van de eerste
  // boodschap in beeld. Zelfde moment als de omslag die Instagram kiest
  // (thumb_offset in src/instagram.cjs), zodat dashboard en profiel gelijk zijn.
  const poster = path.join(UIT, r.code + '.jpg');
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '9', '-i', mp4, '-frames:v', '1', '-q:v', '3', poster]);
  await sharp(poster).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, `reels-${r.code}.jpg`));
  const mb = Math.round(fs.statSync(mp4).size / 1024 / 1024 * 10) / 10;
  console.log(`${r.code}  ${r.beeld.padEnd(10)} ${mb} MB ✓`);
}

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    for (const r of require('../teksten/reels-nl.cjs')) {
      if (alleen && r.code !== alleen) continue;
      await bouw(r);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
