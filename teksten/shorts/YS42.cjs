// YS42 — Why are tennis balls yellow?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Het Vraagteken stelt de vragen,
// Peertje geeft de antwoorden.
// Bronnen (gelezen zo 15 nov 2026): International Tennis Federation, "History of Tennis Balls" (pdf, bestand van
// 22 nov 2019); The Associated Press, "David Attenborough's colorful impact on Wimbledon and tennis: yellow balls"
// (2 jul 2024, gelezen bij NBC New York).
// Niet gezegd: wie het bedacht (de bronnen noemen één van meerdere mensen), de naam van de kleur ("optic yellow" staat
// niet in deze twee bronnen), en of de bal nu geel of groen is: het Vraagteken vraagt het, Peertje geeft geen antwoord.
const ITF = 'ITF, History of Tennis Balls';
const AP = 'Associated Press (2024)';

const GEEL = '#E3F23C', WIT = '#F7F5EC', ZWART = '#26262C', GRAS = '#5FA85B', GRAS2 = '#57A054', BORD = '#F4F1E6';
// Tennisbal: vulkleur, omlijning en de twee naden
const bal = (h, x, y, r, kleur, { rand = null, naad = null, draai = 0 } = {}) => { const n = naad || (kleur === WIT ? '#B9B6AA' : '#FFFFFF'), w = Math.max(4, r * 0.07);
  return `<g transform="rotate(${draai.toFixed(1)} ${x} ${y})"><circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" stroke="${rand || h.K.inkt}" stroke-width="${w.toFixed(1)}"/>`
    + `<path d="M ${x - r * 0.72} ${y - r * 0.68} Q ${x - r * 0.08} ${y} ${x - r * 0.72} ${y + r * 0.68} M ${x + r * 0.72} ${y - r * 0.68} Q ${x + r * 0.08} ${y} ${x + r * 0.72} ${y + r * 0.68}" fill="none" stroke="${n}" stroke-width="${(w * 0.9).toFixed(1)}" stroke-linecap="round"/></g>`; };
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);

// De gele bal stuitert op het prikbord
const stuiter = (h, { intro = true } = {}) => { const q = intro ? pop(h, 0, 0.35) : 1, s = Math.abs(Math.sin(h.t * 3.4)), y = 892 - 104 * s, plat = 1 - 0.1 * Math.max(0, 1 - s * 6);
  return `<g opacity="${intro ? zicht(h, 0, 0.08) : 1}"><ellipse cx="540" cy="984" rx="${(96 - 30 * s).toFixed(1)}" ry="9" fill="#000" opacity="${(0.24 - 0.12 * s).toFixed(3)}"/>`
    + `<g transform="translate(540 ${y.toFixed(1)}) scale(${(q * (2 - plat)).toFixed(3)} ${(q * plat).toFixed(3)}) translate(-540 ${(-y).toFixed(1)})">${bal(h, 540, y, 84, GEEL, { draai: h.t * 80 })}</g></g>`; };

// Scorebord: een witte en een zwarte bal
const tweeBallen = (h, tWit, tZwart) => { const a = pop(h, tWit), b = pop(h, tZwart);
  return (a > 0 ? `<g opacity="${zicht(h, tWit)}" transform="translate(350 820) scale(${a.toFixed(3)}) translate(-350 -820)">${bal(h, 350, 820, 92, WIT)}</g><text x="350" y="968" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="42" fill="${BORD}" opacity="${zicht(h, tWit + 0.1)}">white</text>` : '')
    + (b > 0 ? `<g opacity="${zicht(h, tZwart)}" transform="translate(730 820) scale(${b.toFixed(3)}) translate(-730 -820)">${bal(h, 730, 820, 92, ZWART, { rand: BORD })}</g><text x="730" y="968" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="42" fill="${BORD}" opacity="${zicht(h, tZwart + 0.1)}">black</text>` : ''); };

