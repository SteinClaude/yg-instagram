// YG Digital - de profielfoto voor Instagram en Facebook: "Het gewelf, verguld".
//
// Een medaillon: een lichte koepel van binnen gezien, met een ring van 24 boognissen
// die het poortbeeldmerk in het klein herhaalt, een donkere architraaf en een
// kroonlijst. Bewust LICHT, terwijl de rest van dit merk donker met goud is - op
// een profielpagina staat deze foto tussen donkere highlights en een donker raster,
// en een merkteken moet zich van zijn omgeving onderscheiden, niet erin opgaan.
// Een donkere versie is geprobeerd en viel af: die werd het achtste donkere rondje.
//
// Het ontwerp rust op vier dingen, die je er niet uit moet halen omdat ze op 1080
// overbodig lijken - ze zijn er voor de kleine maten:
//
//   1. TOONPLAN OP DRIE MATEN. Op 56 px moet het nog een medaille zijn: licht hart -
//      middentoon koepel - donkere architraaf - ritme van 24 nissen - donkere lijst.
//      Elke zone heeft een eigen gemiddelde waarde die het verkleinen overleeft.
//   2. LICHT UIT EEN RICHTING. Elke cassettewand apart belicht of beschaduwd.
//   3. GRAVEURSWERK. Toon opgebouwd met arcering, dichter waar het donkerder moet:
//      op 1080 zie je de halen, op 150 zie je toon.
//   4. VERGULDERSWERK. Bladgoudnaden, craquele, polijststrepen, hooglichtjes.
//
// Gekozen uit acht richtingen (guilloche, bladgoud, art deco, arabesk, inktmarmer,
// architectuur, licht en stof, papiervezel) op 19 sep 2026. Deze won omdat de boog
// het beeldmerk zelf herhaalt en aansluit op de koepelfoto op yg-digital.nl.
//
// Draaien:  node platen/profielfoto.cjs
// Resultaat: platen/uit/profiel-entree.png (1080x1080, uploaden doet Gijs zelf),
//            platen/web/profiel-entree.jpg voor pagina.html, en een controlestrook.

const fs = require('fs'), path = require('path');
const { Resvg } = require('C:/Users/gijsm/yg-luxury/brand/node_modules/@resvg/resvg-js');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');
const M = require('./maak.cjs');

// ---------------------------------------------------------------- vast
const UIT = path.join(__dirname, 'uit'), WEB = path.join(__dirname, 'web');
fs.mkdirSync(UIT, { recursive: true }); fs.mkdirSync(WEB, { recursive: true });

const W = 1080, C = 540, SCH = 4.6;
const x = C - 50 * SCH, y = C - 55 * SCH;

