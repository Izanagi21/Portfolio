(() => {
  const body = document.body;
  const heroVisual = document.querySelector(".hero-visual");
  const progressBar = document.querySelector("#page-progress-bar");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const markReady = () => {
    window.requestAnimationFrame(() => body.classList.add("is-loaded"));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markReady, { once: true });
  } else {
    markReady();
  }

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar?.style.setProperty("transform", `scaleX(${progress})`);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });

  updateProgress();

  if (!heroVisual || reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    heroVisual.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
    heroVisual.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--pointer-x", "0px");
    heroVisual.style.setProperty("--pointer-y", "0px");
  });
})();
