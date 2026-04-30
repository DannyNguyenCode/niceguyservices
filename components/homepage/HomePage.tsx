"use client";

import Link from "next/link";
import HomeAbout from "./HomeAbout";
import HomeContact from "./HomeContact";
import HomeHero from "./HomeHero";
import HomePricing from "./HomePricing";
import HomeServices from "./HomeServices";

export default function Homepage() {
    return (
        <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <HomeHero />
            <section
                className="mx-auto max-w-3xl px-4 pb-4 text-center md:px-8"
                aria-labelledby="areas-we-serve-heading"
            >
                <h2
                    id="areas-we-serve-heading"
                    className="font-pm-headline mb-3 text-sm font-bold tracking-[0.2em] text-(--pm-on-surface-variant) uppercase"
                >
                    Areas we serve
                </h2>
                <p className="text-base leading-relaxed text-(--pm-on-surface-variant) md:text-lg">
                    Nice Guy Web Design works with small businesses based in{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">Toronto</strong>{" "}
                    and across the{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">GTA</strong>
                    , and takes select remote projects elsewhere in Canada. Prefer to meet in
                    person when it helps — video works too.{" "}
                    <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
                        Get in touch
                    </Link>
                    .
                </p>
            </section>
            <div className="relative space-y-24 overflow-hidden pb-24 pt-24 md:space-y-32 md:pb-32 md:pt-28">
                <HomeServices />
                <HomeAbout />
                <HomePricing />
                <HomeContact />
            </div>
        </div>
    );
}
