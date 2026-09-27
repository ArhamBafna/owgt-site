'use strict';

(function () {
    const heroSection = document.getElementById('welcome');
    const canvas = document.getElementById('hero-mask-canvas');
    const resetBtn = document.getElementById('hero-reset-btn');
    const revealLayer = document.getElementById('hero-bg-reveal');
    if (!heroSection || !canvas || !resetBtn) { return; }

    // No hovering input means no cursor to uncover the golden sky with, so the
    // mask is skipped entirely and the calm original shows (see style.css).
    const canHover = window.matchMedia('(hover: hover) and (any-hover: hover)').matches;
    if (!canHover) { return; }

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // The mask is the original photo, unpainted. Erasing it uncovers the
    // richer golden-hour sky waiting underneath, so the first frame is the
    // real image rather than a drained copy of it.
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
        ctx.drawImage(bgImg, sX, sY, sWidth, sHeight, 0, 0, cssW, cssH);
    }

    // Only now is the mask opaque enough to hide the golden sky behind it.
    // Until this fires, .hero-bg-base is painting the original in CSS, so the
    // first frame is correct either way and the saturated sky never flashes.
    function maskIsPainted() {
        if (revealLayer) { revealLayer.classList.add('is-ready'); }
    }

    function paintBase() {
        ctx.clearRect(0, 0, cssW, cssH);
        if (bgImg.complete && bgImg.naturalWidth !== 0) {
            drawImageCover();
            maskIsPainted();
        } else {
            bgImg.addEventListener('load', function () {
                drawImageCover();
                maskIsPainted();
            }, { once: true });
        }
        isPainted = false;
        resetBtn.classList.remove('is-visible');
    }

    function coverMask() {
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
        coverMask();
    }

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
    });
    resizeCanvas();

    heroSection.addEventListener('mousemove', function (e) {
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
        // The middle stop stays low so the rim of the hole dissolves instead of
        // ending. Between two full-colour skies a hard rim reads as a ring.
        gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.10)');
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
        coverMask();
    });
})();
