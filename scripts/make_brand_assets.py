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

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"

# Commit that last contained each original, before optimize_images.py deleted it.
LOGO_SRC_COMMIT = "64e93ff"
LOGO_SRC_PATH = "assets/images/owgt-logo.png"      # 1254x1254, full lockup
FAVICON_SRC_COMMIT = "c55113a~1"
FAVICON_SRC_PATH = "assets/images/favicon.png"     # 600x600, robot head only

# A pixel further than this from the flat background counts as artwork.
ARTWORK_THRESHOLD = 18

# Navbar logo. Cropped tight to the artwork rather than padded out to a square:
# with the white tile gone there is nothing visible about being square, and the
# invisible padding both buried ~8px between the navbar edge and the robot and
# shrank the mark inside its own box.
NAV_TARGET_HEIGHT = 360       # px; covers the 56 px desktop size at 3x DPR
NAV_WEBP_QUALITY = 90

# Favicon padding is real and visible: the icon keeps an opaque white face, so
# the robot needs air inside it. The favicons share the navbar's generous ratio
# so the two read as one family.
FAVICON_PADDING_RATIO = 0.08  # of the artwork's long edge
FAVICON_CORNER_RATIO = 0.20   # radius as a fraction of the icon's edge
FAVICON_SIZES = (16, 32)      # the two the markup declares
ICO_SIZES = (16, 32, 48)      # what the root favicon.ico carries


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

    The sources sit on #FDFDFD, which reads as dingy grey next to a white icon.
    Antialiased edge pixels sit just off the background colour, so anything
    within the artwork threshold counts as background.
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


def to_transparent(art: Image.Image, bg: tuple[int, int, int]) -> Image.Image:
    """Lift the flat background out to real alpha, keeping antialiased edges.

    The source is flat artwork composited over near-white, so every pixel obeys
    `observed = a * foreground + (1 - a) * background`, and recovering `a` is
    what makes the edge antialias instead of going jagged.

    Alpha comes from the *worst* channel's distance from white, never from
    luminance. The wordmark is the brand blue #0345AA, whose luminance sits far
    below the robot's near-black, so a luminance-based alpha would render the
    wordmark semi-transparent. The worst channel reads ~255 for both.

    The colour channels are then un-premultiplied. Leaving the white
    contribution in would fringe every edge against the coloured hero that the
    navbar floats over.
    """
    flat = flatten_to_white(art, bg)
    arr = np.asarray(flat, dtype=np.float64)
    # Composite is over pure white, so one channel reaching 255 pins alpha high.
    deficit = 255.0 - arr.min(axis=2)          # 0 on flat background
    alpha = np.clip(deficit, 0, 255)
    # Un-premultiply: fg = (observed - 255 * (1 - a)) / a, with a = alpha / 255.
    a = (alpha / 255.0)[:, :, None]
    fg = np.where(a > 1e-6, (arr - 255.0 * (1.0 - a)) / np.maximum(a, 1e-6), 0.0)
    out = np.dstack([np.clip(fg, 0, 255), alpha[:, :, None]])
    return Image.fromarray(out.round().astype(np.uint8), "RGBA")


