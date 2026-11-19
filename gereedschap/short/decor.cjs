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

// ------------------------------------------------------------------ green: een golfbaan met heuvels, een vlag en een houten bord
function green() {
  let s = `<rect x="-60" y="-60" width="1200" height="1300" fill="#BFE3F0"/>`;
  s += [[230, 470, 1], [860, 540, 0.85]].map(([x, y, k]) => `<g fill="#FFFFFF" opacity="0.9"><ellipse cx="${x}" cy="${y}" rx="${90 * k}" ry="${30 * k}"/><ellipse cx="${x - 40 * k}" cy="${y - 22 * k}" rx="${46 * k}" ry="${28 * k}"/><ellipse cx="${x + 30 * k}" cy="${y - 26 * k}" rx="${54 * k}" ry="${32 * k}"/></g>`).join('');
  // heuvels in de verte
  s += `<path d="M -60 1200 Q 160 1060 380 1160 Q 600 1040 820 1150 Q 980 1080 1140 1140 L 1140 1480 L -60 1480 Z" fill="#7DB86A" ${o(5)}/>`;
  s += `<path d="M -60 1300 Q 240 1220 520 1290 Q 800 1230 1140 1300 L 1140 1480 L -60 1480 Z" fill="#69A85A" ${o(5)}/>`;
  // bomen
  for (const [x, y, k] of [[60, 1150, 1], [990, 1130, 0.9], [1080, 1170, 0.7]]) s += `<rect x="${x - 8 * k}" y="${y}" width="${16 * k}" height="${70 * k}" fill="#8A5A34" ${o(4)}/><circle cx="${x}" cy="${y - 20 * k}" r="${48 * k}" fill="#3F8A4F" ${o(5)}/>`;
  // zandbak
  s += `<ellipse cx="900" cy="1420" rx="150" ry="34" fill="#EAD8A4" ${o(5)}/>`;
  // de green met de vlag
  s += `<ellipse cx="200" cy="1440" rx="210" ry="44" fill="#8FD17A" ${o(5)}/><ellipse cx="230" cy="1442" rx="22" ry="7" fill="${I}"/>`;
  s += `<path d="M 230 1442 L 230 1250" ${o(6)}/><path d="M 233 1252 L 312 1276 L 233 1300 Z" fill="#D9432B" ${o(5)}/>`;
  // voorgrond: fairway met maaibanen
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#5FA85B"/>`;
  for (let i = -4; i < 4; i += 2) s += `<path d="M ${540 + i * 100} 1470 L ${540 + (i + 1) * 100} 1470 L ${540 + (i + 1) * 300} 1990 L ${540 + i * 300} 1990 Z" fill="#57A054"/>`;
  s += `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // houten bord op palen
  s += [250, 830].map(x => `<rect x="${x - 12}" y="1016" width="24" height="200" fill="#6E4627" ${o(5)}/>`).join('');
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#8A5A34" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#FBF6EA" ${o(4)}/>`;
  s += [[152, 660], [928, 660], [152, 1010], [928, 1010]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${I}"/>`).join('');
  // tas met clubs rechts
  s += `<path d="M 1012 1300 L 1000 1180 M 1040 1300 L 1046 1170 M 1066 1300 L 1086 1186" ${o(6)}/><path d="M 990 1176 l 22 -8 M 1040 1166 l 20 0 M 1080 1182 l 22 6" ${o(10)}/>`;
  s += `<rect x="990" y="1290" width="96" height="300" rx="22" fill="#2F7E86" ${o(6)}/><path d="M 990 1360 L 1086 1360" stroke="#F4F1E6" stroke-width="8"/>`;
  return s;
}

// ------------------------------------------------------------------ haven: kade met zee, een zeilbootje en een vuurtoren (YS46)
function haven() {
  let s = `<rect x="-60" y="-60" width="1200" height="1300" fill="#CDE8F2"/>`;
  s += [[250, 460, 1], [880, 520, 0.8]].map(([x, y, k]) => `<g fill="#FFFFFF" opacity="0.9"><ellipse cx="${x}" cy="${y}" rx="${90 * k}" ry="${30 * k}"/><ellipse cx="${x - 40 * k}" cy="${y - 22 * k}" rx="${46 * k}" ry="${28 * k}"/><ellipse cx="${x + 30 * k}" cy="${y - 26 * k}" rx="${54 * k}" ry="${32 * k}"/></g>`).join('');
  // meeuwen
  s += [[180, 600], [240, 570], [900, 640]].map(([x, y]) => `<path d="M ${x - 18} ${y} q 9 -12 18 0 q 9 -12 18 0" fill="none" ${o(4)}/>`).join('');
  // zee tot aan de horizon
  s += `<rect x="-60" y="1160" width="1200" height="330" fill="#3E8FB0"/><path d="M -60 1160 L 1140 1160" ${o(5)}/>`;
  for (const [y, d] of [[1210, 0], [1270, 60], [1340, 20], [1410, 90]]) for (let x = -60 + d; x < 1140; x += 180) s += `<path d="M ${x} ${y} q 20 -14 40 0 q 20 -14 40 0" fill="none" stroke="#DDF1F7" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`;
  // vuurtoren links in de verte
  s += `<path d="M 40 1170 L 52 1040 L 88 1040 L 100 1170 Z" fill="#FFFFFF" ${o(5)}/><path d="M 46 1110 L 94 1110 L 92 1080 L 48 1080 Z" fill="#D9432B"/><rect x="50" y="1010" width="40" height="30" fill="#F2C230" ${o(5)}/><path d="M 44 1010 L 70 986 L 96 1010 Z" fill="#D9432B" ${o(5)}/>`;
  // zeilbootje rechts in de verte
  s += `<path d="M 930 1190 L 1060 1190 L 1040 1216 L 950 1216 Z" fill="#8A5A34" ${o(5)}/><path d="M 995 1188 L 995 1060" ${o(5)}/><path d="M 999 1066 L 1052 1180 L 999 1180 Z" fill="#FFFFFF" ${o(4)}/><path d="M 991 1080 L 950 1180 L 991 1180 Z" fill="#F4F1E6" ${o(4)}/>`;
  // kade: houten planken met meerpalen
  s += houtVloer('#B98A5A', '#8A5A34');
  s += [70, 1010].map(x => `<rect x="${x - 26}" y="1400" width="52" height="110" rx="10" fill="#6E4627" ${o(6)}/><rect x="${x - 32}" y="1392" width="64" height="20" rx="8" fill="#16161A"/>`).join('');
  s += `<path d="M 96 1440 Q 160 1470 220 1450" fill="none" stroke="#D9B98A" stroke-width="10" stroke-linecap="round"/>`;
  // houten bord op palen
  s += [250, 830].map(x => `<rect x="${x - 12}" y="1016" width="24" height="200" fill="#6E4627" ${o(5)}/>`).join('');
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#2F5E86" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#FBF6EA" ${o(4)}/>`;
  s += [[152, 660], [928, 660], [152, 1010], [928, 1010]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#F4F1E6"/>`).join('');
  // reddingsboei aan het bord
  s += `<circle cx="1010" cy="900" r="52" fill="none" stroke="#D9432B" stroke-width="26"/><circle cx="1010" cy="900" r="52" fill="none" stroke="#FFFFFF" stroke-width="26" stroke-dasharray="20 62"/><circle cx="1010" cy="900" r="66" fill="none" ${o(4)}/><circle cx="1010" cy="900" r="38" fill="none" ${o(4)}/>`;
  return s;
}

// ================================================================== Waaromdorp (do 19 nov 2026)
// Nieuwe plekken voor de wereld van kanaal 1 (Andries do 19 nov 2026 ±20:16: "waaromdorp met museum en tijdreizen").
// Geen dorpsnaam in beeld: die kiest Andries eerst (en we zoeken na of hij nog niet bestaat).
const steen = (y0, kleur, voeg) => {
  let s = `<rect x="-60" y="${y0}" width="1200" height="${1980 - y0}" fill="${kleur}"/>`;
  for (let r = 0, y = y0 + 6; y < 1990; r++, y += 26 + r * 6) {
    const h = 22 + r * 6, w = 60 + r * 14;
    for (let x = -60 - (r % 2) * w / 2; x < 1140; x += w) s += `<rect x="${x + 4}" y="${y}" width="${w - 8}" height="${h - 4}" rx="${6 + r}" fill="${voeg}" opacity="0.35"/>`;
  }
  return s + `<path d="M -60 ${y0} L 1140 ${y0}" ${o()}/>`;
};

// ------------------------------------------------------------------ plein: het dorpsplein met de klokkentoren
function plein() {
  let s = `<defs><linearGradient id="avondlucht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FC9E6"/><stop offset="1" stop-color="#FCE3B0"/></linearGradient></defs>`;
  s += `<rect x="-60" y="-60" width="1200" height="1600" fill="url(#avondlucht)"/>`;
  s += [[180, 300, 1], [900, 380, 0.8]].map(([x, y, k]) => `<g fill="#FFFFFF" opacity="0.85"><ellipse cx="${x}" cy="${y}" rx="${90 * k}" ry="${28 * k}"/><ellipse cx="${x - 36 * k}" cy="${y - 20 * k}" rx="${44 * k}" ry="${26 * k}"/><ellipse cx="${x + 30 * k}" cy="${y - 24 * k}" rx="${52 * k}" ry="${30 * k}"/></g>`).join('');
  // klokkentoren in het midden, boven het bord uit
  s += `<rect x="420" y="250" width="240" height="1000" fill="#C98A5A" ${o()}/><rect x="420" y="250" width="40" height="1000" fill="#000" opacity="0.08"/>`;
  s += `<path d="M 400 254 L 540 110 L 680 254 Z" fill="#D9432B" ${o()}/><path d="M 540 110 L 540 64" ${o(6)}/><path d="M 540 70 L 590 84 L 540 98 Z" fill="#F2C230" ${o(4)}/>`;
  s += `<circle cx="540" cy="390" r="92" fill="#C9962E" ${o()}/><circle cx="540" cy="390" r="76" fill="#FFFDF7" ${o(5)}/>`;
  s += Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M ${540 + Math.sin(a) * 66} ${390 - Math.cos(a) * 66} L ${540 + Math.sin(a) * (i % 3 ? 58 : 50)} ${390 - Math.cos(a) * (i % 3 ? 58 : 50)}" stroke="${I}" stroke-width="${i % 3 ? 3 : 6}" stroke-linecap="round"/>`; }).join('');
  s += `<path d="M 540 390 L 540 336 M 540 390 L 578 404" stroke="${I}" stroke-width="9" stroke-linecap="round"/><circle cx="540" cy="390" r="8" fill="${I}"/>`;
  s += `<rect x="500" y="520" width="80" height="110" rx="40" fill="#3A2416" ${o(5)}/>`;
  // huizen links en rechts, met puntgevels
  const huis = (x, w, h, c, dak) => { let t = `<rect x="${x}" y="${1250 - h}" width="${w}" height="${h}" fill="${c}" ${o(6)}/>`;
    t += `<path d="M ${x - 10} ${1254 - h} L ${x + w / 2} ${1150 - h} L ${x + w + 10} ${1254 - h} Z" fill="${dak}" ${o(6)}/>`;
    for (let yy = 1250 - h + 40; yy < 1200; yy += 90) for (let xx = x + 24; xx < x + w - 50; xx += 64) t += `<rect x="${xx}" y="${yy}" width="36" height="48" rx="4" fill="#FFF3C4" ${o(4)}/><path d="M ${xx + 18} ${yy} L ${xx + 18} ${yy + 48}" stroke="${I}" stroke-width="3"/>`;
    return t; };
  s += huis(-60, 220, 520, '#9DB894', '#6E4627') + huis(160, 200, 420, '#E3B35C', '#A9311E') + huis(700, 200, 460, '#D98E6A', '#2F5E86') + huis(900, 240, 540, '#B7A6D6', '#6E4627');
  // straatlantaarns
  s += [90, 990].map(x => `<rect x="${x - 7}" y="1180" width="14" height="300" fill="${I}"/><rect x="${x - 26}" y="1130" width="52" height="60" rx="8" fill="#FFE7A8" ${o(5)}/><path d="M ${x - 32} 1130 L ${x} 1104 L ${x + 32} 1130 Z" fill="${I}"/>`).join('');
  // keien
  s += steen(1470, '#C9BFAF', '#8C8273');
  // mededelingenbord van het dorp
  s += [250, 830].map(x => `<rect x="${x - 12}" y="1016" width="24" height="200" fill="#6E4627" ${o(5)}/>`).join('');
  s += `<rect x="126" y="660" width="844" height="374" rx="14" fill="#000" opacity="0.2"/>`;
  s += `<rect x="118" y="648" width="844" height="374" rx="14" fill="#6E4627" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#FBF6EA" ${o(4)}/>`;
  s += `<path d="M 100 650 L 540 600 L 980 650" fill="#A9311E" ${o(6)}/>`;
  return s;
}

// ------------------------------------------------------------------ museum: het Museum van Gewone Dingen
function museum() {
  let s = `<rect x="-60" y="-60" width="1200" height="1600" fill="#E9DFC9"/>`;
  s += `<rect x="-60" y="-60" width="1200" height="180" fill="#D8CCB1"/><path d="M -60 120 L 1140 120" ${o(6)}/>`;
  // zuilen
  const zuil = x => `<rect x="${x - 44}" y="150" width="88" height="1300" fill="#F4EFE4" ${o(6)}/>` + [-24, 0, 24].map(d => `<path d="M ${x + d} 180 L ${x + d} 1420" stroke="#D6CCB8" stroke-width="6"/>`).join('') +
    `<rect x="${x - 60}" y="126" width="120" height="40" rx="6" fill="#F4EFE4" ${o(6)}/><rect x="${x - 60}" y="1420" width="120" height="50" rx="6" fill="#F4EFE4" ${o(6)}/>`;
  s += zuil(40) + zuil(1040);
  // banier boven het bord
  s += `<rect x="300" y="250" width="480" height="96" rx="8" fill="#A9311E" ${o()}/><text x="540" y="315" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="46" fill="#FFFDF7" letter-spacing="8">MUSEUM</text>`;
  s += `<path d="M 300 346 L 330 380 L 360 346 M 720 346 L 750 380 L 780 346" fill="#A9311E" ${o(5)}/>`;
  // vitrines met voorwerpen
  const vitrine = (x, inhoud) => `<rect x="${x - 70}" y="1250" width="140" height="220" fill="#7A4B2A" ${o(6)}/><rect x="${x - 80}" y="1236" width="160" height="22" rx="4" fill="#5A3519" ${o(5)}/>` +
    `<rect x="${x - 66}" y="1060" width="132" height="176" fill="#CFE3EA" fill-opacity="0.45" ${o(6)}/>${inhoud}<path d="M ${x - 46} 1080 L ${x - 46} 1150" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.7"/>`;
  s += vitrine(190, `<path d="M 170 1236 Q 150 1180 172 1140 L 208 1140 Q 230 1180 210 1236 Z" fill="#2F5E86" ${o(5)}/><path d="M 172 1140 Q 190 1120 208 1140" fill="none" ${o(5)}/>`);
  s += vitrine(890, `<rect x="850" y="1170" width="80" height="60" rx="8" fill="#16161A"/><path d="M 846 1160 Q 890 1120 934 1160" fill="none" stroke="#16161A" stroke-width="14" stroke-linecap="round"/><circle cx="890" cy="1200" r="18" fill="#F4F1E6" ${o(4)}/>`);
  // fluwelen koord
  s += [330, 750].map(x => `<rect x="${x - 8}" y="1330" width="16" height="140" fill="#C9962E" ${o(5)}/><circle cx="${x}" cy="1326" r="16" fill="#C9962E" ${o(5)}/>`).join('') + `<path d="M 330 1340 Q 540 1420 750 1340" fill="none" stroke="#A9311E" stroke-width="16" stroke-linecap="round"/>`;
  // dambordvloer van marmer
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#F4EFE4"/>`;
  for (let r = 0; r < 6; r++) for (let c = -6; c < 7; c++) if ((r + c) % 2 === 0) {
    const y1 = 1470 + r * r * 14 + r * 40, y2 = 1470 + (r + 1) * (r + 1) * 14 + (r + 1) * 40, k1 = 1 + r * 0.45, k2 = 1 + (r + 1) * 0.45;
    s += `<path d="M ${540 + c * 90 * k1} ${y1} L ${540 + (c + 1) * 90 * k1} ${y1} L ${540 + (c + 1) * 90 * k2} ${y2} L ${540 + c * 90 * k2} ${y2} Z" fill="#3E4A5C" opacity="0.85"/>`;
  }
  s += `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // het bord: een groot schilderij in een gouden lijst
  s += `<rect x="126" y="660" width="844" height="374" rx="10" fill="#000" opacity="0.2"/>`;
  s += `<rect x="112" y="642" width="856" height="386" rx="10" fill="#C9962E" ${o()}/><rect x="124" y="654" width="832" height="362" rx="6" fill="none" stroke="#F2D27A" stroke-width="6"/>`;
  s += `<rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="4" fill="#FBF6EA" ${o(4)}/>`;
  s += `<rect x="470" y="1040" width="140" height="34" rx="4" fill="#F4EFE4" ${o(4)}/><path d="M 490 1057 L 590 1057" stroke="#A8A196" stroke-width="5"/>`;
  return s;
}

// ------------------------------------------------------------------ tijdmachine: de kamer achter de wijzerplaat van de klokkentoren
function tijdmachine() {
  let s = `<rect x="-60" y="-60" width="1200" height="1600" fill="#2E2240"/>`;
  s += `<circle cx="540" cy="500" r="620" fill="#4A3566" opacity="0.6"/>`;
  // tandwielen aan de muur
  const wiel = (x, y, r, t, kleur) => { let p = '';
    for (let i = 0; i < t; i++) { const a = i * 2 * Math.PI / t; p += `<rect x="${-r * 0.16}" y="${-r - r * 0.2}" width="${r * 0.32}" height="${r * 0.36}" rx="4" fill="${kleur}" ${o(5)} transform="translate(${x} ${y}) rotate(${a * 180 / Math.PI})"/>`; }
    return p + `<circle cx="${x}" cy="${y}" r="${r}" fill="${kleur}" ${o(6)}/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#2E2240" ${o(5)}/><circle cx="${x}" cy="${y}" r="${r * 0.18}" fill="${kleur}" ${o(5)}/>`; };
  s += wiel(60, 300, 150, 14, '#C9962E') + wiel(1030, 420, 120, 12, '#B07A45') + wiel(200, 1250, 110, 10, '#B07A45') + wiel(930, 1180, 140, 14, '#C9962E');
  // koperen buizen
  s += `<path d="M -60 560 L 180 560 Q 220 560 220 600 L 220 640" fill="none" stroke="${I}" stroke-width="30"/><path d="M -60 560 L 180 560 Q 220 560 220 600 L 220 640" fill="none" stroke="#C97A3E" stroke-width="18"/>`;
  s += `<path d="M 1140 620 L 900 620 Q 860 620 860 660" fill="none" stroke="${I}" stroke-width="30"/><path d="M 1140 620 L 900 620 Q 860 620 860 660" fill="none" stroke="#C97A3E" stroke-width="18"/>`;
  // de wijzerplaat van de toren, van binnen gezien, met lichtstralen
  s += `<circle cx="540" cy="330" r="200" fill="#FCE3B0" opacity="0.18"/><circle cx="540" cy="330" r="150" fill="#3B2C52" ${o()}/>`;
  s += Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M ${540 + Math.sin(a) * 120} ${330 - Math.cos(a) * 120} L ${540 + Math.sin(a) * 140} ${330 - Math.cos(a) * 140}" stroke="#F2C230" stroke-width="8" stroke-linecap="round"/>`; }).join('');
  s += `<path d="M 540 330 L 540 220 M 540 330 L 470 380" stroke="#F2C230" stroke-width="12" stroke-linecap="round"/><circle cx="540" cy="330" r="14" fill="#F2C230" ${o(4)}/>`;
  // metalen vloer met klinknagels
  s += `<rect x="-60" y="1470" width="1200" height="520" fill="#6B6478"/>`;
  for (let x = -60; x < 1140; x += 200) s += `<path d="M ${x} 1470 L ${x - 120} 1990" stroke="#4E4858" stroke-width="5"/>`;
  for (const y of [1560, 1700, 1880]) { s += `<path d="M -60 ${y} L 1140 ${y}" stroke="#4E4858" stroke-width="5"/>`; for (let x = -40; x < 1140; x += 100) s += `<circle cx="${x}" cy="${y - 14}" r="5" fill="#8C8598"/>`; }
  s += `<path d="M -60 1470 L 1140 1470" ${o()}/>`;
  // hendel
  s += `<rect x="1000" y="1380" width="90" height="90" rx="10" fill="#4E4858" ${o(6)}/><path d="M 1045 1400 L 1010 1290" stroke="${I}" stroke-width="18" stroke-linecap="round"/><path d="M 1045 1400 L 1010 1290" stroke="#C4BFB5" stroke-width="8" stroke-linecap="round"/><circle cx="1008" cy="1282" r="22" fill="#D9432B" ${o(5)}/>`;
  // het bord: een scherm met een koperen rand (bestemming en jaartal)
  s += `<rect x="126" y="660" width="844" height="374" rx="30" fill="#000" opacity="0.3"/>`;
  s += `<rect x="112" y="642" width="856" height="386" rx="30" fill="#C9962E" ${o()}/>` + [[140, 670], [940, 670], [140, 1000], [940, 1000]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#F2D27A" ${o(3)}/>`).join('');
  s += `<rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="16" fill="#1E2A2E" ${o(4)}/>`;
  s += Array.from({ length: 10 }, (_, i) => `<path d="M ${VLAK.x + 10} ${VLAK.y + 20 + i * 32} L ${VLAK.x + VLAK.w - 10} ${VLAK.y + 20 + i * 32}" stroke="#8FE3C9" stroke-width="2" opacity="0.08"/>`).join('');
  return s;
}

// ------------------------------------------------------------------ bureau: het recherchebureau (volwassener: gedempte kleuren, lamplicht)
// Andries do 19 nov 2026 ±20:35: "Rechercheurs (Recommended)". Het vlak is een prikbord met foto's en rode touwtjes.
function bureau() {
  let s = `<defs><radialGradient id="lamp" cx="0.5" cy="0.35" r="0.6"><stop offset="0" stop-color="#F6D9A0" stop-opacity="0.35"/><stop offset="1" stop-color="#F6D9A0" stop-opacity="0"/></radialGradient></defs>`;
  s += `<rect x="-60" y="-60" width="1200" height="1600" fill="#2F4A4C"/>`;
  s += Array.from({ length: 14 }, (_, i) => `<rect x="${-60 + i * 90}" y="-60" width="44" height="1600" fill="#000" opacity="0.05"/>`).join('');
  // raam met jaloezieën en lichtstrepen
  s += `<rect x="640" y="140" width="380" height="420" fill="#1C2B33" ${o()}/>` + Array.from({ length: 12 }, (_, i) => `<rect x="650" y="${152 + i * 34}" width="360" height="16" fill="#D9C89A" opacity="0.85"/>`).join('');
  s += `<path d="M 640 560 L 300 1470 L 700 1470 L 1020 560 Z" fill="#F6D9A0" opacity="0.06"/>`;
  // dossierkasten links
  s += [0, 1].map(k => `<rect x="${-40 + k * 130}" y="1060" width="120" height="410" fill="#5D6B5E" ${o(6)}/>` + [1100, 1230, 1360].map(y => `<rect x="${-28 + k * 130}" y="${y}" width="96" height="110" rx="4" fill="#6E7D6F" ${o(4)}/><rect x="${2 + k * 130}" y="${y + 20}" width="36" height="12" rx="4" fill="#C9C4BA" ${o(3)}/>`).join('')).join('');
  // bureau met lamp rechts
  s += `<rect x="760" y="1250" width="380" height="40" fill="#5A3B26" ${o(6)}/><rect x="780" y="1290" width="30" height="180" fill="#4A3020" ${o(5)}/><rect x="1080" y="1290" width="30" height="180" fill="#4A3020" ${o(5)}/>`;
  s += `<path d="M 900 1250 L 900 1150 L 960 1100" fill="none" ${o(8)}/><path d="M 930 1080 L 1010 1060 L 1000 1130 Z" fill="#2F5E3A" ${o(5)}/><ellipse cx="960" cy="1250" rx="40" ry="10" fill="#16161A"/>`;
  s += `<rect x="820" y="1222" width="70" height="28" rx="3" fill="#D9B970" ${o(4)}/><rect x="1040" y="1210" width="34" height="40" rx="4" fill="#E9E4DA" ${o(4)}/>`;
  s += `<rect x="-60" y="-60" width="1200" height="1600" fill="url(#lamp)"/>`;
  // vloer: donker hout
  s += houtVloer('#5A3B26', '#432B1B');
  // prikbord (het vlak) met foto's, kaartjes en rode touwtjes
  s += `<rect x="126" y="660" width="844" height="374" rx="8" fill="#000" opacity="0.3"/>`;
  s += `<rect x="112" y="642" width="856" height="386" rx="8" fill="#6E4627" ${o()}/><rect x="${VLAK.x}" y="${VLAK.y}" width="${VLAK.w}" height="${VLAK.h}" rx="2" fill="#C8A577" ${o(4)}/>`;
  s += Array.from({ length: 40 }, (_, i) => `<circle cx="${VLAK.x + 20 + (i * 97) % (VLAK.w - 40)}" cy="${VLAK.y + 20 + (i * 61) % (VLAK.h - 40)}" r="2.5" fill="#A88457"/>`).join('');
  // kleine papiertjes in de hoeken, zodat het midden vrij blijft voor het onderwerp
  const kaartje = (x, y, r, c = '#F4EFE4') => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 34}" y="${y - 24}" width="68" height="48" fill="${c}" ${o(3)}/><path d="M ${x - 22} ${y - 6} L ${x + 22} ${y - 6} M ${x - 22} ${y + 6} L ${x + 10} ${y + 6}" stroke="#A8A196" stroke-width="3"/></g><circle cx="${x}" cy="${y - 20}" r="6" fill="#D9432B" ${o(2)}/>`;
  s += kaartje(190, 712, -6) + kaartje(890, 712, 5) + kaartje(196, 958, 4, '#E8D8B8') + kaartje(884, 956, -5, '#E8D8B8');
  s += `<path d="M 190 692 L 890 692 M 196 938 L 884 936" fill="none" stroke="#B3261E" stroke-width="3" opacity="0.8"/>`;
  s += `<rect x="440" y="1040" width="200" height="34" rx="4" fill="#E9E4DA" ${o(4)}/><text x="540" y="1064" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="20" fill="#16161A" letter-spacing="3">CASE FILE</text>`;
  return s;
}

const DECORS = { kamer, klas, rome, atelier, baan, straat, green, haven, plein, museum, tijdmachine, bureau };
// kleur voor tekst en tekeningen op het vlak
const INKT = { kamer: '#16161A', klas: '#F4F1E6', rome: '#16161A', atelier: '#16161A', baan: '#F4F1E6', straat: '#16161A', green: '#16161A', haven: '#16161A', plein: '#16161A', museum: '#16161A', tijdmachine: '#8FE3C9', bureau: '#16161A' };
const svg = naam => { if (!DECORS[naam]) throw new Error('onbekend decor ' + naam);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2040" viewBox="-60 -60 1200 2040">${DECORS[naam]()}</svg>`; };

module.exports = { svg, VLAK, INKT, NAMEN: Object.keys(DECORS) };
