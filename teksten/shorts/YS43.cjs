// YS43 — Why is November month 11 if its name means "nine"?
// Reeks A · Signs & Symbols (woorden en namen). VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries
// za 14 nov 2026 ±20:43: "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups.
// Bronnen (gelezen zo 15 nov 2026): Konstantin Bikos en Vigdis Hocken, "The Roman Calendar", timeanddate.com;
// Catherine Boeckmann, "How Did the Months Get Their Names?", The Old Farmer's Almanac (5 aug 2026).
// Niet gezegd: wáár in het jaar januari en februari erbij kwamen (de bronnen verschillen: de ene zet ze vooraan in de
// tabel, de andere zegt "added to the end of the year"), wie het deed (Numa is overlevering) en een jaartal.
// Etymonline en Britannica gaven een 403 en zijn daarom geen bron. De inktvis is een grapje van het Vraagteken bij
// "octo"; de bron zegt alleen dat octo acht betekent.
const TAD = 'timeanddate.com, The Roman Calendar';
const OFA = "The Old Farmer's Almanac (2026)";

const KRIJT = '#F4F1E6', GEEL = '#F2C230', STEEN = '#F7EBC8';
const pop = (h, start, d = 0.3) => h.veer(h.klem((h.t - start) / d));
const zicht = (h, start, d = 0.12) => h.klem((h.t - start) / d).toFixed(3);

// Prikbord: een kalenderblad van november (11) en rechts "novem = 9"
const kalender = (h, tNegen, { intro = true } = {}) => { const I = h.K.inkt, q = intro ? pop(h, 0, 0.35) : 1, n = pop(h, tNegen);
  return `<g opacity="${intro ? zicht(h, 0, 0.08) : 1}" transform="translate(330 838) scale(${(0.72 + 0.28 * q).toFixed(3)}) translate(-330 -838)">`
    + `<rect x="208" y="700" width="260" height="290" rx="12" fill="#000" opacity="0.18"/><rect x="200" y="690" width="260" height="290" rx="12" fill="#FFFFFF" stroke="${I}" stroke-width="6"/>`
    + `<path d="M 200 756 L 200 702 Q 200 690 212 690 L 448 690 Q 460 690 460 702 L 460 756 Z" fill="${h.K.signaal}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>`
    + `<text x="330" y="738" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="#FFFFFF" letter-spacing="2">NOVEMBER</text>`
    + `<text x="330" y="936" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="176" fill="${I}">11</text>`
    + [262, 398].map(x => `<rect x="${x - 9}" y="672" width="18" height="40" rx="8" fill="#B9B6AA" stroke="${I}" stroke-width="5"/>`).join('') + `</g>`
    + (n > 0 ? `<g opacity="${zicht(h, tNegen)}" transform="translate(700 850) scale(${(0.7 + 0.3 * n).toFixed(3)}) translate(-700 -850)"><text x="700" y="790" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="62" fill="${I}">novem</text>`
      + `<text x="700" y="940" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="138" fill="${h.K.signaal}">= 9</text></g>` : ''); };

// Perkament: NOVEMber was maand negen
const maandNegen = (h, tNegen) => { const I = h.K.inkt, q = pop(h, 0.1, 0.35), n = pop(h, tNegen);
  return `<g opacity="${zicht(h, 0.1)}" transform="translate(540 790) scale(${(0.8 + 0.2 * q).toFixed(3)}) translate(-540 -790)"><text x="540" y="812" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="112" fill="${I}"><tspan fill="${h.K.signaal}">NOVEM</tspan>BER</text></g>`
    + (n > 0 ? `<g opacity="${zicht(h, tNegen)}"><text x="470" y="950" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.grijs}">month</text>`
      + `<text x="560" y="968" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(150 * (0.7 + 0.3 * n)).toFixed(0)}" fill="${h.K.signaal}">9</text></g>` : ''); };

// Perkament: een jaar van tien maanden, de eerste is maart
const tien = (h, t0, tTien) => { const I = h.K.inkt; let s = '';
  for (let i = 0; i < 10; i++) { const q = pop(h, t0 + i * 0.07, 0.25); if (q <= 0) continue; const x = 178 + i * 73, een = i === 0;
    s += `<g opacity="${zicht(h, t0 + i * 0.07, 0.08)}" transform="translate(${x + 31} ${845 + (1 - q) * 30}) scale(${(0.6 + 0.4 * q).toFixed(3)})"><rect x="-31" y="-45" width="62" height="90" rx="9" fill="${een ? h.K.signaal : '#E2CD98'}" stroke="${I}" stroke-width="5"/>`
      + `<text x="0" y="14" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="36" fill="${een ? '#FFFFFF' : I}">${i + 1}</text></g>`; }
  return s + `<text x="178" y="776" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${h.K.signaal}" opacity="${zicht(h, t0)}">MARCH</text><path d="M 209 784 L 209 796" stroke="${h.K.signaal}" stroke-width="6" stroke-linecap="round" opacity="${zicht(h, t0)}"/>`
    + `<text x="540" y="962" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="${I}" opacity="${zicht(h, tTien)}">a year of 10 months</text>`; };