let zaad = 20260919;
const rnd = () => (zaad = (zaad * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const r2 = n => Math.round(n * 100) / 100;
const TAU = Math.PI * 2, RAD = Math.PI / 180;
const P = (r, a) => [r2(C + r * Math.cos(a)), r2(C + r * Math.sin(a))];
const klem = (v, a, b) => Math.max(a, Math.min(b, v));

// goud: licht, diep, schaduw + een inktdiepte voor de echte donkers
const G_LICHT = '#C09A55', G_DIEP = '#A07F3C', G_SCHAD = '#8A6B2E';
const G_INKT = '#5E4820', G_WARM = '#9A7A34', CREME = '#FFF6E2';

// ---------------------------------------------------------------- maatvoering
// Het toonplan van buiten naar binnen: lichte kroonlijst - donkere arcade -
// donkere architraaf - koepel met volume - lichte oculuslijst - rustig hart.
const R_RAND = 514;        // gouden cirkel
const R_KROON = 470;       // onderkant kroonlijst - die is bewust breed, zodat
const R_BOOG = 461;        //   de donkere arcade in een lichte rand ligt en de
const R_AANZ = 440;        //   cirkel op 56 px niet als tandwiel oogt
const R_VOET = 408;        // vloer van de arcade
const R_PLINT = 392;       // aanzet koepel / bovenkant architraaf
const R_OOG = 316;         // oculusrand (de drempel van het embleem reikt tot 309)
const HW = 20;             // halve breedte van een boogopening

const RIJEN = 3;           // rijen cassettes
const VAKKEN = 48;         // cassettes per rij (2 per travee)
const TRAVEE = 24;         // bogen in de tamboer
const A_OFF = (-90 - 7.5) * RAD;         // boogopening precies bovenaan
const STAP = TAU / VAKKEN, STAP_T = TAU / TRAVEE;

// perspectief: r = R sin(theta), dus naar de rand lopen de ringen dicht
const R_BOL = 412;
const TH0 = Math.asin(R_OOG / R_BOL), TH1 = Math.asin(R_PLINT / R_BOL);
const RING = [];
for (let i = 0; i <= RIJEN; i++) {
  // zuiver r = R sin(theta) drukt de buitenste rij te plat; half mengen met
  // lineair houdt het perspectief en laat de laatste rij nog ademen
  const bol = R_BOL * Math.sin(TH0 + (TH1 - TH0) * (i / RIJEN));
  const vlak = R_OOG + (R_PLINT - R_OOG) * (i / RIJEN);
  RING.push(r2(0.55 * bol + 0.45 * vlak));
}

// licht linksboven, zelfde hoek als de champagne-ondergrond
const A_LICHT = -128 * RAD;
const LX = Math.cos(A_LICHT), LY = Math.sin(A_LICHT);
const licht = a => Math.cos(a - A_LICHT);

// hoe verder naar de rand, hoe steviger de lijn
const diepte = r => 0.30 + 0.66 * Math.pow(klem((r - R_OOG) / (R_PLINT - R_OOG), 0, 1), 1.05);

// ---------------------------------------------------------------- padjes
function boogPad(r, a0, a1) {
  const [x1, y1] = P(r, a0), [x2, y2] = P(r, a1);
  return `M${x1} ${y1}A${r2(r)} ${r2(r)} 0 0 ${a1 > a0 ? 1 : 0} ${x2} ${y2}`;
}
const Y = r => r2(C - r);                 // lokale maat: naar buiten = omhoog
function straalLijn(r0, r1, a) {
  const [x0, y0] = P(r0, a), [x1, y1] = P(r1, a);
  return `M${x0} ${y0}L${x1} ${y1}`;
}

// cassettevlak plus zijn vier wanden met hun buitennormaal
function vakRanden(r0, r1, a0, a1, mr, mg) {
  const R0 = r0 + mr, R1 = r1 - mr;
  if (R1 <= R0 + 1) return null;
  const d0 = mg / R0, d1 = mg / R1;
  if (a1 - a0 <= 2 * Math.max(d0, d1) + 0.004) return null;
  const am = (a0 + a1) / 2;
  const [ax, ay] = P(R0, a0 + d0), [bx, by] = P(R0, a1 - d0);
  const [cx, cy] = P(R1, a1 - d1), [dx, dy] = P(R1, a0 + d1);
  return {
    vlak: `M${ax} ${ay}A${r2(R0)} ${r2(R0)} 0 0 1 ${bx} ${by}L${cx} ${cy}A${r2(R1)} ${r2(R1)} 0 0 0 ${dx} ${dy}Z`,
    R0, R1,
    randen: [
      { d: `M${ax} ${ay}A${r2(R0)} ${r2(R0)} 0 0 1 ${bx} ${by}`, n: [-Math.cos(am), -Math.sin(am)] },
      { d: `M${dx} ${dy}A${r2(R1)} ${r2(R1)} 0 0 1 ${cx} ${cy}`, n: [Math.cos(am), Math.sin(am)] },
      { d: `M${ax} ${ay}L${dx} ${dy}`, n: [Math.sin(a0), -Math.cos(a0)] },
      { d: `M${bx} ${by}L${cx} ${cy}`, n: [-Math.sin(a1), Math.cos(a1)] },
    ],
  };
}

// ruit (sluitsteen uit het beeldmerk) op straal r, hoek a
function ruit(r, a, h, vul, dek) {
  const b = h * 0.62, [px, py] = P(r, a), ca = Math.cos(a), sa = Math.sin(a);
  const pt = (dr, dt) => `${r2(px + ca * dr - sa * dt)} ${r2(py + sa * dr + ca * dt)}`;
  return `<path d="M${pt(-h, 0)}L${pt(0, b)}L${pt(h, 0)}L${pt(0, -b)}Z" fill="${vul}" opacity="${r2(dek)}"/>`;
}
// blokje op straal r0..r1, hoek a, tangentiale halve breedtes t0/t1
function blokje(r0, r1, a, t0, t1, vul, dek) {
  const pt = (rr, dt) => {
    const [px, py] = P(rr, a);
    return `${r2(px - Math.sin(a) * dt)} ${r2(py + Math.cos(a) * dt)}`;
  };
  return `<path d="M${pt(r0, -t0)}L${pt(r1, -t1)}L${pt(r1, t1)}L${pt(r0, t0)}Z" fill="${vul}" opacity="${r2(dek)}"/>`;
}
// annulus als pad met evenodd
function ringPad(r0, r1) {
  return `M${C - r1} ${C}a${r1} ${r1} 0 1 0 ${r1 * 2} 0a${r1} ${r1} 0 1 0 ${-r1 * 2} 0Z` +
    `M${C - r0} ${C}a${r0} ${r0} 0 1 0 ${r0 * 2} 0a${r0} ${r0} 0 1 0 ${-r0 * 2} 0Z`;
}

// ---------------------------------------------------------------- 1. papier
// Geschept papier: ribben van de zeef, kettinglijnen, vlokken en vezels.
function papierLijnen() {
  let s = '<g>';
  for (let yy = 2; yy < W; yy += 3.6)
    s += `<path d="M0 ${r2(yy)}H${W}" stroke="#B9A276" stroke-width="0.8" opacity="0.020"/>`;
  for (let xx = 18; xx < W; xx += 74)
    s += `<path d="M${xx} 0V${W}" stroke="#B9A276" stroke-width="1.4" opacity="0.035"/>`;
  return s + '</g>';
}
function korrel(n, straal, sterk) {
  let s = '<g>';
  const tint = [G_LICHT, G_DIEP, '#B9A276', '#D8C49A'];
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * straal;
    const [px, py] = P(r, a);
    s += `<circle cx="${px}" cy="${py}" r="${r2(0.45 + rnd() * rnd() * 2.0)}" ` +
      `fill="${tint[(rnd() * 4) | 0]}" opacity="${r2((0.035 + rnd() * 0.095) * sterk)}"/>`;
  }
  for (let i = 0; i < 26; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * straal, ar = rnd() * TAU;
    const [px, py] = P(r, a), l = 6 + rnd() * 16;
    s += `<path d="M${px} ${py}q${r2(Math.cos(ar) * l * 0.5 - 3)} ${r2(Math.sin(ar) * l * 0.5 + 2)} ${r2(Math.cos(ar) * l)} ${r2(Math.sin(ar) * l)}" ` +
      `fill="none" stroke="#C7B189" stroke-width="0.7" opacity="${r2(0.05 + rnd() * 0.07)}"/>`;
  }
  return s + '</g>';
}

// ---------------------------------------------------------------- 1b. buitenveld
// Buiten de cirkel geen leegte maar het veld van een gravure: een ruitwerk van
// haarlijnen met een stipje op elke kruising, en de indruk van de plaatrand.
// Alles zo licht dat het pas van dichtbij te zien is; op 56 px bestaat het niet.
function buitenveld() {
  let s = '<g mask="url(#buitenm)">';
  const sp = 26;
  for (const hoek of [45, -45]) {
    s += `<g transform="rotate(${hoek} ${C} ${C})">`;
    for (let i = -30; i <= 30; i++)
      s += `<path d="M${C - 780} ${C + i * sp}h1560" stroke="${G_SCHAD}" stroke-width="0.6" opacity="0.05"/>`;
    s += `</g>`;
  }
  for (let i = -21; i <= 21; i++) for (let j = -21; j <= 21; j++) {
    const px = C + i * sp * Math.SQRT2, py = C + j * sp * Math.SQRT2;
    if (px < -10 || px > W + 10 || py < -10 || py > W + 10) continue;
    s += `<circle cx="${r2(px)}" cy="${r2(py)}" r="1.1" fill="${G_DIEP}" opacity="0.075"/>`;
  }
  s += '</g>';
  // plaatrand: de afdruk van de koperplaat in het papier
  s += `<rect x="43" y="43" width="994" height="994" rx="9" fill="none" stroke="${G_SCHAD}" stroke-width="1.5" opacity="0.13"/>`;
  s += `<rect x="45.6" y="45.6" width="988.8" height="988.8" rx="8" fill="none" stroke="${CREME}" stroke-width="1.6" opacity="0.34"/>`;
  return s;
}

// ---------------------------------------------------------------- 2. de koepel
function koepel() {
  let s = '';
  s += `<circle cx="${C}" cy="${C}" r="${R_PLINT}" fill="url(#gewelf)"/>`;

  for (let rij = RIJEN - 1; rij >= 0; rij--) {
    const r0 = RING[rij], r1 = RING[rij + 1], rm = (r0 + r1) / 2, hoog = r1 - r0;
    const d = diepte(rm);
    const mr = Math.min(4.6, hoog * 0.155), mg = 5.2;

    for (let k = 0; k < VAKKEN; k++) {
      const a0 = A_OFF + k * STAP, a1 = a0 + STAP, am = (a0 + a1) / 2;
      const L = licht(am);
      const scha = (1 - L) / 2;                       // 0 = vol licht, 1 = diepe schaduw
      const dDonker = d * (0.80 + 0.46 * scha);

      const b1 = vakRanden(r0, r1, a0, a1, mr - 1.5, mg - 1.5);
      const b2 = vakRanden(r0, r1, a0, a1, mr, mg);
      if (b1) s += `<path d="${b1.vlak}" fill="none" stroke="${CREME}" stroke-width="1.4" opacity="${r2(0.28 + 0.32 * (1 - scha))}"/>`;
      if (b1 && scha < 0.45) s += `<path d="${b1.vlak}" fill="none" stroke="${G_LICHT}" stroke-width="2.6" opacity="${r2(0.09 * (1 - scha / 0.45))}"/>`;
      if (b2) s += `<path d="${b2.vlak}" fill="none" stroke="${G_SCHAD}" stroke-width="1.1" opacity="${r2(dDonker * 0.92)}"/>`;

      // verdiepte bak: vier wanden, elk apart belicht
      const ir = mr + Math.min(6.5, hoog * 0.19), ig = mg + 5.4;
      const b3 = vakRanden(r0, r1, a0, a1, ir, ig);
      if (b3) {
        s += `<path d="${b3.vlak}" fill="${G_WARM}" opacity="${r2((0.14 + 0.30 * scha) * d)}"/>`;
        for (const rd of b3.randen) {
          const f = rd.n[0] * LX + rd.n[1] * LY;       // >0 = wand staat naar het licht toe
          if (f < 0) s += `<path d="${rd.d}" fill="none" stroke="${CREME}" stroke-width="1.15" opacity="${r2(0.20 + 0.46 * -f)}"/>`;
          else s += `<path d="${rd.d}" fill="none" stroke="${G_SCHAD}" stroke-width="1.0" opacity="${r2((0.20 + 0.42 * f) * d)}"/>`;
        }
      }
      if (hoog > 20) {
        const b4 = vakRanden(r0, r1, a0, a1, ir + 3.6, ig + 4.2);
        if (b4) s += `<path d="${b4.vlak}" fill="none" stroke="${G_DIEP}" stroke-width="0.6" opacity="${r2(dDonker * 0.55)}"/>`;
      }

      // arcering: de graveur bouwt toon met halen, dichter waar het dieper is
      const nH = Math.round(1 + scha * 5), sp = 2.9 - 0.9 * scha;
      for (let h = 0; h < nH; h++) {
        const rr = r0 + ir + 2.2 + h * sp;
        if (rr > r1 - ir - 1.5) break;
        const dd = (ig + 1) / rr;
        s += `<path d="${boogPad(rr, a0 + dd, a1 - dd)}" fill="none" stroke="${G_SCHAD}" ` +
          `stroke-width="0.7" opacity="${r2((0.06 + 0.20 * scha) * d)}"/>`;
      }
      if (scha > 0.62 && hoog > 20) {
        for (let h = 1; h < 4; h++) {
          s += `<path d="${straalLijn(r0 + ir + 1.5, r1 - ir - 1.5, a0 + (a1 - a0) * (h / 4))}" fill="none" ` +
            `stroke="${G_SCHAD}" stroke-width="0.55" opacity="${r2(0.05 + 0.13 * (scha - 0.62) / 0.38)}"/>`;
        }
      }

      // rozet: de sluitsteenruit uit het beeldmerk, in elke cassette
      const rb = Math.min(6.4, hoog * 0.175);
      if (rb > 2.4) {
        s += ruit(rm, am, rb, G_DIEP, dDonker * 0.80);
        s += ruit(rm - 1.2, am, rb * 0.48, CREME, 0.28 + 0.34 * (1 - scha));
      }
    }
  }
  return s;
}

// ---------------------------------------------------------------- 3. ribben
function ribben() {
  let s = '';
  const br = r => 2.4 + 5.2 * Math.pow(klem((r - R_OOG) / (R_PLINT - R_OOG), 0, 1), 0.85);
  for (let k = 0; k < VAKKEN; k++) {
    const a = A_OFF + k * STAP;
    const pijler = k % 2 === 0;                     // elke tweede rib landt op een pijler
    const fl = Math.sin(A_LICHT - a), L = licht(a);
    for (let rij = 0; rij < RIJEN; rij++) {
      const r0 = RING[rij], r1 = RING[rij + 1];
      const d = diepte((r0 + r1) / 2);
      const w0 = br(r0) / 2 * (pijler ? 1.18 : 0.86), w1 = br(r1) / 2 * (pijler ? 1.18 : 0.86);
      const t = (rr, dt) => {
        const [px, py] = P(rr, a);
        return `${r2(px - Math.sin(a) * dt)} ${r2(py + Math.cos(a) * dt)}`;
      };
      s += `<path d="M${t(r0, -w0)}L${t(r1, -w1)}L${t(r1, w1)}L${t(r0, w0)}Z" fill="${G_SCHAD}" opacity="${r2(d * (0.42 + 0.26 * (1 - L) / 2))}"/>`;
      s += `<path d="M${t(r0, 0)}L${t(r1, 0)}" stroke="${CREME}" stroke-width="${r2(w0 * 0.7)}" fill="none" opacity="${r2(0.16 + 0.30 * klem(L, 0, 1))}"/>`;
      s += `<path d="M${t(r0, fl > 0 ? -w0 - 0.7 : w0 + 0.7)}L${t(r1, fl > 0 ? -w1 - 0.7 : w1 + 0.7)}" stroke="${CREME}" stroke-width="1.05" fill="none" opacity="${r2(0.22 + 0.30 * Math.abs(fl))}"/>`;
      s += `<path d="M${t(r0, fl > 0 ? w0 + 0.6 : -w0 - 0.6)}L${t(r1, fl > 0 ? w1 + 0.6 : -w1 - 0.6)}" stroke="${G_INKT}" stroke-width="0.9" fill="none" opacity="${r2(d * (0.18 + 0.22 * Math.abs(fl)))}"/>`;
    }
  }
  // gewelfknopen waar rib en ring elkaar kruisen
  for (let i = 1; i <= RIJEN; i++) {
    const r = RING[i], d = diepte(r);
    for (let k = 0; k < VAKKEN; k++) {
      const a = A_OFF + k * STAP, groot = k % 2 === 0;
      const gr = (1.7 + 1.7 * (i / RIJEN)) * (groot ? 1.22 : 0.9);
      const [px, py] = P(r, a);
      s += `<circle cx="${px}" cy="${py}" r="${r2(gr)}" fill="${G_SCHAD}" opacity="${r2(d * 0.52)}"/>`;
      s += `<circle cx="${r2(px - 0.55)}" cy="${r2(py - 0.7)}" r="${r2(gr * 0.44)}" fill="${CREME}" opacity="0.50"/>`;
    }
  }
  return s;
}

// ---------------------------------------------------------------- 4. ringlijsten
function ringlijsten() {
  let s = '';
  for (let i = 0; i <= RIJEN; i++) {
    const r = RING[i], d = diepte(r);
    s += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${G_SCHAD}" stroke-width="1.15" opacity="${r2(d * 0.62)}"/>`;
    s += `<circle cx="${C}" cy="${C}" r="${r2(r - 1.8)}" fill="none" stroke="${CREME}" stroke-width="1.1" opacity="${r2(0.30 + d * 0.24)}"/>`;
    if (i >= 2 && i < RIJEN) {
      const n = VAKKEN * 3;
      for (let k = 0; k < n; k++) {
        const a = A_OFF + (k + 0.5) * (TAU / n);
        const [px, py] = P(r - 3.4, a);
        s += `<circle cx="${px}" cy="${py}" r="${k % 3 === 1 ? 1.5 : 1.0}" fill="${G_SCHAD}" opacity="${r2(d * (k % 3 === 1 ? 0.5 : 0.34))}"/>`;
      }
    }
  }
  return s;
}

// ---------------------------------------------------------------- 5. oculuslijst
function oculus() {
  let s = '';
  const rB = R_OOG;
  const nT = VAKKEN * 2;
  for (let k = 0; k < nT; k++) {
    const a = A_OFF + (k + 0.5) * (TAU / nT), L = licht(a);
    s += blokje(rB - 15, rB - 3.5, a, 2.5, 3.1, G_SCHAD, 0.38 + 0.2 * (1 - L) / 2);
    s += blokje(rB - 15, rB - 3.5, a - 0.006, 0.6, 0.7, CREME, 0.4 + 0.24 * klem(L, 0, 1));
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(rB - 1.6)}" fill="none" stroke="${G_DIEP}" stroke-width="1.4" opacity="0.48"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(rB - 16.5)}" fill="none" stroke="${G_SCHAD}" stroke-width="1.9" opacity="0.58"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(rB - 19)}" fill="none" stroke="${CREME}" stroke-width="1.6" opacity="0.70"/>`;
  const nP = VAKKEN * 4;
  for (let k = 0; k < nP; k++) {
    const a = A_OFF + k * (TAU / nP);
    const [px, py] = P(rB - 24, a);
    if (k % 4 === 0) s += `<circle cx="${px}" cy="${py}" r="2.2" fill="${G_SCHAD}" opacity="0.46"/>`;
    else s += blokje(rB - 26, rB - 22, a, 0.75, 0.75, G_SCHAD, 0.30);
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(rB - 29.5)}" fill="none" stroke="${G_DIEP}" stroke-width="1.0" opacity="0.34"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(rB - 31.5)}" fill="none" stroke="${CREME}" stroke-width="1.8" opacity="0.50"/>`;
  return s;
}

// ---------------------------------------------------------------- 6. tamboer
// Vierentwintig diepe boognissen, en in elke nis staat het beeldmerk zelf:
// poort, binnenboog, drempel, sluitsteen. Dat is het ritme dat op 56 px nog
// leesbaar blijft, dus de nissen zijn echt donker en het poortje licht.
function tamboer() {
  let s = '';
  // architraaf: een echte donkere band onder de koepel, met een parelsnoer
  s += `<path d="${ringPad(R_PLINT, R_VOET)}" fill="url(#architraaf)" fill-rule="evenodd"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${R_PLINT}" fill="none" stroke="${G_INKT}" stroke-width="2.2" opacity="0.46"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_PLINT + 2.6)}" fill="none" stroke="${CREME}" stroke-width="1.5" opacity="0.44"/>`;
  for (let k = 0; k < 144; k++) {
    const a = A_OFF + (k + 0.5) * (TAU / 144);
    const [px, py] = P(R_PLINT + 9, a);
    s += `<circle cx="${px}" cy="${py}" r="${k % 6 === 0 ? 1.5 : 1.0}" fill="${CREME}" opacity="${k % 6 === 0 ? 0.34 : 0.22}"/>`;
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_VOET - 2.4)}" fill="none" stroke="${CREME}" stroke-width="1.7" opacity="0.52"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_VOET + 0.6)}" fill="none" stroke="${G_INKT}" stroke-width="2.6" opacity="0.46"/>`;
  // de wand van de tamboer: licht pleisterwerk waar de nissen in zitten
  s += `<path d="${ringPad(R_VOET, R_KROON)}" fill="url(#wand)" fill-rule="evenodd"/>`;
  for (let k = 0; k < 288; k++) {          // voegen van het steenwerk, heel fijn
    const a = A_OFF + (k + 0.5) * (TAU / 288);
    s += `<path d="${straalLijn(R_VOET + 1, R_KROON - 1, a)}" stroke="${G_SCHAD}" stroke-width="0.5" opacity="${k % 2 ? 0.045 : 0.075}"/>`;
  }
  for (const rr of [R_VOET + 17, R_VOET + 34, R_VOET + 50])
    s += `<circle cx="${C}" cy="${C}" r="${rr}" fill="none" stroke="${G_SCHAD}" stroke-width="0.55" opacity="0.07"/>`;

  const hw = HW, rVoet = R_VOET + 2, rAanzet = R_AANZ, rTop = R_BOOG;

  for (let k = 0; k < TRAVEE; k++) {
    const am = A_OFF + (k + 0.5) * STAP_T, L = licht(am);
    const scha = (1 - L) / 2, dk = 0.48 + 0.30 * scha;
    const links = Math.sin(A_LICHT - am) > 0;      // welke dagkant vangt licht
    let g = '';
    const vorm = `M${C - hw} ${Y(rVoet)}V${Y(rAanzet)}a${hw} ${hw} 0 0 1 ${hw * 2} 0V${Y(rVoet)}`;

    // de nis: diep, met een bodem die wat licht terugkaatst
    g += `<path d="${vorm}Z" fill="url(#nis)" opacity="${r2(0.92 + 0.08 * scha)}"/>`;
    g += `<g clip-path="url(#knip)">`;
    for (let j = 0; j < 22; j++) {
      g += `<path d="M${C - hw} ${Y(rVoet + 1.5 + j * 2.6)}h${hw * 2}" stroke="${G_INKT}" stroke-width="0.9" opacity="${r2(0.04 + 0.022 * j)}"/>`;
    }
    g += `<path d="M${C + (links ? 1 : -1) * (hw - 2.5)} ${Y(rVoet)}V${Y(rAanzet + 5)}" stroke="${CREME}" stroke-width="2.8" opacity="${r2(0.12 + 0.1 * (1 - scha))}"/>`;
    // vloer van de nis vangt licht: dat breekt de vorm van een pil
    g += `<path d="M${C - hw} ${Y(rVoet + 5)}h${hw * 2}v${5} h${-hw * 2}z" fill="${CREME}" opacity="${r2(0.16 + 0.1 * (1 - scha))}"/>`;
    // ---- het beeldmerk in het klein, verlicht in de diepte van de nis
    const gw = hw - 8.5, gv = rVoet + 5, ga = rAanzet - 6;
    const gl = r2(0.62 + 0.22 * (1 - scha));
    g += `<path d="M${C - gw} ${Y(gv)}V${Y(ga)}a${gw} ${gw} 0 0 1 ${gw * 2} 0V${Y(gv)}" fill="none" stroke="${CREME}" stroke-width="1.5" opacity="${gl}"/>`;
    g += `<path d="M${r2(C - gw + 3.2)} ${Y(gv)}V${Y(ga + 0.6)}a${r2(gw - 3.2)} ${r2(gw - 3.2)} 0 0 1 ${r2((gw - 3.2) * 2)} 0V${Y(gv)}" fill="none" stroke="${CREME}" stroke-width="0.75" opacity="${r2(gl * 0.62)}"/>`;
    g += `<path d="M${r2(C - gw - 3)} ${Y(gv)}h${r2((gw + 3) * 2)}" stroke="${CREME}" stroke-width="1.4" opacity="${gl}"/>`;
    g += `<path d="M${C} ${Y(ga + gw + 1.6)}l2.1 3.2-2.1 3.2-2.1-3.2z" fill="${CREME}" opacity="${r2(gl * 0.9)}"/>`;
    // geribd boogveld boven het poortje: het gewelf van de nis zelf
    for (let j = 1; j <= 5; j++) {
      const w = hw - 2 - j * 2.6;
      if (w < 3) break;
      g += `<path d="M${r2(C - w)} ${Y(rAanzet - 4)}a${r2(w)} ${r2(w)} 0 0 1 ${r2(w * 2)} 0" ` +
        `fill="none" stroke="${CREME}" stroke-width="0.7" opacity="${r2(0.1 + 0.05 * (5 - j))}"/>`;
    }
    g += `</g>`;
    // archivolt: drie lijsten om de boog, de middelste licht
    g += `<path d="M${C - hw - 7} ${Y(rVoet)}V${Y(rAanzet)}a${hw + 7} ${hw + 7} 0 0 1 ${(hw + 7) * 2} 0V${Y(rVoet)}" ` +
      `fill="none" stroke="${G_DIEP}" stroke-width="1.0" opacity="${r2(dk * 0.54)}"/>`;
    g += `<path d="M${C - hw - 3.4} ${Y(rVoet)}V${Y(rAanzet)}a${hw + 3.4} ${hw + 3.4} 0 0 1 ${(hw + 3.4) * 2} 0V${Y(rVoet)}" ` +
      `fill="none" stroke="${CREME}" stroke-width="1.3" opacity="${r2(0.34 + 0.24 * (1 - scha))}"/>`;
    g += `<path d="M${C - hw - 5.4} ${Y(rVoet)}V${Y(rAanzet)}a${hw + 5.4} ${hw + 5.4} 0 0 1 ${(hw + 5.4) * 2} 0V${Y(rVoet)}" ` +
      `fill="none" stroke="${G_SCHAD}" stroke-width="0.85" opacity="${r2(dk * 0.5)}"/>`;
    g += `<path d="${vorm}" fill="none" stroke="${G_INKT}" stroke-width="1.2" opacity="${r2(dk * 0.85)}"/>`;
    // imposten waar de boog aanzet
    for (const zij of [-1, 1]) {
      g += `<path d="M${C + zij * (hw - 3)} ${Y(rAanzet)}h${zij * 10}" stroke="${G_SCHAD}" stroke-width="2.4" opacity="${r2(dk * 0.78)}"/>`;
      g += `<path d="M${C + zij * (hw - 3)} ${Y(rAanzet + 2.4)}h${zij * 10}" stroke="${CREME}" stroke-width="1.1" opacity="0.42"/>`;
    }
    // sluitsteen op de kruin
    g += `<path d="M${C} ${Y(rTop + 3.6)}l4.6 7.2-4.6 7.2-4.6-7.2z" fill="${G_INKT}" opacity="${r2(dk * 0.95)}"/>`;
    g += `<path d="M${C} ${Y(rTop + 4.6)}l2.1 3.4-2.1 3.4-2.1-3.4z" fill="${CREME}" opacity="0.4"/>`;
    // drempel
    g += `<path d="M${C - hw - 9} ${Y(rVoet - 1.6)}h${(hw + 9) * 2}" stroke="${G_INKT}" stroke-width="2.2" opacity="${r2(dk * 0.9)}" stroke-linecap="round"/>`;
    g += `<path d="M${C - hw - 9} ${Y(rVoet + 1)}h${(hw + 9) * 2}" stroke="${CREME}" stroke-width="1.2" opacity="0.46"/>`;

    s += `<g transform="rotate(${r2(am / RAD + 90)} ${C} ${C})">${g}</g>`;
  }

  // astragaal boven de arcade: de overgang naar de kroonlijst
  s += `<circle cx="${C}" cy="${C}" r="466" fill="none" stroke="${G_SCHAD}" stroke-width="1.0" opacity="0.30"/>`;
  s += `<circle cx="${C}" cy="${C}" r="463.8" fill="none" stroke="${CREME}" stroke-width="1.4" opacity="0.46"/>`;
  for (let k = 0; k < 192; k++) {
    const a = A_OFF + (k + 0.5) * (TAU / 192);
    const [px, py] = P(468.4, a);
    if (k % 4 === 0) s += `<circle cx="${px}" cy="${py}" r="1.7" fill="${G_SCHAD}" opacity="0.38"/>`;
    else s += blokje(466.8, 470, a, 0.65, 0.65, G_SCHAD, 0.24);
  }

  // pijlers: een blinde boog, dicht en licht. Groot-donker, klein-licht, om
  // en om - dat geeft achtenveertig tellen in plaats van vierentwintig.
  for (let k = 0; k < TRAVEE; k++) {
    const ap = A_OFF + k * STAP_T, L = licht(ap), scha = (1 - L) / 2;
    const dp = 0.36 + 0.24 * scha, links = Math.sin(A_LICHT - ap) > 0;
    const bw = 10.5, bv = R_VOET + 4, ba = 434, bt = ba + bw;
    let g = '';
    const vorm = `M${C - bw} ${Y(bv)}V${Y(ba)}a${bw} ${bw} 0 0 1 ${bw * 2} 0V${Y(bv)}`;
    // dichtgemetselde nis: ondiep, dus licht met een zweem schaduw
    g += `<path d="${vorm}Z" fill="${CREME}" opacity="${r2(0.3 - 0.16 * scha)}"/>`;
    g += `<path d="${vorm}Z" fill="${G_WARM}" opacity="${r2(0.06 + 0.14 * scha)}"/>`;
    g += `<path d="M${C + (links ? -1 : 1) * bw} ${Y(bv)}V${Y(ba)}a${bw} ${bw} 0 0 ${links ? 1 : 0} ${(links ? 1 : -1) * bw * 2} 0" ` +
      `fill="none" stroke="${G_SCHAD}" stroke-width="2.4" opacity="${r2(dp * 0.5)}"/>`;
    g += `<path d="${vorm}" fill="none" stroke="${G_SCHAD}" stroke-width="1.15" opacity="${r2(dp * 0.95)}"/>`;
    const iw = bw - 3.4;
    g += `<path d="M${r2(C - iw)} ${Y(bv + 2)}V${Y(ba + 1)}a${r2(iw)} ${r2(iw)} 0 0 1 ${r2(iw * 2)} 0V${Y(bv + 2)}" ` +
      `fill="none" stroke="${CREME}" stroke-width="0.9" opacity="0.5"/>`;
    // sluitsteen: de ruit uit het beeldmerk
    g += `<path d="M${C} ${Y(bt + 5.5)}l3.4 5.5-3.4 5.5-3.4-5.5z" fill="${G_DIEP}" opacity="${r2(0.34 + 0.2 * scha)}"/>`;
    g += `<path d="M${C} ${Y(bt + 4.6)}l1.6 2.4-1.6 2.4-1.6-2.4z" fill="${CREME}" opacity="0.46"/>`;
    // basis en kroonlijstje van het paneel
    for (const rr of [bv - 2.5, R_AANZ + 6]) {
      g += `<path d="M${C - bw - 4} ${Y(rr)}h${(bw + 4) * 2}" stroke="${G_SCHAD}" stroke-width="3.2" opacity="${r2(dp * 0.72)}"/>`;
      g += `<path d="M${C - bw - 4} ${Y(rr + 2.2)}h${(bw + 4) * 2}" stroke="${CREME}" stroke-width="1.2" opacity="0.5"/>`;
    }
    // smalle lisenen aan weerszijden, waar de rib van de koepel landt
    for (const o of [-17.5, 17.5]) {
      g += `<path d="M${C + o} ${Y(bv - 2)}V${Y(R_AANZ + 6)}" stroke="${G_SCHAD}" stroke-width="1.1" opacity="${r2(dp * 0.55)}"/>`;
      g += `<path d="M${r2(C + o + (links ? -1.4 : 1.4))} ${Y(bv - 2)}V${Y(R_AANZ + 6)}" stroke="${CREME}" stroke-width="1.0" opacity="0.42"/>`;
    }
    s += `<g transform="rotate(${r2(ap / RAD + 90)} ${C} ${C})">${g}</g>`;
  }
  return s;
}

