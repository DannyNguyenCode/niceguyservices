"use client";

import React from "react";
import type { Service } from "@/components/services/data";

interface ServiceCardGridProps {
    cards: Service[];
    onLearnMore: (service: Service) => void;
}

const ServiceCardGrid: React.FC<ServiceCardGridProps> = ({
    cards,
    onLearnMore,
}) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
                <article
                    key={card.id}
                    className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all"
                >
                    <div className="card-body gap-3">
                        <h3 className="card-title text-lg font-extrabold">
                            {card.title}
                        </h3>

                        <p className="text-sm text-base-content/80">
                            {card.description}
                        </p>

                        <ul className="mt-1 space-y-1 text-sm">
                            {card.bullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn btn-primary btn-sm normal-case mt-2"
                            onClick={() => onLearnMore(card)}
                        >
                            Learn More
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default ServiceCardGrid;
