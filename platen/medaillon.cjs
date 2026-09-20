// YG Digital - HET MEDAILLON. Was tot 20 sep 2026 de profielfoto; die is nu de
// poort zelf (zie profielfoto.cjs). Dit blijft staan omdat de medaillonstijl de
// basis is voor de website-klus die nog openstaat: de arcade van boognissen, het
// gewelf, het verguldwerk en de albastwerking zijn hier uitgewerkt en getoetst.
// Niet weggooien zonder die klus af te ronden.
//
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
// Draaien:  node platen/medaillon.cjs
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

// HANDWERK. Een geslagen penning komt uit een mal die met de hand is gesneden:
// geen twee nissen zijn precies gelijk, geen parel zit exact op zijn plek. Deze
// reeks staat los van de bovenstaande, zodat handwerk toevoegen de rest van het
// ontwerp niet verschuift. De afwijkingen zijn klein genoeg om niet als fout te
// lezen en groot genoeg om het machinale eraf te halen - en dat laatste is
// precies waar het oog "gemaakt door iemand" aan herkent. Niet weghalen.
let hzaad = 7777;
const hrnd = () => (hzaad = (hzaad * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const w = () => hrnd() - 0.5;          // -0,5 tot 0,5

// STEEN. Een derde reeks, voor de nerf van het albast. Los van de twee andere,
// zodat het toevoegen van aders de korrel en het verguldwerk niet verschuift.
// De albastlagen staan vast aan. De schakelaar die hier stond was om te kunnen
// toetsen of de lagen de plaat niet stiekem donkerder maakten; die toets is
// gedaan (helderheid 215 tegen 214 zonder) en hoeft niet in productie te staan.
const ALBAST = true;
const NAAM = 'medaillon';

let nzaad = 5150419;
const nrnd = () => (nzaad = (nzaad * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

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
const LETTER_LIJN = 0.85;   // omlijning van YG: Playfair heeft geen vet, en dit is de naam
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
    const a = A_OFF + (k + 0.5) * (TAU / 144) + w() * 0.0055;
    const [px, py] = P(R_PLINT + 9 + w() * 1.3, a);
    const groot = k % 6 === 0;
    s += `<circle cx="${px}" cy="${py}" r="${r2((groot ? 1.5 : 1.0) + w() * 0.34)}" fill="${CREME}" opacity="${r2((groot ? 0.34 : 0.22) + w() * 0.07)}"/>`;
  }
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_VOET - 2.4)}" fill="none" stroke="${CREME}" stroke-width="1.7" opacity="0.52"/>`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_VOET + 0.6)}" fill="none" stroke="${G_INKT}" stroke-width="2.6" opacity="0.46"/>`;
  // de wand van de tamboer: licht pleisterwerk waar de nissen in zitten
  s += `<path d="${ringPad(R_VOET, R_KROON)}" fill="url(#wand)" fill-rule="evenodd"/>`;
  for (let k = 0; k < 288; k++) {          // voegen van het steenwerk, heel fijn
    const a = A_OFF + (k + 0.5) * (TAU / 288) + w() * 0.004;
    s += `<path d="${straalLijn(R_VOET + 1 + w() * 1.2, R_KROON - 1 + w() * 1.2, a)}" stroke="${G_SCHAD}" stroke-width="${r2(0.5 + w() * 0.2)}" opacity="${r2((k % 2 ? 0.045 : 0.075) + w() * 0.03)}"/>`;
  }
  for (const rr of [R_VOET + 17, R_VOET + 34, R_VOET + 50])
    s += `<circle cx="${C}" cy="${C}" r="${rr}" fill="none" stroke="${G_SCHAD}" stroke-width="0.55" opacity="0.07"/>`;

  const rTop = R_BOOG;

  for (let k = 0; k < TRAVEE; k++) {
    const am = A_OFF + (k + 0.5) * STAP_T + w() * STAP_T * 0.055;   // niet exact op de steek
    const hw = r2(HW + w() * 1.7);                                  // niet exact even breed
    const rVoet = r2(R_VOET + 2 + w() * 1.9);
    const rAanzet = r2(R_AANZ + w() * 2.8);
    const L = licht(am);
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

// ================================================================ ALBAST
// Tot hier is dit een ondoorzichtig voorwerp: al het licht komt van buiten, van
// linksboven, en stuitert terug. Wat volgt zet er een lamp ACHTER. Dun albast
// doet dan drie dingen tegelijk, en alle drie staan hieronder:
//
//   1. DIKTE BESLIST. Waar de steen dun is komt het licht er diffuus doorheen;
//      waar hij dik is blijft hij dicht. Niet de vorm bepaalt de gloed maar de
//      wanddikte - daarom eerst een dikteMasker(), en pas daarna licht.
//   2. DE NERF WORDT PAS ZICHTBAAR IN HET LICHT. Op een ondoorzichtige steen
//      zie je de aders overal even goed; bij doorvallend licht alleen daar waar
//      het licht erdoorheen komt. Dus: nerf x dikte x lamp.
//   3. DE RAND LEKT. Aan een dunne rand loopt het licht dwars door de steen en
//      even verder - daarom gloeit de buitenrand naar buiten toe uit.
//
// Alles blijft onder de modellering (model/glans/verguld) hangen, zodat de
// gloed IN het materiaal zit en er niet overheen ligt, en alles staat onder het
// embleem, dat ongemoeid blijft - het merkteken is de harde grens.

// ---------------------------------------------------------------- A. dikte
// De wanddikte van het medaillon in grijswaarden: wit = dun, zwart = dik.
//   dun - het vlakke hart binnen de oculus, de bodems van de cassetten, de
//         wand van de tamboer tussen de nissen, de uiterste rand van de lijst
//   dik - de kroonlijst, de architraaf, de ribben, de ringlijsten, de nissen
// Het waas is geen luxe: een dikteovergang in steen is nooit een harde lijn.
function dikteMasker() {
  let s = `<g filter="url(#waasdun)">`;
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_OOG - 24)}" fill="#C6C6C6"/>`;
  s += `<path d="${ringPad(R_OOG + 9, R_PLINT - 10)}" fill="#7A7A7A" fill-rule="evenodd"/>`;
  s += `<path d="${ringPad(R_VOET + 8, R_KROON - 8)}" fill="#B2B2B2" fill-rule="evenodd"/>`;
  s += `<path d="${ringPad(R_RAND - 13, R_RAND + 2)}" fill="#ACACAC" fill-rule="evenodd"/>`;
  s += `</g>`;

  s += `<g filter="url(#waasdik)" fill="#000000">`;
  // ribben: massief gewelfwerk dat het licht tegenhoudt
  const br = r => 2.4 + 5.2 * Math.pow(klem((r - R_OOG) / (R_PLINT - R_OOG), 0, 1), 0.85);
  for (let k = 0; k < VAKKEN; k++) {
    const a = A_OFF + k * STAP, pijler = k % 2 === 0;
    const t = (rr, dt) => {
      const [px, py] = P(rr, a);
      return `${r2(px - Math.sin(a) * dt)} ${r2(py + Math.cos(a) * dt)}`;
    };
    const w0 = br(R_OOG) / 2 * (pijler ? 1.18 : 0.86) + 2.4;
    const w1 = br(R_PLINT) / 2 * (pijler ? 1.18 : 0.86) + 2.4;
    s += `<path d="M${t(R_OOG, -w0)}L${t(R_PLINT, -w1)}L${t(R_PLINT, w1)}L${t(R_OOG, w0)}Z"/>`;
  }
  // de ringlijsten zijn opstaande banden: ook daar zit meer steen
  for (let i = 0; i <= RIJEN; i++)
    s += `<circle cx="${C}" cy="${C}" r="${RING[i]}" fill="none" stroke="#000000" stroke-width="5.4"/>`;
  // de nissen: de dichtste plekken van de tamboer, en dat moeten ze blijven -
  // hierop rust het ritme van vierentwintig dat op 56 px nog telbaar is
  for (let k = 0; k < TRAVEE; k++) {
    const am = A_OFF + (k + 0.5) * STAP_T, hw = HW + 7;
    s += `<g transform="rotate(${r2(am / RAD + 90)} ${C} ${C})">` +
      `<path d="M${C - hw} ${Y(R_VOET - 3)}V${Y(R_AANZ + 2)}a${hw} ${hw} 0 0 1 ${hw * 2} 0V${Y(R_VOET - 3)}Z"/></g>`;
  }
  s += `</g>`;
  // de dichtgemetselde pijlerpanelen laten nog een zweem door: half zo dik
  s += `<g filter="url(#waasdik)" fill="#4A4A4A">`;
  for (let k = 0; k < TRAVEE; k++) {
    const ap = A_OFF + k * STAP_T, bw = 16;
    s += `<g transform="rotate(${r2(ap / RAD + 90)} ${C} ${C})">` +
      `<path d="M${C - bw} ${Y(R_VOET)}V${Y(437)}a${bw} ${bw} 0 0 1 ${bw * 2} 0V${Y(R_VOET)}Z"/></g>`;
  }
  s += `</g>`;
  return s;
}

