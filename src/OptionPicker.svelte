<script>
  // One of a game's waiting-room settings, as a row of segments. The host picks
  // (the chosen segment is filled with the action colour, so it reads as a
  // control); everyone else sees the choice as a chip that pops when the host
  // changes it. The room's settings panel says who picks, once.
  // choices: [{ value, label, detail? }]. art: an optional snippet drawn above a
  // segment's text, given the choice and whether it is the one picked.
  // icon: an optional Phosphor icon shown before the legend.
  let { legend, label = legend, name, choices, value, editable = false, onChange = () => {}, art = null, icon = null } = $props();

  const chosen = $derived(choices.find((c) => c.value === value) ?? choices[0]);
  const Icon = $derived(icon);
</script>

<fieldset class="picker" disabled={!editable}>
  <legend>
    {#if Icon}<Icon size={18} weight="light" aria-hidden="true" />{/if}
    {legend}
  </legend>
  {#if editable}
    <div class="segments" role="radiogroup" aria-label={label} style:--count={choices.length}>
      {#each choices as choice (choice.value)}
        <label class="segment" class:on={value === choice.value}>
          <input type="radio" {name} value={choice.value} checked={value === choice.value} onchange={() => onChange(choice.value)} />
          {#if art}{@render art(choice, value === choice.value)}{/if}
          <span class="segment-text">
            <span>{choice.label}</span>
            {#if choice.detail}<span class="detail">{choice.detail}</span>{/if}
          </span>
        </label>
      {/each}
    </div>
  {:else}
    <p class="chosen">
      {#key chosen.value}
        <span class="value-chip">{chosen.label}{chosen.detail ? ` · ${chosen.detail}` : ""}</span>
      {/key}
    </p>
  {/if}
</fieldset>

<style>
  .picker {
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
    display: grid;
    gap: 0.55rem;
  }

  /* Floated, so the legend is an ordinary grid row and not drawn into the
     fieldset's top border (the settings panel puts a hairline there). */
  legend {
    float: left;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0;
    margin-bottom: 0.05rem;
    font-size: 0.92rem;
    font-weight: 600;
  }

  legend :global(svg) {
    color: var(--accent-text);
  }

  .segments {
    display: grid;
    grid-template-columns: repeat(var(--count), minmax(0, 1fr));
    gap: 0.35rem;
    padding: 0.3rem;
    border-radius: 1.4rem;
    background: var(--bg-deep);
    border: 1px solid var(--line-strong);
  }

  .segment {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 0.45rem;
    min-height: 2.75rem;
    padding: 0.55rem 0.4rem 0.5rem;
    border-radius: 1.1rem;
    color: var(--ink-muted);
    cursor: pointer;
    transition:
      background-color 0.35s var(--ease-spring),
      color 0.35s var(--ease-spring),
      transform 0.2s var(--ease-spring);
  }

  .segment input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .segment:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  .segment:active {
    transform: scale(0.97);
  }

  /* The pick wears the action colour: it is what the host pressed. */
  .segment.on {
    background: var(--accent);
    color: var(--accent-ink);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 8px 18px -12px rgba(0, 60, 160, 0.95);
  }

  .segment:has(input:focus-visible) {
    outline: 2px solid var(--accent-text);
    outline-offset: 2px;
  }

  .segment-text {
    display: grid;
    justify-items: center;
    line-height: 1.15;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .detail {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--ink-faint);
  }

  .on .detail {
    color: rgba(255, 255, 255, 0.78);
  }

  .chosen {
    margin: 0;
  }

  .value-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: var(--accent-soft);
    border: 1px solid rgba(0, 108, 240, 0.45);
    color: var(--ink);
    font-weight: 600;
    font-size: 0.92rem;
    animation: chip-in 0.6s var(--ease-spring);
  }

  /* A change made by the host lands with a small pop, so guests notice it. */
  @keyframes chip-in {
    from {
      transform: scale(0.88);
      background: rgba(0, 108, 240, 0.45);
    }
  }

  @media (max-width: 380px) {
    .segment-text {
      font-size: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .value-chip {
      animation: none;
    }

    .segment:active {
      transform: none;
    }
  }
</style>
