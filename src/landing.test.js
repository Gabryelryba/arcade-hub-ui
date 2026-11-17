import { describe, test, expect } from "vitest";
import { render } from "svelte/server";
import { createRawSnippet } from "svelte";
import GameLanding from "./GameLanding.svelte";
import { joinCodeError, normalizeCode } from "./landing.js";
import { setLanguage } from "./i18n/index.svelte.js";

const steps = [
  { title: "Create a room", text: "Share the link with a friend." },
  { title: "Take turns", text: "Cross as many sticks in a row as you like." },
  { title: "Do not take the last one", text: "Whoever crosses the last stick loses." },
];

function page(props = {}) {
  setLanguage("en");
  return render(GameLanding, {
    props: {
      gameId: "stick-slash",
      eyebrow: "Misère Nim",
      title: "Stick Slash",
      lede: "A game of sticks.",
      steps,
      onCreate: () => {},
      onJoin: () => {},
      art: createRawSnippet(() => ({ render: () => "<svg data-art></svg>" })),
      ...props,
    },
  }).body;
}

describe("GameLanding", () => {
  test("one h1 with the game's name, and How to play as an h2", () => {
    const html = page();
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*>Stick Slash<\/h1>/);
    expect(html).toMatch(/<h2[^>]*>How to play<\/h2>/);
  });

  test("the steps are an ordered list, numbered, in order", () => {
    const html = page();
    const list = html.slice(html.indexOf("<ol"), html.indexOf("</ol>"));
    expect(list.match(/<li/g)).toHaveLength(3);
    expect(list.indexOf("Create a room")).toBeLessThan(list.indexOf("Take turns"));
    expect(list.indexOf("Take turns")).toBeLessThan(list.indexOf("Do not take the last one"));
    expect(list).toMatch(/>3<\/span>/);
  });

  test("the How to play link points at the section", () => {
    const html = page();
    expect(html).toContain('href="#stick-slash-how-to-play"');
    expect(html).toContain('id="stick-slash-how-to-play"');
  });

  test("Create Room and Join with Code are there, and the game's art", () => {
    const html = page();
    expect(html).toContain("Create Room");
    expect(html).toContain("Join With Code");
    expect(html).toContain("data-art");
  });

  test("extra actions go next to the main buttons", () => {
    const html = page({ actions: createRawSnippet(() => ({ render: () => "<button>Play vs Computer</button>" })) });
    const start = html.indexOf('class="actions');
    expect(start).toBeGreaterThan(-1);
    expect(html.indexOf("Play vs Computer")).toBeGreaterThan(start);
    expect(html.indexOf("Play vs Computer")).toBeLessThan(html.indexOf("<ol"));
  });

  test("without steps there is no How to play", () => {
    const html = page({ steps: [] });
    expect(html).not.toContain("How to play");
  });

  test("the name chip only shows when the name can be edited", () => {
    expect(page()).not.toContain("Playing as");
    expect(page({ playerName: "Iara", onEditName: () => {} })).toContain("Iara");
  });

  test("buttons are disabled while connecting, with the status", () => {
    const html = page({ connecting: true });
    expect(html).toContain('role="status"');
    expect(html).toMatch(/<button class="btn btn-primary[^"]*"[^>]*disabled/);
  });

  test("in Portuguese", () => {
    setLanguage("pt-BR");
    const html = render(GameLanding, {
      props: { gameId: "dotz", eyebrow: "", title: "Liga Pontos", lede: "", steps, onCreate() {}, onJoin() {} },
    }).body;
    expect(html).toContain("Como jogar");
    expect(html).toContain("Criar Sala");
    setLanguage("en");
  });
});

describe("join code", () => {
  test("a code is sent trimmed and upper case", () => {
    expect(normalizeCode("  k7q2m ")).toBe("K7Q2M");
  });

  test("only five characters can be sent", () => {
    expect(joinCodeError("K7Q2M")).toBeNull();
    expect(joinCodeError(" k7q2m ")).toBeNull();
    expect(joinCodeError("K7Q")).toBe("common.roomCodeLength");
    expect(joinCodeError("")).toBe("common.roomCodeLength");
  });
});
