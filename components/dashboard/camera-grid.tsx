'use client'

import Image from 'next/image'
import { Camera, Send, ZoomIn } from 'lucide-react'
import { CAMERAS, SEVERITY_CLASS, type Camera as Cam } from '@/lib/surveillance-data'
import { LAYOUT_LABEL, type LayoutMode } from './header'

function CameraTile({
  cam,
  focused,
  onFocus,
  onDispatch,
  large,
}: {
  cam: Cam
  focused: boolean
  onFocus: () => void
  onDispatch: () => void
  large?: boolean
}) {
  const sev = SEVERITY_CLASS[cam.severity]
  const isAlert = cam.status === 'alert'

  return (
    <article
      className={`group relative aspect-video overflow-hidden rounded-xl border bg-background lift ${
        isAlert ? `${sev.border} ${sev.ring}` : 'border-border hover:border-cyan/50 hover:glow-cyan'
      } ${focused ? 'ring-2 ring-cyan' : ''} ${large ? 'sm:col-span-2 sm:row-span-3' : ''}`}
    >
      <div className="absolute inset-0 animate-feed-noise">
        <Image
          src={cam.image}
          alt={`لقطة ثابتة من كاميرا ${cam.location}`}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover saturate-[0.8] contrast-[1.05]"
          priority={cam.number === '01'}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />
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

      <div
        className="absolute start-2 top-2 flex items-center gap-1.5 rounded-md bg-background/70 px-2 py-1 text-[10px] font-bold tracking-widest backdrop-blur"
        dir="ltr"
      >
        <span className="size-2 rounded-full bg-suspicious" />
        STILL / OFFLINE
      </div>

      <div
        className="absolute end-2 top-2 rounded-md bg-background/70 px-2 py-1 font-mono text-[10px] text-foreground/80 backdrop-blur"
        dir="ltr"
      >
        CAM-{cam.number}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">
            كاميرا {cam.number} - {cam.location}
          </h3>
          {isAlert ? (
            <span
              className={`mt-1 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${sev.bg} ${sev.border} ${sev.text}`}
            >
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
            { icon: ZoomIn, label: 'تكبير', onClick: onFocus },
            { icon: Camera, label: 'لقطة فورية' },
            { icon: Send, label: 'إرسال بلاغ يدوي', onClick: onDispatch, danger: true },
          ].map(({ icon: Icon, label, onClick, danger }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              onClick={onClick}
              className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                danger ? 'text-police hover:bg-police/15' : 'text-muted-foreground hover:bg-cyan/15 hover:text-cyan'
              }`}
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
  onDispatch,
  layout,
}: {
  focusedId: string | null
  onFocus: (id: string) => void
  onDispatch: (camId: string) => void
  layout: LayoutMode
}) {
  const primaryId = focusedId ?? CAMERAS[0].id
  const ordered =
    layout === 'focus'
      ? [...CAMERAS].sort((a, b) => (a.id === primaryId ? -1 : b.id === primaryId ? 1 : 0))
      : CAMERAS

  const gridClass =
    layout === '2x2'
      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
      : layout === 'focus'
        ? 'grid grid-cols-1 gap-3 sm:grid-cols-3 sm:auto-rows-min'
        : 'flex flex-col gap-3'

  return (
    <section id="sec-cameras" aria-labelledby="cams-title" className="glass flex scroll-mt-24 flex-col gap-3 rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="cams-title" className="text-sm font-bold">
          لقطات الكاميرات
          <span className="ms-2 text-xs font-normal text-muted-foreground">
            {CAMERAS.length} كاميرات · لقطات ثابتة وبيانات رصد تجريبية
          </span>
        </h2>
        <span className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">
          النمط: <span className="font-semibold text-cyan">{LAYOUT_LABEL[layout]}</span>
        </span>
      </div>
      <div className={gridClass}>
        {ordered.map((cam, i) => (
          <CameraTile
            key={cam.id}
            cam={cam}
            focused={focusedId === cam.id}
            large={layout === 'focus' && i === 0}
            onFocus={() => onFocus(cam.id)}
            onDispatch={() => onDispatch(cam.id)}
          />
        ))}
      </div>
    </section>
  )
}