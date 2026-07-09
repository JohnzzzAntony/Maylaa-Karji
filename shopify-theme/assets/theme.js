/* ============================================================
   Karji Premium — theme.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile drawer ---------- */
  function initDrawer() {
    var toggle = document.querySelector('[data-drawer-toggle]');
    var drawer = document.querySelector('[data-mobile-drawer]');
    var overlay = document.querySelector('[data-drawer-overlay]');
    var closeBtn = document.querySelector('[data-drawer-close]');
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  /* ---------- Hero carousel ---------- */
  function initHero() {
    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dot'));
      if (slides.length < 2) return;
      var index = 0;
      var interval = parseInt(hero.getAttribute('data-autoplay'), 10) || 0;
      var timer;

      function go(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
        dots.forEach(function (d, n) { d.classList.toggle('is-active', n === index); });
      }
      function next() { go(index + 1); }
      function prev() { go(index - 1); }
      function start() { if (interval > 0) { stop(); timer = setInterval(next, interval); } }
      function stop() { if (timer) clearInterval(timer); }

      var nextBtn = hero.querySelector('.hero__arrow--next');
      var prevBtn = hero.querySelector('.hero__arrow--prev');
      if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
      if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
      dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); start(); }); });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      go(0);
      start();
    });
  }

  /* ---------- Horizontal sliders (products + brands) ---------- */
  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var track = slider.querySelector('[data-slider-track]');
      var prev = slider.querySelector('[data-slider-prev]');
      var next = slider.querySelector('[data-slider-next]');
      if (!track) return;

      function scrollAmount() {
        var first = track.firstElementChild;
        if (!first) return track.clientWidth;
        var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap, 10) || 20;
        var perView = Math.max(1, Math.round(track.clientWidth / (first.offsetWidth + gap)));
        return (first.offsetWidth + gap) * perView;
      }
      function update() {
        if (!prev || !next) return;
        var maxScroll = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= maxScroll;
      }
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Wishlist (localStorage) ---------- */
  function initWishlist() {
    var KEY = 'karji_wishlist';
    function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
    function write(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

    var list = read();
    document.querySelectorAll('[data-wishlist]').forEach(function (btn) {
      var id = btn.getAttribute('data-wishlist');
      if (list.indexOf(id) !== -1) btn.classList.add('is-active');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        list = read();
        var i = list.indexOf(id);
        if (i === -1) { list.push(id); btn.classList.add('is-active'); }
        else { list.splice(i, 1); btn.classList.remove('is-active'); }
        write(list);
        updateWishlistCount();
      });
    });
    updateWishlistCount();

    function updateWishlistCount() {
      var count = read().length;
      document.querySelectorAll('[data-wishlist-count]').forEach(function (el) {
        el.textContent = count;
        el.style.display = count > 0 ? '' : 'none';
      });
    }
  }

  /* ---------- Quick view ---------- */
  function initQuickView() {
    var modal = document.querySelector('[data-quickview-modal]');
    if (!modal) return;
    var dialog = modal.querySelector('[data-quickview-content]');
    var closeBtn = modal.querySelector('[data-quickview-close]');

    function open(data) {
      dialog.querySelector('[data-qv-image]').src = data.image || '';
      dialog.querySelector('[data-qv-title]').textContent = data.title || '';
      dialog.querySelector('[data-qv-price]').innerHTML = data.price || '';
      dialog.querySelector('[data-qv-desc]').innerHTML = data.desc || '';
      var link = dialog.querySelector('[data-qv-link]');
      if (link) link.href = data.url || '#';
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }

    document.querySelectorAll('[data-quickview]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        open({
          image: btn.getAttribute('data-qv-image'),
          title: btn.getAttribute('data-qv-title'),
          price: btn.getAttribute('data-qv-price'),
          desc: btn.getAttribute('data-qv-desc'),
          url: btn.getAttribute('data-qv-url')
        });
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- About read more ---------- */
  function initReadMore() {
    document.querySelectorAll('[data-readmore-toggle]').forEach(function (btn) {
      var target = document.querySelector(btn.getAttribute('data-readmore-target'));
      if (!target) return;
      btn.addEventListener('click', function () {
        var collapsed = target.classList.toggle('is-collapsed');
        btn.textContent = collapsed ? btn.getAttribute('data-more') : btn.getAttribute('data-less');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDrawer();
    initHero();
    initSliders();
    initWishlist();
    initQuickView();
    initReadMore();
  });
})();
