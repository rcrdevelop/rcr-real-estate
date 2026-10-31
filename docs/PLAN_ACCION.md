# Plan de Acción #02: Sistema de Gestión Inmobiliaria & Firma Digital

- **Componente actual en Portafolio:** `src/pages/projects/components/RealEstateDashboard.vue`
- **Subdominio objetivo:** `inmobiliaria.rcrdevelop.com` (o `realestate-rcr.web.app`)
- **Stack Original Declarado:** PHP + MariaDB + DocuSign
- **Stack Real en Firebase:** Vue 3 / Quasar SPA + Cloud Firestore + Firebase Storage + Cloud Functions (Node.js) + DocuSign eSignature REST API / Firma Canvas Nativa (`pdf-lib`)

---

## 1. Análisis de Limitantes Técnicas en Firebase y Solución Arquitectónica

| Limitante Técnica                                                                        | Impacto Real                                                                                                                                                                                            | Solución para Firebase + Subdominio                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Firebase Hosting NO ejecuta PHP ni MariaDB**                                           | Firebase Hosting es estático/CDN; no tiene intérprete PHP ni servidor MySQL/MariaDB.                                                                                                                    | **Opción 1 (100% Firebase Nativo - Recomendada):** Migrar el backend a **Cloud Functions (Node.js)** y la base de datos a **Cloud Firestore**. **Opción 2 (Si quieres conservar PHP):** Empaquetar la API PHP en un contenedor Docker en **Google Cloud Run** y conectarla a Firebase Hosting mediante `rewrites: [{ "source": "/api/**", "run": { "serviceId": "php-api" } }]`. |
| **DocuSign API requiere OAuth2 Server-to-Server (JWT Grant) y tiene límites en Sandbox** | No se puede llamar a DocuSign directamente desde el navegador por CORS y exposición de llaves privadas RSA. Además, la cuenta developer de DocuSign expira tokens o requiere configuración por usuario. | Implementar un **Modo Dual de Contratos**: 1) **Motor Nativo de Firma Digital en PDF (`pdf-lib` + `signature_pad`)** que funciona siempre al 100% sin depender de cuotas externas para el demo y para clientes que no quieran pagar DocuSign; 2) **Integración real con DocuSign Sandbox** vía Firebase Cloud Functions para clientes Enterprise.                                |
| **Búsqueda multicriterio en Firestore**                                                  | Firestore no soporta `LIKE %texto%` nativo combinando múltiples filtros de rango (precio + área + texto).                                                                                               | Para catálogos de hasta 500 propiedades por agencia, descargar la colección de la agencia al cliente con caché indexado y filtrar en memoria en `<5ms`, o usar búsqueda por tokens (`searchKeywords: array-contains`).                                                                                                                                                           |

---

## 2. Arquitectura de Datos en Firestore (Multi-Tenant para Inmobiliarias)

```text
agencies/{agencyId}
  ├── settings: { name, logoUrl, primaryColor, currency, docusignEnabled }
  ├── properties/{propertyId}
  │     └── { title, slug, price, status: "Disponible"|"Vendida"|"Alquilada", type, beds, baths, area, location, coordinates, images: [], agentId }
  ├── clients/{clientId}
  │     └── { fullName, email, phone, documentId, interestedIn: [] }
  └── contracts/{contractId}
        └── { propertyId, clientId, status: "Borrador"|"Enviado"|"Firmado", pdfUrl, signedPdfUrl, signatureAudit: { ip, timestamp, hash }, docusignEnvelopeId }
```

---

## 3. Plan de Implementación Paso a Paso

### Fase 1: CRUD de Propiedades & Portal Público (Semana 1)

1. **Panel Administrativo (Agente / Agencia)**:
   - Alta, edición y cambio de estado de propiedades con subida de galería de imágenes optimizadas a **WebP** directamente en el navegador (`canvas.toBlob('image/webp')`) antes de subir a **Firebase Storage**.
2. **Vista de Catálogo y Detalle de Propiedad**:
   - Filtros reactivos por rango de precio, habitaciones, tipo de inmueble, estado y mapa interactivo (Leaflet + OpenStreetMap, 100% gratuito sin requerir tarjeta de Google Maps).

### Fase 2: Generador de Contratos PDF y Firma Digital (Semana 2)

1. **Plantillas Dinámicas de Contrato (Arrendamiento / Compraventa)**:
   - Generación en tiempo real de un contrato PDF autocompletado con los datos del inmueble y del comprador/inquilino usando `pdf-lib`.
2. **Flujo de Firma Electrónica en Vivo**:
   - Modal con lienzo de firma (`<canvas>`), sello de tiempo, hash SHA-256 del documento y descarga inmediata del PDF firmado (ideal para que cualquier visitante del portafolio lo pruebe en vivo y descargue su contrato firmado).
3. **Conector DocuSign (Cloud Function)**:
   - Función `createEnvelope` que recibe `contractId`, envía el PDF a DocuSign Sandbox y devuelve la URL de firma embebida (`Embedded Signing`).

### Fase 3: Despliegue en Subdominio (`inmobiliaria.rcrdevelop.com`)

1. Configurar hosting target `inmobiliaria` en `firebase.json`.
2. Configurar reglas de Storage para permitir lectura pública de fotos de propiedades y escritura solo a usuarios autenticados de la agencia.
3. Añadir botón **"Restaurar Datos de Prueba"** en la barra superior del demo para que cualquier visitante pueda crear/editar propiedades y contratos sin romper la demo permanente.

---

## 4. Estrategia de Monetización (Template vs SaaS)

### Opción A: Venta como Template ($59 - $149 USD)

- **Producto:** "Real Estate CRM + Digital Contract Signer (Vue 3 + Firebase)".
- **Público:** Desarrolladores freelance que le venden sitios a agentes inmobiliarios locales.

### Opción B: Venta como SaaS para Agentes y Pequeñas Inmobiliarias ($29 - $79 USD/mes)

- **Problema que resuelve:** Muchos agentes inmobiliarios gestionan propiedades por WhatsApp/Excel y tardan días en redactar contratos.
- **Propuesta de valor:** Catálogo propio en su dominio + generador de contratos en 1 clic con firma desde el celular del cliente.
- **Planes:**
  - **Agente Individual ($29/mes):** Hasta 30 propiedades activas + 15 contratos firmados/mes.
  - **Agencia ($79/mes):** Propiedades ilimitadas, múltiples agentes, marca blanca (su propio logo y colores) e integración DocuSign.
