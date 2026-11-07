// YS27 — Why an hour has 60 minutes.
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Michael A. Lombardi (NIST), "Why is a minute divided into 60 seconds…",
// Scientific American (2007); BBC News, "The ancient reason there are 60 minutes in an hour" (2026, via The Star).
// Niet gezegd: dat de Babyloniërs het uur in 60 minuten deelden (de bronnen zeggen dat niet), en de populaire
// uitleg met het tellen op de vingerkootjes (geen bron gelezen). Waarom de Sumeriërs 60 kozen is niet bekend.
const SA = 'M. Lombardi (NIST), Scientific American (2007)';
const BBC = 'BBC News (2026)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// klok met wijzers (min 0..60, uur 0..12)
const klok = (h, x = 540, y = 1000, r = 270, min = 0, uur = 0, opStreep = 1) => {
  let s = `<g filter="url(#sch)"><circle cx="${x}" cy="${y}" r="${r}" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="10"/>`;
  for (let i = 0; i < 60; i++) { if (i / 60 > opStreep) break; const a = i / 60 * 2 * Math.PI, l = i % 5 === 0 ? 34 : 14;
    s += `<line x1="${(x + Math.sin(a) * (r - 14)).toFixed(1)}" y1="${(y - Math.cos(a) * (r - 14)).toFixed(1)}" x2="${(x + Math.sin(a) * (r - 14 - l)).toFixed(1)}" y2="${(y - Math.cos(a) * (r - 14 - l)).toFixed(1)}" stroke="${i % 5 === 0 ? h.K.inkt : h.K.signaal}" stroke-width="${i % 5 === 0 ? 7 : 4}"/>`; }
  const wijzer = (frac, len, w, kleur) => { const a = frac * 2 * Math.PI; return `<line x1="${x}" y1="${y}" x2="${(x + Math.sin(a) * len).toFixed(1)}" y2="${(y - Math.cos(a) * len).toFixed(1)}" stroke="${kleur}" stroke-width="${w}" stroke-linecap="round"/>`; };
  return s + wijzer(uur / 12, r * 0.5, 16, h.K.inkt) + wijzer(min / 60, r * 0.8, 10, h.K.signaal) + `<circle cx="${x}" cy="${y}" r="16" fill="${h.K.inkt}"/></g>`; };
// kleitablet met wiggen (eigen tekening, geen echt tablet)
const tablet = (h, x = 540, y = 1000, p = 1) => `<g filter="url(#sch)"><rect x="${x - 220}" y="${y - 270}" width="440" height="520" rx="60" fill="#C8A878" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 30 }, (_, i) => { if (i / 30 > p) return ''; const cx = x - 160 + (i % 5) * 80, cy = y - 200 + Math.floor(i / 5) * 76;
    return i % 4 === 3 ? `<path d="M ${cx} ${cy} l 34 14 l -34 14 z" fill="#7A5B36"/>` : `<path d="M ${cx} ${cy} l 16 0 l -8 42 z" fill="#7A5B36"/>`; }).join('') + '</g>';
// delers van 60 als blokjes die oplichten
const delers = (h, p) => { const d = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
  return d.map((n, i) => { const q = h.klem(p * d.length - i); const x = 210 + (i % 4) * 220, y = 820 + Math.floor(i / 4) * 150;
    return `<g opacity="${(0.25 + 0.75 * q).toFixed(3)}"><rect x="${x - 90}" y="${y - 60}" width="180" height="110" rx="16" fill="${q > 0.5 ? h.K.signaal : '#D8D2C2'}"/><text x="${x}" y="${y + 22}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="60" fill="#FBF6EA">${n}</text></g>`; }).join(''); };
// zon en maan, elk 12 streepjes
const dagnacht = (h, p) => { let s = `<g filter="url(#sch)"><circle cx="330" cy="900" r="110" fill="${h.K.geel}"/><circle cx="750" cy="900" r="110" fill="#3A3F52"/><circle cx="790" cy="870" r="100" fill="${h.K.papier}"/></g>`;
  for (let i = 0; i < 24; i++) { const q = h.klem(p * 24 - i); if (q <= 0) continue; const x = (i < 12 ? 140 : 560) + (i % 12) * 34;
    s += `<rect x="${x}" y="${1110 - q * 40}" width="22" height="${(80 * q).toFixed(1)}" rx="6" fill="${i < 12 ? h.K.geel : '#3A3F52'}"/>`; }
  return s; };
