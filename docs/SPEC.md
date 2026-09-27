# SPEC.md â€” OneWorldGreaterTogether rebuild: implementation spec

**Status:** ready to execute
**Companion document:** `docs/anti_ai_audit_findings.md` (the diagnosis. Keep it. Do not edit it.)
**Repo:** `C:\Users\bafna_sb19qr0\Desktop\Projects\owgt\main-site`
**Branch:** `main` (currently 2 commits ahead of `origin/main`)

---

## 0. How to use this document

This is not a list of problems. It is a list of **things to do, with the answer already decided**.

Every decision the site owner had to make is baked in here as a literal value: exact hex codes, exact sentences, exact URLs, exact file paths. **If something is not written in this document, it was not decided, and you must not invent it.** Stop and report instead.

Work the phases in order. Each phase ends with a commit. Section 10 lists the five items that the site owner â€” not you â€” has to confirm with their own eyes.

---

## 1. Ground rules

### 1.1 You must

- Execute all 7 phases. All of them. "Implement everything in this document" is the instruction.
- Use the literal values given here. Do not substitute, round, or "improve" them.
- Commit after each phase, message format given in each phase.
- Run the verification command listed at the end of each phase and paste its real output.
- Stop and report if any single URL in this document returns a non-200 status, or if any literal string you are told to find in a file is not present.

### 1.2 You must not

| Do not | Why |
|---|---|
| Add a framework, `package.json`, `npm` dependency, or bundler to the site | The site is deliberately zero-dependency static HTML/CSS/JS. That is a hard constraint. |
| Deploy anything | The site owner runs the deploy. You write config only. |
| Take a screenshot or judge anything by eye | See Â§1.3. |
| Rewrite the newsletter marketing copy | The owner reviewed it and chose to keep it. It is a real, live product. |
| Rewrite the Events section copy | Owner decision: text stays, only the styling changes. |
| Hotlink any third-party image | All images are downloaded into the repo. |
| Invent copy, URLs, email addresses, or API endpoints | Everything you need is in this document. |
| Touch the contents of `placeholder/`, `raw-source-code/`, `reference-images/`, or `graphify-out/` | Phase 1 only untracks them from git. The files stay on disk untouched. |
| Commit `.vercel/`, `node_modules/`, or `.next/` | See Phase 1. |

### 1.3 The visual-verification rule

`AGENTS.md` says: **never check visually unless explicitly told to.** That rule stands for everything in this document **except** the five items in Â§10, which the site owner has explicitly claimed.

Practical consequence: for every other task, prove the work by **reading code and measuring numbers**, not by looking at the page. The checks written into each phase are all text-based or numeric. Do not open a browser.

### 1.4 Environment facts (verified â€” do not re-investigate)

- `node` v24.19.0 and `python` 3.14.7 are available.
- **No** ImageMagick, `cwebp`, `avifenc`, or `ffmpeg` are installed. Do not try to use them.
- **Pillow 12.3.0 is installed and has working WebP support.** Use it. It is the only image encoder available.
- `vercel` CLI is **not** installed. Do not try to run it.
- The repo has **no root `package.json`**, no `vercel.json`, and no `.vercel/` link. This site has never been deployed.
- The site is 2 files + 1 asset folder: `index.html` (668 lines), `style.css` (1912 lines), `assets/`.
- Front-end payload today: **20.0 MB** (excluding 3 orphan images). Target after Phase 2: **under 1.5 MB**.

---

## 2. Design tokens â€” the single source of truth for the rest of this document

All colours used anywhere in this spec are defined here. When a later phase says "the brand red", it means `var(--clr-red-accent)`.

| Token | Value | Contrast note | Replaces |
|---|---|---|---|
| `--clr-red-accent` | `#C92A1E` | white text on it = **5.48:1** (needs 4.5:1) | the old `#E63B2E` |
| `--clr-red-dark` | `#A11F16` | white text on it = **7.71:1**. Hover/active state | the old unused `#C92A1E` |
| `--clr-link` | `#0F5D8C` | on the mint `#EBF8E7` = **6.45:1** | the old `#2BB2FC` |
| `--clr-placeholder` | `#5A6B7D` | on white = **5.48:1** | the old `#c0ccda` |
| `--clr-bg-page` | `#EBF8E7` | unchanged | â€” |
| `--clr-white` | `#FFFFFF` | unchanged | â€” |
| `--clr-black` | `#111111` | on white = **18.88:1** | â€” |
| `--clr-text-muted` | `#555555` | on white = 7.45:1. Unchanged | â€” |
| `--clr-yellow-accent` | `#FED02F` | unchanged | â€” |
| `--clr-blue-box` | `#BCE7FD` | unchanged | â€” |
| `--clr-success-text` | `#085229` | on white, very high. **Keep** â€” it is a semantic success colour, not a brand colour | â€” |

Colours being **deleted** entirely: `#E63B2E`, `#F73D18`, `#F75F40`, `#FD0009`, `#D93025`, `#045AFF`, `#0346CC`, `#0F9992`, `#2BB2FC`, `#C0CCDA`, `#D3DCE6`, `#F7FAFC`, `#661d1d`, `#4A5568`, and the inline hex values in `index.html` listed in Phase 5.

---

# PHASE 1 â€” Repository and deploy hygiene

**Findings addressed:** D1, D2, D3, D4, D6 (partial)
**Commit message:** `chore: untrack internal dirs, add deploy ignores, delete orphan assets`

## 1.1 Rewrite `.gitignore`

Current contents are exactly 3 lines:
```
node_modules/
*.log
graphify-out/cache/
```

Replace with:
```
node_modules/
.next/
*.log
.vercel/

# Internal research + tooling. Not part of the deployed site.
graphify-out/
raw-source-code/
reference-images/
```

## 1.2 Untrack the internal directories

The repo tracks 157 files. 96 of them are internal tooling that has no business in a website repository. Remove them from git's index but **leave the files on disk**:

```powershell
git rm -r --cached graphify-out raw-source-code reference-images
```

Verify nothing was deleted from disk:
```powershell
Test-Path graphify-out\GRAPH_REPORT.md   # must be True
Test-Path raw-source-code\wix-index.html # must be True
Test-Path reference-images\reference_live_desktop.png  # must be True
```

`placeholder/node_modules/` and `placeholder/.next/` were already untracked. Leave `placeholder/` itself tracked â€” it is a separate Next.js prototype with its own Vercel project, and removing it is not part of this job.

Leave `.gitattributes` alone. It contains `graphify-out/graph.json merge=graphify`, which becomes inert once the path is untracked. That is harmless.

## 1.3 Delete the orphan images

Both are unreferenced by any HTML, CSS, or JS, and both are currently untracked:

```powershell
Remove-Item assets\images\hero_bg.bak.png
Remove-Item assets\images\hero_bg_og.bak.png
```

Also delete one orphan SVG that **is** tracked and unreferenced:
```powershell
Remove-Item assets\icons\hero_trophy.svg
```
Before deleting, confirm it is genuinely unreferenced:
```powershell
Select-String -Path index.html,style.css -Pattern 'hero_trophy'
```
Expected: no matches. **If it matches, stop and report â€” do not delete.**

Do **not** delete `raw-source-code/brevo-singup-form.html`. It is untracked but it is a useful reference; the directory is now gitignored anyway.

## 1.4 Create `.vercelignore` (new file, repo root)

The site has never been deployed, so the "22 MB is publicly accessible" risk in D1 is currently theoretical. This file exists so that when the owner *does* deploy, only the website ships.

```
graphify-out/
placeholder/
raw-source-code/
reference-images/
docs/
scripts/
AGENTS.md
.gitignore
.gitattributes
```

## 1.5 Create `vercel.json` (new file, repo root)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

> **Important consequence of the immutable cache rule, and a permanent obligation on whoever edits this site next:** files under `/assets/` are cached by the browser for one year and will **never** be revalidated. Therefore any future change to an asset's *content* must also change its *filename* (for example `hero_bg.webp` â†’ `hero_bg.v2.webp`), and `index.html` must be updated to match. If you do not do this, visitors will keep seeing the old image for a year. There is a reminder comment about this in `style.css` after Phase 5.

`index.html` is deliberately **not** given a `Cache-Control` header, so it keeps Vercel's default (revalidated on every load).

## 1.6 Fix `AGENTS.md`

Two problems: a typo, and no trailing newline.

- Line 12 reads `IMP: NEVER CHECK VISUALLY UNLESS I EXCPLICETLY TELL YOU TO!` â€” fix `EXPLICETLY` â†’ `EXPLICITLY`.
- Add a trailing newline at end of file.

Then append this section before the closing `---`:

