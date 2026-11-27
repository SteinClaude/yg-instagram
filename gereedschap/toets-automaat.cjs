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
//   * plangereedschap   plan-reel.cjs en plan-carrousel.cjs met de tabel (alleen als het pakket sharp er is: npm ci).
// Er gaat niets naar Instagram of GitHub. Alles staat in een tijdelijke map die na afloop wordt weggehaald
// (bewaren: zet YG_TOETS_BEWAAR=1).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const WORTEL = path.join(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'yg-toets-'));
// Git in de toetsen leest geen instellingen van deze computer (ondertekenen, een proxy): overal dezelfde uitkomst.
fs.writeFileSync(path.join(TMP, 'gitconfig-leeg'), '');
process.env.GIT_CONFIG_GLOBAL = path.join(TMP, 'gitconfig-leeg');
process.env.GIT_CONFIG_NOSYSTEM = '1';
for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete process.env[k];
const ALLEEN = process.argv.slice(2).filter(a => !a.startsWith('--'));
const doetMee = deel => !ALLEEN.length || ALLEEN.some(a => deel.startsWith(a));

// --- kleine toetsbank -----------------------------------------------------------
const uitslag = [];
let deelNu = '';
async function toets(naam, fn) {
  try { await fn(); uitslag.push({ deel: deelNu, naam, fout: null }); console.log(`  goed  ${naam}`); }
  catch (e) {
    uitslag.push({ deel: deelNu, naam, fout: e });
    console.log(`  FOUT  ${naam}\n        ${String(e && e.stack ? e.stack : e).split('\n').slice(0, 30).join('\n        ')}`);
  }
}
const waar = (v, wat) => { if (!v) throw new Error(wat); };
const gelijk = (kreeg, verwacht, wat) => {
  const x = JSON.stringify(kreeg), y = JSON.stringify(verwacht);
  if (x === y) return;
  const [kop, ...rest] = String(wat).split('\n');                 // eerst wat er afwijkt, dan pas de uitvoer die erbij hoort
  throw new Error(`${kop}\n   verwacht: ${y}\n   kreeg:    ${x}${rest.length ? '\n' + rest.join('\n') : ''}`);
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
  if (a.stopBij && urls.some(u => u.includes(a.stopBij))) {   // de run wordt hier afgebroken, zoals bij de tijdsgrens van de workflow
    log({ wat: 'afgebroken', account: a.naam, urls });
    process.kill(process.pid, 'SIGKILL');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10000);
  }
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

  await toets('een run die halverwege wordt afgebroken (de tijdsgrens): wat al geplaatst is staat heel in gedaan.json, de volgende start plaatst alleen de rest', () => {
    const m = amsterdam(4);
    const planning = [reelK1('YS60', m), reelAnder('kanaal-2', 'k2', 'K2-A01', m), reelAnder('account-3', 'k3', 'G21', m)];
    const accounts = { ...NEP, 'kanaal-2': { ...NEP['kanaal-2'], stopBij: 'K2-A01' } };
    const map = zandbak('afgebroken', { planning, accounts });
    const r = draai(map, geheimen(VIER));
    waar(r.code !== 0, 'de run is afgebroken, dus geen nette afsluiting\n' + r.uit);
    gelijk(r.plaatsingen.map(p => p.account), ['kanaal-1'], 'vóór het afbreken is alleen kanaal 1 geplaatst');
    waar(r.aanroepen.some(a => a.wat === 'afgebroken' && a.account === 'kanaal-2'), 'afgebroken tijdens de post van kanaal 2');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.id), [`${m.datum}-k1-ys60`], 'gedaan.json is heel en bevat wat al geplaatst is');
    gelijk(fs.readdirSync(map).filter(f => f.endsWith('.tmp')), [], 'geen half geschreven bestand');

    // de volgende start: kanaal 1 niet nog eens, de twee andere wel
    fs.writeFileSync(path.join(map, 'scenario.json'), JSON.stringify({ accounts: NEP }));
    const r2 = draai(map, geheimen(VIER));
    gelijk(r2.code, 0, 'de volgende start is groen\n' + r2.uit);
    gelijk(r2.plaatsingen.map(p => p.account), ['kanaal-2', 'account-3'], 'alleen wat nog niet geplaatst was');
    gelijk(lees(map, 'gedaan.json').items.map(i => i.id), [`${m.datum}-k1-ys60`, `${m.datum}-k2-k2-a01`, `${m.datum}-k3-g21`], 'alles staat er nu precies één keer in');
    gelijk(fs.readdirSync(map).filter(f => f.endsWith('.tmp')), [], 'ook na een gewone run blijft er geen hulpbestand achter');
    geenLek(alleUitvoer(map, r) + alleUitvoer(map, r2));
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
// inplannen.cjs: een nagemaakte "GitHub" (een kale git-map), een kloon "op de pc" waar het commando in staat, en
// de map van een maker met een pakket. De proefvideo's maakt ffmpeg hier ter plekke (klein, een paar seconden).
let MEDIA = null;
function maakMedia() {
  if (MEDIA) return MEDIA;
  const m = path.join(TMP, 'media');
  fs.mkdirSync(m, { recursive: true });
  const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  const beeld = (maat = '1080x1920') => ['-f', 'lavfi', '-i', `testsrc2=size=${maat}:rate=30:duration=3.2`];
  const toon = (hz = 48000) => ['-f', 'lavfi', '-i', `sine=frequency=440:sample_rate=${hz}:duration=3.2`];
  const x264 = (pix = 'yuv420p') => ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '40', '-pix_fmt', pix];
  const netjes = ['-movflags', '+faststart', '-use_editlist', '0'];
  ff([...beeld(), ...toon(), ...x264(), '-c:a', 'aac', '-b:a', '128k', '-ac', '2', ...netjes, path.join(m, 'goed.mp4')]);
  ff([...beeld(), ...toon(96000), ...x264(), '-c:a', 'aac', '-ar', '96000', '-ac', '2', path.join(m, 'geluid-96k.mp4')]);     // 96 kHz, moov achteraan, edit list
  ff([...beeld('720x1280'), ...toon(), ...x264(), '-c:a', 'aac', ...netjes, path.join(m, 'te-klein.mp4')]);
  ff([...beeld(), ...toon(), ...x264('yuv444p'), '-c:a', 'aac', ...netjes, path.join(m, 'kleur-444.mp4')]);
  ff([...beeld(), ...x264(), '-an', ...netjes, path.join(m, 'stil.mp4')]);
  ff(['-f', 'lavfi', '-i', 'testsrc2=size=1080x1920:rate=1', '-frames:v', '1', '-q:v', '6', path.join(m, 'omslag.jpg')]);
  ff(['-f', 'lavfi', '-i', 'testsrc2=size=1080x1350:rate=1', '-frames:v', '1', '-q:v', '6', path.join(m, 'omslag-4x5.jpg')]);
  ff(['-f', 'lavfi', '-i', 'testsrc2=size=1080x1920:rate=1', '-frames:v', '1', path.join(m, 'plaatje.png')]);
  fs.copyFileSync(path.join(m, 'plaatje.png'), path.join(m, 'png-als.jpg'));
  return (MEDIA = m);
}
const media = naam => path.join(maakMedia(), naam);
const gitRuw = (map, args) => execFileSync('git', args, { cwd: map, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
const WIE = ['-c', 'user.name=Toets', '-c', 'user.email=toets@voorbeeld.invalid'];

// De nagemaakte automaat: origin.git (wat op GitHub staat) en pc (de kloon waar het commando in staat).
function nepAutomaat(naam, { planning = [], gedaan = [], status = null, bestanden = {} } = {}) {
  const basis = path.join(TMP, naam), bron = path.join(basis, 'bron'), origin = path.join(basis, 'origin.git'), pc = path.join(basis, 'pc');
  for (const d of ['gereedschap', 'src', 'mini', 'beeld']) fs.mkdirSync(path.join(bron, d), { recursive: true });
  fs.copyFileSync(path.join(WORTEL, 'gereedschap', 'inplannen.cjs'), path.join(bron, 'gereedschap', 'inplannen.cjs'));
  fs.copyFileSync(path.join(WORTEL, 'src', 'accounts.cjs'), path.join(bron, 'src', 'accounts.cjs'));
  fs.copyFileSync(path.join(WORTEL, '.gitattributes'), path.join(bron, '.gitattributes'));
  fs.writeFileSync(path.join(bron, 'planning.json'), JSON.stringify({ tijdzone: 'Europe/Amsterdam', gemaakt: '2026-09-20', items: planning }, null, 2) + '\n');
  fs.writeFileSync(path.join(bron, 'gedaan.json'), JSON.stringify({ items: gedaan }, null, 1));
  if (status) fs.writeFileSync(path.join(bron, 'status.json'), JSON.stringify(status, null, 1));
  fs.writeFileSync(path.join(bron, 'mini', 'bestaand.jpg'), 'een bestaand kleintje');
  fs.writeFileSync(path.join(bron, 'beeld', 'bestaand.jpg'), 'een bestaande plaat');
  for (const [pad, inhoud] of Object.entries(bestanden)) { fs.mkdirSync(path.dirname(path.join(bron, pad)), { recursive: true }); if (typeof inhoud === 'string' && bestaat(inhoud)) fs.copyFileSync(inhoud, path.join(bron, pad)); else fs.writeFileSync(path.join(bron, pad), inhoud); }
  git(bron, ['init', '-q', '-b', 'main']); git(bron, ['add', '-A']); git(bron, [...WIE, 'commit', '-q', '-m', 'begin']);
  git(basis, ['clone', '-q', '--bare', bron, origin]);
  git(origin, ['config', 'uploadpack.allowFilter', 'true']); git(origin, ['config', 'uploadpack.allowAnySHA1InWant', 'true']);
  const url = 'file://' + origin.split(path.sep).join('/');
  git(basis, ['clone', '-q', url, pc]);
  git(pc, ['config', 'user.name', 'Pc van de toets']); git(pc, ['config', 'user.email', 'pc@voorbeeld.invalid']);
  fs.mkdirSync(path.join(basis, 'maker'), { recursive: true });
  return { basis, origin, pc, url, maker: path.join(basis, 'maker'), commando: path.join(pc, 'gereedschap', 'inplannen.cjs') };
}
const kopVan = a => git(a.origin, ['rev-parse', 'main']);
const planningOp = a => JSON.parse(gitRuw(a.origin, ['show', 'main:planning.json']));
const lijstOp = (a, commit = 'main') => git(a.origin, ['ls-tree', '-r', '--name-only', commit]).split('\n');
const gewijzigdIn = (a, commit = 'main') => git(a.origin, ['diff-tree', '-r', '--no-commit-id', '--name-status', commit]).split('\n').map(r => r.replace('\t', ' ')).sort();
const aantalCommits = a => Number(git(a.origin, ['rev-list', '--count', 'main']));

const isoGeleden = min => new Date(Date.now() - min * 60000).toISOString().replace(/\.\d+Z$/, '+00:00');
const besluit = (soort, uitkomst, tekst, minGeleden, extra = {}) => ({ soort, uitkomst, tekst, tijd: isoGeleden(minGeleden), via: 'paneel', door: 'Andries', ...extra });
// Een pakket in de map van de maker: pakket.json, keuring.json en bijschrift.txt.
function maakPakket(a, code, { besluiten = [besluit('pakket', 'ok', `pakket OK ${code}`, 90)], vraagt, bijschrift, keuringCode, zonderKeuring = false } = {}) {
  const map = path.join(a.maker, 'pakketten', code);
  fs.mkdirSync(map, { recursive: true });
  fs.writeFileSync(path.join(map, 'pakket.json'), JSON.stringify({ code, titel: `Titel van ${code}`, soort: 'short', ...(vraagt ? { vraagt } : {}) }, null, 2));
  if (!zonderKeuring) fs.writeFileSync(path.join(map, 'keuring.json'), JSON.stringify({ code: keuringCode || code, besluiten }, null, 2));
  fs.writeFileSync(path.join(map, 'bijschrift.txt'), bijschrift !== undefined ? bijschrift : `Why does ${code} exist?\r\n\r\nBecause every test needs a caption. The U.S. had one at 3.5 p.m.\r\n\r\nSource: a museum (2024).\r\n\r\n#test #everydaythings\r\n`);
  return map;
}
const MORGEN = () => amsterdam(-60 * 30).datum;
function argumenten(a, account, code, { video = 'goed.mp4', omslag = 'omslag.jpg', datum = MORGEN(), tijd = '18:00', extra = [] } = {}) {
  const map = path.join(a.maker, 'pakketten', code);
  return ['--account', account, '--pakket', map, '--video', media(video), '--omslag', media(omslag), '--bijschrift', path.join(map, 'bijschrift.txt'), '--datum', datum, '--tijd', tijd, ...extra];
}
function plan(a, args, env = {}) {
  const r = spawnSync(process.execPath, [a.commando, ...args], { cwd: a.maker, env: { ...process.env, YG_VERBODEN_WOORDEN: '', ...env }, encoding: 'utf8' });
  return { code: r.status, uit: `${r.stdout}${r.stderr}` };
}
// Een run die niets mag veranderen: de stand op "GitHub" en de kloon op de pc blijven precies gelijk.
function ongewijzigd(a, voor, wat) {
  gelijk(kopVan(a), voor, `${wat}: er is toch iets vastgelegd`);
  gelijk(git(a.pc, ['status', '--porcelain']), '', `${wat}: de kloon op de pc is gewijzigd`);
}

async function deelInplannen() {
  const I = require(path.join(WORTEL, 'gereedschap', 'inplannen.cjs'));
  try { maakMedia(); } catch (e) { await toets('ffmpeg maakt de proefvideo\'s', () => { throw new Error('ffmpeg ontbreekt of kan geen H.264 maken: ' + e.message); }); return; }

  await toets('keuring: het laatste besluit per soort telt; niet-ok, ingetrokken en een nieuwe vraag zijn geen OK', () => {
    const k = (besluiten, soorten = ['pakket'], vraagt) => I.beoordeelKeuring({ code: 'X', vraagt }, { code: 'X', besluiten }, soorten).map(r => r.ok);
    const reden = (besluiten, vraagt) => I.beoordeelKeuring({ code: 'X', vraagt }, { code: 'X', besluiten }, ['pakket'])[0].reden;
    gelijk(k([besluit('pakket', 'ok', 'pakket OK X', 60)]), [true], 'gewoon OK');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60, { via: 'sessie' })]), [true], 'OK uit de sessie');
    gelijk(k([]), [false], 'geen besluit');
    gelijk(k([besluit('script', 'ok', 'script OK X', 60)]), [false], 'alleen een script OK is geen pakket OK');
    gelijk(k([besluit('pakket', 'ok', 'OK', 90), besluit('pakket', 'niet-ok', 'nee', 30, { opmerking: 'de stem' })]), [false], 'daarna niet OK');
    bevat(reden([besluit('pakket', 'ok', 'OK', 90), besluit('pakket', 'niet-ok', 'nee', 30, { opmerking: 'de stem' })]), 'niet OK', 'reden');
    gelijk(k([besluit('pakket', 'ok', 'OK', 90), besluit('pakket', 'ingetrokken', 'toch niet', 30)]), [false], 'ingetrokken');
    bevat(reden([besluit('pakket', 'ok', 'OK', 90), besluit('pakket', 'ingetrokken', 'toch niet', 30)]), 'ingetrokken', 'reden');
    gelijk(k([besluit('pakket', 'niet-ok', 'nee', 90), besluit('pakket', 'ok', 'nu wel', 30)]), [true], 'eerst niet OK, daarna OK');
    gelijk(k([besluit('pakket', 'ok', 'OK', 90), besluit('pakket', 'ingetrokken', 'x', 60), besluit('pakket', 'ok', 'opnieuw OK', 30)]), [true], 'ingetrokken en daarna opnieuw OK');
    gelijk(k([besluit('pakket', 'ok', 'OK', 30), besluit('pakket', 'niet-ok', 'nee', 90)]), [false], 'volgorde en tijd spreken elkaar tegen');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60)], ['pakket'], { pakket: isoGeleden(120) }), [true], 'de vraag was van vóór het OK');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60)], ['pakket'], { pakket: isoGeleden(10) }), [false], 'opnieuw gevraagd na het OK');
    bevat(reden([besluit('pakket', 'ok', 'OK', 60)], { pakket: isoGeleden(10) }), 'nieuwe vraag', 'reden');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60)], ['pakket'], { bijschrift: isoGeleden(10) }), [true], 'een nieuwe vraag van een andere soort telt niet');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60, { door: 'Finn' })]), [false], 'niet van Andries');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60, { door: undefined })]), [false], 'zonder "door"');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60, { via: 'ploegoverzicht' })]), [false], 'een keuring komt nooit via het Ploegoverzicht');
    gelijk(k([besluit('pakket', 'ok', '  ', 60)]), [false], 'zonder woorden');
    gelijk(k([besluit('pakket', 'ok', 'OK', -60)]), [false], 'een tijd in de toekomst');
    gelijk(k([{ soort: 'pakket', uitkomst: 'ok', tekst: 'OK', tijd: 'gisteren', via: 'paneel', door: 'Andries' }]), [false], 'onleesbare tijd');
    gelijk(k([besluit('pakket', 'OK', 'OK', 60)]), [false], 'uitkomst moet precies "ok" zijn');
    gelijk(k([besluit('pakket', 'ok', 'Beide OK', 60), besluit('bijschrift', 'ok', 'Beide OK', 60)], ['pakket', 'bijschrift']), [true, true], 'twee soorten');
    gelijk(k([besluit('pakket', 'ok', 'OK', 60)], ['pakket', 'bijschrift']), [true, false], 'bijschrift ontbreekt');
    gelijk(I.beoordeelKeuring({}, { besluiten: 'x' }, ['pakket'])[0].ok, false, 'geen lijst');
    gelijk(I.beoordeelKeuring({}, null, ['pakket'])[0].ok, false, 'geen keuring');
  });

  await toets('bijschrift: lengte, hashtags, geen @naam, geen link, geen domeinnaam (tenzij als bron genoemd), geen verboden woord', () => {
    const f = (t, o) => I.controleerBijschrift(t, o).fouten;
    gelijk(f('Why is a stop sign an octagon?\n\nIn the 1920s, U.S. engineers (e.g. in the U.S.A.) met at 3.5 p.m. No.1 rule... wait...what?\n\nSource: a museum (2024).\n\n#history #design'), [], 'een gewoon bijschrift');
    gelijk(f('The @ sign is old. People write @. or (@) for it.'), [], 'het teken @ zelf mag');
    waar(f('Follow @iemand for more').length === 1, 'een handle');
    waar(f('Mail naar iemand@example.com').length === 1, 'een e-mailadres');
    waar(f('Lees meer op https://example.com/pagina').length === 1, 'een link');
    waar(f('Lees meer op www.example.com').length === 1, 'een link met www');
    waar(f('Sources: Dictionary.com (2021).').length === 1, 'een domeinnaam');
    gelijk(f('Sources: Dictionary.com (2021); timeanddate.com.', { bron: ['dictionary.com', 'timeanddate.com'] }), [], 'domeinnamen die als bron zijn genoemd');
    gelijk(I.controleerBijschrift('Sources: Dictionary.com.', { bron: ['dictionary.com'] }).bronnen, ['dictionary.com'], 'de bron komt in het verslag');
    gelijk(f('Photo: Jan Jansen, CC BY 4.0, https://commons.wikimedia.org/wiki/File:X.jpg', { bron: ['commons.wikimedia.org'] }), [], 'een bronlink die is genoemd');
    waar(f('Zie https://youtube.com/watch?v=1', { bron: ['youtube.com'] }).length >= 1, 'een eigen platform mag nooit, ook niet als bron');
    waar(f('Zie linktr.ee/iets', { bron: ['linktr.ee'] }).length >= 1, 'een doorverwijzer mag nooit');
    waar(f('').length === 1 && f('  \n ').length === 1, 'leeg');
    waar(f('x'.repeat(2201)).length === 1 && f('x'.repeat(2200)).length === 0, '2200 tekens');
    waar(f('tekst ' + '#a '.repeat(31)).length === 1 && f('tekst ' + '#a '.repeat(30)).length === 0, '30 hashtags');
    const lijst = { regels: [{ nr: 1, woord: 'Nep Kanaal' }, { nr: 2, woord: 'ab' }, { nr: 3, woord: 'nepkanaaltwee' }] };
    bevat(f('Welcome to nep kanaal!', { verboden: lijst })[0], 'regel 1', 'verboden woord, andere hoofdletters');
    bevat(f('Welcome to NepKanaal!', { verboden: lijst })[0], 'regel 1', 'verboden woord, aan elkaar');
    bevat(f('Welcome to nep-kanaal-twee!', { verboden: lijst })[0], 'regel 1, 3 van die lijst', 'verboden woord, met streepjes (past op twee regels van de lijst)');
    gelijk(f('About a cab and a lab.', { verboden: lijst }), [], 'een woord van twee letters op de lijst doet niets');
    bevatNiet(f('Welcome to nep kanaal!', { verboden: lijst })[0], 'Nep Kanaal', 'de melding noemt het woord zelf niet');
    gelijk(I.controleerBijschrift('﻿Eerste regel\r\nTweede\r\n\r\n').tekst, 'Eerste regel\nTweede', 'BOM en Windows-regeleinden eruit');
    gelijk(I.openbaar('pakket OK K2-W06 voor Nep Kanaal, zie @iemand en https://x.nl/y', lijst), 'pakket OK K2-W06 voor [weggelaten], zie [weggelaten] en [weggelaten]', 'een citaat voor een openbare commit');
  });

  await toets('video en omslag: wat klopt, wat de Instagram-versie oplost en wat niet kan', () => {
    const goed = I.onderzoekVideo(media('goed.mp4'));
    gelijk([goed.vast, goed.herstelbaar], [[], []], 'de goede video');
    const k96 = I.onderzoekVideo(media('geluid-96k.mp4'));
    gelijk(k96.vast, [], '96 kHz: niets wat niet kan');
    waar(k96.herstelbaar.some(x => x.includes('96000 Hz')) && k96.herstelbaar.some(x => x.includes('moov')) && k96.herstelbaar.some(x => x.includes('edit list')), '96 kHz, moov achteraan en edit list zijn herstelbaar: ' + JSON.stringify(k96.herstelbaar));
    waar(I.onderzoekVideo(media('te-klein.mp4')).vast.some(x => x.includes('720x1280')), 'verkeerde maat');
    waar(I.onderzoekVideo(media('kleur-444.mp4')).vast.some(x => x.includes('4:2:0')), 'geen 4:2:0');
    waar(I.onderzoekVideo(media('stil.mp4')).vast.some(x => x.includes('geen geluidsspoor')), 'geen geluid');
    waar(I.onderzoekVideo(media('goed.mp4'), 0.01).vast.some(x => x.includes('hoogstens 0.01 MB')), 'te groot voor de repo');
    gelijk(I.mp4Opbouw(media('goed.mp4')).moovVooraan, true, 'moov vooraan');
    gelijk(I.mp4Opbouw(media('geluid-96k.mp4')).moovVooraan, false, 'moov achteraan');
    gelijk(I.onderzoekOmslag(media('omslag.jpg')).fouten, [], 'de goede omslag');
    waar(I.onderzoekOmslag(media('omslag-4x5.jpg')).fouten[0].includes('1080x1350'), 'omslag in de verkeerde maat');
    waar(I.onderzoekOmslag(media('png-als.jpg')).fouten[0].includes('geen JPEG'), 'een png met de naam .jpg');
  });

  await toets('goed pakket: één item erbij, alleen de eigen paden, het OK van Andries in de commit, de pc-kloon onaangeroerd', () => {
    const bestaand = [reelK1('YS50', { datum: MORGEN(), tijd: '12:00' }), reelK1('YS51', { datum: MORGEN(), tijd: '20:00' })];
    const a = nepAutomaat('goed', { planning: bestaand });
    maakPakket(a, 'K2-W06');
    const voor = kopVan(a), pcVoor = git(a.pc, ['rev-parse', 'HEAD']);
    const r = plan(a, argumenten(a, 'kanaal-2', 'K2-W06', { extra: ['--naschrift', 'Co-Authored-By: Iemand <iemand@voorbeeld.invalid>'] }));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(aantalCommits(a), 2, 'precies één commit erbij');
    gelijk(git(a.origin, ['rev-parse', 'main~1']), voor, 'de nieuwe commit volgt op de oude');
    const id = `${MORGEN()}-k2-k2-w06`;
    const p = planningOp(a);
    gelijk(p.items.map(i => i.id), [bestaand[0].id, id, bestaand[1].id], 'het item staat op zijn plek, tussen 12:00 en 20:00');
    gelijk(p.items.find(i => i.id === id), { id, datum: MORGEN(), tijd: '18:00', soort: 'bericht', taal: 'en', account: 'kanaal-2', beeld: ['kanaal-2/K2-W06.mp4'], omslag: 'kanaal-2/K2-W06.jpg', omslagMs: 800,
      titel: 'Kanaal 2 K2-W06: Why does K2-W06 exist?', tekst: 'Why does K2-W06 exist?\n\nBecause every test needs a caption. The U.S. had one at 3.5 p.m.\n\nSource: a museum (2024).\n\n#test #everydaythings', inhaaluren: 18, eenmalig: true }, 'het item, in de vorm van plan-reel.cjs');
    gelijk([p.items[0], p.items[2]], bestaand, 'de items van een ander zijn onaangeroerd');
    gelijk(gitRuw(a.origin, ['show', 'main:planning.json']), JSON.stringify(p, null, 2) + '\n', 'planning.json houdt zijn opmaak');
    gelijk(gewijzigdIn(a), ['A beeld/kanaal-2/K2-W06.jpg', 'A beeld/kanaal-2/K2-W06.mp4', 'A mini/kanaal-2-K2-W06.jpg', 'M planning.json'], 'alleen de eigen paden en de planning');
    gelijk(git(a.origin, ['rev-parse', 'main:beeld/kanaal-2/K2-W06.mp4']), git(a.pc, ['hash-object', '--no-filters', media('goed.mp4')]), 'de video is precies het bestand van de maker');
    gelijk(git(a.origin, ['rev-parse', 'main:beeld/kanaal-2/K2-W06.jpg']), git(a.pc, ['hash-object', '--no-filters', media('omslag.jpg')]), 'de omslag is precies het bestand van de maker');
    waar(lijstOp(a).includes('mini/bestaand.jpg') && lijstOp(a).includes('beeld/bestaand.jpg') && lijstOp(a).includes('gereedschap/inplannen.cjs'), 'de rest van de repo staat er nog');
    const bericht = gitRuw(a.origin, ['log', '-1', '--format=%an <%ae>%n%cn%n%B', 'main']);
    bevat(bericht, 'Finn (YG Crew) <pc@voorbeeld.invalid>', 'de maker is de auteur');
    bevat(bericht, `Inplannen kanaal 2 K2-W06: Instagram ${I.leesbareDag(MORGEN())} 18:00 (pakket OK: "pakket OK K2-W06", Andries `, 'onderwerp met het letterlijke OK');
    bevat(bericht, 'Keuring pakket: "pakket OK K2-W06" · ', 'het OK met de tijd');
    bevat(bericht, 'via paneel', 'waar het OK vandaan kwam');
    bevat(bericht, 'Co-Authored-By: Iemand <iemand@voorbeeld.invalid>', 'het naschrift van de maker');
    bevat(r.uit, `{ "platform": "instagram", "stand": "ingepland", "wanneer": "${MORGEN()}T18:00:00+0`, 'de regel voor de kaart');
    gelijk([git(a.pc, ['rev-parse', 'HEAD']), git(a.pc, ['status', '--porcelain'])], [pcVoor, ''], 'de kloon op de pc is niet aangeraakt');
    waar(!bestaat(path.join(a.maker, 'pakketten', 'K2-W06', 'instagram')), 'in de map van de maker komt niets bij');

    // en de automaat kan het item plaatsen: de video via Pages onder beeld/kanaal-2/
    const nu = amsterdam(3);
    const map = zandbak('goed-plaatsen', { planning: p.items.map(i => i.id === id ? { ...i, datum: nu.datum, tijd: nu.tijd } : i) });
    const rp = draai(map, geheimen(['kanaal-2']));
    gelijk(rp.plaatsingen.map(x => [x.account, x.urls[0], x.omslag]), [['kanaal-2', `${PAGES}/beeld/kanaal-2/K2-W06.mp4`, { url: `${RAW}/beeld/kanaal-2/K2-W06.jpg`, ms: 800 }]], 'plaatsen.cjs plaatst het item');
  });

  await toets('--proef: alles nalopen en tonen, niets wijzigen', () => {
    const a = nepAutomaat('proef-plan', {});
    maakPakket(a, 'G11');
    const voor = kopVan(a);
    const r = plan(a, argumenten(a, 'account-3', 'G11', { extra: ['--proef'] }));
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    bevat(r.uit, `"id": "${MORGEN()}-k3-g11"`, 'het item wordt getoond');
    bevat(r.uit, 'Inplannen account 3 G11: Instagram', 'de commit wordt getoond');
    bevat(r.uit, '(proef: niets gewijzigd)', 'melding');
    ongewijzigd(a, voor, 'proef');
  });

  await toets('geen keuring, een keuring van een ander pakket, ingetrokken of niet OK: er wordt niets ingepland', () => {
    const a = nepAutomaat('keuring', {});
    const voor = kopVan(a);
    const gevallen = [
      ['K2-A01', { zonderKeuring: true }, 'keuring.json (de keuring van Andries) ontbreekt'],
      ['K2-A02', { besluiten: [] }, 'er staat geen besluit "pakket"'],
      ['K2-A03', { keuringCode: 'K2-A99' }, 'keuring.json is van een ander pakket'],
      ['K2-A04', { besluiten: [besluit('pakket', 'ok', 'pakket OK K2-A04', 90), besluit('pakket', 'ingetrokken', 'toch niet', 20)] }, 'is ingetrokken'],
      ['K2-A05', { besluiten: [besluit('pakket', 'niet-ok', 'nee', 20, { opmerking: 'de titel klopt niet' })] }, 'is niet OK'],
      ['K2-A06', { besluiten: [besluit('pakket', 'ok', 'pakket OK K2-A06', 90)], vraagt: { pakket: isoGeleden(5) } }, 'er staat een nieuwe vraag "pakket" open'],
      ['K2-A07', { besluiten: [besluit('script', 'ok', 'script OK K2-A07', 90)] }, 'er staat geen besluit "pakket"'],
      ['K2-A08', { besluiten: [besluit('pakket', 'ok', 'pakket OK K2-A08', 90, { door: 'Finn' })] }, 'is niet van Andries'],
    ];
    for (const [code, pakket, verwacht] of gevallen) {
      maakPakket(a, code, pakket);
      const r = plan(a, argumenten(a, 'kanaal-2', code));
      gelijk(r.code, 1, `${code}: afsluitcode\n${r.uit}`);
      bevat(r.uit, 'STOP:', code);
      bevat(r.uit, verwacht, code);
      ongewijzigd(a, voor, code);
    }
    // kanaal 1 vraagt ook een bijschrift OK
    maakPakket(a, 'YS60', { besluiten: [besluit('pakket', 'ok', 'pakket OK YS60', 90)] });
    const r1 = plan(a, argumenten(a, 'kanaal-1', 'YS60'));
    gelijk(r1.code, 1, 'kanaal 1 zonder bijschrift OK\n' + r1.uit);
    bevat(r1.uit, 'er staat geen besluit "bijschrift"', 'kanaal 1');
    ongewijzigd(a, voor, 'kanaal 1 zonder bijschrift OK');
    // een code die niet bij het account past (het pakket van een ander account)
    maakPakket(a, 'G12');
    const r2 = plan(a, argumenten(a, 'kanaal-2', 'G12'));
    gelijk(r2.code, 1, 'verkeerde code');
    bevat(r2.uit, 'past niet bij kanaal 2', 'verkeerde code');
    ongewijzigd(a, voor, 'verkeerde code');
  });

  await toets('fout bijschrift: @naam, link, domeinnaam, verboden woord: er wordt niets ingepland; een genoemde bron mag', () => {
    const a = nepAutomaat('bijschrift', {});
    const voor = kopVan(a);
    const lijst = path.join(a.basis, 'verboden-woorden.txt');
    fs.writeFileSync(lijst, '# namen van kanalen, een per regel\nNep Kanaal Twee\n\nnepkanaaltwee\n');
    const env = { YG_VERBODEN_WOORDEN: lijst };
    const gevallen = [
      ['K2-B01', 'Follow @nepkanaaltwee for more\n\n#test', 'een @naam'],
      ['K2-B02', 'More on https://example.com/x\n\n#test', 'er staat een link in'],
      ['K2-B03', 'Sources: Dictionary.com (2021).\n\n#test', 'lijkt op een domeinnaam'],
      ['K2-B04', 'Welcome to Nep Kanaal Twee!\n\n#test', 'een woord uit de lijst met verboden woorden'],
      ['K2-B05', '', 'het bijschrift is leeg'],
      ['K2-B06', 'tekst ' + '#tag '.repeat(31), '31 hashtags'],
    ];
    for (const [code, tekst, verwacht] of gevallen) {
      maakPakket(a, code, { bijschrift: tekst });
      const r = plan(a, argumenten(a, 'kanaal-2', code), env);
      gelijk(r.code, 1, `${code}: afsluitcode\n${r.uit}`);
      bevat(r.uit, verwacht, code);
      ongewijzigd(a, voor, code);
    }
    bevatNiet(plan(a, argumenten(a, 'kanaal-2', 'K2-B04'), env).uit, 'Nep Kanaal Twee', 'de melding noemt het verboden woord niet');
    // de lijst is ingesteld maar bestaat niet, of staat in een git-map: stoppen
    const weg = plan(a, argumenten(a, 'kanaal-2', 'K2-B03', { extra: ['--bron', 'dictionary.com'] }), { YG_VERBODEN_WOORDEN: path.join(a.basis, 'bestaat-niet.txt') });
    gelijk(weg.code, 1, 'lijst niet gevonden'); bevat(weg.uit, 'is niet gevonden', 'lijst niet gevonden');
    fs.writeFileSync(path.join(a.pc, 'woorden.txt'), 'iets\n');
    const inGit = plan(a, argumenten(a, 'kanaal-2', 'K2-B03', { extra: ['--bron', 'dictionary.com'] }), { YG_VERBODEN_WOORDEN: path.join(a.pc, 'woorden.txt') });
    gelijk(inGit.code, 1, 'lijst in een git-map'); bevat(inGit.uit, 'staat in een map van git', 'lijst in een git-map');
    fs.rmSync(path.join(a.pc, 'woorden.txt'));
    ongewijzigd(a, voor, 'lijst');
    // met de bron genoemd gaat het wel, en dat staat in de commit; het OK met een kanaalnaam erin wordt in de commit weggelaten
    maakPakket(a, 'K2-B03', { bijschrift: 'Sources: Dictionary.com (2021).\n\n#test', besluiten: [besluit('pakket', 'ok', 'pakket OK K2-B03, mooi voor Nep Kanaal Twee', 30)] });
    const goed = plan(a, argumenten(a, 'kanaal-2', 'K2-B03', { extra: ['--bron', 'Dictionary.com'] }), env);
    gelijk(goed.code, 0, 'met --bron\n' + goed.uit);
    const bericht = gitRuw(a.origin, ['log', '-1', '--format=%B', 'main']);
    bevat(bericht, 'bron in de tekst: dictionary.com', 'de bron staat in de commit');
    bevat(bericht, 'verboden woorden: lijst van 2 regels nagekeken', 'de lijst staat in de commit (alleen het aantal)');
    bevat(bericht, '"pakket OK K2-B03, mooi voor [weggelaten]"', 'de kanaalnaam is uit het citaat gehaald');
    bevatNiet(gitRuw(a.origin, ['log', '-1', '-p', 'main']).toLowerCase(), 'nep kanaal twee', 'de kanaalnaam staat nergens in de commit');
  });

  await toets('dubbel: dezelfde code, hetzelfde tijdstip of een al geplaatste code wordt geweigerd', () => {
    const m = MORGEN();
    const a = nepAutomaat('dubbel', { planning: [reelAnder('kanaal-2', 'k2', 'K2-C02', { datum: '2026-11-01', tijd: '18:00' }), reelAnder('kanaal-2', 'k2', 'K2-C01', { datum: m, tijd: '18:00' }), reelAnder('account-3', 'k3', 'G20', { datum: m, tijd: '19:00' })],
      gedaan: [{ id: '2026-11-01-k2-k2-c02', wanneer: '2026-11-01 18:07', resultaat: 'geplaatst', mediaId: '1' }] });
    const voor = kopVan(a);
    for (const [code, opties, verwacht] of [
      ['K2-C01', { tijd: '20:00' }, 'K2-C01 staat voor kanaal 2 al in de planning'],
      ['K2-C01', { tijd: '18:00' }, 'K2-C01 staat voor kanaal 2 al in de planning'],
      ['K2-C02', { tijd: '20:00' }, 'K2-C02 is voor kanaal 2 al geplaatst'],
      ['K2-C03', { tijd: '18:00' }, `op ${m} 18:00 staat voor kanaal 2 al iets gepland`],
    ]) {
      maakPakket(a, code);
      const r = plan(a, argumenten(a, 'kanaal-2', code, opties));
      gelijk(r.code, 1, `${code} ${opties.tijd}: afsluitcode\n${r.uit}`);
      bevat(r.uit, verwacht, `${code} ${opties.tijd}`);
      ongewijzigd(a, voor, `${code} ${opties.tijd}`);
    }
    // hetzelfde tijdstip als een ander account mag wel
    const r = plan(a, argumenten(a, 'kanaal-2', 'K2-C03', { tijd: '19:00' }));
    gelijk(r.code, 0, 'zelfde tijd als een ander account\n' + r.uit);
    gelijk(planningOp(a).items.map(i => i.id).slice(-3), [`${m}-k2-k2-c01`, `${m}-k3-g20`, `${m}-k2-k2-c03`], 'het item staat erbij, na het item van 19:00 dat er al stond');
  });

  await toets('tijd: minstens een uur vooruit, een bestaande datum en tijd', () => {
    const a = nepAutomaat('tijd', {});
    maakPakket(a, 'G30');
    const voor = kopVan(a), straks = amsterdam(-30);
    for (const [opties, verwacht] of [[{ datum: straks.datum, tijd: straks.tijd }, 'niet minstens een uur in de toekomst'], [{ datum: '2027-02-30' }, 'geen bestaande datum'], [{ tijd: '24:00' }, 'geen bestaande tijd'], [{ tijd: '18.00' }, 'geen bestaande tijd'], [{ datum: '2029-01-01' }, 'meer dan een jaar vooruit']]) {
      const r = plan(a, argumenten(a, 'account-3', 'G30', opties));
      gelijk(r.code, 1, JSON.stringify(opties) + '\n' + r.uit);
      bevat(r.uit, verwacht, JSON.stringify(opties));
      ongewijzigd(a, voor, JSON.stringify(opties));
    }
  });

  await toets('een video die niet aan de eisen voldoet: het geluid en de verpakking lost het commando zelf op, de rest wordt geweigerd', () => {
    const a = nepAutomaat('video', {});
    const voor = kopVan(a);
    for (const [code, video, verwacht] of [['G41', 'te-klein.mp4', '720x1280'], ['G42', 'kleur-444.mp4', '4:2:0'], ['G43', 'stil.mp4', 'geen geluidsspoor']]) {
      maakPakket(a, code);
      const r = plan(a, argumenten(a, 'account-3', code, { video }));
      gelijk(r.code, 1, `${code}\n${r.uit}`);
      bevat(r.uit, verwacht, code);
      ongewijzigd(a, voor, code);
    }
    for (const [code, omslag, verwacht] of [['G44', 'omslag-4x5.jpg', '1080x1350'], ['G45', 'png-als.jpg', 'geen JPEG']]) {
      maakPakket(a, code);
      const r = plan(a, argumenten(a, 'account-3', code, { omslag }));
      gelijk(r.code, 1, `${code}\n${r.uit}`);
      bevat(r.uit, verwacht, code);
      ongewijzigd(a, voor, code);
    }
    maakPakket(a, 'G46');
    const bron = media('geluid-96k.mp4'), bronSha = git(a.pc, ['hash-object', '--no-filters', bron]);
    const r = plan(a, argumenten(a, 'account-3', 'G46', { video: 'geluid-96k.mp4', tijd: '17:00' }));
    gelijk(r.code, 0, 'de video met 96 kHz\n' + r.uit);
    bevat(r.uit, 'Instagram-versie gemaakt', 'melding');
    gelijk(git(a.pc, ['hash-object', '--no-filters', bron]), bronSha, 'het bestand van de maker is niet gewijzigd');
    const uit = path.join(a.basis, 'uit.mp4');
    fs.writeFileSync(uit, execFileSync('git', ['cat-file', 'blob', 'main:beeld/account-3/G46.mp4'], { cwd: a.origin, maxBuffer: 1 << 28 }));
    const na = I.onderzoekVideo(uit);
    gelijk([na.vast, na.herstelbaar, Number(na.a.sample_rate), na.a.codec_name, na.v.codec_name], [[], [], 48000, 'aac', 'h264'], 'wat er op GitHub staat voldoet');
    bevat(gitRuw(a.origin, ['log', '-1', '--format=%B', 'main']), 'omgezet voor Instagram (beeld gekopieerd)', 'het staat in de commit');
  });

  await toets('twee makers tegelijk: beide items komen erin, zonder samenvoegconflict; elk legt alleen zijn eigen paden vast', async () => {
    const a = nepAutomaat('tegelijk', { planning: [reelK1('YS50', { datum: MORGEN(), tijd: '12:00' })] });
    maakPakket(a, 'K2-D01'); maakPakket(a, 'G50');
    const J = require(a.commando);
    const regels = [];
    let tussendoor = null;
    const r = await J.hoofd(argumenten(a, 'kanaal-2', 'K2-D01', { tijd: '18:00' }), { uit: t => regels.push(t), haken: { voorPush: async poging => {
      if (poging === 1) tussendoor = plan(a, argumenten(a, 'account-3', 'G50', { tijd: '18:00' }));    // de ander is net iets eerder
    } } });
    gelijk(tussendoor && tussendoor.code, 0, 'de tweede maker\n' + (tussendoor && tussendoor.uit));
    gelijk(r.code, 0, 'de eerste maker\n' + regels.join('\n'));
    bevat(regels.join('\n'), 'iemand anders legde intussen iets vast', 'de eerste rekent opnieuw');
    const p = planningOp(a);
    gelijk(p.items.map(i => i.id), [`${MORGEN()}-k1-ys50`, `${MORGEN()}-k3-g50`, `${MORGEN()}-k2-k2-d01`], 'beide items staan erin');
    gelijk(aantalCommits(a), 3, 'twee commits erbij, geen samenvoeging');
    gelijk(git(a.origin, ['rev-list', '--merges', '--count', 'main']), '0', 'geen merge-commit');
    gelijk(gewijzigdIn(a, 'main'), ['A beeld/kanaal-2/K2-D01.jpg', 'A beeld/kanaal-2/K2-D01.mp4', 'A mini/kanaal-2-K2-D01.jpg', 'M planning.json'], 'de commit van kanaal 2');
    gelijk(gewijzigdIn(a, 'main~1'), ['A beeld/account-3/G50.jpg', 'A beeld/account-3/G50.mp4', 'A mini/account-3-G50.jpg', 'M planning.json'], 'de commit van account 3');
    waar(lijstOp(a).includes('beeld/account-3/G50.mp4') && lijstOp(a).includes('beeld/kanaal-2/K2-D01.mp4'), 'beide video\'s staan er');
  });

  await toets('tegelijk, en de ander nam net hetzelfde tijdstip of dezelfde code: de tweede stopt, er komt niets dubbel', async () => {
    const a = nepAutomaat('tegelijk-botsing', {});
    maakPakket(a, 'K2-E01'); maakPakket(a, 'K2-E02'); maakPakket(a, 'K2-E03');
    const J = require(a.commando);
    for (const [eerste, tweede, verwacht] of [[['K2-E01', '18:00'], ['K2-E02', '18:00'], 'staat voor kanaal 2 al iets gepland'], [['K2-E03', '20:00'], ['K2-E03', '21:00'], 'K2-E03 staat voor kanaal 2 al in de planning']]) {
      const regels = [];
      let tussendoor = null;
      const voor = aantalCommits(a);
      const r = await J.hoofd(argumenten(a, 'kanaal-2', eerste[0], { tijd: eerste[1] }), { uit: t => regels.push(t), haken: { voorPush: async poging => {
        if (poging === 1) tussendoor = plan(a, argumenten(a, 'kanaal-2', tweede[0], { tijd: tweede[1] }));
      } } });
      gelijk(tussendoor && tussendoor.code, 0, 'de ander\n' + (tussendoor && tussendoor.uit));
      gelijk(r.code, 1, 'de eerste moet stoppen\n' + regels.join('\n'));
      bevat(regels.join('\n'), verwacht, 'reden');
      gelijk(aantalCommits(a), voor + 1, 'alleen de commit van de ander');
    }
    const ids = planningOp(a).items.map(i => i.id);
    gelijk(ids.length, new Set(ids).size, 'geen dubbele ids');
    gelijk(ids.length, 2, 'twee items in totaal');
  });

  await toets('kanaal 1 met een pakket in deze repo: het item wijst naar het pakket, de video wordt niet nog eens neergezet', () => {
    const pakket = 'pakketten/2026-12-20-YS60-proef';
    const a = nepAutomaat('in-repo', { bestanden: { [`${pakket}/instagram/reel.mp4`]: media('goed.mp4'), [`${pakket}/instagram/omslag.jpg`]: media('omslag.jpg') } });
    const map = path.join(a.pc, ...pakket.split('/'));
    fs.writeFileSync(path.join(map, 'pakket.json'), JSON.stringify({ code: 'YS60', titel: 'Proef' }));
    fs.writeFileSync(path.join(map, 'keuring.json'), JSON.stringify({ code: 'YS60', besluiten: [besluit('pakket', 'ok', 'Beide OK YS60', 60, { via: 'sessie' }), besluit('bijschrift', 'ok', 'Beide OK YS60', 60, { via: 'sessie' })] }));
    fs.writeFileSync(path.join(map, 'instagram', 'bijschrift.txt'), 'Why is this a test?\n\nBecause.\n\n#test');
    const args = ['--account', 'kanaal-1', '--pakket', map, '--video', path.join(map, 'instagram', 'reel.mp4'), '--omslag', path.join(map, 'instagram', 'omslag.jpg'), '--bijschrift', path.join(map, 'instagram', 'bijschrift.txt'), '--datum', MORGEN(), '--tijd', '20:00', '--omslag-ms', '2100'];
    const r = plan(a, args);
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    gelijk(gewijzigdIn(a), ['A mini/pakketten-2026-12-20-YS60-proef-instagram-omslag.jpg', 'M planning.json'], 'alleen het kleintje en de planning');
    const item = planningOp(a).items[0];
    gelijk([item.id, item.account, item.beeld, item.omslag, item.omslagMs, item.titel], [`${MORGEN()}-k1-ys60`, 'kanaal-1', [`${pakket}/instagram/reel.mp4`], `${pakket}/instagram/omslag.jpg`, 2100, 'Kanaal 1 YS60: Why is this a test?'], 'het item, zoals plan-reel.cjs het maakte');
    const bericht = gitRuw(a.origin, ['log', '-1', '--format=%an%n%B', 'main']);
    bevat(bericht, 'Manon (YG Crew)', 'auteur');
    bevat(bericht, '(pakket OK en bijschrift OK: "Beide OK YS60", Andries ', 'beide keuringen in één citaat');
    bevat(bericht, 'via de sessie', 'waar het OK vandaan kwam');
    // staat het pakket nog niet op GitHub, dan eerst vastleggen
    const pakket2 = 'pakketten/2026-12-21-YS61-proef', map2 = path.join(a.pc, ...pakket2.split('/'));
    fs.mkdirSync(path.join(map2, 'instagram'), { recursive: true });
    fs.copyFileSync(media('goed.mp4'), path.join(map2, 'instagram', 'reel.mp4')); fs.copyFileSync(media('omslag.jpg'), path.join(map2, 'instagram', 'omslag.jpg'));
    fs.writeFileSync(path.join(map2, 'pakket.json'), JSON.stringify({ code: 'YS61', titel: 'Proef' }));
    fs.writeFileSync(path.join(map2, 'keuring.json'), JSON.stringify({ code: 'YS61', besluiten: [besluit('pakket', 'ok', 'Beide OK YS61', 60), besluit('bijschrift', 'ok', 'Beide OK YS61', 60)] }));
    fs.writeFileSync(path.join(map2, 'instagram', 'bijschrift.txt'), 'Another test.\n\n#test');
    const voor = kopVan(a);
    const r2 = plan(a, ['--account', 'kanaal-1', '--pakket', map2, '--video', path.join(map2, 'instagram', 'reel.mp4'), '--omslag', path.join(map2, 'instagram', 'omslag.jpg'), '--bijschrift', path.join(map2, 'instagram', 'bijschrift.txt'), '--datum', MORGEN(), '--tijd', '12:00']);
    gelijk(r2.code, 1, 'pakket nog niet op GitHub\n' + r2.uit);
    bevat(r2.uit, 'staat nog niet op GitHub', 'melding');
    gelijk(kopVan(a), voor, 'niets vastgelegd');
  });

  await toets('intrekken: een eigen item dat nog niet geplaatst is gaat uit de planning; daarna kan het opnieuw', () => {
    const m = MORGEN();
    const a = nepAutomaat('intrekken', { planning: [reelAnder('kanaal-2', 'k2', 'K2-F01', { datum: '2026-11-01', tijd: '18:00' }), reelAnder('kanaal-2', 'k2', 'K2-F02', { datum: '2026-11-02', tijd: '18:00' }), reelAnder('account-3', 'k3', 'G60', { datum: m, tijd: '18:00' })],
      gedaan: [{ id: '2026-11-01-k2-k2-f01', wanneer: '2026-11-01 18:04', resultaat: 'geplaatst', mediaId: '1' }, { id: '2026-11-02-k2-k2-f02', wanneer: '2026-11-03 13:00', resultaat: 'overgeslagen' }] });
    maakPakket(a, 'K2-F02'); maakPakket(a, 'K2-F03');
    const voor = kopVan(a);
    const geplaatst = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'K2-F01', '--reden', 'de keuring is ingetrokken']);
    gelijk(geplaatst.code, 1, 'een geplaatst item\n' + geplaatst.uit); bevat(geplaatst.uit, 'is al geplaatst', 'geplaatst');
    const nietDaar = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'K2-F09', '--reden', 'de keuring is ingetrokken']);
    gelijk(nietDaar.code, 1, 'een code die er niet staat'); bevat(nietDaar.uit, 'staat voor kanaal 2 niet in de planning', 'niet in de planning');
    const zonderReden = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'K2-F02']);
    gelijk(zonderReden.code, 1, 'zonder reden'); bevat(zonderReden.uit, '--reden ontbreekt', 'zonder reden');
    const vanAnder = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'G60', '--reden', 'de keuring is ingetrokken']);
    gelijk(vanAnder.code, 1, 'de code van een ander account'); bevat(vanAnder.uit, 'past niet bij kanaal 2', 'code van een ander');
    ongewijzigd(a, voor, 'geweigerde intrekkingen');
    // het overgeslagen item zit het opnieuw inplannen in de weg, tot het is ingetrokken
    const bezet = plan(a, argumenten(a, 'kanaal-2', 'K2-F02'));
    gelijk(bezet.code, 1, 'overgeslagen item staat er nog'); bevat(bezet.uit, 'dat item is overgeslagen', 'melding'); bevat(bezet.uit, '--intrekken --account kanaal-2 --code K2-F02', 'de melding zegt hoe');
    const proef = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'K2-F02', '--reden', 'te laat geworden, komt opnieuw', '--proef']);
    gelijk(proef.code, 0, 'proef'); ongewijzigd(a, voor, 'intrekken --proef');
    const weg = plan(a, ['--intrekken', '--account', 'kanaal-2', '--code', 'K2-F02', '--reden', 'te laat geworden, komt opnieuw']);
    gelijk(weg.code, 0, 'intrekken\n' + weg.uit);
    gelijk(gewijzigdIn(a), ['M planning.json'], 'alleen de planning verandert');
    gelijk(planningOp(a).items.map(i => i.id), ['2026-11-01-k2-k2-f01', `${m}-k3-g60`], 'het item is weg, de rest staat er');
    bevat(gitRuw(a.origin, ['log', '-1', '--format=%an%n%B', 'main']), 'Intrekken kanaal 2 K2-F02: 2026-11-02-k2-k2-f02 (2026-11-02 18:00) uit de planning (te laat geworden, komt opnieuw)', 'de commit');
    // op dezelfde dag als het overgeslagen item kan niet: dat id staat in het logboek en zou worden overgeslagen
    const zelfdeDag = I.magErbij.bind(null, { items: [] }, { items: [{ id: '2026-11-02-k2-k2-f02', wanneer: 'x', resultaat: 'overgeslagen' }] }, 'kanaal-2', 'K2-F02', '2026-11-02', '20:00');
    let melding = ''; try { zelfdeDag(); } catch (e) { melding = e.message; }
    bevat(melding, 'staat al in het logboek', 'zelfde dag als het overgeslagen item');
    const opnieuw = plan(a, argumenten(a, 'kanaal-2', 'K2-F02', { tijd: '19:00' }));
    gelijk(opnieuw.code, 0, 'opnieuw inplannen\n' + opnieuw.uit);
    gelijk(planningOp(a).items.map(i => i.id), ['2026-11-01-k2-k2-f01', `${m}-k3-g60`, `${m}-k2-k2-f02`], 'het staat er opnieuw in');
  });

  await toets('de kleine kopie van de automaat uit LEESMIJ.md (ondiep, zonder inhoud, alleen gereedschap en src) is genoeg voor het commando', () => {
    const a = nepAutomaat('kleine-kopie', { bestanden: { 'pakketten/2026-12-15-YS50-proef/video.mp4': Buffer.alloc(200 * 1024, 3) } });
    const klein = path.join(a.basis, 'yg-automaat');
    git(a.basis, ['clone', '-q', '--depth', '1', '--filter=blob:none', '--sparse', a.url, klein]);
    git(klein, ['sparse-checkout', 'set', 'gereedschap', 'src']);
    git(klein, ['config', 'user.email', 'pc@voorbeeld.invalid']);
    waar(bestaat(path.join(klein, 'gereedschap', 'inplannen.cjs')) && bestaat(path.join(klein, 'src', 'accounts.cjs')) && bestaat(path.join(klein, 'planning.json')), 'het commando, de tabel en de hoofdmap zijn er');
    waar(!bestaat(path.join(klein, 'pakketten')) && !bestaat(path.join(klein, 'beeld')), 'de pakketten en het beeld zijn niet opgehaald');
    maakPakket(a, 'G70');
    const r = spawnSync(process.execPath, [path.join(klein, 'gereedschap', 'inplannen.cjs'), ...argumenten(a, 'account-3', 'G70')], { cwd: a.maker, env: { ...process.env, YG_VERBODEN_WOORDEN: '' }, encoding: 'utf8' });
    gelijk(r.status, 0, 'inplannen vanuit de kleine kopie\n' + r.stdout + r.stderr);
    gelijk(planningOp(a).items.map(i => i.id), [`${MORGEN()}-k3-g70`], 'het item staat op GitHub');
    gelijk(git(klein, ['status', '--porcelain']), '', 'de kleine kopie zelf is niet gewijzigd');
    // later legt een ander iets vast; de kleine kopie haalt de nieuwste versie op met pull --ff-only
    maakPakket(a, 'K2-J01');
    gelijk(plan(a, argumenten(a, 'kanaal-2', 'K2-J01', { tijd: '19:00' })).code, 0, 'een ander plant in');
    git(klein, ['pull', '-q', '--ff-only']);
    gelijk(git(klein, ['rev-parse', 'HEAD']), kopVan(a), 'de kleine kopie loopt weer gelijk');
    waar(!bestaat(path.join(klein, 'beeld')), 'ook na het ophalen komt er geen beeld bij');
  });

  await toets('een verouderd commando, een onbekend account, een kapotte planning: stoppen zonder iets te wijzigen', () => {
    const a = nepAutomaat('randen', { status: { stand: 'in orde', bericht: 'x', sinds: '2026-11-19 10:00', accounts: { 'kanaal-2': { naam: 'kanaal 2', stand: 'niet ingesteld', bericht: 'x', sinds: 'x' } } } });
    maakPakket(a, 'K2-G01');
    const voor = kopVan(a);
    for (const [account, verwacht] of [['kanaal-9', 'onbekend account "kanaal-9"; kies uit kanaal-1, kanaal-2, account-3'], ['ygdigital', 'werkt dit commando niet']]) {
      const r = plan(a, argumenten(a, account, 'K2-G01'));
      gelijk(r.code, 1, account); bevat(r.uit, verwacht, account);
    }
    const onbekend = plan(a, [...argumenten(a, 'kanaal-2', 'K2-G01'), '--snel']);
    gelijk(onbekend.code, 1, 'onbekende optie'); bevat(onbekend.uit, 'onbekende optie --snel', 'onbekende optie');
    // de stand van het account komt als waarschuwing mee
    const proef = plan(a, argumenten(a, 'kanaal-2', 'K2-G01', { extra: ['--proef'] }));
    gelijk(proef.code, 0, 'proef\n' + proef.uit);
    bevat(proef.uit, 'LET OP: de automaat kan voor kanaal 2 nu niet plaatsen (niet ingesteld)', 'waarschuwing over de stand');
    // het commando op de pc is niet de versie van GitHub
    fs.appendFileSync(a.commando, '\n// een oude of gewijzigde versie\n');
    const oud = plan(a, argumenten(a, 'kanaal-2', 'K2-G01'));
    gelijk(oud.code, 1, 'verouderd commando\n' + oud.uit); bevat(oud.uit, 'is niet de versie die op GitHub staat', 'verouderd commando');
    gelijk(kopVan(a), voor, 'niets vastgelegd');
    git(a.pc, ['checkout', '-q', '--', 'gereedschap/inplannen.cjs']);
    // planning.json op GitHub is kapot: niets aanraken
    const kapot = nepAutomaat('randen-kapot', {});
    maakPakket(kapot, 'K2-G02');
    fs.writeFileSync(path.join(kapot.pc, 'planning.json'), '{ "items": [ kapot');
    git(kapot.pc, ['add', 'planning.json']); git(kapot.pc, [...WIE, 'commit', '-q', '-m', 'kapot']); git(kapot.pc, ['push', '-q', 'origin', 'main']);
    const voorKapot = kopVan(kapot);
    const rk = plan(kapot, argumenten(kapot, 'kanaal-2', 'K2-G02'));
    gelijk(rk.code, 1, 'kapotte planning\n' + rk.uit); bevat(rk.uit, 'planning.json op GitHub is geen geldige JSON', 'kapotte planning');
    gelijk(kopVan(kapot), voorKapot, 'niets vastgelegd');
  });
}

