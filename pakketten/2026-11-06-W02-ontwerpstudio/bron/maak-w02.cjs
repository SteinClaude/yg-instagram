// W02 · de ontwerpstudio (eigen werk), november 2026: vijf carrouselplaten van 1080 x 1350 in dezelfde vorm en
// medaillonstijl als K01–K03 en W01, met echte schermafdrukken van yg-digital.nl/eerste-ontwerp op telefoonmaat
// (opname-w02.cjs). Geen reel: R17 bestaat al.
//   node pakketten/2026-11-06-W02-ontwerpstudio/bron/opname-w02.cjs
//   node pakketten/2026-11-06-W02-ontwerpstudio/bron/maak-w02.cjs
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { start } = require('../../../gereedschap/browser.cjs');
const sharp = require('sharp');

const BRON = __dirname.split(path.sep).join('/') + '/';
const UIT = BRON.replace(/bron\/$/, '');
const R = BRON + 'render/';
const FONT = pathToFileURL(path.join(__dirname, '..', '..', '..', 'platen', 'fonts')).href + '/'; // platen/fonts in deze repo
const url = p => { const [bestand, hash] = p.split('#'); return pathToFileURL(bestand).href + (hash ? '#' + hash : ''); }; // bestand -> file-adres, ook met #deel

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
.midden { flex: 1; margin-top: 30px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; }
.telefoon { position: relative; background: #1A1714; border-radius: 54px; padding: 13px; box-shadow: 0 30px 60px rgba(46,32,18,.26), 0 2px 6px rgba(46,32,18,.2); }
.scherm { position: relative; overflow: hidden; border-radius: 42px; }
.scherm > img { display: block; width: 100%; }
.telefoon::before { content: ''; position: absolute; top: 26px; left: 50%; transform: translateX(-50%); width: 92px; height: 26px; border-radius: 13px; background: #1A1714; z-index: 3; }
.bijschrift { margin-top: 26px; font: 400 25px/1.35 'Mont'; color: #6A5F55; text-align: center; max-width: 820px; }
.slot { flex: 1; display: flex; align-items: center; gap: 40px; margin-top: 24px; min-height: 0; }
.slot .links { flex: 1; }
.slot .sub { font-size: 30px; margin-top: 26px; }
.slot .bijschrift { text-align: left; margin-top: 30px; font-size: 23px; }
.voet { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; }
.voet img { height: 54px; display: block; }
.voet .nr { font: 500 22px 'Mont'; letter-spacing: .16em; color: #86682F; }
`;
const voet = nr => `<div class="voet"><img src="beelden/yg-digital-logo-kopbalk-op-licht.svg"><div class="nr">${nr} / 5</div></div>`;
const LABEL = '<div class="label">YG Digital · ontwerpstudio</div>';
const DONKER = '#141414';
function telefoon(shot, B, stijl = '', balk = DONKER) {
  const binnen = B - 26, s = binnen / shot.w, st = Math.round(B * 0.085);
  return `<div class="telefoon" style="width:${B}px;${stijl}"><div class="scherm" style="height:${(st + shot.h * s).toFixed(1)}px"><div style="height:${st}px; background:${balk}"></div><img src="${shot.src}"></div></div>`;
}
const plaat = (inhoud, titel) => `<!doctype html><html lang="nl"><head><title>${titel}</title><meta charset="utf-8"><style>${CSS}</style></head><body><div class="plaat">${inhoud}</div></body></html>`;

const KOPPEN = ['Uw website zien, voordat u iets beslist.', 'Stap één: uw naam en uw vak.', 'Stap twee: kies een sfeer.', 'Daar staat hij: uw eerste ontwerp.', 'Hoe zou uw bedrijf eruitzien?'];

(async () => {
  const maat = async f => { const m = await sharp(R + f).metadata(); return { src: 'render/' + f, w: 390, h: Math.round(m.height * 390 / m.width) }; };
  const ingang = await maat('1-ingang.png'), stap1 = await maat('2-stap1-naam-vak.png'), stap2 = await maat('3-stap2-sfeer.png'), resultaat = await maat('4-resultaat.png'), volledig = await maat('5-volledig-scherm.png');
  const platen = [
    // 1. De ingang
    `${LABEL}<div class="slot"><div class="links"><h1 style="font-size:62px; margin-top:0">Uw website zien,<br>voordat u<br>iets beslist.</h1>
       <div class="sub">In vijf minuten, met uw eigen naam. Geen account nodig.</div>
       <div class="bijschrift">Dit is de ingang van onze ontwerpstudio.</div></div>
       ${telefoon(ingang, 560)}</div>${voet(1)}`,
    // 2. Stap één
    `${LABEL}<h1>Stap één:<br>uw naam en uw vak.</h1>
     <div class="midden">${telefoon(stap1, 470)}<div class="bijschrift">Uw bedrijfsnaam komt letterlijk op de website.</div></div>${voet(2)}`,
    // 3. Stap twee
    `${LABEL}<h1>Stap twee:<br>kies een sfeer.</h1>
     <div class="midden">${telefoon(stap2, 470)}<div class="bijschrift">Acht sferen, elk een eigen website, met uw naam erin.</div></div>${voet(3)}`,
    // 4. Het ontwerp op volledig scherm
    `${LABEL}<h1>Daar staat hij:<br>uw eerste ontwerp.</h1>
     <div class="midden">${telefoon(volledig, 470)}<div class="bijschrift">Op ware grootte. Bevalt het, dan praten we verder.</div></div>${voet(4)}`,
    // 5. Afsluiting: het resultaat met de knop Bewaar ontwerp
    `${LABEL}<div class="slot"><div class="links"><h1 style="font-size:64px; margin-top:0">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
       <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
       <div class="bijschrift">Vrijblijvend. U bewaart het ontwerp, of laat het staan.</div></div>
       ${telefoon(resultaat, 560)}</div>${voet(5)}`,
  ];

  const b = await start();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (const [i, inhoud] of platen.entries()) {
    const html = BRON + `plaat-${i + 1}.html`;
    fs.writeFileSync(html, plaat(inhoud, `Ontwerpstudio — beeld ${i + 1} — YG Digital`), 'utf8');
    await p.goto(url(html), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const png = await p.screenshot();
    await sharp(png).resize(1080, 1350, { kernel: 'lanczos3' }).jpeg({ quality: 92, mozjpeg: true }).toFile(UIT + `plaat-${i + 1}.jpg`);
    const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
    console.log(`plaat-${i + 1}.jpg${over ? '  LET OP: inhoud loopt over (' + over + ' px)' : ''}`);
  }
  await p.close();

  const vel = async (naam, breedte, hoogte, gat, achtergrond, kop) => {
    const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
      @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
      @font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
      @font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
      body { margin: 0; background: ${achtergrond}; font-family: 'Mont'; color: #141414; }
      .w { padding: 40px; width: max-content; } h1 { font: 400 32px 'Playfair'; margin: 0 0 6px; } .s { font-size: 16px; color: #6A5F55; margin-bottom: 24px; }
      .rij { display: flex; gap: ${gat}px; } .k img { width: ${breedte}px; height: ${hoogte}px; display: block; box-shadow: 0 10px 28px rgba(46,32,18,.18); }
      .n { margin-top: 12px; font: 500 14px 'Mont'; letter-spacing: .16em; color: #86682F; } .t { margin-top: 4px; font-size: 17px; line-height: 1.35; max-width: ${breedte}px; }
    </style></head><body><div class="w">${kop}<div class="rij">${KOPPEN.map((k, i) => `<div class="k"><img src="../plaat-${i + 1}.jpg"><div class="n">BEELD ${i + 1}</div><div class="t">${k}</div></div>`).join('')}</div></div></body></html>`;
    fs.writeFileSync(BRON + naam + '.html', html, 'utf8');
    const q = await b.newPage({ viewport: { width: 2400, height: 800 }, deviceScaleFactor: naam === 'telefooncontrole' ? 2 : 1 });
    await q.goto(url(BRON + naam + '.html'), { waitUntil: 'load' });
    await q.evaluate(() => document.fonts.ready);
    const vak = await q.evaluate(() => { const r = document.querySelector('.w').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
    await q.setViewportSize(vak);
    await sharp(await q.screenshot()).jpeg({ quality: 90, mozjpeg: true }).toFile(UIT + naam + '.jpg');
    await q.close();
  };
  await vel('overzicht', 400, 500, 24, '#E9E2D6', '<h1>W02 · De ontwerpstudio (eigen werk)</h1><div class="s">Carrousel van vijf beelden, 1080 × 1350 · pakket voor vrijdag 6 november 2026, 19:00 · niet geplaatst, niet ingepland</div>');
  await vel('telefooncontrole', 390, 487.5, 18, '#ffffff', '<div class="s">Telefooncontrole: elk beeld zo groot als in de feed op een telefoon van 390 punten breed (weergegeven met dubbele pixeldichtheid).</div>');
  await b.close();
  console.log('overzicht.jpg en telefooncontrole.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
