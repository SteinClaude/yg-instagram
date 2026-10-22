// W01 · Entree van yg-digital.nl: echte schermafdrukken van de homepage (laptop en telefoon) en van de ingang van de
// ontwerpstudio, met de cookiemelding geweigerd en de hero-slider stilgezet. Uitvoer in render/, maten in render/maten.json.
//   node pakketten/2026-10-28-W01-entree/bron/opname-w01.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('C:/Users/gijsm/yg-instagram/node_modules/playwright-core');
const R = path.join(__dirname, 'render'); fs.mkdirSync(R, { recursive: true });
const SITE = 'https://www.yg-digital.nl/';

async function open(b, mobiel) {
  const ctx = await b.newContext(mobiel
    ? { viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'nl-NL' });
  const p = await ctx.newPage();
  return { ctx, p };
}
async function laad(p, url) {
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first();
  if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(600);
  // slider stilzetten als er een pauzeknop is
  const pauze = p.locator('button[aria-label*="auze" i], button[aria-label*="ause" i]').first();
  if (await pauze.count()) await pauze.click().catch(() => {});
  // alles een keer in beeld brengen (lazy loading), dan terug naar boven
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
}
// Vind het eerste element met een gegeven tekst (kleinste element dat de tekst bevat)
// Meet per tekst het kleinste element dat hem bevat, plus de echte regelvakken (Range.getClientRects): voor gecentreerde
// regels de omhullende van de tekst zelf, en voor een alinea apart het laatste regelvak (de korte slotregel).
const meet = (p, teksten) => p.evaluate(teksten => {
  const uit = {};
  for (const [k, t] of Object.entries(teksten)) {
    const alle = [...document.querySelectorAll('h1,h2,h3,p,a,button,span,div,li')].filter(e => (e.innerText || '').toLowerCase().includes(t.toLowerCase()) && e.getBoundingClientRect().width > 0);
    const e = alle.sort((a, b) => a.innerText.length - b.innerText.length)[0];
    if (!e) { uit[k] = null; continue; }
    const r = e.getBoundingClientRect();
    const rg = document.createRange(); rg.selectNodeContents(e);
    // vakken over de volle breedte zijn blokken binnen het element, geen tekstregels: weglaten
    let regels = [...rg.getClientRects()].filter(q => q.width > 2 && q.height > 2 && q.width < r.width - 1);
    if (!regels.length) regels = [...rg.getClientRects()].filter(q => q.width > 2 && q.height > 2);
    const links = Math.min(...regels.map(q => q.left)), rechts = Math.max(...regels.map(q => q.right));
    const laatste = regels[regels.length - 1];
    uit[k] = { x: r.x, y: r.y + scrollY, w: r.width, h: r.height,
      tekstX: links, tekstW: rechts - links,
      laatsteX: laatste ? laatste.left : r.x, laatsteW: laatste ? laatste.width : r.width, laatsteY: laatste ? laatste.top + scrollY + laatste.height / 2 : r.y + scrollY + r.height / 2 };
  }
  return uit;
}, teksten);

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const maten = {};
  // laptop: hero (venster) en de onderste sectie (uitsnede uit de hele pagina)
  let { ctx, p } = await open(b, false);
  await laad(p, SITE);
  await p.screenshot({ path: path.join(R, 'laptop-hero.png') });
  maten.laptop = await meet(p, { kop: 'Websites en automatisering voor ondernemers', werkdag: 'binnen één werkdag antwoord', praten: 'Liever eerst even praten', knop: 'Ontdek YG Launch' });
  const ONDER = { x: 170, y: 700, w: 1100, h: 630 }; // smaller dan het venster, zodat de tekst groter op de plaat komt
  await p.screenshot({ path: path.join(R, 'laptop-onder.png'), fullPage: true, clip: { x: ONDER.x, y: ONDER.y, width: ONDER.w, height: ONDER.h } });
  maten.onder = ONDER;
  await ctx.close();
  // telefoon: bovenkant en de sectie Over YG Digital
  ({ ctx, p } = await open(b, true));
  await laad(p, SITE);
  await p.screenshot({ path: path.join(R, 'telefoon-hero.png') });
  maten.telefoonHero = await meet(p, { knop: 'Ontdek YG Launch', regel: 'Geen account nodig', bel: '06 44 89 21 82' });
  const over = await meet(p, { kop: 'Websites en automatisering voor ondernemers' });
  const scroll = Math.max(0, Math.round(over.kop.y - 120));
  await p.evaluate(y => window.scrollTo(0, y), scroll);
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(R, 'telefoon-over.png') });
  const m2 = await meet(p, { werkdag: 'binnen één werkdag antwoord', praten: 'Liever eerst even praten' });
  maten.telefoonOver = { scroll, ...Object.fromEntries(Object.entries(m2).map(([k, v]) => [k, v && { ...v, y: v.y - scroll }])) };
  await ctx.close();
  // de ingang van de ontwerpstudio
  ({ ctx, p } = await open(b, true));
  await laad(p, SITE + 'eerste-ontwerp');
  await p.screenshot({ path: path.join(R, 'telefoon-studio.png') });
  await ctx.close();
  await b.close();
  fs.writeFileSync(path.join(R, 'maten.json'), JSON.stringify(maten, null, 1));
  console.log(JSON.stringify(maten));
})().catch(e => { console.error(e); process.exit(1); });
