// Het commando waarmee een maker zijn eigen post in de automaat inplant. Eén keer draaien = één item in
// planning.json, alleen voor het eigen account, en alleen als de keuring van Andries is vastgelegd.
//
//   node <map van de automaat>/gereedschap/inplannen.cjs --account <account> --pakket <map met pakket.json en keuring.json>
//        --video <video.mp4> --omslag <omslag.jpg> --bijschrift <bijschrift.txt> --datum <jjjj-mm-dd> --tijd <uu:mm>
//        [--omslag-ms 800] [--bron <domein>]... [--naschrift "<regel>"]... [--proef]
//
//   node <map van de automaat>/gereedschap/inplannen.cjs --intrekken --account <account> --code <code> --reden "<waarom>" [--proef]
//
// Je draait het vanuit je eigen map; de paden naar je pakket, video, omslag en bijschrift zijn paden in je eigen
// map. De map van de automaat is alleen de plek waar dit commando staat: daar wordt niets in gewijzigd.
//
// Wat het doet:
//   1. keuring: leest pakket.json en keuring.json uit je pakketmap (docs/PAKKETKAART.md). Per soort die het account
//      vraagt (src/accounts.cjs) telt het laatste besluit. "niet-ok" en "ingetrokken" zijn geen OK, een besluit van
//      vóór een nieuwe vraag ook niet. De letterlijke woorden van Andries en de tijd komen in de commit.
//   2. video: MP4 met H.264 (4:2:0) en AAC, staand 1080 x 1920, 23-60 beelden per seconde, 3 s tot 15 min, niet te
//      groot (src/accounts.cjs, standaard 25 MB). Klopt alleen het geluid of de verpakking niet (te hoge
//      samplefrequentie, edit list, moov niet vooraan), dan maakt het commando zelf de Instagram-versie, zonder het
//      beeld opnieuw te coderen. Je eigen bestand blijft zoals het is.
//   3. omslag: JPEG van 1080 x 1920, hoogstens 8 MB.
//   4. bijschrift: niet leeg, hoogstens 2200 tekens en 30 hashtags, geen @naam, geen link en geen domeinnaam
//      (een bron die als domein heet, noem je met --bron timeanddate.com), en geen woord uit de lijst met verboden
//      woorden. Die lijst is een tekstbestand buiten git, één woord of naam per regel; het pad staat in de
//      omgevingsvariabele YG_VERBODEN_WOORDEN. Andries zet daar de namen van zijn kanalen in.
//   5. dubbel: weigert een code, id of tijdstip dat voor dat account al bestaat.
//   6. inplannen: zet video en omslag onder beeld/<account>/, maakt een kleintje voor het dashboard en voegt één item
//      toe aan planning.json. Dat gebeurt in een eigen, tijdelijke kopie van de automaat (alleen wat nodig is, een
//      paar honderd kB), niet in de map waar dit commando staat. Heeft iemand anders intussen iets vastgelegd, dan
//      wordt alles opnieuw nagekeken en uitgerekend op de nieuwe stand; er wordt nooit iets samengevoegd met de hand.
//   --proef: alles nalopen en tonen, niets wijzigen.
//
// Alleen nodig: node, git en ffmpeg (met ffprobe). Geen npm-pakketten.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const T = require('../src/accounts.cjs');

const WORTEL = path.join(__dirname, '..');
const GEBRUIK = [
  'gebruik:',
  '  node gereedschap/inplannen.cjs --account <account> --pakket <map> --video <video.mp4> --omslag <omslag.jpg>',
  '       --bijschrift <bijschrift.txt> --datum <jjjj-mm-dd> --tijd <uu:mm> [--omslag-ms 800] [--bron <domein>]... [--naschrift "<regel>"]... [--proef]',
  '  node gereedschap/inplannen.cjs --intrekken --account <account> --code <code> --reden "<waarom>" [--proef]',
].join('\n');

class Stop extends Error {}
const stop = m => { throw new Stop(m); };

// ---------------------------------------------------------------- hulpjes
// Git vraagt nooit iets op het scherm (dan zou het commando stil blijven hangen); lukt inloggen niet, dan
// stopt het met de melding van git.
const zonderGit = extra => { const e = { ...process.env, GIT_TERMINAL_PROMPT: '0', ...extra }; for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete e[k]; return e; };
// Een adres met een wachtwoord erin (https://naam:geheim@…) komt nooit in een melding.
const zonderWachtwoord = t => String(t).replace(/\/\/[^/@\s]+@/g, '//***@');
// ruw: de uitvoer letterlijk (voor de inhoud van een bestand); anders zonder de laatste regelovergang.
function git(map, args, { env, magFalen = false, ruw = false, seconden = 120 } = {}) {
  try {
    const uit = execFileSync('git', args, { cwd: map, env: zonderGit(env), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, timeout: seconden * 1000 });
    return ruw ? uit : uit.replace(/\r?\n$/, '');
  } catch (e) {
    if (magFalen) return null;
    const waarom = e.code === 'ETIMEDOUT' ? `duurde langer dan ${seconden} seconden` : String(e.stderr || e.message).trim().split('\n').slice(-4).join(' | ');
    const fout = new Error(zonderWachtwoord(`git ${args[0]} lukte niet: ${waarom}`));
    fout.stderr = zonderWachtwoord(String(e.stderr || ''));
    throw fout;
  }
}
// De tijdelijke map weghalen. Lukt dat niet (Windows houdt soms een bestand vast), dan is dat geen fout: de
// uitkomst van het commando mag er nooit door veranderen.
function ruimOp(map) { try { fs.rmSync(map, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* blijft staan in de tijdelijke map van het systeem */ } }
// Getallen met een komma, zoals we ze schrijven.
const komma = (n, d = 1) => Number(n).toFixed(d).replace('.', ',');
const sha256 = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const mb = bytes => komma(bytes / 1048576) + ' MB';
const kb = bytes => Math.round(bytes / 1024) + ' kB';
const leesTekst = f => fs.readFileSync(f, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
function leesJson(f, wat) {
  if (!fs.existsSync(f)) stop(`${wat} ontbreekt: ${f}`);
  try { return JSON.parse(leesTekst(f)); } catch (e) { return stop(`${wat} is geen geldige JSON (${f}): ${e.message}`); }
}

// --- tijd: alles in Amsterdamse tijd, zoals planning.json en src/plaatsen.cjs
function amsterdam(d = new Date()) {
  const p = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  return { datum: `${p.year}-${p.month}-${p.day}`, tijd: `${p.hour}:${p.minute}` };
}
const minuten = (datum, tijd) => { const [j, m, d] = datum.split('-').map(Number), [u, mi] = tijd.split(':').map(Number); return Date.UTC(j, m - 1, d, u, mi) / 60000; };
const DAGEN = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'], MAANDEN = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
// "di 24 nov 2026"
function leesbareDag(datum) { const [j, m, d] = datum.split('-').map(Number); return `${DAGEN[new Date(Date.UTC(j, m - 1, d)).getUTCDay()]} ${d} ${MAANDEN[m - 1]} ${j}`; }
// Een tijdstip uit keuring.json ("2026-11-22T15:20:31+01:00") als "zo 22 nov 2026 15:20" in Amsterdamse tijd.
function leesbaarMoment(iso) { const a = amsterdam(new Date(iso)); return `${leesbareDag(a.datum)} ${a.tijd}`; }
// De afwijking van Amsterdam op een wandkloktijd: "+01:00" in de winter, "+02:00" in de zomer.
function afwijking(datum, tijd) {
  const [j, m, d] = datum.split('-').map(Number), [u, mi] = tijd.split(':').map(Number);
  for (const uren of [1, 2]) { const a = amsterdam(new Date(Date.UTC(j, m - 1, d, u - uren, mi))); if (a.datum === datum && a.tijd === tijd) return `+0${uren}:00`; }
  return '+01:00';
}
function bestaandeDatum(datum) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum || ''); if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

// ---------------------------------------------------------------- opties
function leesOpties(argv) {
  const o = { bron: [], naschrift: [], proef: false, intrekken: false, omslagMs: 800 };
  const metWaarde = { '--account': 'account', '--pakket': 'pakket', '--video': 'video', '--omslag': 'omslag', '--bijschrift': 'bijschrift',
    '--datum': 'datum', '--tijd': 'tijd', '--code': 'code', '--reden': 'reden' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const waarde = () => { const w = argv[++i]; if (w === undefined || (w.startsWith('--') && a !== '--naschrift' && a !== '--reden')) stop(`${a} vraagt een waarde\n${GEBRUIK}`); return w; };
    if (a === '--proef') o.proef = true;
    else if (a === '--intrekken') o.intrekken = true;
    else if (a === '--help' || a === '-h') stop(GEBRUIK);
    else if (a === '--bron') o.bron.push(waarde().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, ''));
    else if (a === '--naschrift') o.naschrift.push(waarde());
    else if (a === '--omslag-ms') { const w = waarde(); if (!/^\d+$/.test(w)) stop('--omslag-ms vraagt een geheel aantal milliseconden'); o.omslagMs = Number(w); }
    else if (metWaarde[a]) { if (o[metWaarde[a]] !== undefined) stop(`${a} staat er twee keer`); o[metWaarde[a]] = waarde(); }
    else stop(`onbekende optie ${a}\n${GEBRUIK}`);
  }
  return o;
}

