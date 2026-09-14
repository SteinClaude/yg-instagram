// Voorraad beeld voor Instagram, in twee talen: verhalen (1080x1920) en fotoberichten (1080x1350).
// Draaien:  node instagram/voorraad.cjs          -> uit/verhalen/{nl,en}/ en uit/fotoberichten/{nl,en}/
//           node instagram/voorraad.cjs V14 en   (alleen dat nummer, alleen die taal)
// Foto's komen uit bron/pexels/ (dezelfde set als de ontwerpstudio; Pexels-licentie, vrij te gebruiken).
const fs = require('fs'), path = require('path');
const { kaart } = require('./maak.cjs');

const UIT = taal => ({
  verhalen: path.join(__dirname, 'uit', 'verhalen', taal),
  fotoberichten: path.join(__dirname, 'uit', 'fotoberichten', taal),
});

// ---- vaste woorden per taal --------------------------------------------------
const W = {
  nl: {
    merk: 'YG Digital', voorWie: 'Voor wie wij bouwen', tip: 'Tip voor ondernemers', werk: 'Ons werk',
    sub: 'Websites vanaf € 550 · vaste prijs vooraf',
    prijsOnder: 'excl. btw · € 665,50 inclusief',
  },
  en: {
    merk: 'YG Digital', voorWie: 'Who we build for', tip: 'Tip for business owners', werk: 'Our work',
    sub: 'Websites from € 550 · fixed price upfront',
    prijsOnder: 'excl. VAT · € 665.50 incl.',
  },
};

// ---- voor wie wij bouwen: een foto per branche, met een regel erbij -----------
const BRANCHES = [
  { foto: '7195801', nl: 'Voor de kapper om de hoek.', en: 'For the hairdresser around the corner.' },
  { foto: '6517292', nl: 'Voor de coach met een volle agenda.', en: 'For the coach with a full calendar.' },
  { foto: '2403392', nl: 'Voor het restaurant dat vol wil zitten.', en: 'For the restaurant that wants a full house.' },
  { foto: '5710853', nl: 'Voor de vakman die liever bouwt dan typt.', en: 'For the craftsman who would rather build than type.' },
  { foto: '30506013', nl: "Voor de winkel die ook 's avonds open wil zijn.", en: 'For the shop that wants to stay open at night.' },
  { foto: '6560308', nl: 'Voor de praktijk waar mensen zich welkom voelen.', en: 'For the practice where people feel welcome.' },
  { foto: '3172844', nl: 'Voor de maker die zijn werk wil laten zien.', en: 'For the maker who wants to show their work.' },
  { foto: '1006293', nl: 'Voor het kantoor dat serieus genomen wil worden.', en: 'For the office that wants to be taken seriously.' },
  { foto: '5882647', nl: 'Voor iedereen met een bedrijf en te weinig tijd.', en: 'For anyone with a business and too little time.' },
];

// ---- sfeerfoto's met een belofte ---------------------------------------------
const SFEER = [
  { foto: '31236098', nl: ['De entree van uw bedrijf.', 'Wij bouwen hem. Rustig, verzorgd en tot in detail afgewerkt.'],
    en: ['The entrance to your business.', 'We build it. Calm, polished and finished to the last detail.'] },
  { foto: '939331', nl: ['Vaste prijs vooraf.', 'Een offerte met een bedrag en een opleverdatum. Meerwerk pas na uw ja.'],
    en: ['Fixed price upfront.', 'A quote with an amount and a delivery date. Extra work only after you say yes.'] },
  { foto: '10341587', nl: ['Antwoord binnen één werkdag.', 'Één aanspreekpunt. Geen helpdesk, geen ticketnummer.'],
    en: ['A reply within one working day.', 'One point of contact. No helpdesk, no ticket number.'] },
  { foto: '1034646', nl: ['Uw eerste ontwerp is gratis.', 'Twee minuten, geen account. U ziet uw site voordat hij bestaat.'],
    en: ['Your first design is free.', 'Two minutes, no account. See your site before it exists.'], voet: 'yg-digital.nl/eerste-ontwerp' },
];

