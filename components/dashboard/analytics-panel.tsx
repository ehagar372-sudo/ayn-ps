import { Activity, Clock3, Cpu, ShieldOff } from 'lucide-react'
import { WEEKLY_TREND } from '@/lib/surveillance-data'

const HOURLY = [3, 5, 4, 7, 9, 6, 8, 12, 15, 11, 14, 18, 16, 13, 10, 12, 17, 21, 24, 19, 22, 26, 23, 20]

const BREAKDOWN = [
  { label: 'مشاجرات / عنف', value: 38, color: 'bg-police' },
  { label: 'حوادث سير', value: 27, color: 'bg-police/60' },
  { label: 'حالات طبية', value: 21, color: 'bg-medical' },
  { label: 'حركة مشبوهة', value: 14, color: 'bg-suspicious' },
]

const KPIS = [
  { icon: Activity, label: 'حوادث اليوم', value: '312', delta: '+8%', tone: 'text-foreground' },
  { icon: ShieldOff, label: 'بلاغات كاذبة مُستبعدة', value: '84', delta: '27%', tone: 'text-cyan' },
  { icon: Clock3, label: 'متوسط زمن الاستجابة', value: '2:41', delta: 'دقيقة', tone: 'text-resolved' },
  { icon: Cpu, label: 'دقة النموذج', value: '98.4%', delta: 'آخر 24س', tone: 'text-cyan' },
]

export function AnalyticsPanel() {
  const max = Math.max(...HOURLY)
  const weeklyMax = Math.max(...WEEKLY_TREND.map((d) => d.before))
  return (
    <section aria-labelledby="analytics-title" className="glass rounded-2xl p-4">
      <h2 id="analytics-title" className="mb-4 text-sm font-bold">
        سجل الحوادث والتحليلات
        <span className="ms-2 text-xs font-normal text-muted-foreground">مؤشرات الأداء الحية</span>
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map(({ icon: Icon, label, value, delta, tone }) => (
          <div key={label} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <span className={`text-xl font-bold tabular-nums ${tone}`} dir="ltr">
                {value}
              </span>
              <span className="text-[10px] text-muted-foreground">{delta}</span>
            </div>
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold">كثافة الحوادث حسب الساعة</span>
            <span className="text-muted-foreground">ذروة: 22:00</span>
          </div>
          <div className="flex h-24 items-end gap-1" role="img" aria-label="مخطط أعمدة لعدد الحوادث كل ساعة">
            {HOURLY.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-colors ${
                  i >= 21 ? 'bg-cyan' : 'bg-cyan/30 hover:bg-cyan/60'
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

        <div className="rounded-xl border border-border bg-secondary/40 p-3 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold">تراجع الحوادث المتفاقمة أسبوعياً بفضل الرصد المبكر</span>
            <span className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-border" /> قبل التفعيل
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-cyan" /> بعد التفعيل
              </span>
              <span className="rounded-md border border-resolved/40 bg-resolved/10 px-2 py-0.5 font-semibold text-resolved" dir="ltr">
                -47%
              </span>
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2" role="img" aria-label="مقارنة أسبوعية لعدد الحوادث المتفاقمة قبل وبعد تفعيل النظام">
            {WEEKLY_TREND.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div className="flex h-28 w-full items-end justify-center gap-1">
                  <div className="w-1/3 rounded-t-sm bg-border" style={{ height: `${(d.before / weeklyMax) * 100}%` }} title={`قبل: ${d.before}`} />
                  <div className="w-1/3 rounded-t-sm bg-cyan shadow-[0_0_10px_-2px_var(--cyan)]" style={{ height: `${(d.after / weeklyMax) * 100}%` }} title={`بعد: ${d.after}`} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <span className="mb-3 block text-xs font-semibold">توزيع أنواع الحوادث</span>
          <div className="flex h-2 overflow-hidden rounded-full">
            {BREAKDOWN.map((b) => (
              <div key={b.label} className={b.color} style={{ width: `${b.value}%` }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {BREAKDOWN.map((b) => (
              <li key={b.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${b.color}`} />
                  {b.label}
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">{b.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
