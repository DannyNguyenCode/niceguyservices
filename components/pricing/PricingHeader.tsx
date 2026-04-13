"use client";

import pricingContent from "./pricingContent.json";
import PageHeader from "../PageHeader";

export default function PricingHeader() {
    const { pageHeader } = pricingContent;

    return (
        <PageHeader title={pageHeader.title} subtitle={pageHeader.subtitle} />
    );
}
