"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, ShieldCheck, Truck, Clock3 } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, ContactShadows, MeshTransmissionMaterial, Torus, Cylinder, Sphere, PresentationControls } from "@react-three/drei"
import * as THREE from "three"

type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"

const HERO_EQUIPMENT = [
  { video: "/hero-video.mp4", name: "ALITO Operation", spec: "Potencia en Movimiento", tag: "Main" },
]

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Equipos Certificados", value: "100%" },
  { icon: Truck, label: "Flota Disponible", value: "46+" },
  { icon: Clock3, label: "Despliegue", value: "<24h" },
]

// ─── Hyper-Realistic 3D Background ──────────────────────────────────────────
function MechanicalAbstractScene() {
  const groupRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2
      groupRef.current.rotation.y = t * 0.1
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.2
      ringsRef.current.rotation.y = t * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[8, 0, -5]} scale={1.5}>
      {/* Central Glass Sphere */}
      <Float speed={2} floatIntensity={1} rotationIntensity={1}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial 
            backside
            thickness={2}
            roughness={0}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.05}
            anisotropy={0.1}
            color="#ffffff"
          />
        </Sphere>
      </Float>

      {/* Orbiting Gold/Metal Rings */}
      <group ref={ringsRef}>
        <Torus args={[2.5, 0.02, 64, 128]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.1} />
        </Torus>
        <Torus args={[3.2, 0.05, 64, 128]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#e4e4e7" metalness={0.9} roughness={0.2} />
        </Torus>
        <Torus args={[4, 0.01, 64, 128]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#f59e0b" metalness={1} roughness={0.3} />
        </Torus>
      </group>

      {/* Floating Mechanical Cylinders */}
      <Float speed={1.5} floatIntensity={2} rotationIntensity={2} position={[-3, 2, -2]}>
        <Cylinder args={[0.2, 0.2, 1, 32]}>
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
        </Cylinder>
      </Float>
      <Float speed={2.5} floatIntensity={1.5} rotationIntensity={3} position={[3, -2, 1]}>
        <Cylinder args={[0.4, 0.4, 0.2, 32]}>
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </Float>
    </group>
  )
}

function SceneCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#fbbf24" />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
        
        <Environment preset="studio" />
        
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <MechanicalAbstractScene />
        </PresentationControls>

        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={40} blur={2} far={4} color="#000000" />
      </Canvas>
    </div>
  )
}

// ─── Video with Image Fallback ────────────────────────────────────────────────
function VideoOrFallback({ src, fallbackImg }: { src: string; fallbackImg: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <img
        src={fallbackImg}
        alt="ALITO Equipment"
        className="w-full h-full object-cover scale-110 transition-transform ease-out"
      />
    )
  }

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setFailed(true)}
      style={{ transitionDuration: "2000ms" }}
      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform ease-out"
    />
  )
}

// ─── Premium Glass Magnetic Card ──────────────────────────────────────────────
function TopGlassShowcase({ current, heroIdx, direction, next, prev, onGoTo }: any) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])
  
  // Glare effect calculation
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.8, rotateY: d > 0 ? 15 : -15 }),
    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.8, rotateY: d > 0 ? -15 : 15 }),
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[850px] aspect-video perspective-1000 z-20 mx-auto group"
    >
      {/* The 3D Glass Body */}
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
        className="absolute inset-0 rounded-[2rem] bg-white/10 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-zinc-700/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500"
      >
        {/* Dynamic Glare */}
        <motion.div 
          style={{ x: glareX, y: glareY }}
          className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rotate-45 mix-blend-overlay"
        />

        {/* The Video Background with image fallback */}
        <div className="absolute inset-0 z-0">
          <VideoOrFallback src={current.video} fallbackImg="/alito-catalog/EXC-CAT320.png" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Content Overlay */}
        <div style={{ transform: "translateZ(100px)" }} className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-black text-amber-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Live Showcase
              </div>
              <div className="font-black text-4xl text-white leading-none tracking-tighter drop-shadow-lg">{current.name}</div>
              <div className="text-zinc-300 text-sm font-medium mt-2 drop-shadow-md">{current.spec}</div>
            </div>
          </div>
        </div>

        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </motion.div>
  )
}

// ─── Main Hero Section (Ultra Premium Light Theme) ─────────────────────────
export function PremiumHeroSection({ onNavigate }: { onNavigate: (v: PortalView) => void }) {
  const [heroIdx, setHeroIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1)
      setHeroIdx(i => (i + 1) % HERO_EQUIPMENT.length)
    }, 8000)
    return () => clearInterval(t)
  }, [])

  const goTo = (idx: number) => {
    setDirection(idx > heroIdx ? 1 : -1)
    setHeroIdx(idx)
  }

  const prev = () => { setDirection(-1); setHeroIdx(i => (i - 1 + HERO_EQUIPMENT.length) % HERO_EQUIPMENT.length) }
  const next = () => { setDirection(1); setHeroIdx(i => (i + 1) % HERO_EQUIPMENT.length) }

  const current = HERO_EQUIPMENT[heroIdx]

  return (
    <section className="relative overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] min-h-[92vh] flex items-center font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-100">
      
      {/* 3D Abstract Scene Background */}
      <SceneCanvas />

      {/* Refined Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-amber-400/15 dark:bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-zinc-300/30 dark:bg-zinc-800/20 rounded-full blur-[120px]" />
        {/* Left mask: keeps 3D canvas from bleeding into text column */}
        <div className="absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-zinc-50/90 via-zinc-50/40 to-transparent dark:from-[#0a0a0a]/90 dark:via-[#0a0a0a]/40 pointer-events-none z-[1]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full mx-auto max-w-screen-2xl px-6 lg:px-12 py-20 lg:py-0">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-10 items-center">
          
          {/* ── LEFT: Ultra Clean Content ── */}
          <div className="lg:col-span-6 flex flex-col pt-10 perspective-1000">
            {/* Minimalist Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 self-start rounded-full bg-white/90 dark:bg-zinc-900/80 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 mb-10 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-600 dark:text-zinc-400">
                Alito Group · Flota Certificada
              </span>
            </motion.div>

            {/* Awwwards Style Typography */}
            <h1 style={{ fontFamily: "var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif" }} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-zinc-900 dark:text-white leading-[1.05] overflow-hidden">
              <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block">
                La flota más
              </motion.span>
              <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-200 py-2">
                avanzada
              </motion.span>
              <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
                a tu alcance.
              </motion.span>
            </h1>

            {/* Minimal Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg font-normal tracking-tight"
            >
              Alquila maquinaria pesada y equipos de precisión con una experiencia visual incomparable. Todo en una sola plataforma.
            </motion.p>

            {/* Elegant CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => onNavigate("catalog")}
                className="group inline-flex items-center gap-2.5 rounded-full bg-zinc-950 dark:bg-white px-8 py-3.5 text-sm font-bold text-white dark:text-zinc-900 transition hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 shadow-lg"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate("cart")}
                className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl px-8 py-3.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 transition hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-white dark:hover:bg-zinc-800 active:scale-95"
              >
                Solicitar cotización
              </button>
            </motion.div>

            {/* Refined Stats / Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-6 pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80"
            >
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="flex flex-col gap-0.5">
                  <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{badge.value}</div>
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{badge.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Ultra Premium 3D Glass Showcase ── */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end mt-20 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full"
            >
              <TopGlassShowcase
                current={current}
                heroIdx={heroIdx}
                direction={direction}
                next={next}
                prev={prev}
                onGoTo={goTo}
              />
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  )
}
