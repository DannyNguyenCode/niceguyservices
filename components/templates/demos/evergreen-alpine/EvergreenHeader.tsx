"use client";



import Link from "next/link";

import { EvergreenEstimateButton } from "@/components/templates/demos/evergreen-alpine/EvergreenEstimate";

import { EvergreenSeasonDropdown } from "@/components/templates/demos/evergreen-alpine/EvergreenSeasonDropdown";

import { EvergreenSectionLink } from "@/components/templates/demos/evergreen-alpine/EvergreenSectionLink";

import {

  EVERGREEN_PATHS,

  isEvergreenNavItemActive,

} from "@/components/templates/demos/evergreen-alpine/evergreenConfig";

import { useEvergreenActiveNavKey } from "@/components/templates/demos/evergreen-alpine/useEvergreenActiveSection";



function navLinkClass(active: boolean) {

  return active

    ? "eg-nav-link eg-nav-link--active text-sm font-bold tracking-wide text-[#012d1d]"

    : "eg-nav-link eg-focus-ring text-sm font-semibold tracking-wide text-[#414844] transition-colors hover:text-[#012d1d]";

}



export function EvergreenHeader() {

  const navKey = useEvergreenActiveNavKey();



  return (

    <header className="template-demo-sticky-nav sticky z-50 border-b border-[#c1c8c2]/40 bg-[#fbf9f8]/90 backdrop-blur-md">

      <div className="relative flex h-20 w-full items-center justify-between px-5 md:justify-around md:px-8 lg:px-12">

        <Link

          href={EVERGREEN_PATHS.home}

          className="eg-focus-ring shrink-0 font-[family-name:var(--font-eg-headline)] text-lg font-bold text-[#012d1d] md:text-xl"

        >

          EverGreen &amp; Alpine

        </Link>



        <nav
          className="hidden items-center justify-around gap-4 md:flex lg:gap-6 xl:gap-8"
          aria-label="Primary"
        >
          {/* Property Overview — section hidden
          <EvergreenSectionLink
            href={EVERGREEN_PATHS.manage}
            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.manage))}
            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.manage) ? "true" : undefined}
          >
            Property Overview
          </EvergreenSectionLink>
          */}

          <EvergreenSeasonDropdown />

          <EvergreenSectionLink

            href={EVERGREEN_PATHS.portfolio}

            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.portfolio))}

            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.portfolio) ? "true" : undefined}

          >

            What We Achieved

          </EvergreenSectionLink>



          <EvergreenSectionLink

            href={EVERGREEN_PATHS.whyChooseUs}

            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.whyChooseUs))}

            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.whyChooseUs) ? "true" : undefined}

          >

            Why Choose Us

          </EvergreenSectionLink>



          <EvergreenSectionLink

            href={EVERGREEN_PATHS.howWeWork}

            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.howWeWork))}

            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.howWeWork) ? "true" : undefined}

          >

            How We Work

          </EvergreenSectionLink>



          <EvergreenSectionLink

            href={EVERGREEN_PATHS.reviews}

            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.reviews))}

            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.reviews) ? "true" : undefined}

          >

            Who We Have Helped

          </EvergreenSectionLink>



          <EvergreenSectionLink

            href={EVERGREEN_PATHS.contact}

            className={navLinkClass(isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.contact))}

            aria-current={isEvergreenNavItemActive(navKey, EVERGREEN_PATHS.contact) ? "true" : undefined}

          >

            Where to Contact

          </EvergreenSectionLink>

        </nav>



        <div className="flex shrink-0 items-center gap-3">

          <EvergreenEstimateButton className="hidden rounded-lg bg-[#012d1d] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1b4332] lg:inline-flex">

            Request Estimate

          </EvergreenEstimateButton>

          <EvergreenEstimateButton className="inline-flex rounded-lg bg-[#012d1d] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1b4332] lg:hidden">

            Estimate

          </EvergreenEstimateButton>

        </div>

      </div>

    </header>

  );

}


