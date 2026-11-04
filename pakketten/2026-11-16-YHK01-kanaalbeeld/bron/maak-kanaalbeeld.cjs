// YHK01 · kanaalbeeld voor kanaal 2 ("vreemd maar waar"): profielfoto, banner en watermerk, in de stijl van de
// shorts van kanaal 2 (donker, geel label, grote witte letters). Zonder kanaalnaam of handle: die horen niet in deze
// openbare repo (CLAUDE.md); YouTube toont de naam al naast de profielfoto.
// Maten volgens YouTube: profielfoto 800x800 (rond getoond), banner 2560x1440 met een veilige zone van 1546x423 in het
// midden, watermerk 150x150.
//   node pakketten/2026-11-16-YHK01-kanaalbeeld/bron/maak-kanaalbeeld.cjs
'use strict';
const fs = require('fs'), path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const FONTS = path.join(__dirname, '..', '..', '..', 'gereedschap', 'short', 'fonts');
const fontFiles = ['InstrumentSans-Bold.ttf', 'InstrumentSans-Regular.ttf', 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-Bold.ttf'].map(f => path.join(FONTS, f));
const UIT = path.join(__dirname, '..');
const K = { nacht: '#0E0F14', nacht2: '#1B1E2B', geel: '#F2C230', wit: '#FFFFFF', grijs: '#9A97A0', inkt: '#16161A', signaal: '#D9432B' };
const png = (svg, w) => Buffer.from(new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' }, fitTo: { mode: 'width', value: w } }).render().asPng());
const DEFS = `<defs><filter id="sch" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity="0.45"/></filter>`
  + `<radialGradient id="gloed" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#2A2E40"/><stop offset="1" stop-color="${K.nacht}"/></radialGradient></defs>`;

// het merkteken: een geel vlak met "?!" (vreemd: een vraag én een uitroep)
const teken = (cx, cy, r, schaduw = true) => `<g${schaduw ? ' filter="url(#sch)"' : ''}><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="${r * 0.28}" fill="${K.geel}" transform="rotate(-6 ${cx} ${cy})"/></g>`
  + `<text x="${cx}" y="${cy + r * 0.36}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="${r * 1.05}" fill="${K.inkt}" transform="rotate(-6 ${cx} ${cy})">?!</text>`;

// kleine iconen van de eerste week (eigen tekenwerk), voor de banner
const icoon = {
  emoe: (x, y, r) => `<ellipse cx="${x}" cy="${y + r * 0.2}" rx="${r * 0.7}" ry="${r * 0.45}" fill="#6B5A48"/><path d="M ${x + r * 0.45} ${y} C ${x + r * 0.6} ${y - r * 0.6} ${x + r * 0.55} ${y - r} ${x + r * 0.8} ${y - r}" fill="none" stroke="#6B5A48" stroke-width="${r * 0.22}" stroke-linecap="round"/><line x1="${x - r * 0.2}" y1="${y + r * 0.55}" x2="${x - r * 0.3}" y2="${y + r * 1.1}" stroke="#C9A64A" stroke-width="8"/><line x1="${x + r * 0.15}" y1="${y + r * 0.55}" x2="${x + r * 0.2}" y2="${y + r * 1.1}" stroke="#C9A64A" stroke-width="8"/>`,
  kaas: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 0.8}" fill="#F2C230" stroke="#C9A02A" stroke-width="8"/><path d="M ${x} ${y} L ${x + r * 0.8} ${y - r * 0.2} A ${r * 0.8} ${r * 0.8} 0 0 1 ${x + r * 0.62} ${y + r * 0.5} Z" fill="#E8B320"/>`,
  kalender: (x, y, r) => `<rect x="${x - r * 0.75}" y="${y - r * 0.7}" width="${r * 1.5}" height="${r * 1.45}" rx="12" fill="#FFFFFF"/><rect x="${x - r * 0.75}" y="${y - r * 0.7}" width="${r * 1.5}" height="${r * 0.4}" rx="12" fill="${K.signaal}"/><text x="${x}" y="${y + r * 0.55}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r * 0.7}" fill="${K.inkt}">?</text>`,
  kaneel: (x, y, r) => `<rect x="${x - r * 0.8}" y="${y - r * 0.18}" width="${r * 1.6}" height="${r * 0.36}" rx="${r * 0.18}" fill="#8A4F2A" transform="rotate(-25 ${x} ${y})"/><rect x="${x - r * 0.7}" y="${y + r * 0.2}" width="${r * 1.4}" height="${r * 0.32}" rx="${r * 0.16}" fill="#A0602F" transform="rotate(-25 ${x} ${y})"/>`,
  gebouw: (x, y, r) => `<rect x="${x - r * 0.5}" y="${y - r}" width="${r}" height="${r * 2}" fill="#3A3F52"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${x - r * 0.35 + (i % 2) * r * 0.4}" y="${y - r * 0.8 + Math.floor(i / 2) * r * 0.55}" width="${r * 0.28}" height="${r * 0.3}" fill="${K.geel}"/>`).join(''),
  kubus: (x, y, r) => `<path d="M ${x} ${y - r * 0.7} L ${x + r * 0.7} ${y - r * 0.35} L ${x + r * 0.7} ${y + r * 0.45} L ${x} ${y + r * 0.8} L ${x - r * 0.7} ${y + r * 0.45} L ${x - r * 0.7} ${y - r * 0.35} Z" fill="#7A5A3A"/><path d="M ${x} ${y - r * 0.7} L ${x + r * 0.7} ${y - r * 0.35} L ${x} ${y} L ${x - r * 0.7} ${y - r * 0.35} Z" fill="#9A7650"/>`,
  grens: (x, y, r) => `<rect x="${x - r * 0.8}" y="${y - r * 0.6}" width="${r * 1.6}" height="${r * 1.2}" fill="#E4DDCF"/><line x1="${x - r * 0.9}" y1="${y + r * 0.7}" x2="${x + r * 0.9}" y2="${y - r * 0.7}" stroke="#FFFFFF" stroke-width="10" stroke-dasharray="18 12"/><text x="${x - r * 0.4}" y="${y + r * 0.1}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r * 0.42}" fill="${K.inkt}">NL</text><text x="${x + r * 0.42}" y="${y + r * 0.45}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="${r * 0.42}" fill="${K.inkt}">BE</text>`,
};

