import { getApprovedCompanies } from "./companies-data.js?v=20260917-6";
import { getFeaturedDeliveries } from "./deliveries-data.js?v=20260916-2";
import { buildAdvisorUrl, buildQuoteMessage, buildWhatsAppUrl } from "./quote.js";

const productCategories = [
  {
    label: "Aditivos",
    href: "#aditivos",
    children: [
      { label: "FORTICEM FLOW", meta: "Plastificante", href: "aditivos/flow/index.html" },
      { label: "FORTICEM FLOW+", meta: "Superplastificante", href: "aditivos/flow-plus/index.html" },
      { label: "FORTICEM CURE", meta: "Curador de concreto", href: "aditivos/cure/index.html" },
      { label: "FORTICEM RELEASE", meta: "Desmoldante", href: "aditivos/release/index.html" },
      { label: "FORTICEM SEAL", meta: "Impermeabilizante", href: "aditivos/seal/index.html" },
    ],
  },
  {
    label: "Block Grass",
    href: "productos/block-grass/index.html",
    children: [
      { label: "Tipo Michi", meta: "35 × 35 × 9 cm", href: "productos/block-grass/index.html#michi" },
      { label: "Tipo 8", meta: "22 × 41 × 9 cm", href: "productos/block-grass/index.html#tipo-8" },
    ],
  },
  {
    label: "Bloques",
    href: "#productos",
    children: [
      { label: "King Block P9", href: "#productos" },
      { label: "King Block P12", href: "#productos" },
      { label: "King Block P13", href: "#productos" },
    ],
  },
  {
    label: "Separadores de concreto",
    href: "productos/separadores-concreto/index.html",
    type: "measure",
    note: "Uso orientativo. Validar recubrimiento según planos, exposición y especificación técnica.",
    children: [
      { label: "2 cm", meta: "Losas y muros interiores", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "2.5 cm", meta: "Losas aligeradas y techos", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "3 cm", meta: "Vigas y losas según plano", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "3.5 cm", meta: "Elementos según plano", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "4 cm", meta: "Columnas y vigas", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "5 cm", meta: "Elementos expuestos", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "6 cm", meta: "Recubrimiento especial", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "7 cm", meta: "Concreto contra el suelo", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "7.5 cm", meta: "Exposición especial", href: "productos/separadores-concreto/index.html#medidas" },
      { label: "10 cm", meta: "Obras especiales", href: "productos/separadores-concreto/index.html#medidas" },
    ],
  },
  { label: "Accesorios", href: "#productos" },
  { label: "Instalaciones y otros", href: "#productos" },
];

const solutionCategories = [
  { label: "Mejorar trabajabilidad", href: "#soluciones" },
  { label: "Acelerar fraguado", href: "#soluciones" },
  { label: "Retardar fraguado", href: "#soluciones" },
  { label: "Curado", href: "#soluciones" },
  { label: "Impermeabilización", href: "#soluciones" },
  { label: "Desmolde", href: "#soluciones" },
  { label: "Control de aire", href: "#soluciones" },
  { label: "Reducir burbujas", href: "#soluciones" },
  { label: "Recubrimiento de acero", href: "#soluciones" },
  { label: "Block Grass", href: "productos/block-grass/index.html" },
];

const mobileNavigation = [
  { label: "Inicio", href: "#inicio", current: true },
  { label: "Productos", children: productCategories },
  { label: "Nosotros", href: "#confianza-operativa" },
  { label: "Proyectos / Entregas", href: "#entregas" },
  { label: "Recursos", href: "#block-michi-tecnico" },
  { label: "Contacto", href: "#cotizacion" },
];

