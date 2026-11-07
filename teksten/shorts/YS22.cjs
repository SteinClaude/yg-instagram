// YS22 — Alexander Graham Bell answered the phone with "Ahoy".
// Reeks A · Signs & Symbols. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Hagley Museum & Library (2022, over Edisons brief van 15 aug 1877); NPR, "Lost and
// Found Sound, Part One" (1999); Wordorigins.org (David Wilton), "hello" (2020), met het citaat uit Edisons brief.
// Merriam-Webster (plan-bron) gaf een 403. Niet gezegd: dat Edison "hello" heeft uitgevonden (het woord bestond al;
// Wordorigins: de spelling "hello" in 1826) en dat de "hello girls" het woord verspreidden (geen bron voor dat verband).
const HAG = 'Hagley Museum & Library (2022)';
const WO = 'D. Wilton, Wordorigins.org, "hello"';
const NPR = 'NPR, "Lost and Found Sound, Part One" (1999)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// oude telefoon aan de muur: houten kast, hoorn aan een snoer; tril = 0..1
const telefoon = (h, x = 540, y = 1060, tril = 0) => { const dx = Math.sin(h.t * 60) * 6 * tril;
  return `<g filter="url(#sch)" transform="translate(${dx.toFixed(1)} 0)"><rect x="${x - 150}" y="${y - 230}" width="300" height="420" rx="18" fill="#8C5E3C" stroke="${h.K.inkt}" stroke-width="6"/>`
    + `<circle cx="${x}" cy="${y - 80}" r="70" fill="#D9C7A8" stroke="${h.K.inkt}" stroke-width="6"/><circle cx="${x}" cy="${y - 80}" r="14" fill="${h.K.inkt}"/>`
    + `<rect x="${x - 40}" y="${y + 40}" width="80" height="110" rx="10" fill="#6F4A30"/>`
    + `<rect x="${x + 170}" y="${y - 200}" width="56" height="170" rx="24" fill="${h.K.inkt}"/><path d="M ${x + 198} ${y - 30} C ${x + 220} ${y + 80} ${x + 120} ${y + 80} ${x + 150} ${y + 150}" fill="none" stroke="${h.K.inkt}" stroke-width="8"/></g>`; };
// brief met handschrift-regels
const brief = (h, x = 540, y = 1060, p = 1) => `<g opacity="${p.toFixed(3)}" filter="url(#sch)" transform="translate(0 ${((1 - p) * 60).toFixed(1)})"><rect x="${x - 250}" y="${y - 290}" width="500" height="600" rx="8" fill="#FBF6EA"/>`
  + Array.from({ length: 9 }, (_, i) => `<path d="M ${x - 190} ${y - 220 + i * 52} q 40 -10 80 0 t 80 0 t 80 0 t ${i % 3 === 2 ? 40 : 120} 0" fill="none" stroke="#5A6B8C" stroke-width="5"/>`).join('')
  + `<text x="${x + 150}" y="${y + 270}" text-anchor="end" font-family="IBM Plex Mono" font-weight="700" font-size="30" fill="${h.K.signaal}">15 Aug 1877</text></g>`;
// golven rond een woord (geluid dat ver draagt); p = 0..1
const golven = (h, x, y, p) => [0, 1, 2].map(i => { const q = h.klem(p * 3 - i); return q <= 0 ? '' : `<circle cx="${x}" cy="${y}" r="${(160 + i * 110 + q * 30).toFixed(1)}" fill="none" stroke="${h.K.signaal}" stroke-width="8" opacity="${(q * (1 - i * 0.25)).toFixed(3)}"/>`; }).join('');

