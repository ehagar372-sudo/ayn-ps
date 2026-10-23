'use client'

import { Moon, Sun, Languages } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AppPreferences() {
  const [dark, setDark] = useState(true)
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')

  useEffect(() => {
    const storedTheme = document.cookie.match(/(?:^|; )ain-theme=(dark|light)/)?.[1]
    const storedLanguage = document.cookie.match(/(?:^|; )ain-language=(ar|en)/)?.[1] as 'ar' | 'en' | undefined
    const nextDark = storedTheme !== 'light'
    const nextLanguage = storedLanguage ?? 'ar'
    setDark(nextDark)
    setLanguage(nextLanguage)
    document.documentElement.classList.toggle('dark', nextDark)
    document.documentElement.lang = nextLanguage
    document.documentElement.dir = nextLanguage === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.cookie = `ain-theme=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.classList.toggle('dark', next)
  }

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar'
    setLanguage(next)
    document.cookie = `ain-language=${next}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div className="flex items-center gap-1" aria-label="إعدادات العرض">
      <button type="button" onClick={toggleLanguage} className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground" aria-label="تغيير اللغة">
        <Languages className="size-4" aria-hidden />
        {language === 'ar' ? 'EN' : 'عربي'}
      </button>
      <button type="button" onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground hover:text-foreground" aria-label={dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}>
        {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
