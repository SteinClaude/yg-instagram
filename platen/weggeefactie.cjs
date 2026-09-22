// De weggeefactie van najaar 2026: een complete website t.w.v. € 1.000, uitslag
// 1 november. Twee platen, allebei op dezelfde achtergrond (de openstaande deur):
//
//   V53  het verhaal (1080x1920) — staat los, krijgt geen bijschrift onder zich
//   F35  het bericht (1080x1350) — het bijschrift staat in teksten/weggeefactie-nl.cjs
//
// Ze delen bewust geen enkele zin. Dat is de regel uit gereedschap/plan-14-dagen.cjs:
// een onderwerp staat óf in een bericht óf in een verhaal, nooit twee keer hetzelfde.
// Hier staat het onderwerp wel op beide plekken — het is één aankondiging — maar dan
// met een andere ingang en andere woorden.
//
// Eigen bestand met een eigen nummer, niet in voorraad.cjs of rijen.cjs: daar volgen
// de codes uit de positie in de array, dus één regel ertussen verschuift alles erna.
//
//   node platen/weggeefactie.cjs        allebei renderen naar beeld/ en mini/
//   node platen/weggeefactie.cjs V53    alleen die ene
//
// LET OP: er wordt niet geloot. Dit is een jurykeuze op vooraf gepubliceerde criteria,
// en dat is een juridische keuze, geen stijlkeuze. Bij een loting is dit een
// promotioneel kansspel en kost een prijs van € 1.000 aan kansspelbelasting
// € 607,72 (37,8% over € 1.000 × 100/62,2, art. 5 Wet KSB). Schrijf daarom nergens
// "maak kans", "win", "trekking" of "verloting" — ook niet tussen finalisten.
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// De deur die openstaat met licht erachter. Gekozen boven de gesloten voordeur
// (die zegt het tegenovergestelde) en boven de lunchroom (te druk onder tekst).
const ACHTERGROND = {
  bron: 'ai/deur.jpg', helderheid: 0.80, verzadiging: 0.9, donkerte: 0.90, positie: 'centre',
};

// Meta eist deze zin letterlijk bij elke actie-uiting; parafraseren mag niet.
// Onder het verhaal komt geen bijschrift, dus hij moet op de plaat zelf staan.
const META = 'Deze actie wordt op geen enkele wijze gesponsord, onderschreven of '
  + 'beheerd door, of geassocieerd met, Instagram.';

// Op de plaat staat "u"; in het bijschrift staat "je". Zie teksten/berichten-nl.cjs.
//
// Het verhaal en het bericht delen geen woordreeks van vier of langer. Het verhaal
// gaat over de mijlpaal (honderd volgers, daar hoort iets tegenover te staan), het
// bericht over de actie zelf. Wie ze allebei ziet, leest geen twee keer hetzelfde.
const PLATEN = [
  {
    code: 'V53', map: 'verhalen/nl', breed: 1080, hoog: 1920, veilig: true,
    boven: 'Honderd volgers',
    kop: 'Wij doen er iets\nvoor terug.',
    // Geen exact getal op de plaat: het account groeit snel (93 op 20 sep, 168 op
    // 22 sep) en een getal is binnen een week achterhaald. 'Meer dan honderd'
    // blijft kloppen. Deelt ook geen woordreeks van vier met het bijschrift.
    tekst: 'Er volgen nu meer dan honderd mensen dit account. Geen groot getal, '
      + 'maar wel allemaal mensen die iets van ons wilden zien. Een bedankje leek '
      + 'ons te weinig.',
    tekst2: 'Wij bouwen een hele website voor iemand, kosteloos. Hoe u meedoet en '
      + 'waarop wij kiezen, leest u in ons bericht.',
    klein: META,
  },
  {
    code: 'F35', map: 'berichten/nl', breed: 1080, hoog: 1350, veilig: false,
    boven: 'Onze weggeefactie · najaar 2026',
    kop: 'Eén website,\nzonder rekening.',
    tekst: "Zeven pagina's, de teksten en een logo: bij ons samen € 1.000 excl. btw. "
      + 'Wij lezen elke inzending zelf en kiezen er één uit. Insturen kan tot en met '
      + '30 oktober.',
    tekst2: null,
    klein: null,
  },
];

const plaat = p => ({
  achtergrond: ACHTERGROND,
  uitlijn: 'onder',
  veilig: p.veilig,
  blokken: [
    { t: 'lijn' },
    { t: 'boven', tekst: p.boven },
    { t: 'kop', tekst: p.kop, grootte: p.hoog > 1500 ? 76 : 62, marge: p.hoog > 1500 ? 36 : 30 },
    // De marges zijn met de hand afgesteld: bij regelhoogte 1,6 loopt een marge
    // onder de 40 optisch samen met de regelafstand en lezen twee alinea's als een.
    { t: 'tekst', tekst: p.tekst, grootte: p.hoog > 1500 ? 31 : 28, marge: p.tekst2 ? 46 : (p.klein ? 40 : undefined) },
    p.tekst2 ? { t: 'tekst', tekst: p.tekst2, grootte: 29, marge: p.klein ? 40 : undefined } : null,
    // De kleine letter: een juridische regel, dus ook klein gezet.
    p.klein ? { t: 'tekst', tekst: p.klein, grootte: 18, max: 760 } : null,
  ].filter(Boolean),
});

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 })
    .toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { PLATEN };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const p of PLATEN) {
      if (alleen && p.code !== alleen) continue;
      await bewaar(await kaart(plaat(p), p.breed, p.hoog), `${p.map}/${p.code}.jpg`);
      console.log(`${p.code}  ${p.breed}x${p.hoog}  ${p.kop.replace(/\n/g, ' ')}`); n++;
    }
    console.log(`\n${n} plaat(en) in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
