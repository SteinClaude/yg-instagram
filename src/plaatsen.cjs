// Draait via GitHub Actions (.github/workflows/plaatsen.yml). Kijkt in planning.json wat er inmiddels
// aan de beurt is, plaatst dat, en schrijft het weg in gedaan.json zodat het nooit twee keer gebeurt.
// Handmatig proefdraaien: node src/plaatsen.cjs --proef   (geen netwerk, er wordt niets geschreven)
'use strict';
const fs = require('fs'), path = require('path');
const IG = require('./instagram.cjs');
const T = require('./accounts.cjs');

const WORTEL = path.join(__dirname, '..');
const PLANNING = path.join(WORTEL, 'planning.json');
const GEDAAN = path.join(WORTEL, 'gedaan.json');
const STATUS = path.join(WORTEL, 'status.json');
const SLEUTELBESTAND = path.join(WORTEL, 'sleutel.json');
const MELDINGEN = path.join(WORTEL, 'waarschuwingen');

const PROEF = process.argv.includes('--proef');

// De accounts komen uit src/accounts.cjs (één regel per account). Een item zonder "account" is van het
// eerste account, @ygdigital.nl, zoals altijd. Van de andere accounts komt de naam NOOIT in de logboeken,
// in status.json of in een melding: de repo en de logboeken van Actions zijn openbaar.
const GEHEIM = T.leesGeheimen(process.env);
const ACCOUNTS = Object.fromEntries(T.ACCOUNTS.map(a => [a.naam, { ...a, ...GEHEIM[a.naam] }]));
const ALLE = Object.keys(ACCOUNTS);
const accountVan = T.accountVan;
const ingesteld = a => !!(ACCOUNTS[a] && ACCOUNTS[a].token && ACCOUNTS[a].id);
// Hoe een account in logboek en status heet: @naam voor @ygdigital.nl, anders alleen het label.
const noem = (a, naam) => ACCOUNTS[a].openbaar ? `@${naam}` : ACCOUNTS[a].label;
const accountNaam = a => ACCOUNTS[a].label;
const opsom = l => l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} en ${l[l.length - 1]}`;

// Foutmeldingen van Instagram noemen soms het accountnummer ("Instagram weigert /<nummer>: …") en een enkele
// keer een gebruikersnaam. Van de niet-openbare accounts halen we die eruit, en een sleutel altijd: wat hier
// doorheen gaat, komt in het logboek, in status.json of in een melding op GitHub.
//   * het nummer en de sleutel kennen we (de geheimen);
//   * de gebruikersnaam kennen we zodra Instagram hem in deze run gaf (wieBenIk); we bewaren hem nergens;
//   * hoort de melding bij een niet-openbaar account (acc), dan gaat ook elke @naam eruit. Een kale naam
//     zonder @ in een melding van een account waarvan de sleutel niet werkt, kunnen we niet herkennen.
const GEBRUIKER = {};                                    // account -> gebruikersnaam, zodra Instagram hem gaf
const regexVeilig = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function schoon(t, acc) {
  let s = String(t);
  for (const a of ALLE) {
    const v = ACCOUNTS[a];
    if (v.token) s = s.split(v.token).join('<sleutel>');
    if (v.openbaar) continue;
    if (v.id) s = s.split(v.id).join(`<${a}>`);
    if (GEBRUIKER[a]) s = s.replace(new RegExp(regexVeilig(GEBRUIKER[a]), 'gi'), `<${a}>`);
  }
  if (acc && ACCOUNTS[acc] && !ACCOUNTS[acc].openbaar) s = s.replace(/@[A-Za-z0-9._]{2,}/g, `@<${acc}>`);
  return s;
}

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
// Paden onder beeld/ (ook beeld/<account>/ van gereedschap/inplannen.cjs), of (kanaal 1) rechtstreeks uit een
// pakket: "pakketten/<map>/instagram/reel.mp4".
const beeldUrl = b => `${isVideo(b) ? PAGES : RAW}/${b.startsWith('pakketten/') ? '' : 'beeld/'}${b}`;
// In het logboek het vaste begin van een adres weglaten: korter, en de naam van de repo hoeft er niet steeds in.
const kortAdres = u => { for (const basis of [RAW, PAGES]) if (basis && u.startsWith(basis)) return '…' + u.slice(basis.length); return u; };

// Hoeveel uur terug we nog inhalen. Staat een run een keer stil, dan wordt dat
// ingehaald; is het langer geleden, dan slaan we over in plaats van alles te dumpen.
const INHAALUREN = 6;
// Na een mislukte poging wacht de automaat voordat hij hetzelfde item opnieuw probeert: 10, 20, 40 en daarna
// steeds 55 minuten. Zonder die rem zou één kapotte video bij elke start (elke tien minuten) een rode run en
// een mail geven. De stand staat per item in status.json (accounts.<naam>.mislukt).
const wachtMinuten = pogingen => Math.min(55, 10 * 2 ** (Math.max(1, pogingen) - 1));

const rood = t => `\x1b[31m${t}\x1b[0m`, groen = t => `\x1b[32m${t}\x1b[0m`;

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
  const [j, m, d] = String(datum).split('-').map(Number);
  const [u, mi] = String(tijd).split(':').map(Number);
  return Date.UTC(j, m - 1, d, u, mi) / 60000;
};

// --- lezen en schrijven ------------------------------------------------------
// { bestaat, ok, data, fout }. Een bestand dat er wel is maar niet te lezen valt, is iets anders dan een
// bestand dat ontbreekt: bij een onleesbaar gedaan.json plaatsen we niets (anders ging alles er opnieuw uit).
function leesJson(bestand) {
  if (!fs.existsSync(bestand)) return { bestaat: false, ok: true, data: null };
  try { return { bestaat: true, ok: true, data: JSON.parse(fs.readFileSync(bestand, 'utf8')) }; }
  catch (e) { return { bestaat: true, ok: false, fout: e.message }; }
}
// Schrijven in twee stappen: eerst naast het bestand, dan in één keer op zijn plek. Wordt de run midden in het
// schrijven afgebroken (de tijdsgrens in de workflow, of een annulering), dan staat er het oude bestand of het
// nieuwe, nooit een half. Een half gedaan.json zou het plaatsen stilleggen tot iemand het herstelt.
function schrijf(bestand, tekst) {
  const naast = `${bestand}.tmp`;
  fs.writeFileSync(naast, tekst);
  fs.renameSync(naast, bestand);
}

// Klopt een item uit planning.json genoeg om het te mogen plaatsen? Geeft de reden terug, of null.
// Zonder deze controle telde een tijd als "18.00" als "nu aan de beurt" en ging het item er meteen uit.
function gebrek(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return 'het is geen item';
  if (typeof item.id !== 'string' || !item.id) return 'het id ontbreekt';
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(item.datum || '');
  const dag = d && new Date(Date.UTC(+d[1], +d[2] - 1, +d[3]));
  if (!d || dag.getUTCFullYear() !== +d[1] || dag.getUTCMonth() !== +d[2] - 1 || dag.getUTCDate() !== +d[3]) return `de datum "${item.datum}" klopt niet (jjjj-mm-dd)`;
  const t = /^(\d{2}):(\d{2})$/.exec(item.tijd || '');
  if (!t || +t[1] > 23 || +t[2] > 59) return `de tijd "${item.tijd}" klopt niet (uu:mm)`;
  if (item.soort !== 'bericht' && item.soort !== 'verhaal') return `de soort "${item.soort}" is geen bericht of verhaal`;
  if (!Array.isArray(item.beeld) || !item.beeld.length || item.beeld.some(b => typeof b !== 'string' || !b)) return 'het beeld ontbreekt';
  if (item.inhaaluren !== undefined && !(Number.isFinite(item.inhaaluren) && item.inhaaluren >= 0)) return 'inhaaluren is geen getal';
  return null;
}

// --- de toestand van de automaat --------------------------------------------
// status.json, zodat de planningspagina en het paneel hem kunnen laten zien en je niet in de logboeken van
// GitHub hoeft te duiken. Bovenaan staan de drie velden die er altijd stonden (stand, bericht, sinds); die
// zeggen nu alleen "staat stil" als een account waar werk voor klaarstaat niet kan plaatsen. Daaronder
// "accounts": per account de eigen stand. Een account waar niets voor gepland staat (zoals een account op
// pauze met een geweigerde sleutel) legt de rest dus niet meer stil.
//   accounts.<naam>: { naam: <label>, stand, bericht, sinds [, mislukt: { <id>: { pogingen, laatste, fout } }] }
//   stand per account: in orde | niet ingesteld | sleutel geweigerd | geen verbinding | item mislukt
// Alleen wegschrijven als er iets verandert: anders krijg je bij elke start een commit.
const OUD = (() => { const r = leesJson(STATUS); return r.ok && r.data && typeof r.data === 'object' && !Array.isArray(r.data) ? r.data : {}; })();
const oudAccount = a => (OUD.accounts && typeof OUD.accounts === 'object' && OUD.accounts[a]) || {};
const stand = {};                                        // account -> { stand, bericht }
const NOEM = {};                                         // account -> hoe het in "Verbonden met …" heet (@naam of het label)
const mislukt = {};                                      // account -> { <id>: { pogingen, laatste, fout } }
for (const a of ALLE) {
  mislukt[a] = {};
  const oud = oudAccount(a).mislukt;
  if (oud && typeof oud === 'object') for (const [id, v] of Object.entries(oud)) {
    if (v && Number.isFinite(v.pogingen) && typeof v.laatste === 'string') mislukt[a][id] = { pogingen: v.pogingen, laatste: v.laatste, fout: String(v.fout || '') };
  }
}
const zet = (a, s, bericht) => { stand[a] = { stand: s, bericht }; };
let geschreven = fs.existsSync(STATUS) ? fs.readFileSync(STATUS, 'utf8') : '';

// open: account -> aantal items in de planning dat nog niet gedaan is. algemeen: { stand, bericht } als er
// iets is dat de hele automaat raakt (planning onleesbaar, niets ingesteld); dan telt dat voor de bovenste regel.
// extra: een melding die erbij moet (een item met een onbekend account); die zet de bovenste regel op "staat stil".
function bewaarStatus(open = {}, algemeen = null, extra = '') {
  const nu = nuInAmsterdam(), moment = `${nu.datum} ${nu.tijd}`;
  const accounts = {};
  for (const a of ALLE) {
    const s = stand[a] || { stand: 'onbekend', bericht: '' }, oud = oudAccount(a);
    const rij = { naam: accountNaam(a), stand: s.stand, bericht: s.bericht };
    rij.sinds = oud.stand === rij.stand && oud.bericht === rij.bericht && oud.sinds ? oud.sinds : moment;
    if (Object.keys(mislukt[a]).length) rij.mislukt = mislukt[a];
    accounts[a] = rij;
  }
  let top = algemeen;
  if (!top) {
    const goed = ALLE.filter(a => stand[a] && stand[a].stand === 'in orde');
    // "lastig" = er staat werk klaar dat niet uit kan, of er is in deze run een item mislukt
    const lastig = ALLE.filter(a => stand[a] && stand[a].stand !== 'in orde' && ((open[a] || 0) > 0 || stand[a].stand === 'item mislukt'));
    const rust = ALLE.filter(a => stand[a] && stand[a].stand !== 'in orde' && !lastig.includes(a));
    if (lastig.length) {
      top = { stand: 'staat stil', bericht: lastig.map(a => `${accountNaam(a)}: ${stand[a].bericht}`).join(' · ') +
        (goed.length ? ` · Zonder storing: ${opsom(goed.map(accountNaam))}.` : '') };
    } else if (goed.length) {
      top = { stand: 'in orde', bericht: `Verbonden met ${opsom(goed.map(a => NOEM[a] || accountNaam(a)))}.` +
        (rust.length ? ` Doet nu niet mee, er staat niets voor in de planning: ${opsom(rust.map(a => `${accountNaam(a)} (${stand[a].stand})`))}.` : '') };
    } else {
      top = { stand: 'staat stil', bericht: `Geen enkel account kan plaatsen: ${opsom(rust.map(a => `${accountNaam(a)} (${stand[a].stand})`))}.` };
    }
    if (extra) top = { stand: 'staat stil', bericht: top.stand === 'in orde' ? `${extra} De rest gaat gewoon door.` : `${extra} · ${top.bericht}` };
  }
  const sinds = OUD.stand === top.stand && OUD.bericht === top.bericht && OUD.sinds ? OUD.sinds : moment;
  const tekst = JSON.stringify({ stand: top.stand, bericht: top.bericht, sinds, accounts }, null, 1);
  if (PROEF || tekst === geschreven) return;
  schrijf(STATUS, tekst);
  geschreven = tekst;
  console.log(`Toestand: ${top.stand} — ${top.bericht}`);
}

// --- meldingen op GitHub ------------------------------------------------------
// Per account één bestand in waarschuwingen/ (staat in .gitignore): regel 1 is de titel van de melding, na een
// lege regel volgt de tekst. De workflow maakt er per titel één melding van, als die nog niet open staat. Zo
// blijft een waarschuwing voor kanaal 2 niet hangen achter een melding van een ander account die nog open staat.
const meldingen = {};                                    // account -> [tekst, ...]
const meld = (a, tekst) => { (meldingen[a] = meldingen[a] || []).push(tekst); };
const meldTitel = a => a === T.EERSTE ? 'Sleutel vernieuwen' : `Sleutel vernieuwen: ${accountNaam(a)}`;
function schrijfMeldingen() {
  if (PROEF) return;
  fs.rmSync(MELDINGEN, { recursive: true, force: true });
  const met = Object.keys(meldingen).filter(a => meldingen[a].length);
  if (!met.length) return;
  fs.mkdirSync(MELDINGEN, { recursive: true });
  for (const a of met) fs.writeFileSync(path.join(MELDINGEN, `${a}.txt`), `${meldTitel(a)}\n\n${meldingen[a].join('\n\n----\n\n')}\n`);
}

// Een fout bij het navragen van de sleutel is niet altijd een sleutel die niet meer werkt. Geen antwoord, een
// storing bij Meta of "te veel verzoeken" gaan vanzelf over: dan wachten de items, maar komt er geen melding
// "Sleutel vernieuwen" (die zou Andries voor niets een nieuwe sleutel laten maken).
function soortFout(melding) {
  if (/fetch failed|geen leesbaar antwoord|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|socket hang up/i.test(melding)) return 'tijdelijk';
  const m = /\(code (\d+)/.exec(melding);
  return m && [1, 2, 4, 17, 32, 613].includes(Number(m[1])) ? 'tijdelijk' : 'sleutel';
}

const extraUitleg = a => a === T.EERSTE ? '' : '; voor dit account: LEESMIJ.md, "Meer accounts"';
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

async function main() {
  // Nog niet ingesteld is geen fout: dan is stap 5 uit LEESMIJ.md gewoon nog niet
  // gedaan. We stoppen netjes, zodat je geen foutmelding per run krijgt.
  const actief = ALLE.filter(ingesteld);
  for (const a of ALLE) if (!ingesteld(a))
    console.log(`${a}: nog niet ingesteld (${ACCOUNTS[a].geheim} en/of ${ACCOUNTS[a].geheimId} ontbreken); items voor dit account wachten.`);

  // Proefdraai van een video: node src/plaatsen.cjs --proefvideo <url>
  //   [--proefomslag <url van een jpg>] [--proefms <milliseconden>] [--account <naam uit src/accounts.cjs>]
  // Zet een reel-container klaar zonder te publiceren en meldt of Instagram
  // de video (en de eigen omslag) accepteert. Handig vóór een nieuwe soort reel.
  const pv = process.argv.indexOf('--proefvideo');
  if (pv > -1) {
    const arg = naam => { const i = process.argv.indexOf(naam); return i > -1 ? process.argv[i + 1] : ''; };
    const url = process.argv[pv + 1];
    const acc = arg('--account') || T.EERSTE;
    if (!url || url.startsWith('--')) { console.error(rood('Geef het adres van de video mee.')); process.exit(1); }
    if (!ACCOUNTS[acc]) { console.error(rood(`Onbekend account "${acc}"; kies uit ${ALLE.join(', ')}.`)); process.exit(1); }
    if (!ingesteld(acc)) { console.error(rood(`${acc} is nog niet ingesteld (${ACCOUNTS[acc].geheim} en ${ACCOUNTS[acc].geheimId}).`)); process.exit(1); }
    if (arg('--proefms') && !/^\d+$/.test(arg('--proefms'))) { console.error(rood(`Omslagmoment "${arg('--proefms')}" is geen geheel aantal milliseconden.`)); process.exit(1); }
    const omslag = { url: arg('--proefomslag') || undefined, ms: arg('--proefms') ? Number(arg('--proefms')) : undefined };
    console.log(`Proef op ${acc}: Instagram haalt ${url} op…`);
    if (omslag.url) console.log(`   met eigen omslag ${omslag.url}`);
    if (Number.isFinite(omslag.ms)) console.log(`   omslagmoment ${omslag.ms} ms`);
    try {
      // Eerst de sleutel: werkt die niet, dan zegt de proef niets over de video. En zo kennen we de naam van
      // het account, om hem uit een foutmelding te kunnen halen.
      const naam = await IG.wieBenIk(ACCOUNTS[acc].id, ACCOUNTS[acc].token);
      if (naam && !ACCOUNTS[acc].openbaar) GEBRUIKER[acc] = String(naam);
      console.log(`Sleutel werkt, account ${noem(acc, naam)}.`);
      const r = await IG.proefVideo(ACCOUNTS[acc].id, ACCOUNTS[acc].token, url, omslag);
      console.log(groen(`Geaccepteerd en omgezet (container ${r.id}, omslag: ${r.omslag}). Niet gepubliceerd.`));
      if (omslag.url && r.omslag !== 'eigen beeld') {
        console.error(rood('Let op: de eigen omslag is NIET aangenomen; bij plaatsen valt hij terug op het videobeeld.'));
        process.exit(1);
      }
    } catch (fout) {
      console.error(rood(`Geweigerd: ${schoon(fout.message, acc)}`));
      process.exit(1);
    }
    return;
  }

  if (!actief.length && !PROEF) {
    console.log('Nog niet ingesteld: er is voor geen enkel account een sleutel met accountnummer.');
    console.log('Zet ze bij Settings > Secrets and variables > Actions (zie LEESMIJ.md, stap 5).');
    console.log('Zolang die ontbreken plaatst dit script niets, en dat is de bedoeling.');
    for (const a of ALLE) zet(a, 'niet ingesteld', `${ACCOUNTS[a].geheim} en ${ACCOUNTS[a].geheimId} ontbreken bij de geheimen van de repo.`);
    bewaarStatus({}, { stand: 'niet ingesteld', bericht: 'De sleutel of het accountnummer ontbreekt bij de instellingen van de repo.' });
    return;
  }
  if (!RAW && !PROEF) {
    console.error(rood('REPO_RAW ontbreekt.') + ' Dat is het openbare adres waar Instagram de platen ophaalt.');
    process.exit(1);
  }

  // Eerst per account vragen of de sleutel het doet. Werkt hij niet, dan slaan we
  // dat account over (de melding staat er dan al) en gaan de andere gewoon door.
  // Zodra de sleutel weer werkt, gaat het vanzelf verder.
  const werkt = new Set();
  for (const a of ALLE) {
    // proefdraai: geen netwerk; ook een account zonder sleutel doet mee, zodat je ziet wat er zou wachten
    if (PROEF) { werkt.add(a); zet(a, ingesteld(a) ? 'in orde' : 'niet ingesteld', ''); continue; }
    if (!ingesteld(a)) { zet(a, 'niet ingesteld', `${ACCOUNTS[a].geheim} en ${ACCOUNTS[a].geheimId} ontbreken bij de geheimen van de repo.`); continue; }
    try {
      const naam = await IG.wieBenIk(ACCOUNTS[a].id, ACCOUNTS[a].token);
      if (naam && !ACCOUNTS[a].openbaar) GEBRUIKER[a] = String(naam);
      console.log(`Sleutel werkt, account ${noem(a, naam)}.`);
      werkt.add(a);
      NOEM[a] = noem(a, naam);
      zet(a, 'in orde', 'Verbonden.');
    } catch (fout) {
      const melding = schoon(fout.message, a);
      if (soortFout(melding) === 'tijdelijk') {
        console.error(rood(`Geen verbinding met Instagram voor ${a}: `) + melding);
        console.log(`Voor ${a} wordt in deze run niets geplaatst; de volgende start probeert het opnieuw.`);
        zet(a, 'geen verbinding', `Instagram is niet bereikbaar of geeft een tijdelijke fout: ${melding} De volgende start probeert het opnieuw.`);
      } else {
        console.error(rood(`De sleutel van ${a} wordt geweigerd: `) + melding);
        console.log(`Voor ${a} wordt niets geplaatst zolang dit niet is opgelost.`);
        meld(a, weigerTekst(a, melding));
        zet(a, 'sleutel geweigerd', `Instagram weigert de sleutel: ${melding}`);
      }
    }
  }
  schrijfMeldingen();

  // De planning en het logboek. Onleesbaar is iets anders dan leeg: dan plaatsen we niets.
  const p = leesJson(PLANNING), g = leesJson(GEDAAN);
  const planningFout = !p.ok ? p.fout : (p.bestaat && (!p.data || !Array.isArray(p.data.items)) ? 'er staat geen lijst "items" in' : null);
  const gedaanFout = !g.ok ? g.fout : (g.bestaat && (!g.data || !Array.isArray(g.data.items)) ? 'er staat geen lijst "items" in' : null);
  if (planningFout || gedaanFout) {
    const welk = planningFout ? 'planning.json' : 'gedaan.json';
    const bericht = `${welk} is niet te lezen (${planningFout || gedaanFout}). Er wordt niets geplaatst tot dat bestand is hersteld` +
      (gedaanFout && !planningFout ? '; zonder leesbaar logboek zou alles opnieuw uitgaan.' : '.');
    console.error(rood(bericht));
    // Alleen de eerste keer een rode run (en dus een mail); daarna staat het in status.json tot het is hersteld.
    if (!(OUD.stand === 'staat stil' && OUD.bericht === bericht)) process.exitCode = 1;
    bewaarStatus({}, { stand: 'staat stil', bericht });
    return;
  }
  const planning = p.data || { items: [] };
  const gedaan = g.data || { items: [] };
  const alGedaan = new Set(gedaan.items.map(i => i && i.id));
  const bewaarGedaan = () => { if (!PROEF) schrijf(GEDAAN, JSON.stringify(gedaan, null, 1)); };

  const nu = nuInAmsterdam();
  const nuMin = naarMinuten(nu.datum, nu.tijd);
  console.log(`Nu in Amsterdam: ${nu.datum} ${nu.tijd}`);

  // Wat staat er nog open, per account? En wat klopt er niet?
  const open = Object.fromEntries(ALLE.map(a => [a, 0]));
  const ongeldig = Object.fromEntries(ALLE.map(a => [a, []]));
  const vreemd = [];                                       // items met een account dat niet in de tabel staat
  const aanDeBeurt = [], teLaat = [];
  for (const item of planning.items) {
    if (item && typeof item === 'object' && alGedaan.has(item.id)) continue;
    const acc = accountVan(item);
    if (!ACCOUNTS[acc]) { vreemd.push(item); continue; }
    open[acc]++;
    const reden = gebrek(item);
    if (reden) { ongeldig[acc].push({ item, reden }); continue; }
    if (!werkt.has(acc)) continue;                           // account niet ingesteld of sleutel geweigerd: laten staan
    const verschil = nuMin - naarMinuten(item.datum, item.tijd);
    if (verschil < 0) continue;                              // nog niet
    if (verschil > (item.inhaaluren || INHAALUREN) * 60) { teLaat.push(item); continue; }   // per item ruimer mogelijk
    aanDeBeurt.push(item);
  }
  if (vreemd.length) {
    const namen = [...new Set(vreemd.map(i => String(i && i.account)))];
    console.error(rood(`${vreemd.length} item(s) in planning.json noemen een account dat niet in src/accounts.cjs staat (${namen.join(', ')}); die worden niet geplaatst.`));
  }
  for (const a of ALLE) for (const { item, reden } of ongeldig[a])
    console.error(rood(`Item ${item && item.id ? item.id : '(zonder id)'} van ${a} wordt niet geplaatst: ${reden}.`));

  if (teLaat.length) {
    console.log(`${teLaat.length} item(s) te laat (meer dan ${INHAALUREN} uur, of de eigen inhaaltijd van het item); die slaan we over:`);
    for (const i of teLaat.slice(0, 8)) console.log(`  - ${i.datum} ${i.tijd}  ${i.id}`);
    // wel als gedaan wegschrijven, anders blijft hij elke run klagen
    for (const i of teLaat) { gedaan.items.push({ id: i.id, wanneer: nu.datum + ' ' + nu.tijd, resultaat: 'overgeslagen' }); open[accountVan(i)]--; }
    bewaarGedaan();
  }

  // De stand per account opmaken uit wat we nu weten. Gebeurt vóór het plaatsen (dan staat de stand van de
  // sleutels er al, ook als deze run halverwege zou omvallen) en erna.
  const eenmalig = {};                                       // account -> melding die alleen deze run geldt
  const maakStand = () => {
    // De rem van een item dat niet meer open staat (geplaatst, overgeslagen of uit de planning gehaald) mag weg.
    const gedaanIds = new Set(gedaan.items.map(i => i && i.id));
    const nogOpen = new Set(planning.items.filter(i => i && typeof i === 'object' && !gedaanIds.has(i.id)).map(i => i.id));
    for (const a of ALLE) for (const id of Object.keys(mislukt[a])) if (!nogOpen.has(id)) delete mislukt[a][id];
    for (const a of ALLE) {
      if (!werkt.has(a) || PROEF) continue;                  // de stand van de sleutel staat er al
      const m = Object.entries(mislukt[a]), fout = ongeldig[a];
      if (m.length) {
        const [id, v] = m[m.length - 1];
        zet(a, 'item mislukt', `${m.length > 1 ? `${m.length} items zijn niet gelukt; het laatste: ` : ''}${id} is niet gelukt: ${v.fout} De automaat probeert het opnieuw, hooguit eens per uur, tot de inhaaltijd van het item om is.`);
      } else if (fout.length) {
        const eerste = fout[0].item && fout[0].item.id ? fout[0].item.id : '(zonder id)';
        zet(a, 'item mislukt', `${fout.length > 1 ? `${fout.length} items in planning.json kloppen niet; het eerste: ` : ''}item ${eerste} in planning.json klopt niet (${fout[0].reden}) en wordt niet geplaatst.`);
      } else if (eenmalig[a]) {
        zet(a, 'item mislukt', eenmalig[a]);
      } else {
        zet(a, 'in orde', 'Verbonden.');
      }
    }
  };
  const extra = vreemd.length
    ? `${vreemd.length} item(s) in planning.json noemen een account dat niet in src/accounts.cjs staat (${[...new Set(vreemd.map(i => String(i && i.account)))].join(', ')}); die worden niet geplaatst.`
    : '';
  maakStand();
  bewaarStatus(open, null, extra);

  let gefaald = 0;
  if (!aanDeBeurt.length) console.log('Niets te plaatsen op dit moment.');
  else gefaald = await plaatsAlles(aanDeBeurt, gedaan, nu, nuMin, open, eenmalig, bewaarGedaan);

  maakStand();
  bewaarStatus(open, null, extra);
  if (!PROEF) controleerSleutels(werkt);
  if (gefaald) {
    console.error(rood(`\n${gefaald} item(s) niet gelukt; zie hierboven. Wat wel kon, is geplaatst en bewaard.`));
    process.exitCode = 1;
  }
}

// Hoe lang we terugkijken op het account om te zien of een bericht er al staat.
const SLOTUREN = 18;

// Plaatst wat aan de beurt is. Een item dat mislukt, houdt alleen zijn eigen account tegen, en alleen in deze
// run: de andere accounts gaan door. Geeft het aantal mislukte items terug.
async function plaatsAlles(items, gedaan, nu, nuMin, open, eenmalig, bewaarGedaan) {
  // Extra slot naast het logboek. Is gedaan.json een keer niet bewaard - zoals op
  // 15 september 2026 gebeurde - dan zou hetzelfde bericht er nog eens uitgaan.
  // Daarom eerst vragen wat er werkelijk op het account staat (per account).
  // Verhalen zitten hier niet in; die vervallen na een dag en zijn via de API niet op te vragen.
  const opHetAccount = {};
  if (!PROEF) {
    for (const a of new Set(items.filter(i => i.soort === 'bericht').map(accountVan))) {
      try { opHetAccount[a] = await IG.recenteMedia(ACCOUNTS[a].id, ACCOUNTS[a].token, 25); }
      catch (fout) { opHetAccount[a] = []; console.log(`Kon niet opvragen wat er al staat op ${a}: ` + schoon(fout.message, a)); }
    }
  }
  const eersteRegel = s => String(s || '').split(String.fromCharCode(10))[0].trim();
  const kortgeleden = w => Date.now() - Date.parse(w) < SLOTUREN * 3600 * 1000;
  const klaar = (item, regel) => { gedaan.items.push(regel); open[accountVan(item)]--; delete mislukt[accountVan(item)][item.id]; bewaarGedaan(); };
  const stil = new Set();                                    // accounts waar in deze run al iets mislukte
  let gefaald = 0;

  for (const item of items) {
    const acc = accountVan(item), { id: IG_ID, token: TOKEN } = ACCOUNTS[acc];
    const urls = item.beeld.map(beeldUrl);
    const wat = `${item.soort} ${String(item.taal || '?').toUpperCase()} ${item.id}`;
    console.log(`\n→ ${wat}${acc === T.EERSTE ? '' : ` (${acc})`}`);
    for (const u of urls) console.log(`   beeld: ${kortAdres(u)}`);

    if (PROEF) {
      console.log(ingesteld(acc) ? '   (proefdraai: niet echt geplaatst)' : '   (proefdraai: dit account is niet ingesteld; het item zou wachten)');
      continue;
    }
    if (stil.has(acc)) { console.log(`   wacht tot de volgende start: een eerder item van ${accountNaam(acc)} lukte in deze run niet`); continue; }

    // De rem na een mislukte poging: niet bij elke start opnieuw.
    const eerder = mislukt[acc][item.id];
    if (eerder) {
      const geleden = nuMin - naarMinuten(...eerder.laatste.split(' '));
      const wacht = wachtMinuten(eerder.pogingen);
      if (geleden >= 0 && geleden < wacht) {
        console.log(`   ${eerder.pogingen} keer niet gelukt, het laatst ${geleden} minuten geleden; volgende poging over ${wacht - geleden} minuten`);
        continue;
      }
    }

    // Een video mag sinds 14 okt 2026 ook in een carrousel (plaatsCarrousel in
    // instagram.cjs regelt het als media_type VIDEO). De eerste plaat moet wel een
    // foto zijn: die bepaalt de verhouding van de hele carrousel en de rastertegel.
    if (urls.length > 1 && isVideo(item.beeld[0])) {
      console.error(rood('   MISLUKT: de eerste plaat van een carrousel moet een foto zijn; zet de video op plaat 2 of later.'));
      klaar(item, { id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'overgeslagen' });
      eenmalig[acc] = `${wat}: de eerste plaat van een carrousel moet een foto zijn. Het item is overgeslagen.`;
      continue;
    }
    if (urls.length > 1 && item.beeld.some(isVideo)) console.log('   carrousel met video (plaat ' + (item.beeld.findIndex(isVideo) + 1) + ')');

    if (item.soort === 'bericht') {
      const staatEral = (opHetAccount[acc] || []).find(m => kortgeleden(m.timestamp) && eersteRegel(m.caption) === eersteRegel(item.tekst));
      if (staatEral) {
        console.log(`   staat al op het account sinds ${staatEral.timestamp}; niet nog een keer`);
        klaar(item, { id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'stond er al', mediaId: staatEral.id });
        continue;
      }
    }

    try {
      let mediaId, extra = {};
      if (item.soort === 'verhaal') {
        mediaId = await IG.plaatsVerhaal(IG_ID, TOKEN, urls[0]);
      } else if (/\.mp4$/i.test(urls[0])) {
        // eigen omslag per reel (velden omslag en omslagMs uit de plan-gereedschappen); zonder die velden blijft het 4 s
        const omslag = { url: item.omslag ? beeldUrl(item.omslag) : undefined, ms: Number.isFinite(item.omslagMs) ? item.omslagMs : undefined };
        if (omslag.url) console.log(`   omslag: ${kortAdres(omslag.url)}${Number.isFinite(omslag.ms) ? `, terugval ${omslag.ms} ms` : ''}`);
        const r = await IG.plaatsReel(IG_ID, TOKEN, urls[0], item.tekst || '', omslag);
        mediaId = r.id; extra = { omslag: r.omslag };            // welke omslag Instagram aannam, voor de nacontrole
      } else if (urls.length > 1) {
        mediaId = await IG.plaatsCarrousel(IG_ID, TOKEN, urls, item.tekst || '', item.alt || []);
      } else {
        mediaId = await IG.plaatsFoto(IG_ID, TOKEN, urls[0], item.tekst || '');
      }
      console.log(groen(`   geplaatst (${mediaId})`));
      klaar(item, { id: item.id, wanneer: `${nu.datum} ${nu.tijd}`, resultaat: 'geplaatst', mediaId, ...extra });
      await IG.wacht(4000);                                  // Meta niet overvragen
    } catch (fout) {
      // Niet als gedaan wegschrijven: een volgende run probeert het opnieuw (na de wachttijd hierboven). Wel
      // melden in status.json, anders zie je alleen een rode run in je mail. De andere accounts gaan door.
      const melding = schoon(fout.message, acc);
      console.error(rood(`   MISLUKT: ${melding}`));
      bewaarGedaan();
      const pogingen = (eerder ? eerder.pogingen : 0) + 1;
      mislukt[acc][item.id] = { pogingen, laatste: `${nu.datum} ${nu.tijd}`, fout: /[.!?]$/.test(melding) ? melding : melding + '.' };
      console.log(`   poging ${pogingen}; volgende poging op zijn vroegst over ${wachtMinuten(pogingen)} minuten, tot ${item.inhaaluren || INHAALUREN} uur na de geplande tijd`);
      stil.add(acc);
      gefaald++;
    }
  }
  return gefaald;
}

// Waarschuwt op tijd, want een verlopen sleutel stopt het plaatsen zonder alarm.
// Instagram-sleutels gaan 60 dagen mee en hebben geen "wanneer verloop ik"-vraag,
// dus we onthouden zelf wanneer we een nieuwe sleutel voor het eerst zagen. We
// bewaren alleen een vingerafdruk, nooit de sleutel zelf. @ygdigital.nl staat
// bovenaan in sleutel.json (zoals altijd; het dashboard leest dat); een ander
// account onder zijn eigen naam, bv. "kanaal-1": { afdruk, sinds }.
// Alleen voor accounts waarvan de sleutel in deze run al werkte (bovenaan in main).
const vingerafdruk = t => require('crypto').createHash('sha256').update(t).digest('hex').slice(0, 12);

function controleerSleutels(werkt) {
  const nu = nuInAmsterdam().datum;
  const r = leesJson(SLEUTELBESTAND);
  const alles = r.ok && r.data && typeof r.data === 'object' && !Array.isArray(r.data) ? r.data : {};
  let veranderd = false;

  for (const a of ALLE) {
    if (!werkt.has(a)) continue;
    const afdruk = vingerafdruk(ACCOUNTS[a].token);
    let staat = a === T.EERSTE ? { afdruk: alles.afdruk, sinds: alles.sinds } : (alles[a] || {});
    if (staat.afdruk !== afdruk) {
      staat = { afdruk, sinds: nu };                        // nieuwe sleutel gezien
      if (a === T.EERSTE) Object.assign(alles, staat); else alles[a] = staat;
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
      meld(a, tekst);
      console.log(rood('\n' + tekst));
    }
  }

  if (veranderd) schrijf(SLEUTELBESTAND, JSON.stringify(alles, null, 1));
  schrijfMeldingen();
}

Promise.resolve(main()).catch(fout => {
  console.error(rood('\nGestopt: ' + schoon(fout && fout.message ? fout.message : fout)));
  process.exit(1);
});
