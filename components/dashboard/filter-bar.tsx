'use client'

import type { ReactNode } from 'react'
import { AlertTriangle, ChevronDown, Search, Send, ShieldCheck, Siren, X, type LucideIcon } from 'lucide-react'
import { AGENCY_LABEL, INCIDENT_TYPE_LABEL, type Agency, type IncidentType } from '@/lib/surveillance-data'

export type Filters = {
  type: string
  agency: string
  severity: string
  aiFilter: boolean
  query: string
}

const SEVERITY_LABEL: Record<string, string> = {
  high: 'حرج جداً',
  medium: 'متوسط',
  low: 'منخفض',
}

function PillSelect({
  icon: Icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: LucideIcon
  label: string
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  const active = value !== 'all'
  return (
    <label
      className={`relative inline-flex h-10 min-w-0 items-center gap-2 rounded-xl border px-3 text-sm transition-colors focus-within:border-cyan/60 focus-within:ring-2 focus-within:ring-cyan/20 ${
        active ? 'border-cyan/50 bg-cyan/10' : 'border-border bg-secondary/60'
      }`}
    >
      <Icon className={`size-4 shrink-0 ${active ? 'text-cyan' : 'text-muted-foreground'}`} aria-hidden />
      <span className="whitespace-nowrap text-xs text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 cursor-pointer appearance-none bg-transparent pe-5 text-sm font-medium text-foreground outline-none"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2.5 size-4 text-muted-foreground" aria-hidden />
    </label>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 py-1 pe-1.5 ps-3 text-xs font-medium text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`إزالة الفلتر: ${label}`}
        className="flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-cyan/20 hover:text-foreground"
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  )
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value })

  const chips: { key: string; label: string; clear: () => void }[] = []
  if (filters.type !== 'all')
    chips.push({
      key: 'type',
      label: INCIDENT_TYPE_LABEL[filters.type as IncidentType] ?? filters.type,
      clear: () => set('type', 'all'),
    })
  if (filters.agency !== 'all')
    chips.push({
      key: 'agency',
      label: AGENCY_LABEL[filters.agency as Agency] ?? filters.agency,
      clear: () => set('agency', 'all'),
    })
  if (filters.severity !== 'all')
    chips.push({
      key: 'severity',
      label: `الخطورة: ${SEVERITY_LABEL[filters.severity] ?? filters.severity}`,
      clear: () => set('severity', 'all'),
    })
  if (filters.query.trim())
    chips.push({ key: 'query', label: `بحث: ${filters.query.trim()}`, clear: () => set('query', '') })

  const clearAll = () => onChange({ ...filters, type: 'all', agency: 'all', severity: 'all', query: '' })

  return (
    <section aria-label="أدوات التصفية" className="glass flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">التصفية</span>
          <PillSelect icon={Siren} label="نوع الحادث" value={filters.type} onChange={(v) => set('type', v)}>
            <option value="all" className="bg-card">الكل</option>
            <option value="fight" className="bg-card">مشاجرة / خناقة</option>
            <option value="traffic" className="bg-card">حادث سير</option>
            <option value="fall" className="bg-card">حالة طبية / سقوط شخص</option>
            <option value="suspicious" className="bg-card">حركة مشبوهة</option>
          </PillSelect>
          <PillSelect icon={Send} label="توجيه البلاغ" value={filters.agency} onChange={(v) => set('agency', v)}>
            <option value="all" className="bg-card">الكل</option>
            <option value="interior" className="bg-card">وزارة الداخلية / النجدة</option>
            <option value="ambulance" className="bg-card">هيئة الإسعاف / المستشفيات</option>
          </PillSelect>
          <PillSelect icon={AlertTriangle} label="مستوى الخطورة" value={filters.severity} onChange={(v) => set('severity', v)}>
            <option value="all" className="bg-card">الكل</option>
            <option value="high" className="bg-card">حرج جداً</option>
            <option value="medium" className="bg-card">متوسط</option>
            <option value="low" className="bg-card">منخفض</option>
          </PillSelect>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:ms-auto">
          <button
            type="button"
            role="switch"
            aria-checked={filters.aiFilter}
            onClick={() => set('aiFilter', !filters.aiFilter)}
            className={`flex h-10 items-center gap-3 rounded-xl border px-3 text-xs font-medium transition-all duration-300 ${
              filters.aiFilter
                ? 'border-cyan/60 bg-cyan/10 text-foreground glow-cyan'
                : 'border-border bg-secondary/60 text-muted-foreground'
            }`}
          >
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                filters.aiFilter ? 'bg-cyan' : 'bg-border'
              }`}
            >
              <span
                className={`absolute size-4 rounded-full bg-background transition-transform ${
                  filters.aiFilter ? 'translate-x-[-1.125rem]' : 'translate-x-[-0.125rem]'
                }`}
              />
            </span>
            <ShieldCheck className={`size-4 ${filters.aiFilter ? 'text-cyan' : ''}`} aria-hidden />
            <span className="whitespace-nowrap">
              فلترة البلاغات الكاذبة
              <span className="ms-1 text-muted-foreground" dir="ltr">
                (AI False Alarm Filter)
              </span>
            </span>
          </button>

          <label className="relative flex h-10 min-w-0 items-center sm:w-72">
            <span className="sr-only">بحث</span>
            <Search className="pointer-events-none absolute end-3 size-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => set('query', e.target.value)}
              placeholder="البحث بالمنطقة، رقم الكاميرا، أو رمز الحادث..."
              className="h-10 w-full rounded-xl border border-border bg-secondary/60 pe-10 ps-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
            />
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {chips.map((c) => (
            <Chip key={c.key} label={c.label} onRemove={c.clear} />
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ms-auto text-xs font-medium text-cyan underline-offset-4 hover:underline"
          >
            مسح الفلاتر
          </button>
        </div>
      )}
    </section>
  )
}