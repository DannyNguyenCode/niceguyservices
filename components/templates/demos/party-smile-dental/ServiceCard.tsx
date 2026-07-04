"use client";

import type { PsdService } from "./partySmileDentalData";

type ServiceCardProps = {
  service: PsdService;
  onLearnMore: (service: PsdService) => void;
};

export function ServiceCard({ service, onLearnMore }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article className="flex flex-col rounded-3xl border-2 border-[#1a1a1a] bg-white p-6 psd-tile-shadow psd-tile-lift">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1a1a1a] ${service.tileColor} text-white`}
        aria-hidden
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-black text-[#1a1a1a]">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#525252]">{service.description}</p>
      <button
        type="button"
        onClick={() => onLearnMore(service)}
        className="mt-5 w-full rounded-xl border-2 border-[#1a1a1a] bg-[#3b82f6] px-4 py-3 text-center text-sm font-black text-white psd-tile-shadow transition-colors hover:bg-[#2563eb]"
      >
        Learn More
      </button>
    </article>
  );
}
