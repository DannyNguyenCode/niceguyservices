"use client";

type CheckoutProgressProps = {
  step: 1 | 2 | 3;
};

const STEPS = ["Shipping", "Payment", "Review"] as const;

export function CheckoutProgress({ step }: CheckoutProgressProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((label, i) => {
          const num = (i + 1) as 1 | 2 | 3;
          const done = step > num;
          const active = step === num;
          return (
            <li key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? "bg-[var(--cp-green)] text-white"
                      : active
                        ? "bg-[var(--cp-charcoal)] text-white"
                        : "bg-[var(--cp-warm-gray)] text-[var(--cp-slate)]"
                  }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-base" aria-hidden>
                      check
                    </span>
                  ) : (
                    num
                  )}
                </span>
                <span
                  className={`text-[10px] font-medium sm:text-xs ${
                    active ? "text-[var(--cp-charcoal)]" : "text-[var(--cp-slate)]"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 ? (
                <div
                  className={`mx-2 h-0.5 flex-1 ${done ? "bg-[var(--cp-green)]" : "bg-[var(--cp-warm-gray)]"}`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
