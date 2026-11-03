import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'الصفحة غير موجودة' }

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div className="glass max-w-md rounded-3xl p-8">
        <p className="font-mono text-5xl font-bold text-cyan">404</p>
        <h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-muted-foreground">الرابط المطلوب غير متاح في نظام عين.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
            العودة للصفحة الرئيسية
          </Link>
          <Link href="/report" className="inline-flex justify-center rounded-xl border border-border bg-secondary/60 px-5 py-3 font-semibold text-foreground">
            إرسال بلاغ
          </Link>
        </div>
      </div>
    </main>
  )
}
