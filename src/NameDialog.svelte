<script>
  import { validateName, cleanName, graphemeLength, MAX_NAME_LENGTH } from "./player.js";
  import { t } from "./i18n/index.svelte.js";

  // mode "first": asked before the first room; cancelling drops that action.
  // mode "edit": changing the name from the hub.
  let { open, mode = "first", initial = "", onSave, onCancel } = $props();

  let dialog;
  let input;
  let value = $state("");
  let error = $state("");

  const count = $derived(graphemeLength(cleanName(value)));

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      value = initial ?? "";
      error = "";
      dialog.showModal();
      requestAnimationFrame(() => input?.select());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  function submit(evt) {
    evt.preventDefault();
    const check = validateName(value);
    if (!check.ok) {
      error = check.error;
      input?.focus();
      return;
    }
    onSave(check.name);
  }

  // Esc, or a click on the backdrop.
  function cancel(evt) {
    evt?.preventDefault();
    onCancel();
  }

  function onBackdrop(evt) {
    if (evt.target === dialog) cancel();
  }
</script>

<dialog bind:this={dialog} aria-labelledby="name-title" oncancel={cancel} onclick={onBackdrop}>
  <form class="panel" onsubmit={submit} novalidate>
    <p class="eyebrow">{mode === "first" ? t("name.eyebrowFirst") : t("name.eyebrowEdit")}</p>
    <h2 id="name-title">{mode === "first" ? t("name.titleFirst") : t("name.titleEdit")}</h2>

    <div class="field">
      <label for="player-name">{t("name.label")}</label>
      <input
        id="player-name"
        bind:this={input}
        bind:value
        class:invalid={error}
        type="text"
        name="nickname"
        autocomplete="nickname"
        autocapitalize="words"
        spellcheck="false"
        enterkeyhint="done"
        maxlength="48"
        placeholder="Iara, Caetano, Lívia…"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "player-name-error" : "player-name-help"}
        oninput={() => (error = "")}
      />
      <div class="below">
        {#if error}
          <p id="player-name-error" class="error" role="alert">{error}</p>
        {:else}
          <p id="player-name-help" class="help">{mode === "first" ? t("name.helpFirst") : t("name.help")}</p>
        {/if}
        <span class="count" class:over={count > MAX_NAME_LENGTH} aria-hidden="true">{count}/{MAX_NAME_LENGTH}</span>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" type="submit">{mode === "first" ? t("name.continue") : t("name.save")}</button>
      <button class="btn btn-ghost" type="button" onclick={() => cancel()}>{t("common.cancel")}</button>
    </div>
  </form>
</dialog>

<style>
  dialog {
    width: min(26rem, calc(100vw - 2rem));
    max-width: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    overscroll-behavior: contain;
  }

  dialog::backdrop {
    background: rgba(3, 6, 13, 0.72);
    backdrop-filter: blur(4px);
  }

  dialog[open] {
    animation: enter 0.35s var(--ease-out);
  }

  @keyframes enter {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
  }

  .panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    padding: 1.6rem 1.5rem 1.4rem;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--line-strong);
    box-shadow: var(--shadow), inset 0 1px 0 rgba(207, 224, 255, 0.05);
  }

  .eyebrow {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent-text);
  }

  h2 {
    font-size: 1.6rem;
    line-height: 1.1;
    margin-top: -0.5rem;
  }

  .field {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    min-width: 0;
    min-height: 3rem;
    padding: 0 0.9rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-strong);
    background: var(--bg-deep);
    font-size: 1.05rem;
    font-weight: 500;
    transition: border-color 0.18s var(--ease-out);
  }

  input::placeholder {
    color: var(--ink-faint);
  }

  input:focus-visible {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  input.invalid {
    border-color: var(--danger);
  }

  .below {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
  }

  .help {
    color: var(--ink-faint);
    font-size: 0.88rem;
  }

  .error {
    color: var(--danger);
    font-size: 0.88rem;
    font-weight: 500;
  }

  .count {
    flex: none;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
  }

  .count.over {
    color: var(--danger);
  }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  .actions .btn-primary {
    flex: 1;
  }

  @media (max-width: 360px) {
    .panel {
      padding: 1.3rem 1.1rem 1.1rem;
    }

    h2 {
      font-size: 1.4rem;
    }
  }
</style>
