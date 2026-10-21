// Highlight-omslagen: hetzelfde embleem als de profielfoto — wigstenen, tweede
// poort, relief, patina, korrel — met op de plek van de YG een symbool per
// highlight. Niet nagetekend: dit draait letterlijk door platen/profielfoto.cjs,
// alleen de tekenfunctie van de poort is vervangen.
//
// De vijf highlights (22 sep): Entree, Ons werk, Prijzen, Contact, Bij ons.
// Champagne, zoals het profiel. --donker geeft dezelfde vijf in goud op zwart.
//
// De symbolen zijn GEVULDE vormen, geen lijntjes: de YG is een gevulde letter met
// een dun donker randje, en dat randje en het relief komen uit profielfoto.cjs en
// werken alleen op vlakken. Een lijntekening zou er als een ander soort ding uitzien.
//
//   node platen/omslag-poort.cjs            alle vijf naar beeld/omslagen-poort/ + proefvel
//   node platen/omslag-poort.cjs contact    alleen die ene
//   node platen/omslag-poort.cjs --donker   goud op zwart
const fs = require('fs'), path = require('path');
const M = require('./maak.cjs');
const profiel = require('./profielfoto.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const UIT = path.join(WORTEL, 'beeld', 'omslagen-poort');
const PROEF = path.join(__dirname, 'uit', 'omslagen-poort-proef.jpg');
const PROFIEL = path.join(__dirname, 'uit', 'profiel-entree.png');

const STIJL = process.argv.includes('--donker') ? 'zwart' : 'champagne';
// Iets groter dan het profiel (7,4). Boven 7,6 raakt de drempel de rand van het
// rondje dat Instagram uitsnijdt; meer ruimte zit er dus niet in.
const SCHAAL = 7.6;
// Namen zoals Gijs ze op 22 sep zelf op het profiel zette: Bij ons, Entree,
// Projecten, Prijzen, Contact. ("Ons werk" heet bij hem dus Projecten.)
const VIJF = ['bij-ons', 'entree', 'projecten', 'prijzen', 'contact'];

// Symbolen in het vlak van de poort (100 x 110), op de plek van de YG: die staat
// op grootte 34 met de basislijn op 84, dus tussen y 60 en 84, rond x 50.
// Geen stroke-attribuut: het dunne randje komt van de laag eromheen, net als bij de YG.
const SYMBOOL = {
  entree: k =>               // een deurblad met twee panelen en een knop. Een kozijn op een kier was op 77 px een leeg kader.
    `<path d="M38 58h24v28H38Zm4 4v8h16v-8Zm0 12v8h16v-8Z" fill="${k}" fill-rule="evenodd"/>
     <circle cx="56.5" cy="73" r="1.4" fill="${k}"/>`,
  projecten: k =>            // een browservenster: kader met balk, twee regels tekst
    `<path d="M33 60h34v26H33Zm3.4 7v15.6h27.2V67Z" fill="${k}" fill-rule="evenodd"/>
     <path d="M40 71h16v2.6H40Zm0 5.4h10V79H40Z" fill="${k}"/>`,
  prijzen: k => {            // het euroteken, zelfde letter en grootte als de YG
    const g = 34, w = M.breedte(M.L.serif, '\u20AC', g, 0);
    return M.pad(M.L.serif, '\u20AC', 50 - w / 2, 84, g, 0, k).svg;
  },
  contact: k =>              // een hoorn
    `<path d="M40.5 58c-3.6 0-6.5 2.9-6.5 6.5 0 14.4 11.6 26 26 26 3.6 0 6.5-2.9 6.5-6.5v-4.6l-8.4-3.4-4.3 4.3c-5.2-2.4-9.4-6.6-11.8-11.8l4.3-4.3L43 58Z" fill="${k}"/>`,
  'bij-ons': k =>            // een filmklapper
    `<path d="M34 72h32v14H34Z" fill="${k}"/>
     <path d="M34.5 71l3.2-10h30.8l-3.2 10Zm7.6-8.2-2 6.4h3.2l2-6.4Zm9.6 0-2 6.4h3.2l2-6.4Zm9.6 0-2 6.4h3.2l2-6.4Z" fill="${k}" fill-rule="evenodd"/>`,
};

// Alternatieven per highlight (23 sep). Prijzen (euro) en Contact (hoorn) zijn
// goedgekeurd; voor de andere drie wilde Gijs andere opties zien.
//   node platen/omslag-poort.cjs --alternatieven   -> uit/omslagen-poort-alternatieven.jpg
const ALT = {
  entree: {
    sleutel: k =>            // een sleutel: de toegang
      `<path d="M50 58a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 3.6a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z" fill="${k}" fill-rule="evenodd"/>
       <path d="M48.3 70h3.4v16h-3.4Zm3.4 7.2h4v2.6h-4Zm0 4.6h3v2.6h-3Z" fill="${k}"/>`,
    bel: k =>                // een deurbel: plaatje met knop
      `<path d="M39 59h22a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H39a2 2 0 0 1-2-2V61a2 2 0 0 1 2-2Zm11 7.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="${k}" fill-rule="evenodd"/>
       <circle cx="50" cy="72" r="2.6" fill="${k}"/>`,
    huis: k =>               // een huis met een deuropening
      `<path d="M50 57l17 14v15H33V71Zm-4.5 21v8h9v-8Z" fill="${k}" fill-rule="evenodd"/>`,
    binnen: k =>             // een pijl de deur in
      `<path d="M53 58h10v28H53v-4.2h5.8V62.2H53Z" fill="${k}"/>
       <path d="M34 69.6h12.5V64l9.5 8-9.5 8v-5.6H34Z" fill="${k}"/>`,
  },
  projecten: {
    laptop: k =>             // een laptop
      `<path d="M36 59h28a1.6 1.6 0 0 1 1.6 1.6V79H34.4V60.6A1.6 1.6 0 0 1 36 59Zm2.2 3.2v13.6h23.6V62.2Z" fill="${k}" fill-rule="evenodd"/>
       <path d="M31 80.5h38v2.8a1.4 1.4 0 0 1-1.4 1.4H32.4a1.4 1.4 0 0 1-1.4-1.4Z" fill="${k}"/>`,
    map: k =>                // een map met tab
      `<path d="M34 61h11.5l3.5 3.5H66v21.5H34Z" fill="${k}"/>`,
    scherm: k =>             // een beeldscherm op een voet
      `<path d="M35 59h30a1.6 1.6 0 0 1 1.6 1.6v18.8a1.6 1.6 0 0 1-1.6 1.6H35a1.6 1.6 0 0 1-1.6-1.6V60.6A1.6 1.6 0 0 1 35 59Zm2.6 3v15.8h24.8V62Z" fill="${k}" fill-rule="evenodd"/>
       <path d="M47.5 81h5v3.4h-5Zm-5.5 3.6h16v2.2H42Z" fill="${k}"/>`,
    koffer: k =>             // een koffer
      `<path d="M35 66h30v20H35Zm0 8.2h30v1.6H35Z" fill="${k}" fill-rule="evenodd"/>
       <path d="M44.5 66v-4.4a1.6 1.6 0 0 1 1.6-1.6h7.8a1.6 1.6 0 0 1 1.6 1.6V66h-2.6v-3.4h-5.8V66Z" fill="${k}"/>`,
  },
  'bij-ons': {
    afspelen: k =>           // een afspeelknop: hier staan de filmpjes
      `<path d="M42 59.5v27l21-13.5Z" fill="${k}"/>`,
    koffie: k =>             // een kop koffie
      `<path d="M37 65h24v12.5a8.5 8.5 0 0 1-8.5 8.5h-7A8.5 8.5 0 0 1 37 77.5Z" fill="${k}"/>
       <path d="M61 68.5h2.5a4.2 4.2 0 0 1 0 8.4H61v-2.8h2.5a1.4 1.4 0 0 0 0-2.8H61Z" fill="${k}"/>`,
    camera: k =>             // een filmcamera
      `<path d="M34 65h22a1.6 1.6 0 0 1 1.6 1.6v14.8a1.6 1.6 0 0 1-1.6 1.6H34a1.6 1.6 0 0 1-1.6-1.6V66.6A1.6 1.6 0 0 1 34 65Z" fill="${k}"/>
       <path d="M58.5 71l9-5v16l-9-5Z" fill="${k}"/>`,
    mensen: k =>             // twee mensen
      `<circle cx="43.5" cy="64.5" r="4.4" fill="${k}"/><circle cx="56.5" cy="64.5" r="4.4" fill="${k}"/>
       <path d="M34.5 85v-5.5a9 9 0 0 1 18 0V85Zm13 0v-5.5a9 9 0 0 1 18 0V85Z" fill="${k}"/>`,
  },
};

// Definitieve keuze van Gijs (23 sep): sleutel, map, mensen. Euro en hoorn waren
// al goedgekeurd. De eerste versies (deurblad, browservenster, filmklapper) blijven
// hierboven staan onder hun oude naam, voor het geval.
SYMBOOL.entree = ALT.entree.sleutel;
SYMBOOL.projecten = ALT.projecten.map;
SYMBOOL['bij-ons'] = ALT['bij-ons'].mensen;

// Dezelfde poort als M.poort, zonder de letters, met het symbool ervoor in de plaats.
const poortMet = sym => (kleur, x = 0, y = 0, schaal = 1) =>
  `<g transform="translate(${M.r3(x)},${M.r3(y)}) scale(${M.r3(schaal)})">` +
  `<path d="M14 104V48a36 36 0 0 1 72 0v56" fill="none" stroke="${kleur}" stroke-width="2.5" stroke-linecap="round"/>` +
  `<path d="M24 104V50a26 26 0 0 1 52 0v54" fill="none" stroke="${kleur}" stroke-width="1" opacity="0.6"/>` +
  `<path d="M4 104h92" stroke="${kleur}" stroke-width="2" stroke-linecap="round"/>` +
  `<path d="M50 5l4.5 7-4.5 7-4.5-7z" fill="${kleur}"/>${sym(kleur)}</g>`;

// Rond uitgesneden, zoals Instagram het toont.
async function rond(buf, maat) {
  const masker = Buffer.from(`<svg width="${maat}" height="${maat}"><circle cx="${maat / 2}" cy="${maat / 2}" r="${maat / 2}" fill="#fff"/></svg>`);
  return sharp(buf).resize(maat, maat, { kernel: 'lanczos3' }).composite([{ input: masker, blend: 'dest-in' }]).png().toBuffer();
}

(async () => {
  const alleen = process.argv.slice(2).find(a => !a.startsWith('--'));
  fs.mkdirSync(UIT, { recursive: true });

  if (process.argv.includes('--alternatieven')) {
    // Per highlight een rij: het huidige symbool eerst, dan de vier alternatieven,
    // elk op 150 en op 77 px. Bestandsnaam per optie in uit/alternatieven/.
    const ALTUIT = path.join(__dirname, 'uit', 'alternatieven');
    fs.mkdirSync(ALTUIT, { recursive: true });
    const rijen = Object.keys(ALT), kol = 5, celB = 190, celH = 260;
    const lagen = [];
    for (const [r, hl] of rijen.entries()) {
      const opties = [['huidig', SYMBOOL[hl]], ...Object.entries(ALT[hl])];
      for (const [c, [naam, sym]] of opties.entries()) {
        const buf = await profiel.afwerken(profiel.plaat(profiel.P[STIJL], { poort: poortMet(sym), schaal: SCHAAL }));
        await sharp(buf).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(ALTUIT, `${hl}-${naam}.jpg`));
        const x0 = 20 + c * celB, y0 = 20 + r * celH;
        lagen.push({ input: await rond(buf, 150), left: x0, top: y0 });
        lagen.push({ input: await rond(buf, 77), left: x0 + 36, top: y0 + 165 });
        const label = Buffer.from(`<svg width="${celB}" height="22"><text x="${celB / 2 - 20}" y="16" text-anchor="middle" font-family="Arial" font-size="15" fill="#c9a45c">${naam}</text></svg>`);
        lagen.push({ input: label, left: x0 - 0, top: y0 + 150 });
        console.log(hl.padEnd(10), naam);
      }
      const kop = Buffer.from(`<svg width="180" height="30"><text x="0" y="22" font-family="Arial" font-size="18" fill="#f3eee4">${hl}</text></svg>`);
      lagen.push({ input: kop, left: 20 + kol * celB + 10, top: 20 + r * celH + 60 });
    }
    const VEL = path.join(__dirname, 'uit', 'omslagen-poort-alternatieven.jpg');
    await sharp({ create: { width: 40 + kol * celB + 200, height: 40 + rijen.length * celH, channels: 3, background: '#000000' } })
      .composite(lagen).jpeg({ quality: 90 }).toFile(VEL);
    console.log('\nvel:', VEL);
    return;
  }
  const sleutels = VIJF.filter(k => !alleen || k === alleen);
  const groot = [], klein = [];
  for (const k of sleutels) {
    const svg = profiel.plaat(profiel.P[STIJL], { poort: poortMet(SYMBOOL[k]), schaal: SCHAAL });
    const buf = await profiel.afwerken(svg);
    await sharp(buf).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, k + '.jpg'));
    groot.push(await rond(buf, 150)); klein.push(await rond(buf, 77));
    console.log(k.padEnd(12), 'klaar');
  }
  if (alleen) return;

  // Proefvel: profielfoto links, dan de omslagen op 150 en op 77 px (ware grootte
  // op een telefoon), op zwart zoals de Instagram-app.
  const heeftProfiel = fs.existsSync(PROFIEL);
  const prof = heeftProfiel ? await rond(await sharp(PROFIEL).png().toBuffer(), 150) : null;
  const profK = heeftProfiel ? await rond(await sharp(PROFIEL).png().toBuffer(), 77) : null;
  const n = sleutels.length, gap = 24;
  const breed = 40 + 150 + 40 + n * (150 + gap) + 20;
  const lagen = [];
  let xx = 40;
  if (prof) { lagen.push({ input: prof, left: xx, top: 40 }, { input: profK, left: xx + 36, top: 240 }); }
  xx += 150 + 40;
  for (let i = 0; i < n; i++) {
    lagen.push({ input: groot[i], left: xx + i * (150 + gap), top: 40 });
    lagen.push({ input: klein[i], left: xx + i * (150 + gap) + 36, top: 240 });
  }
  await sharp({ create: { width: breed, height: 350, channels: 3, background: '#000000' } })
    .composite(lagen).jpeg({ quality: 90 }).toFile(PROEF);
  console.log('\nproefvel:', PROEF);

  // Groot naast elkaar: het profiel en één omslag op 420 px, zodat je de wigstenen,
  // de tweede poort en het relief kunt vergelijken in plaats van erop te vertrouwen.
  if (heeftProfiel) {
    const GROOT = path.join(__dirname, 'uit', 'omslagen-poort-vergelijk.jpg');
    const a = await rond(await sharp(PROFIEL).png().toBuffer(), 420);
    const b = await rond(await sharp(path.join(UIT, sleutels[1] + '.jpg')).png().toBuffer(), 420);
    await sharp({ create: { width: 940, height: 500, channels: 3, background: '#000000' } })
      .composite([{ input: a, left: 40, top: 40 }, { input: b, left: 480, top: 40 }])
      .jpeg({ quality: 92 }).toFile(GROOT);
    console.log('vergelijking:', GROOT);
  }
})().catch(e => { console.error(e); process.exit(1); });
