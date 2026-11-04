// YS16 — Why longitude 0° runs through Greenwich.
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks B · Who Decided?
// Bron (gelezen 4 nov 2026): Royal Museums Greenwich, "Greenwich Mean Time (GMT)". Elke bewering staat daarin; zie
// pakketten/<map>/bron/bronnen.md. Niet gezegd: waar en wanneer precies de conferentie was, wie tegen stemde (niet in de bron).
const RMG = 'Royal Museums Greenwich, "Greenwich Mean Time (GMT)"';
const GX = 540, GY = 1030;

// wereldbol met meridianen; draai = 0..1 schuift de meridianen, nul = rode nulmeridiaan zichtbaar (0..1)
const bol = (h, { x = GX, y = GY, r = 300, draai = 0, nul = 1, schaal = 1, op = 1 } = {}) => {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#DCE6EE" stroke="${h.K.inkt}" stroke-width="6"/>`;
  for (let i = -2; i <= 2; i++) s += `<ellipse cx="${x}" cy="${y + i * r * 0.36}" rx="${(r * Math.sqrt(1 - Math.pow(i * 0.36, 2))).toFixed(1)}" ry="${(r * 0.08).toFixed(1)}" fill="none" stroke="#9FB3C4" stroke-width="3"/>`;
  for (let k = 0; k < 12; k++) {
    const a = ((k / 12 + draai) % 1) * Math.PI, rx = Math.abs(Math.cos(a)) * r;
    s += `<ellipse cx="${x}" cy="${y}" rx="${rx.toFixed(1)}" ry="${r}" fill="none" stroke="#9FB3C4" stroke-width="3"/>`;
  }
  s += `<line x1="${x}" y1="${y - r}" x2="${x}" y2="${y + r}" stroke="${h.K.signaal}" stroke-width="10" opacity="${nul.toFixed(3)}"/>`;
  return `<g opacity="${op.toFixed(3)}" filter="url(#sch)" transform="translate(${x} ${y}) scale(${schaal.toFixed(4)}) translate(${-x} ${-y})">${s}</g>`;
};
// vizier van de telescoop (dradenkruis)
const vizier = (h, x, y, r, p = 1) => p <= 0 ? '' : `<g opacity="${h.klem(p * 2).toFixed(3)}" transform="translate(${x} ${y}) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)}) translate(${-x} ${-y})">`
  + `<circle cx="${x}" cy="${y}" r="${r}" fill="#1B1E2B" stroke="${h.K.inkt}" stroke-width="18"/>`
  + `<line x1="${x}" y1="${y - r}" x2="${x}" y2="${y + r}" stroke="${h.K.signaal}" stroke-width="6"/><line x1="${x - r}" y1="${y}" x2="${x + r}" y2="${y}" stroke="#C9C6BC" stroke-width="3"/>`
  + `<circle cx="${x + 0.25 * r}" cy="${y - 0.3 * r}" r="5" fill="#F3F0E8"/><circle cx="${x - 0.45 * r}" cy="${y + 0.2 * r}" r="3" fill="#F3F0E8"/></g>`;
const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };

