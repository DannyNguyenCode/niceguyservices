/** Pergola service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_PERGOLA_DESIGNED_CTA = {
  eyebrow: "Perfolas - Designed For You",
  headline: "A Pergola That Fits Your Backyard and Budget",
  description:
    "From affordable shade solutions to retractable covers and custom layouts, we'll help you design a pergola that makes your outdoor space more enjoyable year-round.",
  cta: {
    label: "Get Your Pergola Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PERGOLA_BUILD_CTA = {
  eyebrow: "How to Build a Pergola",
  headline: "Reach Out To Us For A Quote",
  description:
    "From location and sizing to materials, permits, and installation, Valley Interlocking & Landscaping has the expertise to guide you through every step and build the perfect pergola for your property.",
  cta: {
    label: "Talk With Our Team",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PERGOLA_SERVICE = {
  name: "Pergolas",
  category: "Outdoor Living",
  sections: [
    {
      heading: "Pergolas",
      content: [
        "A pergola is an easy but elegant structure that can add a lot of appeal to your yard. They can transform your outdoor area into the perfect living space, ideal for entertaining your family and friends or just sitting and watching the sunset. With landscaping enhancements such as a pergola, it can help create some character and personality to your home, especially when entertaining family and friends.",
      ],
    },
    {
      heading: "Pergola Benefits",
      content: [
        "If you enjoy entertaining and spending time in your backyard, a pergola would be the ideal addition. Pergolas are perfect for your backyard landscape. Being a simple structure they can transform your backyard into an outdoor entertainment area. Typically a pergola is built with roof beams and vertical beams without walls or a solid roof.",
        "A pergola would make a fantastic addition to your backyard landscape and increases the amount of time you can spend outside in your garden. Your pergola can be built out of a variety of materials that can be classed as either low maintenance or woods.",
      ],
    },
    {
      heading: "Pergola Features",
      items: [
        {
          imageDescription: "wooden pergola over a new wood deck",
          title: "Low-maintenance",
          content:
            "Materials have grown over the last few years, including powder-coated aluminum, PVC and composite materials. The most common wood options are cedar, redwood or pressure-treated wood.",
        },
        {
          imageDescription: "wooden pergola over a backyard patio",
          title: "Lightweight",
          content:
            "Choosing a lightweight and strong metal like aluminum for your pergola is a smart choice. With over 20 color options using new powder-coating technology.",
        },
        {
          imageDescription: "wooden pergola on an interlock stone patio",
          title: "Customization",
          content: "There are endless customization options for your designs. Options can include maximum shade, privacy, or minimal shade.",
        },
      ],
    },
    {
      heading: "Reach Out To Us For A Quote",
      type: "cta" as const,
    },
    {
      heading: "All Aspects Covered",
      items: ["Eco Friendly", "Ethical", "Maintained", "Groundwork", "Safety", "Clean & Tidy"],
    },
    {
      heading: "Perfolas - Designed For You",
      content: [
        "Due to a pergolas simple design structure, they can be relatively affordable if you're working with a limited budget and being a cheaper solution to building a large patio or a veranda.",
        "With a correctly designed pergola in your backyard, you can have enough shade to mark warm afternoons enjoyable whilst reading a book or entertaining and could also add a retractable shade cover to offer some protection from the elements.",
        "There are endless customization options for your designs. Options can include maximum shade, privacy, or minimal shade.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Pergola Styles",
      styles: [
        "Traditional Pergolas",
        "Shed Roof Pergola",
        "Curved Roof Pergola",
        "Pitched Roof Pergola",
        "Freeform Pergola",
        "Retractable Pergolas",
        "Adjustable Louvre Pergolas",
        "Thatched Pergolas",
        "Shade Sails",
        "Privacy Screen Pergolas",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "How to Build a Pergola",
      content: [
        "You need to carefully plan where the best location will be for your new pergola. As your pergola will be free-standing the location of it can be either next to your home or stand alone in your garden.",
        "If you choose to have your pergola set back in your backyard, you'll have greater flexibility with design and style, as won't have to match your home or distract from it, having its very own personality. Pergolas generally don't tend to take up a lot of space, but you'll still want to have a pergola that has an adequate amount for you to use practically but doesn't overwhelm your backyard.",
        "Visualizing helps you determine how big it will be before you start building, so it's a good idea to mark out the size of your potential pergola with stake posts. Using Valley Interlock to help you design and build your pergola, we'll be able to advise you on the best pergola for your backyard and where the optimum location for it.",
        "Your pergola could be exempt from building permits depending on the size and location. Whilst this is no guarantee, you should always check with your local city's building authority to make sure you apply for any necessary permits before you start building. Setting a budget is critical, as it's extremely easy to get carried away designing your pergola with exotic materials.",
        "You'll need to choose your structure material, roofing options and then the type of flooring. With the endless options, the costs can quickly add up and blow out your budget.",
        "You should also factor in your long term plans into your new pergola design. This could just be a starting point, and you could choose to add landscaping in the future. The key to a successful pergola design is good planning. Dedicate some time to visiting the team at Valley Interlocking & Landscaping, and having them talk you through your design options and material selections.",
        "Pergolas are available in a variety of designs, styles, and configurations. Valley Interlocking & Landscaping has the expertise and experience to show you all of your options and help you create the perfect pergola for your backyard.",
      ],
      planningConsiderations: [
        "Location selection",
        "Attached vs freestanding pergola",
        "Size planning",
        "Stake-out visualization",
        "Building permit requirements",
        "Budget planning",
        "Material selection",
        "Roofing options",
        "Flooring options",
        "Future landscaping plans",
        "Long-term expansion considerations",
      ],
      materials: [
        "Powder-Coated Aluminum",
        "PVC",
        "Composite",
        "Cedar",
        "Redwood",
        "Pressure-Treated Wood",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
  ],
} as const;
