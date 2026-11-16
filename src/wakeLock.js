// Keeps the screen from auto-locking while someone waits for an opponent: a
// locked phone suspends the page and drops the connection. The browser releases
// the lock whenever the page is hidden, so it is asked for again on return.
// It is a best effort: unsupported browsers and low-battery refusals are ignored,
// and the server holds the waiting room for a while anyway.

let sentinel = null;
let wanted = false;

async function acquire() {
  if (!wanted || sentinel || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  try {
    const lock = await navigator.wakeLock.request("screen");
    if (!wanted) {
      lock.release().catch(() => {});
      return;
    }
    sentinel = lock;
    lock.addEventListener("release", () => {
      if (sentinel === lock) sentinel = null;
    });
  } catch {
    sentinel = null;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") acquire();
});

export function keepScreenAwake() {
  wanted = true;
  acquire();
}

export function allowScreenSleep() {
  wanted = false;
  const lock = sentinel;
  sentinel = null;
  lock?.release().catch(() => {});
}
