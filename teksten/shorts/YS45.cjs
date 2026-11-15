// YS45 — Why are golf balls full of dents?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Met het watermerk
// (Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje").
// Bedoeling kanaal 1 (jesse-14, docs/manager/bedoeling-per-kanaal.md): educatief + leuk; eindigt met één zin om na te
// vertellen ("nearly twice as far") en een slot dat terugkoppelt naar de beginvraag ("did someone hit it too hard?" →
// "not damage").
// Bronnen (gelezen zo 15 nov 2026): Mike Shelton, "Probing Question: How do dimples make golf balls travel farther?",
// Penn State News (17 jun 2007), met Mark D. Maughmer, hoogleraar luchtvaarttechniek; Craig DeForest, "Why are Golf
// Balls Dimpled?", The Physics FAQ (bijgewerkt 1997).
// Niet gezegd: gutta-percha, 1848, wie de eerste bal maakte, octrooien, het aantal deukjes en het effect van backspin
// (staat niet of niet eenduidig in deze bronnen, of past niet in de tijd).
const PSU = 'Penn State (2007)';
const FAQ = 'The Physics FAQ';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', DEUK = '#D3CFC4';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);

// Golfbal; deuk 0 = glad, 1 = vol deukjes. De deukjes komen in een vaste, verspreide volgorde.
const bal = (x, y, r, { deuk = 1, id, op = 1, schaduw = true } = {}) => {
  let s = `<g opacity="${op}">` + (schaduw ? `<ellipse cx="${x}" cy="${(y + r * 1.04).toFixed(1)}" rx="${(r * 0.8).toFixed(1)}" ry="${(r * 0.14).toFixed(1)}" fill="#000" opacity="0.16"/>` : '');
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="${I}" stroke-width="${Math.max(3, r * 0.055).toFixed(1)}"/>`;
  if (deuk > 0 && r >= 30) {
    const d = r * 0.21; let k = '';
    for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) {
      const cx = x + (i + (j % 2 ? 0.5 : 0)) * d * 1.12, cy = y + j * d * 0.97, a = Math.hypot(cx - x, cy - y) / r;
      if (a > 0.9) continue;
      const volg = ((i * 7 + j * 13 + 91) % 17) / 17; if (volg >= deuk) continue;
      const sh = 1 - 0.5 * a * a;
      k += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(d * 0.36 * sh).toFixed(1)}" ry="${(d * 0.36).toFixed(1)}" fill="${DEUK}"/>`;
    }
    s += `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${(r * 0.95).toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${k}</g>`;
  } else if (deuk > 0) {
    s += `<path d="M ${x - r * 0.4} ${y - r * 0.2} l ${r * 0.3} ${r * 0.1} M ${x + r * 0.1} ${y + r * 0.3} l ${r * 0.3} -${r * 0.1} M ${x} ${y - r * 0.5} l ${r * 0.1} ${r * 0.25}" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return s + `<circle cx="${(x - r * 0.32).toFixed(1)}" cy="${(y - r * 0.34).toFixed(1)}" r="${(r * 0.14).toFixed(1)}" fill="#FFFFFF"/></g>`; };

// Bord op de golfbaan / in de kamer: één grote bal die binnen popt (glad of met deukjes)
const groot = (h, deuk, id, { label = '', y = 860, r = 115 } = {}) => { const q = pop(h, 0, 0.35);
  return (label ? `<text x="540" y="722" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${h.K.signaal}" letter-spacing="3" opacity="${zicht(h, 0.1)}">${label}</text>` : '')
    + `<g opacity="${zicht(h, 0, 0.08)}" transform="translate(540 ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(-540 -${y})">${bal(540, y, r, { deuk, id })}</g>`; };

