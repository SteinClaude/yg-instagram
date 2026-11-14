// Shorts voor het YouTube-kanaal van YG-Social: 1080x1920, 30 beelden per
// seconde, eigen animatie (geen gezicht, geen stockbeeld, geen stem, geen muziek,
// geen betaalde credits). Elke short is een script in teksten/shorts/<code>.cjs:
// een reeks scenes, elk met een duur, een tekst en een tekening die per beeld
// opnieuw wordt uitgerekend. Alles lokaal: resvg tekent, ffmpeg codeert.
//
//   node gereedschap/short.cjs YS01            maakt pakketten/<map>/video.mp4 + overzicht.jpg
//   node gereedschap/short.cjs YS01 --frames   alleen controlebeelden (geen video)
//
// Versie 2 (script met `versie: 2`, opdracht Eva 2 nov 19:45): camera over de hele scène (scene.camera), tekst
// woord voor woord (kin), overgangen tussen scènes (scene.in: zweep, flits, masker, op, zoom), diepte (schaduw, licht,
// vignet, korrel) en eigen geluidseffecten (scene.geluid, gemaakt met ffmpeg in short/geluid.cjs). Bij een overgang
// klinkt vanzelf een whoosh. Na het coderen komt er een controleblad met beelden midden in de bewegingen
// (bron/controle-beweging.jpg). Scripts zonder `versie: 2` worden gemaakt zoals voorheen.
//
// Het pakket-pad staat in het script (veld `map`). Het audiospoor is stil:
// muziek komt alleen uit de gratis bibliotheek van het platform zelf (CLAUDE.md).
//
// Veilige zone: de knoppen en de titel van YouTube Shorts liggen over de
// onderste ~25% en de rechterrand. Tekst staat daarom tussen y 260 en 1380,
// links uitgelijnd op x 100, hoogstens 820 breed.
const fs = require('fs'), path = require('path');
const { spawn, execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');
const FIG = require('./figuur.cjs');
const DECOR = require('./short/decor.cjs');
const opentype = require('opentype.js');
const sharp = require('sharp');

const W = 1080, H = 1920, FPS = 30;
const WORTEL = path.join(__dirname, '..');
const FONTS = path.join(__dirname, 'short', 'fonts');
const fontFiles = ['InstrumentSans-Bold.ttf', 'InstrumentSans-Regular.ttf', 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-Bold.ttf'].map(f => path.join(FONTS, f));
const laad = f => { const b = fs.readFileSync(path.join(FONTS, f)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const FONT = { bold: laad('InstrumentSans-Bold.ttf'), regular: laad('InstrumentSans-Regular.ttf'), mono: laad('IBMPlexMono-Regular.ttf') };

// Huisstijl van het kanaal ("dossier"): papier, inkt, één signaalkleur.
const K = { papier: '#EFEAE0', papierDiep: '#E4DDCF', inkt: '#16161A', grijs: '#6E6A62', signaal: '#D9432B', geel: '#F2C230', groen: '#2F7D5B', nacht: '#1B1E2B' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const klem = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const zacht = x => { x = klem(x); return x * x * (3 - 2 * x); };
const uit = x => { x = klem(x); return 1 - Math.pow(1 - x, 3); };
// voortgang van een overgang die op `start` begint en `duur` seconden duurt
const fase = (t, start, duur = 0.45) => uit((t - start) / duur);

// ---------------------------------------------------------------- tekst
// Rijke tekst: *woord* = signaalkleur. Afbreken op breedte met opentype-maten.
function woorden(tekst) {
  // Een woord is een reeks stukjes {s, accent}, zodat "*shape*," geen spatie voor de komma krijgt.
  const uitk = []; let accent = false;
  for (const w of tekst.split(/\s+/).filter(Boolean)) {
    const stukken = [];
    for (const deel of w.split(/(\*)/)) { if (deel === '*') { accent = !accent; continue; } if (deel) stukken.push({ s: deel, accent }); }
    if (stukken.length) uitk.push({ w: stukken.map(x => x.s).join(''), stukken });
  }
  return uitk;
}
const maat = (font, s, g) => font.getAdvanceWidth(s, g);
function breek(tekst, g, max, font) {
  const ws = woorden(tekst), regels = []; let r = [], b = 0; const sp = maat(font, ' ', g);
  for (const x of ws) {
    const wb = maat(font, x.w, g);
    if (r.length && b + sp + wb > max) { regels.push(r); r = []; b = 0; }
    b += (r.length ? sp : 0) + wb; r.push(x);
  }
  if (r.length) regels.push(r);
  return regels;
}
const B = require('./short/beweging.cjs')({ FONT, maat, esc, K, W, H, woorden, breek });
const GELUID = require('./short/geluid.cjs');

// Tekstblok met regels die na elkaar opkomen. Geeft {svg, hoogte}.
function blok(tekst, { x = 100, y, g = 64, max = 820, gewicht = 'bold', kleur = K.inkt, accent = K.signaal, t = 99, start = 0, regelHoogte = 1.18, stap = 0.12, midden = false } = {}) {
  const font = gewicht === 'bold' ? FONT.bold : gewicht === 'mono' ? FONT.mono : FONT.regular;
  const fam = gewicht === 'mono' ? 'IBM Plex Mono' : 'Instrument Sans';
  const fw = gewicht === 'bold' ? 700 : 400;
  const regels = breek(tekst, g, max, font);
  let svg = '';
  regels.forEach((r, i) => {
    const p = fase(t, start + i * stap);
    if (p <= 0) return;
    const by = y + g * 0.8 + i * g * regelHoogte + (1 - p) * 26;
    const regelTekst = r.map(z => z.w).join(' ');
    const lx = midden ? W / 2 - maat(font, regelTekst, g) / 2 : x;
    const spans = r.map((z, j) => z.stukken.map((st, k) => `<tspan fill="${st.accent ? accent : kleur}">${esc(st.s)}${k === z.stukken.length - 1 && j < r.length - 1 ? ' ' : ''}</tspan>`).join('')).join('');
    svg += `<text x="${lx.toFixed(1)}" y="${by.toFixed(1)}" font-family="${fam}" font-weight="${fw}" font-size="${g}" opacity="${p.toFixed(3)}" xml:space="preserve">${spans}</text>`;
  });
  return { svg, hoogte: regels.length * g * regelHoogte };
}

// ---------------------------------------------------------------- tekeningen
function veelhoek(n, cx, cy, r, draai = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = draai + (i / n) * Math.PI * 2; pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
  return pts.join(' ');
}
// Een stopbord: achthoek met rand en tekst.
function stopbord(cx, cy, r, { vul = K.signaal, letter = '#FFFFFF', rand = '#FFFFFF', tekst = 'STOP', schaal = 1, draai = 0, doorzicht = 1 } = {}) {
  const off = Math.PI / 8;
  return `<g opacity="${doorzicht}" transform="translate(${cx} ${cy}) rotate(${draai}) scale(${schaal}) translate(${-cx} ${-cy})">
<polygon points="${veelhoek(8, cx, cy, r, off)}" fill="${vul}" stroke="${K.inkt}" stroke-width="${r * 0.02}"/>
<polygon points="${veelhoek(8, cx, cy, r * 0.9, off)}" fill="none" stroke="${rand}" stroke-width="${r * 0.05}"/>
<text x="${cx}" y="${cy + r * 0.2}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r * 0.56}" fill="${letter}">${tekst}</text></g>`;
}
function vorm(soort, cx, cy, r, vul, doorzicht = 1, schaal = 1) {
  const t = `transform="translate(${cx} ${cy}) scale(${schaal}) translate(${-cx} ${-cy})" opacity="${doorzicht}"`;
  const lijn = `stroke="${K.inkt}" stroke-width="5"`;
  if (soort === 'cirkel') return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${vul}" ${lijn} ${t}/>`;
  if (soort === 'achthoek') return `<polygon points="${veelhoek(8, cx, cy, r, Math.PI / 8)}" fill="${vul}" ${lijn} ${t}/>`;
  if (soort === 'ruit') return `<polygon points="${veelhoek(4, cx, cy, r * 1.05, 0)}" fill="${vul}" ${lijn} ${t}/>`;
  if (soort === 'rechthoek') return `<rect x="${cx - r * 1.15}" y="${cy - r * 0.7}" width="${r * 2.3}" height="${r * 1.4}" fill="${vul}" ${lijn} ${t}/>`;
  return '';
}
// Klok met wijzers; uur/minuut als getallen.
function klok(cx, cy, r, uur, minuut, { label = '', sub = '', kleur = K.inkt, vul = '#FFFFFF', doorzicht = 1 } = {}) {
  let s = `<g opacity="${doorzicht}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${vul}" stroke="${kleur}" stroke-width="${r * 0.06}"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const r1 = r * 0.82, r2 = r * (i % 3 === 0 ? 0.68 : 0.74);
    s += `<line x1="${(cx + r1 * Math.sin(a)).toFixed(1)}" y1="${(cy - r1 * Math.cos(a)).toFixed(1)}" x2="${(cx + r2 * Math.sin(a)).toFixed(1)}" y2="${(cy - r2 * Math.cos(a)).toFixed(1)}" stroke="${kleur}" stroke-width="${r * (i % 3 === 0 ? 0.05 : 0.025)}" stroke-linecap="round"/>`; }
  const am = minuut / 60 * Math.PI * 2, au = ((uur % 12) + minuut / 60) / 12 * Math.PI * 2;
  s += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.42 * Math.sin(au)).toFixed(1)}" y2="${(cy - r * 0.42 * Math.cos(au)).toFixed(1)}" stroke="${kleur}" stroke-width="${r * 0.08}" stroke-linecap="round"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.66 * Math.sin(am)).toFixed(1)}" y2="${(cy - r * 0.66 * Math.cos(am)).toFixed(1)}" stroke="${K.signaal}" stroke-width="${r * 0.045}" stroke-linecap="round"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.07}" fill="${kleur}"/>`;
  if (label) s += `<text x="${cx}" y="${cy + r + 62}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="44" fill="${K.inkt}">${esc(label)}</text>`;
  if (sub) s += `<text x="${cx}" y="${cy + r + 108}" text-anchor="middle" font-family="IBM Plex Mono" font-size="32" fill="${K.grijs}">${esc(sub)}</text>`;
  return s + '</g>';
}
// Toetsenbordrij(en): toetsen als afgeronde vakjes.
function toetsen(rijen, { x0 = 100, y0 = 1000, toets = 78, gat = 10, inspring = [0, 0.5, 1.5], kleur = '#FFFFFF', accentLetters = '', t = 99, start = 0, stap = 0.015 } = {}) {
  let s = '', n = 0;
  rijen.forEach((rij, ri) => {
    [...rij].forEach((ch, ci) => {
      const p = fase(t, start + n++ * stap, 0.3); if (p <= 0) return;
      const x = x0 + (inspring[ri] || 0) * (toets * 0.5) + ci * (toets + gat), y = y0 + ri * (toets + gat) + (1 - p) * 20;
      const acc = accentLetters.includes(ch);
      s += `<g opacity="${p.toFixed(3)}"><rect x="${x}" y="${y}" width="${toets}" height="${toets}" rx="12" fill="${acc ? K.signaal : kleur}" stroke="${K.inkt}" stroke-width="3"/>
<text x="${x + toets / 2}" y="${y + toets * 0.66}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${toets * 0.48}" fill="${acc ? '#FFFFFF' : K.inkt}">${esc(ch)}</text></g>`;
    });
  });
  return s;
}

// ---------------------------------------------------------------- frame
// Kop: dossiernummer en onderwerp, klein, in mono. Onder: bronregel.
// Stijl 2 (Andries ma 9 nov 2026: geen nummer meer bovenaan): papier met structuur in plaats van een egale kleur, geen
// kop. Het papier wordt één keer gemaakt (vezels + vlekken met feTurbulence) en als beeld hergebruikt.
const PAPIER = {};
function papierBeeld(nacht) {
  const k = nacht ? 'nacht' : 'dag';
  if (!PAPIER[k]) {
    const basis = nacht ? K.nacht : K.papier;
    const [vr, vg, vb, va] = nacht ? [0.55, 0.6, 0.8, 0.10] : [0.42, 0.34, 0.22, 0.16];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>`
      + `<filter id="v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 ${vr}  0 0 0 0 ${vg}  0 0 0 0 ${vb}  0 0 0 ${va} 0"/></filter>`
      + `<filter id="m" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.005" numOctaves="3" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 ${vr}  0 0 0 0 ${vg}  0 0 0 0 ${vb}  0 0 0 ${va * 0.9} 0"/></filter></defs>`
      + `<rect width="${W}" height="${H}" fill="${basis}"/><rect width="${W}" height="${H}" filter="url(#m)"/><rect width="${W}" height="${H}" filter="url(#v)"/>`
      + (nacht ? '' : Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${160 + i * 96}" x2="${W}" y2="${160 + i * 96}" stroke="#D8CFBE" stroke-width="2" opacity="0.55"/>`).join(''))
      + `</svg>`;
    PAPIER[k] = 'data:image/png;base64,' + Buffer.from(teken(svg).asPng()).toString('base64');
  }
  return PAPIER[k];
}
// Vooraf (in maak): het papier als jpg, dat resvg per beeld veel sneller inleest dan een png.
async function bereidPapier() {
  for (const nacht of [false, true]) {
    const png = Buffer.from(papierBeeld(nacht).split(',')[1], 'base64');
    PAPIER[nacht ? 'nacht' : 'dag'] = 'data:image/jpeg;base64,' + (await sharp(png).jpeg({ quality: 93 }).toBuffer()).toString('base64');
  }
}
// Stijl 3: decors (short/decor.cjs) één keer vooraf tekenen en daarna als afbeelding gebruiken.
const DECORBEELD = {};
async function bereidDecor(script) {
  for (const naam of new Set(script.scenes.map(s => s.decor).filter(Boolean))) if (!DECORBEELD[naam]) {
    const png = new Resvg(DECOR.svg(naam), { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: 1800 } }).render().asPng();
    DECORBEELD[naam] = 'data:image/jpeg;base64,' + (await sharp(png).jpeg({ quality: 92 }).toBuffer()).toString('base64');
  }
}
// Stijl 3 met decor: de kop staat op een papieren kaartje (ons dossierpapier) dat met plakband bovenin hangt.
function kaart(scene) {
  const x = 56, y = 166, w = 968, h = scene.kaartH || 400; let s = '';
  s += `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="18" fill="#000000" opacity="0.25"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${K.papier}" stroke="${K.inkt}" stroke-width="6"/>`;
  for (let yy = y + 96; yy < y + h - 24; yy += 96) s += `<line x1="${x + 16}" y1="${yy}" x2="${x + w - 16}" y2="${yy}" stroke="#E2DBCD" stroke-width="2"/>`;
  for (const [tx, hoek] of [[x + 110, -7], [x + w - 110, 6]]) s += `<rect x="${tx - 60}" y="${y - 22}" width="120" height="42" rx="4" fill="#FFFFFF" fill-opacity="0.6" stroke="#A8A196" stroke-width="3" transform="rotate(${hoek} ${tx} ${y})"/>`;
  return s;
}
// Voortgangsbalk (stijl 2): dun spoor bovenaan het veilige vlak, loopt rood vol terwijl de short speelt.
function voortgang(script, scene, abs) {
  const p = klem(abs / totaal(script)), y = 212;
  return `<rect x="100" y="${y}" width="880" height="8" rx="4" fill="${scene.nacht ? '#FFFFFF' : K.inkt}" opacity="${scene.nacht ? 0.14 : 0.1}"/>`
    + (p > 0 ? `<rect x="100" y="${y}" width="${Math.max(8, 880 * p).toFixed(1)}" height="8" rx="4" fill="${K.signaal}"/>` : '');
}
function kader(script, scene, t, abs = 0) {
  if ((script.stijl || 1) >= 2) return `<image href="${papierBeeld(scene.nacht)}" x="0" y="0" width="${W}" height="${H}"/>`;
  let s = `<rect width="${W}" height="${H}" fill="${scene.nacht ? K.nacht : K.papier}"/>`;
  // fijne lijnen als papier van een dossier
  if (!scene.nacht) for (let y = 160; y < H; y += 96) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#E2DBCD" stroke-width="2"/>`;
  const kleur = scene.nacht ? '#C9C6BC' : K.grijs;
  s += `<text x="100" y="236" font-family="IBM Plex Mono" font-size="34" fill="${K.signaal}" font-weight="700">${esc(script.nummer)}</text>`;
  s += `<text x="${100 + maat(FONT.mono, script.nummer, 34) + 24}" y="236" font-family="IBM Plex Mono" font-size="34" fill="${kleur}">${esc(script.onderwerp)}</text>`;
  s += `<line x1="100" y1="264" x2="980" y2="264" stroke="${scene.nacht ? '#3A3F52' : K.inkt}" stroke-width="3"/>`;
  return s;
}
// Kanaal 2 (script met `kanaal: 2`, "vreemd maar waar"): geen dossier maar een echte foto onder de tekst. De kop is
// een geel label met de reeks (script.reeks). De foto staat in scene.achter (onder een donker verloop boven en onder),
// de tekst in scene.teken (erboven, dus niet verduisterd).
function kader2(script) {
  return `<rect width="${W}" height="${H}" fill="#0E0F14"/>`;
}
function verloop2() {
  return `<defs><linearGradient id="k2boven" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.78"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`
    + `<linearGradient id="k2onder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/></linearGradient></defs>`
    + `<rect width="${W}" height="820" fill="url(#k2boven)"/><rect y="1150" width="${W}" height="${H - 1150}" fill="url(#k2onder)"/>`;
}
function kop2(script) {
  const tekst = script.reeks || '', g = 34, b = maat(FONT.mono, tekst, g) + 44;
  return (tekst ? `<rect x="100" y="190" width="${b.toFixed(1)}" height="60" rx="8" fill="${K.geel}"/><text x="122" y="232" font-family="IBM Plex Mono" font-weight="700" font-size="${g}" fill="${K.inkt}">${esc(tekst)}</text>` : '');
}
// Foto (kanaal 2): een vrij beeld uit bron/ (vooraf verkleind tot hoogstens 1600 px, jpg; zie short/beeld.cjs), met
// langzame zoom en schuif over de duur van de scène. Het bestand wordt één keer ingelezen en als data-URI meegegeven.
// Standaard iets groter dan het beeld, zodat een camerastoot geen zwarte rand laat zien.
const FOTO = new Map();
function foto(pad, { x = -40, y = -40, w = W + 80, h = H + 80, t = 0, duur = 1, zoom = [1, 1.08], pan = [[0, 0], [0, 0]], midden } = {}) {
  if (!FOTO.has(pad)) FOTO.set(pad, 'data:image/jpeg;base64,' + fs.readFileSync(path.join(WORTEL, pad)).toString('base64'));
  const p = klem(t / duur), z = zoom[0] + (zoom[1] - zoom[0]) * p;
  const dx = pan[0][0] + (pan[1][0] - pan[0][0]) * p, dy = pan[0][1] + (pan[1][1] - pan[0][1]) * p;
  const [cx, cy] = midden || [x + w / 2, y + h / 2];
  const vol = x <= 0 && y <= 0 && x + w >= W && y + h >= H;   // schermvullend: geen clip nodig
  const img = `<image href="${FOTO.get(pad)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" transform="translate(${(cx + dx).toFixed(2)} ${(cy + dy).toFixed(2)}) scale(${z.toFixed(4)}) translate(${-cx} ${-cy})"/>`;
  if (vol) return img;
  const id = `fv${x | 0}_${y | 0}_${w | 0}_${h | 0}`;
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${img}</g>`;
}
// Stijl 2: de bron als stempel op het dossier (rood label SOURCE + de bron), die met een kleine klap neerkomt.
function bronStempel(tekst, t, start, nacht, y = 1326) {
  const u = (t - start) / 0.22; if (u <= 0 || !tekst) return '';
  const lab = 'SOURCE', gl = 24; let g = 28;
  const lb = maat(FONT.mono, lab, gl) + 24;
  while (g > 20 && lb + maat(FONT.mono, tekst, g) + 40 > 860) g -= 1;
  const bw = lb + maat(FONT.mono, tekst, g) + 34, x = 100, h = 50;
  const sc = 1 + 0.45 * (1 - B.veer(u, 1.2)), op = klem(u * 3);
  return `<g opacity="${op.toFixed(3)}" transform="translate(${x} ${y + h / 2}) rotate(-1.2) scale(${sc.toFixed(4)}) translate(${-x} ${-(y + h / 2)})">`
    + `<rect x="${x}" y="${y}" width="${bw.toFixed(1)}" height="${h}" rx="5" fill="${nacht ? '#232738' : '#F7F2E6'}" stroke="${K.signaal}" stroke-width="3.5"/>`
    + `<rect x="${x}" y="${y}" width="${lb.toFixed(1)}" height="${h}" rx="5" fill="${K.signaal}"/>`
    + `<text x="${x + 12}" y="${y + 34}" font-family="IBM Plex Mono" font-weight="700" font-size="${gl}" fill="#FFFFFF">${lab}</text>`
    + `<text x="${(x + lb + 16).toFixed(1)}" y="${y + 34}" font-family="IBM Plex Mono" font-size="${g}" fill="${nacht ? '#E8E4DA' : K.inkt}" xml:space="preserve">${esc(tekst)}</text></g>`;
}
function bronRegel(tekst, t, start, nacht, stijl = 1) {
  if (stijl >= 2) return bronStempel(tekst, t, start, nacht, stijl >= 3 ? 1040 : 1326);   // stijl 3: boven de figuren
  const p = fase(t, start, 0.5); if (p <= 0 || !tekst) return '';
  return blok('Source: ' + tekst, { y: 1330, g: 30, gewicht: 'mono', kleur: nacht ? '#C9C6BC' : K.grijs, accent: K.signaal, t, start, max: 800, regelHoogte: 1.3 }).svg;
}

// Stijl 2: kinetische tekst loopt gelijk met de stem (scene._woorden, uit short/woordtijden.py), tenzij het script
// zelf `sync: false` meegeeft. Tekst die niet op de gesproken zin lijkt (labels in een tekening) houdt zijn eigen tijden.
const kaal = x => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
const woordTijd = (scene, woord, n = 0) => { const m = (scene._woorden || []).filter(w => kaal(w.w).startsWith(kaal(woord))); return m[n] ? m[n].start : null; };
const HULP = (script = {}, scene = {}) => ({ K, blok, fase, zacht, uit, klem, stopbord, vorm, klok, toetsen, veelhoek, W, H, esc, maat, FONT,
  kin: (tekst, o = {}) => B.kin(tekst, { stijl: script.stijl || 1, sync: (script.stijl || 1) >= 2 ? scene._woorden : null, venster: (script.stijl || 1) >= 3 ? 99 : 5, ...o }), veer: B.veer, foto,
  // op('woord'): het moment waarop dat woord in deze scène gezegd wordt (voor beeld dat op de stem moet vallen)
  op: (woord, terugval = 0, n = 0) => woordTijd(scene, woord, n) ?? terugval,
  stijl: script.stijl || 1, krabbel: B.krabbel, wie: scene.wie, vlak: DECOR.VLAK, vlakInkt: DECOR.INKT[scene.decor] || K.inkt });
// Eén volledig beeld van een scène op tijd t (achtergrond, kop, inhoud, bronregel), zonder <svg>-omhulsel.
function beeldVan(script, scene, t, abs = 0) {
  B.sceneStart = abs - t;   // voor de geluidsopname van markeerstift en krabbels (stijl 2)
  const inhoud = scene.teken({ t, duur: scene.duur, ...HULP(script, scene) });
  if (script.versie !== 2) return `${kader(script, scene, t)}${inhoud}${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht)}`;
  if (script.kanaal === 2) { const cam = B.camera(t, scene.duur, scene.camera), achter = scene.achter ? scene.achter({ t, duur: scene.duur, ...HULP() }) : '';
    return `${kader2(script)}<g transform="${cam}">${achter}</g>${verloop2()}<g transform="${cam}">${inhoud}</g>` +
    `${kop2(script)}${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, true)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`; }
  const licht = scene.nacht ? '' : `<rect width="${W}" height="${H}" fill="url(#licht)"/>`;
  if ((script.stijl || 1) >= 3 && scene.decor) {   // stijl 3: decor, kaartje met de kop, alles in één camera
    const cam = B.camera(t, scene.duur, { ...scene.camera, drift: abs }), d = script.duo && script.duo[scene.wie];
    const zoom = scene.shot === 'dichtbij' && d ? ` transform="translate(540 1250) scale(1.75) translate(${-d.x} -1300)"` : '';
    return `<rect width="${W}" height="${H}" fill="${K.nacht}"/><g transform="${cam}"><image href="${DECORBEELD[scene.decor]}" x="-60" y="-60" width="1200" height="2040"${zoom}/>` +
      `${kaart(scene)}${inhoud}${voortgang(script, scene, abs)}</g>` +
      `${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht, script.stijl)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`;
  }
  if ((script.stijl || 1) >= 2) {   // stijl 2: geen kop; voortgangsbalk boven het licht
    return `${kader(script, scene, t, abs)}${licht}<g transform="${B.camera(t, scene.duur, { ...scene.camera, drift: abs })}">${inhoud}</g>${voortgang(script, scene, abs)}` +
      `${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht, script.stijl)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`;
  }
  return `${kader(script, scene, t, abs)}${licht}<g transform="${B.camera(t, scene.duur, scene.camera)}">${inhoud}</g>` +
    `${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht, script.stijl)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`;
}
// Stijl 3 (vanaf YS40, Andries za 14 nov 2026): het vaste duo. `script.duo` = { vloer, vraag: { code, x, spiegel, fase },
// antwoord: {...} }; elke scène heeft `wie: 'vraag' | 'antwoord'` (wie er praat), optioneel `pose: { vraag, antwoord }`
// (Peertje gloeit op zolang hij praat). De figuren staan los van de overgangen: het beeld erachter wisselt,
// zij blijven staan. Wie praat staat groter, beweegt de mond op de woordtijden van de stem en wijst naar het beeld;
// de ander luistert en kijkt naar de spreker. In de lus keert de stand terug naar die van de eerste scène.
function figuren(script, tijd) {
  const sc = script.scenes, duo = script.duo; let t0 = 0, i = 0;
  for (; i < sc.length - 1 && tijd >= t0 + sc[i].duur; i++) t0 += sc[i].duur;
  const scene = sc[i], t = tijd - t0, vorige = i > 0 ? sc[i - 1].wie : scene.wie;
  const doel = scene.wie === 'antwoord' ? 1 : 0, van = vorige === 'antwoord' ? 1 : 0;
  // shot 'dichtbij': alleen de spreker, groot en in het midden; een wissel van of naar dichtbij is een harde snede
  const dicht = scene.shot === 'dichtbij', snede = dicht || (i > 0 && sc[i - 1].shot === 'dichtbij');
  let mix = snede ? doel : van + (doel - van) * zacht(t / 0.28);   // 0 = de vraag praat, 1 = het antwoord praat
  let inLus = false;
  if (script.lus && i === sc.length - 1 && t > scene.duur - script.lus) { inLus = true;
    mix += ((sc[0].wie === 'antwoord' ? 1 : 0) - mix) * zacht((t - (scene.duur - script.lus)) / script.lus); }
  const rol = (naam, gewicht) => {
    if (dicht && scene.wie !== naam) return '';
    const d = duo[naam], spreekt = scene.wie === naam && !inLus, s = dicht ? 1.6 : 0.66 + 0.16 * gewicht;
    const fx = dicht ? 540 : d.x, vloer = dicht ? duo.vloer + 420 : duo.vloer;
    let mond = 'glim';
    // de mond volgt de stem zelf: open zolang er geluid is, met een snelle klep zodat hij niet blijft openstaan
    if (spreekt && scene._mond) { const nv = scene._mond.niveaus[Math.floor((t - scene._mond.start) * FPS)] || 0; if (nv > 0.16 && Math.sin(t * 25) > -0.45) mond = 'open'; }
    const pose = (scene.pose && scene.pose[naam]) || (spreekt && !dicht ? 'wijst' : 'rust');
    const knipper = ((tijd + d.fase) % 3.3) < 0.12 ? 1 : 0;
    // Peertje gloeit op zolang hij praat (Andries za 14 nov 2026: geen ping meer, "laat hem opgloeien als hij praat")
    let aan = 0;
    if (naam === 'antwoord') aan = inLus ? 0 : scene.wie === naam ? (snede || vorige === naam ? 1 : klem(t / 0.25)) * (mond === 'open' ? 1 : 0.82)
      : (!snede && vorige === naam ? 1 - klem(t / 0.3) : 0);
    const hop = spreekt && !snede && i > 0 && vorige !== naam ? -26 * Math.sin(Math.PI * klem(t / 0.3)) : 0;
    const wieg = Math.sin(tijd * 2.1 + d.fase * 2) * 3 + (mond === 'open' ? -7 : 0);
    return `<ellipse cx="${fx}" cy="${vloer + 6}" rx="${(150 * s).toFixed(1)}" ry="${(22 * s).toFixed(1)}" fill="${K.inkt}" opacity="0.16"/>`
      + FIG.teken(d.code, { x: fx, y: +(vloer + hop + wieg).toFixed(2), s: +s.toFixed(4), pose, mond, knipper, spiegel: d.spiegel, kijk: dicht ? (pose === 'verbaasd' ? null : [0.1, -0.05]) : spreekt ? null : [0.8, -0.15], aan });
  };
  // de luisteraar eerst, de spreker ervoor
  return mix >= 0.5 ? rol('vraag', 1 - mix) + rol('antwoord', mix) : rol('antwoord', mix) + rol('vraag', 1 - mix);
}
function svgVoor(script, tijd) {
  let t0 = 0;
  const sc = script.scenes;
  for (let i = 0; i < sc.length; i++) {
    const scene = sc[i];
    if (tijd < t0 + scene.duur || i === sc.length - 1) {
      const t = tijd - t0;
      let lijf = beeldVan(script, scene, t, tijd);
      if (script.versie === 2 && scene.in && i > 0 && t < B.OVERGANG_DUUR) {
        const vorige = beeldVan(script, sc[i - 1], sc[i - 1].duur - 0.001, t0 - 0.001);
        lijf = B.overgang(scene.in, B.uit(t / B.OVERGANG_DUUR), vorige, lijf, i);
      }
      // Lus (vorm 3, vanaf YS33): de laatste `script.lus` seconden vloeien over in het eerste beeld van de short,
      // zodat een Reel of Short die opnieuw begint naadloos doorloopt.
      if (script.lus && i === sc.length - 1 && t > scene.duur - script.lus) {
        const e = B.zacht((t - (scene.duur - script.lus)) / script.lus);
        lijf = `${lijf}<g opacity="${e.toFixed(3)}">${beeldVan(script, sc[0], 0.001)}</g>`;
      }
      if ((script.stijl || 1) >= 3 && script.duo) lijf += figuren(script, tijd);
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${script.versie === 2 ? B.DEFS : ''}${lijf}</svg>`;
    }
    t0 += scene.duur;
  }
}
// Tijdlijn van de geluiden (versie 2): wat de scènes vragen, plus een whoosh bij elke overgang.
function geluidLijst(script) {
  const lijst = []; let t0 = 0;
  script.scenes.forEach((s, i) => {
    if (s.in && i > 0) lijst.push([Math.max(0, t0 - 0.16), 'whoosh', 0.55]);
    if ((script.stijl || 1) >= 2 && s.bron) lijst.push([t0 + (s.bronStart ?? 0.6), 'stempel', 0.45]);
    for (const [t, naam, vol, pan] of s.geluid || []) lijst.push([t0 + (t < 0 ? s.duur + t : t), naam, vol ?? 1, pan ?? 0]);   // negatieve tijd = vanaf het eind van de scène
    t0 += s.duur;
  });
  return lijst;
}
// Korrel (versie 2): vier vaste ruispatronen, per beeld een ander, opgeteld bij de pixels na het tekenen.
let KORREL = null;
function korrel(px, i, sterkte = 5) {
  if (!KORREL) {
    let z = 12345; const rnd = () => ((z = (z * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    KORREL = [0, 1, 2, 3].map(() => { const a = new Int8Array(W * H); for (let k = 0; k < a.length; k++) a[k] = Math.round((rnd() * 2 - 1) * sterkte); return a; });
  }
  const r = KORREL[i % 4], uitk = Buffer.from(px);
  for (let k = 0, p = 0; k < r.length; k++, p += 4) {
    const d = r[k];
    uitk[p] = Math.max(0, Math.min(255, uitk[p] + d)); uitk[p + 1] = Math.max(0, Math.min(255, uitk[p + 1] + d)); uitk[p + 2] = Math.max(0, Math.min(255, uitk[p + 2] + d));
  }
  return uitk;
}
const totaal = script => script.scenes.reduce((a, s) => a + s.duur, 0);
const teken = svg => new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: W } }).render();

