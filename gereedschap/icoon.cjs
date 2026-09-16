// Maakt de app-iconen voor het dashboard: het poortembleem, goud op antraciet,
// in de maten die telefoons vragen om de pagina als app op het beginscherm te
// zetten. Zelfde tekenmachine als de platen, dus het klopt met de rest.
//
//   node gereedschap/icoon.cjs
const fs = require('fs'), path = require('path');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const M = require(path.join(__dirname, '..', 'platen', 'maak.cjs'));

const GOUD = '#C9A45C', GOUDLICHT = '#E3C889', DONKER = '#141414';
const UIT = path.join(__dirname, '..', 'app');
fs.mkdirSync(UIT, { recursive: true });

// Dezelfde plaatsing als de profielfoto in platen/extra.cjs, geschaald naar de maat.
function icoon(W, naam, rand) {
  const sch = 5.1 * (W / 1080) * (rand ? 0.78 : 1);           // 'maskable' vraagt lucht eromheen
  const x = W / 2 - 50 * sch, y = W / 2 - 55 * sch;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<defs><radialGradient id="g" cx="50%" cy="42%" r="66%">
<stop offset="0%" stop-color="${GOUD}" stop-opacity="0.16"/><stop offset="100%" stop-color="${GOUD}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${W}" fill="${DONKER}"/><rect width="${W}" height="${W}" fill="url(#g)"/>${M.poort(GOUDLICHT, x, y, sch)}</svg>`;
  const buf = new Resvg(svg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: W } }).render().asPng();
  fs.writeFileSync(path.join(UIT, naam), buf);
  console.log(naam.padEnd(22), W + 'x' + W, Math.round(buf.length / 1024) + ' kB');
}

icoon(512, 'icoon-512.png', false);
icoon(192, 'icoon-192.png', false);
icoon(180, 'apple-touch-icon.png', false);
icoon(512, 'icoon-maskable-512.png', true);
