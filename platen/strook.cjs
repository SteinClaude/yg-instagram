// Legt een strook van een pagina vast rond een stuk tekst.
// node instagram/strook.cjs <url> <uit.jpg> "<tekst om te zoeken>" [breedte] [hoogte] [verschuiving]
const { spawn, execSync } = require('child_process'); const fs = require('fs'); const http = require('http');
const [url, uit, zoek, wArg, hArg, dyArg] = process.argv.slice(2);
const W = +wArg || 1440, H = +hArg || 900, DY = +dyArg || 0;
const port = 9500 + Math.floor(Math.random() * 40); const prof = require('os').tmpdir() + '/edge-strook-' + port;
try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
const proc = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`, '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const get = u => new Promise((r, j) => http.get(u, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => r(JSON.parse(d))); }).on('error', j));
const sleep = m => new Promise(r => setTimeout(r, m));
(async () => {
  let t; for (let i = 0; i < 60; i++) { try { t = await get(`http://127.0.0.1:${port}/json`); break; } catch { await sleep(250); } }
  const ws = new WebSocket(t.find(x => x.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const P = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) { P[m.id](m); delete P[m.id]; } };
  const send = (m, p = {}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  const ev = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result.result.value;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send("Page.navigate", { url });
  await sleep(2500);
  const hoog = await ev('document.documentElement.scrollHeight');
  for (let y = 0; y < hoog; y += Math.round(H * 0.8)) { await ev(`window.scrollTo(0,${y})`); await sleep(300); }
  await ev('window.scrollTo(0,0)'); await sleep(700);
  await ev("(function(){document.querySelectorAll('div,section,aside').forEach(function(e){var s=getComputedStyle(e);if((s.position==='fixed'||s.position==='sticky')&&/cookie/i.test(e.textContent||'')&&e.textContent.length<600)e.remove();});return 1})()");
  const zk = JSON.stringify(zoek);
  const top = await ev(`(function(){var n=${zk}.toLowerCase();var el=[...document.querySelectorAll('h1,h2,h3,h4,p,span,div,table')].filter(function(e){return (e.textContent||'').toLowerCase().trim().indexOf(n)===0&&e.getBoundingClientRect().height<900;})[0];if(!el)return -1;return Math.round(el.getBoundingClientRect().top+window.scrollY);})()`);
  if (top < 0) { console.error('tekst niet gevonden:', zoek); process.exit(2); }
  const y0 = Math.max(0, top + DY);
  const sh = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, captureBeyondViewport: true, clip: { x: 0, y: y0, width: W, height: H, scale: 1 } });
  fs.writeFileSync(uit, Buffer.from(sh.result.data, 'base64'));
  console.log(uit, '| strook vanaf y =', y0, '|', Math.round(fs.statSync(uit).size / 1024), 'kB');
  ws.close(); try { execSync('taskkill /PID ' + proc.pid + ' /T /F', { stdio: 'ignore' }); } catch {}
  await sleep(400); try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
