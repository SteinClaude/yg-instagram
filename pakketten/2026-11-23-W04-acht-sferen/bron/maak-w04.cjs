// W04 · Eén naam, acht sferen (eigen werk, familie Champagne, docs/stijlgids.md). "Uw bedrijf" in alle acht sferen
// van de ontwerpstudio. Vier platen van 1080 x 1350:
//   plaat 1  raster van acht schermpjes, kop "Eén naam. Acht sferen.", licht medaillon (vorm: raster, contentvoorstel)
//   plaat 2  Atelier, Bloei, Digitaal, Werkplaats (geen medaillon)
//   plaat 3  Magazine, Speels, Rust, Stoer (geen medaillon)
//   plaat 4  slot: één sfeer groot, "Welke past bij u?", licht medaillon
// Alle beelden zijn echte opnames uit de live studio (studio-sferen.cjs eerst draaien, internet nodig).
// Wat de platen zeggen staat ook in de studio: "Acht sferen, en elke sfeer is een eigen website: een eigen opbouw,
// eigen versiering en een eigen manier om uw foto's te tonen." en "Zie uw naam in alle sferen naast elkaar".
//   node pakketten/2026-11-23-W04-acht-sferen/bron/studio-sferen.cjs
//   node pakketten/2026-11-23-W04-acht-sferen/bron/maak-w04.cjs
'use strict';
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const C = require('../../../gereedschap/champagne.cjs');

const SFEREN = ['atelier', 'bloei', 'digitaal', 'werkplaats', 'magazine', 'speels', 'rust', 'stoer'];
C.kopieerBasis(path.join(__dirname, 'beelden'));
const k = C.kader(__dirname, { extraCss: `
.raster { display: grid; justify-content: center; gap: 14px 16px; margin-top: 34px; }
.raster img { display: block; width: 100%; border-radius: 4px; }
.raster .site { box-shadow: 0 14px 30px rgba(46,32,18,.20), 0 1px 4px rgba(46,32,18,.16); border-radius: 4px; }
.vier { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 34px; }
.vier img { display: block; width: 100%; box-shadow: 0 16px 34px rgba(46,32,18,.22); }
` });
const img = (soort, s) => `<img src="${k.uri(path.join(k.BLD, `${soort}-${s}.png`))}">`;

(async () => {
  const b = await start();
  const groot = await k.beeld(path.join(k.BLD, 'site-werkplaats.png'), 579);
  const platen = [
    { medaillon: true, html: `<div class="label">Eigen werk · ontwerpstudio</div>
      <h1 style="font-size:86px; margin-top:20px">Eén naam. <em>Acht sferen.</em></h1>
      <div class="raster" style="grid-template-columns: 420px 420px">${SFEREN.map(s => `<div class="site">${img('site', s)}</div>`).join('')}</div>
      <div style="flex:1"></div>${k.voet(1)}` },
    { medaillon: false, html: `<div class="label">Eigen werk · ontwerpstudio</div>
      <h2>Dezelfde naam,<br>vier keer anders.</h2>
      <div class="sub">Elke sfeer is een eigen website: eigen opbouw, eigen versiering, eigen manier om foto's te tonen.</div>
      <div class="midden" style="justify-content:center; margin-top:0"><div class="vier" style="margin-top:0">${SFEREN.slice(0, 4).map(s => img('sfeer', s)).join('')}</div></div>${k.voet(2)}` },
    { medaillon: false, html: `<div class="label">Eigen werk · ontwerpstudio</div>
      <h2>Van rustig<br>tot stoer.</h2>
      <div class="sub">Daarna stelt u binnen uw sfeer de kleuren, letters en vormen bij.</div>
      <div class="midden" style="justify-content:center; margin-top:0"><div class="vier" style="margin-top:0">${SFEREN.slice(4).map(s => img('sfeer', s)).join('')}</div></div>${k.voet(3)}` },
    { medaillon: true, html: `<div class="label">YG Digital · ontwerpstudio</div>
      <h1 style="margin-top:20px">Welke past<br><em>bij u?</em></h1>
      <div class="sub">In de studio ziet u alle acht naast elkaar, met uw eigen naam erin. In vijf minuten, zonder account.</div>
      <div class="midden" style="justify-content:center">${k.browser(groot, 936)}
        <div class="bijschrift">Sfeer Werkplaats, zoals de studio hem toont. Probeer het via de link in onze bio.</div></div>${k.voet(4)}` },
  ];
  await k.bouw(b, platen, 'Eén naam, acht sferen');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
