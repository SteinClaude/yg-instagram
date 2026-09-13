// Voert een wijziging uit die via een melding (issue) op GitHub is aangevraagd.
// Wordt aangeroepen door .github/workflows/wijzigen.yml; je hoeft dit zelf niet te draaien.
//
// Leest de tekst van de melding uit de omgeving (ISSUE_BODY) en past planning.json aan.
// Schrijft een leesbaar antwoord naar antwoord.txt, dat als reactie onder de melding komt.
const fs = require('fs'), path = require('path');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const ANTWOORD = path.join(WORTEL, 'antwoord.txt');

const body = process.env.ISSUE_BODY || '';

// GitHub-formulieren leveren de tekst aan als "### Kopje\n\nwaarde".
function veld(kopje) {
  const re = new RegExp('###\\s*' + kopje + '\\s*\\n+([\\s\\S]*?)(?=\\n###|$)', 'i');
  const m = body.match(re);
  if (!m) return '';
  const v = m[1].trim();
  return (v === '_No response_' || v === '_Geen antwoord_') ? '' : v;
}

const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const netjes = s => { const d = new Date(s + 'T12:00:00Z'); return `${DAGEN[d.getUTCDay()]} ${d.getUTCDate()} ${MAANDEN[d.getUTCMonth()]}`; };

function klaar(gelukt, tekst) {
  fs.writeFileSync(ANTWOORD, tekst, 'utf8');
  console.log(tekst);
  process.exit(gelukt ? 0 : 0);        // altijd 0: de melding krijgt een nette reactie
}

const planning = JSON.parse(fs.readFileSync(PLANNING, 'utf8'));
const id = veld('Welk item').trim();
const actie = veld('Wat moet er gebeuren').trim().toLowerCase();
const datum = veld('Nieuwe datum').trim();
const tekst = veld('Nieuwe tekst').trim();

if (!id) klaar(false, 'Ik zie geen itemnummer in deze melding. Vul bij **Welk item** iets in als `2026-09-21-bericht` en werk de melding bij.');

const n = planning.items.findIndex(i => i.id === id);
if (n < 0) {
  const buurt = planning.items.filter(i => i.id.startsWith(id.slice(0, 10))).map(i => '`' + i.id + '`');
  klaar(false, `Ik kan item \`${id}\` niet vinden.` +
    (buurt.length ? `\n\nBedoelde je een van deze?\n\n${buurt.map(b => '- ' + b).join('\n')}` : ''));
}
const item = planning.items[n];
const was = `${netjes(item.datum)} om ${item.tijd}`;

if (actie.startsWith('overslaan')) {
  planning.items.splice(n, 1);
  fs.writeFileSync(PLANNING, JSON.stringify(planning, null, 1));
  klaar(true, `Overgeslagen: het ${item.soort} van ${was} (${item.taal.toUpperCase()}) staat niet meer in de planning.\n\n` +
    `Er zijn nu ${planning.items.length} items gepland.`);
}

if (actie.startsWith('verzetten')) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    klaar(false, 'Om te verzetten heb ik een datum nodig bij **Nieuwe datum**, geschreven als `2026-10-05`.');
  }
  const bezet = planning.items.find(i => i.id !== item.id && i.datum === datum && i.soort === item.soort);
  item.datum = datum;
  item.id = `${datum}-${item.soort}`;
  // botsing voorkomen: als er al iets van hetzelfde soort staat, een teller erachter
  if (bezet) { let k = 2; while (planning.items.some(i => i.id === `${item.id}-${k}`)) k++; item.id = `${item.id}-${k}`; }
  planning.items.sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));
  fs.writeFileSync(PLANNING, JSON.stringify(planning, null, 1));
  klaar(true, `Verzet: het ${item.soort} dat op ${was} stond, gaat nu op ${netjes(datum)} om ${item.tijd}.` +
    (bezet ? `\n\nLet op: er stond al een ${item.soort} op die dag. Ze staan er nu allebei.` : ''));
}

if (actie.startsWith('tekst')) {
  if (item.soort === 'verhaal') {
    klaar(false, 'Een verhaal heeft geen bijschrift; de tekst staat op de plaat zelf. Wil je die veranderen, vraag het dan in het gesprek met Claude.');
  }
  if (!tekst) klaar(false, 'Ik zie geen nieuwe tekst bij **Nieuwe tekst**. Vul hem in en werk de melding bij.');
  if (tekst.length > 2200) klaar(false, `Die tekst is ${tekst.length} tekens; Instagram staat er 2200 toe. Maak hem korter.`);
  const oud = (item.tekst || '').split('\n')[0];
  item.tekst = tekst;
  fs.writeFileSync(PLANNING, JSON.stringify(planning, null, 1));
  klaar(true, `Tekst vervangen bij het bericht van ${was}.\n\nDe eerste regel was: _${oud}_\nEn is nu: _${tekst.split('\n')[0]}_`);
}

klaar(false, `Ik begrijp "${actie || '(leeg)'}" niet. Kies bij **Wat moet er gebeuren** voor Overslaan, Verzetten of Tekst wijzigen.`);
