// Z01 · zo werkt het (opdracht 02, §3): vier platen van 1080 x 1350, goud op donker met de tekenmachine (platen/maak.cjs,
// kaart zonder foto, zoals T01). De ENIGE post met een prijs (I4). Bedragen bevestigd door Andries op 23 okt 2026 17:14:
// eenmalig € 750 excl. btw (€ 907,50 incl.) voor ontwerp en bouw; beheer optioneel € 49 per maand excl. btw (€ 59,29 incl.);
// hosting regelt en betaalt de klant rechtstreeks bij JouwWeb, zonder opslag. Nooit "hosting inbegrepen".
// Op de dag van plaatsing moet yg-digital.nl/yg-launch dezelfde bedragen tonen (controle: zie docs/oplevering-01.md).
//   node pakketten/2026-11-04-Z01-zo-werkt-het/bron/maak-z01.cjs
'use strict';
const path = require('path');
const { kaart } = require('../../../platen/maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const UIT = path.join(__dirname, '..');

const PLATEN = [
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Zo werkt het \u00b7 stap 1' },
      { t: 'kop', tekst: 'Het ontwerp.', grootte: 92, marge: 36 },
      { t: 'tekst', tekst: 'Zie in vijf minuten uw eerste ontwerp in de ontwerpstudio, of begin met een gesprek.', grootte: 31 },
    ] },
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Zo werkt het \u00b7 stap 2' },
      { t: 'kop', tekst: 'Gesprek en offerte.', grootte: 92, marge: 36 },
      { t: 'tekst', tekst: 'E\u00e9n gesprek over het doel van uw site. Daarna een offerte met een vaste prijs.', grootte: 31 },
    ] },
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Zo werkt het \u00b7 stap 3' },
      { t: 'kop', tekst: 'De prijs.', grootte: 80, marge: 30 },
      { t: 'prijs', bedrag: '\u20ac 750', onder: 'eenmalig \u00b7 ontwerp en bouw \u00b7 excl. btw (\u20ac 907,50 incl.)', grootte: 120, marge: 36 },
      { t: 'lijst', grootte: 29, grootteTekst: 25, gat: 24, items: [
        { kop: 'Beheer, optioneel: \u20ac 49 per maand excl. btw', tekst: '\u20ac 59,29 incl. btw. Technisch onderhoud en updates, back-ups, en tot dertig minuten kleine tekst- en fotowijzigingen per maand.' },
        { kop: 'Hosting', tekst: 'Regelt en betaalt u rechtstreeks bij JouwWeb, zonder opslag van ons.' },
      ] },
    ] },
  { blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Zo werkt het \u00b7 stap 4' },
      { t: 'kop', tekst: 'Bouw en live.', grootte: 92, marge: 36 },
      { t: 'tekst', tekst: 'U kijkt mee, met twee gebundelde feedbackrondes. Daarna gaat uw site live. Kiest u beheer, dan onderhouden wij hem vanaf de oplevering.', grootte: 31 },
      { t: 'tekst', tekst: 'Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 26, marge: 0 },
    ] },
];

(async () => {
  const klein = [];
  for (const [i, p] of PLATEN.entries()) {
    const png = await kaart(p, 1080, 1350);
    await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
    klein.push(await sharp(png).resize({ width: 432 }).toBuffer());
    console.log(`plaat-${i + 1}.jpg`);
  }
  const rand = 36, n = PLATEN.length;
  await sharp({ create: { width: n * 432 + (n + 1) * rand, height: 540 + 2 * rand, channels: 3, background: '#E9E2D6' } })
    .composite(klein.map((b, i) => ({ input: b, left: rand + i * (432 + rand), top: rand }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
  const tel = [];
  for (let i = 0; i < n; i++) tel.push(await sharp(path.join(UIT, `plaat-${i + 1}.jpg`)).resize({ width: 780 }).toBuffer());
  await sharp({ create: { width: n * 780 + (n + 1) * 30, height: 975 + 60, channels: 3, background: '#ffffff' } })
    .composite(tel.map((b, i) => ({ input: b, left: 30 + i * 810, top: 30 }))).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
