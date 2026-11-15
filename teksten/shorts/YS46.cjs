// YS46 — Why is the right side of a ship called "starboard"?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Met het watermerk
// (Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"). Gemaakt na "maak ze alvast" (Andries zo 15 nov
// 2026 ±21:24, over YS46 en YS47).
// Bedoeling kanaal 1 (jesse-14, docs/manager/bedoeling-per-kanaal.md): educatief + leuk; eindigt met één zin om na te
// vertellen ("starboard = the side where you steer") en een slot dat terugkoppelt naar de beginvraag ("is it about the
// stars?" → "nothing to do with stars").
// Bronnen (gelezen zo 15 nov 2026): NOAA, National Ocean Service, "Why do ships use "port" and "starboard" instead of
// "left" and "right?"" (bijgewerkt 23 sep 2026); Pascal Tréguer, "Origin of the nautical terms 'starboard' and 'port'",
// word histories (21 nov 2016), met de Admiralty-circulaire van 22 november 1844.
// Niet gezegd: waar "larboard" zelf vandaan komt (onzeker), bæcbord, de Amerikaanse marine, kleuren van de
// navigatielichten (rood/groen staan alleen als kleur in beeld, niet als bewering), Vikingschepen.
const NOAA = 'NOAA';
const WH = 'word histories (2016)';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', GROEN = '#2E8B57', HOUT = '#B07A45';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;

