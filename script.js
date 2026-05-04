// ============================================
// DOM Elements
// ============================================
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const showBatchBtn = document.querySelector("#showBatchBtn");
const batchCard = document.querySelector("#batchCard");
const runDetectBtn = document.querySelector("#runDetectBtn");
const reportCard = document.querySelector("#reportCard");
const backTopBtn = document.querySelector("#backTopBtn");

// ============================================
// Reduced motion detection
// ============================================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================
// Scroll to section
// ============================================
scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-scroll-target");
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  });
});

// ============================================
// Hero fade-up on load
// ============================================
function initHeroAnimation() {
  const heroText = document.querySelector(".hero__text");
  const heroVisual = document.querySelector(".hero__visual");
  if (prefersReducedMotion) {
    if (heroText) heroText.style.opacity = "1";
    if (heroVisual) heroVisual.style.opacity = "1";
    return;
  }
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (heroText) {
        heroText.style.opacity = "1";
        heroText.style.transform = "translateY(0)";
      }
    }, 100);
    setTimeout(() => {
      if (heroVisual) {
        heroVisual.style.opacity = "1";
        heroVisual.style.transform = "translateY(0)";
      }
    }, 250);
  });
}

// ============================================
// Scroll-triggered animations (IntersectionObserver)
// ============================================
function initScrollAnimations() {
  if (prefersReducedMotion) {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    // Set stagger index for stagger animations
    if (el.dataset.animate === "stagger" && el.dataset.index !== undefined) {
      el.style.setProperty("--stagger-index", el.dataset.index);
    }
    observer.observe(el);
  });
}

// ============================================
// Batch card reveal
// ============================================
showBatchBtn.addEventListener("click", () => {
  batchCard.hidden = false;
  showBatchBtn.textContent = "查询批次信息";
  if (!prefersReducedMotion) {
    batchCard.classList.remove("panel-flash");
    requestAnimationFrame(() => {
      batchCard.classList.add("panel-flash");
    });
  }
  // Scroll to card on mobile
  if (window.innerWidth < 720) {
    setTimeout(() => {
      batchCard.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
    }, 50);
  }
});

// ============================================
// Report card reveal
// ============================================
runDetectBtn.addEventListener("click", () => {
  runDetectBtn.disabled = true;
  runDetectBtn.textContent = "检测中...";

  // Brief processing delay
  const delay = prefersReducedMotion ? 50 : 600;
  setTimeout(() => {
    reportCard.hidden = false;
    runDetectBtn.disabled = false;
    runDetectBtn.textContent = "重新生成检测报告";
    if (!prefersReducedMotion) {
      reportCard.classList.remove("panel-flash");
      requestAnimationFrame(() => {
        reportCard.classList.add("panel-flash");
      });
    }
    if (window.innerWidth < 720) {
      setTimeout(() => {
        reportCard.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
      }, 50);
    }
  }, delay);
});

// ============================================
// Back to top
// ============================================
backTopBtn.addEventListener("click", () => {
  document.getElementById("top").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
});

let backTopTicking = false;
window.addEventListener("scroll", () => {
  if (!backTopTicking) {
    requestAnimationFrame(() => {
      backTopBtn.classList.toggle("is-visible", window.scrollY > 400);
      backTopTicking = false;
    });
    backTopTicking = true;
  }
});

// ============================================
// Init
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initHeroAnimation();
  initScrollAnimations();
});
