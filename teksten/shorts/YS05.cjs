// YS05 — Why do Post-it Notes only half stick?
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks C · Happy Accidents.
// Bronnen (gelezen 2 nov 2026): Lemelson-MIT, "Art Fry & Spencer Silver"; National Inventors Hall of Fame, "Spencer
// Silver". Elke bewering staat in een van die twee; zie pakketten/<map>/bron/bronnen.md. Bewust níet gezegd: dat het
// een "mislukking" of "per ongeluk" was (geen van beide bronnen zegt dat), en jaartallen die de bronnen niet geven.
const LEM = 'Lemelson-MIT, "Art Fry & Spencer Silver"';
const NIHF = 'National Inventors Hall of Fame, "Spencer Silver"';
const NX = 540, NY = 1000, NB = 420;   // vaste plek van het briefje: begin en einde vallen samen (loop)

// een geel briefje met een gekrulde hoek; til = hoe ver de bovenrand loskomt (0..1)
function briefje(h, { x = NX, y = NY, b = NB, draai = -3, til = 0, tekst = '', op = 1, schaal = 1 } = {}) {
  const l = x - b / 2, t = y - b / 2, krul = 70 + 120 * til;
  return `<g opacity="${op.toFixed(3)}" transform="translate(${x} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})" filter="url(#sch)">`
    + `<path d="M${l} ${t} L${l + b} ${t} L${l + b} ${t + b - krul} L${l + b - krul} ${t + b} L${l} ${t + b} Z" fill="#F7D84A"/>`
    + `<path d="M${l + b} ${t + b - krul} L${l + b - krul * 0.9} ${t + b - krul * 0.9} L${l + b - krul} ${t + b} Z" fill="#E2BE2C"/>`
    + `<rect x="${l}" y="${t}" width="${b}" height="${b * 0.16}" fill="#EBC93A" opacity="0.55"/>`
    + (tekst ? `<text x="${x}" y="${y + 20}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${b * 0.14}" fill="${h.K.inkt}">${h.esc(tekst)}</text>` : '') + '</g>';
}

