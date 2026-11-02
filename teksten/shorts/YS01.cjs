// YS01 v2 — Why is a stop sign an octagon (and why was it once yellow)?
// Versie 2 (opdracht Eva 2 nov 19:45, Andries 19:41: "scherper en creatiever ... zodat het echt triggert"): haak in de
// eerste seconde (het bord slaat neer, "chosen for the dark" opent de vraag), elke 1,5–3 s iets nieuws, tekst woord
// voor woord, overgangen, eigen geluid, en een einde dat terugloopt naar het begin (zelfde bord, zelfde plek).
// Bron: FHWA, "The Evolution of MUTCD" (webarchief UNT, 31 okt 2016), gelezen 2 nov 2026. Elke bewering hieronder
// staat in die bron; zie pakketten/<map>/bron/bronnen.md. v1 staat in de git-geschiedenis (commit adcf422).
const BRON = 'U.S. Federal Highway Administration, "The Evolution of MUTCD"';
const CX = 540, CY = 1010, R = 250;   // vaste plek van het bord: begin en einde vallen samen (loop)

const hex = x => parseInt(x, 16);
const meng = (a, b, p) => '#' + [1, 3, 5].map(i => Math.round(hex(a.substr(i, 2)) * (1 - p) + hex(b.substr(i, 2)) * p).toString(16).padStart(2, '0')).join('');
const hoeken = (cx, cy, r) => Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const bord = (h, o = {}) => `<g filter="url(#sch)">${h.stopbord(o.cx ?? CX, o.cy ?? CY, o.r ?? R, o)}</g>`;

