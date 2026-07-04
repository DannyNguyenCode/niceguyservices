"use client";

import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_STORE_LOCATIONS } from "./saturdayPetMarketData";
import { SaturdayPetMarketSpecialistFab } from "./SaturdayPetMarketSpecialistFab";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketLocationsBody() {
  return (
    <>
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <div className="mb-16 flex flex-col items-end justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h1 className="spm-headline-xl mb-3 text-[var(--spm-on-surface)]">Our Neighborhood Spots</h1>
              <p className="spm-body-lg max-w-2xl text-[var(--spm-on-surface-variant)]">
                Since 1989, we&apos;ve been the heartbeat of the local pet community. Stop by for a scratch behind the
                ears and some fresh-baked biscuits.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="spm-coupon-border rotate-3 rounded-lg border-[var(--spm-on-tertiary-container)] bg-[var(--spm-tertiary-container)] px-6 py-3 text-[var(--spm-on-tertiary-container)] shadow-md">
                <p className="spm-headline-md">Open Daily!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-12 lg:col-span-7">
              {SPM_STORE_LOCATIONS.map((store) => (
                <div
                  key={store.id}
                  className="group overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] shadow-md transition-all hover:border-[var(--spm-primary)]"
                >
                  <div className="grid h-full grid-cols-1 md:grid-cols-5">
                    <div className="relative overflow-hidden md:col-span-2">
                      <SpmImg
                        src={store.image}
                        alt={store.name}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                      {"badge" in store && store.badge ? (
                        <div
                          className={`spm-label-sm absolute left-3 top-3 rounded-full px-3 py-1 shadow-sm ${store.badgeClass}`}
                        >
                          {store.badge}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between bg-[var(--spm-surface-container-low)] p-6 md:col-span-3">
                      <div>
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="spm-headline-md text-[var(--spm-primary)]">{store.name}</h3>
                          <div className="spm-label-sm flex items-center gap-1 rounded-full bg-[var(--spm-primary-container)] px-3 py-1 text-[var(--spm-on-primary-container)]">
                            <SpmIcon name="star" className="text-sm" fill />
                            {store.rating}
                          </div>
                        </div>
                        <p className="mb-6 flex items-center gap-1 text-[var(--spm-on-surface-variant)]">
                          <SpmIcon name="location_on" className="text-[var(--spm-secondary)]" />
                          {store.address}
                        </p>
                        <div
                          className={`mb-6 rounded-md border-l-4 bg-[var(--spm-on-background)] p-3 shadow-inner ${store.hoursBorder}`}
                        >
                          <p
                            className={`spm-neon-text spm-headline-md mb-1 text-sm uppercase tracking-widest ${store.hoursTitleClass}`}
                          >
                            {store.hoursTitle}
                          </p>
                          {store.hours.map((line) => (
                            <p key={line} className="spm-label-sm text-white opacity-90">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {store.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="spm-coupon-border flex items-center gap-1 rounded-md border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] px-3 py-1"
                          >
                            <SpmIcon
                              name={stat.icon}
                              className={stat.icon === "pets" ? "text-[var(--spm-primary)]" : "text-[var(--spm-secondary)]"}
                              fill={stat.fill}
                            />
                            <span className="spm-label-sm text-[var(--spm-on-surface)]">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-[100px] flex flex-col gap-6">
                <div className="relative h-[500px] overflow-hidden rounded-lg border-4 border-[var(--spm-on-surface)] bg-[var(--spm-surface-container-high)] shadow-xl">
                  <div
                    className="h-full w-full bg-cover bg-center opacity-70 grayscale"
                    style={{ backgroundImage: `url('${SPM_IMG.home.map}')` }}
                  />
                  {SPM_STORE_LOCATIONS.map((store) => (
                    <div
                      key={store.id}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ top: store.pinPosition.top, left: store.pinPosition.left }}
                    >
                      <div
                        className={`rounded-full border-2 border-white p-1 shadow-lg ${store.pinClass} ${store.id === "downtown" ? "animate-bounce" : ""}`}
                      >
                        <SpmIcon name="pets" fill />
                      </div>
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--spm-on-background)] px-3 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {store.name}
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-6 right-6 flex flex-col gap-1">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-[var(--spm-on-background)] text-white transition-colors hover:bg-[var(--spm-secondary)]"
                      aria-label="Zoom in"
                    >
                      <SpmIcon name="add" className="text-sm" />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-[var(--spm-on-background)] text-white transition-colors hover:bg-[var(--spm-secondary)]"
                      aria-label="Zoom out"
                    >
                      <SpmIcon name="remove" className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="spm-coupon-border flex items-center justify-between gap-6 rounded-lg border-[var(--spm-on-tertiary-container)] bg-[var(--spm-tertiary-container)] p-6 shadow-md">
                  <div>
                    <p className="spm-headline-md mb-1 text-[var(--spm-on-tertiary-container)]">Treat Your Inbox</p>
                    <p className="spm-label-sm text-[var(--spm-on-tertiary-container)] opacity-80">
                      Get local event invites &amp; exclusive secret sales.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-[var(--spm-on-tertiary-container)] px-6 py-3 font-bold text-[var(--spm-tertiary-container)] shadow-md transition-all hover:scale-105 active:translate-y-0.5"
                  >
                    Join Club
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SpmContainer>
      </main>
      <SaturdayPetMarketSpecialistFab icon="support_agent" label="Chat with us" />
    </>
  );
}
