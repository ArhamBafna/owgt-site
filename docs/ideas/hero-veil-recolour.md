# Hero Veil: Full-Colour First Frame

## Problem Statement
How might we keep the hover-reveal in the hero while making the very
first frame read as a finished, high-quality site?

Today the hero ships a DEGRADED first frame: a canvas paints the hero
photo with `grayscale(55%) brightness(80%)` and the cursor rubs holes in
it to reveal the same photo in colour. First-time visitors read the grey
as "unfinished". Touch visitors never see the effect at all.

## Recommended Direction
Invert the two layers.

| Layer | Today | After |
|---|---|---|
| First frame (canvas, top) | original, drained to grey | original warm, full colour |
| Hover reveals (base, bottom) | original, full colour | new generated golden-hour sky |

The first frame becomes the real photo — nothing about it is degraded,
which removes the problem entirely rather than softening it. The hover
payoff moves from "grey to colour" to "pastel to rich": the sky blooms
into deeper azure, coral, gold and violet.

The generated image is a RECOLOUR of the existing sky, not a new scene,
and must preserve the cloud formations that spell "AI".

## HARD CONSTRAINTS — do not violate

### 1. The new image must be EXACTLY 1678 x 937

`assets/images/hero_bg.webp` is **1678 x 937** (ratio 1.7908). It is NOT
1920x1080 and NOT 16:9. Both images are painted with "cover" logic
(`background-size: cover` / `drawImageCover` in the canvas), and that
crop is computed from each image's OWN aspect ratio. A different aspect
ratio means a different crop, which shifts the clouds relative to the
headline and the tagline. That is the exact regression this project
already fought once.

If the generator cannot output 1678 x 937 directly, generate LARGER and
downscale with Pillow LANCZOS. Never upscale, never let the browser
scale it, never accept a near-miss ratio.

### 2. No CSS proportion or layout value may change

Every number in the hero was tuned by hand so the headline, tagline and
the "AI" cloud band sit correctly without overlapping. Frozen:

| Property | Value | Where |
|---|---|---|
| `.hero-section` min-height | `101.7vh` | style.css:288 |
| `.hero-section` padding | `23rem 1.5rem 0rem` | style.css:304 |
| `.hero-section` justify-content | `flex-end` | style.css:301 |
| `.hero-section` padding (mobile) | `7rem 1rem 2.5rem` | style.css:1731 |
| `.hero-title` margin-bottom | `1.25rem` | style.css:1926 |
| `.hero-tagline` margin | `0 auto 3.5rem` | style.css:1920 |
| `.hero-tagline` max-width | `46ch` | style.css:1919 |
| `.hero-bg-base` size / position | `cover` / `center` | style.css:316 |
| "AI" cloud band | 22-39% of hero height | style.css:292 (comment) |

The allowed CSS edits are ONLY these:
- `style.css:314` — point the base layer at the new filename
- `style.css:348-355` — button label text ("Reset Colors" -> "Reset Sky")
- `index.html:34` — the preload href
- `index.html:72` — the button label text
- `assets/js/hero-canvas.v2.js:19` — point the canvas back at `hero_bg.webp`
- `assets/js/hero-canvas.v2.js:48` — delete the grayscale filter line
- `assets/js/hero-canvas.v2.js:107-110` — soften the middle alpha stop

No `padding`, `min-height`, `margin`, `font-size`, `max-width`,
`justify-content`, `background-position` or `z-index` value may move.

### 3. The reveal geometry stays as-is

200px radius, same three-stop gradient shape, same `destination-out`
composite. Only the middle alpha stop may soften (0.15 -> 0.10) to hide
the seam between two colourful skies.

## Key Assumptions to Validate
- [ ] The generator holds cloud geometry at low denoise strength
      (0.25-0.35). Test with ONE attempt at low strength first.
- [ ] The generated image is exactly 1678 x 937 after any resize.
- [ ] The richer sky reads as "more beautiful", not "different photo".
- [ ] The 200px reveal edge stays invisible between two colourful skies.
- [ ] First frame still passes a 2-second cold look on a 1440px laptop.
- [ ] Headline / tagline / "AI" band still do not overlap, desktop AND
      mobile, with NO CSS change made to fix them.

## The generation prompt

Feed the generator `assets/images/hero_bg.webp`.

