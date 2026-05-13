"use client"

import { Clock, Mail, MapPin, Phone } from "lucide-react"

const INFO = [
  { icon: MapPin, label: "Ubicación", value: "Calle Domingo Maiz, Santiago, R.D." },
  { icon: Phone, label: "Teléfonos", value: "+1 (809) 693-3106 · +1 (849) 315-0511" },
  { icon: Mail, label: "Correo", value: "info@alitogroup.com" },
  { icon: Clock, label: "Horario", value: "Lun–Vie 7AM–6PM · Sáb 7AM–1PM" },
]

export function PremiumFooter() {
  return (
    <footer className="bg-zinc-950">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-20 items-start">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img
              src="/alito-logo.png"
              alt="ALITO"
              className="h-9 w-auto brightness-0 invert"
            />
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Alito Group SRL
            </div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-[200px]">
              Alquiler de equipos pesados y movimiento de materiales con operación digital.
            </p>
          </div>

          {/* Info grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-500 shrink-0" strokeWidth={1.8} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
                </div>
                <span className="text-sm text-zinc-400 leading-relaxed">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-6">
          <span className="text-xs text-zinc-700">
            © {new Date().getFullYear()} Alito Group SRL / Alito EIRL · Todos los derechos reservados
          </span>
          <span className="text-xs text-zinc-800">R.D. · Portal v2</span>
        </div>
      </div>
    </footer>
  )
}
