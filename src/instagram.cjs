// Instagram Graph API, alleen wat wij nodig hebben. Geen externe pakketten:
// Node 18+ heeft fetch ingebouwd, dus er is niets dat kan verouderen.
const VERSIE = process.env.GRAPH_VERSIE || 'v26.0';
const BASIS = `https://graph.facebook.com/${VERSIE}`;

const wacht = ms => new Promise(r => setTimeout(r, ms));

// Meta stuurt fouten terug met status 200 of 400; beide netjes afvangen.
async function api(pad, params = {}, methode = 'GET') {
  const url = new URL(BASIS + pad);
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    (methode === 'GET' ? url.searchParams : body).set(k, String(v));
  }
  const antwoord = await fetch(url, methode === 'GET' ? {} : { method: 'POST', body });
  let gegevens;
  try { gegevens = await antwoord.json(); }
  catch { throw new Error(`Meta gaf geen leesbaar antwoord (status ${antwoord.status}) op ${pad}`); }
  if (gegevens.error) {
    const e = gegevens.error;
    throw new Error(`Meta weigert ${pad}: ${e.message}` +
      (e.error_user_msg ? ` — ${e.error_user_msg}` : '') +
      ` (code ${e.code}${e.error_subcode ? '/' + e.error_subcode : ''})`);
  }
  return gegevens;
}

// Een container is een klaargezet bericht dat nog niet geplaatst is.
async function maakContainer(igId, token, velden) {
  const { id } = await api(`/${igId}/media`, { ...velden, access_token: token }, 'POST');
  return id;
}

// Meta haalt het beeld zelf op; dat duurt even. Wachten tot hij klaar is.
async function wachtTotKlaar(containerId, token, seconden = 90) {
  const eind = Date.now() + seconden * 1000;
  let laatste = '';
  while (Date.now() < eind) {
    const { status_code, status } = await api(`/${containerId}`, { fields: 'status_code,status', access_token: token });
    laatste = status || status_code;
    if (status_code === 'FINISHED') return true;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Meta kon het beeld niet verwerken (${status_code}): ${status || 'geen toelichting'}`);
    }
    await wacht(3000);
  }
  throw new Error(`Meta was na ${seconden} seconden nog niet klaar met het beeld (${laatste})`);
}

async function publiceer(igId, token, containerId) {
  const { id } = await api(`/${igId}/media_publish`, { creation_id: containerId, access_token: token }, 'POST');
  return id;
}

// --- de drie soorten die wij plaatsen ---------------------------------------

async function plaatsFoto(igId, token, beeldUrl, bijschrift) {
  const c = await maakContainer(igId, token, { image_url: beeldUrl, caption: bijschrift });
  await wachtTotKlaar(c, token);
  return publiceer(igId, token, c);
}

async function plaatsCarrousel(igId, token, beeldUrls, bijschrift) {
  if (beeldUrls.length < 2 || beeldUrls.length > 10) {
    throw new Error(`Een carrousel heeft 2 tot 10 platen nodig, gekregen: ${beeldUrls.length}`);
  }
  const kinderen = [];
  for (const url of beeldUrls) {
    const c = await maakContainer(igId, token, { image_url: url, is_carousel_item: true });
    await wachtTotKlaar(c, token);
    kinderen.push(c);
  }
  const ouder = await maakContainer(igId, token, {
    media_type: 'CAROUSEL', children: kinderen.join(','), caption: bijschrift,
  });
  await wachtTotKlaar(ouder, token);
  return publiceer(igId, token, ouder);
}

async function plaatsVerhaal(igId, token, beeldUrl) {
  const c = await maakContainer(igId, token, { image_url: beeldUrl, media_type: 'STORIES' });
  await wachtTotKlaar(c, token);
  return publiceer(igId, token, c);
}

// --- controles ---------------------------------------------------------------

// Hoeveel dagen de sleutel nog meegaat. null = onbekend (bijv. een sleutel zonder einddatum).
async function dagenGeldig(token) {
  const { data } = await api('/debug_token', { input_token: token, access_token: token });
  if (!data) return null;
  if (!data.is_valid) throw new Error('De toegangssleutel is niet (meer) geldig.');
  if (!data.expires_at) return null;                       // 0 = verloopt niet
  return Math.round((data.expires_at * 1000 - Date.now()) / 86400000);
}

async function ruimteOver(igId, token) {
  const { data } = await api(`/${igId}/content_publishing_limit`, { access_token: token });
  const n = data && data[0] ? data[0].quota_usage : 0;
  return { gebruikt: n, limiet: 100 };
}

module.exports = {
  VERSIE, api, plaatsFoto, plaatsCarrousel, plaatsVerhaal,
  dagenGeldig, ruimteOver, wacht,
};
