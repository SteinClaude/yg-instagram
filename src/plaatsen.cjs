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
// Twee accounts (sinds 9 nov 2026). Een item zonder "account" is van @ygdigital.nl, zoals altijd.
// "kanaal-1" is het Instagram-account van YouTube-kanaal 1 (YG-Social). Van dat account komt
// de naam NOOIT in de logboeken of in status.json: de repo en de Actions-logboeken zijn openbaar.
const ACCOUNTS = {
  ygdigital: { token: process.env.IG_TOKEN, id: process.env.IG_USER_ID, geheim: 'IG_TOKEN', geheimId: 'IG_USER_ID', label: null },
  'kanaal-1': { token: process.env.IG_TOKEN_K1, id: process.env.IG_USER_ID_K1, geheim: 'IG_TOKEN_K1', geheimId: 'IG_USER_ID_K1', label: 'kanaal 1' },
};
const accountVan = item => item.account || 'ygdigital';
// Foutmeldingen van Instagram noemen soms het accountnummer ("Instagram weigert /<nummer>: …"). Dat van
// kanaal 1 mag niet in status.json of in de melding op GitHub komen (openbaar); daarom eruit halen.
const schoon = t => Object.entries(ACCOUNTS).reduce((s, [a, v]) => v.label && v.id ? s.split(v.id).join(`<${a}>`) : s, String(t));
const ingesteld = a => !!(ACCOUNTS[a] && ACCOUNTS[a].token && ACCOUNTS[a].id);
// Hoe een account in logboek en status heet: @naam voor @ygdigital.nl, anders alleen het label.
const noem = (a, naam) => ACCOUNTS[a].label || `@${naam}`;
const RAW = (process.env.REPO_RAW || '').replace(/\/+$/, '');

// Video's halen we via GitHub Pages: raw.githubusercontent.com geeft een mp4 als
// application/octet-stream terug, en of Instagram dat slikt is niet zeker. Pages
// zegt netjes video/mp4. Het adres volgt uit het raw-adres, tenzij het apart is
// ingesteld (REPO_PAGES).
function paginaAdres(raw) {
  const m = raw.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\//);
  return m ? `https://${m[1].toLowerCase()}.github.io/${m[2]}` : raw;
}
const PAGES = (process.env.REPO_PAGES || paginaAdres(RAW)).replace(/\/+$/, '');
const isVideo = b => /\.mp4$/i.test(b);
// Paden onder beeld/, of (kanaal 1) rechtstreeks uit een pakket: "pakketten/<map>/instagram/reel.mp4".
const beeldUrl = b => `${isVideo(b) ? PAGES : RAW}/${b.startsWith('pakketten/') ? '' : 'beeld/'}${b}`;

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

// De toestand van de automaat, zodat de planningspagina hem kan laten zien en je
// niet in de logboeken van GitHub hoeft te duiken om te weten of het goed gaat.
// Alleen wegschrijven als er iets verandert: anders krijg je elk uur een commit.
const STATUS = path.join(WORTEL, 'status.json');
function meldStand(stand, bericht) {
  const oud = lees(STATUS, {});
  if (oud.stand === stand && oud.bericht === bericht) return;
  const nu = nuInAmsterdam();
  fs.writeFileSync(STATUS, JSON.stringify(
    { stand, bericht, sinds: `${nu.datum} ${nu.tijd}` }, null, 1));
  console.log(`Toestand: ${stand} — ${bericht}`);
}

