import { describe, test, expect } from "vitest";
import { startCheck, startHint } from "./lobbyText.js";
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

  test("more players than the room's limit: the server's, else the game's", () => {
    const lobby = { players: [player("Iara", { host: true }), player("Caetano", { ready: true }), player("Lívia", { ready: true })] };
    expect(startCheck(lobby, { maxPlayers: 5 })).toEqual({ ok: true });
    expect(startCheck(lobby, { maxPlayers: 2 })).toEqual({ ok: false, reason: "too-many", maxPlayers: 2 });
    expect(startCheck({ ...lobby, maxPlayers: 2 }, { maxPlayers: 5 })).toEqual({ ok: false, reason: "too-many", maxPlayers: 2 });
  });

  test("everyone ready", () => {
    expect(startCheck({ players: [player("Iara", { host: true }), player("Caetano", { ready: true })] })).toEqual({
      ok: true,
    });
  });
});

describe("startHint", () => {
  test("says what is missing", () => {
    expect(startHint({ ok: false, reason: "too-few", missing: 1 })).toBe("Falta 1 jogador");
    expect(startHint({ ok: false, reason: "too-few", missing: 2 })).toBe("Faltam 2 jogadores");
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["Bia"] })).toBe("Esperando Bia ficar pronto");
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["Bia", "Rui"] })).toBe(
      "Esperando Bia e Rui ficarem prontos"
    );
    expect(startHint({ ok: false, reason: "not-ready", waitingFor: ["A", "B", "C"] })).toBe(
      "Esperando 3 jogadores ficarem prontos"
    );
    expect(startHint({ ok: false, reason: "not-host" })).toBe("Só o anfitrião pode iniciar");
    expect(startHint({ ok: false, reason: "too-many", maxPlayers: 2 })).toBe("Só 2 jogadores neste modo: alguém precisa sair");
  });

  test("nothing when ready", () => {
    expect(startHint({ ok: true })).toBe("");
    expect(startHint(null)).toBe("");
  });
});
