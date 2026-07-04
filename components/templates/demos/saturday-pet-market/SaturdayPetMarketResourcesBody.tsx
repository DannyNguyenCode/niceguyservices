"use client";

import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_RESOURCE_ARTICLES } from "./saturdayPetMarketData";
import { SpmCategorySidebar } from "./SaturdayPetMarketSidebar";
import { SaturdayPetMarketSpecialistFab } from "./SaturdayPetMarketSpecialistFab";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

const RESOURCE_SIDEBAR_LINKS = [
  { icon: "pets", label: "All Products", href: SPM_PATHS.resources, active: true },
  { icon: "pets", label: "New Pet Owners", href: SPM_PATHS.resources },
  { icon: "pets", label: "Nutrition", href: SPM_PATHS.resources },
  { icon: "flutter_dash", label: "Training", href: SPM_PATHS.resources },
  { icon: "sell", label: "Health", href: SPM_PATHS.resources },
];

export function SaturdayPetMarketResourcesBody() {
  const [featured, ...articles] = SPM_RESOURCE_ARTICLES;

  return (
    <>
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <section className="relative mb-16 flex flex-col items-center gap-8 overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-primary-container)]/10 p-8 md:flex-row">
            <div className="spm-candy-stripe-teal absolute inset-0 -z-10 opacity-10" />
            <div className="flex-1 space-y-4">
              <div className="spm-label-sm inline-block rounded-full bg-[var(--spm-tertiary-container)] px-3 py-1 text-[var(--spm-on-tertiary-container)]">
                VOL. 34: THE KNOWLEDGE ISSUE
              </div>
              <h1 className="spm-headline-xl leading-tight text-[var(--spm-primary)]">
                The Pet Parent&apos;s
                <br />
                Guidebook
              </h1>
              <p className="spm-body-lg max-w-lg text-[var(--spm-on-surface-variant)]">
                A curated shelf of educational wonders for your fuzzy, feathery, and scaly companions. From first steps to
                golden years.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="flex items-center gap-1 rounded-lg bg-[var(--spm-secondary)] px-4 py-2 font-bold text-[var(--spm-on-secondary)] shadow-md hover:opacity-90 active:scale-95">
                  <SpmIcon name="bookmark" className="text-[20px]" />
                  Saved Articles
                </button>
                <button type="button" className="rounded-lg border border-[var(--spm-outline)] bg-[var(--spm-surface-container-high)] px-4 py-2 font-bold text-[var(--spm-on-surface-variant)] hover:bg-[var(--spm-surface-container-highest)]">
                  Recent Updates
                </button>
              </div>
            </div>
            <div className="relative aspect-square w-full max-w-md flex-1">
              <div className="absolute inset-0 scale-90 animate-pulse rounded-full bg-[var(--spm-secondary-fixed)] opacity-30 blur-3xl" />
              <div className="relative h-full w-full rotate-3 overflow-hidden rounded-lg border-2 border-[var(--spm-on-surface)] bg-white p-2 shadow-xl">
                <SpmImg src={SPM_IMG.resources.hero} alt="Vintage pet shop illustration" fill className="rounded-sm object-cover" sizes="400px" />
              </div>
            </div>
          </section>

          <div className="relative mb-12">
            <input
              className="spm-headline-md w-full rounded-xl border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] px-6 py-4 shadow-sm outline-none transition-all focus:border-[var(--spm-primary)]"
              placeholder="Search the guidebook by keyword, pet type, or topic..."
              type="search"
            />
            <SpmIcon name="search" className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--spm-primary)]" />
          </div>

          <div className="flex flex-col gap-6 md:flex-row">
            <SpmCategorySidebar
              title="Shop by Category"
              subtitle="Local & Fresh"
              links={RESOURCE_SIDEBAR_LINKS}
              footer={
                <div className="spm-coupon-border mt-auto rounded-lg bg-[var(--spm-primary-container)]/20 p-3">
                  <p className="spm-label-sm mb-1 text-[var(--spm-primary)]">MEMBER EXCLUSIVE</p>
                  <p className="spm-headline-md leading-none text-[var(--spm-on-primary-container)]">15% OFF</p>
                  <p className="mt-1 text-[11px] text-[var(--spm-on-surface-variant)]">On all Training supplies this week!</p>
                </div>
              }
            />

            <div className="min-w-0 flex-1 space-y-6">
              <article className="spm-retro-shadow group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-[var(--spm-surface)] transition-all md:flex-row">
                <div className="relative h-64 overflow-hidden md:h-auto md:w-1/2">
                  <SpmImg src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="500px" />
                  <span className={`spm-label-sm absolute left-3 top-3 rounded-full px-3 py-1 ${featured.categoryClass}`}>
                    {featured.category}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 md:w-1/2">
                  <div className="mb-1 flex items-center gap-1 text-[var(--spm-on-surface-variant)] opacity-60">
                    <SpmIcon name="schedule" className="text-base" />
                    <span className="spm-label-sm">{featured.readTime}</span>
                  </div>
                  <h2 className="spm-headline-lg mb-2 text-[var(--spm-on-surface)] transition-colors group-hover:text-[var(--spm-primary)]">
                    {featured.title}
                  </h2>
                  <p className="spm-body-md mb-4 text-[var(--spm-on-surface-variant)]">{featured.excerpt}</p>
                  <span className="flex items-center gap-1 font-bold text-[var(--spm-secondary)] transition-transform group-hover:translate-x-2">
                    READ THE GUIDE
                    <SpmIcon name="arrow_forward" />
                  </span>
                </div>
              </article>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <article key={article.title} className="spm-retro-shadow group overflow-hidden rounded-lg border border-black/10 bg-white">
                    <div className="relative h-48 overflow-hidden">
                      <SpmImg src={article.image} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="300px" />
                      <span className={`spm-label-sm absolute left-3 top-3 rounded-full px-3 py-1 ${article.categoryClass}`}>
                        {article.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="mb-1 flex items-center gap-1 text-[var(--spm-on-surface-variant)] opacity-60">
                        <SpmIcon name="schedule" className="text-base" />
                        <span className="spm-label-sm">{article.readTime}</span>
                      </div>
                      <h3 className="spm-headline-md mb-2 transition-colors group-hover:text-[var(--spm-primary)]">{article.title}</h3>
                      <p className="spm-body-md line-clamp-2 text-[var(--spm-on-surface-variant)]">{article.excerpt}</p>
                    </div>
                  </article>
                ))}

                <div className="relative flex flex-col items-center justify-center space-y-2 overflow-hidden rounded-lg bg-[var(--spm-secondary)] p-6 text-center text-[var(--spm-on-secondary)]">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/10" />
                  <SpmIcon name="auto_stories" className="animate-bounce text-[48px]" />
                  <h3 className="spm-headline-md">Want our physical monthly zine?</h3>
                  <p className="spm-body-md opacity-90">
                    Get a high-quality printed Guidebook delivered to your door every first Saturday.
                  </p>
                  <button type="button" className="rounded-full bg-white px-8 py-2 font-bold text-[var(--spm-secondary)] shadow-lg hover:scale-105 active:scale-95">
                    SIGN UP FREE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SpmContainer>
      </main>
      <SaturdayPetMarketSpecialistFab
        icon="question_answer"
        label="Ask a Specialist"
        className="bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]"
      />
    </>
  );
}