async function main() {
  // Nog niet ingesteld is geen fout: dan is stap 5 uit LEESMIJ.md gewoon nog niet
  // gedaan. We stoppen netjes, zodat je geen foutmelding per uur krijgt.
  const actief = Object.keys(ACCOUNTS).filter(ingesteld);
  for (const a of Object.keys(ACCOUNTS)) if (!ingesteld(a))
    console.log(`${a}: nog niet ingesteld (${ACCOUNTS[a].geheim} en/of ${ACCOUNTS[a].geheimId} ontbreken); items voor dit account wachten.`);
  if (!actief.length) {
    console.log('Nog niet ingesteld: er is voor geen enkel account een sleutel met accountnummer.');
    console.log('Zet ze bij Settings > Secrets and variables > Actions (zie LEESMIJ.md, stap 5).');
    console.log('Zolang die ontbreken plaatst dit script niets, en dat is de bedoeling.');
    meldStand('niet ingesteld', 'De sleutel of het accountnummer ontbreekt bij de instellingen van de repo.');
    return;
  }
  if (!RAW && !PROEF) {
    console.error(rood('REPO_RAW ontbreekt.') + ' Dat is het openbare adres waar Instagram de platen ophaalt.');
    process.exit(1);
  }

  // Proefdraai van een video: node src/plaatsen.cjs --proefvideo <url>
  //   [--proefomslag <url van een jpg>] [--proefms <milliseconden>] [--account kanaal-1]
  // Zet een reel-container klaar zonder te publiceren en meldt of Instagram
  // de video (en de eigen omslag) accepteert. Handig vóór een nieuwe soort reel.
  const pv = process.argv.indexOf('--proefvideo');
  if (pv > -1) {
    const arg = naam => { const i = process.argv.indexOf(naam); return i > -1 ? process.argv[i + 1] : ''; };
    const url = process.argv[pv + 1];
    const acc = arg('--account') || 'ygdigital';
    if (!url) { console.error(rood('Geef het adres van de video mee.')); process.exit(1); }
    if (!ACCOUNTS[acc]) { console.error(rood(`Onbekend account "${acc}"; kies uit ${Object.keys(ACCOUNTS).join(', ')}.`)); process.exit(1); }
    if (!ingesteld(acc)) { console.error(rood(`${acc} is nog niet ingesteld (${ACCOUNTS[acc].geheim} en ${ACCOUNTS[acc].geheimId}).`)); process.exit(1); }
    if (arg('--proefms') && !/^\d+$/.test(arg('--proefms'))) { console.error(rood(`Omslagmoment "${arg('--proefms')}" is geen geheel aantal milliseconden.`)); process.exit(1); }
    const omslag = { url: arg('--proefomslag') || undefined, ms: arg('--proefms') ? Number(arg('--proefms')) : undefined };
    console.log(`Proef op ${acc}: Instagram haalt ${url} op…`);
    if (omslag.url) console.log(`   met eigen omslag ${omslag.url}`);
    if (Number.isFinite(omslag.ms)) console.log(`   omslagmoment ${omslag.ms} ms`);
    try {
      const r = await IG.proefVideo(ACCOUNTS[acc].id, ACCOUNTS[acc].token, url, omslag);
      console.log(groen(`Geaccepteerd en omgezet (container ${r.id}, omslag: ${r.omslag}). Niet gepubliceerd.`));
      if (omslag.url && r.omslag !== 'eigen beeld') {
        console.error(rood('Let op: de eigen omslag is NIET aangenomen; bij plaatsen valt hij terug op het videobeeld.'));
        process.exit(1);
      }
    } catch (fout) {
      console.error(rood(`Geweigerd: ${schoon(fout.message)}`));
      process.exit(1);
    }
    return;
  }

  // Eerst per account vragen of de sleutel het doet. Werkt hij niet, dan slaan we
  // dat account over (de melding staat er dan al) en gaat het andere gewoon door.
  // Zodra de sleutel weer werkt, gaat het vanzelf verder.
  const werkt = new Set(), waarschuwingen = [], verbonden = [], geweigerd = [];
  for (const a of actief) {
    if (PROEF) { werkt.add(a); continue; }
    try {
      const naam = await IG.wieBenIk(ACCOUNTS[a].id, ACCOUNTS[a].token);
      console.log(`Sleutel werkt, account ${noem(a, naam)}.`);
      werkt.add(a); verbonden.push(noem(a, naam));
    } catch (fout) {
      console.error(rood(`De sleutel van ${a} wordt geweigerd: `) + schoon(fout.message));
      console.log(`Voor ${a} wordt niets geplaatst zolang dit niet is opgelost.`);
      waarschuwingen.push(weigerTekst(a, schoon(fout.message)));
      geweigerd.push(`${accountNaam(a)}: ${schoon(fout.message)}`);
    }
  }
  if (!PROEF) {
    if (geweigerd.length) meldStand('staat stil', `Instagram weigert de sleutel van ${geweigerd.join('; ')}`);
    else meldStand('in orde', `Verbonden met ${verbonden.join(' en ')}.`);
  }
  if (waarschuwingen.length) schrijfWaarschuwing(waarschuwingen);
  if (!werkt.size) return;

  const planning = lees(PLANNING, { items: [] });
  const gedaan = lees(GEDAAN, { items: [] });
  const alGedaan = new Set(gedaan.items.map(i => i.id));

  const nu = nuInAmsterdam();
  const nuMin = naarMinuten(nu.datum, nu.tijd);
  console.log(`Nu in Amsterdam: ${nu.datum} ${nu.tijd}`);

  const aanDeBeurt = [], teLaat = [];
  for (const item of planning.items) {
    if (alGedaan.has(item.id)) continue;
    if (!werkt.has(accountVan(item))) continue;              // account niet ingesteld of sleutel geweigerd: laten staan
    const verschil = nuMin - naarMinuten(item.datum, item.tijd);
    if (verschil < 0) continue;                              // nog niet
    if (verschil > (item.inhaaluren || INHAALUREN) * 60) { teLaat.push(item); continue; }   // per item ruimer mogelijk
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
    return controleerSleutels(werkt, waarschuwingen);
  }

  await plaatsAlles(aanDeBeurt, gedaan, nu);
  await controleerSleutels(werkt, waarschuwingen);
}

