// ============================================================
//  cheetah-file-manager.js
//  Controls the Cheetah story arc state machine.
//  Phases:
//    'absent'    — Cheetah hasn't arrived yet
//    'arrived'   — Cheetah is in L2, first-meeting not yet triggered
//    'locked'    — After Button's hiss: Cheetah in her room, 3-day lockout
//    'friends'   — Lockout over, both cats coexist freely
// ============================================================

const CheetahFileManager = (() => {

  // ─── State ────────────────────────────────────────────────
  const STATE = {
    ABSENT:   'absent',
    ARRIVED:  'arrived',
    LOCKED:   'locked',
    FRIENDS:  'friends'
  };

  let _phase          = STATE.ABSENT;
  let _lockDaysLeft   = 3;      // decrements each game-day during LOCKED phase
  let _daysSinceStart = 0;      // tracks full days elapsed
  let _lastDayFloor   = 0;      // integer day number at last check
  let _cheetahNPC     = null;   // CatPlayer instance (NPC, not playable yet)
  let _cheetahPlayer  = null;   // second CatPlayer (created when FRIENDS)

  // Callbacks set by Game.html
  let _onArrived   = null;  // () → void
  let _onFirstMeet = null;  // () → void  (called right before meet cutscene)
  let _onUnlocked  = null;  // () → void
  let _getGameTime = null;  // () → minutes (0–1440)

  // ─── Public: register callbacks & tick ────────────────────

  /**
   * Call once from Game.html after startGame().
   * @param {{ onArrived, onFirstMeet, onUnlocked, getGameTime }} cbs
   */
  function init(cbs) {
    _onArrived   = cbs.onArrived;
    _onFirstMeet = cbs.onFirstMeet;
    _onUnlocked  = cbs.onUnlocked;
    _getGameTime = cbs.getGameTime;
    _lastDayFloor = 0;
    _phase = STATE.ABSENT;
  }

  /**
   * Called every game frame from Game.html.
   * @param {number} totalGameMinutes — cumulative game-time in minutes (can exceed 1440)
   */
  function tick(totalGameMinutes) {
    const currentDay = Math.floor(totalGameMinutes / (24 * 60));

    // Detect day rollover
    if (currentDay > _lastDayFloor) {
      _lastDayFloor = currentDay;
      _onDayRollover(currentDay);
    }

    // Phase-specific per-frame logic
    if (_phase === STATE.ARRIVED && _cheetahNPC) {
      _cheetahNPC.update(0.016); // NPC idles
    }
  }

  /**
   * Called every time a new game-day begins.
   */
  function _onDayRollover(day) {
    if (_phase === STATE.ABSENT && day >= 1) {
      // Cheetah arrives after the first day
      _phase = STATE.ARRIVED;
      _spawnCheetahNPC();
      if (_onArrived) _onArrived();
    }

    if (_phase === STATE.LOCKED) {
      _lockDaysLeft--;
      if (_lockDaysLeft <= 0) {
        _unlock();
      }
    }
  }

  // ─── Cheetah NPC spawn ────────────────────────────────────
  function _spawnCheetahNPC() {
    _cheetahNPC = new CatPlayer(CAT_PRESETS.cheetah);
    // Place Cheetah in L2 bedroom area (near the carpet)
    _cheetahNPC.x = 180;
    _cheetahNPC.y = 200;
    _cheetahNPC.isNPC = true;
    // Give her good starting stats
    _cheetahNPC.hunger    = 70;
    _cheetahNPC.energy    = 60;
    _cheetahNPC.happiness = 50; // a little nervous
  }

  // ─── First meeting trigger ────────────────────────────────
  /**
   * Called by Game.html when Button gets close to Cheetah NPC on L2
   * and the phase is still 'arrived'.
   * Returns true if this is the first (triggering) call.
   */
  function triggerFirstMeeting() {
    if (_phase !== STATE.ARRIVED) return false;
    _phase = STATE.LOCKED;
    _lockDaysLeft = 3;
    if (_onFirstMeet) _onFirstMeet();
    return true;
  }

  // ─── Unlock ───────────────────────────────────────────────
  function _unlock() {
    _phase = STATE.FRIENDS;
    // Promote NPC to playable second cat
    _cheetahPlayer = _cheetahNPC;
    _cheetahPlayer.isNPC = false;
    // Move her to the open bedroom
    _cheetahPlayer.x = 150;
    _cheetahPlayer.y = 150;
    _cheetahNPC = null;
    if (_onUnlocked) _onUnlocked();
  }

  // ─── Getters ──────────────────────────────────────────────
  function getPhase()         { return _phase; }
  function getCheetahNPC()    { return _cheetahNPC; }
  function getCheetahPlayer() { return _cheetahPlayer; }
  function getLockDaysLeft()  { return _lockDaysLeft; }

  function isCheetahVisible() {
    return _phase === STATE.ARRIVED || _phase === STATE.LOCKED || _phase === STATE.FRIENDS;
  }

  function isCheetahPlayable() {
    return _phase === STATE.FRIENDS && _cheetahPlayer !== null;
  }

  /** Cheetah can NEVER go to the yard */
  function canGoYard(catBreed) {
    return catBreed !== 'cheetah';
  }

  return {
    STATE,
    init,
    tick,
    triggerFirstMeeting,
    getPhase,
    getCheetahNPC,
    getCheetahPlayer,
    getLockDaysLeft,
    isCheetahVisible,
    isCheetahPlayable,
    canGoYard
  };
})();
