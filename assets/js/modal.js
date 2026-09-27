'use strict';

(function () {
    const BREVO_FALLBACK_EMAIL = 'oneworldgreatertogether@gmail.com';

    const modal = document.getElementById('rsvp-modal');
    const formView = document.getElementById('rsvp-form-view');
    const successView = document.getElementById('rsvp-success-view');
    const errorDiv = document.getElementById('rsvp-error');
    const emailInput = document.getElementById('rsvp-email');
    const form = document.getElementById('rsvp-popup-form');
    const submitBtn = document.getElementById('rsvp-submit-btn');
    const btnText = submitBtn.querySelector('.rsvp-btn-text');
    const btnSpinner = submitBtn.querySelector('.rsvp-btn-spinner');

    let lastFocused = null;

    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function focusables() {
        return Array.prototype.filter.call(
            modal.querySelectorAll(FOCUSABLE),
            function (el) { return el.offsetParent !== null; }
        );
    }

    function openModal() {
        lastFocused = document.activeElement;
        formView.style.display = 'block';
        successView.style.display = 'none';
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        emailInput.value = '';

        modal.classList.remove('rsvp-modal-hidden');
        modal.classList.add('rsvp-modal-visible');
        document.body.classList.add('modal-open');
        emailInput.focus();
    }

    function closeModal() {
        modal.classList.remove('rsvp-modal-visible');
        modal.classList.add('rsvp-modal-hidden');
        document.body.classList.remove('modal-open');
        if (lastFocused) { lastFocused.focus(); }
    }

    function showError(message) {
        errorDiv.textContent = message + ' ';
        const link = document.createElement('a');
        link.href = 'mailto:' + BREVO_FALLBACK_EMAIL;
        link.className = 'email-link';
        link.textContent = BREVO_FALLBACK_EMAIL;
        errorDiv.appendChild(link);
        errorDiv.style.display = 'block';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-rsvp-open]')) {
            e.preventDefault();
            openModal();
        } else if (e.target.closest('[data-rsvp-close]')) {
            e.preventDefault();
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('rsvp-modal-hidden')) { return; }

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        // Trap Tab inside the dialog.
        if (e.key === 'Tab') {
            const items = focusables();
            if (items.length === 0) { return; }
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) { return; }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        errorDiv.style.display = 'none';
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';

        try {
            // Read the endpoint from the form's own action attribute, so the
            // URL exists in exactly one place in the codebase.
            const endpoint = form.getAttribute('action');
            const formData = new FormData();
            formData.append('EMAIL', email);
            formData.append('email_address_check', '');
            formData.append('locale', 'en');

            const res = await fetch(endpoint, { method: 'POST', body: formData, mode: 'cors' });

            // The response must be checked. Without this, any fetch that did
            // not throw showed "You're on the list!" -- including ad-blocker
            // rejections and 5xx responses.
            if (!res.ok) { throw new Error('Brevo responded ' + res.status); }

            formView.style.display = 'none';
            successView.style.display = 'block';
        } catch (err) {
            console.error('RSVP submission failed:', err);
            showError('Something went wrong on our end. Please try again, or email');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    });
})();
