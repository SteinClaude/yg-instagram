// Geluidseffecten voor shorts versie 2, zelf gemaakt met ffmpeg (sinus en ruis met een envelop; geen gekochte of
// gekopieerde audio, geen muziek: muziek kiest Andries in YouTube Studio uit de gratis bibliotheek).
//
//   const G = require('./short/geluid.cjs');
//   const pcm = G.mix([[0.1, 'klap'], [2.4, 'whoosh', 0.7]], 48.0)   -> Float32Array, stereo door elkaar, 48 kHz
//
// Elk effect wordt één keer met ffmpeg uitgerekend (lavfi) en daarna in Node op de tijdlijn gelegd. De mix wordt
// genormaliseerd op een piek van -1,5 dBFS: niets klipt, alles blijft hoorbaar.
'use strict';
const { execFileSync } = require('child_process');

const RATE = 48000;
const EFFECTEN = {
  // luchtstoot bij een overgang
  whoosh: 'anoisesrc=d=0.5:c=pink:a=0.8,highpass=f=350,lowpass=f=5000,afade=t=in:d=0.3:curve=qsin,afade=t=out:st=0.3:d=0.2:curve=exp',
  // korte tik (een teller, een zijde die oplicht)
  tik: 'aevalsrc=0.8*sin(2*PI*2400*t)*exp(-90*t):d=0.06',
  // klap (iets slaat neer)
  klap: 'anoisesrc=d=0.22:c=white:a=1,lowpass=f=2600,afade=t=out:d=0.22:curve=exp',
  // diepe dreun eronder bij een klap
  boem: 'aevalsrc=0.9*sin(2*PI*(80*t-22*t*t))*exp(-4.5*t):d=0.9',
  // stijgende toon naar een onthulling toe
  stijg: 'aevalsrc=0.45*sin(2*PI*(180*t+260*t*t)):d=1.3,afade=t=in:d=1.2:curve=exp,afade=t=out:st=1.22:d=0.08',
  // heldere bel bij het antwoord
  ding: 'aevalsrc=0.6*sin(2*PI*1318.5*t)*exp(-4*t)+0.25*sin(2*PI*2637*t)*exp(-6*t):d=1.0',
  // plop voor een woord of vorm die binnenkomt
  pop: 'aevalsrc=0.8*sin(2*PI*(1250*t-5200*t*t))*exp(-28*t):d=0.12',
  // stempel die op papier neerkomt (stijl 2: bronstempel)
  stempel: 'anoisesrc=d=0.12:c=brown:a=1,lowpass=f=1200,afade=t=out:d=0.12:curve=exp',
  // ruis van een draaiende teller
  rol: 'anoisesrc=d=0.6:c=brown:a=0.6,bandpass=f=1800:width_type=h:w=1400,afade=t=in:d=0.08,afade=t=out:st=0.35:d=0.25',
};

const cache = {};
function effect(naam) {
  if (cache[naam]) return cache[naam];
  if (!EFFECTEN[naam]) throw new Error('onbekend geluid: ' + naam);
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', EFFECTEN[naam], '-ac', '1', '-ar', String(RATE), '-f', 'f32le', 'pipe:1'], { maxBuffer: 64 << 20 });
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const e = new Float32Array(ab); let p = 0; for (const v of e) p = Math.max(p, Math.abs(v));
  if (p > 0) for (let i = 0; i < e.length; i++) e[i] *= 0.8 / p;   // elk effect even luid; het volume kies je in het script
  return (cache[naam] = e);
}

// lijst: [[tijd in s, naam, volume (standaard 1), pan -1..1 (standaard 0)], ...]
function mix(lijst, duur) {
  const n = Math.ceil(duur * RATE), uitk = new Float32Array(n * 2);
  for (const [tijd, naam, vol = 1, pan = 0] of lijst) {
    const e = effect(naam), begin = Math.round(tijd * RATE);
    const l = vol * Math.min(1, 1 - pan), r = vol * Math.min(1, 1 + pan);
    for (let i = 0; i < e.length; i++) {
      const k = begin + i; if (k < 0 || k >= n) continue;
      uitk[2 * k] += e[i] * l; uitk[2 * k + 1] += e[i] * r;
    }
  }
  let piek = 0; for (const v of uitk) piek = Math.max(piek, Math.abs(v));
  const doel = Math.pow(10, -1.5 / 20);
  if (piek > 0) { const f = doel / piek; for (let i = 0; i < uitk.length; i++) uitk[i] *= f; }
  return uitk;
}

module.exports = { mix, effect, EFFECTEN, RATE };