// Hoe lang we terugkijken op het account om te zien of een bericht er al staat.
const SLOTUREN = 18;

async function plaatsAlles(items, gedaan, nu) {
  // Extra slot naast het logboek. Is gedaan.json een keer niet bewaard - zoals op
  // 15 september 2026 gebeurde - dan zou hetzelfde bericht er nog eens uitgaan.
  // Daarom eerst vragen wat er werkelijk op het account staat (per account).
  // Verhalen zitten hier niet in; die vervallen na een dag en zijn via de API niet op te vragen.
  const opHetAccount = {};
  if (!PROEF) {
    for (const a of new Set(items.filter(i => i.soort === 'bericht').map(accountVan))) {
      try { opHetAccount[a] = await IG.recenteMedia(ACCOUNTS[a].id, ACCOUNTS[a].token, 25); }
      catch (fout) { opHetAccount[a] = []; console.log(`Kon niet opvragen wat er al staat op ${a}: ` + schoon(fout.message)); }
    }
  }
  const eersteRegel = s => String(s || '').split(String.fromCharCode(10))[0].trim();
  const kortgeleden = w => Date.now() - Date.parse(w) < SLOTUREN * 3600 * 1000;

  for (const item of items) {
    const acc = accountVan(item), { id: IG_ID, token: TOKEN } = ACCOUNTS[acc];
    const urls = item.beeld.map(beeldUrl);
    const wat = `${item.soort} ${item.taal.toUpperCase()} ${item.id}`;
    console.log(`\n→ ${wat}${acc === 'ygdigital' ? '' : ` (${acc})`}`);
    for (const u of urls) console.log(`   beeld: ${u.replace(RAW, '…').replace(PAGES, '…')}`);

    // Een video mag sinds 14 okt 2026 ook in een carrousel (plaatsCarrousel in
    // instagram.cjs regelt het als media_type VIDEO). De eerste plaat moet wel een
    // foto zijn: die bepaalt de verhouding van de hele carrousel en de rastertegel.
    if (urls.length > 1 && isVideo(item.beeld[0])) {
      console.error(rood('   MISLUKT: de eerste plaat van een carrousel moet een foto zijn; zet de video op plaat 2 of later.'));
      gedaan.items.push({ id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'overgeslagen' });
      fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
      meldStand('staat stil', `${wat}: de eerste plaat van een carrousel moet een foto zijn. Het item is overgeslagen.`);
      continue;
    }
    if (urls.length > 1 && item.beeld.some(isVideo)) console.log('   carrousel met video (plaat ' + (item.beeld.findIndex(isVideo) + 1) + ')');

    if (PROEF) { console.log('   (proefdraai: niet echt geplaatst)'); continue; }

    if (item.soort === 'bericht') {
      const staatEral = (opHetAccount[acc] || []).find(m => kortgeleden(m.timestamp) && eersteRegel(m.caption) === eersteRegel(item.tekst));
      if (staatEral) {
        console.log(`   staat al op het account sinds ${staatEral.timestamp}; niet nog een keer`);
        gedaan.items.push({ id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'stond er al', mediaId: staatEral.id });
        fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
        continue;
      }
    }

    try {
      let mediaId, extra = {};
      if (item.soort === 'verhaal') {
        mediaId = await IG.plaatsVerhaal(IG_ID, TOKEN, urls[0]);
      } else if (/\.mp4$/i.test(urls[0])) {
        // eigen omslag per reel (velden omslag en omslagMs uit gereedschap/plan-reel.cjs); zonder die velden blijft het 4 s
        const omslag = { url: item.omslag ? beeldUrl(item.omslag) : undefined, ms: Number.isFinite(item.omslagMs) ? item.omslagMs : undefined };
        if (omslag.url) console.log(`   omslag: ${omslag.url.replace(RAW, '…')}${Number.isFinite(omslag.ms) ? `, terugval ${omslag.ms} ms` : ''}`);
        const r = await IG.plaatsReel(IG_ID, TOKEN, urls[0], item.tekst || '', omslag);
        mediaId = r.id; extra = { omslag: r.omslag };            // welke omslag Instagram aannam, voor de nacontrole
      } else if (urls.length > 1) {
        mediaId = await IG.plaatsCarrousel(IG_ID, TOKEN, urls, item.tekst || '', item.alt || []);
      } else {
        mediaId = await IG.plaatsFoto(IG_ID, TOKEN, urls[0], item.tekst || '');
      }
      console.log(groen(`   geplaatst (${mediaId})`));
      gedaan.items.push({ id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'geplaatst', mediaId, ...extra });
      fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
      await IG.wacht(4000);                                  // Meta niet overvragen
    } catch (fout) {
      console.error(rood(`   MISLUKT: ${schoon(fout.message)}`));
      fs.writeFileSync(GEDAAN, JSON.stringify(gedaan, null, 1));
      // Niet als gedaan wegschrijven: de volgende run probeert het opnieuw. Wel
      // melden op het dashboard, anders zie je alleen een rode run in je mail.
      meldStand('staat stil', `${wat} is niet gelukt: ${schoon(fout.message)}. Elk uur wordt het opnieuw geprobeerd, tot ${item.inhaaluren || INHAALUREN} uur na de geplande tijd.`);
      throw fout;
    }
  }
}

