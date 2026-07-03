// ============================================================
//  CatPlayer — Base class for all playable cats
//  Used by both "Cheetah" and "Button" characters
// ============================================================

class CatPlayer {
  /**
   * @param {object} config
   * @param {string} config.name       — display name
   * @param {string} config.breed      — internal breed key ('cheetah' | 'button')
   * @param {string} config.bodyColor  — main fur CSS color
   * @param {string} config.spotColor  — spot / accent CSS color
   * @param {string} config.eyeColor   — eye CSS color
   * @param {number} config.speed      — pixels per second
   */
  constructor(config) {
    this.name       = config.name      || 'Cat';
    this.breed      = config.breed     || 'tabby';
    this.bodyColor  = config.bodyColor || '#c8a97a';
    this.spotColor  = config.spotColor || '#7a5230';
    this.eyeColor   = config.eyeColor  || '#4caf50';
    this.speed      = config.speed     || 120;

    // World position (px in the current zone's pixel space)
    this.x = 200;
    this.y = 200;

    // Size
    this.width  = 40;
    this.height = 40;

    // Stats  0–100
    this.hunger    = 80;
    this.energy    = 90;
    this.happiness = 75;

    // Animation
    this.frame      = 0;
    this.frameTimer = 0;
    this.frameTick  = 0.18;  // seconds per frame
    this.facing     = 'down'; // 'up' | 'down' | 'left' | 'right'
    this.isMoving   = false;

    // Interaction cooldown
    this._interactCooldown = 0;

    // Mood derived from stats
    this.mood = 'happy'; // 'happy' | 'neutral' | 'tired' | 'hungry' | 'sad'

    // Purring particle timer
    this._purr = 0;
    this.purrParticles = [];
  }

  // ─── Stat Decay ─────────────────────────────────────────
  /**
   * Called once per game-loop tick.
   * @param {number} dt  seconds since last frame
   */
  update(dt) {
    // Decay rates per second
    const HUNGER_DECAY    = 0.6;
    const ENERGY_DECAY    = 0.4;
    const HAPPINESS_DECAY = 0.3;

    this.hunger    = Math.max(0, this.hunger    - HUNGER_DECAY    * dt);
    this.energy    = Math.max(0, this.energy    - ENERGY_DECAY    * dt);
    this.happiness = Math.max(0, this.happiness - HAPPINESS_DECAY * dt);

    // Clamp
    this.hunger    = Math.min(100, this.hunger);
    this.energy    = Math.min(100, this.energy);
    this.happiness = Math.min(100, this.happiness);

    // Derive mood
    this._updateMood();

    // Animation frame
    if (this.isMoving) {
      this.frameTimer += dt;
      if (this.frameTimer >= this.frameTick) {
        this.frameTimer = 0;
        this.frame = (this.frame + 1) % 4;
      }
    } else {
      this.frame = 0;
    }

    // Interact cooldown
    if (this._interactCooldown > 0) this._interactCooldown -= dt;

    // Purr particles
    this._purr -= dt;
    this.purrParticles = this.purrParticles
      .map(p => ({ ...p, y: p.y - 25 * dt, opacity: p.opacity - dt * 0.8 }))
      .filter(p => p.opacity > 0);

    if (this.mood === 'happy' && Math.random() < dt * 0.4) {
      this._spawnPurr();
    }
  }

  _updateMood() {
    const avg = (this.hunger + this.energy + this.happiness) / 3;
    if (avg >= 70) this.mood = 'happy';
    else if (this.energy < 20) this.mood = 'tired';
    else if (this.hunger < 20) this.mood = 'hungry';
    else if (avg < 40) this.mood = 'sad';
    else this.mood = 'neutral';
  }

  _spawnPurr() {
    this.purrParticles.push({
      x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
      y: this.y - 5,
      opacity: 0.9,
      text: Math.random() < 0.5 ? 'purr~' : '♪'
    });
  }

