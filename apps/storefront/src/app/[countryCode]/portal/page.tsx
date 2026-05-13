import { Metadata } from "next"
import { redirect } from "next/navigation"
import AlitoPortal from "@modules/alito/portal"
import { getRegion, listRegions } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Portal ALITO | Cotizador",
  description: "Portal publico ALITO para catalogo, solicitudes, seguimiento y aprobaciones de cotizacion.",
}

export default async function AlitoPortalPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode).catch(() => null)

  if (!region) {
    const regions = await listRegions().catch(() => [])
    const fallbackFromEnv = (process.env.NEXT_PUBLIC_DEFAULT_REGION || "").toLowerCase()
    const fallbackFromRegions = regions
      .flatMap((entry) => entry.countries || [])
      .map((country) => (country?.iso_2 || "").toLowerCase())
      .find(Boolean)
    const fallbackCountry = fallbackFromEnv || fallbackFromRegions || ""

    if (fallbackCountry && fallbackCountry !== countryCode.toLowerCase()) {
      redirect(`/${fallbackCountry}/portal`)
    }
  }

  return <AlitoPortal />
}
