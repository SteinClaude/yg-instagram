// Toetsen voor de automaat, zonder netwerk en zonder sleutels.
//
//   node gereedschap/toets-automaat.cjs            alles
//   node gereedschap/toets-automaat.cjs plaatsen   alleen de delen waarvan de naam met dit woord begint
//
// Wat het doet:
//   * plaatsen   src/plaatsen.cjs draait in een zandbak (een tijdelijke map) met nagemaakte accounts en een
//                nagemaakte Instagram-module. Die module plaatst niets; ze schrijft op wat er gevraagd werd en
//                slaat alarm als een account met de sleutel van een ander account wordt aangesproken.
//   * inplannen  gereedschap/inplannen.cjs draait tegen een nagemaakte "GitHub" (een kale git-map in de
//                zandbak), met proefpakketten en proefvideo's die hier met ffmpeg worden gemaakt.
//   * workflow   de stappen uit .github/workflows/plaatsen.yml die het logboek bewaren en meldingen maken,
//                letterlijk uit het bestand gehaald en in de zandbak gedraaid (met een nagemaakte gh).
// Er gaat niets naar Instagram of GitHub. Alles staat in een tijdelijke map die na afloop wordt weggehaald
// (bewaren: zet YG_TOETS_BEWAAR=1).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const WORTEL = path.join(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'yg-toets-'));
const ALLEEN = process.argv.slice(2).filter(a => !a.startsWith('--'));
const doetMee = deel => !ALLEEN.length || ALLEEN.some(a => deel.startsWith(a));

// --- kleine toetsbank -----------------------------------------------------------
const uitslag = [];
let deelNu = '';
async function toets(naam, fn) {
  try { await fn(); uitslag.push({ deel: deelNu, naam, fout: null }); console.log(`  goed  ${naam}`); }
  catch (e) {
    uitslag.push({ deel: deelNu, naam, fout: e });
    console.log(`  FOUT  ${naam}\n        ${String(e && e.stack ? e.stack : e).split('\n').slice(0, 12).join('\n        ')}`);
  }
}
const waar = (v, wat) => { if (!v) throw new Error(wat); };
const gelijk = (kreeg, verwacht, wat) => {
  const x = JSON.stringify(kreeg), y = JSON.stringify(verwacht);
  if (x !== y) throw new Error(`${wat}\n   verwacht: ${y}\n   kreeg:    ${x}`);
};
const bevat = (tekst, stuk, wat) => { if (!String(tekst).includes(stuk)) throw new Error(`${wat}: "${stuk}" staat er niet in\n${String(tekst).slice(0, 1500)}`); };
const bevatNiet = (tekst, stuk, wat) => { if (String(tekst).includes(stuk)) throw new Error(`${wat}: "${stuk}" staat er wel in`); };
const leesJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const bestaat = f => fs.existsSync(f);

// Tijd in Amsterdam, zoveel minuten geleden (negatief = in de toekomst), in de vorm van planning.json.
function amsterdam(minutenTerug = 0) {
  const d = new Date(Date.now() - minutenTerug * 60000);
  const p = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  const datum = `${p.year}-${p.month}-${p.day}`, tijd = `${p.hour}:${p.minute}`;
  return { datum, tijd, moment: `${datum} ${tijd}` };
}

// --- nagemaakte accounts ---------------------------------------------------------
// De nummers, namen en sleutels zijn verzonnen. De toetsen kijken of die van de niet-openbare accounts
// nergens in een logboek of bestand terechtkomen.
const NEP = {
  ygdigital: { naam: 'ygdigital', id: '17841400000000001', token: 'IGnep.sleutel-ygdigital-1111111111', gebruiker: 'ygdigital.nl' },
  'kanaal-1': { naam: 'kanaal-1', id: '17841400000000011', token: 'IGnep.sleutel-kanaaleen-2222222222', gebruiker: 'nepkanaaleen' },
  'kanaal-2': { naam: 'kanaal-2', id: '17841400000000022', token: 'IGnep.sleutel-kanaaltwee-3333333333', gebruiker: 'nepkanaaltwee' },
  'account-3': { naam: 'account-3', id: '17841400000000033', token: 'IGnep.sleutel-accountdrie-4444444444', gebruiker: 'nepaccountdrie' },
};
const GEHEIM = { ygdigital: ['IG_TOKEN', 'IG_USER_ID'], 'kanaal-1': ['IG_TOKEN_K1', 'IG_USER_ID_K1'], 'kanaal-2': ['IG_TOKEN_K2', 'IG_USER_ID_K2'], 'account-3': ['IG_TOKEN_K3', 'IG_USER_ID_K3'] };
// De geheimen als losse omgevingsvariabelen (zoals het altijd ging) of samen als JSON (zoals de workflow het nu ook doet).
function geheimen(namen, { alsJson = false, bron = NEP } = {}) {
  const los = {};
  for (const n of namen) { los[GEHEIM[n][0]] = bron[n].token; los[GEHEIM[n][1]] = bron[n].id; }
  return alsJson ? { IG_GEHEIMEN: JSON.stringify({ github_token: 'ghs_nep', ...los }) } : los;
}

// De nagemaakte Instagram-module. Leest het draaiboek (scenario.json) en schrijft elke aanroep in aanroepen.log.
const NEP_MODULE = `'use strict';
const fs = require('fs');
const SC = JSON.parse(fs.readFileSync(process.env.NEP_SCENARIO, 'utf8'));
const log = r => fs.appendFileSync(process.env.NEP_LOG, JSON.stringify(r) + '\\n');
let teller = 0;
function account(igId, token, wat) {
  const a = Object.values(SC.accounts).find(x => x.id === igId);
  if (!a) { log({ wat, alarm: 'onbekend nummer' }); throw new Error('Instagram weigert /' + igId + ': onbekend account (code 100)'); }
  if (a.token !== token) { log({ wat, alarm: 'VERKEERDE SLEUTEL', account: a.naam }); throw new Error('VERKEERDE SLEUTEL bij ' + a.naam); }
  return a;
}
const vul = (t, a) => t.split('<id>').join(a.id).split('<gebruiker>').join(a.gebruiker);
async function wieBenIk(igId, token) {
  const a = account(igId, token, 'wieBenIk');
  log({ wat: 'wieBenIk', account: a.naam });
  if (a.sleutelFout) throw new Error(vul(a.sleutelFout, a));
  return a.gebruiker;
}
async function recenteMedia(igId, token) {
  const a = account(igId, token, 'recenteMedia');
  log({ wat: 'recenteMedia', account: a.naam });
  return a.media || [];
}
function plaats(wat, igId, token, urls, tekst, extra) {
  const a = account(igId, token, wat);
  const f = (a.faal || []).find(x => urls.some(u => u.includes(x.bevat)));
  log({ wat, account: a.naam, urls, tekst, ...extra, mislukt: !!f });
  if (f) throw new Error(vul(f.melding, a));
  return 'M' + (++teller) + '-' + a.naam;
}
const welkeOmslag = o => o && o.url ? 'eigen beeld' : 'videobeeld op ' + (o && Number.isFinite(o.ms) ? o.ms : 4000) + ' ms';
module.exports = {
  VERSIE: 'nep', OMSLAG_MS: 4000, wacht: async () => {}, wieBenIk, recenteMedia,
  plaatsFoto: async (i, t, url, tekst) => plaats('plaatsFoto', i, t, [url], tekst, {}),
  plaatsCarrousel: async (i, t, urls, tekst, alts) => plaats('plaatsCarrousel', i, t, urls, tekst, { alts }),
  plaatsVerhaal: async (i, t, url) => plaats('plaatsVerhaal', i, t, [url], '', {}),
  plaatsReel: async (i, t, url, tekst, omslag) => ({ id: plaats('plaatsReel', i, t, [url], tekst, { omslag }), omslag: welkeOmslag(omslag) }),
  proefVideo: async (i, t, url, omslag) => ({ id: plaats('proefVideo', i, t, [url], '', { omslag }), omslag: welkeOmslag(omslag) }),
};
`;

