(() => {
  const header = document.querySelector("#site-header");
  const menuToggle = document.querySelector("#menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const backToTop = document.querySelector("#back-to-top");
  const toast = document.querySelector("#toast");
  const resumeButton = document.querySelector("#resume-button");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const tabButtons = [...document.querySelectorAll(".qualification-tab")];
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  };

  window.portfolioToast = showToast;

  const closeMobileNavigation = () => {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  });

  document.addEventListener("click", (event) => {
    if (mobileNav?.hidden || header?.contains(event.target)) return;
    closeMobileNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || mobileNav?.hidden) return;
    closeMobileNavigation();
    menuToggle?.focus();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  resumeButton?.addEventListener("click", (event) => {
    if (resumeButton.getAttribute("href") === "#") {
      event.preventDefault();
      showToast("Your résumé slot is ready. Add the PDF path to the button when your résumé is finished.");
    }
  });

  document.querySelectorAll('a[href="#"]:not(#resume-button)').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetName = button.dataset.tab;

      tabButtons.forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });

      document.querySelectorAll(".timeline-panel").forEach((panel) => {
        const isTarget = panel.id === `${targetName}-panel`;
        panel.hidden = !isTarget;
        panel.classList.toggle("active", isTarget);
      });
    });
  });

  const updateScrollState = () => {
    const scrollPosition = window.scrollY + Math.min(280, window.innerHeight * 0.32);
    header?.classList.toggle("scrolled", window.scrollY > 20);
    backToTop?.classList.toggle("visible", window.scrollY > 650);

    let currentSection = sections[0]?.id ?? "home";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) currentSection = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
    });
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMobileNavigation();
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const currentYear = document.querySelector("#current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  window.lucide?.createIcons();
  updateScrollState();
})();
