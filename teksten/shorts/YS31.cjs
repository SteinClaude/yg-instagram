// YS31 — Why we change the clocks: it began in World War I.
// Reeks B · Who Decided? Stijl YS (stijl OK YS, Andries do 5 nov 2026 ±21:27), stem Kokoro "fenrir".
// Bronnen (gelezen za 7 nov 2026): The Franklin Institute, "Did Ben Franklin Invent Daylight Saving Time?";
// NZ Department of Internal Affairs (persbericht 22 sep 2023); Western Front Association (David Tattersfield, 2020),
// "Spring forward, fall back…". Niet gezegd: dat Franklin de klok wilde verzetten (deed hij niet), wanneer Willett
// stierf, en de redenen in andere landen.
const FI = 'The Franklin Institute';
const DIA = 'NZ Dept. of Internal Affairs (2023)';
const WFA = 'Western Front Association (2020)';

const groot = (h, tekst, y = 700, g = 290, kleur = null) => { const q = h.veer(h.t / 0.3);
  return `<text x="540" y="${(y - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(g * (0.6 + 0.4 * q)).toFixed(0)}" fill="${kleur || h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">${tekst}</text>`; };
// klok; uur in uren (kan fractioneel)
const klok = (h, x = 540, y = 1000, r = 250, uur = 0) => { const min = (uur % 1) * 60;
  let s = `<g filter="url(#sch)"><circle cx="${x}" cy="${y}" r="${r}" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="10"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * Math.PI; s += `<line x1="${(x + Math.sin(a) * (r - 14)).toFixed(1)}" y1="${(y - Math.cos(a) * (r - 14)).toFixed(1)}" x2="${(x + Math.sin(a) * (r - 46)).toFixed(1)}" y2="${(y - Math.cos(a) * (r - 46)).toFixed(1)}" stroke="${h.K.inkt}" stroke-width="7"/>`; }
  const w = (frac, len, sw, kl) => { const a = frac * 2 * Math.PI; return `<line x1="${x}" y1="${y}" x2="${(x + Math.sin(a) * len).toFixed(1)}" y2="${(y - Math.cos(a) * len).toFixed(1)}" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round"/>`; };
  return s + w((uur % 12) / 12, r * 0.5, 16, h.K.inkt) + w(min / 60, r * 0.8, 10, h.K.signaal) + `<circle cx="${x}" cy="${y}" r="16" fill="${h.K.inkt}"/></g>`; };
// kanon (eigen eenvoudige tekening); vuur = 0..1
const kanon = (h, x = 520, y = 1120, vuur = 0) => `<g filter="url(#sch)"><rect x="${x - 60}" y="${y - 120}" width="320" height="90" rx="40" fill="${h.K.inkt}" transform="rotate(-18 ${x} ${y - 75})"/>`
  + `<circle cx="${x - 40}" cy="${y}" r="70" fill="#8C5E3C" stroke="${h.K.inkt}" stroke-width="6"/><circle cx="${x - 40}" cy="${y}" r="16" fill="${h.K.inkt}"/>`
  + (vuur > 0 ? `<circle cx="${x + 300}" cy="${y - 190}" r="${(40 + vuur * 110).toFixed(1)}" fill="${h.K.geel}" opacity="${(1 - vuur * 0.6).toFixed(3)}"/><circle cx="${x + 300}" cy="${y - 190}" r="${(20 + vuur * 60).toFixed(1)}" fill="${h.K.signaal}" opacity="${(1 - vuur * 0.5).toFixed(3)}"/>` : '') + '</g>';
// insect (kever) voor Hudson
const kever = (h, x = 540, y = 1020, s = 1) => `<g filter="url(#sch)" transform="translate(${x} ${y}) scale(${s})">`
  + [-1, 1].map(k => [-50, 0, 50].map(dy => `<line x1="0" y1="${dy}" x2="${k * 150}" y2="${dy + (dy >= 0 ? 40 : -30)}" stroke="${h.K.inkt}" stroke-width="10" stroke-linecap="round"/>`).join('')).join('')
  + `<ellipse cx="0" cy="20" rx="90" ry="130" fill="#2F7D5B" stroke="${h.K.inkt}" stroke-width="6"/><line x1="0" y1="-100" x2="0" y2="150" stroke="${h.K.inkt}" stroke-width="5"/><circle cx="0" cy="-130" r="50" fill="${h.K.inkt}"/>`
  + `<path d="M -20 -170 q -40 -60 -80 -50 M 20 -170 q 40 -60 80 -50" stroke="${h.K.inkt}" stroke-width="7" fill="none"/></g>`;
// pamflet
const pamflet = (h, x = 540, y = 1010, p = 1) => `<g opacity="${p.toFixed(3)}" filter="url(#sch)" transform="translate(0 ${((1 - p) * 60).toFixed(1)})"><rect x="${x - 230}" y="${y - 300}" width="460" height="600" rx="8" fill="#FBF6EA" stroke="${h.K.inkt}" stroke-width="5"/>`
  + `<text x="${x}" y="${y - 200}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.inkt}">THE WASTE</text><text x="${x}" y="${y - 150}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.inkt}">OF DAYLIGHT</text>`
  + Array.from({ length: 7 }, (_, i) => `<rect x="${x - 170}" y="${y - 80 + i * 50}" width="${i % 3 === 2 ? 220 : 340}" height="14" rx="6" fill="#C9C3B2"/>`).join('') + '</g>';
