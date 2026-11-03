// YS13 — Velcro started with a walk with a dog.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks C · Happy Accidents.
// Bron (gelezen 2 nov 2026): National Inventors Hall of Fame, blog "A Walk in the Woods". Elke bewering staat daarin;
// zie pakketten/<map>/bron/bronnen.md. Niet gezegd: het patentjaar, hoe lang het duurde, zijn beroep of nationaliteit.
const NIHF = 'National Inventors Hall of Fame, "A Walk in the Woods"';

// een klit: bol met stekels die in haakjes eindigen
const klit = (h, x, y, r, { schaal = 1, op = 1, draai = 0 } = {}) => {
  if (schaal < 0.02 || op < 0.01) return '';   // filter op een element van schaal 0 laat resvg crashen
  let s = '';
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2, c = Math.cos(a), si = Math.sin(a);
    const x1 = r * 0.7 * c, y1 = r * 0.7 * si, x2 = r * 1.25 * c, y2 = r * 1.25 * si;
    s += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} q ${(-si * r * 0.18).toFixed(1)} ${(c * r * 0.18).toFixed(1)} ${(-c * r * 0.12).toFixed(1)} ${(-si * r * 0.12).toFixed(1)}" fill="none" stroke="#6B5A2E" stroke-width="${Math.max(2, r * 0.07).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return `<g opacity="${op.toFixed(3)}" filter="url(#schKlein)" transform="translate(${x} ${y}) rotate(${draai.toFixed(1)}) scale(${schaal.toFixed(3)})">${s}<circle r="${r * 0.75}" fill="#8A7A3C" stroke="#5A4A1E" stroke-width="${Math.max(2, r * 0.06).toFixed(1)}"/></g>`;
};
// een hond van opzij (eenvoudig); stap = 0..1 voor de poten
const hond = (h, x, y, s = 1, stap = 0) => {
  const z = Math.sin(stap * Math.PI * 2) * 14;
  return `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s})">`
    + `<path d="M -150 -40 C -200 -90 -230 -100 -250 -120" fill="none" stroke="#A4532A" stroke-width="18" stroke-linecap="round"/>`
    + `<line x1="-110" y1="10" x2="${-120 + z}" y2="120" stroke="#8A4321" stroke-width="22" stroke-linecap="round"/><line x1="-70" y1="10" x2="${-60 - z}" y2="120" stroke="#A4532A" stroke-width="22" stroke-linecap="round"/>`
    + `<line x1="90" y1="10" x2="${100 - z}" y2="120" stroke="#8A4321" stroke-width="22" stroke-linecap="round"/><line x1="120" y1="10" x2="${130 + z}" y2="120" stroke="#A4532A" stroke-width="22" stroke-linecap="round"/>`
    + `<ellipse cx="0" cy="-20" rx="170" ry="65" fill="#B5602F"/>`
    + `<path d="M 130 -50 L 180 -130 L 230 -120 L 270 -80 L 260 -60 L 200 -60 Z" fill="#B5602F"/>`
    + `<path d="M 185 -125 C 160 -100 165 -60 180 -40 C 195 -60 200 -100 195 -125 Z" fill="#8A4321"/>`
    + `<circle cx="225" cy="-105" r="7" fill="${h.K.inkt}"/><circle cx="268" cy="-80" r="9" fill="${h.K.inkt}"/></g>`;
};
// haakje (J-vorm) op positie, hoogte hh
const haak = (x, y, hh, kleur) => `<path d="M ${x} ${y} L ${x} ${y - hh} q 0 -${hh * 0.3} ${hh * 0.25} -${hh * 0.3} q ${hh * 0.25} 0 ${hh * 0.25} ${hh * 0.25}" fill="none" stroke="${kleur}" stroke-width="8" stroke-linecap="round"/>`;
const lus = (x, y, w, kleur) => `<path d="M ${x - w / 2} ${y} C ${x - w / 2} ${y + w * 1.1} ${x + w / 2} ${y + w * 1.1} ${x + w / 2} ${y}" fill="none" stroke="${kleur}" stroke-width="7" stroke-linecap="round"/>`;
// cirkel als microscoopbeeld
const lens = (inhoud, cx, cy, r, p = 1) => p < 0.02 ? '' : `<g transform="translate(${cx} ${cy}) scale(${p.toFixed(3)}) translate(${-cx} ${-cy})"><defs><clipPath id="lens${cx}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="#F7F3E6"/><g clip-path="url(#lens${cx})">${inhoud}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#16161A" stroke-width="14" filter="url(#sch)"/></g>`;

