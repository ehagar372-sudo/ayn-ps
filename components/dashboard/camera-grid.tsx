'use client'

import Image from 'next/image'
import { Camera, Maximize2, RefreshCw, Volume2, ZoomIn } from 'lucide-react'
import { CAMERAS, SEVERITY_CLASS, type Camera as Cam } from '@/lib/surveillance-data'

function CameraTile({ cam, focused, onFocus }: { cam: Cam; focused: boolean; onFocus: () => void }) {
  const sev = SEVERITY_CLASS[cam.severity]
  const isAlert = cam.status === 'alert'

  return (
    <article
      className={`group relative aspect-video overflow-hidden rounded-xl border bg-background lift ${
        isAlert ? `${sev.border} ${sev.ring}` : 'border-border hover:border-cyan/50 hover:glow-cyan'
      } ${focused ? 'ring-2 ring-cyan' : ''}`}
    >
      <div className="absolute inset-0 animate-feed-noise">
        <Image
          src={cam.image}
          alt={`بث مباشر من ${cam.location}`}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover saturate-[0.7] contrast-[1.05]"
          priority={cam.number === '01'}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40" />

      {cam.boxes.map((box) => (
        <div
          key={box.label}
          className="absolute"
          style={{ top: box.top, right: box.right, width: box.width, height: box.height }}
        >
          <div className={`bbox inset-0 ${SEVERITY_CLASS[box.severity].text}`} />
          <span
            className={`absolute -top-6 end-0 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground ${
              box.severity === 'medical' ? 'bg-medical' : 'bg-police'
            }`}
          >
            {box.label}
          </span>
        </div>
      ))}

      <div className="absolute start-2 top-2 flex items-center gap-1.5 rounded-md bg-background/70 px-2 py-1 text-[10px] font-bold tracking-widest backdrop-blur" dir="ltr">
        <span className="size-2 rounded-full bg-police text-police animate-pulse-dot" />
        LIVE
      </div>

      <div className="absolute end-2 top-2 font-mono text-[10px] text-foreground/80" dir="ltr">
        CAM-{cam.number} · 1080p · 30fps
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">
            كاميرا {cam.number} - {cam.location}
          </h3>
          {isAlert ? (
            <span className={`mt-1 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${sev.bg} ${sev.border} ${sev.text}`}>
              <span className="size-1.5 rounded-full bg-current animate-pulse-dot" />
              تنبيه نشط: {cam.alertLabel}
            </span>
          ) : (
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-resolved/50 bg-resolved/10 px-2 py-0.5 text-[11px] font-semibold text-resolved">
              <span className="size-1.5 rounded-full bg-current" />
              الوضع طبيعي
            </span>
          )}
        </div>

        <div className="flex translate-y-2 items-center gap-1 rounded-lg border border-border bg-background/80 p-1 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {[
            { icon: ZoomIn, label: 'تكبير' },
            { icon: RefreshCw, label: 'تبديل البث' },
            { icon: Camera, label: 'لقطة' },
            { icon: Volume2, label: 'الصوت' },
            { icon: Maximize2, label: 'ملء الشاشة', onClick: onFocus },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              onClick={onClick}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-cyan/15 hover:text-cyan"
            >
              <Icon className="size-3.5" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export function CameraGrid({
  focusedId,
  onFocus,
}: {
  focusedId: string | null
  onFocus: (id: string) => void
}) {
  return (
    <section aria-labelledby="cams-title" className="glass flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h2 id="cams-title" className="text-sm font-bold">
          البث المباشر للكاميرات
          <span className="ms-2 text-xs font-normal text-muted-foreground">4 من 128 كاميرا</span>
        </h2>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/60 p-0.5 text-xs">
          <button type="button" className="rounded-md bg-cyan/15 px-2.5 py-1 font-semibold text-cyan">
            2×2
          </button>
          <button type="button" className="rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground">
            3×3
          </button>
          <button type="button" className="rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground">
            4×4
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CAMERAS.map((cam) => (
          <CameraTile key={cam.id} cam={cam} focused={focusedId === cam.id} onFocus={() => onFocus(cam.id)} />
        ))}
      </div>
    </section>
  )
}