// ---------------------------------------------------------------- 7. kroonlijst
// Bewust LICHT: de donkere arcade moet in een lichte rand liggen, anders
// happen de nissen de cirkel stuk. Het guilloche is graveurswerk uit de
// bankbiljettenhoek - fijn, precies, en het past bij een bureau dat techniek
// verkoopt. Helemaal buiten een diepe filet, zodat de rand scherp blijft.
function kroonlijst() {
  let s = '';
  s += `<path d="${ringPad(R_KROON, R_RAND)}" fill="url(#kroon)" fill-rule="evenodd"/>`;
  // 1. schaduwfilet onder de lijst
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_KROON - 0.5)}" fill="none" stroke="${G_INKT}" stroke-width="3.2" opacity="0.44"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_KROON + 2.6)}" fill="none" stroke="${CREME}" stroke-width="2.4" opacity="0.62"/>`;
  // 2. modillons: consoles die de lijst dragen, elk met eigen schaduw
  for (let k = 0; k < 48; k++) {
    const a = A_OFF + (k + 0.5) * (TAU / 48), L = licht(a), scha = (1 - L) / 2;
    s += blokje(R_KROON + 4.5, R_KROON + 11, a, 2.8, 3.2, G_SCHAD, 0.26 + 0.2 * scha);
    s += blokje(R_KROON + 4.5, R_KROON + 11, a - 0.005, 0.75, 0.85, CREME, 0.34 + 0.2 * klem(L, 0, 1));
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_KROON + 12)}" fill="none" stroke="${G_DIEP}" stroke-width="1.2" opacity="0.34"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_KROON + 13.8)}" fill="none" stroke="${CREME}" stroke-width="1.8" opacity="0.58"/>`;
  // 3. guilloche: twee gevlochten golven met knopen op de kruisingen
  const rM = 492, amp = 5.2, n = 60, stapjes = n * 12;
  for (const [teken, kleur, dek] of [[1, G_DIEP, 0.66], [-1, G_SCHAD, 0.58]]) {
    let d = '';
    for (let i = 0; i <= stapjes; i++) {
      const a = A_OFF + (i / stapjes) * TAU;
      const [px, py] = P(rM + teken * amp * Math.sin(n * (a - A_OFF)), a);
      d += (i ? 'L' : 'M') + px + ' ' + py;
    }
    s += `<path d="${d}" fill="none" stroke="${kleur}" stroke-width="1.45" opacity="${dek}"/>`;
  }
  for (let k = 0; k < n; k++) {
    const a = A_OFF + (k + 0.25) * (TAU / n);
    const [px, py] = P(rM, a);
    s += `<circle cx="${px}" cy="${py}" r="2.6" fill="none" stroke="${G_SCHAD}" stroke-width="0.9" opacity="0.46"/>`;
    s += `<circle cx="${px}" cy="${py}" r="1.2" fill="${CREME}" opacity="0.62"/>`;
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(rM - 8.5)}" fill="none" stroke="${G_SCHAD}" stroke-width="0.9" opacity="0.34"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(rM + 8.5)}" fill="none" stroke="${G_SCHAD}" stroke-width="0.9" opacity="0.34"/>`;
  // 4. parel-en-rolletje als bovenste lid
  const nP = 168;
  for (let k = 0; k < nP; k++) {
    const a = A_OFF + k * (TAU / nP), L = licht(a);
    const [px, py] = P(504, a);
    if (k % 3 === 0) {
      s += `<circle cx="${px}" cy="${py}" r="2.5" fill="${G_SCHAD}" opacity="0.42"/>`;
      s += `<circle cx="${r2(px - 0.6)}" cy="${r2(py - 0.7)}" r="1.1" fill="${CREME}" opacity="${r2(0.34 + 0.24 * klem(L, 0, 1))}"/>`;
    } else s += blokje(501.6, 506.4, a, 0.8, 0.8, G_SCHAD, 0.3);
  }
  // 5. buitenste leden: lichte filet en een diepe die de rand scherp zet
  s += `<circle cx="${C}" cy="${C}" r="499" fill="none" stroke="${CREME}" stroke-width="1.5" opacity="0.5"/>`;
  s += `<circle cx="${C}" cy="${C}" r="509" fill="none" stroke="${CREME}" stroke-width="2.2" opacity="0.58"/>`;
  s += `<circle cx="${C}" cy="${C}" r="511.6" fill="none" stroke="${G_INKT}" stroke-width="3.4" opacity="0.46"/>`;
  return s;
}

// ---------------------------------------------------------------- 8. verguldwerk
function verguld() {
  let s = '<g>';
  s += `<g transform="rotate(11 ${C} ${C})">`;
  for (let i = -8; i <= 8; i++) {
    const o = i * 86 + 14;
    s += `<path d="M${C - 640} ${C + o}h1280" stroke="${CREME}" stroke-width="1.0" opacity="0.05"/>`;
    s += `<path d="M${C - 640} ${C + o + 1.7}h1280" stroke="${G_SCHAD}" stroke-width="0.8" opacity="0.036"/>`;
    s += `<path d="M${C + o} ${C - 640}v1280" stroke="${CREME}" stroke-width="1.0" opacity="0.042"/>`;
    s += `<path d="M${C + o + 1.7} ${C - 640}v1280" stroke="${G_SCHAD}" stroke-width="0.8" opacity="0.032"/>`;
  }
  s += `</g>`;
  for (let i = 0; i < 260; i++) {
    const a = rnd() * TAU, r = 300 + rnd() * 214;
    const [px, py] = P(r, a);
    let d = `M${px} ${py}`, cx = px, cy = py, ar = rnd() * TAU;
    for (let j = 0; j < 2 + ((rnd() * 2) | 0); j++) {
      ar += (rnd() - 0.5) * 1.6;
      const l = 3 + rnd() * 7;
      cx += Math.cos(ar) * l; cy += Math.sin(ar) * l;
      d += `L${r2(cx)} ${r2(cy)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${G_SCHAD}" stroke-width="0.6" opacity="${r2(0.04 + rnd() * 0.06)}"/>`;
  }
  for (let i = 0; i < 80; i++) {
    const a = A_LICHT + (rnd() - 0.5) * 2.5;
    const r0 = 300 + rnd() * 150, l = 24 + rnd() * 90;
    const [ax, ay] = P(r0, a), [bx, by] = P(Math.min(510, r0 + l), a);
    s += `<path d="M${ax} ${ay}L${bx} ${by}" stroke="${CREME}" stroke-width="${r2(0.8 + rnd() * 1.6)}" opacity="${r2(0.035 + rnd() * 0.055)}"/>`;
  }
  for (let i = 0; i < 150; i++) {
    const a = A_LICHT + (rnd() - 0.5) * 2.1, r = 300 + rnd() * 212;
    const [px, py] = P(r, a);
    s += `<circle cx="${px}" cy="${py}" r="${r2(0.5 + rnd() * 0.9)}" fill="${CREME}" opacity="${r2(0.2 + rnd() * 0.35)}"/>`;
  }
  return s + '</g>';
}

