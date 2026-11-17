// Invite links. Each game is a site of its own, so a link is just the game's
// address with the room code: "https://risca-palito.onrender.com/?code=ABCDE".
// A site only knows its own game: a code from another game's room is answered
// by the server as a room that does not exist.

const CODE = /^[A-Z0-9]{5}$/;

// -> the room code in a query string, upper case, or null when there is none
// or it is not a valid code.
export function readCode(search) {
  const code = new URLSearchParams(search).get("code")?.trim().toUpperCase();
  return code && CODE.test(code) ? code : null;
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