```markdown
## 2. Site Architecture (as of the SPEC.md rework)
- Deployment: static site on Vercel. Config is `vercel.json` + `.vercelignore` at repo root. The owner runs the deploy.
- JavaScript lives in `assets/js/` as four separate `defer`-loaded files, each `'use strict'` inside an IIFE. No inline JS, no `onclick` attributes.
- Images are WebP, generated by `scripts/optimize_images.py` (Pillow). WebP only, no `<picture>` fallback.
- Fonts are self-hosted in `assets/fonts/`. No Google Fonts request, no `parastorage.com` request.
- Below 768px the navbar collapses to a hamburger menu.
- **Asset cache rule:** `/assets/*` is served `immutable` for one year. If you change an asset's content, you MUST rename the file.
- `docs/SPEC.md` is the executable spec. `docs/anti_ai_audit_findings.md` is its historical diagnosis.
```

## 1.7 Verification for Phase 1

```powershell
git status --porcelain
git ls-files | Measure-Object -Line     # must now be 67, was 157
Test-Path .vercelignore                 # True
Test-Path vercel.json                   # True
Test-Path placeholder\node_modules      # True (untouched on disk)
```

The tracked-file arithmetic, so the number is checkable rather than asserted: 157 tracked, minus 81 in `graphify-out/`, minus 5 in `raw-source-code/`, minus 5 in `reference-images/`, minus the 1 orphan `hero_trophy.svg` = 65, plus `.vercelignore` and `vercel.json` = **67**.

For reference, the end state after all 7 phases is **86** tracked files: the 67 above, minus the 8 original images deleted in Phase 2, plus 11 new images (7 WebP + 4 favicon/OG), plus 7 social icons, plus 1 script, plus 6 self-hosted fonts, plus `robots.txt` and `sitemap.xml`.

Commit everything in this phase.

---

# PHASE 2 â€” Images and assets

**Findings addressed:** F (whole section), D2, D6, and the `<img>` attribute findings
**Commit message:** `perf: convert all images to WebP, add dimension and priority attributes`

This is the single biggest win in the whole job. Today the front end ships **20.0 MB**. After this phase it should ship **under 1.5 MB**.

## 2.1 Create `scripts/optimize_images.py`

A committed, re-runnable script. It must be idempotent.

```python
"""One-time image pipeline for the OWGT site.

Converts the original committed photos to WebP at their real display size.

The originals are deleted from the working tree after conversion. They are NOT
lost: they remain in git history. To re-run this script from a clean clone:

    git show HEAD~1:assets/images/chapter_robot.jpg > assets/images/chapter_robot.jpg

Requires Pillow. Verified working: Python 3.14.7 + Pillow 12.3.0.
"""
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
```

Then append these two blocks to the same file.

**Favicon set** â€” derived from the existing 600Ã—600 `assets/images/favicon.png`:

```python
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
```

**Social icons** â€” download all 7, then normalise each to 32Ã—32:

```python
import urllib.request

ICONS = {
    "website.png":   "https://files.catbox.moe/7pxfdw.png",
    "discord.png":   "https://files.catbox.moe/sjbbap.png",
    "whatsapp.png":  "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fe904ecd51b2c15bbe.png",
    "youtube.png":   "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fd68548d1a9e9e5d03.png",
    "instagram.png": "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fe904ecd51b2c15bbf.png",
    "tiktok.png":    "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fde9317f1e0cc03932.png",
    "x.png":         "https://img.mailinblue.com/11778395/images/content_library/original/6a6bb0fef5dbd497f00a1048.png",
}
SOCIAL = ROOT / "assets" / "icons" / "social"
SOCIAL.mkdir(parents=True, exist_ok=True)
for name, url in ICONS.items():
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req).read()
    with Image.open(io.BytesIO(data)) as im:
        im.convert("RGBA").resize((32, 32), Image.LANCZOS) \
          .save(SOCIAL / name, "PNG", optimize=True)
    print(f"assets/icons/social/{name}: 32x32")
```

Add `import io` to the imports at the top of the file.

> **Two environment gotchas, both already diagnosed â€” do not rediscover them:**
> 1. `img.mailinblue.com` returns **HTTP 403** to a plain Python request with no `User-Agent`. The `Mozilla/5.0` header above is required. It is not a broken URL.
> 2. `files.catbox.moe` may fail to resolve on the default DNS resolver. If it fails with a DNS error, resolve it via public DNS (`Resolve-DnsName files.catbox.moe -Server 8.8.8.8`) and retry. Both catbox URLs are verified live and return valid PNGs.

Verified source dimensions and outputs â€” check your results against this table:

| Source | Source px | Output file | Output px | Bytes before | Bytes after (approx) |
|---|---|---|---|---|---|
| `hero_bg.png` | 1678Ã—937 | `hero_bg.webp` | 1678Ã—937 | 1,298 KB | ~120 KB |
| `owgt-logo.png` | 1254Ã—1254 | `owgt-logo.webp` | 320Ã—320 | 695 KB | ~12 KB |
| `volunteer_hackathon.jpg` | 2639Ã—2048 | `volunteer_hackathon.webp` | 1920Ã—1490 | 622 KB | ~180 KB |
| `board_member_1.jpg` | 4032Ã—3024 | `board_member_1.webp` | 760Ã—570 | 2,336 KB | ~45 KB |
| `board_member_2.jpg` | 4032Ã—3024 | `board_member_2.webp` | 760Ã—570 | 2,419 KB | ~48 KB |
| `board_member_3.jpg` | 2518Ã—3358 | `board_member_3.webp` | 570Ã—760 | 311 KB | ~40 KB |
| `chapter_robot.jpg` | 5000Ã—3333 | `chapter_robot.webp` | 1320Ã—880 | 12,443 KB | ~110 KB |
| `favicon.png` | 600Ã—600 | `favicon-16/32.png`, `apple-touch-icon.png`, `favicon.ico`, `og-image.jpg` | see script | 190 KB + 75 KB | ~30 KB total |
| 7 social icons | 158â€“3391 px | `assets/icons/social/*.png` | 32Ã—32 | n/a (remote) | ~8 KB total |

**Note on the hero image:** `hero_bg.png` is 1678 px wide and is displayed full-bleed. It is **not** upscaled â€” upscaling would make it blurrier, and the LCP problem is a bytes problem, not a resolution problem. 1678 px covers the 1440 px target viewport at ~1.16Ã—. This is a deliberate decision; do not "fix" it by upscaling.

**Note on the X icon:** its source is 3391Ã—3391 / 169 KB, far larger than the other six. That is why it is normalised to 32Ã—32 like the rest.

## 2.2 Delete the originals

After the script has run successfully and you have verified each output exists:

```powershell
Remove-Item assets\images\hero_bg.png, assets\images\owgt-logo.png
Remove-Item assets\images\volunteer_hackathon.jpg
Remove-Item assets\images\board_member_1.jpg, assets\images\board_member_2.jpg, assets\images\board_member_3.jpg
Remove-Item assets\images\chapter_robot.jpg
Remove-Item assets\images\favicon.png
```

All of these remain recoverable from git history, which is what makes the script re-runnable.

## 2.3 Point every reference at the `.webp` files

Exactly three places reference the raster images:

| File | Line | Change |
|---|---|---|
| `style.css` | 184 | `url('assets/images/hero_bg.png')` â†’ `url('assets/images/hero_bg.webp')` |
| `index.html` | 47 | `src="assets/images/owgt-logo.png"` â†’ `.webp` |
| `index.html` | 78 | `src="assets/images/volunteer_hackathon.jpg"` â†’ `.webp` |
| `index.html` | 125 | `src="assets/images/board_member_1.jpg"` â†’ `.webp` |
| `index.html` | 146 | `src="assets/images/board_member_3.jpg"` â†’ `.webp` |
| `index.html` | 167 | `src="assets/images/board_member_2.jpg"` â†’ `.webp` |
| `index.html` | 202 | `src="assets/images/chapter_robot.jpg"` â†’ `.webp` |
| `index.html` | 563 | `bgImg.src = 'assets/images/hero_bg.png'` â†’ `.webp` (this line moves to `assets/js/hero-canvas.js` in Phase 6 â€” do it in Phase 6, not now) |

> Watch the file-numbering trap: `board_member_3.jpg` is **Arham Bafna** (index.html:146) and `board_member_2.jpg` is **Panshul Kadam** (index.html:167). The numbering does not match the card order. Do not "fix" it â€” the mapping is correct as-is, and renaming files is not part of this job.

## 2.4 Add `width`, `height`, `loading`, `decoding` to all 17 `<img>` elements

No `<img>` in the file currently has any of these. The `width`/`height` values must be the **intrinsic pixel size of the new file** from the table in 2.1 â€” that is what lets the browser reserve the right box before the image loads (this is the CLS fix).

| Line | File | Add `width` / `height` | Add `loading` | Add `decoding` |
|---|---|---|---|---|
| 47 | `owgt-logo.webp` | `320` / `320` | `eager` | `async` |
| 52 | `arrow_down.svg` | `20` / `20` | `eager` | `async` |
| 78 | `volunteer_hackathon.webp` | `1920` / `1490` | `lazy` | `async` |
| 90 | `email_envelope.svg` | `140` / `146` | `lazy` | `async` |
| 125 | `board_member_1.webp` | `760` / `570` | `lazy` | `async` |
| 129 | `badge_gold.svg` | `38` / `38` | `lazy` | `async` |
| 146 | `board_member_3.webp` | `570` / `760` | `lazy` | `async` |
| 150 | `badge_ribbon.svg` | `38` / `38` | `lazy` | `async` |
| 167 | `board_member_2.webp` | `760` / `570` | `lazy` | `async` |
| 171 | `badge_ribbon.svg` | `38` / `38` | `lazy` | `async` |
| 195 | `trophy.svg` | `66` / `85` | `lazy` | `async` |
| 196 | `spaceinvader.svg` | `58` / `44` | `lazy` | `async` |
| 198 | `console.svg` | `74` / `84` | `lazy` | `async` |
| 202 | `chapter_robot.webp` | `1320` / `880` | `lazy` | `async` |
| 212 | `icecream.svg` | `60` / `64` | `lazy` | `async` |
| 214 | `coin.svg` | `52` / `52` | `lazy` | `async` |
| 232 | `trophy_right.svg` | `68` / `68` | `lazy` | `async` |

**Where the raster numbers come from:** straight from the output table in 2.1.

**Where the SVG numbers come from â€” read this, it is not guesswork.** For each icon, the `width` attribute is the width already declared in `style.css`, and the `height` attribute is that width scaled by the icon's own `viewBox` aspect ratio. The viewBoxes, measured from the files, are:

| File | `viewBox` w Ã— h | CSS width | `width` attr | `height` attr |
|---|---|---|---|---|
| `arrow_down.svg` | 137 Ã— 160 | 20 px, **and CSS forces `height: 20px`** | 20 | **20** |
| `badge_gold.svg` | 100.584 Ã— 111.591 | 38 px, **and CSS forces `height: 38px`** | 38 | **38** |
| `badge_ribbon.svg` | 68.618 Ã— 110.804 | 38 px, **and CSS forces `height: 38px`** | 38 | **38** |
| `trophy.svg` | 133.326 Ã— 171.015 | 66 px, `height: auto` | 66 | 66 Ã— 171.015/133.326 = **85** |
| `spaceinvader.svg` | 161.367 Ã— 121.004 | 58 px, `height: auto` | 58 | 58 Ã— 121.004/161.367 = **44** |
| `console.svg` | 151.277 Ã— 171.416 | 74 px, `height: auto` | 74 | 74 Ã— 171.416/151.277 = **84** |
| `icecream.svg` | 152.182 Ã— 161.582 | 60 px, `height: auto` | 60 | 60 Ã— 161.582/152.182 = **64** |
| `coin.svg` | 171.044 Ã— 171.012 | 52 px, `height: auto` | 52 | 52 Ã— 171.012/171.044 = **52** |
| `trophy_right.svg` | 171.043 Ã— 171.012 | 68 px, `height: auto` | 68 | 68 Ã— 171.012/171.043 = **68** |
| `email_envelope.svg` | 153.6 Ã— 160.4 | 140 px, `height: auto` | 140 | 140 Ã— 160.4/153.6 = **146** |

Three of these (the arrow and the two badges) have an explicit `height` in CSS, so the rendered box is square regardless of the file's own proportions. Use the square value for those. The other seven use `height: auto`, so the rendered height follows the file's aspect ratio and the `height` attribute must match it or the box will jump when the icon loads.

To re-measure the viewBoxes yourself rather than trusting the table:
```powershell
Get-ChildItem assets\icons\*.svg | ForEach-Object {
  $vb = [regex]::Match((Get-Content $_.FullName -Raw), 'viewBox="([^"]+)"').Groups[1].Value
  "{0,-22} {1}" -f $_.Name, $vb
}
```

`loading="eager"` is set on the two above-the-fold images (the hero logo and the scroll arrow) and `loading="lazy"` on the other 15. Do not make the hero logo lazy.

## 2.5 Priority-hint the LCP image

The hero background is a CSS `url()`, which cannot carry `fetchpriority`. Preload it in `<head>`, immediately after the `style.css` link:

```html
<link rel="preload" as="image" href="assets/images/hero_bg.webp" type="image/webp" fetchpriority="high">
```

This is the fix for the ~14 s cold-cache LCP. It combines with the 1.3 MB â†’ 120 KB reduction in 2.1.

## 2.6 Verification for Phase 2

```powershell
Get-ChildItem assets\images | Select-Object Name, Length          # every .webp under ~250 KB
Get-ChildItem assets\icons\social | Measure-Object -Property Length -Sum   # must be 7 files, sum < 15 KB
(Get-ChildItem assets -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB   # must be < 1.5
Select-String -Path index.html,style.css -Pattern '\.(png|jpg)' | Where-Object { $_.Line -notmatch 'favicon|apple-touch|og-image' }
```

The last command must return **no matches** other than the favicon/apple-touch/og-image files. Every other raster reference must be `.webp`.

---

# PHASE 3 â€” Copy and content

**Findings addressed:** A5, A6, A9, A10, B1, B2, B3, B4, B5, B8, E2, and the Fake Button tell
**Commit message:** `content: fix placeholder links, rewrite copy, add tagline and social links`

Every string in this phase is **final and owner-approved**. Reproduce them character for character. Use a straight ASCII apostrophe (`'`) in all of them, not a typographic one.

## 3.1 Add the mission tagline (A10) â€” after `index.html` line 50

Insert directly after the closing `</h1>`:

```html
<p class="hero-tagline">Empowering students through education in Technology and STEM.</p>
```

> Provenance: this is the organisation's own existing public bio on its Linktree profile. It is not newly written copy. The live Wix site carries a different, shorter line ("Empowering Through Technology") and a different long-form LinkedIn description; the owner chose this one.

## 3.2 Fix the chapter document link (A5, A6)

Replace `index.html` lines 241â€“245 in their entirety:

```html
                            <p class="chapter-step-item">2. Read the
                                <a href="https://docs.google.com/document/d/1wQN0EYEotGkmmxmiwakH54kE5x3_2ta4iUAE6FqPLsU/edit?usp=sharing"
                                    target="_blank" rel="noopener noreferrer" class="chapter-link">chapter guidelines</a>
                                for more details.
                            </p>
```

Three things are being fixed at once:
- The dead link becomes a real one. The link the live Wix site used was an expired Discord CDN URL that now returns **404**; the same document is alive on Google Docs with the identical title "OWGT Chapter Official Guidelines and Outline".
- The AI-facing HTML comment on line 242 is deleted. **No HTML comment in this file may instruct an AI.** See Â§1.2.
- The verb changes from "Download" to "Read" because the link opens an online document rather than downloading a file.

## 3.3 Rewrite the volunteer paragraph (B1)

Replace `index.html` lines 73â€“75:

```html
                    <p class="volunteer-desc">Volunteering with OWGT means real work with real outcomes: running
                        workshops, helping students start chapters, and supporting events. You'll log your hours, get
                        a signed recognition letter, and be part of the team rather than a name on a roster.</p>
```

## 3.4 Add the volunteer button (B5)

The heading "Want to volunteer?" currently leads to a dead end. Wrap the paragraph and a new button in a single flex child so the existing two-column header layout is preserved, replacing lines 72â€“76:

```html
                <h2 class="volunteer-title">Want to volunteer?</h2>
                <div class="volunteer-copy">
                    <p class="volunteer-desc">Volunteering with OWGT means real work with real outcomes: running
                        workshops, helping students start chapters, and supporting events. You'll log your hours, get
                        a signed recognition letter, and be part of the team rather than a name on a roster.</p>
                    <a href="#join" class="btn-apply">Apply to volunteer</a>
                </div>
```

`#join` is the application-steps section, `index.html` line 85. It is already a valid in-page target.

## 3.5 Rewrite all three board bios (B2, B3, B4)

All three currently open with the same robotic template ("Hey my name is X, one of the two vice presidents at OWGT"). All three are replaced with distinct, owner-approved copy.

**Artham Juvariwala** â€” replace lines 135â€“137:
```html
                            <p class="board-bio">Artham founded OWGT in 2024 to close the gap between local students
                                and technology. He leads the workshops and the chapter programme, which have now
                                reached thousands of students.</p>
```

**Arham Bafna** â€” replace lines 157â€“158:
```html
                            <p class="board-bio">Arham runs OWGT's day-to-day operations: organising events, keeping
                                projects moving, and building out each new chapter. He handles the logistics so the
                                rest of the team can focus on teaching.</p>
```

**Panshul Kadam** â€” replace lines 178â€“179:
```html
                            <p class="board-bio">Panshul looks after how OWGT shows up in the world: social channels,
                                video, and the written material that goes out to students and schools. If you have
                                seen an OWGT post, he made it.</p>
```

> Note the colon in Panshul's bio. An earlier draft used an em dash there; the owner asked for it to be removed. Do not reintroduce a dash.

## 3.6 Strip the Wix tracking parameter (B8)

`index.html` line 97 currently reads:
```
https://docs.google.com/forms/d/e/1FAIpQLSfauNjJtauYoJVWCbJ-x_DOIImOuDt_KVne1F6-_Ilmvt_xFw/viewform?usp=sharing&ouid=103293439982167147921
```

Replace the `href` value with:
```
https://docs.google.com/forms/d/e/1FAIpQLSfauNjJtauYoJVWCbJ-x_DOIImOuDt_KVne1F6-_Ilmvt_xFw/viewform?usp=send_form
```

`ouid=103293439982167147921` is a Wix account identifier that leaked into the published page. `?usp=send_form` is the clean canonical form URL, verified to resolve to the same live "OWGT Team Application Form". Keep `target="_blank" rel="noopener noreferrer"`.

## 3.7 Make the two email addresses clickable (E2)

`index.html` line 104:
```html
                            <strong><a href="mailto:oneworldgreatertogether@gmail.com" class="email-link">oneworldgreatertogether@gmail.com</a></strong>.
```

`index.html` line 400:
```html
                    <p class="footer-email"><a href="mailto:oneworldgreatertogether@gmail.com" class="email-link">oneworldgreatertogether@gmail.com</a></p>
```

Add a small CSS rule in Phase 5 (`.email-link`).

## 3.8 Restyle the "None yet" element (Fake Button tell)

`index.html` line 62 stays **exactly as it is**:
```html
                    <span class="btn-tbd">None yet, check back soon...</span>
```

Owner decision: the wording is honest and stays. What changes is that it must stop *looking* like a button. The CSS work is in Phase 5, task 5.6 â€” the element is a white status chip, not a red button.

## 3.9 Add the social links to the footer (A9)

Insert between the closing `</div>` of `.footer-brand-side` (line 397) and the opening of `.footer-meta-side` (line 398):

```html
            <nav class="footer-social" aria-label="OneWorldGreaterTogether on social media">
                <a href="https://owgt.org/" target="_blank" rel="noopener noreferrer" title="OWGT website">
                    <img src="assets/icons/social/website.png" alt="OWGT website" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://discord.gg/PBMJax829D" target="_blank" rel="noopener noreferrer" title="OWGT on Discord">
                    <img src="assets/icons/social/discord.png" alt="OWGT on Discord" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://chat.whatsapp.com/CMnYLIvdF7hB5SQ86dcib7" target="_blank" rel="noopener noreferrer" title="OWGT on WhatsApp">
                    <img src="assets/icons/social/whatsapp.png" alt="OWGT on WhatsApp" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://www.youtube.com/@OneWorldGreaterTogether" target="_blank" rel="noopener noreferrer" title="OWGT on YouTube">
                    <img src="assets/icons/social/youtube.png" alt="OWGT on YouTube" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://www.instagram.com/oneworldgreatertogether" target="_blank" rel="noopener noreferrer" title="OWGT on Instagram">
                    <img src="assets/icons/social/instagram.png" alt="OWGT on Instagram" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://www.tiktok.com/@oneworldgreatertogether" target="_blank" rel="noopener noreferrer" title="OWGT on TikTok">
                    <img src="assets/icons/social/tiktok.png" alt="OWGT on TikTok" width="32" height="32" loading="lazy" decoding="async">
                </a>
                <a href="https://x.com/USOWGT" target="_blank" rel="noopener noreferrer" title="OWGT on X">
                    <img src="assets/icons/social/x.png" alt="OWGT on X" width="32" height="32" loading="lazy" decoding="async">
                </a>
            </nav>
```

Provenance and verification notes, all checked against live sources:

- All 7 icons come from the OWGT newsletter's own footer, downloaded into the repo by Phase 2. They are **not** hotlinked. The source URLs are listed in `scripts/optimize_images.py`.
- The first icon's `href` is `https://owgt.org/` â€” the newsletter still points it at the old Wix address, but on the website it must point at the new site.
- `x.com` is used with `https://`, not the `http://` that appears in the newsletter.
- All 7 URLs were fetched and confirmed to return HTTP 200 with valid PNG content. Sizes before normalisation ranged from 158 px to 3391 px; all are stored at 32Ã—32.
- **Two links are deliberately absent.** Facebook was considered and dropped: the profile the organisation links is technically live but has one follower and no content. LinkedIn was dropped: it is not linked from any OWGT page, and its company page has two followers. The owner chose the newsletter's exact set. Do not add either.
- One `discord.gg` invite is `PBMJax829D` and another that circulates is `66J5jucDZD`. Both point at the same 175-member server. The newsletter's code is the one in use.

## 3.10 Verification for Phase 3

```powershell
Select-String -Path index.html -Pattern 'PLACEHOLDER|ouid=|href="#"'
```
Expected: **no matches.** (`href="#"` is removed in Phase 4, so run this again after Phase 4.)

```powershell
Select-String -Path index.html -Pattern 'Empowering students through education|Apply to volunteer|chapter guidelines|mailto:oneworldgreatertogether|footer-social'
```
Expected: 5 matches.

---

# PHASE 4 â€” HTML semantics and accessibility

**Findings addressed:** B10 (structure), G3, G4, G5, G6, H7, plus the `href="#"` cleanup
**Commit message:** `refactor: semantic buttons, labelled form fields, modal a11y, mobile nav toggle`

## 4.1 Wrap the page content in `<main>`

The document has no `<main>` element. Open one immediately after `</header>` (line 36) and close it immediately before `<footer>` (line 388).

## 4.2 Convert the two fake RSVP links into real buttons

`index.html` line 33:
```html
                <button type="button" class="nav-rsvp-btn" data-rsvp-open>RSVP</button>
```

`index.html` line 63:
```html
                <button type="button" class="btn-rsvp" data-rsvp-open>RSVP</button>
```

`<a href="#">` is wrong for both of these: they perform an action, they do not navigate, and `href="#"` makes them unusable without JavaScript while advertising a destination that does not exist.

## 4.3 Add the mobile nav toggle (G1)

Replace the navbar markup, `index.html` lines 24â€“36:

```html
    <header class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="#welcome">OneWorldGreaterTogether</a>
            </div>
            <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-links"
                aria-label="Open menu">
                <span class="nav-toggle-bar"></span>
                <span class="nav-toggle-bar"></span>
                <span class="nav-toggle-bar"></span>
            </button>
            <nav class="nav-links" id="nav-links">
                <a href="#join" class="nav-link">Join</a>
                <a href="#chapter" class="nav-link">Chapter</a>
                <a href="#newsletter" class="nav-link">Newsletter</a>
                <button type="button" class="nav-rsvp-btn" data-rsvp-open>RSVP</button>
            </nav>
        </div>
    </header>
```

**Why this is necessary, with the number:** at the 390 px target viewport the navbar currently computes to a minimum width of **443 px**, so it overflows by 53 px and the RSVP button at the far right is clipped and pushed off-screen. The current mobile CSS at `style.css` lines 1690â€“1707 and 1891â€“1907 already shrinks the logo, the link text and the button at 768 px and again at 480 px, and it is still 53 px over. Shrinking further would make the links unreadable. Collapsing the links behind a toggle is the fix. This is item 1 of the 5 the owner verifies by eye (Â§10).

## 4.4 Label both email fields (G6)

Newsletter field â€” replace `index.html` lines 337â€“341:

```html
                                                <div class="entry__field">
                                                    <label class="field-label" for="EMAIL">Email address</label>
                                                    <input class="input " type="text" id="EMAIL" name="EMAIL"
                                                        autocomplete="email" inputmode="email" value=""
                                                        placeholder="you@example.com" data-required="true" required />
                                                </div>
```

Two fixes in one edit. There was no `<label>` at all, so screen readers announced only "edit text" (G6). And `autocomplete="off"` was actively breaking browser autofill for real visitors (H10).

Keep `type="text"`, not `type="email"`. Brevo's vendor script keys off the existing field configuration, and changing the input type risks altering its client-side validation. `inputmode="email"` gets the mobile numeric/email keyboard without touching validation.

RSVP field â€” replace `index.html` lines 417â€“421:

```html
                    <div class="rsvp-input-group">
                        <label class="field-label" for="rsvp-email">Email address</label>
                        <input type="email" id="rsvp-email" name="EMAIL" placeholder="you@example.com" required
                            autocomplete="email" class="rsvp-email-input">
                        <div id="rsvp-error" class="rsvp-error-text" role="alert" aria-live="polite" style="display: none;"></div>
                    </div>
```

`role="alert"` plus `aria-live="polite"` is what makes the new failure message in Phase 6 actually get announced instead of silently appearing.

## 4.5 Give the RSVP form a no-JavaScript fallback (H7)

`index.html` line 416 currently has no `action` and no `method`, so if JavaScript fails to load the form does nothing at all. Replace the opening tag:

```html
                <form id="rsvp-popup-form" action="https://sibforms.com/serve/MUIFAFd-ELRb80KAFGK8Vzt-7DWyP7ieFIfLymcOXoiObnRsTS9d1pBMH9Ow1iVmZRCF2cij5ugrXvTAMonnYXnxHgcjYf3aVdfjFTrU1kqMRyQKEZhKXVNCz12FyHI77T7q2Nqh4pOETlvaT56-UWuwBSzuzvUVk6-UeiyQEnI9rIczo67djuwGEj371o-yRl5m5NJ0tz28ygIFZA==" method="POST">
```

> **Copy the `action` value from `index.html` line 287 rather than typing it.** The URL is 239 characters of base64 and a single wrong character silently breaks newsletter signups. The value in the block above is correct, but treat line 287 in the file as the authority. Phase 6 removes the second hardcoded copy in JavaScript, and the Phase 6 verification asserts the two remaining copies are byte-identical.

Remove the `onsubmit` attribute; Phase 6 attaches the listener in JavaScript.

## 4.6 Delete the placeholder toast modal (A5 follow-through)

Delete `index.html` lines 444â€“450 in their entirety (the whole `<!-- Placeholder Toast Modal -->` block, `#toast-modal` and its children).

This is now unreachable: the only thing that opened it was the broken document link, which now points at a real Google Doc. Its CSS is removed in Phase 5.

## 4.7 Remove every inline event handler

`index.html` currently has 7 `onclick` attributes (lines 33, 63, 243, 407, 409, 439, 448) and 1 `onsubmit` (line 416). All are removed in this phase or Phase 6, replaced by data attributes and delegated listeners:

| Old | New |
|---|---|
| `onclick="openRsvpModal(event)"` (33, 63) | `data-rsvp-open` â€” done in 4.2 |
| `onclick="showToast(event)"` (243) | deleted with the placeholder link, Phase 3 |
| `onclick="closeRsvpModal()"` (407, 409, 439) | `data-rsvp-close` |
| `onclick="closeToast()"` (448) | deleted with the toast, 4.6 |
| `onsubmit="handleRsvpSubmit(event)"` (416) | `addEventListener` in `assets/js/modal.js`, Phase 6 |

`index.html` line 407 (the backdrop) and 409 and 439:
```html
            <div class="rsvp-modal-backdrop" data-rsvp-close></div>
            <button type="button" class="rsvp-close-icon" data-rsvp-close aria-label="Close modal">&times;</button>
            <button type="button" class="rsvp-close-btn" data-rsvp-close>Close</button>
```

## 4.8 Fix the alt text on decorative images

Ten of the 17 images are decorative. Their current alt text is noise for a screen reader.

| Line | Current `alt` | New |
|---|---|---|
| 47 | `OWGT Logo` | `alt=""` â€” the `<h1>` already spells the organisation name; this image sits inside the letter "O" |
| 52 | `Scroll Down Arrow` | `alt=""` â€” the wrapping `<a>` already has `aria-label="Scroll to next section"` |
| 90 | `Email Envelope Pixel Art` | `alt=""` |
| 129 | `President Gold Badge` | `alt=""` â€” the role text "President" is right beside it |
| 150, 171 | `Vice President Ribbon` | `alt=""` â€” same reason |
| 195, 196, 198, 212, 214, 232 | `Pixel Art Trophy` etc. | `alt=""` |

Leave the informative ones alone: line 78 (hackathon photo), 125 / 146 / 167 (board member names), 202 (robotics photo).

## 4.9 Add the permanent asset-cache reminder

Immediately above the `.hero-bg-base` rule in `style.css`, add:

```css
/* ASSET CACHE RULE: /assets/* is served with `immutable` for one year (vercel.json).
   If you change an image's CONTENT, you MUST also change its FILENAME (e.g. hero_bg.v2.webp)
   and update every reference. Otherwise visitors keep the old file for a year. */
