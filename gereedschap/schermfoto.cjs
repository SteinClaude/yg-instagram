// Eén scherpe schermafbeelding van een echte website op telefoonmaat, voor een
// stilstaand verhaal: 360 x 640 css-pixels op drievoudige schaal = 1080 x 1920.
// Cookiemelding vooraf geweigerd, geen muisaanwijzer. Zelfde Chrome-opzet als
// gereedschap/opname.cjs.
//
//   node gereedschap/schermfoto.cjs <adres> <naam> [--scroll=<css-px>] [--vol]
//
//   --scroll  begin van het venster in css-pixels vanaf de bovenkant van de pagina
//   --vol     de hele pagina in één beeld (1080 breed, zo hoog als de pagina), om
//             daarna een uitsnede te kiezen
//
// Resultaat: platen/uit/schermfotos/<naam>.png (niet in git).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');

const W = 360, H = 640, SCHAAL = 3;
const UIT = path.join(__dirname, '..', 'platen', 'uit', 'schermfotos');

async function main() {
  const [adres, naam, ...opties] = process.argv.slice(2);
  if (!adres || !naam) { console.log('gebruik: node gereedschap/schermfoto.cjs <adres> <naam> [--scroll=N] [--vol]'); process.exit(1); }
  const scroll = Number((opties.find(o => o.startsWith('--scroll=')) || '--scroll=0').slice(9));
  const vol = opties.includes('--vol');
  fs.mkdirSync(UIT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H }, deviceScaleFactor: SCHAAL, isMobile: true, hasTouch: false, locale: 'nl-NL',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  await page.goto(adres, { waitUntil: 'networkidle' });
  try { await page.getByRole('button', { name: /deny cookies|afwijzen/i }).first().click({ timeout: 4000 }); await page.waitForTimeout(500); } catch { /* geen melding */ }
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.body.style.scrollBehavior = 'auto'; });
  // JouwWeb houdt blokken onzichtbaar (opacity 0, 32 px lager) tot je erlangs scrolt
  // (klasse jw-reveal). Voor een schermafbeelding gewoon alles laten zien.
  await page.addStyleTag({ content: '.jw-reveal { opacity: 1 !important; transform: none !important; }' });
  // lui geladen beelden wakker maken
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1500);
  await page.evaluate(y => window.scrollTo(0, y), scroll); await page.waitForTimeout(1200);
  const uit = path.join(UIT, `${naam}${vol ? '-vol' : ''}.png`);
  await page.screenshot({ path: uit, type: 'png', fullPage: vol });
  const hoogte = await page.evaluate(() => document.documentElement.scrollHeight);
  await browser.close();
  console.log(`${uit}  (pagina ${hoogte} css-px hoog, venster vanaf ${scroll})`);
}

main().catch(e => { console.error(e); process.exit(1); });
