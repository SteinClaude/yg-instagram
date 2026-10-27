// Meer voorbeelden van de familie Nacht (docs/stijlgids.md §6), op verzoek van Andries (26 okt: "maak eens meer voorbeelden
// van de nacht uiterlijk"). Elke plaat: donkere grond met gouden gloed, embleem bovenin, één groot gouden element, kop in
// ivoor, voetregel. Teksten zijn voorbeeldzinnen die kloppen zonder cijfers die we niet kunnen bewijzen (les van T01);
// geen prijs (die staat alleen in Z01). Geen pakketten, niets wordt ingepland.
//   node gereedschap/stijlproef-nacht.cjs    → preview/stijlgids/nacht-*.jpg en nacht-overzicht.jpg
'use strict';
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
const { kaart } = require('../platen/maak.cjs');

const UIT = path.join(__dirname, '..', 'preview', 'stijlgids');
fs.mkdirSync(UIT, { recursive: true });

const { speld, klok, telefoon, sterren } = require('./nacht-elementen.cjs');

// ---------------------------------------------------------------- de platen
const PLATEN = [
  { naam: 'nacht-kaart', titel: 'Feit · kaartspeld', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, speld,
    { t: 'kop', tekst: 'Gevonden op de kaart.\nEn dan?', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Wie op uw naam tikt, wil uw behandelingen, uw werk en een knop om te boeken zien.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-klok', titel: 'Feit · klok', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 24 }, klok,
    { t: 'kop', tekst: 'Uw website is ook\nom elf uur open.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Een afspraakknop werkt ook als uw zaak dicht is.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-telefoon', titel: 'Feit · telefoon', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 10 }, telefoon,
    { t: 'kop', tekst: 'Uw klant kijkt op\neen klein scherm.', grootte: 84, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'Daarom ontwerpen wij elke site eerst voor de telefoon.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-sterren', titel: 'Feit · sterren', blokken: [
    { t: 'boven', tekst: 'Een feit' }, { t: 'ruimte', h: 40 }, sterren,
    { t: 'kop', tekst: 'Uw reviews staan\nop Google.\nNiet op uw site.', grootte: 84, marge: 40, maxRegels: 4 },
    { t: 'tekst', tekst: 'Tenzij u een site heeft die ze laat zien.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-citaat', titel: 'Werkwijze · citaat', blokken: [
    { t: 'boven', tekst: 'Onze werkwijze' },
    { t: 'prijs', bedrag: '“', grootte: 560, marge: -120 },
    { t: 'kop', tekst: 'Eerst zien.\nDan beslissen.', grootte: 96, marge: 40, maxRegels: 3 },
    { t: 'tekst', tekst: 'U ziet uw eerste ontwerp voordat u iets afspreekt.', grootte: 28, max: 780 } ] },
  { naam: 'nacht-stap-3', titel: 'Zo werkt het · stap 3', blokken: [
    { t: 'boven', tekst: 'Zo werkt het' },
    { t: 'prijs', bedrag: '3', grootte: 300, marge: 90 },
    { t: 'kop', tekst: 'Vaste prijs vooraf.', grootte: 96, marge: 34 },
    { t: 'tekst', tekst: 'U weet wat het kost voordat wij beginnen. Meerwerk alleen na uw ja.', grootte: 30, max: 760 } ] },
];

(async () => {
  const bestaand = [['voorbeeld-nacht-feit', 'Feit · zoekbalk (eerste voorbeeld)'], ['voorbeeld-nacht-stap', 'Zo werkt het · stap 1 (eerste voorbeeld)']];
  for (const p of PLATEN) {
    await sharp(await kaart({ blokken: p.blokken }, 1080, 1350)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(UIT, p.naam + '.jpg'));
    console.log(p.naam + '.jpg');
  }
  // overzicht: de twee eerste voorbeelden en de zes nieuwe, vier per rij, met onderschrift
  const alle = [...bestaand.map(([n, t]) => ({ naam: n, titel: t })), ...PLATEN];
  const B = 360, H = 450, GAT = 24, RAND = 36, ONDER = 44, PER = 4, rijen = Math.ceil(alle.length / PER);
  const lagen = [];
  for (const [i, p] of alle.entries()) {
    const x = RAND + (i % PER) * (B + GAT), y = RAND + Math.floor(i / PER) * (H + ONDER + GAT);
    lagen.push({ input: await sharp(path.join(UIT, p.naam + '.jpg')).resize(B, H).toBuffer(), left: x, top: y });
    lagen.push({ input: Buffer.from(`<svg width="${B}" height="${ONDER}"><text x="0" y="28" font-family="Arial" font-size="17" fill="#6A5F55">${p.titel}</text></svg>`), left: x, top: y + H + 4 });
  }
  await sharp({ create: { width: PER * B + (PER - 1) * GAT + 2 * RAND, height: rijen * (H + ONDER) + (rijen - 1) * GAT + 2 * RAND, channels: 3, background: '#E9E2D6' } })
    .composite(lagen).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(UIT, 'nacht-overzicht.jpg'));
  console.log('nacht-overzicht.jpg');
})().catch(e => { console.error(e); process.exit(1); });
