// W01 · Entree van yg-digital.nl (eigen werk), oktober 2026: vier carrouselplaten van 1080 x 1350 in dezelfde vorm en
// medaillonstijl als K01–K03, met echte schermafdrukken van de homepage (laptop en telefoon) en van de ingang van de
// ontwerpstudio. De schermafdrukken maakt opname-w01.cjs (render/, met maten.json); dit script zet ze op de platen.
//   node pakketten/2026-10-28-W01-entree/bron/opname-w01.cjs
//   node pakketten/2026-10-28-W01-entree/bron/maak-w01.cjs
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { start } = require('../../../gereedschap/browser.cjs');
const sharp = require('sharp');

const BRON = __dirname.split(path.sep).join('/') + '/';
const UIT = BRON.replace(/bron\/$/, '');
const R = BRON + 'render/';
const FONT = pathToFileURL(path.join(__dirname, '..', '..', '..', 'platen', 'fonts')).href + '/'; // platen/fonts in deze repo
const url = p => { const [bestand, hash] = p.split('#'); return pathToFileURL(bestand).href + (hash ? '#' + hash : ''); }; // bestand -> file-adres, ook met #deel
const M = JSON.parse(fs.readFileSync(R + 'maten.json', 'utf8'));

// ------------------------------------------------------------------ platen (zelfde CSS als K02/K03)
const CSS = `
@font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; background: #F2ECE2 url('beelden/achtergrond-medaillon.png') 0 0 / 1080px 1350px no-repeat; overflow: hidden; }
.plaat { position: relative; width: 1080px; height: 1350px; padding: 60px 72px 50px; display: flex; flex-direction: column; color: #141414; font-family: 'Mont'; overflow: hidden; }
.label { font: 500 25px/1 'Mont'; letter-spacing: .2em; text-transform: uppercase; color: #86682F; }
h1 { font: 400 58px/1.12 'Playfair'; letter-spacing: -.005em; margin-top: 24px; }
.sub { font: 400 31px/1.42 'Mont'; color: #3A322B; margin-top: 20px; }
.midden { flex: 1; margin-top: 30px; position: relative; display: flex; flex-direction: column; justify-content: center; min-height: 0; }
.browser { position: relative; background: #1F1B17; border-radius: 14px; padding: 0 10px 10px; box-shadow: 0 30px 60px rgba(46,32,18,.22), 0 2px 6px rgba(46,32,18,.18); }
.browser .balk { height: 36px; display: flex; align-items: center; gap: 9px; padding-left: 8px; }
.browser .balk i { width: 11px; height: 11px; border-radius: 50%; background: #5B5148; }
.browser .balk b { margin-left: 18px; height: 16px; width: 300px; border-radius: 8px; background: #38312B; }
.browser .balk b::after { content: 'yg-digital.nl'; display: block; font: 400 11px/16px 'Mont'; color: #A79A8A; padding-left: 10px; }
.scherm { position: relative; overflow: hidden; border-radius: 3px; }
.scherm > img { display: block; width: 100%; }
.telefoon { position: relative; background: #1A1714; border-radius: 54px; padding: 13px; box-shadow: 0 30px 60px rgba(46,32,18,.26), 0 2px 6px rgba(46,32,18,.2); }
.telefoon .scherm { border-radius: 42px; }
.telefoon::before { content: ''; position: absolute; top: 26px; left: 50%; transform: translateX(-50%); width: 92px; height: 26px; border-radius: 13px; background: #1A1714; z-index: 3; }
.merk { position: absolute; z-index: 4; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%; background: #C9A45C; color: #141414; font: 500 23px/48px 'Mont'; text-align: center; box-shadow: 0 0 0 4px #F2ECE2, 0 6px 16px rgba(0,0,0,.28); }
.legenda { margin-top: 26px; display: grid; gap: 10px; }
.legenda div { display: flex; align-items: center; gap: 18px; font: 400 29px/1.3 'Mont'; color: #28221D; }
.legenda span { flex: 0 0 40px; height: 40px; border-radius: 50%; background: #C9A45C; color: #141414; font: 500 20px/40px 'Mont'; text-align: center; }
.notitie { margin-top: 12px; font: 400 25px/1.3 'Mont'; color: #6A5F55; padding-left: 58px; }
.loep { position: absolute; z-index: 5; border: 3px solid #C9A45C; border-radius: 12px; background: #141414; box-shadow: 0 18px 40px rgba(46,32,18,.28); }
.loep img { display: block; width: 100%; border-radius: 9px; }
.bijschrift { margin-top: 18px; font: 400 23px/1.3 'Mont'; color: #6A5F55; text-align: center; }
.slot { flex: 1; display: flex; align-items: center; gap: 40px; margin-top: 24px; min-height: 0; }
.slot .links { flex: 1; }
.slot .sub { font-size: 30px; margin-top: 26px; }
.slot .bijschrift { text-align: left; margin-top: 30px; }
.voet { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; }
.voet img { height: 54px; display: block; }
.voet .nr { font: 500 22px 'Mont'; letter-spacing: .16em; color: #86682F; }
`;
const merk = (n, x, y) => `<div class="merk" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px">${n}</div>`;
const legenda = regels => `<div class="legenda">${regels.map((t, i) => `<div><span>${i + 1}</span>${t}</div>`).join('')}</div>`;
const voet = nr => `<div class="voet"><img src="beelden/yg-digital-logo-kopbalk-op-licht.svg"><div class="nr">${nr} / 4</div></div>`;
const LABEL = '<div class="label">Eigen werk · yg-digital.nl</div>';
const DONKER = '#141414'; // de site is donker: statusbalk van de telefoon in dezelfde kleur

