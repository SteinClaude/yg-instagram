// YS08 — What does SOS stand for? Nothing.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bron (gelezen 2 nov 2026): ITU News 6/2006, Pioneers' page, over het SOS-signaal. Elke bewering staat daarin; zie
// pakketten/<map>/bron/bronnen.md. Niet gezegd: "save our souls" (de bron noemt het niet), wie het patroon bedacht.
const ITU = 'ITU News, "Pioneers\' page" (2006)';
const MX = 540, MY = 1040;

// morse: drie punten, drie strepen, drie punten; p = hoeveel tekens er al staan (0..9)
const morse = (h, { y = MY, p = 9, kleur, schaal = 1, op = 1 } = {}) => {
  const delen = ['.', '.', '.', '-', '-', '-', '.', '.', '.'];
  const breed = d => d === '.' ? 46 : 124, gat = 22;
  const totaal = delen.reduce((a, d) => a + breed(d), 0) + gat * 8;
  let x = MX - totaal / 2, s = '';
  delen.forEach((d, i) => {
    const q = h.veer(p - i); if (q > 0) {
      const w = breed(d), cx = x + w / 2;
      s += `<g transform="translate(${cx} ${y}) scale(${(0.4 + 0.6 * q).toFixed(3)}) translate(${-cx} ${-y})"><rect x="${x}" y="${y - 23}" width="${w}" height="46" rx="23" fill="${kleur || h.K.signaal}"/></g>`;
    }
    x += breed(d) + gat;
  });
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${MX} ${y}) scale(${schaal.toFixed(4)}) translate(${-MX} ${-y})">${s}</g>`;
};
// grote letters SOS
const sos = (h, { y = MY, schaal = 1, op = 1, kleur, draai = 0 } = {}) =>
  `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${MX} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-MX} ${-y})"><text x="${MX}" y="${y + 110}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="320" letter-spacing="10" fill="${kleur || h.K.signaal}">SOS</text></g>`;
// zendsleutel met een vonkje
const sleutel = (h, x, y, neer) => `<g filter="url(#schKlein)"><rect x="${x - 170}" y="${y + 40}" width="340" height="50" rx="10" fill="#8B6B4A"/><rect x="${x - 140}" y="${y + (neer ? 10 : -10)}" width="260" height="24" rx="8" fill="${h.K.inkt}" transform="rotate(${neer ? 4 : -4} ${x - 120} ${y + 20})"/><circle cx="${x + 120}" cy="${y + (neer ? 6 : -22)}" r="26" fill="${h.K.inkt}"/></g>`
  + (neer ? `<circle cx="${x - 120}" cy="${y + 38}" r="10" fill="${h.K.geel}"/>` : '');

