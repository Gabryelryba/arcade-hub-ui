import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
const CLIENT_ID_KEY = "arcade-hub:client-id";

// crypto.getRandomValues also exists on plain-http LAN addresses (handy when
// testing on a phone), where crypto.randomUUID does not.
function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// A random token the server uses to recognise this tab as the creator of a
// waiting room, so a host whose connection dropped can take the room back.
function clientId() {
  try {
    let id = sessionStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

export const socket = io(SERVER_URL, { autoConnect: false, auth: { clientId: clientId() } });
