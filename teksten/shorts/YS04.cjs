// YS04 — Why is there an @ in your email address?
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bronnen (gelezen 2 nov 2026): NPR, "In memoriam: Ray Tomlinson, who put the @ sign in your email" (Alina Selyukh,
// 7 maart 2016, overgenomen door MPR News); Internet Hall of Fame, "Meet the Man Who Put the '@' in Your E-Mail".
// Elke bewering staat in een van die twee; zie pakketten/<map>/bron/bronnen.md. Wat de bronnen niet zeggen (welke tekens
// hij nog meer overwoog, wat het eerste bericht precies was) zeggen wij niet.
const NPR = 'NPR, "In memoriam: Ray Tomlinson, who put the @ sign in your email"';
const IHOF = 'Internet Hall of Fame, "Meet the Man Who Put the \'@\' in Your E-Mail"';
const BEIDE = 'NPR (2016); Internet Hall of Fame, "Meet the Man Who Put the \'@\' in Your E-Mail"';
const AX = 540, AY = 1000;

// het grote @, met schaduw; draai en schaal voor de beweging
const apestaart = (h, { x = AX, y = AY, g = 520, draai = 0, schaal = 1, kleur, op = 1 } = {}) =>
  `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})"><text x="${x}" y="${y + g * 0.33}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="${kleur || h.K.signaal}">@</text></g>`;
// een computer uit 1971: kast met schermpje
const computer = (h, x, y, label, aan = 0) => `<g filter="url(#schKlein)"><rect x="${x - 120}" y="${y - 150}" width="240" height="250" rx="16" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/>`
  + `<rect x="${x - 90}" y="${y - 120}" width="180" height="110" rx="8" fill="${h.K.nacht}"/><rect x="${x - 70}" y="${y - 95}" width="${(140 * aan).toFixed(1)}" height="14" fill="${h.K.geel}"/>`
  + `<rect x="${x - 90}" y="${y + 20}" width="180" height="50" rx="6" fill="${h.K.papierDiep}" stroke="${h.K.inkt}" stroke-width="3"/></g>`
  + `<text x="${x}" y="${y + 150}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${h.K.inkt}">${label}</text>`;

module.exports = {
  code: 'YS04',
  versie: 2,
  map: '2026-11-12-YS04-apenstaartje',
  nummer: 'No. 04',
  onderwerp: 'THE @ SIGN',
  scenes: [
    // 1 · HAAK: het @ tolt binnen en slaat neer
    { duur: 2.9, camera: { zoom: [1, 1.04], stoot: [0.35], schud: [0.35] }, geluid: [[0.05, 'whoosh', 0.6], [0.33, 'klap'], [0.33, 'boem', 0.8]],
      teken: h => {
        const p = h.klem(h.t / 0.35);
        return apestaart(h, { draai: (1 - p) * 540, schaal: 2.6 - 1.6 * p * p, op: h.klem(h.t / 0.08) })
          + h.kin('One man picked this symbol. *You use it every day.*', { y: 300, g: 96, t: h.t, start: 0.45 }).svg;
      } },
    // 2 · 1971, BBN
    { duur: 3.2, in: 'zweep', bron: BEIDE, bronStart: 1.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1971</text>`
          + h.kin('Ray Tomlinson, an engineer at *Bolt, Beranek and Newman*, is building an early email system.', { y: 800, g: 64, gewicht: 'regular', t: h.t, start: 0.45, max: 860 }).svg;
      } },
    // 3 · twee computers in zijn kantoor, ± 3 meter uit elkaar; een bericht springt over
    { duur: 3.6, in: 'op', bron: NPR, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'whoosh', 0.6, -0.6], [1.75, 'pop', 0.9, 0.6], [2.4, 'whoosh', 0.5, -0.6], [2.95, 'pop', 0.8, 0.6]],
      teken: h => {
        let s = h.kin('Two computers in his office. Keyboards about *10 feet* apart.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
          + computer(h, 260, 1000, 'MACHINE 1', h.klem((h.t - 0.8) / 0.4)) + computer(h, 820, 1000, 'MACHINE 2', h.klem((h.t - 1.7) / 0.3));
        for (const st of [1.2, 2.4]) { const u = (h.t - st) / 0.55; if (u < 0 || u > 1) continue; const x = 380 + 320 * h.zacht(u), y = 900 - 140 * Math.sin(Math.PI * u);
          s += `<g filter="url(#schKlein)"><rect x="${(x - 46).toFixed(1)}" y="${(y - 32).toFixed(1)}" width="92" height="64" rx="6" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="4"/><path d="M${(x - 46).toFixed(1)} ${(y - 32).toFixed(1)} L${x.toFixed(1)} ${(y + 6).toFixed(1)} L${(x + 46).toFixed(1)} ${(y - 32).toFixed(1)}" fill="none" stroke="${h.K.inkt}" stroke-width="4"/></g>`; }
        return s;
      } },
    // 4 · het probleem: een adres heeft een persoon én een machine nodig
    { duur: 3.3, in: 'flits', bron: NPR, bronStart: 1.8, camera: { zoom: [1, 1.05], stoot: [1.7] }, geluid: [[0.7, 'pop', 0.8, -0.4], [1.1, 'pop', 0.8, 0.4], [1.7, 'stijg', 0.4]],
      teken: h => {
        const a = h.veer((h.t - 0.7) / 0.35), b = h.veer((h.t - 1.1) / 0.35), knipper = h.t > 1.7 && Math.floor(h.t * 4) % 2 === 0;
        return h.kin('He needs to separate the *user* from the *machine*.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
          + (h.t > 0.7 ? `<text x="${(380 - (1 - a) * 300).toFixed(1)}" y="1010" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="${h.K.inkt}">user</text>` : '')
          + (h.t > 1.1 ? `<text x="${(700 + (1 - b) * 300).toFixed(1)}" y="1010" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="${h.K.inkt}">host</text>` : '')
          + `<rect x="430" y="920" width="220" height="110" rx="12" fill="none" stroke="${knipper ? h.K.signaal : h.K.grijs}" stroke-width="6" stroke-dasharray="18 12"/>`
          + `<text x="540" y="1000" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="80" fill="${h.K.grijs}">?</text>`;
      } },
    // 5 · hij koos een teken dat in de computerwereld zelden voorkwam: de andere tekens dimmen, @ blijft
    { duur: 3.4, in: 'zweep', bron: NPR, bronStart: 1.9, camera: { zoom: [1, 1.03], midden: [540, 1000] }, geluid: [[0.5, 'tik', 0.6, -0.6], [0.65, 'tik', 0.6, -0.3], [0.8, 'tik', 0.6], [0.95, 'tik', 0.6, 0.3], [1.1, 'tik', 0.6, 0.6], [1.7, 'ding', 0.8]],
      teken: h => {
        const tekens = ['#', '%', '&', '@', '*', '+'], dim = h.klem((h.t - 1.5) / 0.4);
        let s = h.kin('He picks a symbol that was *rarely used* in computing.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg;
        tekens.forEach((c, i) => {
          const p = h.veer((h.t - 0.45 - i * 0.15) / 0.3); if (p <= 0) return;
          const x = 220 + (i % 3) * 320, y = 840 + Math.floor(i / 3) * 230, at = c === '@';
          const op = at ? 1 : 1 - 0.85 * dim, sc = (0.5 + 0.5 * p) * (at ? 1 + 0.35 * dim : 1);
          s += `<g opacity="${op.toFixed(3)}" transform="translate(${x} ${y}) scale(${sc.toFixed(3)}) translate(${-x} ${-y})"><rect x="${x - 90}" y="${y - 90}" width="180" height="180" rx="24" fill="${at && dim > 0 ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5" filter="url(#schKlein)"/><text x="${x}" y="${y + 44}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="130" fill="${at && dim > 0 ? '#FFFFFF' : h.K.inkt}">${h.esc(c)}</text></g>`;
        });
        return s;
      } },
    // 6 · het citaat: "It's the only preposition on the keyboard."
    { duur: 3.6, in: 'masker', nacht: true, bron: NPR, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.3, 'pop', 0.6], [2.0, 'ding', 0.6]],
      teken: h => {
        const q = h.veer(h.t / 0.4);
        return `<text x="110" y="${(560 + (1 - q) * 80).toFixed(1)}" font-family="Instrument Sans" font-weight="700" font-size="360" fill="${h.K.geel}" opacity="${h.klem(h.t / 0.2)}">“</text>`
          + h.kin("It's the only *preposition* on the keyboard.", { y: 620, g: 104, t: h.t, start: 0.4, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + h.kin('— Ray Tomlinson', { y: 1080, g: 52, gewicht: 'mono', t: h.t, start: 1.6, kleur: '#C9C6BC' }).svg;
      } },
    // 7 · user @ host leest als "user at host"
    { duur: 3.4, in: 'zoom', bron: NPR, bronStart: 1.9, camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.88, 'klap', 0.7], [0.88, 'boem', 0.5], [1.8, 'pop', 0.8]],
      teken: h => {
        const q = h.veer((h.t - 0.6) / 0.35);
        return h.kin('Name *at* machine.', { y: 300, g: 120, t: h.t, start: 0.05 }).svg
          + `<text x="380" y="1010" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="${h.K.inkt}">user</text><text x="700" y="1010" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="${h.K.inkt}">host</text>`
          + (h.t > 0.6 ? apestaart(h, { y: 975, g: 190, schaal: 0.3 + 0.7 * q, draai: (1 - q) * 180 }) : '')
          + h.kin('The person on the left. The machine on the right.', { y: 1140, g: 60, gewicht: 'regular', t: h.t, start: 1.8, midden: true, max: 860 }).svg;
      } },
    // 8 · en wat stond er in de eerste mail? Hij weet het zelf niet meer
    { duur: 3.6, in: 'zweep', bron: NPR, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[0.2, 'stijg', 0.45], [1.55, 'klap', 0.6], [2.4, 'pop', 0.7]],
      teken: h => {
        const open = h.zacht((h.t - 0.9) / 0.6);
        return h.kin('So what did the first email say?', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
          + `<g filter="url(#sch)"><rect x="270" y="760" width="540" height="360" rx="14" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="6"/>`
          + `<path d="M270 760 L540 ${(980 - 380 * open).toFixed(1)} L810 760" fill="${h.K.papierDiep}" stroke="${h.K.inkt}" stroke-width="6"/></g>`
          + (open > 0.95 ? `<text x="540" y="1000" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="110" fill="${h.K.grijs}" opacity="${h.klem((h.t - 1.5) / 0.2)}">? ? ?</text>` : '')
          + h.kin('"Completely *forgettable*." — Tomlinson', { y: 1160, g: 58, t: h.t, start: 2.3, midden: true, max: 900 }).svg;
      } },
    // 9 · slot: hetzelfde @ als het begin; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'flits', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => apestaart(h)
        + h.kin('Every address you type still carries his choice from *1971*.', { y: 300, g: 88, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Next: the glue that couldn't hold on.</text>` },
  ],
};
