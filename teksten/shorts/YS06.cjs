// YS06 — Why does your PIN have four digits?
// Stijl van YS01 v2 (goedgekeurd door Andries 2 nov: "Stijl goed, ga door"). Reeks B · Who Decided?
// Bron: Al Jazeera English, "Cash machine inventor dies at 84" (20 mei 2010), gelezen 2 nov 2026. Elke bewering staat
// in die bron; zie pakketten/<map>/bron/bronnen.md. De bron noemt de naam van zijn vrouw niet en zegt "north London
// suburb" (geen plaatsnaam); dat houden wij ook zo.
const BRON = 'Al Jazeera English, "Cash machine inventor dies at 84" (2010)';
const PX = 540, PY = 800;   // vaste plek van het toetsenpaneel: begin en einde vallen samen (loop)

// pinvakjes boven het toetsenpaneel: n vakjes, k gevuld met een sterretje
function vakjes(h, n, k, { y = 700, rood = false, krimp = 1 } = {}) {
  const b = 118, g = 22, br = n * b + (n - 1) * g, x0 = 540 - br / 2;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (b + g), vol = i < k, p = i < k ? h.veer(h.klem((k - i) * 3)) : 1;
    s += `<g filter="url(#schKlein)" transform="translate(${x + b / 2} ${y + b / 2}) scale(${(krimp * (0.85 + 0.15 * p)).toFixed(3)}) translate(${-(x + b / 2)} ${-(y + b / 2)})"><rect x="${x}" y="${y}" width="${b}" height="${b}" rx="18" fill="${rood ? h.K.signaal : '#FFFFFF'}" stroke="${h.K.inkt}" stroke-width="5"/>`
      + (vol ? `<text x="${x + b / 2}" y="${y + b * 0.78}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${b * 0.75}" fill="${rood ? '#FFFFFF' : h.K.inkt}">*</text>` : '') + '</g>';
  }
  return s;
}
// toetsenpaneel 3x4; druk = toets die net is ingedrukt (licht op)
function paneel(h, { druk = '', y = PY, schaal = 0.85, op = 1 } = {}) {   // 0,85: de onderkant blijft boven de knoppen van YouTube
  const t = 150, g = 18, x0 = PX - (3 * t + 2 * g) / 2;
  let s = `<g opacity="${op.toFixed(3)}" transform="translate(${PX} ${y}) scale(${schaal.toFixed(4)}) translate(${-PX} ${-y})"><g filter="url(#sch)"><rect x="${x0 - 30}" y="${y - 30}" width="${3 * t + 2 * g + 60}" height="${4 * t + 3 * g + 60}" rx="30" fill="#2A2D33"/>`;
  '123456789*0#'.split('').forEach((c, i) => {
    const x = x0 + (i % 3) * (t + g), yy = y + Math.floor(i / 3) * (t + g), aan = druk.includes(c);
    s += `<rect x="${x}" y="${yy}" width="${t}" height="${t}" rx="16" fill="${aan ? h.K.geel : '#E9E6DF'}" stroke="${h.K.inkt}" stroke-width="3"/><text x="${x + t / 2}" y="${yy + t * 0.66}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="64" fill="${h.K.inkt}">${c}</text>`;
  });
  return s + '</g></g>';
}

