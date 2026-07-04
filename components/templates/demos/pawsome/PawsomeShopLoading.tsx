import { PsPageWrap } from "./PawsomeShared";

export function PawsomeShopLoading() {
  return (
    <main className="py-8">
      <PsPageWrap>
        <div className="mb-10 h-12 w-64 animate-pulse rounded-xl bg-[var(--ps-surface-container-high)]" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]"
            >
              <div className="aspect-[4/5] animate-pulse bg-[var(--ps-surface-container)]" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--ps-surface-container-high)]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--ps-surface-container-high)]" />
              </div>
            </div>
          ))}
        </div>
      </PsPageWrap>
    </main>
  );
}
