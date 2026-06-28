// ============================================================
//  House-objects — Shared interactable object class
// ============================================================

class HouseObject {
  /**
   * @param {object} cfg
   * @param {string} cfg.id
   * @param {string} cfg.type     — 'food_bowl'|'water_bowl'|'bed'|'toy'|'litter_box'|'couch'|'tv'|'window'|'stairs'|'door'
   * @param {number} cfg.x
   * @param {number} cfg.y
   * @param {number} [cfg.width=48]
   * @param {number} [cfg.height=48]
   * @param {string} cfg.label
   * @param {number} [cfg.amount=100]
   * @param {string} [cfg.icon]
   */
  constructor(cfg) {
    this.id     = cfg.id;
    this.type   = cfg.type;
    this.x      = cfg.x;
    this.y      = cfg.y;
    this.width  = cfg.width  || 48;
    this.height = cfg.height || 48;
    this.label  = cfg.label;
    this.amount = cfg.amount !== undefined ? cfg.amount : 100;
    this.icon   = cfg.icon || '';
    this._glow  = 0;  // animation state
  }

  /**
   * Is the player close enough to interact?
   * @param {{ left,top,right,bottom }} playerBounds
   * @returns {boolean}
   */
  isNear(playerBounds) {
    const reach = 38;
    return (
      playerBounds.right  + reach > this.x &&
      playerBounds.left   - reach < this.x + this.width &&
      playerBounds.bottom + reach > this.y &&
      playerBounds.top    - reach < this.y + this.height
    );
  }

  /**
   * Update animation
   * @param {number} dt
   */
  update(dt) {
    if (this._glow > 0) this._glow -= dt * 2;
    else this._glow = 0;
  }

  /**
   * Trigger glow on interaction
   */
  flash() {
    this._glow = 1;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} camX
   * @param {number} camY
   * @param {boolean} isNear  — true → show prompt
   */
  render(ctx, camX, camY, isNear) {
    const x = this.x - camX;
    const y = this.y - camY;
    const w = this.width;
    const h = this.height;

    ctx.save();

    // Glow when interacted
    if (this._glow > 0) {
      ctx.shadowBlur  = 18 * this._glow;
      ctx.shadowColor = '#ffe082';
    }

    this._drawShape(ctx, x, y, w, h);

    ctx.restore();

    // Nearby prompt
    if (isNear) {
      ctx.save();
      ctx.fillStyle = 'rgba(30,20,0,0.72)';
      ctx.beginPath();
      ctx.roundRect(x + w / 2 - 36, y - 28, 72, 22, 8);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px "Nunito",sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[ E ] ' + this.label, x + w / 2, y - 12);
      ctx.restore();
    }
  }

  _drawShape(ctx, x, y, w, h) {
    switch (this.type) {
      case 'food_bowl':
        ctx.fillStyle = '#e05c2a';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.7, w * 0.45, h * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.amount > 0 ? '#f5c842' : '#888';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.62, w * 0.32, h * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍽️', x + w / 2, y + h * 0.4);
        break;

      case 'water_bowl':
        ctx.fillStyle = '#60b8e0';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.7, w * 0.42, h * 0.26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aee3f7';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.62, w * 0.28, h * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('💧', x + w / 2, y + h * 0.4);
        break;

      case 'bed':
        ctx.fillStyle = '#9c6dcf';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 10);
        ctx.fill();
        ctx.fillStyle = '#c8a0ef';
        ctx.beginPath();
        ctx.roundRect(x + 8, y + 8, w - 16, h * 0.4, 6);
        ctx.fill();
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛏️', x + w / 2, y + h * 0.75);
        break;

      case 'toy':
        ctx.font = '30px serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.icon || '🐭', x + w / 2, y + h * 0.7);
        break;

      case 'litter_box':
        ctx.fillStyle = '#b5a48a';
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 10, w - 4, h - 12, 6);
        ctx.fill();
        ctx.fillStyle = '#d4c8a0';
        ctx.beginPath();
        ctx.roundRect(x + 6, y + 16, w - 12, h - 24, 4);
        ctx.fill();
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🪣', x + w / 2, y + h * 0.6);
        break;

      case 'couch':
        ctx.fillStyle = '#5b8dd9';
        ctx.beginPath();
        ctx.roundRect(x, y + h * 0.3, w, h * 0.55, 8);
        ctx.fill();
        ctx.fillStyle = '#7baff5';
        ctx.fillRect(x + 6, y + h * 0.1, 14, h * 0.5);
        ctx.fillRect(x + w - 20, y + h * 0.1, 14, h * 0.5);
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛋️', x + w / 2, y + h * 0.6);
        break;

      case 'tv':
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, w - 8, h - 20, 4);
        ctx.fill();
        ctx.fillStyle = '#1a8fd1';
        ctx.fillRect(x + 10, y + 10, w - 20, h - 32);
        // screen shimmer
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + 10, y + 10, (w - 20) * 0.5, h - 32);
        ctx.fillStyle = '#444';
        ctx.fillRect(x + w / 2 - 4, y + h - 18, 8, 10);
        ctx.fillRect(x + w / 2 - 12, y + h - 10, 24, 4);
        break;

      case 'window':
        ctx.fillStyle = '#a0cce0';
        ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(x + 4, y + 4, (w - 8) / 2 - 2, h - 8);
        ctx.strokeStyle = '#8abed8';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
        ctx.strokeStyle = '#8abed8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + 4);
        ctx.lineTo(x + w / 2, y + h - 4);
        ctx.moveTo(x + 4, y + h / 2);
        ctx.lineTo(x + w - 4, y + h / 2);
        ctx.stroke();
        break;

      case 'stairs':
        ctx.fillStyle = '#c4a96a';
        [0, 0.2, 0.4, 0.6, 0.8].forEach((frac, i) => {
          ctx.fillRect(x + i * (w / 5), y + (1 - frac - 0.2) * h, w / 5 + 1, h * (frac + 0.2));
        });
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🪜', x + w / 2, y + h * 0.45);
        break;

      case 'door':
        ctx.fillStyle = '#8b5e2a';
        ctx.beginPath();
        ctx.roundRect(x + 6, y + 2, w - 12, h - 2, [8, 8, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#a87840';
        ctx.fillRect(x + 10, y + 8, w - 20, h - 14);
        ctx.fillStyle = '#f0c060';
        ctx.beginPath();
        ctx.arc(x + w - 16, y + h * 0.55, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚪', x + w / 2, y + h * 0.5);
        break;

      default:
        // Generic box
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 6);
        ctx.fill();
        if (this.icon) {
          ctx.font = '22px serif';
          ctx.textAlign = 'center';
          ctx.fillText(this.icon, x + w / 2, y + h * 0.65);
        }
    }
  }
}
