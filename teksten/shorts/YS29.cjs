// YS29 — Why phones put 1-2-3 on top and calculators 7-8-9.
// Reeks A · Signs & Symbols. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): R. L. Deininger, "Human Factors Engineering Studies of the Design and Use of
// Pushbutton Telephone Sets", Bell System Technical Journal 39(4), juli 1960 (scan, volledig gelezen); Boston Globe,
// overlijdensbericht John E. Karlin (feb 2013). Niet gezegd: waarom rekenmachines 7-8-9 bovenaan hebben (geen
// betrouwbare bron), en de populaire verhalen over te snel typen of de letters ABC.
const BSTJ = 'R. L. Deininger, Bell System Technical Journal (1960)';
const BG = 'Boston Globe, John E. Karlin obituary (2013)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
const TELEFOON = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']];
const REKEN = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['0', '', '']];
// toetsenblok; licht = toetsen die oplichten; s = schaal
const blok = (h, x, y, rijen, { s = 1, licht = [], label = '', op = 1 } = {}) => { let r = `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) scale(${s.toFixed(3)})"><rect x="-190" y="-270" width="380" height="530" rx="30" fill="${h.K.inkt}"/>`;
  rijen.forEach((rij, j) => rij.forEach((c, i) => { if (c === '') return; const bx = -150 + i * 105, by = -235 + j * 120; const aan = licht.includes(c);
    r += `<rect x="${bx}" y="${by}" width="90" height="100" rx="14" fill="${aan ? h.K.signaal : '#FBF6EA'}"/><text x="${bx + 45}" y="${by + 70}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="${aan ? '#FBF6EA' : h.K.inkt}">${c}</text>`; }));
  if (label) r += `<text x="0" y="330" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${h.K.inkt}">${label}</text>`;
  return r + '</g>'; };
// zestien kleine indelingen (eigen schets: rasters, cirkels, rijen)
const zestien = (h, p) => Array.from({ length: 16 }, (_, i) => { const q = h.klem(p * 16 - i); if (q <= 0) return ''; const cx = 210 + (i % 4) * 220, cy = 700 + Math.floor(i / 4) * 160;
  let s = `<g opacity="${q.toFixed(3)}"><rect x="${cx - 90}" y="${cy - 65}" width="180" height="130" rx="12" fill="#E8E2CF" stroke="${h.K.inkt}" stroke-width="3"/>`;
  const vorm = i % 4; for (let k = 0; k < 10; k++) { let dx, dy;
    if (vorm === 0) { dx = (k % 3) * 34 - 34; dy = Math.floor(k / 3) * 26 - 40; if (k === 9) dx = 0; }
    else if (vorm === 1) { const a = k / 10 * 2 * Math.PI; dx = Math.sin(a) * 48; dy = -Math.cos(a) * 48; }
    else if (vorm === 2) { dx = (k % 5) * 30 - 60; dy = Math.floor(k / 5) * 40 - 20; }
    else { dx = (k % 2) * 40 - 20; dy = Math.floor(k / 2) * 22 - 50; }
    s += `<circle cx="${(cx + dx).toFixed(1)}" cy="${(cy + dy).toFixed(1)}" r="9" fill="${h.K.inkt}"/>`; }
  return s + '</g>'; }).join('');
// tijdbalken
const balk = (h, y, lengte, tekst, kleur) => `<g><rect x="140" y="${y - 50}" width="${lengte.toFixed(1)}" height="90" rx="12" fill="${kleur}"/><text x="${150 + lengte}" y="${y + 20}" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="${h.K.inkt}">${tekst}</text></g>`;

