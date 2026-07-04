/** Lawn care service page — content from site JSON (no extra copy). */
import type { ViCtaBannerContent } from "./valleyInterlockingAboutContent";

export const VI_LAWN_CARE_101_CTA = {
  eyebrow: "Lawn Care 101",
  headline: "Put the Science of Green to Work on Your Lawn",
  description:
    "Exceptional landscapes aren't just built; they are curated. From mowing and fertilization to weed prevention and seasonal prep, Valley Interlock Landscaping keeps your turf healthy year-round.",
  cta: {
    label: "Get Your Lawn Care Quote",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_LAWN_CARE_CTA = {
  eyebrow: "Lawn Care & Turf",
  headline: "Elevate Your Landscape Identity",
  description:
    "Join our maintenance program. Consistent, professional care tailored to your property's unique structural and organic needs.",
  cta: {
    label: "See What's Possible",
    url: "/get-a-quote/",
  },
} as const satisfies ViCtaBannerContent;

export const VI_LAWN_CARE_101 = {
  heading: "Lawn Care",
  intro:
    "Exceptional landscapes aren't just built; they are curated. Our methodology blends horticultural science with structural precision.",
  tiles: [
    {
      eyebrow: "Watering Strategy",
      title: "Deep vs. Shallow",
      content:
        "Infrequent, deep watering encourages roots to grow deeper into the soil, creating drought-resistant turf. Frequent shallow sprays lead to weak roots and fungal issues.",
    },
    {
      eyebrow: "Seasonal Prep",
      title: "Aeration & Overseeding",
      content:
        "Fall is the critical window. We relieve soil compaction and introduce premium seed varieties to thicken the canopy before winter dormancy.",
    },
  ],
} as const;

export const VI_LAWN_CARE_SERVICE = {
  name: "Lawn Care & Turf",
  category: "Lawn Care & Maintenance",
  sections: [
    {
      heading: "Lawn Care & Turf",
      content: [
        "Having an attractive, healthy lawn is something that just about every Canadian property owner aspires towards, and your lawn is the first thing people see when looking at your home. Lawn can be a great asset to your home, giving you an area outside for entertaining, and making your home look beautiful year-round.",
      ],
    },
    {
      heading: "Why Lawn & Turf Care is Beneficial",
      content: [
        "Providing a wonderful area around the home for entertaining, and play areas for children and pets, a vibrant lawn can add significant value to your property. Plus your neighbors won't be able to help notice and admire your perfectly landscaped lawn, and that in itself is something to be proud of. Valley Interlock Landscaping is experienced with working with various types of grass.",
      ],
    },
    {
      heading: "Lawn Services",
      items: [
        {
          imageReference: "lawn-care-01",
          title: "Lawn Care",
          content:
            "Having a well-maintained lawn takes more than you think. Valley Interlock knows the different types of grass, along with the climate conditions.",
        },
        {
          imageReference: "lawn-sprinklers",
          title: "Lawn Irrigation",
          content:
            "Lawn mowing is about more than just cutting it one a month. Lawn mowing stimulates the grass of your to lushness and increased health.",
        },
        {
          imageReference: "turf-fitting",
          title: "Turf Fitting",
          content: "Proper and regular lawn mowing promotes healthy grass.",
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
      heading: "Lawn Care",
      content: [
        "Serious lawn maintenance requires a lot of commitment and plenty of time. That usually means that most weekends you'll be spending time in the yard looking after your lawn, either mowing, fertilizing or watering.",
        "Using lawn care professionals like Valley Interlock, you're guaranteed to have your lawn and yard taken care of consistently. Showing up the same time each week or month, always making you're your lawn looks pristine.",
        "We provide services for your lawn from:",
      ],
      services: ["Lawn Mowing", "Lawn Fertilizing", "Weed Prevention", "Grass Edging", "Lawn Repair"],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Lawn Mowing",
      content: [
        "Lawn mowing is one of those skills than many people think is so easy. For the very best looking lawn, you should mow early in the morning, usually just after the due has dried on the grass.",
        "The frequency of your lawn mowing schedule should be dictated by the height of your grass.",
        "You should use a back and forth pattern when mowing your lawn, overlapping the previous pass by half a lawn mower's width.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Lawn Fertilization",
      content: [
        "We can provide a comprehensive lawn treatment designed specifically to fit with your lawn. It can include quarterly fertilization to ensure healthy new growth of your lawn.",
        "The best time to start your lawn fertilizer program is the beginning of spring. Using a nitrogen, phosphate, and potassium mix.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Weed Prevention",
      content: [
        "We can provide a comprehensive lawn treatment designed specifically to fit with your lawn. It can include quarterly fertilization to ensure healthy new growth of your lawn.",
        "The best time to start your lawn fertilizer program is the beginning of spring. Using a nitrogen, phosphate, and potassium mix.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Grass Edging",
      content: [
        "Valley Interlock Landscaping, using our specialized equipment, will edge all of your paths, outdoor entertainment areas, and driveways, making sure your lawn doesn't grow anywhere it shouldn't be.",
        "Watering at times when the moisture is more likely to soak into the soil rather than evaporate from the heat. Early mornings or late in the evening are the best times to water your lawn.",
        "Watering your lawn correctly is a critical part of getting your lawn care just right. The more established your lawn is the less water it will require.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Lawn Repair",
      content: [
        "Best carried out in spring or autumn when the weather is cooler. Once we have repaired your lawn, regular mowing is advisable, with the required fertilizer program starting in spring and summer.",
        "Having a beautiful lawn can complement the rest of your yard and make your whole home look fantastic. That's why it's important to know when you need to prepare your lawn for the right time of year. Spring is the best time to spend time getting your lawn into shape. Mowing, feeding with fertilizer and dealing with any bare patches, weeds, and moss.",
        "Fertilize your lawn properly, and you'll soon have a healthy, dense grass that's a deep green color.",
      ],
      ctas: [
        { label: "VIEW OUR GALLERY", url: "/our-work-valley-interlock/" },
        { label: "GET A QUOTE", url: "/get-a-quote/" },
      ],
    },
    {
      heading: "Lawn Care is an Important Part of Maintaining a Beautiful Looking Grass",
      content: [
        "A good soaking once or twice a week is extremely beneficial for your lawn. Avoid giving your lawn light daily sprinklings, as this can cause your grass to have shallow roots and risk drying out.",
        "You will need to prepare your lawn for the winter. No matter how well you've maintained your grass over the summer months when autumn arrives your lawn will more than likely look tired and worn out.",
        "This is usually because your lawn has extracted all the nutrients from the soil, and suffering from the toll the heat has played with it during summer.",
        "Whether its a one-off, quick grass cut before new tenants move in, or regular lawn maintenance let us show you why Valley Interlock Landscaping is the most trusted lawn mowing service.",
        "Did you know that using the proper lawn mowing techniques will help benefit your turf. Having the professionals like Valley Interlock Landscaping regularly trim your lawn using a lawnmower will provide you with long-lasting benefits.",
        "To have a strong lawn, you'll need to mow it often. The trick is getting your grass to the right height, once you achieve this, the healthy grass shoots flourish.",
        "A common problem with lawns is uneven growth. By cutting the law to the same height regularly, the overall growth will be improved. Even lawn will provide your whole yard with consistency levels of nutrients.",
        "The more often your grass is mowed the healthier it will become, with a better quality lawn. A yard that is regularly mowed and maintained will recover faster.",
        "Make sure not to cut any more than 1/3 of the height of your grass as you can significantly damage the roots if you cut too low.",
        "Keeping up with regular lawn care is vital if you're looking to have a healthy lawn. To guarantee that you'll always have the best looking lawn, get the professionals to manage your yard.",
        "At Valley Interlock Landscaping we pride ourselves on providing a professional, friendly and superior landscaping service. Our techniques, machinery and application technology allows us to supply and apply premium quality products transforming your property.",
      ],
      tips: [
        "Water deeply once or twice per week",
        "Avoid daily light watering",
        "Prepare lawn for winter",
        "Mow regularly",
        "Do not cut more than one-third of grass height",
        "Maintain consistent mowing height",
        "Follow seasonal fertilization schedules",
      ],
    },
  ],
} as const;
