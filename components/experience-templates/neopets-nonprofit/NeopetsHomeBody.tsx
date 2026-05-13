import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPszyqsxY0AASZgcY8yMjPfAFcHzsFIhibL95B0dXvkPTNgqINYYnf4RdZbIbd2mV4Bha6j7TTf6y_zRQyYT7kMMWfBAcAQl6I__A0oyavp-9PAs8rcbgB7ufeoVKmLt8NI9jvughgr6UKy6FRjMREkPnL7zbb1RPSuUWMh93trzIAdXHq1xvNFGvy0LxVfTqjQ0E-DrohHVRJXLrtURcwPHdpLEqDijAY4E-10Vwx-jFsqql0zpzri75YvJOD492Fo-cEXLaO0u2d";

export function NeopetsHomeBody() {
  return (
    <main className="pb-8">
      <section className="relative overflow-hidden px-4 pb-12 pt-8 md:px-16">
        <div className="relative z-10">
          <h2
            className="mb-4 text-[28px] font-bold leading-9 text-[#0d658c] md:text-[32px] md:leading-10"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Every Rescue Story Starts With Compassion
          </h2>
          <p className="mb-8 max-w-xl text-lg leading-7 text-[#40484e]">
            Creating a safer, kinder community for every tail and whisker in Toronto. Your next best friend is waiting
            for a hero like you.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href={NEOPETS_PATHS.explorer}
              className="np-squish-click flex w-full items-center justify-center gap-2 rounded-xl border-b-4 border-[#005c80] bg-[#0d658c] py-4 text-xl font-semibold text-white transition-all"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Meet Adoptable Pets
              <span className="material-symbols-outlined">favorite</span>
            </Link>
            <Link
              href={NEOPETS_PATHS.volunteers}
              className="np-squish-click flex w-full items-center justify-center gap-2 rounded-xl border-b-4 border-[#135212] bg-[#2e6b29] py-4 text-xl font-semibold text-white transition-all"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Help Save Lives
              <span className="material-symbols-outlined">volunteer_activism</span>
            </Link>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={NEOPETS_PATHS.adventure}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-[#c0c7cf] bg-[#f0e7db] px-2 py-3 text-sm font-semibold tracking-wide text-[#1f1b14] transition-colors hover:bg-[#ebe1d5]"
            >
              <span className="material-symbols-outlined">search_check</span>
              Report Lost/Found
            </Link>
            <Link
              href={NEOPETS_PATHS.about}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-[#c0c7cf] bg-[#f0e7db] px-2 py-3 text-sm font-semibold tracking-wide text-[#1f1b14] transition-colors hover:bg-[#ebe1d5]"
            >
              <span className="material-symbols-outlined">handshake</span>
              Surrender Support
            </Link>
          </div>
        </div>

        <div className="np-sticker-shadow relative mt-12 aspect-4/3 w-full overflow-hidden rounded-3xl border-4 border-[#ebe1d5] bg-[#8fd3ff]/20">
          <Image
            src={HERO_IMG}
            alt="Dogs and cats playing in a park"
            fill
            className="object-cover grayscale-[0.2] sepia-[0.1]"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#fff8f2]/40 to-transparent" />
        </div>
      </section>

      <section className="border-y-2 border-[#ebe1d5] bg-[#fcf2e6] px-4 py-8 md:px-16">
        <h3
          className="mb-8 text-center text-2xl font-semibold leading-8 text-[#1f1b14]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Our Impact This Year
        </h3>
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4">
          {[
            { icon: "pets", color: "text-[#0d658c]", val: "1,248", label: "Pets Rescued" },
            { icon: "volunteer_activism", color: "text-[#2e6b29]", val: "982", label: "Adoptions" },
            { icon: "restore", color: "text-[#745b00]", val: "315", label: "Reunited" },
            { icon: "volunteer_activism", color: "text-[#ba1a1a]", val: "$42k", label: "Donations" },
          ].map((c) => (
            <div
              key={c.label}
              className="np-sticker-shadow flex flex-col items-center rounded-2xl border-2 border-[#ebe1d5] bg-white p-4 text-center"
            >
              <span className={`material-symbols-outlined mb-2 text-4xl ${c.color}`}>{c.icon}</span>
              <span
                className={`text-3xl font-bold leading-10 ${c.color}`}
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                {c.val}
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#40484e]">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 md:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-[#2e6b29]">map</span>
            <h3
              className="text-[28px] font-bold leading-9 text-[#2e6b29]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Your Adoption Adventure
            </h3>
          </div>

          <div className="relative space-y-12 before:absolute before:bottom-4 before:left-[27px] before:top-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#2e6b29]/30 before:content-['']">
            {[
              {
                step: "01",
                title: "Discover",
                body: "Browse our gallery of quirky and lovable residents looking for a new home.",
                ring: "bg-[#adf19e] text-[#326f2d] border-[#adf19e]",
                cardBorder: "border-[#adf19e]",
                accent: "text-[#2e6b29]",
                icon: "search",
                hover: "group-hover:-rotate-1",
              },
              {
                step: "02",
                title: "Connect",
                body: "Submit an inquiry and chat with our counselors about your lifestyle and pet preferences.",
                ring: "bg-[#8fd3ff] text-[#005c80] border-[#8fd3ff]",
                cardBorder: "border-[#8fd3ff]",
                accent: "text-[#0d658c]",
                icon: "chat_bubble",
                hover: "group-hover:rotate-1",
              },
              {
                step: "03",
                title: "Visit",
                body: "Schedule a playdate at our center to meet your potential match in person.",
                ring: "bg-[#eec750] text-[#695300] border-[#eec750]",
                cardBorder: "border-[#eec750]",
                accent: "text-[#745b00]",
                icon: "location_on",
                hover: "group-hover:-rotate-1",
              },
              {
                step: "04",
                title: "Adopt",
                body: "Complete the paperwork, collect your welcome pack, and start your new life together!",
                ring: "bg-[#2e6b29] text-white border-[#2e6b29]",
                cardBorder: "border-[#2e6b29]",
                accent: "text-[#2e6b29]",
                icon: "celebration",
                hover: "group-hover:rotate-1",
                cardBg: "bg-[#adf19e]/30",
              },
            ].map((s) => (
              <div key={s.step} className="group relative flex items-start gap-6">
                <div
                  className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-md ${s.ring}`}
                >
                  <span className="material-symbols-outlined font-bold">{s.icon}</span>
                </div>
                <div
                  className={`flex-1 rounded-2xl border-2 p-6 np-sticker-shadow transition-transform ${s.cardBorder} ${s.cardBg ?? "bg-white"} ${s.hover}`}
                >
                  <span className={`mb-1 block text-sm font-semibold uppercase tracking-wider ${s.accent}`}>
                    Step {s.step}
                  </span>
                  <h4
                    className="mb-2 text-2xl font-semibold leading-8 text-[#1f1b14]"
                    style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                  >
                    {s.title}
                  </h4>
                  <p className="text-base leading-6 text-[#40484e]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