// ---------------------------------------------------------------- B. de nerf
// De aders van de steen. Ze lopen allemaal met dezelfde drift mee, want in een
// blok albast liggen de lagen evenwijdig, en die drift volgt de diagonaal van
// de modellering - nerf en licht werken dezelfde kant op. Een ader is DICHTER
// materiaal: hij houdt licht tegen en tekent zich donker af in het oplichtende
// veld. Een paar melkbanen doen precies het omgekeerde.
const A_NERF = 51 * RAD;
function baan(o, kleur, br, dek, golf, dh) {
  const A = A_NERF + (dh || 0);
  const dx = Math.cos(A), dy = Math.sin(A), nx = -dy, ny = dx;
  const cx0 = C + nx * o, cy0 = C + ny * o;
  const L = 1800, N = 24;
  const pt = [];
  let fase = nrnd() * TAU, freq = 0.45 + nrnd() * 1.0, drift = 0;
  for (let i = 0; i <= N; i++) {
    const t = -L / 2 + (L * i) / N;
    drift += (nrnd() - 0.5) * golf * 0.3;
    const q = Math.sin(fase + (t / L) * TAU * freq) * golf * 0.5 + drift;
    pt.push([r2(cx0 + dx * t + nx * q), r2(cy0 + dy * t + ny * q)]);
  }
  // door de middelpunten heen krommen: geen geknikte polylijn maar een vloeiende ader
  let d = `M${pt[0][0]} ${pt[0][1]}`;
  for (let i = 1; i < pt.length - 1; i++)
    d += `Q${pt[i][0]} ${pt[i][1]} ${r2((pt[i][0] + pt[i + 1][0]) / 2)} ${r2((pt[i][1] + pt[i + 1][1]) / 2)}`;
  d += `L${pt[pt.length - 1][0]} ${pt[pt.length - 1][1]}`;
  return `<path d="${d}" fill="none" stroke="${kleur}" stroke-width="${r2(br)}" ` +
    `opacity="${r2(dek)}" stroke-linecap="round"/>`;
}
function nerf() {
  let s = '<g filter="url(#waasbreed)">';
  for (let i = 0; i < 7; i++) {                    // de gelaagdheid van het blok
    const o = (i - 3) * 138 + (nrnd() - 0.5) * 70, melk = i % 2 === 0;
    s += baan(o, melk ? '#FFF6E2' : '#93733A', melk ? 80 : 60, melk ? 0.26 : 0.26, 190, (nrnd() - 0.5) * 0.14);
  }
  s += '</g><g filter="url(#waasnerf)">';
  for (let i = 0; i < 30; i++) {                   // de aders zelf
    const o = (nrnd() - 0.5) * 1560, melk = nrnd() < 0.3;
    const kl = melk ? '#FFF8E8' : (nrnd() < 0.5 ? '#8A6B2E' : '#6E5524');
    s += baan(o, kl, 2.2 + nrnd() * 6.2, (melk ? 0.46 : 0.54) + nrnd() * 0.26, 72 + nrnd() * 86, (nrnd() - 0.5) * 0.30);
  }
  for (let i = 0; i < 16; i++) {                   // korte zijtakken
    const o = (nrnd() - 0.5) * 1200;
    s += baan(o, nrnd() < 0.35 ? '#FFF8E8' : '#7A5E28', 1.4 + nrnd() * 2.6, 0.34 + nrnd() * 0.20, 40 + nrnd() * 44, (nrnd() - 0.5) * 0.44);
  }
  return s + '</g>';
}

