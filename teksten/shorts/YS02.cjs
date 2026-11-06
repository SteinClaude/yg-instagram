// YS02 v2 — Why isn't your keyboard in alphabetical order?
// Versie 2 (stijl van YS01 v2, goedgekeurd door Andries 2 nov: "Stijl goed, ga door"): haak in seconde 1, letters die
// echt van plek wisselen (ABC <-> QWERTY), elke 2–3 s iets nieuws, eigen geluid, einde terug naar het beginbeeld.
// Bron: Smithsonian Magazine, "Fact of Fiction? The Legend of the QWERTY Keyboard" (2013), gelezen 2 nov 2026.
// Elke bewering staat in die bron; zie pakketten/<map>/bron/bronnen.md. v1 staat in de git-geschiedenis (d6fa5fd).
const BRON = 'Smithsonian Magazine, "Fact of Fiction? The Legend of the QWERTY Keyboard"';
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const ABC = ['ABCDEFGHIJ', 'KLMNOPQRS', 'TUVWXYZ'];
const T = 84, G = 8, X0 = (1080 - (10 * T + 9 * G)) / 2, Y0 = 930, IN = [0, 0.5, 1.5];

// plek van elke letter in een indeling
const plekken = (rijen, y0 = Y0) => { const m = {}; rijen.forEach((r, ri) => [...r].forEach((ch, ci) => { m[ch] = [X0 + IN[ri] * T / 2 + ci * (T + G), y0 + ri * (T + G)]; })); return m; };
const PQ = plekken(QWERTY), PA = plekken(ABC);
// één toets met schaduw; p = binnenkomen (0..1, met veer), acc = signaalkleur
function toets(ch, x, y, { p = 1, acc = false, geel = false, K }) {
  if (p <= 0) return '';
  const s = 0.4 + 0.6 * p, cx = x + T / 2, cy = y + T / 2, vul = acc ? K.signaal : geel ? K.geel : '#FFFFFF';
  return `<g opacity="${Math.min(1, p * 2).toFixed(3)}" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${s.toFixed(3)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})">`
    + `<rect x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" width="${T}" height="${T}" rx="14" fill="${K.inkt}"/>`
    + `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${T}" height="${T}" rx="14" fill="${vul}" stroke="${K.inkt}" stroke-width="3.5"/>`
    + `<text x="${cx.toFixed(1)}" y="${(y + T * 0.67).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${T * 0.5}" fill="${acc ? '#FFFFFF' : K.inkt}">${ch}</text></g>`;
}
// hele toetsenbord: van indeling a naar b met voortgang q (per letter iets verschoven, met veer)
function bord(h, { van = PQ, naar = PQ, q = 1, acc = '', geel = '', binnen = 1, dy = 0 } = {}) {
  let s = `<g filter="url(#schKlein)">`, i = 0;
  for (const ch of 'QWERTYUIOPASDFGHJKLZXCVBNM') {
    const u = h.veer(h.klem((q * 1.6 - (i % 13) * 0.045))), [ax, ay] = van[ch], [bx, by] = naar[ch];
    const x = ax + (bx - ax) * u, y = ay + (by - ay) * u - Math.sin(Math.PI * h.klem(u)) * 60 + dy;
    s += toets(ch, x, y, { p: h.klem(binnen * 1.4 - i * 0.02), acc: acc.includes(ch), geel: geel.includes(ch), K: h.K }); i++;
  }
  return s + '</g>';
}

