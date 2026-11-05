// Upload-kopie onder 10 MB (Claude in Chrome neemt hoogstens 10 MB per bestand). H.264 twee passen, AAC 96k.
// Bitrate 2 Mbit/s, of lager als de video daarvoor te lang is (shorts met stem duren langer): doel ±9,3 MB.
//   node gereedschap/short/upload.cjs <pakketmap>     -> pakketten/<map>/video-upload.mp4
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const map = path.join(__dirname, '..', '..', 'pakketten', process.argv[2] || '');
const video = path.join(map, 'video.mp4'), uitv = path.join(map, 'video-upload.mp4');
if (!fs.existsSync(video)) { console.error('gebruik: node gereedschap/short/upload.cjs <pakketmap> (video.mp4 ontbreekt)'); process.exit(1); }
const duur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString());
const kbps = Math.min(2000, Math.floor((9.3 * 8 * 1024) / duur - 96 - 40));
const log = path.join(os.tmpdir(), 'upload-' + path.basename(map)), nul = process.platform === 'win32' ? 'NUL' : '/dev/null';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-c:v', 'libx264', '-b:v', kbps + 'k', '-pass', '1', '-passlogfile', log, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an', '-f', 'mp4', nul]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-c:v', 'libx264', '-b:v', kbps + 'k', '-pass', '2', '-passlogfile', log, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', uitv]);
const mb = fs.statSync(uitv).size / 1048576;
console.log(`video-upload.mp4: ${duur.toFixed(1)} s, ${kbps} kbit/s, ${mb.toFixed(2)} MB${mb >= 10 ? '  TE GROOT' : ''}`);
if (mb >= 10) process.exit(1);
