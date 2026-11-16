<script>
  import Crown from "phosphor-svelte/lib/Crown";
  import Avatar from "./Avatar.svelte";
  import { t } from "./i18n/index.svelte.js";

  // me / them: { name, computer? }. active: whose turn it is ("me" | "them" | null).
  // winner: who won, once the game is over ("me" | "them" | null).
  let { me, them, active = null, winner = null } = $props();
</script>

<div class="versus" role="group" aria-label={t("stickSlash.players")}>
  <div class="side me" class:active={active === "me"} class:won={winner === "me"}>
    <Avatar name={me.name} />
    <span class="text">
      <span class="name" translate="no">{me.name}</span>
      <span class="meta">
        {#if winner === "me"}<Crown size={12} weight="fill" aria-hidden="true" /> {t("stickSlash.won")}{:else}{t("common.you")}{/if}
      </span>
    </span>
    <span class="bar" aria-hidden="true"></span>
  </div>

  <span class="vs" aria-hidden="true">{t("stickSlash.vs")}</span>

  <div class="side them" class:active={active === "them"} class:won={winner === "them"}>
    <span class="text">
      <span class="name" translate="no">{them.name}</span>
      <span class="meta">
        {#if winner === "them"}<Crown size={12} weight="fill" aria-hidden="true" /> {t("stickSlash.won")}{:else}{them.computer
            ? t("stickSlash.computer")
            : t("stickSlash.opponent")}{/if}
      </span>
    </span>
    <Avatar name={them.name} muted />
    <span class="bar" aria-hidden="true"></span>
  </div>
  <!-- Whose turn it is is announced by the status line under this row. -->
</div>

<style>
  .versus {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 30rem;
  }

  .side {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
    padding-bottom: 0.45rem;
  }

  .them {
    justify-content: flex-end;
    text-align: right;
  }

  .text {
    display: grid;
    min-width: 0;
    line-height: 1.15;
  }

  .name {
    font-weight: 600;
    color: var(--ink-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.25s var(--ease-out);
  }

  .meta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.72rem;
    color: var(--ink-faint);
  }

  .them .meta {
    justify-content: flex-end;
  }

  .active .name {
    color: var(--ink);
  }

  .won .name,
  .won .meta {
    color: var(--gold);
  }

  /* The turn marker: a short accent bar under whoever plays, growing from their side. */
  .bar {
    position: absolute;
    bottom: 0;
    height: 2px;
    width: min(7rem, 100%);
    border-radius: 999px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.35s var(--ease-out);
  }

  .me .bar {
    left: 0;
    transform-origin: left center;
  }

  .them .bar {
    right: 0;
    transform-origin: right center;
  }

  .active .bar {
    transform: scaleX(1);
  }

  /* A phone held sideways: one line per player. */
  @media (max-height: 560px) {
    .meta {
      display: none;
    }

    .side,
    .vs {
      padding-bottom: 0.3rem;
    }
  }

  .vs {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-faint);
    padding-bottom: 0.45rem;
  }
</style>
