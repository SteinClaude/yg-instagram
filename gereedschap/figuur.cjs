// Vaste cartoonfiguur voor kanaal 1 (vanaf YS40). Drie ontwerpen ter keuze; eigen werk, geen bestaand personage.
// Besluit Andries za 14 nov 2026: "vanaf YS40 een nieuwe weergave met een vaste eigen cartoonfiguur die elke
// short iets uitzoekt" (jesse-10, docs/manager/animatie-koers.md). Ronde 2 (za 14 nov, "betere figuren"):
// celschaduw en glans per vorm, handschoentjes met vingers, ogen met oogleden en wenkbrauwen, lijf dat meebuigt.
//
//   const F = require('./figuur.cjs');
//   F.teken('A', { x: 540, y: 1700, s: 1, pose: 'wijst', mond: 'open', knipper: 0 })  → SVG-groep
//
// Ontwerpen: A = Vraagteken, B = Memo (plakbriefje), C = Ekster.
// Poses: 'rust', 'wijst' (rechterarm naar boven-rechts), 'verbaasd' (armen omhoog, sprongetje).
// Mond: 'glim', 'open', 'o'. Het nulpunt is tussen de voeten; de figuur is ±540 eenheden hoog bij s = 1.
// Alles is vector, zodat short.cjs de figuur per beeld kan laten bewegen (knipperen, praten, wijzen).

const K = {
  papier: '#EFEAE0', inkt: '#16161A', grijs: '#6E6A62', signaal: '#D9432B', geel: '#F2C230', wit: '#FFFDF7',
  glas: '#CFE3EA', rood: '#E24A30', roodDiep: '#A9311E', roodLicht: '#FF8A6E',
  memo: '#F8CC3E', memoDiep: '#D9A21C', memoLicht: '#FFE68A',
  zwart: '#23253A', zwartDiep: '#101119', blauw: '#2D4C86', groenblauw: '#2F7E86', witDiep: '#D9D2C4',
  wang: '#FF7D6B', huid: '#FFFDF7', handDiep: '#DCD5C7', messing: '#C9962E',
};
const LIJN = 9;
let teller = 0;

// ------------------------------------------------------------------ bouwstenen
// Celschaduw: de vorm in de basiskleur, met een schaduwsikkel rechtsonder en een glans linksboven.
// `vorm(kleur)` geeft dezelfde vorm in één kleur terug (fill of stroke), zodat hij als masker kan dienen.
function cel(vorm, basis, diep, licht, { dx = 16, dy = 14, omtrek = LIJN, omtrekVorm = null } = {}) {
  const id = 'cel' + (++teller);
  let s = '';
  s += omtrekVorm ? omtrekVorm : `<g stroke="${K.inkt}" stroke-width="${omtrek * 2}" stroke-linejoin="round">${vorm(K.inkt)}</g>`;
  s += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">${vorm('#fff')}</mask>`;
  s += `<g mask="url(#${id})">${vorm(diep)}<g transform="translate(${-dx} ${-dy})">${vorm(basis)}</g>`;
  if (licht) s += `<g transform="translate(${-dx * 2.4} ${-dy * 2.4})" opacity="0.55"><g mask="url(#${id})">${vorm(licht)}</g></g><g transform="translate(${-dx * 2.4 - 10} ${-dy * 2.4 - 10})">${vorm(basis)}</g>`;
  s += `</g>`;
  return s;
}
// eenvoudiger: glansstreep
const glans = (d, w = 12, o = 0.75) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;

