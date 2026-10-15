'use strict';

(function () {
    const btn = document.getElementById('footer-copy-email');
    if (!btn) { return; }

    const toast = btn.querySelector('.footer-copy-toast');
    const email = btn.getAttribute('data-email') || 'oneworldgreatertogether@gmail.com';
    let timer = null;

    function showToast() {
        if (!toast) { return; }
        toast.classList.add('is-shown');
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            toast.classList.remove('is-shown');
            timer = null;
        }, 2000);
    }

    function copyEmail() {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email)
                .then(showToast)
                .catch(function () {
                    fallbackCopy(email);
                });
        } else {
            fallbackCopy(email);
        }
    }

    function fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            textarea.setAttribute('readonly', '');
            document.body.appendChild(textarea);
            textarea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) {
                showToast();
            }
        } catch (err) {
            // Silently fail if clipboard denied
        }
    }

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        copyEmail();
    });
})();
