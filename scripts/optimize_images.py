"""One-time image pipeline for the OWGT site.

Converts the original committed photos to WebP at their real display size.

The originals are deleted from the working tree after conversion. They are NOT
lost: they remain in git history. To re-run this script from a clean clone:

    git show HEAD~1:assets/images/chapter_robot.jpg > assets/images/chapter_robot.jpg

Requires Pillow. Verified working: Python 3.14.7 + Pillow 12.3.0.
"""
import io
import json
import socket
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "images"

# (source, output, target_width, webp_quality)
# Heights are derived from the source aspect ratio by Pillow.
CONVERT = [
    ("hero_bg.png",            "hero_bg.webp",            1678, 80),
    ("owgt-logo.png",          "owgt-logo.webp",           320, 85),
    ("volunteer_hackathon.jpg","volunteer_hackathon.webp",1920, 78),
    ("board_member_1.jpg",     "board_member_1.webp",      760, 80),
    ("board_member_2.jpg",     "board_member_2.webp",      760, 80),
    ("board_member_3.jpg",     "board_member_3.webp",      570, 80),
    ("chapter_robot.jpg",      "chapter_robot.webp",      1320, 78),
]

for src_name, out_name, width, quality in CONVERT:
    src = SRC / src_name
    dst = SRC / out_name
    if not src.exists():
        raise SystemExit(f"BLOCKER: missing source {src}. Restore it from git history.")
    with Image.open(src) as im:
        im = im.convert("RGB") if src.suffix.lower() == ".jpg" else im
        if im.width > width:
            height = round(im.height * width / im.width)
            im = im.resize((width, height), Image.LANCZOS)
        im.save(dst, "WEBP", quality=quality, method=6)
    print(f"{out_name}: {im.size[0]}x{im.size[1]}  {dst.stat().st_size:,} bytes")


# ---------------------------------------------------------------------------
# Favicon set, derived from the existing 600x600 assets/images/favicon.png
# ---------------------------------------------------------------------------
with Image.open(SRC / "favicon.png") as im:
    im = im.convert("RGBA")
    im.resize((16, 16), Image.LANCZOS).save(SRC / "favicon-16.png", "PNG", optimize=True)
    im.resize((32, 32), Image.LANCZOS).save(SRC / "favicon-32.png", "PNG", optimize=True)
    im.resize((180, 180), Image.LANCZOS).save(SRC / "apple-touch-icon.png", "PNG", optimize=True)
    im.save(ROOT / "favicon.ico", format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48)])
    # 1200x630 social share card, centre-cropped from the 1678x937 hero image
    with Image.open(SRC / "hero_bg.png") as hero:
        hero = hero.convert("RGB")
        target_ratio = 1200 / 630
        crop_h = round(hero.width / target_ratio)
        top = round((hero.height - crop_h) / 2)
        hero.crop((0, top, hero.width, top + crop_h)) \
            .resize((1200, 630), Image.LANCZOS) \
            .save(SRC / "og-image.jpg", "JPEG", quality=82, optimize=True, progressive=True)

for name in ("favicon-16.png", "favicon-32.png", "apple-touch-icon.png", "og-image.jpg"):
    print(f"{name}: {(SRC / name).stat().st_size:,} bytes")
print(f"favicon.ico: {(ROOT / 'favicon.ico').stat().st_size:,} bytes")


# ---------------------------------------------------------------------------
# Social icons, downloaded from the OWGT newsletter's own footer and normalised
# to 32x32. Never hotlinked -- they are stored in this repo.
# ---------------------------------------------------------------------------
ICONS = {
    "website.png":   "https://files.catbox.moe/7pxfdw.png",
    "discord.png":   "https://files.catbox.moe/sjbbap.png",
    "whatsapp.png":  "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fe904ecd51b2c15bbe.png",
    "youtube.png":   "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fd68548d1a9e9e5d03.png",
    "instagram.png": "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fe904ecd51b2c15bbf.png",
    "tiktok.png":    "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fde9317f1e0cc03932.png",
    "x.png":         "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fef5dbd497f00a1048.png",
}

# Some corporate/ISP resolvers cannot resolve files.catbox.moe. When that
# happens, ask public DNS (DNS-over-HTTPS) and retry with the answer. The
# hostname is still passed through for SNI and certificate validation.
_orig_getaddrinfo = socket.getaddrinfo


def _getaddrinfo_with_public_dns_fallback(host, *args, **kwargs):
    try:
        return _orig_getaddrinfo(host, *args, **kwargs)
    except socket.gaierror:
        answer = json.load(urllib.request.urlopen(
            f"https://dns.google/resolve?name={host}&type=A", timeout=20))
        ip = next(a["data"] for a in answer["Answer"] if a["type"] == 1)
        print(f"  public DNS fallback: {host} -> {ip}")
        return _orig_getaddrinfo(ip, *args, **kwargs)


socket.getaddrinfo = _getaddrinfo_with_public_dns_fallback

SOCIAL = ROOT / "assets" / "icons" / "social"
SOCIAL.mkdir(parents=True, exist_ok=True)
for name, url in ICONS.items():
    # The User-Agent is required: img.mailinblue.com returns 403 without it.
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=60).read()
    with Image.open(io.BytesIO(data)) as im:
        im.convert("RGBA").resize((32, 32), Image.LANCZOS) \
          .save(SOCIAL / name, "PNG", optimize=True)
    print(f"assets/icons/social/{name}: 32x32")
