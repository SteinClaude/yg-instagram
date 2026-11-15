// YS41 — Why do your jeans have that tiny pocket?
// Reeks B · Everyday Things. VORM 3 (haak in de eerste seconde, kort, lus) en STIJL 3 (Andries za 14 nov 2026 ±20:43:
// "stijl OK stijl 3"): het vaste duo in getekende decors, met wijd beeld en close-ups. Het Vraagteken stelt de vragen,
// Peertje geeft de antwoorden.
// Bronnen (gelezen zo 15 nov 2026): Levi Strauss & Co., "Pockets Full of History", Unzipped (12 jan 2017);
// US Patent No. 139,121, "Improvement in Fastening Pocket-Openings", J. W. Davis (20 mei 1873), via Google Patents.
// Niet gezegd: een jaartal voor het eerste horlogezakje (de bron noemt er geen), cowboys of mijnwerkers, de klinknagels
// die in de Tweede Wereldoorlog van het zakje gingen (staat wel in de beschrijving), en dat "niemand" nog een
// zakhorloge draagt (geen bron). Britannica en Reader's Digest gaven een 403 en zijn daarom geen bron.
const LEVI = 'Levi Strauss & Co. (2017)';
const PAT = 'US Patent 139,121 (1873)';

const DENIM = '#3F5E8C', DIEP = '#35517B', GAREN = '#E8A23A', KOPER = '#C9713A', GOUD = '#F2C230', KRIJT = '#F4F1E6';
const naad = d => `<path d="${d}" fill="none" stroke="${GAREN}" stroke-width="5" stroke-dasharray="14 9" stroke-linecap="round"/>`;
const klink = (h, x, y, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${KOPER}" stroke="${h.K.inkt}" stroke-width="${Math.max(3, r * 0.36).toFixed(1)}"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${(r * 0.32).toFixed(1)}" fill="#F3C9A0"/>`;

// Zakhorloge: gouden kast, wijzerplaat, kroon met ring. De secondewijzer loopt mee met de tijd.
const horloge = (h, cx, cy, r, { ketting = false } = {}) => { const I = h.K.inkt, a = h.t * 90, lijn = Math.max(4, r * 0.07);
  let s = ketting ? `<path d="M ${cx} ${cy - r * 1.42} Q ${cx - r * 1.05} ${cy - r * 1.72} ${cx - r * 1.5} ${cy - r * 0.55}" fill="none" stroke="${I}" stroke-width="${(lijn * 1.9).toFixed(1)}" stroke-linecap="round"/>`
    + `<path d="M ${cx} ${cy - r * 1.42} Q ${cx - r * 1.05} ${cy - r * 1.72} ${cx - r * 1.5} ${cy - r * 0.55}" fill="none" stroke="${GOUD}" stroke-width="${(lijn * 0.9).toFixed(1)}" stroke-dasharray="${(r * 0.16).toFixed(1)} ${(r * 0.1).toFixed(1)}" stroke-linecap="round"/>` : '';
  s += `<circle cx="${cx}" cy="${cy - r * 1.3}" r="${(r * 0.17).toFixed(1)}" fill="none" stroke="${I}" stroke-width="${lijn.toFixed(1)}"/><rect x="${(cx - r * 0.13).toFixed(1)}" y="${(cy - r * 1.16).toFixed(1)}" width="${(r * 0.26).toFixed(1)}" height="${(r * 0.22).toFixed(1)}" rx="3" fill="${GOUD}" stroke="${I}" stroke-width="${(lijn * 0.8).toFixed(1)}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${GOUD}" stroke="${I}" stroke-width="${lijn.toFixed(1)}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.8).toFixed(1)}" fill="#FBF6EA" stroke="${I}" stroke-width="${(lijn * 0.7).toFixed(1)}"/>`;
  for (let i = 0; i < 12; i++) { const q = i * Math.PI / 6, r1 = r * (i % 3 === 0 ? 0.58 : 0.66), r2 = r * 0.73;
    s += `<path d="M ${(cx + Math.sin(q) * r1).toFixed(1)} ${(cy - Math.cos(q) * r1).toFixed(1)} L ${(cx + Math.sin(q) * r2).toFixed(1)} ${(cy - Math.cos(q) * r2).toFixed(1)}" stroke="${I}" stroke-width="${(lijn * (i % 3 === 0 ? 0.9 : 0.55)).toFixed(1)}" stroke-linecap="round"/>`; }
  const wijzer = (hoek, len, dik, kleur) => `<path d="M ${cx} ${cy} L ${(cx + Math.sin(hoek * Math.PI / 180) * r * len).toFixed(1)} ${(cy - Math.cos(hoek * Math.PI / 180) * r * len).toFixed(1)}" stroke="${kleur}" stroke-width="${(lijn * dik).toFixed(1)}" stroke-linecap="round"/>`;
  return s + wijzer(305, 0.4, 1, I) + wijzer(60 + a / 12, 0.6, 0.8, I) + wijzer(a, 0.66, 0.4, h.K.signaal) + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.07).toFixed(1)}" fill="${I}"/>`; };

