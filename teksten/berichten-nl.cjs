// De bijschriften onder de Nederlandse berichten.
// Dit is de bron: pas hier iets aan en draai daarna
//   node gereedschap/teksten-toepassen.cjs
// dan staat het in planning.json en dus straks op Instagram.
//
// Afspraken (13 september 2026):
//  - op de plaat staat "u", in het bijschrift "je"
//  - elke plaat heeft een eigen openingszin, geen standaardblok onder alles
//  - de oproep wisselt: doelgroepplaten licht, merkplaten vol, tips geen
//  - geen emoji, geen uitroeptekens, geen haast- of schaarsteteksten

const WERK = '#webdesign #websitelatenmaken #webdesignnederland #webdesigner #nieuwewebsite #websitedesign #huisstijl #logodesign #ondernemen #zzp #mkb #eigenbedrijf #jouwweb #portfolio';
const UITLEG = '#watkosteenwebsite #websitelatenmaken #webdesign #ondernemerstips #websitetips #onlinezichtbaar #vindbaarheid #zzp #mkb #startendondernemer #eigenbedrijf #kvk #ondernemen #webshop';
const MERK = '#ygdigital #yourgateway #webdesign #websites #onlineondernemen #ondernemen #zzpnederland #mkbnederland #eigenbedrijf #vakmanschap #entree #webdesignnederland';
const DOELGROEP = '#websitelatenmaken #webdesign #ondernemen #zzp #mkb #eigenbedrijf #kleinbedrijf #lokaalondernemen #startendondernemer #ondernemersleven #webdesignnederland #websitetips';

// De afsluiter onder de negen doelgroepplaten: wel de prijs, geen harde oproep.
const PRIJSREGEL = 'Websites voor ondernemers, vanaf € 550 excl. btw. Vaste prijs vooraf, met een opleverdatum erbij. Antwoord binnen één werkdag.';

const t = (tekst, tags) => tekst.trim() + '\n\n' + tags;

