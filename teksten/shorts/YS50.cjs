// YS50 — Why are so many pencils yellow?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors. Met watermerk (Andries zo 15 nov 2026 ±12:50 en ±13:26).
// Gemaakt na "Ja, nu al" (Andries wo 25 nov 2026 ±19:53, op "Nieuwe duo-filmpjes nu al maken voor de lege plekken?").
// Bronnen (uitgezocht wo 18 nov 2026, docs/bronnen-voorraad.md): Joe Schwarcz, "Pencils never contained lead", McGill
// Office for Science and Society (22 feb 2017); Caroline Weaver, "The Geography of Pencil History: Czech Republic",
// CW Pencils (2018); Paul Anthony Jones, "Why Are Pencils Yellow?", Mental Floss (2026).
// Niet gezegd: "75 %" van de potloden, 1890 (het is 1889), waarom anderen geel overnamen (alleen dát ze het deden).
const CW = 'CW Pencils';
const MF = 'Mental Floss';
const MG = 'McGill OSS';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', GROEN = '#5FA35A', BLAUW = '#4E8FB8', GRIJS = '#6E7179', KLEI = '#B9876A';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
const pijl = (x1, y, x2, kleur = I, op = 1) => `<g opacity="${op}"><path d="M ${x1} ${y} L ${x2 - 18} ${y}" stroke="${kleur}" stroke-width="8" stroke-linecap="round"/><path d="M ${x2} ${y} l -26 -16 l 0 32 Z" fill="${kleur}"/></g>`;

// Potlood, midden op (x, y), schuin onder hoek, lengte l. kleur van de lak
const potlood = (x, y, hoek = -30, s = 1, kleur = GEEL) => `<g transform="translate(${x} ${y}) rotate(${hoek}) scale(${s})">`
  + `<rect x="-160" y="-22" width="260" height="44" fill="${kleur}" stroke="${I}" stroke-width="5"/>`
  + `<path d="M -160 -7 L 100 -7 M -160 7 L 100 7" stroke="#000" stroke-width="2" stroke-opacity="0.18"/>`
  + `<rect x="-200" y="-22" width="40" height="44" rx="8" fill="#E89BA6" stroke="${I}" stroke-width="5"/><rect x="-168" y="-24" width="14" height="48" fill="#B8B8B8" stroke="${I}" stroke-width="4"/>`
  + `<path d="M 100 -22 L 170 0 L 100 22 Z" fill="#E9C9A0" stroke="${I}" stroke-width="5" stroke-linejoin="round"/><path d="M 148 -7 L 170 0 L 148 7 Z" fill="${GRIJS}"/></g>`;
// Diamant
const diamant = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -70 -40 L -40 -80 L 40 -80 L 70 -40 L 0 60 Z" fill="#CFEFFF" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
  + `<path d="M -70 -40 L 70 -40 M -40 -80 L -20 -40 L 0 -80 L 20 -40 L 40 -80 M -20 -40 L 0 60 L 20 -40" fill="none" stroke="${I}" stroke-width="3"/>`
  + `<path d="M 60 -95 l 6 14 l 14 6 l -14 6 l -6 14 l -6 -14 l -14 -6 l 14 -6 Z" fill="${KRIJT}"/></g>`;
// Kroon
const kroon = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -80 30 L -90 -50 L -45 -10 L 0 -70 L 45 -10 L 90 -50 L 80 30 Z" fill="${GEEL}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
  + `<rect x="-82" y="30" width="164" height="26" rx="6" fill="${GEEL}" stroke="${I}" stroke-width="6"/>`
  + [-50, 0, 50].map(a => `<circle cx="${a}" cy="43" r="7" fill="${ROOD}"/>`).join('') + `</g>`;
