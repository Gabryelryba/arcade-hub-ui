import { describe, test, expect, afterEach } from "vitest";
import {
  detectLanguage,
  languageFromSearch,
  setLanguage,
  currentLanguage,
  t,
  joinNames,
  serverMessage,
  registerMessages,
  dictionaryEntries,
} from "./index.svelte.js";
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

describe("languageFromSearch", () => {
  test("reads a known language from ?lang=", () => {
    expect(languageFromSearch("?lang=pt-BR")).toBe("pt-BR");
    expect(languageFromSearch("?code=K7Q2M&lang=en")).toBe("en");
  });

  test("ignores a missing or unknown language", () => {
    expect(languageFromSearch("")).toBeNull();
    expect(languageFromSearch(undefined)).toBeNull();
    expect(languageFromSearch("?lang=fr")).toBeNull();
    expect(languageFromSearch("?lang=pt")).toBeNull();
  });
});

describe("t", () => {
  test("follows the language chosen", () => {
    setLanguage("pt-BR");
    expect(currentLanguage()).toBe("pt-BR");
    expect(t("lobby.start")).toBe("Iniciar Partida");
    setLanguage("en");
    expect(t("lobby.start")).toBe("Start Match");
  });

  test("an unknown language is ignored", () => {
    setLanguage("fr");
    expect(currentLanguage()).toBe("en");
  });

  test("fills placeholders and leaves unknown ones visible", () => {
    expect(t("common.joiningRoom", { code: "K7Q2M" })).toBe("Joining room K7Q2M…");
    expect(t("common.joiningRoom")).toBe("Joining room {code}…");
  });

  test("picks the plural form by count", () => {
    expect(t("lobby.hints.tooFew", { count: 1 })).toBe("Waiting for 1 more player");
    expect(t("lobby.hints.tooFew", { count: 2 })).toBe("Waiting for 2 more players");
    setLanguage("pt-BR");
    expect(t("lobby.hints.tooFew", { count: 1 })).toBe("Falta 1 jogador");
    expect(t("lobby.hints.tooFew", { count: 3 })).toBe("Faltam 3 jogadores");
  });

  test("a missing key shows the key", () => {
    expect(t("nope.missing")).toBe("nope.missing");
  });
});

describe("registerMessages", () => {
  test("adds a site's own texts in each language", () => {
    registerMessages({
      en: { testSite: { title: "Test Site", boxes: { one: "{count} box", other: "{count} boxes" } } },
      "pt-BR": { testSite: { title: "Site de Teste", boxes: { one: "{count} quadrado", other: "{count} quadrados" } } },
    });
    expect(t("testSite.title")).toBe("Test Site");
    expect(t("testSite.boxes", { count: 1 })).toBe("1 box");
    setLanguage("pt-BR");
    expect(t("testSite.title")).toBe("Site de Teste");
    expect(t("testSite.boxes", { count: 0 })).toBe("0 quadrados");
  });

  test("replaces a shared text without touching its neighbours", () => {
    registerMessages({ en: { common: { playAgain: "Rematch" } } });
    expect(t("common.playAgain")).toBe("Rematch");
    expect(t("common.cancel")).toBe("Cancel");
    expect(en.common.playAgain).toBe("Play Again");
    registerMessages({ en: { common: { playAgain: en.common.playAgain } } });
  });

  test("a text only given in English shows in English for pt-BR too", () => {
    registerMessages({ en: { testSite: { onlyEnglish: "Only English" } } });
    setLanguage("pt-BR");
    expect(t("testSite.onlyEnglish")).toBe("Only English");
  });

  test("ignores languages it does not know", () => {
    registerMessages({ fr: { common: { cancel: "Annuler" } } });
    expect(t("common.cancel")).toBe("Cancel");
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

// Every shared text exists in both languages, with the same placeholders and plural forms.
describe("the dictionaries match", () => {
  const placeholders = (value) =>
    [...new Set(JSON.stringify(value).match(/\{\w+\}/g) ?? [])].sort().join(",");

  const enEntries = Object.fromEntries(dictionaryEntries(en));
  const ptEntries = Object.fromEntries(dictionaryEntries(ptBR));

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
