/** Driveway paving service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_DRIVEWAY_BENEFITS_CTA = {
  eyebrow: "Driveway Paving Benefits",
  headline: "Invest in a Driveway That Adds Value and Curb Appeal",
  description:
    "From versatile design options and long-term durability to easier maintenance and better functionality, the right driveway can improve how your home looks, feels, and performs every day.",
  cta: {
    label: "Get Your Driveway Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_DRIVEWAY_MAINTENANCE_CTA = {
  eyebrow: "Routine Maintenance",
  headline: "Reach Out To Us For A Quote",
  description:
    "Whether you need expert installation, seasonal upkeep advice, or ethical workmanship from a licensed professional, Valley Interlocking & Landscaping is ready to help with your driveway project.",
  cta: {
    label: "Request a Design Consultation",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_DRIVEWAY_SERVICE = {
  name: "Driveway Paving",
  category: "Driveways & Hardscaping",
  sections: [
    {
      heading: "Driveway Paving",
      content: [
        "Enhance your home's curb appeal and create a lasting impression with a well-designed and durable driveway. Not only does it provide a reliable surface for parking your car, but it also enhances the overall aesthetic of your property.",
      ],
    },
    {
      heading: "Choose Your Surface",
      items: [
        {
          imageKey: "blockCurbing" as const,
          title: "Block Curbing",
          content:
            "Block curbing creates an impressive outline around driveways and also serves as the barrier between your lawn and driveway. This stylish addition to your driveway can provide a finished look at your landscaping as well as help prevent weeds from growing towards your driveway.",
        },
        {
          imageKey: "pavingStones" as const,
          title: "Paving Stone",
          content:
            "Paving stone is the most expensive type of driveway but is of high quality and cheaper to maintain. They are more flexible and can be replaced or flipper easier than other types of paving. It's available in different colors, sizes, and shapes, unlike the other types of paving.",
        },
        {
          imageKey: "asphalt" as const,
          title: "Asphalt Driveways",
          content:
            "It's common for homeowners who want an attractive and beautiful driveway. Asphalt driveways maintenance is high because it requires a new, black seal coat every 2-3 years. The durability of asphalt driveway paving is lower than that of concrete. It's also affected by the weather.",
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
      heading: "Types of Driveways",
      content: [
        "Concrete driveways are the most common types of driveways for homeowners because they are the most affordable. Its cost makes it more appealing to many homeowners. When it comes to durability, it will quickly crack, and it's expensive to repair.",
      ],
      subsections: [
        {
          title: "Plain Concrete",
          content:
            "It is the cheapest type of driveway paving. It's plain in color and best for homeowners with a limited budget but wants a durable driveway.",
        },
        {
          title: "Exposed Aggregate Concrete",
          content:
            "It uses material such as granite, which needs to be polished for it to be attractive. Pigments are required to be added to the exposed aggregate concrete to provide new texture, color, or design to the driveway.",
        },
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Driveway Paving Benefits",
      eyebrow: "Driveway Paving Benefits",
      image: VI_IMG.driveway.hero,
      imageAlt:
        "Luxury suburban driveway with natural stone paving, charcoal block curbing, and manicured landscaping.",
      content: [
        "As the first thing visitors see when approaching your home, a well-maintained driveway, along with a beautiful compound and lush lawn, sets the stage for a visually appealing and welcoming environment.",
        "With a wide range of materials and styles to choose from, you can customize your driveway to strike the perfect balance between visual appeal, durability, and ease of maintenance.",
      ],
      items: [
        {
          title: "Versatility",
          icon: "architecture" as const,
          content:
            "Choose from a vast array of colors, patterns, and materials. Whether you want an intricate interlocking design or a simple, elegant asphalt finish, the options are limitless to match your home's aesthetic.",
        },
        {
          title: "Functionality",
          icon: "directions_car" as const,
          content:
            "A professionally installed driveway provides a stable, level surface for vehicles and pedestrians alike. It ensures safe access to your home and prevents mud or debris from being tracked inside.",
        },
        {
          title: "Affordable",
          icon: "payments" as const,
          content:
            "While it is an investment, a new driveway offers excellent long-term value. It reduces maintenance costs over time and significantly increases the resale value of your property.",
        },
        {
          title: "Reflect Light",
          icon: "light_mode" as const,
          content:
            "Lighter colored materials, such as specific concrete or stone finishes, reflect more light. This can improve visibility and safety around your home entrance during evening hours.",
        },
        {
          title: "Simple Maintenance",
          icon: "mop" as const,
          content:
            "Modern paving materials are designed for easy upkeep. Most driveways only require occasional sweeping and rinsing to maintain their pristine look for years to come.",
        },
      ],
      ctaCard: {
        title: "Ready to upgrade?",
        label: "Get Your Driveway Quote",
        url: "/get-a-quote/",
      },
      ctas: [
        { label: "GET A QUOTE", url: "/get-a-quote/" },
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
      ],
    },
    {
      heading: "Key Elements for a Quality Driveway",
      imageDescription: "interlocking driveway and stairs with landscape design for front of a house",
      items: [
        {
          title: "A Suitable Foundation",
          content:
            "A strong foundation is the first factor to consider when installing a driveway. For durable driveways, there must be a sub-grade and a strong aggregate base. Problems may occur during the paving process if the sub-grade isn't correctly stabilized. For example, if your home is full of soft wet clay, the paving contractor must remove the wet clay and replace it with a durable stone base that will reinforce the ground surface. Failure to do that may lead to the driveway buckling, crumbling, cracking, and ever-increasing deterioration.",
        },
        {
          title: "Good Drainage",
          content:
            "The number one threat to driveways is water, especially concrete and asphalt payment. So, when it comes to driveway installation, proper drainage is crucial. Water must be drained away from the edges of the driveways. If there is no excellent drainage, then water will not correctly run off the sides off the driveway. This will lead to water seeping into the open crevices or poles of the driveway and may freeze, thaw and expand the driveway over time. This is what causes crumbling, potholes, and cracks.",
        },
        {
          title: "Proper Supplies",
          content:
            "If the wrong pavement mix is used on driveways, you can be assured of future problems. Most driveways are vulnerable to oxidation and weathering, especially asphalt. Although there many types of mixes to construct driveways, a perfect mix should contain fewer air voids. It should also result in a more excellent aggregate finishing to look darker and smoother.",
        },
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Routine Maintenance",
      content: [
        "After the driveway is paved and completed the work is done. Driveways require regular maintenance all year round for them to last longer. Maintenance includes daily sweeping of debris, seal coating, regular power washing, crack repair, and more. Consult driveways professionals for advice on proper asphalt maintenance practices.",
      ],
    },
    {
      heading: "Ethical Workmanship",
      content: [
        "It's highly recommended to hire a bonded, licensed, and insured pavement contractor for proper construction practice and ethical workmanship. Professionals guarantee a proper job since they are trained and experienced.",
        "They will also offer the best advice on driveway paving materials to choose depending on your lawn and your budget. You can visit these professionals for free estimates to decide the amount you need for the paving project.",
        "Installing a driveway paving is one of the greatest ways of adding value to your homes, especially if you are looking to rent or sell it out in the future. No matter the material you choose for your driveway, always opt for professional installation for quality results that will look good both today and in the future!",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
  ],
} as const;
