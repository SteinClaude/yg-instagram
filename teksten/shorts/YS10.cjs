// YS10 — The first computer bug was a real moth. But it wasn't the first bug.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks C · Happy Accidents.
// Bronnen (gelezen 2 nov 2026): Computer History Museum, "This Day in History: September 9"; JSTOR Daily, "The Bug in
// the Computer Bug Story". Elke bewering staat in een van die twee; zie pakketten/<map>/bron/bronnen.md.
// Niet gezegd: dat Grace Hopper de mot vond of de notitie schreef (de bronnen zeggen dat niet).
const CHM = 'Computer History Museum, "This Day in History: September 9"';
const JD = 'JSTOR Daily, "The Bug in the Computer Bug Story"';
const BEIDE = 'Computer History Museum; JSTOR Daily';

// een mot: lijf en vier vleugels; klap = 0..1 (vleugels open/dicht)
const mot = (h, x, y, s = 1, { klap = 1, draai = 0, op = 1 } = {}) => {
  const v = (0.35 + 0.65 * klap).toFixed(3);
  return `<g opacity="${op.toFixed(3)}" filter="url(#schKlein)" transform="translate(${x} ${y}) rotate(${draai.toFixed(1)}) scale(${s.toFixed(3)})">`
    + `<g transform="scale(${v} 1)"><path d="M 0 -10 C -60 -90 -150 -70 -140 -10 C -130 30 -60 20 0 0 Z" fill="#9A8467" stroke="${h.K.inkt}" stroke-width="4"/>`
    + `<path d="M 0 -10 C 60 -90 150 -70 140 -10 C 130 30 60 20 0 0 Z" fill="#9A8467" stroke="${h.K.inkt}" stroke-width="4"/>`
    + `<path d="M 0 5 C -40 20 -100 70 -70 90 C -40 100 -15 50 0 15 Z" fill="#B49E80" stroke="${h.K.inkt}" stroke-width="4"/>`
    + `<path d="M 0 5 C 40 20 100 70 70 90 C 40 100 15 50 0 15 Z" fill="#B49E80" stroke="${h.K.inkt}" stroke-width="4"/></g>`
    + `<ellipse cx="0" cy="20" rx="13" ry="55" fill="#5E4B36" stroke="${h.K.inkt}" stroke-width="4"/>`
    + `<path d="M -4 -30 C -20 -70 -35 -80 -45 -85 M 4 -30 C 20 -70 35 -80 45 -85" fill="none" stroke="${h.K.inkt}" stroke-width="4"/></g>`;
};
// logboekbladzijde met lijnen
const blad = (h, x, y, w, hh, draai = 0) => `<g filter="url(#sch)" transform="rotate(${draai} ${x + w / 2} ${y + hh / 2})"><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#FFFDF4" stroke="${h.K.inkt}" stroke-width="4"/>`
  + Array.from({ length: Math.floor(hh / 56) - 1 }, (_, i) => `<line x1="${x + 30}" y1="${y + 56 * (i + 1)}" x2="${x + w - 30}" y2="${y + 56 * (i + 1)}" stroke="#C9D6E3" stroke-width="3"/>`).join('')
  + `<line x1="${x + 80}" y1="${y}" x2="${x + 80}" y2="${y + hh}" stroke="#E7A9A0" stroke-width="3"/></g>`;
const plakband = (x, y, w, draai) => `<rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="44" fill="#F3E9B8" opacity="0.8" transform="rotate(${draai} ${x} ${y})"/>`;
// relaiskast: een raster van relais
const relais = (h, x0, y0, n, t = 99, start = 0) => {
  let s = `<g filter="url(#sch)"><rect x="${x0 - 30}" y="${y0 - 30}" width="${6 * 130 + 40}" height="${n * 110 + 40}" rx="14" fill="#3B3F4A"/></g>`;
  for (let r = 0; r < n; r++) for (let k = 0; k < 6; k++) {
    const p = h.klem((t - start - (r * 6 + k) * 0.02) / 0.15); if (p <= 0) continue;
    const x = x0 + k * 130, y = y0 + r * 110;
    s += `<g opacity="${p.toFixed(3)}"><rect x="${x}" y="${y}" width="110" height="80" rx="8" fill="#C9C6BC"/><rect x="${x + 15}" y="${y + 15}" width="80" height="14" fill="#8C6A3E"/><rect x="${x + 15}" y="${y + 50}" width="80" height="14" fill="#8C6A3E"/></g>`;
  }
  return s;
};

