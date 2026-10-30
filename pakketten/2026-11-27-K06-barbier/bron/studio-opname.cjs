// Plaat 5 van K06: een echt resultaat uit de live ontwerpstudio op telefoonmaat, zonder bediening of cookiemelding.
// Deellink: branche "Kapper & salon" (noemt de barbier expliciet), sfeer warm, naam Barbier Moldaan, accent brons
// (#8a6d3b, zoals K01–K05). De studiofoto's van deze branche tonen een lege salon, zonder personen. De studio laat het
// ontwerp na "Volledig scherm" zelf doorlopen; het script wacht tot dat stilstaat en zet het dan bovenaan.
//   node pakketten/2026-11-27-K06-barbier/bron/studio-opname.cjs
// Uitvoer: beelden/studio-resultaat-moldaan.png (de grootste .site in volledig scherm, 3x).
'use strict';
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const UIT = path.join(__dirname, 'beelden', 'studio-resultaat-moldaan.png');
const NAAM = 'Barbier Moldaan';
const site = () => [...document.querySelectorAll('.site')].sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth)[0];

(async () => {
  const b = await start();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto(`https://www.yg-digital.nl/eerste-ontwerp#b=kapper&s=warm&n=${encodeURIComponent(NAAM)}&a=%238a6d3b`, { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first();
  if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(400);
  const vs = p.getByRole('button', { name: /^volledig scherm$/i }).first();
  if (await vs.count()) await vs.click();
  let vorige = -1;
  for (let i = 0; i < 24; i++) {
    await p.waitForTimeout(500);
    const nu = await p.evaluate(`(${site})().scrollTop`);
    if (nu === vorige) break; vorige = nu;
  }
  const vak = await p.evaluate(zoek => {
    const s = eval(zoek)();
    [...document.querySelectorAll('button, a')].filter(e => /sluit volledig/i.test(e.innerText)).forEach(k => k.style.visibility = 'hidden');
    s.scrollTop = 0;
    const r = s.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, tekst: s.innerText.slice(0, 400) };
  }, `(${site})`);
  await p.waitForTimeout(1500);
  if (!vak.tekst.includes('Moldaan')) throw new Error('naam niet gevonden in het ontwerp');
  await p.screenshot({ path: UIT, clip: { x: vak.x, y: vak.y, width: vak.width, height: vak.height } });
  console.log('klaar:', UIT);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
