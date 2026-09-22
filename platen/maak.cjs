// Instagram-platen voor YG Digital. Zelfde aanpak als brand/generator.js:
// tekst wordt omgezet naar paden met opentype.js, daarna SVG -> PNG met resvg.
// Draaien:  node instagram/maak.cjs          (alles)
//           node instagram/maak.cjs 03       (alleen bericht 03)
const fs = require('fs'), path = require('path');
const opentype = require('C:/Users/gijsm/yg-luxury/brand/node_modules/opentype.js');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const HIER = __dirname, MERK = HIER;          // fonts/ staat hier nu naast
const UIT = path.join(HIER, 'uit'); fs.mkdirSync(UIT, { recursive: true });

// ---------------------------------------------------------------- kleuren
const K = {
  donker: {
    grond: '#141414', diep: '#0E0E0E', kop: '#F3EEE4', tekst: '#C9C3B8',
    goud: '#C9A45C', goudLicht: '#E3C889', lijn: 'rgba(201,164,92,0.34)', gloed: true,
  },
  ivoor: {
    // klein goud op ivoor is #7B6132 (goud primair haalt daar geen AA-contrast)
    grond: '#F6F1E8', diep: '#EFE8DA', kop: '#1C1B18', tekst: '#6B665E',
    goud: '#7B6132', goudLicht: '#8C6F3A', lijn: 'rgba(140,111,58,0.30)', gloed: false,
  },
};