function browser(shot, B, merken = []) {
  const binnen = B - 20, s = binnen / shot.w;
  return `<div class="browser" style="width:${B}px"><div class="balk"><i></i><i></i><i></i><b></b></div>
    <div class="scherm" style="height:${(shot.h * s).toFixed(1)}px"><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => merk(n, 10 + fx * s, 36 + fy * s)).join('')}</div>`;
}
function telefoon(shot, B, merken = [], stijl = '', balk = DONKER) {
  const binnen = B - 26, s = binnen / shot.w, st = Math.round(B * 0.085);
  return `<div class="telefoon" style="width:${B}px;${stijl}"><div class="scherm" style="height:${(st + shot.h * s).toFixed(1)}px"><div style="height:${st}px; background:${balk}"></div><img src="${shot.src}"></div>
    ${merken.map(([n, fx, fy]) => merk(n, 13 + fx * s, 13 + st + fy * s)).join('')}</div>`;
}
function plaat(inhoud, titel) {
  return `<!doctype html><html lang="nl"><head><title>${titel}</title><meta charset="utf-8"><style>${CSS}</style></head><body><div class="plaat">${inhoud}</div></body></html>`;
}

const KOPPEN = ['De entree van uw bedrijf. Dit is de onze.', 'Wat een bezoeker meteen ziet.', 'Ook op uw telefoon klopt het.', 'Hoe zou uw bedrijf eruitzien?'];

