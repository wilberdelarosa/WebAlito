export type AlitoCatalogImage = {
  id: string
  family: string
  name: string
  model: string
  url: string
}

export const ALITO_CATALOG_IMAGES: Record<string, AlitoCatalogImage> = {
  // Excavadoras grandes
  "EXC-CAT320":   { id: "EXC-CAT320",   family: "Excavadoras",      name: "Excavadora CAT 320-07",             model: "CAT 320-07",     url: "/alito-catalog/EXC-CAT320.png"    },
  "EXC-CAT333":   { id: "EXC-CAT333",   family: "Excavadoras",      name: "Excavadora CAT 333-07",             model: "CAT 333-07",     url: "/alito-catalog/EXC-CAT333.png"    },
  "EXC-CAT326":   { id: "EXC-CAT326",   family: "Excavadoras",      name: "Excavadora CAT 326-07",             model: "CAT 326-07",     url: "/alito-catalog/EXC-CAT326.png"    },
  "EXC-CAT313":   { id: "EXC-CAT313",   family: "Excavadoras",      name: "Excavadora CAT 313",                model: "CAT 313",        url: "/alito-catalog/EXC-CAT313.png"    },
  "EXC-VOL140":   { id: "EXC-VOL140",   family: "Excavadoras",      name: "Excavadora Volvo 140DL",            model: "Volvo 140DL",    url: "/alito-catalog/EXC-VOL140.png"    },
  "EXC-SDLG150":  { id: "EXC-SDLG150",  family: "Excavadoras",      name: "Excavadora SDLG E6150F",            model: "SDLG E6150F",    url: "/alito-catalog/EXC-SDLG150.png"   },
  // Miniretros / Miniexcavadoras
  "MRT-VOLEC55D": { id: "MRT-VOLEC55D", family: "Miniretros",       name: "Miniretro Volvo EC55D",             model: "Volvo EC55D",    url: "/alito-catalog/MRT-VOLEC55D.png"  },
  "MRT-CAT305":   { id: "MRT-CAT305",   family: "Miniretros",       name: "Miniexcavadora CAT 305-07CR",       model: "CAT 305-07CR",   url: "/alito-catalog/MRT-CAT305.png"    },
  "MRT-SDLG660":  { id: "MRT-SDLG660",  family: "Miniretros",       name: "Miniretro SDLG E660FL",             model: "SDLG E660FL",    url: "/alito-catalog/MRT-SDLG660.png"   },
  // Minicargadores
  "MCG-CAT216B":  { id: "MCG-CAT216B",  family: "Minicargadores",   name: "Minicargador CAT 216B3LRC",         model: "CAT 216B3LRC",   url: "/alito-catalog/MCG-CAT216B.png"   },
  "MCG-CAT236D":  { id: "MCG-CAT236D",  family: "Minicargadores",   name: "Minicargador CAT 236D",             model: "CAT 236D",       url: "/alito-catalog/MCG-CAT236D.png"   },
  "MCG-CAT232D":  { id: "MCG-CAT232D",  family: "Minicargadores",   name: "Minicargador CAT 232D",             model: "CAT 232D",       url: "/alito-catalog/MCG-CAT232D.png"   },
  // Retropalas
  "RTP-CAT416":   { id: "RTP-CAT416",   family: "Retropalas",       name: "Retropala CAT 416-07LRC",           model: "CAT 416-07LRC",  url: "/alito-catalog/RTP-CAT416.png"    },
  // Rodillos
  "ROD-CAT27":    { id: "ROD-CAT27",    family: "Rodillos",         name: "Compactador CAT CB2.7LRC",          model: "CAT CB2.7LRC",   url: "/alito-catalog/ROD-CAT27.png"     },
  "ROD-CAT11":    { id: "ROD-CAT11",    family: "Rodillos",         name: "Rodillo CAT GS11",                  model: "CAT GS11",       url: "/alito-catalog/ROD-CAT11.png"     },
  "ROD-AMM70":    { id: "ROD-AMM70",    family: "Rodillos",         name: "Rodillo Ammann ASC 70",             model: "Ammann ASC 70",  url: "/alito-catalog/ROD-AMM70.png"     },
  // Montacargas
  "MCF-CAT":      { id: "MCF-CAT",      family: "Montacargas",      name: "Montacargas CAT MCF",               model: "CAT MCF",        url: "/alito-catalog/MCF-CAT.png"       },
  // Telehandler
  "TLH-JLG943":   { id: "TLH-JLG943",  family: "Telehandler",      name: "Telehandler JLG 943",               model: "JLG 943",        url: "/alito-catalog/TLH-JLG943.png"    },
  // Tractor de Orugas
  "TRC-CATD6":    { id: "TRC-CATD6",    family: "Tractor de Orugas",name: "Tractor CAT D6",                    model: "CAT D6",         url: "/alito-catalog/TRC-CATD6.png"     },
  // Camiones
  "CAM-SNT22":    { id: "CAM-SNT22",    family: "Camiones",         name: "Sinotruk HOWO ZZ3257V384JB1 22m³", model: "HOWO ZZ3257",    url: "/alito-catalog/CAM-SNT22.png"     },
  "CAM-SNT14":    { id: "CAM-SNT14",    family: "Camiones",         name: "Sinotruk HOWO ZZ3167N 14m³",       model: "HOWO ZZ3167",    url: "/alito-catalog/CAM-SNT14.png"     },
  "CAM-SNT10":    { id: "CAM-SNT10",    family: "Camiones",         name: "Sinotruk Volteo Liviano 9m³",      model: "Sinotruk 9m³",   url: "/alito-catalog/CAM-SNT10.png"     },
  "CAM-JAC14":    { id: "CAM-JAC14",    family: "Camiones",         name: "JAC HFC3086K 14m³",                model: "JAC HFC3086K",   url: "/alito-catalog/CAM-JAC14.png"     },
  "GRU-JAC":      { id: "GRU-JAC",      family: "Camiones",         name: "JAC HFC1120KN Grúa Soporte",       model: "JAC HFC1120KN",  url: "/alito-catalog/GRU-JAC.png"       },
  // Materiales — real JPG photos
  "SUM-ARENA":    { id: "SUM-ARENA",    family: "Materiales",       name: "Arena Gruesa",                     model: "Arena lavada",    url: "/alito-catalog/SUM-ARENA.jpg"     },
  "SUM-ARENA-CAL":{ id: "SUM-ARENA-CAL",family: "Materiales",       name: "Arena Caliza",                     model: "Arena caliza",    url: "/alito-catalog/SUM-ARENA.jpg"     },
  "SUM-GRAVA":    { id: "SUM-GRAVA",    family: "Materiales",       name: "Grava",                            model: "Grava natural",   url: "/alito-catalog/SUM-GRAVA.jpg"     },
  "SUM-PIEDRA":   { id: "SUM-PIEDRA",   family: "Materiales",       name: "Grava Triturada / Piedra",         model: "Piedra triturada", url: "/alito-catalog/SUM-PIEDRA.jpg"   },
  "SUM-CALICHE":  { id: "SUM-CALICHE",  family: "Materiales",       name: "Caliche",                          model: "Caliche base",    url: "/alito-catalog/SUM-CALICHE.jpg"   },
  "SUM-CAPA":     { id: "SUM-CAPA",     family: "Materiales",       name: "Capa Vegetal",                     model: "Tierra vegetal",  url: "/alito-catalog/SUM-ARENA.jpg"     },
  "SUM-RELLENO":  { id: "SUM-RELLENO",  family: "Materiales",       name: "Relleno",                          model: "Tierra negra",    url: "/alito-catalog/SUM-RELLENO.jpg"   },
}

