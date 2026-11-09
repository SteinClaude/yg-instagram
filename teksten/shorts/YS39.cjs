// YS39 — Why is the power button a 1 and a 0?
// Reeks A · Signs & Symbols. VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de eerste seconde, 25–40 s, einde dat
// terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1 (ma 23 nov 2026), daarna YouTube (di 15 dec).
// Bronnen (gelezen ma 9 nov 2026): Kurt Kohlstedt, 99% Invisible (24 apr 2017); Eden, Loughry & Nordman, "Proposal to
// Include IEC Power Symbols", Unicode L2/14-009R (14 feb 2014).
// Niet gezegd: het verhaal over schakelaars in de Tweede Wereldoorlog (geen bron), het jaar 1973 (alleen Wikipedia), de
// precieze nummers per symbool, en dat de commissie het "zo bedoelde" (de video zegt: "in binary terms", zoals 99PI).
const NPI = '99% Invisible (2017)';
const UNI = 'Unicode proposal L2/14-009R (2014)';

// aan/uit-symbool, eigen lijnen; m = 0..1 (0 = een 1 en een 0 naast elkaar, 1 = samengevoegd)
const knop = (h, m = 1, y = 1040, s = 1, kleur = null, intro = true) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1, c = kleur || h.K.signaal, d = 230 * (1 - m);
  const open = 60 * m;   // opening bovenin de cirkel
  const a0 = (-90 + open) * Math.PI / 180, a1 = (270 - open) * Math.PI / 180, r = 170;
  const boog = `M ${(r * Math.cos(a0)).toFixed(1)} ${(r * Math.sin(a0)).toFixed(1)} A ${r} ${r} 0 1 1 ${(r * Math.cos(a1)).toFixed(1)} ${(r * Math.sin(a1)).toFixed(1)}`;
  return `<g filter="url(#sch)" transform="translate(540 ${y}) scale(${(s * (0.7 + 0.3 * q)).toFixed(3)})" opacity="${intro ? h.klem(h.t / 0.08).toFixed(3) : 1}">`
    + `<g transform="translate(${d.toFixed(1)} 0)"><path d="${boog}" fill="none" stroke="${c}" stroke-width="48" stroke-linecap="round"/></g>`
    + `<line x1="${(-d).toFixed(1)}" y1="${(-220 + 30 * (1 - m)).toFixed(1)}" x2="${(-d).toFixed(1)}" y2="${(-20 + 180 * (1 - m)).toFixed(1)}" stroke="${c}" stroke-width="48" stroke-linecap="round"/></g>`; };
const cijfers = (h, p = 1) => ['1', '0'].map((c, i) => { const q = h.veer(h.klem(p * 2 - i)); return `<text x="${360 + i * 360}" y="1180" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(380 * q).toFixed(0)}" fill="${h.K.inkt}" opacity="${h.klem(q).toFixed(3)}">${c}</text>`; }).join('');
const lampjes = (h, p = 1) => `<g filter="url(#sch)"><text x="360" y="1235" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="70" fill="${h.K.inkt}">1 = ON</text><text x="720" y="1235" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="70" fill="${h.K.inkt}">0 = OFF</text>`
  + `<circle cx="360" cy="1000" r="130" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="8" opacity="${(0.4 + 0.6 * p).toFixed(3)}"/><circle cx="720" cy="1000" r="130" fill="#4A4A52" stroke="${h.K.inkt}" stroke-width="8"/></g>`;
const norm = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(0 ${((1 - p) * 80).toFixed(1)})"><rect x="250" y="740" width="580" height="600" rx="10" fill="#F6F1E3" stroke="${h.K.inkt}" stroke-width="6"/><text x="540" y="860" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">IEC 60417</text>`
  + Array.from({ length: 6 }, (_, i) => `<rect x="310" y="${920 + i * 60}" width="${[420, 360, 400, 300, 380, 260][i]}" height="16" rx="8" fill="${h.K.grijs}"/>`).join('') + '</g>';
const toetsen = (h, p = 1) => { const q = h.veer(p); return `<g filter="url(#sch)"><rect x="170" y="${(1150 - 40 * q).toFixed(1)}" width="740" height="140" rx="18" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="6"/><text x="540" y="${(1245 - 40 * q).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">U+23FB</text></g>`; };

