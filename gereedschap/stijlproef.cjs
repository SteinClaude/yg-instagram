// Proeven bij docs/stijlgids.md (versie 1, 26 okt 2026): drie voorbeeldplaten volgens de nieuwe regels en één week in
// het raster, nu en volgens de gids. Geen pakketten, niets wordt ingepland.
//   node gereedschap/stijlproef.cjs        → preview/stijlgids/*.jpg
// Bouwstenen: platen/maak.cjs (kaart, voor de nachtplaten) en gereedschap/browser.cjs (html, voor de champagneplaat).
// Beeld van de champagneplaat: de salonfoto van K04 (Salon Lindaveer, fictief; Pexels-licentie), alleen als voorbeeld.
'use strict';
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const sharp = require('sharp');
const { kaart } = require('../platen/maak.cjs');
const { start } = require('./browser.cjs');

const WORTEL = path.join(__dirname, '..');
const UIT = path.join(WORTEL, 'preview', 'stijlgids');
fs.mkdirSync(UIT, { recursive: true });
const K04 = path.join(WORTEL, 'pakketten', '2026-11-09-K04-salon', 'bron', 'beelden');
const FONT = pathToFileURL(path.join(WORTEL, 'platen', 'fonts')).href + '/';
const uri = p => pathToFileURL(p).href;

