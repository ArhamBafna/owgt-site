'use strict';

(function () {
    // 1. Navigation toggle & responsive menu
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    if (toggle && links) {
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
    }

    // 2. Footer copy email button
    const copyBtn = document.getElementById('footer-copy-email');
    if (copyBtn) {
        const toast = copyBtn.querySelector('.footer-copy-toast');
        const EMAIL = 'oneworldgreatertogether@gmail.com';
        let hideTimer = null;

        function showToast() {
            if (!toast) { return; }
            toast.classList.add('is-shown');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(function () {
                toast.classList.remove('is-shown');
            }, 2000);
        }

        function fallbackCopy() {
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = '0';
            input.value = EMAIL;
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand('copy');
                showToast();
            } catch (_) {}
            input.remove();
        }

        copyBtn.addEventListener('click', function () {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(EMAIL).then(showToast).catch(fallbackCopy);
            } else {
                fallbackCopy();
            }
        });
    }
})();
