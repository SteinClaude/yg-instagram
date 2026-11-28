// YS51 — Why does popcorn pop?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors. Met watermerk (Andries zo 15 nov 2026 ±12:50 en ±13:26).
// Gemaakt na "Ja, nu al" (Andries wo 25 nov 2026 ±19:53) en "de automaat is klaar plan in met de voorraad" (za 28 nov ±15:56).
// Bronnen (uitgezocht za 28 nov 2026, docs/bronnen-voorraad.md): Virot en Ponomarenko, "Popcorn: critical temperature,
// jump and sound", J. R. Soc. Interface (2015); Rachel Nuwer, Scientific American (2015); Purdue University College of
// Agriculture (2020); USDA National Agricultural Library; Popcorn Board.
// Niet gezegd: "old maids", "het geluid is de schil die barst", drukgetallen. Het geluid als waterdamp is in het artikel
// een hypothese: in de video "Scientists think".
const VP = 'J. R. Soc. Interface';
const SA = 'Scientific American';
const PU = 'Purdue University';
const US = 'USDA';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', GROEN = '#5FA35A', BLAUW = '#4E8FB8', GRIJS = '#6E7179', ROOM = '#FFF6DE', SCHIL = '#E8A33A', WATER = '#6FB6E8';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
// Doorzichtigheid op een losse lijn altijd met stroke-opacity (opacity op een lijn liet resvg vastlopen, YS50).

// Maïskorrel (dicht), midden op (x, y)
const korrel = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">`
  + `<path d="M 0 -48 C 34 -48 44 -10 34 18 C 26 40 10 52 0 52 C -10 52 -26 40 -34 18 C -44 -10 -34 -48 0 -48 Z" fill="${SCHIL}" stroke="${I}" stroke-width="5"/>`
  + `<path d="M -12 30 C -6 44 6 44 12 30" fill="#F7E3B0" stroke="${I}" stroke-width="3"/>`
  + `<path d="M -18 -30 Q -24 -10 -20 6" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-opacity="0.5"/></g>`;
// Popcorn (open)
const pof = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">`
  + `<path d="M -40 10 C -60 -10 -40 -44 -14 -36 C -8 -60 30 -60 34 -32 C 60 -36 66 0 44 12 C 56 34 30 52 10 40 C 0 58 -34 54 -32 34 C -54 34 -58 18 -40 10 Z" fill="${ROOM}" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
  + `<path d="M -6 30 C 0 40 12 40 16 30" fill="${SCHIL}" stroke="${I}" stroke-width="3"/></g>`;
// Pan
const pan = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -150 -10 L 150 -10 L 130 40 Q 0 58 -130 40 Z" fill="#3A3D45" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
  + `<rect x="150" y="-6" width="130" height="18" rx="9" fill="#6A4A34" stroke="${I}" stroke-width="5"/></g>`;
// Doorsnede van een korrel: harde schil, zacht zetmeel, druppel water. stoom 0..1: de druppel wordt damp, druk 0..1: pijlen
const doorsnede = (x, y, s = 1, stoom = 0, druk = 0) => {
  const d = 1 - stoom;
  let uit = `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<path d="M 0 -96 C 68 -96 88 -20 68 36 C 52 80 20 104 0 104 C -20 104 -52 80 -68 36 C -88 -20 -68 -96 0 -96 Z" fill="${SCHIL}" stroke="${I}" stroke-width="6"/>`
    + `<path d="M 0 -78 C 54 -78 70 -18 54 30 C 42 66 16 86 0 86 C -16 86 -42 66 -54 30 C -70 -18 -54 -78 0 -78 Z" fill="${ROOM}" stroke="${I}" stroke-width="3"/>`;
  if (d > 0.02) uit += `<g transform="translate(0 4) scale(${d.toFixed(3)})"><path d="M 0 -26 C 16 -2 22 10 22 18 A 22 22 0 0 1 -22 18 C -22 10 -16 -2 0 -26 Z" fill="${WATER}" stroke="${I}" stroke-width="4"/></g>`;
  if (stoom > 0.02) uit += [[-22, 10], [0, -14], [22, 8]].map(([a, b], i) => `<path d="M ${a} ${b + 22} q -10 -12 0 -24 q 10 -12 0 -24" fill="none" stroke="#9FB4C2" stroke-width="7" stroke-linecap="round" stroke-opacity="${Math.min(1, stoom * 1.4).toFixed(3)}" transform="translate(0 ${(-6 * i * stoom).toFixed(2)})"/>`).join('');
  if (druk > 0.02) uit += [0, 60, 120, 180, 240, 300].map(a => { const r1 = 112, r2 = 112 + 34 * druk;
    const c = Math.cos(a * Math.PI / 180), si = Math.sin(a * Math.PI / 180);
    return `<path d="M ${(c * r1).toFixed(1)} ${(si * r1).toFixed(1)} L ${(c * r2).toFixed(1)} ${(si * r2).toFixed(1)}" stroke="${ROOD}" stroke-width="8" stroke-linecap="round"/>`; }).join('');
  return uit + '</g>';
};
// Staaf in de grafiek: deel 0..1 van de hoogte
const staaf = (x, basis, deel, kleur) => { const hgt = Math.max(2, 160 * deel);
  return `<rect x="${x - 55}" y="${(basis - hgt).toFixed(1)}" width="110" height="${hgt.toFixed(1)}" rx="8" fill="${kleur}" stroke="${I}" stroke-width="5"/>`; };
// Wolkje stoom met POP!
const stoomwolk = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -70 20 C -96 18 -96 -24 -66 -26 C -64 -56 -22 -66 -6 -44 C 14 -70 60 -58 58 -26 C 92 -26 94 18 66 22 Z" fill="#E6EEF3" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
  + `<text x="0" y="6" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${ROOD}">POP!</text></g>`;
