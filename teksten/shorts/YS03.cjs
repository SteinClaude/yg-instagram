// YS03 v2 — Why does your whole town share one clock? Blame the railways.
// Versie 2 (stijl van YS01 v2, goedgekeurd door Andries 2 nov: "Stijl goed, ga door"): haak in seconde 1 (drie klokken
// met drie tijden, alle drie juist), elke 2–3 s iets nieuws, eigen geluid, einde dat terugloopt naar het beginbeeld.
// Bronnen: Royal Museums Greenwich, "Why do we have Greenwich Mean Time? 'Local' time and the Railways";
// Library of Congress, "The Day of Two Noons" (This Month in Business History). Gelezen 2 nov 2026.
// Elke bewering staat in een van die twee; zie pakketten/<map>/bron/bronnen.md. v1 staat in de git-geschiedenis (15b4584).
const RMG = 'Royal Museums Greenwich, "Why do we have Greenwich Mean Time?"';
const LOC = 'Library of Congress, "The Day of Two Noons"';
// de drie klokken van het begin (en het einde): zelfde moment, drie plaatselijke tijden
const STAD = [['Greenwich', 12, 0, '12:00'], ['Liverpool', 11, 48, '11:48'], ['Plymouth', 11, 43.5, '11:43:30']];
const KX = [220, 540, 860], KY = 960, KR = 128;

function klokken(h, { p = [1, 1, 1], tijden = null, labels = true } = {}) {
  return `<g filter="url(#schKlein)">` + STAD.map(([naam, u, m, sub], i) => {
    const q = h.veer(p[i]); if (p[i] <= 0) return '';
    const [uu, mm] = tijden ? tijden[i] : [u, m];
    const k = h.klok(KX[i], KY, KR, uu, mm, labels ? { label: naam, sub } : {});
    return `<g opacity="${h.klem(p[i] * 2).toFixed(3)}" transform="translate(${KX[i]} ${KY}) scale(${(0.4 + 0.6 * q).toFixed(3)}) translate(${-KX[i]} ${-KY})">${k}</g>`;
  }).join('') + '</g>';
}
// helemaal buiten beeld: niets tekenen (resvg loopt vast op een schaduwfilter dat buiten het doek valt)
const trein = (h, x, y = 1090) => (x < -700 || x > 1080) ? '' : `<g filter="url(#sch)" transform="translate(${x.toFixed(1)} 0)"><rect x="0" y="${y - 150}" width="260" height="120" rx="14" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="5"/>`
  + `<rect x="270" y="${y - 130}" width="200" height="100" rx="12" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/><rect x="480" y="${y - 130}" width="200" height="100" rx="12" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/>`
  + [40, 200, 320, 420, 530, 630].map(cx => `<circle cx="${cx}" cy="${y - 24}" r="20" fill="${h.K.inkt}"/>`).join('') + `<rect x="30" y="${y - 185}" width="40" height="40" fill="${h.K.inkt}"/></g>`;

