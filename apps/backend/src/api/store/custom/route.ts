import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type QuoteLineItem = {
  line_id?: string
  product_id?: string
  variant_id?: string
  name?: string
  variant?: string
  quantity?: number
  unit_price?: number
  total?: number
  metadata?: Record<string, unknown>
}

type AlitoQuoteItemInput = {
  display_name?: string
  family_code?: string
  catalog_item_code?: string
  quantity?: number
  unit?: string
  capacity_m3?: number | null
  equipment_class?: string
  material_subtype?: string
  origin_location?: string
  destination_location?: string
  duration_value?: number | null
  duration_unit?: string
  accessories?: string[]
  notes?: string
  metadata?: Record<string, unknown>
}

type QuoteRequestBody = {
  action?: string
  source_channel?: string
  source?: string
  cart_id?: string
  customer?: {
    nombre?: string
    name?: string
    phone?: string
    telefono?: string
    email?: string
    company?: string
    rnc?: string
    documento?: string
    direccion?: string
    pais?: string
  }
  project?: {
    location?: string
    notes?: string
    requested_date?: string
    urgency?: string
    family?: string
    access_notes?: string
  }
  items?: Array<QuoteLineItem | AlitoQuoteItemInput>
  catalog_context?: Record<string, unknown>
  preferred_contact_method?: string
}

const createCorrelationId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()

  return `ALITO-WEB-${date}-${suffix}`
}

const validateQuoteRequest = (body: QuoteRequestBody) => {
  const missing: string[] = []

  if (!body.customer?.name && !body.customer?.nombre) missing.push("customer.name")
  if (!body.project?.location) missing.push("project.location")
  if (!body.items?.length) missing.push("items")

  return missing
}

const cleanText = (value: unknown) => typeof value === "string" ? value.trim() : ""
const cleanOptionalText = (value: unknown) => cleanText(value) || undefined
const cleanNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null
const cleanAccessories = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean)
    : undefined

const intakeUrl = () => {
  if (process.env.ALITO_WEB_INTAKE_URL) return process.env.ALITO_WEB_INTAKE_URL
  if (process.env.SUPABASE_URL) return `${process.env.SUPABASE_URL.replace(/\/$/, "")}/functions/v1/alito-web-intake`
  return null
}

const normalizeCustomer = (customer: QuoteRequestBody["customer"] = {}) => ({
  nombre: cleanText(customer.nombre || customer.name),
  email: cleanText(customer.email).toLowerCase() || undefined,
  telefono: cleanText(customer.telefono || customer.phone) || undefined,
  documento: cleanText(customer.documento || customer.rnc) || undefined,
  direccion: cleanText(customer.direccion) || undefined,
  pais: cleanText(customer.pais) || "DO",
})

const normalizeItems = (items: Array<QuoteLineItem | AlitoQuoteItemInput> = []) => items.map((item) => {
  const metadata = item.metadata || {}
  const directItem = item as AlitoQuoteItemInput
  const legacyItem = item as QuoteLineItem

  return {
    catalog_item_code: cleanText(directItem.catalog_item_code ?? metadata.catalog_item_code),
    family_code: cleanText(directItem.family_code ?? metadata.family_code),
    display_name: cleanText(directItem.display_name)
      || cleanText(legacyItem.name)
      || cleanText(legacyItem.product_id)
      || "Item ALITO",
    quantity: typeof item.quantity === "number" ? item.quantity : 1,
    unit: cleanText(directItem.unit ?? metadata.unit) || "UND",
    capacity_m3: cleanNumber(directItem.capacity_m3 ?? metadata.capacity_m3),
    equipment_class: cleanOptionalText(directItem.equipment_class ?? metadata.equipment_class),
    material_subtype: cleanOptionalText(directItem.material_subtype ?? metadata.material_subtype),
    origin_location: cleanOptionalText(directItem.origin_location ?? metadata.origin_location),
    destination_location: cleanOptionalText(directItem.destination_location ?? metadata.destination_location),
    duration_value: cleanNumber(directItem.duration_value ?? metadata.duration_value),
    duration_unit: cleanOptionalText(directItem.duration_unit ?? metadata.duration_unit),
    accessories: cleanAccessories(directItem.accessories ?? metadata.accessories),
    notes: cleanText(directItem.notes ?? metadata.notes ?? legacyItem.variant) || undefined,
    metadata,
  }
})

