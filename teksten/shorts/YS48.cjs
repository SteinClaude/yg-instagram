// YS48 — Why are flamingos pink?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors. Met watermerk (Andries zo 15 nov 2026 ±12:50 en ±13:26).
// Gemaakt na "Ja, maak ze" (Andries wo 18 nov 2026 ±14:31) en "Eén short van 818 (Recommended)" (±16:59): het
// stemtegoed tot 14 dec is bijna op, dus een plafond van 800 tekens.
// Bronnen (gelezen wo 18 nov 2026): Mehgan Murphy, "Why Are Flamingos Pink? And Other Flamingo Facts", Smithsonian's
// National Zoo & Conservation Biology Institute (29 jun 2021, bijgewerkt 29 mei 2025); San Diego Zoo Wildlife
// Alliance, "Flamingo" (Animals & Plants, geen datum).
// Niet gezegd: lever, de naam van het pigment in dierentuinvoer, "net als in wortels", dat flamingo's zonder dat voer
// wit worden (alleen: ouders die hun jongen voeren, verbleken; San Diego Zoo).
const NZ = "Smithsonian's National Zoo";
const SDZ = 'San Diego Zoo';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', GROEN = '#5FA35A', ROZE = '#F28FB3', GRIJS = '#CFCBC4';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
const pijl = (x1, y, x2, kleur = I, op = 1) => `<g opacity="${op}"><path d="M ${x1} ${y} L ${x2 - 18} ${y}" stroke="${kleur}" stroke-width="8" stroke-linecap="round"/><path d="M ${x2} ${y} l -26 -16 l 0 32 Z" fill="${kleur}"/></g>`;
// Kleur mengen (hex), t van 0 (a) naar 1 (b)
const mix = (a, b, t) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join(''); };

