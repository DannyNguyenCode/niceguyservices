"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import homepageContent from "./homepageContent.json";

type FaqItem = {
    question: string;
    answer: string;
};

export default function HomeFaq() {
    const { faq } = homepageContent;
    const items = faq.items as FaqItem[];

    return (
        <section
            id="faq"
            className="bg-(--pm-surface-low) py-24 md:py-32"
            aria-labelledby="home-faq-heading"
        >
            <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-8">
                <div className="space-y-2 text-center">
                    <h2
                        id="home-faq-heading"
                        className="font-pm-headline text-3xl font-bold tracking-tight text-(--pm-on-surface) md:text-4xl"
                    >
                        {faq.title}
                    </h2>
                    <p className="text-base text-(--pm-on-surface-variant) md:text-lg">
                        {faq.subtitle}
                    </p>
                </div>
                <div className="space-y-4">
                    {items.map((item) => (
                        <details
                            key={item.question}
                            className="group rounded-2xl border border-(--pm-outline-variant)/40 bg-(--pm-white) transition-colors duration-300 open:border-primary/30 dark:bg-base-100/60"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                                <span className="pr-2 text-base font-semibold leading-snug text-(--pm-on-surface) md:text-lg">
                                    {item.question}
                                </span>
                                <ChevronDownIcon
                                    className="h-6 w-6 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
                                    aria-hidden
                                />
                            </summary>
                            <div className="mt-2 border-t border-(--pm-outline-variant)/30 px-5 pt-4 pb-5 text-base leading-relaxed text-(--pm-on-surface-variant)">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
