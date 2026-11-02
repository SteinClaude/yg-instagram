// YS01 — Why is a stop sign an octagon (and why was it once yellow)?
// Bron: FHWA, "The Evolution of MUTCD" (webarchief UNT, 31 okt 2016), gelezen 2 nov 2026.
// Elke bewering hieronder staat in die bron; zie pakketten/<map>/bron/bronnen.md.
const BRON = 'U.S. Federal Highway Administration, "The Evolution of MUTCD"';
module.exports = {
  code: 'YS01',
  map: '2026-11-09-YS01-stopbord',
  nummer: 'No. 01',
  onderwerp: 'THE STOP SIGN',
  scenes: [
    { duur: 4.5, teken: ({ t, blok, stopbord, fase, zacht }) => {
      const p = zacht(t / 1.2);
      return blok('Why does a stop sign have *eight* sides?', { y: 330, g: 92, t, start: 0.1 }).svg
        + stopbord(540, 1020, 230, { schaal: 0.3 + 0.7 * p, draai: (1 - p) * -90, doorzicht: p });
    } },
    { duur: 6.5, nacht: true, teken: ({ t, blok, K, vorm, fase }) => {
      let s = blok('Early 1920s, America.', { y: 330, g: 80, t, kleur: '#F3F0E8' }).svg
        + blok('Roads are filling with cars, and road signs have a problem: there is *little light* on them at night.', { y: 470, g: 58, gewicht: 'regular', kleur: '#E4E0D6', t, start: 0.9 }).svg;
      // koplampen die een donker bord nauwelijks raken
      const p = fase(t, 2.2, 1.2);
      s += `<polygon points="200,1300 880,1300 640,980 440,980" fill="#F2E6B8" opacity="${(0.10 * p).toFixed(3)}"/>`;
      s += vorm('rechthoek', 540, 920, 150, '#2A2E3E', p);
      s += `<text x="540" y="935" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="44" fill="#3A3F52" opacity="${p}">? ? ?</text>`;
      return s;
    } },
    { duur: 10, bron: BRON, bronStart: 6, teken: ({ t, blok, vorm, K, fase }) => {
      let s = blok('So engineers from Wisconsin, Minnesota and Indiana ranked danger by *shape*:', { y: 300, g: 58, t }).svg;
      const rij = [
        ['cirkel', K.geel, 'Round', 'railroad crossing — the most danger'],
        ['achthoek', K.signaal, 'Octagon', 'stop at the intersection'],
        ['ruit', K.geel, 'Diamond', 'be careful'],
        ['rechthoek', '#FFFFFF', 'Rectangle', 'directions and information'],
      ];
      rij.forEach(([v, kleur, naam, uitleg], i) => {
        const st = 1.6 + i * 1.1, p = fase(t, st, 0.5), y = 730 + i * 160;
        s += vorm(v, 175, y, 62, kleur, p, 0.6 + 0.4 * p);
        s += blok(naam, { x: 290, y: y - 64, g: 48, t, start: st }).svg;
        s += blok(uitleg, { x: 290, y: y - 6, g: 36, gewicht: 'regular', kleur: K.grijs, t, start: st + 0.15, max: 690 }).svg;
      });
      return s;
    } },
    { duur: 6, bron: BRON, bronStart: 1.5, teken: ({ t, blok, stopbord, fase }) => {
      const p = fase(t, 0.2, 1.0);
      // een bord als silhouet: geen letters te lezen, de vorm zegt genoeg
      return blok('The idea: drivers would react to the *shape*, even when they couldn\'t read the letters.', { y: 330, g: 64, t }).svg
        + stopbord(540, 960, 200, { vul: '#16161A', letter: '#16161A', rand: '#2B2B30', doorzicht: p });
    } },
    { duur: 7.5, bron: BRON, bronStart: 4, teken: ({ t, blok, stopbord, K, fase }) => {
      const p = fase(t, 0.3, 0.8);
      return blok('Here\'s the twist: early stop signs weren\'t red. They were *yellow*.', { y: 300, g: 64, t }).svg
        + stopbord(540, 860, 190, { vul: K.geel, letter: K.signaal, rand: K.inkt, doorzicht: p })
        + blok('Red was rejected: it was too hard to see at night.', { y: 1120, g: 48, gewicht: 'regular', t, start: 2.4 }).svg;
    } },
    { duur: 7, bron: BRON, bronStart: 3.5, teken: ({ t, blok, stopbord, K, fase }) => {
      const p = fase(t, 1.6, 1.4);
      const mix = (a, b) => { const h = x => parseInt(x, 16); const c = [1, 3, 5].map(i => Math.round(h(a.substr(i, 2)) * (1 - p) + h(b.substr(i, 2)) * p)); return '#' + c.map(x => x.toString(16).padStart(2, '0')).join(''); };
      return blok('*1954*: new fade-resistant finishes arrive.', { y: 300, g: 64, t }).svg
        + blok('Stop signs switch to white letters on red.', { y: 460, g: 48, gewicht: 'regular', t, start: 0.8 }).svg
        + stopbord(540, 920, 200, { vul: mix(K.geel, K.signaal), letter: mix(K.signaal, '#FFFFFF'), rand: mix(K.inkt, '#FFFFFF') });
    } },
    { duur: 6.5, bron: BRON, bronStart: 1.2, teken: ({ t, blok, stopbord, K }) =>
      stopbord(540, 640, 150)
      + blok('A night-time problem from the 1920s still decides the shape on every corner.', { y: 860, g: 60, t, start: 0.2 }).svg
      + blok('Sources in the description.', { y: 1180, g: 36, gewicht: 'regular', kleur: K.grijs, t, start: 1.6 }).svg
    },
  ],
};