// Stem (besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"). script.stem = { stem: 'am_fenrir', tempo: 1.1 } en per
// scène `stem: 'tekst'` (optioneel `stemStart`, standaard 0.12 s). Een scène duurt minstens zo lang als haar zin + 0,25 s.
// De wav's komen in een cache buiten de repo (te groot voor git); de tekst staat in het script en in bron/stem.txt.
const KOKORO_PY = process.env.KOKORO_PY || 'C:/Users/gijsm/yg-gereedschap/kokoro-venv/Scripts/python.exe';
function voorbereidStem(script, map) {
  if (!script.stem) return [];
  const cache = path.join(require('os').tmpdir(), 'yg-stem'); fs.mkdirSync(cache, { recursive: true });
  const sporen = []; let t0 = 0, tekst = '';
  script.scenes.forEach((s, i) => {
    if (s.stem) {
      // stijl 3: elke figuur een eigen stem (script.stemmen = { vraag: {...}, antwoord: {...} }); anders script.stem
      const { stem = 'am_fenrir', tempo = 1.1 } = (script.stemmen && s.wie && script.stemmen[s.wie]) || script.stem;
      const sleutel = require('crypto').createHash('sha1').update(`${stem}|${tempo}|uitspraak2|${s.stem}`).digest('hex').slice(0, 16);
      const wav = path.join(cache, sleutel + '.wav');
      if (!fs.existsSync(wav)) execFileSync(KOKORO_PY, [path.join(__dirname, 'short', 'stem.py'), wav, stem, String(tempo), s.stem]);
      // Stijl 2: de stem gemixt zoals in een studio: rommel onder 75 Hz weg, minder dreun, meer helderheid, een
      // compressor voor een gelijkmatig volume en een de-esser tegen scherpe s-klanken.
      const mix2 = (script.stijl || 1) >= 2 ? ['-af', 'highpass=f=75,equalizer=f=220:t=q:w=1.1:g=-2,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=10000:t=q:w=1:g=1.5,acompressor=threshold=0.1:ratio=3:attack=5:release=70:makeup=1.6,deesser=i=0.35'] : [];
      const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', wav, ...mix2, '-ac', '1', '-ar', String(GELUID.RATE), '-f', 'f32le', 'pipe:1'], { maxBuffer: 64 << 20 });
      if ((script.stijl || 1) >= 2) {
        const v2t = (script.stijl || 1) >= 3;   // stijl 3: woordtijden versie 2 (lange zinnen met veel komma's)
        const tijden = wav.replace(/\.wav$/, v2t ? '.woorden2.json' : '.woorden.json');
        if (!fs.existsSync(tijden)) fs.writeFileSync(tijden, execFileSync(KOKORO_PY, [path.join(__dirname, 'short', 'woordtijden.py'), wav, stem[0] === 'b' ? 'en-gb' : 'en-us', s.stem, ...(v2t ? ['--v2'] : [])]));
        s._woorden = JSON.parse(fs.readFileSync(tijden, 'utf8')).map(w => ({ ...w, start: w.start + (s.stemStart ?? 0.12), eind: w.eind + (s.stemStart ?? 0.12) }));
      }
      // stijl 3: `bronStart: 'woord'` en geluid `['woord', naam, volume]` vallen op het moment dat dat woord gezegd wordt
      if (typeof s.bronStart === 'string') s.bronStart = woordTijd(s, s.bronStart) ?? 0.6;
      for (const g of s.geluid || []) if (typeof g[0] === 'string') g[0] = woordTijd(s, g[0]) ?? 0.3;
      const smp = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), start = s.stemStart ?? 0.12, lengte = smp.length / GELUID.RATE;
      if ((script.stijl || 1) >= 3) {   // mond van de figuur: de sterkte van de stem per beeld (0..1)
        const per = Math.round(GELUID.RATE / FPS), niveaus = [];
        for (let a = 0; a < smp.length; a += per) { let q = 0; const b = Math.min(smp.length, a + per); for (let k = a; k < b; k++) q += smp[k] * smp[k]; niveaus.push(Math.sqrt(q / (b - a))); }
        const top = Math.max(1e-6, ...niveaus); s._mond = { start, niveaus: niveaus.map(x => x / top) };
      }
      // Stijl 2: de tekst loopt gelijk met de stem, dus het laatste woord verschijnt pas als het gezegd is. Daarom
      // 0,3 s extra om de hele zin te lezen, en in de laatste scène ook de lus erbij, zodat de slotzin niet pas
      // tijdens het terugvloeien in beeld komt.
      const st2 = (script.stijl || 1) >= 2, laatste = i === script.scenes.length - 1;
      s.duur = Math.max(s.duur, start + lengte + 0.25 + (st2 ? 0.3 : 0) + (st2 && laatste && script.lus ? script.lus + 0.4 : 0));
      sporen.push({ begin: t0 + start, smp });
      tekst += `${i + 1}. ${s.wie ? `[${s.wie}, ${stem}] ` : ''}${s.stem}\n`;
    }
    t0 += s.duur;
  });
  fs.writeFileSync(path.join(map, 'bron', 'stem.txt'), `Stem: Kokoro-82M (Apache-2.0), stem ${script.stemmen ? Object.entries(script.stemmen).map(([k, v]) => `${k} = ${v.stem}`).join(', ') : script.stem.stem}, tempo ${script.stem.tempo || 1.1}; lokaal gemaakt met gereedschap/short/stem.py.\nIngesproken tekst per scène:\n${tekst}`);
  return sporen;
}
// Stem in de mix: effecten zachter (0,5) zodat de stem boven ligt, daarna een begrenzer tegen oversturen.
function mengStem(pcm, sporen) {
  if (!sporen.length) return pcm;
  for (let k = 0; k < pcm.length; k++) pcm[k] *= 0.5;
  for (const { begin, smp } of sporen) {
    const b = Math.round(begin * GELUID.RATE);
    for (let j = 0; j < smp.length && (b + j) * 2 + 1 < pcm.length; j++) { pcm[(b + j) * 2] += smp[j] * 0.95; pcm[(b + j) * 2 + 1] += smp[j] * 0.95; }
  }
  let piek = 0; for (let k = 0; k < pcm.length; k++) piek = Math.max(piek, Math.abs(pcm[k]));
  if (piek > 0.97) { const f = 0.97 / piek; for (let k = 0; k < pcm.length; k++) pcm[k] *= f; }
  return pcm;
}

