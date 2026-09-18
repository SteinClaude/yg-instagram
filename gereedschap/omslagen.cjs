// De omslagen voor de highlights op het profiel. Instagram toont ze als een
// rondje van ongeveer 64 pixels; daar past één voorwerp in, groot en scherp.
// De verhaalplaten zelf zijn daar ongeschikt voor: die zijn staand en hebben
// tekst onderin. Daarom snijden we strak uit de bronfoto's (zonder tekst).
//
//   node gereedschap/omslagen.cjs
//
// Resultaat: beeld/omslagen/<naam>.jpg (1080x1080) en omslagen.html, een pagina
// die Gijs op zijn telefoon opent om ze met een lange druk te bewaren.
const fs = require('fs'), path = require('path');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const M = require('../platen/maak.cjs');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');

const WORTEL = path.join(__dirname, '..');
const BRON = path.join(WORTEL, 'platen', 'bron', 'ai');
const UIT = path.join(WORTEL, 'beeld', 'omslagen');
const MAAT = 1080;

// naam = de naam van de highlight zoals hij op het profiel staat, zodat de
// bestandsnaam meteen zegt waar hij hoort; beeld = bronfoto; x/y = middelpunt
// van de uitsnede als fractie, maat = breedte als fractie van de foto.
const OMSLAGEN = [
  { naam: 'Entree',      beeld: 'deur',      x: 0.52, y: 0.42, maat: 0.72 },
  { naam: 'Ons vak',     beeld: 'bureau',    x: 0.44, y: 0.50, maat: 0.62 },
  { naam: 'Op papier',   beeld: 'schets',    x: 0.54, y: 0.42, maat: 0.66 },
  { naam: 'Telefoon',    beeld: 'telefoon',  x: 0.55, y: 0.45, maat: 0.62 },
  { naam: 'Apps',        beeld: 'apps',      x: 0.50, y: 0.50, maat: 0.92 },
  // Vijf omslagen kregen een eigen foto: de uitsnedes uit de verhaalbeelden
  // waren te vaag of te veel op elkaar (twee keer een toetsenbord, twee keer
  // een envelop). Nu één duidelijk voorwerp per rondje.
  { naam: 'Techniek',    beeld: 'techniek2',    x: 0.50, y: 0.50, maat: 0.92 },
  { naam: 'Huisstijl',   beeld: 'huisstijl',    x: 0.46, y: 0.50, maat: 0.70 },
  { naam: 'Contact',     beeld: 'contact',      x: 0.50, y: 0.50, maat: 0.80 },
  { naam: 'Onderhoud',   beeld: 'onderhoud2',   x: 0.48, y: 0.52, maat: 0.72 },
  { naam: 'Altijd open', beeld: 'altijd-open2', x: 0.50, y: 0.50, maat: 0.92 },
  { naam: 'Teksten',     beeld: 'teksten2',     x: 0.50, y: 0.50, maat: 0.92 },
  { naam: 'Afspraken',   beeld: 'afspraken2',   x: 0.60, y: 0.62, maat: 0.52 },
];

