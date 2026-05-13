import { getBaseURL } from "@lib/util/env"
import { ThemeProvider } from "@lib/context/theme-provider"
import { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "styles/globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body
        className="antialiased"
        style={{
          background: "var(--aq-bg)",
          color: "var(--aq-fg)",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        <ThemeProvider>
          <main className="relative min-h-screen">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
