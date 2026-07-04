/** Interlocking service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_INTERLOCKING_SERVICE = {
  name: "Interlocking & Paving",
  category: "Hardscaping",
  sections: [
    {
      heading: "Interlocking & Paving",
      content: [
        "Paving stones can provide a beautiful and long-lasting surface to enhance your home or outdoor entertainment areas, creating more space for you and your family to enjoy. Using interlocking paving stones can help you to create the perfect outdoor space.",
      ],
    },
    {
      heading: "Interlocking Pavers",
      content: [
        "Coming in a variety of different styles, textures, and colors there are endless options to customize your personalized look. You can also combine colors, designs, and shapes. The possibilities when using interlocking pavers are only limited to your imagination.",
        "Interlocking pavers do just that, they interlock with each other. An interlocking paver is most commonly made from cement, concrete, or natural stone like limestone or travertine, and designed to replicate the effects of cobblestone pathways. Using this special interlocking design feature enables the pavers to be easily installed, without the use of mortar.",
        "Being easy to install means you can do it yourself, or get professional contractors to install your interlock pavers at your home. Interlocking pavers connect by using sand, covering any decking, driveway, gazebo, pergola, patio, or walkway. Pavers are laid in a pattern, leaving a bit of space in between each and every interlocking paver. They are a great alternative to any application that you would normally decide to use bricks or concrete for.",
        "Interlocking pavers come in a variety of styles, shapes, and colors. They are also easy to install, repair or replace, and will add value to your home.",
      ],
    },
    {
      heading: "Benefits of using Interlocking pavers",
      items: [
        {
          imageReference: "drive-service-03",
          title: "Durable",
          content:
            "Using high-quality stone or concrete pavers can last up to 40 years with little to no upkeep. Pavers that are installed correctly little to no future repairs.",
        },
        {
          imageReference: "rock-service-03",
          title: "Installation",
          content:
            "Paving stones have been designed for easy installation, and using interlocking pavers can make this process even easier. Installation can be done quickly and easily because of the shape and size of the interlocking pavers, saving you money.",
        },
        {
          imageReference: "drive-service-02",
          title: "Weather Resistant",
          content:
            "Interlocking pavers are ideal in any climate and can be used immediately after installation. Asphalt and concrete pavements tend to crack, whereas cracking does not affect interlocking pavers because of the joints between the pavers.",
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
      heading: "Interlocking Pavers have the following qualities",
      items: [
        {
          title: "Strength",
          bullets: ["High Strength", "4x Stronger than Concrete"],
        },
        {
          title: "Flexibility",
          bullets: ["Flexible", "Will Not Crack"],
        },
        {
          title: "Maintenance",
          bullets: ["Low Maintenance", "Easily replaced if needed"],
        },
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "How to Lay Interlocking Stones",
      content: [
        "Before laying interlocking pavers it's important to have a well compacted stable base. You should remove all the unstable material.",
        "Now you'll need to compact the soil for the paver base. Here is a guide to how much soil will need to be compacted.",
        "Having filled the area you are wishing to pave with an appropriate amount of sand or base material, you'll need to compact the area use a compactor with a vibrating plate.",
        "Making sure you have a well compacted and level base to provide a smooth and even surface. Also, don't forget to make allowances for adequate drainage.",
      ],
      bullets: [
        "3 to 4 inches for pedestrian usage",
        "4 to 5 inches for vehicular traffic",
        "6 to 8 inches for commercial vehicles",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Laying Bedding Sand",
      content: [
        "Help to secure the interlocking pavers in place, a bed of sand is necessary to provide a final leveling.",
        "Only use clean concrete sand, approximately 1 inch deep. Sand quality matters make sure you use quality sand, that's not contaminated with any other materials.",
        "You'll need 1 cubic yard of concrete sand per 300 square feet of paving area.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
  ],
} as const;

export const VI_INTERLOCKING_BENEFITS_CTA = {
  eyebrow: "Benefits of using Interlocking pavers",
  headline: "Durable, Easy to Install, and Built for Any Climate",
  description:
    "Interlocking pavers last for decades with minimal upkeep, install faster than poured concrete, and flex with the seasons instead of cracking. See how Valley Interlocking & Landscaping puts them to work on driveways, patios, and walkways.",
  cta: {
    label: "Get Your Interlocking Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_INTERLOCKING_QUALITIES_CTA = {
  eyebrow: "Interlocking & Hardscaping",
  headline: "See What's Possible for Your Property",
  description:
    "From elegant front entrances to complete backyard retreats, we design and build outdoor spaces that add beauty, functionality, and value.",
  cta: {
    label: "Get Your Free Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;
