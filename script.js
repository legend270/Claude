// ===== PREMIUM CURSOR GLOW =====
(function() {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', width: '320px', height: '320px',
    borderRadius: '50%', pointerEvents: 'none', zIndex: '0',
    background: 'radial-gradient(circle, rgba(240,40,122,0.07) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.12s ease, top 0.12s ease',
    left: '-999px', top: '-999px',
  });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ===== NAVIGATION ACTIVE STATE =====
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ===== PLAYER BAR =====
let isPlaying = false;
let progress = 35;
let vol = 70;

function initPlayer() {
  const playBtn = document.getElementById('playPauseBtn');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const volFill = document.getElementById('volFill');
  const volTrack = document.getElementById('volTrack');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.innerHTML = isPlaying
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    // spin player disc if on player page
    const disc = document.querySelector('.player-disc');
    if (disc) disc.classList.toggle('playing', isPlaying);
  });

  // Progress bar click
  if (progressTrack) {
    progressTrack.addEventListener('click', e => {
      const rect = progressTrack.getBoundingClientRect();
      progress = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      if (progressFill) progressFill.style.width = progress + '%';
      const elapsed = document.getElementById('elapsed');
      if (elapsed) elapsed.textContent = secToTime(Math.round((progress / 100) * 223));
    });
  }

  // Volume click
  if (volTrack) {
    volTrack.addEventListener('click', e => {
      const rect = volTrack.getBoundingClientRect();
      vol = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      if (volFill) volFill.style.width = vol + '%';
    });
  }

  // Simulate progress
  setInterval(() => {
    if (!isPlaying) return;
    progress = (progress + 0.05) % 100;
    if (progressFill) progressFill.style.width = progress + '%';
    const elapsed = document.getElementById('elapsed');
    if (elapsed) elapsed.textContent = secToTime(Math.round((progress / 100) * 223));
  }, 1000);
}

function secToTime(s) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// ===== FILTER BUTTONS =====
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-bar');
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ===== SEARCH =====
function initSearch() {
  const inputs = document.querySelectorAll('.filter-search input, .nav-search input');
  inputs.forEach(input => {
    input.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const grid = document.querySelector('.search-target');
      if (!grid) return;
      grid.querySelectorAll('[data-search]').forEach(item => {
        item.style.display = item.dataset.search.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });
}

// ===== LIKE BUTTONS =====
function initLikes() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      btn.style.color = btn.classList.contains('liked') ? '#e91e8c' : '';
    });
  });
}

// ===== WAVEFORM HEIGHTS =====
function initWaveform() {
  const bars = document.querySelectorAll('.wave-bar');
  bars.forEach((bar, i) => {
    const h = 20 + Math.random() * 80;
    bar.style.height = h + '%';
    bar.style.animationDelay = (i * 0.05) + 's';
  });
}

// ===== TOOLTIP =====
function initTooltips() {
  document.querySelectorAll('[data-tip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = el.dataset.tip;
    Object.assign(tip.style, {
      position: 'fixed', background: '#333', color: '#fff',
      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
      pointerEvents: 'none', opacity: '0', transition: 'opacity 0.15s',
      zIndex: '9999', whiteSpace: 'nowrap'
    });
    document.body.appendChild(tip);
    el.addEventListener('mouseenter', e => {
      const r = el.getBoundingClientRect();
      tip.style.left = r.left + r.width/2 - tip.offsetWidth/2 + 'px';
      tip.style.top = r.top - 32 + 'px';
      tip.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
  });
}

// ===== SONG ROW PLAY =====
function initSongRows() {
  document.querySelectorAll('.song-row').forEach(row => {
    row.addEventListener('dblclick', () => {
      document.querySelectorAll('.song-row.now-playing').forEach(r => r.classList.remove('now-playing'));
      row.classList.add('now-playing');
      row.querySelector('.rank').innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#e91e8c"><polygon points="5,3 19,12 5,21"/></svg>';
      isPlaying = true;
      const playBtn = document.getElementById('playPauseBtn');
      if (playBtn) playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  initFilters();
  initSearch();
  initLikes();
  initWaveform();
  initTooltips();
  initSongRows();
});
