import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { FAQAccordion } from "./FAQAccordion";
import { PSD_HOME_FAQ_ID, PSD_PATHS } from "./partySmileDentalConfig";
import {
  PSD_FAQS,
  PSD_JOURNEY_STEPS,
  PSD_TRUST_BADGES,
} from "./partySmileDentalData";
import { ServicesSection } from "./ServicesSection";
import {
  PartySmileDentalTrustBadge,
} from "./PartySmileDentalShared";

export function PartySmileDentalHomeBody() {
  return (
    <main className="psd-board-dot">
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-5">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[#1a1a1a] bg-[#eab308] px-4 py-2 text-sm font-black">
              Team win for every smile
            </p>
            <h1 className="font-black leading-tight text-[#1a1a1a] text-[2rem] md:text-[3rem]">
              Family Dental Care That Feels Like a Team Win
            </h1>
            <p className="text-lg leading-8 text-[#525252]">
              Gentle dental care for kids, adults, and families — with a team that helps every patient
              feel comfortable.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={PSD_PATHS.book}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1a1a1a] bg-[#ef4444] px-6 py-4 font-black text-white psd-tile-shadow psd-tile-lift"
              >
                Book Appointment
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href={PSD_PATHS.forms}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1a1a1a] bg-white px-6 py-4 font-black text-[#1a1a1a] psd-tile-shadow psd-tile-lift"
              >
                New Patient Forms
                <FileText className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border-4 border-[#1a1a1a] bg-[#3b82f6] p-8 text-white psd-tile-shadow">
            <p className="font-black text-lg">Your smile board starts here</p>
            <p className="mt-3 text-sm leading-7 text-white/90">
              Colorful tiles, clear steps, and a friendly crew — like a board-game journey toward a
              healthier smile, built for real families.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PSD_TRUST_BADGES.map((badge, i) => (
            <PartySmileDentalTrustBadge
              key={badge.label}
              label={badge.label}
              icon={badge.icon}
              color={["bg-[#3b82f6]", "bg-[#ef4444]", "bg-[#22c55e]", "bg-[#eab308]"][i]}
            />
          ))}
        </div>
      </section>

      <section className="border-y-4 border-[#1a1a1a] bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-black text-[#1a1a1a] text-[1.75rem] md:text-[2.5rem]">Smile Journey Board</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#525252]">
            Four tiles. One path. Every visit feels like progress on the board.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {PSD_JOURNEY_STEPS.map((tile, i) => (
              <li
                key={tile.step}
                className={`rounded-3xl border-2 border-[#1a1a1a] p-6 psd-tile-shadow psd-tile-lift ${
                  ["bg-[#ef4444]", "bg-[#3b82f6]", "bg-[#eab308]", "bg-[#22c55e]"][i]
                } text-white`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white text-lg font-black">
                  {tile.step}
                </span>
                <h3 className="mt-4 font-black">{tile.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/90">{tile.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-bold text-[#3b82f6]">Popular services</p>
            <h2 className="font-black text-[#1a1a1a] text-[1.75rem] md:text-[2.5rem]">Care for every age</h2>
          </div>
          <Link href={PSD_PATHS.services} className="font-bold text-[#3b82f6] hover:underline">
            View all services →
          </Link>
        </div>
        <ServicesSection limit={6} showViewAllServicesInModal />
      </section>

      <section
        id={PSD_HOME_FAQ_ID}
        className="scroll-mt-36 border-t-4 border-[#1a1a1a] bg-[#fffef8] px-4 py-16 md:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-bold text-[#3b82f6]">Help tiles</p>
          <h2 className="mt-2 font-black text-[#1a1a1a] text-[1.75rem] md:text-[2.5rem]">
            Questions before your visit
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#525252]">
            Tap a tile for plain-English answers about new patients, kids, emergencies, insurance, and
            nervous visits.
          </p>
          <div className="mt-10">
            <FAQAccordion items={PSD_FAQS} variant="help-tile" />
          </div>
          <p className="mt-8 text-center text-sm text-[#525252]">
            Prefer a dedicated page?{" "}
            <Link href={PSD_PATHS.faq} className="font-bold text-[#3b82f6] hover:underline">
              View full FAQ
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
