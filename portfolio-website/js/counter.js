(() => {
  const counters = document.querySelectorAll(".counter");
  const activeAnimations = new WeakMap();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.target) || 0;
    });
    return;
  }

  const animateCounter = (counter) => {
    const previousAnimation = activeAnimations.get(counter);
    if (previousAnimation) cancelAnimationFrame(previousAnimation);

    const target = Number(counter.dataset.target) || 0;
    const duration = 1100;
    const startTime = performance.now();

    const update = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);

      if (progress < 1) {
        activeAnimations.set(counter, requestAnimationFrame(update));
      } else {
        counter.textContent = target;
        activeAnimations.delete(counter);
      }
    };

    activeAnimations.set(counter, requestAnimationFrame(update));
  };

  const resetCounter = (counter) => {
    const activeAnimation = activeAnimations.get(counter);
    if (activeAnimation) cancelAnimationFrame(activeAnimation);
    activeAnimations.delete(counter);
    counter.textContent = "0";
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      } else {
        resetCounter(entry.target);
      }
    });
  }, { threshold: 0.7 });

  counters.forEach((counter) => counterObserver.observe(counter));
})();