module.exports = {
  code: 'YS03',
  versie: 2,
  map: '2026-11-11-YS03-spoortijd',
  nummer: 'No. 03',
  onderwerp: 'THE TIME ON YOUR CLOCK',
  scenes: [
    // 1 · HAAK: drie klokken slaan neer, drie tijden; alle drie klopten
    { duur: 3.2, bron: RMG, bronStart: 2.0, camera: { zoom: [1.05, 1.0], stoot: [0.15, 0.4, 0.65] },
      geluid: [[0.12, 'klap', 0.7, -0.6], [0.37, 'klap', 0.7], [0.62, 'klap', 0.7, 0.6], [0.62, 'boem', 0.5]],
      teken: h => klokken(h, { p: [0, 1, 2].map(i => (h.t - 0.05 - i * 0.25) / 0.3) })
        + h.kin('Same moment. Three times. *All three* were right.', { y: 300, g: 96, t: h.t, start: 0.85 }).svg },
    // 2 · elke stad had zijn eigen zon
    { duur: 3.3, in: 'zweep', camera: { zoom: [1, 1.05] }, geluid: [[0.4, 'whoosh', 0.5, -0.5], [1.6, 'whoosh', 0.5, 0.5]],
      teken: h => {
        const p = h.zacht((h.t - 0.2) / 2.8), a = Math.PI * (1 - p), cx = 540 + 360 * Math.cos(a), cy = 1180 - 330 * Math.sin(a);
        return h.kin('For most of history, every town set its clocks by *its own sun*.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg
          + `<path d="M180 1180 A360 330 0 0 1 900 1180" fill="none" stroke="${h.K.grijs}" stroke-width="3" stroke-dasharray="10 12"/>`
          + `<line x1="140" y1="1180" x2="940" y2="1180" stroke="${h.K.inkt}" stroke-width="4"/>`
          + `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="56" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="4" filter="url(#schKlein)"/>`;
      } },
    // 3 · naar het westen komt de middag later: de zon trekt over drie steden
    { duur: 3.3, in: 'op', camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'ding', 0.6, 0.6], [1.5, 'ding', 0.6], [2.2, 'ding', 0.6, -0.6]],
      teken: h => {
        const x = 980 - h.zacht((h.t - 0.5) / 2.0) * 860;
        let s = h.kin('Noon = the sun at its highest. Go west, and noon comes *later*.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg
          + `<line x1="100" y1="1150" x2="980" y2="1150" stroke="${h.K.inkt}" stroke-width="4"/>`
          + `<text x="980" y="1210" text-anchor="end" font-family="IBM Plex Mono" font-size="30" fill="${h.K.grijs}">EAST</text><text x="100" y="1210" font-family="IBM Plex Mono" font-size="30" fill="${h.K.grijs}">WEST</text>`;
        [['Greenwich', 840], ['Liverpool', 560], ['Plymouth', 240]].forEach(([n, sx]) => {
          const aan = x <= sx + 10;
          s += `<circle cx="${sx}" cy="1150" r="16" fill="${aan ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="4"/><text x="${sx}" y="1110" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="38" fill="${h.K.inkt}">${n}</text>`;
        });
        return s + `<circle cx="${x.toFixed(1)}" cy="880" r="56" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="4" filter="url(#schKlein)"/>`;
      } },
    // 4 · Liverpool liep 12 minuten achter
    { duur: 2.5, in: 'flits', bron: RMG, bronStart: 0.9, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.3, 'pop'], [0.9, 'rol', 0.5]],
      teken: h => h.klok(540, 900, 230 * (0.5 + 0.5 * h.veer(h.t / 0.3)), 11, 60 - 12 * h.zacht((h.t - 0.5) / 0.9), { doorzicht: h.klem(h.t / 0.1) })
        + h.kin('Liverpool: *12 minutes* behind Greenwich.', { y: 300, g: 92, t: h.t, start: 0.1 }).svg },
    // 5 · Plymouth liep ongeveer 16,5 minuut achter
    { duur: 2.5, in: 'zweep', bron: RMG, bronStart: 0.9, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.3, 'pop'], [0.9, 'rol', 0.5]],
      teken: h => h.klok(540, 900, 230 * (0.5 + 0.5 * h.veer(h.t / 0.3)), 11, 60 - 16.5 * h.zacht((h.t - 0.5) / 0.9), { doorzicht: h.klem(h.t / 0.1) })
        + h.kin('Plymouth: about *16.5 minutes* behind.', { y: 300, g: 92, t: h.t, start: 0.1 }).svg },
    // 6 · toen kwam de trein
    { duur: 3.3, in: 'op', camera: { zoom: [1, 1.04], schud: [0.8, 1.6] }, geluid: [[0.2, 'rol', 0.8], [0.7, 'whoosh', 0.8, -0.6], [1.5, 'whoosh', 0.6, 0.6]],
      teken: h => `<line x1="0" y1="1090" x2="1080" y2="1090" stroke="${h.K.inkt}" stroke-width="6"/>` + trein(h, 1100 - h.t * 640)
        + h.kin('Then came the *railways*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg
        + h.kin('One timetable. Dozens of different clocks.', { y: 560, g: 64, gewicht: 'regular', t: h.t, start: 1.2 }).svg },
    // 7 · 1847: alle stations op Greenwich-tijd; de klokken springen gelijk
    { duur: 3.1, in: 'zweep', bron: RMG, bronStart: 1.6, camera: { zoom: [1, 1.05], stoot: [1.3], schud: [1.3] }, geluid: [[0.6, 'stijg', 0.4], [1.3, 'klap'], [1.3, 'ding', 0.6]],
      teken: h => {
        const q = h.veer((h.t - 1.0) / 0.3);
        return klokken(h, { tijden: STAD.map(([, u, m]) => { const van = u * 60 + m, naar = 720; const v = van + (naar - van) * h.klem(q); return [Math.floor(v / 60), v % 60]; }), labels: false })
          + h.kin('*1847*: Britain\'s Railway Clearing House recommends Greenwich time for every station.', { y: 300, g: 70, t: h.t, start: 0.05 }).svg;
      } },
    // 8 · 1852: de telegraaf draagt de tijd het land door
    { duur: 2.7, in: 'flits', bron: RMG, bronStart: 1.2, camera: { zoom: [1, 1.05] }, geluid: [0.5, 0.75, 1.0, 1.25, 1.5, 1.75].map((t, i) => [t, 'tik', 0.7, -0.8 + i * 0.32]),
      teken: h => {
        let s = h.kin('*1852*: telegraph wires carry it across the country.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
          + `<path d="M100 1000 C 300 900, 400 1100, 540 1000 S 800 900, 980 1000" fill="none" stroke="${h.K.inkt}" stroke-width="5"/>`;
        for (let k = 0; k < 4; k++) { const u = ((h.t - 0.4) * 0.8 - k * 0.22); if (u < 0 || u > 1) continue; const x = 100 + 880 * u, y = 1000 - 60 * Math.sin(u * Math.PI * 2); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="${h.K.signaal}"/>`; }
        return s;
      } },
    // 9 · 1880: GMT wordt de wettelijke tijd
    { duur: 2.8, in: 'zweep', bron: RMG, bronStart: 1.3, camera: { zoom: [1, 1.05], stoot: [0.9], schud: [0.9] }, geluid: [[0.88, 'klap'], [0.88, 'boem', 0.7]],
      teken: h => {
        const q = h.veer((h.t - 0.6) / 0.3);
        return h.kin('*1880*: Greenwich Mean Time becomes the legal time in Great Britain.', { y: 300, g: 78, t: h.t, start: 0.05 }).svg
          + (h.t > 0.6 ? `<g filter="url(#sch)" transform="translate(540 960) rotate(-8) scale(${(2.2 - 1.2 * q).toFixed(3)}) translate(-540 -960)" opacity="${h.klem((h.t - 0.6) / 0.1)}"><rect x="290" y="860" width="500" height="200" rx="18" fill="none" stroke="${h.K.signaal}" stroke-width="14"/><text x="540" y="1000" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="130" fill="${h.K.signaal}">LAW</text></g>` : '');
      } },
    // 10 · Amerika, 18 november 1883: de dag van twee keer twaalf uur
    { duur: 3.6, in: 'masker', nacht: true, bron: LOC, bronStart: 1.8, camera: { zoom: [1, 1.05], stoot: [2.2] }, geluid: [[1.2, 'ding', 0.7, -0.5], [2.2, 'ding', 0.7, 0.5]],
      teken: h => {
        const a = h.klem((h.t - 1.0) / 0.3), b = h.klem((h.t - 2.0) / 0.3);
        return h.kin('America, *18 November 1883*: the "Day of Two Noons".', { y: 300, g: 82, t: h.t, start: 0.05, kleur: '#F3F0E8' }).svg
          + `<g filter="url(#sch)">${h.klok(320, 960, 140, 11, 50 + 10 * a, { vul: '#F3F0E8', doorzicht: h.klem((h.t - 0.7) / 0.3) })}${h.klok(760, 960, 140, 11, 50 + 10 * b, { vul: '#F3F0E8', doorzicht: h.klem((h.t - 0.9) / 0.3) })}</g>`
          + `<text x="320" y="1180" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#D8D4CA" opacity="${a}">local noon</text><text x="760" y="1180" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#D8D4CA" opacity="${b}">standard noon</text>`;
      } },
    // 11 · 1918: pas dan federale wet
    { duur: 2.6, in: 'op', bron: LOC, bronStart: 1.1, camera: { zoom: [1, 1.05], stoot: [0.8] }, geluid: [[0.05, 'rol', 0.7], [0.8, 'ding', 0.7]],
      teken: h => {
        const j = Math.round(1883 + 35 * h.zacht(h.t / 0.75));
        return `<text x="540" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="250" fill="${j === 1918 ? h.K.signaal : h.K.inkt}">${j}</text>`
          + h.kin('Only then does the US make standard time *law*.', { y: 760, g: 80, t: h.t, start: 0.85, midden: true, max: 860 }).svg;
      } },
    // 12 · slot: de tijd op je telefoon begon als dienstregeling; de klokken lopen terug naar het beginbeeld
    { duur: 4.0, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => {
        const terug = h.zacht((h.t - 2.6) / 0.9);
        return klokken(h, { tijden: STAD.map(([, u, m]) => { const v = 720 + (u * 60 + m - 720) * terug; return [Math.floor(v / 60), v % 60]; }), labels: terug > 0.98 })
          + h.kin('The time zone on your phone began as a *railway timetable*.', { y: 300, g: 88, t: h.t, start: 0.1, weg: 3.0 }).svg
          + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Next: why there's an @ in your email.</text>`;
      } },
  ],
};
