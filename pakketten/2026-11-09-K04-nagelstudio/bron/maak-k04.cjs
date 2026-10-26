// K04 · Nagelstudio Amarel (fictief), november 2026: vijf carrouselplaten van 1080 x 1350, een overzicht en een
// telefooncontrole, in dezelfde vorm en medaillonstijl als K01–K03. Afgeleid van maak-k03.cjs. Sector van de week: beauty.
// De drie verschilpunten (opdracht 02 §4): afspraakknop bovenaan, reviews in beeld, telefoonnummer als tekst.
//   node pakketten/2026-11-09-K04-nagelstudio/bron/studio-opname.cjs   (beeld 5, live studio, internet nodig)
//   node pakketten/2026-11-09-K04-nagelstudio/bron/maak-k04.cjs
// Gebruikt Chromium of Chrome via gereedschap/browser.cjs en sharp (npm install in de hoofdmap); lettertypen alleen uit
// platen/fonts (Playfair Display en Montserrat, OFL), ook voor de nagebouwde site, zodat pc en cloud hetzelfde renderen.
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { start } = require('../../../gereedschap/browser.cjs');
const sharp = require('sharp');

const BRON = __dirname.split(path.sep).join('/') + '/';
const UIT = BRON.replace(/bron\/$/, '');
const R = BRON + 'render/';
fs.mkdirSync(R, { recursive: true });
const FONT = pathToFileURL(path.join(__dirname, '..', '..', '..', 'platen', 'fonts')).href + '/'; // platen/fonts in deze repo
const url = p => { const [bestand, hash] = p.split('#'); return pathToFileURL(bestand).href + (hash ? '#' + hash : ''); }; // bestand -> file-adres, ook met #deel
const PEXELS = BRON + 'beelden/pexels-4677845-leeloo-the-first.jpg'; // staand, Pexels-licentie

// ------------------------------------------------------------------ uitsneden van de foto
async function fotos() {
  const m = await sharp(PEXELS).metadata();
  // staand (hero in detailstand, bijna vierkant): de handen, de lak en het flesje
  const z = Math.min(m.width, m.height);
  await sharp(PEXELS).extract({ left: 0, top: Math.round((m.height - z) * 0.45), width: z, height: z }).resize({ width: 1400 }).jpeg({ quality: 90, mozjpeg: true }).toFile(BRON + 'beelden/nagelfoto-staand.jpg');
  // liggend (vergelijkingen en telefoon): 3:2 uit het midden
  const h = Math.round(m.width * 2 / 3);
  await sharp(PEXELS).extract({ left: 0, top: Math.round((m.height - h) * 0.45), width: m.width, height: h }).resize({ width: 1600 }).jpeg({ quality: 90, mozjpeg: true }).toFile(BRON + 'beelden/nagelfoto-liggend.jpg');
}

// ------------------------------------------------------------------ schermafdrukken van de ontwerpen
async function scherm(browser, { bestand, w, h, dpr, clipH, voor, meet }) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto(url(BRON + bestand), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  if (voor) await p.evaluate(voor);
  await p.waitForTimeout(200);
  const maten = await p.evaluate(sels => Object.fromEntries(Object.entries(sels).map(([k, s]) => {
    const r = document.querySelector(s).getBoundingClientRect(); return [k, { x: r.x, y: r.y, w: r.width, h: r.height }];
  })), meet || {});
  const naam = bestand.replace(/\.html.*$/, '') + (voor ? '-2' : '') + '.png';
  await p.screenshot({ path: R + naam, ...(clipH && clipH > h ? { fullPage: true, clip: { x: 0, y: 0, width: w, height: clipH } } : {}) });
  await p.close();
  return { src: 'render/' + naam, w, h: clipH || h, maten };
}