// graad die in 60 en nog eens 60 deelt
const graad = (h, p1, p2) => { let s = `<g filter="url(#sch)"><rect x="140" y="880" width="800" height="60" fill="#D8D2C2" stroke="${h.K.inkt}" stroke-width="5"/>`;
  for (let i = 0; i <= 60; i++) { if (i / 60 > p1) break; s += `<line x1="${140 + i * 800 / 60}" y1="880" x2="${140 + i * 800 / 60}" y2="${i % 10 === 0 ? 960 : 930}" stroke="${h.K.inkt}" stroke-width="${i % 10 === 0 ? 5 : 3}"/>`; }
  if (p2 > 0) { s += `<path d="M 140 950 L 140 1060 M ${140 + 800 / 60} 950 L 940 1060" stroke="${h.K.signaal}" stroke-width="4" fill="none" opacity="${p2.toFixed(3)}"/><rect x="140" y="1060" width="800" height="60" fill="#FBF6EA" stroke="${h.K.signaal}" stroke-width="5" opacity="${p2.toFixed(3)}"/>`;
    for (let i = 0; i <= 60; i++) { if (i / 60 > p2) break; s += `<line x1="${140 + i * 800 / 60}" y1="1060" x2="${140 + i * 800 / 60}" y2="${i % 10 === 0 ? 1140 : 1110}" stroke="${h.K.signaal}" stroke-width="${i % 10 === 0 ? 5 : 3}"/>`; } }
  return s + '</g>'; };

