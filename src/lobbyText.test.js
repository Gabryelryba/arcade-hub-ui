import { describe, test, expect, afterEach } from "vitest";
import { startCheck, startHint } from "./lobbyText.js";
import { setLanguage } from "./i18n/index.svelte.js";

afterEach(() => setLanguage("en"));

test("in Portuguese", () => {
  setLanguage("pt-BR");
  expect(startHint({ ok: false, reason: "too-few", missing: 1 })).toBe("Falta 1 jogador");
  expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["Bia", "Rui"] })).toBe(
    "Esperando Bia e Rui ficarem prontos"
  );
});

const player = (name, extra = {}) => ({ name, ready: false, host: false, connected: true, ...extra });

describe("startCheck", () => {
  test("alone: one more player needed", () => {
    expect(startCheck({ players: [player("Iara", { host: true, ready: true })] })).toEqual({
      ok: false,
      reason: "too-few",
      missing: 1,
    });
  });

  test("the game's minimum counts", () => {
    const lobby = { players: [player("Iara", { host: true }), player("Caetano", { ready: true })] };
    expect(startCheck(lobby, { minPlayers: 3 })).toEqual({ ok: false, reason: "too-few", missing: 1 });
    expect(startCheck(lobby, { minPlayers: 2 })).toEqual({ ok: true });
  });

  test("guests not ready or away are waited for; the host never is", () => {
    const lobby = {
      players: [
        player("Iara", { host: true, ready: true }),
        player("Caetano", { ready: true }),
        player("Lívia"),
        player("Bento", { ready: true, connected: false }),
      ],
    };
    expect(startCheck(lobby)).toEqual({ ok: false, reason: "not-ready", waitingFor: ["Lívia", "Bento"] });
  });

  test("everyone ready", () => {
    expect(startCheck({ players: [player("Iara", { host: true }), player("Caetano", { ready: true })] })).toEqual({
      ok: true,
    });
  });
});

describe("startHint", () => {
  test("says what is missing", () => {
    expect(startHint({ ok: false, reason: "too-few", missing: 1 })).toBe("Waiting for 1 more player");
    expect(startHint({ ok: false, reason: "too-few", missing: 2 })).toBe("Waiting for 2 more players");
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["Bia"] })).toBe("Waiting for Bia to get ready");
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["Bia", "Rui"] })).toBe(
      "Waiting for Bia and Rui to get ready"
    );
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["A", "B", "C"] })).toBe(
      "Waiting for 3 players to get ready"
    );
    expect(startHint({ ok: false, reason: "not-host" })).toBe("Only the host can start");
  });

  test("nothing when ready", () => {
    expect(startHint({ ok: true })).toBe("");
    expect(startHint(null)).toBe("");
  });
});
