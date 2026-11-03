'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
import { createSupervisor, updateSupervisor } from '@/app/actions/supervisors'

type Supervisor = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: Date
}

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20'

export function SupervisorManagement({ initial, currentUserId }: { initial: Supervisor[]; currentUserId: string }) {
  const [rows, setRows] = useState(initial)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  // The server action revalidates this page; pick up the fresh list.
  useEffect(() => setRows(initial), [initial])

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setError('')
    setMessage('')

    startTransition(async () => {
      const result = await createSupervisor({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        password: String(data.get('password') ?? ''),
      })
      if (!result.ok) return setError(result.error)
      setMessage('تم إنشاء حساب المشرف بنجاح.')
      setOpen(false)
      form.reset()
    })
  }

  function onToggle(row: Supervisor) {
    const next = row.status === 'active' ? 'inactive' : 'active'
    const question =
      next === 'inactive'
        ? `هل تريد إيقاف وصول ${row.name}؟ سيتم إنهاء جلساته الحالية.`
        : `هل تريد إعادة تفعيل حساب ${row.name}؟`
    if (!window.confirm(question)) return
    setError('')
    setMessage('')

    startTransition(async () => {
      const result = await updateSupervisor(row.id, next, row.role === 'admin' ? 'admin' : 'supervisor')
      if (!result.ok) return setError(result.error)
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)))
      setMessage('تم تحديث حالة الحساب.')
    })
  }

  return (
    <section className="glass mt-6 rounded-2xl p-5 md:p-6" aria-labelledby="supervisors-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="supervisors-title" className="text-xl font-bold">
            إدارة المشرفين
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">إضافة الحسابات المصرّح لها بدخول غرفة العمليات وإيقافها.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-10 items-center gap-2 rounded-xl bg-cyan px-4 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--cyan)]"
        >
          <UserPlus className="size-4" aria-hidden />
          إضافة مشرف جديد
        </button>
      </div>

      {message && (
        <p role="status" className="mt-4 rounded-xl border border-resolved/40 bg-resolved/10 px-3 py-2 text-sm text-resolved">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-police/40 bg-police/10 px-3 py-2 text-sm text-police">
          {error}
        </p>
      )}

      {open && (
        <form onSubmit={onCreate} className="mt-5 grid gap-3 rounded-xl border border-border bg-secondary/40 p-4 md:grid-cols-3">
          <input name="name" required minLength={2} maxLength={100} autoComplete="off" placeholder="الاسم الكامل" aria-label="الاسم الكامل" className={fieldClass} />
          <input name="email" required type="email" dir="ltr" autoComplete="off" placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني" className={`${fieldClass} text-start`} />
          <input name="password" required minLength={8} maxLength={128} type="password" dir="ltr" autoComplete="new-password" placeholder="كلمة مرور مؤقتة (8 أحرف على الأقل)" aria-label="كلمة المرور المؤقتة" className={`${fieldClass} text-start`} />
          <button
            type="submit"
            disabled={pending}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan/60 bg-cyan/10 px-4 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/20 disabled:opacity-50 md:col-span-3 md:w-fit"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? 'جارٍ الحفظ...' : 'حفظ المشرف'}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="p-3 text-start font-medium">الاسم</th>
              <th scope="col" className="p-3 text-start font-medium">البريد</th>
              <th scope="col" className="p-3 text-start font-medium">الدور</th>
              <th scope="col" className="p-3 text-start font-medium">الحالة</th>
              <th scope="col" className="p-3 text-start font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelf = row.id === currentUserId
              const active = row.status === 'active'
              return (
                <tr key={row.id} className="border-t border-border/60">
                  <td className="p-3 font-medium">
                    {row.name}
                    {isSelf && <span className="ms-2 text-xs text-muted-foreground">(أنت)</span>}
                  </td>
                  <td className="p-3 text-muted-foreground" dir="ltr">{row.email}</td>
                  <td className="p-3">{row.role === 'admin' ? 'مدير' : 'مشرف'}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        active ? 'border-resolved/50 bg-resolved/10 text-resolved' : 'border-border bg-secondary/60 text-muted-foreground'
                      }`}
                    >
                      {active ? 'نشط' : 'موقوف'}
                    </span>
                  </td>
                  <td className="p-3">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onToggle(row)}
                        className="text-cyan underline-offset-4 hover:underline disabled:opacity-50"
                      >
                        {active ? 'إيقاف' : 'تفعيل'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-muted-foreground">لا يوجد مشرفون بعد.</p>}
      </div>
    </section>
  )
}
