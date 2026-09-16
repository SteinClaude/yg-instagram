// Bijschriften bij de platen over ons vak (F14-F25), de reels (R01-R08) en de
// carrousel B13. Op de plaat "u", hieronder "je": de plaat is de etalage, het
// bijschrift is het gesprek. Hashtagsets komen uit berichten-nl.cjs, zodat ze
// overal hetzelfde zijn.
const basis = require('./berichten-nl.cjs');
const laatste = s => s.trim().split('\n').pop();
const MERK = laatste(basis.F10), UITLEG = laatste(basis.B02), WERK = laatste(basis.B03);

module.exports = {
  // ---- fotoberichten -------------------------------------------------------
  F14: `Elke site begint aan een bureau als dit.

Geen sjabloon dat we voor de tiende keer opnieuw gebruiken, maar een leeg blad en jouw bedrijf als vertrekpunt. Wat doe je, voor wie, en wat moet een klant binnen drie seconden snappen? Daar begint het. De rest is vakwerk.

Websites vanaf € 550, vaste prijs vooraf.

${MERK}`,

  F15: `Eerst op papier.

Voordat er één regel code staat, staat je site op papier: welke pagina’s, wat bovenaan, waar de knop. Dat schetsje bespreken we samen. Zo bouwen we niets wat je niet wilt, en hoeft er later weinig over.

${UITLEG}`,

  F16: `Zo ziet de meeste klant je.

De meeste bezoekers komen via hun telefoon. Daarom ontwerpen wij eerst voor het kleine scherm, en pas daarna voor de pc. Open je eigen site eens op je telefoon. Klopt het daar ook?

${UITLEG}`,

  F17: `De entree van je bedrijf.

Een website is de deur waardoor klanten binnenkomen. Is die deur rommelig of dicht, dan lopen ze door naar de volgende. Wij bouwen hem rustig, verzorgd en tot in detail afgewerkt.

Websites vanaf € 550, vaste prijs vooraf. Link in bio.

${MERK}`,

  F18: `Soms is een app de betere entree.

Een bestelling die klanten zelf plaatsen, een afspraak die ze zelf inboeken, een klantenkaart op de telefoon. Niet elk bedrijf heeft dat nodig, maar als het past, bouwen we het. Vraag het gewoon.

${MERK}`,

  F19: `Achter de schermen.

Snel laden, veilig, en zonder gedoe met updates. Je hoeft er niets van te zien; wij zorgen dat het klopt en blijft kloppen. Dat is het verschil tussen een site die staat en een site die werkt.

${UITLEG}`,

  F20: `Herkenbaar, tot in de voettekst.

Logo, kleur en letter als één geheel: op je site, je drukwerk en je social media. Klanten herkennen je dan overal, ook zonder je naam te lezen.

Logo en huisstijl maken we erbij als je wilt.

${MERK}`,

  F21: `Je spreekt altijd dezelfde persoon.

Geen helpdesk, geen ticketnummer, geen wachtrij. Je mailt of appt, en je hoort binnen één werkdag iets. Klein bureau, korte lijnen. Zo werken we het liefst.

${MERK}`,

  F22: `Wat goed gebouwd is, loopt vanzelf.

Een site die je niet elke week hoeft na te kijken. Hosting, beveiliging en updates zitten erbij, en je kunt zelf teksten en foto’s aanpassen. Als je wilt. Als je niet wilt, doen wij het.

${UITLEG}`,

  F23: `Je klanten zijn ook om elf uur ’s avonds online.

Dan zoeken ze je openingstijden, je prijzen, of gewoon een knop om morgen te bellen. Een goede site geeft dan al antwoord, zonder dat jij wakker hoeft te zijn.

${UITLEG}`,

  F24: `Jij vertelt, wij schrijven.

De meeste ondernemers lopen vast op de teksten, niet op het ontwerp. Daarom schrijven wij ze: jij vertelt hoe je werkt, wij maken er een verhaal van dat leest. Jij leest het na, wij maken het af.

${UITLEG}`,

  F25: `Een voordeur die vertrouwen geeft.

Drie afspraken, altijd: een vaste prijs vooraf, antwoord binnen één werkdag, en dertig dagen nazorg na de oplevering. Zo weet je waar je aan toe bent, van het eerste gesprek tot de open deur.

${MERK}`,

  // ---- reels ---------------------------------------------------------------
  R01: `De entree van je bedrijf.

Een website is de deur waardoor klanten binnenkomen. Wij bouwen hem: rustig, verzorgd en tot in detail afgewerkt. Vanaf € 550, vaste prijs vooraf.

${MERK}`,

  R02: `Eerst op papier, dan pas bouwen.

Voordat er één regel code staat, staat je site op papier. Zo bouwen we niets wat je niet wilt, en zitten er twee correctierondes bij.

${UITLEG}`,

  R03: `Zo ziet de meeste klant je.

Open je eigen site eens op je telefoon. Dat is wat de meeste bezoekers zien. Klopt het daar ook? Zo niet, dan weet je ons te vinden.

${UITLEG}`,

  R04: `Elke site begint hier.

Een leeg blad, en jouw bedrijf als vertrekpunt. Geen sjabloon dat voor de tiende keer meegaat, maar een site die bij je past.

${MERK}`,

  R05: `Snel, veilig, zonder gedoe.

Je hoeft er niets van te zien. Updates en beveiliging zitten erbij, en het blijft kloppen. Dat is achter de schermen ons werk.

${UITLEG}`,

  R06: `Jij vertelt, wij schrijven.

De teksten zijn voor de meeste ondernemers het lastigste stuk. Daarom schrijven wij ze. Jij leest het na, wij maken het af.

${UITLEG}`,

  R07: `Herkenbaar, tot in de voettekst.

Logo, kleur en letter als één geheel: op je site, je drukwerk en je social media. Klanten herkennen je zonder je naam te lezen.

${MERK}`,

  R08: `Drie vaste afspraken.

Vaste prijs vooraf. Antwoord binnen één werkdag. Dertig dagen nazorg na de oplevering. Zo weet je waar je aan toe bent.

${MERK}`,

  // ---- carrousel -----------------------------------------------------------
  B13: `Vijf dingen die klanten op je site zoeken.

En binnen drie seconden willen vinden. Swipe door: wat je doet en waar, je telefoonnummer, openingstijden die kloppen, wat het ongeveer kost, en een foto van jou of je zaak.

Ontbreekt er iets op je site? Wij kijken vrijblijvend mee; één bericht is genoeg.

${UITLEG}`,
};
