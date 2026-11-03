'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[ain] route error', error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div className="glass max-w-md rounded-3xl p-8">
        <p className="font-mono text-5xl font-bold text-destructive">!</p>
        <h1 className="mt-4 text-2xl font-bold">تعذر تحميل الصفحة</h1>
        <p className="mt-2 text-muted-foreground">حدث خطأ غير متوقع. يمكنك إعادة المحاولة أو العودة للصفحة الرئيسية.</p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground" dir="ltr">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => reset()} className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
            إعادة المحاولة
          </button>
          <Link href="/" className="rounded-xl border border-border bg-secondary/60 px-5 py-3 font-semibold text-foreground">
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  )
}
