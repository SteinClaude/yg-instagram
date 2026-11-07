// YS23 — Your windshield cracks but stays in one piece. That started with a dropped beaker.
// Reeks C · Happy Accidents. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): VILLUM Window Collection, "Édouard Bénédictus"; Lisa McDonald, "The evolution and
// importance of car windshields in automotive design", American Ceramic Society Bulletin 104(4), mei 2025.
// Britannica (plan-bron) gaf een 403. Niet gezegd: dat hij "de uitvinder" van gelaagd glas is (er waren eerdere
// patenten), "collodion", en dat "Triplex" de naam van zijn patent was (het was de naam van het bedrijf).
const VIL = 'VILLUM Window Collection, "Édouard Bénédictus"';
const ACS = 'American Ceramic Society Bulletin (2025)';

const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// barsten vanuit een punt; p = 0..1 lengte
const barst = (h, x, y, p, r = 260, kleur = '#FFFFFF') => { if (p <= 0) return ''; let s = '';
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + 0.3, l = r * (0.6 + (i % 3) * 0.2) * p, mx = x + Math.cos(a) * l * 0.5 + (i % 2 ? 14 : -14), my = y + Math.sin(a) * l * 0.5;
    s += `<polyline points="${x},${y} ${mx.toFixed(1)},${my.toFixed(1)} ${(x + Math.cos(a) * l).toFixed(1)},${(y + Math.sin(a) * l).toFixed(1)}" fill="none" stroke="${kleur}" stroke-width="4"/>`; }
  for (let k = 1; k <= 2; k++) s += `<circle cx="${x}" cy="${y}" r="${(r * 0.25 * k * p).toFixed(1)}" fill="none" stroke="${kleur}" stroke-width="3" opacity="0.8"/>`;
  return s; };
// voorruit van een auto (voorkant)
const ruit = (h, x = 540, y = 1060, p = 0) => `<g filter="url(#sch)"><path d="M ${x - 360} ${y + 200} L ${x - 280} ${y - 160} Q ${x} ${y - 220} ${x + 280} ${y - 160} L ${x + 360} ${y + 200} Z" fill="${h.K.inkt}"/>`
  + `<path d="M ${x - 320} ${y + 170} L ${x - 250} ${y - 130} Q ${x} ${y - 185} ${x + 250} ${y - 130} L ${x + 320} ${y + 170} Z" fill="#9CC3D8"/>${barst(h, x + 90, y + 10, p, 230)}`
  + `<rect x="${x - 420}" y="${y + 200}" width="840" height="120" rx="30" fill="${h.K.signaal}"/><circle cx="${x - 300}" cy="${y + 260}" r="36" fill="${h.K.geel}"/><circle cx="${x + 300}" cy="${y + 260}" r="36" fill="${h.K.geel}"/></g>`;
// bekerglas; val = 0..1 (op de plank -> op de grond), barsten p
const beker = (h, x, y, { draai = 0, p = 0, film = 0 } = {}) => `<g transform="translate(${x} ${y}) rotate(${draai.toFixed(1)})" filter="url(#sch)"><path d="M -90 -150 L -90 120 Q -90 150 -60 150 L 60 150 Q 90 150 90 120 L 90 -150" fill="#DCEBF2" fill-opacity="0.75" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<line x1="-110" y1="-150" x2="110" y2="-150" stroke="${h.K.inkt}" stroke-width="6"/>${film > 0 ? `<path d="M -80 -140 L -80 120 Q -80 140 -60 140 L 60 140 Q 80 140 80 120 L 80 -140" fill="none" stroke="${h.K.geel}" stroke-width="10" opacity="${film.toFixed(3)}"/>` : ''}${barst(h, 0, 20, p, 140, h.K.inkt)}</g>`;
// gasmasker: twee ronde glazen
const masker = (h, x = 540, y = 1060) => `<g filter="url(#sch)"><path d="M ${x - 230} ${y - 60} Q ${x} ${y - 260} ${x + 230} ${y - 60} Q ${x + 260} ${y + 160} ${x} ${y + 230} Q ${x - 260} ${y + 160} ${x - 230} ${y - 60} Z" fill="#6B6F5A" stroke="${h.K.inkt}" stroke-width="6"/>`
  + [-1, 1].map(k => `<circle cx="${x + k * 105}" cy="${y - 20}" r="78" fill="#9CC3D8" stroke="${h.K.inkt}" stroke-width="10"/>`).join('')
  + `<circle cx="${x}" cy="${y + 150}" r="62" fill="#3E4133" stroke="${h.K.inkt}" stroke-width="6"/></g>`;

