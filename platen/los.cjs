// Losse berichten: platen die bewust NIET bij een rij van drie horen. Gemaakt
// 21 september 2026, toen Gijs zijn raster eentonig vond en zelf een volgorde
// samenstelde: quote, video, quote, gewoon bericht, video, gewoon bericht.
//
// Deze twee vullen de twee "gewone" plekken. Ze staan los omdat ze allebei een
// eigen onderwerp hebben dat nergens anders staat, en omdat een plaat uit een rij
// ("1 van 3") in zijn eentje raar leest.
//
// F36  de ontwerpstudio, nu met een volledig scherm
// F37  wat een website kost — het meest gestelde vraag, stond nog nergens op het account
//
//   node platen/los.cjs        allebei renderen naar beeld/ en mini/
//   node platen/los.cjs F36    alleen die ene
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

const LOS = [
  {
    code: 'F36', beeld: 'studio', helderheid: 0.72,
    blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Op yg-digital.nl' },
      { t: 'kop', tekst: 'Zie uw eigen site,\nop ware grootte.', grootte: 82, marge: 40 },
      { t: 'tekst', tekst: 'U kiest uw branche, uw sfeer en uw kleuren. Binnen vijf minuten staat er een website met uw eigen naam erop, en met één knop zet u hem over uw hele scherm. Geen afspraak, geen account, geen verplichting.', grootte: 29 },
    ],
  },
  {
    code: 'F37', beeld: 'ruimte-lunchroom', helderheid: 0.68,
    blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'De vraag die iedereen stelt' },
      { t: 'kop', tekst: 'Wat kost een website?', grootte: 86, marge: 36 },
      { t: 'prijs', bedrag: 'vanaf € 550', onder: 'eenmalig · excl. btw · € 665,50 incl.', grootte: 88, marge: 30 },
      { t: 'tekst', tekst: 'Eén bedrag, vooraf, met een opleverdatum erbij. Wat erbij komt gaat pas door nadat u er ja op heeft gezegd.', grootte: 28 },
    ],
  },
];

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { LOS };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const p of LOS) {
      if (alleen && p.code !== alleen) continue;
      await bewaar(await kaart({
        achtergrond: { bron: `ai/${p.beeld}.jpg`, helderheid: p.helderheid, verzadiging: 0.9, donkerte: 0.94, positie: 'centre' },
        uitlijn: 'onder',
        blokken: p.blokken,
      }, 1080, 1350), `berichten/nl/${p.code}.jpg`);
      console.log(`${p.code}  ${p.beeld.padEnd(16)} ✓`); n++;
    }
    console.log(`\n${n} losse berichtplaten in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
