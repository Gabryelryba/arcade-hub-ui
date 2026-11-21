// Interface texts, in Brazilian Portuguese.
//
// Texts live in pt-BR.js as nested objects, looked up by dotted key:
// t("lobby.start"). That file holds what every site shares; each site adds its
// own texts with registerMessages() before mounting. A text may hold
// {placeholders}, filled from `vars`, and may be given as { one, other }: `one`
// when `vars.count` is 1, `other` otherwise.

import ptBR from "./pt-BR.js";

export const LOCALE = "pt-BR";

// A deep copy: registerMessages() merges into it, never into the import.
const dictionary = structuredClone(ptBR);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key]) && !("other" in value)) merge(target[key], value);
    else target[key] = structuredClone(value);
  }
}

// A site's own texts, merged over the shared ones. Call it before mounting. A
// key that already exists is replaced (a game site gives its own
// meta.description, for example).
export function registerMessages(messages) {
  if (isPlainObject(messages)) merge(dictionary, messages);
}

// The page itself: <html lang> and the meta description.
export function applyToDocument() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = LOCALE;
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
}

const lookup = (key) => key.split(".").reduce((node, part) => node?.[part], dictionary);

// The text for `key`, or the key itself when there is none.
export function t(key, vars = {}) {
  let text = lookup(key);
  if (text == null) return key;
  // "1 quadrado" but "0 quadrados" (Intl.PluralRules would make 0 singular in
  // Portuguese), so `one` means exactly 1.
  if (typeof text === "object") text = vars.count === 1 ? (text.one ?? text.other) : text.other;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

// -> a list kept whole in the dictionary, such as the steps of "Como jogar":
// [{ title, text }, ...]. [] when the key holds no list.
export function tList(key) {
  const list = lookup(key);
  return Array.isArray(list) ? list : [];
}

// "Ana, Rui e Bia".
export function joinNames(names) {
  return new Intl.ListFormat(LOCALE, { type: "conjunction" }).format(names);
}

// A server refusal ({ code, error }) as a text for the player: by its code when
// we know it, otherwise a general message. The server's own `error` is English
// text for developers and is never shown.
export function serverMessage(group, { code } = {}) {
  const key = `errors.${group}.${code}`;
  return code && lookup(key) != null ? t(key) : t("errors.unknown");
}
