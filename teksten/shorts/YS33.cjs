// YS33 — Why # became the symbol for tagging topics.
// Reeks A · Signs & Symbols. VORM 3 (vanaf YS33, Andries ma 9 nov 2026: "Mijn voorstel"): korter (25–40 s), de haak in
// de eerste seconde, tekst binnen het veilige vlak, en een einde dat terugloopt naar het begin (script.lus).
// Stem Kokoro "fenrir" (stijl YS). Eerst op Instagram kanaal 1 (di 17 nov 2026), daarna YouTube (wo 9 dec 2026).
// Bronnen (gelezen ma 9 nov 2026): CNBC (Erin Black, 30 apr 2018); The Register (Rik Myslewski, 13 jun 2014, over de
// OED); 99% Invisible, "Octothorpe" (ep. 145, 16 dec 2014, transcript).
// Niet gezegd: de exacte dag van de eerste tweet (bronnen zeggen 23 of 25 aug 2007: de video zegt "August 2007"),
// de naam van de vriend bij de branden, de herkomst van het teken # zelf (libra pondo: niet zeker), en het jaar
// waarin Twitter hashtags klikbaar maakte (alleen Wikipedia).
const CNBC = 'CNBC (2018)';
const REG = 'The Register (2014), citing the OED';
const NPI = '99% Invisible, "Octothorpe" (2014)';

const hekje = (h, y = 1000, g = 620, kleur = null, intro = true) => { const q = intro ? h.veer(h.klem(h.t / 0.35)) : 1;
  return `<text x="540" y="${(y + (1 - q) * 200).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.7 + 0.3 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${intro ? h.klem(h.t / 0.08).toFixed(3) : 1}" filter="url(#sch)">#</text>`; };
// berichtkaart (eigen ontwerp, geen echte app): regels tekst als balkjes en één regel echte tekst
const kaart = (h, y, tekst, p = 1, accent = '') => `<g opacity="${p.toFixed(3)}" filter="url(#sch)" transform="translate(0 ${((1 - p) * 60).toFixed(1)})">`
  + `<rect x="130" y="${y}" width="820" height="300" rx="28" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<circle cx="210" cy="${y + 80}" r="44" fill="${h.K.papierDiep}" stroke="${h.K.inkt}" stroke-width="4"/>`
  + `<rect x="280" y="${y + 52}" width="300" height="22" rx="11" fill="${h.K.inkt}"/><rect x="280" y="${y + 90}" width="200" height="18" rx="9" fill="${h.K.grijs}"/>`
  + `<text x="180" y="${y + 220}" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">${tekst}<tspan fill="${h.K.signaal}">${accent}</tspan></text></g>`;
// chatvenster met kanalen
const chat = (h, p = 1) => { const kanalen = ['#general', '#music', '#help', '#random'];
  return `<g filter="url(#sch)"><rect x="160" y="760" width="760" height="560" rx="18" fill="#1B1E2B" stroke="${h.K.inkt}" stroke-width="6"/>`
    + `<rect x="160" y="760" width="760" height="70" rx="18" fill="#2A2F44"/>`
    + kanalen.map((k, i) => { const q = h.klem(p * 4 - i); return `<text x="220" y="${910 + i * 105}" font-family="IBM Plex Mono" font-weight="700" font-size="66" fill="${i === 0 ? h.K.geel : '#E8E4DA'}" opacity="${q.toFixed(3)}">${k}</text>`; }).join('') + '</g>'; };
// vlammen
const vuur = (h, p = 1) => Array.from({ length: 5 }, (_, i) => { const q = h.veer(h.klem(p * 5 - i)); const x = 240 + i * 150, hh = (180 + (i % 2) * 90) * q, w = Math.sin(h.t * 7 + i) * 12;
  return `<path d="M ${x - 70} 1180 Q ${x - 60 + w} ${1180 - hh * 0.6} ${x + w} ${1180 - hh} Q ${x + 60 + w} ${1180 - hh * 0.6} ${x + 70} 1180 Z" fill="${i % 2 ? h.K.geel : h.K.signaal}" stroke="${h.K.inkt}" stroke-width="5"/>`; }).join('');