module.exports = {
  code: 'YS10',
  versie: 2,
  map: '2026-11-18-YS10-bug',
  nummer: 'No. 10',
  onderwerp: 'THE WORD "BUG"',
  scenes: [
    // 1 · HAAK: een mot fladdert in beeld en wordt vastgeplakt; maar het was niet de eerste bug
    { duur: 3.6, camera: { zoom: [1, 1.04], stoot: [0.9], schud: [0.9] }, geluid: [[0.05, 'whoosh', 0.5], [0.88, 'klap'], [0.88, 'boem', 0.6], [2.2, 'ding', 0.5]],
      teken: h => {
        const p = h.zacht(h.t / 0.9), vast = h.t > 0.9;
        const x = 900 - 360 * p + (vast ? 0 : Math.sin(h.t * 18) * 30), y = 760 + 260 * p + (vast ? 0 : Math.cos(h.t * 14) * 40);
        return blad(h, 260, 880, 560, 420, -3) + mot(h, x, y + 40, 0.9, { klap: vast ? 1 : Math.abs(Math.sin(h.t * 22)), draai: vast ? -8 : 20 * Math.sin(h.t * 9) })
          + (vast ? plakband(540, 990, 300, -12) + plakband(540, 1140, 300, 10) : '')
          + h.kin('The first computer bug was a *real moth*.', { y: 290, g: 96, t: h.t, start: 0.1 }).svg
          + h.kin('But it wasn\'t the *first bug*.', { y: 690, g: 76, gewicht: 'regular', t: h.t, start: 1.8 }).svg;
      } },
    // 2 · 1947, Harvard, de Mark II
    { duur: 3.3, in: 'zweep', bron: CHM, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'rol', 0.6]],
      teken: h => h.kin('*1947*, Harvard University. The *Mark II* computer.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
        + relais(h, 150, 820, 4, h.t, 0.6) },
    // 3 · tussen de relaiscontacten: een mot (inzoomen)
    { duur: 3.4, in: 'zoom', bron: CHM, bronStart: 1.8, camera: { zoom: [1, 1.08], stoot: [1.3] }, geluid: [[1.28, 'pop', 0.9], [1.3, 'klap', 0.5]],
      teken: h => h.kin('Caught between its relay contacts: a *moth*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
        + `<g filter="url(#sch)"><rect x="200" y="840" width="680" height="70" rx="10" fill="#8C6A3E"/><rect x="200" y="1150" width="680" height="70" rx="10" fill="#8C6A3E"/></g>`
        + (h.t > 1.2 ? mot(h, 540, 1030, 0.95 * h.veer((h.t - 1.2) / 0.3), { klap: 0.8 }) : '') },
    // 4 · in het logboek geplakt, met de notitie
    { duur: 4.0, in: 'op', bron: CHM, bronStart: 2.6, camera: { zoom: [1, 1.05] }, geluid: [[0.7, 'klap', 0.7], [1.0, 'klap', 0.6], [1.4, 'rol', 0.5]],
      teken: h => {
        const tekst = 'First actual case of bug being found.', n = Math.floor(h.klem((h.t - 1.4) / 1.6) * tekst.length);
        return h.kin('The team taped it into the logbook, with a note:', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
          + blad(h, 140, 700, 800, 560, 0) + mot(h, 330, 880, 0.75, { klap: 1, draai: -10 })
          + (h.t > 0.7 ? plakband(330, 830, 260, -14) : '') + (h.t > 1.0 ? plakband(330, 960, 260, 12) : '')
          + `<text x="200" y="1120" font-family="IBM Plex Mono" font-size="42" fill="#2A3F8F">${h.esc(tekst.slice(0, Math.min(n, 21)))}</text>`
          + `<text x="200" y="1180" font-family="IBM Plex Mono" font-size="42" fill="#2A3F8F">${h.esc(n > 21 ? tekst.slice(21, n) : '')}</text>`;
      } },
    // 5 · "actual"? dus het woord bestond al
    { duur: 3.4, in: 'flits', bron: BEIDE, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.6, 'ding', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(640 - (1 - q) * 200).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(150 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">"actual"?</text>`
          + h.kin('Because "bug" already *meant a fault*.', { y: 860, g: 92, t: h.t, start: 0.6, nadruk: 'balk' }).svg;
      } },
    // 6 · 1878: Edison
    { duur: 4.0, in: 'zweep', bron: JD, bronStart: 2.6, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(620 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(270 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1878</text>`
          + h.kin('In a letter, *Thomas Edison* writes of "Bugs", "as such little faults and difficulties are called."', { y: 760, g: 72, t: h.t, start: 0.45 }).svg;
      } },
    // 7 · Grace Hopper was erbij en maakte het verhaal beroemd
    { duur: 3.6, in: 'op', bron: CHM, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[1.5, 'pop', 0.7], [1.9, 'pop', 0.7, 0.4]],
      teken: h => {
        const p = h.veer((h.t - 1.4) / 0.35);
        return h.kin('*Grace Hopper* was there. She made the story famous in her many *lectures*.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
          + (p > 0 ? `<g filter="url(#sch)" transform="translate(540 1030) scale(${p.toFixed(3)}) translate(-540 -1030)"><path d="M 220 860 h 640 a 30 30 0 0 1 30 30 v 240 a 30 30 0 0 1 -30 30 h -380 l -90 80 v -80 h -170 a 30 30 0 0 1 -30 -30 v -240 a 30 30 0 0 1 30 -30 Z" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/></g>${mot(h, 540, 1000, 0.7 * p, { klap: Math.abs(Math.sin(h.t * 8)) })}` : '');
      } },
    // 8 · het logboek ligt nu in het Smithsonian
    { duur: 3.6, in: 'masker', nacht: true, bron: JD, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('Today the logbook, moth and all, is in the *Smithsonian*\'s National Museum of American History.', { y: 330, g: 76, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + `<g opacity="${h.klem((h.t - 1.2) / 0.4).toFixed(3)}"><rect x="230" y="880" width="620" height="420" fill="none" stroke="${h.K.geel}" stroke-width="8"/>${blad(h, 270, 920, 540, 340, 0)}${mot(h, 420, 1060, 0.6, { draai: -10 })}</g>` },
    // 9 · slot: de mot op het blad; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => blad(h, 260, 840, 560, 420, -3) + mot(h, 540, 1020, 0.9, { draai: -8 }) + plakband(540, 950, 300, -12) + plakband(540, 1100, 300, 10)
        + h.kin('Not the first bug. Just the first *actual* one.', { y: 300, g: 96, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
