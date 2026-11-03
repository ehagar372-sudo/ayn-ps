import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard/dashboard'
import { canAccessDashboard, getAccess } from '@/lib/session'

export const metadata: Metadata = {
  title: 'لوحة غرفة العمليات',
  robots: { index: false, follow: false },
}

export default async function SupervisorPage() {
  const access = await getAccess()

  // Signed out (or auth backend unavailable) -> sign in.
  if (!access) redirect('/sign-in')
  // Signed in but not an active admin/supervisor -> back to the public site.
  if (!canAccessDashboard(access)) redirect('/')

  return <Dashboard isAdmin={access.role === 'admin'} userName={access.name} />
}
