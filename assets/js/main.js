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

      // Anfrage per E-Mail an Alex zustellen (öffnet das Mailprogramm mit vorausgefüllten Feldern)
      var phone = form.querySelector('#phone');
      var goal = form.querySelector('#goal');
      var msg = form.querySelector('#msg');
      var subject = 'Anfrage Personaltraining – ' + name.value.trim();
      var body =
        'Name: ' + name.value.trim() + '\n' +
        'E-Mail: ' + email.value.trim() + '\n' +
        'Telefon: ' + (phone && phone.value.trim() ? phone.value.trim() : '-') + '\n' +
        'Ziel: ' + (goal ? goal.value : '-') + '\n\n' +
        'Nachricht:\n' + (msg && msg.value.trim() ? msg.value.trim() : '-');
      window.location.href = 'mailto:alex@liftandlife.de?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      document.getElementById('formFields').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
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
})();
