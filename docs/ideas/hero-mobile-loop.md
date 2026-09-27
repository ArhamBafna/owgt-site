# Mobile Hero: Self-Playing Sky Loop

## Problem Statement
How might we give phone visitors the sky-shift effect, when a phone has no
cursor to hover with, without stealing the scroll gesture?

Desktop visitors uncover the golden sky with the cursor. Phones get
nothing: `@media (hover: none)` hides both the mask and the golden layer, so
every phone visitor sees only the calm photo. For a student-facing
nonprofit this is probably most of the audience, so the effect the brand is
built around currently does not exist for them.

Touch-drag is the obvious answer and the wrong one — dragging *is* the
scroll gesture, so it fights the page.

## Recommended Direction
Let the existing brush play itself.

The mask canvas and the golden sky are already two stacked layers, and the
desktop brush that uncovers them already exists. On a phone, drive that same
brush along generated paths instead of a cursor position, forever, while the
hero is on screen.

### One cycle

1. Hold the calm photo, ~250ms.
2. **Forward pass.** 5-6 diagonal sweeps uncover the golden sky until it is
   almost completely visible, ~1.4s.
3. Hold on golden, ~400ms.
4. **Reverse pass.** The *same* sweeps play backwards, painting the calm
   photo back over, ~1.4s.
5. Rest on calm, ~3s.
6. Generate a brand new set of sweeps and go again.

~6.5s per cycle. It ends on the calm photo, so the resting state is
identical to desktop and a visitor who never looks up loses nothing.

### Stroke generation

Not uniformly random. Uniformly random sweeps leave uncovered patches, and
an uncovered patch reads as a rendering bug rather than a deliberate look.

Instead: divide the hero into a loose **3 x 2 grid**, place one sweep per
cell, and jitter each sweep's angle, start point and curvature. Coverage is
guaranteed; no two cycles look the same; the paths still read as brush
strokes rather than scribbles.

Sweeps are confident diagonals — either top-left to bottom-right or
top-right to bottom-left, alternating — with a slight bow to each.

The brush is deliberately **small on phones** (roughly 14% of viewport
width, so around 55px at 390px wide). A desktop-sized 200px brush would
swallow a phone screen in two or three strokes and collapse the effect into
a plain crossfade.

### Loop bounds

Runs while the hero is on screen, freezes the moment it leaves. The browser
already has a built-in "is this element visible" check, so this is a handful
of lines. Scrolling back up to the hero **resets to calm and plays a fresh
cycle from the start** — by then the visitor is actually looking at it.

Playing forever regardless of visibility is the rejected option: browsers
pause animation on a hidden *tab* but not on an off-screen *element*, so it
would repaint a full-screen canvas forever, on battery, for a hero nobody
can see.

## Key Assumptions to Validate
- [ ] Scrolling during the animation does not corrupt it. See the hazard
      below — this is the most likely thing to go wrong.
- [ ] The grid-jittered sweeps read as intentional paintwork, not as a
      wipe, and not as scribbles.
- [ ] A ~3s rest between cycles keeps each reveal feeling like an event
      rather than turning the hero into wallpaper.
- [ ] Phones at 1.5x resolution and 30fps show no visible quality loss on
      the soft gradient.
- [ ] 6.5s cycles do not make the page feel restless while reading.

## Cost

A permanent loop is the expensive case, not a 2-second flourish. At 390x844
and 3x density the canvas is ~3M pixels; repainting it 60 times a second is
~180M pixel writes/sec. Three reductions, none of them visible on a soft
gradient:

- **Cap resolution at 1.5x on touch** (desktop keeps 2x). ~4x fewer pixels.
- **Cap at 30fps**, skipping alternate frames. ~2x fewer again.
- **Freeze when off screen.** Zero when nobody is looking.

Together roughly 8x less work than the naive version.

## Technical hazards

- **The address bar is the big one.** On a phone, scrolling changes the
  viewport height, which fires `resize`, which currently calls `coverMask()`
  and would wipe the animation mid-flight. During the loop, height-only
  resizes are ignored and the canvas keeps its original backing size; the
  browser CSS-scales it for the few percent of squash, which is invisible on
  a soft gradient. Width changes (rotation) still get a full re-measure.
- **The reverse pass cannot use the erase brush.** Forward works today with
  `destination-out` plus a soft radial gradient. Going back to the calm
  photo means *painting* the photo in, shaped by the same soft gradient, so
  each dab becomes clip-to-the-dab-then-draw-the-photo. Dabs are batched
  per stroke so a whole sweep is one clip and one image draw, not one per dab.
- **Touch laptops stay on the desktop path.** Decided: no fallback loop.
  A few Windows touch-laptop users never see the effect.
