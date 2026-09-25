// Schermopnamen van de echte site op telefoonmaat, als achtergrond voor de
// verhalen van de highlights. 360 x 640 css-pixels op drievoudige schaal is
// precies 1080 x 1920. Draait op de Chrome die op de pc staat (headless: geen
// venster, geen muisaanwijzer), met de cookiemelding vooraf geweigerd.
//
//   node gereedschap/opname.cjs site     de startpagina, beeld voor beeld gescrold
//                                        (volmaakt gelijkmatig, 7 s op 24 fps)
//   node gereedschap/opname.cjs studio   de ontwerpstudio in echte tijd: de poort,
//                                        stap één (naam en branche) en de onthulling
//
// De studio wordt opgenomen met de screencast van het DevTools-protocol: Chrome
// stuurt elk getekend beeld met een tijdstempel, en die tempels worden de
// beeldduren in de montage (± 50 beelden per seconde op deze pc). Wat ik leerde
// voordat dit werkte (23 sep 2026), zodat niemand het opnieuw hoeft te vinden:
// - de screencast en een gewone schermafdruk komen op de maat van het
//   geëmuleerde venster maal de ÉCHTE schaalfactor van Chrome. Met alleen
//   Playwright's deviceScaleFactor is dat 360 x 640; met de startvlag
//   --force-device-scale-factor=3 erbij wordt het 1080 x 1920;
// - een venster van 360 px breed kan niet: Chrome maakt er minstens 490 van;
// - css-zoom op de pagina verandert de lay-out niet (media queries zien 1080);
// - tijd stilzetten per beeld (Emulation.setVirtualTimePolicy) geeft perfecte
//   24 fps, maar de renderer crasht precies op het moment dat de studio verschijnt.
//
// Beelden komen in platen/uit/opnamen/<naam>/ (niet in git), de bruikbare mp4's
// in platen/bron/opnamen/<naam>.mp4. De montage doet gereedschap/verhaal-video.cjs.
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');

const W = 360, H = 640, SCHAAL = 3, FPS = 24;
const SITE = 'https://yg-digital.nl';
const WORTEL = path.join(__dirname, '..');
const WERK = path.join(WORTEL, 'platen', 'uit', 'opnamen');
const UIT = path.join(WORTEL, 'platen', 'bron', 'opnamen');

async function open(args = []) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H }, deviceScaleFactor: SCHAAL, isMobile: true, hasTouch: false, locale: 'nl-NL',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  return { browser, page };
}

// De cookiemelding weigeren (de terughoudende keuze), zodat hij niet in beeld staat.
async function weigerCookies(page) {
  const knop = page.getByRole('button', { name: /deny cookies|afwijzen/i }).first();
  try { await knop.click({ timeout: 4000 }); await page.waitForTimeout(500); } catch { /* geen melding */ }
}
// Zonder dit animeert de site elke scrollTo zelf en klopt de positie per beeld niet.
const stilScrollen = page => page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto'; document.body.style.scrollBehavior = 'auto';
});
const wachtOpTekst = (page, patroon, timeout = 30000) =>
  page.waitForFunction(p => new RegExp(p, 'i').test(document.body.innerText), patroon, { timeout });
const klik = (page, naam) => page.getByRole('button', { name: naam }).first().click();
const maat = bestand => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height', '-of', 'csv=p=0', bestand]).toString().trim();
const log = t => console.log(new Date().toTimeString().slice(0, 8), t);

// ------------------------------------------------------------ site: beeld voor beeld
async function site() {
  const { browser, page } = await open();
  await page.goto(SITE, { waitUntil: 'networkidle' });
  await weigerCookies(page); await stilScrollen(page);
  // lui geladen beelden wakker maken, dan terug naar boven
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
  // Eindpunt: de kop "Uw website, gebouwd en daarna beheerd." op 150 css-pixels van
  // boven, met het kopje YG Launch erboven; dat is het zichtbare venster van het verhaal.
  const eind = await page.evaluate(() => {
    const zichtbaar = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const kop = [...document.querySelectorAll('h1,h2,h3,h4')].find(e => zichtbaar(e) && /uw website, gebouwd/i.test(e.textContent))
      || [...document.querySelectorAll('body *')].find(e => zichtbaar(e) && e.children.length === 0 && /uw website, gebouwd/i.test(e.textContent));
    return Math.round(kop.getBoundingClientRect().top + window.scrollY - 150);
  });
  const dir = path.join(WERK, 'site'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const N = Math.round(7 * FPS), ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  for (let i = 0; i <= N; i++) {
    await page.evaluate(y => window.scrollTo(0, y), Math.round(eind * ease(i / N)));
    await page.waitForTimeout(30);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(5, '0')}.png`), type: 'png' });
  }
  await browser.close();
  fs.mkdirSync(UIT, { recursive: true });
  const mp4 = path.join(UIT, 'site.mp4');
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.png'),
    '-vf', `scale=${W * SCHAAL}:${H * SCHAAL}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '15',
    '-pix_fmt', 'yuv420p', mp4], { stdio: 'inherit' });
  log(`site: ${N + 1} beelden (${maat(path.join(dir, 'f00000.png'))}), scroll tot ${eind} css-px, -> ${mp4}`);
}

