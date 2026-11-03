import { canAccessDashboard, getAccess } from '@/lib/session'

/**
 * Guard for the protected API routes. Only active admins and supervisors pass:
 * a plain signed-in account (for example a citizen who signed up) must not be
 * able to read cameras/incidents or push events.
 */
export async function requireSession() {
  const access = await getAccess()
  return canAccessDashboard(access) ? access : null
}
