import { Activity, CheckCircle2, Clock3, ShieldOff } from 'lucide-react'
import { INCIDENT_TYPE_LABEL, LOGS, WEEKLY_TREND, type IncidentType } from '@/lib/surveillance-data'

// Illustrative sample data (not measured values).
const HOURLY = [3, 5, 4, 7, 9, 6, 8, 12, 15, 11, 14, 18, 16, 13, 10, 12, 17, 21, 24, 19, 22, 26, 23, 20]

const TYPE_COLOR: Record<IncidentType, string> = {
  fight: 'bg-police',
  traffic: 'bg-police/60',
  fall: 'bg-medical',
  suspicious: 'bg-suspicious',
}

function SampleBadge() {
  return (
    <span className="rounded-md border border-suspicious/40 bg-suspicious/10 px-2 py-0.5 text-[10px] font-semibold text-suspicious">
      بيانات توضيحية
    </span>
  )
}

export function AnalyticsPanel() {
  const max = Math.max(...HOURLY)
  const peakHour = HOURLY.indexOf(max)
  const weeklyMax = Math.max(...WEEKLY_TREND.map((d) => d.before))
  const beforeTotal = WEEKLY_TREND.reduce((n, d) => n + d.before, 0)
  const afterTotal = WEEKLY_TREND.reduce((n, d) => n + d.after, 0)
  const reduction = beforeTotal ? Math.round((1 - afterTotal / beforeTotal) * 100) : 0

  const total = LOGS.length
  const handled = LOGS.filter((l) => l.status === 'handled').length
  const ongoing = LOGS.filter((l) => l.status === 'ongoing').length
  const filtered = LOGS.filter((l) => l.status === 'filtered').length

  const KPIS = [
    { icon: Activity, label: 'حوادث في السجل', value: total, tone: 'text-foreground' },
    { icon: CheckCircle2, label: 'تم التعامل', value: handled, tone: 'text-resolved' },
    { icon: Clock3, label: 'جاري المتابعة', value: ongoing, tone: 'text-medical' },
    { icon: ShieldOff, label: 'مستبعدة تلقائياً', value: filtered, tone: 'text-cyan' },
  ]

  const BREAKDOWN = (Object.keys(INCIDENT_TYPE_LABEL) as IncidentType[]).map((t) => {
    const count = LOGS.filter((l) => l.type === t).length
    return {
      label: INCIDENT_TYPE_LABEL[t],
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
      color: TYPE_COLOR[t],
    }
  })

  return (
    <section id="sec-analytics" aria-labelledby="analytics-title" className="glass scroll-mt-24 rounded-2xl p-4">
      <h2 id="analytics-title" className="mb-4 text-sm font-bold">
        التحليلات
        <span className="ms-2 text-xs font-normal text-muted-foreground">
          الأرقام العلوية والتوزيع محسوبة من سجل الحوادث الحالي
        </span>
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map(({ icon: Icon, label, value, tone }) => (
          <div
            key={label}
            className="flex items-start justify-between gap-2 rounded-xl border border-border bg-secondary/40 p-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <span className={`text-2xl font-bold tabular-nums ${tone}`} dir="ltr">
                {value}
              </span>
            </div>
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold">كثافة الحوادث حسب الساعة</span>
            <span className="flex items-center gap-2 text-muted-foreground">
              ذروة: {String(peakHour).padStart(2, '0')}:00
              <SampleBadge />
            </span>
          </div>
          <div className="flex h-24 items-end gap-1" role="img" aria-label="مخطط أعمدة توضيحي لعدد الحوادث كل ساعة">
            {HOURLY.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-colors ${
                  i === peakHour ? 'bg-cyan' : 'bg-blue/40 hover:bg-blue/70'
                }`}
                style={{ height: `${(v / max) * 100}%` }}
                title={`${i}:00 — ${v} حادث`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground" dir="ltr">
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>23</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <span className="mb-3 block text-xs font-semibold">توزيع أنواع الحوادث (من السجل)</span>
          <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
            {BREAKDOWN.map((b) => (
              <div key={b.label} className={b.color} style={{ width: `${total ? (b.count / total) * 100 : 0}%` }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {BREAKDOWN.map((b) => (
              <li key={b.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${b.color}`} />
                  {b.label}
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {b.count} · {b.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-3 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold">مقارنة أسبوعية: قبل التفعيل وبعده</span>
            <span className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-border" /> قبل التفعيل
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-cyan" /> بعد التفعيل
              </span>
              <span
                className="rounded-md border border-resolved/40 bg-resolved/10 px-2 py-0.5 font-semibold text-resolved"
                dir="ltr"
              >
                -{reduction}%
              </span>
              <SampleBadge />
            </span>
          </div>
          <div
            className="grid grid-cols-7 gap-2"
            role="img"
            aria-label="مقارنة أسبوعية توضيحية لعدد الحوادث قبل وبعد تفعيل النظام"
          >
            {WEEKLY_TREND.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div className="flex h-28 w-full items-end justify-center gap-1">
                  <div
                    className="w-1/3 rounded-t-sm bg-border"
                    style={{ height: `${(d.before / weeklyMax) * 100}%` }}
                    title={`قبل: ${d.before}`}
                  />
                  <div
                    className="w-1/3 rounded-t-sm bg-cyan shadow-[0_0_10px_-2px_var(--cyan)]"
                    style={{ height: `${(d.after / weeklyMax) * 100}%` }}
                    title={`بعد: ${d.after}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}