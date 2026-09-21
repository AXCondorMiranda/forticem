/*
 * Fuente única de registros de entrega FORTICEM.
 *
 * Campos requeridos para publicar en Home:
 * id, slug, product, productSlug, city, citySlug, image y alt.
 *
 * Campos opcionales:
 * destination, region, date, clientType, quantity, description,
 * project, featured, priority, images, objectPosition y imageAspect.
 *
 * No se incluyen registros hasta contar con fotografía, producto y destino
 * confirmados. Esta colección puede migrarse posteriormente a un CMS o API
 * sin cambiar el componente de presentación.
 */
export const deliveries = Object.freeze([
  {
    id: "delivery-separadores-ica-01",
    slug: "separadores-concreto-ica",
    product: "Separadores de concreto",
    productSlug: "separadores-concreto",
    city: "Ica",
    citySlug: "ica",
    region: "Ica",
    image: {
      src: "assets/images/deliveries/separadores-ica-v1.jpeg",
      width: 1122,
      height: 1402,
    },
    alt: "Entrega documentada de separadores de concreto FORTICEM con destino a Ica",
    description: "Despacho documentado de separadores de concreto con destino a Ica.",
    href: "/productos/separadores-concreto/index.html#evidencia",
    featured: true,
    priority: 1,
    objectPosition: "center",
    imageAspect: "4 / 5",
  },
]);

export const getDeliveriesByProduct = (productSlug) =>
  deliveries.filter((delivery) => delivery.productSlug === productSlug);

export const getDeliveriesByCity = (citySlug) =>
  deliveries.filter((delivery) => delivery.citySlug === citySlug);

const hasHomeEvidence = (delivery) =>
  Boolean(
    delivery?.id &&
      delivery.slug &&
      delivery.product &&
      delivery.productSlug &&
      delivery.city &&
      delivery.citySlug &&
      delivery.image?.src &&
      delivery.image?.width &&
      delivery.image?.height &&
      delivery.alt,
  );

export const getFeaturedDeliveries = () =>
  deliveries
    .filter((delivery) => delivery.featured && hasHomeEvidence(delivery))
    .sort((first, second) => (first.priority ?? 999) - (second.priority ?? 999))
    .slice(0, 5);
