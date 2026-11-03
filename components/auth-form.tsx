'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20'

/**
 * Form only. The surrounding page provides the logo, heading and card so the
 * same form can sit inside different layouts without duplicating titles.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')

    try {
      const result =
        mode === 'sign-up'
          ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
          : await authClient.signIn.email({ email: email.trim(), password })

      if (result.error) {
        setError(
          mode === 'sign-in'
            ? 'بيانات الدخول غير صحيحة.'
            : 'تعذر إنشاء الحساب. قد يكون البريد مستخدماً بالفعل.',
        )
        return
      }

      // The server decides where the account may go: /supervisor sends
      // accounts without operations-room access back to the home page.
      router.replace(mode === 'sign-in' ? '/supervisor' : '/')
      router.refresh()
    } catch {
      setError('تعذر الاتصال بالخدمة. تحقق من الاتصال وحاول مرة أخرى.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4" noValidate={false}>
      {mode === 'sign-up' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-name" className="text-xs font-medium text-muted-foreground">
            الاسم
          </label>
          <input
            id="auth-name"
            required
            minLength={2}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم الكامل"
            className={fieldClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-email" className="text-xs font-medium text-muted-foreground">
          البريد الإلكتروني
        </label>
        <input
          id="auth-email"
          required
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className={`${fieldClass} text-start`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-password" className="text-xs font-medium text-muted-foreground">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="auth-password"
            required
            minLength={8}
            type={showPassword ? 'text' : 'password'}
            dir="ltr"
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 أحرف على الأقل"
            className={`${fieldClass} pe-11 text-start`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            className="absolute end-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-police/40 bg-police/10 px-3 py-2 text-sm text-police">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan px-4 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--cyan)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? 'جارٍ المعالجة...' : mode === 'sign-up' ? 'إنشاء الحساب' : 'تسجيل الدخول'}
      </button>
    </form>
  )
}
