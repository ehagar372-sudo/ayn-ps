'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BrainCircuit,
  ChevronLeft,
  ClipboardList,
  Eye,
  Filter,
  LayoutDashboard,
  Radio,
  ScanEye,
  Send,
  ShieldCheck,
  Siren,
  Video,
  Zap,
} from 'lucide-react'

const PROBLEMS = [
  { icon: Siren, text: 'تأخر الإبلاغ عن الجرائم والمشاجرات لدقائق حرجة بسبب اعتماد المراقبة على العين البشرية.' },
  { icon: AlertTriangle, text: 'حوادث الطرق تُكتشف غالباً بعد وصول بلاغ من المواطنين، لا من الكاميرا التي رصدتها.' },
  { icon: Eye, text: 'مشغّل واحد لا يستطيع مراقبة أكثر من 4-6 شاشات بفاعلية، بينما تضم المدن آلاف الكاميرات.' },
]

const SOLUTIONS = [
  { icon: ScanEye, text: 'تحليل رؤية حاسوبية فوري لكل بث مباشر على مدار الساعة دون تدخل بشري.' },
  { icon: Zap, text: 'توجيه بلاغات آلي بزمن استجابة شبه صفري إلى الجهة المختصة بحسب نوع الحدث.' },
  { icon: ShieldCheck, text: 'محرك فلترة ذكي يستبعد البلاغات الكاذبة قبل أن تُستهلك موارد الطوارئ.' },
]

const STEPS = [
  {
    icon: Video,
    title: 'استقبال البث المباشر',
    en: 'CCTV Ingestion',
    detail: 'ربط 2,450 كاميرا عبر بروتوكول RTSP مع معالجة موزعة على الحافة (Edge) لتقليل زمن الوصول.',
  },
  {
    icon: BrainCircuit,
    title: 'رصد الذكاء الاصطناعي',
    en: 'AI Detection',
    detail: 'نماذج رؤية حاسوبية مدرّبة على المشاجرات، السقوط، حوادث السير والحركة المشبوهة بدقة 98.4%.',
  },
  {
    icon: Filter,
    title: 'فلترة البلاغات الكاذبة',
    en: 'False Alarm Engine',
    detail: 'طبقة تحقق ثانية تدرس السياق الزمني والمكاني لاستبعاد 27% من التنبيهات غير الحقيقية.',
  },
  {
    icon: Send,
    title: 'توجيه البلاغ فورياً',
    en: 'Automated Dispatch',
    detail: 'إرسال تلقائي لغرفة عمليات الداخلية أو هيئة الإسعاف مع الإحداثيات ولقطة الحدث ونسبة التأكد.',
  },
  {
    icon: ClipboardList,
    title: 'سجل غرفة التحكم',
    en: 'Command Log',
    detail: 'أرشفة كاملة لكل حدث وقرار وزمن استجابة لأغراض التدقيق والتحليل التاريخي.',
  },
]

