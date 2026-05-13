"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"

const CATEGORIES = [
  { id: "Excavadoras",       count: 6,  img: "/alito-catalog/EXC-CAT320.png",   label: "Excavadoras" },
  { id: "Minicargadores",    count: 9,  img: "/alito-catalog/MCG-CAT236D.png",   label: "Minicargadores" },
  { id: "Camiones",          count: 11, img: "/alito-catalog/CAM-SNT22.jpg",     label: "Camiones" },
  { id: "Retropalas",        count: 4,  img: "/alito-catalog/RTP-CAT416.jpg",    label: "Retropalas" },
  { id: "Rodillos",          count: 3,  img: "/alito-catalog/ROD-CAT27.jpg",     label: "Rodillos" },
  { id: "Miniretro",         count: 3,  img: "/alito-catalog/MRT-CAT305.jpg",    label: "Miniretro" },
  { id: "Tractor de Orugas", count: 2,  img: "/alito-catalog/TRC-CATD6.jpg",     label: "Tractor Orugas" },
  { id: "Montacargas",       count: 1,  img: "/alito-catalog/MCF-CAT.jpg",       label: "Montacargas" },
  { id: "Telehandler",       count: 1,  img: "/alito-catalog/TLH-JLG943.jpg",   label: "Telehandler" },
]

export function PremiumCategoryCarousel({ onNavigate }: { onNavigate: (v: PortalView) => void }) {
  return (
    <section className="bg-white px-5 py-16">
      <div className="mx-auto max-w-[1400px] lg:px-8">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">
              46+ equipos disponibles
            </div>
            <h2
              className="text-3xl font-black tracking-tight text-zinc-950"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Explora la flota
            </h2>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="hidden items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors md:flex"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.05 }}
              onClick={() => onNavigate("catalog")}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] flex flex-col justify-end hover:-translate-y-1.5 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-400/30 focus:outline-none"
            >
              {/* Equipment image */}
              <img
                src={cat.img}
                alt={cat.id}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                draggable={false}
              />

              {/* Full gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/10" />

              {/* Label */}
              <div className="relative z-10 p-4 text-left">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 mb-1">
                  {cat.count} unidades
                </div>
                <div className="text-base font-black text-white leading-tight">{cat.label}</div>
              </div>

              {/* Arrow badge */}
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-zinc-950 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex md:hidden">
          <button
            onClick={() => onNavigate("catalog")}
            className="w-full rounded-full border border-zinc-200 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition"
          >
            Ver catálogo completo
          </button>
        </div>
      </div>
    </section>
  )
}
