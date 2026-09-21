// Zet de zes berichten die Gijs zelf plaatst klaar in Bureaublad\Doorsturen,
// genummerd in plaatsingsvolgorde, met alle bijschriften in één tekstbestand.
//
// Waarom met de hand en niet via de automaat: Gijs wil de volgorde en het moment
// zelf bepalen, en bij een reel die hij zelf uploadt kan hij de muziekbibliotheek
// van Instagram gebruiken. Dat kan de API nooit. Daarom staan R15 en R16 op stil.
//
//   node gereedschap/doorsturen.cjs
const fs = require('fs'), path = require('path');
const { VOLGORDE, bijschrift } = require('../teksten/los-nl.cjs');

const WORTEL = path.join(__dirname, '..');
const DOEL = 'C:/Users/gijsm/OneDrive/Desktop/Doorsturen';

const BRON = code => code.startsWith('R')
  ? { van: path.join(WORTEL, 'beeld', 'reels', code + '.mp4'), ext: '.mp4', wat: 'video' }
  : { van: path.join(WORTEL, 'beeld', 'berichten', 'nl', code + '.jpg'), ext: '.jpg', wat: 'foto' };

const OMSCHRIJVING = {
  U01: 'uitspraak · de deur waardoor klanten binnenkomen',
  R15: 'video · de voordeur bij schemer (stil, kies zelf muziek in de app)',
  U02: 'uitspraak · open wanneer jij dicht bent',
  F37: 'bericht · wat kost een website',
  R16: 'video · het bordje dat op OPEN draait (stil, kies zelf muziek in de app)',
  F36: 'bericht · de ontwerpstudio, nu met een volledig scherm',
};

fs.mkdirSync(DOEL, { recursive: true });

const streep = '='.repeat(66);
const blad = [
  'DE ZES BERICHTEN DIE JE ZELF PLAATST',
  'YG Digital \u00b7 21 september 2026',
  '',
  'Plaats ze in deze volgorde, van 1 naar 6. Dan komt je raster er zo uit te zien,',
  'met allebei de video\u2019s in het midden van hun rij:',
  '',
  '    F36 studio    R16 video     F37 prijs        <- de bovenste rij',
  '    U02 uitspraak R15 video     U01 uitspraak',
  '    F28           F27           F26              <- die staan er al, of komen nog',
  '',
  'Wacht met nummer 1 tot F27 (dinsdag) en F28 (woensdag) geplaatst zijn, anders',
  'schuift de onderste rij en klopt de opbouw niet meer.',
  '',
  'De twee video\u2019s hebben expres GEEN muziek in het bestand. Kies in de app een',
  'nummer uit de muziekbibliotheek van Instagram; dat klinkt beter en het mag van',
  'Instagram alleen als je zelf uploadt.',
  '',
];

for (let i = 0; i < VOLGORDE.length; i++) {
  const code = VOLGORDE[i];
  const { van, ext, wat } = BRON(code);
  if (!fs.existsSync(van)) { console.error('MIST: ' + van); process.exit(1); }
  const naam = (i + 1) + '-' + code + ext;
  fs.copyFileSync(van, path.join(DOEL, naam));
  const kb = Math.round(fs.statSync(van).size / 1024);
  console.log('  ' + naam.padEnd(12) + String(kb + ' kB').padStart(8) + '  ' + OMSCHRIJVING[code]);
  blad.push(streep, (i + 1) + '. ' + naam + '   \u2014   ' + OMSCHRIJVING[code], streep, '', bijschrift(code), '');
}

const tekstbestand = path.join(DOEL, 'bijschriften-zes-berichten.txt');
/* BOM en CRLF, anders verminkt Kladblok de euro-tekens */
fs.writeFileSync(tekstbestand, '\uFEFF' + blad.join('\r\n'), 'utf8');
console.log('\n  bijschriften-zes-berichten.txt  ' + Math.round(fs.statSync(tekstbestand).size / 1024) + ' kB');
console.log('\nklaar in ' + DOEL);
