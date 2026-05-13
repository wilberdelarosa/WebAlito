# ALITO Group Cotizador sobre Medusa Base

## Proposito

Este documento define como adaptar la base `medusa-base` para que deje de comportarse como una ecommerce tradicional y pase a funcionar como una plataforma comercial de cotizaciones para ALITO Group.

La idea no es vender productos con pago inmediato. La idea es mostrar catalogo, capturar contexto operativo, generar una solicitud de cotizacion y preparar el puente hacia el dashboard/facturacion donde esa solicitud se convierte en cotizacion, proforma y eventualmente factura.

## Estado Actual de la Base

Ruta local:

- `C:\Users\wilbe\Downloads\combustible app\medusa-base`

Stack detectado:

- Monorepo con `pnpm` y `turbo`.
- Backend Medusa en `apps/backend`.
- Storefront Next.js en `apps/storefront`.
- Medusa `2.14.2`.
- Next.js `15.3.9`.
- React `19.0.5` en storefront.
- Backend con `DATABASE_URL`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `JWT_SECRET`, `COOKIE_SECRET`.
- GitNexus ya indexado como `medusa-base`: 1469 simbolos, 2171 relaciones y 17 flujos.

Servicios locales documentados:

- Storefront: `http://localhost:8000/dk`
- Admin: `http://localhost:9000/app/login`
- Backend health: `http://localhost:9000/health`

Comandos base:

```powershell
docker compose -f docker-compose.dev.yml up -d
pnpm backend:dev
pnpm storefront:dev
```

## Lectura Medusa Relevante

La documentacion oficial de Medusa confirma que la plataforma no debe verse solo como tienda. Medusa permite:

- crear rutas API personalizadas
- crear workflows
- agregar modelos de datos
- crear modulos custom
- extender Admin
- integrar sistemas externos
- usar modulos de producto, pricing, inventario, ordenes, usuarios y auth

Esto encaja con ALITO porque el negocio necesita catalogo + logica operacional + integracion ERP, no solo carrito y pago.

## Objetivo de Producto

Convertir la ecommerce base en una experiencia de cotizacion guiada para ALITO Group:

1. El usuario navega el catalogo por familias operativas.
2. Selecciona servicio, equipo o suministro.
3. La web pide datos criticos para cotizar bien: zona, volumen, capacidad, tipo de material, duracion, origen/destino, urgencia, restricciones de acceso y contacto.
4. El sistema genera una solicitud de cotizacion, no un pedido final.
5. Esa solicitud entra al flujo interno: dashboard, Telegram bot, aprobaciones, cotizacion, proforma y factura.

## Cambio Semantico Principal

| Ecommerce Medusa | Cotizador ALITO |
| --- | --- |
| producto | servicio/equipo/suministro |
| variante | clase operativa: capacidad, tonelaje, subtipo, modalidad |
| precio fijo | precio sugerido, rango o requiere revision |
| carrito | borrador de cotizacion |
| checkout | formulario de solicitud |
| orden | solicitud/cotizacion/proforma |
| pago | no aplica en fase 1 |
| fulfillment/envio | despacho, traslado, bote, movilizacion o servicio en obra |
| cuenta de cliente | portal de cliente con historial y seguimiento |

## Catalogo ALITO que Debe Mostrar la Web

### 1. Suministros

Familias iniciales:

- Arena
- Caliche
- Grava
- Relleno
- Capa vegetal
- Subbase
- Tierra negra

Campos requeridos:

- material
- subtipo
- cantidad aproximada
- unidad: m3, viaje o jornada segun familia
- ubicacion de obra
- acceso de camiones
- preferencia de camion cuando aplique

### 2. Camiones y Transporte de Material

Familias reales:

- camion de 10 m3
- camion de 14 m3
- camion de 22 m3
- bote de material
- suministro con camion
- transporte de material

Modelos Sinotruk normalizados:

| Modelo normalizado | Capacidad comercial | Fichas/placas relacionadas |
| --- | --- | --- |
| SINOTRUCK ZZ3167N3817B1 | 14 m3 | AC-026/S022991, AC-027/S022990 |
| SINOTRUCK ZZ3257V384JB1 | 22 m3 | AC-039/S024568, AC-040/S024569, F-AG-002/S025386, F-AG-007 |

