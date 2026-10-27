// G01 · werkwijze (nieuwe pijler, code G akkoord Eva 26 okt): "Eerst zien. Dan beslissen." Familie Nacht volgens
// docs/stijlgids.md (concept, wacht op Andries): donkere grond, embleem, één groot gouden element per plaat, kop ≥ 84 px.
// Drie platen met de tekenmachine (platen/maak.cjs) en de gouden elementen uit gereedschap/nacht-elementen.cjs.
// Alles wat er staat, staat ook op yg-digital.nl: eerste ontwerp in vijf minuten, met uw eigen naam, geen account nodig.
//   node pakketten/2026-11-16-G01-werkwijze/bron/maak-g01.cjs
'use strict';
const path = require('path');
const sharp = require('sharp');
const { kaart } = require('../../../platen/maak.cjs');
const { telefoon } = require('../../../gereedschap/nacht-elementen.cjs');

const UIT = path.join(__dirname, '..');
const PLATEN = [
  // 1. de belofte, met het grote openingsaanhalingsteken
  { blokken: [
    { t: 'boven', tekst: 'Onze werkwijze' },
    { t: 'prijs', bedrag: '“', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Eerst zien.\nDan beslissen.', grootte: 96, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'U ziet uw eerste ontwerp voordat u iets afspreekt.', grootte: 29, max: 780 } ] },
  // 2. hoe: de ontwerpstudio op de telefoon
  { blokken: [
    { t: 'boven', tekst: 'In de ontwerpstudio' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Uw naam, uw vak,\nuw sfeer.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'In vijf minuten staat er een eerste ontwerp met uw eigen naam. Geen account nodig.', grootte: 29, max: 780 } ] },
  // 3. daarna: vrijblijvend, met het sluitende aanhalingsteken
  { blokken: [
    { t: 'boven', tekst: 'Daarna' },
    { t: 'prijs', bedrag: '”', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Bevalt het?\nDan praten we verder.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Zo niet, dan zit u nergens aan vast. Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 29, max: 780 } ] },
];

(async () => {
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
})().catch(e => { console.error(e); process.exit(1); });
