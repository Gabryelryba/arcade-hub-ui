<script>
  import { LANGUAGES, currentLanguage, setLanguage, t } from "./i18n/index.svelte.js";
</script>

<!-- Two-way switch, PT | EN. The choice is saved and wins over the browser's language. -->
<div class="switch" role="radiogroup" aria-label={t("language.label")}>
  {#each LANGUAGES as language (language.id)}
    <button
      type="button"
      role="radio"
      class:on={currentLanguage() === language.id}
      aria-checked={currentLanguage() === language.id}
      aria-label={language.name}
      lang={language.id}
      onclick={() => setLanguage(language.id)}
    >
      {language.short}
    </button>
  {/each}
</div>

<style>
  .switch {
    display: inline-flex;
    gap: 0.15rem;
    padding: 0.2rem;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: var(--surface);
  }

  button {
    min-width: 2.6rem;
    min-height: 2.25rem;
    padding: 0 0.6rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ink-faint);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition:
      background-color 0.3s var(--ease-spring),
      color 0.3s var(--ease-spring);
  }

  button:hover {
    color: var(--ink);
  }

  button.on {
    background: var(--surface-raised);
    color: var(--ink);
    box-shadow: var(--highlight);
  }

  @media (max-width: 420px) {
    button {
      min-width: 2.15rem;
      padding: 0 0.4rem;
    }
  }
</style>
