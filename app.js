(function () {
  'use strict';

    var header = document.getElementById('site-header');

  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

    var toggle = document.getElementById('nav-toggle');

  if (toggle && header) {
    function closeNav() {
      if (header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    header.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); toggle.focus(); }
    });
  }

    var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && navLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

    var radioCards = document.querySelectorAll('.product-radio-card');

  function syncRadioCards() {
    radioCards.forEach(function (card) {
      var input = card.querySelector('input[type="radio"]');
      card.classList.toggle('is-selected', !!(input && input.checked));
    });
  }

  radioCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var input = card.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
        syncRadioCards();
      }
    });
  });

  syncRadioCards();

    document.querySelectorAll('[data-product]').forEach(function (cta) {
    cta.addEventListener('click', function () {
      var val = cta.getAttribute('data-product');
      var radio = document.querySelector('input[name="product"][value="' + val + '"]');
      if (radio) { radio.checked = true; syncRadioCards(); }
    });
  });

    function markInvalid(field) {
    field.style.borderColor = '#c0392b';
    field.style.boxShadow  = '0 0 0 3px rgba(192, 57, 43, 0.12)';
  }
  function clearInvalid(field) {
    field.style.borderColor = '';
    field.style.boxShadow  = '';
  }
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
  function escHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

    var eaForm    = document.getElementById('ea-form');
  var eaSuccess = document.getElementById('ea-success');
  var eaSummary = document.getElementById('ea-success-summary');

  if (eaForm && eaSuccess) {
    eaForm.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', function () { clearInvalid(inp); });
    });

    eaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField    = eaForm.querySelector('#ea-name');
      var companyField = eaForm.querySelector('#ea-company');
      var emailField   = eaForm.querySelector('#ea-email');
      var productInput = eaForm.querySelector('input[name="product"]:checked');
      var firstBad     = null;

      [nameField, companyField, emailField].forEach(function (f) {
        if (!f.value.trim()) {
          markInvalid(f);
          if (!firstBad) firstBad = f;
        } else {
          clearInvalid(f);
        }
      });

      if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
        markInvalid(emailField);
        if (!firstBad) firstBad = emailField;
      }

      if (firstBad) { firstBad.focus(); return; }

      var btn = eaForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Reserving your spot…'; }

      var productLabels = { fieldhand: 'Fieldhand (Field Service)', inventorii: 'Inventorii (Warehouse & Distribution)', both: 'Both Products' };
      var productLabel = productLabels[(productInput && productInput.value)] || 'Fieldhand (Field Service)';

      if (eaSummary) {
        eaSummary.innerHTML =
          '<strong>Reservation confirmed:</strong><br>' +
          '&bull; Name: '    + escHtml(nameField.value.trim())    + '<br>' +
          '&bull; Company: ' + escHtml(companyField.value.trim()) + '<br>' +
          '&bull; Email: '   + escHtml(emailField.value.trim())   + '<br>' +
          '&bull; Product: ' + escHtml(productLabel)              + '<br>' +
          '&bull; Discount: 20% flat lifetime discount applied at launch';
      }

      setTimeout(function () {
        var formEl = eaForm.closest('form') || eaForm;
        formEl.hidden = true;
        eaSuccess.hidden = false;
        eaSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    });
  }

  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxct-MHARhNebNtI5AMk8D0mp4E7OSHhIrZvz0qDptDkjw2ohumnSlE-pSV-68Bbkk/exec';

  var contactForm    = document.getElementById('contact-form');
  var contactSuccess = document.getElementById('contact-success');

  if (contactForm && contactSuccess) {
    contactForm.querySelectorAll('input, textarea').forEach(function (inp) {
      inp.addEventListener('input', function () { clearInvalid(inp); });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField    = contactForm.querySelector('#contact-name');
      var emailField   = contactForm.querySelector('#contact-email');
      var messageField = contactForm.querySelector('#contact-message');
      var topicField   = contactForm.querySelector('#contact-topic');
      var firstBad     = null;

      [nameField, emailField, messageField].forEach(function (f) {
        if (!f.value.trim()) {
          markInvalid(f);
          if (!firstBad) firstBad = f;
        } else {
          clearInvalid(f);
        }
      });

      if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
        markInvalid(emailField);
        if (!firstBad) firstBad = emailField;
      }

      if (firstBad) { firstBad.focus(); return; }

      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      if (GOOGLE_SCRIPT_URL) {
        var formData = new FormData(contactForm);
        formData.append('timestamp', new Date().toLocaleString());
        formData.append('sheet_name', 'Sheet2');
        formData.append('source', 'Simnosoft Contact Form');

        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        })
        .then(function () {
          contactForm.hidden = true;
          contactSuccess.hidden = false;
          contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          contactForm.hidden = true;
          contactSuccess.hidden = false;
          contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      } else {
        contactForm.hidden = true;
        contactSuccess.hidden = false;
        contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

    document.querySelectorAll('.faq-item summary').forEach(function (s) {
    s.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        s.parentElement.toggleAttribute('open');
      }
    });
  });

  /* --------------------------------------------------------------------------
     Fieldhand Early Access Modal (Triggers after 3 seconds)
     -------------------------------------------------------------------------- */
  var eaPopup = document.getElementById('fieldhand-popup');
  var eaPopupClose = document.getElementById('popup-close-btn');
  var eaPopupBackdrop = document.getElementById('popup-backdrop');
  var eaPopupDismiss = document.getElementById('popup-dismiss-link');

  if (eaPopup) {
    function openEaPopup() {
      eaPopup.classList.add('is-visible');
      eaPopup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeEaPopup() {
      eaPopup.classList.remove('is-visible');
      eaPopup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Expose globally for quick testing or manual opening if needed
    window.openFieldhandModal = openEaPopup;
    window.closeFieldhandModal = closeEaPopup;

    // Clear any previous session suppression
    try {
      sessionStorage.removeItem('fieldhand_popup_dismissed');
      sessionStorage.removeItem('simnosoft_fieldhand_popup_closed');
    } catch (e) {}

    // Trigger modal after 3 seconds (3000ms)
    setTimeout(openEaPopup, 3000);

    if (eaPopupClose) {
      eaPopupClose.addEventListener('click', function (e) {
        e.preventDefault();
        closeEaPopup();
      });
    }

    if (eaPopupBackdrop) {
      eaPopupBackdrop.addEventListener('click', function () {
        closeEaPopup();
      });
    }

    if (eaPopupDismiss) {
      eaPopupDismiss.addEventListener('click', function (e) {
        e.preventDefault();
        closeEaPopup();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && eaPopup.classList.contains('is-visible')) {
        closeEaPopup();
      }
    });
  }

})();

