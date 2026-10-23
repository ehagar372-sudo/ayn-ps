'use client'

import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  MapPin,
  Navigation,
  Radio,
  Send,
  Siren,
  XCircle,
} from 'lucide-react'
import { SEVERITY_CLASS, type Alert } from '@/lib/surveillance-data'

const ACTION_STYLE = {
  confirm: 'bg-cyan text-primary-foreground hover:shadow-[0_0_18px_-2px_var(--cyan)]',
  dismiss:
    'border border-border bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-foreground/30',
  stream: 'border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20',
}

const ACTION_ICON = { confirm: Send, dismiss: XCircle, stream: Radio }

const SEVERITY_BADGE: Record<Alert['severity'], string> = {
  police: 'حرج',
  medical: 'متوسط',
  suspicious: 'منخفض',
  resolved: 'منخفض',
}

function AlertCard({
  alert,
  onAction,
}: {
  alert: Alert
  onAction: (id: string, kind: 'confirm' | 'dismiss' | 'stream') => void
}) {
  const sev = SEVERITY_CLASS[alert.severity]
  const Icon = alert.severity === 'police' ? Siren : AlertTriangle
  return (
    <li
      className={`relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-secondary/30 p-3 transition-colors animate-slide-in-feed hover:border-cyan/30 ${
        alert.severity === 'police'
          ? 'border-s-4 border-s-police'
          : alert.severity === 'medical'
            ? 'border-s-4 border-s-medical'
            : 'border-s-4 border-s-suspicious'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${sev.bg} ${sev.border} ${sev.text}`}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-snug text-pretty">{alert.title}</h3>
            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${sev.bg} ${sev.border} ${sev.text}`}
            >
              {SEVERITY_BADGE[alert.severity]}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {alert.camera} - {alert.location}
            </span>
            <span className="tabular-nums">{alert.time}</span>
            <span className="font-mono" dir="ltr">
              {alert.id}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full ${
              alert.severity === 'medical'
                ? 'bg-medical'
                : alert.severity === 'suspicious'
                  ? 'bg-suspicious'
                  : 'bg-police'
            }`}
            style={{ width: `${alert.confidence}%` }}
          />
        </div>
        <span className={`text-[11px] font-bold tabular-nums ${sev.text}`}>نسبة التأكد: {alert.confidence}%</span>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${sev.bg} ${sev.border} ${sev.text}`}
      >
        <BellRing className="size-3.5 shrink-0" aria-hidden />
        <span className="text-pretty">{alert.agencyLabel}</span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Navigation className="size-3 shrink-0 text-cyan" aria-hidden />
        <span className="font-semibold text-foreground">{alert.gps.district}</span>
        <span className="font-mono tabular-nums" dir="ltr">
          {alert.gps.lat} · {alert.gps.lng}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {alert.actions.map((a) => {
          const ActionIcon = ACTION_ICON[a.kind]
          return (
            <button
              key={a.label}
              type="button"
              onClick={() => onAction(alert.id, a.kind)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${ACTION_STYLE[a.kind]}`}
            >
              <ActionIcon className="size-3.5" aria-hidden />
              {a.label}
            </button>
          )
        })}
      </div>
    </li>
  )
}

export function AlertFeed({
  alerts,
  resolvedCount,
  onAction,
}: {
  alerts: Alert[]
  resolvedCount: number
  onAction: (id: string, kind: 'confirm' | 'dismiss' | 'stream') => void
}) {
  return (
    <aside
      id="sec-alerts"
      aria-labelledby="alerts-title"
      className="glass flex min-h-0 scroll-mt-24 flex-col rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 id="alerts-title" className="flex items-center gap-2 text-sm font-bold">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-police text-police animate-pulse-dot" />
          </span>
          تنبيهات النظام
          <span className="text-xs font-normal text-muted-foreground" dir="ltr">
            (Alerts)
          </span>
        </h2>
        <span className="flex size-7 items-center justify-center rounded-full bg-police text-xs font-bold text-destructive-foreground shadow-[0_0_14px_-2px_var(--police)]">
          {alerts.length}
        </span>
      </div>

      <ul className="flex max-h-[34rem] min-h-0 flex-col gap-3 overflow-y-auto p-3">
        {alerts.map((a) => (
          <AlertCard key={a.id} alert={a} onAction={onAction} />
        ))}
        {alerts.length === 0 && (
          <li className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="size-8 text-resolved" aria-hidden />
            لا توجد تنبيهات نشطة حالياً
          </li>
        )}
      </ul>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>تم التعامل مع {resolvedCount} تنبيه خلال هذه الجلسة</span>
        <span className="flex items-center gap-1.5 text-suspicious">
          <span className="size-1.5 rounded-full bg-suspicious" />
          بيانات تجريبية
        </span>
      </div>
    </aside>
  )
}