// Kleine statische server om instagram/pagina.html te bekijken: node instagram/server.cjs
const http = require('http'), fs = require('fs'), path = require('path');
const WORTEL = __dirname, POORT = 8791;
const TYPEN = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer((req, res) => {
  const schoon = decodeURIComponent(req.url.split('?')[0]);
  const bestand = path.join(WORTEL, schoon === '/' ? 'pagina.html' : schoon);
  if (!bestand.startsWith(WORTEL)) { res.writeHead(403).end('nee'); return; }
  fs.readFile(bestand, (f, d) => {
    if (f) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('niet gevonden'); return; }
    res.writeHead(200, { 'content-type': TYPEN[path.extname(bestand)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(d);
  });
}).listen(POORT, () => console.log('http://localhost:' + POORT + '/'));
