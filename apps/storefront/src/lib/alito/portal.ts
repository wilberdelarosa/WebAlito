import { alitoCatalogFamilies } from "@lib/alito/catalog"

export type AlitoSessionKind = "guest" | "internal" | "client" | "client_unregistered"

export type AlitoCatalogItem = {
  family_code: string
  family_name: string
  family_description: string | null
  family_order: number
  family_requires_guided_form?: boolean
  family_allows_price_hint?: boolean
  family_manual_review_frequency?: string
  item_code: string
  subfamily: string | null
  display_name: string
  item_type: "producto" | "servicio" | "compuesto"
  base_unit: string
  commercial_modality: string
  supports_price_hint: boolean
  inference_confidence: string
  capacities_supported: number[] | null
  equipment_classes_supported: string[] | null
  required_fields: string[] | null
  escalation_rule: string | null
  public_notes: string | null
  metadata: Record<string, unknown> | null
}

export type AlitoEquipment = {
  ficha: string
  family: string
  display_name: string
  empresa_origen: string | null
  marca: string | null
  modelo: string | null
  placa: string | null
  estado: string | null
  source_capacity: string | null
  commercial_capacity_m3: number | null
  class_tonnage: number | null
  normalized_model: string | null
  metadata: Record<string, unknown> | null
}

export type AlitoCustomerPayload = {
  nombre: string
  email?: string
  telefono?: string
  documento?: string
  direccion?: string
  pais?: string
}

export type AlitoQuoteItemInput = {
  catalog_item_code?: string
  family_code?: string
  display_name: string
  quantity?: number | null
  unit?: string | null
  capacity_m3?: number | null
  equipment_class?: string | null
  material_subtype?: string | null
  origin_location?: string | null
  destination_location?: string | null
  duration_value?: number | null
  duration_unit?: string | null
  accessories?: string[]
  notes?: string | null
  metadata?: Record<string, unknown>
}

export type AlitoQuoteAttachmentInput = {
  file_name: string
  content_type: string | null
  size_bytes: number
  last_modified: number
  persisted_at: string
  persistence: "indexeddb" | "memory"
}

export type AlitoQuoteRequestItem = {
  id: string
  quote_request_id: string
  line_number: number
  catalog_item_code: string | null
  family_code: string | null
  display_name: string
  quantity: number | null
  unit: string | null
  capacity_m3: number | null
  equipment_class: string | null
  material_subtype: string | null
  origin_location: string | null
  destination_location: string | null
  duration_value: number | null
  duration_unit: string | null
  notes: string | null
}

export type AlitoQuoteEvent = {
  id: string
  quote_request_id: string
  event_type: string
  actor_kind: string | null
  message: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export type AlitoQuoteRequest = {
  id: string
  correlation_id: string
  status: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  customer_document: string | null
  project_location: string
  project_notes: string | null
  source_channel: string
  erp_cotizacion_id: string | null
  admin_quoted_total: number | null
  admin_currency: string | null
  admin_response_notes: string | null
  admin_responded_at: string | null
  client_approval_status: "pendiente" | "aprobado" | "rechazado"
  client_signature_data_url: string | null
  client_approval_name: string | null
  purchase_order_number: string | null
  purchase_order_file_name: string | null
  purchase_order_storage_path: string | null
  client_decision_at: string | null
  created_at: string
  updated_at: string
  quote_request_items?: AlitoQuoteRequestItem[]
  quote_events?: AlitoQuoteEvent[]
}

export type AlitoClientPortalDocument = {
  id: string
  type: "cotizacion" | "proforma" | "factura" | "pago"
  number: string
  currency?: string | null
  cotizacion_id?: string | null
  quote_request_id?: string | null
  balance_pending?: number | null
  date: string | null
  total: number | null
  status: string | null
  payment_status: string | null
  document_url: string | null
  reference: string | null
  payment_method: string | null
}

export type AlitoClientPortalSummary = {
  cliente_id: string | null
  counts: {
    cotizaciones: number
    proformas: number
    facturas: number
    pagos: number
  }
  total_facturado: number
  total_pagado: number
  balance_pending: number
  documents: AlitoClientPortalDocument[]
}

export type AlitoPaymentProof = {
  id: string
  quote_request_id: string
  related_document_type: "cotizacion" | "proforma" | "factura" | null
  related_document_id: string | null
  related_document_number: string | null
  monto_reportado: number
  currency: string
  fecha_pago_reportada: string | null
  metodo_reportado: string
  banco_reportado: string | null
  referencia_reportada: string
  notas: string | null
  file_name: string
  storage_path: string
  status: "pendiente_revision" | "en_revision" | "aplicado" | "rechazado"
  review_notes: string | null
  created_at: string
}

export type AlitoWebProfile = {
  id: string
  auth_user_id: string | null
  cliente_id: string | null
  estado: string
  email: string | null
  nombre: string
  telefono: string | null
  documento: string | null
  direccion: string | null
}

export type AlitoResolvedSession = {
  kind: AlitoSessionKind
  user: { id: string; email?: string } | null
  profile?: AlitoWebProfile | null
  route?: string
}

export type AlitoAuthSession = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user: { id: string; email?: string }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const authStorageKey = "alito-medusa-portal-session"

export const alitoPortalIsConfigured = Boolean(supabaseUrl && supabaseAnonKey)

function fallbackCatalog(): AlitoCatalogItem[] {
  return alitoCatalogFamilies.flatMap((family, familyIndex) =>
    family.items.map((item, itemIndex) => ({
      family_code: family.id,
      family_name: family.title,
      family_description: family.summary,
      family_order: familyIndex + 1,
      family_requires_guided_form: family.familyRequiresGuidedForm,
      family_allows_price_hint: family.familyAllowsPriceHint,
      family_manual_review_frequency: family.familyManualReviewFrequency,
      item_code: `${family.id}_${itemIndex + 1}`,
      subfamily: family.eyebrow,
      display_name: item,
      item_type: "servicio" as const,
      base_unit: "SOLICITUD",
      commercial_modality: "revision_operativa",
      supports_price_hint: false,
      inference_confidence: "local",
      capacities_supported: null,
      equipment_classes_supported: null,
      required_fields: family.requiredContext,
      escalation_rule: "Requiere revision de operaciones.",
      public_notes: family.summary,
      metadata: { fallback: true },
    }))
  )
}

function requireSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para usar el portal cliente.")
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(formatSupabaseError(data, "Solicitud no completada"))
  }
  return data as T
}

