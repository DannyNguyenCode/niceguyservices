// services/ServiceDetailsSection.tsx
"use client";

import React from "react";
import ServiceDetailBlock from "./ServiceDetailBlock";

export default function ServiceDetailSection({ cards, active }: any) {
    if (!active) return null;

    const item = cards.find((x: any) => x.id === active);
    if (!item) return null;

    return (
        <div className="mt-10" id={`detail-${item.id}`}>
            <ServiceDetailBlock item={item} />
        </div>
    );
}
