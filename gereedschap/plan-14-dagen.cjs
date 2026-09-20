// Zet een verse planning van veertien dagen klaar.
//
//   node gereedschap/plan-14-dagen.cjs              vanaf morgen
//   node gereedschap/plan-14-dagen.cjs 2026-10-05   vanaf die dag
//   node gereedschap/plan-14-dagen.cjs 2026-10-05 --proef   alleen tonen, niets schrijven
//
// Wat het doet:
//   * bewaart de huidige planning als planning-oud-<datum>.json
//   * houdt alles wat al geplaatst is (staat in gedaan.json) ongemoeid
//   * gooit al het ongeplaatste eruit en zet er veertien verse dagen voor in de plaats
//   * negen berichten uit platen/rijen.cjs — drie rijen van drie, in volgorde
//   * veertien verhalen uit platen/verhalen-los.cjs — elke dag één
//
// De regel achter deze opzet: een onderwerp staat óf in een bericht, óf in een
// verhaal. Nooit allebei. Dat was precies wat het account saai maakte.
//
// Wil je een volgende ronde? Maak nieuwe platen (of hergebruik deze), pas de
// teksten aan en draai dit opnieuw met een nieuwe begindatum.
const fs = require('fs'), path = require('path');

const WORTEL = path.join(__dirname, '..');
const { ALLE } = require(path.join(WORTEL, 'platen/rijen.cjs'));
const { VRAGEN, codeV } = require(path.join(WORTEL, 'platen/verhalen-los.cjs'));
const { bijschrift } = require(path.join(WORTEL, 'teksten/rijen-nl.cjs'));

const PLANNING = path.join(WORTEL, 'planning.json');

// De deur-reel R01 is op 20 sep geplaatst zonder muziek; er kan achteraf geen
// geluid bij. Gijs haalt hem weg in de app en wij plannen hem opnieuw, nu met
// muziek in het bestand. Het bijschrift blijft precies hetzelfde.
const HERPLAATSING = JSON.parse(fs.readFileSync(path.join(WORTEL, 'planning-oud-2026-09-20.json'), 'utf8'))
  .items.find(i => (i.beeld || [])[0] === 'reels/R01.mp4').tekst;
const GEDAAN = path.join(WORTEL, 'gedaan.json');

// Drie rijen van drie. De dagafstand is zo gekozen dat elke rij binnen één week
// valt en het weekend ertussenuit blijft: ma-di-wo, vr-ma-di, wo-do-vr.
// Tien berichten: eerst de deur-reel opnieuw (die is zonder muziek geplaatst en
// door Gijs verwijderd), daarna drie rijen van drie. De dagafstand houdt elke rij
// binnen een week en laat het weekend ertussenuit.
const BERICHT_DAGEN = [0, 1, 2, 3, 4, 7, 8, 9, 10];
const BERICHT_TIJD = '11:00';
const VERHAAL_TIJDEN = ['08:00', '12:00', '17:00', '19:00'];

const dag = (start, n) => {
  const [j, m, d] = start.split('-').map(Number);
  const t = new Date(Date.UTC(j, m - 1, d + n));
  return t.toISOString().slice(0, 10);
};

function bouw(start) {
  const items = [];

  // De eerste zes zijn platen; de derde rij is film. Een .mp4 in beeld[] laat
  // src/plaatsen.cjs vanzelf de reel-route nemen, de soort blijft 'bericht'.
  const BERICHTEN = [
    ...ALLE.slice(0, 6).map(p => ({ beeld: `berichten/nl/${p.code}.jpg`, tekst: bijschrift(p.code) })),
    ...['F32', 'F33', 'F34'].map((code, i) => ({ beeld: `reels/R${String(9 + i).padStart(2, '0')}.mp4`, tekst: bijschrift(code) })),
  ];

  BERICHTEN.forEach((b, i) => {
    const datum = dag(start, BERICHT_DAGEN[i]);
    items.push({
      id: `${datum}-bericht`, datum, tijd: BERICHT_TIJD, soort: 'bericht', taal: 'nl',
      beeld: [b.beeld],
      tekst: b.tekst,
      eenmalig: true,
    });
  });

  VRAGEN.forEach((v, i) => {
    const datum = dag(start, i);
    items.push({
      id: `${datum}-verhaal`, datum, tijd: VERHAAL_TIJDEN[i % VERHAAL_TIJDEN.length],
      soort: 'verhaal', taal: 'nl',
      beeld: [`verhalen/nl/${codeV(i)}.jpg`],
      titel: v.vraag,
      eenmalig: true,
    });
  });

  return items.sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));
}

if (require.main === module) {
  const argumenten = process.argv.slice(2);
  const proef = argumenten.includes('--proef');
  const start = argumenten.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || dag(new Date().toISOString().slice(0, 10), 1);

  const oud = JSON.parse(fs.readFileSync(PLANNING, 'utf8'));
  const gedaan = new Set(JSON.parse(fs.readFileSync(GEDAAN, 'utf8')).items.map(i => i.id));

  const bewaren = oud.items.filter(i => gedaan.has(i.id));
  const weg = oud.items.length - bewaren.length;
  const nieuw = bouw(start);

  console.log(`begindatum        ${start}`);
  console.log(`behouden          ${bewaren.length} (al geplaatst of overgeslagen)`);
  console.log(`geschrapt         ${weg} nog niet geplaatste items`);
  console.log(`nieuw ingepland   ${nieuw.length} (${nieuw.filter(i => i.soort === 'bericht').length} berichten, ${nieuw.filter(i => i.soort === 'verhaal').length} verhalen)`);
  console.log('');
  for (const i of nieuw) console.log(`  ${i.datum} ${i.tijd}  ${i.soort.padEnd(8)} ${i.beeld[0].replace(/^.*\//, '').padEnd(9)} ${i.titel || (i.tekst || '').split('\n')[0]}`);

  if (proef) { console.log('\n--proef: er is niets weggeschreven.'); return; }

  const kopie = path.join(WORTEL, `planning-oud-${new Date().toISOString().slice(0, 10)}.json`);
  fs.copyFileSync(PLANNING, kopie);
  fs.writeFileSync(PLANNING, JSON.stringify({
    tijdzone: oud.tijdzone, gemaakt: new Date().toISOString().slice(0, 10),
    items: [...bewaren, ...nieuw],
  }, null, 2) + '\n', 'utf8');
  console.log(`\noude planning bewaard als ${path.basename(kopie)}`);
  console.log(`planning.json bijgewerkt: ${bewaren.length + nieuw.length} items`);
}

module.exports = { bouw };
