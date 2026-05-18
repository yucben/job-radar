// JobRadar — Filtering & Rendering Engine

let activeFilters = {};
let currentView = 'card';
let currentSort = 'default';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  renderFilterChips();
  applyFilters();
});

// ===== Render Filter Chips =====
function renderFilterChips() {
  for (const [key, options] of Object.entries(FILTERS)) {
    const container = document.getElementById(`filter-${key}`);
    if (!container) continue;
    container.innerHTML = options.map(opt => 
      `<span class="filter-chip" data-filter="${key}" data-value="${opt}" onclick="toggleFilter('${key}', '${opt}')">${opt}</span>`
    ).join('');
  }
}

// ===== Toggle Filter =====
function toggleFilter(key, value) {
  if (!activeFilters[key]) activeFilters[key] = [];
  
  if (value === '不限') {
    // "不限" clears this filter
    delete activeFilters[key];
  } else if (activeFilters[key].includes(value)) {
    // Remove if already active
    activeFilters[key] = activeFilters[key].filter(v => v !== value);
    if (activeFilters[key].length === 0) delete activeFilters[key];
  } else {
    // Add to active
    activeFilters[key].push(value);
  }
  
  updateChipUI();
  applyFilters();
}

// ===== Update Chip Visual State =====
function updateChipUI() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const filterKey = chip.dataset.filter;
    const filterVal = chip.dataset.value;
    if (filterVal === '不限') {
      chip.classList.toggle('active', !activeFilters[filterKey]);
    } else {
      chip.classList.toggle('active', activeFilters[filterKey]?.includes(filterVal));
    }
  });
}

// ===== Reset Filters =====
function resetFilters() {
  activeFilters = {};
  document.getElementById('nameSearch').value = '';
  document.getElementById('sortBy').value = 'default';
  currentSort = 'default';
  updateChipUI();
  applyFilters();
}

// ===== Apply Filters =====
function applyFilters() {
  const nameQuery = document.getElementById('nameSearch').value.toLowerCase().trim();
  const sortBy = document.getElementById('sortBy').value;
  currentSort = sortBy;
  
  let filtered = COMPANIES.filter(c => {
    // Name search
    if (nameQuery && !c.name.toLowerCase().includes(nameQuery)) return false;
    
    // Multi-select filters
    for (const [key, values] of Object.entries(activeFilters)) {
      if (key === 'industry' && c.industry !== '不限' && !values.some(v => v === c.industry)) return false;
      if (key === 'funding' && !values.some(v => v === c.funding)) return false;
      if (key === 'year') {
        if (!values.some(v => {
          if (v === '2010年及以前') return c.year <= 2010;
          if (v === '不限') return true;
          const y = parseInt(v);
          return c.year === y;
        })) return false;
      }
      if (key === 'advantage') {
        if (c.advantage.length === 0) {
          if (!values.includes('不限')) return false;
        } else {
          if (!values.some(v => v === '不限' || c.advantage.includes(v))) return false;
        }
      }
      if (key === 'location' && !values.some(v => v === c.location)) return false;
      if (key === 'media') {
        if (!values.some(v => {
          if (v === '不限') return true;
          if (v === '是') return c.media === true;
          if (v === '否') return c.media === false;
        })) return false;
      }
      if (key === 'hiring') {
        if (!values.some(v => {
          if (v === '不限') return true;
          if (v === '是') return c.hiring === true;
          if (v === '否') return c.hiring === false;
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
  
  // Active filter summary
  const activeKeys = Object.keys(activeFilters);
  if (activeKeys.length > 0) {
    document.getElementById('activeFilters').textContent = 
      `· 筛选: ${companies.length} 家`;
  } else {
    document.getElementById('activeFilters').textContent = '';
  }
  
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
        </div>
        <div class="card-info">📍 ${c.location} · 👥 ${c.employees}</div>
        <div class="card-info"><strong>投资人:</strong> ${c.investors}</div>
        <div class="card-jobs">
          ${c.jobs.slice(0, 3).map(j => 
            `<span class="job-badge">${j.title} <span class="salary">${j.salary}</span></span>`
          ).join('')}
          ${c.jobs.length > 3 ? `<span class="job-badge" style="background:#f1f5f9;color:#64748b">+${c.jobs.length - 3} 更多</span>` : ''}
          ${c.jobs.length === 0 ? '<span style="font-size:.8rem;color:#94a3b8">暂无在招职位</span>' : ''}
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
        <td>${c.jobs.length} 个职位${c.jobs.length > 0 ? ` · ${c.jobs[0].salary}` : ''}</td>
        <td><span style="color:var(--primary);cursor:pointer;font-size:.85rem" onclick="showDetail(${c.id})">查看 →</span></td>
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
        <div class="modal-meta-item"><span class="label">优势</span><span class="value">${c.advantage.map(a => `<span class="tag tag-warn">${a}</span>`).join(' ') || '—'}</span></div>
      </div>
    </div>
    
    ${c.jobs.length > 0 ? `
    <div class="modal-section">
      <h3>在招职位 (${c.jobs.length})</h3>
      <div class="modal-job-list">
        ${c.jobs.map(j => `
          <div class="modal-job-item">
            <div class="job-title">${j.title}</div>
            <div class="job-meta">💰 ${j.salary} · 📋 ${j.exp}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
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
