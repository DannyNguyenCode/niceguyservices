"use client";

import Link from "next/link";
import { ViFaqAccordion, ViServiceHero } from "./valleyInterlockingServiceSections";
import { VI_LANDSCAPING_FAQ_PAGE } from "./valleyInterlockingLandscapingFaqContent";
import { VI_LANDSCAPING_OPTIONS_CTA, VI_LANDSCAPING_SECOND_CTA, VI_LANDSCAPING_SERVICE } from "./valleyInterlockingLandscapingContent";
import { VI_LANDSCAPE_PLANNING } from "./valleyInterlockingLandscapePlanningContent";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { VI_LANDSCAPING_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

export function ValleyInterlockingLandscapingBody() {
  const [intro, ourWork, , ideas, paths, overlooked, faq] = VI_LANDSCAPING_SERVICE.sections;
  const planningGuide = VI_LANDSCAPE_PLANNING;

  useViReveal(".vi-landscaping-reveal");



  return (

    <main className="overflow-hidden pt-[var(--vi-nav-height)]">

      <ViServiceHero

        imageSrc={VI_IMG.landscaping.hero}

        imageAlt="Professional landscaping services"

        heading={intro.heading}

        description={intro.content[0]}

        additionalDescriptions={intro.content.slice(1)}

        ctas={ourWork.ctas}

        revealClass="vi-landscaping-reveal"

      />



      <section className="py-[var(--vi-stack-lg)]">

        <ViContainer>

          <div className="vi-landscaping-reveal flex flex-col items-center gap-12 md:flex-row">

            <div className="flex-1 space-y-6">

              <h2 className="vi-headline-lg text-[var(--vi-primary)]">{ourWork.heading}</h2>

              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{ourWork.content[0]}</p>

              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{ourWork.content[1]}</p>

              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{ourWork.content[2]}</p>

            </div>

            <div className="h-[400px] w-full flex-1 overflow-hidden rounded-xl shadow-2xl">

              <ViImg

                src={VI_IMG.landscaping.showcase}

                alt="Professional landscape work showcase"

                width={800}

                height={400}

                className="h-full w-full object-cover"

                sizes="(max-width: 768px) 100vw, 50vw"

              />

            </div>

          </div>

        </ViContainer>

      </section>



      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-landscaping-reveal">
            <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{ideas.heading}</h2>
            <figure className="mx-auto mb-8 max-w-sm rounded-xl bg-[var(--vi-surface-container)] p-6 vi-ambient-shadow lg:float-right lg:mb-4 lg:ml-10 lg:mt-1 lg:w-72 lg:max-w-none">
              <ViImg
                src={VI_IMG.landscaping.plan}
                alt="Landscaping design plan"
                width={400}
                height={300}
                className="w-full rounded-lg"
                sizes="(max-width: 1024px) 80vw, 18rem"
              />
            </figure>
            <div className="space-y-4 text-[var(--vi-on-surface-variant)]">
              {ideas.content.map((paragraph: any) => (
                <p key={paragraph} className="vi-body-md leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </ViContainer>
      </section>



      <ViAboutCtaBanner content={VI_LANDSCAPING_OPTIONS_CTA} revealClass="vi-landscaping-reveal" />



      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">

        <ViContainer>

          <h2 className="vi-landscaping-reveal vi-headline-lg mb-10 text-[var(--vi-primary)]">{paths.heading}</h2>

          <div className="vi-landscaping-reveal grid grid-cols-1 items-center gap-12 md:grid-cols-2">

            <div className="space-y-6">

              <div className="space-y-4 text-[var(--vi-on-surface-variant)]">

                {paths.content.map((paragraph: any) => (

                  <p key={paragraph} className="vi-body-md leading-relaxed">

                    {paragraph}

                  </p>

                ))}

              </div>

            </div>

            <div className="overflow-hidden rounded-xl border-8 border-white vi-ambient-shadow">

              <div className="relative aspect-video">

                <ViImg

                  src={VI_IMG.landscaping.pathway}

                  alt={paths.imageDescription}

                  fill

                  className="object-cover"

                  sizes="(max-width: 768px) 100vw, 50vw"

                />

              </div>

            </div>

          </div>

        </ViContainer>

      </section>



      <section className="py-[var(--vi-stack-lg)]">

        <ViContainer>

          <h2 className="vi-landscaping-reveal vi-headline-lg mb-10 text-center text-[var(--vi-primary)]">

            {overlooked.heading}

          </h2>

          <div className="vi-landscaping-reveal grid grid-cols-1 gap-8 md:grid-cols-2">

            {overlooked.items.map((item: any, index: any) => (

              <article

                key={item.title}

                className={`rounded-xl bg-[var(--vi-surface-container-high)] p-8 vi-ambient-shadow border-t-4 ${

                  index === 0 ? "border-[var(--vi-secondary)]" : "border-[var(--vi-tertiary)]"

                }`}

              >

                <h3 className="vi-headline-md mb-6 flex items-center gap-2 text-[var(--vi-primary)]">

                  <ViIcon name={index === 0 ? "compost" : "vertical_shades"} />

                  {item.title}

                </h3>

                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content[0]}</p>

                {"options" in item && item.options ? (

                  <div className="mt-6 grid grid-cols-2 gap-3">

                    {item.options.map((option: any) => (

                      <div key={option} className="vi-label-md flex items-center gap-2 text-[var(--vi-secondary)]">

                        <ViIcon name="circle" className="text-sm" />

                        {option}

                      </div>

                    ))}

                  </div>

                ) : null}

              </article>

            ))}

          </div>

        </ViContainer>

      </section>



      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-landscaping-reveal grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{faq.heading}</h2>
              <p className="vi-body-md mb-4 text-[var(--vi-on-surface-variant)]">{faq.content[0]}</p>
              <p className="vi-body-md mb-8 text-[var(--vi-on-surface-variant)]">{planningGuide.serviceSummary}</p>
              <ol className="mb-8 space-y-3">
                {planningGuide.serviceStepTitles.map((title: any, index: any) => (
                  <li key={title} className="flex items-center gap-4">
                    <span className="vi-step-number vi-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--vi-primary)] text-[var(--vi-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vi-body-md text-[var(--vi-on-surface)]">{title}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={planningGuide.path}
                className="vi-label-md inline-flex items-center gap-3 bg-[var(--vi-primary)] px-8 py-4 text-[var(--vi-on-primary)] transition-all hover:bg-[var(--vi-primary-container)]"
              >
                Read the Full Planning Guide
                <ViIcon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="relative h-[min(480px,60dvh)] overflow-hidden rounded-xl vi-ambient-shadow">
              <ViImg
                src={planningGuide.galleryImage}
                alt={planningGuide.galleryImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>



      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-landscaping-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_LANDSCAPING_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_LANDSCAPING_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_LANDSCAPING_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices items={VI_LANDSCAPING_RELATED_SERVICES} revealClass="vi-landscaping-reveal" />

      <ViAboutCtaBanner content={VI_LANDSCAPING_SECOND_CTA} revealClass="vi-landscaping-reveal" />

    </main>

  );

}


