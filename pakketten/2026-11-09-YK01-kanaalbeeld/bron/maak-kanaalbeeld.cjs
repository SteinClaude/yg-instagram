// YK01 · kanaalbeeld voor het YouTube-kanaal van YG-Social: profielfoto, banner en watermerk, in de huisstijl van de
// shorts (papier, inkt, signaalrood, Instrument Sans / IBM Plex Mono). Zonder kanaalnaam of handle: die horen niet in
// deze openbare repo (CLAUDE.md). Wil Andries de naam op de banner, dan zet hij die er in Studio niet bij (YouTube toont
// de naam al naast de profielfoto) of geeft Eva hem in een opdracht buiten git.
// Maten volgens YouTube: profielfoto 800x800 (rond getoond), banner 2560x1440 met een veilige zone van 1546x423 in het
// midden (alles wat telt staat daarbinnen), watermerk 150x150.
//   node pakketten/2026-11-09-YK01-kanaalbeeld/bron/maak-kanaalbeeld.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const FONTS = path.join(__dirname, '..', '..', '..', 'gereedschap', 'short', 'fonts');
const fontFiles = ['InstrumentSans-Bold.ttf', 'InstrumentSans-Regular.ttf', 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-Bold.ttf'].map(f => path.join(FONTS, f));
const UIT = path.join(__dirname, '..');
const K = { papier: '#EFEAE0', papierDiep: '#E4DDCF', inkt: '#16161A', grijs: '#6E6A62', signaal: '#D9432B', geel: '#F2C230', nacht: '#1B1E2B' };
const png = (svg, w) => Buffer.from(new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: w } }).render().asPng());
const lijnen = (w, h, stap) => { let s = ''; for (let y = stap; y < h; y += stap) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#E2DBCD" stroke-width="2"/>`; return s; };
const DEFS = `<defs><filter id="sch" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity="0.28"/></filter></defs>`;

// het merkteken: een rode cirkel met een vraagteken, met een dossierlijn erdoor (de shorts beginnen met een vraag)
const teken = (cx, cy, r) => `<g filter="url(#sch)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${K.signaal}"/></g>`
  + `<text x="${cx}" y="${cy + r * 0.38}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r * 1.25}" fill="#FFFFFF">?</text>`;

// kleine iconen van de eerste week, voor de banner
const icoon = {
  stop: (x, y, r) => { const p = Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    return `<polygon points="${p}" fill="${K.signaal}" stroke="${K.inkt}" stroke-width="4"/><text x="${x}" y="${y + r * 0.2}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r * 0.55}" fill="#FFF">STOP</text>`; },
  at: (x, y, r) => `<text x="${x}" y="${y + r * 0.45}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r * 1.6}" fill="${K.signaal}">@</text>`,
  toets: (x, y, r) => `<rect x="${x - r}" y="${y - r + 6}" width="${2 * r}" height="${2 * r}" rx="14" fill="${K.inkt}"/><rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="14" fill="#FFF" stroke="${K.inkt}" stroke-width="4"/><text x="${x}" y="${y + r * 0.36}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r}" fill="${K.inkt}">Q</text>`,
  klok: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF" stroke="${K.inkt}" stroke-width="5"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.6}" stroke="${K.signaal}" stroke-width="5" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x + r * 0.4}" y2="${y}" stroke="${K.inkt}" stroke-width="7" stroke-linecap="round"/>`,
  briefje: (x, y, r) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" fill="#F7D84A" transform="rotate(-4 ${x} ${y})"/>`,
  ok: (x, y, r) => `<rect x="${x - r * 1.1}" y="${y - r * 0.75}" width="${r * 2.2}" height="${r * 1.5}" rx="12" fill="${K.signaal}"/><text x="${x}" y="${y + r * 0.35}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r}" fill="#FFF">OK</text>`,
  pin: (x, y, r) => `<rect x="${x - r * 1.3}" y="${y - r * 0.55}" width="${r * 2.6}" height="${r * 1.1}" rx="10" fill="#FFF" stroke="${K.inkt}" stroke-width="4"/><text x="${x}" y="${y + r * 0.4}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r * 0.9}" fill="${K.inkt}">****</text>`,
};

