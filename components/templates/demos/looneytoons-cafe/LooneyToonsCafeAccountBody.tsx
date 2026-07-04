"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LT_ACCOUNT_DEMO,
  LT_CONTACT_INFO,
  LT_ORDER_HISTORY,
  formatLtOrderTotal,
} from "./looneytoonsCafeAccountData";
import { isLtAdminUser, LT_PATHS } from "./looneytoonsCafeConfig";
import { calcStarProgressPercent } from "./looneytoonsCafeRewardsData";
import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import {
  isLooneyToonsCafeAdmin,
  useLooneyToonsCafeAuth,
  useLooneyToonsCafeRequireAuth,
} from "./LooneyToonsCafeAuthContext";

export function LooneyToonsCafeAccountBody() {
  const { hydrated } = useLooneyToonsCafeRequireAuth();
  const { logout, user } = useLooneyToonsCafeAuth();
  const { starBalance } = useLooneyToonsCart();
  const router = useRouter();

  const displayName = user?.name ?? "Member";
  const favoriteDrink = user?.favorite_drink ?? "Your usual";
  const email = user?.email ?? "";
  const isAdmin = isLooneyToonsCafeAdmin(user) || isLtAdminUser(user?.email);
  const progress = calcStarProgressPercent(starBalance);
  const punches = Array.from({ length: LT_ACCOUNT_DEMO.punchTotal }, (_, i) => i < LT_ACCOUNT_DEMO.punchCount);

  if (!hydrated) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center bg-[#f9f9ff] px-4 py-20">
        <p className="text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
          Loading account…
        </p>
      </main>
    );
  }

  async function handleSignOut() {
    await logout();
    router.push(LT_PATHS.login);
  }

  const contactRows = LT_CONTACT_INFO.map((row) =>
    row.id === "email" && email ? { ...row, lines: [email] } : row,
  );

  return (
    <main className="bg-[#f9f9ff] px-4 py-12 text-[#151c28] md:px-16 md:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="relative overflow-hidden border-4 border-[#151c28] bg-[#e9edff] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              {isAdmin ? (
                <span className="mb-3 inline-block rounded-full border-2 border-[#151c28] bg-[#151c28] px-3 py-1 text-xs font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Demo admin
                </span>
              ) : null}
              <h1 className="font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-3xl md:text-4xl">
                Hey, {displayName}!
              </h1>
              <p className="mt-2 max-w-lg text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Comet Streak member · go-to order: <strong>{favoriteDrink}</strong>. Guest checkout
                still works — this account tracks your stars and demo order history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[#151c28] bg-white px-5 py-2 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif] hover:bg-[#f9f9ff]"
            >
              <span className="material-symbols-outlined text-base" aria-hidden>
                logout
              </span>
              Sign out
            </button>
          </div>
          {isAdmin ? (
            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
              <Link
                href={LT_PATHS.menu}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#151c28] bg-[#495E84] px-5 py-2 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                <span className="material-symbols-outlined text-base" aria-hidden>
                  coffee
                </span>
                Browse menu (demo)
              </Link>
              <Link
                href={LT_PATHS.rewards}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#151c28] px-5 py-2 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                View rewards tiers
              </Link>
            </div>
          ) : null}
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#495E84]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                  stars
                </span>
                <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-xl">
                  Comet Streak rewards
                </h2>
              </div>
              <span className="rounded-full border-2 border-[#151c28] bg-[#e9edff] px-3 py-1 text-xs font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                {starBalance} stars
              </span>
            </div>
            <div className="relative mb-4 h-8 w-full overflow-hidden rounded-full border-4 border-[#151c28] bg-[#dde2f4]">
              <div
                className="h-full border-r-4 border-[#151c28] bg-[#495E84] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {punches.map((punched, i) => (
                <div
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#151c28] text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif] ${
                    punched ? "bg-[#495E84] text-white" : "bg-[#f9f9ff] text-[#444748]"
                  }`}
                >
                  {punched ? (
                    <span className="material-symbols-outlined text-sm" aria-hidden>
                      check
                    </span>
                  ) : (
                    i + 1
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              {LT_ACCOUNT_DEMO.nextRewardHint}.{" "}
              <Link href={LT_PATHS.rewards} className="font-bold text-[#495E84] underline">
                See all reward tiers
              </Link>
            </p>
          </section>

          <section className="border-4 border-[#151c28] bg-[#151c28] p-6 text-[#f9f9ff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-5">
            <h2 className="mb-4 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-xl">
              Quick links
            </h2>
            <ul className="space-y-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif]">
              <li>
                <Link href={LT_PATHS.menu} className="font-bold underline hover:opacity-80">
                  Order from the menu
                </Link>
              </li>
              <li>
                <Link href={LT_PATHS.rewards} className="font-bold underline hover:opacity-80">
                  Redeem stars
                </Link>
              </li>
              <li>
                <Link href={LT_PATHS.checkout} className="font-bold underline hover:opacity-80">
                  View cart / checkout
                </Link>
              </li>
            </ul>
          </section>

          <section className="overflow-hidden border-4 border-[#151c28] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-12">
            <div className="flex items-center justify-between border-b-2 border-[#151c28] p-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#495E84]" aria-hidden>
                  history
                </span>
                <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-xl">
                  Order history
                </h2>
              </div>
              <span className="text-xs text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Demo data
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#151c28] bg-[#e9edff] text-xs uppercase tracking-wider text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    {["Order", "Date", "Items", "Total", "Status"].map((h) => (
                      <th key={h} className="px-6 py-3 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LT_ORDER_HISTORY.map((order) => (
                    <tr key={order.id} className="border-b border-[#dde2f4] hover:bg-[#f9f9ff]">
                      <td className="px-6 py-4 font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        {order.items}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        {formatLtOrderTotal(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border-2 border-[#151c28] bg-[#e9edff] px-3 py-1 text-xs font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="lg:col-span-12">
            <h2 className="mb-4 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-xl">
              Contact information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {contactRows.map((row) => (
                <div
                  key={row.id}
                  className="border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#495E84]" aria-hidden>
                      {row.icon}
                    </span>
                    {row.primary ? (
                      <span className="rounded-full border-2 border-[#151c28] bg-[#495E84] px-2 py-0.5 text-[10px] font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        PRIMARY
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mb-2 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                    {row.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    {row.lines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
