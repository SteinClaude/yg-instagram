// Toetst of je sleutel en accountnummer kloppen, zonder iets te plaatsen.
//
//   node gereedschap/controleer.cjs <IG_USER_ID> <SLEUTEL>
//
// Handig vlak nadat je ze in GitHub hebt gezet: hier zie je meteen of ze werken.
const IG = require('../src/instagram.cjs');

const [igId, token] = process.argv.slice(2);
if (!igId || !token) {
  console.error('Gebruik: node gereedschap/controleer.cjs <IG_USER_ID> <SLEUTEL>');
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

  console.log('\nAlles in orde. Zet deze twee in GitHub als IG_USER_ID en IG_TOKEN,');
  console.log('en draai daarna de workflow met de knop Run workflow.');
})().catch(f => {
  console.error('\nMislukt: ' + f.message);
  console.error('\nControleer of je het juiste accountnummer gebruikt (17841...) en of de');
  console.error('sleutel volledig is meegekopieerd.');
  process.exit(1);
});
