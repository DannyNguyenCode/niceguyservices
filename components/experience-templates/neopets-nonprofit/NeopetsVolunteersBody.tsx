import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const GOLDEN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUAKZMmfIkJQOYNEEIThMl9cwwdDJv0rKKZppZcdAtaH7hh5wSvx9N8pHH_l4cSHA_Gb-y0cKrCxAZpYxsQvg7IejG_sup-ZNgkDjbDdLaWF3TvZukg1x8tf4o8pSOfI34ggyuuuPxhGZEbMReb4TKlvmGj8vnbdh8wW79aat17prBClQMcVDmsCV5Zv6s2-qJ0WtILmDDTFQmy_BiYXqpSDqcrTTz0TsP0H-oJjESIkxt5QqQozFKU31NdeyT4BtLs0fcSmUZg38a";

export function NeopetsVolunteersBody() {
  return (
    <main className="np-paper-texture mx-auto max-w-[1200px] px-4 py-12 pb-12 md:px-16">
      <section className="mb-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex items-center rounded-full border border-[#2e6b29]/20 bg-[#adf19e] px-4 py-1 text-sm font-semibold text-[#326f2d] shadow-sm">
            <span className="material-symbols-outlined mr-2 text-lg">volunteer_activism</span>
            Donation Bin
          </div>
          <h2
            className="text-5xl font-bold leading-tight text-[#0d658c]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Your Support Gives Animals A Second Chance
          </h2>
          <p className="max-w-xl text-lg leading-7 text-[#40484e]">
            Every bowl of food, every emergency surgery, and every warm bed is made possible by your generosity. Your
            donation helps pets sleep safely tonight.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              className="np-chunky-shadow flex items-center gap-2 rounded-xl border-b-4 border-[#005c80] bg-[#0d658c] px-8 py-4 text-2xl font-semibold text-white transition-all active:translate-y-0.5 active:shadow-none"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Donate Now
            </button>
            <Link
              href={NEOPETS_PATHS.quests}
              className="np-chunky-shadow flex items-center gap-2 rounded-xl border-b-4 border-[#574400] bg-[#eec750] px-8 py-4 text-2xl font-semibold text-[#695300] transition-all active:translate-y-0.5 active:shadow-none"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              <span className="material-symbols-outlined">shield_with_heart</span>
              Become a Rescue Hero
            </Link>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="np-polaroid-tilt-right relative z-10 rounded-[32px] border-2 border-[#ebe1d5] bg-white p-4 shadow-xl">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#f6ece1]">
              <Image src={GOLDEN} alt="Rescued golden retriever" fill className="object-cover" sizes="400px" />
            </div>
            <div className="pb-2 pt-6 text-center">
              <p
                className="text-2xl italic text-[#40484e]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                &quot;Safe at last, thanks to you.&quot;
              </p>
            </div>
            <div
              className="absolute -right-4 -top-4 rotate-12 border-2 border-white bg-[#ba1a1a] px-4 py-2 font-bold text-white shadow-lg"
              style={{
                clipPath: "polygon(0% 0%, 100% 5%, 95% 45%, 100% 100%, 50% 95%, 0% 100%, 5% 50%)",
              }}
            >
              URGENT NEED
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between border-b-2 border-[#ebe1d5] pb-4">
          <div>
            <h3
              className="text-3xl font-bold text-[#0d658c]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Rescue Impact Tracker
            </h3>
            <p className="text-base text-[#40484e]">Real-time reporting on how your contributions are saving lives.</p>
          </div>
          <span className="material-symbols-outlined hidden text-4xl text-[#0d658c] md:block">analytics</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-[24px] border-2 border-[#0d658c]/10 bg-[#fcf2e6] p-8 shadow-sm">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8fd3ff]">
                <span className="material-symbols-outlined text-[#005c80]">medical_services</span>
              </div>
              <h4
                className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Emergency Medical
              </h4>
              <p className="mb-6 text-base text-[#40484e]">
                Funding surgeries, vaccinations, and critical care for arriving rescues.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-6 overflow-hidden rounded-full border border-[#c0c7cf] bg-[#ebe1d5] p-1">
                <div className="h-full w-[83%] rounded-full bg-[#0d658c]" />
              </div>
              <p className="pt-1 text-center text-xs font-semibold text-[#40484e]">83% of monthly goal reached</p>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[24px] border-2 border-[#2e6b29]/10 bg-[#fcf2e6] p-8 shadow-sm">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#adf19e]">
                <span className="material-symbols-outlined text-[#326f2d]">home</span>
              </div>
              <h4
                className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Food &amp; Shelter
              </h4>
              <p className="mb-6 text-base text-[#40484e]">
                Maintaining clean, warm habitats and high-quality nutrition for all pets.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-6 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i <= 4 ? "bg-[#2e6b29]" : "bg-[#ebe1d5]"} ${i === 1 ? "rounded-l-full" : ""} ${i === 5 ? "rounded-r-full" : ""}`}
                  />
                ))}
              </div>
              <p className="pt-1 text-center text-xs font-semibold text-[#40484e]">456 Pets Fed This Week</p>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[24px] border-2 border-[#745b00]/10 bg-[#fcf2e6] p-8 shadow-sm">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eec750]">
                <span className="material-symbols-outlined text-[#695300]">auto_stories</span>
              </div>
              <h4
                className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Adoption Success
              </h4>
              <p className="mb-6 text-base text-[#40484e]">
                Subsidizing adoption fees for senior pets and long-term residents.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-6 overflow-hidden rounded-full border border-[#c0c7cf] bg-[#ebe1d5] p-1">
                <div className="h-full w-[60%] rounded-full bg-[#745b00]" />
              </div>
              <p className="pt-1 text-center text-xs font-semibold text-[#40484e]">Goal: 20 adoptions this month</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden rounded-[32px] bg-[#f0e7db] p-8 md:p-12">
        <div className="absolute -bottom-12 -right-12 opacity-10">
          <span className="material-symbols-outlined text-[200px] text-[#0d658c]">volunteer_activism</span>
        </div>
        <div className="relative z-10 max-w-3xl">
          <h3
            className="mb-6 text-3xl font-bold text-[#0d658c]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Transparency &amp; Trust
          </h3>
          <p className="mb-8 text-lg text-[#1f1b14]">
            We believe in 100% transparency. Every dollar donated to Toronto Adopt-A-Pet is carefully managed to ensure
            the maximum impact for the animals in our care.
          </p>
          <ul className="mb-8 space-y-4 text-base text-[#40484e]">
            <li className="flex gap-3">
              <span className="material-symbols-outlined shrink-0 text-3xl text-[#0d658c]">check_circle</span>
              <span>85% Direct Animal Care — food, medicine, and shelter operations.</span>
            </li>
            <li className="flex gap-3">
              <span className="material-symbols-outlined shrink-0 text-3xl text-[#0d658c]">verified</span>
              <span>Third-party audited financial reviews.</span>
            </li>
          </ul>
          <span className="inline-flex items-center gap-1 font-bold text-[#0d658c]">
            Download our 2023 Annual Impact Report (PDF)
            <span className="material-symbols-outlined text-lg">download</span>
          </span>
        </div>
      </section>
    </main>
  );
}
