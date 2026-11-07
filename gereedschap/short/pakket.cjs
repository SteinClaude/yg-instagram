// Maakt van een gerenderde short een volledig pakket: studio.txt (velden in de volgorde van het uploadscherm),
// bron/bronnen.md (per bron de beweringen) en video-upload.mp4 (onder 10 MB, voor het uploaden via Chrome).
// De teksten staan in het script zelf, in het veld `pakket` van teksten/shorts/<code>.cjs:
//   pakket: { dag: 'maandag 23 november 2026', titel, intro, feiten: [..], bronnen: [[naam, url]..], hashtags, tags,
//             md: [[naam, url, [beweringen..]]..], gelezen: 'wo 4 nov 2026', niet: 'wat bewust niet gezegd is' }
// Kanaal 1 plant om 18:00, kanaal 2 (script.kanaal === 2) om 19:00 en vermeldt de vrije beelden uit bron/beelden.json.
//   node gereedschap/short.cjs <code> && node gereedschap/short/pakket.cjs <code>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const WORTEL = path.join(__dirname, '..', '..');

const code = process.argv[2];
if (!code) { console.error('gebruik: node gereedschap/short/pakket.cjs <code>'); process.exit(1); }
const script = require(path.join(WORTEL, 'teksten', 'shorts', code + '.cjs')), p = script.pakket;
if (!p) throw new Error(code + ': geen veld `pakket` in het script');
const k2 = script.kanaal === 2, D = path.join(WORTEL, 'pakketten', script.map);
if (p.titel.length > 100) throw new Error('titel te lang: ' + p.titel.length);
const video = path.join(D, 'video.mp4');
const duur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString()).toFixed(1).replace('.', ',');

// upload-kopie onder 10 MB (zelfde instellingen als Eva: H.264 twee passen, 2 Mbit/s, AAC 96k)
const log = path.join(os.tmpdir(), 'short-upload-' + code), uitv = path.join(D, 'video-upload.mp4');
const nul = process.platform === 'win32' ? 'NUL' : '/dev/null';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-c:v', 'libx264', '-b:v', '2000k', '-pass', '1', '-passlogfile', log, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an', '-f', 'mp4', nul]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-c:v', 'libx264', '-b:v', '2000k', '-pass', '2', '-passlogfile', log, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', uitv]);
const mb = fs.statSync(uitv).size / 1e6; if (mb >= 10) throw new Error('upload te groot: ' + mb.toFixed(1) + ' MB');

// vrije beelden (kanaal 2): naamsvermelding in de beschrijving en in bronnen.md
const bl = path.join(D, 'bron', 'beelden.json');
const beelden = fs.existsSync(bl) ? Object.entries(JSON.parse(fs.readFileSync(bl, 'utf8'))) : [];
const naam = b => b.titel.replace(/^File:/, '').replace(/\.[a-z]+$/i, '');
const beeldRegels = beelden.map(([, b]) => `"${naam(b)}" by ${b.maker || 'unknown'} (${b.licentie}), via Wikimedia Commons: ${b.pagina}`);

