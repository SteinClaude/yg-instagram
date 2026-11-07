// YS20 — Bubble wrap was supposed to be wallpaper.
// Reeks C · Happy Accidents. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): persbericht Sealed Air (26 jan 2026, via Nasdaq) en Invention & Technology
// (Emily Prokop, "Bubble Wrap: From Wallpaper To Stress Reliever", 2020). Smithsonian (plan-bron) gaf een 403.
// Niet gezegd: "douchegordijnen" (staat in geen van beide bronnen), de exacte datum van de pitch aan IBM.
const SA = 'Sealed Air press release (2026), via Nasdaq';
const IT = 'Invention & Technology, "Bubble Wrap: From Wallpaper…" (2020)';

const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// vel noppenfolie; p = 0..1 hoeveel noppen er gevuld zijn, knal = index van een geknapte nop
const vel = (h, x, y, { w = 640, hh = 480, p = 1, knal = -1, kleur = '#DCEBF2', schaal = 1, op = 1 } = {}) => {
  const r = 30, stap = 76, kol = Math.floor(w / stap), rij = Math.floor(hh / stap);
  let s = `<rect x="${x - w / 2}" y="${y - hh / 2}" width="${w}" height="${hh}" rx="14" fill="${kleur}" stroke="#9FC3D4" stroke-width="4"/>`;
  for (let j = 0; j < rij; j++) for (let i = 0; i < kol; i++) { const n = j * kol + i; if (n / (kol * rij) > p) continue;
    const cx = x - (kol - 1) * stap / 2 + i * stap, cy = y - (rij - 1) * stap / 2 + j * stap;
    s += n === knal ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#9FC3D4" stroke-width="3" stroke-dasharray="6 6"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F4FAFD" stroke="#9FC3D4" stroke-width="3"/><circle cx="${cx - 9}" cy="${cy - 10}" r="8" fill="#FFFFFF"/>`; }
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})">${s}</g>`;
};
const kruis = (h, x, y, p) => p <= 0 ? '' : `<g opacity="${p.toFixed(3)}"><line x1="${x - 150}" y1="${y - 150}" x2="${x + 150}" y2="${y + 150}" stroke="${h.K.signaal}" stroke-width="30" stroke-linecap="round"/><line x1="${x + 150}" y1="${y - 150}" x2="${x - 150}" y2="${y + 150}" stroke="${h.K.signaal}" stroke-width="30" stroke-linecap="round"/></g>`;
// kas: een eenvoudig glazen huisje
const kas = (h, x = 540, y = 1080) => `<g filter="url(#sch)"><polygon points="${x - 260},${y - 60} ${x},${y - 260} ${x + 260},${y - 60} ${x + 260},${y + 200} ${x - 260},${y + 200}" fill="#E3EFE6" stroke="${h.K.groen}" stroke-width="8"/>`
  + [-130, 0, 130].map(d => `<line x1="${x + d}" y1="${y - 60 - (130 - Math.abs(d)) * 1.5}" x2="${x + d}" y2="${y + 200}" stroke="${h.K.groen}" stroke-width="6"/>`).join('')
  + `<line x1="${x - 260}" y1="${y + 70}" x2="${x + 260}" y2="${y + 70}" stroke="${h.K.groen}" stroke-width="6"/></g>`;
// computerkast (IBM 1401): grijze kast met lampjes
const kast = (h, x = 540, y = 1060, p = 1) => `<g opacity="${p.toFixed(3)}" filter="url(#sch)"><rect x="${x - 200}" y="${y - 230}" width="400" height="430" rx="10" fill="#C9CCD1" stroke="${h.K.inkt}" stroke-width="5"/>`
  + `<rect x="${x - 160}" y="${y - 190}" width="320" height="120" rx="6" fill="#2B2E36"/>`
  + Array.from({ length: 12 }, (_, i) => `<circle cx="${x - 130 + (i % 6) * 52}" cy="${y - 160 + Math.floor(i / 6) * 58}" r="12" fill="${i % 3 ? h.K.geel : h.K.signaal}"/>`).join('')
  + `<rect x="${x - 160}" y="${y - 30}" width="320" height="14" rx="7" fill="#9A9EA6"/><rect x="${x - 160}" y="${y + 10}" width="320" height="14" rx="7" fill="#9A9EA6"/></g>`;

