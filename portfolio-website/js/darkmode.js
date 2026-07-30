(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#020617" : "#2563eb");
  };

  applyTheme(savedTheme ?? (systemPrefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
})();
