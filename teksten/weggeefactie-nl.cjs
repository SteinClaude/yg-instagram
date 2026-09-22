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
// Drie dingen die met opzet zo staan:
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
// 3. Wat er gevraagd wordt is dezelfde lijst als waarop beoordeeld wordt. Eerst
//    stonden er drie gevraagde dingen tegenover vier beoordelingspunten; wie
//    precies deed wat er stond, verloor op een punt waar niet naar gevraagd was.
//    Dat is de sterkste klacht die een afgewezen inzender kan hebben, en het
//    ondermijnt de hele lijn dat dit een echte beoordeling is.
//
// Liken en delen zijn op verzoek van Gijs een VOORWAARDE, niet een verzoek.
// Ik heb hem afgeraden: Meta's beleid voor pagina's verbiedt delen als
// deelname-eis, en vragen om delen/liken/taggen valt onder engagement bait,
// waar Meta het bereik van verlaagt. Hij koos bewust voor de variant met de
// tag erbij, omdat hij anders niet kan zien wie gedeeld heeft. Let op: een
// verhaal verdwijnt na 24 uur, dus de vermeldingen moeten worden bijgehouden
// op het moment dat ze binnenkomen.

const MERK = '#ygdigital #yourgateway #webdesign #websitelatenmaken #webdesignnederland #ondernemen #ondernemerschap #mkb #zzp #kleinbedrijf #eigenbedrijf #onlineondernemen';

const F35 = `Wij bouwen voor een ondernemer een complete website, zonder rekening. Zeven pagina's, de teksten en een logo. Insturen kan tot en met 30 oktober.

Waarom wij dit doen
Dit account ging door de honderd volgers. Daar hoort meer bij dan een bedankje. Wij hebben werk nodig dat wij openbaar mogen laten zien, en er is iemand die een website nodig heeft en er nu geen geld voor vrijmaakt. Dat komt hier bij elkaar.

Wat het waard is
Op onze prijslijst ligt vijf pagina's rond € 550 en tien pagina's met logo en teksten rond € 1.250. Dit zit daartussenin, op € 1.000 exclusief btw.

Meedoen gaat in drie stappen
1. Stuur ons hier een privébericht dat begint met het woord Weggeefactie. Een reactie onder deze post telt niet mee.
2. Vind deze post leuk.
3. Deel deze post in je verhaal en tag @ygdigital.nl, zodat wij het zien.
Vergeet je een stap, dan laten wij het je weten. Niemand valt af op een vergissing.

Wat er in dat bericht moet staan
Gijs leest elke inzending zelf en beoordeelt hem op vier punten. Schrijf er dus over, in vier korte alinea's:
1. Wat je bedrijf doet en voor wie.
2. Wat een website bij jou zou moeten oplossen.
3. Wat je zelf al geprobeerd hebt om gevonden te worden, en wat daar niet werkte.
4. Wie je klant is.
Bij een gelijke uitkomst geeft punt 2 de doorslag. Meedoen kan als je bedrijf bij de KvK staat; een inzending per bedrijf.

Wat je daarna zelf betaalt
De eerste maand hosting is van ons. Daarna neem je die over bij JouwWeb, vanaf € 5,50 per maand. De domeinnaam is het eerste jaar gratis en kost daarna € 20 per jaar. Onderhoud is € 45 per uur, alleen als je erom vraagt.

Wij vragen twee dingen terug: dat wij het werk openbaar mogen laten zien, en dat je teksten en foto's uiterlijk 30 november bij ons zijn.

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
