// Zolang de pauze in gepauzeerd.json aan staat, schrijft geen planningsgereedschap
// iets in planning.json. Sinds 28 september 2026 staat alle oude content stil:
// Gijs en ChatGPT werken een volledig nieuwe contentrichting uit.
//
//   require('./pauze.cjs')(schrijft)   schrijft = zou dit gereedschap planning.json aanpassen?
//
// Opheffen alleen na akkoord van Gijs: zet pauze.actief in gepauzeerd.json op false.
// De automaat zelf (src/plaatsen.cjs) kijkt hier niet naar; die leest alleen planning.json.
const fs = require('fs'), path = require('path');

module.exports = function pauzeBewaken(schrijft) {
  if (!schrijft) return;
  let pauze = null;
  try { pauze = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'gepauzeerd.json'), 'utf8')).pauze; } catch { /* geen bestand: geen pauze */ }
  if (!pauze || !pauze.actief) return;
  console.error(`Planning gepauzeerd sinds ${pauze.sinds}: ${pauze.reden}`);
  console.error(`Niets geschreven. ${pauze.opheffen}`);
  process.exit(1);
};
