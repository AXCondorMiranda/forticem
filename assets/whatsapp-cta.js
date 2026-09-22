import { buildWhatsAppUrl } from "../quote.js";

export const mountQuickQuote = () => {
  if (document.querySelector("[data-whatsapp-quick-quote]")) return;

  const productName = document.body.dataset.productSlug
    ? document.title.split("|")[0].trim()
    : "";
  const message = productName
    ? `Hola FORTICEM, quisiera una cotización rápida de ${productName}.`
    : "Hola FORTICEM, quisiera solicitar una cotización rápida.";
  const link = document.createElement("a");

  link.className = "whatsapp-quick-quote";
  link.href = buildWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.dataset.whatsappQuickQuote = "";
  link.setAttribute("aria-label", "Solicitar cotización rápida por WhatsApp");
  link.innerHTML = `
    <span class="whatsapp-quick-quote__icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M16 3.2A12.6 12.6 0 0 0 5.1 22.1L3.4 28.8l6.9-1.7A12.6 12.6 0 1 0 16 3.2Zm0 22.9a10.3 10.3 0 0 1-5.2-1.4l-.4-.2-4.1 1 1.1-4-.3-.4A10.3 10.3 0 1 1 16 26.1Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.7.1-1.8-.9-3-1.6-4.2-3.7-.3-.6.3-.5.9-1.7.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.6-.5-.9-.5h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 4c.2.3 2.7 4.1 6.5 5.7 2.4 1 3.3 1.1 4.5.9.7-.1 1.8-.7 2.1-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/>
      </svg>
    </span>
    <span class="whatsapp-quick-quote__copy"><strong>Cotización rápida</strong><small>Escríbenos por WhatsApp</small></span>
  `;

  document.body.append(link);
};
