"use client";

import Image from "next/image";
import { DcNextStepsDesktop } from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import {
    CUSTOM_VS_TEMPLATE_TAKEAWAYS,
    DECISION_QUESTIONS,
} from "./customVsTemplateConfig";
import type { DcArticleContentProps } from "./types";

const HERO_IMAGE = "/images/imageheader.png";

export default function CustomVsTemplateDesktop({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
                        <section className="mb-16" id="intro">
                            <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                                Template or custom? There is no one-size-fits-all answer. The right
                                choice depends on goals, budget, timeline, branding, and long-term
                                plans — and understanding the tradeoffs helps you decide without
                                pressure toward either option.
                            </p>
                            <Image
                                src={HERO_IMAGE}
                                alt="Desk with monitor showing a website layout mockup beside code, illustrating custom vs template design"
                                width={800}
                                height={320}
                                className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                                priority
                            />
                        </section>

                        <section className="mb-16" id="template">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Template Websites
                            </h2>
                            <p className="text-base text-[#1b1c1c]">
                                Pre-designed layouts customized with your content, colors, and branding
                                — common on WordPress, Wix, and Squarespace. They often reduce development
                                time, upfront cost, and technical complexity.
                            </p>
                        </section>

                        <section className="mb-16" id="custom">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Custom Websites
                            </h2>
                            <p className="text-base text-[#1b1c1c]">
                                Built specifically for your business with tools like Next.js and React —
                                unique layouts, specialized features, and tailored experiences. More
                                flexibility, usually more planning and development time.
                            </p>
                        </section>

                        <section className="mb-16" id="when-template">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                When Templates Fit
                            </h2>
                            <div className="overflow-hidden rounded-lg border border-[#c1c8c4] bg-white">
                                <div className="border-b border-[#c1c8c4] bg-[#f6f3f2] p-4">
                                    <h3 className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                                        Template strengths
                                    </h3>
                                </div>
                                <ul className="divide-y divide-[#c1c8c4] p-6 text-sm text-[#414845]">
                                    <li className="py-2 first:pt-0">Faster launch — often days vs weeks.</li>
                                    <li className="py-2">Lower initial cost with existing structure.</li>
                                    <li className="py-2">Drag-and-drop editing for non-technical owners.</li>
                                    <li className="py-2 last:pb-0">
                                        Plugins, themes, and community support on major platforms.
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-4 text-sm text-[#414845]">
                                Good fits: cafés, solo contractors, simple informational sites, first-time
                                launches with smaller budgets.
                            </p>
                        </section>

                        <section className="mb-16" id="when-custom">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                When Custom Fits
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6">
                                    <div className="mb-4 flex items-center gap-2 text-[#416359]">
                                        <MaterialIcon name="architecture" />
                                        <h4 className="font-bold text-[#1b1c1c]">Custom wins</h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-[#414845]">
                                        <li>Distinct brand identity and layouts.</li>
                                        <li>Performance and SEO optimization.</li>
                                        <li>Specialized workflows and scalability.</li>
                                    </ul>
                                </div>
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6 opacity-70">
                                    <div className="mb-4 flex items-center gap-2 text-[#414845]">
                                        <MaterialIcon name="info" />
                                        <h4 className="font-bold text-[#1b1c1c]">Template limits</h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-[#414845]">
                                        <li>Heavy customization can get complex.</li>
                                        <li>Performance and uniqueness may cap out.</li>
                                        <li>Advanced features may need workarounds.</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-[#414845]">
                                Custom usually means higher upfront cost, longer timelines, and more
                                maintenance planning — but not every business needs it on day one.
                            </p>
                        </section>

                        <section className="mb-16" id="seo-ux">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                SEO &amp; User Experience
                            </h2>
                            <blockquote className="dc-display my-6 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
                                &quot;Execution matters more than labels — a well-designed template can
                                outperform a poorly planned custom site.&quot;
                            </blockquote>
                            <p className="text-base text-[#1b1c1c]">
                                SEO success depends on content, structure, speed, and mobile usability —
                                not template vs custom alone. Visitors care about clarity, trust, and
                                ease of contact.
                            </p>
                        </section>

                        <section className="mb-16" id="mistakes">
                            <div className="rounded-lg border border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a]">
                                <h2 className="dc-display mb-2 flex items-center gap-2 text-2xl leading-[1.3] font-medium">
                                    <MaterialIcon name="warning" />
                                    Common Mistakes
                                </h2>
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    <li>Choosing on price alone — or overbuilding before validating needs.</li>
                                    <li>Ignoring long-term goals and scalability.</li>
                                    <li>Prioritizing flashy features over clarity and contact paths.</li>
                                </ul>
                            </div>
                            <ul className="mt-6 space-y-2 text-sm text-[#414845]">
                                {DECISION_QUESTIONS.slice(0, 4).map((q) => (
                                    <li key={q} className="flex items-start gap-2">
                                        <MaterialIcon name="help" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-16" id="final-thoughts">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Key Takeaways &amp; Final Thoughts
                            </h2>
                            <ul className="mb-6 space-y-2 text-sm text-[#414845]">
                                {CUSTOM_VS_TEMPLATE_TAKEAWAYS.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-base text-[#1b1c1c]">
                                The goal is a site that supports your business and builds trust — whether
                                that starts as a template today or a custom build when the time is right.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {["WEB STRATEGY", "CUSTOM BUILD", "TEMPLATES"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded bg-[rgba(107,142,131,0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
        </>
    );
}

export function CustomVsTemplateDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/services",
                    title: "Our Services",
                    body: "Custom builds, SEO, and support for Toronto and GTA businesses.",
                },
                {
                    href: "/contact",
                    title: "Discuss Your Project",
                    body: "Custom builds for Toronto and GTA small businesses.",
                },
            ]}
        />
    );
}
