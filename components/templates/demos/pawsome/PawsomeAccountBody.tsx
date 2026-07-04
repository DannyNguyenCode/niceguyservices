"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_ACCOUNT_ACTIVITY, PS_ACCOUNT_PETS, PS_SUBSCRIPTIONS } from "./pawsomeData";
import { PawsomeOrderLoadingState } from "./PawsomeOrderLoadingState";
import { usePawsomeAuth, usePawsomeRequireAuth } from "./PawsomeAuthContext";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

const PET_HREFS = {
  shopLuna: PS_PATHS.shopLuna,
  shop: PS_PATHS.shop,
} as const;

export function PawsomeAccountBody() {
  const router = useRouter();
  const { hydrated } = usePawsomeRequireAuth();
  const { user, logout } = usePawsomeAuth();
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    if (user) setGreeting(getGreeting(user.name));
  }, [user]);

  if (!hydrated) {
    return (
      <PawsomeOrderLoadingState
        title="Loading your account"
        message="Fetching your profile and rewards details."
      />
    );
  }

  if (!user) return null;

  async function handleSignOut() {
    await logout();
    router.push(PS_PATHS.login);
  }

  const subscription = PS_SUBSCRIPTIONS[0];

  return (
    <main className="py-10">
      <PsPageWrap>
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1
              className="text-3xl font-bold text-[var(--ps-primary)] md:text-5xl"
              style={headline}
            >
              {greeting}
            </h1>
            <p className="mt-2 text-lg text-[var(--ps-on-surface-variant)]">
              Managing wellness for {user.pet_name} and your furry family.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-xl border border-[var(--ps-outline-variant)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--ps-primary)]"
            >
              Sign out
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#F3F3F3] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--ps-primary)] transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Account Settings
            </button>
            <button
              type="button"
              className="rounded-xl bg-[var(--ps-primary)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--ps-on-primary)] transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Support
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <h2 className="mb-6 text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
              Your Furry Family
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {PS_ACCOUNT_PETS.map((pet) => (
                <Link
                  key={pet.name}
                  href={PET_HREFS[pet.hrefKey]}
                  className="group overflow-hidden rounded-xl bg-white shadow-[var(--ps-shadow)] transition-all hover:scale-[1.01] hover:shadow-[var(--ps-shadow-lg)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pet.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--ps-secondary)] shadow-sm backdrop-blur">
                      {pet.species}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                      {pet.name}
                    </h3>
                    <p className="mt-1 text-[var(--ps-on-surface-variant)]">{pet.detail}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                        <div
                          className="h-full rounded-full bg-[var(--ps-secondary)]"
                          style={{ width: `${pet.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-[var(--ps-on-surface-variant)]">
                        {pet.progress}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">{pet.progressLabel}</p>
                  </div>
                </Link>
              ))}
              <Link
                href={PS_PATHS.accountAddPet}
                className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--ps-outline-variant)] p-6 transition-colors hover:border-[var(--ps-primary)]"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ps-surface-container-low)] transition-colors group-hover:bg-[var(--ps-primary-container)]">
                  <PsIcon name="add" className="text-3xl text-[var(--ps-on-surface-variant)]" />
                </div>
                <p className="text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                  Add New Pet
                </p>
                <p className="mt-2 px-4 text-center text-sm text-[var(--ps-on-surface-variant)]">
                  Scalable for exotic pets, birds, and more.
                </p>
              </Link>
            </div>
          </section>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="relative overflow-hidden rounded-xl bg-[var(--ps-primary)] p-8 text-[var(--ps-on-primary)] shadow-xl">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <PsIcon name="cake" filled className="text-[var(--ps-secondary-container)]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-[var(--ps-secondary-container)]">
                    Upcoming Milestone
                  </span>
                </div>
                <h3 className="mb-2 text-2xl font-semibold" style={headline}>
                  Luna&apos;s 2nd Birthday
                </h3>
                <p className="mb-6 text-sm text-[var(--ps-on-primary-container)]">
                  In just 5 days! Celebrate with a special treat from us.
                </p>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <p className="mb-1 text-xs opacity-80">Your exclusive gift:</p>
                  <p className="text-xl font-semibold" style={headline}>
                    20% OFF ALL TREATS
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[var(--ps-secondary)] opacity-30 blur-[80px]" />
            </div>

            {subscription ? (
              <div className="rounded-xl bg-white p-6 shadow-[var(--ps-shadow)]">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                      Subscription
                    </h4>
                    <p className="text-[var(--ps-on-surface-variant)]">Luna&apos;s Premium Kibble</p>
                  </div>
                  <span className="rounded-lg bg-[var(--ps-surface-container-low)] p-2">
                    <PsIcon name="local_shipping" className="text-[var(--ps-primary)]" />
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-lowest)] p-4">
                  <div>
                    <p className="text-xs text-[var(--ps-on-surface-variant)]">Next Auto-Ship</p>
                    <p className="font-semibold text-[var(--ps-primary)]">Oct 12, 2024</p>
                  </div>
                  <Link href={PS_PATHS.subscriptions} className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline">
                    Manage
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="rounded-xl bg-white p-6 shadow-[var(--ps-shadow)]">
              <h4 className="mb-6 text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { href: PS_PATHS.accountOrders, icon: "receipt_long", label: "Orders" },
                  { href: PS_PATHS.subscriptions, icon: "calendar_today", label: "Subs" },
                  { href: PS_PATHS.shop, icon: "favorite", label: "Favorites" },
                  { href: PS_PATHS.account, icon: "home_pin", label: "Addresses" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-center justify-center rounded-xl bg-[var(--ps-surface-container-low)] p-4 transition-colors hover:bg-[var(--ps-surface-container-high)]"
                  >
                    <PsIcon
                      name={action.icon}
                      className="mb-2 text-[var(--ps-primary)] transition-transform group-hover:scale-110"
                    />
                    <span className="text-xs font-semibold text-[var(--ps-primary)]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {PS_ACCOUNT_ACTIVITY.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border-l-4 p-6 shadow-sm backdrop-blur-md ${
                  item.borderTone === "secondary"
                    ? "border-l-[var(--ps-secondary)] bg-[color-mix(in_srgb,white_70%,transparent)]"
                    : "border-l-[var(--ps-tertiary-fixed-dim)] bg-[color-mix(in_srgb,white_70%,transparent)]"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      item.iconTone === "secondary"
                        ? "bg-[color-mix(in_srgb,var(--ps-secondary)_10%,transparent)] text-[var(--ps-secondary)]"
                        : "bg-[color-mix(in_srgb,var(--ps-tertiary-fixed)_30%,transparent)] text-[var(--ps-on-tertiary-fixed-variant)]"
                    }`}
                  >
                    <PsIcon name={item.icon} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ps-primary)]">{item.title}</p>
                    <p className="text-sm text-[var(--ps-on-surface-variant)]">{item.detail}</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[var(--ps-on-surface-variant)]">
                  {item.when}
                </span>
              </div>
            ))}
          </div>
        </section>
      </PsPageWrap>
    </main>
  );
}
