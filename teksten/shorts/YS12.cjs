// YS12 — Why is the emergency number 999? It started with a fire.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks B · Who Decided?
// Bron (gelezen 2 nov 2026): Greater London Authority, City Hall blog, "999 celebrates its 77th birthday". Elke bewering
// staat daarin; zie pakketten/<map>/bron/bronnen.md. Niet gezegd: waarom juist 9-9-9 (de bron zegt alleen "easy to
// remember"), 112 of 911. De brand is ernstig: scène 2 is rustig, zonder speelse geluiden.
const GLA = 'Greater London Authority, "999 celebrates its 77th birthday"';

// draaischijf; draai = graden waarover de schijf gedraaid is
const schijf = (h, cx, cy, r, { draai = 0, op = 1, schaal = 1, licht = -1 } = {}) => {
  const cijfers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  let gaten = '';
  cijfers.forEach((c, i) => {
    const a = (60 + i * 28) * Math.PI / 180, x = cx + Math.cos(a) * r * 0.72, y = cy - Math.sin(a) * r * 0.72;
    gaten += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r * 0.15}" fill="${i === licht ? h.K.signaal : '#F3F0E8'}" stroke="${h.K.inkt}" stroke-width="4"/>`
      + `<text x="${x.toFixed(1)}" y="${(y + r * 0.07).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(r * 0.17).toFixed(0)}" fill="${i === licht ? '#FFFFFF' : h.K.inkt}" transform="rotate(${-draai} ${x.toFixed(1)} ${y.toFixed(1)})">${c}</text>`;
  });
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${cx} ${cy}) scale(${schaal.toFixed(4)}) translate(${-cx} ${-cy})">`
    + `<circle cx="${cx}" cy="${cy}" r="${r * 1.06}" fill="${h.K.inkt}"/>`
    + `<g transform="rotate(${draai.toFixed(2)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#2D3140"/>${gaten}</g>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * 0.36}" fill="#F3F0E8" stroke="${h.K.inkt}" stroke-width="4"/>`
    + `<text x="${cx}" y="${cy + r * 0.11}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(r * 0.3).toFixed(0)}" fill="${h.K.signaal}">999</text>`
    + `<path d="M ${cx + r * 0.86} ${cy + r * 0.40} l ${r * 0.20} ${r * 0.09}" stroke="#C9C6BC" stroke-width="12" stroke-linecap="round"/></g>`;
};
// drie keer een 9 draaien: schijf draait heen (0.35 s) en terug (0.45 s), per cijfer 0.8 s
const draaiNegen = t => { const k = t % 0.8; return k < 0.35 ? 309 * h_uit(k / 0.35) : 309 * (1 - (k - 0.35) / 0.45); };
const h_uit = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
// grote cijfers / jaartal
const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };

