// YS17 — Non-stick pans started with a gas cylinder that seemed empty.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks C · Happy Accidents.
// Bron (gelezen 4 nov 2026): Science History Institute, "Roy J. Plunkett". Elke bewering staat daarin; zie
// pakketten/<map>/bron/bronnen.md. Niet gezegd: de dag (6 april), de naam van de helper, het jaar van de eerste pan.
const SHI = 'Science History Institute, "Roy J. Plunkett"';

// gasfles; open = 0..1 (kraan open), doorsnede = 0..1 (opengezaagd, wit poeder zichtbaar)
const fles = (h, x, y, { open = 0, doorsnede = 0, schaal = 1 } = {}) => {
  let s = `<rect x="${x - 90}" y="${y - 260}" width="180" height="480" rx="80" fill="#5E7A92" stroke="${h.K.inkt}" stroke-width="6"/>`
    + `<rect x="${x - 30}" y="${y - 320}" width="60" height="70" fill="#8A8F98" stroke="${h.K.inkt}" stroke-width="5"/>`
    + `<rect x="${x - 70}" y="${y - 345}" width="140" height="30" rx="10" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="5" transform="rotate(${(open * 80).toFixed(1)} ${x} ${y - 330})"/>`
    + `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="56" fill="#FFFFFF">TFE</text>`;
  if (doorsnede > 0) s += `<g opacity="${doorsnede.toFixed(3)}"><rect x="${x - 70}" y="${y - 200}" width="140" height="380" rx="60" fill="#2A2E3D"/>`
    + Array.from({ length: 26 }, (_, i) => `<circle cx="${x - 55 + (i * 37) % 110}" cy="${y + 160 - Math.floor(i / 3) * 14 - (i % 2) * 6}" r="${8 + (i % 3) * 3}" fill="#F7F5EE"/>`).join('') + '</g>';
  return `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${schaal.toFixed(3)}) translate(${-x} ${-y})">${s}</g>`;
};
// pan met een glijdend ei
const pan = (h, x, y, ei = 0) => `<g filter="url(#sch)"><rect x="${x + 230}" y="${y - 22}" width="300" height="44" rx="22" fill="${h.K.inkt}"/><ellipse cx="${x}" cy="${y}" rx="260" ry="90" fill="#2D3140"/><ellipse cx="${x}" cy="${y - 8}" rx="230" ry="72" fill="#3B3F4A"/></g>`
  + `<g transform="translate(${(x - 90 + ei * 180).toFixed(1)} ${y - 10})"><ellipse rx="95" ry="40" fill="#FFFFFF"/><circle cx="10" cy="-6" r="30" fill="${h.K.geel}"/></g>`;
// weegschaal
const schaal = (h, x, y, gewicht) => `<g filter="url(#sch)"><rect x="${x - 200}" y="${y}" width="400" height="120" rx="16" fill="#C9C6BC" stroke="${h.K.inkt}" stroke-width="5"/><rect x="${x - 120}" y="${y + 30}" width="240" height="60" rx="8" fill="#1B1E2B"/><text x="${x}" y="${y + 76}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="#7CE38B">${gewicht}</text></g>`;

