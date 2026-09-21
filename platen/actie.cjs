// De weggeefactie, maar dan zichtbaar bijzonder. Gijs zag het goed: de plaat van
// 21 september (F35) is mooi, maar hij lijkt op al zijn andere berichten — donkere
// deur, gouden labeltje, serif-kop onderaan. Op een miniatuur van 150 pixels ziet
// niemand dat hier iets bijzonders staat.
//
// Wat een tegel op een raster wél bijzonder maakt, in die volgorde:
//   1. omkeren van de kleur — één lichte tegel tussen donkere springt er meteen uit
//   2. één groot ding dat je op 150 px nog leest — hier het medaillon en € 1.000
//   3. een zegel of randwerk, zodat het als oorkonde leest en niet als bericht
//
// Twee uitvoeringen, want dit is een smaakkeuze:
//   A35 / W53   LICHT   ivoor met het medaillon groot. Springt het hardst eruit.
//   B35 / X53   DONKER  de deur van F35, met het medaillon als zegel erop. Blijft
//                       dichter bij de rest van het account.
//
// LET OP, dit is een juridische regel en geen stijlregel: er wordt niet geloot.
// Schrijf nergens "win", "maak kans", "trekking" of "verloting" — ook niet tussen
// finalisten. Zie de uitleg boven platen/weggeefactie.cjs.
//
//   node platen/actie.cjs        alles renderen
//   node platen/actie.cjs A35    alleen die ene
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// Het medaillon als rond zegel. Het bronbestand is vierkant met een bleke rand
// eromheen; die snijden we met een cirkel weg, anders zie je een vierkante vlek.
const MEDAILLON = 'data:image/png;base64,' +
  fs.readFileSync(path.join(__dirname, 'bron', 'merk', 'medaillon.png')).toString('base64');

const zegel = (maat, opties = {}) => ({
  t: 'svg', hoogte: maat, marge: opties.marge ?? 38,
  teken: (C, y) => {
    const d = maat * C.s, x = C.mx - d / 2, id = 'zegel' + Math.round(y);
    const ring = opties.ring === false ? '' :
      `<circle cx="${C.mx}" cy="${y + d / 2}" r="${d / 2 - 1}" fill="none" stroke="${C.k.goud}" stroke-width="1.4" opacity="0.7"/>`;
    return `<defs><clipPath id="${id}"><circle cx="${C.mx}" cy="${y + d / 2}" r="${d / 2 * 0.96}"/></clipPath></defs>` +
      `<image x="${x}" y="${y}" width="${d}" height="${d}" href="${MEDAILLON}" clip-path="url(#${id})" opacity="${opties.dekking ?? 1}"/>` + ring;
  },
});

// Verplicht bij een actie op Instagram: de vrijwaring. Bij een bericht mag hij in
// het bijschrift staan en daar staat hij; een verhaal heeft geen bijschrift, dus
// daar hoort hij op de plaat. Woordelijk gelijk aan die op V53.
const META = 'Deze actie wordt op geen enkele wijze gesponsord, onderschreven of '
  + 'beheerd door, of geassocieerd met, Instagram.';

const REGEL = 'Zeven pagina\u2019s, de teksten en een logo. Wij lezen elke inzending zelf en kiezen er \u00e9\u00e9n uit. Insturen kan tot en met 30 oktober.';

const PLATEN = [
  // ---- A: licht, bericht ------------------------------------------------
  {
    code: 'A35', soort: 'ivoor', W: 1080, H: 1350,
    blokken: [
      zegel(300),
      { t: 'boven', tekst: 'Onze weggeefactie \u00b7 najaar 2026' },
      { t: 'kop', tekst: 'E\u00e9n website,\nzonder rekening.', grootte: 80, marge: 46 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde \u00b7 u betaalt niets', grootte: 104, marge: 28 },
      { t: 'tekst', tekst: REGEL, grootte: 27 },
    ],
  },
  // ---- A: licht, verhaal ------------------------------------------------
  {
    code: 'W53', soort: 'ivoor', W: 1080, H: 1920, veilig: true,
    blokken: [
      zegel(340),
      { t: 'boven', tekst: 'Onze weggeefactie \u00b7 najaar 2026' },
      { t: 'kop', tekst: 'E\u00e9n website,\nzonder rekening.', grootte: 86, marge: 46 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde \u00b7 u betaalt niets', grootte: 112, marge: 30 },
      { t: 'tekst', tekst: REGEL, grootte: 29 },
      { t: 'tekst', tekst: 'Hoe u meedoet en waarop wij kiezen, leest u in ons bericht.', grootte: 26, marge: 22 },
      { t: 'tekst', tekst: META, grootte: 16, marge: 20, max: 760 },
    ],
  },
  // ---- B: donker met zegel, bericht -------------------------------------
  {
    code: 'B35', achtergrond: 'deur', helderheid: 0.58, W: 1080, H: 1350,
    blokken: [
      zegel(230),
      { t: 'boven', tekst: 'Onze weggeefactie \u00b7 najaar 2026' },
      { t: 'kop', tekst: 'E\u00e9n website,\nzonder rekening.', grootte: 78, marge: 46 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde \u00b7 u betaalt niets', grootte: 98, marge: 26 },
      { t: 'tekst', tekst: REGEL, grootte: 27 },
    ],
  },
  // ---- B: donker met zegel, verhaal -------------------------------------
  {
    code: 'X53', achtergrond: 'deur', helderheid: 0.55, W: 1080, H: 1920, veilig: true,
    blokken: [
      zegel(280),
      { t: 'boven', tekst: 'Onze weggeefactie \u00b7 najaar 2026' },
      { t: 'kop', tekst: 'E\u00e9n website,\nzonder rekening.', grootte: 84, marge: 46 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde \u00b7 u betaalt niets', grootte: 106, marge: 28 },
      { t: 'tekst', tekst: REGEL, grootte: 29 },
      { t: 'tekst', tekst: 'Hoe u meedoet en waarop wij kiezen, leest u in ons bericht.', grootte: 26, marge: 22 },
      { t: 'tekst', tekst: META, grootte: 16, marge: 20, max: 760 },
    ],
  },
];

const MAP = { A35: 'berichten/nl', B35: 'berichten/nl', W53: 'verhalen/nl', X53: 'verhalen/nl' };

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { PLATEN };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    for (const p of PLATEN) {
      if (alleen && p.code !== alleen) continue;
      const plaat = { blokken: p.blokken, veilig: p.veilig };
      if (p.achtergrond) plaat.achtergrond = { bron: `ai/${p.achtergrond}.jpg`, helderheid: p.helderheid, verzadiging: 0.9, donkerte: 0.95, positie: 'centre' };
      else plaat.soort = p.soort;
      await bewaar(await kaart(plaat, p.W, p.H), `${MAP[p.code]}/${p.code}.jpg`);
      console.log(`${p.code}  ${(p.achtergrond ? 'donker' : 'licht').padEnd(7)} ${p.W}x${p.H} \u2713`);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
