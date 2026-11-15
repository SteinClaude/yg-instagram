// Decors voor stijl 3 (kanaal 1, vanaf YS40): het duo staat in een omgeving die het hele beeld vult.
// Aanleiding: Andries, za 14 nov 2026 ±14:49: een variatie op een voorbeeldkanaal "kwa achtergronden en samenvoegen
// van dingen". Wat we overnemen is de aanpak (figuren in een omgeving, losse dingen in de scène, wijd en dichtbij),
// niet het beeld: alles hier is eigen tekenwerk, in de lijn en kleuren van de figuren.
//
// Elk decor is 1080 × 1920 met 60 px extra rondom (voor de camerabeweging), heeft de vloer op y = 1470 en in het
// midden een VLAK (140..940 × 670..1000) waarop de short zijn onderwerp tekent: een prikbord, een schoolbord, een
// perkamentrol, een vel patroonpapier, een scorebord of een
// reclamebord. short.cjs tekent elk decor één keer vooraf en gebruikt het daarna als afbeelding.
//
//   const D = require('./decor.cjs');  D.svg('klas')  → volledige <svg> (1200 × 2040, viewBox -60 -60 1200 2040)
//   D.VLAK = { x: 140, y: 670, w: 800, h: 330 };  D.INKT[naam] = kleur voor tekst op het vlak

const I = '#16161A', L = 7;
const VLAK = { x: 140, y: 670, w: 800, h: 330 };
const o = (w = L) => `stroke="${I}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

const houtVloer = (kleur, naad) => {
  let s = `<rect x="-60" y="1470" width="1200" height="520" fill="${kleur}"/>`;
  for (let i = -8; i <= 8; i++) s += `<path d="M ${540 + i * 90} 1470 L ${540 + i * 260} 1990" stroke="${naad}" stroke-width="5"/>`;
  for (const y of [1540, 1640, 1780]) s += `<path d="M -60 ${y} L 1140 ${y}" stroke="${naad}" stroke-width="4" opacity="0.6"/>`;
  return s + `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
};
const lijst = (x, y, w, h, vul, inhoud) => `<g><rect x="${x + 6}" y="${y + 8}" width="${w}" height="${h}" rx="6" fill="#000" opacity="0.18"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#8A5A34" ${o(6)}/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" fill="${vul}" ${o(4)}/>${inhoud}</g>`;

// ------------------------------------------------------------------ kamer: het kantoortje van het duo, met een prikbord
function kamer() {
  let s = `<rect x="-60" y="-60" width="1200" height="1530" fill="#79C2D6"/>`;
  for (let x = -60; x < 1140; x += 120) s += `<rect x="${x}" y="-60" width="60" height="1530" fill="#70B9CE"/>`;
  s += `<rect x="-60" y="1424" width="1200" height="46" fill="#F4EEDF" ${o(5)}/>`;
  s += houtVloer('#C98A4F', '#AE733A');
  s += `<ellipse cx="540" cy="1650" rx="500" ry="130" fill="#2F7E86" ${o(6)}/><ellipse cx="540" cy="1650" rx="430" ry="100" fill="none" stroke="#F4EEDF" stroke-width="8" stroke-dasharray="26 22"/>`;
  // prikbord
  s += `<rect x="126" y="660" width="844" height="374" rx="16" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="16" fill="#8A5A34" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="6" fill="#FBF6EA" ${o(4)}/>`;
  s += [[160, 690, '#D9432B'], [920, 690, '#F2C230'], [160, 980, '#2F7D5B'], [920, 980, '#D9432B']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}" ${o(4)}/>`).join('');
  // lijstjes: een vraagteken en een uitroepteken
  s += lijst(14, 1130, 104, 130, '#FBF6EA', `<text x="66" y="1228" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="84" fill="#D9432B">?</text>`);
  s += lijst(968, 1110, 104, 130, '#FBF6EA', `<text x="1020" y="1208" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="84" fill="#F2C230" stroke="${I}" stroke-width="3">!</text>`);
  // plant rechts
  s += `<path d="M 1010 1500 Q 960 1380 1000 1300 Q 1030 1390 1024 1500 Z M 1030 1500 Q 1090 1400 1070 1310 Q 1020 1400 1020 1500 Z M 1016 1500 Q 1010 1350 1040 1270 Q 1062 1380 1036 1500 Z" fill="#2F7D5B" ${o(5)}/>`;
  s += `<path d="M 972 1500 L 1076 1500 L 1062 1590 L 986 1590 Z" fill="#E8962E" ${o(6)}/>`;
  // staande lamp links
  s += `<path d="M 60 1560 L 60 1330" ${o(9)}/><ellipse cx="60" cy="1566" rx="44" ry="12" fill="${I}"/><path d="M 14 1340 L 106 1340 L 88 1270 L 32 1270 Z" fill="#F2C230" ${o(6)}/>`;
  return s;
}

