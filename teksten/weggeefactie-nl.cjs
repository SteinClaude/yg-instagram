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
// Dit bericht hoort geplaatst te worden op het moment dat het account op
// honderd volgers staat. Stond het er op 21 september nog niet, dan is de
// eerste alinea van "Waarom wij dit doen" de enige regel die moet wijken.

const MERK = '#ygdigital #yourgateway #webdesign #websitelatenmaken #webdesignnederland #ondernemen #ondernemerschap #mkb #zzp #kleinbedrijf #eigenbedrijf #onlineondernemen';

const F35 = `Wij bouwen voor een ondernemer een complete website, zonder rekening. Zeven pagina's, de teksten en een logo.

Waarom wij dit doen
Dit account staat op honderd volgers. Daar hoort meer bij dan een bedankje. Wij hebben werk nodig dat wij openbaar mogen laten zien, en er is iemand die een website nodig heeft en er nu geen geld voor vrijmaakt. Dat komt hier bij elkaar.

Wat het waard is
Op onze prijslijst ligt vijf pagina's rond € 550 en tien pagina's met logo en teksten rond € 1.250, allebei exclusief btw. Dit zit daartussenin, op € 1.000. Dat bedrag komt van onze eigen prijslijst, wij hebben het er niet voor opgeblazen.

Hoe je meedoet
Stuur ons een bericht met drie dingen: wat je bedrijf doet, wat er nu online staat of juist niet, en wat een website bij jou zou moeten oplossen. Drie korte alinea's zijn genoeg. Volgen, delen of iemand taggen hoeft niet en telt niet mee.

Waarop wij kiezen
Gijs leest en beoordeelt de inzendingen zelf, op vier punten:
1. Hoe helder je uitlegt wat je bedrijf doet en voor wie.
2. Hoe concreet je beschrijft wat een website bij jou zou moeten oplossen.
3. Wat je zelf al geprobeerd hebt om online gevonden te worden, en wat daar niet werkte.
4. Hoe goed wij ons na het lezen een beeld vormen van jouw klant.
Bij een gelijke uitkomst geeft punt twee de doorslag.

Wat er niet bij zit, zodat je het vooraf weet: de hosting en de domeinnaam. De eerste maand is van ons — je site gaat open zonder een rekening. Daarna neem je het over: hosting vanaf € 5,50 per maand, rechtstreeks aan JouwWeb; de domeinnaam het eerste jaar gratis en daarna € 20 per jaar; onderhoud € 45 per uur. Wij vragen er één ding voor terug: dat het werk openbaar getoond mag worden en het materiaal in november binnen is.

Insturen kan tot en met vrijdag 30 oktober 2026, 23.59 uur. Op zondag 1 november laten wij weten wie het geworden is, en waarom.

Deze actie wordt op geen enkele wijze gesponsord, onderschreven of beheerd door, of geassocieerd met, Instagram.

${MERK}`;

module.exports = { F35, MERK };

if (require.main === module) {
  const n = [...F35].length;
  console.log(F35);
  console.log('\n---');
  console.log(`${n} tekens${n > 2200 ? '  TE LANG' : ''}`);
  console.log(`eerste 125: ${F35.slice(0, 125)}`);
  for (const stam of ['kans', 'lot', 'loot', 'trek', 'win', 'geluk', 'gok', 'toeval']) {
    const t = (F35.toLowerCase().match(new RegExp(stam, 'g')) || []).length;
    if (t) console.log(`LET OP: "${stam}" komt ${t}x voor`);
  }
  if (/[!]/.test(F35)) console.log('LET OP: uitroepteken');
  if (/\bu\b|\buw\b/.test(F35)) console.log('LET OP: "u" of "uw" in het bijschrift');
}
