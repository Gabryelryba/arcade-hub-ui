<script>
  import LinkSimple from "phosphor-svelte/lib/LinkSimple";
  import Check from "phosphor-svelte/lib/Check";
  import Crown from "phosphor-svelte/lib/Crown";
  import Play from "phosphor-svelte/lib/Play";
  import SlidersHorizontal from "phosphor-svelte/lib/SlidersHorizontal";
  import LockSimple from "phosphor-svelte/lib/LockSimple";
  import Avatar from "./Avatar.svelte";
  import { startCheck, startHint } from "./lobbyText.js";
  import { t } from "./i18n/index.svelte.js";

  // The waiting room of every game played from one (Dotz, Guess Word).
  // lobby: the last `lobby` event ({ code, phase, options, players, you }).
  // minPlayers / maxPlayers: the game's, from the registry.
  // notice: a short message for everyone in the room (host change, refused start).
  // options: a snippet with the game's own settings, given whether this player
  // is the host (only the host changes them). They sit in their own panel, so
  // it is plain that the match can be customised before it starts.
  //
  // Layout: the room (code and invite) is a header across the whole width; under
  // it, the settings and the seats side by side on wide screens, stretched to the
  // same height, with the start button at the foot of the seats.
  let {
    lobby,
    minPlayers = 2,
    maxPlayers = 4,
    notice = "",
    reconnecting = false,
    onReady,
    onStart,
    onCopyLink,
    onLeave,
    options = null,
  } = $props();

  let linkCopied = $state(false);

  const me = $derived(lobby.players[lobby.you] ?? null);
  const amHost = $derived(Boolean(me?.host));
  const check = $derived(startCheck(lobby, { minPlayers }));
  const hint = $derived(startHint(check));
  const openSeats = $derived(Math.max(0, maxPlayers - lobby.players.length));
  const code = $derived(lobby.code ?? "");

  async function copyLink() {
    await onCopyLink();
    linkCopied = true;
    setTimeout(() => (linkCopied = false), 1800);
  }

  function seatStatus(player) {
    if (!player.connected) return t("lobby.away");
    return player.ready ? t("lobby.ready") : t("lobby.notReady");
  }
</script>