const CATALOG_ITEM_TO_IMAGE_ID: Record<string, string> = {
  suministro_arena:           "SUM-ARENA",
  suministro_caliche:         "SUM-CALICHE",
  suministro_grava:           "SUM-GRAVA",
  suministro_piedra:          "SUM-PIEDRA",
  suministro_relleno:         "SUM-RELLENO",
  suministro_capa_subbase:   "SUM-CAPA",
  bote_material:              "CAM-SNT22",
  bote_escombros:             "CAM-SNT22",
  traslado_material:          "CAM-JAC14",
  alquiler_excavadora:        "EXC-CAT320",
  alquiler_miniretro:         "MRT-CAT305",
  alquiler_retropala:         "RTP-CAT416",
  alquiler_minicargador:      "MCG-CAT236D",
  alquiler_rodillo:           "ROD-CAT27",
  alquiler_telehandler:       "TLH-JLG943",
  alquiler_montacargas:       "MCF-CAT",
  alquiler_tractor_orugas:    "TRC-CATD6",
  transporte_minicargador:    "MCG-CAT236D",
  transporte_rodillo:         "ROD-CAT27",
  transporte_retropala:       "RTP-CAT416",
  transporte_miniretro:       "MRT-CAT305",
  transporte_excavadora:      "EXC-CAT326",
  transporte_equipo_especial: "GRU-JAC",
  excavacion:                 "EXC-CAT320",
  excavacion_piscina_sotano:  "EXC-CAT313",
  desbroce:                   "MCG-CAT236D",
  perfilado:                  "MRT-CAT305",
  regado_compactado:          "ROD-AMM70",
}

