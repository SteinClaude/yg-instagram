// Rastervoorbeeld bij docs/stijlgids.md §3: champagne en Nacht om en om (Andries 26 okt: "deze style gecombineerd met de
// champagne style die er al op de pagina staat en zo om en om met deze style posten"). Met drie kolommen wordt dat vanzelf
// een dambord. Bovenaan de vastgezette weggeefactie (A36), daarna nieuwste eerst. Tegels in 3:4 zoals Instagram ze toont.
// Gebruikt bestaande platen en de voorbeelden uit preview/stijlgids; het is een proef, geen planning.
//   node gereedschap/stijlproef-raster.cjs   → preview/stijlgids/raster-om-en-om.jpg
'use strict';
const path = require('path');
const sharp = require('sharp');
const W = path.join(__dirname, '..'), P = f => path.join(W, 'pakketten', f), S = f => path.join(W, 'preview', 'stijlgids', f);

// nieuwste eerst; na de vastgezette A36 (licht) begint het patroon met Nacht, zodat licht en donker in elke rij wisselen
const TEGELS = [
  [path.join(W, 'beeld', 'berichten', 'nl', 'A36-1.jpg'), 'A36 · vastgezet', 'licht'],
  [S('nacht-kaart.jpg'), 'Nacht · feit', 'donker'],
  [S('champagne-1-foto.jpg'), 'Champagne · concept (Foto)', 'licht'],
  [S('nacht-citaat.jpg'), 'Nacht · werkwijze', 'donker'],
  [P('2026-11-06-W02-ontwerpstudio/plaat-1.jpg'), 'Champagne · eigen werk', 'licht'],
  [S('nacht-stap-3.jpg'), 'Nacht · zo werkt het', 'donker'],
  [S('champagne-1-telefoon.jpg'), 'Champagne · concept (Telefoon)', 'licht'],
  [S('nacht-sterren.jpg'), 'Nacht · feit', 'donker'],
  [S('champagne-1-detail.jpg'), 'Champagne · concept (Detail)', 'licht'],
  [S('nacht-klok.jpg'), 'Nacht · feit', 'donker'],
  [S('champagne-1-venster.jpg'), 'Champagne · concept (Venster)', 'licht'],
  [S('nacht-telefoon.jpg'), 'Nacht · feit', 'donker'],
];

(async () => {
  const B = 300, H = 400, GAT = 3, RAND = 30, KOP = 90, LAB = 30;
  const lagen = [{ input: Buffer.from(`<svg width="${3 * B + 2 * GAT}" height="${KOP}">
    <text x="0" y="38" font-family="Georgia" font-size="30" fill="#2A2420">Om en om: champagne en Nacht</text>
    <text x="0" y="72" font-family="Arial" font-size="17" fill="#6A5F55">Profielraster op telefoonbreedte, nieuwste eerst, tegels 3:4. Proef, geen planning.</text></svg>`), left: RAND, top: RAND }];
  for (const [i, [f, label]] of TEGELS.entries()) {
    const x = RAND + (i % 3) * (B + GAT), y = RAND + KOP + Math.floor(i / 3) * (H + GAT + LAB);
    lagen.push({ input: await sharp(f).extract({ left: 34, top: 0, width: 1012, height: 1350 }).resize(B, H).toBuffer(), left: x, top: y });
    lagen.push({ input: Buffer.from(`<svg width="${B}" height="${LAB}"><text x="2" y="21" font-family="Arial" font-size="15" fill="#6A5F55">${label}</text></svg>`), left: x, top: y + H });
  }
  const rijen = Math.ceil(TEGELS.length / 3);
  await sharp({ create: { width: 3 * B + 2 * GAT + 2 * RAND, height: KOP + rijen * (H + GAT + LAB) + 2 * RAND, channels: 3, background: '#FFFFFF' } })
    .composite(lagen).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(W, 'preview', 'stijlgids', 'raster-om-en-om.jpg'));
  console.log('preview/stijlgids/raster-om-en-om.jpg');
})().catch(e => { console.error(e); process.exit(1); });