Otros camiones relevantes:

| Ficha | Marca | Modelo | Capacidad | Placa |
| --- | --- | --- | --- | --- |
| AC-014 | SINOTRUCK | HOWO T1 | 22 m3 | S022015 |
| AC-017 | JAC | HFC3086K | 14 m3 | S022264 |
| AC-020 | JAC | VOLTEO | 14 m3 | S022405 |
| F-AG-005 | SINOTRUK | 9M3 | 10 m3 | S026247 |
| F-AG-006 | SINOTRUK | 9 M3 | 10 m3 | S026246 |

### 3. Equipos en Alquiler o Servicio

Categorias principales:

- Excavadoras: 13 Ton, 14 Ton, 15 Ton, 20 Ton, 26 Ton, 33 Ton.
- Miniretro/miniexcavadora: 5 Ton, 5.5 Ton, 6 Ton.
- Retropalas: 7.5 Ton.
- Minicargadores: Caterpillar 216B, 216B3LRC, 232D, 236D, 236DLRC, 236D3LRC.
- Rodillos/compactadores: 2.7TL, 7TL, 11TL, CB2.7LRC.
- Telehandler: JLG 943.
- Montacargas: MCF Caterpillar.
- Tractor de orugas: Caterpillar D6 2025.
- Grua blanca JAC HFC1120KN.

La ficha tecnica completa vive en:

- `C:\Users\wilbe\clawd\projects\alito_cotizador\docs\INVENTARIO_MAESTRO_EQUIPOS_2026.md`

## Reutilizacion de Componentes Existentes

### Home

Archivo base:

- `apps/storefront/src/modules/home/components/hero/index.tsx`

Transformacion:

- De hero generico `Ecommerce Starter Template` a tablero de entrada ALITO.
- Primer viewport debe comunicar: suministro, bote, alquiler de equipos y transporte.
- CTA principal: `Solicitar cotizacion`.
- CTA secundario: `Ver catalogo operativo`.

### Product Rails / Colecciones

Archivos base:

- `apps/storefront/src/modules/home/components/featured-products/index.tsx`
- `apps/storefront/src/modules/products/components/product-preview/index.tsx`

Transformacion:

- Colecciones pasan a ser familias operativas.
- Ejemplos: `Suministros`, `Camiones`, `Excavadoras`, `Minicargadores`, `Compactacion`, `Servicios mixtos`.

### Product Actions

Archivo base:

- `apps/storefront/src/modules/products/components/product-actions/index.tsx`

Transformacion:

- `Add to cart` debe convertirse en `Agregar a cotizacion`.
- Las variantes deben mapear a capacidad, tonelaje, modalidad, subtipo o unidad.
- Si una familia no es precio fijo, mostrar `Requiere revision` o `Precio sujeto a ubicacion`.

### Cart

Archivo base:

- `apps/storefront/src/modules/cart/templates/index.tsx`

Transformacion:

- `Cart` se convierte en `Borrador de cotizacion`.
- Debe permitir items mixtos: material + camion + equipo + transporte.
- Debe mostrar campos faltantes antes de enviar.

### Checkout

Archivo base:

- `apps/storefront/src/modules/checkout/templates/checkout-form/index.tsx`

Transformacion:

- `Checkout` se convierte en `Solicitud de cotizacion`.
- No pedir tarjeta ni pago en fase 1.
- Pedir: cliente, telefono, correo, empresa/RNC si aplica, ubicacion, fecha estimada, notas, urgencia, permiso para contactar por WhatsApp/telefono.

### Order / Account

Archivos base:

- `apps/storefront/src/modules/order/*`
- `apps/storefront/src/modules/account/*`

Transformacion:

- `Order history` se convierte en historial de solicitudes/cotizaciones.
- Estados esperados: `recibida`, `en_revision`, `cotizada`, `proforma_generada`, `factura_solicitada`, `facturada`, `cerrada`.

## Diseño Recomendado

No hacer una landing decorativa. La primera pantalla debe ser una herramienta comercial.

Direccion visual:

- Estilo profesional, claro, operativo y denso.
- Paleta sobria con blancos, grises, negro suave, verde/amarillo controlado para ALITO y acentos industriales.
- Nada de hero gigante vacio ni cards decorativas excesivas.
- Priorizar tablas, filtros, chips de capacidad, badges de estado y formularios compactos.
- Cards solo para items repetidos del catalogo.

