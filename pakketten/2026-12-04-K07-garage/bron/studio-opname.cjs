// Plaat 5 van K07: een echt resultaat uit de live ontwerpstudio op telefoonmaat, zonder bediening of cookiemelding.
// Deellink: branche "Bouw & vakwerk" (het dichtst bij een garage: vakwerk), sfeer warm, naam Garage Wendhoek,
// accent brons (#8a6d3b, zoals K01–K04). De studiofoto van deze branche toont een persoon; daarom staat de opname zo dat
// de handgeschreven naam van de polaroid bovenin staat en de foto erboven buiten beeld valt (zoals K03 en K05). Gezichtsloos.
// De studio laat het ontwerp na "Volledig scherm" zelf doorlopen; het script wacht tot dat stilstaat.
//   node pakketten/2026-12-04-K07-garage/bron/studio-opname.cjs
// Uitvoer: beelden/studio-resultaat-wendhoek.png (de grootste .site in volledig scherm, 3x).
'use strict';
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const UIT = path.join(__dirname, 'beelden', 'studio-resultaat-wendhoek.png');
const NAAM = 'Garage Wendhoek';
const site = () => [...document.querySelectorAll('.site')].sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth)[0];

(async () => {
  const b = await start();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto(`https://www.yg-digital.nl/eerste-ontwerp#b=bouw&s=warm&n=${encodeURIComponent(NAAM)}&a=%238a6d3b`, { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first();
  if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(400);
  const vs = p.getByRole('button', { name: /^volledig scherm$/i }).first();
  if (await vs.count()) await vs.click();
  // wachten tot de rondleiding stilstaat
  let vorige = -1;
  for (let i = 0; i < 24; i++) {
    await p.waitForTimeout(500);
    const nu = await p.evaluate(`(${site})().scrollTop`);
    if (nu === vorige) break; vorige = nu;
  }
  // de rondleiding loopt na een pauze weer door; één scrollbeweging van de bezoeker zet hem stil (30 okt nagekeken)
  await p.mouse.move(195, 400); await p.mouse.wheel(0, 50); await p.mouse.move(384, 640); await p.waitForTimeout(400);  // muis daarna op een lege rand van het ontwerp: op de tekst licht die op, buiten het ontwerp loopt de rondleiding weer
  // de naam (handgeschreven, op de polaroid) ± 40 px onder de bovenrand van het ontwerp zetten
  const vak = await p.evaluate(({ naam, zoek }) => {
    const s = eval(zoek)();
    [...document.querySelectorAll('button, a')].filter(e => /sluit volledig/i.test(e.innerText)).forEach(k => k.style.visibility = 'hidden');
    s.style.scrollBehavior = 'auto'; s.style.scrollSnapType = 'none';  // geen soepel scrollen of vastklikken op secties
    s.scrollTop = 0;
    const sr = s.getBoundingClientRect();
    // de handgeschreven naam onder de polaroidfoto (klasse sfd-onder in de studio); terugval: de eerste vermelding
    // van de naam ónder de kopbalk
    const pol = s.querySelector('.sfd-onder') || [...s.querySelectorAll('*')].filter(x => x.children.length === 0 && x.textContent.includes(naam.split(' ').pop()) && x.getBoundingClientRect().top - sr.top > 200)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (pol) s.scrollTop = Math.max(0, pol.getBoundingClientRect().top - sr.top - 40);
    return { x: sr.x, y: sr.y, width: sr.width, height: sr.height, gevonden: !!pol };
  }, { naam: NAAM, zoek: `(${site})` });
  await p.waitForTimeout(1500);
  if (!vak.gevonden) throw new Error('naam op de polaroid niet gevonden');
  // controle: de naam op de polaroid staat nu in de bovenste 200 px van het ontwerp
  const naamY = await p.evaluate(({ naam, zoek }) => {
    const s = eval(zoek)(), sr = s.getBoundingClientRect();
    const e = s.querySelector('.sfd-onder');
    return e ? Math.round(e.getBoundingClientRect().top - sr.top) : null;
  }, { naam: NAAM, zoek: `(${site})` });
  console.log('naam op de polaroid op', naamY, 'px onder de bovenrand');
  if (naamY === null || naamY < 0 || naamY > 200) throw new Error('de naam staat niet bovenin; de foto zou in beeld komen');
  await p.screenshot({ path: UIT, clip: { x: vak.x, y: vak.y, width: vak.width, height: vak.height } });
  console.log('klaar:', UIT);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
