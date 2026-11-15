// YS47 — Why do clocks go clockwise?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Met het watermerk
// (Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"). Gemaakt na "maak ze alvast" (Andries zo 15 nov
// 2026 ±21:24, over YS46 en YS47).
// Bedoeling kanaal 1 (jesse-14, docs/manager/bedoeling-per-kanaal.md): educatief + leuk; eindigt met één zin om na te
// vertellen ("who picked clockwise? The sun did") en een slot dat terugkoppelt naar de beginvraag ("who picked this
// direction?").
// Bronnen (gelezen zo 15 nov 2026): Brendan McWilliams, "Why clocks are designed to rotate the way they do", The Irish
// Times (27 okt 2001); The Old Farmer's Almanac, "Why do clocks run clockwise?" (feitje, geen datum).
// Niet gezegd: wie de eerste mechanische klok maakte, jaartallen, verticale zonnewijzers (daar draait de schaduw
// andersom), klokken die echt andersom lopen. "Copied the sundial": de Irish Times zegt dat de klokmakers het patroon
// van de zonnewijzer waarschijnlijk overnamen; de Almanac zegt dat de wijzers de beweging van de zon nabootsen.
const IT = 'The Irish Times (2001)';
const ALM = "Old Farmer's Almanac";

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', BLAUW = '#2F5E86';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const rad = g => (g - 90) * Math.PI / 180;   // 0° = omhoog (12 uur / noord), met de klok mee positief
const pt = (x, y, r, g) => [x + r * Math.cos(rad(g)), y + r * Math.sin(rad(g))];
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;

// Gebogen pijl rond (x, y): van hoek a naar b (graden; b > a = met de klok mee)
const pijl = (x, y, r, a, b, kleur, w = 8, op = 1) => {
  const [x0, y0] = pt(x, y, r, a), [x1, y1] = pt(x, y, r, b), groot = Math.abs(b - a) > 180 ? 1 : 0, zw = b > a ? 1 : 0;
  const t = b > a ? 90 : -90, [px, py] = [Math.cos(rad(b + t)), Math.sin(rad(b + t))], [nx, ny] = [Math.cos(rad(b)), Math.sin(rad(b))];
  const kop = `M ${(x1 + px * 22).toFixed(1)} ${(y1 + py * 22).toFixed(1)} L ${(x1 - nx * 14).toFixed(1)} ${(y1 - ny * 14).toFixed(1)} L ${(x1 + nx * 14).toFixed(1)} ${(y1 + ny * 14).toFixed(1)} Z`;
  return `<g opacity="${op}"><path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${groot} ${zw} ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${kleur}" stroke-width="${w}" stroke-linecap="round"/><path d="${kop}" fill="${kleur}"/></g>`;
};

// Klok met wijzers; g = hoek van de grote wijzer
const klok = (x, y, r, g, { kleur = '#FFFFFF', cijfers = true } = {}) => {
  let s = `<circle cx="${x}" cy="${y + 6}" r="${r}" fill="#000" opacity="0.15"/><circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" stroke="${I}" stroke-width="7"/>`;
  for (let i = 0; i < 12; i++) { const [a, b] = pt(x, y, r * 0.86, i * 30), [c, d] = pt(x, y, r * (i % 3 ? 0.78 : 0.7), i * 30);
    s += `<path d="M ${a.toFixed(1)} ${b.toFixed(1)} L ${c.toFixed(1)} ${d.toFixed(1)}" stroke="${I}" stroke-width="${i % 3 ? 3 : 6}" stroke-linecap="round"/>`; }
  if (cijfers) s += [[12, 0], [3, 90], [6, 180], [9, 270]].map(([n, g2]) => { const [a, b] = pt(x, y, r * 0.52, g2); return `<text x="${a.toFixed(1)}" y="${(b + r * 0.09).toFixed(1)}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(r * 0.24).toFixed(0)}" fill="${I}">${n}</text>`; }).join('');
  const [mx, my] = pt(x, y, r * 0.72, g), [ux, uy] = pt(x, y, r * 0.45, g / 12 + 300);
  return s + `<path d="M ${x} ${y} L ${ux.toFixed(1)} ${uy.toFixed(1)}" stroke="${I}" stroke-width="10" stroke-linecap="round"/><path d="M ${x} ${y} L ${mx.toFixed(1)} ${my.toFixed(1)}" stroke="${ROOD}" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="9" fill="${I}"/>`;
};

