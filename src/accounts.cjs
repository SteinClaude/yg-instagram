// De tabel met alle Instagram-accounts van de automaat. Eén plek, gebruikt door:
//   src/plaatsen.cjs            (plaatsen, sleutelteller, stand per account)
//   gereedschap/inplannen.cjs   (het commando waarmee een maker zijn eigen post inplant)
//   gereedschap/plan-reel.cjs en plan-carrousel.cjs, gereedschap/controleer.cjs
//   gereedschap/toets-automaat.cjs (de toetsen)
//
// EEN ACCOUNT ERBIJ = één regel in ACCOUNTS hieronder + twee geheimen in GitHub (LEESMIJ.md, "Meer accounts").
// Aan de workflow hoeft niets te veranderen: die geeft alle geheimen door (IG_GEHEIMEN) en dit bestand kiest op naam.
//
// De map en de logboeken van Actions zijn OPENBAAR. Van de kanalen van YG-Social staat hier daarom alleen een
// label ("kanaal 2"): nooit de naam, de handle of het accountnummer. Die staan alleen in de geheimen.
//
// Per account:
//   naam       de waarde van "account" in een item van planning.json (kleine letters, cijfers, streepjes)
//   label      hoe het account heet in logboek, status.json en meldingen
//   openbaar   true = naam en accountnummer mogen in logboeken staan (alleen @ygdigital.nl; staat ook in LEESMIJ.md)
//   kort       stukje in het id van een item: <datum>-<kort>-<code>
//   geheim, geheimId   de namen van de twee geheimen in GitHub (sleutel en accountnummer)
//   codes      de vorm van een pakketcode van dit account; voorbeeld = een code die klopt
//   keuringen  welke keuringen van Andries in keuring.json moeten staan voordat inplannen.cjs iets inplant.
//              Zonder dit veld kan inplannen.cjs niet voor dit account worden gebruikt.
//              Kanaal 2 en account 3: voorlopig alleen "pakket". Andries beslist nog of daar een eigen
//              "bijschrift OK" bij komt; dan wordt het hier ['pakket', 'bijschrift'].
//   maker      het crewlid dat voor dit account inplant (de auteur van de commit)
//   taal       het veld "taal" van een item
//   maxMb      grootste video die inplannen.cjs aanneemt (standaard MAX_MB); de repo moet klein blijven
'use strict';

const ACCOUNTS = [
  { naam: 'ygdigital', label: '@ygdigital.nl', openbaar: true, geheim: 'IG_TOKEN', geheimId: 'IG_USER_ID', codes: /^[A-Z]\d{2}$/, voorbeeld: 'R17', taal: 'nl' },
  { naam: 'kanaal-1', label: 'kanaal 1', kort: 'k1', geheim: 'IG_TOKEN_K1', geheimId: 'IG_USER_ID_K1', codes: /^Y[SL]\d{2}$/, voorbeeld: 'YS48 of YL02', keuringen: ['pakket', 'bijschrift'], maker: 'Manon', taal: 'en' },
  { naam: 'kanaal-2', label: 'kanaal 2', kort: 'k2', geheim: 'IG_TOKEN_K2', geheimId: 'IG_USER_ID_K2', codes: /^K2-[A-Z]+\d+$/, voorbeeld: 'K2-W06', keuringen: ['pakket'], maker: 'Finn', taal: 'en' },
  { naam: 'account-3', label: 'account 3', kort: 'k3', geheim: 'IG_TOKEN_K3', geheimId: 'IG_USER_ID_K3', codes: /^G\d+$/, voorbeeld: 'G11', keuringen: ['pakket'], maker: 'Koen', taal: 'en' },
];

// De tak waar de automaat van leest (GitHub start geplande workflows alleen op de standaardtak).
const HOOFDTAK = 'main';
// Grootste video die een maker mag inplannen. Meta staat 300 MB toe; dit is onze eigen grens voor de repo.
const MAX_MB = 25;
// De soorten keuring die docs/PAKKETKAART.md kent.
const KEURSOORTEN = ['script', 'pakket', 'bijschrift'];

