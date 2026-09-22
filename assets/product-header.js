const legacyHeader = document.querySelector(".product-page__header");
const catalogHref = document.body.dataset.productSlug ? "../../#linea-aditivos" : "../../#productos";

if (legacyHeader) {
  legacyHeader.insertAdjacentHTML("beforebegin", `
    <header class="site-header product-header is-scrolled" data-product-header>
      <div class="site-header__inner container">
        <a class="brand" href="../../#inicio" aria-label="FORTICEM, volver al inicio">
          <img class="brand__symbol" src="../../assets/brand/forticem-symbol-light.svg" width="36" height="42" alt="" />
          <span class="brand__wordmark"><span class="brand__name">FORTICEM</span><span class="brand__descriptor">Química aplicada a la construcción</span></span>
        </a>
        <nav class="desktop-nav" aria-label="Navegación principal">
          <a class="nav-link" href="../../#inicio">Inicio</a>
          <a class="nav-link is-active" href="../../#productos" aria-current="page">Productos</a>
          <a class="nav-link" href="../../#soluciones">Soluciones</a>
          <a class="nav-link" href="../../#confianza-operativa">Nosotros</a>
          <a class="nav-link" href="../../#entregas">Proyectos / Entregas</a>
          <a class="nav-link" href="../../#block-michi-tecnico">Recursos</a>
          <a class="nav-link" href="../../#cotizacion">Contacto</a>
        </nav>
        <a class="quote-cta quote-cta--desktop" href="../../#cotizacion">Solicitar cotización <span class="quote-cta__arrow" aria-hidden="true">↗</span></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="product-mobile-navigation" aria-label="Abrir menú" data-product-toggle>
          <span class="menu-toggle__label">Menú</span><span class="menu-toggle__icon" aria-hidden="true"><i></i><i></i></span>
        </button>
      </div>
    </header>
    <div class="mobile-nav" id="product-mobile-navigation" data-product-menu hidden>
      <div class="mobile-nav__backdrop" data-product-close></div>
      <nav class="mobile-nav__panel" aria-label="Navegación móvil">
        <div class="mobile-nav__top"><span class="mobile-nav__section-label">Navegación</span><button class="mobile-nav__close" type="button" aria-label="Cerrar menú" data-product-close><span aria-hidden="true"></span></button></div>
        <div class="mobile-nav__links">
          <a class="mobile-nav__link" href="../../#inicio">Inicio</a>
          <a class="mobile-nav__link is-active" href="../../#productos" aria-current="page">Productos</a>
          <a class="mobile-nav__link" href="../../#soluciones">Soluciones</a>
          <a class="mobile-nav__link" href="../../#confianza-operativa">Nosotros</a>
          <a class="mobile-nav__link" href="../../#entregas">Proyectos / Entregas</a>
          <a class="mobile-nav__link" href="../../#block-michi-tecnico">Recursos</a>
          <a class="mobile-nav__link" href="../../#cotizacion">Contacto</a>
        </div>
        <div class="mobile-nav__footer"><a class="quote-cta quote-cta--mobile" href="../../#cotizacion">Solicitar cotización <span class="quote-cta__arrow" aria-hidden="true">↗</span></a><p>Prefabricados, aditivos y soluciones técnicas para construcción.</p></div>
      </nav>
    </div>
  `);
  legacyHeader.remove();
  document.querySelector(".product-page main")?.insertAdjacentHTML("afterbegin", `
    <nav class="product-section-nav" aria-label="Secciones del aditivo">
      <div class="container product-section-nav__inner"><span>Aditivos FORTICEM</span><a href="#informacion">Información y aplicaciones</a><a href="${catalogHref}">Catálogo completo ↗</a></div>
    </nav>
  `);
}

const header = document.querySelector("[data-product-header]");
const menu = document.querySelector("[data-product-menu]");
const toggle = header?.querySelector("[data-product-toggle]");
const closeButtons = menu?.querySelectorAll("[data-product-close]") || [];

function closeMenu() {
  if (!header || !menu || !toggle) return;
  menu.classList.remove("is-open");
  menu.hidden = true;
  header.classList.remove("is-menu-active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
  document.body.style.removeProperty("overflow");
}

toggle?.addEventListener("click", () => {
  if (!header || !menu) return;
  if (!menu.hidden) return closeMenu();
  menu.hidden = false;
  menu.classList.add("is-open");
  header.classList.add("is-menu-active");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Cerrar menú");
  document.body.style.overflow = "hidden";
  menu.querySelector(".mobile-nav__close")?.focus();
});

closeButtons.forEach((button) => button.addEventListener("click", closeMenu));
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu && !menu.hidden) {
    closeMenu();
    toggle?.focus();
  }
});
window.matchMedia("(min-width: 80rem)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
