// De verhalen voor de highlights op het profiel, per highlight één set die als
// geheel gelezen wordt. Besloten 23 september 2026 met Gijs: de inhoud van de
// highlights klopte niet (Prijzen zonder prijs, Contact zonder contactgegevens,
// Projecten zonder project), dus elke highlight krijgt een eigen, bewust
// samengestelde reeks. Stijl: champagne, zoals de weggeefactie-platen en de
// omslagen — lichte foto achter een ivoren waas, donkere tekst, embleem
// bovenaan, adres onderaan, alles boven de antwoordbalk van Instagram.
//
// De foto's zijn nieuw gegenereerd (Runway, nano-banana-pro, 9:16, 2K, 20 credits
// per stuk) in bron/highlights/. Zelfde onderwerpen als de voorraad van 16
// september, maar licht: ivoor, crème, messing, warm zacht licht. Een plaat
// wordt alleen gerenderd als zijn foto er al ligt.
//
// Volgorde telt: Instagram sorteert een highlight op de plaatsingsdatum van het
// verhaal, dus de set wordt in deze volgorde als verhalen geplaatst en daarna in
// één keer aan de highlight toegevoegd.
//
//   node platen/highlights.cjs entree              alles van die highlight
//   node platen/highlights.cjs entree 1            alleen plaat 1
//   node platen/highlights.cjs entree 1 --waas 0.5 met een andere waas (proef)
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');
const FOTOS = path.join(__dirname, 'bron', 'highlights');

// Geen garanties op de platen (besluit 22 sep). Bijgesteld 23 sep door Gijs:
// "antwoord binnen één werkdag" is een vaste afspraak en staat op site, bio en
// Facebook. Hosting niet noemen: die betaalt de klant rechtstreeks aan JouwWeb.
const SETS = {
  entree: [
    { foto: 'entree-1', boven: 'YG Digital', kop: 'De entree van uw bedrijf.',
      tekst: 'Een website is de deur waardoor uw klanten binnenkomen. Wij bouwen hem.' },
    { foto: 'entree-2', boven: 'YG Launch', kop: 'Wij bouwen uw website en houden hem bij.',
      lijst: [
        { kop: 'De bouw, eenmalig', tekst: 'Uw website, tot vijf pagina\u2019s.' },
        { kop: 'Daarna een vast bedrag per maand', tekst: 'Voor onderhoud, back-ups en kleine wijzigingen.' },
        { kop: 'Elke maand dertig minuten', tekst: 'Voor kleine wijzigingen. Groter werk offreren wij apart.' },
      ] },
    { foto: 'entree-3', boven: 'Werkwijze', kop: 'Eerst zien, dan live.',
      tekst: 'U ziet uw site voordat hij online gaat, met twee correctierondes.' },
    { foto: 'entree-4', boven: 'Op de telefoon', kop: 'Zo ziet de meeste klant u.',
      tekst: 'Daarom ontwerpen wij elke site eerst voor het kleine scherm.' },
    { foto: 'entree-5', boven: 'Klein bureau, korte lijnen', kop: 'U spreekt altijd dezelfde persoon.',
      tekst: 'Geen helpdesk, geen ticketnummer.' },
    { foto: 'entree-6', boven: 'Achter de schermen', kop: 'Snel, veilig en zonder gedoe.',
      tekst: 'U hoeft er niets van te zien. Wij zorgen dat het klopt, en blijft kloppen.' },
  ],
};

// Zelfde zone als W53: embleem net binnen het kader, voetregel op 1722, inhoud
// tot 1650 — alles boven de balk "Bericht verzenden".
const ZONE = { boven: 76, bodem: 1650, voet: 1722 };

const plaat = (v, waas) => ({
  achtergrond: { bron: path.relative(path.join(__dirname, 'bron'), path.join(FOTOS, v.foto + '.jpg')).replace(/\\/g, '/'),
    licht: true, helderheid: 1.06, verzadiging: 0.8, waas, positie: 'centre' },
  zone: ZONE, uitlijn: 'onder', veilig: true,
  blokken: [
    { t: 'lijn' },
    { t: 'boven', tekst: v.boven },
    { t: 'kop', tekst: v.kop, grootte: 86, marge: 36 },
    v.tekst ? { t: 'tekst', tekst: v.tekst, grootte: 33 } : null,
    v.lijst ? { t: 'lijst', grootte: 30, grootteTekst: 26, gat: 28, items: v.lijst } : null,
  ],
});

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
  return doel;
}

module.exports = { SETS, plaat, ZONE };

if (require.main === module) {
  (async () => {
    const [naam, alleen] = process.argv.slice(2).filter(a => !a.startsWith('--') && !/^\d*\.?\d+$/.test(a) || /^\d+$/.test(a));
    const wi = process.argv.indexOf('--waas'), waas = wi > 0 ? Number(process.argv[wi + 1]) : 0.6;
    const set = SETS[naam];
    if (!set) { console.error('onbekende highlight: ' + naam + ' (kies uit ' + Object.keys(SETS).join(', ') + ')'); process.exit(1); }
    for (const [i, v] of set.entries()) {
      const n = i + 1;
      if (alleen && String(n) !== alleen) continue;
      if (!fs.existsSync(path.join(FOTOS, v.foto + '.jpg'))) { console.log(`${naam} ${n}  ${v.foto}  (nog geen foto)`); continue; }
      const uit = await bewaar(await kaart(plaat(v, waas), 1080, 1920), `highlights/${naam}/${n}.jpg`);
      console.log(`${naam} ${n}  ${v.foto.padEnd(10)} waas ${waas}  \u2713  ${path.relative(WORTEL, uit)}`);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
