'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { AinLogo } from '@/components/brand/ain-logo'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [pending, setPending] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setPending(true); setError(''); const result = mode === 'sign-up' ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password }); setPending(false); if (result.error) { setError('تعذر إتمام العملية. تحقق من البيانات وحاول مرة أخرى.'); return } router.push('/'); router.refresh() }
  return <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-6" dir="rtl"><AinLogo compact className="self-center text-cyan" /><div className="h-px bg-border" /><h1 className="text-2xl font-bold">{mode === 'sign-up' ? 'إنشاء حساب مشرف' : 'تسجيل دخول المشرفين'}</h1>{mode === 'sign-up' && <input aria-label="الاسم" required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className="rounded-lg bg-background px-3 py-2" />}<input aria-label="البريد الإلكتروني" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="rounded-lg bg-background px-3 py-2" /><input aria-label="كلمة المرور" required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="rounded-lg bg-background px-3 py-2" />{error && <p role="alert" className="text-sm text-police">{error}</p>}<button disabled={pending} className="rounded-lg bg-cyan px-4 py-2 font-bold text-background disabled:opacity-60">{pending ? 'جارٍ المعالجة...' : mode === 'sign-up' ? 'إنشاء الحساب' : 'دخول'}</button></form>
}
