import { describe, test, expect } from "vitest";
import { readCode, readInvite, inviteUrl, withoutCode } from "./invite.js";

const GAMES = ["stick-slash", "dotz"];

describe("readCode", () => {
  test("reads the code, upper case and trimmed", () => {
    expect(readCode("?code=K7Q2M")).toBe("K7Q2M");
    expect(readCode("?code=%20k7q2m%20&lang=en")).toBe("K7Q2M");
  });

  test("ignores links without a usable code", () => {
    expect(readCode("")).toBeNull();
    expect(readCode("?lang=en")).toBeNull();
    expect(readCode("?code=ABC")).toBeNull();
    expect(readCode("?code=AB%3CD")).toBeNull();
  });
});

describe("readInvite (links from the hub era)", () => {
  test("reads a game and a code", () => {
    expect(readInvite("?game=dotz&code=K7Q2M", GAMES)).toEqual({ gameId: "dotz", code: "K7Q2M" });
  });

  test("an old link with only a code means Stick Slash", () => {
    expect(readInvite("?code=K7Q2M", GAMES)).toEqual({ gameId: "stick-slash", code: "K7Q2M" });
  });

  test("ignores links without a usable code", () => {
    expect(readInvite("", GAMES)).toBeNull();
    expect(readInvite("?game=stick-slash", GAMES)).toBeNull();
    expect(readInvite("?code=ABC", GAMES)).toBeNull();
  });

  test("ignores a game it does not know", () => {
    expect(readInvite("?game=chess&code=K7Q2M", GAMES)).toBeNull();
  });
});

describe("inviteUrl / withoutCode", () => {
  test("builds a link to this site with only the code", () => {
    expect(inviteUrl("https://liga-pontos.onrender.com/?lang=pt-BR&x=1#top", "K7Q2M")).toBe(
      "https://liga-pontos.onrender.com/?code=K7Q2M"
    );
  });

  test("removes only the code", () => {
    expect(withoutCode("https://liga-pontos.onrender.com/?code=K7Q2M&lang=en")).toBe(
      "https://liga-pontos.onrender.com/?lang=en"
    );
  });
});