// ------------------------------------------------------------ studio: screencast in echte tijd
async function opnemen(page, naam) {
  const dir = path.join(WERK, naam); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = []; let n = 0;
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const f = `f${String(n++).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(dir, f), Buffer.from(data, 'base64'));
    frames.push({ f, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W * SCHAAL, maxHeight: H * SCHAAL, everyNthFrame: 1 });
  const t0 = Date.now();
  return {
    stop: async () => {
      const einde = Date.now() / 1000;   // zelfde tijdbasis als metadata.timestamp (seconden sinds 1970)
      await cdp.send('Page.stopScreencast').catch(() => {});
      await cdp.detach().catch(() => {});
      fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify(frames));
      if (!frames.length) { log(`${naam}: geen beelden ontvangen`); return; }
      // Beeldduur = afstand tot het volgende tijdstempel. Chrome stuurt alleen een beeld
      // als er iets verandert, dus het laatste beeld blijft staan tot het einde van de opname.
      const regels = [];
      for (let i = 0; i < frames.length; i++) {
        const d = i + 1 < frames.length ? Math.max(0.005, frames[i + 1].t - frames[i].t) : Math.max(0.5, einde - frames[i].t);
        regels.push(`file '${frames[i].f}'`, `duration ${d.toFixed(4)}`);
      }
      regels.push(`file '${frames[frames.length - 1].f}'`);
      const lijst = path.join(dir, 'lijst.txt'); fs.writeFileSync(lijst, regels.join('\n') + '\n');
      fs.mkdirSync(UIT, { recursive: true });
      const mp4 = path.join(UIT, naam + '.mp4');
      execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lijst,
        '-vf', `fps=${FPS},scale=${W * SCHAAL}:${H * SCHAAL}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '15', '-pix_fmt', 'yuv420p', mp4], { stdio: 'inherit' });
      const beeldtijd = frames[frames.length - 1].t - frames[0].t;
      log(`${naam}: ${frames.length} beelden (${maat(path.join(dir, frames[0].f))}) in ${((Date.now() - t0) / 1000).toFixed(1)} s, beeldtijd ${beeldtijd.toFixed(1)} s -> ${mp4}`);
    },
  };
}

async function studio() {
  // Het voorbeeldvenster van de studio is een afgeschermd iframe; Chrome tekent
  // dat in een eigen proces en de screencast laat het dan leeg. Site-isolatie uit.
  const { browser, page } = await open([`--force-device-scale-factor=${SCHAAL}`,
    '--disable-site-isolation-trials', '--disable-features=IsolateSandboxedIframes,IsolateOrigins,site-per-process']);
  await page.goto(SITE + '/eerste-ontwerp', { waitUntil: 'networkidle' });
  await weigerCookies(page); await stilScrollen(page);
  // Tijdens de intro klapt de pagina even in en komt de voettekst van de site
  // (logo en navigatie) onderin in beeld, midden in het licht van de poort.
  // Die voettekst hoort niet bij de studio; buiten beeld houden.
  await page.addStyleTag({ content: 'footer, .jw-footer, [class*="footer"] { visibility: hidden !important; }' });
  await page.waitForTimeout(800);

  // 1. De poort: de knop in beeld, opnemen, klikken, tot stap één er staat.
  log('fase: poort');
  const poortKnop = page.getByRole('button', { name: /open de poort/i }).first();
  await poortKnop.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(600);
  const seg1 = await opnemen(page, 'poort');
  await page.waitForTimeout(400);
  await poortKnop.click();
  await wachtOpTekst(page, 'stap (één|een) van vijf');
  await page.waitForTimeout(1000);
  await seg1.stop();

  // 2. Stap één: naam intypen, branche aantikken.
  log('fase: stap één');
  const veld = page.locator('input[placeholder*="Marlies"]').first();
  await veld.evaluate(el => el.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => window.scrollBy(0, -96));
  await page.waitForTimeout(500);
  const seg2 = await opnemen(page, 'stap1');
  await page.waitForTimeout(400);
  await veld.click();
  await veld.pressSequentially('Uw bedrijf', { delay: 110 });
  await page.waitForTimeout(500);
  await page.locator('button', { hasText: 'Kapper & salon' }).first().click();
  await page.waitForTimeout(1200);
  await seg2.stop();

  // Buiten beeld naar de onthulling: sfeer, opening (standaard), functies (geen), vier vragen (overslaan).
  log('fase: doorklikken');
  await klik(page, /^verder$/i); await wachtOpTekst(page, 'stap twee van vijf');
  await page.locator('button', { hasText: 'Warm & ambachtelijk' }).first().click();
  await klik(page, /^verder$/i); await wachtOpTekst(page, 'stap drie van vijf');
  await klik(page, /^verder$/i); await wachtOpTekst(page, 'stap vier van vijf');
  await klik(page, /open mijn website/i); await wachtOpTekst(page, 'stap vijf van vijf', 40000);
  await page.waitForTimeout(600);

  // 3. De onthulling: "Verder" op stap vijf, de boog tekent zichzelf, dan het
  //    ontwerp op volledig scherm en er rustig doorheen scrollen. (Op telefoonmaat
  //    toont de studio het voorbeeld alleen op volledig scherm, en daar loopt de
  //    rondleiding niet vanzelf; het scrollen doen we dus zelf, in echte tijd.)
  log('fase: onthulling');
  const verder = page.getByRole('button', { name: /^verder$/i }).first();
  await verder.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  const seg3 = await opnemen(page, 'onthulling');
  await page.waitForTimeout(400);
  await verder.click();
  await wachtOpTekst(page, 'lopen even met u mee', 20000);
  await page.waitForTimeout(300);
  try { await klik(page, /^telefoon$/i); } catch { log('geen knop Telefoon'); }
  await page.waitForTimeout(300);
  await klik(page, /volledig scherm/i);
  await page.waitForTimeout(600);
  // De knoppen van het volledig scherm ("Sluit volledig scherm", "Bewaar dit ontwerp")
  // zijn bediening, geen inhoud; in het verhaal vallen ze precies onder de naam van
  // Instagram en leiden ze af. Onzichtbaar maken, het ontwerp zelf blijft echt.
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button, a'))
      if (/sluit volledig scherm|bewaar dit ontwerp/i.test(b.textContent)) b.style.visibility = 'hidden';
  });
  await page.waitForTimeout(900);
  await scrollVoorbeeld(page, 6000);
  await page.waitForTimeout(1200);
  await seg3.stop();

  await browser.close();
}

