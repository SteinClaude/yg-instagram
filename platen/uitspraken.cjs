// Uitspraken: korte zinnen, groot, midden op de plaat. Geen naam eronder — dat is
// een keuze van Gijs (21 sep): het leest als huisstijl, niet als persoon. Een
// klantcitaat staat er bewust niet, want er zijn nog geen klanten en een verzonnen
// citaat is een verzonnen klant.
//
// Waarom dit een eigen bestand met een eigen opmaak is: Gijs vond zijn raster
// eentonig. De gewone berichtplaten zetten hun tekst allemaal ONDERAAN het beeld,
// met een klein gouden labeltje erboven. Deze staan MIDDEN in het beeld, met een
// groot aanhalingsteken en zonder label of lopende tekst. Op een raster van
// miniaturen zie je dat verschil meteen — dat is het hele doel.
//
//   node platen/uitspraken.cjs        allebei renderen naar beeld/ en mini/
//   node platen/uitspraken.cjs U01    alleen die ene
const fs = require('fs'), path = require('path');
const { kaart, pad, breedte, L } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// Het aanhalingsteken als los blok, in goud. Het glyph hangt in de bovenkant van
// zijn regel, dus we reserveren minder hoogte dan de lettergrootte.
const aanhaling = (grootte = 170) => ({
  t: 'svg', hoogte: grootte * 0.42, marge: 44,
  teken: (C, y) => {
    const g = grootte * C.s;
    const w = breedte(L.serif, '\u201C', g, 0);
    return pad(L.serif, '\u201C', C.mx - w / 2, y + g * 0.62, g, 0, C.k.goud).svg;
  },
});

const UITSPRAKEN = [
  {
    code: 'U01',
    beeld: 'deur',
    helderheid: 0.62,
    blokken: [
      aanhaling(),
      { t: 'kop', tekst: 'Een website is de deur\nwaardoor uw klanten\nbinnenkomen.', grootte: 74, marge: 40 },
      { t: 'lijn' },
    ],
  },
  {
    code: 'U02',
    beeld: 'ruimte-avond',
    helderheid: 0.58,
    blokken: [
      aanhaling(),
      { t: 'kop', tekst: 'Uw site is open\nwanneer u dicht bent.', grootte: 84, marge: 40 },
      { t: 'lijn' },
    ],
  },
];

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { UITSPRAKEN };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const u of UITSPRAKEN) {
      if (alleen && u.code !== alleen) continue;
      await bewaar(await kaart({
        achtergrond: { bron: `ai/${u.beeld}.jpg`, helderheid: u.helderheid, verzadiging: 0.85, donkerte: 0.96, positie: 'centre' },
        blokken: u.blokken,          // géén uitlijn: 'onder', dus midden in het beeld
      }, 1080, 1350), `berichten/nl/${u.code}.jpg`);
      console.log(`${u.code}  ${u.beeld.padEnd(14)} ✓`); n++;
    }
    console.log(`\n${n} uitspraakplaten in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
