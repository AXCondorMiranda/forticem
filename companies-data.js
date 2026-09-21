/*
 * Fuente única de clientes y socios FORTICEM.
 *
 * Cada registro admite:
 * id, name, logo, logoMonochrome, locationPhoto, locationPending, coverage, address,
 * type, href, featured, order, approved y monochromeSafe.
 *
 * Una empresa solo puede publicarse cuando su identidad, relación comercial,
 * autorización y asset oficial hayan sido confirmados.
 */
export const companies = Object.freeze([
  {
    id: "alfagross-trujillo",
    name: "ALFAGROSS",
    type: "Distribuidor",
    approved: true,
    featured: true,
    order: 1,
    monochromeSafe: false,
    coverage: "Trujillo",
    address: "Vía de Evitamiento Km 585, Trujillo 13000",
    logo: {
      src: "assets/images/partners/alfagross-logo-transparent-v1.png",
      width: 1296,
      height: 780,
    },
    logoMonochrome: {
      src: "assets/images/partners/alfagross-logo-monochrome-v1.png",
      width: 1296,
      height: 780,
    },
    locationPhoto: {
      src: "assets/images/partners/alfagross-local-trujillo-v2.png",
      width: 1448,
      height: 1086,
      alt: "Local de ALFAGROSS en Vía de Evitamiento, Trujillo",
    },
  },
  {
    id: "corporacion-mendez-moquegua",
    name: "Corporación Méndez",
    type: "Distribuidor",
    approved: true,
    featured: true,
    order: 2,
    monochromeSafe: false,
    coverage: "Moquegua",
    address: "R35H+8Q2, Moquegua 18001",
    logo: {
      src: "assets/images/partners/corporacion-mendez-logo-transparent-v1.png",
      width: 1386,
      height: 1135,
    },
    logoMonochrome: {
      src: "assets/images/partners/corporacion-mendez-logo-monochrome-v1.png",
      width: 1386,
      height: 1135,
    },
    locationPhoto: {
      src: "assets/images/partners/corporacion-mendez-local-moquegua-v1.png",
      width: 1254,
      height: 1254,
      alt: "Local de Corporación Méndez en Moquegua",
    },
  },
  {
    id: "ferreteria-luna-san-juan-de-lurigancho",
    name: "Distribuidora y Ferretería Luna",
    type: "Distribuidor",
    approved: true,
    featured: true,
    order: 3,
    monochromeSafe: false,
    coverage: "San Juan de Lurigancho",
    address: "Urb. Semi Rústica, Av. Sta. Rosa de Lima 671, San Juan de Lurigancho 15438",
    logo: {
      src: "assets/images/partners/ferreteria-luna-logo-transparent-v1.png",
      width: 1962,
      height: 802,
    },
    logoMonochrome: {
      src: "assets/images/partners/ferreteria-luna-logo-monochrome-v1.png",
      width: 1962,
      height: 802,
    },
    locationPhoto: {
      src: "assets/images/partners/ferreteria-luna-local-san-juan-de-lurigancho-v1.png",
      width: 1448,
      height: 1086,
      alt: "Local de Distribuidora y Ferretería Luna en San Juan de Lurigancho",
    },
  },
  {
    id: "consorcio-ferreteria-jaimito-villa-maria-del-triunfo",
    name: "Consorcio Ferretería Jaimito",
    type: "Distribuidor",
    approved: true,
    featured: true,
    order: 4,
    monochromeSafe: false,
    coverage: "Villa María del Triunfo",
    address: "Villa María del Triunfo, Lima",
    logo: {
      src: "assets/images/partners/consorcio-jaimito-logo-transparent-v1.png",
      width: 1736,
      height: 906,
    },
    logoMonochrome: {
      src: "assets/images/partners/consorcio-jaimito-logo-monochrome-v1.png",
      width: 1736,
      height: 906,
    },
    locationPhoto: {
      src: "assets/images/partners/consorcio-jaimito-local-villa-maria-del-triunfo-v1.png",
      width: 1086,
      height: 1448,
      alt: "Local de Consorcio Ferretería Jaimito en Villa María del Triunfo",
    },
  },
  {
    id: "distribuidora-mary-unicachi",
    name: "Distribuidora Mary",
    type: "Distribuidor",
    approved: true,
    featured: true,
    order: 5,
    monochromeSafe: false,
    coverage: "San Martín de Porres",
    address: "Centro Ferretero Unicachi, Av. los Próceres de Huandoy 8120, tiendas 342 y 164, San Martín de Porres 15314",
    logo: {
      src: "assets/images/partners/distribuidora-mary-logo-transparent-v1.png",
      width: 1852,
      height: 849,
    },
    logoMonochrome: {
      src: "assets/images/partners/distribuidora-mary-logo-monochrome-v1.png",
      width: 1852,
      height: 849,
    },
    locationPhoto: {
      src: "assets/images/partners/distribuidora-mary-local-unicachi-v1.png",
      width: 1672,
      height: 941,
      alt: "Local de Distribuidora Mary en Centro Ferretero Unicachi",
    },
  },
]);

const hasPublishableIdentity = (company) =>
  Boolean(
    company?.id &&
      company.name &&
      company.approved === true &&
      company.logo?.src &&
      company.logo?.width &&
      company.logo?.height &&
      (company.locationPending === true ||
        (company.locationPhoto?.src &&
          company.locationPhoto?.width &&
          company.locationPhoto?.height)) &&
      company.coverage &&
      company.address,
  );

export const getApprovedCompanies = () =>
  companies
    .filter(hasPublishableIdentity)
    .sort((first, second) => (first.order ?? 999) - (second.order ?? 999));
