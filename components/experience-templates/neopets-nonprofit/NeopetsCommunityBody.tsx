import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const MILESTONE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVYO8Rt3tAsPxEIKvHPvntLUR9xDph3ESOpUUVmvBBr55wQYs9LB-0gLnS8MhKUGj6G6scKWONkurhIYDrNGzToObG5ZYTCQL8L38Y1cMERw8HJ0LnUlxDKX5w9YCSkJ-UsiUF4d-5GX1AD0tFvk4OynZtsoLQ7DJ2cQ7CJl6HekiPwX3FW7VZxlu2KcX3xLB4JNiWjoeU6mO0KPwgQmOS6SuuIoiF-WjArdTpAwUc1bcIvf4pVooEFhFjhThB4MoZ-eynbhwsB40M";

const SARAH =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_km4kWu_933mCcR_cCrFlGzGJDAXb-_UA_bCJ3NRQK1PiXwC5JdiqqkTRD6BFDVdbir6omEKD5A0G_mxARiphqdEOp5U2TMnh661W0QezlYbzApnnCcxohL1-QvdBmlOmadI5CdZDtNmt9BKH6vdbYIx2sXXccVL8qrdLqAUFxZ201Zs0euGfIrQyrXq8b6Nk4RwbCC6cAluhGmd6-jSxl-mj0OpsxSm18VCCCfak6dSPxoppT2EGapUTTmgdAZiwGmXYYv3SyoKc";

export function NeopetsCommunityBody() {
  return (
    <main className="min-h-screen bg-[#fff8f2] pb-10">
      <div className="np-paper-texture mx-auto flex max-w-[1200px] flex-col gap-16 px-4 py-12 md:px-16">
        <section className="np-scrapbook-card relative flex flex-col items-center gap-6 overflow-hidden rounded-[32px] border-2 border-[#8fd3ff] bg-[#fcf2e6] p-8 text-center md:p-12">
          <div className="absolute right-4 top-4 -rotate-12 md:right-8 md:top-8">
            <div className="rounded-xl border-2 border-[#695300] bg-[#eec750] px-4 py-2 text-2xl font-semibold text-[#695300] shadow-sm">New!</div>
          </div>
          <div className="max-w-2xl space-y-4">
            <h2
              className="text-5xl font-bold leading-tight text-[#0d658c]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Join A Community Helping Pets Find Love Every Day
            </h2>
            <p className="text-lg text-[#40484e]">
              Get heartwarming adoption stories, local rescue alerts, and ways to make a difference in your inbox.
            </p>
          </div>
          <form className="mt-4 flex w-full max-w-lg flex-col gap-4 md:flex-row" action="#" method="post">
            <div className="flex-1">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-2xl border-2 border-[#c0c7cf] bg-[#fff8f2] px-6 py-4 text-base text-[#1f1b14] outline-none transition-all focus:border-[#0d658c] focus:ring-4 focus:ring-[#8fd3ff]"
                aria-label="Email"
              />
            </div>
            <button
              type="submit"
              className="np-chunky-button-nav flex items-center justify-center gap-2 rounded-2xl border-b-4 border-[#8acefa] bg-[#0d658c] px-8 py-4 text-2xl font-semibold text-white transition-colors hover:bg-[#004c6b]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Subscribe
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
          <p className="text-sm font-semibold italic text-[#40484e]/70">Join 12,400+ Toronto pet lovers!</p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="np-scrapbook-card group flex flex-col gap-8 rounded-[24px] border-2 border-[#2e6b29] bg-[#adf19e] p-8 md:col-span-8 md:flex-row">
            <div className="flex flex-1 flex-col justify-center space-y-4">
              <span className="inline-block self-start rounded-full bg-[#2e6b29] px-3 py-1 text-sm font-semibold text-white">
                Shelter Milestone
              </span>
              <h3
                className="text-3xl font-bold text-[#326f2d]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                1,500 Tails Wiggling in Forever Homes!
              </h3>
              <p className="text-lg text-[#135212]">
                This month we reached a huge goal — thanks to our community, 1,500 pets found families this year.
              </p>
              <div className="flex h-8 w-full overflow-hidden rounded-full border-2 border-[#2e6b29] bg-[#ebe1d5]">
                <div className="flex w-[85%] items-center justify-end bg-[#2e6b29] px-3">
                  <span className="text-[10px] font-bold text-white">85% OF GOAL</span>
                </div>
              </div>
            </div>
            <div className="np-polaroid-img relative h-64 w-full shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-[#fff8f2] shadow-lg md:w-64">
              <Image src={MILESTONE} alt="Happy adopted dogs" fill className="object-cover" sizes="256px" />
            </div>
          </div>

          <div className="np-scrapbook-card flex flex-col items-center gap-4 rounded-[24px] border-2 border-[#ebe1d5] bg-[#f0e7db] p-6 text-center md:col-span-4">
            <div className="relative h-32 w-32 rounded-full border-4 border-[#0d658c] p-1">
              <Image src={SARAH} alt="Volunteer Sarah" fill className="rounded-full object-cover" sizes="128px" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#0d658c]">VOLUNTEER OF THE MONTH</span>
              <h4
                className="mt-2 text-2xl font-semibold text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Meet Sarah J.
              </h4>
              <p className="mt-2 text-base leading-relaxed text-[#40484e]">
                &quot;Walking dogs at the North End shelter isn&apos;t just work — it&apos;s the highlight of my week.&quot;
              </p>
            </div>
            <Link
              href={NEOPETS_PATHS.successStories}
              className="np-chunky-button-nav mt-2 w-full rounded-xl border-2 border-b-4 border-[#0d658c] border-b-[#0d658c] bg-[#fff8f2] px-4 py-2 text-sm font-semibold text-[#0d658c] transition-all hover:bg-[#8fd3ff]"
            >
              Read Sarah&apos;s Story
            </Link>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-[24px] border-2 border-[#745b00] bg-[#ffe089] p-8 text-center md:col-span-12">
            <span className="material-symbols-outlined text-5xl text-[#745b00]">volunteer_activism</span>
            <h4
              className="text-2xl font-semibold text-[#695300]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Be Part of a Success Story
            </h4>
            <p className="mx-auto max-w-lg text-base text-[#695300]/80">
              42 pets are looking for forever families. Could you be the next chapter?
            </p>
            <Link
              href={NEOPETS_PATHS.explorer}
              className="mx-auto inline-block rounded-full bg-[#745b00] px-8 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              Meet Your New Best Friend
            </Link>
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="material-symbols-outlined text-4xl text-[#0d658c]">potted_plant</span>
          <h3
            className="text-2xl italic text-[#40484e]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            &quot;Because every tail deserves a happy ending.&quot;
          </h3>
        </div>
      </div>
    </main>
  );
}
