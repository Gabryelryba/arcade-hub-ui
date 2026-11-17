// The join-with-code form on a game's landing page (GameLanding.svelte).

const CODE_LENGTH = 5;

// -> the code as the server expects it: trimmed and upper case.
export function normalizeCode(input) {
  return String(input ?? "").trim().toUpperCase();
}

// -> the i18n key of what is wrong with a typed code, or null when it can be sent.
export function joinCodeError(input) {
  return normalizeCode(input).length === CODE_LENGTH ? null : "common.roomCodeLength";
}