const meer = p.bronnen.length > 1;
const stem = script.stem ? `Kokoro-82M, open source, stem "${(script.stem.stem || 'am_fenrir').replace(/^am_/, '')}", lokaal gemaakt` : null;   // shorts met stem (besluit Andries do 5 nov 2026)
const studio = `STUDIO.TXT — ${code} (YouTube Studio, uploadscherm van boven naar beneden)${k2 ? ' · KANAAL 2' : ''}
Status: gemaakt, NIET ingepland. Inplannen pas na "pakket OK ${code}" van Andries.${k2 ? '\nVóór het uploaden: controleer in Studio (accountmenu rechtsboven) dat kanaal 2 actief is.' : ''}

== Bestand ==
video.mp4   1080x1920 (9:16), 30 fps, H.264, ${duur} s, ${stem ? `Engelse stem (${stem}) plus eigen geluidseffecten; geen muziek. Ingesproken tekst: bron/stem.txt` : 'met eigen geluidseffecten (zelf gemaakt met ffmpeg; geen muziek, geen stem)'}
video-upload.mp4   zelfde video, opnieuw gecodeerd onder 10 MB (H.264 twee passen, 2 Mbit/s, AAC 96k); deze upload je via Chrome

== Details ==
Titel (${p.titel.length}/100 tekens):
${p.titel}

Beschrijving:
${p.intro}

What the source${meer ? 's say' : ' says'}:
${p.feiten.map(f => '- ' + f).join('\n')}

Source${meer ? 's' : ''}:
${p.bronnen.map(([n, u]) => `${n}: ${u}`).join('\n')}
${beeldRegels.length ? `\nImage${beeldRegels.length > 1 ? 's' : ''}:\n${beeldRegels.join('\n')}\n` : ''}
${p.hashtags}

Miniatuur: geen eigen bestand; kies in Studio een beeld uit de video (voorstel: de eerste scene).
Afspeellijsten: geen.
Publiek / Gemaakt voor kinderen: Nee, deze video is niet gemaakt voor kinderen.
Leeftijdsbeperking: Nee.

== Meer weergeven ==
Betaalde promotie: Nee.
Gewijzigde of synthetische content (AI-label): ${stem ? 'Ja — de stem is een realistische AI-stem (Kokoro). Beeld: eigen getekende animatie en tekst; geen AI-beelden, geen echte personen nagebootst' : `Nee — ${k2 ? 'echte foto\'s met een vrije licentie (zie Images), eigen tekst en animatie; geen AI-beeld, geen AI-stem' : 'eigen getekende animatie en tekst; geen realistische AI-beelden, geen AI-stem, geen echte personen'}`}.
Tags:
${p.tags}
Taal van de video: Engels.
Opnamedatum en locatie: leeg laten.
Licentie: Standaard YouTube-licentie.
Insluiten toestaan: Ja.
Categorie: Onderwijs (Education) — in Studio heet die "Educatief".
Reacties: Aan (Andries plaatst antwoorden; Manon schrijft concepten).
Muziek: geen in het bestand. Wil Andries muziek, dan alleen uit de gratis bibliotheek van YouTube zelf.

== Zichtbaarheid ==
Plannen: ${p.dag}, ${k2 ? '19:00' : '18:00'} (Amsterdam)
`;
fs.writeFileSync(path.join(D, 'studio.txt'), studio);

const beeldMd = k2
  ? `- Beeld: vrije foto's van Wikimedia Commons (alleen publiek domein, CC0 of CC BY; opgehaald met gereedschap/short/beeld.cjs), plus eigen tekst en animatie (SVG, gereedschap/short.cjs, kanaal 2). Geen video's of beelden van anderen zonder vrije licentie, geen AI-beeld.\n${beelden.map(([f, b]) => `  - ${f}: "${naam(b)}" · ${b.licentie} · ${b.maker || 'onbekend'}${b.credit ? ' · ' + b.credit : ''} · ${b.pagina} (opgehaald ${b.opgehaald})`).join('\n')}`
  : '- Beeld: eigen animatie (SVG, gereedschap/short.cjs, versie 2). Geen stockbeeld, geen beeld van anderen, geen AI-beeld.';
const md = `# Bronnen ${code}${k2 ? ' (kanaal 2)' : ''}

Gelezen op ${p.gelezen} (Manon). Elke bewering in de video staat hieronder bij zijn bron.

Script van de video: \`teksten/shorts/${code}.cjs\` · maken: \`node gereedschap/short.cjs ${code}\` en \`node gereedschap/short/pakket.cjs ${code}\`

${p.md.map(([n, u, b]) => `## ${n}\n${u}\n\n${b.map(x => '- ' + x).join('\n')}`).join('\n\n')}

## Wat bewust niet gezegd is
${p.niet}

## Beeld, letters en geluid
${beeldMd}
- Letters: Instrument Sans en IBM Plex Mono, SIL Open Font License (gereedschap/short/fonts/).
- Geluid: eigen geluidseffecten (whoosh, tik, klap, dreun, stijgende toon, bel, plop, rol), zelf gesynthetiseerd met ffmpeg uit sinus en ruis (gereedschap/short/geluid.cjs).${stem ? ` Stem: Engelse AI-stem Kokoro-82M (open source, Apache-2.0, stem "${(script.stem.stem || 'am_fenrir').replace(/^am_/, '')}"), lokaal gemaakt; ingesproken tekst in bron/stem.txt. Geen muziek, geen audio van anderen.` : ' Geen muziek, geen stem, geen audio van anderen.'}
- Controle: bron/controle-beweging.jpg (beelden uit de mp4, midden in de bewegingen).
`;
fs.writeFileSync(path.join(D, 'bron', 'bronnen.md'), md);
console.log(`${code}: ${duur} s, titel ${p.titel.length} tekens, upload ${mb.toFixed(1)} MB${beelden.length ? ', ' + beelden.length + ' beelden' : ''}`);
