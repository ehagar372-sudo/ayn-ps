'use client'

import { useState } from 'react'
import { Download, Eye, FileText, MoreHorizontal, Sparkles } from 'lucide-react'
import {
  INCIDENT_TYPE_LABEL,
  LOG_STATUS_LABEL,
  LOGS,
  type LogEntry,
  type LogStatus,
} from '@/lib/surveillance-data'

const STATUS_STYLE: Record<LogStatus, string> = {
  handled: 'border-resolved/50 bg-resolved/10 text-resolved',
  ongoing: 'border-medical/50 bg-medical/10 text-medical',
  filtered: 'border-border bg-secondary/60 text-muted-foreground',
}

const TYPE_DOT: Record<LogEntry['type'], string> = {
  fight: 'bg-police',
  traffic: 'bg-police/70',
  fall: 'bg-medical',
  suspicious: 'bg-suspicious',
}

type Tab = 'all' | 'filtered'

export function IncidentLogs({ aiFilterEnabled }: { aiFilterEnabled: boolean }) {
  const [tab, setTab] = useState<Tab>('all')

  // With the AI filter off, auto-discarded alerts were never separated, so the
  // full log shows them inline; with it on, they live in their own tab.
  const rows = LOGS.filter((l) => {
    if (tab === 'filtered') return l.status === 'filtered'
    return aiFilterEnabled ? l.status !== 'filtered' : true
  })

  const filteredCount = LOGS.filter((l) => l.status === 'filtered').length

  return (
    <section aria-labelledby="logs-title" className="glass rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 id="logs-title" className="sr-only">
          سجل الحوادث
        </h2>
        <div role="tablist" aria-label="عرض السجل" className="flex items-center gap-1 rounded-lg border border-border bg-secondary/60 p-1 text-xs">
          <button
            role="tab"
            type="button"
            aria-selected={tab === 'all'}
            onClick={() => setTab('all')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors ${
              tab === 'all' ? 'bg-cyan/15 text-cyan' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="size-3.5" aria-hidden />
            سجل الحوادث والتحليلات
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={tab === 'filtered'}
            onClick={() => setTab('filtered')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors ${
              tab === 'filtered' ? 'bg-cyan/15 text-cyan' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="size-3.5" aria-hidden />
            البلاغات المفلترة كاذبة
            <span className="rounded-full bg-secondary px-1.5 font-mono text-[10px] text-foreground">{filteredCount}</span>
          </button>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground"
        >
          <Download className="size-3.5" aria-hidden />
          تصدير التقرير
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-start font-medium">رقم الحادث</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">نوع الحادث</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">الموقع والتوقيت</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">الجهة المبلغة</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">حالة البلاغ</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-cyan/[0.04]">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground" dir="ltr">
                  {row.id}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${TYPE_DOT[row.type]}`} />
                    {INCIDENT_TYPE_LABEL[row.type]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block">{row.location}</span>
                  <span className="block text-xs text-muted-foreground">{row.time}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.agency}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[row.status]}`}>
                      {LOG_STATUS_LABEL[row.status]}
                    </span>
                    {row.aiFiltered && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-cyan">
                        <Sparkles className="size-3" aria-hidden />
                        <span dir="ltr">AI False Alarm Filter</span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="عرض التفاصيل" className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-cyan/15 hover:text-cyan">
                      <Eye className="size-4" aria-hidden />
                    </button>
                    <button type="button" aria-label="المزيد" className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-cyan/15 hover:text-cyan">
                      <MoreHorizontal className="size-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  لا توجد سجلات مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
