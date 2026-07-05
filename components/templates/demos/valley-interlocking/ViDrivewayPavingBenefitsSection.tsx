import Link from "next/link";
import type { VI_DRIVEWAY_SERVICE } from "./valleyInterlockingDrivewayContent";
import { viJsonServicePath } from "./valleyInterlockingConfig";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";

type DrivewayBenefitsSection = Extract<
  (typeof VI_DRIVEWAY_SERVICE)["sections"][number],
  { heading: "Driveway Paving Benefits" }
>;

type ViDrivewayPavingBenefitsSectionProps = {
  benefits: DrivewayBenefitsSection;
  revealClass?: string;
};

export function ViDrivewayPavingBenefitsSection({
  benefits,
  revealClass = "vi-driveway-reveal",
}: ViDrivewayPavingBenefitsSectionProps) {
  return (
    <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
      <ViContainer>
        <div className={`${revealClass} grid grid-cols-1 items-center gap-[var(--vi-gutter)] lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <span className="vi-label-md mb-4 block uppercase tracking-widest text-[var(--vi-secondary)]">
              {benefits.eyebrow}
            </span>
            <h2 className="vi-display-lg mb-[var(--vi-stack-sm)] text-[var(--vi-primary)]">{benefits.heading}</h2>
            <div className="vi-body-lg max-w-2xl space-y-6 text-[var(--vi-on-surface-variant)]">
              {benefits.content.map((paragraph: any) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)]">
              <ViImg
                src={benefits.image}
                alt={benefits.imageAlt}
                width={640}
                height={800}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--vi-secondary-container)_20%,transparent)] blur-3xl"
              aria-hidden
            />
          </div>
        </div>

        <div
          className={`${revealClass} my-[var(--vi-stack-lg)] h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] to-transparent`}
          aria-hidden
        />

        <div className={`${revealClass} grid grid-cols-1 gap-x-[var(--vi-gutter)] gap-y-[var(--vi-stack-md)] md:grid-cols-2 lg:grid-cols-3`}>
          {benefits.items.map((item: any) => (
            <article
              key={item.title}
              className="group border border-transparent p-[var(--vi-base)] transition-all duration-300 hover:border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)]"
            >
              <div className="flex items-start gap-4">
                <div className="text-[var(--vi-primary)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-[var(--vi-secondary)]">
                  <ViIcon name={item.icon} className="text-[32px]" />
                </div>
                <div>
                  <h3 className="vi-headline-sm mb-2 text-[var(--vi-primary)]">{item.title}</h3>
                  <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_10%,transparent)] bg-[var(--vi-surface-container-low)] p-[var(--vi-gutter)] text-center">
            <h4 className="vi-headline-sm mb-4 text-[var(--vi-primary)]">{benefits.ctaCard.title}</h4>
            <Link
              href={viJsonServicePath(benefits.ctaCard.url)}
              className="vi-label-md inline-flex items-center gap-2 rounded-lg bg-[var(--vi-primary)] px-8 py-4 uppercase tracking-widest text-[var(--vi-on-primary)] transition-all hover:bg-[var(--vi-primary-container)]"
            >
              {benefits.ctaCard.label}
              <ViIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </div>
      </ViContainer>
    </section>
  );
}
