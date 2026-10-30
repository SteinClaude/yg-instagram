// T04 · feit "Uw website is om elf uur open." (familie Nacht, docs/stijlgids.md). Twee platen, gouden klok en telefoon.
// Les van T01: een constatering zonder cijfer, zonder naam. Wat er staat volgt uit hoe een website werkt: een pagina met
// een boekknop of offerteformulier is altijd bereikbaar, ook buiten openingstijd; de aanvraag komt binnen en de
// ondernemer reageert de volgende werkdag. Geen bewering over aantallen of percentages.
//   node pakketten/2026-11-30-T04-feit/bron/maak-t04.cjs
'use strict';
const path = require('path');
const { klok, telefoon } = require('../../../gereedschap/nacht-elementen.cjs');
const { bouwNacht } = require('../../../gereedschap/nacht-pakket.cjs');

bouwNacht(path.join(__dirname, '..'), [
  { blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, klok,
    { t: 'kop', tekst: 'Uw website is\nom elf uur open.', grootte: 88, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Uw zaak is dicht, de telefoon staat uit. Uw site staat gewoon aan.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'De oplossing' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Een knop om te boeken\nof een offerte te vragen.', grootte: 76, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Dan ligt de aanvraag er morgenochtend al. Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 29, max: 780 } ] },
]).catch(e => { console.error(e); process.exit(1); });
