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
  glas: '#CFE3EA', oranje: '#E8962E', rood: '#E24A30', roodDiep: '#A9311E', roodLicht: '#FF8A6E',
  memo: '#F8CC3E', memoDiep: '#D9A21C', memoLicht: '#FFE68A',
  zwart: '#23253A', zwartDiep: '#101119', blauw: '#2D4C86', groenblauw: '#2F7E86', witDiep: '#D9D2C4',
  wang: '#FF7D6B', huid: '#FFFDF7', handDiep: '#DCD5C7', messing: '#C9962E',
};
const LIJN = 9;
let teller = 0;
// twee hex-kleuren mengen (p = 0 → a, p = 1 → b)
const meng = (a, b, p) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - p) + parseInt(b.slice(i, i + 2), 16) * p).toString(16).padStart(2, '0')).join('');

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

// ------------------------------------------------------------------ D · Peertje
// Een gloeilamp die oplicht als hij iets ontdekt: het "aha" van elke short.
function D(o) {
  const { pose, kijk, mondType, open } = o;
  // gloei: 0 = uit, 1 = volop aan (een getal ertussen = opgloeien); zonder opgave brandt hij alleen bij verbazing
  const gloei = typeof o.aan === 'number' ? Math.max(0, Math.min(1, o.aan)) : (o.aan ?? pose === 'verbaasd') ? 1 : 0, aan = gloei > 0.5;
  let s = '';
  s += been(-34, -150, 0, -1) + been(34, -150, 0, 1);
  if (gloei > 0.02) s += `<g opacity="${gloei.toFixed(3)}">` + Array.from({ length: 9 }, (_, i) => {
    const a = (-180 + i * 22.5) * Math.PI / 180, r1 = 170, r2 = 214;
    return `<path d="M ${Math.cos(a) * r1} ${-400 + Math.sin(a) * r1} L ${Math.cos(a) * r2} ${-400 + Math.sin(a) * r2}" stroke="${K.geel}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M ${Math.cos(a) * r1} ${-400 + Math.sin(a) * r1} L ${Math.cos(a) * r2} ${-400 + Math.sin(a) * r2}" stroke="${K.inkt}" stroke-width="3" stroke-linecap="round" opacity="0.25"/>`;
  }).join('') + `<circle cx="0" cy="-400" r="190" fill="${K.geel}" opacity="0.18"/></g>`;
  // fitting: metalen ringen
  const fitting = c => `<path d="M -70 -262 L 70 -262 L 64 -180 Q 0 -168 -64 -180 Z" fill="${c}"/>`;
  s += cel(fitting, '#C4BFB5', '#8F8A81', null, { dx: 8, dy: 6 });
  s += [-240, -218, -196].map(v => `<path d="M -68 ${v} Q 0 ${v + 10} 68 ${v}" fill="none" stroke="${K.inkt}" stroke-width="6" stroke-linecap="round"/>`).join('');
  s += `<path d="M -30 -176 Q 0 -150 30 -176 Z" fill="${K.inkt}"/>`;
  // glas
  const glasvorm = 'M -66 -262 C -66 -300 -146 -328 -146 -408 C -146 -492 -80 -548 0 -548 C 80 -548 146 -492 146 -408 C 146 -328 66 -300 66 -262 Z';
  const bol = c => `<path d="${glasvorm}" fill="${c}"/>`;
  s += cel(bol, meng('#FFF5D2', '#FFE56B', gloei), meng('#EADDB0', '#F4C53A', gloei), null, { dx: 16, dy: 14 });
  // gloeidraad
  s += `<path d="M -22 -264 L -26 -318 M 22 -264 L 26 -318" stroke="#8F8A81" stroke-width="5" fill="none"/>`;
  s += `<path d="M -26 -318 q 6 -14 12 0 q 6 14 12 0 q 6 -14 12 0 q 6 14 12 0" fill="none" stroke="${aan ? K.signaal : K.oranje || '#E8962E'}" stroke-width="6" stroke-linecap="round"/>`;
  s += glans('M -112 -420 C -110 -476 -74 -514 -24 -524', 16, 0.8) + glans('M -116 -380 L -114 -364', 14, 0.7);
  const br = pose === 'verbaasd' ? 16 : pose === 'wijst' ? 6 : 0;
  s += wenkbrauw(-46, -466, 42, -8, br) + wenkbrauw(46, -466, 42, pose === 'wijst' ? -14 : 8, pose === 'wijst' ? br + 8 : br);
  s += oog(-44, -428, 28, kijk, open) + oog(44, -428, 28, kijk, open);
  s += wangen(0, -390, 78, 16) + mond(0, -388, 44, mondType);
  if (pose === 'wijst') {
    s += arm(66, -228, 196, -330, -18) + handschoen(196, -330, hoekVan(66, -228, 196, -330) - 8, 'wijs');
    s += arm(-66, -224, -140, -150, 16) + handschoen(-140, -150, 120, 'vuist');
  } else if (pose === 'verbaasd') {
    s += arm(66, -228, 176, -320, -18) + handschoen(176, -320, -60, 'open');
    s += arm(-66, -228, -176, -320, 18) + handschoen(-176, -320, -120, 'open', 1).replace('scale(1)', 'scale(1 -1)');
  } else {
    s += arm(66, -224, 128, -150, -14) + handschoen(128, -150, 70, 'vuist');
    s += arm(-66, -224, -128, -150, 14) + handschoen(-128, -150, 110, 'vuist');
  }
  return s;
}

