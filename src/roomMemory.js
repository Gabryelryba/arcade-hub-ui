// The room this tab is in, so a game site can take its seat back after the page
// reloads (a phone that put the tab in the background often reloads it when the
// player comes back). Kept in sessionStorage, per tab, like the clientId the
// server knows the seat by (socket.js).
//
// Storage can be missing or throw (private mode, blocked storage): then nothing
// is remembered and recallRoom() answers null.

const STORAGE_KEY = "arcade-hub:room";

// The server holds a dropped seat in a waiting room for 3 minutes; after that
// the seat is gone and there is nothing to come back to.
export const ROOM_MEMORY_MS = 3 * 60 * 1000;

function storage() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

// `phase`: "lobby" (a seat the server holds and can hand back) or "playing" (a
// match, which cannot be resumed; remembered only to tell the player why they
// are back on the menu). Calling it again refreshes `at`.
export function rememberRoom({ code, gameId, phase = "lobby" }, now = Date.now()) {
  if (typeof code !== "string" || !code) return;
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify({ code, gameId: gameId ?? null, phase, at: now }));
  } catch {
    // Not remembered; a reload simply lands on the menu.
  }
}

// -> { code, gameId, phase, at } | null (nothing remembered, unreadable, or too old).
export function recallRoom(now = Date.now()) {
  let saved;
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    saved = raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
  if (!saved || typeof saved.code !== "string" || !saved.code || typeof saved.at !== "number") return null;
  if (now - saved.at > ROOM_MEMORY_MS || now < saved.at) return null;
  return { code: saved.code, gameId: saved.gameId ?? null, phase: saved.phase === "playing" ? "playing" : "lobby", at: saved.at };
}

export function forgetRoom() {
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to forget.
  }
}