// ---- tips voor ondernemers ---------------------------------------------------
const TIPS = [
  { nl: ['Staat uw telefoonnummer op elke pagina?', 'Niet alleen bij Contact. Wie wil bellen, wil nu bellen.'],
    en: ['Is your phone number on every page?', 'Not just under Contact. Whoever wants to call, wants to call now.'] },
  { nl: ['Open uw eigen site eens op uw telefoon.', 'Dat is wat de meeste klanten zien. Klopt het daar ook?'],
    en: ['Open your own site on your phone.', 'That is what most customers see. Does it hold up there?'] },
  { nl: ['Één knop per pagina.', 'Bellen, mailen of bestellen. Wie drie keuzes krijgt, kiest vaak niets.'],
    en: ['One button per page.', 'Call, email or order. Give people three choices and they often choose none.'] },
  { nl: ['Kloppen uw openingstijden nog?', 'Een verkeerde tijd op de site kost meer klanten dan geen site.'],
    en: ['Are your opening hours still right?', 'A wrong time on your site costs more customers than no site at all.'] },
  { nl: ['“Home” zegt Google niets.', 'Zet in uw paginatitel wat u doet en waar. “Kapsalon Vermeer, Alkmaar” wordt gevonden.'],
    en: ['“Home” means nothing to Google.', 'Put what you do and where in your page title. “Vermeer Hair Salon, Alkmaar” gets found.'] },
  { nl: ['Elke tel wachten kost bezoekers.', 'Grote foto’s zijn meestal de schuldige. Verklein ze voordat u ze plaatst.'],
    en: ['Every second of loading costs visitors.', 'Large photos are usually the culprit. Shrink them before you upload.'] },
  { nl: ['Een website is nooit af.', 'Prijzen, tijden, foto’s: wie ze bijhoudt, wordt gevonden.'],
    en: ['A website is never finished.', 'Prices, hours, photos: keep them current and you keep getting found.'] },
];

