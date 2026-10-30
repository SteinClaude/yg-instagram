// Gedeelde bouwstenen voor platen in de familie Champagne (docs/stijlgids.md): ivoren grond, licht medaillon op de
// eerste en laatste plaat, kop in Playfair, legenda met gouden nummers, voetregel met het embleem.
// Overgenomen uit K05 (maak-k05.cjs), zodat K06, K07 en W04 dezelfde opmaak hebben zonder alles te kopiëren.
//
//   const C = require('../../../gereedschap/champagne.cjs');
//   const k = C.kader(__dirname);                 // paden, css en hulpjes voor dit pakket (bron/beelden/ nodig:
//                                                 //   achtergrond-medaillon.png en yg-digital-logo-kopbalk-op-licht.svg)
//   await k.bouw(b, platen, 'titel');             // plaat-n.jpg, overzicht.jpg en telefooncontrole.jpg in de pakketmap
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const sharp = require('sharp');

const uri = p => pathToFileURL(p).href;
const FONT = uri(path.join(__dirname, '..', 'platen', 'fonts')) + '/';

function css(BLD, extra = '') {
  return `
@font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; background: #F2ECE2; }
body.medaillon { background: #F2ECE2 url('${uri(path.join(BLD, 'achtergrond-medaillon.png'))}') 0 0 / 1080px 1350px no-repeat; }
body.medaillon::before { content: ''; position: absolute; inset: 0; background: rgba(242, 236, 226, .42); }
.plaat { position: relative; width: 1080px; height: 1350px; padding: 60px 72px 50px; display: flex; flex-direction: column; color: #141414; font-family: 'Mont'; }
.label { font: 500 25px/1 'Mont'; letter-spacing: .2em; text-transform: uppercase; color: #86682F; }
h1 { font: 400 92px/1.04 'Playfair'; letter-spacing: -.01em; }
h1 em, h2 em { font-style: italic; color: #86682F; }
h2 { font: 400 62px/1.1 'Playfair'; margin-top: 24px; }
.sub { font: 400 30px/1.4 'Mont'; color: #3A322B; margin-top: 24px; }
.midden { flex: 1; margin-top: 34px; position: relative; min-height: 0; display: flex; flex-direction: column; justify-content: flex-start; }
.schaduw { box-shadow: 0 30px 60px rgba(46,32,18,.22), 0 2px 6px rgba(46,32,18,.18); }
.telefoon { position: relative; background: #1A1714; border-radius: 54px; padding: 13px; }
.telefoon .scherm { border-radius: 42px; overflow: hidden; background: #F4F5F3; position: relative; }
.telefoon .scherm img { display: block; width: 100%; }
.telefoon::before { content: ''; position: absolute; top: 26px; left: 50%; transform: translateX(-50%); width: 92px; height: 26px; border-radius: 13px; background: #1A1714; z-index: 3; }
.browser { position: relative; background: #1F1B17; border-radius: 14px; padding: 0 10px 10px; }
.browser .balk { height: 36px; display: flex; align-items: center; gap: 9px; padding-left: 8px; }
.browser .balk i { width: 11px; height: 11px; border-radius: 50%; background: #5B5148; }
.browser .scherm { overflow: hidden; border-radius: 3px; } .browser .scherm img { display: block; width: 100%; }
.merk { position: absolute; z-index: 4; width: 50px; height: 50px; margin: -25px 0 0 -25px; border-radius: 50%; background: #C9A45C; color: #141414; font: 500 24px/50px 'Mont'; text-align: center; box-shadow: 0 0 0 4px #F2ECE2, 0 6px 16px rgba(0,0,0,.28); }
.legenda { margin-top: 30px; display: grid; gap: 12px; }
.legenda div { display: flex; align-items: center; gap: 18px; font: 400 30px/1.3 'Mont'; color: #28221D; }
.legenda span { flex: 0 0 42px; height: 42px; border-radius: 50%; background: #C9A45C; color: #141414; font: 500 21px/42px 'Mont'; text-align: center; }
.notitie { margin-top: 14px; font: 400 24px/1.35 'Mont'; color: #6A5F55; padding-left: 60px; }
.loep { position: absolute; z-index: 5; border: 3px solid #C9A45C; border-radius: 12px; background: #F4F5F3; overflow: visible; }
.loep img { display: block; width: 100%; border-radius: 9px; }
.rij { display: flex; align-items: center; gap: 40px; flex: 1; min-height: 0; }
.bijschrift { font: 400 23px/1.35 'Mont'; color: #6A5F55; margin-top: 30px; }
.voet { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; height: 54px; }
.voet img { height: 54px; } .voet .nr { font: 500 22px 'Mont'; letter-spacing: .16em; color: #86682F; }
${extra}`;
}

