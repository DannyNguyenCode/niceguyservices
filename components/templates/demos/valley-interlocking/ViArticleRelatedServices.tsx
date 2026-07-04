import Link from "next/link";

export type ViArticleRelatedService = {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
};

type ViArticleRelatedServicesProps = {
  services: readonly ViArticleRelatedService[];
  className?: string;
};

export function ViArticleRelatedServices({ services, className }: ViArticleRelatedServicesProps) {
  if (services.length === 0) return null;

  return (
    <div className={className}>
      <p className="vi-label-md mb-6 uppercase tracking-widest text-[var(--vi-on-surface)]">Related Services</p>
      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.href} className="group">
            <Link href={service.href} className="block">
              <p className="vi-body-md text-[var(--vi-on-surface)] transition-colors group-hover:text-[var(--vi-secondary)]">
                {service.title}
              </p>
              <p className="vi-caption mb-2 text-[var(--vi-on-surface-variant)]">{service.description}</p>
              <span className="vi-caption uppercase tracking-widest text-[var(--vi-secondary)] group-hover:underline">
                Learn More
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