// ---------------------------------------------------------------- C. tweede laag
// Wat er ACHTER de steen staat. Bij doorvallend licht verschijnt er een tweede
// tekening die je op de dichte steen niet ziet: het beeldmerk zelf, een slag
// groter, als een aureool om de poort in het hart. Alleen de omtrek - geen
// tweede YG, want twee keer dezelfde letters is een fout en geen effect. De
// oculuslijst is dik en snijdt de boog doormidden: precies daardoor leest hij
// als iets dat ACHTER de steen staat en niet erop getekend is.
function tweedeLaag() {
  const GS = 6.55, gx = r2(C - 50 * GS), gy = 122;
  const lijn = (d, sw, dek) =>
    `<path d="${d}" fill="none" stroke="#6B5322" stroke-width="${sw}" opacity="${dek}" stroke-linecap="round"/>`;
  let g = lijn('M14 104V48a36 36 0 0 1 72 0v56', 0.8, 0.62);
  g += lijn('M24 104V50a26 26 0 0 1 52 0v54', 0.38, 0.38);
  g += lijn('M4 104h92', 0.62, 0.52);
  g += `<path d="M50 5l4.5 7-4.5 7-4.5-7z" fill="#6B5322" opacity="0.56"/>`;
  // de filter zit op de BUITENSTE groep, anders wordt het waas mee opgeschaald
  return `<g filter="url(#waastweede)"><g transform="translate(${gx},${gy}) scale(${GS})">${g}</g></g>`;
}

