/** Landscape lighting service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";
import type { ViServiceBodyCopyContent } from "./valleyInterlockingServiceTypes";

export const VI_LIGHTING_BODY_COPY = {
  quote:
    "Once you've invested in landscaping your property, lighting breathes new life into your garden when the sun sets.",
  paragraphs: [
    "With a carefully designed outdoor lighting system, you can enjoy your front and backyard even after the sun goes down. Not only does it make your yard and landscaping visible in the dark, but it also helps improve and enhance the overall look of your home and garden.",
    "Lighting plays a crucial role in both safety and style, and it's important to consider your intended use of the outdoor area when designing your lighting setup.",
  ],
  sidebar: {
    title: "Professional Consultation",
    description:
      "From pathway and accent lighting to full property designs, our team can help you choose the right fixtures, placement, and controls for safety, style, and lasting performance.",
    cta: {
      label: "Schedule a Consultation",
      url: "/get-a-quote/",
    },
  },
} as const satisfies ViServiceBodyCopyContent;

export const VI_LIGHTING_SERVICE = {
  name: "Landscape Lighting",
  category: "Outdoor Lighting",
  sections: [
    {
      heading: "Landscape Lighting",
      content: [
        "The correct use of lighting can create a warm and inviting ambiance that beckons us outdoors. By setting the right mood, adding a touch of romance, and bringing in a sense of drama, landscape lighting can infuse our gardens and outdoor entertainment areas with interest and intrigue.",
      ],
    },
    {
      heading: "Lighting System",
      content: [
        "With a carefully designed outdoor lighting system, you can enjoy your front and backyard even after the sun goes down. Not only does it make your yard and landscaping visible in the dark, but it also helps improve and enhance the overall look of your home and garden. Lighting plays a crucial role in both safety and style, and it's important to consider your intended use of the outdoor area when designing your lighting setup.",
        "Once you've invested in landscaping your property, lighting breathes new life into your garden when the sun sets.",
      ],
    },
    {
      heading: "Landscape Lighting Techniques",
      items: [
        {
          title: "Crosslighting",
          content: "Eliminating shadows when you light your focal point from both sides.",
        },
        {
          title: "Driveways",
          content: "Offering a real architectural look, and a practical solution to help you see where you're going.",
        },
        {
          title: "Pathways",
          content:
            "This is the most common type of landscape lighting. Using this important feature you can not only highlight where you're walking, increase safety and add value to your curb appeal.",
        },
        {
          title: "Patios",
          content: "Use a mix of lighting strategies to create a moonlight effect.",
        },
        {
          title: "Downlighting",
          content: "Aiming lights downwards, usually from a tree, creating gentle lighting.",
        },
        {
          title: "Uplighting",
          content: "Aiming the lights up at your focal point, you create contrast and drama with strong effects.",
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
      heading: "LED, Low Voltage or Solar Lighting",
      content: [
        "There are a wide variety of outdoor lighting options to choose from today. The most popular choice for lighting is low-voltage halogen lights. That's because they are affordable and have an appealing color temperature.",
        "LED lighting technology has advanced significantly in the last few years as manufacturers are still developing the lights, and now have smartphone applications where you can control your lights and have an array of colors to choose from. LED lighting is starting to grow in popularity as bulbs have an average of 50,000 hours and use 75 percent less electricity than halogen bulbs.",
        "You should be aware that LED bulbs cost more, but will be cheaper over the long term. If you prefer the cost-saving benefits of solar lighting, you must select a high-quality product, with a long lighting time after being charged from the sun.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Cost of Landscape Lighting",
      content: [
        "Landscape lighting offers a variety of options that can fit into your budget, style, and purpose but there is more to installing landscape lighting than just the costs of the lights.",
        "The cost of your landscape lighting will usually depend on the size of your yard, and the type of lights, lighting effects, and the installation methods.",
        "Using professional installers, they will light your front or backyard; using techniques that hide wires, and set up your lighting so that there are no odd shadows or blinding glare that could annoy the neighbors.",
        "They will use only high quality locally sourced fixtures, bulbs, and wiring, so you can be assured your landscape lighting will be drama free for years to come.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Factors that can influence the cost of your landscape lighting",
      items: [
        {
          title: "Cost of Materials",
          content:
            "It can vary depending on the features and installation style in your yard. It can also depend on the size of your yard as an 800 square feet yard normally requires 20 lighting fixtures.",
        },
        {
          title: "Electrician",
          content: "They will be needed if you need to have an extra transformer installed or additional power points.",
        },
        {
          title: "Ground Fault Circuit Interrupter Outlet",
          content: "Essential for powering low voltage lighting systems, an electrician will have to install one.",
        },
        {
          title: "Labor",
          content: "Professionals usually charge per hour, so it's a good idea to get an estimate to plan your budget.",
        },
        {
          title: "Quality of Fixtures",
          content:
            "Aluminum lighting fixtures should be your preferred choice, as they use advanced powder-coating technology, preventing corrosion and rust.",
        },
        {
          title: "Wiring",
          content:
            "With large properties and complex light systems, you'll require a large amount of quality wiring and a transformer to prevent voltage drop.",
        },
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
  ],
} as const;

export const VI_LIGHTING_LED_CTA = {
  eyebrow: "Lighting Options",
  headline: "Not Sure Which Lighting System Is Right for You?",
  description:
    "Whether you're considering LED, low-voltage, or solar, we'll help you compare efficiency, upfront cost, and long-term performance so you get the best fit for your property.",
  cta: {
    label: "Get Your Lighting Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_LIGHTING_CTA = {
  eyebrow: "Landscape Lighting",
  headline: "Ready to Illuminate Your Outdoor Space?",
  description:
    "From pathway and accent lighting to full property designs, our team can help you choose the right fixtures, placement, and controls for safety, style, and lasting performance.",
  cta: {
    label: "Schedule a Consultation",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;
