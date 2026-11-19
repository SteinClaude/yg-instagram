// Waaromdorp: keuzebladen voor de nieuwe wereld van kanaal 1 (Andries do 19 nov 2026 ±20:16: "waaromdorp met museum
// en tijdreizen"). Maakt in docs/waaromdorp/:
//   plekken.jpg  de drie nieuwe decors (plein, museum, tijdmachine) met het duo en een bewoner, zoals in een short
//   kaart.jpg    de kaart van het dorp met alle plekken (nieuwe en bestaande decors)
//   node gereedschap/waaromdorp-blad.cjs
const fs = require('fs'), path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const F = require('./figuur.cjs');
const D = require('./short/decor.cjs');

const W = path.join(__dirname, '..'), UIT = path.join(W, 'docs', 'waaromdorp');
fs.mkdirSync(UIT, { recursive: true });
const fontDir = path.join(__dirname, 'short', 'fonts');
const fontFiles = fs.readdirSync(fontDir).filter(f => f.endsWith('.ttf')).map(f => path.join(fontDir, f));
const render = (svg, w) => new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: w } }).render().asPng();
const I = '#16161A';
const binnen = naam => { const s = D.svg(naam); return s.slice(s.indexOf('>') + 1, s.lastIndexOf('</svg>')); };
const schaduw = (x, y, b) => `<ellipse cx="${x}" cy="${y}" rx="${b}" ry="${b * 0.16}" fill="${I}" opacity="0.16"/>`;

