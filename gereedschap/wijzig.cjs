// Voert een wijziging uit die via een melding (issue) op GitHub is aangevraagd,
// of zet een nieuw item in de planning. Wordt aangeroepen door
// .github/workflows/wijzigen.yml; je hoeft dit zelf niet te draaien.
//
// Leest de tekst van de melding uit de omgeving (ISSUE_BODY), past planning.json
// aan en zet een eigen foto bijgesneden in beeld/eigen/ (met een kleintje in
// mini/). Schrijft een leesbaar antwoord naar antwoord.txt, dat als reactie
// onder de melding komt.
//
// Zelf proberen, zonder GitHub:
//   ISSUE_BODY="### Welk item\n\n2026-10-05-bericht\n\n### Wat moet er gebeuren\n\nOverslaan" node gereedschap/wijzig.cjs
const fs = require('fs'), path = require('path');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const GEDAAN = path.join(WORTEL, 'gedaan.json');
const ANTWOORD = path.join(WORTEL, 'antwoord.txt');
const BEELD = path.join(WORTEL, 'beeld');
const MINI = path.join(WORTEL, 'mini');

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

function nuInAmsterdam() {
  const d = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date()).reduce((a, p) => (a[p.type] = p.value, a), {});
  return `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}`;
}

function klaar(gelukt, tekst) {
  fs.writeFileSync(ANTWOORD, tekst, 'utf8');
  console.log(tekst);
  process.exit(0);                     // altijd 0: de melding krijgt een nette reactie
}

const planning = JSON.parse(fs.readFileSync(PLANNING, 'utf8'));
const bewaar = () => fs.writeFileSync(PLANNING, JSON.stringify(planning, null, 1));
const sorteer = () => planning.items.sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));

// Een id dat nog nergens voorkomt: niet in de planning, en ook niet in het
// logboek, want een id dat daar al in staat wordt nooit meer geplaatst.
function vrijId(datum, soort, behalve) {
  let logboek = [];
  try { logboek = JSON.parse(fs.readFileSync(GEDAAN, 'utf8')).items.map(i => i.id); } catch { /* geen logboek */ }
  const bezet = id => planning.items.some(i => i !== behalve && i.id === id) || logboek.includes(id);
  let id = `${datum}-${soort}`;
  for (let k = 2; bezet(id); k++) id = `${datum}-${soort}-${k}`;
  return id;
}

// --- foto's ------------------------------------------------------------------

// Haalt de link van de bijgevoegde foto uit wat GitHub in het vak zet. Dat is
// meestal ![naam](https://github.com/user-attachments/assets/...), soms een <img>.
function fotoLink(vak) {
  const m = (vak || '').match(
    /https:\/\/(?:github\.com\/(?:user-attachments\/assets|[^\s/]+\/[^\s/]+\/assets)\/[^\s)"'<>]+|(?:private-)?user-images\.githubusercontent\.com\/[^\s)"'<>]+)/);
  return m ? m[0] : '';
}

async function haalFoto(url) {
  const a = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'yg-plaatser' } });
  if (!a.ok) throw new Error(`GitHub gaf ${a.status} terug bij het ophalen van de foto`);
  const buf = Buffer.from(await a.arrayBuffer());
  if (buf.length > 30 * 1024 * 1024) throw new Error('de foto is groter dan 30 MB');
  return buf;
}

