// Vaste cartoonfiguur voor kanaal 1 (vanaf YS40). Drie ontwerpen ter keuze; eigen werk, geen bestaand personage.
// Besluit Andries za 14 nov 2026: "vanaf YS40 een nieuwe weergave met een vaste eigen cartoonfiguur die elke
// short iets uitzoekt" (jesse-10, docs/manager/animatie-koers.md).
//
//   const F = require('./figuur.cjs');
//   F.teken('A', { x: 540, y: 1700, s: 1, pose: 'wijst', mond: 'open', knipper: 0 })  → SVG-groep
//
// Ontwerpen: A = Vraagteken, B = Memo (plakbriefje), C = Ekster.
// Poses: 'rust', 'wijst' (rechterarm naar boven-rechts), 'verbaasd' (armen omhoog).
// Mond: 'glim', 'open', 'o' (voor spreken wissel je 'glim' en 'open').
// Het nulpunt is tussen de voeten; de figuur is ±520 eenheden hoog bij s = 1.
// Alles is vector, zodat short.cjs de figuur per beeld kan laten bewegen (knipperen, praten, wijzen).

const K = { papier: '#EFEAE0', inkt: '#16161A', grijs: '#6E6A62', signaal: '#D9432B', geel: '#F2C230', wit: '#FFFDF7', glas: '#CFE3EA', oranje: '#E8962E' };
const LIJN = 9;

const oog = (x, y, r, kijk = [0, 0], open = 1) => {
  if (open < 0.15) return `<path d="M ${x - r} ${y} Q ${x} ${y + r * 0.35} ${x + r} ${y}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN}" stroke-linecap="round"/>`;
  const px = x + kijk[0] * r * 0.38, py = y + kijk[1] * r * 0.38;
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * open}" fill="${K.wit}" stroke="${K.inkt}" stroke-width="${LIJN * 0.75}"/>` +
    `<circle cx="${px}" cy="${py}" r="${r * 0.52}" fill="${K.inkt}"/>` +
    `<circle cx="${px - r * 0.18}" cy="${py - r * 0.2}" r="${r * 0.17}" fill="${K.wit}"/>`;
};

const mond = (x, y, b, type) => {
  if (type === 'o') return `<ellipse cx="${x}" cy="${y + 4}" rx="${b * 0.28}" ry="${b * 0.36}" fill="${K.inkt}"/>`;
  if (type === 'open') return `<path d="M ${x - b / 2} ${y - 4} Q ${x} ${y + b * 0.9} ${x + b / 2} ${y - 4} Z" fill="${K.inkt}" stroke="${K.inkt}" stroke-width="${LIJN * 0.6}" stroke-linejoin="round"/>` +
    `<path d="M ${x - b * 0.22} ${y + b * 0.38} Q ${x} ${y + b * 0.22} ${x + b * 0.22} ${y + b * 0.38} Q ${x} ${y + b * 0.62} ${x - b * 0.22} ${y + b * 0.38} Z" fill="${K.signaal}" opacity="0.9"/>`;
  return `<path d="M ${x - b / 2} ${y} Q ${x} ${y + b * 0.5} ${x + b / 2} ${y}" fill="none" stroke="${K.inkt}" stroke-width="${LIJN * 0.8}" stroke-linecap="round"/>`;
};

// arm: schouder → hand, met een lichte knik
const arm = (sx, sy, hx, hy, buig = 20, dik = 12, kleur = K.inkt) => {
  const mx = (sx + hx) / 2, my = (sy + hy) / 2, dx = hx - sx, dy = hy - sy, l = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / l * buig, cy = my + dx / l * buig;
  return `<path d="M ${sx} ${sy} Q ${cx} ${cy} ${hx} ${hy}" fill="none" stroke="${kleur}" stroke-width="${dik}" stroke-linecap="round"/>`;
};
const hand = (x, y, r = 15, kleur = K.wit) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" stroke="${K.inkt}" stroke-width="${LIJN * 0.7}"/>`;
const wijsvinger = (x, y, hoek) => {
  const a = hoek * Math.PI / 180;
  return `<path d="M ${x} ${y} L ${x + Math.cos(a) * 30} ${y + Math.sin(a) * 30}" stroke="${K.inkt}" stroke-width="${LIJN * 2.1}" stroke-linecap="round"/>` +
    `<path d="M ${x} ${y} L ${x + Math.cos(a) * 30} ${y + Math.sin(a) * 30}" stroke="${K.wit}" stroke-width="${LIJN * 0.8}" stroke-linecap="round"/>` + hand(x, y);
};
const been = (x, y0, y1, schoen = K.inkt, dik = 12, kleur = K.inkt, richting = 1) =>
  `<path d="M ${x} ${y0} L ${x} ${y1 - 8}" stroke="${kleur}" stroke-width="${dik}" stroke-linecap="round"/>` +
  `<path d="M ${x - 14 * richting} ${y1 - 2} Q ${x - 16 * richting} ${y1 - 30} ${x + 10 * richting} ${y1 - 26} Q ${x + 38 * richting} ${y1 - 22} ${x + 36 * richting} ${y1 - 2} Z" fill="${schoen}" stroke="${K.inkt}" stroke-width="${LIJN * 0.7}" stroke-linejoin="round"/>`;