// kolenhoop
const kolen = (h, x = 540, y = 1150) => `<g filter="url(#sch)">` + Array.from({ length: 22 }, (_, i) => { const cx = x - 260 + ((i * 7919) % 101) / 101 * 520, cy = y - ((i * 4793) % 89) / 89 * 200 * (1 - Math.abs(cx - x) / 300);
  return `<path d="M ${cx.toFixed(1)} ${cy.toFixed(1)} l 40 -12 l 22 30 l -18 34 l -42 -6 z" fill="#5A6078" stroke="#8A8F98" stroke-width="3"/>`; }).join('') + '</g>';

module.exports = {
  code: 'YS31',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-07-YS31-zomertijd',
  nummer: 'No. 31',
  onderwerp: 'DAYLIGHT SAVING TIME',
  pakket: {
    dag: 'maandag 7 december 2026', gelezen: 'za 7 nov 2026',
    titel: 'Why do we change the clocks? It started in World War I',
    intro: 'Benjamin Franklin only joked about it. An insect collector and a London pamphlet proposed it. A war made it happen: in 1916, to save coal.',
    feiten: ['"Daylight saving time is one thing that Franklin did not invent." His 1784 essay in the Journal de Paris was satire, and even suggested firing cannons in the streets to wake people up (The Franklin Institute).',
      'Modern daylight saving time was first proposed in 1895 by New Zealand entomologist George Hudson, who enjoyed collecting insects after work. He proposed changing clocks by two hours every spring; the Wellington Philosophical Society ridiculed his idea (NZ Department of Internal Affairs).',
      'In 1907 William Willett published the pamphlet "The Waste of Daylight", using his own money (Western Front Association).',
      'Germany and Austria-Hungary were the first countries to introduce daylight saving time, on 30 April 1916, as a way to conserve coal (Western Front Association).',
      'In Britain, a bill was finally passed in parliament on 17 May 1916 (Western Front Association).'],
    bronnen: [['The Franklin Institute, "Did Ben Franklin Invent Daylight Saving Time?"', 'https://www.fi.edu/en/science-and-education/benjamin-franklin/daylight-savings-time'],
      ['New Zealand Department of Internal Affairs, press release (September 22, 2023)', 'https://www.dia.govt.nz/press.nsf/d77da9b523f12931cc256ac5000d19b6/bdb6f7d0d9ee78dccc258a34006e3aa5!OpenDocument'],
      ['David Tattersfield, "Spring forward, fall back: the changing of the clocks and the First World War", Western Front Association (October 24, 2020)', 'https://www.westernfrontassociation.com/world-war-i-articles/spring-forward-fall-back-the-changing-of-the-clocks-and-the-first-world-war/']],
    hashtags: '#Shorts #history #time #WW1',
    tags: 'daylight saving time, why do we change the clocks, clocks go back, summer time, 1916, World War I, Benjamin Franklin, George Hudson, William Willett, history of everyday things, why things are the way they are, shorts',
    md: [['The Franklin Institute, "Did Ben Franklin Invent Daylight Saving Time?"', 'https://www.fi.edu/en/science-and-education/benjamin-franklin/daylight-savings-time',
      ['"Daylight saving time is one thing that Franklin did not invent."', 'satirisch stuk "An Economical Project", Journal de Paris, voorjaar 1784: o.a. kerkklokken bij zonsopgang en kanonnen in de straten als dat niet hielp', 'Hudson "presented the idea in 1895"']],
      ['New Zealand Department of Internal Affairs, persbericht (22 sep 2023)', 'https://www.dia.govt.nz/press.nsf/d77da9b523f12931cc256ac5000d19b6/bdb6f7d0d9ee78dccc258a34006e3aa5!OpenDocument',
      ['"modern Daylight Saving Time was first proposed in 1895 by New Zealand entomologist George Hudson"', 'hij "enjoyed collecting insects after work"', '"changing clocks by two hours every spring to the Wellington Philosophical Society, who ridiculed his idea"']],
      ['David Tattersfield, Western Front Association (24 okt 2020)', 'https://www.westernfrontassociation.com/world-war-i-articles/spring-forward-fall-back-the-changing-of-the-clocks-and-the-first-world-war/',
      ['"Using his own money, in 1907 William published a pamphlet \'The Waste of Daylight\'."', 'Duitsland en Oostenrijk-Hongarije "were the first countries to introduce Daylight Saving Time, on 30 April 1916 as a way to conserve coal."', '"a bill was finally passed in parliament on 17 May 1916"']]],
    niet: '- Britannica (plan-bron) gaf eerder een 403. Niet gezegd: dat Franklin de klok wilde verzetten (zijn stuk stelt dat niet voor), wanneer Willett stierf, Willetts precieze voorstel (80 minuten in vier stappen), en de redenen in andere landen. Klok, kanon, kever, pamflet en kolen zijn een eigen tekening; geen portretten.',
  },
  scenes: [
    // 1 · HAAK
    { duur: 3.6, stem: "Twice a year we move the clocks. It started with a war.", camera: { zoom: [1, 1.04], stoot: [0.3], schud: [0.3] }, geluid: [[0.28, 'klap'], [0.28, 'boem', 0.8], [1.6, 'whoosh', 0.5]],
      teken: h => klok(h, 540, 1000, 250, 2 + h.zacht((h.t - 1.4) / 0.8)) + h.kin('We move the clocks. It started with a *war*.', { y: 300, g: 100, t: h.t, start: 0.4 }).svg },
    // 2 · Franklin: een grap
    { duur: 4.2, stem: "Not with Benjamin Franklin. In 1784 he wrote a joke: fire cannons in the streets to wake people up.", in: 'zweep', bron: FI, bronStart: 2.8, camera: { zoom: [1, 1.05], stoot: [2.6], schud: [2.6] }, geluid: [[2.6, 'boem', 0.9]],
      teken: h => kanon(h, 460, 1150, h.zacht((h.t - 2.6) / 0.6)) + h.kin('*1784*: Franklin\'s joke. *Fire cannons* to wake people up.', { y: 290, g: 88, t: h.t, start: 0.05 }).svg },
    // 3 · hij verzette geen klok
    { duur: 3.0, stem: "He never invented moving the clocks.", in: 'op', bron: FI, bronStart: 1.8, camera: { zoom: [1, 1.06], stoot: [1.0] }, geluid: [[1.0, 'boem', 0.5]],
      teken: h => klok(h, 540, 1000, 250, 2) + h.kin('Franklin *did not invent* it.', { y: 320, g: 110, t: h.t, start: 0.05 }).svg },
    // 4 · Hudson 1895
    { duur: 4.4, stem: "1895, New Zealand. Insect collector George Hudson wants more daylight after work. Move the clocks two hours each spring.", in: 'zweep', bron: DIA, bronStart: 3.0, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.5], [3.0, 'whoosh', 0.5]],
      teken: h => kever(h, 540, 1030, 0.8 * h.veer(h.klem((h.t - 0.6) / 0.5))) + h.kin('*1895*: George Hudson, insect collector. *Two hours* forward each spring.', { y: 290, g: 84, t: h.t, start: 0.05 }).svg },
    // 5 · uitgelachen
    { duur: 3.0, stem: "The local science society ridiculed his idea.", in: 'flits', bron: DIA, bronStart: 1.8, camera: { zoom: [1, 1.06], schud: [1.0, 1.8] }, geluid: [[1.0, 'klap', 0.6]],
      teken: h => groot(h, 'HA HA', 1000, 200) + h.kin('The local science society *ridiculed* it.', { y: 320, g: 100, t: h.t, start: 0.05 }).svg },
    // 6 · Willett 1907
    { duur: 4.0, stem: "1907, London. William Willett pays for a pamphlet himself: The Waste of Daylight.", in: 'op', bron: WFA, bronStart: 2.6, camera: { zoom: [1, 1.05] }, geluid: [[1.2, 'whoosh', 0.4]],
      teken: h => pamflet(h, 540, 960, h.klem((h.t - 0.8) / 0.5)) + h.kin('*1907*: William Willett pays for a pamphlet himself.', { y: 290, g: 88, t: h.t, start: 0.05 }).svg },
    // 7 · 30 april 1916
    { duur: 4.4, stem: "Then the war. April 30, 1916: Germany and Austria-Hungary move the clocks first. To save coal.", in: 'masker', nacht: true, bron: WFA, bronStart: 3.0, camera: { zoom: [1.05, 1.0], stoot: [2.6] }, geluid: [[0.5, 'whoosh', 0.4], [2.6, 'boem', 0.6]],
      teken: h => kolen(h, 540, 1200) + groot(h, '1916', 880, 220, h.K.geel) + h.kin('Germany and Austria-Hungary go first. *To save coal.*', { y: 300, g: 88, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg },
    // 8 · Groot-Brittannië 17 mei 1916
    { duur: 3.6, stem: "Britain follows: its law passes on May 17, 1916.", in: 'zweep', bron: WFA, bronStart: 2.2, camera: { zoom: [1, 1.06], stoot: [1.6] }, geluid: [[1.6, 'klap', 0.7]],
      teken: h => klok(h, 540, 1000, 240, 2 + h.zacht((h.t - 1.4) / 0.6)) + h.kin('Britain follows: *May 17, 1916*.', { y: 320, g: 104, t: h.t, start: 0.05 }).svg },
    // 9 · slot
    { duur: 3.2, stem: "You still change your clock for a wartime idea.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5], [1.4, 'tik', 0.4]],
      teken: h => klok(h, 540, 1000, 240, 3 - h.zacht((h.t - 1.2) / 0.6))
        + h.kin('Still in your clock: a *wartime* idea.', { y: 300, g: 104, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Sources in the description.</text>` },
  ],
};
