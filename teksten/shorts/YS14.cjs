// YS14 — The world's first traffic light exploded.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks A · Signs & Symbols.
// Bronnen (gelezen 2 nov 2026): PA Media, "Ready, steady, go: 150 years since world's first traffic light in London"
// (dec 2018, via Yahoo News UK); History Hit, "Where Were the World's First Traffic Lights?". Elke bewering staat in een
// van die twee; zie pakketten/<map>/bron/bronnen.md. De bronnen verschillen over 9 of 10 december en over of de agent
// stierf: de video zegt "December 1868" en "seriously burned". Niet gezegd: wat rood en groen precies betekenden.
const PA = 'PA Media (2018), via Yahoo News UK';
const HH = 'History Hit, "Where Were the World\'s First Traffic Lights?"';
const BEIDE = 'PA Media (2018); History Hit';

// het eerste verkeerslicht: zuil, lamp bovenop, twee seinarmen; arm = 0 (omlaag) .. 1 (horizontaal); lamp = 'rood' | 'groen' | ''
const paal = (h, x, y, { arm = 0, lamp = '', schaal = 1, op = 1, nacht = false } = {}) => {
  if (schaal < 0.02) return '';   // filter op een element van schaal 0 laat resvg crashen
  const a = -60 * (1 - arm);
  const kleur = lamp === 'rood' ? h.K.signaal : lamp === 'groen' ? '#3FBF6A' : '#C9C6BC';
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) scale(${(0.8 * schaal).toFixed(3)})">`
    + `<rect x="-24" y="-420" width="48" height="560" fill="${nacht ? '#4A4F63' : '#3B3F4A'}"/><rect x="-60" y="130" width="120" height="40" fill="${nacht ? '#4A4F63' : '#3B3F4A'}"/>`
    + `<rect x="-200" y="-400" width="176" height="26" fill="${h.K.signaal}" transform="rotate(${-a} -24 -387)"/>`
    + `<rect x="24" y="-400" width="176" height="26" fill="${h.K.signaal}" transform="rotate(${a} 24 -387)"/>`
    + `<rect x="-40" y="-500" width="80" height="80" rx="10" fill="#2D3140"/>`
    + (lamp ? `<circle cx="0" cy="-460" r="60" fill="${kleur}" opacity="0.35"/>` : '')
    + `<circle cx="0" cy="-460" r="26" fill="${kleur}"/><path d="M -46 -500 L 0 -540 L 46 -500 Z" fill="#2D3140"/></g>`;
};
// spoorsein: paal met één arm en een lamp
const spoorsein = (h, x, y, arm = 1) => `<g filter="url(#sch)"><rect x="${x - 14}" y="${y - 360}" width="28" height="400" fill="#3B3F4A"/>`
  + `<rect x="${x}" y="${y - 350}" width="180" height="34" fill="${h.K.signaal}" transform="rotate(${-40 * (1 - arm)} ${x} ${y - 333})"/><rect x="${x + 150}" y="${y - 350}" width="12" height="34" fill="#FFFFFF" transform="rotate(${-40 * (1 - arm)} ${x} ${y - 333})"/>`
  + `<circle cx="${x - 40}" cy="${y - 300}" r="20" fill="${h.K.signaal}"/><circle cx="${x - 40}" cy="${y - 250}" r="20" fill="#3FBF6A"/></g>`
  + `<line x1="${x - 200}" y1="${y + 40}" x2="${x + 260}" y2="${y + 40}" stroke="#6B4E32" stroke-width="16"/><line x1="${x - 200}" y1="${y + 70}" x2="${x + 260}" y2="${y + 70}" stroke="#6B4E32" stroke-width="16"/>`;
