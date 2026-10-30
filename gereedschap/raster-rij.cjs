// Rasterpreview van de hele rij: wat geplaatst en ingepland is, plus de gemaakte pakketten van batch 3 tot en met
// <CODE>, in plaatsingsvolgorde. Roept raster-preview.cjs aan; uitvoer preview/raster-<CODE>.jpg.
//   node gereedschap/raster-rij.cjs W04
// Bijwerken als de planning verandert: RIJ staat in plaatsingsvolgorde (oudste eerst). K03 ontbreekt bewust (door
// Andries van het profiel gehaald, 26 okt). Pakketten zonder beeld in beeld/berichten/nl/ komen uit hun pakketmap.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const W = path.join(__dirname, '..');
const RIJ = [
  ['K02'], ['W01'], ['Z01'], ['A37', 'pakketten/2026-11-04-A37-bekendmaking/plaat-1.jpg'], ['T02'], ['K04'], ['T01'], ['W02'],
  ['G01'], ['K05'], ['T03'],
  ['W04', 'pakketten/2026-11-23-W04-acht-sferen/plaat-1.jpg'], ['G02', 'pakketten/2026-11-25-G02-werkwijze/plaat-1.jpg'],
  ['K06', 'pakketten/2026-11-27-K06-barbier/plaat-1.jpg'], ['T04', 'pakketten/2026-11-30-T04-feit/plaat-1.jpg'],
  ['G03', 'pakketten/2026-12-02-G03-werkwijze/plaat-1.jpg'], ['K07', 'pakketten/2026-12-04-K07-garage/plaat-1.jpg'],
  ['T05', 'pakketten/2026-12-07-T05-feit/plaat-1.jpg'],
];
const tot = process.argv[2];
const i = RIJ.findIndex(r => r[0] === tot);
if (i < 0) { console.error('gebruik: node gereedschap/raster-rij.cjs <CODE>  (een van ' + RIJ.map(r => r[0]).join(' ') + ')'); process.exit(1); }
const args = [];
for (const [code, pad] of RIJ.slice(0, i + 1)) {
  const p = pad || `beeld/berichten/nl/${code}-1.jpg`;
  if (!fs.existsSync(path.join(W, p))) { console.log(`(${code} overgeslagen: ${p} bestaat niet)`); continue; }
  args.push(code, p);
}
execFileSync(process.execPath, [path.join(__dirname, 'raster-preview.cjs'), ...args], { cwd: W, stdio: 'inherit' });
