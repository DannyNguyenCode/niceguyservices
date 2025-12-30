"use client";

import React, { useState } from "react";
import PageHeader from "./PageHeader";
import {
    serviceCards,
    type Service,
} from "./services/data";
import ServiceCardGrid from "./services/ServiceCardGrid";
import ScrollToTop from "./services/ScrollToTop";
import FinalCTA from "./services/FinalCTA";
import ServiceDetailModal from "./services/ServiceDetailModal";

const Services: React.FC = () => {
    const [activeService, setActiveService] = useState<Service | null>(null);

    const handleLearnMore = (service: Service) => {
        setActiveService(service);
    };

    const handleCloseModal = () => {
        setActiveService(null);
    };

    return (
        <section className="bg-base-200 py-12 md:py-16 px-4">
            <div className="mx-auto max-w-6xl space-y-10">
                <PageHeader
                    title="Services"
                    subtitle="Modern, maintainable websites and engineering designed for growth."
                />

                <ServiceCardGrid
                    cards={serviceCards}
                    onLearnMore={handleLearnMore}
                />

                <FinalCTA />
            </div>

            <ServiceDetailModal
                service={activeService}
                onClose={handleCloseModal}
            />

            <ScrollToTop />
        </section>
    );
};

export default Services;
