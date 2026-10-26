// Beeld 5 van K04: een echt resultaat uit de live ontwerpstudio op telefoonmaat, zonder bediening of cookiemelding.
// Deellink: branche "Kapper & salon" (noemt de nagelstudio expliciet), sfeer warm, naam Nagelstudio Amarel, accent brons
// (#8a6d3b, zelfde keuze als K01–K03). Zelfde uitsnede als K02/K03: de onderrand van de polaroid met de handgeschreven
// naam, de kop en de knoppen; bovenin alleen een stukje van de saloninterieurfoto van de studio, geen gezicht.
//   node pakketten/2026-11-09-K04-nagelstudio/bron/studio-opname.cjs
// Uitvoer: beelden/studio-resultaat-amarel.png (de grootste .site in volledig scherm, 3x).
const path = require('path');
const { start } = require('../../../gereedschap/browser.cjs');
const UIT = path.join(__dirname, 'beelden', 'studio-resultaat-amarel.png');
(async () => {
  const b = await start();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 3, isMobile: true, locale: 'nl-NL' });
  const p = await ctx.newPage();
  await p.goto('https://www.yg-digital.nl/eerste-ontwerp#b=kapper&s=warm&n=Nagelstudio%20Amarel&a=%238a6d3b', { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const afw = p.getByRole('button', { name: /afwijzen|deny/i }).first();   // cookiemelding weigeren
  if (await afw.count()) await afw.click().catch(() => {});
  await p.waitForTimeout(400);
  const vs = p.getByRole('button', { name: /^volledig scherm$/i }).first(); // volledig scherm, anders is het voorbeeld te klein
  if (await vs.count()) await vs.click();
  await p.waitForTimeout(3500);
  const vak = await p.evaluate(() => {
    [...document.querySelectorAll('button, a')].filter(e => /sluit volledig/i.test(e.innerText)).forEach(k => k.style.visibility = 'hidden');
    const sites = [...document.querySelectorAll('.site')].map(s => ({ s, r: s.getBoundingClientRect() })).filter(o => o.r.width > 200 && o.r.height > 200).sort((a, c) => c.r.width * c.r.height - a.r.width * a.r.height);
    if (!sites.length) return null;
    // naar boven: de site zelf, al zijn scrollbare kinderen en de pagina (de studio scrolt het ontwerp soms zelf door)
    const s = sites[0].s; window.scrollTo(0, 0); s.scrollTop = 0;
    s.querySelectorAll('*').forEach(e => { if (e.scrollTop) e.scrollTop = 0; });
    const r = s.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!vak) throw new Error('geen ontwerp gevonden op de pagina');
  // De studio laat het ontwerp na "Volledig scherm" zelf naar beneden lopen (de rondleiding, ± 5 s). Wachten tot die
  // stilstaat en dan pas terug naar boven; daarna nog eens controleren dat hij boven blijft.
  let vorige = -1;
  for (let i = 0; i < 20; i++) {
    await p.waitForTimeout(500);
    const nu = await p.evaluate(() => { const s = [...document.querySelectorAll('.site')].sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth)[0]; return s ? s.scrollTop : 0; });
    if (nu === vorige) break; vorige = nu;
  }
  for (let i = 0; i < 3; i++) {
    await p.evaluate(() => { const s = [...document.querySelectorAll('.site')].sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth)[0]; if (s) s.scrollTop = 0; });
    await p.waitForTimeout(700);
  }
  // controle: de handgeschreven naam (polaroid) staat in de bovenste helft van het vak
  const naamY = await p.evaluate(() => {
    const e = [...document.querySelectorAll('.site *')].filter(x => x.children.length === 0 && /Nagelstudio Amarel/.test(x.textContent) && x.getBoundingClientRect().height > 0).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    return e ? Math.round(e.getBoundingClientRect().top) : null;
  });
  console.log('naam op y =', naamY, '(vak', Math.round(vak.y), 'tot', Math.round(vak.y + vak.height) + ')');
  if (naamY === null || naamY < vak.y || naamY > vak.y + vak.height / 2) throw new Error('de naam staat niet bovenin het vak: opname niet bovenaan');
  await p.screenshot({ path: UIT, clip: vak });
  console.log('klaar:', UIT);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