function kader(BRON, { extraCss = '' } = {}) {
  const UIT = path.join(BRON, '..'), BLD = path.join(BRON, 'beelden'), R = path.join(BRON, 'render');
  fs.mkdirSync(R, { recursive: true });
  const k = { BRON, UIT, BLD, R, uri };
  k.voet = nr => `<div class="voet"><img src="${uri(path.join(BLD, 'yg-digital-logo-kopbalk-op-licht.svg'))}"><div class="nr">${nr} / __AANTAL__</div></div>`;
  k.merk = (n, x, y) => `<div class="merk" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px">${n}</div>`;
  k.legenda = r => `<div class="legenda">${r.map((t, i) => `<div><span>${i + 1}</span>${t}</div>`).join('')}</div>`;
  k.browser = (shot, B, merken = []) => {
    const s = (B - 20) / shot.w;
    return `<div class="browser schaduw" style="width:${B}px"><div class="balk"><i></i><i></i><i></i></div><div class="scherm" style="height:${(shot.h * s).toFixed(1)}px"><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => k.merk(n, 10 + fx * s, 36 + fy * s)).join('')}</div>`;
  };
  k.telefoon = (shot, B, merken = [], stijl = '', balk = '#F4F5F3') => {
    const s = (B - 26) / shot.w, st = Math.round(B * 0.085);
    return `<div class="telefoon schaduw" style="width:${B}px;${stijl}"><div class="scherm" style="height:${(st + shot.h * s).toFixed(1)}px"><div style="height:${st}px; background:${balk}"></div><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => k.merk(n, 13 + fx * s, 13 + st + fy * s)).join('')}</div>`;
  };
  // schermafdruk van een eigen html-ontwerp in bron/, met meetpunten (css-pixels)
  k.scherm = async (b, { bestand, w, h, dpr = 3, voor, meet }) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const [f, hash] = bestand.split('#');
    await p.goto(uri(path.join(BRON, f)) + (hash ? '#' + hash : ''), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    if (voor) await p.evaluate(voor);
    await p.waitForTimeout(200);
    const maten = await p.evaluate(sels => Object.fromEntries(Object.entries(sels).map(([n, s]) => { const r = document.querySelector(s).getBoundingClientRect(); return [n, { x: r.x, y: r.y, w: r.width, h: r.height }]; })), meet || {});
    const naam = f.replace(/\.html$/, '') + (hash ? '-' + hash : '') + '.png';
    await p.screenshot({ path: path.join(R, naam) });
    await p.close();
    return { src: uri(path.join(R, naam)), bestand: path.join(R, naam), w, h, maten };
  };
  // een bestaand beeld (png/jpg) als shot voor telefoon() of browser(), met breedte in css-pixels
  k.beeld = async (bestand, w) => { const m = await sharp(bestand).metadata(); return { src: uri(bestand), bestand, w, h: Math.round(m.height * w / m.width) }; };
  // platen: [{ medaillon, html }] → plaat-n.jpg, overzicht.jpg, telefooncontrole.jpg
  k.bouw = async (b, platen, titel) => {
    const n0 = platen.length;
    const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
    for (const [i, pl] of platen.entries()) {
      const html = path.join(BRON, `plaat-${i + 1}.html`);
      const inhoud = (typeof pl.html === 'function' ? pl.html() : pl.html).replace(/__AANTAL__/g, String(n0));
      fs.writeFileSync(html, `<!doctype html><html lang="nl"><head><title>${titel} — beeld ${i + 1} — YG Digital</title><meta charset="utf-8"><style>${css(BLD, extraCss)}</style></head><body class="${pl.medaillon ? 'medaillon' : ''}"><div class="plaat">${inhoud}</div></body></html>`, 'utf8');
      await p.goto(uri(html), { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(150);
      const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
      await sharp(await p.screenshot()).resize(1080, 1350, { kernel: 'lanczos3' }).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
      console.log(`plaat-${i + 1}.jpg${over ? `  LET OP: loopt over (${over})` : ''}`);
    }
    await p.close();
    const n = platen.length, klein = [], tel = [];
    for (let i = 0; i < n; i++) { const f = path.join(UIT, `plaat-${i + 1}.jpg`); klein.push(await sharp(f).resize(432).toBuffer()); tel.push(await sharp(f).resize(780).toBuffer()); }
    await sharp({ create: { width: n * 432 + (n + 1) * 26, height: 540 + 52, channels: 3, background: '#E9E2D6' } })
      .composite(klein.map((x, i) => ({ input: x, left: 26 + i * 458, top: 26 }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
    await sharp({ create: { width: n * 780 + (n + 1) * 30, height: 975 + 60, channels: 3, background: '#ffffff' } })
      .composite(tel.map((x, i) => ({ input: x, left: 30 + i * 810, top: 30 }))).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
    console.log('overzicht.jpg en telefooncontrole.jpg klaar');
  };
  return k;
}

// gedeelde beelden van een eerder Champagne-pakket naar bron/beelden/ kopiëren (zelfde werkwijze als K02–K05)
function kopieerBasis(BLD, van = path.join(__dirname, '..', 'pakketten', '2026-11-18-K05-installateur', 'bron', 'beelden')) {
  fs.mkdirSync(BLD, { recursive: true });
  for (const f of ['achtergrond-medaillon.png', 'yg-digital-logo-kopbalk-op-licht.svg'])
    if (!fs.existsSync(path.join(BLD, f))) fs.copyFileSync(path.join(van, f), path.join(BLD, f));
}

module.exports = { kader, kopieerBasis, css, uri };
