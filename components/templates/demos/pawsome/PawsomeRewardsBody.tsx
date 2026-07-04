"use client";

import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_POINTS } from "./pawsomeData";
import { usePawsomeAuth } from "./PawsomeAuthContext";
import { PsIcon, PsPageWrap, PsPrimaryButton, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const ACHIEVEMENTS = [
  { id: "1", icon: "shopping_cart", label: "First Purchase", unlocked: true },
  { id: "2", icon: "favorite", label: "Pet Lover", unlocked: true },
  { id: "3", icon: "local_shipping", label: "Fast Paws", unlocked: false },
];

const REWARD_LANE = [
  { level: 1, label: "Welcome Treat", unlocked: true },
  { level: 2, label: "Free Shipping", unlocked: true },
  { level: 3, label: "15% Off", current: true },
  { level: 4, label: "VIP Box", locked: true },
];

const ACTIVITY = [
  { label: "Earned 50 pts", detail: "Read nutrition guide", time: "2 days ago" },
  { label: "Redeemed reward", detail: "Free shipping coupon", time: "1 week ago" },
  { label: "Level up", detail: "Reached Silver tier", time: "2 weeks ago" },
];

export function PawsomeRewardsBody() {
  const { isLoggedIn } = usePawsomeAuth();

  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
            Rewards dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--ps-primary)] md:text-4xl" style={headline}>
            Your Pawsome progression
          </h1>
          {!isLoggedIn ? (
            <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)] px-4 py-3 text-sm text-[var(--ps-on-surface-variant)]">
              Preview mode —{" "}
              <Link href={PS_PATHS.login} className="font-semibold text-[var(--ps-secondary)] underline">
                sign in
              </Link>{" "}
              or{" "}
              <Link href={`${PS_PATHS.login}#register`} className="font-semibold text-[var(--ps-secondary)] underline">
                create an account
              </Link>{" "}
              to earn and redeem Pawsome Points.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="rounded-xl bg-[var(--ps-surface-container-lowest)] p-8 shadow-[var(--ps-shadow)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[var(--ps-surface-container-low)]">
                  <span className="text-3xl font-bold text-[var(--ps-secondary)]" style={headline}>
                    {PS_POINTS.progress}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--ps-on-surface-variant)]">
                    {PS_POINTS.tier} · {PS_POINTS.balance.toLocaleString()} points
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                    {PS_POINTS.pointsToNext} pts to {PS_POINTS.nextTier}
                  </h2>
                  <PsProgressBar value={PS_POINTS.progress} className="mt-4" height="h-3" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                Reward lane
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 ps-hide-scrollbar">
                {REWARD_LANE.map((tier) => (
                  <div
                    key={tier.level}
                    className={`min-w-[140px] rounded-xl p-5 ${
                      tier.current
                        ? "bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)]"
                        : tier.unlocked
                          ? "bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]"
                          : "bg-[var(--ps-surface-container-high)] opacity-60"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase">Lvl {tier.level}</p>
                    <p className="mt-2 font-semibold" style={headline}>
                      {tier.label}
                    </p>
                    {tier.locked ? <PsIcon name="lock" className="mt-2" /> : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
              <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                Achievements
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {ACHIEVEMENTS.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl p-4 text-center ${
                      a.unlocked
                        ? "bg-[color-mix(in_srgb,var(--ps-secondary-container)_10%,transparent)]"
                        : "bg-[var(--ps-surface-container-low)] opacity-50"
                    }`}
                  >
                    <PsIcon
                      name={a.icon}
                      filled={a.unlocked}
                      className={`text-3xl ${a.unlocked ? "text-[var(--ps-secondary)]" : "text-[var(--ps-on-surface-variant)]"}`}
                    />
                    <p className="mt-2 text-sm font-semibold text-[var(--ps-primary)]">{a.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
              <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                Recent activity
              </h2>
              <ul className="mt-4 space-y-4">
                {ACTIVITY.map((act) => (
                  <li key={act.label} className="border-l-2 border-[var(--ps-secondary-container)] pl-4">
                    <p className="text-sm font-semibold text-[var(--ps-primary)]">{act.label}</p>
                    <p className="text-xs text-[var(--ps-on-surface-variant)]">{act.detail}</p>
                    <p className="mt-1 text-[10px] text-[var(--ps-on-surface-variant)]">{act.time}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl bg-[var(--ps-secondary-fixed)] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-on-secondary-fixed)]">
                Points balance
              </p>
              <p className="mt-2 text-4xl font-bold text-[var(--ps-primary)]" style={headline}>
                {PS_POINTS.balance.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-[var(--ps-on-secondary-fixed-variant)]">
                100 pts = $1 off at checkout
              </p>
              <PsPrimaryButton href={PS_PATHS.shop} className="mt-4 w-full">
                Shop to earn
              </PsPrimaryButton>
            </div>
            <div className="rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
              <h3 className="font-semibold text-[var(--ps-primary)]" style={headline}>
                Refer a friend
              </h3>
              <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
                Earn 200 bonus points when they complete their first order.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-[var(--ps-outline-variant)] py-3 text-sm font-semibold text-[var(--ps-primary)]"
              >
                Copy invite link
              </button>
            </div>
          </aside>
        </div>

        {!isLoggedIn ? (
          <section className="mt-16 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)] p-8 text-center">
            <h2 className="text-xl font-bold text-[var(--ps-primary)]" style={headline}>
              Unlock Pawsome Rewards
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--ps-on-surface-variant)]">
              Sign in or create an account to earn points, redeem at checkout, and unlock your reward lane.
              Guest checkout is always available.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`${PS_PATHS.login}#register`}
                className="rounded-xl bg-[var(--ps-primary)] px-8 py-4 text-sm font-semibold text-[var(--ps-on-primary)]"
              >
                Create account
              </Link>
              <Link
                href={PS_PATHS.login}
                className="rounded-xl border border-[var(--ps-outline-variant)] px-8 py-4 text-sm font-semibold text-[var(--ps-primary)]"
              >
                Sign in
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-16 rounded-xl bg-[var(--ps-surface-container-lowest)] p-8 text-center shadow-[var(--ps-shadow)]">
            <p className="text-sm text-[var(--ps-on-surface-variant)]">
              You&apos;re earning Pawsome Points with every order. Track progress on your account.
            </p>
            <Link
              href={PS_PATHS.account}
              className="mt-4 inline-block rounded-xl bg-[var(--ps-secondary)] px-8 py-4 text-sm font-semibold text-[var(--ps-on-secondary)]"
            >
              Go to account
            </Link>
          </section>
        )}
      </PsPageWrap>
    </main>
  );
}
