const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;

const getRevealObserver = () => {
  if (revealObserver || !("IntersectionObserver" in window)) return revealObserver;

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-motion-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7%", threshold: 0.08 },
  );

  return revealObserver;
};

const registerRevealGroup = (selector, delayStep = 70) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (element.dataset.motionObserved === "true") return;

    element.dataset.motionObserved = "true";
    element.classList.add("motion-reveal");
    element.style.setProperty("--motion-delay", `${Math.min(index * delayStep, 280)}ms`);

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-motion-visible");
      return;
    }

    getRevealObserver()?.observe(element);
  });
};

const revealWhatsAppButton = () => {
  const button = document.querySelector("[data-whatsapp-quick-quote]");
  if (!button || button.dataset.motionObserved === "true") return;

  button.dataset.motionObserved = "true";
  button.classList.add("motion-whatsapp-entry");

  if (reduceMotion.matches) {
    button.classList.add("is-motion-visible");
    return;
  }

  window.setTimeout(() => button.classList.add("is-motion-visible"), 550);
};

export const mountMotionEnhancements = () => {
  document.documentElement.classList.add("motion-ready");
  revealWhatsAppButton();
  registerRevealGroup(".additives-line__header", 0);
  registerRevealGroup(".additives-line__card", 75);
  registerRevealGroup(".product-page__details-heading", 0);
  registerRevealGroup(".product-page__detail-card", 75);
  registerRevealGroup(".product-page__sheet, .product-page__technical-note", 90);
};