// ------------------------------------------------------------------ klas: een ouderwets klaslokaal met een schoolbord
function klas() {
  let s = `<rect x="-60" y="-60" width="1200" height="1530" fill="#F1E0AE"/>`;
  s += `<rect x="-60" y="1200" width="1200" height="270" fill="#7FA37A"/><path d="M -60 1200 L 1140 1200" ${o(6)}/>`;
  for (let x = -40; x < 1140; x += 110) s += `<path d="M ${x} 1206 L ${x} 1464" stroke="#6C9068" stroke-width="5"/>`;
  s += houtVloer('#B98552', '#9C6C3F');
  // schoolbord met krijtbakje
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#8A5A34" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#22302B" ${o(4)}/>`;
  s += `<path d="M 170 700 Q 300 690 420 704" stroke="#FFFFFF" stroke-width="10" opacity="0.06" fill="none"/><path d="M 600 960 Q 760 950 900 968" stroke="#FFFFFF" stroke-width="14" opacity="0.05" fill="none"/>`;
  s += `<rect x="150" y="1020" width="780" height="20" rx="4" fill="#6E4627" ${o(5)}/><rect x="720" y="1008" width="60" height="14" rx="5" fill="#FBF6EA" ${o(3)}/><rect x="800" y="1008" width="44" height="14" rx="5" fill="#F2C230" ${o(3)}/>`;
  // wereldbol links
  s += `<path d="M 50 1560 L 50 1500" ${o(8)}/><ellipse cx="50" cy="1566" rx="46" ry="12" fill="${I}"/><circle cx="50" cy="1440" r="62" fill="#5BA8C9" ${o(6)}/>`;
  s += `<path d="M 20 1410 Q 40 1390 62 1408 Q 70 1430 48 1446 Q 24 1440 20 1410 Z M 60 1460 Q 84 1452 92 1470 Q 76 1492 60 1484 Z" fill="#2F7D5B" ${o(3)}/><path d="M 2 1400 A 70 70 0 0 0 98 1484" fill="none" ${o(5)}/>`;
  // stapel boeken rechts
  s += [['#D9432B', 0], ['#2F7E86', 1], ['#F2C230', 2]].map(([c, i]) => `<rect x="${964 + (i % 2) * 10}" y="${1548 - i * 34}" width="110" height="32" rx="5" fill="${c}" ${o(5)}/><path d="M ${976 + (i % 2) * 10} ${1556 - i * 34} L ${976 + (i % 2) * 10} ${1572 - i * 34}" stroke="#FBF6EA" stroke-width="5"/>`).join('');
  s += `<circle cx="1020" cy="1456" r="26" fill="#D9432B" ${o(5)}/><path d="M 1020 1432 Q 1026 1416 1040 1414" fill="none" ${o(5)}/>`;
  return s;
}

// ------------------------------------------------------------------ rome: zuilen, heuvels en een perkamentrol
function rome() {
  let s = `<defs><linearGradient id="lucht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C56F"/><stop offset="1" stop-color="#FDEFC9"/></linearGradient></defs>`;
  s += `<rect x="-60" y="-60" width="1200" height="1530" fill="url(#lucht)"/><circle cx="860" cy="1150" r="120" fill="#FFF3C4" opacity="0.9"/>`;
  s += `<path d="M -60 1340 Q 200 1200 460 1320 Q 700 1220 1140 1330 L 1140 1470 L -60 1470 Z" fill="#D8B26B" ${o(5)}/>`;
  s += `<path d="M -60 1400 Q 300 1330 620 1400 Q 900 1350 1140 1410 L 1140 1470 L -60 1470 Z" fill="#C79A50" ${o(5)}/>`;
  s += [[200, 1330, 1], [262, 1356, 0.7], [830, 1318, 0.9]].map(([x, y, k]) => `<path d="M ${x} ${y} Q ${x - 26 * k} ${y - 90 * k} ${x} ${y - 190 * k} Q ${x + 26 * k} ${y - 90 * k} ${x} ${y} Z" fill="#2F6B4F" ${o(5)}/>`).join('');
  // stenen vloer
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#E4D2AD"/>`;
  for (let i = -6; i <= 6; i++) s += `<path d="M ${540 + i * 130} 1470 L ${540 + i * 330} 1990" stroke="#C9B48A" stroke-width="5"/>`;
  for (const y of [1530, 1620, 1760]) s += `<path d="M -60 ${y} L 1140 ${y}" stroke="#C9B48A" stroke-width="5"/>`;
  s += `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // zuilen
  const zuil = x => `<rect x="${x - 46}" y="700" width="92" height="770" fill="#F4EEDF" ${o(6)}/>` + [-22, 0, 22].map(d => `<path d="M ${x + d} 716 L ${x + d} 1454" stroke="#D9D2C4" stroke-width="7"/>`).join('') +
    `<rect x="${x - 62}" y="660" width="124" height="44" rx="8" fill="#F4EEDF" ${o(6)}/><rect x="${x - 70}" y="1440" width="140" height="40" rx="6" fill="#F4EEDF" ${o(6)}/>`;
  s += zuil(44) + zuil(1036);
  // perkamentrol
  s += `<rect x="150" y="682" width="796" height="336" rx="8" fill="#000" opacity="0.18"/>`;
  s += `<rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" fill="#F3E4BC" ${o(5)}/>`;
  s += [118, 918].map(x => `<rect x="${x}" y="652" width="44" height="366" rx="22" fill="#E2CD98" ${o(6)}/><ellipse cx="${x + 22}" cy="660" rx="15" ry="6" fill="#C9B078"/>`).join('');
  s += `<path d="M 190 716 L 300 716 M 780 964 L 890 964" stroke="#D9C692" stroke-width="6" stroke-linecap="round"/>`;
  return s;
}