// ---------------------------------------------------------------- D. randen
// Waar de steen dun uitloopt reist het licht er dwars doorheen en komt het aan
// de andere kant weer naar buiten. Dat gebeurt op drie plekken: buiten langs de
// kroonlijst, binnen langs de oculuslijst, en in de kruin van elke nis.
function randgloed() {
  let s = '<g filter="url(#waasrand)">';
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_RAND + 7)}" fill="none" stroke="#E7C489" stroke-width="26" opacity="0.15"/>`;
  const [hx, hy] = P(R_RAND + 14, A_LICHT);
  s += `<circle cx="${r2(hx)}" cy="${r2(hy)}" r="168" fill="#FFE2AC" opacity="0.115"/>`;
  return s + '</g>';
}
function randlek() {
  let s = '<g filter="url(#waaslek)">';
  // langs de oculuslijst kruipt het licht uit het hart naar buiten
  s += `<circle cx="${C}" cy="${C}" r="${r2(R_OOG - 15)}" fill="none" stroke="#FFF3D8" stroke-width="20" opacity="0.30"/>`;
  // de kruin van elke nis: een dunne plek waar het licht omheen lekt
  for (let k = 0; k < TRAVEE; k++) {
    const am = A_OFF + (k + 0.5) * STAP_T, hw = HW - 2;
    s += `<g transform="rotate(${r2(am / RAD + 90)} ${C} ${C})">` +
      `<path d="M${C - hw} ${Y(R_AANZ)}a${hw} ${hw} 0 0 1 ${hw * 2} 0" fill="none" ` +
      `stroke="#FFEDCB" stroke-width="5" opacity="0.34"/></g>`;
  }
  return s + '</g>';
}
// het tegendeel: waar de steen dik is blijft hij dicht. Zonder dit verschil is
// de gloed alleen maar "lichter", en niet "doorschijnend".
function dichteDelen() {
  let s = '';
  s += `<path d="${ringPad(R_KROON + 3, R_RAND - 11)}" fill="#7A5E28" opacity="0.05" fill-rule="evenodd"/>`;
  s += `<path d="${ringPad(R_PLINT + 1, R_VOET - 1)}" fill="#4A390F" opacity="0.155" fill-rule="evenodd"/>`;
  return s;
}

function albastLaag() {
  if (!ALBAST) return '';
  return '<g mask="url(#dun)">' +
    '<rect width="' + W + '" height="' + W + '" fill="url(#lamp)"/>' +
    '<rect width="' + W + '" height="' + W + '" fill="url(#verweg)"/>' +
    '<g mask="url(#nerfm)">' + nerf() + '</g>' +
    '<g mask="url(#lampm)">' + tweedeLaag() + '</g></g>' +
    '<g mask="url(#lampm)">' + randlek() + '</g>' + dichteDelen();
}

