const phone = "51926793050";
const quoteLinks = document.querySelectorAll("[data-separator-quote]");
const measureButtons = document.querySelectorAll("[data-measure]");
const selectedMeasure = document.querySelector("[data-selected-measure]");
const selectedUse = document.querySelector("[data-selected-use]");
const selectedUnits = document.querySelector("[data-selected-units]");
const selectedWeight = document.querySelector("[data-selected-weight]");
const selectedQuote = document.querySelector("[data-selected-quote]");
const selectedPrices = document.querySelector("[data-selected-prices]");
const selectedUnitPrice = document.querySelector("[data-selected-unit-price]");
const selectedHundredPrice = document.querySelector("[data-selected-hundred-price]");
const selectedThousandPrice = document.querySelector("[data-selected-thousand-price]");
const priceTierButtons = [...document.querySelectorAll("[data-price-tier]")];
const volumeQuote = document.querySelector("[data-volume-quote]");
let activeSelection = null;
let activeTier = "Millar";

const formatPrice = (value, decimals = 0) => `S/ ${Number(value).toLocaleString("en-US", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
})}`;

const buildQuoteUrl = (measure = "", tier = "", price = "") => {
  const detail = measure ? `\nMedida: ${measure}` : "";
  const presentation = tier ? `\nPresentación: ${tier}` : "";
  const listedPrice = price ? `\nPrecio publicado con IGV: ${price}` : "";
  const message = `Hola FORTICEM, quiero cotizar separadores de concreto.${detail}${presentation}${listedPrice}\nCantidad requerida: \nDistrito o destino: `;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const updateSelectedQuote = () => {
  if (!activeSelection || !selectedQuote) return;
  const tierPrice = {
    Unidad: formatPrice(activeSelection.unitPrice, 2),
    Ciento: formatPrice(activeSelection.hundredPrice),
    Millar: formatPrice(activeSelection.thousandPrice),
  }[activeTier];
  selectedQuote.href = buildQuoteUrl(activeSelection.measure, activeTier, tierPrice);
};

quoteLinks.forEach((link) => {
  link.href = buildQuoteUrl();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

if (volumeQuote) {
  const message = "Hola FORTICEM, necesito una cotización por volumen de separadores de concreto.\nCantidad: más de 2 millares\nMedida requerida: \nCantidad exacta: \nDistrito o destino: ";
  volumeQuote.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  volumeQuote.target = "_blank";
  volumeQuote.rel = "noopener noreferrer";
}

measureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    measureButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    const measure = button.dataset.measure;
    selectedMeasure.textContent = measure;
    selectedUse.textContent = `${button.dataset.use}. Confirma esta referencia con los planos del proyecto.`;
    selectedUnits.textContent = button.dataset.units;
    selectedWeight.textContent = button.dataset.weight;
    selectedUnitPrice.textContent = formatPrice(button.dataset.unitPrice, 2);
    selectedHundredPrice.textContent = formatPrice(button.dataset.hundredPrice);
    selectedThousandPrice.textContent = formatPrice(button.dataset.thousandPrice);
    selectedPrices.hidden = false;
    activeSelection = {
      measure,
      unitPrice: button.dataset.unitPrice,
      hundredPrice: button.dataset.hundredPrice,
      thousandPrice: button.dataset.thousandPrice,
    };
    activeTier = "Millar";
    priceTierButtons.forEach((item) => {
      const selected = item.dataset.priceTier === activeTier;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateSelectedQuote();
    selectedQuote.target = "_blank";
    selectedQuote.rel = "noopener noreferrer";
    selectedQuote.removeAttribute("aria-disabled");
  });
});

priceTierButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTier = button.dataset.priceTier;
    priceTierButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateSelectedQuote();
  });
});

measureButtons[0]?.click();

selectedQuote?.addEventListener("click", (event) => {
  if (selectedQuote.getAttribute("aria-disabled") === "true") event.preventDefault();
});

const galleryCards = [...document.querySelectorAll(".separator-gallery__card")];
const galleryFilters = [...document.querySelectorAll("[data-separator-gallery-filter]")];
const galleryDialog = document.querySelector(".separator-gallery__dialog");
const galleryStage = galleryDialog?.querySelector(".separator-gallery__stage");
const galleryCount = galleryDialog?.querySelector(".separator-gallery__dialog-count");
const galleryTitle = galleryDialog?.querySelector(".separator-gallery__dialog-title");
const galleryTotal = document.querySelector("[data-separator-gallery-total]");
let visibleCards = galleryCards;
let activeIndex = 0;

galleryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.separatorGalleryFilter;
    galleryFilters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    galleryCards.forEach((card) => {
      card.hidden = category !== "all" && (category === "video" ? card.dataset.type !== "video" : card.dataset.category !== category);
    });
    visibleCards = galleryCards.filter((card) => !card.hidden);
    galleryTotal.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? "registro" : "registros"}`;
  });
});

function showGalleryItem(index) {
  if (!galleryDialog || !galleryStage || !visibleCards.length) return;
  activeIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[activeIndex];
  const media = document.createElement(card.dataset.type === "video" ? "video" : "img");

  if (media instanceof HTMLVideoElement) {
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
    media.poster = card.dataset.poster;
    media.setAttribute("aria-label", card.dataset.title);
  } else {
    media.alt = card.querySelector("img")?.alt || card.dataset.title;
  }
  media.src = card.dataset.src;
  galleryStage.replaceChildren(media);
  galleryCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(visibleCards.length).padStart(2, "0")}`;
  galleryTitle.textContent = card.dataset.title;
}

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    showGalleryItem(visibleCards.indexOf(card));
    galleryDialog?.showModal();
  });
});

galleryDialog?.querySelector(".separator-gallery__close")?.addEventListener("click", () => galleryDialog.close());
galleryDialog?.querySelector(".separator-gallery__previous")?.addEventListener("click", () => showGalleryItem(activeIndex - 1));
galleryDialog?.querySelector(".separator-gallery__next")?.addEventListener("click", () => showGalleryItem(activeIndex + 1));
galleryDialog?.addEventListener("close", () => galleryStage?.replaceChildren());
galleryDialog?.addEventListener("click", (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog?.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLVideoElement) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showGalleryItem(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
