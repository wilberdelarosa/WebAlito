"use client"

import { motion } from "framer-motion"
import { Truck, CalendarDays, Clock3, ShieldCheck } from "lucide-react"

const STATS = [
  { value: "46+", label: "Equipos propios", sub: "Flota certificada", icon: Truck },
  { value: "7+", label: "Años operando", sub: "Experiencia real", icon: CalendarDays },
  { value: "<24h", label: "Respuesta garantizada", sub: "Cotización detallada", icon: Clock3 },
  { value: "100%", label: "Proceso digital", sub: "Firma y seguimiento", icon: ShieldCheck },
]

export function PremiumStatsBar() {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-px md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col gap-2 px-2 py-6 md:px-8 md:border-r md:border-zinc-800 last:border-0"
            >
              <s.icon className="h-5 w-5 text-amber-500" strokeWidth={1.6} />
              <div className="text-4xl font-black tracking-tight text-white mt-1">{s.value}</div>
              <div className="text-sm font-bold text-amber-400 leading-tight">{s.label}</div>
              <div className="text-xs text-zinc-600">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
