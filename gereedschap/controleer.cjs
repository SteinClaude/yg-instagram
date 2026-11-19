// Toetst of je sleutel en accountnummer kloppen, zonder iets te plaatsen.
//
//   node gereedschap/controleer.cjs <IG_USER_ID> <SLEUTEL> [account]
//
// Handig vlak nadat je ze in GitHub hebt gezet: hier zie je meteen of ze werken.
// account (kanaal-1, kanaal-2, account-3, …; zie src/accounts.cjs): dan zegt het script onder welke twee
// namen je ze in GitHub zet. Dit draai je op je eigen computer; de uitvoer komt nergens anders.
const IG = require('../src/instagram.cjs');
const T = require('../src/accounts.cjs');

const [igId, token, account] = process.argv.slice(2);
if (!igId || !token) {
  console.error('Gebruik: node gereedschap/controleer.cjs <IG_USER_ID> <SLEUTEL> [account]');
  process.exit(1);
}
const acc = T.zoek(account || T.EERSTE);
if (!acc) {
  console.error(`Onbekend account "${account}"; kies uit ${T.namen().join(', ')}.`);
  process.exit(1);
}

(async () => {
  const naam = await IG.wieBenIk(igId, token);
  console.log(`Sleutel werkt. Account: @${naam}`);

  try {
    const { gebruikt, limiet } = await IG.ruimteOver(igId, token);
    console.log(`Vandaag geplaatst via de API: ${gebruikt} van ${limiet}.`);
  } catch {
    console.log('(Het dagtellertje kon niet worden opgevraagd; dat is geen probleem.)');
  }

  console.log(`\nAlles in orde. Zet deze twee in GitHub als ${acc.geheimId} (het accountnummer) en ${acc.geheim} (de sleutel),`);
  console.log(`dat zijn de namen voor ${acc.label}; draai daarna de workflow met de knop Run workflow.`);
})().catch(f => {
  console.error('\nMislukt: ' + f.message);
  console.error('\nControleer of je het juiste accountnummer gebruikt (17841...) en of de');
  console.error('sleutel volledig is meegekopieerd.');
  process.exit(1);
});