> Recreate this exact sky as the same photograph taken at golden hour, 20
> minutes before sunset. Keep the camera position, focal length, framing,
> horizon line, and the shape and position of every single cloud exactly
> identical to the original — including the two cloud formations in the
> upper centre. This is a lighting and colour change on one existing
> scene, not a new scene. Change only the light: saturate the pale blue
> sky into a deeper warm azure, build the peach and cream into rich
> coral, gold and apricot along the left horizon, and let the lower right
> clouds deepen to soft violet and dusty rose. The upper-centre clouds
> should glow warm ivory with golden rim light instead of flat white.
> Keep the same soft-focus dreamy pastel finish and low contrast, no hard
> shadows, no added objects, no sun disc, no horizon detail. Output
> exactly 1678 x 937 pixels, the same aspect ratio as the input.

Set the generator's **strength / denoise to 0.25-0.35** if it exposes one.
That is what keeps the cloud geometry and the "AI" letters locked. At a
default strength the tool re-invents the scene, which is the failure mode
this whole change is trying to avoid.

## MVP Scope
- IN: 1 new hero image, `hero_bg_golden.webp`, exactly 1678 x 937.
- IN: The 7 allowed edits listed under HARD CONSTRAINTS above.
- OUT: Any other CSS. Any change to the reveal radius, the reset
      behaviour, or the hero layout.
- OUT: Phones are unaffected. The `hover: none` rule already hides the
      canvas, so touch devices keep seeing the original warm photo
      permanently, which is the correct outcome.

## Not Doing (and Why)
- Not a CSS filter on the veil — the photo is near-white, so there is no
  saturation to manipulate. Verified: hue-rotate/saturate produce nothing
  visible. A filter cannot be the answer here.
- Not replacing the hero photo — decided out of scope.
- Not animating the veil or making it work without hover — desktop-hover
  confirmed as sufficient.
- Not a colour wipe/layer blend — the reveal must be a real second sky.
- Not touching the tuned layout numbers — see HARD CONSTRAINTS.

## As Built (2026-09-27)

Shipped. Deviations from the plan above, and why:

- **A new `.hero-bg-reveal` layer was added instead of repointing
  `.hero-bg-base`.** The mask canvas is painted by a deferred script, so its
  bitmap is transparent for the moment before that script runs. If the golden
  image were the base layer, the saturated sky would flash on screen and then
  be covered by the calm original -- a full-strength colour swing on every
  page load. The reveal layer instead starts `visibility: hidden` and is
  switched on by JS only once the mask is opaque, with `.hero-bg-base` still
  painting the original in CSS to cover the gap. No flash, no layout change,
  and no existing `z-index` value was moved (the new layer matches
  `.hero-bg-base` at `z-index: 0` and sits directly after it in the DOM).
- **`.hero-bg-reveal` is also hidden under `@media (hover: none)`.** Without
  that, touch devices would show the golden sky permanently, since the canvas
  that hides it is already hidden there.
- **`assets/js/hero-canvas.v2.js` -> `v3.js`.** Its content changed, and
  `/assets/*` is `immutable` for one year, so the old filename would have
  kept serving the greyscale version to every returning visitor.
- **`fillGreyscale()` -> `coverMask()`.** Renamed because it no longer fills
  anything grey.
- **The `supportsFilter` branch is gone entirely**, along with the Safari < 18
  dark-overlay fallback that only existed to stand in for the greyscale filter.
- **The middle alpha stop went `0.15` -> `0.10`** as planned.
- **No layout value was changed.** The generated image came out of ChatGPT at
  exactly 1678 x 937, so no crop or resize was needed at all.
- **The preloads split**: `hero_bg.webp` keeps `fetchpriority="high"` because
  it is the first frame; `hero_bg_golden.webp` is `fetchpriority="low"` so the
  hover reveal is already in cache without competing for the first paint.

Final weights: 14.3 KB -> 25.8 KB, +11.5 KB.

## Open Questions
- BAIL-OUT: no attempt limit set by decision. If the letters will not
  hold, options are (a) composite the original letters back with Pillow,
  (b) drop the letters, (c) keep regenerating. Decide in the moment.
- `assets/images/og-image.jpg` is a 1200x630 centre-crop of the ORIGINAL
  hero. It is the social share card. If the hover image is not the
  "front" image, og-image can stay as-is — but confirm that is intended.
- Which asset keeps the `fetchpriority=high` preload once two full-bleed
  hero images exist (first frame should win, for LCP).
- Whether the hover image should read warmer (golden hour, as prompted)
  or cooler (blue hour) once a first draft exists.
