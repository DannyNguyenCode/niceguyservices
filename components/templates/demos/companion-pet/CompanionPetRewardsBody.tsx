"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedCounter } from "./AnimatedCounter";
import { AchievementBadge } from "./AchievementBadge";
import { LoyaltyProgress } from "./LoyaltyProgress";
import { RecommendationCarousel } from "./RecommendationCarousel";
import {
  CP_ACHIEVEMENTS,
  CP_ACTIVITY,
  CP_LOYALTY,
  CP_PRODUCTS,
} from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";
import { useCompanionPetAuth } from "./CompanionPetAuthContext";

export function CompanionPetRewardsBody() {
  const { isLoggedIn } = useCompanionPetAuth();
  const nextUnlock = CP_ACHIEVEMENTS.find((a) => !a.unlocked);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-orange)]">Rewards dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--cp-charcoal)]">Your companion progression</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--cp-slate)]">
          Track XP, unlock achievements, and redeem points — structured like a premium loyalty program, not a game.
        </p>
        {!isLoggedIn ? (
          <p className="mt-4 rounded-xl bg-[var(--cp-blue-muted)] px-4 py-3 text-sm text-[var(--cp-blue)]">
            Preview mode —{" "}
            <Link href={CP_PATHS.login} className="font-semibold underline">
              sign in
            </Link>{" "}
            or{" "}
            <Link href={`${CP_PATHS.login}#register`} className="font-semibold underline">
              create an account
            </Link>{" "}
            to earn and redeem points.
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LoyaltyProgress />

          <section className="cp-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">Achievements</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {CP_ACHIEVEMENTS.map((a) => (
                <AchievementBadge key={a.id} achievement={a} />
              ))}
            </div>
          </section>

          <section className="cp-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">Activity timeline</h2>
            <ul className="mt-4 space-y-4">
              {CP_ACTIVITY.map((act, i) => (
                <motion.li
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 border-l-2 border-[var(--cp-warm-gray)] pl-4"
                >
                  <motion.div>
                    <p className="text-sm font-medium text-[var(--cp-charcoal)]">{act.label}</p>
                    <p className="text-xs text-[var(--cp-slate)]">{act.detail}</p>
                    <p className="mt-1 text-[10px] text-[var(--cp-slate)]">{act.time}</p>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="cp-card rounded-2xl bg-[var(--cp-orange-muted)] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-orange)]">Points balance</p>
            <p className="mt-2 text-4xl font-semibold text-[var(--cp-charcoal)]">
              <AnimatedCounter value={CP_LOYALTY.points} />
            </p>
            <p className="mt-2 text-sm text-[var(--cp-slate)]">
              Redeem at checkout · 100 pts = $1 off
            </p>
            <Link
              href={CP_PATHS.shop}
              className="mt-4 block rounded-xl bg-[var(--cp-charcoal)] py-3 text-center text-sm font-semibold text-white"
            >
              Shop to earn more
            </Link>
          </div>

          {nextUnlock ? (
            <div className="cp-card rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-blue)]">Next unlock</p>
              <AchievementBadge achievement={nextUnlock} compact />
            </div>
          ) : null}

          <div className="cp-card rounded-2xl p-6">
            <p className="text-sm font-semibold text-[var(--cp-charcoal)]">Purchase streak</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--cp-green)]">
              {CP_LOYALTY.streak} weeks
            </p>
            <p className="mt-1 text-xs text-[var(--cp-slate)]">Keep ordering to maintain bonus multipliers</p>
          </div>

          <motion.div className="cp-card rounded-2xl p-6">
            <p className="text-sm font-semibold text-[var(--cp-charcoal)]">Referral rewards</p>
            <p className="mt-2 text-xs leading-6 text-[var(--cp-slate)]">
              Invite a friend — you both earn 500 points when they complete their first order.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-[var(--cp-border)] py-2.5 text-sm font-medium"
            >
              Copy invite link
            </button>
          </motion.div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-[var(--cp-charcoal)]">Earn points on these picks</h2>
        <RecommendationCarousel products={CP_PRODUCTS.filter((p) => p.deal || p.recommended).slice(0, 4)} />
      </section>

      {!isLoggedIn ? (
        <section className="mt-16 rounded-2xl bg-[var(--cp-blue-muted)] p-8 text-center">
          <h2 className="text-xl font-semibold text-[var(--cp-charcoal)]">Unlock your rewards balance</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--cp-slate)]">
            Create a free account to earn points, redeem at checkout, and track achievements. You can still
            shop and checkout as a guest anytime.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`${CP_PATHS.login}#register`}
              className="rounded-2xl bg-[var(--cp-charcoal)] px-8 py-3 text-sm font-semibold text-white"
            >
              Create account
            </Link>
            <Link
              href={CP_PATHS.login}
              className="rounded-2xl border border-[var(--cp-border)] px-8 py-3 text-sm font-semibold"
            >
              Sign in
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-16 rounded-2xl bg-[var(--cp-green-muted)] p-8 text-center">
          <p className="text-sm text-[var(--cp-slate)]">
            You&apos;re earning points on every order. View your full dashboard on your account page.
          </p>
          <Link
            href={CP_PATHS.account}
            className="mt-4 inline-block rounded-2xl bg-[var(--cp-green)] px-8 py-3 text-sm font-semibold text-white"
          >
            Go to account
          </Link>
        </section>
      )}
    </main>
  );
}