// ---------------------------------------------------------------- opbouw
// De poort was een omtrek: twee lijnen met niets ertussen en niets erachter.
// Daardoor bleef het middelpunt een tekening terwijl de ring eromheen een
// voorwerp was. Hier worden die twee vlakken ingevuld:
//   BAND  - metselwerk van wigstenen met een sluitsteen bovenaan en voegen die
//           naar het middelpunt van de boog wijzen; rijmt op de 24 nissen en de
//           cassetten in de ring, zodat het hele medaillon een taal spreekt.
//   HOLTE - schaduw onder de boog, arcering die de diepte doet, een verlichte
//           dagkant en een vloer die licht vangt. De schaduw zit bewust BOVEN:
//           daaronder staat de YG, en die moet op het lichte deel blijven staan.
// Alles in de plaatselijke maat van poort() (100 breed, 110 hoog), daarna
// meegeschaald, zodat het precies onder het beeldmerk valt.
function poortVlakken() {
  const CX = 50, CYo = 48, CYi = 50, RO = 36, RI = 26;
  const pt = (cy, r, t) => [r2(CX + r * Math.cos(t)), r2(cy + r * Math.sin(t))];
  let v = '';

  // --- de holte binnen de binnenboog
  v += `<path d="M24 104V${CYi}a${RI} ${RI} 0 0 1 ${RI * 2} 0V104Z" fill="url(#poortnis)"/>`;
  v += '<g clip-path="url(#poortknip)">';
  // Alleen in het bovenste deel: dat is de halve koepel van de nis. De
  // achterwand daaronder blijft glad, want daar staat de YG en die moet op een
  // rustige ondergrond staan - strepen achter letters lezen als ruis.
  for (let j = 0; j < 9; j++) {
    const yy = r2(25 + j * 4.3 + w() * 0.8);
    v += `<path d="M22 ${yy}h56" stroke="${G_INKT}" stroke-width="${r2(0.5 + w() * 0.14)}" opacity="${r2(Math.max(0.010, 0.095 - j * 0.0095))}"/>`;
  }
  v += `<path d="M26.5 104V${CYi - 2}" stroke="${CREME}" stroke-width="1.5" opacity="0.30"/>`;
  v += `<path d="M73.5 104V${CYi - 2}" stroke="${G_INKT}" stroke-width="1.6" opacity="0.16"/>`;
  v += `<path d="M24 97h52v7h-52z" fill="${CREME}" opacity="0.26"/>`;
  v += `<path d="M24 96.4h52" stroke="${CREME}" stroke-width="0.8" opacity="0.34"/>`;
  // ---- POORT IN POORT ------------------------------------------------------
  // Achter in de nis ligt een tweede doorgang: kleiner, hoger geplaatst, met
  // licht dat er doorheen naar binnen valt en een lichtbaan over de vloer naar
  // voren. De YG staat op de drempel ervoor en tekent zich af tegen dat licht.
  // Dat is niet alleen diepte maar ook leesbaarheid: bronzen letters tegen een
  // heldere ondergrond springen er harder uit dan tegen een neutrale. En het
  // klopt met wat er op de platen staat - een website is de deur waardoor
  // klanten binnenkomen. Haal het licht hier niet weg zonder de letters opnieuw
  // op contrast te toetsen.
  {
    const hw2 = 19, voet2 = 99, aanzet2 = 66;
    const vorm2 = `M${50 - hw2} ${voet2}V${aanzet2}a${hw2} ${hw2} 0 0 1 ${hw2 * 2} 0V${voet2}`;
    v += `<path d="${vorm2}Z" fill="#FFFCF2" opacity="0.62"/>`;
    v += `<path d="M${50 - hw2 + 3} ${voet2}V${aanzet2 + 2}a${hw2 - 3} ${hw2 - 3} 0 0 1 ${(hw2 - 3) * 2} 0V${voet2}Z" fill="#FFFFFF" opacity="0.40"/>`;
    v += `<path d="${vorm2}" fill="none" stroke="${G_INKT}" stroke-width="1.2" opacity="0.44"/>`;
    v += `<path d="M${50 - hw2 - 2.8} ${voet2}V${aanzet2}a${hw2 + 2.8} ${hw2 + 2.8} 0 0 1 ${(hw2 + 2.8) * 2} 0V${voet2}" fill="none" stroke="${CREME}" stroke-width="1.7" opacity="0.40"/>`;
    v += `<path d="M${50 - hw2} ${voet2}L${50 - hw2 - 7} 104h${(hw2 + 7) * 2}L${50 + hw2} ${voet2}Z" fill="#FFFCF2" opacity="0.34"/>`;
  }
  v += '</g>';

  // --- de band: wigstenen over de boog, lagen in de staanders
  v += `<path d="M14 104V${CYo}a${RO} ${RO} 0 0 1 ${RO * 2} 0V104ZM24 104V${CYi}a${RI} ${RI} 0 0 1 ${RI * 2} 0V104Z" fill="url(#poortband)" fill-rule="evenodd"/>`;
  v += '<g clip-path="url(#bandknip)">';
  const STENEN = 13;                          // oneven: dan zit er een sluitsteen bovenaan
  for (let k = 0; k < STENEN; k++) {          // elke steen zijn eigen toon naar de lichtval
    const tm = Math.PI + ((k + 0.5) / STENEN) * Math.PI;
    const L = Math.cos(tm - (A_LICHT + Math.PI / 2));
    const b = Math.PI / STENEN / 2 - 0.012;
    const [ax, ay] = pt(CYo, RO, tm - b), [bx, by] = pt(CYo, RO, tm + b);
    const [cx2, cy2] = pt(CYi, RI, tm + b), [dx2, dy2] = pt(CYi, RI, tm - b);
    const d = `M${ax} ${ay}A${RO} ${RO} 0 0 1 ${bx} ${by}L${cx2} ${cy2}A${RI} ${RI} 0 0 0 ${dx2} ${dy2}Z`;
    v += `<path d="${d}" fill="${L > 0 ? CREME : G_SCHAD}" opacity="${r2(0.17 * Math.abs(L) + 0.04 + w() * 0.04)}"/>`;
  }
  for (let k = 0; k <= STENEN; k++) {         // de voegen, elk een fractie uit het gelid
    const t = Math.PI + (k / STENEN) * Math.PI + w() * 0.012;
    const [ax, ay] = pt(CYo, RO + 1.2, t), [bx, by] = pt(CYi, RI - 1.2, t);
    v += `<path d="M${ax} ${ay}L${bx} ${by}" stroke="${G_INKT}" stroke-width="${r2(0.7 + w() * 0.2)}" opacity="${r2(0.30 + w() * 0.07)}"/>`;
    v += `<path d="M${r2(ax + 0.55)} ${r2(ay + 0.45)}L${r2(bx + 0.55)} ${r2(by + 0.45)}" stroke="${CREME}" stroke-width="0.5" opacity="0.20"/>`;
  }
  for (const zij of [14, 76]) {               // lagen in de staanders onder de boogaanzet
    for (let j = 1; j <= 4; j++) {
      const yy = r2(56 + j * 11.5 + w() * 1.1);
      v += `<path d="M${zij} ${yy}h10" stroke="${G_INKT}" stroke-width="0.65" opacity="${r2(0.24 + w() * 0.06)}"/>`;
      v += `<path d="M${zij} ${r2(yy + 0.5)}h10" stroke="${CREME}" stroke-width="0.45" opacity="0.18"/>`;
    }
  }
  v += '</g>';
  // de sluitsteen: iets breder dan de rest, zoals bij een echte boog
  v += `<path d="M45.4 ${r2(CYo - RO - 0.8)}h9.2v12.6h-9.2z" fill="${CREME}" opacity="0.22"/>`;
  v += `<path d="M45.4 ${r2(CYo - RO - 0.8)}h9.2v12.6h-9.2z" fill="none" stroke="${G_INKT}" stroke-width="0.7" opacity="0.34"/>`;
  return v;
}
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
  <!-- de holte achter de poort: donker onder de boog, licht op de vloer, zodat
       de letters op het lichte deel staan en leesbaar blijven -->
  <linearGradient id="poortnis" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5A4419" stop-opacity="0.50"/>
    <stop offset="38%" stop-color="#7A5E28" stop-opacity="0.26"/>
    <stop offset="74%" stop-color="#C9A45C" stop-opacity="0.10"/>
    <stop offset="100%" stop-color="#FFF8E6" stop-opacity="0.34"/></linearGradient>
  <!-- de band tussen de bogen: licht aan de kant die het licht vangt -->
  <linearGradient id="poortband" x1="0.05" y1="0" x2="0.95" y2="1">
    <stop offset="0%" stop-color="#FFF6E2" stop-opacity="0.60"/>
    <stop offset="42%" stop-color="#D8B573" stop-opacity="0.34"/>
    <stop offset="100%" stop-color="#6B5322" stop-opacity="0.44"/></linearGradient>
  <clipPath id="poortknip"><path d="M24 104V50a26 26 0 0 1 52 0V104Z"/></clipPath>
  <clipPath id="bandknip"><path d="M14 104V48a36 36 0 0 1 72 0V104ZM24 104V50a26 26 0 0 1 52 0V104Z" clip-rule="evenodd"/></clipPath>
  <linearGradient id="brons" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="112">
    <stop offset="0%" stop-color="#9C7B33"/><stop offset="40%" stop-color="#7E6229"/>
    <stop offset="100%" stop-color="#52401A"/></linearGradient>

  <!-- ALBAST. Het waas is het materiaal zelf: licht dat door steen gaat komt er
       verstrooid uit, nooit met een scherpe rand. -->
  <filter id="waasdun" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="7.5"/></filter>
  <filter id="waasdik" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="3.2"/></filter>
  <filter id="waasnerf" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="2.0"/></filter>
  <filter id="waasbreed" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="waastweede" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="4.5"/></filter>
  <filter id="waasrand" x="-24%" y="-24%" width="148%" height="148%"><feGaussianBlur stdDeviation="15"/></filter>
  <filter id="waaslek" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="6"/></filter>
  <mask id="dun">
    <rect width="${W}" height="${W}" fill="#000000"/>
    ${dikteMasker()}
  </mask>
  <!-- de lamp staat schuin achter de steen, in dezelfde hoek als A_LICHT: niets
       hier mag tegen die richting in werken -->
  <radialGradient id="lamp" gradientUnits="userSpaceOnUse"
    cx="${r2(C + 262 * LX)}" cy="${r2(C + 262 * LY)}" r="840">
    <stop offset="0%" stop-color="#FFE7B4" stop-opacity="0.66"/>
    <stop offset="20%" stop-color="#FFE5B2" stop-opacity="0.54"/>
    <stop offset="40%" stop-color="#FFEBC6" stop-opacity="0.34"/>
    <stop offset="68%" stop-color="#FFF1D4" stop-opacity="0.11"/>
    <stop offset="100%" stop-color="#FFF6E2" stop-opacity="0.015"/></radialGradient>
  <radialGradient id="lampwit" gradientUnits="userSpaceOnUse"
    cx="${r2(C + 262 * LX)}" cy="${r2(C + 262 * LY)}" r="880">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
    <stop offset="42%" stop-color="#FFFFFF" stop-opacity="0.72"/>
    <stop offset="78%" stop-color="#FFFFFF" stop-opacity="0.30"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.10"/></radialGradient>
  <radialGradient id="verweg" gradientUnits="userSpaceOnUse"
    cx="${r2(C + 262 * LX)}" cy="${r2(C + 262 * LY)}" r="900">
    <stop offset="0%" stop-color="#C9A45C" stop-opacity="0"/>
    <stop offset="36%" stop-color="#C9A45C" stop-opacity="0.015"/>
    <stop offset="64%" stop-color="#C2994E" stop-opacity="0.07"/>
    <stop offset="100%" stop-color="#AE8839" stop-opacity="0.135"/></radialGradient>
  <mask id="lampm"><rect width="${W}" height="${W}" fill="url(#lampwit)"/></mask>
  <!-- de nerf wordt in het hart gedempt: daar staat de YG, en aders vlak
       naast letters lezen als krassen in plaats van als steen -->
  <mask id="nerfm"><rect width="${W}" height="${W}" fill="url(#lampwit)"/>
    <g filter="url(#waasdun)"><circle cx="${C}" cy="${C}" r="${r2(R_OOG - 26)}" fill="#000000" opacity="0.74"/></g></mask>