(async () => {
  // profielfoto 800x800 (YouTube snijdt rond bij)
  const profiel = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${DEFS}<rect width="800" height="800" fill="${K.papier}"/>${lijnen(800, 800, 80)}${teken(400, 400, 250)}</svg>`;
  fs.writeFileSync(path.join(UIT, 'profielfoto.png'), png(profiel, 800));

  // watermerk 150x150 (rechtsonder in elke video, als Andries het aanzet)
  const water = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">${teken(75, 75, 70).replace(/filter="url\(#sch\)"/, '')}</svg>`;
  fs.writeFileSync(path.join(UIT, 'watermerk.png'), png(water, 150));

  // banner 2560x1440; veilige zone 1546x423 in het midden (x 507–2053, y 508–931)
  const ix = ['stop', 'at', 'toets', 'klok', 'briefje', 'pin', 'ok'];
  let iconen = '';
  ix.forEach((n, i) => { const x = 180 + i * 370, y = 250 + (i % 2) * 70; iconen += `<g opacity="0.9" filter="url(#sch)">${icoon[n](x, y, 70)}</g>`; });
  ix.slice().reverse().forEach((n, i) => { const x = 180 + i * 370, y = 1190 - (i % 2) * 70; iconen += `<g opacity="0.9" filter="url(#sch)">${icoon[n](x, y, 70)}</g>`; });
  // op desktop is alleen de middenband te zien: daar ook iconen links en rechts van de veilige zone
  [['toets', 200, 640], ['klok', 360, 820], ['briefje', 2200, 650], ['ok', 2380, 820]].forEach(([n, x, y]) => { iconen += `<g opacity="0.9" filter="url(#sch)">${icoon[n](x, y, 70)}</g>`; });
  const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">${DEFS}<rect width="2560" height="1440" fill="${K.papier}"/>${lijnen(2560, 1440, 96)}${iconen}`
    + teken(700, 720, 150)
    + `<text x="900" y="690" font-family="Instrument Sans" font-weight="700" font-size="96" fill="${K.inkt}">Why everyday things are</text>`
    + `<text x="900" y="800" font-family="Instrument Sans" font-weight="700" font-size="96" fill="${K.inkt}">the way they <tspan fill="${K.signaal}">are</tspan>.</text>`
    + `<text x="904" y="880" font-family="IBM Plex Mono" font-size="40" fill="${K.grijs}">ONE THING A DAY · ALWAYS WITH SOURCES</text></svg>`;
  fs.writeFileSync(path.join(UIT, 'banner.png'), png(banner, 2560));

  // controlebeeld van de banner met de zones die YouTube toont (tv = alles, desktop = middenband, telefoon = veilige zone)
  const zones = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440"><rect x="507" y="508" width="1546" height="423" fill="none" stroke="#00A3FF" stroke-width="6" stroke-dasharray="24 14"/><rect x="0" y="508" width="2560" height="423" fill="none" stroke="#FF00AA" stroke-width="4" stroke-dasharray="10 10"/>`
    + `<text x="520" y="495" font-family="IBM Plex Mono" font-size="36" fill="#00A3FF">veilige zone (telefoon, alle apparaten) 1546x423</text><text x="20" y="975" font-family="IBM Plex Mono" font-size="36" fill="#FF00AA">desktop: volle breedte, deze hoogte</text></svg>`;
  await sharp(path.join(UIT, 'banner.png')).composite([{ input: png(zones.replace('<svg ', '<svg viewBox="0 0 2560 1440" '), 2560), top: 0, left: 0 }]).png().toBuffer().then(b => sharp(b).resize(1280).jpeg({ quality: 88 }).toFile(path.join(UIT, 'banner-zones.jpg')));   // eerst samenvoegen, dan verkleinen

  // overzicht: profielfoto rond, watermerk, banner
  const rond = await sharp(path.join(UIT, 'profielfoto.png')).resize(360).composite([{ input: Buffer.from('<svg width="360" height="360"><rect width="360" height="360" fill="#fff"/><circle cx="180" cy="180" r="180" fill="#000"/></svg>'), blend: 'dest-in' }]).png().toBuffer();
  const ban = await sharp(path.join(UIT, 'banner.png')).resize(1280).toBuffer();
  const wm = await sharp(path.join(UIT, 'watermerk.png')).resize(150).toBuffer();
  await sharp({ create: { width: 1340, height: 1200, channels: 3, background: '#2A2A2A' } })
    .composite([{ input: ban, left: 30, top: 30 }, { input: rond, left: 30, top: 790 }, { input: wm, left: 430, top: 1000 }])
    .jpeg({ quality: 88 }).toFile(path.join(UIT, 'overzicht.jpg'));
  console.log('profielfoto.png, watermerk.png, banner.png, banner-zones.jpg, overzicht.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