module.exports = {
  code: 'YS08',
  versie: 2,
  map: '2026-11-16-YS08-sos',
  nummer: 'No. 08',
  onderwerp: 'THE SIGNAL "SOS"',
  scenes: [
    // 1 · HAAK: SOS slaat neer, met de belofte dat het niets betekent
    { duur: 2.9, camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => {
        const p = h.klem(h.t / 0.3);
        return sos(h, { schaal: 2.4 - 1.4 * p * p, draai: (1 - p) * 15, op: h.klem(h.t / 0.08) })
          + h.kin('SOS doesn\'t stand for *anything*.', { y: 320, g: 112, t: h.t, start: 0.4 }).svg;
      } },
    // 2 · het is één morsepatroon: punten en strepen verschijnen met piepjes
    { duur: 4.2, in: 'zweep', bron: ITU, bronStart: 2.6, camera: { zoom: [1, 1.05] },
      geluid: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => [0.9 + i * 0.22, 'tik', 0.8]),
      teken: h => h.kin('It\'s one unbroken Morse pattern, not *separate letters*.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + morse(h, { p: (h.t - 0.9) / 0.22 + 1 })
        + `<text x="${MX}" y="1220" text-anchor="middle" font-family="IBM Plex Mono" font-size="32" fill="${h.K.grijs}" opacity="${h.klem((h.t - 3.0) / 0.3).toFixed(3)}">dot dot dot · dash dash dash · dot dot dot</text>` },
    // 3 · 1905: Duitse radioregels
    { duur: 3.3, in: 'op', bron: ITU, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1905</text>`
          + h.kin('It first appears in *German* radio regulations.', { y: 830, g: 84, t: h.t, start: 0.45 }).svg;
      } },
    // 4 · 1906: Berlijn, 29 landen tekenen
    { duur: 3.8, in: 'flits', bron: ITU, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [2.4] }, geluid: [[0.9, 'rol', 0.5], [2.4, 'ding', 0.6]],
      teken: h => {
        let s = h.kin('*1906*: a radio conference in Berlin. *29 countries* sign. Ships in distress must use this signal.', { y: 300, g: 76, t: h.t, start: 0.05 }).svg;
        for (let i = 0; i < 29; i++) {
          const p = h.veer((h.t - 0.9 - i * 0.045) / 0.25); if (p <= 0) continue;
          const kx = i % 6, ky = Math.floor(i / 6), x = 200 + kx * 136, y = 830 + ky * 96;
          s += `<rect x="${x - 50 * p}" y="${y - 32 * p}" width="${100 * p}" height="${64 * p}" rx="6" fill="${i % 3 === 0 ? h.K.signaal : i % 3 === 1 ? h.K.inkt : h.K.geel}" opacity="0.9"/>`;
        }
        return s;
      } },
    // 5 · waarom dit patroon: simpel en onmiskenbaar
    { duur: 3.4, in: 'zweep', bron: ITU, bronStart: 2.0, camera: { zoom: [1.06, 1.0] }, geluid: [[1.2, 'pop', 0.8], [2.0, 'pop', 0.8]],
      teken: h => h.kin('Why this one? The pattern is *simple* and *unmistakable*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
        + morse(h, { y: 1000, schaal: 0.9 + 0.08 * Math.sin(h.t * 6), op: 1 })
        + (h.t > 1.2 ? `<g opacity="${h.klem((h.t - 1.2) / 0.2)}"><path d="M 210 1150 l 40 40 l 80 -90" fill="none" stroke="${h.K.groen}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/></g>` : '')
        + (h.t > 2.0 ? `<g opacity="${h.klem((h.t - 2.0) / 0.2)}"><path d="M 750 1150 l 40 40 l 80 -90" fill="none" stroke="${h.K.groen}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/></g>` : '') },
    // 6 · daarvoor: CQD van Marconi
    { duur: 3.6, in: 'op', bron: ITU, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.7, -0.4], [1.3, 'pop', 0.7, 0], [1.6, 'pop', 0.7, 0.4]],
      teken: h => {
        let s = h.kin('Before that, Marconi operators sent *CQD*: "CQ" for all stations, "D" for distress.', { y: 300, g: 78, t: h.t, start: 0.05 }).svg;
        ['C', 'Q', 'D'].forEach((l, i) => { const p = h.veer((h.t - 1.0 - i * 0.3) / 0.3); if (p <= 0) return; const x = 300 + i * 240;
          s += `<g filter="url(#schKlein)" transform="translate(${x} 1020) scale(${(0.5 + 0.5 * p).toFixed(3)}) translate(${-x} -1020)"><rect x="${x - 100}" y="900" width="200" height="240" rx="20" fill="${i === 2 ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5"/><text x="${x}" y="1065" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="170" fill="${i === 2 ? '#FFFFFF' : h.K.inkt}">${l}</text></g>`; });
        return s;
      } },
    // 7 · 15 april 1912: de Titanic, CQD en het nieuwe SOS door elkaar
    { duur: 4.0, in: 'masker', nacht: true, bron: ITU, bronStart: 2.6, camera: { zoom: [1.05, 1.0] },
      geluid: [[1.4, 'tik', 0.7], [1.6, 'tik', 0.7], [1.8, 'tik', 0.7], [2.3, 'tik', 0.7], [2.5, 'tik', 0.7], [2.7, 'tik', 0.7]],
      teken: h => h.kin('*15 April 1912*, the Titanic. At assistant operator Harold Bride\'s suggestion, CQD is mixed with the new *SOS*.', { y: 300, g: 74, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + sleutel(h, 540, 1050, Math.floor(h.t * 5) % 2 === 0 && h.t > 1.3)
        + `<text x="540" y="1240" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.geel}" opacity="${h.klem((h.t - 1.4) / 0.3).toFixed(3)}">CQD ... SOS ... CQD</text>` },
    // 8 · reading it as S-O-S is just the ezelsbruggetje; officieel tot 1998
    { duur: 3.8, in: 'zweep', bron: ITU, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [2.2] }, geluid: [[1.0, 'rol', 0.6], [2.2, 'klap', 0.7]],
      teken: h => {
        const k = h.zacht((h.t - 1.0) / 0.8);
        return h.kin('Reading it as the letters S-O-S is just a way to *remember* it.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg
          + morse(h, { y: 960, op: 1 - k, schaal: 1 - 0.3 * k }) + sos(h, { y: 960, op: k, schaal: 0.45 + 0.1 * k })
          + h.kin('Official until *1 January 1998*.', { y: 1180, g: 60, gewicht: 'regular', t: h.t, start: 2.1 }).svg;
      } },
    // 9 · slot: weer het patroon; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => morse(h, { y: MY })
        + h.kin('Not three letters. One pattern: *simple, unmistakable*.', { y: 300, g: 92, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