// Perkament: vier stenen tegels met de naam en het getal dat erin zit
const vier = (h, tijden) => [['SEP', 7], ['OCT', 8], ['NOV', 9], ['DEC', 10]].map(([naam, getal], i) => { const [tn, tg] = tijden[i], q = pop(h, tn), g = pop(h, tg), x = 240 + i * 200;
  return q <= 0 ? '' : `<g opacity="${zicht(h, tn)}" transform="translate(${x} ${835 + (1 - q) * 40}) scale(${(0.6 + 0.4 * q).toFixed(3)})"><rect x="-79" y="-123" width="170" height="258" rx="14" fill="#000" opacity="0.18"/>`
    + `<rect x="-85" y="-130" width="170" height="258" rx="14" fill="${STEEN}" stroke="${h.K.inkt}" stroke-width="6"/><text x="0" y="-62" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="48" fill="${h.K.inkt}">${naam}</text>`
    + `<path d="M -56 -38 L 56 -38" stroke="#D9C692" stroke-width="6" stroke-linecap="round"/>`
    + (g > 0 ? `<text x="0" y="86" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${((getal === 10 ? 104 : 124) * (0.6 + 0.4 * g)).toFixed(0)}" fill="${h.K.signaal}" opacity="${zicht(h, tg)}">${getal}</text>` : '') + `</g>`; }).join('');

// Schoolbord: januari en februari komen erbij; de oude getallen kloppen niet meer
const erbij = (h, tNieuw, tNum) => { const kaart = (x, tekst, nieuw, dx = 0) => `<g transform="translate(${dx.toFixed(1)} 0)"><rect x="${x - 56}" y="772" width="112" height="112" rx="12" fill="${nieuw ? GEEL : 'none'}" stroke="${nieuw ? h.K.inkt : KRIJT}" stroke-width="7"/>`
    + `<text x="${x}" y="842" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${nieuw ? h.K.inkt : KRIJT}">${tekst}</text></g>`;
  const n = pop(h, tNieuw, 0.4), m = h.klem((h.t - tNum) / 0.3), xs = [505, 625, 745, 865];
  let s = ['SEP', 'OCT', 'NOV', 'DEC'].map((t, i) => kaart(xs[i], t, false)).join('');
  s += xs.map((x, i) => `<text x="${x}" y="752" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${KRIJT}" opacity="${(1 - 0.45 * m).toFixed(3)}">${7 + i}</text>`
    + (m > 0 ? `<path d="M ${x - 30} 748 L ${x - 30 + 60 * m} ${738 - 8 * m}" stroke="${h.K.signaal}" stroke-width="7" stroke-linecap="round"/><text x="${x}" y="956" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(64 * (0.6 + 0.4 * pop(h, tNum + i * 0.08))).toFixed(0)}" fill="${GEEL}" opacity="${zicht(h, tNum + i * 0.08)}">${9 + i}</text>` : '')).join('');
  s += `<text x="425" y="842" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${KRIJT}" opacity="0.7">…</text>`;
  if (n > 0) s += `<g opacity="${zicht(h, tNieuw)}">${kaart(215, 'JAN', true, -220 * (1 - n))}${kaart(345, 'FEB', true, -220 * (1 - pop(h, tNieuw + 0.12, 0.4)))}</g>`;
  return s; };