const featuredProducts = [
  {
    slug: "block-michi",
    name: "Block Grass tipo Michi",
    category: "Prefabricados / Block Grass",
    description: "Block Grass de concreto desarrollado para pavimentos permeables y áreas exteriores.",
    image: {
      avif: "assets/images/products/block-michi-studio-v3.avif",
      webp: "assets/images/products/block-michi-studio-v3.webp",
      fallback: "assets/images/products/block-michi-studio-v3.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw",
    },
    alt: "Block Grass tipo Michi de concreto FORTICEM en fotografía de estudio",
    technicalMetric: "35 MPa",
    technicalLabel: "Resistencia",
    href: "productos/block-grass/index.html",
    cta: "Ver familia Block Grass",
    theme: "light",
    layout: "hero",
    featured: true,
    priority: 1,
  },
  {
    slug: "separadores-concreto",
    name: "Separadores de concreto",
    category: "Prefabricados / Estructuras",
    description: "Recubrimientos definidos de 2 a 10 cm para diferentes necesidades estructurales.",
    image: {
      avif: "assets/images/products/separadores-concreto-studio-v2.avif",
      webp: "assets/images/products/separadores-concreto-studio-v2.webp",
      fallback: "assets/images/products/separadores-concreto-studio-v2.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    },
    alt: "Separadores de concreto FORTICEM de 2.5, 4 y 7 cm en fotografía de estudio",
    technicalMetric: "2–10 cm",
    technicalLabel: "Medidas disponibles",
    href: "productos/separadores-concreto/index.html",
    cta: "Ver separadores",
    theme: "white",
    layout: "separators",
    featured: true,
    priority: 2,
  },
  {
    slug: "aditivos-forticem",
    name: "Aditivos FORTICEM",
    category: "Química aplicada",
    description: "Soluciones químicas para modificar y optimizar el comportamiento del concreto.",
    image: {
      avif: "assets/images/products/aditivos-forticem-familia-studio-v1.avif",
      webp: "assets/images/products/aditivos-forticem-familia-studio-v1.webp",
      fallback: "assets/images/products/aditivos-forticem-familia-studio-v1.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 50vw",
    },
    alt: "Familia de aditivos FORTICEM en presentaciones de 4, 20 y 200 litros",
    technicalMetric: null,
    technicalLabel: null,
    href: "#aditivos",
    cta: "Explorar aditivos",
    theme: "navy",
    layout: "additives",
    featured: true,
    priority: 3,
  },
  {
    slug: "king-block",
    name: "King Block",
    category: "Prefabricados / Bloques",
    description: "Bloques de concreto en variantes P9, P12 y P13.",
    image: {
      avif: "assets/images/products/king-block-familia-studio-v1.avif",
      webp: "assets/images/products/king-block-familia-studio-v1.webp",
      fallback: "assets/images/products/king-block-familia-studio-v1.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    },
    alt: "Familia King Block FORTICEM en variantes P9, P12 y P13",
    technicalMetric: "P9 / P12 / P13",
    technicalLabel: "Variantes",
    href: "#cotizacion",
    cta: "Cotizar King Block",
    theme: "concrete",
    layout: "king-block",
    featured: true,
    priority: 4,
  },
  {
    slug: "escantillones",
    name: "Escantillones",
    category: "Prefabricados / Obra",
    description: "Guías de concreto para alinear y controlar la ejecución en obra.",
    image: {
      avif: "assets/images/products/escantillones-studio-v2.avif",
      webp: "assets/images/products/escantillones-studio-v2.webp",
      fallback: "assets/images/products/escantillones-studio-v2.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    },
    alt: "Cinco escantillones de concreto FORTICEM en fotografía de estudio",
    technicalMetric: null,
    technicalLabel: null,
    href: "#cotizacion",
    cta: "Cotizar escantillones",
    theme: "white",
    layout: "escantillones",
    featured: true,
    priority: 5,
  },
  {
    slug: "adoquines",
    name: "Adoquines",
    category: "Prefabricados / Pavimentos",
    description: "Acabados rojo, gris y negro para pavimentos y áreas exteriores.",
    image: {
      avif: "assets/images/products/adoquines-colores-studio-v1.avif",
      webp: "assets/images/products/adoquines-colores-studio-v1.webp",
      fallback: "assets/images/products/adoquines-colores-studio-v1.png",
      width: 1080,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    },
    alt: "Adoquines de concreto FORTICEM en acabados rojo, gris y negro",
    technicalMetric: null,
    technicalLabel: null,
    href: "#cotizacion",
    cta: "Cotizar adoquines",
    theme: "concrete",
    layout: "adoquines",
    featured: true,
    priority: 6,
  },
];

const header = document.querySelector("[data-header]");
const megaRoot = document.querySelector("[data-mega-root]");
const megaTrigger = document.querySelector("[data-mega-trigger]");
const megaMenu = document.querySelector("[data-mega-menu]");
const categoryContainer = document.querySelector("[data-product-categories]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const mobilePanel = mobileNav.querySelector(".mobile-nav__panel");
const mobileLinks = document.querySelector("[data-mobile-links]");
let lastFocusedElement = null;

const categoryLinkTemplate = ({ label, href }, className = "category-link") => `
  <a class="${className}" href="${href}">
    <span>${label}</span>
    ${className === "category-link" ? '<span aria-hidden="true">→</span>' : ""}
  </a>
`;

categoryContainer.innerHTML = productCategories
  .map((category) => {
    if (!category.children) {
      return categoryLinkTemplate(category);
    }

    return `
      <section class="product-family${category.type ? ` product-family--${category.type}` : ""}" aria-labelledby="family-${category.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
        <a class="product-family__title" id="family-${category.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" href="${category.href}">
          ${category.label}<span aria-hidden="true">→</span>
        </a>
        <div class="product-family__links">
          ${category.children
            .map(
              (child) => `
                <a class="product-family__link" href="${child.href}">
                  <span>${child.label}</span>
                  ${child.meta ? `<small>${child.meta}</small>` : ""}
                </a>
              `,
            )
            .join("")}
        </div>
        ${category.note ? `<p class="product-family__note">${category.note}</p>` : ""}
      </section>
    `;
  })
  .join("");

mobileLinks.innerHTML = mobileNavigation
  .map((item, index) => {
    if (!item.children) {
      return `
        <a class="mobile-nav__link${item.current ? " is-active" : ""}" href="${item.href}"
          ${item.current ? 'aria-current="page"' : ""}>${item.label}</a>
      `;
    }

    const id = `mobile-submenu-${index}`;
    return `
      <div class="mobile-nav__accordion">
        <button class="mobile-nav__accordion-trigger" type="button"
          aria-expanded="false" aria-controls="${id}">
          <span>${item.label}</span>
          <span aria-hidden="true">+</span>
        </button>
        <div class="mobile-nav__submenu" id="${id}" hidden>
          ${item.children
            .map((child) => {
              if (!child.children) {
                return categoryLinkTemplate(child, "mobile-nav__sublink");
              }

              return `
                <div class="mobile-nav__family${child.type ? ` mobile-nav__family--${child.type}` : ""}">
                  <a class="mobile-nav__family-title" href="${child.href}">${child.label}</a>
                  ${child.children
                    .map(
                      (product) => `
                        <a class="mobile-nav__product" href="${product.href}">
                          <span>${product.label}</span>
                          ${product.meta ? `<small>${product.meta}</small>` : ""}
                        </a>
                      `,
                    )
                    .join("")}
                  ${child.note ? `<p class="mobile-nav__family-note">${child.note}</p>` : ""}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  })
  .join("");

const syncHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const openMegaMenu = () => {
  megaMenu.hidden = false;
  requestAnimationFrame(() => megaMenu.classList.add("is-open"));
  megaTrigger.setAttribute("aria-expanded", "true");
  header.classList.add("is-menu-active");
};

const closeMegaMenu = ({ restoreFocus = false } = {}) => {
  megaMenu.classList.remove("is-open");
  megaTrigger.setAttribute("aria-expanded", "false");
  header.classList.remove("is-menu-active");
  window.setTimeout(() => {
    if (!megaMenu.classList.contains("is-open")) megaMenu.hidden = true;
  }, 240);
  if (restoreFocus) megaTrigger.focus();
};

megaTrigger.addEventListener("click", () => {
  const isOpen = megaTrigger.getAttribute("aria-expanded") === "true";
  isOpen ? closeMegaMenu() : openMegaMenu();
});

megaTrigger.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    openMegaMenu();
    megaMenu.querySelector("a")?.focus();
  }
});

megaRoot.addEventListener("pointerleave", (event) => {
  if (!megaRoot.contains(event.relatedTarget)) closeMegaMenu();
});

document.addEventListener("click", (event) => {
  if (!megaRoot.contains(event.target)) closeMegaMenu();
});

const getFocusableElements = (container) =>
  [...container.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hidden && element.offsetParent !== null);

const openMobileMenu = () => {
  closeMegaMenu();
  lastFocusedElement = document.activeElement;
  mobileNav.hidden = false;
  document.body.classList.add("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Cerrar menú");
  requestAnimationFrame(() => {
    mobileNav.classList.add("is-open");
    mobilePanel.focus();
  });
};

const closeMobileMenu = ({ restoreFocus = true } = {}) => {
  if (mobileNav.hidden) return;
  mobileNav.classList.remove("is-open");
  document.body.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  window.setTimeout(() => {
    if (!mobileNav.classList.contains("is-open")) mobileNav.hidden = true;
  }, 320);
  if (restoreFocus) lastFocusedElement?.focus();
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  isOpen ? closeMobileMenu() : openMobileMenu();
});

