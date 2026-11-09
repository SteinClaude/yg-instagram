// YS37 — Why the Olympic rings have exactly those colours.
// Reeks B · Who Decided? VORM 3 (vanaf YS33, Andries ma 9 nov 2026): haak in de eerste seconde, 25–40 s, einde dat
// terugloopt (script.lus). Stem Kokoro "fenrir". Eerst Instagram kanaal 1 (za 21 nov 2026), daarna YouTube (zo 13 dec).
// Bron (gelezen ma 9 nov 2026): Olympedia, "Olympic Flag" (met Coubertins tekst uit de Olympic Review, augustus 1913).
// olympics.com reageerde niet, Britannica gaf een 403.
// Niet gezegd: welke kleur bij welk werelddeel hoort (Coubertin koppelde geen kleur aan een werelddeel; de bewering dat een
// ring nooit voor één werelddeel staat, staat alleen op Wikipedia), en of zijn bewering over "alle vlaggen" klopt.
// Beeld: GEEN olympische ringen (beschermd symbool): vijf losse kleurstalen en eigen, verzonnen vlaggen.
const OLY = 'Olympedia, "Olympic Flag"';
const KL = ['#2E6DB4', '#F2C230', '#16161A', '#2F7D5B', '#D9432B'];

// vijf kleurstalen (rond, niet in elkaar, geen ringen) op een witte kaart; p = 0..1 opbouw
const stalen = (h, p = 1, wit = 1, y = 1020) => `<g filter="url(#sch)"><rect x="140" y="${y - 200}" width="800" height="400" rx="24" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="6" opacity="${wit.toFixed(3)}"/>`
  + KL.map((k, i) => { const q = h.veer(h.klem(p * 5 - i)); return `<circle cx="${220 + i * 160}" cy="${y}" r="${(62 * q).toFixed(1)}" fill="${k}" stroke="${h.K.inkt}" stroke-width="5"/>`; }).join('') + '</g>';
const tijdschrift = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}" transform="translate(0 ${((1 - p) * 80).toFixed(1)})"><rect x="290" y="720" width="500" height="620" rx="8" fill="#F6F1E3" stroke="${h.K.inkt}" stroke-width="6"/><text x="540" y="840" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="56" fill="${h.K.inkt}">REVUE</text><text x="540" y="900" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}">AOÛT 1913</text>`
  + Array.from({ length: 6 }, (_, i) => `<rect x="340" y="${960 + i * 52}" width="${[400, 360, 380, 300, 390, 250][i]}" height="16" rx="8" fill="${h.K.grijs}"/>`).join('') + '</g>';
// verzonnen vlaggen, alleen in de vijf kleuren + wit
const vlag = (h, x, y, soort, q) => { const w = 220, hh = 140; let s = `<g transform="translate(${x} ${y}) scale(${q.toFixed(3)})" filter="url(#sch)"><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/>`;
  if (soort === 0) s += `<rect x="${-w / 2}" y="${-hh / 2}" width="${w / 3}" height="${hh}" fill="${KL[0]}"/><rect x="${w / 6}" y="${-hh / 2}" width="${w / 3}" height="${hh}" fill="${KL[4]}"/>`;
  if (soort === 1) s += `<rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh / 3}" fill="${KL[2]}"/><rect x="${-w / 2}" y="${hh / 6}" width="${w}" height="${hh / 3}" fill="${KL[1]}"/>`;
  if (soort === 2) s += `<rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh / 2}" fill="${KL[3]}"/><circle cx="0" cy="0" r="30" fill="${KL[4]}"/>`;
  if (soort === 3) s += `<rect x="-20" y="${-hh / 2}" width="40" height="${hh}" fill="${KL[0]}"/><rect x="${-w / 2}" y="-20" width="${w}" height="40" fill="${KL[0]}"/>`;
  if (soort === 4) s += `<path d="M ${-w / 2} ${-hh / 2} L ${w / 6} 0 L ${-w / 2} ${hh / 2} Z" fill="${KL[2]}"/><rect x="${-w / 2 + w / 3}" y="${-hh / 2}" width="${w * 2 / 3}" height="${hh / 2}" fill="${KL[1]}"/>`;
  if (soort === 5) s += `<rect x="${-w / 2}" y="${-hh / 2}" width="${w / 2}" height="${hh}" fill="${KL[4]}"/><circle cx="${w / 4}" cy="0" r="28" fill="${KL[3]}"/>`;
  return s + `<rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" fill="none" stroke="${h.K.inkt}" stroke-width="5"/></g>`; };