const FAMILY_DEFAULT_IMAGE_ID: Record<string, string> = {
  materiales:            "SUM-ARENA",
  bote_traslado:         "CAM-SNT22",
  alquiler_equipos:      "EXC-CAT320",
  transporte_equipos:    "GRU-JAC",
  excavacion_movimiento: "EXC-CAT320",
}

function normalize(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
}

// Name-based keyword mapping for fallback catalog items (suministros_1, etc.)
const DISPLAY_NAME_IMAGE_MAP: Array<[RegExp, string]> = [
  [/caliche/i,              "SUM-CALICHE"],
  [/piedra/i,               "SUM-PIEDRA"],
  [/grava.trit/i,           "SUM-PIEDRA"],
  [/grava/i,                "SUM-GRAVA"],
  [/arena.caliza/i,         "SUM-ARENA-CAL"],
  [/arena/i,                "SUM-ARENA"],
  [/relleno/i,              "SUM-RELLENO"],
  [/capa.vegetal/i,         "SUM-CAPA"],
  [/subbase/i,              "SUM-CAPA"],
  [/camion|bote|sinotruk|sinotruck|howo|jac\s/i, "CAM-SNT22"],
  [/excavaci/i,             "EXC-CAT320"],
  [/transporte/i,           "GRU-JAC"],
  [/compacta|rodillo/i,     "ROD-CAT27"],
  [/movimiento/i,           "EXC-CAT320"],
]

export function getCatalogItemImage(
  itemCode?: string | null,
  familyCode?: string | null,
  displayName?: string | null
) {
  // 1. Exact item_code match
  const byCode = CATALOG_ITEM_TO_IMAGE_ID[itemCode || ""] || FAMILY_DEFAULT_IMAGE_ID[familyCode || ""]
  if (byCode) return ALITO_CATALOG_IMAGES[byCode]
  // 2. Family code default
  const byFamily = FAMILY_DEFAULT_IMAGE_ID[familyCode || ""]
  if (byFamily) return ALITO_CATALOG_IMAGES[byFamily]
  // 3. Keyword match on display name (handles fallback catalog items)
  if (displayName) {
    for (const [pattern, id] of DISPLAY_NAME_IMAGE_MAP) {
      if (pattern.test(displayName)) return ALITO_CATALOG_IMAGES[id]
    }
  }
  // 4. If family suggests suministros, use arena as generic
  if (/suministro/i.test(familyCode || "")) return ALITO_CATALOG_IMAGES["SUM-ARENA"]
  return null
}

