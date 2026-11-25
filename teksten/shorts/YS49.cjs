// YS49 — Why do onions make you cry?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors. Met watermerk (Andries zo 15 nov 2026 ±12:50 en ±13:26).
// Gemaakt na "Ja, nu al" (Andries wo 25 nov 2026 ±19:53, op "Nieuwe duo-filmpjes nu al maken voor de lege plekken?").
// Bronnen (uitgezocht wo 18 nov 2026, docs/bronnen-voorraad.md): Jason Daley, "This Enzyme Is Why Onions Make You Cry",
// Smithsonian Magazine (23 aug 2017); National Capital Poison Center (Poison Control), "Why do onions make you cry?".
// Niet gezegd: "syn-propanethial-S-oxide", "traanklieren spoelen", een scherp mes of stromend water.
const SM = 'Smithsonian Magazine';
const PC = 'Poison Control';

const I = '#16161A', KRIJT = '#F4F1E6', GEEL = '#F2C230', ROOD = '#D9432B', GROEN = '#5FA35A', BLAUW = '#4E8FB8', UI = '#C98A4B', UIL = '#E8C89A';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);
const sch = (x, y, q, inhoud) => `<g transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-x} ${-y})" opacity="${Math.min(1, q * 3).toFixed(3)}">${inhoud}</g>`;
const label = (x, y, tekst, kleur, op = 1, grootte = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${grootte}" fill="${kleur}" letter-spacing="2" opacity="${op}">${tekst}</text>`;
const pijl = (x1, y, x2, kleur = I, op = 1) => `<g opacity="${op}"><path d="M ${x1} ${y} L ${x2 - 18} ${y}" stroke="${kleur}" stroke-width="8" stroke-linecap="round"/><path d="M ${x2} ${y} l -26 -16 l 0 32 Z" fill="${kleur}"/></g>`;

// Ui, onderkant op (x, y), schaal s. half: doorgesneden (ringen zichtbaar)
const ui = (x, y, s, { half = false } = {}) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<ellipse cx="0" cy="4" rx="70" ry="9" fill="#000" opacity="0.12"/>`
  + `<path d="M -18 0 q -6 10 -14 14 M 0 2 q 0 12 -2 18 M 18 0 q 6 10 14 14" fill="none" stroke="#8A6A45" stroke-width="4" stroke-linecap="round"/>`
  + (half
    ? `<path d="M -90 -90 Q -90 0 0 0 Q 90 0 90 -90 Z" fill="${UIL}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
      + [70, 50, 30].map(r => `<path d="M ${-r} -90 Q ${-r} ${-90 + r * 0.95} 0 ${-90 + r * 0.95} Q ${r} ${-90 + r * 0.95} ${r} -90" fill="none" stroke="#C9A36E" stroke-width="4"/>`).join('')
      + `<path d="M -92 -90 L 92 -90" stroke="${I}" stroke-width="6" stroke-linecap="round"/>`
    : `<path d="M 0 -200 Q 10 -170 40 -150 Q 100 -110 90 -55 Q 80 0 0 0 Q -80 0 -90 -55 Q -100 -110 -40 -150 Q -10 -170 0 -200 Z" fill="${UI}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
      + `<path d="M -40 -140 Q -70 -70 -30 -10 M 0 -175 Q -10 -90 0 -5 M 40 -140 Q 70 -70 30 -10" fill="none" stroke="#8E5A2C" stroke-width="4" stroke-linecap="round"/>`
      + `<path d="M 0 -200 q -8 -30 6 -46" fill="none" stroke="#8A6A45" stroke-width="6" stroke-linecap="round"/>`)
  + `</g>`;
// Mes, punt naar links
const mes = (x, y, s = 1, hoek = 0) => `<g transform="translate(${x} ${y}) rotate(${hoek}) scale(${s})">`
  + `<path d="M -150 0 L 30 -22 L 30 18 Q -60 22 -150 0 Z" fill="#D7DCE1" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>`
  + `<rect x="30" y="-20" width="110" height="38" rx="12" fill="#6B4A2E" stroke="${I}" stroke-width="5"/>`
  + `<circle cx="70" cy="-1" r="5" fill="${KRIJT}"/><circle cx="105" cy="-1" r="5" fill="${KRIJT}"/></g>`;
// Cellen die openknappen
const cellen = (x, y, q) => [[-60, -10], [-20, -40], [25, -15], [60, -45], [-40, 30], [10, 25], [55, 20]].map(([a, b], i) => {
  const k = Math.max(0, Math.min(1, q * 1.6 - i * 0.12));
  return `<g opacity="${(1 - k * 0.6).toFixed(3)}"><circle cx="${x + a}" cy="${y + b}" r="${18 + k * 10}" fill="${UIL}" stroke="${I}" stroke-width="4" stroke-dasharray="${k > 0.4 ? '8 7' : 'none'}"/></g>`;
}).join('');
// Gaspluimen omhoog
const gas = (x, y, q, kleur = '#B9D48A') => [0, 1, 2].map(i => {
  const dy = -q * (120 + i * 30), dx = (i - 1) * 40;
  return `<path d="M ${x + dx} ${y + dy} q -18 -30 0 -60 q 18 -30 0 -60" fill="none" stroke="${kleur}" stroke-width="10" stroke-linecap="round" opacity="${Math.min(1, q * 2).toFixed(3)}"/>`;
}).join('');
// Oog met tranen
const oog = (x, y, s, tranen = 0) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M -110 0 Q 0 -80 110 0 Q 0 80 -110 0 Z" fill="${KRIJT}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
  + `<circle cx="0" cy="0" r="38" fill="#6A8F5A" stroke="${I}" stroke-width="5"/><circle cx="0" cy="0" r="16" fill="${I}"/><circle cx="10" cy="-10" r="6" fill="${KRIJT}"/>`
  + (tranen > 0 ? [[-70, 30], [80, 34]].map(([a, b], i) => { const d = Math.max(0, tranen - i * 0.2) * 120;
      return `<path d="M ${a} ${b + d} q -14 22 0 32 q 14 -10 0 -32 Z" fill="${BLAUW}" stroke="${I}" stroke-width="3" opacity="${Math.min(1, tranen * 2).toFixed(3)}"/>`; }).join('') : '')
  + `</g>`;
// Konijn dat aan een ui snuffelt
const konijn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="70" ry="8" fill="#000" opacity="0.12"/>`
  + `<ellipse cx="0" cy="-55" rx="70" ry="55" fill="#D8D2C6" stroke="${I}" stroke-width="5"/>`
  + `<circle cx="-60" cy="-110" r="38" fill="#D8D2C6" stroke="${I}" stroke-width="5"/>`
  + `<path d="M -70 -140 q -18 -80 4 -96 q 14 30 10 92 M -46 -144 q 6 -82 30 -88 q 6 34 -14 90" fill="#D8D2C6" stroke="${I}" stroke-width="5"/>`
  + `<circle cx="-78" cy="-116" r="5" fill="${I}"/><circle cx="-96" cy="-100" r="6" fill="#E59AA8"/><circle cx="66" cy="-60" r="14" fill="${KRIJT}" stroke="${I}" stroke-width="4"/></g>`;
// Koelkast met sneeuwvlok
const koelkast = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<rect x="-90" y="-300" width="180" height="300" rx="16" fill="#E9EEF2" stroke="${I}" stroke-width="6"/>`
  + `<path d="M -90 -190 L 90 -190" stroke="${I}" stroke-width="5"/><rect x="60" y="-275" width="12" height="60" rx="6" fill="${I}"/><rect x="60" y="-170" width="12" height="80" rx="6" fill="${I}"/>`
  + `<g transform="translate(-10 -245)" stroke="${BLAUW}" stroke-width="6" stroke-linecap="round"><path d="M -30 0 L 30 0 M -15 -26 L 15 26 M -15 26 L 15 -26"/></g></g>`;

// Scène 1 (kamer): ui en mes, traan op "cry"
const vraag1 = h => { const q = pop(h, 0, 0.35), t = pop(h, h.op('cry', 1.2));
  return sch(420, 990, q, ui(420, 990, 1.25)) + sch(760, 900, q, mes(760, 900, 1.0, -20))
    + (t > 0 ? `<path d="M 600 720 q -18 30 0 44 q 18 -14 0 -44 Z" fill="${BLAUW}" stroke="${I}" stroke-width="4" opacity="${Math.min(1, t).toFixed(3)}"/>` : ''); };
// Scène 2 (atelier): mes snijdt, cellen knappen
const snijden = h => { const q = pop(h, 0, 0.35), c = h.klem((h.t - h.op('cells', 1.4)) / 1.0), m = h.zacht(h.klem(h.t / 1.2));
  return sch(420, 990, q, ui(420, 990, 1.2, { half: m > 0.5 })) + mes(560 + 60 * (1 - m), 820 + 60 * m, 1.0, -10)
    + (c > 0 ? sch(780, 860, Math.min(1, c * 2), cellen(780, 860, c)) + label(780, 770, 'CELLS', I, Math.min(1, c * 2).toFixed(3), 32) : ''); };
// Scène 3 (atelier): enzym komt vrij
const enzym = h => { const q = pop(h, 0, 0.35), e = pop(h, h.op('alliinase', 1.4)), k = pop(h, h.op('chain', 2.6));
  return sch(330, 990, q, ui(330, 990, 1.15, { half: true })) + (e > 0 ? label(700, 780, 'ALLIINASE', ROOD, Math.min(1, e).toFixed(3), 40) + sch(700, 860, e, cellen(700, 860, 1)) : '')
    + (k > 0 ? `<g opacity="${Math.min(1, k).toFixed(3)}">${pijl(560, 940, 700, I)}${pijl(720, 940, 860, I)}</g>` : ''); };
// Scène 5 (klas): gas stijgt op naar een oog
const opstijgen = h => { const q = pop(h, 0, 0.35), g = h.zacht(h.klem((h.t - h.op('gas', 1.0)) / 1.8));
  return sch(300, 1000, q, ui(300, 1000, 1.1, { half: true })) + gas(300, 900, g) + sch(760, 720, pop(h, h.op('eyes', 2.4)), oog(760, 720, 1.0)); };
// Scène 6 (klas): oog, zenuwen, tranen
const tranen = h => { const q = pop(h, 0, 0.35), t = h.klem((h.t - h.op('tears', 2.0)) / 1.2);
  return sch(540, 760, q, oog(540, 760, 1.4, t)) + gas(250, 980, 0.7)
    + label(540, 990, t > 0.2 ? 'TEARS!' : 'NERVES', t > 0.2 ? '#8CC4E8' : KRIJT, zicht(h, 0.4), 44); };
// Scène 8 (green): konijn snuffelt, ui verdedigt zich
const oorlog = h => { const q = pop(h, 0, 0.35), d = h.zacht(h.klem((h.t - h.op('warfare', 1.6)) / 1.2));
  return sch(330, 990, q, ui(330, 990, 1.05)) + gas(330, 800, d, '#B9D48A') + sch(760, 990, q, konijn(760, 990, 1.0))
    + label(540, 770, 'CHEMICAL', ROOD, d > 0.1 ? '1' : '0', 38) + label(540, 815, 'WARFARE', ROOD, d > 0.1 ? '1' : '0', 38); };
// Scène 10 (kamer): koelkast 30 min, wortel laten zitten
const tip = h => { const a = pop(h, h.op('Chill', 0.2)), b = pop(h, h.op('root', 2.0));
  return sch(290, 995, a, koelkast(290, 995, 0.68)) + label(540, 860, '30 MIN', BLAUW, Math.min(1, a).toFixed(3), 40)
    + sch(770, 960, b, ui(770, 960, 0.8)) + (b > 0 ? `<circle cx="770" cy="968" r="40" fill="none" stroke="${GROEN}" stroke-width="8" opacity="${Math.min(1, b).toFixed(3)}"/>` + label(540, 945, 'KEEP THE ROOT', GROEN, Math.min(1, b).toFixed(3), 30) : ''); };
// Scène 11 (kamer): slot
const slot = h => sch(470, 995, pop(h, 0, 0.35), ui(470, 995, 0.95)) + label(470, 775, 'SELF-DEFENSE', ROOD, zicht(h, h.op('self', 1.2)), 44);

module.exports = {
  code: 'YS49',
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
  map: '2026-11-27-YS49-uien',
  nummer: 'No. 49',
  onderwerp: 'ONIONS',
  pakket: {
    dag: 'vrijdag 27 november 2026', tijd: '20:00',
    gelezen: 'wo 18 nov 2026',
    titel: 'Why do onions make you cry?',
    intro: 'Cutting an onion breaks its cells and starts a chain reaction. Two enzymes turn its sulfur compounds into a gas that drifts up and irritates the nerves in your eyes.',
    feiten: ['Cutting an onion breaks its cells and releases an enzyme called alliinase. (Smithsonian Magazine; Poison Control)',
      'A second enzyme, lachrymatory factor synthase, produces a volatile compound that "wafts into the air and reacts with the nerves of your cornea, causing uncontrollable tears." (Smithsonian Magazine)',
      'It is "chemical warfare used by the plants to ward off would-be predators." (Smithsonian Magazine)',
      'Tips: chill the onion for about 30 minutes before cutting, and leave the root end on. (Poison Control)'],
    bronnen: [['Jason Daley, "This Enzyme Is Why Onions Make You Cry", Smithsonian Magazine (August 23, 2017)', 'https://www.smithsonianmag.com/smart-news/researchers-finally-figure-out-onion-enzyme-makes-you-cry-180964325/'],
      ['National Capital Poison Center, "Why do onions make you cry?", Poison Control', 'https://www.poison.org/articles/why-do-onions-make-you-cry']],
    hashtags: '#Shorts #onions #science #everydaythings',
    tags: 'onions, why do onions make you cry, cutting onions, tears, enzyme, alliinase, kitchen science, food science, chemistry, everyday science, why things are the way they are, shorts',
    md: [['Jason Daley, "This Enzyme Is Why Onions Make You Cry", Smithsonian Magazine (23 aug 2017)', 'https://www.smithsonianmag.com/smart-news/researchers-finally-figure-out-onion-enzyme-makes-you-cry-180964325/',
      ['Snijden laat cellen knappen en alliinase vrijkomen.',
        'Een tweede enzym, "lachrymatory factor synthase", maakt een vluchtige stof.',
        'Die "wafts into the air and reacts with the nerves of your cornea, causing uncontrollable tears".',
        '"chemical warfare used by the plants to ward off would-be predators".']],
      ['National Capital Poison Center, "Why do onions make you cry?" (Poison Control)', 'https://www.poison.org/articles/why-do-onions-make-you-cry',
      ['Snijden breekt de cellen; alliinase komt vrij.',
        'Tip: de ui ongeveer 30 minuten koelen (met de National Onion Association).',
        'Tip: het worteleinde laten zitten.']]],
    niet: '- Niet gezegd: de scheikundige naam van de stof ("syn-propanethial-S-oxide"), traanklieren spoelen, een scherp mes of stromend water. "Floats up into your eyes" volgt "wafts into the air" en "the nerves of your cornea" (Smithsonian). "Self-defense" in de slotzin volgt "chemical warfare … to ward off would-be predators" (Smithsonian). Ui, mes, cellen, oog, konijn, koelkast, decors en figuren zijn eigen tekenwerk.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.8, stem: 'Why do onions make me cry? I\'m not even sad!', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7], ['cry', 'pop', 0.5]],
      teken: h => vraag1(h) + h.kin('Why do onions make you *cry*?', { y: 300, g: 96, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 3.4, stem: 'Because the onion is fighting back! Cutting it breaks open tiny cells.', in: 'zweep', bron: SM, bronStart: 'Cutting', camera: { zoom: [1, 1.05] }, geluid: [['fighting', 'klap', 0.5], ['Cutting', 'whoosh', 0.4], ['cells', 'pop', 0.5]],
      teken: h => snijden(h) + h.kin('It\'s *fighting back*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 3.6, stem: 'That lets out an enzyme called alliinase, and it starts a chain reaction.', bron: PC, bronStart: 'enzyme', camera: { zoom: [1.02, 1.06] }, geluid: [['alliinase', 'tik', 0.5], ['chain', 'whoosh', 0.4]],
      teken: h => enzym(h) + h.kin('A *chain reaction*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'atelier', shot: 'dichtbij', duur: 1.8, stem: 'A chain reaction? In my kitchen?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('In my *kitchen*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.8, stem: 'Yep! A second enzyme makes a gas that floats up into your eyes.', bron: SM, bronStart: 'second', camera: { zoom: [1, 1.05] }, geluid: [['gas', 'whoosh', 0.5], ['eyes', 'pop', 0.5]],
      teken: h => opstijgen(h) + h.kin('A *gas* floats up.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.2, stem: 'It hits the nerves in your eyes, and your eyes make tears!', bron: SM, bronStart: 'nerves', camera: { zoom: [1.02, 1.06] }, geluid: [['nerves', 'tik', 0.5], ['tears', 'pop', 0.5]],
      teken: h => tranen(h) + h.kin('Hello, *tears*!', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'green', shot: 'dichtbij', duur: 1.8, stem: 'But why would an onion do that?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('But *why*?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'green', duur: 3.8, stem: 'To protect itself! It\'s chemical warfare against animals that want to eat it.', in: 'zweep', bron: SM, bronStart: 'protect', camera: { zoom: [1.02, 1.06] }, geluid: [['protect', 'klap', 0.4], ['warfare', 'boem', 0.5]],
      teken: h => oorlog(h) + h.kin('Onion *defense*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.6, stem: 'Can I stop it?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Can I *stop* it?', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.8, stem: 'Chill the onion for thirty minutes first, and leave the root end on.', in: 'zweep', bron: PC, bronStart: 'Chill', camera: { zoom: [1, 1.05] }, geluid: [['Chill', 'tik', 0.5], ['root', 'pop', 0.5]],
      teken: h => tip(h) + h.kin('*Chill* it first.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.0, stem: 'So next time an onion makes you cry, it\'s just self-defense!', pose: { antwoord: 'verbaasd' }, bron: SM, bronStart: 'onion', camera: { zoom: [1.03, 1.0] }, geluid: [['self', 'stijg', 0.4], [-0.6, 'stijg', 0.5]],
      teken: h => slot(h) + h.kin('It\'s *self-defense*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