// ------------------------------------------------------------------ atelier: een kleermakerij uit de 19e eeuw, met een vel patroonpapier
function atelier() {
  let s = `<rect x="-60" y="-60" width="1200" height="1530" fill="#A9C3A0"/>`;
  for (let x = -60; x < 1140; x += 100) s += `<rect x="${x}" y="-60" width="34" height="1300" fill="#9DB894"/>`;
  s += `<rect x="-60" y="1210" width="1200" height="260" fill="#B07A4A"/><path d="M -60 1210 L 1140 1210" ${o(6)}/>`;
  for (let x = -10; x < 1140; x += 150) s += `<rect x="${x}" y="1244" width="110" height="190" rx="6" fill="none" stroke="#96643A" stroke-width="6"/>`;
  s += houtVloer('#C9A26B', '#AD8650');
  // rail met knijpers en een vel patroonpapier
  s += `<rect x="104" y="628" width="872" height="26" rx="10" fill="#8A5A34" ${o(6)}/>`;
  s += `<rect x="150" y="684" width="800" height="330" fill="#000" opacity="0.18"/>`;
  s += `<rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" fill="#FBF6EA" ${o(5)}/>`;
  s += [230, 540, 850].map(x => `<rect x="${x - 15}" y="640" width="30" height="52" rx="6" fill="#E8962E" ${o(4)}/><circle cx="${x}" cy="654" r="5" fill="${I}"/>`).join('');
  s += `<path d="M 160 980 L 250 980 M 160 980 L 160 900" stroke="#D9D2C4" stroke-width="5" stroke-dasharray="14 10" fill="none"/><path d="M 920 690 L 830 690 M 920 690 L 920 770" stroke="#D9D2C4" stroke-width="5" stroke-dasharray="14 10" fill="none"/>`;
  // plank met rollen stof (rechts) en klosjes garen (links)
  s += `<rect x="946" y="1168" width="150" height="18" rx="4" fill="#6E4627" ${o(5)}/>`;
  s += [[984, '#3F5E8C'], [1040, '#35517B'], [1012, '#3F5E8C', 1]].map(([x, c, boven]) => `<circle cx="${x}" cy="${boven ? 1094 : 1140}" r="28" fill="${c}" ${o(5)}/><circle cx="${x}" cy="${boven ? 1094 : 1140}" r="8" fill="#FBF6EA" ${o(3)}/>`).join('');
  s += `<rect x="-16" y="1168" width="140" height="18" rx="4" fill="#6E4627" ${o(5)}/>`;
  s += [[20, '#D9432B'], [62, '#F2C230'], [104, '#2F7E86']].map(([x, c]) => `<rect x="${x - 16}" y="1118" width="32" height="50" rx="5" fill="${c}" ${o(4)}/><rect x="${x - 20}" y="1110" width="40" height="10" rx="3" fill="#F4EEDF" ${o(3)}/><rect x="${x - 20}" y="1162" width="40" height="10" rx="3" fill="#F4EEDF" ${o(3)}/>`).join('');
  // paspop links
  s += `<path d="M 46 1560 L 46 1470" ${o(9)}/><ellipse cx="46" cy="1566" rx="46" ry="12" fill="${I}"/>`;
  s += `<path d="M 6 1320 Q 46 1296 86 1320 L 96 1400 Q 80 1440 90 1474 L 2 1474 Q 12 1440 -4 1400 Z" fill="#F4EEDF" ${o(6)}/><rect x="34" y="1290" width="24" height="26" rx="6" fill="#8A5A34" ${o(5)}/>`;
  s += `<path d="M 46 1326 L 46 1470" stroke="#D9D2C4" stroke-width="5" stroke-dasharray="12 9"/>`;
  // krat met gevouwen broeken rechts
  s += [0, 1, 2].map(i => `<rect x="${972 + (i % 2) * 8}" y="${1482 - i * 26}" width="104" height="26" rx="6" fill="${i === 1 ? '#35517B' : '#3F5E8C'}" ${o(5)}/>`).join('');
  s += `<path d="M 956 1508 L 1096 1508 L 1086 1592 L 966 1592 Z" fill="#8A5A34" ${o(6)}/><path d="M 962 1548 L 1090 1548" stroke="#6E4627" stroke-width="6"/>`;
  return s;
}

