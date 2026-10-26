// W02 · de ontwerpstudio (yg-digital.nl/eerste-ontwerp) als echte schermafdrukken op telefoonmaat, stap voor stap:
// de ingang, stap 1 (naam en vak), stap 2 (de sferen), het resultaat na "Open mijn website" en het ontwerp op
// volledig scherm. Naam "Uw bedrijf" (leest als voorbeeld, niet als klant), branche Kapper & salon, sfeer warm:
// dezelfde keuze als K01 en reel R17, en de salonfoto's van de studio zijn gezichtsloos.
//   node pakketten/2026-11-06-W02-ontwerpstudio/bron/opname-w02.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const R = path.join(__dirname, 'render'); fs.mkdirSync(R, { recursive: true });
const NAAM = 'Uw bedrijf';
const schiet = async (p, naam) => { await p.waitForTimeout(1200); await p.screenshot({ path: path.join(R, naam + '.png') }); console.log(naam); };
// scroll zo dat een element met deze tekst op een gegeven hoogte in beeld staat
async function naar(p, tekst, boven = 110) {
  await p.evaluate(({ tekst, boven }) => {
    const e = [...document.querySelectorAll('h1,h2,h3,p,label,button,div,span')].filter(e => (e.innerText || '').trim().toLowerCase().startsWith(tekst.toLowerCase()) && e.getBoundingClientRect().width > 0).sort((a, b) => a.innerText.length - b.innerText.length)[0];
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - boven);
  }, { tekst, boven });
  await p.waitForTimeout(500);
}
(async () => {
  const b = await start();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto('https://www.yg-digital.nl/eerste-ontwerp', { waitUntil: 'load' }); await p.waitForTimeout(2500);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first(); if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(500);
  await schiet(p, '1-ingang');
  // stap 1: naam en vak
  await p.getByRole('button', { name: /bekijk uw ontwerp/i }).first().click(); await p.waitForTimeout(2500);
  await p.locator('input[type=text], input:not([type])').first().fill(NAAM); await p.waitForTimeout(400);
  await p.getByText(/Kapper & salon/).first().click(); await p.waitForTimeout(600);
  await naar(p, 'Naam van uw bedrijf', 60);
  await schiet(p, '2-stap1-naam-vak');
  // stap 2: de sferen; de warme sfeer kiezen (de kaart met "Vakwerk/… sinds" = sfeer warm) en in beeld zetten
  await p.getByRole('button', { name: /^verder$/i }).first().click(); await p.waitForTimeout(2500);
  const kaart = p.locator('button', { hasText: 'SINDS' }).first();
  await kaart.scrollIntoViewIfNeeded(); await kaart.click(); await p.waitForTimeout(800);
  await p.evaluate(() => { const k = [...document.querySelectorAll('button')].find(e => /SINDS/.test(e.innerText)); if (k) window.scrollTo(0, k.getBoundingClientRect().top + scrollY - 120); });
  await p.waitForTimeout(500);
  await schiet(p, '3-stap2-sfeer');
  // door stap 3 en 4 naar het resultaat
  for (let i = 0; i < 2; i++) { const v = p.getByRole('button', { name: /^verder$/i }).first(); await v.scrollIntoViewIfNeeded(); await v.click(); await p.waitForTimeout(2500); }
  const open = p.getByRole('button', { name: /open mijn website/i }).first(); await open.scrollIntoViewIfNeeded(); await open.click(); await p.waitForTimeout(3500);
  // "Open mijn website" zet de studio op stap vijf (vier vragen); het ontwerp zelf staat op de deellink zonder stap
  const deellink = p.url().replace(/&stap=\d+/, '');
  console.log('deellink:', deellink);
  await p.goto(deellink, { waitUntil: 'load' }); await p.waitForTimeout(3500);
  const afw2 = p.getByRole('button', { name: /afwijzen|deny/i }).first(); if (await afw2.count()) await afw2.click().catch(() => {});
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  await schiet(p, '4-resultaat');
  // volledig scherm: alleen de site, bovenaan
  const vs = p.getByRole('button', { name: /^volledig scherm$/i }).first();
  if (await vs.count()) { await vs.click(); await p.waitForTimeout(2500); }
  // er zijn meer .site-elementen (de sfeerkaarten zijn ook kleine sites): neem de grootste zichtbare
  const vak = await p.evaluate(() => {
    [...document.querySelectorAll('button, a')].filter(e => /sluit volledig/i.test(e.innerText)).forEach(k => k.style.visibility = 'hidden');
    const sites = [...document.querySelectorAll('.site')].map(s => ({ s, r: s.getBoundingClientRect() })).filter(o => o.r.width > 200 && o.r.height > 200).sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
    if (!sites.length) return null;
    sites[0].s.scrollTop = 0; const r = sites[0].r; return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await p.waitForTimeout(600);
  console.log('site-vak:', JSON.stringify(vak));
  await p.screenshot({ path: path.join(R, '5-volledig-scherm.png'), ...(vak ? { clip: vak } : {}) });
  console.log('5-volledig-scherm');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
