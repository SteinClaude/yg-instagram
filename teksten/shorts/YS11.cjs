// YS11 — The $ sign is probably not an S. It's two letters.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bron (gelezen 2 nov 2026): U.S. Bureau of Engraving and Printing, Currency FAQs, "What is the origin of the $ sign?".
// Elke bewering staat daarin; zie pakketten/<map>/bron/bronnen.md. Het blijft een verklaring: de video zegt "probably"
// en "most accepted", zoals de bron.
const BEP = 'U.S. Bureau of Engraving and Printing, Currency FAQs';

// groot dollarteken
const dollar = (h, { x = 540, y = 1030, g = 520, schaal = 1, op = 1, draai = 0, kleur } = {}) =>
  `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})"><text x="${x}" y="${y + g * 0.36}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="${kleur || h.K.signaal}">$</text></g>`;
// P (steel + boog los, zodat de boog kan verdwijnen) en S; m = 0..1 schuift de S over de P, b = 0..1 laat de boog verdwijnen
const ps = (h, { m = 0, b = 0, op = 1, y0 = 800 } = {}) => {
  const px = 360, sx = 700 - (700 - 452) * m;
  const boog = `<path d="M ${px + 34} ${y0} h 110 a 95 95 0 0 1 0 190 h -110" fill="none" stroke="${h.K.inkt}" stroke-width="64" opacity="${(1 - b).toFixed(3)}"/>`;
  const steel = `<rect x="${px + 2 + (420 - px) * b}" y="${y0 - 32 - 30 * b}" width="64" height="${440 + 60 * b}" fill="${b > 0.5 ? h.K.signaal : h.K.inkt}"/>`;
  const s = `<text x="${sx}" y="${y0 + 330}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="460" fill="${m > 0.98 ? h.K.signaal : h.K.inkt}">S</text>`;
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)">${steel}${boog}${s}</g>`;
};
// munt
const munt = (h, x, y, r, p) => p <= 0 ? '' : `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${(0.4 + 0.6 * p).toFixed(3)} ${(0.4 + 0.6 * p).toFixed(3)}) translate(${-x} ${-y})"><circle cx="${x}" cy="${y}" r="${r}" fill="#C9B26A" stroke="#8C7430" stroke-width="10"/><circle cx="${x}" cy="${y}" r="${r * 0.8}" fill="none" stroke="#8C7430" stroke-width="4" stroke-dasharray="6 8"/><text x="${x}" y="${y + r * 0.14}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r * 0.36}" fill="#5A4A1E">PESO</text></g>`;

module.exports = {
  code: 'YS11',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-19-YS11-dollarteken',
  nummer: 'No. 11',
  onderwerp: 'THE DOLLAR SIGN',
  scenes: [
    // 1 · HAAK: $ slaat neer
    { duur: 3.0, stem: "The dollar sign is probably not an S. It's two letters.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => {
        const p = h.klem(h.t / 0.3);
        return dollar(h, { schaal: 2.2 - 1.2 * p * p, draai: (1 - p) * -18, op: h.klem(h.t / 0.08) })
          + h.kin('The $ is probably not an S. It\'s *two letters*.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg;
      } },
    // 2 · eerst was er de Spaanse peso
    { duur: 3.4, stem: "Long before the U-S dollar, there was the Spanish or Mexican peso.", in: 'zweep', bron: BEP, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[0.9, 'ding', 0.6], [1.2, 'ding', 0.4, 0.5]],
      teken: h => h.kin('Long before the US dollar, there was the Spanish or Mexican *peso*.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + munt(h, 400, 1020, 180, h.veer((h.t - 0.8) / 0.35)) + munt(h, 700, 1080, 150, h.veer((h.t - 1.1) / 0.35)) },
    // 3 · afgekort tot "Ps"
    { duur: 3.2, stem: "Pesos were abbreviated P-S.", in: 'op', bron: BEP, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.88, 'klap', 0.8], [0.88, 'boem', 0.5]],
      teken: h => h.kin('Pesos were abbreviated *"Ps"*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
        + ps(h, { op: h.klem((h.t - 0.7) / 0.2) }) },
    // 4 · de S schuift over de P
    { duur: 3.8, stem: "Old manuscripts show the S gradually written over the P.", in: 'flits', bron: BEP, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.7], [1.9, 'pop', 0.8]],
      teken: h => h.kin('Old manuscripts show the S gradually written *over* the P.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + ps(h, { m: h.zacht((h.t - 0.9) / 1.0) }) },
    // 5 · de boog verdwijnt: bijna een $
    { duur: 3.6, stem: "Until it became something very close to the dollar sign.", in: 'zweep', bron: BEP, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.9] }, geluid: [[0.9, 'stijg', 0.5], [1.9, 'klap', 0.7], [1.9, 'ding', 0.5]],
      teken: h => h.kin('Until it became something very close to *$*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
        + ps(h, { m: 1, b: h.zacht((h.t - 0.9) / 1.0) }) },
    // 6 · op verschillende plaatsen, los van elkaar
    { duur: 3.6, stem: "Probably in different places, independently of each other.", in: 'op', bron: BEP, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[1.0, 'pop', 0.7, -0.5], [1.3, 'pop', 0.7, 0.3], [1.6, 'pop', 0.7, 0.6], [1.9, 'pop', 0.7, -0.2]],
      teken: h => h.kin('Probably in *different places*, independently of each other.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + [[300, 880], [720, 960], [460, 1150], [820, 1210]].map(([x, y], i) => {
          const p = h.veer((h.t - 1.0 - i * 0.3) / 0.3); return p <= 0 ? '' : dollar(h, { x, y, g: 200, schaal: p, kleur: i % 2 ? h.K.inkt : h.K.signaal });
        }).join('') },
    // 7 · al in gebruik vóór 1785
    { duur: 3.6, stem: "The sign was already widely used before the U-S adopted the dollar, in 1785.", in: 'zweep', bron: BEP, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1785</text>`
          + h.kin('The sign was already widely used *before* the US adopted the dollar in 1785.', { y: 830, g: 76, t: h.t, start: 0.45 }).svg;
      } },
    // 8 · andere verklaringen bestaan; dit is de meest aanvaarde
    { duur: 3.4, stem: "Other explanations exist. This is the most accepted one.", in: 'masker', nacht: true, bron: BEP, bronStart: 2.0, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('Other explanations exist.', { y: 330, g: 88, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + h.kin('This is the *most accepted* one.', { y: 660, g: 88, t: h.t, start: 1.0, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + dollar(h, { y: 1080, g: 380, schaal: h.veer((h.t - 1.6) / 0.35), op: h.klem((h.t - 1.6) / 0.2), kleur: h.K.geel }) },
    // 9 · slot: weer het grote $; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "A P and an S. Most likely.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => dollar(h)
        + h.kin('A P and an S. Most likely.', { y: 300, g: 104, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
