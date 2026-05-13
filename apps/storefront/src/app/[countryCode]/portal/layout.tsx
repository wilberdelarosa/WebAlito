import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function AlitoPortalLayout(props: {
  children: React.ReactNode
}) {
  return <>{props.children}</>
}
