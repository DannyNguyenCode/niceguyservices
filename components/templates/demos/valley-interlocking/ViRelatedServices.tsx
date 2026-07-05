import Link from "next/link";
import type { ViRelatedService } from "./valleyInterlockingRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";

type ViRelatedServicesProps = {
  items: readonly ViRelatedService[];
  heading?: string;
  intro?: string;
  revealClass?: string;
};

export function ViRelatedServices({
  items,
  heading = "Related Services",
  intro = "Projects that pair naturally with this service — explore complementary hardscaping and outdoor solutions.",
  revealClass = "vi-reveal",
}: ViRelatedServicesProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
      <ViContainer>
        <div className={`${revealClass} mb-10 max-w-2xl`}>
          <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{heading}</h2>
          <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{intro}</p>
        </div>
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-3 ${revealClass}`}>
          {items.map((service: any) => (
            <Link
              key={service.href}
              href={service.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] vi-ambient-shadow transition-all hover:border-[var(--vi-primary)]"
            >
              <div className="relative h-48 overflow-hidden">
                <ViImg
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-grow flex-col p-6">
                <p className="vi-caption mb-1 uppercase tracking-wider text-[var(--vi-primary)]">{service.subtitle}</p>
                <h3 className="vi-headline-md mb-3 text-[var(--vi-on-surface)] transition-colors group-hover:text-[var(--vi-primary)]">
                  {service.title}
                </h3>
                <p className="vi-body-md mb-6 flex-grow text-sm text-[var(--vi-on-surface-variant)]">
                  {service.description}
                </p>
                <span className="vi-label-md inline-flex items-center gap-2 text-[var(--vi-primary)]">
                  View Service
                  <ViIcon name="arrow_forward" className="text-sm transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </ViContainer>
    </section>
  );
}
