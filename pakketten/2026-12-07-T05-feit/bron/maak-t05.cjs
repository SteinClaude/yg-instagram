// T05 · feit "Uw reviews staan op Google. Niet op uw site." (familie Nacht, docs/stijlgids.md). Twee platen, gouden
// sterrenrij en telefoon. Les van T01: een constatering zonder cijfer, zonder naam.
// Bron (nagekeken 30 okt): Google-bedrijfsprofiel Help, "Tips om meer reviews te krijgen"
// (support.google.com/business/answer/3474122): reviews "worden naast uw bedrijfsprofiel op Maps en Zoeken getoond".
// Op uw eigen site staan ze dus niet vanzelf; daar moet u ze zelf laten zien.
//   node pakketten/2026-12-07-T05-feit/bron/maak-t05.cjs
'use strict';
const path = require('path');
const { sterren, telefoon } = require('../../../gereedschap/nacht-elementen.cjs');
const { bouwNacht } = require('../../../gereedschap/nacht-pakket.cjs');

bouwNacht(path.join(__dirname, '..'), [
  { blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 70 }, sterren, { t: 'ruimte', h: 50 },
    { t: 'kop', tekst: 'Uw reviews staan\nop Google.\nNiet op uw site.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Google toont ze bij uw bedrijfsprofiel in Maps en Zoeken. Op uw eigen website staan ze niet vanzelf.', grootte: 29, max: 780 } ] },
  { blokken: [
    { t: 'boven', tekst: 'De oplossing' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Laat ze zien waar\nde klant beslist.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Een paar echte reviews op uw site, met een link naar Google. Bekijk uw eerste ontwerp via de link in onze bio.', grootte: 29, max: 780 } ] },
]).catch(e => { console.error(e); process.exit(1); });
