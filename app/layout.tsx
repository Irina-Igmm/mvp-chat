import type React from "react"
import "./globals.css"
import { Montserrat } from "next/font/google"
import ChatWidget from "@/components/chat-widget"

// Initialiser Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${montserrat.variable}`}>
      <head>
        <title>Assistant audit énergétique</title>
        <meta name="description" content="Assistant intelligent pour l'audit énergétique de votre bâtiment" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-gradient-to-br from-blue-50 to-white min-h-screen font-montserrat">
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}

