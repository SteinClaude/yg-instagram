// Meet hoe groot de repo is en wat de automaat daarvan echt nodig heeft. Leest alleen (git en de planning);
// er wordt niets gewijzigd of weggehaald. Hoort bij het opruimvoorstel in docs/automaat-alle-kanalen.md.
//
//   node gereedschap/omvang.cjs [--dagen 7]
//
// --dagen: na hoeveel dagen een geplaatste video volgens het voorstel weg mag (standaard 7).
// Werkt ook in een werkmap waar de pakketten niet zijn opgehaald: de groottes komen uit git, niet van de schijf.
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const fs = require('fs');

const WORTEL = path.join(__dirname, '..');
const i = process.argv.indexOf('--dagen');
const DAGEN = i > -1 ? Number(process.argv[i + 1]) : 7;
if (!(DAGEN >= 0)) { console.error('gebruik: node gereedschap/omvang.cjs [--dagen 7]'); process.exit(1); }

const mb = b => (b / 1048576).toFixed(1).replace('.', ',').padStart(8) + ' MB';
const boom = execFileSync('git', ['ls-tree', '-r', '-l', 'HEAD'], { cwd: WORTEL, encoding: 'utf8', maxBuffer: 1 << 28 })
  .split('\n').map(r => /^\d+ blob [0-9a-f]+\s+(\d+)\t(.*)$/.exec(r)).filter(Boolean).map(m => ({ pad: m[2], grootte: Number(m[1]) }));
const grootte = new Map(boom.map(b => [b.pad, b.grootte]));
const som = lijst => lijst.reduce((s, b) => s + b.grootte, 0);
const lees = f => JSON.parse(fs.readFileSync(path.join(WORTEL, f), 'utf8'));
const planning = lees('planning.json'), gedaan = lees('gedaan.json');
const klaar = new Map(gedaan.items.map(g => [g.id, g]));
const padVan = b => b.startsWith('pakketten/') ? b : `beeld/${b}`;
const bestandenVan = item => [...(item.beeld || []), item.omslag].filter(Boolean).map(padVan);

console.log(`Werkmap op de laatste commit: ${boom.length} bestanden, ${mb(som(boom)).trim()}`);
const perMap = {};
for (const b of boom) { const k = b.pad.includes('/') ? b.pad.split('/')[0] + '/' : '(hoofdmap)'; (perMap[k] = perMap[k] || []).push(b); }
for (const [k, l] of Object.entries(perMap).sort((a, b) => som(b[1]) - som(a[1])).slice(0, 6)) console.log(`${mb(som(l))}  ${String(l.length).padStart(5)} bestanden  ${k}`);

console.log('\nVideo (mp4), per soort:');
const soorten = [
  ['pakketten/*/video.mp4 (de grote versie; Instagram gebruikt hem niet)', b => /^pakketten\/[^/]+\/video\.mp4$/.test(b.pad)],
  ['pakketten/*/video-upload.mp4 (voor YouTube Studio; Instagram gebruikt hem niet)', b => /^pakketten\/[^/]+\/video-upload\.mp4$/.test(b.pad)],
  ['pakketten/*/instagram/reel.mp4 (Instagram-versie van kanaal 1)', b => /^pakketten\/[^/]+\/instagram\/[^/]+\.mp4$/.test(b.pad)],
  ['beeld/<account>/*.mp4 (Instagram-versies van de andere makers, via inplannen.cjs)', b => /^beeld\/(kanaal|account)-[^/]+\/[^/]+\.mp4$/.test(b.pad)],
  ['overige mp4 (beeld/reels, verhalen, platen)', b => /\.mp4$/.test(b.pad)],
];
let rest = boom.filter(b => /\.mp4$/i.test(b.pad));
for (const [naam, hoort] of soorten) { const l = rest.filter(hoort); rest = rest.filter(b => !hoort(b)); console.log(`${mb(som(l))}  ${String(l.length).padStart(5)} bestanden  ${naam}`); }

const open = planning.items.filter(it => !klaar.has(it.id));
const nodig = new Set(open.flatMap(bestandenVan));
const grens = Date.now() - DAGEN * 86400000;
const oud = new Set();
for (const it of planning.items) {
  const g = klaar.get(it.id);
  if (!g || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(g.wanneer || '')) continue;
  if (Date.parse(g.wanneer.replace(' ', 'T') + ':00Z') > grens) continue;      // op een uur na; voor een telling genoeg
  for (const p of bestandenVan(it)) if (/\.mp4$/i.test(p) && !nodig.has(p) && grootte.has(p)) oud.add(p);
}
const telOp = paden => [...paden].reduce((s, p) => s + (grootte.get(p) || 0), 0);
console.log(`\nDe automaat:`);
console.log(`${mb(telOp(nodig))}  ${String(nodig.size).padStart(5)} bestanden  nodig voor de ${open.length} items die nog open staan`);
console.log(`${mb(telOp(oud))}  ${String(oud.size).padStart(5)} bestanden  video's van items die meer dan ${DAGEN} dagen geleden zijn afgehandeld (voorstel: mogen weg uit de werkmap)`);
const nooit = boom.filter(b => /^pakketten\/[^/]+\/video(-upload)?\.mp4$/.test(b.pad));
console.log(`${mb(som(nooit))}  ${String(nooit.length).padStart(5)} bestanden  video's in pakketten die Instagram nooit ophaalt (voorstel: niet meer op de openbare site)`);
console.log('\nLet op: weghalen uit de werkmap maakt de openbare site en het ophalen kleiner, niet de geschiedenis van git.');
