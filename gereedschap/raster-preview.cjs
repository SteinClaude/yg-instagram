// Rasterpreview: hoe het profielraster eruit komt te zien met een of meer nieuwe hoofdplaten erbij (opdracht 01, §2).
//
//   node gereedschap/raster-preview.cjs <CODE> <hoofdplaat.jpg> [<CODE2> <hoofdplaat2.jpg> ...]
//   bv. node gereedschap/raster-preview.cjs K02 pakketten/2026-10-23-K02-autoschade/plaat-1.jpg
//
// Geef de nieuwe platen in plaatsingsvolgorde (oudste eerst); het raster toont ze nieuwste eerst, zoals Instagram.
// Uitvoer: preview/raster-<laatste CODE>.jpg.
//
// Wat er nu op het profiel staat (stand 21 okt 2026, zie docs/oplevering-01.md): bovenaan de vastgezette weggeefactie
// A36 (16 okt), daaronder K01 (Salon Avelijn, 30 sep). De oude weggeefactie A35 en reel R17 (de "medaillon"-tegel) horen
// na A36 gearchiveerd te zijn door Andries (opdracht 01a, E3); die staan hier gedempt in een tweede rij, voor het geval
// dat nog niet gebeurd is. Instagram toont het raster sinds 2025 in tegels van 3:4; de platen (4:5) worden daarom
// iets aan boven- en onderkant afgesneden, net als in de app.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) { console.error('gebruik: node gereedschap/raster-preview.cjs <CODE> <hoofdplaat.jpg> [...]'); process.exit(1); }
const nieuw = [];
for (let i = 0; i < args.length; i += 2) nieuw.push({ code: args[i], pad: path.resolve(args[i + 1]) });
const laatste = nieuw[nieuw.length - 1].code;

const B = f => path.join(WORTEL, 'beeld', f);
const tegels = [
  { pad: B('berichten/nl/A36-1.jpg'), label: 'A36 · weggeefactie (vastgezet)', speld: true },
  ...nieuw.slice().reverse().map(n => ({ pad: n.pad, label: `${n.code} · nieuw`, nieuw: true })),
  { pad: B('berichten/nl/K01-1.jpg'), label: 'K01 · Salon Avelijn' },
  { pad: B('reels/R17.jpg'), label: 'R17 · reel (gearchiveerd?)', dim: true },
  { pad: B('berichten/nl/A35.jpg'), label: 'A35 · oude actie (gearchiveerd?)', dim: true },
];
const FONT = 'file:///' + path.join(WORTEL, 'platen', 'fonts').replace(/\\/g, '/') + '/';
const uri = p => 'file:///' + p.replace(/\\/g, '/');
const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
  @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
  body { margin: 0; background: #fff; font-family: 'Mont'; color: #262626; }
  .w { width: 390px; padding: 0 0 24px; }
  .kop { padding: 14px 16px 10px; display: flex; align-items: center; gap: 18px; }
  .kop .pf { width: 76px; height: 76px; border-radius: 50%; background: url('${uri(B('../platen/uit/profiel-entree.png'))}') center / cover, #e8dfcf; }
  .kop .naam { font-weight: 500; font-size: 14px; } .kop .bio { font-size: 12px; color: #555; margin-top: 2px; line-height: 1.35; }
  .tabs { border-top: 1px solid #dbdbdb; display: flex; } .tabs div { flex: 1; text-align: center; font-size: 11px; padding: 9px 0; letter-spacing: .06em; color: #999; }
  .tabs div:first-child { color: #262626; border-top: 1px solid #262626; margin-top: -1px; }
  .raster { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; }
  .t { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: #eee; }
  .t img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .t.dim img { opacity: .35; filter: grayscale(.6); }
  .t .n { position: absolute; left: 0; right: 0; bottom: 0; font-size: 8px; padding: 3px 5px; background: rgba(0,0,0,.55); color: #fff; letter-spacing: .04em; }
  .t.nieuw { outline: 2px solid #C9A45C; outline-offset: -2px; }
  .t .speld { position: absolute; top: 5px; right: 6px; width: 14px; height: 14px; border-radius: 50%; background: rgba(0,0,0,.55); color: #fff; font-size: 9px; line-height: 14px; text-align: center; }
  .uitleg { font-size: 10.5px; color: #666; padding: 12px 16px 0; line-height: 1.45; }
</style></head><body><div class="w">
  <div class="kop"><div class="pf"></div><div><div class="naam">YG Digital</div><div class="bio">Webdesigner<br>Websites voor ondernemers. Vanuit Alkmaar, voor heel Nederland.<br>Bekijk uw eerste ontwerp →</div></div></div>
  <div class="tabs"><div>BERICHTEN</div><div>REELS</div><div>GETAGD</div></div>
  <div class="raster">${tegels.map(t => `<div class="t${t.dim ? ' dim' : ''}${t.nieuw ? ' nieuw' : ''}"><img src="${uri(t.pad)}">${t.speld ? '<div class="speld">📌</div>' : ''}<div class="n">${t.label}</div></div>`).join('')}</div>
  <div class="uitleg">Rasterpreview ${laatste}: profiel op telefoonbreedte (390 punten), tegels 3:4 zoals Instagram ze nu toont. Goud omlijnd = nieuw. Gedempt = hoort gearchiveerd te zijn na A36 (opdracht 01a); staat het er nog, dan schuift het zo onder K01. Bio en profielfoto zijn een voorstel (docs/bio.md), geen weergave van het echte profiel.</div>
</div></body></html>`;
const UIT = path.join(WORTEL, 'preview');
fs.mkdirSync(UIT, { recursive: true });
const tmp = path.join(UIT, `raster-${laatste}.html`);
fs.writeFileSync(tmp, html, 'utf8');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 3 });
  await p.goto(uri(tmp), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const h = await p.evaluate(() => Math.ceil(document.querySelector('.w').getBoundingClientRect().height));
  await p.setViewportSize({ width: 390, height: h });
  await sharp(await p.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, `raster-${laatste}.jpg`));
  await b.close();
  fs.unlinkSync(tmp);
  console.log(`preview/raster-${laatste}.jpg klaar`);
})().catch(e => { console.error(e); process.exit(1); });
