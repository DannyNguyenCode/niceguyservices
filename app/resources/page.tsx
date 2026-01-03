import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Resources for Small Business Websites & SEO",
    description:
        "Practical guides explaining how modern websites help small businesses rank better, load faster, and convert more visitors.",
};

const resources = [
    {
        title: "How SEO Helps Local Service Businesses",
        description:
            "A simple explanation of how search engines connect local customers with businesses — and what actually matters for rankings.",
        href: "/resources/how-seo-helps-local-businesses",
    },
    {
        title: "Why Fast Websites Rank Better",
        description:
            "Learn how website speed affects SEO, user experience, and conversion rates for small businesses.",
        href: "/resources/why-fast-websites-rank-better",
    },
    {
        title: "Custom Websites vs Templates",
        description:
            "A practical comparison to help small business owners decide between custom-built sites and templates like WordPress or Wix.",
        href: "/resources/custom-websites-vs-templates",
    },
    {
        title: "How to Start SEO on Your Website (Beginner Guide)",
        description:
            "A beginner-friendly guide to starting SEO on your own website. Learn what matters first, what to avoid, and how to build a strong SEO foundation.",
        href: "/resources/how-to-start-seo-for-your-website",
    },
];

export default function ResourcesPage() {
    return (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
            {/* Page intro */}
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Resources for Small Business Websites & SEO
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Short, practical guides explaining how modern websites help small
                    businesses rank better, load faster, and turn visitors into customers.
                </p>
            </header>

            {/* Resource list */}
            <section className="grid gap-6">
                {resources.map((resource) => (
                    <article
                        key={resource.href}
                        className="rounded-lg border p-6 hover:border-primary transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            <Link href={resource.href} className="hover:underline">
                                {resource.title}
                            </Link>
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {resource.description}
                        </p>
                        <Link
                            href={resource.href}
                            className="text-primary font-medium hover:underline"
                        >
                            Read more →
                        </Link>
                    </article>
                ))}
            </section>

            {/* Soft CTA */}
            <section className="pt-10 border-t space-y-4">
                <h2 className="text-2xl font-semibold">
                    Need a website built the right way?
                </h2>
                <p className="max-w-2xl text-muted-foreground">
                    These principles are applied to every website I build — focusing on
                    clarity, performance, and long-term growth.
                </p>
                <Link
                    href="/services"
                    className="inline-block text-primary font-medium hover:underline"
                >
                    View website services →
                </Link>
            </section>
        </section>
    );
}
