/* ============================================
   nav.js — ヘッダー / ハンバーガー / バナー / フォーム
============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initHamburger();
    initAlertBanner();
    initFormMock();
    initScheduleHighlight();
    initFilters();
    initSmoothScroll();
  });

  // ヘッダー：スクロール時にshadow付与
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const setScrolled = () => {
      if (window.scrollY > 8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // ハンバーガーメニュー
  function initHamburger() {
    const toggle = document.querySelector('[data-hamburger]');
    const nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;

    const setOpen = (isOpen) => {
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('is-nav-open', isOpen);
    };

    toggle.addEventListener('click', () => {
      const isOpen = !nav.classList.contains('is-open');
      setOpen(isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
      }
    });
  }

  // お知らせバナー：閉じる（sessionStorage）
  function initAlertBanner() {
    const banner = document.querySelector('[data-alert-banner]');
    if (!banner) return;

    const KEY = 'makino-alert-dismissed';

    try {
      if (sessionStorage.getItem(KEY) === '1') {
        banner.classList.add('is-hidden');
        return;
      }
    } catch (e) {
      // sessionStorage 使用不可は無視
    }

    const close = banner.querySelector('[data-alert-close]');
    if (!close) return;

    close.addEventListener('click', () => {
      banner.classList.add('is-hidden');
      try {
        sessionStorage.setItem(KEY, '1');
      } catch (e) {
        // ignore
      }
    });
  }

  // フォーム送信モック・モーダル制御（イベント委任で動的注入にも対応）
  function initFormMock() {
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-mock-form]');
      if (!form) return;
      e.preventDefault();
      showModal(form.dataset.modalTarget || 'modal-submit');
      try { form.reset(); } catch (err) { /* ignore */ }
    });

    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal');
        if (modal) modal.classList.remove('is-open');
        return;
      }

      const prepLink = e.target.closest('[data-prep]');
      if (prepLink) {
        e.preventDefault();
        showModal('modal-prep');
        return;
      }

      if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal.is-open').forEach((m) => m.classList.remove('is-open'));
    });
  }

  function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('is-open');
  }

  // 診療時間表：現在の曜日をハイライト
  function initScheduleHighlight() {
    const table = document.querySelector('[data-schedule-table]');
    if (!table) return;

    const day = new Date().getDay(); // 0:日 ～ 6:土
    const cells = table.querySelectorAll('[data-day]');
    cells.forEach((cell) => {
      if (Number(cell.dataset.day) === day) {
        cell.classList.add('is-current-day');
      }
    });
  }

  // お知らせフィルター
  function initFilters() {
    const bar = document.querySelector('[data-filter-bar]');
    if (!bar) return;

    const buttons = bar.querySelectorAll('.filter-bar__btn');
    const items = document.querySelectorAll('[data-category]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        items.forEach((item) => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 内部リンクのスムーズスクロール（ヘッダー高さ考慮済はCSSで対応）
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (!target) return;
        // CSS scroll-behavior に任せるため、JSでは追加処理しない
      });
    });
  }
})();
