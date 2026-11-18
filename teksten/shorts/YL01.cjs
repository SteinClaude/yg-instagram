// YL01 — Why does a week have seven days?
// Reeks YL: de video van 16:00, 65–90 s, staand (ook de TikTok-versie van jesse-17). Nieuw ritme kanaal 1 (Andries ma
// 16 nov 2026 20:36: "ik wil over gaan naar 12:00 upload, 16:00 en 20;00 elke dag 1video en 2 shorts"; ±20:40 gekozen:
// "65–90 s video", "Video 16:00", "Zo snel mogelijk"). Stemtegoed tot 14 dec krap ("Tot 14 dec rustiger", ±20:55), dus
// een plafond van 1.300 tekens. STIJL 3 (Andries za 14 nov 2026 ±20:43: "stijl OK stijl 3"): het vaste duo in getekende
// decors; met watermerk (Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje").
// Opbouw (jesse-17): elke 10–15 s een nieuw feit of een wending: Babyloniërs → zeven lichten → maan → namen van de dagen
// → Romeinse achtdaagse cyclus → Sovjet-Unie 1929 → 1931 en 1940 → slot dat terugkoppelt naar "why not five or ten?".
// Bronnen (gelezen ma 16 nov 2026): Dan Nosowitz, "Why Can't We Get Rid of the 7-Day Week?", Atlas Obscura (17 sep
// 2015); Kristin Heineman, "Why are there 7 days in a week? Thank the Babylonians", The Conversation, overgenomen door
// Astronomy.com (25 jan 2024); Catherine Boeckmann, "Where Do the Names of the Days of the Week Come From?", The Old
// Farmer's Almanac (10 mrt 2026).
// Voorzichtig: dat het van de Babyloniërs komt is "our best guess" (Atlas Obscura); de video zegt "most likely".
const AO = 'Atlas Obscura (2015)';
const CONV = 'The Conversation (2024)';
const ALM = "Old Farmer's Almanac";

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', BLAUW = '#2F5E86', GROEN = '#3E8E5A';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
const kruis = (x, y, r, kleur = ROOD, w = 9) => `<path d="M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}" stroke="${kleur}" stroke-width="${w}" stroke-linecap="round"/>`;
const vink = (x, y, s, kleur = GROEN) => `<path d="M ${x - s} ${y} L ${x - s * 0.3} ${y + s * 0.7} L ${x + s} ${y - s * 0.8}" fill="none" stroke="${kleur}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;

// Een rij dagvakjes (kalender); `n` vakjes, gecentreerd rond x; `vul(i)` geeft de kleur van vakje i (of null)
const rij = (h, x, y, n, letters, { start = 0, stap = 0.08, w = 92, vul = () => null, kleur = I, papier = '#FFFFFF' } = {}) => {
  const gap = 12, tot = n * w + (n - 1) * gap; let s = '';
  for (let i = 0; i < n; i++) {
    const q = pop(h, start + i * stap, 0.25); if (q <= 0) continue;
    const bx = x - tot / 2 + i * (w + gap), f = vul(i);
    s += sch(bx + w / 2, y, q, `<rect x="${bx}" y="${y - w * 0.6}" width="${w}" height="${w * 1.2}" rx="12" fill="${f || papier}" stroke="${kleur}" stroke-width="6"/>`
      + `<rect x="${bx}" y="${y - w * 0.6}" width="${w}" height="${w * 0.3}" rx="10" fill="${kleur}"/>`
      + (letters ? `<text x="${bx + w / 2}" y="${y + w * 0.32}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${w * 0.5}" fill="${f ? '#FFFFFF' : kleur}">${letters[i] ?? ''}</text>` : ''));
  }
  return s;
};

// De zeven lichten op het bord (klas): kleine bolletjes in een boog, met naam
const LICHTEN = [['SUN', GEEL, 30], ['MOON', '#E8E4D8', 24], ['MERCURY', '#B9B2A6', 14], ['VENUS', '#F4D9A0', 18], ['MARS', ROOD, 16], ['JUPITER', '#D9A85C', 26], ['SATURN', '#E7C98A', 22]];
const lichten = (h, start = 0, stap = 0.25, namen = true, y0 = 860) => LICHTEN.map(([naam, kleur, r], i) => {
  const q = pop(h, start + i * stap, 0.3); if (q <= 0) return '';
  const x = 190 + i * 117, y = y0 - Math.sin(i / 6 * Math.PI) * 120;
  const ring = naam === 'SATURN' ? `<ellipse cx="${x}" cy="${y}" rx="${r * 1.7}" ry="${r * 0.45}" fill="none" stroke="${KRIJT}" stroke-width="4"/>` : '';
  return sch(x, y, q, `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="${kleur}" opacity="0.18"/><circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" stroke="${KRIJT}" stroke-width="4"/>${ring}`
    + (namen ? label(x, y + r + 44, naam, KRIJT, 1, 20) : ''));
}).join('');