module.exports = {
  code: 'YS23',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-29-YS23-veiligheidsglas',
  nummer: 'No. 23',
  onderwerp: 'SAFETY GLASS',
  pakket: {
    dag: 'zondag 29 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why your windshield cracks but doesn\'t shatter',
    intro: 'In 1903 a French chemist dropped a glass beaker. It broke, but it didn\'t splinter. That accident led to the laminated glass in car windshields.',
    feiten: ['In 1903, the French chemist (and painter) Édouard Bénédictus by accident discovered the process behind laminated glass.',
      'He dropped a beaker that had held a cellulose nitrate solution. It broke but did not splinter: the solution had left a thin film on the inside that held the glass together.',
      'In 1909 he patented laminated glass.',
      'During World War I there was demand for this glass for lenses for gas masks and aviator goggles, and laminated glass started being used in windshields.'],
    bronnen: [['VILLUM Window Collection, "Édouard Bénédictus"', 'https://en.villumwindowcollection.com/all-about-windows/persons/%C3%A9douard-b%C3%A9n%C3%A9dictus/'],
      ['Lisa McDonald, "The evolution and importance of car windshields in automotive design", American Ceramic Society Bulletin 104(4), May 2025', 'https://bulletin.ceramics.org/article/the-evolution-and-importance-of-car-windshields-in-automotive-design']],
    hashtags: '#Shorts #history #inventions #accidents',
    tags: 'safety glass, laminated glass, windshield, why windshields dont shatter, Edouard Benedictus, 1903, cellulose nitrate, accidental inventions, history of everyday things, why things are the way they are, shorts',
    md: [['VILLUM Window Collection, "Édouard Bénédictus"', 'https://en.villumwindowcollection.com/all-about-windows/persons/%C3%A9douard-b%C3%A9n%C3%A9dictus/',
      ['"In 1903, the French chemist Édouard Bénédictus by accident discovered the process behind laminated glass."', '"Benedictus dropped a beaker with a cellulose nitrate solution and found that it broke but did not splinter."', '"The solution had left a thin film on the inside of the beaker which held the glass together."', '"In 1909 the chemist patented the first laminated glass."']],
      ['Lisa McDonald, American Ceramic Society Bulletin 104(4), mei 2025', 'https://bulletin.ceramics.org/article/the-evolution-and-importance-of-car-windshields-in-automotive-design',
      ['"In 1903, French chemist and painter Edouard Benedictus made the accidental discovery"', 'hij "knocked a bottle off the shelf and the broken pieces held together"; "cellulose nitrate"', '"Benedictus received a patent for his laminated glass in 1909."', 'vraag in de Eerste Wereldoorlog naar Triplex-glas, o.a. voor "lenses for gas masks and aviator goggles"', '"Though laminated glass started being used in windshields during World War I."']]],
    niet: '- Britannica (plan-bron) gaf op 7 nov een 403. Niet gezegd: dat Bénédictus "de uitvinder" van gelaagd glas is (er waren eerdere patenten, o.a. 1902 en 1905), "collodion" (geen leesbare bron), dat "Triplex" de naam van zijn patent was (het was de bedrijfsnaam), en hoe moderne voorruiten precies gemaakt worden. Beker, ruit en masker zijn een eigen tekening; bronnen zeggen "beaker" (VILLUM) en "bottle" (ACerS), de video zegt "glass beaker".',
  },
  scenes: [
    // 1 · HAAK: een ruit barst, maar blijft heel
    { duur: 3.8, stem: "Your windshield cracks, but stays in one piece. That started with a dropped beaker.", camera: { zoom: [1, 1.04], stoot: [0.4], schud: [0.4] }, geluid: [[0.38, 'klap'], [0.38, 'boem', 0.8]],
      teken: h => ruit(h, 540, 1060, h.klem((h.t - 0.35) / 0.25)) + h.kin('It *cracks*, but stays in one piece. That started with a *dropped beaker*.', { y: 290, g: 84, t: h.t, start: 0.5 }).svg },
    // 2 · 1903, Bénédictus
    { duur: 3.8, stem: "1903. French chemist and painter Édouard Bénédictus is in his lab.", in: 'zweep', bron: VIL, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1903', 760, 260) + h.kin('French chemist and painter *Édouard Bénédictus*.', { y: 860, g: 80, t: h.t, start: 0.45 }).svg },
    // 3 · de beker valt
    { duur: 3.4, stem: "A glass beaker falls off the shelf.", in: 'op', bron: ACS, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.5], schud: [1.5] }, geluid: [[0.7, 'stijg', 0.4], [1.5, 'klap', 0.9], [1.5, 'boem', 0.6]],
      teken: h => { const v = h.klem((h.t - 0.6) / 0.9), y = 630 + v * v * 450;
        return `<rect x="140" y="${980 - 200}" width="420" height="26" fill="#8C6B4A"/>` + beker(h, 330 + v * 260, y, { draai: v * 95, p: h.klem((h.t - 1.5) / 0.25) })
          + `<rect x="100" y="1236" width="880" height="12" fill="${h.K.grijs}"/>` + h.kin('A glass beaker *falls off the shelf*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg; } },
    // 4 · gebroken, maar niet versplinterd
    { duur: 3.2, stem: "It breaks. But it doesn't splinter.", in: 'flits', bron: VIL, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.1] }, geluid: [[1.1, 'ding', 0.7]],
      teken: h => beker(h, 540, 1060, { p: 1 }) + h.kin('It breaks. But it *doesn\'t splinter*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    // 5 · een dun laagje cellulosenitraat
    { duur: 4.0, stem: "The beaker had held a cellulose nitrate solution. It left a thin film that held the glass together.", in: 'zweep', bron: VIL, bronStart: 2.6, camera: { zoom: [1, 1.08] }, geluid: [[1.4, 'stijg', 0.4], [2.6, 'pop', 0.7]],
      teken: h => beker(h, 540, 1060, { p: 1, film: h.klem((h.t - 1.2) / 0.8) }) + h.kin('A thin film of *cellulose nitrate* held the glass together.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg },
    // 6 · 1909: patent
    { duur: 3.2, stem: "1909. He patents laminated glass.", in: 'op', bron: VIL, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1909', 760, 260) + h.kin('He patents *laminated glass*.', { y: 860, g: 92, t: h.t, start: 0.45 }).svg },
    // 7 · Eerste Wereldoorlog: gasmaskers
    { duur: 3.6, stem: "World War One. It's wanted for the lenses of gas masks.", in: 'masker', nacht: true, bron: ACS, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'klap', 0.5]],
      teken: h => masker(h, 540, 1080) + h.kin('World War I: lenses for *gas masks*.', { y: 330, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 8 · en in voorruiten
    { duur: 3.4, stem: "And laminated glass starts showing up in windshields.", in: 'zweep', bron: ACS, bronStart: 2.0, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.6, 'ding', 0.6]],
      teken: h => ruit(h, 540, 990, 0) + h.kin('And it starts showing up in *windshields*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 9 · slot
    { duur: 3.6, stem: "A dropped beaker, still in your windshield.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.6, 'klap', 0.6], [-0.9, 'whoosh', 0.5]],
      teken: h => ruit(h, 540, 990, h.klem((h.t - 0.6) / 0.25))
        + h.kin('A dropped beaker, *still in your windshield*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1385" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
