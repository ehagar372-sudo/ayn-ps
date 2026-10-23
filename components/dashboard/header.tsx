'use client'

import { LayoutGrid, LogOut, Menu, MonitorPlay, Presentation, Siren } from 'lucide-react'
import { useEffect, useState } from 'react'

export type View = 'dashboard' | 'pitch'
export type LayoutMode = '2x2' | 'focus' | 'list'

const LAYOUT_ORDER: LayoutMode[] = ['2x2', 'focus', 'list']
export const LAYOUT_LABEL: Record<LayoutMode, string> = {
  '2x2': 'شبكة 2×2',
  focus: 'كاميرا رئيسية + 3',
  list: 'قائمة عمودية',
}

function LiveClock() {
  const [now, setNow] = useState<{ time: string; date: string } | null>(null)

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow({
        time: new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(d),
        date: new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(d),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden flex-col items-end leading-tight md:flex">
      <span className="font-mono text-sm font-semibold tabular-nums" dir="ltr">
        {now?.time ?? '--:--:--'}
      </span>
      <span className="text-[10px] text-muted-foreground">{now?.date ?? ''}</span>
    </div>
  )
}

export function AppHeader({
  view,
  onViewChange,
  layout,
  onLayoutChange,
  onManualDispatch,
  onSignOut,
  onMenuClick,
}: {
  view: View
  onViewChange: (v: View) => void
  layout: LayoutMode
  onLayoutChange: (l: LayoutMode) => void
  onManualDispatch: () => void
  onSignOut: () => void
  /** opens the sidebar drawer on small screens */
  onMenuClick?: () => void
}) {
  const cycleLayout = () => onLayoutChange(LAYOUT_ORDER[(LAYOUT_ORDER.indexOf(layout) + 1) % LAYOUT_ORDER.length])

  return (
    <header className="glass sticky top-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-2.5 md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="فتح القائمة"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight md:text-lg">
            {view === 'pitch' ? 'عن المشروع والتقنية' : 'لوحة التحكم'}
          </h1>
          <p className="truncate text-[11px] text-muted-foreground">
            نظام عين للرصد والتحليل الذكي · عرض تجريبي بلقطات ثابتة وبيانات مثال
          </p>
        </div>
      </div>

      <nav aria-label="أقسام التطبيق" className="order-last w-full md:order-none md:w-auto">
        <div role="tablist" className="flex rounded-xl border border-border bg-secondary/60 p-1 text-sm">
          {(
            [
              { id: 'dashboard', label: 'لوحة التحكم', icon: MonitorPlay },
              { id: 'pitch', label: 'عن المشروع والتقنية', icon: Presentation },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={view === id}
              onClick={() => onViewChange(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-1.5 font-semibold transition-all duration-300 md:flex-none ${
                view === id ? 'bg-blue/20 text-cyan glow-cyan' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex items-center gap-2">
        <LiveClock />
        <button
          type="button"
          onClick={cycleLayout}
          disabled={view !== 'dashboard'}
          title={`النمط الحالي: ${LAYOUT_LABEL[layout]}`}
          className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-all duration-300 hover:border-cyan/50 hover:text-foreground disabled:opacity-40"
        >
          <LayoutGrid className="size-4" aria-hidden />
          <span className="hidden xl:inline">تغيير نمط العرض</span>
        </button>
        <button
          type="button"
          onClick={onManualDispatch}
          className="flex h-10 items-center gap-2 rounded-xl border border-police/60 bg-police/15 px-3 text-sm font-semibold text-police transition-all duration-300 hover:scale-[1.02] hover:bg-police hover:text-destructive-foreground hover:shadow-[0_0_24px_-4px_var(--police)]"
        >
          <Siren className="size-4" aria-hidden />
          <span className="hidden sm:inline">إرسال بلاغ طوارئ يدوي</span>
        </button>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="تسجيل الخروج"
          title="تسجيل الخروج"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition-all duration-300 hover:border-police/50 hover:text-police"
        >
          <LogOut className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  )
}