module.exports = {
  code: 'YS20',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-26-YS20-noppenfolie',
  nummer: 'No. 20',
  onderwerp: 'BUBBLE WRAP',
  pakket: {
    dag: 'donderdag 26 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'Bubble wrap was supposed to be wallpaper',
    intro: 'In 1957 two engineers tried to make a textured wallpaper by sealing air between two plastic sheets. Nobody wanted it on their walls.',
    feiten: ['1957, Hawthorne, New Jersey: engineers Alfred W. Fielding and Marc Chavannes tried to create a textured wall covering by laminating two plastic sheets with air bubbles trapped inside.',
      'In Fielding\'s garage, they sealed two plastic sheets together.',
      'They first tried selling it to greenhouses as a sort of cheap insulation.',
      'The wallpaper concept did not take hold; the invention found its true purpose in protective packaging, leading to the founding of Sealed Air Corporation in 1960.',
      'IBM premiered its new 1401 computer in 1959. Frederick Bowers, a marketer at Sealed Air, pitched the material to IBM, "and finally a use was found for Bubble Wrap."'],
    bronnen: [['Sealed Air, press release on National Bubble Wrap Appreciation Day (January 26, 2026, via Nasdaq)', 'https://www.nasdaq.com/press-release/sealed-air-celebrates-innovation-and-its-iconic-brand-national-bubble-wrapr'],
      ['Emily Prokop, "Bubble Wrap: From Wallpaper To Stress Reliever", Invention & Technology (2020)', 'https://www.inventionandtech.com/node/87109']],
    hashtags: '#Shorts #history #inventions #accidents',
    tags: 'bubble wrap, bubble wrap history, bubble wrap wallpaper, Fielding and Chavannes, Sealed Air, IBM 1401, accidental inventions, packaging history, history of everyday things, why things are the way they are, shorts',
    md: [['Sealed Air, persbericht (26 januari 2026, via Nasdaq)', 'https://www.nasdaq.com/press-release/sealed-air-celebrates-innovation-and-its-iconic-brand-national-bubble-wrapr',
      ['"The story of BUBBLE WRAP® brand packaging began in 1957 in Hawthorne, New Jersey, when engineers Alfred W. Fielding and Marc Chavannes attempted to create a textured wall covering by laminating two plastic sheets with air bubbles trapped inside."', '"While the wallpaper concept did not take hold, their invention found its true purpose in protective packaging, leading to the founding of Sealed Air Corporation in 1960."']],
      ['Emily Prokop, "Bubble Wrap: From Wallpaper To Stress Reliever", Invention & Technology (2020)', 'https://www.inventionandtech.com/node/87109',
      ['"In 1957, Alfred W Fielding and Marc Chavannes wanted to create a high-end plastic wallpaper."', '"In Fielding\'s garage, they sealed two plastic sheets together, creating air pockets trapped inside"', '"They first tried selling it to greenhouses as a sort of cheap insulation, but it was difficult to market plastic for walls."', '"IBM premiered its new 1401 variable-word-length computer in 1959"', '"Frederick Bowers, a marketer at Sealed Air, pitched the material to IBM, and finally a use was found for Bubble Wrap."']]],
    niet: '- Smithsonian (plan-bron) gaf op 7 nov een 403. Niet gezegd: "twee douchegordijnen" (staat in geen van beide bronnen; zij zeggen "two plastic sheets"), het jaar van de pitch aan IBM (niet in de bron; de video zegt alleen "soon after"), en hoeveel er nu verkocht wordt. Folie, kas en computerkast zijn een eigen tekening, geen echt IBM-ontwerp.',
  },
  scenes: [
    // 1 · HAAK: een vel noppenfolie slaat neer
    { duur: 3.2, stem: "Bubble wrap was supposed to be wallpaper.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.6, 'pop', 0.9]],
      teken: h => { const p = h.klem(h.t / 0.3);
        return vel(h, 540, 1050, { schaal: 1.7 - 0.7 * p * p, op: h.klem(h.t / 0.08), knal: h.t > 1.6 ? 9 : -1 })
          + h.kin('Bubble wrap was supposed to be *wallpaper*.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg; } },
    // 2 · 1957, twee ingenieurs
    { duur: 3.8, stem: "1957, New Jersey. Two engineers, Alfred Fielding and Marc Chavannes, want a textured wall covering.", in: 'zweep', bron: SA, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1957', 760, 260) + h.kin('Alfred Fielding and Marc Chavannes want a *textured wall covering*.', { y: 860, g: 74, t: h.t, start: 0.45 }).svg },
    // 3 · in de garage: twee vellen plastic, lucht ertussen
    { duur: 3.8, stem: "In Fielding's garage, they seal two plastic sheets together, with air trapped inside.", in: 'op', bron: IT, bronStart: 2.4, camera: { zoom: [1, 1.06] }, geluid: [[0.9, 'rol', 0.5], [1.6, 'pop', 0.6], [1.8, 'pop', 0.6], [2.0, 'pop', 0.6]],
      teken: h => { const d = h.zacht((h.t - 0.6) / 0.8);
        return h.kin('Two plastic sheets, sealed together, with *air trapped inside*.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg
          + `<rect x="220" y="${(860 + (1 - d) * -90).toFixed(1)}" width="640" height="24" rx="10" fill="#9FC3D4"/><rect x="220" y="${(1180 + (1 - d) * 90).toFixed(1)}" width="640" height="24" rx="10" fill="#9FC3D4"/>`
          + (h.t > 1.4 ? vel(h, 540, 1030, { w: 640, hh: 320, p: h.klem((h.t - 1.4) / 0.8) }) : ''); } },
    // 4 · als behang: mislukt
    { duur: 3.2, stem: "As wallpaper, it didn't take hold.", in: 'flits', bron: SA, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.2] }, geluid: [[1.2, 'klap', 0.8], [1.2, 'boem', 0.5]],
      teken: h => `<rect x="160" y="720" width="760" height="560" fill="#E8E2D4" stroke="${h.K.grijs}" stroke-width="4"/>` + vel(h, 540, 1000, { w: 560, hh: 440, kleur: '#D9E8EE' })
        + kruis(h, 540, 1010, h.klem((h.t - 1.1) / 0.2)) + h.kin('As wallpaper, it *didn\'t take hold*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 5 · dan als isolatie voor kassen
    { duur: 3.6, stem: "Next try: cheap insulation for greenhouses. Also a hard sell.", in: 'zweep', bron: IT, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'stijg', 0.4], [2.6, 'tik', 0.7]],
      teken: h => kas(h) + (h.t > 1.0 ? vel(h, 540, 1110, { w: 440, hh: 200, p: h.klem((h.t - 1.0) / 0.8), op: 0.85 }) : '')
        + h.kin('Next try: cheap *insulation for greenhouses*. Also a hard sell.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg },
    // 6 · 1960: Sealed Air
    { duur: 3.4, stem: "1960. They found a company to sell it: Sealed Air.", in: 'op', bron: SA, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1960', 760, 260) + h.kin('They found a company to sell it: *Sealed Air*.', { y: 860, g: 80, t: h.t, start: 0.45 }).svg },
    // 7 · IBM en de 1401
    { duur: 4.2, stem: "IBM has a new computer, the 1401. A Sealed Air marketer pitches them the bubbles.", in: 'zweep', bron: IT, bronStart: 2.6, camera: { zoom: [1, 1.05], stoot: [2.4] }, geluid: [[0.8, 'tik', 0.7], [1.0, 'tik', 0.7], [2.4, 'pop', 0.8]],
      teken: h => kast(h, 540, 1060, h.klem((h.t - 0.5) / 0.4)) + h.kin('*IBM* has a new computer, the *1401*. A Sealed Air marketer pitches them the bubbles.', { y: 290, g: 78, t: h.t, start: 0.05 }).svg },
    // 8 · eindelijk een doel: verpakking
    { duur: 3.6, stem: "Finally, a use: protective packaging.", in: 'masker', nacht: true, bron: SA, bronStart: 2.0, camera: { zoom: [1.05, 1.0], stoot: [1.4] }, geluid: [[0.5, 'whoosh', 0.4], [1.4, 'ding', 0.7]],
      teken: h => { const p = h.zacht((h.t - 0.8) / 0.7);
        return `<g transform="translate(0 ${((1 - p) * 40).toFixed(1)})">${kast(h, 540, 1060, 1)}</g>`
          + `<g opacity="${p.toFixed(3)}"><rect x="290" y="780" width="500" height="520" rx="30" fill="none" stroke="#DCEBF2" stroke-width="44" stroke-dasharray="40 16"/></g>`
          + h.kin('Finally, a use: *protective packaging*.', { y: 330, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg; } },
    // 9 · slot
    { duur: 3.6, stem: "Failed wallpaper. Perfect packaging.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[1.2, 'pop', 0.8], [1.5, 'pop', 0.8], [-0.9, 'whoosh', 0.5]],
      teken: h => vel(h, 540, 1050, { knal: h.t > 1.5 ? 4 : h.t > 1.2 ? 9 : -1 })
        + h.kin('Failed wallpaper. *Perfect packaging.*', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
