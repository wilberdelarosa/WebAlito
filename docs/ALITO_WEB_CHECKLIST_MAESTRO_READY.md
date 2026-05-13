# ALITO Web Checklist Maestro Ready

## Estado Actual

- Actualizado al 2026-05-04.
- Slice implementado y validado en esta iteracion:
- Endurecimiento de auth en `apps/backend/src/api/store/custom/route.ts` para no permitir acciones sensibles del intake con `anon` como sesion.
- Descarga de documentos del portal endurecida para priorizar signed URL cuando existe `quote_request_id`.
- Limpieza visible de iconografia y accesibilidad en controles clave del portal y detalle de equipo.
- Componente reusable `scroll-reveal` agregado para modularizar motion en el home.
- Wizard de cotizacion ampliado con validaciones de cliente/proyecto, metadatos de servicio y adjuntos persistidos localmente antes del submit.
- Validacion ejecutada: `pnpm --filter @dtc/storefront build` sigue pasando.

## Portal Medusa

- [x] Aislar layout de `/portal`.
- [x] Validar fallback de region.
- [x] Eliminar dependencia critica de Nav/Footer/cart.
- [x] Crear header ALITO.
- [x] Crear home visual.
- [x] Crear catalogo filtrable.
- [x] Crear detalle de equipo.
- [x] Crear detalle de material/servicio.
- [x] Crear carrito/cotizacion.
- [x] Crear stepper de cotizacion.
- [x] Crear zona de adjuntos.
- [x] Crear estado de carga/error.
- [~] Validar desktop.
- [~] Validar mobile.
- [ ] Validar sin backend Medusa.
- [~] Salida: Portal estable. UI alineada a mockups.

## Cotizacion web

- [x] Validar cliente/proyecto.
- [x] Validar RNC normalizado.
- [x] Validar email.
- [x] Validar WhatsApp.
- [x] Validar direccion/provincia.
- [x] Validar fechas.
- [x] Validar servicio requerido.
- [x] Validar items.
- [x] Validar cantidades.
- [x] Validar transporte/operador.
- [x] Adjuntar documentos de forma persistida antes del submit.
- [x] Enviar `submit-quote`.
- [~] Crear `quote_request`.
- [~] Crear `quote_request_items`.
- [~] Crear `quote_events`.
- [x] Mostrar confirmacion al cliente.

## Preparacion

- [~] Confirmar que `pnpm storefront:dev` y `pnpm backend:dev` responden localmente.
- [x] Confirmar envs de Supabase y Medusa en storefront.
- [x] Confirmar que `/dk`, `/dk/store` y `/dk/portal` compilan.
- [x] Confirmar que el portal sigue leyendo del intake existente.

## Visual System

- [x] Crear tokens de color base para dark y light.
- [x] Montar `ThemeProvider` global.
- [~] Reemplazar iconos improvisados por `lucide-react`.
- [~] Definir sombras, radios, bordes y espaciado de forma consistente.
- [ ] Verificar contraste en ambos temas de punta a punta.

## Home

- [~] Simplificar hero actual.
- [~] Usar un solo foco visual fuerte.
- [ ] Añadir buscador principal.
- [x] Conectar CTAs a catalogo y cotizacion.
- [~] Sustituir bloques recargados por railes mas curados.
- [x] Introducir motion modular reutilizable para secciones del home.

## Catalogo

- [~] Separar equipos y materiales con jerarquia clara.
- [~] Mejorar sidebar de filtros.
- [~] Rediseñar cards para PNG sin fondo.
- [x] Mantener `Agregar a cotizacion` y `Ver detalle`.
- [ ] Preparar preview rapido con modal o sheet.

## Detalle

- [~] Construir stage premium de media.
- [x] Mantener panel lateral de alquiler.
- [x] Agregar tabs consistentes.
- [~] Preparar contenedor para 3D real o fallback 2.5D.
- [~] Verificar mobile con CTA visible.
- [~] Sustituir elementos visibles con emoji por iconografia real.

## Cotizacion

- [x] Mantener wizard por pasos.
- [~] Refinar resumen lateral.
- [~] Mejorar dropzone de documentos.
- [~] Añadir validacion visual previa al submit.
- [x] No tocar contrato de `submitAlitoQuoteRequest`.

## Portal Cliente

- [ ] Reordenar KPIs.
- [ ] Dar prioridad a timeline.
- [~] Mejorar bloque de documentos.
- [ ] Mejorar bloque de pagos.
- [x] Verificar y endurecer descarga por signed URL.

## Seguridad e Intake

- [x] Bloquear acciones sensibles del intake cuando solo existe `anon key`.
- [x] Mantener `service role` fuera del frontend.
- [~] Completar auditoria real de RLS/roles/policies en Supabase vivo.
- [~] Reducir rutas de acceso directo a `document_url` cuando exista flujo firmado.
- [ ] Verificar compensaciones reales del edge function si usa `verify_jwt=false`.

## Supabase Readiness

- [x] Confirmado: el MCP de Supabase responde y lista migraciones reales del ERP.
- [x] Confirmado: existen migraciones maduras de catalogo, cotizaciones, proformas, facturas, auditoria y RLS.
- [x] Confirmado: extensiones operativas instaladas como `pgcrypto`, `pg_stat_statements`, `pg_net`, `http` y `supabase_vault`.
- [x] Decision: no meter Medusa fiscal en `public`; mantener aislamiento `alito_web`.
- [~] Solo tocar DB cuando el slice visual ya este estable.

## Assets

- [~] Reemplazar equipos por PNG sin fondo auditados.
- [~] Reemplazar materiales desde la carpeta de materiales disponible.
- [x] Mantener el logo como referencia de marca, no como ruido dominante.
- [ ] Normalizar naming y formatos antes de importar mas assets.

## Performance

- [x] No usar efectos pesados en todas las cards.
- [~] Limitar blur y glow a zonas hero.
- [ ] Lazy-load de escenas 3D.
- [ ] Verificar LCP en home y detalle.
- [ ] Verificar que los PNG nuevos no saturen el bundle.

## Calidad

- [x] Ejecutar `pnpm --filter @dtc/storefront build` despues de cada slice importante.
- [~] Revisar accesibilidad basica de botones, inputs y toggles.
- [ ] Probar dark/light de punta a punta.
- [ ] Probar desktop y mobile de punta a punta.
- [x] No mezclar logica nueva con refactors amplios sin validacion.
- [~] Quedan advertencias de analisis en `index.tsx` por estilos inline y formularios sin nombre accesible en algunos modales.

## Bloqueadores Reales Detectados

- Los MP4 de referencia no pudieron auditarse visualmente en esta maquina por ausencia de `ffmpeg` y bloqueo del navegador integrado a `file://` local.
- La ruta de materiales entregada como `catalogo_materiales_png_sin_fondo` no existia; la carpeta encontrada fue `catalogo_materiales_png`.
- El portal tenia un bloque JSX roto en `HeroSection`; ya fue corregido para volver a compilar el archivo.
- El portal sigue siendo un archivo monolitico grande; eso vuelve mas costosa la limpieza de a11y y la modularizacion visual.
- El chequeo de RLS/roles reales sigue incompleto mientras no se audite el proyecto Supabase vivo o el edge function fuente.

## Salida Esperada

- Tema premium base listo y endurecido en capas visibles.
- Home, catalogo, detalle y dashboard visualmente coherentes por slices, no en un solo refactor.
- Contratos con backend intactos.
- Base preparada para seguir implementando slice por slice sin rehacer la arquitectura.