module.exports = {
  code: 'YS29',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-05-YS29-toetsenblok',
  nummer: 'No. 29',
  onderwerp: 'THE KEYPAD',
  pakket: {
    dag: 'zaterdag 5 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why does a phone keypad start with 1-2-3, but a calculator with 7-8-9?',
    intro: 'Before the push-button phone, Bell engineers tested sixteen keypad layouts. The adding-machine layout lost, by a fraction of a second.',
    feiten: ['A Bell System Technical Journal study (R. L. Deininger, July 1960) compared keypad layouts for the push-button telephone. "Sixteen different arrangements were selected for the first part of this study."',
      'The arrangement frequently found in ten-key adding machines "was not the best of the first three arrangements compared."',
      'The same geometric configuration with a different numbering scheme was superior in keying performance, but the differences were small: 5.08 seconds against 4.92 seconds.',
      'The telephone keypad got "1-2-3" on the top row instead of the bottom, as on a calculator; it sprang from research conducted or overseen by Bell Labs psychologist John E. Karlin (Boston Globe).',
      'The study does not say why adding machines put 7-8-9 on top.'],
    bronnen: [['R. L. Deininger, "Human Factors Engineering Studies of the Design and Use of Pushbutton Telephone Sets", Bell System Technical Journal 39(4), July 1960 (scan)', 'https://www.vcalc.net/Documents/touchtone_hf.pdf'],
      ['Boston Globe, "John Karlin, industrial psychologist for Bell Labs" (February 10, 2013)', 'https://www.bostonglobe.com/metro/obituaries/2013/02/10/john-karlin-industrial-psychologist-for-bell-labs/jfucVP0VRjWuDmV1zmp7pJ/story.html']],
    hashtags: '#Shorts #history #design #telephone',
    tags: 'phone keypad, calculator keypad, why is the phone keypad upside down, 123 vs 789, Bell Labs, touch tone, push button telephone, John Karlin, 1960, history of everyday things, why things are the way they are, shorts',
    md: [['R. L. Deininger, Bell System Technical Journal 39(4), juli 1960, p. 995–1012 (scan, volledige tekst gelezen)', 'https://www.vcalc.net/Documents/touchtone_hf.pdf',
      ['"Sixteen different arrangements were selected for the first part of this study."', '"Notice that the arrangement frequently found in ten-key adding machines (arrangement I-A, Fig. 3) was not the best of the first three arrangements compared."', '"the same geometric configuration with a different numbering scheme (arrangement IV-A) was superior in keying performance"', '"However, the performance differences between the two were small: arrangement I-A had an average keying time of 5.08 seconds, and arrangement IV-A had an average of 4.92 seconds."']],
      ['Boston Globe, overlijdensbericht John E. Karlin (10 feb 2013)', 'https://www.bostonglobe.com/metro/obituaries/2013/02/10/john-karlin-industrial-psychologist-for-bell-labs/jfucVP0VRjWuDmV1zmp7pJ/story.html',
      ['het toetsenblok met "1-2-3" "on the top row instead of the bottom, as on a calculator"', '"all sprang from research conducted or overseen by Mr. Karlin"']]],
    niet: '- Niet gezegd: waarom rekenmachines 7-8-9 bovenaan hebben (geen betrouwbare bron), dat 1-2-3 "veel" sneller was (het verschil was 0,16 s), en verhalen over te snel typen of de letters ABC (alleen fora). Dat indeling I-A 7-8-9 bovenaan heeft, staat in Fig. 3 van Deininger (het rekenmachine-blok); de video toont het als "adding machine". De zestien schetsjes zijn een eigen illustratie, geen kopie van Fig. 3. Toetsenblokken zijn een eigen tekening, geen merk.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 4.0, stem: "Your phone puts 1, 2, 3 on top. Your calculator puts 7, 8, 9 on top. Why?", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.2, 'tik', 0.5], [2.6, 'tik', 0.5]],
      teken: h => blok(h, 300, 1000, TELEFOON, { s: 0.8, licht: h.t > 1.0 ? ['1', '2', '3'] : [], label: 'PHONE' }) + blok(h, 780, 1000, REKEN, { s: 0.8, licht: h.t > 2.4 ? ['7', '8', '9'] : [], label: 'CALCULATOR' }) + h.kin('Phone: *1-2-3* on top. Calculator: *7-8-9*.', { y: 290, g: 92, t: h.t, start: 0.4 }).svg },
    // 2 · 1960, Bell
    { duur: 3.6, stem: "1960. Bell engineers prepare a new push-button telephone.", in: 'zweep', bron: BSTJ, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1960', 900, 280) + h.kin('Bell engineers test a *push-button* phone.', { y: 320, g: 96, t: h.t, start: 0.45 }).svg },
    // 3 · zestien indelingen
    { duur: 3.4, stem: "They tested sixteen different arrangements of the keys.", in: 'op', bron: BSTJ, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'pop', 0.4], [1.4, 'pop', 0.4], [2.0, 'pop', 0.4]],
      teken: h => zestien(h, h.klem((h.t - 0.4) / 2.2)) + h.kin('*16* different arrangements.', { y: 320, g: 110, t: h.t, start: 0.05 }).svg },
    // 4 · een ervan: de rekenmachine-indeling
    { duur: 3.6, stem: "One was the layout found on adding machines, with seven, eight, nine on top.", in: 'flits', bron: BSTJ, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.6, 'tik', 0.5]],
      teken: h => blok(h, 540, 930, REKEN, { s: 0.9, licht: h.t > 1.6 ? ['7', '8', '9'] : [], label: 'ADDING MACHINE' }) + h.kin('One: the *adding machine* layout.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 5 · niet de beste
    { duur: 3.0, stem: "It was not the best of its group.", in: 'op', bron: BSTJ, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.0] }, geluid: [[1.0, 'boem', 0.6]],
      teken: h => blok(h, 540, 930, REKEN, { s: 0.9, label: 'ADDING MACHINE', op: 1 - 0.5 * h.klem((h.t - 0.9) / 0.4) }) + h.kin('It was *not the best*.', { y: 320, g: 116, t: h.t, start: 0.05 }).svg },
    // 6 · zelfde vorm, 1-2-3 boven, sneller
    { duur: 3.8, stem: "The same shape, numbered with 1, 2, 3 on top, was faster to key.", in: 'zweep', bron: BSTJ, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.6, 'ding', 0.6]],
      teken: h => blok(h, 540, 930, [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['0', '', '']], { s: 0.9, licht: h.t > 1.4 ? ['1', '2', '3'] : [] }) + h.kin('Same shape, *1-2-3* on top: *faster*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 7 · maar maar een beetje
    { duur: 4.0, stem: "But only a little. 4.92 seconds, against 5.08.", in: 'masker', bron: BSTJ, bronStart: 2.4, camera: { zoom: [1, 1.04] }, geluid: [[1.2, 'rol', 0.4], [2.2, 'rol', 0.4]],
      teken: h => balk(h, 880, 600 * h.zacht((h.t - 0.8) / 1.2) * 0.968, '4.92 s', h.K.signaal) + balk(h, 1060, 600 * h.zacht((h.t - 1.4) / 1.2), '5.08 s', '#8A8F98') + h.kin('Only a *little* faster.', { y: 320, g: 110, t: h.t, start: 0.05 }).svg },
    // 8 · de telefoon kreeg 1-2-3
    { duur: 3.8, stem: "So the push-button phone got 1, 2, 3 on top. Not at the bottom, as on a calculator.", in: 'zweep', bron: BG, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [0.9] }, geluid: [[0.9, 'klap', 0.7]],
      teken: h => blok(h, 540, 930, TELEFOON, { s: 0.9, licht: ['1', '2', '3'], label: 'PHONE' }) + h.kin('The phone got *1-2-3 on top*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    // 9 · waarom de rekenmachine 7-8-9 heeft
    { duur: 3.6, stem: "And why adding machines had seven on top? The study doesn't say.", in: 'masker', nacht: true, bron: BSTJ, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4]],
      teken: h => groot(h, '7 8 9 ?', 1000, 170, h.K.geel) + h.kin('Why adding machines had *7-8-9* on top? The study *doesn\'t say*.', { y: 320, g: 84, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 10 · slot
    { duur: 3.2, stem: "Same ten digits. Two different answers.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => blok(h, 300, 1000, TELEFOON, { s: 0.8 }) + blok(h, 780, 1000, REKEN, { s: 0.8 })
        + h.kin('Same *ten digits*. Two different answers.', { y: 300, g: 104, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