// Zonnewijzer van bovenaf (noord boven): stokje in het midden, schaduw op hoek g; de zon staat er recht tegenover
const zon = (x, y, r, op = 1) => `<g opacity="${op}">${[...Array(8)].map((_, i) => { const [a, b] = pt(x, y, r * 1.35, i * 45), [c, d] = pt(x, y, r * 1.8, i * 45); return `<path d="M ${a.toFixed(1)} ${b.toFixed(1)} L ${c.toFixed(1)} ${d.toFixed(1)}" stroke="${GEEL}" stroke-width="6" stroke-linecap="round"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="${r}" fill="${GEEL}" stroke="${I}" stroke-width="5"/></g>`;
const wijzer = (x, y, r, g, { zonOp = 1, spoor = null, kleur = '#E9DDBF' } = {}) => {
  let s = `<ellipse cx="${x}" cy="${y + 8}" rx="${r}" ry="${r}" fill="#000" opacity="0.12"/><circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" stroke="${I}" stroke-width="6"/>`;
  for (let i = -90; i <= 90; i += 15) { const [a, b] = pt(x, y, r * 0.92, i), [c, d] = pt(x, y, r * 0.78, i); s += `<path d="M ${a.toFixed(1)} ${b.toFixed(1)} L ${c.toFixed(1)} ${d.toFixed(1)}" stroke="${I}" stroke-width="${i % 45 ? 3 : 5}" stroke-linecap="round"/>`; }
  if (spoor) s += pijl(x, y, r * 0.62, spoor[0], spoor[1], ROOD, 7, spoor[2] ?? 1);
  const [sx, sy] = pt(x, y, r * 0.8, g);
  s += `<path d="M ${x} ${y} L ${sx.toFixed(1)} ${sy.toFixed(1)}" stroke="#4A4540" stroke-width="12" stroke-linecap="round" opacity="0.75"/><circle cx="${x}" cy="${y}" r="10" fill="#8A5A34" stroke="${I}" stroke-width="4"/>`;
  const [zx, zy] = pt(x, y, r * 1.28, g + 180);
  return s + (zonOp > 0 ? zon(zx, zy, 20, zonOp) : '');
};

// Scène 1 (kamer): klok met draaiende wijzer en een pijl met de klok mee
const vraagKlok = h => { const q = pop(h, 0, 0.35), g = (h.t * 120) % 360, p = pop(h, h.op('picked', 1.6));
  return sch(540, 835, q, klok(540, 835, 140, g)) + (p > 0 ? pijl(540, 835, 170, -60, 60, ROOD, 10, Math.min(1, p)) + label(800, 760, 'WHO?', ROOD, zicht(h, h.op('picked', 1.6)), 48) : ''); };

// Scène 2 (rome): de zonnewijzer verschijnt, de schaduw staat stil
const wijzerIn = h => { const q = pop(h, 0, 0.35), sh = h.zacht(h.klem((h.t - h.op('shadow', 2.2)) / 0.5));
  return sch(540, 850, q, wijzer(540, 850, 135, -45, { zonOp: sh })) + label(800, 760, 'SUNDIAL', I, zicht(h, 0.4), 40); };

// Scène 3 (rome): de zon draait door het zuiden, de schaduw zwaait mee van links via boven naar rechts
const zwaai = h => { const t0 = h.op('sweeps', 2.2), u = h.zacht(h.klem((h.t - t0) / 1.8)), g = -90 + 180 * u;
  return wijzer(540, 850, 135, g, { spoor: u > 0.05 ? [-90, Math.max(-85, g), 1] : null })
    + label(540, 700, 'N', I, 1, 28) + label(255, 862, 'W', I, 1, 28) + label(825, 862, 'E', I, 1, 28)
    + label(830, 760, 'NORTH', BLAUW, zicht(h, 0.3), 28) + label(830, 792, 'HALF', BLAUW, zicht(h, 0.3), 28); };

// Scène 5 (kamer): zonnewijzer en klok naast elkaar, allebei met de klok mee
const kopie = h => { const a = pop(h, 0, 0.35), b = pop(h, h.op('clocks', 1.4)), u = (h.t * 0.5) % 1;
  return sch(340, 845, a, wijzer(340, 845, 115, -90 + 180 * u, { zonOp: 0, spoor: [-90, 90, 0.9] }))
    + (b > 0 ? label(540, 860, '=', I, zicht(h, h.op('clocks', 1.4)), 70) + sch(745, 845, b, klok(745, 845, 115, (h.t * 120) % 360) + pijl(745, 845, 140, -50, 50, ROOD, 8)) : ''); };

