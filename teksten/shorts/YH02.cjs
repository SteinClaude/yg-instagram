// YH02 — Why Danes throw cinnamon at 25-year-olds. (kanaal 2, "vreemd maar waar")
// Reeks A · Weird but Real. Stijl kanaal 2: echte vrije foto onder grote witte woorden (gereedschap/short.cjs, kanaal: 2).
// Bron (gelezen 4 nov 2026): The Local Denmark, "Why do Danes cover each other in cinnamon on their 25th birthdays?"
// (Elizabeth Anne Brown, 18 feb 2022). Elke bewering staat daarin; zie pakketten/<map>/bron/bronnen.md.
// Scènes met de sterk ingezoomde paalfoto krijgen geen zweep/op-overgang: die combinatie laat resvg crashen.
// Beeld 1 (CC0) toont ook een echt café en kentekens: die vallen buiten de uitsnede (zoom op de kaneel rond de paal).
const TL = 'The Local Denmark (2022)';
const B = n => `pakketten/2026-11-17-YH02-kaneel/bron/beeld-${n}.jpg`;

const tekst = (h, s, o = {}) => `<g filter="url(#schKlein)">${h.kin(s, { y: 330, g: 104, kleur: '#FFFFFF', accent: h.K.geel, t: h.t, ...o }).svg}</g>`;
const donker = (s, op = 0.5) => `${s}<rect width="1080" height="1920" fill="#000" fill-opacity="${op}"/>`;   // fill-opacity en binnen beeld: resvg crasht op opacity buiten beeld in een zweep
// kaneelpaal: alleen het onderste deel van beeld 1 (café en auto's buiten beeld)
const paalFoto = (h, z0 = 2.3, z1 = 2.5) => donker(h.foto(B(1), { t: h.t, duur: h.duur, zoom: [z0, z1], midden: [700, 1560] }), 0.38);
// vallende kaneel (eigen animatie)
const kaneel = (h, t0 = 0, n = 70) => { let s = '';
  if (h.t < t0) return '';
  for (let i = 0; i < n; i++) { const tt = (h.t - t0 + (i % 14) * 0.065) % 0.9;
    const x = 250 + ((i * 97) % 580), y = 760 + tt * 800 + Math.sin(i + tt * 6) * 10; if (y > 1270) continue;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${4 + (i % 4) * 2}" fill="${i % 3 ? '#A0602F' : '#C98A4B'}"/>`; }
  return s; };
const lantaarn = (h) => `<g filter="url(#sch)"><rect x="520" y="840" width="40" height="440" fill="#3B3F4A"/><rect x="470" y="800" width="140" height="60" rx="14" fill="#2D3140"/><circle cx="540" cy="870" r="22" fill="${h.K.geel}"/></g>`;
const groot = (h, s, y = 900, g = 260) => { const q = h.veer(h.t / 0.3);
  return `<g filter="url(#schKlein)"><text x="540" y="${(y - (1 - q) * 200).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.geel}" opacity="${h.klem(h.t / 0.1)}">${s}</text></g>`; };

module.exports = {
  code: 'YH02',
  versie: 2,
  kanaal: 2,
  reeks: 'WEIRD BUT REAL · DENMARK',
  map: '2026-11-17-YH02-kaneel',
  nummer: '', onderwerp: '',
  pakket: {
    dag: 'dinsdag 17 november 2026', gelezen: 'wo 4 nov 2026',
    titel: 'Why Danes Throw Cinnamon at 25-Year-Olds',
    intro: 'In Denmark, if you turn 25 and you are not married, your friends may tie you to a lamppost and cover you in cinnamon. The custom goes back centuries.',
    feiten: ['Unwed 25-year-olds in Denmark can look forward to a "cinnamon shower"; you may see a young person tied to a lamppost and smothered in cinnamon.',
      'It is the tradition of the "pebersvend" (for women "pebermø"), roughly "pepper dude".',
      'Its earliest roots go back to the 15th century: young bachelors travelled around the world to trade spices and never stayed anywhere long enough to get married.',
      'By the 1980s, mass media had spread the idea to the whole of Denmark.',
      'Still not married at 30? You may get a cheeky pepper and salt mill set as a birthday present.',
      'Careful: people have actually been endangered by inhaling all that cinnamon.'],
    bronnen: [['The Local Denmark, "Why do Danes cover each other in cinnamon on their 25th birthdays?" (Elizabeth Anne Brown, February 18, 2022)', 'https://www.thelocal.dk/20220218/why-do-danes-cover-each-other-in-cinnamon-on-their-25th-birthdays']],
    hashtags: '#Shorts #denmark #weirdbuttrue #traditions',
    tags: 'denmark cinnamon tradition, cinnamon 25th birthday, danish traditions, pebersvend, weird traditions, weird but true, strange customs, danish culture, cinnamon shower, shorts',
    md: [['The Local Denmark, "Why do Danes cover each other in cinnamon on their 25th birthdays?" (Elizabeth Anne Brown, 18 feb 2022)', 'https://www.thelocal.dk/20220218/why-do-danes-cover-each-other-in-cinnamon-on-their-25th-birthdays',
      ['"don\'t be alarmed if you see a young person tied to a lamppost and smothered in cinnamon"', '"While unwed 25-year-olds can look forward to a cinnamon shower"; een set met "duct tape to affix the celebrant to a lamppost"', '"the Danish tradition of the pebersvend, or pebermø for women"; "most closely approximated in English as \'pepper dude.\'"', '"The tradition\'s earliest roots date back to the 15th century"; "Young bachelors went traveling to trade spices around the world"; "They would never stay in a place long enough to get married"', '"by the 1980s mass media ensured that the idea had spread to the whole of Denmark"', '"Danes who still aren\'t hitched by 30 may receive a cheeky pepper and salt mill set as a birthday present"', '"people actually having been endangered by inhaling all of this cinnamon"']]],
    niet: '- Niet gezegd: water of eieren om de kaneel te laten plakken (niet in de bron), dat 30-jarigen met peper worden bespoten (de bron zegt "at least according to the companies selling pepper cannons": te zwak), een vertaling van "pebermø" (de bron geeft die niet). Op beeld 1 staan een café en auto\'s; die vallen buiten de uitsnede. De lantaarnpaal en de vallende kaneel zijn eigen animatie.',
  },
  scenes: [
    // 1 · HAAK: de kaneelberg rond de paal, harde zoom
    { duur: 3.4, camera: { zoom: [1, 1.05], stoot: [0.25], schud: [0.25] }, geluid: [[0.22, 'klap'], [0.22, 'boem', 0.8]],
      achter: h => paalFoto(h, 2.7 - 0.3 * h.uit(h.t / 0.3), 2.5),
      teken: h => tekst(h, 'In Denmark, turning 25 and single gets you *covered in cinnamon*.', { g: 96, start: 0.3 }) },
    // 2 · vastgetapet aan een lantaarnpaal, dan de kaneeldouche
    { duur: 3.8, in: 'flits', bron: TL, bronStart: 2.4, camera: { zoom: [1, 1.04] }, geluid: [[1.2, 'rol', 0.6], [1.5, 'whoosh', 0.4]],
      achter: h => donker(h.foto(B(2), { t: h.t, duur: h.duur, zoom: [1.1, 1.2] }), 0.65),
      teken: h => tekst(h, 'Taped to a *lamppost*. Then: a cinnamon shower.', { g: 100, start: 0.05 }) + lantaarn(h) + kaneel(h, 1.2) },
    // 3 · het begon in de 15e eeuw
    { duur: 3.2, in: 'op', bron: TL, bronStart: 1.8, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      achter: h => donker(h.foto(B(3), { t: h.t, duur: h.duur, zoom: [1.05, 1.15] }), 0.55),
      teken: h => tekst(h, 'Why? It goes back to the', { g: 96, start: 0.4 }) + groot(h, '1400s', 900) },
    // 4 · vrijgezellen reisden de wereld rond voor de specerijenhandel
    { duur: 3.4, in: 'flits', bron: TL, bronStart: 2.0, camera: { zoom: [1.06, 1.0] }, geluid: [[1.2, 'pop', 0.7]],
      achter: h => donker(h.foto(B(3), { t: h.t, duur: h.duur, zoom: [1.3, 1.2], pan: [[0, 60], [0, -60]] }), 0.5),
      teken: h => tekst(h, 'Young bachelors travelled the world to *trade spices*.', { g: 100, start: 0.05 }) },
    // 5 · nooit lang genoeg op één plek om te trouwen
    { duur: 3.4, in: 'zweep', bron: TL, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.6, 'boem', 0.4]],
      achter: h => donker(h.foto(B(2), { t: h.t, duur: h.duur, zoom: [1.3, 1.15] }), 0.55),
      teken: h => tekst(h, 'They never stayed anywhere long enough to *get married*.', { g: 100, start: 0.05 }) },
    // 6 · de naam: pebersvend, "pepper dude"
    { duur: 3.6, in: 'op', bron: TL, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.3] }, geluid: [[1.28, 'klap', 0.7], [1.3, 'ding', 0.5]],
      achter: h => `<rect x="-40" y="-40" width="1160" height="2000" fill="#1B1E2B"/>`,
      teken: h => tekst(h, 'The name for them:', { g: 96, start: 0.05 }) + groot(h, 'pebersvend', 860, 150)
        + tekst(h, 'roughly: "pepper dude"', { y: 1000, g: 80, start: 1.6, gewicht: 'regular' }) },
    // 7 · nog vrijgezel op je 30e: een peper- en zoutstel
    { duur: 3.4, in: 'flits', bron: TL, bronStart: 2.0, camera: { zoom: [1.05, 1.0] }, geluid: [[1.2, 'pop', 0.8]],
      achter: h => donker(h.foto(B(4), { t: h.t, duur: h.duur, zoom: [1.05, 1.15] }), 0.45),
      teken: h => tekst(h, 'Still single at *30*? You may get a *pepper mill* as a present.', { g: 96, start: 0.05 }) },
    // 8 · in de jaren 80 door heel Denemarken
    { duur: 3.4, in: 'masker', bron: TL, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'rol', 0.5]],
      achter: h => paalFoto(h, 2.35, 2.5),
      teken: h => tekst(h, 'By the *1980s*, the custom had spread across all of Denmark.', { g: 96, start: 0.05 }) },
    // 9 · let op: zoveel kaneel inademen is gevaarlijk
    { duur: 3.2, in: 'flits', bron: TL, bronStart: 1.8, camera: { zoom: [1.04, 1.0] }, geluid: [[1.0, 'ding', 0.6]],
      achter: h => donker(h.foto(B(2), { t: h.t, duur: h.duur, zoom: [1.4, 1.3] }), 0.6),
      teken: h => tekst(h, 'One warning: people have been *endangered* by inhaling all that cinnamon.', { g: 90, start: 0.05 }) },
    // 10 · slot: de kaneelberg; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.6, in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[2.7, 'whoosh', 0.5]],
      achter: h => paalFoto(h, 2.4, 2.6),
      teken: h => tekst(h, '25 and single in Denmark? *Cinnamon.*', { g: 108, start: 0.1, weg: 2.8 })
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="#E8E4DA" opacity="${(h.klem((h.t - 1.4) / 0.4) * (1 - h.klem((h.t - 2.8) / 0.3))).toFixed(3)}">Source and photo credits in the description.</text>` },
  ],
};
