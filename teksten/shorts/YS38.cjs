// YS38 — Sliced bread was invented by a jeweller.
// Reeks C · Happy Accidents (de brand van 1917) / Who Decided. VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de
// eerste seconde, 25–40 s, einde dat terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1
// (zo 22 nov 2026), daarna YouTube (ma 14 dec).
// Bronnen (gelezen ma 9 nov 2026): Lemelson-MIT, "Otto Rohwedder"; Lucas Reilly, Mental Floss (3 jan 2019) over het
// verbod van 1943.
// Niet gezegd: de reden van het verbod (bronnen verschillen), het Smithsonian-apparaat (pagina gaf een 403), de herkomst
// van "the greatest thing since sliced bread" (alleen als uitdrukking gebruikt, geen bewering over de herkomst), Wonder Bread.
const LEM = 'Lemelson-MIT, "Otto Rohwedder"';
const MF = 'Mental Floss (2019)';

const brood = (h, x = 540, y = 1050, s = 1, plakken = 0, intro = true) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  let r = `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${(s * (0.7 + 0.3 * q)).toFixed(3)})" opacity="${intro ? h.klem(h.t / 0.08).toFixed(3) : 1}"><path d="M -300 160 L -300 -40 Q -300 -200 -150 -200 Q -80 -260 0 -210 Q 80 -260 150 -200 Q 300 -200 300 -40 L 300 160 Z" fill="#C98B4A" stroke="${h.K.inkt}" stroke-width="10" stroke-linejoin="round"/>`;
  for (let i = 1; i < 8; i++) if (i / 8 <= plakken) r += `<line x1="${-300 + i * 75}" y1="-200" x2="${-300 + i * 75}" y2="160" stroke="${h.K.inkt}" stroke-width="6"/>`;
  return r + '</g>'; };
const ring = (h, p = 1) => `<g filter="url(#sch)" transform="translate(540 1050) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})" opacity="${h.klem(p * 3).toFixed(3)}"><circle r="160" fill="none" stroke="${h.K.geel}" stroke-width="44"/><circle r="160" fill="none" stroke="${h.K.inkt}" stroke-width="6"/><circle r="182" fill="none" stroke="${h.K.inkt}" stroke-width="4"/><path d="M -50 -230 L 0 -300 L 50 -230 L 0 -190 Z" fill="#9FD3E6" stroke="${h.K.inkt}" stroke-width="6"/></g>`;
const vuur = (h, p = 1) => `<g opacity="${p.toFixed(3)}">` + Array.from({ length: 5 }, (_, i) => { const x = 240 + i * 150, hh = (200 + (i % 2) * 100) * h.veer(h.klem(p * 5 - i)), w = Math.sin(h.t * 7 + i) * 12;
  return `<path d="M ${x - 70} 1220 Q ${x - 60 + w} ${1220 - hh * 0.6} ${x + w} ${1220 - hh} Q ${x + 60 + w} ${1220 - hh * 0.6} ${x + 70} 1220 Z" fill="${i % 2 ? h.K.geel : h.K.signaal}" stroke="${h.K.inkt}" stroke-width="5"/>`; }).join('') + '</g>';
const plan = (h, p = 1) => `<g filter="url(#sch)" opacity="${(1 - p * 0.85).toFixed(3)}"><rect x="220" y="760" width="640" height="440" fill="#3D6FB4" stroke="${h.K.inkt}" stroke-width="6"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="270" y="${810 + i * 70}" width="${[500, 360, 420, 300, 460][i]}" height="10" fill="#DDE7F3"/>`).join('') + '</g>';
const machine = (h, p = 1, wikkel = 0) => `<g filter="url(#sch)"><rect x="160" y="980" width="760" height="260" rx="16" fill="#8E949E" stroke="${h.K.inkt}" stroke-width="8"/>`
  + Array.from({ length: 6 }, (_, i) => `<line x1="${380 + i * 50}" y1="900" x2="${380 + i * 50}" y2="${(900 + 90 * Math.abs(Math.sin(h.t * 8 + i))).toFixed(1)}" stroke="${h.K.inkt}" stroke-width="8"/>`).join('')
  + `<rect x="300" y="880" width="420" height="40" rx="8" fill="#5A6070" stroke="${h.K.inkt}" stroke-width="6"/>`
  + (wikkel > 0 ? `<rect x="${(160 + 760 * (1 - wikkel)).toFixed(1)}" y="1000" width="${(760 * wikkel).toFixed(1)}" height="220" fill="#FBF6EA" opacity="0.85" stroke="${h.K.inkt}" stroke-width="4"/>` : '') + `</g>`;