// ------------------------------------------------------------------ E · Robot
// Een archiefrobot: zijn lijf is een archiefkast met een lade vol bronnen.
function E(o) {
  const { pose, kijk, mondType, open } = o;
  const T = '#3E9A94', TD = '#2A6E6A';
  let s = '';
  s += been(-46, -120, 0, -1, 16) + been(46, -120, 0, 1, 16);
  // lijf: archiefkast
  const kast = c => `<rect x="-118" y="-338" width="236" height="222" rx="22" fill="${c}"/>`;
  s += cel(kast, T, TD, null, { dx: 14, dy: 12 });
  s += [[-80, -306], [80, -306], [-80, -148], [80, -148]].map(([x, y]) => `<circle cx="${x + (x < 0 ? -18 : 18)}" cy="${y}" r="6" fill="${TD}" stroke="${K.inkt}" stroke-width="3"/>`).join('');
  const lade = (y, h, uit) => {
    let l = '';
    if (uit) l += `<g transform="rotate(-6 -30 ${y})"><rect x="-48" y="${y - 44}" width="66" height="60" rx="3" fill="${K.wit}" stroke="${K.inkt}" stroke-width="5"/><path d="M -38 ${y - 30} L 6 ${y - 30} M -38 ${y - 18} L 6 ${y - 18}" stroke="#B9B2A4" stroke-width="4"/></g>` +
      `<g transform="rotate(8 30 ${y})"><rect x="0" y="${y - 50}" width="62" height="60" rx="3" fill="${K.memo}" stroke="${K.inkt}" stroke-width="5"/></g>`;
    l += `<rect x="-86" y="${y}" width="172" height="${h}" rx="10" fill="#49ABA4" stroke="${K.inkt}" stroke-width="7" ${uit ? 'transform="translate(0 10)"' : ''}/>`;
    l += `<rect x="-34" y="${y + 14}" width="68" height="30" rx="4" fill="${K.wit}" stroke="${K.inkt}" stroke-width="5" ${uit ? 'transform="translate(0 10)"' : ''}/>`;
    l += `<text x="0" y="${y + 37}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="20" fill="${K.inkt}" ${uit ? 'transform="translate(0 10)"' : ''}>A–Z</text>`;
    l += `<rect x="-26" y="${y + h - 22}" width="52" height="12" rx="6" fill="#C4BFB5" stroke="${K.inkt}" stroke-width="4" ${uit ? 'transform="translate(0 10)"' : ''}/>`;
    return l;
  };
  s += lade(-310, 96, pose === 'verbaasd') + lade(-200, 70, false);
  // nek
  s += `<rect x="-26" y="-372" width="52" height="40" fill="#8F8A81" stroke="${K.inkt}" stroke-width="7"/>`;
  // kop
  const kop = c => `<rect x="-128" y="-552" width="256" height="186" rx="40" fill="${c}"/>`;
  s += `<path d="M 0 -552 L 0 -612" stroke="${K.inkt}" stroke-width="9"/>`;
  s += `<circle cx="0" cy="-622" r="${pose === 'verbaasd' ? 22 : 18}" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="6"/>` + glans('M -8 -630 L -4 -634', 6, 0.8);
  if (pose === 'verbaasd') s += `<circle cx="0" cy="-622" r="40" fill="${K.signaal}" opacity="0.2"/>`;
  s += [-1, 1].map(z => `<rect x="${z * 128 - (z < 0 ? 22 : 0)}" y="-492" width="22" height="62" rx="8" fill="#C4BFB5" stroke="${K.inkt}" stroke-width="6"/>`).join('');
  s += cel(kop, T, TD, null, { dx: 14, dy: 12 });
  s += glans('M -100 -520 L -100 -470', 12, 0.45);
  s += `<rect x="-104" y="-530" width="208" height="140" rx="28" fill="#DDEFEA" stroke="${K.inkt}" stroke-width="6"/>`;
  const br = pose === 'verbaasd' ? 14 : pose === 'wijst' ? 5 : 0;
  s += wenkbrauw(-44, -500, 40, -8, br, K.inkt, 8) + wenkbrauw(44, -500, 40, pose === 'wijst' ? -14 : 8, pose === 'wijst' ? br + 8 : br, K.inkt, 8);
  s += oog(-44, -462, 26, kijk, open) + oog(44, -462, 26, kijk, open);
  s += wangen(0, -426, 76, 14) + mond(0, -428, 40, mondType);
  if (pose === 'wijst') {
    s += arm(116, -300, 226, -396, -18) + handschoen(226, -396, hoekVan(116, -300, 226, -396) - 8, 'wijs');
    s += arm(-116, -290, -186, -200, 16) + handschoen(-186, -200, 120, 'vuist');
  } else if (pose === 'verbaasd') {
    s += arm(116, -300, 214, -420, -18) + handschoen(214, -420, -70, 'open');
    s += arm(-116, -300, -214, -420, 18) + handschoen(-214, -420, -110, 'open').replace('scale(1)', 'scale(1 -1)') + verbaasdStreepjes(0, -660);
  } else {
    s += arm(116, -290, 162, -170, -14) + handschoen(162, -170, 70, 'vuist');
    s += arm(-116, -290, -162, -170, 14) + handschoen(-162, -170, 110, 'vuist');
  }
  return s;
}

