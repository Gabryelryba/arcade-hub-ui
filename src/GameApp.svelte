<script>
  // The page of a game site: the animated background, the game itself and the
  // name dialog. Each game site mounts this with its game component:
  //
  //   mount(GameApp, { target, props: { Game: StickSlash, gameId: "stick-slash" } })
  //
  // An invite link (?code=ABCDE) is handed to the game once and then scrubbed
  // from the address, so a refresh does not join again. Leaving the game goes
  // to the Recreio hub; a room code that belongs to another game sends the
  // player to that game's site with the code. The language goes along (?lang=).
  import AnimatedBackground from "./AnimatedBackground.svelte";
  import NameDialog from "./NameDialog.svelte";
  import { readCode, withoutCode } from "./invite.js";
  import { getName, setName } from "./player.js";
  import { gameUrl } from "./gameUrls.js";
  import { applyToDocument, currentLanguage } from "./i18n/index.svelte.js";

  let { Game, gameId } = $props();

  // <html lang> and the meta description follow the language from the start.
  applyToDocument();

  let inviteCode = $state(readCode(window.location.search));
  window.history.replaceState({}, "", withoutCode(window.location.href));

  // The display name is asked the first time it is needed (creating, joining or
  // playing the computer) and remembered after that.
  let playerName = $state(getName());
  let nameRequest = $state(null); // { mode: "first" | "edit", resolve }

  // -> Promise<string | null>: the name, or null if the player backed out.
  function ensureName() {
    if (playerName) return Promise.resolve(playerName);
    nameRequest?.resolve(null);
    return new Promise((resolve) => (nameRequest = { mode: "first", resolve }));
  }

  function saveName(name) {
    const saved = setName(name);
    if (!saved) return;
    playerName = saved;
    nameRequest?.resolve(saved);
    nameRequest = null;
  }

  function cancelName() {
    nameRequest?.resolve(null);
    nameRequest = null;
  }

  function goToHub() {
    window.location.assign(gameUrl("hub", null, currentLanguage()));
  }

  // -> true when the player is being sent to the other game's site.
  function switchGame(id, code) {
    if (id === gameId) return false;
    const url = gameUrl(id, code, currentLanguage());
    if (!url) return false;
    window.location.assign(url);
    return true;
  }

  // The game has used the invite code; it must not join again after a remount.
  function inviteUsed() {
    inviteCode = null;
  }
</script>

<AnimatedBackground />

<Game
  onExit={goToHub}
  {inviteCode}
  onInviteUsed={inviteUsed}
  onSwitchGame={switchGame}
  {playerName}
  {ensureName}
/>

<NameDialog
  open={nameRequest !== null}
  mode={nameRequest?.mode ?? "first"}
  initial={playerName ?? ""}
  onSave={saveName}
  onCancel={cancelName}
/>
