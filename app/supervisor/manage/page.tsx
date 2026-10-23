import { redirect } from 'next/navigation'
import Link from 'next/link'
import { listSupervisors } from '@/app/actions/supervisors'
import { SupervisorManagement } from '@/components/supervisor-management'

export default async function SupervisorManagementPage() {
  try { const supervisors = await listSupervisors(); return <main className="min-h-screen bg-[#070b14] p-6 text-white"><div className="mx-auto max-w-6xl"><Link href="/supervisor" className="text-sm text-cyan-300">العودة إلى لوحة المشرف</Link><SupervisorManagement initial={supervisors} /></div></main> } catch { redirect('/sign-in') }
}
