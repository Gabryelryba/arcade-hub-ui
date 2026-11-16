<script>
  import { initialOf } from "./player.js";

  // A player's first letter in a disc. "muted" for the other player, so "you"
  // always reads as the accent. color (1 to 4): a player colour, for games with
  // more than two players.
  let { name = "", muted = false, size = "2rem", color = null } = $props();

  const initial = $derived(initialOf(name));
</script>

<span
  class="avatar"
  class:muted
  class:player={color !== null}
  style:--size={size}
  style:--player-color={color !== null ? `var(--player-${color})` : null}
  aria-hidden="true">{initial}</span
>

<style>
  .avatar {
    flex: none;
    display: grid;
    place-items: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 700;
    font-size: calc(var(--size) * 0.46);
    line-height: 1;
  }

  .avatar.muted {
    background: var(--surface-raised);
    color: var(--ink);
    box-shadow: inset 0 0 0 1px var(--line-strong);
  }

  .avatar.player {
    background: var(--player-color);
    color: var(--bg);
  }
</style>
