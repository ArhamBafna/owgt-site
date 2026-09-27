"""Regenerates the navbar logo and the rounded favicons.

Unlike `optimize_images.py`, this script is idempotent and re-runnable: the
600x600 originals it reads were deleted from the working tree by that earlier
one-time pipeline, so this script restores them from git history on every run.
It never leaves scratch files behind in the repo.

    python scripts/make_brand_assets.py

Three products:

  assets/images/owgt-logo-nav.webp   Navbar tile. Robot head + O.W.G.T wordmark,
                                     dead white margins trimmed, a little white
                                     padding given back, natural (slightly
                                     portrait) proportions.
  assets/images/favicon-16.r2.png     Browser tab icon, 20% rounded corners,
  assets/images/favicon-32.r2.png     transparent outside, pure white inside.

The ".r2" suffix and the "-nav" suffix are mandatory, not cosmetic: vercel.json
serves /assets/* as `max-age=31536000, immutable`, so a same-named file would
never reach an already-visiting browser.

Requires Pillow. Verified working: Python 3.14.7 + Pillow 12.3.0.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"

# Commit that last contained each original, before optimize_images.py deleted it.
LOGO_SRC_COMMIT = "64e93ff"
LOGO_SRC_PATH = "assets/images/owgt-logo.png"      # 1254x1254, full lockup
FAVICON_SRC_COMMIT = "c55113a~1"
FAVICON_SRC_PATH = "assets/images/favicon.png"     # 600x600, robot head only

# A pixel further than this from the flat background counts as artwork.
ARTWORK_THRESHOLD = 18

# Navbar tile proportions. The wordmark is legible down to about 44 px tall, so
# the tile keeps the logo's natural 0.85 portrait ratio rather than being forced
# square -- a square tile would need side padding that shrinks the robot.
NAV_PADDING_RATIO = 0.06      # of content width, on all four sides
NAV_TARGET_HEIGHT = 360       # px; covers the 48 px desktop size at 3x DPR
NAV_WEBP_QUALITY = 90

# Favicon corner treatment.
FAVICON_CORNER_RATIO = 0.20   # radius as a fraction of the icon's edge


def restore_from_git(commit: str, path: str, dest: Path) -> None:
    """Write a deleted original back out of git history as raw bytes.

    `git show` writes the blob to stdout, so it is captured and written as bytes.
    Never route a binary through a shell redirect: PowerShell's `>` mangles it
    into UTF-16, and a `^` in the revision is eaten by the shell.
    """
    proc = subprocess.run(
        ["git", "show", f"{commit}:{path}"], cwd=ROOT, capture_output=True)
    if proc.returncode != 0:
        sys.exit(f"BLOCKER: cannot restore {path} from {commit}: "
                 f"{proc.stderr.decode(errors='replace').strip()}")
    if not proc.stdout:
        sys.exit(f"BLOCKER: {path} restored from {commit} is empty.")
    dest.write_bytes(proc.stdout)


def load_flat_art(path: Path) -> tuple[Image.Image, tuple[int, int, int]]:
    """Return the artwork cropped to its bounding box, plus the background colour.

    Every source here is a flat near-white sheet with the logo floating in the
    middle of it. Cropping to the bounding box is what makes the logo readable
    at navbar size: in owgt-logo.png the artwork covers 485x570 of a 1254x1254
    canvas, so an uncropped render at 48 px tall would draw the robot 19 px wide.
    """
    with Image.open(path) as im:
        im = im.convert("RGB")
        bg = im.getpixel((1, 1))
        diff = ImageChops.difference(im, Image.new("RGB", im.size, bg))
        mask = diff.convert("L").point(
            lambda v: 255 if v > ARTWORK_THRESHOLD else 0)
        bbox = mask.getbbox()
        if bbox is None:
            sys.exit(f"BLOCKER: no artwork found in {path.name}.")
        return im.crop(bbox), bg


def flatten_to_white(art: Image.Image, bg: tuple[int, int, int]) -> Image.Image:
    """Repaint the flat background to pure white.

    The sources sit on #FDFDFD, which reads as dingy grey next to a pure white
    navbar tile. Antialiased edge pixels sit just off the background colour, so
    anything within the artwork threshold counts as background.
    """
    if bg == (255, 255, 255):
        return art
    out = art.copy()
    distance = ImageChops.difference(
        art, Image.new("RGB", art.size, bg)).convert("L")
    is_background = distance.point(
        lambda v: 255 if v <= ARTWORK_THRESHOLD else 0)
    out.paste((255, 255, 255), (0, 0), is_background)
    return out


def pad_uniform(art: Image.Image, ratio: float) -> Image.Image:
    """Add uniform white padding of `ratio` x content width on all four sides."""
    pad = round(art.width * ratio)
    out = Image.new("RGB", (art.width + pad * 2, art.height + pad * 2),
                    (255, 255, 255))
    out.paste(art, (pad, pad))
    return out


def fit_height(art: Image.Image, height: int) -> Image.Image:
    if art.height == height:
        return art
    width = max(1, round(art.width * height / art.height))
    return art.resize((width, height), Image.LANCZOS)


def rounded_mask(size: int, ratio: float) -> Image.Image:
    """A white-filled rounded square on black, for use as an alpha mask."""
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=round(size * ratio), fill=255)
    return mask


def build_nav_logo(src: Path) -> Path:
    art, bg = load_flat_art(src)
    tile = pad_uniform(flatten_to_white(art, bg), NAV_PADDING_RATIO)
    tile = fit_height(tile, NAV_TARGET_HEIGHT)

    dst = IMG / "owgt-logo-nav.webp"
    tile.save(dst, "WEBP", quality=NAV_WEBP_QUALITY, method=6)

    # The tile keeps the logo's own proportions, so it must stay portrait.
    aspect = tile.width / tile.height
    assert 0.78 < aspect < 0.92, f"tile aspect {aspect:.3f} is not the 0.85 portrait"
    # Padding must be visibly there, not trimmed flush to the artwork.
    assert 0.04 < NAV_PADDING_RATIO < 0.10, "padding out of the agreed range"
    # Never upscale past the source: a blurry 3x tile is worse than a soft 2x one.
    assert art.height >= tile.height, "tile was upscaled from the source"
    return dst


def build_favicons(src: Path, sizes=(16, 32)) -> list[Path]:
    art, bg = load_flat_art(src)
    # Square up first: the head artwork is 446x408, and a tab icon is square.
    edge = max(art.width, art.height)
    square = Image.new("RGB", (edge, edge), (255, 255, 255))
    square.paste(art, ((edge - art.width) // 2, (edge - art.height) // 2))
    square = flatten_to_white(square, bg)

    # Squaring guarantees white bands above and below the art, so the mid-edge
    # points are background by construction. Probing the 16 px render instead
    # would be unreliable: at a 3 px radius the corners curve away, and after a
    # LANCZOS downscale the bands are barely a pixel wide.
    band = (edge - art.height) // 2
    assert band > 0, "head art is not wider than it is tall; nothing to pad"
    for probe in ((edge // 2, 0), (edge // 2, edge - 1)):
        assert square.getpixel(probe) == (255, 255, 255), \
            f"favicon fill at {probe} is not pure white"

    written = []
    for size in sizes:
        mask = rounded_mask(size, FAVICON_CORNER_RATIO)
        icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        icon.paste(square.resize((size, size), Image.LANCZOS), (0, 0), mask)
        dst = IMG / f"favicon-{size}.r2.png"
        icon.save(dst, "PNG", optimize=True)

        with Image.open(dst) as check:
            assert check.mode == "RGBA", f"{dst.name} lost its alpha channel"
            assert check.size == (size, size), f"{dst.name} is not {size}x{size}"
            alpha = check.convert("RGBA").getchannel("A")
            for x, y in ((0, 0), (size - 1, 0), (0, size - 1), (size - 1, size - 1)):
                assert alpha.getpixel((x, y)) == 0, \
                    f"{dst.name} corner ({x},{y}) is not transparent"
            # The straight edges must survive, or the rounding ate the icon.
            for x, y in ((size // 2, 0), (size // 2, size - 1), (0, size // 2), (size - 1, size // 2)):
                assert alpha.getpixel((x, y)) == 255, \
                    f"{dst.name} edge ({x},{y}) was clipped by the mask"
        written.append(dst)
    return written


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        logo_src = tmp / "owgt-logo.png"
        favicon_src = tmp / "favicon.png"
        restore_from_git(LOGO_SRC_COMMIT, LOGO_SRC_PATH, logo_src)
        restore_from_git(FAVICON_SRC_COMMIT, FAVICON_SRC_PATH, favicon_src)

        for path in [build_nav_logo(logo_src), *build_favicons(favicon_src)]:
            rel = path.relative_to(ROOT).as_posix()
            with Image.open(path) as im:
                size = f"{im.width}x{im.height}"
            print(f"{rel}: {size}  {path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
