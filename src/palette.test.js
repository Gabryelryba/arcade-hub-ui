import { describe, test, expect } from "vitest";
import { readFileSync } from "node:fs";

// The colour tokens of app.css, checked for WCAG contrast: 4.5:1 for text,
// 3:1 for the players' colours (marks on the board, not body text).
const css = readFileSync(new URL("./app.css", import.meta.url), "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf("\n}", css.indexOf(":root {")));
const tokens = Object.fromEntries([...root.matchAll(/\n\s*(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

function hex(name) {
  let value = tokens[name] ?? name;
  for (let i = 0; i < 5 && value.startsWith("var("); i++) value = tokens[value.slice(4, -1).trim()];
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`${name} is not a solid #rrggbb colour: ${value}`);
  return value;
}

function luminance(color) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(hex(a)), luminance(hex(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = [
  ["--ink", "--bg"],
  ["--ink", "--surface"],
  ["--ink", "--surface-raised"],
  ["--ink", "--bg-deep"],
  ["--ink-muted", "--bg"],
  ["--ink-muted", "--surface"],
  ["--ink-muted", "--surface-raised"],
  ["--accent-ink", "--accent"],
  ["--accent-ink", "--accent-hover"],
  ["--accent-ink", "--accent-press"],
  ["--accent-text", "--bg"],
  ["--accent-text", "--surface"],
  ["--danger", "--bg"],
  ["--danger", "--surface"],
  ["#ffffff", "--danger-fill"],
  ["--gold-ink", "--gold"],
];

describe("palette contrast", () => {
  test.each(TEXT)("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  test.each([1, 2, 3, 4, 5].flatMap((n) => [[`--player-${n}`, "--bg"], [`--player-${n}`, "--surface"]]))(
    "%s on %s is at least 3:1",
    (fg, bg) => {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(3);
    }
  );

  test("focus rings stand out from the background (3:1)", () => {
    expect(contrast("--focus", "--bg")).toBeGreaterThanOrEqual(3);
  });

  test("the players' colours differ from each other", () => {
    const players = [1, 2, 3, 4, 5].map((n) => hex(`--player-${n}`).toLowerCase());
    expect(new Set(players).size).toBe(5);
  });
});
