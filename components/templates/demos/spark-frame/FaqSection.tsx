import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { SparkButton } from "./SparkButton";
import { LAS_HOME } from "./leaveASparkSiteContent";

export function FaqSection() {
  const { faq } = LAS_HOME;
  const midpoint = Math.ceil(faq.items.length / 2);
  const columns = [faq.items.slice(0, midpoint), faq.items.slice(midpoint)];

  return (
    <section className="bg-[var(--las-bg-secondary)] las-section-py" aria-labelledby="las-faq-heading">
      <div className="las-container">
        <LasSectionHeading
          id="las-faq-heading"
          title={faq.title}
          accent={faq.titleAccent}
          body={faq.intro}
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6">
          {columns.map((columnItems, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-3">
              {columnItems.map((item) => (
                <details
                  key={item.question}
                  className="las-faq-item group border-2 border-[var(--las-divider)] bg-[var(--las-surface-raised)]"
                >
                  <summary className="las-faq-summary flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5">
                    <h3 className="las-display text-left text-[clamp(1rem,2vw,1.125rem)] text-[var(--las-off-white)]">
                      {item.question}
                    </h3>
                    <ChevronDownIcon
                      className="h-5 w-5 shrink-0 text-[var(--las-red)] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="las-body border-t border-[var(--las-divider)] px-4 pb-4 pt-3 text-[0.9375rem] leading-relaxed text-[var(--las-muted)] sm:px-5 sm:pb-5">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <SparkButton href={faq.cta.href}>{faq.cta.label}</SparkButton>
        </div>
      </div>
    </section>
  );
}
