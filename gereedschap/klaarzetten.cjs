// Zet de platen om naar JPEG (Instagram neemt geen PNG) en bouwt planning.json.
// Draaien op je eigen computer, niet op GitHub:
//     node gereedschap/klaarzetten.cjs              12 weken vanaf de eerstvolgende maandag
//     node gereedschap/klaarzetten.cjs 2026-09-14 8 vanaf die datum, 8 weken
const fs = require('fs'), path = require('path');
const sharp = require('C:/Users/gijsm/yg-luxury/node_modules/sharp');

const BRON = 'C:/Users/gijsm/yg-luxury/instagram';
const WORTEL = path.join(__dirname, '..');
const BEELD = path.join(WORTEL, 'beeld');

// ---- teksten uit dezelfde bron als de webpagina en de bureaubladmap ---------
const html = fs.readFileSync(BRON + '/pagina.html', 'utf8');   // zelfde bron als de webpagina
function haal(naam) {
  const start = html.indexOf('const ' + naam + ' = [');
  const open = html.indexOf('[', start);
  let diep = 0, i = open;
  for (; i < html.length; i++) { if (html[i] === '[') diep++; else if (html[i] === ']' && --diep === 0) break; }
  return eval(html.slice(open, i + 1));
}
const BERICHTEN_NL = haal('BERICHTEN'), HASHTAGS = haal('HASHTAGS');
const BERICHTEN_EN = require(BRON + '/bijschriften-en.cjs');
const TAGS_EN = '#webdesign #websitedesign #smallbusiness #entrepreneur #webdesigner #newwebsite #branding #businessowner #netherlands #expatsinthenetherlands #ygdigital #yourgateway';
const tagsNl = set => HASHTAGS.find(h => h.naam === set).tekst;

const STANDAARD = {
  nl: `YG Digital bouwt websites voor ondernemers: de entree van uw bedrijf, rustig en verzorgd tot in detail.

Vaste prijs vooraf, vanaf \u20AC 250 excl. btw (\u20AC 302,50 incl.). Antwoord binnen \u00E9\u00E9n werkdag. Twee correctierondes en dertig dagen nazorg.

Benieuwd hoe uw website eruit zou zien? Maak in twee minuten gratis uw eerste ontwerp via de link in onze bio.

${HASHTAGS.find(h => h.naam === 'Merk').tekst}`,
  en: `YG Digital builds websites for business owners: the entrance to your business, calm and polished down to the last detail.

Fixed price upfront, from \u20AC 250 excl. VAT (\u20AC 302.50 incl.). A reply within one working day. Two rounds of revisions and thirty days of aftercare.

Curious what your website could look like? Create your first design for free in two minutes via the link in our bio.

${TAGS_EN}`,
};

// ---- platen omzetten --------------------------------------------------------
const nr = n => String(n).padStart(2, '0');
let omgezet = 0;

async function jpeg(van, naar) {
  fs.mkdirSync(path.dirname(naar), { recursive: true });
  await sharp(van).jpeg({ quality: 90, mozjpeg: true }).toFile(naar);
  omgezet++;
}

// "V07 - Tip, Een website is nooit af.png" -> "V07"
const code = bestand => bestand.split(' ')[0].replace(/\.png$/i, '');

async function zetPlatenKlaar() {
  fs.rmSync(BEELD, { recursive: true, force: true });

  for (const taal of ['nl', 'en']) {
    // verhalen en fotoberichten: naam begint met de code
    for (const [bronmap, doelmap] of [['verhalen', 'verhalen'], ['fotoberichten', 'berichten']]) {
      const map = path.join(BRON, 'uit', bronmap, taal);
      for (const bestand of fs.readdirSync(map).filter(f => f.endsWith('.png'))) {
        await jpeg(path.join(map, bestand), path.join(BEELD, doelmap, taal, code(bestand) + '.jpg'));
      }
    }
    // de twaalf uitgewerkte berichten: id '03a-ordepartner-4x5.png' -> B03-1
    const map = taal === 'nl' ? path.join(BRON, 'uit') : path.join(BRON, 'uit', 'en');
    for (const b of (taal === 'nl' ? BERICHTEN_NL : BERICHTEN_EN)) {
      for (let i = 0; i < b.id.length; i++) {
        const naam = b.id.length === 1 ? `B${nr(b.n)}` : `B${nr(b.n)}-${i + 1}`;
        await jpeg(path.join(map, `${b.id[i]}-4x5.png`), path.join(BEELD, 'berichten', taal, naam + '.jpg'));
      }
    }
  }
}

