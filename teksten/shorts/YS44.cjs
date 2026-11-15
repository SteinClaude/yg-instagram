// YS44 — Why are school buses yellow?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Eerste short met het watermerk
// (Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje").
// Bedoeling kanaal 1 (jesse-14, docs/manager/bedoeling-per-kanaal.md): educatief + leuk; eindigt met één zin om na te
// vertellen ("National School Bus Chrome") en een slot dat terugkoppelt naar de beginvraag ("why not red?").
// Bronnen (gelezen zo 15 nov 2026): Sean Hutchinson, "Why Are School Buses Yellow?", Mental Floss (30 jan 2013);
// "Why Is My School Bus Yellow?", The Children's Museum of Indianapolis (feb 2020).
// Niet gezegd: hoeveel staaltjes er hingen, het aantal regels, het geld van de conferentie, dat de verf lood bevatte, en
// "more orange than yellow" (staat niet in deze bronnen). Teachers College en Smithsonian gaven een fout of 403.
const MF = 'Mental Floss (2013)';
const CM = "The Children's Museum (2020)";

const BUS = '#F5B417', KRIJT = '#F4F1E6', GEEL = '#F2C230';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);

// Schoolbus van opzij; (x, y) is de grond onder de achterkant, het midden van de bus ligt op x + 21·s
const bus = (h, x, y, s, kleur, { tekst = false, op = 1 } = {}) => { const I = h.K.inkt;
  let r = `<g opacity="${op}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})"><ellipse cx="20" cy="4" rx="220" ry="14" fill="#000" opacity="0.18"/>`;
  r += `<rect x="-190" y="-162" width="342" height="134" rx="16" fill="${kleur}" stroke="${I}" stroke-width="7"/>`;
  r += `<path d="M 150 -104 L 206 -98 Q 224 -96 224 -78 L 224 -28 L 150 -28 Z" fill="${kleur}" stroke="${I}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = 0; i < 5; i++) r += `<rect x="${-174 + i * 62}" y="-148" width="48" height="44" rx="6" fill="#CFE6F2" stroke="${I}" stroke-width="4"/>`;
  r += `<rect x="116" y="-148" width="28" height="44" rx="6" fill="#CFE6F2" stroke="${I}" stroke-width="4"/><path d="M -190 -86 L 150 -86 M -190 -72 L 150 -72" stroke="${I}" stroke-width="5"/>`;
  if (tekst) r += `<text x="20" y="-38" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="26" fill="${I}">SCHOOL BUS</text>`;
  r += `<circle cx="216" cy="-62" r="7" fill="#FFF3C4" stroke="${I}" stroke-width="3"/><rect x="214" y="-40" width="18" height="14" rx="3" fill="${I}"/>`;
  for (const cx of [-118, 158]) r += `<circle cx="${cx}" cy="-26" r="30" fill="${I}"/><circle cx="${cx}" cy="-26" r="12" fill="#B9B6AA"/>`;
  return r + `</g>`; };
const op = (c, s) => c - 21 * s;   // x voor een bus met zijn midden op c
const vlakClip = id => `<clipPath id="${id}"><rect x="140" y="670" width="800" height="330"/></clipPath>`;

// Prikbord: de gele bus rijdt binnen en blijft staan
const binnen = (h, { rijd = true } = {}) => { const s = 1.2, x = op(540, s) + (rijd ? 600 * (1 - h.veer(h.klem((h.t - 0.05) / 0.6))) : 0);
  return vlakClip('v44a') + `<g clip-path="url(#v44a)">${bus(h, x, 975, s, BUS, { tekst: true })}</g>`; };

// Reclamebord: voor 1939 had elke bus een eigen kleur
const kleuren = (h, t0) => `<text x="540" y="760" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.signaal}" opacity="${zicht(h, 0.1)}">BEFORE 1939</text>`
  + [['#D9432B', 275], ['#3F6FB5', 540], ['#2F7D5B', 805]].map(([k, c], i) => { const q = pop(h, t0 + i * 0.22, 0.3), s = 0.6;
    return q <= 0 ? '' : `<g opacity="${zicht(h, t0 + i * 0.22)}" transform="translate(${c} 940) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-c} -940)">${bus(h, op(c, s), 975, s, k)}</g>`; }).join('');