Vistas iniciales:

1. Inicio operativo con buscador y accesos por familia.
2. Catalogo con filtros por familia, capacidad, ubicacion y modalidad.
3. Detalle de item con configurador.
4. Borrador de cotizacion.
5. Enviar solicitud.
6. Seguimiento de solicitud.

## Modelo de Datos Propuesto

### Catalog Item

Campos:

- `id`
- `slug`
- `family`: suministro, camion, equipo, servicio, transporte
- `subfamily`
- `name`
- `description`
- `unit`: m3, viaje, dia, hora, jornada, traslado
- `requires_review`
- `base_price_mode`: fixed, modal, range, manual
- `price_hint_min`
- `price_hint_modal`
- `price_hint_max`
- `required_fields`
- `allowed_equipment_classes`
- `allowed_truck_capacities`
- `zone_rules`

### Equipment Item

Campos:

- `ficha`
- `name`
- `brand`
- `model`
- `normalized_model`
- `capacity`
- `plate`
- `serial`
- `family`
- `is_rentable`
- `is_service_asset`
- `status`

### Quote Request

Campos:

- `id`
- `correlation_id`
- `source`: web, telegram_bot, dashboard
- `customer_name`
- `customer_phone`
- `customer_email`
- `company_name`
- `rnc`
- `location_text`
- `normalized_zone`
- `requested_date`
- `urgency`
- `items[]`
- `status`
- `notes`
- `created_at`

### Quote Request Item

Campos:

- `item_id`
- `family`
- `name`
- `quantity`
- `unit`
- `material_subtype`
- `equipment_class`
- `truck_capacity_m3`
- `origin`
- `destination`
- `duration`
- `requires_manual_review`
- `price_hint`
- `internal_notes`

## Supabase y Seguridad

Supabase debe usarse como capa de captura/consulta externa o como puente hacia el dashboard, no como lugar para exponer secretos del ERP.

Recomendacion inicial:

- Tablas publicas con RLS: `quote_requests`, `quote_request_items`, `quote_events`.
- Inserts anonimos controlados solo para `quote_requests` y `quote_request_items` mediante policies estrictas o Edge Function.
- Lectura privada para dashboard/ERP.
- Service role solo en servidor o Edge Function, nunca en Next publico.
- Cada solicitud debe generar `correlation_id` para rastreo bot -> web -> dashboard -> facturacion.

Flujo sugerido:

1. Storefront captura solicitud.
2. API propia valida payload.
3. Inserta en Supabase o llama al backend Medusa custom route.
4. Evento entra a dashboard/facturacion.
5. Telegram bot puede notificar y continuar seguimiento.

## Integracion con Dashboard y Facturacion Secure Access Hub 68

Destino ERP conocido:

- `https://sysfacturacion.alitogroup.com/login`

Contrato operativo:

- Toda solicitud web debe llegar con `correlation_id`.
- El dashboard debe poder mostrar origen `web_cotizador`.
- La solicitud debe poder convertirse a cotizacion interna.
- La cotizacion debe poder convertirse a proforma.
- El usuario debe poder solicitar conversion a factura desde el flujo interno.

Estados propuestos:

| Estado web | Estado interno esperado |
| --- | --- |
| `recibida` | solicitud creada |
| `en_revision` | esperando validacion humana/precio |
| `cotizada` | cotizacion generada |
| `proforma_generada` | proforma creada desde cotizacion |
| `factura_solicitada` | cliente o operador pidio facturar |
| `facturada` | factura emitida en ERP |
| `cerrada` | flujo terminado |

## Hostinger

Conexion confirmada desde `C:\Users\wilbe\clawd`:

```powershell
mcporter --config config/mcporter.json call hostinger-mcp.hosting_listWebsitesV1 per_page:10 --output json
mcporter --config config/mcporter.json call hostinger-mcp.hosting_listJsDeployments domain:alitogroup.com --output json
```

Sitios activos detectados:

