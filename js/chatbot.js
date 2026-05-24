/* ============================================
   chatbot.js — モックチャットボット（自己注入型）
============================================ */

(function () {
  'use strict';

  const responses = {
    '駐車場': '病院隣に約20台分の駐車場をご用意しています。混雑時は近隣のコインパーキングをご利用ください。',
    'パーキング': '病院隣に約20台分の駐車場をご用意しています。混雑時は近隣のコインパーキングをご利用ください。',
    '診療時間': '月〜金曜 9:00〜12:00 / 14:00〜17:00、土曜日・日曜日・祝日は休診となります。',
    '時間': '月〜金曜 9:00〜12:00 / 14:00〜17:00、土曜日・日曜日・祝日は休診となります。',
    '休診': '土曜・日曜・祝日は休診です。臨時休診や代診については「休診・代診のお知らせ」ページでご確認ください。',
    '外科': '外科では一般外科から消化器外科、肛門疾患まで幅広く対応しております。担当医については診療時間ページをご覧ください。',
    '内科': '内科では一般内科、生活習慣病、消化器内科を中心に診察を行っております。',
    '整形外科': '整形外科では骨折、関節疾患、リハビリテーションに対応しております。',
    '皮膚科': '皮膚科では湿疹、アトピー性皮膚炎、皮膚腫瘍など各種皮膚疾患に対応しております。',
    '予約': '当院は予約制ではございません。直接ご来院ください。お電話でのご相談は受け付けております。',
    '保険証': 'マイナ保険証または資格確認書が必要です。お忘れの場合は全額自費となりますのでご注意ください。',
    'マイナ': 'マイナ保険証をご持参いただくと、より正確な診療情報の連携が可能となります。',
    '入院': '入院のご案内ページに必要な持ち物や面会時間、費用についてまとめています。詳しくは「ご案内」ページをご覧ください。',
    '面会': '面会時間は9:00〜19:00です。感染症流行時は制限を設ける場合があります。',
    'アクセス': '大阪府東大阪市太平寺1丁目9番26号です。近鉄大阪線「長瀬駅」より徒歩約10分です。',
    '住所': '〒577-0844 大阪府東大阪市太平寺1丁目9番26号です。',
    '電話': 'お電話は 06-6728-6001 までお願いいたします。',
    'FAX': 'FAX番号は 06-6729-3225 です。',
    '健康診断': '健康診断、特定健診、長寿健診に対応しています。詳しくは「ご案内」ページをご確認ください。',
    '健診': '健康診断、特定健診、長寿健診に対応しています。詳しくは「ご案内」ページをご確認ください。',
    '紹介状': '他院からの紹介状をお持ちの方は、受付にてお渡しください。地域医療連携室でも対応しております。',
    '採用': '看護師・医療事務・介護スタッフを募集中です。詳しくは「職員募集」ページをご覧ください。',
    '求人': '看護師・医療事務・介護スタッフを募集中です。詳しくは「職員募集」ページをご覧ください。'
  };

  const FALLBACK = '申し訳ございません、お答えできない内容でした。\n詳細については、お電話（06-6728-6001）にてお問い合わせください。';
  const WELCOME = 'こんにちは。牧野病院チャットサポートです。\n何でもお気軽にご質問ください。';

  const shortcuts = [
    '何科を受診すればいい？',
    '駐車場はありますか？',
    '診療時間を教えて',
    '休診日はいつ？'
  ];

  const WIDGET_HTML =
    '<button type="button" class="chatbot-toggle" data-chatbot-toggle aria-label="チャットを開く" aria-expanded="false">' +
    '<svg class="chatbot-toggle__open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
    '<svg class="chatbot-toggle__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<div class="chatbot-window" data-chatbot-window role="dialog" aria-label="チャットサポート">' +
    '<div class="chatbot-window__header">' +
    '<div class="chatbot-window__avatar" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
    '</div>' +
    '<div>' +
    '<div class="chatbot-window__title">牧野病院 チャットサポート</div>' +
    '<div class="chatbot-window__status">オンライン</div>' +
    '</div>' +
    '</div>' +
    '<div class="chatbot-window__body" data-chatbot-body></div>' +
    '<div class="chat-shortcuts" data-chatbot-shortcuts></div>' +
    '<form class="chatbot-window__input" data-chatbot-form>' +
    '<input type="text" data-chatbot-input placeholder="質問を入力..." aria-label="質問を入力">' +
    '<button type="submit" class="chatbot-window__send" aria-label="送信">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
    '</button>' +
    '</form>' +
    '<a href="tel:0667286001" class="chatbot-window__call">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    'お電話する 06-6728-6001' +
    '</a>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', injectAndInit);

  function injectAndInit() {
    let root = document.querySelector('[data-chatbot]');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('data-chatbot', '');
      document.body.appendChild(root);
    }
    root.innerHTML = WIDGET_HTML;
    initChatbot(root);
  }

  function initChatbot(root) {
    const toggle = root.querySelector('[data-chatbot-toggle]');
    const win = root.querySelector('[data-chatbot-window]');
    const body = root.querySelector('[data-chatbot-body]');
    const form = root.querySelector('[data-chatbot-form]');
    const input = root.querySelector('[data-chatbot-input]');
    const shortcutsBox = root.querySelector('[data-chatbot-shortcuts]');

    if (!toggle || !win || !body || !form || !input || !shortcutsBox) return;

    shortcuts.forEach((text) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-shortcut';
      btn.textContent = text;
      btn.addEventListener('click', () => handleUserMessage(text));
      shortcutsBox.appendChild(btn);
    });

    addBubble(WELCOME, 'bot');

    toggle.addEventListener('click', () => {
      const isOpen = !win.classList.contains('is-open');
      win.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        setTimeout(() => input.focus(), 200);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      handleUserMessage(text);
      input.value = '';
    });

    function handleUserMessage(text) {
      addBubble(text, 'user');
      showTyping();
      window.setTimeout(() => {
        hideTyping();
        addBubble(matchResponse(text), 'bot');
      }, 800);
    }

    function addBubble(text, type) {
      try {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble--' + type;
        bubble.textContent = text;
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
      } catch (err) {
        // ignore
      }
    }

    let typingEl = null;
    function showTyping() {
      typingEl = document.createElement('div');
      typingEl.className = 'chat-typing';
      typingEl.setAttribute('aria-label', '入力中');
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typingEl);
      body.scrollTop = body.scrollHeight;
    }

    function hideTyping() {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
        typingEl = null;
      }
    }
  }

  function matchResponse(text) {
    if (/何科|どの科|何の科/.test(text)) {
      return '症状に応じて以下を目安にしてください：\n・腹痛/発熱/咳 → 内科\n・骨折/関節痛/腰痛 → 整形外科\n・皮膚のかゆみ/湿疹 → 皮膚科\n・けが/しこり → 外科\n\n判断に迷う場合は受付にてご相談ください。';
    }
    const keys = Object.keys(responses);
    for (let i = 0; i < keys.length; i++) {
      if (text.indexOf(keys[i]) !== -1) {
        return responses[keys[i]];
      }
    }
    return FALLBACK;
  }
})();
