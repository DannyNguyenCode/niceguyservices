import type { ComponentType, SVGProps } from "react";
import {
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export const AUDIT_LANDING_STEPS = [
    {
        n: "01",
        title: "Submit your website",
        body: "We collect the information needed to review your site.",
    },
    {
        n: "02",
        title: "We analyze it",
        body: "Performance, usability, accessibility, messaging and conversion signals are reviewed.",
    },
    {
        n: "03",
        title: "Get your findings",
        body: "Your results are organized into practical opportunities for improvement.",
    },
] as const;

export const AUDIT_LANDING_MEASURES: Array<{
    n: string;
    icon: IconType;
    title: string;
    body: string;
}> = [
    {
        n: "01",
        icon: ChartBarIcon,
        title: "Performance",
        body: "Page speed, loading behaviour and technical issues that make the site feel slower than it should.",
    },
    {
        n: "02",
        icon: EyeIcon,
        title: "Accessibility",
        body: "Usability signals such as labels, contrast, semantics and mobile readability.",
    },
    {
        n: "03",
        icon: ChatBubbleLeftRightIcon,
        title: "Messaging & trust",
        body: "How clearly the site explains the offer, supports credibility and reduces hesitation.",
    },
    {
        n: "04",
        icon: DevicePhoneMobileIcon,
        title: "Mobile & conversion",
        body: "How well smaller screens guide people toward contacting, booking or requesting a quote.",
    },
];

export const AUDIT_LANDING_METHOD_ROWS = [
    {
        n: "01",
        title: "Automated technical checks",
        body: "Identify visible technical problems and opportunities.",
    },
    {
        n: "02",
        title: "Google PageSpeed",
        body: "Surface performance and loading constraints.",
    },
    {
        n: "03",
        title: "Visual review",
        body: "Evaluate messaging, trust, mobile UX and conversion friction.",
    },
    {
        n: "04",
        title: "Nice Guy criteria",
        body: "Prioritize improvements that matter to small businesses.",
    },
] as const;

export const AUDIT_LANDING_METHOD_STRIP = [
    "Automated checks",
    "Google PageSpeed",
    "Visual review",
    "Nice Guy criteria",
] as const;
