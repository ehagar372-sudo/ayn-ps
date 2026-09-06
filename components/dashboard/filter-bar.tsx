'use client'

import { ChevronDown, Search, ShieldCheck } from 'lucide-react'

export type Filters = {
  type: string
  agency: string
  severity: string
  aiFilter: boolean
  query: string
}

const selectClass =
  'h-10 w-full appearance-none rounded-xl border border-border bg-secondary/60 pe-9 ps-3 text-sm text-foreground outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-muted-foreground">
      {label}
      <span className="relative block">
        {children}
        <ChevronDown
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>
    </label>
  )
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <section
      aria-label="أدوات التصفية"
      className="glass flex flex-col gap-4 rounded-2xl p-4 xl:flex-row xl:items-end"
    >
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="تصفية حسب نوع الحادث">
          <select
            className={selectClass}
            value={filters.type}
            onChange={(e) => set('type', e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="fight">خناقة / مشاجرة</option>
            <option value="traffic">حادث سير</option>
            <option value="fall">شخص أغمى عليه / سقط</option>
            <option value="suspicious">حركة مشبوهة</option>
          </select>
        </Field>
        <Field label="تصفية حسب الجهة المستهدفة">
          <select
            className={selectClass}
            value={filters.agency}
            onChange={(e) => set('agency', e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="interior">وزارة الداخلية</option>
            <option value="ambulance">الإسعاف / المستشفيات</option>
          </select>
        </Field>
        <Field label="تصفية حسب مستوى الخطورة">
          <select
            className={selectClass}
            value={filters.severity}
            onChange={(e) => set('severity', e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="high">عالي جداً</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
        </Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
          <ShieldCheck
            className={`size-4 ${filters.aiFilter ? 'text-cyan' : ''}`}
            aria-hidden
          />
          <span className="whitespace-nowrap">
            تفعيل الفلترة الذكية للبلاغات الكاذبة
            <span className="ms-1 text-muted-foreground" dir="ltr">
              (AI False Alarm Filter)
            </span>
          </span>
        </button>

        <label className="relative flex h-10 min-w-0 items-center sm:w-64">
          <span className="sr-only">بحث</span>
          <Search
            className="pointer-events-none absolute end-3 size-4 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="البحث برقم الكاميرا أو الموقع..."
            className="h-10 w-full rounded-xl border border-border bg-secondary/60 pe-10 ps-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
          />
        </label>
      </div>
    </section>
  )
}