const loep = (x, y, hoek = -40, r = 34) => {
  const a = hoek * Math.PI / 180, hx = x - Math.cos(a) * 0, hy = y;
  const gx = x + Math.cos(a) * (r + 40), gy = y + Math.sin(a) * (r + 40);
  return `<path d="M ${hx} ${hy} L ${x + Math.cos(a) * 44} ${y + Math.sin(a) * 44}" stroke="${K.inkt}" stroke-width="15" stroke-linecap="round"/>` +
    `<circle cx="${gx}" cy="${gy}" r="${r}" fill="${K.glas}" fill-opacity="0.75" stroke="${K.inkt}" stroke-width="11"/>` +
    `<path d="M ${gx - r * 0.5} ${gy - r * 0.15} A ${r * 0.55} ${r * 0.55} 0 0 1 ${gx - r * 0.05} ${gy - r * 0.55}" fill="none" stroke="${K.wit}" stroke-width="6" stroke-linecap="round"/>`;
};
const pen = (x, y, hoek = -60) => `<g transform="translate(${x} ${y}) rotate(${hoek})">` +
  `<rect x="-12" y="-14" width="96" height="26" rx="8" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="7"/>` +
  `<path d="M 84 -10 L 108 -1 L 84 8 Z" fill="${K.inkt}"/><rect x="-12" y="-14" width="22" height="26" rx="6" fill="${K.inkt}"/></g>`;
const boekje = (x, y, hoek = -8) => `<g transform="translate(${x} ${y}) rotate(${hoek})">` +
  `<rect x="-38" y="-48" width="76" height="96" rx="6" fill="${K.wit}" stroke="${K.inkt}" stroke-width="7"/>` +
  [-22, -6, 10, 26].map(v => `<path d="M -24 ${v} L 24 ${v}" stroke="${K.grijs}" stroke-width="4"/>`).join('') +
  `<path d="M -24 -30 L 8 -30" stroke="${K.signaal}" stroke-width="6" stroke-linecap="round"/></g>`;
const verbaasdStreepjes = (x, y) => [[-60, -20], [0, -38], [60, -20]].map(([dx, dy]) =>
  `<path d="M ${x + dx * 0.8} ${y + dy * 0.6} L ${x + dx} ${y + dy}" stroke="${K.signaal}" stroke-width="9" stroke-linecap="round"/>`).join('');

// ------------------------------------------------------------------ A · Vraagteken
// Het lijf is een dik rood vraagteken; de punt eronder is de buik, met beentjes. Het kanaal gaat over "waarom".
function A(o) {
  const { pose, kijk, mondType, open } = o;
  const P = 'M -112 -372 C -112 -500, 112 -500, 112 -372 C 112 -292, 14 -286, 14 -208';
  let s = '';
  s += been(-10, -60, 0, K.inkt, 12, K.inkt, -1) + been(40, -60, 0, K.inkt, 12, K.inkt, 1);
  s += `<path d="${P}" fill="none" stroke="${K.inkt}" stroke-width="132" stroke-linecap="round"/>`;
  s += `<path d="${P}" fill="none" stroke="${K.signaal}" stroke-width="112" stroke-linecap="round"/>`;
  s += `<path d="M -70 -430 C -40 -470, 30 -478, 70 -448" fill="none" stroke="#F06A50" stroke-width="16" stroke-linecap="round" opacity="0.8"/>`;
  s += `<circle cx="14" cy="-92" r="64" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="${LIJN * 1.1}"/>`;
  // gezicht bovenop de boog
  s += oog(-30, -470, 21, kijk, open) + oog(30, -470, 21, kijk, open) + mond(0, -440, 34, mondType);
  // armen vanuit de steel
  if (pose === 'wijst') s += arm(30, -232, 150, -330, -16) + wijsvinger(150, -330, -50) + arm(-4, -226, -86, -170, 14) + loep(-86, -170, 200);
  else if (pose === 'verbaasd') s += arm(30, -232, 120, -330, -20) + hand(120, -330) + arm(-4, -226, -100, -322, 20) + loep(-100, -322, 230) + verbaasdStreepjes(0, -560);
  else s += arm(30, -232, 104, -150, -14) + loep(104, -150, -60) + arm(-4, -226, -70, -150, 14) + hand(-70, -150);
  return s;
}

