export default function Loading() {
  return (
    <main className="mx-auto flex max-w-[1800px] gap-4 p-3 md:p-4" aria-busy="true" aria-label="جارٍ تحميل لوحة غرفة العمليات">
      <div className="glass hidden h-[calc(100vh-1.5rem)] w-64 shrink-0 animate-pulse rounded-2xl lg:block" />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="glass h-16 animate-pulse rounded-2xl" />
        <div className="glass h-20 animate-pulse rounded-2xl" />
        <div className="grid gap-4 xl:grid-cols-[65fr_35fr]">
          <div className="glass h-[34rem] animate-pulse rounded-2xl" />
          <div className="glass h-[34rem] animate-pulse rounded-2xl" />
        </div>
      </div>
    </main>
  )
}