// Twee banen vanaf de tee: een korte (glad) en een lange (gedeukt), met de bal die meevliegt
const qb = (p0, p1, p2, u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
const boog = (h, start, eind, top, kleur, label, deuk, dur = 1.0) => { const u = h.zacht(h.klem((h.t - start) / dur)), T = [200, 955];
  if (h.t < start) return '';
  const p1 = [(T[0] + eind) / 2, 2 * top - 955], n = Math.max(2, Math.round(40 * u)); let pts = [];
  for (let i = 0; i <= n; i++) pts.push(qb(T, p1, [eind, 955], u * i / n).map(v => v.toFixed(1)).join(','));
  const [bx, by] = qb(T, p1, [eind, 955], u);
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${kleur}" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/>`
    + bal(+bx.toFixed(1), +by.toFixed(1) - 18, 18, { deuk, schaduw: false })
    + (u > 0.98 ? `<text x="${Math.min(eind, 925 - label.length * 8.6).toFixed(0)}" y="992" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="28" fill="${kleur}" opacity="${zicht(h, start + dur)}">${label}</text>` : ''); };
const tee = `<path d="M 160 955 L 920 955" stroke="#7DB86A" stroke-width="10" stroke-linecap="round"/><path d="M 194 955 L 200 935 L 206 955 Z" fill="#D9432B"/>`;

// Hamertje dat tikt; de deukjes komen tijdens het tikken
const hamer = (h, t0, dur) => { const u = h.klem((h.t - t0) / dur), tik = Math.abs(Math.sin((h.t - t0) * Math.PI * 3.2)), a = h.t < t0 ? -40 : -40 + 40 * (1 - tik);
  return bal(600, 850, 120, { deuk: u, id: 'b45h' })
    + `<g transform="translate(476 830) rotate(${a.toFixed(1)})"><rect x="-210" y="-10" width="200" height="20" rx="8" fill="#B07A45" stroke="${I}" stroke-width="5"/>`
    + `<rect x="-30" y="-44" width="44" height="88" rx="8" fill="#6E6A62" stroke="${I}" stroke-width="6"/></g>`; };

// Schoolbord: "1905", met een bal vol deukjes ernaast
const jaar = (h, tJaar) => { const q = pop(h, tJaar), b = pop(h, tJaar + 0.5);
  return `<text x="540" y="738" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${GEEL}" letter-spacing="2" opacity="${zicht(h, 0.1)}">MADE WITH DIMPLES</text>`
    + (q > 0 ? `<text x="420" y="935" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(170 * (0.75 + 0.25 * q)).toFixed(0)}" fill="${KRIJT}" opacity="${zicht(h, tJaar)}">1905</text>` : '')
    + (b > 0 ? `<g opacity="${zicht(h, tJaar + 0.5)}" transform="translate(790 870) scale(${(0.6 + 0.4 * b).toFixed(3)}) translate(-790 -870)">${bal(790, 870, 92, { id: 'b45j' })}</g>` : ''); };

// Schoolbord: luchtspoor achter een gladde bal (groot) en achter een bal met deukjes (klein)
const spoor = (x, y, r, L, H, g) => { const l = L * g, hh = H * (0.4 + 0.6 * g);
  return `<path d="M ${x + r * 0.2} ${y - r * 0.95} C ${x + l * 0.35} ${y - hh}, ${x + l * 0.75} ${y - hh * 0.8}, ${x + l} ${y} C ${x + l * 0.75} ${y + hh * 0.8}, ${x + l * 0.35} ${y + hh}, ${x + r * 0.2} ${y + r * 0.95} Z" fill="${KRIJT}" opacity="${(0.28 * g).toFixed(3)}"/>`
    + [0.35, 0.6, 0.82].map((f, i) => `<path d="M ${x + l * f} ${y - hh * 0.35 * (i % 2 ? 1 : -1)} q ${hh * 0.25} ${hh * 0.2} 0 ${hh * 0.4}" fill="none" stroke="${KRIJT}" stroke-width="4" opacity="${(0.7 * g).toFixed(3)}" stroke-linecap="round"/>`).join(''); };
const lucht = (h, tGlad, tDeuk) => { const a = h.zacht(h.klem((h.t - tGlad) / 0.7)), b = h.zacht(h.klem((h.t - tDeuk) / 0.7));
  const lijn = (y, r) => [-1, 1].map(z => `<path d="M 170 ${y + z * (r + 16)} L 300 ${y + z * (r + 16)}" stroke="${KRIJT}" stroke-width="4" stroke-dasharray="10 10" opacity="0.6"/>`).join('');
  return `<text x="540" y="722" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${GEEL}" letter-spacing="3">AIR  →</text>`
    + lijn(800, 48) + spoor(360, 800, 48, 540, 82, a) + bal(360, 800, 48, { deuk: 0, schaduw: false })
    + `<text x="560" y="808" font-family="IBM Plex Mono" font-weight="700" font-size="30" fill="${KRIJT}" opacity="${zicht(h, tGlad + 0.5)}">smooth: big wake</text>`
    + lijn(925, 48) + spoor(360, 925, 48, 250, 48, b) + bal(360, 925, 48, { id: 'b45l', schaduw: false })
    + `<text x="640" y="934" font-family="IBM Plex Mono" font-weight="700" font-size="30" fill="${GEEL}" opacity="${zicht(h, tDeuk + 0.5)}">dents: small</text>`; };

module.exports = {
  code: 'YS45',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  watermerk: true,   // Andries zo 15 nov 2026 ±12:50 en ±13:26: "A, onder het kaartje"
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-20-YS45-golf-ball',
  nummer: 'No. 45',
  onderwerp: 'THE GOLF BALL',
  pakket: {
    dag: 'vrijdag 20 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why are golf balls full of dents?',
    intro: 'Early golf balls were smooth. Then golfers noticed their old, beat-up balls flew farther, and started denting new ones on purpose. Today the dimples help a ball fly nearly twice as far.',
    feiten: ['"In the early days of golf in Scotland, golfers discovered that their old golf balls went farther than the new, smooth ones." (Mark D. Maughmer, Penn State)',
      '"It wasn\'t long before golfers were intentionally pitting their brand-new balls to improve their games." (Penn State)',
      '"By 1905, golf balls were being manufactured with dimples, as they have been ever since." (Penn State)',
      'Dimples make the air "cling to the flying ball a little bit longer before it separates", and "a smaller wake means less air pressure pulling on the back of a golf ball" (Penn State).',
      '"Dimpled balls can travel nearly twice as far as smooth ones." (Penn State)',
      'The Physics FAQ also notes that "golfers noticed that old roughened golf balls travelled farther."'],
    bronnen: [['Mike Shelton, "Probing Question: How do dimples make golf balls travel farther?", Penn State News (June 17, 2007)', 'https://www.psu.edu/news/research/story/probing-question-how-do-dimples-make-golf-balls-travel-farther'],
      ['Craig DeForest, "Why are Golf Balls Dimpled?", The Physics FAQ (updated 1997)', 'https://math.ucr.edu/home/baez/physics/General/golf.html']],
    hashtags: '#Shorts #golf #physics #everydaythings',
    tags: 'golf ball, golf ball dimples, why do golf balls have dimples, dimples, golf history, aerodynamics, drag, wake, physics, history of everyday things, why things are the way they are, shorts',
    md: [['Mike Shelton, "Probing Question: How do dimples make golf balls travel farther?", Penn State News (17 jun 2007; deskundige Mark D. Maughmer, hoogleraar luchtvaarttechniek)', 'https://www.psu.edu/news/research/story/probing-question-how-do-dimples-make-golf-balls-travel-farther',
      ['"In the early days of golf in Scotland, golfers discovered that their old golf balls went farther than the new, smooth ones"',
        '"It wasn\'t long before golfers were intentionally pitting their brand-new balls to improve their games."',
        '"By 1905, golf balls were being manufactured with dimples, as they have been ever since."',
        '"cling to the flying ball a little bit longer before it separates"',
        '"A smaller wake means less air pressure pulling on the back of a golf ball as it sails toward the green."',
        '"Dimpled balls can travel nearly twice as far as smooth ones."']],
      ['Craig DeForest, "Why are Golf Balls Dimpled?", The Physics FAQ (bijgewerkt 1993 en 1997)', 'https://math.ucr.edu/home/baez/physics/General/golf.html',
      ['"golfers noticed that old roughened golf balls travelled farther."']]],
    niet: '- Niet gezegd: gutta-percha, 1848, wie de eerste bal maakte, octrooien, het aantal deukjes en het effect van backspin. De Physics FAQ zegt ook dat de deukjes de weerstand "slightly" verhogen (wrijving langs de bal); daarom zegt de short niet "less drag" maar, met Penn State, dat het spoor achter de bal kleiner is en minder terugtrekt. "Nearly twice as far" is het getal van Penn State; de bogen en luchtsporen zijn een tekening, geen meting. Ballen, hamer, borden, decors en figuren zijn eigen tekenwerk; geen merk of echte bal in beeld.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 3.2, stem: 'Why is a golf ball full of dents? Did someone hit it too hard?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], [0.1, 'whoosh', 0.4]],
      teken: h => groot(h, 1, 'b45a') + h.krabbel.cirkel(540, 860, 170, 150, { t: h.t, start: h.op('dents', 1.2) }) + h.kin('Why is a golf ball full of *dents*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 3.4, stem: 'Ha! In the early days of golf in Scotland, the balls were smooth.', in: 'zweep', bron: PSU, bronStart: 'scotland', camera: { zoom: [1, 1.05] }, geluid: [['smooth', 'pop', 0.5]],
      teken: h => groot(h, 0, 'b45b', { label: 'EARLY GOLF · SCOTLAND', y: 870, r: 105 }) + h.kin('Golf balls used to be *smooth*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 4.2, stem: 'But golfers found that their old, beat-up balls flew farther than the new smooth ones!', bron: PSU, bronStart: 'golfers', camera: { zoom: [1.02, 1.07] }, geluid: [['old', 'whoosh', 0.4], ['farther', 'klap', 0.5]],
      teken: h => tee + boog(h, h.op('new', 2.6), 520, 820, '#2F7E86', 'NEW · SMOOTH', 0, 0.8) + boog(h, h.op('old', 0.9), 860, 720, h.K.signaal, 'OLD · BEAT-UP', 1, 1.2)
        + h.kin('Old *beat-up* balls went *farther*!', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'green', shot: 'dichtbij', duur: 1.7, stem: 'Wait, the beat-up ones flew better?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('The *beat-up* ones flew better?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 3.3, stem: 'Yep! So golfers started denting their brand-new balls on purpose.', in: 'zweep', bron: PSU, bronStart: 'denting', camera: { zoom: [1, 1.05] }, geluid: [['denting', 'tik', 0.5], ['purpose', 'pop', 0.6]],
      teken: h => hamer(h, h.op('denting', 1.0), 2.0) + h.kin('Dents… *on purpose*!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.4, stem: 'And by nineteen oh five, golf balls were being made with dimples.', bron: PSU, bronStart: 'nineteen', camera: { zoom: [1, 1.05] }, geluid: [['nineteen', 'klap', 0.5], ['dimples', 'pop', 0.5]],
      teken: h => jaar(h, h.op('nineteen', 0.6)) + h.kin('By *1905*: dimples built in.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 1.6, stem: 'But how do little dents help?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('How do *dents* help?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 5.0, stem: 'The dents make the air hug the ball longer, so the wake behind it is smaller and pulls it back less.', in: 'zweep', bron: PSU, bronStart: 'hug', camera: { zoom: [1.02, 1.07] }, geluid: [['hug', 'tik', 0.5], ['smaller', 'pop', 0.6]],
      teken: h => lucht(h, h.op('air', 0.8), h.op('smaller', 2.6)) + h.kin('Air *hugs* the ball longer.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.7, stem: 'So how much farther does it fly?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('How much *farther*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 4.6, stem: "Nearly twice as far as a smooth ball! So those dents? Not damage. They're why it flies.", in: 'zweep', pose: { antwoord: 'verbaasd' }, bron: PSU, bronStart: 'twice', camera: { zoom: [1.03, 1.0] }, geluid: [['twice', 'stijg', 0.4], ['damage', 'pop', 0.6], [-0.6, 'stijg', 0.5]],
      teken: h => tee + boog(h, 0.15, 500, 830, '#2F7E86', 'SMOOTH: 1×', 0, 0.7) + boog(h, h.op('twice', 0.5), 880, 700, h.K.signaal, 'DENTS: ≈ 2×', 1, 1.1)
        + h.kin('Nearly *twice as far*!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
  ],
};
