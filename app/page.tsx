import { Dashboard } from '@/components/dashboard/dashboard'
import { requireSession } from '@/lib/auth-guard'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await requireSession()
  if (!session) redirect('/sign-in')
  return <Dashboard />
}
