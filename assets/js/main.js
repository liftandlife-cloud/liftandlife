/* LIFT & LIFE — interactions */
(function () {
  'use strict';

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- header shadow on scroll ---- */
  var header = document.querySelector('.header');
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- FAQ: single-open accordion (progressive enhancement over <details>) ---- */
  var qas = document.querySelectorAll('.qa');
  qas.forEach(function (qa) {
    qa.addEventListener('toggle', function () {
      if (qa.open) {
        qas.forEach(function (other) { if (other !== qa) other.open = false; });
      }
    });
  });

  /* ---- studio slider ---- */
  var slider = document.getElementById('studioSlider');
  if (slider) {
    var track = document.getElementById('slides');
    var imgs = track.children;
    var total = imgs.length;
    var dotsWrap = document.getElementById('dots');
    var idx = 0, timer;

    for (var i = 0; i < total; i++) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Bild ' + (i + 1));
      (function (n) { b.addEventListener('click', function () { go(n); reset(); }); })(i);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.children;

    function go(n) {
      idx = (n + total) % total;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      for (var k = 0; k < total; k++) dots[k].classList.toggle('active', k === idx);
    }
    function next() { go(idx + 1); }
    function reset() { clearInterval(timer); timer = setInterval(next, 5000); }

    document.getElementById('slideNext').addEventListener('click', function () { next(); reset(); });
    document.getElementById('slidePrev').addEventListener('click', function () { go(idx - 1); reset(); });
    go(0); reset();

    // pause on hover
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', reset);

    // basic swipe
    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : go(idx - 1); reset(); }
      startX = null;
    });
  }

  /* ---- video module (click to play with native controls) ---- */
  var vModule = document.getElementById('videoModule');
  if (vModule) {
    var vid = document.getElementById('alexVideo');
    var playBtn = document.getElementById('videoPlay');
    var start = function () {
      vid.setAttribute('controls', '');
      vModule.classList.add('playing');
      vid.play();
    };
    playBtn.addEventListener('click', start);
    vid.addEventListener('play', function () { vModule.classList.add('playing'); });
    vid.addEventListener('pause', function () {
      if (!vid.seeking && vid.currentTime > 0 && !vid.ended) return;
    });
    vid.addEventListener('ended', function () {
      vid.removeAttribute('controls');
      vModule.classList.remove('playing');
    });
  }

  /* ---- contact form (demo submit) ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var ok = true;
      [name, email].forEach(function (f) {
        if (!f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
          f.style.borderColor = '#d9534f'; ok = false;
        } else { f.style.borderColor = ''; }
      });
      if (!ok) return;

      var phone = form.querySelector('#phone');
      var goal = form.querySelector('#goal');
      var msg = form.querySelector('#msg');
      var keyField = form.querySelector('[name="access_key"]');
      var accessKey = keyField ? keyField.value.trim() : '';
      var submitBtn = form.querySelector('button[type="submit"]');

      var showSuccess = function () {
        document.getElementById('formFields').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      };

      // Echter Web3Forms-Key hinterlegt -> im Hintergrund an alex@liftandlife.de zustellen
      if (accessKey && accessKey.indexOf('DEIN_') !== 0) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wird gesendet …'; }
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j && j.success) { showSuccess(); }
            else { throw new Error('web3forms'); }
          })
          .catch(function () {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Check-up-Gespräch anfragen'; }
            alert('Das Senden hat gerade nicht geklappt. Schreib mir bitte direkt an alex@liftandlife.de oder per WhatsApp.');
          });
        return;
      }

      // Fallback (solange kein Key hinterlegt): Mailprogramm mit vorausgefüllter Mail öffnen
      var subject = 'Anfrage Personaltraining – ' + name.value.trim();
      var body =
        'Name: ' + name.value.trim() + '\n' +
        'E-Mail: ' + email.value.trim() + '\n' +
        'Telefon: ' + (phone && phone.value.trim() ? phone.value.trim() : '-') + '\n' +
        'Ziel: ' + (goal ? goal.value : '-') + '\n\n' +
        'Nachricht:\n' + (msg && msg.value.trim() ? msg.value.trim() : '-');
      window.location.href = 'mailto:alex@liftandlife.de?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      showSuccess();
    });
  }

  /* ---- reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Rabatt-Popup (Sportstech), einmal alle 7 Tage, 20s nach Seitenaufruf ---- */
  var overlay = document.getElementById('promoOverlay');
  if (overlay) {
    var KEY = 'liftlife_promo_seen';
    var SNOOZE = 7 * 24 * 60 * 60 * 1000; // 7 Tage
    var lastSeen = 0;
    try { lastSeen = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}

    var closePromo = function () {
      overlay.classList.remove('open');
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      document.removeEventListener('keydown', onEsc);
    };
    var onEsc = function (e) { if (e.key === 'Escape') closePromo(); };
    var openPromo = function () {
      overlay.classList.add('open');
      document.addEventListener('keydown', onEsc);
    };

    if (Date.now() - lastSeen > SNOOZE) {
      setTimeout(openPromo, 20000);
    }

    document.getElementById('promoClose').addEventListener('click', closePromo);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePromo(); });

    // Custom-Events für Vercel Analytics (erscheinen im Dashboard unter "Events")
    var track = function (name) { try { if (window.va) window.va('event', { name: name }); } catch (e) {} };
    var goLink = overlay.querySelector('.go');
    if (goLink) goLink.addEventListener('click', function () { track('Sportstech Klick'); });

    var copyBtn = document.getElementById('promoCopy');
    copyBtn.addEventListener('click', function () {
      var code = document.getElementById('promoCode').textContent.trim();
      track('Rabattcode kopiert');
      var done = function () {
        copyBtn.textContent = 'Kopiert ✓';
        copyBtn.classList.add('done');
        setTimeout(function () { copyBtn.textContent = 'Code kopieren'; copyBtn.classList.remove('done'); }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, done);
      } else {
        var t = document.createElement('textarea');
        t.value = code; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  }
})();
