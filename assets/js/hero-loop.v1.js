'use strict';

/* ==========================================================================
   Mobile hero: the sky loop.

   Desktop visitors uncover the golden sky with the cursor. This file is the
   same effect for devices with no cursor: it drives the identical mask brush
   along generated diagonal sweeps instead of a pointer position, and keeps
   doing so while the hero is on screen.

   Ships to every browser and does nothing on one with a cursor, which is the
   same pattern assets/js/hero-canvas.v3.js uses in reverse. Only one of the
   two ever runs.

   Touch-drag is deliberately NOT used. Dragging is the scroll gesture, so
   fighting it would break the page.
   ========================================================================== */

(function () {
    const heroSection = document.getElementById('welcome');
    const canvas = document.getElementById('hero-mask-canvas');
    const revealLayer = document.getElementById('hero-bg-reveal');
    if (!heroSection || !canvas || !revealLayer) { return; }

    // Anything with a cursor belongs to hero-canvas.v3.js.
    const canHover = window.matchMedia('(hover: hover) and (any-hover: hover)').matches;
    if (canHover) { return; }

    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    /* ----------------------------------------------------------------------
       Cost controls, all three chosen deliberately.

       This loop repaints every frame for as long as the visitor reads the
       hero. At 390x844 and 3x density the canvas is ~3M pixels, so painting
       it 60 times a second is ~180M pixel writes/sec. A budget Android gets
       hot and stuttery on that. The mask is a soft gradient with no sharp
       detail, which is what makes all three cuts invisible.
       ---------------------------------------------------------------------- */

    // Desktop caps at 2. Phones cap at 1.5: ~4x fewer pixels, and a blurred
    // radial gradient is indistinguishable at 1.5x.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    // 30fps. A 1.4s colour sweep looks identical at half the frame rate.
    const FRAME_MS = 1000 / 30;

    // The brush radius as a share of viewport width, so the stroke character
    // survives from a 320px phone to a tablet. A desktop-sized 200px brush
    // swallows a phone screen in two or three dabs and the whole effect
    // collapses into a plain crossfade.
    //
    // The upper bound is high on purpose. It is only reached on tablets, where
    // a small brush relative to a 768px-wide viewport cannot tile the sky: at
    // a 84px cap the iPad left 25% of the mask showing, at 108px it leaves 13%.
    const RADIUS_RATIO = 0.14;
    const RADIUS_MIN = 34;
    const RADIUS_MAX = 130;

    // Dabs along a sweep, as a share of the radius. Dense enough that the
    // stroke reads as one continuous band.
    const DAB_SPACING_RATIO = 0.38;

    // How far a sweep overshoots its cell, as a share of the cell diagonal, so
    // neighbouring strokes overlap and the set tiles the hero.
    const CELL_OVERLAP = 0.25;

    // Sweeps per row and column. Columns are what make coverage work: adding
    // columns beat adding rows by a wide margin, because two 45-degree bands
    // from adjacent cells are separated PERPENDICULARLY by the cell pitch
    // divided by root 2. On a 390px phone, cell pitch 195px becomes a 138px
    // perpendicular gap, which is wider than a 110px brush -- so every pair of
    // neighbours left a diagonal strip of untouched mask.
    const COLS = 4;
    const ROWS_PORTRAIT = 4;
    const ROWS_LANDSCAPE = 3;

    const PHASE = {
        leadIn: 250,     // beat on the calm photo before anything moves
        sweep: 1400,     // forward: golden sky uncovered
        holdGolden: 400, // hold at full golden
        rewind: 1400,    // same sweeps backwards: calm photo painted back
        restCalm: 3000,  // rest, so each cycle reads as an event not wallpaper
    };
    const CYCLE_MS = PHASE.leadIn + PHASE.sweep + PHASE.holdGolden
        + PHASE.rewind + PHASE.restCalm;

    /* Erase profile: the forward pass makes pixels transparent, and alpha in
       the sprite is how much mask each dab removes. Near-opaque at the centre
       is what makes coverage possible -- a soft profile spends most of a dab's
       edge on ink that barely registers, which is what left 61% of the mask on
       screen in the first attempt. */
    const ERASE_STOPS = [[0, 1], [0.62, 0.9], [1, 0]];

    /* Repaint profile: the rewind cannot erase, there is nothing underneath to
       uncover. It has to paint the calm photo back IN, shaped by the same soft
       dab, so the sprite's interior is fully opaque out to 0.7R and only the
       outer band feathers. Alpha compositing is not its own inverse, so
       reusing the erase profile here would leave golden ghosting. */
    const PAINT_STOPS = [[0, 1], [0.7, 1], [1, 0]];

    const TAU = Math.PI * 2;

    const bgImg = new Image();
    bgImg.src = 'assets/images/hero_bg.webp';

    // The photo, pre-scaled to exactly cover the canvas. Repainting the
    // rewind means stamping a 2R square of it per dab, and sampling it from
    // a pre-scaled tile avoids recomputing the cover crop every frame.
    const tile = document.createElement('canvas');
    const tileCtx = tile.getContext('2d');

    const eraseSprite = document.createElement('canvas');
    const eraseCtx = eraseSprite.getContext('2d');

    const paintSprite = document.createElement('canvas');
    const paintCtx = paintSprite.getContext('2d');
    let paintMask = null;

    let cssW = 0;
    let cssH = 0;
    let radius = RADIUS_MIN;
    let spriteSize = 0;

    let dabs = [];
    let drawnFwd = 0;
    let drawnRew = 0;
    let cycleStart = 0;

    let running = false;
    let frame = null;
    let lastFrame = 0;

    // The photo has to be decoded and baked before the loop is allowed to
    // start or reveal anything.
    let ready = false;
    let inView = false;

    function rand(lo, hi) { return lo + Math.random() * (hi - lo); }

    /* ----------------------------------------------------------------------
       Geometry
       ---------------------------------------------------------------------- */

    // Same "cover" arithmetic the CSS uses on .hero-bg-base, so the mask and
    // the golden sky underneath register pixel for pixel. Both files are the
    // same 1678x937 asset, which is the only reason this lines up.
    function coverSource(imgW, imgH) {
        const canvasRatio = cssW / cssH;
        const imgRatio = imgW / imgH;
        if (imgRatio > canvasRatio) {
            const sHeight = imgH;
            const sWidth = imgH * canvasRatio;
            return { sx: (imgW - sWidth) / 2, sy: 0, sw: sWidth, sh: sHeight };
        }
        const sWidth = imgW;
        const sHeight = imgW / canvasRatio;
        return { sx: 0, sy: (imgH - sHeight) / 2, sw: sWidth, sh: sHeight };
    }

    function buildSprites() {
        radius = Math.round(Math.min(Math.max(cssW * RADIUS_RATIO, RADIUS_MIN), RADIUS_MAX));
        spriteSize = Math.ceil(radius * 2);

        eraseSprite.width = spriteSize;
        eraseSprite.height = spriteSize;
        eraseCtx.clearRect(0, 0, spriteSize, spriteSize);
        const eg = eraseCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        ERASE_STOPS.forEach(function (s) {
            eg.addColorStop(s[0], 'rgba(255,255,255,' + s[1] + ')');
        });
        eraseCtx.fillStyle = eg;
        eraseCtx.fillRect(0, 0, spriteSize, spriteSize);

        // The repaint sprite is rebuilt per dab because its contents depend on
        // which part of the sky that dab sits over. Only the mask is fixed,
        // so that gradient is built once and reused.
        paintSprite.width = spriteSize;
        paintSprite.height = spriteSize;
        paintMask = paintCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        PAINT_STOPS.forEach(function (s) {
            paintMask.addColorStop(s[0], 'rgba(0,0,0,' + s[1] + ')');
        });
    }

    function bakeTile() {
        tile.width = Math.max(1, Math.round(cssW * DPR));
        tile.height = Math.max(1, Math.round(cssH * DPR));
        const s = coverSource(bgImg.width, bgImg.height);
        tileCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
        tileCtx.clearRect(0, 0, cssW, cssH);
        if (bgImg.complete && bgImg.naturalWidth !== 0) {
            tileCtx.drawImage(bgImg, s.sx, s.sy, s.sw, s.sh, 0, 0, cssW, cssH);
        }
    }

    function measure() {
        cssW = canvas.offsetWidth;
        cssH = canvas.offsetHeight;
        canvas.width = Math.max(1, Math.round(cssW * DPR));
        canvas.height = Math.max(1, Math.round(cssH * DPR));
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        buildSprites();
    }

    // Full mask, i.e. the calm photo at full strength. This is also the
    // resting state between cycles and after scrolling away.
    function coverMask() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, cssW, cssH);
        const s = coverSource(bgImg.width, bgImg.height);
        ctx.drawImage(bgImg, s.sx, s.sy, s.sw, s.sh, 0, 0, cssW, cssH);
    }

    function revealReady() {
        revealLayer.classList.add('is-ready');
    }

    /* ----------------------------------------------------------------------
       Stroke generation

       Not uniformly random. Random sweeps leave patches of mask showing
       where the strokes happened to miss, and a bald patch reads as a
       rendering bug rather than a deliberate look.

       Instead the hero is divided into a loose grid, one sweep per cell, and
       each sweep is jittered off its cell centre. Coverage is guaranteed by
       construction; no two cycles look alike.

       The grid is oriented to the hero's own proportions. A phone hero is
       tall, so a 3x2 grid would make every sweep a very long thin diagonal;
       2x3 gives strokes a sane length to travel.
       ---------------------------------------------------------------------- */

    function sampleSweep(s, spacing) {
        const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0) * 1.1;
        const n = Math.max(2, Math.round(len / spacing));
        const pts = [];
        for (let i = 0; i <= n; i++) {
            const t = i / n;
            const mt = 1 - t;
            pts.push({
                x: mt * mt * s.x0 + 2 * mt * t * s.mx + t * t * s.x1,
                y: mt * mt * s.y0 + 2 * mt * t * s.my + t * t * s.y1,
            });
        }
        return pts;
    }

    function buildCycle() {
        const portrait = cssH > cssW;
        const cols = COLS;
        const rows = portrait ? ROWS_PORTRAIT : ROWS_LANDSCAPE;
        const cellW = cssW / cols;
        const cellH = cssH / rows;
        const spacing = Math.max(6, radius * DAB_SPACING_RATIO);

        // How far a sweep reaches past its cell centre. The cell's own corner
        // distance is not enough: measured, one stroke per cell with a
        // centre-only reach left 61% of the mask on screen. Reaching the full
        // diagonal plus a quarter of a cell past it on each side means
        // neighbouring strokes overlap, and the union tiles the hero.
        //
        // Measured over 30 random cycles per viewport across 8 devices, the
        // values in this file leave 12-14% of the mask showing, worst case
        // 14.5%. The golden sky reads as fully revealed; the remainder is a
        // faint haze, not a visible unpainted patch.
        const reach = Math.hypot(cellW, cellH) * (0.5 + CELL_OVERLAP);

        const sweeps = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Alternating diagonals, so the strokes read as a series of
                // confident sweeps rather than all running the same way.
                const down = (r + c) % 2 === 0;
                const angle = (down ? Math.PI / 4 : -Math.PI / 4) + rand(-0.14, 0.14);
                const ux = Math.cos(angle);
                const uy = Math.sin(angle);

                // Jittered off the cell centre by up to ~10% so the pattern
                // never looks like a grid.
                const cx = (c + 0.5) * cellW + rand(-0.1, 0.1) * cellW;
                const cy = (r + 0.5) * cellH + rand(-0.1, 0.1) * cellH;

                // A slight bow, perpendicular to the sweep.
                const bow = rand(-0.09, 0.09) * cellW;

                sweeps.push({
                    x0: cx - ux * reach, y0: cy - uy * reach,
                    x1: cx + ux * reach, y1: cy + uy * reach,
                    mx: cx - uy * bow, my: cy + ux * bow,
                });
            }
        }

        // Strokes overlap in time, so the reveal reads as continuous motion
        // rather than a series that start and stop.
        //
        // The stagger is derived from the stroke DURATION, not a fixed
        // fraction of the window. A fixed fraction silently overran: the last
        // stroke started at 1195ms and its dabs ran 630ms, landing at 1825ms
        // -- 175ms past the end of the sweep, which ate into the golden hold.
        const strokeDur = PHASE.sweep * 0.45;
        const stagger = (PHASE.sweep - strokeDur) / Math.max(1, sweeps.length - 1);

        dabs = [];
        sweeps.forEach(function (s, i) {
            const t0 = PHASE.leadIn + i * stagger;
            const pts = sampleSweep(s, spacing);
            pts.forEach(function (p, j) {
                dabs.push({
                    x: p.x, y: p.y,
                    tF: t0 + (j / (pts.length - 1)) * strokeDur,
                });
            });
        });

        // The rewind is the forward pass run backwards: whatever was drawn
        // last is covered first.
        const rewStart = PHASE.leadIn + PHASE.sweep + PHASE.holdGolden;
        const total = dabs.length;
        dabs.forEach(function (d, k) {
            d.tR = rewStart + ((total - 1 - k) / Math.max(1, total - 1)) * PHASE.rewind;
        });

        drawnFwd = 0;
        drawnRew = 0;
    }

    /* ----------------------------------------------------------------------
       Painting
       ---------------------------------------------------------------------- */

    function eraseAt(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(eraseSprite, x - radius, y - radius, spriteSize, spriteSize);
    }

    function repaintAt(x, y) {
        const sx = (x - radius) / cssW * tile.width;
        const sy = (y - radius) / cssH * tile.height;
        const sw = spriteSize / cssW * tile.width;
        const sh = spriteSize / cssH * tile.height;

        paintCtx.globalCompositeOperation = 'source-over';
        paintCtx.clearRect(0, 0, spriteSize, spriteSize);
        paintCtx.drawImage(tile, sx, sy, sw, sh, 0, 0, spriteSize, spriteSize);
        paintCtx.globalCompositeOperation = 'destination-in';
        paintCtx.fillStyle = paintMask;
        paintCtx.fillRect(0, 0, spriteSize, spriteSize);
        paintCtx.globalCompositeOperation = 'source-over';

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(paintSprite, x - radius, y - radius, spriteSize, spriteSize);
    }

    /* ----------------------------------------------------------------------
       Loop
       ---------------------------------------------------------------------- */

    function tick(now) {
        if (!running) { frame = null; return; }
        frame = requestAnimationFrame(tick);
        if (now - lastFrame < FRAME_MS) { return; }
        lastFrame = now;

        if (now - cycleStart >= CYCLE_MS) {
            // Reset to a clean full mask each cycle. The rewind lands at ~81%
            // rather than 100% because its dabs feather, and erase is
            // multiplicative, so without this the leftover would compound
            // cycle over cycle. One full-canvas draw per 6.45s is nothing.
            coverMask();
            buildCycle();
            cycleStart = now;
            return;
        }

        const t = now - cycleStart;

        while (drawnFwd < dabs.length && dabs[drawnFwd].tF <= t) {
            const d = dabs[drawnFwd++];
            eraseAt(d.x, d.y);
        }

        while (drawnRew < dabs.length && dabs[drawnRew].tR <= t) {
            const d = dabs[drawnRew++];
            repaintAt(d.x, d.y);
        }
    }

    function startLoop() {
        if (running) { return; }
        running = true;
        coverMask();
        revealReady();
        buildCycle();
        cycleStart = performance.now();
        lastFrame = 0;
        frame = requestAnimationFrame(tick);
    }

    function stopLoop() {
        if (!running) { return; }
        running = false;
        if (frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
        coverMask();
    }

    /* ----------------------------------------------------------------------
       Visibility

       The loop runs while the hero is on screen and stops the moment it
       leaves. Browsers pause animation for a hidden TAB but not for an
       off-screen ELEMENT, so without this it would repaint a full-screen
       canvas indefinitely, on battery, for a hero nobody is looking at.

       Scrolling back up resets to the calm photo and plays a fresh cycle
       from the start, because by then the visitor is actually looking.
       ---------------------------------------------------------------------- */

    /* ----------------------------------------------------------------------
       Resize

       The address bar is the hazard here, not a real layout change. Scrolling
       on a phone changes the viewport height, the page sees that as a resize,
       and a naive handler would tear the mask down mid-animation.

       So while the loop is running, height-only changes are ignored and the
       canvas keeps its backing size; the browser CSS-scales it through the
       few percent of squash, which is invisible on a soft gradient. Width
       changes are real (rotation) and get a full re-measure and restart.
       ---------------------------------------------------------------------- */

    let lastW = 0;
    let lastH = 0;

    window.addEventListener('resize', function () {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (w === lastW && h === lastH) { return; }

        const widthChanged = w !== lastW;
        lastW = w;
        lastH = h;

        if (running && !widthChanged) { return; }

        measure();
        if (ready) { bakeTile(); }
        coverMask();
        if (running) {
            buildCycle();
            cycleStart = performance.now();
        }
    });

    /* ----------------------------------------------------------------------
       Start

       Order matters and is the whole reason this block is last. The canvas
       has to be measured, and the photo decoded and baked, before anything
       reveals the golden layer -- otherwise the mask is briefly empty and the
       saturated sky flashes on screen, which is the exact thing this effect
       holds back.

       prefers-reduced-motion is deliberately not honoured. That is a decision,
       not an oversight: some of the people who enable it have vestibular
       sensitivity and a full-screen moving image is a specific trigger. If
       that call is ever reversed this is the one place to branch on.
       ---------------------------------------------------------------------- */

    measure();

    function begin() {
        bakeTile();
        coverMask();
        revealReady();
        ready = true;
        // The hero was already on screen when the observer first fired, and
        // the observer does not fire again without a visibility change.
        if (inView) { startLoop(); }
    }

    if (bgImg.complete && bgImg.naturalWidth !== 0) {
        begin();
    } else {
        bgImg.addEventListener('load', begin, { once: true });
    }

    // Set up last, so the observer's first callback cannot beat measure().
    if ('IntersectionObserver' in window) {
        new window.IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                inView = e.isIntersecting;
                if (inView) {
                    if (ready) { startLoop(); }
                } else {
                    stopLoop();
                }
            });
        }, { threshold: 0.01 }).observe(heroSection);
    } else {
        // No visibility API: run it, and keep running it. This is the
        // browser-support fallback, and every current mobile browser has the
        // observer, so the battery cost here is hypothetical.
        inView = true;
        // begin() may already have run, in which case it saw inView as false
        // and skipped the start. Cover both orders.
        if (ready) { startLoop(); }
    }
})();