const FEATURES = [
  {
    icon: Radio,
    title: 'معالجة البث المباشر في الزمن الحقيقي',
    detail: 'تحليل متوازٍ لآلاف التدفقات مع زمن استنتاج أقل من 120 مللي ثانية لكل إطار.',
    metric: '< 120ms',
    metricLabel: 'زمن الاستنتاج',
  },
  {
    icon: Send,
    title: 'توجيه ذكي آلي بحسب نوع الحدث',
    detail: 'خرائط قرار تربط كل تصنيف بالجهة المختصة: الداخلية، المرور، أو الإسعاف وأقرب مستشفى.',
    metric: '0 ثانية',
    metricLabel: 'تأخير بشري',
  },
  {
    icon: ShieldCheck,
    title: 'نظام تقليل البلاغات الكاذبة',
    detail: 'تحقق متعدد المراحل يمنع إهدار موارد الطوارئ ويرفع ثقة الجهات المستفيدة في التنبيهات.',
    metric: '-27%',
    metricLabel: 'بلاغات كاذبة',
  },
  {
    icon: LayoutDashboard,
    title: 'لوحة تحكم تحليلية مع تدقيق تاريخي',
    detail: 'مؤشرات أداء حية، سجل حوادث قابل للتصدير، وتتبع كامل لدورة حياة كل بلاغ.',
    metric: '100%',
    metricLabel: 'قابلية التدقيق',
  },
]

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-widest text-cyan" dir="ltr">
          {eyebrow}
        </span>
        <h2 id={id} className="text-2xl font-bold text-balance md:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export function PitchView({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="flex flex-col gap-16 pb-8 animate-fade-up">
      <section className="glass relative overflow-hidden rounded-2xl p-8 md:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
              <span className="size-1.5 rounded-full bg-cyan animate-pulse-dot" />
              عرض تقديمي للمستثمرين والجهات الحكومية
            </span>
            <h2 className="text-3xl font-bold leading-tight text-balance md:text-5xl">
              مشروع عين: عينٌ لا تنام على كل شارع في المدينة
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
              منظومة ذكاء اصطناعي تحوّل كاميرات المراقبة الحالية من أرشيف صامت إلى مُبلّغ فوري، يرصد الحدث ويوجّه البلاغ إلى
              الجهة المختصة في اللحظة نفسها — قبل أن يرفع أي مواطن هاتفه.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_-4px_var(--cyan)]"
              >
                جرّب لوحة التحكم المباشرة
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-cyan/50"
              >
                كيف يعمل النظام؟
              </a>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-3 lg:w-auto lg:min-w-[22rem]">
            {[
              { v: '2,450', l: 'كاميرا متصلة' },
              { v: '98.4%', l: 'دقة التنبؤ' },
              { v: '2:41', l: 'متوسط زمن الاستجابة' },
            ].map((s) => (
              <div key={s.l} className="flex flex-col gap-1 rounded-xl border border-border bg-background/60 p-4 text-center">
                <dd className="text-2xl font-bold tabular-nums text-cyan" dir="ltr">
                  {s.v}
                </dd>
                <dt className="text-[11px] text-muted-foreground">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section id="problem-solution" eyebrow="01 — THE PROBLEM & SOLUTION" title="المشكلة التي نحلّها، والحل الذي نقدّمه">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass flex flex-col gap-4 rounded-2xl border-t-2 border-t-police p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-police">
              <AlertTriangle className="size-5" aria-hidden />
              المشكلة: المراقبة البشرية تتأخر
            </h3>
            <ul className="flex flex-col gap-3">
              {PROBLEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3 text-sm leading-relaxed text-pretty">
                  <Icon className="mt-0.5 size-4 shrink-0 text-police" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass flex flex-col gap-4 rounded-2xl border-t-2 border-t-cyan p-6 glow-cyan">
            <h3 className="flex items-center gap-2 text-lg font-bold text-cyan">
              <Eye className="size-5" aria-hidden />
              الحل: مشروع عين
            </h3>
            <ul className="flex flex-col gap-3">
              {SOLUTIONS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 rounded-xl border border-cyan/20 bg-cyan/5 p-3 text-sm leading-relaxed text-pretty">
                  <Icon className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="how-it-works" eyebrow="02 — HOW IT WORKS" title="من الإطار الأول إلى البلاغ: خمس خطوات آلية">
        <div className="glass rounded-2xl p-6">
          <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const active = activeStep === i
              return (
                <li key={step.title} className="flex flex-1 items-stretch gap-0 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => setActiveStep(i)}
                    aria-pressed={active}
                    className={`flex w-full flex-1 flex-col items-center gap-3 rounded-xl border p-4 text-center transition-all duration-300 ${
                      active
                        ? 'border-cyan/60 bg-cyan/10 glow-cyan scale-[1.02]'
                        : 'border-border bg-background/50 hover:border-cyan/40'
                    }`}
                  >
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl border ${
                        active ? 'border-cyan bg-cyan text-primary-foreground' : 'border-border bg-secondary text-cyan'
                      }`}
                    >
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="text-sm font-bold">{step.title}</span>
                    <span className="text-[10px] tracking-wider text-muted-foreground" dir="ltr">
                      {step.en}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="hidden h-0.5 w-6 shrink-0 self-center lg:block flow-line" aria-hidden />
                  )}
                </li>
              )
            })}
          </ol>
          <p className="mt-5 rounded-xl border border-cyan/20 bg-cyan/5 p-4 text-sm leading-relaxed text-pretty">
            <span className="me-2 font-bold text-cyan">الخطوة {activeStep + 1}:</span>
            {STEPS[activeStep].detail}
          </p>
        </div>
      </Section>

      <Section id="features" eyebrow="03 — KEY FEATURES" title="المزايا الجوهرية للمنظومة">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, detail, metric, metricLabel }) => (
            <article key={title} className="glass flex flex-col gap-4 rounded-2xl p-6 lift hover:border-cyan/50">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="text-end">
                  <span className="block text-xl font-bold tabular-nums text-cyan" dir="ltr">
                    {metric}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{metricLabel}</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-balance">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="glass flex flex-col items-center gap-4 rounded-2xl border-cyan/30 p-8 text-center glow-cyan">
        <h2 className="text-2xl font-bold text-balance">جاهز للنشر على البنية التحتية الحالية دون استبدال كاميرا واحدة</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
          يعمل مشروع عين كطبقة ذكاء فوق شبكات المراقبة القائمة، ويتكامل عبر واجهات برمجية موحدة مع غرف عمليات الداخلية وهيئة الإسعاف.
        </p>
        <button
          type="button"
          onClick={onOpenDashboard}
          className="flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_-4px_var(--cyan)]"
        >
          الانتقال إلى غرفة العمليات
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      </section>
    </div>
  )
}