const kalender = (h, tekst, p = 1) => `<g filter="url(#sch)" transform="translate(540 1040) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)})" opacity="${h.klem(p * 3).toFixed(3)}"><rect x="-230" y="-230" width="460" height="460" rx="24" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="10"/><rect x="-230" y="-230" width="460" height="120" rx="24" fill="${h.K.signaal}"/><text x="0" y="-145" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="#FFFFFF">JULY</text><text x="0" y="110" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="240" fill="${h.K.inkt}">${tekst}</text></g>`;
const verbod = (h, p = 1) => `<g opacity="${p.toFixed(3)}"><circle cx="540" cy="1050" r="300" fill="none" stroke="${h.K.signaal}" stroke-width="44"/><line x1="330" y1="840" x2="750" y2="1260" stroke="${h.K.signaal}" stroke-width="44"/></g>`;

module.exports = {
  code: 'YS38',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 2,   // Stijl OK stijl 2 (Andries, ma 9 nov 2026)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-14-YS38-brood',
  nummer: 'No. 38',
  onderwerp: 'SLICED BREAD',
  pakket: {
    dag: 'maandag 14 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'Sliced bread was invented by a jeweller',
    intro: 'Otto Rohwedder ran jewellery stores before he built a machine that sliced bread, and wrapped it. The first loaf was sold on 7 July 1928.',
    feiten: ['Otto Rohwedder ran "three jewelry stores of his own in St. Joseph, Mo., until 1916" (Lemelson-MIT).',
      'In late 1917, "a fire destroyed Rohwedder\'s design blueprints at a Monmouth, Illinois, factory" (Lemelson-MIT).',
      'He realised sliced bread would go stale; by 1927 he had "a machine that would slice the bread and also wrap it" (Lemelson-MIT).',
      'He sold his first machine to the Chillicothe Baking Company in Chillicothe, Missouri, in 1928. "On July 7 of that year, the company sold its first loaf of sliced bread" (Lemelson-MIT).',
      'From January 18, 1943, during World War II, sliced bread was barred in the US; on March 8, 1943, the ban was rescinded (Mental Floss).'],
    bronnen: [['Lemelson-MIT Program, "Otto Rohwedder"', 'https://lemelson.mit.edu/resources/otto-rohwedder'],
      ['Lucas Reilly, "The Time the U.S. Government Banned Sliced Bread", Mental Floss (January 3, 2019)', 'https://www.mentalfloss.com/food/time-us-government-banned-sliced-bread']],
    hashtags: '#Shorts #history #food #inventions',
    tags: 'sliced bread, who invented sliced bread, Otto Rohwedder, Chillicothe 1928, bread slicer, sliced bread ban 1943, greatest thing since sliced bread, history of everyday things, why things are the way they are, shorts',
    md: [['Lemelson-MIT, "Otto Rohwedder"', 'https://lemelson.mit.edu/resources/otto-rohwedder',
      ['"opening and operating three jewelry stores of his own in St. Joseph, Mo., until 1916"', '"in late 1917 when a fire destroyed Rohwedder\'s design blueprints at a Monmouth, Illinois, factory"', '"he would need to find a way to prevent a loaf of sliced bread from going stale. By 1927, he had devised a solution to this problem: a machine that would slice the bread and also wrap it."', '"sold his first machine to the Chillicothe Baking Company, in Chillicothe, Mo., in 1928. On July 7 of that year, the company sold its first loaf of sliced bread."']],
      ['Lucas Reilly, Mental Floss (3 jan 2019)', 'https://www.mentalfloss.com/food/time-us-government-banned-sliced-bread',
      ['"Starting January 18, 1943—the midst of World War II—sliced bread was barred from American bakeries and homes."', '"On March 8, 1943, the ban was rescinded"']]],
    niet: '- Niet gezegd: de reden van het verbod (bronnen verschillen), het Smithsonian-apparaat (403), de herkomst van de uitdrukking "the greatest thing since sliced bread" (alleen als uitdrukking gebruikt), Wonder Bread en de merknaam van het eerste brood. "Seven weeks" = 18 januari tot 8 maart 1943 (49 dagen). Brood, ring, machine en kalender zijn eigen tekenwerk.',
  },
  scenes: [
    { duur: 2.4, stem: 'Sliced bread was invented by a jeweller.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => brood(h, 540, 1060, 1, 1) + h.kin('Sliced bread was invented by a *jeweller*.', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 2.8, stem: 'Otto Rohwedder ran three jewellery stores in Missouri.', in: 'zweep', bron: LEM, bronStart: 1.4, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'ding', 0.5]],
      teken: h => ring(h, h.klem((h.t - 0.2) / 0.4)) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1010, 240, 275, { t: h.t, start: 1.2 }) : '') + h.kin('*Otto Rohwedder*: three jewellery stores.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'He designs a bread slicer. In 1917, a fire destroys his blueprints.', in: 'op', nacht: true, bron: LEM, bronStart: 1.8, camera: { zoom: [1, 1.05], schud: [1.4] }, geluid: [[1.3, 'boem', 0.6], [1.6, 'rol', 0.4]],
      teken: h => plan(h, h.klem((h.t - 1.3) / 1.2)) + vuur(h, h.klem((h.t - 1.2) / 0.8)) + h.kin('*1917*: a fire destroys his plans.', { y: 300, g: 104, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    { duur: 3.2, stem: 'Sliced bread goes stale. So his new machine slices, and wraps.', in: 'zweep', bron: LEM, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'rol', 0.4], [2.0, 'whoosh', 0.4]],
      teken: h => machine(h, 1, h.zacht((h.t - 1.8) / 0.8)) + h.kin('It *slices*, and it *wraps*.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: '1928. A bakery in Chillicothe, Missouri, buys the first machine.', in: 'op', bron: LEM, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.5]],
      teken: h => brood(h, 540, 1060, 0.9, h.klem((h.t - 0.8) / 1.2), false) + h.kin('*1928*: a bakery in Chillicothe, Missouri.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 2.6, stem: 'July seventh: the first sliced loaf is sold.', in: 'flits', bron: LEM, bronStart: 1.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.3, 'klap', 0.7], [0.4, 'ding', 0.5]],
      teken: h => kalender(h, '7', h.klem((h.t - 0.2) / 0.3)) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1040, 285, 285, { t: h.t, start: 1.0 }) : '') + h.kin('The *first sliced loaf* is sold.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'In 1943, the US government even banned it. For seven weeks.', in: 'zweep', bron: MF, bronStart: 1.6, camera: { zoom: [1, 1.06], schud: [1.0] }, geluid: [[1.0, 'klap', 0.7]],
      teken: h => brood(h, 540, 1060, 0.8, 1, false) + verbod(h, h.klem((h.t - 0.9) / 0.2)) + h.kin('*1943*: banned. For seven weeks.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 2.8, stem: 'The greatest thing since sliced bread? Thank a jeweller.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => brood(h, 540, 1060, 1, 1) + h.kin('The greatest thing since sliced bread? *Thank a jeweller*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg },
  ],
};
