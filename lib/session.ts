import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export type Role = 'admin' | 'supervisor' | 'citizen'
export type AccountStatus = 'active' | 'inactive'

export type Access = {
  id: string
  name: string
  email: string
  role: Role
  status: AccountStatus
}

const ROLES: readonly Role[] = ['admin', 'supervisor', 'citizen']

/**
 * Resolves the signed-in user together with the role and status stored in the
 * database. Returns null when there is no session, the user no longer exists,
 * or the auth backend is unavailable. This is the single source of truth for
 * route guards, server actions and API handlers.
 */
export async function getAccess(): Promise<Access | null> {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return null

  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return null

    const [row] = await db
      .select({ role: user.role, status: user.status })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)
    if (!row) return null

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: ROLES.includes(row.role as Role) ? (row.role as Role) : 'citizen',
      status: row.status === 'active' ? 'active' : 'inactive',
    }
  } catch {
    return null
  }
}

/** Operations-room access: active admins and supervisors only. */
export function canAccessDashboard(access: Access | null): access is Access {
  return !!access && access.status === 'active' && (access.role === 'admin' || access.role === 'supervisor')
}

export function isActiveAdmin(access: Access | null): access is Access {
  return !!access && access.status === 'active' && access.role === 'admin'
}