mobileNav.querySelectorAll("[data-menu-close]").forEach((element) => {
  element.addEventListener("click", () => closeMobileMenu());
});

mobileLinks.addEventListener("click", (event) => {
  const accordionTrigger = event.target.closest(".mobile-nav__accordion-trigger");
  if (accordionTrigger) {
    const submenu = document.getElementById(accordionTrigger.getAttribute("aria-controls"));
    const willOpen = accordionTrigger.getAttribute("aria-expanded") !== "true";
    accordionTrigger.setAttribute("aria-expanded", String(willOpen));
    submenu.hidden = !willOpen;
    return;
  }

  if (event.target.closest("a")) closeMobileMenu({ restoreFocus: false });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!mobileNav.hidden) closeMobileMenu();
    else if (!megaMenu.hidden) closeMegaMenu({ restoreFocus: true });
  }

  if (event.key === "Tab" && !mobileNav.hidden) {
    const focusable = getFocusableElements(mobilePanel);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === mobilePanel)
    ) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1280) closeMobileMenu({ restoreFocus: false });
});

syncHeaderState();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector("[data-hero]");
const heroStage = document.querySelector("[data-hero-stage]");
const finePointer = window.matchMedia("(pointer: fine)");
let heroPointerFrame = null;

const updateHeroPointer = (event) => {
  if (!hero || !heroStage || reduceMotion.matches || !finePointer.matches) return;
  const bounds = heroStage.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
  const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));

  if (heroPointerFrame) cancelAnimationFrame(heroPointerFrame);
  heroPointerFrame = requestAnimationFrame(() => {
    hero.style.setProperty("--hero-x", x.toFixed(3));
    hero.style.setProperty("--hero-y", y.toFixed(3));
  });
};

if (hero && heroStage) {
  heroStage.addEventListener("pointermove", updateHeroPointer, { passive: true });
  heroStage.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-x", "0");
    hero.style.setProperty("--hero-y", "0");
  });
}

const productCarousel = document.querySelector("[data-product-carousel]");

if (productCarousel) {
  const carousel = productCarousel.querySelector(".hero-carousel");
  const slides = [...productCarousel.querySelectorAll("[data-product-slide]")];
  const previousButton = productCarousel.querySelector("[data-carousel-prev]");
  const nextButton = productCarousel.querySelector("[data-carousel-next]");
  const currentLabel = productCarousel.querySelector("[data-carousel-current]");
  let activeSlide = 0;
  let autoplayTimer = null;

  const restartProgress = () => {
    if (!carousel || reduceMotion.matches || !autoplayTimer) return;
    carousel.classList.remove("is-playing");
    void carousel.offsetWidth;
    carousel.classList.add("is-playing");
  };

  const showSlide = (nextIndex, direction = "next") => {
    activeSlide = (nextIndex + slides.length) % slides.length;
    productCarousel.dataset.direction = direction;
    slides.forEach((slide, index) => {
      const isActive = index === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (currentLabel) currentLabel.textContent = String(activeSlide + 1).padStart(2, "0");
    restartProgress();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
    carousel?.classList.remove("is-playing");
  };

  const startAutoplay = () => {
    if (reduceMotion.matches || document.hidden || autoplayTimer) return;
    autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1, "next"), 2500);
    restartProgress();
  };

  previousButton?.addEventListener("click", () => {
    showSlide(activeSlide - 1, "previous");
    stopAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeSlide + 1, "next");
    stopAutoplay();
  });

  productCarousel.addEventListener("mouseenter", stopAutoplay);
  productCarousel.addEventListener("mouseleave", startAutoplay);
  productCarousel.addEventListener("focusin", stopAutoplay);
  productCarousel.addEventListener("focusout", (event) => {
    if (!productCarousel.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) stopAutoplay();
    else startAutoplay();
  });

  showSlide(0);
  startAutoplay();
}

