// Beeld 5 van K03: een echt resultaat uit de live ontwerpstudio op telefoonmaat, zonder bediening of cookiemelding.
// Deellink: branche "Bouw & vakwerk" (die noemt de schilder expliciet), sfeer warm, naam Schildersbedrijf Hollenbeek,
// accent brons (#8a6d3b, zelfde keuze als K01 en K02). Net als bij K02 staat de opname zo dat de onderrand van de
// polaroid met de handgeschreven naam, de kop en de knoppen in beeld zijn; bovenin is dan alleen de houten
// dakconstructie van de studiofoto (Pexels 8830265) te zien, geen gezicht.
//   node pakketten/2026-10-26-K03-schilder/bron/studio-opname.cjs
// Uitvoer: beelden/studio-resultaat-hollenbeek.png (1170 x 1908, het element .site in volledig scherm, 3x).
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const UIT = path.join(__dirname, 'beelden', 'studio-resultaat-hollenbeek.png');
(async () => {
  const b = await start();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto('https://www.yg-digital.nl/eerste-ontwerp#b=bouw&s=warm&n=Schildersbedrijf%20Hollenbeek&a=%238a6d3b', { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const afw = p.getByText('Afwijzen', { exact: true }).first();           // cookiemelding weigeren
  if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(400);
  const vs = p.getByRole('button', { name: /^volledig scherm$/i }).first(); // volledig scherm, anders is het voorbeeld te klein
  if (await vs.count()) await vs.click();
  await p.waitForTimeout(2500);
  await p.evaluate(() => {
    [...document.querySelectorAll('button, a')].filter(e => /sluit volledig/i.test(e.innerText)).forEach(k => k.style.visibility = 'hidden');
    document.querySelector('.site').scrollTop = 0;
  });
  await p.waitForTimeout(600);
  await p.locator('.site').screenshot({ path: UIT });
  console.log('klaar:', UIT);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