const oog = (x, y, r, kijk = [0, 0], open = 1, lid = 0) => {
  const rx = r * 0.82, ry = r;
  if (open < 0.15) return `<path d="M ${x - rx} ${y + 2} Q ${x} ${y + r * 0.45} ${x + rx} ${y + 2}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.9}" stroke-linecap="round"/>`;
  const px = x + kijk[0] * rx * 0.36, py = y + kijk[1] * ry * 0.34, id = 'oog' + (++teller);
  let s = `<clipPath id="${id}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry * open}"/></clipPath>`;
  s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry * open}" fill="${K.wit}"/>`;
  s += `<g clip-path="url(#${id})">`;
  s += `<ellipse cx="${x}" cy="${y + ry * 0.7}" rx="${rx}" ry="${ry * 0.5}" fill="#E6E0D4"/>`;
  s += `<ellipse cx="${px}" cy="${py}" rx="${r * 0.5}" ry="${r * 0.56}" fill="${K.inkt}"/>`;
  s += `<circle cx="${px - r * 0.17}" cy="${py - r * 0.22}" r="${r * 0.2}" fill="#fff"/><circle cx="${px + r * 0.16}" cy="${py + r * 0.18}" r="${r * 0.08}" fill="#fff"/>`;
  if (lid > 0) s += `<rect x="${x - rx - 4}" y="${y - ry - 4}" width="${rx * 2 + 8}" height="${ry * 2 * lid + 4}" fill="${K.lidKleur || K.inkt}" opacity="0"/>`;
  s += `</g>`;
  s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry * open}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.75}"/>`;
  if (lid > 0) s += `<path d="M ${x - rx - 3} ${y - ry * (1 - 2 * lid)} Q ${x} ${y - ry * (1 - 2 * lid) - 6} ${x + rx + 3} ${y - ry * (1 - 2 * lid)}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.75}" stroke-linecap="round"/>`;
  return s;
};
const wenkbrauw = (x, y, b, hoek = 0, hoog = 0, kleur = K.inkt, dik = 9) => {
  const a = hoek * Math.PI / 180, dx = Math.cos(a) * b / 2, dy = Math.sin(a) * b / 2;
  return `<path d="M ${x - dx} ${y - hoog - dy} Q ${x} ${y - hoog - 8} ${x + dx} ${y - hoog + dy}" fill="none" stroke="${kleur}" stroke-width="${dik}" stroke-linecap="round"/>`;
};
const wangen = (x, y, afstand, r = 16) => `<ellipse cx="${x - afstand}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="${K.wang}" opacity="0.55"/><ellipse cx="${x + afstand}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="${K.wang}" opacity="0.55"/>`;

const mond = (x, y, b, type) => {
  if (type === 'o') return `<ellipse cx="${x}" cy="${y + 6}" rx="${b * 0.26}" ry="${b * 0.34}" fill="${K.inkt}"/><ellipse cx="${x}" cy="${y + 6 + b * 0.16}" rx="${b * 0.16}" ry="${b * 0.1}" fill="${K.signaal}"/>`;
  if (type === 'open') {
    const id = 'mond' + (++teller), d = `M ${x - b / 2} ${y - 4} Q ${x} ${y - 10} ${x + b / 2} ${y - 4} Q ${x + b * 0.4} ${y + b * 0.78} ${x} ${y + b * 0.8} Q ${x - b * 0.4} ${y + b * 0.78} ${x - b / 2} ${y - 4} Z`;
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${K.inkt}"/>` +
      `<g clip-path="url(#${id})"><rect x="${x - b * 0.4}" y="${y - 10}" width="${b * 0.8}" height="${b * 0.2}" rx="4" fill="#fff"/><ellipse cx="${x}" cy="${y + b * 0.78}" rx="${b * 0.34}" ry="${b * 0.24}" fill="${K.signaal}"/></g>` +
      `<path d="${d}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.7}" stroke-linejoin="round"/>`;
  }
  return `<path d="M ${x - b / 2} ${y} Q ${x} ${y + b * 0.55} ${x + b / 2} ${y}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.85}" stroke-linecap="round"/>` +
    `<path d="M ${x - b / 2 - 5} ${y - 3} Q ${x - b / 2} ${y + 2} ${x - b / 2 + 3} ${y + 5}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.6}" stroke-linecap="round"/>`;
};

