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
// Bij video's vragen we minder vaak (Meta adviseert hooguit eens per minuut);
// een foto is meestal binnen tien seconden klaar, een reel duurt een paar minuten.
async function wachtTotKlaar(containerId, token, seconden = 90, interval = 3000) {
  const eind = Date.now() + seconden * 1000;
  let laatste = '';
  while (Date.now() < eind) {
    const { status_code, status } = await api(`/${containerId}`, { fields: 'status_code,status', access_token: token });
    laatste = status || status_code;
    if (status_code === 'FINISHED') return true;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Instagram kon het beeld niet verwerken (${status_code}): ${status || 'geen toelichting'}`);
    }
    await wacht(interval);
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

// alts: optioneel, per plaat een alternatieve tekst (alt_text, sinds maart 2025 per carrouselplaat, tot 1000 tekens).
// Weigert Instagram die, dan gaat de plaat zonder alt-tekst mee in plaats van dat het hele bericht mislukt.
async function plaatsCarrousel(igId, token, beeldUrls, bijschrift, alts = []) {
  if (beeldUrls.length < 2 || beeldUrls.length > 10) {
    throw new Error(`Een carrousel heeft 2 tot 10 platen nodig, gekregen: ${beeldUrls.length}`);
  }
  const kinderen = [];
  for (const [i, url] of beeldUrls.entries()) {
    const alt = alts[i] ? String(alts[i]).slice(0, 1000) : undefined;
    let c;
    try {
      c = await maakContainer(igId, token, { image_url: url, is_carousel_item: true, alt_text: alt });
      if (alt) console.log(`   plaat ${i + 1}: alt-tekst meegegeven`);
    } catch (fout) {
      if (!alt) throw fout;
      console.log(`   plaat ${i + 1}: alt-tekst niet geaccepteerd (${fout.message}); zonder alt-tekst opnieuw`);
      c = await maakContainer(igId, token, { image_url: url, is_carousel_item: true });
    }
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
  await wachtTotKlaar(c, token, isVideo ? 300 : 90, isVideo ? 10000 : 3000);
  return publiceer(igId, token, c);
}

// Een reel: staande video (MP4, H.264/AAC, 3 s tot 15 min). Instagram haalt hem
// op en zet hem om; dat duurt langer dan bij een foto, vandaar de ruimere wachttijd.
// share_to_feed zet hem ook in het raster van het profiel. thumb_offset kiest de
// omslag: op 4 seconden staat de kop volledig in beeld en de onderregel nog niet.
// Dat is met opzet — in het raster is een tegel zo'n 120 px breed en wordt die
// onderregel onleesbare ruis. Bij een reel met een clip is op 4 seconden ook het
// onderwerp nog herkenbaar; later in de clip is de camera al doorgelopen.
// gereedschap/reel.cjs haalt deze waarde hier op, zodat de poster in het
// dashboard en de omslag op het profiel niet uit elkaar kunnen lopen.
const OMSLAG_MS = 4000;

// Eigen omslag per reel (1 okt 2026). De vaste 4 seconden passen bij de reels uit
// gereedschap/reel.cjs, maar niet bij een reel die met een eigen openingsbeeld
// begint. Een planningsitem kan daarom meegeven:
//   omslag.url  een JPEG op een openbaar adres (cover_url). Dan gebruikt Instagram
//               dat beeld en negeert het thumb_offset.
//   omslag.ms   het moment in de video (thumb_offset), standaard OMSLAG_MS. Dit is
//               ook de terugval als Instagram het eigen beeld weigert: liever het
//               goede videobeeld als omslag dan helemaal geen reel.
// Alleen het klaarzetten valt terug, het publiceren nooit: een fout bij het
// publiceren kan betekenen dat de reel er toch staat, en dan zou hij dubbel gaan.
async function reelContainer(igId, token, velden, omslag = {}) {
  const ms = Number.isFinite(omslag.ms) ? Math.max(0, Math.round(omslag.ms)) : OMSLAG_MS;
  const basis = { media_type: 'REELS', ...velden, thumb_offset: ms };
  if (omslag.url) {
    try {
      const c = await maakContainer(igId, token, { ...basis, cover_url: omslag.url });
      await wachtTotKlaar(c, token, 300, 10000);
      console.log('   omslag: eigen beeld (cover_url)');
      return { id: c, omslag: 'eigen beeld' };
    } catch (fout) {
      // Een time-out of netwerkfout zegt niets over de omslag: dan liever een uur later opnieuw met de
      // eigen omslag (een reel heeft inhaaluren genoeg) dan nu terugvallen op het videobeeld.
      if (/nog niet klaar|fetch failed|geen leesbaar antwoord/i.test(fout.message)) throw fout;
      console.log(`   eigen omslag niet gelukt (${fout.message}); opnieuw met het videobeeld op ${ms} ms`);
    }
  }
  const c = await maakContainer(igId, token, basis);
  await wachtTotKlaar(c, token, 300, 10000);
  console.log(`   omslag: videobeeld op ${ms} ms`);
  return { id: c, omslag: `videobeeld op ${ms} ms` };
}

// Geeft { id, omslag } terug: het media-id en welke omslag Instagram heeft aangenomen.
async function plaatsReel(igId, token, videoUrl, bijschrift, omslag = {}) {
  const r = await reelContainer(igId, token, { video_url: videoUrl, caption: bijschrift, share_to_feed: 'true' }, omslag);
  return { id: await publiceer(igId, token, r.id), omslag: r.omslag };
}

// Proefdraai zonder te publiceren: zet een reel-container klaar en wacht tot
// Instagram hem heeft opgehaald en omgezet. Zo weten we vooraf of de video, de
// bron-URL en een eventuele eigen omslag geaccepteerd worden. Een ongepubliceerde
// container vervalt na een dag vanzelf en telt niet mee voor de daglimiet.
// Geeft { id, omslag } terug: welke omslag Instagram uiteindelijk aannam.
async function proefVideo(igId, token, videoUrl, omslag = {}) {
  return reelContainer(igId, token, { video_url: videoUrl }, omslag);
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
  VERSIE, OMSLAG_MS, api, plaatsFoto, plaatsCarrousel, plaatsVerhaal, plaatsReel, proefVideo,
  wieBenIk, ruimteOver, vernieuwSleutel, wacht, recenteMedia };
