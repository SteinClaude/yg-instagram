// De twaalf startberichten voor Instagram. Teksten mag je hier gerust aanpassen;
// draai daarna opnieuw:  node instagram/maak.cjs
// Volgorde = plaatsingsvolgorde. 01 plaats je als eerste, 12 als laatste.
// Donker en ivoor wisselen elkaar af, zodat het raster op je profiel een dambord wordt.

const { sfeer, embleem } = require('./blokken.cjs');

module.exports = [

  // 01 ----------------------------------------------------------- de opener
  {
    id: '01-entree', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Your gateway to digital excellence' },
      { t: 'kop', tekst: 'De entree van uw bedrijf.', grootte: 98, marge: 40 },
      { t: 'tekst', tekst: 'Een website is de poort waardoor uw klanten binnenkomen. Wij bouwen die poort met de allure van een vijfsterrenhotel: rustig, verzorgd en tot in detail afgewerkt.', grootte: 31 },
    ],
  },

  // 02 ----------------------------------------------------------- de prijs
  {
    id: '02-prijs', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Wat het kost' },
      { t: 'kop', tekst: 'Een website,\neenmalig vanaf', grootte: 58, marge: 22 },
      { t: 'prijs', bedrag: '€ 550', onder: 'excl. btw · € 665,50 inclusief' },
      { t: 'tekst', tekst: 'U krijgt vooraf een offerte met een bedrag en een opleverdatum. Meerwerk gaat pas door nadat u er ja op heeft gezegd.' },
    ],
  },

  // 03 --------------------------------------------------- werk: Ordepartner
  {
    id: '03a-ordepartner', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Ons werk', marge: 26 },
      { t: 'kop', tekst: 'Ordepartner', grootte: 68, marge: 18 },
      { t: 'tekst', tekst: 'Alkmaar · website, logo en teksten · 2026', grootte: 24, marge: 40 },
      { t: 'beeld', bron: 'orde-home-beeld.jpg', hoogte: 600 },
    ],
    voet: 'ordepartner.nl',
  },
  {
    id: '03b-ordepartner-mobiel', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Ordepartner', marge: 26 },
      { t: 'kop', tekst: 'Dezelfde rust op een klein scherm.', grootte: 56, marge: 38 },
      { t: 'beeld', bron: 'orde-home-mobiel.jpg', breedte: 360, hoogte: 600 },
    ],
    voet: 'ordepartner.nl',
  },
  {
    id: '03c-ordepartner-werk', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Wat wij deden' },
      {
        t: 'lijst', items: [
          { kop: 'De website', tekst: 'Een rustige uitstraling die bij het vak past.' },
          { kop: 'Het logo', tekst: 'Herkenbaar op de bus, op drukwerk en online.' },
          { kop: 'De teksten', tekst: 'Van ruwe zinnen naar een verhaal dat leest.' },
          { kop: 'Zelf bij te werken', tekst: 'Zo opgebouwd dat de ondernemer er zelf in kan.' },
        ],
      },
    ],
    voet: 'ordepartner.nl',
  },

  // 04 ------------------------------------------------------- de werkwijze
  {
    id: '04-werkwijze', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Zo werkt het' },
      { t: 'kop', tekst: 'Van eerste gesprek tot open deur.', grootte: 58, marge: 40 },
      {
        t: 'lijst', gat: 26, items: [
          { kop: 'Gesprek', tekst: 'We bespreken wat uw bedrijf online nodig heeft. Vrijblijvend, met vooraf een offerte.' },
          { kop: 'Ontwerp', tekst: 'U ontvangt een eerste versie. Twee correctierondes zijn inbegrepen.' },
          { kop: 'Bouw', tekst: 'Snel, veilig en geschikt voor elk scherm.' },
          { kop: 'Lancering en nazorg', tekst: 'Dertig dagen herstellen wij eventuele fouten gratis.' },
        ],
      },
    ],
  },

  // 05 --------------------------------------------------- het gratis aanbod
  {
    id: '05-eerste-ontwerp', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Uw entree, alvast geopend', marge: 26 },
      { t: 'kop', tekst: 'Zie uw droomwebsite voordat hij bestaat.', grootte: 62, marge: 34 },
      { t: 'beeld', bron: 'yg-ontwerp-beeld.jpg', snij: [420, 90, 600, 470], breedte: 620, hoogte: 486 },
      { t: 'tekst', tekst: 'Kies uw branche en uw sfeer. In twee minuten ziet u uw eigen ontwerp. Vrijblijvend, zonder account, en het kost niets.' },
    ],
    voet: 'yg-digital.nl/eerste-ontwerp',
  },

  // 06 -------------------------------------------------------- de afspraken
  {
    id: '06-afspraken', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Wat u van ons mag verwachten' },
      { t: 'kop', tekst: 'Drie vaste afspraken.', grootte: 62, marge: 40 },
      {
        t: 'lijst', gat: 30, items: [
          { kop: 'Vaste prijs vooraf', tekst: 'Een offerte met een bedrag en een opleverdatum. Meerwerk pas na uw ja.' },
          { kop: 'Antwoord binnen één werkdag', tekst: 'Één aanspreekpunt. Geen helpdesk en geen ticketnummer.' },
          { kop: 'Twee rondes en 30 dagen nazorg', tekst: 'Uw site gaat pas live als u tevreden bent.' },
        ],
      },
    ],
  },

  // 07 ------------------------------------------------------- werk: wijzelf
  {
    id: '07a-eigen-site', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Ons werk', marge: 26 },
      { t: 'kop', tekst: 'Onze eigen entree.', grootte: 66, marge: 18 },
      { t: 'tekst', tekst: 'Wat wij voor u bouwen, bouwen wij eerst voor onszelf.', grootte: 24, marge: 40 },
      { t: 'beeld', bron: 'yg-home-beeld.jpg', hoogte: 600 },
    ],
  },
  {
    id: '07b-eigen-prijzen', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Op onze site', marge: 26 },
      { t: 'kop', tekst: 'Prijzen die u gewoon kunt lezen.', grootte: 56, marge: 38 },
      { t: 'beeld', bron: 'yg-prijzen-strook.jpg', snij: [210, 172, 512, 398], hoogte: 684 },
      { t: 'tekst', tekst: 'Geen “neem contact op voor een offerte”. Alles staat er gewoon.', grootte: 26 },
    ],
  },
  {
    id: '07c-eigen-platform', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Waarom JouwWeb' },
      { t: 'kop', tekst: 'Omdat u daar het minst kwijt bent.', grootte: 60, marge: 36 },
      { t: 'tekst', tekst: 'Hosting, beveiligingscertificaat, updates en een eigen e-mailadres zitten erbij, en u kunt zelf alles bijhouden. Wilt u liever Shopify, WordPress of Wix? Dan bouwen wij daar ook.' },
    ],
  },

  // 08 ---------------------------------------------------------- de hosting
  {
    id: '08-hosting', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'En daarna?' },
      { t: 'kop', tekst: 'Wat een website kost als hij eenmaal staat.', grootte: 54, marge: 40 },
      {
        t: 'lijst', gat: 26, items: [
          { kop: 'Hosting vanaf € 5,50 per maand', tekst: 'Betaalt u rechtstreeks aan het platform. Wij rekenen daar niets bovenop.' },
          { kop: 'Domeinnaam het eerste jaar gratis', tekst: 'Daarna € 20 per jaar, op uw eigen naam.' },
          { kop: 'Onderhoud € 45 per uur', tekst: 'Afgerond per kwartier. Een korte vraag tussendoor kost niets.' },
        ],
      },
      { t: 'tekst', tekst: 'Bedragen exclusief btw. Tarieven van september 2026.', grootte: 22 },
    ],
  },

  // 09 ------------------------------------------------- drie sferen (studio)
  {
    id: '09a-sfeer-warm', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Uit onze ontwerpstudio · 1 van 3', marge: 26 },
      { t: 'kop', tekst: 'Dezelfde bakker, drie sferen.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Sfeer één: warm en ambachtelijk.', grootte: 25, marge: 40 },
      sfeer({
        sleutel: 'a', grond: '#FBF6EC', ink: '#2E241B', accent: '#A8783C', serif: true, ronde: 0,
        naam: 'Bakkerij Vermeer', kop: 'Elke ochtend om vijf uur.', knop: 'Bekijk het assortiment',
        tekst: 'Brood, banket en koffie uit onze eigen oven, midden in het dorp.',
      }),
    ],
  },
  {
    id: '09b-sfeer-modern', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Uit onze ontwerpstudio · 2 van 3', marge: 26 },
      { t: 'kop', tekst: 'Dezelfde bakker, drie sferen.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Sfeer twee: strak en modern.', grootte: 25, marge: 40 },
      sfeer({
        sleutel: 'b', grond: '#FFFFFF', ink: '#14181C', accent: '#176E5B', serif: false, ronde: 0,
        naam: 'Bakkerij Vermeer', kop: 'Elke ochtend om vijf uur.', knop: 'Bekijk het assortiment',
        tekst: 'Brood, banket en koffie uit onze eigen oven, midden in het dorp.',
      }),
    ],
  },
  {
    id: '09c-sfeer-chic', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Uit onze ontwerpstudio · 3 van 3', marge: 26 },
      { t: 'kop', tekst: 'Dezelfde bakker, drie sferen.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Sfeer drie: donker en chic.', grootte: 25, marge: 40 },
      sfeer({
        sleutel: 'c', grond: '#16130F', ink: '#F2EBE0', accent: '#C9A45C', serif: true, ronde: 8, lijnknop: true,
        naam: 'Bakkerij Vermeer', kop: 'Elke ochtend om vijf uur.', knop: 'Bekijk het assortiment',
        tekst: 'Brood, banket en koffie uit onze eigen oven, midden in het dorp.',
      }),
    ],
  },

  // 10 --------------------------------------------------- logo en huisstijl
  {
    id: '10-huisstijl', soort: 'ivoor', blokken: [
      { t: 'boven', tekst: 'Logo & huisstijl', marge: 30 },
      embleem(240),
      { t: 'kop', tekst: 'Herkenbaar, tot in de voettekst.', grootte: 58, marge: 30 },
      { t: 'tekst', tekst: 'Een logo en huisstijl die passen bij uw entree: rustig, herkenbaar en consequent doorgevoerd op uw website, uw drukwerk en uw social media.' },
    ],
  },

  // 11 --------------------------------------------------------- de telefoon
  {
    id: '11-telefoon', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Op de telefoon', marge: 26 },
      { t: 'kop', tekst: 'De meeste klanten kloppen aan met een telefoon in de hand.', grootte: 54, marge: 36 },
      { t: 'beeld', bron: 'yg-home-mobiel.jpg', breedte: 360, hoogte: 560 },
      { t: 'tekst', tekst: 'Daarom ontwerpen wij elke site ook voor het kleine scherm, en testen wij hem daarop voordat hij opengaat.', grootte: 26 },
    ],
  },

  // 12 -------------------------------------------------------- kennismaken
  {
    id: '12-kennismaken', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Kennismaken' },
      { t: 'kop', tekst: 'Laat ons uw entree bouwen.', grootte: 68, marge: 34 },
      { t: 'tekst', tekst: 'Een vrijblijvend gesprek over wat uw bedrijf online nodig heeft. Bellen, appen of mailen mag — u hoort meestal nog dezelfde dag iets.', marge: 40 },
      { t: 'lijn', marge: 34 },
      { t: 'tekst', tekst: '06 44 89 21 82', grootte: 34, marge: 14 },
      { t: 'tekst', tekst: 'info@yg-digital.nl', grootte: 34 },
    ],
  },
];