// Scène 1 (kamer): een week van zeven vakjes, met een vraagteken
const vraagWeek = h => rij(h, 540, 840, 7, ['M', 'T', 'W', 'T', 'F', 'S', 'S'], { start: 0.1 })
  + label(540, 990, '7 ?', ROOD, zicht(h, h.op('five', 1.8)), 56);

// Scène 2 (klas): zeven lichten verschijnen op het bord, één voor één
const zeven = h => lichten(h, h.op('seven', 1.2), 0.18, false) + label(540, 990, '× 7', GEEL, zicht(h, h.op('lights', 2.2)), 54);

// Scène 3 (klas): de lichten met hun naam
const namen = h => lichten(h, 0, 0.32, true) + label(540, 1000, 'HOLY NUMBER: 7', GEEL, zicht(h, h.op('holy', 2.6)), 34);

// Maanfasen: f = 0 nieuw, 0.25 eerste kwartier, 0.5 vol, 0.75 laatste kwartier
const maan = (x, y, r, f) => {
  const donker = '#3A3F47', licht = '#F4F1E6';
  if (f === 0) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${donker}" stroke="${KRIJT}" stroke-width="4"/>`;
  if (f === 0.5) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${licht}" stroke="${KRIJT}" stroke-width="4"/>`;
  const rechts = f === 0.25;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${donker}" stroke="${KRIJT}" stroke-width="4"/><path d="M ${x} ${y - r} A ${r} ${r} 0 0 ${rechts ? 1 : 0} ${x} ${y + r} Z" fill="${licht}"/>`;
};
// Scène 5 (klas): de maand van ±29 dagen in vier stukken van ±7
const maand = h => { const fasen = [0, 0.25, 0.5, 0.75]; let s = '';
  const b = pop(h, h.op('month', 1.0)); if (b > 0) s += `<g opacity="${Math.min(1, b).toFixed(3)}"><path d="M 200 760 L 200 735 L 880 735 L 880 760" fill="none" stroke="${GEEL}" stroke-width="6" stroke-linecap="round"/>${label(540, 715, '≈ 29 DAYS', GEEL, 1, 32)}</g>`;
  fasen.forEach((f, i) => { const q = pop(h, h.op('four', 2.4) + i * 0.15); if (q > 0) s += sch(285 + i * 170, 850, q, maan(285 + i * 170, 850, 48, f) + label(285 + i * 170, 950, '≈ 7', KRIJT, 1, 32)); });
  return s; };

// Scène 6 (klas): de zevende dag is een rustdag
const rust = h => rij(h, 540, 850, 7, ['1', '2', '3', '4', '5', '6', '7'], { start: 0, stap: 0.06, kleur: KRIJT, papier: '#2E4A3E', vul: i => (i === 6 && h.t > h.op('rest', 1.2) ? BLAUW : null) })
  + label(852, 990, 'REST', GEEL, zicht(h, h.op('rest', 1.2)), 36);

// Scène 8 (rome): drie kaarten: zon, maan, Saturnus
const kaart = (x, y, q, icoon, naam) => sch(x, y, q, `<rect x="${x - 112}" y="${y - 140}" width="224" height="280" rx="18" fill="#FFFFFF" stroke="${I}" stroke-width="6"/>${icoon}`
  + `<text x="${x}" y="${y + 105}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="34" fill="${I}">${naam}</text>`);
const dagen = h => {
  const zon = `<circle cx="270" cy="810" r="52" fill="${GEEL}" stroke="${I}" stroke-width="5"/>`;
  const mn = `<circle cx="540" cy="810" r="52" fill="#E8E4D8" stroke="${I}" stroke-width="5"/><circle cx="522" cy="796" r="9" fill="#C9C2B2"/><circle cx="556" cy="826" r="12" fill="#C9C2B2"/>`;
  const sat = `<circle cx="810" cy="810" r="42" fill="#E7C98A" stroke="${I}" stroke-width="5"/><ellipse cx="810" cy="812" rx="80" ry="18" fill="none" stroke="${I}" stroke-width="5"/>`;
  return kaart(270, 850, pop(h, h.op('Sunday', 1.6)), zon, 'SUN-day') + kaart(540, 850, pop(h, h.op('Monday', 2.6)), mn, 'MOON-day') + kaart(810, 850, pop(h, h.op('Saturday', 3.6)), sat, 'SATURN-day');
};