function formatSupabaseError(data: unknown, fallback: string) {
  const payload = data as { error?: string; error_description?: string; msg?: string; message?: string; code?: string }
  const raw = payload.error_description || payload.message || payload.msg || payload.error || fallback
  const normalized = raw.toLowerCase()

  if (normalized.includes("invalid login credentials")) {
    return "Correo o contrasena incorrectos. Si acabas de registrarte, confirma el correo antes de iniciar sesion."
  }

  if (normalized.includes("email not confirmed")) {
    return "La cuenta existe, pero el correo todavia no esta confirmado."
  }

  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "Este correo ya esta registrado. Entra con tu contrasena o recupera el acceso desde Supabase."
  }

  if (normalized.includes("password")) {
    return "La contrasena debe cumplir las reglas de seguridad del portal."
  }

  return raw
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function supabaseRest<T>(path: string, options: RequestInit = {}, schema?: string): Promise<T> {
  requireSupabaseConfig()
  const headers = new Headers(options.headers)
  headers.set("apikey", supabaseAnonKey)
  headers.set("Authorization", headers.get("Authorization") || `Bearer ${supabaseAnonKey}`)
  if (schema) headers.set("Accept-Profile", schema)

  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...options,
    headers,
  })

  return readJson<T>(response)
}

async function invokeIntakeDirect<T>(body: Record<string, unknown>, session?: AlitoAuthSession | null): Promise<T> {
  requireSupabaseConfig()
  const response = await fetch(`${supabaseUrl}/functions/v1/alito-web-intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token || supabaseAnonKey}`,
    },
    body: JSON.stringify(body),
  })

  return readJson<T>(response)
}

async function invokeIntake<T>(body: Record<string, unknown>, session?: AlitoAuthSession | null): Promise<T> {
  return invokeIntakeDirect<T>(body, session)
}

export function getStoredAlitoSession(): AlitoAuthSession | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(authStorageKey)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AlitoAuthSession
  } catch {
    window.localStorage.removeItem(authStorageKey)
    return null
  }
}

export function storeAlitoSession(session: AlitoAuthSession | null) {
  if (typeof window === "undefined") return
  if (!session) {
    window.localStorage.removeItem(authStorageKey)
    return
  }
  window.localStorage.setItem(authStorageKey, JSON.stringify(session))
}