// ------------------------------------------------------------------ baan: een tennisbaan op gras, met een scorebord
function baan() {
  let s = `<rect x="-60" y="-60" width="1200" height="1200" fill="#BFE3F0"/>`;
  s += [[190, 520, 1], [880, 470, 0.8]].map(([x, y, k]) => `<g fill="#FFFFFF" opacity="0.9"><ellipse cx="${x}" cy="${y}" rx="${90 * k}" ry="${30 * k}"/><ellipse cx="${x - 40 * k}" cy="${y - 22 * k}" rx="${46 * k}" ry="${28 * k}"/><ellipse cx="${x + 30 * k}" cy="${y - 26 * k}" rx="${54 * k}" ry="${32 * k}"/></g>`).join('');
  // heg achter de baan
  s += `<path d="M -60 1100 Q 60 1060 180 1096 Q 300 1056 420 1094 Q 540 1058 660 1094 Q 780 1056 900 1096 Q 1020 1060 1140 1100 L 1140 1470 L -60 1470 Z" fill="#2F6B4F" ${o(6)}/>`;
  for (let x = -20; x < 1140; x += 96) s += `<path d="M ${x} 1180 q 18 -22 36 0 M ${x + 46} 1300 q 18 -22 36 0" fill="none" stroke="#255A41" stroke-width="6" stroke-linecap="round"/>`;
  // gras met maaibanen en lijnen
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#5FA85B"/>`;
  for (let i = -4; i < 4; i += 2) s += `<path d="M ${540 + i * 100} 1470 L ${540 + (i + 1) * 100} 1470 L ${540 + (i + 1) * 300} 1990 L ${540 + i * 300} 1990 Z" fill="#57A054"/>`;
  s += `<path d="M -60 1760 L 1140 1760 M 540 1470 L 540 1760" stroke="#F4F1E6" stroke-width="12" fill="none"/><path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // net
  s += `<rect x="-60" y="1352" width="1200" height="118" fill="#16161A" opacity="0.28"/>`;
  for (let x = -40; x < 1140; x += 44) s += `<path d="M ${x} 1352 L ${x} 1470" stroke="#16161A" stroke-width="3" opacity="0.35"/>`;
  for (const y of [1392, 1430]) s += `<path d="M -60 ${y} L 1140 ${y}" stroke="#16161A" stroke-width="3" opacity="0.35"/>`;
  s += `<rect x="-60" y="1338" width="1200" height="20" fill="#F4F1E6" ${o(5)}/>`;
  // scorebord op palen
  s += [250, 830].map(x => `<rect x="${x - 12}" y="1016" width="24" height="110" fill="#8A5A34" ${o(5)}/>`).join('');
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#F4EEDF" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#1F4D3A" ${o(4)}/>`;
  s += [[152, 660], [928, 660], [152, 1010], [928, 1010]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${I}"/>`).join('');
  // scheidsrechtersstoel links
  s += `<path d="M 8 1590 L 30 1290 M 96 1590 L 74 1290 M 16 1490 L 88 1490 M 22 1400 L 82 1400" fill="none" ${o(8)}/><rect x="14" y="1250" width="76" height="46" rx="6" fill="#F4EEDF" ${o(6)}/><rect x="14" y="1190" width="76" height="60" rx="6" fill="#D9432B" ${o(6)}/>`;
  // bankje rechts met handdoek
  s += `<rect x="960" y="1520" width="130" height="18" rx="5" fill="#8A5A34" ${o(5)}/><path d="M 976 1538 L 976 1590 M 1074 1538 L 1074 1590" ${o(8)}/><path d="M 1010 1520 L 1060 1520 L 1060 1566 Q 1035 1574 1010 1566 Z" fill="#F4EEDF" ${o(5)}/><path d="M 1010 1540 L 1060 1540" stroke="#2F7E86" stroke-width="6"/>`;
  return s;
}

// ------------------------------------------------------------------ straat: een straat in de vroege ochtend, met een bushalte en een reclamebord
function straat() {
  let s = `<defs><linearGradient id="ochtend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D3E8"/><stop offset="1" stop-color="#F8D9A8"/></linearGradient></defs>`;
  s += `<rect x="-60" y="-60" width="1200" height="1300" fill="url(#ochtend)"/><circle cx="930" cy="1120" r="110" fill="#FFE7A8" opacity="0.9"/>`;
  // huizen achter de stoep
  for (const [x, w, h, c] of [[-60, 230, 300, '#D98E6A'], [170, 190, 380, '#C7B08A'], [360, 250, 250, '#9DB894'], [610, 210, 330, '#D9A85C'], [820, 320, 280, '#B9897A']]) {
    s += `<rect x="${x}" y="${1190 - h}" width="${w}" height="${h}" fill="${c}" ${o(5)}/><rect x="${x}" y="${1190 - h}" width="${w}" height="22" fill="#000" opacity="0.12"/>`;
    for (let yy = 1190 - h + 50; yy < 1150; yy += 80) for (let xx = x + 28; xx < x + w - 50; xx += 70) s += `<rect x="${xx}" y="${yy}" width="34" height="42" rx="4" fill="#FFF3C4" opacity="0.85" ${o(3)}/>`;
  }
  // stoep, weg en stoeprand
  s += `<rect x="-60" y="1190" width="1200" height="64" fill="#D9D2C4"/><path d="M -60 1190 L 1140 1190" ${o(5)}/>`;
  s += `<rect x="-60" y="1254" width="1200" height="190" fill="#5B5E66"/><path d="M -60 1254 L 1140 1254" ${o(5)}/>`;
  for (let x = -40; x < 1140; x += 140) s += `<rect x="${x}" y="1342" width="80" height="12" rx="4" fill="#F4F1E6" opacity="0.85"/>`;
  s += `<rect x="-60" y="1444" width="1200" height="26" fill="#B9B6AA" ${o(5)}/>`;
  // voorste stoep waar het duo staat
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#E4DDCF"/>`;
  for (let i = -6; i <= 6; i++) s += `<path d="M ${540 + i * 130} 1470 L ${540 + i * 330} 1990" stroke="#CFC6B4" stroke-width="5"/>`;
  for (const y of [1540, 1630, 1770]) s += `<path d="M -60 ${y} L 1140 ${y}" stroke="#CFC6B4" stroke-width="5"/>`;
  s += `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // reclamebord op palen
  s += [250, 830].map(x => `<rect x="${x - 12}" y="1016" width="24" height="180" fill="#6E4627" ${o(5)}/>`).join('');
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#F4EEDF" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#FBF6EA" ${o(4)}/>`;
  // bushalte rechts
  s += `<path d="M 1040 1600 L 1040 1250" ${o(10)}/><ellipse cx="1040" cy="1604" rx="40" ry="10" fill="${I}"/>`;
  s += `<rect x="984" y="1166" width="112" height="100" rx="12" fill="#2F7E86" ${o(6)}/><text x="1040" y="1232" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="40" fill="#FFFFFF">BUS</text>`;
  // brandkraan links
  s += `<rect x="30" y="1500" width="56" height="96" rx="10" fill="#D9432B" ${o(6)}/><rect x="20" y="1520" width="76" height="18" rx="6" fill="#D9432B" ${o(5)}/><path d="M 30 1500 Q 58 1462 86 1500 Z" fill="#D9432B" ${o(5)}/>`;
  return s;
}

const DECORS = { kamer, klas, rome, atelier, baan, straat };
// kleur voor tekst en tekeningen op het vlak
const INKT = { kamer: '#16161A', klas: '#F4F1E6', rome: '#16161A', atelier: '#16161A', baan: '#F4F1E6', straat: '#16161A' };
const svg = naam => { if (!DECORS[naam]) throw new Error('onbekend decor ' + naam);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2040" viewBox="-60 -60 1200 2040">${DECORS[naam]()}</svg>`; };

module.exports = { svg, VLAK, INKT, NAMEN: Object.keys(DECORS) };
