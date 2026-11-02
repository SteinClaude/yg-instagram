// YS07 — Why do we say "OK"?
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bronnen (gelezen 2 nov 2026): Michigan Public, "TWTS: An origin story that's just 'OK'" (Anne Curzan en Rebecca
// Hector, 14 mei 2023, eerst uitgezonden 5 maart 2017); VOA Learning English, "OK" (12 feb 2002). Elke bewering staat in
// een van die twee; zie pakketten/<map>/bron/bronnen.md. Niet gezegd: "het meest gebruikte woord ter wereld" (geen bron).
const MP = 'Michigan Public, "TWTS: An origin story that\'s just \'OK\'"';
const VOA = 'VOA Learning English, "OK" (2002)';
const BEIDE = 'Michigan Public (2023); VOA Learning English (2002)';
const KX = 540, KY = 1000;

// groot "OK" in twee tegels, met schaduw
const ok = (h, { x = KX, y = KY, g = 300, schaal = 1, draai = 0, op = 1, kleur } = {}) =>
  `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})">`
  + `<rect x="${x - 330}" y="${y - 190}" width="300" height="380" rx="30" fill="${kleur || h.K.signaal}"/><rect x="${x + 30}" y="${y - 190}" width="300" height="380" rx="30" fill="${kleur || h.K.signaal}"/>`
  + `<text x="${x - 180}" y="${y + g * 0.36}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="#FFFFFF">O</text><text x="${x + 180}" y="${y + g * 0.36}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="#FFFFFF">K</text></g>`;
// krantenkop in mono, als knipsel
const knipsel = (h, x, y, w, kop, sub, p = 1) => p <= 0 ? '' : `<g opacity="${h.klem(p * 2).toFixed(3)}" filter="url(#schKlein)" transform="translate(${x + w / 2} ${y + 60}) scale(${(0.5 + 0.5 * h.veer(p)).toFixed(3)}) rotate(${(-2 + (x % 5)).toFixed(1)}) translate(${-(x + w / 2)} ${-(y + 60)})">`
  + `<rect x="${x}" y="${y}" width="${w}" height="120" fill="#FFFDF7" stroke="${h.K.inkt}" stroke-width="3"/>`
  + `<text x="${x + 24}" y="${y + 62}" font-family="IBM Plex Mono" font-weight="700" font-size="48" fill="${h.K.signaal}">${h.esc(kop)}</text>`
  + `<text x="${x + 24}" y="${y + 100}" font-family="IBM Plex Mono" font-size="26" fill="${h.K.inkt}">${h.esc(sub)}</text></g>`;

module.exports = {
  code: 'YS07',
  versie: 2,
  map: '2026-11-15-YS07-ok',
  nummer: 'No. 07',
  onderwerp: 'THE WORD "OK"',
  scenes: [
    // 1 · HAAK: OK slaat neer
    { duur: 2.9, camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => {
        const p = h.klem(h.t / 0.3);
        return ok(h, { schaal: 2.4 - 1.4 * p * p, draai: (1 - p) * -20, op: h.klem(h.t / 0.08) })
          + h.kin('You say it every day. It started as a *joke*.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg;
      } },
    // 2 · Boston, 1839: kranten met grappige afkortingen
    { duur: 3.8, in: 'zweep', bron: VOA, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.8, -0.5], [1.4, 'pop', 0.8, 0.5], [1.8, 'pop', 0.8]],
      teken: h => h.kin('*1839*, Boston. Newspapers love jokey abbreviations.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + knipsel(h, 110, 760, 520, 'O.F.M.', 'Our First Men', (h.t - 1.0) / 0.35)
        + knipsel(h, 430, 930, 540, 'S.P.', 'Small Potatoes', (h.t - 1.4) / 0.35)
        + knipsel(h, 150, 1100, 560, 'R.T.B.S.', 'Remains To Be Seen', (h.t - 1.8) / 0.35) },
    // 3 · 23 maart 1839, Boston Morning Post
    { duur: 3.4, in: 'op', bron: MP, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(660 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1839</text>`
          + h.kin('*March 23*: in the Boston Morning Post, editor Charles Gordon Greene writes "O.K."', { y: 780, g: 68, gewicht: 'regular', t: h.t, start: 0.45, max: 860 }).svg;
      } },
    // 4 · wat het betekent: "oll korrect", expres verkeerd gespeld; de letters schuiven
    { duur: 3.8, in: 'flits', bron: MP, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [2.2] }, geluid: [[0.9, 'rol', 0.6], [1.6, 'pop', 0.8], [2.2, 'klap', 0.7], [2.2, 'ding', 0.5]],
      teken: h => {
        const wissel = h.klem((h.t - 0.9) / 0.6), krimp = h.zacht((h.t - 1.9) / 0.4);
        const woord = wissel < 0.5 ? 'all correct' : 'oll korrect';
        const g = 120;
        let s = h.kin('It stands for "*oll korrect*": a deliberate misspelling of "all correct".', { y: 300, g: 78, t: h.t, start: 0.05 }).svg;
        if (krimp < 1) s += `<text x="540" y="1040" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${g}" fill="${wissel < 0.5 ? h.K.inkt : h.K.signaal}" opacity="${(1 - krimp).toFixed(3)}" transform="translate(540 1000) scale(${(1 - 0.5 * krimp).toFixed(3)} 1) translate(-540 -1000)">${woord}</text>`;
        if (krimp > 0) s += ok(h, { y: 1000, schaal: 0.6 * h.veer(krimp), op: krimp });
        return s;
      } },
    // 5 · een taalkundige vond het: Allen Walker Read, door oude kranten te lezen
    { duur: 3.4, in: 'zweep', bron: MP, bronStart: 2.0, camera: { zoom: [1.06, 1.0], pan: [[0, 0], [0, -20]] }, geluid: [[0.8, 'whoosh', 0.35], [1.4, 'whoosh', 0.35, 0.4], [2.0, 'pop', 0.8]],
      teken: h => {
        let s = h.kin('Linguist *Allen Walker Read* of Columbia University found it by reading old newspapers.', { y: 300, g: 76, t: h.t, start: 0.05 }).svg;
        for (let i = 0; i < 5; i++) { const p = h.veer((h.t - 0.7 - i * 0.18) / 0.35); if (p <= 0) continue;
          const x = 200 + i * 150, y = 990 + (i % 2) * 40; s += `<g filter="url(#schKlein)" transform="translate(${x} ${y}) rotate(${(-8 + i * 4)}) scale(${(0.5 + 0.5 * p).toFixed(3)}) translate(${-x} ${-y})"><rect x="${x - 110}" y="${y - 150}" width="220" height="300" fill="#FFFDF7" stroke="${h.K.inkt}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(j => `<line x1="${x - 85}" y1="${y - 110 + j * 40}" x2="${x + 85}" y2="${y - 110 + j * 40}" stroke="${h.K.grijs}" stroke-width="6"/>`).join('')}</g>`; }
        if (h.t > 2.0) s += `<circle cx="800" cy="980" r="${(70 * h.veer((h.t - 2.0) / 0.3)).toFixed(1)}" fill="none" stroke="${h.K.signaal}" stroke-width="10"/>`;
        return s;
      } },
    // 6 · 1840: Martin Van Buren, uit Kinderhook: "Old Kinderhook"
    { duur: 3.6, in: 'op', bron: MP, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [2.0] }, geluid: [[1.4, 'rol', 0.5], [2.0, 'klap', 0.7]],
      teken: h => {
        const k = h.klem((h.t - 1.3) / 0.6);
        const tekst = k < 1 ? 'OLD KINDERHOOK' : 'O.K.';
        return h.kin('*1840*: President Martin Van Buren, born in Kinderhook, New York, runs for re-election.', { y: 300, g: 76, t: h.t, start: 0.05 }).svg
          + `<g filter="url(#sch)"><rect x="140" y="${880}" width="800" height="260" rx="16" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="6"/></g>`
          + `<text x="540" y="${k < 1 ? 1035 : 1065}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${k < 1 ? 72 : 170}" fill="${h.K.signaal}" opacity="${h.klem((h.t - 0.8) / 0.3)}">${tekst}</text>`;
      } },
    // 7 · de OK Club
    { duur: 3.2, in: 'zweep', bron: BEIDE, bronStart: 1.6, camera: { zoom: [1, 1.06], stoot: [0.9], schud: [0.9] }, geluid: [[0.88, 'klap', 0.8], [0.88, 'boem', 0.5], [1.5, 'pop', 0.6]],
      teken: h => h.kin('His supporters form an *O.K. Club* in New York City. "OK" goes on rally signs.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg
        + [-1, 0, 1].map((k, i) => { const p = h.veer((h.t - 0.7 - i * 0.12) / 0.35); if (p <= 0) return ''; const x = 540 + k * 300;
          return `<g filter="url(#schKlein)" transform="translate(${x} 1100) rotate(${k * 6}) scale(${(0.5 + 0.5 * p).toFixed(3)}) translate(${-x} -1100)"><rect x="${x - 8}" y="1000" width="16" height="260" fill="#8B6B4A"/><rect x="${x - 120}" y="880" width="240" height="160" rx="10" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/><text x="${x}" y="995" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="96" fill="${h.K.signaal}">OK</text></g>`; }).join('') },
    // 8 · hij verloor, het woord bleef
    { duur: 3.3, in: 'masker', nacht: true, bron: MP, bronStart: 1.8, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('Van Buren *lost*.', { y: 330, g: 120, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + h.kin('The word *stayed*.', { y: 560, g: 120, t: h.t, start: 1.2, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + ok(h, { y: 1050, schaal: 0.55 * h.veer((h.t - 1.6) / 0.35), op: h.klem((h.t - 1.6) / 0.2), kleur: h.K.geel }) },
    // 9 · slot: hetzelfde OK als het begin; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => ok(h)
        + h.kin('A newspaper joke from *1839*, still in your messages.', { y: 300, g: 92, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