</defs>
<rect width="${W}" height="${W}" fill="url(#ch)"/>
${papierLijnen()}
${buitenveld()}
${ALBAST ? randgloed() : ''}
<circle cx="${C}" cy="${C}" r="556" fill="none" stroke="${G_DIEP}" stroke-width="0.9" opacity="0.18"/>
<circle cx="${C}" cy="${C}" r="592" fill="none" stroke="${G_DIEP}" stroke-width="0.6" opacity="0.10"/>
${koepel()}
${ribben()}
${ringlijsten()}
<circle cx="${C}" cy="${C}" r="${R_OOG}" fill="url(#oog)"/>
${oculus()}
${tamboer()}
${kroonlijst()}
<!-- HET LICHT VAN ACHTEREN. Deze laag hoort hier en nergens anders: boven het
     tekenwerk, zodat het licht er echt doorheen komt, maar ONDER de modellering
     en het verguldwerk, zodat de gloed in het materiaal zit in plaats van er
     overheen te liggen. De modellering dooft hem rechtsonder vanzelf, waar de
     steen van het licht af staat. -->
${albastLaag()}
<g mask="url(#ringm)"><rect width="${W}" height="${W}" fill="url(#model)"/></g>
<g mask="url(#ringm)"><rect width="${W}" height="${W}" fill="url(#glans)"/></g>
<g mask="url(#ringm)">${verguld()}</g>
<circle cx="${C}" cy="${C}" r="${R_RAND}" fill="url(#strijk)"/>
${korrel(1400, 770, 1)}
<rect width="${W}" height="${W}" fill="url(#hart)"/>
${watermerk()}
${korrel(560, 300, 0.85)}
<g transform="translate(${x},${y}) scale(${SCH})">${poortVlakken()}</g>
<!-- Het beeldmerk in relief. De ring eromheen is een gemodelleerd voorwerp met
     diepte en licht; een vlakke lijntekening in het midden valt daarbij uit de
     toon. Schaduw en hooglicht volgen DEZELFDE lichtrichting als de koepel
     (A_LICHT), anders vecht het middelpunt met zijn eigen lijst. De letters
     krijgen een donkere omlijning: Playfair heeft geen vet, en YG is de naam -
     die moet het zwaarst wegen van alles wat hier staat. -->