async function maak(code, alleenBeelden, opties = {}) {
  const script = require(path.join(WORTEL, 'teksten', 'shorts', code + '.cjs'));
  if (opties.stijl) script.stijl = opties.stijl;   // --stijl 2: proef met de nieuwe stijl zonder het script te wijzigen
  const map = opties.map ? path.resolve(opties.map) : path.join(WORTEL, 'pakketten', script.map);
  fs.mkdirSync(path.join(map, 'bron'), { recursive: true });
  const stemSporen = voorbereidStem(script, map);
  if ((script.stijl || 1) >= 2) await bereidPapier();
  if ((script.stijl || 1) >= 3) await bereidDecor(script);
  const duur = totaal(script), n = Math.round(duur * FPS);
  console.log(`${code}: ${duur.toFixed(1)} s, ${n} beelden -> ${path.relative(WORTEL, map)}`);

  // Controlebeelden: het eind van elke scene (alles staat dan in beeld) -> overzicht.jpg
  const momenten = []; let t0 = 0;
  for (const s of script.scenes) { momenten.push(t0 + s.duur - 0.2); t0 += s.duur; }
  const tegels = await Promise.all(momenten.map(async tm => sharp(Buffer.from(teken(svgVoor(script, tm)).asPng())).resize(270, 480).png().toBuffer()));
  const kol = Math.min(tegels.length, 4), rij = Math.ceil(tegels.length / kol), m = 16;
  await sharp({ create: { width: kol * 270 + (kol + 1) * m, height: rij * 480 + (rij + 1) * m, channels: 3, background: '#222' } })
    .composite(tegels.map((b, i) => ({ input: b, left: m + (i % kol) * (270 + m), top: m + Math.floor(i / kol) * (480 + m) })))
    .jpeg({ quality: 86 }).toFile(path.join(map, 'overzicht.jpg'));
  console.log('overzicht.jpg klaar (' + tegels.length + ' scenes)');
  if (alleenBeelden) return;

  const doel = path.join(map, 'video.mp4');
  const v2 = script.versie === 2;
  let audioIn = ['-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000'];
  if (v2) {
    const lijst = geluidLijst(script);
    if ((script.stijl || 1) >= 2) {   // markeerstift en krabbels: hun momenten opnemen door alle beelden één keer als tekst te maken
      const gezien = new Map();
      B.opname = (tm, naam) => { const k = `${naam}@${tm.toFixed(2)}`; if (!gezien.has(k)) gezien.set(k, [tm, naam]); };
      for (let i = 0; i < n; i++) svgVoor(script, i / FPS);
      B.opname = null;
      const vol = { streep: 0.3, kras: 0.38 };
      for (const [tm, naam] of gezien.values()) if (tm >= 0 && tm < duur) lijst.push([tm, naam, vol[naam] ?? 0.3, 0]);
    }
    const pcm = mengStem(GELUID.mix(lijst, duur), stemSporen);
    const tmp = path.join(require('os').tmpdir(), `short-${code}-geluid.f32`);
    fs.writeFileSync(tmp, Buffer.from(pcm.buffer));
    audioIn = ['-f', 'f32le', '-ar', String(GELUID.RATE), '-ac', '2', '-i', tmp];
    console.log(`geluid: ${lijst.length} effecten`);
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    ...audioIn,
    '-map', '0:v', '-map', '1:a', '-shortest',
    '-c:v', 'libx264', '-preset', (script.stijl || 1) >= 2 ? 'slow' : 'medium', '-crf', (script.stijl || 1) >= 2 ? '17' : v2 ? '20' : '18', ...(v2 ? ['-maxrate', '7M', '-bufsize', '14M'] : []),   // korrel comprimeert slecht: v2 begrensd (GitHub weigert bestanden > 100 MB)
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
    ...(stemSporen.length ? ['-af', 'loudnorm=I=-14:TP=-1.5:LRA=11'] : []),   // met stem: luidheid zoals YouTube die afspeelt (-14 LUFS)
    '-c:a', 'aac', '-b:a', v2 ? '192k' : '128k', doel], { stdio: ['pipe', 'inherit', 'inherit'] });
  let vorige = '', buf = null; const begon = Date.now();
  for (let i = 0; i < n; i++) {
    const svg = svgVoor(script, i / FPS);
    if (svg !== vorige) { buf = Buffer.from(teken(svg).pixels); vorige = svg; }   // stilstaande beelden niet opnieuw tekenen
    const beeld = v2 ? korrel(buf, i) : buf;
    if (!ff.stdin.write(beeld)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) process.stdout.write(`  ${i}/${n}  (${((Date.now() - begon) / 1000).toFixed(0)} s)\n`);
  }
  ff.stdin.end();
  await new Promise((ok, fout) => ff.on('close', c => c === 0 ? ok() : fout(new Error('ffmpeg ' + c))));
  const info = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'compact', doel]).toString();
  console.log(info.trim());
  if (v2) await controleBlad(script, map, doel);
}