export async function fetchAlitoPublicCatalog() {
  if (!alitoPortalIsConfigured) {
    return { catalog: fallbackCatalog(), equipment: [] as AlitoEquipment[] }
  }

  try {
    const [catalog, equipment] = await Promise.all([
      supabaseRest<AlitoCatalogItem[]>("/alito_web_catalogo_publico?select=*&order=family_order.asc,display_name.asc"),
      supabaseRest<AlitoEquipment[]>("/alito_web_equipos_publicos?select=*&order=family.asc,display_name.asc"),
    ])
    return { catalog, equipment }
  } catch {
    // API unavailable — return local fallback so the portal is still usable
    return { catalog: fallbackCatalog(), equipment: [] as AlitoEquipment[] }
  }
}

export async function signUpAlitoClient(params: { email: string; password: string; nombre: string }) {
  requireSupabaseConfig()
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      email: normalizeEmail(params.email),
      password: params.password,
      data: { account_type: "alito_client", full_name: params.nombre },
    }),
  })

  return readJson<{ access_token?: string; refresh_token?: string; user?: { id: string; email?: string } }>(response)
}

export async function signInAlitoClient(params: { email: string; password: string }) {
  requireSupabaseConfig()
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ email: normalizeEmail(params.email), password: params.password }),
  })

  const data = await readJson<{ access_token: string; refresh_token?: string; expires_in?: number; user: { id: string; email?: string } }>(response)
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    user: data.user,
  }
  storeAlitoSession(session)
  return session
}

export async function resolveAlitoSession(session: AlitoAuthSession | null) {
  if (!session) return { kind: "guest", user: null } as AlitoResolvedSession
  return invokeIntake<AlitoResolvedSession>({ action: "resolve-session" }, session)
}

export async function registerAlitoClient(
  customer: AlitoCustomerPayload,
  session: AlitoAuthSession | null,
  options?: { allow_create_cliente?: boolean }
) {
  return invokeIntake<{ kind: "client"; profile: AlitoWebProfile; cliente: unknown; route: string }>({
    action: "register-client",
    source_channel: "portal-medusa",
    customer,
    allow_create_cliente: options?.allow_create_cliente === true,
  }, session)
}

export async function submitAlitoQuoteRequest(params: {
  customer: AlitoCustomerPayload
  project: { location: string; notes?: string | null }
  items: AlitoQuoteItemInput[]
  attachments?: AlitoQuoteAttachmentInput[]
  preferred_contact_method?: string | null
  session?: AlitoAuthSession | null
}) {
  return invokeIntake<{ quote: AlitoQuoteRequest }>({
    action: "submit-quote",
    source_channel: "portal-medusa",
    customer: params.customer,
    project: params.project,
    items: params.items,
    attachments: params.attachments || [],
    preferred_contact_method: params.preferred_contact_method,
  }, params.session)
}

export async function fetchMyAlitoQuoteRequests(session: AlitoAuthSession | null) {
  if (!session || !alitoPortalIsConfigured) return [] as AlitoQuoteRequest[]
  const result = await invokeIntake<{ quote_requests: AlitoQuoteRequest[] }>(
    { action: "list-my-quotes", source_channel: "portal-medusa" },
    session
  )
  return result.quote_requests || []
}

export async function fetchAlitoClientPortalSummary(session: AlitoAuthSession | null) {
  if (!session || !alitoPortalIsConfigured) {
    return {
      cliente_id: null,
      counts: { cotizaciones: 0, proformas: 0, facturas: 0, pagos: 0 },
      total_facturado: 0,
      total_pagado: 0,
      balance_pending: 0,
      documents: [],
    } satisfies AlitoClientPortalSummary
  }

  const result = await invokeIntake<{ summary: AlitoClientPortalSummary }>(
    { action: "client-portal-summary", source_channel: "portal-medusa" },
    session
  )
  return result.summary
}

export async function fetchMyAlitoPaymentProofs(session: AlitoAuthSession | null) {
  if (!session || !alitoPortalIsConfigured) return [] as AlitoPaymentProof[]
  const result = await invokeIntake<{ payment_proofs: AlitoPaymentProof[] }>(
    { action: "list-my-payment-proofs", source_channel: "portal-medusa" },
    session
  )
  return result.payment_proofs || []
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
}

export async function uploadAlitoPurchaseOrder(params: { quoteRequestId: string; file: File; session: AlitoAuthSession }) {
  requireSupabaseConfig()
  const safeName = sanitizeFileName(params.file.name) || "orden-compra.pdf"
  const storagePath = `${params.session.user.id}/${params.quoteRequestId}/orden-compra/${Date.now()}-${safeName}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/alito-client-documents/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${params.session.access_token}`,
      "Content-Type": params.file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: params.file,
  })

  await readJson<{ Key?: string }>(response)
  return { storagePath, fileName: params.file.name }
}

