'use client'

import { useEffect, useState } from 'react'
import { AinLogo } from '@/components/brand/ain-logo'

const SEEN_KEY = 'ain-intro-seen'
const VISIBLE_MS = 1800
const FADE_MS = 500

/**
 * Short opening screen, shown once per browser session on the landing page.
 * Skipped for reduced-motion users and when storage is unavailable it simply
 * shows again on the next visit. Click or Escape dismisses it.
 */
export function IntroSplash() {
  const [phase, setPhase] = useState<'idle' | 'show' | 'leave' | 'done'>('idle')

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      // storage blocked: treat as unseen
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduce) {
      setPhase('done')
      return
    }

    setPhase('show')
    const leave = setTimeout(() => setPhase('leave'), VISIBLE_MS)
    const done = setTimeout(() => {
      setPhase('done')
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        // ignore
      }
    }, VISIBLE_MS + FADE_MS)
    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhase('done')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  if (phase === 'idle' || phase === 'done') return null

  const dismiss = () => {
    setPhase('done')
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div
      role="dialog"
      aria-label="مرحباً بك في نظام عين"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background transition-opacity ${
        phase === 'leave' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-3xl" aria-hidden />
      <div className="relative flex flex-col items-center gap-6 animate-intro-rise">
        <div className="animate-eye-glow text-cyan">
          <AinLogo className="scale-150" />
        </div>
        <p className="text-sm text-muted-foreground">نظام مراقبة الطرق بالذكاء الاصطناعي</p>
      </div>
      <div className="relative h-1 w-48 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan to-violet animate-intro-bar" />
      </div>
      <button type="button" onClick={dismiss} className="relative text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        تخطّي
      </button>
    </div>
  )
}
