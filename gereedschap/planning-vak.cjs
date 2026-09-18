// Bouwt de planning vanaf maandag 21 september 2026 opnieuw op met de nieuwe
// voorraad: de vak-beelden (V27-V38 als verhaal, F14-F25 als bericht), de reels
// (R01-R08) en de carrousel B13, naast de bestaande merkverhalen, tips en
// uitgewerkte berichten. Alles vóór de startdatum blijft staan.
//
//   node gereedschap/planning-vak.cjs            laat zien wat het wordt
//   node gereedschap/planning-vak.cjs --doen     schrijft planning.json
//
// Ritme (vastgelegd 13 sep): verhalen ma 07:00, di 12:00, wo 19:00 (tip), do 08:00,
// vr 16:00; berichten di 20:00 (om de week een reel, anders uitgewerkt) en do 11:00
// (fotobericht over ons vak).
const fs = require('fs'), path = require('path');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const basis = require('../teksten/berichten-nl.cjs');
const vak = require('../teksten/vak-nl.cjs');

const START = '2026-09-21', WEKEN = 11;
const DOEN = process.argv.includes('--doen');
const nr = n => String(n).padStart(2, '0');

const planning = JSON.parse(fs.readFileSync(PLANNING, 'utf8'));
let inLogboek = [];
try { inLogboek = JSON.parse(fs.readFileSync(path.join(WORTEL, 'gedaan.json'), 'utf8')).items.map(i => i.id); } catch { /* geen logboek */ }

// ---- wat er blijft ------------------------------------------------------------
// Ook alles wat als eenmalig is gemarkeerd blijft staan (losse extra's en items
// die Gijs zelf heeft verzet), anders zou een herbouw zijn wijzigingen wissen.
const behouden = planning.items.filter(i => i.datum < START || i.eenmalig);
// het verhaal van vrijdag 18 september was nog een stockfoto; dat wordt de deur
for (const i of behouden) if (i.id === '2026-09-18-verhaal') i.beeld = ['verhalen/nl/V30.jpg'];

// ---- de voorraad --------------------------------------------------------------
const VAK_V = [...Array(12)].map((_, i) => `verhalen/nl/V${nr(27 + i)}.jpg`);
const MERK_V = [...Array(6)].map((_, i) => `verhalen/nl/V${nr(1 + i)}.jpg`);
const TIP_V = [...Array(7)].map((_, i) => `verhalen/nl/V${nr(7 + i)}.jpg`);
const FOTO_B = [...Array(12)].map((_, i) => `F${nr(14 + i)}`);
// R06 (de teksten) niet in dezelfde week als F24 (ook de teksten); daarom R07 ervoor.
const REELS = ['R01', 'R02', 'R03', 'R04', 'R05', 'R07', 'R06', 'R08'];

// De start-reeks (18 sep besloten): het raster is bij de start te leeg, dus in het
// eerste weekend twee berichten per dag. Wat hier staat, komt niet nog eens in het
// gewone ritme.
const START_REEKS = [
  { datum: '2026-09-19', tijd: '11:00', code: 'F17' },   // za: de entree
  { datum: '2026-09-19', tijd: '19:00', code: 'B13' },   // za: carrousel, vijf dingen
  { datum: '2026-09-20', tijd: '11:00', code: 'F15' },   // zo: eerst op papier
  { datum: '2026-09-20', tijd: '19:00', code: 'R01' },   // zo: reel, de entree
  { datum: '2026-09-21', tijd: '11:00', code: 'F16' },   // ma: zo ziet de meeste klant u
  { datum: '2026-09-21', tijd: '19:00', code: 'B02' },   // ma: wat kost een website
];
// de uitgewerkte berichten, in volgorde; B01 is op 18 september al geweest
const MEERDERE = { B03: 3, B07: 3, B09: 3, B13: 7 };
const UITGEWERKT = ['B13', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12'];
const platenVan = code => MEERDERE[code]
  ? [...Array(MEERDERE[code])].map((_, i) => `berichten/nl/${code}-${i + 1}.jpg`)
  : [`berichten/nl/${code}.jpg`];
const tekstVan = code => vak[code] || basis[code];

// ---- datums -------------------------------------------------------------------
const dag = (iso, plus) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + plus); return d.toISOString().slice(0, 10); };
const weekStart = iso => { const d = new Date(iso + 'T12:00:00Z'); return dag(iso, -((d.getUTCDay() + 6) % 7)); };

// Bijschriften van berichten die blijven staan, opnieuw uit de bron (bijvoorbeeld
// na het opfrissen van de hashtags). De code volgt uit het pad van de plaat.
const codeVan = pad => { const mm = pad.match(/\/((?:B|F)\d\d)(?:-\d)?\.jpg$|\/(R\d\d)\.mp4$/); return mm ? (mm[1] || mm[2]) : null; };
for (const i of behouden) {
  if (i.soort !== 'bericht') continue;
  const c = codeVan(i.beeld[0]);
  if (c && tekstVan(c)) i.tekst = tekstVan(c);
}

const bezet = new Set([...behouden.map(i => i.id), ...inLogboek]);
function id(datum, soort) {
  let k = `${datum}-${soort}`;
  for (let n = 2; bezet.has(k); n++) k = `${datum}-${soort}-${n}`;
  bezet.add(k);
  return k;
}

// ---- opbouwen -----------------------------------------------------------------
// Verhaal, bericht en reel komen uit dezelfde twaalf foto's; dezelfde foto twee
// keer in één week valt op. Daarom eerst de berichten van de week kiezen, en bij
// de verhalen die bron overslaan.
const reels = require('../teksten/reels-nl.cjs');
const { VAK } = require('../platen/vak.cjs');
const bronVan = pad => {
  let m;
  if ((m = pad.match(/V(\d\d)\.jpg$/))) return Number(m[1]) - 27;
  if ((m = pad.match(/F(\d\d)\.jpg$/))) return Number(m[1]) - 14;
  if ((m = pad.match(/(R\d\d)\.mp4$/))) return VAK.findIndex(x => x.beeld === reels.find(r => r.code === m[1]).beeld);
  return -1;
};

