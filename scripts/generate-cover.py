#!/usr/bin/env python3
"""Regenerate docs/img/cover.png.

The cover art is the book's own learning graph: 300 concepts coloured by
taxonomy, sized by Concept Impact Score, laid out by vis-network's physics
engine. Utilitarian and beautiful - it carries the real structure of the book.

Requires: playwright (pip install playwright), Pillow, and Google Chrome.
Run from the repo root:  python3 scripts/generate-cover.py
"""
import http.server, os, socketserver, threading, shutil, tempfile, functools
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONT = "/System/Library/Fonts/Avenir Next.ttc"
W, H, BG, PORT = 1731, 909, (250, 249, 246), 8127

work = tempfile.mkdtemp()
shutil.copy(f"{ROOT}/scripts/cover-graph-render.html", f"{work}/graphcover.html")
shutil.copy(f"{ROOT}/docs/learning-graph/learning-graph.json", f"{work}/graph.json")

handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=work)
srv = socketserver.TCPServer(("127.0.0.1", PORT), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": W, "height": H},
                        device_scale_factor=2, color_scheme="light")
        pg.goto(f"http://127.0.0.1:{PORT}/graphcover.html")
        pg.wait_for_function("window.__ready===true", timeout=120000)
        pg.wait_for_timeout(1200)
        pg.screenshot(path=f"{work}/art.png", omit_background=True,
                      clip={"x": 0, "y": 0, "width": W, "height": H})
        b.close()
finally:
    srv.shutdown()

def font(size, index):
    return ImageFont.truetype(FONT, size, index=index)   # 0=Bold 5=Medium 7=Regular

art = Image.open(f"{work}/art.png").convert("RGBA").resize((W, H), Image.LANCZOS)
big = art.resize((int(W * 1.05), int(H * 1.05)), Image.LANCZOS)
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
layer.paste(big, (int(W * .28) - (big.width - W) // 2, -(big.height - H) // 2), big)

# fade the art out under the title block so the type stays clean
px = layer.load()
for x in range(int(W * .46)):
    a = max(0.0, min(1.0, (x - W * .12) / (W * .34)))
    a = a * a * (3 - 2 * a)                      # smoothstep
    for y in range(H):
        r, g, bl, al = px[x, y]
        if al:
            px[x, y] = (r, g, bl, int(al * a))

cover = Image.alpha_composite(Image.new("RGBA", (W, H), BG + (255,)), layer).convert("RGB")
d = ImageDraw.Draw(cover)
x0 = 112
d.text((x0, 300), "Understanding", font=font(96, 0), fill=(24, 32, 44))
d.text((x0, 404), "ADHD",          font=font(96, 0), fill=(0, 105, 102))
d.line([(x0, 548), (x0 + 118, 548)], fill=(212, 160, 23), width=5)
y = 588
for line in ["A guidebook for people with ADHD", "and the people who care for them."]:
    d.text((x0, y), line, font=font(38, 5), fill=(92, 104, 120))
    y += 52
d.text((x0, H - 96), "15 chapters  ·  300 concepts  ·  23 interactive simulations",
       font=font(24, 7), fill=(140, 150, 163))

out = f"{ROOT}/docs/img/cover.png"
cover.save(out)
print(f"wrote {out}  {cover.size}  {os.path.getsize(out)//1024}KB")
