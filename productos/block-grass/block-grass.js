const phone = "51926793050";

document.querySelectorAll("[data-grass-quote]").forEach((link) => {
  const variant = link.dataset.grassQuote;
  const product = variant ? `Block Grass ${variant}` : "Block Grass FORTICEM";
  const message = `Hola FORTICEM, quiero solicitar una cotización.\nProducto: ${product}\nResistencia: 18 MPa / 35 MPa\nÁrea requerida:  m²\nCantidad estimada:  unidades\nDistrito de entrega: \nFecha requerida: `;
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const galleryCards = [...document.querySelectorAll(".grass-gallery__card")];
const galleryFilters = [...document.querySelectorAll("[data-gallery-filter]")];
const galleryDialog = document.querySelector(".grass-gallery__dialog");
const galleryStage = galleryDialog?.querySelector(".grass-gallery__stage");
const galleryCount = galleryDialog?.querySelector(".grass-gallery__dialog-count");
const galleryTitle = galleryDialog?.querySelector(".grass-gallery__dialog-title");
const galleryTotal = document.querySelector("[data-gallery-total]");
let visibleCards = galleryCards;
let activeIndex = 0;

galleryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.galleryFilter;
    galleryFilters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    galleryCards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.galleryCategory !== category;
    });
    visibleCards = galleryCards.filter((card) => !card.hidden);
    if (galleryTotal) galleryTotal.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? "registro" : "registros"}`;
  });
});

function showGalleryItem(index) {
  if (!galleryDialog || !galleryStage || !visibleCards.length) return;
  activeIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[activeIndex];
  const media = document.createElement(card.dataset.galleryType === "video" ? "video" : "img");

  if (media instanceof HTMLVideoElement) {
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
    media.poster = card.dataset.galleryPoster;
    media.setAttribute("aria-label", card.dataset.galleryTitle);
  } else {
    media.alt = card.querySelector("img")?.alt || card.dataset.galleryTitle;
  }
  media.src = card.dataset.gallerySrc;
  galleryStage.replaceChildren(media);
  galleryCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(visibleCards.length).padStart(2, "0")}`;
  galleryTitle.textContent = card.dataset.galleryTitle;
}

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    activeIndex = visibleCards.indexOf(card);
    showGalleryItem(activeIndex);
    galleryDialog?.showModal();
  });
});

galleryDialog?.querySelector(".grass-gallery__close")?.addEventListener("click", () => galleryDialog.close());
galleryDialog?.querySelector(".grass-gallery__previous")?.addEventListener("click", () => showGalleryItem(activeIndex - 1));
galleryDialog?.querySelector(".grass-gallery__next")?.addEventListener("click", () => showGalleryItem(activeIndex + 1));
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
