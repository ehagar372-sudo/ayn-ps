'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { AppHeader, type LayoutMode, type View } from './header'
import { Sidebar } from './sidebar'
import { FilterBar, type Filters } from './filter-bar'
import { CameraGrid } from './camera-grid'
import { MapOverview } from './map-overview'
import { AnalyticsPanel } from './analytics-panel'
import { AlertFeed } from './alert-feed'
import { RecentEvents } from './recent-events'
import { IncidentLogs } from './incident-logs'
import { PitchView } from '@/components/pitch/pitch-view'
import { CAMERAS, INCOMING_ALERTS, INITIAL_ALERTS, type Alert } from '@/lib/surveillance-data'

const SEVERITY_RANK = { police: 'high', medical: 'medium', suspicious: 'low', resolved: 'low' } as const

function manualAlert(camId: string | null, seq: number): Alert {
  const cam = CAMERAS.find((c) => c.id === camId) ?? CAMERAS[0]
  const time = new Intl.DateTimeFormat('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }).format(new Date())
  return {
    id: `MAN-${String(seq).padStart(4, '0')}`,
    severity: 'police',
    type: 'suspicious',
    agency: 'interior',
    title: 'بلاغ طوارئ يدوي من مشرف غرفة العمليات',
    location: cam.location,
    camera: `الكاميرا ${cam.number}`,
    cameraId: cam.id,
    time,
    confidence: 100,
    agencyLabel: 'تم التوجيه يدوياً إلى: وزارة الداخلية (غرفة العمليات المركزية)',
    gps: { lat: '30.0444° N', lng: '31.2357° E', district: 'تحديد يدوي' },
    actions: [
      { label: 'تأكيد واستدعاء الدوريات', kind: 'confirm' },
      { label: 'إلغاء البلاغ', kind: 'dismiss' },
    ],
  }
}

export function Dashboard() {
  const router = useRouter()
  const [view, setView] = useState<View>('dashboard')
  const [layout, setLayout] = useState<LayoutMode>('2x2')
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    agency: 'all',
    severity: 'all',
    aiFilter: true,
    query: '',
  })
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [resolved, setResolved] = useState(0)
  const [manualSeq, setManualSeq] = useState(1)
  const [focusedCam, setFocusedCam] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
      if (target && CAMERAS.some((c) => c.id === target.cameraId)) {
        setFocusedCam(target.cameraId)
        setLayout('focus')
      }
      return
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    setResolved((n) => n + 1)
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.replace('/sign-in')
    router.refresh()
  }

  const dispatchManual = (camId: string | null) => {
    setAlerts((prev) => [manualAlert(camId, manualSeq), ...prev])
    setManualSeq((n) => n + 1)
    setView('dashboard')
  }

  // Sidebar links scroll to sections that already exist on the dashboard page.
  const scrollToSection = (sectionId: string) => {
    const go = () => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (view !== 'dashboard') {
      setView('dashboard')
      setTimeout(go, 120)
    } else {
      go()
    }
  }

  const q = filters.query.trim()
  const visibleAlerts = alerts.filter((a) => {
    if (filters.type !== 'all' && a.type !== filters.type) return false
    if (filters.agency !== 'all' && a.agency !== filters.agency) return false
    if (filters.severity !== 'all' && SEVERITY_RANK[a.severity] !== filters.severity) return false
    if (filters.aiFilter && a.confidence < 70) return false
    if (q && !`${a.location} ${a.camera} ${a.title} ${a.id}`.includes(q)) return false
    return true
  })

  const cameraNormal = CAMERAS.filter((c) => c.status === 'normal').length

  return (
    <div className="mx-auto flex max-w-[1800px] items-start gap-4 p-3 md:p-4">
      <Sidebar
        view={view}
        onViewChange={setView}
        onNavigate={scrollToSection}
        onSignOut={handleSignOut}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        cameraTotal={CAMERAS.length}
        cameraNormal={cameraNormal}
        activeAlerts={visibleAlerts.length}
        resolvedCount={resolved}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-4">
        <AppHeader
          view={view}
          onViewChange={setView}
          layout={layout}
          onLayoutChange={setLayout}
          onManualDispatch={() => dispatchManual(focusedCam)}
          onSignOut={handleSignOut}
          onMenuClick={() => setMenuOpen(true)}
        />

        {view === 'pitch' ? (
          <PitchView onOpenDashboard={() => setView('dashboard')} />
        ) : (
          <div key="dashboard" className="flex flex-col gap-4 animate-fade-up">
            <FilterBar filters={filters} onChange={setFilters} />

            <div className="grid gap-4 xl:grid-cols-[65fr_35fr]">
              <div className="flex min-w-0 flex-col gap-4">
                <CameraGrid
                  focusedId={focusedCam}
                  onFocus={setFocusedCam}
                  onDispatch={dispatchManual}
                  layout={layout}
                />
                <MapOverview
                  focusedId={focusedCam}
                  onFocus={setFocusedCam}
                  activeAlerts={visibleAlerts.length}
                  resolvedCount={resolved}
                />
                <AnalyticsPanel />
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <AlertFeed alerts={visibleAlerts} resolvedCount={resolved} onAction={handleAction} />
                <RecentEvents onViewAll={() => scrollToSection('sec-logs')} />
              </div>
            </div>

            <IncidentLogs aiFilterEnabled={filters.aiFilter} />
          </div>
        )}
      </main>
    </div>
  )
}