// Waarschuwt op tijd, want een verlopen sleutel stopt het plaatsen zonder alarm.
// Instagram-sleutels gaan 60 dagen mee en hebben geen "wanneer verloop ik"-vraag,
// dus we onthouden zelf wanneer we een nieuwe sleutel voor het eerst zagen. We
// bewaren alleen een vingerafdruk, nooit de sleutel zelf. @ygdigital.nl staat
// bovenaan in sleutel.json (zoals altijd; het dashboard leest dat); een ander
// account onder zijn eigen naam, bv. "kanaal-1": { afdruk, sinds }.
const SLEUTELBESTAND = path.join(WORTEL, 'sleutel.json');
const vingerafdruk = t => require('crypto').createHash('sha256').update(t).digest('hex').slice(0, 12);
const accountNaam = a => ACCOUNTS[a].label || '@ygdigital.nl';
const extraUitleg = a => a === 'ygdigital' ? '' : '; voor dit account: LEESMIJ.md, "Tweede account: Instagram van kanaal 1"';

function weigerTekst(a, melding) {
  return [
    `De Instagram-sleutel van ${accountNaam(a)} werkt niet meer.`,
    '',
    melding,
    '',
    `Haal een nieuwe op (LEESMIJ.md, stap 3${extraUitleg(a)}) en zet hem bij`,
    `Settings > Secrets and variables > Actions > ${ACCOUNTS[a].geheim}.`,
    '',
    'Zolang dit niet is opgelost plaatst de automaat voor dit account niets, en blijft de',
    'planning gewoon staan. Er gaat dus niets verloren.',
  ].join('\n');
}

