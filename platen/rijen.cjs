// Drie rijen van drie berichten, elk over één onderwerp. Deze platen worden
// ALLEEN een bericht (1080x1350) — bewust geen verhaal-versie, want dan staat
// dezelfde zin twee keer op het account. Verhalen hebben hun eigen onderwerpen
// in platen/verhalen-los.cjs.
//
//   node platen/rijen.cjs            alles renderen naar beeld/ en mini/
//   node platen/rijen.cjs belofte    alleen die rij
//
// Nummering: F26 t/m F34, in plaatsingsvolgorde. Een rij hoort aaneengesloten
// geplaatst te worden, anders valt hij in het raster uit elkaar.
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld'), MINI = path.join(WORTEL, 'mini');

// Op de plaat spreken we de lezer met "u" aan; in het bijschrift met "je".
const RIJEN = [

  // ---- rij 1 --------------------------------------------- wat wij beloven
  {
    rij: 'belofte', soort: 'donker',
    platen: [
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat wij beloven · 1 van 3' },
          { t: 'kop', tekst: 'Vaste prijs vooraf.', grootte: 94, marge: 40 },
          { t: 'tekst', tekst: 'U krijgt een offerte met een bedrag en een opleverdatum. Meerwerk gaat pas door nadat u er ja op heeft gezegd. Achteraf geen verrassingen.', grootte: 29 },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat wij beloven · 2 van 3' },
          { t: 'kop', tekst: 'Antwoord binnen\néén werkdag.', grootte: 78, marge: 40 },
          { t: 'tekst', tekst: 'Geen helpdesk, geen ticketnummer, geen wachtrij. U spreekt altijd dezelfde persoon, ook een jaar na oplevering.', grootte: 29 },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat wij beloven · 3 van 3' },
          { t: 'kop', tekst: 'Dertig dagen nazorg.', grootte: 84, marge: 40 },
          { t: 'tekst', tekst: 'Na oplevering blijft uw site een maand lang onze zorg. Wat er niet klopt, zetten we recht zonder dat er een rekening bij komt.', grootte: 29 },
        ],
      },
    ],
  },

  // ---- rij 2 ------------------------------------------------- wat het kost
  {
    rij: 'kosten', soort: 'ivoor',
    platen: [
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat het kost · 1 van 3' },
          { t: 'kop', tekst: 'Een website,\neenmalig vanaf', grootte: 56, marge: 22 },
          { t: 'prijs', bedrag: '€ 550', onder: 'excl. btw · € 665,50 inclusief' },
          { t: 'tekst', tekst: 'Wat het bij u precies wordt, hangt af van wat u nodig heeft. Dat bedrag staat in de offerte, vóórdat wij beginnen.', grootte: 28 },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat het kost · 2 van 3' },
          { t: 'kop', tekst: 'En daarna?', grootte: 94, marge: 40 },
          {
            t: 'lijst', items: [
              { kop: 'Hosting', tekst: 'Vanaf € 5,50 per maand. Uw site staat online en blijft online.' },
              { kop: 'Onderhoud', tekst: 'Alleen als u het wilt. Geen abonnement dat u niet gebruikt.' },
              { kop: 'Wijzigingen', tekst: 'Zelf doen kan. Liever niet? Dan doen wij het per uur.' },
            ],
          },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Wat het kost · 3 van 3' },
          { t: 'kop', tekst: 'Waarom wij onze\nprijzen opschrijven.', grootte: 64, marge: 40 },
          { t: 'tekst', tekst: 'Omdat u er recht op heeft te weten waar u aan begint. Wie zijn prijs pas noemt na een kennismakingsgesprek, heeft daar meestal een reden voor.', grootte: 29 },
        ],
      },
    ],
  },

  // ---- rij 3 ------------------------------------------------ hoe wij werken
  {
    rij: 'werkwijze', soort: 'donker',
    platen: [
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Hoe wij werken · 1 van 3' },
          { t: 'kop', tekst: 'Eerst het gesprek.', grootte: 94, marge: 40 },
          { t: 'tekst', tekst: 'Een half uur, bij u of aan de telefoon. Wat doet u, voor wie, en wat moet een bezoeker vooral kunnen vinden. Meer hebben wij niet nodig om te beginnen.', grootte: 29 },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Hoe wij werken · 2 van 3' },
          { t: 'kop', tekst: 'Dan het ontwerp.', grootte: 94, marge: 40 },
          { t: 'tekst', tekst: 'U ziet uw site voordat er iets gebouwd is. Bevalt de richting niet, dan verandert die nu — niet halverwege, als het duur wordt.', grootte: 29 },
        ],
      },
      {
        blokken: [
          { t: 'lijn' },
          { t: 'boven', tekst: 'Hoe wij werken · 3 van 3' },
          { t: 'kop', tekst: 'Dan pas bouwen,\nmet een datum erbij.', grootte: 64, marge: 40 },
          { t: 'tekst', tekst: 'Vanaf dat moment weet u wanneer uw deur opengaat. En wij weten wat wij te doen hebben.', grootte: 29 },
        ],
      },
    ],
  },
];