module.exports = {
  code: 'YS05',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-13-YS05-postit',
  nummer: 'No. 05',
  onderwerp: 'THE STICKY NOTE',
  scenes: [
    // 1 · HAAK: het briefje klapt op het scherm en de hoek wipt los
    { duur: 2.9, stem: "This glue almost stayed on a shelf.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.6], [1.6, 'pop', 0.6]],
      teken: h => {
        const p = h.klem(h.t / 0.3);
        return briefje(h, { schaal: 2.4 - 1.4 * p * p, draai: -3 + (1 - p) * 25, op: h.klem(h.t / 0.08), til: h.klem((h.t - 1.5) / 0.3) * 0.6 })
          + h.kin('This glue almost stayed on a *shelf*.', { y: 300, g: 104, t: h.t, start: 0.4 }).svg;
      } },
    // 2 · 1968, 3M: Spencer Silver vindt een lijm met bijzondere eigenschappen
    { duur: 3.3, stem: "In 1968, Spencer Silver at 3M discovered an adhesive with unusual properties.", in: 'zweep', bron: NIHF, bronStart: 1.5, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1968</text>`
          + h.kin('At *3M*, scientist Spencer Silver discovers an acrylic adhesive with unusual properties.', { y: 800, g: 64, gewicht: 'regular', t: h.t, start: 0.45, max: 860 }).svg;
      } },
    // 3 · gemaakt van piepkleine bolletjes
    { duur: 3.4, stem: "It was made of tiny spheres.", in: 'op', bron: NIHF, bronStart: 1.8, camera: { zoom: [1, 1.04], midden: [540, 1000] },
      geluid: Array.from({ length: 7 }, (_, i) => [0.6 + i * 0.12, 'pop', 0.5, -0.6 + i * 0.2]),
      teken: h => {
        let s = h.kin('It is made of *tiny spheres*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg
          + `<rect x="120" y="1100" width="840" height="50" fill="${h.K.papierDiep}" stroke="${h.K.inkt}" stroke-width="4"/>`;
        for (let i = 0; i < 11; i++) { const p = h.veer((h.t - 0.6 - (i % 7) * 0.12) / 0.3); if (p <= 0) continue;
          const x = 165 + i * 75, r = 30 + (i * 7) % 12; s += `<circle cx="${x}" cy="${(1100 - r * p).toFixed(1)}" r="${(r * p).toFixed(1)}" fill="#F7D84A" stroke="${h.K.inkt}" stroke-width="3"/>`; }
        return s;
      } },
    // 4 · plakt goed, maar laat makkelijk los: het briefje gaat erop, en er weer af
    { duur: 3.6, stem: "High tack, low adhesion. It grabs, but it lets go.", in: 'flits', bron: NIHF, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[0.7, 'klap', 0.6], [1.9, 'whoosh', 0.5], [2.4, 'klap', 0.5]],
      teken: h => {
        const op1 = h.zacht((h.t - 0.4) / 0.3), af = h.zacht((h.t - 1.6) / 0.5), weer = h.zacht((h.t - 2.2) / 0.25);
        const y = NY - 260 * (1 - op1) - 220 * af * (1 - weer);
        return h.kin('High *tack*. Low *adhesion*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg
          + h.kin('It grabs, but it lets go.', { y: 560, g: 66, gewicht: 'regular', t: h.t, start: 0.9 }).svg
          + `<rect x="300" y="760" width="480" height="480" fill="#FFFFFF" stroke="${h.K.grijs}" stroke-width="3" stroke-dasharray="14 10"/>`
          + briefje(h, { y: y + 30, b: 380, til: af * (1 - weer), draai: -3 + 8 * af * (1 - weer) });
      } },
    // 5 · waar Silver het voor wilde gebruiken: een spray, of een prikbord
    { duur: 3.4, stem: "Silver wanted to sell it as a spray, or as a surface for bulletin boards.", in: 'zweep', bron: LEM, bronStart: 1.9, camera: { zoom: [1, 1.05], stoot: [1.3] }, geluid: [[0.9, 'pop', 0.8, -0.5], [1.3, 'pop', 0.8, 0.5]],
      teken: h => {
        const a = h.veer((h.t - 0.9) / 0.35), b = h.veer((h.t - 1.3) / 0.35);
        let s = h.kin('Silver wanted to sell it as a *spray*, or as a surface for *bulletin boards*.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg;
        if (h.t > 0.9) s += `<g filter="url(#sch)" transform="translate(300 1020) scale(${(0.4 + 0.6 * a).toFixed(3)}) translate(-300 -1020)"><rect x="240" y="900" width="120" height="260" rx="20" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/><rect x="265" y="860" width="70" height="44" rx="8" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="5"/></g>`;
        if (h.t > 1.3) s += `<g filter="url(#sch)" transform="translate(760 1030) scale(${(0.4 + 0.6 * b).toFixed(3)}) translate(-760 -1030)"><rect x="600" y="890" width="320" height="260" rx="10" fill="#C79A6B" stroke="${h.K.inkt}" stroke-width="5"/><rect x="640" y="920" width="110" height="90" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="3"/><rect x="780" y="960" width="110" height="140" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="3"/></g>`;
        return s;
      } },
    // 6 · jaren later: Art Fry in het kerkkoor; zijn bladwijzer valt steeds uit zijn liedboek
    { duur: 3.8, stem: "Then Art Fry, who sang in a church choir, kept losing the paper bookmarks in his hymnal.", in: 'masker', nacht: true, bron: LEM, bronStart: 2.2, camera: { zoom: [1, 1.06] }, geluid: [[1.2, 'whoosh', 0.6], [1.75, 'klap', 0.4], [2.5, 'whoosh', 0.5], [3.05, 'klap', 0.35]],
      teken: h => {
        let s = h.kin('Then Art Fry, singing in a church choir, keeps losing the paper *bookmarks* in his hymnal.', { y: 300, g: 70, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + `<g filter="url(#sch)"><path d="M540 860 L300 830 L300 1180 L540 1210 Z" fill="#F3F0E8" stroke="${h.K.inkt}" stroke-width="5"/><path d="M540 860 L780 830 L780 1180 L540 1210 Z" fill="#E6E1D6" stroke="${h.K.inkt}" stroke-width="5"/></g>`;
        for (const st of [1.1, 2.4]) { const u = h.klem((h.t - st) / 0.65); const x = 560 + 140 * u, y = 800 + 480 * u * u, d = 60 * u;
          s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="44" height="170" fill="${h.K.signaal}" transform="rotate(${d.toFixed(1)} ${(x + 22).toFixed(1)} ${(y + 85).toFixed(1)})" opacity="${(1 - h.klem((h.t - st - 0.5) / 0.3)).toFixed(3)}"/>`; }
        return s;
      } },
    // 7 · hij strijkt de lijm op papier: een briefje dat je kunt verplaatsen
    { duur: 3.4, stem: "So he coated paper with it. A note you can stick, peel, and stick again.", in: 'zweep', bron: NIHF, bronStart: 1.9, camera: { zoom: [1, 1.06], stoot: [1.1] }, geluid: [[1.08, 'klap', 0.8], [1.9, 'ding', 0.7]],
      teken: h => {
        const p = h.veer((h.t - 0.8) / 0.32);
        return h.kin('He coats paper with it. A note you can *stick*, peel and stick again.', { y: 300, g: 82, t: h.t, start: 0.05 }).svg
          + (h.t > 0.8 ? briefje(h, { y: 1010, b: 380, schaal: 0.3 + 0.7 * p, draai: -3 + (1 - p) * 30, tekst: 'p. 214' }) : '');
      } },
    // 8 · 1980: landelijk in de VS
    { duur: 3.0, stem: "In 1980, Post-it Notes went on sale across the United States.", in: 'op', bron: LEM, bronStart: 1.4, camera: { zoom: [1, 1.05], stoot: [1.0] }, geluid: [[0.05, 'rol', 0.7], [1.0, 'ding', 0.8]],
      teken: h => {
        const j = Math.round(1968 + 12 * h.zacht(h.t / 0.95));
        return `<text x="540" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="250" fill="${j === 1980 ? h.K.signaal : h.K.inkt}">${j}</text>`
          + h.kin('Post-it Notes go on sale across the *United States*.', { y: 760, g: 80, t: h.t, start: 1.05, midden: true, max: 860 }).svg;
      } },
    // 9 · slot: hetzelfde briefje als het begin; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "A glue that barely held on ended up on paper.", in: 'flits', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => briefje(h)
        + h.kin('A glue that *barely held on* ended up on paper.', { y: 300, g: 92, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Next: why your PIN has four digits.</text>` },
  ],
};
