// YS34 — The first :-) was invented because of a fake warning.
// Reeks C · Happy Accidents. VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de eerste seconde, 25–40 s, einde dat
// terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1 (wo 18 nov 2026), daarna YouTube (do 10 dec).
// Bronnen (gelezen ma 9 nov 2026): de oorspronkelijke bboard-draad op de site van Scott Fahlman (CMU), met het bericht van
// 19-Sep-82 11:44; Fahlman, "Smiley Lore :-)" (CMU); The Register (13 sep 2002) over het terugvinden.
// Niet gezegd: dat dit "de allereerste" smiley ooit was (Fahlman: "at least one of the inventors"; eerdere tekentjes bij
// telexoperators), de namen van de andere schrijvers in de draad, en wie precies de band terugvond (de video zegt "an old
// backup tape").
const OT = 'Original bboard thread, CMU (1982)';
const SL = 'S. Fahlman, "Smiley Lore", CMU';
const REG = 'The Register (2002)';

const smiley = (h, y = 1000, draai = 0, kleur = null, intro = true) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  return `<g transform="translate(540 ${y}) rotate(${draai.toFixed(1)}) scale(${(0.7 + 0.3 * q).toFixed(3)})" opacity="${intro ? h.klem(h.t / 0.08).toFixed(3) : 1}" filter="url(#sch)"><text x="0" y="110" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="360" fill="${kleur || h.K.signaal}">:-)</text></g>`; };
// terminal met berichtregels
const scherm = (h, p = 1, regel = '') => `<g filter="url(#sch)"><rect x="150" y="740" width="780" height="560" rx="20" fill="#1B1E2B" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 5 }, (_, i) => { const q = h.klem(p * 5 - i); return `<rect x="210" y="${810 + i * 70}" width="${[520, 380, 600, 300, 460][i]}" height="22" rx="11" fill="#5C6488" opacity="${q.toFixed(3)}"/>`; }).join('')
  + (regel ? `<text x="210" y="1220" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.geel}" opacity="${h.klem(p * 2 - 1).toFixed(3)}">${regel}</text>` : '') + '</g>';
// lift met waarschuwing
const lift = (h, p = 1) => `<g filter="url(#sch)"><rect x="260" y="700" width="560" height="640" fill="#B9B4A8" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<rect x="300" y="740" width="236" height="600" fill="#D8D3C6" stroke="${h.K.inkt}" stroke-width="4"/><rect x="544" y="740" width="236" height="600" fill="#D8D3C6" stroke="${h.K.inkt}" stroke-width="4"/>`
  + `<g opacity="${p.toFixed(3)}" transform="translate(540 1000) scale(${(0.6 + 0.4 * h.veer(p)).toFixed(3)}) translate(-540 -1000)"><rect x="330" y="900" width="420" height="200" rx="12" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="6"/><text x="540" y="1025" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">WARNING!</text></g></g>`;
const tekens = (h, p = 1) => ['*', '%', '&amp;'].map((c, i) => { const q = h.veer(h.klem(p * 3 - i)); return `<text x="${300 + i * 240}" y="1150" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(220 * q).toFixed(0)}" fill="${h.K.inkt}" opacity="${h.klem(q).toFixed(3)}">${c}</text>`; }).join('');
const band = (h, p = 1) => { const r = h.t * 3; return `<g filter="url(#sch)" opacity="${p.toFixed(3)}">` + [380, 700].map(x => `<circle cx="${x}" cy="1000" r="150" fill="#2A2A30" stroke="${h.K.inkt}" stroke-width="6"/><circle cx="${x}" cy="1000" r="40" fill="${h.K.papier}"/>`
  + [0, 1, 2].map(k => `<rect x="${x - 8}" y="${1000 - 130}" width="16" height="70" fill="${h.K.papier}" transform="rotate(${(r * 57 + k * 120).toFixed(1)} ${x} 1000)"/>`).join('')).join('') + `<rect x="380" y="1140" width="320" height="14" fill="#2A2A30"/></g>`; };

