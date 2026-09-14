// Gedeelde bouwblokken voor berichten.cjs (NL) en berichten-en.cjs (EN).

// ---- een nagebouwde website in een bepaalde sfeer (voor bericht 09) ---------
// o.nav: menuwoorden van rechts naar links, bv ['Contact', 'Bestellen', 'Assortiment']
function sfeer(o) {
  return {
    t: 'svg', hoogte: o.hoogte || 560, marge: o.marge,
    teken: (C, y) => {
      const M = require('./maak.cjs'), r3 = M.r3;
      const w = C.max, h = (o.hoogte || 560) * C.s, x = C.marge;
      const kopLetter = o.serif ? M.L.serif : M.L.sansMed;
      const p = w * 0.052, navH = h * 0.145, ronde = o.ronde || 0;
      const rechts = x + w * 0.555, beeldW = w - (rechts - x) - p;

      let s = `<clipPath id="kn${o.sleutel}"><rect x="${r3(x)}" y="${r3(y)}" width="${r3(w)}" height="${r3(h)}" rx="${ronde}"/></clipPath>`;
      s += `<g clip-path="url(#kn${o.sleutel})">`;
      s += `<rect x="${r3(x)}" y="${r3(y)}" width="${r3(w)}" height="${r3(h)}" fill="${o.grond}"/>`;

      // menubalk
      const gl = w * 0.030, gn = w * 0.0195;
      s += M.pad(kopLetter, o.naam, x + p, y + navH / 2 + gl * 0.34, gl, gl * 0.04, o.ink).svg;
      let nx = x + w - p;
      for (const item of (o.nav || ['Contact', 'Bestellen', 'Assortiment']).slice(0, 3)) {
        const bw = M.breedte(M.L.sans, item, gn, gn * 0.03);
        nx -= bw; s += M.pad(M.L.sans, item, nx, y + navH / 2 + gn * 0.34, gn, gn * 0.03, o.ink, 0.62).svg; nx -= w * 0.042;
      }
      s += `<rect x="${r3(x)}" y="${r3(y + navH)}" width="${r3(w)}" height="1" fill="${o.ink}" opacity="0.14"/>`;

      // beeldvlak rechts
      s += `<defs><linearGradient id="bv${o.sleutel}" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stop-color="${o.accent}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${o.accent}" stop-opacity="0.32"/></linearGradient></defs>`;
      s += `<rect x="${r3(rechts)}" y="${r3(y + navH + h * 0.09)}" width="${r3(beeldW)}" height="${r3(h - navH - h * 0.18)}" rx="${ronde ? ronde * 0.7 : 0}" fill="url(#bv${o.sleutel})"/>`;

      // kop, tekst en knop links
      const tx = x + p, tmax = rechts - tx - w * 0.05;
      const gk = w * 0.062, gt = w * 0.0235;
      const rk = M.breek(kopLetter, o.kop, gk, 0, tmax);
      let cy = y + navH + h * 0.17 + gk * 0.72;
      s += M.regels(kopLetter, rk, gk, 0, 1.18, o.ink, tx, cy, 'links');
      cy += gk * (rk.length - 1) * 1.18 + h * 0.085;
      const rt = M.breek(M.L.sans, o.tekst, gt, 0, tmax);
      s += M.regels(M.L.sans, rt, gt, 0, 1.6, o.ink, tx, cy + gt * 0.72, 'links');
      cy += gt * 0.72 + gt * (rt.length - 1) * 1.6 + h * 0.095;

      const gb = w * 0.0215, bl = o.knop, bw2 = M.breedte(M.L.sansMed, bl, gb, gb * 0.08) + w * 0.062, bh = h * 0.115;
      if (o.lijnknop) {
        s += `<rect x="${r3(tx)}" y="${r3(cy)}" width="${r3(bw2)}" height="${r3(bh)}" rx="${ronde ? bh / 2 : 0}" fill="none" stroke="${o.accent}" stroke-width="1.6"/>`;
        s += M.pad(M.L.sansMed, bl, tx + w * 0.031, cy + bh / 2 + gb * 0.34, gb, gb * 0.08, o.accent).svg;
      } else {
        s += `<rect x="${r3(tx)}" y="${r3(cy)}" width="${r3(bw2)}" height="${r3(bh)}" rx="${ronde ? bh / 2 : 0}" fill="${o.accent}"/>`;
        s += M.pad(M.L.sansMed, bl, tx + w * 0.031, cy + bh / 2 + gb * 0.34, gb, gb * 0.08, o.knopInk || '#FFFFFF').svg;
      }
      s += `</g><rect x="${r3(x - 0.5)}" y="${r3(y - 0.5)}" width="${r3(w + 1)}" height="${r3(h + 1)}" rx="${ronde}" fill="none" stroke="${C.k.goud}" stroke-width="1.6" opacity="0.85"/>`;
      return s;
    },
  };
}

// ---- groot beeldmerk (voor bericht 10) -------------------------------------
function embleem(hoogte = 300) {
  return {
    t: 'svg', hoogte, teken: (C, y) => {
      const M = require('./maak.cjs'), sch = (hoogte * C.s) / 110;
      return M.poort(C.k.goudLicht, C.W / 2 - 50 * sch, y, sch);
    },
  };
}

module.exports = { sfeer, embleem };
