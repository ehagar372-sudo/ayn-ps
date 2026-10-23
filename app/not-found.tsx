import Link from 'next/link'

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div className="glass max-w-md rounded-3xl p-8"><p className="font-mono text-5xl font-bold text-cyan">404</p><h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1><p className="mt-2 text-muted-foreground">الرابط المطلوب غير متاح في نظام عين.</p><Link href="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">العودة للوحة التحكم</Link></div></main>
}
