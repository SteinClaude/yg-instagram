// YS18 — The barcode started as dots and dashes drawn in sand.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks B · Who Decided?
// Bron (gelezen 4 nov 2026): WYSO (NPR-zender, Ohio), "50 years ago, the first retail barcode was scanned at an Ohio
// grocery store" (Renee Wilde, 25 juni 2024); daarin het citaat van Joe Woodland uit een Smithsonian-artikel. Elke bewering
// staat daarin; zie pakketten/<map>/bron/bronnen.md. Niet gezegd: de exacte dag en tijd, de prijs, de naam van de kassière.
const WYSO = 'WYSO (NPR, Ohio), "50 years ago, the first retail barcode was scanned…" (2024)';

// streepjescode; p = 0..1 hoeveel streepjes er staan
const code = (h, x, y, { w = 640, hh = 340, p = 1, schaal = 1, op = 1 } = {}) => {
  const patroon = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2];
  const tot = patroon.reduce((a, b) => a + b, 0) * 2, e = w / tot;
  let s = `<rect x="${x - w / 2 - 40}" y="${y - hh / 2 - 30}" width="${w + 80}" height="${hh + 100}" rx="12" fill="#FFFFFF"/>`, cx = x - w / 2;
  patroon.forEach((b, i) => { if (i / patroon.length < p) s += `<rect x="${cx.toFixed(1)}" y="${y - hh / 2}" width="${(b * e).toFixed(1)}" height="${hh}" fill="${h.K.inkt}"/>`; cx += b * e * 2; });
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})">${s}</g>`;
};
const zand = (h) => `<rect x="0" y="830" width="1080" height="550" fill="#E9D8A6"/>` + Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1080}" cy="${850 + (i * 89) % 510}" r="3" fill="#CDB57A"/>`).join('');
// vier vingersporen: rek = 0..1 (punt -> lijn), rond = 0..1 (lijnen -> cirkels)
const sporen = (h, { rek = 0, rond = 0, x = 540, y = 1010 } = {}) => {
  let s = '';
  for (let i = 0; i < 4; i++) {
    const breed = [26, 12, 20, 12][i], yy = y - 120 + i * 80;
    if (rond <= 0) { const len = 10 + rek * 520; s += `<rect x="${(x - len / 2).toFixed(1)}" y="${yy - breed / 2}" width="${len.toFixed(1)}" height="${breed}" rx="${breed / 2}" fill="#8C7440"/>`; }
    else { const r = 40 + i * 60; s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8C7440" stroke-width="${breed}" opacity="${rond.toFixed(3)}"/>`; }
  }
  return s;
};
const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };

