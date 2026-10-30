// K07 · Garage Wendhoek (fictief), december 2026: vijf carrouselplaten van 1080 x 1350 in de stijl van docs/stijlgids.md
// (vastgesteld 27 okt). Familie Champagne:
//   plaat 1  vorm Foto: de garagefoto groot, kop erboven, de bedrijfsnaam als kaartje op de foto, licht medaillon
//            (K05 Telefoon, K06 Detail: niet twee keer dezelfde vorm achter elkaar)
//   plaat 2  zwakke versie met drie markeringen (geen medaillon)
//   plaat 3  sterke versie, zelfde uitsnede (geen medaillon)
//   plaat 4  telefoon: bovenkant met "Plan uw APK" en het planformulier (geen medaillon)
//   plaat 5  slot: echt studioresultaat, licht medaillon
// De drie verschilpunten voor een garage: afspraak plannen bovenaan · diensten als kaarten · adres en tijden in één regel.
// Geen prijzen (prijs alleen in Z01), geen kenteken in beeld. 072 000 00 00 is een plaatshouder.
// Foto: Pexels 8986138 (Artem Podrez), een auto op de brug, zonder personen; geen kenteken of merkteken leesbaar.
//   node pakketten/2026-12-04-K07-garage/bron/studio-opname.cjs   (plaat 5, live studio, internet nodig)
//   node pakketten/2026-12-04-K07-garage/bron/maak-k07.cjs
'use strict';
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const C = require('../../../gereedschap/champagne.cjs');

C.kopieerBasis(path.join(__dirname, 'beelden'));
const k = C.kader(__dirname, { extraCss: `
.grootfoto { position: relative; margin-top: 34px; flex: 1; min-height: 0; border-radius: 10px; overflow: hidden; }
.grootfoto .beeld { position: absolute; inset: 0; background-size: cover; background-position: 35% 50%; }
.kaartje { position: absolute; left: 34px; bottom: 34px; background: #FAFAF8; padding: 26px 30px 24px; border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.28); }
.kaartje small { display: block; font: 500 17px 'Mont'; letter-spacing: .26em; color: #B8701C; margin-bottom: 10px; }
.kaartje b { display: block; font: 400 46px/1 'Playfair'; color: #1D2023; }
.kaartje span { display: inline-block; margin-top: 18px; padding: 12px 20px; background: #B8701C; color: #FAFAF8; font: 500 18px 'Mont'; letter-spacing: .12em; text-transform: uppercase; }
` });
const LABEL = '<div class="label">Conceptproject · fictieve garage</div>';
const KOPPEN = ['Wanneer kan mijn auto erin?', 'Dezelfde garage. Hoe plan ik?', 'APK plannen staat bovenaan.', 'Op uw telefoon klopt het ook.', 'Hoe zou uw bedrijf eruitzien?'];

(async () => {
  const b = await start();
  const vvoor = await k.scherm(b, { bestand: 'vergelijk-voor.html', w: 760, h: 640, meet: { menu: '#menu', diensten: '#diensten', adres: '#adres' } });
  const vna = await k.scherm(b, { bestand: 'vergelijk-na.html', w: 760, h: 640, meet: { plan: '#plan', diensten: '#diensten', adres: '#adres' } });
  const boven = await k.scherm(b, { bestand: 'garage-mobiel.html', w: 390, h: 693, meet: { knop: '#planknop' } });
  const plan = await k.scherm(b, { bestand: 'garage-mobiel.html#plan', w: 390, h: 693, meet: { kenteken: '#veld-kenteken', dienst: '#veld-dienst', vast: '#vastknop' } });
  const studio = await k.beeld(path.join(k.BLD, 'studio-resultaat-wendhoek.png'), 390);
  const foto = k.uri(path.join(k.BLD, 'pexels-8986138-artem-podrez.jpg'));

  const z = vvoor.maten, a = vna.maten, pm = plan.maten;
  const merkenZwak = [[1, z.menu.x + z.menu.w + 30, z.menu.y + z.menu.h / 2], [2, z.diensten.x - 14, z.diensten.y + 12], [3, z.adres.x + z.adres.w / 2, z.adres.y - 20]];
  const merkenSterk = [[1, a.plan.x + a.plan.w / 2, a.plan.y + a.plan.h + 26], [2, a.diensten.x - 14, a.diensten.y + a.diensten.h / 2], [3, a.adres.x - 22, a.adres.y + a.adres.h / 2]];

  const platen = [
    { medaillon: true, html: `${LABEL}
      <h1 style="margin-top:22px">Wanneer kan mijn<br><em>auto erin?</em></h1>
      <div class="grootfoto schaduw"><div class="beeld" style="background-image:url('${foto}')"></div>
        <div class="kaartje"><small>APK · ONDERHOUD · ALKMAAR</small><b>Garage Wendhoek</b><span>Plan uw APK</span></div></div>${k.voet(1)}` },
    { medaillon: false, html: `${LABEL}<h2>Dezelfde garage.<br>Hoe plan ik?</h2>
      <div class="midden">${k.browser(vvoor, 820, merkenZwak)}
        ${k.legenda(['Geen afspraakknop, alleen bellen', 'APK en onderhoud in één alinea', 'Adres en tijden klein onderaan'])}</div>${k.voet(2)}` },
    { medaillon: false, html: `${LABEL}<h2>Meer overzicht.<br>APK plannen staat bovenaan.</h2>
      <div class="midden">${k.browser(vna, 820, merkenSterk)}
        ${k.legenda(['Plan uw APK, meteen bovenaan', 'Diensten als kaarten', 'Adres en tijden in één regel'])}
        <div class="notitie">Zelfde garage, foto en diensten als op het vorige beeld.</div></div>${k.voet(3)}` },
    { medaillon: false, html: `${LABEL}<h2>Op uw telefoon<br>klopt het ook.</h2>
      <div class="midden" style="justify-content:center">
        <div style="display:flex; justify-content:center; align-items:flex-start; gap:34px">
          ${k.telefoon(boven, 360, [[1, boven.maten.knop.x + boven.maten.knop.w - 24, boven.maten.knop.y + boven.maten.knop.h / 2]])}
          ${k.telefoon(plan, 360, [[2, pm.kenteken.x + pm.kenteken.w - 20, pm.kenteken.y + 8]], 'margin-top:60px')}</div>
        ${k.legenda(['Plan uw APK, bovenaan de pagina', 'Kenteken, wat er moet gebeuren, dag'])}</div>${k.voet(4)}` },
    { medaillon: true, html: `<div class="label">YG Digital · ontwerpstudio</div>
      <div class="rij"><div style="flex:1"><h1 style="font-size:76px">Hoe zou<br>uw bedrijf<br>eruitzien?</h1>
        <div class="sub">Probeer onze gratis ontwerpstudio via de link in onze bio.</div>
        <div class="bijschrift">Dit voorbeeld maakt u zelf in onze ontwerpstudio.</div></div>
        ${k.telefoon(studio, 520, [], '', '#F6F0E8')}</div>${k.voet(5)}` },
  ];
  await k.bouw(b, platen, 'Garage Wendhoek');
  await b.close();
  console.log('koppen:', KOPPEN.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });
