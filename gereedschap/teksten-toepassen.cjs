// Zet de bijschriften uit teksten/berichten-nl.cjs in planning.json.
//
//   node gereedschap/teksten-toepassen.cjs            toont wat er verandert
//   node gereedschap/teksten-toepassen.cjs --doen     schrijft het weg
//
// De plaat bepaalt welke tekst eronder komt: berichten/nl/B03-2.jpg hoort bij
// B03, berichten/nl/F07.jpg bij F07. Verhalen hebben geen bijschrift.
const fs = require('fs'), path = require('path');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const teksten = require(path.join(WORTEL, 'teksten', 'berichten-nl.cjs'));

const DOEN = process.argv.includes('--doen');
const planning = JSON.parse(fs.readFileSync(PLANNING, 'utf8'));

const sleutel = beeld => {
  const m = beeld.match(/\/((?:B|F)\d\d)(?:-\d)?\.jpg$/);
  return m ? m[1] : null;
};

let gelijk = 0, gewijzigd = 0;
const onbekend = [], mist = [];

for (const item of planning.items) {
  if (item.soort !== 'bericht') continue;
  if (item.taal !== 'nl') continue;

  const k = sleutel(item.beeld[0]);
  if (!k) { onbekend.push(item.id + ' ' + item.beeld[0]); continue; }
  if (!teksten[k]) { mist.push(item.id + ' (' + k + ')'); continue; }

  if (item.tekst === teksten[k]) { gelijk++; continue; }
  gewijzigd++;
  console.log(`${item.datum}  ${k}  ${(item.tekst || '').split('\n')[0].slice(0, 42).padEnd(44)} -> ${teksten[k].split('\n')[0].slice(0, 42)}`);
  item.tekst = teksten[k];
}

console.log(`\n${gewijzigd} gewijzigd, ${gelijk} stonden al goed.`);
if (onbekend.length) console.log('Geen plaatnummer herkend bij: ' + onbekend.join(', '));
if (mist.length) console.log('Geen tekst gevonden voor: ' + mist.join(', '));

const teLang = planning.items.filter(i => i.tekst && i.tekst.length > 2200);
if (teLang.length) {
  console.error('GESTOPT: ' + teLang.length + ' bijschrift(en) boven de 2200 tekens die Instagram toestaat.');
  process.exit(1);
}

if (!DOEN) { console.log('\nProefdraai. Draai met --doen om het echt weg te schrijven.'); return; }
fs.writeFileSync(PLANNING, JSON.stringify(planning, null, 1));
console.log('planning.json bijgewerkt.');