module.exports = {
  code: 'YS18',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-26-YS18-streepjescode',
  nummer: 'No. 18',
  onderwerp: 'THE BARCODE',
  pakket: {
    dag: 'donderdag 26 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'The barcode started as dots and dashes drawn in sand',
    intro: 'On a beach in Miami, Joe Woodland was thinking about dots and dashes. He pulled four fingers through the sand and had four lines.',
    feiten: ['Joe Woodland got the idea in a deck chair on a beach in Miami. In his words: "I remember I was thinking about dots and dashes when I poked my four fingers into the sand."',
      '"I pulled my hand toward me and I had four lines." Wide lines and narrow lines, instead of dots and dashes.',
      'Seconds later he swept his fingers round into a circle: the first barcode looked more like a bullseye.',
      'Woodland and his former classmate Bernard Silver refined the concept and applied for a patent in 1949.',
      'The bullseye tended to smear in the direction of the paper when running through the register.',
      'At IBM, the rectangular UPC code we use today was developed; it had to be readable from any direction at any speed.',
      'Fifty years before June 2024 (so in 1974), a pack of Wrigley\'s Juicy Fruit gum at Marsh\'s grocery store in Troy, Ohio, became the first retail item scanned.'],
    bronnen: [['WYSO (NPR member station), "50 years ago, the first retail barcode was scanned at an Ohio grocery store" (Renee Wilde, June 25, 2024)', 'https://www.wyso.org/news/2024-06-25/50-years-ago-the-first-retail-barcode-was-scanned-at-an-ohio-grocery-store']],
    hashtags: '#Shorts #history #inventions #technology',
    tags: 'barcode, UPC, barcode history, Joe Woodland, Morse code, bullseye barcode, first barcode scan, Troy Ohio 1974, history of everyday things, why things are the way they are, shorts',
    md: [['WYSO (NPR-zender, Ohio), "50 years ago, the first retail barcode was scanned at an Ohio grocery store" (Renee Wilde, 25 juni 2024)', 'https://www.wyso.org/news/2024-06-25/50-years-ago-the-first-retail-barcode-was-scanned-at-an-ohio-grocery-store',
      ['idee in een strandstoel op een strand in Miami', 'Woodland (uit een Smithsonian-artikel): "I remember I was thinking about dots and dashes when I poked my four fingers into the sand"', '"I pulled my hand toward me and I had four lines"; "they could be wide lines and narrow lines, instead of dots and dashes"', '"I took my four fingers—they were still in the sand—and I swept them round into a circle"; "That first barcode looked more like a bullseye."', '"Woodland and his former classmate Bernard Silver, refined the concept and applied for a patent in 1949."', '"the bullseye design tended to smear in the direction of the paper when running through the register"', '"George Lauer with IBM" ontwikkelde de rechthoekige UPC; eis: leesbaar "from any direction at any speed"', '"Fifty years ago at Marsh\'s grocery store in Troy" (artikel van juni 2024 → 1974); "a pack of Wrigley\'s Juicy Fruit gum became the first retail item scanned"']]],
    niet: '- De plan-bron (GS1-persbericht) gaf op 4 nov een 403; daarom WYSO. Niet gezegd: de exacte dag en tijd (26 juni, 8:01 staat niet in deze bron), de prijs (bronnen elders spreken elkaar tegen), de naam van de kassière, en de naam van de IBM-ingenieur (de bron schrijft "Lauer"; elders "Laurer"): de video zegt alleen "at IBM". Zand, sporen en streepjescode zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK: een streepjescode slaat neer
    { duur: 3.2, stem: "The barcode started as dots and dashes, drawn in sand.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [0.9, 'ding', 0.4]],
      teken: h => { const p = h.klem(h.t / 0.3);
        return code(h, 540, 1040, { schaal: 1.8 - 0.8 * p * p, op: h.klem(h.t / 0.08) })
          + h.kin('The barcode started as *dots and dashes*, drawn in sand.', { y: 300, g: 96, t: h.t, start: 0.4 }).svg; } },
    // 2 · een strand in Miami: punten en strepen
    { duur: 3.6, stem: "A beach in Miami. Joe Woodland is thinking about dots and dashes.", in: 'zweep', bron: WYSO, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [0, 1, 2, 3, 4, 5].map(i => [1.0 + i * 0.18, 'tik', 0.7]),
      teken: h => zand(h) + h.kin('A beach in Miami. Joe Woodland is thinking about *dots and dashes*.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + ['.', '-', '.', '.', '-', '-'].map((d, i) => h.t < 1.0 + i * 0.18 ? '' : `<rect x="${250 + i * 100}" y="1020" width="${d === '.' ? 30 : 80}" height="30" rx="15" fill="#8C7440"/>`).join('') },
    // 3 · vier vingers, naar zich toe getrokken: vier lijnen
    { duur: 3.8, stem: "He pokes four fingers into the sand, pulls them toward him, and has four lines.", in: 'op', bron: WYSO, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [2.0] }, geluid: [[0.9, 'pop', 0.7], [1.2, 'rol', 0.6], [2.0, 'klap', 0.6]],
      teken: h => zand(h) + h.kin('He pokes four fingers into the sand, pulls them toward him… and has *four lines*.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
        + (h.t > 0.8 ? sporen(h, { rek: h.zacht((h.t - 1.2) / 0.8) }) : '') },
    // 4 · brede en smalle lijnen in plaats van punten en strepen
    { duur: 3.6, stem: "Wide lines and narrow lines, instead of dots and dashes.", in: 'flits', bron: WYSO, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[1.4, 'ding', 0.5]],
      teken: h => zand(h) + h.kin('"Wide lines and narrow lines, instead of *dots and dashes*."', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + sporen(h, { rek: 1 }) },
    // 5 · dan rondgeveegd tot een cirkel: een schietschijf
    { duur: 3.6, stem: "Then he sweeps them round into a circle. The first barcode was a bullseye.", in: 'zweep', bron: WYSO, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.9] }, geluid: [[1.0, 'stijg', 0.5], [1.9, 'klap', 0.7]],
      teken: h => { const r = h.zacht((h.t - 1.0) / 0.9);
        return zand(h) + h.kin('Then he sweeps them round into a circle. The first barcode was a *bullseye*.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg
          + sporen(h, { rek: 1 - r, rond: r > 0.5 ? (r - 0.5) * 2 : 0 }) + (r <= 0.5 ? '' : ''); } },
    // 6 · 1949: patent met Bernard Silver
    { duur: 3.6, stem: "1949. With his former classmate Bernard Silver, he applies for a patent.", in: 'op', bron: WYSO, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1949') + h.kin('With his former classmate *Bernard Silver*, he applies for a patent.', { y: 830, g: 76, t: h.t, start: 0.45 }).svg },
    // 7 · maar de schietschijf smeerde uit bij het drukken
    { duur: 3.6, stem: "But the bullseye tended to smear as the paper ran through.", in: 'zweep', bron: WYSO, bronStart: 2.2, camera: { zoom: [1, 1.05], schud: [1.4] }, geluid: [[1.2, 'rol', 0.6]],
      teken: h => { const sm = h.zacht((h.t - 1.0) / 0.9);
        let s = h.kin('But the bullseye tended to *smear* as the paper ran through.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg;
        for (let k = 0; k < 6; k++) s += [0, 1, 2, 3].map(i => `<circle cx="${540 + k * 22 * sm}" cy="1030" r="${50 + i * 55}" fill="none" stroke="${h.K.inkt}" stroke-width="${[22, 10, 18, 10][i]}" opacity="${(k === 0 ? 1 : 0.18 * sm).toFixed(3)}"/>`).join('');
        return s; } },
    // 8 · bij IBM werd het een rechthoek, leesbaar uit elke richting
    { duur: 3.8, stem: "At I-B-M it became a rectangle, readable from any direction, at any speed.", in: 'op', bron: WYSO, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [1.8] }, geluid: [[1.0, 'rol', 0.5], [1.8, 'klap', 0.7], [1.8, 'ding', 0.5]],
      teken: h => h.kin('At *IBM* it became a rectangle, readable from *any direction*, at any speed.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg
        + code(h, 540, 1040, { p: h.klem((h.t - 0.9) / 0.9), schaal: 0.9 }) },
    // 9 · 1974, Troy, Ohio: een pakje kauwgom als eerste gescand
    { duur: 3.8, stem: "1974. A grocery store in Troy, Ohio. The first retail item ever scanned: a pack of chewing gum.", in: 'masker', nacht: true, bron: WYSO, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[1.6, 'tik', 0.9], [1.7, 'ding', 0.7]],
      teken: h => h.kin('*1974*, a grocery store in Troy, Ohio. The first retail item ever scanned: a pack of *chewing gum*.', { y: 330, g: 82, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + `<g opacity="${h.klem((h.t - 1.2) / 0.3).toFixed(3)}" filter="url(#sch)"><rect x="330" y="960" width="420" height="200" rx="16" fill="${h.K.geel}"/><rect x="560" y="1000" width="150" height="120" fill="#FFFFFF"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${572 + i * 18}" y="1010" width="${i % 2 ? 6 : 10}" height="100" fill="${h.K.inkt}"/>`).join('')}</g>`
        + (h.t > 1.6 ? `<line x1="250" y1="1060" x2="830" y2="1060" stroke="${h.K.signaal}" stroke-width="6" opacity="${(1 - h.klem((h.t - 1.9) / 0.4)).toFixed(3)}"/>` : '') },
    // 10 · slot: de streepjescode; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "Dots and dashes, stretched into lines.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => code(h, 540, 1040)
        + h.kin('Dots and dashes, *stretched into lines*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
