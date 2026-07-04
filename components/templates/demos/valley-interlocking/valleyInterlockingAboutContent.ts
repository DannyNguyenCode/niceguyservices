/** About page — content from site copy (no extra marketing). */
export const VI_ABOUT_PAGE = {
  name: "Building Beautiful Landscapes Since 2020.",
  sections: [
    {
      heading: "Our Mission",
      content: [
        "For the best landscapers in Toronto and Edmonton, look no further than Valley Interlock Landscaping. Offering a wide range of landscaping services to our customers, we can take care of your backyard, driveway, interlock pavers, lawn, pool, gazebo, pergola, patio, and any commercial areas.",
        "Not only specializing in residential and commercial properties, but we are also experts at providing our services in any public or municipal areas. If you're looking to start a new landscaping project at your home or commercial property, or you just want to improve your landscaping, call us at Valley Interlock Landscaping.",
      ],
    },
    {
      heading: "Our Experience",
      subsections: [
        {
          heading: "Our People",
          content: [
            "Our professionally trained and certified team will be more than happy to work with you, transforming and enhancing the beauty and value of your home.",
          ],
        },
        {
          heading: "Our Promise",
          content: [
            "We're ready to take care of all your landscaping needs, keeping your home or workplace looking beautiful every time.",
          ],
        },
      ],
    },
    {
      heading: "Some of Our Services",
      content: [
        "By choosing to use professional landscapers like us, you're guaranteed to have a great job done. Using professionals, you will increase the value of your property with your home's landscaping, and having your neighbors admiring your home.",
        "We can also help if you're looking to sell your home, adding extra value to the sale price of your property.",
        "We can help you with the following landscaping:",
      ],
      services: [
        "Lawn Mowing",
        "Weed Trimming",
        "Flowers, Shrubs and Tree Planting",
        "Trimming Hedges and Trees",
        "Fertilization",
        "Designing Gazebo, Pergola or Patio",
      ],
      ctas: [{ label: "EXPLORE ALL OUR SERVICES", url: "/our-services/" }],
    },
    {
      imageAlt: "stone pathway with landscaping plants on either side of walkway",
      heading: "About Valley Interlock",
      content: [
        "When it comes to landscaping, using professionals like us is a good idea. We know the right type of plants, retaining walls, and other materials that will make the landscaping of your home stand out.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Why Choose Us",
      content: [
        "Using only the best locally sourced materials in the market ensures that you get premium quality materials for your home's landscaping at an affordable price.",
        "Landscaping is now a form of art, and Valley Interlock we pride ourselves on being artists. One of the features we specialize in is interlocking paving.",
        "Our interlock paving is ideal for Toronto's and Edmonton's climate as it can withstand freeze-thaw climates, and isn't susceptible to cracking, unlike poured concrete.",
      ],
    },
  ],
} as const;

export const VI_ABOUT_CTA_AFTER_MISSION = {
  eyebrow: "Why Homeowners Choose Valley Interlock",
  headline: "Built on Craftsmanship, Trust, and Lasting Results",
  description:
    "For years we've helped homeowners across Toronto and Edmonton transform their outdoor spaces with premium materials, thoughtful design, and professional installation.",
  cta: {
    label: "Schedule a Free Consultation",
    url: "/get-a-quote/",
  },
} as const;

export const VI_ABOUT_CTA_BANNER = {
  eyebrow: "Ready to Start Your Project?",
  headline: "Let's Create an Outdoor Space You'll Enjoy for Years",
  description:
    "Whether you're planning a new driveway, patio, pergola, landscape lighting project, or a complete backyard transformation, our team is ready to help bring your vision to life.",
  cta: {
    label: "Get Your Free Quote",
    url: "/get-a-quote/",
  },
} as const;

export type ViAboutCtaBannerContent = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly description: string;
  readonly cta: {
    readonly label: string;
    readonly url: string;
  };
  readonly secondaryCta?: {
    readonly label: string;
    readonly url: string;
  };
};

export type ViCtaBannerContent = ViAboutCtaBannerContent;
