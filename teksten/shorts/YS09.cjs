// YS09 — Why A4 keeps its shape when you fold it.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks B · Who Decided?
// Bron (gelezen 2 nov 2026): Markus Kuhn, "International standard paper sizes" (University of Cambridge). Elke bewering
// staat daarin; zie pakketten/<map>/bron/bronnen.md. Niet gezegd: waarom Noord-Amerika het niet gebruikt.
const KUHN = 'Markus Kuhn, "International standard paper sizes", Univ. of Cambridge';
const R2 = Math.SQRT2;

// een vel papier (portret), midden op cx, cy; breedte w
const vel = (h, cx, cy, w, { draai = 0, op = 1, vul = '#FFFFFF', label = '', lijn = 5, liggend = false } = {}) => {
  const bw = liggend ? w * R2 : w, bh = liggend ? w : w * R2;
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${cx} ${cy}) rotate(${draai.toFixed(2)}) translate(${-cx} ${-cy})">`
    + `<rect x="${(cx - bw / 2).toFixed(1)}" y="${(cy - bh / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${vul}" stroke="${h.K.inkt}" stroke-width="${lijn}"/>`
    + '</g>' + (label ? `<text x="${cx}" y="${cy + w * 0.09}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(w * 0.26).toFixed(0)}" fill="${h.K.signaal}" opacity="${op.toFixed(3)}">${label}</text>` : '');
};
// A0 steeds halveren: n = hoeveel sneden (mag een breuk zijn voor de laatste), markeer = welk stuk rood
const halveer = (h, x, y, w, n, { markeer = -1 } = {}) => {
  let s = `<g filter="url(#sch)"><rect x="${x}" y="${y}" width="${w}" height="${(w * R2).toFixed(1)}" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="6"/></g>`;
  let rx = x, ry = y, rw = w, rh = w * R2;
  for (let i = 1; i <= Math.ceil(n); i++) {
    const p = h.klem(n - i + 1);
    if (rh > rw) { // horizontaal snijden: boven = A(i), onder gaat verder
      const my = ry + rh / 2;
      if (i === markeer) s += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh / 2}" fill="${h.K.signaal}" opacity="${(0.9 * p).toFixed(3)}"/>`;
      s += `<line x1="${rx}" y1="${my}" x2="${(rx + rw * p).toFixed(1)}" y2="${my}" stroke="${h.K.inkt}" stroke-width="5"/>`;
      s += `<text x="${rx + rw / 2}" y="${ry + rh / 4 + rw * 0.06}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${Math.max(22, rw * 0.16).toFixed(0)}" fill="${i === markeer ? '#FFFFFF' : h.K.inkt}" opacity="${p.toFixed(3)}">A${i}</text>`;
      ry = my; rh = rh / 2;
    } else { // verticaal snijden: links = A(i), rechts gaat verder
      const mx = rx + rw / 2;
      if (i === markeer) s += `<rect x="${rx}" y="${ry}" width="${rw / 2}" height="${rh}" fill="${h.K.signaal}" opacity="${(0.9 * p).toFixed(3)}"/>`;
      s += `<line x1="${mx}" y1="${ry}" x2="${mx}" y2="${(ry + rh * p).toFixed(1)}" stroke="${h.K.inkt}" stroke-width="5"/>`;
      s += `<text x="${rx + rw / 4}" y="${ry + rh / 2 + rh * 0.06}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${Math.max(22, rh * 0.16).toFixed(0)}" fill="${i === markeer ? '#FFFFFF' : h.K.inkt}" opacity="${p.toFixed(3)}">A${i}</text>`;
      rx = mx; rw = rw / 2;
    }
  }
  return s;
};
// grote jaartallen-scène
const jaar = (h, j, tekst, extra = '') => {
  const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${j}</text>`
    + h.kin(tekst, { y: 830, g: 76, t: h.t, start: 0.45 }).svg + extra;
};

module.exports = {
  code: 'YS09',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-17-YS09-a4',
  nummer: 'No. 09',
  onderwerp: 'PAPER SIZE A4',
  scenes: [
    // 1 · HAAK: een vel slaat neer, splitst in twee, en elke helft heeft weer dezelfde vorm
    { duur: 3.4, stem: "Fold a sheet of A4 in half. It's still the same shape.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.2, 'rol', 0.6], [2.0, 'ding', 0.6]],
      teken: h => {
        const p = h.klem(h.t / 0.3), sp = h.zacht((h.t - 1.2) / 0.8);
        let s = h.kin('Fold A4 in half. It\'s *still the same shape*.', { y: 300, g: 104, t: h.t, start: 0.4 }).svg;
        if (sp <= 0) return s + vel(h, 540, 1020, 360, { op: h.klem(h.t / 0.08), draai: (1 - p) * -14, label: 'A4' }) + (h.t > 0.8 ? `<line x1="340" y1="1020" x2="${340 + 400 * h.klem((h.t - 0.8) / 0.35)}" y2="1020" stroke="${h.K.signaal}" stroke-width="6" stroke-dasharray="20 12"/>` : '');
        // twee helften (liggend, breedte 360/√2 als korte zijde) draaien naar portret en schuiven uit elkaar
        const kort = 360 / R2;
        return s + vel(h, 540 - 200 * sp, 1020 - 127 * (1 - sp), kort, { liggend: true, draai: -90 * sp, label: 'A5' })
          + vel(h, 540 + 200 * sp, 1020 + 127 * (1 - sp), kort, { liggend: true, draai: 90 * sp, label: 'A5' });
      } },
    // 2 · de verhouding: hoogte gedeeld door breedte = wortel 2
    { duur: 3.6, stem: "On every ISO page, height divided by width is the square root of two. About one point four one four.", in: 'zweep', bron: KUHN, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.7], [1.5, 'pop', 0.7], [2.2, 'klap', 0.6]],
      teken: h => {
        let s = h.kin('On every ISO page, height ÷ width is the *square root of 2*: about 1.414.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg + vel(h, 470, 995, 280);
        if (h.t > 1.0) s += `<text x="470" y="${995 - 198 - 22}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.inkt}" opacity="${h.klem((h.t - 1.0) / 0.2)}">210 mm</text>`;
        if (h.t > 1.5) s += `<text x="${470 + 140 + 24}" y="1009" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.inkt}" opacity="${h.klem((h.t - 1.5) / 0.2)}">297 mm</text>`;
        if (h.t > 2.2) s += `<text x="540" y="1268" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="${h.K.signaal}" opacity="${h.klem((h.t - 2.2) / 0.2)}">297 ÷ 210 = 1.414</text>`;
        return s;
      } },
    // 3 · halveren geeft telkens dezelfde vorm
    { duur: 3.8, stem: "Cut it in half, and you get the same ratio again. And again.", in: 'op', bron: KUHN, bronStart: 2.4, camera: { zoom: [1, 1.06] }, geluid: [[0.9, 'tik', 0.8], [1.4, 'tik', 0.8], [1.9, 'tik', 0.8], [2.4, 'tik', 0.8], [2.9, 'ding', 0.5]],
      teken: h => h.kin('Cut it in half: *the same ratio* again. And again.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
        + halveer(h, 330, 680, 420, h.klem((h.t - 0.8) / 0.5, 0, 4)) },
    // 4 · A0 is precies één vierkante meter
    { duur: 3.2, stem: "It all starts with A-zero: exactly one square metre.", in: 'flits', bron: KUHN, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.88, 'klap', 0.8], [0.88, 'boem', 0.5]],
      teken: h => {
        const q = h.veer((h.t - 0.7) / 0.35);
        return h.kin('It starts with *A0*: exactly *one square metre*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
          + (q > 0 ? `<g transform="translate(540 1000) scale(${q.toFixed(3)}) translate(-540 -1000)">${vel(h, 540, 1000, 420, { label: 'A0' })}<text x="540" y="1170" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="72" fill="${h.K.inkt}">1 m²</text></g>` : '');
      } },
    // 5 · vier keer halveren = A4
    { duur: 3.6, stem: "Halve it four times, and you get A4. Two hundred ten by two hundred ninety-seven millimetres.", in: 'zweep', bron: KUHN, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [2.4] }, geluid: [[2.4, 'klap', 0.7], [2.4, 'ding', 0.5]],
      teken: h => h.kin('Halve it four times and you get *A4*: 210 × 297 mm.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + halveer(h, 330, 680, 420, 4, { markeer: h.t > 2.3 ? 4 : -1 }) },
    // 6 · 1786: Lichtenberg
    { duur: 3.3, stem: "1786. In a letter, scientist Georg Christoph Lichtenberg describes this ratio for paper.", in: 'op', bron: KUHN, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => jaar(h, '1786', 'In a letter, scientist Georg Christoph *Lichtenberg* describes this ratio for paper.') },
    // 7 · 1798: Franse belastingwet
    { duur: 3.2, stem: "1798. A French law on paper taxes already uses these exact sizes.", in: 'zweep', bron: KUHN, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => jaar(h, '1798', 'A *French* law on paper taxes already uses these exact sizes.') },
    // 8 · 1922: DIN 476
    { duur: 3.4, stem: "1922. Germany makes it a standard, D-I-N four seventy-six, reinvented by Doctor Walter Porstmann.", in: 'op', bron: KUHN, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.8, 'pop', 0.7]],
      teken: h => jaar(h, '1922', 'Germany makes it a standard: *DIN 476*, reinvented by Dr. Walter Porstmann.') },
    // 9 · 1975: ISO 216 en de VN
    { duur: 3.4, stem: "1975. It becomes world standard ISO two sixteen, and the official U-N document format.", in: 'masker', nacht: true, bron: KUHN, bronStart: 2.0, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('*1975*: it becomes world standard *ISO 216*, and the official UN document format.', { y: 330, g: 90, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + [0, 1, 2].map(i => { const p = h.veer((h.t - 1.3 - i * 0.15) / 0.35); return p <= 0 ? '' : vel(h, 340 + i * 200, 1060, 150 * p, { draai: -6 + i * 6, vul: '#F3F0E8' }); }).join('') },
    // 10 · slot: bijna overal, behalve Noord-Amerika; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "Used almost everywhere on the planet. Except North America.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => vel(h, 540, 1020, 360, { label: 'A4' })
        + h.kin('Used almost everywhere. Except *North America*.', { y: 300, g: 96, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
