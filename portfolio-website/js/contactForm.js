(() => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");

  if (!form || !status) return;

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.style.color = isError ? "#ef4444" : "";
  };

  form.addEventListener("input", (event) => {
    event.target.classList.remove("invalid");
    setStatus("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("[required]")];
    let firstInvalidField;

    fields.forEach((field) => {
      const isValid = field.checkValidity();
      field.classList.toggle("invalid", !isValid);
      if (!isValid && !firstInvalidField) firstInvalidField = field;
    });

    if (firstInvalidField) {
      setStatus("Please complete all fields with valid information.", true);
      firstInvalidField.focus();
      return;
    }

    const endpoint = form.getAttribute("action")?.trim();
    if (!endpoint) {
      setStatus("The form is ready. Add your Formspree endpoint to activate message delivery.");
      window.portfolioToast?.("Contact form validated successfully. Add a Formspree endpoint when you are ready.");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setStatus("Sending your message…");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form request failed");

      form.reset();
      setStatus("Thanks! Your message has been sent.");
    } catch {
      setStatus("Your message could not be sent. Please try again later.", true);
    } finally {
      submitButton.disabled = false;
    }
  });
})();
