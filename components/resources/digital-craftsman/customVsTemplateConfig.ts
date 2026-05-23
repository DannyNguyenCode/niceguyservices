export const CUSTOM_VS_TEMPLATE_PATH = "/resources/custom-vs-template-websites";

export const CUSTOM_VS_TEMPLATE_TOC = [
    { id: "intro", label: "Introduction" },
    { id: "template", label: "Template Websites" },
    { id: "custom", label: "Custom Websites" },
    { id: "when-template", label: "When Templates Fit" },
    { id: "when-custom", label: "When Custom Fits" },
    { id: "seo-ux", label: "SEO & User Experience" },
    { id: "mistakes", label: "Common Mistakes" },
    { id: "final-thoughts", label: "Final Thoughts" },
] as const;

export const CUSTOM_VS_TEMPLATE_RELATED = [
    {
        title: "How Websites Generate Leads for Local Businesses",
        href: "/resources/how-websites-generate-leads-for-local-businesses",
        year: "2026",
    },
    {
        title: "SEO Basics for Local Businesses",
        href: "/resources/seo-basics-for-local-businesses",
        year: "2026",
    },
] as const;

export const CUSTOM_VS_TEMPLATE_TAKEAWAYS = [
    "Both template and custom websites can work well.",
    "Templates often provide faster and more affordable launches.",
    "Custom websites provide greater flexibility and branding control.",
    "SEO depends more on implementation quality than platform choice alone.",
    "User experience and clarity matter most.",
    "The right choice depends on business goals, budget, and long-term plans.",
] as const;

export const DECISION_QUESTIONS = [
    "What is the primary goal of the website?",
    "How important is unique branding?",
    "What is the available budget?",
    "How quickly does the website need to launch?",
    "Will the business likely expand functionality later?",
    "How important are SEO and performance long term?",
    "Who will manage the website after launch?",
] as const;