// ------------------------------------------------------------------ F · Mol
// Een mol die de geschiedenis opgraaft: mijnhelm met lamp, grote bril (mollen zien slecht), graafpoten en een kwastje.
function F(o) {
  const { pose, kijk, mondType, open } = o;
  const BR = '#6F5D55', BD = '#4A3D38', ROZE = '#F3A0A2', ROZED = '#D97A80';
  let s = '';
  // voeten
  s += [-1, 1].map(z => `<g transform="translate(${z * 44} -8) scale(${z} 1)"><path d="M -30 8 Q -34 -30 8 -28 Q 50 -24 50 4 Z" fill="${ROZE}" stroke="${K.inkt}" stroke-width="7" stroke-linejoin="round"/>` +
    `<path d="M 30 -6 L 30 6 M 42 -8 L 42 4" stroke="${ROZED}" stroke-width="5" stroke-linecap="round"/></g>`).join('');
  // lijf
  const lijf = c => `<path d="M 0 -480 C 96 -480 136 -390 138 -290 C 140 -160 104 -40 0 -40 C -104 -40 -140 -160 -138 -290 C -136 -390 -96 -480 0 -480 Z" fill="${c}"/>`;
  s += cel(lijf, BR, BD, null, { dx: 16, dy: 14 });
  s += Array.from({ length: 10 }, (_, i) => { const x = -96 + (i % 5) * 46, y = -230 + Math.floor(i / 5) * 90 + (i % 2) * 20; return `<path d="M ${x} ${y} q 6 -10 12 0" fill="none" stroke="${BD}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`; }).join('');
  const buik = c => `<ellipse cx="6" cy="-170" rx="76" ry="96" fill="${c}"/>`;
  s += cel(buik, '#A79387', '#8C796E', null, { dx: 8, dy: 8, omtrek: 3 });
  // snuit, neus, snorharen
  s += `<ellipse cx="0" cy="-322" rx="58" ry="40" fill="#8E7B72" stroke="${K.inkt}" stroke-width="7"/>`;
  s += `<path d="M -50 -318 L -110 -330 M -50 -306 L -108 -300 M 50 -318 L 110 -330 M 50 -306 L 108 -300" stroke="${K.inkt}" stroke-width="4" stroke-linecap="round"/>`;
  const neus = c => `<ellipse cx="0" cy="-346" rx="32" ry="24" fill="${c}"/>`;
  s += cel(neus, ROZE, ROZED, null, { dx: 6, dy: 6, omtrek: 4 }) + glans('M -14 -356 Q -8 -362 0 -362', 6, 0.9);
  s += mond(0, -304, 32, mondType);
  // bril met kleine oogjes
  s += oog(-44, -402, 16, kijk, open) + oog(44, -402, 16, kijk, open);
  s += [-44, 44].map(x => `<circle cx="${x}" cy="-402" r="36" fill="${K.glas}" fill-opacity="0.35" stroke="${K.inkt}" stroke-width="10"/>` + glans(`M ${x - 22} -412 A 24 24 0 0 1 ${x - 6} -428`, 5, 0.9)).join('');
  s += `<path d="M -8 -406 Q 0 -414 8 -406" fill="none" stroke="${K.inkt}" stroke-width="8"/><path d="M -80 -408 L -120 -420 M 80 -408 L 120 -420" stroke="${K.inkt}" stroke-width="8" stroke-linecap="round"/>`;
  const br = pose === 'verbaasd' ? 12 : pose === 'wijst' ? 4 : 0;
  s += wenkbrauw(-44, -446, 36, -8, br, K.inkt, 8) + wenkbrauw(44, -446, 36, pose === 'wijst' ? -14 : 8, pose === 'wijst' ? br + 6 : br, K.inkt, 8);
  // helm met lamp
  const helm = c => `<path d="M -112 -452 C -110 -560 110 -560 112 -452 Z" fill="${c}"/>`;
  s += cel(helm, K.geel, '#C99A12', null, { dx: 10, dy: 8 });
  s += `<path d="M -134 -452 Q 0 -440 134 -452" fill="none" stroke="${K.inkt}" stroke-width="16" stroke-linecap="round"/><path d="M -134 -452 Q 0 -440 134 -452" fill="none" stroke="#E2AE1C" stroke-width="7" stroke-linecap="round"/>`;
  s += `<path d="M 0 -548 L 0 -470" stroke="#E2AE1C" stroke-width="10" opacity="0.8"/>` + glans('M -80 -488 Q -70 -520 -40 -532', 9, 0.6);
  if (pose === 'verbaasd') s += `<path d="M -16 -516 L -150 -680 L 150 -680 L 16 -516 Z" fill="${K.geel}" opacity="0.28"/>`;
  s += `<circle cx="0" cy="-506" r="26" fill="${pose === 'verbaasd' ? '#FFF2A8' : K.wit}" stroke="${K.inkt}" stroke-width="7"/><circle cx="0" cy="-506" r="12" fill="${K.geel}"/>`;
  // graafpoten
  const poot = (x, y, hoek, wijs = false) => `<g transform="translate(${x} ${y}) rotate(${hoek})">` +
    `<path d="M -10 -24 Q 30 -34 40 -10 Q 46 14 20 24 Q -10 30 -16 6 Z" fill="${ROZE}" stroke="${K.inkt}" stroke-width="7" stroke-linejoin="round"/>` +
    (wijs ? `<path d="M 36 -6 L 70 -10" stroke="${K.inkt}" stroke-width="16" stroke-linecap="round"/><path d="M 36 -6 L 70 -10" stroke="${K.wit}" stroke-width="6" stroke-linecap="round"/>`
      : [-14, 0, 14].map(v => `<path d="M 38 ${v} L 52 ${v + 2}" stroke="${K.inkt}" stroke-width="9" stroke-linecap="round"/><path d="M 38 ${v} L 50 ${v + 2}" stroke="${K.wit}" stroke-width="3" stroke-linecap="round"/>`).join('')) + `</g>`;
  const armB = (sx, sy, hx, hy, buig) => arm(sx, sy, hx, hy, buig, 40, K.inkt) + arm(sx, sy, hx, hy, buig, 26, BR);
  const kwast = (x, y, hoek) => `<g transform="translate(${x} ${y}) rotate(${hoek})"><rect x="-10" y="-6" width="76" height="14" rx="6" fill="#B07A45" stroke="${K.inkt}" stroke-width="5"/>` +
    `<rect x="62" y="-10" width="16" height="22" fill="#C4BFB5" stroke="${K.inkt}" stroke-width="5"/><path d="M 76 -12 Q 108 -14 112 0 Q 108 14 76 14 Z" fill="#E8D8B8" stroke="${K.inkt}" stroke-width="5"/></g>`;
  if (pose === 'wijst') s += armB(112, -280, 214, -380, -18) + poot(214, -380, hoekVan(112, -280, 214, -380), true) + armB(-112, -270, -170, -180, 16) + kwast(-170, -180, -120) + poot(-170, -180, 200);
  else if (pose === 'verbaasd') s += armB(112, -290, 200, -420, -18) + poot(200, -420, -70) + armB(-112, -290, -200, -420, 18) + poot(-200, -420, -110);
  else s += armB(112, -270, 150, -170, -14) + kwast(150, -170, -70) + poot(150, -170, 70) + armB(-112, -270, -150, -170, 14) + poot(-150, -170, 110);
  return s;
}

