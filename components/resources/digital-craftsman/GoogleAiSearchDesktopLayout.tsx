"use client";

import Image from "next/image";
import Link from "next/link";
import { DcNextStepsDesktop } from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import type { DcArticleContentProps } from "./types";

const HERO_AI_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iGd2Ryjp9vsaIxyZx2A6eQzvl6mMvsaqEDO35IThCFDTaeGMTMgQRvPgVcMaD-9-UaBCsSKjvRun3boVOr7fxzDmkW1iaFdDJC2PJK1KvRSv7L4aal9x_YeGG8dcIfzxwfZwTnCNaYNRhizCmvY58dwy1em7gkgwQKbBVz7seTIih8QLU1fiGsV9EImxeN8bWg2RJbq2tfW3Emf3Lz9-7S4vo_aq75Dwku8PZaGzuRR-0WD9F60Y7WBA9Rh46nl-mArrfgKcuTtm";

export default function GoogleAiSearchDesktop({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
                        <section className="mb-16" id="intro">
                            <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                                Search is no longer just a list of blue links. With the integration of
                                Large Language Models (LLMs) into the core Google experience, the
                                goalpost for small businesses has moved. It&apos;s no longer about
                                &quot;ranking #1&quot; in the traditional sense; it&apos;s about becoming
                                part of the AI&apos;s synthesized answer.
                            </p>
                            <Image
                                src={HERO_AI_IMAGE}
                                alt="AI search integration visualization over a local business landscape"
                                width={800}
                                height={320}
                                className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                                priority
                            />
                        </section>

                        <section className="mb-16" id="what-is-ai">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                What is AI Search?
                            </h2>
                            <p className="mb-6 text-base text-[#1b1c1c]">
                                Google&apos;s Search Generative Experience (SGE) uses AI to answer complex
                                queries directly on the search page. For a small business, this means the
                                user might get the information they need without ever clicking through to
                                your website.
                            </p>
                            <div className="mb-6 overflow-hidden rounded-lg border border-[#c1c8c4] bg-white">
                                <div className="border-b border-[#c1c8c4] bg-[#f6f3f2] p-4">
                                    <h3 className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                                        Traditional vs AI Search
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6 p-6">
                                    <div>
                                        <h4 className="mb-2 font-bold text-[#1b1c1c]">Traditional</h4>
                                        <p className="text-sm text-[#414845]">
                                            User searches &quot;best plumber&quot; → Google lists websites →
                                            User clicks and researches.
                                        </p>
                                    </div>
                                    <div className="border-l border-[#c1c8c4] pl-6">
                                        <h4 className="mb-2 font-bold text-[#416359]">AI-Driven</h4>
                                        <p className="text-sm text-[#414845]">
                                            User searches → Google explains{" "}
                                            <em>why</em> certain plumbers are good and summarizes their
                                            services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-16" id="why-it-matters">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Why it Matters
                            </h2>
                            <blockquote className="dc-display my-8 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
                                &quot;The web is shifting from a directory of destinations to a landscape of
                                answers. Small businesses must pivot from being &apos;findable&apos; to
                                being &apos;authoritative&apos;.&quot;
                            </blockquote>
                            <p className="text-base text-[#1b1c1c]">
                                Authority is now determined by how clearly you solve specific problems.
                                Technical SEO (tags, speed) still matters, but semantic relevance—how well
                                your content matches the intent of a question—is the new gold standard.
                            </p>
                        </section>

                        <section className="mb-16" id="checklist">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                AI-Friendly Checklist
                            </h2>
                            <p className="mb-6 text-base text-[#1b1c1c]">
                                To be featured in AI overviews, your content needs to be structured for
                                machine comprehension without losing the human touch.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6">
                                    <div className="mb-4 flex items-center gap-2 text-[#416359]">
                                        <MaterialIcon name="check_circle" />
                                        <h4 className="font-bold text-[#1b1c1c]">Try this</h4>
                                    </div>
                                    <ul className="space-y-3 text-sm text-[#414845]">
                                        <li>Clear &quot;How-to&quot; sections with numbered lists.</li>
                                        <li>Direct answers to FAQ at the top of pages.</li>
                                        <li>Rich Schema markup for services and pricing.</li>
                                    </ul>
                                </div>
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6 opacity-70">
                                    <div className="mb-4 flex items-center gap-2 text-[#414845]">
                                        <MaterialIcon name="cancel" />
                                        <h4 className="font-bold text-[#1b1c1c]">Avoid this</h4>
                                    </div>
                                    <ul className="space-y-3 text-sm text-[#414845]">
                                        <li>Vague &quot;About Us&quot; fluff without specifics.</li>
                                        <li>PDF-only menus or service lists.</li>
                                        <li>Hiding prices or service areas deep in UI.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-16" id="mistakes">
                            <div className="rounded-lg border border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a]">
                                <h2 className="dc-display mb-2 flex items-center gap-2 text-2xl leading-[1.3] font-medium">
                                    <MaterialIcon name="warning" />
                                    Common Mistakes
                                </h2>
                                <p className="mb-4 text-base">
                                    The biggest mistake small businesses make is trying to &quot;game&quot;
                                    the AI with keyword stuffing. Google&apos;s LLMs are trained to detect
                                    natural, expert-level communication.
                                </p>
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    <li>Ignoring the &quot;Local Pack&quot; while chasing global AI keywords.</li>
                                    <li>Using AI to generate low-quality, generic blog posts.</li>
                                    <li>Failing to claim and optimize your Google Business Profile.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-16" id="final-thoughts">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Final Thoughts
                            </h2>
                            <p className="mb-6 text-base text-[#1b1c1c]">
                                The transition to AI search isn&apos;t a threat; it&apos;s a filtration
                                system. Those who provide the most clear, expert, and trustworthy
                                information will rise. The &quot;Digital Craftsman&quot; approach—building
                                with intentionality and human focus—is exactly what the machines are
                                looking for.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {["SEARCH ENGINE OPTIMIZATION", "ARTIFICIAL INTELLIGENCE", "STRATEGY"].map(
                                    (tag) => (
                                        <span
                                            key={tag}
                                            className="rounded bg-[rgba(107,142,131,0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]"
                                        >
                                            {tag}
                                        </span>
                                    )
                                )}
                            </div>
                        </section>
        </>
    );
}

export function GoogleAiSearchDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/pricing",
                    title: "View Pricing",
                    body: "Transparent service packages for every stage.",
                },
                {
                    href: "/services",
                    title: "Explore Projects",
                    body: "See how we've helped others navigate the AI shift.",
                },
            ]}
        />
    );
}