```

## 4.10 Verification for Phase 4

```powershell
Select-String -Path index.html -Pattern 'onclick=|onsubmit=|href="#"|PLACEHOLDER|toast'
```
Expected: **no matches.**

```powershell
Select-String -Path index.html -Pattern 'data-rsvp-open|data-rsvp-close|for="EMAIL"|for="rsvp-email"|id="nav-toggle"|<main>'
```
Expected: at least 8 matches.

```powershell
$html = Get-Content index.html -Raw
[regex]::Matches($html, '<img').Count       # 24 total: 17 original + 7 social
[regex]::Matches($html, '<img(?![^>]*\balt=)').Count   # must be 0
[regex]::Matches($html, '<img(?![^>]*\bloading=)').Count # must be 0
```

---

# PHASE 5 â€” CSS

**Findings addressed:** G2, G3, G5, J5, J6â€“J7, J8, J10, J11, J12, J13, J14, E2 styling, and the 3.3/3.4/3.8/3.9 additions from Phase 3
**Commit message:** `style: consolidate to one red, unify buttons, add focus rings and mobile nav`

This is the largest phase. Work through the tasks in order; several depend on the ones before.

## 5.1 Rewrite the design tokens (`style.css` lines 18â€“56)

Replace these five declarations:

```css
    --clr-red-accent: #C92A1E;
    --clr-red-dark: #A11F16;
    --clr-link: #0F5D8C;
    --clr-placeholder: #5A6B7D;
    --clr-success-text: #085229;