module.exports = {
  code: 'YS13',
  versie: 2,
  map: '2026-11-21-YS13-klittenband',
  nummer: 'No. 13',
  onderwerp: 'VELCRO',
  scenes: [
    // 1 · HAAK: een klit vliegt in beeld en blijft hangen
    { duur: 3.2, camera: { zoom: [1, 1.04], stoot: [0.6], schud: [0.6] }, geluid: [[0.05, 'whoosh', 0.5], [0.58, 'klap'], [0.58, 'boem', 0.6]],
      teken: h => {
        const p = h.uit(h.t / 0.6);
        return hond(h, 520, 1080, 1.4, 0) + klit(h, 1100 - 560 * p, 700 + 300 * p, 46, { draai: h.t * 300 * (1 - p) })
          + h.kin('Velcro started with a *walk with a dog*.', { y: 300, g: 100, t: h.t, start: 0.2 }).svg;
      } },
    // 2 · 1941: wandeling in het bos met zijn Ierse pointer
    { duur: 3.8, in: 'zweep', bron: NIHF, bronStart: 2.4, camera: { zoom: [1, 1.04], pan: [[30, 0], [-30, 0]] }, geluid: [[1.2, 'tik', 0.4], [1.6, 'tik', 0.4], [2.0, 'tik', 0.4]],
      teken: h => {
        let s = '';
        for (let i = 0; i < 5; i++) { const x = 80 + i * 240 - (h.t * 60) % 240; s += `<g><rect x="${x - 14}" y="900" width="28" height="300" fill="#6B4E32"/><circle cx="${x}" cy="880" r="90" fill="${h.K.groen}"/></g>`; }
        return s + hond(h, 560, 1140, 0.9, h.t * 1.6)
          + h.kin('*1941*. George de Mestral walks in the woods with his dog, an Irish Pointer.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg;
      } },
    // 3 · klitten van de grote klis blijven aan broek en vacht hangen
    { duur: 3.6, in: 'op', bron: NIHF, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.7, -0.4], [1.25, 'pop', 0.7, 0.2], [1.5, 'pop', 0.7, 0.5], [1.75, 'pop', 0.7, -0.1]],
      teken: h => hond(h, 540, 1100, 1.2, 0)
        + [[420, 1060], [560, 1010], [660, 1090], [320, 1120]].map(([x, y], i) => klit(h, x, y, 26, { schaal: h.veer((h.t - 1.0 - i * 0.25) / 0.3) })).join('')
        + h.kin('Burrs from burdock plants cling to his pants and his dog\'s fur.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg },
    // 4 · thuis onder de microscoop
    { duur: 3.4, in: 'zoom', bron: NIHF, bronStart: 2.0, camera: { zoom: [1, 1.08] }, geluid: [[1.0, 'rol', 0.5], [1.6, 'ding', 0.5]],
      teken: h => h.kin('At home, he looks at one under a *microscope*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
        + `<g filter="url(#sch)"><rect x="380" y="1220" width="320" height="50" rx="10" fill="${h.K.inkt}"/><rect x="600" y="820" width="40" height="420" fill="${h.K.inkt}"/><rect x="470" y="760" width="70" height="300" rx="12" fill="#3B3F4A" transform="rotate(-20 505 900)"/><rect x="430" y="1120" width="220" height="24" fill="#3B3F4A"/></g>`
        + klit(h, 520, 1100, 16, { op: h.klem((h.t - 0.8) / 0.3) }) },
    // 5 · duizenden haakjes
    { duur: 3.4, in: 'flits', bron: NIHF, bronStart: 2.0, camera: { zoom: [1, 1.05], stoot: [0.9] }, geluid: [[0.88, 'klap', 0.7], [0.9, 'boem', 0.4]],
      teken: h => {
        let haken = '';
        for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) haken += haak(330 + i * 55 + (j % 2) * 27, 940 + j * 90, 60, '#6B5A2E');
        return h.kin('It is covered in *thousands of tiny hooks*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
          + lens(haken, 540, 1010, 250, h.veer((h.t - 0.7) / 0.35));
      } },
    // 6 · de haakjes grijpen in de lusjes van zijn kleding
    { duur: 3.8, in: 'op', bron: NIHF, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [1.9] }, geluid: [[1.1, 'rol', 0.5], [1.9, 'klap', 0.7]],
      teken: h => {
        const d = 120 * (1 - h.zacht((h.t - 0.9) / 1.0));
        let s = '';
        for (let i = 0; i < 7; i++) s += lus(320 + i * 75, 960 - d, 50, '#2A5DB0');
        s = `<g>${s}<line x1="260" y1="${960 - d}" x2="820" y2="${960 - d}" stroke="#2A5DB0" stroke-width="10"/></g>`;
        let k = '';
        for (let i = 0; i < 7; i++) k += haak(330 + i * 75, 1150, 140, '#6B5A2E');
        return h.kin('They grip the *loops* in the threads of his clothes.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
          + lens(s + k + `<line x1="260" y1="1150" x2="820" y2="1150" stroke="#6B5A2E" stroke-width="10"/>`, 540, 1010, 255, 1);
      } },
    // 7 · haakjes van nylon, samen met een stoffenmaker in Lyon
    { duur: 3.6, in: 'zweep', bron: NIHF, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[1.2, 'pop', 0.7], [1.8, 'ding', 0.5]],
      teken: h => {
        const w = 760 * h.uit((h.t - 0.9) / 0.8);
        let s = `<g filter="url(#sch)"><rect x="160" y="960" width="${w.toFixed(1)}" height="130" rx="10" fill="${h.K.signaal}"/></g>`;
        for (let x = 180; x < 160 + w - 10; x += 24) s += `<path d="M ${x} 1000 q 6 -18 12 0" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.8"/><path d="M ${x + 12} 1050 q 6 -18 12 0" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.8"/>`;
        return h.kin('He makes the hooks from *nylon*, with a fabric maker in Lyon, France.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg + s;
      } },
    // 8 · de naam: velours + crochet
    { duur: 3.8, in: 'masker', nacht: true, bron: NIHF, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[0.9, 'pop', 0.7, -0.4], [1.5, 'pop', 0.7, 0.4], [2.3, 'klap', 0.6], [2.3, 'ding', 0.5]],
      teken: h => {
        const p1 = h.veer((h.t - 0.8) / 0.35), p2 = h.veer((h.t - 1.4) / 0.35), m = h.zacht((h.t - 2.2) / 0.4);
        const rij = (y, voor, achter, uitleg, p) => p <= 0 ? '' : `<g opacity="${(p * (1 - 0.5 * m)).toFixed(3)}"><text x="160" y="${y}" font-family="Instrument Sans" font-weight="700" font-size="110" fill="${h.K.geel}">${voor}<tspan fill="#F3F0E8">${achter}</tspan></text><text x="164" y="${y + 56}" font-family="IBM Plex Mono" font-size="38" fill="#C9C6BC">${uitleg}</text></g>`;
        return h.kin('The name comes from two French words:', { y: 330, g: 86, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + rij(800, 'VEL', 'OUR', 'velvet', p1) + rij(990, 'CRO', 'CHET', 'hooks', p2)
          + (m > 0 ? `<text x="540" y="1250" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(130 * (0.6 + 0.4 * h.veer(m))).toFixed(0)}" fill="${h.K.geel}" opacity="${m.toFixed(3)}">VELCRO</text>` : '');
      } },
    // 9 · slot: klit en band; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => hond(h, 520, 1080, 1.4, 0) + klit(h, 540, 1000, 46)
        + h.kin('Hooks and loops, copied from a *burr*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
