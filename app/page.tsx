import Link from 'next/link'
import { ClipboardCheck, Database, Megaphone, ScanEye, ShieldCheck } from 'lucide-react'
import { AinLogo } from '@/components/brand/ain-logo'
import { canAccessDashboard, getAccess } from '@/lib/session'

const STEPS = [
  { icon: Megaphone, title: 'أرسل بلاغاً', text: 'نموذج بسيط لا يتطلب حساباً. حدّد نوع الحادثة والموقع واكتب وصفاً مختصراً.' },
  { icon: ClipboardCheck, title: 'رقم مرجعي', text: 'يحصل كل بلاغ على رقم مرجعي فريد فور تسجيله، للرجوع إليه عند الحاجة.' },
  { icon: Database, title: 'حفظ آمن', text: 'يُحفظ البلاغ في قاعدة بيانات النظام ضمن سجل الحوادث الخاص بغرفة العمليات.' },
]

export default async function HomePage() {
  const staff = canAccessDashboard(await getAccess())

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <AinLogo className="text-cyan" />
          <nav aria-label="التنقل الرئيسي" className="flex items-center gap-2 text-sm">
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

      <section className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
        <p className="text-sm font-semibold tracking-[0.25em] text-cyan">نظام عين لمراقبة الطرق</p>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-balance md:text-6xl">
          بلاغ أوضح،
          <br />
          <span className="text-cyan">واستجابة أسرع.</span>
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
            className="rounded-xl border border-border bg-secondary/60 px-7 py-3.5 font-semibold transition-colors hover:border-cyan/50"
          >
            {staff ? 'فتح لوحة غرفة العمليات' : 'دخول المشرفين'}
          </Link>
        </div>
      </section>

      <section aria-labelledby="how-title" className="mx-auto max-w-6xl px-5 pb-16">
        <h2 id="how-title" className="mb-8 text-center text-2xl font-bold">
          كيف يعمل الإبلاغ؟
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="glass flex flex-col gap-3 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-sm text-muted-foreground" dir="ltr">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground text-pretty">{text}</p>
            </li>
          ))}
        </ol>
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
              <span className="rounded-md border border-suspicious/40 bg-suspicious/10 px-2 py-0.5 text-[11px] font-semibold text-suspicious">
                نموذج تجريبي
              </span>
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
            <Link href="/report" className="hover:text-foreground">أرسل بلاغاً</Link>
            <Link href="/sign-in" className="hover:text-foreground">دخول المشرفين</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
