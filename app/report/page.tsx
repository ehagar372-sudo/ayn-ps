import type { Metadata } from 'next'
import Link from 'next/link'
import { AinLogo } from '@/components/brand/ain-logo'
import { CitizenReportForm } from '@/components/report/citizen-report-form'

export const metadata: Metadata = {
  title: 'أرسل بلاغاً',
  description: 'أرسل بلاغاً عن حادثة أو حالة طارئة على الطريق. لا حاجة لإنشاء حساب.',
}

const POINTS = ['لا حاجة لإنشاء حساب', 'رقم مرجعي لكل بلاغ', 'وسيلة التواصل اختيارية']

export default function ReportPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="الصفحة الرئيسية">
            <AinLogo className="text-cyan" />
          </Link>
          <Link href="/sign-in" className="rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/20">
            دخول المشرفين
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5 lg:pt-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-cyan">عين للمجتمع</p>
          <h1 className="text-4xl font-extrabold leading-tight text-balance md:text-5xl">
            أبلغ عن حادثة،
            <br />
            <span className="text-cyan">ونسجّلها لدى غرفة العمليات.</span>
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground text-pretty">
            ساعد في جعل الطرق أكثر أماناً. أرسل البلاغ وسيصلك رقم مرجعي خاص به.
          </p>
          <ul className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            {POINTS.map((item) => (
              <li key={item} className="glass rounded-xl px-4 py-3 text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <CitizenReportForm />
      </section>
    </main>
  )
}
