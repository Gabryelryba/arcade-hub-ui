// Interface language. Players whose browser prefers Portuguese get pt-BR,
// everyone else gets English. A language passed in the address (?lang=pt-BR,
// how the hub hands its choice to a game site) wins over a choice remembered
// on this site, which wins over the browser. Game names have their own name in
// each language (Stick Slash / Risca Palito, Dotz / Liga Pontos).
//
// Texts live in en.js and pt-BR.js as nested objects, looked up by dotted key:
// t("lobby.start"). Those hold what every site shares; each site adds its own
// texts with registerMessages() before mounting. A text may hold
// {placeholders}, filled from `vars`, and may be given as { one, other }: `one`
// when `vars.count` is 1, `other` otherwise.

import en from "./en.js";
import ptBR from "./pt-BR.js";

export const LANGUAGES = [
  { id: "pt-BR", short: "PT", name: "Português" },
  { id: "en", short: "EN", name: "English" },
];

// Deep copies: registerMessages() merges into these, never into the imports.
const DICTIONARIES = { en: structuredClone(en), "pt-BR": structuredClone(ptBR) };
const STORAGE_KEY = "arcade-hub:language";

// -> "pt-BR" when the first preferred language is any Portuguese, else "en".
export function detectLanguage(preferred) {
  const first = String(preferred?.[0] ?? "").toLowerCase();
  return first.startsWith("pt") ? "pt-BR" : "en";
}

// -> the language asked for in a query string ("?lang=pt-BR"), or null.
export function languageFromSearch(search) {
  const id = new URLSearchParams(search ?? "").get("lang");
  return id && DICTIONARIES[id] ? id : null;
}

// localStorage can be missing or throw (private mode, blocked storage): then
// the choice lasts for this visit only.
function storedLanguage() {
  try {
    const id = globalThis.localStorage?.getItem(STORAGE_KEY);
    return DICTIONARIES[id] ? id : null;
  } catch {
    return null;
  }
}

function remember(id) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, id);
  } catch {
    // Not remembered; still used for this visit.
  }
}

function browserLanguages() {
  const nav = globalThis.navigator;
  return nav?.languages?.length ? nav.languages : [nav?.language];
}

const fromAddress = languageFromSearch(globalThis.location?.search);
if (fromAddress) remember(fromAddress);

const state = $state({ language: fromAddress ?? storedLanguage() ?? detectLanguage(browserLanguages()) });

export function currentLanguage() {
  return state.language;
}

export function setLanguage(id) {
  if (!DICTIONARIES[id]) return;
  state.language = id;
  remember(id);
  applyToDocument();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key]) && !("other" in value)) merge(target[key], value);
    else target[key] = structuredClone(value);
  }
}

// A site's own texts, merged over the shared ones: { en: {...}, "pt-BR": {...} }.
// Call it before mounting. A key that already exists is replaced (a game site
// gives its own meta.description, for example). Languages the package does not
// know are ignored.
export function registerMessages(messages) {
  for (const [id, dictionary] of Object.entries(messages ?? {})) {
    if (DICTIONARIES[id] && isPlainObject(dictionary)) merge(DICTIONARIES[id], dictionary);
  }
}

// The page itself follows the language: <html lang> and the meta description.
export function applyToDocument() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = state.language;
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
}

const lookup = (dictionary, key) => key.split(".").reduce((node, part) => node?.[part], dictionary);

// The text for `key` in the current language, falling back to English, then to the key.
export function t(key, vars = {}) {
  let text = lookup(DICTIONARIES[state.language], key) ?? lookup(DICTIONARIES.en, key);
  if (text == null) return key;
  // Both languages say "1 box" but "0 boxes" / "0 quadrados" (Intl.PluralRules
  // would make 0 singular in Portuguese), so `one` means exactly 1.
  if (typeof text === "object") text = vars.count === 1 ? (text.one ?? text.other) : text.other;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

// "Ana, Rui and Bia" / "Ana, Rui e Bia".
export function joinNames(names) {
  return new Intl.ListFormat(state.language, { type: "conjunction" }).format(names);
}

// A server refusal ({ code, error }) in the current language: by its code when
// we know it, otherwise the server's own (English) text.
export function serverMessage(group, { code, error } = {}) {
  const key = `errors.${group}.${code}`;
  return code && lookup(DICTIONARIES.en, key) != null ? t(key) : (error ?? "");
}

// Every text of a dictionary as [dotted key, value], plural forms kept whole.
// Sites use it to test that their pt-BR and English texts match.
export function dictionaryEntries(node, prefix = "") {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const isPlural = isPlainObject(value) && "other" in value;
    return isPlainObject(value) && !isPlural ? dictionaryEntries(value, path) : [[path, value]];
  });
}
