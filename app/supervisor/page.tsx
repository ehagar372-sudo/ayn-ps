import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { Dashboard } from '@/components/dashboard/dashboard'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export default async function SupervisorPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const [current] = await db
    .select({ role: user.role, status: user.status })
    .from(user)
    .where(and(eq(user.id, session.user.id), eq(user.email, session.user.email)))
    .limit(1)

  if (!current || current.status !== 'active' || !['admin', 'supervisor'].includes(current.role)) redirect('/')

  return <Dashboard />
}
