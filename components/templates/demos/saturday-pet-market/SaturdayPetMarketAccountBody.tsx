"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPM_PATHS, isSpmAdminUsername } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import {
  SPM_ACCOUNT_USER,
  SPM_ORDER_HISTORY,
  SPM_SAVED_ADDRESSES,
  SPM_SAVED_CARTS,
  formatSpmPrice,
} from "./saturdayPetMarketData";
import { useSpmAuth, useSpmRequireAuth } from "./SaturdayPetMarketAuthContext";
import { SpmCategorySidebar } from "./SaturdayPetMarketSidebar";
import { SaturdayPetMarketSpecialistFab } from "./SaturdayPetMarketSpecialistFab";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketAccountBody() {
  const { hydrated } = useSpmRequireAuth();
  const { logout, user } = useSpmAuth();
  const router = useRouter();
  const mockUser = SPM_ACCOUNT_USER;
  const displayName = user?.name ?? mockUser.name;
  const isAdmin = isSpmAdminUsername(user?.email) || user?.role === "admin";
  const punches = Array.from({ length: mockUser.punchTotal }, (_, i) => i < mockUser.punchCount);

  if (!hydrated) return null;

  async function handleSignOut() {
    await logout();
    router.push(SPM_PATHS.login);
  }

  return (
    <>
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer className="flex flex-col gap-6 md:flex-row">
          <SpmCategorySidebar />
          <section className="min-w-0 flex-1 space-y-12">
            <div className="relative overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-8 shadow-sm">
              <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--spm-secondary)] shadow-md">
                    <SpmImg src={SPM_IMG.account.avatar} alt="Account profile portrait" fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="spm-headline-xl mb-1 text-[var(--spm-primary)]">Howdy, {displayName}!</h1>
                    <p className="spm-body-lg text-[var(--spm-on-surface-variant)]">
                      Welcome back to the Saturday Morning neighborhood. Your pets have been missing you!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] px-5 py-2 font-bold text-[var(--spm-secondary)] transition-colors hover:border-[var(--spm-secondary)] hover:bg-[var(--spm-secondary-fixed)]"
                >
                  <SpmIcon name="logout" />
                  Sign Out
                </button>
              </div>
              {isAdmin ? (
                <Link
                  href={SPM_PATHS.inventory}
                  className="relative z-10 mt-4 inline-flex items-center gap-2 self-start rounded-full bg-[var(--spm-primary)] px-5 py-2 font-bold text-[var(--spm-on-primary)] shadow-md md:mt-0"
                >
                  <SpmIcon name="inventory_2" />
                  Manage Inventory
                </Link>
              ) : null}
              <SpmIcon
                name="pets"
                fill
                className="absolute -bottom-8 -right-8 text-[160px] opacity-10 text-[var(--spm-on-surface)]"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="flex flex-col gap-6 rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-6 shadow-md md:col-span-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SpmIcon name="stars" fill className="text-[var(--spm-secondary)]" />
                    <h3 className="spm-headline-md text-[var(--spm-on-surface)]">Digital Loyalty Card</h3>
                  </div>
                  <span className="spm-label-sm rounded-full bg-[var(--spm-secondary)] px-3 py-1 text-[var(--spm-on-secondary)]">
                    {mockUser.punchCount} / {mockUser.punchTotal} PUNCHES
                  </span>
                </div>
                <div className="relative flex flex-wrap justify-center gap-6 overflow-hidden rounded-xl border border-dashed border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] p-6">
                  {punches.map((punched, i) => (
                    <div key={i} className={`spm-punch-card-slot ${punched ? "punched" : ""}`}>
                      {punched ? <SpmIcon name="check" className="text-sm" /> : null}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[var(--spm-tertiary-container)] p-3 text-[var(--spm-on-tertiary-container)]">
                  <p className="spm-body-md font-medium">Next Punch: {mockUser.nextPunchHint}</p>
                  <Link href={SPM_PATHS.rewards} className="font-bold underline hover:opacity-80">
                    View Rewards Store
                  </Link>
                </div>
              </div>

              <div className="relative flex flex-col gap-6 overflow-hidden rounded-lg border border-[var(--spm-outline)] bg-[var(--spm-primary)] p-6 text-[var(--spm-on-primary)] shadow-md md:col-span-4">
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-3">
                    <SpmIcon name="shopping_bag" fill />
                    <h3 className="spm-headline-md">Saved Carts</h3>
                  </div>
                  <div className="space-y-2">
                    {SPM_SAVED_CARTS.map((cart) => (
                      <div
                        key={cart.name}
                        className="spm-hover-press cursor-pointer rounded-lg border border-white/10 bg-[var(--spm-on-primary-fixed-variant)]/20 p-3"
                      >
                        <p className="text-sm font-bold">{cart.name}</p>
                        <p className="text-xs opacity-80">
                          {cart.items} items • {formatSpmPrice(cart.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="mt-6 w-full rounded-full bg-[var(--spm-on-primary)] py-2 font-bold text-[var(--spm-primary)] hover:bg-[var(--spm-primary-fixed)]">
                    Start New Cart
                  </button>
                </div>
                <SpmIcon name="fastfood" className="absolute -bottom-4 -right-4 text-[100px] opacity-20" />
              </div>

              <div className="relative rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-background)] p-6 shadow-sm md:col-span-12">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SpmIcon name="history" fill className="text-[var(--spm-secondary)]" />
                    <h3 className="spm-headline-md">Recent Order History</h3>
                  </div>
                  <button type="button" className="font-bold text-[var(--spm-primary)] hover:underline">
                    See All Orders
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--spm-outline-variant)] text-[var(--spm-on-surface-variant)]">
                        {["Order ID", "Date", "Items", "Total", "Status", ""].map((h) => (
                          <th key={h} className="spm-label-sm py-2 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--spm-outline-variant)]/30">
                      {SPM_ORDER_HISTORY.map((order) => (
                        <tr key={order.id} className="transition-colors hover:bg-[var(--spm-surface-container-low)]">
                          <td className="py-4 font-bold text-[var(--spm-primary)]">#{order.id}</td>
                          <td className="py-4">{order.date}</td>
                          <td className="py-4">{order.items}</td>
                          <td className="py-4">
                            <div className="inline-flex items-center rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] px-3 py-1">
                              <span className="mr-2 h-2 w-2 rounded-full bg-[var(--spm-primary)]" />
                              <span className="spm-label-price text-sm">{formatSpmPrice(order.total)}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-white shadow-md transition-transform hover:scale-110"
                            >
                              <SpmIcon name="reorder" className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:col-span-12 md:grid-cols-3">
                {SPM_SAVED_ADDRESSES.map((addr) => (
                  <div
                    key={addr.id}
                    className="group cursor-pointer rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-6 shadow-sm transition-colors hover:border-[var(--spm-secondary)]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <SpmIcon name={addr.icon} fill={addr.primary} className="text-[var(--spm-secondary)]" />
                      {addr.primary ? (
                        <span className="rounded bg-[var(--spm-secondary)]/10 px-1 text-[10px] font-bold text-[var(--spm-secondary)]">
                          PRIMARY
                        </span>
                      ) : null}
                    </div>
                    <h4 className="spm-headline-md mb-1 text-sm">{addr.label}</h4>
                    <p className="text-xs leading-relaxed text-[var(--spm-on-surface-variant)]">
                      {addr.lines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    <div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" className="text-xs font-bold text-[var(--spm-primary)] hover:underline">
                        Edit
                      </button>
                      <button type="button" className="text-xs font-bold text-[var(--spm-error)] hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--spm-outline-variant)] p-6 transition-colors hover:bg-[var(--spm-surface-container-high)]"
                >
                  <SpmIcon name="add_circle" className="text-xl text-[var(--spm-outline-variant)]" />
                  <span className="spm-headline-md text-sm text-[var(--spm-outline-variant)]">Add New Address</span>
                </button>
              </div>
            </div>
          </section>
        </SpmContainer>
      </main>
      <SaturdayPetMarketSpecialistFab icon="help" label="Howdy! Need Help?" />
    </>
  );
}
