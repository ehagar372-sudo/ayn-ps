import type { Metadata } from 'next'
import { count, gt, max, sql } from 'drizzle-orm'
import { SectionShell } from '@/components/supervisor/section-shell'
import { db } from '@/lib/db'
import { cameras, incidents, session, user } from '@/lib/db/schema'
import { requireAdminPage } from '@/lib/guards'

export const metadata: Metadata = {
  title: 'النظام',
  robots: { index: false, follow: false },
}

type Tone = 'ok' | 'warn' | 'off'

const TONE: Record<Tone, string> = {
  ok: 'border-resolved/50 bg-resolved/10 text-resolved',
  warn: 'border-medical/50 bg-medical/10 text-medical',
  off: 'border-border bg-secondary/60 text-muted-foreground',
}

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE[tone]}`}>{children}</span>
}

const dateFormat = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Cairo',
})

async function loadDatabaseStatus() {
  const started = performance.now()
  try {
    await db.execute(sql`select 1`)
    const latencyMs = Math.round(performance.now() - started)

    const [users, incidentStats, cameraStats, sessionStats] = await Promise.all([
      db.select({ role: user.role, status: user.status, total: count() }).from(user).groupBy(user.role, user.status),
      db.select({ total: count(), last: max(incidents.occurredAt) }).from(incidents),
      db.select({ total: count() }).from(cameras),
      db.select({ total: count() }).from(session).where(gt(session.expiresAt, new Date())),
    ])

    const sum = (pred: (r: (typeof users)[number]) => boolean) => users.filter(pred).reduce((n, r) => n + r.total, 0)
    return {
      ok: true as const,
      latencyMs,
      admins: sum((r) => r.role === 'admin' && r.status === 'active'),
      supervisors: sum((r) => r.role === 'supervisor' && r.status === 'active'),
      inactive: sum((r) => r.role !== 'citizen' && r.status !== 'active'),
      citizens: sum((r) => r.role === 'citizen'),
      incidents: incidentStats[0]?.total ?? 0,
      lastIncident: incidentStats[0]?.last ?? null,
      cameras: cameraStats[0]?.total ?? 0,
      sessions: sessionStats[0]?.total ?? 0,
    }
  } catch {
    return { ok: false as const }
  }
}

export default async function SystemPage() {
  const access = await requireAdminPage()
  const db_ = await loadDatabaseStatus()

  const env = [
    { name: 'DATABASE_URL', set: Boolean(process.env.DATABASE_URL), required: true },
    { name: 'BETTER_AUTH_SECRET', set: Boolean(process.env.BETTER_AUTH_SECRET), required: true },
    { name: 'BETTER_AUTH_URL', set: Boolean(process.env.BETTER_AUTH_URL), required: false },
    { name: 'NEXT_PUBLIC_SITE_URL', set: Boolean(process.env.NEXT_PUBLIC_SITE_URL), required: false },
  ]

  const features: { name: string; note: string; tone: Tone; state: string }[] = [
    { name: 'لوحة غرفة العمليات', note: 'واجهة المشرفين والتنبيهات.', tone: 'warn', state: 'تعمل ببيانات تجريبية' },
    { name: 'بلاغات المواطنين', note: 'نموذج /report وحفظه في قاعدة البيانات.', tone: db_.ok ? 'ok' : 'warn', state: db_.ok ? 'يعمل' : 'يحتاج قاعدة البيانات' },
    { name: 'استقبال الأحداث', note: 'واجهة /api/ingest لإرسال الأحداث من مصدر خارجي.', tone: 'ok', state: 'متاحة' },
    { name: 'بث الكاميرات المباشر', note: 'اللوحة تعرض لقطات ثابتة فقط.', tone: 'off', state: 'غير مفعّل' },
    { name: 'نموذج الكشف بالذكاء الاصطناعي', note: 'لا يوجد نموذج استنتاج متصل حالياً.', tone: 'off', state: 'غير متصل' },
  ]

  const deployment = [
    { k: 'البيئة', v: process.env.VERCEL_ENV ?? (process.env.NODE_ENV === 'production' ? 'production' : 'development') },
    { k: 'الفرع', v: process.env.VERCEL_GIT_COMMIT_REF ?? '—' },
    { k: 'الإصدار (commit)', v: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '—' },
    { k: 'المنطقة', v: process.env.VERCEL_REGION ?? '—' },
    { k: 'Node.js', v: process.version },
  ]

  return (
    <SectionShell
      active="system"
      isAdmin={access.role === 'admin'}
      title="النظام"
      description="حالة الاتصال بقاعدة البيانات والإعدادات والمكوّنات. للمدير فقط."
    >
      <section aria-labelledby="db-title" className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="db-title" className="text-sm font-bold">
            قاعدة البيانات
          </h2>
          {db_.ok ? <Pill tone="ok">متصلة · {db_.latencyMs} ms</Pill> : <Pill tone="warn">تعذر الاتصال</Pill>}
        </div>

        {db_.ok ? (
          <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: 'مديرون نشطون', v: db_.admins },
              { k: 'مشرفون نشطون', v: db_.supervisors },
              { k: 'حسابات موقوفة', v: db_.inactive },
              { k: 'حسابات مواطنين', v: db_.citizens },
              { k: 'جلسات سارية', v: db_.sessions },
              { k: 'بلاغات مسجّلة', v: db_.incidents },
              { k: 'كاميرات في القاعدة', v: db_.cameras },
              { k: 'آخر بلاغ', v: db_.lastIncident ? dateFormat.format(db_.lastIncident) : 'لا يوجد' },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border bg-secondary/40 p-3">
                <dt className="text-xs text-muted-foreground">{s.k}</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p role="alert" className="mt-4 text-sm text-medical">
            لم ينجح الاستعلام. تحقق من DATABASE_URL وحالة قاعدة البيانات.
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="features-title" className="glass rounded-2xl p-5">
          <h2 id="features-title" className="mb-4 text-sm font-bold">
            المكوّنات
          </h2>
          <ul className="flex flex-col gap-4">
            {features.map((f) => (
              <li key={f.name} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{f.name}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{f.note}</p>
                </div>
                <Pill tone={f.tone}>{f.state}</Pill>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-4">
          <section aria-labelledby="env-title" className="glass rounded-2xl p-5">
            <h2 id="env-title" className="mb-4 text-sm font-bold">
              متغيرات البيئة <span className="text-xs font-normal text-muted-foreground">(الحالة فقط، دون القيم)</span>
            </h2>
            <ul className="flex flex-col gap-3">
              {env.map((e) => (
                <li key={e.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-mono text-xs" dir="ltr">
                    {e.name}
                  </span>
                  {e.set ? <Pill tone="ok">مضبوط</Pill> : <Pill tone={e.required ? 'warn' : 'off'}>{e.required ? 'ناقص' : 'غير مضبوط'}</Pill>}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="deploy-title" className="glass rounded-2xl p-5">
            <h2 id="deploy-title" className="mb-4 text-sm font-bold">
              النشر
            </h2>
            <dl className="flex flex-col gap-3 text-sm">
              {deployment.map((d) => (
                <div key={d.k} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{d.k}</dt>
                  <dd className="font-mono text-xs" dir="ltr">
                    {d.v}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </SectionShell>
  )
}