module.exports = {
  code: 'YS17',
  versie: 2,
  map: '2026-11-25-YS17-antiaanbak',
  nummer: 'No. 17',
  onderwerp: 'NON-STICK',
  pakket: {
    dag: 'woensdag 25 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'Non-stick pans started with a gas cylinder that seemed empty',
    intro: 'In 1938 a chemist opened a cylinder of gas and nothing came out. It still weighed the same. Inside was the slippery powder later called Teflon.',
    feiten: ['Roy J. Plunkett discovered Teflon at the DuPont Company\'s Jackson Laboratory in 1938.',
      'His first assignment at DuPont was researching new chlorofluorocarbon refrigerants.',
      'He produced a hundred pounds of tetrafluoroethylene gas (TFE) and stored it in small cylinders.',
      'When a cylinder was opened, none of the gas came out, yet the cylinder weighed the same as before. Opened up, it held a white powder: the TFE had polymerized.',
      'The substance was heat resistant, chemically inert and had very low surface friction, so most other substances would not stick to it.',
      'Its first use was in the gaseous diffusion process of the Manhattan Project; Teflon pots and pans came years later.',
      'It was an accidental invention, unlike most other polymer products.'],
    bronnen: [['Science History Institute, "Roy J. Plunkett"', 'https://www.sciencehistory.org/education/scientific-biographies/roy-j-plunkett/']],
    hashtags: '#Shorts #history #inventions #chemistry',
    tags: 'teflon, non-stick pan, teflon invention, Roy Plunkett, DuPont 1938, PTFE, accidental inventions, chemistry history, history of everyday things, why things are the way they are, shorts',
    md: [['Science History Institute, "Roy J. Plunkett"', 'https://www.sciencehistory.org/education/scientific-biographies/roy-j-plunkett/',
      ['"Teflon, discovered by Roy J. Plunkett (1910–1994) at the DuPont Company\'s Jackson Laboratory in 1938"', '"Plunkett\'s first assignment at DuPont was researching new chlorofluorocarbon refrigerants"', '"a hundred pounds of tetrafluoroethylene gas (TFE) and stored it in small cylinders"', '"none of the gas came out—yet the cylinder weighed the same as before"; "They opened it and found a white powder"', '"TFE had polymerized to produce this substance"', '"heat resistant and chemically inert"; "very low surface friction so that most other substances would not adhere to it"', '"Its first use was fulfilling the requirements of the gaseous diffusion process of the Manhattan Project"; "Teflon pots and pans were invented years later"', '"was an accidental invention—unlike most of the other polymer products"']]],
    niet: '- Niet gezegd: de dag (6 april 1938; de bron noemt alleen het jaar), de naam van de helper (de tekst zegt alleen "his helper"), het jaar van de eerste pan. Gasfles, pan en weegschaal zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK: een ei glijdt over de pan
    { duur: 3.2, camera: { zoom: [1, 1.04], stoot: [0.3] }, geluid: [[0.1, 'rol', 0.6], [0.9, 'pop', 0.8]],
      teken: h => pan(h, 430, 1040, Math.sin(h.t * 2.4) * 0.5 + 0.5)
        + h.kin('Non-stick pans started with an *empty* gas cylinder.', { y: 300, g: 96, t: h.t, start: 0.15 }).svg },
    // 2 · 1938, DuPont: Plunkett zoekt koelmiddelen
    { duur: 3.6, in: 'zweep', bron: SHI, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'ding', 0.4]],
      teken: h => h.kin('*1938*, DuPont. Chemist Roy Plunkett is researching new *refrigerants*.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + `<g opacity="${h.klem((h.t - 1.0) / 0.3).toFixed(3)}" filter="url(#sch)"><rect x="390" y="870" width="300" height="400" rx="20" fill="#E4E9EE" stroke="${h.K.inkt}" stroke-width="6"/><line x1="390" y1="1010" x2="690" y2="1010" stroke="${h.K.inkt}" stroke-width="5"/><rect x="640" y="920" width="18" height="60" rx="8" fill="${h.K.inkt}"/><rect x="640" y="1040" width="18" height="80" rx="8" fill="${h.K.inkt}"/><text x="540" y="1250" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="36" fill="#5E7A92">❄</text></g>` },
    // 3 · 100 pond TFE in kleine flessen
    { duur: 3.4, in: 'op', bron: SHI, bronStart: 2.0, camera: { zoom: [1, 1.06] }, geluid: [[0.9, 'klap', 0.5, -0.4], [1.2, 'klap', 0.5, 0], [1.5, 'klap', 0.5, 0.4]],
      teken: h => h.kin('He makes a hundred pounds of a gas, *TFE*, and stores it in small cylinders.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
        + [-1, 0, 1].map((k, i) => { const p = h.veer((h.t - 0.9 - i * 0.3) / 0.3); return p <= 0 ? '' : fles(h, 540 + k * 250, 1060, { schaal: 0.62 * p }); }).join('') },
    // 4 · kraan open: er komt niets uit
    { duur: 3.4, in: 'flits', bron: SHI, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.6] }, geluid: [[0.9, 'tik', 0.8], [1.6, 'boem', 0.4]],
      teken: h => h.kin('One day, the valve opens. *Nothing comes out.*', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
        + fles(h, 540, 1060, { open: h.zacht((h.t - 0.8) / 0.4), schaal: 0.8 }) },
    // 5 · maar de fles weegt evenveel
    { duur: 3.6, in: 'zweep', bron: SHI, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.9] }, geluid: [[1.2, 'rol', 0.4], [1.9, 'ding', 0.7]],
      teken: h => h.kin('But the cylinder *weighs the same* as before.', { y: 300, g: 100, t: h.t, start: 0.05, nadruk: 'balk' }).svg
        + fles(h, 540, 960, { schaal: 0.62 }) + schaal(h, 540, 1150, h.t < 1.9 ? '-.-- lb' : 'SAME') },
    // 6 · opengezaagd: wit poeder
    { duur: 3.4, in: 'op', bron: SHI, bronStart: 2.0, camera: { zoom: [1, 1.08], stoot: [1.3] }, geluid: [[1.28, 'klap', 0.8], [1.3, 'boem', 0.4]],
      teken: h => h.kin('They open it up: a *white powder*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg
        + fles(h, 540, 1060, { schaal: 0.8, doorsnede: h.klem((h.t - 1.2) / 0.3) }) },
    // 7 · gepolymeriseerd: hittebestendig, inert, er plakt bijna niets aan
    { duur: 4.0, in: 'zweep', bron: SHI, bronStart: 2.6, camera: { zoom: [1.05, 1.0] }, geluid: [[1.6, 'pop', 0.7], [2.0, 'pop', 0.7], [2.4, 'pop', 0.7]],
      teken: h => h.kin('The gas had *polymerized*. The new stuff resisted heat, and almost *nothing stuck to it*.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg
        + ['HEAT RESISTANT', 'INERT', 'NON-STICK'].map((w, i) => { const p = h.veer((h.t - 1.6 - i * 0.4) / 0.3); return p <= 0 ? '' : `<g filter="url(#schKlein)" transform="translate(540 ${960 + i * 120}) scale(${p.toFixed(3)}) translate(-540 ${-(960 + i * 120)})"><rect x="250" y="${905 + i * 120}" width="580" height="90" rx="12" fill="${i === 2 ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="4"/><text x="540" y="${965 + i * 120}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="48" fill="${i === 2 ? '#FFFFFF' : h.K.inkt}">${w}</text></g>`; }).join('') },
    // 8 · eerste toepassing: het Manhattanproject; pannen pas jaren later
    { duur: 3.8, in: 'masker', nacht: true, bron: SHI, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [2.2, 'ding', 0.6]],
      teken: h => h.kin('Its first job: the *Manhattan Project*.', { y: 330, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + h.kin('Non-stick pans came *years later*.', { y: 680, g: 84, gewicht: 'regular', t: h.t, start: 1.5, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 9 · het was een ongeluk
    { duur: 3.0, in: 'flits', bron: SHI, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.7]],
      teken: h => { const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(820 - (1 - q) * 200).toFixed(1)}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(150 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">An accident.</text>`
          + h.kin('Unlike most other polymer products.', { y: 1000, g: 64, gewicht: 'regular', t: h.t, start: 0.7 }).svg; } },
    // 10 · slot: de pan; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => pan(h, 430, 1040, Math.sin(h.t * 2.4) * 0.5 + 0.5)
        + h.kin('An empty cylinder that *wasn\'t empty*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
