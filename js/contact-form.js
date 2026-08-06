/* ============================================================
   CONTACT FORM — validation + async submit + success animation
   Page-specific: only loads on contact.html, does not affect
   other pages.
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var statusEl = document.getElementById('cfStatus');
  var submitBtn = document.getElementById('cfSubmitBtn');
  var submitLabel = submitBtn ? submitBtn.querySelector('.cus-submit-label') : null;

  var fields = {
    cfName: {
      el: document.getElementById('cfName'),
      validate: function (v) {
        if (!v.trim()) return 'Please enter your full name.';
        if (v.trim().length < 2) return 'Name must be at least 2 characters.';
        if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return 'Name can only contain letters.';
        return '';
      }
    },
    cfEmail: {
      el: document.getElementById('cfEmail'),
      validate: function (v) {
        if (!v.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    cfCountry: {
      el: document.getElementById('cfCountry'),
      validate: function (v) {
        if (!v) return 'Please select your country.';
        return '';
      }
    },
    cfPhone: {
      el: document.getElementById('cfPhone'),
      validate: function (v) {
        var digits = v.replace(/[^\d]/g, '');
        if (!v.trim()) return 'Please enter your phone number.';
        if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number.';
        if (!/^[\d+\-\s()]+$/.test(v.trim())) return 'Phone number contains invalid characters.';
        return '';
      }
    },
    cfMessage: {
      el: document.getElementById('cfMessage'),
      validate: function (v) {
        if (!v.trim()) return 'Please enter a message.';
        if (v.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    },
    cfAgree: {
      el: document.getElementById('cfAgree'),
      validate: function (v, el) {
        if (!el.checked) return 'You must agree to the Privacy Policy.';
        return '';
      }
    },
    cfCaptcha: {
      el: document.getElementById('cfCaptcha'),
      validate: function (v) {
        if (!v.trim()) return 'Please enter the code shown in the image.';
        if (v.trim().toLowerCase() !== currentCaptchaCode.toLowerCase()) return 'Incorrect code. Please try again.';
        return '';
      }
    }
  };

  /* Server error keys (from contact-handler.php) -> field ids */
  var fieldNameToId = {
    full_name: 'cfName',
    email: 'cfEmail',
    country: 'cfCountry',
    phone: 'cfPhone',
    message: 'cfMessage',
    agree: 'cfAgree',
    captcha: 'cfCaptcha'
  };

  /* ---- CAPTCHA: generated and drawn entirely on the client via <canvas>,
     no server round-trip to fetch an image. The generated code is mirrored
     into a hidden field so contact-handler.php can re-check it on submit. ---- */
  var CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; /* excludes 0/O, 1/I/l */
  var captchaCanvas = document.getElementById('cfCaptchaCanvas');
  var captchaCtx = captchaCanvas ? captchaCanvas.getContext('2d') : null;
  var captchaExpectedEl = document.getElementById('cfCaptchaExpected');
  var captchaRefreshBtn = document.getElementById('cfCaptchaRefresh');
  var captchaInput = document.getElementById('cfCaptcha');
  var currentCaptchaCode = '';

  function randomCaptchaCode(length) {
    var code = '';
    for (var i = 0; i < length; i++) {
      code += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
    }
    return code;
  }

  function drawCaptcha(code) {
    if (!captchaCtx || !captchaCanvas) return;
    var w = captchaCanvas.width;
    var h = captchaCanvas.height;
    var colors = ['#2B2B2B', '#F8485E', '#B23A4A'];

    captchaCtx.clearRect(0, 0, w, h);
    captchaCtx.fillStyle = '#FFFFFF';
    captchaCtx.fillRect(0, 0, w, h);
    captchaCtx.strokeStyle = 'rgba(43, 43, 43, 0.18)';
    captchaCtx.strokeRect(0.5, 0.5, w - 1, h - 1);

    for (var i = 0; i < 4; i++) {
      captchaCtx.strokeStyle = 'rgba(248, 72, 94, 0.25)';
      captchaCtx.beginPath();
      captchaCtx.moveTo(Math.random() * w, Math.random() * h);
      captchaCtx.lineTo(Math.random() * w, Math.random() * h);
      captchaCtx.stroke();
    }

    for (var j = 0; j < 20; j++) {
      captchaCtx.fillStyle = 'rgba(43, 43, 43, 0.15)';
      captchaCtx.beginPath();
      captchaCtx.arc(Math.random() * w, Math.random() * h, 1, 0, Math.PI * 2);
      captchaCtx.fill();
    }

    var slot = w / code.length;
    captchaCtx.font = '700 24px "DM Sans", Arial, sans-serif';
    captchaCtx.textAlign = 'center';
    captchaCtx.textBaseline = 'middle';

    for (var k = 0; k < code.length; k++) {
      var x = (k * slot) + (slot / 2) + (Math.random() * 8 - 4);
      var y = (h / 2) + (Math.random() * 8 - 4);
      var angle = (Math.random() * 48 - 24) * (Math.PI / 180);

      captchaCtx.save();
      captchaCtx.translate(x, y);
      captchaCtx.rotate(angle);
      captchaCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      captchaCtx.fillText(code.charAt(k), 0, 0);
      captchaCtx.restore();
    }
  }

  function refreshCaptcha() {
    currentCaptchaCode = randomCaptchaCode(5);
    drawCaptcha(currentCaptchaCode);
    if (captchaExpectedEl) captchaExpectedEl.value = currentCaptchaCode;
    if (captchaInput) captchaInput.value = '';
    showError('cfCaptcha', '');
  }

  if (captchaRefreshBtn) {
    captchaRefreshBtn.addEventListener('click', refreshCaptcha);
  }

  refreshCaptcha();

  function showError(id, message) {
    var errorEl = form.querySelector('[data-error-for="' + id + '"]');
    var field = fields[id];
    if (errorEl) errorEl.textContent = message;
    if (field && field.el) field.el.classList.toggle('has-error', !!message);
  }

  function validateField(id) {
    var field = fields[id];
    if (!field || !field.el) return true;
    var value = field.el.type === 'checkbox' ? field.el.checked : field.el.value;
    var message = field.validate(value, field.el);
    showError(id, message);
    return !message;
  }

  function validateAll() {
    var valid = true;
    var firstInvalidEl = null;
    Object.keys(fields).forEach(function (id) {
      var ok = validateField(id);
      if (!ok && !firstInvalidEl) firstInvalidEl = fields[id].el;
      valid = valid && ok;
    });
    if (firstInvalidEl) firstInvalidEl.focus();
    return valid;
  }

  function allFieldsValid() {
    return Object.keys(fields).every(function (id) {
      var errorEl = form.querySelector('[data-error-for="' + id + '"]');
      return !errorEl || !errorEl.textContent;
    });
  }

  /* Once every field is valid again, drop the "Please correct the
     highlighted fields" banner instead of leaving it up until the next
     submit click. */
  function maybeClearFormLevelError() {
    if (statusEl && statusEl.classList.contains('cus-form-status--error') && allFieldsValid()) {
      setStatus('', '');
    }
  }

  /* Validate on blur so errors clear as the user fixes them */
  Object.keys(fields).forEach(function (id) {
    var field = fields[id];
    if (!field.el) return;
    var evt = field.el.tagName === 'SELECT' || field.el.type === 'checkbox' ? 'change' : 'blur';
    field.el.addEventListener(evt, function () {
      validateField(id);
      maybeClearFormLevelError();
    });

    /* Live-clear this field's own error as the user retypes it (without
       validating early/aggressively), so the banner above can also drop
       before the user tabs away or resubmits. */
    if (evt === 'blur') {
      field.el.addEventListener('input', function () {
        var errorEl = form.querySelector('[data-error-for="' + id + '"]');
        if (!errorEl || !errorEl.textContent) return;
        var value = field.el.type === 'checkbox' ? field.el.checked : field.el.value;
        if (!field.validate(value, field.el)) {
          showError(id, '');
          maybeClearFormLevelError();
        }
      });
    }
  });

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'cus-form-status' + (type ? ' cus-form-status--' + type : '');
  }

  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    if (submitLabel) submitLabel.textContent = isLoading ? 'Sending...' : 'Send Message';
  }

  function showSuccess() {
    if (!submitBtn || !submitLabel) return;
    submitBtn.classList.remove('is-loading');
    submitBtn.classList.add('is-success');
    submitBtn.disabled = true;
    submitLabel.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Sent';
  }

  function resetButton() {
    if (!submitBtn || !submitLabel) return;
    submitBtn.classList.remove('is-success', 'is-loading');
    submitBtn.disabled = false;
    submitLabel.textContent = 'Send Message';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateAll()) {
      setStatus('Please correct the highlighted fields before sending.', 'error');
      return;
    }

    setStatus('', '');
    setButtonLoading(true);

    var formData = new FormData(form);

    fetch(form.getAttribute('action'), {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(function (res) { return res.json().catch(function () { return { success: false, message: 'Unexpected server response.' }; }); })
      .then(function (data) {
        if (data && data.success) {
          setStatus(data.message || 'Your message has been sent successfully!', 'success');
          showSuccess();
          form.reset();
          refreshCaptcha();
          setTimeout(resetButton, 4000);
        } else {
          setButtonLoading(false);
          setStatus((data && data.message) || 'Something went wrong. Please try again.', 'error');
          if (data && data.errors) {
            Object.keys(data.errors).forEach(function (key) {
              var fieldId = fieldNameToId[key];
              if (fieldId) showError(fieldId, data.errors[key]);
            });
          }
          refreshCaptcha();
        }
      })
      .catch(function () {
        /* Network/parse failure before a response came back — the server
           never consumed the CAPTCHA, so leave it valid for a retry. */
        setButtonLoading(false);
        setStatus('Could not send your message. Please check your connection and try again.', 'error');
      });
  });
}());
