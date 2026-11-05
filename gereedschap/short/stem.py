# Stem voor shorts (besluit Andries do 5 nov 2026: "Kokoro"). Open-source TTS Kokoro-82M (Apache-2.0) via kokoro-onnx,
# draait lokaal, zonder account of credits. Model en venv staan buiten de repo:
#   C:\Users\gijsm\yg-gereedschap\kokoro-venv      (pip install kokoro-onnx soundfile)
#   C:\Users\gijsm\yg-gereedschap\kokoro-model     (kokoro-v1.0.onnx, voices-v1.0.bin; releases van thewh1teagle/kokoro-onnx)
# Gebruik (via short.cjs):  kokoro-venv\Scripts\python gereedschap/short/stem.py <uit.wav> <stem> <tempo> "<tekst>"
import os, sys
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL = os.environ.get('KOKORO_MAP', r'C:\Users\gijsm\yg-gereedschap\kokoro-model')

# Jaartallen zoals een mens ze zegt: de uitspraakregels van Kokoro maken van 1971 "nineteen hundred seventy-one" en van
# 1839 "one thousand eight hundred thirty-nine". Daarom vooraf naar woorden: 1971 -> nineteen seventy-one,
# 1905 -> nineteen oh five, 1900 -> nineteen hundred, 2003 -> two thousand three, 2010 -> twenty ten.
import re
EEN = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TIEN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
def tot99(n):
    return EEN[n] if n < 20 else TIEN[n // 10] + ('-' + EEN[n % 10] if n % 10 else '')
def jaar(m):
    j = int(m.group(0))
    if not 1100 <= j <= 2099:
        return m.group(0)
    a, b = divmod(j, 100)
    if 2000 <= j <= 2009:
        return 'two thousand' + (' ' + EEN[b] if b else '')
    if b == 0:
        return tot99(a) + ' hundred'
    return tot99(a) + ' ' + ('oh ' + EEN[b] if b < 10 else tot99(b))
def jaartallen(tekst):
    return re.sub(r'(?<![\d.,])\b\d{4}\b(?![\d.,]\d)', jaar, tekst)

def main():
    uit, stem, tempo, tekst = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
    k = Kokoro(os.path.join(MODEL, 'kokoro-v1.0.onnx'), os.path.join(MODEL, 'voices-v1.0.bin'))
    taal = 'en-gb' if stem[:1] == 'b' else 'en-us'
    geluid, rate = k.create(jaartallen(tekst), voice=stem, speed=tempo, lang=taal)
    sf.write(uit, geluid, rate)
    print(f'{len(geluid) / rate:.3f}')

if __name__ == '__main__':
    main()
