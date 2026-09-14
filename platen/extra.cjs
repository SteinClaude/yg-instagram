// Profielfoto, omslagen voor highlights en sjablonen voor verhalen.
// node instagram/extra.cjs      -> instagram/uit/profiel-*.png, omslag-*.png, verhaal-*.png
const fs = require('fs'), path = require('path');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const M = require('./maak.cjs');
const UIT = path.join(__dirname, 'uit'); fs.mkdirSync(UIT, { recursive: true });

const GOUD = '#C9A45C', GOUDLICHT = '#E3C889', DONKER = '#141414', IVOOR = '#F6F1E8', INK = '#1C1B18';

function png(svg, W, H, naam) {
  const buf = new Resvg(svg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: W } }).render().asPng();
  fs.writeFileSync(path.join(UIT, naam), buf);
  console.log(naam.padEnd(30), W + 'x' + H);
}
const doek = (W, H, grond, inhoud, gloed) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><radialGradient id="g" cx="50%" cy="42%" r="66%">
<stop offset="0%" stop-color="${GOUD}" stop-opacity="${gloed}"/><stop offset="100%" stop-color="${GOUD}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="${grond}"/><rect width="${W}" height="${H}" fill="url(#g)"/>${inhoud}</svg>`;

// klein hulpje: gecentreerde tekst
function midden(font, tekst, y, grootte, spatie, vul, W) {
  const w = M.breedte(font, tekst, grootte, spatie);
  return M.pad(font, tekst, W / 2 - w / 2, y, grootte, spatie, vul).svg;
}

// ---------------------------------------------------------- 1. profielfoto
// Instagram snijdt er een rondje uit, dus alles blijft ruim binnen het midden.
{
  // Geen rand: Instagram snijdt er een rondje uit en die zou er dwars doorheen lopen.
  const W = 1080, sch = 5.1, x = W / 2 - 50 * sch, y = W / 2 - 55 * sch;
  const inhoud = M.poort(GOUDLICHT, x, y, sch);
  png(doek(W, W, DONKER, inhoud, 0.16), W, W, 'profiel-embleem-donker.png');

  const inhoudIvoor = M.poort('#8C6F3A', x, y, sch);
  png(doek(W, W, IVOOR, inhoudIvoor, 0.06), W, W, 'profiel-embleem-ivoor.png');
}

// ------------------------------------------------- 2. omslagen voor highlights
// Story-formaat; Instagram snijdt een rondje uit het midden.
const TEKENS = {
  werk: (cx, cy, s) => {            // een browservenster
    const w = 150 * s, h = 112 * s;
    return `<g stroke="${GOUDLICHT}" fill="none" stroke-width="${3.4 * s}" stroke-linecap="round">
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${6 * s}"/>
      <path d="M${cx - w / 2} ${cy - h / 2 + 30 * s}h${w}"/>
      <circle cx="${cx - w / 2 + 17 * s}" cy="${cy - h / 2 + 15 * s}" r="${4 * s}" fill="${GOUDLICHT}" stroke="none"/>
      <circle cx="${cx - w / 2 + 33 * s}" cy="${cy - h / 2 + 15 * s}" r="${4 * s}" fill="${GOUDLICHT}" stroke="none"/>
      <path d="M${cx - w / 2 + 22 * s} ${cy + 6 * s}h${62 * s}M${cx - w / 2 + 22 * s} ${cy + 30 * s}h${40 * s}"/></g>`;
  },
  prijzen: (cx, cy, s) => {          // het euroteken in de kopletter
    const g = 150 * s, w = M.breedte(M.L.serif, '€', g, 0);
    return M.pad(M.L.serif, '€', cx - w / 2, cy + g * 0.36, g, 0, GOUDLICHT).svg;
  },
  werkwijze: (cx, cy, s) => {        // drie stappen aan een lijn
    const gat = 62 * s, r = 17 * s, d = 3.4 * s;
    let p = `<path d="M${cx - gat} ${cy}h${gat * 2}" stroke="${GOUDLICHT}" stroke-width="${d}" opacity="0.55"/>`;
    for (let i = -1; i <= 1; i++) {
      p += `<circle cx="${cx + i * gat}" cy="${cy}" r="${r}" fill="${i === 1 ? GOUDLICHT : 'none'}" stroke="${GOUDLICHT}" stroke-width="${d}"/>`;
    }
    return p;
  },
  contact: (cx, cy, s) => {          // een envelop
    const w = 150 * s, h = 104 * s;
    return `<g stroke="${GOUDLICHT}" fill="none" stroke-width="${3.4 * s}" stroke-linejoin="round">
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${5 * s}"/>
      <path d="M${cx - w / 2} ${cy - h / 2}L${cx} ${cy + 8 * s}L${cx + w / 2} ${cy - h / 2}"/></g>`;
  },
};

for (const sleutel of ['werk', 'prijzen', 'werkwijze', 'contact']) {
  const W = 1080, H = 1920, cx = W / 2, cy = H / 2;
  png(doek(W, H, DONKER, TEKENS[sleutel](cx, cy, 2.6), 0.15), W, H, 'omslag-' + sleutel + '.png');
}

// ------------------------------------------------ 3. sjablonen voor verhalen
// Lege achtergronden in de huisstijl: zet er in de app zelf tekst of een foto op.
for (const [naam, grond, lijn, merk, gloed] of [
  ['verhaal-donker', DONKER, 'rgba(201,164,92,0.34)', GOUD, 0.15],
  ['verhaal-ivoor', IVOOR, 'rgba(140,111,58,0.30)', '#7B6132', 0.06],
]) {
  const W = 1080, H = 1920, kader = 46;
  const gv = 21, spv = 0.2 * gv;
  const inhoud = `<rect x="${kader}" y="${kader}" width="${W - 2 * kader}" height="${H - 2 * kader}" fill="none" stroke="${lijn}" stroke-width="1.6"/>`
    + M.poort(merk, W / 2 - 18, 150, 0.36)
    + midden(M.L.sansMed, 'YG-DIGITAL.NL', H - 140, gv, spv, merk, W);
  png(doek(W, H, grond, inhoud, gloed), W, H, naam + '.png');
}

// sjabloon met een venster voor een foto of schermafdruk
{
  const W = 1080, H = 1920, kader = 46, vx = 110, vw = W - 2 * vx, vy = 560, vh = 800;
  const gv = 21, spv = 0.2 * gv;
  const inhoud = `<rect x="${kader}" y="${kader}" width="${W - 2 * kader}" height="${H - 2 * kader}" fill="none" stroke="rgba(201,164,92,0.34)" stroke-width="1.6"/>`
    + M.poort(GOUD, W / 2 - 18, 150, 0.36)
    + `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="#1B1B1B" stroke="${GOUD}" stroke-width="1.8" opacity="0.95"/>`
    + midden(M.L.sansMed, 'ZET HIER UW FOTO OF SCHERM', vy + vh / 2, 22, 0.2 * 22, 'rgba(201,164,92,0.55)', W)
    + midden(M.L.sansMed, 'YG-DIGITAL.NL', H - 140, gv, spv, GOUD, W);
  png(doek(W, H, DONKER, inhoud, 0.15), W, H, 'verhaal-venster.png');
}
