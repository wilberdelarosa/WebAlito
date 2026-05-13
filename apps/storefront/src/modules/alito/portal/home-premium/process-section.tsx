"use client"

import { motion } from "framer-motion"
import { ArrowRight, CircleCheckBig, CloudUpload, FileSearch, FileText, FolderOpen, ReceiptText } from "lucide-react"

type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"

const STEPS = [
  { n: "01", label: "Requerimiento", sub: "Subís tu solicitud de equipos o materiales", icon: CloudUpload },
  { n: "02", label: "Cotización", sub: "Recibís una propuesta detallada", icon: FileSearch },
  { n: "03", label: "Aprobación", sub: "Firmás digitalmente desde el portal", icon: CircleCheckBig },
  { n: "04", label: "Proforma", sub: "Generamos el documento formal", icon: FileText },
  { n: "05", label: "Factura", sub: "Facturación y seguimiento online", icon: ReceiptText },
  { n: "06", label: "Documentos", sub: "Accedés a todos los registros", icon: FolderOpen },
]

export function PremiumProcessSection({ onNavigate }: { onNavigate: (v: PortalView) => void }) {
  return (
    <section className="bg-white px-5 py-16">
      <div className="mx-auto max-w-[1400px] lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">
              Cómo funciona
            </div>
            <h2
              className="text-3xl font-black tracking-tight text-zinc-950"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Proceso 100% digital
            </h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-xs">
              Desde la solicitud hasta la factura, todo en el portal.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-amber-700 sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Sin papel
          </span>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 xl:grid-cols-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.07 }}
              className="flex flex-col gap-4"
            >
              {/* Icon + number badge */}
              <div className="relative w-fit">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950">
                  <step.icon className="h-5 w-5 text-white" strokeWidth={1.7} />
                </div>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black leading-none">
                  {step.n}
                </span>
              </div>

              {/* Text */}
              <div>
                <div className="text-sm font-black tracking-tight text-zinc-950">{step.label}</div>
                <div className="mt-1 text-xs leading-5 text-zinc-500">{step.sub}</div>
              </div>

              {/* Connector (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden xl:block absolute" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col gap-5 rounded-2xl bg-zinc-950 px-8 py-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-2">
              Firma digital incluida
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-lg">
              La aprobación del cliente queda ligada a la solicitud, proforma, factura y documentos.
              El panel cliente muestra el estado; el admin gestiona la operación.
            </p>
          </div>
          <button
            onClick={() => onNavigate("cart")}
            className="shrink-0 inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-black transition hover:bg-amber-300 active:scale-95"
          >
            Iniciar solicitud
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

      </div>
    </section>
  )
}
