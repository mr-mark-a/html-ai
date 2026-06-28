// ============================================================
//  SoundManager — lightweight Web Audio API sound manager
//  Uses procedurally generated tones (no audio files needed)
// ============================================================

const SoundManager = (() => {
  let _ctx = null;
  let _enabled = true;

  function _ensure() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        _enabled = false;
      }
    }
    if (_ctx && _ctx.state === 'suspended') _ctx.resume();
  }

  // ─── Tone generator ───────────────────────────────────────
  function _tone(freq, type = 'sine', duration = 0.15, gain = 0.18, delay = 0) {
    if (!_enabled) return;
    _ensure();
    if (!_ctx) return;

    const osc  = _ctx.createOscillator();
    const amp  = _ctx.createGain();
    const now  = _ctx.currentTime + delay;

    osc.connect(amp);
    amp.connect(_ctx.destination);

    osc.type      = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // ─── Sound definitions ────────────────────────────────────
  const SOUNDS = {
    meow() {
      // Ascending chirp
      _ensure();
      if (!_ctx) return;
      const osc = _ctx.createOscillator();
      const amp = _ctx.createGain();
      osc.connect(amp); amp.connect(_ctx.destination);
      const now = _ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.28);
      amp.gain.setValueAtTime(0, now);
      amp.gain.linearRampToValueAtTime(0.12, now + 0.04);
      amp.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now); osc.stop(now + 0.35);
    },
    purr() {
      // Low rumble
      _tone(60, 'sawtooth', 0.5, 0.06);
      _tone(65, 'sawtooth', 0.5, 0.04, 0.01);
    },
    eat() {
      _tone(440, 'sine', 0.08, 0.1);
      _tone(550, 'sine', 0.08, 0.1, 0.06);
      _tone(660, 'sine', 0.08, 0.1, 0.12);
    },
    step() {
      _tone(120 + Math.random() * 40, 'triangle', 0.05, 0.04);
    },
    transition() {
      _tone(440, 'sine', 0.08, 0.12);
      _tone(660, 'sine', 0.08, 0.12, 0.10);
      _tone(880, 'sine', 0.1,  0.12, 0.20);
    },
    select() {
      _tone(523, 'sine', 0.12, 0.15);
      _tone(659, 'sine', 0.12, 0.12, 0.10);
    },
    interact() {
      _tone(700, 'triangle', 0.08, 0.1);
    },

    hiss() {
      // Sharp noise burst descending — cat hiss
      _ensure();
      if (!_ctx) return;
      const now = _ctx.currentTime;
      // White-noise approximation via sawtooth with fast FM
      const osc  = _ctx.createOscillator();
      const osc2 = _ctx.createOscillator();
      const amp  = _ctx.createGain();
      const amp2 = _ctx.createGain();
      osc.connect(amp);   amp.connect(_ctx.destination);
      osc2.connect(amp2); amp2.connect(_ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);
      amp.gain.setValueAtTime(0, now);
      amp.gain.linearRampToValueAtTime(0.18, now + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.start(now); osc.stop(now + 0.4);

      // Add a second harmonic for texture
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1800, now);
      osc2.frequency.exponentialRampToValueAtTime(400, now + 0.35);
      amp2.gain.setValueAtTime(0, now);
      amp2.gain.linearRampToValueAtTime(0.06, now + 0.01);
      amp2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.start(now); osc2.stop(now + 0.4);
    },

    door_close() {
      // Heavy low thud + rattle
      _tone(80, 'sine',     0.06, 0.35);
      _tone(120, 'triangle', 0.08, 0.25, 0.01);
      _tone(60,  'sine',     0.25, 0.2,  0.05);
      // Rattle
      _tone(300, 'sawtooth', 0.04, 0.05, 0.08);
      _tone(280, 'sawtooth', 0.04, 0.04, 0.1);
    }
  };

  function play(name) {
    if (!_enabled) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  }

  function setEnabled(val) {
    _enabled = val;
  }

  // Resume context on first user interaction (browser autoplay policy)
  document.addEventListener('pointerdown', () => _ensure(), { once: true });
  document.addEventListener('keydown',     () => _ensure(), { once: true });

  return { play, setEnabled };
})();
