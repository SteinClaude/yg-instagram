# Stem voor shorts (besluit Andries do 5 nov 2026: "Kokoro"). Open-source TTS Kokoro-82M (Apache-2.0) via kokoro-onnx,
# draait lokaal, zonder account of credits. Model en venv staan buiten de repo:
#   C:\Users\gijsm\yg-gereedschap\kokoro-venv      (pip install kokoro-onnx soundfile)
#   C:\Users\gijsm\yg-gereedschap\kokoro-model     (kokoro-v1.0.onnx, voices-v1.0.bin; releases van thewh1teagle/kokoro-onnx)
# Gebruik (via short.cjs):  kokoro-venv\Scripts\python gereedschap/short/stem.py <uit.wav> <stem> <tempo> "<tekst>"
import os, sys
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL = os.environ.get('KOKORO_MAP', r'C:\Users\gijsm\yg-gereedschap\kokoro-model')

def main():
    uit, stem, tempo, tekst = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
    k = Kokoro(os.path.join(MODEL, 'kokoro-v1.0.onnx'), os.path.join(MODEL, 'voices-v1.0.bin'))
    taal = 'en-gb' if stem[:1] == 'b' else 'en-us'
    geluid, rate = k.create(tekst, voice=stem, speed=tempo, lang=taal)
    sf.write(uit, geluid, rate)
    print(f'{len(geluid) / rate:.3f}')

if __name__ == '__main__':
    main()