module.exports = {
  code: 'YS16',
  versie: 2,
  map: '2026-11-24-YS16-nulmeridiaan',
  nummer: 'No. 16',
  onderwerp: 'LONGITUDE ZERO',
  pakket: {
    dag: 'dinsdag 24 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'Why does longitude 0° run through Greenwich?',
    intro: 'In 1884 the Greenwich Meridian was recommended as the Prime Meridian of the World. The main reason: most of the world was already using it.',
    feiten: ['Before, there were no national or international conventions that set how time should be measured.',
      'In 1884 the Greenwich Meridian was recommended as the Prime Meridian of the World, indicating 0° longitude.',
      'One reason: the USA had already chosen Greenwich as the basis for its own national time zone system.',
      'Another: in the late 19th century, 72% of the world\'s commerce depended on sea charts that used Greenwich as the Prime Meridian.',
      'So naming Greenwich as longitude 0° would be of advantage to the largest number of people.',
      'The meridian line is marked by the cross-hairs in the eyepiece of the Airy Transit Circle telescope.',
      'From 1884 until 1972, GMT was the international standard of civil time.'],
    bronnen: [['Royal Museums Greenwich, "Greenwich Mean Time (GMT)"', 'https://www.rmg.co.uk/stories/time/greenwich-mean-time-gmt']],
    hashtags: '#Shorts #history #maps #time',
    tags: 'prime meridian, longitude zero, why Greenwich, Greenwich Mean Time, GMT, 1884, Airy Transit Circle, maps history, history of everyday things, why things are the way they are, shorts',
    md: [['Royal Museums Greenwich, "Greenwich Mean Time (GMT)"', 'https://www.rmg.co.uk/stories/time/greenwich-mean-time-gmt',
      ['"There were no national or international conventions which set how time should be measured."', '"In 1884 the Greenwich Meridian was recommended as the Prime Meridian of the World."', '"the meridian line would indicate 0° longitude"', '"the USA had already chosen Greenwich as the basis for its own national time zone system"', '"72% of the world\'s commerce depended on sea-charts which used Greenwich as the Prime Meridian"', '"naming Greenwich as Longitude 0º would be of advantage to the largest number of people"', '"The meridian line is marked by the cross-hairs in the Airy Transit Circle eyepiece."', '"From 1884 until 1972, GMT was the international standard of civil time."']]],
    niet: '- Niet gezegd: waar en wanneer precies de Internationale Meridiaanconferentie was, hoeveel landen meededen en wie tegen stemde (Frankrijk e.a.): die staan niet in deze bron. De wereldbol, het vizier en de vier tijdzonevakjes (-5 t/m -8) zijn een eigen illustratie, geen bewering uit de bron.',
  },
  scenes: [
    // 1 · HAAK: de bol draait, de rode lijn klapt erop
    { duur: 3.2, camera: { zoom: [1, 1.04], stoot: [0.9], schud: [0.9] }, geluid: [[0.05, 'rol', 0.6], [0.88, 'klap'], [0.88, 'boem', 0.7]],
      teken: h => bol(h, { draai: h.t < 0.9 ? h.t * 0.5 : 0.45, nul: h.klem((h.t - 0.85) / 0.1), schaal: 0.9 + 0.1 * h.veer(h.t / 0.4) })
        + h.kin('Longitude *0°* runs through one telescope.', { y: 300, g: 100, t: h.t, start: 0.2 }).svg },
    // 2 · eerst: geen afspraak
    { duur: 3.4, in: 'zweep', bron: RMG, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.6, -0.5], [1.3, 'pop', 0.6, 0.5], [1.6, 'pop', 0.6]],
      teken: h => h.kin('Before, there were *no international conventions* for measuring time.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + [[300, 1000, 5], [560, 1080, 23], [810, 990, 41]].map(([x, y, m], i) => { const p = h.veer((h.t - 1.0 - i * 0.3) / 0.3); return p <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${p.toFixed(3)}) translate(${-x} ${-y})">${h.klok(x, y, 110, 12, m)}</g>`; }).join('') },
    // 3 · 1884: Greenwich aanbevolen
    { duur: 3.6, in: 'op', bron: RMG, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1884') + h.kin('The Greenwich Meridian is recommended as the *Prime Meridian* of the World: 0° longitude.', { y: 830, g: 74, t: h.t, start: 0.45 }).svg },
    // 4 · reden 1: de VS gebruikten het al
    { duur: 3.6, in: 'zweep', bron: RMG, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.6, 'klap', 0.7]],
      teken: h => h.kin('Why Greenwich? The *USA* had already chosen it for its own time zones.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + [0, 1, 2, 3].map(i => { const p = h.veer((h.t - 1.2 - i * 0.12) / 0.3); return p <= 0 ? '' : `<rect x="${200 + i * 175}" y="${880 + 0 * i}" width="150" height="320" rx="10" fill="${['#DCE6EE', '#C9D6E3', '#B5C7D8', '#A1B8CD'][i]}" stroke="${h.K.inkt}" stroke-width="4" opacity="${p.toFixed(3)}"/><text x="${275 + i * 175}" y="1060" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${h.K.inkt}" opacity="${p.toFixed(3)}">${['-5', '-6', '-7', '-8'][i]}</text>`; }).join('') },
    // 5 · reden 2: 72% van de handel voer op kaarten met Greenwich
    { duur: 3.8, in: 'op', bron: RMG, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [2.2] }, geluid: [[0.8, 'rol', 0.6], [1.3, 'rol', 0.6], [2.2, 'klap', 0.7], [2.2, 'ding', 0.5]],
      teken: h => { const n = Math.round(72 * h.uit((h.t - 0.7) / 1.4));
        return h.kin('And *72%* of the world\'s commerce used sea charts based on Greenwich.', { y: 300, g: 86, t: h.t, start: 0.05 }).svg
          + `<text x="540" y="1110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="260" fill="${h.K.signaal}">${n}%</text>`; } },
    // 6 · dus: voordeel voor de meeste mensen
    { duur: 3.2, in: 'flits', bron: RMG, bronStart: 1.8, camera: { zoom: [1.05, 1.0] }, geluid: [[1.2, 'ding', 0.6]],
      teken: h => h.kin('So 0° at Greenwich helped *the largest number of people*.', { y: 300, g: 96, t: h.t, start: 0.05, nadruk: 'balk' }).svg
        + bol(h, { r: 250, nul: h.klem((h.t - 1.0) / 0.3) }) },
    // 7 · de lijn zelf: het dradenkruis van de Airy Transit Circle
    { duur: 3.8, in: 'zoom', bron: RMG, bronStart: 2.4, camera: { zoom: [1, 1.08] }, geluid: [[1.0, 'whoosh', 0.4], [1.8, 'tik', 0.8]],
      teken: h => h.kin('The exact line: the cross-hairs of the *Airy Transit Circle* telescope.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg
        + vizier(h, 540, 1010, 225, (h.t - 0.9) / 0.5) },
    // 8 · GMT als wereldstandaard tot 1972
    { duur: 3.6, in: 'masker', nacht: true, bron: RMG, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => h.kin('From 1884 until *1972*, GMT was the world\'s standard of civil time.', { y: 330, g: 92, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
        + `<text x="540" y="1100" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="200" fill="${h.K.geel}" opacity="${h.klem((h.t - 1.3) / 0.3).toFixed(3)}">GMT</text>` },
    // 9 · slot: de bol met de rode lijn; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.9, 'whoosh', 0.5]],
      teken: h => bol(h, { draai: 0.45 })
        + h.kin('Zero, because most ships *already used it*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: 3.0 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - 3.0) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