// woordenboek
const boek = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(0 ${((1 - p) * 80).toFixed(1)})"><rect x="200" y="760" width="680" height="520" rx="12" fill="#2F4A6B" stroke="${h.K.inkt}" stroke-width="6"/>`
  + `<rect x="250" y="810" width="580" height="420" rx="8" fill="#FBF6EA"/>`
  + `<text x="290" y="930" font-family="Instrument Sans" font-weight="700" font-size="84" fill="${h.K.inkt}">hashtag, <tspan font-style="italic" font-weight="400">n.</tspan></text>`
  + `<rect x="290" y="990" width="480" height="18" rx="9" fill="${h.K.grijs}"/><rect x="290" y="1040" width="420" height="18" rx="9" fill="${h.K.grijs}"/><rect x="290" y="1090" width="460" height="18" rx="9" fill="${h.K.grijs}"/></g>`;

module.exports = {
  code: 'YS33',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-09-YS33-hashtag',
  nummer: 'No. 33',
  onderwerp: 'THE HASHTAG',
  pakket: {
    dag: 'woensdag 9 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'Twitter said this symbol would never catch on #',
    intro: 'In August 2007, Chris Messina suggested using # for groups on Twitter. Twitter thought it looked clunky. Then a fire in San Diego changed that.',
    feiten: ['In August 2007, Chris Messina proposed using # for groups on Twitter (CNBC; the OED dates "hashtag" to a Twitter posting of August 25, 2007, via The Register).',
      'Chat rooms on IRC already used the # sign for their channels (99% Invisible).',
      'Twitter "thought it would never catch on, it looked clunky" (99% Invisible).',
      'In October 2007, during a San Diego wildfire, Messina asked a friend to add #sandiegofire to his tweets, and others quickly used the same hashtag (CNBC).',
      'In June 2014, "hashtag" was added to the Oxford English Dictionary (The Register).'],
    bronnen: [['Erin Black, "Meet the man who \'invented\' the #hashtag", CNBC (April 30, 2018)', 'https://www.cnbc.com/2018/04/30/chris-messina-hashtag-inventor.html'],
      ['Rik Myslewski, on "hashtag" in the Oxford English Dictionary, The Register (June 13, 2014)', 'https://www.theregister.com/2014/06/13/hashtag_added_to_the_oed/'],
      ['99% Invisible, "Octothorpe", episode 145 (December 16, 2014), transcript', 'https://99percentinvisible.org/episode/octothorpe/transcript/']],
    hashtags: '#Shorts #history #internet #hashtag',
    tags: 'hashtag, hashtag history, who invented the hashtag, Chris Messina, Twitter 2007, pound sign, IRC channels, sandiegofire, history of everyday things, why things are the way they are, shorts',
    md: [['Erin Black, CNBC (30 apr 2018)', 'https://www.cnbc.com/2018/04/30/chris-messina-hashtag-inventor.html',
      ['Chris Messina als bedenker van het gebruik van # op Twitter (2007); Twitter vond het "nerdy"', '"Chris asked him to add #sandiegofire to his tweets. It didn\'t take long for others to start using the same hashtag" (San Diego wildfire, oktober 2007)']],
      ['Rik Myslewski, The Register (13 jun 2014)', 'https://www.theregister.com/2014/06/13/hashtag_added_to_the_oed/',
      ['"born on August 25, 2007 in a Twitter posting, the OED says"', 'opgenomen bij de "June 2014 additions" van de OED']],
      ['99% Invisible, "Octothorpe" (ep. 145, 16 dec 2014), transcript', 'https://99percentinvisible.org/episode/octothorpe/transcript/',
      ['IRC "used the pound sign to represent chat rooms, or conversation channels"', 'Twitter: "they thought it would never catch on, it looked clunky"']]],
    niet: '- Niet gezegd: de exacte dag van de eerste tweet (23 of 25 augustus 2007: de video zegt "August 2007"), de naam van de vriend bij de branden (alleen in zoekresultaten), de herkomst van het teken # zelf (libra pondo: niet zeker) en het jaar waarin Twitter hashtags klikbaar maakte (alleen Wikipedia). De berichtkaart, het chatvenster en het woordenboek zijn een eigen ontwerp; geen logo of scherm van Twitter of IRC.',
  },
  scenes: [
    // 1 · HAAK (in de eerste seconde)
    { duur: 2.6, stem: 'Twitter said this symbol would never catch on.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => hekje(h, 1180, 640) + h.kin('Twitter said *#* would never catch on.', { y: 300, g: 108, t: h.t, start: 0, stap: 0.07 }).svg },
    // 2 · augustus 2007
    { duur: 3.2, stem: 'August 2007. Chris Messina asks: how about using it for groups?', in: 'zweep', bron: CNBC, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.6]],
      teken: h => kaart(h, 860, 'how about ', h.klem((h.t - 0.5) / 0.4), '#barcamp?') + h.kin('*August 2007*: Chris Messina asks, how about *#* for groups?', { y: 290, g: 86, t: h.t, start: 0.05 }).svg },
    // 3 · IRC
    { duur: 3.0, stem: 'Chat rooms already used it to name their channels.', in: 'op', nacht: true, bron: NPI, bronStart: 1.6, camera: { zoom: [1, 1.04] }, geluid: [[0.6, 'tik', 0.5], [1.0, 'tik', 0.5], [1.4, 'tik', 0.5]],
      teken: h => chat(h, h.klem((h.t - 0.4) / 1.4)) + h.kin('Chat rooms already used *#* for their channels.', { y: 300, g: 90, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 4 · Twitter: te lomp
    { duur: 2.6, stem: 'Twitter thought it looked clunky.', in: 'flits', bron: NPI, bronStart: 1.2, camera: { zoom: [1, 1.06], schud: [0.9] }, geluid: [[0.9, 'klap', 0.6]],
      teken: h => hekje(h, 1150, 520, h.K.grijs, false) + `<line x1="250" y1="${1160 - 330}" x2="830" y2="1220" stroke="${h.K.signaal}" stroke-width="34" stroke-linecap="round" opacity="${h.klem((h.t - 0.8) / 0.2).toFixed(3)}"/>` + h.kin('Twitter: it looks *clunky*.', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
    // 5 · branden in San Diego
    { duur: 2.8, stem: 'October 2007. Wildfires in San Diego.', in: 'zweep', nacht: true, bron: CNBC, bronStart: 1.4, camera: { zoom: [1, 1.06], schud: [0.5] }, geluid: [[0.4, 'boem', 0.6], [0.8, 'rol', 0.4]],
      teken: h => vuur(h, h.klem((h.t - 0.2) / 1.0)) + h.kin('*October 2007*: wildfires in San Diego.', { y: 300, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 6 · #sandiegofire
    { duur: 3.4, stem: 'Messina asks a friend to tag his fire updates. Others copy the tag.', in: 'op', bron: CNBC, bronStart: 2.0, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[0.9, 'pop', 0.5], [1.4, 'pop', 0.5], [1.9, 'pop', 0.5]],
      teken: h => [0, 1, 2].map(i => kaart(h, 580 + i * 190, '', h.klem((h.t - 0.7 - i * 0.45) / 0.35), '#sandiegofire')).join('') + h.kin('One tag. Then *everyone* used it.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    // 7 · OED 2014
    { duur: 3.0, stem: 'In 2014, hashtag entered the Oxford English Dictionary.', in: 'zweep', bron: REG, bronStart: 1.6, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.3, 'klap', 0.6], [1.2, 'ding', 0.5]],
      teken: h => boek(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('*2014*: it is in the dictionary.', { y: 300, g: 108, t: h.t, start: 0.05 }).svg },
    // 8 · SLOT, loopt terug naar het begin
    { duur: 2.8, stem: 'Never catch on? Now every trend starts with it.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => hekje(h, 1180, 640) + h.kin('Never catch on? Every trend *starts with it*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
  ],
};
