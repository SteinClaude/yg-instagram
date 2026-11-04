// Haalt een vrij beeld van Wikimedia Commons voor een short van kanaal 2, verkleint het tot hoogstens 1600 px (jpg) en
// schrijft de licentie erbij. Alleen publiek domein, CC0 of CC BY (geen CC BY-SA, geen niet-vrije beelden).
//   node gereedschap/short/beeld.cjs <pakketmap> <nr> "File:Naam.jpg"
//     -> pakketten/<pakketmap>/bron/beeld-<nr>.jpg en een regel in bron/beelden.json (titel, licentie, maker, url)
// Commons vraagt een eigen user-agent; daarom curl met een herkenbare naam (geen browser-naam).
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const sharp = require('sharp');
const UA = 'yg-social-manon/1.0 (YouTube shorts research)';
const WORTEL = path.join(__dirname, '..', '..');
const VRIJ = /^(public domain|pd|cc0|cc by(?!-sa)( \d(\.\d)?)?$|cc-by-\d|no restrictions)/i;

const haal = url => execFileSync('curl', ['-sL', '--max-time', '60', '-A', UA, url], { maxBuffer: 200 * 1024 * 1024 });
const kaal = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function main() {
  const [map, nr, titel] = process.argv.slice(2);
  if (!map || !nr || !titel) { console.error('gebruik: node gereedschap/short/beeld.cjs <pakketmap> <nr> "File:Naam.jpg"'); process.exit(1); }
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titel)}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`;
  const pag = Object.values(JSON.parse(haal(api).toString()).query.pages)[0];
  if (!pag.imageinfo) throw new Error('niet gevonden op Commons: ' + titel);
  const ii = pag.imageinfo[0], md = ii.extmetadata || {};
  const licentie = kaal(md.LicenseShortName && md.LicenseShortName.value);
  if (!VRIJ.test(licentie) || /sa/i.test(licentie)) throw new Error(`licentie "${licentie}" is niet vrij genoeg (alleen PD, CC0, CC BY)`);
  const bron = haal(ii.thumburl || ii.url);
  const doel = path.join(WORTEL, 'pakketten', map, 'bron', `beeld-${nr}.jpg`);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(bron).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 86 }).toFile(doel);
  const lijst = path.join(path.dirname(doel), 'beelden.json');
  const alles = fs.existsSync(lijst) ? JSON.parse(fs.readFileSync(lijst, 'utf8')) : {};
  alles[`beeld-${nr}.jpg`] = { titel, licentie, maker: kaal(md.Artist && md.Artist.value), credit: kaal(md.Credit && md.Credit.value),
    pagina: ii.descriptionurl, origineel: `${ii.width}x${ii.height}`, opgehaald: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(lijst, JSON.stringify(alles, null, 2) + '\n');
  console.log(`beeld-${nr}.jpg · ${licentie} · ${alles[`beeld-${nr}.jpg`].maker}`);
}
main().catch(e => { console.error(e.message); process.exit(1); });
