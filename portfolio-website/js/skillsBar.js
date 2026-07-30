(() => {
  const skillItems = document.querySelectorAll(".skill-item");

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const level = Math.min(100, Math.max(0, Number(entry.target.dataset.level) || 0));
      const progressBar = entry.target.querySelector(".skill-progress");
      if (progressBar) progressBar.style.width = `${level}%`;
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  skillItems.forEach((item) => skillObserver.observe(item));
})();
