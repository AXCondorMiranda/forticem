export const FORTICEM_WHATSAPP_NUMBER = "51926793050";

export const buildQuoteMessage = ({ name, company, product, quantity, location, details }) => {
  const lines = [
    "Hola FORTICEM, quiero solicitar una cotización.",
    "",
    `Producto: ${product.trim()}`,
    `Cantidad: ${quantity.trim()}`,
    `Ubicación: ${location.trim()}`,
    `Nombre: ${name.trim()}`,
  ];

  if (company?.trim()) lines.push(`Empresa: ${company.trim()}`);
  if (details?.trim()) lines.push("", "Detalles:", details.trim());

  return lines.join("\n");
};

export const buildWhatsAppUrl = (message) =>
  `https://wa.me/${FORTICEM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const buildAdvisorUrl = () =>
  buildWhatsAppUrl(
    "Hola FORTICEM, quisiera recibir información y asesoría sobre sus productos.",
  );
