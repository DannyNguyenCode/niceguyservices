import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Star } from "lucide-react";
import {
  PSD_ADDRESS,
  PSD_EMAIL,
  PSD_HOURS,
  PSD_PATHS,
  PSD_PHONE,
  PSD_PHONE_HREF,
  PSD_SITE,
} from "./partySmileDentalConfig";
import type { PsdDentist, PsdTestimonial } from "./partySmileDentalData";

export function PartySmileDentalTrustBadge({
  label,
  icon: Icon,
  color = "bg-[#3b82f6]",
}: {
  label: string;
  icon: LucideIcon;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-[#1a1a1a] bg-white p-4 psd-tile-shadow psd-tile-lift">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} text-white`}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-bold text-[#1a1a1a]">{label}</span>
    </div>
  );
}

export function PartySmileDentalDentistCard({ dentist }: { dentist: PsdDentist }) {
  const slug = dentist.name.replace(/\s+/g, "-").toLowerCase();
  return (
    <article
      id={slug}
      className="flex flex-col rounded-3xl border-2 border-[#1a1a1a] bg-white p-6 psd-tile-shadow psd-tile-lift"
    >
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${dentist.tileColor} text-white`}>
        <Star className="h-7 w-7 fill-current" aria-hidden />
      </div>
      <h3 className="font-black text-[#1a1a1a]">{dentist.name}</h3>
      <p className="mt-1 text-sm font-bold text-[#3b82f6]">{dentist.role}</p>
      <p className="mt-2 text-sm font-semibold text-[#525252]">{dentist.focus}</p>
      <p className="mt-4 flex-1 text-sm leading-6 text-[#525252]">{dentist.bio}</p>
      <Link
        href={`${PSD_PATHS.contact}?dentist=${encodeURIComponent(dentist.name)}`}
        className="mt-6 inline-block rounded-xl border-2 border-[#1a1a1a] bg-[#eab308] px-4 py-3 text-center text-sm font-black text-[#1a1a1a] psd-tile-shadow"
      >
        Meet Dentist
      </Link>
    </article>
  );
}

export function PartySmileDentalTestimonialCard({ item }: { item: PsdTestimonial }) {
  return (
    <blockquote className="rounded-3xl border-2 border-[#1a1a1a] bg-white p-6 psd-tile-shadow psd-tile-lift">
      <div className="mb-3 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[#eab308] text-[#eab308]" aria-hidden />
        ))}
      </div>
      <p className="text-sm leading-7 text-[#1a1a1a]">&ldquo;{item.quote}&rdquo;</p>
      <footer className="mt-4 border-t-2 border-[#f0f0f0] pt-4">
        <p className="font-black text-[#1a1a1a]">{item.name}</p>
        <p className="text-sm font-semibold text-[#525252]">{item.detail}</p>
      </footer>
    </blockquote>
  );
}

export function PartySmileDentalContactSection({ showMap = true }: { showMap?: boolean }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-[#1a1a1a] bg-white p-5">
          <p className="text-sm font-bold text-[#525252]">Phone</p>
          <a href={PSD_PHONE_HREF} className="font-black text-[#3b82f6] hover:underline">
            {PSD_PHONE}
          </a>
        </div>
        <div className="rounded-2xl border-2 border-[#1a1a1a] bg-white p-5">
          <p className="text-sm font-bold text-[#525252]">Email</p>
          <a href={`mailto:${PSD_EMAIL}`} className="font-black text-[#3b82f6] hover:underline">
            {PSD_EMAIL}
          </a>
        </div>
        <div className="rounded-2xl border-2 border-[#1a1a1a] bg-white p-5">
          <p className="text-sm font-bold text-[#525252]">Address</p>
          <p className="font-black text-[#1a1a1a]">{PSD_ADDRESS}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1a1a1a] bg-white p-5">
          <p className="text-sm font-bold text-[#525252]">Hours</p>
          <p className="font-black text-[#1a1a1a]">{PSD_HOURS}</p>
        </div>
      </div>
      {showMap ? (
        <div
          className="flex min-h-[280px] items-center justify-center rounded-3xl border-2 border-dashed border-[#1a1a1a] bg-[#f5f5f5] p-6 text-center"
          role="img"
          aria-label="Map placeholder for clinic location"
        >
          <div>
            <p className="font-black text-[#1a1a1a]">Map placeholder</p>
            <p className="mt-2 text-sm text-[#525252]">{PSD_ADDRESS}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PartySmileDentalFooter() {
  return (
    <footer className="border-t-4 border-[#1a1a1a] bg-[#1a1a1a] text-[#fffef8]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eab308] text-[#1a1a1a]">
              <Star className="h-4 w-4 fill-current" aria-hidden />
            </span>
            <span className="font-black">{PSD_SITE}</span>
          </div>
          <p className="text-sm leading-6 text-[#d4d4d4]">
            Fictional family dental demo — playful board-game energy, professional care messaging. Not a
            real clinic.
          </p>
        </div>
        <div>
          <p className="mb-3 font-black">Quick links</p>
          <ul className="flex flex-col gap-2 text-sm font-semibold">
            <li>
              <Link href={PSD_PATHS.services} className="hover:text-[#eab308]">
                Services
              </Link>
            </li>
            <li>
              <Link href={PSD_PATHS.forms} className="hover:text-[#eab308]">
                Patient forms
              </Link>
            </li>
            <li>
              <Link href={PSD_PATHS.faq} className="hover:text-[#eab308]">
                FAQ
              </Link>
            </li>
            <li>
              <Link href={PSD_PATHS.book} className="hover:text-[#eab308]">
                Book appointment
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-black">Clinic</p>
          <ul className="flex flex-col gap-2 text-sm leading-6 text-[#d4d4d4]">
            <li>
              <a href={PSD_PHONE_HREF} className="font-bold text-white hover:text-[#eab308]">
                {PSD_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${PSD_EMAIL}`} className="hover:text-[#eab308]">
                {PSD_EMAIL}
              </a>
            </li>
            <li>{PSD_ADDRESS}</li>
            <li>{PSD_HOURS}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#404040] px-4 py-4 text-center text-xs text-[#a3a3a3] md:px-8">
        © {new Date().getFullYear()} {PSD_SITE} (demo) · Nice Guy Web Design template
      </div>
    </footer>
  );
}