def pad_to_square(art: Image.Image, ratio: float,
                  fill: tuple[int, int, int, int] = (255, 255, 255, 0)) -> Image.Image:
    """Centre the artwork in a square canvas, padded by `ratio` of its long edge.

    Square, not the artwork's own shape: the lockup is 485x570, so a
    proportional canvas is a tall rectangle and the rounded corners of the old
    white tile read as stretched. Because the artwork is not itself square,
    equal padding on all four sides is impossible -- the canvas is sized off the
    long edge, so the short axis ends up with more room. On the lockup that is
    the horizontal axis, which is exactly where the O.W.G.T wordmark runs to the
    edge and needs the air.

    `fill` is transparent for the navbar logo, which no longer carries a white
    tile, and opaque white for the favicons, which still need a solid face.
    """
    edge = max(art.width, art.height)
    pad = round(edge * ratio)
    side = edge + pad * 2
    out = Image.new("RGBA", (side, side), fill)
    out.paste(art, ((side - art.width) // 2, (side - art.height) // 2),
              art if art.mode == "RGBA" else None)
    return out


def opaque_square(art: Image.Image, ratio: float) -> Image.Image:
    """A square white tile for the favicons, which still need a solid face.

    The navbar logo is the opposite case -- it floats on the navbar with no
    tile -- so the two callers differ only in the fill they ask for.
    """
    return pad_to_square(art, ratio, fill=(255, 255, 255, 255)).convert("RGB")


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


def rounded_icon(square: Image.Image, size: int, ratio: float) -> Image.Image:
    """Downscale a white square tile to `size` and round its corners away."""
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    icon.paste(square.resize((size, size), Image.LANCZOS), (0, 0),
               rounded_mask(size, ratio))
    return icon


def build_nav_logo(src: Path) -> Path:
    art, bg = load_flat_art(src)
    logo = to_transparent(art, bg)
    # Cropped tight to the artwork. The previous version padded the lockup out to
    # a square canvas so a *white tile* would be square; with the tile gone the
    # square was invisible but not harmless. It parked ~8px of nothing between
    # the navbar edge and the robot, so the padding the owner was asking to
    # reduce was only part of the gap, and it wasted resolution, shrinking the
    # visible mark. A tight crop makes the CSS height mean the visible height and
    # the CSS padding mean the visible gap.
    bbox = logo.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    assert bbox is not None, "the logo came out entirely transparent"
    logo = logo.crop(bbox)
    logo = fit_height(logo, NAV_TARGET_HEIGHT)

    dst = IMG / "owgt-logo-nav.v3.webp"
    logo.save(dst, "WEBP", quality=NAV_WEBP_QUALITY, method=6)

    alpha = logo.getchannel("A")
    # The crop must have left no transparent margin, and the result must keep the
    # lockup's own proportions. Note that ink coverage is NOT a usable tightness
    # test here: the robot is a thick outline around a white face, so the
    # artwork is only ~28% of its own bounding box and always has been.
    inner = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    assert inner == (0, 0, logo.width, logo.height), \
        f"visible content sits inside the frame at {inner}, not cropped tight"
    aspect = logo.width / logo.height
    assert 0.80 < aspect < 0.90, (
        f"aspect {aspect:.3f} is not the lockup's 0.85: the logo has been padded "
        f"out to a shape it should not be")
    # The wordmark must survive as solid, fully opaque brand blue. A
    # luminance-based alpha would have quietly made it translucent. Only
    # already-opaque pixels are considered: un-premultiplying an antialiased
    # edge can push a nearly transparent pixel to a fully saturated colour, so
    # "the most blue pixel" is not the same as "the blue of the wordmark".
    px = np.asarray(logo, dtype=np.int16)
    solid = px[px[:, :, 3] > 200]
    assert solid.size > 0, "no opaque pixels: the logo is a ghost"
    blue_score = solid[:, 2] - np.maximum(solid[:, 0], solid[:, 1])
    assert blue_score.max() > 60, "the blue wordmark is gone"
    # The wordmark is a solid run of colour, not a handful of stray pixels.
    assert int((blue_score > 60).sum()) > 500, \
        f"only {int((blue_score > 60).sum())} blue pixels: wordmark eroded"
    # Never upscale past the source: a blurry logo is worse than a soft one.
    assert art.height >= logo.height, "logo was upscaled from the source"
    return dst


def build_favicons(src: Path, sizes=(16, 32)) -> list[Path]:
    art, bg = load_flat_art(src)
    # Square tile with the same air the navbar tile gets, so the two read as
    # one family. The head art is 446x408, so padding off the long edge leaves
    # it centred with roughly equal space on all four sides.
    square = flatten_to_white(opaque_square(art, FAVICON_PADDING_RATIO), bg)

    # Squaring guarantees a white border on all four sides, so the mid-edge
    # points are background by construction. Probing the 16 px render instead
    # would be unreliable: at a 3 px radius the corners curve away, and after a
    # LANCZOS downscale the border is barely a pixel wide.
    for probe in ((square.width // 2, 0), (square.width // 2, square.height - 1),
                  (0, square.height // 2), (square.width - 1, square.height // 2)):
        assert square.getpixel(probe) == (255, 255, 255), \
            f"favicon fill at {probe} is not pure white"

    written = []
    for size in sizes:
        dst = IMG / f"favicon-{size}.r3.png"
        icon = rounded_icon(square, size, FAVICON_CORNER_RATIO)
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


def build_ico(src: Path) -> Path:
    """Rewrite the root favicon.ico with the same rounded artwork.

    This one is not optional polish. Browsers request /favicon.ico whether or
    not the markup mentions it, and Chrome picks an icon by size -- preferring
    to downscale a larger one over upscaling a 16 px one. A 48 px square .ico
    therefore beat both rounded PNGs and the tab kept showing the old artwork.
    Every icon source the browser can reach now has to be the new artwork.

    The file is at the repo root, not under /assets/, so vercel.json does not
    serve it `immutable` and it can be overwritten in place. Everything under
    /assets/ has to change name instead.
    """
    art, bg = load_flat_art(src)
    square = flatten_to_white(opaque_square(art, FAVICON_PADDING_RATIO), bg)

    dst = ROOT / "favicon.ico"
    largest = rounded_icon(square, max(ICO_SIZES), FAVICON_CORNER_RATIO)
    largest.save(dst, format="ICO", sizes=[(s, s) for s in ICO_SIZES])

    with Image.open(dst) as check:
        check.load()
        alpha = check.convert("RGBA").getchannel("A")
        assert alpha.getpixel((0, 0)) == 0, "favicon.ico corner is not transparent"
        assert alpha.getpixel((check.width - 1, 0)) == 0, \
            "favicon.ico corner is not transparent"
    return dst


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        logo_src = tmp / "owgt-logo.png"
        favicon_src = tmp / "favicon.png"
        restore_from_git(LOGO_SRC_COMMIT, LOGO_SRC_PATH, logo_src)
        restore_from_git(FAVICON_SRC_COMMIT, FAVICON_SRC_PATH, favicon_src)

        for path in [build_nav_logo(logo_src), *build_favicons(favicon_src),
                     build_ico(favicon_src)]:
            rel = path.relative_to(ROOT).as_posix()
            with Image.open(path) as im:
                size = f"{im.width}x{im.height}"
            print(f"{rel}: {size}  {path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
