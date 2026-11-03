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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'نظام عين',
  title: {
    default: 'نظام عين | مراقبة الطرق بالذكاء الاصطناعي',
    template: '%s | نظام عين',
  },
  description:
    'نظام عين: منصة تربط بلاغات المجتمع بغرفة العمليات، مع لوحة تحكم للمشرفين لمتابعة الحوادث والتنبيهات على الطرق.',
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
    <html lang="ar" dir="rtl" className={`dark bg-background ${cairo.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <AppPreferences />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
