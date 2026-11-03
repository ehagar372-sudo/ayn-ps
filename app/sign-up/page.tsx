import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AinLogo } from '@/components/brand/ain-logo'
import { AuthForm } from '@/components/auth-form'
import { canAccessDashboard, getAccess } from '@/lib/session'

export const metadata: Metadata = {
  title: 'إنشاء حساب',
  description: 'إنشاء حساب عادي في نظام عين.',
}

export default async function SignUpPage() {
  if (canAccessDashboard(await getAccess())) redirect('/supervisor')

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass w-full max-w-md rounded-3xl p-6 sm:p-8">
        <AinLogo compact className="mb-6 text-cyan" />
        <h1 className="text-2xl font-bold">إنشاء حساب</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          هذا الحساب لا يمنح صلاحية دخول غرفة العمليات. حسابات المشرفين يُنشئها مدير النظام من صفحة إدارة المشرفين.
        </p>

        <div className="mt-6">
          <AuthForm mode="sign-up" />
        </div>

        <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          لديك حساب مشرف؟{' '}
          <Link href="/sign-in" className="font-semibold text-cyan underline-offset-4 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  )
}
