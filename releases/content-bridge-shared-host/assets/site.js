(() => {
  "use strict";

  const script = document.currentScript || document.querySelector("script[data-content-bridge-site]");
  const siteRoot = new URL("../", script.src);
  const isEnglish = document.documentElement.lang === "en";
  const tr = (fa, en) => isEnglish ? en : fa;
  const startedAt = Date.now();

  document.querySelectorAll(".language-switch[data-site-path]").forEach((link) => {
    link.href = new URL(link.dataset.sitePath || "./", siteRoot).href;
  });

  const revealElements = document.querySelectorAll(
    ".section-heading, .problem-grid article, .process-item, .labour-table-wrap, .agent-card, .feature-card, .promise-card, .custom-site-card, .plugin-download-card, .seo-stat-grid article, .seo-response-grid, .roadmap-item, .guardrail-card, .price-card, .banner-samples, .all-plans-card, .geo-card, .faq-intro, .faq-list article, .contact-copy, .contact-form"
  );
  if ("IntersectionObserver" in window) {
    revealElements.forEach((element) => element.classList.add("motion-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("motion-visible"));
  }

  const form = document.querySelector(".contact-form");
  const planSelect = form?.querySelector('select[name="plan"]');
  document.querySelectorAll(".plan-button").forEach((button) => {
    button.type = "button";
    button.addEventListener("click", () => {
      const plan = button.closest(".price-card")?.querySelector("h3")?.textContent?.trim();
      if (planSelect && plan) planSelect.value = plan;
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (!form) return;
  const submitButton = form.querySelector('button[type="submit"]');
  const privacy = form.querySelector(".privacy");
  const feedback = document.createElement("p");
  feedback.className = "form-feedback";
  feedback.setAttribute("role", "status");
  privacy?.before(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.textContent = "";
    feedback.className = "form-feedback";
    submitButton.disabled = true;
    const originalLabel = submitButton.innerHTML;
    submitButton.textContent = tr("در حال ارسال…", "Sending…");

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.startedAt = startedAt;
    payload.locale = isEnglish ? "en" : "fa";

    try {
      const response = await fetch(new URL("contact.php", siteRoot), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || tr("ارسال انجام نشد.", "The request could not be sent."));
      feedback.className = "form-feedback success";
      feedback.textContent = result.message || tr("درخواست شما ثبت شد.", "Your request has been received.");
      form.reset();
    } catch (error) {
      feedback.className = "form-feedback error";
      feedback.textContent = error instanceof Error ? error.message : tr("خطایی رخ داد.", "Something went wrong.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
})();
