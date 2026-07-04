type CompanionPetOrderLoadingStateProps = {
  title: string;
  message: string;
  overlay?: boolean;
};

export function CompanionPetOrderLoadingState({
  title,
  message,
  overlay = false,
}: CompanionPetOrderLoadingStateProps) {
  const content = (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cp-warm-gray)]">
        <span
          className="material-symbols-outlined animate-spin text-3xl text-[var(--cp-blue)]"
          aria-hidden
        >
          progress_activity
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-[var(--cp-charcoal)] md:text-3xl">{title}</h1>
      <p className="mt-3 text-sm text-[var(--cp-slate)]">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--cp-white)]/90 px-4 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {content}
      </div>
    );
  }

  return (
    <main
      className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-20 md:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {content}
    </main>
  );
}
