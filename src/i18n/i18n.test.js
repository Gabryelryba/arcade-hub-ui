import { describe, test, expect } from "vitest";
import { t, tList, joinNames, serverMessage, registerMessages } from "./index.svelte.js";
import ptBR from "./pt-BR.js";

describe("t", () => {
  test("looks a text up by its dotted key", () => {
    expect(t("lobby.start")).toBe("Iniciar Partida");
  });

  test("fills placeholders and leaves unknown ones visible", () => {
    expect(t("common.joiningRoom", { code: "K7Q2M" })).toBe("Entrando na sala K7Q2M…");
    expect(t("common.joiningRoom")).toBe("Entrando na sala {code}…");
  });

  test("picks the plural form by count", () => {
    expect(t("lobby.hints.tooFew", { count: 1 })).toBe("Falta 1 jogador");
    expect(t("lobby.hints.tooFew", { count: 3 })).toBe("Faltam 3 jogadores");
  });

  test("a missing key shows the key", () => {
    expect(t("nope.missing")).toBe("nope.missing");
  });
});

describe("registerMessages", () => {
  test("adds a site's own texts", () => {
    registerMessages({ testSite: { title: "Site de Teste", boxes: { one: "{count} quadrado", other: "{count} quadrados" } } });
    expect(t("testSite.title")).toBe("Site de Teste");
    expect(t("testSite.boxes", { count: 1 })).toBe("1 quadrado");
    expect(t("testSite.boxes", { count: 0 })).toBe("0 quadrados");
  });

  test("replaces a shared text without touching its neighbours", () => {
    registerMessages({ common: { playAgain: "Revanche" } });
    expect(t("common.playAgain")).toBe("Revanche");
    expect(t("common.cancel")).toBe("Cancelar");
    expect(ptBR.common.playAgain).not.toBe("Revanche");
    registerMessages({ common: { playAgain: ptBR.common.playAgain } });
  });

  test("ignores anything that is not a dictionary", () => {
    registerMessages(null);
    registerMessages(["x"]);
    expect(t("common.cancel")).toBe("Cancelar");
  });
});

test("joinNames lists names the Portuguese way", () => {
  expect(joinNames(["Ana", "Rui"])).toBe("Ana e Rui");
  expect(joinNames(["Ana", "Rui", "Bia"])).toBe("Ana, Rui e Bia");
});

describe("tList", () => {
  test("a list kept whole", () => {
    registerMessages({ demo: { steps: [{ title: "Um", text: "Primeiro" }] } });
    expect(tList("demo.steps")).toEqual([{ title: "Um", text: "Primeiro" }]);
  });

  test("an empty list for a key that is not a list", () => {
    expect(tList("lobby.start")).toEqual([]);
    expect(tList("nothing.here")).toEqual([]);
  });
});

describe("serverMessage", () => {
  test("translates a known code", () => {
    expect(serverMessage("move", { code: "not-your-turn", error: "Not your turn" })).toBe("Não é a sua vez");
  });

  test("never shows the server's English text: a general message instead", () => {
    const general = t("errors.unknown");
    expect(general).not.toBe("errors.unknown");
    expect(serverMessage("move", { code: "brand-new", error: "Something new" })).toBe(general);
    expect(serverMessage("join", { error: "Room not found" })).toBe(general);
    expect(serverMessage("join")).toBe(general);
  });
});
