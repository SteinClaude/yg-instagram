// Schrijft de map YG-GRAM op je bureaublad bij met de teksten uit
// teksten/berichten-nl.cjs, zodat het mapje hetzelfde zegt als wat er
// werkelijk gepost wordt.
//
//   node gereedschap/ygram-teksten.cjs
//
// Windows-tekstbestanden: UTF-8 met BOM en harde regeleindes, anders opent
// Kladblok ze met verminkte accenten.
const fs = require('fs'), path = require('path');

const teksten = require(path.join(__dirname, '..', 'teksten', 'berichten-nl.cjs'));
const YGRAM = "C:/Users/gijsm/OneDrive/Desktop/YG-GRAM";
const MAP3 = path.join(YGRAM, '3 - Standaardtekst');
const EIGEN = path.join(MAP3, 'Eigen tekst bij de uitgewerkte berichten B01 - B12', 'Nederlands');
const LIJN = '-'.repeat(64);

const schrijf = (bestand, regels) =>
  fs.writeFileSync(bestand, '\uFEFF' + regels.join('\n').replace(/\n/g, '\r\n'), 'utf8');

// --- de twaalf uitgewerkte berichten ----------------------------------------

const TITELS = {
  B01: 'De entree van uw bedrijf', B02: 'Wat kost een website', B03: 'Ordepartner',
  B04: 'Van eerste gesprek tot open deur', B05: 'Zie uw droomwebsite',
  B06: 'Drie vaste afspraken', B07: 'Onze eigen entree',
  B08: 'En wat kost het daarna nog', B09: 'Dezelfde bakker, drie sferen',
  B10: 'Herkenbaar, tot in de voettekst', B11: 'De telefoon in de hand',
  B12: 'Laat ons uw entree bouwen',
};

let n = 0;
for (const [nr, titel] of Object.entries(TITELS)) {
  schrijf(path.join(EIGEN, `${nr} - ${titel}.txt`), [
    `${nr} - ${titel.toUpperCase()}`, LIJN,
    'Hoort bij de plaat met hetzelfde nummer in map 2 / Nederlands.',
    'Kopieer alles tussen de lijnen.', LIJN, '',
    teksten[nr], '', LIJN, '',
  ]);
  n++;
}

// --- de dertien losse platen -------------------------------------------------

const LOS = {
  F01: 'Voor de kapper om de hoek', F02: 'Voor de coach met een volle agenda',
  F03: 'Voor het restaurant dat vol wil zitten', F04: 'Voor de vakman die liever bouwt dan typt',
  F05: 'Voor de winkel die ook s avonds open wil zijn', F06: 'Voor de praktijk waar mensen zich welkom voelen',
  F07: 'Voor de maker die zijn werk wil laten zien', F08: 'Voor het kantoor dat serieus genomen wil worden',
  F09: 'Voor iedereen met een bedrijf en te weinig tijd', F10: 'De entree van uw bedrijf',
  F11: 'Vaste prijs vooraf', F12: 'Antwoord binnen een werkdag', F13: 'Uw eerste ontwerp is gratis',
};

const losMap = path.join(MAP3, 'Tekst bij de losse platen F01 - F13');
fs.mkdirSync(losMap, { recursive: true });
for (const [nr, titel] of Object.entries(LOS)) {
  schrijf(path.join(losMap, `${nr} - ${titel}.txt`), [
    `${nr} - ${titel.toUpperCase()}`, LIJN,
    'Hoort bij de plaat met hetzelfde nummer in map 2 / Nederlands.',
    'Kopieer alles tussen de lijnen.', LIJN, '',
    teksten[nr], '', LIJN, '',
  ]);
  n++;
}

// --- de twaalf Engelse berichten, voor het tweede account ---------------------
// Deze stonden eerder alleen in de map en werden nooit opnieuw weggeschreven;
// daardoor bleef er een oud bedrag in staan nadat de bron al was aangepast.

const EN = require(path.join(__dirname, '..', 'platen', 'bijschriften-en.cjs'));
const schoonEN = s => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
const enMap = path.join(MAP3, 'Eigen tekst bij de uitgewerkte berichten B01 - B12', 'English');
for (const oud of fs.existsSync(enMap) ? fs.readdirSync(enMap) : []) {
  if (/^B\d\d .*\.txt$/.test(oud)) fs.unlinkSync(path.join(enMap, oud));
}
fs.mkdirSync(enMap, { recursive: true });
for (const b of EN) {
  const nr = 'B' + String(b.n).padStart(2, '0');
  schrijf(path.join(enMap, `${nr} - ${schoonEN(b.titel)}.txt`), [
    `${nr} - ${schoonEN(b.titel).toUpperCase()}`, LIJN,
    'Goes with the image of the same number in folder 2 / English.',
    'Copy everything between the lines.', LIJN, '',
    b.tekst.trim(), '', LIJN, '',
  ]);
  n++;
}

