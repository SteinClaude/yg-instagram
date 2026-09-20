// De reels: welk beeld, en de twee boodschappen die achter elkaar in beeld komen.
// Op de plaat "u". Het bijschrift ("je") staat in teksten/vak-nl.cjs onder R01 enz.
// Bouwen: node gereedschap/reel.cjs
module.exports = [
  { code: 'R01', beeld: 'deur',
    boven1: 'YG Digital', kop1: 'De entree van uw bedrijf.', sub1: 'Een website is de deur waardoor klanten binnenkomen.',
    boven2: 'Wij bouwen hem', kop2: 'Rustig, verzorgd, tot in detail.', sub2: 'Websites vanaf € 550 · vaste prijs vooraf' },
  { code: 'R02', beeld: 'schets',
    boven1: 'Ons vak', kop1: 'Eerst op papier.', sub1: 'Voordat er één regel code staat.',
    boven2: 'Dan pas bouwen', kop2: 'Niets wat u niet wilt.', sub2: 'Twee correctierondes zitten erbij.' },
  { code: 'R03', beeld: 'telefoon',
    boven1: 'Op de telefoon', kop1: 'Zo ziet de meeste klant u.', sub1: 'Daarom ontwerpen wij eerst voor het kleine scherm.',
    boven2: 'Tip', kop2: 'Open uw site eens op uw telefoon.', sub2: 'Klopt het daar ook?' },
  { code: 'R04', beeld: 'bureau',
    boven1: 'Ons vak', kop1: 'Elke site begint hier.', sub1: 'Een leeg blad, en uw bedrijf als vertrekpunt.',
    boven2: 'Wat u krijgt', kop2: 'Een site die bij u past.', sub2: 'Geen sjabloon dat voor de tiende keer meegaat.' },
  { code: 'R05', beeld: 'code',
    boven1: 'Achter de schermen', kop1: 'Snel, veilig, zonder gedoe.', sub1: 'U hoeft er niets van te zien.',
    boven2: 'En daarna', kop2: 'Het blijft kloppen.', sub2: 'Updates en beveiliging zitten erbij.' },
  { code: 'R06', beeld: 'typen',
    boven1: 'Wij schrijven de teksten', kop1: 'U vertelt, wij schrijven.', sub1: 'Geen lege pagina’s meer.',
    boven2: 'Zo werkt het', kop2: 'U leest het na, wij maken het af.', sub2: 'Antwoord binnen één werkdag.' },
  { code: 'R07', beeld: 'huisstijl',
    boven1: 'Logo & huisstijl', kop1: 'Herkenbaar, tot in de voettekst.', sub1: 'Logo, kleur en letter als één geheel.',
    boven2: 'Overal hetzelfde', kop2: 'Op uw site, uw drukwerk, uw social media.', sub2: 'Klanten herkennen u zonder uw naam te lezen.' },
  { code: 'R08', beeld: 'voordeur',
    boven1: 'Wat u van ons mag verwachten', kop1: 'Drie vaste afspraken.', sub1: 'Vaste prijs vooraf.',
    boven2: 'En verder', kop2: 'Antwoord binnen één werkdag.', sub2: 'Dertig dagen nazorg na de oplevering.' },

  // 20 sep: de rij "Hoe wij werken" als film. Deze drie hebben een echte clip in
  // platen/bron/clips/ (gesprek.mp4, ontwerp.mp4, opening.mp4), dus de reel begint
  // met beweging en zoomt daarna door op het laatste frame.
  {
    code: 'R09', beeld: 'gesprek',
    boven1: 'Hoe wij werken · 1 van 3', kop1: 'Eerst het gesprek.',
    sub1: 'Een half uur, bij u aan tafel of aan de telefoon.',
    boven2: 'Meer hebben wij niet nodig', kop2: 'Wat doet u, en voor wie?',
    sub2: 'Websites vanaf € 550 · vaste prijs vooraf',
  },
  {
    code: 'R10', beeld: 'ontwerp',
    boven1: 'Hoe wij werken · 2 van 3', kop1: 'Dan het ontwerp.',
    sub1: 'U ziet uw site voordat er iets gebouwd is.',
    boven2: 'Er staat nog niets vast', kop2: 'Nu is veranderen gratis.',
    sub2: 'Websites vanaf € 550 · vaste prijs vooraf',
  },
  {
    code: 'R11', beeld: 'opening-bordje',
    boven1: 'Hoe wij werken · 3 van 3', kop1: 'Dan pas bouwen.',
    sub1: 'Met een opleverdatum die in de offerte staat.',
    boven2: 'En daarna laten wij u niet los', kop2: 'Dertig dagen nazorg.',
    sub2: 'yg-digital.nl · antwoord binnen één werkdag',
  },

  // R12 plaatst Gijs met de HAND, niet via de automaat. Daarom komt er geen
  // muziek in het bestand: in de app kan hij de muziekbibliotheek van Instagram
  // gebruiken, en dat kan de API nooit. Zet er dus nooit een mp3 bij.
  {
    code: 'R12', beeld: 'opening', stil: true,
    boven1: 'Ons vak', kop1: 'Uw deur gaat open.',
    sub1: 'Een nieuwe site is een nieuwe ingang naar uw bedrijf.',
    boven2: 'Wij bouwen hem', kop2: 'U opent hem.',
    sub2: 'Websites vanaf € 550 · vaste prijs vooraf',
  },

  // R13 is dezelfde deur-reel als R01, maar stil: deze plaatst Gijs met de hand,
  // zodat hij in de app zelf een nummer uit de bibliotheek van Instagram kiest.
  {
    code: "R13", beeld: "deur", stil: true,
    boven1: "YG Digital", kop1: "De entree van uw bedrijf.",
    sub1: "Een website is de deur waardoor klanten binnenkomen.",
    boven2: "Wij bouwen hem", kop2: "Rustig, verzorgd, tot in detail.",
    sub2: "Websites vanaf € 550 · vaste prijs vooraf",
  },
];
