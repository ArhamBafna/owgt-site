'use strict';

(function () {
    const heroSection = document.getElementById('welcome');
    const revealLayer = document.getElementById('hero-bg-reveal');
    if (!heroSection || !revealLayer) { return; }

    // Desktop uses hero-canvas.v3.js (hover: hover).
    // This observer is ONLY for mobile/touch devices.
    const canHover = window.matchMedia('(hover: hover) and (any-hover: hover)').matches;
    if (canHover) { return; }

    // Make it visible first, because on desktop it's hidden until canvas is ready.
    revealLayer.classList.add('is-ready');

    if ('IntersectionObserver' in window) {
        new window.IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    revealLayer.style.animationPlayState = 'running';
                } else {
                    revealLayer.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.01 }).observe(heroSection);
    }
})();