// Tentoonstellingshal met vlaggen (Parijs 1889)
const hal = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -200 0 L -200 -150 Q 0 -280 200 -150 L 200 0 Z" fill="#E7E1D3" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
  + [-120, -40, 40, 120].map(a => `<rect x="${a - 22}" y="-110" width="44" height="110" rx="20" fill="#9FB7C9" stroke="${I}" stroke-width="4"/>`).join('')
  + [-150, 0, 150].map((a, i) => `<path d="M ${a} ${-215 + Math.abs(a) * 0.45} l 0 -60" stroke="${I}" stroke-width="4"/><path d="M ${a} ${-275 + Math.abs(a) * 0.45} l 40 12 l -40 12 Z" fill="${[ROOD, BLAUW, GEEL][i]}" stroke="${I}" stroke-width="3"/>`).join('')
  + `</g>`;
// Brok grafiet en klompje klei
const brok = (x, y, kleur, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -70 0 L -55 -60 L -10 -85 L 45 -70 L 72 -20 L 55 0 Z" fill="${kleur}" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
  + `<path d="M -30 -60 L -5 -30 M 20 -64 L 30 -30" stroke="#FFF" stroke-width="3" opacity="0.35"/></g>`;

// Scène 1 (klas): een bos gele potloden
const vraag1 = h => { const q = pop(h, 0, 0.35);
  return [[-40, 330, 920], [-25, 540, 905], [-50, 760, 935]].map(([hk, x, y], i) => sch(x, y, pop(h, i * 0.15, 0.35), potlood(x, y, hk, 0.8))).join('') + label(540, 775, 'YELLOW?', GEEL, zicht(h, h.op('yellow', 1.2)), 44); };
// Scène 2 (museum): diamant, hal, China (teaser)
const teaser = h => { const a = pop(h, h.op('diamond', 0.9)), b = pop(h, h.op('fair', 1.6)), c = pop(h, h.op('China', 2.4));
  return (a > 0 ? sch(250, 850, a, diamant(250, 850, 1.1)) : '') + (b > 0 ? sch(560, 990, b, hal(560, 990, 0.8)) : '') + (c > 0 ? sch(860, 870, c, kroon(860, 870, 0.9)) : ''); };
// Scène 3 (museum): Parijs 1889, het gele potlood op een sokkel
const parijs = h => { const q = pop(h, 0, 0.35), p = pop(h, h.op('yellow', 2.6));
  return sch(330, 1000, q, hal(330, 1000, 0.85)) + label(330, 770, 'PARIS 1889', I, zicht(h, h.op('1889', 0.6)), 36)
    + (p > 0 ? sch(780, 880, p, potlood(780, 880, -60, 0.75)) + `<rect x="710" y="975" width="140" height="18" rx="6" fill="#B79E7E" stroke="${I}" stroke-width="5" opacity="${Math.min(1, p).toFixed(3)}"/>` : ''); };
// Scène 5 (plein): grafiet uit China, geel = koninklijk en respect
const china = h => { const a = pop(h, h.op('graphite', 0.8)), b = pop(h, h.op('royalty', 2.6));
  return (a > 0 ? sch(290, 930, a, brok(290, 930, GRIJS, 1.1)) + label(290, 790, 'GRAPHITE', I, Math.min(1, a).toFixed(3), 32) + label(290, 985, 'FROM CHINA?', I, Math.min(1, a).toFixed(3), 28) : '')
    + (b > 0 ? sch(760, 900, b, kroon(760, 900, 1.0)) + label(760, 790, 'ROYALTY', '#C9930F', Math.min(1, b).toFixed(3), 36) + label(760, 985, '+ RESPECT', I, Math.min(1, b).toFixed(3), 30) : ''); };
// Scène 6 (museum): vernoemd naar de diamant
const kohinoor = h => { const q = pop(h, 0, 0.35), d = pop(h, h.op('Koh-i-Noor', 2.0));
  return sch(310, 880, q, potlood(310, 880, -30, 0.85)) + pijl(470, 880, 610, I, zicht(h, 0.6)) + sch(780, 860, d, diamant(780, 860, 1.1))
    + label(780, 990, 'KOH-I-NOOR', I, Math.min(1, d).toFixed(3), 34); };
// Scène 8 (klas): anderen schilderen hun potloden ook geel
const kopie = h => [0, 1, 2, 3].map(i => { const t0 = h.op('yellow', 1.6) + i * 0.25, u = h.zacht(h.klem((h.t - t0) / 0.5));
  const k = u > 0.5 ? GEEL : ['#7FA3C6', '#9AC27F', '#C98FBF', '#E0A060'][i];
  return potlood(240 + i * 200, 885, -70, 0.65, k); }).join('');
// Scène 10 (klas): geen lood, wel grafiet en klei
const geenLood = h => { const a = pop(h, 0, 0.35), b = pop(h, h.op('graphite', 1.8)), c = pop(h, h.op('clay', 2.6));
  return sch(540, 790, a, `<g><text x="540" y="830" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="100" fill="${KRIJT}">Pb</text><path d="M 460 750 L 620 850" stroke="${ROOD}" stroke-width="14" stroke-linecap="round"/></g>`)
    + label(540, 885, 'NO LEAD', '#FF7A62', Math.min(1, a).toFixed(3), 36)
    + (b > 0 ? sch(300, 950, b, brok(300, 950, '#9A9DA6', 0.8)) + label(300, 995, 'GRAPHITE', KRIJT, Math.min(1, b).toFixed(3), 28) : '')
    + (c > 0 ? sch(780, 950, c, brok(780, 950, KLEI, 0.8)) + label(780, 995, 'CLAY', KRIJT, Math.min(1, c).toFixed(3), 28) : ''); };
// Scène 11 (kamer): slot: potlood met kroontje
const slot = h => sch(450, 875, pop(h, 0, 0.35), potlood(450, 875, -30, 0.85)) + sch(730, 820, pop(h, h.op('royalty', 1.0)), kroon(730, 820, 0.7));

module.exports = {
  code: 'YS50',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3"
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stemPlafond: 1500,   // ElevenLabs staat sinds 25 nov op Creator (ruim tegoed)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-28-YS50-gele-potloden',
  nummer: 'No. 50',
  onderwerp: 'PENCILS',
  pakket: {
    dag: 'zaterdag 28 november 2026', tijd: '20:00',
    gelezen: 'wo 18 nov 2026',
    titel: 'Why are so many pencils yellow?',
    intro: 'It goes back to the 1889 World\'s Fair in Paris, where a pencil maker showed off a yellow pencil named after a famous diamond. And the twist: pencils never had lead in them.',
    feiten: ['A yellow pencil was introduced at the 1889 World\'s Fair in Paris. (CW Pencils; Mental Floss)',
      'The best graphite was believed to come from China, and yellow was chosen "because of its connotations of royalty and respect in Chinese culture." (CW Pencils)',
      'The pencil was named after the Koh-i-Noor diamond. (CW Pencils)',
      'Other pencil makers then painted their pencils yellow too. (CW Pencils; Mental Floss)',
      '"Lead pencils do not contain any lead": the core is graphite mixed with clay. (McGill Office for Science and Society)'],
    bronnen: [['Caroline Weaver, "The Geography of Pencil History: Czech Republic", CW Pencils (2018)', 'https://www.cwpencils.com/blog-archive/the-geography-of-pencil-history-czech-republic'],
      ['Paul Anthony Jones, "Why Are Pencils Yellow?", Mental Floss (2026)', 'https://www.mentalfloss.com/history/why-pencils-are-yellow'],
      ['Joe Schwarcz, "Pencils never contained lead", McGill Office for Science and Society (February 22, 2017)', 'https://www.mcgill.ca/oss/article/did-you-know/pencils-never-contained-lead']],
    hashtags: '#Shorts #pencils #history #everydaythings',
    tags: 'pencils, yellow pencils, why are pencils yellow, pencil history, koh-i-noor, 1889 worlds fair, graphite, no lead in pencils, everyday things, why things are the way they are, shorts',
    md: [['Caroline Weaver, "The Geography of Pencil History: Czech Republic", CW Pencils (2018)', 'https://www.cwpencils.com/blog-archive/the-geography-of-pencil-history-czech-republic',
      ['Het gele potlood werd getoond op de wereldtentoonstelling van 1889 in Parijs.',
        'De beste grafiet zou uit China komen ("believed").',
        '"originally chose the color yellow because of its connotations of royalty and respect in Chinese culture".',
        'Het potlood werd vernoemd naar de Koh-i-Noor-diamant.',
        'Andere potloodmakers namen het geel over.']],
      ['Paul Anthony Jones, "Why Are Pencils Yellow?", Mental Floss (2026)', 'https://www.mentalfloss.com/history/why-pencils-are-yellow',
      ['1889, wereldtentoonstelling Parijs (niet 1890).', 'Anderen namen het geel over; de beste grafiet zou uit China komen ("believed").']],
      ['Joe Schwarcz, "Pencils never contained lead", McGill Office for Science and Society (22 feb 2017)', 'https://www.mcgill.ca/oss/article/did-you-know/pencils-never-contained-lead',
      ['"lead pencils do not contain any lead"; de kern is grafiet met klei.']]],
    niet: '- Niet gezegd: hoeveel procent van de potloden geel is ("75 %"), de naam van het bedrijf, waaróm anderen het geel overnamen (alleen dát ze het deden), en het jaar 1890 (de bronnen zeggen 1889). "Believed to come from China" wordt in de video "was believed to come from China". De tentoonstellingshal is een eigen tekening, geen afbeelding van een echt gebouw. Potloden, diamant, kroon, grafiet, klei, decors en figuren zijn eigen tekenwerk.',
  },
  scenes: [
    { wie: 'vraag', decor: 'klas', duur: 2.4, stem: 'Why are so many pencils yellow?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['yellow', 'pop', 0.5]],
      teken: h => vraag1(h) + h.kin('Why are pencils *yellow*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'museum', duur: 3.2, stem: 'It\'s a story about a diamond, a world\'s fair, and China!', in: 'zweep', camera: { zoom: [1, 1.05] }, geluid: [['diamond', 'pop', 0.5], ['fair', 'pop', 0.5], ['China', 'pop', 0.5]],
      teken: h => teaser(h) + h.kin('A *diamond* story.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'museum', duur: 4.0, stem: 'In 1889, at the world\'s fair in Paris, a pencil maker showed off a yellow pencil.', bron: CW, bronStart: '1889', camera: { zoom: [1.02, 1.06] }, geluid: [['1889', 'tik', 0.5], ['yellow', 'ding', 0.5]],
      teken: h => parijs(h) + h.kin('*Paris*, 1889.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'museum', shot: 'dichtbij', duur: 1.4, stem: 'Why yellow?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Why *yellow*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'plein', duur: 4.4, stem: 'The best graphite was believed to come from China, where yellow stood for royalty and respect.', in: 'zweep', bron: CW, bronStart: 'graphite', camera: { zoom: [1, 1.05] }, geluid: [['graphite', 'pop', 0.5], ['royalty', 'stijg', 0.4]],
      teken: h => china(h) + h.kin('Yellow = *royalty*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'museum', duur: 3.4, stem: 'They even named it after a famous diamond: the Koh-i-Noor!', bron: CW, bronStart: 'named', camera: { zoom: [1.02, 1.06] }, geluid: [['diamond', 'ding', 0.5], ['Koh-i-Noor', 'pop', 0.5]],
      teken: h => kohinoor(h) + h.kin('Named after a *diamond*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.6, stem: 'And the other pencils?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And the *others*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.0, stem: 'Soon other pencil makers painted theirs yellow too.', in: 'zweep', bron: MF, bronStart: 'other', camera: { zoom: [1, 1.05] }, geluid: [['yellow', 'whoosh', 0.4]],
      teken: h => kopie(h) + h.kin('Everyone went *yellow*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.6, stem: 'And the lead inside?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And the *lead*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.8, stem: 'Here\'s the twist: pencils never had lead in them. It\'s graphite and clay!', bron: MG, bronStart: 'never', camera: { zoom: [1.02, 1.06] }, geluid: [['never', 'klap', 0.4], ['graphite', 'pop', 0.5], ['clay', 'pop', 0.5]],
      teken: h => geenLood(h) + h.kin('*No* lead at all!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.0, stem: 'So your yellow pencil is dressed like royalty, and it has no lead!', pose: { antwoord: 'verbaasd' }, bron: CW, bronStart: 'yellow', camera: { zoom: [1.03, 1.0] }, geluid: [['royalty', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('Dressed like *royalty*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