// Scorebord: de kleur hing af van de baan: zwart op een lichte baan, wit op een donkere
const tweeBanen = (h, t1, t2) => [[t1, 340, '#E9DDC0', ZWART, null], [t2, 740, '#2B2B33', WIT, null]].map(([t0, x, vlak, kleur], i) => { const q = pop(h, t0);
  return q <= 0 ? '' : `<g opacity="${zicht(h, t0)}" transform="translate(${x} 835) scale(${(0.7 + 0.3 * q).toFixed(3)}) translate(${-x} -835)"><rect x="${x - 170}" y="705" width="340" height="260" rx="16" fill="${vlak}" stroke="${BORD}" stroke-width="7"/>`
    + `<path d="M ${x - 170} 900 L ${x + 170} 900 M ${x} 705 L ${x} 900" stroke="${i ? '#F4F1E6' : '#FFFFFF'}" stroke-width="7" opacity="${i ? 0.55 : 0.9}"/>${bal(h, x + 50, 812 - 16 * Math.abs(Math.sin(h.t * 4 + i)), 50, kleur, { rand: i ? '#16161A' : '#16161A' })}</g>`; }).join('');

// Prikbord: een oude televisie. Op het gras is de witte bal slecht te zien; op tGeel wordt hij geel.
const teevee = (h, tGeel) => { const I = h.K.inkt, g = h.klem((h.t - tGeel) / 0.25), q = pop(h, 0, 0.35), bx = 372 + ((h.t * 150) % 250), by = 838 - 62 * Math.abs(Math.sin(h.t * 4.2));
  let lijnen = ''; for (let y = 716; y < 960; y += 9) lijnen += `<path d="M 322 ${y} L 668 ${y}" stroke="#FFFFFF" stroke-width="2" opacity="0.1"/>`;
  return `<clipPath id="scherm"><rect x="322" y="708" width="346" height="254" rx="26"/></clipPath><g opacity="${zicht(h, 0, 0.08)}" transform="translate(540 835) scale(${(0.72 + 0.28 * q).toFixed(3)}) translate(-540 -835)">`
    + `<rect x="298" y="694" width="500" height="296" rx="22" fill="#000" opacity="0.2"/><rect x="290" y="684" width="500" height="296" rx="22" fill="#8A5A34" stroke="${I}" stroke-width="7"/>`
    + `<g clip-path="url(#scherm)"><rect x="322" y="708" width="346" height="254" fill="${GRAS}"/>` + [0, 2, 4].map(i => `<rect x="${322 + i * 70}" y="708" width="70" height="254" fill="${GRAS2}"/>`).join('')
    + `<path d="M 322 920 L 668 920" stroke="#F4F1E6" stroke-width="7" opacity="0.8"/>`
    + (g < 1 ? `<g opacity="${(1 - g).toFixed(3)}">${bal(h, bx, by, 26, '#CFE2BE', { rand: '#7FAE78', naad: '#B4CDA4' })}</g>` : '')
    + (g > 0 ? `<g opacity="${g.toFixed(3)}" transform="translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${(1 + 0.5 * (1 - h.veer(g))).toFixed(3)}) translate(${(-bx).toFixed(1)} ${(-by).toFixed(1)})">${bal(h, bx, by, 26, GEEL)}</g>` : '')
    + lijnen + `</g><rect x="322" y="708" width="346" height="254" rx="26" fill="none" stroke="${I}" stroke-width="7"/>`
    + `<circle cx="730" cy="760" r="24" fill="#F4EEDF" stroke="${I}" stroke-width="6"/><path d="M 730 760 L 730 742" stroke="${I}" stroke-width="6" stroke-linecap="round"/><circle cx="730" cy="832" r="24" fill="#F4EEDF" stroke="${I}" stroke-width="6"/><path d="M 730 832 L 744 820" stroke="${I}" stroke-width="6" stroke-linecap="round"/>`
    + [896, 914, 932].map(y => `<path d="M 704 ${y} L 756 ${y}" stroke="${I}" stroke-width="5" stroke-linecap="round"/>`).join('') + `</g>`; };

// Scorebord: 1972, geel in de regels
const regels = (h, tJaar, tBal) => { const q = pop(h, tJaar), b = pop(h, tBal);
  return `<g opacity="${zicht(h, tJaar)}"><text x="400" y="775" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="${GEEL}" letter-spacing="5">IN THE RULES</text>`
    + `<text x="400" y="945" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(184 * (0.8 + 0.2 * q)).toFixed(0)}" fill="${BORD}">1972</text></g>`
    + (b > 0 ? `<g opacity="${zicht(h, tBal)}" transform="translate(770 838) scale(${b.toFixed(3)}) translate(-770 -838)">${bal(h, 770, 838, 96, GEEL, { draai: h.t * 40 })}</g>` : ''); };

