// T02 · feit (OPDRACHT-ACTUEEL §4, sector beauty): goud op donker, één gedachte per plaat, twee platen van 1080 x 1350.
// Gemaakt met de tekenmachine van de platen (platen/maak.cjs, kaart zonder foto: donkere grond met gouden gloed,
// kaderlijn, poortembleem, bovenregel in goud, kop in ivoor, voetregel yg-digital.nl). Niets nieuws ontworpen.
//   node pakketten/2026-11-11-T02-feit/bron/maak-t02.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { kaart } = require('../../../platen/maak.cjs');
const sharp = require('sharp');

const UIT = path.join(__dirname, '..');

const PLATEN = [
  // 1. Het feit, als constatering (les van T01: geen cijfer dat we niet kunnen bewijzen, geen naam, geen bedrijf).
  // Bron: Google Bedrijfsprofiel-hulp ("Edit your Business Profile", support.google.com/business/answer/3039617): een
  // website deelt de ondernemer zelf op het profiel; zonder website is er dus geen website-link om op te tikken.
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Een feit' },
      { t: 'kop', tekst: 'Zoek op \u2018nagelstudio\u2019.', grootte: 92, marge: 44, maxRegels: 2 },
      { t: 'kop', tekst: 'Op Google krijgt een salon zonder website geen knop \u2018Website\u2019.', grootte: 64, marge: 0, maxRegels: 3 },
    ] },
  // 2. De oplossing, in één zin, zonder naam.
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'De oplossing' },
      { t: 'kop', tekst: 'Met een eigen website tikt een klant door naar uw behandelingen, uw werk en een knop om te boeken.', grootte: 68, marge: 40, maxRegels: 5 },
      { t: 'tekst', tekst: 'Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 28 },
    ] },
];

(async () => {
  const bufs = [];
  for (const [i, p] of PLATEN.entries()) {
    const png = await kaart(p, 1080, 1350);
    const doel = path.join(UIT, `plaat-${i + 1}.jpg`);
    await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(doel);
    bufs.push(await sharp(png).resize({ width: 432 }).toBuffer());
    console.log(`plaat-${i + 1}.jpg`);
  }
  // overzicht (twee naast elkaar) en telefooncontrole (op 390 punten, dubbele dichtheid)
  const rand = 40;
  await sharp({ create: { width: 2 * 432 + 3 * rand, height: 540 + 2 * rand, channels: 3, background: '#E9E2D6' } })
    .composite(bufs.map((b, i) => ({ input: b, left: rand + i * (432 + rand), top: rand })))
    .jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
  const tel = [];
  for (let i = 0; i < PLATEN.length; i++) tel.push(await sharp(path.join(UIT, `plaat-${i + 1}.jpg`)).resize({ width: 780 }).toBuffer());
  await sharp({ create: { width: 2 * 780 + 3 * 36, height: 975 + 2 * 36, channels: 3, background: '#ffffff' } })
    .composite(tel.map((b, i) => ({ input: b, left: 36 + i * (780 + 36), top: 36 })))
    .jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