  // ─── Interaction ──────────────────────────────────────────
  /**
   * @param {object} obj  — an interactable world object
   */
  interact(obj) {
    if (this._interactCooldown > 0) return false;
    if (!obj || !obj.type) return false;

    let consumed = false;

    switch (obj.type) {
      case 'food_bowl':
        if (obj.amount > 0) {
          const eat = Math.min(obj.amount, 100 - this.hunger);
          this.hunger = Math.min(100, this.hunger + eat);
          obj.amount  = Math.max(0, obj.amount - eat);
          consumed = true;
        }
        break;
      case 'water_bowl':
        this.happiness = Math.min(100, this.happiness + 5);
        consumed = true;
        break;
      case 'bed':
        this.energy   = Math.min(100, this.energy    + 40);
        this.happiness= Math.min(100, this.happiness + 10);
        consumed = true;
        // Sleeping advances the game to the next day
        try {
          if (typeof window !== 'undefined' && typeof window.advanceToNextDay === 'function') {
            window.advanceToNextDay();
          } else if (typeof CheetahFileManager !== 'undefined' && typeof CheetahFileManager.advanceDay === 'function') {
            CheetahFileManager.advanceDay();
          }
        } catch (e) {
          // fail silently if the environment doesn't expose globals yet
        }
        break;
      case 'toy':
        this.happiness = Math.min(100, this.happiness + 25);
        this.energy    = Math.max(0,   this.energy    - 10);
        consumed = true;
        break;
      case 'litter_box':
        this.happiness = Math.min(100, this.happiness + 5);
        consumed = true;
        break;
      case 'window':
        this.happiness = Math.min(100, this.happiness + 8);
        consumed = true;
        break;
      case 'couch':
        this.energy    = Math.min(100, this.energy    + 15);
        this.happiness = Math.min(100, this.happiness + 10);
        consumed = true;
        break;
    }

    if (consumed) {
      this._interactCooldown = 2.0;
      this._spawnPurr();
      if (typeof SoundManager !== 'undefined') SoundManager.play('meow');
    }
    return consumed;
  }

  // ─── Move ────────────────────────────────────────────────
  /**
   * @param {number} dx  normalised -1..1
   * @param {number} dy  normalised -1..1
   * @param {number} dt  delta time
   * @param {function} blockedFn  — (nx, ny) => boolean
   * @param {object}  bounds     — { minX, minY, maxX, maxY }
   */
  move(dx, dy, dt, blockedFn, bounds) {
    this.isMoving = (dx !== 0 || dy !== 0);

    // Normalise diagonal movement
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len; dy /= len;
    }

