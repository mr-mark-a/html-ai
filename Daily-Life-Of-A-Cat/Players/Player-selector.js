// ============================================================
//  Player Selector — Start-screen UI
//  Renders a selection screen, calls startGame(preset) when done
// ============================================================

const PlayerSelector = (() => {

  let _onSelect = null;
  let _overlay  = null;

  // ─── Cat card config ──────────────────────────────────────
  const CATS = [
    {
      key: 'button',
      name: 'Button',
      description: 'A chubby orange tabby who loves napping & snacks.',
      stat_speed: 3,
      stat_agility: 2,
      stat_luck: 5,
      bodyColor: '#e07b3a',
      spotColor: '#8b3a0a',
      eyeColor: '#f0a500',
      accentClass: 'card-button'
    }
  ];

  // ─── Mini canvas preview ──────────────────────────────────
  function _drawCatPreview(canvas, preset) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Temporarily create a CatPlayer for preview rendering
    const preview = new CatPlayer(preset);
    preview.x = 30;
    preview.y = 20;
    preview.isMoving = false;
    preview.frame = 0;
    preview.render(ctx, 0, 0);
  }

  // ─── Stat bars ────────────────────────────────────────────
  function _statBar(label, value, max = 5) {
    const pips = Array.from({ length: max }, (_, i) =>
      `<span class="stat-pip ${i < value ? 'filled' : ''}"></span>`
    ).join('');
    return `<div class="stat-row"><span class="stat-label">${label}</span>${pips}</div>`;
  }

  // ─── Build DOM ────────────────────────────────────────────
  function show(onSelectCallback) {
    _onSelect = onSelectCallback;

    _overlay = document.createElement('div');
    _overlay.id = 'selector-overlay';
    _overlay.innerHTML = `
      <div id="selector-box">
        <div id="selector-title">
          <span class="title-emoji">🐱</span>
          <h1>Daily Life of a Cat</h1>
          <p class="subtitle">Choose your cat to begin</p>
        </div>
        <div id="cat-cards">
          ${CATS.map(c => `
            <div class="cat-card ${c.accentClass}" data-key="${c.key}" id="card-${c.key}" tabindex="0" role="button" aria-label="Select ${c.name}">
              <canvas class="cat-preview-canvas" width="100" height="100" id="preview-${c.key}"></canvas>
              <div class="cat-info">
                <h2 class="cat-name">${c.name}</h2>
                <p class="cat-desc">${c.description}</p>
                ${_statBar('Speed', c.stat_speed)}
                ${_statBar('Agility', c.stat_agility)}
                ${_statBar('Luck', c.stat_luck)}
              </div>
              <button class="select-btn" data-key="${c.key}" id="select-btn-${c.key}">Play as ${c.name}</button>
            </div>
          `).join('')}
        </div>
        <div id="selector-hint">Use WASD / Arrow keys to move &nbsp;|&nbsp; Space / E to interact</div>
      </div>
    `;

    document.body.appendChild(_overlay);

    // Animate cards in
    requestAnimationFrame(() => {
      _overlay.querySelectorAll('.cat-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.12}s`;
        card.classList.add('card-appear');
      });
    });

    // Draw previews
    CATS.forEach(c => {
      const canvas = document.getElementById(`preview-${c.key}`);
      if (canvas) _drawCatPreview(canvas, CAT_PRESETS[c.key]);
    });

    // Click handlers
    _overlay.querySelectorAll('.select-btn').forEach(btn => {
      btn.addEventListener('click', () => _pick(btn.dataset.key));
    });
    _overlay.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') _pick(card.dataset.key);
      });
    });
  }

  function _pick(key) {
    const preset = CAT_PRESETS[key];
    if (!preset) return;

    // Animate out
    _overlay.classList.add('fade-out');
    setTimeout(() => {
      if (_overlay && _overlay.parentNode) _overlay.parentNode.removeChild(_overlay);
      if (_onSelect) _onSelect(preset);
    }, 450);
  }

  function hide() {
    if (_overlay && _overlay.parentNode) _overlay.parentNode.removeChild(_overlay);
  }

  return { show, hide };
})();
