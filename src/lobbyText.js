// Waiting-room wording shared by every game played from one (Dotz, Guess Word),
// for the screen and for the server's refusals.

import { t } from "./i18n/index.svelte.js";

// The same check the server runs before a start, from a `lobby` event.
// -> { ok: true } | { ok: false, reason: "too-few", missing } | { ok: false, reason: "not-ready", waitingFor }
export function startCheck(lobby, { minPlayers = 2 } = {}) {
  const missing = minPlayers - lobby.players.length;
  if (missing > 0) return { ok: false, reason: "too-few", missing };
  const waitingFor = lobby.players.filter((p) => !p.host && (!p.ready || !p.connected)).map((p) => p.name);
  if (waitingFor.length > 0) return { ok: false, reason: "not-ready", waitingFor };
  return { ok: true };
}

// Why Start is not available yet, for a check from startCheck or from the
// server's startRefused. Empty when nothing is missing.
export function startHint(check) {
  if (!check || check.ok) return "";
  if (check.reason === "too-few") return t("lobby.hints.tooFew", { count: check.missing });
  if (check.reason === "not-ready") {
    const names = check.waitingFor ?? [];
    if (names.length === 1) return t("lobby.hints.notReadyOne", { name: names[0] });
    if (names.length === 2) return t("lobby.hints.notReadyTwo", { a: names[0], b: names[1] });
    return t("lobby.hints.notReadyMany", { count: names.length });
  }
  if (check.reason === "not-host") return t("lobby.hints.notHost");
  return "";
}