// Barst in een schil (met kruis als het fout is)
const barst = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M 0 -60 C 40 -60 50 -20 40 14 C 30 40 14 52 0 52 C -14 52 -30 40 -40 14 C -50 -20 -40 -60 0 -60 Z" fill="${SCHIL}" stroke="${I}" stroke-width="5"/>`
  + `<path d="M -6 -58 L 6 -30 L -8 -8 L 8 18" fill="none" stroke="${I}" stroke-width="5" stroke-linejoin="round"/></g>`;
const kruis = (x, y, op = 1, kleur = ROOD) => `<path d="M ${x - 34} ${y - 34} L ${x + 34} ${y + 34} M ${x + 34} ${y - 34} L ${x - 34} ${y + 34}" stroke="${kleur}" stroke-width="13" stroke-linecap="round" stroke-opacity="${op}"/>`;
const vink = (x, y, op = 1, kleur = GROEN) => `<path d="M ${x - 30} ${y} L ${x - 8} ${y + 22} L ${x + 32} ${y - 26}" fill="none" stroke="${kleur}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${op}"/>`;
// Veer onder de korrel; in 0..1 (0 = ingedrukt)
const veer = (x, y, uit) => { const hgt = 30 + 40 * uit, n = 5; let d = `M ${x} ${y}`;
  for (let i = 1; i <= n; i++) d += ` L ${x + (i % 2 ? 22 : -22)} ${(y - hgt * (i - 0.5) / n).toFixed(1)}`;
  d += ` L ${x} ${(y - hgt).toFixed(1)}`;
  return `<path d="${d}" fill="none" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`; };
