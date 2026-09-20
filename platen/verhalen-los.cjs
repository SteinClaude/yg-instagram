// Losse verhalen: veertien vragen die ondernemers stellen, met het antwoord erbij.
// Deze platen worden ALLEEN een verhaal (1080x1920). Geen bericht-versie — een
// verhaal is na 24 uur weg, een bericht blijft in het raster staan, en dezelfde
// zin op beide plekken is wat het account vorige maand saai maakte.
//
// Geen enkel onderwerp hier staat ook in platen/rijen.cjs. Dat is de regel.
//
//   node platen/verhalen-los.cjs        alles renderen naar beeld/ en mini/
//   node platen/verhalen-los.cjs V41    alleen die ene
//
// Nummering: V39 t/m V52, in plaatsingsvolgorde.
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// Op de plaat "u"; de vraag is hoe een ondernemer hem zelf zou stellen.
const VRAGEN = [
  { vraag: 'Ik heb al een site.',
    kort: 'Dan kijken we eerst of die te redden is.',
    antwoord: 'Soms is opknappen genoeg en is opnieuw bouwen zonde van uw geld. Dat zeggen wij dan ook.' },

  { vraag: 'Kan ik er later zelf in?',
    kort: 'Ja, daar bouwen wij het op.',
    antwoord: 'Een tekst, een foto of een openingstijd aanpassen doet u zelf. Zonder ons te bellen en zonder rekening.' },

  { vraag: 'Ik heb geen logo.',
    kort: 'Dan maken wij er een.',
    antwoord: 'Logo, kleur en letter als één geheel — op uw site, uw drukwerk en uw social media.' },

  { vraag: 'Ik heb geen teksten.',
    kort: 'U vertelt, wij schrijven.',
    antwoord: 'U hoeft niet achter een lege pagina te gaan zitten. U leest na wat wij maken en zegt wat er anders moet.' },

  { vraag: 'Ik heb geen goede foto’s.',
    kort: 'We kijken eerst wat u heeft.',
    antwoord: 'Vaak is er meer bruikbaars dan u denkt. Wat ontbreekt, vullen we aan.' },

  { vraag: 'Werkt u ook buiten Alkmaar?',
    kort: 'Wij werken door heel Nederland.',
    antwoord: 'Het gesprek kan bij u aan tafel of gewoon via het scherm. Dat maakt voor het werk niets uit.' },

  { vraag: 'Moet ik zelf iets technisch doen?',
    kort: 'Nee.',
    antwoord: 'Domeinnaam, hosting en e-mail regelen wij. U hoeft nergens een instelling op te zoeken.' },

  { vraag: 'Ben ik te klein voor een eigen site?',
    kort: 'Nee.',
    antwoord: 'Eén pagina die klopt is meer waard dan vijf pagina’s die niemand leest. Klein mag, slordig niet.' },

  { vraag: 'Mijn site staat slecht op de telefoon.',
    kort: 'Daar beginnen wij juist.',
    antwoord: 'De meeste bezoekers komen binnen op een klein scherm. Wij ontwerpen dat scherm als eerste, niet als laatste.' },

  { vraag: 'Waarom zou ik het niet zelf bouwen?',
    kort: 'Dat kan prima.',
    antwoord: 'Het kost u alleen meestal meer avonden dan u vooraf denkt. Wij doen het overdag, en dan is het af.' },

  { vraag: 'Wat als ik later wil uitbreiden?',
    kort: 'Dan groeit de site mee.',
    antwoord: 'Een pagina erbij, een webshop of een app: dat kan altijd. U hoeft niet opnieuw te beginnen.' },

  { vraag: 'Hoe weet u wat mijn klanten zoeken?',
    kort: 'Dat vragen wij u.',
    antwoord: 'U kent uw vak en uw klanten. Wij weten wat er op een scherm werkt. Samen is dat genoeg.' },

  { vraag: 'Kan ik ergens zien hoe het wordt?',
    kort: 'Ja, op onze eigen site.',
    antwoord: 'In de ontwerpstudio ziet u in vijf minuten uw eigen bedrijf in vier sferen. Kost niets en verplicht niets.' },

  { vraag: 'Hoe meld ik mij aan?',
    kort: 'Bellen, mailen of het formulier.',
    antwoord: 'U hoort binnen één werkdag van ons, en u spreekt daarna altijd dezelfde persoon.' },
];

const V_START = 39;
const nr = n => String(n).padStart(2, '0');
const codeV = i => `V${nr(V_START + i)}`;

// Achtergrond per verhaal: de branchebeelden uit bron/ai. Echte ruimtes met
// diepte, in dezelfde stijl als de rij "Voor wie wij bouwen" — dat is wat Gijs
// goed vindt en het is al betaald beeld. Tien beelden op veertien verhalen, dus
// vier komen twee keer voor; een verhaal is na 24 uur weg, dus dat valt niet op.
const ACHTERGROND = [
  'kantoor',       // Ik heb al een site.
  'winkel',        // Kan ik er later zelf in?
  'maker',         // Ik heb geen logo.
  'coach',         // Ik heb geen teksten.
  'restaurant',    // Ik heb geen goede foto's.
  'tijd',          // Werkt u ook buiten Alkmaar?
  'praktijk',      // Moet ik zelf iets technisch doen?
  'kapper',        // Ben ik te klein voor een eigen site?
  'vakman',        // Mijn site staat slecht op de telefoon.
  'kapper-staand', // Waarom zou ik het niet zelf bouwen?
  'winkel',        // Wat als ik later wil uitbreiden?
  'restaurant',    // Hoe weet u wat mijn klanten zoeken?
  'coach',         // Kan ik ergens zien hoe het wordt?
  'kantoor',       // Hoe meld ik mij aan?
];

// Beelden die onderin licht zijn; daar verdwijnt witte tekst in. Dieper zetten.
const DIEPER = { schets: 0.58, contact: 0.64, onderhoud2: 0.68, teksten2: 0.68, tablet: 0.72, apps: 0.72, typen: 0.74, studio: 0.78 };

const plaat = (v, i) => ({
  achtergrond: { bron: `ai/${ACHTERGROND[i]}.jpg`, helderheid: DIEPER[ACHTERGROND[i]] ?? 0.86, verzadiging: 0.9, donkerte: 0.94, positie: 'centre' },
  uitlijn: 'onder',
  veilig: true,                       // Instagram legt boven- en onderin zijn eigen balken over het beeld
  blokken: [
    { t: 'lijn' },
    { t: 'boven', tekst: 'U vraagt ons' },
    { t: 'kop', tekst: v.vraag, grootte: 68, marge: 34 },
    { t: 'tekst', tekst: v.kort, grootte: 40, marge: 26 },
    { t: 'tekst', tekst: v.antwoord, grootte: 31 },
  ],
});

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { VRAGEN, codeV };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const [i, v] of VRAGEN.entries()) {
      if (alleen && codeV(i) !== alleen) continue;
      await bewaar(await kaart(plaat(v, i), 1080, 1920), `verhalen/nl/${codeV(i)}.jpg`);
      console.log(`${codeV(i)}  ${ACHTERGROND[i].padEnd(12)} ${v.vraag}`); n++;
    }
    console.log(`\n${n} verhaalplaten in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
