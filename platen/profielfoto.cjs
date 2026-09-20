// YG Digital - de profielfoto voor Instagram en Facebook: DE POORT.
//
// Het beeldmerk zelf, groot in beeld, in plaats van klein in een medaillon.
// Daardoor is de YG ongeveer twee keer zo groot als in de vorige versie - dat
// was de reden voor de wissel: de naam moest duidelijker.
//
// CHAMPAGNE is de gekozen uitvoering: donker brons op licht. Die leest de naam
// het scherpst en zet zich het best af tegen de zeven donkere highlight-rondjes
// op Instagram, waar dit profiel in de praktijk bekeken wordt. Op de donkere
// Facebook-omslag springt een lichte profielfoto er juist uit.
//
// Er staat ook een uitvoering GOUD OP ZWART in dit bestand. Die heeft een dag
// live gestaan omdat hij beter aansluit bij de Facebook-omslag, maar Gijs vond
// hem uiteindelijk niks. Hij komt eruit als profiel-entree-zwart.png.
//
// De behandeling komt uit het medaillon (zie medaillon.cjs): relief in de
// lichtrichting, wigstenen in de boog, een verdiepte doorgang met een tweede
// poort erachter, handwerk-afwijking per element, patina en korrel.
//
//   node platen/profielfoto.cjs
const fs = require('fs'), path = require('path');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const M = require('./maak.cjs');

const UIT = path.join(__dirname, 'uit'), WEB = path.join(__dirname, 'web');
fs.mkdirSync(UIT, { recursive: true }); fs.mkdirSync(WEB, { recursive: true });

const W = 1080, C = W / 2, SCH = 7.4;
const x = C - 50 * SCH, y = C - 55 * SCH;
const r2 = v => Math.round(v * 100) / 100;

const A_LICHT = -128 * Math.PI / 180;
const lx = Math.cos(A_LICHT), ly = Math.sin(A_LICHT);

