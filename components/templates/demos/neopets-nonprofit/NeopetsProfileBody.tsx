import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/templates/demos/neopets-nonprofit/neopetsConfig";

const fieldClass =
  "mt-1 w-full rounded-xl border-2 border-[#c0c7cf] bg-[#f0e7db] px-4 py-3 text-base text-[#40484e] outline-none disabled:cursor-not-allowed";

export function NeopetsProfileBody() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-16">
      <div className="mb-10 text-center">
        <span className="material-symbols-outlined text-5xl text-[#0d658c] sm:text-6xl">person</span>
        <h1
          className="mt-3 text-3xl font-bold text-[#0d658c] sm:text-4xl"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Your profile
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#40484e]">
          Demo placeholders only—there is no login, registration, or saved data. When a real product ships, this is
          where members would sign in or create an account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <section
          className="rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-lg sm:p-8"
          aria-labelledby="np-profile-login-heading"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#745b00]">Placeholder</p>
          <h2
            id="np-profile-login-heading"
            className="mt-1 text-2xl font-bold text-[#0d658c]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Log in
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#40484e]">
            Returning fosters and adopters would sign in here (email + password, magic link, or SSO—TBD).
          </p>
          <form className="mt-6 space-y-4" aria-label="Log in (demo placeholder)">
            <div>
              <label htmlFor="np-profile-login-email" className="text-sm font-semibold text-[#1f1b14]">
                Email
              </label>
              <input
                id="np-profile-login-email"
                type="email"
                name="np-profile-login-email"
                autoComplete="off"
                disabled
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="np-profile-login-password" className="text-sm font-semibold text-[#1f1b14]">
                Password
              </label>
              <input
                id="np-profile-login-password"
                type="password"
                name="np-profile-login-password"
                autoComplete="off"
                disabled
                placeholder="••••••••"
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              disabled
              className="np-squish-btn w-full rounded-xl border-b-4 border-[#004c6b] bg-[#0d658c] py-3.5 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Log in (not available in demo)
            </button>
          </form>
        </section>

        <section
          className="rounded-[24px] border-2 border-dashed border-[#2e6b29]/50 bg-[#fcf2e6] p-6 shadow-inner sm:p-8"
          aria-labelledby="np-profile-register-heading"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#745b00]">Placeholder</p>
          <h2
            id="np-profile-register-heading"
            className="mt-1 text-2xl font-bold text-[#2e6b29]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Register
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#40484e]">
            New volunteers and adopters would create an account, verify email, and set preferences—none of that runs in
            this static preview.
          </p>
          <form className="mt-6 space-y-4" aria-label="Register (demo placeholder)">
            <div>
              <label htmlFor="np-profile-register-name" className="text-sm font-semibold text-[#1f1b14]">
                Full name
              </label>
              <input
                id="np-profile-register-name"
                type="text"
                name="np-profile-register-name"
                autoComplete="off"
                disabled
                placeholder="Alex River"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="np-profile-register-email" className="text-sm font-semibold text-[#1f1b14]">
                Email
              </label>
              <input
                id="np-profile-register-email"
                type="email"
                name="np-profile-register-email"
                autoComplete="off"
                disabled
                placeholder="alex@example.com"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="np-profile-register-password" className="text-sm font-semibold text-[#1f1b14]">
                Password
              </label>
              <input
                id="np-profile-register-password"
                type="password"
                name="np-profile-register-password"
                autoComplete="off"
                disabled
                placeholder="Choose a strong password"
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-xl border-b-4 border-[#135212] bg-[#2e6b29] py-3.5 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create account (not available in demo)
            </button>
          </form>
        </section>
      </div>

      <p className="mt-10 text-center text-sm text-[#40484e]">
        Explore the demo:{" "}
        <Link href={NEOPETS_PATHS.quests} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Quests
        </Link>
        {" · "}
        <Link
          href={NEOPETS_PATHS.volunteers}
          className="font-semibold text-[#0d658c] underline-offset-2 hover:underline"
        >
          Volunteers &amp; donate
        </Link>
        .
      </p>
    </main>
  );
}
