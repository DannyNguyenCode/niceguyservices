"use client";

import Link from "next/link";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_REWARDS_PERKS, SPM_REWARDS_STEPS } from "./saturdayPetMarketData";
import { useSpmAuth } from "./SaturdayPetMarketAuthContext";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketRewardsBody() {
  const { isLoggedIn } = useSpmAuth();

  return (
    <main className="px-[var(--spm-margin)] py-16">
      <SpmContainer>
        <header className="mb-16 text-center">
          <span className="spm-label-sm mb-4 inline-block rounded-full bg-[var(--spm-tertiary-container)] px-6 py-1 text-[var(--spm-on-tertiary-container)]">
            REWARDS CLUB
          </span>
          <h1 className="spm-headline-xl mb-4 text-[var(--spm-primary)]">How Saturday Morning Rewards Work</h1>
          <p className="spm-body-lg mx-auto max-w-2xl text-[var(--spm-on-surface-variant)]">
            Join our neighborhood loyalty program — digital punches, Paws Points, and member treats without the plastic
            card clutter.
          </p>
        </header>

        <section className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {SPM_REWARDS_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-8 text-center shadow-sm"
            >
              <span className="spm-headline-md absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]">
                {index + 1}
              </span>
              <SpmIcon name={step.icon} className="mb-4 text-5xl text-[var(--spm-primary)]" />
              <h2 className="spm-headline-md mb-2 text-[var(--spm-on-surface)]">{step.title}</h2>
              <p className="spm-body-md text-[var(--spm-on-surface-variant)]">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="spm-membership-card relative overflow-hidden rounded-lg border-2 border-white/20 p-8 shadow-lg">
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="spm-label-sm uppercase tracking-widest text-white/80">Official Member</span>
                  <h2 className="spm-headline-lg text-white">Digital Punch Card</h2>
                </div>
                <SpmIcon name="stars" className="text-5xl text-white opacity-40" />
              </div>
              <p className="spm-body-md text-white/90">
                Buy qualifying items, earn punches on your card. Fill all 10 slots and unlock a free bag of premium
                kibble or $15 off your next haul.
              </p>
              <div className="flex flex-wrap justify-center gap-4 rounded-xl border border-dashed border-white/30 bg-white/10 p-6">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed ${
                      i < 6 ? "border-white bg-white/20 text-white" : "border-white/40 text-white/50"
                    }`}
                  >
                    {i < 6 ? <SpmIcon name="check" className="text-sm" /> : null}
                  </div>
                ))}
              </div>
              <p className="spm-label-sm text-white/80">Sample card shown — yours updates automatically when you shop.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative h-64 overflow-hidden rounded-lg border-2 border-[var(--spm-outline-variant)] shadow-md">
              <SpmImg
                src={SPM_IMG.faq.rewards}
                alt="Frequent Barker loyalty card illustration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-6">
              <h3 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Paws Points</h3>
              <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                Earn <strong className="text-[var(--spm-primary)]">1 point per $1</strong> spent. Stack 100 points for{" "}
                <strong className="text-[var(--spm-primary)]">$10 market credit</strong> on your pet&apos;s favorites.
                Points never expire while your account stays active.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-8 md:p-12">
          <h2 className="spm-headline-lg mb-8 text-center text-[var(--spm-primary)]">Member Perks</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SPM_REWARDS_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <SpmIcon name="check_circle" className="text-[var(--spm-secondary)]" fill />
                <span className="spm-body-md text-[var(--spm-on-surface)]">{perk}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="text-center">
          {isLoggedIn ? (
            <>
              <p className="spm-body-lg mb-6 text-[var(--spm-on-surface-variant)]">
                You&apos;re already in the pack! View your punch card, order history, and saved addresses on your profile.
              </p>
              <Link
                href={SPM_PATHS.account}
                className="spm-coupon-button spm-headline-md inline-block rounded-lg bg-[var(--spm-primary)] px-10 py-4 text-[var(--spm-on-primary)] shadow-[4px_4px_0px_#003636] hover:bg-[var(--spm-primary-container)]"
              >
                Go to My Profile
              </Link>
            </>
          ) : (
            <>
              <p className="spm-body-lg mb-6 text-[var(--spm-on-surface-variant)]">
                Ready to start earning? Join free and get 50 Paws Points on signup.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <Link
                  href={`${SPM_PATHS.login}#register`}
                  className="spm-coupon-button spm-headline-md rounded-lg bg-[var(--spm-tertiary)] px-10 py-4 text-[var(--spm-on-tertiary)] shadow-[4px_4px_0px_#5e0b34] hover:bg-[var(--spm-tertiary-container)]"
                >
                  Join the Pack
                </Link>
                <Link
                  href={SPM_PATHS.login}
                  className="spm-headline-md font-semibold text-[var(--spm-secondary)] underline decoration-4 decoration-[var(--spm-tertiary)] underline-offset-4 hover:text-[var(--spm-primary)]"
                >
                  Already a member? Sign In
                </Link>
              </div>
            </>
          )}
        </section>
      </SpmContainer>
    </main>
  );
}
