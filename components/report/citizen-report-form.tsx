'use client'

import { FormEvent, useState } from 'react'
import { CheckCircle2, Copy, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { value: 'traffic', label: 'حادث مروري' },
  { value: 'emergency', label: 'حالة طارئة' },
  { value: 'suspicious', label: 'سلوك مشبوه' },
  { value: 'infrastructure', label: 'مشكلة في البنية التحتية' },
] as const

const fieldClass =
  'mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20'

export function CitizenReportForm() {
  const [reference, setReference] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setError('')

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.get('type'),
          location: data.get('location'),
          description: data.get('description'),
          contact: data.get('contact'),
          website: data.get('website'),
        }),
      })
      const body = (await response.json().catch(() => ({}))) as { reference?: string; error?: string }

      if (!response.ok || !body.reference) {
        setError(body.error ?? 'تعذر إرسال البلاغ. حاول مرة أخرى.')
        return
      }
      setReference(body.reference)
      form.reset()
    } catch {
      setError('تعذر الاتصال بالخدمة. تحقق من الاتصال وحاول مرة أخرى.')
    } finally {
      setPending(false)
    }
  }

  async function copyReference() {
    if (!reference) return
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the reference is still visible on screen.
    }
  }

  if (reference) {
    return (
      <section role="status" className="glass rounded-2xl border-cyan/30 p-8 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-cyan text-primary-foreground">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold">تم استلام البلاغ</h2>
        <p className="mt-3 text-muted-foreground">رقمك المرجعي</p>
        <p className="mt-2 font-mono text-2xl tracking-widest text-cyan" dir="ltr">
          {reference}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-muted-foreground">
          احتفظ بهذا الرقم. لا توجد صفحة لتتبع الحالة حالياً، لكن الرقم يُسهّل الرجوع إلى بلاغك عند التواصل مع الجهة المختصة.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <button type="button" onClick={copyReference} className="flex items-center gap-1.5 text-cyan underline-offset-4 hover:underline">
            <Copy className="size-4" aria-hidden />
            {copied ? 'تم النسخ' : 'نسخ الرقم'}
          </button>
          <button type="button" onClick={() => setReference(null)} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            إرسال بلاغ آخر
          </button>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 rounded-2xl p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold">نموذج البلاغ</h2>
        <p className="mt-1 text-sm text-muted-foreground">الحقول المطلوبة مميزة بعلامة *</p>
      </div>

      <label className="block text-sm text-muted-foreground">
        نوع الحادثة *
        <select name="type" required defaultValue="traffic" className={fieldClass}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-card">
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-muted-foreground">
        الموقع *
        <input name="location" required minLength={2} maxLength={160} className={fieldClass} placeholder="الحي أو الشارع" />
      </label>

      <label className="block text-sm text-muted-foreground">
        وصف الحادثة *
        <textarea name="description" required minLength={10} maxLength={1500} rows={4} className={`${fieldClass} resize-none`} placeholder="صف ما حدث باختصار (10 أحرف على الأقل)" />
      </label>

      <label className="block text-sm text-muted-foreground">
        وسيلة تواصل (اختيارية)
        <input name="contact" maxLength={120} className={fieldClass} placeholder="رقم الهاتف أو البريد الإلكتروني" />
      </label>

      {/* Honeypot field: hidden from people and assistive tech. */}
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          الموقع الإلكتروني
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-police/40 bg-police/10 px-3 py-2 text-sm text-police">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3.5 font-bold text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--cyan)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? 'جارٍ الإرسال...' : 'إرسال البلاغ'}
      </button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        لن نطلب كلمة مرورك أو أي معلومات مالية. في الحالات الطارئة اتصل بالجهات الرسمية مباشرة.
      </p>
    </form>
  )
}