// Klopt de tabel? Geeft een lijst met wat er mis is (leeg = goed). Zo valt een tikfout in een nieuwe regel
// meteen op, in de toetsen en bij de eerste start, in plaats van als een account dat stil niets doet.
function controleerTabel(lijst = ACCOUNTS) {
  const fout = [], gezien = { naam: new Set(), kort: new Set(), geheim: new Set(), label: new Set() };
  if (!Array.isArray(lijst) || !lijst.length) return ['de tabel is leeg'];
  lijst.forEach((a, i) => {
    const wie = a && a.naam ? `"${a.naam}"` : `regel ${i + 1}`;
    if (!a || typeof a !== 'object') return fout.push(`${wie}: geen account`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.naam || '')) fout.push(`${wie}: naam mag alleen kleine letters, cijfers en losse streepjes hebben`);
    if (!a.label || typeof a.label !== 'string') fout.push(`${wie}: label ontbreekt`);
    for (const veld of ['geheim', 'geheimId']) if (!/^[A-Z][A-Z0-9_]*$/.test(a[veld] || '')) fout.push(`${wie}: ${veld} moet een naam in hoofdletters zijn`);
    if (a.geheim && a.geheim === a.geheimId) fout.push(`${wie}: geheim en geheimId zijn gelijk`);
    if (!(a.codes instanceof RegExp)) fout.push(`${wie}: codes moet een patroon zijn`);
    else if (!a.voorbeeld || !String(a.voorbeeld).split(' of ').every(v => a.codes.test(v))) fout.push(`${wie}: het voorbeeld past niet op het patroon van de codes`);
    if (i > 0 && !/^[a-z][a-z0-9]*$/.test(a.kort || '')) fout.push(`${wie}: kort ontbreekt (kleine letters en cijfers)`);
    if (a.keuringen !== undefined) {
      if (!Array.isArray(a.keuringen) || !a.keuringen.length || a.keuringen.some(k => !KEURSOORTEN.includes(k))) fout.push(`${wie}: keuringen moet een lijst zijn uit ${KEURSOORTEN.join(', ')}`);
      if (!a.maker) fout.push(`${wie}: maker ontbreekt (wie plant voor dit account in?)`);
      if (!a.kort) fout.push(`${wie}: kort ontbreekt`);
    }
    if (a.maxMb !== undefined && !(a.maxMb > 0 && a.maxMb <= 300)) fout.push(`${wie}: maxMb moet tussen 0 en 300 liggen`);
    for (const [veld, waarden] of [['naam', [a.naam]], ['kort', [a.kort]], ['label', [a.label]], ['geheim', [a.geheim, a.geheimId]]]) {
      for (const w of waarden) {
        if (w === undefined) continue;
        if (gezien[veld].has(w)) fout.push(`${wie}: ${veld} "${w}" komt twee keer voor`);
        gezien[veld].add(w);
      }
    }
  });
  return fout;
}

const problemen = controleerTabel();
if (problemen.length) throw new Error('src/accounts.cjs klopt niet: ' + problemen.join('; '));

const PER_NAAM = new Map(ACCOUNTS.map(a => [a.naam, a]));
// Een item zonder "account" hoort bij het eerste account uit de tabel (@ygdigital.nl), zoals altijd.
const EERSTE = ACCOUNTS[0].naam;
const accountVan = item => (item && item.account) || EERSTE;
const namen = () => ACCOUNTS.map(a => a.naam);
const zoek = naam => PER_NAAM.get(naam) || null;

// De geheimen per account: { <naam>: { token, id } }. Twee bronnen, in deze volgorde:
//   1. een eigen omgevingsvariabele met de naam van het geheim (IG_TOKEN_K1), zoals het altijd ging;
//   2. IG_GEHEIMEN: alle geheimen van de repo als JSON (de workflow zet daar toJSON(secrets) in).
// Door 2 hoeft de workflow niet te veranderen als er een account bij komt. Een waarde wordt nooit
// aangepast (ook geen spaties eraf): de vingerafdruk in sleutel.json moet gelijk blijven.
function leesGeheimen(env = process.env) {
  let alle = {};
  if (env.IG_GEHEIMEN) {
    try { const o = JSON.parse(env.IG_GEHEIMEN); if (o && typeof o === 'object' && !Array.isArray(o)) alle = o; }
    catch { /* onleesbaar: dan tellen alleen de losse variabelen */ }
  }
  const kies = n => { const w = env[n] || alle[n]; return typeof w === 'string' ? w : ''; };
  return Object.fromEntries(ACCOUNTS.map(a => [a.naam, { token: kies(a.geheim), id: kies(a.geheimId) }]));
}

// Het id van een item: <datum>-<kort>-<code in kleine letters>.
const itemId = (account, datum, code) => `${datum}-${zoek(account).kort}-${String(code).toLowerCase()}`;
// Hoort dit id (uit planning.json of gedaan.json) bij deze code van dit account?
const idVanCode = (account, code) => {
  const staart = `-${zoek(account).kort}-${String(code).toLowerCase()}`;
  return id => typeof id === 'string' && /^\d{4}-\d{2}-\d{2}-/.test(id) && id.slice(10) === staart;
};
// "Kanaal 2", voor in een titel.
const hoofdletter = t => t.charAt(0).toUpperCase() + t.slice(1);

module.exports = { ACCOUNTS, HOOFDTAK, MAX_MB, KEURSOORTEN, EERSTE, accountVan, namen, zoek, leesGeheimen, itemId, idVanCode, hoofdletter, controleerTabel };
