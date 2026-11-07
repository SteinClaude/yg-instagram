// YS30 — The microwave oven started with a melted candy bar.
// Reeks C · Happy Accidents. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Lemelson-MIT, "Percy Spencer"; IEEE Spectrum (Amanda Davis, 2016), "A History
// of the Microwave Oven"; Linda Hall Library (W. B. Ashworth, 2019), "Percy Spencer"; Popular Mechanics (Matt Blitz,
// 2022, via Yahoo) voor de kleinzoon over de pindareep. Omstreden: welk snoep (de video noemt beide versies), het jaar
// van de vondst (de video noemt alleen de patentaanvraag van 8 okt 1945), de prijs van de eerste Radarange.
const LEM = 'Lemelson-MIT, "Percy Spencer"';
const IEEE = 'IEEE Spectrum (2016)';
const LH = 'Linda Hall Library (2019)';
const PM = 'Popular Mechanics (2022)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// magnetron-buis (eenvoudige koperen ring met vinnen); gloei = 0..1
const buis = (h, x = 540, y = 1000, gloei = 0, s = 1) => `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">`
  + (gloei > 0 ? [0, 1, 2].map(i => `<circle cx="${x}" cy="${y}" r="${(200 + i * 70 + ((h.t * 120) % 70)).toFixed(1)}" fill="none" stroke="${h.K.signaal}" stroke-width="8" opacity="${(gloei * (0.6 - i * 0.18)).toFixed(3)}"/>`).join('') : '')
  + Array.from({ length: 8 }, (_, i) => `<rect x="${x - 14}" y="${y - 200}" width="28" height="80" fill="#8F5A28" stroke="${h.K.inkt}" stroke-width="4" transform="rotate(${i * 45} ${x} ${y})"/>`).join('')
  + `<circle cx="${x}" cy="${y}" r="150" fill="#B87333" stroke="${h.K.inkt}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="62" fill="${h.K.inkt}"/></g>`;
// snoepreep in wikkel; smelt = 0..1
const reep = (h, x = 540, y = 1050, smelt = 0, s = 1) => { const zak = smelt * 70;
  return `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})"><path d="M ${x - 230} ${y - 70} L ${x + 230} ${y - 70} L ${x + 230} ${y + 70 + zak * 0.3} Q ${x} ${y + 70 + zak} ${x - 230} ${y + 70 + zak * 0.3} Z" fill="#5B3A24" stroke="${h.K.inkt}" stroke-width="5"/>`
    + `<rect x="${x - 120}" y="${y - 76}" width="240" height="${(152 + zak * 0.5).toFixed(1)}" fill="${h.K.signaal}"/><text x="${x}" y="${y + 18}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="50" fill="#FBF6EA">CANDY</text>`
    + (smelt > 0.2 ? [-170, 170].map(dx => `<path d="M ${x + dx} ${y + 70 + zak * 0.5} q 6 ${(30 * smelt).toFixed(1)} 0 ${(60 * smelt).toFixed(1)}" stroke="#5B3A24" stroke-width="20" stroke-linecap="round" fill="none"/>`).join('') : '') + '</g>'; };
// popcorn
const pops = (h, p) => Array.from({ length: 16 }, (_, i) => { const q = h.klem(p * 16 - i); if (q <= 0) return ''; const x = 230 + ((i * 7919) % 101) / 101 * 620, y = 760 + ((i * 4793) % 89) / 89 * 440 - h.veer(q) * 80;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.7 + 0.5 * q).toFixed(3)})"><circle cx="-16" cy="0" r="24" fill="#FBF3D6"/><circle cx="16" cy="-8" r="26" fill="#FBF3D6"/><circle cx="0" cy="18" r="22" fill="#FBF3D6"/><circle cx="2" cy="2" r="10" fill="#E8C66A"/></g>`; }).join('');
// ei; knal = 0..1
const ei = (h, x = 540, y = 1000, knal = 0) => knal <= 0 ? `<g filter="url(#sch)"><ellipse cx="${x}" cy="${y}" rx="120" ry="160" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="6"/></g>`
  : `<g filter="url(#sch)">` + Array.from({ length: 10 }, (_, i) => { const a = i / 10 * 2 * Math.PI, d = 60 + knal * 200; return `<path d="M ${(x + Math.cos(a) * d).toFixed(1)} ${(y + Math.sin(a) * d).toFixed(1)} l 60 16 l -24 56 z" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="4"/>`; }).join('')
    + `<circle cx="${x}" cy="${y}" r="${(60 + knal * 80).toFixed(1)}" fill="${h.K.geel}" opacity="${(1 - knal * 0.5).toFixed(3)}"/></g>`;
