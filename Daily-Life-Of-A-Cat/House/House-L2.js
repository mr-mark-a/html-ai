// ============================================================
//  House-L2 — Upper Floor (Bedroom + Bathroom + Study nook)
//  Tile IDs:
//    0 = floor / walkable (light wood)
//    1 = wall (solid)
//    2 = corner (solid)
//    3 = door opening (walkable)
//    4 = bathroom tile (walkable)
//    5 = carpet (walkable)
//    6 = stairs down (walkable + transition)
//    7 = window (solid)
//    8 = balcony rail (solid)
// ============================================================

const L2_TILE_SIZE = 48;

// 16 cols × 12 rows → 768 × 576 world px
const L2_MAP = [
  [2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2],
  [1,5,5,5,5,5,1,0,0,0,0,1,0,0,0,1],
  [1,5,5,5,5,5,1,0,0,0,0,1,0,0,0,7],
  [7,5,5,5,5,5,1,0,0,0,0,1,0,0,0,7],
  [7,5,5,5,5,5,1,0,0,0,0,1,0,0,0,1],
  [1,5,5,5,5,5,1,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,4,4,4,0,1,0,0,0,0,3,0,0,6,1],
  [1,0,4,4,4,0,1,0,0,0,0,1,0,0,6,1],
  [1,0,4,4,4,0,1,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2]
];

// Cheetah's locked room map (just the inside, offset to match rendering)
const L2_CHEETAH_MAP = [
  [2,1,1,1,2],
  [1,5,5,5,1],
  [1,5,5,5,7],
  [1,5,5,5,7],
  [1,5,5,5,1],
  [1,5,5,5,1],
  [1,5,5,5,1],
  [1,5,3,3,1],
  [1,5,5,5,1],
  [1,5,5,5,1],
  [1,5,5,5,1],
  [2,1,1,1,2]
];

const L2_SOLID = new Set([1, 2, 7, 8]);

const L2_TILE_STYLES = {
  0: { fill: '#e8d5b0' },
  1: { fill: '#8a6a4a', stroke: '#5a3a1a' },
  2: { fill: '#6a4a2a', stroke: '#3a1a0a' },
  3: { fill: '#d4b880' },
  4: { fill: '#d4eef7' },
  5: { fill: '#8060c0', stroke: '#6040a0' },
  6: { fill: '#c4a96a' },
  7: { fill: '#b8dff0' },
  8: { fill: '#8a6a4a', stroke: '#5a3a1a' }
};

// ─── Interactive objects on L2 ────────────────────────────
const L2_OBJECTS = [
  new HouseObject({ id: 'l2_bed',      type: 'bed',        x: 64,  y: 96,  label: 'Cat Bed',         width: 120, height: 96 }),
  new HouseObject({ id: 'l2_toy',      type: 'toy',        x: 144, y: 240, label: 'Feather Wand',    icon: '🪶' }),
  new HouseObject({ id: 'l2_window_b', type: 'window',     x: 0,   y: 144, label: 'Look Outside',    width: 48, height: 96 }),
  new HouseObject({ id: 'l2_stairs',   type: 'stairs',     x: 624, y: 318, label: 'Go Downstairs',   width: 80, height: 80 }),
  new HouseObject({ id: 'l2_toy2',     type: 'toy',        x: 384, y: 192, label: 'Crinkle Ball',    icon: '🎾' })
];

const L2_CHEETAH_OBJECTS = [
  new HouseObject({ id: 'l2_c_bed',    type: 'bed',        x: 64,  y: 64,  label: 'Cheetah Bed',     width: 80,  height: 80 }),
  new HouseObject({ id: 'l2_window_a', type: 'window',     x: 192, y: 96,  label: 'Look Outside',    width: 48,  height: 96 }),
  new HouseObject({ id: 'l2_c_food',   type: 'food_bowl',  x: 64,  y: 400, label: 'Food Bowl',       amount: 100 })
];

