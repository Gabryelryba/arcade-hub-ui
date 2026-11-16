<script>
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import SignIn from "phosphor-svelte/lib/SignIn";
  import { t } from "./i18n/index.svelte.js";

  // The first screen of a game played from a waiting room: what it is, Create
  // Room, and joining with a code. `art` is the game's preview.
  // showJoinForm and joinError are the parent's, so a refused join can reopen the form.
  let {
    gameId,
    eyebrow,
    title,
    lede,
    connecting = false,
    slowServer = false,
    joinError = $bindable(""),
    showJoinForm = $bindable(false),
    onCreate,
    onJoin,
    art,
  } = $props();

  let joinCodeInput = $state("");
  let joinInput;

  function openJoinForm() {
    joinError = "";
    showJoinForm = true;
    requestAnimationFrame(() => joinInput?.focus());
  }

  function closeJoinForm() {
    showJoinForm = false;
    joinCodeInput = "";
    joinError = "";
  }

  function submit(evt) {
    evt.preventDefault();
    const code = joinCodeInput.trim();
    if (code.length !== 5) {
      joinError = t("common.roomCodeLength");
      joinInput?.focus();
      return;
    }
    onJoin(code);
  }
</script>

<section class="menu">
  <div class="menu-copy">
    <p class="eyebrow-pill">{eyebrow}</p>
    <h1 translate="no">{title}</h1>
    <p class="lede">{lede}</p>

    {#if connecting}
      <p class="connecting" role="status" aria-live="polite">
        <span class="pulse" aria-hidden="true"></span>
        {slowServer ? t("common.waking") : t("common.connecting")}
      </p>
    {/if}

    {#if !showJoinForm}
      <div class="actions">
        <button class="btn btn-primary" onclick={onCreate} disabled={connecting}>
          {t("common.createRoom")}
          <span class="orb"><ArrowRight size={16} weight="bold" aria-hidden="true" /></span>
        </button>
        <button class="btn btn-secondary" onclick={openJoinForm} disabled={connecting}>
          <SignIn size={18} weight="light" aria-hidden="true" />
          {t("common.joinWithCode")}
        </button>
      </div>
      {#if joinError}
        <p class="error" role="alert">{joinError}</p>
      {/if}
    {:else}
      <form class="join-form" onsubmit={submit} novalidate>
        <label for="{gameId}-room-code">{t("common.roomCode")}</label>
        <div class="join-row">
          <input
            id="{gameId}-room-code"
            bind:this={joinInput}
            class="code-input"
            class:invalid={joinError}
            type="text"
            name="room-code"
            inputmode="text"
            placeholder="K7Q2M…"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            enterkeyhint="go"
            maxlength="5"
            aria-describedby={joinError ? `${gameId}-room-code-error` : `${gameId}-room-code-help`}
            aria-invalid={joinError ? "true" : undefined}
            bind:value={joinCodeInput}
            oninput={() => (joinCodeInput = joinCodeInput.toUpperCase())}
          />
          <button class="btn btn-primary" type="submit" disabled={connecting}>{t("common.joinRoom")}</button>
        </div>
        {#if joinError}
          <p id="{gameId}-room-code-error" class="error" role="alert">{joinError}</p>
        {:else}
          <p id="{gameId}-room-code-help" class="help">{t("common.roomCodeHelp")}</p>
        {/if}
        <button class="btn btn-ghost cancel" type="button" onclick={closeJoinForm}>{t("common.cancel")}</button>
      </form>
    {/if}
  </div>

  <div class="menu-art bezel" aria-hidden="true">
    <div class="menu-art-core bezel-core">{@render art()}</div>
  </div>
</section>

<style>
  .menu {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding-top: 2rem;
    align-content: start;
  }

  .menu-copy {
    display: grid;
    gap: 1rem;
    align-content: start;
    max-width: 34rem;
  }

  h1 {
    font-size: clamp(2.8rem, 9vw, 4.4rem);
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.045em;
    text-wrap: balance;
  }

  .lede {
    color: var(--ink-muted);
    font-size: 1.05rem;
    max-width: 46ch;
    text-wrap: pretty;
  }

  .connecting {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--ink-muted);
    font-size: 0.95rem;
  }

  .pulse {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: breathe 1.8s ease-in-out infinite;
  }

  @keyframes breathe {
    50% {
      opacity: 0.25;
      transform: scale(0.75);
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.75rem;
  }

  .help {
    color: var(--ink-faint);
    font-size: 0.9rem;
  }

  .error {
    color: var(--danger);
    font-size: 0.92rem;
    font-weight: 500;
  }

  .join-form {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.75rem;
    max-width: 26rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .join-row {
    display: flex;
    gap: 0.6rem;
  }

  .code-input {
    flex: 1 1 0;
    min-width: 0;
    min-height: 3rem;
    padding: 0 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-strong);
    background: var(--bg-deep);
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    transition: border-color 0.3s var(--ease-spring);
  }

  .code-input::placeholder {
    color: var(--ink-faint);
  }

  .code-input:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .code-input.invalid {
    border-color: var(--danger);
  }

  .cancel {
    justify-self: start;
    margin-left: -0.6rem;
  }

  .menu-art-core {
    display: grid;
    place-items: center;
    min-height: 15rem;
    background:
      radial-gradient(70% 90% at 50% 0%, rgba(0, 116, 252, 0.12), transparent 70%),
      var(--bg-deep);
  }

  @media (min-width: 900px) {
    .menu {
      grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
      column-gap: clamp(2.5rem, 6vw, 5rem);
      align-items: center;
      align-content: center;
      padding-top: 0;
      padding-bottom: 3rem;
    }

    .menu-art-core {
      min-height: 26rem;
    }
  }

  @media (max-width: 640px) {
    .actions .btn {
      flex: 1 1 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse {
      animation: none;
    }
  }
</style>
