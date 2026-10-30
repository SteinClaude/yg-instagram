// A37 · bekendmaking van de weggeefactie (opdracht 02, §3): vier platen van 1080 x 1350 in de stijl van A36 (lichte deur
// met ivoren waas, rond medaillonzegel, goud, poortembleem), met de tekenmachine (platen/maak.cjs) en het zegel uit
// platen/actie.cjs. SJABLOON: naam, omschrijving en de drie waarom-regels komen uit bron/gekozen.txt; dit script maakt
// daaruit de platen, bijschrift.txt en beeldbeschrijvingen.txt. Zolang gekozen.txt de plaatshouder bevat, is het pakket
// een voorbeeld en wordt het niet ingepland.
// Woordkeus (juridisch, zie platen/actie.cjs): "gekozen", nooit "gewonnen", "winnaar", "winactie" of "kans".
//   node pakketten/2026-11-04-A37-bekendmaking/bron/maak-a37.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { kaart } = require('../../../platen/maak.cjs');
const { zegel } = require('../../../platen/actie.cjs');
const sharp = require('sharp');
const UIT = path.join(__dirname, '..');

// ---- invoer
const G = {};
for (const r of fs.readFileSync(path.join(__dirname, 'gekozen.txt'), 'utf8').split(/\r?\n/)) {
  const m = r.match(/^\s*([a-z0-9]+)\s*:\s*(.+?)\s*$/i); if (m && !r.trim().startsWith('#')) G[m[1]] = m[2];
}
for (const k of ['naam', 'wat', 'waarom1', 'waarom2', 'waarom3', 'waaromkort']) if (!G[k]) { console.error('gekozen.txt mist: ' + k); process.exit(1); }
const PLAATSHOUDER = /voorbeeld b\.v\.|plaatshouder|fictief voorbeeldbedrijf/i.test(G.naam + ' ' + G.wat);
const verboden = /\b(win|winnaar|winnen|gewonnen|winactie|kans|trekking|verloting|loting)\b/i;
for (const [k, v] of Object.entries(G)) if (verboden.test(v)) { console.error(`verboden woord in ${k}: ${v}`); process.exit(1); }

// ---- platen (zelfde lichte deur als A36)
const ACHTERGROND = { bron: 'ai/deur.jpg', licht: true, helderheid: 1.18, verzadiging: 0.7, waas: 0.84, positie: 'centre' };
const PLATEN = [
  { achtergrond: ACHTERGROND, blokken: [
      zegel(260, { marge: 34 }),
      { t: 'boven', tekst: 'Weggeefactie \u00b7 de uitslag' },
      { t: 'kop', tekst: 'Gekozen.', grootte: 96, marge: 30 },
      { t: 'kop', tekst: G.naam, grootte: 58, marge: 22, maxRegels: 2 },
      { t: 'tekst', tekst: G.wat.charAt(0).toUpperCase() + G.wat.slice(1) + '.', grootte: 28, max: 820 },
    ] },
  { achtergrond: ACHTERGROND, blokken: [
      zegel(150, { marge: 30 }),
      { t: 'boven', tekst: 'Waarom' },
      { t: 'kop', tekst: 'Wat de doorslag gaf.', grootte: 72, marge: 36 },
      { t: 'lijst', grootte: 30, gat: 26, items: [G.waarom1, G.waarom2, G.waarom3] },
      { t: 'tekst', tekst: 'Wij lazen elke inzending op de vier punten uit de actie: wat het bedrijf doet en voor wie, wat de site moet oplossen, wat al geprobeerd is, en wie de klant is.', grootte: 24, max: 820 },
    ] },
  { achtergrond: ACHTERGROND, blokken: [
      zegel(150, { marge: 30 }),
      { t: 'boven', tekst: 'Wat er nu gebeurt' },
      { t: 'kop', tekst: 'Van ontwerp naar live.', grootte: 72, marge: 36 },
      { t: 'lijst', grootte: 30, grootteTekst: 25, gat: 24, items: [
        { kop: 'Eerste ontwerp binnen 48 uur', tekst: 'Met de naam, het vak en de sfeer van ' + G.naam + (G.naam.endsWith('.') ? '' : '.') },
        { kop: 'Bouw', tekst: 'Zeven pagina\u2019s, de teksten en een logo, zoals beloofd.' },
        { kop: 'Live', tekst: 'En wij laten het hier zien, stap voor stap.' },
      ] },
    ] },
  { achtergrond: ACHTERGROND, blokken: [
      zegel(260, { marge: 34 }),
      { t: 'boven', tekst: 'Ook een eerste ontwerp?' },
      { t: 'kop', tekst: 'Vrijblijvend,\nvia de link in onze bio.', grootte: 76, marge: 30 },
      { t: 'tekst', tekst: 'Iedereen die meedeed, krijgt van ons een eerste ontwerp. En wie niet meedeed ook: in vijf minuten, met uw eigen naam.', grootte: 28, max: 820 },
    ] },
];

// ---- bijschrift en alt-teksten (\u2264 80 woorden; "gekozen", nooit "gewonnen")
const BIJSCHRIFT = `Gekozen: ${G.naam}.

Dank aan iedereen die instuurde. Wij lazen elke inzending zelf en kozen ${G.naam} ${G.waaromkort}. Zij krijgen wat in de actie stond: zeven pagina\u2019s, de teksten en een logo. Het eerste ontwerp staat binnen 48 uur; de bouw laten wij hier zien.

Iedereen die meedeed, krijgt van ons een eerste ontwerp, vrijblijvend.

Ook een eerste ontwerp? Via de link in onze bio.

#alkmaar #ondernemersalkmaar #webdesign #websitelatenmaken #ygdigital #ondernemen #mkb #kleinbedrijf
`;
const ALT = `1. Gekozen: ${G.naam}
Lichte plaat met een open deur achter een ivoren waas, het ronde gouden YG-medaillon en de tekst Weggeefactie, de uitslag. Gekozen: ${G.naam}, ${G.wat}.

2. Waarom
Lichte plaat in dezelfde stijl. Kop: Wat de doorslag gaf. Drie punten: ${G.waarom1} ${G.waarom2} ${G.waarom3}

3. Wat er nu gebeurt
Lichte plaat in dezelfde stijl. Kop: Van ontwerp naar live. Drie stappen: eerste ontwerp binnen 48 uur, bouw van zeven pagina\u2019s met teksten en logo, live, en wij laten het hier zien.

4. Ook een eerste ontwerp?
Lichte plaat in dezelfde stijl met het medaillon. Kop: Vrijblijvend, via de link in onze bio. Iedereen die meedeed krijgt een eerste ontwerp; wie niet meedeed ook, in vijf minuten met uw eigen naam.
`;

(async () => {
  fs.writeFileSync(path.join(UIT, 'bijschrift.txt'), BIJSCHRIFT, 'utf8');
  fs.writeFileSync(path.join(UIT, 'beeldbeschrijvingen.txt'), ALT, 'utf8');
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
  const woorden = BIJSCHRIFT.split('\n').filter(r => !r.startsWith('#')).join(' ').trim().split(/\s+/).filter(Boolean).length;
  console.log(`bijschrift ${woorden} woorden${woorden > 80 ? '  LET OP: meer dan 80, kort waaromkort in gekozen.txt in' : ''}${PLAATSHOUDER ? '  (PLAATSHOUDER: dit is het sjabloon, niet inplannen)' : ''}`);
})().catch(e => { console.error(e); process.exit(1); });