// De prijs is geen foto maar een bedrag; dat leest in een rondje beter dan welk
// beeld ook, en het is de vraag die iedere klant als eerste stelt.
function prijsplaat() {
  const k = M.K.ivoor, g = 330, w = M.breedte(M.L.serif, '€ 550', g, 0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MAAT}" height="${MAAT}">
<rect width="${MAAT}" height="${MAAT}" fill="${k.grond}"/>
<rect x="${MAAT / 2 - 60}" y="${MAAT / 2 - 170}" width="120" height="2" fill="${k.goud}"/>
${M.pad(M.L.serif, '€ 550', MAAT / 2 - w / 2, MAAT / 2 + g * 0.36, g, 0, k.goudLicht).svg}</svg>`;
  return new Resvg(svg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: MAAT } }).render().asPng();
}

const bestandsnaam = naam => naam.toLowerCase().replace(/ /g, '-') + '.jpg';

(async () => {
  fs.mkdirSync(UIT, { recursive: true });
  const gemaakt = [];

  for (const o of OMSLAGEN) {
    const bron = path.join(BRON, o.beeld + '.jpg');
    const m = await sharp(bron).metadata();
    const zij = Math.round(Math.min(m.width, m.height) * o.maat);
    const left = Math.max(0, Math.min(m.width - zij, Math.round(m.width * o.x - zij / 2)));
    const top = Math.max(0, Math.min(m.height - zij, Math.round(m.height * o.y - zij / 2)));
    const doel = path.join(UIT, bestandsnaam(o.naam));
    await sharp(bron).extract({ left, top, width: zij, height: zij })
      .resize(MAAT, MAAT, { kernel: 'lanczos3' })
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.2 })      // klein formaat vraagt om extra scherpte
      .modulate({ brightness: o.licht ?? 1.06 })       // een rondje van 64 px mag niet te donker zijn
      .jpeg({ quality: 92, mozjpeg: true }).toFile(doel);
    gemaakt.push(o.naam);
  }

  await sharp(prijsplaat()).jpeg({ quality: 94 }).toFile(path.join(UIT, bestandsnaam('Prijzen')));
  gemaakt.push('Prijzen');

  // De pagina om ze op te slaan: grote rondjes, precies zoals ze op het profiel
  // komen te staan, met de bestandsnaam eronder.
  // Zelfde volgorde als op het profiel, zodat de pagina en Instagram naast elkaar lezen.
  const volgorde = [...OMSLAGEN.map(o => o.naam), 'Prijzen'];
  const kaartjes = volgorde.map(naam => `    <figure><img src="beeld/omslagen/${bestandsnaam(naam)}" alt="${naam}"><figcaption>${naam}</figcaption></figure>`).join('\n');
  fs.writeFileSync(path.join(WORTEL, 'omslagen.html'), `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Omslagen voor de highlights · YG Digital</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=Montserrat:wght@400;500&display=swap">
<style>
  :root{--grond:#F6F1E8;--ink:#1C1B18;--zacht:#6B665E;--goud:#7B6132;--lijn:rgba(140,111,58,.26)}
  @media (prefers-color-scheme:dark){:root{--grond:#141414;--ink:#F3EEE4;--zacht:#C9C3B8;--goud:#C9A45C;--lijn:rgba(201,164,92,.3)}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--grond);color:var(--ink);font-family:Montserrat,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.55}
  .blad{max-width:560px;margin:0 auto;padding:28px 20px 60px}
  h1{font-family:"Playfair Display",Georgia,serif;font-weight:400;font-size:1.7rem;margin:0 0 6px}
  p{color:var(--zacht);margin:0 0 6px;font-size:.9rem}
  ol{color:var(--zacht);font-size:.9rem;padding-left:18px;margin:0 0 4px}
  li{margin:4px 0}
  .rooster{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:26px}
  figure{margin:0;text-align:center}
  img{width:100%;aspect-ratio:1;border-radius:50%;border:1px solid var(--lijn);display:block}
  figcaption{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--goud);margin-top:8px}
</style>
</head>
<body>
<div class="blad">
  <h1>Omslagen voor de highlights</h1>
  <p>Zo staan ze straks op het profiel. Bewaren en instellen:</p>
  <ol>
    <li>Houd je vinger op een rondje → <em>Afbeelding bewaren</em>.</li>
    <li>Instagram → je profiel → highlight openen → drie puntjes → <em>Highlight bewerken</em>.</li>
    <li><em>Omslag bewerken</em> → <em>Uit galerij</em> → de bewaarde foto kiezen.</li>
  </ol>
  <p>De namen staan in dezelfde volgorde als op je profiel; de bestandsnaam is de naam van de
  highlight. <em>Prijzen</em> is voor later, als het verhaal met het bedrag op 10 oktober is geplaatst.</p>
  <div class="rooster">
${kaartjes}
  </div>
</div>
</body>
</html>
`);

  console.log(gemaakt.length + ' omslagen in beeld/omslagen/ en omslagen.html');
})().catch(e => { console.error(e); process.exit(1); });
