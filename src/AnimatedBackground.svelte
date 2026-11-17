<script>
  import { onMount } from "svelte";

  let layer;

  // The pointer parallax writes CSS variables straight onto the layer, at most
  // once per frame, so moving the mouse never re-renders anything.
  onMount(() => {
    // Pure decoration: skipped for reduced motion and for touch-only devices.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (evt) => {
      x = evt.clientX / window.innerWidth - 0.5;
      y = evt.clientY / window.innerHeight - 0.5;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        layer.style.setProperty("--px", `${x * 28}px`);
        layer.style.setProperty("--py", `${y * 28}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  });
</script>

<div class="bg" aria-hidden="true">
  <div class="wash" bind:this={layer}></div>
  <div class="stars"></div>
  <div class="grain"></div>
</div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: var(--bg);
    pointer-events: none;
  }

  /* A dark plum glow from the top, a little teal beside it and pale teal low
     on the other side, drifting very slowly. */
  .wash {
    position: absolute;
    inset: -20%;
    background:
      radial-gradient(60% 45% at 30% 8%, var(--glow-deep), transparent 72%),
      radial-gradient(36% 30% at 24% 16%, var(--glow-accent), transparent 70%),
      radial-gradient(34% 30% at 84% 86%, var(--glow-soft), transparent 70%);
    transform: translate3d(var(--px, 0px), var(--py, 0px), 0);
    transition: transform 0.6s var(--ease-out);
    animation: drift 40s ease-in-out infinite alternate;
  }

  @keyframes drift {
    to {
      translate: 3% 2%;
    }
  }

  /* Stars: tiny dots, denser and brighter near the top of the screen, slowly
     breathing. Two layers, so they never pulse all at once. */
  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1.5px 1.5px at 12% 18%, rgba(255, 255, 255, 0.5) 50%, transparent 50%),
      radial-gradient(1px 1px at 27% 62%, rgba(255, 255, 255, 0.32) 50%, transparent 50%),
      radial-gradient(1px 1px at 41% 9%, rgba(255, 255, 255, 0.45) 50%, transparent 50%),
      radial-gradient(1.5px 1.5px at 58% 32%, rgba(255, 255, 255, 0.28) 50%, transparent 50%),
      radial-gradient(1px 1px at 73% 14%, rgba(255, 255, 255, 0.5) 50%, transparent 50%),
      radial-gradient(1px 1px at 86% 41%, rgba(255, 255, 255, 0.28) 50%, transparent 50%),
      radial-gradient(1px 1px at 94% 7%, rgba(255, 255, 255, 0.4) 50%, transparent 50%),
      radial-gradient(1px 1px at 6% 46%, rgba(255, 255, 255, 0.24) 50%, transparent 50%);
    background-size: 640px 520px;
    mask-image: linear-gradient(180deg, black, transparent 80%);
    animation: twinkle 7s ease-in-out infinite alternate;
  }

  .stars::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 18% 34%, rgba(255, 255, 255, 0.4) 50%, transparent 50%),
      radial-gradient(1.5px 1.5px at 47% 21%, rgba(255, 255, 255, 0.36) 50%, transparent 50%),
      radial-gradient(1px 1px at 66% 58%, rgba(255, 255, 255, 0.3) 50%, transparent 50%),
      radial-gradient(1px 1px at 81% 26%, rgba(255, 255, 255, 0.32) 50%, transparent 50%),
      radial-gradient(1px 1px at 33% 4%, rgba(255, 255, 255, 0.45) 50%, transparent 50%);
    background-size: 460px 380px;
    animation: twinkle 9s ease-in-out -4s infinite alternate;
  }

  @keyframes twinkle {
    from {
      opacity: 0.55;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stars,
    .stars::after {
      animation: none;
    }
  }

  .grain {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }
</style>
