/* VICTORIANO FACES — interactions */
const SITE_CONFIG = {
  // Configure com o WhatsApp oficial da clínica, usando país + DDD + número, somente dígitos.
  // Exemplo de formato: 5511999999999
  whatsappNumber: "",
  clinicName: "Victoriano Faces"
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const progressBar = document.getElementById("reading-progress-bar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("main-navigation");
  const leadForm = document.getElementById("lead-form");
  const feedback = document.getElementById("form-feedback");
  const privacyDialog = document.getElementById("privacy-dialog");
  const closePrivacyButtons = document.querySelectorAll("[data-close-privacy]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let previousFocus = null;

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Sticky header + reading progress.
  const updateScrollChrome = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle("is-scrolled", scrollY > 24);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;
  };
  updateScrollChrome();
  window.addEventListener("scroll", updateScrollChrome, { passive: true });
  window.addEventListener("resize", updateScrollChrome, { passive: true });

  // Mobile navigation.
  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
    navigation?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };
  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closePrivacyDialog();
    }
  });

  // Reveal content progressively while scrolling. Content stays visible if JS or IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach((item) => observer.observe(item));
    document.querySelectorAll(".hero .reveal").forEach((item) => item.classList.add("is-visible"));
    document.documentElement.classList.add("js-ready");
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Infinite before-and-after carousel: eight case pairs, duplicated for a seamless loop.
  const caseMarquee = document.querySelector("[data-case-marquee]");
  const marqueeTrack = caseMarquee?.querySelector("[data-marquee-track]");
  const originalGroup = caseMarquee?.querySelector("[data-marquee-original]");
  const marqueeToggle = caseMarquee?.querySelector("[data-marquee-toggle]");
  const marqueeToggleLabel = caseMarquee?.querySelector("[data-marquee-toggle-label]");
  const marqueeToggleIcon = caseMarquee?.querySelector("[data-marquee-toggle-icon]");

  if (caseMarquee && marqueeTrack && originalGroup && !reduceMotion) {
    const cloneGroup = originalGroup.cloneNode(true);
    cloneGroup.removeAttribute("data-marquee-original");
    cloneGroup.setAttribute("data-marquee-clone", "true");
    cloneGroup.setAttribute("aria-hidden", "true");
    // Cloned cases are decorative duplicates; remove any future focusables from the a11y tree.
    cloneGroup.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((node) => {
      node.setAttribute("tabindex", "-1");
      node.setAttribute("aria-hidden", "true");
    });
    marqueeTrack.appendChild(cloneGroup);
    caseMarquee.classList.add("is-looping");
  }

  const setMarqueePaused = (paused) => {
    if (!caseMarquee || !marqueeToggle) return;
    caseMarquee.classList.toggle("is-paused", paused);
    marqueeToggle.setAttribute("aria-pressed", String(paused));
    if (marqueeToggleLabel) marqueeToggleLabel.textContent = paused ? "Retomar movimento" : "Pausar movimento";
    if (marqueeToggleIcon) marqueeToggleIcon.textContent = paused ? "▶" : "Ⅱ";
  };
  marqueeToggle?.addEventListener("click", () => {
    setMarqueePaused(!caseMarquee.classList.contains("is-paused"));
  });

  // Subtle pointer-responsive reflection for Liquid Glass surfaces.
  // The effect is disabled for touch-only devices and reduced-motion preferences.
  const glassPanels = document.querySelectorAll(".glass-panel");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    glassPanels.forEach((panel) => {
      panel.addEventListener("pointermove", (event) => {
        const rect = panel.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
        panel.style.setProperty("--glass-x", `${x}%`);
        panel.style.setProperty("--glass-y", `${y}%`);
      }, { passive: true });
      panel.addEventListener("pointerleave", () => {
        panel.style.setProperty("--glass-x", "50%");
        panel.style.setProperty("--glass-y", "0%");
      }, { passive: true });
    });
  }

  // Brazilian phone mask.
  const phoneInput = document.getElementById("phone");
  phoneInput?.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) phoneInput.value = digits.length ? `(${digits}` : "";
    else if (digits.length <= 6) phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else if (digits.length <= 10) phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    else phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    phoneInput.removeAttribute("aria-invalid");
  });

  // Validate locally first. If configured, prepare a message for WhatsApp; no database is connected.
  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!feedback || !phoneInput) return;
    feedback.textContent = "";
    feedback.classList.remove("is-error");

    const name = document.getElementById("full-name");
    const city = document.getElementById("city");
    const interest = document.getElementById("interest");
    const timing = document.getElementById("timing");
    const privacy = document.getElementById("privacy-consent");
    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    const requiredFields = [name, phoneInput, city, interest, timing].filter(Boolean);
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const invalid = !String(field.value || "").trim() || !field.checkValidity();
      field.setAttribute("aria-invalid", String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      phoneInput.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = phoneInput;
    }
    if (privacy && !privacy.checked) {
      privacy.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = privacy;
    } else {
      privacy?.removeAttribute("aria-invalid");
    }
    if (firstInvalid) {
      feedback.classList.add("is-error");
      feedback.textContent = firstInvalid === phoneInput && phoneDigits.length < 10
        ? "Informe um WhatsApp com DDD válido para que a equipe possa retornar."
        : "Confira os campos destacados e aceite a Política de Privacidade para continuar.";
      firstInvalid.focus({ preventScroll: false });
      return;
    }

    const message = [
      `Olá! Gostaria de solicitar contato com a ${SITE_CONFIG.clinicName}.`, "",
      `Nome: ${name.value.trim()}`,
      `WhatsApp: ${phoneInput.value.trim()}`,
      `Cidade: ${city.value.trim()}`,
      `Interesse: ${interest.value}`,
      `Momento: ${timing.value}`, "",
      "Solicitação enviada pelo formulário da landing page de lipo de papada."
    ].join("\n");

    const whatsappDigits = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
    if (whatsappDigits.length >= 12 && whatsappDigits.length <= 13) {
      const whatsappURL = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
      const opened = window.open(whatsappURL, "_blank");
      if (opened) {
        opened.opener = null;
        feedback.textContent = "A mensagem foi preparada no WhatsApp. Envie-a na conversa aberta para concluir sua solicitação.";
        leadForm.reset();
        phoneInput.value = "";
      } else {
        feedback.textContent = "O navegador bloqueou a nova aba. Permita a abertura ou entre em contato pelo canal oficial da clínica.";
        feedback.classList.add("is-error");
      }
    } else {
      feedback.textContent = "O formulário foi validado, mas o WhatsApp ainda não foi configurado. Insira o número oficial em SITE_CONFIG.whatsappNumber no arquivo script.js antes de publicar. Nenhum dado foi enviado ou armazenado.";
      feedback.classList.add("is-error");
    }
    feedback.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  });

  // Privacy dialog placeholder: replace the text with the clinic's official policy before launch.
  const openPrivacyDialog = (event) => {
    event.preventDefault();
    if (!privacyDialog) return;
    previousFocus = document.activeElement;
    privacyDialog.hidden = false;
    document.body.style.overflow = "hidden";
    privacyDialog.querySelector(".privacy-close")?.focus();
  };
  function closePrivacyDialog() {
    if (!privacyDialog || privacyDialog.hidden) return;
    privacyDialog.hidden = true;
    document.body.style.overflow = "";
    previousFocus?.focus?.();
  }
  document.querySelectorAll("[data-privacy-link]").forEach((link) => link.addEventListener("click", openPrivacyDialog));
  closePrivacyButtons.forEach((button) => button.addEventListener("click", closePrivacyDialog));
});
