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
// Er waren twee uitvoeringen. Gijs koos op 22 september de LICHTE:
//   A35   het bericht, 1080x1350
//   W53   het verhaal, 1080x1920
// De donkere tegenhanger (B35 / X53, de deur met het medaillon als zegel) is
// daarna weggehaald, zodat er bij het plaatsen niet per ongeluk de verkeerde
// tussenuit gepakt wordt. Hij staat in de geschiedenis van deze map.
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

const REGEL = 'Dat verdient meer dan een bedankje. Daarom bouwen wij voor \u00e9\u00e9n ondernemer een complete website: zeven pagina\u2019s, de teksten en een logo. Insturen kan tot en met 30 oktober; bij 500 volgers maken wij bekend wie het geworden is.';

const PLATEN = [
  // ---- A: licht, bericht ------------------------------------------------
  {
    code: 'A35', foto: 'deur', W: 1080, H: 1350,
    // 23 sep: zelfde idee als W53 \u2014 de kop is de trigger, het bedrag legt zichzelf
    // uit. De stappen staan hier niet op de plaat: die staan in het bijschrift
    // eronder, en op de rastertegel moet het rustig blijven.
    blokken: [
      zegel(300),
      { t: 'boven', tekst: '250 volgers in twee dagen \u00b7 dank u' },
      { t: 'kop', tekst: 'Wij geven \u00e9\u00e9n\nwebsite weg.', grootte: 80, marge: 40 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde op onze prijslijst \u00b7 u betaalt niets', grootte: 104, marge: 30 },
      { t: 'tekst', tekst: 'Zeven pagina\u2019s, de teksten en een logo, voor \u00e9\u00e9n ondernemer. Insturen kan tot en met 30 oktober; hoe u meedoet en waarop wij kiezen, leest u hieronder.', grootte: 27 },
    ],
  },
  // ---- A: licht, verhaal ------------------------------------------------
  {
    code: 'W53', foto: 'deur', W: 1080, H: 1920, veilig: true,
    // 23 sep: Gijs vond de plaat te leeg \u2014 medaillon te laag, ruimte onder de
    // tekst. De zone is daarom ruimer (200 tot 1600, voet op 1640) en alles is
    // een maat groter. Onder 1640 blijft 280 px vrij voor de antwoordbalk van
    // Instagram; officieel is 250 genoeg.
    // 23 sep, derde ronde \u2014 de definitieve. Gijs: het bedrag is de trigger, maar
    // groot "EUR 1.000" met klein "\u00e9\u00e9n website" eronder leest als geld. Daarom is
    // de KOP nu de trigger ("Wij geven \u00e9\u00e9n website weg."), staat de reden (de
    // 250 volgers) in de bovenregel, legt het bedrag zichzelf uit, en
    // staan de drie stappen op de plaat \u2014 een verhaal heeft geen bijschrift.
    // Gewone lettergroottes; de hoogte wordt gevuld met inhoud, niet met lucht.
    // Medaillon bovenaan de zone (uitlijn 'boven'), tekst loopt naar beneden uit.
    // Zone gemeten aan het echte verhaal (23 sep): Instagram toont 1080x1920
    // ongesneden; bovenin ± 160 px naam en muziek, onderin op de telefoon ± 250 px
    // antwoordbalk. Dus inhoud tot 1600, voetregel op 1650.
    // 23 sep, vierde ronde: Gijs wil de hele plaat gebruiken. Logo en voetregel
    // staan nu op dezelfde plek als in het bericht (vlak binnen het kader), en de
    // inhoud vult de ruimte ertussen (uitlijn 'vul'): de lucht gaat vooral naar de
    // naden tussen de groepen, niet tussen bovenregel en kop. Fijnafstelling op
    // Gijs' verzoek: alles, ook de voetregel, eindigt boven de balk "Bericht
    // verzenden" (± 1755-1850 op een telefoon waar hij over het beeld ligt).
    zone: { boven: 76, bodem: 1650, voet: 1722 }, uitlijn: 'vul',
    blokken: [
      { ...zegel(500, { marge: 40 }), rek: 1 },
      { t: 'boven', tekst: '250 volgers in twee dagen \u00b7 dank u', rek: 0 },
      { t: 'kop', tekst: 'Wij geven \u00e9\u00e9n\nwebsite weg.', grootte: 84, marge: 36, rek: 0.5 },
      { t: 'prijs', bedrag: '\u20ac 1.000', onder: 'de waarde op onze prijslijst \u00b7 u betaalt niets', grootte: 104, marge: 40, rek: 1.5 },
      { t: 'tekst', tekst: 'Zeven pagina\u2019s, de teksten en een logo, voor \u00e9\u00e9n ondernemer. Meedoen gaat zo.', grootte: 30, marge: 36, rek: 0.5 },
      { t: 'lijst', grootte: 28, grootteTekst: 24, gat: 34, marge: 36, rek: 1.2, items: [
        { kop: 'Stuur ons een priv\u00e9bericht', tekst: 'Begin met het woord Weggeefactie en vertel wat uw bedrijf doet.' },
        { kop: 'Vind ons bericht leuk', tekst: 'Het bericht met de poort op ons profiel.' },
        { kop: 'Deel het in uw verhaal', tekst: 'En tag @ygdigital.nl, zodat wij het zien.' },
      ] },
      { t: 'tekst', tekst: 'Insturen kan tot en met 30 oktober. Wij lezen elke inzending zelf en kiezen er \u00e9\u00e9n uit.', grootte: 27, marge: 28, rek: 0.5 },
      { t: 'tekst', tekst: META, grootte: 16, max: 760 },
    ],
  },
];

const MAP = { A35: 'berichten/nl', W53: 'verhalen/nl' };

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { PLATEN, zegel, META, REGEL };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    for (const p of PLATEN) {
      if (alleen && p.code !== alleen) continue;
      const plaat = { blokken: p.blokken, veilig: p.veilig, zone: p.zone, uitlijn: p.uitlijn };
      // Lichte foto: opgelicht en met een ivoren waas, zodat hij als afdruk op
      // crèmepapier achter het medaillon ligt. Zie a.licht in maak.cjs.
      if (p.foto) plaat.achtergrond = { bron: `ai/${p.foto}.jpg`, licht: true, helderheid: 1.18, verzadiging: 0.7, waas: 0.84, positie: 'centre' };
      else plaat.soort = p.soort || 'ivoor';
      await bewaar(await kaart(plaat, p.W, p.H), `${MAP[p.code]}/${p.code}.jpg`);
      console.log(`${p.code}  ${(p.achtergrond ? 'donker' : 'licht').padEnd(7)} ${p.W}x${p.H} \u2713`);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
