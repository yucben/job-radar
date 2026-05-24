// JobRadar v2 — Engine & Interactions

let activeFilters = {};
let currentView = 'card';
let currentSort = 'default';

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderFilterChips();
  applyFilters();
  setupKeyboard();
  setupCardMouseTracking();
});

// ── Keyboard shortcuts ──
function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('detailModal');
      if (modal.classList.contains('show')) closeModal();
    }
    if (e.key === '/' && document.activeElement === document.body) {
      e.preventDefault();
      document.getElementById('nameSearch').focus();
    }
  });
}

// ── Card mouse tracking for glow effect ──
function setupCardMouseTracking() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.company-card:hover').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// ── Filter group toggle ──
function toggleFilterGroup(btn) {
  const group = btn.closest('.filter-group');
  group.classList.toggle('collapsed');
}

// ── Render filter chips ──
function renderFilterChips() {
  for (const [key, options] of Object.entries(FILTERS)) {
    const container = document.getElementById(`filter-${key}`);
    if (!container) continue;
    container.innerHTML = options.map(opt =>
      `<span class="filter-chip" data-filter="${key}" data-value="${opt}" onclick="toggleFilter('${key}', '${opt}')">${opt}</span>`
    ).join('');
  }
}

// ── Toggle individual filter ──
function toggleFilter(key, value) {
  if (value === '不限') {
    delete activeFilters[key];
    updateChipUI();
    applyFilters();
    return;
  }

  if (!activeFilters[key]) activeFilters[key] = [];

  const idx = activeFilters[key].indexOf(value);
  if (idx > -1) {
    activeFilters[key].splice(idx, 1);
    if (activeFilters[key].length === 0) delete activeFilters[key];
  } else {
    activeFilters[key].push(value);
  }

  updateChipUI();
  applyFilters();
}

// ── Update chip visuals ──
function updateChipUI() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const fk = chip.dataset.filter;
    const fv = chip.dataset.value;
    chip.classList.remove('active', 'neutral');
    if (fv === '不限') {
      if (!activeFilters[fk] || activeFilters[fk].length === 0) {
        chip.classList.add('neutral');
      }
    } else if (activeFilters[fk]?.includes(fv)) {
      chip.classList.add('active');
    }
  });
}

// ── Reset all filters ──
function resetFilters() {
  activeFilters = {};
  document.getElementById('nameSearch').value = '';
  document.getElementById('sortBy').value = 'default';
  currentSort = 'default';
  updateChipUI();
  applyFilters();
}

// ── Apply filters + sort + render ──
function applyFilters() {
  const nameQuery = document.getElementById('nameSearch').value.toLowerCase().trim();
  const sortBy = document.getElementById('sortBy').value;
  currentSort = sortBy;

  let filtered = COMPANIES.filter(c => {
    if (nameQuery && !c.name.toLowerCase().includes(nameQuery)) return false;

    for (const [key, values] of Object.entries(activeFilters)) {
      if (key === 'industry' && !values.some(v => v === c.industry)) return false;
      if (key === 'funding' && !values.some(v => v === c.funding)) return false;
      if (key === 'year') {
        if (!values.some(v => {
          if (v === '2010年及以前') return c.year <= 2010;
          const y = parseInt(v);
          return !isNaN(y) && c.year === y;
        })) return false;
      }
      if (key === 'advantage') {
        if (c.advantage.length === 0) return false;
        if (!values.some(v => c.advantage.includes(v))) return false;
      }
      if (key === 'location' && !values.some(v => v === c.location)) return false;
      if (key === 'media') {
        if (!values.some(v => {
          if (v === '是') return c.media === true;
          if (v === '否') return c.media === false;
        })) return false;
      }
      if (key === 'hiring') {
        if (!values.some(v => {
          if (v === '是') return c.hiring === true;
          if (v === '否') return c.hiring === false;
        })) return false;
      }
      if (key === 'recruitment' && !values.some(v => v === c.recruitment)) return false;
      if (key === 'degree') {
        const degRank = { '大专': 1, '本科': 2, '硕士': 3, '博士': 4 };
        if (!values.some(d => c.jobs.some(j => (degRank[j.degree] || 2) >= degRank[d]))) return false;
      }
    }
    return true;
  });

  // Sort
  const fundingOrder = ["未融资","种子轮","天使轮","Pre-A轮","A轮","A+轮","Pre-B轮","B轮","B+轮","C轮","C+轮","D轮","D+轮","E轮","F轮","G轮","H轮","股权融资","战略融资","定向增发","Pre-IPO","基石轮","已上市","IPO","新三板","已退市/私有化","并购/合并","其他"];

  if (sortBy === 'funding') {
    filtered.sort((a, b) => fundingOrder.indexOf(b.funding) - fundingOrder.indexOf(a.funding));
  } else if (sortBy === 'year') {
    filtered.sort((a, b) => b.year - a.year);
  } else if (sortBy === 'jobs') {
    filtered.sort((a, b) => b.jobs.length - a.jobs.length);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  }

  renderResults(filtered);
}

