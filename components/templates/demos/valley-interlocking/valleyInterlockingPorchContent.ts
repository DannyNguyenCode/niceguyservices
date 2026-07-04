/** Porch service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_PORCH_STYLES_CTA = {
  eyebrow: "Porch Styles",
  headline: "Find a Porch Style That Complements Your Home",
  description:
    "From Victorian lacework and Spanish arcades to Craftsman columns and Greek Revival grandeur, we'll help you choose a design that matches your architecture and how you want to use the space.",
  cta: {
    label: "Get Your Porch Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PORCH_BUILD_CTA = {
  eyebrow: "How to Build a Porch",
  headline: "Reach Out To Us For A Quote",
  description:
    "From permits and materials to size, traffic flow, and year-round use, Valley Interlocking & Landscaping has the expertise to guide you through every step and build the perfect porch for your property.",
  cta: {
    label: "Let's Plan Your Outdoor Space",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_PORCH_SERVICE = {
  name: "Porch",
  category: "Outdoor Living",
  sections: [
    {
      heading: "Porch",
      content: [
        "Porches are open rooms ideally situated at the entrance of your home, connecting the interior to the exterior of your home, thus making it an integral part of your properties architecture. Porches can either be small and simple, located in the front or back of your property or elaborate four-season wraparound spaces.",
      ],
    },
    {
      heading: "Porch Benefits",
      content: [
        "Having a front porch at your home can be a great way to socialize with friends and family whilst also adding elements of charm and relaxation to your property. If you're looking for a place to relax, entertain or greet family, friends or guests, having a porch can be an ideal addition to a well-designed home.",
        "Adding a porch to your home can be a smart investment that will get used year-round. You can add extra living space to your home by incorporating a porch into its design, including comfortable seating make it an ideal place to sit and watch the world go by.",
      ],
    },
    {
      heading: "Porch Styles",
      items: [
        {
          title: "Victorian Porch",
          imageKey: "victorian" as const,
          alt: "Ornate Victorian home with decorative wood lacework, turned balusters, and a grand front porch.",
          content: "Grand porches with ornamental wood lacework are common; with details including curved and turned balusters, towers and turrets.",
        },
        {
          title: "Spanish Porch",
          imageKey: "spanish" as const,
          alt: "Mediterranean home with arcaded porch corridors, stucco walls, and arched openings.",
          content: "Arcaded porches and corridors with arches are common with this style.",
        },
        {
          title: "Craftsman Porch",
          imageKey: "craftsman" as const,
          alt: "Craftsman bungalow with thick square columns, stone piers, and a welcoming covered porch.",
          content: "Homes featuring the craftsman-style porches will have a thick, prominent square or round columns and stone or brick piers.",
        },
        {
          title: "Ranch-Style Porch",
          imageKey: "ranch" as const,
          alt: "Low-profile ranch home with a wide porch overhang emphasizing horizontal architectural lines.",
          content: "Traditional ranch homes that hug the ground have porches with large overhangs that emphasize the horizontal lines of the home.",
        },
        {
          title: "Colonial Porch",
          imageKey: "colonial" as const,
          alt: "Symmetrical colonial home with a formal front porch and balanced facade detailing.",
          content:
            "Are characterized by rectangular, symmetrical and formal styles. Grids added in open gable of a modern Colonial front porch can be a great way to highlight the windows of your home.",
        },
        {
          title: "Greek Revival Porch",
          imageKey: "greekRevival" as const,
          alt: "Greek Revival residence with tall columns and a classical pediment above the front porch.",
          content: "Following the ancient Greek temple model, having rows of tall columns and pediments.",
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
      heading: "Front Porch",
      content: [
        "Front porches are a great way to transform small spaces into amazing living areas, for one or two people, or having larger porches you can also use for light entertaining and alfresco dining. Having a standout entrance in the form of a front porch will highlight the main focal point of your property, enhancing its curb appeal.",
        "Transforming the appearance of your home and making the front door more pronounced will enhance your home aesthetics complementing's the style of your home. An added benefit of having a front porch is that it will highlight the functionality of your home. Having extra functional areas provide additional living space and entertainment areas, great features for potential buyers if you ever choose to sell.",
        "A front porch will provide your front door with some extra protection from the elements, like the sun, rain, and snow, which is something not to overlook living in Canada. Taking advantage of this extra protection you can utilize your porch to de-clutter your home. Add shoe racks can help remove dirt and debris from being dragged through the home.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Back Porch",
      content: [
        "Using Valley Interlock to help you design and build your porch, we'll be able to advise you on the best porch for your property and where the optimum location for it. Porches have different designs and functions. Some are designed for greeting family and friends, whilst others are personal relaxation spaces to enjoy your backyard.",
        "The most traditional type of porch is the front porch. Front porches are extremely popular nowadays with both new constructions and property remodels. A back porch, usually more informal than a front porch, will offer you more flexibility, being a great way to connect your kitchen to the garden area making it perfect for entertaining or alfresco dining.",
        "When designing a back porch, you need to spend some time integrating how the porch will connect with your home. Wraparound porches can extend your living space, making your home feel more expansive.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "How to Build a Porch",
      content: [
        "When deciding if having a front porch is right for you, carefully consider your goals, by asking yourself how you are going to use this space. You'll also want to maximize the use of your front porch, making sure the location works with the rest of your home.",
        "Once you've decided what your ideal porch looks like, set out a layout that will help you create a design for your outdoor space. Determining the size of your porch is critical, as space can impact functionality. A small table and a couple of chairs take up less space than if you plan on using it for alfresco dining or entertaining.",
        "Ideal porch sizes should aim to be a minimum of six feet, but a depth of eight feet or more will give you more options. A porch is much bigger than just the front area of your house, you'll need to be able to circulate and move freely when using it. As Toronto and the GTA, as well as Edmonton and the surrounding areas, experience all the weather elements, you need to think if you will only use the porch in the summer months or if you'll want to use it year-round.",
        "How user-friendly will your porch be? What will be the best entry and exit point to your porch, encouraging good traffic flow? If your porch is in the back of your property, you have the option of using French doors or bifold doors offering easy access and letting in some natural light.",
        "You can also design your porch for entertaining. If you're lucky enough to have a large amount of space to use, you can create a destination for guests to enjoy, with separate sitting and dining areas. Having an all-weather patio set up allows you to enjoy sitting out there enjoying conversations and cocktails year-round, regardless of the weather. Setting a budget is critical, as it's extremely easy to get carried away designing your pergola with exotic materials.",
        "You'll need to choose your structure material, roofing options, and then the type of flooring. With endless options, the costs can quickly add up and blow out your budget. With Canada's unique climate and conditions, it's a good idea to go with a local company that has a strong and proven reputation in the local market like Valley Interlocking & Landscaping to help build your porch.",
        "You'll need to get the correct build approvals for your porch, you should always check with your local city's building authority to make sure you apply for any necessary permits before you start building. Porches are available in a variety of designs, styles, and configurations. Valley Interlocking & Landscaping has the expertise and experience to show you all of your options and help you create the perfect porch for your property.",
      ],
      designConsiderations: [
        "Purpose and functionality",
        "Location and traffic flow",
        "Porch size and depth",
        "Seasonal usage",
        "Entry and exit points",
        "French doors or bifold doors",
        "Entertainment areas",
        "Material selection",
        "Roofing options",
        "Flooring options",
        "Budget planning",
        "Building permits",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
  ],
} as const;
