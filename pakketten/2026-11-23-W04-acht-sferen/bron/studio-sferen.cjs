// W04 · de acht sferen uit de live ontwerpstudio (yg-digital.nl/eerste-ontwerp), met de naam "Uw bedrijf".
// De studio heeft zelf de weergave "Zie uw naam in alle sferen naast elkaar" (openVergelijk); daar staan acht kaarten.
// Branche "Winkel & webshop": de studiofoto's daarvan tonen een winkelinterieur zonder personen (gezichtsloos).
// Accent brons (#8a6d3b, zoals K01–K05). Geen inlog, geen account; de cookiemelding wordt afgewezen.
//   node pakketten/2026-11-23-W04-acht-sferen/bron/studio-sferen.cjs
// Uitvoer: beelden/sfeer-<naam>.png (kaart met naam eronder) en beelden/site-<naam>.png (alleen het ontwerp), 2x.
'use strict';
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const BLD = path.join(__dirname, 'beelden');

(async () => {
  const b = await start();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, locale: 'nl-NL' })).newPage();
  await p.goto('https://www.yg-digital.nl/eerste-ontwerp#b=winkel&s=warm&n=Uw%20bedrijf&a=%238a6d3b', { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first();
  if (await afw.count()) await afw.click().catch(() => {});
  await p.evaluate(() => openVergelijk());
  await p.waitForTimeout(5000);
  const k = p.locator('.vgl-kaart');
  const n = await k.count();
  if (n !== 8) throw new Error(`verwacht 8 sferen, gevonden ${n}`);
  const namen = [];
  for (let i = 0; i < n; i++) {
    const naam = (await k.nth(i).innerText()).split('\n').pop().trim().toLowerCase();
    await k.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
    const tekst = await k.nth(i).innerText();
    if (!/uw bedrijf/i.test(tekst)) throw new Error(`sfeer ${naam}: naam "Uw bedrijf" niet gevonden`);
    await k.nth(i).screenshot({ path: path.join(BLD, `sfeer-${naam}.png`) });
    await k.nth(i).locator('.sfm').screenshot({ path: path.join(BLD, `site-${naam}.png`) });
    namen.push(naam);
  }
  console.log('sferen:', namen.join(', '));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
