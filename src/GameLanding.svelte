<script>
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import SignIn from "phosphor-svelte/lib/SignIn";
  import ArrowDown from "phosphor-svelte/lib/ArrowDown";
  import PlayerChip from "./PlayerChip.svelte";
  import { t } from "./i18n/index.svelte.js";
  import { joinCodeError, normalizeCode } from "./landing.js";

  // The landing page of a game site, which is also its first screen: the game's
  // name and pitch next to its animated board, Create Room, joining with a code,
  // and "How to play" below. `art` is the game's preview; `actions` holds extra
  // buttons next to the two main ones (Play vs Computer in Stick Slash).
  // showJoinForm and joinError are the parent's, so a refused join can reopen the form.
  // With onEditName, a chip in the top right corner shows the player's name and
  // lets them change it.
  let {
    gameId,
    eyebrow,
    title,
    lede,
    steps = [],
    connecting = false,
    slowServer = false,
    joinError = $bindable(""),
    showJoinForm = $bindable(false),
    onCreate,
    onJoin,
    playerName = null,
    onEditName = null,
    art,
    actions,
  } = $props();

  let joinCodeInput = $state("");
  let joinInput;

  const howId = $derived(`${gameId}-how-to-play`);

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
    const problem = joinCodeError(joinCodeInput);
    if (problem) {
      joinError = t(problem);
      joinInput?.focus();
      return;
    }
    onJoin(normalizeCode(joinCodeInput));
  }
</script>

{#if onEditName}
  <div class="landing-top">
    <PlayerChip name={playerName} onEdit={onEditName} />
  </div>
{/if}

<div class="landing">
  <section class="hero" aria-labelledby="{gameId}-title">
    <div class="hero-copy">
      <p class="eyebrow-pill">{eyebrow}</p>
      <h1 id="{gameId}-title" translate="no">{title}</h1>
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
          {@render actions?.()}
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

      {#if steps.length > 0}
        <div class="meta-row">
          <a class="how-link" href="#{howId}">
            {t("landing.howToPlay")}
            <ArrowDown size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>
      {/if}
    </div>

    <div class="hero-art bezel" aria-hidden="true">
      <div class="hero-art-core bezel-core">{@render art?.()}</div>
    </div>
  </section>

  {#if steps.length > 0}
    <section class="how" id={howId} aria-labelledby="{howId}-title" tabindex="-1">
      <h2 id="{howId}-title">{t("landing.howToPlay")}</h2>
      <ol class="steps">
        {#each steps as step, i (i)}
          <li class="step">
            <span class="step-number" aria-hidden="true">{i + 1}</span>
            <div class="step-copy">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  <!-- Who made the games, quiet at the very end of the page. -->
  <footer class="credit">
    <p>
      {t("landing.creditBy")}
      <a href="https://gabryelryba.vercel.app/" target="_blank" rel="noopener">{t("landing.creditName")}</a>
    </p>
  </footer>
</div>

<style>
  /* Same height as the bar with Leave on the other screens, so the page does
     not jump when a room opens. */
  .landing-top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 2.75rem;
  }

  .landing {
    flex: 1;
    display: grid;
    gap: 3.5rem;
    align-content: start;
    padding-bottom: 3rem;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding-top: 1.5rem;
  }

  /* On a phone the board comes first, then the pitch and the buttons. */
  .hero-art {
    order: -1;
  }

  .hero-copy {
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
    min-width: 0;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .join-row {
    display: flex;
    gap: 0.6rem;
  }

  /* width: 100% keeps the field from offering its natural size (twenty
     characters of the large spaced-out monospace font, wider than a phone) to
     the grid around the form; without it the whole page scrolled sideways. */
  .code-input {
    flex: 1 1 0;
    width: 100%;
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
    border-color: var(--focus);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .code-input.invalid {
    border-color: var(--danger);
  }

  .cancel {
    justify-self: start;
    margin-left: -0.6rem;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
    margin-top: 0.5rem;
  }

  .how-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2.75rem;
    color: var(--accent-text);
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: underline;
    text-decoration-color: var(--accent-text-line);
    text-underline-offset: 0.3em;
    border-radius: var(--radius-sm);
  }

  .how-link:hover {
    text-decoration-color: currentColor;
  }

  .how-link:focus-visible,
  .how:focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 4px;
  }

  .hero-art-core {
    display: grid;
    place-items: center;
    min-height: 15rem;
    background:
      radial-gradient(70% 90% at 50% 0%, var(--accent-soft), transparent 70%),
      var(--bg-deep);
  }

  .credit {
    justify-self: center;
    text-align: center;
    color: var(--ink-faint);
    font-size: 0.8rem;
  }

  .credit a {
    display: inline-block;
    padding: 0.35rem 0.15rem;
    color: inherit;
    font-weight: 600;
    text-decoration: none;
    border-radius: var(--radius-sm);
    transition: color 0.3s var(--ease-spring);
  }

  .credit a:hover {
    color: var(--ink-muted);
    text-decoration: underline;
    text-underline-offset: 0.25em;
  }

  .credit a:focus-visible {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }

  .how {
    display: grid;
    gap: 1.5rem;
    scroll-margin-top: 1.5rem;
    border-radius: var(--radius-sm);
  }

  h2 {
    font-size: clamp(1.6rem, 5vw, 2.2rem);
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .steps {
    list-style: none;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0;
    margin: 0;
  }

  .step {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    padding: 1.1rem 1.2rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface);
  }

  .step-number {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--gold-soft);
    color: var(--gold);
    font-family: var(--font-mono);
    font-weight: 700;
  }

  .step-copy {
    display: grid;
    gap: 0.3rem;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .step-copy p {
    color: var(--ink-muted);
    font-size: 0.95rem;
    text-wrap: pretty;
  }

  @media (min-width: 720px) {
    .steps {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 900px) {
    .hero {
      grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
      column-gap: clamp(2.5rem, 6vw, 5rem);
      align-items: center;
      min-height: min(70vh, 40rem);
      padding-top: 0;
    }

    .hero-art {
      order: 0;
    }

    .hero-art-core {
      min-height: 26rem;
    }
  }

  @media (min-width: 1100px) {
    .steps:has(> :nth-child(4)) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .steps:not(:has(> :nth-child(4))) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .step {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 640px) {
    .actions :global(.btn) {
      flex: 1 1 100%;
    }

    /* Phones: the code field and the join button are both wide, so they stack. */
    .join-row {
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse {
      animation: none;
    }
  }
</style>