// ---------------------------------------------------------------- 9. hart
function watermerk() {
  let s = '<g>';
  for (let r = 66; r < 286; r += 8.5)
    s += `<circle cx="${C}" cy="${C}" r="${r2(r)}" fill="none" stroke="${G_LICHT}" stroke-width="0.6" opacity="0.02"/>`;
  return s + '</g>';
}

// ---------------------------------------------------------------- opbouw
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<defs>
  <radialGradient id="ch" cx="46%" cy="36%" r="80%">
    <stop offset="0%" stop-color="#FDF7E9"/><stop offset="52%" stop-color="#F3E6C9"/>
    <stop offset="100%" stop-color="#DCC495"/></radialGradient>
  <radialGradient id="gewelf" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_PLINT}">
    <stop offset="0%" stop-color="#8A6B2E" stop-opacity="0"/>
    <stop offset="62%" stop-color="#8A6B2E" stop-opacity="0.05"/>
    <stop offset="88%" stop-color="#7A5E28" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#5E4820" stop-opacity="0.26"/></radialGradient>
  <radialGradient id="architraaf" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_VOET}">
    <stop offset="${r2(R_PLINT / R_VOET * 100)}%" stop-color="#584219" stop-opacity="0.64"/>
    <stop offset="100%" stop-color="#5E4820" stop-opacity="0.36"/></radialGradient>
  <radialGradient id="kroon" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_RAND}">
    <stop offset="${r2(R_KROON / R_RAND * 100)}%" stop-color="#FFFBF0" stop-opacity="0.30"/>
    <stop offset="80%" stop-color="#FFFBF0" stop-opacity="0.34"/>
    <stop offset="100%" stop-color="#C09A55" stop-opacity="0.20"/></radialGradient>
  <linearGradient id="nis" gradientUnits="userSpaceOnUse" x1="0" y1="${Y(R_BOOG)}" x2="0" y2="${Y(R_VOET)}">
    <stop offset="0%" stop-color="#43330D" stop-opacity="0.90"/>
    <stop offset="55%" stop-color="#5E4820" stop-opacity="0.82"/>
    <stop offset="100%" stop-color="#8A6B2E" stop-opacity="0.56"/></linearGradient>
  <clipPath id="knip"><path d="M${r2(C - HW)} ${Y(R_VOET + 2)}V${Y(R_AANZ)}a${HW} ${HW} 0 0 1 ${HW * 2} 0V${Y(R_VOET + 2)}Z"/></clipPath>
  <radialGradient id="ringfade" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_RAND + 3}">
    <stop offset="0%" stop-color="#000000"/>
    <stop offset="54%" stop-color="#000000"/>
    <stop offset="64%" stop-color="#FFFFFF"/>
    <stop offset="97%" stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#777777"/></radialGradient>
  <mask id="ringm"><rect width="${W}" height="${W}" fill="#000"/>
    <circle cx="${C}" cy="${C}" r="${R_RAND + 3}" fill="url(#ringfade)"/></mask>
  <mask id="buitenm"><rect width="${W}" height="${W}" fill="#FFF"/>
    <circle cx="${C}" cy="${C}" r="${R_RAND + 4}" fill="#000"/>
    <circle cx="${C}" cy="${C}" r="${R_RAND + 16}" fill="none" stroke="#777" stroke-width="24"/></mask>
  <linearGradient id="model" x1="12%" y1="3%" x2="88%" y2="97%">
    <stop offset="0%" stop-color="#FFFBF0" stop-opacity="0.30"/>
    <stop offset="32%" stop-color="#FFFBF0" stop-opacity="0.05"/>
    <stop offset="56%" stop-color="#6B5323" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#4A390F" stop-opacity="0.47"/></linearGradient>
  <linearGradient id="strijk" x1="8%" y1="2%" x2="92%" y2="98%">
    <stop offset="0%" stop-color="#FFFBF0" stop-opacity="0.18"/>
    <stop offset="44%" stop-color="#FFFBF0" stop-opacity="0.02"/>
    <stop offset="100%" stop-color="#7A5E28" stop-opacity="0.18"/></linearGradient>
  <radialGradient id="wand" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_KROON}">
    <stop offset="${r2(R_VOET / R_KROON * 100)}%" stop-color="#FFF6E2" stop-opacity="0.52"/>
    <stop offset="62%" stop-color="#FFF6E2" stop-opacity="0.46"/>
    <stop offset="90%" stop-color="#D8C094" stop-opacity="0.34"/>
    <stop offset="100%" stop-color="#9C8048" stop-opacity="0.40"/></radialGradient>
  <radialGradient id="glans" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="${R_RAND}">
    <stop offset="55%" stop-color="#C09A55" stop-opacity="0.05"/>
    <stop offset="78%" stop-color="#B78F48" stop-opacity="0.13"/>
    <stop offset="100%" stop-color="#C09A55" stop-opacity="0.09"/></radialGradient>
  <radialGradient id="oog" gradientUnits="userSpaceOnUse" cx="${r2(C - 14)}" cy="${r2(C - 18)}" r="${R_OOG}">
    <stop offset="0%" stop-color="#FFFBF0" stop-opacity="0"/>
    <stop offset="72%" stop-color="#FFFBF0" stop-opacity="0.16"/>
    <stop offset="92%" stop-color="#FFFBF0" stop-opacity="0.34"/>
    <stop offset="100%" stop-color="#FFFBF0" stop-opacity="0"/></radialGradient>
  <radialGradient id="hart" cx="47.5%" cy="45%" r="30%">
    <stop offset="0%" stop-color="#FFFBF0" stop-opacity="0.88"/>
    <stop offset="62%" stop-color="#FFFBF0" stop-opacity="0.40"/>
    <stop offset="100%" stop-color="#FFFBF0" stop-opacity="0"/></radialGradient>
  <linearGradient id="brons" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="112">
    <stop offset="0%" stop-color="#9C7B33"/><stop offset="40%" stop-color="#7E6229"/>
    <stop offset="100%" stop-color="#52401A"/></linearGradient>
