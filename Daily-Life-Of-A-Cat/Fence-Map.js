// ============================================================
//  Fence-Map — Outdoor yard tilemap
//  Tile IDs:
//    0 = grass (walkable)
//    1 = fence (solid)
//    2 = fence-post (solid)
//    3 = tree (solid)
//    4 = flower (walkable)
//    5 = dirt path (walkable)
//    6 = water bowl (interactive)
//    7 = door (transition)
//    8 = tree trunk (solid)
// ============================================================

const YARD_TILE_SIZE = 40;

// 20 columns × 14 rows  → 800 × 560 world px
const YARD_MAP = [
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,3,0,0,4,4,0,0,0,0,4,4,0,0,0,3,0,0,1],
  [1,0,8,0,0,4,0,0,0,0,0,0,4,0,0,0,8,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,1],
  [1,0,0,5,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,1],
  [1,0,0,5,0,0,0,0,0,0,0,0,0,5,0,0,6,0,0,1],
  [1,0,0,5,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,1],
  [1,0,0,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,1],
  [1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1],
  [1,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,1,1,1,1,1,1,1,7,7,7,1,1,1,1,1,1,1,1,2]
];

// Tiles that block movement
const YARD_SOLID = new Set([1, 2, 3, 8]);

// ─── Tile colours / draw instructions ─────────────────────
const YARD_TILE_STYLES = {
  0: { fill: '#6abf4b' },                          // grass
  1: { fill: '#8b6914', stroke: '#5c4008' },        // fence rail
  2: { fill: '#7a5a0f', stroke: '#4a3500' },        // fence post
  3: { fill: '#3a8c27', stroke: '#1e5211' },        // tree canopy
  4: { fill: '#ffcf5e', stroke: '#e0a820' },        // flower
  5: { fill: '#c8aa72' },                           // dirt path
  6: { fill: '#60b8e0', stroke: '#2a7fb5' },        // water bowl
  7: { fill: '#8b5e2a', stroke: '#5c3a0a' },        // door arch
  8: { fill: '#5c3d0a' }                            // tree trunk
};

// ─── World Objects ────────────────────────────────────────
const YARD_OBJECTS = [
  {
    id: 'yard_water',
    type: 'water_bowl',
    x: 16 * YARD_TILE_SIZE,
    y: 7  * YARD_TILE_SIZE,
    label: '💧 Water',
    amount: 100
  },
  {
    id: 'yard_toy',
    type: 'toy',
    x: 10 * YARD_TILE_SIZE,
    y: 7  * YARD_TILE_SIZE,
    label: '🐭 Toy Mouse',
    amount: 1
  }
];

// ─── Renderer ─────────────────────────────────────────────
/**
 * Draw the yard tilemap onto a canvas context
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} camX
 * @param {number} camY
 * @param {number} canvasW
 * @param {number} canvasH
 */
function renderYard(ctx, camX, camY, canvasW, canvasH) {
  const ts = YARD_TILE_SIZE;
  const startCol = Math.max(0, Math.floor(camX / ts));
  const startRow = Math.max(0, Math.floor(camY / ts));
  const endCol   = Math.min(YARD_MAP[0].length, Math.ceil((camX + canvasW) / ts));
  const endRow   = Math.min(YARD_MAP.length,    Math.ceil((camY + canvasH) / ts));

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const tileId = YARD_MAP[row][col];
      const style  = YARD_TILE_STYLES[tileId] || YARD_TILE_STYLES[0];

      const dx = col * ts - camX;
      const dy = row * ts - camY;

      ctx.fillStyle = style.fill;
      ctx.fillRect(dx, dy, ts, ts);

      if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(dx + 1, dy + 1, ts - 2, ts - 2);
      }

      // Special decorations
      _drawYardTileDecoration(ctx, tileId, dx, dy, ts);
    }
  }

  // Draw objects
  YARD_OBJECTS.forEach(obj => _drawYardObject(ctx, obj, camX, camY));
}

function _drawYardTileDecoration(ctx, tileId, x, y, ts) {
  switch (tileId) {
    case 3: {  // tree canopy
      ctx.fillStyle = '#2d7a1e';
      ctx.beginPath();
      ctx.arc(x + ts / 2, y + ts / 2, ts * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      ctx.arc(x + ts * 0.4, y + ts * 0.38, ts * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 4: {  // flower
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + ts / 2, y + ts / 2, ts * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(x + ts / 2, y + ts / 2, ts * 0.14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 7: {  // door arch
      ctx.fillStyle = '#a06928';
      ctx.beginPath();
      ctx.roundRect(x + ts * 0.2, y + ts * 0.1, ts * 0.6, ts * 0.8, [6, 6, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#c8922a';
      ctx.beginPath();
      ctx.arc(x + ts / 2, y + ts * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 8: {  // tree trunk
      ctx.fillStyle = '#7a5a0f';
      ctx.fillRect(x + ts * 0.35, y + ts * 0.1, ts * 0.3, ts * 0.8);
      break;
    }
    case 2: {  // fence post
      ctx.fillStyle = '#a07820';
      ctx.fillRect(x + ts * 0.3, y, ts * 0.4, ts);
      break;
    }
    case 1: {  // fence rail
      ctx.fillStyle = '#9e7218';
      ctx.fillRect(x, y + ts * 0.2, ts, ts * 0.18);
      ctx.fillRect(x, y + ts * 0.62, ts, ts * 0.18);
      break;
    }
  }
}

function _drawYardObject(ctx, obj, camX, camY) {
  const x = obj.x - camX;
  const y = obj.y - camY;
  const ts = YARD_TILE_SIZE;

  switch (obj.type) {
    case 'water_bowl':
      ctx.fillStyle = '#aee3f7';
      ctx.beginPath();
      ctx.ellipse(x + ts / 2, y + ts / 2, ts * 0.38, ts * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4d9ecf';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💧', x + ts / 2, y + ts / 2 + 4);
      break;
    case 'toy':
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐭', x + ts / 2, y + ts * 0.7);
      break;
  }

  // Interaction label (always shown small)
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = 'bold 9px "Nunito",sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(obj.label, x + ts / 2, y - 4);
}

/**
 * Returns the world bounds of the yard
 */
function getYardBounds() {
  return {
    minX: YARD_TILE_SIZE,
    minY: YARD_TILE_SIZE,
    maxX: YARD_MAP[0].length * YARD_TILE_SIZE - YARD_TILE_SIZE,
    maxY: YARD_MAP.length   * YARD_TILE_SIZE - YARD_TILE_SIZE
  };
}

/**
 * Returns the yard's world pixel dimensions
 */
function getYardSize() {
  return {
    width:  YARD_MAP[0].length * YARD_TILE_SIZE,
    height: YARD_MAP.length    * YARD_TILE_SIZE
  };
}