(async () => {
  const b = await start();

  const hero = { src: 'render/laptop-hero.png', w: 1440, h: 900 };
  const onder = { src: 'render/laptop-onder.png', w: M.onder.w, h: M.onder.h };
  const mobHero = { src: 'render/telefoon-hero.png', w: 390, h: 693 };
  const mobOver = { src: 'render/telefoon-over.png', w: 390, h: 693 };
  const studio = { src: 'render/telefoon-studio.png', w: 390, h: 693 };

  // Beeld 2: markeringen op de onderste sectie (maten in css-pixels van de hele pagina, minus de bovenkant van de uitsnede)
  const L = M.laptop, ox = M.onder.x, oy = M.onder.y;
  const merken2 = [
    [1, L.kop.tekstX - ox - 36, L.kop.y - oy + L.kop.h / 2],                                   // links van de kop (echte tekstbreedte)
    [2, L.werkdag.laatsteX + L.werkdag.laatsteW - ox + 42, L.werkdag.laatsteY - oy + 12],         // rechts van en iets onder de korte laatste regel
    [3, L.praten.tekstX - ox - 36, L.praten.y - oy + L.praten.h / 2],                             // links van de regel Liever eerst even praten
  ];
  // Beeld 3: vergroting van de knop "Ontdek YG Launch" uit de telefoonopname (3x resolutie)
  const k = M.telefoonHero.knop, kv = { x: 16, y: k.y - 4, w: 358, h: k.h + 8 };
  await sharp(R + 'telefoon-hero.png').extract({ left: Math.round(kv.x * 3), top: Math.round(kv.y * 3), width: Math.round(kv.w * 3), height: Math.round(kv.h * 3) }).png().toFile(R + 'loep-knop.png');
  const LOEP = 1.9, TL = 290, TR = 370, OVERLAP = 20, MID = 936;
  const loepB = kv.w * LOEP + 6, rechtsMidden = (MID - (TL + TR - OVERLAP)) / 2 + TL - OVERLAP + TR / 2;
  const loepLinks = Math.min(rechtsMidden - loepB / 2, MID + 24 - loepB), loepH = kv.h * LOEP + 6;
  const w = M.telefoonOver.werkdag;

  const platen = [
    // 1. De homepage groot in een laptopvenster
    `${LABEL}<h1>De entree van uw bedrijf.<br>Dit is de onze.</h1>
     <div class="midden">${browser(hero, 1032)}
       <div class="bijschrift">yg-digital.nl, zoals een bezoeker hem vandaag ziet.</div></div>${voet(1)}`,
    // 2. De sectie eronder, met drie markeringen
    `${LABEL}<h1>Wat een bezoeker<br>meteen ziet.</h1>
     <div class="midden" style="justify-content:flex-start">${browser(onder, 1032, merken2)}
       ${legenda(['Websites voor ondernemers, in één zin', 'Antwoord binnen één werkdag', 'Liever bellen of mailen? Het staat erbij'])}</div>${voet(2)}`,
    // 3. Twee telefoons: de bovenkant en de sectie Over YG Digital; de knop vergroot eronder
    `${LABEL}<h1>Ook op uw telefoon<br>klopt het.</h1>
     <div class="midden"><div style="position:relative; margin-bottom:${(loepH - 22 + 20).toFixed(0)}px">
       <div style="display:flex; justify-content:center; align-items:flex-end">
         ${telefoon(mobHero, TL, [[1, 14, 30]], `margin-right:-${OVERLAP}px; margin-bottom:30px; z-index:1`)}
         ${telefoon(mobOver, TR, [[2, w.x - 30, w.y + w.h / 2]], 'z-index:2')}</div>
       <div class="loep" style="width:${loepB.toFixed(0)}px; left:${loepLinks.toFixed(0)}px; top:calc(100% - 22px)"><img src="render/loep-knop.png">${merk(3, -6, loepH / 2)}</div></div>
       ${legenda(['Bellen staat altijd bovenaan', 'Antwoord binnen één werkdag', 'Eén knop: uw eigen ontwerp in vijf minuten'])}</div>${voet(3)}`,
    // 4. Afsluiting: de ingang van de ontwerpstudio
    `<div class="label">YG Digital · ontwerpstudio</div>
     <div class="slot"><div class="links"><h1 style="font-size:64px; margin-top:0">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
       <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
       <div class="bijschrift">Dit is de ingang: in vijf minuten, met uw eigen naam.</div></div>
       ${telefoon(studio, 560)}</div>${voet(4)}`,
  ];

  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (const [i, inhoud] of platen.entries()) {
    const html = BRON + `plaat-${i + 1}.html`;
    fs.writeFileSync(html, plaat(inhoud, `Entree van yg-digital.nl — beeld ${i + 1} — YG Digital`), 'utf8');
    await p.goto(url(html), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const png = await p.screenshot();
    await sharp(png).resize(1080, 1350, { kernel: 'lanczos3' }).jpeg({ quality: 92, mozjpeg: true }).toFile(UIT + `plaat-${i + 1}.jpg`);
    const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
    console.log(`plaat-${i + 1}.jpg${over ? '  LET OP: inhoud loopt over (' + over + ' px)' : ''}`);
  }
  await p.close();

  // Overzicht: vier naast elkaar
  const ov = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
    @font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
    body { margin: 0; background: #E9E2D6; font-family: 'Mont'; color: #141414; }
    .w { padding: 44px 48px 40px; width: max-content; }
    h1 { font: 400 34px 'Playfair'; margin: 0 0 6px; } .s { font-size: 17px; color: #6A5F55; margin-bottom: 28px; }
    .rij { display: flex; gap: 26px; } .k { width: 432px; } .k img { width: 432px; height: 540px; display: block; box-shadow: 0 10px 28px rgba(46,32,18,.18); }
    .n { margin-top: 14px; font: 500 15px 'Mont'; letter-spacing: .16em; color: #86682F; } .t { margin-top: 4px; font-size: 18px; line-height: 1.35; }
  </style></head><body><div class="w"><h1>W01 · Entree van yg-digital.nl (eigen werk)</h1>
  <div class="s">Carrousel van vier beelden, 1080 × 1350 · pakket voor woensdag 28 oktober 2026, 19:00 · niet geplaatst, niet ingepland</div>
  <div class="rij">${KOPPEN.map((k, i) => `<div class="k"><img src="../plaat-${i + 1}.jpg"><div class="n">BEELD ${i + 1}</div><div class="t">${k}</div></div>`).join('')}</div></div></body></html>`;
  fs.writeFileSync(BRON + 'overzicht.html', ov, 'utf8');
  const po = await b.newPage({ viewport: { width: 2000, height: 800 }, deviceScaleFactor: 1 });
  await po.goto(url(BRON + 'overzicht.html'), { waitUntil: 'load' });
  await po.evaluate(() => document.fonts.ready);
  const vak = await po.evaluate(() => { const r = document.querySelector('.w').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await po.setViewportSize(vak);
  await sharp(await po.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(UIT + 'overzicht.jpg');
  await po.close();

  // Telefooncontrole: elk beeld op 390 punten breed
  const tc = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
    body { margin: 0; background: #fff; font-family: 'Mont'; color: #141414; }
    .w { padding: 24px; width: max-content; } .s { font-size: 13px; color: #6A5F55; margin-bottom: 14px; }
    .rij { display: flex; gap: 18px; } .k img { width: 390px; height: 487.5px; display: block; } .n { font: 500 11px 'Mont'; letter-spacing: .14em; color: #86682F; margin-top: 6px; }
  </style></head><body><div class="w"><div class="s">Telefooncontrole: elk beeld zo groot als in de feed op een telefoon van 390 punten breed (weergegeven met dubbele pixeldichtheid).</div>
  <div class="rij">${KOPPEN.map((k, i) => `<div class="k"><img src="../plaat-${i + 1}.jpg"><div class="n">BEELD ${i + 1}</div></div>`).join('')}</div></div></body></html>`;
  fs.writeFileSync(BRON + 'telefooncontrole.html', tc, 'utf8');
  const pt = await b.newPage({ viewport: { width: 1800, height: 600 }, deviceScaleFactor: 2 });
  await pt.goto(url(BRON + 'telefooncontrole.html'), { waitUntil: 'load' });
  await pt.evaluate(() => document.fonts.ready);
  const vak2 = await pt.evaluate(() => { const r = document.querySelector('.w').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await pt.setViewportSize(vak2);
  await sharp(await pt.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(UIT + 'telefooncontrole.jpg');
  await pt.close();

  await b.close();
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