```

`--clr-red-accent` changes value from `#E63B2E` to `#C92A1E`. This is the single most visible change in the whole job and it is item 3 of the 5 the owner checks by eye.

**Why the darker red:** the site previously used `#F73D18` on the nav RSVP button and `#E63B2E` on other elements. White text on those measures **3.73:1** and **4.18:1** respectively, against a required minimum of 4.5:1. White on `#C92A1E` measures **5.48:1**. The brightest red on the site was the least readable one, so the fix and the consolidation happen to be the same change.

Then delete these now-unused tokens: `--clr-dark` (line 23), `--clr-text-light` (line 29), `--clr-radius`â€¦ no. Precisely: delete `--clr-dark`, `--clr-text-light`, and `--radius-prizes` (line 37).

**Before deleting any token, prove it is unreferenced:**
```powershell
foreach ($t in '--clr-dark','--clr-text-light','--radius-prizes') {
  $n = (Select-String -Path style.css -Pattern ([regex]::Escape($t)) | Where-Object { $_.Line -notmatch '^\s*--' }).Count
  "$t : $n uses"
}
```
Every count must be 0. If any is not 0, keep the token and report.

## 5.2 Consolidate every red to the token (J5)

Replace these values wherever they appear:

| Old value | Where | New |
|---|---|---|
| `#F73D18` | line 152 `.nav-rsvp-btn` background | `var(--clr-red-accent)` |
| `#F75F40` | line 422 `.btn-rsvp:hover` background | `var(--clr-red-dark)` |
| `#fd0009` | line 1052 `.newsletter-headline-text` color, **and** the inline `style` on `index.html` line 292 | `var(--clr-red-accent)` |
| `#d93025` | line 1551 `.rsvp-error-text` color | `var(--clr-red-accent)` |
| `#E63B2E` | already the token; also embedded in the `rgba(230,59,46,â€¦)` box-shadows on lines 401 and 1159 | `rgba(201, 42, 30, â€¦)` |

For the newsletter headline, note this is also a small accessibility *improvement*: `#fd0009` on the mint `#EBF8E7` measured 3.69:1; `var(--clr-red-accent)` on the same background measures 4.99:1.

## 5.3 Fix the two remaining contrast failures (G2)

| Selector | Property | Old | New | Result |
|---|---|---|---|---|
| `#sib-container input::placeholder` (line 1204) | `color` | `#c0ccda` | `var(--clr-placeholder)` | 5.48:1 on white (was 1.63:1) |
| `#sib-container a` (line 1216) | `color` | `#2BB2FC` | `var(--clr-link)` | 6.45:1 on mint (was 2.15:1) |

The placeholder rule is declared twice, at lines 1197 and 1204. Line 1193â€“1198 is the whole `#sib-container input:-ms-input-placeholder` block, which is Internet Explorer syntax that no current browser matches. **Delete lines 1193â€“1198 entirely** (this is the J13 dead-CSS item) and apply the new colour to the single remaining `input::placeholder` rule at line 1200.

The `#sib-container textarea::placeholder` rule at lines 1207â€“1212 targets a textarea that does not exist in this form. Delete it as dead CSS, but keep its `color` value aligned with the input rule in case a textarea is ever added.

## 5.4 Unify the button system (J6â€“J7)

The site has 8 different button definitions. It ends with **two tiers and one shape**.

**Tier 1 â€” primary action.** Red pill. Used by: nav RSVP, events RSVP, RSVP modal submit, newsletter join.

```css
.nav-rsvp-btn,
.btn-rsvp,
.rsvp-submit-btn,
.newsletter-section .sib-form-block__button {
    background-color: var(--clr-red-accent);
    color: var(--clr-white);
    border: none;
    border-radius: var(--radius-pill);
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.25s ease, transform 0.25s ease;
}

.nav-rsvp-btn:hover,
.btn-rsvp:hover,
.rsvp-submit-btn:hover,
.newsletter-section .sib-form-block__button:hover {
    background-color: var(--clr-red-dark);
    transform: translateY(-2px);
}
```

Then delete the old per-button `background-color`, `color`, `border-radius` and hover rules at lines 151â€“164, 405â€“424, 1556â€“1581, and 1278â€“1292. Keep each button's `padding`, `font-size`, `min-width` and `display` â€” those are per-component sizing, not style inconsistencies.

Two specific changes fall out of this:
- `.btn-rsvp` was `background-color: #000000`. It becomes red. Black stays reserved for Tier 2.
- The newsletter button's teal `#0f9992` (inline on `index.html` line 353) and its box-shadow `rgba(15, 153, 146, 0.3)` / `rgba(15, 153, 146, 0.4)` (lines 1285, 1290) go away. The button becomes red, and its shadow becomes `0 4px 14px rgba(201, 42, 30, 0.3)`. This also fixes the third contrast failure in G2: white on `#0f9992` measured 3.50:1.

**Tier 2 â€” secondary.** Black pill. Used by: RSVP modal "Close" (`.rsvp-close-btn`). Leave line 1617â€“1632 exactly as it is.

**Status chip â€” not a button.** See 5.6.

## 5.5 Bring the RSVP modal into the site palette (J7)

The modal is currently blue (`#045AFF`, `#0346CC`, `#0f9992`) on a blue-grey input, and has nothing to do with the rest of the site. Replace:

| Line | Property | Old | New |
|---|---|---|---|
| 1511 | `.rsvp-title` `color` | `#045AFF` | `var(--clr-black)` |
| 1536 | `.rsvp-email-input` `background-color` | `#f7fafc` | `var(--clr-white)` |
| 1537 | `.rsvp-email-input` `border` | `1.5px solid #d3dce6` | `2px solid rgba(0, 0, 0, 0.16)` â€” matches the newsletter input at line 1258 |
| 1544 | `:focus` `border-color` | `#045AFF` | `var(--clr-black)` |
| 1546 | `:focus` `box-shadow` | `0 0 0 3px rgba(4, 90, 255, 0.15)` | `0 0 0 3px rgba(201, 42, 30, 0.18)` |
| 1559 | `.rsvp-submit-btn` `background-color` | `#045AFF` | handled by 5.4 |
| 1575 | `:hover` `background-color` | `#0346cc` | handled by 5.4 |
| 1605 | `.rsvp-success-svg` `color` | `#0f9992` | `#0B7A34` |
| 1613 | `.rsvp-success-title` `color` | `#085229` | `var(--clr-success-text)` (same value, now a token) |