- **`prefers-reduced-motion` is ignored**, by decision. Recorded here
  because it is the one thing in this plan a user can be deliberately
  excluded by, and it is a single `if` statement to reverse if that
  decision is ever revisited. Some of the people with that setting have
  vestibular sensitivity, and a full-screen moving image is one of the
  specific triggers.

## MVP Scope
- IN: A new `assets/js/hero-loop.v1.js`, loaded only where hover is
      unavailable, so desktop visitors never download it. Each file
      early-returns on the wrong capability.
- IN: `@media (hover: none)` stops hiding `.hero-bg-reveal` and
      `.hero-bg-canvas`. The Reset Sky button stays hidden — the loop
      resets itself.
- IN: The loop, the stroke generator, the three cost reductions, the
      scroll-resize guard, and reset-on-re-entry.
- OUT: Any change to the desktop cursor behaviour.
- OUT: Any change to any layout value. See `hero-veil-recolour.md`, whose
      HARD CONSTRAINTS section applies unchanged to this work.

## Not Doing (and Why)
- Not touch-drag — it is the scroll gesture.
- Not a tap-to-shift affordance — nobody discovers it, and it needs a hint
  that costs more than the animation.
- Not a CSS opacity crossfade — far cheaper, but the brush-stroke
  character is the entire point of this effect.
- Not looping while off screen — burns battery for an invisible hero.
- Not respecting `prefers-reduced-motion` — user's explicit call, recorded
  above rather than silently dropped.

## As Built (2026-09-27)

`assets/js/hero-loop.v1.js` plus a two-line change to the `hover: none`
block in `style.css` and one script tag. Desktop is untouched.

### Verified by simulation

Stroke coverage and phase timing were checked by replaying the shipped
constants (read out of the source file, not retyped) through the same alpha
compositing the canvas does, 30 random cycles per viewport, 8 viewports from
320x655 to 1024x768.

- **Mask left on screen after the forward pass: 11-14% mean, 14.5% worst.**
  The golden sky reads as fully revealed; the remainder is a faint haze.
- Forward pass ends at exactly 1650ms, rewind at exactly 3450ms, rest begins
  at 3450ms. No phase overruns.
- Rewind restores the mask to at least 81% everywhere.
- 320 dabs per cycle worst case, ~6 sprite operations per frame while
  painting. Cheap enough that the 30fps cap is the binding constraint, not
  the work.

Three defects were found and fixed this way, all of which would have shipped
looking fine in code review:

1. **Coverage was 61%, not "almost complete."** One stroke per cell is not
   one stroke *filling* the cell. The original reach was the cell's
   half-diagonal, which for a 195x286 cell spans ~450px while adjacent cells
   are 347px away -- six short strokes cannot tile an 858px-tall hero. Fixed
   by reaching the full diagonal plus 25% of a cell past it, widening the
   erase profile, and moving from a 2x3 grid to 4 columns. Columns turned out
   to be the only lever that mattered: adding rows changed almost nothing
   (43% -> 40%), adding a column changed a lot (43% -> 27%), because two
   45-degree bands from adjacent cells are separated perpendicular to the
   stroke by the cell pitch divided by root 2, and on a 390px phone that is
   138px against a 110px brush.
2. **The forward pass overran its window** by 175ms, eating the golden hold.
   The stroke stagger was a fixed fraction of the sweep, which only works for
   a handful of strokes; with 16 strokes the last one started too late. Now
   derived from the stroke duration.
3. **A flash of the golden sky on slow connections.** The
   `IntersectionObserver` fires within a frame of `observe()`, which on a slow
   connection is before the photo has decoded. Starting then would cover an
   empty mask and reveal the saturated sky -- the exact thing this effect
   holds back. Now gated on the photo being baked, with the observer set up
   after `measure()` so it cannot win the race.

### NOT verified

**The loop has not been observed running in a real browser.** A headless
browser was unavailable, and the fallback simulation disagreed with itself:
its alpha assertions for the forward and rewind passes did not register,
while its visibility, resize and first-frame assertions all passed. That is
consistent with a flaw in the throwaway harness, and also consistent with the
strokes not painting at all. Unresolved.

**First thing to check on a real phone: do the diagonal strokes appear
during the first 1.4 seconds?** If the hero just sits on the calm photo,
the strokes are not painting and no amount of retuning the timings will
help. Everything downstream of that -- coverage, the rewind, the seam
between the two skies -- depends on it.

Also unverified by eye: whether 11-14% residual mask reads as an intentional
haze or as smudges, and whether 16 sweeps still read as "a couple of
confident brush strokes" or have become a wash.

## Open Questions
- Timings (250ms / 1.4s / 400ms / 1.4s / 3s) are proposed, not chosen.
  They are single named values in one place and cheap to retune.
- Whether the 3 x 2 grid should be 3 x 3 on tall phone screens, where a
  3 x 2 grid makes each sweep very long and diagonal.
- Whether a visitor who never scrolls should see a slightly different
  sequence from one who does. Currently no distinction is made.
