// Champagne-voorbeelden bij docs/stijlgids.md §4–§5, op verzoek van Andries (26 okt: "ga voor de rest verder met het
// ontwerp voor het uiterlijk"). Eén project (het fictieve schildersbedrijf van K03) in zes platen: de vier vormen van
// plaat 1 (Foto, Telefoon, Detail, Venster), een tussenplaat zonder medaillon en een slotplaat. Kop op plaat 1 hooguit vijf
// woorden op ≥ 84 px; medaillon alleen op plaat 1 en de slotplaat, met een ivoren waas (± 40 % lichter).
// Gebruikt de schermafdrukken in pakketten/2026-10-26-K03-schilder/bron/render (maak die met maak-k03.cjs als ze ontbreken).
// Geen pakketten, niets wordt ingepland.
//   node gereedschap/stijlproef-champagne.cjs   → preview/stijlgids/champagne-*.jpg en champagne-overzicht.jpg
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const sharp = require('sharp');
const { start } = require('./browser.cjs');

const W = path.join(__dirname, '..');
const UIT = path.join(W, 'preview', 'stijlgids');
const K3 = path.join(W, 'pakketten', '2026-10-26-K03-schilder', 'bron');
const R = path.join(K3, 'render'), BLD = path.join(K3, 'beelden');
const FONT = pathToFileURL(path.join(W, 'platen', 'fonts')).href + '/';
const uri = p => pathToFileURL(p).href;
fs.mkdirSync(UIT, { recursive: true });

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
h1 { font: 400 92px/1.04 'Playfair'; letter-spacing: -.01em; margin-top: 26px; }
h1 em { font-style: italic; color: #86682F; }
h2 { font: 400 62px/1.1 'Playfair'; margin-top: 24px; }
.sub { font: 400 30px/1.4 'Mont'; color: #3A322B; margin-top: 22px; }
.midden { flex: 1; margin-top: 40px; position: relative; min-height: 0; display: flex; flex-direction: column; justify-content: center; }
.schaduw { box-shadow: 0 30px 60px rgba(46,32,18,.22), 0 2px 6px rgba(46,32,18,.18); }
.foto { flex: 1; background-position: center 40%; background-size: cover; border-radius: 6px; position: relative; }
.foto::after { content: ''; position: absolute; inset: 18px; border: 1px solid rgba(251,248,243,.6); border-radius: 3px; }
.naamkaart { position: absolute; left: 34px; bottom: 30px; background: rgba(251,248,243,.94); padding: 16px 22px; font: 400 30px 'Playfair'; color: #231D18; border-radius: 3px; }
.naamkaart small { display: block; font: 500 12px 'Mont'; letter-spacing: .3em; color: #9C7636; margin-bottom: 6px; }
.telefoon { position: relative; background: #1A1714; border-radius: 54px; padding: 13px; }
.telefoon .scherm { border-radius: 42px; overflow: hidden; background: #F6F1E9; }
.telefoon .scherm img { display: block; width: 100%; }
.telefoon::before { content: ''; position: absolute; top: 26px; left: 50%; transform: translateX(-50%); width: 92px; height: 26px; border-radius: 13px; background: #1A1714; z-index: 3; }
.browser { background: #1F1B17; border-radius: 14px; padding: 0 10px 10px; }
.browser .balk { height: 36px; display: flex; align-items: center; gap: 9px; padding-left: 8px; }
.browser .balk i { width: 11px; height: 11px; border-radius: 50%; background: #5B5148; }
.browser .scherm { overflow: hidden; border-radius: 3px; } .browser .scherm img { display: block; width: 100%; }
.loep { border: 3px solid #C9A45C; border-radius: 14px; background: #F6F1E9; overflow: hidden; }
.loep img { display: block; width: 100%; }
.legenda { margin-top: 30px; display: grid; gap: 12px; }
.legenda div { display: flex; align-items: center; gap: 18px; font: 400 30px/1.3 'Mont'; color: #28221D; }
.legenda span { flex: 0 0 42px; height: 42px; border-radius: 50%; background: #C9A45C; color: #141414; font: 500 21px/42px 'Mont'; text-align: center; }
.notitie { margin-top: 16px; font: 400 24px/1.35 'Mont'; color: #6A5F55; }
.rij { display: flex; align-items: center; gap: 44px; flex: 1; min-height: 0; }
.voet { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; height: 54px; }
.voet img { height: 54px; } .voet .nr { font: 500 22px 'Mont'; letter-spacing: .16em; color: #86682F; }
`;
const LABEL = '<div class="label">Conceptproject · fictief schildersbedrijf</div>';
const voet = nr => `<div class="voet"><img src="${uri(path.join(BLD, 'yg-digital-logo-kopbalk-op-licht.svg'))}"><div class="nr">${nr} / 5</div></div>`;
const img = f => uri(path.join(R, f));
const telefoon = (src, breedte, stijl = '') => `<div class="telefoon schaduw" style="width:${breedte}px;${stijl}"><div class="scherm"><div style="height:${Math.round(breedte * .085)}px"></div><img src="${src}"></div></div>`;

const PLATEN = [
  { naam: 'champagne-1-foto', titel: 'Plaat 1 · vorm Foto', medaillon: true, html: `${LABEL}
    <h1>Strak geschilderd.<br><em>Ook online.</em></h1>
    <div class="midden" style="margin-top:44px"><div class="foto schaduw" style="background-image:url('${uri(path.join(BLD, 'schildersfoto-staand.jpg'))}')"></div>
      <div class="naamkaart"><small>SCHILDERWERK · ALKMAAR</small>Schildersbedrijf Hollenbeek</div></div>${voet(1)}` },
  { naam: 'champagne-1-telefoon', titel: 'Plaat 1 · vorm Telefoon', medaillon: true, html: `${LABEL}
    <div class="rij"><div style="flex:1"><h1 style="margin-top:0">Eén tik<br>en u<br><em>belt.</em></h1>
      <div class="sub">De vakman, gewoon op uw telefoon.</div></div>
      ${telefoon(img('schilder-mobiel-2.png'), 540, 'transform:rotate(3deg); margin-right:-30px')}</div>${voet(1)}` },
  { naam: 'champagne-1-detail', titel: 'Plaat 1 · vorm Detail', medaillon: true, html: `${LABEL}
    <h1>Bellen staat<br><em>altijd in beeld.</em></h1>
    <div class="midden"><div class="loep schaduw" style="border-radius:28px"><img src="${uri(path.join(UIT, '_detail-uitsnede.png'))}"></div>
      <div class="notitie" style="text-align:center; margin-top:22px">De onderkant van de telefoonversie, vergroot.</div></div>${voet(1)}` },
  { naam: 'champagne-1-venster', titel: 'Plaat 1 · vorm Venster', medaillon: true, html: `${LABEL}
    <h1>Vakwerk,<br><em>ook op uw site.</em></h1>
    <div class="midden"><div class="browser schaduw" style="width:1032px"><div class="balk"><i></i><i></i><i></i></div><div class="scherm"><img src="${img('schilder-na-detail.png')}"></div></div></div>${voet(1)}` },
  { naam: 'champagne-tussen', titel: 'Tussenplaat · zonder medaillon', medaillon: false, html: `${LABEL}
    <h2>Meer overzicht.<br>Eén tik om te bellen.</h2>
    <div class="midden" style="justify-content:flex-start"><div class="browser schaduw" style="width:880px"><div class="balk"><i></i><i></i><i></i></div><div class="scherm"><img src="${img('vergelijk-na.png')}"></div></div>
      <div class="legenda"><div><span>1</span>Een kort, rustig menu</div><div><span>2</span>Diensten met doorlooptijd</div><div><span>3</span>Bellen valt meteen op</div></div></div>${voet(3)}` },
  { naam: 'champagne-slot', titel: 'Slotplaat · licht medaillon', medaillon: true, html: `<div class="label">YG Digital · ontwerpstudio</div>
    <div class="rij"><div style="flex:1"><h1 style="margin-top:0; font-size:76px">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
      <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div></div>
      ${telefoon(uri(path.join(BLD, 'studio-resultaat-hollenbeek.png')), 520)}</div>${voet(5)}` },
];

(async () => {
  for (const f of ['schilder-mobiel-2.png', 'loep-bellen.png', 'schilder-na-detail.png', 'vergelijk-na.png'])
    if (!fs.existsSync(path.join(R, f))) throw new Error(`ontbreekt: ${f} — draai eerst node pakketten/2026-10-26-K03-schilder/bron/maak-k03.cjs`);
  // Detail: de onderste helft van de telefoonversie (diensten en de vaste balk met Bellen), als uitsnede
  const m = await sharp(path.join(R, 'schilder-mobiel-2.png')).metadata();
  const hoog = Math.round(m.width * 0.82);
  await sharp(path.join(R, 'schilder-mobiel-2.png')).extract({ left: 0, top: m.height - hoog, width: m.width, height: hoog }).png().toFile(path.join(UIT, '_detail-uitsnede.png'));
  const b = await start();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  const tmp = path.join(UIT, '_proef.html');
  for (const pl of PLATEN) {
    fs.writeFileSync(tmp, `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>${CSS}</style></head><body class="${pl.medaillon ? 'medaillon' : ''}"><div class="plaat">${pl.html}</div></body></html>`, 'utf8');
    await p.goto(uri(tmp), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const over = await p.evaluate(() => { const d = document.querySelector('.plaat'); return d.scrollHeight > 1350 ? d.scrollHeight : 0; });
    await sharp(await p.screenshot()).resize(1080, 1350).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, pl.naam + '.jpg'));
    console.log(pl.naam + '.jpg' + (over ? `  LET OP: loopt over (${over})` : ''));
  }
  fs.unlinkSync(tmp); fs.unlinkSync(path.join(UIT, '_detail-uitsnede.png'));
  await b.close();
  // overzicht, drie per rij, met onderschrift
  const B = 360, H = 450, GAT = 24, RAND = 36, ONDER = 44, PER = 3, rijen = Math.ceil(PLATEN.length / PER), lagen = [];
  for (const [i, pl] of PLATEN.entries()) {
    const x = RAND + (i % PER) * (B + GAT), y = RAND + Math.floor(i / PER) * (H + ONDER + GAT);
    lagen.push({ input: await sharp(path.join(UIT, pl.naam + '.jpg')).resize(B, H).toBuffer(), left: x, top: y });
    lagen.push({ input: Buffer.from(`<svg width="${B}" height="${ONDER}"><text x="0" y="28" font-family="Arial" font-size="17" fill="#6A5F55">${pl.titel}</text></svg>`), left: x, top: y + H + 4 });
  }
  await sharp({ create: { width: PER * B + (PER - 1) * GAT + 2 * RAND, height: rijen * (H + ONDER) + (rijen - 1) * GAT + 2 * RAND, channels: 3, background: '#E9E2D6' } })
    .composite(lagen).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'champagne-overzicht.jpg'));
  console.log('champagne-overzicht.jpg');
})().catch(e => { console.error(e); process.exit(1); });