// Scorebord: Wimbledon hield wit tot 1986; de witte bal krijgt groene vlekken en wordt dan geel
const wimbledon = (h, tJaar, tVlek) => { const q = pop(h, tJaar), v = h.klem((h.t - tVlek) / 0.8);
  const vlek = (dx, dy, r, o2) => `<ellipse cx="${250 + dx}" cy="${838 + dy}" rx="${r}" ry="${r * 0.7}" fill="#5FA85B" opacity="${(o2 * v).toFixed(3)}"/>`;
  return bal(h, 250, 838, 88, WIT) + (v > 0 ? vlek(-30, -24, 30, 0.75) + vlek(28, 26, 34, 0.7) + vlek(34, -38, 20, 0.6) + vlek(-36, 36, 18, 0.6) : '')
    + `<g opacity="${zicht(h, tJaar)}"><path d="M 372 838 L 452 838 M 428 812 L 456 838 L 428 864" fill="none" stroke="${BORD}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<g transform="translate(540 838) scale(${q.toFixed(3)}) translate(-540 -838)">${bal(h, 540, 838, 64, GEEL)}</g>`
    + `<text x="780" y="772" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="42" fill="${GEEL}" letter-spacing="3">WIMBLEDON</text>`
    + `<text x="780" y="925" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(132 * (0.75 + 0.25 * q)).toFixed(0)}" fill="${BORD}">1986</text></g>`; };

