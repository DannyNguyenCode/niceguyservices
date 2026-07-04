export function CompanionPetShopLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-[var(--cp-warm-gray)]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="cp-card overflow-hidden rounded-2xl">
            <div className="aspect-square animate-pulse bg-[var(--cp-warm-gray)]" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-[var(--cp-warm-gray)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--cp-warm-gray)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--cp-warm-gray)]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
