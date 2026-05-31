// JobRadar — Filtering & Rendering Engine

let activeFilters = {};
let currentView = 'card';
let currentSort = 'default';
let openDropdown = null;

// Filter definitions for the horizontal bar (order matters)
const FILTER_BAR = [
  { key: 'industry', label: '🏭 行业' },
  { key: 'funding', label: '💰 融资' },
  { key: 'location', label: '📍 地区' },
  { key: 'advantage', label: '🏆 优势' },
  { key: 'recruitment', label: '🎓 招聘' },
  { key: 'bestEmployer', label: '🏅 最佳雇主' },
  { key: 'year', label: '📅 成立' },
  { key: 'media', label: '📰 36氪' },
  { key: 'hiring', label: '🆕 招聘中' },
  { key: 'degree', label: '📚 学历' },
];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  buildFilterBar();
  applyFilters();
  
  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
      closeAllDropdowns();
    }
  });
});

// ===== Build Filter Bar =====
function buildFilterBar() {
  const container = document.getElementById('filterDropdowns');
  container.innerHTML = FILTER_BAR.map(f => {
    const options = FILTERS[f.key] || [];
    return `
      <div class="filter-dropdown" data-key="${f.key}">
        <button class="filter-dropdown-btn" onclick="toggleDropdown(event, '${f.key}')">
          ${f.label} <span class="arrow">▾</span>
        </button>
        <div class="filter-dropdown-panel">
          <div class="chips">
            ${options.map(opt => 
              `<span class="filter-chip" data-filter="${f.key}" data-value="${opt}" onclick="event.stopPropagation(); toggleFilter('${f.key}', '${opt}')">${opt}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== Dropdown Toggle =====
function toggleDropdown(e, key) {
  e.stopPropagation();
  const dd = document.querySelector(`.filter-dropdown[data-key="${key}"]`);
  if (!dd) return;
  
  const wasOpen = dd.classList.contains('open');
  closeAllDropdowns();
  
  if (!wasOpen) {
    dd.classList.add('open');
    openDropdown = key;
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.filter-dropdown.open').forEach(d => d.classList.remove('open'));
  openDropdown = null;
}

// ===== Toggle Filter =====
function toggleFilter(key, value) {
  if (value === '不限') {
    delete activeFilters[key];
    updateUI();
    applyFilters();
    return;
  }
  
  if (!activeFilters[key]) activeFilters[key] = [];
  
  if (activeFilters[key].includes(value)) {
    activeFilters[key] = activeFilters[key].filter(v => v !== value);
    if (activeFilters[key].length === 0) delete activeFilters[key];
  } else {
    activeFilters[key].push(value);
  }
  
  updateUI();
  applyFilters();
}

// ===== Update UI (chips + tags + buttons) =====
function updateUI() {
  // Update chip states
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
  
  // Update dropdown button states
  document.querySelectorAll('.filter-dropdown').forEach(dd => {
    const key = dd.dataset.key;
    const btn = dd.querySelector('.filter-dropdown-btn');
    if (activeFilters[key] && activeFilters[key].length > 0) {
      btn.classList.add('has-active');
    } else {
      btn.classList.remove('has-active');
    }
  });
  
  // Update active tags
  renderActiveTags();
  
  // Reset button
  const totalActive = Object.values(activeFilters).reduce((s, arr) => s + arr.length, 0);
  const btnReset = document.getElementById('btnReset');
  if (totalActive > 0) {
    btnReset.style.display = '';
    btnReset.classList.add('visible');
  } else {
    btnReset.style.display = 'none';
    btnReset.classList.remove('visible');
  }
}

// ===== Render Active Tags =====
function renderActiveTags() {
  const container = document.getElementById('activeTags');
  let tags = [];
  
  for (const [key, values] of Object.entries(activeFilters)) {
    const label = (FILTER_BAR.find(f => f.key === key) || {}).label || key;
    for (const v of values) {
      tags.push({ key, value: v, label });
    }
  }
  
  container.innerHTML = tags.map(t => 
    `<span class="active-tag" onclick="removeFilter('${t.key}', '${t.value}')" title="点击移除">
      ${t.value} <span class="remove">✕</span>
    </span>`
  ).join('');
}

// ===== Remove Single Filter =====
function removeFilter(key, value) {
  if (activeFilters[key]) {
    activeFilters[key] = activeFilters[key].filter(v => v !== value);
    if (activeFilters[key].length === 0) delete activeFilters[key];
  }
  updateUI();
  applyFilters();
}

// ===== Reset Filters =====
function resetFilters() {
  activeFilters = {};
  document.getElementById('nameSearch').value = '';
  document.getElementById('sortBy').value = 'default';
  currentSort = 'default';
  updateUI();
  applyFilters();
}

// ===== Apply Filters =====
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
          return c.year === y;
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
      if (key === 'bestEmployer') {
        if (!values.some(v => {
          if (v === '是') return c.bestEmployer === true;
          if (v === '否') return c.bestEmployer === false;
        })) return false;
      }
      if (key === 'degree') {
        const degRank = { '大专': 1, '本科': 2, '硕士': 3, '博士': 4 };
        if (!values.some(d => {
          const minRank = degRank[d];
          return c.jobs.some(j => (degRank[j.degree] || 2) >= minRank);
        })) return false;
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

// ===== Render Results =====
function renderResults(companies) {
  const grid = document.getElementById('companyGrid');
  const table = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  const tableWrap = document.getElementById('companyTable');
  
  // Stats
  document.getElementById('companyCount').textContent = COMPANIES.length;
  const totalJobs = COMPANIES.reduce((s, c) => s + c.jobs.length, 0);
  document.getElementById('jobCount').textContent = totalJobs;
  const bestEmployerCount = COMPANIES.filter(c => c.bestEmployer).length;
  document.getElementById('bestEmployerCount').textContent = bestEmployerCount;
  
  // Empty state
  if (companies.length === 0) {
    grid.innerHTML = '';
    table.innerHTML = '';
    tableWrap.style.display = 'none';
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  
  // Card view
  if (currentView === 'card') {
    grid.style.display = 'grid';
    tableWrap.style.display = 'none';
    
    grid.innerHTML = companies.map(c => `
      <div class="company-card" onclick="showDetail(${c.id})">
        <div class="card-header">
          <span class="card-name">${c.name}</span>
          <span class="card-year">${c.year}年</span>
        </div>
        <div class="card-industry">
          <span class="tag">${c.industry}</span>
          <span class="tag tag-success">${c.funding}</span>
          ${c.advantage.map(a => `<span class="tag tag-warn">${a}</span>`).join('')}
          ${c.recruitment === '校招' ? '<span class="tag tag-warn" style="background:#fff8f1;color:#b45309">🎓校招</span>' : ''}
          ${c.bestEmployer ? '<span class="tag tag-pink">🏆最佳雇主</span>' : ''}
        </div>
        <div class="card-info">📍 ${c.location} · 👥 ${c.employees}</div>
        <div class="card-info"><strong>投资人:</strong> ${c.investors}</div>
        ${c.techStack ? `<div class="card-tech">${c.techStack.slice(0,5).map(t => `<span class="tag tag-gray">${t}</span>`).join(' ')}${c.techStack.length > 5 ? ` <span style="font-size:.7rem;color:var(--text-muted)">+${c.techStack.length-5}</span>` : ''}</div>` : ''}
        <div class="card-jobs">
          ${c.jobs.slice(0, 3).map(j => 
            `<span class="job-badge">${j.title} <span class="salary">${j.salary}</span> · ${j.degree||'本科'}</span>`
          ).join('')}
          ${c.jobs.length > 3 ? `<span class="job-badge" style="background:var(--bg-subtle);color:var(--text-tertiary)">+${c.jobs.length - 3} 更多</span>` : ''}
          ${c.jobs.length === 0 ? '<span style="font-size:.8rem;color:var(--text-muted)">暂无在招职位</span>' : ''}
        </div>
      </div>
    `).join('');
    
  } else {
    // Table view
    grid.style.display = 'none';
    tableWrap.style.display = 'block';
    
    table.innerHTML = companies.map(c => `
      <tr>
        <td><span class="table-name" onclick="showDetail(${c.id})">${c.name}</span></td>
        <td><span class="tag">${c.industry}</span></td>
        <td><span class="tag tag-success">${c.funding}</span></td>
        <td>${c.location}</td>
        <td>${c.year}年</td>
        <td>${c.advantage.map(a => `<span class="tag tag-warn">${a}</span>`).join(' ') || '—'}</td>
        <td>${c.bestEmployer ? '<span class="tag tag-pink">🏆</span>' : '—'}</td>
        <td>${c.jobs.length} 个职位${c.jobs.length > 0 ? ` · ${c.jobs[0].salary}` : ''}</td>
      </tr>
    `).join('');
  }
}

// ===== Set View =====
function setView(view) {
  currentView = view;
  document.querySelectorAll('.btn-view').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  applyFilters();
}

// ===== Show Detail Modal =====
function showDetail(id) {
  const c = COMPANIES.find(co => co.id === id);
  if (!c) return;
  
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('modalBody');
  
  body.innerHTML = `
    <h2 class="modal-company-name">${c.name}</h2>
    <p class="modal-company-desc">${c.desc}</p>
    
    <div class="modal-section">
      <h3>基本信息</h3>
      <div class="modal-meta-grid">
        <div class="modal-meta-item"><span class="label">行业</span><span class="value"><span class="tag">${c.industry}</span></span></div>
        <div class="modal-meta-item"><span class="label">融资</span><span class="value"><span class="tag tag-success">${c.funding}</span></span></div>
        <div class="modal-meta-item"><span class="label">金额</span><span class="value">${c.fundingAmt}</span></div>
        <div class="modal-meta-item"><span class="label">投资人</span><span class="value">${c.investors}</span></div>
        <div class="modal-meta-item"><span class="label">地区</span><span class="value">${c.location}</span></div>
        <div class="modal-meta-item"><span class="label">规模</span><span class="value">${c.employees}</span></div>
        <div class="modal-meta-item"><span class="label">成立</span><span class="value">${c.year}年</span></div>
        <div class="modal-meta-item"><span class="label">产品</span><span class="value">${c.product || '—'}</span></div>
        <div class="modal-meta-item"><span class="label">城市</span><span class="value">${(c.cities||[c.location]).join(' · ')}</span></div>
        <div class="modal-meta-item"><span class="label">优势</span><span class="value">${c.advantage.map(a => `<span class="tag tag-warn">${a}</span>`).join(' ') || '—'}</span></div>
        <div class="modal-meta-item"><span class="label">招聘</span><span class="value"><span class="tag tag-success">${c.recruitment}</span></span></div>
        <div class="modal-meta-item"><span class="label">最佳雇主</span><span class="value">${c.bestEmployer ? '<span class="tag tag-pink">🏆 2025最佳雇主</span>' : '—'}</span></div>
      </div>
    </div>
    
    ${c.techStack ? `
    <div class="modal-section">
      <h3>技术栈</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${c.techStack.map(t => `<span class="tag tag-gray">${t}</span>`).join('')}
      </div>
    </div>
    ` : ''}
    
    ${c.benefits ? `
    <div class="modal-section">
      <h3>福利待遇</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${c.benefits.map(b => `<span class="benefit-tag">✅ ${b}</span>`).join('')}
      </div>
    </div>
    ` : ''}
    
    ${c.jobs.length > 0 ? `
    <div class="modal-section">
      <h3>在招职位 (${c.jobs.length})</h3>
      <div class="modal-job-list">
        ${c.jobs.map(j => `
          <div class="modal-job-item">
            <div class="job-title">${j.title}</div>
            <div class="job-meta">💰 ${j.salary} · 📋 ${j.exp} · 📚 ${j.degree||'本科'}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div class="modal-section warn-section">
      <h3>⚠️ 避坑查询 — 搜负面评价</h3>
      <p>坏名声通常不是空穴来风。投简历前搜一圈：</p>
      <div class="warn-links">
        <a href="https://maimai.cn/search?q=${encodeURIComponent(c.name.replace(/\(.*\)/,'').trim())}+裁员" target="_blank" class="warn-link" rel="noopener">脉脉</a>
        <a href="https://www.zhihu.com/search?type=content&q=${encodeURIComponent(c.name.replace(/\(.*\)/,'').trim())}+避雷" target="_blank" class="warn-link" rel="noopener">知乎</a>
        <a href="https://www.nowcoder.com/search?type=post&query=${encodeURIComponent(c.name.replace(/\(.*\)/,'').trim())}+坑" target="_blank" class="warn-link" rel="noopener">牛客</a>
        <a href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(c.name.replace(/\(.*\)/,'').trim())}+避雷" target="_blank" class="warn-link" rel="noopener">小红书</a>
      </div>
    </div>
    
    <a href="${c.website}" target="_blank" class="modal-link" rel="noopener">🌐 访问官网</a>
  `;
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// ===== Close Modal =====
function closeModal(e) {
  if (e && e.target !== document.getElementById('detailModal')) return;
  document.getElementById('detailModal').classList.remove('show');
  document.body.style.overflow = '';
}
