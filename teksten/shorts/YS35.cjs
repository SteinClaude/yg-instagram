// YS35 — Why is Bluetooth named after a Viking king?
// Reeks A · Signs & Symbols. VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de eerste seconde, 25–40 s, einde dat
// terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1 (do 19 nov 2026), daarna YouTube (vr 11 dec).
// Bronnen (gelezen ma 9 nov 2026): Bluetooth SIG, "Origin of the name"; Nationalmuseet (National Museum of Denmark),
// "The Jelling Stone"; Jim Kardach, kardach.com/bluetooth.
// Niet gezegd: het jaar (1996 of 1997: de video zegt "late 1990s"), het jaar 958 (alleen de SIG), het boek dat Kardach las
// (alleen Wikipedia), Ericsson en de kroeg (alleen zoekresultaten). De bijnaam: "is said to" (SIG). Het logo zelf (merk)
// zelf staat niet in beeld: alleen de twee runen als eigen lijnen die over elkaar schuiven, zonder blauw ovaal.
const SIG = 'Bluetooth SIG, "Origin of the name"';
const NAT = 'National Museum of Denmark';
const KAR = 'J. Kardach, kardach.com';

const koptelefoon = (h, y = 1020, intro = true) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  return `<g filter="url(#sch)" opacity="${intro ? h.klem(h.t / 0.08).toFixed(3) : 1}" transform="translate(540 ${y}) scale(${(0.7 + 0.3 * q).toFixed(3)})">`
    + `<path d="M -230 40 A 230 230 0 0 1 230 40" fill="none" stroke="${h.K.inkt}" stroke-width="44" stroke-linecap="round"/>`
    + `<rect x="-290" y="0" width="120" height="200" rx="50" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="8"/><rect x="170" y="0" width="120" height="200" rx="50" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="8"/></g>`; };
const kroon = (h, p = 1) => `<g filter="url(#sch)" transform="translate(540 1000) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})" opacity="${h.klem(p * 3).toFixed(3)}"><path d="M -220 120 L -220 -80 L -110 20 L 0 -140 L 110 20 L 220 -80 L 220 120 Z" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="10" stroke-linejoin="round"/><circle cx="0" cy="40" r="34" fill="#3D6FB4" stroke="${h.K.inkt}" stroke-width="6"/></g>`;
const tand = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(540 1000)"><path d="M -150 -170 C -230 -170 -230 -40 -190 40 C -160 110 -150 200 -110 200 C -60 200 -50 60 0 60 C 50 60 60 200 110 200 C 150 200 160 110 190 40 C 230 -40 230 -170 150 -170 C 90 -170 60 -140 0 -140 C -60 -140 -90 -170 -150 -170 Z" fill="${h.K.papier}" stroke="${h.K.inkt}" stroke-width="10"/>`
  + `<path d="M -150 -170 C -230 -170 -230 -40 -190 40 C -160 110 -150 200 -110 200 C -60 200 -50 60 0 60 C 50 60 60 200 110 200 C 150 200 160 110 190 40 C 230 -40 230 -170 150 -170 C 90 -170 60 -140 0 -140 C -60 -140 -90 -170 -150 -170 Z" fill="#5E6C86" opacity="${h.klem((h.t - 1.0) / 0.8).toFixed(3)}"/></g>`;
const steen = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}"><path d="M 300 1320 L 330 820 Q 360 700 540 690 Q 720 700 750 820 L 780 1320 Z" fill="#A39C8E" stroke="${h.K.inkt}" stroke-width="8"/>`
  + Array.from({ length: 6 }, (_, i) => `<path d="M ${370 + (i % 2) * 20} ${860 + i * 70} q 170 -20 340 0" fill="none" stroke="#6B645A" stroke-width="10" stroke-linecap="round"/>`).join('') + '</g>';