const F_START = 26;
const nr = n => String(n).padStart(2, '0');

// Achtergrond per plaat, in plaatsingsvolgorde. Echte ruimtes met diepte, in de
// stijl van de rij "Voor wie wij bouwen" die Gijs goed vindt: je ziet de wereld
// erachter, er brandt praktijklicht, het leest als een foto van een echte plek.
// Losse voorwerpen op een donkere tafel deden dat niet — die lazen als opgezet.
//
// De derde rij (F32-F34) staat hier nog als tekst, maar wordt als film geplaatst:
// de reels R09-R11 uit teksten/reels-nl.cjs. Zie gereedschap/plan-14-dagen.cjs.
const ACHTERGROND = [
  'ruimte-winkel',      // F26 vaste prijs    — oude winkel, raam op straat
  'ruimte-kantoor',     // F27 antwoord       — eenmanskantoor bij avond
  'ruimte-werkplaats',  // F28 nazorg         — werkbank onder hanglampen
  'ruimte-lunchroom',   // F29 vanaf € 550    — zaak vlak voor openen
  'ruimte-avond',       // F30 en daarna      — winkel die 's avonds nog brandt
  'ruimte-werkkamer',   // F31 waarom prijzen — werkkamer met papieren
  'ruimte-winkel',      // F32 gesprek        — niet gebruikt, gaat als reel R09
  'ruimte-kantoor',     // F33 ontwerp        — niet gebruikt, gaat als reel R10
  'ruimte-avond',       // F34 bouwen         — niet gebruikt, gaat als reel R11
];

// Sommige beelden zijn onderin licht; daar verzwakt witte tekst. Die zetten we dieper.
const DIEPER = { schets: 0.66, teksten2: 0.70, bureau: 0.80 };

// Vlakke lijst in plaatsingsvolgorde, met code en achtergrond erbij: F26, F27, ...
const ALLE = RIJEN.flatMap(r => r.platen.map(p => ({ ...p, rij: r.rij })))
  .map((p, i) => ({ ...p, code: `F${nr(F_START + i)}`, beeld: ACHTERGROND[i] }));

async function bewaar(png, relatief) {
  const doel = path.join(BEELD, relatief);
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile(doel);
  await sharp(doel).resize({ width: 260 }).jpeg({ quality: 72 }).toFile(path.join(MINI, relatief.replace(/\//g, '-')));
}

module.exports = { RIJEN, ALLE };

if (require.main === module) {
  (async () => {
    const alleen = process.argv[2];
    fs.mkdirSync(MINI, { recursive: true });
    let n = 0;
    for (const p of ALLE) {
      if (alleen && p.rij !== alleen) continue;
      await bewaar(await kaart({
        achtergrond: { bron: `ai/${p.beeld}.jpg`, helderheid: DIEPER[p.beeld] ?? 0.86, verzadiging: 0.9, donkerte: 0.94, positie: 'centre' },
        uitlijn: 'onder',
        blokken: p.blokken,
      }, 1080, 1350), `berichten/nl/${p.code}.jpg`);
      console.log(`${p.code}  ${p.rij.padEnd(10)} ${p.beeld.padEnd(12)} ✓`); n++;
    }
    console.log(`\n${n} berichtplaten in beeld/ en mini/`);
  })().catch(e => { console.error(e); process.exit(1); });
}
