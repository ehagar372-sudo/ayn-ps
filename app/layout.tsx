import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppPreferences } from '@/components/app-preferences'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'نظام عين - AI Surveillance System',
  description:
    'لوحة تحكم نظام عين للرصد الذكي: مراقبة البث المباشر، كشف الحوادث بالذكاء الاصطناعي، والإبلاغ الفوري للجهات المختصة.',
  generator: 'v0.app',
  icons: {
    icon: '/ain-logo.svg',
    apple: '/ain-logo.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#0a0e17',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`dark bg-background ${cairo.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        {children}
        <AppPreferences />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