module.exports = {
  code: 'YS34',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 2,   // Stijl OK stijl 2 (Andries, ma 9 nov 2026)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-10-YS34-smiley',
  nummer: 'No. 34',
  onderwerp: 'THE SMILEY',
  pakket: {
    dag: 'donderdag 10 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'The first :-) was invented because of a fake warning',
    intro: 'In September 1982, a joke on a Carnegie Mellon message board was taken seriously. Three days later, Scott Fahlman proposed a joke marker: :-)',
    feiten: ['16 September 1982: on a Carnegie Mellon message board, a joke post warned that the leftmost elevator "has been contaminated with mercury" (original thread).',
      'The next day: "Many people seem to have taken the notice about the physics department seriously." Others proposed joke markers such as *, % and & (original thread).',
      '19 September 1982, 11:44: Scott Fahlman wrote "I propose that the following character sequence for joke markers: :-) Read it sideways." For things that are not jokes, he suggested :-( (original thread; "Smiley Lore").',
      'The post was retrieved from a 1982 backup tape on September 10, 2002 (original thread; The Register).'],
    bronnen: [['Original bboard thread in which :-) was proposed (Scott E. Fahlman, Carnegie Mellon University)', 'https://www.cs.cmu.edu/~sef/Orig-Smiley.htm'],
      ['Scott E. Fahlman, "Smiley Lore :-)" (Carnegie Mellon University)', 'https://www.cs.cmu.edu/~sef/sefSmiley.htm'],
      ['The Register, on the recovery of the first smiley post (September 13, 2002)', 'https://www.theregister.com/2002/09/13/first_ever_smiley_found_preserved/']],
    hashtags: '#Shorts #history #internet #smiley',
    tags: 'smiley, first smiley, emoticon history, :-), Scott Fahlman, Carnegie Mellon 1982, joke marker, internet history, history of everyday things, why things are the way they are, shorts',
    md: [['Oorspronkelijke draad (CMU, site van Scott Fahlman)', 'https://www.cs.cmu.edu/~sef/Orig-Smiley.htm',
      ['16-Sep-82 17:21: "WARNING! Because of a recent physics experiment, the leftmost elevator has been contaminated with mercury."', '16-Sep-82 21:34: "It is not an actual problem."', '17-Sep-82 10:58: "Many people seem to have taken the notice about the physics department seriously." + voorstel * als grapteken; daarna % en & van anderen', '19-Sep-82 11:44, Fahlman: "I propose that the following character sequence for joke markers: :-) Read it sideways." en ":-(" voor wat geen grap is', '"retrieved from the spice vax oct-82 backup tape by Jeff Baird on September 10, 2002"']],
      ['Scott E. Fahlman, "Smiley Lore :-)"', 'https://www.cs.cmu.edu/~sef/sefSmiley.htm',
      ['"In at least one case, a humorous remark was interpreted by someone as a serious safety warning."', '"it occurred to me that the character sequence :-) would be an elegant solution"']],
      ['The Register (13 sep 2002)', 'https://www.theregister.com/2002/09/13/first_ever_smiley_found_preserved/',
      ['teruggevonden door "Microsoft researcher Mike Jones and facilities staff at Carnegie Mellon University"']]],
    niet: '- Niet gezegd: dat dit de allereerste smiley ooit was (Fahlman zelf: "at least one of the inventors"; eerdere tekentjes bij telexoperators), de namen van de andere schrijvers in de draad, en wie de band precies terugvond. De lift, het scherm en de band zijn een eigen ontwerp.',
  },
  scenes: [
    { duur: 2.6, stem: 'This smiley exists because of a fake warning.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => smiley(h, 1050) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1040, 360, 175, { t: h.t, start: 1.3 }) : '') + h.kin('This *:-)* exists because of a *fake warning*.', { y: 300, g: 104, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 2.8, stem: 'September 1982. A message board at Carnegie Mellon.', in: 'zweep', nacht: true, bron: OT, bronStart: 1.4, camera: { zoom: [1, 1.04] }, geluid: [[0.6, 'tik', 0.5], [1.0, 'tik', 0.5]],
      teken: h => scherm(h, h.klem((h.t - 0.3) / 1.2)) + h.kin('*1982*: a message board at Carnegie Mellon.', { y: 300, g: 96, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    { duur: 3.2, stem: 'A joke post warns: the elevator is contaminated with mercury.', in: 'op', bron: OT, bronStart: 1.8, camera: { zoom: [1, 1.05], schud: [1.0] }, geluid: [[1.0, 'klap', 0.6]],
      teken: h => lift(h, h.klem((h.t - 0.8) / 0.3)) + (h.stijl >= 2 ? h.krabbel.pijl(965, 690, 775, 915, { t: h.t, start: 1.5 }) : '') + h.kin('A joke: the elevator is *contaminated with mercury*.', { y: 290, g: 88, t: h.t, start: 0.05 }).svg },
    { duur: 2.4, stem: 'Many people take it seriously.', in: 'flits', bron: OT, bronStart: 1.0, camera: { zoom: [1, 1.06], schud: [0.5, 1.0] }, geluid: [[0.5, 'boem', 0.5]],
      teken: h => lift(h, 1) + h.kin('People take it *seriously*.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'Others suggest joke markers. A star. A percent sign.', in: 'zweep', bron: OT, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.7, 'pop', 0.5], [1.1, 'pop', 0.5], [1.5, 'pop', 0.5]],
      teken: h => tekens(h, h.klem((h.t - 0.5) / 1.2)) + (h.stijl >= 2 ? h.krabbel.streep(200, 1200, 880, { t: h.t, start: 1.9 }) : '') + h.kin('Ideas for a *joke marker*.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 3.6, stem: 'Then Scott Fahlman proposes this. Read it sideways.', in: 'op', bron: OT, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [2.0] }, geluid: [[1.9, 'whoosh', 0.5], [2.3, 'ding', 0.6]],
      teken: h => smiley(h, 1050, 90 * h.zacht((h.t - 1.8) / 0.6), null, false) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1020, 230, 340, { t: h.t, start: 2.6 }) : '') + h.kin('*Scott Fahlman*: read it *sideways*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 3.2, stem: 'His post was lost, until an old backup tape was found in 2002.', in: 'zweep', nacht: true, bron: REG, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'rol', 0.5]],
      teken: h => band(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('Lost. Found on a backup tape in *2002*.', { y: 300, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    { duur: 2.8, stem: 'A joke marker, born from a joke that went wrong.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => smiley(h, 1050) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1040, 360, 175, { t: h.t, start: 1.2 }) : '') + h.kin('Born from a joke that *went wrong*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
  ],
};
