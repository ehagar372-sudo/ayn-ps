import type { Metadata } from 'next'
import Link from 'next/link'
import { count, desc, gte, sql } from 'drizzle-orm'
import { Download } from 'lucide-react'
import { SectionShell } from '@/components/supervisor/section-shell'
import { db } from '@/lib/db'
import { incidents } from '@/lib/db/schema'
import { requireStaffPage } from '@/lib/guards'
import { AGENCY_LABEL, INCIDENT_TYPE_LABEL, LOG_STATUS_LABEL } from '@/lib/surveillance-data'

export const metadata: Metadata = {
  title: 'التقارير',
  robots: { index: false, follow: false },
}

const RANGES = [
  { key: '7', label: 'آخر 7 أيام', days: 7 },
  { key: '30', label: 'آخر 30 يوماً', days: 30 },
  { key: 'all', label: 'كل الفترة', days: null },
] as const

const label = (map: Record<string, string>, key: string) => map[key] ?? key

const dateFormat = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Cairo',
})

async function loadReport(since: Date | null) {
  try {
    const where = since ? gte(incidents.occurredAt, since) : undefined

    const [totals] = await db
      .select({
        total: count(),
        ongoing: sql<number>`count(*) filter (where ${incidents.status} = 'ongoing')`.mapWith(Number),
        handled: sql<number>`count(*) filter (where ${incidents.status} = 'handled')`.mapWith(Number),
        filtered: sql<number>`count(*) filter (where ${incidents.status} = 'filtered')`.mapWith(Number),
        citizen: sql<number>`count(*) filter (where ${incidents.metadata}->>'source' = 'citizen-report')`.mapWith(Number),
      })
      .from(incidents)
      .where(where)

    const byType = await db.select({ key: incidents.type, total: count() }).from(incidents).where(where).groupBy(incidents.type).orderBy(desc(count()))
    const byAgency = await db.select({ key: incidents.agency, total: count() }).from(incidents).where(where).groupBy(incidents.agency).orderBy(desc(count()))
    const latest = await db.select().from(incidents).where(where).orderBy(desc(incidents.occurredAt)).limit(25)

    return { totals, byType, byAgency, latest }
  } catch {
    return null
  }
}

function BarList({ title, items, total }: { title: string; items: { label: string; value: number }[]; total: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد بيانات.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.label} className="flex flex-col gap-1.5 text-sm">
              <span className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {item.value} · {total ? Math.round((item.value / total) * 100) : 0}%
                </span>
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-cyan" style={{ width: `${total ? (item.value / total) * 100 : 0}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  handled: 'border-resolved/50 bg-resolved/10 text-resolved',
  ongoing: 'border-medical/50 bg-medical/10 text-medical',
  filtered: 'border-border bg-secondary/60 text-muted-foreground',
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const access = await requireStaffPage()
  const { range: rangeParam } = await searchParams
  const range = RANGES.find((r) => r.key === rangeParam) ?? RANGES[0]
  const since = range.days ? new Date(Date.now() - range.days * 86_400_000) : null
  const report = await loadReport(since)

  return (
    <SectionShell
      active="reports"
      isAdmin={access.role === 'admin'}
      title="التقارير"
      description="ملخص البلاغات المسجّلة في قاعدة بيانات النظام: بلاغات المواطنين وما يصل عبر واجهة الاستقبال."
      actions={
        <a
          href={`/api/export/incidents?range=${range.key}`}
          className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 text-sm text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground"
        >
          <Download className="size-4" aria-hidden />
          تصدير CSV
        </a>
      }
    >
      <nav aria-label="الفترة الزمنية" className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={`/supervisor/reports?range=${r.key}`}
            aria-current={r.key === range.key ? 'true' : undefined}
            className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
              r.key === range.key ? 'border-cyan/50 bg-cyan/10 font-semibold text-cyan' : 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            {r.label}
          </Link>
        ))}
      </nav>

      {!report ? (
        <p role="alert" className="glass rounded-2xl border-police/40 p-6 text-sm text-police">
          تعذر تحميل التقرير من قاعدة البيانات. حاول مرة أخرى بعد قليل.
        </p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              { l: 'إجمالي البلاغات', v: report.totals.total, tone: 'text-foreground' },
              { l: 'بلاغات المواطنين', v: report.totals.citizen, tone: 'text-cyan' },
              { l: 'قيد المتابعة', v: report.totals.ongoing, tone: 'text-medical' },
              { l: 'تم التعامل', v: report.totals.handled, tone: 'text-resolved' },
              { l: 'مستبعدة', v: report.totals.filtered, tone: 'text-muted-foreground' },
            ].map((k) => (
              <div key={k.l} className="glass rounded-2xl p-4">
                <dt className="text-xs text-muted-foreground">{k.l}</dt>
                <dd className={`mt-1 text-3xl font-bold tabular-nums ${k.tone}`} dir="ltr">
                  {k.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4 md:grid-cols-2">
            <BarList title="حسب نوع الحادثة" total={report.totals.total} items={report.byType.map((r) => ({ label: label(INCIDENT_TYPE_LABEL, r.key), value: r.total }))} />
            <BarList title="حسب الجهة" total={report.totals.total} items={report.byAgency.map((r) => ({ label: label(AGENCY_LABEL, r.key), value: r.total }))} />
          </div>

          <section aria-labelledby="latest-title" className="glass rounded-2xl">
            <h2 id="latest-title" className="border-b border-border p-4 text-sm font-bold">
              أحدث البلاغات <span className="ms-2 text-xs font-normal text-muted-foreground">آخر 25 بلاغاً</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    {['الرقم', 'النوع', 'الموقع', 'الجهة', 'الحالة', 'المصدر', 'الوقت'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-start font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.latest.map((row) => {
                    const source = (row.metadata as Record<string, unknown> | null)?.source
                    return (
                      <tr key={row.id} className="border-t border-border/60">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground" dir="ltr">
                          {row.id}
                        </td>
                        <td className="px-4 py-3">{label(INCIDENT_TYPE_LABEL, row.type)}</td>
                        <td className="px-4 py-3">{row.location}</td>
                        <td className="px-4 py-3 text-muted-foreground">{label(AGENCY_LABEL, row.agency)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[row.status] ?? STATUS_STYLE.filtered}`}>
                            {label(LOG_STATUS_LABEL, row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{source === 'citizen-report' ? 'مواطن' : 'النظام'}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{dateFormat.format(row.occurredAt)}</td>
                      </tr>
                    )
                  })}
                  {report.latest.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        لا توجد بلاغات في هذه الفترة.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-xs leading-6 text-muted-foreground">
            هذه الأرقام من جدول البلاغات في قاعدة البيانات فقط. بيانات لوحة التحكم الرئيسية (الكاميرات والتنبيهات التجريبية) غير مشمولة.
          </p>
        </>
      )}
    </SectionShell>
  )
}