export function getEquipmentImage(equipment: {
  family?: string | null
  display_name?: string | null
  marca?: string | null
  modelo?: string | null
  normalized_model?: string | null
  commercial_capacity_m3?: number | null
  class_tonnage?: number | null
}) {
  const text = normalize([
    equipment.family,
    equipment.display_name,
    equipment.marca,
    equipment.modelo,
    equipment.normalized_model,
    equipment.commercial_capacity_m3,
    equipment.class_tonnage,
  ].join(" "))

  if (text.includes("333"))                               return ALITO_CATALOG_IMAGES["EXC-CAT333"]
  if (text.includes("326"))                               return ALITO_CATALOG_IMAGES["EXC-CAT326"]
  if (text.includes("320"))                               return ALITO_CATALOG_IMAGES["EXC-CAT320"]
  if (text.includes("313"))                               return ALITO_CATALOG_IMAGES["EXC-CAT313"]
  if (text.includes("volvo") && text.includes("140"))     return ALITO_CATALOG_IMAGES["EXC-VOL140"]
  if (text.includes("sdlg") && (text.includes("e6150") || text.includes("6150") || text.includes("150f"))) return ALITO_CATALOG_IMAGES["EXC-SDLG150"]
  if (text.includes("216"))                               return ALITO_CATALOG_IMAGES["MCG-CAT216B"]
  if (text.includes("236"))                               return ALITO_CATALOG_IMAGES["MCG-CAT236D"]
  if (text.includes("232"))                               return ALITO_CATALOG_IMAGES["MCG-CAT232D"]
  if (text.includes("ec55"))                              return ALITO_CATALOG_IMAGES["MRT-VOLEC55D"]
  if (text.includes("305"))                               return ALITO_CATALOG_IMAGES["MRT-CAT305"]
  if (text.includes("e660"))                              return ALITO_CATALOG_IMAGES["MRT-SDLG660"]
  if (text.includes("416") || text.includes("retropala")) return ALITO_CATALOG_IMAGES["RTP-CAT416"]
  if (text.includes("gs11") || text.includes("11tl"))     return ALITO_CATALOG_IMAGES["ROD-CAT11"]
  if (text.includes("ammann") || text.includes("asc70"))  return ALITO_CATALOG_IMAGES["ROD-AMM70"]
  if (text.includes("rodillo") || text.includes("2.7"))   return ALITO_CATALOG_IMAGES["ROD-CAT27"]
  if (text.includes("montacarga") || text.includes("mcf")) return ALITO_CATALOG_IMAGES["MCF-CAT"]
  if (text.includes("telehandler") || text.includes("943")) return ALITO_CATALOG_IMAGES["TLH-JLG943"]
  if (text.includes("tractor") || text.includes("d6"))    return ALITO_CATALOG_IMAGES["TRC-CATD6"]
  if (text.includes("grua"))                              return ALITO_CATALOG_IMAGES["GRU-JAC"]
  if (text.includes("jac"))                               return ALITO_CATALOG_IMAGES["CAM-JAC14"]
  if (text.includes("10 m3") || text.includes("9m3") || text.includes("9 m3") || text.includes("10 m³") || text.includes("10m³") || text.includes("9m³") || text.includes("9 m³")) return ALITO_CATALOG_IMAGES["CAM-SNT10"]
  if (text.includes("14 m3") || text.includes("14m3") || text.includes("14 m³") || text.includes("14m³")) return ALITO_CATALOG_IMAGES["CAM-SNT14"]
  if (text.includes("22 m3") || text.includes("howo") || text.includes("22m3") || text.includes("22 m³") || text.includes("22m³")) return ALITO_CATALOG_IMAGES["CAM-SNT22"]

  return null
}
