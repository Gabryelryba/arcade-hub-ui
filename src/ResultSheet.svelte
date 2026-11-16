<script>
  import Crown from "phosphor-svelte/lib/Crown";
  import Check from "phosphor-svelte/lib/Check";
  import ArrowCounterClockwise from "phosphor-svelte/lib/ArrowCounterClockwise";
  import DoorOpen from "phosphor-svelte/lib/DoorOpen";
  import Avatar from "./Avatar.svelte";
  import { t } from "./i18n/index.svelte.js";

  // A sheet over the finished match (Dotz, Guess Word): the headline, everyone's
  // score from highest to lowest, and what to do next. Play Again is a vote: the
  // next match starts when everyone still here has voted. Waiting Room takes the
  // whole room back there.
  // head: { title, detail, won }; rows: from ranking(); vote: from rematchVote()
  // (src/lib/result.js). id: a prefix for the title's id.
  let { id, head, rows, vote, me, onPlayAgain, onBackToLobby, onMenu } = $props();
</script>

<div class="scrim" aria-hidden="true"></div>
<section class="sheet bezel" role="dialog" aria-modal="false" aria-labelledby="{id}-result-title">
  <div class="sheet-core bezel-core">
    <p class="kicker">{t("result.kicker")}</p>
    <h2 id="{id}-result-title" class:won={head.won}>{head.title}</h2>
    <p class="detail">{head.detail}</p>

    <ol class="ranking">
      {#each rows as row, i (row.index)}
        <li class="row" class:winner={row.winner} class:left={row.left} style:--i={i}>
          <span class="place">{i + 1}</span>
          <Avatar name={row.name} color={row.color} size="1.9rem" />
          <span class="name" translate="no">
            {row.index === me ? t("common.you") : row.name}{#if row.left}<span class="tag"> · {t("common.left")}</span>{/if}
          </span>
          {#if row.again}
            <span class="again" title={t("result.wantsAgain")}>
              <Check size={13} weight="bold" aria-hidden="true" />
              <span class="again-text">{t("result.again")}</span>
            </span>
          {/if}
          {#if row.winner}<Crown size={16} weight="fill" class="crown" aria-label={t("result.winner")} />{/if}
          <span class="score">{row.score}</span>
        </li>
      {/each}
    </ol>

    <p class="vote-note" aria-live="polite">{vote.note}</p>

    <div class="actions">
      <button
        class="btn btn-primary again-btn"
        class:voted={vote.mine}
        disabled={vote.mine || vote.alone}
        aria-pressed={vote.mine}
        onclick={onPlayAgain}
      >
        {#if vote.mine}
          <Check size={18} weight="bold" aria-hidden="true" /> {t("result.waitingOthers")}
        {:else}
          {t("common.playAgain")}
        {/if}
        <span class="orb count">
          {#if vote.alone}
            <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" />
          {:else}
            {vote.count}/{vote.total}
          {/if}
        </span>
      </button>
      <div class="secondary">
        <button class="btn btn-secondary" onclick={onBackToLobby}>
          <DoorOpen size={18} weight="light" aria-hidden="true" /> {t("result.waitingRoom")}
        </button>
        <button class="btn btn-ghost" onclick={onMenu}>{t("result.menu")}</button>
      </div>
    </div>
  </div>
</section>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: linear-gradient(to bottom, transparent 20%, rgba(3, 6, 13, 0.75));
    pointer-events: none;
    animation: fade 0.5s var(--ease-spring);
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
  }

  .sheet {
    position: fixed;
    z-index: 41;
    left: 50%;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    width: min(30rem, calc(100% - 1.5rem));
    translate: -50% 0;
    background: rgba(11, 15, 26, 0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    animation: rise 0.7s var(--ease-spring);
  }

  @keyframes rise {
    from {
      transform: translateY(40px);
      opacity: 0;
    }
  }

  /* One column no wider than the sheet: a long name gets an ellipsis instead
     of pushing the scores out on narrow phones. */
  .sheet-core {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
    padding: 1.3rem 1.3rem 1.2rem;
  }

  .kicker {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  h2 {
    font-size: clamp(2rem, 9vw, 2.6rem);
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.045em;
  }

  h2.won {
    color: var(--gold);
  }

  .detail {
    color: var(--ink-muted);
  }

  .ranking {
    list-style: none;
    margin: 0.75rem 0 0.4rem;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.3rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-height: 2.9rem;
    padding: 0.4rem 0.75rem 0.4rem 0.5rem;
    border-radius: 1rem;
    background: rgba(207, 224, 255, 0.03);
    animation: row-in 0.6s var(--ease-spring) backwards;
    animation-delay: calc(200ms + var(--i) * 80ms);
  }

  @keyframes row-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  .row.winner {
    background: var(--gold-soft);
  }

  .row.left {
    opacity: 0.6;
  }

  .place {
    width: 1.1rem;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--ink-faint);
  }

  .name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tag {
    font-weight: 500;
    color: var(--ink-faint);
  }

  .row :global(.crown) {
    flex: none;
    color: var(--gold);
  }

  .score {
    min-width: 1.6rem;
    text-align: right;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.1rem;
    font-variant-numeric: tabular-nums;
  }

  .again {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: var(--accent-text-soft);
    color: var(--accent-text);
    font-size: 0.72rem;
    font-weight: 600;
    animation: pop-in 0.4s var(--ease-spring);
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
  }

  .vote-note {
    min-height: 1.4em;
    color: var(--ink-muted);
    font-size: 0.88rem;
    text-align: center;
    text-wrap: balance;
  }

  .actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
    margin-top: 0.3rem;
  }

  .again-btn {
    width: 100%;
    justify-content: space-between;
    padding-left: 1.4rem;
  }

  /* Voted: the button stays lit (not greyed out) but no longer presses. */
  .again-btn.voted:disabled {
    opacity: 1;
    background: var(--accent-text-soft);
    color: var(--accent-text);
  }

  .orb.count {
    min-width: 2.6rem;
    width: auto;
    padding: 0 0.6rem;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }

  .secondary {
    display: flex;
    gap: 0.5rem;
  }

  .secondary .btn {
    flex: 1 1 0;
    min-width: 0;
  }

  /* The narrowest phones: the vote chip keeps its check, the name keeps the room. */
  @media (max-width: 380px) {
    .again-text {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    .again {
      padding: 0.2rem;
    }
  }

  @media (min-width: 900px) {
    .sheet {
      bottom: auto;
      top: 50%;
      translate: -50% -50%;
    }
  }
</style>
