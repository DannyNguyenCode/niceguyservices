"use client";

import Link from "next/link";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SaturdayPetMarketSpecialistFab } from "./SaturdayPetMarketSpecialistFab";
import { SpmContainer, SpmIcon, SpmImg, SpmPriceTag } from "./SaturdayPetMarketShared";
import { useSpmHomeFeatured } from "./useSpmHomeFeatured";

const AISLES = [
  { icon: "restaurant", label: "Nutrition", color: "primary" },
  { icon: "done", label: "Treats", color: "secondary" },
  { icon: "extension", label: "Toys", color: "tertiary" },
  { icon: "health_and_safety", label: "Wellness", color: "primary" },
  { icon: "content_cut", label: "Grooming", color: "secondary" },
  { icon: "pets", label: "Felines", color: "tertiary" },
  { icon: "5g", label: "Canines", color: "primary" },
  { icon: "flutter_dash", label: "Birds", color: "secondary" },
  { icon: "pest_control_rodent", label: "Small Pets", color: "tertiary" },
  { icon: "water_drop", label: "Aquatics", color: "primary" },
  { icon: "pest_control", label: "Reptiles", color: "secondary" },
  { icon: "local_offer", label: "Specials", color: "tertiary" },
] as const;

export function SaturdayPetMarketHomeBody() {
  const { addToCart } = useSpmCart();
  const { items: featuredItems, loading: featuredLoading, error: featuredError } = useSpmHomeFeatured();

  return (
    <main>
      <section className="relative overflow-hidden px-[var(--spm-margin)] pb-16 pt-12">
        <SpmContainer className="grid items-center gap-12 md:grid-cols-2">
          <div className="z-10 text-center md:text-left">
            <span className="spm-label-sm mb-6 inline-block rounded-full bg-[var(--spm-tertiary-container)] px-6 py-1 text-[var(--spm-on-tertiary-container)] shadow-sm">
              EST. 1989 • NEIGHBORHOOD FAVORITE
            </span>
            <h1 className="spm-headline-xl mb-6 leading-tight text-[var(--spm-on-background)]">
              Every Pet Deserves Their <br />
              <span className="italic text-[var(--spm-primary)]">Favorite Store.</span>
            </h1>
            <p className="spm-body-lg mb-12 max-w-lg text-[var(--spm-on-surface-variant)]">
              Toys, treats, food, wellness, and community events that bring pets and people together.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Link
                href={SPM_PATHS.shop}
                className="spm-headline-md flex items-center justify-center gap-2 rounded-lg bg-[var(--spm-primary)] px-12 py-4 text-[var(--spm-on-primary)] shadow-lg transition-all hover:-translate-y-0.5"
              >
                Shop Now <SpmIcon name="arrow_forward" />
              </Link>
              <button
                type="button"
                className="spm-headline-md spm-coupon-dashed flex items-center justify-center gap-2 rounded-lg border-[var(--spm-outline)] bg-[var(--spm-surface-container-high)] px-12 py-4 text-[var(--spm-on-surface-variant)]"
              >
                Community Events
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="spm-shelf-shadow relative aspect-[4/3] rotate-2 overflow-hidden rounded-xl border-4 border-white">
              <SpmImg src={SPM_IMG.home.hero} alt="Neighborhood pet store storefront" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 flex h-32 w-32 -rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-4 border-white bg-[var(--spm-secondary)] text-center text-white shadow-xl">
              <span className="spm-label-price">LOCAL</span>
              <span className="text-sm leading-none">PICKUP</span>
              <span className="text-sm leading-none">FREE</span>
            </div>
          </div>
        </SpmContainer>
      </section>

      <div className="relative z-10 h-16 bg-[var(--spm-background)]">
        <svg className="absolute bottom-0 h-16 w-full fill-[var(--spm-surface-container)]" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0 22L120 16.7C240 11 480 1 720 0.5C960 1 1200 11 1320 16.7L1440 22V54H0V22Z" />
        </svg>
      </div>

      <section className="relative bg-[var(--spm-surface-container)] px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="spm-headline-xl mb-2 text-[var(--spm-on-surface)]">Shop by Aisle</h2>
              <p className="spm-body-lg text-[var(--spm-on-surface-variant)]">Carefully curated for every member of your pet family.</p>
            </div>
            <Link href={SPM_PATHS.shop} className="hidden items-center gap-1 font-bold text-[var(--spm-primary)] hover:underline md:flex">
              View All Categories <SpmIcon name="chevron_right" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {AISLES.map((aisle) => (
              <Link
                key={aisle.label}
                href={SPM_PATHS.shop}
                className="spm-shelf-shadow group flex flex-col items-center rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-background)] p-6 text-center transition-all hover:scale-[1.02] hover:border-[var(--spm-primary)]"
              >
                <div
                  className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:rotate-12 ${
                    aisle.color === "primary"
                      ? "bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]"
                      : aisle.color === "secondary"
                        ? "bg-[var(--spm-secondary-fixed)] text-[var(--spm-secondary)]"
                        : "bg-[var(--spm-tertiary-fixed)] text-[var(--spm-tertiary)]"
                  }`}
                >
                  <SpmIcon name={aisle.icon} className="text-4xl" />
                </div>
                <h3 className="spm-headline-md group-hover:text-[var(--spm-primary)]">{aisle.label}</h3>
              </Link>
            ))}
          </div>
        </SpmContainer>
      </section>

      <section className="relative overflow-hidden bg-[var(--spm-background)] px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <div className="spm-candy-stripe relative rounded-xl border-4 border-[var(--spm-secondary)] p-8">
            <span className="absolute right-4 top-4 inline-block -rotate-6 rounded-full bg-[var(--spm-secondary)] px-6 py-2 text-white shadow-lg spm-headline-md">
              FLYER SAVINGS!
            </span>
            <h2 className="spm-headline-xl mb-12 uppercase tracking-tight text-[var(--spm-secondary)]">Saturday Morning Specials</h2>
            {featuredError ? (
              <p className="spm-body-md mb-8 rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]">
                {featuredError}
              </p>
            ) : null}
            <div className="grid gap-12 md:grid-cols-3">
              {featuredLoading
                ? Array.from({ length: 3 }, (_, index) => (
                    <div
                      key={index}
                      className="spm-shelf-shadow flex animate-pulse flex-col rounded-lg border-2 border-[var(--spm-outline-variant)] bg-white p-6"
                    >
                      <div className="mb-6 h-48 rounded-md bg-[var(--spm-surface-container-high)]" />
                      <div className="mb-2 h-6 w-3/4 rounded bg-[var(--spm-surface-container-high)]" />
                      <div className="mb-6 h-16 rounded bg-[var(--spm-surface-container)]" />
                      <div className="mt-auto h-10 rounded bg-[var(--spm-surface-container-high)]" />
                    </div>
                  ))
                : featuredItems.map((item) => (
                <div key={item.product.id} className="spm-shelf-shadow flex flex-col rounded-lg border-2 border-[var(--spm-outline-variant)] bg-white p-6">
                  <div className="relative mb-6 h-48 overflow-hidden rounded-md">
                    <SpmImg src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className={`absolute left-2 top-2 rounded-full px-4 py-1 text-white spm-label-sm ${item.badgeClass}`}>{item.badge}</div>
                  </div>
                  <h3 className="spm-headline-md mb-2">{item.product.name}</h3>
                  <p className="spm-body-md mb-6 flex-grow text-[var(--spm-on-surface-variant)]">{item.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-dashed border-[var(--spm-outline-variant)] pt-4">
                    <SpmPriceTag price={item.product.salePrice ?? item.product.price} variant="hole" className="bg-[var(--spm-secondary)] text-white" />
                    <button
                      type="button"
                      onClick={() => addToCart(item.product)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-on-secondary-fixed-variant)] text-white transition-transform hover:scale-110"
                      aria-label={`Add ${item.product.name} to cart`}
                    >
                      <SpmIcon name="add_shopping_cart" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SpmContainer>
      </section>

      <section className="bg-[var(--spm-surface-container-low)] px-[var(--spm-margin)] py-16">
        <SpmContainer className="grid items-center gap-16 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <div className="-rotate-2 rounded-lg bg-[var(--spm-primary-container)] p-8 shadow-xl">
              <div className="rounded-lg border-2 border-dashed border-[var(--spm-primary)] bg-[var(--spm-background)] p-6">
                <div className="relative mb-6 aspect-video overflow-hidden rounded-md">
                  <SpmImg src={SPM_IMG.home.localShop} alt="Friendly neighborhood pet shop" fill className="object-cover spm-shelf-shadow" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--spm-secondary)]">
                    <SpmIcon name="favorite" className="text-white" />
                  </div>
                  <p className="spm-headline-md">Owned by Pet Lovers since 1989</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="spm-headline-xl mb-6 text-[var(--spm-primary)]">Why Local Matters</h2>
            <div className="space-y-8">
              {[
                { icon: "local_shipping", iconClass: "text-[var(--spm-secondary)]", title: "Same-Day Neighborhood Delivery", desc: "Order by noon and get it by dinner time." },
                { icon: "storefront", iconClass: "text-[var(--spm-primary)]", title: "In-Store Connection", desc: "Bring your pet! Expert advice included for free." },
                { icon: "volunteer_activism", iconClass: "text-[var(--spm-tertiary)]", title: "Supporting Local Rescues", desc: "Every purchase helps fund monthly adoption events." },
              ].map((item) => (
                <div key={item.title} className="flex gap-6">
                  <SpmIcon name={item.icon} className={`shrink-0 text-4xl ${item.iconClass}`} />
                  <div>
                    <h3 className="spm-headline-md mb-1">{item.title}</h3>
                    <p className="spm-body-md text-[var(--spm-on-surface-variant)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SpmContainer>
      </section>

      <section className="bg-[var(--spm-background)] px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <h2 className="spm-headline-xl mb-12 text-center text-[var(--spm-on-background)]">Community Hub</h2>
          <div className="grid h-auto gap-6 md:h-[600px] md:grid-cols-3 md:grid-rows-2">
            <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] md:col-span-2 md:row-span-2">
              <SpmImg src={SPM_IMG.home.adoption} alt="Pet adoption fair" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 mt-auto p-8 text-white">
                <span className="spm-label-sm mb-2 inline-block rounded-full bg-[var(--spm-secondary)] px-4 py-1">UPCOMING EVENT</span>
                <h3 className="spm-headline-xl mb-2">Annual Paws in the Park Adoption Fair</h3>
                <p className="spm-body-lg mb-6 max-w-lg text-white/90">Join us this Saturday for our biggest event of the year.</p>
                <button type="button" className="spm-headline-md rounded-lg bg-white px-8 py-4 text-[var(--spm-on-surface)] hover:bg-[var(--spm-surface-container-highest)]">
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-tertiary-container)] p-8 transition-all hover:shadow-lg">
              <div>
                <SpmIcon name="library_books" className="mb-6 text-4xl text-[var(--spm-on-tertiary-container)]" />
                <h3 className="spm-headline-md mb-2 text-[var(--spm-on-tertiary-container)]">Pet Resource Center</h3>
                <p className="spm-body-md text-[var(--spm-on-tertiary-container)]/80">Expert guides on nutrition, training, and wellness.</p>
              </div>
              <span className="mt-6 flex items-center gap-1 font-bold text-[var(--spm-on-tertiary-container)]">
                Browse Guides <SpmIcon name="arrow_right_alt" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-primary-container)] p-8 transition-all hover:shadow-lg">
              <div>
                <SpmIcon name="mail" className="mb-6 text-4xl text-[var(--spm-on-primary-container)]" />
                <h3 className="spm-headline-md mb-2 text-[var(--spm-on-primary-container)]">The Saturday Morning Snippet</h3>
                <p className="spm-body-md text-[var(--spm-on-primary-container)]/80">Weekly coupons and local pet news.</p>
              </div>
              <div className="mt-6">
                <input className="mb-2 w-full rounded-lg border-none bg-white/20 px-4 py-2 text-[var(--spm-on-primary-container)] placeholder:text-[var(--spm-on-primary-container)]/50" placeholder="Email address" type="email" />
                <button type="button" className="w-full rounded-lg bg-[var(--spm-on-primary-container)] py-2 font-bold text-white">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </SpmContainer>
      </section>

      <SaturdayPetMarketSpecialistFab icon="chat_bubble" label="Ask a Specialist" />
    </main>
  );
}
