import { describe, test, expect } from "vitest";
import { readCode, inviteUrl, withoutCode } from "./invite.js";

describe("readCode", () => {
  test("reads the code, upper case and trimmed", () => {
    expect(readCode("?code=K7Q2M")).toBe("K7Q2M");
    expect(readCode("?code=%20k7q2m%20&ref=zap")).toBe("K7Q2M");
  });

  test("ignores links without a usable code", () => {
    expect(readCode("")).toBeNull();
    expect(readCode("?ref=zap")).toBeNull();
    expect(readCode("?code=ABC")).toBeNull();
    expect(readCode("?code=AB%3CD")).toBeNull();
  });
});

describe("inviteUrl / withoutCode", () => {
  test("builds a link to this site with only the code", () => {
    expect(inviteUrl("https://liga-pontos.onrender.com/?ref=zap&x=1#top", "K7Q2M")).toBe(
      "https://liga-pontos.onrender.com/?code=K7Q2M"
    );
  });

  test("removes only the code", () => {
    expect(withoutCode("https://liga-pontos.onrender.com/?code=K7Q2M&ref=zap")).toBe(
      "https://liga-pontos.onrender.com/?ref=zap"
    );
  });
});
