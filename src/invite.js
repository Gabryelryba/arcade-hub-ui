// Invite links: ".../?game=<id>&code=ABCDE". Links shared before the hub
// existed are just "?code=ABCDE" and always meant Stick Slash.

export const LEGACY_GAME_ID = "stick-slash";

const CODE = /^[A-Z0-9]{5}$/;

// -> { gameId, code } or null when the URL carries no usable invite.
export function readInvite(search, knownGameIds) {
  const params = new URLSearchParams(search);
  const code = params.get("code")?.trim().toUpperCase();
  if (!code || !CODE.test(code)) return null;
  const gameId = params.get("game");
  if (gameId === null) return { gameId: LEGACY_GAME_ID, code };
  return knownGameIds.includes(gameId) ? { gameId, code } : null;
}

export function inviteUrl(href, gameId, code) {
  const url = new URL(href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("game", gameId);
  url.searchParams.set("code", code);
  return url.toString();
}

// The same URL without the invite code, so a refresh does not join again.
export function withoutCode(href) {
  const url = new URL(href);
  url.searchParams.delete("code");
  return url.toString();
}
