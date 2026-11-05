// YS15 — Why the pound sign is an L.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bron (gelezen 4 nov 2026): Royal Mint Museum, "Pounds, shillings and pence". Elke bewering staat daarin; zie
// pakketten/<map>/bron/bronnen.md. Niet gezegd: "libra pondo", Karel de Grote, de datum van Decimal Day (niet in de bron).
const RMM = 'Royal Mint Museum, "Pounds, shillings and pence"';
const PX = 540, PY = 1030;

// groot pondteken of een L
const teken = (h, tekst, { x = PX, y = PY, g = 560, schaal = 1, op = 1, draai = 0, kleur } = {}) => op <= 0 ? '' :
  `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) rotate(${draai.toFixed(2)}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})"><text x="${x}" y="${y + g * 0.36}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${g}" fill="${kleur || h.K.signaal}">${tekst}</text></g>`;
// letter-tegel
const tegel = (h, x, y, l, sub, p, kleur) => p <= 0 ? '' : `<g filter="url(#schKlein)" transform="translate(${x} ${y}) scale(${(0.5 + 0.5 * p).toFixed(3)}) translate(${-x} ${-y})">`
  + `<rect x="${x - 120}" y="${y - 150}" width="240" height="300" rx="24" fill="${kleur || '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5"/>`
  + `<text x="${x}" y="${y + 50}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="180" fill="${kleur ? '#FFFFFF' : h.K.inkt}">${l}</text>`
  + (sub ? `<text x="${x}" y="${y + 200}" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}">${sub}</text>` : '') + '</g>';
// zilveren penning
const penning = (h, x, y, r, p = 1) => p <= 0 ? '' : `<g filter="url(#schKlein)" transform="translate(${x} ${y}) scale(${p.toFixed(3)}) translate(${-x} ${-y})"><circle cx="${x}" cy="${y}" r="${r}" fill="#C9CCD1" stroke="#8A8F98" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="none" stroke="#8A8F98" stroke-width="3"/><path d="M ${x - r * 0.4} ${y} h ${r * 0.8} M ${x} ${y - r * 0.4} v ${r * 0.8}" stroke="#8A8F98" stroke-width="6"/></g>`;
const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };

