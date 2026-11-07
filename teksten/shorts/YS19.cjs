// YS19 — Mayday is French. Sort of.
// Reeks A · Signs & Symbols. Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): ITU, General Regulations bij de International Radiotelegraph Convention (Washington,
// 1927), art. 19; Historic Croydon Airport Trust, "History"; Wordorigins.org (David Wilton), "mayday", met het citaat uit
// The Times van 2 februari 1923. Merriam-Webster (de bron in het plan) gaf een 403. Mockford wordt "credited": zijn
// naam staat niet in de pers van toen (Wordorigins noemt de toeschrijving "undocumented").
const ITU = 'ITU, Radiotelegraph Convention, Washington 1927, art. 19';
const CROY = 'Historic Croydon Airport Trust, "History"';
const TIMES = 'The Times, 2 Feb 1923, via Wordorigins.org';

const groot = (h, tekst, y = 700, g = 290) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// oude radiomicrofoon met golven; golf = 0..1
const micro = (h, x = 540, y = 1050, golf = 0) => {
  let s = `<g filter="url(#sch)"><rect x="${x - 70}" y="${y - 170}" width="140" height="220" rx="70" fill="${h.K.inkt}"/>`;
  for (let i = 0; i < 6; i++) s += `<line x1="${x - 46}" y1="${y - 120 + i * 28}" x2="${x + 46}" y2="${y - 120 + i * 28}" stroke="#55545A" stroke-width="8" stroke-linecap="round"/>`;
  s += `<rect x="${x - 10}" y="${y + 50}" width="20" height="140" fill="${h.K.inkt}"/><rect x="${x - 110}" y="${y + 185}" width="220" height="30" rx="12" fill="${h.K.inkt}"/></g>`;
  for (let i = 0; i < 3; i++) { const p = h.klem(golf * 3 - i);
    if (p > 0) s += `<path d="M ${x + 120 + i * 60} ${y - 160 - i * 30} Q ${x + 180 + i * 70} ${y - 60} ${x + 120 + i * 60} ${y + 40 + i * 30}" fill="none" stroke="${h.K.signaal}" stroke-width="12" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`
      + `<path d="M ${x - 120 - i * 60} ${y - 160 - i * 30} Q ${x - 180 - i * 70} ${y - 60} ${x - 120 - i * 60} ${y + 40 + i * 30}" fill="none" stroke="${h.K.signaal}" stroke-width="12" stroke-linecap="round" opacity="${p.toFixed(3)}"/>`; }
  return s;
};
// morse: ... --- ...
const morse = (h, y = 1050, p = 1, kleur = null) => { const tek = ['.', '.', '.', '-', '-', '-', '.', '.', '.']; let x = 166, s = '';
  tek.forEach((d, i) => { const w = d === '.' ? 36 : 96; if (i / tek.length < p) s += `<rect x="${x}" y="${y}" width="${w}" height="36" rx="18" fill="${kleur || h.K.inkt}"/>`; x += w + (i % 3 === 2 ? 56 : 22); });
  return s; };
// document (verdrag) met regels en een rood zegel
const verdrag = (h, x = 540, y = 1060, p = 1) => `<g opacity="${p.toFixed(3)}" filter="url(#sch)" transform="translate(0 ${((1 - p) * 60).toFixed(1)})"><rect x="${x - 260}" y="${y - 300}" width="520" height="600" rx="10" fill="#FFFFFF"/>`
  + Array.from({ length: 9 }, (_, i) => `<rect x="${x - 200}" y="${y - 230 + i * 50}" width="${i === 4 ? 230 : 400}" height="16" rx="8" fill="${i === 4 ? h.K.signaal : '#CFC9BC'}"/>`).join('')
  + `<circle cx="${x + 150}" cy="${y + 210}" r="56" fill="${h.K.signaal}"/><text x="${x + 150}" y="${y + 224}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="34" fill="#FFFFFF">1927</text></g>`;