<section class="lobby">
  <header class="room">
    <div class="room-id">
      <p class="eyebrow-pill">{t("lobby.eyebrow")}</p>
      <p class="room-code" translate="no" aria-label={t("common.roomCodeAria", { code: code.split("").join(" ") })}>
        {code}
      </p>
      <p class="help">{t("lobby.help")}</p>
    </div>
    <div class="room-actions">
      <button class="btn btn-secondary" onclick={copyLink}>
        {#if linkCopied}
          <Check size={18} weight="light" aria-hidden="true" /> {t("common.linkCopied")}
        {:else}
          <LinkSimple size={18} weight="light" aria-hidden="true" /> {t("common.copyInvite")}
        {/if}
      </button>
      <button class="btn btn-ghost" onclick={onLeave}>{t("lobby.leave")}</button>
    </div>
  </header>

  <div class="panels" class:solo={!options}>
    {#if options}
      <section class="settings bezel" class:host={amHost} aria-labelledby="room-settings-title">
        <div class="settings-core bezel-core">
          <header class="settings-head">
            <span class="settings-icon" aria-hidden="true">
              {#if amHost}
                <SlidersHorizontal size={20} weight="bold" />
              {:else}
                <LockSimple size={20} weight="bold" />
              {/if}
            </span>
            <span class="settings-text">
              <h2 id="room-settings-title">{amHost ? t("lobby.settings.hostTitle") : t("lobby.settings.guestTitle")}</h2>
              <p>{amHost ? t("lobby.settings.hostNote") : t("lobby.settings.guestNote")}</p>
            </span>
          </header>
          <div class="options">{@render options(amHost)}</div>
        </div>
      </section>
    {/if}

    <div class="seats-panel bezel">
      <div class="seats-core bezel-core">
        <header class="seats-head">
          <h2>{t("lobby.players")}</h2>
          <span class="count">{lobby.players.length}/{maxPlayers}</span>
        </header>

        <ol class="seats" aria-live="polite">
          {#each lobby.players as player (player.color)}
            <li class="seat" class:away={!player.connected} class:ready={player.ready || player.host}>
              <Avatar name={player.name} color={player.color} size="2.4rem" />
              <span class="who">
                <span class="name" translate="no">{player.name}</span>
                {#if player.host || player.index === lobby.you}
                  <span class="role">
                    {#if player.host}<Crown size={12} weight="fill" aria-hidden="true" /> {t("lobby.host")}{/if}
                    {#if player.host && player.index === lobby.you}·{/if}
                    {#if player.index === lobby.you}{t("common.you")}{/if}
                  </span>
                {/if}
              </span>
              {#if !player.host || !player.connected}
                <span class="state">{seatStatus(player)}</span>
              {/if}
            </li>
          {/each}
          {#each Array(openSeats) as _, i (i)}
            <li class="seat open"><span class="ring" aria-hidden="true"></span><span class="who">{t("lobby.openSeat")}</span></li>
          {/each}
        </ol>

        <footer class="seats-foot">
          <p class="notice" role="status" aria-live="polite">
            {#if reconnecting}{t("common.reconnecting")}{:else}{notice}{/if}
          </p>
          {#if amHost}
            <button class="btn btn-primary go" disabled={!check.ok || reconnecting} onclick={onStart}>
              {t("lobby.start")}
              <span class="orb"><Play size={14} weight="fill" aria-hidden="true" /></span>
            </button>
            <p class="hint" aria-live="polite">{hint || t("lobby.everyoneReady")}</p>
          {:else if me}
            <button
              class="btn go"
              class:btn-primary={!me.ready}
              class:btn-secondary={me.ready}
              aria-pressed={me.ready}
              disabled={reconnecting}
              onclick={() => onReady(!me.ready)}
            >
              {#if me.ready}
                {t("lobby.cancelReady")}
              {:else}
                <Check size={18} weight="light" aria-hidden="true" /> {t("lobby.imReady")}
              {/if}
            </button>
            <p class="hint">{me.ready ? t("lobby.waitingHost") : t("lobby.markReady")}</p>
          {/if}
        </footer>
      </div>
    </div>
  </div>
</section>

<style>
  .lobby {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.75rem;
    padding-top: 1.25rem;
    align-content: start;
  }

  /* ---- The room: code and invite, across the whole width ---- */
  .room {
    display: grid;
    gap: 0.9rem;
    min-width: 0;
  }

  .room-id {
    display: grid;
    gap: 0.9rem;
    align-content: start;
    min-width: 0;
  }

  .room-code {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: clamp(2.8rem, 14vw, 5rem);
    line-height: 1;
    letter-spacing: 0.12em;
    font-variant-numeric: tabular-nums;
  }

  .help {
    color: var(--ink-faint);
    font-size: 0.9rem;
    max-width: 40ch;
  }

  .room-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  /* ---- The two panels ---- */
  .panels {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
    min-width: 0;
  }

  /* Each panel fills its grid cell, so the two end on the same line. */
  .settings,
  .seats-panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .settings-core,
  .seats-core {
    flex: 1;
  }

  /* ---- Settings: the game's options, in their own panel ---- */
  .settings-core {
    display: grid;
    gap: 1.1rem;
    align-content: start;
    padding: 1.2rem 1.2rem 1.35rem;
  }

  .settings-head {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .settings-icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.85rem;
    background: var(--surface-hover);
    color: var(--ink-muted);
  }

  /* The host's icon carries the action colour: these are controls. */
  .settings.host .settings-icon {
    background: var(--accent);
    color: var(--accent-ink);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .settings-text {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  .settings-text p {
    color: var(--ink-muted);
    font-size: 0.88rem;
    line-height: 1.4;
    text-wrap: pretty;
  }

  .options {
    display: grid;
    gap: 1rem;
    min-width: 0;
  }

  /* A hairline between settings, so each reads as its own row (one class more
     than the fieldset reset in OptionPicker, which would otherwise win). */
  .settings-core .options > :global(* + *) {
    padding-top: 1rem;
    border-top: 1px solid var(--line);
  }

  /* ---- Seats ---- */
  .seats-core {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.1rem 1.1rem 1.25rem;
  }

  .seats-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 0.35rem 0.5rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  .count {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--ink-faint);
  }

  .seats {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
  }

  .seat {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3.6rem;
    padding: 0.55rem 0.7rem;
    border-radius: 1.1rem;
    background: var(--sheen);
    animation: seat-in 0.6s var(--ease-spring);
  }

  @keyframes seat-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  .seat.away {
    opacity: 0.55;
  }

  .who {
    flex: 1;
    min-width: 0;
    display: grid;
    line-height: 1.2;
  }

  .name {
    min-width: 0;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ink-faint);
  }

  .role :global(svg) {
    color: var(--gold);
  }

  .state {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--ink-faint);
    border: 1px solid var(--line);
    transition:
      color 0.3s var(--ease-spring),
      background-color 0.3s var(--ease-spring),
      border-color 0.3s var(--ease-spring);
  }

  .ready .state {
    color: var(--ink);
    background: var(--sheen-strong);
    border-color: var(--line-strong);
  }

  .seat.open {
    background: none;
    border: 1px dashed var(--line);
    color: var(--ink-faint);
    animation: none;
  }

  .ring {
    flex: none;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    border: 1px dashed var(--line-strong);
  }

  /* Pushed to the foot of the panel when it is stretched next to the settings. */
  .seats-foot {
    margin-top: auto;
    display: grid;
    gap: 0.6rem;
    padding: 0.85rem 0.35rem 0;
  }

  .notice {
    min-height: 1.4em;
    color: var(--accent-text);
    font-weight: 600;
    font-size: 0.92rem;
  }

  .go {
    width: 100%;
  }

  /* Waiting for players: plainly not ready yet, not a faded call to action. */
  .go:disabled {
    opacity: 0.4;
    filter: saturate(0.35);
  }

  .hint {
    color: var(--ink-muted);
    font-size: 0.9rem;
    text-align: center;
  }

  @media (min-width: 900px) {
    .lobby {
      gap: 1.5rem;
      align-content: center;
      padding: 0 0 2rem;
    }

    /* Code on the left, invite actions on the right, on the code's baseline. */
    .room {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      column-gap: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--line);
    }

    .panels {
      grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
      align-items: stretch;
      column-gap: clamp(1.25rem, 3vw, 2rem);
    }

    /* A game without settings: the seats alone, in a centred column. */
    .panels.solo {
      grid-template-columns: minmax(0, 32rem);
      justify-content: center;
    }

    .settings-core {
      gap: 0.95rem;
      padding: 1.05rem 1.15rem 1.15rem;
    }

    .options {
      gap: 0.85rem;
    }

    .settings-core .options > :global(* + *) {
      padding-top: 0.85rem;
    }
  }

  @media (max-width: 640px) {
    .room-actions .btn {
      flex: 1 1 auto;
    }
  }

  /* The narrowest phones: less padding nested inside padding, so names fit. */
  @media (max-width: 380px) {
    .seats-panel,
    .settings {
      margin-left: -0.75rem;
      margin-right: -0.75rem;
    }

    .settings-core {
      padding: 1rem 0.75rem 1.1rem;
    }

    .seats-core {
      padding: 0.85rem 0.6rem 1rem;
    }

    .seat {
      gap: 0.6rem;
      padding: 0.5rem 0.5rem;
    }

    .state {
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
    }
  }
</style>