// rubberen arm: schouder → hand, met knik; dikke inktlijn met een dunne lichte binnenlijn
const arm = (sx, sy, hx, hy, buig = 20, dik = 14, kleur = K.inkt) => {
  const mx = (sx + hx) / 2, my = (sy + hy) / 2, dx = hx - sx, dy = hy - sy, l = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / l * buig, cy = my + dx / l * buig;
  return `<path d="M ${sx} ${sy} Q ${cx} ${cy} ${hx} ${hy}" fill="none" stroke="${kleur}" stroke-width="${dik}" stroke-linecap="round"/>`;
};
// handschoen: palm met duim; `wijs` = gestrekte wijsvinger in richting `hoek` (graden)
function handschoen(x, y, hoek = 0, soort = 'vuist', schaal = 1) {
  const g = (inhoud) => `<g transform="translate(${x} ${y}) rotate(${hoek}) scale(${schaal})">${inhoud}</g>`;
  const omtrek = `stroke="${K.inkt}" stroke-width="${LIJN * 0.8}" stroke-linejoin="round"`;
  const manchet = `<rect x="-30" y="-15" width="14" height="30" rx="6" fill="${K.huid}" ${omtrek}/>`;
  if (soort === 'wijs') return g(manchet +
    `<path d="M -18 -16 Q 6 -24 16 -12 L 46 -12 Q 56 -6 46 0 L 16 0 Q 22 16 2 20 Q -20 22 -20 2 Z" fill="${K.huid}" ${omtrek}/>` +
    `<path d="M -2 -20 Q -10 -30 -2 -34 Q 8 -30 6 -18" fill="${K.huid}" ${omtrek}/>` +
    `<path d="M -10 8 Q 0 12 8 6" fill="none" stroke="${K.handDiep}" stroke-width="5" stroke-linecap="round"/>`);
  if (soort === 'open') return g(manchet +
    `<path d="M -18 -18 Q 0 -26 12 -20 L 30 -30 Q 38 -26 32 -18 L 40 -16 Q 46 -8 36 -4 L 40 4 Q 42 12 32 10 L 30 16 Q 24 24 14 18 Q -2 26 -18 14 Z" fill="${K.huid}" ${omtrek}/>` +
    `<path d="M -6 -22 Q -12 -36 -2 -38 Q 8 -34 6 -22" fill="${K.huid}" ${omtrek}/>`);
  return g(manchet + `<path d="M -18 -16 Q 4 -26 20 -12 Q 30 2 18 16 Q 0 26 -18 14 Z" fill="${K.huid}" ${omtrek}/>` +
    `<path d="M 4 -10 Q 14 -2 6 8" fill="none" stroke="${K.handDiep}" stroke-width="5" stroke-linecap="round"/>`);
}
const hoekVan = (sx, sy, hx, hy) => Math.atan2(hy - sy, hx - sx) * 180 / Math.PI;

const schoen = (x, y, richting = 1, kleur = K.inkt) =>
  `<g transform="translate(${x} ${y}) scale(${richting} 1)">` +
  `<path d="M -18 0 Q -22 -34 6 -32 Q 40 -30 44 -6 Q 44 0 38 0 Z" fill="${kleur}" stroke="${K.inkt}" stroke-width="${LIJN * 0.7}" stroke-linejoin="round"/>` +
  `<path d="M -18 0 L 40 0" stroke="${K.wit}" stroke-width="7" stroke-linecap="round"/>` +
  glans('M 0 -24 Q 14 -26 24 -20', 6, 0.5) + `</g>`;
const been = (x, y0, y1, richting = 1, dik = 13) =>
  `<path d="M ${x} ${y0} L ${x} ${y1 - 18}" stroke="${K.inkt}" stroke-width="${dik}" stroke-linecap="round"/>` + schoen(x, y1, richting);

const loep = (x, y, hoek = -40, r = 38) => {
  const a = hoek * Math.PI / 180, ex = x + Math.cos(a) * 52, ey = y + Math.sin(a) * 52;
  const gx = x + Math.cos(a) * (r + 54), gy = y + Math.sin(a) * (r + 54);
  return `<path d="M ${x - Math.cos(a) * 10} ${y - Math.sin(a) * 10} L ${ex} ${ey}" stroke="${K.inkt}" stroke-width="22" stroke-linecap="round"/>` +
    `<path d="M ${x - Math.cos(a) * 10} ${y - Math.sin(a) * 10} L ${ex} ${ey}" stroke="#7A4B2A" stroke-width="10" stroke-linecap="round"/>` +
    `<circle cx="${gx}" cy="${gy}" r="${r}" fill="${K.glas}" fill-opacity="0.8"/>` +
    `<circle cx="${gx}" cy="${gy}" r="${r}" fill="none" stroke="${K.inkt}" stroke-width="16"/>` +
    `<circle cx="${gx}" cy="${gy}" r="${r}" fill="none" stroke="${K.messing}" stroke-width="6"/>` +
    glans(`M ${gx - r * 0.55} ${gy - r * 0.05} A ${r * 0.58} ${r * 0.58} 0 0 1 ${gx - r * 0.05} ${gy - r * 0.6}`, 7, 0.9);
};
const pen = (x, y, hoek = -60) => `<g transform="translate(${x} ${y}) rotate(${hoek})">` +
  `<rect x="-16" y="-15" width="104" height="30" rx="10" fill="${K.rood}" stroke="${K.inkt}" stroke-width="7"/>` +
  `<rect x="-16" y="3" width="104" height="10" rx="5" fill="${K.roodDiep}" opacity="0.6"/>` +
  `<path d="M 88 -11 L 116 -2 Q 120 0 116 2 L 88 11 Z" fill="${K.wit}" stroke="${K.inkt}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M 108 -4 L 120 0 L 108 4 Z" fill="${K.signaal}"/>` +
  `<rect x="-18" y="-17" width="30" height="34" rx="8" fill="${K.inkt}"/>` + glans('M 20 -7 L 70 -7', 5, 0.6) + `</g>`;
