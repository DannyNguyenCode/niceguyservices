"use client";

import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_COMMUNITY_STATS } from "./saturdayPetMarketData";
import { SpmFab } from "./SaturdayPetMarketSidebar";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketCommunityBody() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-[var(--spm-surface-container-low)] px-[var(--spm-margin)] pb-12 pt-16">
          <SpmContainer className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
            <div>
              <div className="spm-sticker-rotate-left spm-retro-shadow mb-3 inline-block rounded-full bg-[var(--spm-tertiary-container)] px-3 py-1 spm-label-sm text-[var(--spm-on-tertiary-container)]">
                EST. 1989
              </div>
              <h1 className="spm-headline-xl mb-2 text-[var(--spm-primary)]">More Than A Pet Store</h1>
              <p className="spm-body-lg mb-6 max-w-lg text-[var(--spm-on-surface-variant)]">
                We&apos;re the local heart of your pet&apos;s life. Join us for weekly meetups, rescues, and community
                celebrations that make our neighborhood purr.
              </p>
              <div className="flex gap-3">
                <button type="button" className="spm-coupon-border flex items-center gap-1 rounded-lg bg-[var(--spm-primary)] px-4 py-2 font-bold text-[var(--spm-on-primary)] active:translate-y-0.5">
                  View Calendar
                  <SpmIcon name="calendar_month" />
                </button>
                <button type="button" className="rounded-lg border border-[var(--spm-outline)] bg-[var(--spm-surface-container-highest)] px-4 py-2 font-bold text-[var(--spm-primary)] hover:bg-[var(--spm-surface-container-high)]">
                  Our Impact
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="spm-sticker-rotate-right spm-retro-shadow rounded-xl border-2 border-[var(--spm-primary)] bg-white p-2">
                <SpmImg
                  src={SPM_IMG.community.hero}
                  alt="Local pet community event at corner store"
                  width={640}
                  height={400}
                  className="h-[400px] w-full rounded-lg object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="spm-sticker-rotate-left absolute -bottom-4 -left-4 z-20 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[var(--spm-secondary-container)] p-4 text-center text-[var(--spm-on-secondary-container)] shadow-lg">
                <span className="spm-headline-md">100%</span>
                <span className="spm-label-sm leading-tight">Local Love</span>
              </div>
            </div>
          </SpmContainer>
          <div className="spm-wavy-divider absolute bottom-0 left-0 h-12 w-full bg-[var(--spm-background)]" />
        </section>

        <section className="px-[var(--spm-margin)] py-16">
          <SpmContainer>
            <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div>
                <h2 className="spm-headline-lg text-[var(--spm-secondary)]">Happening at the Market</h2>
                <p className="text-[var(--spm-on-surface-variant)]">Grab a leash and come on down!</p>
              </div>
              <div className="spm-candy-stripe-subtle hidden h-2 w-32 rounded-full md:block" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="flex flex-col overflow-hidden rounded-lg border-2 border-[var(--spm-outline-variant)] bg-white transition-colors hover:border-[var(--spm-primary)] md:col-span-7 md:flex-row">
                <div className="relative h-64 md:h-auto md:w-1/2">
                  <SpmImg src={SPM_IMG.community.dogBbq} alt="Dog-friendly barbecue event" fill className="object-cover" sizes="400px" />
                  <span className="spm-label-sm absolute left-3 top-3 rounded-full bg-[var(--spm-tertiary-container)] px-3 py-1 text-[var(--spm-on-tertiary-container)]">
                    POPULAR
                  </span>
                </div>
                <div className="flex flex-col justify-between p-6 md:w-1/2">
                  <div>
                    <div className="mb-1 flex items-center gap-1 text-[var(--spm-secondary)]">
                      <SpmIcon name="event" />
                      <span className="spm-label-sm uppercase tracking-wider">Aug 12 • 11:00 AM</span>
                    </div>
                    <h3 className="spm-headline-md mb-1 text-[var(--spm-primary)]">Annual Dog BBQ</h3>
                    <p className="spm-body-md mb-4 text-[var(--spm-on-surface-variant)]">
                      Grilling up grain-free treats for the pups and classic burgers for the humans. All proceeds support
                      the local shelter.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-t border-[var(--spm-outline-variant)] pt-2 spm-label-sm">
                      <div className="flex items-center gap-1">
                        <SpmIcon name="location_on" className="text-[var(--spm-primary)]" />
                        <span>Main St. Courtyard</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-[var(--spm-secondary)]">
                        <SpmIcon name="groups" />
                        <span>42/50 Full</span>
                      </div>
                    </div>
                    <button type="button" className="spm-coupon-border w-full rounded-lg bg-[var(--spm-primary)] py-2 font-bold text-[var(--spm-on-primary)] active:scale-95">
                      Claim a Spot
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-6 transition-colors hover:border-[var(--spm-secondary)] md:col-span-5">
                <SpmIcon name="favorite" className="absolute -right-4 -top-4 text-[120px] text-[var(--spm-secondary)] opacity-10" />
                <div>
                  <span className="spm-sticker-rotate-right spm-label-sm mb-4 inline-block rounded-full bg-[var(--spm-secondary)] px-3 py-1 text-white">
                    FUNDRAISER
                  </span>
                  <h3 className="spm-headline-md mb-1">Paw-sitively Retro Fundraiser</h3>
                  <p className="spm-body-md mb-4 text-[var(--spm-on-surface-variant)]">
                    Help us raise $5,000 for &apos;Paws in the Park&apos; medical fund. 20% of all market sales this day go
                    directly to the cause.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-[var(--spm-outline-variant)] bg-white p-3">
                    <div>
                      <span className="spm-label-sm text-[var(--spm-on-surface-variant)]">Date &amp; Location</span>
                      <p className="font-bold text-[var(--spm-primary)]">Aug 15 • In-Store</p>
                    </div>
                    <div className="spm-price-tag-hole relative rounded-full bg-[var(--spm-secondary)] pl-8 pr-3 py-1 spm-label-price text-white">
                      $25+
                    </div>
                  </div>
                  <button type="button" className="w-full rounded-lg bg-[var(--spm-on-background)] py-2 font-bold text-white active:scale-95">
                    Donate &amp; RSVP
                  </button>
                </div>
              </div>

              <div className="rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-tertiary-fixed)] p-6 transition-colors hover:border-[var(--spm-tertiary)] md:col-span-12 lg:col-span-4">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                  <SpmImg src={SPM_IMG.community.adoption} alt="Rescue dog with adopt me bandana" fill className="object-cover" sizes="300px" />
                  <span className="absolute bottom-1 right-1 rounded-full bg-white px-3 py-1 text-sm font-bold text-[var(--spm-primary)] shadow-sm">
                    Aug 20-21
                  </span>
                </div>
                <h3 className="spm-headline-md mb-1 text-[var(--spm-on-tertiary-fixed-variant)]">Adoption Weekend</h3>
                <p className="spm-body-md mb-4 text-[var(--spm-on-tertiary-fixed-variant)] opacity-80">
                  Find your new best friend! We&apos;re hosting 5 local rescues under our big striped tent.
                </p>
                <div className="mb-2 flex items-center justify-between spm-label-sm">
                  <span>8 Rescues Attending</span>
                  <span className="font-bold text-[var(--spm-tertiary)]">Capacity: 200</span>
                </div>
                <button type="button" className="spm-coupon-border w-full rounded-lg bg-[var(--spm-tertiary)] py-2 font-bold text-[var(--spm-on-tertiary)] active:scale-95">
                  Get Reminded
                </button>
              </div>

              <div className="spm-candy-stripe-subtle flex flex-col items-center gap-4 rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-highest)] p-6 md:col-span-12 md:flex-row lg:col-span-8">
                <div className="flex-1">
                  <h3 className="spm-headline-md mb-1 text-[var(--spm-primary)]">Hosting your own pet event?</h3>
                  <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                    Our community room is free for local pet non-profits and training groups. Reach out to reserve your date!
                  </p>
                </div>
                <button type="button" className="spm-sticker-rotate-left whitespace-nowrap rounded-full border-2 border-[var(--spm-primary)] bg-white px-4 py-2 font-bold text-[var(--spm-primary)] hover:bg-[var(--spm-primary)] hover:text-white">
                  Contact Community Lead
                </button>
              </div>
            </div>
          </SpmContainer>
        </section>

        <section className="relative bg-[var(--spm-surface-container)] py-16">
          <div className="spm-wavy-divider absolute top-0 left-0 h-12 w-full rotate-180 bg-[var(--spm-background)]" />
          <SpmContainer className="pt-12">
            <div className="mb-12 text-center">
              <div className="mb-2 inline-block rounded-full bg-[var(--spm-primary-container)] px-4 py-1 font-bold text-[var(--spm-on-primary-container)]">
                COMMUNITY IMPACT
              </div>
              <h2 className="spm-headline-xl mb-2 text-[var(--spm-primary)]">Growing Together Since &apos;89</h2>
              <p className="spm-body-lg mx-auto max-w-2xl text-[var(--spm-on-surface-variant)]">
                Because of your support at Saturday Morning Pet Market, we&apos;ve been able to give back to our local
                furry friends in a big way.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SPM_COMMUNITY_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`spm-retro-shadow rounded-xl border-2 border-[var(--spm-outline-variant)] bg-white p-8 text-center ${i % 2 === 0 ? "spm-sticker-rotate-left" : "spm-sticker-rotate-right"}`}
                >
                  <SpmIcon
                    name={stat.icon}
                    className={`mb-3 text-[48px] ${stat.icon === "volunteer_activism" || stat.icon === "location_city" ? "text-[var(--spm-secondary)]" : stat.icon === "restaurant" ? "text-[var(--spm-tertiary)]" : "text-[var(--spm-primary)]"}`}
                  />
                  <div className="spm-headline-xl text-[var(--spm-primary)]">{stat.value}</div>
                  <p className="spm-label-sm uppercase text-[var(--spm-on-surface-variant)]">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-lg border-2 border-dashed border-[var(--spm-primary)] bg-white p-6 md:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--spm-secondary-fixed)]">
                  <SpmIcon name="mail" className="text-3xl text-[var(--spm-secondary)]" />
                </div>
                <div>
                  <h4 className="spm-headline-md">Get Local Updates</h4>
                  <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                    Stay in the loop about events, rescues, and community wins.
                  </p>
                </div>
              </div>
              <form className="flex w-full gap-2 md:w-auto">
                <input className="flex-1 rounded-lg border border-[var(--spm-outline-variant)] focus:border-[var(--spm-secondary)] focus:ring-[var(--spm-secondary)] md:w-64" placeholder="Your email address" type="email" />
                <button type="submit" className="whitespace-nowrap rounded-lg bg-[var(--spm-secondary)] px-4 py-2 font-bold text-white hover:opacity-90">
                  Join Hub
                </button>
              </form>
            </div>
          </SpmContainer>
        </section>
      </main>
      <SpmFab icon="add_comment" className="spm-coupon-border" />
    </>
  );
}