Also delete the hardcoded `#222` on `.rsvp-close-icon` (line 1494) and `#111111` on `.rsvp-email-input` (line 1535) in favour of `var(--clr-black)`.

## 5.6 Turn the "None yet" element into a status chip (Fake Button tell)

Replace the whole `.btn-tbd` rule at lines 390â€“403:

```css
.btn-tbd {
    background-color: var(--clr-white);
    color: var(--clr-black);
    border: 1.5px solid rgba(0, 0, 0, 0.16);
    padding: 0.6rem 1.6rem;
    border-radius: var(--radius-pill);
    font-size: 0.95rem;
    font-weight: 600;
    width: auto;
    min-width: 0;
    text-align: center;
    display: inline-block;
    cursor: default;
}
```

What this fixes: the element was `#E63B2E` with white text, a pill shape and a red drop shadow â€” pixel-for-pixel a primary button, and completely inert. It is now a white outlined chip with no shadow and `cursor: default`. It still says the same words (owner decision, Phase 3 task 3.8), and now it reads as a status message rather than a broken button. `#111111` on white is 18.88:1.

This also removes the last use of `--radius-events`, so delete that token too (see 5.1's verification method).

## 5.7 Add a global focus ring (G3)

The site currently has **one** `:focus-visible` rule in 1912 lines, and it applies only to the newsletter checkbox. Keyboard users tabbing through the nav, the logo, the buttons, the links and the modal get no visible focus at all.

Add once, immediately after the `a { â€¦ }` rule at lines 84â€“87:

```css
:focus-visible {
    outline: 3px solid var(--clr-red-accent);
    outline-offset: 2px;
}
```

Then:
- Delete `outline: none;` at line 1262 (`.newsletter-section .entry__field input.input`) and line 1539 (`.rsvp-email-input`). Both are what suppress the native focus ring on real form fields.
- Keep the existing `.custom-checkbox-input:focus-visible + .custom-checkbox-box` rule at lines 1172â€“1175. It is more specific and still correct.

## 5.8 Fix the invisible-but-focusable hero reset button (G5, B10)

The owner decided to **keep** this control. It only appears once you scratch the grey off the hero, and it is a real feature.

Two changes make it correct:

**(a)** In `.hero-reset-btn` (lines 206â€“224), add `visibility: hidden;` alongside the existing `opacity: 0;`. This removes it from the tab order and from the accessibility tree while invisible, which `opacity: 0` alone does not do. Update the transition to include visibility:

```css
    transition: opacity 0.3s ease, transform 0.2s ease, visibility 0.3s ease;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(10px);
```

And in `.hero-reset-btn.is-visible` (lines 226â€“230), add `visibility: visible;`.

**(b)** In `index.html` line 42, add a `title` so the control explains itself on hover:

```html
        <button id="hero-reset-btn" class="hero-reset-btn" type="button" aria-label="Reset colors" title="Reset the hero colours">Reset Colors</button>
```

Also add `type="button"`. It is not inside a form so this is defensive, but it costs nothing.

## 5.9 Replace every `transition: all` (J8)

`transition: all` animates layout properties like `width`, `height` and `padding`, which is what causes the jank. There are 14 sites. `--transition: all 0.25s ease` on line 41 is the source of 13 of them.

First apply this mapping:

| Line | Selector | Replace with |
|---|---|---|
| 121 | `.nav-container` | **delete** â€” the element has no hover or state change at all |
| 144 | `.nav-link` | `transition: color 0.25s ease, background-color 0.25s ease;` |
| 158 | `.nav-rsvp-btn` | handled by 5.4 |
| 312 | `.hero-scroll-indicator` | **delete** â€” see 5.12 |
| 418 | `.btn-rsvp` | handled by 5.4 |
| 549 | `.step-card` | `transition: transform 0.25s ease, box-shadow 0.25s ease;` |
| 575 | `.step-link` | `transition: color 0.25s ease;` |
| 876 | `.chapter-link` | `transition: color 0.25s ease;` |
| 1121 | `.custom-checkbox-label` | **delete** â€” the hover style is on the child `.custom-checkbox-box`, not the label |
| 1143 | `.custom-checkbox-box` | `transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);` |
| 1263 | `.entry__field input.input` | `transition: border-color 0.25s ease, box-shadow 0.25s ease;` |
| 1347 | `.footer-nonprofit-tag a` | `transition: color 0.25s ease;` |
| 1432 | `.toast-close-btn` | **deleted with the toast**, 5.13 |
| 1626 | `.rsvp-close-btn` | `transition: background-color 0.25s ease, transform 0.25s ease;` |

Then delete the now-unused `--transition` token at line 41, and prove it:
```powershell
(Select-String -Path style.css -Pattern 'var\(--transition\)').Count   # must be 0
(Select-String -Path style.css -Pattern 'transition:\s*all').Count      # must be 0
```

## 5.10 Respect reduced-motion preferences (J11)

Six pixel-art icons float forever, the scroll arrow bobs forever, and `will-change: transform` on those six icons forces a permanent compositor layer that drains battery. The owner decided to **keep the animations** and add an opt-out.

Add at the very end of `style.css`:

```css
/* ==========================================================================
   13. REDUCED MOTION
   Users who ask their OS to reduce motion get a still page.
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {

    html {
        scroll-behavior: auto;
    }

    .hero-scroll-indicator,
    .prize-art-icon,
    .rsvp-btn-spinner {
        animation: none;
    }

    .board-card,
    .chapter-card,
    .step-card,
    .nav-rsvp-btn,
    .btn-rsvp,
    .rsvp-submit-btn,
    .newsletter-section .sib-form-block__button {
        transition: none;
    }

    .board-card:hover,
    .chapter-card:hover,
    .step-card:hover,
    .volunteer-image-wrapper:hover .volunteer-image,
    .chapter-image-card:hover .chapter-image,
    .board-card:hover .board-photo {
        transform: none;
    }
}
```

And delete `will-change: transform;` from `.prize-art-icon` (line 893). It is a permanent hint for a transform animation that CSS can already composite on its own, and it is the specific thing the battery-drain finding names.

The `rsvp-btn-spinner` is included because it spins infinitely too, and a loading spinner that does not spin gives no loading feedback. It is a deliberate exception to "no animation", and it is frozen only for users who have explicitly asked for reduced motion.

**Check:** `grep` for `infinite` after this change. Three should remain: `arrow-float` (line 313), `pixel-float` (line 891), `rsvp-spin` (line 1589). All three are now neutralised by the block above.

## 5.11 Make the navbar work at 390 px (G1)

`style.css` line 104, `.nav-container` â€” it needs to become the positioning context for the dropdown:

```css
.nav-container {
    position: relative;
    /* â€¦everything else unchangedâ€¦ */
}
```

Then add:

```css
/* Mobile nav toggle: hidden on desktop, the primary nav on desktop */
.nav-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    padding: 0;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: var(--radius-sm);
    cursor: pointer;
}

.nav-toggle-bar {
    display: block;
    width: 20px;
    height: 2px;
    margin: 0 auto;
    background-color: var(--clr-black);
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(2) {
    opacity: 0;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}
```

And inside the existing `@media (max-width: 768px)` block (line 1676), replace the `.nav-links`, `.nav-link` and `.nav-rsvp-btn` rules at lines 1695â€“1707 with:

```css
    .nav-toggle {
        display: flex;
    }

    .nav-links {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        gap: 0.25rem;
        padding: 0.75rem;
        background-color: rgba(255, 255, 255, 0.97);
        backdrop-filter: blur(35px);
        -webkit-backdrop-filter: blur(35px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: var(--radius-md);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        display: none;
    }

    .nav-links.is-open {
        display: flex;
    }

    .nav-link,
    .nav-rsvp-btn {
        font-size: 1rem;
        padding: 0.7rem 0.9rem;
        text-align: left;
        width: 100%;
    }

    .nav-rsvp-btn {
        text-align: center;
        margin-top: 0.35rem;
    }
```

Then in the `@media (max-width: 480px)` block (line 1886), **delete** the `.nav-links { gap: 0.35rem; }`, `.nav-link { font-size: 0.78rem; padding: 0.2rem 0.25rem; }` and `.nav-rsvp-btn { padding: 0.35rem 0.75rem; font-size: 0.78rem; }` rules at lines 1895â€“1907. They exist to cram four links onto one line, which is the thing that no longer happens.

Also fix the logo size at 480 px â€” `.nav-logo a` at 0.92rem with `white-space: nowrap` (lines 1891â€“1893) will collide with the toggle. Change it to:
```css
    .nav-logo a {
        font-size: 0.95rem;
    }
```

Behaviour of the toggle (JavaScript in Phase 6, task 6.4): toggles `.is-open` on `#nav-links` and `aria-expanded` on `#nav-toggle`; closes on any nav link click, on Escape, and when the viewport widens past 768 px.

## 5.12 Delete the dead CSS (J12, J13)

| Lines | What | Why |
|---|---|---|
| 352, 368, 1717â€“1721 | `.events-card` and `.events-card:hover` | No element in `index.html` has `class="events-card"`. The rules were copied from a Wix scrape. |
| 312 | `transition: var(--transition)` on `.hero-scroll-indicator` | Already covered in 5.9. |
| 322â€“325 | `.hero-scroll-indicator:hover` | Dead. The element has `animation: arrow-float â€¦ infinite` on `transform` (line 313), and an animation always wins over a transition and a static transform on the same property. The hover can never do anything. |
| 1207â€“1212 | `#sib-container textarea::placeholder` | There is no textarea in either form. |
| 1193â€“1198 | `#sib-container input:-ms-input-placeholder` | IE-only syntax. Already handled in 5.3. |
| 437â€“441, 502â€“507, 738â€“742, 990â€“996, 1315â€“1321 | dead declarations inside `.volunteer-container`, `.application-container`, `.chapter-container`, `.newsletter-container`, `.footer-container` | Each sets `background-color: transparent; border-radius: 0; padding: 0; box-shadow: none;` to "reset" styles that nothing ever sets. These are plain `div`s with no competing rule. **Keep** each rule's `max-width`, `margin`, `display`, `flex-direction`, `align-items` and `text-align` â€” and keep `color: var(--clr-white)` on `.application-container` (line 504), which is load-bearing. |
| 1748â€“1755 | the same four declarations again, inside the 768 px block | Same reason. Keep the `flex-direction: column` and `text-align: center` on `.footer-container` and `.site-footer`. |

## 5.13 Delete the unused class hooks (J14)

Six class hooks appear in `index.html` with **no CSS rule and no JavaScript** attached to them. Remove them from the HTML:

| Line | Hook | Occurrences |
|---|---|---|
| 123, 144, 165 | `card-left`, `card-center`, `card-right` | one each |
| 130, 152, 173 | `board-text-group` | three |
| 210 | `chapter-prizes-card` | one |
| 230 | `chapter-steps-card` | one |

> These are safe to remove **only because** the horizontal stagger of the three board cards is produced by `.row-artham` / `.row-arham` / `.row-panshul` (lines 635â€“648) setting `justify-content`, not by the card hooks. After removing them, the three cards must still sit left, centre and right. You cannot check this by eye (Â§1.3) â€” verify it by reading: confirm those three rules are untouched, and that no CSS selector anywhere contains the string `card-left`, `card-center`, `card-right`, `board-text-group`, `chapter-prizes-card` or `chapter-steps-card`.

```powershell
Select-String -Path style.css,assets\js\*.js -Pattern 'card-left|card-center|card-right|board-text-group|chapter-prizes-card|chapter-steps-card'
```
Expected: **no matches** after removal. If any match appears, that hook was load-bearing after all â€” restore the class and report.

## 5.14 Add the new styles from Phase 3 and 4

```css
/* Hero tagline (Phase 3, task 3.1) */
.hero-tagline {
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 2.2vw, 1.6rem);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.01em;
    text-align: center;
    color: var(--clr-black);
    max-width: 46ch;
    margin: 0 auto 3.5rem;
}

/* The tagline now sits between the title and the scroll arrow,
   so pull the title's bottom margin up. */
.hero-title {
    margin-bottom: 1.25rem;
}

/* Clickable email addresses (Phase 3, task 3.7) */
.email-link {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.25s ease;
}

.email-link:hover {
    color: var(--clr-red-accent);
}

/* Visible field labels (Phase 4, task 4.4) */
.field-label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--clr-black);
    text-align: center;
}

.rsvp-input-group .field-label {
    text-align: left;
}

/* Volunteer call to action (Phase 3, task 3.4) */
.volunteer-copy {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.volunteer-desc {
    flex: none;
}

.btn-apply {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.85rem 2.5rem;
    min-width: 220px;
    text-align: center;
    background-color: var(--clr-red-accent);
    color: var(--clr-white);
    border-radius: var(--radius-pill);
    font-size: 1rem;
    font-weight: 700;
    transition: background-color 0.25s ease, transform 0.25s ease;
}

.btn-apply:hover {
    background-color: var(--clr-red-dark);
    transform: translateY(-2px);
}

/* Footer social row (Phase 3, task 3.9) */
.footer-social {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
}

.footer-social a {
    display: block;
    line-height: 0;
    border-radius: 50%;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.footer-social a:hover {
    transform: scale(1.12);
    opacity: 0.85;
}
```

Also, the `.footer-container` is a two-column flex with `justify-content: space-between`. Three children now compete for that space. Change it to wrap the social row onto its own line:

```css
.footer-container {
    flex-wrap: wrap;
}

.footer-social {
    order: 3;
    flex-basis: 100%;
    justify-content: center;
    margin-top: 0.5rem;
}
```

## 5.15 Delete the placeholder toast CSS

Delete `style.css` lines 1366â€“1438 in their entirety: the `/* 11. PLACEHOLDER TOAST MODAL */` banner, `.toast-hidden`, `.toast-visible`, `#toast-modal`, `.toast-content`, `.toast-content p`, `.toast-close-btn`, `.toast-close-btn:hover`.

**But keep the `@keyframes toast-slide-up` block** â€” it is used by `.rsvp-modal-content` at line 1483. Rename it to `modal-slide-up` and update that one reference, so the name stops referring to something that no longer exists.

## 5.16 Self-host the fonts and drop the unused family

**Delete** from `index.html`: the two `<link rel="preconnect">` tags (lines 13, 14), the comment on line 15, and the Google Fonts `<link>` on lines 16â€“18. That removes a third-party request, a privacy leak, and five font weights the site never uses.

**Keep** Familjen Grotesk weights 400, 600, 700, 800. **Drop the italic 400** â€” nothing in the stylesheet sets `font-style: italic`.

**Self-host both families** into `assets/fonts/`. Download the 4 Familjen Grotesk woff2 files (400/600/700/800) and the 2 `crave-fine` woff2 files currently loaded from `static.parastorage.com` (`style.css` lines 5 and 13). Fetch the Google CSS with a browser `User-Agent` to get the woff2 URLs, then replace the two existing `@font-face` blocks with six:

```css
@font-face {
    font-family: 'Familjen Grotesk';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('assets/fonts/familjen-grotesk-400.woff2') format('woff2');
}
```

â€¦and the same shape for 600, 700, 800, plus the two `crave-fine` blocks at weights 400 and 700 pointing at `assets/fonts/crave-fine-400.woff2` and `assets/fonts/crave-fine-700.woff2`.

Add two preloads in `<head>`, after the `style.css` link, so the hero headline does not flash:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/crave-fine-700.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/familjen-grotesk-800.woff2">
```

> **Open item for the site owner, not a blocker.** `crave-fine` is a Wix-hosted font whose licence terms have not been verified. The default instruction is to self-host it exactly as it behaves today, which preserves the current appearance and is what this phase does. If the owner later cannot confirm usage rights, the fallback is: delete both `crave-fine` `@font-face` blocks and change `.hero-title`'s `font-family` (line 256) to `Georgia, 'Times New Roman', serif`. Note that in `AGENTS.md`. Do not make that change now.

## 5.17 The one thing deliberately not being fixed

The audit lists "render-blocking CSS" as an issue. **This is not being changed, and here is the reason, so that nobody 'fixes' it later by accident:**

`style.css` is a single 42 KB file, served from the same origin as the HTML, on a site with exactly one page. Inlining critical CSS and deferring the rest would split one cacheable request into two and add a build step or a second hand-maintained file, in exchange for a saving measured in tens of milliseconds. The dominant LCP cost was 1.3 MB of hero PNG, which Phase 2 fixes. Record this as a conscious non-change; do not add a critical-CSS pipeline.

## 5.18 Verification for Phase 5

```powershell
# Every one of these must be 0:
(Select-String -Path style.css -Pattern 'transition:\s*all').Count
(Select-String -Path style.css -Pattern 'var\(--transition\)').Count
(Select-String -Path style.css -Pattern '#F73D18|#F75F40|#fd0009|#d93025|#045AFF|#0346CC|#0f9992|#2BB2FC|#c0ccda|#d3dce6|#f7fafc|#E63B2E|#C0CCDA').Count
(Select-String -Path style.css -Pattern '!important').Count     # was 17, all in the vendor block â€” must still be 17
(Select-String -Path style.css -Pattern 'events-card|toast-|will-change').Count

# These must be > 0:
(Select-String -Path style.css -Pattern ':focus-visible').Count
(Select-String -Path style.css -Pattern 'prefers-reduced-motion').Count
(Select-String -Path style.css -Pattern 'nav-toggle').Count
```

The `!important` count staying at exactly **17** is intentional. All 17 are the `!important` overrides that fight `sibforms.com`'s vendor stylesheet, in the block at lines 978â€“1298. The owner chose to keep the Brevo widget and its override block, so they stay. Do not "clean them up" â€” removing them breaks the newsletter form's appearance.

---

# PHASE 6 â€” JavaScript

**Findings addressed:** C1, H2, H3, H4, H6, H7, H8, H9, H10 (done in Phase 4), H11, H12, H13, and the G1/G4 behaviours
**Commit message:** `refactor: extract JS to modules, fix RSVP false success, fix canvas DPR and resize`

## 6.1 Create `assets/js/brevo-globals.js`

Everything from the current `index.html` lines 646â€“664 moves here, with the five dead strings removed.

The site's only two forms contain exactly these fields: `EMAIL` (Ã—2), `best_news_only` (a checkbox), `email_address_check` (a honeypot), and `locale`. There is no phone field, no country-code field, no date field, no SMS field and no multi-select. The vendor script defines messages for all of them anyway; five of those messages are dead strings on this site.

**Delete** these five lines: `REQUIRED_CODE_ERROR_MESSAGE`, `SMS_INVALID_MESSAGE`, `INVALID_NUMBER`, `INVALID_DATE`, `REQUIRED_MULTISELECT_MESSAGE`.

**Keep** these, because the vendor script reads them:

```js
'use strict';

window.LOCALE = 'en';
window.EMAIL_INVALID_MESSAGE = "we think you entered something wrong. check your info and try again.";
window.REQUIRED_ERROR_MESSAGE = "blank inputs don't help AI :( ";
window.GENERIC_INVALID_MESSAGE = "we think you entered something wrong. check your info and try again.";
window.translation = {
    common: {
        selectedList: '{quantity} list selected',
        selectedLists: '{quantity} lists selected',
        selectedOption: '{quantity} selected',
        selectedOptions: '{quantity} selected',
    }
};
var AUTOHIDE = Boolean(1);
```

`AUTOHIDE` stays a bare `var` on purpose â€” it must land on `window` for the vendor script to find it. Do not wrap this file in an IIFE; it is a global-configuration file by design. The `'use strict'` at the top is still correct and still required.

`EMAIL_INVALID_MESSAGE` and `GENERIC_INVALID_MESSAGE` have identical values. That is not a mistake â€” the vendor script expects both names to exist. Do not consolidate them.

## 6.2 Create `assets/js/modal.js`

Holds `openRsvpModal`, `closeRsvpModal` and `handleRsvpSubmit`, inside an IIFE, with the C1 fix and the G4 accessibility work.

```js
'use strict';

(function () {
    const BREVO_FALLBACK_EMAIL = 'oneworldgreatertogether@gmail.com';

    const modal = document.getElementById('rsvp-modal');
    const formView = document.getElementById('rsvp-form-view');
    const successView = document.getElementById('rsvp-success-view');
    const errorDiv = document.getElementById('rsvp-error');
    const emailInput = document.getElementById('rsvp-email');
    const form = document.getElementById('rsvp-popup-form');
    const submitBtn = document.getElementById('rsvp-submit-btn');
    const btnText = submitBtn.querySelector('.rsvp-btn-text');
    const btnSpinner = submitBtn.querySelector('.rsvp-btn-spinner');

    let lastFocused = null;

    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function focusables() {
        return Array.prototype.filter.call(
            modal.querySelectorAll(FOCUSABLE),
            function (el) { return el.offsetParent !== null; }
        );
    }

    function openModal() {
        lastFocused = document.activeElement;
        formView.style.display = 'block';
        successView.style.display = 'none';
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        emailInput.value = '';

        modal.classList.remove('rsvp-modal-hidden');
        modal.classList.add('rsvp-modal-visible');
        document.body.classList.add('modal-open');
        emailInput.focus();
    }

    function closeModal() {
        modal.classList.remove('rsvp-modal-visible');
        modal.classList.add('rsvp-modal-hidden');
        document.body.classList.remove('modal-open');
        if (lastFocused) { lastFocused.focus(); }
    }

    function showError(message) {
        errorDiv.textContent = message + ' ';
        const link = document.createElement('a');
        link.href = 'mailto:' + BREVO_FALLBACK_EMAIL;
        link.className = 'email-link';
        link.textContent = BREVO_FALLBACK_EMAIL;
        errorDiv.appendChild(link);
        errorDiv.style.display = 'block';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-rsvp-open]')) {
            e.preventDefault();
            openModal();
        } else if (e.target.closest('[data-rsvp-close]')) {
            e.preventDefault();
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('rsvp-modal-hidden')) { return; }

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        // G4: trap Tab inside the dialog
        if (e.key === 'Tab') {
            const items = focusables();
            if (items.length === 0) { return; }
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) { return; }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        errorDiv.style.display = 'none';
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';

        try {
            // H6: read the endpoint from the form's own action attribute.
            // The URL exists in exactly one place in the codebase.
            const endpoint = form.getAttribute('action');
            const formData = new FormData();
            formData.append('EMAIL', email);
            formData.append('email_address_check', '');
            formData.append('locale', 'en');

            const res = await fetch(endpoint, { method: 'POST', body: formData, mode: 'cors' });

            // C1: the response was never checked. Any non-throwing fetch
            // showed "You're on the list!" â€” including ad-blocker rejections
            // and 5xx responses. Check it.
            if (!res.ok) { throw new Error('Brevo responded ' + res.status); }

            formView.style.display = 'none';
            successView.style.display = 'block';
        } catch (err) {
            console.error('RSVP submission failed:', err);
            showError('Something went wrong on our end. Please try again, or email');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    });
})();
```

**The C1 bug, stated plainly:** the old code never assigned the `fetch` response to a variable. There is no `res.ok` check anywhere in the old file. So the success branch ran on *any* fetch that did not throw â€” including one that an ad blocker refused, or that returned a 500. And the `catch` block ran the exact same success code. The visitor was told "You're on the list!" while their address was silently discarded. Both problems are fixed above: `res.ok` is checked, and the `catch` branch now shows a real error with a working email link instead of a false confirmation.

The error string is owner-approved and is exactly: `Something went wrong on our end. Please try again, or email oneworldgreatertogether@gmail.com.` The code splits it so the address becomes a live `mailto:` link; the visible text is unchanged.

Add the scroll-lock rule to `style.css`:
```css
body.modal-open {
    overflow: hidden;
}
```

## 6.3 Create `assets/js/hero-canvas.v2.js`

> **Touch devices get full colour automatically.** `style.css` hides `.hero-bg-canvas` under
> `@media (hover: none), (any-hover: none)`, so the full-colour `hero_bg.webp` shows through, and the
> script returns early unless `(hover: hover) and (any-hover: hover)` both match. Without a cursor
> there is nothing to erase the grey mask, so a permanently grey hero would be the only alternative.

```js
'use strict';

