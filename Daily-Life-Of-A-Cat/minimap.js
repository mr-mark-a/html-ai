// ============================================================
//  Minimap — canvas overlay showing current zone + cat pos
// ============================================================

const Minimap = (() => {

  // ─── Zone colour palettes for minimap rooms ──────────────
  const ZONE_COLORS = {
    yard: {
      0: '#6abf4b', 1: '#8b6914', 2: '#7a5a0f',
      3: '#3a8c27', 4: '#ffcf5e', 5: '#c8aa72',
      6: '#60b8e0', 7: '#8b5e2a', 8: '#5c3d0a'
    },
    l1: {
      0: '#d4a96e', 1: '#7a5c3a', 2: '#6a4c2a',
      3: '#c09060', 4: '#e0dfe0', 5: '#b04040',
      6: '#c4a96a', 7: '#a0cce0'
    },
    l2: {
      0: '#e8d5b0', 1: '#8a6a4a', 2: '#6a4a2a',
      3: '#d4b880', 4: '#d4eef7', 5: '#8060c0',
      6: '#c4a96a', 7: '#b8dff0', 8: '#8a6a4a'
    }
  };

  // ─── Zone map/tilesize references (set by init) ───────────
  let _zones = {};
  let _container = null;
  let _canvas    = null;
  let _ctx       = null;

  const MM_W = 160;
  const MM_H = 112;

  function init(zoneData) {
    _zones = zoneData;

    _container = document.getElementById('minimap-container');
    if (!_container) return;

    _canvas = document.createElement('canvas');
    _canvas.id     = 'minimap-canvas';
    _canvas.width  = MM_W;
    _canvas.height = MM_H;
    _canvas.setAttribute('aria-label', 'Minimap');
    _container.appendChild(_canvas);
    _ctx = _canvas.getContext('2d');
  }

  /**
   * @param {string} zone    — current zone key
   * @param {number} catX    — cat world X
   * @param {number} catY    — cat world Y
   * @param {number} worldW  — world pixel width
   * @param {number} worldH  — world pixel height
   */
  function render(zone, catX, catY, worldW, worldH) {
    if (!_ctx) return;
    const ctx = _ctx;

    ctx.clearRect(0, 0, MM_W, MM_H);

    const zoneInfo = _zones[zone];
    if (!zoneInfo) return;

    const { map, colors } = zoneInfo;
    if (!map || !map.length) return;

    const rows = map.length;
    const cols = map[0].length;
    const tw   = MM_W / cols;
    const th   = MM_H / rows;

    // Draw tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tid = map[r][c];
        ctx.fillStyle = colors[tid] || '#888';
        ctx.fillRect(c * tw, r * th, tw + 0.5, th + 0.5);
      }
    }

    // Cat dot
    const dotX = (catX / worldW) * MM_W;
    const dotY = (catY / worldH) * MM_H;

    // Pulse ring
    const pulse = (Date.now() % 1200) / 1200;
    ctx.strokeStyle = `rgba(255,230,80,${0.8 - pulse * 0.7})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4 + pulse * 6, 0, Math.PI * 2);
    ctx.stroke();

    // Dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return { init, render };
})();
