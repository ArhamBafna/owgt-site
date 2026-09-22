# Visual Inspection Report: Local HTML vs Live Wix Site

After performing a side-by-side visual inspection using `agent-browser` full-page screenshots and analyzing the static HTML structure, I've identified several discrepancies and broken elements in the current local `index.html` compared to the live Wix site (`https://owgtofficial.wixstudio.com/owgt`).

Because the local HTML was obtained via `ctrl+u` (View Source), it only captured the initial server-side rendered (SSR) state. Wix heavily relies on its proprietary React-based rendering engine (Thunderbolt) and client-side JavaScript for interactivity, styling, and animations. 

Here are the key mismatches and UI errors:

## 1. Top Banner & Marquee Animation
* **Wix Attribution Banner**: The live site has a "Built on WIX STUDIO" banner at the very top. This is correctly missing from the local site (likely removed intentionally).
* **Broken Marquee**: The red "Empowering Through Technology 🏆" banner is statically rendered in the local HTML. On the live site, this is likely a scrolling marquee driven by CSS animations or JS. In the local version, it will remain completely static and may overflow incorrectly on different screen sizes.

## 2. Broken Interactivity & Hover States
* **Navigation Links**: The links in the header (`Welcome`, `Join`, `Chapter`, `RSVP`) will not smooth-scroll to their respective sections. Wix uses JS to handle anchor scrolling, which is missing in the static HTML.
* **Button Hover Effects**: The red `RSVP` button and other interactive elements will lack their hover state transitions (e.g., color darkening, scaling) because the specific state classes or JS event listeners are not present.

## 3. Scroll Animations & Intersections
* **Missing Fade/Slide-ins**: Wix typically applies entrance animations (fade-in, slide-up) as you scroll down the page. The local HTML has the initial pre-animation state (often `opacity: 0` or transformed). If the `index.html` was captured while elements were hidden, they might stay hidden permanently, or if they were visible, they will just appear abruptly without the smooth scroll animations.

## 4. Responsive Layout Issues
* **Hardcoded Viewport Classes**: The `ctrl+u` source captures the HTML exactly as it was requested for that specific viewport (desktop). Wix's CSS relies on specific DOM structures and classes injected dynamically for mobile breakpoints. The local version will likely break, scale poorly, or overlap when viewed on a mobile device or a very narrow window.
* **Grid and Flexbox Sizing**: Some CSS grids in the "Board" section might not reflow correctly on smaller screens without the accompanying responsive JS logic.

## 5. Extraneous & Dead Code
* **Bloated DOM**: The local `index.html` contains a massive amount of inline scripts, JSON payloads (`wix-essential-viewer-model`), and empty placeholder `div`s used by Wix's engine. These serve no purpose in a static site and significantly increase the file size.
* **Broken Image Lazy-Loading**: Wix images are often lazy-loaded. You might see `img:not([src]) { visibility: hidden }` in the CSS. If the `ctrl+u` grabbed the `<img>` tags before the `src` was injected by JS (leaving only a blurry placeholder or `srcset`), some images might not load at all on a fresh cache.

## Summary
While the static visual layout looks nearly identical in a controlled desktop viewport screenshot, the local `index.html` is effectively a "frozen" snapshot. It lacks all the dynamic behavior, responsiveness, and animations of the original Wix site because the proprietary JavaScript engine that orchestrates those features is disconnected.
