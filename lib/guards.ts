import { redirect } from 'next/navigation'
import { canAccessDashboard, getAccess, isActiveAdmin, type Access } from '@/lib/session'

/** For server pages inside /supervisor: signed-out -> sign in, no role -> home. */
export async function requireStaffPage(): Promise<Access> {
  const access = await getAccess()
  if (!access) redirect('/sign-in')
  if (!canAccessDashboard(access)) redirect('/')
  return access
}

/** Same, but admins only; supervisors go back to their dashboard. */
export async function requireAdminPage(): Promise<Access> {
  const access = await requireStaffPage()
  if (!isActiveAdmin(access)) redirect('/supervisor')
  return access
}
