'use strict';

(function () {
    const BREVO_FALLBACK_EMAIL = 'oneworldgreatertogether@gmail.com';
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ==========================================================================
    // 1. RSVP POPUP MODAL & FORM
    // ==========================================================================
    const modal = document.getElementById('rsvp-modal');
    const formView = document.getElementById('rsvp-form-view');
    const successView = document.getElementById('rsvp-success-view');
    const rsvpError = document.getElementById('rsvp-error');
    const rsvpEmail = document.getElementById('rsvp-email');
    const rsvpForm = document.getElementById('rsvp-popup-form');
    const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');

    let lastFocused = null;
    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function setModalState(state) {
        if (modal) {
            modal.setAttribute('data-state', state);
        }
    }

    function focusables() {
        if (!modal) { return []; }
        return Array.prototype.filter.call(
            modal.querySelectorAll(FOCUSABLE),
            function (el) { return el.offsetParent !== null; }
        );
    }

    function openModal() {
        if (!modal) { return; }
        lastFocused = document.activeElement;
        setModalState('idle');
        if (formView) { formView.style.display = 'block'; }
        if (successView) { successView.style.display = 'none'; }
        if (rsvpError) {
            rsvpError.style.display = 'none';
            rsvpError.textContent = '';
        }
        if (rsvpEmail) {
            rsvpEmail.value = '';
        }

        modal.classList.remove('rsvp-modal-hidden');
        modal.classList.add('rsvp-modal-visible');
        document.body.classList.add('modal-open');
        if (rsvpEmail) { rsvpEmail.focus(); }
    }

    function closeModal() {
        if (!modal) { return; }
        modal.classList.remove('rsvp-modal-visible');
        modal.classList.add('rsvp-modal-hidden');
        document.body.classList.remove('modal-open');
        if (lastFocused) { lastFocused.focus(); }
    }

    function showRsvpError(message, withEmailLink) {
        if (!rsvpError) { return; }
        rsvpError.textContent = message + (withEmailLink ? ' ' : '');
        if (withEmailLink) {
            const link = document.createElement('a');
            link.href = 'mailto:' + BREVO_FALLBACK_EMAIL;
            link.className = 'email-link';
            link.textContent = BREVO_FALLBACK_EMAIL;
            rsvpError.appendChild(link);
        }
        rsvpError.style.display = 'block';
    }

    if (modal) {
        setModalState('idle');

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

            // Trap Tab inside the dialog
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
    }

    if (rsvpForm && rsvpEmail && rsvpSubmitBtn) {
        const btnText = rsvpSubmitBtn.querySelector('.rsvp-btn-text');
        const btnSpinner = rsvpSubmitBtn.querySelector('.rsvp-btn-spinner');

        rsvpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = rsvpEmail.value.trim();
            if (!email) {
                setModalState('error');
                showRsvpError('Please enter your email address.', false);
                return;
            }

            if (!EMAIL_REGEX.test(email)) {
                setModalState('error');
                showRsvpError('Please enter a valid email address.', false);
                return;
            }

            if (rsvpError) { rsvpError.style.display = 'none'; }
            setModalState('loading');
            rsvpSubmitBtn.disabled = true;
            if (btnText) { btnText.style.display = 'none'; }
            if (btnSpinner) { btnSpinner.style.display = 'inline-block'; }

            try {
                const endpoint = rsvpForm.getAttribute('action');
                const formData = new FormData();
                formData.append('EMAIL', email);
                formData.append('email_address_check', '');
                formData.append('locale', 'en');

                const res = await fetch(endpoint, { method: 'POST', body: formData, mode: 'cors' });
                if (!res.ok) { throw new Error('Brevo responded ' + res.status); }

                setModalState('success');
                if (formView) { formView.style.display = 'none'; }
                if (successView) { successView.style.display = 'block'; }
            } catch (err) {
                console.error('RSVP submission failed:', err);
                setModalState('error');
                showRsvpError('Something went wrong on our end. Please try again, or email', true);
            } finally {
                rsvpSubmitBtn.disabled = false;
                if (btnText) { btnText.style.display = 'inline-block'; }
                if (btnSpinner) { btnSpinner.style.display = 'none'; }
            }
        });
    }

    // ==========================================================================
    // 2. INLINE NEWSLETTER FORM & STATE MACHINE
    // ==========================================================================
    const inlineFormContainer = document.getElementById('sib-form-container');
    const inlineContainer = document.getElementById('sib-container');
    const inlineForm = document.getElementById('sib-form');
    const inlineEmail = document.getElementById('EMAIL') || (inlineForm ? inlineForm.querySelector('input[name="EMAIL"]') : null);
    const inlineErrorPanel = document.getElementById('error-message');
    const inlineSuccessPanel = document.getElementById('success-message');
    const inlineEntryError = inlineForm ? inlineForm.querySelector('.entry__error') : null;
    const inlineSubmitBtn = inlineForm ? inlineForm.querySelector('button[type="submit"]') : null;

    function setInlineState(state) {
        if (inlineFormContainer) {
            inlineFormContainer.setAttribute('data-state', state);
        }
        if (inlineContainer) {
            inlineContainer.setAttribute('data-state', state);
        }
        if (inlineForm) {
            inlineForm.setAttribute('data-state', state);
        }
    }

    function showInlineError(message, withEmailLink) {
        if (inlineErrorPanel) {
            const innerText = inlineErrorPanel.querySelector('.sib-form-message-panel__inner-text');
            if (innerText) {
                innerText.textContent = message + (withEmailLink ? ' ' : '');
                if (withEmailLink) {
                    const link = document.createElement('a');
                    link.href = 'mailto:' + BREVO_FALLBACK_EMAIL;
                    link.style.color = 'inherit';
                    link.style.textDecoration = 'underline';
                    link.textContent = BREVO_FALLBACK_EMAIL;
                    innerText.appendChild(link);
                }
            }
            inlineErrorPanel.style.display = 'block';
        }
        if (inlineEntryError) {
            inlineEntryError.textContent = message;
            inlineEntryError.style.display = 'block';
        }
        if (inlineSuccessPanel) {
            inlineSuccessPanel.style.display = 'none';
        }
    }

    function clearInlineError() {
        if (inlineErrorPanel) {
            inlineErrorPanel.style.display = 'none';
        }
        if (inlineEntryError) {
            inlineEntryError.textContent = '';
            inlineEntryError.style.display = 'none';
        }
    }

    if (inlineForm && inlineEmail) {
        setInlineState('idle');

        inlineForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = inlineEmail.value.trim();
            if (!email) {
                setInlineState('error');
                showInlineError('Please enter your email address.', false);
                return;
            }

            if (!EMAIL_REGEX.test(email)) {
                setInlineState('error');
                showInlineError('Please enter a valid email address.', false);
                return;
            }

            clearInlineError();
            setInlineState('loading');
            if (inlineSubmitBtn) { inlineSubmitBtn.disabled = true; }

            try {
                const endpoint = inlineForm.getAttribute('action');
                const formData = new FormData(inlineForm);
                formData.set('EMAIL', email);
                formData.set('email_address_check', '');
                formData.set('locale', 'en');

                const res = await fetch(endpoint, { method: 'POST', body: formData, mode: 'cors' });
                if (!res.ok) { throw new Error('Brevo responded ' + res.status); }

                setInlineState('success');
                if (inlineSuccessPanel) {
                    inlineSuccessPanel.style.display = 'block';
                }
                inlineForm.style.display = 'none';
            } catch (err) {
                console.error('Newsletter submission failed:', err);
                setInlineState('error');
                showInlineError('Something went wrong on our end. Please try again, or email', true);
            } finally {
                if (inlineSubmitBtn) { inlineSubmitBtn.disabled = false; }
            }
        });
    }
})();