// =================================================================================
// De workflow. De twee stappen na het plaatsen (het logboek bewaren, meldingen maken) staan als tekst in
// .github/workflows/plaatsen.yml; hier halen we ze er letterlijk uit en draaien we ze in de zandbak.
const WORKFLOW = () => fs.readFileSync(path.join(WORTEL, '.github', 'workflows', 'plaatsen.yml'), 'utf8');
function stap(naam) {
  const regels = WORKFLOW().split('\n');
  const begin = regels.findIndex(r => r.trim() === `- name: ${naam}`);
  if (begin < 0) throw new Error(`stap "${naam}" staat niet in plaatsen.yml`);
  let eind = regels.findIndex((r, i) => i > begin && /^\s*- (name|uses):/.test(r));
  if (eind < 0) eind = regels.length;
  const blok = regels.slice(begin, eind);
  const r = blok.findIndex(x => /^\s*run: \|\s*$/.test(x));
  const kop = (r < 0 ? blok : blok.slice(0, r)).map(x => x.trim());
  let script = null;
  if (r >= 0) {
    // Het blok na "run: |": alle regels die dieper inspringen dan "run:". De eerste regel die dat niet doet
    // (commentaar boven de volgende stap) hoort er niet meer bij.
    const inspring = blok[r].match(/^\s*/)[0].length + 2, uit = [];
    for (const x of blok.slice(r + 1)) {
      if (x.trim() !== '' && x.match(/^\s*/)[0].length < inspring) break;
      uit.push(x.slice(inspring));
    }
    while (uit.length && uit[uit.length - 1].trim() === '') uit.pop();
    script = uit.join('\n') + '\n';
  }
  return { kop, script, tekst: blok.join('\n') };
}
const heeftBash = () => spawnSync('bash', ['--version'], { encoding: 'utf8' }).status === 0;
// GitHub draait een stap zonder eigen "shell" als: bash -e <bestand>
function draaiStap(script, map, env = {}) {
  const f = path.join(TMP, `stap-${Math.random().toString(36).slice(2)}.sh`);
  fs.writeFileSync(f, script);
  const r = spawnSync('bash', ['-e', f], { cwd: map, env: { ...process.env, ...env }, encoding: 'utf8' });
  return { code: r.status, uit: `${r.stdout}${r.stderr}` };
}
// Een werkmap zoals actions/checkout hem maakt met "sparse-checkout: src": ondiep, zonder inhoud van bestanden
// die niet nodig zijn, alleen de hoofdmap en src/.
function runnerKloon(a, naam) {
  const map = path.join(a.basis, naam);
  fs.mkdirSync(map);
  git(map, ['init', '-q', '-b', 'main']);
  git(map, ['remote', 'add', 'origin', a.url]);
  git(map, ['-c', 'protocol.version=2', 'fetch', '-q', '--no-tags', '--prune', '--no-recurse-submodules', '--depth=1', '--filter=blob:none', 'origin', '+refs/heads/main:refs/remotes/origin/main']);
  git(map, ['sparse-checkout', 'set', 'src']);
  git(map, ['checkout', '-q', '--force', '-B', 'main', 'refs/remotes/origin/main']);
  return map;
}