const featuredGrid = document.querySelector("[data-featured-grid]");

const renderProductVisual = (product) => {
  if (!product.image) {
    return `
      <div class="featured-product__visual-placeholder" role="img" aria-label="${product.alt}. Asset real pendiente.">
        <span>Producto real</span>
        <span>Fotografía o render oficial pendiente</span>
      </div>
    `;
  }

  return `
    <picture class="featured-product__picture">
      ${product.image.avif ? `<source type="image/avif" srcset="${product.image.avif}" />` : ""}
      ${product.image.webp ? `<source type="image/webp" srcset="${product.image.webp}" />` : ""}
      <img class="featured-product__image" src="${product.image.fallback}" alt="${product.alt}"
        width="${product.image.width || 1200}" height="${product.image.height || 900}"
        loading="lazy" decoding="async" sizes="${product.image.sizes || "(max-width: 768px) 100vw, 50vw"}" />
    </picture>
  `;
};

const renderFeaturedProduct = (product, index) => `
  <article
    class="featured-product featured-product--${product.theme} featured-product--${product.layout}"
    style="--reveal-delay: ${Math.min(index * 80, 320)}ms"
    data-product-slug="${product.slug}"
  >
    <a class="featured-product__link" href="${product.href}" aria-label="${product.cta}: ${product.name}">
      <div class="featured-product__visual">
        ${renderProductVisual(product)}
      </div>
      <div class="featured-product__body">
        <div>
          <span class="featured-product__category">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="featured-product__description">${product.description}</p>
          <span class="featured-product__cta">
            ${product.cta}
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5 12h13M13 7l5 5-5 5" />
            </svg>
          </span>
        </div>
        ${
          product.technicalMetric
            ? `<div class="featured-product__metric">
                <strong>${product.technicalMetric}</strong>
                <span>${product.technicalLabel}</span>
              </div>`
            : ""
        }
      </div>
    </a>
  </article>
`;

if (featuredGrid) {
  featuredGrid.innerHTML = featuredProducts
    .filter((product) => product.featured)
    .sort((a, b) => a.priority - b.priority)
    .map(renderFeaturedProduct)
    .join("");
}

const worldsSection = document.querySelector("[data-worlds]");
const revealElements = document.querySelectorAll("[data-reveal]");

const revealWorlds = () => {
  worldsSection?.classList.add("is-visible");
  revealElements.forEach((element) => element.classList.add("is-revealed"));
};

if (!worldsSection || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealWorlds();
} else {
  const worldsObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealWorlds();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -12%", threshold: 0.12 },
  );

  worldsObserver.observe(worldsSection);
}

const featuredSection = document.querySelector("[data-featured-products]");

const revealFeaturedProducts = () => {
  featuredSection?.classList.add("is-visible");
};

if (!featuredSection || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealFeaturedProducts();
} else {
  const featuredObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealFeaturedProducts();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  featuredObserver.observe(featuredSection);
}

const technicalStory = document.querySelector("[data-technical-story]");
const technicalStage = document.querySelector("[data-technical-stage]");
const storySteps = [...document.querySelectorAll("[data-story-step]")];
let storyUpdatePending = false;

const updateTechnicalStory = () => {
  storyUpdatePending = false;
  if (!technicalStory || !technicalStage || reduceMotion.matches || window.innerWidth < 1024) return;

  const storyBounds = technicalStory.getBoundingClientRect();
  if (storyBounds.bottom < 0 || storyBounds.top > window.innerHeight) return;

  const viewportMarker = window.innerHeight * 0.5;
  const activeStep = storySteps.reduce((closest, step) => {
    const bounds = step.getBoundingClientRect();
    const distance = Math.abs(bounds.top + bounds.height / 2 - viewportMarker);
    return distance < closest.distance ? { step, distance } : closest;
  }, { step: storySteps[0], distance: Number.POSITIVE_INFINITY }).step;

  const activeState = activeStep.dataset.storyStep;
  technicalStage.dataset.active = activeState;
  storySteps.forEach((step) => step.classList.toggle("is-active", step === activeStep));
};

const queueTechnicalStoryUpdate = () => {
  if (storyUpdatePending) return;
  storyUpdatePending = true;
  requestAnimationFrame(updateTechnicalStory);
};

if (technicalStory && !reduceMotion.matches) {
  window.addEventListener("scroll", queueTechnicalStoryUpdate, { passive: true });
  window.addEventListener("resize", queueTechnicalStoryUpdate);
  queueTechnicalStoryUpdate();
}

const operationalTrust = document.querySelector("[data-operational-trust]");

const revealOperationalTrust = () => {
  operationalTrust?.classList.add("is-visible");
};

if (!operationalTrust || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealOperationalTrust();
} else {
  const operationalObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealOperationalTrust();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  operationalObserver.observe(operationalTrust);
}

const plantsSection = document.querySelector("[data-plants-section]");

const revealPlants = () => {
  plantsSection?.classList.add("is-visible");
};

if (!plantsSection || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealPlants();
} else {
  const plantsObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealPlants();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -8%", threshold: 0.06 },
  );

  plantsObserver.observe(plantsSection);
}

