"use client"
import { ChangeEvent, PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import {
 CalendarDays,
 CheckCircle2,
 Clock3,
 CloudUpload,
 Box,
 FileSearch,
 FileText,
 FolderOpen,
 Lock,
 Phone,
 ReceiptText,
 ShieldCheck,
 Smartphone,
 Truck,
 Upload,
 CircleCheckBig,
 Users,
 Zap,
} from "lucide-react"
import {
 approveAlitoQuoteRequest,
 buildCatalogQuoteItem,
 buildEquipmentQuoteItem,
 downloadAlitoClientDocument,
 fetchAlitoPublicCatalog,
 fetchAlitoClientPortalSummary,
 fetchMyAlitoPaymentProofs,
 fetchMyAlitoQuoteRequests,
 getStoredAlitoSession,
 registerAlitoClient,
 resolveAlitoSession,
 signInAlitoClient,
 signUpAlitoClient,
 storeAlitoSession,
 submitAlitoPaymentProof,
 submitAlitoQuoteRequest,
 uploadAlitoPurchaseOrder,
 uploadAlitoPaymentProofFile,
 type AlitoAuthSession,
 type AlitoCatalogItem,
 type AlitoClientPortalDocument,
 type AlitoClientPortalSummary,
 type AlitoCustomerPayload,
 type AlitoEquipment,
 type AlitoPaymentProof,
 type AlitoQuoteItemInput,
 type AlitoQuoteRequest,
 type AlitoResolvedSession,
} from "@lib/alito/portal"
import { getCatalogItemImage, getEquipmentImage, ALITO_CATALOG_IMAGES } from "@lib/alito/images"
import {
 PremiumHeroSection,
 PremiumStatsBar,
 PremiumCategoryCarousel,
 PremiumServicesSection,
 PremiumProcessSection,
 PremiumHeader,
 PremiumFooter,
} from "./home-premium"
// ─── Types ────────────────────────────────────────────────────────────────────
type PortalView = "home" | "catalog" | "detail" | "cart" | "dashboard"
type CatalogMode = "all" | "equipment" | "materials_services"
// ─── Utilities ────────────────────────────────────────────────────────────────
function fmt(v: number | null | undefined, currency = "DOP") {
 if (v === null || v === undefined) return "Pendiente"
 return new Intl.NumberFormat("es-DO", { style: "currency", currency, maximumFractionDigits: 0 }).format(v)
}
function fmtDate(v: string | null | undefined) {
 if (!v) return ""
 return new Intl.DateTimeFormat("es-DO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v))
}
const STATUS_LABELS: Record<string, string> = {
 recibida: "Recibida", en_revision: "En revisión", cotizada: "Cotizada",
 pendiente_cliente: "Pendiente aprobación", aprobada_cliente: "Aprobada",
 rechazada_cliente: "Rechazada", proforma_generada: "Proforma generada",
 factura_solicitada: "Factura solicitada", facturada: "Facturada",
 en_ejecucion: "En ejecución", completada: "Completada", cancelada: "Cancelada",
 pendiente_revision: "Pendiente revisión", aplicado: "Aplicado", rechazado: "Rechazado",
}
const statusLabel = (s: string) => STATUS_LABELS[s] || s
const STATUS_COLORS: Record<string, string> = {
 recibida: "bg-blue-500/20 text-blue-400", en_revision: "bg-yellow-500/20 text-yellow-400",
 cotizada: "bg-purple-500/20 text-purple-400", aprobada_cliente: "bg-green-500/20 text-green-400",
 rechazada_cliente: "bg-red-500/20 text-red-400", facturada: "bg-emerald-500/20 text-emerald-400",
 completada: "bg-green-500/20 text-green-400", cancelada: "bg-gray-500/20 text-zinc-600 dark:text-gray-400",
 pendiente_cliente: "bg-orange-500/20 text-orange-400",
 pendiente_revision: "bg-orange-500/20 text-orange-400", aplicado: "bg-green-500/20 text-green-400",
 rechazado: "bg-red-500/20 text-red-400",
}
const statusColor = (s: string) => STATUS_COLORS[s] || "bg-gray-500/20 text-zinc-600 dark:text-gray-400"
const normalizeText = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
const isEquipmentAvailable = (equipment: AlitoEquipment) =>
 !equipment.estado ||
 equipment.estado.toLowerCase().includes("activo") ||
 equipment.estado.toLowerCase().includes("disponible")
const isMaterialOrService = (item: AlitoCatalogItem) =>
 item.family_code === "materiales" ||
 item.family_code === "bote_traslado" ||
 item.item_type === "servicio" ||
 item.item_type === "compuesto"
const CATEGORIES = [
 { id: "Excavadoras", icon: <Truck className="h-4 w-4" />, count: 6, img: "/alito-catalog/EXC-CAT320.png" },
 { id: "Minicargadores", icon: <Truck className="h-4 w-4" />, count: 9, img: "/alito-catalog/MCG-CAT236D.png" },
 { id: "Miniretro", icon: <ShieldCheck className="h-4 w-4" />, count: 3, img: "/alito-catalog/MRT-CAT305.png" },
 { id: "Retropalas", icon: <ShieldCheck className="h-4 w-4" />, count: 4, img: "/alito-catalog/RTP-CAT416.png" },
 { id: "Rodillos", icon: <Truck className="h-4 w-4" />, count: 3, img: "/alito-catalog/ROD-CAT27.png" },
 { id: "Camiones", icon: <Truck className="h-4 w-4" />, count: 11, img: "/alito-catalog/CAM-SNT22.png" },
 { id: "Montacargas", icon: <ShieldCheck className="h-4 w-4" />, count: 1, img: "/alito-catalog/MCF-CAT.png" },
 { id: "Telehandler", icon: <ShieldCheck className="h-4 w-4" />, count: 1, img: "/alito-catalog/TLH-JLG943.png" },
 { id: "Tractor de Orugas", icon: <ShieldCheck className="h-4 w-4" />, count: 2, img: "/alito-catalog/TRC-CATD6.png" },
]
// Hero rotating equipment
const HERO_EQUIPMENT = [
 { img: "/alito-catalog/EXC-CAT333.png", name: "Excavadora CAT 333-07", spec: "33 T · Clase pesada" },
 { img: "/alito-catalog/EXC-CAT326.png", name: "Excavadora CAT 326-07", spec: "26 T · Clase media" },
 { img: "/alito-catalog/MCG-CAT236D.png",name: "Minicargador CAT 236D", spec: "Versátil · Operador incluido" },
 { img: "/alito-catalog/CAM-SNT22.png", name: "Sinotruk HOWO 22 m³", spec: "22 m³ · Transporte pesado" },
 { img: "/alito-catalog/RTP-CAT416.png", name: "Retropala CAT 416-07", spec: "7.5 T · Obra general" },
 { img: "/alito-catalog/TRC-CATD6.png", name: "Tractor CAT D6", spec: "Potencia máxima · Especializado" },
]
const MATERIALS = [
 { name: "Arena Gruesa", img: "/alito-catalog/MAT-ARENA-GRUESA.png", unit: "m³ / viaje" },
 { name: "Arena Caliza", img: "/alito-catalog/MAT-ARENA-CALIZA.png", unit: "m³ / viaje" },
 { name: "Grava", img: "/alito-catalog/MAT-GRAVA.png", unit: "m³ / viaje" },
 { name: "Grava Triturada", img: "/alito-catalog/MAT-GRAVA-TRIT.png", unit: "m³ / viaje" },
 { name: "Caliche", img: "/alito-catalog/MAT-CALICHE.png", unit: "m³ / viaje" },
 { name: "Relleno", img: "/alito-catalog/MAT-RELLENO.png", unit: "m³ / viaje" },
]
const PROCESS_STEPS = [
 { n: 1, label: "Subir requerimiento", icon: Upload },
 { n: 2, label: "Recibir cotización", icon: FileSearch },
 { n: 3, label: "Aprobación", icon: CircleCheckBig },
 { n: 4, label: "Proforma", icon: FileText },
 { n: 5, label: "Factura", icon: ReceiptText },
 { n: 6, label: "Documentos", icon: FolderOpen },
]
const EMPTY_CUSTOMER: AlitoCustomerPayload = { nombre: "", email: "", telefono: "", documento: "", direccion: "", pais: "DO" }
// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className, intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
 const ref = useRef<HTMLDivElement>(null)
 const x = useMotionValue(0)
 const y = useMotionValue(0)
 const rotX = useSpring(useTransform(y, [-80, 80], [intensity, -intensity]), { stiffness: 200, damping: 30 })
 const rotY = useSpring(useTransform(x, [-80, 80], [-intensity, intensity]), { stiffness: 200, damping: 30 })
 const shine = useTransform(x, [-80, 80], ["rgba(240,193,89,0.0)", "rgba(240,193,89,0.06)"])
 const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!ref.current) return
 const r = ref.current.getBoundingClientRect()
 x.set(e.clientX - r.left - r.width / 2)
 y.set(e.clientY - r.top - r.height / 2)
 }
 const onLeave = () => { x.set(0); y.set(0) }
 return (
 <motion.div ref={ref} style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
 onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
 <motion.div style={{ background: shine }}
 className="absolute inset-0 rounded-2xl z-10 pointer-events-none transition-all" />
 {children}
 </motion.div>
 )
}
// ─── Particle Field ───────────────────────────────────────────────────────────
function seededUnit(index: number, salt: number) {
 const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
 return value - Math.floor(value)
}
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024
const WIZARD_EXTENSIONS = new Set(["pdf", "dwg", "jpg", "jpeg", "png"])
const WIZARD_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/pjpeg", "image/x-png", "image/webp", "image/*", "application/acad", "application/x-acad", "application/autocad_dwg", "image/vnd.dwg", "drawing/dwg"])
const PAYMENT_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"])
const PAYMENT_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/pjpeg", "image/x-png", "image/webp", "image/*"])
function getFileExtension(fileName: string) {
 const parts = fileName.toLowerCase().split(".")
 return parts.length > 1 ? parts.at(-1) || "" : ""
}
function validateUploadFile(file: File, options: { allowedExtensions: Set<string>; allowedMimeTypes: Set<string>; maxBytes?: number }) {
 const ext = getFileExtension(file.name)
 const mime = file.type.toLowerCase()
 const extAllowed = options.allowedExtensions.has(ext)
 const mimeAllowed = !mime || options.allowedMimeTypes.has(mime) || (mime.startsWith("image/") && options.allowedMimeTypes.has("image/*"))
 if (!extAllowed && !mimeAllowed) {
 return `Formato no permitido para ${file.name}.`
 }
 if (options.maxBytes && file.size > options.maxBytes) {
 return `${file.name} supera el maximo de 20MB.`
 }
 return null
}
function triggerFileDownload(url: string, fileName?: string | null) {
 const anchor = document.createElement("a")
 anchor.href = url
 if (fileName) anchor.download = fileName
 anchor.rel = "noopener noreferrer"
 anchor.target = "_blank"
 document.body.appendChild(anchor)
 anchor.click()
 anchor.remove()
}
// ─── Main Portal ──────────────────────────────────────────────────────────────
export default function AlitoPortal() {
 const [view, setView] = useState<PortalView>("home")
 const [catalog, setCatalog] = useState<AlitoCatalogItem[]>([])
 const [equipment, setEquipment] = useState<AlitoEquipment[]>([])
 const [quoteItems, setQuoteItems] = useState<AlitoQuoteItemInput[]>([])
 const [session, setSession] = useState<AlitoAuthSession | null>(null)
 const [resolvedSession, setResolvedSession] = useState<AlitoResolvedSession | null>(null)
 const [requests, setRequests] = useState<AlitoQuoteRequest[]>([])
 const [paymentProofs, setPaymentProofs] = useState<AlitoPaymentProof[]>([])
 const [portalSummary, setPortalSummary] = useState<AlitoClientPortalSummary | null>(null)
 const [customer, setCustomer] = useState<AlitoCustomerPayload>(EMPTY_CUSTOMER)
 const [project, setProject] = useState({ location: "", notes: "" })
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(false)
 const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)
 const [selectedEquipment, setSelectedEquipment] = useState<AlitoEquipment | null>(null)
 const [selectedCatalogItem, setSelectedCatalogItem] = useState<AlitoCatalogItem | null>(null)
 const [approvalRequest, setApprovalRequest] = useState<AlitoQuoteRequest | null>(null)
 const [paymentDoc, setPaymentDoc] = useState<AlitoClientPortalDocument | null>(null)
 const [authMode, setAuthMode] = useState<"login" | "register">("login")
 const [authForm, setAuthForm] = useState({ nombre: "", email: "", password: "" })
 const [catFilter, setCatFilter] = useState<string>("Todos")
 const [catalogMode, setCatalogMode] = useState<CatalogMode>("all")
 const [loadError, setLoadError] = useState<string | null>(null)
 const isClient = resolvedSession?.kind === "client" || resolvedSession?.kind === "client_unregistered"
 const showToast = (msg: string, type: "ok" | "err" = "ok") => {
 setToast({ msg, type })
 setTimeout(() => setToast(null), 4000)
 }
 const loadPortal = useCallback(async (knownSession = getStoredAlitoSession()) => {
 setLoading(true)
 setLoadError(null)
 try {
 setSession(knownSession)
 const [catalogResult, resolved] = await Promise.all([
 fetchAlitoPublicCatalog(),
 resolveAlitoSession(knownSession).catch(() => ({ kind: "anon" as const, user: null, profile: null })),
 ])
 const { catalog: c, equipment: e } = catalogResult
 setCatalog(c)
 setEquipment(e)
 setResolvedSession(resolved)
 if (resolved.profile) {
 setCustomer({
 nombre: resolved.profile.nombre || "",
 email: resolved.profile.email || resolved.user?.email || "",
 telefono: resolved.profile.telefono || "",
 documento: resolved.profile.documento || "",
 direccion: resolved.profile.direccion || "",
 pais: "DO",
 })
 } else if (resolved.user?.email) {
 setCustomer(cur => ({ ...cur, email: resolved.user?.email || "" }))
 }
 if (resolved.kind === "client") {
 const [reqs, summary, proofs] = await Promise.all([
 fetchMyAlitoQuoteRequests(knownSession),
 fetchAlitoClientPortalSummary(knownSession),
 fetchMyAlitoPaymentProofs(knownSession),
 ])
 setRequests(reqs); setPortalSummary(summary); setPaymentProofs(proofs)
 } else if (resolved.kind === "client_unregistered") {
 setRequests(await fetchMyAlitoQuoteRequests(knownSession))
 setPortalSummary(null); setPaymentProofs([])
 } else {
 setRequests([]); setPortalSummary(null); setPaymentProofs([])
 }
 } catch (err) {
 const message = err instanceof Error ? err.message : "Error cargando portal"
 setLoadError(message)
 showToast(message, "err")
 } finally {
 setLoading(false)
 }
 }, [])
 useEffect(() => { void loadPortal() }, [loadPortal])
 const addItem = (item: AlitoQuoteItemInput) => {
 setQuoteItems(cur => [...cur, item])
 showToast("Añadido a tu cotización ✓")
 }
 const handleDashboardDocumentDownload = useCallback(async (doc: AlitoClientPortalDocument) => {
 try {
 if (doc.document_url) {
 triggerFileDownload(doc.document_url, doc.number ? `${doc.number}.pdf` : null)
 return
 }
 if (session && doc.quote_request_id) {
 await downloadAlitoClientDocument({
 quoteRequestId: doc.quote_request_id,
 fileName: doc.number ? `${doc.number}.pdf` : null,
 session,
 })
 return
 }
 showToast("Este documento no tiene descarga disponible todavía.", "err")
 } catch (err) {
 showToast(err instanceof Error ? err.message : "No se pudo descargar el documento", "err")
 }
 }, [session, showToast])
 const handleAuth = async () => {
 if (!authForm.email || !authForm.password) { showToast("Correo y contraseña requeridos", "err"); return }
 setSubmitting(true)
 try {
 let next = session
 let registration: Awaited<ReturnType<typeof registerAlitoClient>> | null = null
 if (authMode === "register") {
 const r = await signUpAlitoClient({ email: authForm.email, password: authForm.password, nombre: authForm.nombre || authForm.email })
 if (r.access_token && r.user) { next = { access_token: r.access_token, refresh_token: r.refresh_token, user: r.user }; storeAlitoSession(next) }
 else { showToast("Cuenta creada. Confirma tu correo e inicia sesión."); return }
 } else {
 next = await signInAlitoClient({ email: authForm.email, password: authForm.password })
 }
 const nc = { ...customer, nombre: customer.nombre || authForm.nombre || authForm.email, email: customer.email || authForm.email }
 setCustomer(nc)
 if (next) {
 registration = await registerAlitoClient(nc, next, {
 allow_create_cliente: authMode === "register",
 })
 }
 if (authMode === "register" && registration?.profile?.estado === "pendiente") {
 showToast("Cuenta creada. Tu perfil quedó pendiente de vinculación comercial.")
 } else {
 showToast(authMode === "register" ? "Cuenta lista" : "Bienvenido de vuelta ✓")
 }
 await loadPortal(next)
 } catch (err) { showToast(err instanceof Error ? err.message : "Error de autenticación", "err") }
 finally { setSubmitting(false) }
 }
 const handleSubmitQuote = async () => {
 if (submitting) return
 const normalizedCustomer: AlitoCustomerPayload = {
 ...customer,
 nombre: (customer.nombre || "").trim(),
 email: (customer.email || "").trim().toLowerCase(),
 telefono: (customer.telefono || "").trim(),
 documento: (customer.documento || "").trim(),
 direccion: (customer.direccion || "").trim(),
 pais: customer.pais || "DO",
 }
 const normalizedProject = {
 location: (project.location || "").trim(),
 notes: (project.notes || "").trim(),
 }
 const normalizedItems = quoteItems
 .map((item) => ({
 ...item,
 display_name: (item.display_name || "").trim(),
 quantity: Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1,
 unit: (item.unit || "").trim() || "UNIDAD",
 notes: typeof item.notes === "string" ? item.notes.trim() : item.notes ?? null,
 }))
 .filter((item) => item.display_name.length > 0)
 if (!normalizedCustomer.nombre || !normalizedCustomer.email || !normalizedCustomer.telefono) {
 showToast("Completa nombre, correo y teléfono", "err")
 return
 }
 if (!normalizedProject.location) {
 showToast("Indica la ubicación del proyecto", "err")
 return
 }
 if (normalizedItems.length === 0) {
 showToast("Añade al menos una línea válida (equipo, material o servicio)", "err")
 return
 }
 if (normalizedItems.some((item) => !item.quantity || item.quantity <= 0)) {
 showToast("Cada línea debe tener una cantidad mayor que 0", "err")
 return
 }
 setSubmitting(true)
 try {
 const r = await submitAlitoQuoteRequest({
 customer: normalizedCustomer,
 project: normalizedProject,
 items: normalizedItems,
 preferred_contact_method: "telefono_correo",
 session,
 })
 showToast(`Solicitud enviada: ${r.quote.correlation_id}`)
 setQuoteItems([]); setProject({ location: "", notes: "" })
 await loadPortal(session)
 setView("dashboard")
 } catch (err) { showToast(err instanceof Error ? err.message : "Error enviando solicitud", "err") }
 finally { setSubmitting(false) }
 }
 const handleSignOut = () => {
 storeAlitoSession(null); setSession(null)
 setResolvedSession({ kind: "guest", user: null })
 setRequests([]); setPortalSummary(null); setPaymentProofs([])
 showToast("Sesión cerrada")
 }
 const filteredEquipment = useMemo(() => {
 if (catFilter === "Todos") return equipment
 return equipment.filter(e => {
 const img = getEquipmentImage(e)
 if (img?.family === catFilter) return true
 if (e.family === catFilter) return true
 if (normalizeText((e.family || "").replace(/s$/, "")) === normalizeText(catFilter.replace(/s$/, ""))) return true
 return false
 })
 }, [equipment, catFilter])
 const navigateTo = (v: PortalView) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }) }
 return (
 <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
 {/* Toast */}
 <AnimatePresence>
 {toast && (
 <motion.div
 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
 className={`fixed top-20 right-4 z-[200] rounded-2xl px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl border
 ${toast.type === "ok" ? "bg-emerald-50/90 text-emerald-800 border-emerald-200 " : "bg-red-50/90 text-red-800 border-red-200 "}`}
 >
 {toast.msg}
 </motion.div>
 )}
 </AnimatePresence>
 <PremiumHeader view={view} onNavigate={navigateTo} cartCount={quoteItems.length} isClient={isClient} onSignOut={handleSignOut} resolvedSession={resolvedSession} />
 {loadError && (
 <div className="fixed bottom-6 right-6 z-[150] flex items-center gap-3 rounded-2xl bg-zinc-950/95 backdrop-blur-xl px-4 py-2.5 text-xs text-zinc-300 shadow-2xl shadow-zinc-900/40 border border-zinc-800 max-w-xs">
 <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
 <span className="flex-1 leading-snug">Sin conexión al catálogo</span>
 <button
 type="button"
 onClick={() => void loadPortal(session)}
 className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-zinc-200 hover:text-white transition-colors font-bold whitespace-nowrap"
 >
 Reintentar
 </button>
 </div>
 )}
 {loading && (
 <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-3">
 <div className="text-xs text-zinc-400 ">Sincronizando catálogo y estado del cliente...</div>
 </div>
 )}
 <AnimatePresence mode="wait">
 <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
 {view === "home" && (
 <HomeView equipment={equipment} catalog={catalog} onNavigate={navigateTo}
 onAddItem={addItem} onSelectEquipment={(e) => { setSelectedEquipment(e); setSelectedCatalogItem(null); navigateTo("detail") }} />
 )}
 {view === "catalog" && (
 <CatalogView equipment={equipment} catalog={catalog} quoteItems={quoteItems}
 onAddItem={addItem} onRemoveItem={i => setQuoteItems(cur => cur.filter((_, idx) => idx !== i))}
 onSelectEquipment={(e) => { setSelectedEquipment(e); setSelectedCatalogItem(null); navigateTo("detail") }}
 onSelectCatalogItem={(item) => { setSelectedCatalogItem(item); setSelectedEquipment(null); navigateTo("detail") }}
 onNavigate={navigateTo} catFilter={catFilter} onCatFilter={setCatFilter} catalogMode={catalogMode} onCatalogMode={setCatalogMode}
 filteredEquipment={filteredEquipment} />
 )}
 {view === "detail" && selectedEquipment && (
 <DetailView equipment={selectedEquipment} onNavigate={navigateTo} onAddItem={addItem} />
 )}
 {view === "detail" && !selectedEquipment && selectedCatalogItem && (
 <CatalogDetailView item={selectedCatalogItem} onNavigate={navigateTo} onAddItem={addItem} />
 )}
 {view === "cart" && (
 <CartView quoteItems={quoteItems} customer={customer} project={project}
 onUpdateItem={(i, p) => setQuoteItems(cur => cur.map((it, idx) => idx === i ? { ...it, ...p } : it))}
 onRemoveItem={i => setQuoteItems(cur => cur.filter((_, idx) => idx !== i))}
 onAddFree={() => setQuoteItems(cur => [...cur, { display_name: "", quantity: 1, unit: "DÍA" }])}
 onCustomerChange={setCustomer} onProjectChange={setProject}
 onSubmit={handleSubmitQuote} submitting={submitting} onNavigate={navigateTo}
 showToast={showToast} />
 )}
 {view === "dashboard" && (
 <DashboardView requests={requests} paymentProofs={paymentProofs} portalSummary={portalSummary}
 session={session} resolvedSession={resolvedSession} customer={customer}
 authMode={authMode} authForm={authForm}
 onAuthModeChange={setAuthMode} onAuthFormChange={setAuthForm}
 onAuth={handleAuth} submitting={submitting}
 onSignOut={handleSignOut} onNavigate={navigateTo}
 onApprove={setApprovalRequest} onPaymentDoc={setPaymentDoc}
 onDownloadDocument={handleDashboardDocumentDownload}
 loading={loading} isClient={isClient} />
 )}
 </motion.div>
 </AnimatePresence>
 <PremiumFooter />
 {approvalRequest && (
 <ApprovalModal request={approvalRequest} customer={customer} session={session}
 onClose={() => setApprovalRequest(null)}
 onDone={async () => { setApprovalRequest(null); await loadPortal(session) }}
 showToast={showToast} />
 )}
 {paymentDoc && (
 <PaymentModal doc={paymentDoc} requests={requests} session={session}
 onClose={() => setPaymentDoc(null)}
 onDone={async () => { setPaymentDoc(null); await loadPortal(session) }}
 showToast={showToast} />
 )}
 </div>
 )
}
// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ view, onNavigate, cartCount, isClient, onSignOut, resolvedSession }: { view: PortalView; onNavigate: (v: PortalView) => void; cartCount: number; isClient: boolean; onSignOut: () => void; resolvedSession: AlitoResolvedSession | null }) {
 const [mobileOpen, setMobileOpen] = useState(false)
 const navLinks: { label: string; view: PortalView }[] = [
 { label: "Inicio", view: "home" },
 { label: "Catálogo", view: "catalog" },
 { label: "Cotización", view: "cart" },
 { label: "Mi panel", view: "dashboard" },
 ]
 return (
 <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-700/5 bg-white dark:bg-[#0a0a0a]/96 backdrop-blur-xl">
 <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3">
 {/* Logo */}
 <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 flex-shrink-0">
 <img src="/alito-logo.png" alt="ALITO" className="h-9 w-auto" />
 <div className="hidden sm:block">
 <div className="text-xs font-black text-zinc-900 dark:text-white leading-none">ALITO GROUP</div>
 <div className="text-[10px] text-zinc-500 dark:text-gray-500 leading-none mt-0.5">Equipos · Materiales</div>
 </div>
 </button>
 {/* Desktop nav */}
 <nav className="hidden items-center gap-0.5 md:flex">
 {navLinks.map(l => (
 <button key={l.view} onClick={() => onNavigate(l.view)}
 className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all
 ${view === l.view
 ? "text-[#f0c159]"
 : "text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white"}`}>
 {l.label}
 {view === l.view && (
 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-[#f0c159]" />
 )}
 </button>
 ))}
 </nav>
 {/* Right actions */}
 <div className="flex items-center gap-2">
 {isClient ? (
 <div className="hidden items-center gap-2 md:flex">
 <div className="text-right">
 <div className="text-xs font-semibold text-zinc-900 dark:text-white leading-none">{resolvedSession?.profile?.nombre || "Cliente"}</div>
 <div className="text-[10px] text-green-400 leading-none mt-0.5">● Conectado</div>
 </div>
 <button onClick={onSignOut}
 className="rounded-lg border border-white dark:border-zinc-700/10 px-3 py-1.5 text-xs text-zinc-600 dark:text-gray-400 hover:border-red-500/30 hover:text-red-400 transition-colors">
 Salir
 </button>
 </div>
 ) : (
 <button onClick={() => onNavigate("dashboard")}
 className="hidden rounded-lg border border-white dark:border-zinc-700/10 px-3 py-2 text-xs text-zinc-600 dark:text-gray-400 hover:border-[#f0c159]/40 hover:text-zinc-900 dark:text-white md:block transition-colors">
 Mi cuenta
 </button>
 )}
 <button onClick={() => onNavigate("cart")}
 className="relative rounded-xl border border-white dark:border-zinc-700/10 p-2.5 text-zinc-600 dark:text-gray-400 hover:border-[#f0c159]/40 hover:text-zinc-900 dark:text-white transition-colors">
 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
 </svg>
 {cartCount > 0 && (
 <motion.span
 initial={{ scale: 0 }} animate={{ scale: 1 }}
 className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f0c159] text-[9px] font-black text-black">
 {cartCount}
 </motion.span>
 )}
 </button>
 <button onClick={() => onNavigate("cart")}
 className="glow-btn rounded-xl bg-[#f0c159] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#e5b84a] transition-colors">
 Cotizar
 </button>
 <button className="md:hidden text-zinc-600 dark:text-gray-400 p-1" onClick={() => setMobileOpen(v => !v)}>
 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
 </svg>
 </button>
 </div>
 </div>
 {/* Mobile nav */}
 <AnimatePresence>
 {mobileOpen && (
 <motion.div
 initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700/5 bg-white dark:bg-[#0a0a0a] px-4 md:hidden">
 <div className="py-3 space-y-0.5">
 {navLinks.map(l => (
 <button key={l.view} onClick={() => { onNavigate(l.view); setMobileOpen(false) }}
 className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors
 ${view === l.view ? "bg-[#f0c159]/10 text-[#f0c159]" : "text-zinc-700 dark:text-gray-300 hover:bg-white/5 dark:bg-zinc-900/5"}`}>
 {l.label}
 </button>
 ))}
 {isClient && (
 <button onClick={() => { onSignOut(); setMobileOpen(false) }}
 className="block w-full rounded-xl px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10">
 Cerrar sesión
 </button>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </header>
 )
}
// ─── Home View ────────────────────────────────────────────────────────────────
function HomeView({ equipment, catalog, onNavigate, onAddItem, onSelectEquipment }:
 { equipment: AlitoEquipment[]; catalog: AlitoCatalogItem[]; onNavigate: (v: PortalView) => void;
 onAddItem: (i: AlitoQuoteItemInput) => void; onSelectEquipment: (e: AlitoEquipment) => void }) {
 return (
 <div>
 <PremiumHeroSection onNavigate={onNavigate} />
 <PremiumStatsBar />
 <PremiumCategoryCarousel onNavigate={onNavigate} />
 <PremiumServicesSection onNavigate={onNavigate} />

 <PremiumProcessSection onNavigate={onNavigate} />
 <FeaturedEquipment equipment={equipment.slice(0, 8)} onSelect={onSelectEquipment} onNavigate={onNavigate} />
 </div>
 )
}
function FeaturedEquipment({ equipment, onSelect, onNavigate }:
 { equipment: AlitoEquipment[]; onSelect: (e: AlitoEquipment) => void; onNavigate: (v: PortalView) => void }) {
 if (equipment.length === 0) return null
 return (
 <section className="py-20 border-t border-zinc-100 dark:border-zinc-800/50 ">
 <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
 <div className="flex items-end justify-between mb-10">
 <div>
 <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 ">Flota disponible</div>
 <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Equipos Destacados</h2>
 <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 ">Flota propia, certificada y lista para tu proyecto</p>
 </div>
 <button onClick={() => onNavigate("catalog")}
 className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-amber-600 :text-amber-400 transition-colors">
 Ver todos →
 </button>
 </div>
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {equipment.map((e, i) => (
 <motion.div key={e.ficha}
 initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
 viewport={{ once: true }}
 transition={{ duration:0.4, delay: i * 0.07 }}>
 <EquipmentCard equipment={e} onSelect={onSelect} onAddItem={() => {}} compact />
 </motion.div>
 ))}
 </div>
 <div className="mt-10 text-center">
 <button onClick={() => onNavigate("catalog")}
 className="rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 px-8 py-3.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:border-amber-400 :border-amber-500/40 hover:text-amber-700 :text-amber-400 transition-all duration-300">
 Ver catálogo completo ({equipment.length}+ equipos) →
 </button>
 </div>
 </div>
 </section>
 )
}
// ─── Catalog View ─────────────────────────────────────────────────────────────
function CatalogView({ equipment, catalog, quoteItems, onAddItem, onRemoveItem, onSelectEquipment, onSelectCatalogItem, onNavigate, catFilter, onCatFilter, catalogMode, onCatalogMode, filteredEquipment }:
 { equipment: AlitoEquipment[]; catalog: AlitoCatalogItem[]; quoteItems: AlitoQuoteItemInput[]; onAddItem: (i: AlitoQuoteItemInput) => void;
 onRemoveItem: (i: number) => void; onSelectEquipment: (e: AlitoEquipment) => void; onSelectCatalogItem: (item: AlitoCatalogItem) => void;
 onNavigate: (v: PortalView) => void; catFilter: string; onCatFilter: (c: string) => void; catalogMode: CatalogMode; onCatalogMode: (v: CatalogMode) => void; filteredEquipment: AlitoEquipment[] }) {
 const [avail, setAvail] = useState<"all" | "now">("all")
 const [search, setSearch] = useState("")
 const displayedEquipment = useMemo(() => {
 let res = filteredEquipment
 if (avail === "now") res = res.filter((item) => isEquipmentAvailable(item))
 if (search.trim()) {
 const query = normalizeText(search)
 res = res.filter((item) => normalizeText(`${item.display_name} ${item.marca || ""} ${item.modelo || ""} ${item.family || ""}`).includes(query))
 }
 return res
 }, [filteredEquipment, search, avail])
 const materialServiceItems = useMemo(() => {
 let res = catalog.filter((item) => isMaterialOrService(item))
 if (search.trim()) {
 const query = normalizeText(search)
 res = res.filter((item) => normalizeText(`${item.display_name} ${item.family_name || ""} ${item.subfamily || ""}`).includes(query))
 }
 return res
 }, [catalog, search])
 const showEquipment = catalogMode !== "materials_services"
 const showMaterialsServices = catalogMode !== "equipment"
 const visibleCards = (showEquipment ? displayedEquipment.length : 0) + (showMaterialsServices ? materialServiceItems.length : 0)
 const totalEquipment = equipment.length
 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-[#080808]">
 {/* Page header strip */}
 <div className="border-b border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/80 backdrop-blur-xl">
 <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
 <button onClick={() => onNavigate("home")} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Inicio</button>
 <span className="text-zinc-300 dark:text-zinc-700">/</span>
 <span className="text-zinc-600 dark:text-zinc-300 font-medium">Catálogo</span>
 </div>
 <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
 Catálogo ALITO
 {catFilter !== "Todos" && <span className="ml-2 text-amber-500">{catFilter}</span>}
 </h1>
 </div>
 {/* Search bar in header */}
 <div className="relative flex-1 max-w-lg min-w-[240px]">
 <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Buscar equipos, materiales o servicios..."
 className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pl-11 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
 />
 {search && (
 <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors text-lg leading-none">×</button>
 )}
 </div>
 </div>
 </div>

 <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
 {/* ── Sidebar ── */}
 <aside className="hidden w-60 flex-shrink-0 lg:block">
 <div className="sticky top-24 rounded-3xl bg-zinc-950 dark:bg-zinc-900 overflow-hidden shadow-2xl shadow-zinc-900/20">
 {/* Sidebar header */}
 <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Filtros</span>
 <button
 onClick={() => { onCatFilter("Todos"); onCatalogMode("all"); setAvail("all"); setSearch("") }}
 className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
 >
 Limpiar
 </button>
 </div>
 </div>

 {/* Categories */}
 <div className="px-3 py-4 border-b border-zinc-800">
 <div className="px-2 mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Categorías</div>
 <button
 onClick={() => onCatFilter("Todos")}
 className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 mb-0.5 text-sm font-medium transition-all duration-200 ${catFilter === "Todos" ? "bg-amber-400 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
 >
 <span>Todos</span>
 <span className={`text-xs font-black rounded-full px-2 py-0.5 ${catFilter === "Todos" ? "bg-zinc-950/20 text-zinc-900" : "bg-zinc-800 text-zinc-500"}`}>{totalEquipment}</span>
 </button>
 {CATEGORIES.map(c => (
 <button
 key={c.id}
 onClick={() => onCatFilter(c.id)}
 className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 mb-0.5 text-sm font-medium transition-all duration-200 ${catFilter === c.id ? "bg-amber-400 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
 >
 <span>{c.id}</span>
 <span className={`text-xs font-black rounded-full px-2 py-0.5 ${catFilter === c.id ? "bg-zinc-950/20 text-zinc-900" : "bg-zinc-800 text-zinc-500"}`}>{c.count}</span>
 </button>
 ))}
 </div>

 {/* Type filter */}
 <div className="px-3 py-4 border-b border-zinc-800">
 <div className="px-2 mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Tipo</div>
 <div className="flex flex-col gap-1">
 {([
 { id: "all" as CatalogMode, label: "Todo" },
 { id: "equipment" as CatalogMode, label: "Equipos" },
 { id: "materials_services" as CatalogMode, label: "Materiales" },
 ] as { id: CatalogMode; label: string }[]).map((opt) => (
 <button
 key={opt.id}
 onClick={() => onCatalogMode(opt.id)}
 className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all duration-200 ${catalogMode === opt.id ? "bg-amber-400 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
 >
 <span className={`h-2 w-2 rounded-full flex-shrink-0 ${catalogMode === opt.id ? "bg-zinc-950" : "bg-zinc-700"}`} />
 {opt.label}
 </button>
 ))}
 </div>
 </div>

 {/* Availability */}
 <div className="px-3 py-4">
 <div className="px-2 mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Disponibilidad</div>
 <div className="flex flex-col gap-1">
 {(["Todos", "Solo disponibles"] as const).map((o, i) => {
 const active = i === 0 ? avail === "all" : avail === "now"
 return (
 <button
 key={o}
 onClick={() => setAvail(i === 0 ? "all" : "now")}
 className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all duration-200 ${active ? "bg-amber-400 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
 >
 <span className={`h-2 w-2 rounded-full flex-shrink-0 ${active ? "bg-zinc-950" : "bg-zinc-700"}`} />
 {o}
 </button>
 )
 })}
 </div>
 </div>
 </div>
 </aside>

 {/* ── Main content ── */}
 <div className="min-w-0 flex-1">
 {/* Results count + active filter pill */}
 <div className="flex items-center gap-3 mb-5">
 <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
 {visibleCards === 0 ? "Sin resultados" : `${visibleCards} equipo${visibleCards !== 1 ? "s" : ""}`}
 </span>
 {catFilter !== "Todos" && (
 <button
 onClick={() => onCatFilter("Todos")}
 className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-400/25 transition-colors"
 >
 {catFilter}
 <span className="text-amber-500 leading-none">×</span>
 </button>
 )}
 {search && (
 <button
 onClick={() => setSearch("")}
 className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
 >
 "{search}"
 <span className="leading-none">×</span>
 </button>
 )}
 </div>

 <div className="flex gap-5 items-start">
 {/* Cards grid */}
 <div className={`grid gap-5 flex-1 ${quoteItems.length > 0 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
 {visibleCards === 0 ? (
 <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
 <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
 <FileSearch className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
 </div>
 <div className="text-center">
 <div className="text-base font-bold text-zinc-700 dark:text-zinc-300 mb-1">
 {search ? `Sin resultados para "${search}"` : "No hay equipos en esta categoría"}
 </div>
 <div className="text-sm text-zinc-400 dark:text-zinc-500">
 {search ? "Intenta con otro término de búsqueda" : "Selecciona otra categoría o contáctanos"}
 </div>
 </div>
 <button
 onClick={() => { onCatFilter("Todos"); setSearch(""); onCatalogMode("all") }}
 className="rounded-full bg-zinc-950 dark:bg-white px-6 py-2.5 text-sm font-bold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
 >
 Ver todos los equipos
 </button>
 </div>
 ) : (
 <>
 {showEquipment && displayedEquipment.map(e => (
 <EquipmentCard key={e.ficha} equipment={e} onSelect={onSelectEquipment} onAddItem={item => onAddItem(item)} />
 ))}
 {showMaterialsServices && materialServiceItems.map(item => (
 <CatalogItemCard key={item.item_code} item={item} onSelect={() => onSelectCatalogItem(item)} onAdd={() => onAddItem(buildCatalogQuoteItem(item))} />
 ))}
 </>
 )}
 </div>

 {/* Floating quote cart */}
 {quoteItems.length > 0 && (
 <div className="hidden w-64 flex-shrink-0 xl:block">
 <div className="sticky top-24 rounded-3xl bg-zinc-950 dark:bg-zinc-900 overflow-hidden shadow-2xl shadow-zinc-900/20 p-5">
 <div className="flex items-center justify-between mb-4">
 <span className="font-black text-white text-sm">Mi Cotización</span>
 <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-zinc-950">{quoteItems.length}</span>
 </div>
 <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
 {quoteItems.map((item, i) => (
 <div key={i} className="flex items-start justify-between gap-2 rounded-xl bg-zinc-800 p-3">
 <div className="min-w-0">
 <div className="truncate text-xs font-semibold text-white">{item.display_name}</div>
 <div className="text-[10px] text-zinc-400 mt-0.5">{item.quantity} {item.unit}</div>
 </div>
 <button onClick={() => onRemoveItem(i)} className="text-zinc-500 hover:text-red-400 flex-shrink-0 text-sm transition-colors">✕</button>
 </div>
 ))}
 </div>
 <button onClick={() => onNavigate("cart")} className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-black text-zinc-950 hover:bg-amber-300 transition-colors mb-2">
 Ver cotización →
 </button>
 <button onClick={() => onNavigate("cart")} className="w-full rounded-2xl border border-zinc-700 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
 Solicitar cotización
 </button>
 <div className="mt-4 rounded-2xl bg-zinc-800 p-3 text-xs text-zinc-400">
 <div className="font-bold text-zinc-300 mb-1">¿Necesitas asesoría?</div>
 <div>Nuestro equipo te ayuda a elegir el equipo ideal.</div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )
}
// ─── Shared 3D Premium Components ─────────────────────────────────────────────
function PremiumTiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"])
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative h-full transition-all duration-300 hover:z-20 perspective-1000 group ${className || ""}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full relative overflow-hidden rounded-[1.5rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl border border-white dark:border-zinc-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_30px_60px_-15px_rgba(245,158,11,0.15)] transition-all duration-500">
        
        {/* Dynamic Glare */}
        <motion.div 
          style={{ x: glareX, y: glareY }}
          className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] bg-gradient-to-tr from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rotate-45 mix-blend-overlay z-50"
        />
        
        {children}
      </div>
    </motion.div>
  )
}
// ─── Equipment Card ────────────────────────────────────────────────────────────
function EquipmentCard({ equipment, onSelect, onAddItem, compact }:
  { equipment: AlitoEquipment; onSelect: (e: AlitoEquipment) => void; onAddItem: (i: AlitoQuoteItemInput) => void; compact?: boolean }) {
  const img = getEquipmentImage(equipment)
  const available = isEquipmentAvailable(equipment)
  
  return (
    <PremiumTiltCard>
      <div className="flex h-full flex-col cursor-pointer" onClick={() => onSelect(equipment)}>
        {/* Top Image Section - Increased Height and Scale */}
        <div className="relative h-72 bg-gradient-to-br from-zinc-50 to-zinc-200/50 dark:from-zinc-900 dark:to-black/30 flex items-center justify-center overflow-hidden border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, rgba(245,158,11,0.1) 0%, transparent 75%)" }} />
          
          {img ? (
            <motion.div style={{ transform: "translateZ(80px)" }} className="relative h-full w-full p-4 flex items-center justify-center pointer-events-none">
              <img src={img.url} alt={equipment.display_name} style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }} className="h-full w-full object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.2)] group-hover:scale-[1.15] transition-transform duration-1000" />
            </motion.div>
          ) : <Box className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />}
          
          {/* Floating Badges (3D Layer) */}
          <div style={{ transform: "translateZ(40px)" }} className="absolute top-4 left-4 z-20">
            {img && <span className="rounded-xl bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border border-white dark:border-zinc-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400 shadow-sm">{img.family}</span>}
          </div>
          <div style={{ transform: "translateZ(40px)" }} className="absolute top-4 right-4 z-20">
            <span className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${available ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              {available ? "DISPONIBLE" : (equipment.estado || "CONSULTAR")}
            </span>
          </div>
        </div>
        {/* Content Section - Redesigned with Gradients and Premium Spacing */}
        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} 
          className="flex flex-col flex-1 p-7 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900/40 dark:to-black/60 backdrop-blur-md">
          <h3 className="font-black text-2xl text-zinc-900 dark:text-zinc-100 leading-[1.1] tracking-tight group-hover:text-amber-500 transition-colors duration-500">{equipment.display_name}</h3>
          
          <div className="mt-4 flex flex-wrap gap-2.5">
 {equipment.class_tonnage && <span className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-[11px] font-bold text-zinc-900 dark:text-zinc-100 shadow-sm">{equipment.class_tonnage} T</span>}
 {equipment.commercial_capacity_m3 && <span className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-[11px] font-bold text-zinc-900 dark:text-zinc-100 shadow-sm">{equipment.commercial_capacity_m3} m³</span>}
 {equipment.placa && <span className="rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/30 px-3 py-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{equipment.placa}</span>}
 </div>
          
 <div className="mt-8 flex gap-3 z-20 relative pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
 <button onClick={(e) => { e.stopPropagation(); onSelect(equipment); }}
 className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-4 text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-amber-400 shadow-sm transition-all duration-300">
 Detalle
 </button>
 <button onClick={(e) => { e.stopPropagation(); onAddItem(buildEquipmentQuoteItem(equipment)); }}
 className="flex-1 rounded-2xl bg-[#f0c159] py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-amber-400 hover:scale-[1.02] shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] transition-all duration-300">
 Cotizar
 </button>
 </div>
            <div className="mt-auto pt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-amber-500 text-xs font-black uppercase tracking-widest">Información detallada →</span>
            </div>
        </div>
      </div>
    </PremiumTiltCard>
  )
}
function CatalogItemCard({ item, onAdd, onSelect }: { item: AlitoCatalogItem; onAdd: () => void; onSelect: () => void }) {
  const img = getCatalogItemImage(item.item_code, item.family_code, item.display_name)
  
  return (
    <PremiumTiltCard>
      <div className="flex h-full flex-col cursor-pointer" onClick={onSelect}>
        <div className="relative h-48 bg-gradient-to-br from-zinc-50 to-zinc-100/50 flex items-center justify-center overflow-hidden border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, rgba(245,158,11,0.05) 0%, transparent 60%)" }} />
          
          {img ? (
            <motion.div style={{ transform: "translateZ(50px)" }} className="relative h-full w-full p-4 pointer-events-none">
              <img src={img.url} alt={item.display_name}
                className="h-full w-full object-cover filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-700 rounded-xl" />
            </motion.div>
          ) : <Box className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />}
          
          <div style={{ transform: "translateZ(40px)" }} className="absolute top-4 left-4">
            <span className="rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-zinc-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shadow-sm">{item.family_name}</span>
          </div>
        </div>
        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-col flex-1 p-6 bg-white/40 dark:bg-zinc-900/40">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-amber-600 transition-colors duration-300">{item.display_name}</h3>
          <div className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item.base_unit} · {item.commercial_modality}</div>
          
          <div className="mt-auto pt-5 relative z-20">
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="w-full rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-amber-500 hover:text-black shadow-md transition-all">
              Añadir a solicitud
            </button>
          </div>
        </div>
      </div>
    </PremiumTiltCard>
  )
}
// ─── Detail View ──────────────────────────────────────────────────────────────
function DetailView({ equipment, onNavigate, onAddItem }:
 { equipment: AlitoEquipment; onNavigate: (v: PortalView) => void; onAddItem: (i: AlitoQuoteItemInput) => void }) {
 const img = getEquipmentImage(equipment)
 const [tab, setTab] = useState<"desc"|"specs"|"apps">("desc")
 const [withOperator, setWithOperator] = useState(true)
 const [withTransport, setWithTransport] = useState(false)
 const available = isEquipmentAvailable(equipment)
 const specs = [
 ["Marca", equipment.marca],
 ["Modelo", equipment.modelo || equipment.normalized_model],
 ["Tonelaje", equipment.class_tonnage ? `${equipment.class_tonnage} T` : null],
 ["Capacidad", equipment.commercial_capacity_m3 ? `${equipment.commercial_capacity_m3} m³` : null],
 ["Categoría", equipment.family],
 ["Ficha/Placa",equipment.placa || equipment.ficha],
 ].filter(([,v]) => v) as [string,string][]
 return (
 <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
 {/* Top breadcrumb + hero gradient strip */}
 <div className="relative border-b border-zinc-200 dark:border-zinc-700/5 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
 <div className="pointer-events-none absolute inset-0 opacity-40"
 style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(240,193,89,0.06) 0%, transparent 60%)" }} />
 <div className="relative mx-auto max-w-screen-xl px-4 py-4">
 <div className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500 dark:text-gray-500">
 <button onClick={() => onNavigate("home")} className="hover:text-zinc-900 dark:text-white transition-colors">Inicio</button>
 <span className="text-gray-700">/</span>
 <button onClick={() => onNavigate("catalog")} className="hover:text-zinc-900 dark:text-white transition-colors">Catálogo</button>
 <span className="text-gray-700">/</span>
 {img && <span className="hover:text-zinc-900 dark:text-white cursor-pointer transition-colors" onClick={() => onNavigate("catalog")}>{img.family}</span>}
 {img && <span className="text-gray-700">/</span>}
 <span className="text-zinc-900 dark:text-white truncate max-w-[200px]">{equipment.display_name}</span>
 </div>
 </div>
 </div>
 <div className="mx-auto max-w-screen-xl px-4 py-8">
 <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
 {/* ── Left panel ── */}
 <div>
 {/* Equipment image showcase */}
 <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
 <TiltCard intensity={3} className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/5 bg-gradient-to-br from-[#141414] to-[#0c0c0c] shadow-2xl">
 {/* Background glow */}
 <div className="pointer-events-none absolute inset-0"
 style={{ background: "radial-gradient(ellipse at center, rgba(240,193,89,0.04) 0%, transparent 65%)" }} />
 <div className="relative flex h-[360px] items-center justify-center p-10">
 {img
 ? <img src={img.url} alt={equipment.display_name}
 className="float-eq h-full w-full object-contain"
 style={{ filter: "drop-shadow(0 32px 64px rgba(240,193,89,0.15)) drop-shadow(0 8px 24px rgba(0,0,0,0.8))" }} />
 : <Truck className="h-24 w-24 text-zinc-700/30 dark:text-zinc-600/30" />}
 </div>
 {/* Corner badges */}
 <div className="absolute top-4 left-4">
 {img && <span className="rounded-lg bg-black/80 backdrop-blur-sm border border-white dark:border-zinc-700/10 px-3 py-1 text-[11px] uppercase tracking-wider font-semibold text-zinc-700 dark:text-gray-300">{img.family}</span>}
 </div>
 <div className="absolute top-4 right-4">
 <span className={`rounded-lg px-3 py-1 text-[11px] font-semibold backdrop-blur-sm border ${available ? "bg-green-900/80 border-green-700/40 text-green-300" : "bg-yellow-900/80 border-yellow-700/40 text-yellow-300"}`}>
 {available ? "● Disponible" : equipment.estado || "Consultar"}
 </span>
 </div>
 </TiltCard>
 {/* Thumbnail strip */}
 <div className="mt-3 flex gap-2">
 {HERO_EQUIPMENT.filter(h => h.img === img?.url || false).length === 0 && img && (
 <div className="h-16 w-16 rounded-xl border-2 border-[#f0c159] bg-zinc-50 dark:bg-[#111] overflow-hidden flex-shrink-0">
 <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
 </div>
 )}
 </div>
 </motion.div>
 {/* Tabs */}
 <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.15 }}
 className="mt-8">
 <div className="flex gap-0 border-b border-zinc-200 dark:border-[#1a1a1a]">
 {([
 ["desc", "Descripción"],
 ["specs", "Especificaciones"],
 ["apps", "Aplicaciones"],
 ] as const).map(([id, label]) => (
 <button key={id} onClick={() => setTab(id)}
 className={`relative px-5 py-3 text-sm font-semibold transition-all
 ${tab === id ? "text-[#f0c159]" : "text-zinc-500 dark:text-gray-500 hover:text-zinc-700 dark:text-gray-300"}`}>
 {label}
 {tab === id && (
 <motion.div layoutId="tab-underline"
 className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c159] dark:bg-amber-400 rounded-full" />
 )}
 </button>
 ))}
 </div>
 <AnimatePresence mode="wait">
 <motion.div key={tab}
 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
 transition={{ duration:0.2 }}
 className="mt-6">
 {tab === "desc" && (
 <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
 <p>Equipo disponible para alquiler con o sin operador certificado. Perteneciente a la flota propia de <span className="text-zinc-900 dark:text-white font-black">ALITO GROUP</span>, con mantenimiento preventivo al día y documentación en regla.</p>
 <p>Ideal para proyectos de construcción, movimiento de tierra, excavación, compactación y trabajos en obra en toda la República Dominicana.</p>
 <div className="grid grid-cols-3 gap-3 mt-5">
 {[
 { icon: <ShieldCheck className="h-5 w-5 text-emerald-500 mx-auto" />, t: "Certificado", s: "Documentación al día" },
 { icon: <Zap className="h-5 w-5 text-amber-500 mx-auto" />, t: "Mantenimiento", s: "Preventivo periódico" },
 { icon: <Users className="h-5 w-5 text-blue-500 mx-auto" />, t: "Operador", s: "Capacitado y certificado" }
 ].map(({icon, t, s}) => (
 <div key={t} className="rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 p-4 text-center">
 <div className="mb-2">{icon}</div>
 <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{t}</div>
 <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">{s}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 {tab === "specs" && (
 <div className="grid gap-2 sm:grid-cols-2">
 {specs.map(([k,v]) => (
 <div key={k} className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-[#1a1a1a] px-4 py-3">
 <span className="text-sm text-zinc-500 dark:text-gray-500">{k}</span>
 <span className="text-sm font-semibold text-zinc-900 dark:text-white">{v}</span>
 </div>
 ))}
 </div>
 )}
 {tab === "apps" && (
 <div className="space-y-2">
 {["Excavación y movimiento de tierra","Carga y descarga de material","Demolición controlada","Nivelación y perfilado de terreno","Preparación de fundaciones","Construcción de vías y accesos"].map(a => (
 <div key={a} className="flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-[#1a1a1a] px-4 py-3">
 <span className="h-1.5 w-1.5 rounded-full bg-[#f0c159] flex-shrink-0" />
 <span className="text-sm text-zinc-700 dark:text-gray-300">{a}</span>
 </div>
 ))}
 </div>
 )}
 </motion.div>
 </AnimatePresence>
 </motion.div>
 </div>
 {/* ── Right panel — Rental Summary ── */}
 <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
 className="space-y-4">
 {/* Main info card */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/5 bg-zinc-50 dark:bg-[#0f0f0f] p-6">
 {img && (
 <span className="inline-block rounded-md bg-[#f0c159]/10 border border-[#f0c159]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f0c159]">
 {img.family}
 </span>
 )}
 <h1 className="mt-3 text-2xl font-black text-zinc-900 dark:text-white leading-tight">{equipment.display_name}</h1>
 {/* Spec badges */}
 <div className="mt-3 flex flex-wrap gap-2">
 {equipment.class_tonnage && (
 <span className="rounded-lg border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-100 dark:bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-gray-300">
 {equipment.class_tonnage} Ton
 </span>
 )}
 {equipment.commercial_capacity_m3 && (
 <span className="rounded-lg border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-100 dark:bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-gray-300">
 {equipment.commercial_capacity_m3} m³
 </span>
 )}
 {equipment.marca && (
 <span className="rounded-lg border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-100 dark:bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-gray-300">
 {equipment.marca}
 </span>
 )}
 <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${available ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-yellow-500/15 text-yellow-400"}`}>
 {available ? "Disponible" : "Consultar disponibilidad"}
 </span>
 </div>
 <div className="mt-5 border-t border-zinc-200 dark:border-[#1a1a1a] pt-5">
 <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-gray-500 mb-3">Resumen de alquiler</div>
 {/* Operator toggle */}
 <div className="mb-3 flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-[#1a1a1a] px-4 py-3">
 <div>
 <div className="text-sm font-semibold text-zinc-900 dark:text-white">Operador certificado</div>
 <div className="text-[10px] text-zinc-500 dark:text-gray-500">Incluye operador con experiencia</div>
 </div>
 <button onClick={() => setWithOperator(v => !v)}
 className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${withOperator ? "bg-[#f0c159]" : "bg-zinc-200 dark:bg-[#2a2a2a]"}`}>
 <motion.div animate={{ x: withOperator ? 20 : 2 }}
 className="absolute top-1 h-4 w-4 rounded-full bg-white dark:bg-zinc-900 shadow" />
 </button>
 </div>
 {/* Transport toggle */}
 <div className="mb-4 flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-[#1a1a1a] px-4 py-3">
 <div>
 <div className="text-sm font-semibold text-zinc-900 dark:text-white">Transporte incluido</div>
 <div className="text-[10px] text-zinc-500 dark:text-gray-500">Traslado al sitio de obra</div>
 </div>
 <button onClick={() => setWithTransport(v => !v)}
 className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${withTransport ? "bg-[#f0c159]" : "bg-zinc-200 dark:bg-[#2a2a2a]"}`}>
 <motion.div animate={{ x: withTransport ? 20 : 2 }}
 className="absolute top-1 h-4 w-4 rounded-full bg-white dark:bg-zinc-900 shadow" />
 </button>
 </div>
 {/* Price note */}
 <div className="rounded-xl bg-[#f0c159]/5 border border-[#f0c159]/20 p-4 text-center">
 <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Precio estimado</div>
 <div className="mt-1 text-2xl font-black text-[#f0c159] hover:animate-pulse transition-all">Bajo solicitud</div>
 <div className="mt-1 text-[9px] text-zinc-500 dark:text-zinc-400 font-medium uppercase">Cotización personalizada en &lt;24h</div>
 </div>
 </div>
 <button onClick={() => { onAddItem(buildEquipmentQuoteItem(equipment)); onNavigate("cart") }}
 className="glow-btn mt-4 w-full rounded-xl bg-[#f0c159] py-4 text-base font-bold text-black hover:bg-[#e5b84a] transition-colors">
 Solicitar cotización →
 </button>
 <button onClick={() => onAddItem(buildEquipmentQuoteItem(equipment))}
 className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] py-3 text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:border-[#f0c159]/30 transition-all">
 + Añadir a mi cotización
 </button>
 {/* WhatsApp */}
 <a href={`https://wa.me/18493150511?text=Hola%20ALITO%2C%20me%20interesa%20cotizar%20${encodeURIComponent(equipment.display_name)}`}
 target="_blank" rel="noopener noreferrer"
 className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl border border-green-800/30 py-3 text-sm text-green-400 hover:bg-green-900/20 hover:border-green-700/50 transition-all">
 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
 Consultar por WhatsApp
 </a>
 </div>
 {/* Contact card */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/5 bg-zinc-50 dark:bg-[#0f0f0f] p-4 text-xs">
 <div className="font-bold text-zinc-900 dark:text-white">Alito Group SRL / Alito EIRL</div>
 <div className="mt-1 text-zinc-500 dark:text-gray-500">Calle Domingo Maiz, Santiago, República Dominicana</div>
 <div className="mt-3 grid grid-cols-2 gap-2">
 <a href="tel:+18096933106" className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 px-3 py-2.5 text-[#f0c159] hover:bg-[#f0c159] hover:text-black transition-all duration-300 group">
 <Phone className="h-3.5 w-3.5" />
 <span className="font-bold tracking-tighter">(809) 693-3106</span>
 </a>
 <a href="tel:+18493150511" className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 px-3 py-2.5 text-[#f0c159] hover:bg-[#f0c159] hover:text-black transition-all duration-300">
 <Smartphone className="h-3.5 w-3.5" />
 <span className="font-bold tracking-tighter">(849) 315-0511</span>
 </a>
 </div>
 </div>
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-900/40 p-4">
 <div className="flex items-center gap-3">
 {[
 { icon: <Lock className="h-4 w-4 text-emerald-500 mx-auto" />, t: "100% seguro", s: "Datos protegidos" },
 { icon: <Zap className="h-4 w-4 text-amber-500 mx-auto" />, t: "Respuesta rápida", s: "Menos de 24h" },
 { icon: <CheckCircle2 className="h-4 w-4 text-blue-500 mx-auto" />, t: "Sin compromiso", s: "Solo cotización" }
 ].map(({icon, t, s}) => (
 <div key={t} className="flex-1 text-center">
 <div className="mb-1.5">{icon}</div>
 <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{t}</div>
 <div className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-0.5">{s}</div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 )
}
function CatalogDetailView({ item, onNavigate, onAddItem }:
 { item: AlitoCatalogItem; onNavigate: (v: PortalView) => void; onAddItem: (i: AlitoQuoteItemInput) => void }) {
 const img = getCatalogItemImage(item.item_code, item.family_code) || ALITO_CATALOG_IMAGES[item.item_code]
 const requiredFields = (item.required_fields || []).slice(0, 6)
 return (
 <div className="mx-auto max-w-screen-xl px-4 py-8">
 <div className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-zinc-500 dark:text-gray-500">
 <button onClick={() => onNavigate("home")} className="hover:text-zinc-900 dark:text-white transition-colors">Inicio</button>
 <span className="text-gray-700">/</span>
 <button onClick={() => onNavigate("catalog")} className="hover:text-zinc-900 dark:text-white transition-colors">Catálogo</button>
 <span className="text-gray-700">/</span>
 <span className="text-zinc-900 dark:text-white truncate">{item.display_name}</span>
 </div>
 <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <div className="relative mb-6 flex h-72 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-[#0a0a0a]">
 {img?.url ? (
 <img src={img.url} alt={item.display_name} className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
 ) : (
 <Box className="h-20 w-20 text-zinc-200 dark:text-zinc-800" />
 )}
 </div>
 <div className="mb-2 inline-flex rounded-md bg-[#f0c159]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f0c159]">
 {item.family_name}
 </div>
 <h1 className="text-2xl font-black">{item.display_name}</h1>
 <p className="mt-3 text-sm text-zinc-600 dark:text-gray-400">
 {item.public_notes || item.family_description || "Servicio/material para cotización con validación comercial y operativa."}
 </p>
 <div className="mt-6 grid gap-2 sm:grid-cols-2">
 <div className="rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3 text-sm">
 <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-gray-500">Unidad base</div>
 <div className="mt-1 font-semibold text-zinc-900 dark:text-white">{item.base_unit}</div>
 </div>
 <div className="rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3 text-sm">
 <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-gray-500">Modalidad</div>
 <div className="mt-1 font-semibold text-zinc-900 dark:text-white">{item.commercial_modality}</div>
 </div>
 </div>
 {requiredFields.length > 0 && (
 <div className="mt-6 rounded-xl border border-zinc-200 dark:border-[#1a1a1a] bg-zinc-50 dark:bg-[#111] p-4">
 <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-gray-500">Datos que ayudan a cotizar</div>
 <div className="flex flex-wrap gap-2">
 {requiredFields.map((field) => (
 <span key={field} className="rounded-md bg-white dark:bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-zinc-700 dark:text-gray-300">{field}</span>
 ))}
 </div>
 </div>
 )}
 </div>
 <div className="space-y-4">
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <div className="text-xs uppercase tracking-widest text-zinc-500 dark:text-gray-500">Respuesta comercial</div>
 <div className="mt-1 text-2xl font-black text-[#f0c159]">Bajo solicitud</div>
 <div className="mt-2 text-sm text-zinc-500 dark:text-gray-500">Cotización personalizada según volumen, ubicación y ventana de ejecución.</div>
 <button onClick={() => { onAddItem(buildCatalogQuoteItem(item)); onNavigate("cart") }}
 className="glow-btn mt-5 w-full rounded-xl bg-[#f0c159] py-3.5 text-sm font-bold text-black hover:bg-[#e5b84a]">
 Añadir y continuar →
 </button>
 <button onClick={() => onAddItem(buildCatalogQuoteItem(item))}
 className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] py-3 text-sm text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white">
 Añadir al carrito
 </button>
 <a href={`https://wa.me/18493150511?text=Hola%20ALITO%2C%20quiero%20cotizar%20${encodeURIComponent(item.display_name)}`}
 target="_blank" rel="noopener noreferrer"
 className="mt-2 flex w-full items-center justify-center rounded-xl border border-green-700/40 py-3 text-sm text-green-400 hover:bg-green-900/20">
 Consultar por WhatsApp
 </a>
 </div>
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5 text-xs text-zinc-500 dark:text-gray-500">
 Esta ficha muestra alcance comercial. El precio final se confirma en la cotización oficial de ALITO.
 </div>
 </div>
 </div>
 </div>
 )
}
// ─── Cart / Quote Wizard ──────────────────────────────────────────────────────
function CartView({ quoteItems, customer, project, onUpdateItem, onRemoveItem, onAddFree, onCustomerChange, onProjectChange, onSubmit, submitting, onNavigate, showToast }:
 { quoteItems: AlitoQuoteItemInput[]; customer: AlitoCustomerPayload; project: { location: string; notes: string };
 onUpdateItem: (i: number, p: Partial<AlitoQuoteItemInput>) => void; onRemoveItem: (i: number) => void;
 onAddFree: () => void; onCustomerChange: (c: AlitoCustomerPayload) => void;
 onProjectChange: (p: { location: string; notes: string }) => void;
 onSubmit: () => void; submitting: boolean; onNavigate: (v: PortalView) => void;
 showToast: (msg: string, type?: "ok" | "err") => void }) {
 const [step, setStep] = useState(0)
 const steps = ["Carrito", "Datos del proyecto", "Documentos", "Confirmación"]
 const [files, setFiles] = useState<File[]>([])
 const [fileErrors, setFileErrors] = useState<string[]>([])
 const [localFilesAcknowledged, setLocalFilesAcknowledged] = useState(false)
 const handleFilesSelected = (inputFiles: File[]) => {
 const validFiles = inputFiles.filter((file) => !validateUploadFile(file, { allowedExtensions: WIZARD_EXTENSIONS, allowedMimeTypes: WIZARD_MIME_TYPES, maxBytes: MAX_UPLOAD_BYTES }))
 const errors = inputFiles
 .map((file) => validateUploadFile(file, { allowedExtensions: WIZARD_EXTENSIONS, allowedMimeTypes: WIZARD_MIME_TYPES, maxBytes: MAX_UPLOAD_BYTES }))
 .filter(Boolean) as string[]
 setFiles(validFiles)
 setFileErrors(errors)
 setLocalFilesAcknowledged(false)
 }
 const goNext = () => {
 if (step === 0 && quoteItems.length === 0) {
 showToast("Tu cotización está vacía. Añade al menos una línea.", "err")
 return
 }
 if (step === 1) {
 if (!String(customer.nombre || "").trim() || !String(customer.email || "").trim() || !String(customer.telefono || "").trim()) {
 showToast("Completa nombre, correo y teléfono antes de continuar.", "err")
 return
 }
 if (!String(project.location || "").trim()) {
 showToast("Indica la ubicación del proyecto antes de continuar.", "err")
 return
 }
 }
 setStep((current) => Math.min(current + 1, steps.length - 1))
 }
 return (
 <div className="mx-auto max-w-screen-xl px-4 py-8">
 {/* Stepper */}
 <div className="mb-10 flex items-center justify-center gap-0">
 {steps.map((s, i) => (
 <div key={s} className="flex items-center">
 <button onClick={() => i <= step && setStep(i)} className="flex flex-col items-center gap-1">
 <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all
 ${i === step ? "border-[#f0c159] bg-[#f0c159] text-black" : i < step ? "border-[#f0c159] bg-[#f0c159]/10 text-[#f0c159]" : "border-zinc-300 dark:border-[#2a2a2a] text-gray-600"}`}>
 {i < step ? "✓" : i + 1}
 </div>
 <span className={`hidden text-xs sm:block ${i === step ? "text-[#f0c159]" : "text-gray-600"}`}>{s}</span>
 </button>
 {i < steps.length - 1 && <div className={`h-px w-12 sm:w-20 mx-1 ${i < step ? "bg-[#f0c159]" : "bg-zinc-200 dark:bg-[#2a2a2a]"}`} />}
 </div>
 ))}
 </div>
 <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
 {/* Main area */}
 <div>
 {step === 0 && (
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Tu carrito ({quoteItems.length} ítems)</h2>
 <button onClick={onAddFree} className="rounded-lg border border-zinc-300 dark:border-[#2a2a2a] px-3 py-1.5 text-xs text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">+ Línea libre</button>
 </div>
 {quoteItems.length === 0 ? (
 <div className="py-16 text-center">
 <div className="text-4xl opacity-10">
 <Truck className="mx-auto h-16 w-16 text-zinc-400" />
 </div>
 <div className="mt-4 text-zinc-500 dark:text-zinc-500 font-medium uppercase tracking-widest text-xs">Tu cotización está vacía</div>
 <button onClick={() => onNavigate("catalog")} className="mt-6 rounded-2xl bg-[#f0c159] px-8 py-3 text-sm font-black uppercase tracking-widest text-black border border-[#f0c159] hover:bg-black hover:text-[#f0c159] transition-all duration-300 shadow-lg shadow-amber-500/10">Ir al catálogo</button>
 </div>
 ) : (
 <div className="space-y-3">
 {quoteItems.map((item, i) => (
 <div key={i} className="grid gap-3 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/50 p-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
 <input value={item.display_name} onChange={e => onUpdateItem(i, { display_name: e.target.value })}
 placeholder="Descripción del equipo o servicio"
 className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-[#f0c159] focus:ring-1 focus:ring-[#f0c159]/20 focus:outline-none" />
 <input type="number" value={item.quantity ?? ""} onChange={e => onUpdateItem(i, { quantity: Number(e.target.value) })}
 placeholder="Cantidad" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-[#f0c159] focus:outline-none" />
 <input value={item.unit || ""} onChange={e => onUpdateItem(i, { unit: e.target.value })}
 placeholder="Unidad" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-[#f0c159] focus:outline-none" />
 <button onClick={() => onRemoveItem(i)} className="text-zinc-400 hover:text-red-500 transition-colors">✕</button>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 {step === 1 && (
 <div className="space-y-4">
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <h2 className="mb-4 text-lg font-bold">Datos del proyecto / cliente</h2>
 <div className="grid gap-4 sm:grid-cols-2">
 {([["Nombre / Empresa *","nombre","text",true],["RNC / Cédula","documento","text",false],["Correo electrónico *","email","email",true],["Teléfono / WhatsApp *","telefono","tel",true],["Dirección de obra","direccion","text",false]] as [string,keyof AlitoCustomerPayload,string,boolean][]).map(([label, key, type, _req]) => (
 <div key={key} className={key === "direccion" ? "sm:col-span-2" : ""}>
 <label className="mb-1.5 block text-xs text-zinc-600 dark:text-gray-400">{label}</label>
 <input type={type} value={String(customer[key] || "")}
 onChange={e => onCustomerChange({ ...customer, [key]: e.target.value })}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none" />
 </div>
 ))}
 </div>
 </div>
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <h2 className="mb-4 text-lg font-bold">Ubicación y alcance</h2>
 <div className="space-y-4">
 <div>
 <label className="mb-1.5 block text-xs text-zinc-600 dark:text-gray-400">Ubicación del proyecto *</label>
 <input value={project.location} onChange={e => onProjectChange({ ...project, location: e.target.value })}
 placeholder="Ej.: Av. 27 de Febrero, Santiago"
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none" />
 </div>
 <div>
 <label className="mb-1.5 block text-xs text-zinc-600 dark:text-gray-400">Notas de alcance / observaciones</label>
 <textarea value={project.notes} onChange={e => onProjectChange({ ...project, notes: e.target.value })}
 rows={4} placeholder="Acceso, volumen estimado, tipo de material, horarios, turnos..."
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none resize-none" />
 </div>
 </div>
 </div>
 </div>
 )}
 {step === 2 && (
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <h2 className="mb-2 text-lg font-bold">Adjunta tus documentos</h2>
 <p className="mb-3 text-sm text-zinc-500 dark:text-gray-500">Planos, fotos de terreno, órdenes o cualquier documento que ayude a preparar tu cotización.</p>
 <div className="mb-6 rounded-xl border border-[#f0c159]/20 bg-[#f0c159]/5 px-4 py-3 text-xs text-zinc-600 dark:text-gray-400">
 Nota: en esta versión los adjuntos de esta etapa solo se guardan localmente en tu navegador para preparar la solicitud.
 No se cargan al backend en el envío de cotización.
 </div>
 <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/50 p-12 text-center hover:border-[#f0c159]/50 transition-all duration-300 group cursor-pointer bg-zinc-50/50 dark:bg-black/20">
 <div className="text-4xl">
 <CloudUpload className="mx-auto h-12 w-12 text-zinc-300 group-hover:text-[#f0c159] transition-colors" />
 </div>
 <div className="mt-4 font-black uppercase tracking-widest text-xs text-zinc-900 dark:text-white">Arrastra y suelta tus archivos aquí</div>
 <div className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-500 font-medium">PDF, DWG, JPG, PNG · Máx. 20MB por archivo</div>
 <label className="mt-6 inline-block cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 py-3 text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm transition-all border-b-2 active:translate-y-0.5">
 Seleccionar archivos
 <input type="file" multiple accept=".pdf,.dwg,.jpg,.jpeg,.png" className="hidden"
 onChange={e => handleFilesSelected(Array.from(e.target.files || []))} />
 </label>
 </div>
 {(files.length > 0 || fileErrors.length > 0) && (
 <div className="mt-3 space-y-1">
 {files.length > 0 && <div className="text-xs text-gray-600">Solo se conservan archivos válidos de hasta 20MB en esta sesión local.</div>}
 {fileErrors.slice(0, 2).map((error) => (
 <div key={error} className="text-xs text-red-400">{error}</div>
 ))}
 {fileErrors.length > 2 && <div className="text-xs text-red-400">+{fileErrors.length - 2} archivo(s) rechazado(s).</div>}
 </div>
 )}
 {files.length > 0 && (
 <div className="mt-4 space-y-2">
 {files.map(f => (
 <div key={f.name} className="flex items-center gap-3 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/50 px-4 py-3 group">
 <FileText className="h-4 w-4 text-[#f0c159]" />
 <span className="flex-1 text-xs font-bold text-zinc-900 dark:text-white truncate uppercase tracking-tighter">{f.name}</span>
 <span className="text-[10px] text-zinc-500 font-bold">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 {step === 3 && (
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6">
 <h2 className="mb-6 text-lg font-bold">Confirmar y enviar</h2>
 <div className="space-y-3 text-sm">
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Nombre / Empresa</span>
 <span className="font-medium text-zinc-900 dark:text-white">{customer.nombre || "—"}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Correo</span>
 <span className="font-medium text-zinc-900 dark:text-white">{customer.email || "—"}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Teléfono</span>
 <span className="font-medium text-zinc-900 dark:text-white">{customer.telefono || "—"}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Ubicación</span>
 <span className="font-medium text-zinc-900 dark:text-white">{project.location || "—"}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Ítems</span>
 <span className="font-medium text-zinc-900 dark:text-white">{quoteItems.length} línea(s)</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-4 py-3">
 <span className="text-zinc-500 dark:text-gray-500">Adjuntos locales</span>
 <span className="font-medium text-zinc-900 dark:text-white">{files.length}</span>
 </div>
 </div>
 <div className="mt-4 rounded-xl border border-[#f0c159]/20 bg-[#f0c159]/5 p-4 text-xs text-zinc-600 dark:text-gray-400">
 Al enviar, ALITO recibirá tu solicitud y responderá con una cotización detallada en menos de 24 horas. El precio se determina según disponibilidad, ubicación y alcance del proyecto.
 </div>
 {files.length > 0 && (
 <label className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-3 py-2 text-xs text-zinc-600 dark:text-gray-400">
 <input
 type="checkbox"
 checked={localFilesAcknowledged}
 onChange={(event) => setLocalFilesAcknowledged(event.target.checked)}
 className="mt-0.5 accent-[#f0c159]"
 />
 <span>
 Entiendo que estos adjuntos no se envían al backend desde este paso y que debo compartirlos por un canal acordado con ALITO si son requeridos.
 </span>
 </label>
 )}
 <button
 onClick={() => {
 if (files.length > 0 && !localFilesAcknowledged) {
 showToast("Confirma el aviso de adjuntos locales antes de enviar.", "err")
 return
 }
 onSubmit()
 }}
 disabled={submitting || (files.length > 0 && !localFilesAcknowledged)}
 className="mt-6 w-full rounded-2xl bg-[#f0c159] py-4 text-base font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#f0c159] border border-[#f0c159] disabled:opacity-60 transition-all duration-300 shadow-[0_15px_30px_-10px_rgba(240,193,89,0.3)]"
 >
 {submitting ? "Enviando..." : "Solicitar cotización →"}
 </button>
 </div>
 )}
 {/* Navigation */}
 <div className="mt-5 flex justify-between">
 <button onClick={() => step === 0 ? onNavigate("catalog") : setStep(s => s - 1)}
 className="rounded-xl border border-zinc-300 dark:border-[#2a2a2a] px-5 py-2.5 text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
 {step === 0 ? "← Catálogo" : "← Anterior"}
 </button>
 {step < steps.length - 1 && (
 <button onClick={goNext}
 className="rounded-xl bg-[#f0c159] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#e5b84a]">
 Continuar →
 </button>
 )}
 </div>
 </div>
 {/* Summary sidebar */}
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5 h-fit sticky top-24">
 <div className="text-sm font-bold mb-3">Resumen de tu solicitud</div>
 <div className="text-xs text-zinc-500 dark:text-gray-500 mb-4">{quoteItems.length} ítem(s)</div>
 {quoteItems.slice(0, 5).map((item, i) => (
 <div key={i} className="flex justify-between py-2 border-b border-zinc-200 dark:border-[#1a1a1a] text-xs">
 <span className="text-zinc-700 dark:text-gray-300 truncate">{item.display_name || "Sin nombre"}</span>
 <span className="text-zinc-500 dark:text-gray-500 ml-2 flex-shrink-0">{item.quantity} {item.unit}</span>
 </div>
 ))}
 {quoteItems.length > 5 && <div className="text-xs text-gray-600 pt-2">+{quoteItems.length - 5} más...</div>}
 <div className="mt-4 rounded-xl bg-[#f0c159] p-4 text-center shadow-lg border border-[#f0c159]">
 <div className="text-xs font-bold text-black opacity-60 uppercase tracking-widest">Total estimado</div>
 <div className="text-xl font-black text-black mt-1">BAJO COTIZACIÓN</div>
 </div>
 <div className="mt-4 grid grid-cols-3 gap-2 text-center">
 {["Respuesta rápida ≤24h","Equipos verificados","Soporte experto"].map(b => (
 <div key={b} className="rounded-lg bg-zinc-50 dark:bg-[#111] p-2 text-[10px] text-zinc-500 dark:text-gray-500">{b}</div>
 ))}
 </div>
 <div className="mt-4 text-[10px] text-gray-600 dark:text-zinc-400 text-center flex items-center justify-center gap-1.5">
 <Lock className="h-3 w-3 text-emerald-500" />
 Tu información está 100% segura y protegida.
 </div>
 </div>
 </div>
 </div>
 )
}
// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ requests, paymentProofs, portalSummary, session, resolvedSession, customer, authMode, authForm, onAuthModeChange, onAuthFormChange, onAuth, submitting, onSignOut, onNavigate, onApprove, onPaymentDoc, onDownloadDocument, loading, isClient }:
 { requests: AlitoQuoteRequest[]; paymentProofs: AlitoPaymentProof[]; portalSummary: AlitoClientPortalSummary | null;
 session: AlitoAuthSession | null; resolvedSession: AlitoResolvedSession | null; customer: AlitoCustomerPayload;
 authMode: "login"|"register"; authForm: { nombre: string; email: string; password: string };
 onAuthModeChange: (m: "login"|"register") => void; onAuthFormChange: (f: { nombre: string; email: string; password: string }) => void;
 onAuth: () => void; submitting: boolean; onSignOut: () => void; onNavigate: (v: PortalView) => void;
 onApprove: (r: AlitoQuoteRequest) => void; onPaymentDoc: (d: AlitoClientPortalDocument) => void; onDownloadDocument: (d: AlitoClientPortalDocument) => void;
 loading: boolean; isClient: boolean }) {
 const metrics = [
 { label: "Cotizaciones activas", value: requests.filter(r => !["completada","cancelada"].includes(r.status)).length, icon: FolderOpen },
 { label: "Aprobadas", value: requests.filter(r => r.status === "aprobada_cliente").length, icon: CircleCheckBig },
 { label: "Proformas generadas", value: portalSummary?.counts.proformas ?? 0, icon: FileText },
 { label: "Facturas pendientes", value: portalSummary?.counts.facturas ?? 0, icon: ReceiptText },
 ]
 const PIPELINE = ["recibida","en_revision","aprobada_cliente","proforma_generada","facturada","completada"]
 const activePaymentProofKeys = useMemo(
 () =>
 new Set(
 paymentProofs
 .filter((proof) => ["pendiente_revision", "en_revision"].includes(proof.status))
 .flatMap((proof) => [
 proof.related_document_id ? `${proof.related_document_type}:${proof.related_document_id}` : null,
 proof.related_document_number ? `${proof.related_document_type}:${proof.related_document_number}` : null,
 ])
 .filter(Boolean) as string[],
 ),
 [paymentProofs],
 )
 const recentPaymentProofs = useMemo(
 () => [...paymentProofs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
 [paymentProofs],
 )
 if (!isClient) {
 return (
 <div className="mx-auto max-w-md px-4 py-16">
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-8">
 <div className="text-center mb-6">
 <Lock className="mx-auto h-8 w-8 text-[#f0c159]" />
 <h2 className="mt-3 text-xl font-black">Acceso cliente</h2>
 <p className="mt-1 text-sm text-zinc-500 dark:text-gray-500">Inicia sesión para ver tu historial y aprobar cotizaciones.</p>
 </div>
 <div className="flex rounded-xl border border-zinc-300 dark:border-[#2a2a2a] p-1 mb-5">
 {(["login","register"] as const).map(m => (
 <button key={m} onClick={() => onAuthModeChange(m)}
 className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${authMode === m ? "bg-[#f0c159] text-black" : "text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white"}`}>
 {m === "login" ? "Entrar" : "Registrarme"}
 </button>
 ))}
 </div>
 <div className="space-y-3">
 {authMode === "register" && (
 <input value={authForm.nombre} onChange={e => onAuthFormChange({ ...authForm, nombre: e.target.value })}
 placeholder="Nombre completo"
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none" />
 )}
 <input type="email" value={authForm.email} onChange={e => onAuthFormChange({ ...authForm, email: e.target.value })}
 placeholder="Correo electrónico"
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none" />
 <input type="password" value={authForm.password} onChange={e => onAuthFormChange({ ...authForm, password: e.target.value })}
 placeholder="Contraseña"
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none" />
 <button onClick={onAuth} disabled={submitting}
 className="w-full rounded-xl bg-[#f0c159] py-3 text-sm font-bold text-black hover:bg-[#e5b84a] disabled:opacity-60">
 {submitting ? "Procesando..." : authMode === "login" ? "Entrar al portal" : "Crear cuenta cliente"}
 </button>
 </div>
 </div>
 </div>
 )
 }
 return (
 <div className="mx-auto max-w-screen-xl px-4 py-8">
 {/* Header */}
 <div className="mb-8 flex items-start justify-between">
 <div>
 <div className="text-xs uppercase tracking-widest text-[#f0c159]">Panel del cliente</div>
 <h1 className="mt-1 text-3xl font-black">Mis Cotizaciones</h1>
 <p className="mt-1 text-sm text-zinc-500 dark:text-gray-500">Administra y da seguimiento a todas tus solicitudes.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="text-right hidden sm:block">
 <div className="text-sm font-semibold">{resolvedSession?.profile?.nombre || customer.nombre}</div>
 <div className="text-xs text-zinc-500 dark:text-gray-500">Cliente</div>
 </div>
 <button onClick={onSignOut} className="rounded-xl border border-zinc-300 dark:border-[#2a2a2a] px-3 py-2 text-xs text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
 Cerrar sesión
 </button>
 </div>
 </div>
 {/* Metrics */}
 <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {metrics.map(m => (
 <div key={m.label} className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <div className="flex items-center justify-between">
 <m.icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
 <div className="text-3xl font-black text-[#f0c159]">{m.value}</div>
 </div>
 <div className="mt-2 text-xs text-zinc-500 dark:text-gray-500">{m.label}</div>
 </div>
 ))}
 </div>
 {/* Pipeline */}
 <div className="mb-8 rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <h2 className="mb-4 font-bold">Estado de tus cotizaciones</h2>
 <div className="flex items-center gap-0 overflow-x-auto pb-2">
 {PIPELINE.map((s, i) => {
 const count = requests.filter(r => r.status === s).length
 return (
 <div key={s} className="flex items-center flex-shrink-0">
 <div className={`rounded-xl border px-4 py-3 text-center min-w-[100px] ${count > 0 ? "border-[#f0c159]/30 bg-[#f0c159]/5" : "border-zinc-200 dark:border-[#1a1a1a] bg-zinc-50 dark:bg-[#111]"}`}>
 <div className={`text-2xl font-black ${count > 0 ? "text-[#f0c159]" : "text-gray-600"}`}>{count}</div>
 <div className="mt-1 text-[10px] text-zinc-500 dark:text-gray-500">{statusLabel(s)}</div>
 </div>
 {i < PIPELINE.length - 1 && <div className="mx-1 text-gray-700 text-sm">→</div>}
 </div>
 )
 })}
 </div>
 </div>
 <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
 {/* Requests list */}
 <div>
 <h2 className="mb-4 font-bold">Solicitudes recientes</h2>
 {loading ? (
 <div className="py-12 text-center text-gray-600">Cargando...</div>
 ) : requests.length === 0 ? (
 <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-[#2a2a2a] py-16 text-center">
 <FolderOpen className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700" />
 <div className="mt-2 text-sm text-gray-600">No tienes solicitudes aún</div>
 <button onClick={() => onNavigate("catalog")} className="mt-4 rounded-xl bg-[#f0c159] px-5 py-2 text-sm font-bold text-black">
 Explorar catálogo
 </button>
 </div>
 ) : (
 <div className="space-y-4">
 {requests.map(r => (
 <div key={r.id} className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <div className="flex flex-wrap items-center gap-2">
 <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{r.correlation_id}</span>
 <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>{statusLabel(r.status)}</span>
 {r.client_approval_status === "aprobado" && <span className="rounded-lg bg-green-500/20 px-2 py-0.5 text-xs text-green-400">Firmada</span>}
 </div>
 <div className="mt-1 text-xs text-zinc-500 dark:text-gray-500">{r.project_location}</div>
 <div className="mt-1 text-xs text-gray-600">{r.quote_request_items?.map(i => i.display_name).join(" · ")}</div>
 </div>
 <div className="text-right">
 <div className="text-xs text-gray-600">Monto cotizado</div>
 <div className="text-lg font-black text-[#f0c159]">{fmt(r.admin_quoted_total, r.admin_currency || "DOP")}</div>
 </div>
 </div>
 {r.admin_response_notes && (
 <div className="mt-3 rounded-xl bg-zinc-50 dark:bg-[#111] p-3 text-xs text-zinc-600 dark:text-gray-400">{r.admin_response_notes}</div>
 )}
 {/* Timeline */}
 {r.quote_events && r.quote_events.length > 0 && (
 <div className="mt-4 border-t border-zinc-200 dark:border-[#1a1a1a] pt-4">
 <div className="space-y-2">
 {r.quote_events.slice(-3).reverse().map(ev => (
 <div key={ev.id} className="flex gap-3">
 <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f0c159]" />
 <div>
 <div className="text-xs font-medium text-zinc-900 dark:text-white">{ev.message || ev.event_type}</div>
 <div className="text-[10px] text-gray-600">{fmtDate(ev.created_at)}</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 {/* Actions */}
 {["cotizada","pendiente_cliente"].includes(r.status) && r.client_approval_status === "pendiente" && (
 <div className="mt-4">
 <button onClick={() => onApprove(r)}
 className="rounded-xl bg-[#f0c159] px-4 py-2 text-sm font-bold text-black hover:bg-[#e5b84a]">
 Aprobar con firma →
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 {/* ERP summary */}
 <div className="space-y-4">
 {portalSummary && (
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <h2 className="mb-4 font-bold">Expediente comercial</h2>
 <div className="grid grid-cols-2 gap-3 mb-4">
 {[["Cotizaciones ERP", portalSummary.counts.cotizaciones], ["Proformas", portalSummary.counts.proformas], ["Facturas", portalSummary.counts.facturas], ["Pagos", portalSummary.counts.pagos]].map(([k,v]) => (
 <div key={k as string} className="rounded-xl bg-zinc-50 dark:bg-[#111] p-3">
 <div className="text-xl font-black text-[#f0c159]">{v}</div>
 <div className="text-xs text-zinc-500 dark:text-gray-500">{k}</div>
 </div>
 ))}
 </div>
 <div className="space-y-2">
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-3 py-2 text-sm">
 <span className="text-zinc-500 dark:text-gray-500">Facturado</span>
 <span className="font-bold text-zinc-900 dark:text-white">{fmt(portalSummary.total_facturado)}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-zinc-50 dark:bg-[#111] px-3 py-2 text-sm">
 <span className="text-zinc-500 dark:text-gray-500">Pagado</span>
 <span className="font-bold text-zinc-900 dark:text-white">{fmt(portalSummary.total_pagado)}</span>
 </div>
 <div className="flex justify-between rounded-xl bg-[#f0c159]/5 border border-[#f0c159]/20 px-3 py-2 text-sm">
 <span className="text-zinc-600 dark:text-gray-400">Balance pendiente</span>
 <span className="font-black text-[#f0c159]">{fmt(portalSummary.balance_pending)}</span>
 </div>
 </div>
 {/* Documents */}
 {portalSummary.documents.length > 0 && (
 <div className="mt-4 space-y-2">
 <div className="text-xs font-semibold text-zinc-500 dark:text-gray-500 uppercase tracking-widest">Documentos</div>
 {portalSummary.documents.slice(0, 5).map(doc => (
 <div key={`${doc.type}-${doc.id}`} className="rounded-xl bg-zinc-50 dark:bg-[#111] p-3">
 <div className="flex items-start justify-between gap-2">
 <div>
 <span className="rounded-md bg-white dark:bg-[#0a0a0a] px-2 py-0.5 text-[10px] text-zinc-600 dark:text-gray-400 uppercase">{doc.type}</span>
 <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-white">{doc.number}</div>
 <div className="text-[10px] text-zinc-500 dark:text-gray-500">{doc.status}</div>
 </div>
 <div className="text-right">
 <div className="text-xs font-bold text-[#f0c159]">{fmt(doc.balance_pending ?? doc.total, doc.currency || "DOP")}</div>
 {(doc.document_url || (session && doc.quote_request_id)) && (
 <button onClick={() => onDownloadDocument(doc)} className="mt-1 block w-full text-[10px] text-zinc-500 dark:text-gray-500 hover:text-[#f0c159]">
 Descargar
 </button>
 )}
 {session && ["proforma","factura"].includes(doc.type) && (
 activePaymentProofKeys.has(`${doc.type}:${doc.id}`) || activePaymentProofKeys.has(`${doc.type}:${doc.number}`) ? (
 <div className="mt-1 text-[10px] text-gray-600">Comprobante ya reportado</div>
 ) : (
 <button onClick={() => onPaymentDoc(doc)} className="mt-1 text-[10px] text-zinc-500 dark:text-gray-500 hover:text-[#f0c159]">
 Reportar pago
 </button>
 )
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 {recentPaymentProofs.length > 0 && (
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <h2 className="mb-3 font-bold">Comprobantes reportados</h2>
 <div className="space-y-2">
 {recentPaymentProofs.slice(0, 6).map((proof) => (
 <div key={proof.id} className="rounded-xl bg-zinc-50 dark:bg-[#111] p-3">
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="text-xs font-semibold text-zinc-900 dark:text-white">{proof.related_document_number || proof.file_name}</div>
 <div className="mt-1 text-[10px] text-zinc-500 dark:text-gray-500">{fmtDate(proof.fecha_pago_reportada || proof.created_at)}</div>
 <div className="mt-1 text-[10px] text-gray-600">Ref. {proof.referencia_reportada}</div>
 </div>
 <div className="text-right">
 <span className={`rounded-lg px-2 py-0.5 text-[10px] font-medium ${statusColor(proof.status)}`}>{statusLabel(proof.status)}</span>
 <div className="mt-2 text-[10px] font-bold text-[#f0c159]">{fmt(proof.monto_reportado, proof.currency || "DOP")}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 <div className="rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-5">
 <h2 className="mb-3 font-bold">¿Necesitas ayuda?</h2>
 <p className="text-xs text-zinc-500 dark:text-gray-500">Nuestro equipo está listo para asistirte en lo que necesites.</p>
 <a href="https://wa.me/18493150511" target="_blank" rel="noopener noreferrer"
 className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f0c159] py-3 text-sm font-bold text-black hover:bg-[#e5b84a]">
 Contactar soporte →
 </a>
 </div>
 </div>
 </div>
 </div>
 )
}
// ─── Footer ───────────────────────────────────────────────────────────────────
// ─── Approval Modal ───────────────────────────────────────────────────────────
function ApprovalModal({ request, customer, session, onClose, onDone, showToast }:
 { request: AlitoQuoteRequest; customer: AlitoCustomerPayload; session: AlitoAuthSession | null;
 onClose: () => void; onDone: () => Promise<void>; showToast: (m: string, t?: "ok"|"err") => void }) {
 const [name, setName] = useState(customer.nombre || "")
 const [doc, setDoc] = useState(customer.documento || "")
 const [file, setFile] = useState<File | null>(null)
 const [notes, setNotes] = useState("")
 const [poNum, setPoNum] = useState("")
 const [submitting, setSubmitting] = useState(false)
 const sigRef = useRef<{ getSignature: () => string | null; clear: () => void } | null>(null)
 const decide = async (decision: "approved"|"rejected") => {
 if (!session) { showToast("Inicia sesión primero", "err"); return }
 const sig = sigRef.current?.getSignature() || null
 if (decision === "approved" && !sig) { showToast("Dibuja tu firma antes de aprobar", "err"); return }
 setSubmitting(true)
 try {
 let upload: { storagePath: string; fileName: string } | null = null
 if (file) upload = await uploadAlitoPurchaseOrder({ quoteRequestId: request.id, file, session })
 await approveAlitoQuoteRequest({
 quote_request_id: request.id, decision, signature_data_url: sig,
 approval_name: name, approval_document: doc, notes,
 purchase_order_number: poNum,
 purchase_order_file_name: upload?.fileName || file?.name || null,
 purchase_order_storage_path: upload?.storagePath || null, session,
 })
 showToast(decision === "approved" ? "Cotización aprobada ✓" : "Cotización rechazada")
 await onDone()
 } catch (err) { showToast(err instanceof Error ? err.message : "Error procesando aprobación", "err") }
 finally { setSubmitting(false) }
 }
 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
 <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6 max-h-[90vh] overflow-y-auto">
 <div className="flex items-start justify-between mb-5">
 <div>
 <h2 className="text-lg font-black">Aprobar cotización</h2>
 <p className="text-xs text-zinc-500 dark:text-gray-500 mt-1">Firma digitalmente para autorizar la ejecución.</p>
 </div>
 <button onClick={onClose} className="text-zinc-500 dark:text-gray-500 hover:text-zinc-900 dark:text-white text-xl">✕</button>
 </div>
 <div className="rounded-xl bg-zinc-50 dark:bg-[#111] p-4 mb-5">
 <div className="font-mono text-sm font-bold">{request.correlation_id}</div>
 <div className="text-xs text-zinc-500 dark:text-gray-500 mt-1">{request.project_location}</div>
 <div className="text-2xl font-black text-[#f0c159] mt-2">{fmt(request.admin_quoted_total, request.admin_currency || "DOP")}</div>
 </div>
 <div className="grid gap-3 sm:grid-cols-2 mb-4">
 {[["Nombre del firmante", name, setName],["Documento firmante", doc, setDoc],["N° orden de compra", poNum, setPoNum]].map(([label, val, set]) => (
 <div key={label as string}>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">{label as string}</label>
 <input value={val as string} onChange={e => (set as (v:string)=>void)(e.target.value)}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-[#f0c159]/50 focus:outline-none" />
 </div>
 ))}
 <div>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Adjuntar orden de compra</label>
 <input type="file" accept=".pdf,.png,.jpg,.jpeg"
 onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-[#f0c159]/50 focus:outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[#f0c159] file:text-xs file:font-bold file:text-black file:px-2 file:py-1" />
 </div>
 </div>
 <div className="mb-4">
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Firma digital</label>
 <SignaturePad refObject={sigRef} />
 </div>
 <div className="mb-5">
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Notas</label>
 <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none resize-none" />
 </div>
 <div className="flex gap-3">
 <button onClick={() => decide("rejected")} disabled={submitting}
 className="flex-1 rounded-xl border border-zinc-300 dark:border-[#2a2a2a] py-3 text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-60">
 Rechazar
 </button>
 <button onClick={() => decide("approved")} disabled={submitting}
 className="flex-1 rounded-xl bg-[#f0c159] py-3 text-sm font-bold text-black hover:bg-[#e5b84a] disabled:opacity-60">
 {submitting ? "Procesando..." : "Aprobar para ejecución →"}
 </button>
 </div>
 </div>
 </div>
 )
}
// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ doc, requests, session, onClose, onDone, showToast }:
 { doc: AlitoClientPortalDocument; requests: AlitoQuoteRequest[]; session: AlitoAuthSession | null;
 onClose: () => void; onDone: () => Promise<void>; showToast: (m: string, t?: "ok"|"err") => void }) {
 const requestOptions = requests.filter(r => r.status !== "cancelada")
 const inferredRequestId =
 doc.quote_request_id ||
 requestOptions.find((request) => doc.cotizacion_id && request.erp_cotizacion_id === doc.cotizacion_id)?.id ||
 ""
 const [reqId, setReqId] = useState(inferredRequestId)
 const [amount, setAmount] = useState((doc.balance_pending ?? doc.total) ? String(doc.balance_pending ?? doc.total) : "")
 const [ref, setRef] = useState(doc.number || "")
 const [bank, setBank] = useState("")
 const [date, setDate] = useState("")
 const [notes, setNotes] = useState("")
 const [file, setFile] = useState<File | null>(null)
 const [submitting, setSubmitting] = useState(false)
 const submit = async () => {
 if (!session) { showToast("Inicia sesión primero", "err"); return }
 if (!reqId) { showToast("Selecciona la solicitud vinculada", "err"); return }
 const parsed = Number.parseFloat(amount)
 if (!Number.isFinite(parsed) || parsed <= 0) { showToast("Indica un monto válido", "err"); return }
 if (!ref.trim()) { showToast("Indica la referencia de la transferencia", "err"); return }
 if (!file) { showToast("Adjunta el comprobante de pago", "err"); return }
 const fileError = validateUploadFile(file, { allowedExtensions: PAYMENT_EXTENSIONS, allowedMimeTypes: PAYMENT_MIME_TYPES, maxBytes: MAX_UPLOAD_BYTES })
 if (fileError) { showToast(fileError, "err"); return }
 const docType = ["cotizacion","proforma","factura"].includes(doc.type) ? doc.type as "cotizacion"|"proforma"|"factura" : null
 if (!docType) { showToast("Tipo de documento no admite comprobante desde el portal", "err"); return }
 setSubmitting(true)
 try {
 const upload = await uploadAlitoPaymentProofFile({ quoteRequestId: reqId, file, session })
 await submitAlitoPaymentProof({
 quote_request_id: reqId, related_document_type: docType, related_document_id: doc.id,
 related_document_number: doc.number, monto_reportado: parsed, currency: doc.currency || "DOP",
 fecha_pago_reportada: date || null, metodo_reportado: "transferencia",
 banco_reportado: bank.trim() || null, referencia_reportada: ref.trim(),
 notas: notes.trim() || null, file_name: upload.fileName, storage_path: upload.storagePath, session,
 })
 showToast("Comprobante enviado. Operaciones lo revisará antes de aplicarlo. ✓")
 await onDone()
 } catch (err) { showToast(err instanceof Error ? err.message : "Error enviando comprobante", "err") }
 finally { setSubmitting(false) }
 }
 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
 <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] p-6 max-h-[90vh] overflow-y-auto">
 <div className="flex items-start justify-between mb-5">
 <div>
 <h2 className="text-lg font-black">Reportar comprobante</h2>
 <p className="text-xs text-zinc-500 dark:text-gray-500 mt-1">Notifica una transferencia para que el equipo la valide.</p>
 </div>
 <button onClick={onClose} className="text-zinc-500 dark:text-gray-500 hover:text-zinc-900 dark:text-white text-xl">✕</button>
 </div>
 <div className="rounded-xl bg-zinc-50 dark:bg-[#111] p-3 mb-4 flex items-center justify-between">
 <div><span className="text-[10px] uppercase text-zinc-500 dark:text-gray-500">{doc.type}</span><div className="text-sm font-bold">{doc.number}</div></div>
 <div className="text-base font-black text-[#f0c159]">{fmt(doc.balance_pending ?? doc.total, doc.currency || "DOP")}</div>
 </div>
 <div className="space-y-3">
 <div>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Solicitud vinculada</label>
 <select value={reqId} onChange={e => setReqId(e.target.value)}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-[#f0c159]/50 focus:outline-none">
 <option value="">Selecciona una solicitud</option>
 {requestOptions.map(r => (
 <option key={r.id} value={r.id}>{r.correlation_id} — {statusLabel(r.status)}</option>
 ))}
 </select>
 </div>
 {[["Monto reportado (DOP)","number",amount,setAmount],["Fecha del pago","date",date,setDate],["Referencia bancaria","text",ref,setRef],["Banco emisor","text",bank,setBank]].map(([label, type, val, set]) => (
 <div key={label as string}>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">{label as string}</label>
 <input type={type as string} value={val as string} onChange={e => (set as (v:string)=>void)(e.target.value)}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:border-[#f0c159]/50 focus:outline-none" />
 </div>
 ))}
 <div>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Adjuntar comprobante *</label>
 <input type="file" accept=".pdf,.png,.jpg,.jpeg"
 onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white file:mr-3 file:rounded-lg file:border-0 file:bg-[#f0c159] file:text-xs file:font-bold file:text-black file:px-2 file:py-1" />
 </div>
 <div>
 <label className="mb-1 block text-xs text-zinc-600 dark:text-gray-400">Notas</label>
 <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
 className="w-full rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-gray-600 focus:border-[#f0c159]/50 focus:outline-none resize-none" />
 </div>
 </div>
 <button onClick={submit} disabled={submitting || requestOptions.length === 0}
 className="mt-5 w-full rounded-xl bg-[#f0c159] py-3 text-sm font-bold text-black hover:bg-[#e5b84a] disabled:opacity-60">
 {submitting ? "Enviando..." : "Enviar comprobante"}
 </button>
 </div>
 </div>
 )
}
// ─── Signature Pad ─────────────────────────────────────────────────────────────
function SignaturePad({ refObject }: { refObject: React.MutableRefObject<{ getSignature: () => string | null; clear: () => void } | null> }) {
 const canvasRef = useRef<HTMLCanvasElement | null>(null)
 const drawingRef = useRef(false)
 const hasInkRef = useRef(false)
 useEffect(() => {
 refObject.current = {
 getSignature: () => (!canvasRef.current || !hasInkRef.current) ? null : canvasRef.current.toDataURL("image/png"),
 clear: () => {
 const c = canvasRef.current; if (!c) return
 c.getContext("2d")?.clearRect(0, 0, c.width, c.height)
 hasInkRef.current = false
 },
 }
 return () => { refObject.current = null }
 }, [refObject])
 const pt = (e: PointerEvent<HTMLCanvasElement>) => {
 const c = canvasRef.current!; const r = c.getBoundingClientRect()
 return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
 }
 const start = (e: PointerEvent<HTMLCanvasElement>) => {
 const c = canvasRef.current; if (!c) return
 c.setPointerCapture(e.pointerId)
 const ctx = c.getContext("2d"); if (!ctx) return
 const p = pt(e); ctx.strokeStyle = "#f0c159"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round"
 ctx.beginPath(); ctx.moveTo(p.x, p.y); drawingRef.current = true
 }
 const draw = (e: PointerEvent<HTMLCanvasElement>) => {
 if (!drawingRef.current || !canvasRef.current) return
 const ctx = canvasRef.current.getContext("2d"); if (!ctx) return
 const p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasInkRef.current = true
 }
 return (
 <div className="overflow-hidden rounded-xl border border-zinc-300 dark:border-[#2a2a2a] bg-zinc-50 dark:bg-[#111]">
 <canvas ref={canvasRef} width={800} height={180}
 onPointerDown={start} onPointerMove={draw}
 onPointerUp={() => { drawingRef.current = false }} onPointerLeave={() => { drawingRef.current = false }}
 className="h-36 w-full cursor-crosshair touch-none" />
 <div className="flex items-center justify-between border-t border-zinc-300 dark:border-[#2a2a2a] px-3 py-2">
 <span className="text-xs text-gray-600">Firma aquí con mouse o pantalla táctil</span>
 <button type="button" onClick={() => refObject.current?.clear()} className="text-xs text-zinc-500 dark:text-gray-500 hover:text-[#f0c159]">Limpiar</button>
 </div>
 </div>
 )
}

