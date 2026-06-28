// ============================================================
//  InputController — keyboard + on-screen D-pad
// ============================================================

const InputController = (() => {
  // ─── State ───────────────────────────────────────────────
  const keys = { up: false, down: false, left: false, right: false, interact: false };
  let _interactPressedThisFrame = false;
  let _interactConsumed = false;

  // ─── Keyboard ────────────────────────────────────────────
  const KEY_MAP = {
    ArrowUp: 'up', w: 'up', W: 'up',
    ArrowDown: 'down', s: 'down', S: 'down',
    ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right',
    ' ': 'interact', e: 'interact', E: 'interact',
    Enter: 'interact'
  };

  window.addEventListener('keydown', e => {
    const action = KEY_MAP[e.key];
    if (action) {
      e.preventDefault();
      if (action === 'interact' && !keys.interact) _interactPressedThisFrame = true;
      keys[action] = true;
    }
  });

  window.addEventListener('keyup', e => {
    const action = KEY_MAP[e.key];
    if (action) keys[action] = false;
  });

  // ─── D-pad DOM ───────────────────────────────────────────
  function _createDpad() {
    const dpad = document.createElement('div');
    dpad.id = 'dpad';
    dpad.innerHTML = `
      <button id="dpad-up"       aria-label="Move Up"       data-dir="up">▲</button>
      <button id="dpad-left"     aria-label="Move Left"     data-dir="left">◀</button>
      <button id="dpad-center"   aria-label="Interact"      data-dir="interact">●</button>
      <button id="dpad-right"    aria-label="Move Right"    data-dir="right">▶</button>
      <button id="dpad-down"     aria-label="Move Down"     data-dir="down">▼</button>
    `;
    document.body.appendChild(dpad);

    dpad.querySelectorAll('button[data-dir]').forEach(btn => {
      const dir = btn.dataset.dir;

      const press = (e) => {
        e.preventDefault();
        if (dir === 'interact') {
          if (!keys.interact) _interactPressedThisFrame = true;
        }
        keys[dir] = true;
      };
      const release = (e) => {
        e.preventDefault();
        keys[dir] = false;
      };

      btn.addEventListener('pointerdown',  press,   { passive: false });
      btn.addEventListener('pointerup',    release, { passive: false });
      btn.addEventListener('pointerleave', release, { passive: false });
      btn.addEventListener('pointercancel',release, { passive: false });
    });
  }

  // ─── Public API ──────────────────────────────────────────
  /**
   * Returns normalised movement vector { dx, dy }
   * and whether interact was just pressed this frame.
   */
  function getState() {
    let dx = 0, dy = 0;
    if (keys.left)  dx -= 1;
    if (keys.right) dx += 1;
    if (keys.up)    dy -= 1;
    if (keys.down)  dy += 1;

    const interact = _interactPressedThisFrame && !_interactConsumed;
    if (interact) _interactConsumed = true;

    return { dx, dy, interact };
  }

  /** Call once per frame AFTER reading state to reset one-shot flags */
  function endFrame() {
    _interactPressedThisFrame = false;
    _interactConsumed = false;
  }

  function init() {
    _createDpad();
  }

  return { init, getState, endFrame };
})();
