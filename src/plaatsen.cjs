// Draait elk uur via GitHub Actions. Kijkt in planning.json wat er inmiddels
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

async function main() {
  // Nog niet ingesteld is geen fout: dan is stap 5 uit LEESMIJ.md gewoon nog niet
  // gedaan. We stoppen netjes, zodat je geen foutmelding per uur krijgt.
  if (!TOKEN || !IG_ID) {
    console.log('Nog niet ingesteld: IG_TOKEN en/of IG_USER_ID ontbreken.');
    console.log('Zet ze bij Settings > Secrets and variables > Actions (zie LEESMIJ.md, stap 5).');
    console.log('Zolang die ontbreken plaatst dit script niets, en dat is de bedoeling.');
    return;
  }
  if (!RAW && !PROEF) {
    console.error(rood('REPO_RAW ontbreekt.') + ' Dat is het openbare adres waar Instagram de platen ophaalt.');
    process.exit(1);
  }

  // Eerst vragen of de sleutel het doet. Zo niet, dan heeft plaatsen geen zin en
  // stoppen we netjes: de melding staat er al, en elk uur een rode run erbij
  // levert alleen een postvak vol op. Zodra de sleutel weer werkt, gaat het
  // vanzelf verder.
  if (!PROEF) {
    try {
      const naam = await IG.wieBenIk(IG_ID, TOKEN);
      console.log(`Sleutel werkt, account @${naam}.`);
    } catch (fout) {
      console.error(rood('De sleutel wordt geweigerd: ') + fout.message);
      console.log('Er wordt niets geplaatst zolang dit niet is opgelost.');
      fs.writeFileSync(WAARSCHUWING, [
        'De Instagram-sleutel werkt niet meer.',
        '',
        fout.message,
        '',
        'Haal een nieuwe op (LEESMIJ.md, stap 3) en zet hem bij',
        'Settings > Secrets and variables > Actions > IG_TOKEN.',
        '',
        'Zolang dit niet is opgelost plaatst de automaat niets, en blijft de',
        'planning gewoon staan. Er gaat dus niets verloren.',
        '',
      ].join('\n'));
      return;
    }
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

// Hoe lang we terugkijken op het account om te zien of een bericht er al staat.
const SLOTUREN = 18;

async function plaatsAlles(items, gedaan, nu) {
  // Extra slot naast het logboek. Is gedaan.json een keer niet bewaard - zoals op
  // 15 september 2026 gebeurde - dan zou hetzelfde bericht er nog eens uitgaan.
  // Daarom eerst vragen wat er werkelijk op het account staat. Verhalen zitten
  // hier niet in; die vervallen na een dag en zijn via de API niet op te vragen.
  let opHetAccount = [];
  if (!PROEF && items.some(i => i.soort === 'bericht')) {
    try { opHetAccount = await IG.recenteMedia(IG_ID, TOKEN, 25); }
    catch (fout) { console.log('Kon niet opvragen wat er al staat: ' + fout.message); }
  }
  const eersteRegel = s => String(s || '').split(String.fromCharCode(10))[0].trim();
  const kortgeleden = w => Date.now() - Date.parse(w) < SLOTUREN * 3600 * 1000;

  for (const item of items) {
    const urls = item.beeld.map(b => `${RAW}/beeld/${b}`);
    const wat = `${item.soort} ${item.taal.toUpperCase()} ${item.id}`;
    console.log(`\n→ ${wat}`);
    for (const u of urls) console.log(`   beeld: ${u.replace(RAW, '…')}`);

    if (PROEF) { console.log('   (proefdraai: niet echt geplaatst)'); continue; }

    if (item.soort === 'bericht') {
      const staatEral = opHetAccount.find(m => kortgeleden(m.timestamp) && eersteRegel(m.caption) === eersteRegel(item.tekst));
      if (staatEral) {
        console.log(`   staat al op het account sinds ${staatEral.timestamp}; niet nog een keer`);
        gedaan.items.push({ id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'stond er al', mediaId: staatEral.id });
        fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
        continue;
      }
    }

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
// Instagram-sleutels gaan 60 dagen mee en hebben geen "wanneer verloop ik"-vraag,
// dus we onthouden zelf wanneer we een nieuwe sleutel voor het eerst zagen. We
// bewaren alleen een vingerafdruk, nooit de sleutel zelf.
const SLEUTELBESTAND = path.join(WORTEL, 'sleutel.json');
const vingerafdruk = t => require('crypto').createHash('sha256').update(t).digest('hex').slice(0, 12);

async function controleerSleutel() {
  try {
    const naam = await IG.wieBenIk(IG_ID, TOKEN);
    console.log(`\nSleutel werkt, account @${naam}.`);
  } catch (fout) {
    console.error(rood(`\nSleutel werkt niet: ${fout.message}`));
    fs.writeFileSync(WAARSCHUWING,
      `De Instagram-sleutel werkt niet meer.\n\n${fout.message}\n\n` +
      `Haal een nieuwe op (LEESMIJ.md, stap 3) en zet hem bij\n` +
      `Settings > Secrets and variables > Actions > IG_TOKEN.`);
    return;
  }

  const nu = nuInAmsterdam().datum;
  const afdruk = vingerafdruk(TOKEN);
  let staat = lees(SLEUTELBESTAND, {});
  if (staat.afdruk !== afdruk) {
    staat = { afdruk, sinds: nu };                          // nieuwe sleutel gezien
    fs.writeFileSync(SLEUTELBESTAND, JSON.stringify(staat, null, 1));
    console.log('Nieuwe sleutel herkend; de teller loopt vanaf vandaag.');
  }

  const dagenOud = Math.round((Date.parse(nu) - Date.parse(staat.sinds)) / 86400000);
  const resterend = 60 - dagenOud;
  console.log(`Sleutel is ${dagenOud} dagen oud, nog ongeveer ${resterend} dagen te gaan.`);

  if (resterend <= 12) {
    const tekst = `De Instagram-sleutel verloopt over ongeveer ${resterend} dagen.\n\n` +
      `Vernieuwen: draai op je eigen computer\n\n    node gereedschap/vernieuw-token.cjs HUIDIGE_SLEUTEL\n\n` +
      `en zet de nieuwe sleutel bij Settings > Secrets and variables > Actions > IG_TOKEN.\n` +
      `Doe je dit niet, dan stopt het plaatsen stil.`;
    fs.writeFileSync(WAARSCHUWING, tekst);
    console.log(rood('\n' + tekst));
  } else if (fs.existsSync(WAARSCHUWING)) {
    fs.unlinkSync(WAARSCHUWING);
  }
}

Promise.resolve(main()).catch(fout => {
  console.error(rood('\nGestopt: ' + fout.message));
  process.exit(1);
});