// ------------------------------------------------------------------ B · Memo
// Een geel plakbriefje met een omgevouwen hoek, een stukje plakband en een rode pen: de aantekeningen in elke short.
function B(o) {
  const { pose, kijk, mondType, open } = o;
  let s = '';
  s += been(-46, -190, 0, K.inkt, 12, K.inkt, -1) + been(46, -190, 0, K.inkt, 12, K.inkt, 1);
  s += `<g transform="rotate(-4 0 -320)">`;
  s += `<path d="M -134 -462 L 134 -462 L 134 -232 L 90 -186 L -134 -186 Z" fill="${K.geel}" stroke="${K.inkt}" stroke-width="${LIJN}" stroke-linejoin="round"/>`;
  s += `<path d="M 134 -232 L 90 -232 L 90 -186 Z" fill="#C99A12" stroke="${K.inkt}" stroke-width="${LIJN * 0.8}" stroke-linejoin="round"/>`;
  s += `<path d="M -134 -440 L 134 -440" stroke="#E0AE1E" stroke-width="5"/>`;
  s += `<rect x="-48" y="-484" width="96" height="40" rx="3" fill="${K.wit}" fill-opacity="0.7" stroke="${K.grijs}" stroke-width="3" transform="rotate(6 0 -464)"/>`;
  s += oog(-44, -362, 25, kijk, open) + oog(44, -362, 25, kijk, open) + mond(0, -306, 46, mondType);
  s += `<path d="M -76 -404 Q -48 -418 -20 -406" fill="none" stroke="${K.inkt}" stroke-width="7" stroke-linecap="round"/><path d="M 20 -406 Q 48 -418 76 -404" fill="none" stroke="${K.inkt}" stroke-width="7" stroke-linecap="round"/>`;
  s += `</g>`;
  if (pose === 'wijst') s += arm(126, -280, 228, -386, -16) + wijsvinger(228, -386, -50) + arm(-128, -272, -196, -196, 16) + pen(-196, -196, -110);
  else if (pose === 'verbaasd') s += arm(126, -280, 214, -420, -20) + hand(214, -420) + arm(-128, -272, -210, -414, 20) + pen(-210, -414, -130) + verbaasdStreepjes(0, -540);
  else s += arm(126, -270, 176, -170, -14) + pen(176, -170, -70) + arm(-128, -266, -168, -170, 14) + hand(-168, -170);
  return s;
}

