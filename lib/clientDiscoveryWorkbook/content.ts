import type { WorkbookContent } from "./types";

export const WORKBOOK_CONTENT: WorkbookContent = {
    page: {
        title: "Client Discovery Workbook",
        subtitle:
            "Help us understand your business, goals, audience, and website needs before we begin your project.",
        purpose:
            "This workbook helps collect the information needed to plan, design, build, and later document a website case study.",
        completionOptions: [
            "Complete online and submit",
            "Download as PDF",
            "Print and complete by hand",
        ],
    },
    sections: [
        {
            id: "business_information",
            title: "Business Information",
            description: "Basic details about the client or business.",
            fields: [
                { name: "businessName", label: "Business Name", type: "text", required: true },
                { name: "contactName", label: "Main Contact Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "text" },
                { name: "location", label: "Location / Service Area", type: "text" },
                { name: "industry", label: "Industry", type: "text" },
                { name: "currentWebsite", label: "Current Website, if any", type: "text" },
                { name: "socialLinks", label: "Social Media Links", type: "textarea" },
            ],
        },
        {
            id: "project_goals",
            title: "Project Goals",
            description: "What the website should accomplish.",
            fields: [
                {
                    name: "whyWebsite",
                    label: "Why do you want a new website?",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "mainGoals",
                    label: "What are your main goals for this website?",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "successDefinition",
                    label: "What would make this project successful?",
                    type: "textarea",
                },
                {
                    name: "biggestProblems",
                    label: "What problems are you currently experiencing?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "target_audience",
            title: "Target Audience",
            description: "Who the website is meant to attract.",
            fields: [
                {
                    name: "idealCustomer",
                    label: "Who is your ideal customer or visitor?",
                    type: "textarea",
                    required: true,
                },
                { name: "customerLocation", label: "Where are your customers located?", type: "text" },
                {
                    name: "customerNeeds",
                    label: "What problems do your customers need solved?",
                    type: "textarea",
                },
                {
                    name: "visitorAction",
                    label: "What action should visitors take?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "services_or_portfolio",
            title: "Services / Portfolio Content",
            description: "The core content that will appear on the website.",
            fields: [
                {
                    name: "mainServices",
                    label: "List your main services, products, or portfolio categories.",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "featuredWork",
                    label: "What work, projects, products, or services should be featured?",
                    type: "textarea",
                },
                {
                    name: "pricingInfo",
                    label: "Do you want pricing shown on the website?",
                    type: "textarea",
                },
                {
                    name: "importantDetails",
                    label: "Are there important details customers should know before contacting you?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "brand_discovery",
            title: "Brand Discovery",
            description: "The tone, personality, and story behind the brand.",
            fields: [
                {
                    name: "brandDescription",
                    label: "Describe your business or personal brand in one sentence.",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "brandPersonality",
                    label: "What words describe your brand? Example: modern, friendly, premium, playful, professional.",
                    type: "textarea",
                },
                {
                    name: "whatMakesDifferent",
                    label: "What makes you different from competitors?",
                    type: "textarea",
                },
                {
                    name: "brandStory",
                    label: "Tell us your story. Why did you start or pursue this work?",
                    type: "textarea",
                },
                {
                    name: "visitorFeeling",
                    label: "How should visitors feel when they land on your website?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "website_pages",
            title: "Website Pages & Features",
            description: "Pages and functionality needed for the website.",
            fields: [
                {
                    name: "requiredPages",
                    label: "Which pages do you need? Example: Home, About, Services, Portfolio, Contact, FAQ.",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "features",
                    label: "What features do you need? Example: contact form, booking button, gallery, downloads, cart, login.",
                    type: "textarea",
                },
                {
                    name: "formsNeeded",
                    label: "Do you need any forms? If yes, what should they collect?",
                    type: "textarea",
                },
                {
                    name: "downloads",
                    label: "Do you need downloadable files such as resume, menu, forms, brochures, or PDFs?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "design_preferences",
            title: "Design Preferences",
            description: "Visual direction for the website.",
            fields: [
                {
                    name: "websitesLiked",
                    label: "List websites you like and explain why.",
                    type: "textarea",
                },
                {
                    name: "websitesDisliked",
                    label: "List websites you dislike and explain why.",
                    type: "textarea",
                },
                { name: "colors", label: "Preferred colors or colors to avoid.", type: "textarea" },
                {
                    name: "styleDirection",
                    label: "Preferred style. Example: clean, luxury, playful, bold, minimal, corporate.",
                    type: "textarea",
                },
                {
                    name: "logosAssts",
                    label: "Do you have a logo, photos, videos, or brand assets ready?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "seo_geo",
            title: "SEO & AI Search Planning",
            description:
                "Information that helps the website appear in search engines and AI-generated recommendations.",
            fields: [
                {
                    name: "keywords",
                    label: "What words or phrases should people search to find you?",
                    type: "textarea",
                },
                {
                    name: "locations",
                    label: "What cities, neighbourhoods, or service areas matter?",
                    type: "textarea",
                },
                {
                    name: "competitors",
                    label: "List competitors or similar businesses.",
                    type: "textarea",
                },
                {
                    name: "commonQuestions",
                    label: "What questions do customers often ask?",
                    type: "textarea",
                },
            ],
        },
        {
            id: "case_study_notes",
            title: "Case Study Notes",
            description: "These answers may help create a future project case study.",
            fields: [
                {
                    name: "beforeWebsite",
                    label: "What was missing or not working before this website?",
                    type: "textarea",
                },
                {
                    name: "projectChallenge",
                    label: "What challenge should this website solve?",
                    type: "textarea",
                },
                {
                    name: "expectedOutcome",
                    label: "What outcome are you hoping for after launch?",
                    type: "textarea",
                },
                {
                    name: "testimonialPermission",
                    label: "Would you be open to providing a testimonial after launch?",
                    type: "select",
                    options: ["Yes", "No", "Maybe"],
                },
            ],
        },
    ],
};
