// ============================================================
//  House-L1 — Ground floor (Kitchen + Living Room + Hallway)
//  Tile IDs:
//    0 = floor / walkable (wood)
//    1 = wall (solid)
//    2 = wall corner (solid)
//    3 = door opening (walkable + transition trigger)
//    4 = kitchen tile (walkable)
//    5 = rug (walkable)
//    6 = stairs (walkable + transition trigger)
//    7 = window space (solid)
// ============================================================

const L1_TILE_SIZE = 48;

// 16 cols × 13 rows → 768 × 624 world px
const L1_MAP = [
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,5,5,5,0,0,0,7],
  [1,0,4,4,0,0,1,0,0,5,5,5,0,0,0,7],
  [1,0,4,4,0,0,1,0,0,5,5,5,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [7,0,0,0,0,0,1,0,0,0,0,0,0,0,6,1],
  [7,0,0,0,0,0,1,0,0,0,0,0,0,0,6,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,1,1,1,3,3,3,1,1,1,1,1,1,1,1,2]
];

const L1_SOLID = new Set([1, 2, 7]);

const L1_TILE_STYLES = {
  0: { fill: '#d4a96e' },                         // wood floor
  1: { fill: '#7a5c3a', stroke: '#5a3c1a' },       // wall
  2: { fill: '#6a4c2a', stroke: '#4a2c0a' },       // corner
  3: { fill: '#c09060' },                          // door opening
  4: { fill: '#e0dfe0' },                          // kitchen tile
  5: { fill: '#b04040', stroke: '#8a2020' },       // rug
  6: { fill: '#c4a96a' },                          // stairs
  7: { fill: '#a0cce0' }                           // window
};

// ─── Interactive objects on L1 ────────────────────────────
const L1_OBJECTS = [
  new HouseObject({ id: 'l1_food',    type: 'food_bowl',  x: 96,  y: 144, label: 'Food Bowl',  amount: 100 }),
  new HouseObject({ id: 'l1_water',   type: 'water_bowl', x: 160, y: 144, label: 'Water Bowl' }),
  new HouseObject({ id: 'l1_litter',  type: 'litter_box', x: 64,  y: 336, label: 'Litter Box' }),
  new HouseObject({ id: 'l1_couch',   type: 'couch',      x: 384, y: 192, label: 'Couch',       width: 120, height: 56 }),
  new HouseObject({ id: 'l1_tv',      type: 'tv',         x: 384, y: 96,  label: 'TV',          width: 96, height: 56 }),
  new HouseObject({ id: 'l1_window',  type: 'window',     x: 672, y: 96,  label: 'Window',      width: 48, height: 96 }),
  new HouseObject({ id: 'l1_toy',     type: 'toy',        x: 288, y: 288, label: 'Yarn Ball',   icon: '🧶' }),
  new HouseObject({ id: 'l1_stairs',  type: 'stairs',     x: 624, y: 360, label: 'Go Upstairs', width: 80, height: 80 }),
  new HouseObject({ id: 'l1_door',    type: 'door',       x: 192, y: 528, label: 'Go Outside',  width: 96, height: 60 })
];

// ─── Renderer ─────────────────────────────────────────────
function renderL1(ctx, camX, camY, canvasW, canvasH, nearObjects) {
  const ts = L1_TILE_SIZE;
  const startCol = Math.max(0, Math.floor(camX / ts));
  const startRow = Math.max(0, Math.floor(camY / ts));
  const endCol   = Math.min(L1_MAP[0].length, Math.ceil((camX + canvasW) / ts));
  const endRow   = Math.min(L1_MAP.length,    Math.ceil((camY + canvasH) / ts));

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const tileId = L1_MAP[row][col];
      const style  = L1_TILE_STYLES[tileId] || L1_TILE_STYLES[0];
      const dx = col * ts - camX;
      const dy = row * ts - camY;

      ctx.fillStyle = style.fill;
      ctx.fillRect(dx, dy, ts, ts);

      if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, ts, ts);
      }

      _drawL1TileDecoration(ctx, tileId, dx, dy, ts);
    }
  }

  // Objects
  L1_OBJECTS.forEach(obj => {
    const isNear = nearObjects && nearObjects.includes(obj);
    obj.render(ctx, camX, camY, isNear);
  });
}

function _drawL1TileDecoration(ctx, tileId, x, y, ts) {
  switch (tileId) {
    case 5: {  // rug — decorative pattern
      ctx.fillStyle = 'rgba(180,60,60,0.5)';
      ctx.fillRect(x + 6, y + 6, ts - 12, 4);
      ctx.fillRect(x + 6, y + ts - 10, ts - 12, 4);
      break;
    }
    case 4: {  // kitchen tile — grid lines
      ctx.strokeStyle = 'rgba(200,200,200,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + ts / 2, y); ctx.lineTo(x + ts / 2, y + ts);
      ctx.moveTo(x, y + ts / 2); ctx.lineTo(x + ts, y + ts / 2);
      ctx.stroke();
      break;
    }
    case 0: {  // wood floor planks
      ctx.strokeStyle = 'rgba(160,110,50,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + ts / 3);   ctx.lineTo(x + ts, y + ts / 3);
      ctx.moveTo(x, y + ts * 2/3); ctx.lineTo(x + ts, y + ts * 2/3);
      ctx.stroke();
      break;
    }
    case 7: {  // window
      ctx.fillStyle = 'rgba(200,230,255,0.4)';
      ctx.fillRect(x + 4, y + 4, ts - 8, ts - 8);
      ctx.strokeStyle = '#8ab8d8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, ts - 8, ts - 8);
      break;
    }
  }
}

function getL1Bounds() {
  return { minX: L1_TILE_SIZE, minY: L1_TILE_SIZE, maxX: L1_MAP[0].length * L1_TILE_SIZE - L1_TILE_SIZE, maxY: L1_MAP.length * L1_TILE_SIZE - L1_TILE_SIZE };
}

function getL1Size() {
  return { width: L1_MAP[0].length * L1_TILE_SIZE, height: L1_MAP.length * L1_TILE_SIZE };
}
