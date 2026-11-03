
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { listSupervisors } from '@/app/actions/supervisors'
import { AinLogo } from '@/components/brand/ain-logo'
import { SupervisorManagement } from '@/components/supervisor-management'
import { getAccess, isActiveAdmin } from '@/lib/session'

export const metadata: Metadata = {
  title: 'إدارة المشرفين',
  robots: { index: false, follow: false },
}

export default async function SupervisorManagementPage() {
  const access = await getAccess()

  if (!access) {
    redirect('/sign-in')
  }

  if (access.role === 'supervisor' && access.status === 'active') {
    redirect('/supervisor')
  }

  if (!isActiveAdmin(access)) {
    redirect('/')
  }

  const supervisors = await listSupervisors()

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <AinLogo compact className="text-cyan" />
          <Link
            href="/supervisor"
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground"
          >
            <ArrowRight className="size-4 ltr:rotate-180" aria-hidden />
            العودة إلى لوحة المشرف
          </Link>
        </header>
        <SupervisorManagement
          initial={supervisors}
          currentUserId={access.id}
        />
      </div>
    </main>
  )
}
