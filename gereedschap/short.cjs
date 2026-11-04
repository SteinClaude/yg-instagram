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
function kader(script, scene, t) {
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
function bronRegel(tekst, t, start, nacht) {
  const p = fase(t, start, 0.5); if (p <= 0 || !tekst) return '';
  return blok('Source: ' + tekst, { y: 1330, g: 30, gewicht: 'mono', kleur: nacht ? '#C9C6BC' : K.grijs, accent: K.signaal, t, start, max: 800, regelHoogte: 1.3 }).svg;
}

const HULP = () => ({ K, blok, fase, zacht, uit, klem, stopbord, vorm, klok, toetsen, veelhoek, W, H, esc, maat, FONT,
  kin: B.kin, veer: B.veer, foto });
// Eén volledig beeld van een scène op tijd t (achtergrond, kop, inhoud, bronregel), zonder <svg>-omhulsel.
function beeldVan(script, scene, t) {
  const inhoud = scene.teken({ t, duur: scene.duur, ...HULP() });
  if (script.versie !== 2) return `${kader(script, scene, t)}${inhoud}${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht)}`;
  if (script.kanaal === 2) { const cam = B.camera(t, scene.duur, scene.camera), achter = scene.achter ? scene.achter({ t, duur: scene.duur, ...HULP() }) : '';
    return `${kader2(script)}<g transform="${cam}">${achter}</g>${verloop2()}<g transform="${cam}">${inhoud}</g>` +
    `${kop2(script)}${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, true)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`; }
  const licht = scene.nacht ? '' : `<rect width="${W}" height="${H}" fill="url(#licht)"/>`;
  return `${kader(script, scene, t)}${licht}<g transform="${B.camera(t, scene.duur, scene.camera)}">${inhoud}</g>` +
    `${bronRegel(scene.bron, t, scene.bronStart ?? 0.6, scene.nacht)}<rect width="${W}" height="${H}" fill="url(#vignet)"/>`;
}
function svgVoor(script, tijd) {
  let t0 = 0;
  const sc = script.scenes;
  for (let i = 0; i < sc.length; i++) {
    const scene = sc[i];
    if (tijd < t0 + scene.duur || i === sc.length - 1) {
      const t = tijd - t0;
      let lijf = beeldVan(script, scene, t);
      if (script.versie === 2 && scene.in && i > 0 && t < B.OVERGANG_DUUR) {
        const vorige = beeldVan(script, sc[i - 1], sc[i - 1].duur - 0.001);
        lijf = B.overgang(scene.in, B.uit(t / B.OVERGANG_DUUR), vorige, lijf, i);
      }
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
    for (const [t, naam, vol, pan] of s.geluid || []) lijst.push([t0 + t, naam, vol ?? 1, pan ?? 0]);
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

async function maak(code, alleenBeelden) {
  const script = require(path.join(WORTEL, 'teksten', 'shorts', code + '.cjs'));
  const map = path.join(WORTEL, 'pakketten', script.map);
  fs.mkdirSync(path.join(map, 'bron'), { recursive: true });
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
    const lijst = geluidLijst(script), pcm = GELUID.mix(lijst, duur);
    const tmp = path.join(require('os').tmpdir(), `short-${code}-geluid.f32`);
    fs.writeFileSync(tmp, Buffer.from(pcm.buffer));
    audioIn = ['-f', 'f32le', '-ar', String(GELUID.RATE), '-ac', '2', '-i', tmp];
    console.log(`geluid: ${lijst.length} effecten`);
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    ...audioIn,
    '-map', '0:v', '-map', '1:a', '-shortest',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', v2 ? '20' : '18', ...(v2 ? ['-maxrate', '7M', '-bufsize', '14M'] : []),   // korrel comprimeert slecht: v2 begrensd (GitHub weigert bestanden > 100 MB)
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
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
  const [code, vlag] = process.argv.slice(2);
  if (!code) { console.error('gebruik: node gereedschap/short.cjs YS01 [--frames]'); process.exit(1); }
  maak(code, vlag === '--frames').catch(e => { console.error(e); process.exit(1); });
}
module.exports = { maak, svgVoor, teken, K, geluidLijst };