// Schip van bovenaf, boeg omhoog (dus bakboord links, stuurboord rechts in beeld)
const romp = (x, y, k = 1) => {
  const b = 70 * k, l = 300 * k, top = y - l / 2, voet = y + l / 2;
  return `<path d="M ${x} ${top} C ${x + b * 0.9} ${top + l * 0.18}, ${x + b} ${top + l * 0.35}, ${x + b} ${top + l * 0.5} L ${x + b * 0.92} ${voet} L ${x - b * 0.92} ${voet} L ${x - b} ${top + l * 0.5} C ${x - b} ${top + l * 0.35}, ${x - b * 0.9} ${top + l * 0.18}, ${x} ${top} Z" fill="#C8955F" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
    + [0.42, 0.62, 0.82].map(f => `<path d="M ${x - b * 0.9} ${top + l * f} L ${x + b * 0.9} ${top + l * f}" stroke="#8A5A34" stroke-width="4"/>`).join('')
    + `<circle cx="${x}" cy="${top + l * 0.36}" r="${10 * k}" fill="#6E4627" stroke="${I}" stroke-width="4"/>`
    + `<path d="M ${x - b * 0.85} ${top + l * 0.36} L ${x + b * 0.85} ${top + l * 0.36}" stroke="${KRIJT}" stroke-width="${8 * k}" stroke-linecap="round" opacity="0.9"/>`;
};
// Stuurriem aan de achterkant, rechts (zij = 1) of in het midden (zij = 0); hoek wiebelt mee als er gestuurd wordt
const riem = (x, y, k, zij, a = 0) => {
  const l = 300 * k, voet = y + l / 2, bx = x + zij * 66 * k, by = voet - 34 * k;
  return `<g transform="translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(-18 * zij + a).toFixed(1)})">`
    + `<rect x="-6" y="-60" width="12" height="150" rx="5" fill="${HOUT}" stroke="${I}" stroke-width="4"/>`
    + `<path d="M -16 70 L 16 70 L 12 130 Q 0 140 -12 130 Z" fill="${HOUT}" stroke="${I}" stroke-width="4" stroke-linejoin="round"/></g>`;
};
const label = (x, y, tekst, kleur, op = 1, grootte = 40, anker = 'middle') =>
  `<text x="${x}" y="${y}" text-anchor="${anker}" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
const ster = (x, y, r, kleur = GEEL, rot = 0) => { let p = '';
  for (let i = 0; i < 10; i++) { const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; p += `${i ? 'L' : 'M'} ${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)} `; }
  return `<path d="${p}Z" fill="${kleur}" stroke="${I}" stroke-width="4" stroke-linejoin="round" transform="rotate(${rot} ${x} ${y})"/>`; };

// Scène 1: het schip met "STARBOARD?" rechts, en sterretjes die twinkelen
const vraagSchip = h => { const q = pop(h, 0, 0.35), s = pop(h, h.op('starboard', 0.9));
  return sch(540, 835, q, romp(540, 835, 0.95))
    + (s > 0 ? sch(780, 830, s, label(780, 845, 'STARBOARD?', ROOD, 1, 44)) : '')
    + [[700, 730, 20], [905, 760, 14], [860, 935, 18]].map(([x, y, r], i) => { const t = pop(h, h.op('stars', 2.2) + i * 0.15);
      return t > 0 ? ster(x, y, r * (0.8 + 0.2 * Math.sin(h.t * 6 + i)), GEEL, (h.t * 40 + i * 30) % 360) : ''; }).join(''); };

// Scène 2–3: het schip met de stuurriem; in scène 3 schuift de riem naar rechts
const stuur = (h, { zij = 1, tLabel, tekst, kleur = ROOD, wiebel = true }) => { const q = pop(h, 0, 0.35), a = wiebel ? 8 * Math.sin(h.t * 3.2) : 0;
  return sch(540, 835, q, romp(540, 835, 0.95) + riem(540, 835, 0.95, zij, a))
    + (tLabel !== undefined && h.t >= tLabel ? label(zij ? 770 : 540, zij ? 845 : 990, tekst, kleur, zicht(h, tLabel), 38) : ''); };
const handig = h => { const u = h.zacht(h.klem((h.t - h.op('right', 1.2)) / 0.6)), q = pop(h, 0, 0.35), a = 8 * Math.sin(h.t * 3.2);
  return sch(540, 835, q, romp(540, 835, 0.95) + riem(540, 835, 0.95, u, a))
    + label(300, 845, 'RIGHT-', I, zicht(h, h.op('right', 1.2) + 0.5), 34) + label(300, 885, 'HANDED', I, zicht(h, h.op('right', 1.2) + 0.5), 34)
    + label(790, 845, 'RIGHT SIDE', ROOD, zicht(h, h.op('side', 2.4)), 36); };

// Scène 5 (klas): steor + bord = starboard
const woord = h => { const a = pop(h, h.op('steer', 0.8)), b = pop(h, h.op('board', 1.6)), c = pop(h, h.op('became', 2.8));
  return label(540, 722, 'OLD ENGLISH', GEEL, zicht(h, 0.1), 34)
    + (a > 0 ? sch(330, 820, a, label(330, 835, 'STEOR', KRIJT, 1, 72) + label(330, 885, '"steer"', GEEL, 1, 30)) : '')
    + (b > 0 ? label(540, 835, '+', KRIJT, zicht(h, h.op('board', 1.6)), 72) + sch(740, 820, b, label(740, 835, 'BORD', KRIJT, 1, 72) + label(740, 885, '"ship\'s side"', GEEL, 1, 30)) : '')
    + (c > 0 ? sch(540, 960, c, label(540, 975, '= STARBOARD', GEEL, 1, 60)) : ''); };

// Scène 7: aan de kade laden, links; "LARBOARD"
const kist = (x, y, s = 44) => `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="#D9A45A" stroke="${I}" stroke-width="4"/><path d="M ${x - s / 2} ${y - s / 2} L ${x + s / 2} ${y + s / 2} M ${x + s / 2} ${y - s / 2} L ${x - s / 2} ${y + s / 2}" stroke="#8A5A34" stroke-width="3"/>`;
const kade = (h, tLabel, { door = -1, poort = -1 } = {}) => { const q = pop(h, 0, 0.35);
  let s = `<rect x="150" y="682" width="230" height="306" fill="#9C7650" stroke="${I}" stroke-width="5"/>` + [740, 800, 860, 920].map(y => `<path d="M 150 ${y} L 380 ${y}" stroke="#7A5A3A" stroke-width="3"/>`).join('')
    + kist(215, 770) + kist(268, 770) + kist(240, 726) + kist(215, 900) + kist(300, 920);
  s += sch(560, 835, q, romp(560, 835, 0.95) + riem(560, 835, 0.95, 1, 0));
  const k = h.zacht(h.klem((h.t - (tLabel + 0.4)) / 0.8));
  if (k > 0) s += `<path d="M ${300} 820 L ${300 + 170 * k} 820" stroke="${I}" stroke-width="5" stroke-dasharray="10 8"/>` + kist(300 + 170 * k, 820, 34);
  if (h.t >= tLabel) s += label(265, 975, 'LARBOARD', door >= 0 && h.t >= door ? '#8A8A8A' : '#2F5E86', zicht(h, tLabel), 38);
  if (door >= 0 && h.t >= door) { const d = h.zacht(h.klem((h.t - door) / 0.35)); s += `<path d="M 165 963 L ${165 + 200 * d} 963" stroke="${ROOD}" stroke-width="8" stroke-linecap="round"/>`; }
  if (poort >= 0) { const p = pop(h, poort); if (p > 0) s += sch(265, 910, p, `<rect x="185" y="878" width="160" height="62" rx="10" fill="${ROOD}" stroke="${I}" stroke-width="5"/>` + label(265, 925, 'PORT', '#FFFFFF', 1, 44)); }
  return s; };
const jaar = (h, t) => { const p = pop(h, t); return p > 0 ? sch(830, 740, p, `<rect x="740" y="702" width="180" height="70" rx="10" fill="${GEEL}" stroke="${I}" stroke-width="5"/>` + label(830, 752, '1844', I, 1, 44)) : ''; };

// Scène 10: het hele schip met beide namen, en een doorgestreepte ster
const slot = h => { const q = pop(h, 0, 0.35), sterOp = pop(h, h.op('stars', 1.2)), kruis = h.zacht(h.klem((h.t - h.op('nothing', 0.9)) / 0.3));
  return sch(540, 835, q, romp(540, 835, 0.95) + riem(540, 835, 0.95, 1, 8 * Math.sin(h.t * 3.2)))
    + label(320, 845, 'PORT', ROOD, zicht(h, 0.15), 44) + label(780, 845, 'STARBOARD', GROEN, zicht(h, 0.35), 44)
    + label(780, 890, '= steer side', I, zicht(h, h.op('steer', 2.6)), 30)
    + (sterOp > 0 ? sch(800, 740, sterOp, ster(800, 740, 34) + `<path d="M 762 702 L ${762 + 76 * kruis} ${702 + 76 * kruis}" stroke="${ROOD}" stroke-width="9" stroke-linecap="round"/>`) : ''); };

module.exports = {
  code: 'YS46',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-21-YS46-starboard',
  nummer: 'No. 46',
  onderwerp: 'STARBOARD',
  pakket: {
    dag: 'zaterdag 21 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why is the right side of a ship called "starboard"?',
    intro: 'Not because of the stars. Old ships were steered with a big oar on the right side: the steer-board. The left side, where ships loaded, became larboard, and later port.',
    feiten: ['"In the early days of boating, before ships had rudders on their centerlines, boats were controlled using a steering oar." (NOAA)',
      'Most sailors were right-handed, so the steering oar was placed on the right side of the stern. That side became the steering side, "starboard", from Old English words for "steer" and "side of a boat". (NOAA)',
      'The opposite side became the loading side, "larboard". Because it was easily confused with "starboard", it was replaced by "port", the side that faced the dock. (NOAA)',
      'A Royal Navy Admiralty circular of 22 November 1844 ended the use of "larboard"; "port" replaced it to avoid mix-ups with "starboard". (word histories)'],
    bronnen: [['NOAA, National Ocean Service, "Why do ships use "port" and "starboard" instead of "left" and "right?"" (updated September 23, 2026)', 'https://oceanservice.noaa.gov/facts/port-starboard.html'],
      ['Pascal Tréguer, "Origin of the nautical terms \'starboard\' and \'port\'", word histories (November 21, 2016)', 'https://wordhistories.net/2016/11/21/starboard-port/']],
    hashtags: '#Shorts #ships #words #everydaythings',
    tags: 'starboard, port, port and starboard, why is it called starboard, larboard, ships, sailing, boats, word origins, etymology, history of everyday things, why things are the way they are, shorts',
    md: [['NOAA, National Ocean Service, "Why do ships use "port" and "starboard" instead of "left" and "right?"" (bijgewerkt 23 sep 2026)', 'https://oceanservice.noaa.gov/facts/port-starboard.html',
      ['"In the early days of boating, before ships had rudders on their centerlines, boats were controlled using a steering oar."',
        'De meeste zeelieden waren rechtshandig, dus de riem zat rechts op de achtersteven; die kant werd de stuurkant, "starboard", uit Oud-Engelse woorden voor "steer" en "side of a boat" (samengevat).',
        'Toen boten groter werden, werd de andere kant de laadkant, "larboard"; omdat dat te veel op "starboard" leek, werd het "port", de kant die naar de kade keek (samengevat).']],
      ['Pascal Tréguer, "Origin of the nautical terms \'starboard\' and \'port\'", word histories (21 nov 2016)', 'https://wordhistories.net/2016/11/21/starboard-port/',
      ['Oud-Engels "steorbord" betekent letterlijk "steer board", de stuurkant (samengevat).',
        'Een circulaire van de Admiralty van 22 november 1844 maakte een eind aan "larboard" op de schepen van de Royal Navy; "port" moest misverstanden door de gelijke klank voorkomen (samengevat).']]],
    niet: '- Niet gezegd: waar "larboard" zelf vandaan komt (onzeker), het Oud-Engelse woord voor de linkerkant, de Amerikaanse marine en de kleuren van de navigatielichten (rood en groen staan alleen als kleur in beeld). "Royal Navy, 1844" komt uit word histories (circulaire van 22 nov 1844); NOAA noemt geen jaartal. Schip, riem, kade, kisten, decor en figuren zijn eigen tekenwerk; geen echt schip in beeld.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'haven', duur: 3.4, stem: 'Why is the right side of a ship called starboard? Is it about the stars?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['stars', 'pop', 0.5]],
      teken: h => vraagSchip(h) + h.kin('Why is it called *starboard*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 4.0, stem: 'Ha! Long ago, before ships had a rudder in the middle, they were steered with a big oar.', in: 'zweep', bron: NOAA, bronStart: 'rudder', camera: { zoom: [1, 1.05] }, geluid: [['oar', 'whoosh', 0.5]],
      teken: h => stuur(h, { zij: 1, tLabel: h.op('oar', 2.8), tekst: 'STEERING OAR', kleur: '#2F5E86' }) + h.kin('Ships were steered with an *oar*!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 3.8, stem: 'Most sailors were right-handed, so the steering oar went on the right side.', bron: NOAA, bronStart: 'sailors', camera: { zoom: [1.02, 1.07] }, geluid: [['right', 'tik', 0.5], ['side', 'pop', 0.5]],
      teken: h => handig(h) + h.kin('Right-handed? Oar on the *right*!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'haven', shot: 'dichtbij', duur: 1.8, stem: 'So the right side was the steering side?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('The *steering* side?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.4, stem: 'Yep! In Old English: steer, plus board, the side of a boat. Steer-board became starboard!', in: 'zweep', bron: NOAA, bronStart: 'english', camera: { zoom: [1, 1.05] }, geluid: [['steer', 'tik', 0.5], ['board', 'tik', 0.5], ['became', 'pop', 0.6]],
      teken: h => woord(h) + h.kin('Steer-board → *starboard*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.5, stem: 'And the left side?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And the *left* side?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 3.8, stem: 'The other side became the side for loading at the dock. It was called larboard.', in: 'zweep', bron: NOAA, bronStart: 'loading', camera: { zoom: [1, 1.05] }, geluid: [['loading', 'whoosh', 0.4], ['larboard', 'pop', 0.6]],
      teken: h => kade(h, h.op('larboard', 3.0)) + h.kin('The loading side: *larboard*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'haven', shot: 'dichtbij', duur: 2.2, stem: 'Larboard? Starboard? That sounds almost the same!', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('*Larboard*? *Starboard*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 5.0, stem: 'Exactly! Way too easy to mix up. So in eighteen forty-four, the Royal Navy said: call it port, the side that faces the dock.', in: 'zweep', bron: WH, bronStart: 'eighteen', camera: { zoom: [1.02, 1.07] }, geluid: [['mix', 'klap', 0.4], ['eighteen', 'tik', 0.5], ['port', 'pop', 0.7]],
      teken: h => kade(h, 0, { door: h.op('mix', 1.4), poort: h.op('port', 3.6) }) + jaar(h, h.op('eighteen', 2.2)) + h.kin('Larboard became *port*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'haven', duur: 4.0, stem: "So starboard has nothing to do with stars. It's just the side where you steer!", pose: { antwoord: 'verbaasd' }, bron: NOAA, bronStart: 'starboard', camera: { zoom: [1.03, 1.0] }, geluid: [['nothing', 'klap', 0.4], ['steer', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('Not stars. *Steering*!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
  ],
};
