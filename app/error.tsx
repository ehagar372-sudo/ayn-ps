'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[v0] AIN route error', error) }, [error])
  return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div className="glass max-w-md rounded-3xl p-8"><p className="font-mono text-5xl font-bold text-destructive">!</p><h1 className="mt-4 text-2xl font-bold">تعذر تحميل الصفحة</h1><p className="mt-2 text-muted-foreground">حدث خطأ غير متوقع. يمكنك إعادة المحاولة.</p><button onClick={() => reset()} className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">إعادة المحاولة</button></div></main>
}
