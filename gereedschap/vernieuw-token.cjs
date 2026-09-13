// Elke twee maanden: vernieuwt de sleutel. Je krijgt hier ruim op tijd een seintje
// over via een melding op GitHub.
//
//   node gereedschap/vernieuw-token.cjs <HUIDIGE_SLEUTEL>
//
// Zet de nieuwe sleutel daarna bij Settings > Secrets > Actions > IG_TOKEN (Update).
// Je hebt hier geen App ID of App Secret voor nodig: bij de Instagram-route
// vernieuwt de sleutel zichzelf.
const IG = require('../src/instagram.cjs');

const [huidige] = process.argv.slice(2);
if (!huidige) {
  console.error('Gebruik: node gereedschap/vernieuw-token.cjs <HUIDIGE_SLEUTEL>');
  console.error('De huidige sleutel staat in GitHub bij Settings > Secrets > Actions > IG_TOKEN.');
  process.exit(1);
}

(async () => {
  const { sleutel, dagen } = await IG.vernieuwSleutel(huidige);
  console.log(`\nNieuwe sleutel, ${dagen} dagen geldig:\n`);
  console.log('   ' + sleutel);
  console.log('\nZet hem bij Settings > Secrets and variables > Actions > IG_TOKEN (Update).');
  console.log('De oude blijft nog werken tot hij vanzelf verloopt.');
})().catch(f => {
  console.error('\nMislukt: ' + f.message);
  console.error('\nIs de sleutel al verlopen, of jonger dan 24 uur? In het eerste geval haal je');
  console.error('een nieuwe op via stap 3 in LEESMIJ.md; in het tweede geval wacht je een dag.');
  process.exit(1);
});
