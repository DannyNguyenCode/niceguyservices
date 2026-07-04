"use client";

import Link from "next/link";
import { LoContainer, LoFooter, LoIcon, LoImg, LoNav } from "./LiquidOccasionsShared";
import { LO_PATHS } from "./liquidOccasionsConfig";
import { LO_IMAGES } from "./liquidOccasionsImages";
import { useLoReveal } from "./useLoReveal";

export function LiquidOccasionsHomeBody() {
  useLoReveal(".lo-reveal-group");

  return (
    <>
      <LoNav />
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-0 w-full leading-none">
            <svg className="h-auto w-full" fill="none" viewBox="0 0 1440 320" aria-hidden>
              <path
                d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,186.7C672,160,768,128,864,128C960,128,1056,160,1152,186.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                fill="var(--lo-surface)"
              />
            </svg>
          </div>
        </div>

        <LoContainer className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="max-w-2xl space-y-8 text-center lg:text-left">
            <h1 className="lo-display text-[var(--lo-on-surface)]">
              Your Event Starts With A <span className="text-[var(--lo-primary)] italic">Dream</span>
            </h1>
            <p className="lo-body-lg leading-relaxed text-[var(--lo-on-surface-variant)]">
              We sculpt atmospheric experiences that linger in the memory. From ethereal weddings to
              high-octane corporate galas, we curate every heartbeat of your celebration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 lg:justify-start">
              <Link
                href={LO_PATHS.journey}
                className="lo-label scale-105 rounded-full bg-[var(--lo-primary)] px-8 py-4 text-[var(--lo-on-primary)] shadow-xl shadow-[color-mix(in_srgb,var(--lo-primary)_20%,transparent)] transition-all hover:scale-110 active:scale-95"
              >
                Start Your Journey
              </Link>
              <Link
                href={LO_PATHS.journey}
                className="lo-label rounded-full border border-[color-mix(in_srgb,var(--lo-primary)_20%,transparent)] bg-[var(--lo-surface-container-lowest)] px-8 py-4 text-[var(--lo-primary)] transition-all duration-300 hover:bg-[var(--lo-primary)] hover:text-[var(--lo-on-primary)]"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex h-[600px] w-full max-w-xl items-center justify-center">
            {[
              { src: LO_IMAGES.home.heroWedding, className: "top-[10%] left-[5%] z-20 w-64 h-64", delay: "" },
              { src: LO_IMAGES.home.heroCorporate, className: "bottom-[5%] right-[5%] z-10 w-80 h-80 lo-circular-float", delay: "[animation-delay:-2s]" },
              { src: LO_IMAGES.home.heroPrivate, className: "top-[40%] right-[10%] z-30 w-56 h-56 lo-circular-float", delay: "[animation-delay:-4s]" },
            ].map((item) => (
              <div
                key={item.src}
                className={`absolute overflow-hidden rounded-full border-4 border-[var(--lo-surface)] shadow-2xl ${item.className} ${item.delay}`}
              >
                <LoImg src={item.src} alt="" className="h-full w-full" width={320} height={320} priority />
              </div>
            ))}
          </div>
        </LoContainer>
      </header>

      <section className="relative overflow-hidden bg-[var(--lo-surface)] py-[var(--lo-section-gap)]">
        <LoContainer>
          <div className="mx-auto mb-24 max-w-3xl text-center">
            <h2 className="lo-headline-lg mb-6 text-[var(--lo-on-surface)]">The Liquid Path</h2>
            <p className="lo-body-md text-[var(--lo-on-surface-variant)]">
              A fluid transition from your initial vision to an unforgettable reality. Follow the path
              of the extraordinary.
            </p>
          </div>

          <div className="relative flex min-h-[800px] items-center justify-center py-20">
            <svg
              className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 1000 800"
              aria-hidden
            >
              <path
                className="lo-path-draw"
                d="M500,0 C500,200 800,200 800,400 C800,600 200,600 200,800"
                fill="none"
                stroke="#fdd815"
                strokeWidth="4"
              />
            </svg>

            <div className="relative z-10 flex h-full w-full flex-col gap-32">
              {[
                { icon: "cloud", title: "Dream", desc: "Uncovering the emotional core of your vision.", align: "justify-center", size: "w-32 h-32", textPos: "left-full ml-8 top-0" },
                { icon: "edit_note", title: "Design", desc: "Drafting the blueprints of atmosphere and flow.", align: "justify-end pr-[15%]", size: "w-40 h-40", textPos: "bottom-full mb-4 left-1/2 -translate-x-1/2 text-center" },
                { icon: "calendar_month", title: "Coordinate", desc: "Aligning every detail with surgical precision.", align: "justify-center", size: "w-36 h-36", textPos: "top-full mt-4 left-1/2 -translate-x-1/2 text-center" },
                { icon: "celebration", title: "Experience", desc: "The magic unfolds as we manage the currents.", align: "justify-start pl-[15%]", size: "w-44 h-44", textPos: "left-full ml-8 top-1/2 -translate-y-1/2" },
              ].map((m) => (
                <div key={m.title} className={`lo-reveal-group flex items-center ${m.align} group`}>
                  <div className="relative">
                    <div
                      className={`${m.size} z-10 flex items-center justify-center rounded-full border-2 border-[var(--lo-secondary-container)] bg-[var(--lo-surface-container-lowest)] shadow-xl transition-transform duration-500 group-hover:scale-110`}
                    >
                      <LoIcon name={m.icon} className="text-4xl text-[var(--lo-primary)] md:text-5xl" />
                    </div>
                    <div className={`absolute w-48 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${m.textPos}`}>
                      <h4 className="lo-headline-md text-xl text-[var(--lo-on-surface)]">{m.title}</h4>
                      <p className="text-sm text-[var(--lo-on-surface-variant)]">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="lo-reveal-group flex items-center justify-center group">
                <div className="relative">
                  <div className="z-10 flex h-48 w-48 items-center justify-center rounded-full bg-[var(--lo-secondary-container)] shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <LoIcon name="flare" className="text-6xl text-[var(--lo-on-secondary-container)]" />
                  </div>
                  <div className="absolute bottom-full left-1/2 mb-8 w-64 -translate-x-1/2 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h4 className="lo-headline-md text-2xl text-[var(--lo-on-surface)]">Celebrate</h4>
                    <p className="text-sm text-[var(--lo-on-surface-variant)]">
                      A legacy of moments that define a lifetime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LoContainer>
      </section>

      <section className="overflow-hidden bg-[var(--lo-surface-container-lowest)] py-[var(--lo-section-gap)]">
        <LoContainer>
          <div className="grid gap-16 md:grid-cols-3">
            {[
              { img: LO_IMAGES.home.weddings, title: "Weddings", desc: "Bespoke romances designed with soul and timeless elegance.", offset: "" },
              { img: LO_IMAGES.home.corporate, title: "Corporate", desc: "Strategic environments that amplify brand narratives and connection.", offset: "md:mt-24" },
              { img: LO_IMAGES.home.private, title: "Private", desc: "Intimate milestones celebrated with unparalleled artistry.", offset: "" },
            ].map((item) => (
              <div key={item.title} className={`lo-reveal-group group relative flex flex-col items-center ${item.offset}`}>
                <div className="relative mb-8 aspect-square w-full overflow-hidden rounded-full border-8 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
                  <LoImg src={item.img} alt="" fill className="h-full w-full" />
                </div>
                <h3 className="lo-headline-md mb-2 text-[var(--lo-on-surface)]">{item.title}</h3>
                <p className="lo-body-md px-4 text-center text-[var(--lo-on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </LoContainer>
      </section>

      <section className="relative flex flex-col items-center justify-center overflow-hidden py-[var(--lo-section-gap)]">
        <div className="relative z-10 px-[var(--lo-gutter)] text-center">
          <div className="lo-circular-float mx-auto flex h-[500px] w-[500px] flex-col items-center justify-center rounded-full bg-[var(--lo-secondary-container)] p-12 shadow-2xl md:h-[700px] md:w-[700px]">
            <h2 className="lo-display mb-8 max-w-lg leading-tight text-[var(--lo-on-secondary-container)]">
              Let&apos;s Create Your Next Memory
            </h2>
            <Link
              href={LO_PATHS.journey}
              className="lo-label scale-110 rounded-full bg-[var(--lo-primary)] px-12 py-5 text-[var(--lo-on-primary)] shadow-2xl transition-transform hover:scale-125"
            >
              Begin the Journey
            </Link>
          </div>
        </div>
      </section>

      <LoFooter />
    </>
  );
}
