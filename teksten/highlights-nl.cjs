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
    code: 'H02', map: 'entree', nr: 1, titel: 'Wat we doen', duur: 10,
    bron: 'opnamen/site.mp4',            // node gereedschap/opname.cjs site
    // Schoon: de opname van de startpagina over de hele plaat, zonder tekst, verloop
    // of kader eroverheen (Gijs, 25 sep 2026). De teksten van het voorstel ("Uw
    // website. Onze aandacht." enz.) staan in docs/highlight-entree.md voor het
    // geval ze nog ergens anders van pas komen.
    verloop: 'geen', chroom: false, lagen: [],
  },
  {
    code: 'H03', map: 'entree', nr: 2, titel: 'Even binnenkijken', duur: 15,
    // Schoon, net als H02: alleen de opname van de studio (Gijs, 25 sep 2026).
    verloop: 'geen', chroom: false,
    montage: [                           // node gereedschap/opname.cjs studio (tijden gemeten op de contactvellen)
      { bron: 'opnamen/poort.mp4', van: 0.9, tot: 3.4 },              // knop, de poort gaat open, de studio verschijnt (2,5 s)
      { bron: 'opnamen/stap1.mp4', tot: 3.1, snelheid: 1.25 },        // naam typen, branche aantikken (2,5 s)
      { bron: 'opnamen/onthulling.mp4', van: 0.55, tot: 1.9 },        // de boog tekent zich op donker (1,35 s)
      { bron: 'opnamen/onthulling.mp4', van: 5.7, tot: 13.6 },        // het ontwerp op volledig scherm, dan rustig scrollen (7,9 s); vanaf 5,7: de knoppen zijn dan al verborgen
    ],
    lagen: [],                           // de linksticker zet Gijs zelf in de app, waar hij wil
  },
  {
    code: 'P01', map: 'projecten', nr: 0, titel: 'Het project', duur: 8, verloop: 'reel', fps: 24, naloop: 3.2,
    // Runway-clip (seedance-2-mini, 5 s, 720p, 9:16; 80 credits, 25 sep 2026), sfeerbeeld van een
    // opgeruimd magazijn, geen eigen locatie van Ordepartner. Teksten uit PROJECTEN-OPDRACHT.md.
    bron: 'clips/magazijn.mp4',
    lagen: [
      { soort: 'groep', boven: 'Ordepartner', kop: 'Structuur begint met een sterke basis.', onderkant: 1330, in: 0.6 },
      // Geen regel over het eigen tweede bedrijf: Gijs, 25 sep 2026 ("niks vertellen erin over ons 2e bedrijf").
    ],
  },
];
