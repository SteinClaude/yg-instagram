// Zet de platen van de weggeefactie klaar in Bureaublad\Doorsturen, met het
// bijschrift erbij.
//
// Er waren twee uitvoeringen; Gijs koos op 22 september de lichte. De donkere is
// daarna weggehaald, zodat er bij het plaatsen niet per ongeluk de verkeerde
// tussenuit gepakt wordt.
//
//   node gereedschap/actie-doorsturen.cjs
const fs = require('fs'), path = require('path');
const w = require('../teksten/weggeefactie-nl.cjs');

const WORTEL = path.join(__dirname, '..');
const DOEL = 'C:/Users/gijsm/OneDrive/Desktop/Doorsturen';
fs.mkdirSync(DOEL, { recursive: true });

const BESTANDEN = [
  ['beeld/berichten/nl/A35.jpg', 'weggeefactie-BERICHT.jpg', 'het bericht, 4:5 \u2014 voor je raster'],
  ['beeld/verhalen/nl/W53.jpg', 'weggeefactie-VERHAAL.jpg', 'het verhaal, 9:16 \u2014 voor je stories'],
];

for (const [van, naam, wat] of BESTANDEN) {
  const bron = path.join(WORTEL, van);
  if (!fs.existsSync(bron)) { console.error('MIST: ' + bron); process.exit(1); }
  fs.copyFileSync(bron, path.join(DOEL, naam));
  console.log('  ' + naam.padEnd(28) + String(Math.round(fs.statSync(bron).size / 1024) + ' kB').padStart(8) + '  ' + wat);
}

const bijschrift = Array.isArray(w.F35) ? w.F35.join('\n\n') : w.F35;

const blad = [
  'DE WEGGEEFACTIE',
  'YG Digital \u00b7 22 september 2026',
  '',
  'Twee bestanden, allebei gebruiken:',
  '',
  '  weggeefactie-BERICHT.jpg   4:5    het bericht voor je raster',
  '  weggeefactie-VERHAAL.jpg   9:16   het verhaal voor je stories',
  '',
  'Ze horen zichtbaar bij elkaar: zelfde plaat, zelfde zegel. Plaats het bericht',
  'eerst en zet daarna het verhaal erbij, zodat wie je verhaal ziet weet waar hij',
  'het bericht kan vinden.',
  '',
  'WACHT TOT DE TELLER OP 200 STAAT. Op de plaat staat dat je door de 200 volgers',
  'bent. Wie aan een weggeefactie meedoet klikt op je profiel en telt mee.',
  '',
  'LET OP bij het verhaal: onderaan staat in kleine letters de verplichte zin dat',
  'Instagram niets met de actie te maken heeft. Een verhaal heeft geen bijschrift,',
  'dus die moet daar staan. Niet wegsnijden bij het bijsnijden.',
  '',
  'EN: er wordt niet geloot. Schrijf nergens "win", "maak kans", "trekking" of',
  '"verloting", ook niet in je reacties. Dat is een juridische keuze, geen',
  'stijlkeuze: bij een loting is dit een promotioneel kansspel en kost een prijs',
  'van \u20ac 1.000 je \u20ac 607,72 aan kansspelbelasting.',
  '',
  'De op een na laatste alinea hieronder ("Staat de teller op 1 december nog niet',
  'op 500...") is het vangnet. Zonder die zin wacht iemand die heeft ingestuurd op',
  'een uitslag die misschien nooit komt. Schrappen mag, maar dan weet je het.',
  '',
  '='.repeat(66),
  'HET BIJSCHRIFT ONDER HET BERICHT',
  '='.repeat(66),
  '',
  bijschrift,
  '',
];

const tekstbestand = path.join(DOEL, 'weggeefactie.txt');
fs.writeFileSync(tekstbestand, '\uFEFF' + blad.join('\r\n'), 'utf8');
console.log('\n  weggeefactie.txt  ' + Math.round(fs.statSync(tekstbestand).size / 1024) + ' kB');
console.log('\nklaar in ' + DOEL);
