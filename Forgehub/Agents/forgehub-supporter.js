/**
 * ForgeHub Supporter
 * Workspace lifecycle manager — load, unload, export, and restore IDE sessions.
 * Import this module in Forgehub.html to access workspace control utilities.
 */

// ─── Storage Key Namespace ───────────────────────────────────────────────────
const KEYS = {
  VFS:          'ForgeHub_VFS',
  CHAT:         'ForgeHub_ChatHistories',
  TOKENS:       'ForgeHub_Tokens',
  GEMINI_KEY:   'ForgeHub_GeminiKey',
  GEMINI_MODEL: 'ForgeHub_GeminiModel',
  IZT_KEY:      'ForgeHub_IztKey',
};

// ─── Unload ───────────────────────────────────────────────────────────────────
/**
 * Unloads the ForgeHub workspace by wiping all localStorage entries and
 * reloading the page so the IDE starts fresh.
 *
 * @param {boolean} [keepKeys=false] - If true, API keys are preserved.
 */
export function unloadForgeHub(keepKeys = false) {
  const preserved = {};

  if (keepKeys) {
    preserved[KEYS.GEMINI_KEY]   = localStorage.getItem(KEYS.GEMINI_KEY);
    preserved[KEYS.GEMINI_MODEL] = localStorage.getItem(KEYS.GEMINI_MODEL);
    preserved[KEYS.IZT_KEY]      = localStorage.getItem(KEYS.IZT_KEY);
  }

  // Wipe every ForgeHub entry
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));

  // Restore keys if requested
  if (keepKeys) {
    Object.entries(preserved).forEach(([k, v]) => {
      if (v !== null) localStorage.setItem(k, v);
    });
  }

  console.log('[ForgeHub Supporter] Workspace unloaded. Reloading...');
  window.location.reload();
}

// ─── Save Snapshot ────────────────────────────────────────────────────────────
/**
 * Exports the current VFS + chat history as a downloadable JSON snapshot file.
 */
export function saveSnapshot() {
  const snapshot = {
    version:   '1.0.0',
    savedAt:   new Date().toISOString(),
    vfs:       JSON.parse(localStorage.getItem(KEYS.VFS)   || '{}'),
    chat:      JSON.parse(localStorage.getItem(KEYS.CHAT)  || '{}'),
    tokens:    parseInt(localStorage.getItem(KEYS.TOKENS)  || '100'),
    geminiModel: localStorage.getItem(KEYS.GEMINI_MODEL) || 'gemini-2.5-flash',
  };

  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `forgehub-snapshot-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('[ForgeHub Supporter] Snapshot exported.');
}

// ─── Load Snapshot ────────────────────────────────────────────────────────────
/**
 * Reads a JSON snapshot file chosen by the user and restores VFS + chat
 * history into localStorage, then reloads the page.
 */
export function loadSnapshot() {
  const input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.json';

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const snapshot = JSON.parse(ev.target.result);

        if (snapshot.vfs)  localStorage.setItem(KEYS.VFS,          JSON.stringify(snapshot.vfs));
        if (snapshot.chat) localStorage.setItem(KEYS.CHAT,         JSON.stringify(snapshot.chat));
        if (snapshot.tokens !== undefined) localStorage.setItem(KEYS.TOKENS, String(snapshot.tokens));
        if (snapshot.geminiModel) localStorage.setItem(KEYS.GEMINI_MODEL, snapshot.geminiModel);

        console.log('[ForgeHub Supporter] Snapshot loaded. Reloading workspace...');
        window.location.reload();
      } catch (err) {
        alert('Failed to load snapshot: ' + err.message);
        console.error('[ForgeHub Supporter] Snapshot parse error:', err);
      }
    };
    reader.readAsText(file);
  });

  input.click();
}

// ─── Clear Chat Only ──────────────────────────────────────────────────────────
/**
 * Clears only the chat history without touching the VFS or keys.
 */
export function clearChatHistory() {
  localStorage.removeItem(KEYS.CHAT);
  console.log('[ForgeHub Supporter] Chat history cleared.');
}

// ─── Reset Tokens ─────────────────────────────────────────────────────────────
/**
 * Resets token count back to the default (100).
 */
export function resetTokens(amount = 100) {
  localStorage.setItem(KEYS.TOKENS, String(amount));
  console.log(`[ForgeHub Supporter] Tokens reset to ${amount}.`);
}

// ─── Status Report ────────────────────────────────────────────────────────────
/**
 * Returns a summary object describing the current workspace state.
 */
export function getWorkspaceStatus() {
  const vfs    = JSON.parse(localStorage.getItem(KEYS.VFS)  || '{}');
  const chat   = JSON.parse(localStorage.getItem(KEYS.CHAT) || '{}');
  const tokens = parseInt(localStorage.getItem(KEYS.TOKENS) || '100');

  return {
    fileCount:      Object.keys(vfs).length,
    iztMessages:    (chat.izt    || []).length,
    geminiMessages: (chat.gemini || []).length,
    tokens,
    geminiModel:    localStorage.getItem(KEYS.GEMINI_MODEL) || 'gemini-2.5-flash',
    hasIztKey:      !!localStorage.getItem(KEYS.IZT_KEY),
    hasGeminiKey:   !!localStorage.getItem(KEYS.GEMINI_KEY),
  };
}