module.exports = {
  code: 'YS43',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-18-YS43-november',
  nummer: 'No. 43',
  onderwerp: 'THE MONTH NAMES',
  pakket: {
    dag: 'woensdag 18 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why is November month 11 if its name means "nine"?',
    intro: 'November comes from "novem", the Latin word for nine. In the early Roman calendar it really was the ninth month. Then two months were added, and the names never changed.',
    feiten: ['"From the Latin word novem, \'nine,\' this had been the ninth month of the early Roman calendar." (The Old Farmer\'s Almanac)',
      'According to tradition, the early Roman calendar "had only 10 months, with March (Martius) being the first month of the year." (timeanddate.com)',
      'September comes from septem, "seven"; October from octo, "eight"; December from decem, "ten". (The Old Farmer\'s Almanac)',
      '"two additional months were introduced: Ianuarius and Februarius." "This meant that some of the month names no longer agreed with their position in the calendar." (timeanddate.com)'],
    bronnen: [['Konstantin Bikos and Vigdis Hocken, "The Roman Calendar", timeanddate.com', 'https://www.timeanddate.com/calendar/roman-calendar.html'],
      ['Catherine Boeckmann, "How Did the Months Get Their Names?", The Old Farmer\'s Almanac (August 5, 2026)', 'https://www.almanac.com/how-did-months-get-their-names']],
    hashtags: '#Shorts #history #words #calendar',
    tags: 'november, why is november the 11th month, novem nine, month names, roman calendar, september october november december, january february, etymology, word origins, calendar history, history of everyday things, why things are the way they are, shorts',
    md: [['Konstantin Bikos en Vigdis Hocken, "The Roman Calendar", timeanddate.com (geen publicatiedatum op de pagina)', 'https://www.timeanddate.com/calendar/roman-calendar.html',
      ['"According to tradition, Romulus, the legendary first king of Rome," "oversaw an overhaul of the Roman calendar system around 738 BCE."',
        '"The resulting calendar, whose structure borrowed heavily from the ancient Greek calendar system, had only 10 months," "with March (Martius) being the first month of the year."',
        '"To account for the days of winter between the years, two additional months were introduced:" "Ianuarius and Februarius."',
        '"This meant that some of the month names no longer agreed with their position in the calendar."',
        '"For example, September means \\"the 7th month,\\" but it was now the 9th month of the year—an inconsistency" "that was preserved and is still part of the Gregorian calendar we use today."']],
      ['Catherine Boeckmann, "How Did the Months Get Their Names?", The Old Farmer\'s Almanac (5 aug 2026)', 'https://www.almanac.com/how-did-months-get-their-names',
      ['"September comes from the Latin word septem, meaning \\"seven,\\"" "because it was the seventh month of the early Roman calendar."',
        '"Its name comes from octo, the Latin word for \\"eight.\\""',
        '"From the Latin word novem, \\"nine,\\" this had been the ninth month of the early Roman calendar."',
        '"From the Latin word decem, \\"ten,\\" this had been the tenth month of the early Roman calendar."']]],
    niet: '- Niet gezegd: waar in het jaar januari en februari erbij kwamen (de bronnen verschillen), wie het deed (Numa Pompilius is overlevering) en een jaartal. "According to tradition" staat in het gesprek, omdat de bron het zo zegt. De inktvis is een grapje van het Vraagteken bij "octo"; dat een inktvis acht armen heeft staat niet in de bronnen en wordt ook niet beweerd. Kalender, tegels, decors en figuren zijn eigen tekenwerk.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.6, stem: 'November means nine. So why is it month eleven?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => kalender(h, h.op('nine', 0.9)) + h.kin('*Novem* = nine. So why month *11*?', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 3.2, stem: 'Ooh, good catch! In the early Roman calendar, it really was month nine!', in: 'zweep', bron: OFA, bronStart: 'really', camera: { zoom: [1, 1.05] }, geluid: [['nine', 'klap', 0.5]],
      teken: h => maandNegen(h, h.op('nine', 2.6)) + h.kin('It really *was* month nine!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 1.8, stem: 'Wait. Then where did the year start?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('So where did the year *start*?', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 3.4, stem: 'In March! According to tradition, that calendar had only ten months.', bron: TAD, bronStart: 'tradition', camera: { zoom: [1, 1.06] }, geluid: [['march', 'pop', 0.6], ['ten', 'klap', 0.5]],
      teken: h => tien(h, h.op('march', 0.3), h.op('ten', 2.6)) + h.kin('In *March*! With only *ten* months.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'rome', duur: 5.0, stem: 'Count along: September, seven. October, eight. November, nine. December, ten!', in: 'zweep', bron: OFA, bronStart: 'seven', camera: { zoom: [1.02, 1.07] }, geluid: [['seven', 'tik', 0.5], ['eight', 'tik', 0.5], ['nine', 'tik', 0.5], ['ten', 'klap', 0.6]],
      teken: h => vier(h, [[h.op('september', 0.9), h.op('seven', 1.5)], [h.op('october', 2.0), h.op('eight', 2.6)], [h.op('november', 3.1), h.op('nine', 3.7)], [h.op('december', 4.2), h.op('ten', 4.7)]]) + h.kin('Count along: *7, 8, 9, 10*.', { y: 300, g: 104, t: h.t, start: 0.05, sync: false }).svg },
    { wie: 'vraag', decor: 'rome', shot: 'dichtbij', duur: 2.6, stem: 'Octo, eight. Like an octopus! So who broke it?', camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('*Octo*, like an octopus!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 5.6, stem: 'Later, two months were added: January and February. The old names stayed, but the numbers no longer fit!', in: 'zweep', bron: TAD, bronStart: 'january', camera: { zoom: [1, 1.06] }, geluid: [['january', 'whoosh', 0.5], ['numbers', 'klap', 0.5]],
      teken: h => erbij(h, h.op('january', 2.0), h.op('numbers', 4.6)) + h.kin('Then *two months* were added.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 2.0, stem: 'So December should really be month ten?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('December should be *month ten*?', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 2.6, stem: 'By its name, yes! Go on, count them again!', in: 'zweep', pose: { antwoord: 'verbaasd' }, camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => kalender(h, 0, { intro: false }) + h.kin('By its name, *yes!* Count again.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