const deliveriesSection = document.querySelector("[data-deliveries-section]");
const deliveriesGrid = document.querySelector("[data-deliveries-grid]");
const deliveriesEmpty = document.querySelector("[data-deliveries-empty]");
const createDeliveryCard = (delivery, index) => {
  const article = document.createElement("article");
  article.className = `delivery-card${index === 0 ? " delivery-card--featured" : ""}`;
  article.dataset.deliveryCard = "";

  const link = document.createElement("a");
  link.className = "delivery-card__link";
  link.href = delivery.href || `/entregas/${delivery.slug}`;
  link.setAttribute("aria-label", `Ver entrega de ${delivery.product} en ${delivery.city}`);

  const figure = document.createElement("figure");
  figure.className = "delivery-card__media";
  figure.style.aspectRatio = delivery.imageAspect || (index === 0 ? "3 / 2" : "4 / 3");

  const picture = document.createElement("picture");

  if (delivery.image.avifSrcset) {
    const avif = document.createElement("source");
    avif.type = "image/avif";
    avif.srcset = delivery.image.avifSrcset;
    avif.sizes = delivery.image.sizes || "(min-width: 1024px) 60vw, 100vw";
    picture.append(avif);
  }

  if (delivery.image.webpSrcset) {
    const webp = document.createElement("source");
    webp.type = "image/webp";
    webp.srcset = delivery.image.webpSrcset;
    webp.sizes = delivery.image.sizes || "(min-width: 1024px) 60vw, 100vw";
    picture.append(webp);
  }

  const image = document.createElement("img");
  image.src = delivery.image.src;
  image.alt = delivery.alt;
  image.width = delivery.image.width;
  image.height = delivery.image.height;
  image.loading = "lazy";
  image.decoding = "async";
  image.style.objectPosition = delivery.objectPosition || "center";
  picture.append(image);
  figure.append(picture);

  const body = document.createElement("div");
  body.className = "delivery-card__body";

  const location = document.createElement("span");
  location.className = "delivery-card__city";
  location.textContent = delivery.city;

  const title = document.createElement("h3");
  title.textContent = delivery.product;

  body.append(location, title);

  if (delivery.description) {
    const description = document.createElement("p");
    description.textContent = delivery.description;
    body.append(description);
  }

  const arrow = document.createElement("span");
  arrow.className = "delivery-card__arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  body.append(arrow);

  link.append(figure, body);
  article.append(link);
  return article;
};

const featuredDeliveries = getFeaturedDeliveries();

if (deliveriesGrid && featuredDeliveries.length) {
  const deliveryFragment = document.createDocumentFragment();
  featuredDeliveries.forEach((delivery, index) => {
    deliveryFragment.append(createDeliveryCard(delivery, index));
  });
  deliveriesGrid.append(deliveryFragment);
  deliveriesEmpty?.setAttribute("hidden", "");
} else {
  deliveriesGrid?.setAttribute("hidden", "");
}

const revealDeliveries = () => {
  deliveriesSection?.classList.add("is-visible");
};

if (!deliveriesSection || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealDeliveries();
} else {
  const deliveriesObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealDeliveries();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -8%", threshold: 0.06 },
  );

  deliveriesObserver.observe(deliveriesSection);
}

const trustedCompaniesSection = document.querySelector("[data-trusted-companies]");
const companyCarousel = document.querySelector("[data-company-carousel]");
const companyGrid = document.querySelector("[data-company-grid]");
const companyEmpty = document.querySelector("[data-company-empty]");
const companyPrevious = document.querySelector("[data-company-prev]");
const companyNext = document.querySelector("[data-company-next]");

const companyShowcase = document.createElement("dialog");
companyShowcase.className = "company-showcase";
companyShowcase.setAttribute("aria-label", "Sede del socio comercial seleccionado");
companyShowcase.innerHTML = `
  <div class="company-showcase__stage">
    <img class="company-showcase__photo" data-company-showcase-photo alt="" />
    <div class="company-showcase__technical" aria-hidden="true"><i></i><span></span><b></b></div>
    <button class="company-showcase__close" type="button" aria-label="Cerrar sede a pantalla completa">
      <span aria-hidden="true">×</span>
    </button>
    <div class="company-showcase__content">
      <span class="company-showcase__eyebrow">Socio comercial · cobertura regional</span>
      <div class="company-showcase__identity">
        <img data-company-showcase-logo alt="" />
        <div>
          <p data-company-showcase-type></p>
          <h3 data-company-showcase-name></h3>
        </div>
      </div>
      <div class="company-showcase__location">
        <strong data-company-showcase-coverage></strong>
        <span data-company-showcase-address></span>
      </div>
    </div>
  </div>
`;
document.body.append(companyShowcase);

const companyShowcasePhoto = companyShowcase.querySelector("[data-company-showcase-photo]");
const companyShowcaseLogo = companyShowcase.querySelector("[data-company-showcase-logo]");
const companyShowcaseType = companyShowcase.querySelector("[data-company-showcase-type]");
const companyShowcaseName = companyShowcase.querySelector("[data-company-showcase-name]");
const companyShowcaseCoverage = companyShowcase.querySelector("[data-company-showcase-coverage]");
const companyShowcaseAddress = companyShowcase.querySelector("[data-company-showcase-address]");
const companyShowcaseClose = companyShowcase.querySelector(".company-showcase__close");
let lastCompanyTrigger = null;

const closeCompanyShowcase = () => {
  if (typeof companyShowcase.close === "function" && companyShowcase.open) {
    companyShowcase.close();
  } else {
    companyShowcase.removeAttribute("open");
  }
};

