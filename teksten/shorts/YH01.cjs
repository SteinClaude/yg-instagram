// YH01 — In 1932, Australia went to war against emus. (kanaal 2, "vreemd maar waar")
// Reeks B · Weird History. Stijl kanaal 2: echte vrije foto onder grote witte woorden (gereedschap/short.cjs, kanaal: 2).
// Bron (gelezen 4 nov 2026): ABC News (Australië), "Australia's Emu War spawns feature film, jokes and memes 90 years on"
// (10 dec 2022). Elke bewering staat daarin; zie pakketten/<map>/bron/bronnen.md. Beelden: Wikimedia Commons (CC0, PD,
// CC BY), zie bron/beelden.json. Geen beelden van dode dieren. Niet gezegd: "de emoes wonnen" (de bron zegt het niet zo).
const ABC = 'ABC News (Australia), "Australia\'s Emu War…" (2022)';
const B = n => `pakketten/2026-11-16-YH01-emoe-oorlog/bron/beeld-${n}.jpg`;
// donkere waas over een lichte foto (het gouden graan), zodat geel en wit leesbaar blijven
const donker = (s, op = 0.5) => `${s}<rect width="1080" height="1920" fill="#000" fill-opacity="${op}"/>`;   // fill-opacity en binnen beeld: resvg crasht op opacity buiten beeld in een zweep

// grote witte tekst met gele nadruk en schaduw
const tekst = (h, s, o = {}) => `<g filter="url(#schKlein)">${h.kin(s, { y: 330, g: 104, kleur: '#FFFFFF', accent: h.K.geel, t: h.t, ...o }).svg}</g>`;
// archieffoto in een lijst (het beeld uit 1932 is klein: niet schermvullend)
const archief = (h, p) => p <= 0 ? '' : `<g transform="translate(540 1000) rotate(${(-3 * (1 - p)).toFixed(2)}) scale(${(0.85 + 0.15 * h.veer(p)).toFixed(3)}) translate(-540 -1000)">`
  + `<rect x="80" y="730" width="920" height="540" fill="#F3EEDF" filter="url(#sch)"/>`
  + h.foto(B(2), { x: 100, y: 750, w: 880, h: 500, t: h.t, duur: h.duur, zoom: [1, 1.04] }) + '</g>';
// teller
const teller = (h, n, y = 1060, g = 220) => `<g filter="url(#schKlein)"><text x="540" y="${y}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${g}" fill="${h.K.geel}">${n}</text></g>`;

