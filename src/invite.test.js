import { describe, test, expect } from "vitest";
import { readInvite, inviteUrl, withoutCode } from "./invite.js";

const GAMES = ["stick-slash"];

describe("readInvite", () => {
  test("reads a game and a code", () => {
    expect(readInvite("?game=stick-slash&code=K7Q2M", GAMES)).toEqual({ gameId: "stick-slash", code: "K7Q2M" });
  });

  test("an old link with only a code means Stick Slash", () => {
    expect(readInvite("?code=K7Q2M", GAMES)).toEqual({ gameId: "stick-slash", code: "K7Q2M" });
  });

  test("normalises the code to upper case and trims it", () => {
    expect(readInvite("?code=%20k7q2m%20", GAMES)?.code).toBe("K7Q2M");
  });

  test("ignores links without a usable code", () => {
    expect(readInvite("", GAMES)).toBeNull();
    expect(readInvite("?game=stick-slash", GAMES)).toBeNull();
    expect(readInvite("?code=ABC", GAMES)).toBeNull();
    expect(readInvite("?code=AB%3CD", GAMES)).toBeNull();
  });

  test("ignores a game the hub does not know", () => {
    expect(readInvite("?game=chess&code=K7Q2M", GAMES)).toBeNull();
  });
});

describe("inviteUrl / withoutCode", () => {
  test("builds a link with the game and the code, dropping anything else", () => {
    expect(inviteUrl("https://arcade.example/?game=stick-slash&x=1#top", "stick-slash", "K7Q2M")).toBe(
      "https://arcade.example/?game=stick-slash&code=K7Q2M"
    );
  });

  test("removes only the code", () => {
    expect(withoutCode("https://arcade.example/?game=stick-slash&code=K7Q2M")).toBe(
      "https://arcade.example/?game=stick-slash"
    );
  });
});