module.exports = {
  code: 'YS01',
  versie: 2,
  map: '2026-11-09-YS01-stopbord',
  nummer: 'No. 01',
  onderwerp: 'THE STOP SIGN',
  scenes: [
    // 1 · HAAK: het bord valt van groot naar zijn plek en slaat neer; de vraag gaat open
    { duur: 2.7, camera: { zoom: [1, 1.04], stoot: [0.32], schud: [0.32] }, geluid: [[0.3, 'klap'], [0.3, 'boem', 0.9]],
      teken: h => {
        const p = h.klem(h.t / 0.32), s = 3.2 - 2.2 * (p * p);
        return bord(h, { schaal: s, draai: (1 - p) * -38, doorzicht: h.klem(h.t / 0.08) })
          + h.kin('This shape was chosen for the *dark*.', { y: 300, g: 104, t: h.t, start: 0.42 }).svg;
      } },
    // 2 · acht zijden tellen, met een tik per zijde
    { duur: 3.0, in: 'zweep', camera: { zoom: [1.02, 1.08] },
      geluid: [...Array.from({ length: 8 }, (_, i) => [0.25 + i * 0.17, 'tik', 0.7, (i % 2 ? 0.4 : -0.4)]), [1.85, 'pop', 0.9]],
      teken: h => {
        const k = Math.max(0, Math.min(8, Math.floor((h.t - 0.25) / 0.17) + 1)), pt = hoeken(CX, CY, R * 0.97);
        let s = bord(h);
        for (let i = 0; i < k; i++) { const [a, b] = [pt[i], pt[(i + 1) % 8]]; s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${h.K.geel}" stroke-width="22" stroke-linecap="round"/>`; }
        if (k > 0) { const q = h.veer((h.t - 0.25 - (k - 1) * 0.17) / 0.16); s += `<text x="540" y="560" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${(300 * (0.7 + 0.3 * q)).toFixed(0)}" fill="${h.K.signaal}">${k}</text>`; }
        return s + h.kin('Why *eight*?', { y: 1290, g: 96, t: h.t, start: 1.85, midden: true }).svg;
      } },
    // 3 · nacht, jaren twintig: koplampen strijken over een bord dat je niet kunt lezen
    { duur: 3.4, in: 'flits', nacht: true, camera: { zoom: [1.06, 1.0], pan: [[30, 0], [-30, 0]] },
      geluid: [[0.7, 'whoosh', 0.8, -0.8], [1.9, 'whoosh', 0.7, 0.8]],
      teken: h => {
        const veeg = (h.t * 0.9) % 1.6 - 0.3;
        let s = h.kin('*1920s* America.', { y: 320, g: 112, t: h.t, start: 0.1, kleur: '#F3F0E8' }).svg
          + h.kin('More cars every year. Signs barely lit at night.', { y: 500, g: 64, gewicht: 'regular', t: h.t, start: 0.9, kleur: '#D8D4CA' }).svg;
        const x = 140 + veeg * 600;
        s += `<polygon points="${x - 260},1500 ${x + 260},1500 ${x + 70},1000 ${x - 70},1000" fill="#F2E6B8" opacity="0.10"/>`;
        s += h.vorm('rechthoek', 540, 1080, 170, '#252938', 1);
        s += `<text x="540" y="1096" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="48" fill="${meng('#30354A', '#8C8E99', Math.max(0, 1 - Math.abs(x - 540) / 240))}">? ? ?</text>`;
        return s;
      } },
    // 4 · wie: drie staten
    { duur: 2.3, in: 'zweep', bron: BRON, bronStart: 0.4, camera: { zoom: [1, 1.05] }, geluid: [[0.55, 'pop', 0.7], [0.95, 'pop', 0.7, 0.3], [1.35, 'pop', 0.7, -0.3]],
      teken: h => h.kin('Engineers from *Wisconsin,* *Minnesota* and *Indiana* had an idea.', { y: 420, g: 92, t: h.t, start: 0.05, nadruk: 'balk' }).svg },
    // 5 · het idee: gevaar rangschikken naar vorm; vier vormen vliegen binnen
    { duur: 2.6, in: 'op', bron: BRON, bronStart: 0.4, camera: { zoom: [1, 1.06], stoot: [1.25] },
      geluid: [[0.9, 'pop'], [1.05, 'pop', 0.9, 0.5], [1.2, 'pop', 0.9, -0.5], [1.35, 'pop']],
      teken: h => {
        let s = h.kin('Rank danger by *shape*.', { y: 330, g: 120, t: h.t, start: 0.05 }).svg;
        const v = [['cirkel', h.K.geel, -1, -1], ['achthoek', h.K.signaal, 1, -1], ['ruit', h.K.geel, -1, 1], ['rechthoek', '#FFFFFF', 1, 1]];
        v.forEach(([vrm, kl, sx, sy], i) => {
          const p = h.veer((h.t - 0.9 - i * 0.15) / 0.4); if (h.t < 0.9 + i * 0.15) return;
          const tx = 540 + sx * 200, ty = 1000 + sy * 190, x = tx + sx * 700 * (1 - p), y = ty + sy * 500 * (1 - p);
          s += `<g filter="url(#schKlein)">${h.vorm(vrm, x, y, 120, kl, 1)}</g>`;
        });
        return s;
      } },
    // 6–9 · de rangorde, één vorm per beat
    ...[
      ['cirkel', 'geel', 'Round', 'Railroad crossing. The most danger.', 'zweep', 'klap'],
      ['achthoek', 'signaal', 'Octagon', 'Stop at the intersection.', 'op', 'klap'],
      ['ruit', 'geel', 'Diamond', 'Be careful.', 'zweep', 'pop'],
      ['rechthoek', 'wit', 'Rectangle', 'Directions and information.', 'op', 'pop'],
    ].map(([vrm, kl, naam, wat, inn, gel], i) => ({
      duur: 2.05, in: inn, bron: BRON, bronStart: 0.5, camera: { zoom: [1, 1.05], stoot: [0.28] }, geluid: [[0.26, gel, 0.8], [0.26, 'boem', i === 1 ? 0.6 : 0.25]],
      teken: h => {
        const p = h.veer(h.t / 0.32), kleur = kl === 'wit' ? '#FFFFFF' : h.K[kl];
        return `<text x="100" y="420" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="${h.K.grijs}">DANGER LEVEL</text>`
          + [0, 1, 2, 3].map(j => `<circle cx="${430 + j * 52}" cy="406" r="17" fill="${j < 4 - i ? h.K.signaal : 'none'}" stroke="${h.K.inkt}" stroke-width="4"/>`).join('')
          + `<g filter="url(#sch)">${h.vorm(vrm, 540, 770, 190, kleur, h.klem(h.t / 0.1), 0.4 + 0.6 * p)}</g>`
          + h.kin(`*${naam}*`, { y: 1010, g: 124, t: h.t, start: 0.3, midden: true }).svg
          + h.kin(wat, { y: 1160, g: 56, gewicht: 'regular', t: h.t, start: 0.65, midden: true, max: 860 }).svg;
      } })),
    // 10 · de letters verdwijnen, de vorm blijft spreken
    { duur: 3.4, in: 'masker', bron: BRON, bronStart: 0.6, camera: { zoom: [1.1, 1.0] }, geluid: [[1.0, 'stijg', 0.5], [2.25, 'ding', 0.8]],
      teken: h => {
        const weg = h.klem((h.t - 0.6) / 0.9);
        return bord(h, { cy: 840, r: 220, letter: meng('#FFFFFF', h.K.signaal, weg), rand: meng('#FFFFFF', h.K.signaal, weg * 0.6) })
          + h.kin("Can't read the letters?", { y: 300, g: 96, t: h.t, start: 0.05, weg: 1.95 }).svg
          + h.kin('The *shape* still says STOP.', { y: 1110, g: 88, t: h.t, start: 2.0, midden: true }).svg;
      } },
    // 11 · de wending: het bord draait om en is geel
    { duur: 2.7, in: 'flits', bron: BRON, bronStart: 1.4, camera: { zoom: [1, 1.06], stoot: [1.2], schud: [1.2] }, geluid: [[0, 'stijg', 0.6], [1.18, 'klap'], [1.18, 'boem', 0.7]],
      teken: h => {
        const f = h.klem((h.t - 0.9) / 0.3), sx = Math.abs(Math.cos(f * Math.PI)), geel = f > 0.5;
        const b = h.stopbord(CX, 840, 220, geel ? { vul: h.K.geel, letter: h.K.signaal, rand: h.K.inkt } : {});
        return `<g filter="url(#sch)"><g transform="translate(${CX} 0) scale(${Math.max(0.02, sx).toFixed(3)} 1) translate(${-CX} 0)">${b}</g></g>`
          + h.kin("Here's the twist.", { y: 300, g: 96, t: h.t, start: 0.05, weg: 1.05 }).svg
          + h.kin('Early stop signs were *yellow*.', { y: 1110, g: 86, t: h.t, start: 1.25, midden: true, nadruk: 'balk' }).svg;
      } },
    // 12 · waarom niet rood: in het donker slecht te zien
    { duur: 2.8, in: 'zweep', nacht: true, bron: BRON, bronStart: 0.6, camera: { zoom: [1, 1.05] }, geluid: [[0.35, 'pop', 0.7], [1.6, 'whoosh', 0.4]],
      teken: h => {
        const d = h.klem((h.t - 0.8) / 1.2);
        return h.kin('*Red?* Rejected.', { y: 320, g: 112, t: h.t, start: 0.05, kleur: '#F3F0E8' }).svg
          + `<circle cx="540" cy="880" r="${(210 * h.veer(h.t / 0.35)).toFixed(1)}" fill="${meng(h.K.signaal, '#2A2230', d)}" filter="url(#sch)"/>`
          + h.kin('Too hard to see at night.', { y: 1150, g: 70, gewicht: 'regular', t: h.t, start: 0.9, midden: true, kleur: '#D8D4CA' }).svg;
      } },
    // 13 · de teller rolt van 1924 naar 1954 en het bord wordt rood
    { duur: 3.7, in: 'op', bron: BRON, bronStart: 0.6, camera: { zoom: [1, 1.05], stoot: [1.45] },
      geluid: [[0.1, 'rol', 0.8], [0.5, 'rol', 0.8], [1.45, 'ding'], [2.3, 'pop', 0.8]],
      teken: h => {
        const p = h.zacht((h.t - 0.1) / 1.35), jaar = Math.round(1924 + 30 * p), m = h.klem((h.t - 2.2) / 0.9);
        return `<text x="540" y="560" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(250 * (1 + 0.12 * Math.exp(-Math.max(0, h.t - 1.45) * 6) * (h.t > 1.45))).toFixed(0)}" fill="${jaar === 1954 ? h.K.signaal : h.K.inkt}">${jaar}</text>`
          + h.kin('New *fade-resistant* finishes.', { y: 640, g: 72, t: h.t, start: 1.55, midden: true }).svg
          + bord(h, { cy: 1080, r: 190, vul: meng(h.K.geel, h.K.signaal, m), letter: meng(h.K.signaal, '#FFFFFF', m), rand: meng(h.K.inkt, '#FFFFFF', m) });
      } },
    // 14 · slot: zelfde bord op dezelfde plek als het begin; de tekst vliegt weg en de video loopt terug naar het begin
    { duur: 3.6, in: 'zoom', camera: { zoom: [1.04, 1.0] }, geluid: [[2.6, 'whoosh', 0.5]],
      teken: h => bord(h)
        + h.kin('A *1920s* night problem still shapes every corner.', { y: 300, g: 84, t: h.t, start: 0.1, weg: 2.75 }).svg
        + `<text x="540" y="1380" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.3) / 0.4) * (1 - h.klem((h.t - 2.75) / 0.3))).toFixed(3)}">Next: why your keyboard is so weird.</text>` },
  ],
};
