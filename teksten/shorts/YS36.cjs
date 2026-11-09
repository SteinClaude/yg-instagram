// YS36 — The recycling symbol was a student's contest entry.
// Reeks B · Who Decided? VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de eerste seconde, 25–40 s, einde dat
// terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1 (vr 20 nov 2026), daarna YouTube (za 12 dec).
// Bronnen (gelezen ma 9 nov 2026): Jeremy Kingsley, The Long + Short (14 sep 2014); Andrew Travers, Aspen Journalism
// (12 mrt 2024); Wesley Case, Baltimore Banner (22 apr 2026).
// Niet gezegd: dat het teken "nooit een merk" werd (omstreden: de video zegt alleen "public domain"), het aantal
// inzendingen, Escher (één bron), en dat de pijlen samen een Möbiusband "zijn" (bronnen: "inspired by").
const LS = 'The Long + Short (2014)';
const AJ = 'Aspen Journalism (2024)';
const BB = 'Baltimore Banner (2026)';

// drie pijlen in een driehoek: eigen tekening (geen kopie van een bestand); r = 0..1 opbouw
const pijlen = (h, y = 1020, s = 1, draai = 0, r = 1, kleur = null) => { const c = kleur || h.K.groen; let o = '';
  const R = 250, pt = k => { const a = (-90 + k * 120) * Math.PI / 180; return [R * Math.cos(a), R * Math.sin(a)]; };
  for (let i = 0; i < 3; i++) { const q = h.klem(r * 3 - i); if (q <= 0) continue;
    const [ax, ay] = pt(i), [bx, by] = pt(i + 1), dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const x0 = ax + ux * L * 0.14, y0 = ay + uy * L * 0.14, x1 = ax + ux * L * 0.70, y1 = ay + uy * L * 0.70, tx = ax + ux * L * 0.88, ty = ay + uy * L * 0.88, w = 34, kop = 78;
    const P = [[x0 + nx * w, y0 + ny * w], [x1 + nx * w, y1 + ny * w], [x1 + nx * kop, y1 + ny * kop], [tx, ty], [x1 - nx * kop, y1 - ny * kop], [x1 - nx * w, y1 - ny * w], [x0 - nx * w, y0 - ny * w]];
    o += `<path d="M ${P.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ")} Z" fill="${c}" stroke="${h.K.inkt}" stroke-width="9" stroke-linejoin="round" opacity="${q.toFixed(3)}"/>`; }
  return `<g filter="url(#sch)" transform="translate(540 ${y}) rotate(${draai.toFixed(1)}) scale(${s.toFixed(3)})">${o}</g>`; };
const intro = h => { const q = h.veer(h.klem(h.t / 0.35)); return { s: 0.7 + 0.3 * q }; };
const aarde = (h, p = 1) => `<g filter="url(#sch)" transform="translate(540 1000) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})" opacity="${h.klem(p * 3).toFixed(3)}"><circle r="230" fill="#3D6FB4" stroke="${h.K.inkt}" stroke-width="10"/><path d="M -150 -120 Q -60 -170 -20 -90 Q 30 -20 -60 30 Q -140 60 -170 -20 Z M 40 40 Q 140 10 170 90 Q 120 170 50 140 Z" fill="${h.K.groen}" stroke="${h.K.inkt}" stroke-width="6"/></g>`;
const doos = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(0 ${((1 - p) * 60).toFixed(1)})"><path d="M 270 860 L 540 780 L 810 860 L 810 1240 L 540 1320 L 270 1240 Z" fill="#C9A16B" stroke="${h.K.inkt}" stroke-width="8" stroke-linejoin="round"/><path d="M 270 860 L 540 940 L 810 860 M 540 940 L 540 1320" fill="none" stroke="${h.K.inkt}" stroke-width="8"/><text x="400" y="1110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.inkt}" transform="rotate(16 400 1110)">CONTEST</text></g>`;
const potlood = (h, p = 1) => `<g filter="url(#sch)" transform="translate(${(300 + 300 * p).toFixed(1)} ${(1150 - 200 * p).toFixed(1)}) rotate(-40)"><rect x="-30" y="-260" width="60" height="400" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="6"/><path d="M -30 140 L 0 220 L 30 140 Z" fill="#E8C9A0" stroke="${h.K.inkt}" stroke-width="6"/></g>`;
const mobius = (h, p = 1) => { const d = Array.from({ length: 81 }, (_, i) => { const a = i / 80 * Math.PI * 2 * p; return `${(540 + 300 * Math.cos(a)).toFixed(1)} ${(1000 + 150 * Math.sin(2 * a) / 2 + 60 * Math.sin(a)).toFixed(1)}`; });
  return `<path d="M ${d.join(' L ')}" fill="none" stroke="${h.K.signaal}" stroke-width="70" stroke-linecap="round" stroke-linejoin="round" filter="url(#sch)" opacity="0.9"/>`; };
const geld = (h, p = 1) => `<g filter="url(#sch)" transform="translate(540 1000) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})" opacity="${h.klem(p * 3).toFixed(3)}"><rect x="-300" y="-150" width="600" height="300" rx="20" fill="#A9C79A" stroke="${h.K.inkt}" stroke-width="10"/><text x="0" y="45" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="140" fill="${h.K.inkt}">$2,500</text></g>`;

