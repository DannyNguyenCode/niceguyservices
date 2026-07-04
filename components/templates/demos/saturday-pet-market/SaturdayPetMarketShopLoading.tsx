import { SpmContainer, SpmIcon } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketShopLoading({ message = "Loading shelves..." }: { message?: string }) {
  return (
    <main className="flex min-h-[40vh] items-center justify-center px-[var(--spm-margin)] py-16">
      <SpmContainer className="flex flex-col items-center gap-4 text-center">
        <SpmIcon name="progress_activity" className="animate-spin text-4xl text-[var(--spm-primary)]" />
        <p className="spm-body-lg text-[var(--spm-on-surface-variant)]">{message}</p>
      </SpmContainer>
    </main>
  );
}
