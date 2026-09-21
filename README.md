# FORTICEM — sistema visual y navegación

Desarrollo progresivo de la web oficial de FORTICEM. Actualmente incluye el sistema global de diseño, el Header responsive y las fases 3 a 11 disponibles en este checkout de la Home.

## Vista local

La web utiliza módulos JavaScript y modelos GLB, por lo que debe servirse por HTTP;
no abra `index.html` mediante `file:///`. Desde esta carpeta ejecute, por ejemplo:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Después abra `http://127.0.0.1:4173/`. Si `index.html` se abre accidentalmente
como archivo local mientras el servidor está activo, la propia página redirige a
esa URL conservando la sección indicada en el hash.

## Logo pendiente

El repositorio no contenía un asset oficial del logo al iniciar esta etapa. El Header usa temporalmente un lockup tipográfico claramente aislado en `.brand`. Cuando se incorpore el archivo oficial, debe reemplazarse ese contenido sin modificar sus proporciones ni colores.

## Assets de producto

El Block Grass tipo Michi incorpora un modelo tridimensional GLB interactivo de 35 × 35 × 9 cm para el Hero, con textura PBR de concreto y poster WebP de respaldo. La familia de adoquines dispone de un GLB con tres piezas en acabados rojo, gris y negro; la familia de separadores incorpora tres cuerpos representativos de 2,5, 4 y 7 cm con dados texturizados y clips plásticos azules; la familia de escantillones reúne tres piezas GLB de 20, 25 y 30 cm; King Block dispone de tres bloques huecos GLB diferenciados P9, P12 y P13. La familia química incorpora modelos GLB de FLOW, CURE y RELEASE en envases de 200 L, 20 L y 4 L. Los modelos se generan de forma reproducible mediante los scripts `generate-*-glb.py` de la carpeta `scripts`.

## Alcance implementado

- Tokens de color, tipografía, espacio, radios, bordes, sombras, movimiento y capas.
- Header de dos estados: superior y compacto al hacer scroll.
- Navegación desktop con mega menú de productos basado en datos.
- Navegación mobile con productos y soluciones desplegables.
- Bloqueo de scroll, cierre por Escape, focus trap y restauración de foco.
- Soporte para `prefers-reduced-motion`.
- Hero editorial responsive con visor rotativo de productos, transición 3D, controles manuales, reproducción automática pausada al interactuar y alternativa para movimiento reducido.
- Primeras páginas individuales para FLOW, FLOW+, CURE, RELEASE y SEAL, alimentadas desde una fuente de datos compartida.
- Sección editorial responsive “Dos mundos. Una marca.” con navegación hacia Prefabricados y Aditivos.
- Revelado progresivo mediante `IntersectionObserver`, con alternativa completa para movimiento reducido.
- Mosaico editorial de seis productos destacado, renderizado desde una estructura de datos reutilizable.
- Rutas individuales, métricas verificables y placeholders preparados para imágenes responsive AVIF/WebP.
- Storytelling técnico del Block Grass tipo Michi con progresión sticky en desktop y lectura vertical en mobile.
- Datos confirmados: 35 MPa, 35 × 35 × 9 cm y 15–15.2 kg.
- CTA de WhatsApp con el producto precargado y render optimizado preparado para una futura evolución a GLB.
- Sección documental de confianza operativa con fabricación, calidad medible, stock, entrega, atención y asesoría.
- CTA general de WhatsApp sin producto preseleccionado y espacios preparados para fotografías reales de operación.
- Sección editorial de plantas con Ventanilla y Pachacútec, alternancia de composición y puente narrativo hacia futuras entregas.
- Dirección confirmada de Ventanilla y tratamiento transparente de los registros fotográficos todavía pendientes.
- Sección de entregas conectada a una fuente de datos independiente y preparada para destacar hasta cinco registros confirmados.
- Estado documental explícito mientras no existan fotografías, productos y destinos verificables.
- Sección compacta de clientes y socios conectada a una fuente de datos independiente.
- Filtro obligatorio por autorización y asset oficial antes de publicar cualquier empresa.
- CTA final de cotización con formulario accesible, validación inline y generación de mensaje para WhatsApp.
- Selector conectado a la misma colección de productos destacados y soporte de preselección mediante `?product=slug`.
- Footer institucional data-driven con navegación exclusivamente hacia contenido activo de la Home.
- Datos confirmados de Ventanilla, referencia prudente a la operación de Pachacútec y contacto directo por WhatsApp.
- Año de copyright dinámico y estructura preparada para incorporar recursos, legales y datos corporativos futuros sin publicarlos antes de existir.

## Assets de Fase 7 pendientes

No existen fotografías de planta clasificadas en el repositorio. La Fase 7 reserva dos superficies documentales con proporciones estables, sin imágenes de stock ni atribuciones inventadas. Deben sustituirse por fotografías reales verificadas de Ventanilla y Pachacútec.

## Datos de Fase 8

`deliveries-data.js` es la fuente única de entregas. La colección permanece vacía hasta disponer de evidencia confirmada. Admite relaciones por producto y ciudad, selección `featured`, prioridad editorial, imágenes responsive y campos opcionales sin mostrar valores vacíos.

## Datos de Fase 9

`companies-data.js` es la fuente única de clientes, socios y distribuidores. La colección permanece vacía hasta confirmar identidad, clasificación, autorización y logo oficial. La Home no genera un muro de logos artificial cuando no existen al menos entidades publicables.

## Cotización de Fase 10

`quote.js` separa la construcción del mensaje y la URL de WhatsApp del estado y la validación del formulario. El formulario no utiliza backend, conserva los datos al abrir WhatsApp y deja documentado un punto de integración futuro para analytics sin datos personales.

## Footer de Fase 11

El Footer se genera desde `footerSections` en `app.js` y reutiliza la colección de productos destacados. No publica email, redes sociales, RUC, horarios, documentos legales ni páginas de recursos porque esos datos o destinos todavía no existen en el proyecto.