// --- het overzichtsbestand ---------------------------------------------------

schrijf(path.join(MAP3, 'LEES DIT - over de teksten.txt'), [
  'DE TEKSTEN ONDER JE BERICHTEN', LIJN, '',
  'Sinds 13 september 2026 heeft elke plaat een eigen tekst. Er is dus geen',
  'standaardtekst meer die overal onder past; dat leverde twaalf keer hetzelfde',
  'blok in je tijdlijn op, en dat leest niemand twee keer.', '',
  'Wat waar staat:', '',
  '  Eigen tekst bij de uitgewerkte berichten B01 - B12',
  '      de twaalf grote berichten, elk met een eigen verhaal',
  '  Tekst bij de losse platen F01 - F13',
  '      de negen doelgroepplaten en de vier merkplaten', '',
  'Je hoeft hier niets mee. De automaat plaatst deze teksten vanzelf onder de',
  'juiste plaat. Dit staat hier om terug te kunnen lezen, en om te kopieren als',
  'je zelf een keer iets met de hand plaatst.', '',
  'Wil je een tekst veranderen, doe dat dan op de planningspagina:',
  '  https://steinclaude.github.io/yg-instagram/',
  'Klik Wijzig bij het bericht, kies Tekst wijzigen. Binnen een minuut staat het',
  'in de planning. Dit mapje is dan verouderd; de pagina is leidend.', '',
  LIJN, '',
  'DE AFSPRAKEN WAAR DE TEKSTEN AAN VOLDOEN', LIJN, '',
  '  Op de plaat staat "u", in het bijschrift "je".',
  '      De plaat is de etalage en blijft netjes. De tekst eronder is een',
  '      gesprek, en daar praat je gewoon.', '',
  '  Elke plaat heeft een eigen openingszin.',
  '      Wie scrolt leest hooguit de eerste regel. Die moet dus over hem gaan,',
  '      niet over jou.', '',
  '  De oproep wisselt.',
  '      Doelgroepplaten sluiten af met de prijs, zonder aandrang. Merkplaten',
  '      sturen naar de link in je bio. Tips krijgen helemaal geen oproep,',
  '      anders is het geen tip maar reclame.', '',
  '  Geen emoji, geen uitroeptekens, geen haast.',
  '      Geen "nog drie plekken deze maand". Dat past niet bij een vaste prijs',
  '      vooraf, en het is het eerste waar mensen doorheen prikken.', '',
]);
n++;

// --- de hashtags -------------------------------------------------------------

schrijf(path.join(MAP3, 'Hashtags.txt'), [
  'HASHTAGS', LIJN, '',
  'Onder elke tekst staat al de juiste set. Wil je afwisselen, dan zijn dit ze',
  'allemaal. Tien tot vijftien is genoeg; dertig oogt wanhopig en levert niet',
  'meer op. Je mag ze ook in de eerste reactie zetten.', '',
  LIJN, '',
  'DOELGROEP', 'Bij de negen platen die met "Voor de ..." beginnen (F01 t/m F09).', '',
  teksten.F01.split('\n').pop(), '',
  LIJN, '',
  'MERK', 'Bij de vier merkplaten (F10 t/m F13) en bij bericht 1, 5, 9 en 12.', '',
  teksten.F10.split('\n').pop(), '',
  LIJN, '',
  'UITLEG', 'Bij bericht 2, 4, 6, 8, 10 en 11 - prijzen, werkwijze en tips.', '',
  teksten.B02.split('\n').pop(), '',
  LIJN, '',
  'WERK', 'Bij bericht 3 en 7 - als je laat zien wat je gemaakt hebt.', '',
  teksten.B03.split('\n').pop(), '',
  LIJN, '',
  'ENGELS', 'Onder elke Engelse plaat, zodra het tweede account er is.', '',
  '#webdesign #websitedesign #smallbusiness #entrepreneur #webdesigner #newwebsite #branding #businessowner #netherlands #expatsinthenetherlands #ygdigital #yourgateway', '',
]);
n++;

// de oude standaardteksten verdwijnen: er is geen tekst meer die overal past
for (const oud of ['STANDAARDTEKST - Nederlands.txt']) {
  const p = path.join(MAP3, oud);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log('verwijderd: ' + oud); }
}

console.log(n + ' tekstbestanden bijgewerkt in YG-GRAM.');
