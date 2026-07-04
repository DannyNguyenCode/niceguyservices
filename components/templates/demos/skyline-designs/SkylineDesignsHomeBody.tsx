"use client";

import Link from "next/link";
import { SD_APPROACH_PILLARS, SD_EXPERIENCE_STATS, SD_HOME_PROJECTS } from "./skylineDesignsData";
import { SD_PATHS } from "./skylineDesignsConfig";
import { SD_IMG } from "./skylineDesignsImages";
import { SdContainer, SdIcon, SdImg } from "./SkylineDesignsShared";
import { useSdNavScroll, useSdReveal } from "./useSdEffects";

export function SkylineDesignsHomeBody() {
  useSdReveal();
  useSdNavScroll();

  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="sd-cloud-float absolute top-[10%] left-[-5%] h-[40vw] w-[40vw] rounded-full bg-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)] blur-[100px]" />
        <div
          className="sd-cloud-float absolute right-[-5%] bottom-[10%] h-[50vw] w-[50vw] rounded-full bg-[color-mix(in_srgb,var(--sd-surface-variant)_30%,transparent)] blur-[120px]"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="sd-cloud-float absolute top-[40%] right-[10%] h-[30vw] w-[30vw] rounded-full bg-[color-mix(in_srgb,var(--sd-secondary-container)_20%,transparent)] blur-[80px]"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-[var(--sd-container-padding)] pt-24">
        <SdContainer className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="sd-reveal z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)] bg-[color-mix(in_srgb,var(--sd-primary-container)_30%,transparent)] px-4 py-1.5 text-[var(--sd-on-primary-container)]">
              <SdIcon name="location_on" size={18} />
              <span className="sd-label-md">Based in Toronto, Ontario</span>
            </div>
            <h1 className="sd-display-xl text-[var(--sd-on-surface)]">
              Designing clean, responsive websites that help businesses{" "}
              <span className="text-[var(--sd-primary)] italic">look professional</span> and convert visitors.
            </h1>
            <p className="sd-body-lg max-w-xl text-[var(--sd-on-surface-variant)]">
              With over 3 years of agency experience in Toronto&apos;s fast-paced tech scene, I bridge the gap between
              creative vision and technical excellence.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={SD_PATHS.skills}
                className="sd-label-md flex items-center gap-2 rounded-full bg-[var(--sd-primary)] px-10 py-4 text-[var(--sd-on-primary)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--sd-primary)_30%,transparent)]"
              >
                View Skills
                <SdIcon name="arrow_forward" />
              </Link>
              <Link
                href={SD_PATHS.contact}
                className="sd-label-md rounded-full bg-[var(--sd-surface-container-highest)] px-10 py-4 text-[var(--sd-on-surface)] transition-all hover:-translate-y-0.5 hover:bg-[var(--sd-surface-variant)]"
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className="group relative z-0 hidden lg:block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)] to-transparent opacity-50 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="relative flex aspect-square w-full items-center justify-center">
              <div className="relative aspect-[4/3] w-[80%] transform overflow-hidden rounded-lg bg-white shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <SdImg
                  src={SD_IMG.home.hero}
                  alt="Toronto web designer in a bright studio with CN Tower skyline visible"
                  fill
                  className="object-cover"
                  priority
                  sizes="40vw"
                />
              </div>
              <div
                className="sd-glass-card absolute top-[10%] right-0 w-48 animate-bounce rounded-lg p-6 shadow-xl"
                style={{ animationDuration: "4s" }}
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sd-primary)_20%,transparent)]">
                    <SdIcon name="verified" className="text-[var(--sd-primary)]" size={18} />
                  </div>
                  <div className="h-2 w-20 rounded bg-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)]" />
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full rounded bg-[color-mix(in_srgb,var(--sd-on-surface-variant)_10%,transparent)]" />
                  <div className="h-1.5 w-[80%] rounded bg-[color-mix(in_srgb,var(--sd-on-surface-variant)_10%,transparent)]" />
                </div>
              </div>
              <div
                className="sd-glass-card absolute bottom-[15%] left-[-5%] w-56 animate-pulse rounded-lg p-6 shadow-xl"
                style={{ animationDuration: "5s" }}
              >
                <div className="sd-headline-md mb-1 font-bold text-[var(--sd-primary)]">3+ Yrs</div>
                <div className="sd-label-md text-[var(--sd-on-surface-variant)]">Industry Experience</div>
              </div>
            </div>
          </div>
        </SdContainer>

        <div className="absolute bottom-0 left-0 w-full translate-y-px leading-[0]">
          <svg className="h-auto w-full fill-[var(--sd-surface-container-low)]" viewBox="0 0 1440 320">
            <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--sd-surface-container-low)] py-[var(--sd-section-gap)] px-[var(--sd-container-padding)]">
        <SdContainer>
          <div className="sd-reveal mx-auto mb-20 max-w-3xl space-y-6 text-center">
            <span className="sd-label-md font-bold tracking-widest text-[var(--sd-primary)] uppercase">The Approach</span>
            <h2 className="sd-headline-lg text-[var(--sd-on-surface)]">Where strategy meets high-end digital design.</h2>
            <p className="sd-body-lg text-[var(--sd-on-surface-variant)]">
              I don&apos;t just build websites; I create digital ecosystems. By blending aesthetic excellence with
              technical performance and user-centric strategy, I help Toronto brands stand out in the sky.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {SD_APPROACH_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="sd-reveal group rounded-lg border border-transparent bg-white p-10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)] hover:shadow-2xl"
              >
                <div
                  className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${pillar.bgClass}`}
                >
                  <SdIcon name={pillar.icon} className={`${pillar.iconClass} text-3xl`} />
                </div>
                <h3 className="sd-headline-md mb-4">{pillar.title}</h3>
                <p className="sd-body-md text-[var(--sd-on-surface-variant)]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </SdContainer>
        <div className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--sd-primary-fixed)_30%,transparent)] blur-[100px]" />
      </section>

      <section className="py-[var(--sd-section-gap)] px-[var(--sd-container-padding)]">
        <SdContainer className="flex flex-col items-start gap-16 lg:flex-row">
          <div className="sd-reveal lg:sticky lg:top-32 lg:w-1/3">
            <h2 className="sd-headline-lg mb-6">3 Years of Local Impact</h2>
            <p className="sd-body-lg mb-8 text-[var(--sd-on-surface-variant)]">
              My time in Toronto&apos;s top digital agencies has honed my ability to deliver high-quality products on
              tight schedules for global brands.
            </p>
            <div className="space-y-4">
              {SD_EXPERIENCE_STATS.map((stat) => (
                <div key={stat} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sd-primary)] text-[var(--sd-on-primary)]">
                    <SdIcon name="check" size={18} />
                  </div>
                  <span className="sd-label-md">{stat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
            {SD_HOME_PROJECTS.map((project, index) => (
              <div
                key={project.title}
                className={`sd-reveal group relative h-[500px] overflow-hidden rounded-lg bg-white shadow-xl ${index === 1 ? "md:mt-12" : ""}`}
              >
                <SdImg
                  src={SD_IMG.home[project.imageKey]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[color-mix(in_srgb,var(--sd-on-surface)_80%,transparent)] via-transparent to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                  <h4 className="sd-headline-md text-white">{project.title}</h4>
                  <p className="sd-body-md mb-4 text-white/80">{project.subtitle}</p>
                  <span className="sd-label-md inline-flex items-center gap-2 text-[var(--sd-primary-fixed)]">
                    View Case Study <SdIcon name="north_east" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SdContainer>
      </section>

      <section className="py-[var(--sd-section-gap)] px-[var(--sd-container-padding)]">
        <SdContainer>
          <div className="sd-reveal relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-[var(--sd-primary)] p-16 text-center text-[var(--sd-on-primary)] shadow-2xl">
            <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-white/10 blur-[120px]" />
            <h2 className="sd-headline-lg relative z-10 mb-6">Ready to take your business to the next level?</h2>
            <p className="sd-body-lg relative z-10 mx-auto mb-10 max-w-2xl text-white/90">
              Let&apos;s collaborate to build something exceptional. Whether you&apos;re starting from scratch or
              looking for a redesign, I&apos;m here to help.
            </p>
            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={SD_PATHS.contact}
                className="sd-label-md rounded-full bg-white px-10 py-4 text-[var(--sd-primary)] shadow-xl transition-all hover:scale-105"
              >
                Schedule a Free Call
              </Link>
              <Link
                href={SD_PATHS.skills}
                className="sd-label-md rounded-full bg-[var(--sd-primary-container)] px-10 py-4 text-[var(--sd-on-primary-container)] transition-all hover:bg-white hover:text-[var(--sd-primary)]"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </SdContainer>
      </section>
    </main>
  );
}
