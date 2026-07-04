/** Patio installation service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_PATIO_CTA = {
  headline: "Design Your Dream Patio",
  description:
    "Take the first step toward your personal outdoor retreat. Schedule a consultation with our team today.",
  cta: {
    label: "Bring Your Vision to Life",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PATIO_DESIGN_CTA = {
  eyebrow: "Patio Design & Placement",
  headline: "Plan a Patio That Fits Your Home and Lifestyle",
  description:
    "From seamless indoor-outdoor flow to a tucked-away garden retreat, we'll help you choose the right location, layout, and materials for how you live.",
  cta: {
    label: "Get Your Patio Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PATIO_SERVICE = {
  name: "Patio",
  category: "Outdoor Living",
  sections: [
    {
      heading: "Patio",
      content: [
        "Deciding to add a patio to your property can be a great addition, improving your backyard and increasing your usable living space. They can also be an ideal way to extend your living and entertaining space without the huge expense of building additional rooms to your home. Patios can be used year-round bring your family and friends together for hours of entertainment and enjoyment.",
      ],
    },
    {
      heading: "All Aspects Covered",
      items: ["Eco Friendly", "Ethical", "Maintained", "Groundwork", "Safety", "Clean & Tidy"],
    },
    {
      heading: "Patio Value and Benefits",
      content: [
        "Having a patio will enable you to have a huge amount of extra space for your home. They can be great in summer with alfresco dining and outdoor grilling, or even turn it into your own yoga studio. Your patio can even be turned into your winter escape during the cold months, making it the perfect addition to your home.",
        "Patios are a very affordable way to increase the value of your property and are great value for money. They offer a higher return on investment.",
        "A well-built patio generally increases the value of your property by 12 percent. You pay less for your patio and it offers you a better return on investment. Patios are very low maintenance and require very little upkeep to make them looking great year-round, only requiring a resealing every 2 or 3 years.",
        "A properly installed patio will have a long lifespan, averaging approximately 20 years. The materials used are now extremely durable, and weather-resistant to the extreme heat, cold, snow and rain. Make sure your patio is installed by a reputable contractor like Valley Interlock. Patios can come in and shape or size and they can add interesting elements or features to your home's design.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Patio Design and Placement",
      content: [
        "You can decide to have your patio feel like an addition to your existing home, or strategically paces in your backward for that hidden effect. The location you select for your patio will influence your design, along with your home's style, size of your block, budget and what your patios primary use will be.",
        "Patios can come with our without covers or roofs, and usually have paved areas between your home and your backyard garden. Pavers can include a choice of brick, flagstone, stone or even concrete or gravel.",
        "When designing your patio, you can choose to locate it near your kitchen to increase your cooking and dining area or locate it next to your den or living room to give you more entertaining or relaxing space.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Curated Material Palette",
      intro:
        "Select from a range of high-performance materials tailored to match your home's unique architectural character.",
      materials: [
        {
          name: "Brick",
          tagline: "Timeless & Durable",
          imageKey: "brick" as const,
          alt: "Close-up of classic red clay bricks laid in a traditional herringbone pattern with warm, weathered tones.",
        },
        {
          name: "Flagstone",
          tagline: "Organic Mosaic",
          imageKey: "flagstone" as const,
          alt: "Irregular flagstone pavers in a soft blue-gray palette fitted in an organic mosaic with thin sand joints.",
        },
        {
          name: "Natural Stone",
          tagline: "Luxury Statement",
          imageKey: "naturalStone" as const,
          alt: "Premium limestone and granite slabs with mineral veins in creamy beige and deep charcoal tones.",
        },
        {
          name: "Concrete",
          tagline: "Modern Utility",
          imageKey: "concrete" as const,
          alt: "Architectural stamped concrete in a light gray sand-finish with precise score lines.",
        },
        {
          name: "Aluminum",
          tagline: "Powder-Coated Profiles",
          imageKey: "aluminum" as const,
          alt: "Modern patio with a powder-coated aluminum pergola roof and clean outdoor living lines.",
        },
        {
          name: "Brickwork",
          tagline: "Structural Support",
          imageKey: "brickwork" as const,
          alt: "Close-up of red brickwork with mortar joints used for patio columns and structural supports.",
        },
        {
          name: "Galvanized Steel",
          tagline: "Weather-Resistant",
          imageKey: "galvanizedSteel" as const,
          alt: "Galvanized steel framing on a construction site, showing durable metal roof support structure.",
        },
        {
          name: "Timber",
          tagline: "Warm Character",
          imageKey: "timber" as const,
          alt: "Natural timber deck boards and warm wood grain for patio posts and beams.",
        },
        {
          name: "Shade Sail Fabric",
          tagline: "Flexible Coverage",
          imageKey: "shadeSail" as const,
          alt: "Outdoor poolside area with tensioned shade sail fabric providing flexible sun coverage.",
        },
      ],
    },
    {
      heading: "Patio Roofing Styles",
      intro:
        "Extend the seasonality of your outdoor space with a custom roofing structure designed to integrate seamlessly with your home's facade.",
      styles: [
        {
          name: "Flat Roof",
          icon: "horizontal_rule",
          description:
            "A sleek, minimalist profile ideal for modern homes. Offers a clean silhouette and can be integrated with lighting and heating elements.",
          features: ["Modern Aesthetics", "Cost-Effective"],
        },
        {
          name: "Gable Roof",
          icon: "change_history",
          description:
            "Classic pitched design that maximizes airflow and height. Perfect for creating a grand, open-air room feel with vaulted ceilings.",
          features: ["Superior Airflow", "Architectural Focus"],
        },
        {
          name: "Curved Roof",
          icon: "architecture",
          description:
            "A unique, organic shape that adds softness to the landscape. Excellent for contemporary designs seeking a softer visual transition.",
          features: ["High Design Appeal", "Custom Sculpting"],
        },
        {
          name: "Attached Patio",
          icon: "link",
          description:
            "Extends directly from your home for seamless indoor-outdoor flow. Flat roof designs are typically angled for water run-off.",
          features: ["Indoor-Outdoor Flow", "Space Efficient"],
        },
        {
          name: "Free Standing Patio",
          icon: "deck",
          description:
            "A standalone structure placed away from the home. Gable and curved roofs work beautifully as focal points in the landscape.",
          features: ["Flexible Placement", "Garden Focal Point"],
        },
        {
          name: "Open Patio",
          icon: "wb_sunny",
          description:
            "An uncovered design that maximizes sky views and natural light. Ideal when shade sails or partial covers are added later.",
          features: ["Maximum Light", "Open-Air Entertaining"],
        },
        {
          name: "Semi-Enclosed Patio",
          icon: "blinds",
          description:
            "Partial walls, screens, or louvered panels balance shelter and airflow. A versatile option between open and fully enclosed layouts.",
          features: ["Flexible Shelter", "Seasonal Comfort"],
        },
        {
          name: "Enclosed Patio",
          icon: "home",
          description:
            "Fully enclosed for year-round use with protection from sun, rain, and wind. Roof structures are supported by columns or integrated walls.",
          features: ["All-Weather Use", "Extended Living Space"],
        },
      ],
    },
  ],
} as const;
