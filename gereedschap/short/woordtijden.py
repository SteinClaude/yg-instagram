# Woordtijden voor stijl 2: wanneer wordt elk woord van een ingesproken zin gezegd? Kokoro-onnx geeft zelf geen tijden.
# We bepalen ze uit het geluid:
#   1. pauzes in de opname (stiltes van 70 ms of langer);
#   2. de zinsdelen in de tekst (afgesloten met , . ? ! : ;), verdeeld over de stukken spraak tussen die pauzes;
#   3. binnen een stuk spraak de woorden naar hun aantal klanken (fonemen, via de tokenizer van Kokoro).
# Nauwkeurig tot op ±0,1 s: genoeg om tekst te laten verschijnen op het moment dat hij gezegd wordt.
# Gebruik: kokoro-venv\Scripts\python gereedschap/short/woordtijden.py <stem.wav> <taal> "<tekst>" [--v2]  -> JSON op stdout
# --v2 (stijl 3): robuuster bij lange zinnen met veel komma's; zie tijden_v2.
import json, re, sys
import numpy as np
import soundfile as sf
from kokoro_onnx.tokenizer import Tokenizer
sys.path.insert(0, __import__('os').path.dirname(__file__))
from stem import jaartallen


def spraakstukken(geluid, rate, verwacht):
    """verwacht: aandeel van elk zinsdeel in de spraak (som 1). Kiest de pauzes die daar het best bij passen."""
    from itertools import combinations
    n = len(verwacht)
    stap = int(rate * 0.01)
    rms = np.array([np.sqrt(np.mean(geluid[i:i + stap] ** 2)) for i in range(0, len(geluid) - stap, stap)])
    drempel = max(rms.max() * 0.04, 1e-4)
    spraak = rms > drempel
    idx = np.flatnonzero(spraak)
    if not len(idx):
        return [(0.0, len(geluid) / rate)]
    begin, eind = idx[0], idx[-1] + 1
    gaten, i = [], begin
    while i < eind:
        if not spraak[i]:
            j = i
            while j < eind and not spraak[j]:
                j += 1
            if j - i >= 5:
                gaten.append((i, j))
            i = j
        else:
            i += 1
    k = min(n - 1, len(gaten))
    beste, kosten = (), None
    for keuze in combinations(gaten, k):
        grenzen = [begin] + [x for g in keuze for x in g] + [eind]
        duren = [(grenzen[2 * m + 1] - grenzen[2 * m]) for m in range(k + 1)]
        tot = sum(duren) or 1
        # minder pauzes dan zinsdelen: de laatste zinsdelen worden samengevoegd
        exp = list(verwacht) if k == n - 1 else list(verwacht[:k]) + [sum(verwacht[k:])]
        c = sum((d / tot - e) ** 2 for d, e in zip(duren, exp)) - 0.002 * sum(b - a for a, b in keuze)
        if kosten is None or c < kosten:
            beste, kosten = keuze, c
    stukken, s = [], begin
    for a, b in beste:
        stukken.append((s * 0.01, a * 0.01))
        s = b
    stukken.append((s * 0.01, eind * 0.01))
    return stukken


