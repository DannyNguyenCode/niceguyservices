import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const HEART =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqhhPp-XC9wxcTcoH3GF0zUpRdfOtseL5rDfLFP85cDPQlF4rmlT7sMRVPsjT2gaO0X0iYkCnm35uKi0BOmiiBLqQNXym_J70JZtVQMpKByZfrpn7fhvxUdE02SRR2pcy18yZD7tVgmC5huLO0jn7sK3UczZxlskDJTf9QAmDj2-JltquPAYYI7i_EILlaanAQb7bHVPC4xYHrNkfcY4keTCAXQVgvUqGY18KiTuT1fOdA9HXln-b9uSMgd3YZZ2aSfKiJ_F3FotbV";

const V1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCM7eB1VNTovP_fBdn3XgXwONPfouMpGl8cJhkkiEbJo3iRwBjkqNr9mF2RQuSo_cL3qqL0Y4dIZdpeRBSiMGbNZg53h9Xy8U11PCKNmcp2mab6IVv7QnUUhA2W4mhrqV6Ml0hRXhq_MjZ4uTOowCxPAaxWgTfnpjOrIP1fHSMWzqNzK9nPflg3iLnXn2-wYwSESehfbmsSF8WxvbUkSWwcuSfxj2H2spPOWwuxw8UzhrM6qkqVGpTcMWHKQbmY9yYn-FKRoHBa-yNC";