    // Update facing direction
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) this.facing = 'right';
      else if (dx < 0) this.facing = 'left';
    } else {
      if (dy > 0) this.facing = 'down';
      else if (dy < 0) this.facing = 'up';
    }

    const newX = this.x + dx * this.speed * dt;
    const newY = this.y + dy * this.speed * dt;

    // Collision on each axis independently (slide)
    const nx = blockedFn ? blockedFn(newX, this.y) : false;
    const ny = blockedFn ? blockedFn(this.x, newY) : false;

    if (!nx) this.x = newX;
    if (!ny) this.y = newY;

    // Clamp to world bounds
    if (bounds) {
      this.x = Math.max(bounds.minX, Math.min(bounds.maxX - this.width,  this.x));
      this.y = Math.max(bounds.minY, Math.min(bounds.maxY - this.height, this.y));
    }
  }

  // ─── Render ──────────────────────────────────────────────
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} camX  camera scroll offset X
   * @param {number} camY  camera scroll offset Y
   */
  render(ctx, camX = 0, camY = 0) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const w  = this.width;
    const h  = this.height;

    ctx.save();

    // Walk bob
    const bob = this.isMoving ? Math.sin(this.frame * Math.PI / 2) * 2 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(sx + w / 2, sy + h + 2 + bob, w * 0.4, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    this._drawBody(ctx, sx, sy + bob, w, h);

    // Mood bubble
    this._drawMoodBubble(ctx, sx, sy + bob);

    ctx.restore();

    // Purr particles
    this.purrParticles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = '#ff9ec4';
      ctx.font        = 'bold 11px "Nunito", sans-serif';
      ctx.fillText(p.text, p.x - camX, p.y - camY);
      ctx.restore();
    });
  }

  _drawBody(ctx, x, y, w, h) {
    const flip = this.facing === 'left';
    ctx.save();
    if (flip) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      x = 0; y = 0;
    }

    // --- Tail ---
    ctx.strokeStyle = this.bodyColor;
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    const tailWag = this.isMoving ? Math.sin(Date.now() / 120) * 12 : 5;
    if (this.facing === 'down' || this.facing === 'up') {
      ctx.moveTo(x + w * 0.15, y + h * 0.65);
      ctx.quadraticCurveTo(x - 12, y + h * 0.9, x - 5, y + h * 0.4 + tailWag);
    } else {
      ctx.moveTo(x + w * 0.1, y + h * 0.65);
      ctx.quadraticCurveTo(x - 14, y + h, x + 2, y + h * 0.3 + tailWag);
    }
    ctx.stroke();

    // --- Body ---
    ctx.fillStyle = this.bodyColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.62, w * 0.42, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Breed spots (Cheetah) ---
    if (this.breed === 'cheetah') {
      this._drawCheetahSpots(ctx, x, y, w, h);
    }
    // Button has a button pattern
    if (this.breed === 'button') {
      this._drawButtonMarkings(ctx, x, y, w, h);
    }

    // --- Head ---
    ctx.fillStyle = this.bodyColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.3, w * 0.34, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Ears ---
    ctx.fillStyle = this.bodyColor;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(x + w * 0.22, y + h * 0.1);
    ctx.lineTo(x + w * 0.12, y - h * 0.08);
    ctx.lineTo(x + w * 0.35, y + h * 0.05);
    ctx.closePath();
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(x + w * 0.65, y + h * 0.05);
    ctx.lineTo(x + w * 0.88, y - h * 0.08);
    ctx.lineTo(x + w * 0.78, y + h * 0.1);
    ctx.closePath();
    ctx.fill();
    // Inner ear
    ctx.fillStyle = '#ffb3c6';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.24, y + h * 0.09);
    ctx.lineTo(x + w * 0.18, y - h * 0.02);
    ctx.lineTo(x + w * 0.33, y + h * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.67, y + h * 0.05);
    ctx.lineTo(x + w * 0.82, y - h * 0.02);
    ctx.lineTo(x + w * 0.76, y + h * 0.09);
    ctx.closePath();
    ctx.fill();

    // --- Eyes ---
    const blink = (this.frame === 1 && this.isMoving) ? 0.1 : 1;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.37, y + h * 0.27, 5, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.63, y + h * 0.27, 5, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.37, y + h * 0.27, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.63, y + h * 0.27, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.39, y + h * 0.25, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.65, y + h * 0.25, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Nose ---
    ctx.fillStyle = '#ff8fab';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.34);
    ctx.lineTo(x + w * 0.45, y + h * 0.37);
    ctx.lineTo(x + w * 0.55, y + h * 0.37);
    ctx.closePath();
    ctx.fill();

    // --- Mouth ---
    ctx.strokeStyle = this.spotColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.375);
    ctx.quadraticCurveTo(x + w * 0.43, y + h * 0.41, x + w * 0.4, y + h * 0.39);
    ctx.moveTo(x + w * 0.5, y + h * 0.375);
    ctx.quadraticCurveTo(x + w * 0.57, y + h * 0.41, x + w * 0.6, y + h * 0.39);
    ctx.stroke();

    // --- Whiskers ---
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1;
    [[x + w * 0.48, y + h * 0.36, x + w * 0.15, y + h * 0.31],
     [x + w * 0.47, y + h * 0.37, x + w * 0.14, y + h * 0.37],
     [x + w * 0.48, y + h * 0.38, x + w * 0.16, y + h * 0.43],
     [x + w * 0.52, y + h * 0.36, x + w * 0.85, y + h * 0.31],
     [x + w * 0.53, y + h * 0.37, x + w * 0.86, y + h * 0.37],
     [x + w * 0.52, y + h * 0.38, x + w * 0.84, y + h * 0.43]
    ].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // --- Legs ---
    ctx.fillStyle = this.bodyColor;
    const legY = y + h * 0.88;
    [x + w * 0.25, x + w * 0.4, x + w * 0.55, x + w * 0.7].forEach((lx, i) => {
      const legBob = this.isMoving && i % 2 === this.frame % 2 ? 3 : 0;
      ctx.beginPath();
      ctx.roundRect(lx - 6, legY + legBob, 11, 14, 5);
      ctx.fill();
    });

    ctx.restore();
  }

  _drawCheetahSpots(ctx, x, y, w, h) {
    ctx.fillStyle = this.spotColor;
    const spots = [
      [x + w * 0.25, y + h * 0.55, 5, 4],
      [x + w * 0.55, y + h * 0.52, 4, 5],
      [x + w * 0.7,  y + h * 0.62, 5, 4],
      [x + w * 0.38, y + h * 0.68, 4, 4],
    ];
    spots.forEach(([sx, sy, rw, rh]) => {
      ctx.beginPath();
      ctx.ellipse(sx, sy, rw, rh, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // Cheetah cheek line
    ctx.strokeStyle = this.spotColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.32, y + h * 0.28);
    ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.38, x + w * 0.35, y + h * 0.44);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.68, y + h * 0.28);
    ctx.quadraticCurveTo(x + w * 0.7, y + h * 0.38, x + w * 0.65, y + h * 0.44);
    ctx.stroke();
  }

  _drawButtonMarkings(ctx, x, y, w, h) {
    // Button cat: orange tabby stripes
    ctx.strokeStyle = this.spotColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    // Forehead stripes
    [y + h * 0.13, y + h * 0.18, y + h * 0.23].forEach(sy => {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.38, sy);
      ctx.lineTo(x + w * 0.62, sy);
      ctx.stroke();
    });
    // Back stripes
    [x + w * 0.3, x + w * 0.5, x + w * 0.7].forEach(sx => {
      ctx.beginPath();
      ctx.moveTo(sx, y + h * 0.52);
      ctx.lineTo(sx - 4, y + h * 0.72);
      ctx.stroke();
    });
  }

  _drawMoodBubble(ctx, x, y) {
    const icons = { happy: '😊', tired: '😴', hungry: '🍖', sad: '😿', neutral: '' };
    const icon = icons[this.mood];
    if (!icon) return;
    ctx.save();
    ctx.font = '14px serif';
    ctx.fillText(icon, x + this.width - 5, y - 6);
    ctx.restore();
  }

  // ─── Bounding box for overlap tests ──────────────────────
  getBounds() {
    return { left: this.x + 4, top: this.y + 20, right: this.x + this.width - 4, bottom: this.y + this.height + 4 };
  }

  /**
   * Serialise to plain object (for save/load).
   */
  toJSON() {
    return { name: this.name, breed: this.breed, x: this.x, y: this.y, hunger: this.hunger, energy: this.energy, happiness: this.happiness };
  }
}

// ─── Preset Cats ─────────────────────────────────────────────
const CAT_PRESETS = {
  cheetah: {
    name: 'Cheetah',
    breed: 'cheetah',
    bodyColor: '#d4a843',
    spotColor: '#5c3d0a',
    eyeColor: '#4caf50',
    speed: 140
  },
  button: {
    name: 'Button',
    breed: 'button',
    bodyColor: '#e07b3a',
    spotColor: '#8b3a0a',
    eyeColor: '#f0a500',
    speed: 115
  }
};