// Schoolbord: professor Frank Cyr, 1939
const cyr = (h, tNaam, tJaar) => { const q = pop(h, tJaar);
  return `<text x="540" y="760" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="${GEEL}" opacity="${zicht(h, tNaam)}" letter-spacing="2">PROFESSOR FRANK CYR</text>`
    + (q > 0 ? `<text x="540" y="935" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(170 * (0.75 + 0.25 * q)).toFixed(0)}" fill="${KRIJT}" opacity="${zicht(h, tJaar)}">1939</text>` : ''); };

// Schoolbord: staaltjes van citroengeel tot oranjerood; op tKies wordt het goudgeel omcirkeld
const STAAL = ['#F7EA4A', '#F5DA3A', '#F2C82E', BUS, '#EE9A26', '#E87D25', '#DE6127', '#D4452A'];
const stalen = (h, t0, tKies) => STAAL.map((k, i) => { const q = pop(h, t0 + i * 0.09, 0.25), x = 178 + i * 92;
  return q <= 0 ? '' : `<g opacity="${zicht(h, t0 + i * 0.09, 0.08)}" transform="translate(${x + 35} ${720 + (1 - q) * 40})"><rect x="-35" y="0" width="70" height="210" rx="8" fill="${k}" stroke="#16161A" stroke-width="5"/></g>`; }).join('')
  + h.krabbel.cirkel(178 + 3 * 92 + 35, 822, 70, 124, { t: h.t, start: tKies, kleur: KRIJT })
  + `<text x="540" y="985" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${KRIJT}" opacity="${zicht(h, t0)}">lemon yellow  →  orange-red</text>`;

