import { describe, test, expect } from "vitest";
import { DEFAULT_GAME_URLS, GAME_URLS, gameUrl, withOverrides } from "./gameUrls.js";

describe("GAME_URLS", () => {
  test("every game and the hub have an address", () => {
    expect(Object.keys(GAME_URLS).sort()).toEqual(["dotz", "guess-word", "hub", "stick-slash"]);
    expect(DEFAULT_GAME_URLS["stick-slash"]).toBe("https://risca-palito.onrender.com");
    expect(DEFAULT_GAME_URLS.dotz).toBe("https://liga-pontos.onrender.com");
    expect(DEFAULT_GAME_URLS["guess-word"]).toBe("https://adivinha-palavra.onrender.com");
    expect(DEFAULT_GAME_URLS.hub).toBe("https://recreio.onrender.com");
  });
});

describe("gameUrl", () => {
  test("a known game without code or language is just its address", () => {
    expect(gameUrl("dotz")).toBe("https://liga-pontos.onrender.com/");
  });

  test("carries the room code", () => {
    expect(gameUrl("stick-slash", "K7Q2M")).toBe("https://risca-palito.onrender.com/?code=K7Q2M");
  });

  test("carries the language, with or without a code", () => {
    expect(gameUrl("guess-word", "K7Q2M", "pt-BR")).toBe(
      "https://adivinha-palavra.onrender.com/?code=K7Q2M&lang=pt-BR"
    );
    expect(gameUrl("hub", null, "en")).toBe("https://recreio.onrender.com/?lang=en");
  });

  test("an unknown id has no address", () => {
    expect(gameUrl("chess", "K7Q2M")).toBeNull();
    expect(gameUrl("toString")).toBeNull();
    expect(gameUrl(null)).toBeNull();
  });
});

describe("withOverrides", () => {
  test("replaces only the ids given", () => {
    const urls = withOverrides('{"hub":"http://localhost:5173","dotz":"http://localhost:5175/"}');
    expect(urls.hub).toBe("http://localhost:5173");
    expect(urls.dotz).toBe("http://localhost:5175/");
    expect(urls["stick-slash"]).toBe(DEFAULT_GAME_URLS["stick-slash"]);
    expect(gameUrl("dotz", "K7Q2M", null, urls)).toBe("http://localhost:5175/?code=K7Q2M");
  });

  test("ignores a value that is not a JSON object, and addresses that are not http(s)", () => {
    expect(withOverrides("not json")).toEqual(DEFAULT_GAME_URLS);
    expect(withOverrides("[1,2]")).toEqual(DEFAULT_GAME_URLS);
    expect(withOverrides(undefined)).toEqual(DEFAULT_GAME_URLS);
    expect(withOverrides('{"hub":"javascript:alert(1)","dotz":42}')).toEqual(DEFAULT_GAME_URLS);
  });
});