// ---------------------------------------------------------------- keuring (docs/PAKKETKAART.md)
// Geeft per gevraagde soort { soort, ok, reden, besluit }. Het laatste besluit per soort telt.
function beoordeelKeuring(pakket, keuring, soorten, nu = Date.now()) {
  const lijst = keuring && Array.isArray(keuring.besluiten) ? keuring.besluiten : null;
  return soorten.map(soort => {
    const r = { soort, ok: false, reden: '', besluit: null };
    if (!lijst) { r.reden = 'keuring.json heeft geen lijst "besluiten"'; return r; }
    const van = lijst.filter(b => b && typeof b === 'object' && b.soort === soort);
    if (!van.length) { r.reden = `er staat geen besluit "${soort}" in keuring.json`; return r; }
    if (van.some(b => typeof b.tijd !== 'string' || !Number.isFinite(Date.parse(b.tijd)))) { r.reden = `een besluit "${soort}" in keuring.json heeft geen leesbare tijd`; return r; }
    const laatste = van[van.length - 1];
    const nieuwste = van.reduce((a, b) => Date.parse(b.tijd) >= Date.parse(a.tijd) ? b : a);
    if (laatste !== nieuwste && laatste.uitkomst !== nieuwste.uitkomst) { r.reden = `de volgorde en de tijden van de besluiten "${soort}" in keuring.json spreken elkaar tegen`; return r; }
    const b = laatste; r.besluit = b;
    if (b.uitkomst === 'ingetrokken') { r.reden = `het besluit "${soort}" is ingetrokken (${b.tijd}); de vraag staat weer open`; return r; }
    if (b.uitkomst === 'niet-ok') { r.reden = `het laatste besluit "${soort}" is niet OK (${b.tijd})${b.opmerking ? `: ${b.opmerking}` : ''}`; return r; }
    if (b.uitkomst !== 'ok') { r.reden = `het laatste besluit "${soort}" heeft een onbekende uitkomst ("${b.uitkomst}")`; return r; }
    if (String(b.door || '').trim().toLowerCase() !== 'andries') { r.reden = `het besluit "${soort}" is niet van Andries (door: ${b.door === undefined ? 'niet ingevuld' : b.door})`; return r; }
    if (b.via !== 'paneel' && b.via !== 'sessie') { r.reden = `bij het besluit "${soort}" staat niet of het uit het paneel of uit de sessie komt (via: ${b.via})`; return r; }
    if (typeof b.tekst !== 'string' || !b.tekst.trim()) { r.reden = `bij het besluit "${soort}" ontbreken de letterlijke woorden van Andries (tekst)`; return r; }
    if (Date.parse(b.tijd) > nu + 5 * 60000) { r.reden = `het besluit "${soort}" heeft een tijd in de toekomst (${b.tijd})`; return r; }
    const vraag = pakket && pakket.vraagt && typeof pakket.vraagt === 'object' ? pakket.vraagt[soort] : undefined;
    if (vraag !== undefined) {
      if (typeof vraag !== 'string' || !Number.isFinite(Date.parse(vraag))) { r.reden = `het tijdstip bij "vraagt.${soort}" in pakket.json is niet leesbaar`; return r; }
      if (Date.parse(vraag) > Date.parse(b.tijd)) { r.reden = `er staat een nieuwe vraag "${soort}" open (van ${vraag}), na het laatste besluit (${b.tijd})`; return r; }
    }
    r.ok = true;
    return r;
  });
}

// ---------------------------------------------------------------- bijschrift
// Adressen die nooit in een bijschrift mogen, ook niet als "bron": eigen profielen en korte doorverwijzers.
const NOOIT = ['instagram.com', 'instagr.am', 'youtube.com', 'youtu.be', 'tiktok.com', 'snapchat.com', 'facebook.com', 'fb.com', 'fb.me',
  'x.com', 'twitter.com', 't.co', 'threads.net', 'threads.com', 'linktr.ee', 'beacons.ai', 'bit.ly', 'tinyurl.com', 'discord.gg', 'discord.com',
  'twitch.tv', 'patreon.com', 'wa.me', 'whatsapp.com', 't.me', 'telegram.me', 'pinterest.com', 'linkedin.com', 'github.com', 'github.io'];
// Een @naam: een handle of het stuk na het @ van een e-mailadres. Een los @ (het teken zelf, of "@.") telt niet.
const NAAM = /@[\p{L}\p{N}_][\p{L}\p{N}._]*/gu;
const onder = (host, domein) => host === domein || host.endsWith('.' + domein);
const plat = t => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

