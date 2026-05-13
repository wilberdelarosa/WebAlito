# ALITO Web Blueprint Modular Ready

## Objetivo

Este blueprint deja definido como ejecutar el rediseño premium de ALITO sobre la base ya funcional de Medusa sin romper el flujo existente de portal, cotizaciones, pagos y documentos.

La meta no es rehacer la logica. La meta es reemplazar la capa visual, mejorar la experiencia y endurecer la estructura de componentes alrededor del flujo ya cableado.

## Base Confirmada

- Storefront: Next 15 App Router.
- UI disponible: Tailwind, Framer Motion, Three, React Three Fiber, Drei.
- Nuevas dependencias instaladas: `lucide-react`, `next-themes`, `@21st-sdk/nextjs`.
- Flujo ya implementado: portal cliente, auth Supabase, quote intake, historial, documentos firmados y pagos.
- Fuente de verdad operacional: Supabase + edge function `alito-web-intake`.

## Direccion Visual

- Identidad principal: carbon, blanco roto y dorado industrial.
- Light mode: blanco tecnico, gris cemento, bordes suaves, acento dorado contenido.
- Dark mode: grafito profundo, superficies satinadas, sombras largas, brillos dorados localizados.
- Tono: premium industrial, no gaming, no SaaS generico, no ecommerce brillante.
- Densidad: menos cards al mismo tiempo, mas jerarquia, mas aire, mas bloques hero y railes curados.

## Referencias Observadas

- El detalle de equipo funciona bien como referencia de composicion: media dominante a la izquierda, resumen de alquiler a la derecha, tabs debajo.
- El logo empuja una identidad geometrica industrial con borde dorado y fondo oscuro, no tipografia suave ni colores pastel.
- Los PNG sin fondo de camiones y equipos permiten un hero mucho mas premium que el collage recargado actual.
- La carpeta de materiales disponible es `catalogo_materiales_png`; la ruta con `sin_fondo` no estaba presente durante la auditoria.

## Arquitectura UX Recomendada

### 1. Home

- Hero cinematografico con 1 solo equipo estrella o secuencia rotatoria muy controlada.
- Buscador principal con rutas directas a equipos, materiales y cotizacion.
- Rail curado de categorias operativas.
- Banda de confianza con iconos reales, no emojis.
- Seccion de materiales como modulo aparte, mas editorial y menos cuadricula.

### 2. Catalogo

- Layout de 3 columnas: filtros, grid, panel de cotizacion.
- Cards mas limpias con imagen recortada, specs minimas, estado y CTA.
- Hover con profundidad ligera y motion corto.
- Modal o side sheet para preview rapido sin salir del grid.

### 3. Detalle de Equipo

- Hero dividido con media dominante.
- Tabs reales: descripcion, especificaciones, aplicaciones, disponibilidad, documentos.
- Panel de alquiler fijo con toggles de operador y transporte.
- Variante premium: visor 3D placeholder ya integrado y reemplazable por `.glb` real.

### 4. Cotizacion

- Wizard por pasos con progreso claro.
- Resumen lateral persistente.
- Dropzone refinado para documentos.
- Validacion visual fuerte antes de enviar.

### 5. Portal Cliente

- Dashboard menos cargado y mas orientado a timeline.
- Tarjetas KPI arriba, timeline central, documentos y pagos a la derecha.
- Estados con codificacion consistente entre web y ERP.

## Sistema de Componentes Premium

### Fundacionales

- `TopNavShell`
- `ThemeToggle`
- `SearchCommandBar`
- `SectionEyebrow`
- `MetricBadge`
- `StatusPill`
- `ActionPanel`
- `ContentRail`

### Catalogo y Venta

- `HeroVehicleStage`
- `EquipmentCardPremium`
- `MaterialCardPremium`
- `FilterSidebar`
- `QuoteDock`
- `QuickPreviewSheet`

### Portal Cliente

- `QuoteTimeline`
- `DocumentCard`
- `PaymentProofUploader`
- `CommercialSummary`
- `ApprovalSheet`

### 3D y Motion

- `VehicleStage3D`
- `OrbitalPreviewCanvas`
- `ParallaxGridBackdrop`
- `ScrollRevealCluster`
- `SpecRing`

## Librerias Recomendadas

### Mantener

- `framer-motion` para stagger, hero transitions, timeline y microinteracciones.
- `three`, `@react-three/fiber`, `@react-three/drei` para visor 3D y escenas controladas.
- `lucide-react` para toda la iconografia UI.
- `next-themes` para dark/light real sin hacks manuales.

