'use strict';

(function () {
    const btn = document.getElementById('footer-copy-email');
    if (!btn) { return; }

    const toast = btn.querySelector('.footer-copy-toast');
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

    function copyEmail() {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(EMAIL).then(showToast).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    }

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        copyEmail();
    });
})();
