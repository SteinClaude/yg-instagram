// Meer voorbeelden van de familie Nacht (docs/stijlgids.md §6), op verzoek van Andries (26 okt: "maak eens meer voorbeelden
// van de nacht uiterlijk"). Elke plaat: donkere grond met gouden gloed, embleem bovenin, één groot gouden element, kop in
// ivoor, voetregel. Teksten zijn voorbeeldzinnen die kloppen zonder cijfers die we niet kunnen bewijzen (les van T01);
// geen prijs (die staat alleen in Z01). Geen pakketten, niets wordt ingepland.
//   node gereedschap/stijlproef-nacht.cjs    → preview/stijlgids/nacht-*.jpg en nacht-overzicht.jpg
'use strict';
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
const { kaart } = require('../platen/maak.cjs');

const UIT = path.join(__dirname, '..', 'preview', 'stijlgids');
fs.mkdirSync(UIT, { recursive: true });

// ---------------------------------------------------------------- gouden lijntekeningen (zelfde lijndikte als het embleem)
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

// ---------------------------------------------------------------- de platen
const PLATEN = [
  { naam: 'nacht-kaart', titel: 'Feit · kaartspeld', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, speld,
    { t: 'kop', tekst: 'Gevonden op de kaart.\nEn dan?', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Wie op uw naam tikt, wil uw behandelingen, uw werk en een knop om te boeken zien.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-klok', titel: 'Feit · klok', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, klok,
    { t: 'kop', tekst: 'Uw website is ook\nom elf uur open.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Een afspraakknop werkt ook als uw zaak dicht is.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-telefoon', titel: 'Feit · telefoon', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Uw klant kijkt op\neen klein scherm.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Daarom ontwerpen wij elke site eerst voor de telefoon.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-sterren', titel: 'Feit · sterren', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 40 }, sterren,
    { t: 'kop', tekst: 'Uw reviews staan\nop Google.\nNiet op uw site.', grootte: 84, marge: 40, maxRegels: 4 },
    { t: 'tekst', tekst: 'Tenzij u een site heeft die ze laat zien.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-citaat', titel: 'Werkwijze · citaat', blokken: [
    { t: 'boven', tekst: 'Onze werkwijze' },
    { t: 'prijs', bedrag: '“', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Eerst zien.\nDan beslissen.', grootte: 96, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'U ziet uw eerste ontwerp voordat u iets afspreekt.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-stap-3', titel: 'Zo werkt het · stap 3', blokken: [
    { t: 'boven', tekst: 'Zo werkt het' },
    { t: 'prijs', bedrag: '3', grootte: 300, marge: 90 },
    { t: 'kop', tekst: 'Vaste prijs vooraf.', grootte: 96, marge: 34 },
    { t: 'tekst', tekst: 'U weet wat het kost voordat wij beginnen. Meerwerk alleen na uw ja.', grootte: 30, max: 760 } ] },
];

(async () => {
  const bestaand = [['voorbeeld-nacht-feit', 'Feit · zoekbalk (eerste voorbeeld)'], ['voorbeeld-nacht-stap', 'Zo werkt het · stap 1 (eerste voorbeeld)']];
  for (const p of PLATEN) {
    await sharp(await kaart({ blokken: p.blokken }, 1080, 1350)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, p.naam + '.jpg'));
    console.log(p.naam + '.jpg');
  }
  // overzicht: de twee eerste voorbeelden en de zes nieuwe, vier per rij, met onderschrift
  const alle = [...bestaand.map(([n, t]) => ({ naam: n, titel: t })), ...PLATEN];
  const B = 360, H = 450, GAT = 24, RAND = 36, ONDER = 44, PER = 4, rijen = Math.ceil(alle.length / PER);
  const lagen = [];
  for (const [i, p] of alle.entries()) {
    const x = RAND + (i % PER) * (B + GAT), y = RAND + Math.floor(i / PER) * (H + ONDER + GAT);
    lagen.push({ input: await sharp(path.join(UIT, p.naam + '.jpg')).resize(B, H).toBuffer(), left: x, top: y });
    lagen.push({ input: Buffer.from(`<svg width="${B}" height="${ONDER}"><text x="0" y="28" font-family="Arial" font-size="17" fill="#6A5F55">${p.titel}</text></svg>`), left: x, top: y + H + 4 });
  }
  await sharp({ create: { width: PER * B + (PER - 1) * GAT + 2 * RAND, height: rijen * (H + ONDER) + (rijen - 1) * GAT + 2 * RAND, channels: 3, background: '#E9E2D6' } })
    .composite(lagen).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'nacht-overzicht.jpg'));
  console.log('nacht-overzicht.jpg');
})().catch(e => { console.error(e); process.exit(1); });