// ---- de zes vaste verhalen -----------------------------------------------------
const VAST = {
  nl: [
    { id: 'V01 - De entree van uw bedrijf', soort: 'donker', blokken: [
      { t: 'lijn' }, { t: 'boven', tekst: 'YG Digital' },
      { t: 'kop', tekst: 'De entree van uw bedrijf.', grootte: 104, marge: 44 },
      { t: 'tekst', tekst: 'Een website is de poort waardoor uw klanten binnenkomen. Wij bouwen hem.', grootte: 36 } ] },
    { id: 'V02 - Vanaf 550 euro', soort: 'ivoor', blokken: [
      { t: 'lijn' }, { t: 'boven', tekst: 'Wat het kost' },
      { t: 'kop', tekst: 'Een website,\neenmalig vanaf', grootte: 66, marge: 30 },
      { t: 'prijs', bedrag: '€ 550', grootte: 190, onder: W.nl.prijsOnder, marge: 44 },
      { t: 'tekst', tekst: 'Vaste prijs vooraf. Meerwerk gaat pas door nadat u er ja op heeft gezegd.', grootte: 33 } ] },
    { id: 'V03 - Uw eerste ontwerp is gratis', soort: 'donker', voet: 'yg-digital.nl/eerste-ontwerp', blokken: [
      { t: 'boven', tekst: 'Uw entree, alvast geopend', marge: 30 },
      { t: 'kop', tekst: 'Zie uw droomwebsite voordat hij bestaat.', grootte: 80, marge: 44 },
      { t: 'beeld', bron: 'yg-ontwerp-beeld.jpg', snij: [420, 90, 600, 470], breedte: 760, hoogte: 596, marge: 44 },
      { t: 'tekst', tekst: 'Twee minuten. Geen account. Het kost niets.', grootte: 34 } ] },
    { id: 'V04 - Ons werk, Ordepartner', soort: 'donker', voet: 'ordepartner.nl', blokken: [
      { t: 'boven', tekst: 'Ons werk', marge: 30 },
      { t: 'kop', tekst: 'Ordepartner', grootte: 90, marge: 20 },
      { t: 'tekst', tekst: 'Alkmaar · website, logo en teksten', grootte: 30, marge: 48 },
      { t: 'beeld', bron: 'orde-home-beeld.jpg', hoogte: 660 } ] },
    { id: 'V05 - Ons werk, onze eigen site', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Ons werk', marge: 30 },
      { t: 'kop', tekst: 'Onze eigen entree.', grootte: 88, marge: 20 },
      { t: 'tekst', tekst: 'Wat wij voor u bouwen, bouwen wij eerst voor onszelf.', grootte: 30, marge: 48 },
      { t: 'beeld', bron: 'yg-home-beeld.jpg', hoogte: 660 } ] },
    { id: 'V06 - Op de telefoon', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Op de telefoon', marge: 30 },
      { t: 'kop', tekst: 'Zo ziet de meeste klant u.', grootte: 78, marge: 44 },
      { t: 'beeld', bron: 'yg-home-mobiel.jpg', breedte: 430, hoogte: 860, marge: 44 },
      { t: 'tekst', tekst: 'Daarom bouwen en testen wij elke site ook voor het kleine scherm.', grootte: 30 } ] },
  ],
  en: [
    { id: 'V01 - The entrance to your business', soort: 'donker', blokken: [
      { t: 'lijn' }, { t: 'boven', tekst: 'YG Digital' },
      { t: 'kop', tekst: 'The entrance to your business.', grootte: 100, marge: 44 },
      { t: 'tekst', tekst: 'A website is the gateway your customers walk through. We build it.', grootte: 36 } ] },
    { id: 'V02 - From 550 euros', soort: 'ivoor', blokken: [
      { t: 'lijn' }, { t: 'boven', tekst: 'What it costs' },
      { t: 'kop', tekst: 'A website,\none-off from', grootte: 66, marge: 30 },
      { t: 'prijs', bedrag: '€ 550', grootte: 190, onder: W.en.prijsOnder, marge: 44 },
      { t: 'tekst', tekst: 'Fixed price upfront. Extra work only goes ahead after you say yes.', grootte: 33 } ] },
    { id: 'V03 - Your first design is free', soort: 'donker', voet: 'yg-digital.nl/eerste-ontwerp', blokken: [
      { t: 'boven', tekst: 'Your entrance, already open', marge: 30 },
      { t: 'kop', tekst: 'See your dream website before it exists.', grootte: 80, marge: 44 },
      { t: 'beeld', bron: 'yg-ontwerp-beeld.jpg', snij: [420, 90, 600, 470], breedte: 760, hoogte: 596, marge: 44 },
      { t: 'tekst', tekst: 'Two minutes. No account. It costs nothing.', grootte: 34 } ] },
    { id: 'V04 - Our work, Ordepartner', soort: 'donker', voet: 'ordepartner.nl', blokken: [
      { t: 'boven', tekst: 'Our work', marge: 30 },
      { t: 'kop', tekst: 'Ordepartner', grootte: 90, marge: 20 },
      { t: 'tekst', tekst: 'Alkmaar · website, logo and copy', grootte: 30, marge: 48 },
      { t: 'beeld', bron: 'orde-home-beeld.jpg', hoogte: 660 } ] },
    { id: 'V05 - Our work, our own site', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'Our work', marge: 30 },
      { t: 'kop', tekst: 'Our own entrance.', grootte: 88, marge: 20 },
      { t: 'tekst', tekst: 'What we build for you, we built for ourselves first.', grootte: 30, marge: 48 },
      { t: 'beeld', bron: 'yg-home-beeld.jpg', hoogte: 660 } ] },
    { id: 'V06 - On the phone', soort: 'donker', blokken: [
      { t: 'boven', tekst: 'On the phone', marge: 30 },
      { t: 'kop', tekst: 'This is how most customers see you.', grootte: 76, marge: 44 },
      { t: 'beeld', bron: 'yg-home-mobiel.jpg', breedte: 430, hoogte: 860, marge: 44 },
      { t: 'tekst', tekst: 'That is why we build and test every site for the small screen too.', grootte: 30 } ] },
  ],
};

