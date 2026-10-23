'use client'

import { Info } from 'lucide-react'
import { CAMERAS, SEVERITY_CLASS } from '@/lib/surveillance-data'

// Positions are purely decorative (percent of the schematic canvas).
// They are NOT geographic coordinates.
const SCHEMATIC_POSITIONS = [
  { x: 62, y: 36 },
  { x: 28, y: 62 },
  { x: 80, y: 68 },
  { x: 45, y: 24 },
  { x: 14, y: 30 },
  { x: 54, y: 72 },
]

export function MapOverview({
  focusedId,
  onFocus,
  activeAlerts,
  resolvedCount,
}: {
  focusedId: string | null
  onFocus: (id: string) => void
  activeAlerts: number
  resolvedCount: number
}) {
  const camerasWithAlert = CAMERAS.filter((c) => c.status === 'alert').length

  const stats = [
    { label: 'الكاميرات في العرض', value: CAMERAS.length, tone: 'text-foreground' },
    { label: 'كاميرات عليها تنبيه', value: camerasWithAlert, tone: 'text-police' },
    { label: 'تنبيهات نشطة', value: activeAlerts, tone: 'text-medical' },
    { label: 'تم التعامل (الجلسة)', value: resolvedCount, tone: 'text-resolved' },
  ]

  return (
    <section id="sec-map" aria-labelledby="map-title" className="glass flex scroll-mt-24 flex-col rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 pb-3">
        <h2 id="map-title" className="text-sm font-bold">
          خريطة مواقع الكاميرات
        </h2>
        <span className="flex items-center gap-1.5 rounded-lg border border-suspicious/40 bg-suspicious/10 px-2.5 py-1 text-[11px] font-semibold text-suspicious">
          <Info className="size-3.5" aria-hidden />
          خريطة توضيحية وليست خريطة حية
        </span>
      </div>

      <div className="relative mx-4 h-56 overflow-hidden rounded-xl border border-border bg-background/70 sm:h-64">
        <svg
          viewBox="0 0 800 260"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="رسم تخطيطي لمواقع الكاميرات"
        >
          <defs>
            <pattern id="ain-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" strokeWidth="0.6" className="stroke-border" />
            </pattern>
            <radialGradient id="ain-map-glow" cx="50%" cy="45%" r="60%">
              <stop offset="0%" style={{ stopColor: 'var(--blue)', stopOpacity: 0.18 }} />
              <stop offset="100%" style={{ stopColor: 'var(--blue)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <rect width="800" height="260" fill="url(#ain-map-grid)" />
          <rect width="800" height="260" fill="url(#ain-map-glow)" />
          <g fill="none" strokeLinecap="round" className="stroke-blue" strokeOpacity="0.28">
            <path d="M-10 70 C 160 40, 300 120, 470 90 S 700 40, 820 80" strokeWidth="3" />
            <path d="M-10 190 C 120 170, 260 220, 430 180 S 680 150, 820 200" strokeWidth="3" />
            <path d="M120 -10 C 150 80, 100 150, 170 270" strokeWidth="2.5" />
            <path d="M360 -10 C 340 80, 400 160, 380 270" strokeWidth="2.5" />
            <path d="M600 -10 C 640 70, 570 150, 640 270" strokeWidth="2.5" />
            <path d="M-10 130 L 820 150" strokeWidth="1.5" />
            <path d="M240 -10 L 300 270" strokeWidth="1.5" />
            <path d="M720 -10 L 690 270" strokeWidth="1.5" />
          </g>
        </svg>

        {CAMERAS.map((cam, i) => {
          const pos = SCHEMATIC_POSITIONS[i % SCHEMATIC_POSITIONS.length]
          const isAlert = cam.status === 'alert'
          const tone = isAlert ? SEVERITY_CLASS[cam.severity].text : 'text-cyan'
          const selected = focusedId === cam.id
          return (
            <button
              key={cam.id}
              type="button"
              onClick={() => onFocus(cam.id)}
              aria-label={`كاميرا ${cam.number} - ${cam.location}`}
              aria-pressed={selected}
              className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 outline-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span
                className={`relative block size-3 rounded-full bg-current ${tone} ${isAlert ? 'animate-pulse-dot' : ''} ${
                  selected ? 'ring-4 ring-cyan/40' : ''
                } shadow-[0_0_14px_currentColor] transition-transform group-hover:scale-125 group-focus-visible:scale-125`}
              />
              <span className="pointer-events-none absolute start-1/2 top-full z-10 mt-0.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-0.5 text-[10px] font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                كاميرا {cam.number} · {cam.location}
              </span>
            </button>
          )
        })}
      </div>

      <dl className="mt-3 grid grid-cols-2 divide-x divide-x-reverse divide-border border-t border-border sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 px-4 py-3">
            <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
            <dd className={`text-2xl font-bold tabular-nums ${s.tone}`} dir="ltr">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}