// groot jaartal
const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// scherven bij de ontploffing
const scherven = (h, x, y, t) => {
  if (t <= 0 || t > 1.2) return '';
  let s = `<circle cx="${x}" cy="${y}" r="${(40 + 380 * h.uit(t / 0.4)).toFixed(1)}" fill="${h.K.geel}" opacity="${(0.9 * (1 - h.klem(t / 0.6))).toFixed(3)}"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + 0.3, d = 420 * h.uit(t / 0.8);
    s += `<rect x="${(x + Math.cos(a) * d - 12).toFixed(1)}" y="${(y + Math.sin(a) * d - 12).toFixed(1)}" width="24" height="24" fill="${i % 2 ? '#2D3140' : h.K.signaal}" opacity="${(1 - h.klem((t - 0.5) / 0.7)).toFixed(3)}" transform="rotate(${(i * 40 + t * 400).toFixed(0)} ${(x + Math.cos(a) * d).toFixed(1)} ${(y + Math.sin(a) * d).toFixed(1)})"/>`; }
  return s;
};

module.exports = {
  code: 'YS14',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-22-YS14-verkeerslicht',
  nummer: 'No. 14',
  onderwerp: 'TRAFFIC LIGHTS',
  scenes: [
    // 1 · HAAK: het licht staat er, en ontploft
    { duur: 3.2, stem: "The world's first traffic light exploded.", camera: { zoom: [1, 1.04], stoot: [0.7], schud: [0.7] }, geluid: [[0.1, 'tik', 0.6], [0.68, 'klap'], [0.68, 'boem', 1.0]],
      teken: h => (h.t < 0.75 ? paal(h, 540, 1140, { lamp: Math.floor(h.t * 8) % 2 ? 'rood' : 'groen' }) : paal(h, 540, 1140, { op: 0.25 }))
        + scherven(h, 540, 1140 - 460 * 0.8, h.t - 0.7)
        + h.kin('The world\'s first traffic light *exploded*.', { y: 300, g: 104, t: h.t, start: 0.75 }).svg },
    // 2 · december 1868, Londen, bij het parlement
    { duur: 3.6, stem: "December 1868. London, outside the Houses of Parliament, in Westminster.", in: 'zweep', bron: BEIDE, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1868') + h.kin('*December*, London. Outside the Houses of Parliament, in Westminster.', { y: 830, g: 76, t: h.t, start: 0.45 }).svg },
    // 3 · ontworpen door J P Knight, een ingenieur voor spoorwegseinen
    { duur: 3.6, stem: "It was designed by J-P Knight, a railway signalling engineer.", in: 'op', bron: HH, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'rol', 0.5], [1.8, 'klap', 0.6]],
      teken: h => h.kin('Designed by J P Knight, a *railway signalling* engineer.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
        + spoorsein(h, 480, 1180, h.zacht((h.t - 1.2) / 0.6)) },
    // 4 · het idee: van het spoor naar de weg
    { duur: 3.6, stem: "He took the idea from railway signals, onto the road.", in: 'zweep', bron: PA, bronStart: 2.2, camera: { zoom: [1, 1.05], pan: [[20, 0], [-20, 0]] }, geluid: [[1.0, 'whoosh', 0.5], [1.7, 'pop', 0.8]],
      teken: h => {
        const p = h.uit((h.t - 0.9) / 0.8);
        return h.kin('He took the idea from *railway signals* onto the road.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
          + `<g transform="translate(-60 0) scale(0.7) translate(80 520)">${spoorsein(h, 300, 1180, 1)}</g>`
          + `<path d="M 420 1000 L ${420 + 220 * p} 1000" stroke="${h.K.inkt}" stroke-width="12" stroke-linecap="round"/>` + (p > 0.95 ? `<path d="M 640 1000 l -40 -30 v 60 Z" fill="${h.K.inkt}"/>` : '')
          + paal(h, 820, 1210, { schaal: 0.62 * h.veer((h.t - 1.6) / 0.35), arm: 1 });
      } },
    // 5 · overdag: seinarmen
    { duur: 3.4, stem: "By day: semaphore arms.", in: 'op', bron: HH, bronStart: 2.0, camera: { zoom: [1, 1.06] }, geluid: [[1.0, 'tik', 0.8], [1.8, 'tik', 0.8], [2.6, 'tik', 0.8]],
      teken: h => h.kin('By day: *semaphore arms*.', { y: 300, g: 110, t: h.t, start: 0.05 }).svg
        + paal(h, 540, 1140, { arm: Math.floor((h.t - 0.6) / 0.8) % 2 === 0 && h.t > 0.6 ? 1 : 0 }) },
    // 6 · 's nachts: rode en groene gaslampen
    { duur: 3.6, stem: "At night: red and green gas lamps.", in: 'masker', nacht: true, bron: HH, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[1.0, 'ding', 0.5], [2.0, 'ding', 0.5, 0.3]],
      teken: h => h.kin('At night: *red* and *green* gas lamps.', { y: 330, g: 110, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + paal(h, 540, 1160, { nacht: true, lamp: h.t < 1.0 ? '' : h.t < 2.0 ? 'rood' : 'groen' }) },
    // 7 · bediend door een politieagent
    { duur: 3.2, stem: "All of it operated by a police constable.", in: 'zweep', bron: HH, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.6]],
      teken: h => h.kin('All of it operated by a *police constable*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
        + paal(h, 540, 1140, { arm: h.zacht((h.t - 0.9) / 0.6) }) },
    // 8 · een gaslek: de lamp ontplofte (rustig, zonder speelse geluiden)
    { duur: 3.8, stem: "Then a leak in the gas line made it explode. The policeman on duty was seriously burned.", in: 'masker', nacht: true, bron: BEIDE, bronStart: 2.4, camera: { zoom: [1.04, 1.0], stoot: [1.2] }, geluid: [[1.18, 'boem', 0.6]],
      teken: h => h.kin('Then a leak in the gas line made it *explode*. The policeman on duty was *seriously burned*.', { y: 330, g: 80, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + paal(h, 540, 1190, { nacht: true, op: h.t < 1.2 ? 1 : 0.3, schaal: 0.8 }) + scherven(h, 540, 1190 - 460 * 0.64, h.t - 1.2) },
    // 9 · meer dan 40 jaar geen verkeerslichten in het VK
    { duur: 3.6, stem: "For more than forty years, the U-K had no traffic lights. Electric signals spread in London around 1929.", in: 'zweep', bron: PA, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '40+') + h.kin('years without traffic lights in the UK. Electric signals spread in London around *1929*.', { y: 830, g: 76, t: h.t, start: 0.45 }).svg },
    // 10 · slot: het licht staat er weer; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "The first traffic light. An idea from the railways.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => paal(h, 540, 1140, { lamp: 'groen' })
        + h.kin('The first traffic light: an idea from the *railways*.', { y: 300, g: 96, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