// Het voorbeeld (een iframe, of anders het grootste scrollvak) rustig omlaag
// scrollen, in echte tijd, zodat de screencast de beweging vastlegt.
async function scrollVoorbeeld(page, ms) {
  const stappen = Math.round(ms / 40), ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let doel = null;
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    try {
      const t = await f.evaluate(() => (document.body && document.body.innerText) ? document.body.innerText.slice(0, 600) : '');
      if (/uw bedrijf/i.test(t)) { doel = f; break; }
    } catch { /* frame zonder toegang */ }
  }
  if (doel) {
    const max = await doel.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; return Math.max(0, document.documentElement.scrollHeight - innerHeight); });
    const tot = Math.min(max, 1100);
    log(`  voorbeeld is een iframe, scrolt ${tot} van ${max} px`);
    for (let i = 1; i <= stappen; i++) { await doel.evaluate(y => window.scrollTo(0, y), Math.round(tot * ease(i / stappen))); await page.waitForTimeout(40); }
    return;
  }
  const info = await page.evaluate(() => {
    const kandidaten = [...document.querySelectorAll('*')].filter(e => {
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      return /(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 50 && r.width > 200 && r.height > 200;
    });
    kandidaten.sort((a, b) => b.clientHeight - a.clientHeight);
    const e = kandidaten[0]; if (!e) return null;
    e.setAttribute('data-opname-scroll', '1'); e.style.scrollBehavior = 'auto';
    return { max: e.scrollHeight - e.clientHeight, hoogte: e.clientHeight };
  });
  if (!info) { log('  geen scrollvak gevonden'); return; }
  const tot = Math.min(info.max, 1100);
  log(`  voorbeeld is een scrollvak van ${info.hoogte} px, scrolt ${tot} van ${info.max} px`);
  for (let i = 1; i <= stappen; i++) {
    await page.evaluate(y => { document.querySelector('[data-opname-scroll]').scrollTop = y; }, Math.round(tot * ease(i / stappen)));
    await page.waitForTimeout(40);
  }
}

// Overzichtsvel per opname (vier beelden per seconde), om te beoordelen zonder video te kijken.
function vel(naam, perSeconde = 4) {
  const mp4 = path.join(UIT, naam + '.mp4'); if (!fs.existsSync(mp4)) return;
  const uit = path.join(WERK, `vel-${naam}.jpg`);
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', mp4,
    '-vf', `fps=${perSeconde},scale=135:240,tile=12x5`, '-frames:v', '1', '-q:v', '4', uit]);
  log(`vel: ${uit}`);
}

if (require.main === module) {
  (async () => {
    const wat = process.argv[2];
    if (wat === 'site') { await site(); vel('site', 2); }
    else if (wat === 'studio') { await studio(); for (const n of ['poort', 'stap1', 'onthulling']) vel(n); }
    else if (wat === 'vel') { for (const n of process.argv.slice(3)) vel(n); }
    else console.log('gebruik: node gereedschap/opname.cjs site | studio');
  })().catch(e => { console.error(e); process.exit(1); });
}
