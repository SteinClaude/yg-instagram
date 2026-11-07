// YS24 — The first shoppers refused to use shopping carts.
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Curt Wohleber, "The Shopping Cart", Invention & Technology 20(1), 2004; CBS News,
// "Almanac: The first shopping cart" (2017); NPR (Mallory Yu), "The history of the shopping cart" (2025, via HPPR);
// Encyclopedia of Oklahoma History and Culture, "Goldman, Sylvan Nathan". Smithsonian (plan-bron) niet nodig.
// Niet gezegd: "models" (NPR) of "men and women of assorted ages" (I&T): de video zegt "people".
const IT = 'Invention & Technology, "The Shopping Cart" (2004)';
const CBS = 'CBS News, "Almanac: The first shopping cart" (2017)';
const NPR = 'NPR, "The history of the shopping cart" (2025)';
const OK = 'Encyclopedia of Oklahoma History and Culture';

const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// klapstoel; wielen = 0..1, manden = 0..2
const stoel = (h, x = 540, y = 1060, { wielen = 0, manden = 0, op = 1 } = {}) => {
  let s = `<g opacity="${op.toFixed(3)}" filter="url(#sch)"><line x1="${x - 130}" y1="${y - 300}" x2="${x - 130}" y2="${y + 200}" stroke="${h.K.inkt}" stroke-width="16"/><line x1="${x + 130}" y1="${y - 300}" x2="${x + 130}" y2="${y + 200}" stroke="${h.K.inkt}" stroke-width="16"/>`
    + `<rect x="${x - 150}" y="${y - 320}" width="300" height="90" rx="10" fill="#B07A4A"/><rect x="${x - 150}" y="${y - 20}" width="300" height="30" rx="8" fill="#B07A4A"/>`;
  const mand = (my, p) => p <= 0 ? '' : `<g opacity="${h.klem(p).toFixed(3)}" transform="translate(0 ${((1 - h.klem(p)) * -60).toFixed(1)})"><rect x="${x - 170}" y="${my}" width="340" height="150" rx="8" fill="none" stroke="#7D8590" stroke-width="8"/>`
    + Array.from({ length: 7 }, (_, i) => `<line x1="${x - 170 + i * 56}" y1="${my}" x2="${x - 170 + i * 56}" y2="${my + 150}" stroke="#7D8590" stroke-width="5"/>`).join('')
    + `<line x1="${x - 170}" y1="${my + 75}" x2="${x + 170}" y2="${my + 75}" stroke="#7D8590" stroke-width="5"/></g>`;
  s += mand(y - 170, manden) + mand(y + 30, manden - 1);
  if (wielen > 0) s += [-1, 1].map(k => `<circle cx="${x + k * 130}" cy="${y + 225}" r="${(34 * wielen).toFixed(1)}" fill="${h.K.inkt}"/><circle cx="${x + k * 130}" cy="${y + 225}" r="${(10 * wielen).toFixed(1)}" fill="${h.K.papier}"/>`).join('');
  return s + '</g>';
};
// winkelschap
const schap = (h) => `<g opacity="0.55">${[0, 1, 2].map(j => `<rect x="80" y="${760 + j * 170}" width="920" height="14" fill="#B5AD9C"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${100 + i * 100}" y="${670 + j * 170}" width="70" height="90" rx="6" fill="${['#D9432B', '#F2C230', '#2F7D5B', '#6E6A62'][(i + j) % 4]}"/>`).join('')).join('')}</g>`;
// poppetje (eenvoudige vorm, geen echt persoon)
const pop = (h, x, y, kleur) => `<g filter="url(#sch)"><circle cx="${x}" cy="${y - 170}" r="42" fill="${kleur}"/><rect x="${x - 45}" y="${y - 120}" width="90" height="190" rx="40" fill="${kleur}"/><rect x="${x - 35}" y="${y + 60}" width="26" height="110" rx="12" fill="${kleur}"/><rect x="${x + 9}" y="${y + 60}" width="26" height="110" rx="12" fill="${kleur}"/></g>`;
// nestbare karren: in elkaar geschoven
const nest = (h, x = 540, y = 1100, p = 1) => Array.from({ length: 4 }, (_, i) => { const dx = (i - 1.5) * (190 - 140 * p);
  return `<g transform="translate(${dx.toFixed(1)} 0)" filter="url(#sch)"><path d="M ${x - 170} ${y - 170} L ${x + 150} ${y - 170} L ${x + 110} ${y + 40} L ${x - 130} ${y + 40} Z" fill="none" stroke="#7D8590" stroke-width="10"/>`
    + `<line x1="${x - 170}" y1="${y - 170}" x2="${x - 230}" y2="${y - 230}" stroke="${h.K.inkt}" stroke-width="10"/><circle cx="${x - 110}" cy="${y + 90}" r="24" fill="${h.K.inkt}"/><circle cx="${x + 90}" cy="${y + 90}" r="24" fill="${h.K.inkt}"/></g>`; }).join('');