const shouldUseFallbackOnFailure = (body: QuoteRequestBody) =>
  !body.action || body.action === "submit-quote"

const publicIntakeActions = new Set(["submit-quote", "resolve-session"])

const getNormalizedAction = (body: QuoteRequestBody) => cleanText(body.action) || "submit-quote"

const extractBearerToken = (authorization?: string) => {
  if (!authorization) return ""
  const [scheme, token] = authorization.trim().split(/\s+/, 2)
  return scheme?.toLowerCase() === "bearer" ? token || "" : ""
}

const requiresAuthenticatedSession = (body: QuoteRequestBody) => !publicIntakeActions.has(getNormalizedAction(body))

const withLegacyCorrelationId = <T>(payload: T): T & { correlation_id?: string } => {
  const quote = (payload as { quote?: { correlation_id?: unknown } })?.quote
  const correlationId = cleanText(quote?.correlation_id)
  const topLevelCorrelationId = cleanText((payload as { correlation_id?: unknown })?.correlation_id)

  if (!correlationId || topLevelCorrelationId) {
    return payload as T & { correlation_id?: string }
  }

  return {
    ...(payload as Record<string, unknown>),
    correlation_id: correlationId,
  } as T & { correlation_id?: string }
}

const normalizeIntakeBody = (body: QuoteRequestBody) => ({
  ...(body.action && body.action !== "submit-quote" ? body : {
    action: "submit-quote",
    customer: normalizeCustomer(body.customer),
    project: {
      location: cleanText(body.project?.location),
      notes: [body.project?.notes, body.project?.access_notes, body.project?.urgency, body.project?.family]
        .map(cleanText)
        .filter(Boolean)
        .join(" | ") || undefined,
    },
    items: normalizeItems(body.items),
    preferred_contact_method: body.preferred_contact_method || "telefono_correo",
    source_payload: body,
  }),
  source_channel: body.source_channel || body.source || "portal-medusa",
})

const parseEdgeResponseBody = async (response: Response) => {
  const raw = await response.text()

  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw) as unknown
  } catch {
    return { raw }
  }
}

async function forwardToAlitoIntake(req: MedusaRequest, body: QuoteRequestBody) {
  const url = intakeUrl()
  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Backend Medusa no tiene ALITO_WEB_INTAKE_URL/SUPABASE_URL y SUPABASE_ANON_KEY configurados.")
  }

  const authHeader = req.headers.authorization
  const bearerToken = extractBearerToken(authHeader)

  if (requiresAuthenticatedSession(body) && (!bearerToken || bearerToken === anonKey)) {
    throw new Error("Esta accion requiere una sesion autenticada del portal ALITO.")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: authHeader || `Bearer ${anonKey}`,
    },
    body: JSON.stringify(normalizeIntakeBody(body)),
  })

  const data = await parseEdgeResponseBody(response)
  if (!response.ok && shouldUseFallbackOnFailure(body)) {
    throw new Error((data as { error?: string; message?: string }).error || (data as { message?: string }).message || "No se pudo registrar la solicitud ALITO.")
  }

  return { status: response.status, data: withLegacyCorrelationId(data) }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.status(200).json({
    service: "alito-web-cotizador",
    status: "ready",
    persistence: intakeUrl() && process.env.SUPABASE_ANON_KEY ? "supabase-edge-function" : "missing-env",
    flow: "catalogo -> borrador -> solicitud -> cotizacion -> proforma -> factura",
  })
}

export async function POST(
  req: MedusaRequest<QuoteRequestBody>,
  res: MedusaResponse
) {
  const body = req.body ?? {}
  const shouldValidateQuote = !body.action || body.action === "submit-quote"
  const missing = shouldValidateQuote ? validateQuoteRequest(body) : []

  if (missing.length) {
    res.status(400).json({
      message: "Solicitud de cotizacion incompleta",
      missing,
    })
    return
  }

  try {
    const forwarded = await forwardToAlitoIntake(req, body)
    res.status(forwarded.status).json(forwarded.data)
  } catch (error) {
    const correlationId = createCorrelationId()
    const receivedAt = new Date().toISOString()

    res.status(503).json({
      ok: false,
      message: error instanceof Error ? error.message : "No se pudo registrar la solicitud ALITO.",
      fallback_correlation_id: correlationId,
      received_at: receivedAt,
      status: "no_persistida",
    })
  }
}
