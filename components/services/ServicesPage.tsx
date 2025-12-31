"use client";

import React, { useState } from "react";
import PageHeader from "../PageHeader";
import { serviceCards, type Service } from "./data";
import ServiceCardGrid from "./ServiceCardGrid";
import ScrollToTop from "./ScrollToTop";
import FinalCTA from "./FinalCTA";
import ServiceDetailModal from "./ServiceDetailModal";

const ServicesClient: React.FC = () => {
    const [activeService, setActiveService] = useState<Service | null>(null);

    const handleLearnMore = (service: Service) => {
        setActiveService(service);
    };

    const handleCloseModal = () => {
        setActiveService(null);
    };

    return (
        <section className="bg-base-200 py-12 md:py-16 px-4" aria-labelledby="services-heading">
            <div className="mx-auto max-w-6xl space-y-10">
                <PageHeader
                    title="Services"
                    subtitle="Custom websites, performance, and ongoing support — built for small businesses that want a site that stays fast and easy to maintain."
                />


                <ServiceCardGrid cards={serviceCards} onLearnMore={handleLearnMore} variant="modal" />

                <FinalCTA />
            </div>

            <ServiceDetailModal service={activeService} onClose={handleCloseModal} />
            <ScrollToTop />
        </section>
    );
};

export default ServicesClient;