(function () {
    const heroSection = document.getElementById('welcome');
    const canvas = document.getElementById('hero-mask-canvas');
    const resetBtn = document.getElementById('hero-reset-btn');
    if (!heroSection || !canvas || !resetBtn) { return; }

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const supportsFilter = typeof ctx.filter === 'string';

    const bgImg = new Image();
    bgImg.src = 'assets/images/hero_bg.webp';

    let cssW = 0;
    let cssH = 0;
    let isPainted = false;
    let snapshot = document.createElement('canvas');
    let frame = null;
    let pointerX = 0;
    let pointerY = 0;

    function drawImageCover() {
        const canvasRatio = cssW / cssH;
        const imgRatio = bgImg.width / bgImg.height;
        let sWidth, sHeight, sX, sY;

        if (imgRatio > canvasRatio) {
            sHeight = bgImg.height;
            sWidth = bgImg.height * canvasRatio;
            sX = (bgImg.width - sWidth) / 2;
            sY = 0;
        } else {
            sWidth = bgImg.width;
            sHeight = bgImg.width / canvasRatio;
            sX = 0;
            sY = (bgImg.height - sHeight) / 2;
        }

        ctx.globalCompositeOperation = 'source-over';
        if (supportsFilter) {
            ctx.filter = 'grayscale(55%) brightness(80%)';
            ctx.drawImage(bgImg, sX, sY, sWidth, sHeight, 0, 0, cssW, cssH);
            ctx.filter = 'none';
        } else {
            // H12: ctx.filter is unsupported in Safari < 18.
            ctx.drawImage(bgImg, sX, sY, sWidth, sHeight, 0, 0, cssW, cssH);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
            ctx.fillRect(0, 0, cssW, cssH);
        }
    }

    function paintBase() {
        ctx.clearRect(0, 0, cssW, cssH);
        if (bgImg.complete && bgImg.naturalWidth !== 0) {
            drawImageCover();
        } else {
            bgImg.addEventListener('load', drawImageCover, { once: true });
        }
        isPainted = false;
        resetBtn.classList.remove('is-visible');
    }

    function fillGreyscale() {
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext('2d').drawImage(canvas, 0, 0);
        paintBase();
        ctx.drawImage(snapshot, 0, 0, cssW, cssH);
    }

    function resizeCanvas() {
        cssW = canvas.offsetWidth;
        cssH = canvas.offsetHeight;
        canvas.width = Math.round(cssW * DPR);
        canvas.height = Math.round(cssH * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        fillGreyscale();
    }

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
    });
    resizeCanvas();

    heroSection.addEventListener('mousemove', function (e) {
        if (window.matchMedia('(hover: none)').matches) { return; }
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (frame === null) { frame = requestAnimationFrame(eraseAtPointer); }
    });

    function eraseAtPointer() {
        frame = null;
        const rect = canvas.getBoundingClientRect();
        const x = pointerX - rect.left;
        const y = pointerY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
        gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.15)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 200, 0, Math.PI * 2);
        ctx.fill();

        if (!isPainted) {
            isPainted = true;
            resetBtn.classList.add('is-visible');
        }
    }

    resetBtn.addEventListener('click', function () {
        fillGreyscale();
    });
})();
```

Five defects fixed here, each marked in the code:

| Finding | Old behaviour | Fix |
|---|---|---|
| **H2** | Canvas backing store was set to `canvas.offsetWidth`, i.e. CSS pixels. On a 2Ã— display the browser upscaled it, so the hero looked soft on every retina screen and every phone. | `DPR` multiplier, `ctx.setTransform(DPR,0,0,DPR,0,0)`, and all draw math switched to CSS pixels. Capped at 2Ã— so a 3Ã— phone does not render 9Ã— the pixels for no visible gain. |
| **H3** | Every `resize` event reset `canvas.width`, which wipes the bitmap, then redrew the grey. Drag a window edge and your scratch progress was destroyed on every single event. | 150 ms debounce, plus a snapshot canvas that captures the current bitmap before the resize and replays it afterwards. |
| **H4** | `mousemove` ran `matchMedia`, `getBoundingClientRect`, `createRadialGradient` and a `fill` on every event, up to ~1000Ã—/second. | Coordinates are stored and one `requestAnimationFrame` callback does the drawing, so it is capped at the display refresh rate. |
| **H11** | `bgImg.onload = drawImageCover` was reassigned inside `fillGreyscale` on every call, clobbering any previous handler. | `addEventListener(..., { once: true })`, and it is only attached when the image genuinely is not loaded. |
| **H12** | `ctx.filter` is unsupported in Safari before 18, so the greyscale filter silently did nothing. | `supportsFilter` feature test with a flat dark overlay as the fallback. |

**Also note:** `requestAnimationFrame` is only ever called when `frame === null`, and reset to `null` at the top of the callback. Without that reset the callback would fire exactly once.

## 6.4 Create `assets/js/nav.js`

```js
'use strict';

