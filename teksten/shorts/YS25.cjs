// YS25 — Why is pound written "lb"? There's no L or B in "pound".
// Reeks A · Signs & Symbols. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Dictionary.com, lemma's "lb", "pound" en "libra"; Arika Okrent (taalkundige),
// "Why is 'Pound' Abbreviated as 'lb'?", Mental Floss (2014); Royal Mint Museum, "Pounds, shillings and pence".
// Britannica (plan-bron) gaf een 403. Niet gezegd: wanneer het streepje door lb (℔) of £ kwam (onbekend).
const DC = 'Dictionary.com, "lb", "pound", "libra"';
const MF = 'A. Okrent, Mental Floss (2014)';
const RM = 'Royal Mint Museum, "Pounds, shillings and pence"';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// weegschaal (balans); kantel in graden
const balans = (h, x = 540, y = 1100, kantel = 0, op = 1) => { const a = kantel * Math.PI / 180, dx = Math.cos(a) * 280, dy = Math.sin(a) * 280;
  const schaal = (sx, sy) => `<line x1="${sx}" y1="${sy}" x2="${sx - 90}" y2="${sy + 150}" stroke="${h.K.inkt}" stroke-width="4"/><line x1="${sx}" y1="${sy}" x2="${sx + 90}" y2="${sy + 150}" stroke="${h.K.inkt}" stroke-width="4"/><path d="M ${sx - 110} ${sy + 150} Q ${sx} ${sy + 220} ${sx + 110} ${sy + 150} Z" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="5"/>`;
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)"><rect x="${x - 12}" y="${y - 260}" width="24" height="420" fill="${h.K.inkt}"/><rect x="${x - 120}" y="${y + 150}" width="240" height="30" rx="10" fill="${h.K.inkt}"/>`
    + `<line x1="${(x - dx).toFixed(1)}" y1="${(y - 260 - dy).toFixed(1)}" x2="${(x + dx).toFixed(1)}" y2="${(y - 260 + dy).toFixed(1)}" stroke="${h.K.inkt}" stroke-width="14" stroke-linecap="round"/><circle cx="${x}" cy="${y - 260}" r="20" fill="${h.K.signaal}"/>`
    + schaal((x - dx).toFixed(1) * 1, (y - 260 - dy).toFixed(1) * 1) + schaal((x + dx).toFixed(1) * 1, (y - 260 + dy).toFixed(1) * 1) + '</g>'; };
// woord met gemarkeerde letters: elk teken {c, rood}
const woord = (h, delen, y, g = 140, op = 1) => { const tekst = delen.map(d => `<tspan fill="${d.rood ? h.K.signaal : h.K.inkt}" fill-opacity="${d.vaag ? 0.25 : 1}">${d.c}</tspan>`).join('');
  return `<text x="540" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${g}" opacity="${op.toFixed(3)}">${tekst}</text>`; };
const letters = (s, rood = [], vaag = []) => [...s].map((c, i) => ({ c, rood: rood.includes(i), vaag: vaag.includes(i) }));

