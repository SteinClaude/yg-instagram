// De verhalen van de highlights: welk beeld, welke tekst wanneer en waar.
// Op de plaat "u". Maten in pixels op 1080 x 1920, tijden in seconden.
// Het voorstel en de afwegingen staan in docs/highlight-entree.md.
// Bouwen: node gereedschap/verhaal-video.cjs [code] [--proef]
//
// soorten lagen:
//   groep  lijntje, bovenregel (goud, kapitalen) en kop (Playfair), onderkant op 'onderkant'
//   regel  lopende tekst (Montserrat 34), bovenkant op 'bovenkant'
//   slot   gouden afsluitregel op 'y', met 'pijl: true' een getekende pijl erachter
module.exports = [
  {
    code: 'H01', map: 'entree', nr: 0, titel: 'Welkom', duur: 8, verloop: 'reel', fps: 30,
    // Echte opname: "Elegant historic hallway with chandelier", Pexels-video 35466110
    // (https://www.pexels.com/video/elegant-historic-hallway-with-chandelier-35466110/),
    // 1080 x 1920, 30 fps, 24 s; Pexels-licentie, vrij te gebruiken, geen naamsvermelding nodig.
    // Bestand: platen/bron/clips/entree.mp4 (niet in git), te halen van
    // https://videos.pexels.com/video-files/35466110/15025610_1080_1920_30fps.mp4
    // De eerste acht seconden: door de boog de hal met de kroonluchter in, op looptempo.
    montage: [{ bron: 'clips/entree.mp4', van: 0, tot: 8.3 }],
    lagen: [
      { soort: 'groep', boven: 'YG Digital', kop: 'De entree van uw bedrijf.', onderkant: 1330, in: 0.6 },
      { soort: 'regel', tekst: 'Een goede eerste indruk begint online.', bovenkant: 1366, in: 2.4 },
    ],
  },
  {
    code: 'H02', map: 'entree', nr: 1, titel: 'Wat we doen', duur: 10, verloop: 'opname',
    bron: 'opnamen/site.mp4',            // node gereedschap/opname.cjs site
    lagen: [
      { soort: 'groep', boven: 'Wat we doen', kop: 'Uw website. Onze aandacht.', onderkant: 1250, in: 0.5 },
      { soort: 'regel', tekst: 'Met YG Launch bouwen we uw website en verzorgen we daarna het beheer.', bovenkant: 1286, in: 2.0 },
      { soort: 'regel', tekst: 'Persoonlijk, met duidelijke afspraken.', bovenkant: 1400, in: 6.0 },
    ],
  },
  {
    code: 'H03', map: 'entree', nr: 2, titel: 'Even binnenkijken', duur: 15, verloop: 'opname',
    montage: [                           // node gereedschap/opname.cjs studio (tijden gemeten op de contactvellen)
      { bron: 'opnamen/poort.mp4', van: 0.9, tot: 3.4 },              // knop, de poort gaat open, de studio verschijnt (2,5 s)
      { bron: 'opnamen/stap1.mp4', tot: 3.1, snelheid: 1.25 },        // naam typen, branche aantikken (2,5 s)
      { bron: 'opnamen/onthulling.mp4', van: 0.55, tot: 1.9 },        // de boog tekent zich op donker (1,35 s)
      { bron: 'opnamen/onthulling.mp4', van: 5.05, tot: 13.6 },       // het ontwerp op volledig scherm, dan rustig scrollen (8,5 s)
    ],
    lagen: [
      { soort: 'groep', boven: 'Ontwerpstudio', kop: 'Hoe zou uw website eruitzien?', onderkant: 1210, in: 0.8 },
      { soort: 'regel', tekst: 'Ontdek de ontwerpstudio en bekijk een eerste ontwerp voor uw bedrijf.', bovenkant: 1246, in: 5.2 },
      { soort: 'slot', tekst: 'Bekijk uw eerste ontwerp', pijl: true, y: 1370, in: 10.5 },
    ],
    sticker: [1520, 1680],               // blijft leeg: daar zet Gijs in de app de linksticker
  },
];