const openCompanyShowcase = (company, trigger) => {
  lastCompanyTrigger = trigger;
  const hasLocationPhoto = Boolean(company.locationPhoto?.src);
  const showcaseSource = hasLocationPhoto ? company.locationPhoto : company.logo;
  companyShowcase.classList.toggle("company-showcase--identity-only", !hasLocationPhoto);
  companyShowcasePhoto.src = showcaseSource.src;
  companyShowcasePhoto.width = showcaseSource.width;
  companyShowcasePhoto.height = showcaseSource.height;
  companyShowcasePhoto.alt = hasLocationPhoto
    ? company.locationPhoto.alt || `Sede de ${company.name}`
    : `Identidad visual de ${company.name}; fotografía del local pendiente`;
  companyShowcaseLogo.src = company.logo.src;
  companyShowcaseLogo.width = company.logo.width;
  companyShowcaseLogo.height = company.logo.height;
  companyShowcaseLogo.alt = `Logo de ${company.name}`;
  companyShowcaseType.textContent = company.locationPending
    ? `${company.type || "Socio comercial"} · registro visual pendiente`
    : company.type || "Socio comercial";
  companyShowcaseName.textContent = company.name;
  companyShowcaseCoverage.textContent = company.coverage;
  companyShowcaseAddress.textContent = company.address;
  document.body.classList.add("is-company-showcase-open");

  if (typeof companyShowcase.showModal === "function") {
    companyShowcase.showModal();
  } else {
    companyShowcase.setAttribute("open", "");
  }
};

companyShowcaseClose?.addEventListener("click", closeCompanyShowcase);
companyShowcase.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCompanyShowcase();
});
companyShowcase.addEventListener("close", () => {
  document.body.classList.remove("is-company-showcase-open");
  lastCompanyTrigger?.focus();
});

const createCompanyLogo = (company, className, source) => {
  const image = document.createElement("img");
  image.className = className;
  image.src = source.src;
  image.width = source.width;
  image.height = source.height;
  image.alt = className.includes("monochrome") ? "" : `Logo de ${company.name}`;
  image.loading = "lazy";
  image.decoding = "async";
  return image;
};

const createCompanyItem = (company, index) => {
  const item = document.createElement("li");
  item.className = "company-logo-item";
  item.dataset.companyItem = "";
  item.style.setProperty("--company-delay", `${Math.min(index * 40, 320)}ms`);

  const surface = document.createElement("button");
  surface.className = "company-logo-item__surface";
  surface.type = "button";
  surface.setAttribute(
    "aria-label",
    company.locationPending
      ? `Ver ficha de ${company.name} a pantalla completa, cobertura ${company.coverage}`
      : `Ver sede de ${company.name} a pantalla completa, cobertura ${company.coverage}`,
  );
  surface.addEventListener("click", () => openCompanyShowcase(company, surface));

  const location = document.createElement("figure");
  location.className = "company-logo-item__location";
  const locationCaption = document.createElement("figcaption");
  locationCaption.innerHTML = `<strong>${company.coverage}</strong><span>${company.address}</span>`;

  if (company.locationPhoto?.src) {
    const locationImage = createCompanyLogo(
      company,
      "company-logo-item__location-image",
      company.locationPhoto,
    );
    locationImage.alt = company.locationPhoto.alt || `Local de ${company.name}`;
    location.append(locationImage);
  } else {
    location.classList.add("company-logo-item__location--pending");
    const pendingVisual = document.createElement("div");
    pendingVisual.className = "company-logo-item__pending-visual";
    const pendingLogo = createCompanyLogo(
      company,
      "company-logo-item__pending-logo",
      company.logo,
    );
    const pendingLabel = document.createElement("span");
    pendingLabel.textContent = "Fotografía del local pendiente";
    pendingVisual.append(pendingLogo, pendingLabel);
    location.append(pendingVisual);
  }

  location.append(locationCaption);

  const identity = document.createElement("div");
  identity.className = "company-logo-item__identity";

  const logo = createCompanyLogo(company, "company-logo-item__color", company.logo);

  // Todos los socios parten en escala de grises; el color aparece al interactuar.
  logo.classList.add("company-logo-item__color--filterable");

  identity.append(logo);

  if (company.logoMonochrome?.src) {
    const monochrome = createCompanyLogo(
      company,
      "company-logo-item__monochrome",
      company.logoMonochrome,
    );
    identity.append(monochrome);
  }

  const coverage = document.createElement("p");
  coverage.className = "company-logo-item__coverage";
  coverage.textContent = company.coverage;
  identity.append(coverage);

  surface.append(location, identity);

  item.append(surface);
  return item;
};

const approvedCompanies = getApprovedCompanies();
const companyRingQuery = window.matchMedia("(min-width: 48rem)");
let companyItems = [];
let companyRingStep = 0;
let companyRingRotation = 0;
let companyRingTarget = 0;
let companyRingPaused = false;
let companyRingLastFrame = 0;
let companyRingFrontIndex = -1;
let companyRingDrag = null;
let suppressCompanyClick = false;

const normalizeCompanyAngle = (angle) => ((angle + 540) % 360) - 180;

