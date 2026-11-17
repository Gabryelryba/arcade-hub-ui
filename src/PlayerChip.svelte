<script>
  import PencilSimple from "phosphor-svelte/lib/PencilSimple";
  import Avatar from "./Avatar.svelte";
  import { t } from "./i18n/index.svelte.js";

  let { name, onEdit } = $props();
</script>

<button class="chip" onclick={onEdit} aria-label={name ? t("chip.label", { name }) : t("chip.choose")}>
  {#if name}
    <Avatar {name} />
    <span class="label">
      <span class="caption">{t("chip.caption")}</span>
      <span class="name" translate="no">{name}</span>
    </span>
  {:else}
    <span class="label solo"><span class="name">{t("chip.add")}</span></span>
  {/if}
  <PencilSimple size={16} weight="light" aria-hidden="true" />
</button>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    max-width: 100%;
    min-height: 2.75rem;
    padding: 0.3rem 0.85rem 0.3rem 0.35rem;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: var(--surface);
    color: var(--ink-muted);
    cursor: pointer;
    transition:
      background-color 0.18s var(--ease-out),
      color 0.18s var(--ease-out),
      transform 0.18s var(--ease-out);
  }

  .chip:hover {
    background: var(--surface-raised);
    color: var(--ink);
  }

  .chip:active {
    transform: scale(0.98);
  }

  .label {
    display: grid;
    min-width: 0;
    text-align: left;
    line-height: 1.15;
  }

  .label.solo {
    padding-left: 0.5rem;
  }

  .caption {
    font-size: 0.72rem;
    color: var(--ink-faint);
  }

  .name {
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 11rem;
  }

  /* On a phone the chip sits in the top corner: with a name it keeps only the
     avatar and the pencil (its aria-label still says the name). Without one,
     "Add Name" stays, so the player knows what it is for. */
  @media (max-width: 640px) {
    .chip:has(.caption) .label {
      display: none;
    }

    .chip:has(.caption) {
      gap: 0.45rem;
      padding: 0.3rem 0.7rem 0.3rem 0.35rem;
    }
  }
</style>
