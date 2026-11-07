// YS26 — Why junk email is called spam.
// Reeks A · Signs & Symbols. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Brian Hayes, "Spam, Spam, Spam, Lovely Spam", American Scientist 91(3), 2003 (pdf);
// Brad Templeton, "Origin of the term 'spam' to mean net abuse". Merriam-Webster (plan-bron) gaf eerder een 403.
// Niet gezegd: de tekst van het lied uit de sketch (geen songtekst), de namen van de advocaten, het precieze aantal
// nieuwsgroepen (Hayes 6.000, Templeton "every single newsgroup": de video zegt "thousands").
const HAY = 'B. Hayes, American Scientist 91(3), 2003';
const TEM = 'B. Templeton, "Origin of the term spam"';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// envelop
const envelop = (h, x, y, s = 1, kleur = '#FBF6EA') => `<g filter="url(#sch)" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})"><rect x="-120" y="-80" width="240" height="160" rx="10" fill="${kleur}" stroke="${h.K.inkt}" stroke-width="5"/><path d="M -120 -80 L 0 20 L 120 -80" fill="none" stroke="${h.K.inkt}" stroke-width="5"/></g>`;
// zwerm enveloppen; p = 0..1
const zwerm = (h, p, y0 = 760, span = 520) => Array.from({ length: 22 }, (_, i) => { const q = h.klem(p * 22 - i); if (q <= 0) return '';
  const x = 170 + ((i * 7919) % 101) / 101 * 740, y = y0 + ((i * 4793) % 89) / 89 * span; return envelop(h, x, y - (1 - q) * 80, 0.5 + (i % 3) * 0.1); }).join('');
// menukaart: elke regel heeft het woord SPAM (geen tekst uit de sketch, alleen het idee "beperkt menu")
const menu = (h, x = 540, y = 1040, p = 1) => { const regels = ['EGG &amp; SPAM', 'SPAM &amp; CHIPS', 'SPAM, EGG &amp; SPAM', 'SPAM &amp; BEANS', 'SPAM &amp; SPAM'];
  return `<g filter="url(#sch)"><rect x="${x - 270}" y="${y - 320}" width="540" height="640" rx="14" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="6"/>`
    + `<text x="${x}" y="${y - 230}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.inkt}">MENU</text>`
    + regels.map((r, i) => { const q = h.klem(p * regels.length - i); return `<text x="${x}" y="${y - 120 + i * 95}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.signaal}" opacity="${q.toFixed(3)}">${r}</text>`; }).join('') + '</g>'; };
// het woord SPAM dat zich herhaalt en het beeld vult; p = 0..1
const herhaal = (h, p, kleur = null) => Array.from({ length: 12 }, (_, i) => { const q = h.klem(p * 12 - i); if (q <= 0) return '';
  return `<text x="${i % 2 ? 640 : 440}" y="${700 + i * 50}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${50 + (i % 3) * 8}" fill="${kleur || h.K.signaal}" opacity="${(q * (0.45 + 0.55 * (i % 2))).toFixed(3)}">SPAM SPAM SPAM</text>`; }).join('');
// chatvenster dat volloopt
const chat = (h, x = 540, y = 1040, p = 0) => { let s = `<g filter="url(#sch)"><rect x="${x - 300}" y="${y - 330}" width="600" height="620" rx="16" fill="#1B1E2B" stroke="${h.K.inkt}" stroke-width="6"/>`;
  const n = Math.floor(p * 11); for (let i = 0; i < 11; i++) { const vol = i < n; s += `<text x="${x - 270}" y="${y - 270 + i * 54}" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="${vol ? '#7CE38B' : '#3A3F52'}">${vol ? '&gt; SPAM SPAM SPAM SPAM' : (i < 2 ? '&gt; hello?' : '')}</text>`; }
  return s + '</g>'; };
// blik zonder merk
const blik = (h, x = 540, y = 1050, s = 1) => `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s.toFixed(3)}) translate(${-x} ${-y})"><rect x="${x - 200}" y="${y - 130}" width="400" height="260" rx="40" fill="#5E7A92" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<rect x="${x - 170}" y="${y - 60}" width="340" height="120" rx="10" fill="${h.K.geel}"/><text x="${x}" y="${y + 22}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">MEAT</text></g>`;