// grote kast (eerste magnetronoven), met poppetje voor de maat
const kast = (h, x = 540, y = 1240, p = 1) => { const hgt = 560 * p;
  return `<g filter="url(#sch)"><rect x="${x - 120}" y="${(y - hgt).toFixed(1)}" width="300" height="${hgt.toFixed(1)}" rx="12" fill="#8A8F98" stroke="${h.K.inkt}" stroke-width="6"/>`
    + (p > 0.9 ? `<rect x="${x - 90}" y="${y - 420}" width="240" height="160" rx="8" fill="#1B1E2B"/><circle cx="${x + 120}" cy="${y - 200}" r="16" fill="${h.K.signaal}"/>` : '')
    + `<circle cx="${x - 230}" cy="${y - 460}" r="40" fill="${h.K.inkt}"/><rect x="${x - 270}" y="${y - 410}" width="80" height="220" rx="36" fill="${h.K.inkt}"/><rect x="${x - 262}" y="${y - 200}" width="26" height="200" rx="12" fill="${h.K.inkt}"/><rect x="${x - 224}" y="${y - 200}" width="26" height="200" rx="12" fill="${h.K.inkt}"/></g>`; };

module.exports = {
  code: 'YS30',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-06-YS30-magnetron',
  nummer: 'No. 30',
  onderwerp: 'THE MICROWAVE OVEN',
  pakket: {
    dag: 'zondag 6 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'The microwave oven was discovered by a melted candy bar',
    intro: 'An engineer stood next to a magnetron and the candy bar in his pocket melted. Then he tried popcorn, and an egg.',
    feiten: ['Percy Spencer did not invent the magnetron himself, but he developed a system to mass produce it (Lemelson-MIT). A magnetron is a vacuum tube that produces microwave energy (IEEE Spectrum).',
      'Standing near a magnetron, he noticed that the candy bar in his pocket had started to melt (Lemelson-MIT: "chocolate bar"; Linda Hall Library and IEEE Spectrum: "candy bar").',
      'His grandson says the chocolate story is wrong: he always carried a peanut cluster bar (Popular Mechanics).',
      'He placed popcorn kernels near the magnetron and they popped all over his lab (IEEE Spectrum). Eggs exploded (Linda Hall Library).',
      'Spencer filed for a patent on October 8, 1945 (Lemelson-MIT).',
      'The first Radarange (1947) stood about 6 feet tall and weighed about 750 pounds (Lemelson-MIT).',
      'In 1967 the first Amana home countertop microwave oven sold for $495 (IEEE Spectrum).'],
    bronnen: [['Lemelson-MIT, "Percy Spencer"', 'https://lemelson.mit.edu/resources/percy-spencer'],
      ['Amanda Davis, "A Brief History of the Microwave Oven", IEEE Spectrum (May 2, 2016)', 'https://spectrum.ieee.org/a-history-of-the-microwave-oven'],
      ['William B. Ashworth Jr., "Percy Spencer", Scientist of the Day, Linda Hall Library (July 9, 2019)', 'https://www.lindahall.org/about/news/scientist-of-the-day/percy-spencer'],
      ['Matt Blitz, Popular Mechanics (October 20, 2022, via Yahoo News)', 'https://ca.news.yahoo.com/microwave-invented-accident-171703267.html'],
      ['Google Patents, US2495429, "Method of treating foodstuffs" (filed October 8, 1945)', 'https://patents.google.com/patent/US2495429A/en']],
    hashtags: '#Shorts #history #inventions #accidents',
    tags: 'microwave oven, microwave history, Percy Spencer, magnetron, melted candy bar, popcorn, Raytheon, Radarange, accidental inventions, history of everyday things, why things are the way they are, shorts',
    md: [['Lemelson-MIT, "Percy Spencer"', 'https://lemelson.mit.edu/resources/percy-spencer',
      ['"the chocolate bar in his pocket had started to melt"', '"Though Spencer did not invent the magnetron himself, he did develop a system to mass produce the machine."', '"filed for a patent on October 8, 1945"', 'Radarange 1947: "costing $3,000, weighing about 750 pounds and standing 6 feet tall"']],
      ['Amanda Davis, IEEE Spectrum (2 mei 2016)', 'https://spectrum.ieee.org/a-history-of-the-microwave-oven',
      ['"his candy bar heated up when he stood near a magnetron, a vacuum tube that produces microwave energy"', '"He placed popcorn kernels near the magnetron and watched as they sputtered, cracked, and popped all over his lab."', '"In 1967, the first Amana home microwave oven, a 110-volt countertop model, sold for $495"', '(IEEE noemt "Later in 1946" voor de patentaanvraag; dat botst met het patent zelf, 8 okt 1945: de video volgt het patent.)']],
      ['W. B. Ashworth Jr., Linda Hall Library (9 juli 2019)', 'https://www.lindahall.org/about/news/scientist-of-the-day/percy-spencer',
      ['"he was standing near an operating magnetron with a candy bar in his pocket, when he noticed that the candy had melted"', '"discovered that popcorn kernels popped, and eggs exploded"']],
      ['Matt Blitz, Popular Mechanics (20 okt 2022, via Yahoo)', 'https://ca.news.yahoo.com/microwave-invented-accident-171703267.html',
      ['kleinzoon Rod Spencer over het chocoladeverhaal: "he\'ll tell you that\'s dead wrong"', '"he would always carry a peanut cluster bar in his pocket"']],
      ['Google Patents US2495429, "Method of treating foodstuffs" (aangevraagd 8 okt 1945, verleend 24 jan 1950)', 'https://patents.google.com/patent/US2495429A/en',
      ['"My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof"']]],
    niet: '- Niet gezegd: het jaar van de vondst zelf (bronnen verschillen; de video noemt de patentaanvraag van 1945), de prijs van de eerste Radarange ($3.000 volgens Lemelson-MIT, $5.000 volgens IEEE), en dat het ei in iemands gezicht ontplofte (alleen Popular Mechanics). Buis, reep (geen merk), popcorn, ei, kast en poppetje zijn een eigen tekening; het poppetje is geen portret van Spencer.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.6, stem: "It was a mistake. A candy bar melted in an engineer's pocket.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => reep(h, 540, 1020, h.klem((h.t - 1.0) / 2.0)) + h.kin('It was a *mistake*. A candy bar *melted*.', { y: 300, g: 104, t: h.t, start: 0.4 }).svg },
    // 2 · Percy Spencer en de magnetron
    { duur: 4.2, stem: "Percy Spencer worked with magnetrons: tubes that produce microwave energy.", in: 'zweep', bron: IEEE, bronStart: 2.6, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'stijg', 0.5]],
      teken: h => buis(h, 540, 1000, h.klem((h.t - 1.4) / 0.8), 0.95) + h.kin('*Percy Spencer* worked with *magnetrons*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 3 · hij vond de buis niet uit
    { duur: 3.4, stem: "He didn't invent the tube. He found a way to mass produce it.", in: 'op', bron: LEM, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.4], [1.4, 'pop', 0.4], [1.8, 'pop', 0.4]],
      teken: h => [0, 1, 2].map(i => buis(h, 260 + i * 280, 1000, 0, 0.42 * h.veer(h.klem((h.t - 0.8 - i * 0.4) / 0.4)))).join('') + h.kin('He didn\'t invent it. He found a way to *mass produce* it.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg },
    // 4 · de reep smelt
    { duur: 4.0, stem: "Standing near one, he noticed the candy bar in his pocket had started to melt.", in: 'flits', bron: LH, bronStart: 2.6, camera: { zoom: [1, 1.06], schud: [2.0, 3.0] }, geluid: [[1.0, 'stijg', 0.5]],
      teken: h => buis(h, 540, 820, 0.8, 0.55) + reep(h, 540, 1150, h.klem((h.t - 1.0) / 2.4), 0.8) + h.kin('The candy bar in his pocket *melted*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 5 · chocolade of pinda?
    { duur: 3.8, stem: "Chocolate, says one story. A peanut bar, says his grandson.", in: 'masker', nacht: true, bron: PM, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4]],
      teken: h => groot(h, '?', 1020, 300, h.K.geel) + h.kin('*Chocolate*, says one story. A *peanut* bar, says his grandson.', { y: 320, g: 86, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 6 · popcorn
    { duur: 3.6, stem: "He tried popcorn kernels. They popped all over his lab.", in: 'zweep', bron: IEEE, bronStart: 2.2, camera: { zoom: [1, 1.06], schud: [1.2, 2.6] }, geluid: [[1.2, 'pop', 0.6], [1.5, 'pop', 0.6], [1.8, 'pop', 0.6], [2.1, 'pop', 0.6], [2.4, 'pop', 0.6]],
      teken: h => pops(h, h.klem((h.t - 1.1) / 1.6)) + h.kin('Popcorn kernels *popped* all over his lab.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 7 · een ei
    { duur: 3.0, stem: "Then an egg. It exploded.", in: 'op', bron: LH, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.4], schud: [1.4] }, geluid: [[1.4, 'boem', 0.9], [1.4, 'klap', 0.8]],
      teken: h => ei(h, 540, 960, h.zacht((h.t - 1.4) / 0.5)) + h.kin('Then an egg. It *exploded*.', { y: 300, g: 116, t: h.t, start: 0.05 }).svg },
    // 8 · patent 1945
    { duur: 3.4, stem: "October 8, 1945: a patent for cooking food with microwaves.", in: 'zweep', bron: LEM, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1945', 900, 280) + h.kin('A *patent* for cooking with microwaves.', { y: 320, g: 96, t: h.t, start: 0.45 }).svg },
    // 9 · de eerste oven: 6 voet, 750 pond
    { duur: 4.2, stem: "The first microwave oven, in 1947, stood about six feet tall, and weighed about 750 pounds.", in: 'zweep', bron: LEM, bronStart: 2.8, camera: { zoom: [1, 1.04], stoot: [1.6] }, geluid: [[1.0, 'stijg', 0.5], [1.6, 'boem', 0.6]],
      teken: h => kast(h, 600, 1250, h.zacht((h.t - 0.6) / 1.0)) + h.kin('*1947*: about *6 feet* tall, about *750 pounds*.', { y: 290, g: 92, t: h.t, start: 0.05 }).svg },
    // 10 · thuis: 1967
    { duur: 3.6, stem: "In 1967, a countertop model for the home sold for 495 dollars.", in: 'op', bron: IEEE, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.2] }, geluid: [[1.2, 'ding', 0.6]],
      teken: h => groot(h, '1967', 900, 260) + h.kin('A *countertop* model for the home.', { y: 320, g: 100, t: h.t, start: 0.45 }).svg },
    // 11 · slot
    { duur: 3.0, stem: "A melted candy bar started it.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => reep(h, 540, 1000, 1, 0.9)
        + h.kin('A *melted candy bar* started it.', { y: 300, g: 110, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