module.exports = {
  code: 'YS15',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-23-YS15-pondteken',
  nummer: 'No. 15',
  onderwerp: 'THE POUND SIGN',
  pakket: {
    dag: 'maandag 23 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'Why is the pound sign an L?',
    intro: 'The £ sign started as the letter L, for the Latin word libra. Old British money was written £ s d, and the s and d were Latin too.',
    feiten: ['The £ sign developed over the years from the letter L, the initial of the Latin word libra, meaning a pound of money.',
      'Old British money was counted in pounds, shillings and pence (£ s d); s and d stand for the Latin words solidus and denarius, originally Roman.',
      'A pound was 20 shillings or 240 pence.',
      'The system grew up in the Frankish kingdom and crossed into England quite early, perhaps in the seventh century.',
      'With the silver pennies of William I the weight became much more consistent; the pound as a unit of 240 pence has its origin there.',
      'Britain used this pre-decimal system up to 1971.'],
    bronnen: [['Royal Mint Museum, "Pounds, shillings and pence"', 'https://www.royalmintmuseum.org.uk/journal/history/pounds-shillings-and-pence/']],
    hashtags: '#Shorts #history #money #symbols',
    tags: 'pound sign, £ symbol, why is the pound sign an L, libra, pounds shillings and pence, £sd, British money history, decimalisation 1971, history of everyday things, why things are the way they are, shorts',
    md: [['Royal Mint Museum, "Pounds, shillings and pence"', 'https://www.royalmintmuseum.org.uk/journal/history/pounds-shillings-and-pence/',
      ['"the initial letter of the Latin word libra"; "the Latin word libra meaning a pound of money"', '"The £ sign developed over the years from the letter L"', 's en d: "these stand for the Latin words solidus and denarius, originally Roman"', '"a pound of 20 shillings or 240 pence"', '"grew up in the Frankish kingdom and crossed into England quite early, perhaps in the seventh century"', '"With the silver pennies of William I, however, the weight became much more consistent"; daar komt het pond van 240 pence vandaan', '"used in Britain up to 1971"']]],
    niet: '- Niet gezegd: "libra pondo", Karel de Grote, de datum van Decimal Day (15 februari 1971) en hoe de omschakeling ging (niet in deze bron). "600s" in beeld staat voor "perhaps in the seventh century". De penningen zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK: £ slaat neer
    { duur: 3.0, stem: "The pound sign is an L. In disguise.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => { const p = h.klem(h.t / 0.3);
        return teken(h, '£', { schaal: 2.2 - 1.2 * p * p, draai: (1 - p) * 16, op: h.klem(h.t / 0.08) })
          + h.kin('The £ sign is an *L*. In disguise.', { y: 300, g: 108, t: h.t, start: 0.4 }).svg; } },
    // 2 · L van libra
    { duur: 3.6, stem: "L for libra, the Latin word for a pound of money.", in: 'zweep', bron: RMM, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[0.9, 'pop', 0.8]],
      teken: h => h.kin('*L* for *libra*: the Latin word for a pound of money.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
        + teken(h, 'L', { kleur: h.K.inkt, schaal: h.veer((h.t - 0.8) / 0.35), op: h.klem((h.t - 0.8) / 0.15) }) },
    // 3 · de L wordt £
    { duur: 3.4, stem: "Over the years, that L became the pound sign.", in: 'op', bron: RMM, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.8] }, geluid: [[0.9, 'stijg', 0.5], [1.8, 'klap', 0.7], [1.8, 'ding', 0.5]],
      teken: h => { const m = h.zacht((h.t - 0.9) / 0.9);
        return h.kin('Over the years, that L *became £*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
          + teken(h, 'L', { kleur: h.K.inkt, op: 1 - m, schaal: 1 - 0.1 * m }) + teken(h, '£', { op: m, schaal: 0.9 + 0.1 * m }); } },
    // 4 · oud Brits geld: £ s d
    { duur: 3.2, stem: "Old British money was written as pounds, S, and D.", in: 'flits', bron: RMM, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'pop', 0.8, -0.4], [1.1, 'pop', 0.8, 0], [1.4, 'pop', 0.8, 0.4]],
      teken: h => h.kin('Old British money was written *£ s d*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
        + ['£', 's', 'd'].map((l, i) => tegel(h, 260 + i * 280, 1000, l, '', h.veer((h.t - 0.8 - i * 0.3) / 0.3), i === 0 ? h.K.signaal : null)).join('') },
    // 5 · s = solidus, d = denarius, oorspronkelijk Romeins
    { duur: 3.8, stem: "S for solidus, D for denarius. Both originally Roman.", in: 'zweep', bron: RMM, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.5], [1.6, 'pop', 0.7], [2.1, 'pop', 0.7]],
      teken: h => h.kin('*s* = solidus, *d* = denarius. Both originally *Roman*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
        + tegel(h, 340, 1000, 's', 'solidus', h.veer((h.t - 1.4) / 0.3)) + tegel(h, 740, 1000, 'd', 'denarius', h.veer((h.t - 1.9) / 0.3)) },
    // 6 · 1 pond = 20 shilling = 240 pence
    { duur: 3.8, stem: "One pound was twenty shillings, or two hundred and forty pence.", in: 'op', bron: RMM, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [2.4] }, geluid: [[0.9, 'tik', 0.8], [1.5, 'tik', 0.8], [2.3, 'klap', 0.7]],
      teken: h => { const n = Math.round(240 * h.uit((h.t - 1.5) / 0.8));
        return h.kin('One pound was *20 shillings*, or *240 pence*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
          + `<text x="540" y="900" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="110" fill="${h.K.inkt}" opacity="${h.klem((h.t - 0.8) / 0.2).toFixed(3)}">£1 = 20s</text>`
          + (h.t > 1.4 ? `<text x="540" y="1110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="150" fill="${h.K.signaal}">= ${n}d</text>` : ''); } },
    // 7 · het systeem kwam uit het Frankische rijk, in Engeland misschien al in de 7e eeuw
    { duur: 3.8, stem: "The system grew up in the Frankish kingdom, and reached England perhaps in the seventh century.", in: 'zweep', bron: RMM, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '600s') + h.kin('The system grew up in the *Frankish kingdom* and reached England perhaps in the 7th century.', { y: 830, g: 74, t: h.t, start: 0.45 }).svg },
    // 8 · Willem I: penningen met een vast gewicht; 240 penningen wogen maar af en toe echt een pond
    { duur: 4.0, stem: "Under William the First, silver pennies got a consistent weight. That is where the pound of two hundred and forty pence comes from.", in: 'op', bron: RMM, bronStart: 2.6, camera: { zoom: [1.05, 1.0] }, geluid: [0, 1, 2, 3, 4, 5].map(i => [1.0 + i * 0.15, 'tik', 0.6]),
      teken: h => h.kin('Under *William I*, silver pennies got a consistent weight. That is where the 240-penny pound comes from.', { y: 300, g: 76, t: h.t, start: 0.05 }).svg
        + [0, 1, 2, 3, 4, 5].map(i => penning(h, 290 + (i % 3) * 250, 960 + Math.floor(i / 3) * 230, 95, h.veer((h.t - 1.0 - i * 0.15) / 0.3))).join('') },
    // 9 · zo rekende Groot-Brittannië tot 1971
    { duur: 3.4, stem: "Britain counted like this until 1971.", in: 'masker', nacht: true, bron: RMM, bronStart: 2.0, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('Britain counted like this until *1971*.', { y: 330, g: 104, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + `<text x="540" y="1060" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="140" fill="${h.K.geel}" opacity="${h.klem((h.t - 1.2) / 0.3).toFixed(3)}">£ s d</text>`
        + `<line x1="300" y1="1020" x2="${300 + 480 * h.uit((h.t - 1.8) / 0.4)}" y2="1020" stroke="#F3F0E8" stroke-width="12" opacity="${h.klem((h.t - 1.8) / 0.1).toFixed(3)}"/>` },
    // 10 · slot: weer het grote £; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "Every pound sign you see: an L, for libra.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => teken(h, '£')
        + h.kin('Every £ you see: an L for *libra*.', { y: 300, g: 104, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
