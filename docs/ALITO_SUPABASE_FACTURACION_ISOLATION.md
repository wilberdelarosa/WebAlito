# Decision de Supabase para ALITO Cotizador

## Resumen Ejecutivo

El Supabase disponible es el sistema vivo de facturacion. Tiene tablas reales de ERP, incluyendo `clientes`, `productos_servicios`, `equipos`, `cotizaciones`, `cotizacion_items`, `proformas`, `facturas`, `usuarios`, `perfiles`, permisos, auditoria y agente.

Por eso la decision correcta no es instalar Medusa completo dentro del schema `public` de ese Supabase.

La decision recomendada es:

1. Usar el mismo proyecto Supabase para identidad y puente con facturacion.
2. Crear un schema aislado para el cotizador web: `alito_web`.
3. Mantener las tablas criticas del ERP en `public` como fuente contable/fiscal.
4. Hacer que el storefront lea catalogo desde `alito_web` y envie solicitudes a `alito_web.quote_requests`.
5. Convertir una solicitud web a `public.cotizaciones` solo mediante una funcion/servicio de backend con approval, auditoria y `correlation_id`.

## Por que no mezclar todo en `public`

`public` ya contiene la operacion fiscal:

- `clientes`
- `productos_servicios`
- `equipos`
- `cotizaciones`
- `cotizacion_items`
- `proformas`
- `facturas`
- `usuarios`
- `perfiles`
- `aprobaciones`
- `audit_log`

Estas tablas tienen RLS activo. Eso confirma que el ERP ya tiene reglas de seguridad y no conviene alterar su modelo con tablas genericas de ecommerce ni migraciones automaticas de Medusa.

## Hostinger vs Supabase

Hostinger debe alojar la app y los procesos Node.

Supabase debe manejar la identidad, catalogo operativo, solicitudes y puente hacia facturacion.

Hostinger no debe ser la base de datos principal del cotizador si ya se necesita Supabase Auth, RLS, auditabilidad y relacion con facturacion.

Uso recomendado:

| Capa | Recomendacion |
| --- | --- |
| Storefront Next | Hostinger/VPS o plataforma Node compatible |
| Backend Medusa/API | Hostinger VPS o Node runtime controlado |
| Auth | Supabase Auth del ERP |
| Catalogo web | Schema `alito_web` en Supabase |
| Solicitudes web | Schema `alito_web` en Supabase |
| Cotizaciones fiscales | `public.cotizaciones` del ERP |
| Proformas/facturas | ERP existente |

## Schema Aislado Propuesto

Schema:

- `alito_web`

Tablas:

- `alito_web.catalog_families`
- `alito_web.catalog_items`
- `alito_web.catalog_item_options`
- `alito_web.equipment_catalog`
- `alito_web.truck_capacity_matrix`
- `alito_web.image_slots`
- `alito_web.quote_requests`
- `alito_web.quote_request_items`
- `alito_web.quote_events`
- `alito_web.web_profiles`

## Relacion con Facturacion

El cotizador web no debe insertar directamente en `public.cotizaciones` desde el navegador.

Flujo correcto:

1. Cliente o vendedor inicia sesion con Supabase Auth.
2. Storefront carga catalogo desde `alito_web`.
3. Cliente arma borrador y envia solicitud.
4. Se crea `alito_web.quote_requests` con `status = 'recibida'` y `correlation_id`.
5. Dashboard/operador revisa.
6. Backend autorizado convierte solicitud a `public.cotizaciones` y `public.cotizacion_items`.
7. ERP sigue su flujo normal: cotizacion -> proforma -> factura.

## Login Unico

El mismo login debe servir para cliente y admin.

La ruta debe decidir por perfil:

- Si el usuario tiene rol interno en `public.usuarios` / `public.perfiles`, entra a vista admin/operador.
- Si el usuario no es interno, entra al portal cliente.

Reglas:

- No usar `user_metadata` para autorizacion.
- Usar `auth.users.id` como identidad.
- Mapear permisos internos en tablas del ERP o en `alito_web.web_profiles`.
- El backend debe validar roles con consultas server-side, no solo con UI.

## RLS Recomendado

Lectura publica segura:

- `catalog_families`, `catalog_items`, `catalog_item_options`, `truck_capacity_matrix`, `image_slots`: lectura publica si `is_active = true`.

Escritura de solicitudes:

- Usuarios anonimos pueden crear solicitudes limitadas si se decide permitir cotizacion sin cuenta.
- Usuarios autenticados pueden crear solicitudes y ver las suyas.
- Operadores/admin pueden ver todas las solicitudes.

Conversion a ERP:

- Solo service role en backend o funcion segura puede convertir a `public.cotizaciones`.
- Nunca exponer service role en Next publico.

## Que Hacer con Medusa

Medusa puede seguir como framework/base visual y admin auxiliar, pero no debe gobernar la verdad fiscal.

Para `/dk/store`, la adaptacion correcta es dejar de depender del catalogo demo de Medusa y leer desde `alito_web.catalog_items`.

Medusa cart puede seguir como UX temporal de borrador, pero la solicitud final debe persistir en Supabase.

## Decision Final

La mejor arquitectura es compartir el mismo Supabase del ERP, pero aislando el cotizador en `alito_web`.

No recomiendo una DB separada en Hostinger para el cotizador porque duplicaria autenticacion, catalogo, clientes y trazabilidad.

No recomiendo meter las tablas del cotizador en `public` sin aislamiento porque `public` ya es el dominio fiscal y operativo del ERP.

## Siguiente Slice Seguro

Antes de aplicar DDL al Supabase vivo:

1. Generar SQL dry-run del schema `alito_web`.
2. Revisar politicas RLS.
3. Aplicar migracion.
4. Sembrar catalogo inicial desde `INVENTARIO_MAESTRO_EQUIPOS_2026.md` y `SUPER_CATALOGO_GUIADO_LOGICA_ALITO_2026.md`.
5. Cablear `/dk/store` para leer de Supabase.
6. Cablear login unico con Supabase Auth.
