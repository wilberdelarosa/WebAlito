export type AlitoCatalogFamily = {
  id: string
  title: string
  eyebrow: string
  summary: string
  imageSlot: string
  requiredContext: string[]
  items: string[]
  familyRequiresGuidedForm?: boolean
  familyAllowsPriceHint?: boolean
  familyManualReviewFrequency?: string
}

export const alitoCatalogFamilies: AlitoCatalogFamily[] = [
  {
    id: "suministros",
    title: "Suministros y materiales",
    eyebrow: "Arena, caliche, grava, relleno",
    summary:
      "Materiales cotizables por volumen, viajes y zona. Siempre se valida ubicacion, subtipo y capacidad disponible.",
    imageSlot: "catalogo-suministros-principal",
    requiredContext: ["material", "cantidad", "ubicacion", "unidad", "capacidad de camion"],
    items: ["Arena", "Caliche", "Grava", "Relleno", "Capa vegetal", "Subbase"],
    familyRequiresGuidedForm: true,
    familyAllowsPriceHint: true,
    familyManualReviewFrequency: "media",
  },
  {
    id: "camiones",
    title: "Camiones y bote",
    eyebrow: "10 m3, 14 m3, 22 m3",
    summary:
      "Flota para suministro, bote y transporte de material. La capacidad del camion es parte obligatoria de la logica de precio.",
    imageSlot: "catalogo-camiones-flota",
    requiredContext: ["uso", "capacidad", "origen", "destino", "material", "cantidad", "ida_retorno"],
    items: ["SINOTRUCK ZZ3257V384JB1", "SINOTRUCK ZZ3167N3817B1", "HOWO T1", "JAC HFC3086K"],
    familyRequiresGuidedForm: true,
    familyAllowsPriceHint: true,
    familyManualReviewFrequency: "media_alta",
  },
  {
    id: "equipos",
    title: "Equipos pesados",
    eyebrow: "Excavadoras, retropalas, rodillos",
    summary:
      "Equipos alquilables o de servicio. La ficha, marca, modelo y tonelaje ayudan a convertir una solicitud abierta en una cotizacion real.",
    imageSlot: "catalogo-equipos-pesados",
    requiredContext: ["equipo", "clase o tonelaje", "duracion", "ubicacion", "transporte", "accesorios"],
    items: ["Excavadora 13-33 Ton", "Miniexcavadora", "Retropala 7.5 Ton", "Rodillo 2.7-11 Ton", "Tractor D6"],
    familyRequiresGuidedForm: true,
    familyAllowsPriceHint: true,
    familyManualReviewFrequency: "media",
  },
  {
    id: "servicios",
    title: "Servicios en obra",
    eyebrow: "Movimiento, excavacion, compactacion",
    summary:
      "Partidas contextuales que no deben venderse como precio fijo. Requieren revision por zona, suelo, acceso, productividad y alcance.",
    imageSlot: "catalogo-servicios-obra",
    requiredContext: ["tipo de trabajo", "metraje", "suelo", "zona", "restricciones", "plazo"],
    items: ["Excavacion", "Movimiento de tierra", "Movimiento de material", "Compactacion", "Transporte de equipo"],
    familyRequiresGuidedForm: true,
    familyAllowsPriceHint: false,
    familyManualReviewFrequency: "muy_alta",
  },
]

export const alitoTruckMatrix = [
  { capacity: "10 m3", model: "9M3 / camion volteo liviano", use: "viajes ligeros y accesos limitados" },
  { capacity: "14 m3", model: "SINOTRUCK ZZ3167N3817B1 / JAC", use: "suministro medio, bote y transporte" },
  { capacity: "22 m3", model: "SINOTRUCK ZZ3257V384JB1 / HOWO T1", use: "alto volumen, caliche, arena, relleno" },
]

export const alitoQuoteStatuses = [
  "recibida",
  "en_revision",
  "cotizada",
  "proforma_generada",
  "factura_solicitada",
  "facturada",
]

export const alitoImageSlots = [
  {
    id: "hero-flota-principal",
    label: "Hero principal",
    target: "Inicio",
    note: "Imagen amplia de flota, equipos o patio ALITO. Debe reemplazar el bloque visual del hero.",
  },
  {
    id: "catalogo-suministros-principal",
    label: "Materiales",
    target: "Catalogo",
    note: "Arena, grava, caliche o relleno con camiones cargando.",
  },
  {
    id: "catalogo-camiones-flota",
    label: "Camiones",
    target: "Catalogo",
    note: "Sinotruk/JAC por capacidad, idealmente mostrando 10 m3, 14 m3 y 22 m3.",
  },
  {
    id: "catalogo-equipos-pesados",
    label: "Equipos",
    target: "Catalogo",
    note: "Excavadoras, retropalas, rodillos, minicargadores o tractor de orugas.",
  },
]

export const alitoQuoteRequiredFields = [
  "nombre",
  "telefono",
  "ubicacion",
  "fecha estimada",
  "familia operativa",
  "cantidad o duracion",
]
