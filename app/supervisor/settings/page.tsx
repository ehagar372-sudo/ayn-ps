import type { Metadata } from 'next'
import { SectionShell } from '@/components/supervisor/section-shell'
import { SettingsPanel } from '@/components/supervisor/settings-panel'
import { requireStaffPage } from '@/lib/guards'

export const metadata: Metadata = {
  title: 'الإعدادات',
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {
  const access = await requireStaffPage()

  return (
    <SectionShell
      active="settings"
      isAdmin={access.role === 'admin'}
      title="الإعدادات"
      description="بيانات حسابك وكلمة المرور والجلسات."
    >
      <SettingsPanel name={access.name} email={access.email} roleLabel={access.role === 'admin' ? 'مدير النظام' : 'مشرف'} />
    </SectionShell>
  )
}