// ── Render results ──
function renderResults(companies) {
  const grid = document.getElementById('companyGrid');
  const table = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  const tableWrap = document.getElementById('companyTable');

  // Stats
  const totalCompanies = COMPANIES.length;
  const totalJobs = COMPANIES.reduce((s, c) => s + (c.jobs?.length || 0), 0);
  document.getElementById('companyCount').textContent = totalCompanies;
  document.getElementById('jobCount').textContent = totalJobs;
  document.getElementById('resultCount').textContent = companies.length;

  // Active filter badge
  const totalActive = Object.values(activeFilters).reduce((s, arr) => s + arr.length, 0);
  const badge = document.getElementById('activeFilterBadge');
  if (totalActive > 0) {
    badge.style.display = 'inline';
    badge.textContent = `${totalActive} 项筛选`;
  } else {
    badge.style.display = 'none';
  }

  // Empty
  if (companies.length === 0) {
    grid.innerHTML = '';
    table.innerHTML = '';
    tableWrap.style.display = 'none';
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  if (currentView === 'card') {
    grid.style.display = 'grid';
    tableWrap.style.display = 'none';

    grid.innerHTML = companies.map((c, i) => {
      const safeName = c.name.replace(/'/g, "\\'");
      return `
      <div class="company-card" onclick="showDetail(${c.id})" style="animation-delay:${i * 30}ms">
        <div class="card-top">
          <span class="card-name">${escapeHtml(c.name)}</span>
          <span class="card-year">${c.year}年</span>
        </div>
        <div class="card-tags">
          <span class="tag">${escapeHtml(c.industry)}</span>
          <span class="tag tag-green">${escapeHtml(c.funding)}</span>
          ${c.advantage.map(a => `<span class="tag tag-amber">${escapeHtml(a)}</span>`).join('')}
          ${c.recruitment === '校招' ? '<span class="tag tag-campus">🎓校招</span>' : ''}
        </div>
        <div class="card-meta">
          <span class="card-meta-row">📍 ${escapeHtml(c.location)}</span>
          <span class="card-meta-row">👥 ${escapeHtml(c.employees)}</span>
        </div>
        ${c.investors ? `<div class="card-meta"><strong>投资人：</strong>${escapeHtml(c.investors)}</div>` : ''}
        ${c.techStack ? `
        <div class="card-tech">
          ${c.techStack.slice(0, 5).map(t => `<span class="tech-dot">${escapeHtml(t)}</span>`).join('')}
          ${c.techStack.length > 5 ? `<span class="tech-dot">+${c.techStack.length - 5}</span>` : ''}
        </div>` : ''}
        <div class="card-jobs">
          ${(c.jobs || []).slice(0, 3).map(j =>
            `<span class="job-pill">${escapeHtml(j.title)} <span class="salary">${escapeHtml(j.salary)}</span></span>`
          ).join('')}
          ${(c.jobs || []).length > 3 ? `<span class="job-pill job-pill-more">+${c.jobs.length - 3} 更多</span>` : ''}
          ${(c.jobs || []).length === 0 ? '<span class="job-pill job-pill-more">暂无职位</span>' : ''}
        </div>
      </div>`;
    }).join('');

  } else {
    grid.style.display = 'none';
    tableWrap.style.display = 'block';

    table.innerHTML = companies.map(c => `
      <tr>
        <td><span class="table-link" onclick="showDetail(${c.id})">${escapeHtml(c.name)}</span></td>
        <td><span class="tag">${escapeHtml(c.industry)}</span></td>
        <td><span class="tag tag-green">${escapeHtml(c.funding)}</span></td>
        <td>${escapeHtml(c.location)}</td>
        <td>${c.year}年</td>
        <td>${c.advantage.map(a => `<span class="tag tag-amber">${escapeHtml(a)}</span>`).join(' ') || '—'}</td>
        <td>${(c.jobs||[]).length} 个职位${(c.jobs||[]).length > 0 ? ` · ${escapeHtml(c.jobs[0].salary)}` : ''}</td>
        <td><span class="table-link" onclick="showDetail(${c.id})">查看 →</span></td>
      </tr>
    `).join('');
  }
}

// ── View toggle ──
function setView(view) {
  currentView = view;
  document.querySelectorAll('.view-tab').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  applyFilters();
}

// ── Detail modal ──
function showDetail(id) {
  const c = COMPANIES.find(co => co.id === id);
  if (!c) return;

  const modal = document.getElementById('detailModal');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    <h2 class="modal-name">${escapeHtml(c.name)}</h2>
    <p class="modal-desc">${escapeHtml(c.desc)}</p>

    <div class="modal-section">
      <div class="modal-section-title">基本信息</div>
      <div class="modal-meta-grid">
        <div class="modal-meta-item"><span class="modal-meta-label">行业</span><span class="modal-meta-value"><span class="tag">${escapeHtml(c.industry)}</span></span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">融资</span><span class="modal-meta-value"><span class="tag tag-green">${escapeHtml(c.funding)}</span></span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">金额</span><span class="modal-meta-value">${escapeHtml(c.fundingAmt)}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">投资方</span><span class="modal-meta-value">${escapeHtml(c.investors)}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">地区</span><span class="modal-meta-value">${escapeHtml(c.location)}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">规模</span><span class="modal-meta-value">${escapeHtml(c.employees)}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">成立</span><span class="modal-meta-value">${c.year}年</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">产品</span><span class="modal-meta-value">${escapeHtml(c.product || '—')}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">城市</span><span class="modal-meta-value">${escapeHtml((c.cities||[c.location]).join(' · '))}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">标签</span><span class="modal-meta-value">${c.advantage.map(a => `<span class="tag tag-amber">${escapeHtml(a)}</span>`).join(' ') || '—'}</span></div>
      </div>
    </div>

    ${c.techStack ? `
    <div class="modal-section">
      <div class="modal-section-title">技术栈</div>
      <div class="card-tags">${c.techStack.map(t => `<span class="tech-dot">${escapeHtml(t)}</span>`).join('')}</div>
    </div>` : ''}

    ${c.benefits ? `
    <div class="modal-section">
      <div class="modal-section-title">福利待遇</div>
      <div class="card-tags">${c.benefits.map(b => `<span class="tag tag-green">✅ ${escapeHtml(b)}</span>`).join('')}</div>
    </div>` : ''}

    ${(c.jobs||[]).length > 0 ? `
    <div class="modal-section">
      <div class="modal-section-title">在招职位 (${c.jobs.length})</div>
      ${c.jobs.map(j => `
        <div class="modal-job-card">
          <div class="modal-job-title">${escapeHtml(j.title)}</div>
          <div class="modal-job-meta">
            <span>💰 ${escapeHtml(j.salary)}</span>
            <span>📋 ${escapeHtml(j.exp)}</span>
            <span>📚 ${escapeHtml(j.degree||'本科')}</span>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <div class="modal-section" style="background:#fef2f2;border-radius:var(--radius);padding:16px;border:1px solid #fecaca;">
      <div class="modal-section-title" style="color:#dc2626;">⚠️ 投递前先搜一下</div>
      <p style="font-size:.82rem;color:#991b1b;margin-bottom:10px;">坏名声通常不是空穴来风，搜搜看：</p>
      <div class="warn-links">
        <a href="https://maimai.cn/search?q=${encodeURIComponent(c.name.replace(/\\(.*\\)/,'').trim())}+裁员" target="_blank" rel="noopener" class="warn-link">脉脉</a>
        <a href="https://www.zhihu.com/search?type=content&q=${encodeURIComponent(c.name.replace(/\\(.*\\)/,'').trim())}+避雷" target="_blank" rel="noopener" class="warn-link">知乎</a>
        <a href="https://www.nowcoder.com/search?type=post&query=${encodeURIComponent(c.name.replace(/\\(.*\\)/,'').trim())}+坑" target="_blank" rel="noopener" class="warn-link">牛客</a>
        <a href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(c.name.replace(/\\(.*\\)/,'').trim())}+避雷" target="_blank" rel="noopener" class="warn-link">小红书</a>
      </div>
    </div>

    <a href="${escapeHtml(c.website)}" target="_blank" rel="noopener" class="modal-link">🌐 访问官网</a>
  `;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// ── Close modal ──
function closeModal(e) {
  if (e && e.target !== document.getElementById('detailModal')) return;
  document.getElementById('detailModal').classList.remove('show');
  document.body.style.overflow = '';
}

// ── Utils ──
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
