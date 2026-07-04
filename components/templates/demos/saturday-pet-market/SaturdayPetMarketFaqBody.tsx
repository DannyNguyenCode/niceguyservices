"use client";

import Link from "next/link";
import { useState } from "react";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_FAQ_DELIVERY } from "./saturdayPetMarketData";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketFaqBody() {
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();

  return (
    <main className="spm-bulletin-texture min-h-screen">
      <section className="relative overflow-hidden px-[var(--spm-margin)] pb-12 pt-16">
        <SpmContainer>
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="z-10 flex-1 space-y-6 text-center md:text-left">
              <span className="spm-label-sm inline-block rounded-full bg-[var(--spm-tertiary-container)] px-6 py-1 text-[var(--spm-on-tertiary-container)]">
                INFORMATION DESK
              </span>
              <h1 className="spm-headline-xl leading-none text-[var(--spm-primary)]">
                How can we help <br />
                <span className="text-[var(--spm-secondary)]">your neighbor?</span>
              </h1>
              <p className="spm-body-lg max-w-xl text-[var(--spm-on-surface-variant)]">
                From same-day local delivery to joining our Saturday Morning Walks, we&apos;ve gathered all the answers
                to make your pet shopping experience a delight.
              </p>
              <div className="relative mt-12 max-w-2xl">
                <input
                  className="spm-custom-shadow w-full rounded-lg border-2 border-[var(--spm-primary-container)] bg-[var(--spm-surface-container-lowest)] px-16 py-6 font-headline-md focus:outline-none focus:ring-4 focus:ring-[var(--spm-primary-fixed)]"
                  placeholder="Search for answers..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <SpmIcon
                  name="search"
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-[var(--spm-primary-container)]"
                />
              </div>
            </div>
            <div className="relative flex w-full justify-center md:w-1/3">
              <div className="spm-custom-shadow relative h-72 w-72 overflow-hidden rounded-full border-8 border-[var(--spm-surface-container-high)]">
                <SpmImg
                  src={SPM_IMG.faq.mascot}
                  alt="Golden retriever store clerk mascot"
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
              <div className="spm-custom-shadow absolute -right-4 -top-4 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-4 border-dashed border-white bg-[var(--spm-secondary)] text-center font-bold text-[var(--spm-on-secondary)]">
                <span className="spm-headline-md leading-tight">
                  ASK <br /> US!
                </span>
              </div>
            </div>
          </div>
        </SpmContainer>
      </section>

      <section className="px-[var(--spm-margin)] pb-16">
        <SpmContainer>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="space-y-6 md:col-span-8">
              <div className="flex items-center gap-3 border-b-2 border-[var(--spm-primary-container)] pb-2">
                <SpmIcon name="local_shipping" className="text-3xl text-[var(--spm-primary)]" />
                <h2 className="spm-headline-lg text-[var(--spm-primary)]">Shopping &amp; Delivery</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {SPM_FAQ_DELIVERY.map((item) => {
                  const matches =
                    !searchLower ||
                    item.title.toLowerCase().includes(searchLower) ||
                    item.body.toLowerCase().includes(searchLower);
                  const isWide = "wide" in item && item.wide;
                  return (
                    <div
                      key={item.title}
                      className={`spm-faq-card spm-custom-shadow group rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] p-6 transition-all hover:border-[var(--spm-primary)] ${
                        isWide ? "sm:col-span-2" : ""
                      }`}
                      style={{
                        opacity: matches ? 1 : 0.5,
                        transform: matches ? "scale(1)" : "scale(0.98)",
                      }}
                    >
                      <div className="spm-coupon-border flex h-full flex-col rounded-md p-3">
                        {isWide ? (
                          <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <div className="flex-grow">
                              <h3 className="spm-headline-md text-[var(--spm-secondary)] transition-colors group-hover:text-[var(--spm-primary)]">
                                {item.title}
                              </h3>
                              <p className="spm-body-md mt-1 text-[var(--spm-on-surface-variant)]">{item.body}</p>
                            </div>
                            {"badge" in item && item.badge ? (
                              <div className="flex-shrink-0 rounded-full bg-[var(--spm-primary-container)] px-6 py-3 font-headline-md text-[var(--spm-on-primary-container)]">
                                {item.badge}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <>
                            <h3 className="spm-headline-md text-[var(--spm-secondary)] transition-colors group-hover:text-[var(--spm-primary)]">
                              {item.title}
                            </h3>
                            <p className="spm-body-md mt-3 flex-grow text-[var(--spm-on-surface-variant)]">{item.body}</p>
                            {"cta" in item && item.cta ? (
                              "href" in item && item.href ? (
                                <Link
                                  href={item.href}
                                  className="spm-label-sm mt-6 flex items-center gap-1 font-bold text-[var(--spm-primary)]"
                                >
                                  {item.cta} <SpmIcon name="arrow_forward" className="text-sm" />
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  className="spm-label-sm mt-6 flex items-center gap-1 font-bold text-[var(--spm-primary)]"
                                >
                                  {item.cta} <SpmIcon name="arrow_forward" className="text-sm" />
                                </button>
                              )
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6 md:col-span-4">
              <div className="flex items-center gap-3 border-b-2 border-[var(--spm-secondary)] pb-2">
                <SpmIcon name="store" className="text-3xl text-[var(--spm-secondary)]" />
                <h2 className="spm-headline-lg text-[var(--spm-secondary)]">Store Policies</h2>
              </div>
              <div className="spm-custom-shadow relative overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-6">
                <div className="absolute left-1/2 top-2 z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-[var(--spm-secondary)] shadow-inner" />
                <div className="space-y-12 pt-3">
                  <div className="group cursor-pointer">
                    <h4 className="spm-headline-md flex items-center justify-between text-[var(--spm-on-surface)] transition-colors hover:text-[var(--spm-secondary)]">
                      Local Vendors
                      <SpmIcon name="expand_more" />
                    </h4>
                    <p className="spm-body-md mt-3 text-[var(--spm-on-surface-variant)]">
                      We prioritize items made within 50 miles. If you&apos;re a local maker, reach out through our
                      &apos;Artisan Application&apos; form.
                    </p>
                  </div>
                  <div className="group cursor-pointer border-t border-[var(--spm-outline-variant)] pt-6">
                    <h4 className="spm-headline-md flex items-center justify-between text-[var(--spm-on-surface)] transition-colors hover:text-[var(--spm-secondary)]">
                      Donations
                      <SpmIcon name="expand_more" />
                    </h4>
                    <p className="spm-body-md mt-3 text-[var(--spm-on-surface-variant)]">
                      We host a &apos;Fill-the-Bin&apos; drive every first Saturday for the Neighborhood Rescue League.
                      Open bags of kibble are always welcome!
                    </p>
                  </div>
                </div>
              </div>
              <div className="spm-custom-shadow flex flex-col items-center gap-3 rounded-lg border-4 border-dashed border-white/30 bg-[var(--spm-secondary)] p-6 text-center text-[var(--spm-on-secondary)]">
                <SpmIcon name="card_giftcard" className="text-4xl" />
                <h3 className="spm-headline-md">New Vendor?</h3>
                <p className="spm-body-md opacity-90">
                  We&apos;re always looking for fresh, locally-made treats and toys for our neighborhood pets.
                </p>
                <Link
                  href={SPM_PATHS.contact}
                  className="rounded-full bg-white px-12 py-1 font-bold text-[var(--spm-secondary)] transition-transform hover:scale-105 active:scale-95"
                >
                  APPLY NOW
                </Link>
              </div>
            </div>

            <div className="mt-12 space-y-6 md:col-span-12">
              <div className="flex items-center gap-3 border-b-2 border-[var(--spm-tertiary-container)] pb-2">
                <SpmIcon name="groups" className="text-3xl text-[var(--spm-tertiary)]" />
                <h2 className="spm-headline-lg text-[var(--spm-tertiary)]">Community &amp; Events</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-3 rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-6 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden rounded-md border border-[var(--spm-outline-variant)]">
                    <SpmImg src={SPM_IMG.faq.bulletin} alt="Community bulletin board" fill className="object-cover" sizes="300px" />
                  </div>
                  <h3 className="spm-headline-md text-[var(--spm-on-surface)]">Event Registration</h3>
                  <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                    Join us for the &apos;Paws &amp; Pastries&apos; mixer. Sign up your pet for our monthly breed-specific
                    social hours!
                  </p>
                  <Link href={SPM_PATHS.community} className="mt-auto inline-flex items-center gap-1 font-bold text-[var(--spm-tertiary)] hover:underline">
                    JOIN THE LIST <SpmIcon name="open_in_new" className="text-sm" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-6 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden rounded-md border border-[var(--spm-outline-variant)]">
                    <SpmImg src={SPM_IMG.faq.rewards} alt="Frequent Barker loyalty card" fill className="object-cover" sizes="300px" />
                  </div>
                  <h3 className="spm-headline-md text-[var(--spm-on-surface)]">Rewards Club</h3>
                  <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                    Become a &apos;Frequent Barker&apos;! Earn 1 point for every $1 spent. 100 points = $10 market credit for
                    your pet&apos;s favorites.
                  </p>
                  <Link href={SPM_PATHS.rewards} className="mt-auto inline-flex items-center gap-1 font-bold text-[var(--spm-tertiary)] hover:underline">
                    LEARN MORE <SpmIcon name="open_in_new" className="text-sm" />
                  </Link>
                </div>
                <div className="spm-custom-shadow flex flex-col justify-center gap-6 rounded-lg bg-[var(--spm-tertiary-container)] p-6 text-[var(--spm-on-tertiary-container)]">
                  <div className="space-y-1 text-center">
                    <h3 className="spm-headline-lg leading-tight">
                      The Weekly <br /> Bark
                    </h3>
                    <p className="spm-body-md opacity-90">
                      Sign up for our printed-style digital newsletter for local pet news.
                    </p>
                  </div>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      className="w-full rounded-full border border-white/30 bg-white/20 px-6 py-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="neighbor@email.com"
                      type="email"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[var(--spm-on-tertiary-container)] py-1 font-bold text-[var(--spm-tertiary-container)] transition-transform hover:scale-105 active:scale-95"
                    >
                      SUBSCRIBE
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </SpmContainer>
      </section>

      <div className="spm-wavy-divider mt-16 h-16 w-full bg-[var(--spm-surface-container)]" />
    </main>
  );
}
