// Instagram API met Instagram-login. Geen externe pakketten: Node 18+ heeft fetch
// ingebouwd, dus er is niets dat kan verouderen.
//
// Let op: dit praat met graph.instagram.com, niet met graph.facebook.com. Die eerste
// route loopt rechtstreeks naar je Instagram-account en heeft je Facebook-pagina niet
// nodig. Dat scheelt een hoop koppelwerk dat bij ons niet wilde lukken.
const VERSIE = process.env.GRAPH_VERSIE || 'v23.0';
const BASIS = `https://graph.instagram.com/${VERSIE}`;

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
  catch { throw new Error(`Instagram gaf geen leesbaar antwoord (status ${antwoord.status}) op ${pad}`); }
  if (gegevens.error) {
    const e = gegevens.error;
    throw new Error(`Instagram weigert ${pad}: ${e.message}` +
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

// Instagram haalt het beeld zelf op van het openbare adres; dat duurt even.
async function wachtTotKlaar(containerId, token, seconden = 90) {
  const eind = Date.now() + seconden * 1000;
  let laatste = '';
  while (Date.now() < eind) {
    const { status_code, status } = await api(`/${containerId}`, { fields: 'status_code,status', access_token: token });
    laatste = status || status_code;
    if (status_code === 'FINISHED') return true;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Instagram kon het beeld niet verwerken (${status_code}): ${status || 'geen toelichting'}`);
    }
    await wacht(3000);
  }
  throw new Error(`Instagram was na ${seconden} seconden nog niet klaar met het beeld (${laatste})`);
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
  const isVideo = /\.mp4(\?|$)/i.test(beeldUrl);
  const c = await maakContainer(igId, token, isVideo
    ? { video_url: beeldUrl, media_type: 'STORIES' }
    : { image_url: beeldUrl, media_type: 'STORIES' });
  await wachtTotKlaar(c, token, isVideo ? 300 : 90);
  return publiceer(igId, token, c);
}

// Een reel: staande video (MP4, H.264/AAC, 3 s tot 15 min). Instagram haalt hem
// op en zet hem om; dat duurt langer dan bij een foto, vandaar de ruimere wachttijd.
// share_to_feed zet hem ook in het raster van het profiel.
async function plaatsReel(igId, token, videoUrl, bijschrift) {
  const c = await maakContainer(igId, token, {
    media_type: 'REELS', video_url: videoUrl, caption: bijschrift, share_to_feed: 'true',
  });
  await wachtTotKlaar(c, token, 300);
  return publiceer(igId, token, c);
}

// --- controles ---------------------------------------------------------------

// Werkt de sleutel nog? Geeft de accountnaam terug, of gooit een leesbare fout.
// Wat er de laatste tijd echt op het account staat. Gebruiken we als extra slot:
// mocht het logboek een keer niet bewaard worden, dan plaatsen we niet nog eens
// hetzelfde. Verhalen zitten hier niet in; die vervallen toch na een dag.
async function recenteMedia(igId, token, aantal = 25) {
  const r = await api(`/${igId}/media`, { fields: 'id,caption,timestamp', limit: aantal, access_token: token });
  return r.data || [];
}

async function wieBenIk(igId, token) {
  const a = await api(`/${igId}`, { fields: 'id,username', access_token: token });
  return a.username;
}

async function ruimteOver(igId, token) {
  const { data } = await api(`/${igId}/content_publishing_limit`, { fields: 'quota_usage', access_token: token });
  const n = data && data[0] ? data[0].quota_usage : 0;
  return { gebruikt: n, limiet: 100 };
}

// Vernieuwt een lange sleutel. Geeft een NIEUWE sleutel terug; die moet je bewaren.
// Mag pas als de sleutel minstens 24 uur oud is.
async function vernieuwSleutel(token) {
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', token);
  const a = await (await fetch(url)).json();
  if (a.error) throw new Error(`${a.error.message} (code ${a.error.code})`);
  return { sleutel: a.access_token, dagen: Math.round((a.expires_in || 0) / 86400) };
}

module.exports = {
  VERSIE, api, plaatsFoto, plaatsCarrousel, plaatsVerhaal, plaatsReel,
  wieBenIk, ruimteOver, vernieuwSleutel, wacht, recenteMedia };