(function () {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) { return; }

    function setOpen(open) {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
        setOpen(!links.classList.contains('is-open'));
    });

    links.addEventListener('click', function (e) {
        if (e.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && links.classList.contains('is-open')) {
            setOpen(false);
        }
    });
})();
```

## 6.5 Delete the old inline scripts and rewire the page

Delete from `index.html`: the entire `<script>` block at lines 452â€“643, the entire `<script>` block at lines 646â€“664, and the comment on line 645.

Replace the old vendor `<script defer src="â€¦/main.js">` on line 665 with these four, **in this order**:

```html
    <script defer src="assets/js/nav.js"></script>
    <script defer src="assets/js/hero-canvas.v2.js"></script>
    <script defer src="assets/js/modal.js"></script>
    <script defer src="assets/js/brevo-globals.js"></script>
    <script defer src="https://sibforms.com/forms/end-form/build/main.js"></script>
```

> **Why `brevo-globals.js` must come immediately before the vendor script and must not be reordered.** The vendor script reads `window.LOCALE`, `window.EMAIL_INVALID_MESSAGE` and the rest at startup. `defer` scripts execute in document order, so placing `brevo-globals.js` last-but-one guarantees the globals exist before `main.js` runs. Moving it above the other three files is fine; moving it **below** `main.js` will break newsletter validation.

The four local files are `defer` so they no longer block parsing. That removes the last render-blocking JavaScript from the page.

## 6.6 Verification for Phase 6

```powershell
# All must be 0:
(Select-String -Path index.html -Pattern '<script>').Count
(Select-String -Path index.html -Pattern 'sibforms.com/serve').Count > 1   # expected: exactly 2
(Select-String -Path index.html -Pattern 'showToast|closeToast|openRsvpModal|closeRsvpModal|handleRsvpSubmit').Count
(Select-String -Path index.html -Pattern 'REQUIRED_CODE_ERROR_MESSAGE|SMS_INVALID_MESSAGE|INVALID_NUMBER|INVALID_DATE|REQUIRED_MULTISELECT').Count

# Must be 1 in each of the two .js files that need it, 0 elsewhere:
(Select-String -Path assets\js\modal.js -Pattern 'res\.ok').Count
(Select-String -Path assets\js\hero-canvas.v2.js -Pattern 'devicePixelRatio').Count

# Both forms must point at the SAME Brevo URL. This is the H6 check.
$sib = (Select-String -Path index.html -Pattern 'id="sib-form"' -Context 0,3).Context.PostContext -join ' '
$rsvp = (Select-String -Path index.html -Pattern 'id="rsvp-popup-form"').Line
```

For the last check: extract the 239-character Brevo URL from both the `#sib-form` and `#rsvp-popup-form` tags and assert they are byte-identical. The old code had the URL hardcoded twice (once in the newsletter form's `action`, once as a `const` inside `handleRsvpSubmit`) with nothing keeping them in sync â€” the stated risk was that they would diverge onto different lists. Now the string appears exactly twice in the whole repo, both times as a form `action`, and the JavaScript reads it from the DOM rather than repeating it.

---

# PHASE 7 â€” SEO, social previews, and final verification

**Findings addressed:** E3, D6, plus the meta/canonical/sitemap/robots gaps the audit did not list
**Commit message:** `feat: add meta description, Open Graph tags, robots.txt and sitemap.xml`

## 7.1 Replace the `<head>` block

Replace `index.html` lines 4â€“19 in their entirety:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>OneWorldGreaterTogether | Empowering students through Technology and STEM</title>
    <meta name="description" content="OneWorldGreaterTogether is a youth-led 501(c)(3) nonprofit educating students in technology and STEM. Start a chapter at your school, volunteer with the team, and join the weekly newsletter.">
    <link rel="canonical" href="https://owgt.org/">
    <meta name="theme-color" content="#EBF8E7">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="OneWorldGreaterTogether">
    <meta property="og:title" content="OneWorldGreaterTogether">
    <meta property="og:description" content="A youth-led 501(c)(3) nonprofit educating students in technology and STEM. Start a chapter, volunteer with the team, or join the weekly newsletter.">
    <meta property="og:url" content="https://owgt.org/">
    <meta property="og:image" content="https://owgt.org/assets/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="The OneWorldGreaterTogether wordmark">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="OneWorldGreaterTogether">
    <meta name="twitter:description" content="A youth-led 501(c)(3) nonprofit educating students in technology and STEM.">
    <meta name="twitter:image" content="https://owgt.org/assets/images/og-image.jpg">

    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png">
    <link rel="shortcut icon" href="favicon.ico">

    <link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/crave-fine-700.woff2">
    <link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/familjen-grotesk-800.woff2">
    <link rel="preload" as="image" href="assets/images/hero_bg.webp" type="image/webp" fetchpriority="high">

    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css">
</head>
```

What this fixes, and why each piece is there:

- **The site had no `<meta>` tags at all** beyond charset and viewport. No description, no canonical, no Open Graph, no Twitter card. When anyone shared a link to this site on WhatsApp, Discord or LinkedIn, it unfurled with a bare title and no picture and no description. Every OWGT-controlled page has this problem, including the live Wix site.
- `og:image` points at `assets/images/og-image.jpg`, the 1200Ã—630 JPEG generated in Phase 2. The 1200Ã—630 and 630 dimensions are the sizes Facebook, LinkedIn, WhatsApp and X all require.
- **`https://owgt.org/` is used as the canonical origin.** That is the owner's decision. Note that `owgt.org` currently resolves to a Wix "you found us early" coming-soon page. These absolute URLs become correct the moment the owner points the domain at the deployment, and they are wrong-but-harmless until then. The owner is deploying; do not attempt it.
- Three favicon declarations are replaced by four specific ones. Previously the same 190 KB, 600Ã—600 PNG was declared three times, so browsers downloaded 190 KB to paint a 16 px tab icon. Now there is a 16 px PNG, a 32 px PNG, a 180 px Apple touch icon and a multi-size `favicon.ico`. The 600Ã—600 original is deleted in Phase 2.
- The preloads for the two hero-critical fonts and the hero image are the LCP fix from Phase 2, task 2.5.

