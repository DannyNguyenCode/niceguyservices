/** Toronto location page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_TORONTO_LOCATION = {
  name: "Toronto Location",
  title: "Valley Interlocking & Landscaping Toronto",
  hero: {
    headline: "Valley Interlocking & Landscaping Services - Toronto",
    subheadline: "Transforming Toronto's Outdoor Spaces with Unmatched Craftsmanship and Innovative Design",
    cta: {
      label: "Contact Us Today",
      url: "/contact-valley-interlock/",
    },
  },
  introduction: [
    "At Valley Interlocking & Landscaping Toronto, we are committed to enhancing the beauty and functionality of your outdoor spaces.",
    "With years of experience and a reputation for excellence, our team provides top-tier landscaping services that elevate the aesthetics and value of your property.",
  ],
  whyChooseUs: {
    title: "Why Choose Valley Interlocking & Landscaping Toronto?",
    items: [
      {
        title: "Extensive Experience",
        description:
          "Our team consists of seasoned professionals who bring a wealth of expertise to every project, ensuring impeccable results.",
      },
      {
        title: "Superior Craftsmanship",
        description:
          "We focus on delivering meticulous workmanship and high-quality finishes in all our landscaping endeavours.",
      },
      {
        title: "Client-Centred Approach",
        description:
          "We prioritise our clients' needs and preferences, striving to exceed their expectations with every project we undertake.",
      },
    ],
  },
  services: {
    title: "Our Comprehensive Services",
    introduction:
      "At Valley Interlocking & Landscaping Toronto, we specialize in providing a wide array of landscaping services customized to suit your unique requirements. Whether you're looking to transform your outdoor space or enhance its functionality, we've got you covered with our comprehensive range of offerings.",
    items: [
      {
        name: "Interlocking Stone Solutions",
        image: "stone interlocking patio with stone firepit and stone bench",
        description:
          "Elevate your driveways, walkways, and patios with our durable and visually stunning interlocking stone installations. Our designs blend functionality with aesthetic appeal, ensuring a long-lasting and attractive finish.",
      },
      {
        name: "Custom Landscape Design",
        image: "front interlocking walkway and stairs with landscape design",
        description:
          "Collaborate with our creative landscape designers to develop a personalised plan that reflects your style and enhances your property's outdoor spaces. We focus on creating cohesive designs that maximise beauty and functionality.",
      },
      {
        name: "Planting and Garden Design",
        image: "stone pathway with landscaping plants on either side of walkway",
        description:
          "Add vibrant colours and lush greenery to your yard with our expert planting and garden design services. We select the best plants for your environment, ensuring a thriving, low-maintenance garden.",
      },
      {
        name: "Retaining Wall Construction",
        image: "stone waterfall with outdoor underledge lighting",
        description:
          "Construct sturdy and attractive retaining walls that provide essential support while adding a distinct visual element to your landscape. Our walls are designed to be both functional and aesthetically pleasing.",
      },
      {
        name: "Outdoor Living",
        image: "pergola with outdoor fireplace bar and stone patio",
        description:
          "Create the perfect outdoor retreat with our custom-built patios, fire pits, and outdoor kitchens. These features are designed for comfort and entertainment, transforming your backyard into an inviting living space.",
      },
      {
        name: "Landscape Lighting",
        image: "stone retaining wall with lighting",
        description:
          "Illuminate your outdoor areas with our professionally installed landscape lighting solutions. Our lighting enhances the ambience, safety, and usability of your outdoor spaces, making them enjoyable day and night.",
      },
      {
        name: "Structural Steel Installation",
        image: "stone retaining wall with lighting",
        description:
          "Professional installation services for structural and miscellaneous steel, tailored for residential, commercial, and industrial projects, guaranteeing strength and accuracy in all constructions.",
      },
    ],
  },
  process: {
    title: "Our Process",
    steps: [
      {
        step: 1,
        title: "Initial Consultation",
        description: "We begin with a complimentary consultation to understand your vision and assess your outdoor space.",
      },
      {
        step: 2,
        title: "Design",
        description: "Our design team creates a comprehensive plan tailored to your preferences and requirements.",
      },
      {
        step: 3,
        title: "Project Execution",
        description: "We use top-quality materials and expert techniques to bring your landscape design to fruition.",
      },
      {
        step: 4,
        title: "Final Review",
        description: "Upon completion, we conduct a thorough walkthrough to ensure every detail meets your satisfaction.",
      },
    ],
  },
  reviews: {
    title: "Why Our Clients Love Us",
    rating: "EXCELLENT",
    reviewCount: 42,
    platform: "Google",
  },
  cta: {
    title: "GET A QUOTE",
    buttonText: "GET A QUOTE",
    url: "/get-a-quote/",
  },
} as const;

export const VI_TORONTO_SERVICES_CTA = {
  eyebrow: "Toronto & GTA",
  headline: "Ready to Start Your Toronto Landscaping Project?",
  description:
    "Whether you need interlocking stone, custom landscape design, retaining walls, outdoor living spaces, or lighting, our Toronto team will tailor a plan to your property and provide a detailed, no-obligation quote.",
  cta: {
    label: "Get A Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_TORONTO_FINAL_CTA = {
  eyebrow: "Toronto",
  headline: "Ready to Transform Your Toronto Property?",
  description:
    "Join hundreds of homeowners in the Toronto region who have chosen Valley Interlocking for superior quality and enduring style.",
  cta: {
    label: "Get Your Free Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;
