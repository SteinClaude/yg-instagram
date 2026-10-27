// K05 · Installatiebedrijf Veldwater (fictief), november 2026: vijf carrouselplaten van 1080 x 1350 in de NIEUWE stijl
// (docs/stijlgids.md, concept; Eva 26 okt: batch 3 al in de nieuwe stijl bouwen). Familie Champagne:
//   plaat 1  vorm Telefoon, kop ≤ 5 woorden op ≥ 84 px, licht medaillon
//   plaat 2  zwakke versie met drie markeringen (geen medaillon)
//   plaat 3  sterke versie, zelfde uitsnede (geen medaillon)
//   plaat 4  telefoonversie met de vaste belbalk vergroot (geen medaillon)
//   plaat 5  slot: echt studioresultaat, licht medaillon
// De drie verschilpunten voor een installateur: bellen bovenaan · werkgebied in één regel · diensten als kaarten.
// 072 000 00 00 is een plaatshouder (bestaat niet). Lettertypen alleen uit platen/fonts (pc en cloud renderen gelijk).
//   node pakketten/2026-11-18-K05-installateur/bron/studio-opname.cjs   (plaat 5, live studio, internet nodig)
//   node pakketten/2026-11-18-K05-installateur/bron/maak-k05.cjs
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const sharp = require('sharp');
const { start } = require('../../../gereedschap/browser.cjs');

const BRON = __dirname, UIT = path.join(__dirname, '..'), R = path.join(BRON, 'render'), BLD = path.join(BRON, 'beelden');
fs.mkdirSync(R, { recursive: true });
const FONT = pathToFileURL(path.join(BRON, '..', '..', '..', 'platen', 'fonts')).href + '/';
const uri = p => pathToFileURL(p).href;
const PEXELS = path.join(BLD, 'pexels-29226620-sergei-starostin.jpg'); // 2400 x 1600, Pexels-licentie

async function fotos() {
  const m = await sharp(PEXELS).metadata();
  const h = Math.round(m.width * 2 / 3);
  await sharp(PEXELS).extract({ left: 0, top: Math.round((m.height - h) / 2), width: m.width, height: h }).resize({ width: 1600 }).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(BLD, 'installateursfoto-liggend.jpg'));
}

// schermafdruk van een ontwerp, met meetpunten (css-pixels)
async function scherm(b, { bestand, w, h, dpr, voor, meet }) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const [f, hash] = bestand.split('#');
  await p.goto(uri(path.join(BRON, f)) + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  if (voor) await p.evaluate(voor);
  await p.waitForTimeout(200);
  const maten = await p.evaluate(sels => Object.fromEntries(Object.entries(sels).map(([k, s]) => { const r = document.querySelector(s).getBoundingClientRect(); return [k, { x: r.x, y: r.y, w: r.width, h: r.height }]; })), meet || {});
  const naam = f.replace(/\.html$/, '') + (hash ? '-' + hash : '') + '.png';
  await p.screenshot({ path: path.join(R, naam) });
  await p.close();
  return { src: uri(path.join(R, naam)), bestand: path.join(R, naam), w, h, maten };
}

const CSS = `
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
h1 em { font-style: italic; color: #86682F; }
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
`;
const LABEL = '<div class="label">Conceptproject · fictief installatiebedrijf</div>';
const voet = nr => `<div class="voet"><img src="${uri(path.join(BLD, 'yg-digital-logo-kopbalk-op-licht.svg'))}"><div class="nr">${nr} / 5</div></div>`;
const merk = (n, x, y) => `<div class="merk" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px">${n}</div>`;
const legenda = r => `<div class="legenda">${r.map((t, i) => `<div><span>${i + 1}</span>${t}</div>`).join('')}</div>`;
function browser(shot, B, merken = []) {
  const s = (B - 20) / shot.w;
  return `<div class="browser schaduw" style="width:${B}px"><div class="balk"><i></i><i></i><i></i></div><div class="scherm" style="height:${(shot.h * s).toFixed(1)}px"><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => merk(n, 10 + fx * s, 36 + fy * s)).join('')}</div>`;
}
function telefoon(shot, B, merken = [], stijl = '', balk = '#F4F5F3') {
  const s = (B - 26) / shot.w, st = Math.round(B * 0.085);
  return `<div class="telefoon schaduw" style="width:${B}px;${stijl}"><div class="scherm" style="height:${(st + shot.h * s).toFixed(1)}px"><div style="height:${st}px; background:${balk}"></div><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => merk(n, 13 + fx * s, 13 + st + fy * s)).join('')}</div>`;
}