const updateCompanyRing = () => {
  if (!companyGrid || !companyItems.length) return;
  companyGrid.style.setProperty("--company-ring-rotation", `${companyRingRotation}deg`);

  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  companyItems.forEach((item, index) => {
    const angle = normalizeCompanyAngle(index * companyRingStep + companyRingRotation);
    const distance = Math.abs(angle);
    const depth = Math.cos((angle * Math.PI) / 180);
    const opacity = Math.max(0.06, Math.min(1, (depth + 1) / 1.35));

    item.style.setProperty("--company-ring-opacity", opacity.toFixed(3));
    item.style.zIndex = String(Math.round((depth + 1) * 100));
    item.toggleAttribute("data-company-back", distance > 102);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex === companyRingFrontIndex) return;
  companyRingFrontIndex = closestIndex;
  companyItems.forEach((item, index) => {
    const surface = item.querySelector(".company-logo-item__surface");
    if (index === closestIndex) surface?.setAttribute("aria-current", "true");
    else surface?.removeAttribute("aria-current");
  });
};

if (companyGrid && approvedCompanies.length) {
  const companyFragment = document.createDocumentFragment();
  approvedCompanies.forEach((company, index) => {
    companyFragment.append(createCompanyItem(company, index));
  });
  companyGrid.append(companyFragment);
  companyItems = [...companyGrid.querySelectorAll("[data-company-item]")];
  companyRingStep = 360 / companyItems.length;
  companyItems.forEach((item, index) => {
    item.style.setProperty("--company-ring-angle", `${index * companyRingStep}deg`);
  });
  updateCompanyRing();
  companyCarousel?.removeAttribute("hidden");
  companyEmpty?.setAttribute("hidden", "");
} else {
  companyCarousel?.setAttribute("hidden", "");
  companyGrid?.setAttribute("hidden", "");
}

const moveCompanyCarousel = (direction) => {
  if (!companyGrid || !companyItems.length) return;

  if (companyRingQuery.matches) {
    companyRingTarget += direction > 0 ? -companyRingStep : companyRingStep;
    if (reduceMotion.matches) {
      companyRingRotation = companyRingTarget;
      updateCompanyRing();
    }
    return;
  }

  if (!companyItems.length) return;
  if (companyItems.length > 1) {
    if (direction > 0) {
      companyGrid.append(companyGrid.firstElementChild);
    } else {
      companyGrid.prepend(companyGrid.lastElementChild);
    }
  }
  companyGrid.scrollLeft = 0;
};

companyPrevious?.addEventListener("click", () => moveCompanyCarousel(-1));
companyNext?.addEventListener("click", () => moveCompanyCarousel(1));

companyCarousel?.addEventListener("focusin", () => { companyRingPaused = true; });
companyCarousel?.addEventListener("focusout", (event) => {
  if (!companyCarousel.contains(event.relatedTarget)) companyRingPaused = false;
});

companyGrid?.addEventListener("pointerdown", (event) => {
  if (!companyRingQuery.matches || event.button !== 0) return;
  companyRingDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startTarget: companyRingTarget,
    moved: false,
  };
  companyRingPaused = true;
  companyGrid.classList.add("is-dragging");
  companyGrid.setPointerCapture?.(event.pointerId);
});

companyGrid?.addEventListener("pointermove", (event) => {
  if (!companyRingDrag || companyRingDrag.pointerId !== event.pointerId) return;
  const delta = event.clientX - companyRingDrag.startX;
  companyRingDrag.moved ||= Math.abs(delta) > 5;
  companyRingTarget = companyRingDrag.startTarget + delta * 0.22;
});

const finishCompanyRingDrag = (event) => {
  if (!companyRingDrag || companyRingDrag.pointerId !== event.pointerId) return;
  suppressCompanyClick = companyRingDrag.moved;
  companyRingDrag = null;
  companyRingPaused = false;
  companyGrid?.classList.remove("is-dragging");
};

