export function LooneyToonsOrderLoadingState() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-[#f9f9ff] px-4 py-20 text-[#151c28]">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#151c28] bg-[#e9edff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span
            className="material-symbols-outlined animate-pulse text-3xl text-[#495E84]"
            aria-hidden
          >
            hourglass_top
          </span>
        </div>
        <h1 className="font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl md:text-3xl">
          Your order is loading
        </h1>
        <p className="mt-3 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
          Hang tight while we confirm your kinetic brews at Inkwell Pier.
        </p>
      </div>
    </main>
  );
}
