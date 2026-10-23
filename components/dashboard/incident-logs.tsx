'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, Download, FileText, MoreHorizontal, Pin, Search, Sparkles, X } from 'lucide-react'
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
type StatusFilter = 'all' | LogStatus
type MenuState = { id: string; top: number; left: number } | null

const MENU_WIDTH = 192

export function IncidentLogs({ aiFilterEnabled }: { aiFilterEnabled: boolean }) {
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  // Session-only UI state: nothing here is written to the database.
  const [pinned, setPinned] = useState<string[]>([])
  const [overrides, setOverrides] = useState<Record<string, LogStatus>>({})
  const [menu, setMenu] = useState<MenuState>(null)

  useEffect(() => {
    if (!menu) return
    const close = () => setMenu(null)
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest('[data-log-menu]')) close()
    }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [menu])

  const filteredCount = LOGS.filter((l) => l.status === 'filtered').length
  const q = query.trim()

  const rows = useMemo(() => {
    const list = LOGS.map((l) => ({ ...l, status: overrides[l.id] ?? l.status }))
      // With the AI filter off, auto-discarded alerts were never separated, so the
      // full log shows them inline; with it on, they live in their own tab.
      .filter((l) => {
        if (tab === 'filtered') return l.status === 'filtered'
        return aiFilterEnabled ? l.status !== 'filtered' : true
      })
      .filter((l) => (statusFilter === 'all' ? true : l.status === statusFilter))
      .filter((l) => (pinnedOnly ? pinned.includes(l.id) : true))
      .filter((l) =>
        q ? `${l.id} ${INCIDENT_TYPE_LABEL[l.type]} ${l.location} ${l.agency}`.includes(q) : true,
      )
    return [...list].sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)))
  }, [tab, aiFilterEnabled, statusFilter, pinnedOnly, pinned, overrides, q])

  const togglePin = (id: string) =>
    setPinned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const markHandled = (id: string) => setOverrides((prev) => ({ ...prev, [id]: 'handled' }))

  const hasFilters = statusFilter !== 'all' || pinnedOnly || q !== ''
  const clearFilters = () => {
    setStatusFilter('all')
    setPinnedOnly(false)
    setQuery('')
  }

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
    const header = ['رقم الحادث', 'نوع الحادث', 'الموقع', 'التوقيت', 'الجهة المبلغة', 'حالة البلاغ']
    const lines = rows.map((r) =>
      [r.id, INCIDENT_TYPE_LABEL[r.type], r.location, r.time, r.agency, LOG_STATUS_LABEL[r.status]]
        .map(esc)
        .join(','),
    )
    const csv = '﻿' + [header.map(esc).join(','), ...lines].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'incident-log.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const menuRow = menu ? rows.find((r) => r.id === menu.id) : undefined

  return (
    <section id="sec-logs" aria-labelledby="logs-title" className="glass scroll-mt-24 rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="logs-title" className="text-base font-bold">
              سجل الحوادث
            </h2>
            <p className="text-xs text-muted-foreground">
              {rows.length} سجل · بيانات تجريبية
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex h-10 items-center sm:w-64">
              <span className="sr-only">بحث في السجل</span>
              <Search className="pointer-events-none absolute end-3 size-4 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث هنا..."
                className="h-10 w-full rounded-xl border border-border bg-secondary/60 pe-10 ps-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
              />
            </label>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rows.length === 0}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3 text-xs text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground disabled:opacity-40"
            >
              <Download className="size-3.5" aria-hidden />
              تصدير التقرير
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="عرض السجل"
            className="flex items-center gap-1 rounded-xl border border-border bg-secondary/60 p-1 text-xs"
          >
            <button
              role="tab"
              type="button"
              aria-selected={tab === 'all'}
              onClick={() => setTab('all')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                tab === 'all' ? 'bg-blue/20 text-cyan' : 'text-muted-foreground hover:text-foreground'
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                tab === 'filtered' ? 'bg-blue/20 text-cyan' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="size-3.5" aria-hidden />
              البلاغات المفلترة كاذبة
              <span className="rounded-full bg-secondary px-1.5 font-mono text-[10px] text-foreground">
                {filteredCount}
              </span>
            </button>
          </div>

          <label
            className={`relative inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs transition-colors focus-within:border-cyan/60 ${
              statusFilter !== 'all' ? 'border-cyan/50 bg-cyan/10' : 'border-border bg-secondary/60'
            }`}
          >
            <span className="text-muted-foreground">الحالة</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="cursor-pointer appearance-none bg-transparent pe-5 text-xs font-medium text-foreground outline-none"
            >
              <option value="all" className="bg-card">الكل</option>
              <option value="handled" className="bg-card">{LOG_STATUS_LABEL.handled}</option>
              <option value="ongoing" className="bg-card">{LOG_STATUS_LABEL.ongoing}</option>
              <option value="filtered" className="bg-card">{LOG_STATUS_LABEL.filtered}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute end-2.5 size-3.5 text-muted-foreground" aria-hidden />
          </label>

          <button
            type="button"
            role="switch"
            aria-checked={pinnedOnly}
            onClick={() => setPinnedOnly((v) => !v)}
            className="flex h-9 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span
              className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                pinnedOnly ? 'bg-cyan' : 'bg-border'
              }`}
            >
              <span
                className={`absolute size-3 rounded-full bg-background transition-transform ${
                  pinnedOnly ? 'translate-x-[-0.875rem]' : 'translate-x-[-0.125rem]'
                }`}
              />
            </span>
            <Pin className="size-3.5" aria-hidden />
            المثبّتة
            <span className="rounded-md bg-secondary px-1.5 font-mono text-[10px] text-foreground">
              {pinned.length}
            </span>
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ms-auto flex items-center gap-1 text-xs font-medium text-cyan underline-offset-4 hover:underline"
            >
              <X className="size-3" aria-hidden />
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-start font-medium">رقم الحادث</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">نوع الحادث</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">الموقع والتوقيت</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">الجهة المبلغة</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">حالة البلاغ</th>
              <th scope="col" className="px-4 py-3 text-start font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isPinned = pinned.includes(row.id)
              return (
                <tr
                  key={row.id}
                  className="border-t border-border/60 transition-colors hover:bg-cyan/[0.04]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground" dir="ltr">
                    <span className="flex items-center gap-2">
                      <Pin
                        className={`size-3.5 ${isPinned ? 'fill-medical text-medical' : 'text-transparent'}`}
                        aria-label={isPinned ? 'مثبّت' : undefined}
                      />
                      {row.id}
                    </span>
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
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[row.status]}`}
                      >
                        {LOG_STATUS_LABEL[row.status]}
                      </span>
                      {row.aiFiltered && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-2 py-1 text-[11px] font-semibold text-cyan">
                          <Sparkles className="size-3" aria-hidden />
                          <span dir="ltr">AI False Alarm Filter</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-log-menu
                      aria-label={`إجراءات ${row.id}`}
                      aria-haspopup="menu"
                      aria-expanded={menu?.id === row.id}
                      onClick={(e) => {
                        if (menu?.id === row.id) return setMenu(null)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setMenu({
                          id: row.id,
                          top: rect.bottom + 4,
                          left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
                        })
                      }}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-cyan/15 hover:text-cyan"
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              )
            })}
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

      <p className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        التثبيت وتعيين الحالة يُطبَّقان على هذه الجلسة فقط ولا يُحفظان في قاعدة البيانات.
      </p>

      {menu && menuRow && (
        <div
          role="menu"
          data-log-menu
          style={{ position: 'fixed', top: menu.top, left: menu.left, width: MENU_WIDTH }}
          className="z-50 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7)]"
        >
          <button
            role="menuitem"
            type="button"
            disabled={menuRow.status !== 'ongoing'}
            onClick={() => {
              markHandled(menuRow.id)
              setMenu(null)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="size-4 text-resolved" aria-hidden />
            تعيين كـ «تم التعامل»
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              togglePin(menuRow.id)
              setMenu(null)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <Pin className="size-4 text-medical" aria-hidden />
            {pinned.includes(menuRow.id) ? 'إلغاء التثبيت' : 'تثبيت'}
          </button>
        </div>
      )}
    </section>
  )
}