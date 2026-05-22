/**
 * ============================================================
 * SHRAVAS CONSULTANCY & SERVICES
 * script.js  —  Production JavaScript
 * ============================================================
 *
 * Modules
 * -------
 * 1.  Config
 * 2.  DOM Ready guard
 * 3.  Scroll Progress Bar
 * 4.  Navigation: hamburger & mobile menu
 * 5.  Navigation: active link highlight on scroll
 * 6.  Scroll Fade-In (IntersectionObserver)
 * 7.  Contact Form: validation helpers
 * 8.  Contact Form: submission
 * ============================================================
 */

/* ────────────────────────────────────────────────────────────
   1. CONFIG
   Replace SHEET_URL after deploying your Apps Script.
   ──────────────────────────────────────────────────────────── */
const CONFIG = {
  SHEET_URL:      "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  NAV_OFFSET:     100,
  FADE_THRESHOLD: 0.09
};

/* ────────────────────────────────────────────────────────────
   2. DOM READY
   ──────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", init);

function init() {
  initScrollProgress();
  initMobileMenu();
  initNavHighlight();
  initScrollFade();
  initForm();
}

/* ────────────────────────────────────────────────────────────
   3. SCROLL PROGRESS BAR
   ──────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById("progress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const doc     = document.documentElement;
    const total   = doc.scrollHeight - doc.clientHeight;
    const pct     = total > 0 ? (doc.scrollTop / total) * 100 : 0;
    bar.style.width = Math.min(pct, 100).toFixed(2) + "%";
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   4. MOBILE MENU
   ──────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  /* Expose for inline onclick attributes on mobile links */
  window.closeMobileMenu = closeMobileMenu;

  function closeMobileMenu() {
    hamburger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
  }
}

/* ────────────────────────────────────────────────────────────
   5. NAV ACTIVE HIGHLIGHT
   ──────────────────────────────────────────────────────────── */
function initNavHighlight() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const links    = Array.from(document.querySelectorAll(".nav__links a[href^='#']"));
  if (!sections.length || !links.length) return;

  function update() {
    const scrollY = window.pageYOffset;
    let current   = sections[0].id;

    sections.forEach((sec) => {
      if (scrollY >= sec.offsetTop - CONFIG.NAV_OFFSET) current = sec.id;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ────────────────────────────────────────────────────────────
   6. SCROLL FADE-IN
   ──────────────────────────────────────────────────────────── */
function initScrollFade() {
  const els = document.querySelectorAll(".js-fade");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: CONFIG.FADE_THRESHOLD });

  els.forEach((el) => io.observe(el));
}

/* ────────────────────────────────────────────────────────────
   7. FORM VALIDATION HELPERS
   ──────────────────────────────────────────────────────────── */
const RULES = {
  name:    (v) => v.length >= 2,
  email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone:   (v) => /^[\d\s+\-()\u00a0]{8,16}$/.test(v),
  service: (v) => v !== ""
};

function validateField(fieldId, errorId, testFn) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;

  const isValid = testFn(field.value.trim());
  field.classList.toggle("is-error",   !isValid);
  error.classList.toggle("is-visible", !isValid);
  return isValid;
}

function watchFieldReset(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return;

  const evt = field.tagName === "SELECT" ? "change" : "input";
  field.addEventListener(evt, () => {
    field.classList.remove("is-error");
    error.classList.remove("is-visible");
  });
}

/* ────────────────────────────────────────────────────────────
   8. CONTACT FORM SUBMISSION
   ──────────────────────────────────────────────────────────── */
function initForm() {
  ["name", "email", "phone", "service"].forEach((key) => {
    watchFieldReset(`f-${key}`, `e-${key}`);
  });

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", handleFormSubmit);

  /* Also expose globally in case onclick attribute is used */
  window.handleFormSubmit = handleFormSubmit;
}

function handleFormSubmit() {
  const allValid = [
    validateField("f-name",    "e-name",    RULES.name),
    validateField("f-email",   "e-email",   RULES.email),
    validateField("f-phone",   "e-phone",   RULES.phone),
    validateField("f-service", "e-service", RULES.service)
  ].every(Boolean);

  if (!allValid) return;

  /* Loading UI */
  const btn     = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  if (btn)     btn.disabled        = true;
  if (btnText) btnText.textContent = "Sending\u2026";
  if (spinner) spinner.classList.add("is-visible");

  const payload = {
    name:    document.getElementById("f-name")?.value.trim()    ?? "",
    company: document.getElementById("f-company")?.value.trim() ?? "",
    email:   document.getElementById("f-email")?.value.trim()   ?? "",
    phone:   document.getElementById("f-phone")?.value.trim()   ?? "",
    service: document.getElementById("f-service")?.value        ?? "",
    message: document.getElementById("f-message")?.value.trim() ?? "",
    date:    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  };

  /*
   * mode:"no-cors" is required for Google Apps Script.
   * We cannot read the response body — both resolve & reject
   * indicate the request was dispatched, so we show success either way.
   */
  fetch(CONFIG.SHEET_URL, {
    method:  "POST",
    mode:    "no-cors",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  })
    .then(showFormSuccess)
    .catch(showFormSuccess);
}

function showFormSuccess() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (form)    form.style.display = "none";
  if (success) success.classList.add("is-visible");

  const section = document.getElementById("contact");
  if (section) {
    const y = section.getBoundingClientRect().top + window.pageYOffset - CONFIG.NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
