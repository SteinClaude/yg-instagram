// YS32 — Monopoly began as a game against landlords.
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Google Patents US748626 (Lizzie J. Magie, "Game-board", verleend 5 jan 1904);
// The Strong National Museum of Play, "Making Monopoly" (Google Arts & Culture); NPR (3 maart 2015, via KPBS);
// Mental Floss (David W. Brown, 2013). Smithsonian (plan-bron) gaf eerder een 403. Niet gezegd: dat Darrow het
// spel "stal" (interpretatie), bedragen, en wat Parker Brothers met Magie afsprak.
const PAT = 'US Patent 748,626 (1904)';
const STR = 'The Strong Museum, "Making Monopoly"';
const NPR = 'NPR (2015)';
const MF = 'Mental Floss (2013)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// spelbord (eigen ontwerp, geen echt spel); n = 0..1 hoeveel vakjes
const bord = (h, x = 540, y = 960, n = 1, s = 1, titel = '') => { const z = 600, v = z / 9; let r = `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s.toFixed(3)}) translate(${-x} ${-y})"><rect x="${x - z / 2 - 60}" y="${y - z / 2 - 60}" width="${z + 120}" height="${z + 120}" fill="#E8E2CF" stroke="${h.K.inkt}" stroke-width="8"/>`;
  const kl = ['#D9432B', '#F2C230', '#2F7D5B', '#5E7A92'];
  for (let k = 0; k < 4; k++) for (let i = 0; i < 9; i++) { if ((k * 9 + i) / 36 > n) continue;
    let rx, ry, w, hh; if (k === 0) { rx = x + z / 2 - (i + 1) * v; ry = y + z / 2; w = v; hh = 60; } else if (k === 1) { rx = x - z / 2 - 60; ry = y + z / 2 - (i + 1) * v; w = 60; hh = v; }
    else if (k === 2) { rx = x - z / 2 + i * v; ry = y - z / 2 - 60; w = v; hh = 60; } else { rx = x + z / 2; ry = y - z / 2 + i * v; w = 60; hh = v; }
    r += `<rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" fill="${i % 3 === 1 ? kl[k] : '#F6F1E3'}" stroke="${h.K.inkt}" stroke-width="3"/>`; }
  if (titel) r += `<text x="${x}" y="${y + 18}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="52" fill="${h.K.inkt}">${titel}</text>`;
  return r + '</g>'; };
