import { PsIcon } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

type PawsomeOrderLoadingStateProps = {
  title: string;
  message: string;
  overlay?: boolean;
};

export function PawsomeOrderLoadingState({
  title,
  message,
  overlay = false,
}: PawsomeOrderLoadingStateProps) {
  const content = (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ps-surface-container-high)]">
        <PsIcon name="progress_activity" className="animate-spin text-3xl text-[var(--ps-primary)]" />
      </div>
      <h1 className="text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
        {title}
      </h1>
      <p className="mt-3 text-sm text-[var(--ps-on-surface-variant)]">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ps-surface)]/90 px-4 backdrop-blur-sm"
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
      className="flex min-h-[50vh] items-center justify-center px-4 py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {content}
    </main>
  );
}
