"use client"

import { alitoCatalogFamilies, alitoQuoteRequiredFields } from "@lib/alito/catalog"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Input, Text } from "@modules/common/components/ui"
import { useMemo, useState } from "react"

type AlitoQuoteFormProps = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; correlationId: string }
  | { status: "error"; message: string }

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export default function AlitoQuoteForm({ cart, customer }: AlitoQuoteFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" })
  const [form, setForm] = useState({
    name: `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
    phone: customer?.phone ?? "",
    email: customer?.email ?? cart.email ?? "",
    company: "",
    rnc: "",
    location: "",
    requestedDate: "",
    urgency: "normal",
    family: alitoCatalogFamilies[0]?.id ?? "suministros",
    accessNotes: "",
    notes: "",
  })

  const selectedFamily = useMemo(
    () => alitoCatalogFamilies.find((family) => family.id === form.family),
    [form.family]
  )

  const quoteItems = useMemo(() => {
    return (cart.items ?? []).map((item) => ({
      line_id: item.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.product_title,
      variant: item.variant?.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
      metadata: item.metadata,
    }))
  }, [cart.items])

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submitQuote = async () => {
    if (!form.name || !form.phone || !form.location) {
      setSubmitState({
        status: "error",
        message: "Completa nombre, telefono y ubicacion para enviar la solicitud.",
      })
      return
    }

    setSubmitState({ status: "submitting" })

    try {
      const response = await fetch(`${backendUrl}/store/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
        },
        body: JSON.stringify({
          source: "web_cotizador",
          cart_id: cart.id,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            company: form.company,
            rnc: form.rnc,
          },
          project: {
            location: form.location,
            requested_date: form.requestedDate,
            urgency: form.urgency,
            family: form.family,
            access_notes: form.accessNotes,
            notes: form.notes,
          },
          items: quoteItems,
          catalog_context: selectedFamily,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo enviar la solicitud.")
      }

      setSubmitState({
        status: "success",
        correlationId: data.correlation_id,
      })
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo enviar la solicitud.",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-y-8">
      <div className="border border-ui-border-base bg-ui-bg-subtle p-6 small:p-8">
        <div className="flex flex-col gap-y-3">
          <Text className="txt-compact-small-plus uppercase text-ui-fg-muted">
            Flujo ALITO
          </Text>
          <Heading level="h1" className="text-2xl small:text-3xl">
            Solicitud de cotizacion
          </Heading>
          <Text className="max-w-[48rem] text-ui-fg-subtle">
            Este paso reemplaza el checkout de ecommerce. Aqui se captura el
            contexto que operaciones necesita para convertir el borrador en
            cotizacion, proforma y factura en Access Hub 68.
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
        <Input
          label="Nombre del contacto"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Nombre y apellido"
        />
        <Input
          label="Telefono / WhatsApp"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="809-000-0000"
        />
        <Input
          label="Correo"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="cliente@empresa.com"
        />
        <Input
          label="Empresa"
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder="Opcional"
        />
        <Input
          label="RNC / cedula"
          value={form.rnc}
          onChange={(event) => updateField("rnc", event.target.value)}
          placeholder="Opcional"
        />
        <Input
          label="Fecha estimada"
          type="date"
          value={form.requestedDate}
          onChange={(event) => updateField("requestedDate", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 small:grid-cols-[1fr_220px]">
        <Input
          label="Ubicacion de obra"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="Zona, sector, referencia o pin"
        />
        <label className="flex flex-col gap-1 text-sm font-medium">
          Urgencia
          <select
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            value={form.urgency}
            onChange={(event) => updateField("urgency", event.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="esta_semana">Esta semana</option>
            <option value="urgente">Urgente</option>
            <option value="programada">Programada</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 small:grid-cols-[280px_1fr]">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Familia operativa
          <select
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            value={form.family}
            onChange={(event) => updateField("family", event.target.value)}
          >
            {alitoCatalogFamilies.map((family) => (
              <option key={family.id} value={family.id}>
                {family.title}
              </option>
            ))}
          </select>
        </label>
        <div className="border border-ui-border-base p-4">
          <Text className="txt-small-plus text-ui-fg-base">
            {selectedFamily?.eyebrow}
          </Text>
          <Text className="mt-2 text-ui-fg-subtle">{selectedFamily?.summary}</Text>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedFamily?.requiredContext.map((field) => (
              <span
                key={field}
                className="rounded-md border border-ui-border-base px-2 py-1 txt-compact-small text-ui-fg-subtle"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Acceso, restricciones y logistica
        <textarea
          className="min-h-24 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          value={form.accessNotes}
          onChange={(event) => updateField("accessNotes", event.target.value)}
          placeholder="Ej: calle estrecha, horario permitido, bote con destino especifico, acceso para camion 22 m3..."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Notas para operaciones
        <textarea
          className="min-h-24 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Detalles del alcance, volumen aproximado, fotos disponibles o instrucciones del cliente."
        />
      </label>

      <div className="border border-ui-border-base p-4">
        <Text className="txt-small-plus text-ui-fg-base">
          Checklist minimo antes de enviar
        </Text>
        <ul className="mt-3 grid grid-cols-1 gap-2 small:grid-cols-2">
          {alitoQuoteRequiredFields.map((field) => (
            <li key={field} className="txt-small text-ui-fg-subtle">
              {field}
            </li>
          ))}
        </ul>
      </div>

      {submitState.status === "success" && (
        <div className="border border-green-200 bg-green-50 p-4 text-green-800">
          Solicitud recibida. Correlation ID: {submitState.correlationId}. El
          siguiente paso es revision interna y generacion de cotizacion.
        </div>
      )}

      {submitState.status === "error" && (
        <div className="border border-red-200 bg-red-50 p-4 text-red-800">
          {submitState.message}
        </div>
      )}

      <Button
        className="h-12 w-full small:w-fit"
        onClick={submitQuote}
        isLoading={submitState.status === "submitting"}
      >
        Enviar solicitud de cotizacion
      </Button>
    </div>
  )
}
