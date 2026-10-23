'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { account, user } from '@/lib/db/schema'
import { and, eq, ne } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('غير مصرح')
  const [current] = await db.select({ role: user.role, status: user.status }).from(user).where(eq(user.id, session.user.id)).limit(1)
  if (!current || current.role !== 'admin' || current.status !== 'active') throw new Error('غير مصرح')
  return session.user.id
}

export async function listSupervisors() {
  await requireAdmin()
  return db.select({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt }).from(user).where(ne(user.role, 'citizen')).orderBy(user.createdAt)
}

export async function createSupervisor(input: { name: string; email: string; password: string }) {
  await requireAdmin()
  const name = input.name.trim(); const email = input.email.trim().toLowerCase()
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || input.password.length < 8) throw new Error('تحقق من الاسم والبريد وكلمة المرور (8 أحرف على الأقل).')
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
  if (existing) throw new Error('هذا البريد الإلكتروني مستخدم بالفعل.')
  const result = await auth.api.signUpEmail({ body: { name, email, password: input.password } })
  if (!result.user) throw new Error('تعذر إنشاء حساب المشرف.')
  await db.update(user).set({ role: 'supervisor', status: 'active' }).where(eq(user.id, result.user.id))
  revalidatePath('/supervisor/manage')
}

export async function updateSupervisor(id: string, status: 'active' | 'inactive', role: 'supervisor' | 'admin') {
  const adminId = await requireAdmin()
  if (id === adminId) throw new Error('لا يمكن تعديل حسابك من هذه الصفحة.')
  await db.update(user).set({ status, role }).where(and(eq(user.id, id), ne(user.role, 'citizen')))
  if (status === 'inactive') await db.delete(account).where(eq(account.userId, id))
  revalidatePath('/supervisor/manage')
}
