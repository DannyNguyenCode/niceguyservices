"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";

export default function PricingPolicyNote() {
    const { title, body } = pricingContent.policyNote;

    return (
        <section className="mb-12 w-full" aria-labelledby="pricing-policy-note-heading">
            <div
                className="rounded-xl border p-6"
                style={{
                    backgroundColor: "var(--pm-surface-low)",
                    borderColor: "var(--pm-outline-variant)",
                }}
            >
                <div className="flex gap-4">
                    <InformationCircleIcon
                        className="mt-0.5 h-6 w-6 shrink-0"
                        style={{ color: "var(--pm-primary)" }}
                        aria-hidden
                    />
                    <div>
                        <h3
                            id="pricing-policy-note-heading"
                            className={`mb-1 text-base font-bold ${headline}`}
                            style={{ color: "var(--pm-on-surface)" }}
                        >
                            {title}
                        </h3>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {body}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
