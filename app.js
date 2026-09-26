document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('flexiForm_wSR13');
  const submitBtn = document.getElementById('ipspw');
  const successMsg = document.getElementById('audit-success');

  // country dropdown
  const selectedFlag = document.querySelector('.iti__selected-flag');
  const countryList = document.querySelector('#iti-0__country-listbox');
  const phoneInput = document.querySelector('#iuw4j');

  if (selectedFlag && countryList) {
    if (window.COUNTRIES_DATA && countryList.children.length === 0) {
      let html = '';
      let hasDivider = false;
      window.COUNTRIES_DATA.forEach(function (c) {
        if (!c.p && !hasDivider) {
          html += '<li class="iti__divider" role="separator" aria-disabled="true"></li>';
          hasDivider = true;
        }
        const prefClass = c.p ? 'iti__preferred' : 'iti__standard';
        const activeClass = c.c === 'in' ? ' iti__active' : '';
        const selected = c.c === 'in' ? 'true' : 'false';
        html += '<li class="iti__country ' + prefClass + activeClass + '" tabindex="-1" id="iti-0__item-' + c.c + '" role="option" data-dial-code="' + c.d + '" data-country-code="' + c.c + '" aria-selected="' + selected + '">' +
          '<div class="iti__flag-box"><div class="iti__flag iti__' + c.c + '"></div></div>' +
          '<span class="iti__country-name">' + c.n + '</span>' +
          '<span class="iti__dial-code">+' + c.d + '</span>' +
        '</li>';
      });
      countryList.innerHTML = html;
    }

    let currentDialCode = '91';
    let currentCountryCode = 'in';

    selectedFlag.addEventListener('click', function (e) {
      e.stopPropagation();
      countryList.classList.toggle('iti__hide');
    });

    countryList.addEventListener('click', function (e) {
      const item = e.target.closest('.iti__country');
      if (!item) return;
      e.stopPropagation();
      const dialCode = item.getAttribute('data-dial-code') || '91';
      const countryCode = item.getAttribute('data-country-code') || 'in';
      currentDialCode = dialCode;
      currentCountryCode = countryCode;

      const flag = selectedFlag.querySelector('.iti__flag');
      if (flag) {
        flag.className = 'iti__flag iti__' + countryCode;
      }
      if (phoneInput) {
        phoneInput.placeholder = '+' + dialCode + ' Phone Number';
      }
      countryList.querySelectorAll('.iti__country').forEach(function (el) {
        el.classList.remove('iti__active');
      });
      item.classList.add('iti__active');
      countryList.classList.add('iti__hide');
    });

    document.addEventListener('click', function () {
      if (countryList) countryList.classList.add('iti__hide');
    });

    // form submission
    if (submitBtn) {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxct-MHARhNebNtI5AMk8D0mp4E7OSHhIrZvz0qDptDkjw2ohumnSlE-pSV-68Bbkk/exec';

      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const nameInput = document.querySelector('#iyozi');
        const emailInput = document.querySelector('#im3po');
        const phoneInput = document.querySelector('#iuw4j');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const rawPhone = phoneInput ? phoneInput.value.trim() : '';

        if (!name) {
          alert('Please enter your first name.');
          if (nameInput) nameInput.focus();
          return;
        }

        if (!email || email.indexOf('@') === -1) {
          alert('Please enter a valid email address.');
          if (emailInput) emailInput.focus();
          return;
        }

        if (!rawPhone) {
          alert('Please enter your phone number.');
          if (phoneInput) phoneInput.focus();
          return;
        }

        const btnTxt = submitBtn.querySelector('.ffbtnmaintxt');
        if (btnTxt) {
          btnTxt.textContent = 'Submitting...';
        }
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.75';

        const formattedPhone = rawPhone.startsWith('+') ? rawPhone : ('+' + currentDialCode + ' ' + rawPhone);

        // spreadsheet data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('first_name', name);
        formData.append('email', email);
        formData.append('phone', formattedPhone);
        formData.append('dial_code', '+' + currentDialCode);
        formData.append('country', currentCountryCode.toUpperCase());
        formData.append('source', 'Simnosoft Free Audit Form');
        formData.append('sheet_name', 'Sheet2');
        formData.append('timestamp', new Date().toLocaleString());

        function showSuccess() {
          if (form) form.style.display = 'none';
          if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        if (GOOGLE_SCRIPT_URL) {
          fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          })
          .then(function () {
            showSuccess();
          })
          .catch(function (err) {
            console.warn('Submission request note:', err);
            showSuccess();
          });
        } else {
          setTimeout(showSuccess, 400);
        }
      });
    }
  }
});
