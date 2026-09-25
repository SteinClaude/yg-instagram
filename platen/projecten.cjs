// Afsluitplaat voor de highlight Projecten (verhaal 3): donkere plaat in de
// huisstijl met de goedgekeurde tekst uit PROJECTEN-OPDRACHT.md (25 sep 2026).
// Ordepartner herkenbaar als projectnaam; geen claim "gebouwd in één werkdag".
//
//   node platen/projecten.cjs   -> beeld/highlights/projecten/P03.jpg (kaal, gecentreerd)
//                                  beeld/highlights/projecten/P03-beeld.jpg (met een gedempt
//                                  beeld uit de magazijnclip als achtergrond) + mini's
const fs = require('fs'), path = require('path');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const { kaart } = require('./maak.cjs');

const WORTEL = path.join(__dirname, '..');
const UIT = path.join(WORTEL, 'beeld', 'highlights', 'projecten');
const MINI = path.join(WORTEL, 'mini');

const blokken = [
  { t: 'lijn' },
  { t: 'boven', tekst: 'Project \u00b7 Ordepartner, Alkmaar' },
  { t: 'kop', tekst: 'Van logo tot\ncomplete website.', grootte: 88, marge: 40 },
  { t: 'tekst', tekst: 'Een herkenbare uitstraling, heldere teksten en negen pagina\u2019s.', grootte: 36, marge: 44 },
  { t: 'tekst', tekst: 'Ook een sterke entree voor uw bedrijf?', grootte: 36, marge: 16 },
  { t: 'boven', tekst: 'Bekijk de link in onze bio' },
];

const varianten = {
  // A: kaal en gecentreerd, embleem boven en yg-digital.nl onder op de vaste plekken
  'P03': { veilig: true, blokken },
  // B: hetzelfde, op een gedempt beeld uit de magazijnclip (verhaal 1), tekst onderin
  //    zoals bij de verhalen met een foto
  'P03-beeld': {
    achtergrond: { bron: 'ai/magazijn.jpg', helderheid: 0.62, verzadiging: 0.85, donkerte: 0.94, positie: 'centre' },
    uitlijn: 'onder', veilig: true, blokken,
  },
};

(async () => {
  fs.mkdirSync(UIT, { recursive: true }); fs.mkdirSync(MINI, { recursive: true });
  for (const [naam, plaat] of Object.entries(varianten)) {
    const png = await kaart(plaat, 1080, 1920);
    const doel = path.join(UIT, naam + '.jpg');
    await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
    await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, `highlights-projecten-${naam}.jpg`));
    console.log(`${naam} -> ${doel}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