// Het voorpand van een spijkerbroek, van dichtbij, op het vlak van het decor: band, grote zak en daarin het kleine zakje.
//   val: 0..1, het zakhorloge zakt in het kleine zakje · gloed: 0..1, gele rand om het kleine zakje
const zak = (h, { intro = true, val = -1, gloed = 0 } = {}) => { const I = h.K.inkt, q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  const hy = 712 + 132 * h.klem(val), puls = 0.6 + 0.4 * Math.sin(h.t * 7);
  return `<clipPath id="zakvlak"><rect x="230" y="684" width="620" height="302" rx="16"/></clipPath>`
    + `<g opacity="${(intro ? h.klem(h.t / 0.08) : 1).toFixed(3)}" transform="translate(540 835) scale(${(0.72 + 0.28 * q).toFixed(3)}) translate(-540 -835)">`
    + `<rect x="238" y="694" width="620" height="302" rx="16" fill="#000" opacity="0.2"/><g clip-path="url(#zakvlak)">`
    + `<rect x="230" y="684" width="620" height="302" fill="${DENIM}"/>`
    + `<path d="M 398 732 Q 418 940 850 958 L 850 732 Z" fill="${DIEP}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>` + naad('M 378 736 Q 398 962 850 980')
    + (val >= 0 ? horloge(h, 685, hy, 50) : '')
    + `<path d="M 610 764 L 760 764 L 760 896 Q 685 916 610 896 Z" fill="${DENIM}" stroke="${I}" stroke-width="6" stroke-linejoin="round"/>` + naad('M 624 784 L 746 784') + naad('M 624 790 L 624 884 Q 685 900 746 884 L 746 790')
    + klink(h, 616, 770) + klink(h, 754, 770)
    + `<rect x="230" y="684" width="620" height="48" fill="${DIEP}"/><path d="M 230 732 L 850 732" stroke="${I}" stroke-width="6"/>` + naad('M 240 698 L 840 698') + naad('M 240 720 L 840 720')
    + `<rect x="452" y="676" width="34" height="74" rx="5" fill="${DENIM}" stroke="${I}" stroke-width="5"/>` + klink(h, 404, 746)
    + `</g><rect x="230" y="684" width="620" height="302" rx="16" fill="none" stroke="${I}" stroke-width="7"/>`
    + (gloed > 0 ? `<path d="M 600 754 L 770 754 L 770 904 Q 685 928 600 904 Z" fill="none" stroke="${GOUD}" stroke-width="11" stroke-linejoin="round" opacity="${(h.klem(gloed) * puls).toFixed(3)}"/>` : '') + `</g>`; };

// Groot zakhorloge met ketting en het tijdvak ernaast
const tijdvak = (h, p = 0) => { const q = h.veer(h.klem(h.t / 0.4)), o2 = h.klem(p * 3);
  return `<g transform="translate(360 846) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(-360 -846)" opacity="${h.klem(h.t / 0.1).toFixed(3)}">${horloge(h, 360, 858, 108, { ketting: true })}</g>`
    + `<g opacity="${o2.toFixed(3)}" transform="translate(0 ${((1 - h.veer(h.klem(p))) * 24).toFixed(1)})"><text x="700" y="800" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="50" fill="${h.K.grijs}">the late</text>`
    + `<text x="700" y="920" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="128" fill="${h.K.signaal}">1800s</text></g>`; };