// Scène 7 (klas): aardbol met evenaar; noord met de klok mee, zuid tegen de klok in
const bol = h => { const q = pop(h, 0, 0.35), n = pop(h, h.op('northern', 0.6)), z = pop(h, h.op('other', 2.4));
  return sch(540, 840, q, `<circle cx="540" cy="840" r="130" fill="none" stroke="${KRIJT}" stroke-width="6"/><path d="M 410 840 L 670 840" stroke="${GEEL}" stroke-width="5" stroke-dasharray="14 10"/><path d="M 470 760 q 30 -20 60 0 q 20 30 -10 40 M 560 880 q 40 -10 50 30 q -20 40 -50 10" fill="none" stroke="${KRIJT}" stroke-width="4"/>`)
    + label(540, 836 + 30, 'EQUATOR', GEEL, zicht(h, 0.4), 22)
    + (n > 0 ? sch(780, 760, n, pijl(780, 760, 50, -110, 110, KRIJT, 7) + label(780, 772, 'N', KRIJT, 1, 34)) : '')
    + (z > 0 ? sch(780, 925, z, pijl(780, 925, 50, 110, -110, ROOD, 7) + label(780, 937, 'S', ROOD, 1, 34)) : ''); };

// Scène 9 (kamer): een klok die andersom loopt
const zuidKlok = h => { const q = pop(h, 0, 0.35), g = 360 - (h.t * 120) % 360;
  return sch(540, 835, q, klok(540, 835, 135, g)) + pijl(540, 835, 165, 60, -60, BLAUW, 10, Math.min(1, pop(h, 0.4)))
    + label(810, 780, 'MADE IN', BLAUW, zicht(h, h.op('south', 1.4)), 30) + label(810, 815, 'THE SOUTH?', BLAUW, zicht(h, h.op('south', 1.4)), 30); };

// Scène 10 (rome): klok met de zon erboven; "THE SUN" pop
const slot = h => { const q = pop(h, 0, 0.35), z = pop(h, h.op('sun', 1.2));
  return sch(420, 845, q, klok(420, 845, 125, (h.t * 120) % 360) + pijl(420, 845, 152, -50, 50, ROOD, 9))
    + (z > 0 ? sch(760, 820, z, zon(760, 800, 46) + label(760, 950, 'THE SUN', I, 1, 40)) : ''); };