const RAW = 'https://raw.githubusercontent.com/Voorbeeld/automaat/main';
const PAGES = 'https://voorbeeld.github.io/automaat';

// Een zandbak voor plaatsen.cjs: een eigen map met src/, de planning en de nagemaakte module.
// bron: { plaatsen, accounts } = de tekst van die twee bestanden (standaard: zoals ze nu in de map staan).
function zandbak(naam, { planning = [], gedaan = [], status, sleutel, accounts = NEP, bron = {} } = {}) {
  const map = path.join(TMP, naam);
  fs.mkdirSync(path.join(map, 'src'), { recursive: true });
  fs.writeFileSync(path.join(map, 'src', 'plaatsen.cjs'), bron.plaatsen || fs.readFileSync(path.join(WORTEL, 'src', 'plaatsen.cjs')));
  const tabel = bron.accounts !== undefined ? bron.accounts : fs.readFileSync(path.join(WORTEL, 'src', 'accounts.cjs'));
  if (tabel !== null) fs.writeFileSync(path.join(map, 'src', 'accounts.cjs'), tabel);
  fs.writeFileSync(path.join(map, 'src', 'instagram.cjs'), NEP_MODULE);
  fs.writeFileSync(path.join(map, 'planning.json'), JSON.stringify({ tijdzone: 'Europe/Amsterdam', gemaakt: '2026-09-20', items: planning }, null, 2) + '\n');
  fs.writeFileSync(path.join(map, 'gedaan.json'), JSON.stringify({ items: gedaan }, null, 1));
  if (status !== undefined) fs.writeFileSync(path.join(map, 'status.json'), typeof status === 'string' ? status : JSON.stringify(status, null, 1));
  if (sleutel !== undefined) fs.writeFileSync(path.join(map, 'sleutel.json'), JSON.stringify(sleutel, null, 1));
  fs.writeFileSync(path.join(map, 'scenario.json'), JSON.stringify({ accounts }));
  return map;
}
function draai(map, env = {}, args = []) {
  const log = path.join(map, 'aanroepen.log');
  fs.rmSync(log, { force: true });
  const r = spawnSync(process.execPath, [path.join(map, 'src', 'plaatsen.cjs'), ...args], {
    env: { PATH: process.env.PATH, REPO_RAW: RAW, NEP_SCENARIO: path.join(map, 'scenario.json'), NEP_LOG: log, ...env }, encoding: 'utf8' });
  const aanroepen = bestaat(log) ? fs.readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  return { code: r.status, uit: `${r.stdout}${r.stderr}`, aanroepen, plaatsingen: aanroepen.filter(a => /^plaats/.test(a.wat)) };
}
const lees = (map, f) => leesJson(path.join(map, f));
// Alles wat een run achterlaat en wat openbaar wordt: logboek, status, logboek van geplaatst, sleutelteller, meldingen.
function alleUitvoer(map, r) {
  let t = r.uit;
  for (const f of ['status.json', 'gedaan.json', 'sleutel.json']) if (bestaat(path.join(map, f))) t += '\n' + fs.readFileSync(path.join(map, f), 'utf8');
  const m = path.join(map, 'waarschuwingen');
  if (bestaat(m)) for (const f of fs.readdirSync(m)) t += `\n[${f}]\n` + fs.readFileSync(path.join(m, f), 'utf8');
  return t;
}
function geenLek(tekst, namen = ['kanaal-1', 'kanaal-2', 'account-3'], bron = NEP) {
  for (const n of namen) for (const veld of ['id', 'token', 'gebruiker']) bevatNiet(tekst, bron[n][veld], `lek van ${veld} van ${n}`);
  for (const n of Object.keys(bron)) bevatNiet(tekst, bron[n].token, `lek van de sleutel van ${n}`);
}

// --- items zoals de plan-gereedschappen ze maken ---------------------------------
const fotoY = (id, m, extra = {}) => ({ id, datum: m.datum, tijd: m.tijd, soort: 'bericht', taal: 'nl', beeld: ['berichten/nl/B01.jpg'], titel: 'Een bericht', tekst: `Tekst van ${id}\n\nTweede alinea.`, ...extra });
const verhaalY = (id, m) => ({ id, datum: m.datum, tijd: m.tijd, soort: 'verhaal', taal: 'nl', beeld: ['verhalen/nl/V01.jpg'], titel: 'De entree van uw bedrijf' });
const reelK1 = (code, m, extra = {}) => ({ id: `${m.datum}-k1-${code.toLowerCase()}`, datum: m.datum, tijd: m.tijd, soort: 'bericht', taal: 'en', account: 'kanaal-1',
  beeld: [`pakketten/2026-12-15-${code}-proef/instagram/reel.mp4`], omslag: `pakketten/2026-12-15-${code}-proef/instagram/omslag.jpg`, omslagMs: 2100,
  titel: `Kanaal 1 ${code}: Why is this a test?`, tekst: `Why is this a test? (${code})\n\nBecause it is.\n\n#test`, inhaaluren: 18, eenmalig: true, ...extra });
const reelAnder = (acc, kort, code, m, extra = {}) => ({ id: `${m.datum}-${kort}-${code.toLowerCase()}`, datum: m.datum, tijd: m.tijd, soort: 'bericht', taal: 'en', account: acc,
  beeld: [`${acc}/${code}.mp4`], omslag: `${acc}/${code}.jpg`, omslagMs: 800,
  titel: `${acc} ${code}: A test`, tekst: `A test for ${code}\n\nBody.\n\n#test`, inhaaluren: 18, eenmalig: true, ...extra });

const git = (map, args, opties = {}) => execFileSync('git', args, { cwd: map, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opties }).trim();

