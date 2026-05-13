"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, ShoppingCart, UserRound, X } from "lucide-react"

type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"

interface PremiumHeaderProps {
  view: PortalView
  onNavigate: (v: PortalView) => void
  cartCount: number
  isClient: boolean
  onSignOut: () => void
  resolvedSession: any
}

const NAV = [
  { label: "Inicio", view: "home" as PortalView },
  { label: "Catálogo", view: "catalog" as PortalView },
  { label: "Cotizaciones", view: "cart" as PortalView },
  { label: "Mi panel", view: "dashboard" as PortalView },
]

export function PremiumHeader({ view, onNavigate, cartCount, isClient, onSignOut, resolvedSession }: PremiumHeaderProps) {
  const [open, setOpen] = useState(false)

  const go = (v: PortalView) => { onNavigate(v); setOpen(false) }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-100">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5 lg:px-8">

        {/* Logo */}
        <button onClick={() => go("home")} className="flex items-center gap-2.5 shrink-0">
          <img src="/alito-logo.png" alt="ALITO" className="h-9 w-auto" />
          <span className="hidden text-[10px] font-black uppercase tracking-widest text-zinc-400 sm:block">Alito Group</span>
        </button>

        {/* Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => {
            const active = view === n.view
            return (
              <button
                key={n.label}
                onClick={() => go(n.view)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  active ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-line"
                    className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-amber-400"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {isClient ? (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="max-w-[100px] truncate">{resolvedSession?.profile?.nombre || "Cliente"}</span>
              </span>
              <button onClick={onSignOut} className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors">Salir</button>
            </div>
          ) : (
            <button
              onClick={() => go("dashboard")}
              className="hidden items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition lg:flex"
            >
              <UserRound className="h-4 w-4" />
              Entrar
            </button>
          )}

          <button
            onClick={() => go("cart")}
            aria-label="Cotización"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-0.5 text-[9px] font-black text-black">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => go("cart")}
            className="hidden rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 active:scale-95 transition sm:flex"
          >
            Cotizar ahora
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-0.5 px-4 py-3">
              {NAV.map((n) => (
                <button
                  key={n.label}
                  onClick={() => go(n.view)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    view === n.view ? "bg-zinc-50 text-zinc-950" : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {n.label}
                </button>
              ))}
              <div className="mt-2 border-t border-zinc-100 pt-2">
                <button onClick={() => go("cart")} className="w-full rounded-full bg-zinc-950 py-3 text-sm font-bold text-white">
                  Cotizar ahora
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
