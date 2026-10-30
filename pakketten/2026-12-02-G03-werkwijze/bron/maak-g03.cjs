// G03 · werkwijze "Antwoord binnen één werkdag." (familie Nacht, docs/stijlgids.md). Drie platen, gouden aanhalingstekens
// zoals G01/G02 en een telefoon. De klok uit het contentvoorstel is vervangen door het aanhalingsteken: T04 (de plaat
// ervoor in de rij) heeft al de klok, en de stijlgids zegt: niet hetzelfde element twee keer achter elkaar.
// Bron (nagekeken 30 okt): yg-digital.nl "U krijgt altijd binnen één werkdag antwoord."; /contact "U krijgt binnen één
// werkdag persoonlijk antwoord." en "Per e-mail of telefoon, kort en zonder verkooppraat."
//   node pakketten/2026-12-02-G03-werkwijze/bron/maak-g03.cjs
'use strict';
const path = require('path');
const { telefoon } = require('../../../gereedschap/nacht-elementen.cjs');
const { bouwNacht } = require('../../../gereedschap/nacht-pakket.cjs');

bouwNacht(path.join(__dirname, '..'), [
  { blokken: [
    { t: 'boven', tekst: 'Onze werkwijze' },
    { t: 'prijs', bedrag: '“', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Antwoord binnen\néén werkdag.', grootte: 96, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Op elke vraag, persoonlijk. Ook als het een kleine is.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'Hoe het gaat' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Per e-mail of telefoon,\nzonder verkooppraat.', grootte: 76, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Kort en duidelijk: wat het is, wat het kost en wanneer het klaar is.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'Wat dat scheelt' },
    { t: 'prijs', bedrag: '”', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'U weet snel\nwaar u aan toe bent.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Begin met uw eerste ontwerp via de link in onze bio. Vragen? Binnen één werkdag antwoord.', grootte: 29, max: 780 } ] },
]).catch(e => { console.error(e); process.exit(1); });