### Integrar de forma selectiva

- `@21st-sdk/nextjs` para acelerar importacion/adaptacion de componentes premium.
- Radix ya presente en el repo para primitives accesibles.

### No recomendado como base visual

- No usar emojis en UI.
- No abusar de particles ni glow constantes.
- No usar smooth-scroll invasivo hasta cerrar accesibilidad y rendimiento.

## Plan Modular

### Modulo A. Design Tokens y Tema

- Consolidar variables CSS para `bg`, `surface`, `border`, `text`, `muted`, `accent`, `success`, `warning`.
- Introducir `ThemeProvider` global.
- Crear escala tipografica y sombras premium.

### Modulo B. Shell y Navegacion

- Header unificado.
- Toggle dark/light.
- Buscador central y CTA principal.
- Layout con fondo y spacing coherente.

### Modulo C. Home Premium

- Rehacer `HeroSection` para modo cinematografico controlado.
- Reemplazar mosaicos recargados por bloques editoriales.
- Conectar categorias y materiales al flujo existente.

### Modulo D. Catalogo Premium

- Sustituir cards actuales por una familia premium de cards.
- Mantener `buildCatalogQuoteItem` y `buildEquipmentQuoteItem` sin tocar contrato.
- Mantener `onAddItem`, `onSelectEquipment` y panel de cotizacion.

### Modulo E. Detalle con 3D

- Fase 1: stage 2.5D con PNG sin fondo, luces y orbit suave simulada.
- Fase 2: reemplazo por `.glb` real cuando existan modelos.
- No bloquear el negocio por no tener 3D real desde el dia uno.

### Modulo F. Portal Cliente

- Reordenar dashboard.
- Dar protagonismo al timeline y expediente comercial.
- Mantener downloads y pagos sobre el intake actual.

## Contratos que Claude No Debe Romper

- `fetchAlitoPublicCatalog`
- `fetchMyAlitoQuoteRequests`
- `fetchAlitoClientPortalSummary`
- `fetchMyAlitoPaymentProofs`
- `submitAlitoQuoteRequest`
- `approveAlitoQuoteRequest`
- `downloadAlitoClientDocument`
- `uploadAlitoPaymentProofFile`

## Criterios de Calidad

- Cero emojis en la UI. Solo iconos.
- El diseño debe funcionar en dark y light.
- El layout debe ser fuerte en desktop y limpio en mobile.
- El 3D debe degradar elegantemente a imagen premium.
- No tocar backend ni edge functions salvo que el contrato lo exija.

## Prompt Maestro para Claude Opus 4.7

Usa exactamente este encuadre:

```text
Actua como un Frontend Staff Engineer especializado en Next.js 15, React 19, Tailwind, Framer Motion y React Three Fiber.

Trabajas sobre una base ya funcional. No debes reescribir la arquitectura de negocio ni romper los contratos de datos existentes.

Objetivo:
Rediseñar el portal ALITO en modo premium industrial con soporte dark/light, motion de alta calidad, iconografia profesional y 3D degradable, manteniendo intacto el flujo existente de cotizaciones, portal cliente, documentos y pagos.

Restricciones duras:
1. No usar emojis en UI.
2. Usar lucide-react para iconos.
3. Mantener contratos de datos y funciones existentes.
4. Reutilizar y adaptar componentes actuales cuando convenga.
5. No convertir esto en una landing generica SaaS.
6. El look debe ser carbon/blanco/dorado industrial, premium y sobrio.
7. El resultado debe verse excelente en dark y light mode.

Stack disponible:
- Next.js 15 App Router
- Tailwind CSS
- Framer Motion
- three
- @react-three/fiber
- @react-three/drei
- next-themes
- lucide-react
- @21st-sdk/nextjs

Arquitectura existente a preservar:
- fetchAlitoPublicCatalog
- fetchMyAlitoQuoteRequests
- fetchAlitoClientPortalSummary
- fetchMyAlitoPaymentProofs
- submitAlitoQuoteRequest
- approveAlitoQuoteRequest
- downloadAlitoClientDocument
- uploadAlitoPaymentProofFile

Entrega en este orden:
1. Design tokens y layout shell global.
2. Home premium.
3. Catalogo premium con filtros y quote dock.
4. Detalle de equipo con stage 2.5D o 3D.
5. Dashboard cliente reordenado.
6. Ajustes responsive y accesibilidad.

No inventes backend. No cambies schemas. No rompas el intake. Trabaja modularmente y deja cada slice compilando antes de pasar al siguiente.
```