/** Edmonton location page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_EDMONTON_LOCATION = {

  name: "Edmonton Regional Office",

  title: "Valley Interlocking & Landscaping Edmonton",

  hero: {

    headline: "Valley Interlocking & Landscaping Services - Edmonton",

    subheadline: "Elevating Edmonton's Landscapes with Expertise and Flawless Execution",

    cta: {

      label: "Contact Us Today",

      url: "/get-a-quote/",

    },

  },

  introduction: {

    heading: "Bringing Excellence to Edmonton",

    content: [

      "Valley Interlocking & Landscaping is proud to bring our years of specialized expertise from Toronto to the Edmonton community. We've built our reputation on transforming ordinary outdoor spaces into architectural masterpieces that stand the test of time and climate.",

    ],

  },

  whyChooseUs: {

    title: "Why Choose Valley Interlocking & Landscaping Edmonton?",

    items: [

      {

        title: "Expertise and Experience",

        description:

          "Leveraging decades of landscape engineering and design knowledge to serve Alberta's capital.",

      },

      {

        title: "Quality Craftsmanship",

        description: "Meticulous attention to every joint, stone, and plant to ensure a flawless finish.",

      },

      {

        title: "Customer Satisfaction",

        description:

          "A client-first approach that ensures your vision is translated into a breathtaking reality.",

      },

    ],

  },

  services: {

    title: "Our Comprehensive Services",

    introduction:

      "Expert landscaping solutions specifically engineered for Edmonton's unique environment and seasonal challenges.",

    items: [

      {

        name: "Interlocking Stone Solutions",

        description:

          "Driveways, walkways, and patios engineered for Edmonton's sub-zero winters and freeze-thaw cycles. We use deep-base preparation to prevent shifting.",

      },

      {

        name: "Custom Landscape Design",

        description:

          "Innovative, sustainable designs that integrate natural elements. We create 3D visualizations to help you walk through your dream yard before construction begins.",

      },

      {

        name: "Planting and Garden Design",

        description:

          "Resilient gardens specifically curated for Edmonton's zone. We select hardy perennials and shrubs that thrive in our local prairie climate.",

      },

      {

        name: "Outdoor Living",

        description:

          "Expand your home with custom patios, fire pits, and outdoor kitchens. Designed to maximize your enjoyment of Edmonton's vibrant summer months.",

      },

      {

        name: "Landscape Lighting",

        description:

          "Enhancing safety, functionality, and ambience. Our lighting systems highlight architectural features and keep your property secure and beautiful after dark.",

      },

      {

        name: "Deck & Fence Construction",

        description:

          "High-quality materials and expert carpentry for added value and privacy. We build durable structures designed to withstand high winds and heavy snow.",

      },

      {

        name: "Retaining Wall Construction",

        description:

          "Engineered for both structural support and visual appeal. Perfect for terracing sloped properties and creating distinctive garden tiers.",

      },

      {

        name: "Structural Steel Installation",

        description:

          "Industrial-grade durability and precision for advanced landscape features. We provide specialized support for modern, heavy-duty architectural elements.",

      },

      {

        name: "Home Renovation",

        description:

          "Professional interior transformations including kitchens, bathrooms, and basements. Seamlessly matching your interior luxury with your exterior landscape.",

      },

    ],

  },

  trust: {

    title: "Why Edmonton Homeowners Trust Valley Interlocking & Landscaping",

    content: [

      "Our reputation is built on a unwavering dedication to quality and a deep understanding of Edmonton's unique climate. We don't just build landscapes; we engineer enduring outdoor environments that handle everything from summer heatwaves to the deepest Alberta winters.",

    ],

  },

  reviews: {

    title: "Hear From Our Satisfied Clients",

    rating: "EXCELLENT",

    reviewCount: 42,

    platform: "Google",

  },

  cta: {

    title: "Ready to Transform Your Edmonton Property?",

    content:

      "Join hundreds of homeowners in the Edmonton region who have chosen Valley Interlocking for superior quality and enduring style.",

    buttonText: "GET A QUOTE",

    url: "/get-a-quote/",

  },

} as const;

export const VI_EDMONTON_SERVICES_CTA = {
  eyebrow: "Edmonton & Area",
  headline: "Ready to Start Your Edmonton Landscaping Project?",
  description:
    "From interlocking built for Alberta winters to custom landscape design, decks, retaining walls, and lighting, our Edmonton team will tailor a solution to your property and provide a detailed, no-obligation quote.",
  cta: {
    label: "Get A Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_EDMONTON_FINAL_CTA = {
  headline: "Ready to Transform Your Edmonton Property?",
  description:
    "Join hundreds of homeowners in the Edmonton region who have chosen Valley Interlocking for superior quality and enduring style.",
  cta: {
    label: "Get Your Free Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;
