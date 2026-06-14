// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { barlow, limelight, bodyFontClassName } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'A Colorful History',
  description: 'Painting, photography and history — Bernard Bolter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${barlow.variable} ${limelight.variable}`}
    >
      <body className={`${bodyFontClassName} antialiased`}>{children}</body>
    </html>
  )
}
