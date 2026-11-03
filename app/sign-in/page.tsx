import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { canAccessDashboard, getAccess } from '@/lib/session'

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'دخول المشرفين إلى لوحة غرفة العمليات في نظام عين.',
}

export default async function SignInPage() {
  // Already signed in with operations-room access: skip the form.
  if (canAccessDashboard(await getAccess())) redirect('/supervisor')

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050b16] px-5 py-10"
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <Image
          src="/images/ain-logo.png"
          alt=""
          width={1100}
          height={700}
          priority
          sizes="100vw"
          className="h-full w-full object-contain opacity-25"
        />
        <div className="absolute inset-0 bg-[#050b16]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b16]/70 via-transparent to-[#050b16]/40" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <section className="flex flex-col items-center text-center md:items-start md:text-start">
          <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#091527]/90 shadow-lg shadow-cyan-500/10">
            <Image src="/images/ain-logo.png" alt="شعار نظام عين" fill sizes="96px" className="object-contain p-2" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-wide text-white sm:text-5xl">نظام عين</h1>
          <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">نظام مراقبة الطرق بالذكاء الاصطناعي</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
            رصد ذكي للحوادث ومتابعة حالة الطرق لدعم سرعة الاستجابة وتحسين السلامة المرورية.
          </p>
          <div className="mt-7 hidden items-center gap-3 md:flex" aria-hidden>
            <span className="h-1 w-12 rounded-full bg-cyan-400" />
            <span className="h-1 w-5 rounded-full bg-amber-400" />
            <span className="h-1 w-2 rounded-full bg-slate-500" />
          </div>
        </section>

        <section className="w-full rounded-3xl border border-white/10 bg-[#0b1424]/95 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
          <div className="mb-7">
            <h2 className="text-2xl font-bold">تسجيل الدخول</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              هذه الصفحة مخصصة للمشرفين. أدخل بياناتك للوصول إلى لوحة غرفة العمليات.
            </p>
          </div>

          <AuthForm mode="sign-in" />

          <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
            <span>
              مواطن وتريد الإبلاغ عن حادثة؟{' '}
              <Link href="/report" className="font-semibold text-cyan-300 underline-offset-4 hover:underline">
                أرسل بلاغاً
              </Link>
            </span>
            <Link href="/" className="text-slate-500 underline-offset-4 hover:text-slate-300 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
