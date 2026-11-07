// YS21 — Why train tracks are 4 feet 8½ inches apart.
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Douglas Puffert (University of Warwick), "Path Dependence", EH.net Encyclopedia
// (2008); Network Rail, "George Stephenson (1781–1848)"; Railway Regulation (Gauge) Act 1846 (Irish Statute Book).
// Britannica (plan-bron) gaf een 403. Niet gezegd: Killingworth (daar was het eerst 4 ft 8 in), een exact percentage
// ("more than half" volgens Puffert), het verhaal over Romeinse wagens (geen bron).
const EH = 'D. Puffert, "Path Dependence", EH.net Encyclopedia';
const NR = 'Network Rail, "George Stephenson (1781–1848)"';
const WET = 'Railway Regulation (Gauge) Act 1846';

const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// spoor in perspectief met maatlijn; p = 0..1 hoe ver de rails getekend zijn
const spoor = (h, { p = 1, maat = 1, label = '4\' 8½"', y0 = 1340, y1 = 760 } = {}) => {
  const lx0 = 330, rx0 = 750, lx1 = 500, rx1 = 580, yy = y0 - (y0 - y1) * p;
  const f = (a, b) => a + (b - a) * p;
  let s = '';
  for (let i = 0; i < 9; i++) { const q = i / 9; if (q > p) break; const y = y0 - (y0 - y1) * q, sp = 1 - q * 0.8;
    s += `<rect x="${(540 - 260 * sp).toFixed(1)}" y="${y.toFixed(1)}" width="${(520 * sp).toFixed(1)}" height="${(22 * sp).toFixed(1)}" fill="#8C6B4A"/>`; }
  s += `<line x1="${lx0}" y1="${y0}" x2="${f(lx0, lx1).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${h.K.inkt}" stroke-width="16"/><line x1="${rx0}" y1="${y0}" x2="${f(rx0, rx1).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${h.K.inkt}" stroke-width="16"/>`;
  if (maat > 0) s += `<g opacity="${maat.toFixed(3)}"><line x1="${lx0}" y1="${y0 - 70}" x2="${rx0}" y2="${y0 - 70}" stroke="${h.K.signaal}" stroke-width="8"/><polygon points="${lx0},${y0 - 70} ${lx0 + 30},${y0 - 88} ${lx0 + 30},${y0 - 52}" fill="${h.K.signaal}"/><polygon points="${rx0},${y0 - 70} ${rx0 - 30},${y0 - 88} ${rx0 - 30},${y0 - 52}" fill="${h.K.signaal}"/>`
    + `<rect x="420" y="${y0 - 140}" width="240" height="60" rx="10" fill="${h.K.papier}"/><text x="540" y="${y0 - 94}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="${h.K.signaal}">${label}</text></g>`;
  return s;
};
// kolenwagentje op een houten baan
const wagen = (h, x = 540, y = 1080, op = 1) => `<g opacity="${op.toFixed(3)}" filter="url(#sch)"><polygon points="${x - 190},${y - 140} ${x + 190},${y - 140} ${x + 150},${y + 40} ${x - 150},${y + 40}" fill="#7A5A3A" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 7 }, (_, i) => `<circle cx="${x - 130 + i * 43}" cy="${y - 150 - (i % 2) * 18}" r="30" fill="#2B2B2E"/>`).join('')
  + `<circle cx="${x - 100}" cy="${y + 70}" r="44" fill="${h.K.inkt}"/><circle cx="${x + 100}" cy="${y + 70}" r="44" fill="${h.K.inkt}"/><circle cx="${x - 100}" cy="${y + 70}" r="14" fill="${h.K.papier}"/><circle cx="${x + 100}" cy="${y + 70}" r="14" fill="${h.K.papier}"/>`
  + `<rect x="${x - 300}" y="${y + 112}" width="600" height="20" fill="#8C6B4A"/></g>`;
// wereldbol-schijf, gevuld tot `deel`
const helft = (h, deel, x = 540, y = 1060, r = 230) => { const a = deel * Math.PI * 2, ex = x + r * Math.sin(a), ey = y - r * Math.cos(a);
  return `<g filter="url(#sch)"><circle cx="${x}" cy="${y}" r="${r}" fill="#D7D1C3"/>${deel > 0 ? `<path d="M ${x} ${y} L ${x} ${y - r} A ${r} ${r} 0 ${deel > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="${h.K.signaal}"/>` : ''}</g>`; };

module.exports = {
  code: 'YS21',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-27-YS21-spoorbreedte',
  nummer: 'No. 21',
  onderwerp: 'RAIL GAUGE',
  pakket: {
    dag: 'vrijdag 27 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why are train tracks exactly 4 feet 8½ inches apart?',
    intro: 'More than half of the world\'s railway routes use a strange number: 4 feet 8½ inches, or 1,435 mm. It comes from the coal tramways of northern England.',
    feiten: ['Four feet 8-1/2 inches (1.435 meters) is the standard gauge in North America, much of Europe, and on over half of the world\'s railway routes.',
      'Early trackways for horse and cart used a dimension of around 4 ft 8 in; by the time George Stephenson designed his railways, it was a well recognised measure.',
      'Stephenson had used the gauge on an older system of coal tramways serving mines near Newcastle, England.',
      'The Liverpool & Manchester Railway, the first intercity railway in the world, opened on September 15, 1830.',
      '1846: the Railway Regulation (Gauge) Act made 4 ft 8½ in the rule for new passenger railways in Great Britain, and 5 ft 3 in in Ireland.'],
    bronnen: [['Douglas Puffert, "Path Dependence", EH.net Encyclopedia (2008)', 'https://eh.net/encyclopedia/path-dependence/'],
      ['Network Rail, "George Stephenson (1781–1848)"', 'https://www.networkrail.co.uk/who-we-are/our-history/eminent-engineers/george-stephenson/'],
      ['Railway Regulation (Gauge) Act 1846, Irish Statute Book', 'https://www.irishstatutebook.ie/eli/1846/act/57/enacted/en/print.html']],
    hashtags: '#Shorts #history #trains #railways',
    tags: 'standard gauge, rail gauge, why are train tracks 4 feet 8.5 inches, 1435 mm, George Stephenson, Liverpool and Manchester Railway, Gauge Act 1846, railway history, history of everyday things, why things are the way they are, shorts',
    md: [['Douglas Puffert (University of Warwick), "Path Dependence", EH.net Encyclopedia (10 feb 2008)', 'https://eh.net/encyclopedia/path-dependence/',
      ['"Four feet 8-1/2 inches (1.435 meters) is the standard gauge for railways throughout North America, in much of Europe," … "and altogether on over half of the world\'s railway routes."', '"The \'father of railways,\' British engineer George Stephenson, had experience using the gauge on an older system" … "of primitive coal tramways serving a small group of mines near Newcastle, England."']],
      ['Network Rail, "George Stephenson (1781–1848)"', 'https://www.networkrail.co.uk/who-we-are/our-history/eminent-engineers/george-stephenson/',
      ['"Early trackways for use by horse and cart used a dimension of around 4ft 8in, By the time Stephenson was designing the S&DR and the L&MR this dimension was already a well recognised measure."', '"The Liverpool & Manchester Railway, the first intercity railway in the world, opened on September 15, 1830"']],
      ['Railway Regulation (Gauge) Act 1846 (Irish Statute Book, Office of the Attorney General)', 'https://www.irishstatutebook.ie/eli/1846/act/57/enacted/en/print.html',
      ['"An Act for regulating the Gauge of Railways. [18th August 1846.]"', '"It shall not be lawful (except as herein-after excepted) to construct any railway for the conveyance of passengers on any gauge other than four feet eight inches and half an inch in Great Britain, and five feet three inches in Ireland"']]],
    niet: '- Britannica (plan-bron) gaf op 7 nov een 403. Niet gezegd: Killingworth (daar lag eerst 4 ft 8 in; de halve duim kwam later), een exact percentage (Puffert: "over half"), het verhaal over Romeinse strijdwagens (geen bron), en dat de wet ook bestaande lijnen omzette (hij gold voor nieuwe passagierslijnen; bestaand breedspoor bleef). Spoor, wagen en schijf zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK: de maat slaat neer
    { duur: 3.6, stem: "Most train tracks are four feet, eight and a half inches apart. Why such a strange number?", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => spoor(h, { p: 1, maat: h.klem((h.t - 0.2) / 0.3) }) + h.kin('Most train tracks are *4 feet 8½ inches* apart. Why?', { y: 300, g: 96, t: h.t, start: 0.4 }).svg },
    // 2 · meer dan de helft van de wereld
    { duur: 3.6, stem: "That's one thousand four hundred and thirty-five millimetres, on more than half of the world's railway routes.", in: 'zweep', bron: EH, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.8] }, geluid: [[0.6, 'rol', 0.6], [1.8, 'ding', 0.6]],
      teken: h => helft(h, 0.55 * h.zacht((h.t - 0.5) / 1.2)) + h.kin('*1,435 mm*, on more than half of the world\'s railway routes.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg },
    // 3 · paard en wagen: ongeveer 4 ft 8 in
    { duur: 3.8, stem: "It starts with old trackways for horse and cart, about four feet eight inches wide.", in: 'op', bron: NR, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.6]],
      teken: h => wagen(h, 540 - (1 - h.zacht((h.t - 0.3) / 1.0)) * 300, 1080) + h.kin('Old trackways for *horse and cart*: about 4 feet 8 inches.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg },
    // 4 · Stephenson en de kolenbanen bij Newcastle
    { duur: 3.8, stem: "George Stephenson knew that gauge from coal tramways near Newcastle.", in: 'zweep', bron: EH, bronStart: 2.4, camera: { zoom: [1, 1.06] }, geluid: [[1.2, 'rol', 0.5], [2.0, 'klap', 0.5]],
      teken: h => wagen(h, 540, 1080) + h.kin('*George Stephenson* knew that gauge from coal tramways near *Newcastle*.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg },
    // 5 · 1830: Liverpool & Manchester
    { duur: 4.0, stem: "1830. His Liverpool and Manchester Railway opens: the first intercity railway in the world.", in: 'op', bron: NR, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.4, 'rol', 0.5]],
      teken: h => groot(h, '1830', 720, 250) + spoor(h, { p: h.zacht((h.t - 0.8) / 1.2), maat: 0, y0: 1290, y1: 1060 })
        + h.kin('Liverpool & Manchester: the first *intercity railway* in the world.', { y: 770, g: 64, t: h.t, start: 0.45 }).svg },
    // 6 · 1846: de wet
    { duur: 4.2, stem: "1846. A British law: new passenger railways in Great Britain must use four feet, eight and a half inches.", in: 'zweep', bron: WET, bronStart: 2.6, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [2.6, 'ding', 0.5]],
      teken: h => groot(h, '1846', 720, 250) + h.kin('A British law: new passenger railways must use *4 feet 8½*.', { y: 800, g: 76, t: h.t, start: 0.45 }).svg },
    // 7 · Ierland kreeg een ander getal
    { duur: 3.4, stem: "Ireland got a different number: five feet three.", in: 'flits', bron: WET, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.4] }, geluid: [[1.4, 'pop', 0.8]],
      teken: h => spoor(h, { maat: h.klem((h.t - 1.2) / 0.3), label: '5\' 3"', y0: 1270, y1: 720 }) + h.kin('Ireland got a different number: *5 feet 3*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 8 · vandaag: Noord-Amerika en veel van Europa
    { duur: 3.6, stem: "Today it runs across North America and much of Europe.", in: 'masker', nacht: true, bron: EH, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.6]],
      teken: h => helft(h, 0.55) + h.kin('Today: *North America* and much of *Europe*.', { y: 330, g: 96, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 9 · slot
    { duur: 3.6, stem: "A coal-wagon width, still under your train.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => spoor(h)
        + h.kin('A coal-wagon width, *still under your train*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1180" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
