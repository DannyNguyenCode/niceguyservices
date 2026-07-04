"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoyaltyProgress } from "./LoyaltyProgress";
import { AchievementBadge } from "./AchievementBadge";
import { RecommendationCarousel } from "./RecommendationCarousel";
import {
  CP_ACHIEVEMENTS,
  CP_LOYALTY,
  CP_PET_PROFILE,
  CP_PRODUCTS,
  CP_RECENT_ORDERS,
} from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";
import { CompanionPetOrderLoadingState } from "./CompanionPetOrderLoadingState";
import { useCompanionPetAuth, useCompanionPetRequireAuth } from "./CompanionPetAuthContext";

export function CompanionPetAccountBody() {
  const router = useRouter();
  const { hydrated } = useCompanionPetRequireAuth();
  const { user, logout } = useCompanionPetAuth();

  if (!hydrated) {
    return (
      <CompanionPetOrderLoadingState
        title="Loading your account"
        message="Fetching your profile and rewards details."
      />
    );
  }

  if (!user) return null;

  async function handleSignOut() {
    await logout();
    router.push(CP_PATHS.login);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-blue)]">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--cp-charcoal)]">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--cp-slate)]">
            {CP_LOYALTY.level} member · {user.pet_name}&apos;s companion
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="rounded-2xl border border-[var(--cp-border)] px-5 py-2.5 text-sm font-semibold text-[var(--cp-slate)] hover:text-[var(--cp-charcoal)]"
          >
            Sign out
          </button>
          <Link
            href={CP_PATHS.shop}
            className="rounded-2xl bg-[var(--cp-blue)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LoyaltyProgress />

          <section className="cp-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent orders</h2>
              <Link href={CP_PATHS.shop} className="text-sm text-[var(--cp-blue)]">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-[var(--cp-border)]">
              {CP_RECENT_ORDERS.map((o) => (
                 <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-4 first:pt-0">
                  <div>
                    <p className="text-sm font-medium">{o.id}</p>
                    <p className="text-xs text-[var(--cp-slate)]">
                      {o.date} · {o.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${o.total.toFixed(2)}</p>
                    <p className="text-xs text-[var(--cp-green)]">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">Recommended for you</h2>
            <RecommendationCarousel products={CP_PRODUCTS.filter((p) => p.recommended)} />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="cp-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Saved pets</h2>
            <div className="mt-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CP_PET_PROFILE.avatar}
                alt=""
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white"
              />
              <div>
                <p className="font-semibold">{user.pet_name || CP_PET_PROFILE.name}</p>
                <p className="text-xs text-[var(--cp-slate)]">{CP_PET_PROFILE.type}</p>
              </div>
            </div>
            <button type="button" className="mt-4 w-full rounded-xl border border-[var(--cp-border)] py-2 text-sm">
              Add another pet
            </button>
          </div>

          <section className="cp-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Achievements</h2>
            <div className="mt-3 space-y-2">
              {CP_ACHIEVEMENTS.filter((a) => a.unlocked)
                .slice(0, 3)
                .map((a) => (
                  <AchievementBadge key={a.id} achievement={a} compact />
                ))}
            </div>
            <Link href={CP_PATHS.rewards} className="mt-3 block text-sm text-[var(--cp-blue)]">
              View all →
            </Link>
          </section>

          <div className="cp-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Subscriptions</h2>
            <p className="mt-2 text-sm text-[var(--cp-slate)]">Calming Hemp Chews · Every 4 weeks</p>
            <p className="text-xs text-[var(--cp-green)]">Next ship: Jun 2, 2026</p>
            <button type="button" className="mt-4 text-sm font-medium text-[var(--cp-blue)]">
              Manage subscription
            </button>
          </div>

          <div className="cp-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Saved addresses</h2>
            <p className="mt-2 text-sm text-[var(--cp-slate)]">420 Wellness Way, Toronto, ON M5V 3K2</p>
            <button type="button" className="mt-3 text-sm font-medium text-[var(--cp-blue)]">
              Edit addresses
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