async function deelWorkflow() {
  const T = require(path.join(WORTEL, 'src', 'accounts.cjs'));

  await toets('plaatsen.yml: elke tien minuten, de geheimen per account doorgegeven (nooit alle in één keer), de proefknop, en de twee stappen die altijd draaien', () => {
    const y = WORKFLOW();
    const crons = [...y.matchAll(/^\s*- cron: '([^']+)'\s*$/gm)].map(m => m[1]);
    gelijk(crons.length, 1, 'één regel met starttijden');
    const [min, uur, dag, maand, weekdag] = crons[0].split(' ');
    gelijk([uur, dag, maand, weekdag], ['*', '*', '*', '*'], 'elk uur, elke dag');
    const minuten = min.split(',').map(Number);
    waar(minuten.length === 6 && minuten.every(m => Number.isInteger(m) && m > 0 && m < 60), 'zes starts per uur, niet op het hele uur: ' + min);
    waar(minuten.every((m, i) => (i ? m - minuten[i - 1] : m + 60 - minuten[minuten.length - 1]) >= 5), 'nooit korter dan 5 minuten na elkaar (de grens van GitHub)');
    const plaats = stap('Plaatsen wat aan de beurt is'), proef = stap('Proef met een video (er wordt niets geplaatst)');
    for (const st of [plaats, proef]) {
      for (const acc of T.ACCOUNTS) for (const g of [acc.geheim, acc.geheimId]) waar(st.kop.includes(`${g}: \${{ secrets.${g} }}`), `${g} wordt niet doorgegeven`);
      waar(!st.kop.some(k => k.includes('toJSON(secrets)')), 'alle geheimen in één keer (toJSON(secrets)): GitHub houdt de workflow dan tegen als mogelijk kwaadaardig');
      waar(st.kop.some(k => k.startsWith('REPO_RAW: https://raw.githubusercontent.com/${{ github.repository }}/')), 'REPO_RAW ontbreekt');
    }
    waar(plaats.kop.includes("if: github.event.inputs.proefvideo == ''") && proef.kop.includes("if: github.event.inputs.proefvideo != ''"), 'plaatsen en proef sluiten elkaar uit');
    waar(plaats.tekst.includes('run: node src/plaatsen.cjs'), 'het script wordt gestart');
    waar(proef.tekst.includes('${PROEF_ACCOUNT:+--account "$PROEF_ACCOUNT"}'), 'de proefknop geeft het account door');
    for (const acc of T.ACCOUNTS) waar(new RegExp(`proefaccount:[\\s\\S]{0,200}${acc.naam}`).test(y), `de proefknop noemt ${acc.naam} niet`);
    for (const naam of ['Bijhouden wat geplaatst is', 'Waarschuwen als een sleutel niet meer werkt of bijna verloopt']) waar(stap(naam).kop.includes('if: always()'), `"${naam}" moet altijd draaien`);
    waar(/concurrency:\s*\n\s*group: plaatsen\s/.test(y) && /cancel-in-progress: false/.test(y), 'nooit twee runs tegelijk');
    waar(/- uses: actions\/checkout@v4\s*\n\s*with:\s*\n\s*sparse-checkout: \|\s*\n\s*src\s*\n/.test(y), 'alleen de hoofdmap en src/ ophalen');
    const volgorde = ['Plaatsen wat aan de beurt is', 'Bijhouden wat geplaatst is', 'Waarschuwen als een sleutel niet meer werkt of bijna verloopt'].map(n => y.indexOf(`- name: ${n}`));
    waar(volgorde[0] < volgorde[1] && volgorde[1] < volgorde[2], 'eerst plaatsen, dan het logboek bewaren, dan pas melden');
    bevatNiet(stap('Bijhouden wat geplaatst is').script, '${{', 'de stap die het logboek bewaart gebruikt geen ingevulde waarden');
  });

  await toets('een run die blijft hangen houdt de volgende starts niet urenlang tegen: een tijdsgrens op de job en een kortere op het plaatsen', () => {
    const y = WORKFLOW();
    const job = /^jobs:\n  plaatsen:\n(?:    .*\n|\s*\n)*?    timeout-minutes: (\d+)\s*\n/m.exec(y);
    waar(job, 'de job heeft geen timeout-minutes (de standaard van GitHub is zes uur, en er draait nooit meer dan één run)');
    const grens = s => { const k = s.kop.find(x => x.startsWith('timeout-minutes:')); return k ? Number(k.split(':')[1]) : null; };
    const plaats = grens(stap('Plaatsen wat aan de beurt is')), proef = grens(stap('Proef met een video (er wordt niets geplaatst)'));
    waar(Number.isInteger(plaats) && plaats >= 15 && plaats < Number(job[1]), `het plaatsen heeft een eigen grens, korter dan die van de job: ${plaats} tegen ${job[1]}`);
    waar(Number.isInteger(proef) && proef < Number(job[1]), 'de proef heeft een eigen grens, korter dan die van de job');
    waar(Number(job[1]) <= 60, 'de job stopt binnen het uur');
    // Het logboek bewaren mag nooit klappen: geen eigen grens. Het draait ook als het plaatsen op zijn grens is gestopt.
    for (const naam of ['Bijhouden wat geplaatst is', 'Waarschuwen als een sleutel niet meer werkt of bijna verloopt']) {
      gelijk(grens(stap(naam)), null, `"${naam}" heeft geen eigen grens`);
      waar(stap(naam).kop.includes('if: always()'), `"${naam}" draait ook na een gestopte stap`);
    }
    const py = spawnSync('python3', ['-c', 'import sys, json, yaml\nd = yaml.safe_load(open(sys.argv[1], encoding="utf-8"))\nj = d["jobs"]["plaatsen"]\nprint(json.dumps([j.get("timeout-minutes")] + [s.get("timeout-minutes") for s in j["steps"]]))', path.join(WORTEL, '.github', 'workflows', 'plaatsen.yml')], { encoding: 'utf8' });
    if (py.status !== 0) { console.log('        (de vergelijking met een YAML-lezer is overgeslagen: python3 met yaml is hier niet beschikbaar)'); return; }
    gelijk(JSON.parse(py.stdout), [Number(job[1]), null, null, plaats, proef, null, null], 'de grenzen zoals een YAML-lezer ze ziet: job, ophalen, node, plaatsen, proef, bewaren, melden');
  });

  await toets('de stappen die hier worden gedraaid zijn letterlijk de stappen uit plaatsen.yml (vergeleken met een YAML-lezer)', () => {
    const py = spawnSync('python3', ['-c', 'import sys, json, yaml\nd = yaml.safe_load(open(sys.argv[1], encoding="utf-8"))\nprint(json.dumps({s["name"]: s.get("run") for j in d["jobs"].values() for s in j["steps"] if "name" in s}))', path.join(WORTEL, '.github', 'workflows', 'plaatsen.yml')], { encoding: 'utf8' });
    if (py.status !== 0) { console.log('        (overgeslagen: python3 met yaml is hier niet beschikbaar)'); return; }
    const echt = JSON.parse(py.stdout);
    for (const naam of ['Bijhouden wat geplaatst is', 'Waarschuwen als een sleutel niet meer werkt of bijna verloopt']) gelijk(stap(naam).script, echt[naam], `de stap "${naam}"`);
    gelijk(Object.keys(echt), ['Plaatsen wat aan de beurt is', 'Proef met een video (er wordt niets geplaatst)', 'Bijhouden wat geplaatst is', 'Waarschuwen als een sleutel niet meer werkt of bijna verloopt'], 'de stappen van de workflow, in volgorde');
  });

  if (!heeftBash()) { console.log('        (de stappen zelf zijn niet gedraaid: bash ontbreekt op deze computer)'); return; }

  await toets('het logboek bewaren: niets nieuws = geen commit; een wijziging wordt vastgelegd, ook in de zuinige werkmap', () => {
    const groot = Buffer.alloc(300 * 1024, 7);
    const a = nepAutomaat('bijhouden', { planning: [reelK1('YS50', amsterdam(5))], bestanden: { 'src/plaatsen.cjs': '// script\n', 'pakketten/2026-12-15-YS50-proef/video.mp4': groot, 'status.json': '{"stand":"in orde"}' } });
    const script = stap('Bijhouden wat geplaatst is').script;
    const run = runnerKloon(a, 'runner-1');
    waar(bestaat(path.join(run, 'gedaan.json')) && bestaat(path.join(run, 'planning.json')) && bestaat(path.join(run, 'src', 'plaatsen.cjs')), 'de hoofdmap en src/ zijn er');
    waar(!bestaat(path.join(run, 'pakketten')) && !bestaat(path.join(run, 'gereedschap')), 'de pakketten en het gereedschap worden niet opgehaald');
    const voor = kopVan(a);
    const r0 = draaiStap(script, run);
    gelijk(r0.code, 0, 'zonder wijziging\n' + r0.uit); bevat(r0.uit, 'niets nieuws om te bewaren', 'melding'); gelijk(kopVan(a), voor, 'geen commit');
    // de automaat plaatste iets: gedaan.json en status.json veranderen, sleutel.json is er (nog) niet
    fs.writeFileSync(path.join(run, 'gedaan.json'), JSON.stringify({ items: [{ id: 'x', wanneer: '2026-11-19 20:00', resultaat: 'geplaatst', mediaId: '1' }] }, null, 1));
    fs.writeFileSync(path.join(run, 'status.json'), '{"stand":"in orde","bericht":"nieuw"}');
    waar(!bestaat(path.join(run, 'sleutel.json')), 'sleutel.json ontbreekt in deze proef (de fout van 15 september)');
    const r1 = draaiStap(script, run);
    gelijk(r1.code, 0, 'met wijziging\n' + r1.uit);
    gelijk(gewijzigdIn(a), ['M gedaan.json', 'M status.json'], 'vastgelegd op GitHub');
    bevat(gitRuw(a.origin, ['log', '-1', '--format=%an|%s', 'main']), 'YG plaatser|geplaatst op ', 'de commit van de automaat');
    gelijk(JSON.parse(gitRuw(a.origin, ['show', 'main:gedaan.json'])).items[0].id, 'x', 'het logboek staat er');
    waar(lijstOp(a).includes('pakketten/2026-12-15-YS50-proef/video.mp4'), 'wat niet was opgehaald, staat er nog gewoon');
    gelijk(draaiStap(script, run).uit.includes('niets nieuws om te bewaren'), true, 'daarna weer niets nieuws');
  });

  await toets('het logboek bewaren terwijl een maker net iets vastlegde: ophalen, opnieuw proberen, niets kwijt', () => {
    const a = nepAutomaat('bijhouden-race', { bestanden: { 'src/plaatsen.cjs': '// script\n' } });
    const script = stap('Bijhouden wat geplaatst is').script;
    const run = runnerKloon(a, 'runner-2');
    // intussen plant een maker iets in (met het echte commando): planning.json, een video en een omslag erbij
    maakPakket(a, 'K2-H01');
    gelijk(plan(a, argumenten(a, 'kanaal-2', 'K2-H01')).code, 0, 'de maker plant in');
    fs.writeFileSync(path.join(run, 'gedaan.json'), JSON.stringify({ items: [{ id: 'y', wanneer: '2026-11-19 20:10', resultaat: 'geplaatst', mediaId: '2' }] }, null, 1));
    fs.writeFileSync(path.join(run, 'sleutel.json'), '{"afdruk":"abc","sinds":"2026-11-19"}');
    const r = draaiStap(script, run);
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    bevat(r.uit, 'push mislukt, poging 1; eerst ophalen', 'de eerste poging botst');
    gelijk(aantalCommits(a), 3, 'begin, de maker, de automaat');
    gelijk(JSON.parse(gitRuw(a.origin, ['show', 'main:gedaan.json'])).items[0].id, 'y', 'het logboek staat er');
    gelijk(planningOp(a).items.map(i => i.id), [`${MORGEN()}-k2-k2-h01`], 'het item van de maker staat er ook nog');
    waar(lijstOp(a).includes('beeld/kanaal-2/K2-H01.mp4') && lijstOp(a).includes('sleutel.json'), 'de video van de maker en de sleutelteller staan er');
    gelijk(git(a.origin, ['rev-list', '--merges', '--count', 'main']), '0', 'geen merge-commit');
  });

  await toets('het logboek bewaren klapt nooit: ook als GitHub onbereikbaar is, eindigt de stap goed', () => {
    const a = nepAutomaat('bijhouden-stuk', { bestanden: { 'src/plaatsen.cjs': '// script\n' } });
    const script = stap('Bijhouden wat geplaatst is').script;
    const run = runnerKloon(a, 'runner-3');
    fs.writeFileSync(path.join(run, 'gedaan.json'), JSON.stringify({ items: [{ id: 'z' }] }));
    git(run, ['remote', 'set-url', 'origin', 'file://' + path.join(a.basis, 'bestaat-niet.git').split(path.sep).join('/')]);
    const r = draaiStap(script.replace(/sleep 3/g, 'sleep 0'), run);
    gelijk(r.code, 0, 'afsluitcode\n' + r.uit);
    bevat(r.uit, 'kon het logboek niet wegschrijven; volgende run probeert het opnieuw', 'melding');
    gelijk((r.uit.match(/push mislukt, poging/g) || []).length, 5, 'vijf pogingen');
  });

  await toets('meldingen: per account één, met de juiste titel en tekst; wat al open staat komt er niet nog eens', () => {
    const map = path.join(TMP, 'melden'), bak = path.join(map, 'bin');
    fs.mkdirSync(path.join(map, 'waarschuwingen'), { recursive: true }); fs.mkdirSync(bak);
    fs.writeFileSync(path.join(bak, 'gh'), `#!/usr/bin/env bash
echo "gh $*" >> "$NEP_GH_LOG"
if [ "$1 $2" = "issue list" ]; then
  if [ -n "$NEP_GH_FAAL_LIJST" ]; then echo "HTTP 502" >&2; exit 1; fi
  [ -f "$NEP_GH_OPEN" ] && cat "$NEP_GH_OPEN"
  exit 0
fi
if [ "$1 $2" = "issue create" ]; then
  shift 2; titel=""; tekst=""
  while [ $# -gt 0 ]; do case "$1" in --title) titel="$2"; shift 2;; --body-file) tekst="$2"; shift 2;; *) shift;; esac; done
  if [ -n "$NEP_GH_FAAL_MAAK" ]; then echo "maken mislukt" >&2; exit 1; fi
  echo "$titel" >> "$NEP_GH_OPEN"; { echo "== $titel"; cat "$tekst"; } >> "$NEP_GH_GEMAAKT"
  exit 0
fi
exit 1
`, { mode: 0o755 });
    const script = stap('Waarschuwen als een sleutel niet meer werkt of bijna verloopt').script;
    const env = { PATH: `${bak}${path.delimiter}${process.env.PATH}`, RUNNER_TEMP: map, GH_TOKEN: 'nep', NEP_GH_LOG: path.join(map, 'gh.log'), NEP_GH_OPEN: path.join(map, 'open.txt'), NEP_GH_GEMAAKT: path.join(map, 'gemaakt.txt') };
    const opnieuw = () => { for (const f of ['gh.log', 'open.txt', 'gemaakt.txt']) fs.rmSync(path.join(map, f), { force: true }); };
    const gemaakt = () => bestaat(env.NEP_GH_GEMAAKT) ? fs.readFileSync(env.NEP_GH_GEMAAKT, 'utf8') : '';
    const titels = () => gemaakt().split('\n').filter(r => r.startsWith('== ')).map(r => r.slice(3));
    // zonder map met meldingen: niets doen, gh niet eens aanroepen
    fs.rmSync(path.join(map, 'waarschuwingen'), { recursive: true });
    const r0 = draaiStap(script, map, env);
    gelijk([r0.code, bestaat(env.NEP_GH_LOG)], [0, false], 'zonder meldingen\n' + r0.uit);
    // de bestanden zoals src/plaatsen.cjs ze schrijft
    fs.mkdirSync(path.join(map, 'waarschuwingen'));
    fs.writeFileSync(path.join(map, 'waarschuwingen', 'ygdigital.txt'), 'Sleutel vernieuwen\n\nDe Instagram-sleutel van @ygdigital.nl werkt niet meer.\n\nTweede alinea.\n');
    fs.writeFileSync(path.join(map, 'waarschuwingen', 'kanaal-2.txt'), 'Sleutel vernieuwen: kanaal 2\n\nDe Instagram-sleutel van kanaal 2 verloopt over ongeveer 5 dagen.\n');
    const r1 = draaiStap(script, map, env);
    gelijk(r1.code, 0, 'eerste keer\n' + r1.uit);
    gelijk(titels().sort(), ['Sleutel vernieuwen', 'Sleutel vernieuwen: kanaal 2'], 'twee meldingen');
    bevat(gemaakt(), '== Sleutel vernieuwen\nDe Instagram-sleutel van @ygdigital.nl werkt niet meer.\n\nTweede alinea.\n', 'de tekst zonder de titelregel');
    const r2 = draaiStap(script, map, env);
    gelijk([r2.code, titels().length], [0, 2], 'tweede keer: niets erbij'); bevat(r2.uit, 'staat al open', 'melding');
    // precies de titel telt: een open melding van het ene account houdt die van het andere niet tegen
    opnieuw(); fs.writeFileSync(env.NEP_GH_OPEN, 'Sleutel vernieuwen\nIets anders\n');
    draaiStap(script, map, env);
    gelijk(titels(), ['Sleutel vernieuwen: kanaal 2'], 'alleen kanaal 2 erbij');
    opnieuw(); fs.writeFileSync(env.NEP_GH_OPEN, 'Sleutel vernieuwen: kanaal 2\n');
    draaiStap(script, map, env);
    gelijk(titels(), ['Sleutel vernieuwen'], 'alleen het eerste account erbij');
    // gh doet het niet: de stap eindigt goed en maakt niets dubbel
    opnieuw();
    const r3 = draaiStap(script, map, { ...env, NEP_GH_FAAL_LIJST: '1' });
    gelijk([r3.code, titels().length], [0, 0], 'de lijst opvragen mislukt\n' + r3.uit);
    const r4 = draaiStap(script, map, { ...env, NEP_GH_FAAL_MAAK: '1' });
    gelijk([r4.code, titels().length], [0, 0], 'een melding maken mislukt\n' + r4.uit);
  });
}

