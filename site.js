(function () {
  const CONTACT_FALLBACK_EMAIL = "contact.searsystems@gmail.com";
  const DEFAULT_CONTACT_ENDPOINT = "https://formspree.io/f/mwvagojn";

  const toastRoot = document.createElement("div");
  toastRoot.className = "toast-stack";
  document.body.appendChild(toastRoot);

  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;
    toastRoot.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.remove();
      }, 260);
    }, 3400);
  };

  const path = window.location.pathname.split("/").pop() || "index.html";
  const normalizedPath = path === "" ? "index.html" : path;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.getAttribute("href") === normalizedPath) {
      link.classList.add("active");
    }
  });

  const yearSlot = document.getElementById("year");
  if (yearSlot) {
    yearSlot.textContent = String(new Date().getFullYear());
  }

  const revealTargets = document.querySelectorAll(
    ".hero-card, .matrix, .feature, .panel, .section-title, .timeline .item, .person-card, .footer"
  );

  revealTargets.forEach((el, index) => {
    el.classList.add("auto-reveal");
    el.style.setProperty("--delay", `${(index % 8) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));

  const sendContactForm = async (form) => {
    const submitButton = form.querySelector("button[type='submit']");
    const statusSlot = form.querySelector("#contact-status, [data-contact-status], .contact-status");

    const resolveContactEndpoint = () => {
      const fromForm = String(form?.getAttribute("data-contact-endpoint") || "").trim();
      const fromMeta = String(
        document.querySelector("meta[name='contact-form-endpoint']")?.getAttribute("content") || ""
      ).trim();
      return fromForm || fromMeta || DEFAULT_CONTACT_ENDPOINT;
    };
    if (!submitButton || !statusSlot) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      organization: String(formData.get("organization") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      reason: String(formData.get("reason") || "General Inquiry").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    };

    statusSlot.textContent = "Sending...";
    statusSlot.classList.remove("is-error", "is-success");
    submitButton.disabled = true;

    try {
      if (!["http:", "https:"].includes(window.location.protocol)) {
        throw new Error("Form submission is unavailable on file preview. Open this site from a web host URL.");
      }

      const endpoint = resolveContactEndpoint();
      const controller = new AbortController();
      const timeoutRef = setTimeout(() => controller.abort(), 15000);

      const submission = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        submission.append(key, value);
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: submission,
        signal: controller.signal,
      });
      clearTimeout(timeoutRef);

      let result = { ok: false, message: "Could not send message." };
      const responseType = String(response.headers.get("content-type") || "").toLowerCase();
      if (responseType.includes("application/json")) {
        const json = await response.json();
        const providerError = Array.isArray(json?.errors) && json.errors.length > 0
          ? String(json.errors[0]?.message || "")
          : "";

        result = {
          ok: Boolean(response.ok && (json?.ok !== false)),
          message: providerError || json?.message || "Message sent. We will get back to you soon.",
        };
      } else {
        result = {
          ok: false,
          message: `Could not send message right now. Please email us directly at ${CONTACT_FALLBACK_EMAIL}.`,
        };
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Could not send message.");
      }

      form.reset();
      statusSlot.textContent = result.message || "Message sent successfully.";
      statusSlot.classList.add("is-success");
      showToast("Message sent successfully. We will get back to you soon.", "success");
    } catch (error) {
      let uiMessage = error?.message || "Message failed to send. Please try again.";

      if (error?.name === "AbortError") {
        uiMessage = "Request timed out. Please check your network and try again.";
      } else if (uiMessage.toLowerCase().includes("failed to fetch")) {
        uiMessage = `Connection failed. Please try again or email us directly at ${CONTACT_FALLBACK_EMAIL}.`;
      }

      statusSlot.textContent = uiMessage;
      statusSlot.classList.add("is-error");
      showToast(uiMessage, "error");
    } finally {
      submitButton.disabled = false;
    }
  };

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (!form.matches(".contact-form")) {
      return;
    }

    event.preventDefault();
    sendContactForm(form);
  });
  document.querySelectorAll(".person-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      card.style.transform = `
        translateY(-10px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const flowRoot = document.querySelector(".home-flow");
  const flowSteps = Array.from(document.querySelectorAll("[data-flow-step]"));

  if (flowRoot && flowSteps.length > 0) {
    const inlineCache = new Map();

    const buildInlineHtml = (doc) => {
      const heroCard = doc.querySelector(".hero-card");
      const pageMain = doc.querySelector(".page-main");
      if (!heroCard && !pageMain) {
        return "<p class=\"inline-loading\">Could not load deep-dive content.</p>";
      }

      const heroPart = heroCard
        ? `<section class=\"hero\"><article class=\"hero-card\">${heroCard.innerHTML}</article></section>`
        : "";
      const mainPart = pageMain ? `<section class=\"page-main\">${pageMain.innerHTML}</section>` : "";
      return `${heroPart}${mainPart}`;
    };

    const loadStepContent = async (step) => {
      const source = step.getAttribute("data-source");
      const panel = step.querySelector(".inline-panel");
      if (!source || !panel) {
        return;
      }

      if (inlineCache.has(source)) {
        panel.innerHTML = inlineCache.get(source);
        return;
      }

      panel.innerHTML = '<p class="inline-loading">Loading deep-dive details...</p>';

      try {
        const response = await fetch(source, {
          headers: {
            "X-Requested-With": "inline-deep-dive",
          },
        });

        if (!response.ok) {
          throw new Error("load-failed");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const inlineHtml = buildInlineHtml(doc);
        inlineCache.set(source, inlineHtml);
        panel.innerHTML = inlineHtml;
      } catch {
        panel.innerHTML = "<p class=\"inline-loading\">Could not load deep-dive content right now. Use the page link above.</p>";
      }
    };

    const openStep = async (step) => {
      const panel = step.querySelector(".inline-panel");
      if (!panel) {
        return;
      }

      await loadStepContent(step);
      panel.hidden = false;
    };

    flowRoot.classList.add("inline-mode");

    const openAllSteps = async () => {
      for (const step of flowSteps) {
        await openStep(step);
      }
    };

    openAllSteps();
  }

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) {
        return;
      }

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqItems.forEach((otherItem) => {
          const otherButton = otherItem.querySelector(".faq-question");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (!otherButton || !otherAnswer) {
            return;
          }

          otherItem.classList.remove("is-open");
          otherButton.setAttribute("aria-expanded", "false");
          otherAnswer.hidden = true;
        });

        if (!isOpen) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          answer.hidden = false;
        }
      });
    });
  }
})();