// =================================================================================
async function deelPlaatsen() {
  const VIER = ['ygdigital', 'kanaal-1', 'kanaal-2', 'account-3'];

  await toets('de tabel klopt en heeft de vier accounts, met de afgesproken geheimen en codes', () => {
    const T = require(path.join(WORTEL, 'src', 'accounts.cjs'));
    gelijk(T.namen(), VIER, 'namen');
    gelijk(T.controleerTabel(), [], 'controleerTabel');
    for (const n of VIER) gelijk([T.zoek(n).geheim, T.zoek(n).geheimId], GEHEIM[n], `geheimen van ${n}`);
    waar(T.zoek('kanaal-2').codes.test('K2-W06') && T.zoek('kanaal-2').codes.test('K2-L12') && !T.zoek('kanaal-2').codes.test('YS01') && !T.zoek('kanaal-2').codes.test('K2-06'), 'codes kanaal 2');
    waar(T.zoek('account-3').codes.test('G11') && T.zoek('account-3').codes.test('G1') && !T.zoek('account-3').codes.test('G') && !T.zoek('account-3').codes.test('K2-W06'), 'codes account 3');
    waar(T.zoek('kanaal-1').codes.test('YS48') && T.zoek('kanaal-1').codes.test('YL02') && !T.zoek('kanaal-1').codes.test('YH01') && !T.zoek('kanaal-1').codes.test('G11'), 'codes kanaal 1');
    gelijk(T.zoek('kanaal-1').keuringen, ['pakket', 'bijschrift'], 'keuringen kanaal 1');
    gelijk(T.zoek('kanaal-2').keuringen, ['pakket'], 'keuringen kanaal 2');
    gelijk(T.zoek('account-3').keuringen, ['pakket'], 'keuringen account 3');
    gelijk(T.accountVan({}), 'ygdigital', 'item zonder account');
    gelijk(T.itemId('account-3', '2026-11-24', 'G11'), '2026-11-24-k3-g11', 'id account 3');
  });

  await toets('een item zonder "account" gaat naar het eerste account, met de sleutel van dat account', () => {
    const m = amsterdam(5);
    const map = zandbak('zonder-account', { planning: [fotoY('toets-foto', m), verhaalY('toets-verhaal', m)] });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => [p.wat, p.account, p.urls]), [['plaatsFoto', 'ygdigital', [`${RAW}/beeld/berichten/nl/B01.jpg`]], ['plaatsVerhaal', 'ygdigital', [`${RAW}/beeld/verhalen/nl/V01.jpg`]]], 'plaatsingen');
    waar(!r.aanroepen.some(a => a.alarm), 'alarm in de nagemaakte module: ' + JSON.stringify(r.aanroepen.filter(a => a.alarm)));
    gelijk(lees(map, 'gedaan.json').items.map(i => [i.id, i.resultaat]), [['toets-foto', 'geplaatst'], ['toets-verhaal', 'geplaatst']], 'gedaan');
  });

  await toets('kanaal 1 doet precies wat het deed: zelfde aanroepen, zelfde gedaan.json en sleutel.json als de versie op main', () => {
    let oud;
    try { oud = execFileSync('git', ['show', '9ea50eb:src/plaatsen.cjs'], { cwd: WORTEL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 24 }); }
    catch { console.log('        (overgeslagen: commit 9ea50eb is hier niet op te halen)'); return; }
    const m5 = amsterdam(5), m200 = amsterdam(200), straks = amsterdam(-120), oeroud = amsterdam(60 * 30);
    const media = [{ id: 'M-oud', caption: 'Why is this a test? (YS91)\n\nIets anders eronder', timestamp: new Date(Date.now() - 3600e3).toISOString() }];
    const planning = [
      fotoY('y-te-laat', oeroud),                                   // 30 uur te laat, inhaaltijd 6 uur: overgeslagen
      reelK1('YS90', m200),                                          // 200 minuten te laat, mag (18 uur)
      fotoY('y-foto', m5),
      { ...fotoY('y-carrousel', m5), beeld: ['berichten/nl/K02-1.jpg', 'berichten/nl/K02-2.jpg', 'berichten/nl/K02-3.mp4'], alt: ['een', 'twee', 'drie'] },
      { ...fotoY('y-carrousel-fout', m5), beeld: ['berichten/nl/K03-1.mp4', 'berichten/nl/K03-2.jpg'] },   // eerste plaat een video
      verhaalY('y-verhaal', m5),
      reelK1('YS91', m5),                                            // staat al op het account (zelfde eerste regel)
      reelK1('YS92', m5, { omslag: undefined, omslagMs: undefined }),
      reelK1('YS93', straks),                                        // nog niet aan de beurt
    ].map(i => JSON.parse(JSON.stringify(i)));
    const gedaan = [{ id: 'al-gedaan', wanneer: '2026-11-01 10:00', resultaat: 'geplaatst', mediaId: '1' }];
    const sleutel = { afdruk: require('crypto').createHash('sha256').update(NEP.ygdigital.token).digest('hex').slice(0, 12), sinds: amsterdam(60 * 24 * 20).datum,
      'kanaal-1': { afdruk: require('crypto').createHash('sha256').update(NEP['kanaal-1'].token).digest('hex').slice(0, 12), sinds: amsterdam(60 * 24 * 10).datum } };
    const accounts = { ...NEP, 'kanaal-1': { ...NEP['kanaal-1'], media } };
    const a = zandbak('gelijk-oud', { planning, gedaan, sleutel, accounts, bron: { plaatsen: oud, accounts: null } });
    const b = zandbak('gelijk-nieuw', { planning, gedaan, sleutel, accounts });
    const ra = draai(a, geheimen(['ygdigital', 'kanaal-1'])), rb = draai(b, geheimen(['ygdigital', 'kanaal-1']));
    gelijk([ra.code, rb.code], [0, 0], 'afsluitcodes\n' + ra.uit + rb.uit);
    const kern = r => r.aanroepen.filter(x => x.wat !== 'wieBenIk');
    waar(kern(ra).length >= 6, 'de oude versie plaatste te weinig om iets te vergelijken: ' + JSON.stringify(kern(ra)));
    gelijk(kern(rb), kern(ra), 'aanroepen van Instagram (zonder het navragen van de sleutel)');
    gelijk(lees(b, 'gedaan.json'), lees(a, 'gedaan.json'), 'gedaan.json');
    gelijk(lees(b, 'sleutel.json'), lees(a, 'sleutel.json'), 'sleutel.json');
    gelijk(fs.readFileSync(path.join(b, 'gedaan.json'), 'utf8'), fs.readFileSync(path.join(a, 'gedaan.json'), 'utf8'), 'gedaan.json, letterlijk');
    // de vorm van een item in gedaan.json is die van altijd
    gelijk(lees(b, 'gedaan.json').items.find(i => i.id.endsWith('ys90')), { id: `${m200.datum}-k1-ys90`, wanneer: lees(b, 'gedaan.json').items.find(i => i.id.endsWith('ys90')).wanneer, resultaat: 'geplaatst', mediaId: 'M1-kanaal-1', omslag: 'eigen beeld' }, 'vorm van een geplaatst item');
    const reel = rb.plaatsingen.find(p => p.urls[0].includes('YS90'));
    gelijk(reel.urls, [`${PAGES}/pakketten/2026-12-15-YS90-proef/instagram/reel.mp4`], 'de video komt van Pages');
    gelijk(reel.omslag, { url: `${RAW}/pakketten/2026-12-15-YS90-proef/instagram/omslag.jpg`, ms: 2100 }, 'de omslag komt van raw');
    gelijk(rb.aanroepen.filter(x => x.wat === 'wieBenIk').length, 2, 'de sleutel wordt per account één keer nagevraagd');
  });

  await toets('vier accounts tegelijk: elk item gaat met de eigen sleutel naar het eigen account', () => {
    const m = amsterdam(3);
    const planning = [fotoY('y-foto', m), reelK1('YS50', m), reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelAnder('account-3', 'k3', 'G11', m)];
    const map = zandbak('vier', { planning });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    waar(!r.aanroepen.some(a => a.alarm), 'alarm: ' + JSON.stringify(r.aanroepen.filter(a => a.alarm)));
    gelijk(r.plaatsingen.map(p => [p.wat, p.account, p.urls[0]]), [
      ['plaatsFoto', 'ygdigital', `${RAW}/beeld/berichten/nl/B01.jpg`],
      ['plaatsReel', 'kanaal-1', `${PAGES}/pakketten/2026-12-15-YS50-proef/instagram/reel.mp4`],
      ['plaatsReel', 'kanaal-2', `${PAGES}/beeld/kanaal-2/K2-W06.mp4`],
      ['plaatsReel', 'account-3', `${PAGES}/beeld/account-3/G11.mp4`]], 'plaatsingen');
    gelijk(r.plaatsingen[2].omslag, { url: `${RAW}/beeld/kanaal-2/K2-W06.jpg`, ms: 800 }, 'omslag kanaal 2');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.resultaat), ['geplaatst', 'geplaatst', 'geplaatst', 'geplaatst'], 'gedaan');
    const s = lees(map, 'status.json');
    gelijk([s.stand, s.bericht], ['in orde', 'Verbonden met @ygdigital.nl, kanaal 1, kanaal 2 en account 3.'], 'bovenste regel van status.json');
    gelijk(Object.keys(s.accounts), VIER, 'accounts in status.json');
    gelijk(VIER.map(a => [s.accounts[a].naam, s.accounts[a].stand]), [['@ygdigital.nl', 'in orde'], ['kanaal 1', 'in orde'], ['kanaal 2', 'in orde'], ['account 3', 'in orde']], 'stand per account');
    waar(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s.sinds) && VIER.every(a => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s.accounts[a].sinds)), 'sinds heeft de vorm van altijd');
    geenLek(alleUitvoer(map, r));
    const sl = lees(map, 'sleutel.json');
    waar(/^[0-9a-f]{12}$/.test(sl.afdruk) && sl.sinds && sl['kanaal-1'].afdruk && sl['kanaal-2'].afdruk && sl['account-3'].afdruk, 'sleutelteller per account: ' + JSON.stringify(sl));
    gelijk(sl['kanaal-2'].afdruk, require('crypto').createHash('sha256').update(NEP['kanaal-2'].token).digest('hex').slice(0, 12), 'vingerafdruk is de eerste 12 tekens van sha256');
  });

  await toets('de geheimen als JSON (IG_GEHEIMEN) werken net zo; een losse variabele gaat voor', () => {
    const m = amsterdam(3);
    const map = zandbak('json-geheimen', { planning: [reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelAnder('account-3', 'k3', 'G11', m)] });
    const r = draai(map, geheimen(VIER, { alsJson: true }));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['kanaal-2', 'account-3'], 'plaatsingen');
    waar(!r.aanroepen.some(a => a.alarm), 'alarm');
    // een foute waarde in de JSON, de goede los: de losse telt
    const fout = JSON.parse(geheimen(VIER, { alsJson: true }).IG_GEHEIMEN); fout.IG_TOKEN_K2 = 'verkeerd';
    const map2 = zandbak('json-geheimen-2', { planning: [reelAnder('kanaal-2', 'k2', 'K2-W07', m)] });
    const r2 = draai(map2, { IG_GEHEIMEN: JSON.stringify(fout), IG_TOKEN_K2: NEP['kanaal-2'].token });
    gelijk(r2.plaatsingen.map(p => p.account), ['kanaal-2'], 'de losse variabele gaat voor');
    // onleesbare JSON: dan is er gewoon niets ingesteld, geen crash
    const map3 = zandbak('json-geheimen-3', { planning: [reelAnder('kanaal-2', 'k2', 'K2-W08', m)] });
    const r3 = draai(map3, { IG_GEHEIMEN: '{kapot' });
    gelijk([r3.code, r3.plaatsingen.length, lees(map3, 'status.json').stand], [0, 0, 'niet ingesteld'], 'onleesbare IG_GEHEIMEN');
  });

  await toets('ontbreekt de sleutel van een account, dan wachten alleen de items van dat account', () => {
    const m = amsterdam(4);
    const planning = [reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelK1('YS50', m), reelAnder('account-3', 'k3', 'G11', m)];
    const map = zandbak('ontbreekt', { planning });
    const r = draai(map, geheimen(['ygdigital', 'kanaal-1', 'account-3']));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['kanaal-1', 'account-3'], 'plaatsingen');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.id), [`${m.datum}-k1-ys50`, `${m.datum}-k3-g11`], 'het item van kanaal 2 staat niet in gedaan');
    const s = lees(map, 'status.json');
    gelijk([s.accounts['kanaal-2'].stand, s.accounts['kanaal-1'].stand, s.accounts['account-3'].stand], ['niet ingesteld', 'in orde', 'in orde'], 'stand per account');
    gelijk(s.stand, 'staat stil', 'er wacht werk op een account zonder sleutel');
    bevat(s.bericht, 'kanaal 2: IG_TOKEN_K2 en IG_USER_ID_K2 ontbreken', 'bericht');
    bevat(s.bericht, 'Zonder storing: @ygdigital.nl, kanaal 1 en account 3.', 'bericht');
    waar(!bestaat(path.join(map, 'waarschuwingen')), 'geen melding voor een account dat nog niet is ingesteld');
    // zodra de sleutel er is, gaat het item alsnog uit (binnen de inhaaltijd)
    const r2 = draai(map, geheimen(VIER));
    gelijk(r2.plaatsingen.map(p => p.account), ['kanaal-2'], 'tweede run');
    gelijk(lees(map, 'status.json').stand, 'in orde', 'stand na de tweede run');
  });

  await toets('een geweigerde sleutel raakt alleen dat account; de melding noemt het account en het geheim, niet het nummer', () => {
    const m = amsterdam(4);
    const planning = [reelAnder('account-3', 'k3', 'G11', m), reelK1('YS50', m), reelAnder('kanaal-2', 'k2', 'K2-W06', m)];
    const accounts = { ...NEP, 'account-3': { ...NEP['account-3'], sleutelFout: 'Instagram weigert /<id>: Error validating access token: The session of @<gebruiker> has been invalidated. (code 190)' } };
    const map = zandbak('geweigerd', { planning, accounts });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['kanaal-1', 'kanaal-2'], 'plaatsingen');
    const s = lees(map, 'status.json');
    gelijk([s.stand, s.accounts['account-3'].stand, s.accounts['kanaal-1'].stand, s.accounts['kanaal-2'].stand], ['staat stil', 'sleutel geweigerd', 'in orde', 'in orde'], 'standen');
    bevat(s.accounts['account-3'].bericht, 'Instagram weigert de sleutel: Instagram weigert /<account-3>: Error validating access token', 'bericht van het account');
    gelijk(fs.readdirSync(path.join(map, 'waarschuwingen')), ['account-3.txt'], 'meldingen');
    const melding = fs.readFileSync(path.join(map, 'waarschuwingen', 'account-3.txt'), 'utf8');
    gelijk(melding.split('\n')[0], 'Sleutel vernieuwen: account 3', 'titel van de melding');
    gelijk(melding.split('\n')[1], '', 'lege regel na de titel');
    bevat(melding, 'De Instagram-sleutel van account 3 werkt niet meer.', 'melding');
    bevat(melding, 'Settings > Secrets and variables > Actions > IG_TOKEN_K3.', 'melding');
    geenLek(alleUitvoer(map, r));
  });

  await toets('de stand van nu: sleutel van het gepauzeerde account geweigerd, niets voor gepland, kanaal 1 plaatst → "in orde"', () => {
    const m = amsterdam(4);
    const oud = { stand: 'staat stil', bericht: 'Instagram weigert de sleutel van @ygdigital.nl: Instagram weigert /17841400000000001: Error validating access token (code 190)', sinds: '2026-11-13 02:44' };
    const accounts = { ...NEP, ygdigital: { ...NEP.ygdigital, sleutelFout: 'Instagram weigert /<id>: Error validating access token: The session has been invalidated because the user changed their password. (code 190)' } };
    const map = zandbak('nu', { planning: [fotoY('y-oud', amsterdam(60 * 24 * 30)), reelK1('YS50', m), reelK1('YS51', amsterdam(-600))], gedaan: [{ id: 'y-oud', wanneer: '2026-10-20 07:05', resultaat: 'geplaatst', mediaId: '9' }], status: oud, accounts });
    const r = draai(map, geheimen(['ygdigital', 'kanaal-1']));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['kanaal-1'], 'plaatsingen');
    const s = lees(map, 'status.json');
    gelijk(s.stand, 'in orde', 'bovenste regel');
    gelijk(s.bericht, 'Verbonden met kanaal 1. Doet nu niet mee, er staat niets voor in de planning: @ygdigital.nl (sleutel geweigerd), kanaal 2 (niet ingesteld) en account 3 (niet ingesteld).', 'bericht');
    gelijk([s.accounts.ygdigital.stand, s.accounts['kanaal-1'].stand], ['sleutel geweigerd', 'in orde'], 'per account');
    gelijk(fs.readFileSync(path.join(map, 'waarschuwingen', 'ygdigital.txt'), 'utf8').split('\n')[0], 'Sleutel vernieuwen', 'de titel voor het eerste account blijft zoals hij was');
    // staat er wél iets voor dat account gepland, dan is het "staat stil"
    const map2 = zandbak('nu-2', { planning: [fotoY('y-nieuw', amsterdam(-600)), reelK1('YS50', m)], status: oud, accounts });
    draai(map2, geheimen(['ygdigital', 'kanaal-1']));
    const s2 = lees(map2, 'status.json');
    gelijk(s2.stand, 'staat stil', 'met werk voor het geweigerde account');
    bevat(s2.bericht, '@ygdigital.nl: Instagram weigert de sleutel:', 'bericht');
    bevat(s2.bericht, 'Zonder storing: kanaal 1.', 'bericht');
  });

  await toets('een start zonder werk schrijft niets: geen wijziging in gedaan.json, sleutel.json of status.json', () => {
    const map = zandbak('zonder-werk', { planning: [reelK1('YS50', amsterdam(-300)), reelAnder('kanaal-2', 'k2', 'K2-W06', amsterdam(-400))] });
    git(map, ['init', '-q', '-b', 'main']);
    const r1 = draai(map, geheimen(VIER));
    gelijk([r1.code, r1.plaatsingen.length], [0, 0], 'eerste run\n' + r1.uit);
    bevat(r1.uit, 'Niets te plaatsen op dit moment.', 'logboek');
    git(map, ['add', '-A']); git(map, ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'begin']);
    for (let i = 0; i < 3; i++) {
      const r = draai(map, geheimen(VIER));
      gelijk([r.code, r.plaatsingen.length], [0, 0], 'volgende run');
      gelijk(git(map, ['status', '--porcelain', 'gedaan.json', 'sleutel.json', 'status.json']), '', 'niets gewijzigd na een start zonder werk');
      waar(!bestaat(path.join(map, 'waarschuwingen')), 'geen meldingen');
    }
  });

  await toets('een item dat mislukt houdt alleen zijn eigen account op; de andere accounts gaan door en alles wordt bewaard', () => {
    const m = amsterdam(4);
    const planning = [reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelAnder('kanaal-2', 'k2', 'K2-W07', m), reelK1('YS50', m), reelAnder('account-3', 'k3', 'G11', m)];
    const accounts = { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], faal: [{ bevat: 'K2-W06', melding: 'Instagram kon het beeld niet verwerken (ERROR): video van <gebruiker> op /<id>/media' }] } };
    const map = zandbak('mislukt', { planning, accounts });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 1, 'een mislukte poging geeft een rode run\n' + r.uit);
    gelijk(r.plaatsingen.map(p => [p.account, p.mislukt]), [['kanaal-2', true], ['kanaal-1', false], ['account-3', false]], 'kanaal 2 stopt na de fout, de rest gaat door');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.id), [`${m.datum}-k1-ys50`, `${m.datum}-k3-g11`], 'gedaan');
    const s = lees(map, 'status.json');
    gelijk([s.stand, s.accounts['kanaal-2'].stand, s.accounts['kanaal-1'].stand], ['staat stil', 'item mislukt', 'in orde'], 'standen');
    gelijk(Object.keys(s.accounts['kanaal-2'].mislukt), [`${m.datum}-k2-k2-w06`], 'de rem staat op het mislukte item');
    gelijk(s.accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].pogingen, 1, 'pogingen');
    bevat(s.bericht, `kanaal 2: ${m.datum}-k2-k2-w06 is niet gelukt: Instagram kon het beeld niet verwerken (ERROR): video van <kanaal-2> op /<kanaal-2>/media.`, 'bericht');
    geenLek(alleUitvoer(map, r));

    // direct daarna: de rem. Het mislukte item wordt niet opnieuw geprobeerd, het volgende van kanaal 2 wel.
    const r2 = draai(map, geheimen(VIER));
    gelijk(r2.code, 0, 'tweede run is groen\n' + r2.uit);
    gelijk(r2.plaatsingen.map(p => p.urls[0]), [`${PAGES}/beeld/kanaal-2/K2-W07.mp4`], 'alleen het volgende item van kanaal 2');
    bevat(r2.uit, '1 keer niet gelukt', 'logboek van de rem');
    gelijk(lees(map, 'status.json').accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].pogingen, 1, 'pogingen blijft 1');

    // nog een run binnen de wachttijd: er verandert niets meer (geen commit)
    const voor = fs.readFileSync(path.join(map, 'status.json'), 'utf8');
    const r3 = draai(map, geheimen(VIER));
    gelijk([r3.code, r3.plaatsingen.length], [0, 0], 'derde run');
    gelijk(fs.readFileSync(path.join(map, 'status.json'), 'utf8'), voor, 'status.json blijft gelijk zolang de rem geldt');

    // de wachttijd is om (laatste poging 11 minuten geleden): opnieuw, en weer mis → poging 2
    const st = lees(map, 'status.json');
    st.accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].laatste = amsterdam(11).moment;
    fs.writeFileSync(path.join(map, 'status.json'), JSON.stringify(st, null, 1));
    const r4 = draai(map, geheimen(VIER));
    gelijk([r4.code, r4.plaatsingen.map(p => p.mislukt)], [1, [true]], 'vierde run probeert opnieuw');
    gelijk(lees(map, 'status.json').accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].pogingen, 2, 'pogingen is nu 2');
    // na poging 2 is de wachttijd 20 minuten: 11 minuten is te vroeg
    const st2 = lees(map, 'status.json');
    st2.accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].laatste = amsterdam(11).moment;
    fs.writeFileSync(path.join(map, 'status.json'), JSON.stringify(st2, null, 1));
    gelijk(draai(map, geheimen(VIER)).plaatsingen.length, 0, 'na twee pogingen is 11 minuten te vroeg');

    // de video is hersteld: het lukt, de rem verdwijnt, de stand is weer in orde
    fs.writeFileSync(path.join(map, 'scenario.json'), JSON.stringify({ accounts: NEP }));
    const st3 = lees(map, 'status.json');
    st3.accounts['kanaal-2'].mislukt[`${m.datum}-k2-k2-w06`].laatste = amsterdam(25).moment;
    fs.writeFileSync(path.join(map, 'status.json'), JSON.stringify(st3, null, 1));
    const r5 = draai(map, geheimen(VIER));
    gelijk([r5.code, r5.plaatsingen.map(p => p.mislukt)], [0, [false]], 'vijfde run lukt');
    const s5 = lees(map, 'status.json');
    gelijk([s5.stand, s5.accounts['kanaal-2'].stand, s5.accounts['kanaal-2'].mislukt], ['in orde', 'in orde', undefined], 'stand na herstel');
  });

  await toets('het slot tegen dubbel plaatsen werkt per account', () => {
    const m = amsterdam(4);
    const media = [{ id: 'IG-777', caption: 'A test for K2-W06\n\nheel andere tekst', timestamp: new Date(Date.now() - 2 * 3600e3).toISOString() }];
    const planning = [reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelAnder('account-3', 'k3', 'G11', m, { tekst: 'A test for K2-W06\n\nzelfde eerste regel, ander account' })];
    const map = zandbak('slot', { planning, accounts: { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], media } } });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['account-3'], 'alleen account 3 plaatst');
    gelijk(lees(map, 'gedaan.json').items.map(i => [i.resultaat, i.mediaId]), [['stond er al', 'IG-777'], ['geplaatst', 'M1-account-3']], 'gedaan');
    gelijk(r.aanroepen.filter(a => a.wat === 'recenteMedia').map(a => a.account).sort(), ['account-3', 'kanaal-2'], 'per account nagevraagd wat er al staat');
  });

  await toets('de sleutelteller waarschuwt per account, twaalf dagen van tevoren, met een eigen melding per account', () => {
    const afdruk = n => require('crypto').createHash('sha256').update(NEP[n].token).digest('hex').slice(0, 12);
    const sleutel = { afdruk: afdruk('ygdigital'), sinds: amsterdam(60 * 24 * 50).datum, 'kanaal-1': { afdruk: afdruk('kanaal-1'), sinds: amsterdam(60 * 24 * 10).datum },
      'kanaal-2': { afdruk: afdruk('kanaal-2'), sinds: amsterdam(60 * 24 * 55).datum }, 'account-3': { afdruk: 'een-oude-afdruk', sinds: amsterdam(60 * 24 * 59).datum } };
    const map = zandbak('teller', { sleutel });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(fs.readdirSync(path.join(map, 'waarschuwingen')).sort(), ['kanaal-2.txt', 'ygdigital.txt'], 'meldingen');
    const m2 = fs.readFileSync(path.join(map, 'waarschuwingen', 'kanaal-2.txt'), 'utf8');
    gelijk(m2.split('\n')[0], 'Sleutel vernieuwen: kanaal 2', 'titel');
    bevat(m2, 'De Instagram-sleutel van kanaal 2 verloopt over ongeveer 5 dagen.', 'tekst');
    bevat(m2, 'Settings > Secrets and variables > Actions > IG_TOKEN_K2.', 'tekst');
    bevat(fs.readFileSync(path.join(map, 'waarschuwingen', 'ygdigital.txt'), 'utf8'), 'De Instagram-sleutel van @ygdigital.nl verloopt over ongeveer 10 dagen.', 'tekst eerste account');
    const na = lees(map, 'sleutel.json');
    gelijk([na.afdruk, na.sinds, na['kanaal-1'], na['kanaal-2']], [sleutel.afdruk, sleutel.sinds, sleutel['kanaal-1'], sleutel['kanaal-2']], 'bekende sleutels houden hun teller');
    gelijk(na['account-3'], { afdruk: afdruk('account-3'), sinds: amsterdam(0).datum }, 'een nieuwe sleutel begint opnieuw te tellen');
    bevat(r.uit, 'Nieuwe sleutel herkend (account-3); de teller loopt vanaf vandaag.', 'logboek');
    bevat(r.uit, 'Sleutel kanaal-1 is 10 dagen oud, nog ongeveer 50 dagen te gaan.', 'logboek');
    geenLek(alleUitvoer(map, r));
  });

  await toets('geen verbinding met Instagram is geen geweigerde sleutel: geen melding "Sleutel vernieuwen"', () => {
    const m = amsterdam(4);
    for (const [i, fout] of ['fetch failed', 'Instagram gaf geen leesbaar antwoord (status 502) op /<id>', 'Instagram weigert /<id>: Application request limit reached (code 4)', 'Instagram weigert /<id>: Please retry your request later. (code 2)'].entries()) {
      const map = zandbak('verbinding-' + i, { planning: [reelAnder('kanaal-2', 'k2', 'K2-W06', m), reelK1('YS50', m)], accounts: { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], sleutelFout: fout } } });
      const r = draai(map, geheimen(VIER));
      gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
      gelijk(r.plaatsingen.map(p => p.account), ['kanaal-1'], 'kanaal 1 gaat door');
      waar(!bestaat(path.join(map, 'waarschuwingen')), `geen melding bij "${fout}"`);
      gelijk(lees(map, 'status.json').accounts['kanaal-2'].stand, 'geen verbinding', 'stand');
      geenLek(alleUitvoer(map, r));
    }
  });

  await toets('een item dat niet klopt (tijd "18.00", geen beeld, vreemde soort) wordt niet geplaatst en niet "nu" geplaatst', () => {
    const m = amsterdam(4);
    const planning = [
      { ...reelAnder('kanaal-2', 'k2', 'K2-W01', m), tijd: '18.00' },
      { ...reelAnder('kanaal-2', 'k2', 'K2-W02', m), datum: '2026-02-30' },
      { ...reelAnder('account-3', 'k3', 'G01', m), beeld: [] },
      { ...reelAnder('account-3', 'k3', 'G02', m), soort: 'reel' },
      { ...reelK1('YS50', m), taal: undefined },                       // geen taal: dat is geen reden om niet te plaatsen
      reelK1('YS51', m),
      null,
    ];
    const map = zandbak('ongeldig', { planning });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.urls[0]), [`${PAGES}/pakketten/2026-12-15-YS50-proef/instagram/reel.mp4`, `${PAGES}/pakketten/2026-12-15-YS51-proef/instagram/reel.mp4`], 'alleen de goede items');
    const s = lees(map, 'status.json');
    gelijk([s.stand, s.accounts['kanaal-2'].stand, s.accounts['account-3'].stand, s.accounts['kanaal-1'].stand], ['staat stil', 'item mislukt', 'item mislukt', 'in orde'], 'standen');
    bevat(s.accounts['kanaal-2'].bericht, 'de tijd "18.00" klopt niet', 'bericht');
    bevat(s.accounts['account-3'].bericht, 'het beeld ontbreekt', 'bericht');
    // een tweede run verandert niets en blijft groen: geen mail per tien minuten
    const voor = fs.readFileSync(path.join(map, 'status.json'), 'utf8');
    const r2 = draai(map, geheimen(VIER));
    gelijk([r2.code, r2.plaatsingen.length, fs.readFileSync(path.join(map, 'status.json'), 'utf8') === voor], [0, 0, true], 'tweede run');
  });

  await toets('een item met een account dat niet bestaat wordt niet geplaatst; de rest gaat door', () => {
    const m = amsterdam(4);
    const map = zandbak('vreemd', { planning: [{ ...reelK1('YS50', m), account: 'kanaal-9' }, reelK1('YS51', m)] });
    const r = draai(map, geheimen(VIER));
    gelijk([r.code, r.plaatsingen.length], [0, 1], 'run\n' + r.uit);
    const s = lees(map, 'status.json');
    gelijk(s.stand, 'staat stil', 'stand');
    bevat(s.bericht, '1 item(s) in planning.json noemen een account dat niet in src/accounts.cjs staat (kanaal-9)', 'bericht');
    bevat(s.bericht, 'De rest gaat gewoon door.', 'bericht');
  });

  await toets('een onleesbaar gedaan.json of planning.json: er wordt niets geplaatst (nooit alles opnieuw)', () => {
    const m = amsterdam(4);
    const map = zandbak('onleesbaar', { planning: [reelK1('YS50', m)] });
    fs.writeFileSync(path.join(map, 'gedaan.json'), '{"items": [ {"id": "x"}\n<<<<<<< HEAD\n');
    const r = draai(map, geheimen(VIER));
    gelijk([r.code, r.plaatsingen.length], [1, 0], 'eerste run: rood en niets geplaatst\n' + r.uit);
    const s = lees(map, 'status.json');
    gelijk(s.stand, 'staat stil', 'stand');
    bevat(s.bericht, 'gedaan.json is niet te lezen', 'bericht');
    bevat(fs.readFileSync(path.join(map, 'gedaan.json'), 'utf8'), '<<<<<<< HEAD', 'het kapotte bestand is niet overschreven');
    const r2 = draai(map, geheimen(VIER));
    gelijk([r2.code, r2.plaatsingen.length], [0, 0], 'tweede run: niets geplaatst, geen tweede mail');
    const map2 = zandbak('onleesbaar-2', { planning: [] });
    fs.writeFileSync(path.join(map2, 'planning.json'), '{"items": "geen lijst"}');
    const r3 = draai(map2, geheimen(VIER));
    gelijk([r3.code, r3.plaatsingen.length, lees(map2, 'status.json').stand], [1, 0, 'staat stil'], 'planning zonder lijst');
    // ontbreekt gedaan.json (allereerste run), dan is dat gewoon een leeg logboek
    const map3 = zandbak('onleesbaar-3', { planning: [reelK1('YS50', m)] });
    fs.rmSync(path.join(map3, 'gedaan.json'));
    const r4 = draai(map3, geheimen(VIER));
    gelijk([r4.code, r4.plaatsingen.length, lees(map3, 'gedaan.json').items.length], [0, 1, 1], 'zonder gedaan.json');
  });

  await toets('te laat is te laat: overgeslagen en bewaard, per item met de eigen inhaaltijd', () => {
    const map = zandbak('te-laat', { planning: [fotoY('y-7-uur', amsterdam(7 * 60)), reelAnder('kanaal-2', 'k2', 'K2-W06', amsterdam(7 * 60)), reelAnder('kanaal-2', 'k2', 'K2-W07', amsterdam(19 * 60))] });
    const r = draai(map, geheimen(VIER));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.urls[0]), [`${PAGES}/beeld/kanaal-2/K2-W06.mp4`], 'alleen het item binnen zijn inhaaltijd');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.resultaat), ['overgeslagen', 'overgeslagen', 'geplaatst'], 'gedaan');
  });

  await toets('--proef: geen netwerk, er wordt niets geschreven, ook zonder sleutels', () => {
    const m = amsterdam(4);
    const map = zandbak('proef', { planning: [reelK1('YS50', m), reelAnder('kanaal-2', 'k2', 'K2-W06', m), fotoY('y-te-laat', amsterdam(60 * 30))], status: { stand: 'in orde', bericht: 'x', sinds: '2026-11-01 10:00' } });
    const voor = ['planning.json', 'gedaan.json', 'status.json'].map(f => fs.readFileSync(path.join(map, f), 'utf8'));
    for (const env of [{}, geheimen(['kanaal-1'])]) {
      const r = draai(map, { ...env, REPO_RAW: '' }, ['--proef']);
      gelijk([r.code, r.aanroepen.length], [0, 0], 'proefdraai\n' + r.uit);
      gelijk(['planning.json', 'gedaan.json', 'status.json'].map(f => fs.readFileSync(path.join(map, f), 'utf8')), voor, 'bestanden ongewijzigd');
      waar(!bestaat(path.join(map, 'sleutel.json')) && !bestaat(path.join(map, 'waarschuwingen')), 'geen sleutel.json of meldingen');
      bevat(r.uit, `bericht EN ${m.datum}-k1-ys50 (kanaal-1)`, 'het item staat in de uitvoer');
      bevat(r.uit, 'dit account is niet ingesteld; het item zou wachten', 'kanaal 2 zonder sleutel');
    }
  });

  await toets('de proefknop werkt voor elk account uit de tabel, met de sleutel van dat account, en plaatst niets', () => {
    const map = zandbak('proefknop', {});
    for (const acc of ['kanaal-1', 'kanaal-2', 'account-3']) {
      const r = draai(map, geheimen(VIER), ['--proefvideo', 'https://voorbeeld.github.io/automaat/beeld/x/reel.mp4', '--proefomslag', 'https://voorbeeld.github.io/x.jpg', '--proefms', '800', '--account', acc]);
      gelijk(r.code, 0, `proef op ${acc}\n${r.uit}`);
      gelijk(r.aanroepen.map(a => [a.wat, a.account]), [['wieBenIk', acc], ['proefVideo', acc]], 'eerst de sleutel, dan de proef, op het goede account');
      bevat(r.uit, 'Niet gepubliceerd.', 'uitvoer');
      geenLek(r.uit);
    }
    waar(!bestaat(path.join(map, 'status.json')) && lees(map, 'gedaan.json').items.length === 0, 'een proef schrijft geen status en geen logboek');
    const zonder = draai(map, geheimen(VIER), ['--proefvideo', 'https://x/y.mp4']);
    gelijk(zonder.aanroepen.map(a => a.account), ['ygdigital', 'ygdigital'], 'zonder --account: het eerste account');
    const onbekend = draai(map, geheimen(VIER), ['--proefvideo', 'https://x/y.mp4', '--account', 'kanaal-9']);
    gelijk([onbekend.code, onbekend.aanroepen.length], [1, 0], 'onbekend account');
    bevat(onbekend.uit, 'kies uit ygdigital, kanaal-1, kanaal-2, account-3', 'uitvoer');
    const nietIngesteld = draai(map, geheimen(['kanaal-1']), ['--proefvideo', 'https://x/y.mp4', '--account', 'kanaal-2']);
    gelijk([nietIngesteld.code, nietIngesteld.aanroepen.length], [1, 0], 'account zonder sleutel');
    const geweigerd = zandbak('proefknop-2', { accounts: { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], faal: [{ bevat: 'y.mp4', melding: 'Instagram weigert /<id>/media: The video of <gebruiker> could not be fetched (code 9004)' }] } } });
    const rg = draai(geweigerd, geheimen(VIER), ['--proefvideo', 'https://x/y.mp4', '--account', 'kanaal-2']);
    gelijk(rg.code, 1, 'geweigerde proef');
    bevat(rg.uit, 'Geweigerd: Instagram weigert /<kanaal-2>/media: The video of <kanaal-2> could not be fetched', 'uitvoer zonder nummer en naam');
    geenLek(rg.uit);
    // werkt de sleutel niet, dan stopt de proef daar al (en zegt hij niets over de video)
    const dood = zandbak('proefknop-3', { accounts: { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], sleutelFout: 'Instagram weigert /<id>: Error validating access token for @<gebruiker> (code 190)' } } });
    const rd = draai(dood, geheimen(VIER), ['--proefvideo', 'https://x/y.mp4', '--account', 'kanaal-2']);
    gelijk([rd.code, rd.aanroepen.map(a => a.wat)], [1, ['wieBenIk']], 'proef met een sleutel die niet werkt');
    geenLek(rd.uit);
  });

  await toets('niets ingesteld: netjes stoppen, stand "niet ingesteld", geen fout', () => {
    const map = zandbak('niets', { planning: [reelK1('YS50', amsterdam(4))] });
    const r = draai(map, {});
    gelijk([r.code, r.aanroepen.length], [0, 0], 'run\n' + r.uit);
    const s = lees(map, 'status.json');
    gelijk([s.stand, s.bericht], ['niet ingesteld', 'De sleutel of het accountnummer ontbreekt bij de instellingen van de repo.'], 'bovenste regel zoals altijd');
    gelijk(Object.values(s.accounts).map(a => a.stand), ['niet ingesteld', 'niet ingesteld', 'niet ingesteld', 'niet ingesteld'], 'per account');
  });

  await toets('een vijfde account is één regel in de tabel en twee geheimen', () => {
    const tabel = fs.readFileSync(path.join(WORTEL, 'src', 'accounts.cjs'), 'utf8');
    const regel = "  { naam: 'account-4', label: 'account 4', kort: 'k4', geheim: 'IG_TOKEN_K4', geheimId: 'IG_USER_ID_K4', codes: /^V\\d+$/, voorbeeld: 'V01', keuringen: ['pakket'], maker: 'Nieuw', taal: 'en' },\n];";
    waar(tabel.includes('\n];'), 'het einde van de tabel is niet gevonden');
    const metVijf = tabel.replace('\n];', '\n' + regel);
    const vijfde = { naam: 'account-4', id: '17841400000000044', token: 'IGnep.sleutel-accountvier-5555555555', gebruiker: 'nepaccountvier' };
    const m = amsterdam(4);
    const map = zandbak('vijfde', { planning: [reelAnder('account-4', 'k4', 'V01', m), reelK1('YS50', m)], accounts: { ...NEP, 'account-4': vijfde }, bron: { accounts: metVijf } });
    const env = { ...geheimen(['kanaal-1']), IG_GEHEIMEN: JSON.stringify({ IG_TOKEN_K4: vijfde.token, IG_USER_ID_K4: vijfde.id }) };
    const r = draai(map, env);
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(r.plaatsingen.map(p => [p.account, p.urls[0]]), [['account-4', `${PAGES}/beeld/account-4/V01.mp4`], ['kanaal-1', `${PAGES}/pakketten/2026-12-15-YS50-proef/instagram/reel.mp4`]], 'plaatsingen');
    gelijk(lees(map, 'status.json').accounts['account-4'], { naam: 'account 4', stand: 'in orde', bericht: 'Verbonden.', sinds: lees(map, 'status.json').accounts['account-4'].sinds }, 'stand van het nieuwe account');
    waar(lees(map, 'sleutel.json')['account-4'].afdruk, 'sleutelteller van het nieuwe account');
    for (const veld of ['id', 'token', 'gebruiker']) bevatNiet(alleUitvoer(map, r), vijfde[veld], `lek van ${veld} van het nieuwe account`);
  });

  await toets('het echte planning.json en gedaan.json van nu: elk open item klopt en hoort bij een bekend account', () => {
    const T = require(path.join(WORTEL, 'src', 'accounts.cjs'));
    const planning = leesJson(path.join(WORTEL, 'planning.json')), gedaan = leesJson(path.join(WORTEL, 'gedaan.json'));
    const klaar = new Set(gedaan.items.map(i => i.id));
    const open = planning.items.filter(i => !klaar.has(i.id));
    for (const i of planning.items) waar(T.zoek(T.accountVan(i)), `item ${i.id} noemt een onbekend account`);
    // dezelfde controle als in plaatsen.cjs, via een proefdraai in een zandbak met de echte bestanden
    const map = zandbak('echt', {});
    fs.copyFileSync(path.join(WORTEL, 'planning.json'), path.join(map, 'planning.json'));
    fs.copyFileSync(path.join(WORTEL, 'gedaan.json'), path.join(map, 'gedaan.json'));
    const r = draai(map, {}, ['--proef']);
    gelijk(r.code, 0, 'proefdraai\n' + r.uit);
    bevatNiet(r.uit, 'wordt niet geplaatst', 'geen enkel open item is ongeldig');
    console.log(`        (${planning.items.length} items, ${open.length} open)`);
  });
}

// =================================================================================
(async () => {
  const delen = [['plaatsen', deelPlaatsen]];
  for (const [naam, fn] of delen) {
    if (!doetMee(naam)) continue;
    deelNu = naam;
    console.log(`\n${naam}`);
    await fn();
  }
  const fout = uitslag.filter(u => u.fout);
  console.log(`\n${uitslag.length - fout.length} goed, ${fout.length} fout (van ${uitslag.length})`);
  if (process.env.YG_TOETS_BEWAAR) console.log(`zandbak bewaard: ${TMP}`);
  else fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(fout.length ? 1 : 0);
})();
