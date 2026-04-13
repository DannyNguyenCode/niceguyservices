"use client";

import { useCallback, useState } from "react";
import { getServiceById, type Service } from "@/components/services/data";
import { pricingLayoutBodyFont as bodyFont } from "@/components/pricing/pricingLayoutConstants";
import ServiceDetailModal from "@/components/services/ServiceDetailModal";
import ScrollToTop from "@/components/services/ScrollToTop";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesBentoGrid from "@/components/services/ServicesBentoGrid";
import ServicesFeaturedSection from "@/components/services/ServicesFeaturedSection";
import ServicesTechnicalSeoSection from "@/components/services/ServicesTechnicalSeoSection";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";

export default function ServicesModernPage() {
    const [modalService, setModalService] = useState<Service | null>(null);

    const openService = useCallback((id: string) => {
        const s = getServiceById(id);
        if (s) setModalService(s);
    }, []);

    const closeModal = useCallback(() => setModalService(null), []);

    return (
        <div
            className={`relative overflow-x-hidden pb-16 ${bodyFont}`}
            style={{
                backgroundColor: "var(--pm-surface)",
                color: "var(--pm-on-surface)",
            }}
        >
            <div
                className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[min(420px,50vh)] w-screen -translate-x-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />

            <div className="relative z-10">
                <ServicesHero />
                <ServicesBentoGrid onOpenService={openService} />
                <ServicesFeaturedSection />
                <ServicesTechnicalSeoSection />
                <ServicesModernCTA />
            </div>

            <ScrollToTop />
            <ServiceDetailModal service={modalService} onClose={closeModal} />
        </div>
    );
}