const ONTWERPEN = {
  A: { naam: 'Vraagteken', teken: A, kleuren: [K.rood, K.roodDiep, K.inkt, K.huid], regel: 'Een rood vraagteken, want het kanaal gaat over "waarom". Hij zoekt alles uit met zijn loep.' },
  B: { naam: 'Memo', teken: B, kleuren: [K.memo, K.memoDiep, K.inkt, K.rood], regel: 'Een geel plakbriefje met een rode pen. Hij zet de rode krabbels en de bron zelf in beeld.' },
  C: { naam: 'Ekster', teken: C, kleuren: [K.zwart, K.wit, K.blauw, K.rood], regel: 'Een nieuwsgierige ekster die gewone dingen verzamelt, met een rode tas en een notitieboekje.' },
  D: { naam: 'Peertje', teken: D, kleuren: ['#FFF5D2', K.geel, '#C4BFB5', K.inkt], regel: 'Een gloeilamp die oplicht als hij iets ontdekt: het aha-moment van elke short.' },
  E: { naam: 'Robot', teken: E, kleuren: ['#3E9A94', '#DDEFEA', K.signaal, K.inkt], regel: 'Een archiefrobot: zijn lijf is een kast met een lade vol bronnen, die openschiet bij een ontdekking.' },
  F: { naam: 'Mol', teken: F, kleuren: ['#6F5D55', '#F3A0A2', K.geel, K.inkt], regel: 'Een mol met mijnhelm en bril die de geschiedenis van gewone dingen opgraaft.' },
};

function teken(code, { x = 0, y = 0, s = 1, pose = 'rust', kijk = null, mond: mondType = 'glim', knipper = 0, spiegel = false, aan = undefined } = {}) {
  const O = ONTWERPEN[code];
  if (!O) throw new Error('onbekend ontwerp ' + code);
  const k = kijk || (pose === 'wijst' ? [0.75, -0.55] : pose === 'verbaasd' ? [0, -0.35] : [0.2, 0.1]);
  const mt = pose === 'verbaasd' && mondType === 'glim' ? 'o' : mondType;
  // het lijf buigt mee met de houding: wijzen = iets naar de kant leunen, verbaasd = sprongetje en rekken
  const houding = pose === 'wijst' ? `rotate(4 0 0)` : pose === 'verbaasd' ? `translate(0 -18) scale(0.97 1.04)` : '';
  return `<g transform="translate(${x} ${y}) scale(${spiegel ? -s : s} ${s})"><g transform="${houding}">${O.teken({ pose, kijk: k, mondType: mt, open: 1 - knipper, aan })}</g></g>`;
}

module.exports = { teken, ONTWERPEN, K };