function schrijfWaarschuwing(lijst) {
  if (lijst.length) fs.writeFileSync(WAARSCHUWING, lijst.join('\n\n----\n\n') + '\n');
  else if (fs.existsSync(WAARSCHUWING)) fs.unlinkSync(WAARSCHUWING);
}

async function controleerSleutels(werkt, waarschuwingen) {
  const nu = nuInAmsterdam().datum;
  const alles = lees(SLEUTELBESTAND, {});
  let veranderd = false;

  for (const a of werkt) {
    const { id, token } = ACCOUNTS[a];
    try {
      const naam = await IG.wieBenIk(id, token);
      console.log(`\nSleutel werkt, account ${noem(a, naam)}.`);
    } catch (fout) {
      console.error(rood(`\nSleutel van ${a} werkt niet: ${schoon(fout.message)}`));
      waarschuwingen.push(weigerTekst(a, schoon(fout.message)));
      continue;
    }

    const afdruk = vingerafdruk(token);
    let staat = a === 'ygdigital' ? { afdruk: alles.afdruk, sinds: alles.sinds } : (alles[a] || {});
    if (staat.afdruk !== afdruk) {
      staat = { afdruk, sinds: nu };                        // nieuwe sleutel gezien
      if (a === 'ygdigital') Object.assign(alles, staat); else alles[a] = staat;
      veranderd = true;
      console.log(`Nieuwe sleutel herkend (${a}); de teller loopt vanaf vandaag.`);
    }

    const dagenOud = Math.round((Date.parse(nu) - Date.parse(staat.sinds)) / 86400000);
    const resterend = 60 - dagenOud;
    console.log(`Sleutel ${a} is ${dagenOud} dagen oud, nog ongeveer ${resterend} dagen te gaan.`);

    if (resterend <= 12) {
      const tekst = `De Instagram-sleutel van ${accountNaam(a)} verloopt over ongeveer ${resterend} dagen.\n\n` +
        `Vernieuwen: draai op je eigen computer\n\n    node gereedschap/vernieuw-token.cjs HUIDIGE_SLEUTEL\n\n` +
        `en zet de nieuwe sleutel bij Settings > Secrets and variables > Actions > ${ACCOUNTS[a].geheim}.\n` +
        `Doe je dit niet, dan stopt het plaatsen stil.`;
      waarschuwingen.push(tekst);
      console.log(rood('\n' + tekst));
    }
  }

  if (veranderd) fs.writeFileSync(SLEUTELBESTAND, JSON.stringify(alles, null, 1));
  schrijfWaarschuwing(waarschuwingen);
}

Promise.resolve(main()).catch(fout => {
  console.error(rood('\nGestopt: ' + schoon(fout.message)));
  process.exit(1);
});
