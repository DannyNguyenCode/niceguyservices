"use client";

import { useState } from "react";
import { PSD_SERVICES } from "./partySmileDentalData";
import type { PsdService } from "./partySmileDentalData";
import { ServiceCard } from "./ServiceCard";
import { ServiceModal } from "./ServiceModal";

type ServicesSectionProps = {
  limit?: number;
  showViewAllServicesInModal?: boolean;
};

export function ServicesSection({
  limit,
  showViewAllServicesInModal = false,
}: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<PsdService | null>(null);
  const services = limit ? PSD_SERVICES.slice(0, limit) : PSD_SERVICES;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            service={service}
            onLearnMore={setSelectedService}
          />
        ))}
      </div>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        showViewAllServices={showViewAllServicesInModal}
      />
    </>
  );
}
