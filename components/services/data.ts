// services/data.ts
// services/data.ts

export interface ServiceProcessStep {
    step: string;
    desc: string;
}

export interface ServiceDetails {
    headline: string;
    description: string;
    includes: string[];
    process: ServiceProcessStep[];
}

export interface Service {
    id: string;
    title: string;
    bullets: string[];
    description: string;
    details: ServiceDetails;
}

export const serviceCards: Service[] = [
    {
        id: "builds",
        title: "Website Builds",
        bullets: [
            "Full websites (5+ pages)",
            "Landing pages & campaigns",
            "E-commerce websites",
            "Legacy → modern migrations",
        ],
        description: "Complete website solutions from concept to launch.",
        details: {
            headline: "Modern, fast, maintainable websites.",
            description:
                "I build full-stack websites using frameworks like Next.js and React so you get a fast, modern site that feels great to use and stays easy to maintain as your business grows.",
            includes: [
                "A fast, SEO-ready website that loads quickly and feels modern",
                "A layout tailored to your services instead of a generic template",
                "Mobile-first responsive design across phones, tablets, and desktops",
                "Clear navigation and calls-to-action that help visitors call or book",
                "If needed, a fully wired e-commerce or booking flow that actually works",
                "Clean, documented code that any junior or self-taught dev can work on later",
            ],
            process: [
                { step: "Discovery", desc: "Understanding your business, customers, and goals." },
                { step: "Planning", desc: "Deciding page structure, content priorities, and tech stack." },
                { step: "Design", desc: "Wireframes and visual design for your approval." },
                { step: "Development", desc: "Building the site with regular check-ins and previews." },
                { step: "Testing", desc: "Verifying everything works across devices and browsers." },
                { step: "Launch", desc: "Deployment, DNS, SSL, and basic training on how to use it." },
            ],
        },
    },
    {
        id: "design",
        title: "UX / UI & Design",
        bullets: [
            "User flows & wireframes",
            "Modern visual redesigns",
            "Theme variants (dark, seasonal)",
        ],
        description: "User-centered design that converts visitors into customers.",
        details: {
            headline: "Design that feels good and works hard.",
            description:
                "Good design isn’t just about looking nice—it should make it easy for visitors to understand what you do, trust you, and take the next step.",
            includes: [
                "Clear page layouts that guide visitors toward calling, booking, or filling out a form",
                "User flows that make it obvious where to click next instead of leaving people confused",
                "Modern visuals that match your brand instead of looking like a generic template",
                "Theme variants like dark mode or seasonal layouts for campaigns and promos",
                "Responsive designs that stay usable and readable on all screen sizes",
                "Design system thinking so new pages feel consistent and on-brand",
            ],
            process: [
                { step: "Research", desc: "Understanding your audience and reviewing competitors." },
                { step: "Wireframing", desc: "Planning structure and hierarchy before visuals." },
                { step: "Design", desc: "Creating polished mockups and reusable components." },
                { step: "Feedback", desc: "Iterating with your input until it feels right." },
                { step: "Handoff", desc: "Delivering assets, specs, and notes for development." },
            ],
        },
    },
    {
        id: "technical",
        title: "Technical Services",
        bullets: [
            "Hosting (Vercel / Netlify)",
            "DNS, SSL, domain setup",
            "Performance & accessibility",
            "API integrations & webhooks",
        ],
        description: "Technical excellence for reliability and performance.",
        details: {
            headline: "The reliable, technical backbone of your site.",
            description:
                "I handle the technical complexity behind the scenes so you don't have to think about servers, certificates, or strange error messages.",
            includes: [
                "Hosting on modern platforms like Vercel or Netlify for speed and reliability",
                "Domain, DNS, and SSL setup so your site loads securely at the right address",
                "Performance tuning to hit strong Lighthouse scores (speed, SEO, best practices)",
                "Accessibility improvements to meet WCAG/AODA expectations",
                "Integrations with APIs, webhooks, or third-party tools your business uses",
                "Automated backups and sensible security practices to reduce downtime risk",
            ],
            process: [
                { step: "Setup", desc: "Connecting your domain, DNS, and SSL to modern hosting." },
                { step: "Optimization", desc: "Improving load times, caching, and performance scores." },
                { step: "Integration", desc: "Connecting payment, forms, CRMs, or other tools." },
                { step: "Security", desc: "Setting up backups, monitoring, and basic hardening." },
                { step: "Documentation", desc: "Recording what’s set up so future devs understand it." },
            ],
        },
    },
    {
        id: "maintenance",
        title: "Maintenance & Support",
        bullets: [
            "Updates & latest versions",
            "Troubleshooting & debugging",
            "Security patches & monitoring",
            "Priority & emergency response",
        ],
        description: "Ongoing support to keep your site running smoothly.",
        details: {
            headline: "Peace of mind, without the tech headaches.",
            description:
                "Websites need care over time. I keep your site updated, secure, and running smoothly so you can focus on the business.",
            includes: [
                "Regular updates to frameworks, libraries, and dependencies",
                "Bug fixes and troubleshooting when something breaks or behaves oddly",
                "Security patches and monitoring to reduce the risk of downtime or hacks",
                "Performance checks so the site doesn’t slowly get bloated and sluggish",
                "Priority support for urgent issues that affect sales, leads, or bookings",
                "Clear communication so you know what changed and why it mattered",
            ],
            process: [
                { step: "Monitoring", desc: "Watching uptime, errors, and performance." },
                { step: "Updates", desc: "Rolling out safe updates on a regular schedule." },
                { step: "Security", desc: "Applying patches and watching for issues." },
                { step: "Support", desc: "Being available when questions or problems come up." },
            ],
        },
    },
    {
        id: "growth",
        title: "Email, Marketing & Growth",
        bullets: [
            "Email service setup",
            "Contact forms & automations",
            "Lightweight CRM setup",
            "SEO & analytics setup",
        ],
        description: "Marketing tools to grow your business.",
        details: {
            headline: "Turn website traffic into real leads.",
            description:
                "A good-looking site is only part of the story. I help set up tools that turn visitors into calls, bookings, and repeat customers.",
            includes: [
                "Email service setup so contact forms reliably reach your inbox",
                "Well-designed contact forms with validation and thank-you states",
                "Lightweight CRM or lead tracking so you don’t lose follow-ups",
                "Google Analytics and basic dashboarding for traffic insights",
                "SEO and Search Console basics so Google can index your site",
                "Simple automations (like confirmation emails) to respond faster",
            ],
            process: [
                { step: "Strategy", desc: "Clarifying what a 'lead' or 'conversion' means for you." },
                { step: "Setup", desc: "Configuring email, forms, analytics, and basic CRM tools." },
                { step: "Integration", desc: "Connecting your forms and flows into those tools." },
                { step: "Optimization", desc: "Improving wording and layout to lift conversions." },
                { step: "Reporting", desc: "Giving you simple numbers you can check easily." },
            ],
        },
    },
    {
        id: "custom",
        title: "Custom & Premium",
        bullets: [
            "Custom websites & applications",
            "Custom themes & components",
            "Third-party integrations",
            "Campaign landings & microsites",
        ],
        description: "Tailored solutions for unique business needs.",
        details: {
            headline: "Built around your business, not a template.",
            description:
                "When your needs don’t fit a standard template or drag-and-drop builder, I design and build solutions around how your business actually works.",
            includes: [
                "Custom web applications with workflows specific to your business",
                "Bespoke themes and components that reflect your brand",
                "Deep integrations with CRMs or internal systems you already use",
                "Campaign-specific landing pages for signups, calls, or sales",
                "Microsites for events, launches, or side projects",
                "White-label or partner-friendly builds if you’re an agency",
            ],
            process: [
                { step: "Consultation", desc: "Digging into requirements, constraints, and ideas." },
                { step: "Proposal", desc: "Defining scope, milestones, and pricing." },
                { step: "Design", desc: "Designing flows and visuals tailored to your use case." },
                { step: "Development", desc: "Implementing features in stages with feedback." },
                { step: "Delivery", desc: "Launching and documenting the system for long-term use." },
            ],
        },
    },
];