// ---- hulpjes -------------------------------------------------------------------
// De zwart-witte fotostudio is van zichzelf al donker; die krijgt wat meer licht.
const HELDER = { '3172844': 1.08, '6560308': 0.92 };
const fotoPlaat = (foto, blokken, extra = {}) => ({
  achtergrond: { bron: 'pexels/' + foto + '.jpg', helderheid: HELDER[foto] ?? 0.82 }, uitlijn: 'onder', blokken, ...extra,
});
const schoon = s => s.replace(/[“”?.,'"]/g, '').trim();
const nr = n => String(n).padStart(2, '0');

// ---- de lijsten per taal -------------------------------------------------------
function verhalen(taal) {
  const w = W[taal];
  return [
    ...VAST[taal],
    ...TIPS.map((tip, i) => ({
      id: `V${nr(7 + i)} - Tip, ${schoon(tip[taal][0]).slice(0, 40).trim()}`,
      soort: i % 2 ? 'ivoor' : 'donker', blokken: [
        { t: 'lijn' }, { t: 'boven', tekst: w.tip },
        { t: 'kop', tekst: tip[taal][0], grootte: 86, marge: 44 },
        { t: 'tekst', tekst: tip[taal][1], grootte: 35 } ],
    })),
    ...BRANCHES.map((b, i) => fotoPlaat(b.foto, [
      { t: 'lijn' }, { t: 'boven', tekst: w.voorWie },
      { t: 'kop', tekst: b[taal], grootte: 86, marge: 36 },
      { t: 'tekst', tekst: w.sub, grootte: 32 } ], { id: `V${14 + i} - ${schoon(b[taal])}` })),
    ...SFEER.map((s, i) => fotoPlaat(s.foto, [
      { t: 'lijn' }, { t: 'boven', tekst: w.merk },
      { t: 'kop', tekst: s[taal][0], grootte: 92, marge: 36 },
      { t: 'tekst', tekst: s[taal][1], grootte: 33 } ], { id: `V${23 + i} - ${schoon(s[taal][0])}`, voet: s.voet })),
  ];
}

function fotoberichten(taal) {
  const w = W[taal];
  return [
    ...BRANCHES.map((b, i) => fotoPlaat(b.foto, [
      { t: 'lijn' }, { t: 'boven', tekst: w.voorWie },
      { t: 'kop', tekst: b[taal], grootte: 70, marge: 28 },
      { t: 'tekst', tekst: w.sub, grootte: 27 } ], { id: `F${nr(1 + i)} - ${schoon(b[taal])}` })),
    ...SFEER.map((s, i) => fotoPlaat(s.foto, [
      { t: 'lijn' }, { t: 'boven', tekst: w.merk },
      { t: 'kop', tekst: s[taal][0], grootte: 78, marge: 28 },
      { t: 'tekst', tekst: s[taal][1], grootte: 28 } ], { id: `F${10 + i} - ${schoon(s[taal][0])}`, voet: s.voet })),
  ];
}

module.exports = { verhalen, fotoberichten, TIPS, BRANCHES, SFEER, W };

if (require.main === module) {
  (async () => {
    const [filter, alleenTaal] = process.argv.slice(2);
    let n = 0;
    for (const taal of ['nl', 'en']) {
      if (alleenTaal && alleenTaal !== taal) continue;
      const uit = UIT(taal);
      for (const [lijst, map, Wd, Hd] of [[verhalen(taal), uit.verhalen, 1080, 1920], [fotoberichten(taal), uit.fotoberichten, 1080, 1350]]) {
        fs.mkdirSync(map, { recursive: true });
        for (const p of lijst) {
          if (filter && !p.id.startsWith(filter)) continue;
          fs.writeFileSync(path.join(map, p.id + '.png'), await kaart(p, Wd, Hd));
          console.log(taal.toUpperCase(), p.id.padEnd(58), '✓'); n++;
        }
      }
    }
    console.log('\n' + n + ' platen gerenderd');
  })().catch(e => { console.error(e); process.exit(1); });
}
