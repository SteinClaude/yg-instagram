// K06 · Barbier Moldaan (fictief), november 2026: vijf carrouselplaten van 1080 x 1350 in de stijl van docs/stijlgids.md
// (vastgesteld 27 okt). Familie Champagne:
//   plaat 1  vorm Detail: de onderkant van de telefoonversie (behandeling gekozen, vaste balk "Boek een plek") vergroot in
//            een goudomrand kader, kop ≤ 5 woorden op ≥ 84 px, licht medaillon (K05 was vorm Telefoon)
//   plaat 2  zwakke versie met drie markeringen (geen medaillon)
//   plaat 3  sterke versie, zelfde uitsnede (geen medaillon)
//   plaat 4  telefoon in twee stappen: behandeling kiezen, tijd kiezen (geen medaillon)
//   plaat 5  slot: echt studioresultaat, licht medaillon
// De drie verschilpunten voor een barbier: boekknop bovenaan · behandelingen met de duur erbij · openingstijden in één
// regel. Geen prijzen (prijs alleen in Z01). 072 000 00 00 is een plaatshouder. Foto: Pexels 9146943 (Lena Gromakova).
//   node pakketten/2026-11-27-K06-barbier/bron/studio-opname.cjs   (plaat 5, live studio, internet nodig)
//   node pakketten/2026-11-27-K06-barbier/bron/maak-k06.cjs
'use strict';
const path = require('path');
const sharp = require('sharp');
const { start } = require('../../../gereedschap/browser.cjs');
const C = require('../../../gereedschap/champagne.cjs');

C.kopieerBasis(path.join(__dirname, 'beelden'));
const k = C.kader(__dirname);
const LABEL = '<div class="label">Conceptproject · fictieve barbier</div>';
const KOPPEN = ['Eén tik. Stoel geboekt.', 'Dezelfde barbier. Hoe boek ik?', 'Boeken staat bovenaan.', 'Op uw telefoon in twee stappen.', 'Hoe zou uw zaak eruitzien?'];

(async () => {
  const b = await start();
  const vvoor = await k.scherm(b, { bestand: 'vergelijk-voor.html', w: 760, h: 640, meet: { menu: '#menu', behandelingen: '#behandelingen', tijden: '#tijden' } });
  const vna = await k.scherm(b, { bestand: 'vergelijk-na.html', w: 760, h: 640, meet: { boek: '#boek', behandelingen: '#behandelingen', tijden: '#tijden' } });
  const lijst = await k.scherm(b, { bestand: 'barbier-mobiel.html#lijst', w: 390, h: 693,
    voor: () => { document.body.classList.add('lijst'); window.scrollTo(0, document.getElementById('behandelingen').offsetTop - 64); }, meet: { gekozen: '.rij.on', vast: '.vast' } });
  const tijd = await k.scherm(b, { bestand: 'barbier-mobiel.html#tijd', w: 390, h: 693, meet: { gekozen: '#gekozen' } });
  // detail voor plaat 1: van de gekozen behandeling tot de onderkant (met de vaste balk), 3x resolutie
  const g = lijst.maten.gekozen, top = Math.max(0, Math.round(g.y - 8)), hoog = 693 - top;
  const m = await sharp(lijst.bestand).metadata();
  const detail = path.join(k.R, 'detail-boeken.png');
  await sharp(lijst.bestand).extract({ left: 0, top: top * 3, width: m.width, height: m.height - top * 3 }).png().toFile(detail);
  const studio = await k.beeld(path.join(k.BLD, 'studio-resultaat-moldaan.png'), 390);

  const z = vvoor.maten, a = vna.maten;
  const merkenZwak = [[1, z.menu.x + z.menu.w + 30, z.menu.y + z.menu.h / 2], [2, z.behandelingen.x - 14, z.behandelingen.y + 12], [3, z.tijden.x + z.tijden.w / 2, z.tijden.y - 20]];
  const merkenSterk = [[1, a.boek.x + a.boek.w / 2, a.boek.y + a.boek.h + 26], [2, a.behandelingen.x - 14, a.behandelingen.y + a.behandelingen.h / 2], [3, a.tijden.x - 22, a.tijden.y + a.tijden.h / 2]];
  const DB = Math.min(900, Math.round(790 / hoog * 390)), ds = (DB - 6) / 390;  // past onder de kop

  const platen = [
    { medaillon: true, html: `${LABEL}
      <h1 style="margin-top:22px">Eén tik.<br><em>Stoel geboekt.</em></h1>
      <div class="sub">De boekknop staat altijd onderin beeld.</div>
      <div class="midden" style="justify-content:center; align-items:center">
        <div class="loep schaduw" style="position:relative; width:${DB}px"><img src="${k.uri(detail)}">
          ${k.merk(1, -4, (g.y - top + g.h / 2) * ds)}${k.merk(2, -4, (lijst.maten.vast.y - top + lijst.maten.vast.h / 2) * ds)}</div></div>${k.voet(1)}` },
    { medaillon: false, html: `${LABEL}<h2>Dezelfde barbier.<br>Hoe boek ik?</h2>
      <div class="midden">${k.browser(vvoor, 820, merkenZwak)}
        ${k.legenda(['Geen boekknop, alleen bellen', 'Behandelingen in een lap tekst', 'Openingstijden klein onderaan'])}</div>${k.voet(2)}` },
    { medaillon: false, html: `${LABEL}<h2>Meer overzicht.<br>Boeken staat bovenaan.</h2>
      <div class="midden">${k.browser(vna, 820, merkenSterk)}
        ${k.legenda(['Boek een plek, meteen bovenaan', 'Behandelingen met de duur erbij', 'Openingstijden in één regel'])}
        <div class="notitie">Zelfde zaak, foto en behandelingen als op het vorige beeld.</div></div>${k.voet(3)}` },
    { medaillon: false, html: `${LABEL}<h2>Op uw telefoon<br>in twee stappen.</h2>
      <div class="midden" style="justify-content:center">
        <div style="display:flex; justify-content:center; align-items:flex-start; gap:34px">
          ${k.telefoon(lijst, 360, [[1, g.x + g.w - 30, g.y + g.h / 2]])}
          ${k.telefoon(tijd, 360, [[2, tijd.maten.gekozen.x + tijd.maten.gekozen.w / 2, tijd.maten.gekozen.y - 4]], 'margin-top:60px')}</div>
        ${k.legenda(['Kies wat u wilt laten doen', 'Kies een vrije tijd en bevestig'])}</div>${k.voet(4)}` },
    { medaillon: true, html: `<div class="label">YG Digital · ontwerpstudio</div>
      <div class="rij"><div style="flex:1"><h1 style="font-size:76px">Hoe zou<br>uw zaak<br>eruitzien?</h1>
        <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
        <div class="bijschrift">Dit voorbeeld maakt u zelf in onze ontwerpstudio.</div></div>
        ${k.telefoon(studio, 520, [], '', '#F6F0E8')}</div>${k.voet(5)}` },
  ];
  await k.bouw(b, platen, 'Barbier Moldaan');
  await b.close();
  console.log('koppen:', KOPPEN.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });
