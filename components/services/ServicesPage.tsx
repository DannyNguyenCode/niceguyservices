"use client";

import {
    ArrowRightIcon,
    BoltIcon,
    CheckCircleIcon,
    CloudArrowUpIcon,
    CommandLineIcon,
    DevicePhoneMobileIcon,
    PaintBrushIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/solid";

export default function ServicesClient() {
    const goToContact = () => {
        window.location.href = "/contact";
    };

    return (
        <main className="bg-base-200">
            <header className="relative overflow-hidden py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-base-content/70 mb-4">
                            Solutions For Scale
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-8">
                            Expert Web Development Services
                        </h1>
                        <p className="text-xl text-base-content/70 leading-relaxed max-w-2xl">
                            Turning complex technical requirements into elegant,
                            high-performance digital architectures. Precision-coded,
                            user-focused, and built for growth.
                        </p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-primary" style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
                </div>
            </header>

            <section className="py-20 bg-base-300/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <article className="md:col-span-2 card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="card-body p-10">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-secondary p-2 text-secondary-content">
                                    <CommandLineIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold mb-3">Custom Website Builds</h3>
                                <p className="text-base-content/70 mb-4 text-lg">
                                    Scalable, secure, and uniquely yours. From simple brochure sites to complex web applications.
                                </p>
                                <ul className="space-y-2 mb-6 text-sm font-medium">
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>React/Next.js Architecture</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Headless CMS Integration</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Custom API Development</span>
                                    </li>
                                </ul>
                                <a href="#custom-builds" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                                    <span>View Details</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        <article className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="card-body p-10">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-secondary p-2 text-secondary-content">
                                    <PaintBrushIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">UX/UI &amp; Design</h3>
                                <p className="text-base-content/70 mb-4">
                                    Editorial-grade interfaces focused on conversion and intuitive user journeys.
                                </p>
                                <ul className="space-y-2 mb-6 text-sm font-medium">
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Visual Strategy</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Prototyping</span>
                                    </li>
                                </ul>
                                <a href="#design" className="text-primary font-bold inline-flex items-center gap-2">
                                    <span>Explore</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        <article className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="card-body p-10">
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-secondary p-2 text-secondary-content">
                                    <BoltIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Performance</h3>
                                <p className="text-base-content/70 mb-4">
                                    Sub-second load times and technical SEO foundations that search engines love.
                                </p>
                                <ul className="space-y-2 mb-6 text-sm font-medium">
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Core Web Vitals</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                                        <span>Edge Hosting</span>
                                    </li>
                                </ul>
                                <a href="#performance" className="text-primary font-bold inline-flex items-center gap-2">
                                    <span>Optimize</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </article>

                        <article className="md:col-span-2 card bg-primary text-primary-content shadow-xl overflow-hidden">
                            <div className="card-body p-10 relative z-10">
                                <h3 className="text-3xl font-bold mb-3">Need a custom technical solution?</h3>
                                <p className="opacity-90 text-lg mb-6 max-w-md">
                                    I specialize in building bespoke systems that solve specific business bottlenecks. Let&apos;s discuss your roadmap.
                                </p>
                                <div>
                                    <button className="btn bg-base-100 text-primary border-none hover:opacity-90" onClick={goToContact}>
                                        Book a Consultation
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-base-200" id="custom-builds">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/2">
                            <span className="uppercase tracking-[0.2em] text-base-content/70 mb-4 font-bold text-xs">
                                Featured Service
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Custom Website Builds</h2>
                            <p className="text-lg text-base-content/70 mb-10 leading-relaxed">
                                Every business is unique, and your digital footprint should reflect that. I build performance-driven digital products from the ground up using modern stacks.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                                    <CloudArrowUpIcon className="w-5 h-5 text-primary mb-2" />
                                    <p className="text-sm font-bold">Headless CMS</p>
                                </div>
                                <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                                    <DevicePhoneMobileIcon className="w-5 h-5 text-primary mb-2" />
                                    <p className="text-sm font-bold">Mobile First</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-base-100 rounded-2xl p-12 border border-base-300 shadow-sm">
                            <h4 className="text-xl font-bold mb-8">Service Includes</h4>
                            <ul className="space-y-6">
                                {[
                                    ["Initial technical roadmap & architecture", "Planning the stack and data flow."],
                                    ["Responsive front-end development", "Pixel-perfect implementation of designs."],
                                    ["Third-party integrations (Stripe, CRM, Auth)", "Connecting your business tools."],
                                ].map(([title, desc], idx) => (
                                    <li key={title} className="flex items-start gap-4">
                                        <span className="bg-primary text-primary-content w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="font-bold">{title}</p>
                                            <p className="text-sm text-base-content/70">{desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-24">
                        <h3 className="text-2xl font-bold mb-12 text-center">Development Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                ["01", "Discovery", "Goals & Analysis"],
                                ["02", "Blueprint", "Wireframes & Specs"],
                                ["03", "Execution", "Coding & Reviews"],
                                ["04", "Deployment", "Launch & Monitor"],
                            ].map(([num, title, desc]) => (
                                <div key={num} className="bg-base-100 p-6 rounded-xl text-center border border-base-300 shadow-sm">
                                    <div className="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                                        {num}
                                    </div>
                                    <h5 className="font-bold mb-1">{title}</h5>
                                    <p className="text-xs text-base-content/70">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-base-300/40" id="design">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="rounded-2xl aspect-video shadow-xl bg-linear-to-br from-base-100 to-base-300 border border-base-300" />
                        </div>
                        <div>
                            <span className="uppercase tracking-[0.2em] text-base-content/70 mb-4 font-bold text-xs">
                                Precision Design
                            </span>
                            <h2 className="text-4xl font-bold mb-6">UX/UI &amp; Interface Design</h2>
                            <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                                Visual authority meets functional clarity. I design interfaces that guide your users toward the desired action with zero friction.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
                                    <PaintBrushIcon className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Interactive High-Fidelity Prototypes</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
                                    <Squares2X2Icon className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Scalable Design Systems</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-base-200" id="performance">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-6">Performance &amp; Technical SEO</h2>
                        <p className="text-lg text-base-content/70">
                            A beautiful site is useless if it&apos;s slow or invisible. I engineer for speed and search performance from day one.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            ["01", "Core Web Vitals", "Optimizing LCP, FID, and CLS for stronger rankings and better user experience."],
                            ["02", "Server-Side Rendering", "Leveraging Next.js for fast page loads and superior indexability."],
                            ["03", "Schema & Metadata", "Control how your brand appears in search results and social shares."],
                        ].map(([num, title, desc]) => (
                            <article key={num} className="p-8 bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                                <div className="text-5xl font-black text-primary/20 mb-4">{num}</div>
                                <h4 className="font-bold text-xl mb-3">{title}</h4>
                                <p className="text-sm text-base-content/70 leading-relaxed">{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        Ready to architect your next digital project?
                    </h2>
                    <div className="flex justify-center">
                        <button className="btn btn-primary btn-lg" onClick={goToContact}>
                            Start Your Project
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