const KOPPEN = ['Lekkage? Eén tik en u belt.', 'Hetzelfde bedrijf. Waar is het nummer?', 'Meer overzicht. Bellen staat bovenaan.', 'Ook op uw telefoon klopt het.', 'Hoe zou uw bedrijf eruitzien?'];

(async () => {
  await fotos();
  const b = await start();
  const vvoor = await scherm(b, { bestand: 'vergelijk-voor.html', w: 760, h: 640, dpr: 3, meet: { menu: '#menu', diensten: '#diensten', telefoon: '#telefoon' } });
  const vna = await scherm(b, { bestand: 'vergelijk-na.html', w: 760, h: 640, dpr: 3, meet: { telefoon: '#telefoon', gebied: '#gebied', diensten: '#diensten' } });
  const mob1 = await scherm(b, { bestand: 'installateur-mobiel.html', w: 390, h: 693, dpr: 3, meet: { belbalk: '#belbalk' } });
  const mob2 = await scherm(b, { bestand: 'installateur-mobiel.html#lijst', w: 390, h: 693, dpr: 3,
    voor: () => { document.body.classList.add('lijst'); window.scrollTo(0, document.getElementById('diensten').offsetTop - 64); }, meet: { rij: '.rij', vast: '.vast .knoppen' } });
  // vergroting van de vaste balk (3x resolutie)
  const t = mob2.maten, kv = { x: t.vast.x - 6, y: t.vast.y - 6, w: t.vast.w + 12, h: t.vast.h + 12 };
  const loepPad = path.join(R, 'loep-bellen.png');
  await sharp(mob2.bestand).extract({ left: Math.round(kv.x * 3), top: Math.round(kv.y * 3), width: Math.round(kv.w * 3), height: Math.round(kv.h * 3) }).png().toFile(loepPad);
  const sm = await sharp(path.join(BLD, 'studio-resultaat-veldwater.png')).metadata();
  const studio = { src: uri(path.join(BLD, 'studio-resultaat-veldwater.png')), w: 390, h: Math.round(sm.height * 390 / sm.width) };

  const z = vvoor.maten, a = vna.maten;
  const merkenZwak = [[1, z.menu.x + z.menu.w - 10, z.menu.y + z.menu.h + 24], [2, z.diensten.x - 22, z.diensten.y + z.diensten.h / 2], [3, z.telefoon.x + z.telefoon.w / 2 + 228, z.telefoon.y + z.telefoon.h / 2]]  // rechts naast het kleine nummer in de voettekst;
  const merkenSterk = [[1, a.telefoon.x + a.telefoon.w / 2, a.telefoon.y + a.telefoon.h + 26], [2, a.gebied.x - 26, a.gebied.y + a.gebied.h / 2], [3, a.diensten.x - 18, a.diensten.y + a.diensten.h / 2]];
  const LOEP = 1.9, TL = 296, TR = 380, OVERLAP = 20, MID = 936;
  const loepB = kv.w * LOEP + 6, loepH = kv.h * LOEP + 6, rechtsMidden = (MID - (TL + TR - OVERLAP)) / 2 + TL - OVERLAP + TR / 2;
  const loepLinks = Math.min(rechtsMidden - loepB / 2, MID + 24 - loepB);

  const platen = [
    { medaillon: true, html: `${LABEL}
      <div class="rij"><div style="flex:1"><h1>Lekkage?<br>Eén tik<br><em>en u belt.</em></h1>
        <div class="sub">Het nummer staat bovenaan, op elke pagina.</div></div>
        ${telefoon(mob1, 520, [], 'transform:rotate(3deg); margin-right:-30px')}</div>${voet(1)}` },
    { medaillon: false, html: `${LABEL}<h2>Hetzelfde bedrijf.<br>Waar is het nummer?</h2>
      <div class="midden">${browser(vvoor, 820, merkenZwak)}
        ${legenda(['Geen belknop bovenaan', 'Werkgebied verstopt in de tekst', 'Het nummer klein in de voettekst'])}</div>${voet(2)}` },
    { medaillon: false, html: `${LABEL}<h2>Meer overzicht.<br>Bellen staat bovenaan.</h2>
      <div class="midden">${browser(vna, 820, merkenSterk)}
        ${legenda(['Bellen, meteen bovenaan', 'Werkgebied in één regel', 'Diensten als kaarten'])}
        <div class="notitie">Zelfde bedrijf, foto en diensten als op het vorige beeld.</div></div>${voet(3)}` },
    { medaillon: false, html: `${LABEL}<h2>Ook op uw telefoon<br>klopt het.</h2>
      <div class="midden" style="justify-content:center"><div style="position:relative; margin-bottom:${(loepH - 2).toFixed(0)}px">
        <div style="display:flex; justify-content:center; align-items:flex-end">
          ${telefoon(mob1, TL, [[1, mob1.maten.belbalk.x + 30, mob1.maten.belbalk.y + mob1.maten.belbalk.h / 2]], `margin-right:-${OVERLAP}px; margin-bottom:30px; z-index:1`)}
          ${telefoon(mob2, TR, [], 'z-index:2')}</div>
        <div class="loep schaduw" style="width:${loepB.toFixed(0)}px; left:${loepLinks.toFixed(0)}px; top:calc(100% - 22px)"><img src="${uri(loepPad)}">${merk(2, -6, loepH / 2)}</div></div>
        ${legenda(['Bel direct, bovenaan elke pagina', 'Bellen blijft altijd in beeld'])}</div>${voet(4)}` },
    { medaillon: true, html: `<div class="label">YG Digital · ontwerpstudio</div>
      <div class="rij"><div style="flex:1"><h1 style="font-size:76px">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
        <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
        <div class="bijschrift">Dit voorbeeld maakt u zelf in onze ontwerpstudio.</div></div>
        ${telefoon(studio, 520, [], '', '#F6F0E8')}</div>${voet(5)}` },
  ];

  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (const [i, pl] of platen.entries()) {
    const html = path.join(BRON, `plaat-${i + 1}.html`);
    fs.writeFileSync(html, `<!doctype html><html lang="nl"><head><title>Installatiebedrijf Veldwater — beeld ${i + 1} — YG Digital</title><meta charset="utf-8"><style>${CSS}</style></head><body class="${pl.medaillon ? 'medaillon' : ''}"><div class="plaat">${pl.html}</div></body></html>`, 'utf8');
    await p.goto(uri(html), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
    await sharp(await p.screenshot()).resize(1080, 1350, { kernel: 'lanczos3' }).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, `plaat-${i + 1}.jpg`));
    console.log(`plaat-${i + 1}.jpg${over ? `  LET OP: loopt over (${over})` : ''}`);
  }
  await p.close();
  await b.close();

  // overzicht en telefooncontrole
  const n = platen.length, klein = [], tel = [];
  for (let i = 0; i < n; i++) { const f = path.join(UIT, `plaat-${i + 1}.jpg`); klein.push(await sharp(f).resize(432).toBuffer()); tel.push(await sharp(f).resize(780).toBuffer()); }
  await sharp({ create: { width: n * 432 + (n + 1) * 26, height: 540 + 52, channels: 3, background: '#E9E2D6' } })
    .composite(klein.map((x, i) => ({ input: x, left: 26 + i * 458, top: 26 }))).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'overzicht.jpg'));
  await sharp({ create: { width: n * 780 + (n + 1) * 30, height: 975 + 60, channels: 3, background: '#ffffff' } })
    .composite(tel.map((x, i) => ({ input: x, left: 30 + i * 810, top: 30 }))).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(UIT, 'telefooncontrole.jpg'));
  console.log('overzicht.jpg en telefooncontrole.jpg klaar  ·  koppen:', KOPPEN.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });
