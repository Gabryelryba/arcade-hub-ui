import { describe, test, expect, afterEach } from "vitest";
import { detectLanguage, setLanguage, currentLanguage, t, joinNames, serverMessage } from "./index.svelte.js";
import en from "./en.js";
import ptBR from "./pt-BR.js";

afterEach(() => setLanguage("en"));

describe("detectLanguage", () => {
  test("any Portuguese first means pt-BR", () => {
    expect(detectLanguage(["pt-BR", "en"])).toBe("pt-BR");
    expect(detectLanguage(["pt-PT"])).toBe("pt-BR");
    expect(detectLanguage(["PT"])).toBe("pt-BR");
  });

  test("everything else is English, including Portuguese only as a second choice", () => {
    expect(detectLanguage(["en-US", "pt-BR"])).toBe("en");
    expect(detectLanguage(["es"])).toBe("en");
    expect(detectLanguage([])).toBe("en");
    expect(detectLanguage(undefined)).toBe("en");
  });
});

describe("t", () => {
  test("follows the language chosen", () => {
    setLanguage("pt-BR");
    expect(currentLanguage()).toBe("pt-BR");
    expect(t("hub.title")).toBe("Escolha um Jogo");
    setLanguage("en");
    expect(t("hub.title")).toBe("Pick a Game");
  });

  test("game names: English in English, Portuguese in pt-BR", () => {
    expect(t("games.stick-slash.name")).toBe("Stick Slash");
    expect(t("games.dotz.name")).toBe("Dotz");
    setLanguage("pt-BR");
    expect(t("games.stick-slash.name")).toBe("Risca Palito");
    expect(t("games.dotz.name")).toBe("Liga Pontos");
  });

  test("an unknown language is ignored", () => {
    setLanguage("fr");
    expect(currentLanguage()).toBe("en");
  });

  test("fills placeholders and leaves unknown ones visible", () => {
    expect(t("hub.play", { name: "Dotz" })).toBe("Play Dotz");
    expect(t("hub.play")).toBe("Play {name}");
  });

  test("picks the plural form by count", () => {
    expect(t("lobby.hints.tooFew", { count: 1 })).toBe("Waiting for 1 more player");
    expect(t("lobby.hints.tooFew", { count: 2 })).toBe("Waiting for 2 more players");
    setLanguage("pt-BR");
    expect(t("lobby.hints.tooFew", { count: 1 })).toBe("Falta 1 jogador");
    expect(t("lobby.hints.tooFew", { count: 3 })).toBe("Faltam 3 jogadores");
    expect(t("dotz.scoreboard.boxes", { count: 0 })).toBe("0 quadrados");
  });

  test("a missing key shows the key", () => {
    expect(t("nope.missing")).toBe("nope.missing");
  });
});

test("joinNames uses the language's own list", () => {
  expect(joinNames(["Ana", "Rui"])).toBe("Ana and Rui");
  setLanguage("pt-BR");
  expect(joinNames(["Ana", "Rui", "Bia"])).toBe("Ana, Rui e Bia");
});

describe("serverMessage", () => {
  test("translates a known code", () => {
    setLanguage("pt-BR");
    expect(serverMessage("move", { code: "not-your-turn", error: "Not your turn" })).toBe("Não é a sua vez");
  });

  test("falls back to the server's text for an unknown or missing code", () => {
    expect(serverMessage("move", { code: "brand-new", error: "Something new" })).toBe("Something new");
    expect(serverMessage("join", { error: "Room not found" })).toBe("Room not found");
    expect(serverMessage("join")).toBe("");
  });
});

// Every text exists in both languages, with the same placeholders and plural forms.
describe("the dictionaries match", () => {
  function entries(node, prefix = "") {
    return Object.entries(node).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const isPlural = value && typeof value === "object" && "other" in value;
      return value && typeof value === "object" && !isPlural ? entries(value, path) : [[path, value]];
    });
  }
  const placeholders = (value) =>
    [...new Set(JSON.stringify(value).match(/\{\w+\}/g) ?? [])].sort().join(",");

  const enEntries = Object.fromEntries(entries(en));
  const ptEntries = Object.fromEntries(entries(ptBR));

  test("same keys", () => {
    expect(Object.keys(ptEntries).sort()).toEqual(Object.keys(enEntries).sort());
  });

  test("same placeholders and plural shape", () => {
    for (const [key, value] of Object.entries(enEntries)) {
      expect(placeholders(ptEntries[key]), key).toBe(placeholders(value));
      expect(typeof ptEntries[key], key).toBe(typeof value);
    }
  });
});
