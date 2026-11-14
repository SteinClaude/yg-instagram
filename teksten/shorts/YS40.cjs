// YS40 — Why is "&" called an ampersand?
// Reeks A · Signs & Symbols. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (PROEF, nog geen stijl OK):
// het vaste duo in getekende decors (gereedschap/short/decor.cjs), met wijd beeld en close-ups. Het Vraagteken stelt de vragen, Peertje geeft de antwoorden (Andries, za 14 nov 2026: "peertje" ·
// "met het vraag taken samen" · "bij vragen vraag tegen bij antwoorde peertje" · "zo veel mogelijk ect").
// Bronnen (gelezen za 14 nov 2026): Dictionary.com, "What Character Was Removed From The Alphabet?" (7 sep 2020);
// Andy Hollandbeck, "In a Word: And & Ampersand", The Saturday Evening Post (2 sep 2021).
// Niet gezegd: een jaartal voor het woord (de bronnen verschillen: "by the end of the 18th century" tegenover "in the
// early 1800s"), Tiro en zijn tekens, andere verbasteringen. Britannica en Merriam-Webster gaven een 403 en zijn
// daarom geen bron.
const DIC = 'Dictionary.com (2020)';
const SEP = 'Saturday Evening Post (2021)';

// Stijl 3 met decor: het onderwerp staat op het VLAK van het decor (140..940 × 670..1000): prikbord, schoolbord of
// perkamentrol. De kop staat op het papieren kaartje bovenin, het duo op de vloer.
const amp = (h, { y = 945, g = 330, kleur = null, intro = true } = {}) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  return `<g opacity="${(intro ? h.klem(h.t / 0.08) : 1).toFixed(3)}" transform="translate(540 835) scale(${(0.7 + 0.3 * q).toFixed(3)}) translate(-540 -835)">`
    + `<text x="540" y="${y}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="${kleur || h.K.signaal}">&amp;</text></g>`; };
// rij kaartjes op het schoolbord: het eind van het alfabet; de laatste (&) valt erbij
const rij = (h, p = 1) => ['X', 'Y', 'Z', '&'].map((c, i) => { const q = h.veer(h.klem(p * 4 - i * 0.9)), x = 178 + i * 188, laatste = i === 3;
  return q <= 0 ? '' : `<g opacity="${h.klem(q * 2).toFixed(3)}" transform="translate(${x + 80} ${838 + (1 - q) * 60}) rotate(${laatste ? -5 : 0}) scale(${(0.6 + 0.4 * q).toFixed(3)})">`
    + `<rect x="-74" y="-92" width="160" height="196" rx="18" fill="#000" opacity="0.3"/>`
    + `<rect x="-80" y="-100" width="160" height="196" rx="18" fill="${laatste ? h.K.signaal : '#FBF6EA'}" stroke="${h.K.inkt}" stroke-width="7"/>`
    + `<text x="0" y="50" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="124" fill="${laatste ? '#FFFFFF' : h.K.inkt}">${c === '&' ? '&amp;' : c}</text>`
    + `<text x="0" y="-62" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="${laatste ? '#FFFFFF' : h.K.grijs}">${24 + i}</text></g>`; }).join('');
// E en t schuiven op het perkament in elkaar en worden &
const et = (h, m = 0) => { const d = 140 * (1 - m), op = h.klem(1 - (m - 0.75) / 0.25);
  return (op > 0 ? `<g opacity="${op.toFixed(3)}"><text x="${540 - d - 20}" y="935" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="280" fill="${h.K.inkt}">E</text>`
    + `<text x="${540 + d + 20}" y="935" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="280" fill="${h.K.inkt}">t</text></g>` : '')
    + (op < 1 ? `<text x="540" y="945" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(330 * (0.85 + 0.15 * (1 - op))).toFixed(0)}" fill="${h.K.signaal}" opacity="${(1 - op).toFixed(3)}">&amp;</text>` : ''); };
// krijt op het schoolbord: het opgezegde eind van het alfabet
const krijt = (h, p = 1, regel2 = 0) => `<g opacity="${h.klem(p * 2).toFixed(3)}">`
  + `<text x="540" y="810" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="#F4F1E6" letter-spacing="8">… X Y Z &amp;</text>`
  + (regel2 > 0 ? `<text x="540" y="930" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="60" fill="${h.K.geel}" opacity="${h.klem(regel2).toFixed(3)}">"and per se and"</text>` : '') + `</g>`;
// "and per se and" wordt op het bord samengedrukt tot "ampersand"
const pers = (h, m = 0) => { const op = h.klem(1 - (m - 0.6) / 0.3), sp = 26 * (1 - h.klem(m / 0.7));
  return (op > 0 ? `<text x="540" y="850" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(70 - 8 * h.klem(m / 0.7)).toFixed(0)}" fill="#F4F1E6" opacity="${op.toFixed(3)}" word-spacing="${sp.toFixed(1)}" letter-spacing="${(sp / 6).toFixed(1)}">and per se and</text>` : '')
    + (op < 1 ? `<text x="540" y="875" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(138 * h.veer(1 - op)).toFixed(0)}" fill="${h.K.geel}" opacity="${(1 - op).toFixed(3)}">ampersand</text>` : ''); };

