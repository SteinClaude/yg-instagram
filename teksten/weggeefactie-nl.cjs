// Het bijschrift onder F35, het bericht van de weggeefactie van najaar 2026.
// Het verhaal (V53) krijgt geen bijschrift: dat staat op zichzelf.
//
// Afspraken die hier in verwerkt zitten:
//  - op de plaat "u", in het bijschrift "je"
//  - geen emoji, geen uitroeptekens, geen haast- of schaarstetaal
//  - de eerste 125 tekens zijn wat Instagram laat zien voor "meer". Daar moet
//    dus de actie zelf in staan, niet de merknaam.
//  - NERGENS een woord uit de familie kans, loten, trekken, winnen. Er wordt
//    gekozen, niet geloot. Zie de toelichting in platen/weggeefactie.cjs.
//  - de Instagram-zin staat er letterlijk in; parafraseren mag niet van Meta.
//
// Twee dingen die met opzet zo staan:
//
// 1. "Deze post" voor het Instagram-bericht, "privebericht" voor de DM. Het
//    woord "bericht" betekende eerst allebei — het bijschrift staat onder een
//    bericht en vroeg je een bericht te sturen. Dat is de meest voor de hand
//    liggende manier om deze tekst verkeerd te lezen.
//
// 2. Het woord "Weggeefactie" waarmee een inzending moet beginnen. Gijs krijgt
//    in hetzelfde postvak gewone offerteaanvragen binnen; zonder herkenpunt
//    behandelt hij straks een klant als deelnemer of andersom. Er staat daarom
//    ook bij dat niemand afvalt als hij het vergeet: een vormfout mag geen
//    goede inzending kosten.
//
// Liken en delen zijn op verzoek van Gijs een VOORWAARDE, niet een verzoek.
// Ik heb hem afgeraden: Meta's beleid voor pagina's verbiedt delen als
// deelname-eis, en vragen om delen/liken/taggen valt onder engagement bait,
// waar Meta het bereik van verlaagt. Hij koos bewust voor de variant met de
// tag erbij, omdat hij anders niet kan zien wie gedeeld heeft. Let op: een
// verhaal verdwijnt na 24 uur, dus de vermeldingen moeten worden bijgehouden
// op het moment dat ze binnenkomen.

const MERK = '#ygdigital #yourgateway #webdesign #websitelatenmaken #webdesignnederland #ondernemen #ondernemerschap #mkb #zzp #kleinbedrijf #eigenbedrijf #onlineondernemen';

const F35 = `Wij bouwen voor een ondernemer een complete website, zonder rekening. Zeven pagina's, de teksten en een logo.

Waarom wij dit doen
Dit account ging deze week door de honderd volgers. Daar hoort meer bij dan een bedankje. Wij hebben werk nodig dat wij openbaar mogen laten zien, en er is iemand die een website nodig heeft en er nu geen geld voor vrijmaakt. Dat komt hier bij elkaar.

Wat het waard is
Op onze prijslijst ligt vijf pagina's rond € 550 en tien pagina's met logo en teksten rond € 1.250, allebei exclusief btw. Dit zit daartussenin, op € 1.000.

Meedoen gaat in drie stappen
1. Stuur ons een privébericht dat begint met het woord Weggeefactie. Schrijf daaronder in drie korte alinea's wat je bedrijf doet, wat er nu online staat of juist niet, en wat een website bij jou zou moeten oplossen.
2. Vind deze post leuk.
3. Deel deze post in je verhaal en tag @ygdigital.nl, zodat wij het zien.
Vergeet je een stap, dan laten wij het je weten. Niemand valt af op een vergissing.

Waarop wij kiezen
Gijs leest en beoordeelt elke inzending zelf, op vier punten:
1. Hoe helder je uitlegt wat je bedrijf doet en voor wie.
2. Hoe concreet je beschrijft wat een website bij jou zou moeten oplossen.
3. Wat je zelf al geprobeerd hebt om online gevonden te worden, en wat daar niet werkte.
4. Hoe goed wij ons na het lezen een beeld vormen van jouw klant.
Bij een gelijke uitkomst geeft punt twee de doorslag.

Wat er niet bij zit: hosting en domeinnaam. De eerste maand is van ons, daarna neem je het over: hosting vanaf € 5,50 per maand, rechtstreeks aan JouwWeb; de domeinnaam het eerste jaar gratis en daarna € 20 per jaar; onderhoud € 45 per uur. Wij vragen er één ding voor terug: dat het werk openbaar getoond mag worden en het materiaal in november binnen is.

Insturen kan tot en met vrijdag 30 oktober 2026, 23.59 uur. Op zondag 1 november laten wij weten wie het geworden is, en waarom.

Deze actie wordt op geen enkele wijze gesponsord, onderschreven of beheerd door, of geassocieerd met, Instagram.

${MERK}`;

module.exports = { F35, MERK };

if (require.main === module) {
  const n = [...F35].length;
  console.log(F35);
  console.log('\n---');
  console.log(`${n} tekens${n > 2200 ? '  TE LANG' : '  past'}`);
  console.log(`eerste 125: ${F35.slice(0, 125).replace(/\n/g, ' / ')}`);
  for (const stam of ['kans', 'lot', 'loot', 'trek', 'win', 'geluk', 'gok', 'toeval']) {
    const t = (F35.toLowerCase().match(new RegExp(stam, 'g')) || []).length;
    if (t) console.log(`LET OP: "${stam}" komt ${t}x voor`);
  }
  if (/!/.test(F35)) console.log('LET OP: uitroepteken');
  if (/\bu\b|\buw\b/.test(F35)) console.log('LET OP: "u" of "uw" in het bijschrift');
  if (/\bik\b|\bmijn\b/.test(F35)) console.log('LET OP: "ik" of "mijn"');
}