module.exports = {
  code: 'YS19',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-11-25-YS19-mayday',
  nummer: 'No. 19',
  onderwerp: 'THE WORD "MAYDAY"',
  pakket: {
    dag: 'woensdag 25 november 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why do pilots shout "Mayday"? It\'s French (sort of)',
    intro: 'Mayday is the spoken distress call on the radio. It comes from French: "m\'aider", help me. Written the English way.',
    feiten: ['February 1923: The Times reported that the distress signal "S.O.S." would give place to the words "May-day", "the phonetic equivalent of \'M\'aidez\'".',
      'The call is credited to F.S. "Stanley" Mockford, radio officer at Croydon Airport, London, in 1923 (Historic Croydon Airport Trust). The press of the time did not name him.',
      '1927, Washington: the General Regulations of the International Radiotelegraph Convention set the radiotelephone distress call as the spoken word MAYDAY, "corresponding to the French pronunciation of the expression m\'aider".'],
    bronnen: [['ITU, General Regulations annexed to the International Radiotelegraph Convention (Washington, 1927), Art. 19', 'https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.4.48.en.100.pdf'],
      ['Historic Croydon Airport Trust, "History"', 'https://www.historiccroydonairport.org.uk/history/'],
      ['David Wilton, Wordorigins.org, "mayday" (quoting The Times, 2 February 1923)', 'https://wordorigins.org/big-list-entries/mayday']],
    hashtags: '#Shorts #history #aviation #words',
    tags: 'mayday, mayday meaning, why do pilots say mayday, m\'aider, distress call, radio history, Croydon Airport, 1927 radiotelegraph convention, history of everyday things, why things are the way they are, shorts',
    md: [['ITU, General Regulations annexed to the International Radiotelegraph Convention (Washington, 1927), art. 19 "Distress Call" (scan van de HMSO-uitgave, Londen 1928)', 'https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.4.48.en.100.pdf',
      ['"(2) The same rules apply to the radiotelephone distress call which consists of the spoken expression MAYDAY (corresponding to the French pronunciation of the expression "m\'aider")."', 'Washington, 1927 (titel van het verdrag)']],
      ['Historic Croydon Airport Trust, "History"', 'https://www.historiccroydonairport.org.uk/history/',
      ['"the international distress call "Mayday" was created by London Croydon Airport Radio Officer F.S. "Stanley" Mockford in 1923"']],
      ['David Wilton, Wordorigins.org, "mayday"', 'https://wordorigins.org/big-list-entries/mayday',
      ['citaat uit The Times, 2 feb 1923: "the international distress signal "S.O.S." will give place to the words "May-day," the phonetic equivalent of "M\'aidez.""', '"It\'s often claimed that mayday was coined by Frederick Stanley Mockford…" / "While plausible, this claim is undocumented." → in de video "credited to"']]],
    niet: '- Merriam-Webster (bron in het plan) gaf op 7 nov een 403; daarom de verdragstekst, Croydon en Wordorigins. Niet gezegd: "venez m\'aider" (alleen in zwakkere bronnen), waarom SOS op de radio slecht zou werken (geen bron), en dat Mockford het zeker bedacht heeft (alleen "credited"). Microfoon, morse en document zijn een eigen tekening.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.0, stem: "Mayday is French. Sort of.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => groot(h, 'MAYDAY', 1050, 190) + h.kin('Mayday is *French*. Sort of.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg },
    // 2 · de radio-noodroep
    { duur: 3.4, stem: "It's the spoken distress call on the radio.", in: 'zweep', camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'stijg', 0.4]],
      teken: h => micro(h, 540, 1060, h.klem((h.t - 0.8) / 1.2)) + h.kin('The spoken *distress call* on the radio.', { y: 300, g: 92, t: h.t, start: 0.05 }).svg },
    // 3 · Times 1923: SOS maakt plaats
    { duur: 3.8, stem: "February 1923. The Times reports: S-O-S will give way to the words May-day.", in: 'op', bron: TIMES, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [2.0] }, geluid: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => [0.6 + i * 0.12, 'tik', 0.6]),
      teken: h => h.kin('*1923*. S.O.S. will give way to the words *"May-day"*.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg
        + morse(h, 1000, h.klem((h.t - 0.6) / 1.1), h.t > 2.0 ? '#B9B4A8' : null)
        + (h.t > 2.0 ? `<text x="540" y="1250" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="120" fill="${h.K.signaal}" opacity="${h.klem((h.t - 2.0) / 0.3).toFixed(3)}">MAY-DAY</text>` : '') },
    // 4 · de klank van het Franse m'aidez
    { duur: 3.6, stem: "Why May-day? It's how the French m'aidez sounds.", in: 'zweep', bron: TIMES, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.6] }, geluid: [[1.6, 'klap', 0.7]],
      teken: h => { const p = h.zacht((h.t - 1.0) / 0.6);
        return h.kin('Why? It\'s how the French *m\'aidez* sounds.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg
          + `<text x="540" y="${(980 - p * 40).toFixed(1)}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="140" fill="${h.K.inkt}" opacity="${(1 - p * 0.65).toFixed(3)}">m'aidez</text>`
          + `<text x="540" y="1220" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="140" fill="${h.K.signaal}" opacity="${p.toFixed(3)}">mayday</text>`
          + `<path d="M 540 1020 L 540 1100" stroke="${h.K.grijs}" stroke-width="8" opacity="${p.toFixed(3)}" marker-end=""/><polygon points="515,1095 565,1095 540,1130" fill="${h.K.grijs}" opacity="${p.toFixed(3)}"/>`; } },
    // 5 · help me
    { duur: 2.8, stem: "M'aidez. Help me.", in: 'flits', camera: { zoom: [1, 1.06], stoot: [0.9] }, geluid: [[0.9, 'ding', 0.6]],
      teken: h => groot(h, 'HELP ME', 1050, 170) + h.kin('*M\'aidez*: help me.', { y: 300, g: 110, t: h.t, start: 0.05 }).svg },
    // 6 · Croydon, 1923, toegeschreven aan Mockford
    { duur: 4.0, stem: "It's credited to Stanley Mockford, a radio officer at Croydon Airport in London.", in: 'op', bron: CROY, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'stijg', 0.4], [2.4, 'pop', 0.6]],
      teken: h => micro(h, 540, 1080, h.klem((h.t - 1.4) / 1.0)) + h.kin('Credited to *Stanley Mockford*, radio officer at Croydon Airport, London.', { y: 290, g: 82, t: h.t, start: 0.05 }).svg },
    // 7 · 1927, Washington: officieel
    { duur: 4.0, stem: "1927, Washington. An international radio convention makes it official.", in: 'zweep', bron: ITU, bronStart: 2.4, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [2.2, 'klap', 0.6]],
      teken: h => verdrag(h, 540, 1000, h.klem((h.t - 1.0) / 0.5)) + h.kin('*1927*, Washington. An international radio convention makes it *official*.', { y: 300, g: 80, t: h.t, start: 0.05 }).svg },
    // 8 · de regel zelf
    { duur: 4.2, stem: "The spoken word Mayday, corresponding to the French pronunciation of m'aider.", in: 'masker', nacht: true, bron: ITU, bronStart: 2.6, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [2.6, 'ding', 0.6]],
      teken: h => h.kin('"The spoken expression *MAYDAY*, corresponding to the French pronunciation of *m\'aider*."', { y: 380, g: 84, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 9 · slot
    { duur: 3.6, stem: "Help me, in French. Spelled in English.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => groot(h, 'MAYDAY', 1050, 190)
        + h.kin('Help me, in French. *Spelled in English.*', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