| Dominio | Tipo | Root |
| --- | --- | --- |
| alitogroup.com | main | `/home/u805448229/domains/alitogroup.com/public_html` |
| sysfacturacion.alitogroup.com | addon | `/home/u805448229/domains/sysfacturacion.alitogroup.com/public_html` |
| azure-eagle-282362.hostingersite.com | addon | `/home/u805448229/domains/azure-eagle-282362.hostingersite.com/public_html` |

`alitogroup.com` no tiene deployments JS registrados todavia.

Decision recomendada:

- Usar `cotizador.alitogroup.com` o `catalogo.alitogroup.com` para el storefront publico.
- Mantener `sysfacturacion.alitogroup.com` para ERP/dashboard.
- Backend Medusa y servicios de cotizacion deben correr como Node app en Hostinger si el plan lo permite, o en VPS Hostinger si necesita Redis/Postgres/control de procesos.
- Supabase puede ser Postgres gestionado y puente de eventos si no se quiere alojar la base en la VPS.

## Plan de Implementacion por Fases

### Fase 0: Documento y Contrato

Entregable actual:

- Este documento.
- No se cambia aun la logica de compra.
- Se define vocabulario, arquitectura e integraciones.

### Fase 1: Rebranding Operativo

Cambios:

- Hero ALITO.
- Nav: Catalogo, Cotizar, Equipos, Seguimiento, Contacto.
- Texto: `carrito` -> `cotizacion`.
- CTA: `Agregar a cotizacion`.
- Ocultar pago y checkout tradicional.

Validacion:

- `pnpm storefront:dev`
- revisar `http://localhost:8000/dk`

### Fase 2: Catalogo ALITO Semilla

Cambios:

- Cargar familias desde documentos ALITO.
- Mapear materiales, equipos y camiones.
- Usar variantes para capacidades/subtipos.

Fuentes:

- `SUPER_CATALOGO_GUIADO_LOGICA_ALITO_2026.md`
- `INVENTARIO_MAESTRO_EQUIPOS_2026.md`

### Fase 3: Solicitud de Cotizacion

Cambios:

- Reemplazar checkout por formulario de solicitud.
- Guardar `quote_request`.
- Generar `correlation_id`.
- Notificar a dashboard/bot.

### Fase 4: Dashboard / ERP Bridge

Cambios:

- API o Edge Function para insertar solicitud.
- Vista interna en dashboard.
- Conversion solicitud -> cotizacion -> proforma.
- Estado visible para cliente.

### Fase 5: Deploy Hostinger

Cambios:

- Definir dominio/subdominio.
- Configurar envs de produccion.
- Build.
- Deploy por Hostinger MCP o VPS.
- Health checks.

Checklist minimo:

- `pnpm build`
- backend health responde
- storefront responde
- formulario genera solicitud
- dashboard recibe solicitud
- correo/Telegram de alerta opcional

## Riesgos y Decisiones Pendientes

1. Medusa trae carrito/checkout/order; hay que decidir si se reutilizan como abstraccion de cotizacion o si se crea modulo custom `quote`.
2. Si se usa Supabase para solicitudes anonimas, hay que diseñar RLS antes de publicar.
3. Si Hostinger shared no soporta bien backend Medusa + Redis, usar VPS.
4. No exponer precios finales para familias con alta variabilidad.
5. Hay que decidir si el cliente vera seguimiento publico o solo recibira notificacion por WhatsApp/correo.

## Recomendacion Tecnica Inicial

Para avanzar rapido sin romper la base:

1. Mantener Medusa backend como catalogo/admin.
2. Cambiar primero solo storefront y lenguaje comercial.
3. Crear modulo custom `quote-request` en backend Medusa cuando el formulario este claro.
4. Usar Supabase como puente/auditoria o como destino final segun lo que convenga al dashboard.
5. No implementar pago ni orden final en esta primera fase.

## Proximo Slice Cerrado

Nombre del slice:

- `alito-cotizador-rebrand-fase-1`

Alcance:

- Hero ALITO.
- Nav operativo.
- Catalogo por familias.
- `Add to cart` -> `Agregar a cotizacion`.
- Cart -> `Borrador de cotizacion`.
- Checkout visible reemplazado por copy/estructura de solicitud, sin integracion aun.

Criterio de salida:

- Storefront compila.
- La pagina inicial comunica ALITO Group y cotizaciones.
- No se rompe backend Medusa.
- Queda listo el siguiente slice para persistir solicitudes.