${(() => {
  const lx = Math.cos(A_LICHT), ly = Math.sin(A_LICHT);
  const v = (d, kl, dek) => `<g opacity="${dek}"><g transform="translate(${r2(lx * d)},${r2(ly * d)})">${M.poort(kl, x, y, SCH)}</g></g>`;
  return [
    v(-1.0, G_INKT, 0.16),                 // zachte aanzet van de slagschaduw
    v(-3.4, G_INKT, 0.30),                 // de slagschaduw, weg van het licht
    v(-2.1, G_SCHAD, 0.34),
    v(2.4, CREME, 0.62),                   // hooglicht op de kant die licht vangt
    v(1.2, CREME, 0.40),
    `<g stroke="${G_INKT}" stroke-width="${LETTER_LIJN}" stroke-linejoin="round" opacity="0.82">${M.poort('url(#brons)', x, y, SCH)}</g>`,
    M.poort('url(#brons)', x, y, SCH),
  ].join('');
})()}
<circle cx="540" cy="540" r="514" fill="none" stroke="#A07F3C" stroke-width="2.8" opacity="0.42"/>
</svg>`;

const buf = new Resvg(svg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: 1080 } }).render().asPng();
// ------------------------------------------------- patina en korrel
// Het tekenwerk hierboven is wiskundig glad: elk verloop valt precies af zoals
// een formule dat doet. Echt metaal is dat nooit. Deze twee lagen leggen daar
// oneffenheid overheen - een laagfrequent veld dat het oppervlak ongelijk laat
// verouderen, en een fijne korrel als de tand van papier of het gietsel van
// brons. Samen met de afwijkingen in de meetkunde haalt dat het machinale eraf.
const PAT_GROF = 14, PAT_WAAS = 30, PAT_DIEP = 0.46, KORREL = 0.08;

// ------------------------------------------- onderhuidse verstrooiing
// Het laatste dat albast van glas onderscheidt: licht dat de steen in gaat komt
// er niet op dezelfde plek weer uit. Het verstrooit een paar millimeter naar
// opzij, en daardoor lopen lichte vlakken ietsje OVER hun eigen rand heen. Dat
// is met tekenen niet te maken - het is een bewerking van het hele beeld: een
// sterk gewaasde, warm gestookte kopie die er met "screen" onder wordt gelegd,
// maar alleen zo sterk als de steen op die plek dun is.
//
// Het embleem is uitgespaard. Verstrooiing vreet contrast, en de YG moet op
// 56 px leesbaar blijven; dat weegt zwaarder dan het effect.
const SSS_STERK = 0.44, SSS_WAAS = 22, SSS_WARM = [1.0, 0.93, 0.76], SSS_KLEUR = [5.5, 1.2, -4.5];
const maskerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<defs>
  <filter id="waasdun" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="7.5"/></filter>
  <filter id="waasdik" x="-14%" y="-14%" width="128%" height="128%"><feGaussianBlur stdDeviation="3.2"/></filter>
  <filter id="waasspaar" x="-24%" y="-24%" width="148%" height="148%"><feGaussianBlur stdDeviation="13"/></filter>
  <radialGradient id="lampdemp" gradientUnits="userSpaceOnUse" cx="${r2(C + 262 * LX)}" cy="${r2(C + 262 * LY)}" r="880">
    <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="40%" stop-color="#000000" stop-opacity="0.24"/>
    <stop offset="75%" stop-color="#000000" stop-opacity="0.62"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.86"/></radialGradient>
</defs>
<rect width="${W}" height="${W}" fill="#000000"/>
${dikteMasker()}
<rect width="${W}" height="${W}" fill="url(#lampdemp)"/>
<g filter="url(#waasspaar)"><rect x="352" y="292" width="376" height="500" rx="62" fill="#000000"/></g>
</svg>`;
const maskerBuf = new Resvg(maskerSvg, { font: { fontFiles: [], loadSystemFonts: false }, fitTo: { mode: 'width', value: W } }).render().asPng();

