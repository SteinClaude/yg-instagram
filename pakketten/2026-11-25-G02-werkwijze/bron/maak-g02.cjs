// G02 · werkwijze "U spreekt altijd dezelfde persoon." (familie Nacht, docs/stijlgids.md). Drie platen, gouden
// aanhalingstekens zoals G01 en een telefoon. Bron (nagekeken 30 okt op yg-digital.nl/over-yg-digital): "Eén
// aanspreekpunt." · "Op elke vraag krijgt u binnen één werkdag persoonlijk antwoord, van een vast aanspreekpunt." ·
// "Wij spreken u telefonisch, online of bij u langs in de regio Alkmaar."
//   node pakketten/2026-11-25-G02-werkwijze/bron/maak-g02.cjs
'use strict';
const path = require('path');
const { telefoon } = require('../../../gereedschap/nacht-elementen.cjs');
const { bouwNacht } = require('../../../gereedschap/nacht-pakket.cjs');

bouwNacht(path.join(__dirname, '..'), [
  { blokken: [
    { t: 'boven', tekst: 'Onze werkwijze' },
    { t: 'prijs', bedrag: '“', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'U spreekt altijd\ndezelfde persoon.', grootte: 88, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Eén vast aanspreekpunt, van het eerste ontwerp tot het beheer daarna.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'Zo houden we contact' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Telefonisch, online\nof bij u langs.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'In de regio Alkmaar komen we gewoon even langs.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'Wat dat scheelt' },
    { t: 'prijs', bedrag: '”', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Wie u spreekt,\nkent uw website.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Niets opnieuw uitleggen, niet doorverbonden worden. Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 29, max: 780 } ] },
]).catch(e => { console.error(e); process.exit(1); });