module.exports = {
  code: 'YS12',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-20-YS12-alarmnummer',
  nummer: 'No. 12',
  onderwerp: 'EMERGENCY NUMBER 999',
  scenes: [
    // 1 · HAAK: de schijf draait drie keer een 9
    { duur: 3.2, stem: "The world's first emergency number started with a fire.", camera: { zoom: [1, 1.04], stoot: [0.1] }, geluid: [[0.05, 'rol', 0.7], [0.4, 'tik', 0.9], [0.85, 'rol', 0.7], [1.2, 'tik', 0.9], [1.65, 'rol', 0.7], [2.0, 'tik', 0.9], [2.2, 'boem', 0.6]],
      teken: h => schijf(h, 540, 1020, 300, { draai: h.t < 2.4 ? draaiNegen(h.t) : 0, licht: 8, schaal: 0.9 + 0.1 * h.veer(h.t / 0.3) })
        + h.kin('The world\'s first emergency number started with a *fire*.', { y: 300, g: 92, t: h.t, start: 0.1 }).svg },
    // 2 · november 1935, Wimpole Street: vijf vrouwen komen om (rustig)
    { duur: 4.0, stem: "November 1935. Wimpole Street, London. A fire kills five women.", in: 'masker', nacht: true, bron: GLA, bronStart: 2.4, camera: { zoom: [1.04, 1.0] }, geluid: [[0.4, 'whoosh', 0.3]],
      teken: h => {
        let s = h.kin('*November 1935*, Wimpole Street, London. A fire kills *five women*.', { y: 330, g: 86, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg;
        s += `<rect x="260" y="820" width="560" height="460" fill="#2A2E3D"/>`;
        for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
          const flk = 0.55 + 0.35 * Math.sin(h.t * 7 + r * 1.7 + k * 2.3), aan = (r + k) % 3 !== 0;
          s += `<rect x="${300 + k * 130}" y="${860 + r * 105}" width="80" height="70" fill="${aan ? '#E8833A' : '#3A3F52'}" opacity="${aan ? (flk * h.klem((h.t - 1.0) / 0.8)).toFixed(3) : 1}"/>`;
        }
        return s;
      } },
    // 3 · de evaluatie leidt tot het Belgrave Committee
    { duur: 3.6, stem: "A review of the fire leads to the Belgrave Committee.", in: 'zweep', bron: GLA, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.58, 'klap', 0.7], [1.6, 'boem', 0.4]],
      teken: h => {
        const st = h.veer((h.t - 1.5) / 0.25);
        return h.kin('A review of the fire leads to the *Belgrave Committee*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg
          + `<g filter="url(#sch)" transform="rotate(-3 540 1040)"><rect x="300" y="780" width="480" height="520" fill="#FFFDF7" stroke="${h.K.inkt}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="350" y1="${860 + i * 60}" x2="${i === 5 ? 560 : 730}" y2="${860 + i * 60}" stroke="${h.K.grijs}" stroke-width="8"/>`).join('')}</g>`
          + (st > 0 ? `<g transform="translate(560 1180) rotate(-12) scale(${(1.6 - 0.6 * st).toFixed(3)}) translate(-560 -1180)" opacity="${h.klem(st * 2).toFixed(3)}"><rect x="400" y="1130" width="320" height="100" rx="10" fill="none" stroke="${h.K.signaal}" stroke-width="8"/><text x="560" y="1200" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="${h.K.signaal}">REVIEW</text></g>` : '');
      } },
    // 4 · de opdracht: telefonisten moeten noodoproepen herkennen; één lampje op het schakelbord
    { duur: 3.6, stem: "Its question: how can operators identify emergency calls?", in: 'op', bron: GLA, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'ding', 0.6]],
      teken: h => {
        let s = h.kin('Its question: how can operators *identify emergency calls*?', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
          + `<g filter="url(#sch)"><rect x="160" y="800" width="760" height="460" rx="16" fill="#5A4632"/></g>`;
        for (let r = 0; r < 5; r++) for (let k = 0; k < 8; k++) {
          const nood = r === 2 && k === 5 && h.t > 1.4 && Math.floor(h.t * 5) % 2 === 0;
          s += `<circle cx="${220 + k * 92}" cy="${860 + r * 86}" r="22" fill="${nood ? h.K.signaal : '#1E1E22'}" stroke="#C9B26A" stroke-width="4"/>`;
        }
        return s;
      } },
    // 5 · het advies: één nummer voor alle hulpdiensten
    { duur: 3.4, stem: "Its advice: one number for all the emergency services.", in: 'zweep', bron: GLA, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.7] }, geluid: [[1.0, 'whoosh', 0.4], [1.7, 'klap', 0.7]],
      teken: h => {
        const m = h.zacht((h.t - 0.9) / 0.8);
        let s = h.kin('Its advice: *one number* for all the emergency services.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg;
        [[-260, h.K.signaal], [0, '#2A5DB0'], [260, h.K.groen]].forEach(([dx, kl]) => { s += `<circle cx="${540 + dx * (1 - m)}" cy="1040" r="${110 - 20 * m}" fill="${kl}" opacity="${(1 - 0.6 * m).toFixed(3)}" filter="url(#schKlein)"/>`; });
        if (m > 0.9) s += `<circle cx="540" cy="1040" r="90" fill="${h.K.signaal}" opacity="${h.klem((m - 0.9) * 10).toFixed(3)}" filter="url(#schKlein)"/><text x="540" y="1110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="200" fill="#FFFFFF" opacity="${h.klem((m - 0.9) * 10).toFixed(3)}">1</text>`;
        return s;
      } },
    // 6 · makkelijk te onthouden
    { duur: 3.0, stem: "And it must be easy to remember.", in: 'op', bron: GLA, bronStart: 1.8, camera: { zoom: [1.05, 1.0] }, geluid: [[1.2, 'pop', 0.8]],
      teken: h => h.kin('And it must be *easy to remember*.', { y: 420, g: 110, t: h.t, start: 0.05, nadruk: 'balk' }).svg
        + `<g opacity="${h.klem((h.t - 1.1) / 0.3).toFixed(3)}" filter="url(#schKlein)"><circle cx="540" cy="1050" r="150" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="6"/><text x="540" y="1110" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="170" fill="${h.K.signaal}">?</text></g>` },
    // 7 · het antwoord: 999
    { duur: 3.0, stem: "The answer: nine, nine, nine.", in: 'flits', bron: GLA, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => h.kin('The answer:', { y: 330, g: 100, t: h.t, start: 0.05 }).svg + groot(h, '999', 1080, 380) },
    // 8 · 30 juni 1937: de eerste 999-oproep ter wereld
    { duur: 3.8, stem: "June thirtieth, 1937. The first ever nine nine nine call, in London. The first of its kind in the world.", in: 'zweep', bron: GLA, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [2.0, 'ding', 0.5]],
      teken: h => groot(h, '1937') + h.kin('*30 June*: the first ever 999 call, in London. The first of its kind in the world.', { y: 830, g: 76, t: h.t, start: 0.45 }).svg },
    // 9 · eerste week: 1.336 oproepen (teller)
    { duur: 3.4, stem: "In the first week: one thousand, three hundred and thirty-six calls.", in: 'op', bron: GLA, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [2.0] }, geluid: [[0.6, 'rol', 0.6], [1.1, 'rol', 0.6], [2.0, 'klap', 0.7], [2.0, 'ding', 0.5]],
      teken: h => {
        const n = Math.round(1336 * h.uit((h.t - 0.5) / 1.5));
        return h.kin('In the *first week*:', { y: 330, g: 100, t: h.t, start: 0.05 }).svg
          + `<text x="540" y="1060" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="230" fill="${h.K.signaal}">${n.toLocaleString('en-US')}</text>`
          + `<text x="540" y="1180" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="80" fill="${h.K.inkt}" opacity="${h.klem((h.t - 2.0) / 0.3).toFixed(3)}">calls</text>`;
      } },
    // 10 · slot: de draaischijf; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "One fire. One number, easy to remember. Nine, nine, nine.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => schijf(h, 540, 1020, 300, { licht: 8 })
        + h.kin('One fire. One number, easy to remember: *999*.', { y: 300, g: 96, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