// ---- de planning ------------------------------------------------------------
// Verhalen: onderwerpen door elkaar, niet drie tips achter elkaar.
const RONDE_V = [1, 7, 14, 23, 2, 8, 15, 24, 3, 9, 16, 25, 4, 10, 17, 26, 5, 11, 18, 6, 12, 19, 13, 20, 21, 22];
// Berichten op ma/wo/vr: uitgewerkt, foto, uitgewerkt, uitgewerkt, foto, ...
const RONDE_B = [];
{
  let b = 1, f = 1;
  for (let i = 0; i < 36; i++) {
    if (i % 3 === 1) { RONDE_B.push(['F', f]); f = f % 13 + 1; }
    else { RONDE_B.push(['B', b]); b = b % 12 + 1; }
  }
}

const dagPlus = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; };
const isoDatum = d => d.toISOString().slice(0, 10);

function maakPlanning(start, weken) {
  const items = [];
  const dagen = weken * 7;

  for (let i = 0; i < dagen; i++) {
    const datum = isoDatum(dagPlus(start, i));
    const taal = i % 2 ? 'en' : 'nl';
    const v = RONDE_V[i % RONDE_V.length];
    items.push({
      id: `${datum}-verhaal`, datum, tijd: '08:00', soort: 'verhaal', taal,
      beeld: [`verhalen/${taal}/V${nr(v)}.jpg`],
    });
  }

  let n = 0;
  for (let i = 0; i < dagen; i++) {
    const dag = dagPlus(start, i).getUTCDay();                // 1 = maandag
    if (![1, 3, 5].includes(dag)) continue;
    const datum = isoDatum(dagPlus(start, i));
    const taal = n % 2 ? 'en' : 'nl';
    const [soort, num] = RONDE_B[n % RONDE_B.length];
    n++;

    if (soort === 'F') {
      items.push({
        id: `${datum}-bericht`, datum, tijd: '11:00', soort: 'bericht', taal,
        beeld: [`berichten/${taal}/F${nr(num)}.jpg`], tekst: STANDAARD[taal],
      });
    } else {
      const b = (taal === 'nl' ? BERICHTEN_NL : BERICHTEN_EN).find(x => x.n === num);
      const tags = taal === 'nl' ? tagsNl(BERICHTEN_NL.find(x => x.n === num).set) : TAGS_EN;
      const beeld = b.id.length === 1
        ? [`berichten/${taal}/B${nr(num)}.jpg`]
        : b.id.map((_, k) => `berichten/${taal}/B${nr(num)}-${k + 1}.jpg`);
      items.push({
        id: `${datum}-bericht`, datum, tijd: '11:00', soort: 'bericht', taal,
        beeld, tekst: b.tekst + '\n\n' + tags,
      });
    }
  }

  items.sort((a, b) => (a.datum + a.tijd).localeCompare(b.datum + b.tijd));
  return items;
}

// ---- draaien ----------------------------------------------------------------
(async () => {
  const [datumArg, wekenArg] = process.argv.slice(2);
  let start;
  if (datumArg && /^\d{4}-\d{2}-\d{2}$/.test(datumArg)) {
    start = new Date(datumArg + 'T00:00:00Z');
  } else {
    start = new Date();                                      // eerstvolgende maandag
    start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
    while (start.getUTCDay() !== 1) start = dagPlus(start, 1);
  }
  const weken = Number(wekenArg) || 12;

  console.log('Platen omzetten naar JPEG...');
  await zetPlatenKlaar();
  console.log(`  ${omgezet} platen in beeld/`);

  const items = maakPlanning(start, weken);
  fs.writeFileSync(path.join(WORTEL, 'planning.json'),
    JSON.stringify({ tijdzone: 'Europe/Amsterdam', gemaakt: isoDatum(new Date()), items }, null, 1));

  // controle: verwijst elk item naar een plaat die echt bestaat?
  let mis = 0;
  for (const it of items) for (const b of it.beeld) {
    if (!fs.existsSync(path.join(BEELD, b))) { console.error('  ONTBREEKT: ' + b); mis++; }
  }

  const verhalen = items.filter(i => i.soort === 'verhaal').length;
  console.log(`\nPlanning: ${items.length} items (${verhalen} verhalen, ${items.length - verhalen} berichten)`);
  console.log(`Van ${items[0].datum} tot ${items[items.length - 1].datum}`);
  console.log(mis ? `\n${mis} verwijzing(en) kloppen niet.` : '\nAlle verwijzingen kloppen.');
  process.exit(mis ? 1 : 0);
})();
