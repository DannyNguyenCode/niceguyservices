import { MapPin, MessageCircle, Smartphone, Star } from "lucide-react";

const items = [
    {
        icon: MapPin,
        title: "Toronto based",
        body: "Local small-business websites with remote-friendly collaboration across the GTA.",
    },
    {
        icon: Star,
        title: "5-star client review",
        body: "Rated highly by a recent portfolio client for communication and delivery.",
        href: "https://jackie-portfolio-nu.vercel.app/",
        externalLabel: "5-star client review (opens Jackie portfolio in a new tab)",
    },
    {
        icon: Smartphone,
        title: "Mobile-first websites",
        body: "Layouts tested on phones, tablets, and desktops before launch.",
    },
    {
        icon: MessageCircle,
        title: "Replies within one business day",
        body: "Clear next steps after you reach out—no mailing list, no obligation.",
    },
] as const;

type HomeTrustIndicatorsProps = {
    visible?: boolean;
};

export default function HomeTrustIndicators({ visible = true }: HomeTrustIndicatorsProps) {
    return (
        <section
            aria-labelledby="home-trust-heading"
            className={`relative z-10 mx-auto max-w-[1400px] min-w-0 px-4 pb-16 pt-4 transition-opacity duration-500 motion-reduce:transition-none sm:px-6 sm:pb-20 lg:px-10 ${visible ? "opacity-100" : "opacity-100 motion-reduce:opacity-100"}`}
        >
            <h2 id="home-trust-heading" className="sr-only">
                Why clients work with Nice Guy Web Design
            </h2>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-6">
                {items.map((item) => {
                    const Icon = item.icon;
                    const inner = (
                        <>
                            <div
                                className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-(--pm-surface-container)"
                                aria-hidden
                            >
                                <Icon className="h-4 w-4 text-primary" strokeWidth={2.25} />
                            </div>
                            <h3 className="font-pm-headline text-sm font-bold text-(--pm-on-surface)">
                                {item.title}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-(--pm-on-surface-variant)">
                                {item.body}
                            </p>
                        </>
                    );
                    if ("href" in item && item.href) {
                        return (
                            <a
                                key={item.title}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.externalLabel}
                                className="flex min-w-0 flex-col rounded-lg bg-(--pm-surface-low) p-4 transition-colors hover:bg-(--pm-surface-container) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ng-primary)] sm:p-5"
                            >
                                {inner}
                            </a>
                        );
                    }
                    return (
                        <div
                            key={item.title}
                            className="flex min-w-0 flex-col rounded-lg bg-(--pm-surface-low) p-4 sm:p-5"
                        >
                            {inner}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
