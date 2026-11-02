#!/usr/bin/env node
// YG Crew — stand-bewaker (Eva, 2 nov 2026; besluit Andries 20:46/21:03:
// "geen enkele agent doet iets wat een andere agent niet kan bekijken of weten").
//
// Claude Code-hook, draait op de pc (Windows/Git Bash) en in de cloud. Geen afhankelijkheden.
//   start  (SessionStart): toont de stand van de crew, je opdracht en of er al een andere sessie
//          van jou bezig is. Wijzigt niets.
//   stop   (Stop): heeft deze sessie iets veranderd, dan moet vóór je stopt: alles gecommit,
//          alles gepusht en docs/stand/<lid>.json in deze sessie bijgewerkt. Zo niet: exit 2 met
//          de reden (Claude werkt dan door). Hoogstens 2 keer per sessie; daarna laat hij je gaan.
// Doet nooit git pull, checkout of push en raakt geen bot, taak of proces.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const modus = process.argv[2] || 'stop';
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return null;
  }
}
function leesStdin() {
  try {
    const t = fs.readFileSync(0, 'utf8');
    return t ? JSON.parse(t) : {};
  } catch (e) {
    return {};
  }
}
function lees(p, max) {
  try {
    const t = fs.readFileSync(path.join(root, p), 'utf8');
    return max ? t.slice(0, max) : t;
  } catch (e) {
    return null;
  }
}
function crew() {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, '.claude', 'crew.json'), 'utf8'));
  } catch (e) {
    return {};
  }
}
// Wie ben ik? Vast per repo (.claude/crew.json); in yg-trade bepaalt de mapnaam het
// (crypto-bot-jesse/-max/-fleur = hulp, anders Ruben).
function lid() {
  const c = crew();
  if (c.mapLid) {
    const naam = path.basename(root).toLowerCase();
    for (const [stuk, l] of Object.entries(c.mapLid)) if (naam.includes(stuk)) return l;
  }
  return c.lid || 'onbekend';
}
function gitDir() {
  const d = git(['rev-parse', '--git-dir']);
  return d ? path.resolve(root, d) : null;
}
function merkPad(id) {
  const d = gitDir();
  return d ? path.join(d, 'yg-sessie-' + String(id || 'x').replace(/[^A-Za-z0-9_-]/g, '') + '.json') : null;
}

const invoer = leesStdin();
const wie = lid();
const standPad = 'docs/stand/' + wie + '.json';

if (modus === 'start') {
  const p = merkPad(invoer.session_id);
  const merk = { start: new Date().toISOString(), head: git(['rev-parse', 'HEAD']), nag: 0 };
  try { if (p) fs.writeFileSync(p, JSON.stringify(merk)); } catch (e) { /* niets */ }

  const uit = [];
  uit.push('YG Crew — je bent ' + wie + '. Regels: CLAUDE.md, blok "Melden aan Eva". Doe eerst `git pull`.');
  const stand = lees(standPad);
  if (stand) {
    try {
      const s = JSON.parse(stand);
      const ses = s.sessie || {};
      const oud = Date.now() - Date.parse(ses.sinds || s.tijd || 0);
      if (s.status === 'werkt' && ses.id && ses.id !== invoer.session_id && oud < 2 * 3600 * 1000) {
        uit.push('LET OP: mogelijk werkt er al een andere sessie als ' + wie + ' (' + (ses.plek || '?') + ', sinds ' + ses.sinds +
          '). Werk alleen-lezen en vraag Andries welke sessie doorgaat; twee sessies in dezelfde bestanden geeft conflicten.');
      }
      uit.push('Je laatste stand (' + (s.tijd || '?') + '): ' + (s.status || '?') + ' · bezig: ' + (s.bezig || '-') + ' · volgende: ' + (s.volgende || '-'));
    } catch (e) {
      uit.push('Je standbestand ' + standPad + ' is geen geldige JSON: herstel het in deze sessie.');
    }
  } else {
    uit.push('Je hebt nog geen ' + standPad + ': maak hem in deze sessie (schema in docs/stand/LEESMIJ.md).');
  }
  const cs = lees('docs/CREW-STATUS.md', 3500);
  if (cs) uit.push('--- docs/CREW-STATUS.md (begin) ---\n' + cs);
  process.stdout.write(uit.join('\n') + '\n');
  process.exit(0);
}

// --- stop ---
const p = merkPad(invoer.session_id);
let merk = null;
try { merk = p ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; } catch (e) { merk = null; }
if (!merk) process.exit(0); // geen start gezien (bv. hook later toegevoegd): niet blokkeren
if ((merk.nag || 0) >= 2) process.exit(0); // uitweg: nooit vastlopen

const vuil = git(['status', '--porcelain']) || '';
const head = git(['rev-parse', 'HEAD']);
const veranderd = vuil !== '' || (head && merk.head && head !== merk.head);
if (!veranderd) process.exit(0); // alleen gepraat of gelezen: niets te melden

const fouten = [];
if (vuil !== '') fouten.push('Er staan niet-gecommitte wijzigingen (git status). Commit ze (of zet ze in .gitignore als het rommel is).');
const tak = git(['rev-parse', '--abbrev-ref', 'HEAD']);
const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
if (!upstream) {
  fouten.push('Je tak "' + tak + '" heeft nog geen upstream: push hem met `git push -u origin ' + tak + '`.');
} else {
  const voor = git(['rev-list', '--count', '@{u}..HEAD']);
  if (voor && voor !== '0') fouten.push(voor + ' commit(s) nog niet gepusht naar ' + upstream + ': push ze.');
}
const sinds = new Date(merk.start).toISOString();
const bereik = merk.head ? [merk.head + '..HEAD'] : ['--since=' + sinds];
const standCommit = git(['log'].concat(bereik, ['--format=%H', '-1', '--', standPad]));
if (!standCommit) {
  fouten.push('Je hebt deze sessie werk gedaan maar ' + standPad + ' niet bijgewerkt en gecommit. Werk hem bij (tijd, status, af, bezig, volgende, kanNietVerder, vragen, buitenGit, voorEva), zet KLAAR/KAN NIET VERDER als regel in je oplevering, commit en push.');
} else {
  try {
    JSON.parse(lees(standPad));
  } catch (e) {
    fouten.push(standPad + ' is geen geldige JSON. Herstel hem, commit en push.');
  }
}

if (fouten.length === 0) process.exit(0);
merk.nag = (merk.nag || 0) + 1;
try { fs.writeFileSync(p, JSON.stringify(merk)); } catch (e) { /* niets */ }
process.stderr.write('Melden aan Eva (CLAUDE.md) — nog niet klaar om te stoppen:\n- ' + fouten.join('\n- ') +
  '\n(Kan iets echt niet, bv. push geweigerd: zet dat in ' + standPad + ' onder kanNietVerder en in je oplevering.)\n');
process.exit(2);
