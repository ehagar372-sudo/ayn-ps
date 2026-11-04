'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20'

type Feedback = { tone: 'ok' | 'error'; text: string } | null

function Message({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return (
    <p
      role={feedback.tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-3 py-2 text-sm ${
        feedback.tone === 'ok' ? 'border-resolved/40 bg-resolved/10 text-resolved' : 'border-police/40 bg-police/10 text-police'
      }`}
    >
      {feedback.text}
    </p>
  )
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-cyan px-5 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--cyan)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function SettingsPanel({ name, email, roleLabel }: { name: string; email: string; roleLabel: string }) {
  const router = useRouter()

  const [displayName, setDisplayName] = useState(name)
  const [nameBusy, setNameBusy] = useState(false)
  const [nameMsg, setNameMsg] = useState<Feedback>(null)

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState<Feedback>(null)

  const [sessionBusy, setSessionBusy] = useState(false)
  const [sessionMsg, setSessionMsg] = useState<Feedback>(null)

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = displayName.trim()
    if (nameBusy || clean.length < 2) return setNameMsg({ tone: 'error', text: 'الاسم يجب ألا يقل عن حرفين.' })
    setNameBusy(true)
    setNameMsg(null)
    try {
      const result = await authClient.updateUser({ name: clean })
      if (result.error) return setNameMsg({ tone: 'error', text: 'تعذر حفظ الاسم.' })
      setNameMsg({ tone: 'ok', text: 'تم حفظ الاسم.' })
      router.refresh()
    } catch {
      setNameMsg({ tone: 'error', text: 'تعذر الاتصال بالخدمة.' })
    } finally {
      setNameBusy(false)
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pwBusy) return
    if (next.length < 8) return setPwMsg({ tone: 'error', text: 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.' })
    if (next !== confirm) return setPwMsg({ tone: 'error', text: 'تأكيد كلمة المرور غير مطابق.' })
    if (next === current) return setPwMsg({ tone: 'error', text: 'اختر كلمة مرور مختلفة عن الحالية.' })
    setPwBusy(true)
    setPwMsg(null)
    try {
      const result = await authClient.changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true })
      if (result.error) return setPwMsg({ tone: 'error', text: 'كلمة المرور الحالية غير صحيحة.' })
      setCurrent('')
      setNext('')
      setConfirm('')
      setPwMsg({ tone: 'ok', text: 'تم تغيير كلمة المرور وإنهاء الجلسات الأخرى.' })
    } catch {
      setPwMsg({ tone: 'error', text: 'تعذر الاتصال بالخدمة.' })
    } finally {
      setPwBusy(false)
    }
  }

  async function revokeOthers() {
    if (sessionBusy) return
    setSessionBusy(true)
    setSessionMsg(null)
    try {
      const result = await authClient.revokeOtherSessions()
      setSessionMsg(result.error ? { tone: 'error', text: 'تعذر إنهاء الجلسات.' } : { tone: 'ok', text: 'تم إنهاء الجلسات على الأجهزة الأخرى.' })
    } catch {
      setSessionMsg({ tone: 'error', text: 'تعذر الاتصال بالخدمة.' })
    } finally {
      setSessionBusy(false)
    }
  }

  async function signOut() {
    await authClient.signOut()
    router.replace('/sign-in')
    router.refresh()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section aria-labelledby="profile-title" className="glass flex flex-col gap-4 rounded-2xl p-5">
        <h2 id="profile-title" className="text-sm font-bold">
          الملف الشخصي
        </h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <dt className="text-xs text-muted-foreground">البريد الإلكتروني</dt>
            <dd className="mt-1 truncate font-mono text-xs" dir="ltr">
              {email}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <dt className="text-xs text-muted-foreground">الدور</dt>
            <dd className="mt-1 font-semibold">{roleLabel}</dd>
          </div>
        </dl>
        <form onSubmit={saveName} className="flex flex-col gap-3">
          <label htmlFor="settings-name" className="text-xs font-medium text-muted-foreground">
            الاسم المعروض
          </label>
          <input id="settings-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} minLength={2} maxLength={100} required className={fieldClass} />
          <Message feedback={nameMsg} />
          <Submit pending={nameBusy}>حفظ الاسم</Submit>
        </form>
      </section>

      <section aria-labelledby="password-title" className="glass flex flex-col gap-4 rounded-2xl p-5">
        <h2 id="password-title" className="text-sm font-bold">
          تغيير كلمة المرور
        </h2>
        <form onSubmit={savePassword} className="flex flex-col gap-3">
          <input type="password" dir="ltr" autoComplete="current-password" required aria-label="كلمة المرور الحالية" placeholder="كلمة المرور الحالية" value={current} onChange={(e) => setCurrent(e.target.value)} className={`${fieldClass} text-start`} />
          <input type="password" dir="ltr" autoComplete="new-password" required minLength={8} maxLength={128} aria-label="كلمة المرور الجديدة" placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)" value={next} onChange={(e) => setNext(e.target.value)} className={`${fieldClass} text-start`} />
          <input type="password" dir="ltr" autoComplete="new-password" required aria-label="تأكيد كلمة المرور الجديدة" placeholder="تأكيد كلمة المرور الجديدة" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${fieldClass} text-start`} />
          <Message feedback={pwMsg} />
          <Submit pending={pwBusy}>تغيير كلمة المرور</Submit>
        </form>
      </section>

      <section aria-labelledby="sessions-title" className="glass flex flex-col gap-4 rounded-2xl p-5 lg:col-span-2">
        <h2 id="sessions-title" className="text-sm font-bold">
          الجلسات
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          إن استخدمت حسابك على جهاز غير جهازك، أنهِ الجلسات الأخرى مع إبقاء هذه الجلسة مفتوحة.
        </p>
        <Message feedback={sessionMsg} />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={revokeOthers}
            disabled={sessionBusy}
            className="flex h-11 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-5 text-sm font-semibold transition-colors hover:border-cyan/50 disabled:opacity-60"
          >
            {sessionBusy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            إنهاء الجلسات الأخرى
          </button>
          <button
            type="button"
            onClick={signOut}
            className="h-11 rounded-xl border border-police/50 bg-police/10 px-5 text-sm font-semibold text-police transition-colors hover:bg-police/20"
          >
            تسجيل الخروج
          </button>
        </div>
      </section>
    </div>
  )
}