// Eén frame: decor + duo + bewoner + een kaartje met de naam van de plek
function frame(decor, gast, titel, regel) {
  let s = binnen(decor);
  const vloer = 1600;
  s += schaduw(250, vloer, 110) + F.teken('A', { x: 250, y: vloer, s: 0.62, pose: 'verbaasd' });
  s += schaduw(540, vloer + 30, 120) + F.teken(gast, { x: 540, y: vloer + 30, s: 0.66, pose: 'wijst', mond: 'open' });
  s += schaduw(840, vloer, 110) + F.teken('D', { x: 840, y: vloer, s: 0.62, pose: 'rust', spiegel: true });
  s += `<rect x="70" y="150" width="940" height="170" rx="22" fill="#FFFDF7" stroke="${I}" stroke-width="7"/>`;
  s += `<text x="540" y="228" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="68" fill="${I}">${titel}</text>`;
  s += `<text x="540" y="286" text-anchor="middle" font-family="IBM Plex Mono" font-size="30" fill="#6E6A62">${regel}</text>`;
  return render(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${s}</svg>`, 1080);
}

// De kaart van het dorp (1600 × 1200), getekend in dezelfde lijn
function kaart() {
  const w = 1600, h = 1200;
  let s = `<rect width="${w}" height="${h}" fill="#BFE0A6"/>`;
  s += Array.from({ length: 60 }, (_, i) => `<path d="M ${(i * 137) % w} ${(i * 251) % h} q 6 -10 12 0" fill="none" stroke="#9CC985" stroke-width="4" stroke-linecap="round"/>`).join('');
  // rivier en zee
  s += `<path d="M 1600 0 L 1600 1200 L 1250 1200 Q 1300 1000 1240 900 Q 1180 820 1260 700 Q 1330 600 1300 420 Q 1280 260 1380 0 Z" fill="#7FC4E0" stroke="${I}" stroke-width="7"/>`;
  // wegen
  const weg = d => `<path d="${d}" fill="none" stroke="${I}" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#F1E3C4" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#D9C8A2" stroke-width="4" stroke-dasharray="18 18"/>`;
  s += weg('M 120 600 L 1240 600') + weg('M 700 120 L 700 1100') + weg('M 700 600 Q 900 300 1160 260') + weg('M 300 600 Q 300 900 520 1000');
  // plekken: [x, y, icoon, naam, nieuw]
  const huisje = (x, y, c, dak) => `<rect x="${x - 50}" y="${y - 40}" width="100" height="80" fill="${c}" stroke="${I}" stroke-width="6"/><path d="M ${x - 62} ${y - 38} L ${x} ${y - 92} L ${x + 62} ${y - 38} Z" fill="${dak}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/><rect x="${x - 14}" y="${y}" width="28" height="40" fill="#6E4627" stroke="${I}" stroke-width="4"/>`;
  const iconen = {
    toren: (x, y) => `<rect x="${x - 40}" y="${y - 120}" width="80" height="160" fill="#C98A5A" stroke="${I}" stroke-width="6"/><path d="M ${x - 50} ${y - 118} L ${x} ${y - 176} L ${x + 50} ${y - 118} Z" fill="#D9432B" stroke="${I}" stroke-width="6" stroke-linejoin="round"/><circle cx="${x}" cy="${y - 76}" r="26" fill="#FFFDF7" stroke="${I}" stroke-width="5"/><path d="M ${x} ${y - 76} L ${x} ${y - 94} M ${x} ${y - 76} L ${x + 12} ${y - 70}" stroke="${I}" stroke-width="5" stroke-linecap="round"/>`,
    museum: (x, y) => `<path d="M ${x - 90} ${y - 60} L ${x} ${y - 110} L ${x + 90} ${y - 60} Z" fill="#F4EFE4" stroke="${I}" stroke-width="6" stroke-linejoin="round"/><rect x="${x - 84}" y="${y - 60}" width="168" height="100" fill="#F4EFE4" stroke="${I}" stroke-width="6"/>` + [-56, -20, 20, 56].map(d => `<rect x="${x + d - 8}" y="${y - 54}" width="16" height="88" fill="#D6CCB8" stroke="${I}" stroke-width="3"/>`).join(''),
    huis: (x, y) => huisje(x, y, '#E3B35C', '#A9311E'),
    school: (x, y) => huisje(x, y, '#9DB894', '#2F5E86') + `<rect x="${x - 10}" y="${y - 130}" width="20" height="40" fill="#F2C230" stroke="${I}" stroke-width="4"/>`,
    haven: (x, y) => `<path d="M ${x - 70} ${y} L ${x + 70} ${y} L ${x + 50} ${y + 30} L ${x - 50} ${y + 30} Z" fill="#8A5A34" stroke="${I}" stroke-width="6"/><path d="M ${x} ${y} L ${x} ${y - 110}" stroke="${I}" stroke-width="6"/><path d="M ${x + 4} ${y - 104} L ${x + 60} ${y - 8} L ${x + 4} ${y - 8} Z" fill="#FFFFFF" stroke="${I}" stroke-width="5"/>`,
    park: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="90" ry="50" fill="#7DBA5C" stroke="${I}" stroke-width="6"/><path d="M ${x + 20} ${y} L ${x + 20} ${y - 80}" stroke="${I}" stroke-width="5"/><path d="M ${x + 22} ${y - 78} L ${x + 64} ${y - 64} L ${x + 22} ${y - 50} Z" fill="#D9432B" stroke="${I}" stroke-width="4"/>`,
    werkplaats: (x, y) => huisje(x, y, '#B7A6D6', '#6E4627') + `<circle cx="${x + 34}" cy="${y - 60}" r="16" fill="#C9962E" stroke="${I}" stroke-width="4"/>`,
    baan: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="100" ry="54" fill="#D9744A" stroke="${I}" stroke-width="6"/><ellipse cx="${x}" cy="${y}" rx="64" ry="26" fill="#7DBA5C" stroke="${I}" stroke-width="5"/>`,
    poort: (x, y) => `<circle cx="${x}" cy="${y}" r="70" fill="#4A3566" stroke="${I}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="48" fill="none" stroke="#F2C230" stroke-width="8" stroke-dasharray="20 14"/><circle cx="${x}" cy="${y}" r="22" fill="#8FE3C9"/>`,
  };
  const plek = (x, y, icoon, naam, nieuw = false) => iconen[icoon](x, y) +
    `<rect x="${x - naam.length * 13 - 20}" y="${y + 52}" width="${naam.length * 26 + 40}" height="50" rx="12" fill="${nieuw ? '#D9432B' : '#FFFDF7'}" stroke="${I}" stroke-width="5"/>` +
    `<text x="${x}" y="${y + 87}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="${nieuw ? '#FFFDF7' : I}">${naam}</text>`;
  s += plek(700, 560, 'toren', 'DORPSPLEIN', true) + plek(1040, 300, 'museum', 'MUSEUM', true) + plek(430, 250, 'huis', 'HUIS VAN HET DUO');
  s += plek(220, 520, 'school', 'SCHOOL') + plek(1430, 820, 'haven', 'HAVEN') + plek(950, 900, 'park', 'PARK') + plek(480, 980, 'werkplaats', 'WERKPLAATS') + plek(1120, 1100, 'baan', 'BAAN');
  s += plek(220, 940, 'poort', 'TIJDPOORT', true);
  s += `<path d="M 640 560 Q 420 700 280 880" fill="none" stroke="#4A3566" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/>`;
  // titel en legenda
  s += `<rect x="40" y="40" width="560" height="120" rx="20" fill="#FFFDF7" stroke="${I}" stroke-width="7"/><text x="320" y="118" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="58" fill="${I}">Waaromdorp</text>`;
  s += `<rect x="40" y="1080" width="540" height="80" rx="16" fill="#FFFDF7" stroke="${I}" stroke-width="5"/><rect x="62" y="1102" width="36" height="36" rx="8" fill="#D9432B" stroke="${I}" stroke-width="4"/><text x="114" y="1132" font-family="IBM Plex Mono" font-size="26" fill="${I}">nieuw · wit = bestaand decor</text>`;
  s += `<text x="1560" y="50" text-anchor="end" font-family="IBM Plex Mono" font-size="22" fill="#FFFFFF">werknaam · eigen tekening</text>`;
  return render(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w);
}

(async () => {
  const delen = [frame('plein', 'I', 'Het dorpsplein', 'Krantje brengt de vraag van de dag'), frame('museum', 'H', 'Het museum', 'Professor Globe toont het echte voorwerp'), frame('tijdmachine', 'G', 'De tijdmachine', 'Opa Klok zet de wijzers terug')];
  const b = 720, hgt = 1280, m = 40;
  const lijst = await Promise.all(delen.map(x => sharp(x).resize(b, hgt).png().toBuffer()));
  await sharp({ create: { width: b * 3 + m * 4, height: hgt + m * 2, channels: 3, background: '#2A2A2E' } })
    .composite(lijst.map((x, i) => ({ input: x, left: m + i * (b + m), top: m }))).jpeg({ quality: 88 }).toFile(path.join(UIT, 'plekken.jpg'));
  await sharp(kaart()).jpeg({ quality: 90 }).toFile(path.join(UIT, 'kaart.jpg'));
  console.log('ok', fs.readdirSync(UIT));
})();
