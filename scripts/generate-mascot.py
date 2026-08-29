#!/usr/bin/env python3
"""Generate Bhindi mascot poses via OpenAI gpt-image-2."""
import base64, json, os, sys, urllib.request, re

SW = os.path.expanduser("~/CascadeProjects/shilpiworks")
def load_key():
    for f in (f"{SW}/backend/.env", f"{SW}/frontend/.env.production.local"):
        if not os.path.exists(f): continue
        for line in open(f):
            if line.startswith("OPENAI_API_KEY="):
                v = line.split("=", 1)[1].strip().strip('"').strip("'")
                v = re.sub(r'\\n$', '', v).strip()          # literal \n guard
                if v: return v
    sys.exit("no OPENAI_API_KEY found")

KEY = load_key()
OUT = sys.argv[1]
MODEL = "gpt-image-2"

BHINDI = (
    "A friendly cartoon mascot cat named Bhindi for an educational book. "
    "Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly "
    "paler chest and muzzle, and large round warm yellow eyes. Gentle, kind, "
    "calm expression - a caring companion, never mischievous or manic. "
    "Simple flat vector illustration, clean bold outlines, soft rounded shapes, "
    "friendly and modern children's-book style, minimal shading. "
    "Full body, sitting or standing, facing the viewer. "
    "Consistent character design across all images. "
    "Isolated on a fully transparent background, no scene, no ground shadow, "
    "no text, no border, no frame."
)

POSES = {
  "neutral":     "Bhindi sitting calmly and upright, tail curled around her paws, looking at the viewer with a soft, steady, reassuring expression.",
  "welcome":     "Bhindi standing, one front paw raised in a friendly small wave, head tilted slightly, warm welcoming smile.",
  "thinking":    "Bhindi sitting, one paw resting thoughtfully against her cheek, eyes looking upward and slightly to the side, curious and considering.",
  "tip":         "Bhindi sitting upright and alert, one paw raised with index-toe pointing gently upward as if offering a helpful idea, bright attentive eyes.",
  "warning":     "Bhindi sitting upright, both front paws raised in a soft calming gesture, ears slightly back, gently cautionary but never frightening or angry.",
  "encouraging": "Bhindi leaning slightly forward, one paw extended toward the viewer in a supportive gesture, kind steady eyes, quietly rooting for you.",
  "celebration": "Bhindi standing with both front paws raised happily above her head, eyes bright and cheerful, tail up, delighted but gentle - not wild.",
}

def gen(name, pose_text):
    body = json.dumps({
        "model": MODEL,
        "prompt": f"{BHINDI} Pose: {pose_text}",
        "size": "1024x1024",
        "background": "transparent",
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations", data=body,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        d = json.load(r)
    img = base64.b64decode(d["data"][0]["b64_json"])
    p = os.path.join(OUT, f"{name}.png")
    open(p, "wb").write(img)
    print(f"  {name}.png  {len(img)//1024}KB")
    return p

if __name__ == "__main__":
    which = sys.argv[2:] or list(POSES)
    os.makedirs(OUT, exist_ok=True)
    for n in which:
        try: gen(n, POSES[n])
        except Exception as e:
            print(f"  {n}: ERROR {type(e).__name__}: {str(e)[:200]}")