// De kopregel van elke verhaalplaat, zodat het dashboard niet alleen "Verhaal" zegt.
const voorraad = require('../platen/voorraad.cjs');
const TITEL = {};
for (const x of voorraad.verhalen('nl')) { const mm = x.id.match(/^(V\d\d) - (.*)$/); if (mm) TITEL[mm[1]] = mm[2].replace(/^Tip, /, ''); }
VAK.forEach((x, i) => { TITEL['V' + (27 + i)] = x.kop; });
const titelVan = pad => { const mm = pad.match(/(V\d\d)\.jpg$/); return mm ? TITEL[mm[1]] : undefined; };

// Een bericht uit een code: F14 -> één plaat, B13 -> zeven platen, R01 -> een reel.
const bericht = (datum, tijd, code) => ({
  id: id(datum, 'bericht'), datum, tijd, soort: 'bericht', taal: 'nl',
  beeld: code.startsWith('R') ? [`reels/${code}.mp4`] : platenVan(code), tekst: tekstVan(code),
});

// De start-reeks eerst; wat daarin zit, gaat uit de gewone voorraad.
const items = [];
const gestart = new Set(START_REEKS.map(s => s.code));
const FOTO_B2 = FOTO_B.filter(c => !gestart.has(c)), REELS2 = REELS.filter(c => !gestart.has(c)), UITGEWERKT2 = UITGEWERKT.filter(c => !gestart.has(c));
const startPerWeek = new Map();
for (const s of START_REEKS) {
  if (s.datum < START && planning.items.some(i => i.datum === s.datum && i.tijd === s.tijd && i.soort === 'bericht')) continue;
  const it = bericht(s.datum, s.tijd, s.code);
  const w = weekStart(s.datum);
  if (!startPerWeek.has(w)) startPerWeek.set(w, []);
  startPerWeek.get(w).push(it);
  if (s.datum < START) items.push(it);            // vóór de startdatum: los toevoegen
}

let v = 0, m = 0, t = 0, f = 0, r = 0, u = 0, slot = 0;
for (let w = 0; w < WEKEN; w++) {
  const ma = dag(START, 7 * w);
  const week = [...(startPerWeek.get(ma) || [])];

  // dinsdag 20:00: om de week een reel (vanaf de tweede week, de eerste reel zit
  // al in de start-reeks), anders een uitgewerkt bericht
  const di = dag(ma, 1);
  if (w % 2 === 1) week.push(bericht(di, '20:00', REELS2[r++ % REELS2.length]));
  else week.push(bericht(di, '20:00', UITGEWERKT2[u++ % UITGEWERKT2.length]));
  // donderdag 11:00: een fotobericht over ons vak
  week.push(bericht(dag(ma, 3), '11:00', FOTO_B2[f++ % FOTO_B2.length]));

  // verhalen: woensdag een tip; van de andere vier is er één van het merk
  const gebruikt = new Set(week.map(i => bronVan(i.beeld[0])));
  for (const [plus, tijd] of [[0, '07:00'], [1, '12:00'], [2, '19:00'], [3, '08:00'], [4, '16:00']]) {
    const datum = dag(ma, plus);
    let beeld;
    if (plus === 2) beeld = TIP_V[t++ % TIP_V.length];
    else if (slot++ % 4 === 2) beeld = MERK_V[m++ % MERK_V.length];
    else {
      let k = 0;
      do { beeld = VAK_V[v++ % VAK_V.length]; } while (gebruikt.has(bronVan(beeld)) && ++k < VAK_V.length);
      gebruikt.add(bronVan(beeld));
    }
    week.push({ id: id(datum, 'verhaal'), datum, tijd, soort: 'verhaal', taal: 'nl', beeld: [beeld], titel: titelVan(beeld) });
  }
  items.push(...week);
}

const alles = [...behouden, ...items].sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));

// ---- controle -----------------------------------------------------------------
let mis = 0;
for (const i of alles) {
  if (!i.tekst && i.soort === 'bericht') { console.error('GEEN TEKST: ' + i.id); mis++; }
  for (const b of i.beeld) if (!fs.existsSync(path.join(WORTEL, 'beeld', b))) { console.error('ONTBREEKT: ' + b + ' (' + i.id + ')'); mis++; }
}
const verhalen = alles.filter(i => i.soort === 'verhaal').length;
console.log(`${alles.length} items (${verhalen} verhalen, ${alles.length - verhalen} berichten), van ${alles[0].datum} tot ${alles[alles.length - 1].datum}`);
console.log(`nieuw vanaf ${START}: ${items.length} items; reels ${r}, uitgewerkt ${u}, fotoberichten ${f}`);
for (const i of items.filter(i => i.soort === 'bericht')) console.log(`  ${i.datum} ${i.tijd}  ${i.beeld[0].replace(/^.*\//, '').padEnd(12)} ${(i.tekst || '').split('\n')[0].slice(0, 50)}`);
if (mis) { console.error(`\n${mis} probleem/problemen; niets weggeschreven.`); process.exit(1); }

if (DOEN) {
  fs.writeFileSync(PLANNING, JSON.stringify({ ...planning, gemaakt: new Date().toISOString().slice(0, 10), items: alles }, null, 1));
  console.log('\nplanning.json geschreven.');
} else {
  console.log('\n(niets geschreven; draai met --doen om planning.json te schrijven)');
}
