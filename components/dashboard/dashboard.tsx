'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from './header'
import { FilterBar, type Filters } from './filter-bar'
import { CameraGrid } from './camera-grid'
import { AnalyticsPanel } from './analytics-panel'
import { AlertFeed } from './alert-feed'
import { IncidentLogs } from './incident-logs'
import { INCOMING_ALERTS, INITIAL_ALERTS, type Alert } from '@/lib/surveillance-data'

const SEVERITY_RANK = { police: 'high', medical: 'medium', suspicious: 'low', resolved: 'low' } as const

export function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    agency: 'all',
    severity: 'all',
    aiFilter: true,
    query: '',
  })
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [resolved, setResolved] = useState(0)
  const [focusedCam, setFocusedCam] = useState<string | null>(null)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      if (i >= INCOMING_ALERTS.length) return clearInterval(id)
      const next = INCOMING_ALERTS[i++]
      setAlerts((prev) => (prev.some((a) => a.id === next.id) ? prev : [next, ...prev]))
    }, 9000)
    return () => clearInterval(id)
  }, [])

  const handleAction = (id: string, kind: 'confirm' | 'dismiss' | 'stream') => {
    if (kind === 'stream') {
      const target = alerts.find((a) => a.id === id)
      const camNum = target?.camera.match(/\d+/)?.[0]
      if (camNum) setFocusedCam(`cam-${camNum.padStart(2, '0')}`)
      return
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    setResolved((n) => n + 1)
  }

  const q = filters.query.trim()
  const visibleAlerts = alerts.filter((a) => {
    if (filters.type !== 'all' && a.type !== filters.type) return false
    if (filters.agency !== 'all' && a.agency !== filters.agency) return false
    if (filters.severity !== 'all' && SEVERITY_RANK[a.severity] !== filters.severity) return false
    if (filters.aiFilter && a.confidence < 70) return false
    if (q && !`${a.location} ${a.camera} ${a.title}`.includes(q)) return false
    return true
  })

  return (
    <main className="mx-auto flex max-w-[1800px] flex-col gap-4 p-4 md:p-6">
      <DashboardHeader />
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 xl:grid-cols-[65fr_35fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <CameraGrid focusedId={focusedCam} onFocus={setFocusedCam} />
          <AnalyticsPanel />
        </div>
        <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <AlertFeed alerts={visibleAlerts} resolvedCount={resolved} onAction={handleAction} />
        </div>
      </div>

      <IncidentLogs aiFilterEnabled={filters.aiFilter} />
    </main>
  )
}