## 7.2 Create `robots.txt` (repo root)

```
User-agent: *
Allow: /

Sitemap: https://owgt.org/sitemap.xml
```

## 7.3 Create `sitemap.xml` (repo root)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://owgt.org/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

One URL, because the site is one page.

## 7.4 Final full-repo verification

```powershell
# 1. No placeholders, no dead links, no AI instructions anywhere
Select-String -Path index.html,style.css,assets\js\*.js -Pattern 'PLACEHOLDER|placeholder button|ouid=|href="#"|TODO|FIXME|XXX'
# expected: no matches

# 2. No inline event handlers
Select-String -Path index.html -Pattern '\son[a-z]+='
# expected: no matches

# 3. Payload weight
(Get-ChildItem index.html,style.css,favicon.ico,assets -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
# expected: under 1.5

# 4. No third-party image hotlinks
Select-String -Path index.html,style.css -Pattern '<img[^>]+src="https?://'
# expected: no matches

# 5. Every local reference resolves to a file that exists
#    (write a short script: extract every src/href that is not http/mailto/#/tel,
#     resolve it relative to the repo root, and assert the file exists)
# expected: zero missing

# 6. Contrast-critical values are present exactly as specified
Select-String -Path style.css -Pattern '#C92A1E|#A11F16|#0F5D8C|#5A6B7D'
# expected: matches present, and no occurrences of any retired hex

# 7. HTML parses without a <main> or heading-order mistake
Select-String -Path index.html -Pattern '<main>|</main>'
# expected: exactly one of each
```

## 7.5 Commit and push

```powershell
git add -A
git status --porcelain      # read this before committing; confirm nothing unexpected
git commit -m "feat: add meta description, Open Graph tags, robots.txt and sitemap.xml"
git push origin main
```

There were 2 unpushed local commits before this work started. This push sends all of it.

---

## 8. Definition of done

The job is complete when **all** of the following are true.

**Content and integrity**
- [ ] No string reading "placeholder", "Contact site owner", or "Agent, do not" exists anywhere in the shipped files.
- [ ] No AI-facing instruction exists in any HTML comment.
- [ ] The chapter guidelines link resolves to the live Google Doc.
- [ ] No `href="#"`, no `ouid=` parameter, no `mailto:`-less email address.
- [ ] The mission tagline, all three board bios, the volunteer paragraph, the volunteer button, both field labels, the RSVP failure message and the chapter step 2 all read exactly as written in this document.

**Correctness**
- [ ] The RSVP popup cannot display "You're on the list!" when the signup failed.
- [ ] The Brevo URL appears exactly twice in the repository, both as a form `action`, and the two are byte-identical.
- [ ] Both forms work with JavaScript disabled.
- [ ] The RSVP modal traps focus, locks background scroll, and returns focus to the button that opened it.

**Accessibility**
- [ ] Every one of the 17 original images plus the 7 social icons has `width`, `height`, `loading` and `decoding`.
- [ ] Every email input has a real `<label>`.
- [ ] A global `:focus-visible` outline exists and is not suppressed on form fields.
- [ ] Every text/background pair listed in Â§2 measures at least 4.5:1, or is large text at 3:1.
- [ ] The hero reset button is not keyboard-reachable while invisible.

**Performance**
- [ ] Front-end payload is under 1.5 MB, down from 20.0 MB.
- [ ] Every raster image is WebP. No `.png` or `.jpg` is referenced except favicons and the OG card.
- [ ] No image is hotlinked from a third party.
- [ ] `sibforms.com` and `img.mailinblue.com` are the only remaining third-party requests, plus the self-hosted fonts which are now first-party.

**Repository**
- [ ] `git ls-files` returns 67 files after Phase 1 and 86 after Phase 7, down from 157. The arithmetic is in Â§1.7.
- [ ] `.vercelignore` and `vercel.json` exist and are valid JSON.
- [ ] `scripts/optimize_images.py` is committed and re-runnable.
- [ ] Seven commits, one per phase, pushed to `origin/main`.

**Owner sign-off**
- [ ] All five items in Â§10 confirmed by the site owner.

---

## 9. What is deliberately NOT being changed

Recorded so that a later agent does not mistake these for oversights.

| Item | Why not |
|---|---|
| The Brevo widget, its 461 KB vendor script, and the 321-line `!important` override block at `style.css` 978â€“1298 | Owner decision: keep Brevo, fix only what is broken. Rebuilding the form natively would be a much larger change with a real risk of losing subscribers. |
| All 17 `!important` declarations | Same reason. They are load-bearing overrides against the vendor stylesheet. |
| The newsletter marketing copy | Owner reviewed it and chose to keep it. It is a real, live product with a real subscriber list. The audit's original verdict that it was "copy for a completely different product" was **wrong** â€” verified against the live rewards site and the live Brevo list. |
| The Events section copy | Owner decision: the words are honest, only the button styling was wrong. |
| The board cards' sticky scroll cascade, the hero scratch effect, the floating pixel icons | They are the site's character. |
| Render-blocking CSS | See Â§5.17. One 42 KB same-origin file on a one-page site is not worth a build step. |
| Facebook and LinkedIn footer links | Owner decision. The Facebook page has one follower and no content; LinkedIn is not linked from any OWGT page and has two followers. |
| `raw-source-code/`, `reference-images/`, `graphify-out/`, `placeholder/` contents | Untracked, still on disk, still useful as reference material. Deleting them is a separate decision. |
| `placeholder/` as a Vercel project | It is a separate Next.js prototype with its own project and Deployment Protection. Untouched. |

---

## 10. Owner visual-verification checklist

**These five items are the only things in this document that may be checked by looking at the page.** The site owner, not the executing agent, confirms them. Print-friendly list:

**1. The mobile navbar (finding G1)**
Open the site at 390 px wide. Before: the RSVP button was clipped and pushed off the right edge. After: the nav shows the wordmark and a hamburger icon; tapping it opens Join, Chapter, Newsletter and RSVP as a vertical list that fits entirely on screen. All four links work, and the menu closes when you tap one.

**2. The contrast colours (finding G2)**
Three specific things: the newsletter email box's placeholder text is now readable dark grey instead of near-invisible pale blue; the "390+ AI resources" link is now a dark blue instead of a bright cyan; and the newsletter "join" button is now red instead of teal. Check that the placeholder reads comfortably and that none of the three looks out of place.

**3. One red, one button shape, one modal palette (findings J5â€“J7)**
Every red button on the site â€” nav RSVP, events RSVP, the "Apply to volunteer" button, the newsletter join button, and the RSVP popup's Submit â€” should now be the same shade of red, all pill-shaped. Hovering any of them goes darker. The RSVP popup is no longer blue: its title is black, its input is white with a grey border, and its Submit button matches the site red. Confirm the single red still looks like your brand and that the popup no longer looks like it belongs to a different website.

**4. The hero sharpness (finding H2)**
On a retina laptop or a phone, move the mouse across the hero background. The image should look crisp, not soft or smeared. Before this fix the hero was rendered at half its needed resolution and upscaled by the browser. Also tap "Reset Colors" â€” it should appear only after you have scratched the image, and clicking it should restore the grey.

**5. The floating animations (finding J11)**
The six pixel-art icons in the chapter section and the scroll-down arrow should still float and bob exactly as before. Then turn on "reduce motion" in your operating system's accessibility settings, reload, and confirm they sit still. Both states are correct; the point is that the second one now exists.

---

## 11. Finding-to-task traceability

| Finding | Task |
|---|---|
| A5 dead document link | 3.2 |
| A6 AI comment in HTML | 3.2, Â§1.2 |
| A7 newsletter copy | **Closed as a false finding.** See Â§9. |
| A9 missing social links | 2.1 (icons), 3.9 (markup), 5.14 (styles) |
| A10 missing mission | 3.1, 5.14 |
| B1 volunteer clichÃ© | 3.3 |
| B2 broken Panshul grammar | 3.5 |
| B3 incomplete Arham sentence | 3.5 |
| B4 identical bio openings | 3.5 |
| B5 unanswered "Want to volunteer?" | 3.4, 5.14 |
| B8 leaked `ouid` | 3.6 |
| B10 dev control in hero | 5.8 (kept, fixed) |
| C1 RSVP false success | 6.2 |
| D1 no deploy config | 1.4, 1.5 |
| D2 orphan `.bak` PNGs | 1.3 |
| D3 graphify tracked | 1.1, 1.2 |
| D4 `AGENTS.md` typo | 1.6 |
| D6 conflicting favicons | 2.1, 7.1 |
| E2 no `mailto:` | 3.7, 5.14 |
| E3 OG image not wired | 2.1, 7.1 |
| F image weight | 2.1, 2.2 |
| F missing `width`/`height` | 2.4 |
| F missing `loading`/`decoding` | 2.4 |
| F LCP / `fetchpriority` | 2.5, 7.1 |
| F unused Inter weights | 5.16 |
| G1 navbar overflow | 4.3, 5.11, 6.4 |
| G2 contrast failures | 5.3, 5.4 |
| G3 no focus outline | 5.7 |
| G4 modal a11y | 6.2, 4.4 |
| G5 focusable invisible button | 5.8 |
| G6 missing labels | 4.4, 5.14 |
| H2 no DPR | 6.3 |
| H3 resize wipes progress | 6.3 |
| H4 unthrottled mousemove | 6.3 |
| H6 duplicated endpoint | 4.5, 6.2, 6.6 |
| H7 no form fallback | 4.5 |
| H8 global namespace | 4.7, Phase 6 file split |
| H9 dead error strings | 6.1 |
| H10 `autocomplete="off"` | 4.4 |
| H11 `bgImg.onload` clobbered | 6.3 |
| H12 `ctx.filter` unsupported | 6.3 |
| H13 `closeToast` used early, no `'use strict'` | 4.6, 6.1â€“6.4 |
| I vendor style clashes | **Kept by owner decision.** See Â§9. |
| J5 five reds | 5.1, 5.2 |
| J6â€“J7 eight buttons, modal palette | 5.4, 5.5 |
| J8 `transition: all` | 5.9 |
| J10 `!important` kills mobile rule | 5.11 (the 480 px block is rewritten) |
| J11 infinite animations | 5.10 |
| J12 dead `:hover` | 5.12 |
| J13 dead CSS | 5.3, 5.12, 5.15 |
| J14 unused class hooks | 5.13 |
| Fake button tell | 3.8, 5.6 |
| *(not in audit)* no meta description | 7.1 |
| *(not in audit)* no canonical | 7.1 |
| *(not in audit)* no `robots.txt` / `sitemap.xml` | 7.2, 7.3 |
| *(not in audit)* no `<main>` | 4.1 |
| *(not in audit)* orphan `hero_trophy.svg` | 1.3 |
| *(not in audit)* dead CSS tokens | 5.1 |
| *(not in audit)* no reduced-motion support | 5.10 |

---

## 12. Open items for the site owner

None of these block the work. Each is recorded so it is not silently forgotten.

1. **Enable Deployment Protection review.** The existing `placeholder` Vercel project is behind an auth wall, so nothing on it is publicly reachable. Decide the same for this project before or after launch.
2. **The 390+ figure in the newsletter copy.** The live `rewards.owgt.org` page says 391 resources; the site copy says "390+". Not a defect â€” "390+" is correct either way â€” but if the number is ever restated, keep the two in sync.
