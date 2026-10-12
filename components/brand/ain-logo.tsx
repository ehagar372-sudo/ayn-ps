'use client'

export function AinLogo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} dir="rtl">
      <svg aria-hidden="true" viewBox="0 0 48 48" className={compact ? 'size-10' : 'size-12'} fill="none">
        <rect x="1" y="1" width="46" height="46" rx="14" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeOpacity=".55" />
        <path d="M8 25c4.8-8.8 11.2-13.2 19.2-13.2 5.6 0 9.8 2.2 12.8 6.5-3 7.4-8.8 12-16.8 13.7C17.6 33.7 12.5 31.4 8 25Z" stroke="currentColor" strokeWidth="2.1" />
        <circle cx="24.8" cy="24.5" r="5.2" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="2" />
        <circle cx="24.8" cy="24.5" r="2" fill="currentColor" />
        <path d="M15 38h20M18 34l-3 4m15-4 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M21 38v-3m6 3v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight">عين</span>
        {!compact && <span className="mt-1 text-[10px] font-medium text-muted-foreground">نظام مراقبة الطرق بالذكاء الاصطناعي</span>}
      </span>
    </div>
  )
}

export function AinMark({ className = '' }: { className?: string }) {
  return <AinLogo compact className={className} />
}
