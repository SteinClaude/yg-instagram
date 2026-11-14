// Keuzebladen voor de vaste figuur (kanaal 1, vanaf YS40).
//   node gereedschap/figuur-blad.cjs  → docs/figuur/ontwerp-A.jpg, -B.jpg, -C.jpg en docs/figuur/ontwerpen-in-beeld.jpg
// Per ontwerp: drie houdingen (rust, wijst, verbaasd), kleuren en één regel uitleg (1080 × 1350).
// In beeld: elk ontwerp in een voorbeeldframe van een short (1080 × 1920), naast elkaar.
const fs = require('fs'), path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const F = require('./figuur.cjs');
const K = F.K;

const W = path.join(__dirname, '..');
const UIT = path.join(W, 'docs', 'figuur');
fs.mkdirSync(UIT, { recursive: true });
const fontDir = path.join(__dirname, 'short', 'fonts');
const fontFiles = fs.readdirSync(fontDir).filter(f => f.endsWith('.ttf')).map(f => path.join(fontDir, f));
const render = (svg, w) => new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: w } }).render().asPng();

const papier = (w, h) => `<rect width="${w}" height="${h}" fill="${K.papier}"/>` +
  Array.from({ length: Math.floor(h / 64) }, (_, i) => `<path d="M 0 ${i * 64 + 40} L ${w} ${i * 64 + 40}" stroke="#E2DACB" stroke-width="2"/>`).join('');
const schaduw = (x, y, b) => `<ellipse cx="${x}" cy="${y}" rx="${b}" ry="${b * 0.16}" fill="${K.inkt}" opacity="0.12"/>`;

async function blad(code) {
  const O = F.ONTWERPEN[code], w = 1080, h = 1350;
  const poses = [['rust', 'rust'], ['wijst', 'legt uit'], ['verbaasd', 'ontdekt iets']];
  let s = papier(w, h);
  s += `<text x="72" y="118" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${K.signaal}">ONTWERP ${code}</text>`;
  s += `<text x="72" y="196" font-family="Instrument Sans" font-weight="700" font-size="76" fill="${K.inkt}">${O.naam}</text>`;
  // groot: legt uit; rechts klein: rust en ontdekt iets
  const plek = { wijst: [380, 960, 1.08], rust: [870, 540, 0.5], verbaasd: [870, 990, 0.5] };
  poses.forEach(([p, label]) => {
    const [x, y, sc] = plek[p];
    s += schaduw(x, y, 150 * sc) + F.teken(code, { x, y, s: sc, pose: p, mond: p === 'wijst' ? 'open' : 'glim' });
    s += `<text x="${x}" y="${y + 50}" text-anchor="middle" font-family="IBM Plex Mono" font-size="28" fill="${K.grijs}">${label}</text>`;
  });
  // knipperen en praten
  s += `<text x="72" y="1086" font-family="IBM Plex Mono" font-size="26" fill="${K.grijs}">KLEUREN</text>`;
  O.kleuren.forEach((c, i) => s += `<circle cx="${100 + i * 74}" cy="1140" r="28" fill="${c}" stroke="${K.inkt}" stroke-width="5"/>`);
  const regels = [], woorden = O.regel.split(' '); let r = '';
  for (const wd of woorden) { if ((r + ' ' + wd).trim().length > 34) { regels.push(r.trim()); r = wd; } else r += ' ' + wd; }
  regels.push(r.trim());
  regels.forEach((t, i) => s += `<text x="410" y="${1122 + i * 44}" font-family="Instrument Sans" font-size="34" fill="${K.inkt}">${t}</text>`);
  s += `<text x="72" y="1290" font-family="IBM Plex Mono" font-size="24" fill="${K.grijs}">eigen ontwerp · vector · knippert, praat en wijst in de short</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`;
  await sharp(render(svg, w)).jpeg({ quality: 90 }).toFile(path.join(UIT, `ontwerp-${code}.jpg`));
}

// Voorbeeldframe van een short met de figuur (zelfde huisstijl als YS: papier, inkt, signaalrood).
function frame(code) {
  const w = 1080, h = 1920;
  let s = papier(w, h);
  s += `<rect x="90" y="212" width="900" height="8" rx="4" fill="#DDD5C6"/><rect x="90" y="212" width="310" height="8" rx="4" fill="${K.signaal}"/>`;
  s += `<text x="540" y="400" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="96" fill="${K.inkt}">Why are keyboards</text>`;
  s += `<text x="540" y="510" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="112" fill="${K.signaal}">QWERTY?</text>`;
  // voorwerp: een rij toetsen
  'QWERTY'.split('').forEach((l, i) => {
    const x = 150 + i * 132, y = 700;
    s += `<rect x="${x}" y="${y + 10}" width="116" height="116" rx="18" fill="#CFC6B6"/><rect x="${x}" y="${y}" width="116" height="110" rx="18" fill="${K.wit}" stroke="${K.inkt}" stroke-width="7"/>`;
    s += `<text x="${x + 58}" y="${y + 76}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="${K.inkt}">${l}</text>`;
  });
  s += `<ellipse cx="540" cy="760" rx="440" ry="120" fill="none" stroke="${K.signaal}" stroke-width="13" stroke-linecap="round" transform="rotate(-3 540 760)"/>`;
  s += schaduw(560, 1640, 170) + F.teken(code, { x: 560, y: 1640, s: 1.3, pose: 'wijst', mond: 'open' });
  s += `<rect x="90" y="1290" width="330" height="58" rx="6" fill="${K.wit}" stroke="${K.inkt}" stroke-width="4" opacity="0"/>`;
  s += `<text x="540" y="1830" text-anchor="middle" font-family="IBM Plex Mono" font-size="30" fill="${K.grijs}">voorbeeldframe · ontwerp ${code}</text>`;
  return render(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w);
}

(async () => {
  for (const c of ['A', 'B', 'C']) await blad(c);
  const delen = ['A', 'B', 'C'].map(frame);
  const breed = 720, hoog = 1280, marge = 40;
  const lijst = await Promise.all(delen.map(b => sharp(b).resize(breed, hoog).png().toBuffer()));
  await sharp({ create: { width: breed * 3 + marge * 4, height: hoog + marge * 2, channels: 3, background: '#2A2A2E' } })
    .composite(lijst.map((b, i) => ({ input: b, left: marge + i * (breed + marge), top: marge })))
    .jpeg({ quality: 88 }).toFile(path.join(UIT, 'ontwerpen-in-beeld.jpg'));
  await sharp({ create: { width: 1080 * 3 + 80, height: 1350 + 40, channels: 3, background: '#2A2A2E' } })
    .composite(['A', 'B', 'C'].map((c, i) => ({ input: path.join(UIT, `ontwerp-${c}.jpg`), left: 20 + i * 1100, top: 20 })))
    .png().toBuffer().then(b => sharp(b).resize(2400).jpeg({ quality: 88 }).toFile(path.join(UIT, 'ontwerpen-overzicht.jpg')));
  console.log('ok', fs.readdirSync(UIT));
})();