const boekje = (x, y, hoek = -8) => `<g transform="translate(${x} ${y}) rotate(${hoek})">` +
  `<rect x="-40" y="-50" width="80" height="100" rx="7" fill="${K.witDiep}" stroke="${K.inkt}" stroke-width="7" transform="translate(6 6)"/>` +
  `<rect x="-40" y="-50" width="80" height="100" rx="7" fill="${K.wit}" stroke="${K.inkt}" stroke-width="7"/>` +
  [-22, -6, 10, 26].map(v => `<path d="M -26 ${v} L 26 ${v}" stroke="#B9B2A4" stroke-width="4"/>`).join('') +
  `<path d="M -26 -32 L 10 -32" stroke="${K.signaal}" stroke-width="7" stroke-linecap="round"/>` +
  [-38, -20, -2, 16, 34].map(v => `<circle cx="-40" cy="${v}" r="4" fill="${K.inkt}"/>`).join('') + `</g>`;
const verbaasdStreepjes = (x, y) => [[-62, -16, -78, -36], [0, -30, 0, -56], [62, -16, 78, -36]].map(([a, b, c, d]) =>
  `<path d="M ${x + a} ${y + b} L ${x + c} ${y + d}" stroke="${K.signaal}" stroke-width="10" stroke-linecap="round"/>`).join('');
const sterretje = (x, y, r = 14) => `<path d="M ${x} ${y - r} Q ${x + 2} ${y - 2} ${x + r} ${y} Q ${x + 2} ${y + 2} ${x} ${y + r} Q ${x - 2} ${y + 2} ${x - r} ${y} Q ${x - 2} ${y - 2} ${x} ${y - r} Z" fill="${K.geel}" stroke="${K.inkt}" stroke-width="4"/>`;

// ------------------------------------------------------------------ A · Vraagteken
function A(o) {
  const { pose, kijk, mondType, open } = o;
  const P = 'M -116 -386 C -116 -516, 116 -516, 116 -386 C 116 -304, 16 -296, 16 -216';
  const lijf = c => `<path d="${P}" fill="none" stroke="${c}" stroke-width="116" stroke-linecap="round"/>`;
  const buik = c => `<circle cx="16" cy="-100" r="68" fill="${c}"/>`;
  let s = '';
  s += been(-8, -64, 0, -1) + been(42, -64, 0, 1);
  s += cel(buik, K.rood, K.roodDiep, null, { dx: 14, dy: 12 });
  s += glans('M -26 -130 Q -24 -150 -6 -158', 12, 0.7);
  s += cel(lijf, K.rood, K.roodDiep, null, { dx: 16, dy: 14, omtrekVorm: `<path d="${P}" fill="none" stroke="${K.inkt}" stroke-width="136" stroke-linecap="round"/>` });
  s += glans('M -96 -404 C -98 -470, -40 -500, 8 -500', 14, 0.6) + glans('M 56 -496 Q 70 -490 80 -480', 10, 0.5);
  // gezicht bovenop de boog
  const br = pose === 'verbaasd' ? 14 : pose === 'wijst' ? 6 : 0;
  s += wenkbrauw(-34, -508, 34, -8, br) + wenkbrauw(34, -508, 34, pose === 'wijst' ? -14 : 8, pose === 'wijst' ? br + 6 : br);
  s += oog(-32, -474, 24, kijk, open) + oog(32, -474, 24, kijk, open);
  s += wangen(0, -446, 64, 14) + mond(0, -446, 36, mondType);
  if (pose === 'wijst') {
    s += arm(36, -244, 150, -336, -18) + handschoen(150, -336, hoekVan(36, -244, 150, -336) - 10, 'wijs');
    s += arm(-6, -236, -90, -176, 16) + loep(-90, -176, 210) + handschoen(-90, -176, 210, 'vuist', 0.95);
  } else if (pose === 'verbaasd') {
    s += arm(36, -244, 128, -344, -20) + handschoen(128, -344, -70, 'open');
    s += arm(-6, -236, -104, -330, 20) + loep(-104, -330, 230) + handschoen(-104, -330, 230, 'vuist', 0.95) + verbaasdStreepjes(0, -570);
  } else {
    s += arm(36, -244, 106, -160, -14) + loep(106, -160, -58) + handschoen(106, -160, -58, 'vuist', 0.95);
    s += arm(-6, -236, -74, -156, 14) + handschoen(-74, -156, 110, 'vuist');
  }
  return s;
}