// Stopwatch
const stopwatch = (x, y, s = 1, hoek = 0) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<rect x="-14" y="-92" width="28" height="22" rx="5" fill="${GRIJS}" stroke="${I}" stroke-width="5"/>`
  + `<circle cx="0" cy="0" r="72" fill="#FFFFFF" stroke="${I}" stroke-width="7"/>`
  + [0, 90, 180, 270].map(a => `<path d="M 0 -60 L 0 -50" stroke="${I}" stroke-width="5" transform="rotate(${a})"/>`).join('')
  + `<path d="M 0 6 L 0 -50" stroke="${ROOD}" stroke-width="6" stroke-linecap="round" transform="rotate(${hoek.toFixed(1)})"/><circle cx="0" cy="0" r="8" fill="${I}"/></g>`;

// Scène 1 (kamer): pan met korrels, één springt op
const vraag1 = h => { const q = pop(h, 0, 0.35), sp = h.klem((h.t - h.op('pop', 1.0, 1)) / 0.5), hop = -70 * Math.sin(Math.PI * sp);
  return sch(540, 960, q, '<g transform="translate(540 880) scale(1.35) translate(-540 -940)">' + pan(540, 960, 1.05) + korrel(450, 930, 0.6, -20) + korrel(560, 925, 0.6, 15) + korrel(640, 932, 0.6, 40)
    + (sp > 0 && sp < 1 ? pof(520, 920 + hop, 0.75, 360 * sp) : sp >= 1 ? pof(520, 900, 0.75) : korrel(520, 920, 0.6, 5)) + '</g>'); };
// Scène 2 (atelier): de korrel als snelkookpan met een druppel water
const kookpan = h => { const q = pop(h, 0, 0.35), w = pop(h, h.op('water', 1.6));
  return sch(540, 870, q, doorsnede(540, 870, 1.05 * (0.85 + 0.15 * w)))
    + (w > 0 ? label(800, 830, 'WATER', BLAUW, Math.min(1, w).toFixed(3), 36) + `<path d="M 730 845 L 590 875" stroke="${BLAUW}" stroke-width="6" stroke-linecap="round" stroke-opacity="${Math.min(1, w).toFixed(3)}"/>` : '')
    + label(280, 830, 'SHELL', I, zicht(h, h.op('pressure', 0.8)), 34) + `<path d="M 290 845 L 445 870" stroke="${I}" stroke-width="6" stroke-linecap="round" stroke-opacity="${zicht(h, h.op('pressure', 0.8))}"/>`; };
// Scène 3 (atelier): water wordt stoom, de druk loopt op
const druk = h => { const s = h.zacht(h.klem((h.t - h.op('steam', 1.0)) / 0.8)), p = h.zacht(h.klem((h.t - h.op('pressure', 2.0)) / 1.2));
  const tril = p > 0.5 ? 3 * Math.sin(h.t * 60) : 0;
  return doorsnede(540 + tril, 870, 1.05, s, p) + label(830, 800, 'STEAM', GRIJS, zicht(h, h.op('steam', 1.0)), 34)
    + label(250, 990, 'PRESSURE', ROOD, zicht(h, h.op('pressure', 2.0)), 34); };
// Scène 5 (klas): grafiek 170 °C tegen 180 °C
const grafiek = h => { const a = h.zacht(h.klem((h.t - h.op('170', 2.4)) / 0.6)), b = h.zacht(h.klem((h.t - h.op('180', 0.6)) / 0.7));
  return staaf(380, 945, 0.34 * a, '#E0A060') + staaf(700, 945, 0.96 * b, GEEL)
    + label(380, 995, '170°C', KRIJT, zicht(h, h.op('170', 2.4)), 32) + label(700, 995, '180°C', KRIJT, zicht(h, h.op('180', 0.6)), 32)
    + label(380, 945 - 160 * 0.34 - 16, '1/3', KRIJT, zicht(h, h.op('third', 3.4)), 36)
    + label(700, 945 - 160 * 0.96 - 14, 'ALMOST ALL', GEEL, zicht(h, h.op('almost', 1.2)), 30); };
// Scène 6 (klas): het zetmeel pooft uit, de korrel gaat binnenstebuiten
const binnenstebuiten = h => { const u = h.zacht(h.klem((h.t - h.op('puffs', 0.8)) / 0.7));
  return (u < 0.5 ? sch(540, 880, 1 - u, korrel(540, 880, 1.6)) : sch(540, 870, (u - 0.5) * 2, pof(540, 870, 2.0)))
    + label(540, 995, 'INSIDE OUT!', GEEL, zicht(h, h.op('inside', 2.0)), 40); };
// Scène 8 (green): stoom (ja) tegen barst (nee)
const geluid = h => { const a = pop(h, h.op('steam', 1.2)), b = pop(h, h.op('shell', 2.4));
  return (a > 0 ? sch(320, 840, a, stoomwolk(320, 840, 1.6)) + vink(320, 975, Math.min(1, a).toFixed(3)) : '')
    + (b > 0 ? sch(760, 855, b, barst(760, 855, 1.5)) + kruis(760, 855, Math.min(1, b).toFixed(3)) + label(760, 995, 'NOT THIS', ROOD, Math.min(1, b).toFixed(3), 30) : ''); };
// Scène 10 (kamer): een pootje zetmeel duwt af als een veer
const sprong = h => { const t0 = h.op('pushes', 1.2), u = h.klem((h.t - t0) / 0.9), sprongH = u > 0.35 ? 90 * Math.sin(Math.PI * Math.min(1, (u - 0.35) / 0.65)) : 0;
  const ind = u < 0.35 ? 1 - u / 0.35 * 0.8 : Math.min(1, 0.2 + (u - 0.35) * 4);
  return pan(540, 958, 0.95) + veer(540, 948, ind) + pof(540, (948 - (30 + 40 * ind) - 36 - sprongH).toFixed(1), 1.0, u > 0.35 ? -40 * Math.min(1, (u - 0.35) / 0.65) : 0)
    + label(250, 820, 'LEG OF', ROOD, zicht(h, h.op('leg', 0.8)), 32) + label(250, 862, 'STARCH', ROOD, zicht(h, h.op('leg', 0.8)), 32)
    + label(830, 840, 'SPRING!', GROEN, zicht(h, h.op('spring', 2.4)), 36); };
// Scène 11 (kamer): slot: alles in een paar honderdsten van een seconde, POP!
const slot = h => { const q = pop(h, 0, 0.35), p = pop(h, h.op('Pop', 2.6), 0.25);
  return sch(330, 880, q, stopwatch(330, 880, 1.0, 40 * h.klem(h.t / 2))) + label(330, 995, '0.0X SEC', I, zicht(h, h.op('hundredths', 1.4)), 30)
    + (p > 0 ? sch(760, 860, p, pof(760, 860, 1.5, -10)) + label(760, 995, 'POP!', ROOD, Math.min(1, p).toFixed(3), 44) : sch(760, 870, q, korrel(760, 870, 1.1))); };

module.exports = {
  code: 'YS51',
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
  map: '2026-12-02-YS51-popcorn',
  nummer: 'No. 51',
  onderwerp: 'POPCORN',
  pakket: {
    dag: 'woensdag 2 december 2026', tijd: '20:00',
    gelezen: 'za 28 nov 2026',
    titel: 'Why does popcorn pop?',
    intro: 'Every kernel is a tiny pressure cooker: a drop of water inside a hard shell. Heat turns it into steam until the shell bursts, and a little leg of starch makes it jump.',
    feiten: ['"Each kernel of popcorn contains a small drop of water stored inside a circle of soft starch." (Popcorn Board)',
      'A kernel holds water inside a hard outer hull, the pericarp; "The kernel acts as a pressure cooker, building force as the water inside heats and vaporizes." (Purdue University)',
      '"96% of popcorn are popped at 180°C", but "only 34% of popcorn are popped at 170°C". (Virot and Ponomarenko, J. R. Soc. Interface)',
      'The starch expands into "a spongy flake", "turning the kernel inside out". (J. R. Soc. Interface; USDA National Agricultural Library)',
      'The researchers think "the familiar \'pop\' sound of the popcorn is caused by the release of water vapour", not by the shell cracking. (J. R. Soc. Interface)',
      '"a leg of starch is responsible for the observed motion"; it "compresses and releases like a spring". (J. R. Soc. Interface; Scientific American)',
      'It all happens "in some hundredths of a second". (J. R. Soc. Interface)'],
    bronnen: [['Emmanuel Virot and Alexandre Ponomarenko, "Popcorn: critical temperature, jump and sound", Journal of the Royal Society Interface (March 6, 2015)', 'https://doi.org/10.1098/rsif.2014.1247'],
      ['Rachel Nuwer, "Popcorn Physics 101: How a Kernel Pops", Scientific American (May 1, 2015)', 'https://www.scientificamerican.com/article/popcorn-physics-101-how-a-kernel-pops/'],
      ['Chad Campbell, "What\'s under the shell of this popular snack?", Purdue University College of Agriculture (February 7, 2020)', 'https://ag.purdue.edu/news/2020/02/whats-under-the-shell-of-this-popular-snack.html'],
      ['USDA National Agricultural Library, "How does popcorn pop?"', 'https://www.nal.usda.gov/exhibits/speccoll/exhibits/show/popcorn/how-does-popcorn-pop-?'],
      ['Popcorn Board, "What Makes Popcorn Pop?"', 'https://popcorn.org/All-About-Popcorn/What-Makes-Popcorn-Pop']],
    hashtags: '#Shorts #popcorn #science #everydaythings',
    tags: 'popcorn, why does popcorn pop, how popcorn pops, popcorn science, kitchen science, steam, pressure, physics, food science, everyday science, why things are the way they are, shorts',
    md: [['Emmanuel Virot en Alexandre Ponomarenko, "Popcorn: critical temperature, jump and sound", J. R. Soc. Interface 12(104): 20141247 (6 mrt 2015)', 'https://doi.org/10.1098/rsif.2014.1247',
      ['"Above a critical vapour pressure, the hull breaks."',
        '"96% of popcorn are popped at 180°C (48 out of 50)"; "only 34% of popcorn are popped at 170°C (17 out of 50)".',
        'Het zetmeel vormt "a spongy flake".',
        '"the familiar \'pop\' sound of the popcorn is caused by the release of water vapour" (in de tekst een hypothese: "it is reasonable to hypothesize").',
        '"a leg of starch is responsible for the observed motion".',
        '"Popcorn bursts open, jumps and emits a \'pop\' sound in some hundredths of a second."']],
      ['Rachel Nuwer, "Popcorn Physics 101: How a Kernel Pops", Scientific American (1 mei 2015)', 'https://www.scientificamerican.com/article/popcorn-physics-101-how-a-kernel-pops/',
      ['"96 percent of kernels pop at 356 degrees Fahrenheit".', 'Het pootje "compresses and releases like a spring, vaulting the kernel into the air".']],
      ['Chad Campbell, "What\'s under the shell of this popular snack?", Purdue University College of Agriculture (7 feb 2020)', 'https://ag.purdue.edu/news/2020/02/whats-under-the-shell-of-this-popular-snack.html',
      ['"The hard outer hull of popcorn, called the pericarp".', '"The kernel acts as a pressure cooker, building force as the water inside heats and vaporizes."']],
      ['USDA National Agricultural Library, "How does popcorn pop?" (geen datum)', 'https://www.nal.usda.gov/exhibits/speccoll/exhibits/show/popcorn/how-does-popcorn-pop-?',
      ['Het zetmeel pooft uit, "turning the kernel inside out".']],
      ['Popcorn Board, "What Makes Popcorn Pop?" (geen datum)', 'https://popcorn.org/All-About-Popcorn/What-Makes-Popcorn-Pop',
      ['"Each kernel of popcorn contains a small drop of water stored inside a circle of soft starch."']]],
    niet: '- Niet gezegd: drukgetallen (10 bar en 135 psi verschillen per bron), "old maids", waarom sommige korrels niet poppen, en de vergelijking met een turner (die gaat over de salto, niet over de sprong). Het geluid als ontsnappende stoom is in het artikel een hypothese; daarom "Scientists think". "Almost all" staat voor 96 % en "a third" voor 34 % (beide uit het artikel). Pan, korrels, popcorn, stoom, grafiek, veer, stopwatch, decors en figuren zijn eigen tekenwerk.',
  },
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.0, stem: 'Why does popcorn pop?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], [1.11, 'pop', 0.6]],
      teken: h => vraag1(h) + h.kin('Why does popcorn *pop*?', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 3.4, stem: 'Every kernel is a tiny pressure cooker, with a drop of water inside!', in: 'zweep', bron: PU, bronStart: 'pressure', camera: { zoom: [1, 1.05] }, geluid: [['pressure', 'tik', 0.5], ['water', 'pop', 0.5]],
      teken: h => kookpan(h) + h.kin('A tiny *pressure cooker*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 3.6, stem: 'Heat turns that water into steam, and the pressure builds inside the hard shell.', bron: PU, bronStart: 'steam', camera: { zoom: [1.02, 1.06] }, geluid: [['steam', 'whoosh', 0.4], ['pressure', 'stijg', 0.4]],
      teken: h => druk(h) + h.kin('Water becomes *steam*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'atelier', shot: 'dichtbij', duur: 1.4, stem: 'And then?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And *then*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.2, stem: 'At 180 degrees Celsius, almost every kernel bursts open. At 170, only a third!', in: 'zweep', bron: VP, bronStart: '180', camera: { zoom: [1, 1.05] }, geluid: [['180', 'boem', 0.5], ['bursts', 'pop', 0.6], ['170', 'tik', 0.5], ['third', 'pop', 0.4]],
      teken: h => grafiek(h) + h.kin('*180°C* is the magic number.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.2, stem: 'The soft starch puffs up and turns the kernel inside out.', bron: US, bronStart: 'puffs', camera: { zoom: [1.02, 1.06] }, geluid: [['puffs', 'pop', 0.6], ['inside', 'whoosh', 0.4]],
      teken: h => binnenstebuiten(h) + h.kin('Turned *inside out*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'green', shot: 'dichtbij', duur: 1.6, stem: 'And the pop sound?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And the *sound*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 3.4, stem: 'Scientists think it\'s the steam escaping, not the shell cracking!', in: 'zweep', bron: VP, bronStart: 'steam', camera: { zoom: [1.02, 1.06] }, geluid: [['steam', 'whoosh', 0.5], ['shell', 'klap', 0.4]],
      teken: h => geluid(h) + h.kin('It\'s the *steam*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.5, stem: 'And why does it jump?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Why does it *jump*?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.4, stem: 'A little leg of starch pushes off the pan, like a spring!', in: 'zweep', bron: SA, bronStart: 'leg', camera: { zoom: [1, 1.05] }, geluid: [['leg', 'tik', 0.5], ['pushes', 'boem', 0.4], ['spring', 'pop', 0.6]],
      teken: h => sprong(h) + h.kin('A leg like a *spring*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.6, stem: 'And it all happens in a few hundredths of a second. Pop!', pose: { antwoord: 'verbaasd' }, bron: VP, bronStart: 'hundredths', camera: { zoom: [1.03, 1.0] }, geluid: [['hundredths', 'tik', 0.5], ['Pop', 'boem', 0.6], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('All in a *split second*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
  ],
};