async function doorschijnen(plaatBuf) {
  const m = await sharp(maskerBuf).removeAlpha().greyscale().raw().toBuffer();
  const b = await sharp(plaatBuf).removeAlpha().raw().toBuffer();
  const g = await sharp(plaatBuf).removeAlpha().blur(SSS_WAAS).raw().toBuffer();
  const uit = Buffer.alloc(W * W * 3);
  for (let i = 0; i < W * W; i++) {
    const a = (m[i] / 255) * SSS_STERK;
    for (let c = 0; c < 3; c++) {
      const bv = b[i * 3 + c], gv = Math.min(255, g[i * 3 + c] * SSS_WARM[c]);
      const sc = 255 - ((255 - bv) * (255 - gv)) / 255;      // screen
      uit[i * 3 + c] = klem(Math.round(bv + (sc - bv) * a + SSS_KLEUR[c] * a), 0, 255);
    }
  }
  return sharp(uit, { raw: { width: W, height: W, channels: 3 } }).png().toBuffer();
}

function ruisveld(n, sterk, zd) {
  let z = zd;
  const trek = () => (z = (z * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const px = Buffer.alloc(n * n * 3);
  for (let i = 0; i < n * n; i++) {
    const v = klem(128 + Math.round((trek() - 0.5) * 255 * sterk), 0, 255);
    px[i * 3] = px[i * 3 + 1] = px[i * 3 + 2] = v;
  }
  return { px, n };
}

// -------------------------------------------------- controlestrook
(async () => {
  const grof = ruisveld(PAT_GROF, PAT_DIEP, 424242);
  const patina = await sharp(grof.px, { raw: { width: grof.n, height: grof.n, channels: 3 } })
    .resize(W, W, { kernel: 'cubic' }).blur(PAT_WAAS).png().toBuffer();
  const fijn = ruisveld(W, KORREL, 991);
  const korrelLaag = await sharp(fijn.px, { raw: { width: W, height: W, channels: 3 } }).png().toBuffer();
  const gestrooid = ALBAST ? await doorschijnen(buf) : buf;
  const plaat = await sharp(gestrooid).removeAlpha()
    .composite([{ input: patina, blend: 'soft-light' }, { input: korrelLaag, blend: 'overlay' }])
    .png().toBuffer();
  const st = await sharp(plaat).stats();
  const lum = 0.2126 * st.channels[0].mean + 0.7152 * st.channels[1].mean + 0.0722 * st.channels[2].mean;
  console.log('helderheid'.padEnd(30), st.channels.map(c => c.mean.toFixed(1)).join(' / '),
    ' luma ' + lum.toFixed(2), lum >= 198.76 ? '(>= origineel 198.76, goed)' : '(TE DONKER, origineel 198.76)');
  fs.writeFileSync(path.join(UIT, NAAM + '.png'), plaat);
  console.log((NAAM + '.png').padEnd(30), W + 'x' + W, (plaat.length / 1024).toFixed(0) + ' kB');

  const maat = async n => sharp(plaat).resize(n, n, { kernel: 'lanczos3' }).png().toBuffer();
  const k56 = await maat(56), k96 = await maat(96), k150 = await maat(150);
  const groot = await sharp(k56).resize(224, 224, { kernel: 'nearest' }).png().toBuffer();
  await sharp({ create: { width: 700, height: 250, channels: 3, background: '#2b2b2b' } })
    .composite([
      { input: k56, top: 97, left: 22 },
      { input: k96, top: 77, left: 100 },
      { input: k150, top: 50, left: 218 },
      { input: groot, top: 13, left: 396 },
    ]).png().toFile(path.join(UIT, NAAM + '-controle.png'));
  await sharp(plaat).extract({ left: 110, top: 110, width: 440, height: 440 }).png().toFile(path.join(UIT, NAAM + '-detail.png'));
  await sharp(plaat).resize(300, 300).jpeg({ quality: 82 }).toFile(path.join(WEB, NAAM + '.jpg'));
  console.log('controlestrook, detail en web-voorbeeld klaar');
})();