// ------------------------------------------------------------------ platen
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
.loep { position: absolute; z-index: 5; border: 3px solid #C9A45C; border-radius: 12px; background: #F6F1E9; box-shadow: 0 18px 40px rgba(46,32,18,.28); }
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
const voet = nr => `<div class="voet"><img src="beelden/yg-digital-logo-kopbalk-op-licht.svg"><div class="nr">${nr} / 5</div></div>`;
const LABEL = '<div class="label">Conceptproject · fictieve nagelstudio</div>';

// Browser met schermafdruk op breedte B (buitenmaat), met markeringen op meetpunten van de schermafdruk
function browser(shot, B, merken = []) {
  const binnen = B - 20, s = binnen / shot.w;
  return `<div class="browser" style="width:${B}px"><div class="balk"><i></i><i></i><i></i><b></b></div>
    <div class="scherm" style="height:${(shot.h * s).toFixed(1)}px"><img src="${shot.src}"></div>${merken.map(([n, fx, fy]) => merk(n, 10 + fx * s, 36 + fy * s)).join('')}</div>`;
}
// Telefoon met een statusbalk bovenin, zodat het cameraeiland niet over de pagina valt
function telefoon(shot, B, merken = [], stijl = '', balk = '#F6F1E9') {
  const binnen = B - 26, s = binnen / shot.w, st = Math.round(B * 0.085);
  return `<div class="telefoon" style="width:${B}px;${stijl}"><div class="scherm" style="height:${(st + shot.h * s).toFixed(1)}px"><div style="height:${st}px; background:${balk}"></div><img src="${shot.src}"></div>
    ${merken.map(([n, fx, fy]) => merk(n, 13 + fx * s, 13 + st + fy * s)).join('')}</div>`;
}
function plaat(inhoud, titel) {
  return `<!doctype html><html lang="nl"><head><title>${titel}</title><meta charset="utf-8"><style>${CSS}</style></head><body><div class="plaat">${inhoud}</div></body></html>`;
}

const KOPPEN = ['Precies werk, nagel voor nagel. Laat uw website dat ook zien.', 'Dezelfde studio. Een onduidelijke eerste indruk.', 'Meer overzicht. Meteen een afspraak.', 'Ook op uw telefoon klopt het.', 'Hoe zou uw bedrijf eruitzien?'];

(async () => {
  await fotos();
  const b = await start();

  // Beeld 1: het sterke ontwerp in detailstand (#detail): de foto domineert en loopt tot de rechterrand.
  const na0 = await scherm(b, { bestand: 'studio-na.html#detail', w: 1100, h: 900, dpr: 2, clipH: 1000, voor: () => document.body.classList.add('detail'), meet: { held: '.held' } });
  const heroOnder = Math.round(na0.maten.held.y + na0.maten.held.h);
  await sharp(BRON + na0.src).extract({ left: 0, top: 0, width: 2200, height: heroOnder * 2 }).png().toFile(R + 'studio-na-detail.png');
  const na = { src: 'render/studio-na-detail.png', w: 1100, h: heroOnder };
  // Beeld 2 en 3: dezelfde compacte uitsnede (760 x 640) van beide ontwerpen. Gemeten: menu, afspraakknop, reviews, telefoon.
  const vna = await scherm(b, { bestand: 'vergelijk-na.html', w: 760, h: 640, dpr: 3,
    meet: { menu: '#menu', afspraak: '#afspraak', reviews: '#reviews', telefoon: '#telefoon' } });
  const vvoor = await scherm(b, { bestand: 'vergelijk-voor.html', w: 760, h: 640, dpr: 3,
    meet: { menu: '#menu', reviews: '#reviews', telefoon: '#telefoon' } });
  const mob1 = await scherm(b, { bestand: 'studio-mobiel.html', w: 390, h: 693, dpr: 3 });
  const mob2 = await scherm(b, { bestand: 'studio-mobiel.html#lijst', w: 390, h: 693, dpr: 3,
    voor: () => { document.body.classList.add('lijst'); const s = document.getElementById('behandelingen'); window.scrollTo(0, s.offsetTop - 64); },
    meet: { reviews: '#reviews', vast: '.vast .knoppen' } });
  // Vergroting van de vaste balk met Afspraak maken en Bellen (uitsnede uit dezelfde schermafdruk, 3x resolutie)
  const t = mob2.maten, kv = { x: t.vast.x - 6, y: t.vast.y - 6, w: t.vast.w + 12, h: t.vast.h + 12 };
  await sharp(BRON + mob2.src).extract({ left: Math.round(kv.x * 3), top: Math.round(kv.y * 3), width: Math.round(kv.w * 3), height: Math.round(kv.h * 3) }).png().toFile(R + 'loep-afspraak.png');
  const LOEP = 1.9;
  // Beeld 5: echt resultaat uit de live ontwerpstudio (zie studio-opname.cjs)
  const sm = await sharp(BRON + 'beelden/studio-resultaat-amarel.png').metadata();
  const studio = { src: 'beelden/studio-resultaat-amarel.png', w: 390, h: Math.round(sm.height * 390 / sm.width), maten: {} };

  const a = vna.maten, z = vvoor.maten;
  // Markeringen. Zwak: 1 aan het eind van het menu (daar staat geen afspraakknop), 2 links van de fotostrook (daar
  // horen de reviews), 3 links van het plaatje met het telefoonnummer. Sterk: 1 onder de afspraakknop, 2 links van
  // het reviewblok, 3 onder het telefoonnummer.
  const merkenZwak = [[1, z.menu.x + z.menu.w - 14, z.menu.y + z.menu.h + 22], [2, z.reviews.x - 18, z.reviews.y + z.reviews.h / 2], [3, z.telefoon.x + 18, z.telefoon.y - 4]];
  const merkenSterk = [[1, a.afspraak.x + a.afspraak.w / 2, a.afspraak.y + a.afspraak.h + 26], [2, a.reviews.x - 18, a.reviews.y + a.reviews.h / 2], [3, a.telefoon.x + a.telefoon.w + 28, a.telefoon.y + a.telefoon.h / 2]];
  // Beeld 4: maten van de twee telefoons en de vergroting eronder, rechts uitgelijnd op de rechtertelefoon
  const TL = 296, TR = 380, OVERLAP = 20, MID = 936;
  const loepB = kv.w * LOEP + 6, rechtsMidden = (MID - (TL + TR - OVERLAP)) / 2 + TL - OVERLAP + TR / 2;
  const loepLinks = Math.min(rechtsMidden - loepB / 2, MID + 24 - loepB), loepH = kv.h * LOEP + 6;
  const VAST = 'style="justify-content:flex-start"';
  const platen = [
    // 1. Het sterke ontwerp groot; de foto domineert en loopt met het venster rechts van de plaat af
    `${LABEL}<h1>Precies werk, nagel voor nagel.<br>Laat uw website dat ook zien.</h1>
     <div class="midden">${browser(na, 1032)}</div>${voet(1)}`,
    // 2. Het minder sterke ontwerp (venster op vaste hoogte, gelijk aan beeld 3)
    `${LABEL}<h1>Dezelfde studio.<br>Een onduidelijke eerste indruk.</h1>
     <div class="midden" ${VAST}>${browser(vvoor, 820, merkenZwak)}
       ${legenda(['Geen afspraakknop bovenaan', 'Geen reviews te zien', 'Telefoonnummer in een plaatje'])}</div>${voet(2)}`,
    // 3. De verbeterde versie: zelfde uitsnede, schaal en foto
    `${LABEL}<h1>Meer overzicht.<br>Meteen een afspraak.</h1>
     <div class="midden" ${VAST}>${browser(vna, 820, merkenSterk)}
       ${legenda(['Afspraak maken, meteen bovenaan', 'Reviews direct in beeld', 'Telefoonnummer als tekst: tik en bel'])}
       <div class="notitie">Zelfde studio, foto en behandelingen als op het vorige beeld.</div></div>${voet(3)}`,
    // 4. De telefoon; de vaste balk met Afspraak maken blijft zichtbaar en staat vergroot eronder
    `${LABEL}<h1>Ook op uw telefoon<br>klopt het.</h1>
     <div class="midden"><div style="position:relative; margin-bottom:${(loepH - 22 + 20).toFixed(0)}px">
       <div style="display:flex; justify-content:center; align-items:flex-end">
         ${telefoon(mob1, TL, [], `margin-right:-${OVERLAP}px; margin-bottom:30px; z-index:1`)}
         ${telefoon(mob2, TR, [[1, t.reviews.x - 30, t.reviews.y + t.reviews.h / 2]], 'z-index:2')}</div>
       <div class="loep" style="width:${loepB.toFixed(0)}px; left:${loepLinks.toFixed(0)}px; top:calc(100% - 22px)"><img src="render/loep-afspraak.png">${merk(2, -6, loepH / 2)}</div></div>
       ${legenda(['Reviews boven de behandelingen', 'Afspraak maken blijft altijd in beeld'])}</div>${voet(4)}`,
    // 5. Afsluiting met een echt studioresultaat, groot genoeg om te lezen
    `<div class="label">YG Digital · ontwerpstudio</div>
     <div class="slot"><div class="links"><h1 style="font-size:64px; margin-top:0">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
       <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
       <div class="bijschrift">Dit voorbeeld maakt u zelf in onze ontwerpstudio.</div></div>
       ${telefoon(studio, 560, [], '', '#F1EBE2')}</div>${voet(5)}`,
  ];

  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (const [i, inhoud] of platen.entries()) {
    const html = BRON + `plaat-${i + 1}.html`;
    fs.writeFileSync(html, plaat(inhoud, `Nagelstudio Amarel — beeld ${i + 1} — YG Digital`), 'utf8');
    await p.goto(url(html), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const png = await p.screenshot();
    await sharp(png).resize(1080, 1350, { kernel: 'lanczos3' }).jpeg({ quality: 92, mozjpeg: true }).toFile(UIT + `plaat-${i + 1}.jpg`);
    const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
    console.log(`plaat-${i + 1}.jpg${over ? '  LET OP: inhoud loopt over (' + over + ' px)' : ''}`);
  }
  await p.close();

  // Overzicht: vijf naast elkaar
  const ov = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
    @font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
    body { margin: 0; background: #E9E2D6; font-family: 'Mont'; color: #141414; }
    .w { padding: 44px 48px 40px; width: max-content; }
    h1 { font: 400 34px 'Playfair'; margin: 0 0 6px; } .s { font-size: 17px; color: #6A5F55; margin-bottom: 28px; }
    .rij { display: flex; gap: 26px; } .k { width: 432px; } .k img { width: 432px; height: 540px; display: block; box-shadow: 0 10px 28px rgba(46,32,18,.18); }
    .n { margin-top: 14px; font: 500 15px 'Mont'; letter-spacing: .16em; color: #86682F; } .t { margin-top: 4px; font-size: 18px; line-height: 1.35; }
  </style></head><body><div class="w"><h1>K04 · Nagelstudio Amarel (fictief)</h1>
  <div class="s">Carrousel van vijf beelden, 1080 × 1350 · pakket voor maandag 9 november 2026, 19:00 · niet geplaatst, niet ingepland</div>
  <div class="rij">${KOPPEN.map((k, i) => `<div class="k"><img src="../plaat-${i + 1}.jpg"><div class="n">BEELD ${i + 1}</div><div class="t">${k}</div></div>`).join('')}</div></div></body></html>`;
  fs.writeFileSync(BRON + 'overzicht.html', ov, 'utf8');
  const po = await b.newPage({ viewport: { width: 2400, height: 800 }, deviceScaleFactor: 1 });
  await po.goto(url(BRON + 'overzicht.html'), { waitUntil: 'load' });
  await po.evaluate(() => document.fonts.ready);
  const vak = await po.evaluate(() => { const r = document.querySelector('.w').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await po.setViewportSize(vak);
  await sharp(await po.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(UIT + 'overzicht.jpg');
  await po.close();

  // Telefooncontrole: elk beeld op 390 punten breed, zoals in de feed (scherm met dubbele dichtheid)
  const tc = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
    @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
    body { margin: 0; background: #fff; font-family: 'Mont'; color: #141414; }
    .w { padding: 24px; width: max-content; } .s { font-size: 13px; color: #6A5F55; margin-bottom: 14px; }
    .rij { display: flex; gap: 18px; } .k img { width: 390px; height: 487.5px; display: block; } .n { font: 500 11px 'Mont'; letter-spacing: .14em; color: #86682F; margin-top: 6px; }
  </style></head><body><div class="w"><div class="s">Telefooncontrole: elk beeld zo groot als in de feed op een telefoon van 390 punten breed (weergegeven met dubbele pixeldichtheid).</div>
  <div class="rij">${KOPPEN.map((k, i) => `<div class="k"><img src="../plaat-${i + 1}.jpg"><div class="n">BEELD ${i + 1}</div></div>`).join('')}</div></div></body></html>`;
  fs.writeFileSync(BRON + 'telefooncontrole.html', tc, 'utf8');
  const pt = await b.newPage({ viewport: { width: 2200, height: 600 }, deviceScaleFactor: 2 });
  await pt.goto(url(BRON + 'telefooncontrole.html'), { waitUntil: 'load' });
  await pt.evaluate(() => document.fonts.ready);
  const vak2 = await pt.evaluate(() => { const r = document.querySelector('.w').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  await pt.setViewportSize(vak2);
  await sharp(await pt.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(UIT + 'telefooncontrole.jpg');
  await pt.close();

  await b.close();
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