export async function uploadAlitoPaymentProofFile(params: { quoteRequestId: string; file: File; session: AlitoAuthSession }) {
  requireSupabaseConfig()
  const safeName = sanitizeFileName(params.file.name) || "comprobante-pago.pdf"
  const storagePath = `${params.session.user.id}/${params.quoteRequestId}/payment-proof/${Date.now()}-${safeName}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/alito-client-payments/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${params.session.access_token}`,
      "Content-Type": params.file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: params.file,
  })

  await readJson<{ Key?: string }>(response)
  return { storagePath, fileName: params.file.name }
}

export async function downloadAlitoClientDocument(params: {
  quoteRequestId: string
  storagePath?: string | null
  fileName?: string | null
  session: AlitoAuthSession
}) {
  const result = await invokeIntake<{ signed_url: string; file_name?: string | null }>(
    {
      action: "get-client-document-url",
      quote_request_id: params.quoteRequestId,
      storage_path: params.storagePath || null,
      source_channel: "portal-medusa",
    },
    params.session
  )

  const response = await fetch(result.signed_url)
  if (!response.ok) {
    throw new Error("No se pudo descargar el documento del cliente.")
  }

  const data = await response.blob()
  const fallbackName = params.storagePath?.split("/").pop() || "documento-alito"
  const objectUrl = URL.createObjectURL(data)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = params.fileName || result.file_name || fallbackName
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
}

export async function submitAlitoPaymentProof(params: {
  quote_request_id: string
  related_document_type?: "cotizacion" | "proforma" | "factura" | null
  related_document_id?: string | null
  related_document_number?: string | null
  monto_reportado: number
  currency?: string | null
  fecha_pago_reportada?: string | null
  metodo_reportado?: string | null
  banco_reportado?: string | null
  referencia_reportada: string
  notas?: string | null
  file_name: string
  storage_path: string
  session: AlitoAuthSession
}) {
  return invokeIntake<{ payment_proof: AlitoPaymentProof }>(
    {
      action: "submit-payment-proof",
      source_channel: "portal-medusa",
      quote_request_id: params.quote_request_id,
      related_document_type: params.related_document_type || null,
      related_document_id: params.related_document_id || null,
      related_document_number: params.related_document_number || null,
      monto_reportado: params.monto_reportado,
      currency: params.currency || "DOP",
      fecha_pago_reportada: params.fecha_pago_reportada || null,
      metodo_reportado: params.metodo_reportado || "transferencia",
      banco_reportado: params.banco_reportado || null,
      referencia_reportada: params.referencia_reportada,
      notas: params.notas || null,
      file_name: params.file_name,
      storage_path: params.storage_path,
    },
    params.session
  )
}

export async function approveAlitoQuoteRequest(params: {
  quote_request_id: string
  decision: "approved" | "rejected"
  signature_data_url?: string | null
  approval_name?: string | null
  approval_document?: string | null
  notes?: string | null
  purchase_order_number?: string | null
  purchase_order_file_name?: string | null
  purchase_order_storage_path?: string | null
  session: AlitoAuthSession
}) {
  return invokeIntake<{ kind: "client"; quote: AlitoQuoteRequest }>({
    action: "client-approve-quote",
    quote_request_id: params.quote_request_id,
    decision: params.decision,
    signature_data_url: params.signature_data_url,
    approval_name: params.approval_name,
    approval_document: params.approval_document,
    notes: params.notes,
    purchase_order_number: params.purchase_order_number,
    purchase_order_file_name: params.purchase_order_file_name,
    purchase_order_storage_path: params.purchase_order_storage_path,
  }, params.session)
}

export function buildCatalogQuoteItem(item: AlitoCatalogItem): AlitoQuoteItemInput {
  return {
    catalog_item_code: item.item_code,
    family_code: item.family_code,
    display_name: item.display_name,
    quantity: 1,
    unit: item.base_unit,
    capacity_m3: item.capacities_supported?.[0] ?? null,
    equipment_class: item.equipment_classes_supported?.[0] ?? null,
    notes: item.public_notes || "",
    metadata: { source: "catalog", family_name: item.family_name },
  }
}

export function buildEquipmentQuoteItem(equipment: AlitoEquipment): AlitoQuoteItemInput {
  return {
    family_code: "alquiler_equipos",
    display_name: equipment.display_name,
    quantity: 1,
    unit: "DIAS",
    capacity_m3: equipment.commercial_capacity_m3,
    equipment_class: equipment.source_capacity || equipment.family,
    notes: [equipment.marca, equipment.modelo, equipment.placa].filter(Boolean).join(" - "),
    metadata: { source: "equipment", ficha: equipment.ficha },
  }
}