// Krijt op het schoolbord: het octrooi en een grote klinknagel
const octrooi = (h, p = 0, k = 0) => { const kq = h.veer(h.klem(k));
  return `<g opacity="${h.klem(p * 3).toFixed(3)}"><text x="390" y="770" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="50" fill="${GOUD}" letter-spacing="6">PATENTED</text>`
    + `<text x="390" y="945" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(190 * (0.8 + 0.2 * h.veer(h.klem(p)))).toFixed(0)}" fill="${KRIJT}">1873</text></g>`
    + (k > 0 ? `<g transform="translate(765 838) scale(${kq.toFixed(3)})" opacity="${h.klem(k * 3).toFixed(3)}"><circle cx="0" cy="0" r="92" fill="none" stroke="${KRIJT}" stroke-width="7" stroke-dasharray="20 14" opacity="0.7"/>${klink(h, 0, 0, 62)}</g>` : ''); };

// Krijt: vier zakken op een rij; het kleine is geel
const vorm = (x, y, w, hh) => `M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + w / 2} ${y + hh * 0.74} Q ${x} ${y + hh} ${x - w / 2} ${y + hh * 0.74} Z`;
const vier = (h, p = 0, klein = 0) => [0, 1, 2, 3].map(i => { const q = h.veer(h.klem(p * 4 - i * 0.85)), x = 222 + i * 212, k = i === 3;
  if (q <= 0) return ''; const puls = k ? 1 + 0.07 * Math.sin(h.t * 8) * h.klem(klein) : 1;
  return `<g opacity="${h.klem(q * 2).toFixed(3)}" transform="translate(${x} ${835 + (1 - q) * 50}) scale(${((0.6 + 0.4 * q) * puls).toFixed(3)})">`
    + (k ? `<path d="${vorm(0, -56, 104, 132)}" fill="${GOUD}" stroke="${h.K.inkt}" stroke-width="6" stroke-linejoin="round"/>` : `<path d="${vorm(0, -110, 150, 204)}" fill="none" stroke="${KRIJT}" stroke-width="8" stroke-linejoin="round"/><path d="M -58 -88 L 58 -88" stroke="${KRIJT}" stroke-width="5" stroke-dasharray="14 10" opacity="0.7"/>`)
    + `<text x="0" y="${k ? 36 : 26}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${k ? 64 : 72}" fill="${k ? h.K.inkt : KRIJT}">${i + 1}</text></g>`; }).join('');

// Krijt: de achterkant van de broek; de zak linksachter is nummer vijf
const achter = (h, p = 0, vijf = 0, jaar = 0) => { const v = h.klem(vijf), jq = h.veer(h.klem(jaar));
  return `<clipPath id="bordvlak"><rect x="140" y="670" width="800" height="330"/></clipPath><g clip-path="url(#bordvlak)" opacity="${h.klem(p * 3).toFixed(3)}">`
    + `<path d="M 186 700 L 614 700 L 614 742 L 636 1010 L 164 1010 L 186 742 Z" fill="none" stroke="${KRIJT}" stroke-width="8" stroke-linejoin="round"/><path d="M 186 742 L 614 742 M 400 742 L 400 1010" stroke="${KRIJT}" stroke-width="6"/>`
    + `<path d="M 200 762 Q 300 800 400 790 Q 500 800 600 762" fill="none" stroke="${KRIJT}" stroke-width="5" stroke-dasharray="14 10" opacity="0.7"/>`
    + `<path d="${vorm(506, 826, 136, 156)}" fill="none" stroke="${KRIJT}" stroke-width="7" stroke-linejoin="round"/>`
    + `<path d="${vorm(294, 826, 136, 156)}" fill="${GOUD}" fill-opacity="${v.toFixed(3)}" stroke="${v > 0.5 ? h.K.inkt : KRIJT}" stroke-width="7" stroke-linejoin="round"/>`
    + (v > 0 ? `<text x="294" y="928" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="84" fill="${h.K.inkt}" opacity="${v.toFixed(3)}">5</text>` : '') + `</g>`
    + (jaar > 0 ? `<g opacity="${h.klem(jaar * 3).toFixed(3)}"><text x="785" y="790" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="${GOUD}">back left</text>`
      + `<text x="785" y="925" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(128 * (0.7 + 0.3 * jq)).toFixed(0)}" fill="${KRIJT}">1901</text></g>` : ''); };

