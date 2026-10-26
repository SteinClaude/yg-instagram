// Eén plek om een browser te starten voor schermafdrukken, op de pc én in de cloud.
//
//   const { start } = require('./browser.cjs');            // vanuit gereedschap/
//   const { start } = require('../../../gereedschap/browser.cjs');   // vanuit pakketten/<map>/bron/
//   const b = await start();                                 // zelfde object als chromium.launch()
//
// Volgorde: eerst de Chromium die bij playwright-core hoort (in de cloud staat die klaar via
// PLAYWRIGHT_BROWSERS_PATH; de versie van playwright-core in package.json hoort bij die browser),
// anders de geïnstalleerde Google Chrome (`channel: 'chrome'`, zoals het op de pc altijd ging).
// Geen van beide gevonden: één foutmelding met beide redenen, zodat je ziet wat er ontbreekt.
const { chromium } = require('playwright-core');

async function start(opties = {}) {
  const basis = { headless: true, ...opties };
  let eerste;
  try { return await chromium.launch(basis); }
  catch (e) { eerste = e; }
  try { return await chromium.launch({ ...basis, channel: 'chrome' }); }
  catch (tweede) {
    const kort = e => String(e && e.message || e).split('\n')[0];
    throw new Error(`geen browser gevonden.\n  Chromium van playwright-core: ${kort(eerste)}\n  Google Chrome (channel: 'chrome'): ${kort(tweede)}\n` +
      '  Op de pc: Google Chrome installeren of `npx playwright-core install chromium`. In de cloud: PLAYWRIGHT_BROWSERS_PATH controleren.');
  }
}

module.exports = { chromium, start };
