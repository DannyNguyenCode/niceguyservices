import Link from "next/link";
import { viJsonServicePath } from "./valleyInterlockingConfig";
import { VI_ABOUT_CTA_BANNER, type ViAboutCtaBannerContent } from "./valleyInterlockingAboutContent";
import { ViContainer, ViIcon } from "./ValleyInterlockingShared";

type ViAboutCtaBannerProps = {
  content?: ViAboutCtaBannerContent;
  revealClass?: string;
};

export function ViAboutCtaBanner({ content = VI_ABOUT_CTA_BANNER, revealClass = "vi-about-reveal" }: ViAboutCtaBannerProps) {
  return (
    <section className="vi-about-cta-banner py-[var(--vi-stack-lg)]">
      <ViContainer className={`${revealClass} max-w-3xl`}>
        {content.eyebrow ? (
          <div className="mb-6">
            <p className="vi-about-cta-eyebrow vi-label-sm uppercase tracking-[0.2em]">{content.eyebrow}</p>
            <div className="vi-about-cta-rule mt-3" aria-hidden />
          </div>
        ) : null}
        <h2 className="vi-about-cta-headline vi-headline-lg mb-6">{content.headline}</h2>
        <p className="vi-about-cta-description vi-body-md mb-10 max-w-2xl">{content.description}</p>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={viJsonServicePath(content.cta.url)}
            className="vi-about-cta-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-8 py-4 vi-label-md uppercase tracking-wide transition-opacity hover:opacity-90"
          >
            {content.cta.label}
            <ViIcon name="arrow_forward" className="text-lg" />
          </Link>
          {content.secondaryCta ? (
            <Link
              href={viJsonServicePath(content.secondaryCta.url)}
              className="vi-about-cta-button vi-about-cta-button--secondary inline-flex min-h-11 items-center justify-center rounded-lg px-8 py-4 vi-label-md uppercase tracking-wide transition-colors"
            >
              {content.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </ViContainer>
    </section>
  );
}
