// T02 · tweede feit (opdracht 02 §3, beauty-week): goud op donker, één gedachte per plaat, twee platen van 1080 x 1350.
// Zelfde tekenmachine en opbouw als T01 (platen/maak.cjs, kaart zonder foto). Les van T01: alleen een constatering die
// altijd klopt, geen cijfer dat niet te bewijzen is, geen combinatie die naar een bestaand bedrijf wijst.
// Het feit: Google toont onder de kaart een lijst websites (de gewone zoekresultaten). Een zaak zonder eigen website kan
// daar zelf niet tussen staan; hij staat hooguit op de kaart of op de pagina van een ander. Bewust zonder "eerst" of
// "bovenaan": de volgorde verschilt per zoeker en per plek.
//   node pakketten/2026-11-11-T02-feit/bron/maak-t02.cjs
'use strict';
const path = require('path');
const { kaart } = require('../../../platen/maak.cjs');
const sharp = require('sharp');

const UIT = path.join(__dirname, '..');

const PLATEN = [
  // 1. Het feit
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Een feit' },
      { t: 'kop', tekst: 'Onder de kaart staan websites.', grootte: 88, marge: 44, maxRegels: 3 },
      { t: 'kop', tekst: 'Een nagelstudio zonder eigen site staat daar niet tussen.', grootte: 62, marge: 0, maxRegels: 3 },
    ] },
  // 2. De oplossing, in één zin
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'De oplossing' },
      { t: 'kop', tekst: 'Met een eigen website staat u op de kaart én eronder, in uw eigen woorden.', grootte: 72, marge: 40, maxRegels: 5 },
      { t: 'tekst', tekst: 'Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 28 },
    ] },
];

(async () => {
  const bufs = [];
  for (const [i, p] of PLATEN.entries()) {
    const png = await kaart(p, 1080, 1350);
    await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
    bufs.push(await sharp(png).resize({ width: 432 }).toBuffer());
    console.log(`plaat-${i + 1}.jpg`);
  }
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
