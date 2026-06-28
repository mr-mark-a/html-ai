// ============================================================
//  cheetah-meet.js
//  Handles the first-meeting cutscene between Button and Cheetah.
//
//  Sequence:
//   1. Button stops moving (input blocked)
//   2. Button faces Cheetah, speech bubble: "😾 Hsssss!"
//   3. Hiss sound plays (3× escalating)
//   4. Cheetah "slides" toward the locked room door (animated)
//   5. Door-close sound plays, door slams shut
//   6. Text: "Cheetah has been taken to her own room..."
//   7. Input unblocked, locked room door is added to Restrictions
// ============================================================

const CheetahMeet = (() => {

  let _active    = false;  // is the cutscene running?
  let _phase     = 0;      // sub-phase index
  let _timer     = 0;      // seconds in current sub-phase
  let _onDone    = null;   // callback when cutscene finishes

  // These are set when the scene starts
  let _button    = null;   // Button player CatPlayer
  let _cheetah   = null;   // Cheetah NPC CatPlayer
  let _ctx       = null;   // canvas context

  // Canvas-space positions (set per frame from game)
  let _btnScreenX = 0, _btnScreenY = 0;
  let _chtScreenX = 0, _chtScreenY = 0;

  // Cheetah slide target (the locked-room door on L2)
  const CHEETAH_ROOM_TARGET_X = 620;  // world px
  const CHEETAH_ROOM_TARGET_Y = 120;

  // Speech bubble content per sub-phase
  const PHASES = [
    { duration: 0.6, buttonSpeech: null,         cheetahSpeech: null,     action: 'freeze'     },
    { duration: 0.8, buttonSpeech: '😾',          cheetahSpeech: null,     action: 'hiss1'      },
    { duration: 0.6, buttonSpeech: '😾 Hssss!',   cheetahSpeech: null,     action: 'hiss2'      },
    { duration: 0.8, buttonSpeech: '😾 HISSSS!!', cheetahSpeech: '😨',     action: 'hiss3'      },
    { duration: 1.2, buttonSpeech: null,           cheetahSpeech: '😢',     action: 'slide'      },
    { duration: 0.5, buttonSpeech: null,           cheetahSpeech: null,     action: 'door_close' },
    { duration: 2.5, buttonSpeech: '😒',           cheetahSpeech: null,     action: 'caption'    },
    { duration: 0.5, buttonSpeech: null,           cheetahSpeech: null,     action: 'done'       }
  ];

  const CAPTION_TEXT = "Cheetah has been taken\nto her own room...";

  // ─── Start the cutscene ───────────────────────────────────
  /**
   * @param {CatPlayer} buttonPlayer
   * @param {CatPlayer} cheetahNPC
   * @param {CanvasRenderingContext2D} ctx
   * @param {function} onDone — called when cutscene ends
   */
  function start(buttonPlayer, cheetahNPC, ctx, onDone) {
    _active    = true;
    _phase     = 0;
    _timer     = 0;
    _button    = buttonPlayer;
    _cheetah   = cheetahNPC;
    _ctx       = ctx;
    _onDone    = onDone;
  }

  function isActive() { return _active; }

  // ─── Update — call every frame ────────────────────────────
  /**
   * @param {number} dt
   * @param {number} camX
   * @param {number} camY
   */
  function update(dt, camX, camY) {
    if (!_active) return;

    const ph = PHASES[_phase];
    _timer += dt;

    // ─── Per-phase logic ────────────────────────────
    switch (ph.action) {
      case 'hiss1':
        if (_timer < 0.05) SoundManager.play('hiss');
        break;
      case 'hiss2':
        if (_timer < 0.05) SoundManager.play('hiss');
        break;
      case 'hiss3':
        if (_timer < 0.05) {
          SoundManager.play('hiss');
          setTimeout(() => SoundManager.play('hiss'), 120);
        }
        break;
      case 'slide':
        // Slide Cheetah toward locked room
        if (_cheetah) {
          const dx = CHEETAH_ROOM_TARGET_X - _cheetah.x;
          const dy = CHEETAH_ROOM_TARGET_Y - _cheetah.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 4) {
            const speed = 160;
            _cheetah.x += (dx / dist) * speed * dt;
            _cheetah.y += (dy / dist) * speed * dt;
            _cheetah.isMoving = true;
            _cheetah.facing = dx > 0 ? 'right' : 'left';
          }
        }
        break;
      case 'door_close':
        if (_timer < 0.05) SoundManager.play('door_close');
        if (_cheetah) _cheetah.isMoving = false;
        break;
    }

    // ─── Screen coords for rendering ────────────────
    if (_button)  { _btnScreenX = _button.x  - camX; _btnScreenY = _button.y  - camY; }
    if (_cheetah) { _chtScreenX = _cheetah.x - camX; _chtScreenY = _cheetah.y - camY; }

    // ─── Advance phase ───────────────────────────────
    if (_timer >= ph.duration) {
      _timer = 0;
      _phase++;
      if (_phase >= PHASES.length) {
        _active = false;
        if (_onDone) _onDone();
        return;
      }
    }
  }

  // ─── Render — overlaid on the game canvas ─────────────────
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  function render(ctx) {
    if (!_active) return;
    const ph = PHASES[_phase];

    // ── Button speech bubble ──────────────────────────
    if (ph.buttonSpeech) {
      _drawSpeechBubble(ctx, _btnScreenX + 20, _btnScreenY - 18, ph.buttonSpeech, '#fff3e0', '#e65100');
    }

    // ── Cheetah speech bubble ─────────────────────────
    if (ph.cheetahSpeech && _cheetah) {
      _drawSpeechBubble(ctx, _chtScreenX + 20, _chtScreenY - 18, ph.cheetahSpeech, '#fce4ec', '#c2185b');
    }

    // ── Full-screen caption (final phase) ─────────────
    if (ph.action === 'caption') {
      const alpha = Math.min(1, _timer / 0.4) * Math.min(1, (ph.duration - _timer) / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha * 0.82;
      ctx.fillStyle = '#1a0a00';
      ctx.fillRect(0, ctx.canvas.height / 2 - 50, ctx.canvas.width, 100);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px "Nunito", sans-serif';
      ctx.textAlign = 'center';
      const lines = CAPTION_TEXT.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, ctx.canvas.width / 2, ctx.canvas.height / 2 - 10 + i * 26);
      });
      ctx.restore();
    }

    // ── Vignette shake on big hiss ────────────────────
    if (ph.action === 'hiss3' && _timer < 0.3) {
      const intensity = (0.3 - _timer) / 0.3 * 6;
      ctx.save();
      ctx.strokeStyle = `rgba(255,80,0,${intensity * 0.15})`;
      ctx.lineWidth = intensity * 10;
      ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
  }

  // ─── Speech bubble helper ─────────────────────────────────
  function _drawSpeechBubble(ctx, x, y, text, bg, border) {
    ctx.save();
    ctx.font = 'bold 16px "Nunito", sans-serif';
    const w = ctx.measureText(text).width + 20;
    const h = 28;
    const rx = x - w / 2;
    const ry = y - h;

    // Box
    ctx.fillStyle = bg;
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rx, ry, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x + 6, y);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#1a0a00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, ry + h / 2);
    ctx.restore();
  }

  return { start, isActive, update, render };
})();
