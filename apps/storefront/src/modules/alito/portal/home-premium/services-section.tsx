"use client"

import { motion } from "framer-motion"
import { ArrowRight, Construction, PackageCheck, Shovel, Truck } from "lucide-react"

type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"

const SERVICES = [
  {
    icon: Construction,
    title: "Alquiler de Equipos",
    copy: "Excavadoras, rodillos, retropalas y minicargadores con operador certificado para tu proyecto.",
    tag: "Principal",
  },
  {
    icon: Truck,
    title: "Transporte y Logística",
    copy: "Traslados programados de materiales y equipos con control de ruta en tiempo real.",
    tag: "Logística",
  },
  {
    icon: Shovel,
    title: "Excavaciones",
    copy: "Preparación de terreno, perfilado, desbroce y apoyo operativo en obra.",
    tag: "Terreno",
  },
]

const MATERIALS = [
  { name: "Arena",           img: "/alito-catalog/SUM-ARENA.jpg",    unit: "m³ / viaje" },
  { name: "Caliche",         img: "/alito-catalog/SUM-CALICHE.jpg",  unit: "m³ / viaje" },
  { name: "Grava 3/4",       img: "/alito-catalog/SUM-GRAVA.jpg",    unit: "m³ / viaje" },
  { name: "Piedra Triturada",img: "/alito-catalog/SUM-PIEDRA.jpg",   unit: "m³ / viaje" },
  { name: "Relleno",         img: "/alito-catalog/SUM-RELLENO.jpg",  unit: "m³ / viaje" },
]

export function PremiumServicesSection({ onNavigate }: { onNavigate: (v: PortalView) => void }) {
  return (
    <section className="bg-zinc-50 px-5 py-16">
      <div className="mx-auto max-w-[1400px] space-y-14 lg:px-8">

        {/* Services */}
        <div>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">
                Lo que hacemos
              </div>
              <h2
                className="text-3xl font-black tracking-tight text-zinc-950"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Servicios principales
              </h2>
            </div>
            <button
              onClick={() => onNavigate("catalog")}
              className="hidden items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition md:flex"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((svc, i) => (
              <motion.button
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => onNavigate("catalog")}
                className="group relative flex flex-col items-start rounded-2xl bg-white border border-zinc-200/60 p-7 text-left transition hover:-translate-y-1 hover:border-amber-200/80 hover:shadow-xl hover:shadow-zinc-100 focus:outline-none"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950">
                  <svc.icon className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
                </div>

                {/* Tag */}
                <span className="mt-3 inline-block rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">
                  {svc.tag}
                </span>

                <h3 className="mt-4 text-lg font-black tracking-tight text-zinc-950 leading-tight">
                  {svc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{svc.copy}</p>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-amber-500 transition-colors">
                  Ver servicios
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div>
          <div className="mb-8">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">
              Disponibles ahora
            </div>
            <h2
              className="text-2xl font-black tracking-tight text-zinc-950"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Materiales de construcción
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MATERIALS.map((mat, i) => (
              <motion.button
                key={mat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                onClick={() => onNavigate("catalog")}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-square focus:outline-none"
              >
                <img
                  src={mat.img}
                  alt={mat.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3 text-left">
                  <div className="text-xs font-black text-white leading-tight">{mat.name}</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-0.5">{mat.unit}</div>
                </div>
                <div className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PackageCheck className="h-4 w-4 text-amber-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