const label = (h, tekst, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(540 1000) rotate(-6) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})"><rect x="-300" y="-110" width="600" height="220" rx="16" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="8"/><text x="0" y="28" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="76" fill="${h.K.signaal}">${tekst}</text></g>`;
const apparaten = (h, p = 1) => `<g filter="url(#sch)"><rect x="160" y="880" width="320" height="220" rx="14" fill="#2F4A6B" stroke="${h.K.inkt}" stroke-width="6"/><rect x="130" y="1100" width="380" height="30" rx="8" fill="#2F4A6B" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<rect x="700" y="840" width="170" height="300" rx="26" fill="#2A2A30" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 3 }, (_, i) => `<path d="M ${525 + i * 40} ${990 - 40 - i * 20} q ${30 + i * 10} ${40 + i * 20} 0 ${80 + i * 40}" fill="none" stroke="${h.K.signaal}" stroke-width="10" stroke-linecap="round" opacity="${h.klem(p * 3 - i).toFixed(3)}"/>`).join('') + '</g>';
// runen ᚼ (Hagall) en ᛒ (Bjarkan), eigen lijnen; m = 0..1 hoe ver ze over elkaar schuiven
const runen = (h, m = 0) => { const d = 170 * (1 - m), sw = 34, c = h.K.inkt;
  const hagall = x => `<g transform="translate(${x.toFixed(1)} 1000)"><line x1="0" y1="-220" x2="0" y2="220" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><line x1="-120" y1="-110" x2="120" y2="110" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><line x1="120" y1="-110" x2="-120" y2="110" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/></g>`;
  const bjarkan = x => `<g transform="translate(${x.toFixed(1)} 1000)"><line x1="0" y1="-220" x2="0" y2="220" stroke="${h.K.signaal}" stroke-width="${sw}" stroke-linecap="round"/><path d="M 0 -220 L 120 -110 L 0 0 L 120 110 L 0 220" fill="none" stroke="${h.K.signaal}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  return `<g filter="url(#sch)">${hagall(540 - d)}${bjarkan(540 + d)}</g>`; };

module.exports = {
  code: 'YS35',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-11-YS35-bluetooth',
  nummer: 'No. 35',
  onderwerp: 'THE NAME BLUETOOTH',
  pakket: {
    dag: 'vrijdag 11 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'Why is Bluetooth named after a Viking king?',
    intro: 'Bluetooth is named after Harald "Bluetooth" Gormsson, a Danish king from more than a thousand years ago. It was only meant to be a placeholder.',
    feiten: ['The name dates back more than a millennium to King Harald "Bluetooth" Gormsson; his nickname is said to come from a dead tooth, "a dark blue/grey color" (Bluetooth SIG).',
      'His runestone at Jelling says he "won for himself all of Denmark and Norway and made the Danes Christian" (National Museum of Denmark).',
      'In the late 1990s, Jim Kardach codenamed the project Bluetooth, "after the 10th century Danish King" (kardach.com).',
      'The idea: "just as we intended to unite the PC and cellular industries with a short-range wireless link" (Kardach, quoted by the Bluetooth SIG).',
      'Bluetooth "was only intended as a placeholder". PAN already had tens of thousands of hits, and a trademark search on RadioWire could not be completed in time for launch (Bluetooth SIG).',
      'The logo is a bind rune that merges the runes Hagall (ᚼ) and Bjarkan (ᛒ): Harald\'s initials (Bluetooth SIG).'],
    bronnen: [['Bluetooth SIG, "Origin of the name"', 'https://www.bluetooth.com/about-us/bluetooth-origin/'],
      ['National Museum of Denmark, "The Jelling Stone"', 'https://en.natmus.dk/historical-knowledge/denmark/prehistoric-period-until-1050-ad/the-viking-age/the-monuments-at-jelling/the-jelling-stone'],
      ['Jim Kardach, "Bluetooth" (kardach.com)', 'https://www.kardach.com/bluetooth']],
    hashtags: '#Shorts #history #technology #vikings',
    tags: 'Bluetooth, Bluetooth name, Harald Bluetooth, Viking king, Jim Kardach, Bluetooth logo, runes, Jelling stone, history of everyday things, why things are the way they are, shorts',
    md: [['Bluetooth SIG, "Origin of the name"', 'https://www.bluetooth.com/about-us/bluetooth-origin/',
      ['"the name dates back more than a millennia to King Harald \'Bluetooth\' Gormsson"', '"His dead tooth, which was a dark blue/grey color, and earned him the nickname Bluetooth"', '"just as we intended to unite the PC and cellular industries with a short-range wireless link"', '"Bluetooth was only intended as a placeholder until marketing could come up with something really cool"', 'PAN: "an exhaustive search discovered it already had tens of thousands of hits"; "a trademark search on RadioWire couldn\'t be completed in time for launch, making Bluetooth the only choice"', '"a bind rune merging the Younger Futhark runes (Hagall) (ᚼ) and (Bjarkan) (ᛒ), Harald\'s initials"']],
      ['National Museum of Denmark, "The Jelling Stone"', 'https://en.natmus.dk/historical-knowledge/denmark/prehistoric-period-until-1050-ad/the-viking-age/the-monuments-at-jelling/the-jelling-stone',
      ['opschrift: "won for himself all of Denmark and Norway and made the Danes Christian"', 'opgericht "around the year 965"']],
      ['Jim Kardach, kardach.com/bluetooth', 'https://www.kardach.com/bluetooth',
      ['"In the late 90\'s I helped form and lead a Special Interest Group I codenamed Bluetooth, after the 10th century Danish King."']]],
    niet: '- Niet gezegd: het precieze jaar (1996 of 1997: "late 1990s"), het jaar 958 (alleen de SIG), het boek dat Kardach las, Ericsson. "Won all of Denmark and Norway" is wat de steen zegt (Harald over zichzelf); de video zegt "his runestone claims". In beeld schuiven de twee runen als eigen lijnen over elkaar (de bind rune die het logo vormt), zonder het blauwe ovaal of de merkvormgeving. Koptelefoon, kroon, tand en steen zijn eigen ontwerp.',
  },
  scenes: [
    { duur: 2.6, stem: 'Your headphones are named after a Viking king.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => koptelefoon(h) + h.kin('Your headphones are named after a *Viking king*.', { y: 300, g: 100, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 3.0, stem: 'Harald Bluetooth. King of Denmark, more than a thousand years ago.', in: 'zweep', bron: SIG, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'ding', 0.5]],
      teken: h => kroon(h, h.klem((h.t - 0.3) / 0.4)) + h.kin('*Harald "Bluetooth"*, king of Denmark.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'The nickname is said to come from a dead, blue-grey tooth.', in: 'op', bron: SIG, bronStart: 1.6, camera: { zoom: [1, 1.06] }, geluid: [[1.0, 'tik', 0.5]],
      teken: h => tand(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('Said to be: a dead, *blue-grey tooth*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'His runestone claims he won all of Denmark and Norway.', in: 'zweep', bron: NAT, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'boem', 0.5]],
      teken: h => steen(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('His runestone: all of *Denmark and Norway*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'Late 1990s. Engineer Jim Kardach needs a code name.', in: 'flits', bron: KAR, bronStart: 1.6, camera: { zoom: [1, 1.05], stoot: [1.2] }, geluid: [[1.1, 'klap', 0.6]],
      teken: h => label(h, 'CODE NAME?', h.klem((h.t - 0.9) / 0.3)) + h.kin('*Late 1990s*: Jim Kardach needs a code name.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { duur: 3.4, stem: 'Harald unified Denmark. This radio link would unite computers and phones.', in: 'op', bron: SIG, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'whoosh', 0.4]],
      teken: h => apparaten(h, h.klem((h.t - 0.8) / 1.0)) + h.kin('A link to *unite* computers and phones.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'It was only a placeholder. The other names failed in time.', in: 'zweep', bron: SIG, bronStart: 1.6, camera: { zoom: [1, 1.06], schud: [1.4] }, geluid: [[1.4, 'klap', 0.6]],
      teken: h => label(h, 'BLUETOOTH', 1) + h.kin('Only a *placeholder*. It stayed.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { duur: 3.2, stem: 'And the logo? His initials, in runes.', in: 'op', bron: SIG, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.8] }, geluid: [[1.6, 'whoosh', 0.5], [1.9, 'ding', 0.6]],
      teken: h => runen(h, h.zacht((h.t - 1.2) / 0.7)) + h.kin('The logo: his *initials in runes*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 2.8, stem: 'So yes: a Viking king, in your ears.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => koptelefoon(h) + h.kin('A *Viking king*, in your ears.', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
  ],
};
