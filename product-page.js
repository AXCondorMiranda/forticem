import { additiveProducts } from "./product-data.js";
import { buildWhatsAppUrl } from "./quote.js";

const slug = document.body.dataset.productSlug;
const product = additiveProducts[slug];

if (product) {
  document.title = `${product.name} | FORTICEM`;
  document.querySelectorAll("[data-product-name]").forEach((element) => {
    element.textContent = product.name;
  });
  document.querySelector("[data-product-descriptor]").textContent = product.descriptor;
  document.querySelector("[data-product-problem]").textContent = product.problem;
  document.querySelector("[data-product-description]").textContent = product.description;
  document.querySelector("[data-product-applications]").innerHTML = product.applications
    .map((application) => `<li>${application}</li>`)
    .join("");

  const quoteMessage = `Hola FORTICEM, quiero solicitar información y cotizar ${product.name}.`;
  document.querySelector("[data-product-quote]").href = buildWhatsAppUrl(quoteMessage);
}
