import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const STATS = [
  { value: "50+", label: "Equipos disponibles" },
  { value: "500+", label: "Proyectos entregados" },
  { value: "<24h", label: "Respuesta cotización" },
  { value: "15+", label: "Años operando" },
]

const FAMILIES = [
  { label: "Excavadoras", desc: "CAT · SDLG · Volvo", img: "/alito-catalog/EXC-CAT320.png" },
  { label: "Minicargadores", desc: "CAT 216B · 232D · 236D", img: "/alito-catalog/MCG-CAT216B.png" },
  { label: "Retropalas", desc: "CAT 416 · 416M", img: "/alito-catalog/RTP-CAT416.png" },
  { label: "Camiones", desc: "10T · 14T · 22T", img: "/alito-catalog/CAM-SNT14.png" },
]

const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "var(--aq-bg)" }}
    >
      {/* industrial grid bg */}
      <div className="absolute inset-0 industrial-grid opacity-60 pointer-events-none" />

      {/* amber radial glow behind machinery */}
      <div
        className="absolute right-0 top-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 75% 40%, var(--aq-amber-glow) 0%, transparent 70%)",
        }}
      />

      {/* ─── MAIN HERO ─── */}
      <div className="content-container relative z-10 flex min-h-[88vh] flex-col justify-center gap-0 py-16 small:flex-row small:items-center small:gap-12 small:py-24">

        {/* LEFT — copy + CTAs + stats */}
        <div className="flex flex-1 flex-col gap-8 max-w-[540px]">

          {/* eyebrow badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-widest"
            style={{ borderColor: "var(--aq-border-strong)", color: "var(--aq-amber)", background: "var(--aq-amber-glow)" }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--aq-amber)" }} />
            Cotización guiada · Respuesta &lt;24h
          </div>

          {/* headline */}
          <div className="flex flex-col gap-4">
            <h1
              className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight small:text-[3.5rem]"
              style={{ color: "var(--aq-fg)", fontFamily: "'Space Grotesk', 'Sora', system-ui, sans-serif" }}
            >
              Equipos pesados,<br />
              <span style={{ color: "var(--aq-amber)" }}>materiales</span> y<br />
              camiones en RD.
            </h1>
            <p className="max-w-[420px] text-base leading-relaxed" style={{ color: "var(--aq-fg-2)" }}>
              Renta de maquinaria, despacho de materiales y transporte de carga.
              Cotiza digitalmente — de la solicitud a la factura en horas.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 xsmall:flex-row">
            <LocalizedClientLink href="/portal">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "var(--aq-amber)", color: "#171717" }}
              >
                Solicitar cotización
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/store">
              <button
                className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-all duration-200 hover:opacity-80"
                style={{ borderColor: "var(--aq-border-strong)", color: "var(--aq-fg)", background: "transparent" }}
              >
                Ver catálogo
              </button>
            </LocalizedClientLink>
          </div>

          {/* stats strip */}
          <div className="grid grid-cols-2 gap-3 pt-2 small:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--aq-fg)", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  {s.value}
                </span>
                <span className="text-xs leading-tight" style={{ color: "var(--aq-fg-2)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating machinery + glass spec panel */}
        <div className="relative flex flex-1 items-center justify-center min-h-[420px] small:min-h-[560px]">

          {/* main machinery image */}
          <div
            className="relative w-full max-w-[520px]"
            style={{
              filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.18)) drop-shadow(0 0 40px var(--aq-amber-glow))",
              transform: "perspective(900px) rotateY(-6deg) rotateX(2deg)",
            }}
          >
            <Image
              src="/alito-catalog/EXC-CAT320.png"
              alt="Excavadora CAT 320 ALITO"
              width={600}
              height={440}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* glass spec panel — bottom left */}
          <div
            className="absolute bottom-4 left-2 small:bottom-8 small:left-0 rounded-xl p-4 min-w-[180px]"
            style={{
              background: "var(--aq-surface-glass)",
              border: "1px solid var(--aq-border-strong)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--aq-steel)" }}>
              Ficha rápida
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--aq-fg)", fontFamily: "'Space Grotesk', system-ui" }}>
              CAT 320 · 20T
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--aq-fg-2)" }}>Excavadora hidráulica</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--aq-success)" }} />
              <span className="text-[11px]" style={{ color: "var(--aq-success)" }}>Disponible ahora</span>
            </div>
          </div>

          {/* interaction badge — top right */}
          <div
            className="absolute top-4 right-0 small:top-8 rounded-full px-3 py-1.5 text-[11px] font-medium"
            style={{
              background: "var(--aq-surface-glass)",
              border: "1px solid var(--aq-border-strong)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              color: "var(--aq-fg-2)",
            }}
          >
            ⬡ Vista 360° disponible
          </div>
        </div>
      </div>

      {/* ─── EQUIPMENT FAMILY STRIP ─── */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "var(--aq-border)", background: "var(--aq-surface)" }}
      >
        <div className="content-container py-10">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--aq-steel)" }}>
            Familias de equipo
          </p>
          <div className="grid grid-cols-2 gap-4 small:grid-cols-4">
            {FAMILIES.map((fam) => (
              <LocalizedClientLink key={fam.label} href="/store">
                <div
                  className="group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  style={{
                    background: "var(--aq-bg-2)",
                    border: "1px solid var(--aq-border)",
                  }}
                >
                  <div className="mb-3 flex h-[80px] items-end justify-center">
                    <Image
                      src={fam.img}
                      alt={fam.label}
                      width={120}
                      height={80}
                      className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))" }}
                    />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--aq-fg)" }}>{fam.label}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--aq-fg-2)" }}>{fam.desc}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--aq-amber)" }}>
                    Ver →
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