module.exports = {
  code: 'YS02',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-10-YS02-qwerty',
  nummer: 'No. 02',
  onderwerp: 'THE KEYBOARD',
  scenes: [
    // 1 · HAAK: de toetsen regenen binnen, QWERTY licht op, en de vraag blijft open
    { duur: 3.1, stem: "Nobody fully agrees why your keyboard looks like this.", camera: { zoom: [1.06, 1.0], stoot: [0.75] }, geluid: [...[0.05, 0.15, 0.25, 0.35, 0.45, 0.55].map((t, i) => [t + 0.2, 'tik', 0.8, i % 2 ? 0.4 : -0.4]), [0.75, 'klap', 0.7], [0.75, 'boem', 0.5]],
      teken: h => {
        const k = Math.max(0, Math.min(6, Math.floor((h.t - 0.25) / 0.1) + 1));
        return bord(h, { binnen: h.t / 0.55, acc: 'QWERTY'.slice(0, k) })
          + h.kin('Nobody fully agrees *why* your keyboard looks like this.', { y: 300, g: 92, t: h.t, start: 0.75 }).svg;
      } },
    // 2 · het was eerst alfabetisch: de letters springen naar ABC
    { duur: 3.4, stem: "The first ones were alphabetical.", in: 'zweep', bron: BRON, bronStart: 1.6, camera: { zoom: [1, 1.05], stoot: [1.3] },
      geluid: [[0.5, 'rol', 0.7], [0.9, 'rol', 0.6], [1.3, 'ding', 0.8]],
      teken: h => bord(h, { van: PQ, naar: PA, q: (h.t - 0.45) / 0.9, geel: h.t > 1.3 ? 'ABC' : '' })
        + h.kin('The first ones were *alphabetical*.', { y: 330, g: 100, t: h.t, start: 0.05 }).svg },
    // 3 · 1868, Milwaukee
    { duur: 3.3, stem: "1868. Christopher Latham Sholes, a Milwaukee printer, and his colleagues patent a typewriter.", in: 'flits', bron: BRON, bronStart: 1.4, camera: { zoom: [1, 1.06], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.7]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1868</text>`
          + h.kin('Christopher Latham Sholes, a *Milwaukee* printer, and his colleagues patent a typewriter.', { y: 800, g: 66, gewicht: 'regular', t: h.t, start: 0.45, max: 860 }).svg;
      } },
    // 4 · daarna schoof hij de toetsen steeds weer rond
    { duur: 3.6, stem: "Then he kept moving the keys around.", in: 'op', bron: BRON, bronStart: 1.8, camera: { zoom: [1.04, 1.0], schud: [1.1, 2.1] },
      geluid: [[1.0, 'pop'], [1.1, 'whoosh', 0.4], [2.0, 'pop', 0.9, 0.4], [2.1, 'whoosh', 0.4, 0.4]],
      teken: h => {
        // twee rondes: ABC -> half door elkaar -> verder door elkaar
        // tussenstand: telkens twee letters van plek geruild (A<->B, C<->D, ...), zodat er geen twee op één plek staan
        const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', mid = {}; [...abc].forEach((ch, i) => { mid[ch] = PA[abc[i % 2 ? i - 1 : Math.min(i + 1, 25)]]; });
        const q1 = (h.t - 0.9) / 0.6, q2 = (h.t - 1.9) / 0.6;
        const b = h.t < 1.9 ? bord(h, { van: PA, naar: mid, q: q1 }) : bord(h, { van: mid, naar: PQ, q: Math.min(0.32, q2) })   // halverwege laten: hij bleef schuiven;
        return b + h.kin('Then he kept *moving the keys* around.', { y: 330, g: 100, t: h.t, start: 0.05 }).svg;
      } },
    // 5 · het bekende verhaal: de armen zouden vastlopen
    { duur: 3.6, stem: "The famous story: common letters were split up, so the metal arms wouldn't jam.", in: 'zweep', bron: BRON, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.55], schud: [1.55] }, geluid: [[1.0, 'whoosh', 0.5], [1.55, 'klap'], [1.55, 'boem', 0.6]],
      teken: h => {
        const a = h.klem((h.t - 1.0) / 0.55), hoek = 62 * (1 - a * a), botst = h.t > 1.55;
        const arm = (zijde) => `<g transform="translate(${540 + zijde * 190} 1180) rotate(${(zijde * -hoek - zijde * 14).toFixed(2)})">`
          + `<line x1="0" y1="0" x2="${-zijde * 0}" y2="-330" stroke="${h.K.inkt}" stroke-width="16" stroke-linecap="round"/>`
          + `<rect x="-26" y="-372" width="52" height="52" rx="6" fill="${botst ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5"/></g>`;
        return `<g filter="url(#sch)">${arm(-1)}${arm(1)}</g>`
          + (botst ? `<text x="540" y="740" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(120 * h.veer((h.t - 1.55) / 0.3)).toFixed(0)}" fill="${h.K.signaal}">JAM!</text>` : '')
          + h.kin('The famous story: common letters were split up so the metal arms wouldn\'t *jam*.', { y: 300, g: 70, t: h.t, start: 0.05 }).svg;
      } },
    // 6 · maar: omstreden, want E en R staan naast elkaar
    { duur: 3.4, stem: "Historians call that contentious. E and R sit right next to each other.", in: 'flits', bron: BRON, bronStart: 1.8, camera: { zoom: [1.0, 1.06], midden: [420, 1000] }, geluid: [[0.2, 'stijg', 0.4], [1.3, 'pop'], [1.5, 'pop', 0.9, 0.3]],
      teken: h => bord(h, { acc: (h.t > 1.3 ? 'E' : '') + (h.t > 1.5 ? 'R' : '') })
        + h.kin('Historians call that *contentious*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
        + h.kin('E and R sit right next to each other.', { y: 540, g: 64, gewicht: 'regular', t: h.t, start: 1.7, max: 860 }).svg },
    // 7 · andere theorie: telegrafisten en morse
    { duur: 3.9, stem: "Another theory, from Kyoto University in 2011: its first big users were telegraph operators, copying Morse code.", in: 'masker', nacht: true, bron: BRON, bronStart: 2.0, camera: { zoom: [1, 1.05] },
      geluid: [0.9, 1.05, 1.35, 1.5, 1.65, 1.95, 2.25, 2.4].map((t, i) => [t, 'tik', 0.7, i % 2 ? 0.3 : -0.3]),
      teken: h => {
        const x0 = 1080 - h.t * 360, code = '−·−·  ·−·  −−·  ·−  −·  ·  −  ·−··';
        return h.kin('Another theory (Kyoto University, 2011): its first big users were', { y: 300, g: 62, gewicht: 'regular', t: h.t, start: 0.05, kleur: '#D8D4CA' }).svg
          + h.kin('*telegraph operators* copying Morse code.', { y: 520, g: 84, t: h.t, start: 1.0, kleur: '#F3F0E8' }).svg
          + `<text x="${x0.toFixed(1)}" y="1080" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="${h.K.geel}" opacity="${h.klem((h.t - 0.6) / 0.4)}">${code}</text>`;
      } },
    // 8 · 1874: Remington verkoopt hem
    { duur: 3.1, stem: "1874. Remington starts selling the machine, for a hundred and twenty-five dollars.", in: 'op', bron: BRON, bronStart: 1.4, camera: { zoom: [1, 1.05], stoot: [1.0] }, geluid: [[0.05, 'rol', 0.7], [1.0, 'ding', 0.8]],
      teken: h => {
        const j = Math.round(1868 + 6 * h.zacht(h.t / 0.95));
        return `<text x="540" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="250" fill="${j === 1874 ? h.K.signaal : h.K.inkt}">${j}</text>`
          + h.kin('Remington starts selling the machine, for *$125*.', { y: 760, g: 80, t: h.t, start: 1.05, midden: true, max: 860 }).svg;
      } },
    // 9 · 1893: de fabrikanten gaan samen, QWERTY wordt de standaard
    { duur: 3.6, stem: "1893. The big typewriter makers merge into one company. QWERTY becomes the standard.", in: 'zweep', bron: BRON, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.35] }, geluid: [[0.6, 'pop', 0.7, -0.6], [0.75, 'pop', 0.7, 0.6], [0.9, 'pop', 0.7], [1.35, 'klap', 0.7], [1.35, 'ding', 0.6]],
      teken: h => {
        const q = h.zacht((h.t - 0.5) / 0.85);
        let s = h.kin('*1893*: the big typewriter makers merge into one company.', { y: 300, g: 78, t: h.t, start: 0.05 }).svg;
        [-2, -1, 0, 1, 2].forEach((k, i) => {
          const x = 540 + k * 170 * (1 - q), r = 62 + 40 * q * (k === 0);
          if (k !== 0 && q >= 1) return;
          s += `<g filter="url(#schKlein)"><rect x="${(x - r).toFixed(1)}" y="${(930 - r).toFixed(1)}" width="${(2 * r).toFixed(1)}" height="${(2 * r).toFixed(1)}" rx="14" fill="${i % 2 ? h.K.geel : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5"/></g>`;
        });
        return s + h.kin('QWERTY becomes the *standard*.', { y: 1120, g: 84, t: h.t, start: 1.45, midden: true, nadruk: 'balk' }).svg;
      } },
    // 10 · slot: hetzelfde toetsenbord als het begin; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.9, stem: "Nobody agrees why the keys went there. Everybody agreed to leave them.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => bord(h, { acc: 'QWERTY' })
        + h.kin('Nobody agrees why the keys went there.', { y: 300, g: 88, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + h.kin('Everybody agreed to *leave them*.', { y: 560, g: 88, t: h.t, start: 1.2, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.8) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Next: why your town shares one clock.</text>` },
  ],
};
