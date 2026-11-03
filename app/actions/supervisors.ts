'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { session as sessionTable, user } from '@/lib/db/schema'
import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getAccess, isActiveAdmin } from '@/lib/session'

export type ActionResult = { ok: true } | { ok: false; error: string }

const fail = (error: string): ActionResult => ({ ok: false, error })

const UNAUTHORIZED = 'غير مصرح'

async function requireAdmin() {
  const access = await getAccess()
  if (!isActiveAdmin(access)) throw new Error(UNAUTHORIZED)
  return access.id
}

const createSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().max(254).regex(/^\S+@\S+\.\S+$/),
  password: z.string().min(8).max(128),
})

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  role: z.enum(['supervisor', 'admin']),
})

export async function listSupervisors() {
  await requireAdmin()
  return db
    .select({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt })
    .from(user)
    .where(ne(user.role, 'citizen'))
    .orderBy(user.createdAt)
}

export async function createSupervisor(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin()
    const parsed = createSchema.safeParse(input)
    if (!parsed.success) return fail('تحقق من الاسم والبريد وكلمة المرور (8 أحرف على الأقل).')
    const { name, email, password } = parsed.data

    const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
    if (existing) return fail('هذا البريد الإلكتروني مستخدم بالفعل.')

    const result = await auth.api.signUpEmail({ body: { name, email, password } })
    if (!result.user) return fail('تعذر إنشاء حساب المشرف.')

    await db.update(user).set({ role: 'supervisor', status: 'active' }).where(eq(user.id, result.user.id))
    revalidatePath('/supervisor/manage')
    return { ok: true }
  } catch (error) {
    return fail(error instanceof Error && error.message === UNAUTHORIZED ? UNAUTHORIZED : 'تعذر تنفيذ العملية. حاول مرة أخرى.')
  }
}

export async function updateSupervisor(id: string, status: 'active' | 'inactive', role: 'supervisor' | 'admin'): Promise<ActionResult> {
  try {
    const adminId = await requireAdmin()
    const parsed = updateSchema.safeParse({ id, status, role })
    if (!parsed.success) return fail('بيانات التحديث غير صالحة.')
    if (parsed.data.id === adminId) return fail('لا يمكن تعديل حسابك من هذه الصفحة.')

    await db
      .update(user)
      .set({ status: parsed.data.status, role: parsed.data.role })
      .where(and(eq(user.id, parsed.data.id), ne(user.role, 'citizen')))

    // Revoke open sessions on deactivation. Credentials are kept so the account
    // can be re-activated later; the dashboard guard also checks `status`.
    if (parsed.data.status === 'inactive') {
      await db.delete(sessionTable).where(eq(sessionTable.userId, parsed.data.id))
    }

    revalidatePath('/supervisor/manage')
    return { ok: true }
  } catch (error) {
    return fail(error instanceof Error && error.message === UNAUTHORIZED ? UNAUTHORIZED : 'تعذر تحديث الحساب.')
  }
}