module.exports = {
  code: 'YS06',
  versie: 2,
  stem: { stem: 'am_fenrir', tempo: 1.1 },   // besluit Andries do 5 nov 2026: Kokoro, stem "fenrir"
  map: '2026-11-14-YS06-pincode',
  nummer: 'No. 06',
  onderwerp: 'THE PIN CODE',
  scenes: [
    // 1 · HAAK: vier toetsen, vier tikken, vier sterretjes
    { duur: 3.0, stem: "Your PIN has four digits because of one person's memory.", camera: { zoom: [1.04, 1.0], stoot: [1.0] }, geluid: [[0.2, 'tik', 0.9, -0.4], [0.4, 'tik', 0.9, 0.2], [0.6, 'tik', 0.9, -0.2], [0.8, 'tik', 0.9, 0.4], [1.0, 'ding', 0.6]],
      teken: h => {
        const k = Math.max(0, Math.min(4, Math.floor((h.t - 0.2) / 0.2) + 1)), toets = ['1', '9', '6', '7'][k - 1] || '';
        return paneel(h, { druk: h.t < 1.0 ? toets : '' }) + vakjes(h, 4, k, { y: 560 })
          + h.kin('Your PIN has four digits because of *one person\'s memory*.', { y: 290, g: 72, t: h.t, start: 1.05 }).svg;
      } },
    // 2 · 1967: de eerste geldautomaat, bij Barclays in Noord-Londen
    { duur: 3.3, stem: "June 27, 1967. The first cash machine opens at a Barclays branch in north London.", in: 'zweep', bron: BRON, bronStart: 1.5, camera: { zoom: [1, 1.06], stoot: [0.3] }, geluid: [[0.28, 'klap', 0.8], [0.28, 'boem', 0.5]],
      teken: h => {
        const q = h.veer(h.t / 0.3);
        return `<text x="540" y="${(700 - (1 - q) * 300).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${(290 * (0.6 + 0.4 * q)).toFixed(0)}" fill="${h.K.signaal}" opacity="${h.klem(h.t / 0.1)}">1967</text>`
          + h.kin('*27 June*: the first cash machine opens at a Barclays branch in north London.', { y: 800, g: 64, gewicht: 'regular', t: h.t, start: 0.45, max: 860 }).svg;
      } },
    // 3 · het idee: een chocoladeautomaat, maar dan met geld
    { duur: 3.6, stem: "The idea came from a chocolate bar dispenser. Just replace the chocolate with cash.", in: 'op', bron: BRON, bronStart: 2.0, camera: { zoom: [1, 1.05], stoot: [1.6] }, geluid: [[0.8, 'pop', 0.8], [1.6, 'klap', 0.6], [1.6, 'ding', 0.6]],
      teken: h => {
        const wissel = h.zacht((h.t - 1.3) / 0.4), y = 900 + 120 * h.klem((h.t - 0.7) / 0.5);
        const reep = `<rect x="430" y="${y.toFixed(1)}" width="220" height="110" rx="10" fill="#6B3F22" stroke="${h.K.inkt}" stroke-width="5"/>`;
        const geld = `<rect x="420" y="${y.toFixed(1)}" width="240" height="120" rx="8" fill="#9CC7A0" stroke="${h.K.inkt}" stroke-width="5"/><circle cx="540" cy="${(y + 60).toFixed(1)}" r="32" fill="none" stroke="${h.K.inkt}" stroke-width="4"/>`;
        return h.kin('His idea: a *chocolate bar* dispenser, "replacing chocolate with cash".', { y: 300, g: 78, t: h.t, start: 0.05 }).svg
          + `<g filter="url(#sch)"><rect x="340" y="760" width="400" height="460" rx="20" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/></g>`
          + `<g opacity="${(1 - wissel).toFixed(3)}">${reep}</g><g opacity="${wissel.toFixed(3)}">${geld}</g>`
          + `<rect x="380" y="1140" width="320" height="40" rx="6" fill="${h.K.inkt}"/>`;
      } },
    // 4 · geen plastic pasjes: speciale cheques, licht radioactief gecodeerd
    { duur: 3.6, stem: "There were no plastic cards yet. Instead, special cheques, coded with a mildly radioactive material.", in: 'flits', nacht: true, bron: BRON, bronStart: 2.0, camera: { zoom: [1, 1.06], schud: [1.6] }, geluid: [[0.3, 'stijg', 0.4], [1.6, 'klap', 0.6], [1.6, 'boem', 0.5]],
      teken: h => {
        const g = h.klem((h.t - 1.5) / 0.3), puls = 0.5 + 0.5 * Math.sin(h.t * 9);
        return h.kin('No plastic cards yet. Instead: special cheques, coded with a *mildly radioactive* material.', { y: 300, g: 72, t: h.t, start: 0.05, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + `<g filter="url(#sch)"><rect x="260" y="880" width="560" height="260" rx="14" fill="#F3F0E8" stroke="${h.K.inkt}" stroke-width="5"/>`
          + `<line x1="300" y1="960" x2="640" y2="960" stroke="${h.K.grijs}" stroke-width="6"/><line x1="300" y1="1010" x2="560" y2="1010" stroke="${h.K.grijs}" stroke-width="6"/></g>`
          + (g > 0 ? `<circle cx="720" cy="1060" r="${(70 + 30 * puls * g).toFixed(1)}" fill="${h.K.geel}" opacity="${(0.25 * g).toFixed(3)}"/><circle cx="720" cy="1060" r="40" fill="${h.K.geel}" opacity="${g.toFixed(3)}"/><path d="M720 1060 L700 1025 L740 1025 Z M720 1060 L680 1075 L700 1095 Z M720 1060 L760 1075 L740 1095 Z" fill="${h.K.inkt}" opacity="${g.toFixed(3)}"/>` : '');
      } },
    // 5 · de uitvinder wilde zes cijfers
    { duur: 3.2, stem: "Inventor John Shepherd-Barron planned a six-digit PIN.", in: 'zweep', bron: BRON, bronStart: 1.6, camera: { zoom: [1, 1.05], stoot: [1.4] }, geluid: [0.6, 0.75, 0.9, 1.05, 1.2, 1.35].map((t, i) => [t, 'tik', 0.8, -0.6 + i * 0.24]),
      teken: h => {
        const k = Math.max(0, Math.min(6, Math.floor((h.t - 0.6) / 0.15) + 1));
        return h.kin('Inventor John Shepherd-Barron planned a *six-digit* PIN.', { y: 300, g: 90, t: h.t, start: 0.05 }).svg + vakjes(h, 6, k, { y: 880 });
      } },
    // 6 · zijn vrouw: zes is te veel; twee vakjes vallen weg
    { duur: 3.6, stem: "But his wife said six was too many. She could only remember four.", in: 'op', bron: BRON, bronStart: 2.0, camera: { zoom: [1, 1.06], stoot: [1.5], schud: [1.5] }, geluid: [[1.0, 'stijg', 0.35], [1.5, 'klap'], [1.5, 'boem', 0.7]],
      teken: h => {
        const val = h.klem((h.t - 1.5) / 0.5), b = 118, g = 22, x0 = 540 - (6 * b + 5 * g) / 2;
        let s = h.kin('His wife said six was *too many*. She could only remember four.', { y: 300, g: 84, t: h.t, start: 0.05 }).svg;
        if (h.t < 1.5) s += vakjes(h, 6, 6, { y: 880 });
        else {
          s += vakjes(h, 4, 4, { y: 880, rood: val > 0.6 });
          for (let i = 0; i < 2; i++) { const x = x0 + (4 + i) * (b + g) + 40 * val, y = 880 + 700 * val * val; s += `<g opacity="${(1 - val).toFixed(3)}" transform="rotate(${(40 * val * (i ? 1 : -1)).toFixed(1)} ${x + b / 2} ${y + b / 2})"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${b}" height="${b}" rx="18" fill="#FFFFFF" stroke="${h.K.inkt}" stroke-width="5"/></g>`; }
        }
        return s;
      } },
    // 7 · het citaat
    { duur: 3.9, stem: "In his words: because of her, four figures became the world standard.", in: 'masker', nacht: true, bron: BRON, bronStart: 2.4, camera: { zoom: [1.05, 1.0] }, geluid: [[0.3, 'pop', 0.6], [2.3, 'ding', 0.6]],
      teken: h => {
        const q = h.veer(h.t / 0.4);
        return `<text x="110" y="${(520 + (1 - q) * 80).toFixed(1)}" font-family="Instrument Sans" font-weight="700" font-size="360" fill="${h.K.geel}" opacity="${h.klem(h.t / 0.2)}">“</text>`
          + h.kin('Because of her, *four figures* became the world standard.', { y: 580, g: 96, t: h.t, start: 0.4, kleur: '#F3F0E8', accent: h.K.geel }).svg
          + h.kin('— John Shepherd-Barron', { y: 1080, g: 50, gewicht: 'mono', t: h.t, start: 1.8, kleur: '#C9C6BC' }).svg;
      } },
    // 8 · 2010: minstens 1,7 miljoen geldautomaten
    { duur: 3.0, stem: "By 2010, there were at least one point seven million cash machines worldwide.", in: 'zweep', bron: BRON, bronStart: 1.4, camera: { zoom: [1, 1.05], stoot: [1.0] }, geluid: [[0.05, 'rol', 0.7], [1.0, 'ding', 0.8]],
      teken: h => {
        const v = (1.7 * h.zacht(h.t / 0.95)).toFixed(1);
        return `<text x="540" y="640" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="230" fill="${v === '1.7' ? h.K.signaal : h.K.inkt}">${v}M</text>`
          + h.kin('cash machines worldwide, at least, by *2010*.', { y: 760, g: 76, t: h.t, start: 1.05, midden: true, max: 860 }).svg;
      } },
    // 9 · slot: hetzelfde paneel als het begin; tekst vliegt weg, video loopt terug naar het begin
    { duur: 3.8, stem: "Four digits. One person's memory. A world standard.", in: 'zoom', camera: { zoom: [1.03, 1.0] }, geluid: [[-0.9, 'whoosh', 0.5]],
      teken: h => paneel(h) + vakjes(h, 4, 0, { y: 560 })
        + h.kin('Four digits. One person\'s memory. A *world standard*.', { y: 290, g: 72, t: h.t, start: 0.1, weg: h.duur - 0.8 }).svg
        + `<text x="540" y="745" text-anchor="middle" font-family="IBM Plex Mono" font-size="34" fill="${h.K.grijs}" opacity="${(h.klem((h.t - 1.6) / 0.4) * (1 - h.klem((h.t - (h.duur - 0.8)) / 0.3))).toFixed(3)}">Next: the joke that became "OK".</text>` },
  ],
};
