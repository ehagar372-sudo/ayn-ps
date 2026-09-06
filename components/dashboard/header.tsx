'use client'

import { Bell, Eye, Siren, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

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

export function DashboardHeader() {
  return (
    <header className="glass sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative flex size-11 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan glow-cyan">
          <Eye className="size-6" aria-hidden />
          <span className="absolute -end-0.5 -top-0.5 size-2.5 rounded-full bg-cyan animate-pulse-dot" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-tight text-balance">
            نظام عين للرصد الذكي
          </h1>
          <p className="text-xs text-muted-foreground" dir="ltr">
            AI Surveillance System · v4.2
          </p>
        </div>
      </div>

      <ul className="order-last flex w-full flex-wrap items-center justify-center gap-2 lg:order-none lg:w-auto">
        <li className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs">
          <span className="size-2 rounded-full bg-resolved" />
          <span className="text-muted-foreground">الكاميرات النشطة:</span>
          <span className="font-semibold tabular-nums">128 / 130</span>
        </li>
        <li className="flex items-center gap-2 rounded-full border border-medical/50 bg-medical/10 px-3 py-1.5 text-xs shadow-[0_0_16px_-4px_var(--medical)]">
          <span className="size-2 rounded-full bg-medical text-medical animate-pulse-dot" />
          <span className="text-muted-foreground">مستوى التهديد:</span>
          <span className="font-semibold text-medical">متوسط</span>
        </li>
        <li className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs">
          <span className="size-2 rounded-full bg-cyan" />
          <span className="text-muted-foreground">حالة الذكاء الاصطناعي:</span>
          <span className="font-semibold text-cyan">متصل ويعمل (99.8%)</span>
        </li>
        <li className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 xl:flex">
          <LiveClock />
        </li>
      </ul>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-police/60 bg-police/15 px-3 py-2 text-sm font-semibold text-police transition-all duration-300 hover:bg-police hover:text-destructive-foreground hover:shadow-[0_0_24px_-4px_var(--police)]"
        >
          <Siren className="size-4" aria-hidden />
          <span className="hidden sm:inline">بلاغ طوارئ يدوي</span>
        </button>
        <button
          type="button"
          aria-label="الإشعارات"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-5" aria-hidden />
          <span className="absolute end-2 top-2 size-2 rounded-full bg-police text-police animate-pulse-dot" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 py-1.5 pe-3 ps-1.5 transition-colors hover:border-cyan/50"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-cyan/15 text-xs font-bold text-cyan">
            م.أ
          </span>
          <span className="hidden text-start leading-tight md:block">
            <span className="block text-xs font-semibold">م. أحمد سالم</span>
            <span className="block text-[10px] text-muted-foreground">مشرف غرفة العمليات</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
        </button>
      </div>
    </header>
  )
}
