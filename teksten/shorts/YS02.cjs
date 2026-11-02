// YS02 — Why isn't your keyboard in alphabetical order?
// Bron: Smithsonian Magazine, "Fact of Fiction? The Legend of the QWERTY Keyboard" (2013), gelezen 2 nov 2026.
// Elke bewering staat in die bron; zie pakketten/<map>/bron/bronnen.md.
const BRON = 'Smithsonian Magazine, "Fact of Fiction? The Legend of the QWERTY Keyboard"';
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
module.exports = {
  code: 'YS02',
  map: '2026-11-10-YS02-qwerty',
  nummer: 'No. 02',
  onderwerp: 'THE KEYBOARD',
  scenes: [
    { duur: 5, teken: ({ t, blok, toetsen }) =>
      blok('Why isn\'t your keyboard in *alphabetical* order?', { y: 330, g: 88, t, start: 0.1 }).svg
      + toetsen(QWERTY, { x0: 96, y0: 900, toets: 80, gat: 8, t, start: 0.6, accentLetters: 'QWERTY' })
    },
    { duur: 7, bron: BRON, bronStart: 3, teken: ({ t, blok, toetsen }) =>
      blok('Early on, it was.', { y: 300, g: 72, t }).svg
      + blok('Christopher Latham Sholes, a Milwaukee printer, and his colleagues patented an early typewriter in *1868*. Its keys were in alphabetical order.', { y: 420, g: 50, gewicht: 'regular', t, start: 0.8 }).svg
      + toetsen(['ABCDEFGHIJ', 'KLMNOPQRS', 'TUVWXYZ'], { x0: 96, y0: 920, toets: 80, gat: 8, t, start: 2.2 })
    },
    { duur: 6, bron: BRON, bronStart: 2.5, teken: ({ t, blok, toetsen, zacht }) => {
      // de letters schuiven langzaam van ABC naar QWERTY
      const abc = ['ABCDEFGHIJ', 'KLMNOPQRS', 'TUVWXYZ'];
      const p = zacht((t - 1.2) / 3.5), rijen = p < 0.5 ? abc : QWERTY;
      return blok('Then he kept *moving the keys around*, version after version.', { y: 300, g: 64, t }).svg
        + `<g opacity="${(Math.abs(p - 0.5) * 2 * 0.85 + 0.15).toFixed(3)}">` + toetsen(rijen, { x0: 96, y0: 900, toets: 80, gat: 8 }) + '</g>';
    } },
    { duur: 8, bron: BRON, bronStart: 4.5, teken: ({ t, blok, toetsen, K }) =>
      blok('The famous story: he split up common letters so the metal arms wouldn\'t *jam*.', { y: 300, g: 58, t }).svg
      + blok('Historians call that contentious. Look: E and R sit right next to each other.', { y: 560, g: 46, gewicht: 'regular', t, start: 2.2 }).svg
      + toetsen(QWERTY, { x0: 96, y0: 920, toets: 80, gat: 8, accentLetters: t > 3.4 ? 'ER' : '' })
    },
    { duur: 8, bron: BRON, bronStart: 4.5, teken: ({ t, blok, K }) => {
      let s = blok('Another theory (Yasuoka & Yasuoka, Kyoto University, 2011): the layout was shaped by its first big users,', { y: 300, g: 52, gewicht: 'regular', t }).svg
        + blok('*telegraph operators* copying Morse code.', { y: 590, g: 64, t, start: 1.8 }).svg;
      // morse-streep die over het beeld loopt
      const tekens = '−  −·−−  ·−−·  ·', x0 = 100 - ((t * 80) % 200);
      s += `<text x="${x0.toFixed(1)}" y="1000" font-family="IBM Plex Mono" font-weight="700" font-size="76" fill="${K.signaal}" opacity="${Math.min(1, t / 2).toFixed(2)}">${tekens} ${tekens}</text>`;
      return s;
    } },
    { duur: 8, bron: BRON, bronStart: 4, teken: ({ t, blok, K }) =>
      blok('*1874*: Remington starts selling the machine, for $125.', { y: 300, g: 60, t }).svg
      + blok('*1893*: the big typewriter makers merge into one company, and QWERTY becomes the standard.', { y: 590, g: 60, t, start: 1.6 }).svg
    },
    { duur: 6.5, bron: BRON, bronStart: 2.8, teken: ({ t, blok, toetsen, K }) =>
      blok('Nobody agrees why the keys went where they went.', { y: 300, g: 60, t }).svg
      + blok('Everybody agreed to *leave them there*.', { y: 520, g: 60, t, start: 1.2 }).svg
      + toetsen(QWERTY, { x0: 96, y0: 860, toets: 80, gat: 8, accentLetters: 'QWERTY' })
      + blok('Sources in the description.', { y: 1180, g: 36, gewicht: 'regular', kleur: K.grijs, t, start: 2 }).svg
    },
  ],
};
