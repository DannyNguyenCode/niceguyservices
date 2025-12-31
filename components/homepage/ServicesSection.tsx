"use client";

import React from "react";
import Link from "next/link";
import { serviceCards } from "@/components/services/data";
import ServiceCardGrid from "@/components/services/ServiceCardGrid";

export default function ServicesSection() {
    const featured = serviceCards.filter((s) => s.featured).slice(0, 3);

    return (
        <section
            id="homepage-services"
            aria-labelledby="homepage-services-heading"
            className="bg-base-200 py-12 md:py-16 px-4"
        >
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="text-center">
                    <div className="inline-flex justify-center">
                        <span className="badge badge-outline badge-lg rounded-full font-semibold tracking-[0.08em] uppercase text-primary">
                            Services
                        </span>
                    </div>

                    <h2
                        id="homepage-services-heading"
                        className="mt-3 text-2xl md:text-3xl font-extrabold"
                    >
                        Custom websites for small businesses — built fast, supported long-term
                    </h2>

                    <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-base-content/80">
                        From custom builds to performance and SEO foundations, I help small businesses
                        launch a site that looks professional and stays easy to maintain.
                    </p>
                </div>

                <ServiceCardGrid cards={featured} variant="link" />

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center md:justify-between rounded-2xl border border-base-300 bg-base-100/70 p-4">
                    <p className="text-sm md:text-base text-base-content/80">
                        Want the full breakdown? See everything that’s included — or book a quick call
                        and I’ll recommend the simplest setup.
                    </p>

                    <div className="flex gap-3">
                        <Link
                            href="/services"
                            className="btn btn-outline btn-primary normal-case rounded-lg"
                            aria-label="View all website services"
                        >
                            View all services
                        </Link>

                        <Link
                            href="/contact"
                            className="btn btn-primary normal-case rounded-lg"
                            aria-label="Book a free consultation"
                        >
                            Book a free consult
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