// ------------------------------------------------------------------ C · Ekster
// Een ekster: nieuwsgierig, verzamelt dingen. Zwart met een witte buik, gele snavel, rode tas met aantekeningen.
function C(o) {
  const { pose, kijk, mondType, open } = o;
  let s = '';
  const poot = x => `<path d="M ${x} -88 L ${x} -10" stroke="${K.oranje}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M ${x - 24} -2 L ${x} -14 L ${x + 26} -2 M ${x} -14 L ${x + 4} 2" stroke="${K.oranje}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  s += poot(-38) + poot(38);
  // staart
  s += `<path d="M -70 -150 L -268 -26 L -250 4 L -40 -92 Z" fill="${K.inkt}" stroke="${K.inkt}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<path d="M -110 -110 L -240 -22" stroke="#3B4A7A" stroke-width="10" stroke-linecap="round"/>`;
  // lijf en buik
  s += `<ellipse cx="0" cy="-210" rx="112" ry="132" fill="${K.inkt}"/>`;
  s += `<ellipse cx="22" cy="-160" rx="62" ry="80" fill="${K.wit}" stroke="${K.inkt}" stroke-width="5"/>`;
  // witte schoudervlek (kenmerk van een ekster)
  s += `<ellipse cx="-62" cy="-232" rx="28" ry="56" fill="${K.wit}" stroke="${K.inkt}" stroke-width="5" transform="rotate(18 -62 -232)"/>`;
  // tas: band en tasje
  s += `<path d="M -92 -300 L 96 -128" stroke="${K.signaal}" stroke-width="16" stroke-linecap="round"/>`;
  s += `<rect x="62" y="-150" width="84" height="64" rx="12" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="7"/><path d="M 62 -126 L 146 -126" stroke="${K.inkt}" stroke-width="6"/>`;
  // kop
  s += `<circle cx="0" cy="-372" r="104" fill="${K.inkt}"/>`;
  s += `<path d="M -14 -470 Q -6 -510 22 -506 M 2 -472 Q 18 -500 42 -488" fill="none" stroke="${K.inkt}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<path d="M -70 -430 Q -40 -462 0 -466" fill="none" stroke="#3B4A7A" stroke-width="10" stroke-linecap="round"/>`;
  s += oog(-38, -392, 30, kijk, open) + oog(38, -392, 30, kijk, open);
  // snavel: open = twee helften
  const bo = mondType === 'open' || mondType === 'o' ? 14 : 0;
  s += `<path d="M -26 -346 Q 0 -360 26 -346 L 0 ${-312 - bo} Z" fill="${K.geel}" stroke="${K.inkt}" stroke-width="6" stroke-linejoin="round"/>`;
  if (bo) s += `<path d="M -20 -330 L 20 -330 L 0 ${-300} Z" fill="${K.oranje}" stroke="${K.inkt}" stroke-width="6" stroke-linejoin="round" transform="translate(0 ${bo})"/>`;
  // vleugels als armen
  const vleugel = (sx, sy, hx, hy) => arm(sx, sy, hx, hy, 0, 40, K.inkt) + `<circle cx="${hx}" cy="${hy}" r="22" fill="${K.inkt}"/>` +
    [0, 1, 2].map(i => { const a = Math.atan2(hy - sy, hx - sx) + (i - 1) * 0.45; return `<path d="M ${hx} ${hy} L ${hx + Math.cos(a) * 34} ${hy + Math.sin(a) * 34}" stroke="${K.inkt}" stroke-width="16" stroke-linecap="round"/>`; }).join('');
  if (pose === 'wijst') s += vleugel(100, -250, 214, -350) + vleugel(-100, -240, -150, -170) + boekje(-160, -168, 8);
  else if (pose === 'verbaasd') s += vleugel(100, -250, 190, -410) + vleugel(-100, -250, -190, -410) + verbaasdStreepjes(0, -560);
  else s += vleugel(100, -240, 138, -150) + vleugel(-100, -240, -150, -170) + boekje(-160, -168, 8);
  return s;
}

const ONTWERPEN = {
  A: { naam: 'Vraagteken', teken: A, kleuren: [K.signaal, K.inkt, K.wit, K.glas], regel: 'Het lijf is een dik rood vraagteken: het kanaal gaat over "waarom". Hij zoekt met een loep.' },
  B: { naam: 'Memo', teken: B, kleuren: [K.geel, K.inkt, K.signaal, K.wit], regel: 'Een geel plakbriefje met een rode pen. Hij schrijft de rode krabbels en de bron zelf in beeld.' },
  C: { naam: 'Ekster', teken: C, kleuren: [K.inkt, K.wit, K.geel, K.signaal], regel: 'Een nieuwsgierige ekster die gewone dingen verzamelt, met een rode tas en een notitieboekje.' },
};

function teken(code, { x = 0, y = 0, s = 1, pose = 'rust', kijk = null, mond: mondType = 'glim', knipper = 0, spiegel = false } = {}) {
  const O = ONTWERPEN[code];
  if (!O) throw new Error('onbekend ontwerp ' + code);
  const k = kijk || (pose === 'wijst' ? [0.7, -0.5] : pose === 'verbaasd' ? [0, -0.3] : [0.15, 0.1]);
  const mt = pose === 'verbaasd' && mondType === 'glim' ? 'o' : mondType;
  const open = 1 - knipper;
  return `<g transform="translate(${x} ${y}) scale(${spiegel ? -s : s} ${s})">${O.teken({ pose, kijk: k, mondType: mt, open })}</g>`;
}

module.exports = { teken, ONTWERPEN, K };
