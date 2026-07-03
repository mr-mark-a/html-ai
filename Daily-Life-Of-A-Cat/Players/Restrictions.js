// ============================================================
//  Restrictions — Collision & door-transition logic
//  Extended for Cheetah story arc:
//    - lockedDoors set: blocks specific door transitions
//    - canGoOutside(breed): Cheetah can never go to the yard
// ============================================================

const Restrictions = (() => {

  // ─── Door definitions ────────────────────────────────────
  // Each door is a rectangle in world-pixel space for a given zone
  // and the destination { zone, spawnX, spawnY }
  const DOORS = {
    yard: [
      // Front door: enter the house (L1)
      { id: 'yard_to_l1', rect: { x: 320, y: 500, w: 120, h: 60 }, dest: { zone: 'l1', spawnX: 240, spawnY: 480 } }
    ],
    l1: [
      // Front door: go outside (yard)
      { id: 'l1_to_yard', rect: { x: 192, y: 550, w: 144, h: 80 }, dest: { zone: 'yard', spawnX: 360, spawnY: 450 } },
      // Stairs: go to L2
      { id: 'l1_to_l2',   rect: { x: 650, y: 384, w: 70, h: 96 }, dest: { zone: 'l2', spawnX: 600, spawnY: 360 } }
    ],
    l2: [
      // Stairs: go back to L1
      { id: 'l2_to_l1',        rect: { x: 650, y: 336, w: 70, h: 96 }, dest: { zone: 'l1', spawnX: 600, spawnY: 400 } },
      // Cheetah room door: normally open after FRIENDS phase
      { id: 'l2_to_cheetah_room', rect: { x: 500, y: 320, w: 60, h: 70 },  dest: { zone: 'l2_cheetah', spawnX: 140, spawnY: 336 } },
      // Alternate door to Cheetah room (lockable by scenario)
      { id: 'l2_to_cheetah_room_alt', rect: { x: 240, y: 320, w: 60, h: 70 }, dest: { zone: 'l2_cheetah', spawnX: 200, spawnY: 336 } }
    ],
    l2_cheetah: [
      // Exit Cheetah's room back to L2
      { id: 'cheetah_room_to_l2', rect: { x: 80, y: 320, w: 50, h: 70 }, dest: { zone: 'l2', spawnX: 470, spawnY: 336 } },
      // Alternate exit corresponding to the alternate L2 door
      { id: 'cheetah_room_to_l2_alt', rect: { x: 144, y: 320, w: 50, h: 70 }, dest: { zone: 'l2', spawnX: 240, spawnY: 336 } }
    ]
  };

  // ─── Locked door set ──────────────────────────────────────
  // Door IDs in this set are blocked for Button (not Cheetah)
  const _lockedForButton = new Set();

  /**
   * Lock a door by ID for Button.
   * @param {string} doorId
   */
  function lockDoor(doorId) {
    _lockedForButton.add(doorId);
  }

  /**
   * Unlock a door by ID.
   * @param {string} doorId
   */
  function unlockDoor(doorId) {
    _lockedForButton.delete(doorId);
  }

  // ─── Tile-based collision ─────────────────────────────────
  /**
   * Check whether the cat's AABB centre overlaps a solid tile
   * in the given tilemap.
   *
   * @param {number} px         — proposed player X
   * @param {number} py         — proposed player Y
   * @param {number} pw         — player width
   * @param {number} ph         — player height
   * @param {number[][]} tileMap — 2-D array of tile IDs
   * @param {number} tileSize   — px per tile
   * @param {Set<number>} solidTiles — set of solid tile IDs
   * @returns {boolean}
   */
  function isBlocked(px, py, pw, ph, tileMap, tileSize, solidTiles) {
    if (!tileMap || !solidTiles) return false;

    // Check four corners of the hitbox (shrunk slightly)
    const margin = 4;
    const points = [
      [px + margin,      py + ph * 0.6],
      [px + pw - margin, py + ph * 0.6],
      [px + margin,      py + ph + 2  ],
      [px + pw - margin, py + ph + 2  ]
    ];

    for (const [cx, cy] of points) {
      const col = Math.floor(cx / tileSize);
      const row = Math.floor(cy / tileSize);
      if (row < 0 || row >= tileMap.length || col < 0 || col >= tileMap[0].length) return true;
      if (solidTiles.has(tileMap[row][col])) return true;
    }
    return false;
  }

  // ─── Door transition check ────────────────────────────────
  /**
   * @param {number} px       — player X
   * @param {number} py       — player Y
   * @param {number} pw       — player width
   * @param {number} ph       — player height
   * @param {string} zone     — current zone key
   * @param {string} catBreed — 'button' | 'cheetah'
   * @returns {{ zone: string, spawnX: number, spawnY: number } | null}
   */
  function checkDoorTransition(px, py, pw, ph, zone, catBreed) {
    const doors = DOORS[zone];
    if (!doors) return null;

    const catLeft   = px + pw * 0.25;
    const catRight  = px + pw * 0.75;
    const catTop    = py + ph * 0.5;
    const catBottom = py + ph + 4;

    for (const door of doors) {
      const { x, y, w, h } = door.rect;
      if (catRight > x && catLeft < x + w && catBottom > y && catTop < y + h) {

        // Cheetah can never go to yard
        if (catBreed === 'cheetah' && door.dest.zone === 'yard') {
          return null;
        }

        // Door locked for Button?
        if (catBreed === 'button' && _lockedForButton.has(door.id)) {
          return null; // blocked — do nothing
        }

        return door.dest;
      }
    }
    return null;
  }

  /**
   * Convenience wrapper — builds the blocked-function for move()
   * @param {number[][]} tileMap
   * @param {number}     tileSize
   * @param {Set<number>} solidTiles
   * @param {number}     pw  — player width
   * @param {number}     ph  — player height
   * @returns {function(x, y): boolean}
   */
  function makeBlockedFn(tileMap, tileSize, solidTiles, pw, ph) {
    return (x, y) => isBlocked(x, y, pw, ph, tileMap, tileSize, solidTiles);
  }

  /**
   * Returns true if a cat of breed 'cheetah' should be allowed
   * to go outside. Always false — Cheetah stays inside.
   * @param {string} catBreed
   */
  function canGoOutside(catBreed) {
    return catBreed !== 'cheetah';
  }

  return { isBlocked, checkDoorTransition, makeBlockedFn, lockDoor, unlockDoor, canGoOutside };
})();
