'use client'

import { useState } from 'react'
import {
  Activity,
  Bell,
  Camera,
  ClipboardList,
  Cpu,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Map as MapIcon,
  Presentation,
  Settings,
  Siren,
  X,
  type LucideIcon,
} from 'lucide-react'
import { AinLogo } from '@/components/brand/ain-logo'
import type { View } from './header'

type NavItem = {
  key: string
  label: string
  icon: LucideIcon
  /** id of a section inside the dashboard page */
  target?: string
  /** switches the main view instead of scrolling */
  view?: View
  /** item has no working feature yet */
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, view: 'dashboard' },
  { key: 'cameras', label: 'الكاميرات', icon: Camera, target: 'sec-cameras' },
  { key: 'map', label: 'الخريطة', icon: MapIcon, target: 'sec-map' },
  { key: 'alerts', label: 'التنبيهات', icon: Bell, target: 'sec-alerts' },
  { key: 'events', label: 'آخر الأحداث', icon: Siren, target: 'sec-events' },
  { key: 'analytics', label: 'التحليلات', icon: Activity, target: 'sec-analytics' },
  { key: 'logs', label: 'سجل الحوادث', icon: ClipboardList, target: 'sec-logs' },
  { key: 'pitch', label: 'عن المشروع والتقنية', icon: Presentation, view: 'pitch' },
  { key: 'reports', label: 'التقارير', icon: FileText, disabled: true },
  { key: 'system', label: 'النظام', icon: Cpu, disabled: true },
  { key: 'settings', label: 'الإعدادات', icon: Settings, disabled: true },
]

function OverviewDonut({ percent }: { percent: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c
  return (
    <div className="relative size-[104px] shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ain-donut" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--cyan)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--violet)' }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-border" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="url(#ain-donut)"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums" dir="ltr">
          {percent}%
        </span>
        <span className="text-[9px] leading-tight text-muted-foreground">وضع طبيعي</span>
      </div>
    </div>
  )
}

export function Sidebar({
  view,
  onViewChange,
  onNavigate,
  onSignOut,
  open,
  onClose,
  cameraTotal,
  cameraNormal,
  activeAlerts,
  resolvedCount,
}: {
  view: View
  onViewChange: (v: View) => void
  onNavigate: (sectionId: string) => void
  onSignOut: () => void
  open: boolean
  onClose: () => void
  cameraTotal: number
  cameraNormal: number
  activeAlerts: number
  resolvedCount: number
}) {
  const [activeKey, setActiveKey] = useState('dashboard')
  const percent = cameraTotal ? Math.round((cameraNormal / cameraTotal) * 100) : 0

  const isActive = (item: NavItem) => {
    if (item.key === 'pitch') return view === 'pitch'
    return view === 'dashboard' && activeKey === item.key
  }

  const handleClick = (item: NavItem) => {
    if (item.disabled) return
    if (item.view === 'pitch') {
      onViewChange('pitch')
      setActiveKey('pitch')
    } else if (item.key === 'dashboard') {
      onViewChange('dashboard')
      setActiveKey('dashboard')
      onNavigate('top')
    } else if (item.target) {
      setActiveKey(item.key)
      onNavigate(item.target)
    }
    onClose()
  }

  const rows = [
    { label: 'الكاميرات في العرض', value: String(cameraTotal), tone: 'text-foreground' },
    { label: 'كاميرات عليها تنبيه', value: String(cameraTotal - cameraNormal), tone: 'text-police' },
    { label: 'تنبيهات نشطة', value: String(activeAlerts), tone: 'text-medical' },
    { label: 'تم التعامل (الجلسة)', value: String(resolvedCount), tone: 'text-resolved' },
  ]

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        aria-label="القائمة الرئيسية"
        className={`glass fixed inset-y-3 start-3 z-50 flex w-64 shrink-0 flex-col gap-4 overflow-y-auto rounded-2xl p-3 transition-transform duration-300 lg:sticky lg:bottom-auto lg:start-auto lg:top-3 lg:z-20 lg:h-[calc(100vh-1.5rem)] lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-[120%]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <AinLogo className="text-cyan" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">نظام عين</span>
              <span className="text-[10px] text-muted-foreground" dir="ltr">
                AI Surveillance
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <nav aria-label="أقسام لوحة التحكم" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                aria-disabled={item.disabled}
                aria-current={active ? 'page' : undefined}
                title={item.disabled ? 'غير متاح حاليًا' : item.label}
                onClick={() => handleClick(item)}
                className={`flex h-10 items-center gap-3 rounded-xl border px-3 text-sm transition-all duration-300 ${
                  active
                    ? 'border-blue/40 bg-blue/15 font-semibold text-foreground shadow-[0_0_18px_-6px_var(--blue)]'
                    : item.disabled
                      ? 'cursor-not-allowed border-transparent text-muted-foreground/50'
                      : 'border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                <Icon className={`size-4 shrink-0 ${active ? 'text-cyan' : ''}`} aria-hidden />
                <span className="flex-1 truncate text-start">{item.label}</span>
                {item.disabled && (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Lock className="size-3" aria-hidden />
                    غير متاح حاليًا
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <section
          aria-label="ملخص العرض"
          className="mt-auto flex flex-col gap-3 rounded-xl border border-border bg-secondary/40 p-3"
        >
          <span className="text-xs font-semibold">ملخص العرض الحالي</span>
          <div className="flex items-center gap-3">
            <OverviewDonut percent={percent} />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              نسبة الكاميرات التي لا تحمل تنبيهًا نشطًا من الكاميرات المعروضة.
            </p>
          </div>
          <ul className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-semibold tabular-nums ${row.tone}`}>{row.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-sm font-bold text-cyan">
            م
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-xs font-semibold">مشرف غرفة العمليات</span>
            <span className="truncate text-[10px] text-muted-foreground">جلسة مسجّلة الدخول</span>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-police/15 hover:text-police"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </aside>
    </>
  )
}