// Scène 10 (rome): een rij van acht, het achtste vakje wordt doorgestreept; 321
const acht = h => { const x8 = 540 + 3.5 * 92;   // midden van vakje 8 (w 80, gap 12)
  const k = pop(h, h.op('banned', 3.0));
  return rij(h, 540, 840, 8, ['1', '2', '3', '4', '5', '6', '7', '8'], { start: h.op('eight', 1.0), stap: 0.06, w: 80 })
    + (k > 0 ? `<g opacity="${Math.min(1, k).toFixed(3)}">${kruis(x8 - 6, 840, 44)}</g>` + label(540, 990, 'BANNED IN 321', ROOD, 1, 36) : ''); };

// Scène 12 (straat): 1929, een week van vijf
const vijf = h => label(540, 720, '1929', BLAUW, zicht(h, h.op('nineteen', 0.4)), 56)
  + rij(h, 540, 860, 5, ['1', '2', '3', '4', '5'], { start: h.op('five', 1.8), stap: 0.08 })
  + label(540, 1000, 'NO WEEKEND', ROOD, zicht(h, h.op('every', 3.4)), 34);

// Scène 13 (straat): twee mensen, elk een andere vrije dag
const apart = h => { const a = pop(h, 0.2), b = pop(h, h.op('different', 1.0)), c = pop(h, h.op('same', 3.0));
  const r1 = rij(h, 600, 760, 5, null, { start: 0.1, stap: 0.05, w: 70, vul: i => (i === 1 ? BLAUW : null) });
  const r2 = rij(h, 600, 885, 5, null, { start: 0.3, stap: 0.05, w: 70, vul: i => (i === 3 && b > 0 ? ROOD : null) });
  return (a > 0 ? label(250, 775, 'YOU', BLAUW, Math.min(1, a).toFixed(3), 34) : '') + r1 + (b > 0 ? label(250, 900, 'THEM', ROOD, Math.min(1, b).toFixed(3), 34) : '') + r2
    + (c > 0 ? label(600, 978, 'NEVER THE SAME DAY', I, Math.min(1, c).toFixed(3), 30) : ''); };

// Scène 15 (straat): tijdlijn 1929 → 1931 → 1940
const tijdlijn = h => { const pts = [[260, '1929', '5', 0], [540, '1931', '6', h.op('six', 1.2)], [820, '1940', '7', h.op('forty', 3.0)]];
  let s = `<path d="M 200 860 L 880 860" stroke="${I}" stroke-width="6" stroke-linecap="round" opacity="${zicht(h, 0)}"/>`;
  for (const [x, jaar, n, st] of pts) { const q = pop(h, st); if (q <= 0) continue;
    const goed = n === '7';
    s += sch(x, 860, q, `<circle cx="${x}" cy="860" r="18" fill="${goed ? GROEN : ROOD}" stroke="${I}" stroke-width="5"/>` + label(x, 805, jaar, I, 1, 40)
      + `<text x="${x}" y="960" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="70" fill="${goed ? GROEN : ROOD}">${n}</text>`); }
  const v = pop(h, h.op('seven', 4.0)); if (v > 0) s += `<g opacity="${Math.min(1, v).toFixed(3)}">${vink(905, 930, 26)}</g>`;
  return s; };

// Scène 17 (klas): de zeven lichten boven een week van zeven
const slot = h => lichten(h, 0, 0.1, false, 800) + rij(h, 540, 935, 7, ['S', 'M', 'T', 'W', 'T', 'F', 'S'], { start: h.op('seven', 1.0), stap: 0.06, w: 78, kleur: KRIJT, papier: '#2E4A3E' });