module.exports = {
  code: 'YS41',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 3,   // stijl OK: Andries za 14 nov 2026 ±20:43, "stijl OK stijl 3" (geldt voor de reeks vanaf YS40)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  // Stemmen van ElevenLabs, gekozen door Andries (za 14 nov 2026 ±20:02: "vraag tegen laura, peertje liam")
  stemmen: { vraag: { dienst: 'elevenlabs', stem: 'FGY2WhTYpPnrIDTdsKH5', naam: 'Laura', tempo: 1.12 }, antwoord: { dienst: 'elevenlabs', stem: 'TX3LPaxmHKxFdv7VOQHJ', naam: 'Liam', tempo: 1.12 } },
  duo: { vloer: 1590, vraag: { code: 'A', x: 285, spiegel: false, fase: 0.4 }, antwoord: { code: 'D', x: 785, spiegel: true, fase: 1.9 } },
  map: '2026-11-16-YS41-jeans-pocket',
  nummer: 'No. 41',
  onderwerp: 'THE TINY POCKET',
  pakket: {
    dag: 'maandag 16 november 2026', tijd: '20:00',   // nieuwe reeks om 20:00 (Andries za 14 nov 2026 ±21:45)
    gelezen: 'zo 15 nov 2026',
    titel: 'Why do your jeans have that tiny pocket?',
    intro: 'That small pocket inside the front pocket of your jeans has a name and a job: it was made to hold a pocket watch. And it is not the "fifth pocket".',
    feiten: ['"The small pocket on the right front side is called a watch pocket, since it was intended to store a pocket watch", "a typical possession during the late 1800s" (Levi Strauss & Co.).',
      'US Patent No. 139,121, "Improvement in Fastening Pocket-Openings", was granted on May 20, 1873, to Jacob W. Davis, assigned to himself and Levi Strauss & Company. It describes "a metal rivet or eyelet at each edge of the pocket-opening".',
      '"There were four pockets on the original pants and all of them were riveted", "including a small pocket above the larger right pocket" (Levi Strauss & Co.).',
      '"Although the watch pocket is sometimes referred to as the fifth pocket, that honor belongs to the back left pocket", "which didn\'t appear on our jeans until 1901" (Levi Strauss & Co.).',
      'Bonus: "During World War II, we removed the rivets on the watch pocket to save metal needed for the war effort" (Levi Strauss & Co.).'],
    bronnen: [['"Pockets Full of History", Unzipped, Levi Strauss & Co. (January 12, 2017)', 'https://levistrauss.com/2017/01/12/pockets-full-history/'],
      ['J. W. Davis, "Improvement in Fastening Pocket-Openings", US Patent No. 139,121 (May 20, 1873), via Google Patents', 'https://patents.google.com/patent/US139121A/en']],
    hashtags: '#Shorts #history #jeans #everydaythings',
    tags: 'jeans tiny pocket, small pocket on jeans, watch pocket, pocket watch, fifth pocket, why do jeans have a tiny pocket, jeans history, rivets, 1873 patent, denim, history of everyday things, why things are the way they are, shorts',
    md: [['Levi Strauss & Co., "Pockets Full of History", Unzipped (12 jan 2017)', 'https://levistrauss.com/2017/01/12/pockets-full-history/',
      ['"The small pocket on the right front side is called a watch pocket, since it was intended to store a pocket watch"', '"a typical possession during the late 1800s."',
        '"There were four pockets on the original pants and all of them were riveted—three on the front,"', '"including a small pocket above the larger right pocket."',
        '"Although the watch pocket is sometimes referred to as the fifth pocket, that honor belongs to the back left pocket,"', '"which didn\'t appear on our jeans until 1901."',
        '"During World War II, we removed the rivets on the watch pocket to save metal needed for the war effort."']],
      ['US Patent No. 139,121, "Improvement in fastening pocket-openings", Jacob W. Davis, of Reno, Nevada; toegewezen aan hemzelf en Levi Strauss & Company; 20 mei 1873 (Google Patents)', 'https://patents.google.com/patent/US139121A/en',
      ['"employment of a metal rivet or eyelet at each edge of the pocket-opening"', '"the rivet or eyelet is so fastened in the seam as to bind the two parts of cloth"']]],
    niet: '- Niet gezegd: een jaartal voor het eerste horlogezakje (de bron noemt er geen), cowboys of mijnwerkers, en dat "niemand" nog een zakhorloge draagt (geen bron). De klinknagels in de Tweede Wereldoorlog staan alleen in de beschrijving. De bron is van de maker van de broek zelf; het octrooi is de onafhankelijke tweede bron voor het jaar 1873 en de klinknagels. Broek, horloge, decors en figuren zijn eigen tekenwerk; er staat geen merk of logo in beeld.',
  },
  // Het gesprek: hele zinnen, met reacties op elkaar. Elk feit staat in de bronnen; de uitroepen eromheen zijn
  // vertelstijl. Beeld dat op de stem moet vallen gebruikt h.op('woord').
  scenes: [
    { wie: 'vraag', decor: 'kamer', duur: 2.4, stem: 'Okay, what is this tiny pocket in my jeans even for?', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => zak(h, { gloed: (h.t - h.op('tiny', 0.9)) / 0.2 }) + h.krabbel.cirkel(685, 832, 128, 104, { t: h.t, start: h.op('tiny', 0.9) }) + h.kin('What is this *tiny pocket* for?', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 3.4, stem: "Ooh, I love this one! It's called a watch pocket. It was made to hold a pocket watch!", in: 'zweep', bron: LEVI, bronStart: 'made', camera: { zoom: [1, 1.05] }, geluid: [['hold', 'whoosh', 0.5], [-0.5, 'pop', 0.6]],
      teken: h => zak(h, { val: h.zacht((h.t - h.op('hold', 2.4)) / 0.7), gloed: (h.t - h.op('watch', 1.4)) / 0.2 }) + h.kin("It's called a *watch pocket*!", { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'atelier', shot: 'dichtbij', duur: 2.0, stem: 'A pocket watch? Who even carries one of those?', pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('A *pocket watch*? Who has one?', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'atelier', duur: 2.8, stem: 'Back in the late eighteen hundreds? Lots of people did!', bron: LEVI, bronStart: 'lots', camera: { zoom: [1, 1.06] }, geluid: [[0.1, 'tik', 0.5], [0.6, 'tik', 0.5], ['eighteen', 'klap', 0.5]],
      teken: h => tijdvak(h, (h.t - h.op('late', 0.8)) / 0.4) + h.kin('The *late 1800s*: lots of people!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.2, stem: 'These riveted pockets were patented in eighteen seventy-three.', in: 'zweep', bron: PAT, bronStart: 'seventy', camera: { zoom: [1, 1.05] }, geluid: [['riveted', 'tik', 0.6], ['eighteen', 'klap', 0.5]],
      teken: h => octrooi(h, (h.t - h.op('patented', 1.4)) / 0.4, (h.t - h.op('riveted', 0.4)) / 0.35) + h.kin('Riveted pockets: patented in *1873*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 3.2, stem: 'The original pants had four pockets. This little one included!', bron: LEVI, bronStart: 'four', camera: { zoom: [1.02, 1.07] }, geluid: [['four', 'tik', 0.5], ['little', 'pop', 0.6]],
      teken: h => vier(h, h.klem((h.t - h.op('original', 0.3)) / Math.max(0.5, h.op('pockets', 1.6) - h.op('original', 0.3) + 0.2)), (h.t - h.op('little', 2.2)) / 0.2) + h.kin('*Four pockets*. This one too!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'klas', shot: 'dichtbij', duur: 2.0, stem: "Wait. Four? Isn't this the famous fifth pocket?", pose: { vraag: 'verbaasd' }, camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin('Wait. The famous *fifth pocket*?', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'klas', duur: 4.6, stem: 'People call it that, but nope! The fifth pocket is the back left one. It only showed up in nineteen oh one!', in: 'zweep', bron: LEVI, bronStart: 'nineteen', camera: { zoom: [1, 1.06] }, geluid: [['back', 'pop', 0.6], ['nineteen', 'klap', 0.6]],
      teken: h => achter(h, h.t / 0.3, (h.t - h.op('back', 2.6)) / 0.25, (h.t - h.op('nineteen', 4.2)) / 0.35) + h.kin('Nope! Number 5 is *back left*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'vraag', decor: 'kamer', shot: 'dichtbij', duur: 1.8, stem: "But I don't even own a pocket watch!", camera: { zoom: [1, 1.04] }, geluid: [[0.02, 'klap', 0.4]],
      teken: h => h.kin("But I don't own a *pocket watch*!", { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { wie: 'antwoord', decor: 'kamer', duur: 3.0, stem: 'Neither do I! The pocket stayed anyway. Go on, check your jeans!', in: 'zweep', pose: { antwoord: 'verbaasd' }, camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => zak(h, { gloed: 1 }) + h.kin('*Go on*, check your jeans!', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
  ],
};