// ------------------------------------------------------------------ B · Memo
function B(o) {
  const { pose, kijk, mondType, open } = o;
  const vel = 'M -140 -470 Q 0 -478 140 -470 Q 146 -340 140 -238 L 96 -190 Q -20 -186 -140 -192 Q -146 -330 -140 -470 Z';
  const blad = c => `<path d="${vel}" fill="${c}"/>`;
  let s = '';
  s += been(-48, -196, 0, -1) + been(48, -196, 0, 1);
  s += `<path d="M 96 -190 L 140 -238 L 150 -200 Z" fill="${K.inkt}" opacity="0.18"/>`; // schaduw onder de omgevouwen hoek
  s += cel(blad, K.memo, K.memoDiep, null, { dx: 18, dy: 16 });
  s += `<path d="M -124 -444 Q 0 -450 124 -444" stroke="#E7B52B" stroke-width="5" fill="none"/>`;
  s += [-404, -364, -324, -284, -244].map(v => `<path d="M -116 ${v} Q 0 ${v - 3} 116 ${v}" stroke="#EBBE3F" stroke-width="3" fill="none" opacity="0.7"/>`).join('');
  s += `<path d="M 140 -238 Q 112 -236 98 -228 Q 100 -206 96 -190 Z" fill="${K.memoLicht}" stroke="${K.inkt}" stroke-width="${LIJN * 0.8}" stroke-linejoin="round"/>`;
  s += glans('M -118 -448 L -118 -340', 10, 0.45);
  s += `<g transform="rotate(5 0 -478)"><rect x="-54" y="-500" width="108" height="44" rx="4" fill="#FFFFFF" fill-opacity="0.55" stroke="#A8A196" stroke-width="3"/>` +
    `<path d="M -54 -500 l 6 6 l -6 6 l 6 6 l -6 6 l 6 6 l -6 6 l 6 6 M 54 -500 l -6 6 l 6 6 l -6 6 l 6 6 l -6 6 l 6 6 l -6 6" fill="none" stroke="#A8A196" stroke-width="3"/></g>`;
  // gezicht
  const br = pose === 'verbaasd' ? 16 : pose === 'wijst' ? 6 : 0;
  s += wenkbrauw(-50, -404, 50, -6, br) + wenkbrauw(50, -404, 50, pose === 'wijst' ? -14 : 6, pose === 'wijst' ? br + 8 : br);
  s += oog(-48, -358, 28, kijk, open) + oog(48, -358, 28, kijk, open);
  s += wangen(0, -316, 84, 18) + mond(0, -310, 52, mondType);
  if (pose === 'wijst') {
    s += arm(134, -292, 234, -398, -18) + handschoen(234, -398, hoekVan(134, -292, 234, -398) - 8, 'wijs');
    s += arm(-136, -282, -204, -206, 16) + pen(-206, -204, -112) + handschoen(-204, -206, 200, 'vuist', 0.95);
  } else if (pose === 'verbaasd') {
    s += arm(134, -292, 222, -430, -20) + handschoen(222, -430, -70, 'open');
    s += arm(-136, -282, -214, -424, 20) + pen(-214, -422, -132) + handschoen(-214, -424, 240, 'vuist', 0.95) + verbaasdStreepjes(0, -552);
  } else {
    s += arm(134, -280, 182, -176, -14) + pen(182, -174, -72) + handschoen(182, -176, -70, 'vuist', 0.95);
    s += arm(-136, -274, -176, -174, 14) + handschoen(-176, -174, 110, 'vuist');
  }
  return s;
}