module.exports = {
  code: 'YS22',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-28-YS22-hello',
  nummer: 'No. 22',
  onderwerp: 'THE WORD "HELLO"',
  pakket: {
    dag: 'zaterdag 28 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'Alexander Graham Bell wanted you to answer the phone with "Ahoy"',
    intro: 'The inventor of the telephone wanted us to answer with "Ahoy, ahoy". Thomas Edison suggested "Hello", and Edison won.',
    feiten: ['Alexander Graham Bell recommended "Ahoy, ahoy" as the telephone greeting.',
      'On 15 August 1877, Thomas Edison suggested "Hello" as the proper greeting for answering the phone, in a letter to T.B.A. David, president of a telegraph company in Pittsburgh. His suggestion would supplant Bell\'s.',
      'Early telephones had no bell. Edison wrote: "I do not think we shall need a call bell as Hello! can be heard 10 to 20 feet away."',
      'The word was older than the telephone: the spelling "hello" appears in nineteenth-century America (Wordorigins dates it to 1826).',
      'Bell preferred the word "Ahoy" when picking up a receiver (NPR).'],
    bronnen: [['Hagley Museum & Library, "On this date in 1877, inventor Thomas Edison suggested \'Hello\'…" (August 15, 2022)', 'https://hagley.org/node/3346'],
      ['David Wilton, Wordorigins.org, "hello" (2020)', 'https://www.wordorigins.org/big-list-entries/hello'],
      ['NPR, "Lost and Found Sound, Part One" (March 19, 1999)', 'https://www.npr.org/1999/03/19/1047244/lost-and-found-sound-part-one']],
    hashtags: '#Shorts #history #words #telephone',
    tags: 'hello, why do we say hello, ahoy, Alexander Graham Bell, Thomas Edison, telephone greeting, telephone history, 1877, history of everyday things, why things are the way they are, shorts',
    md: [['Hagley Museum & Library, "On this date in 1877, inventor Thomas Edison suggested \'Hello\'…" (15 aug 2022)', 'https://hagley.org/node/3346',
      ['"On this date in 1877, inventor Thomas Edison suggested "Hello"" … "to the T.B.A. David, president of the Central District and Printing Telegraph Company of Pittsburgh" … "as the proper telephone greeting for answering the phone."', '"His suggestion would supplant the recommendation by Alexander Graham Bell, which was "Ahoy, ahoy"."']],
      ['David Wilton, Wordorigins.org, "hello" (28 dec 2020)', 'https://www.wordorigins.org/big-list-entries/hello',
      ['"Hello becomes associated with the telephone because the earliest models of the device did not have a bell"', 'Edison aan David: "Friend David, I do not think we shall need a call bell as Hello! can be heard 10 to 20 feet away."', '"But the hello spelling doesn\'t appear until nineteenth century America." (de pagina noemt 1826)', '"The use of hello as a greeting is a relatively new use of the word, dating to the mid nineteenth century"']],
      ['NPR, "Lost and Found Sound, Part One" (19 maart 1999)', 'https://www.npr.org/1999/03/19/1047244/lost-and-found-sound-part-one',
      ['"Bell preferred the word "Ahoy" as the response when picking up a receiver."', '(NPR citeert ook dat "Hello" voor de telefoon "was invented"; dat botst met Wordorigins (1826), dus de video zegt "suggested", niet "invented".)']]],
    niet: '- Merriam-Webster (plan-bron) gaf op 7 nov een 403. Niet gezegd: dat Edison het woord uitvond (het bestond al), dat de "hello girls" (telefonistes) het woord verspreidden (geen bron voor dat verband), en de "Hulloa!" uit het eerste telefoonboek (alleen een veilingpagina als bron). Telefoon, brief en golven zijn een eigen tekening; geen portret van Bell of Edison.',
  },
  scenes: [
    // 1 · HAAK: AHOY
    { duur: 3.6, stem: "The inventor of the telephone wanted you to answer with: Ahoy.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => groot(h, 'AHOY!', 1050, 220) + h.kin('The inventor of the telephone wanted you to answer with…', { y: 300, g: 90, t: h.t, start: 0.4 }).svg },
    // 2 · Bell: Ahoy, ahoy
    { duur: 3.6, stem: "Alexander Graham Bell's recommendation: Ahoy, ahoy.", in: 'zweep', bron: HAG, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[1.0, 'ding', 0.4], [1.6, 'ding', 0.4]],
      teken: h => telefoon(h, 540, 1080, h.klem((h.t - 0.9) / 0.2) * (1 - h.klem((h.t - 2.0) / 0.3))) + h.kin('Alexander Graham Bell\'s recommendation: *"Ahoy, ahoy."*', { y: 300, g: 90, t: h.t, start: 0.05 }).svg },
    // 3 · 15 augustus 1877: een brief van Edison
    { duur: 4.0, stem: "August 15, 1877. Thomas Edison writes to the president of a telegraph company in Pittsburgh.", in: 'op', bron: HAG, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[0.9, 'rol', 0.5]],
      teken: h => brief(h, 540, 980, h.klem((h.t - 0.6) / 0.5)) + h.kin('*1877*. Thomas Edison writes to a telegraph company in Pittsburgh.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 4 · zijn voorstel: Hello
    { duur: 3.0, stem: "His suggestion: Hello.", in: 'flits', bron: HAG, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.9], schud: [0.9] }, geluid: [[0.9, 'klap', 0.9], [0.9, 'boem', 0.6]],
      teken: h => (h.t > 0.8 ? groot({ ...h, t: h.t - 0.8 }, 'HELLO!', 1050, 220) : '') + h.kin('His suggestion:', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
    // 5 · geen bel nodig
    { duur: 4.4, stem: "Early phones had no bell. Edison: Hello! can be heard ten to twenty feet away.", in: 'zweep', bron: WO, bronStart: 2.6, camera: { zoom: [1, 1.05] }, geluid: [[1.8, 'stijg', 0.4]],
      teken: h => golven(h, 540, 1060, h.klem((h.t - 1.6) / 1.4)) + `<text x="540" y="1090" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="100" fill="${h.K.inkt}">Hello!</text>`
        + h.kin('No bell needed: *"Hello! can be heard 10 to 20 feet away."*', { y: 290, g: 86, t: h.t, start: 0.05 }).svg },
    // 6 · het woord bestond al
    { duur: 3.8, stem: "The word was older. The spelling hello already shows up in America in the eighteen-twenties.", in: 'op', bron: WO, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1826', 760, 250) + h.kin('The word was older. *"Hello"* already shows up in 1820s America.', { y: 860, g: 74, t: h.t, start: 0.45 }).svg },
    // 7 · Edison wint van Bell
    { duur: 3.6, stem: "But on the phone, Edison's hello won. Bell's ahoy didn't.", in: 'masker', nacht: true, bron: HAG, bronStart: 2.2, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [1.8, 'ding', 0.7]],
      teken: h => { const p = h.zacht((h.t - 1.4) / 0.5);
        return h.kin('On the phone, Edison\'s *hello* won.', { y: 330, g: 100, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + `<text x="540" y="1000" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="150" fill="${h.K.geel}">HELLO</text>`
          + `<text x="540" y="1220" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="110" fill="#8B8A96" opacity="${(1 - 0.6 * p).toFixed(3)}">AHOY</text>`
          + `<line x1="360" y1="1185" x2="${(360 + 360 * p).toFixed(1)}" y2="1185" stroke="${h.K.signaal}" stroke-width="14"/>`; } },
    // 8 · slot
    { duur: 3.6, stem: "Ahoy lost. Hello picked up.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => telefoon(h, 540, 1080, 0)
        + h.kin('Ahoy lost. *Hello picked up.*', { y: 300, g: 110, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