const vlaggen = (h, p = 1) => [0, 1, 2, 3, 4, 5].map(i => vlag(h, 300 + (i % 3) * 240, 900 + Math.floor(i / 3) * 240, i, h.veer(h.klem(p * 6 - i)))).join('');
const wereld = (h, p = 1) => Array.from({ length: 5 }, (_, i) => { const q = h.veer(h.klem(p * 5 - i)); return `<g transform="translate(${220 + i * 160} 1020) scale(${q.toFixed(3)})" filter="url(#sch)"><circle r="66" fill="#3D6FB4" stroke="${h.K.inkt}" stroke-width="5"/><path d="M -40 -20 Q 0 -60 30 -20 Q 10 20 -30 10 Z" fill="${h.K.groen}"/></g>`; }).join('');
const stadion = (h, p = 1) => `<g filter="url(#sch)" opacity="${p.toFixed(3)}"><path d="M 160 1240 L 220 1000 L 860 1000 L 920 1240 Z" fill="#B9B4A8" stroke="${h.K.inkt}" stroke-width="6"/><line x1="540" y1="1000" x2="540" y2="${(1000 - 300 * p).toFixed(1)}" stroke="${h.K.inkt}" stroke-width="10"/><rect x="540" y="${(700 + (1 - p) * 300).toFixed(1)}" width="200" height="130" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/>`
  + KL.map((k, i) => `<circle cx="${560 + i * 40}" cy="${(765 + (1 - p) * 300).toFixed(1)}" r="14" fill="${k}"/>`).join('') + '</g>';

