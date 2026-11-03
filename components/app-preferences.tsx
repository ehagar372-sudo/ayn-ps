'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const COOKIE = 'ain-theme'

export function AppPreferences() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(dark|light)`))?.[1]
    const nextDark = stored !== 'light'
    setDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.cookie = `${COOKIE}=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="fixed bottom-4 end-4 z-[60]">
      <button
        type="button"
        onClick={toggleTheme}
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/90 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:text-foreground"
        aria-label={dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      >
        {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
