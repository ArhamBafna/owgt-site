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

# Navbar tile. Square, not the lockup's own 485x570 shape: a proportional tile
# is a tall rectangle whose rounded corners read as stretched, and the 0.06
# padding it carried left the O.W.G.T wordmark hard against the edge, which
# looked squished. Sized off the long edge, so the short axis (horizontal, where
# the wordmark runs out) gets the most air.
NAV_PADDING_RATIO = 0.10      # of the artwork's long edge
NAV_TARGET_HEIGHT = 360       # px; covers the 58 px desktop size at 3x DPR
NAV_WEBP_QUALITY = 90

# Favicons share the navbar tile's air so the two read as one family.
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


def pad_to_square(art: Image.Image, ratio: float) -> Image.Image:
    """Centre the artwork in a white square tile, padded by `ratio` of its long edge.

    Square, not the artwork's own shape: the lockup is 485x570, so a
    proportional tile is a tall rectangle and the rounded corners read as
    stretched. Because the artwork is not itself square, equal padding on all
    four sides is impossible -- the tile is sized off the long edge, so the
    short axis ends up with more room. On the lockup that is the horizontal
    axis, which is exactly where the O.W.G.T wordmark runs to the edge and
    needs the air.
    """
    edge = max(art.width, art.height)
    pad = round(edge * ratio)
    side = edge + pad * 2
    out = Image.new("RGB", (side, side), (255, 255, 255))
    out.paste(art, ((side - art.width) // 2, (side - art.height) // 2))
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


def rounded_icon(square: Image.Image, size: int, ratio: float) -> Image.Image:
    """Downscale a white square tile to `size` and round its corners away."""
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    icon.paste(square.resize((size, size), Image.LANCZOS), (0, 0),
               rounded_mask(size, ratio))
    return icon


def build_nav_logo(src: Path) -> Path:
    art, bg = load_flat_art(src)
    tile = fit_height(
        pad_to_square(flatten_to_white(art, bg), NAV_PADDING_RATIO),
        NAV_TARGET_HEIGHT)

    dst = IMG / "owgt-logo-nav.v2.webp"
    tile.save(dst, "WEBP", quality=NAV_WEBP_QUALITY, method=6)

    assert tile.width == tile.height, f"tile is {tile.width}x{tile.height}, not square"
    # The mark must sit inside the tile with visible air, not touch the corners.
    inner = ImageChops.difference(
        tile, Image.new("RGB", tile.size, (255, 255, 255))
    ).convert("L").point(lambda v: 255 if v > ARTWORK_THRESHOLD else 0).getbbox()
    margin_x = inner[0] / tile.width
    margin_y = inner[1] / tile.height
    assert margin_x > 0.10, f"only {margin_x:.1%} horizontal air"
    assert margin_y > 0.06, f"only {margin_y:.1%} vertical air"
    # Never upscale past the source: a blurry tile is worse than a soft one.
    assert art.height >= tile.height, "tile was upscaled from the source"
    return dst


def build_favicons(src: Path, sizes=(16, 32)) -> list[Path]:
    art, bg = load_flat_art(src)
    # Square tile with the same air the navbar tile gets, so the two read as
    # one family. The head art is 446x408, so padding off the long edge leaves
    # it centred with roughly equal space on all four sides.
    square = flatten_to_white(pad_to_square(art, FAVICON_PADDING_RATIO), bg)

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
    square = flatten_to_white(pad_to_square(art, FAVICON_PADDING_RATIO), bg)

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