module.exports = {
  code: 'YS24',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-30-YS24-winkelwagen',
  nummer: 'No. 24',
  onderwerp: 'THE SHOPPING CART',
  pakket: {
    dag: 'maandag 30 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'The first shoppers refused to use shopping carts',
    intro: 'In 1937 an Oklahoma City grocer put wheels and baskets on a folding chair. Nobody wanted to push it, so he hired people to pretend.',
    feiten: ['Sylvan Goldman owned the Humpty Dumpty supermarket chain in Oklahoma City.',
      'His shopping cart started from a folding chair: a basket on the seat and wheels on the legs. The final prototype carried two wire baskets.',
      'On June 4, 1937, Goldman rolled out the world\'s first shopping cart at his Humpty Dumpty stores (CBS News).',
      'No one wanted them. Goldman hired people to pose as customers and use the carts.',
      'He patented the cart and set up the Folding Basket Carrier Company to make it.',
      'Orla Watson filed for a nesting-cart patent in 1946; in 1949 Goldman agreed to license Watson\'s patent.'],
    bronnen: [['Curt Wohleber, "The Shopping Cart", Invention & Technology 20(1), Summer 2004', 'https://www.inventionandtech.com/node/86507'],
      ['CBS News, "Almanac: The first shopping cart" (June 4, 2017)', 'https://www.cbsnews.com/news/almanac-the-first-shopping-cart'],
      ['NPR (Mallory Yu), "The history of the shopping cart" (March 29, 2025, via HPPR)', 'https://www.hppr.org/2025-03-29/the-history-of-the-shopping-cart'],
      ['Encyclopedia of Oklahoma History and Culture, "Goldman, Sylvan Nathan (1898–1984)"', 'https://www.okhistory.org/publications/enc/entry?entry=GO004']],
    hashtags: '#Shorts #history #inventions #supermarket',
    tags: 'shopping cart, shopping trolley, shopping cart history, Sylvan Goldman, Humpty Dumpty, Oklahoma City 1937, folding chair, Orla Watson, history of everyday things, why things are the way they are, shorts',
    md: [['Curt Wohleber, "The Shopping Cart", Invention & Technology 20(1), zomer 2004', 'https://www.inventionandtech.com/node/86507',
      ['Goldman bezat "a chain of Humpty Dumpty supermarkets based in Oklahoma City"; het idee kwam van een klapstoel', 'prototype "designed to carry two 19-by13-by-9-inch wire baskets"; karren ingevoerd "in the summer of 1937"', 'Goldman "hired men and women of assorted ages to pose as customers and use the carts."', 'Orla Watson vroeg in sept 1946 een patent aan op een nestbare kar; in 1949 "agreed to license Watson\'s patent"']],
      ['CBS News, "Almanac: The first shopping cart" (4 juni 2017)', 'https://www.cbsnews.com/news/almanac-the-first-shopping-cart',
      ['op 4 juni 1937 rolde Goldman "the world\'s first shopping cart at his Humpty Dumpty supermarket chain in Oklahoma City" uit', '"a basket on the seat of a folding chair, and wheels on the legs"']],
      ['NPR (Mallory Yu), "The history of the shopping cart" (29 maart 2025, via HPPR)', 'https://www.hppr.org/2025-03-29/the-history-of-the-shopping-cart',
      ['"No one wanted them."', '"he hired models to walk around his stores with the carts"']],
      ['Encyclopedia of Oklahoma History and Culture, "Goldman, Sylvan Nathan (1898–1984)"', 'https://www.okhistory.org/publications/enc/entry?entry=GO004',
      ['"in 1934 Sylvan purchased the faltering Humpty-Dumpty grocery chain."', '"His greatest contribution was the shopping cart, invented in 1936 and patented by Goldman. He established the Folding Basket Carrier Company to manufacture his invention."']]],
    niet: '- De Smithsonian-pagina uit het plan was niet nodig. Niet gezegd: wie hij precies inhuurde ("models" volgens NPR, "men and women of assorted ages" volgens I&T; de video zegt "people"), de naam van de klusjesman, en het jaar van het patent (aangevraagd 1938, verleend 1940). Stoel, karren, schap en poppetjes zijn een eigen tekening; de poppetjes stellen geen echte personen voor.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.4, stem: "The first shoppers refused to use shopping carts.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => stoel(h, 540, 1060, { wielen: 1, manden: 2, op: h.klem(h.t / 0.1) }) + h.kin('The first shoppers *refused* to use shopping carts.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg },
    // 2 · Goldman, Humpty Dumpty, Oklahoma City
    { duur: 3.6, stem: "Oklahoma City. Sylvan Goldman runs the Humpty Dumpty grocery stores.", in: 'zweep', bron: OK, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'ding', 0.4]],
      teken: h => schap(h) + h.kin('Oklahoma City. *Sylvan Goldman* runs the Humpty Dumpty grocery stores.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg },
    // 3 · het idee: een klapstoel
    { duur: 3.8, stem: "His idea starts with a folding chair: a basket on the seat, wheels on the legs.", in: 'op', bron: CBS, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.0, 'pop', 0.7], [1.6, 'klap', 0.6], [2.2, 'rol', 0.5]],
      teken: h => stoel(h, 540, 1060, { manden: h.klem((h.t - 0.9) / 0.5), wielen: h.klem((h.t - 1.9) / 0.4) }) + h.kin('A *folding chair*: a basket on the seat, wheels on the legs.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg },
    // 4 · twee draadmanden
    { duur: 3.0, stem: "Two wire baskets, one above the other.", in: 'flits', bron: IT, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.0] }, geluid: [[1.0, 'pop', 0.8]],
      teken: h => stoel(h, 540, 1060, { wielen: 1, manden: 1 + h.klem((h.t - 0.8) / 0.4) }) + h.kin('*Two wire baskets*, one above the other.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 5 · 4 juni 1937
    { duur: 3.4, stem: "June 4, 1937. The carts roll out in his stores.", in: 'zweep', bron: CBS, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.4, 'rol', 0.6]],
      teken: h => groot(h, '1937', 760, 260) + h.kin('June 4. The carts *roll out*.', { y: 860, g: 96, t: h.t, start: 0.45 }).svg },
    // 6 · niemand wilde ze
    { duur: 3.2, stem: "No one wanted them.", in: 'op', bron: NPR, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.9, 'boem', 0.6]],
      teken: h => schap(h) + stoel(h, 540, 1080, { wielen: 1, manden: 2, op: 1 - 0.35 * h.klem((h.t - 0.9) / 0.5) }) + h.kin('*No one* wanted them.', { y: 300, g: 120, t: h.t, start: 0.05 }).svg },
    // 7 · dus huurde hij mensen in
    { duur: 4.0, stem: "So Goldman hired people to pose as shoppers, and push the carts around.", in: 'zweep', bron: IT, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.6], [2.0, 'rol', 0.6]],
      teken: h => { const dx = (h.t - 1.0) * 120;
        const x = 520 + dx; return schap(h) + pop(h, x - 230, 1150, h.K.signaal) + `<g transform="translate(${x.toFixed(1)} 1120) scale(0.62) translate(${(-x).toFixed(1)} -1120)">${stoel(h, x, 1120, { wielen: 1, manden: 2 })}</g>`
          + h.kin('So he hired people to *pose as shoppers* and push the carts around.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg; } },
    // 8 · patent en een bedrijf
    { duur: 3.6, stem: "He patented his cart, and started a company to build it.", in: 'masker', nacht: true, bron: OK, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.6]],
      teken: h => stoel(h, 540, 1080, { wielen: 1, manden: 2 }) + h.kin('He *patented* his cart, and started a company to build it.', { y: 330, g: 88, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 9 · later: de nestbare kar van Orla Watson
    { duur: 4.0, stem: "Later, Orla Watson's nesting cart took over. Goldman licensed it in 1949.", in: 'zweep', bron: IT, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [2.0] }, geluid: [[1.2, 'rol', 0.6], [2.0, 'klap', 0.7]],
      teken: h => nest(h, 540, 1100, h.zacht((h.t - 1.0) / 1.0)) + h.kin('Later: *Orla Watson\'s* nesting cart. Goldman licensed it in *1949*.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 10 · slot
    { duur: 3.4, stem: "Fake shoppers sold the first cart.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => stoel(h, 540, 1040, { wielen: 1, manden: 2 })
        + h.kin('*Fake shoppers* sold the first cart.', { y: 300, g: 110, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