</defs>
<rect width="${W}" height="${W}" fill="url(#ch)"/>
${papierLijnen()}
${buitenveld()}
<circle cx="${C}" cy="${C}" r="556" fill="none" stroke="${G_DIEP}" stroke-width="0.9" opacity="0.18"/>
<circle cx="${C}" cy="${C}" r="592" fill="none" stroke="${G_DIEP}" stroke-width="0.6" opacity="0.10"/>
${koepel()}
${ribben()}
${ringlijsten()}
<circle cx="${C}" cy="${C}" r="${R_OOG}" fill="url(#oog)"/>
${oculus()}
${tamboer()}
${kroonlijst()}
<g mask="url(#ringm)"><rect width="${W}" height="${W}" fill="url(#model)"/></g>
<g mask="url(#ringm)"><rect width="${W}" height="${W}" fill="url(#glans)"/></g>
<g mask="url(#ringm)">${verguld()}</g>
<circle cx="${C}" cy="${C}" r="${R_RAND}" fill="url(#strijk)"/>
${korrel(1400, 770, 1)}
<rect width="${W}" height="${W}" fill="url(#hart)"/>
${watermerk()}
${korrel(560, 300, 0.85)}
<g opacity="0.34">${['-1.8 0', '1.8 0', '0 -1.8', '0 1.8', '-1.3 -1.3', '1.3 1.3', '-1.3 1.3', '1.3 -1.3'].map(t => `<g transform="translate(${t})">${M.poort('#4A3814', x, y, SCH)}</g>`).join('')}</g>
<g opacity="0.50"><g transform="translate(0,3)">${M.poort('#FFFFFF', x, y, SCH)}</g></g>
${M.poort('url(#brons)', x, y, SCH)}
<circle cx="540" cy="540" r="514" fill="none" stroke="#A07F3C" stroke-width="2.8" opacity="0.42"/>
</svg>`;

const buf = new Resvg(svg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: 1080 } }).render().asPng();
fs.writeFileSync(path.join(UIT, 'profiel-entree.png'), buf);
console.log('profiel-entree.png'.padEnd(30), W + 'x' + W, (buf.length / 1024).toFixed(0) + ' kB');

// -------------------------------------------------- controlestrook
(async () => {
  const maat = async n => sharp(buf).resize(n, n, { kernel: 'lanczos3' }).png().toBuffer();
  const k56 = await maat(56), k96 = await maat(96), k150 = await maat(150);
  const groot = await sharp(k56).resize(224, 224, { kernel: 'nearest' }).png().toBuffer();
  await sharp({ create: { width: 700, height: 250, channels: 3, background: '#2b2b2b' } })
    .composite([
      { input: k56, top: 97, left: 22 },
      { input: k96, top: 77, left: 100 },
      { input: k150, top: 50, left: 218 },
      { input: groot, top: 13, left: 396 },
    ]).png().toFile(path.join(UIT, 'profiel-entree-controle.png'));
  await sharp(buf).extract({ left: 110, top: 110, width: 440, height: 440 }).png().toFile(path.join(UIT, 'profiel-entree-detail.png'));
  await sharp(buf).resize(300, 300).jpeg({ quality: 82 }).toFile(path.join(WEB, 'profiel-entree.jpg'));
  console.log('controlestrook, detail en web-voorbeeld klaar');
})();