module.exports = {
  code: 'YL01',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3"
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stemPlafond: 1300,   // stemtegoed tot 14 dec krap ("Tot 14 dec rustiger", Andries ma 16 nov 2026 ±20:55)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-18-YL01-week',
  nummer: 'No. L1',
  onderwerp: 'THE WEEK',
  pakket: {
    dag: 'donderdag 19 november 2026', tijd: '16:00',   // nieuw ritme: video om 16:00 (Andries ma 16 nov 2026 ±20:40); van wo 18 naar do 19 nov omdat het OK pas wo 12:09 kwam en Studio pas om 17:00 vrij is
    gelezen: 'ma 16 nov 2026',
    titel: 'Why does a week have seven days?',
    intro: 'Most likely because ancient Babylonian sky-watchers counted seven special lights in the sky. The Romans named the days after them, and when the Soviet Union tried a five-day week, it didn\'t last.',
    feiten: ['The Babylonians held seven as a holy number: the number of objects in the sky they could observe, "the sun, the moon, Mercury, Venus, Mars, Jupiter, and Saturn." (Atlas Obscura) "The Babylonians divided their lunar months into seven-day weeks." (The Conversation)',
      'A month of around 29 days divides "basically into four parts", close to seven days each; the seventh day had religious duties such as rest. (Atlas Obscura)',
      '"Sunday is the Sun\'s day, and Monday is the Moon\'s day"; Saturday comes from Latin "dies Saturni" (Saturn\'s day). (The Old Farmer\'s Almanac)',
      'The Romans kept the older eight-day cycle alongside the seven-day week "until Constantine officially banned the eight-day cycle in 321 AD." (Atlas Obscura)',
      'In 1929 the USSR switched to five-day weeks with a different rest day for each worker; "most people did not have the same rest day as their spouses, or friends, or family." In 1931 it became a six-day week, and "in 1940 the USSR gave up and went back to a seven-day week." (Atlas Obscura)'],
    bronnen: [['Dan Nosowitz, "Why Can\'t We Get Rid of the 7-Day Week?", Atlas Obscura (September 17, 2015)', 'https://www.atlasobscura.com/articles/why-cant-we-get-rid-of-the-7day-week'],
      ['Kristin Heineman, "Why are there 7 days in a week? Thank the Babylonians", The Conversation, via Astronomy.com (January 25, 2024)', 'https://www.astronomy.com/science/why-are-there-7-days-in-a-week-thank-the-babylonians/'],
      ['Catherine Boeckmann, "Where Do the Names of the Days of the Week Come From?", The Old Farmer\'s Almanac (March 10, 2026)', 'https://www.almanac.com/origin-day-names']],
    hashtags: '#Shorts #history #calendar #everydaythings',
    tags: 'week, seven day week, why does a week have seven days, days of the week, babylonians, calendar history, soviet calendar, five day week, roman calendar, history of everyday things, why things are the way they are, shorts',
    md: [['Dan Nosowitz, "Why Can\'t We Get Rid of the 7-Day Week?", Atlas Obscura (17 sep 2015)', 'https://www.atlasobscura.com/articles/why-cant-we-get-rid-of-the-7day-week',
      ['"our best guess for the creation of the seven-day week is that the idea originated in ancient Babylonia."',
        'De Babyloniërs zagen zeven als heilig getal, "that being the number of objects in our Solar System they could observe at the time: the sun, the moon, Mercury, Venus, Mars, Jupiter, and Saturn."',
        'Een maand van "around 29 days" deel je "basically into four parts", dicht bij zeven; "the seventh day having certain religious responsibilities (relaxation, cessation of work, worship…)".',
        'De Romeinen hielden naast de week van zeven ook de oudere cyclus van acht dagen aan "until Constantine officially banned the eight-day cycle in 321 AD."',
        '1929: de USSR ging over op weken van 5 dagen; elke werker kreeg een eigen rustdag; "most people did not have the same rest day as their spouses, or friends, or family."',
        '"In 1931, the USSR changed their schedule to a six-day week"; "in 1940 the USSR gave up and went back to a seven-day week."']],
      ['Kristin Heineman, "Why are there 7 days in a week? Thank the Babylonians", The Conversation, via Astronomy.com (25 jan 2024)', 'https://www.astronomy.com/science/why-are-there-7-days-in-a-week-thank-the-babylonians/',
      ['"The Babylonians divided their lunar months into seven-day weeks."',
        '"they observed seven celestial bodies – the Sun, the Moon, Mercury, Venus, Mars, Jupiter and Saturn".']],
      ['Catherine Boeckmann, "Where Do the Names of the Days of the Week Come From?", The Old Farmer\'s Almanac (10 mrt 2026)', 'https://www.almanac.com/origin-day-names',
      ['"The names originated with the ancient Romans, who used the Latin words for the Sun, the Moon, and the five known planets!"',
        '"Sunday is the Sun\'s day, and Monday is the Moon\'s day."',
        'Saturday: Latijn "dies Saturni" (Saturn\'s day).']]],
    niet: '- Niet gezegd: de Joodse sabbat, de week van tien dagen in Egypte of tijdens de Franse Revolutie, de herkomst van dinsdag t/m vrijdag (Germaanse goden) en de volgorde van de dagen. "Most likely" bij de Babyloniërs, omdat Atlas Obscura het "our best guess" noemt. Kalenders, hemellichamen, kaarten, tijdlijn, decors en figuren zijn eigen tekenwerk.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 3.2, stem: 'Why does a week have seven days? Why not five, or ten?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['five', 'pop', 0.5]],
      teken: h => vraagWeek(h) + h.kin('Why *seven* days?', { y: 300, g: 108, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.8, stem: 'Ha! Most likely, thank the ancient Babylonians. They counted seven special lights in the sky.', in: 'zweep', bron: AO, bronStart: 'Babylonians', camera: { zoom: [1, 1.05] }, geluid: [['Babylonians', 'pop', 0.5], ['lights', 'whoosh', 0.4]],
      teken: h => zeven(h) + h.kin('Thank the *Babylonians*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.6, stem: 'The Sun, the Moon, Mercury, Venus, Mars, Jupiter and Saturn. So seven became a holy number.', bron: CONV, bronStart: 'Sun', camera: { zoom: [1.02, 1.06] }, geluid: [['Sun', 'tik', 0.4], ['Saturn', 'tik', 0.4], ['holy', 'stijg', 0.4]],
      teken: h => namen(h) + h.kin('Seven *lights*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.8, stem: 'Seven lights, seven days?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Seven *days*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.6, stem: 'Pretty much! And it fit the Moon: a month of about twenty-nine days splits into four parts of about seven.', in: 'zweep', bron: AO, bronStart: 'month', camera: { zoom: [1, 1.05] }, geluid: [['month', 'pop', 0.5], ['four', 'tik', 0.5]],
      teken: h => maand(h) + h.kin('The *Moon* fit too.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 2.6, stem: 'And the seventh day was for rest.', bron: AO, bronStart: 'seventh', camera: { zoom: [1.02, 1.06] }, geluid: [['rest', 'pop', 0.5]],
      teken: h => rust(h) + h.kin('Day 7: *rest*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 1.8, stem: 'And where do the names come from?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And the *names*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 5.0, stem: 'The Romans named the days after those seven lights. Sunday is the Sun\'s day. Monday, the Moon\'s day. Saturday, Saturn\'s day!', in: 'zweep', bron: ALM, bronStart: 'Romans', camera: { zoom: [1, 1.05] }, geluid: [['Sunday', 'pop', 0.5], ['Monday', 'pop', 0.5], ['Saturday', 'pop', 0.6]],
      teken: h => dagen(h) + h.kin('*Saturn*-day!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 2.0, stem: 'So the Romans always had seven days?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Always *seven*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 4.6, stem: 'Nope! They also kept an older eight-day cycle, until Emperor Constantine banned it in the year three hundred twenty-one.', in: 'zweep', bron: AO, bronStart: 'eight', camera: { zoom: [1.02, 1.06] }, geluid: [['eight', 'pop', 0.5], ['banned', 'klap', 0.6]],
      teken: h => acht(h) + h.kin('An *eight*-day cycle!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'straat', shot: 'dichtbij', duur: 1.8, stem: 'Has anyone tried to change it since?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Anyone tried to *change* it?', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'straat', duur: 4.4, stem: 'Yes! In nineteen twenty-nine, the Soviet Union switched to a five-day week, so the factories never had to stop.', in: 'zweep', bron: AO, bronStart: 'nineteen', camera: { zoom: [1, 1.05] }, geluid: [['nineteen', 'boem', 0.5], ['five', 'pop', 0.6]],
      teken: h => vijf(h) + h.kin('A *five*-day week!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'straat', duur: 4.2, stem: 'Every worker got a different day off. Families and friends often couldn\'t rest on the same day!', bron: AO, bronStart: 'different', camera: { zoom: [1.02, 1.06] }, geluid: [['different', 'tik', 0.5], ['same', 'pop', 0.6]],
      teken: h => apart(h) + h.kin('Different *days off*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'straat', shot: 'dichtbij', duur: 1.6, stem: 'That sounds terrible!', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('*Terrible*!', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'straat', duur: 4.6, stem: 'It was! In nineteen thirty-one they tried six days. And in nineteen forty, they gave up and went back to seven.', in: 'zweep', bron: AO, bronStart: 'thirty', camera: { zoom: [1, 1.05] }, geluid: [['six', 'tik', 0.5], ['forty', 'tik', 0.5], ['seven', 'stijg', 0.5]],
      teken: h => tijdlijn(h) + h.kin('Back to *seven*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.8, stem: 'So why seven, and not five or ten?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Why not *five* or *ten*?', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.6, stem: 'Because long ago, people counted seven lights in the sky. And the seven stuck!', pose: { antwoord: 'verbaasd' }, bron: AO, bronStart: 'counted', camera: { zoom: [1.03, 1.0] }, geluid: [['seven', 'pop', 0.5], ['stuck', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('Seven lights. *Seven days*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
  ],
};
