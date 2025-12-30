// services/ServiceCard.tsx
"use client";

import React from "react";

export default function ServiceCard({ card, onClick }: any) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all cursor-pointer h-full"
            onClick={onClick}>
            <div className="card-body gap-3">
                <h3 className="card-title text-lg font-extrabold">{card.title}</h3>
                <p className="text-sm text-base-content/80">{card.short}</p>

                <ul className="mt-1 space-y-1 text-sm">
                    {card.bullets.map((b: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-base-content/70 font-semibold">
                    {card.headline}
                </p>

                <div className="pt-2">
                    <button className="btn btn-primary btn-sm normal-case w-full">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}
