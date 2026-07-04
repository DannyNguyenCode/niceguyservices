/** Landscaping service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_LANDSCAPING_SERVICE = {
  name: "Landscaping",
  category: "Landscaping",
  sections: [
    {
      heading: "Landscaping",
      content: [
        "Setting up your outdoor space starts with getting your landscaping just right. Regardless if you have a small or large outdoor space, that includes if you live in an apartment or condo, you have to make the most of your available space and live your outdoor dream.",
      ],
    },
    {
      heading: "Benefits of Landscaping",
      content: [
        "Having well-designed landscaping can set your property apart from others in the neighborhood and add value to your curbside appeal, inspiring others in the process. With the right landscaping ideas, you can make even a small backyard look and feel spacious. You can make your outdoor space into a great outdoor entertainment area that you can enjoy day or night, either by yourself or with family and friends entertaining.",
        "Landscaping your backyard or front yard is an investment that you need to nurture so it can grow. If you don't have the time to maintain it, get the professionals at Valley Interlocking & Landscaping to help you.",
        "To guarantee that you'll always have the best-looking landscaping in the neighborhood, get the professionals to manage your yard. At Valley Interlock Landscaping we pride ourselves on providing a professional, friendly and superior landscaping service.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "All Aspects Covered",
      items: ["Eco Friendly", "Ethical", "Maintained", "Groundwork", "Safety", "Clean & Tidy"],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Landscaping - Choosing What Best Suits You",
      content: [
        "One of the best ways to start with your landscaping ideas is to create a plan for your front or backyard. Start thinking about what you'd like to do in an outdoor space. It could be entertaining, relaxation or you could just like to dine alfresco in the evenings. Once you have an idea of what you want to do with your space, you can start looking for a theme that would suit your home and then come up with a budget.",
        "Defining backyard spaces can also be a good idea as if you're working with a small or limited budget, you can plan to landscape your space in phases. One of the bigger decisions is deciding if you want to add an outdoor structure like a gazebo, patio, pergola or even a porch. These can be costly if you have extravagant designs, so it's best to look at what options you have and what might be best suited to your budget. When planning to include an outdoor structure, you need to consider how much space it will take up, and what function it will serve.",
        "If it's going to be for outdoor entertaining, it will need to be able to fit 6 to 8 people around a table comfortably. Once your size is set, your backyard views come into play. If you have panoramic views, you'll want to have your structure open on all sides, whereas if you only have partial views, placement is critical to maximizing them.",
        "Weather elements like the sun, rain, wind, and snow can also affect your structure. You could suffer from the sun's glare and heat if your placement has been poorly chosen. If you are going to use the structure as an extra outdoor room, then enclosing it and roofing options come into consideration. Selecting the right materials for the construction, can either save you in the short term or the long term. There are low-cost maintenance options, but some are better than others, that being choosing an aluminum structure.",
        "Aluminum will last over 20 years, whilst selecting a timber option will have you out every few years performing maintenance.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Decking - How To Choose Which Feature(s) To Add",
      imageDescription: "stone pathway with landscaping plants on either side of walkway",
      content: [
        "With numerous options for decking, you can also choose to add features like paths and walkways to and from your home to your structure. These features can vastly increase the look and feel of your landscaping.",
        "Having a natural stone flagstone used to create your walkways will make your backyard stand out. Or you might prefer to use interlocking pavers which are also a great choice for your outdoor space.",
        "You should also be creative, to maximize the space that available to you. The choice of landscaping style can greatly impact how your space looks and if you overpower it with a simple structure or have the right placements.",
        "Using professional landscaping companies can help you design your outdoor space incorporating some great unique landscaping ideas that you may not have thought of.",
        "When you are selecting features for your outdoor space, like a pond or water feature, you need to choose options that aren't too bulky or only serve a single purpose. Wood box benches can be used as seats and for storage, that's a good use of space.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Some other landscaping ideas that may be overlooked",
      items: [
        {
          title: "Mulch Alternatives",
          content: [
            "Using mulch can save you time and money as it reduces the amount of water and weeding. But can be expensive if you have large areas to cover. There are other options you can use for mulching that you might not have thought about.",
          ],
          options: ["Compost", "Grass clippings", "Leaves", "Newspaper", "Pine Needles", "Stone"],
        },
        {
          title: "Vertical Gardens",
          content: [
            "It can be an easily overlooked idea for your backyard. They are especially great options if you have extremely limited space or you live in an apartment or condo only has a balcony. Vertical gardens are also a great solution to your landscaping needs if you have a small budget.",
          ],
        },
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Frequently Asked Question",
      content: [
        "When planning your new landscaping, you should take into consideration the process on how to create and design a plan and choosing the best ideas that suit your home.",
        "These are the questions the Valley Interlocking & Landscaping team gets asked the most;",
      ],
      questions: [
        "How Much Landscaping do I Need?",
        "Landscaping Specialities",
        "What is your Timelines?",
        "Design Plans",
        "Landscaping Specialties",
        "Do you do Maintenance Work?",
        "Why is Professional Maintenance Important?",
        "What's involved with a Landscape Design?",
        "How long will my Landscape Project Take?",
        "Can I do some of the Design Work?",
        "Who do I call after the Snow has fallen?",
      ],
    },
  ],
} as const;

export const VI_LANDSCAPING_OPTIONS_CTA = {
  eyebrow: "Landscape Planning",
  headline: "Need Help Choosing the Right Landscape Options?",
  description:
    "From outdoor structures to paths and decking, our team can guide you through the best choices for your space, budget, and lifestyle.",
  cta: {
    label: "Get Your Landscaping Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_LANDSCAPING_SECOND_CTA = {
  eyebrow: "Landscaping",
  headline: "Let's Create an Outdoor Space You'll Enjoy for Years",
  description:
    "Whether you're planning a new driveway, patio, pergola, landscape lighting project, or a complete backyard transformation, our team is ready to help bring your vision to life.",
  cta: {
    label: "Start Your Project",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;