(async () => {
  const profiel = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${DEFS}<rect width="800" height="800" fill="url(#gloed)"/>${teken(400, 400, 245)}</svg>`;
  fs.writeFileSync(path.join(UIT, 'profielfoto.png'), png(profiel, 800));

  const water = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">${teken(75, 75, 62, false)}</svg>`;
  fs.writeFileSync(path.join(UIT, 'watermerk.png'), png(water, 150));

  // banner 2560x1440; veilige zone 1546x423 in het midden (x 507–2053, y 508–931)
  const ix = ['emoe', 'kaneel', 'gebouw', 'kubus', 'kalender', 'grens', 'kaas'];
  let iconen = '';
  ix.forEach((n, i) => { const x = 180 + i * 370, y = 250 + (i % 2) * 70; iconen += `<g opacity="0.85" filter="url(#sch)">${icoon[n](x, y, 80)}</g>`; });
  ix.slice().reverse().forEach((n, i) => { const x = 180 + i * 370, y = 1190 - (i % 2) * 70; iconen += `<g opacity="0.85" filter="url(#sch)">${icoon[n](x, y, 80)}</g>`; });
  [['kalender', 210, 640], ['emoe', 360, 830], ['kaneel', 2200, 650], ['kubus', 2380, 830]].forEach(([n, x, y]) => { iconen += `<g opacity="0.85" filter="url(#sch)">${icoon[n](x, y, 80)}</g>`; });
  const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">${DEFS}<rect width="2560" height="1440" fill="url(#gloed)"/>${iconen}`
    + teken(690, 720, 145)
    + `<text x="900" y="700" font-family="Instrument Sans" font-weight="700" font-size="120" fill="${K.wit}">Weird, but <tspan fill="${K.geel}">real.</tspan></text>`
    + `<text x="904" y="790" font-family="IBM Plex Mono" font-size="34" fill="${K.grijs}">STRANGE THINGS, EXPLAINED · ALWAYS WITH A SOURCE</text>`
    + `<text x="904" y="860" font-family="IBM Plex Mono" font-weight="700" font-size="36" fill="${K.geel}">NEW SHORT EVERY DAY</text></svg>`;
  fs.writeFileSync(path.join(UIT, 'banner.png'), png(banner, 2560));

  const zones = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440"><rect x="507" y="508" width="1546" height="423" fill="none" stroke="#00A3FF" stroke-width="6" stroke-dasharray="24 14"/><rect x="0" y="508" width="2560" height="423" fill="none" stroke="#FF00AA" stroke-width="4" stroke-dasharray="10 10"/>`
    + `<text x="520" y="495" font-family="IBM Plex Mono" font-size="36" fill="#00A3FF">veilige zone (telefoon, alle apparaten) 1546x423</text><text x="20" y="975" font-family="IBM Plex Mono" font-size="36" fill="#FF00AA">desktop: volle breedte, deze hoogte</text></svg>`;
  await sharp(path.join(UIT, 'banner.png')).composite([{ input: png(zones, 2560), top: 0, left: 0 }]).png().toBuffer().then(b => sharp(b).resize(1280).jpeg({ quality: 88 }).toFile(path.join(UIT, 'banner-zones.jpg')));   // eerst samenvoegen, dan verkleinen

  const rond = await sharp(path.join(UIT, 'profielfoto.png')).resize(360).composite([{ input: Buffer.from('<svg width="360" height="360"><circle cx="180" cy="180" r="180" fill="#000"/></svg>'), blend: 'dest-in' }]).png().toBuffer();
  const ban = await sharp(path.join(UIT, 'banner.png')).resize(1280).toBuffer();
  const wm = await sharp(path.join(UIT, 'watermerk.png')).resize(150).toBuffer();
  await sharp({ create: { width: 1340, height: 1200, channels: 3, background: '#2A2A2A' } })
    .composite([{ input: ban, left: 30, top: 30 }, { input: rond, left: 30, top: 790 }, { input: wm, left: 430, top: 1000 }])
    .jpeg({ quality: 88 }).toFile(path.join(UIT, 'overzicht.jpg'));
  console.log('profielfoto.png, watermerk.png, banner.png, banner-zones.jpg, overzicht.jpg klaar');
})().catch(e => { console.error(e); process.exit(1); });
