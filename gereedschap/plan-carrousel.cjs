// Zet één goedgekeurde carrousel uit een plaatsingspakket in de planning (nieuwe contentlijn, vanaf 30 sep 2026).
//
//   node gereedschap/plan-carrousel.cjs <pakketmap> <datum> <tijd> <code> [--proef]
//   bv. node gereedschap/plan-carrousel.cjs "C:/.../pakket" 2026-10-06 19:00 K02 --proef
//
// Het pakket bevat <iets>-1.jpg ... <iets>-N.jpg (2 tot 10 platen, JPEG 1080 x 1350), bijschrift.txt en
// beeldbeschrijvingen.txt (per plaat een blok "1. Kop" + beschrijving, gescheiden door een lege regel).
// Wat het doet:
//   * controleert de platen, het bijschrift (tot 2200 tekens, tot 30 hashtags) en de alt-teksten (tot 1000 tekens);
//   * kopieert de platen naar beeld/berichten/nl/<code>-1.jpg ... en zet één item in planning.json;
//   * weigert als de code, de datum of het id al gebruikt is, of als er op dat moment al iets gepland staat.
// Alleen gebruiken na akkoord van Gijs op deze carrousel. Daarna committen en pushen; de automaat plaatst hem.
// Het item mag tot 18 uur te laat nog worden geplaatst (inhaaluren), omdat GitHub het uurschema soms uren overslaat.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const [map, datum, tijd, code] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PROEF = process.argv.includes('--proef');
const stop = m => { console.error('STOP: ' + m); process.exit(1); };
if (!map || !/^\d{4}-\d{2}-\d{2}$/.test(datum || '') || !/^\d{2}:\d{2}$/.test(tijd || '') || !/^[A-Z]\d{2}$/.test(code || '')) {
  stop('gebruik: node gereedschap/plan-carrousel.cjs <pakketmap> <jjjj-mm-dd> <uu:mm> <CODE, bv. K02> [--proef]');
}

(async () => {
  const lees = f => JSON.parse(fs.readFileSync(path.join(WORTEL, f), 'utf8'));
  const planning = lees('planning.json'), gedaan = lees('gedaan.json');
  const id = `${datum}-bericht-${code.toLowerCase()}`;
  if ([...planning.items, ...gedaan.items].some(i => i.id === id)) stop(`id ${id} bestaat al`);
  if (planning.items.some(i => i.datum === datum && i.tijd === tijd)) stop(`op ${datum} ${tijd} staat al iets gepland`);
  if (fs.readdirSync(path.join(WORTEL, 'beeld/berichten/nl')).some(f => f.startsWith(code + '-') || f === code + '.jpg')) stop(`code ${code} is al in gebruik`);

  // platen: bestanden die eindigen op -<nummer>.jpg, op nummer gesorteerd
  const platen = fs.readdirSync(map).map(f => ({ f, n: +(f.match(/-(\d+)\.jpe?g$/i) || [])[1] })).filter(p => p.n).sort((a, b) => a.n - b.n);
  if (platen.length < 2 || platen.length > 10) stop(`een carrousel heeft 2 tot 10 platen nodig, gevonden: ${platen.length}`);
  platen.forEach((p, i) => { if (p.n !== i + 1) stop(`nummering loopt niet door: ${p.f}`); });
  const beeld = [];
  for (const p of platen) {
    const bron = path.join(map, p.f), m = await sharp(bron).metadata();
    if (m.format !== 'jpeg' || m.width !== 1080 || m.height !== 1350) stop(`${p.f} is ${m.format} ${m.width}x${m.height}, verwacht jpeg 1080x1350`);
    const rel = `berichten/nl/${code}-${p.n}.jpg`;
    const h = crypto.createHash('sha256').update(fs.readFileSync(bron)).digest('hex').slice(0, 12);
    console.log(`plaat ${p.n}: ${p.f} -> beeld/${rel} (${fs.statSync(bron).size} bytes, sha ${h})`);
    if (!PROEF) fs.copyFileSync(bron, path.join(WORTEL, 'beeld', rel));
    beeld.push(rel);
  }

  const tekstUit = f => fs.readFileSync(path.join(map, f), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const tekst = tekstUit('bijschrift.txt').replace(/\s+$/, '');
  const tags = (tekst.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (!tekst) stop('bijschrift.txt is leeg');
  if (tekst.length > 2200) stop(`bijschrift is ${tekst.length} tekens (max 2200)`);
  if (tags > 30) stop(`bijschrift heeft ${tags} hashtags (max 30)`);

  let alt = [];
  if (fs.existsSync(path.join(map, 'beeldbeschrijvingen.txt'))) {
    alt = tekstUit('beeldbeschrijvingen.txt').trim().split(/\n\s*\n/)
      .map(b => b.replace(/^\d+\.\s*/, '').split('\n').map(s => s.trim()).filter(Boolean).join(' '));
    if (alt.length !== platen.length) stop(`${alt.length} beeldbeschrijvingen voor ${platen.length} platen`);
    alt.forEach((a, i) => { if (a.length > 1000) stop(`alt-tekst ${i + 1} is ${a.length} tekens (max 1000)`); });
  } else console.log('let op: geen beeldbeschrijvingen.txt, dus geen alt-teksten');

  const item = { id, datum, tijd, soort: 'bericht', taal: 'nl', beeld, titel: `Carrousel ${code}: ${tekst.split('\n')[0].slice(0, 60)}`,
    tekst, alt, inhaaluren: 18, eenmalig: true };
  console.log(`\nitem ${id} op ${datum} ${tijd}: ${beeld.length} platen, bijschrift ${tekst.length} tekens en ${tags} hashtags, alt-teksten ${alt.map(a => a.length).join('/') || 'geen'}`);
  console.log('\nBIJSCHRIFT:\n' + tekst);
  if (PROEF) return console.log('\n(proef: niets geschreven)');
  planning.items.push(item);
  planning.items.sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));
  fs.writeFileSync(path.join(WORTEL, 'planning.json'), JSON.stringify(planning, null, 2) + '\n', 'utf8');
  console.log(`\nplanning.json bijgewerkt. Nu committen en pushen:\n  git add planning.json beeld/berichten/nl/${code}-*.jpg`);
})().catch(e => stop(e.message));