// Snijdt de foto staand bij, in de maat die Instagram verwacht, en maakt het
// kleintje voor het dashboard. Oude eigen foto's van hetzelfde item ruimen we
// op, anders groeit de repo bij elke wissel.
async function fotoVerwerken(buf, item) {
  const sharp = require('sharp');
  const [breed, hoog] = item.soort === 'verhaal' ? [1080, 1920] : [1080, 1350];
  const stempel = nuInAmsterdam().replace(/[^0-9]/g, '');
  const naam = `eigen/${item.datum}-${item.soort}-${stempel}.jpg`;
  fs.mkdirSync(path.join(BEELD, 'eigen'), { recursive: true });
  fs.mkdirSync(MINI, { recursive: true });

  let bron;
  try { bron = sharp(buf).rotate(); await bron.metadata(); }
  catch { throw new Error('ik kon de foto niet lezen; stuur hem als JPG of PNG'); }

  await bron.clone()
    .resize(breed, hoog, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(BEELD, naam));
  await sharp(path.join(BEELD, naam))
    .resize({ width: 260 }).jpeg({ quality: 72 })
    .toFile(path.join(MINI, naam.replace(/\//g, '-')));

  for (const oud of item.beeld || []) {
    if (!oud.startsWith('eigen/')) continue;
    for (const p of [path.join(BEELD, oud), path.join(MINI, oud.replace(/\//g, '-'))]) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }
  return naam;
}

const staand = soort => soort === 'verhaal' ? '9:16' : '4:5';
const geenFoto = veldnaam =>
  `Ik zie geen foto bij **${veldnaam}**. Tik in dat vak, voeg de foto toe en wacht tot er een regel met een link in staat. Werk daarna de melding bij.`;

// --- een bestaand item wijzigen ---------------------------------------------

async function wijzig() {
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
    bewaar();
    klaar(true, `Overgeslagen: het ${item.soort} van ${was} staat niet meer in de planning.\n\n` +
      `Er zijn nu ${planning.items.length} items gepland.`);
  }

  if (actie.startsWith('verzetten')) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || isNaN(Date.parse(datum))) {
      klaar(false, 'Om te verzetten heb ik een datum nodig bij **Nieuwe datum**, geschreven als `2026-10-05`.');
    }
    if (`${datum} ${item.tijd}` < nuInAmsterdam()) {
      klaar(false, `${netjes(datum)} om ${item.tijd} is al voorbij. Kies een datum die nog komt.`);
    }
    const bezet = planning.items.find(i => i !== item && i.datum === datum && i.soort === item.soort);
    item.datum = datum;
    item.id = vrijId(datum, item.soort, item);
    sorteer(); bewaar();
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
    bewaar();
    klaar(true, `Tekst vervangen bij het bericht van ${was}.\n\nDe eerste regel was: _${oud}_\nEn is nu: _${tekst.split('\n')[0]}_`);
  }

  if (actie.startsWith('foto')) {
    const link = fotoLink(veld('Nieuwe foto'));
    if (!link) klaar(false, geenFoto('Nieuwe foto'));
    const buf = await haalFoto(link);
    const oudAantal = item.beeld.length;
    item.beeld = [await fotoVerwerken(buf, item)];
    bewaar();
    klaar(true, `Foto vervangen bij het ${item.soort} van ${was}. Hij is staand bijgesneden (${staand(item.soort)}), met het onderwerp zoveel mogelijk in beeld.` +
      (oudAantal > 1 ? ` Het was een carrousel van ${oudAantal} platen; het is nu één foto.` : '') +
      `\n\nBekijk hem in de app. Valt de uitsnede tegen, stuur dan een foto die al staand is.`);
  }

  klaar(false, `Ik begrijp "${actie || '(leeg)'}" niet. Kies bij **Wat moet er gebeuren** voor Overslaan, Verzetten, Tekst wijzigen of Foto wijzigen.`);
}

// --- een nieuw item toevoegen -----------------------------------------------

async function nieuw() {
  const soort = veld('Wat wordt het').trim().toLowerCase().startsWith('verhaal') ? 'verhaal' : 'bericht';
  const datum = veld('Datum').trim();
  let tijd = veld('Tijd').trim() || (soort === 'bericht' ? '20:00' : '12:00');
  const tekst = veld('Tekst eronder').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || isNaN(Date.parse(datum))) {
    klaar(false, 'Ik heb een datum nodig bij **Datum**, geschreven als `2026-10-05`.');
  }
  const mt = tijd.match(/^(\d{1,2})[:.](\d{2})$/);
  if (!mt || +mt[1] > 23 || +mt[2] > 59) klaar(false, `Ik begrijp de tijd "${tijd}" niet. Schrijf hem als 20:00.`);
  tijd = `${mt[1].padStart(2, '0')}:${mt[2]}`;
  if (`${datum} ${tijd}` < nuInAmsterdam()) klaar(false, `${netjes(datum)} om ${tijd} is al voorbij. Kies een moment dat nog komt.`);
  if (soort === 'bericht' && tekst.length > 2200) klaar(false, `Die tekst is ${tekst.length} tekens; Instagram staat er 2200 toe. Maak hem korter.`);

  const link = fotoLink(veld('Foto'));
  if (!link) klaar(false, geenFoto('Foto'));

  const item = { id: vrijId(datum, soort), datum, tijd, soort, taal: 'nl', beeld: [] };
  if (soort === 'bericht') item.tekst = tekst;
  const buf = await haalFoto(link);
  item.beeld = [await fotoVerwerken(buf, item)];
  planning.items.push(item);
  sorteer(); bewaar();

  klaar(true, `In de planning gezet: een ${soort} op ${netjes(datum)} om ${tijd}, staand bijgesneden (${staand(soort)}).` +
    (soort === 'bericht' && !tekst ? '\n\nEr staat nog geen tekst onder. Wil je die erbij, kies dan in de app Tekst wijzigen.' : '') +
    `\n\nEr zijn nu ${planning.items.length} items gepland.`);
}

(async () => {
  if (veld('Wat wordt het')) await nieuw();
  else await wijzig();
})().catch(fout => {
  klaar(false, `Dat is niet gelukt: ${fout.message}.\n\nProbeer het nog eens, of vraag het in het gesprek met Claude.`);
});
