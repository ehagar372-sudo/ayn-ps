import type { ReactNode } from 'react'
import Link from 'next/link'
import { Cpu, FileText, LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react'
import { AinLogo } from '@/components/brand/ain-logo'

export type SectionKey = 'reports' | 'system' | 'settings'

const TABS: { key: SectionKey | 'dashboard' | 'manage'; label: string; href: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { key: 'dashboard', label: 'لوحة التحكم', href: '/supervisor', icon: LayoutDashboard },
  { key: 'reports', label: 'التقارير', href: '/supervisor/reports', icon: FileText },
  { key: 'system', label: 'النظام', href: '/supervisor/system', icon: Cpu, adminOnly: true },
  { key: 'manage', label: 'إدارة المشرفين', href: '/supervisor/manage', icon: Users, adminOnly: true },
  { key: 'settings', label: 'الإعدادات', href: '/supervisor/settings', icon: Settings },
]

/** Shared frame for the supervisor sub-pages (reports, system, settings). */
export function SectionShell({
  active,
  isAdmin,
  title,
  description,
  actions,
  children,
}: {
  active: SectionKey
  isAdmin: boolean
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <main className="min-h-screen p-3 md:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="glass flex flex-col gap-3 rounded-2xl px-4 py-3 md:flex-row md:items-center md:justify-between">
          <Link href="/supervisor" aria-label="لوحة التحكم">
            <AinLogo compact className="text-cyan" />
          </Link>
          <nav aria-label="أقسام المشرف" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:pb-0">
            {TABS.filter((t) => !t.adminOnly || isAdmin).map(({ key, label, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                aria-current={key === active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  key === active
                    ? 'border-blue/40 bg-blue/15 font-semibold text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                <Icon className={`size-4 ${key === active ? 'text-cyan' : ''}`} aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {actions}
        </div>

        {children}
      </div>
    </main>
  )
}
