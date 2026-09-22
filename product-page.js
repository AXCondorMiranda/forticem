import { additiveProducts } from "./product-data.js";
import { buildWhatsAppUrl } from "./quote.js";
import { mountMotionEnhancements } from "./assets/motion-enhancements.js";

const slug = document.body.dataset.productSlug;
const product = additiveProducts[slug];

if (product) {
  document.querySelectorAll("[data-product-name]").forEach((element) => {
    element.textContent = product.name;
  });
  document.querySelector("[data-product-descriptor]").textContent = product.descriptor;
  document.querySelector("[data-product-problem]").textContent = product.problem;
  document.querySelector("[data-product-description]").textContent = product.description;
  const applications = document.querySelector("[data-product-applications]");
  product.applications.forEach((application) => {
    const item = document.createElement("li");
    item.textContent = application;
    applications.append(item);
  });

  const applicationsTitle = document.createElement("h3");
  applicationsTitle.className = "product-page__subheading";
  applicationsTitle.textContent = "Usos y aplicaciones";
  applications.before(applicationsTitle);

  const quoteMessage = `Hola FORTICEM, quiero solicitar información y cotizar ${product.name}.`;
  document.querySelector("[data-product-quote]").href = buildWhatsAppUrl(quoteMessage);

  if (product.sheet) {
    const details = document.createElement("section");
    details.className = "product-page__details";
    details.setAttribute("aria-label", `Detalles técnicos de ${product.name}`);
    details.innerHTML = `
      <div class="container product-page__details-inner">
        <div class="product-page__details-heading">
          <span class="product-page__eyebrow">Información de la ficha técnica</span>
          <h2>Datos para planificar<br />su aplicación.</h2>
        </div>
        <div class="product-page__detail-grid">
          <article class="product-page__detail-card">
            <h3>Beneficios</h3>
            <ul data-detail-benefits></ul>
          </article>
          <article class="product-page__detail-card">
            <h3>Dosificación orientativa</h3>
            <p data-detail-dosage></p>
          </article>
          <article class="product-page__detail-card">
            <h3>Modo de uso</h3>
            <ul data-detail-use></ul>
          </article>
          <article class="product-page__detail-card">
            <h3>Propiedades estimadas</h3>
            <dl data-detail-properties></dl>
          </article>
        </div>
        <div class="product-page__sheet">
          <div>
            <span>Presentaciones indicadas</span>
            <p data-detail-presentations></p>
            <p class="product-page__storage" data-detail-storage hidden></p>
          </div>
          <a class="product-page__download" data-detail-sheet download>Descargar ficha técnica PDF <span aria-hidden="true">↓</span></a>
        </div>
        <p class="product-page__technical-note">La dosificación es orientativa y debe verificarse para los materiales y condiciones de cada obra. Consulte la ficha técnica completa antes de usar el producto.</p>
      </div>
    `;

    const appendItems = (selector, items) => {
      const list = details.querySelector(selector);
      items.forEach((value) => {
        const item = document.createElement("li");
        item.textContent = value;
        list.append(item);
      });
    };

    appendItems("[data-detail-benefits]", product.benefits);
    appendItems("[data-detail-use]", product.use);
    details.querySelector("[data-detail-dosage]").textContent = product.dosage;
    details.querySelector("[data-detail-presentations]").textContent = product.presentations;
    product.properties.forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value;
      details.querySelector("[data-detail-properties]").append(term, description);
    });
    if (product.storage) {
      const storage = details.querySelector("[data-detail-storage]");
      storage.textContent = product.storage;
      storage.hidden = false;
    }
    details.querySelector("[data-detail-sheet]").href = `../../assets/documents/${product.sheet}`;
    document.querySelector("main").append(details);
    mountMotionEnhancements();
  }
}
