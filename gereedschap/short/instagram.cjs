// Instagram-versie van een short (kanaal 1): de upload-kopie, maar met geluid dat Meta aanneemt.
// Onze video's hebben AAC op 96 kHz en een edit list; Meta wil hooguit 48 kHz en geen edit lists.
// Het beeld wordt niet opnieuw gecodeerd (zelfde kwaliteit als op YouTube, ±9,5 MB), zodat de
// openbare site (GitHub Pages, waar Instagram de video ophaalt) niet onnodig groeit.
//
//   node gereedschap/short/instagram.cjs <pakketmap> [--ms 800]
//     -> pakketten/<map>/instagram/reel.mp4    (H.264 gekopieerd, AAC 48 kHz 128k, faststart, geen edit list)
//     -> pakketten/<map>/instagram/omslag.jpg  (beeld uit de video op --ms, 1080x1920)
//
// Daarna: bijschrift.txt in dezelfde map (pas na "bijschrift OK <code>"), en dan
//   node gereedschap/plan-reel.cjs --account kanaal-1 ...
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const msI = args.indexOf('--ms'), MS = msI > -1 ? Number(args[msI + 1]) : 800;
const naam = args.find((a, i) => !a.startsWith('--') && (msI < 0 || i !== msI + 1));
const stop = m => { console.error('STOP: ' + m); process.exit(1); };
if (!naam || !Number.isInteger(MS) || MS < 0) stop('gebruik: node gereedschap/short/instagram.cjs <pakketmap> [--ms 800]');

const map = path.join(__dirname, '..', '..', 'pakketten', path.basename(naam));
const bron = path.join(map, 'video-upload.mp4');
if (!fs.existsSync(bron)) stop(`${bron} ontbreekt (eerst gereedschap/short/upload.cjs)`);
const uit = path.join(map, 'instagram');
fs.mkdirSync(uit, { recursive: true });
const reel = path.join(uit, 'reel.mp4'), omslag = path.join(uit, 'omslag.jpg');

const duur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', bron]).toString());
if (MS > duur * 1000) stop(`--ms ${MS} ligt na het einde van de video (${duur.toFixed(1)} s)`);

execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', bron, '-map', '0:v:0', '-map', '0:a:0',
  '-c:v', 'copy', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
  '-use_editlist', '0', '-movflags', '+faststart', reel]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', (MS / 1000).toFixed(3), '-i', bron,
  '-frames:v', '1', '-vf', 'scale=1080:1920', '-q:v', '2', omslag]);

// zelfde eisen als gereedschap/plan-reel.cjs, zodat het daar niet alsnog stukloopt
const p = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', reel]).toString());
const a = p.streams.find(s => s.codec_type === 'audio'), v = p.streams.find(s => s.codec_type === 'video');
const kop = fs.readFileSync(reel).subarray(0, 4 * 1024 * 1024);
const moov = kop.indexOf('moov'), mdat = kop.indexOf('mdat');
const elst = kop.subarray(moov, moov + 1024 * 1024).indexOf('elst') > -1;
const fouten = [];
if (!v || v.codec_name !== 'h264' || v.width !== 1080 || v.height !== 1920) fouten.push('beeld is geen H.264 1080x1920');
if (!a || a.codec_name !== 'aac' || +a.sample_rate !== 48000) fouten.push(`geluid is ${a && a.codec_name} ${a && a.sample_rate} Hz, verwacht AAC 48000`);
if (moov < 0 || (mdat > -1 && moov > mdat)) fouten.push('moov-atom niet vooraan');
if (elst) fouten.push('er zit nog een edit list in');
const mb = +p.format.size / 1048576;
console.log(`instagram/reel.mp4: ${(+p.format.duration).toFixed(1)} s, ${mb.toFixed(2)} MB, AAC ${a && a.sample_rate} Hz; omslag op ${MS} ms`);
if (fouten.length) stop(fouten.join('; '));
