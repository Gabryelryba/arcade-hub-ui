// The player's display name. Asked once, kept in localStorage and shown to the
// other player. The server cleans it up again (playerName.js in the back end);
// this side only keeps the input sensible and remembers it.

import { t } from "./i18n/index.svelte.js";

export const MAX_NAME_LENGTH = 16;
const STORAGE_KEY = "arcade-hub:player-name";

// Control characters and invisible bidi overrides / zero-width spaces.
const INVISIBLE = /[\p{Cc}​‎‏‪-‮⁠⁦-⁩﻿]/gu;
const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

export function graphemeLength(text) {
  return Array.from(segmenter.segment(text)).length;
}

// The first letter (a whole grapheme, so "Émile" or an emoji stays intact), upper case; "?" for no name.
export function initialOf(name) {
  if (!name) return "?";
  return (Array.from(segmenter.segment(name))[0]?.segment ?? "?").toUpperCase();
}

// -> the name as it will be shown: trimmed, single spaces, no invisible characters.
export function cleanName(raw) {
  if (typeof raw !== "string") return "";
  return raw.replace(INVISIBLE, "").replace(/\s+/g, " ").trim();
}

// -> { ok: true, name } | { ok: false, error } with a message that says how to fix it.
export function validateName(raw) {
  const name = cleanName(raw);
  if (!name) return { ok: false, error: t("name.errors.empty") };
  if (graphemeLength(name) > MAX_NAME_LENGTH) {
    return { ok: false, error: t("name.errors.tooLong", { max: MAX_NAME_LENGTH }) };
  }
  return { ok: true, name };
}

// localStorage can be missing or throw (private mode, blocked storage). Then the
// name lives only in memory for this visit and the page keeps working.
let remembered = null;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function getName() {
  if (remembered) return remembered;
  try {
    const stored = storage()?.getItem(STORAGE_KEY);
    const check = validateName(stored ?? "");
    remembered = check.ok ? check.name : null;
  } catch {
    remembered = null;
  }
  return remembered;
}

// -> the saved name, or null if it was not valid.
export function setName(raw) {
  const check = validateName(raw);
  if (!check.ok) return null;
  remembered = check.name;
  try {
    storage()?.setItem(STORAGE_KEY, check.name);
  } catch {
    // Not persisted; still used for this visit.
  }
  return check.name;
}

// For tests: forget the in-memory copy.
export function resetForTests() {
  remembered = null;
}
