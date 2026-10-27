// T03 · feit "Gevonden op de kaart. En dan?" (batch 3, Nacht volgens docs/stijlgids.md, concept). Twee platen met de
// tekenmachine (platen/maak.cjs) en gouden elementen uit gereedschap/nacht-elementen.cjs (kaartspeld, telefoon).
// Les van T01: een constatering zonder cijfer, zonder naam, zonder herkenbaar bedrijf.
// Bron (27 okt nagekeken): Google-bedrijfsprofiel Help, "Uw Bedrijfsprofiel bewerken" (support.google.com/business/
// answer/3039617): op het profiel staan onder meer adres, openingstijden, telefoonnummer en — als de ondernemer die
// opgeeft — een website. Wie op een bedrijf op de kaart tikt, ziet dat profiel.
//   node pakketten/2026-11-20-T03-feit/bron/maak-t03.cjs
'use strict';
const path = require('path');
const sharp = require('sharp');
const { kaart } = require('../../../platen/maak.cjs');
const { speld, telefoon } = require('../../../gereedschap/nacht-elementen.cjs');

const UIT = path.join(__dirname, '..');
const PLATEN = [
  { blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, speld,
    { t: 'kop', tekst: 'Gevonden op de kaart.\nEn dan?', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Wie op uw naam tikt, ziet uw profiel: adres, openingstijden en telefoonnummer.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'De oplossing' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Met een website erbij\ntikt die klant door.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Naar uw werk, uw verhaal en een knop om te boeken. Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 29, max: 780 } ] },
];

(async () => {
  const klein = [];
  for (const [i, p] of PLATEN.entries()) {
    const png = await kaart(p, 1080, 1350);
    await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
    klein.push(await sharp(png).resize({ width: 432 }).toBuffer());
    console.log(`plaat-${i + 1}.jpg`);
  }
  const n = PLATEN.length, rand = 40;
  await sharp({ create: { width: n * 432 + (n + 1) * rand, height: 540 + 2 * rand, channels: 3, background: '#E9E2D6' } })
    .composite(klein.map((b, i) => ({ input: b, left: rand + i * (432 + rand), top: rand }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
  const tel = [];
  for (let i = 0; i < n; i++) tel.push(await sharp(path.join(UIT, `plaat-${i + 1}.jpg`)).resize({ width: 780 }).toBuffer());
  await sharp({ create: { width: n * 780 + (n + 1) * 36, height: 975 + 72, channels: 3, background: '#ffffff' } })
    .composite(tel.map((b, i) => ({ input: b, left: 36 + i * 816, top: 36 }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