module.exports = {
  code: 'YS47',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-22-YS47-clockwise',
  nummer: 'No. 47',
  onderwerp: 'CLOCKWISE',
  pakket: {
    dag: 'zondag 22 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why do clocks go clockwise?',
    intro: 'Before clocks, there were sundials. In the northern half of the world, a sundial\'s shadow sweeps around in the direction we now call clockwise, and clock hands copied it.',
    feiten: ['In the northern hemisphere the sun crosses the southern sky, so the shadow on a sundial "moves in what we now would call a clockwise direction around the graduations on the dial." (The Irish Times)',
      'Early clockmakers most likely copied that familiar pattern. (The Irish Times) "The clock hands were built to mimic the natural movement of the sun." (The Old Farmer\'s Almanac)',
      'South of the equator the sun is in the northern sky, and the shadow "moves in an anti-clockwise sense around the dial." (The Irish Times)',
      '"If clocks had been invented in the southern hemisphere, "clockwise" would mean just the opposite." (The Old Farmer\'s Almanac)'],
    bronnen: [['Brendan McWilliams, "Why clocks are designed to rotate the way they do", The Irish Times (October 27, 2001)', 'https://www.irishtimes.com/news/why-clocks-are-designed-to-rotate-the-way-they-do-1.334397'],
      ['The Old Farmer\'s Almanac, "Why do clocks run clockwise?"', 'https://www.almanac.com/fact/why-do-clocks-run-clockwiser-before-the']],
    hashtags: '#Shorts #clocks #history #everydaythings',
    tags: 'clockwise, why do clocks go clockwise, clocks, sundial, sundials, time, history of clocks, sun, shadow, northern hemisphere, history of everyday things, why things are the way they are, shorts',
    md: [['Brendan McWilliams, "Why clocks are designed to rotate the way they do", The Irish Times (27 okt 2001)', 'https://www.irishtimes.com/news/why-clocks-are-designed-to-rotate-the-way-they-do-1.334397',
      ['De zon trekt van oost naar west "across the southern sky"; de schaduw "moves in what we now would call a clockwise direction around the graduations on the dial."',
        'Vroege klokmakers namen dat bekende patroon waarschijnlijk over (samengevat).',
        'Op het zuidelijk halfrond staat de zon in het noorden en "moves in an anti-clockwise sense around the dial"; als de tijdmeting daar was begonnen, liepen klokken misschien andersom (samengevat).']],
      ['The Old Farmer\'s Almanac, "Why do clocks run clockwise?" (feitje, geen datum op de pagina)', 'https://www.almanac.com/fact/why-do-clocks-run-clockwiser-before-the',
      ['"Before the advent of clocks, we used sundials."',
        '"In the northern hemisphere, the shadows rotated in the direction we now call "clockwise.""',
        '"The clock hands were built to mimic the natural movement of the sun."',
        '"If clocks had been invented in the southern hemisphere, "clockwise" would mean just the opposite."']]],
    niet: '- Niet gezegd: wie de eerste mechanische klok maakte, jaartallen, en dat de schaduw op een verticale zonnewijzer (aan een muur) juist andersom draait; de short gaat over de liggende zonnewijzer. "Copied the shadow" volgt de Irish Times ("waarschijnlijk overgenomen") en de Almanac ("built to mimic"); de short zegt niet dat dit bewezen is uit één document. Klokken, zonnewijzer, aardbol, decors en figuren zijn eigen tekenwerk.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 3.0, stem: 'Why do clocks go clockwise? Who picked this direction?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['picked', 'pop', 0.5]],
      teken: h => vraagKlok(h) + h.kin('Why do clocks go *clockwise*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 3.8, stem: 'Ha! Before clocks, people told time with sundials: a stick and its shadow.', in: 'zweep', bron: ALM, bronStart: 'before', camera: { zoom: [1, 1.05] }, geluid: [['sundials', 'pop', 0.5], ['shadow', 'whoosh', 0.4]],
      teken: h => wijzerIn(h) + h.kin('First came the *sundial*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 5.0, stem: 'In the northern half of the world, the sun crosses the southern sky, so the shadow sweeps around like this!', bron: IT, bronStart: 'northern', camera: { zoom: [1.02, 1.07] }, geluid: [['sweeps', 'whoosh', 0.5], ['this', 'pop', 0.5]],
      teken: h => zwaai(h) + h.kin('The shadow sweeps *this way*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 1.8, stem: 'Wait, the shadow goes clockwise?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('The shadow goes *clockwise*?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.6, stem: 'Yep! And when clocks came along, their hands copied the shadow.', in: 'zweep', bron: IT, bronStart: 'clocks', camera: { zoom: [1, 1.05] }, geluid: [['clocks', 'tik', 0.5], ['copied', 'pop', 0.6]],
      teken: h => kopie(h) + h.kin('Clocks *copied* the shadow.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.8, stem: 'And south of the equator?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And down *south*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.2, stem: "There, the sun is in the northern sky, and a sundial's shadow turns the other way!", in: 'zweep', bron: IT, bronStart: 'northern', camera: { zoom: [1, 1.05] }, geluid: [['northern', 'tik', 0.5], ['other', 'pop', 0.6]],
      teken: h => bol(h) + h.kin('There it turns the *other way*!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 2.0, stem: 'So clocks could have gone the other way?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Backwards *clocks*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 4.0, stem: "If clocks had been invented in the south, clockwise would mean the opposite!", in: 'zweep', bron: ALM, bronStart: 'invented', camera: { zoom: [1.02, 1.07] }, geluid: [['south', 'tik', 0.5], ['opposite', 'pop', 0.6]],
      teken: h => zuidKlok(h) + h.kin('Clockwise would be *the other way*!', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 3.2, stem: 'So who picked clockwise? The sun did!', pose: { antwoord: 'verbaasd' }, bron: IT, bronStart: 'picked', camera: { zoom: [1.03, 1.0] }, geluid: [['sun', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('Who picked it? *The sun*!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
  ],
};
