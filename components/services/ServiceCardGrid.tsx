"use client";

import React from "react";
import Link from "next/link";
import type { Service } from "@/components/services/data";

type ServiceCardGridVariant = "modal" | "link";

interface ServiceCardGridProps {
    cards: Service[];
    onLearnMore?: (service: Service) => void;
    variant?: ServiceCardGridVariant;
    learnMoreHref?: (service: Service) => string; // optional override
}

const ServiceCardGrid: React.FC<ServiceCardGridProps> = ({
    cards,
    onLearnMore,
    variant = "modal",
    learnMoreHref,
}) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
                const href =
                    learnMoreHref?.(card) ??
                    // default: jump to service section on services page
                    `/services#${card.id}`;

                return (
                    <article
                        id={card.id}
                        key={card.id}
                        className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all"
                    >
                        <div className="card-body gap-3">
                            <h3 className="card-title text-lg font-extrabold">{card.title}</h3>

                            <p className="text-sm text-base-content ">{card.description}</p>

                            <ul className="mt-1 space-y-1 text-sm">
                                {card.bullets.map((b, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            {variant === "link" ? (
                                <Link href={href} className="btn btn-primary btn-sm normal-case mt-2">
                                    <span aria-hidden="true">Learn more</span>
                                    <span className="sr-only"> about {card.title} web development service</span>
                                </Link>

                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm normal-case mt-2"
                                    onClick={() => onLearnMore?.(card)}
                                    aria-label={`Learn more about ${card.title}`}
                                >
                                    Learn more
                                </button>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default ServiceCardGrid;