def tijden_v2(geluid, rate, groepen, gew):
    """Versie 2 (stijl 3, langere zinnen met veel komma's): elke grens tussen twee zinsdelen hoort bij de pauze waar
    net zo veel spraak vóór ligt als de tekst voorspelt. Grenzen zonder passende pauze blijven zonder pauze. Daarna
    worden de woorden over de spraak (zonder de stiltes) verdeeld naar hun aantal klanken."""
    stap = int(rate * 0.01)
    rms = np.array([np.sqrt(np.mean(geluid[i:i + stap] ** 2)) for i in range(0, len(geluid) - stap, stap)])
    spraak = rms > max(rms.max() * 0.04, 1e-4)
    idx = np.flatnonzero(spraak)
    woorden = [w for g in groepen for w in g]
    if not len(idx):
        d = len(geluid) / rate / max(1, len(woorden))
        return [{'w': w, 'start': round(i * d, 3), 'eind': round((i + 1) * d, 3)} for i, w in enumerate(woorden)]
    begin, eind = idx[0], idx[-1] + 1
    # stiltes van 60 ms of langer tellen niet als spraak; kortere gaatjes (medeklinkers) wel
    actief = spraak.copy()
    gaten, i = [], begin
    while i < eind:
        if not spraak[i]:
            j = i
            while j < eind and not spraak[j]:
                j += 1
            if j - i >= 6:
                gaten.append((i, j))
            else:
                actief[i:j] = True
            i = j
        else:
            i += 1
    actief[:begin] = False
    actief[eind:] = False
    cum = np.concatenate([[0], np.cumsum(actief)]).astype(float)
    tot = cum[-1] or 1.0
    v = [cum[a] / tot for a, b in gaten]                      # aandeel spraak vóór elke pauze
    per = [sum(gew(w) for w in g) for g in groepen]
    e = (np.cumsum(per) / sum(per))[:-1]                      # voorspeld aandeel bij elke grens
    # grenzen (in volgorde) koppelen aan pauzes (in volgorde); een grens mag ongekoppeld blijven
    nb, ng, straf = len(e), len(gaten), 0.006
    INF = 1e9
    D = [[INF] * (ng + 1) for _ in range(nb + 1)]
    K = [[None] * (ng + 1) for _ in range(nb + 1)]
    for g in range(ng + 1):
        D[0][g] = 0.0
    for b in range(1, nb + 1):
        for g in range(ng + 1):
            beste, keus = D[b - 1][g] + straf, ('los', g)     # grens b zonder pauze
            if g >= 1:
                if D[b][g - 1] < beste:                       # pauze g overslaan
                    beste, keus = D[b][g - 1], ('skip', g - 1)
                c = D[b - 1][g - 1] + (v[g - 1] - e[b - 1]) ** 2 - 0.00002 * (gaten[g - 1][1] - gaten[g - 1][0])
                if c < beste:
                    beste, keus = c, ('koppel', g - 1)
            D[b][g], K[b][g] = beste, keus
    koppel, b, g = {}, nb, ng
    while b > 0:
        soort, g2 = K[b][g]
        if soort == 'skip':
            g = g2
        elif soort == 'koppel':
            koppel[b - 1] = g2
            b, g = b - 1, g2
        else:
            b -= 1
    # ankers: (aandeel in de tekst, aandeel in de spraak); daartussen recht evenredig
    ax = [0.0] + [float(e[b]) for b in sorted(koppel)] + [1.0]
    ay = [0.0] + [v[koppel[b]] for b in sorted(koppel)] + [1.0]
    def tijd_bij(aandeel_spraak, na_pauze=False):
        doel = aandeel_spraak * tot
        k = int(np.searchsorted(cum, doel, side='right' if na_pauze else 'left'))
        return min(max(k - (0 if na_pauze else 1), begin), eind) * 0.01
    uit, c, som = [], 0.0, float(sum(per))
    for w in woorden:
        a0 = c / som
        c += gew(w)
        a1 = c / som
        s0, s1 = float(np.interp(a0, ax, ay)), float(np.interp(a1, ax, ay))
        t0, t1 = tijd_bij(s0, True), tijd_bij(s1)
        uit.append({'w': w, 'start': round(t0, 3), 'eind': round(max(t1, t0 + 0.04), 3)})
    return uit


def main():
    wav, taal, tekst = sys.argv[1], sys.argv[2], sys.argv[3]
    v2 = len(sys.argv) > 4 and sys.argv[4] == '--v2'
    geluid, rate = sf.read(wav)
    if geluid.ndim > 1:
        geluid = geluid.mean(axis=1)
    tok = Tokenizer()
    woorden = tekst.split()
    # zinsdelen: groepen woorden die eindigen op een leesteken
    groepen, g = [], []
    for w in woorden:
        g.append(w)
        if re.search(r'[,.?!:;]$', w):
            groepen.append(g)
            g = []
    if g:
        groepen.append(g)
    gew = lambda w: len(tok.phonemize(jaartallen(re.sub(r"[^\w']", ' ', w)) or w, taal).replace(' ', '')) + 1
    if v2:
        gewc = {}
        def gw2(w):
            if w not in gewc:
                gewc[w] = gew(w)
            return gewc[w]
        print(json.dumps(tijden_v2(geluid, rate, groepen, gw2)))
        return
    per = [sum(gew(w) for w in g) for g in groepen]
    stukken = spraakstukken(geluid, rate, [x / sum(per) for x in per])
    if len(stukken) < len(groepen):   # minder pauzes dan zinsdelen: voeg de laatste groepen samen
        groepen = groepen[:len(stukken) - 1] + [sum(groepen[len(stukken) - 1:], [])]
    uit = []
    for (a, b), groep in zip(stukken, groepen):
        gewicht = [gew(w) for w in groep]
        tot, t = sum(gewicht), a
        for w, gw in zip(groep, gewicht):
            d = (b - a) * gw / tot
            uit.append({'w': w, 'start': round(t, 3), 'eind': round(t + d, 3)})
            t += d
    print(json.dumps(uit))


if __name__ == '__main__':
    main()
