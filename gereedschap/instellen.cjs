// Eenmalig: ruilt je korte sleutel om voor een lange (60 dagen) en zoekt het
// nummer van je Instagram-account op. Draaien op je eigen computer.
//
//   node gereedschap/instellen.cjs <APP_ID> <APP_GEHEIM> <KORTE_SLEUTEL>
//
// Waar je die drie vandaan haalt staat in LEESMIJ.md, stap 2 en 3.
const VERSIE = process.env.GRAPH_VERSIE || 'v26.0';
const BASIS = `https://graph.facebook.com/${VERSIE}`;

const [appId, appGeheim, korteSleutel] = process.argv.slice(2);
if (!appId || !appGeheim || !korteSleutel) {
  console.error('Gebruik: node gereedschap/instellen.cjs <APP_ID> <APP_GEHEIM> <KORTE_SLEUTEL>');
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
  console.log('1. Korte sleutel omruilen voor een lange...');
  const lang = await api('/oauth/access_token', {
    grant_type: 'fb_exchange_token', client_id: appId,
    client_secret: appGeheim, fb_exchange_token: korteSleutel,
  });
  const sleutel = lang.access_token;
  const dagen = lang.expires_in ? Math.round(lang.expires_in / 86400) : null;
  console.log(`   gelukt, ${dagen ? dagen + ' dagen geldig' : 'zonder einddatum'}`);

  console.log('2. Je Facebook-pagina en Instagram-account opzoeken...');
  const paginas = await api('/me/accounts', {
    fields: 'name,instagram_business_account{id,username}', access_token: sleutel,
  });

  const metInstagram = (paginas.data || []).filter(p => p.instagram_business_account);
  if (!metInstagram.length) {
    console.error('\nGeen pagina met een gekoppeld Instagram-account gevonden.');
    console.error('Controleer of YG-Digital aan ygdigital.nl gekoppeld is, en of je bij het');
    console.error('aanmaken van de sleutel de pagina hebt aangevinkt.');
    process.exit(1);
  }

  console.log('');
  for (const p of metInstagram) {
    const ig = p.instagram_business_account;
    console.log(`   pagina "${p.name}"  →  Instagram @${ig.username}`);
    console.log('');
    console.log('   ---------------- zet deze twee in GitHub ----------------');
    console.log(`   IG_USER_ID   ${ig.id}`);
    console.log(`   IG_TOKEN     ${sleutel}`);
    console.log('   --------------------------------------------------------');
  }
  console.log('\nGitHub > je repo > Settings > Secrets and variables > Actions > New repository secret.');
  console.log('Deel deze sleutel met niemand: hij geeft toegang tot je account.');
})().catch(f => { console.error('\nMislukt: ' + f.message); process.exit(1); });
