// Elke twee maanden: vernieuwt de sleutel. Je krijgt hier een seintje over via
// een melding op GitHub, ruim voordat hij verloopt.
//
//   node gereedschap/vernieuw-token.cjs <APP_ID> <APP_GEHEIM> <HUIDIGE_SLEUTEL>
//
// Zet daarna de nieuwe sleutel bij Settings > Secrets > Actions > IG_TOKEN.
const VERSIE = process.env.GRAPH_VERSIE || 'v26.0';
const BASIS = `https://graph.facebook.com/${VERSIE}`;

const [appId, appGeheim, huidige] = process.argv.slice(2);
if (!appId || !appGeheim || !huidige) {
  console.error('Gebruik: node gereedschap/vernieuw-token.cjs <APP_ID> <APP_GEHEIM> <HUIDIGE_SLEUTEL>');
  process.exit(1);
}

async function api(pad, params) {
  const url = new URL(BASIS + pad);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const a = await (await fetch(url)).json();
  if (a.error) throw new Error(`${a.error.message} (code ${a.error.code})`);
  return a;
}

(async () => {
  const oud = await api('/debug_token', { input_token: huidige, access_token: huidige });
  if (oud.data && oud.data.expires_at) {
    const d = Math.round((oud.data.expires_at * 1000 - Date.now()) / 86400000);
    console.log(`Huidige sleutel: nog ${d} dagen geldig.`);
  }

  const nieuw = await api('/oauth/access_token', {
    grant_type: 'fb_exchange_token', client_id: appId,
    client_secret: appGeheim, fb_exchange_token: huidige,
  });
  const dagen = nieuw.expires_in ? Math.round(nieuw.expires_in / 86400) : null;

  console.log(`\nNieuwe sleutel, ${dagen ? dagen + ' dagen geldig' : 'zonder einddatum'}:\n`);
  console.log('   ' + nieuw.access_token);
  console.log('\nZet hem bij Settings > Secrets and variables > Actions > IG_TOKEN (Update).');
  console.log('De oude blijft nog werken tot hij vanzelf verloopt.');
})().catch(f => {
  console.error('\nMislukt: ' + f.message);
  console.error('Is de huidige sleutel al verlopen? Dan moet je stap 3 uit LEESMIJ.md opnieuw doen.');
  process.exit(1);
});
