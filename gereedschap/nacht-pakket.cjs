// Gedeelde afwerking voor Nacht-pakketten (G, T): platen tekenen met de tekenmachine (platen/maak.cjs) en daarna
// overzicht.jpg en telefooncontrole.jpg maken, precies zoals in G01 en T03.
//   const { bouwNacht } = require('../../../gereedschap/nacht-pakket.cjs');
//   bouwNacht(path.join(__dirname, '..'), PLATEN);
'use strict';
const path = require('path');
const sharp = require('sharp');
const { kaart } = require('../platen/maak.cjs');

async function bouwNacht(UIT, PLATEN) {
  const klein = [];
  for (const [i, p] of PLATEN.entries()) {
    const png = await kaart(p, 1080, 1350);
    await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
    klein.push(await sharp(png).resize({ width: 432 }).toBuffer());
    console.log(`plaat-${i + 1}.jpg`);
  }
  const n = PLATEN.length, rand = 36;
  await sharp({ create: { width: n * 432 + (n + 1) * rand, height: 540 + 2 * rand, channels: 3, background: '#E9E2D6' } })
    .composite(klein.map((b, i) => ({ input: b, left: rand + i * (432 + rand), top: rand }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
  const tel = [];
  for (let i = 0; i < n; i++) tel.push(await sharp(path.join(UIT, `plaat-${i + 1}.jpg`)).resize({ width: 780 }).toBuffer());
  await sharp({ create: { width: n * 780 + (n + 1) * 30, height: 975 + 60, channels: 3, background: '#ffffff' } })
    .composite(tel.map((b, i) => ({ input: b, left: 30 + i * 810, top: 30 }))).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
}

module.exports = { bouwNacht };
