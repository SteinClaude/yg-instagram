// Maakt de kleine plaatjes voor het dashboard: alles in beeld/ wordt 260 pixels
// breed weggeschreven naar mini/, met het pad platgeslagen tot streepjes,
// want index.html zoekt ze op als mini/verhalen-nl-V01.jpg.
//
//   node gereedschap/miniaturen.cjs
//
// sharp staat niet in deze repo (die houden we zonder pakketten); we lenen hem
// uit de website-map ernaast.
const fs = require('fs'), path = require('path');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld');
const MINI = path.join(WORTEL, 'mini');
const BREEDTE = 260;

fs.mkdirSync(MINI, { recursive: true });

function alles(map, voor = '') {
  return fs.readdirSync(map, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? alles(path.join(map, d.name), voor + d.name + '/')
                    : d.name.endsWith('.jpg') ? [voor + d.name] : []);
}

(async () => {
  const platen = alles(BEELD);
  let nieuw = 0, bestond = 0;
  for (const p of platen) {
    const doel = path.join(MINI, p.replace(/\//g, '-'));
    if (fs.existsSync(doel)) { bestond++; continue; }
    await sharp(path.join(BEELD, p)).resize({ width: BREEDTE }).jpeg({ quality: 72 }).toFile(doel);
    nieuw++;
  }
  console.log(`${platen.length} platen bekeken: ${nieuw} nieuw, ${bestond} stonden er al.`);
})();