module.exports = {
  code: 'YS25',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-01-YS25-lb',
  nummer: 'No. 25',
  onderwerp: 'THE "LB"',
  pakket: {
    dag: 'dinsdag 1 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why is "pound" written "lb"? There\'s no L or B in it',
    intro: 'The abbreviation lb comes from Latin: libra. The Romans said "libra pondo", a pound by weight. English kept one word for speaking and the other for writing.',
    feiten: ['lb comes from the Latin word libra.',
      'The primary meaning of libra was balance or scales (as in the star sign).',
      'Pound comes ultimately from Latin pondo, "by weight", in the phrase libra pondo, "a pound by weight".',
      'English took the word "pound" from the pondo part, but the abbreviation from libra (Arika Okrent, Mental Floss).',
      'The ancient Roman pound, the libra, held about 327 grams.',
      'The £ sign developed from the letter L, the initial of libra (Royal Mint Museum).'],
    bronnen: [['Dictionary.com, entries "lb", "pound" and "libra"', 'https://www.dictionary.com/browse/libra'],
      ['Arika Okrent, "Why is \'Pound\' Abbreviated as \'lb\'?", Mental Floss (2014)', 'https://www.mentalfloss.com/article/52058/'],
      ['Royal Mint Museum, "Pounds, shillings and pence"', 'https://www.royalmintmuseum.org.uk/journal/history/pounds-shillings-and-pence/']],
    hashtags: '#Shorts #history #words #latin',
    tags: 'lb, why is pound abbreviated lb, libra, libra pondo, pound abbreviation, latin words, units of weight, pound sign, history of everyday things, why things are the way they are, shorts',
    md: [['Dictionary.com, lemma\'s "lb", "pound" en "libra"', 'https://www.dictionary.com/browse/libra',
      ['lb.: "Origin of lb. < Latin lībra" (https://www.dictionary.com/browse/lb)', 'pound: "ultimately from Latin pondō "by weight, in weight" (adverb), in the phrase libra pondō "a pound by weight"" (https://www.dictionary.com/browse/pound)', 'libra: "the ancient Roman pound (containing 5053 grains or 327.4 grams)"; als sterrenbeeld "literally, pair of scales"']],
      ['Arika Okrent, "Why is \'Pound\' Abbreviated as \'lb\'?", Mental Floss (30 aug 2014)', 'https://www.mentalfloss.com/article/52058/',
      ['"Lb is an abbreviation of the Latin word libra."', '"The primary meaning of libra was balance or scales (as in the astrological sign),"', '"We got the word "pound" in English from the pondo part of the libra pondo" … "but our abbreviation comes from the libra."']],
      ['Royal Mint Museum, "Pounds, shillings and pence"', 'https://www.royalmintmuseum.org.uk/journal/history/pounds-shillings-and-pence/',
      ['"The £ sign developed over the years from the letter L, the initial letter of the Latin word libra meaning a pound of money."']]],
    niet: '- Britannica (plan-bron) gaf op 7 nov een 403. Niet gezegd: wanneer het streepje door "lb" (℔) of £ kwam (onbekend), en een exact gewicht anders dan "about 327 grams" (schattingen lopen tot ±329 g). De £ is al YS15; hier alleen één zin als verwijzing. Weegschaal en letters zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK: POUND = lb?
    { duur: 3.6, stem: "Why is pound written L-B? There's no L or B in pound.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.8, 'pop', 0.7]],
      teken: h => groot(h, 'lb', 820, 300) + woord(h, letters('POUND'), 1180, 150, h.klem((h.t - 1.6) / 0.3)) + h.kin('There\'s *no L or B* in "pound".', { y: 300, g: 100, t: h.t, start: 0.4 }).svg },
    // 2 · het is Latijn: libra
    { duur: 3.0, stem: "It's Latin. Libra.", in: 'zweep', bron: DC, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.9, 'klap', 0.8], [0.9, 'boem', 0.5]],
      teken: h => woord(h, letters('LIBRA', [0, 2]), 1060, 200, h.klem((h.t - 0.8) / 0.2)) + h.kin('It\'s Latin: *libra*.', { y: 300, g: 120, t: h.t, start: 0.05 }).svg },
    // 3 · libra = weegschaal
    { duur: 3.6, stem: "Libra first meant a balance, or scales. Like the star sign.", in: 'op', bron: MF, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'tik', 0.6], [1.6, 'tik', 0.6]],
      teken: h => balans(h, 540, 1120, Math.sin(h.t * 2.4) * 12 * (1 - h.klem((h.t - 2.4) / 0.8))) + h.kin('Libra first meant a *balance*, or scales.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 4 · libra pondo
    { duur: 3.8, stem: "The Romans said libra pondo: a pound by weight.", in: 'flits', bron: DC, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.2] }, geluid: [[1.2, 'ding', 0.6]],
      teken: h => woord(h, letters('LIBRA PONDO'), 1000, 120, h.klem((h.t - 1.0) / 0.3)) + `<text x="540" y="1140" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="64" fill="${h.K.grijs}" opacity="${h.klem((h.t - 1.6) / 0.3).toFixed(3)}">"a pound by weight"</text>`
        + h.kin('The Romans said *libra pondo*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    // 5 · Engels hield pondo: pound
    { duur: 3.8, stem: "English kept pondo for speaking. It became pound.", in: 'zweep', bron: MF, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.8] }, geluid: [[1.8, 'pop', 0.8]],
      teken: h => { const p = h.zacht((h.t - 1.2) / 0.6);
        return woord(h, letters('LIBRA PONDO', [6, 7, 8, 9, 10], [0, 1, 2, 3, 4]), 980, 120) + `<text x="540" y="1220" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="150" fill="${h.K.signaal}" opacity="${p.toFixed(3)}">POUND</text>`
          + h.kin('English kept *pondo* for speaking: *pound*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg; } },
    // 6 · maar de afkorting hield libra: L-B
    { duur: 3.8, stem: "But for writing, it kept libra. L-B.", in: 'op', bron: MF, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.8] }, geluid: [[1.8, 'klap', 0.8], [1.8, 'boem', 0.5]],
      teken: h => { const p = h.zacht((h.t - 1.2) / 0.6);
        return woord(h, letters('LIBRA PONDO', [0, 2], [1, 3, 4, 6, 7, 8, 9, 10]), 980, 120) + `<text x="540" y="1240" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="180" fill="${h.K.signaal}" opacity="${p.toFixed(3)}">lb</text>`
          + h.kin('But for writing, it kept *libra*: *lb*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg; } },
    // 7 · een Romeinse libra: ongeveer 327 gram
    { duur: 3.4, stem: "A Roman libra weighed about 327 grams.", in: 'zweep', bron: DC, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.4] }, geluid: [[0.8, 'rol', 0.6], [1.4, 'ding', 0.6]],
      teken: h => balans(h, 540, 1090, 0) + `<text x="540" y="720" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="150" fill="${h.K.signaal}" opacity="${h.klem((h.t - 0.8) / 0.3).toFixed(3)}">≈ ${Math.round(327 * h.zacht((h.t - 0.8) / 0.6))} g</text>`
        + h.kin('A Roman libra: *about 327 grams*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 8 · ook de £ komt van libra
    { duur: 3.6, stem: "And the pound sign? Also libra. It grew out of the letter L.", in: 'masker', nacht: true, bron: RM, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.6]],
      teken: h => `<text x="540" y="1150" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="360" fill="${h.K.geel}" opacity="${h.klem((h.t - 1.0) / 0.4).toFixed(3)}">£</text>`
        + h.kin('The *£* sign? Also libra: it grew out of the letter *L*.', { y: 330, g: 92, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 9 · slot
    { duur: 3.6, stem: "Pound for saying it. Libra for writing it.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => groot(h, 'lb', 1050, 300)
        + h.kin('*Pound* for saying it. *Libra* for writing it.', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
