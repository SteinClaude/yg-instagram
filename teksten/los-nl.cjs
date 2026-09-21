// Bijschriften bij de zes berichten die Gijs op 21 september 2026 zelf in deze
// volgorde plaatst: quote, video, quote, bericht, video, bericht.
//
// Op de plaat spreken we met "u", in het bijschrift met "je" — dat is de afspraak
// sinds de eerste berichten en die houden we aan.
//
// De hashtagreeksen verschillen expres per bericht. Zes keer precies dezelfde rij
// leest voor Instagram als machinewerk, en dat is nu juist wat we willen vermijden.

const VOET = 'Websites voor ondernemers, vanaf € 550 excl. btw (€ 665,50 incl.). Vaste prijs vooraf, met een opleverdatum erbij. Antwoord binnen één werkdag.';

const T = {

  // ---- 1. quote --------------------------------------------------------
  U01: {
    tekst: [
      'Een website is de deur waardoor je klanten binnenkomen.',
      'Je poetst je ruiten, je hangt je bordje recht en je zorgt dat het er verzorgd uitziet als iemand voor het eerst binnenstapt. Online is dat niet anders, alleen gebeurt het vaker: de meeste mensen zien je site eerder dan je pand.',
      'Wat ze daar in de eerste seconden zien, bepaalt of ze verder kijken of wegklikken.',
    ],
    hashtags: '#ygdigital #yourgateway #webdesign #websitelatenmaken #eersteindruk #ondernemen #ondernemerschap #mkb #zzp #kleinbedrijf #lokaalondernemen #webdesignnederland',
  },

  // ---- 2. video: de voordeur -------------------------------------------
  R15: {
    tekst: [
      'Elke klant komt ergens binnen.',
      'Bij de één is dat een deur met een bel ernaast. Bij de ander een telefoon om half elf ’s avonds op de bank. Dat tweede gebeurt vaker, en daar heb je meestal het minst over nagedacht.',
      'Wij bouwen die ingang: rustig, verzorgd en tot in de voettekst afgewerkt. Geen sjabloon dat voor de tiende keer meegaat.',
    ],
    hashtags: '#ygdigital #yourgateway #websitelatenmaken #webdesign #nieuwewebsite #ondernemen #ondernemersleven #mkb #zzp #eigenbedrijf #vakman #lokaalondernemen',
  },

  // ---- 3. quote --------------------------------------------------------
  U02: {
    tekst: [
      'Je site is open wanneer jij dicht bent.',
      'Om zeven uur ’s ochtends, op zondagmiddag, tijdens je vakantie. Dat is het deel van je bedrijf dat nooit vrij is, en meestal het deel waar het minst aandacht naartoe gaat.',
      'Laat er dan ook iets staan waar je achter staat. Wat je doet, wat het kost, wanneer je open bent, en één knop om te bellen.',
    ],
    hashtags: '#ygdigital #yourgateway #webdesign #websitelatenmaken #altijdbereikbaar #ondernemen #ondernemerschap #mkb #zzp #winkelier #horeca #lokaalondernemen',
  },

  // ---- 4. gewoon bericht: wat het kost ---------------------------------
  F37: {
    tekst: [
      'Wat kost een website?',
      'Vanaf € 550 excl. btw, eenmalig. Dat is één bedrag, vooraf, met een opleverdatum erbij. Geen uurtarief dat gaandeweg oploopt en geen meerwerk dat er ongemerkt bij komt: wat er extra bij moet, gaat pas door nadat jij er ja op hebt gezegd.',
      'Daar komt hosting bij vanaf € 5,50 per maand bij jaarbetaling, en je domeinnaam is het eerste jaar gratis.',
      'Waarom wij dat gewoon opschrijven: omdat "prijs op aanvraag" meestal betekent dat het antwoord van jou afhangt in plaats van van het werk.',
    ],
    hashtags: '#ygdigital #watkosteenwebsite #websitelatenmaken #webdesign #vasteprijs #transparanteprijzen #ondernemen #mkb #zzp #kleinbedrijf #startendondernemer #webdesignnederland',
  },

  // ---- 5. video: het bordje op OPEN ------------------------------------
  R16: {
    tekst: [
      'Je site staat altijd op open.',
      'Je draait je bordje om als je naar huis gaat. Je website doet dat nooit. Die staat er ook om elf uur ’s avonds, ook op zondag, ook als je er zelf even helemaal klaar mee bent.',
      'Maak hem dan ook zo dat je er blij mee bent. Op onze site staat een ontwerpstudio waarin je in vijf minuten ziet hoe die van jou eruit zou kunnen zien — en met één knop zet je hem over je hele scherm.',
      'yg-digital.nl',
    ],
    hashtags: '#ygdigital #yourgateway #gratisontwerp #websitelatenmaken #webdesign #huisstijl #ondernemen #ondernemerschap #mkb #zzp #eigenbedrijf #onlineondernemen',
  },

  // ---- 6. gewoon bericht: de ontwerpstudio -----------------------------
  F36: {
    tekst: [
      'Zie je eigen site, op ware grootte.',
      'Op yg-digital.nl staat een ontwerpstudio. Je kiest je branche, je sfeer en je kleuren, en binnen vijf minuten staat er een website met jouw naam erop. Nieuw sinds vandaag: met één knop zet je hem over je hele scherm, zodat je hem ziet zoals een klant hem ziet in plaats van door een kiertje.',
      'Geen afspraak, geen account, geen verplichting. Wat je maakt mag je bewaren, en bevalt het, dan bouwen wij hem.',
      'yg-digital.nl',
    ],
    hashtags: '#ygdigital #gratisontwerp #websitelatenmaken #webdesign #huisstijl #ontwerpstudio #ondernemen #ondernemerschap #mkb #zzp #kleinbedrijf #onlineondernemen',
  },
};

// De volgorde waarin Gijs ze plaatst. Twee rijen van drie op het raster:
//   boven   F36 studio  ·  R16 video  ·  F37 prijs
//   daaronder U02 quote ·  R15 video  ·  U01 quote
const VOLGORDE = ['U01', 'R15', 'U02', 'F37', 'R16', 'F36'];

function bijschrift(code) {
  const b = T[code];
  if (!b) throw new Error(`geen bijschrift voor ${code}`);
  return [...b.tekst, VOET, b.hashtags].join('\n\n');
}

module.exports = { T, VOET, VOLGORDE, bijschrift };
