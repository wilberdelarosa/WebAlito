# ALITO Cotizador Medusa

Esta base ya no se esta tratando como una ecommerce de pago inmediato. El proyecto queda orientado como cotizador web para ALITO Group:

1. El cliente navega materiales, camiones, equipos y servicios.
2. Agrega items a un borrador de cotizacion usando el carrito Medusa como base tecnica.
3. Completa contexto operativo: ubicacion, fecha, familia, acceso, restricciones y datos de contacto.
4. El backend recibe la solicitud por `POST /store/custom` y devuelve un `correlation_id`.
5. Ese `correlation_id` es el puente para dashboard, Telegram bot, Supabase y Secure Access Hub 68.

## Documentos ALITO Fuente

Los documentos de negocio que gobiernan el catalogo y la logica son:

- `C:\Users\wilbe\clawd\projects\alito_cotizador\docs\INVENTARIO_MAESTRO_EQUIPOS_2026.md`
- `C:\Users\wilbe\clawd\projects\alito_cotizador\docs\SUPER_CATALOGO_GUIADO_LOGICA_ALITO_2026.md`
- `C:\Users\wilbe\clawd\projects\alito_cotizador\README.md`

## Flujo Implementado en Esta Base

| Capa | Estado |
| --- | --- |
| Home | Reorientado a ALITO, catalogo operativo y espacios para imagenes reales. |
| Catalogo | Las colecciones/productos se presentan como familias/items cotizables. |
| Producto | `Add to cart` pasa a `Agregar a cotizacion`, con advertencia de revision operativa. |
| Cart | El carrito funciona como `Borrador de cotizacion`. |
| Checkout | El checkout se reemplaza por `Solicitud de cotizacion`; no pide pago ni envio. |
| Backend | `POST /store/custom` valida payload y genera `ALITO-WEB-YYYYMMDD-XXXXXX`. |

## Logica de Producto ALITO

La logica base vive en:

- `apps/storefront/src/lib/alito/catalog.ts`

Incluye:

- familias operativas: suministros, camiones, equipos y servicios
- matriz de camiones de 10 m3, 14 m3 y 22 m3
- estados de solicitud hasta factura
- campos minimos requeridos para cotizar
- slots reservados para imagenes

Regla principal: cuando una partida involucra camion, material, bote o traslado, la capacidad entra en la logica. No se debe cotizar como producto simple si falta zona, capacidad, volumen o contexto de acceso.

## Espacios Reservados para Imagenes

Los slots definidos para reemplazar placeholders cuando esten listas las imagenes correctas son:

| Slot | Uso |
| --- | --- |
| `hero-flota-principal` | Imagen amplia de flota, equipos o patio ALITO en el inicio. |
| `catalogo-suministros-principal` | Materiales: arena, grava, caliche, relleno. |
| `catalogo-camiones-flota` | Camiones Sinotruk/JAC por capacidad. |
| `catalogo-equipos-pesados` | Excavadoras, retropalas, rodillos, minicargadores o tractor. |

## Integracion Pendiente

`POST /store/custom` ya deja el payload listo para conectar con:

- Supabase: `quote_requests`, `quote_request_items`, `quote_events` con RLS.
- Telegram bot: alerta de nueva solicitud y seguimiento por `correlation_id`.
- Secure Access Hub 68: solicitud -> cotizacion -> proforma -> factura.
- Hostinger: storefront publico en `catalogo.alitogroup.com` o `cotizador.alitogroup.com` y ERP en `sysfacturacion.alitogroup.com`.

## Comandos Locales ALITO

```bash
pnpm install
pnpm backend:dev
pnpm storefront:dev
```

Rutas locales esperadas:

- Storefront: `http://localhost:8000/dk`
- Backend: `http://localhost:9000/health`
- Endpoint cotizador: `http://localhost:9000/store/custom`

---

## Medusa DTC Starter Original

A production-ready monorepo starter for direct-to-consumer ecommerce stores powered by Medusa and Next.js. Includes a fully featured storefront with product browsing, cart, checkout, customer accounts, and order management.

## Features

- All of [Medusa's commerce features](https://docs.medusajs.com/resources/commerce-modules)
- Multi-region support with automatic country detection
- Product catalog with variant selection
- Cart with promotion codes
- Multi-step checkout with shipping and payment
- Customer accounts with order history and address management
- Order transfer between accounts

## Getting Started

### Deploy with Medusa Cloud

The fastest way to get started is deploying with [Medusa Cloud](https://cloud.medusajs.com):

1. [Create a Medusa Cloud account](https://cloud.medusajs.com)
2. Deploy this starter directly from your dashboard

### Local Installation

> **Prerequisites:
>
> - [Node.js](https://nodejs.org/) v20+
> - [PostgreSQL](https://www.postgresql.org/) v15+
> - [pnpm](https://pnpm.io/) v10+

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/medusajs/dtc-starter.git
cd dtc-starter
pnpm install
```

1. Set up environment variables for the backend:

```bash
cp apps/backend/.env.template apps/backend/.env
```

1. Set the database URL in `apps/backend.env`:

```bash
# Replace with actual database URL, make sure the database exists.
DATABASE_URL=postgres://postgres:@localhost:5432/medusa-dtc-starter
```

1. Run migrations:

```bash
cd apps/backend
pnpm medusa db:migrate
```

1. Add admin user:

```bash
cd apps/backend
pnpm medusa user -e admin@test.com -p supersecret
```

1. Start Medusa backend:

```bash
cd apps/backend
pnpm dev
```

1. Open the admin dashboard at `localhost:9000/app` and log in. Retrieve your publishable API key at Settings > Publishable API key.

1. Set up environment variables for the storefront:

```bash
cp apps/storefront/.env.template apps/storefront/.env.local
```

1. Update `apps/storefront/.env.local` with your Medusa publishable API key:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_6c3...
```

1. Start storefront:

```bash
cd apps/storefront
pnpm dev
```

The storefront runs on `http://localhost:8000`.

You can also run the following command from the root to start both backend and storefront:

```bash
pnpm dev
```

## Configuration

The storefront is configured via environment variables in `apps/storefront/.env.local`:

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable API key from your Medusa backend | - |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL of your Medusa backend | `http://localhost:9000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region country code | `dk` |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the storefront | `https://localhost:8000` |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key (optional) | - |

## Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa Cloud](https://cloud.medusajs.com)
