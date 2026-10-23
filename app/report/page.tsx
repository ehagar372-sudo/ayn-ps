import Link from 'next/link'
import { AinLogo } from '@/components/brand/ain-logo'
import { CitizenReportForm } from '@/components/report/citizen-report-form'

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <header className="border-b border-white/10 bg-[#0b1220]/90 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <AinLogo />
          <Link href="/sign-in" className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10">دخول المشرفين</Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5 lg:pt-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-cyan-300">عين للمجتمع</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">أبلغ عن حادثة،<br /><span className="text-cyan-300">ونحن نتابعها.</span></h1>
          <p className="max-w-md text-lg leading-8 text-slate-300">ساعد في جعل مدينتك أكثر أماناً. أرسل البلاغ وسيصلك رقم مرجعي لمتابعة حالته.</p>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1">
            {['إرسال آمن ومباشر', 'رقم مرجعي لكل بلاغ', 'متابعة دون كشف هويتك'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">{item}</div>)}
          </div>
        </div>
        <CitizenReportForm />
      </section>
    </main>
  )
}
