(() => {
  if (!window.AOS) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    document.documentElement.classList.add("motion-enhanced");
  }

  AOS.init({
    duration: 650,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    offset: 55,
    disable: prefersReducedMotion
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("motion-visible", entry.isIntersecting);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".timeline-panel").forEach((panel) => timelineObserver.observe(panel));
})();