// ------------------------------------------------------------------ C · Ekster
function C(o) {
  const { pose, kijk, mondType, open } = o;
  let s = '';
  const poot = (x, r) => `<path d="M ${x} -96 L ${x} -14" stroke="${K.inkt}" stroke-width="12" stroke-linecap="round"/>` +
    `<path d="M ${x - 26 * r} -2 L ${x} -14 L ${x + 30 * r} -4 M ${x} -14 L ${x + 6 * r} 4" stroke="${K.inkt}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  s += poot(-36, -1) + poot(40, 1);
  // lange getrapte staart met groenblauwe glans
  const staart = c => `<path d="M -60 -168 Q -170 -110 -300 -40 Q -312 -18 -292 -8 Q -170 -56 -36 -104 Z" fill="${c}"/>`;
  s += cel(staart, K.zwart, K.zwartDiep, null, { dx: 8, dy: 8 });
  s += `<path d="M -110 -122 Q -200 -76 -284 -30" fill="none" stroke="${K.groenblauw}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<path d="M -100 -142 Q -190 -98 -270 -54" fill="none" stroke="${K.blauw}" stroke-width="7" stroke-linecap="round" opacity="0.9"/>`;
  // lijf
  const lijf = c => `<path d="M 0 -352 C 110 -352 128 -250 120 -170 C 112 -96 60 -76 0 -76 C -60 -76 -116 -100 -118 -180 C -120 -260 -100 -352 0 -352 Z" fill="${c}"/>`;
  s += cel(lijf, K.zwart, K.zwartDiep, null, { dx: 16, dy: 14 });
  const buik = c => `<path d="M 20 -258 C 82 -258 92 -190 86 -150 C 80 -104 50 -92 20 -92 C -14 -92 -40 -110 -40 -160 C -40 -210 -20 -258 20 -258 Z" fill="${c}"/>`;
  s += cel(buik, K.wit, K.witDiep, null, { dx: 10, dy: 10, omtrek: 3 });
  // tas
  s += `<path d="M -96 -318 L 98 -142" stroke="${K.inkt}" stroke-width="24" stroke-linecap="round"/><path d="M -96 -318 L 98 -142" stroke="${K.rood}" stroke-width="14" stroke-linecap="round"/>`;
  const tas = c => `<rect x="62" y="-168" width="92" height="72" rx="14" fill="${c}"/>`;
  s += cel(tas, K.rood, K.roodDiep, null, { dx: 8, dy: 8, omtrek: 4 });
  s += `<path d="M 62 -140 Q 108 -126 154 -140" fill="none" stroke="${K.inkt}" stroke-width="6"/><rect x="100" y="-138" width="16" height="16" rx="3" fill="${K.messing}" stroke="${K.inkt}" stroke-width="4"/>`;
  // kop
  const kop = c => `<circle cx="0" cy="-392" r="106" fill="${c}"/>`;
  s += cel(kop, K.zwart, K.zwartDiep, null, { dx: 14, dy: 12 });
  s += `<path d="M -10 -494 Q -4 -538 26 -532 M 6 -496 Q 26 -528 50 -512" fill="none" stroke="${K.inkt}" stroke-width="14" stroke-linecap="round"/>`;
  s += `<path d="M -78 -448 Q -46 -486 2 -490" fill="none" stroke="${K.blauw}" stroke-width="11" stroke-linecap="round"/>` + glans('M -84 -430 Q -80 -446 -70 -458', 8, 0.35);
  const br = pose === 'verbaasd' ? 14 : pose === 'wijst' ? 5 : 0;
  s += wenkbrauw(-40, -442, 40, -10, br, '#5A5F7E', 9) + wenkbrauw(40, -442, 40, pose === 'wijst' ? -16 : 10, pose === 'wijst' ? br + 8 : br, '#5A5F7E', 9);
  s += oog(-38, -404, 32, kijk, open) + oog(38, -404, 32, kijk, open);
  // snavel
  const bo = mondType === 'open' ? 18 : mondType === 'o' ? 12 : 0;
  if (bo) s += `<path d="M -22 -350 Q 0 -344 22 -350 L 2 ${-322 + bo} Z" fill="${K.inkt}" stroke="${K.inkt}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M -18 -346 Q 0 -340 18 -346 L 2 ${-326 + bo} Z" fill="${K.signaal}" opacity="0.8"/>`;
  s += `<path d="M -30 -366 Q 0 -384 30 -366 Q 26 -352 4 ${-334 + (bo ? -6 : 0)} Q -24 -350 -30 -366 Z" fill="${K.geel}" stroke="${K.inkt}" stroke-width="7" stroke-linejoin="round"/>`;
  s += `<path d="M -20 -366 Q 0 -376 18 -368" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>`;
  // vleugels: veren aan het eind, witte vlek bij de schouder
  const vleugel = (sx, sy, hx, hy, spiegel) => {
    const h = hoekVan(sx, sy, hx, hy), l = Math.hypot(hx - sx, hy - sy);
    const v = c => `<path d="M 0 -26 Q ${l * 0.5} -32 ${l + 10} -18 L ${l + 34} -20 Q ${l + 40} -10 ${l + 26} -4 L ${l + 38} 2 Q ${l + 40} 14 ${l + 22} 12 L ${l + 26} 22 Q ${l + 20} 32 ${l} 22 Q ${l * 0.5} 26 0 26 Z" fill="${c}"/>`;
    return `<g transform="translate(${sx} ${sy}) rotate(${h}) scale(1 ${spiegel ? -1 : 1})">` +
      cel(v, K.zwart, K.zwartDiep, null, { dx: 6, dy: 8 }) +
      `<path d="M ${l * 0.45} 8 Q ${l * 0.75} 10 ${l + 16} 4" fill="none" stroke="${K.blauw}" stroke-width="8" stroke-linecap="round"/>` +
      `<ellipse cx="${l * 0.2}" cy="-6" rx="${l * 0.2}" ry="16" fill="${K.wit}" stroke="${K.inkt}" stroke-width="5"/></g>`;
  };
  if (pose === 'wijst') s += vleugel(-96, -250, -150, -172, true) + boekje(-160, -168, 8) + vleugel(96, -262, 196, -330, false);
  else if (pose === 'verbaasd') s += vleugel(-96, -262, -196, -420, true) + vleugel(96, -262, 196, -420, false) + verbaasdStreepjes(0, -570) + sterretje(-150, -500) + sterretje(160, -510, 11);
  else s += vleugel(-96, -250, -150, -172, true) + boekje(-160, -168, 8) + vleugel(96, -250, 132, -150, false);
  return s;
}

