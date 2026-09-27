# Mobile Hero: Vertical Sky Wave Loop

## Problem Statement
How might we reveal golden hour smoothly on phones without messy diagonal strokes or phone battery drain?

## Recommended Direction
Pure CSS mask vertical wave. Exactly 6-second cycle:
1. **0s–2s (Sweep to Golden)**: Golden sky washes down from top to bottom. Edge has 200px soft feather (matches desktop hover brush).
2. **2s–3s (Hold Golden)**: Hold full golden sky for 1 second.
3. **3s–5s (Sweep to Calm)**: Calm photo washes down from top to bottom (golden dissolves top-to-bottom, uncovering calm).
4. **5s–6s (Hold Calm)**: Hold full calm photo for 1 second.
5. **Loop continues**.

## Technical Engine
- **Pure CSS Mask**: Run by browser GPU (`mask-image: linear-gradient(...)`). No complex canvas drawing math.
- **Battery Guard**: Tiny `IntersectionObserver` script pauses CSS animation when hero scrolled off screen (`animation-play-state: paused`). Resumes when hero visible.
- **Delete old canvas loop**: Retires 516-line `assets/js/hero-loop.v1.js`.

## Scope
- **IN**: Mobile CSS mask keyframes in `style.css` under `@media (hover: none)`.
- **IN**: Pause-off-screen observer (in a new small js file `hero-mobile-observer.js` or similar, or inline).
- **IN**: Clean retirement of old diagonal script tag and file.
- **OUT**: Desktop canvas untouched.
- **OUT**: Touch / tap interaction (self-plays automatically).
- **OUT**: `prefers-reduced-motion` check (plays for all mobile visitors).
