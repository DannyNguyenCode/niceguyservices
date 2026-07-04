import Link from "next/link";
import {
  VI_EMAIL,
  VI_FOOTER_HOURS,
  VI_FOOTER_QUICK_LINKS,
  VI_FOOTER_SERVICE_AREAS,
  VI_OFFICES,
  VI_PATHS,
  VI_SITE,
  VI_SITE_LINE1,
  VI_SITE_LINE2,
} from "./valleyInterlockingConfig";
import { ViContainer, ViIcon } from "./ValleyInterlockingShared";

const footerHeadingClass =
  "vi-label-md uppercase tracking-wider text-[var(--vi-primary)]";

export function ViFooter() {
  const toronto = VI_OFFICES[0];
  const edmonton = VI_OFFICES[1];

  return (
    <footer className="vi-footer">
      <ViContainer className="vi-footer__container">
        <div className="vi-footer__brand-row mb-[var(--vi-stack-lg)]">
          <Link
            href={VI_PATHS.home}
            className="vi-site-brand vi-headline-md inline-block font-bold text-[var(--vi-primary)]"
            aria-label={VI_SITE}
          >
            <span className="block leading-tight">{VI_SITE_LINE1}</span>
            <span className="block leading-tight">{VI_SITE_LINE2}</span>
          </Link>
        </div>

        <div className="vi-footer__grid grid grid-cols-1 gap-[var(--vi-stack-lg)] md:grid-cols-4 md:gap-[var(--vi-stack-lg)]">
          <div className="space-y-[var(--vi-stack-md)]">
            <h4 className={footerHeadingClass}>Contact</h4>
            <div className="flex gap-[var(--vi-stack-sm)]">
              <ViIcon name="location_on" className="shrink-0 text-[var(--vi-primary)]" />
              <div className="text-sm text-[var(--vi-on-surface-variant)]">
                <p className="font-bold text-[var(--vi-on-surface)]">Toronto</p>
                <p>
                  3701 Chesswood Dr Suit 308,
                  <br />
                  North York, ON, M3J 2P6
                </p>
              </div>
            </div>
            <div className="flex gap-[var(--vi-stack-sm)]">
              <ViIcon name="call" className="shrink-0 text-[var(--vi-primary)]" />
              <div className="text-sm text-[var(--vi-on-surface-variant)]">
                <p className="font-bold text-[var(--vi-on-surface)]">Toronto:</p>
                <a href={toronto.phoneHref} className="transition-colors hover:text-[var(--vi-primary)]">
                  {toronto.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-[var(--vi-stack-sm)]">
              <ViIcon name="location_on" className="shrink-0 text-[var(--vi-primary)]" />
              <div className="text-sm text-[var(--vi-on-surface-variant)]">
                <p className="font-bold text-[var(--vi-on-surface)]">Edmonton</p>
                <p>
                  {edmonton.address[0]},
                  <br />
                  {edmonton.address[1]}
                </p>
              </div>
            </div>
            <div className="flex gap-[var(--vi-stack-sm)]">
              <ViIcon name="call" className="shrink-0 text-[var(--vi-primary)]" />
              <div className="text-sm text-[var(--vi-on-surface-variant)]">
                <p className="font-bold text-[var(--vi-on-surface)]">Edmonton:</p>
                <a href={edmonton.phoneHref} className="transition-colors hover:text-[var(--vi-primary)]">
                  {edmonton.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-[var(--vi-stack-sm)]">
              <ViIcon name="mail" className="shrink-0 text-[var(--vi-primary)]" />
              <a
                href={`mailto:${VI_EMAIL}`}
                className="text-sm text-[var(--vi-on-surface-variant)] transition-colors hover:text-[var(--vi-primary)]"
              >
                {VI_EMAIL}
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className={`${footerHeadingClass} mb-[var(--vi-stack-md)]`}>Areas Serviced</h4>
            <div className="grid grid-cols-1 gap-[var(--vi-stack-lg)] sm:grid-cols-2">
              <div>
                <p className="mb-[var(--vi-stack-sm)] font-bold text-[var(--vi-on-surface)]">
                  {VI_FOOTER_SERVICE_AREAS.toronto.title}
                </p>
                <ul className="grid grid-cols-2 gap-1 text-sm text-[var(--vi-on-surface-variant)]">
                  {VI_FOOTER_SERVICE_AREAS.toronto.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-[var(--vi-stack-sm)] font-bold text-[var(--vi-on-surface)]">
                  {VI_FOOTER_SERVICE_AREAS.edmonton.title}
                </p>
                <ul className="grid grid-cols-2 gap-1 text-sm text-[var(--vi-on-surface-variant)]">
                  {VI_FOOTER_SERVICE_AREAS.edmonton.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-[var(--vi-stack-lg)]">
            <div>
              <h4 className={`${footerHeadingClass} mb-[var(--vi-stack-md)]`}>Our Hours</h4>
              <ul className="space-y-1 text-sm text-[var(--vi-on-surface-variant)]">
                {VI_FOOTER_HOURS.map((row) => (
                  <li key={row.day} className="flex justify-between gap-4">
                    <span>{row.day}</span>
                    <span>{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={`${footerHeadingClass} mb-[var(--vi-stack-sm)]`}>Quick Links</h4>
              <div className="flex flex-wrap gap-x-[var(--vi-stack-md)] gap-y-1 text-sm text-[var(--vi-on-surface-variant)]">
                {VI_FOOTER_QUICK_LINKS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="inline-flex min-h-11 items-center py-1 transition-colors hover:text-[var(--vi-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="vi-footer__copyright">
          <p className="vi-label-sm leading-none text-[var(--vi-on-surface-variant)]">
            © Copyright 2020-{new Date().getFullYear()} {VI_SITE}. All Rights Reserved.
          </p>
        </div>
      </ViContainer>
    </footer>
  );
}