module.exports = {
  code: 'YS39',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stijl: 2,   // Stijl OK stijl 2 (Andries, ma 9 nov 2026)
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-15-YS39-aan-uit',
  nummer: 'No. 39',
  onderwerp: 'THE POWER SYMBOL',
  pakket: {
    dag: 'dinsdag 15 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'Why is the power button a 1 and a 0?',
    intro: 'The power symbol is a 1 and a 0 combined: "on" and "off" in binary terms. The symbols are defined in an international standard, IEC 60417.',
    feiten: ['The power symbol is "an abstracted combination of 1 and 0 (\'on\' and \'off\' in binary terms)" (99% Invisible).',
      'The power symbols "are defined in IEC 60417, which is also ISO 7000:2012" (Unicode proposal L2/14-009R).',
      'Until then they were images only; as text characters "for the first time they would be searchable in plain text" (Unicode proposal L2/14-009R).',
      '"In 2015, a campaign was launched and proposal accepted to add this and other power-related characters to Unicode" (99% Invisible).'],
    bronnen: [['Kurt Kohlstedt, "Modern Hieroglyphs: Binary Logic Behind the Universal \'Power Symbol\'", 99% Invisible (April 24, 2017)', 'https://99percentinvisible.org/article/modern-hieroglyphics-binary-logic-behind-universal-power-symbol/'],
      ['Terence Eden, Joe Loughry and Bruce Nordman, "Proposal to Include IEC Power Symbols", Unicode L2/14-009R (February 14, 2014)', 'https://www.unicode.org/L2/L2014/14009r-power-symbol.pdf']],
    hashtags: '#Shorts #history #design #technology',
    tags: 'power symbol, power button, on off symbol, 1 and 0, binary, IEC 60417, standby symbol, Unicode power symbol, design history, history of everyday things, why things are the way they are, shorts',
    md: [['Kurt Kohlstedt, 99% Invisible (24 apr 2017)', 'https://99percentinvisible.org/article/modern-hieroglyphics-binary-logic-behind-universal-power-symbol/',
      ['"An abstracted combination of 1 and 0 (\'on\' and \'off\' in binary terms)"', '"In 2015, a campaign was launched and proposal accepted to add this and other power-related characters to Unicode."']],
      ['Eden, Loughry & Nordman, Unicode L2/14-009R (14 feb 2014)', 'https://www.unicode.org/L2/L2014/14009r-power-symbol.pdf',
      ['"defined in IEC 60417, which is also ISO 7000:2012"', '"For the first time they would be searchable in plain text, something not possible with embedded graphics."']]],
    niet: '- Niet gezegd: het verhaal over schakelaars in de Tweede Wereldoorlog (geen bron), het jaar 1973 (alleen Wikipedia), de nummers per symbool, en dat de commissie de 1 en 0 zo bedoelde (de video zegt "in binary", zoals 99% Invisible). Knop, lampjes, norm en toets zijn eigen tekenwerk.',
  },
  scenes: [
    { duur: 2.4, stem: 'Your power button hides two numbers.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => knop(h, 1) + h.kin('Your power button hides *two numbers*.', { y: 300, g: 108, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 2.4, stem: 'A one, and a zero.', in: 'zweep', bron: NPI, bronStart: 1.0, camera: { zoom: [1, 1.05] }, geluid: [[0.4, 'pop', 0.5], [0.9, 'pop', 0.5]],
      teken: h => cijfers(h, h.klem((h.t - 0.2) / 0.8)) + (h.stijl >= 2 ? h.krabbel.cirkel(360, 1045, 150, 190, { t: h.t, start: 0.9 }) + h.krabbel.cirkel(720, 1045, 150, 190, { t: h.t, start: 1.4, draai: 5 }) : '') + h.kin('A *1*, and a *0*.', { y: 300, g: 120, t: h.t, start: 0.05 }).svg },
    { duur: 2.8, stem: 'In binary terms, one means on. Zero means off.', in: 'op', bron: NPI, bronStart: 1.4, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'tik', 0.5], [1.6, 'tik', 0.5]],
      teken: h => lampjes(h, Math.round((Math.sin(h.t * 6) + 1) / 2)) + h.kin('In binary: *1 = on*, *0 = off*.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    { duur: 2.8, stem: 'Push them together, and you get this.', in: 'zweep', bron: NPI, bronStart: 1.4, camera: { zoom: [1, 1.06], stoot: [1.5] }, geluid: [[1.0, 'whoosh', 0.5], [1.5, 'klap', 0.6]],
      teken: h => knop(h, h.zacht((h.t - 0.5) / 1.0), 1040, 1, null, false) + h.kin('Push them *together*.', { y: 300, g: 116, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'The symbols are defined in an international standard: IEC 60417.', in: 'op', bron: UNI, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'pop', 0.4]],
      teken: h => norm(h, h.klem((h.t - 0.3) / 0.4)) + h.kin('An international standard: *IEC 60417*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 3.2, stem: 'For years they were only pictures. In 2015, Unicode accepted them as text.', in: 'zweep', bron: NPI, bronStart: 1.8, camera: { zoom: [1, 1.05], stoot: [1.8] }, geluid: [[1.7, 'klap', 0.5], [1.9, 'ding', 0.5]],
      teken: h => toetsen(h, h.klem((h.t - 1.6) / 0.3)) + knop(h, 1, 880, 0.55, h.K.inkt, false) + (h.stijl >= 2 ? h.krabbel.cirkel(540, 1180, 410, 110, { t: h.t, start: 2.0 }) : '') + h.kin('*2015*: accepted as text.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 2.6, stem: 'On and off, in one symbol. Press it, and it all starts again.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => knop(h, 1) + h.kin('On and off, *in one symbol*.', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
  ],
};
