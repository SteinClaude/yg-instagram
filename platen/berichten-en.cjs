// The twelve posts in English. Same ids and layout as berichten.cjs; only the words differ.
// Render:  node instagram/maak.cjs           (both languages)
//          node instagram/maak.cjs 03 en     (one post, one language)
// Prices written the English way (€ 665.50): a comma reads as thousands to an English reader.
const { sfeer, embleem } = require('./blokken.cjs');

const BAKKERIJ = {
  naam: 'Vermeer Bakery', kop: 'Every morning at five.', knop: 'See what we bake',
  tekst: 'Bread, pastry and coffee from our own oven, in the heart of the village.',
  nav: ['Contact', 'Order', 'Range'],
};

module.exports = [

  // 01 ----------------------------------------------------------- the opener
  {
    id: '01-entree', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Your gateway to digital excellence' },
      { t: 'kop', tekst: 'The entrance to your business.', grootte: 92, marge: 40 },
      { t: 'tekst', tekst: 'A website is the gateway your customers walk through. We build it with the feel of a five-star hotel: calm, polished and finished to the last detail.', grootte: 31 },
    ],
  },

  // 02 ----------------------------------------------------------- the price
  {
    id: '02-prijs', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'What it costs' },
      { t: 'kop', tekst: 'A website,\none-off from', grootte: 58, marge: 22 },
      { t: 'prijs', bedrag: '€ 550', onder: 'excl. VAT · € 665.50 incl.' },
      { t: 'tekst', tekst: 'You get a quote upfront with an amount and a delivery date. Extra work only goes ahead after you say yes.' },
    ],
  },

  // 03 --------------------------------------------------- work: Ordepartner
  {
    id: '03a-ordepartner', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Our work', marge: 26 },
      { t: 'kop', tekst: 'Ordepartner', grootte: 68, marge: 18 },
      { t: 'tekst', tekst: 'Alkmaar · website, logo and copy · 2026', grootte: 24, marge: 40 },
      { t: 'beeld', bron: 'orde-home-beeld.jpg', hoogte: 600 },
    ],
    voet: 'ordepartner.nl',
  },
  {
    id: '03b-ordepartner-mobiel', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Ordepartner', marge: 26 },
      { t: 'kop', tekst: 'The same calm on a small screen.', grootte: 56, marge: 38 },
      { t: 'beeld', bron: 'orde-home-mobiel.jpg', breedte: 360, hoogte: 600 },
    ],
    voet: 'ordepartner.nl',
  },
  {
    id: '03c-ordepartner-werk', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'What we did' },
      {
        t: 'lijst', items: [
          { kop: 'The website', tekst: 'A calm look that suits the trade.' },
          { kop: 'The logo', tekst: 'Recognisable on the van, in print and online.' },
          { kop: 'The copy', tekst: 'From rough sentences to a story that reads.' },
          { kop: 'Easy to update', tekst: 'Built so the owner can edit it themselves.' },
        ],
      },
    ],
    voet: 'ordepartner.nl',
  },

  // 04 ------------------------------------------------------- how it works
  {
    id: '04-werkwijze', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'How it works' },
      { t: 'kop', tekst: 'From first conversation to open door.', grootte: 58, marge: 40 },
      {
        t: 'lijst', gat: 26, items: [
          { kop: 'Conversation', tekst: 'We discuss what your business needs online. No obligation, with a quote upfront.' },
          { kop: 'Design', tekst: 'You receive a first version. Two rounds of revisions are included.' },
          { kop: 'Build', tekst: 'Fast, secure and made for every screen.' },
          { kop: 'Launch and aftercare', tekst: 'For thirty days we fix any faults for free.' },
        ],
      },
    ],
  },

  // 05 --------------------------------------------------- the free offer
  {
    id: '05-eerste-ontwerp', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Your entrance, already open', marge: 26 },
      { t: 'kop', tekst: 'See your dream website before it exists.', grootte: 62, marge: 34 },
      { t: 'beeld', bron: 'yg-ontwerp-beeld.jpg', snij: [420, 90, 600, 470], breedte: 620, hoogte: 486 },
      { t: 'tekst', tekst: 'Pick your trade and your style. In two minutes you see your own design. No obligation, no account, and it costs nothing.' },
    ],
    voet: 'yg-digital.nl/eerste-ontwerp',
  },

  // 06 -------------------------------------------------------- the promises
  {
    id: '06-afspraken', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'What you can expect from us' },
      { t: 'kop', tekst: 'Three fixed promises.', grootte: 62, marge: 40 },
      {
        t: 'lijst', gat: 30, items: [
          { kop: 'Fixed price upfront', tekst: 'A quote with an amount and a delivery date. Extra work only after your yes.' },
          { kop: 'A reply within one working day', tekst: 'One point of contact. No helpdesk and no ticket number.' },
          { kop: 'Two rounds and 30 days of aftercare', tekst: 'Your site only goes live when you are happy with it.' },
        ],
      },
    ],
  },

  // 07 ------------------------------------------------------- work: ourselves
  {
    id: '07a-eigen-site', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Our work', marge: 26 },
      { t: 'kop', tekst: 'Our own entrance.', grootte: 66, marge: 18 },
      { t: 'tekst', tekst: 'What we build for you, we built for ourselves first.', grootte: 24, marge: 40 },
      { t: 'beeld', bron: 'yg-home-beeld.jpg', hoogte: 600 },
    ],
  },
  {
    id: '07b-eigen-prijzen', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'On our site', marge: 26 },
      { t: 'kop', tekst: 'Prices you can simply read.', grootte: 56, marge: 38 },
      { t: 'beeld', bron: 'yg-prijzen-strook.jpg', snij: [210, 172, 512, 398], hoogte: 684 },
      { t: 'tekst', tekst: 'No “contact us for a quote”. It is all just there.', grootte: 26 },
    ],
  },
  {
    id: '07c-eigen-platform', soort: 'donker', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Why JouwWeb' },
      { t: 'kop', tekst: 'Because it costs you the least.', grootte: 60, marge: 36 },
      { t: 'tekst', tekst: 'Hosting, security certificate, updates and your own email address are included, and you can maintain everything yourself. Prefer Shopify, WordPress or Wix? We build there too.' },
    ],
  },

  // 08 ---------------------------------------------------------- hosting
  {
    id: '08-hosting', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'And after that?' },
      { t: 'kop', tekst: 'What a website costs once it is up.', grootte: 54, marge: 40 },
      {
        t: 'lijst', gat: 26, items: [
          { kop: 'Hosting from € 5.50 a month', tekst: 'Paid directly to the platform. We add nothing on top.' },
          { kop: 'Domain name free the first year', tekst: 'Then € 20 a year, in your own name.' },
          { kop: 'Maintenance € 45 an hour', tekst: 'Billed per quarter hour. A quick question in between costs nothing.' },
        ],
      },
      { t: 'tekst', tekst: 'Prices excl. VAT. Rates as of September 2026.', grootte: 22 },
    ],
  },

  // 09 ------------------------------------------------- three styles (studio)
  {
    id: '09a-sfeer-warm', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'From our design studio · 1 of 3', marge: 26 },
      { t: 'kop', tekst: 'The same bakery, three styles.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Style one: warm and artisanal.', grootte: 25, marge: 40 },
      sfeer({ sleutel: 'a', grond: '#FBF6EC', ink: '#2E241B', accent: '#A8783C', serif: true, ronde: 0, ...BAKKERIJ }),
    ],
  },
  {
    id: '09b-sfeer-modern', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'From our design studio · 2 of 3', marge: 26 },
      { t: 'kop', tekst: 'The same bakery, three styles.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Style two: clean and modern.', grootte: 25, marge: 40 },
      sfeer({ sleutel: 'b', grond: '#FFFFFF', ink: '#14181C', accent: '#176E5B', serif: false, ronde: 0, ...BAKKERIJ }),
    ],
  },
  {
    id: '09c-sfeer-chic', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'From our design studio · 3 of 3', marge: 26 },
      { t: 'kop', tekst: 'The same bakery, three styles.', grootte: 60, marge: 22 },
      { t: 'tekst', tekst: 'Style three: dark and chic.', grootte: 25, marge: 40 },
      sfeer({ sleutel: 'c', grond: '#16130F', ink: '#F2EBE0', accent: '#C9A45C', serif: true, ronde: 8, lijnknop: true, ...BAKKERIJ }),
    ],
  },

  // 10 --------------------------------------------------- logo and brand
  {
    id: '10-huisstijl', soort: 'ivoor', blokken: [
      { t: 'boven', tekst: 'Logo & brand identity', marge: 30 },
      embleem(240),
      { t: 'kop', tekst: 'Recognisable, down to the footer.', grootte: 58, marge: 30 },
      { t: 'tekst', tekst: 'A logo and brand identity that suit your entrance: calm, recognisable and carried through consistently on your website, your print and your social media.' },
    ],
  },

  // 11 --------------------------------------------------------- the phone
  {
    id: '11-telefoon', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'On the phone', marge: 26 },
      { t: 'kop', tekst: 'Most customers knock with a phone in their hand.', grootte: 54, marge: 36 },
      { t: 'beeld', bron: 'yg-home-mobiel.jpg', breedte: 360, hoogte: 560 },
      { t: 'tekst', tekst: 'That is why we design every site for the small screen too, and test it there before it opens.', grootte: 26 },
    ],
  },

  // 12 -------------------------------------------------------- get in touch
  {
    id: '12-kennismaken', soort: 'ivoor', blokken: [
      { t: 'lijn' },
      { t: 'boven', tekst: 'Get in touch' },
      { t: 'kop', tekst: 'Let us build your entrance.', grootte: 68, marge: 34 },
      { t: 'tekst', tekst: 'A no-obligation conversation about what your business needs online. Call, message or email — you will usually hear back the same day.', marge: 40 },
      { t: 'lijn', marge: 34 },
      { t: 'tekst', tekst: '06 42 65 31 77', grootte: 34, marge: 14 },
      { t: 'tekst', tekst: 'info@yg-digital.nl', grootte: 34 },
    ],
  },
];
