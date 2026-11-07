// YS28 — Why a marathon is 42.195 km (26.2 miles).
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): Olympedia, "Marathon, Men" (1908 Summer Olympics); World Athletics, discipline
// "Marathon"; Mental Floss (Lucas Reilly, 2018). Het verhaal van de kinderkamer van Windsor is omstreden: World
// Athletics vertelt het, Olympedia noemt het "certainly false"; de video zegt dat het omstreden is.
const OLY = 'Olympedia, 1908 Marathon';
const WA = 'World Athletics, "Marathon"';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// weg in perspectief met bewegende middenstrepen; p = verschuiving
const weg = (h, p = 0, y0 = 700) => `<g><path d="M 300 1300 L 480 ${y0} L 600 ${y0} L 780 1300 Z" fill="#8A8F98"/>` + Array.from({ length: 7 }, (_, i) => { const f = ((i / 7 + p) % 1); const y = y0 + f * f * (1300 - y0), w = 4 + f * 16, l = Math.max(0, Math.min(8 + f * 70, 1300 - y));
  return `<rect x="${(540 - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${l.toFixed(1)}" fill="#FBF6EA"/>`; }).join('') + '</g>';
// kasteel (eigen eenvoudige tekening)
const kasteel = (h, x = 540, y = 1150, op = 1) => `<g opacity="${op.toFixed(3)}" filter="url(#sch)"><rect x="${x - 260}" y="${y - 220}" width="520" height="220" fill="#B5AD9C" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 9 }, (_, i) => `<rect x="${x - 255 + i * 60}" y="${y - 262}" width="34" height="44" fill="#B5AD9C" stroke="${h.K.inkt}" stroke-width="5"/>`).join('')
  + `<rect x="${x - 70}" y="${y - 420}" width="140" height="420" fill="#A39C8B" stroke="${h.K.inkt}" stroke-width="6"/>`
  + Array.from({ length: 3 }, (_, i) => `<rect x="${x - 65 + i * 50}" y="${y - 460}" width="30" height="42" fill="#A39C8B" stroke="${h.K.inkt}" stroke-width="5"/>`).join('')
  + `<rect x="${x - 40}" y="${y - 110}" width="80" height="110" rx="40" fill="${h.K.inkt}"/></g>`;
// stadion met tribune en een loge
const stadion = (h, x = 540, y = 1050, loge = 0) => `<g filter="url(#sch)"><ellipse cx="${x}" cy="${y}" rx="400" ry="210" fill="#B5AD9C" stroke="${h.K.inkt}" stroke-width="6"/><ellipse cx="${x}" cy="${y}" rx="320" ry="150" fill="#C46A4A"/><ellipse cx="${x}" cy="${y}" rx="250" ry="100" fill="#5E9C6E"/>`
  + `<rect x="${x - 60}" y="${y + 150}" width="120" height="70" rx="8" fill="${loge > 0 ? h.K.geel : '#8A8F98'}" stroke="${h.K.inkt}" stroke-width="5"/>`
  + (loge > 0 ? `<path d="M ${x - 40} ${y + 150} l 15 -30 l 15 20 l 10 -30 l 10 30 l 15 -20 l 15 30 z" fill="${h.K.geel}" stroke="${h.K.inkt}" stroke-width="4" opacity="${loge.toFixed(3)}"/>` : '')
  + `<line x1="${x}" y1="${y + 100}" x2="${x}" y2="${y + 150}" stroke="#FBF6EA" stroke-width="8"/></g>`;
// teller in km
const teller = (h, waarde, y = 1100) => `<g filter="url(#sch)"><rect x="210" y="${y - 90}" width="660" height="160" rx="20" fill="#1B1E2B"/><text x="540" y="${y + 22}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="96" fill="#7CE38B">${waarde}</text></g>`;