// ─── Renderer ─────────────────────────────────────────────
function renderL2(ctx, camX, camY, canvasW, canvasH, nearObjects, isCheetahRoom = false) {
  const ts = L2_TILE_SIZE;
  const map = isCheetahRoom ? L2_CHEETAH_MAP : L2_MAP;
  const startCol = Math.max(0, Math.floor(camX / ts));
  const startRow = Math.max(0, Math.floor(camY / ts));
  const endCol   = Math.min(map[0].length, Math.ceil((camX + canvasW) / ts));
  const endRow   = Math.min(map.length,    Math.ceil((camY + canvasH) / ts));

  // If rendering Cheetah room, offset it in world space to match L2 position
  // or render it standalone depending on logic. Let's render it standalone starting at 0,0 for simplicity,
  // since the restrictions map uses its own coordinate space.

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const tileId = map[row][col];
      const style  = L2_TILE_STYLES[tileId] || L2_TILE_STYLES[0];
      const dx = col * ts - camX;
      const dy = row * ts - camY;

      ctx.fillStyle = style.fill;
      ctx.fillRect(dx, dy, ts, ts);

      if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, ts, ts);
      }

      _drawL2TileDecoration(ctx, tileId, dx, dy, ts);
    }
  }

  const objects = isCheetahRoom ? L2_CHEETAH_OBJECTS : L2_OBJECTS;
  objects.forEach(obj => {
    const isNear = nearObjects && nearObjects.includes(obj);
    obj.render(ctx, camX, camY, isNear);
  });
}

function _drawL2TileDecoration(ctx, tileId, x, y, ts) {
  switch (tileId) {
    case 5: {  // carpet
      ctx.fillStyle = 'rgba(180,140,220,0.3)';
      ctx.fillRect(x + 4, y + 4, ts - 8, ts - 8);
      ctx.strokeStyle = 'rgba(120,80,180,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 8, y + 8, ts - 16, ts - 16);
      break;
    }
    case 4: {  // bathroom tile
      ctx.strokeStyle = 'rgba(160,200,220,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + ts / 2, y); ctx.lineTo(x + ts / 2, y + ts);
      ctx.moveTo(x, y + ts / 2); ctx.lineTo(x + ts, y + ts / 2);
      ctx.stroke();
      break;
    }
    case 0: {
      ctx.strokeStyle = 'rgba(180,140,80,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + ts / 3);   ctx.lineTo(x + ts, y + ts / 3);
      ctx.moveTo(x, y + ts * 2/3); ctx.lineTo(x + ts, y + ts * 2/3);
      ctx.stroke();
      break;
    }
    case 7: {
      ctx.fillStyle = 'rgba(180,220,255,0.4)';
      ctx.fillRect(x + 4, y + 4, ts - 8, ts - 8);
      ctx.strokeStyle = '#8ab8d8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, ts - 8, ts - 8);
      break;
    }
  }
}

function getL2Bounds() {
  return { minX: L2_TILE_SIZE, minY: L2_TILE_SIZE, maxX: L2_MAP[0].length * L2_TILE_SIZE - L2_TILE_SIZE, maxY: L2_MAP.length * L2_TILE_SIZE - L2_TILE_SIZE };
}

function getL2Size() {
  return { width: L2_MAP[0].length * L2_TILE_SIZE, height: L2_MAP.length * L2_TILE_SIZE };
}

function getL2CheetahBounds() {
  return { minX: L2_TILE_SIZE, minY: L2_TILE_SIZE, maxX: L2_CHEETAH_MAP[0].length * L2_TILE_SIZE - L2_TILE_SIZE, maxY: L2_CHEETAH_MAP.length * L2_TILE_SIZE - L2_TILE_SIZE };
}

function getL2CheetahSize() {
  return { width: L2_CHEETAH_MAP[0].length * L2_TILE_SIZE, height: L2_CHEETAH_MAP.length * L2_TILE_SIZE };
}
