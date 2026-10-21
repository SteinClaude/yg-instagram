// Beeld 5 van K02: een echt resultaat uit de live ontwerpstudio op telefoonmaat, zonder bediening of cookiemelding.
// Deellink: branche "Iets anders" (de studio heeft geen garagebranche), sfeer warm, naam Autoschade Lindevoort,
// accent brons (#8a6d3b, zelfde keuze als K01). De studio kiest voor "Iets anders" zelf een foto met een gezicht
// (Pexels 5240158); daarom staat de opname zo dat alleen de onderrand van de polaroid met de handgeschreven naam,
// de kop en de knoppen in beeld zijn. Regel: gezichtsloos.
//   node pakketten/2026-10-23-K02-autoschade/bron/studio-opname.cjs
// Uitvoer: beelden/studio-resultaat-lindevoort.png (1170 x 1908, het element .site in volledig scherm, 3x).
const path = require('path');
const { chromium } = require('C:/Users/gijsm/yg-instagram/node_modules/playwright-core');
const UIT = path.join(__dirname, 'beelden', 'studio-resultaat-lindevoort.png');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto('https://www.yg-digital.nl/eerste-ontwerp#b=anders&s=warm&n=Autoschade%20Lindevoort&a=%238a6d3b', { waitUntil: 'load' });
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
