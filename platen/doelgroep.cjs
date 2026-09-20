// De doelgroepplaten: "Voor wie wij bouwen". Eén branche per plaat, met een
// eigen foto uit bron/ai/ in dezelfde warme donkere stijl als de rest.
// De oude F01-F13 gebruikten stockfoto's; deze vervangen ze één voor één.
//
//   node platen/doelgroep.cjs          alles wat hieronder staat
//   node platen/doelgroep.cjs F04      alleen die ene
//
// Resultaat: beeld/berichten/nl/<code>.jpg (1080x1350) en het kleintje in mini/.
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');
const SUB = 'Websites vanaf € 550 · vaste prijs vooraf';

// code = het nummer waar het bijschrift in teksten/berichten-nl.cjs bij hoort.
const PLATEN = [
  { code: 'F01', beeld: 'kapper',     kop: 'Voor de kapper om de hoek.' },
  { code: 'F04', beeld: 'vakman',     kop: 'Voor de vakman die liever bouwt dan typt.' },
  { code: 'F03', beeld: 'restaurant', kop: 'Voor het restaurant dat vol wil zitten.' },
];

// 20 sep gemaakt, 20 sep weer uit de voorraad gehaald: coach, winkel, praktijk,
// maker, kantoor en "te weinig tijd" (F02, F05, F06, F07, F08, F09). Het waren
// nog twee rijen "Voor wie wij bouwen" bovenop de rij die er al stond, en het zijn
// gegenereerde foto’s van werkplekken — precies wat een echte kapper of praktijk-
// houder als nep herkent zodra je hem dit als voorbeeld laat zien.
// De bronbeelden staan er nog (platen/bron/ai/coach.jpg enzovoort); ze zijn alleen
// niet meer ingepland. Wil je ze terug, zet de regels dan weer in PLATEN hierboven.

const plaat = p => ({
  id: p.code,
  achtergrond: { bron: `ai/${p.beeld}.jpg`, helderheid: p.licht ?? 0.86, verzadiging: 0.9, donkerte: 0.94, positie: 'centre' },
  uitlijn: 'onder',
  blokken: [
    { t: 'lijn' },
    { t: 'boven', tekst: 'Voor wie wij bouwen' },
    { t: 'kop', tekst: p.kop, grootte: 70, marge: 28 },
    { t: 'tekst', tekst: SUB, grootte: 28 },
  ],
});

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const p of PLATEN) {
      if (alleen && p.code !== alleen) continue;
      const doel = path.join(BEELD, 'berichten', 'nl', p.code + '.jpg');
      fs.mkdirSync(path.dirname(doel), { recursive: true });
      await sharp(await kaart(plaat(p), 1080, 1350)).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
      await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, `berichten-nl-${p.code}.jpg`));
      console.log(`${p.code}  ${p.beeld.padEnd(10)} ✓`); n++;
    }
    console.log(`\n${n} doelgroepplaten`);
  })().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { PLATEN };
