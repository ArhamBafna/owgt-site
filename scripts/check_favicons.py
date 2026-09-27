"""Reports every icon source a browser could pick for this page, and whether
each one is the old square artwork or the new rounded artwork.

Usage:  python scripts/check_favicons.py
Exits non-zero if any *reachable* icon source is still the old square version,
or if a declared source does not exist on disk.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent


def declared_icons(html: str) -> list[tuple[str, str]]:
    """(rel, href) for every icon declaration, in document order."""
    return re.findall(
        r'<link[^>]*rel="([^"]*(?:icon|apple-touch)[^"]*)"[^>]*href="([^"]+)"',
        html, flags=re.I)


def auto_discovered() -> list[str]:
    """Browsers always also try /favicon.ico, whatever the markup says."""
    return ["favicon.ico"] if (ROOT / "favicon.ico").exists() else []


def corner_alpha(path: Path) -> list[int]:
    """Alpha at the four corners."""
    with Image.open(path) as im:
        im = im.convert("RGBA")
        w, h = im.size
        return [im.getpixel(p)[3] for p in
                ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]


# What each role is supposed to look like, and why.
#
#   icon / .ico      must have transparent corners. This is the tab icon, and
#                    it is the one that was going stale: Chrome picks an icon by
#                    size and prefers downscaling a larger file, so the 48 px
#                    .ico won over both rounded PNGs and the tab kept the old
#                    square artwork.
#
#   apple-touch-icon must stay an OPAQUE square, rounded corners not required
#                    and transparency actively harmful: iOS composites a
#                    transparent apple-touch-icon over black, so rounding it
#                    here would put black arcs in the corner of the home-screen
#                    icon. iOS then masks the square into its own rounded
#                    square. Leave it alone.
ROLE_RULES = {
    "icon": "rounded",
    "shortcut icon": "rounded",
    "auto-discovered": "rounded",
    "apple-touch-icon": "opaque",
}


def judge(rel: str, path: Path) -> tuple[bool, str]:
    alphas = corner_alpha(path)
    want = ROLE_RULES.get(rel, "rounded")
    transparent = sum(1 for a in alphas if a == 0)
    opaque = sum(1 for a in alphas if a == 255)
    if want == "opaque":
        if opaque == 4:
            return True, "opaque square (correct for iOS)"
        return False, f"FAIL: {opaque}/4 corners opaque, iOS renders those black"
    if transparent == 4:
        return True, "rounded, corners transparent"
    if opaque == 4:
        return False, "FAIL: OLD artwork, opaque white square corners"
    return False, f"FAIL: unclear ({transparent} transparent corners)"


def main() -> int:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    icons = declared_icons(html) + [("auto-discovered", h)
                                    for h in auto_discovered()]

    print(f"{'source':<44} {'role':<18} {'size':<9} verdict")
    print("-" * 110)
    stale: list[str] = []
    missing: list[str] = []
    for rel, href in icons:
        path = ROOT / href
        if not path.exists():
            print(f"{href:<44} {rel:<18} {'-':<9} MISSING ON DISK")
            missing.append(href)
            continue
        with Image.open(path) as im:
            size = f"{im.width}x{im.height}"
        ok, verdict = judge(rel, path)
        print(f"{href:<44} {rel:<18} {size:<9} {verdict}")
        if not ok:
            stale.append(f"{href} ({rel}): {verdict}")

    print()
    if missing:
        print(f"FAIL: declared but not on disk: {', '.join(missing)}")
    if stale:
        print("FAIL: an icon source is not what its role requires:")
        for s in stale:
            print(f"        {s}")
    if not stale and not missing:
        print("PASS: every icon source matches what its role requires.")
    return 1 if (stale or missing) else 0


if __name__ == "__main__":
    sys.exit(main())
