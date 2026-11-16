// Where each Recreio site lives. The ids are the server's game ids (back end:
// games/index.js), plus "hub" for the Recreio home page. For local development
// a site can point them elsewhere with VITE_GAME_URLS, a JSON object such as
// {"hub":"http://localhost:5173","stick-slash":"http://localhost:5174"}; ids it
// leaves out keep their production address.

export const DEFAULT_GAME_URLS = Object.freeze({
  hub: "https://recreio.onrender.com",
  "guess-word": "https://adivinha-palavra.onrender.com",
  "stick-slash": "https://risca-palito.onrender.com",
  dotz: "https://liga-pontos.onrender.com",
});

// -> the addresses with the overrides from a VITE_GAME_URLS value applied.
// A value that is not a JSON object, or entries that are not http(s)
// addresses, are ignored rather than breaking the site.
export function withOverrides(raw, defaults = DEFAULT_GAME_URLS) {
  let overrides = {};
  try {
    overrides = raw ? JSON.parse(raw) : {};
  } catch {
    overrides = {};
  }
  const urls = { ...defaults };
  if (overrides && typeof overrides === "object" && !Array.isArray(overrides)) {
    for (const [id, url] of Object.entries(overrides)) {
      if (typeof url === "string" && /^https?:\/\//.test(url)) urls[id] = url;
    }
  }
  return Object.freeze(urls);
}

export const GAME_URLS = withOverrides(import.meta.env.VITE_GAME_URLS);

// -> the address of a site, optionally carrying a room code and a language
// ("https://liga-pontos.onrender.com/?code=K7Q2M&lang=pt-BR"); null for an id
// with no site.
export function gameUrl(gameId, code = null, lang = null, urls = GAME_URLS) {
  const base = Object.hasOwn(urls, gameId) ? urls[gameId] : null;
  if (!base) return null;
  const url = new URL(base);
  if (code) url.searchParams.set("code", code);
  if (lang) url.searchParams.set("lang", lang);
  return url.toString();
}