module.exports = {

  // --- de negen doelgroepplaten ---------------------------------------------

  F01: t(`
Voor de kapper om de hoek.

Iemand verhuist naar jouw wijk, pakt zijn telefoon en typt “kapper”. Wat hij dan vindt, bepaalt of hij bij jou binnenloopt of twee straten verderop.

Groot hoeft die site niet te zijn. Wel duidelijk: wat je doet, wat het kost, wanneer je open bent, en één knop om te bellen.

${PRIJSREGEL}`, DOELGROEP),

  F02: t(`
Voor de coach met een volle agenda.

Je agenda zit vol, dus een website voelt als iets voor later. Tot er een klant wegvalt en je merkt dat er niets is dat voor je doorwerkt terwijl jij in gesprek bent.

Een goede site doet dat wel: uitleggen wat je doet, laten zien voor wie, en mensen een plek geven om zich te melden.

${PRIJSREGEL}`, DOELGROEP),

  F03: t(`
Voor het restaurant dat vol wil zitten.

Mensen kiezen hun avond op hun telefoon. Ze willen drie dingen zien: de kaart, de openingstijden en hoe ze een tafel krijgen. Staat dat er niet binnen tien seconden, dan gaan ze door naar het volgende.

Sfeer verkoopt, maar alleen als het snel laadt en op een klein scherm klopt.

${PRIJSREGEL}`, DOELGROEP),

  F04: t(`
Voor de vakman die liever bouwt dan typt.

Je levert vakwerk. Alleen ziet niemand dat, want je website is een pagina uit 2014 met een foto van een busje erop.

Je hoeft er zelf niets aan te doen. Wij maken de teksten, kiezen het beeld en zetten je werk erop. Jij kijkt het na en zegt ja of nee.

${PRIJSREGEL}`, DOELGROEP),

  F05: t(`
Voor de winkel die ook ’s avonds open wil zijn.

Je deur gaat om zes uur dicht, je etalage online blijft staan. Wie om elf uur ’s avonds bedenkt dat hij iets nodig heeft, moet dan wel kunnen zien wat je verkoopt en wanneer hij langs kan komen.

Dat hoeft geen webshop te zijn. Een goede etalage met duidelijke openingstijden doet vaak al het werk.

${PRIJSREGEL}`, DOELGROEP),

  F06: t(`
Voor de praktijk waar mensen zich welkom voelen.

Wie een afspraak zoekt bij een fysiotherapeut, tandarts of psycholoog, is zelden op zijn gemak. Jouw site is het eerste wat hij van je ziet.

Rustige kleuren, een gezicht, heldere taal en één duidelijke manier om contact te leggen. Dat neemt meer weg dan welke opsomming van behandelingen dan ook.

${PRIJSREGEL}`, DOELGROEP),

  F07: t(`
Voor de maker die zijn werk wil laten zien.

Je werk is het verkoopargument. Toch staat het bij de meeste makers weggestopt achter een menu, in kleine plaatjes, drie klikken diep.

Grote foto’s, weinig tekst, rustige achtergrond. Laat het werk het woord doen en zet er alleen bij wat iemand moet weten om je te bereiken.

${PRIJSREGEL}`, DOELGROEP),

  F08: t(`
Voor het kantoor dat serieus genomen wil worden.

Bij een advies- of administratiekantoor koopt niemand een product. Men koopt vertrouwen. En dat begint bij hoe je eruitziet voordat je iemand gesproken hebt.

Een verzorgde site met jullie namen, jullie werkwijze en jullie tarieven zegt meer dan drie bladzijden over kwaliteit en betrouwbaarheid.

${PRIJSREGEL}`, DOELGROEP),

  F09: t(`
Voor iedereen met een bedrijf en te weinig tijd.

“Ik moet echt eens iets aan mijn website doen.” Zo begint bij ons het vaakst een gesprek, en meestal staat dat zinnetje al twee jaar op de lijst.

Het kost je één gesprek. Daarna kijk je alleen nog na wat wij gemaakt hebben; twee rondes om iets aan te passen zitten erbij.

${PRIJSREGEL}`, DOELGROEP),

  // --- de vier merkplaten ---------------------------------------------------

  F10: t(`
De entree van je bedrijf.

Aan je pand, je bus en je visitekaartje besteed je maanden. Aan de poort waar bijna al je klanten doorheen komen, meestal een middag.

Wij bouwen die poort zoals de entree van een goed hotel: rustig, verzorgd en tot in detail afgewerkt. Ook als je bedrijf klein is.

Benieuwd hoe dat er voor jou uitziet? Maak in twee minuten gratis je eerste ontwerp via de link in onze bio.`, MERK),

  F11: t(`
Vaste prijs vooraf.

Geen “neem contact op voor een vrijblijvende offerte” waarna je drie gesprekken verder nog steeds niet weet waar je aan toe bent.

Je krijgt vooraf een offerte met een bedrag én een opleverdatum. Meerwerk gaat pas door nadat je er ja op hebt gezegd. Websites vanaf € 550 excl. btw.

Alle tarieven staan gewoon op de site — link in onze bio.`, MERK),

  F12: t(`
Antwoord binnen één werkdag.

Één aanspreekpunt. Geen helpdesk, geen ticketnummer, geen “uw vraag is in behandeling”. Meestal hoor je nog dezelfde dag iets.

Dat blijft ook zo nadat je site live staat. Een korte vraag tussendoor kost je niets, en echt onderhoud € 45 per uur — waar een webbureau € 80 tot € 150 rekent.

Iets te vragen? Bellen, appen of mailen mag — alles staat achter de link in onze bio.`, MERK),

  F13: t(`
Je eerste ontwerp is gratis.

Op onze site staat een ontwerpstudio. Je kiest je branche, je sfeer en wat je website moet kunnen, en wij bouwen hem voor je ogen op — met je eigen naam erop.

Twee minuten. Geen account. Het kost niets en verplicht tot niets.

Daarna weet je tenminste waar je over praat, of je nu met ons om tafel gaat of met iemand anders. Link in onze bio.`, MERK),

  // --- de twaalf uitgewerkte berichten --------------------------------------

  B01: t(`
De entree van je bedrijf.

Een website is de poort waardoor je klanten binnenkomen. De meeste ondernemers besteden maanden aan hun pand, hun bus en hun visitekaartje — en laten die ene poort erbij staan alsof het de achterdeur is.

Wij bouwen hem als de entree van een vijfsterrenhotel: rustig, verzorgd en tot in detail afgewerkt.

Websites voor bedrijven en particulieren, vanaf € 550 excl. btw (€ 665,50 incl.). Heel Nederland.

yg-digital.nl`, MERK),

  B02: t(`
Wat kost een website?

Bij ons vanaf € 550 eenmalig, exclusief btw (€ 665,50 inclusief). Wat het bij jou wordt hangt af van het aantal pagina’s — en dat hoor je vooraf, met een opleverdatum erbij.

Geen “neem contact op voor een vrijblijvende offerte” waarna je drie gesprekken verder nog steeds niet weet waar je aan toe bent. Je krijgt vooraf een offerte met een bedrag én een opleverdatum. Meerwerk gaat pas door nadat je er ja op hebt gezegd.

Wat er daarna nog bij komt — hosting en domeinnaam — betaal je rechtstreeks aan het platform. Wij rekenen daar niets bovenop.

Alle tarieven staan gewoon op de site: yg-digital.nl/diensten`, UITLEG),

  B03: t(`
Ordepartner — Alkmaar

Ordepartner brengt rust en overzicht in de magazijnen en loodsen van zzp’ers en mkb-bedrijven. Ze ruimen op, delen logisch in en zorgen dat het ook zo blijft. Dat vroeg om een website die precies hetzelfde doet.

Wij maakten het logo, de teksten en de hele site: negen pagina’s, met de tarieven er gewoon op. In één dag van leeg naar live.

Sindsdien doen wij het onderhoud. Geen klus die af is, maar een samenwerking.

Veeg door voor het kleine scherm en voor wat wij precies deden.

ordepartner.nl`, WERK),

  B04: t(`
Van eerste gesprek tot open deur.

1. Gesprek. We bespreken wat je bedrijf online nodig heeft. Vrijblijvend, en je krijgt vooraf een offerte.
2. Ontwerp. Je krijgt een eerste versie te zien. Twee correctierondes zitten erbij.
3. Bouw. Wij bouwen de site af: snel, veilig en geschikt voor elk scherm.
4. Lancering en nazorg. Je entree gaat open. Dertig dagen lang herstellen wij eventuele fouten gratis.

Je site gaat pas live als je tevreden bent.

yg-digital.nl`, UITLEG),

  B05: t(`
Zie je droomwebsite voordat hij bestaat.

Op onze site staat een ontwerpstudio. Je kiest je branche, je sfeer en wat je website moet kunnen — en wij bouwen hem voor je ogen op, met je eigen naam erop.

Twee minuten. Geen account. Het kost niets en verplicht tot niets.

Daarna weet je tenminste waar je over praat als je met ons of met iemand anders om tafel gaat.

yg-digital.nl/eerste-ontwerp`, MERK),

  B06: t(`
Drie afspraken die wij vooraf maken.

Vaste prijs vooraf. Een offerte met een bedrag en een opleverdatum. Meerwerk gaat pas door nadat je er ja op hebt gezegd.

Antwoord binnen één werkdag. Één aanspreekpunt, geen helpdesk en geen ticketnummer. Meestal hoor je nog dezelfde dag iets.

Twee rondes en 30 dagen nazorg. Je site gaat pas live als je tevreden bent, en fouten in de eerste maand herstellen wij kosteloos.

yg-digital.nl`, UITLEG),

  B07: t(`
Onze eigen entree.

Wat wij voor jou bouwen, bouwen wij eerst voor onszelf. Inclusief het stuk waar de meeste bureaus met een grote boog omheen lopen: de prijzen.

Veeg door — ze staan er gewoon.

Wij bouwen standaard in JouwWeb, omdat je daar het minst kwijt bent en zelf alles kunt bijhouden. Liever Shopify, WordPress of Wix? Dan bouwen wij daar ook.

yg-digital.nl`, WERK),

  B08: t(`
“En wat kost het dan daarna nog?”

De eerlijke opsomming:

Hosting vanaf € 5,50 per maand, rechtstreeks aan het platform. Wij rekenen daar niets bovenop.
Domeinnaam het eerste jaar gratis, daarna € 20 per jaar. Op je eigen naam.
Onderhoud € 45 per uur, afgerond per kwartier. Een korte vraag tussendoor kost niets.

Dat laatste bedrag is het vermelden waard: een webbureau rekent voor datzelfde werk € 80 tot € 150 per uur.

Verwacht je vaker iets te willen veranderen? Dan is een onderhoudsabonnement voordeliger. Ook die tarieven staan gewoon op de site.

Bedragen exclusief btw, tarieven van september 2026.`, UITLEG),

  B09: t(`
Dezelfde bakker, drie sferen.

Één bedrijf, één tekst, één aanbod — en toch drie totaal verschillende deuren. Warm en ambachtelijk, strak en modern, of donker en chic.

Dit zijn voorbeeldontwerpen uit onze eigen ontwerpstudio, geen bestaande klant. In die studio maak je er zelf een, met je eigen naam erop.

Welke zou jij kiezen? Laat het weten in de reacties.

yg-digital.nl/eerste-ontwerp`, MERK),

  B10: t(`
Herkenbaar, tot in de voettekst.

Een logo is niet af als het alleen op je website staat. Het moet ook kloppen op je bus, je factuur, je bord aan de weg en je social media — in dezelfde kleuren, met dezelfde letters en dezelfde rust.

Wij ontwerpen logo en huisstijl, en voeren ze overal consequent door. Ook als je website er al staat.

yg-digital.nl/diensten`, UITLEG),

  B11: t(`
De meeste klanten kloppen aan met een telefoon in de hand.

Een site die op je computerscherm prachtig is en op een telefoon uit elkaar valt, kost je klanten zonder dat je het merkt. Je kijkt er zelf immers zelden zo naar.

Daarom ontwerpen wij elke site ook voor het kleine scherm, en testen wij hem daarop voordat hij opengaat.

Pak je telefoon er eens bij. Hoe staat je eigen site erop?

yg-digital.nl`, UITLEG),

  B12: t(`
Laat ons je entree bouwen.

Een vrijblijvend gesprek over wat je bedrijf online nodig heeft — en wat wij daarin voor je kunnen betekenen. Bellen, appen of mailen mag. Je hoort meestal nog dezelfde dag iets.

06 42 65 31 77
info@yg-digital.nl
yg-digital.nl

Liever eerst zelf rondkijken? Maak je eerste ontwerp op yg-digital.nl/eerste-ontwerp — gratis en zonder account.`, MERK),

};
