(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WHATSAPP = '2348067070234';

  /* ---- nav ---- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) toggle.click();
    });
  }
  var onScroll = function () { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- opening hours (Lagos time, UTC+1). Open Tue to Sun, 11am to 9pm ---- */
  function lagosNow() {
    var d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3600000);
  }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function status() {
    var n = lagosNow(), day = n.getDay(), mins = n.getHours() * 60 + n.getMinutes();
    var openDay = day !== 1;
    if (openDay && mins >= 660 && mins < 1260) return { open: true, text: 'Open now until 9pm' };
    if (openDay && mins < 660) return { open: false, text: 'Opens today at 11am' };
    var next = (day + 1) % 7;
    if (next === 1) next = 2;
    var label = next === (day + 1) % 7 ? 'tomorrow' : DAYS[next];
    return { open: false, text: 'Closed now. Opens ' + label + ' at 11am' };
  }
  var st = status();
  document.querySelectorAll('[data-status]').forEach(function (el) { el.textContent = st.text; });
  document.querySelectorAll('[data-status-dot]').forEach(function (el) { el.classList.toggle('is-closed', !st.open); });
  var today = lagosNow().getDay();
  document.querySelectorAll('.hours li[data-day="' + today + '"]').forEach(function (li) { li.classList.add('is-today'); });

  /* ---- hero video: portrait cut on phones, landscape elsewhere ---- */
  var hv = document.querySelector('[data-hero-video]');
  if (hv) {
    var portrait = window.matchMedia('(max-width: 760px)').matches;
    var src = portrait ? hv.dataset.srcPortrait : hv.dataset.src;
    var poster = portrait ? hv.dataset.posterPortrait : hv.dataset.poster;
    var still = document.querySelector('[data-hero-poster]');
    if (still && poster) still.src = poster;
    if (!reduce && src) {
      hv.src = src;
      hv.addEventListener('playing', function () { hv.classList.add('is-ready'); }, { once: true });
      var p = hv.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  /* ---- rotating word in the hero ---- */
  var rot = document.querySelector('[data-rotator]');
  if (rot) {
    var words = Array.prototype.slice.call(rot.querySelectorAll('span'));
    var i = 0;
    var paint = function () {
      var w = words[i];
      rot.style.backgroundColor = w.dataset.bg;
      rot.style.color = w.dataset.fg || '';
      rot.style.width = (w.getBoundingClientRect().width + parseFloat(getComputedStyle(rot).paddingLeft) * 2) + 'px';
    };
    words[0].classList.add('is-on');
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint); else paint();
    window.addEventListener('resize', paint);
    if (!reduce) setInterval(function () {
      var cur = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-off');
      setTimeout(function () { cur.classList.remove('is-off'); }, 650);
      i = (i + 1) % words.length;
      words[i].classList.add('is-on');
      paint();
    }, 2400);
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('is-in'); });

  /* ---- autoplay looping clips only while on screen ---- */
  var clips = document.querySelectorAll('video[data-autoplay]');
  if ('IntersectionObserver' in window && !reduce) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else v.pause();
      });
    }, { rootMargin: '120px 0px', threshold: 0.15 });
    clips.forEach(function (v) { vo.observe(v); });
  }

  /* ---- count up ---- */
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, to = +el.dataset.count, t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1400);
          el.firstChild.nodeValue = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { el.firstChild.nodeValue = '0'; co.observe(el); });
  }

  /* ---- sub navigation highlight (play page) ---- */
  var sublinks = document.querySelectorAll('.subnav a');
  if (sublinks.length && 'IntersectionObserver' in window) {
    var map = {};
    sublinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        sublinks.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[e.target.id];
        if (a) { a.classList.add('is-active'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---- gallery filter + lightbox ---- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.masonry .tile'));
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var f = b.dataset.filter;
      tiles.forEach(function (t) { t.hidden = f !== 'all' && t.dataset.cat.split(' ').indexOf(f) < 0; });
    });
  });
  var lb = document.querySelector('.lightbox');
  if (lb && tiles.length) {
    var stage = lb.querySelector('[data-lb-media]'), cap = lb.querySelector('[data-lb-cap]'), idx = 0, lastFocus = null;
    var visible = function () { return tiles.filter(function (t) { return !t.hidden; }); };
    var show = function (n) {
      var list = visible();
      idx = (n + list.length) % list.length;
      var t = list[idx];
      stage.innerHTML = '';
      var el;
      if (t.dataset.video) {
        el = document.createElement('video');
        el.src = t.dataset.video; el.muted = true; el.loop = true; el.autoplay = true; el.playsInline = true; el.controls = true;
      } else {
        el = document.createElement('img');
        el.src = t.dataset.full; el.alt = t.querySelector('img').alt;
      }
      stage.appendChild(el);
      cap.textContent = t.querySelector('figcaption') ? t.querySelector('figcaption').textContent : '';
    };
    var open = function (t) {
      lastFocus = t;
      show(visible().indexOf(t));
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    };
    var close = function () {
      lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      stage.innerHTML = '';
      if (lastFocus) lastFocus.focus();
    };
    tiles.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---- enquiry forms open a pre-filled WhatsApp chat ---- */
  document.querySelectorAll('form[data-whatsapp]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [form.dataset.whatsapp];
      form.querySelectorAll('[name]').forEach(function (f) {
        if (f.value.trim()) lines.push(f.dataset.label + ': ' + f.value.trim());
      });
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  });
  var dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = lagosNow().toISOString().slice(0, 10);

  /* ---- year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = lagosNow().getFullYear(); });
})();
