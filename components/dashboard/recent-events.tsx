'use client'

import { Activity, AlertTriangle, Eye, Siren, type LucideIcon } from 'lucide-react'
import { INCIDENT_TYPE_LABEL, LOGS, type IncidentType } from '@/lib/surveillance-data'

const TYPE_ICON: Record<IncidentType, LucideIcon> = {
  fight: Siren,
  traffic: AlertTriangle,
  fall: Activity,
  suspicious: Eye,
}

const TYPE_TONE: Record<IncidentType, string> = {
  fight: 'border-police/50 bg-police/10 text-police',
  traffic: 'border-police/40 bg-police/10 text-police',
  fall: 'border-medical/50 bg-medical/10 text-medical',
  suspicious: 'border-suspicious/50 bg-suspicious/10 text-suspicious',
}

export function RecentEvents({ onViewAll }: { onViewAll: () => void }) {
  const items = LOGS.slice(0, 5)

  return (
    <section id="sec-events" aria-labelledby="events-title" className="glass flex scroll-mt-24 flex-col rounded-2xl">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 id="events-title" className="text-sm font-bold">
          آخر الأحداث
          <span className="ms-2 text-xs font-normal text-muted-foreground">من سجل الحوادث</span>
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground"
        >
          عرض الكل
        </button>
      </div>

      <ul className="flex flex-col gap-1 p-2">
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type]
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/50"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${TYPE_TONE[item.type]}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{INCIDENT_TYPE_LABEL[item.type]}</span>
                <span className="truncate text-[11px] text-muted-foreground">{item.location}</span>
              </div>
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{item.time}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}