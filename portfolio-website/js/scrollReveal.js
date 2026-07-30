(() => {
  if (!window.AOS) return;

  AOS.init({
    duration: 650,
    easing: "ease-out-cubic",
    once: true,
    offset: 55,
    disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });
})();
