"use client";

import { SD_AGENCY_HIGHLIGHTS, SD_PROJECT_JOURNEY } from "./skylineDesignsData";
import { SD_IMG } from "./skylineDesignsImages";
import { SdContainer, SdIcon, SdImg } from "./SkylineDesignsShared";
import { useSdNavScroll, useSdReveal } from "./useSdEffects";

export function SkylineDesignsExperienceBody() {
  useSdReveal();
  useSdNavScroll();

  return (
    <main className="relative z-20">
      <header className="relative flex min-h-[716px] flex-col items-center justify-center overflow-hidden px-[var(--sd-container-padding)] pt-32 text-center">
        <div className="relative z-10 max-w-4xl">
          <span className="sd-label-md mb-4 block tracking-widest text-[var(--sd-primary)] uppercase">
            Professional Journey
          </span>
          <h1 className="sd-display-xl mb-6 text-[var(--sd-on-surface)]">
            3 Years at <span className="text-[var(--sd-primary)]">Toronto&apos;s Leading</span> Digital Agency
          </h1>
          <p className="sd-body-lg mx-auto max-w-2xl text-[var(--sd-on-surface-variant)]">
            Crafting responsive ecosystems, managing complex CMS architectures, and bridging the gap between client
            vision and technical excellence in the heart of Toronto&apos;s tech scene.
          </p>
        </div>
        <div className="absolute -bottom-10 left-1/2 z-20 h-40 w-full -translate-x-1/2 bg-gradient-to-t from-[var(--sd-background)] to-transparent" />
      </header>

      <SdContainer className="space-y-[var(--sd-section-gap)] pb-40">
        <section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="sd-reveal">
            <h2 className="sd-headline-lg mb-6">The Agency Standard</h2>
            <p className="sd-body-md mb-8 text-[var(--sd-on-surface-variant)]">
              Working within a fast-paced Toronto agency environment, I acted as the primary technical liaison for
              high-end boutique brands and enterprise clients. My role evolved from front-end development to leading
              full-lifecycle project delivery.
            </p>
            <div className="space-y-4">
              {SD_AGENCY_HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-lg border border-[var(--sd-surface-dim)] bg-[var(--sd-surface-container-low)] p-4"
                >
                  <SdIcon name={item.icon} className="text-[var(--sd-primary)]" fill />
                  <div>
                    <h4 className="font-bold text-[var(--sd-on-surface)]">{item.title}</h4>
                    <p className="sd-body-md text-[var(--sd-on-surface-variant)]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sd-reveal relative">
            <div className="sd-animate-float overflow-hidden rounded-lg shadow-2xl">
              <SdImg
                src={SD_IMG.experience.office}
                alt="Bright Toronto agency office with CN Tower visible through floor-to-ceiling windows"
                width={800}
                height={500}
                className="h-[500px] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="sd-glass-card absolute -right-8 -bottom-8 max-w-xs rounded-lg p-8 shadow-xl">
              <div className="sd-headline-lg leading-none text-[var(--sd-primary)]">3+</div>
              <div className="sd-label-md mt-2 text-[var(--sd-on-surface)]">YEARS OF AGENCY EXCELLENCE</div>
            </div>
          </div>
        </section>

        <section>
          <div className="sd-reveal mb-16 text-center">
            <h2 className="sd-headline-lg">Project Journey</h2>
            <p className="sd-body-md text-[var(--sd-on-surface-variant)]">
              The milestones that defined my technical growth.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SD_PROJECT_JOURNEY.map((project) => (
              <div
                key={project.title}
                className="sd-glass-card sd-reveal flex h-full flex-col rounded-lg border border-[color-mix(in_srgb,var(--sd-surface-dim)_50%,transparent)] p-10 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sd-primary-container)_20%,transparent)]">
                  <SdIcon name={project.icon} className="text-3xl text-[var(--sd-primary)]" />
                </div>
                <h3 className="sd-headline-md mb-4 text-[var(--sd-on-surface)]">{project.title}</h3>
                <p className="sd-body-md mb-6 grow text-[var(--sd-on-surface-variant)]">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="sd-label-md rounded-full bg-[var(--sd-secondary-container)] px-3 py-1 text-[var(--sd-on-secondary-container)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative">
          <div className="absolute top-0 -left-40 h-80 w-80 rounded-full bg-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)] blur-3xl" />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="sd-reveal space-y-8 lg:col-span-7">
              <h2 className="sd-headline-lg">Building the &quot;Skyline&quot;</h2>
              <p className="sd-body-lg text-[var(--sd-on-surface-variant)]">
                My tenure in Toronto was defined by a commitment to air-tight code and airy, breathable design. I
                specialized in bridging the gap between heavy data requirements and lightweight user interfaces.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-lg shadow-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)]">
                  <span className="sd-headline-md font-bold text-[var(--sd-primary)]">40+</span>
                  <p className="sd-label-md text-[var(--sd-on-surface-variant)]">Custom Themes Built</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-lg shadow-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)]">
                  <span className="sd-headline-md font-bold text-[var(--sd-primary)]">99.9%</span>
                  <p className="sd-label-md text-[var(--sd-on-surface-variant)]">Deployment Success Rate</p>
                </div>
              </div>
            </div>
            <div className="sd-reveal lg:col-span-5">
              <div className="rounded-lg bg-[color-mix(in_srgb,var(--sd-surface-variant)_30%,transparent)] p-1">
                <SdImg
                  src={SD_IMG.experience.keyboard}
                  alt="Developer typing on a mechanical keyboard with React code on screen"
                  width={600}
                  height={400}
                  className="h-auto w-full rounded-lg shadow-sm"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </section>
      </SdContainer>
    </main>
  );
}
