import Link from "next/link";
import { Download, FileText, Mail } from "lucide-react";
import { PSD_EMAIL, PSD_PATHS } from "./partySmileDentalConfig";

const FORM_CARDS = [
  {
    title: "Adult New Patient Form",
    text: "Health history, insurance details, and consent for adult patients.",
    cta: "Download Adult Forms",
    icon: FileText,
    color: "bg-[#3b82f6]",
  },
  {
    title: "Child New Patient Form",
    text: "Guardian info, pediatric history, and school-friendly visit notes.",
    cta: "Download Child Forms",
    icon: Download,
    color: "bg-[#eab308]",
  },
  {
    title: "Request Forms",
    text: "Need forms emailed or mailed? We will send the right packet.",
    cta: "Request Forms",
    icon: Mail,
    color: "bg-[#22c55e]",
  },
] as const;

const STEPS = [
  "Download or request forms",
  "Complete before appointment",
  "Submit online or bring them in",
] as const;

export function PartySmileDentalFormsBody() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">Dental forms</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">Get paperwork done early</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252]">
        Save chair time by completing forms before your visit. All downloads are demo placeholders.
      </p>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="rounded-2xl border-2 border-[#1a1a1a] bg-white p-5 psd-tile-shadow"
          >
            <span className="font-black text-[#ef4444]">Step {i + 1}</span>
            <p className="mt-2 font-bold text-[#1a1a1a]">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FORM_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="flex flex-col rounded-3xl border-2 border-[#1a1a1a] bg-white p-6 psd-tile-shadow psd-tile-lift"
            >
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color} text-white`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="font-black text-[#1a1a1a]">{card.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#525252]">{card.text}</p>
              <button
                type="button"
                className="mt-6 rounded-xl border-2 border-[#1a1a1a] bg-[#fffef8] px-4 py-3 text-sm font-black psd-tile-shadow"
              >
                {card.cta}
              </button>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-[#525252]">
        Questions about forms?{" "}
        <a href={`mailto:${PSD_EMAIL}`} className="font-bold text-[#3b82f6] hover:underline">
          Email our front desk
        </a>{" "}
        or{" "}
        <Link href={PSD_PATHS.contact} className="font-bold text-[#3b82f6] hover:underline">
          visit contact
        </Link>
        .
      </p>
    </main>
  );
}