// Controleblad uit de echte mp4: per scène een beeld midden in de overgang (0,12 s na het begin) en een beeld
// halverwege, zodat je ziet dat niets buiten beeld of over elkaar valt terwijl het beweegt.
async function controleBlad(script, map, doel) {
  const tijden = []; let t0 = 0;
  for (const s of script.scenes) { tijden.push(t0 + 0.12, t0 + s.duur * 0.5); t0 += s.duur; }
  const tegels = [];
  for (const tm of tijden) {
    const png = execFileSync('ffmpeg', ['-v', 'error', '-ss', tm.toFixed(3), '-i', doel, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1'], { maxBuffer: 64 << 20 });
    tegels.push(await sharp(png).resize(216, 384).png().toBuffer());
  }
  const kol = 6, rij = Math.ceil(tegels.length / kol), m = 12;
  await sharp({ create: { width: kol * 216 + (kol + 1) * m, height: rij * 384 + (rij + 1) * m, channels: 3, background: '#222' } })
    .composite(tegels.map((b, i) => ({ input: b, left: m + (i % kol) * (216 + m), top: m + Math.floor(i / kol) * (384 + m) })))
    .jpeg({ quality: 84 }).toFile(path.join(map, 'bron', 'controle-beweging.jpg'));
  console.log('bron/controle-beweging.jpg klaar (' + tegels.length + ' beelden uit de mp4)');
}

if (require.main === module) {
  const a = process.argv.slice(2), code = a[0], waarde = v => { const i = a.indexOf(v); return i > 0 ? a[i + 1] : undefined; };
  if (!code) { console.error('gebruik: node gereedschap/short.cjs YS01 [--frames] [--stijl 2] [--map <uitvoermap>]'); process.exit(1); }
  maak(code, a.includes('--frames'), { stijl: Number(waarde('--stijl')) || 0, map: waarde('--map') }).catch(e => { console.error(e); process.exit(1); });
}
module.exports = { maak, svgVoor, teken, K, geluidLijst };
