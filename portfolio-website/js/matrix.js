(() => {
  const body = document.body;
  const canvas = document.querySelector("#matrix-rain");
  const effectToggle = document.querySelector("#effect-toggle");
  const bootSequence = document.querySelector("#boot-sequence");
  const bootTrack = document.querySelector("#boot-track");
  const bootPercent = document.querySelector("#boot-percent");
  const bootLog = document.querySelector("#boot-log");
  const systemClock = document.querySelector("#system-clock");
  const typedRole = document.querySelector("[data-type-text]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateClock = () => {
    if (!systemClock) return;

    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());

    systemClock.textContent = `${time} PHT`;
  };

  updateClock();
  window.setInterval(updateClock, 1000);

  const typeRole = () => {
    if (!typedRole || reduceMotion.matches) return;

    const message = typedRole.dataset.typeText ?? typedRole.textContent;
    let index = 0;
    typedRole.textContent = "";

    const writeNextCharacter = () => {
      typedRole.textContent = message.slice(0, index);
      index += 1;
      if (index <= message.length) window.setTimeout(writeNextCharacter, 27);
    };

    writeNextCharacter();
  };

  const runBootSequence = () => {
    if (!bootSequence || reduceMotion.matches) {
      bootSequence?.classList.add("is-complete");
      typeRole();
      return;
    }

    const startedAt = performance.now();
    const duration = 1120;
    const bootMessages = [
      "Aligning light field...",
      "Resolving identity spectrum...",
      "Mapping project signals...",
      "Hologram stable."
    ];

    const updateBoot = (time) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const percent = Math.round(easedProgress * 100);

      if (bootTrack) bootTrack.style.width = `${percent}%`;
      if (bootPercent) bootPercent.textContent = `${String(percent).padStart(2, "0")}%`;
      if (bootLog) {
        const messageIndex = Math.min(bootMessages.length - 1, Math.floor(progress * bootMessages.length));
        bootLog.textContent = bootMessages[messageIndex];
      }

      if (progress < 1) {
        window.requestAnimationFrame(updateBoot);
        return;
      }

      window.setTimeout(() => {
        bootSequence.classList.add("is-complete");
        typeRole();
      }, 160);
    };

    window.requestAnimationFrame(updateBoot);
  };

  runBootSequence();

  effectToggle?.addEventListener("click", () => {
    const isPaused = body.classList.toggle("matrix-paused");
    effectToggle.setAttribute("aria-pressed", String(isPaused));
    effectToggle.setAttribute(
      "aria-label",
      isPaused ? "Resume particle animation" : "Pause particle animation"
    );
  });

  const setupProjectTilt = () => {
    if (reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll(".project-card").forEach((card) => {
      let frame = 0;
      let nextX = 0;
      let nextY = 0;

      const renderTilt = () => {
        const bounds = card.getBoundingClientRect();
        const normalizedX = Math.min(1, Math.max(0, (nextX - bounds.left) / bounds.width));
        const normalizedY = Math.min(1, Math.max(0, (nextY - bounds.top) / bounds.height));
        const rotateY = (normalizedX - 0.5) * 12;
        const rotateX = (0.5 - normalizedY) * 12;

        card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--glare-x", `${(normalizedX * 100).toFixed(1)}%`);
        card.style.setProperty("--glare-y", `${(normalizedY * 100).toFixed(1)}%`);
        frame = 0;
      };

      card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
      card.addEventListener("pointermove", (event) => {
        nextX = event.clientX;
        nextY = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(renderTilt);
      });
      card.addEventListener("pointerleave", () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--glare-x", "50%");
        card.style.setProperty("--glare-y", "50%");
      });
    });
  };

  setupProjectTilt();

  if (!canvas || reduceMotion.matches) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const palette = [
    [98, 246, 255],
    [167, 123, 255],
    [255, 121, 201],
    [255, 155, 143]
  ];
  const pointer = { x: -1000, y: -1000, active: false };
  let particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let lastFrame = 0;

  const createParticle = () => {
    const color = palette[Math.floor(Math.random() * palette.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.17,
      vy: (Math.random() - 0.5) * 0.17 - 0.035,
      radius: Math.random() * 1.45 + 0.45,
      alpha: Math.random() * 0.48 + 0.18,
      phase: Math.random() * Math.PI * 2,
      color
    };
  };

  const resizeCanvas = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const density = width < 640 ? 12000 : 9000;
    const particleCount = Math.max(30, Math.min(110, Math.round((width * height) / density)));
    particles = Array.from({ length: particleCount }, createParticle);
  };

  const drawConnection = (first, second, distance) => {
    const maxDistance = width < 640 ? 82 : 112;
    if (distance >= maxDistance) return;
    const opacity = (1 - distance / maxDistance) * 0.08;
    const gradient = context.createLinearGradient(first.x, first.y, second.x, second.y);
    gradient.addColorStop(0, `rgba(${first.color.join(",")},${opacity})`);
    gradient.addColorStop(1, `rgba(${second.color.join(",")},${opacity})`);
    context.strokeStyle = gradient;
    context.lineWidth = 0.6;
    context.beginPath();
    context.moveTo(first.x, first.y);
    context.lineTo(second.x, second.y);
    context.stroke();
  };

  const drawParticles = (time) => {
    window.requestAnimationFrame(drawParticles);
    if (body.classList.contains("matrix-paused") || document.hidden || time - lastFrame < 30) return;
    const delta = Math.min(2, (time - lastFrame) / 16.67 || 1);
    lastFrame = time;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 26000 && distanceSquared > 1) {
          const force = (1 - distanceSquared / 26000) * 0.0014;
          particle.vx += dx * force;
          particle.vy += dy * force;
        }
      }

      particle.vx *= 0.988;
      particle.vy *= 0.988;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.phase += 0.018 * delta;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      const shimmer = particle.alpha * (0.72 + Math.sin(particle.phase) * 0.28);
      const [red, green, blue] = particle.color;
      context.shadowColor = `rgba(${red},${green},${blue},0.45)`;
      context.shadowBlur = 9;
      context.fillStyle = `rgba(${red},${green},${blue},${shimmer})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        drawConnection(particle, other, distance);
      }
    });
  };

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("blur", () => { pointer.active = false; });
  window.addEventListener("resize", resizeCanvas, { passive: true });

  resizeCanvas();
  window.requestAnimationFrame(drawParticles);
})();
