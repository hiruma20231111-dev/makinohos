/* ============================================
   calendar.js — 休診カレンダーモック
============================================ */

(function () {
  'use strict';

  // モック休診データ：'YYYY-MM-DD': { dept, reason }
  const closedDays = {
    '2026-06-15': { dept: '内科', reason: '代診あり（担当医変更）', type: '代診' },
    '2026-06-22': { dept: '整形外科', reason: '休診（学会出席）', type: '休診' },
    '2026-07-14': { dept: '外科', reason: '休診（院内研修）', type: '休診' },
    '2026-07-29': { dept: '皮膚科', reason: '休診（夏季臨時）', type: '休診' },
    '2026-08-13': { dept: '全科', reason: 'お盆休診', type: '休診' },
    '2026-08-14': { dept: '全科', reason: 'お盆休診', type: '休診' },
    '2026-08-15': { dept: '全科', reason: 'お盆休診', type: '休診' },
    '2026-05-29': { dept: '内科', reason: '代診（午後のみ）', type: '代診' },
    '2026-05-15': { dept: '整形外科', reason: '休診（学会）', type: '休診' }
  };

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayHeads = [
    { label: '日', cls: 'sun' },
    { label: '月', cls: '' },
    { label: '火', cls: '' },
    { label: '水', cls: '' },
    { label: '木', cls: '' },
    { label: '金', cls: '' },
    { label: '土', cls: 'sat' }
  ];

  document.addEventListener('DOMContentLoaded', initCalendar);

  function initCalendar() {
    const root = document.querySelector('[data-calendar]');
    if (!root) return;

    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth(); // 0 始まり

    render();

    function render() {
      root.innerHTML = '';
      root.appendChild(buildHeader());
      root.appendChild(buildGrid());
      root.appendChild(buildLegend());
      updateList();
    }

    function buildHeader() {
      const head = document.createElement('div');
      head.className = 'calendar__header';

      const title = document.createElement('h3');
      title.className = 'calendar__title';
      title.textContent = currentYear + '年 ' + monthNames[currentMonth];

      const nav = document.createElement('div');
      nav.className = 'calendar__nav';

      const prev = document.createElement('button');
      prev.type = 'button';
      prev.setAttribute('aria-label', '前月');
      prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      prev.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        render();
      });

      const next = document.createElement('button');
      next.type = 'button';
      next.setAttribute('aria-label', '翌月');
      next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      next.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        render();
      });

      nav.appendChild(prev);
      nav.appendChild(next);
      head.appendChild(title);
      head.appendChild(nav);
      return head;
    }

    function buildGrid() {
      const grid = document.createElement('div');
      grid.className = 'calendar__grid';

      dayHeads.forEach((d) => {
        const h = document.createElement('div');
        h.className = 'calendar__day-head' + (d.cls ? ' calendar__day-head--' + d.cls : '');
        h.textContent = d.label;
        grid.appendChild(h);
      });

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = new Date();
      const todayKey = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

      // 前月の空白
      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar__day calendar__day--empty';
        grid.appendChild(empty);
      }

      for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar__day';
        cell.textContent = d;

        const dow = new Date(currentYear, currentMonth, d).getDay();
        if (dow === 0) cell.classList.add('calendar__day--sun');
        if (dow === 6) cell.classList.add('calendar__day--sat');

        const key = isoDate(currentYear, currentMonth, d);
        if (closedDays[key]) {
          cell.classList.add('calendar__day--closed');
          cell.title = closedDays[key].dept + ' ' + closedDays[key].reason;
        }
        if (key === todayKey) {
          cell.classList.add('calendar__day--today');
        }

        grid.appendChild(cell);
      }

      return grid;
    }

    function buildLegend() {
      const legend = document.createElement('div');
      legend.className = 'calendar__legend';
      legend.innerHTML =
        '<span class="calendar__legend-item"><span class="calendar__legend-dot" style="background:#e8734a"></span>休診・代診</span>' +
        '<span class="calendar__legend-item"><span class="calendar__legend-dot" style="background:#fff5f4;border:1px solid #dce3ea"></span>日曜</span>' +
        '<span class="calendar__legend-item"><span class="calendar__legend-dot" style="background:#f0f7fb;border:1px solid #dce3ea"></span>土曜</span>' +
        '<span class="calendar__legend-item"><span class="calendar__legend-dot" style="border:2px solid #1a6b8a;background:#fff"></span>本日</span>';
      return legend;
    }

    function updateList() {
      const listRoot = document.querySelector('[data-closed-list]');
      if (!listRoot) return;

      listRoot.innerHTML = '';
      const entries = Object.keys(closedDays)
        .sort()
        .filter((key) => {
          const [y, m] = key.split('-').map(Number);
          return y === currentYear && (m - 1) === currentMonth;
        });

      if (entries.length === 0) {
        const empty = document.createElement('tr');
        empty.innerHTML = '<td colspan="4" style="text-align:center;padding:24px;color:#9099a8">この月に予定されている休診・代診はありません</td>';
        listRoot.appendChild(empty);
        return;
      }

      entries.forEach((key) => {
        const info = closedDays[key];
        const [y, m, d] = key.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const dow = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + y + '/' + String(m).padStart(2, '0') + '/' + String(d).padStart(2, '0') + '（' + dow + '）</td>' +
          '<td>' + escapeHtml(info.dept) + '</td>' +
          '<td><span class="badge badge--' + (info.type === '休診' ? 'danger' : 'warning') + '">' + info.type + '</span></td>' +
          '<td>' + escapeHtml(info.reason) + '</td>';
        listRoot.appendChild(tr);
      });
    }
  }

  function isoDate(y, m, d) {
    return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s]));
  }
})();