module.exports = {
  code: 'YS40',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // PROEF: nog geen stijl OK (za 14 nov 2026)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  stemmen: { vraag: { stem: 'af_heart', tempo: 1.1 }, antwoord: { stem: 'am_fenrir', tempo: 1.1 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-12-16-YS40-ampersand',
  nummer: 'No. 40',
  onderwerp: 'THE AMPERSAND',
  pakket: {
    dag: 'woensdag 16 december 2026', gelezen: 'za 14 nov 2026',
    titel: 'Why is "&" called an ampersand?',
    intro: 'The & sign used to sit at the end of the alphabet. Children reciting it said "and per se and", and that phrase slurred into one word.',
    feiten: ['The & "was actually once the 27th member of the alphabet" (Dictionary.com).',
      'It "was formed from a conjoining of the letters in et, the Latin word for \'and\'" (The Saturday Evening Post).',
      'Because "X, Y, Z, and" sounded confusing, students said "and per se and" (Dictionary.com); per se means "by itself" (The Saturday Evening Post).',
      'Over time the phrase "was slurred together into the word we use today: ampersand" (Dictionary.com).'],
    bronnen: [['"What Character Was Removed From The Alphabet?", Dictionary.com (September 7, 2020)', 'https://www.dictionary.com/e/ampersand/'],
      ['Andy Hollandbeck, "In a Word: And & Ampersand", The Saturday Evening Post (September 2, 2021)', 'https://www.saturdayeveningpost.com/2021/09/in-a-word-and-ampersand/']],
    hashtags: '#Shorts #history #language #words',
    tags: 'ampersand, and sign, why is it called ampersand, and per se and, 27th letter, alphabet history, et ligature, word origins, etymology, history of everyday things, why things are the way they are, shorts',
    md: [['Dictionary.com, "What Character Was Removed From The Alphabet?" (7 sep 2020)', 'https://www.dictionary.com/e/ampersand/',
      ['"was actually once the 27th member of the alphabet"', '"the students said, \'and per se and.\'"', '"was slurred together into the word we use today: ampersand"']],
      ['Andy Hollandbeck, The Saturday Evening Post (2 sep 2021)', 'https://www.saturdayeveningpost.com/2021/09/in-a-word-and-ampersand/',
      ['"It was formed from a conjoining of the letters in et, the Latin word for \\"and.\\""', '"the Latin phrase per se \\"by itself.\\""']]],
    niet: '- Niet gezegd: een jaartal voor het woord (de bronnen verschillen: eind 18e eeuw tegenover begin 19e eeuw), Tiro en zijn tekens, andere verbasteringen. Toetsen, schoolbord en figuren zijn eigen tekenwerk.',
  },
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.4, stem: 'Why is this symbol called an ampersand?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => amp(h) + h.krabbel.cirkel(540, 838, 190, 150, { t: h.t, start: 1.2 }) + h.kin('Why is *&* called an *ampersand*?', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.2, stem: 'Because it used to sit at the end of the alphabet. Number twenty-seven.', aha: 2.3, in: 'zweep', bron: DIC, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'pop', 0.4], [0.8, 'pop', 0.4], [1.1, 'pop', 0.4], [1.5, 'klap', 0.5]],
      teken: h => rij(h, h.klem((h.t - 0.25) / 1.3)) + h.kin('It was *number 27* in the alphabet.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 2.0, stem: 'A letter? Made of what?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('A letter? *Made of what?*', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 3.6, stem: 'An E and a T, joined together. Et: Latin for and.', aha: 1.6, in: 'zweep', bron: SEP, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.6] }, geluid: [[1.1, 'whoosh', 0.5], [1.6, 'klap', 0.6]],
      teken: h => et(h, h.zacht((h.t - 0.7) / 1.0)) + h.kin('*E* + *t* = "et", Latin for *and*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 1.9, stem: 'Okay. But why ampersand?', camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('OK. But why "*ampersand*"?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.2, stem: 'Children ended the alphabet with it. X, Y, Z, and, per say, and.', in: 'zweep', bron: DIC, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'tik', 0.5], [2.2, 'tik', 0.5]],
      teken: h => krijt(h, h.klem((h.t - 0.2) / 0.5), (h.t - 2.4) / 0.4) + h.kin('X, Y, Z, *and per se and*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.0, stem: 'Per say means by itself. Say it fast, and it slurs into one word.', aha: 2.6, bron: SEP, bronStart: 1.4, camera: { zoom: [1.02, 1.07], stoot: [2.6] }, geluid: [[2.0, 'whoosh', 0.5], [2.6, 'klap', 0.6]],
      teken: h => pers(h, h.zacht((h.t - 1.6) / 1.3)) + h.kin('Say it fast: it *slurs into one word*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 2.6, stem: 'Ampersand. Go on. Ask me again.', in: 'zweep', aha: 0.2, camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => amp(h) + h.kin('*Ampersand.* Go on, ask me again.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