let hz = 7777;
const w = () => ((hz = (hz * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) - 0.5;

// twee paletten; de opbouw is identiek, alleen wat licht en wat donker is wisselt
const P = {
  zwart: {
    grond: '#141414', halo: '#C9A45C', haloDek: 0.16,
    brons: ['#F6E6BC', '#E3C889', '#C9A45C', '#8A6B2E'],
    licht: '#F6E6BC', schaduw: '#0A0A0A', diep: '#2A2109',
    steenLicht: '#F6E6BC', steenDonker: '#0A0A0A', steenDek: 0.20,
    doorgang: [['#C9A45C', 0.07], ['#E3C889', 0.13], ['#F6E6BC', 0.22]],
    ver: ['#FFF6DF', 0.60, '#E3C889', 0.30, '#C9A45C', 0.10],
    band: [['#F6E6BC', 0.26], ['#C9A45C', 0.13], ['#0A0A0A', 0.30]],
    relief: [[-3.4, '#0A0A0A', 0.55], [-1.9, '#2A2109', 0.42], [2.4, '#F6E6BC', 0.40], [1.2, '#E3C889', 0.30]],
    letterLijn: '#0A0A0A',
  },
  champagne: {
    grond: null, halo: '#FFFBF0', haloDek: 0.0,
    brons: ['#9C7B33', '#7E6229', '#6A5322', '#52401A'],
    licht: '#FFFBF0', schaduw: '#0A0A0A', diep: '#5A4419',
    steenLicht: '#FFFBF0', steenDonker: '#5A4419', steenDek: 0.22,
    doorgang: [['#5A4419', 0.30], ['#7A5E28', 0.14], ['#FFF8E6', 0.24]],
    ver: ['#FFFDF6', 0.80, '#FFF3D8', 0.46, '#E8D6AE', 0.18],
    band: [['#FFF6E2', 0.52], ['#D8B573', 0.30], ['#6B5322', 0.40]],
    relief: [[-3.4, '#0A0A0A', 0.34], [-1.9, '#5A4419', 0.26], [2.4, '#FFFDF6', 0.60], [1.2, '#FFF8E6', 0.40]],
    letterLijn: '#0A0A0A',
  },
};

function vlakken(p) {
  hz = 7777;
  const CYo = 48, CYi = 50, RO = 36, RI = 26;
  const pt = (cy, r, t) => [r2(50 + r * Math.cos(t)), r2(cy + r * Math.sin(t))];
  let v = '';
  v += `<path d="M24 104V${CYi}a${RI} ${RI} 0 0 1 ${RI * 2} 0V104Z" fill="url(#gloed)"/>`;
  v += '<g clip-path="url(#knip)">';
  const hw2 = 19, voet2 = 99, aanzet2 = 66;
  const vorm2 = `M${50 - hw2} ${voet2}V${aanzet2}a${hw2} ${hw2} 0 0 1 ${hw2 * 2} 0V${voet2}`;
  v += `<path d="${vorm2}Z" fill="url(#ver)"/>`;
  v += `<path d="${vorm2}" fill="none" stroke="${p.diep}" stroke-width="1.1" opacity="0.48"/>`;
  v += `<path d="M${50 - hw2 - 2.6} ${voet2}V${aanzet2}a${hw2 + 2.6} ${hw2 + 2.6} 0 0 1 ${(hw2 + 2.6) * 2} 0V${voet2}" fill="none" stroke="${p.licht}" stroke-width="1.6" opacity="0.44"/>`;
  v += `<path d="M${50 - hw2} ${voet2}L${50 - hw2 - 8} 104h${(hw2 + 8) * 2}L${50 + hw2} ${voet2}Z" fill="url(#baan)"/>`;
  v += '</g>';
  v += `<path d="M14 104V${CYo}a${RO} ${RO} 0 0 1 ${RO * 2} 0V104ZM24 104V${CYi}a${RI} ${RI} 0 0 1 ${RI * 2} 0V104Z" fill="url(#band)" fill-rule="evenodd"/>`;
  v += '<g clip-path="url(#bandknip)">';
  const N = 13;
  for (let k = 0; k < N; k++) {
    const tm = Math.PI + ((k + 0.5) / N) * Math.PI;
    const L = Math.cos(tm - (A_LICHT + Math.PI / 2));
    const b = Math.PI / N / 2 - 0.012;
    const [ax, ay] = pt(CYo, RO, tm - b), [bx, by] = pt(CYo, RO, tm + b);
    const [cx2, cy2] = pt(CYi, RI, tm + b), [dx2, dy2] = pt(CYi, RI, tm - b);
    v += `<path d="M${ax} ${ay}A${RO} ${RO} 0 0 1 ${bx} ${by}L${cx2} ${cy2}A${RI} ${RI} 0 0 0 ${dx2} ${dy2}Z" fill="${L > 0 ? p.steenLicht : p.steenDonker}" opacity="${r2(p.steenDek * Math.abs(L) + 0.05 + w() * 0.05)}"/>`;
  }
  for (let k = 0; k <= N; k++) {
    const t = Math.PI + (k / N) * Math.PI + w() * 0.012;
    const [ax, ay] = pt(CYo, RO + 1.2, t), [bx, by] = pt(CYi, RI - 1.2, t);
    v += `<path d="M${ax} ${ay}L${bx} ${by}" stroke="${p.steenDonker}" stroke-width="${r2(0.8 + w() * 0.2)}" opacity="0.48"/>`;
    v += `<path d="M${r2(ax + 0.55)} ${r2(ay + 0.45)}L${r2(bx + 0.55)} ${r2(by + 0.45)}" stroke="${p.steenLicht}" stroke-width="0.5" opacity="0.26"/>`;
  }
  for (const zij of [14, 76]) {
    for (let j = 1; j <= 4; j++) {
      const yy = r2(56 + j * 11.5 + w() * 1.1);
      v += `<path d="M${zij} ${yy}h10" stroke="${p.steenDonker}" stroke-width="0.7" opacity="0.40"/>`;
      v += `<path d="M${zij} ${r2(yy + 0.5)}h10" stroke="${p.steenLicht}" stroke-width="0.45" opacity="0.22"/>`;
    }
  }
  v += '</g>';
  return v;
}

function ruis(n, sterk, zd) {
  let z = zd;
  const trek = () => (z = (z * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const px = Buffer.alloc(n * n * 3);
  for (let i = 0; i < n * n; i++) {
    const v = Math.max(0, Math.min(255, 128 + Math.round((trek() - 0.5) * 255 * sterk)));
    px[i * 3] = px[i * 3 + 1] = px[i * 3 + 2] = v;
  }
  return { px, n };
}

function plaat(p) {
  const relief = p.relief.map(([d, kl, dek]) =>
    `<g opacity="${dek}"><g transform="translate(${r2(lx * d)},${r2(ly * d)})">${M.poort(kl, x, y, SCH)}</g></g>`).join('');
  const grond = p.grond
    ? `<rect width="${W}" height="${W}" fill="${p.grond}"/><rect width="${W}" height="${W}" fill="url(#halo)"/>`
    : `<rect width="${W}" height="${W}" fill="url(#champ)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<defs>
  <radialGradient id="champ" cx="46%" cy="36%" r="80%">
    <stop offset="0%" stop-color="#FDF7E9"/><stop offset="52%" stop-color="#F3E6C9"/>
    <stop offset="100%" stop-color="#DCC495"/></radialGradient>
  <radialGradient id="halo" cx="50%" cy="42%" r="66%">
    <stop offset="0%" stop-color="${p.halo}" stop-opacity="${p.haloDek}"/>
    <stop offset="100%" stop-color="${p.halo}" stop-opacity="0"/></radialGradient>
  <linearGradient id="gloed" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${p.doorgang[0][0]}" stop-opacity="${p.doorgang[0][1]}"/>
    <stop offset="55%" stop-color="${p.doorgang[1][0]}" stop-opacity="${p.doorgang[1][1]}"/>
    <stop offset="100%" stop-color="${p.doorgang[2][0]}" stop-opacity="${p.doorgang[2][1]}"/></linearGradient>
  <radialGradient id="ver" cx="50%" cy="72%" r="78%">
    <stop offset="0%" stop-color="${p.ver[0]}" stop-opacity="${p.ver[1]}"/>
    <stop offset="60%" stop-color="${p.ver[2]}" stop-opacity="${p.ver[3]}"/>
    <stop offset="100%" stop-color="${p.ver[4]}" stop-opacity="${p.ver[5]}"/></radialGradient>
  <linearGradient id="baan" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${p.ver[0]}" stop-opacity="0.32"/>
    <stop offset="100%" stop-color="${p.ver[4]}" stop-opacity="0.04"/></linearGradient>
  <linearGradient id="band" x1="0.05" y1="0" x2="0.95" y2="1">
    <stop offset="0%" stop-color="${p.band[0][0]}" stop-opacity="${p.band[0][1]}"/>
    <stop offset="45%" stop-color="${p.band[1][0]}" stop-opacity="${p.band[1][1]}"/>
    <stop offset="100%" stop-color="${p.band[2][0]}" stop-opacity="${p.band[2][1]}"/></linearGradient>
  <linearGradient id="brons" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="112">
    <stop offset="0%" stop-color="${p.brons[0]}"/><stop offset="38%" stop-color="${p.brons[1]}"/>
    <stop offset="74%" stop-color="${p.brons[2]}"/><stop offset="100%" stop-color="${p.brons[3]}"/></linearGradient>
  <clipPath id="knip"><path d="M24 104V50a26 26 0 0 1 52 0V104Z"/></clipPath>
  <clipPath id="bandknip"><path d="M14 104V48a36 36 0 0 1 72 0V104ZM24 104V50a26 26 0 0 1 52 0V104Z" clip-rule="evenodd"/></clipPath>
</defs>
${grond}
<g transform="translate(${x},${y}) scale(${SCH})">${vlakken(p)}</g>
${relief}
<g stroke="${p.letterLijn}" stroke-width="0.8" stroke-linejoin="round" opacity="0.55">${M.poort('url(#brons)', x, y, SCH)}</g>
${M.poort('url(#brons)', x, y, SCH)}
</svg>`;
}

(async () => {
  const grof = ruis(14, 0.46, 424242);
  const patina = await sharp(grof.px, { raw: { width: grof.n, height: grof.n, channels: 3 } })
    .resize(W, W, { kernel: 'cubic' }).blur(30).png().toBuffer();
  const fijn = ruis(W, 0.08, 991);
  const korrel = await sharp(fijn.px, { raw: { width: W, height: W, channels: 3 } }).png().toBuffer();

  for (const naam of ['zwart', 'champagne']) {
    const buf = new Resvg(plaat(P[naam]), { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: W } }).render().asPng();
    await sharp(buf).removeAlpha()
      .composite([{ input: patina, blend: 'soft-light' }, { input: korrel, blend: 'overlay' }])
      .png().toFile(`poort-${naam}.png`);
    const doel = naam === 'champagne' ? 'profiel-entree.png' : 'profiel-entree-zwart.png';
    fs.renameSync(`poort-${naam}.png`, path.join(UIT, doel));
    if (naam === 'champagne') {
      const p = path.join(UIT, doel);
      await sharp(p).resize(300, 300).jpeg({ quality: 82 }).toFile(path.join(WEB, 'profiel-entree.jpg'));
      const k56 = await sharp(p).resize(56, 56, { kernel: 'lanczos3' }).png().toBuffer();
      const k150 = await sharp(p).resize(150, 150, { kernel: 'lanczos3' }).png().toBuffer();
      const groot = await sharp(k56).resize(224, 224, { kernel: 'nearest' }).png().toBuffer();
      await sharp({ create: { width: 560, height: 250, channels: 3, background: '#2b2b2b' } })
        .composite([{ input: k56, top: 97, left: 30 }, { input: k150, top: 50, left: 120 },
                    { input: groot, top: 13, left: 300 }])
        .png().toFile(path.join(UIT, 'profiel-entree-controle.png'));
    }
    console.log(doel.padEnd(30), W + 'x' + W);
  }
})();
