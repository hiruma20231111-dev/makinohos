/* ============================================
   layout.js — 共通モーダル等の注入
============================================ */

(function () {
  'use strict';

  const MODAL_HTML =
    '<div class="modal" id="modal-submit" role="dialog" aria-labelledby="modal-submit-title" aria-modal="true">' +
    '<div class="modal__panel">' +
    '<div class="modal__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
    '</div>' +
    '<h2 class="modal__title" id="modal-submit-title">送信が完了しました</h2>' +
    '<p class="modal__body">お問い合わせありがとうございます。<br>担当者より2営業日以内にご連絡いたします。<br><small style="color:#9099a8">※ このサイトはデモのため実際には送信されていません</small></p>' +
    '<button type="button" class="btn btn--primary" data-modal-close>閉じる</button>' +
    '</div>' +
    '</div>' +
    '<div class="modal" id="modal-prep" role="dialog" aria-labelledby="modal-prep-title" aria-modal="true">' +
    '<div class="modal__panel">' +
    '<div class="modal__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
    '</div>' +
    '<h2 class="modal__title" id="modal-prep-title">準備中です</h2>' +
    '<p class="modal__body">このコンテンツは現在準備中です。<br>公開までしばらくお待ちください。</p>' +
    '<button type="button" class="btn btn--primary" data-modal-close>閉じる</button>' +
    '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.innerHTML = MODAL_HTML;
    document.body.appendChild(container);
  });
})();