module.exports = {
  code: 'YS42',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-17-YS42-tennis-ball',
  nummer: 'No. 42',
  onderwerp: 'THE TENNIS BALL',
  pakket: {
    dag: 'dinsdag 17 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why are tennis balls yellow?',
    intro: 'Tennis balls used to be white, or even black. Yellow only went into the rules in 1972, because of television. And Wimbledon held on to white balls until 1986.',
    feiten: ['"Historically, balls were either black or white in colour, depending on the background colour of the courts." (ITF)',
      '"In 1972 the ITF introduced yellow tennis balls into the rules of tennis, as research had shown these balls to be more visible to television viewers." (ITF)',
      '"Meanwhile Wimbledon continued to use the traditional white ball, but eventually adopted yellow balls in 1986." (ITF)',
      'The Wimbledon Compendium, as quoted by The Associated Press: "Yellow balls were used for the first time, largely as the white balls were getting stained green on the grass, sometimes making them almost impossible to see on TV".'],
    bronnen: [['"History of Tennis Balls", International Tennis Federation (ITF)', 'https://www.itftennis.com/media/2280/balls-history-of-tennis-balls.pdf'],
      ['"David Attenborough\'s colorful impact on Wimbledon and tennis: yellow balls", The Associated Press (July 2, 2024), via NBC New York', 'https://www.nbcnewyork.com/news/sports/tennis/why-tennis-balls-are-yellow/5561395/']],
    hashtags: '#Shorts #history #tennis #everydaythings',
    tags: 'tennis balls, why are tennis balls yellow, yellow tennis ball, white tennis balls, tennis history, Wimbledon 1986, 1972 tennis rules, television, ITF, history of everyday things, why things are the way they are, shorts',
    md: [['International Tennis Federation (ITF), "History of Tennis Balls" (pdf; het bestand is van 22 nov 2019, er staat geen publicatiedatum in; het adres stuurt door naar world.tennis)', 'https://www.itftennis.com/media/2280/balls-history-of-tennis-balls.pdf',
      ['"Historically, balls were either black or white in colour, depending on the background colour of the courts."',
        '"In 1972 the ITF introduced yellow tennis balls into the rules of tennis, as research had shown these balls to be more visible to television viewers."',
        '"Meanwhile Wimbledon continued to use the traditional white ball, but eventually adopted yellow balls in 1986."']],
      ['The Associated Press, "David Attenborough\'s colorful impact on Wimbledon and tennis: yellow balls" (2 jul 2024), gelezen bij NBC New York', 'https://www.nbcnewyork.com/news/sports/tennis/why-tennis-balls-are-yellow/5561395/',
      ['"The International Tennis Federation introduced yellow balls into the rules of the sport in 1972"', '"as research had shown these balls to be more visible to television viewers."',
        '"Yellow balls were used for the first time, largely as the white balls were getting stained green on the grass,"', '"sometimes making them almost impossible to see on TV, where tennis was increasingly popular."',
        '"Wimbledon didn\'t make the switch until 1986."', '"Tennis balls were historically either black or white."']]],
    niet: '- Niet gezegd: wie het bedacht (de krant noemt iemand als "one of the people who inspired the switch", dat is geen uitvinder), de naam van de kleur, en of de bal geel of groen is: het Vraagteken vraagt het aan het eind, Peertje geeft geen antwoord. Ballen, televisie, baan en figuren zijn eigen tekenwerk; er is geen beeld van een wedstrijd of toernooi gebruikt. De naam van het toernooi staat één keer in beeld, als feit met bron.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.4, stem: 'Why are tennis balls yellow? Who decided that?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => stuiter(h) + h.kin('Why are tennis balls *yellow*?', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'baan', duur: 3.4, stem: "Ooh, they weren't always! For a long time, tennis balls were white. Or black!", in: 'zweep', bron: ITF, bronStart: 'white', camera: { zoom: [1, 1.05] }, geluid: [['white', 'pop', 0.6], ['black', 'pop', 0.6]],
      teken: h => tweeBallen(h, h.op('white', 2.2), h.op('black', 3.0)) + h.kin('They used to be *white*. Or *black*!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'baan', shot: 'dichtbij', duur: 1.6, stem: 'Black tennis balls? Why?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('*Black* tennis balls? Why?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'baan', duur: 2.8, stem: 'It depended on the colour of the court behind them.', bron: ITF, bronStart: 'court', camera: { zoom: [1, 1.06] }, geluid: [['colour', 'tik', 0.5], ['court', 'tik', 0.5]],
      teken: h => tweeBanen(h, h.op('depended', 0.3), h.op('court', 1.4)) + h.kin('It depended on the *court colour*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'baan', shot: 'dichtbij', duur: 1.6, stem: 'So who made them yellow?', camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('So who made them *yellow*?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 4.2, stem: 'Television! Research showed that yellow balls were easier to see for people watching at home.', in: 'zweep', bron: ITF, bronStart: 'research', camera: { zoom: [1, 1.06] }, geluid: [[0.1, 'klap', 0.5], ['yellow', 'pop', 0.7]],
      teken: h => teevee(h, h.op('yellow', 1.8)) + h.kin('*Television!* Yellow was easier to see.', { y: 300, g: 98, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'baan', duur: 3.4, stem: 'So in nineteen seventy-two, yellow balls went into the rules of tennis.', in: 'zweep', bron: ITF, bronStart: 'rules', camera: { zoom: [1.02, 1.07] }, geluid: [['nineteen', 'klap', 0.6], ['yellow', 'pop', 0.6]],
      teken: h => regels(h, h.op('nineteen', 0.4), h.op('yellow', 1.6)) + h.kin('*1972*: yellow goes into the rules.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'baan', shot: 'dichtbij', duur: 1.8, stem: 'And everyone switched right away?', camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('And everyone *switched*?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'baan', duur: 5.2, stem: 'Nope! Wimbledon kept its white balls until nineteen eighty-six. They were getting stained green by the grass!', in: 'zweep', bron: AP, bronStart: 'stained', camera: { zoom: [1, 1.06] }, geluid: [['nineteen', 'klap', 0.6], ['stained', 'whoosh', 0.4]],
      teken: h => wimbledon(h, h.op('nineteen', 2.4), h.op('stained', 4.2) - 0.2) + h.kin('Nope! Wimbledon: white until *1986*.', { y: 300, g: 98, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.8, stem: "Hang on. Isn't it actually green?", pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin("Hang on. Isn't it *green*?", { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 2.6, stem: 'Oh no. Not this again! Ask me something else!', in: 'zweep', pose: { antwoord: 'verbaasd' }, camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => stuiter(h, { intro: false }) + h.kin('Oh no. *Not this again!*', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