// huisje
const huisje = (h, x, y, kleur, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})" filter="url(#sch)"><rect x="-40" y="-30" width="80" height="60" fill="${kleur}" stroke="${h.K.inkt}" stroke-width="4"/><path d="M -50 -30 L 0 -75 L 50 -30 Z" fill="${kleur}" stroke="${h.K.inkt}" stroke-width="4"/></g>`;
// stapel munten die naar één kant schuift; p = 0..1
const munten = (h, p) => { let s = ''; for (let i = 0; i < 14; i++) { const links = i < 7; const x0 = links ? 340 : 740, x1 = 740; const x = links ? x0 + (x1 - x0) * h.zacht(p * 1.4 - i * 0.05) : x0; const st = links ? i : i - 7;
  const yy = 1150 - (links && p > 0.3 ? (7 + st) : st) * 34; s += `<ellipse cx="${x.toFixed(1)}" cy="${yy}" rx="90" ry="22" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="4"/>`; } return `<g filter="url(#sch)">${s}</g>`; };
// grond met hek
const grond = (h, p) => `<g filter="url(#sch)"><rect x="140" y="900" width="800" height="300" fill="#7FA36B" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 9 }, (_, i) => i / 9 > p ? '' : `<rect x="${150 + i * 96}" y="860" width="18" height="120" fill="#8C5E3C"/>`).join('')
  + (p > 0.5 ? `<rect x="150" y="890" width="${(780 * h.klem((p - 0.5) * 2)).toFixed(1)}" height="14" fill="#8C5E3C"/>` : '') + '</g>';
// doos
const doos = (h, x = 540, y = 1000, p = 1) => `<g opacity="${p.toFixed(3)}" filter="url(#sch)"><rect x="${x - 280}" y="${y - 160}" width="560" height="320" rx="10" fill="${h.K.signaal}" stroke="${h.K.inkt}" stroke-width="6"/><rect x="${x - 240}" y="${y - 50}" width="480" height="100" fill="#FBF6EA"/><text x="${x}" y="${y + 20}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="54" fill="${h.K.inkt}">BOARD GAME</text></g>`;

module.exports = {
  code: 'YS32',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-08-YS32-monopoly',
  nummer: 'No. 32',
  onderwerp: 'THE BOARD GAME',
  pakket: {
    dag: 'dinsdag 8 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Monopoly began as a game against landlords',
    intro: 'In 1904 Lizzie Magie patented The Landlord\'s Game, to show the tragic effects of land-grabbing. Thirty years later it was sold as Monopoly.',
    feiten: ['In 1904 Lizzie Magie patented The Landlord\'s Game (US Patent 748,626, granted January 5, 1904; NPR).',
      'Reformer Henry George proposed a single tax on land; Magie\'s game was a playful way to spread his philosophies (The Strong).',
      'It was meant to demonstrate the tragic effects of land-grabbing (Mental Floss) and was an argument against the concentration of wealth (NPR).',
      'Out of work because of the Great Depression, Charles Darrow began producing copies of Monopoly in his home (The Strong). He got the game through a friend and sold it to Parker Brothers as his own (NPR).',
      'Parker Brothers purchased the rights to publish it in 1935, and sales skyrocketed (The Strong).'],
    bronnen: [['Lizzie J. Magie, "Game-board", US Patent 748,626 (granted January 5, 1904), Google Patents', 'https://patents.google.com/patent/US748626A/en'],
      ['The Strong National Museum of Play, "Making Monopoly" (Google Arts & Culture)', 'https://artsandculture.google.com/story/8wXRngw0ZZDFLQ'],
      ['NPR Staff, "Ever Cheat At Monopoly? So Did Its Creator" (March 3, 2015, via KPBS)', 'https://www.kpbs.org/news/news/arts-culture/2015/03/03/ever-cheat-at-monopoly-so-did-its-creator-he-stole-the-idea-from-a-woman'],
      ['David W. Brown, "Retrobituaries: Elizabeth Magie", Mental Floss (February 6, 2013)', 'https://www.mentalfloss.com/article/48787/retrobituaries-elizabeth-lizzie-magie-inventor-monopoly']],
    hashtags: '#Shorts #history #boardgames #inventions',
    tags: 'Monopoly, Monopoly history, Landlord\'s Game, Lizzie Magie, Henry George, Charles Darrow, Parker Brothers 1935, board game history, history of everyday things, why things are the way they are, shorts',
    md: [['Lizzie J. Magie, "Game-board", US 748,626 (aangevraagd 23 mrt 1903, verleend 5 jan 1904)', 'https://patents.google.com/patent/US748626A/en',
      ['"My invention which I have designated The landlords game, relates to gameboards" (het patent noemt het doel niet)']],
      ['The Strong National Museum of Play, "Making Monopoly" (Google Arts & Culture)', 'https://artsandculture.google.com/story/8wXRngw0ZZDFLQ',
      ['"Reformer Henry George proposed remedying these inequalities with a single tax on land."', '"a uniquely playful way to spread Henry George\'s philosophies"', 'patent "in 1904"', '"Out of work because of the Great Depression, Charles Darrow began producing copies of Monopoly in his home."', '"Parker Brothers purchased the rights to publish it in 1935 and sales skyrocketed."']],
      ['NPR Staff (3 maart 2015, via KPBS)', 'https://www.kpbs.org/news/news/arts-culture/2015/03/03/ever-cheat-at-monopoly-so-did-its-creator-he-stole-the-idea-from-a-woman',
      ['"In 1904, Magie patented something called the Landlord\'s Game"', 'een "argument against the concentration of wealth"', 'Darrow "got his hands on the game through a Quaker friend" en bood het Parker Brothers aan als zijn eigen werk']],
      ['David W. Brown, Mental Floss (6 feb 2013)', 'https://www.mentalfloss.com/article/48787/retrobituaries-elizabeth-lizzie-magie-inventor-monopoly',
      ['"to demonstrate the tragic effects of land-grabbing"']]],
    niet: '- Smithsonian (plan-bron) gaf eerder een 403. Niet gezegd: dat Darrow het spel "stal" (de kop van NPR; de video zegt dat hij het als zijn eigen werk verkocht), wat Parker Brothers aan Magie betaalde, de "twee spelregels" van haar spel, en het jaar 1934 of 1936 dat elders staat. Het spelbord, de huisjes, munten en doos zijn een eigen ontwerp; geen kopie van het echte bord, de figuren of het logo.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.4, stem: "Monopoly began as a warning about landlords.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => bord(h, 540, 980, 1, 0.82) + h.kin('Monopoly began as a *warning*.', { y: 300, g: 110, t: h.t, start: 0.4 }).svg },
    // 2 · 1904, Lizzie Magie
    { duur: 3.8, stem: "1904. Lizzie Magie patents a game: The Landlord's Game.", in: 'zweep', bron: PAT, bronStart: 2.4, camera: { zoom: [1, 1.05], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [1.6, 'pop', 0.5]],
      teken: h => bord(h, 540, 1000, h.klem((h.t - 0.4) / 2.0), 0.78, 'LANDLORD\'S GAME') + h.kin('*1904*: Lizzie Magie patents *The Landlord\'s Game*.', { y: 290, g: 88, t: h.t, start: 0.05 }).svg },
    // 3 · Henry George
    { duur: 3.8, stem: "She followed Henry George, who wanted a single tax on land.", in: 'op', bron: STR, bronStart: 2.4, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'tik', 0.5]],
      teken: h => grond(h, h.klem((h.t - 0.6) / 2.0)) + h.kin('She followed *Henry George*: a single tax on *land*.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg },
    // 4 · het doel
    { duur: 4.0, stem: "Her game was meant to show the tragic effects of land-grabbing.", in: 'masker', nacht: true, bron: MF, bronStart: 2.6, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [2.0, 'rol', 0.5]],
      teken: h => munten(h, h.klem((h.t - 0.8) / 2.2)) + h.kin('It showed the *tragic effects* of land-grabbing.', { y: 320, g: 90, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 5 · huisjes op één plek
    { duur: 3.2, stem: "An argument against the concentration of wealth.", in: 'zweep', bron: NPR, bronStart: 2.0, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[0.8, 'pop', 0.4], [1.2, 'pop', 0.4], [1.6, 'pop', 0.5]],
      teken: h => bord(h, 540, 950, 1, 0.78) + Array.from({ length: 5 }, (_, i) => huisje(h, 420 + i * 60, 950, h.K.groen, 0.8 * h.veer(h.klem((h.t - 0.6 - i * 0.2) / 0.3)))).join('') + h.kin('Against the *concentration of wealth*.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    // 6 · de Depressie, Darrow
    { duur: 4.2, stem: "Then the Great Depression. Charles Darrow, out of work, made copies of Monopoly at home.", in: 'zweep', bron: STR, bronStart: 2.8, camera: { zoom: [1, 1.05] }, geluid: [[1.4, 'pop', 0.4], [2.0, 'pop', 0.4], [2.6, 'pop', 0.4]],
      teken: h => [0, 1, 2].map(i => bord(h, 270 + i * 270, 1000, h.klem((h.t - 1.2 - i * 0.6) / 0.5), 0.3)).join('') + h.kin('The Depression. *Charles Darrow*, out of work, makes copies at home.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 7 · als zijn eigen werk verkocht
    { duur: 3.6, stem: "He got the game through a friend, and sold it to Parker Brothers as his own.", in: 'flits', bron: NPR, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [2.4] }, geluid: [[2.4, 'klap', 0.7]],
      teken: h => doos(h, 540, 1000, h.klem((h.t - 0.6) / 0.4)) + h.kin('He sold it to Parker Brothers *as his own*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    // 8 · 1935
    { duur: 3.4, stem: "1935. Parker Brothers buys the rights, and sales skyrocket.", in: 'zweep', bron: STR, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5], [1.4, 'stijg', 0.6]],
      teken: h => groot(h, '1935', 900, 280) + h.kin('Sales *skyrocket*.', { y: 320, g: 120, t: h.t, start: 0.45 }).svg },
    // 9 · slot
    { duur: 3.2, stem: "A game against monopolies, sold as Monopoly.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => bord(h, 540, 1000, 1, 0.78)
        + h.kin('A game against monopolies, sold as *Monopoly*.', { y: 300, g: 100, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