module.exports = {
  code: 'YS28',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-04-YS28-marathon',
  nummer: 'No. 28',
  onderwerp: 'THE MARATHON',
  pakket: {
    dag: 'vrijdag 4 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why is a marathon exactly 42.195 km (26.2 miles)?',
    intro: 'The odd marathon distance comes from one race: the 1908 Olympic marathon in London, from Windsor Castle to the stadium.',
    feiten: ['The 1908 Olympic marathon in London started by the East Terrace of Windsor Castle (Olympedia).',
      'The finish was in front of the Royal Box in the White City Stadium, and the course was precisely 26 miles, 385 yards (42,195 metres) (Olympedia).',
      'A popular story says the start was chosen for the royal children at Windsor. World Athletics tells it; Olympedia calls it "certainly false", with no requests from the Royal Family.',
      'The distance was standardised at 26 miles 385 yards (42.195 km) in 1921 (World Athletics); declared so by the IAAF in 1921 (Olympedia).'],
    bronnen: [['Olympedia, "Marathon, Men", 1908 Summer Olympics', 'https://www.olympedia.org/results/56369'],
      ['World Athletics, "Marathon" (discipline page)', 'https://worldathletics.org/disciplines/road-running/marathon'],
      ['Lucas Reilly, "Why Are Marathons 26.2 Miles Long?", Mental Floss (November 14, 2018)', 'https://www.mentalfloss.com/article/563590/why-are-marathons-26-2-miles-long']],
    hashtags: '#Shorts #history #running #olympics',
    tags: 'marathon, why is a marathon 26.2 miles, 42.195 km, marathon distance, 1908 London Olympics, Windsor Castle, White City Stadium, IAAF 1921, history of everyday things, why things are the way they are, shorts',
    md: [['Olympedia, "Marathon, Men", Olympische Spelen 1908', 'https://www.olympedia.org/results/56369',
      ['"The race started by the East Terrace of Windsor Castle."', 'de afstand tot "in front of the Royal Box in the White City Stadium was precisely 26 miles, 385 yards" (42.195 m)', '"declared so by the IAAF in 1921"', 'het verhaal van de kinderkamer: "certainly false", "with no requests from the Royal Family to do so"']],
      ['World Athletics, "Marathon"', 'https://worldathletics.org/disciplines/road-running/marathon',
      ['"This distance was standardised at 26 miles 385 yards (42.195km) in 1921."', 'vertelt wél het verhaal: "so it could be seen by the children in the Royal Nursery at Windsor"']],
      ['Lucas Reilly, Mental Floss (14 nov 2018)', 'https://www.mentalfloss.com/article/563590/why-are-marathons-26-2-miles-long',
      ['de IAAF "chose the old London distance of 26 miles and 385 yards"']]],
    niet: '- Olympics.com (gepland) laadde niet. Niet gezegd: dat koningin Alexandra of de koninklijke kinderen om de start of finish vroegen (omstreden; de video noemt het omstreden), de naam van de winnaar of de bekende val vlak voor de finish, en de afstand van eerdere Spelen. Weg, kasteel, stadion en teller zijn een eigen tekening; het kasteel is geen nauwkeurig portret van Windsor.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.6, stem: "A marathon is forty-two point one nine five kilometres. Why that odd number?", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8]],
      teken: h => weg(h, h.t * 0.4) + teller(h, '42.195 km', 1000) + h.kin('A marathon: *42.195 km*. Why that odd number?', { y: 300, g: 96, t: h.t, start: 0.4 }).svg },
    // 2 · Londen 1908
    { duur: 3.0, stem: "London, 1908. The Olympic marathon.", in: 'zweep', bron: OLY, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1908', 900, 280) + h.kin('*London*. The Olympic marathon.', { y: 320, g: 104, t: h.t, start: 0.45 }).svg },
    // 3 · start bij Windsor Castle
    { duur: 3.4, stem: "The start: by the East Terrace of Windsor Castle.", in: 'op', bron: OLY, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'ding', 0.5]],
      teken: h => kasteel(h, 540, 1200, h.klem(h.t / 0.4)) + h.kin('Start: the East Terrace of *Windsor Castle*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    // 4 · finish voor de koninklijke loge
    { duur: 3.6, stem: "The finish: in front of the Royal Box, in the White City Stadium.", in: 'zweep', bron: OLY, bronStart: 2.2, camera: { zoom: [1, 1.05], stoot: [1.8] }, geluid: [[1.8, 'pop', 0.7]],
      teken: h => stadion(h, 540, 1000, h.klem((h.t - 1.6) / 0.4)) + h.kin('Finish: in front of the *Royal Box*, White City Stadium.', { y: 290, g: 88, t: h.t, start: 0.05 }).svg },
    // 5 · de afstand
    { duur: 3.6, stem: "That course was precisely twenty-six miles, three hundred and eighty-five yards.", in: 'flits', bron: OLY, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.4] }, geluid: [[0.4, 'klap', 0.8]],
      teken: h => groot(h, '26 mi', 880, 210) + groot(h, '385 yd', 1120, 170, h.K.inkt) + h.kin('Precisely *26 miles, 385 yards*.', { y: 320, g: 100, t: h.t, start: 0.05 }).svg },
    // 6 · in kilometers
    { duur: 3.0, stem: "Or forty-two point one nine five kilometres.", in: 'op', bron: OLY, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'tik', 0.5], [1.2, 'tik', 0.5], [1.8, 'ding', 0.6]],
      teken: h => teller(h, (42.195 * h.klem((h.t - 0.3) / 1.6)).toFixed(3) + ' km', 1000) + h.kin('Or *42.195 km*.', { y: 320, g: 120, t: h.t, start: 0.05 }).svg },
    // 7 · het koninklijke verhaal is omstreden
    { duur: 4.4, stem: "A popular story says the royals wanted that start. One Olympic history site calls that certainly false.", in: 'masker', nacht: true, bron: OLY, bronStart: 3.0, camera: { zoom: [1.05, 1.0] }, geluid: [[0.5, 'whoosh', 0.4], [3.0, 'boem', 0.4]],
      teken: h => kasteel(h, 540, 1200, 0.5) + h.kin('A popular story: the royals wanted it. Olympedia: *"certainly false."*', { y: 320, g: 84, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 8 · 1921 vastgelegd
    { duur: 3.6, stem: "In 1921, the I-A-A-F made it the official marathon distance.", in: 'zweep', bron: WA, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => groot(h, '1921', 900, 280) + h.kin('The IAAF makes it *official*.', { y: 320, g: 104, t: h.t, start: 0.45 }).svg },
    // 9 · nog steeds
    { duur: 3.4, stem: "Marathons today still run that 1908 London distance.", in: 'op', bron: WA, bronStart: 2.0, camera: { zoom: [1, 1.04] }, geluid: [[1.0, 'rol', 0.4]],
      teken: h => weg(h, h.t * 0.5) + h.kin('Marathons still run the *1908 London* distance.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    // 10 · slot
    { duur: 3.2, stem: "A castle and a stadium set the distance.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => kasteel(h, 320, 1180, 1).replace('<g opacity', '<g transform="translate(320 1180) scale(0.6) translate(-320 -1180)" opacity') + stadion(h, 760, 1080, 1).replace('<g filter', '<g transform="translate(760 1080) scale(0.55) translate(-760 -1080)" filter')
        + h.kin('A *castle* and a *stadium* set the distance.', { y: 300, g: 104, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
