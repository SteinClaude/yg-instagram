// Gouden elementen voor de familie Nacht (docs/stijlgids.md §6): lijntekeningen in dunne gouden lijn zoals het poortembleem,
// met één gevuld accent. Elk element is een blok voor de kaart van platen/maak.cjs: { t: 'svg', hoogte, marge, teken }.
//   const { speld, klok, telefoon, sterren, zoekbalk } = require('../../../gereedschap/nacht-elementen.cjs');
'use strict';
const lijn = (C, f = 1) => `fill="none" stroke="${C.k.goud}" stroke-width="${(2.6 * f * C.s).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"`;
const teken = (hoogte, fn, marge = 60) => ({ t: 'svg', hoogte, marge, teken: (C, y) => fn(C, y, C.s, C.mx) });

// kaartspeld met kringen en een paar straten
const speld = teken(300, (C, y, s, mx) => {
  const cy = y + 120 * s, r = 70 * s;
  const straten = [[-300, 230, 300, 210], [-260, 268, 240, 290], [-120, 180, -40, 300], [90, 170, 160, 300]]
    .map(([x1, y1, x2, y2]) => `<path d="M${mx + x1 * s} ${y + y1 * s}L${mx + x2 * s} ${y + y2 * s}" ${lijn(C, 0.6)} opacity="0.45"/>`).join('');
  return straten +
    `<ellipse cx="${mx}" cy="${y + 250 * s}" rx="${120 * s}" ry="${26 * s}" ${lijn(C, 0.8)} opacity="0.6"/>
     <ellipse cx="${mx}" cy="${y + 250 * s}" rx="${60 * s}" ry="${13 * s}" ${lijn(C, 0.8)} opacity="0.85"/>
     <path d="M${mx} ${y + 250 * s}C${mx - 18 * s} ${cy + 80 * s} ${mx - r} ${cy + 40 * s} ${mx - r} ${cy}A${r} ${r} 0 1 1 ${mx + r} ${cy}C${mx + r} ${cy + 40 * s} ${mx + 18 * s} ${cy + 80 * s} ${mx} ${y + 250 * s}Z" ${lijn(C, 1.1)}/>
     <circle cx="${mx}" cy="${cy}" r="${24 * s}" fill="${C.k.goud}"/>`;
});

// klok op elf uur 's avonds
const klok = teken(300, (C, y, s, mx) => {
  const cy = y + 150 * s, r = 140 * s;
  let streepjes = '';
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, l = i % 3 === 0 ? 22 : 12;
    streepjes += `<path d="M${mx + Math.sin(a) * (r - 14 * s)} ${cy - Math.cos(a) * (r - 14 * s)}L${mx + Math.sin(a) * (r - (14 + l) * s)} ${cy - Math.cos(a) * (r - (14 + l) * s)}" ${lijn(C, i % 3 === 0 ? 1 : 0.6)}/>`;
  }
  const wijzer = (uur, lengte, dik) => { const a = uur * Math.PI / 6; return `<path d="M${mx} ${cy}L${mx + Math.sin(a) * lengte * s} ${cy - Math.cos(a) * lengte * s}" ${lijn(C, dik)}/>`; };
  return `<circle cx="${mx}" cy="${cy}" r="${r}" ${lijn(C, 1)}/>` + streepjes + wijzer(11, 70, 1.6) + wijzer(0, 105, 1.1) + `<circle cx="${mx}" cy="${cy}" r="${7 * s}" fill="${C.k.goud}"/>`;
});

// telefoon met een site erin en een vaste afspraakknop onderaan
const telefoon = teken(340, (C, y, s, mx) => {
  const w = 190 * s, h = 340 * s, x = mx - w / 2, g = C.k.goud;
  const regel = (yy, br, dek) => `<rect x="${x + 26 * s}" y="${y + yy * s}" width="${br * s}" height="${9 * s}" rx="${4.5 * s}" fill="${g}" opacity="${dek}"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${30 * s}" ${lijn(C, 1.1)}/>
    <rect x="${mx - 30 * s}" y="${y + 16 * s}" width="${60 * s}" height="${12 * s}" rx="${6 * s}" fill="${g}" opacity="0.8"/>
    <rect x="${x + 22 * s}" y="${y + 52 * s}" width="${w - 44 * s}" height="${88 * s}" rx="${6 * s}" ${lijn(C, 0.6)} opacity="0.7"/>
    ${regel(160, 120, 0.9)}${regel(182, 140, 0.45)}${regel(204, 100, 0.45)}
    <rect x="${x + 22 * s}" y="${y + h - 66 * s}" width="${w - 44 * s}" height="${40 * s}" rx="${4 * s}" fill="${g}"/>`;
});

// vijf sterren
const sterren = teken(130, (C, y, s, mx) => {
  const ster = (cx, cy, r, vol) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; }
    return `<path d="${d}Z" ${vol ? `fill="${C.k.goud}"` : lijn(C, 0.9)}/>`;
  };
  let svg = ''; for (let i = 0; i < 5; i++) svg += ster(mx + (i - 2) * 118 * s, y + 62 * s, 52 * s, i < 4);
  return svg + `<path d="M${mx - 290 * s} ${y + 128 * s}L${mx + 290 * s} ${y + 128 * s}" ${lijn(C, 0.5)} opacity="0.5"/>`;
});


// zoekbalk met resultaatregels
const zoekbalk = {
  t: 'svg', hoogte: 300, marge: 64,
  teken: (C, y) => {
    const s = C.s, w = 720 * s, x = C.mx - w / 2, g = C.k.goud, h = 92 * s;
    const lijn = (yy, br, dek) => `<rect x="${x + 40 * s}" y="${yy}" width="${br * s}" height="${10 * s}" rx="${5 * s}" fill="${g}" opacity="${dek}"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${g}" stroke-width="${2.4 * s}"/>
      <circle cx="${x + 62 * s}" cy="${y + h / 2 - 4 * s}" r="${16 * s}" fill="none" stroke="${g}" stroke-width="${3 * s}"/>
      <path d="M${x + 74 * s} ${y + h / 2 + 8 * s}l${14 * s} ${14 * s}" stroke="${g}" stroke-width="${3.4 * s}" stroke-linecap="round"/>
      ${lijn(y + h + 56 * s, 420, 0.9)}${lijn(y + h + 84 * s, 560, 0.45)}
      ${lijn(y + h + 132 * s, 360, 0.9)}${lijn(y + h + 160 * s, 600, 0.45)}`;
  },
};

module.exports = { lijn, teken, speld, klok, telefoon, sterren, zoekbalk };
