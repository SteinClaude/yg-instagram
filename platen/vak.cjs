// De platen over ons vak: het maken van websites en apps. Twaalf gegenereerde
// beelden (bron/ai/, gemaakt met Runway op 16 september 2026, allemaal in dezelfde
// warme, donkere stijl) met een regel erbij. Elk beeld wordt een verhaal (9:16)
// én een fotobericht (4:5).
//
//   node platen/vak.cjs           alles renderen, rechtstreeks naar beeld/ en mini/
//   node platen/vak.cjs bureau    alleen dat beeld
//
// Nummering: verhalen V27-V38, fotoberichten F14-F25 (na de bestaande voorraad).
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// Op de plaat "u"; in het bijschrift (teksten/vak-nl.cjs) "je".
const VAK = [
  { beeld: 'bureau',    boven: 'Ons vak',                    kop: 'Elke site begint aan een bureau als dit.',
    tekst: 'Met aandacht, en met uw bedrijf als uitgangspunt.' },
  { beeld: 'schets',    boven: 'Ons vak',                    kop: 'Eerst op papier.',
    tekst: 'Voordat er één regel code staat, staat uw site op papier. Zo bouwen we niets wat u niet wilt.' },
  { beeld: 'telefoon',  boven: 'Op de telefoon',             kop: 'Zo ziet de meeste klant u.',
    tekst: 'Daarom ontwerpen wij elke site eerst voor het kleine scherm.' },
  { beeld: 'deur',      boven: 'YG Digital',                 kop: 'De entree van uw bedrijf.',
    tekst: 'Een website is de deur waardoor uw klanten binnenkomen. Wij bouwen hem.' },
  { beeld: 'tablet',    boven: 'Ook dat bouwen wij',         kop: 'Soms is een app de betere entree.',
    tekst: 'Een bestelling, een afspraak, een klantenkaart: wij maken wat bij uw bedrijf past.' },
  { beeld: 'code',      boven: 'Achter de schermen',         kop: 'Snel, veilig en zonder gedoe.',
    tekst: 'U hoeft er niets van te zien. Wij zorgen dat het klopt, en blijft kloppen.' },
  { beeld: 'huisstijl', boven: 'Logo & huisstijl',           kop: 'Herkenbaar, tot in de voettekst.',
    tekst: 'Logo, kleur en letter als één geheel: op uw site, uw drukwerk en uw social media.' },
  { beeld: 'studio',    boven: 'Klein bureau, korte lijnen', kop: 'U spreekt altijd dezelfde persoon.',
    tekst: 'Geen helpdesk, geen ticketnummer. Antwoord binnen één werkdag.' },
  { beeld: 'uurwerk',   boven: 'Goed gebouwd',               kop: 'Wat goed gebouwd is, loopt vanzelf.',
    tekst: 'Een site die u niet elke week hoeft na te kijken. Zo hoort het.' },
  { beeld: 'meldingen', boven: 'Ook buiten kantoortijd',     kop: 'Uw klanten zijn ook om elf uur ’s avonds online.',
    tekst: 'Uw site geeft dan al antwoord: prijzen, tijden en een knop om te bellen.' },
  { beeld: 'typen',     boven: 'Wij schrijven de teksten',   kop: 'U vertelt, wij schrijven.',
    tekst: 'Geen lege pagina’s meer. U leest het na, wij maken het af.' },
  { beeld: 'voordeur',  boven: 'Wat u van ons mag verwachten', kop: 'Een voordeur die vertrouwen geeft.',
    tekst: 'Vaste prijs vooraf. Antwoord binnen een werkdag. Dertig dagen nazorg.' },
];

const V_START = 27, F_START = 14;
const nr = n => String(n).padStart(2, '0');
const codeV = i => `V${nr(V_START + i)}`, codeF = i => `F${nr(F_START + i)}`;

const plaat = (v, soort) => ({
  id: v.beeld,
  achtergrond: { bron: `ai/${v.beeld}.jpg`, helderheid: v.helderheid ?? 0.86, verzadiging: 0.9, donkerte: 0.94, positie: 'centre' },
  uitlijn: 'onder',
  blokken: soort === 'verhaal'
    ? [{ t: 'lijn' }, { t: 'boven', tekst: v.boven }, { t: 'kop', tekst: v.kop, grootte: 86, marge: 36 }, { t: 'tekst', tekst: v.tekst, grootte: 33 }]
    : [{ t: 'lijn' }, { t: 'boven', tekst: v.boven }, { t: 'kop', tekst: v.kop, grootte: 70, marge: 28 }, { t: 'tekst', tekst: v.tekst, grootte: 28 }],
});

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { VAK, codeV, codeF };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const [i, v] of VAK.entries()) {
      if (alleen && v.beeld !== alleen) continue;
      await bewaar(await kaart(plaat(v, 'verhaal'), 1080, 1920), `verhalen/nl/${codeV(i)}.jpg`);
      await bewaar(await kaart(plaat(v, 'bericht'), 1080, 1350), `berichten/nl/${codeF(i)}.jpg`);
      console.log(`${codeV(i)} / ${codeF(i)}  ${v.beeld.padEnd(10)} ✓`); n += 2;
    }
    console.log(`\n${n} platen in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
