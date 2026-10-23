import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export default async function SupervisorPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const [current] = await db.select({ role: user.role, status: user.status }).from(user).where(eq(user.id, session.user.id)).limit(1)
  if (!current || current.status !== 'active' || !['admin', 'supervisor'].includes(current.role)) redirect('/')
  return <main className="min-h-screen bg-[#070b14] p-6 text-white"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between border-b border-white/10 pb-6"><div><p className="text-sm text-cyan-300">غرفة العمليات</p><h1 className="mt-2 text-3xl font-bold">لوحة المشرف</h1></div><Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300">العودة للوحة عين</Link></div><div className="mt-8 grid gap-4 md:grid-cols-3">{[['البلاغات الجديدة','12','text-amber-300'],['قيد المتابعة','28','text-cyan-300'],['تمت المعالجة اليوم','94','text-emerald-300']].map(([label,value,color]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#0d1626] p-5"><p className="text-sm text-slate-400">{label}</p><p className={`mt-3 text-4xl font-bold ${color}`}>{value}</p></div>)}</div>{current.role === 'admin' && <Link href="/supervisor/manage" className="mt-8 inline-block rounded-lg border border-cyan-400 px-4 py-2 text-cyan-300">إدارة المشرفين</Link>}<section className="mt-8 rounded-2xl border border-white/10 bg-[#0d1626] p-6"><h2 className="text-xl font-bold">آخر البلاغات</h2><p className="mt-3 text-slate-400">تظهر البلاغات بعد ربط قاعدة البيانات التشغيلية.</p></section></div></main>
}