const ONTWERPEN = {
  A: { naam: 'Vraagteken', teken: A, kleuren: [K.rood, K.roodDiep, K.inkt, K.huid], regel: 'Een rood vraagteken, want het kanaal gaat over "waarom". Hij zoekt alles uit met zijn loep.' },
  B: { naam: 'Memo', teken: B, kleuren: [K.memo, K.memoDiep, K.inkt, K.rood], regel: 'Een geel plakbriefje met een rode pen. Hij zet de rode krabbels en de bron zelf in beeld.' },
  C: { naam: 'Ekster', teken: C, kleuren: [K.zwart, K.wit, K.blauw, K.rood], regel: 'Een nieuwsgierige ekster die gewone dingen verzamelt, met een rode tas en een notitieboekje.' },
};

function teken(code, { x = 0, y = 0, s = 1, pose = 'rust', kijk = null, mond: mondType = 'glim', knipper = 0, spiegel = false } = {}) {
  const O = ONTWERPEN[code];
  if (!O) throw new Error('onbekend ontwerp ' + code);
  const k = kijk || (pose === 'wijst' ? [0.75, -0.55] : pose === 'verbaasd' ? [0, -0.35] : [0.2, 0.1]);
  const mt = pose === 'verbaasd' && mondType === 'glim' ? 'o' : mondType;
  // het lijf buigt mee met de houding: wijzen = iets naar de kant leunen, verbaasd = sprongetje en rekken
  const houding = pose === 'wijst' ? `rotate(4 0 0)` : pose === 'verbaasd' ? `translate(0 -18) scale(0.97 1.04)` : '';
  return `<g transform="translate(${x} ${y}) scale(${spiegel ? -s : s} ${s})"><g transform="${houding}">${O.teken({ pose, kijk: k, mondType: mt, open: 1 - knipper })}</g></g>`;
}

module.exports = { teken, ONTWERPEN, K };