// De lijst met verboden woorden: een tekstbestand buiten git, één woord of naam per regel, # voor commentaar.
// Geeft { pad, regels: [{ nr, woord }] } of null als er geen lijst is ingesteld.
function leesVerboden(env = process.env) {
  const pad = env.YG_VERBODEN_WOORDEN;
  if (!pad) return null;
  const vol = path.resolve(pad);
  if (!fs.existsSync(vol) || !fs.statSync(vol).isFile()) stop(`de lijst met verboden woorden (YG_VERBODEN_WOORDEN) is niet gevonden: ${vol}`);
  if (git(path.dirname(vol), ['rev-parse', '--is-inside-work-tree'], { magFalen: true }) === 'true')
    stop(`de lijst met verboden woorden staat in een map van git (${path.dirname(vol)}). Zet hem erbuiten: hij mag nooit in een repo komen.`);
  const regels = leesTekst(vol).split('\n').map((r, i) => ({ nr: i + 1, woord: r.trim() })).filter(r => r.woord && !r.woord.startsWith('#'));
  return { pad: vol, regels };
}
// Welke regels van de lijst komen in deze tekst voor? Geeft de regelnummers (nooit het woord zelf).
function verbodenIn(tekst, verboden) {
  if (!verboden) return [];
  const klein = tekst.toLowerCase(), kaal = plat(tekst);
  return verboden.regels.filter(r => {
    const w = r.woord.toLowerCase(), k = plat(r.woord);
    if (k.length < 3) return false;                          // te kort om iets te zeggen; zou overal op passen
    return klein.includes(w) || (k.length >= 6 && kaal.includes(k));
  }).map(r => r.nr);
}
// Maakt een tekst geschikt voor een openbare commit: geen woord van de lijst, geen @naam, geen link.
function openbaar(tekst, verboden) {
  let t = String(tekst).replace(/\s+/g, ' ').trim();
  if (verboden) for (const r of verboden.regels) {
    if (plat(r.woord).length < 3) continue;
    t = t.replace(new RegExp(r.woord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '[weggelaten]');
  }
  t = t.replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[weggelaten]').replace(NAAM, '[weggelaten]');
  if (verboden && verbodenIn(t, verboden).length) t = '[weggelaten]';     // de naam stond er met spaties of tekens ertussen
  return t;
}

// Kijkt het bijschrift na. Geeft { tekst, tekens, tags, fouten, opmerkingen, bronnen }.
function controleerBijschrift(ruw, { bron = [], verboden = null } = {}) {
  const tekst = String(ruw).replace(/^﻿/, '').replace(/\r\n?/g, '\n').replace(/\s+$/, '');
  const fouten = [], opmerkingen = [], bronnen = [];
  const tags = (tekst.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (!tekst) fouten.push('het bijschrift is leeg');
  if (tekst.length > 2200) fouten.push(`het bijschrift is ${tekst.length} tekens (Instagram: hoogstens 2200)`);
  if (tags > 30) fouten.push(`het bijschrift heeft ${tags} hashtags (Instagram: hoogstens 30)`);
  // @naam: een handle of een e-mailadres. Een los @ (het teken zelf) mag: daar kan geen naam achter zitten.
  const namen = tekst.match(NAAM) || [];
  if (namen.length) fouten.push(`er staat ${namen.length === 1 ? 'een @naam' : `${namen.length} keer een @naam`} in (${[...new Set(namen)].slice(0, 3).join(', ')}); handles en e-mailadressen mogen niet in een bijschrift`);
  for (const b of bron) if (NOOIT.some(d => onder(b, d))) fouten.push(`--bron ${b} kan niet: dat adres mag nooit in een bijschrift`);
  const magAlsBron = host => bron.some(b => onder(host, b)) && !NOOIT.some(d => onder(host, d));
  // links
  let rest = tekst;
  for (const link of tekst.match(/\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi) || []) {
    const host = link.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#:]/)[0].replace(/\.+$/, '');
    if (magAlsBron(host)) bronnen.push(host);
    else if (NOOIT.some(d => onder(host, d))) fouten.push(`er staat een link naar ${host} in; dat adres mag nooit in een bijschrift`);
    else fouten.push(`er staat een link in (${link.slice(0, 60)}); alleen een bron die je met --bron ${host} noemt mag blijven`);
    rest = rest.split(link).join(' ');
  }
  // domeinnamen zonder http ervoor: woord.letters
  for (const kandidaat of rest.match(/(?<![\p{L}\p{N}@._-])(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+\p{L}{2,}(?![\p{L}\p{N}-])/gu) || []) {
    const host = kandidaat.toLowerCase().replace(/^www\./, '');
    if (magAlsBron(host)) { bronnen.push(host); continue; }
    fouten.push(`"${kandidaat}" lijkt op een domeinnaam. Is het een bron, noem hem dan met --bron ${host}; ontbreekt er een spatie na een punt, zet die er dan in`);
  }
  const nrs = verbodenIn(tekst, verboden);
  if (nrs.length) fouten.push(`er staat een woord uit de lijst met verboden woorden in (regel ${nrs.join(', ')} van die lijst)`);
  if (tags > 5) opmerkingen.push(`${tags} hashtags; de afspraak is hoogstens 5`);
  return { tekst, tekens: tekst.length, tags, fouten: [...new Set(fouten)], opmerkingen, bronnen: [...new Set(bronnen)] };
}

// ---------------------------------------------------------------- video en omslag
function ffprobe(f) {
  try { return JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 })); }
  catch (e) {
    if (e.code === 'ENOENT') stop('ffprobe is niet gevonden; installeer ffmpeg (ffprobe zit erbij) en zorg dat het in het zoekpad staat');
    return stop(`ffprobe kan ${path.basename(f)} niet lezen: ${String(e.stderr || e.message).trim().split('\n')[0]}`);
  }
}
// De dozen op het hoogste niveau van een MP4, in volgorde. Zo zien we of moov vóór mdat staat (dan kan
// Instagram meteen beginnen) en of er edit lists in zitten (Meta: "no edit lists").
function mp4Opbouw(f) {
  const fd = fs.openSync(f, 'r'), grootte = fs.fstatSync(fd).size, kop = Buffer.alloc(16), volgorde = [];
  let pos = 0, elst = 0;
  try {
    while (pos + 8 <= grootte && volgorde.length < 64) {
      fs.readSync(fd, kop, 0, 16, pos);
      let lengte = kop.readUInt32BE(0), hoofd = 8;
      const soort = kop.toString('latin1', 4, 8);
      if (lengte === 1) { lengte = Number(kop.readBigUInt64BE(8)); hoofd = 16; } else if (lengte === 0) lengte = grootte - pos;
      if (lengte < hoofd || !/^[\x20-\x7e]{4}$/.test(soort)) break;
      volgorde.push(soort);
      if (soort === 'moov') {
        const buf = Buffer.alloc(Math.min(lengte, 64 * 1024 * 1024));
        fs.readSync(fd, buf, 0, buf.length, pos);
        for (let i = buf.indexOf('elst', 0, 'latin1'); i > -1; i = buf.indexOf('elst', i + 1, 'latin1')) elst++;
      }
      pos += lengte;
    }
  } finally { fs.closeSync(fd); }
  const iMoov = volgorde.indexOf('moov'), iMdat = volgorde.indexOf('mdat');
  return { volgorde, moovVooraan: iMoov > -1 && (iMdat === -1 || iMoov < iMdat), elst };
}

