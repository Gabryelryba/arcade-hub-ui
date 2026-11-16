<script>
  // Recreio's mark: the school bell ringing for recess, in moon gold on
  // a raised tile. The same drawing is the favicon (public/favicon.svg).
</script>

<span class="wordmark" translate="no">
  <svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
    <g class="swing">
      <circle class="bell" cx="32" cy="15" r="3.5" />
      <path
        class="bell"
        d="M32 18c-8.3 0-13.5 6.2-13.5 14.6v6.4l-4.5 6.5h36l-4.5-6.5v-6.4C45.5 24.2 40.3 18 32 18z"
      />
      <circle class="clapper" cx="32" cy="49.5" r="4" />
    </g>
    <g class="ring">
      <path d="M48.5 17.5c2.6 2.1 4 5 4 8.4" />
      <path d="M15.5 21.5c-2.4 2.3-3.5 5.2-3.3 8.5" />
    </g>
  </svg>
  <span class="text">Recreio</span>
</span>

<style>
  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
    font-size: 1.02rem;
    letter-spacing: -0.02em;
    color: var(--ink);
    white-space: nowrap;
  }

  .mark {
    flex: none;
    width: 2rem;
    height: 2rem;
    padding: 2px;
    border-radius: 9px;
    background: var(--surface-raised);
    border: 1px solid var(--line-strong);
    overflow: visible;
  }

  .bell {
    fill: var(--gold);
  }

  .clapper {
    fill: var(--ink);
  }

  .ring path {
    fill: none;
    stroke: var(--ink);
    stroke-width: 3.2;
    stroke-linecap: round;
  }

  /* The bell leans as if mid-ring; on hover it gives one short swing. */
  .swing {
    transform-box: view-box;
    transform-origin: 32px 34px;
    transform: rotate(-14deg);
  }

  .wordmark:hover .swing {
    animation: ring 0.7s var(--ease-spring);
  }

  @keyframes ring {
    0% {
      transform: rotate(-14deg);
    }
    25% {
      transform: rotate(-26deg);
    }
    55% {
      transform: rotate(-4deg);
    }
    100% {
      transform: rotate(-14deg);
    }
  }

  /* The smallest phones share the top bar with the language switch and the
     name chip: keep the mark, and the name only for screen readers. */
  @media (max-width: 360px) {
    .text {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  }
</style>
