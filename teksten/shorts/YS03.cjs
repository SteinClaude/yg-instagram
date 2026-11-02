// YS03 — Why does your clock follow railway time?
// Bronnen: Royal Museums Greenwich, "Why do we have Greenwich Mean Time? 'Local' time and the Railways";
// Library of Congress, "The Day of Two Noons" (This Month in Business History). Gelezen 2 nov 2026.
// Elke bewering staat in een van die twee; zie pakketten/<map>/bron/bronnen.md.
const RMG = 'Royal Museums Greenwich, "Why do we have Greenwich Mean Time?"';
const LOC = 'Library of Congress, "The Day of Two Noons"';
module.exports = {
  code: 'YS03',
  map: '2026-11-11-YS03-spoortijd',
  nummer: 'No. 03',
  onderwerp: 'THE TIME ON YOUR CLOCK',
  scenes: [
    { duur: 5, teken: ({ t, blok, klok, fase }) =>
      blok('Why is it the *same time* in the next town over?', { y: 330, g: 88, t, start: 0.1 }).svg
      + klok(540, 1000, 200, 12, Math.min(59, t * 12), { doorzicht: fase(t, 0.5, 0.8) })
    },
    { duur: 7, teken: ({ t, blok, K, fase, zacht }) => {
      let s = blok('For most of history, every town set its clocks by *its own sun*.', { y: 300, g: 64, t }).svg
        + blok('Noon was when the sun stood highest. Move west, and noon comes a little later.', { y: 540, g: 46, gewicht: 'regular', t, start: 1.6 }).svg;
      // zon die over een boog loopt
      const p = zacht(t / 6.5), a = Math.PI * (1 - p), cx = 540 + 340 * Math.cos(a), cy = 1180 - 300 * Math.sin(a);
      s += `<path d="M200 1180 A340 300 0 0 1 880 1180" fill="none" stroke="${K.grijs}" stroke-width="3" stroke-dasharray="10 12"/>`;
      s += `<line x1="160" y1="1180" x2="920" y2="1180" stroke="${K.inkt}" stroke-width="4"/>`;
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="46" fill="${K.geel}" stroke="${K.inkt}" stroke-width="4"/>`;
      return s;
    } },
    { duur: 7.5, bron: RMG, bronStart: 3.5, teken: ({ t, blok, klok, fase }) =>
      blok('In Britain, Plymouth ran about *16.5 minutes* behind Greenwich. Liverpool ran *12* behind.', { y: 300, g: 56, t }).svg
      + klok(220, 860, 130, 12, 0, { label: 'Greenwich', sub: '12:00', doorzicht: fase(t, 1.4) })
      + klok(540, 860, 130, 11, 48, { label: 'Liverpool', sub: '11:48', doorzicht: fase(t, 2.0) })
      + klok(860, 860, 130, 11, 43.5, { label: 'Plymouth', sub: '11:43:30', doorzicht: fase(t, 2.6) })
    },
    { duur: 6, teken: ({ t, blok, K, fase }) => {
      const x = 900 - t * 200;
      let s = blok('Then came the *railways*. One timetable, dozens of different clocks.', { y: 300, g: 64, t }).svg;
      // een simpele trein die door beeld rijdt
      s += `<line x1="0" y1="1080" x2="1080" y2="1080" stroke="${K.inkt}" stroke-width="6"/>`;
      s += `<g transform="translate(${x.toFixed(1)} 0)"><rect x="0" y="940" width="260" height="120" rx="14" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="5"/>
<rect x="270" y="960" width="200" height="100" rx="12" fill="#FFFFFF" stroke="${K.inkt}" stroke-width="5"/>
<rect x="480" y="960" width="200" height="100" rx="12" fill="#FFFFFF" stroke="${K.inkt}" stroke-width="5"/>
${[40, 200, 320, 420, 530, 630].map(cx => `<circle cx="${cx}" cy="1066" r="20" fill="${K.inkt}"/>`).join('')}
<rect x="30" y="905" width="40" height="40" fill="${K.inkt}"/></g>`;
      return s;
    } },
    { duur: 8, bron: RMG, bronStart: 4.5, teken: ({ t, blok }) =>
      blok('*1847*: Britain\'s Railway Clearing House recommends that every station use Greenwich time.', { y: 300, g: 56, t }).svg
      + blok('*1852*: telegraph wires carry it across the country.', { y: 600, g: 56, t, start: 1.6 }).svg
      + blok('*1880*: Greenwich Mean Time becomes the legal time in Great Britain.', { y: 820, g: 56, t, start: 3.0 }).svg
    },
    { duur: 8.5, bron: LOC, bronStart: 4.5, teken: ({ t, blok, klok, fase }) =>
      blok('America: *18 November 1883*, the "Day of Two Noons".', { y: 300, g: 60, t }).svg
      + blok('Railroad station clocks were reset to standard time as noon arrived in each zone.', { y: 520, g: 46, gewicht: 'regular', t, start: 1.4 }).svg
      + klok(330, 960, 130, 12, 0, { label: 'local noon', doorzicht: fase(t, 2.6) })
      + klok(750, 960, 130, 12, 0, { label: 'standard noon', doorzicht: fase(t, 3.2) })
    },
    { duur: 7, bron: LOC, bronStart: 3.2, teken: ({ t, blok, K }) =>
      blok('The US government only made standard time law in *1918*.', { y: 300, g: 60, t }).svg
      + blok('The time zone on your phone began as a *railway timetable*.', { y: 560, g: 60, t, start: 1.4 }).svg
      + blok('Sources in the description.', { y: 1180, g: 36, gewicht: 'regular', kleur: K.grijs, t, start: 2.4 }).svg
    },
  ],
};