// =================================================================================
// De oude plan-gereedschappen (plan-reel.cjs, plan-carrousel.cjs) met de tabel. Ze vragen het pakket "sharp";
// is dat niet geïnstalleerd (npm ci), dan slaan we dit deel over.
async function deelPlangereedschap() {
  let heeftSharp = true;
  try { require.resolve('sharp', { paths: [WORTEL] }); } catch { heeftSharp = false; }
  if (!heeftSharp) { console.log('        (overgeslagen: het pakket sharp is niet geïnstalleerd; draai eerst npm ci)'); return; }
  try { maakMedia(); } catch (e) { await toets('ffmpeg maakt de proefvideo\'s', () => { throw new Error('ffmpeg ontbreekt: ' + e.message); }); return; }
  const env = { ...process.env, NODE_PATH: path.join(WORTEL, 'node_modules') };
  const pakket = 'pakketten/2026-12-20-YS60-proef';
  function werkmap(naam, planning = []) {
    const map = path.join(TMP, naam);
    for (const d of ['gereedschap', 'src', 'mini', 'beeld/reels', 'beeld/berichten/nl', `${pakket}/instagram`, 'carrousel']) fs.mkdirSync(path.join(map, d), { recursive: true });
    for (const f of ['gereedschap/plan-reel.cjs', 'gereedschap/plan-carrousel.cjs', 'src/accounts.cjs']) fs.copyFileSync(path.join(WORTEL, ...f.split('/')), path.join(map, ...f.split('/')));
    fs.writeFileSync(path.join(map, 'planning.json'), JSON.stringify({ tijdzone: 'Europe/Amsterdam', gemaakt: '2026-09-20', items: planning }, null, 2) + '\n');
    fs.writeFileSync(path.join(map, 'gedaan.json'), JSON.stringify({ items: [] }, null, 1));
    fs.copyFileSync(media('goed.mp4'), path.join(map, pakket, 'instagram', 'reel.mp4'));
    fs.copyFileSync(media('omslag.jpg'), path.join(map, pakket, 'instagram', 'omslag.jpg'));
    fs.writeFileSync(path.join(map, pakket, 'instagram', 'bijschrift.txt'), 'Why is this a test?\n\nBecause.\n\n#test');
    return map;
  }
  const reel = (map, args) => { const r = spawnSync(process.execPath, [path.join(map, 'gereedschap', 'plan-reel.cjs'), ...args], { cwd: map, env, encoding: 'utf8' }); return { code: r.status, uit: `${r.stdout}${r.stderr}` }; };
  const k1 = (...extra) => ['--account', 'kanaal-1', `${pakket}/instagram/reel.mp4`, `${pakket}/instagram/omslag.jpg`, `${pakket}/instagram/bijschrift.txt`, MORGEN(), '20:00', 'YS60', '--omslag-ms', '2100', ...extra];

  await toets('plan-reel.cjs werkt voor @ygdigital.nl en kanaal 1 zoals het deed, en verwijst kanaal 2 en account 3 naar inplannen.cjs', () => {
    const map = werkmap('plan-reel');
    const voor = fs.readFileSync(path.join(map, 'planning.json'), 'utf8');
    const proef = reel(map, k1('--proef'));
    gelijk(proef.code, 0, 'proef kanaal 1\n' + proef.uit);
    bevat(proef.uit, `item ${MORGEN()}-k1-ys60 (kanaal-1)`, 'het item');
    gelijk(fs.readFileSync(path.join(map, 'planning.json'), 'utf8'), voor, 'proef schrijft niets');
    const echt = reel(map, k1());
    gelijk(echt.code, 0, 'kanaal 1\n' + echt.uit);
    const item = lees(map, 'planning.json').items[0];
    gelijk(item, { id: `${MORGEN()}-k1-ys60`, datum: MORGEN(), tijd: '20:00', soort: 'bericht', taal: 'en', account: 'kanaal-1', beeld: [`${pakket}/instagram/reel.mp4`], omslag: `${pakket}/instagram/omslag.jpg`, omslagMs: 2100,
      titel: 'Kanaal 1 YS60: Why is this a test?', tekst: 'Why is this a test?\n\nBecause.\n\n#test', inhaaluren: 18, eenmalig: true }, 'het item van kanaal 1');
    waar(bestaat(path.join(map, 'mini', 'pakketten-2026-12-20-YS60-proef-instagram-omslag.jpg')), 'het kleintje');
    const dubbel = reel(map, k1());
    gelijk(dubbel.code, 1, 'nog een keer'); bevat(dubbel.uit, 'bestaat al', 'dubbel');
    const yg = reel(map, [`${pakket}/instagram/reel.mp4`, `${pakket}/instagram/omslag.jpg`, `${pakket}/instagram/bijschrift.txt`, MORGEN(), '20:00', 'R99']);
    gelijk(yg.code, 0, '@ygdigital.nl op hetzelfde moment als kanaal 1\n' + yg.uit);
    const r99 = lees(map, 'planning.json').items.find(i => i.id === `${MORGEN()}-reel-r99`);
    gelijk([r99.account, r99.beeld, r99.omslag, r99.taal], [undefined, ['reels/R99.mp4'], 'reels/R99.jpg', 'nl'], 'het item van @ygdigital.nl heeft geen "account"');
    waar(bestaat(path.join(map, 'beeld', 'reels', 'R99.mp4')), 'de video staat in beeld/reels');
    for (const [acc, code] of [['kanaal-2', 'K2-W06'], ['account-3', 'G11']]) {
      const r = reel(map, ['--account', acc, `${pakket}/instagram/reel.mp4`, `${pakket}/instagram/omslag.jpg`, `${pakket}/instagram/bijschrift.txt`, MORGEN(), '21:00', code]);
      gelijk(r.code, 1, acc); bevat(r.uit, 'plan je in met gereedschap/inplannen.cjs', acc);
    }
    const onbekend = reel(map, ['--account', 'kanaal-9', 'a', 'b', 'c', MORGEN(), '21:00', 'YS61']);
    gelijk(onbekend.code, 1, 'onbekend account'); bevat(onbekend.uit, 'kies uit ygdigital, kanaal-1, kanaal-2, account-3', 'onbekend account');
    const fouteCode = reel(map, ['--account', 'kanaal-1', `${pakket}/instagram/reel.mp4`, `${pakket}/instagram/omslag.jpg`, `${pakket}/instagram/bijschrift.txt`, MORGEN(), '21:00', 'G11']);
    gelijk(fouteCode.code, 1, 'een code van een ander account');

    // inplannen.cjs maakt voor hetzelfde pakket precies hetzelfde item
    const a = nepAutomaat('plan-reel-gelijk', { bestanden: { [`${pakket}/instagram/reel.mp4`]: media('goed.mp4'), [`${pakket}/instagram/omslag.jpg`]: media('omslag.jpg') } });
    const pm = path.join(a.pc, ...pakket.split('/'));
    fs.writeFileSync(path.join(pm, 'pakket.json'), JSON.stringify({ code: 'YS60', titel: 'Proef' }));
    fs.writeFileSync(path.join(pm, 'keuring.json'), JSON.stringify({ code: 'YS60', besluiten: [besluit('pakket', 'ok', 'Beide OK YS60', 60), besluit('bijschrift', 'ok', 'Beide OK YS60', 60)] }));
    fs.writeFileSync(path.join(pm, 'instagram', 'bijschrift.txt'), 'Why is this a test?\n\nBecause.\n\n#test');
    const r = plan(a, ['--account', 'kanaal-1', '--pakket', pm, '--video', path.join(pm, 'instagram', 'reel.mp4'), '--omslag', path.join(pm, 'instagram', 'omslag.jpg'), '--bijschrift', path.join(pm, 'instagram', 'bijschrift.txt'), '--datum', MORGEN(), '--tijd', '20:00', '--omslag-ms', '2100']);
    gelijk(r.code, 0, 'inplannen.cjs\n' + r.uit);
    gelijk(planningOp(a).items[0], item, 'inplannen.cjs en plan-reel.cjs maken hetzelfde item');
  });

  await toets('plan-carrousel.cjs: een ander account op hetzelfde moment zit niet in de weg, het eigen account wel', () => {
    const m = MORGEN();
    const map = werkmap('plan-carrousel', [reelK1('YS50', { datum: m, tijd: '19:00' })]);
    const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    for (const n of [1, 2]) ff(['-f', 'lavfi', '-i', 'testsrc2=size=1080x1350:rate=1', '-frames:v', '1', '-q:v', '6', path.join(map, 'carrousel', `plaat-${n}.jpg`)]);
    fs.writeFileSync(path.join(map, 'carrousel', 'bijschrift.txt'), 'Een carrousel.\n\n#toets');
    const car = (tijd, code) => { const r = spawnSync(process.execPath, [path.join(map, 'gereedschap', 'plan-carrousel.cjs'), 'carrousel', m, tijd, code], { cwd: map, env, encoding: 'utf8' }); return { code: r.status, uit: `${r.stdout}${r.stderr}` }; };
    const r1 = car('19:00', 'K90');
    gelijk(r1.code, 0, 'zelfde moment als kanaal 1\n' + r1.uit);
    gelijk(lees(map, 'planning.json').items.map(i => [i.id, i.account]), [[`${m}-k1-ys50`, 'kanaal-1'], [`${m}-bericht-k90`, undefined]], 'beide staan erin');
    const r2 = car('19:00', 'K91');
    gelijk(r2.code, 1, 'het eigen account op hetzelfde moment'); bevat(r2.uit, 'staat voor @ygdigital.nl al iets gepland', 'melding');
  });
}

// =================================================================================
(async () => {
  const delen = [['plaatsen', deelPlaatsen], ['inplannen', deelInplannen], ['workflow', deelWorkflow], ['plangereedschap', deelPlangereedschap]];
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
