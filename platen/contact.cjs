// Concepten voor de highlight Contact (26 sep 2026, opdracht van Gijs en ChatGPT):
// twee verhalen in de huisstijl, donker met goud en ivoor, Playfair Display en
// Montserrat, het poort-embleem bovenin en yg-digital.nl onderin. Bestaande
// beelden, geen generatie. De teksten staan letterlijk zoals aangeleverd; alleen
// de regelafbreking is met de hand gezet.
//
//   C01  de Contact-omslag van het profiel (poort met hoorn) als rond medaillon
//   C02  een echt ontwerp uit de ontwerpstudio, ingelijst (dus geen tekst over de site)
//
//   node platen/contact.cjs              -> beeld/highlights/contact/C01.jpg, C02.jpg (+ mini)
//   node platen/contact.cjs --controle   -> ook platen/uit/highlights/contact/C0x-controle.jpg,
//                                           met de balken van Instagram eroverheen
const fs = require('fs'), path = require('path');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const { kaart } = require('./maak.cjs');

const WORTEL = path.join(__dirname, '..');
const UIT = path.join(WORTEL, 'beeld', 'highlights', 'contact');
const MINI = path.join(WORTEL, 'mini');
const CONTROLE = path.join(WORTEL, 'platen', 'uit', 'highlights', 'contact');

// De omslag van de highlight Contact als rond medaillon: de champagne-ondergrond
// met een smalle donkere naad en een gouden ring eromheen, zoals een highlight-rondje.
const OMSLAG = 'data:image/jpeg;base64,' +
  fs.readFileSync(path.join(WORTEL, 'beeld', 'omslagen-poort', 'contact.jpg')).toString('base64');
const medaillon = (maat, opties = {}) => ({
  t: 'svg', hoogte: maat, marge: opties.marge ?? 40,
  teken: (C, y) => {
    const d = maat * C.s, r = d / 2, cy = y + r, id = 'medaillon' + Math.round(y);
    return `<defs><clipPath id="${id}"><circle cx="${C.mx}" cy="${cy}" r="${r - 8 * C.s}"/></clipPath></defs>` +
      `<image x="${C.mx - r}" y="${y}" width="${d}" height="${d}" href="${OMSLAG}" clip-path="url(#${id})"/>` +
      `<circle cx="${C.mx}" cy="${cy}" r="${r - 1}" fill="none" stroke="${C.k.goud}" stroke-width="1.8" opacity="0.85"/>`;
  },
});

// Zone: het kleine poort-embleem staat op 236, onder de naamregel van Instagram
// (± 115-190), zodat het op de telefoon volledig zichtbaar blijft (Gijs, 26 sep;
// eerder stond het op 76, zoals bij de weggeefactie, en viel het achter de
// voortgangsbalk). Inhoud tot 1650, yg-digital.nl op 1722, boven de antwoordbalk.
// De vrije ruimte gaat vooral naar de naad tussen beeld en tekst (rek), zodat de
// tekst als één groep bij elkaar blijft.
const BASIS = { veilig: true, zone: { boven: 236, bodem: 1650, voet: 1722 }, uitlijn: 'vul' };

const PLATEN = {
  C01: { ...BASIS, blokken: [
    { ...medaillon(640, { marge: 50 }), rek: 1 },
    { t: 'lijn', rek: 0 },
    { t: 'kop', tekst: 'Uw plannen beginnen\nmet een gesprek.', grootte: 80, marge: 34, rek: 0.3 },
    { t: 'tekst', tekst: 'Een nieuwe website nodig of\nbenieuwd wat er mogelijk is?\nStuur ons een bericht.', grootte: 36, marge: 44, rek: 0.45 },
    // Afsluiting iets groter (28 in plaats van 23) en op twee regels (Gijs, 26 sep).
    { t: 'boven', tekst: 'Stuur een DM\nAntwoord binnen \u00e9\u00e9n werkdag', grootte: 28, rek: 0 },
  ] },
  C02: { ...BASIS, blokken: [
    // Beeld uit de studio-opname van 25 sep (platen/bron/opnamen/onthulling.mp4, 5,8 s):
    // de kopbalk "Uw bedrijf", de salonfoto, "Kapper & salon" en de kop van het
    // voorbeeldontwerp; de zwarte strook erboven (tot rij 261) en de lopende tekst
    // eronder (vanaf rij 1640) vallen buiten de uitsnede.
    { t: 'beeld', bron: 'opnamen/studio-ontwerp.png', snij: [0, 262, 1080, 1330], breedte: 600, hoogte: 739, marge: 50, rek: 1 },
    { t: 'lijn', rek: 0 },
    { t: 'kop', tekst: 'Bekijk wat er mogelijk\nis voor uw bedrijf.', grootte: 80, marge: 34, rek: 0.3 },
    { t: 'tekst', tekst: 'Maak gratis een eerste ontwerp\nin onze ontwerpstudio.', grootte: 36, marge: 44, rek: 0.45 },
    { t: 'boven', tekst: 'Via de link in onze bio', rek: 0 },
  ] },
};

module.exports = { PLATEN };

if (require.main === module) {
  (async () => {
    const controle = process.argv.includes('--controle');
    fs.mkdirSync(UIT, { recursive: true }); fs.mkdirSync(MINI, { recursive: true });
    const codes = Object.keys(PLATEN);
    for (const [nr, code] of codes.entries()) {
      const png = await kaart(PLATEN[code], 1080, 1920);
      const doel = path.join(UIT, code + '.jpg');
      await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
      await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, `highlights-contact-${code}.jpg`));
      let regel = `${code} -> ${doel}`;
      if (controle) {
        const { telefoonbalken } = require('../gereedschap/verhaal-video.cjs');
        fs.mkdirSync(CONTROLE, { recursive: true });
        const cdoel = path.join(CONTROLE, code + '-controle.jpg');
        await sharp(png).composite([{ input: telefoonbalken({ nr, aantal: codes.length }) }]).jpeg({ quality: 88 }).toFile(cdoel);
        regel += `  (controle: ${cdoel})`;
      }
      console.log(regel);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
