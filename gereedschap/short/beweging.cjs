// Beweging voor shorts versie 2 (opdracht Eva, 2 nov 19:45): tekst die woord voor woord binnenveert met nadruk op het
// sleutelwoord, een camera die over de hele scène beweegt (langzaam inzoomen, stoten, schudden) en snelle overgangen
// tussen scènes (zweep, flits, masker, omhoog, zoom). Alles is SVG; short.cjs tekent en codeert.
//
//   const B = require('./short/beweging.cjs')({ FONT, maat, esc, K, W, H, woorden, breek });
//   B.kin('Why does a stop sign have *eight* sides?', { y: 400, g: 104, t, start: 0.1 })   -> { svg, hoogte, eind }
//   B.camera(t, duur, { zoom: [1, 1.05], stoot: [0.4], schud: [0.4] })                    -> transform-tekst
//   B.overgang('zweep', e, vorigeSvg, huidigeSvg)                                          -> svg
'use strict';

module.exports = function ({ FONT, maat, esc, K, W, H, woorden, breek }) {
  const klem = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const uit = x => { x = klem(x); return 1 - Math.pow(1 - x, 3); };
  const zacht = x => { x = klem(x); return x * x * (3 - 2 * x); };
  // veer met doorschieten (back-out): komt iets voorbij zijn plek en zakt terug
  const veer = (x, s = 1.9) => { x = klem(x); const c3 = s + 1; return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };

  // ------------------------------------------------------------ kinetische tekst
  // *woord* = sleutelwoord. nadruk 'kleur' (signaalrood, kleine stoot) of 'balk' (gele markeerbalk die eronder groeit).
  // weg: tijd waarop de woorden er snel weer uit vliegen (voor een scène die met een nieuwe zin verdergaat).
  function kin(tekst, o = {}) {
    const { x = 100, y, g = 96, max = 880, t, start = 0, stap = 0.085, duurW = 0.36, gewicht = 'bold',
      kleur = K.inkt, accent = K.signaal, midden = false, regelHoogte = 1.1, nadruk = 'kleur', balk = K.geel, weg = null } = o;
    const font = gewicht === 'bold' ? FONT.bold : gewicht === 'mono' ? FONT.mono : FONT.regular;
    const fam = gewicht === 'mono' ? 'IBM Plex Mono' : 'Instrument Sans', fw = gewicht === 'regular' ? 400 : 700;
    const regels = breek(tekst, g, max, font), sp = maat(font, ' ', g);
    let svg = '', i = 0;
    const wegP = weg == null ? 0 : uit((t - weg) / 0.28);
    regels.forEach((r, ri) => {
      const breedte = r.reduce((a, z, j) => a + maat(font, z.w, g) + (j ? sp : 0), 0);
      let cx0 = midden ? (W - breedte) / 2 : x;
      const by = y + g * 0.82 + ri * g * regelHoogte;
      for (const z of r) {
        const wb = maat(font, z.w, g), ts = start + i * stap, u = (t - ts) / duurW;
        const acc = z.stukken.some(s => s.accent);
        if (u > 0 && wegP < 1) {
          const p = veer(u), op = klem(u * 2.6) * (1 - wegP);
          const na = Math.max(0, t - ts - duurW);
          const stoot = acc && nadruk === 'kleur' ? 0.14 * Math.exp(-na * 6) * klem(u) : 0;
          const sc = (0.5 + 0.5 * p) * (1 + stoot);
          const dy = (1 - p) * 60 - wegP * 90, cx = cx0 + wb / 2, cy = by - g * 0.32;
          let w = '';
          if (acc && nadruk === 'balk') {
            const bw = uit((t - ts - 0.1) / 0.3);
            if (bw > 0) w += `<rect x="${(cx0 - 12).toFixed(1)}" y="${(by - g * 0.8).toFixed(1)}" width="${((wb + 24) * bw).toFixed(1)}" height="${(g * 1.0).toFixed(1)}" rx="8" fill="${balk}"/>`;
          }
          const spans = z.stukken.map(st => `<tspan fill="${st.accent ? (nadruk === 'balk' ? kleur : accent) : kleur}">${esc(st.s)}</tspan>`).join('');
          w += `<text x="${cx0.toFixed(1)}" y="${by.toFixed(1)}" font-family="${fam}" font-weight="${fw}" font-size="${g}" xml:space="preserve">${spans}</text>`;
          svg += `<g opacity="${op.toFixed(3)}" transform="translate(${cx.toFixed(1)} ${(cy + dy).toFixed(1)}) scale(${sc.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})">${w}</g>`;
        }
        cx0 += wb + sp; i++;
      }
    });
    return { svg, hoogte: regels.length * g * regelHoogte, eind: start + Math.max(0, i - 1) * stap + duurW, woorden: i };
  }

  // ------------------------------------------------------------ camera
  // zoom [van, naar] over de scène, pan [[x,y] van, [x,y] naar] in pixels, draai [van, naar] in graden,
  // stoot: tijden waarop de camera kort naar voren schiet, schud: tijden waarop hij kort trilt (bij een klap).
  function camera(t, duur, c = {}) {
    const [z0, z1] = c.zoom || [1, 1.045];
    const p = zacht(t / duur);
    let z = z0 + (z1 - z0) * p, dx = 0, dy = 0, d = 0;
    if (c.pan) { dx = c.pan[0][0] + (c.pan[1][0] - c.pan[0][0]) * p; dy = c.pan[0][1] + (c.pan[1][1] - c.pan[0][1]) * p; }
    if (c.draai) d = c.draai[0] + (c.draai[1] - c.draai[0]) * p;
    for (const ts of c.stoot || []) if (t >= ts) z += 0.07 * Math.exp(-(t - ts) * 7) * klem((t - ts) / 0.05);
    for (const ts of c.schud || []) if (t >= ts) { const a = 16 * Math.exp(-(t - ts) * 9); dx += a * Math.sin((t - ts) * 73); dy += a * Math.cos((t - ts) * 61); }
    const [mx, my] = c.midden || [540, 860];
    return `translate(${(mx + dx).toFixed(2)} ${(my + dy).toFixed(2)}) rotate(${d.toFixed(3)}) scale(${z.toFixed(4)}) translate(${-mx} ${-my})`;
  }

  // ------------------------------------------------------------ overgangen
  const OVERGANG_DUUR = 0.3;
  function overgang(soort, e, vorige, huidige, n = 0) {
    const s = Math.sin(Math.PI * klem(e)), id = 'ov' + n;
    // aan het begin en eind van een zweep is de vervaging 0: dan geen filter (een filter van 0 px over een groep met
    // iets buiten beeld laat resvg vastlopen). Ook binnen een zweep of op: een <g opacity> die deels buiten beeld valt,
    // of een element met filter op schaal 0, laat resvg crashen (YS13, YS14): sla zulke elementen in het script over.
    // Kanaal 2: een foto met sterke zoom (± 2,5×, ver buiten beeld) in een zweep of op crasht ook (YH02): gebruik
    // bij zulke scènes flits, masker of zoom.
    if ((soort === 'zweep' || soort === 'op') && s < 0.02) return e < 0.5 ? vorige : huidige;
    if (soort === 'zweep') {
      return `<defs><filter id="${id}" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation="${(70 * s).toFixed(1)} 0"/></filter></defs>` +
        `<g filter="url(#${id})"><g transform="translate(${(-W * e).toFixed(1)} 0)">${vorige}</g><g transform="translate(${(W * (1 - e)).toFixed(1)} 0)">${huidige}</g></g>`;
    }
    if (soort === 'op') {
      return `<defs><filter id="${id}" x="0" y="-10%" width="100%" height="120%"><feGaussianBlur stdDeviation="0 ${(70 * s).toFixed(1)}"/></filter></defs>` +
        `<g filter="url(#${id})"><g transform="translate(0 ${(-H * e).toFixed(1)})">${vorige}</g><g transform="translate(0 ${(H * (1 - e)).toFixed(1)})">${huidige}</g></g>`;
    }
    if (soort === 'masker') {
      return `${vorige}<defs><clipPath id="${id}"><circle cx="540" cy="900" r="${(1300 * e).toFixed(1)}"/></clipPath></defs><g clip-path="url(#${id})">${huidige}</g>`;
    }
    if (soort === 'zoom') {
      // de nieuwe scène staat er volledig onder (geen zwarte randen); de vorige vliegt naar voren en vervaagt
      const zv = 1 + 0.7 * e;
      return `${huidige}<g opacity="${(1 - e).toFixed(3)}" transform="translate(540 900) scale(${zv.toFixed(3)}) translate(-540 -900)">${vorige}</g>`;
    }
    // flits (standaard): de nieuwe scène met een witte flits erover die wegebt
    return `${huidige}<rect width="${W}" height="${H}" fill="#FFFFFF" opacity="${(1 - e).toFixed(3)}"/>`;
  }

  // ------------------------------------------------------------ diepte
  // Gedeelde defs: schaduw voor getekende voorwerpen, licht van linksboven, vignet aan de randen.
  const DEFS = `<defs>
<filter id="sch" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#000000" flood-opacity="0.30"/></filter>
<filter id="schKlein" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000000" flood-opacity="0.25"/></filter>
<radialGradient id="licht" cx="0.18" cy="0.12" r="0.9"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<radialGradient id="vignet" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.38"/></radialGradient>
</defs>`;

  return { kin, camera, overgang, OVERGANG_DUUR, DEFS, veer, klem, uit, zacht };
};
