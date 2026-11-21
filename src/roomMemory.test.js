import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { rememberRoom, recallRoom, forgetRoom, ROOM_MEMORY_MS } from "./roomMemory.js";

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

describe("roomMemory", () => {
  let original;
  beforeEach(() => {
    original = globalThis.sessionStorage;
  });
  afterEach(() => {
    globalThis.sessionStorage = original;
  });

  test("remembers a room, recalls it and forgets it", () => {
    const store = fakeStorage();
    globalThis.sessionStorage = store;
    expect(recallRoom(1_000)).toBeNull();
    rememberRoom({ code: "KS365", gameId: "guess-word" }, 1_000);
    expect(recallRoom(2_000)).toEqual({ code: "KS365", gameId: "guess-word", phase: "lobby", at: 1_000 });
    expect(Object.keys(store.data)).toEqual(["arcade-hub:room"]);
    forgetRoom();
    expect(recallRoom(2_000)).toBeNull();
  });

  test("a newer room replaces the older one", () => {
    globalThis.sessionStorage = fakeStorage();
    rememberRoom({ code: "AAAAA", gameId: "guess-word" }, 1_000);
    rememberRoom({ code: "BBBBB", gameId: "guess-word" }, 5_000);
    expect(recallRoom(6_000).code).toBe("BBBBB");
  });

  test("remembers whether the room was in a match, and refreshes the time", () => {
    globalThis.sessionStorage = fakeStorage();
    rememberRoom({ code: "KS365", gameId: "guess-word" }, 1_000);
    rememberRoom({ code: "KS365", gameId: "guess-word", phase: "playing" }, 4_000);
    expect(recallRoom(5_000)).toEqual({ code: "KS365", gameId: "guess-word", phase: "playing", at: 4_000 });
  });

  test("a room older than the server's 3-minute hold is dropped", () => {
    globalThis.sessionStorage = fakeStorage();
    rememberRoom({ code: "KS365" }, 0);
    expect(recallRoom(ROOM_MEMORY_MS).code).toBe("KS365");
    expect(recallRoom(ROOM_MEMORY_MS + 1)).toBeNull();
  });

  test("a time from the future (clock changed) is not trusted", () => {
    globalThis.sessionStorage = fakeStorage();
    rememberRoom({ code: "KS365" }, 10_000);
    expect(recallRoom(5_000)).toBeNull();
  });

  test("ignores a broken value in storage", () => {
    globalThis.sessionStorage = fakeStorage({ "arcade-hub:room": "{not json" });
    expect(recallRoom()).toBeNull();
    globalThis.sessionStorage = fakeStorage({ "arcade-hub:room": JSON.stringify({ code: 5, at: 1 }) });
    expect(recallRoom(2)).toBeNull();
  });

  test("an empty code is not remembered", () => {
    const store = fakeStorage();
    globalThis.sessionStorage = store;
    rememberRoom({ code: "" });
    rememberRoom({});
    expect(store.data).toEqual({});
  });

  test("keeps working when storage throws (private mode)", () => {
    const blocked = () => {
      throw new Error("blocked");
    };
    globalThis.sessionStorage = { getItem: blocked, setItem: blocked, removeItem: blocked };
    expect(() => rememberRoom({ code: "KS365" })).not.toThrow();
    expect(recallRoom()).toBeNull();
    expect(() => forgetRoom()).not.toThrow();
  });

  test("keeps working when there is no storage at all", () => {
    globalThis.sessionStorage = undefined;
    rememberRoom({ code: "KS365" });
    expect(recallRoom()).toBeNull();
    forgetRoom();
  });
});