export function NeopetsAboutBody() {
  return (
    <main className="np-paper-texture text-[#1f1b14]">
      <div className="mx-auto max-w-[1200px] overflow-hidden px-4 py-12 md:px-16 md:py-20">
        <section className="mb-24 flex flex-col items-center gap-12 md:flex-row">
          <div className="relative flex-1 space-y-6">
            <h1
              className="relative z-10 text-5xl font-bold leading-[56px] text-[#0d658c]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Built By Animal Lovers, <br />
              <span className="italic text-[#2e6b29]">Driven By Compassion</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#40484e]">
              We believe every tail wag is a story worth telling. Our mission goes beyond finding homes; we&apos;re
              crafting a digital sanctuary where kindness is the only currency and every pet is treated like family.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={NEOPETS_PATHS.community}
                className="np-pressed-state rounded-xl border-b-4 border-[#005c80] bg-[#0d658c] px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:scale-[0.98]"
              >
                Join Our Mission
              </Link>
              <Link
                href={NEOPETS_PATHS.quests}
                className="np-pressed-state rounded-xl border-b-4 border-[#135212] bg-[#adf19e] px-8 py-4 text-sm font-semibold text-[#326f2d] shadow-md transition-all hover:scale-[0.98]"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="mx-auto max-w-sm rotate-3 rounded-xl border border-[#c0c7cf] bg-white p-4 shadow-xl md:max-w-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                <Image src={HEART} alt="Community love" fill className="object-cover grayscale-[0.2] contrast-[1.1]" sizes="400px" />
              </div>
              <div className="pt-4 text-center">
                <span
                  className="text-2xl font-semibold uppercase tracking-widest text-[#745b00]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Our Heart
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 -rotate-12 rounded-full border-2 border-white bg-[#eec750] px-4 py-2 text-sm font-semibold text-[#695300] shadow-lg">
              Est. 2004
            </div>
            <div className="absolute -left-10 top-10 rotate-12 rounded-lg border-2 border-white bg-[#8fd3ff] px-4 py-2 text-sm font-semibold text-[#005c80] shadow-lg">
              2,400+ Lives Saved
            </div>
          </div>
        </section>

        <section className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[32px] border-2 border-[#ebe1d5] bg-[#fcf2e6] p-8 md:col-span-2">
            <div className="relative z-10 flex h-full flex-col">
              <span className="material-symbols-outlined mb-4 text-5xl text-[#2e6b29]">volunteer_activism</span>
              <h3
                className="mb-4 text-3xl font-bold leading-10 text-[#2e6b29]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                A Kinder Community
              </h3>
              <p className="mb-8 max-w-lg text-base leading-6 text-[#40484e]">
                We don&apos;t just facilitate adoptions; we build lifelong bonds. Through local workshops, community
                playdates, and our digital hub, we ensure every pet guardian has the support they need to thrive.
              </p>
              <div className="mt-auto flex -space-x-4">
                {[V1].map((src, i) => (
                  <div key={i} className="relative h-12 w-12 overflow-hidden rounded-full border-4 border-white bg-[#95d787]">
                    <Image src={src} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                ))}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#f6ece1] text-xs font-semibold text-[#40484e]">
                  +1k
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-5 transition-transform duration-500 group-hover:scale-110">
              <span className="material-symbols-outlined text-[200px]">diversity_1</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[32px] border-2 border-[#ebe1d5] bg-[#f0e7db] p-8">
            <div>
              <span className="material-symbols-outlined mb-4 text-5xl text-[#0d658c]">heart_check</span>
              <h3
                className="mb-4 text-3xl font-bold leading-10 text-[#0d658c]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Safe Hands
              </h3>
              <p className="text-base leading-6 text-[#40484e]">
                Life happens. We offer judgment-free surrender support to ensure every animal transitions safely when
                circumstances change.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-[#0d658c]/30 bg-white/50 p-4 text-center">
              <p className="text-sm font-semibold italic text-[#0d658c]">&quot;Kindness first, always.&quot;</p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2
              className="mb-2 text-5xl font-bold leading-[56px] text-[#1f1b14]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Moments We Treasure
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-[#eec750]" />
          </div>
          <p className="text-center text-sm text-[#40484e]">
            More stories on{" "}
            <Link href={NEOPETS_PATHS.successStories} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
              Success Stories
            </Link>
            .
          </p>
        </section>

        <section className="relative rounded-[48px] border-4 border-dashed border-[#745b00]/20 bg-[#eec750]/30 p-12 text-center">
          <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-[#745b00] bg-white px-6 py-2 shadow-md">
            <span className="material-symbols-outlined align-middle text-[#745b00]">savings</span>
            <span className="text-sm font-semibold text-[#1f1b14]">Every dollar helps!</span>
          </div>
          <h2
            className="mb-6 mt-4 text-5xl font-bold leading-[56px] text-[#695300]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Write the Next Chapter With Us
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-7 text-[#695300]/80">
            Whether you have time to give, space in your heart, or resources to share, you are an essential part of the
            rescue journey.
          </p>
          <Link
            href={NEOPETS_PATHS.volunteers}
            className="np-pressed-state inline-flex items-center justify-center gap-2 rounded-2xl border-b-8 border-[#005c80] bg-[#0d658c] px-10 py-5 text-2xl font-semibold text-white shadow-xl transition-all hover:scale-95"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            <span className="material-symbols-outlined">favorite</span>
            Support Rescue Efforts
          </Link>
        </section>

        <footer className="mt-24 border-t-4 border-[#adf19e] bg-[#ebe1d5] px-4 py-12 md:px-16">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#0d658c]">pets</span>
                <span
                  className="text-2xl font-semibold text-[#0d658c]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Toronto Adopt-A-Pet
                </span>
              </div>
              <p className="text-base text-[#40484e]">Creating a kinder world for every furry friend in the 416.</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1f1b14]">Explore</h4>
              <ul className="space-y-2 text-base text-[#40484e]">
                <li>
                  <Link href={NEOPETS_PATHS.explorer} className="hover:text-[#0d658c]">
                    Pet Directory
                  </Link>
                </li>
                <li>
                  <Link href={NEOPETS_PATHS.successStories} className="hover:text-[#0d658c]">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href={NEOPETS_PATHS.about} className="hover:text-[#0d658c]">
                    Adoption Process
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1f1b14]">Get Involved</h4>
              <ul className="space-y-2 text-base text-[#40484e]">
                <li>
                  <Link href={NEOPETS_PATHS.quests} className="hover:text-[#0d658c]">
                    Volunteer Portal
                  </Link>
                </li>
                <li>
                  <Link href={NEOPETS_PATHS.volunteers} className="hover:text-[#0d658c]">
                    Donation Bin
                  </Link>
                </li>
                <li>
                  <Link href={NEOPETS_PATHS.community} className="hover:text-[#0d658c]">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1f1b14]">Say Hello</h4>
              <p className="text-base text-[#40484e]">123 Shelter Lane, Toronto, ON</p>
              <p className="text-base text-[#40484e]">hello@torontoadoptapet.org</p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[1200px] border-t border-[#ebe1d5] pt-8 text-center">
            <p className="text-sm font-semibold text-[#40484e]">© 2024 Toronto Adopt-A-Pet. Handcrafted with love.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
