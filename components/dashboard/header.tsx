'use client'

import { LayoutGrid, LogOut, MonitorPlay, Presentation, Siren } from 'lucide-react'
import { AinLogo } from '@/components/brand/ain-logo'
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
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date()),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="font-mono text-xs tabular-nums text-muted-foreground" dir="ltr">
      {now ?? '--:--:--'}
    </span>
  )
}

export function AppHeader({
  view,
  onViewChange,
  layout,
  onLayoutChange,
  onManualDispatch,
  onSignOut,
}: {
  view: View
  onViewChange: (v: View) => void
  layout: LayoutMode
  onLayoutChange: (l: LayoutMode) => void
  onManualDispatch: () => void
  onSignOut: () => void
}) {
  const cycleLayout = () => onLayoutChange(LAYOUT_ORDER[(LAYOUT_ORDER.indexOf(layout) + 1) % LAYOUT_ORDER.length])

  return (
    <header className="glass sticky top-0 z-30 flex flex-col gap-3 rounded-2xl px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AinLogo className="text-cyan" />
          <div className="hidden h-9 w-px bg-border sm:block" />
          <div className="hidden flex-col sm:flex">
            <h1 className="text-lg font-bold leading-tight text-balance">نظام عين للرصد والتحليل الذكي</h1>
            <p className="text-xs text-muted-foreground" dir="ltr">
              AI Security &amp; Surveillance System
            </p>
          </div>
        </div>

        <nav aria-label="أقسام التطبيق" className="order-last w-full lg:order-none lg:w-auto">
          <div role="tablist" className="flex rounded-xl border border-border bg-secondary/60 p-1 text-sm">
            {(
              [
                { id: 'dashboard', label: 'لوحة التحكم المباشرة', icon: MonitorPlay },
                { id: 'pitch', label: 'عن المشروع والتقنية', icon: Presentation },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={view === id}
                onClick={() => onViewChange(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-300 lg:flex-none ${
                  view === id ? 'bg-cyan/15 text-cyan glow-cyan' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignOut}
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-police/50 hover:text-police"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
          <button
            type="button"
            onClick={onManualDispatch}
            className="flex items-center gap-2 rounded-xl border border-police/60 bg-police/15 px-3 py-2 text-sm font-semibold text-police transition-all duration-300 hover:scale-[1.02] hover:bg-police hover:text-destructive-foreground hover:shadow-[0_0_24px_-4px_var(--police)]"
          >
            <Siren className="size-4" aria-hidden />
            <span className="hidden sm:inline">إرسال بلاغ طوارئ يدوي</span>
          </button>
          <button
            type="button"
            onClick={cycleLayout}
            disabled={view !== 'dashboard'}
            title={`النمط الحالي: ${LAYOUT_LABEL[layout]}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-cyan/50 hover:text-foreground disabled:opacity-40"
          >
            <LayoutGrid className="size-4" aria-hidden />
            <span className="hidden sm:inline">تغيير نمط العرض</span>
          </button>
        </div>
      </div>

      <ul className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <li className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs">
          <span className="size-2 rounded-full bg-resolved" />
          <span className="text-muted-foreground">الكاميرات النشطة:</span>
          <span className="font-semibold tabular-nums">2,450 كاميرا</span>
        </li>
        <li className="flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs">
          <span className="size-2 rounded-full bg-cyan text-cyan animate-pulse-dot" />
          <span className="text-muted-foreground">حالة النموذج الذكي:</span>
          <span className="font-semibold text-cyan">متصل - دقة التنبؤ 98.4%</span>
        </li>
        <li className="flex items-center gap-2 rounded-full border border-medical/50 bg-medical/10 px-3 py-1.5 text-xs shadow-[0_0_16px_-4px_var(--medical)]">
          <span className="size-2 rounded-full bg-medical text-medical animate-pulse-dot" />
          <span className="text-muted-foreground">مستوى التهديد الحالي:</span>
          <span className="font-semibold text-medical">متوسط (تنبيهات نشطة)</span>
        </li>
        <li className="ms-auto hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 md:flex">
          <LiveClock />
        </li>
      </ul>
    </header>
  )
}