module.exports = {
  code: 'YS36',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-12-YS36-recycling',
  nummer: 'No. 36',
  onderwerp: 'THE RECYCLING SYMBOL',
  pakket: {
    dag: 'zaterdag 12 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'The recycling symbol was a student\'s contest entry',
    intro: 'In 1970, a cardboard company held a design contest for a recycling symbol. A 23-year-old student, Gary Anderson, won it.',
    feiten: ['In 1970, the year of the first Earth Day, the Container Corporation of America, "a large cardboard manufacturer, held a student design contest to create a symbol representing the recycling process" (The Long + Short; Aspen Journalism).',
      'Gary Anderson was "a 23-year-old student at the University of Southern California" (The Long + Short; Baltimore Banner).',
      '"Anderson was inspired by the cyclic nature of a Möbius strip" (The Long + Short).',
      '"He won $2,500." (The Long + Short); Aspen Journalism: a $2,500 tuition grant and a trip to the conference.',
      'The symbol would be "free to use in the public domain" (Baltimore Banner).'],
    bronnen: [['Jeremy Kingsley, "Innovation heroes #2: Gary Anderson", The Long + Short (September 14, 2014)', 'https://thelongandshort.org/creativity/gary-anderson-designer-recycling-symbol'],
      ['Andrew Travers, "The recycling symbol\'s Aspen roots", Aspen Journalism (March 12, 2024)', 'https://aspenjournalism.org/the-recycling-symbols-aspen-roots/'],
      ['Wesley Case, on Gary Anderson and the recycling symbol, Baltimore Banner (April 22, 2026)', 'https://www.thebanner.com/culture/arts/recycling-symbol-baltimore-designer-gary-anderson-ANXP2G62N5AIXJMPRWI2U42CYQ/']],
    hashtags: '#Shorts #history #design #recycling',
    tags: 'recycling symbol, recycling logo history, Gary Anderson, chasing arrows, Mobius strip, Earth Day 1970, Container Corporation of America, design history, history of everyday things, why things are the way they are, shorts',
    md: [['Jeremy Kingsley, The Long + Short (14 sep 2014)', 'https://thelongandshort.org/creativity/gary-anderson-designer-recycling-symbol',
      ['"a 23-year-old student at the University of Southern California"', '"Container Corporation of America, a large cardboard manufacturer, held a student design contest to create a symbol representing the recycling process."', '"He won $2,500."', '"Anderson was inspired by the cyclic nature of a Möbius strip"']],
      ['Andrew Travers, Aspen Journalism (12 mrt 2024)', 'https://aspenjournalism.org/the-recycling-symbols-aspen-roots/',
      ['"in the spring of 1970"; "the advent of the first Earth Day"', 'wedstrijd om "a symbol to promote the recycling of paper products"', '"a $2,500 tuition grant and a trip to the conference"']],
      ['Wesley Case, Baltimore Banner (22 apr 2026)', 'https://www.thebanner.com/culture/arts/recycling-symbol-baltimore-designer-gary-anderson-ANXP2G62N5AIXJMPRWI2U42CYQ/',
      ['"the then-23-year-old University of Southern California graduate student"', '"a contest sponsored by the Container Corporation of America"', 'het teken "would be free to use in the public domain"']]],
    niet: '- Niet gezegd: dat het teken nooit als merk is vastgelegd (omstreden), het aantal inzendingen, Escher (één bron), en dat de pijlen samen een Möbiusband zijn (bronnen: "inspired by"). De pijlen, de doos, de aarde en het geld zijn eigen tekenwerk.',
  },
  scenes: [
    { duur: 2.8, stem: 'A twenty-three-year-old student drew this. You see it every day.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => pijlen(h, 1060, intro(h).s, h.t * 8, 1) + h.kin('A *23-year-old student* drew this.', { y: 300, g: 108, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 2.8, stem: '1970. The year of the first Earth Day.', in: 'zweep', bron: AJ, bronStart: 1.4, camera: { zoom: [1, 1.05] }, geluid: [[0.4, 'ding', 0.5]],
      teken: h => aarde(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('*1970*: the first Earth Day.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'A cardboard company holds a contest for a recycling symbol.', in: 'op', bron: LS, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'pop', 0.5]],
      teken: h => doos(h, h.klem((h.t - 0.3) / 0.4)) + h.kin('A *cardboard company* holds a contest.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'Gary Anderson, a student in California, enters.', in: 'zweep', bron: LS, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'tik', 0.5]],
      teken: h => potlood(h, h.zacht((h.t - 0.4) / 1.2)) + pijlen(h, 1040, 0.8, 0, h.klem((h.t - 0.6) / 1.6)) + h.kin('*Gary Anderson*, a student, enters.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'He is inspired by a Möbius strip: a loop with a twist.', in: 'op', bron: LS, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'whoosh', 0.4]],
      teken: h => mobius(h, h.zacht((h.t - 0.2) / 1.4)) + h.kin('Inspired by a *Möbius strip*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { duur: 2.4, stem: 'He wins two thousand five hundred dollars.', in: 'flits', bron: LS, bronStart: 1.2, camera: { zoom: [1, 1.06], stoot: [0.5] }, geluid: [[0.5, 'klap', 0.6], [0.6, 'ding', 0.5]],
      teken: h => geld(h, h.klem((h.t - 0.4) / 0.3)) + h.kin('He *wins*.', { y: 300, g: 120, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'And the symbol goes into the public domain. Free for everyone.', in: 'zweep', bron: BB, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'stijg', 0.5]],
      teken: h => [0, 1, 2].map(i => pijlen(h, 1000, 0.42 * h.veer(h.klem((h.t - 0.6 - i * 0.3) / 0.4)), 0, 1)).map((s, i) => `<g transform="translate(${(i - 1) * 300} 0)">${s}</g>`).join('') + h.kin('Public domain: *free for everyone*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 2.6, stem: 'That is why you see it everywhere.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => pijlen(h, 1060, intro(h).s, h.t * 8, 1) + h.kin('That is why it is *everywhere*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
  ],
};
