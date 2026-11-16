import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { getName, setName, validateName, cleanName, initialOf, resetForTests } from "./player.js";

test("initialOf takes the first whole letter", () => {
  expect(initialOf("émile")).toBe("É");
  expect(initialOf("👩🏽‍🚀 Ana")).toBe("👩🏽‍🚀");
  expect(initialOf("")).toBe("?");
  expect(initialOf(null)).toBe("?");
});

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

describe("validateName", () => {
  test("accepts a normal name and tidies spaces", () => {
    expect(validateName("  Ana   Clara ")).toEqual({ ok: true, name: "Ana Clara" });
  });

  test("rejects an empty or blank name with a hint", () => {
    expect(validateName("").ok).toBe(false);
    expect(validateName("   ").error).toMatch(/Type a name/);
  });

  test("rejects names longer than 16 characters, counting an emoji as one", () => {
    expect(validateName("Bartholomew Quill").ok).toBe(false);
    expect(validateName("Rafa \u{1F468}‍\u{1F469}‍\u{1F467}").ok).toBe(true);
    expect(validateName("a".repeat(15) + "\u{1F600}").ok).toBe(true);
  });

  test("drops invisible characters", () => {
    expect(cleanName("Lu​cas‮")).toBe("Lucas");
  });
});

describe("getName / setName", () => {
  let original;
  beforeEach(() => {
    original = globalThis.localStorage;
    resetForTests();
  });
  afterEach(() => {
    globalThis.localStorage = original;
    resetForTests();
  });

  test("returns null when nothing was saved", () => {
    globalThis.localStorage = fakeStorage();
    expect(getName()).toBeNull();
  });

  test("saves a valid name and reads it back after a reload", () => {
    const store = fakeStorage();
    globalThis.localStorage = store;
    expect(setName(" Iara ")).toBe("Iara");
    resetForTests(); // like a new page load
    expect(getName()).toBe("Iara");
    expect(Object.values(store.data)).toEqual(["Iara"]);
  });

  test("refuses to save an invalid name", () => {
    globalThis.localStorage = fakeStorage();
    expect(setName("   ")).toBeNull();
    expect(getName()).toBeNull();
  });

  test("ignores a broken value found in storage", () => {
    globalThis.localStorage = fakeStorage({ "arcade-hub:player-name": "x".repeat(40) });
    expect(getName()).toBeNull();
  });

  test("keeps working when storage throws (private mode)", () => {
    globalThis.localStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(getName()).toBeNull();
    expect(setName("Caetano")).toBe("Caetano");
    expect(getName()).toBe("Caetano");
  });

  test("keeps working when there is no storage at all", () => {
    globalThis.localStorage = undefined;
    expect(setName("Lívia")).toBe("Lívia");
    expect(getName()).toBe("Lívia");
  });
});
