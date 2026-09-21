// Zet de platen van de weggeefactie klaar in Bureaublad\Doorsturen, in twee
// uitvoeringen, met het bijschrift erbij.
//
//   node gereedschap/actie-doorsturen.cjs
const fs = require('fs'), path = require('path');
const w = require('../teksten/weggeefactie-nl.cjs');

const WORTEL = path.join(__dirname, '..');
const DOEL = 'C:/Users/gijsm/OneDrive/Desktop/Doorsturen';
fs.mkdirSync(DOEL, { recursive: true });

const BESTANDEN = [
  ['beeld/berichten/nl/A35.jpg', 'actie-A-licht-bericht.jpg', 'A \u00b7 licht \u00b7 bericht 4:5'],
  ['beeld/verhalen/nl/W53.jpg', 'actie-A-licht-verhaal.jpg', 'A \u00b7 licht \u00b7 verhaal 9:16'],
  ['beeld/berichten/nl/B35.jpg', 'actie-B-donker-bericht.jpg', 'B \u00b7 donker \u00b7 bericht 4:5'],
  ['beeld/verhalen/nl/X53.jpg', 'actie-B-donker-verhaal.jpg', 'B \u00b7 donker \u00b7 verhaal 9:16'],
];

for (const [van, naam, wat] of BESTANDEN) {
  const bron = path.join(WORTEL, van);
  if (!fs.existsSync(bron)) { console.error('MIST: ' + bron); process.exit(1); }
  fs.copyFileSync(bron, path.join(DOEL, naam));
  console.log('  ' + naam.padEnd(30) + String(Math.round(fs.statSync(bron).size / 1024) + ' kB').padStart(8) + '  ' + wat);
}

const bijschrift = Array.isArray(w.F35) ? w.F35.join('\n\n') : w.F35;

const blad = [
  'DE WEGGEEFACTIE \u2014 TWEE UITVOERINGEN',
  'YG Digital \u00b7 21 september 2026',
  '',
  'De eerste plaat leek op al je andere berichten: donkere deur, gouden labeltje,',
  'serif-kop onderaan. Op een miniatuur zag niemand dat er iets bijzonders stond.',
  '',
  'A \u00b7 LICHT   ivoor met het medaillon groot erop. Tussen donkere tegels springt',
  '            deze er meteen uit. Dit is mijn voorstel.',
  'B \u00b7 DONKER  dezelfde deur als eerst, met het medaillon als zegel erop. Blijft',
  '            dichter bij de rest, maar valt op je raster veel minder op.',
  '',
  'Bij allebei hoort een bericht (4:5) en een verhaal (9:16) met dezelfde plaat,',
  'zodat het verhaal en het bericht bij elkaar horen.',
  '',
  'LET OP bij het verhaal: daar staat de verplichte zin over Instagram OP de plaat,',
  'want een verhaal heeft geen bijschrift. Bij het bericht staat hij in de tekst',
  'hieronder. Niet weglaten.',
  '',
  'EN: er wordt niet geloot. Schrijf nergens "win", "maak kans", "trekking" of',
  '"verloting". Dat is een juridische keuze, geen stijlkeuze: bij een loting is dit',
  'een promotioneel kansspel en kost een prijs van \u20ac 1.000 je \u20ac 607,72 aan',
  'kansspelbelasting.',
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