// ---------------------------------------------------------------- 1. champagne, plaat 1 in de vorm "Foto"
// Kop ≤ 5 woorden op 88 px, één groot beeld, medaillon met een ivoren waas (± 40 % lichter), label blijft.
const champagne = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Playfair'; src: url('${FONT}PlayfairDisplay-400.ttf'); }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-400.ttf'); font-weight: 400; }
@font-face { font-family: 'Mont'; src: url('${FONT}Montserrat-500.ttf'); font-weight: 500; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; background: #F2ECE2 url('${uri(path.join(K04, 'achtergrond-medaillon.png'))}') 0 0 / 1080px 1350px no-repeat; }
.waas { position: absolute; inset: 0; background: rgba(242, 236, 226, .42); }
.plaat { position: relative; width: 1080px; height: 1350px; padding: 60px 72px 50px; display: flex; flex-direction: column; color: #141414; font-family: 'Mont'; }
.label { font: 500 25px/1 'Mont'; letter-spacing: .2em; text-transform: uppercase; color: #86682F; }
h1 { font: 400 92px/1.04 'Playfair'; letter-spacing: -.01em; margin-top: 26px; }
h1 em { font-style: italic; color: #86682F; }
.beeld { flex: 1; margin-top: 44px; position: relative; min-height: 0; }
.foto { position: absolute; inset: 0 0 0 0; background: url('${uri(path.join(K04, 'salonfoto-staand.jpg'))}') center 40% / cover; border-radius: 6px; box-shadow: 0 30px 60px rgba(46,32,18,.22), 0 2px 6px rgba(46,32,18,.18); }
.foto::after { content: ''; position: absolute; inset: 18px; border: 1px solid rgba(251,248,243,.6); border-radius: 3px; }
.naam { position: absolute; left: 34px; bottom: 30px; background: rgba(251,248,243,.94); padding: 16px 22px; font: 400 30px 'Playfair'; color: #2A1F1F; border-radius: 3px; }
.naam small { display: block; font: 500 12px 'Mont'; letter-spacing: .3em; color: #A0675E; margin-bottom: 6px; }
.voet { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; height: 54px; }
.voet img { height: 54px; } .voet .nr { font: 500 22px 'Mont'; letter-spacing: .16em; color: #86682F; }
</style></head><body><div class="waas"></div><div class="plaat">
<div class="label">Conceptproject · fictieve schoonheidssalon</div>
<h1>Rustig en verzorgd.<br><em>Ook online.</em></h1>
<div class="beeld"><div class="foto"></div><div class="naam"><small>SCHOONHEIDSSALON · ALKMAAR</small>Salon Lindaveer</div></div>
<div class="voet"><img src="${uri(path.join(K04, 'yg-digital-logo-kopbalk-op-licht.svg'))}"><div class="nr">1 / 5</div></div>
</div></body></html>`;

// ---------------------------------------------------------------- 2. nacht, feit met een gouden lijntekening (zoekbalk)
const zoekbalk = {
  t: 'svg', hoogte: 300, marge: 64,
  teken: (C, y) => {
    const s = C.s, w = 720 * s, x = C.mx - w / 2, g = C.k.goud, h = 92 * s;
    const lijn = (yy, br, dek) => `<rect x="${x + 40 * s}" y="${yy}" width="${br * s}" height="${10 * s}" rx="${5 * s}" fill="${g}" opacity="${dek}"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${g}" stroke-width="${2.4 * s}"/>
      <circle cx="${x + 62 * s}" cy="${y + h / 2 - 4 * s}" r="${16 * s}" fill="none" stroke="${g}" stroke-width="${3 * s}"/>
      <path d="M${x + 74 * s} ${y + h / 2 + 8 * s}l${14 * s} ${14 * s}" stroke="${g}" stroke-width="${3.4 * s}" stroke-linecap="round"/>
      ${lijn(y + h + 56 * s, 420, 0.9)}${lijn(y + h + 84 * s, 560, 0.45)}
      ${lijn(y + h + 132 * s, 360, 0.9)}${lijn(y + h + 160 * s, 600, 0.45)}`;
  },
};
const nachtFeit = { blokken: [
  { t: 'boven', tekst: 'Een feit' },
  { t: 'ruimte', h: 30 },
  zoekbalk,
  { t: 'kop', tekst: 'Geen website?\nDan geen knop ‘Website’.', grootte: 84, marge: 46, maxRegels: 3 },
  { t: 'tekst', tekst: 'Wie u op Google vindt, kan niet doorklikken naar uw behandelingen.', grootte: 28, max: 760 },
] };

// ---------------------------------------------------------------- 3. nacht, zo werkt het met groot stapnummer
const nachtStap = { blokken: [
  { t: 'boven', tekst: 'Zo werkt het' },
  { t: 'prijs', bedrag: '1', grootte: 300, marge: 90 },
  { t: 'kop', tekst: 'Het ontwerp.', grootte: 96, marge: 34 },
  { t: 'tekst', tekst: 'Zie in vijf minuten uw eerste ontwerp in de ontwerpstudio, of begin met een gesprek.', grootte: 30, max: 760 },
] };

// 3:4-uitsnede zoals het raster, op tegelbreedte
const tegel = async (bestand, b = 300) => sharp(bestand).extract({ left: 34, top: 0, width: 1012, height: 1350 }).resize(b, Math.round(b * 4 / 3)).toBuffer();

(async () => {
  const b = await start();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  const html = path.join(UIT, 'voorbeeld-champagne.html');
  fs.writeFileSync(html, champagne, 'utf8');
  await p.goto(uri(html), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await sharp(await p.screenshot()).resize(1080, 1350).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, 'voorbeeld-champagne.jpg'));
  fs.unlinkSync(html);
  await b.close();
  await sharp(await kaart(nachtFeit, 1080, 1350)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, 'voorbeeld-nacht-feit.jpg'));
  await sharp(await kaart(nachtStap, 1080, 1350)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, 'voorbeeld-nacht-stap.jpg'));
  console.log('drie voorbeeldplaten klaar');

  // Eén week in het raster (nieuwste links): vrijdag W · woensdag T · maandag K. Boven zoals het nu is, onder volgens de gids.
  const P = f => path.join(WORTEL, 'pakketten', f);
  const nu = [P('2026-11-06-W02-ontwerpstudio/plaat-1.jpg'), P('2026-11-11-T02-feit/plaat-1.jpg'), P('2026-11-09-K04-salon/plaat-1.jpg')];
  const straks = [P('2026-11-06-W02-ontwerpstudio/plaat-1.jpg'), path.join(UIT, 'voorbeeld-nacht-feit.jpg'), path.join(UIT, 'voorbeeld-champagne.jpg')];
  const B = 300, GAT = 4, KOP = 70, RAND = 30, H = Math.round(B * 4 / 3);
  const labels = (t, y) => ({ input: Buffer.from(`<svg width="${3 * B + 2 * GAT}" height="${KOP}"><text x="0" y="44" font-family="Georgia" font-size="30" fill="#3A322B">${t}</text></svg>`), left: RAND, top: y });
  const lagen = [labels('Nu: vr W02 · wo T02 · ma K04', RAND), labels('Volgens de stijlgids: zelfde week, nieuwe T- en K-tegel', RAND + KOP + H + 40)];
  for (const [r, rij] of [nu, straks].entries()) for (const [i, f] of rij.entries())
    lagen.push({ input: await tegel(f, B), left: RAND + i * (B + GAT), top: RAND + KOP + r * (H + 40 + KOP) });
  await sharp({ create: { width: 3 * B + 2 * GAT + 2 * RAND, height: 2 * (KOP + H) + 40 + 2 * RAND, channels: 3, background: '#FFFFFF' } })
    .composite(lagen).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'raster-nu-en-straks.jpg'));
  console.log('raster-nu-en-straks.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
