(() => {
  const skillItems = document.querySelectorAll(".skill-item");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    skillItems.forEach((item) => {
      const level = Math.min(100, Math.max(0, Number(item.dataset.level) || 0));
      const progressBar = item.querySelector(".skill-progress");
      if (progressBar) progressBar.style.width = `${level}%`;
    });
    return;
  }

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const level = Math.min(100, Math.max(0, Number(entry.target.dataset.level) || 0));
      const progressBar = entry.target.querySelector(".skill-progress");
      if (progressBar) progressBar.style.width = entry.isIntersecting ? `${level}%` : "0%";
    });
  }, { threshold: 0.5 });

  skillItems.forEach((item) => skillObserver.observe(item));
})();