// Kijkt een video na tegen de eisen van Meta voor een reel (developers.facebook.com, IG User Media) en onze
// eigen grens voor de grootte. vast = kan dit commando niet oplossen; herstelbaar = lost de Instagram-versie op.
function onderzoekVideo(f, maxMb = T.MAX_MB) {
  const p = ffprobe(f), vast = [], herstelbaar = [], opmerkingen = [];
  const v = (p.streams || []).find(s => s.codec_type === 'video'), a = (p.streams || []).find(s => s.codec_type === 'audio');
  const duur = Number(p.format && p.format.duration), grootte = fs.statSync(f).size;
  let beelden = 0;
  if (!p.format || !/mp4/.test(p.format.format_name || '')) vast.push(`geen MP4 (${p.format ? p.format.format_name : 'onbekend'})`);
  if (!v) vast.push('geen videospoor');
  else {
    const [fn, fd] = String(v.avg_frame_rate || '0/1').split('/').map(Number), fps = fd ? fn / fd : 0;
    if (v.codec_name !== 'h264') vast.push(`het beeld moet H.264 zijn, is ${v.codec_name}`);
    if (!['yuv420p', 'yuvj420p'].includes(v.pix_fmt)) vast.push(`het beeld is ${v.pix_fmt}; Instagram vraagt 4:2:0 (maak de video met -pix_fmt yuv420p)`);
    if (v.width !== 1080 || v.height !== 1920) vast.push(`het beeld is ${v.width}x${v.height}, verwacht 1080x1920`);
    if (!(fps >= 23 && fps <= 60)) vast.push(`${komma(fps, 2)} beelden per seconde, verwacht 23 tot 60`);
    if (v.field_order && !['progressive', 'unknown'].includes(v.field_order)) vast.push(`het beeld is interlaced (${v.field_order}); Instagram vraagt progressive`);
    if (Number(v.bit_rate) > 25e6) vast.push(`het beeld is ${komma(v.bit_rate / 1e6)} Mbit/s, Instagram neemt hoogstens 25`);
    beelden = fps;
  }
  if (!(duur >= 3 && duur <= 900)) vast.push(`de duur is ${Number.isFinite(duur) ? komma(duur) : '?'} s, verwacht 3 s tot 15 min`);
  if (grootte > maxMb * 1048576) vast.push(`de video is ${mb(grootte)}; voor dit account hoogstens ${maxMb} MB (de repo moet klein blijven). Maak een kleinere versie, bijvoorbeeld in twee passen op ±2 Mbit/s`);
  if (!a) vast.push('geen geluidsspoor (ook een stil spoor moet er zijn, als AAC)');
  else {
    if (a.codec_name !== 'aac') herstelbaar.push(`het geluid is ${a.codec_name}, moet AAC zijn`);
    if (Number(a.sample_rate) > 48000) herstelbaar.push(`het geluid is ${a.sample_rate} Hz, Meta wil hoogstens 48000`);
    if (!(a.channels >= 1 && a.channels <= 2)) herstelbaar.push(`het geluid heeft ${a.channels} kanalen, moet mono of stereo zijn`);
    if (Number(a.bit_rate) > 135000) opmerkingen.push(`geluid ${(a.bit_rate / 1000).toFixed(0)} kbps; Meta noemt 128 kbps (Instagram zet het geluid zelf om)`);
  }
  if ((p.streams || []).length > 2) herstelbaar.push(`er zitten ${(p.streams || []).length} sporen in het bestand; alleen beeld en geluid horen erin`);
  if (p.format && p.format.tags && /^qt/.test(String(p.format.tags.major_brand || ''))) herstelbaar.push('het is een QuickTime-bestand (mov), geen MP4');
  if (!vast.some(x => x.startsWith('geen MP4'))) {
    const o = mp4Opbouw(f);
    if (!o.moovVooraan) herstelbaar.push('de moov-atom staat niet vooraan');
    if (o.elst) herstelbaar.push(`de video bevat ${o.elst} edit list(s); Meta vraagt "no edit lists"`);
  }
  return { vast, herstelbaar, opmerkingen, v, a, duur, grootte, fps: beelden };
}
// De Instagram-versie, zoals gereedschap/short/instagram.cjs: het beeld wordt gekopieerd (niet opnieuw gecodeerd),
// het geluid wordt AAC 48 kHz stereo 128k, zonder edit list en met moov vooraan.
function maakInstagramVersie(bron, doel) {
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', bron, '-map', '0:v:0', '-map', '0:a:0', '-c:v', 'copy',
      '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k', '-use_editlist', '0', '-movflags', '+faststart', doel], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    if (e.code === 'ENOENT') stop('ffmpeg is niet gevonden; installeer ffmpeg en zorg dat het in het zoekpad staat');
    stop(`de Instagram-versie maken lukte niet: ${String(e.stderr || e.message).trim().split('\n').slice(-2).join(' | ')}`);
  }
}
function onderzoekOmslag(f) {
  const fouten = [], grootte = fs.statSync(f).size;
  const begin = Buffer.alloc(3); const fd = fs.openSync(f, 'r'); fs.readSync(fd, begin, 0, 3, 0); fs.closeSync(fd);
  if (!(begin[0] === 0xff && begin[1] === 0xd8 && begin[2] === 0xff)) return { fouten: ['de omslag is geen JPEG'], grootte };
  const p = ffprobe(f), v = (p.streams || []).find(s => s.codec_type === 'video');
  if (!v || v.codec_name !== 'mjpeg') fouten.push(`de omslag is geen JPEG (${v ? v.codec_name : 'geen beeld'})`);
  else if (v.width !== 1080 || v.height !== 1920) fouten.push(`de omslag is ${v.width}x${v.height}, verwacht 1080x1920`);
  if (grootte > 8 * 1048576) fouten.push(`de omslag is ${mb(grootte)}, Instagram neemt hoogstens 8 MB`);
  return { fouten, grootte };
}
function maakKleintje(omslag, doel) {
  try { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', omslag, '-vf', 'scale=260:-2', '-frames:v', '1', '-q:v', '5', doel], { stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { stop(`het kleintje van de omslag maken lukte niet: ${String(e.stderr || e.message).trim().split('\n').slice(-1)[0]}`); }
}

// ---------------------------------------------------------------- de stand op GitHub, in een eigen tijdelijke kopie
// Een kale kopie zonder bestanden (--no-checkout) en zonder inhoud (--filter=blob:none): alleen de laatste commit
// en de mappenlijst. Wat we lezen (planning.json, gedaan.json, status.json) wordt los opgehaald. Zo blijft het
// een paar honderd kB, ook al is de repo twee GB.
function maakKopie(adres, tmp) {
  git(os.tmpdir(), ['clone', '--quiet', '--no-checkout', '--depth', '1', '--filter=blob:none', '--single-branch', '--branch', T.HOOFDTAK, '--no-tags', adres, tmp], { seconden: 300 });
  return git(tmp, ['rev-parse', 'HEAD']);
}
function ververs(tmp) {
  git(tmp, ['fetch', '--quiet', '--depth', '1', '--filter=blob:none', '--no-tags', 'origin', T.HOOFDTAK]);
  return git(tmp, ['rev-parse', 'FETCH_HEAD']);
}
// Het id van een bestand in een commit (of null als het er niet is). Daar is de inhoud niet voor nodig.
function blobVan(tmp, commit, pad) {
  const r = git(tmp, ['ls-tree', commit, '--', pad]);
  const m = /^\d+ blob ([0-9a-f]+)\t/.exec(r || '');
  return m ? m[1] : null;
}
function leesUit(tmp, commit, pad) {
  if (!blobVan(tmp, commit, pad)) return null;
  return git(tmp, ['cat-file', '-p', `${commit}:${pad}`], { ruw: true });
}
function leesStand(tmp, commit) {
  const ontleed = (pad, verplicht) => {
    const t = leesUit(tmp, commit, pad);
    if (t === null) { if (verplicht) stop(`${pad} ontbreekt op GitHub`); return null; }
    try { return JSON.parse(t); } catch (e) { return stop(`${pad} op GitHub is geen geldige JSON (${e.message}); er wordt niets gewijzigd. Meld dit aan Eva.`); }
  };
  const planningTekst = leesUit(tmp, commit, 'planning.json');
  const planning = ontleed('planning.json', true), gedaan = ontleed('gedaan.json', false) || { items: [] };
  if (!planning || !Array.isArray(planning.items)) stop('planning.json op GitHub heeft geen lijst "items"; er wordt niets gewijzigd. Meld dit aan Eva.');
  if (!Array.isArray(gedaan.items)) stop('gedaan.json op GitHub heeft geen lijst "items"; er wordt niets gewijzigd. Meld dit aan Eva.');
  let status = null;
  try { const t = leesUit(tmp, commit, 'status.json'); status = t ? JSON.parse(t) : null; } catch { status = null; }
  return { planning, planningTekst, gedaan, status };
}

// Mag dit item erbij? Stopt met de reden als de code, het id of het tijdstip voor dit account al bestaat.
function magErbij(planning, gedaan, account, code, datum, tijd) {
  const id = T.itemId(account, datum, code), vanCode = T.idVanCode(account, code), label = T.zoek(account).label;
  const gepland = planning.items.find(i => i && T.accountVan(i) === account && vanCode(i.id));
  const klaar = gedaan.items.find(i => i && vanCode(i.id) && i.resultaat !== 'overgeslagen');
  if (klaar) stop(`${code} is voor ${label} al geplaatst (${klaar.id}, ${klaar.wanneer})`);
  if (gepland) {
    const overgeslagen = gedaan.items.some(i => i && i.id === gepland.id && i.resultaat === 'overgeslagen');
    stop(`${code} staat voor ${label} al in de planning (${gepland.id}, ${gepland.datum} ${gepland.tijd}${overgeslagen ? '; dat item is overgeslagen' : ''}). Moet het anders, trek het dan eerst in: --intrekken --account ${account} --code ${code} --reden "…"`);
  }
  // Een id dat al in het logboek staat, slaat de automaat over: daar mag nooit een nieuw item op komen.
  if (gedaan.items.some(i => i && i.id === id)) stop(`het id ${id} staat al in het logboek (een eerder item met deze code op deze dag); kies een andere datum`);
  if (planning.items.some(i => i && i.id === id)) stop(`het id ${id} bestaat al in de planning`);
  const zelfdeTijd = planning.items.find(i => i && T.accountVan(i) === account && i.datum === datum && i.tijd === tijd);
  if (zelfdeTijd) stop(`op ${datum} ${tijd} staat voor ${label} al iets gepland (${zelfdeTijd.id})`);
  return id;
}
// Het item op zijn plek in de lijst zetten (op datum en tijd), zonder de rest te verschuiven.
function voegIn(items, item) {
  const sleutel = i => `${i && i.datum} ${i && i.tijd}`;
  let plek = items.length;
  while (plek > 0 && sleutel(items[plek - 1]) > sleutel(item)) plek--;
  return [...items.slice(0, plek), item, ...items.slice(plek)];
}
const planningTekst = planning => JSON.stringify(planning, null, 2) + '\n';

// Eén commit maken in de tijdelijke kopie, zonder werkmap: de index vullen uit de laatste commit, onze bestanden
// erin zetten, en nakijken dat er niets anders verandert dan wat mag.
function maakCommit(tmp, ouder, bestanden, toegestaan, bericht, auteur) {
  git(tmp, ['read-tree', ouder]);
  for (const b of bestanden) {
    const blob = git(tmp, ['hash-object', '-w', '--no-filters', b.bron]);
    git(tmp, ['update-index', '--add', '--cacheinfo', `100644,${blob},${b.pad}`]);
  }
  const boom = git(tmp, ['write-tree', '--missing-ok']);
  const gewijzigd = git(tmp, ['diff-tree', '-r', '--no-renames', '--name-status', `${ouder}^{tree}`, boom]).split('\n').filter(Boolean).map(r => r.split('\t'));
  for (const [soort, pad] of gewijzigd) {
    if (!toegestaan.includes(pad)) stop(`interne controle: de commit zou ${pad} wijzigen en dat hoort niet. Er is niets gewijzigd; meld dit aan Eva.`);
    if (soort !== 'A' && soort !== 'M') stop(`interne controle: de commit zou ${pad} weghalen. Er is niets gewijzigd; meld dit aan Eva.`);
  }
  if (!gewijzigd.some(([, pad]) => pad === 'planning.json')) stop('interne controle: planning.json verandert niet. Er is niets gewijzigd; meld dit aan Eva.');
  const berichtBestand = path.join(tmp, '.git', 'YG_BERICHT');
  fs.writeFileSync(berichtBestand, bericht);
  const teken = git(tmp, ['config', '--get', '--bool', 'commit.gpgsign'], { magFalen: true }) === 'true' ? ['-S'] : [];
  const commit = git(tmp, ['commit-tree', boom, '-p', ouder, ...teken, '-F', berichtBestand], { env: auteur });
  return { commit, gewijzigd: gewijzigd.map(([, pad]) => pad) };
}
// Geeft true als het gelukt is, false als GitHub intussen verder is (dan opnieuw rekenen); stopt bij iets anders
// (geen toegang, een beschermde tak, geen verbinding).
function duw(tmp, commit) {
  try { git(tmp, ['push', '--quiet', 'origin', `${commit}:refs/heads/${T.HOOFDTAK}`], { seconden: 900 }); return true; }
  catch (e) {
    const t = e.stderr || e.message;
    if (/\[rejected\]|fetch first|non-fast-forward|cannot lock ref|reference already exists/i.test(t) && !/remote rejected|hook declined|protected branch|denied|permission/i.test(t)) return false;
    return stop(`het vastleggen op GitHub lukte niet: ${String(t).trim().split('\n').slice(-3).join(' | ')}. Er is niets ingepland.`);
  }
}

// Wie legt vast? De maker uit de tabel als auteur, de git-instelling van deze pc als degene die vastlegt.
function wieLegtVast(account) {
  const naam = git(WORTEL, ['config', 'user.name'], { magFalen: true }), mail = git(WORTEL, ['config', 'user.email'], { magFalen: true });
  if (!mail) stop('git kent geen e-mailadres op deze computer (git config user.email); zonder kan er niets worden vastgelegd');
  return { GIT_AUTHOR_NAME: `${T.zoek(account).maker} (YG Crew)`, GIT_AUTHOR_EMAIL: mail, GIT_COMMITTER_NAME: naam || `${T.zoek(account).maker} (YG Crew)`, GIT_COMMITTER_EMAIL: mail };
}
function adresVanDeAutomaat() {
  if (git(WORTEL, ['rev-parse', '--is-inside-work-tree'], { magFalen: true }) !== 'true') stop(`${WORTEL} is geen kloon van de automaat (geen git-map); dit commando hoort in een kloon te staan`);
  const adres = git(WORTEL, ['remote', 'get-url', 'origin'], { magFalen: true });
  if (!adres) stop(`de kloon in ${WORTEL} heeft geen adres "origin"`);
  return adres;
}
// Draait de maker wel de versie van het commando die op GitHub staat? Een oude versie kent de regels van nu niet.
function zelfdeVersie(tmp, commit, proef, uit) {
  for (const pad of ['gereedschap/inplannen.cjs', 'src/accounts.cjs']) {
    const ver = blobVan(tmp, commit, pad);
    if (!ver) continue;                                         // staat (nog) niet op de hoofdtak
    const hier = git(WORTEL, ['hash-object', '--', path.join(WORTEL, ...pad.split('/'))], { magFalen: true });
    if (hier && hier !== ver) {
      const m = `${pad} in ${WORTEL} is niet de versie die op GitHub staat. Haal daar eerst de nieuwste versie op: git -C "${WORTEL}" pull --ff-only`;
      if (proef) uit(`LET OP: ${m}`); else stop(m);
    }
  }
}

// ---------------------------------------------------------------- inplannen
async function inplannen(o, { uit, haken }) {
  const acc = T.zoek(o.account);
  for (const veld of ['pakket', 'video', 'omslag', 'bijschrift', 'datum', 'tijd']) if (!o[veld]) stop(`--${veld} ontbreekt\n${GEBRUIK}`);
  if (o.reden !== undefined) stop('--reden hoort alleen bij --intrekken');
  const pakketmap = path.resolve(o.pakket), video = path.resolve(o.video), omslag = path.resolve(o.omslag), bijschrift = path.resolve(o.bijschrift);
  if (!fs.existsSync(pakketmap) || !fs.statSync(pakketmap).isDirectory()) stop(`de pakketmap is niet gevonden: ${pakketmap}`);
  for (const f of [video, omslag, bijschrift]) if (!fs.existsSync(f) || !fs.statSync(f).isFile()) stop(`bestand niet gevonden: ${f}`);

  // datum en tijd: een bestaande dag en tijd, minstens een uur vooruit (GitHub Pages heeft tijd nodig om de video klaar te zetten)
  if (!bestaandeDatum(o.datum)) stop(`${o.datum} is geen bestaande datum (jjjj-mm-dd)`);
  if (!/^\d{2}:\d{2}$/.test(o.tijd) || +o.tijd.slice(0, 2) > 23 || +o.tijd.slice(3) > 59) stop(`${o.tijd} is geen bestaande tijd (uu:mm)`);
  const nu = amsterdam(), vooruit = minuten(o.datum, o.tijd) - minuten(nu.datum, nu.tijd);
  if (vooruit < 60) stop(`${o.datum} ${o.tijd} ligt niet minstens een uur in de toekomst (nu in Amsterdam: ${nu.datum} ${nu.tijd})`);
  if (vooruit > 366 * 24 * 60) stop(`${o.datum} ${o.tijd} ligt meer dan een jaar vooruit; klopt het jaar?`);
  uit(`Inplannen voor ${acc.label}${o.proef ? ' (proef: er wordt niets gewijzigd)' : ''}`);
  if (vooruit > 30 * 24 * 60) uit(`LET OP: ${o.datum} is over ${Math.round(vooruit / 1440)} dagen.`);

  // 1. keuring
  const pakket = leesJson(path.join(pakketmap, 'pakket.json'), 'pakket.json'), keuring = leesJson(path.join(pakketmap, 'keuring.json'), 'keuring.json (de keuring van Andries)');
  const code = pakket && pakket.code;
  if (typeof code !== 'string' || !acc.codes.test(code)) stop(`de code "${code}" in pakket.json past niet bij ${acc.label} (bijvoorbeeld ${acc.voorbeeld})`);
  if (keuring.code !== code) stop(`keuring.json is van een ander pakket (code "${keuring.code}", pakket.json zegt "${code}")`);
  if (o.code !== undefined && o.code !== code) stop(`--code ${o.code} is niet de code van dit pakket (${code})`);
  if (!path.basename(pakketmap).includes(code)) uit(`LET OP: de naam van de pakketmap (${path.basename(pakketmap)}) bevat de code ${code} niet.`);
  const oordeel = beoordeelKeuring(pakket, keuring, acc.keuringen);
  const mis = oordeel.filter(r => !r.ok);
  if (mis.length) stop(`geen geldige keuring voor ${code}: ${mis.map(r => r.reden).join('; ')}. Er wordt niets ingepland.`);
  for (const r of oordeel) uit(`keuring ${r.soort}: "${r.besluit.tekst}" · ${r.besluit.tijd} · via ${r.besluit.via}`);

  // 4. bijschrift (vóór de video: dat is het snelst)
  const verboden = leesVerboden();
  const b = controleerBijschrift(leesTekst(bijschrift), { bron: o.bron, verboden });
  if (b.fouten.length) stop(`het bijschrift kan zo niet: ${b.fouten.join('; ')}.`);
  for (const regel of o.naschrift) if (verbodenIn(regel, verboden).length) stop('in een --naschrift staat een woord uit de lijst met verboden woorden');
  for (const m of b.opmerkingen) uit(`LET OP: ${m}`);
  uit(`bijschrift: ${b.tekens} tekens, ${b.tags} hashtags${b.bronnen.length ? `, bron in de tekst: ${b.bronnen.join(', ')}` : ''}; ${verboden ? `lijst met verboden woorden nagekeken (${verboden.regels.length} regels)` : 'geen lijst met verboden woorden ingesteld (YG_VERBODEN_WOORDEN)'}`);

  // 2 en 3. video en omslag
  const werk = fs.mkdtempSync(path.join(os.tmpdir(), 'yg-inplannen-'));
  try {
    const binnen = f => { const rel = path.relative(WORTEL, f); return !rel.startsWith('..') && !path.isAbsolute(rel) ? rel.split(path.sep).join('/') : null; };
    const inRepo = binnen(video) !== null && binnen(video).startsWith('pakketten/');
    if (inRepo && !(binnen(omslag) || '').startsWith('pakketten/')) stop('de video staat in een pakket van deze repo, de omslag niet; zet ze bij elkaar in het pakket');

    let eerste = onderzoekVideo(video, acc.maxMb || T.MAX_MB), teGebruiken = video, omgezet = '';
    if (eerste.vast.length) stop(`de video kan zo niet naar Instagram: ${eerste.vast.join('; ')}.`);
    if (eerste.herstelbaar.length) {
      if (inRepo) stop(`de video in het pakket voldoet niet (${eerste.herstelbaar.join('; ')}). Maak de Instagram-versie opnieuw (gereedschap/short/instagram.cjs), leg vast en push, en plan dan in.`);
      teGebruiken = path.join(werk, 'reel.mp4');
      maakInstagramVersie(video, teGebruiken);
      const tweede = onderzoekVideo(teGebruiken, acc.maxMb || T.MAX_MB);
      if (tweede.vast.length || tweede.herstelbaar.length) stop(`ook de Instagram-versie voldoet niet: ${[...tweede.vast, ...tweede.herstelbaar].join('; ')}.`);
      if (Math.abs(tweede.duur - eerste.duur) > 0.5) stop(`de Instagram-versie is ${komma(tweede.duur)} s, het origineel ${komma(eerste.duur)} s; dat klopt niet`);
      omgezet = eerste.herstelbaar.join('; ');
      uit(`Instagram-versie gemaakt (het beeld is gekopieerd, niet opnieuw gecodeerd), omdat: ${omgezet}`);
      eerste = tweede;
    }
    for (const m of eerste.opmerkingen) uit(`LET OP: ${m}`);
    if (o.omslagMs > eerste.duur * 1000) stop(`--omslag-ms ${o.omslagMs} ligt na het einde van de video (${komma(eerste.duur)} s)`);
    const shaVideo = sha256(teGebruiken);
    uit(`video: ${path.basename(video)}, ${eerste.v.width}x${eerste.v.height}, ${komma(eerste.fps, 2)} beelden/s, H.264 + AAC ${eerste.a.sample_rate} Hz, ${komma(eerste.duur)} s, ${mb(eerste.grootte)}, sha256 ${shaVideo.slice(0, 12)}`);
    const om = onderzoekOmslag(omslag);
    if (om.fouten.length) stop(`${om.fouten.join('; ')}. Een omslag uit de video maak je zo: ffmpeg -ss 0.8 -i video.mp4 -frames:v 1 -vf scale=1080:1920 -q:v 2 omslag.jpg`);
    uit(`omslag: ${path.basename(omslag)}, 1080x1920, ${kb(om.grootte)}; terugval videobeeld op ${o.omslagMs} ms`);

    // waar het komt te staan
    let padVideo, padOmslag, itemBeeld, itemOmslag;
    if (inRepo) { padVideo = binnen(video); padOmslag = binnen(omslag); itemBeeld = padVideo; itemOmslag = padOmslag; }
    else { itemBeeld = `${acc.naam}/${code}.mp4`; itemOmslag = `${acc.naam}/${code}.jpg`; padVideo = `beeld/${itemBeeld}`; padOmslag = `beeld/${itemOmslag}`; }
    const padKlein = `mini/${itemOmslag.replace(/\//g, '-')}`;
    const kleintje = path.join(werk, 'klein.jpg');
    maakKleintje(omslag, kleintje);

    const item = { id: T.itemId(acc.naam, o.datum, code), datum: o.datum, tijd: o.tijd, soort: 'bericht', taal: acc.taal || 'en', account: acc.naam,
      beeld: [itemBeeld], omslag: itemOmslag, omslagMs: o.omslagMs,
      titel: `${T.hoofdletter(acc.label)} ${code}: ${b.tekst.split('\n')[0].slice(0, 60)}`, tekst: b.tekst, inhaaluren: 18, eenmalig: true };

    // De commit: het letterlijke OK van Andries met de tijd, en wat er is nagekeken.
    const zelfde = oordeel.every(r => r.besluit.tekst === oordeel[0].besluit.tekst && r.besluit.tijd === oordeel[0].besluit.tijd && r.besluit.via === oordeel[0].besluit.via);
    const citaat = r => `"${openbaar(r.besluit.tekst, verboden)}", Andries ${leesbaarMoment(r.besluit.tijd)}, via ${r.besluit.via === 'paneel' ? 'het paneel' : 'de sessie'}`;
    const keurzin = zelfde ? `${oordeel.map(r => `${r.soort} OK`).join(' en ')}: ${citaat(oordeel[0])}` : oordeel.map(r => `${r.soort} OK: ${citaat(r)}`).join('; ');
    const bericht = [
      `Inplannen ${acc.label} ${code}: Instagram ${leesbareDag(o.datum)} ${o.tijd} (${keurzin})`,
      '',
      `Item ${item.id}, account ${acc.naam}.`,
      ...oordeel.map(r => `Keuring ${r.soort}: "${openbaar(r.besluit.tekst, verboden)}" · ${r.besluit.tijd} · via ${r.besluit.via}`),
      `Video: ${padVideo} (${mb(eerste.grootte)}, ${komma(eerste.duur)} s, sha256 ${shaVideo.slice(0, 12)})${omgezet ? ' · omgezet voor Instagram (beeld gekopieerd)' : ''}${inRepo ? ' · staat al in het pakket' : ''}`,
      `Omslag: ${padOmslag} (${kb(om.grootte)}), terugval videobeeld op ${o.omslagMs} ms`,
      `Bijschrift: ${b.tekens} tekens, ${b.tags} hashtags${b.bronnen.length ? `, bron in de tekst: ${b.bronnen.join(', ')}` : ''} · verboden woorden: ${verboden ? `lijst van ${verboden.regels.length} regels nagekeken` : 'geen lijst ingesteld'}`,
      'Ingepland met gereedschap/inplannen.cjs.',
      ...(o.naschrift.length ? ['', ...o.naschrift] : []),
    ].join('\n') + '\n';
    if (verbodenIn(bericht, verboden).length) stop('in de tekst voor de commit staat een woord uit de lijst met verboden woorden; er is niets gewijzigd');

    // De stand op GitHub
    const adres = adresVanDeAutomaat(), auteur = o.proef ? null : wieLegtVast(acc.naam);
    const tmp = path.join(werk, 'kopie');
    let kop = maakKopie(adres, tmp);
    zelfdeVersie(tmp, kop, o.proef, uit);
    for (let poging = 1; ; poging++) {
      const { planning, planningTekst: oudeTekst, gedaan, status } = leesStand(tmp, kop);
      magErbij(planning, gedaan, acc.naam, code, o.datum, o.tijd);
      const bestanden = [];
      if (inRepo) {
        // de video en de omslag moeten precies zo op GitHub staan als hier in het pakket
        for (const [pad, f] of [[padVideo, video], [padOmslag, omslag]]) {
          const ver = blobVan(tmp, kop, pad), hier = git(tmp, ['hash-object', '--no-filters', f]);
          if (!ver) stop(`${pad} staat nog niet op GitHub. Leg je pakket eerst vast en push, en plan dan in.`);
          if (ver !== hier) stop(`${pad} op GitHub is niet hetzelfde bestand als hier. Leg je pakket eerst vast en push, en plan dan in.`);
        }
      } else {
        bestanden.push({ pad: padVideo, bron: teGebruiken }, { pad: padOmslag, bron: omslag });
      }
      bestanden.push({ pad: padKlein, bron: kleintje });
      const nieuw = { ...planning, items: voegIn(planning.items, item) };
      // interne controle: precies één item erbij, de rest onaangeroerd
      if (nieuw.items.length !== planning.items.length + 1 || JSON.stringify(nieuw.items.filter(i => i !== item)) !== JSON.stringify(planning.items)) stop('interne controle: de planning zou meer veranderen dan één item erbij. Er is niets gewijzigd; meld dit aan Eva.');
      const nieuweTekst = planningTekst(nieuw);
      const planningBestand = path.join(werk, 'planning.json');
      fs.writeFileSync(planningBestand, nieuweTekst);
      bestanden.push({ pad: 'planning.json', bron: planningBestand });
      if (oudeTekst !== planningTekst(planning)) uit('LET OP: planning.json op GitHub had een andere opmaak; hij wordt in de vaste opmaak teruggeschreven.');

      const stand = status && status.accounts && status.accounts[acc.naam] ? status.accounts[acc.naam].stand : null;
      if (poging === 1 && stand && stand !== 'in orde') uit(`LET OP: de automaat kan voor ${acc.label} nu niet plaatsen (${stand}). Het item blijft wachten tot dat is opgelost${stand === 'niet ingesteld' ? '; Andries moet het account nog koppelen (LEESMIJ.md, "Meer accounts")' : ''}.`);

      if (o.proef) {
        uit(`\nitem dat erbij zou komen (${leesbareDag(o.datum)} om ${o.tijd}, Amsterdamse tijd):\n${JSON.stringify(item, null, 2)}`);
        uit(`\nbestanden: ${bestanden.map(x => x.pad).join(', ')}`);
        uit(`\ncommit:\n${bericht}`);
        uit('(proef: niets gewijzigd)');
        return { code: 0, item, proef: true };
      }
      const toegestaan = bestanden.map(x => x.pad);
      const { commit } = maakCommit(tmp, kop, bestanden, toegestaan, bericht, auteur);
      if (haken && haken.voorPush) await haken.voorPush(poging);
      if (duw(tmp, commit)) {
        uit(`\nIngepland: ${acc.label} ${code} op ${leesbareDag(o.datum)} om ${o.tijd} (Amsterdamse tijd).`);
        uit(`item ${item.id} · commit ${commit.slice(0, 7)} · ${toegestaan.join(', ')}`);
        uit('De automaat plaatst hem vanzelf. Zet dit op de kaart van je pakket (pakket.json, bij "plaatsen"):');
        uit(`  { "platform": "instagram", "stand": "ingepland", "wanneer": "${o.datum}T${o.tijd}:00${afwijking(o.datum, o.tijd)}" }`);
        return { code: 0, item, commit };
      }
      if (poging >= 6) stop('GitHub bleef het vastleggen weigeren omdat er steeds iets tussendoor kwam (6 pogingen). Er is niets ingepland; probeer het over een minuut opnieuw.');
      uit(`iemand anders legde intussen iets vast; opnieuw nakijken en uitrekenen op de nieuwe stand (poging ${poging + 1})`);
      await new Promise(r => setTimeout(r, 300 + Math.floor(Math.random() * 900)));
      kop = ververs(tmp);
    }
  } finally {
    ruimOp(werk);
  }
}

// ---------------------------------------------------------------- intrekken
// Haalt een eigen item dat nog niet geplaatst is uit de planning (bijvoorbeeld als Andries zijn OK introk of de
// tijd anders moet). De video en de omslag blijven staan; die ruimt de opruimregel later op.
async function intrekken(o, { uit, haken }) {
  const acc = T.zoek(o.account);
  for (const veld of ['pakket', 'video', 'omslag', 'bijschrift', 'datum', 'tijd']) if (o[veld] !== undefined) stop(`--${veld} hoort niet bij --intrekken\n${GEBRUIK}`);
  if (!o.code || !acc.codes.test(o.code)) stop(`--code ontbreekt of past niet bij ${acc.label} (bijvoorbeeld ${acc.voorbeeld})`);
  const verboden = leesVerboden();
  const reden = String(o.reden || '').replace(/\s+/g, ' ').trim();
  if (reden.length < 5) stop('--reden ontbreekt: zeg in een paar woorden waarom het item uit de planning gaat (het komt in de commit)');
  if (reden.match(NAAM) || /\b(?:https?:\/\/|www\.)\S+/i.test(reden) || verbodenIn(reden, verboden).length) stop('in de reden staat een @naam, een link of een woord uit de lijst met verboden woorden; de commit is openbaar');
  for (const regel of o.naschrift) if (verbodenIn(regel, verboden).length) stop('in een --naschrift staat een woord uit de lijst met verboden woorden');
  uit(`Intrekken voor ${acc.label}${o.proef ? ' (proef: er wordt niets gewijzigd)' : ''}`);

  const werk = fs.mkdtempSync(path.join(os.tmpdir(), 'yg-inplannen-'));
  try {
    const adres = adresVanDeAutomaat(), auteur = o.proef ? null : wieLegtVast(acc.naam);
    const tmp = path.join(werk, 'kopie');
    let kop = maakKopie(adres, tmp);
    zelfdeVersie(tmp, kop, o.proef, uit);
    const vanCode = T.idVanCode(acc.naam, o.code);
    for (let poging = 1; ; poging++) {
      const { planning, gedaan } = leesStand(tmp, kop);
      const weg = planning.items.filter(i => i && T.accountVan(i) === acc.naam && vanCode(i.id));
      if (!weg.length) stop(`${o.code} staat voor ${acc.label} niet in de planning`);
      for (const i of weg) {
        const g = gedaan.items.find(x => x && x.id === i.id);
        if (g && g.resultaat !== 'overgeslagen') stop(`${i.id} is al geplaatst (${g.wanneer}); intrekken kan niet meer. Van Instagram halen doet Andries.`);
      }
      const nieuw = { ...planning, items: planning.items.filter(i => !weg.includes(i)) };
      if (nieuw.items.length !== planning.items.length - weg.length) stop('interne controle: de planning zou meer veranderen dan bedoeld. Er is niets gewijzigd; meld dit aan Eva.');
      const planningBestand = path.join(werk, 'planning.json');
      fs.writeFileSync(planningBestand, planningTekst(nieuw));
      const bericht = [`Intrekken ${acc.label} ${o.code}: ${weg.map(i => `${i.id} (${i.datum} ${i.tijd})`).join(', ')} uit de planning (${reden})`, '',
        'De video en de omslag blijven staan. Ingetrokken met gereedschap/inplannen.cjs --intrekken.', ...(o.naschrift.length ? ['', ...o.naschrift] : [])].join('\n') + '\n';
      if (o.proef) {
        uit(`\nuit de planning zou gaan: ${weg.map(i => `${i.id} (${i.datum} ${i.tijd})`).join(', ')}`);
        uit(`\ncommit:\n${bericht}`);
        uit('(proef: niets gewijzigd)');
        return { code: 0, weg, proef: true };
      }
      const { commit } = maakCommit(tmp, kop, [{ pad: 'planning.json', bron: planningBestand }], ['planning.json'], bericht, auteur);
      if (haken && haken.voorPush) await haken.voorPush(poging);
      if (duw(tmp, commit)) {
        uit(`\nIngetrokken: ${weg.map(i => i.id).join(', ')} · commit ${commit.slice(0, 7)}`);
        uit('Haal ook de regel voor Instagram van de kaart van je pakket (pakket.json, bij "plaatsen"), of zet hem op "vervalt".');
        return { code: 0, weg, commit };
      }
      if (poging >= 6) stop('GitHub bleef het vastleggen weigeren omdat er steeds iets tussendoor kwam (6 pogingen). Er is niets gewijzigd; probeer het over een minuut opnieuw.');
      uit(`iemand anders legde intussen iets vast; opnieuw nakijken op de nieuwe stand (poging ${poging + 1})`);
      await new Promise(r => setTimeout(r, 300 + Math.floor(Math.random() * 900)));
      kop = ververs(tmp);
    }
  } finally {
    ruimOp(werk);
  }
}

// ---------------------------------------------------------------- begin
// argv: de opties. uit: waar de regels heen gaan. haken.voorPush(poging): alleen voor de toetsen.
// Geeft { code: 0, … } of { code: 1, fout } terug; gooit nooit.
async function hoofd(argv, { uit = t => console.log(t), haken = null } = {}) {
  try {
    const o = leesOpties(argv);
    if (!o.account) stop(`--account ontbreekt\n${GEBRUIK}`);
    const acc = T.zoek(o.account);
    const kan = T.ACCOUNTS.filter(a => a.keuringen).map(a => a.naam);
    if (!acc) stop(`onbekend account "${o.account}"; kies uit ${kan.join(', ')}`);
    if (!acc.keuringen) stop(`voor ${acc.label} werkt dit commando niet (kies uit ${kan.join(', ')})`);
    const versie = git(os.tmpdir(), ['--version'], { magFalen: true });
    const m = /(\d+)\.(\d+)/.exec(versie || '');
    if (!m) stop('git is niet gevonden');
    if (+m[1] < 2 || (+m[1] === 2 && +m[2] < 27)) stop(`git ${m[0]} is te oud; dit commando vraagt git 2.27 of nieuwer`);
    adresVanDeAutomaat();                                      // meteen stoppen als dit geen kloon van de automaat is
    return await (o.intrekken ? intrekken : inplannen)(o, { uit, haken });
  } catch (e) {
    if (e instanceof Stop) { uit(`STOP: ${e.message}`); return { code: 1, fout: e.message }; }
    uit(`STOP: onverwachte fout, er is niets ingepland: ${zonderWachtwoord(e && e.message ? e.message : e)}`);
    return { code: 1, fout: String(e && e.message ? e.message : e) };
  }
}

module.exports = { hoofd, leesOpties, beoordeelKeuring, controleerBijschrift, leesVerboden, verbodenIn, openbaar, onderzoekVideo, onderzoekOmslag, mp4Opbouw,
  magErbij, voegIn, afwijking, leesbareDag, leesbaarMoment, bestaandeDatum, Stop };

if (require.main === module) hoofd(process.argv.slice(2)).then(r => process.exit(r.code));
