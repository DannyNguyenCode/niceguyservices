/** Landscape lighting service FAQs — demo content aligned with service page topics. */

export const VI_LIGHTING_FAQ_PAGE = {
  heading: "Landscape Lighting FAQs",
  intro:
    "Common questions about lighting types, installation, cost, safety, and what to expect from a professional outdoor lighting project.",
  faqs: [
    {
      question: "What is the difference between solar, low voltage, and line voltage lighting?",
      answer: [
        "Solar lights use a built-in photovoltaic cell and require no wiring — they are the simplest to install but need six to eight hours of direct sunlight daily to perform well.",
        "Low voltage systems run on 12-volt power from a transformer plugged into a GFCI outlet. They are safe, energy efficient, and the most popular choice for residential landscapes.",
        "Line voltage operates at 120 volts and is hardwired into your home's electrical system. Due to complexity and code requirements, line voltage is best handled by a licensed electrician.",
      ],
      category: "Lighting Types",
    },
    {
      question: "How much does professional landscape lighting cost?",
      answer: [
        "Cost depends on yard size, fixture count, lighting effects, wiring complexity, and whether new electrical outlets or transformers are needed.",
        "As a rough guide, an 800-square-foot yard often requires around 20 fixtures. Professional installation includes hidden wiring, proper placement, and fixtures rated for long-term outdoor use.",
      ],
      category: "Cost",
    },
    {
      question: "Do I need a GFCI outlet for low voltage landscape lighting?",
      answer: [
        "Yes. Low voltage transformers plug into an outdoor-rated GFCI (Ground Fault Circuit Interrupter) outlet for safety.",
        "If you do not have one near your planned transformer location, an electrician will need to install it before the lighting system can be connected.",
      ],
      category: "Installation",
    },
    {
      question: "Are LED landscape lights worth the higher upfront cost?",
      answer: [
        "LED bulbs typically last around 50,000 hours and use about 75 percent less electricity than halogen, making them cheaper over the long term despite a higher purchase price.",
        "Many modern LED systems also offer smart controls — timers, photo sensors, and smartphone apps — for flexible scheduling and colour options.",
      ],
      category: "LED & Efficiency",
    },
    {
      question: "Can I install landscape lighting myself?",
      answer: [
        "Solar and low voltage kits are well suited to confident DIYers. Solar requires planning for sun exposure and spacing; low voltage involves mounting a transformer, running cable, and making watertight connections.",
        "Line voltage work requires permits, trenching, and panel connections in most areas and should be left to licensed professionals. Our installation guide covers all three approaches in detail.",
      ],
      category: "DIY vs Professional",
    },
    {
      question: "How long does a landscape lighting installation take?",
      answer: [
        "A straightforward low voltage pathway or accent lighting project on a typical residential lot can often be completed in one to two days.",
        "Larger properties, line voltage work, trenching through hardscape, or integration with smart home controls may extend the timeline. We provide an estimate after an on-site consultation.",
      ],
      category: "Project Planning",
    },
    {
      question: "How far apart should pathway lights be spaced?",
      answer: [
        "Spacing depends on fixture brightness and path width. Most manufacturers recommend consistent intervals along the walkway — often 6 to 10 feet apart for standard path lights.",
        "Lights should sit within about 6 inches of the path edge so the beam illuminates the walking surface without casting glare into neighbouring yards.",
      ],
      category: "Design & Placement",
    },
    {
      question: "How do I maintain landscape lighting after installation?",
      answer: [
        "Clean fixture lenses seasonally to remove dirt, pollen, and mineral buildup that can dim output. Trim back plants that grow into light paths and check that stakes remain plumb after freeze-thaw cycles.",
        "For low voltage systems, inspect connections annually and replace bulbs or transformers as needed. LED fixtures require far less bulb replacement than halogen over their lifespan.",
      ],
      category: "Maintenance",
    },
  ],
} as const;

export const VI_LIGHTING_FAQS = VI_LIGHTING_FAQ_PAGE.faqs;