// Reclamebord in de vroege ochtend: de rode bus verdwijnt in het donker, de gele valt op
const ochtend = (h, tGeel) => { const g = h.klem((h.t - tGeel) / 0.5), s = 0.6;
  return vlakClip('v44b') + `<g clip-path="url(#v44b)"><rect x="140" y="670" width="800" height="330" fill="#27304D"/><ellipse cx="540" cy="1010" rx="520" ry="120" fill="#F2A65A" opacity="0.35"/>`
    + [[220, 700], [380, 730], [690, 705], [880, 740]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#FFFFFF" opacity="0.7"/>`).join('')
    + `<text x="540" y="728" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="32" fill="${KRIJT}" letter-spacing="3">EARLY MORNING · EVENING</text>`
    + bus(h, op(330, s), 975, s, '#D9432B', { op: (0.6 - 0.25 * g).toFixed(3) })
    + `<ellipse cx="750" cy="920" rx="${(150 + 30 * g).toFixed(1)}" ry="${(80 + 15 * g).toFixed(1)}" fill="#FFE7A8" opacity="${(0.1 + 0.3 * g).toFixed(3)}"/>`
    + bus(h, op(750, s), 975, s, BUS, { tekst: true }) + `</g>`; };

// Schoolbord: zijzicht, rood tegen geel
const zijzicht = (h, tRood, tGeel) => { const r = h.zacht(h.klem((h.t - tRood) / 0.5)), g = h.zacht(h.klem((h.t - tGeel) / 0.6)), L = 330;
  return `<text x="540" y="745" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${GEEL}" letter-spacing="3">SIDE VISION</text>`
    + `<text x="300" y="830" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="38" fill="${KRIJT}">red</text><rect x="320" y="796" width="${(L * r).toFixed(1)}" height="46" rx="8" fill="#D9432B"/>`
    + (r > 0.95 ? `<text x="${320 + L + 16}" y="832" font-family="IBM Plex Mono" font-weight="700" font-size="36" fill="${KRIJT}">1×</text>` : '')
    + `<text x="300" y="930" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="38" fill="${KRIJT}">yellow</text><rect x="320" y="896" width="${(L * 1.24 * g).toFixed(1)}" height="46" rx="8" fill="${BUS}"/>`
    + (g > 0.95 ? `<text x="${320 + L * 1.24 + 16}" y="934" font-family="Instrument Sans" font-weight="700" font-size="${(52 * (0.7 + 0.3 * pop(h, tGeel + 0.6))).toFixed(0)}" fill="${GEEL}">1.24×</text>` : ''); };

// Prikbord: een verfblik met de officiële naam
const blik = (h, tNaam, { intro = true } = {}) => { const I = h.K.inkt, q = intro ? pop(h, 0, 0.35) : 1, n = pop(h, tNaam);
  return `<g opacity="${intro ? zicht(h, 0, 0.08) : 1}" transform="translate(540 860) scale(${(0.7 + 0.3 * q).toFixed(3)}) translate(-540 -860)">`
    + `<path d="M 415 742 Q 540 690 665 742" fill="none" stroke="${I}" stroke-width="6"/>`
    + `<path d="M 400 742 L 400 970 Q 540 1000 680 970 L 680 742 Z" fill="#D9D6CC" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
    + `<ellipse cx="540" cy="742" rx="140" ry="22" fill="#B9B6AA" stroke="${I}" stroke-width="6"/><path d="M 470 744 Q 466 790 476 800 Q 486 790 482 750 Z" fill="${BUS}" stroke="${I}" stroke-width="3"/>`
    + `<path d="M 400 790 L 680 790 L 680 942 Q 540 966 400 942 Z" fill="${BUS}" stroke="${I}" stroke-width="5"/>`
    + `<g opacity="${n.toFixed(3)}"><text x="540" y="834" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="30" fill="${I}">NATIONAL</text>`
    + `<text x="540" y="876" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="30" fill="${I}">SCHOOL BUS</text>`
    + `<text x="540" y="924" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="44" fill="${I}">CHROME</text></g></g>`; };

module.exports = {
  code: 'YS44',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-19-YS44-school-bus',
  nummer: 'No. 44',
  onderwerp: 'THE SCHOOL BUS',
  pakket: {
    dag: 'donderdag 19 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why are school buses yellow?',
    intro: 'School buses had no standard colour until 1939. Then a professor gathered experts, lined up shades from lemon yellow to orange-red, and picked the one that is easiest to see in the early morning.',
    feiten: ['Before the 1939 conference, Frank Cyr "learned there were no standards for the color of school transportation" (The Children\'s Museum of Indianapolis).',
      '"Columbia University professor Frank Cyr organized a conference at Teachers College" "to establish national standards for school buses." (Mental Floss)',
      'The group "laid out a wide array of shades from light lemon-yellow to dark orange-red" "along the wall" (Mental Floss).',
      'The chosen yellow "is the easiest color to see during the early morning and evening hours when buses operate." (Mental Floss)',
      '"Lateral peripheral vision for detecting yellows is 1.24 times greater than for red." (The Children\'s Museum of Indianapolis)',
      'The colour was "dubbed \'National School Bus Chrome\'" (The Children\'s Museum of Indianapolis).'],
    bronnen: [['Sean Hutchinson, "Why Are School Buses Yellow?", Mental Floss (January 30, 2013)', 'https://www.mentalfloss.com/transportation/cars-trucks/why-are-school-buses-yellow'],
      ['"Why Is My School Bus Yellow?", The Children\'s Museum of Indianapolis (February 2020)', 'https://childrensmuseum.org/stories/why-school-bus-yellow']],
    hashtags: '#Shorts #history #schoolbus #everydaythings',
    tags: 'school bus, why are school buses yellow, school bus yellow, national school bus chrome, frank cyr, 1939, school bus history, colour, peripheral vision, history of everyday things, why things are the way they are, shorts',
    md: [['Sean Hutchinson, "Why Are School Buses Yellow?", Mental Floss (30 jan 2013)', 'https://www.mentalfloss.com/transportation/cars-trucks/why-are-school-buses-yellow',
      ['"Columbia University professor Frank Cyr organized a conference at Teachers College"', '"to establish national standards for school buses."',
        '"the group laid out a wide array of shades from light lemon-yellow to dark orange-red"', '"along the wall in one of the rooms of Columbia\'s Grace Dodge Hall"',
        '"Golden yellow was ultimately chosen by the specialists because the distinctive tint"', '"is the easiest color to see during the early morning and evening hours when buses operate."']],
      ['"Why Is My School Bus Yellow?", The Children\'s Museum of Indianapolis (feb 2020; geen auteur op de pagina)', 'https://childrensmuseum.org/stories/why-school-bus-yellow',
      ['"Prior to the conference, Cyr had conducted his own research"', '"he learned there were no standards for the color of school transportation"',
        '"that included the standardized yellow paint color, dubbed \\"National School Bus Chrome,\\""',
        '"Lateral peripheral vision for detecting yellows is 1.24 times greater than for red."']]],
    niet: '- Niet gezegd: hoeveel staaltjes er hingen, het aantal regels van de conferentie, het geld ervoor, dat de verf lood bevatte en "more orange than yellow" (staat niet in deze twee bronnen). De zin over zijzicht komt van het museum; op het scherm staat het getal 1.24 zoals de bron het geeft, de balkjes zijn een tekening en geen meting. Bussen, borden, verfblik, decors en figuren zijn eigen tekenwerk; geen merk of echte bus in beeld.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.8, stem: 'Why are school buses yellow? Why not red, or blue?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], [0.1, 'whoosh', 0.4]],
      teken: h => binnen(h) + h.krabbel.cirkel(540, 860, 300, 135, { t: h.t, start: h.op('yellow', 1.1) }) + h.kin('Why are school buses *yellow*?', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'straat', duur: 3.6, stem: 'Ooh! Before nineteen thirty-nine, school buses had no standard colour at all.', in: 'zweep', bron: CM, bronStart: 'standard', camera: { zoom: [1, 1.05] }, geluid: [['standard', 'pop', 0.5]],
      teken: h => kleuren(h, h.op('school', 1.6)) + h.kin('Before *1939*: no standard colour!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'straat', shot: 'dichtbij', duur: 1.5, stem: 'So who picked yellow?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('So who picked *yellow*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.2, stem: 'Professor Frank Cyr! In nineteen thirty-nine, he gathered experts to set school bus rules.', in: 'zweep', bron: MF, bronStart: 'experts', camera: { zoom: [1, 1.05] }, geluid: [['nineteen', 'klap', 0.5]],
      teken: h => cyr(h, h.op('professor', 0.1), h.op('nineteen', 1.4)) + h.kin('Professor *Frank Cyr*, *1939*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.8, stem: 'They lined up shades on a wall, from lemon yellow to orange-red, and picked one.', bron: MF, bronStart: 'lemon', camera: { zoom: [1.02, 1.07] }, geluid: [['lemon', 'tik', 0.5], ['picked', 'pop', 0.6]],
      teken: h => stalen(h, h.op('lined', 0.2), h.op('picked', 3.0)) + h.kin('From *lemon* to *orange-red*…', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.4, stem: 'Wait, why that one?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Wait, why *that* one?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'straat', duur: 4.0, stem: "It's the easiest colour to see in the early morning and evening, exactly when buses drive!", in: 'zweep', bron: MF, bronStart: 'easiest', camera: { zoom: [1, 1.06] }, geluid: [['easiest', 'stijg', 0.4], ['exactly', 'klap', 0.5]],
      teken: h => ochtend(h, h.op('easiest', 0.6)) + h.kin('Easiest to see in the *early morning*.', { y: 300, g: 98, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.8, stem: 'Plus, your side vision catches yellow better than red. One point two four times better!', bron: CM, bronStart: 'one', camera: { zoom: [1.02, 1.07] }, geluid: [['red', 'tik', 0.5], ['one', 'klap', 0.6]],
      teken: h => zijzicht(h, h.op('side', 0.6), h.op('yellow', 1.6)) + h.kin('Side vision: *1.24×* better than red.', { y: 300, g: 98, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 2.0, stem: 'No way! So the colour is just called yellow?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin("It's just called *yellow*?", { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.4, stem: "Nope! It's National School Bus Chrome. Now ask me again: why not red?", in: 'zweep', pose: { antwoord: 'verbaasd' }, bron: CM, bronStart: 'national', camera: { zoom: [1.03, 1.0] }, geluid: [['chrome', 'pop', 0.6], [-0.6, 'stijg', 0.5]],
      teken: h => blik(h, h.op('national', 0.4)) + h.kin('*National School Bus Chrome*!', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
  ],
};