companyGrid?.addEventListener("pointerup", finishCompanyRingDrag);
companyGrid?.addEventListener("pointercancel", finishCompanyRingDrag);
companyGrid?.addEventListener("click", (event) => {
  if (!suppressCompanyClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressCompanyClick = false;
}, true);

const animateCompanyRing = (timestamp) => {
  const elapsed = companyRingLastFrame ? Math.min(timestamp - companyRingLastFrame, 40) : 0;
  companyRingLastFrame = timestamp;

  if (
    companyRingQuery.matches &&
    !reduceMotion.matches &&
    !companyRingPaused &&
    !companyShowcase.open &&
    !document.hidden
  ) {
    companyRingTarget -= elapsed * 0.006;
  }

  const difference = companyRingTarget - companyRingRotation;
  if (Math.abs(difference) > 0.001) {
    const easing = reduceMotion.matches ? 1 : Math.min(1, elapsed / 260);
    companyRingRotation += difference * easing;
    updateCompanyRing();
  }

  window.requestAnimationFrame(animateCompanyRing);
};
window.requestAnimationFrame(animateCompanyRing);

const revealTrustedCompanies = () => {
  trustedCompaniesSection?.classList.add("is-visible");
};

if (
  !trustedCompaniesSection ||
  reduceMotion.matches ||
  !("IntersectionObserver" in window)
) {
  revealTrustedCompanies();
} else {
  const companiesObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealTrustedCompanies();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  companiesObserver.observe(trustedCompaniesSection);
}

const quoteSection = document.querySelector("[data-quote-section]");
const quoteForm = document.querySelector("[data-quote-form]");
const productSelect = document.querySelector("#quote-product");
const advisorLink = document.querySelector("[data-advisor-link]");
const quoteStatus = document.querySelector("[data-quote-status]");
const quoteFallback = document.querySelector("[data-quote-fallback]");

const quoteProductOptions = [
  ...featuredProducts.map(({ slug, name }) => ({ slug, name })),
  { slug: "otro-producto", name: "Otro producto" },
];

if (productSelect) {
  const optionsFragment = document.createDocumentFragment();
  quoteProductOptions.forEach(({ slug, name }) => {
    const option = document.createElement("option");
    option.value = slug;
    option.textContent = name;
    optionsFragment.append(option);
  });
  productSelect.append(optionsFragment);

  const requestedProduct =
    new URLSearchParams(window.location.search).get("product") ||
    quoteSection?.dataset.defaultProduct;

  if (requestedProduct && quoteProductOptions.some(({ slug }) => slug === requestedProduct)) {
    productSelect.value = requestedProduct;
  }
}

if (advisorLink) advisorLink.href = buildAdvisorUrl();

const quoteFields = quoteForm
  ? [...quoteForm.querySelectorAll("input, select, textarea")]
  : [];

const quoteValidationMessages = {
  "quote-name": "Ingresa tu nombre.",
  "quote-product": "Selecciona un producto.",
  "quote-quantity": "Indica una cantidad aproximada.",
  "quote-location": "Indica tu ubicación.",
};

const validateQuoteField = (field) => {
  const error = document.querySelector(`#${field.id}-error`);
  const message = field.required && !field.value.trim() ? quoteValidationMessages[field.id] : "";

  field.setAttribute("aria-invalid", message ? "true" : "false");
  field.closest(".quote-field")?.classList.toggle("has-error", Boolean(message));

  if (error) {
    error.textContent = message || "";
    error.hidden = !message;
  }

  return !message;
};

quoteFields.forEach((field) => {
  field.addEventListener("blur", () => validateQuoteField(field));
  field.addEventListener("input", () => {
    if (quoteForm?.dataset.submitted === "true" || field.getAttribute("aria-invalid") === "true") {
      validateQuoteField(field);
    }
  });
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  quoteForm.dataset.submitted = "true";

  const valid = quoteFields.filter((field) => field.required).map(validateQuoteField).every(Boolean);

  if (!valid) {
    quoteForm.querySelector('[aria-invalid="true"]')?.focus();
    if (quoteStatus) quoteStatus.textContent = "Revisa los campos señalados para continuar.";
    return;
  }

  const formData = new FormData(quoteForm);
  const selectedProduct = quoteProductOptions.find(
    ({ slug }) => slug === formData.get("product"),
  );
  const message = buildQuoteMessage({
    name: formData.get("name"),
    company: formData.get("company"),
    product: selectedProduct?.name || "Otro producto",
    quantity: formData.get("quantity"),
    location: formData.get("location"),
    details: formData.get("details"),
  });
  const whatsappUrl = buildWhatsAppUrl(message);
  const whatsappWindow = window.open(whatsappUrl, "_blank");

  if (whatsappWindow) whatsappWindow.opener = null;

  if (quoteFallback) {
    quoteFallback.href = whatsappUrl;
    quoteFallback.hidden = Boolean(whatsappWindow);
  }

  if (quoteStatus) {
    quoteStatus.textContent = whatsappWindow
      ? "WhatsApp se abrió con la información preparada."
      : "No pudimos abrir WhatsApp automáticamente. Usa el enlace disponible.";
  }

  // Punto de integración futuro: quote_whatsapp_click.
  // Solo debe registrar product, source y una ubicación normalizada; nunca campos personales.
});

const revealQuoteSection = () => {
  quoteSection?.classList.add("is-visible");
};

if (!quoteSection || reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealQuoteSection();
} else {
  const quoteObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealQuoteSection();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -8%", threshold: 0.06 },
  );

  quoteObserver.observe(quoteSection);
}

const footerProductLinks = featuredProducts
  .filter(({ slug }) => ["block-michi", "separadores-concreto", "aditivos-forticem", "king-block", "adoquines"].includes(slug))
  .map(({ slug, name, href }) => ({
    label: slug === "aditivos-forticem" ? "Aditivos FORTICEM" : name,
    href,
  }));

const footerSections = [
  {
    title: "Productos",
    links: [{ label: "Ver todos los productos", href: "#productos" }, ...footerProductLinks],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Prefabricados y aditivos", href: "#soluciones" },
      { label: "Soluciones químicas", href: "#aditivos" },
      { label: "Información técnica", href: "#block-michi-tecnico" },
      { label: "Solicitar cotización", href: "#cotizacion" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "#confianza-operativa" },
      { label: "Plantas", href: "#plantas" },
      { label: "Entregas", href: "#entregas" },
      { label: "Clientes y socios", href: "#clientes-socios" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Familia Block Grass", href: "productos/block-grass/index.html" },
      { label: "Cotizador por WhatsApp", href: "#cotizacion" },
    ],
  },
];

const footerNav = document.querySelector("[data-footer-nav]");

if (footerNav) {
  footerNav.innerHTML = footerSections
    .map(
      ({ title, links }) => `
        <section class="footer-nav__group" aria-labelledby="footer-${title.toLowerCase()}">
          <h2 id="footer-${title.toLowerCase()}">${title}</h2>
          <ul>
            ${links
              .map(
                ({ label, href }) => `
                  <li><a href="${href}"><span>${label}</span><i aria-hidden="true"></i></a></li>
                `,
              )
              .join("")}
          </ul>
        </section>
      `,
    )
    .join("");
}

const footerYear = document.querySelector("[data-footer-year]");
const footerWhatsApp = document.querySelector("[data-footer-whatsapp]");
const footerAdvisor = document.querySelector("[data-footer-advisor]");
const footerAdvisorUrl = buildAdvisorUrl();

if (footerYear) footerYear.textContent = new Date().getFullYear();
if (footerWhatsApp) footerWhatsApp.href = footerAdvisorUrl;
if (footerAdvisor) footerAdvisor.href = footerAdvisorUrl;
