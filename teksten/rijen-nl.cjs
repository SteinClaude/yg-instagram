// Bijschriften bij de drie rijen uit platen/rijen.cjs.
// Op de plaat spreken we met "u", in het bijschrift met "je" — dat is de afspraak
// sinds de eerste berichten en die houden we aan.

const HASHTAGS = {
  belofte:   '#websitelatenmaken #webdesign #ondernemen #ondernemerschap #zzp #mkb #kleinbedrijf #eigenbedrijf #lokaalondernemen #webdesignnederland #vasteprijs #duidelijkheid',
  kosten:    '#websitelatenmaken #watkosteenwebsite #webdesign #ondernemen #zzp #mkb #kleinbedrijf #eigenbedrijf #lokaalondernemen #webdesignnederland #transparanteprijzen #ondernemersleven',
  werkwijze: '#websitelatenmaken #webdesign #ondernemen #ondernemerschap #zzp #mkb #kleinbedrijf #eigenbedrijf #lokaalondernemen #startendondernemer #webdesignnederland #zowerkthet',
};

const VOET = 'Websites voor ondernemers, vanaf € 550 excl. btw. Vaste prijs vooraf, met een opleverdatum erbij. Antwoord binnen één werkdag.';

const T = {

  // ---- rij 1: wat wij beloven ------------------------------------------
  F26: [
    'Vaste prijs vooraf.',
    'Je krijgt een offerte met een bedrag en een opleverdatum erop. Geen uurtarief dat gaandeweg oploopt, en geen meerwerk dat er ongemerkt bij komt: wat er extra bij moet, gaat pas door nadat jij er ja op hebt gezegd.',
    'Dat is niet aardig bedoeld. Het is gewoon hoe wij het zelf zouden willen als we iets kochten waar we geen verstand van hebben.',
  ],
  F27: [
    'Antwoord binnen één werkdag.',
    'Geen helpdesk, geen ticketnummer, geen keuzemenu. Je stuurt een bericht en je krijgt antwoord van de persoon die je site heeft gebouwd — ook een jaar na oplevering.',
    'Dat kan omdat wij klein zijn. Het is meteen de reden om klein te blijven.',
  ],
  F28: [
    'Dertig dagen nazorg.',
    'Een site is niet af op de dag dat hij online gaat. In de eerste weken kom je er pas achter wat er in het echt nog schuurt: een tekst die anders moet, een foto die scheef staat, een knop die niemand ziet.',
    'Die maand is van ons. Wat er niet klopt, zetten we recht zonder dat er een rekening bij komt.',
  ],

  // ---- rij 2: wat het kost ---------------------------------------------
  F29: [
    'Een website, eenmalig vanaf € 550.',
    'Dat is € 665,50 inclusief btw. Wat het bij jou precies wordt, hangt af van hoeveel er op moet en wat er al ligt — dus dat bedrag staat in de offerte, vóórdat wij beginnen.',
    'Waarom wij het hier gewoon opschrijven, lees je verderop in deze rij.',
  ],
  F30: [
    'En daarna?',
    'De meeste verrassingen bij een website zitten niet in de bouw maar in de maanden erna. Daarom op een rij wat er blijft komen: hosting vanaf € 5,50 per maand, onderhoud alleen als je het wilt, en wijzigingen die je zelf kunt doen.',
    'Wil je ze liever niet zelf doen, dan doen wij ze per uur. Geen abonnement dat je afsluit en daarna vergeet.',
  ],
  F31: [
    'Waarom wij onze prijzen opschrijven.',
    'Omdat je er recht op hebt te weten waar je aan begint, voordat je ergens aan tafel zit. Wie zijn prijs pas noemt na een vrijblijvend kennismakingsgesprek, heeft daar meestal een reden voor — en die reden is zelden in jouw voordeel.',
    'Wij zetten het bedrag op de plaat. Past het niet bij je, dan heb je er geen middag aan verloren.',
  ],

  // ---- rij 3: hoe wij werken -------------------------------------------
  F32: [
    'Eerst het gesprek.',
    'Een half uur, bij jou aan tafel of gewoon aan de telefoon. Wat doe je, voor wie, en wat moet iemand op jouw site vooral kunnen vinden.',
    'Meer hebben wij niet nodig om te beginnen. Je hoeft niets voor te bereiden en niets uit te zoeken.',
  ],
  F33: [
    'Dan het ontwerp.',
    'Je ziet je site voordat er iets gebouwd is. Kleur, letter, indeling, de eerste zin: het staat er allemaal al in.',
    'Bevalt de richting niet, dan verandert die nu — niet halverwege het bouwen, als het duur wordt om nog iets om te gooien.',
  ],
  F34: [
    'Dan pas bouwen, met een datum erbij.',
    'Vanaf het moment dat je ja zegt tegen het ontwerp, weet je wanneer je deur opengaat. Die datum staat in de offerte en wij houden ons eraan.',
    'Daarna zijn wij nog dertig dagen van jou. Zie de eerste rij hieronder.',
  ],
};

const RIJ_VAN = { F26: 'belofte', F27: 'belofte', F28: 'belofte', F29: 'kosten', F30: 'kosten', F31: 'kosten', F32: 'werkwijze', F33: 'werkwijze', F34: 'werkwijze' };

// Bouwt het volledige bijschrift: kop, tekst, vaste voet, hashtags.
function bijschrift(code) {
  const regels = T[code];
  if (!regels) throw new Error(`geen bijschrift voor ${code}`);
  return [...regels, VOET, HASHTAGS[RIJ_VAN[code]]].join('\n\n');
}

module.exports = { T, HASHTAGS, VOET, RIJ_VAN, bijschrift };
