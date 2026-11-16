// Invite links. Each game has its own site, so a link is just the game's
// address with the room code: "https://risca-palito.onrender.com/?code=ABCDE".
// Links shared while every game lived in the hub are ".../?game=<id>&code=ABCDE",
// and the oldest ones just "?code=ABCDE", which always meant Stick Slash; the
// hub reads those with readInvite() and sends the player to the right site.

export const LEGACY_GAME_ID = "stick-slash";

const CODE = /^[A-Z0-9]{5}$/;

// -> the room code in a query string, upper case, or null when there is none
// or it is not a valid code.
export function readCode(search) {
  const code = new URLSearchParams(search).get("code")?.trim().toUpperCase();
  return code && CODE.test(code) ? code : null;
}

// -> { gameId, code } or null when the URL carries no usable invite. Used by
// the hub for links from before each game had its own site.
export function readInvite(search, knownGameIds) {
  const code = readCode(search);
  if (!code) return null;
  const gameId = new URLSearchParams(search).get("game");
  if (gameId === null) return { gameId: LEGACY_GAME_ID, code };
  return knownGameIds.includes(gameId) ? { gameId, code } : null;
}

// The link to send: this site's address with only the room code.
export function inviteUrl(href, code) {
  const url = new URL(href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("code", code);
  return url.toString();
}

// The same URL without the invite code, so a refresh does not join again.
export function withoutCode(href) {
  const url = new URL(href);
  url.searchParams.delete("code");
  return url.toString();
}