module.exports = {
  code: 'YS26',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-02-YS26-spam',
  nummer: 'No. 26',
  onderwerp: 'THE WORD "SPAM"',
  pakket: {
    dag: 'woensdag 2 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why is junk email called "spam"? Blame a comedy sketch',
    intro: 'Junk email is named after a 1970 comedy sketch, in which one word drowns out everything else. Online players borrowed it, and a 1994 ad made it famous.',
    feiten: ['The ultimate source of the term was a 1970 skit on Monty Python\'s Flying Circus, about a restaurant with a limited menu and a chorus of Vikings chanting "spam" (Hayes).',
      'The meaning: "something that keeps repeating and repeating to great annoyance" (Templeton).',
      'The term goes back to the late 1980s and the "MUD" community (online text games), where it could mean flooding a chat session with text inserted by a program (Templeton).',
      'In April 1994 the "Green Card Lottery" ad was posted to thousands of Usenet newsgroups at once (Hayes: 6,000; Templeton: April 12, to every single newsgroup).',
      'Thousands of Usenet regulars hounded the senders by e-mail, fax and telephone. This incident first popularized the term "spam" (Hayes).',
      'The maker of SPAM attempted a defense of its brand name, then decided to have a sense of humor about it (Hayes).'],
    bronnen: [['Brian Hayes, "Spam, Spam, Spam, Lovely Spam", American Scientist 91(3), May–June 2003 (reprint)', 'https://www.ai.rug.nl/ki2/literature/spam-spam-hayes.pdf'],
      ['Brad Templeton, "Origin of the term \'spam\' to mean net abuse"', 'https://www.templetons.com/brad/spamterm.html']],
    hashtags: '#Shorts #history #words #internet',
    tags: 'spam, why is it called spam, spam email, junk email, Monty Python, internet history, Usenet, green card spam 1994, history of everyday things, why things are the way they are, shorts',
    md: [['Brian Hayes, "Spam, Spam, Spam, Lovely Spam", American Scientist 91(3), mei–juni 2003 (reprint-pdf, volledig gelezen)', 'https://www.ai.rug.nl/ki2/literature/spam-spam-hayes.pdf',
      ['"In April of 1994 a message with the subject heading "Green Card Lottery- Final One?" was posted simultaneously to 6,000 Usenet news groups."', '"Thousands of Usenet regulars … hounded Canter & Siegel by e-mail and fax and telephone."', '"the Canter & Siegel incident was the event that first popularized the term "spam.""', '"The ultimate source was a 1970 skit on the British television show Monty Python\'s Flying Circus, about a restaurant with a limited menu and a chorus of Vikings chanting …"', '"Hormel Foods, who make SPAM rather than spam, attempted a defense of their brand name, then decided to have a sense of humor about it."']],
      ['Brad Templeton, "Origin of the term \'spam\' to mean net abuse" (zonder datum)', 'https://www.templetons.com/brad/spamterm.html',
      ['"Thus the meaning of the term at least: something that keeps repeating and repeating to great annoyance."', '"My research shows the term goes back to the late 1980s and the "MUD" community."', '"the term was sometimes used to mean simply flooding a chat session with a bunch of text inserted by a program"', 'Canter & Siegel: "on April 12, they hired an mercenary programmer to write a simple script to post their ad to every single newsgroup"']]],
    niet: '- Merriam-Webster (plan-bron) gaf eerder een 403. Niet gezegd: de tekst van het lied uit de sketch (alleen dat het woord steeds herhaald wordt), de namen van de advocaten en wat er daarna met hen gebeurde, het precieze aantal nieuwsgroepen (6.000 volgens Hayes; de video zegt "thousands"), en dat dit de "eerste" spam was (er waren eerdere). Menukaart, chatvenster, blik en enveloppen zijn een eigen tekening; geen beeld uit de sketch en geen merk op het blik.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.2, stem: "Junk email is named after a comedy sketch.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => zwerm(h, h.klem(h.t / 1.6)) + h.kin('Junk email is named after a *comedy sketch*.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg },
    // 2 · 1970, Monty Python, beperkt menu
    { duur: 3.8, stem: "1970. A Monty Python sketch, set in a restaurant with a very limited menu.", in: 'zweep', bron: HAY, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[0.8, 'pop', 0.5], [1.6, 'pop', 0.5], [2.4, 'pop', 0.5]],
      teken: h => menu(h, 540, 960, h.klem((h.t - 0.6) / 2.0)) + h.kin('*1970*. A Monty Python sketch: a restaurant with a *limited menu*.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg },
    // 3 · een koor dat het woord blijft herhalen
    { duur: 3.6, stem: "And a chorus of Vikings, chanting the word Spam, over and over.", in: 'flits', bron: HAY, bronStart: 2.2, camera: { zoom: [1, 1.07], schud: [1.2, 2.2] }, geluid: [[0.9, 'tik', 0.5], [1.3, 'tik', 0.5], [1.7, 'tik', 0.5], [2.1, 'tik', 0.5]],
      teken: h => herhaal(h, h.klem((h.t - 0.5) / 2.4)) + h.kin('A chorus of Vikings, chanting it *over and over*.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg },
    // 4 · betekenis
    { duur: 3.6, stem: "So spam came to mean something that keeps repeating, to great annoyance.", in: 'masker', nacht: true, bron: TEM, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4]],
      teken: h => herhaal(h, 1, '#3A3F52') + h.kin('Spam: something that keeps *repeating*, to great *annoyance*.', { y: 330, g: 90, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 5 · late jaren tachtig: online spellen
    { duur: 4.0, stem: "Late nineteen-eighties. Players of online text games used it for flooding a chat with text.", in: 'zweep', bron: TEM, bronStart: 2.6, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'tik', 0.4], [1.8, 'tik', 0.4], [2.2, 'tik', 0.4]],
      teken: h => chat(h, 540, 970, h.klem((h.t - 1.0) / 2.2)) + h.kin('*Late 1980s*. Online games: to spam = *flood a chat* with text.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 6 · april 1994: één advertentie naar duizenden groepen
    { duur: 4.0, stem: "April 12, 1994. Two lawyers post one ad to thousands of Usenet newsgroups at once.", in: 'zweep', bron: TEM, bronStart: 2.6, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.6, 'whoosh', 0.5]],
      teken: h => groot(h, '1994', 860, 200) + zwerm(h, h.klem((h.t - 1.2) / 2.0), 960, 270) + h.kin('One ad, to *thousands* of newsgroups at once.', { y: 300, g: 92, t: h.t, start: 0.45 }).svg },
    // 7 · tegenreactie
    { duur: 3.6, stem: "Thousands of users hit back: by email, fax and phone.", in: 'op', bron: HAY, bronStart: 2.2, camera: { zoom: [1, 1.06], schud: [1.0, 1.8] }, geluid: [[1.0, 'boem', 0.6]],
      teken: h => zwerm(h, 1, 780, 430) + h.kin('Thousands of users *hit back*: by email, fax and phone.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg },
    // 8 · het woord wordt bekend
    { duur: 3.4, stem: "That ad is what first made the word spam widely known.", in: 'flits', bron: HAY, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.2] }, geluid: [[1.2, 'ding', 0.6]],
      teken: h => groot(h, 'SPAM', 980, 240) + h.kin('That ad *popularized* the word.', { y: 330, g: 104, t: h.t, start: 0.05 }).svg },
    // 9 · de maker van het vlees
    { duur: 4.0, stem: "The maker of the canned meat first defended its brand. Then it chose a sense of humor.", in: 'zweep', bron: HAY, bronStart: 2.6, camera: { zoom: [1, 1.05], stoot: [2.4] }, geluid: [[1.0, 'klap', 0.5], [2.4, 'pop', 0.7]],
      teken: h => blik(h, 540, 1060, 1 + 0.08 * Math.sin(h.klem((h.t - 2.4) / 0.4) * Math.PI)) + h.kin('The meat maker defended its brand, then chose a *sense of humor*.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 10 · slot
    { duur: 3.4, stem: "A tin of meat, now in every inbox.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => zwerm(h, 1, 700, 560) + blik(h, 540, 1000, 0.9)
        + h.kin('A tin of meat, now in *every inbox*.', { y: 300, g: 110, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