module.exports = {
  code: 'YS27',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-03-YS27-zestig-minuten',
  nummer: 'No. 27',
  onderwerp: 'SIXTY MINUTES',
  pakket: {
    dag: 'donderdag 3 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why does an hour have 60 minutes? Not 10, not 100',
    intro: 'Sixty is an ancient number: the Sumerians and Babylonians counted in base 60. Egypt gave us 24 hours, and Greek astronomy split things into 60 and 60 again.',
    feiten: ['The Babylonians made astronomical calculations in the sexagesimal (base 60) system they inherited from the Sumerians (Scientific American).',
      'It is not clear why the Sumerians settled on a base-60 system (BBC).',
      '60 is the smallest number divisible by the first six counting numbers as well as by 10, 12, 15, 20 and 30 (Scientific American).',
      'Most historians credit the Egyptians with being the first civilization to divide the day into smaller parts. Once both the light and dark hours were divided into 12 parts, the concept of a 24-hour day was in place.',
      'In the Almagest (circa A.D. 150), Ptolemy divided each degree into 60 parts, each again subdivided into 60 smaller parts.',
      'The first division, partes minutae primae, became known as the "minute"; the second, partes minutae secundae, became known as the "second".',
      'Minutes and seconds were not used for everyday timekeeping until many centuries after the Almagest.'],
    bronnen: [['Michael A. Lombardi (NIST), "Why is a minute divided into 60 seconds, an hour into 60 minutes, yet there are only 24 hours in a day?", Scientific American (March 5, 2007)', 'https://www.scientificamerican.com/article/experts-time-division-days-hours-minutes/'],
      ['BBC News, "The ancient reason there are 60 minutes in an hour" (March 29, 2026, via The Star)', 'https://www.the-star.co.ke/news/world/2026-03-29-the-ancient-reason-there-are-60-minutes-in-an-hour']],
    hashtags: '#Shorts #history #time #maths',
    tags: '60 minutes, why 60 minutes in an hour, base 60, sexagesimal, Babylonians, Sumerians, 24 hour day, Ptolemy, minute and second origin, history of everyday things, why things are the way they are, shorts',
    md: [['Michael A. Lombardi (NIST), Scientific American (5 maart 2007)', 'https://www.scientificamerican.com/article/experts-time-division-days-hours-minutes/',
      ['"The Babylonians made astronomical calculations in the sexagesimal (base 60) system they inherited from the Sumerians"', '"60 is the smallest number divisible by the first six counting numbers as well as by 10, 12, 15, 20 and 30."', 'Egyptenaren: "most historians credit them with being the first civilization to divide the day into smaller parts"', '"Once both the light and dark hours were divided into 12 parts, the concept of a 24-hour day was in place."', 'Ptolemaeus (Almagest, ca. 150): "Each degree was divided into 60 parts, each of which was again subdivided into 60 smaller parts."', '"partes minutae primae" werd de "minute", "partes minutae secundae" de "second"', '"Minutes and seconds, however, were not used for everyday timekeeping until many centuries after the Almagest."']],
      ['BBC News, "The ancient reason there are 60 minutes in an hour" (29 maart 2026, overgenomen door The Star; bbc.com zelf blokkeerde het ophalen)', 'https://www.the-star.co.ke/news/world/2026-03-29-the-ancient-reason-there-are-60-minutes-in-an-hour',
      ['"it\'s not clear why the Sumerians settled on a base-60 system"', '"The first civilisation known to divide the day into hours were the ancient Egyptians."']]],
    niet: '- Niet gezegd: dat de Babyloniërs het uur in 60 minuten deelden (de bronnen zeggen dat de minuut en seconde uit de Griekse astronomie komen en pas veel later voor de klok gebruikt werden), en de populaire uitleg over tellen op vingerkootjes (niet in deze bronnen). NIST beschrijft ook een Egyptische schaduwklok met 10 delen plus 2 schemeruren; de video houdt het bij de 12 + 12 uit Scientific American. Klok, kleitablet en blokjes zijn een eigen tekening; het tablet is geen echt museumstuk.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.6, stem: "Why does an hour have sixty minutes? Not ten. Not a hundred.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.6, 'tik', 0.5], [2.4, 'tik', 0.5]],
      teken: h => klok(h, 540, 1000, 270, h.t * 6, 3) + h.kin('Why does an hour have *60* minutes?', { y: 300, g: 104, t: h.t, start: 0.4 }).svg },
    // 2 · Sumerië en Babylon: tellen in zestig
    { duur: 3.8, stem: "The number comes from ancient Mesopotamia. The Babylonians counted in base sixty, from the Sumerians.", in: 'zweep', bron: SA, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'tik', 0.4], [1.5, 'tik', 0.4], [2.0, 'tik', 0.4]],
      teken: h => tablet(h, 540, 1000, h.klem((h.t - 0.6) / 2.4)) + h.kin('*Base 60*: the Babylonians got it from the *Sumerians*.', { y: 300, g: 88, t: h.t, start: 0.05 }).svg },
    // 3 · waarom 60? onbekend
    { duur: 3.2, stem: "Why sixty? Nobody knows for sure.", in: 'flits', bron: BBC, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.0] }, geluid: [[1.0, 'boem', 0.5]],
      teken: h => groot(h, '60?', 980, 300) + h.kin('Why 60? *Nobody knows* for sure.', { y: 320, g: 104, t: h.t, start: 0.05 }).svg },
    // 4 · maar 60 is makkelijk te delen
    { duur: 4.4, stem: "But sixty splits nicely: by 1, 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30.", in: 'op', bron: SA, bronStart: 3.0, camera: { zoom: [1, 1.05] }, geluid: [[0.9, 'pop', 0.4], [1.6, 'pop', 0.4], [2.3, 'pop', 0.4], [3.0, 'pop', 0.4]],
      teken: h => delers(h, h.klem((h.t - 0.6) / 3.0)) + h.kin('But 60 *splits nicely*.', { y: 320, g: 110, t: h.t, start: 0.05 }).svg },
    // 5 · Egypte: 12 + 12 = 24 uur
    { duur: 4.2, stem: "The hours came from Egypt. Twelve parts for the light, twelve for the dark. A twenty-four hour day.", in: 'zweep', bron: SA, bronStart: 2.8, camera: { zoom: [1, 1.05], stoot: [3.2] }, geluid: [[1.4, 'stijg', 0.5], [3.2, 'ding', 0.6]],
      teken: h => dagnacht(h, h.klem((h.t - 0.8) / 2.4)) + h.kin('Egypt: *12* hours of light, *12* of dark. *24*.', { y: 300, g: 94, t: h.t, start: 0.05 }).svg },
    // 6 · Ptolemaeus: 60 en nog eens 60
    { duur: 4.4, stem: "Around the year 150, the astronomer Ptolemy split each degree into sixty parts. And each of those into sixty again.", in: 'masker', bron: SA, bronStart: 3.0, camera: { zoom: [1, 1.04] }, geluid: [[1.0, 'tik', 0.4], [2.6, 'tik', 0.4]],
      teken: h => graad(h, h.klem((h.t - 0.6) / 1.6), h.klem((h.t - 2.4) / 1.6)) + h.kin('Around *A.D. 150*, Ptolemy: each degree into *60* parts. Then *60* again.', { y: 290, g: 82, t: h.t, start: 0.05 }).svg },
    // 7 · de minuut
    { duur: 3.6, stem: "The first small part, in Latin: partes minutae primae. The minute.", in: 'zweep', bron: SA, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [2.4] }, geluid: [[2.4, 'klap', 0.7]],
      teken: h => groot(h, 'MINUTE', 1000, 170) + h.kin('First small part: *partes minutae primae*.', { y: 320, g: 92, t: h.t, start: 0.05 }).svg },
    // 8 · de seconde
    { duur: 3.6, stem: "The second small part: partes minutae secundae. The second.", in: 'flits', bron: SA, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [2.4] }, geluid: [[2.4, 'klap', 0.7]],
      teken: h => groot(h, 'SECOND', 1000, 170) + h.kin('Second small part: *partes minutae secundae*.', { y: 320, g: 92, t: h.t, start: 0.05 }).svg },
    // 9 · pas veel later op de klok
    { duur: 3.8, stem: "But clocks didn't count minutes and seconds until many centuries later.", in: 'masker', nacht: true, bron: SA, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4]],
      teken: h => klok(h, 540, 1020, 250, 0, 0, h.klem((h.t - 0.6) / 2.4)) + h.kin('Everyday clocks used them only *many centuries later*.', { y: 320, g: 88, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 10 · slot
    { duur: 3.4, stem: "Your clock still counts in sixties.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5], [1.2, 'tik', 0.4], [2.2, 'tik', 0.4]],
      teken: h => klok(h, 540, 1000, 250, 10 + h.t * 4, 10)
        + h.kin('Your clock still counts in *sixties*.', { y: 300, g: 110, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