module.exports = {
  code: 'YH01',
  versie: 2,
  kanaal: 2,
  reeks: 'WEIRD HISTORY · 1932',
  map: '2026-11-16-YH01-emoe-oorlog',
  nummer: '', onderwerp: '',
  pakket: {
    dag: 'maandag 16 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'The Time Australia Went to War Against Emus',
    intro: 'In 1932, up to 20,000 emus moved onto farms in Western Australia. The army sent soldiers with machine guns.',
    feiten: ['Up to 20,000 migrating emus found their way onto farms in the Western Australian Wheatbelt, destroying fences and valuable grain.',
      'On November 2, 1932, three soldiers of the Royal Australian Artillery arrived in Campion, led by Major G.P.W. Meredith.',
      'On November 4, an ambush went awry when a machine gun jammed: just 12 of the 1,000 assembled birds were killed.',
      'Major Meredith: "They could face machine guns with the invulnerability of tanks."',
      'A newspaper at the time, the Daily News: "The emus are more than holding their own."',
      'After 2,500 rounds of ammunition, between 300 and 500 emus had been killed. The army made its final withdrawal on December 10.'],
    bronnen: [['ABC News (Australia), "Australia\'s Emu War spawns feature film, jokes and memes 90 years on" (December 10, 2022)', 'https://www.abc.net.au/news/2022-12-10/great-emu-war-90-years-on-army-wheatbelt-battle-history/101752238']],
    hashtags: '#Shorts #history #weirdhistory #australia',
    tags: 'emu war, great emu war, australia emu war 1932, weird history, strange history, emus, western australia, major meredith, history facts, weird but true, shorts',
    md: [['ABC News (Australië), "Australia\'s Emu War spawns feature film, jokes and memes 90 years on" (10 dec 2022)', 'https://www.abc.net.au/news/2022-12-10/great-emu-war-90-years-on-army-wheatbelt-battle-history/101752238',
      ['"As many as 20,000 migrating emus found their way onto farms after breeding"; "destroying fences and valuable grain"', 'Campion, Western Australian Wheatbelt; drie soldaten van de Royal Australian Artillery kwamen op 2 november 1932 aan; "Major GPW Meredith, who was heading the mission"', '"An ambush on November 4 went awry when a machine gun jammed"; "just 12 of the 1,000 assembled birds killed"', 'Meredith: "They could face machine guns with the invulnerability of tanks."', 'Daily News (toen): "The emus are more than holding their own."', '"2,500 rounds of ammunition had been used"; "between 300 and 500 emus"; "final withdrawal on December 10"', 'opening van het artikel: "How did the Australian Army lose a war to a bunch of flightless birds?"']]],
    niet: '- Niet gezegd: dat de emoes "wonnen" of dat het leger "verloor" (alleen de openingsvraag van ABC zegt dat; de video citeert de krant van toen), het type machinegeweer (niet in de bron), de tweede fase met de "duizenden" die Meredith claimde (omstreden). Geen beelden van dode dieren; de foto van soldaten uit 1932 is publiek domein.',
  },
  scenes: [
    // 1 · HAAK: emoekop, harde zoom
    { duur: 3.2, camera: { zoom: [1, 1.05], stoot: [0.25], schud: [0.25] }, geluid: [[0.22, 'klap'], [0.22, 'boem', 0.8]],
      achter: h => h.foto(B(1), { t: h.t, duur: h.duur, zoom: [1.35 - 0.25 * h.uit(h.t / 0.3), 1.18] }),
      teken: h => tekst(h, 'In 1932, Australia went to *war*. Against *birds*.', { start: 0.3 }) },
    // 2 · tot 20.000 emoes op de boerderijen
    { duur: 3.4, in: 'zweep', bron: ABC, bronStart: 2.0, camera: { zoom: [1, 1.04] }, geluid: [[0.8, 'rol', 0.6], [1.6, 'klap', 0.6]],
      achter: h => h.foto(B(4), { t: h.t, duur: h.duur, zoom: [1.05, 1.15], pan: [[0, 40], [0, -40]] }),
      teken: h => tekst(h, 'Up to', { g: 96, start: 0.05 }) + teller(h, Math.round(20000 * h.uit((h.t - 0.5) / 1.1)).toLocaleString('en-US'), 900, 230)
        + tekst(h, '*emus* moved onto farms in Western Australia.', { y: 1030, g: 76, start: 1.2 }) },
    // 3 · ze vernielden hekken en graan
    { duur: 3.0, in: 'flits', bron: ABC, bronStart: 1.6, camera: { zoom: [1.06, 1.0] }, geluid: [[0.9, 'klap', 0.6], [1.4, 'klap', 0.6]],
      achter: h => donker(h.foto(B(3), { t: h.t, duur: h.duur, zoom: [1.1, 1.2], pan: [[-60, 0], [60, 0]] })),
      teken: h => tekst(h, 'Destroying *fences* and *grain*.', { g: 116, start: 0.05 }) },
    // 4 · het leger stuurt soldaten met machinegeweren
    { duur: 3.6, in: 'op', bron: ABC, bronStart: 2.2, camera: { zoom: [1, 1.04], stoot: [1.2] }, geluid: [[1.2, 'klap', 0.8], [1.2, 'boem', 0.5]],
      achter: h => `<rect x="-40" y="-40" width="1160" height="2000" fill="#2A2620"/>`,
      teken: h => tekst(h, 'So the army sent soldiers. With *machine guns*.', { g: 100, start: 0.05 }) + archief(h, h.klem((h.t - 0.9) / 0.4)) },
    // 5 · 4 november: hinderlaag, het geweer loopt vast, 12 van de 1.000
    { duur: 4.0, in: 'zweep', bron: ABC, bronStart: 2.6, camera: { zoom: [1, 1.05], schud: [1.6] }, geluid: [[1.0, 'tik', 0.9], [1.15, 'tik', 0.9], [1.3, 'tik', 0.9], [1.6, 'boem', 0.5], [2.6, 'pop', 0.8]],
      achter: h => h.foto(B(1), { t: h.t, duur: h.duur, zoom: [1.2, 1.3], pan: [[80, 0], [40, 0]] }),
      teken: h => tekst(h, 'November 4: an ambush. A machine gun *jammed*.', { g: 92, start: 0.05 })
        + (h.t > 2.4 ? teller(h, '12 / 1,000', 1080, 150) + tekst(h, 'birds killed', { y: 1180, g: 72, start: 2.6 }) : '') },
    // 6 · Meredith: "zo onkwetsbaar als tanks"
    { duur: 3.8, in: 'masker', bron: ABC, bronStart: 2.4, camera: { zoom: [1.08, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [2.0, 'boem', 0.6]],
      achter: h => h.foto(B(4), { t: h.t, duur: h.duur, zoom: [1.25, 1.12] }),
      teken: h => tekst(h, 'The major in charge: "They could face machine guns with the invulnerability of *tanks*."', { g: 88, start: 0.05 }) },
    // 7 · een krant: de emoes houden zich meer dan staande
    { duur: 3.6, in: 'flits', bron: ABC, bronStart: 2.2, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'pop', 0.7]],
      achter: h => donker(h.foto(B(3), { t: h.t, duur: h.duur, zoom: [1.2, 1.1] })),
      teken: h => tekst(h, 'A newspaper: "The emus are more than *holding their own*."', { g: 96, start: 0.05 })
        + `<g opacity="${h.klem((h.t - 1.3) / 0.3).toFixed(3)}" filter="url(#sch)" transform="rotate(-4 540 1080)"><rect x="200" y="960" width="680" height="240" fill="#F3EEDF"/><text x="540" y="1040" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="44" fill="${h.K.inkt}">DAILY NEWS · 1932</text><line x1="240" y1="1090" x2="840" y2="1090" stroke="${h.K.inkt}" stroke-width="6"/><line x1="240" y1="1130" x2="780" y2="1130" stroke="#8A867C" stroke-width="6"/><line x1="240" y1="1165" x2="820" y2="1165" stroke="#8A867C" stroke-width="6"/></g>` },
    // 8 · 2.500 kogels, 300 tot 500 emoes
    { duur: 3.6, in: 'op', bron: ABC, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [2.0] }, geluid: [[0.8, 'rol', 0.6], [2.0, 'klap', 0.7]],
      achter: h => `<rect x="-40" y="-40" width="1160" height="2000" fill="#1B1E2B"/>`,
      teken: h => teller(h, Math.round(2500 * h.uit((h.t - 0.3) / 1.4)).toLocaleString('en-US'), 760, 240)
        + tekst(h, 'rounds of ammunition.', { y: 860, g: 84, start: 0.6 }) + tekst(h, 'Between *300 and 500* emus.', { y: 1080, g: 84, start: 1.9 }) },
    // 9 · het leger trekt zich terug
    { duur: 3.2, in: 'zweep', bron: ABC, bronStart: 1.8, camera: { zoom: [1.04, 1.0] }, geluid: [[0.8, 'whoosh', 0.5]],
      achter: h => h.foto(B(1), { t: h.t, duur: h.duur, zoom: [1.1, 1.0] }),
      teken: h => tekst(h, 'December 10: the army\'s *final withdrawal*.', { g: 104, start: 0.05 }) },
    // 10 · slot: terug naar de emoe; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.6, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.7, 'whoosh', 0.5]],
      achter: h => h.foto(B(1), { t: h.t, duur: h.duur, zoom: [1.2, 1.35] }),
      teken: h => tekst(h, 'The emus held *their ground*.', { g: 112, start: 0.1, weg: 2.8 })
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#E8E4DA" opacity="${(h.klem((h.t - 1.4) / 0.4) * (1 - h.klem((h.t - 2.8) / 0.3))).toFixed(3)}">Source and photo credits in the description.</text>` },
  ],
};
