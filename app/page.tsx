import Link from 'next/link'
import {
  BellRing,
  ClipboardCheck,
  Database,
  LayoutDashboard,
  LogIn,
  Megaphone,
  ScanEye,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { AinLogo } from '@/components/brand/ain-logo'
import { HeroBackground } from '@/components/landing/hero-background'
import { IntroSplash } from '@/components/landing/intro-splash'
import { canAccessDashboard, getAccess } from '@/lib/session'

type Step = { icon: LucideIcon; title: string; text: string }

const TRACKS: { id: string; title: string; badge: string; steps: Step[] }[] = [
  {
    id: 'citizen',
    title: 'للمواطن',
    badge: 'بدون حساب',
    steps: [
      { icon: Megaphone, title: 'افتح نموذج البلاغ', text: 'اختر نوع الحادثة وحدّد الموقع واكتب وصفاً مختصراً لما حدث.' },
      { icon: ClipboardCheck, title: 'أرسل البلاغ', text: 'يتحقق النظام من البيانات ويسجّل البلاغ فور إرساله.' },
      { icon: Database, title: 'احتفظ بالرقم المرجعي', text: 'يظهر لك رقم فريد للبلاغ تحتفظ به للرجوع إليه عند الحاجة.' },
    ],
  },
  {
    id: 'staff',
    title: 'للمشرف',
    badge: 'بحساب معتمد',
    steps: [
      { icon: LogIn, title: 'سجّل الدخول', text: 'حسابات المشرفين يُنشئها مدير النظام، ولا يمكن التسجيل الذاتي فيها.' },
      { icon: LayoutDashboard, title: 'افتح لوحة غرفة العمليات', text: 'الكاميرات والخريطة والتنبيهات وسجل الحوادث في شاشة واحدة.' },
      { icon: BellRing, title: 'تابع التنبيهات', text: 'صفّ التنبيهات وأكّدها أو استبعدها، وأرسل بلاغاً يدوياً عند الحاجة.' },
    ],
  },
]

export default async function HomePage() {
  const staff = canAccessDashboard(await getAccess())

  return (
    <main className="min-h-screen">
      <IntroSplash />

      <header className="sticky top-0 z-30 border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <AinLogo className="text-cyan" />
          <nav aria-label="التنقل الرئيسي" className="flex items-center gap-1 text-sm sm:gap-2">
            <a href="#steps" className="hidden rounded-xl px-4 py-2 text-muted-foreground transition-colors hover:text-foreground md:block">
              الخطوات
            </a>
            <Link href="/report" className="hidden rounded-xl px-4 py-2 text-muted-foreground transition-colors hover:text-foreground sm:block">
              أرسل بلاغاً
            </Link>
            <Link
              href={staff ? '/supervisor' : '/sign-in'}
              className="rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 font-semibold text-cyan transition-colors hover:bg-cyan/20"
            >
              {staff ? 'لوحة غرفة العمليات' : 'دخول المشرفين'}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <HeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-36">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-cyan">
            <span className="size-1.5 rounded-full bg-cyan animate-pulse-dot" aria-hidden />
            نظام عين لمراقبة الطرق
          </p>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-tight text-balance md:text-7xl">
            بلاغ أوضح،
            <br />
            <span className="bg-gradient-to-l from-cyan to-blue bg-clip-text text-transparent">واستجابة أسرع.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            منصة تربط بلاغات المجتمع بغرفة العمليات، وتمنح المشرفين لوحة موحّدة لمتابعة الحوادث والتنبيهات على الطرق.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/report"
              className="rounded-xl bg-cyan px-7 py-3.5 font-bold text-primary-foreground transition-all hover:shadow-[0_0_28px_-4px_var(--cyan)]"
            >
              أرسل بلاغاً
            </Link>
            <Link
              href={staff ? '/supervisor' : '/sign-in'}
              className="rounded-xl border border-border bg-secondary/60 px-7 py-3.5 font-semibold backdrop-blur transition-colors hover:border-cyan/50"
            >
              {staff ? 'فتح لوحة غرفة العمليات' : 'دخول المشرفين'}
            </Link>
          </div>
        </div>
      </section>

      <section id="steps" aria-labelledby="steps-title" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-cyan">الخطوات</p>
          <h2 id="steps-title" className="mt-2 text-2xl font-bold md:text-3xl">
            كيف تستخدم النظام؟
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {TRACKS.map((track) => (
            <article key={track.id} className="glass rounded-2xl p-6 md:p-8">
              <header className="mb-6 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{track.title}</h3>
                <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">{track.badge}</span>
              </header>

              <ol className="flex flex-col gap-6">
                {track.steps.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="relative flex gap-4">
                    {i < track.steps.length - 1 && (
                      <span aria-hidden className="absolute start-[1.3rem] top-12 -bottom-6 w-px bg-gradient-to-b from-cyan/50 to-transparent" />
                    )}
                    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-sm font-bold text-cyan" dir="ltr">
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h4 className="flex items-center gap-2 font-bold">
                        <Icon className="size-4 text-cyan" aria-hidden />
                        {title}
                      </h4>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground text-pretty">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/report" className="rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-[0_0_28px_-4px_var(--cyan)]">
            ابدأ بإرسال بلاغ
          </Link>
        </div>
      </section>

      <section aria-labelledby="platform-title" className="mx-auto max-w-6xl px-5 pb-20">
        <h2 id="platform-title" className="mb-8 text-center text-2xl font-bold">
          مكوّنات المنصة
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="glass flex flex-col gap-3 rounded-2xl p-6">
            <span className="flex size-11 items-center justify-center rounded-xl border border-resolved/30 bg-resolved/10 text-resolved">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <h3 className="text-lg font-bold">لوحة غرفة العمليات</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              لوحة محمية بحسابات المشرفين، فيها الكاميرات والتنبيهات وسجل الحوادث والتحليلات. تُدار الحسابات بواسطة مدير النظام.
            </p>
          </article>
          <article className="glass flex flex-col gap-3 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl border border-suspicious/30 bg-suspicious/10 text-suspicious">
                <ScanEye className="size-5" aria-hidden />
              </span>
              <span className="rounded-md border border-suspicious/40 bg-suspicious/10 px-2 py-0.5 text-[11px] font-semibold text-suspicious">نموذج تجريبي</span>
            </div>
            <h3 className="text-lg font-bold">الرصد بالذكاء الاصطناعي</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              واجهة الكاميرات والكشف التلقائي معروضة حالياً ببيانات ولقطات ثابتة للتجربة. لم يُربط بعد بث مباشر أو نموذج استنتاج فعلي.
            </p>
          </article>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} نظام عين</span>
          <nav aria-label="روابط التذييل" className="flex gap-5">
            <a href="#steps" className="hover:text-foreground">الخطوات</a>
            <Link href="/report" className="hover:text-foreground">أرسل بلاغاً</Link>
            <Link href="/sign-in" className="hover:text-foreground">دخول المشرفين</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