module.exports = {
  code: 'YS37',
  versie: 2,
  vorm: 3,
  lus: 0.5,
  stem: { stem: 'am_fenrir', tempo: 1.1 },
  map: '2026-12-13-YS37-olympische-kleuren',
  nummer: 'No. 37',
  onderwerp: 'THE OLYMPIC COLOURS',
  pakket: {
    dag: 'zondag 13 december 2026', gelezen: 'ma 9 nov 2026',
    titel: 'Why the Olympic rings have exactly those colours',
    intro: 'In 1913, Pierre de Coubertin wrote that the six colours of the Olympic flag, white included, reproduce the colours of all the nations, "with no exception".',
    feiten: ['Pierre de Coubertin presented the five rings in the Olympic Review in August 1913 (Olympedia).',
      'He wrote: "These five rings represent the five parts of the world from this point on won over to Olympism" (Olympedia).',
      'And: "the six colors [including the white background]. thus combined reproduce the colors of all the nations, with no exception" (Olympedia).',
      'The flag was first flown in Alexandria, Egypt, for the Pan-Egyptian Games on 5 April 1914, and made its début at the Olympic Games in 1920 at Antwerp (Olympedia).'],
    bronnen: [['Olympedia, "Olympic Flag"', 'https://www.olympedia.org/definitions/9']],
    hashtags: '#Shorts #history #olympics #design',
    tags: 'Olympic rings, Olympic rings colours, Olympic flag, Pierre de Coubertin, 1913, Antwerp 1920, flag colours, design history, history of everyday things, why things are the way they are, shorts',
    md: [['Olympedia, "Olympic Flag"', 'https://www.olympedia.org/definitions/9',
      ['Coubertin, Olympic Review, augustus 1913: "These five rings represent the five parts of the world from this point on won over to Olympism"', '"the six colors [including the white background]. thus combined reproduce the colors of all the nations, with no exception."', '"The flag was first flown at Chatsby Stadium in Alexandria, Egypt for the Pan-Egyptian Games on 5 April 1914"', '"made its début at the Olympic Games in 1920 at Antwerp, Belgium"']]],
    niet: '- Niet gezegd: welke kleur bij welk werelddeel hoort (Coubertin koppelde ze niet), of zijn bewering over "alle vlaggen" echt klopte (de video zegt "he wrote"). olympics.com reageerde niet, Britannica gaf een 403: daarom één bron. In beeld geen olympische ringen (beschermd symbool): vijf losse kleurstalen en verzonnen vlaggen, eigen tekenwerk.',
  },
  scenes: [
    { duur: 2.8, stem: 'These colours were picked to match every flag in the world.', stemStart: 0.05, camera: { zoom: [1, 1.05], stoot: [0.15] }, geluid: [[0.12, 'klap'], [0.12, 'boem', 0.7]],
      teken: h => stalen(h, h.klem(h.t / 0.6)) + h.kin('These colours were picked to match *every flag*.', { y: 300, g: 98, t: h.t, start: 0, stap: 0.07 }).svg },
    { duur: 2.8, stem: '1913. Pierre de Coubertin presents the Olympic rings.', in: 'zweep', bron: OLY, bronStart: 1.4, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'pop', 0.5]],
      teken: h => tijdschrift(h, h.klem((h.t - 0.2) / 0.4)) + h.kin('*1913*: Pierre de Coubertin presents the rings.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { duur: 2.8, stem: 'Five rings, for five parts of the world.', in: 'op', bron: OLY, bronStart: 1.4, camera: { zoom: [1, 1.05] }, geluid: [[0.5, 'tik', 0.4], [0.8, 'tik', 0.4], [1.1, 'tik', 0.4]],
      teken: h => wereld(h, h.klem((h.t - 0.3) / 1.0)) + h.kin('Five rings: *five parts of the world*.', { y: 300, g: 104, t: h.t, start: 0.05 }).svg },
    { duur: 3.0, stem: 'Blue, yellow, black, green and red. On white.', in: 'zweep', bron: OLY, bronStart: 1.6, camera: { zoom: [1, 1.05] }, geluid: [[0.4, 'pop', 0.4], [0.7, 'pop', 0.4], [1.0, 'pop', 0.4], [1.3, 'pop', 0.4], [1.6, 'pop', 0.4], [2.0, 'ding', 0.5]],
      teken: h => stalen(h, h.klem((h.t - 0.3) / 1.4), h.klem((h.t - 1.8) / 0.3)) + h.kin('Five colours, *on white*.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
    { duur: 3.6, stem: 'Together, he wrote, those six colours reproduce the colours of all the nations.', in: 'op', bron: OLY, bronStart: 2.0, camera: { zoom: [1, 1.05] }, geluid: [[1.0, 'pop', 0.4], [1.4, 'pop', 0.4], [1.8, 'pop', 0.4]],
      teken: h => vlaggen(h, h.klem((h.t - 0.6) / 1.6)) + h.kin('Six colours: *the colours of all the nations*.', { y: 300, g: 96, t: h.t, start: 0.05 }).svg },
    { duur: 2.4, stem: 'With no exception.', in: 'flits', bron: OLY, bronStart: 1.0, camera: { zoom: [1, 1.07], stoot: [0.3] }, geluid: [[0.3, 'klap', 0.7], [0.3, 'boem', 0.5]],
      teken: h => vlaggen(h, 1) + h.kin('"With *no exception*."', { y: 300, g: 120, t: h.t, start: 0.05 }).svg },
    { duur: 3.2, stem: 'The flag first flew in 1914, in Egypt. At the Olympics, in 1920.', in: 'zweep', bron: OLY, bronStart: 1.8, camera: { zoom: [1, 1.05] }, geluid: [[0.6, 'stijg', 0.5]],
      teken: h => stadion(h, h.zacht((h.t - 0.2) / 1.2)) + h.kin('*1914*: first flown. *1920*: the Games.', { y: 300, g: 100, t: h.t, start: 0.05 }).svg },
    { duur: 2.6, stem: 'Six colours. Every flag. That was the idea.', in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[0.3, 'stijg', 0.5]],
      teken: h => stalen(h, h.klem(h.t / 0.6)) + h.kin('Six colours. *Every flag*.', { y: 300, g: 112, t: h.t, start: 0.05 }).svg },
  ],
};
