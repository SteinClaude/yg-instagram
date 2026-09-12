// Draait elke twee uur via GitHub Actions. Kijkt in planning.json wat er inmiddels
// aan de beurt is, plaatst dat, en schrijft het weg in gedaan.json zodat het nooit
// twee keer gebeurt. Handmatig proefdraaien: node src/plaatsen.cjs --proef
const fs = require('fs'), path = require('path');
const IG = require('./instagram.cjs');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const GEDAAN = path.join(WORTEL, 'gedaan.json');
const WAARSCHUWING = path.join(WORTEL, 'waarschuwing.txt');

const PROEF = process.argv.includes('--proef');
const TOKEN = process.env.IG_TOKEN;
const IG_ID = process.env.IG_USER_ID;
const RAW = (process.env.REPO_RAW || '').replace(/\/+$/, '');

// Hoeveel uur terug we nog inhalen. Staat een run een keer stil, dan wordt dat
// ingehaald; is het langer geleden, dan slaan we over in plaats van alles te dumpen.
const INHAALUREN = 6;

const rood = t => `[31m${t}[0m`, groen = t => `[32m${t}[0m`;

// --- tijd in Amsterdam, ongeacht waar de server staat -----------------------
function nuInAmsterdam() {
  const d = new Date();
  const delen = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d).reduce((a, p) => (a[p.type] = p.value, a), {});
  return { datum: `${delen.year}-${delen.month}-${delen.day}`, tijd: `${delen.hour}:${delen.minute}` };
}

// Verschil in minuten tussen twee "YYYY-MM-DD HH:MM" in dezelfde zone.
const naarMinuten = (datum, tijd) => {
  const [j, m, d] = datum.split('-').map(Number);
  const [u, mi] = tijd.split(':').map(Number);
  return Date.UTC(j, m - 1, d, u, mi) / 60000;
};

// --- lezen en schrijven ------------------------------------------------------
const lees = (bestand, standaard) => {
  try { return JSON.parse(fs.readFileSync(bestand, 'utf8')); } catch { return standaard; }
};

function main() {
  if (!TOKEN || !IG_ID) {
    console.error(rood('IG_TOKEN of IG_USER_ID ontbreekt.') +
      ' Zet ze bij Settings > Secrets and variables > Actions, of in je omgeving als je lokaal draait.');
    process.exit(1);
  }
  if (!RAW && !PROEF) {
    console.error(rood('REPO_RAW ontbreekt.') + ' Dat is het openbare adres waar Instagram de platen ophaalt.');
    process.exit(1);
  }

  const planning = lees(PLANNING, { items: [] });
  const gedaan = lees(GEDAAN, { items: [] });
  const alGedaan = new Set(gedaan.items.map(i => i.id));

  const nu = nuInAmsterdam();
  const nuMin = naarMinuten(nu.datum, nu.tijd);
  console.log(`Nu in Amsterdam: ${nu.datum} ${nu.tijd}`);

  const aanDeBeurt = [], teLaat = [];
  for (const item of planning.items) {
    if (alGedaan.has(item.id)) continue;
    const verschil = nuMin - naarMinuten(item.datum, item.tijd);
    if (verschil < 0) continue;                              // nog niet
    if (verschil > INHAALUREN * 60) { teLaat.push(item); continue; }
    aanDeBeurt.push(item);
  }

  if (teLaat.length) {
    console.log(`${teLaat.length} item(s) meer dan ${INHAALUREN} uur te laat; die slaan we over:`);
    for (const i of teLaat.slice(0, 8)) console.log(`  - ${i.datum} ${i.tijd}  ${i.id}`);
    // wel als gedaan wegschrijven, anders blijft hij elke run klagen
    for (const i of teLaat) gedaan.items.push({ id: i.id, wanneer: nu.datum + ' ' + nu.tijd, resultaat: 'overgeslagen' });
  }

  if (!aanDeBeurt.length) {
    console.log('Niets te plaatsen op dit moment.');
    if (teLaat.length) fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
    return controleerSleutel();
  }

  return plaatsAlles(aanDeBeurt, gedaan, nu);
}

async function plaatsAlles(items, gedaan, nu) {
  for (const item of items) {
    const urls = item.beeld.map(b => `${RAW}/beeld/${b}`);
    const wat = `${item.soort} ${item.taal.toUpperCase()} ${item.id}`;
    console.log(`\n→ ${wat}`);
    for (const u of urls) console.log(`   beeld: ${u.replace(RAW, '…')}`);

    if (PROEF) { console.log('   (proefdraai: niet echt geplaatst)'); continue; }

    try {
      let mediaId;
      if (item.soort === 'verhaal') {
        mediaId = await IG.plaatsVerhaal(IG_ID, TOKEN, urls[0]);
      } else if (urls.length > 1) {
        mediaId = await IG.plaatsCarrousel(IG_ID, TOKEN, urls, item.tekst || '');
      } else {
        mediaId = await IG.plaatsFoto(IG_ID, TOKEN, urls[0], item.tekst || '');
      }
      console.log(groen(`   geplaatst (${mediaId})`));
      gedaan.items.push({ id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'geplaatst', mediaId });
      fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
      await IG.wacht(4000);                                  // Meta niet overvragen
    } catch (fout) {
      console.error(rood(`   MISLUKT: ${fout.message}`));
      fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
      // niet als gedaan wegschrijven: de volgende run probeert het opnieuw
      throw fout;
    }
  }
  await controleerSleutel();
}

// Waarschuwt op tijd, want een verlopen sleutel stopt het plaatsen zonder alarm.
async function controleerSleutel() {
  try {
    const dagen = await IG.dagenGeldig(TOKEN);
    if (dagen === null) { console.log('\nSleutel verloopt niet.'); return; }
    console.log(`\nSleutel nog ${dagen} dagen geldig.`);
    if (dagen <= 12) {
      const tekst = `De Instagram-sleutel verloopt over ${dagen} dagen.\n\n` +
        `Vernieuwen: draai op je eigen computer\n\n    node gereedschap/vernieuw-token.cjs\n\n` +
        `en zet de nieuwe sleutel bij Settings > Secrets and variables > Actions > IG_TOKEN.\n` +
        `Doe je dit niet, dan stopt het plaatsen stil.`;
      fs.writeFileSync(WAARSCHUWING, tekst);
      console.log(rood('\n' + tekst));
    } else if (fs.existsSync(WAARSCHUWING)) {
      fs.unlinkSync(WAARSCHUWING);
    }
  } catch (fout) {
    console.error(rood(`Sleutelcontrole mislukt: ${fout.message}`));
  }
}

Promise.resolve(main()).catch(fout => {
  console.error(rood('\nGestopt: ' + fout.message));
  process.exit(1);
});