// Flamingo, voeten op (x, y), schaal s, kijkt naar rechts. kop 'omhoog' of 'omlaag' (eten, kop ondersteboven in het water)
const flamingo = (x, y, s, kleur, { kop = 'omhoog' } = {}) => {
  const donker = mix(kleur, '#7A2E4A', 0.35);
  const nek = kop === 'omhoog' ? 'M 40 -172 C 95 -200 -25 -240 14 -284' : 'M 40 -168 C 110 -150 95 -70 78 -30';
  const hoofd = kop === 'omhoog'
    ? `<circle cx="20" cy="-288" r="15" fill="${kleur}" stroke="${I}" stroke-width="5"/><circle cx="24" cy="-292" r="3.5" fill="${I}"/><path d="M 32 -294 Q 56 -292 58 -272 L 48 -276 Q 46 -284 33 -284 Z" fill="#F4F1E6" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M 58 -272 L 48 -276 L 52 -284 Q 57 -280 58 -272 Z" fill="${I}"/>`
    : `<circle cx="78" cy="-24" r="15" fill="${kleur}" stroke="${I}" stroke-width="5"/><circle cx="82" cy="-28" r="3.5" fill="${I}"/><path d="M 70 -12 Q 64 10 46 10 L 50 0 Q 58 -2 62 -14 Z" fill="#F4F1E6" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M 46 10 L 50 0 L 56 3 Q 52 9 46 10 Z" fill="${I}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<ellipse cx="0" cy="4" rx="40" ry="7" fill="#000" opacity="0.12"/>`
    + `<path d="M -6 -128 L -6 0 M 10 -128 L 22 -78 L 6 -70" fill="none" stroke="${donker}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="M -70 -168 Q -40 -205 25 -190 Q 62 -178 50 -150 Q 30 -125 -20 -132 Q -60 -138 -70 -168 Z" fill="${kleur}" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
    + `<path d="M -40 -168 Q -10 -180 20 -168" fill="none" stroke="${donker}" stroke-width="4" stroke-linecap="round"/>`
    + `<path d="${nek}" fill="none" stroke="${I}" stroke-width="22" stroke-linecap="round"/><path d="${nek}" fill="none" stroke="${kleur}" stroke-width="13" stroke-linecap="round"/>`
    + hoofd + `</g>`;
};
// Kuiken: grijs donsbolletje
const kuiken = (x, y, s, kleur = GRIJS) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="34" ry="6" fill="#000" opacity="0.12"/>`
  + `<path d="M -8 -30 L -8 0 M 8 -30 L 8 0" stroke="#7B776F" stroke-width="5" stroke-linecap="round"/>`
  + `<circle cx="0" cy="-58" r="36" fill="${kleur}" stroke="${I}" stroke-width="5"/><circle cx="20" cy="-104" r="22" fill="${kleur}" stroke="${I}" stroke-width="5"/>`
  + `<circle cx="27" cy="-108" r="3.5" fill="${I}"/><path d="M 40 -106 L 56 -100 L 40 -96 Z" fill="#3A3F47" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`
  + `<path d="M -26 -74 q -8 -6 -4 -14 M -30 -52 q -10 0 -10 -8" fill="none" stroke="#9C988F" stroke-width="3" stroke-linecap="round"/></g>`;
// Garnaaltje en alg
const garnaal = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -34 -8 Q -30 -36 0 -36 Q 34 -34 36 0 Q 30 22 8 20 Q 20 6 14 -8 Q 4 -20 -14 -16 Z" fill="#F08A5D" stroke="${I}" stroke-width="4" stroke-linejoin="round"/>`
  + `<path d="M -6 -34 q 6 10 4 20 M 10 -32 q 6 10 2 22 M 24 -22 q 2 10 -4 18" fill="none" stroke="#B5532F" stroke-width="3" stroke-linecap="round"/><circle cx="-24" cy="-22" r="3.5" fill="${I}"/>`
  + `<path d="M -32 -14 q -18 -14 -12 -32 M -30 -18 q -24 -4 -26 -22" fill="none" stroke="${I}" stroke-width="2.5" stroke-linecap="round"/></g>`;
const alg = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[[-16, 0, 14], [6, -10, 17], [18, 10, 12], [-4, 16, 11]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${GROEN}" stroke="${I}" stroke-width="3.5"/>`).join('')}</g>`;
// Water (op het vlak)
const water = (y, x1 = 170, x2 = 910) => `<path d="M ${x1} ${y} L ${x2} ${y}" stroke="#4E8FB8" stroke-width="5" stroke-linecap="round"/>`
  + [0, 1, 2].map(i => `<path d="M ${x1 + 60 + i * 230} ${y + 22} q 20 -10 40 0 q 20 10 40 0" fill="none" stroke="#4E8FB8" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`).join('');

// Scène 1 (kamer): roze flamingo, en een grijs kuiken dat erbij komt op "born"
const vraag1 = h => { const q = pop(h, 0, 0.35), k = pop(h, h.op('born', 2.2));
  return sch(420, 990, q, flamingo(420, 990, 1.05, ROZE)) + (k > 0 ? sch(700, 990, k, kuiken(700, 990, 1.15)) + label(700, 760, 'BORN?', ROOD, Math.min(1, k).toFixed(3), 36) : ''); };

// Scène 2 (haven): kuiken → pijl → roze flamingo
const later = h => { const a = pop(h, 0, 0.35), b = pop(h, h.op('pink', 1.6)), c = pop(h, h.op('food', 2.6));
  return sch(300, 985, a, kuiken(300, 985, 1.15)) + label(300, 730, 'CHICK', I, zicht(h, 0.3), 30)
    + (b > 0 ? pijl(400, 880, 560, I, Math.min(1, b)) + sch(700, 990, b, flamingo(700, 990, 1.0, ROZE)) : '')
    + (c > 0 ? label(480, 840, 'FOOD', ROOD, Math.min(1, c).toFixed(3), 30) : ''); };

// Scène 3 (haven): algen en garnaaltjes, "CAROTENOIDS"
const voer = h => { const a = pop(h, h.op('algae', 0.8)), b = pop(h, h.op('shrimp', 1.6)), c = pop(h, h.op('carotenoids', 3.0));
  return water(905) + (a > 0 ? sch(320, 830, a, alg(300, 830, 2.0)) + label(310, 740, 'ALGAE', GROEN, Math.min(1, a).toFixed(3), 32) : '')
    + (b > 0 ? sch(760, 830, b, garnaal(760, 840, 2.1)) + label(760, 740, 'SHRIMP', '#C25A30', Math.min(1, b).toFixed(3), 32) : '')
    + (c > 0 ? label(540, 975, 'CAROTENOIDS', ROOD, Math.min(1, c).toFixed(3), 40) : ''); };

// Scène 5 (klas): garnaal → flamingo die van wit naar roze kleurt
const kleuren = h => { const t0 = h.op('feathers', 1.8), u = h.zacht(h.klem((h.t - t0) / 1.4));
  return sch(270, 840, pop(h, 0, 0.3), garnaal(270, 860, 1.8)) + pijl(370, 850, 520, KRIJT, zicht(h, 0.5))
    + flamingo(700, 990, 1.0, mix('#F4F1E6', ROZE, u)) + label(870, 820, 'PINK!', ROZE, (u > 0.6 ? 1 : 0).toFixed(3), 34); };

// Scène 6 (haven): eten met de kop ondersteboven in het water
const eten = h => { const q = pop(h, 0, 0.35), d = pop(h, h.op('filter', 2.2));
  return water(960) + sch(480, 975, q, flamingo(480, 975, 1.05, ROZE, { kop: 'omlaag' }))
    + (d > 0 ? `<g opacity="${Math.min(1, d).toFixed(3)}">${[0, 1, 2, 3, 4].map(i => `<circle cx="${560 + i * 22}" cy="${948 + (i % 2) * 14}" r="5" fill="#F08A5D"/>`).join('')}</g>` + label(770, 820, 'UPSIDE', I, Math.min(1, d).toFixed(3), 32) + label(770, 856, 'DOWN!', I, Math.min(1, d).toFixed(3), 32) : ''); };

// Scène 8 (kamer): dierentuinvoer met pigment
const dierentuin = h => { const q = pop(h, 0, 0.35), p = pop(h, h.op('pigment', 1.6));
  const kom = `<path d="M 200 900 L 420 900 Q 410 975 310 975 Q 210 975 200 900 Z" fill="#E7E1D3" stroke="${I}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${235 + i * 30}" cy="${893 - (i % 2) * 8}" r="11" fill="#C98B5A" stroke="${I}" stroke-width="3"/>`).join('');
  return sch(310, 930, q, kom) + label(310, 790, 'ZOO FOOD', I, zicht(h, 0.3), 28)
    + (p > 0 ? label(310, 845, '+ PIGMENT', ROOD, Math.min(1, p).toFixed(3), 32) : '') + sch(700, 990, pop(h, 0.3), flamingo(700, 990, 1.0, ROZE)); };

// Scène 10 (haven): ouder voert kuiken en verbleekt
const verbleken = h => { const u = h.zacht(h.klem((h.t - h.op('fade', 1.4)) / 1.6));
  return flamingo(430, 990, 1.0, mix(ROZE, '#F7F2EC', u)) + kuiken(720, 990, 0.95)
    + `<path d="M 520 760 Q 610 730 660 800" fill="none" stroke="${I}" stroke-width="5" stroke-dasharray="10 9" opacity="${zicht(h, 0.4)}"/>`
    + label(230, 800, u > 0.5 ? 'PALE' : 'PARENT', u > 0.5 ? '#B98EA0' : I, zicht(h, 0.3), 30); };

// Scène 11 (kamer): slot: roze flamingo met garnaal
const slot = h => sch(470, 990, pop(h, 0, 0.35), flamingo(470, 990, 1.05, ROZE)) + sch(760, 860, pop(h, h.op('eat', 1.0)), garnaal(760, 870, 1.6));

module.exports = {
  code: 'YS48',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3"
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stemPlafond: 800,   // laatste stemtegoed tot 14 dec ("Eén short van 818 (Recommended)", Andries wo 18 nov 2026 ±16:59)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-23-YS48-flamingo',
  nummer: 'No. 48',
  onderwerp: 'FLAMINGOS',
  pakket: {
    dag: 'maandag 23 november 2026', tijd: '20:00',   // 20:00-short (nieuw ritme, Andries ma 16 nov 2026 ±20:40)
    gelezen: 'wo 18 nov 2026',
    titel: 'Why are flamingos pink?',
    intro: 'Flamingos aren\'t born pink. Chicks hatch white and gray, and the pink comes from what they eat: algae and brine shrimp full of pigments called carotenoids.',
    feiten: ['"Flamingo chicks hatch with white-gray, downy feathers and straight bills." (Smithsonian\'s National Zoo)',
      '"As a flamingo dines on algae and brine shrimp, its body metabolizes the pigments — turning its feathers pink." "Flamingos really are what they eat." (Smithsonian\'s National Zoo)',
      'To eat, a flamingo places its head upside down in the water; comb-like plates along the bill act as a filter. (Smithsonian\'s National Zoo)',
      'In zoos, their food includes "a pigment that helps keep them \'in the pink.\'" Parents feeding their chicks are "drained of their color" and can turn "a pale pink or white!" (San Diego Zoo)'],
    bronnen: [['Mehgan Murphy, "Why Are Flamingos Pink? And Other Flamingo Facts", Smithsonian\'s National Zoo & Conservation Biology Institute (June 29, 2021; updated May 29, 2025)', 'https://nationalzoo.si.edu/animals/news/why-are-flamingos-pink-and-other-flamingo-facts'],
      ['San Diego Zoo Wildlife Alliance, "Flamingo", Animals & Plants', 'https://animals.sandiegozoo.org/animals/flamingo']],
    hashtags: '#Shorts #flamingo #animals #everydaythings',
    tags: 'flamingo, flamingos, why are flamingos pink, pink flamingo, carotenoids, brine shrimp, algae, animal facts, birds, you are what you eat, why things are the way they are, shorts',
    md: [['Mehgan Murphy, "Why Are Flamingos Pink? And Other Flamingo Facts", Smithsonian\'s National Zoo (29 jun 2021, bijgewerkt 29 mei 2025)', 'https://nationalzoo.si.edu/animals/news/why-are-flamingos-pink-and-other-flamingo-facts',
      ['"Flamingo chicks hatch with white-gray, downy feathers and straight bills."',
        '"Many plants produce natural red, yellow or orange pigments, called carotenoids."',
        '"As a flamingo dines on algae and brine shrimp, its body metabolizes the pigments — turning its feathers pink."',
        '"Flamingos really are what they eat."',
        '"When it\'s time to eat, a flamingo will place its head upside down in the water with its bill pointed at its feet."',
        '"Comb-like plates along the edge of the bill create a filter for water to rush out, while trapping food inside."']],
      ['San Diego Zoo Wildlife Alliance, "Flamingo" (geen datum)', 'https://animals.sandiegozoo.org/animals/flamingo',
      ['"The flamingo\'s pink or reddish color comes from the rich sources of carotenoid pigments" (in hun voedsel).',
        'Dierentuinvoer bevat "a pigment that helps keep them \'in the pink.\'"',
        '"As the parents feed their chicks the crop milk, they are drained of their color"; het verenkleed kan "a pale pink or white!" worden.']]],
    niet: '- Niet gezegd: de lever, de naam van het pigment in dierentuinvoer, "net als in wortels", en dat flamingo\'s zonder dat voer wit worden; wel (San Diego Zoo) dat ouders die hun jongen voeren verbleken. "Processes the pigments" volgt "metabolizes the pigments" (National Zoo). Flamingo\'s, kuiken, garnaal, algen, voerbak, decors en figuren zijn eigen tekenwerk.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 3.0, stem: 'Why are flamingos pink? Wait, they aren\'t even born pink?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['born', 'pop', 0.5]],
      teken: h => vraag1(h) + h.kin('Why are flamingos *pink*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 3.6, stem: 'Nope! Flamingo chicks hatch white and gray. The pink comes later, from their food.', in: 'zweep', bron: NZ, bronStart: 'chicks', camera: { zoom: [1, 1.05] }, geluid: [['chicks', 'pop', 0.5], ['pink', 'whoosh', 0.4], ['food', 'tik', 0.5]],
      teken: h => later(h) + h.kin('Born *gray*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 4.2, stem: 'They eat algae and tiny brine shrimp, full of red and orange pigments called carotenoids.', bron: NZ, bronStart: 'algae', camera: { zoom: [1.02, 1.06] }, geluid: [['algae', 'pop', 0.5], ['shrimp', 'pop', 0.5], ['carotenoids', 'tik', 0.5]],
      teken: h => voer(h) + h.kin('Pink *food*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'haven', shot: 'dichtbij', duur: 1.8, stem: 'So the color comes from the food?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('From the *food*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.4, stem: 'Yep! Their body processes those pigments, and their feathers turn pink.', bron: NZ,   // geen 'zweep': resvg liep hier vast (wo 18 nov) bronStart: 'body', camera: { zoom: [1, 1.05] }, geluid: [['pigments', 'tik', 0.5], ['pink', 'stijg', 0.4]],
      teken: h => kleuren(h) + h.kin('Feathers turn *pink*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 3.6, stem: 'And they eat with their heads upside down, using their bill as a filter!', bron: NZ, bronStart: 'upside', camera: { zoom: [1.02, 1.06] }, geluid: [['upside', 'whoosh', 0.5], ['filter', 'pop', 0.5]],
      teken: h => eten(h) + h.kin('Dinner *upside down*!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.5, stem: 'And in a zoo?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And in a *zoo*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.0, stem: 'Zoos add a pigment to their food to keep them pink.', in: 'zweep', bron: SDZ, bronStart: 'Zoos', camera: { zoom: [1, 1.05] }, geluid: [['pigment', 'pop', 0.5]],
      teken: h => dierentuin(h) + h.kin('A *pigment* in the food.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'haven', shot: 'dichtbij', duur: 1.8, stem: 'Can a flamingo lose its pink?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Can it *lose* the pink?', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 3.8, stem: 'Yes! Parents feeding their chicks can fade to pale pink, or even white.', in: 'zweep', bron: SDZ, bronStart: 'Parents', camera: { zoom: [1.02, 1.06] }, geluid: [['fade', 'whoosh', 0.5], ['white', 'pop', 0.5]],
      teken: h => verbleken(h) + h.kin('Parents *fade*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 2.8, stem: 'So flamingos really are what they eat!', pose: { antwoord: 'verbaasd' }, bron: NZ, bronStart: 'flamingos', camera: { zoom: [1.03, 1.0] }, geluid: [['eat', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('You are what you *eat*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