// ---------------------------------------------------------------- letters
const laadLetter = p => { const b = fs.readFileSync(path.join(MERK, p)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const L = {
  serif: laadLetter('fonts/PlayfairDisplay-400.ttf'),
  sans: laadLetter('fonts/Montserrat-400.ttf'),
  sansMed: laadLetter('fonts/Montserrat-500.ttf'),
};
const r3 = n => Math.round(n * 1000) / 1000;

// Tekst naar paden. Glyphs op (0,0) met translate (NaN-bug in opentype.js).
// Die bug slaat bij enkele glyphs toe op precies e'e'n lettergrootte (het euroteken
// bijvoorbeeld op 136,000 maar niet op 136,01), dus schuiven we dan een honderdste op.
function padVan(glyph, grootte) {
  for (const duw of [0, 0.01, -0.01, 0.05, -0.05, 0.2]) {
    const d = glyph.getPath(0, 0, grootte + duw).toPathData(3);
    if (!/NaN/.test(d)) return d;
  }
  return null;
}
function pad(font, tekst, x, y, grootte, spatie, vul, doorzicht) {
  const s = grootte / font.unitsPerEm; let cx = x; const delen = [];
  const gs = [...tekst].map(ch => font.charToGlyph(ch));
  gs.forEach((g, i) => {
    const d = padVan(g, grootte);
    if (d === null) throw new Error('NaN in glyph ' + tekst[i]);
    if (d) delen.push(`<path fill="${vul}"${doorzicht ? ` opacity="${doorzicht}"` : ''} transform="translate(${r3(cx)},${r3(y)})" d="${d}"/>`);
    cx += g.advanceWidth * s;
    if (i < gs.length - 1) { let k = 0; try { k = font.getKerningValue(g, gs[i + 1]); } catch { k = 0; } if (!Number.isFinite(k) || Math.abs(k) > font.unitsPerEm * 0.15) k = 0; cx += k * s + spatie; }
  });
  return { w: cx - x, svg: delen.join('') };
}
const breedte = (font, t, g, sp) => pad(font, t, 0, 0, g, sp, '#000').w;

// Regels afbreken op maximale breedte.
function breek(font, tekst, grootte, spatie, max) {
  const uit = [];
  for (const stuk of String(tekst).split('\n')) {
    const woorden = stuk.split(' '); let regel = '';
    for (const w of woorden) {
      const kandidaat = regel ? regel + ' ' + w : w;
      if (regel && breedte(font, kandidaat, grootte, spatie) > max) { uit.push(regel); regel = w; }
      else regel = kandidaat;
    }
    uit.push(regel);
  }
  return uit;
}

// Regels tekenen, uitgelijnd links of gecentreerd. y = basislijn van de eerste regel.
function regels(font, rs, grootte, spatie, regelhoogte, vul, x, y, uitlijn, max) {
  let svg = '';
  rs.forEach((r, i) => {
    const w = breedte(font, r, grootte, spatie);
    const rx = uitlijn === 'midden' ? x - w / 2 : x;
    svg += pad(font, r, rx, y + i * grootte * regelhoogte, grootte, spatie, vul).svg;
  });
  return svg;
}

// Beeldmerk: poort met binnenboog, drempel, sluitsteen en YG. Eigen vlak 100 x 110.
function poort(kleur, x = 0, y = 0, schaal = 1) {
  const g = 34, w = breedte(L.serif, 'YG', g, 1);
  const yg = pad(L.serif, 'YG', 50 - w / 2, 84, g, 1, kleur);
  return `<g transform="translate(${r3(x)},${r3(y)}) scale(${r3(schaal)})">` +
    `<path d="M14 104V48a36 36 0 0 1 72 0v56" fill="none" stroke="${kleur}" stroke-width="2.5" stroke-linecap="round"/>` +
    `<path d="M24 104V50a26 26 0 0 1 52 0v54" fill="none" stroke="${kleur}" stroke-width="1" opacity="0.6"/>` +
    `<path d="M4 104h92" stroke="${kleur}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M50 5l4.5 7-4.5 7-4.5-7z" fill="${kleur}"/>${yg.svg}</g>`;
}

// ---------------------------------------------------------------- blokken
// Elk blok kent meet() -> hoogte en teken(y) -> svg. C is de kaartcontext.
function maakBlokken(blokken, C) {
  const M = [];
  for (const b of blokken) {
    if (!b) continue;
    const t = b.t;
    if (t === 'lijn') {
      M.push({ h: 1, marge: b.marge ?? 30 * C.s, teken: y => `<rect x="${C.mx - 34 * C.s}" y="${r3(y)}" width="${68 * C.s}" height="1" fill="${C.k.goud}"/>` });
    } else if (t === 'boven') {
      const g = 23 * C.s, sp = 0.24 * g, rs = breek(L.sansMed, b.tekst.toUpperCase(), g, sp, C.max);
      M.push({ h: g * (rs.length - 1) * 1.5 + g * 0.72, marge: b.marge ?? 34 * C.s, teken: y => regels(L.sansMed, rs, g, sp, 1.5, C.k.goud, C.mx, y + g * 0.72, 'midden') });
    } else if (t === 'kop') {
      let g = (b.grootte ?? 76) * C.s; const sp = 0;
      let rs = breek(L.serif, b.tekst, g, sp, C.max);
      while (rs.length > (b.maxRegels ?? 4) && g > 34 * C.s) { g -= 3 * C.s; rs = breek(L.serif, b.tekst, g, sp, C.max); }
      M.push({ h: g * 0.72 + g * (rs.length - 1) * 1.17, marge: b.marge ?? 32 * C.s, teken: y => regels(L.serif, rs, g, sp, 1.17, C.k.kop, C.mx, y + g * 0.72, 'midden') });
    } else if (t === 'tekst') {
      const g = (b.grootte ?? 29) * C.s, sp = 0, max = b.max ? b.max * C.s : C.max;
      const rs = breek(L.sans, b.tekst, g, sp, max);
      M.push({ h: g * 0.72 + g * (rs.length - 1) * 1.6, marge: b.marge ?? 30 * C.s, teken: y => regels(L.sans, rs, g, sp, 1.6, C.k.tekst, C.mx, y + g * 0.72, 'midden') });
    } else if (t === 'prijs') {
      const g = (b.grootte ?? 136) * C.s, go = 22 * C.s, sp = 0.1 * go;
      const rsOnder = b.onder ? breek(L.sansMed, b.onder, go, sp, C.max) : [];
      const hOnder = rsOnder.length ? 26 * C.s + go * 0.72 + go * (rsOnder.length - 1) * 1.5 : 0;
      M.push({
        h: g * 0.72 + hOnder, marge: b.marge ?? 34 * C.s, teken: y => {
          const w = breedte(L.serif, b.bedrag, g, 0);
          let s = pad(L.serif, b.bedrag, C.mx - w / 2, y + g * 0.72, g, 0, C.k.goudLicht).svg;
          if (rsOnder.length) s += regels(L.sansMed, rsOnder, go, sp, 1.5, C.k.tekst, C.mx, y + g * 0.72 + 26 * C.s + go * 0.72, 'midden');
          return s;
        },
      });
    } else if (t === 'lijst') {
      const gk = (b.grootte ?? 30) * C.s, gt = (b.grootteTekst ?? 25) * C.s;
      const inspring = 40 * C.s, x = C.marge + inspring, max = C.max - inspring;
      const rijen = b.items.map(it => {
        const o = typeof it === 'string' ? { kop: it } : it;
        const rk = breek(L.sansMed, o.kop, gk, 0.02 * gk, max);
        const rt = o.tekst ? breek(L.sans, o.tekst, gt, 0, max) : [];
        const h = gk * 0.72 + gk * (rk.length - 1) * 1.4 + (rt.length ? 12 * C.s + gt * 0.72 + gt * (rt.length - 1) * 1.5 : 0);
        return { rk, rt, h };
      });
      const gat = (b.gat ?? 30) * C.s;
      const totaal = rijen.reduce((a, r) => a + r.h, 0) + gat * (rijen.length - 1);
      M.push({
        h: totaal, marge: b.marge ?? 32 * C.s, teken: y => {
          let s = '', cy = y;
          for (const r of rijen) {
            const d = 7 * C.s, dy = cy + gk * 0.34;
            s += `<rect x="${r3(C.marge + 4 * C.s)}" y="${r3(dy - d)}" width="${r3(d * 2)}" height="${r3(d * 2)}" fill="${C.k.goud}" transform="rotate(45 ${r3(C.marge + 4 * C.s + d)} ${r3(dy)})"/>`;
            s += regels(L.sansMed, r.rk, gk, 0.02 * gk, 1.4, C.k.kop, x, cy + gk * 0.72, 'links');
            if (r.rt.length) s += regels(L.sans, r.rt, gt, 0, 1.5, C.k.tekst, x, cy + gk * 0.72 + gk * (r.rk.length - 1) * 1.4 + 12 * C.s + gt * 0.72, 'links');
            cy += r.h + gat;
          }
          return s;
        },
      });
    } else if (t === 'beeld') {
      const w = b.breedte ? b.breedte * C.s : C.max, h = b.hoogte * C.s;
      M.push({
        h, marge: b.marge ?? 36 * C.s, teken: y => {
          const x = C.mx - w / 2;
          return `<image x="${r3(x)}" y="${r3(y)}" width="${r3(w)}" height="${r3(h)}" href="${C.beelden[b.bron]}"/>` +
            `<rect x="${r3(x - 0.5)}" y="${r3(y - 0.5)}" width="${r3(w + 1)}" height="${r3(h + 1)}" fill="none" stroke="${C.k.goud}" stroke-width="1.6" opacity="0.85"/>`;
        },
      });
    } else if (t === 'svg') {
      M.push({ h: b.hoogte * C.s, marge: b.marge ?? 36 * C.s, teken: y => b.teken(C, y) });
    } else if (t === 'ruimte') {
      M.push({ h: 0, marge: (b.h ?? 20) * C.s, teken: () => '' });
    }
  }
  return M;
}

// ---------------------------------------------------------------- de kaart
async function beeldNaarUri(bron, w, h, snij) {
  let s = sharp(path.join(HIER, 'bron', bron));
  if (snij) s = s.extract({ left: snij[0], top: snij[1], width: snij[2], height: snij[3] });
  const buf = await s.resize(Math.round(w), Math.round(h), { fit: 'cover', position: 'top' })
    .jpeg({ quality: 92 }).toBuffer();
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

// Foto die de hele kaart vult, met een donker verloop zodat tekst onderaan leesbaar blijft.
async function achtergrondSvg(a, W, H) {
  const buf = await sharp(path.join(HIER, 'bron', a.bron))
    .resize(W, H, { fit: 'cover', position: a.positie || 'centre' })
    .modulate({ brightness: a.helderheid ?? 0.82, saturation: a.verzadiging ?? 0.85 })
    .jpeg({ quality: 90 }).toBuffer();
  const beeld = `<image x="0" y="0" width="${W}" height="${H}" href="data:image/jpeg;base64,${buf.toString('base64')}"/>`;
  // Lichte stand (a.licht): geen donker verloop maar een ivoren waas, zodat de
  // foto als een afdruk op crèmepapier achter de tekst ligt. Gemaakt voor de
  // weggeefactie, die licht moet blijven om op het raster op te vallen.
  if (a.licht) {
    const waas = a.waas ?? 0.84;
    return beeld + `<defs><linearGradient id="verloop" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#F6F1E8" stop-opacity="${Math.max(0, waas - 0.16)}"/>
<stop offset="40%" stop-color="#F6F1E8" stop-opacity="${waas}"/>
<stop offset="100%" stop-color="#F6F1E8" stop-opacity="${Math.min(1, waas + 0.06)}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#verloop)"/>`;
  }
  const donker = a.donkerte ?? 0.94;
  return beeld + `<defs><linearGradient id="verloop" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#141414" stop-opacity="0.30"/>
<stop offset="34%" stop-color="#141414" stop-opacity="0.12"/>
<stop offset="58%" stop-color="#141414" stop-opacity="0.55"/>
<stop offset="100%" stop-color="#141414" stop-opacity="${donker}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#verloop)"/>`;
}

async function kaart(plaat, W, H) {
  const s = W / 1080 * (H / W < 1.15 ? 0.94 : 1);   // vierkant iets compacter
  const k = K[plaat.achtergrond ? (plaat.achtergrond.licht ? 'ivoor' : 'donker') : (plaat.soort || 'donker')];
  const marge = 100 * (W / 1080), kader = 46 * (W / 1080);
  const C = { k, s, W, H, marge, max: W - 2 * marge, mx: W / 2, beelden: {} };
  const achtergrond = plaat.achtergrond ? await achtergrondSvg(plaat.achtergrond, W, H) : '';

  // beelden vooraf op maat snijden
  for (const b of plaat.blokken) {
    if (b && b.t === 'beeld') {
      const bw = (b.breedte ? b.breedte * s : C.max), bh = b.hoogte * s;
      C.beelden[b.bron] = await beeldNaarUri(b.bron, bw * 1.35, bh * 1.35, b.snij);
    }
  }

  // Bij een verhaal (plaat.veilig) legt Instagram bovenin (± 220 px) en onderin
  // (± 420 px) zijn eigen naam, balk en knoppen over het beeld. Embleem, tekst en
  // voetregel blijven dan binnen de zone daartussen.
  const veilig = !!plaat.veilig && H > W * 1.5, f = W / 1080;
  const bovenChroom = veilig ? 236 * f : kader + 30 * f, poortH = 33 * f;
  const voetY = veilig ? 1484 * f : H - kader - 40 * f;
  const bodem = veilig ? 1440 * f : H - kader - 74 * f;

  // Past de inhoud niet (vooral in het vierkante formaat), dan krimpen we net
  // zolang tot hij wel past. Zo raakt tekst nooit de voetregel.
  let blokken, hoogte, top;
  for (let poging = 0; poging < 14; poging++) {
    C.s = s * Math.pow(0.96, poging);
    blokken = maakBlokken(plaat.blokken, C);
    hoogte = blokken.reduce((a, b, i) => a + b.h + (i < blokken.length - 1 ? b.marge : 0), 0);
    top = bovenChroom + poortH + 54 * C.s;
    if (hoogte <= bodem - top) break;
  }
  // 'onder' zet de tekst onderaan (bij een foto), anders gecentreerd
  let y = plaat.uitlijn === 'onder' ? bodem - hoogte - 30 * (W / 1080) : top + Math.max(0, (bodem - top - hoogte) / 2);

  let inhoud = '';
  for (const b of blokken) { inhoud += b.teken(y); y += b.h + b.marge; }

  const voet = (plaat.voet || 'yg-digital.nl').toUpperCase();
  const gv = 19 * (W / 1080), spv = 0.2 * gv, wv = breedte(L.sansMed, voet, gv, spv);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><radialGradient id="gloed" cx="50%" cy="34%" r="62%">
<stop offset="0%" stop-color="${k.goud}" stop-opacity="${k.gloed ? 0.13 : 0.07}"/>
<stop offset="100%" stop-color="${k.goud}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="${k.grond}"/>
${achtergrond || `<rect width="${W}" height="${H}" fill="url(#gloed)"/>`}
<rect x="${r3(kader)}" y="${r3(kader)}" width="${r3(W - 2 * kader)}" height="${r3(H - 2 * kader)}" fill="none" stroke="${k.lijn}" stroke-width="1.4"/>
${poort(k.goud, W / 2 - 15 * (W / 1080), bovenChroom, 0.30 * (W / 1080))}
${inhoud}
${pad(L.sansMed, voet, W / 2 - wv / 2, voetY, gv, spv, k.goud).svg}
</svg>`;

  const png = new Resvg(svg, {
    font: { fontFiles: [], loadSystemFonts: false },
    fitTo: { mode: 'width', value: W },
  }).render().asPng();
  return png;
}

module.exports = { kaart, K, L, pad, breedte, breek, regels, poort, r3 };

// ---------------------------------------------------------------- draaien
// Nederlands komt in uit/, Engels in uit/en/ (zelfde bestandsnamen).
//   node instagram/maak.cjs            alles, beide talen
//   node instagram/maak.cjs 03         alleen bericht 03, beide talen
//   node instagram/maak.cjs 03 en      alleen bericht 03, alleen Engels
if (require.main === module) {
  const [filter, alleenTaal] = process.argv.slice(2);
  const TALEN = [['nl', './berichten.cjs', UIT], ['en', './berichten-en.cjs', path.join(UIT, 'en')]];
  (async () => {
    let n = 0;
    for (const [taal, bestand, map] of TALEN) {
      if (alleenTaal && alleenTaal !== taal) continue;
      fs.mkdirSync(map, { recursive: true });
      for (const p of require(bestand)) {
        if (filter && !p.id.startsWith(filter)) continue;
        for (const [naam, W, H] of [['4x5', 1080, 1350], ['1x1', 1080, 1080]]) {
          fs.writeFileSync(path.join(map, `${p.id}-${naam}.png`), await kaart(p, W, H));
          n++;
        }
        console.log(taal.toUpperCase(), p.id.padEnd(26), '✓');
      }
    }
    console.log('\n' + n + ' platen');
  })().catch(e => { console.error(e); process.exit(1); });
}
