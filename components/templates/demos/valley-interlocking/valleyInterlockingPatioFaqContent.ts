/** Patio installation service FAQs — demo content aligned with service page topics. */

export const VI_PATIO_FAQ_PAGE = {
  heading: "Patio FAQs",
  intro:
    "Common questions about patio design, materials, cost, installation, maintenance, and what to expect from a professional outdoor living project.",
  faqs: [
    {
      question: "What patio materials work best in the Toronto and Edmonton climate?",
      answer: [
        "Interlocking pavers, natural stone, and porcelain pavers are popular choices because they handle freeze-thaw cycles well when installed on a properly compacted base with correct drainage.",
        "Concrete slabs and flagstone also perform reliably in our climate when graded correctly and sealed or maintained as recommended for the material you choose.",
      ],
      category: "Materials",
    },
    {
      question: "How much does a new patio cost?",
      answer: [
        "Cost depends on patio size, material selection, site preparation, grading, optional features such as fire pits or pergolas, and access to the work area.",
        "Interlocking and natural stone patios typically offer strong long-term value. We provide a detailed estimate after reviewing your layout, drainage needs, and design preferences on site.",
      ],
      category: "Cost",
    },
    {
      question: "How long does patio installation take?",
      answer: [
        "A standard residential patio often takes three to seven days from excavation through final compaction, depending on size, complexity, and weather.",
        "Projects with retaining walls, built-in seating, or significant grading changes may take one to two weeks. We share a timeline during your consultation.",
      ],
      category: "Project Planning",
    },
    {
      question: "Does a patio increase home value?",
      answer: [
        "A well-designed, professionally installed patio can increase property value and curb appeal. Quality outdoor living spaces are consistently cited as desirable features for buyers.",
        "Patios also extend usable living space at a lower cost than adding interior square footage, often delivering a strong return on investment over time.",
      ],
      category: "Value",
    },
    {
      question: "How big should my patio be?",
      answer: [
        "Size depends on how you plan to use the space. Dining for six to eight people generally needs more room than a small lounging area, and walkways around furniture require extra clearance.",
        "We help you balance intended use, yard proportions, and budget so the patio feels spacious without overwhelming your landscape.",
      ],
      category: "Design",
    },
    {
      question: "Why is drainage and grading important for a patio?",
      answer: [
        "Water that pools on or against a patio can cause surface staining, ice hazards in winter, and long-term damage to the base and nearby foundation.",
        "Professional installation includes proper slope, base layers, and edge details so water moves safely away from your home and hardscape investment.",
      ],
      category: "Installation",
    },
    {
      question: "How much maintenance does a patio require?",
      answer: [
        "Maintenance varies by material. Interlocking pavers may need occasional joint sand top-ups and periodic sealing; natural stone benefits from gentle cleaning and resealing as recommended.",
        "Compared to wood decks, stone and paver patios generally require less ongoing upkeep and hold up well to seasonal weather with routine care.",
      ],
      category: "Maintenance",
    },
    {
      question: "Can you integrate pergolas, fire features, or outdoor kitchens?",
      answer: [
        "Yes. We design patios as complete outdoor living zones — dining areas, lounging spaces, cooking zones, fire pit seating, pergolas, privacy screens, and landscape lighting can all be planned together.",
        "Integrating features during the design phase ensures proper layout, utilities, and structural support before construction begins.",
      ],
      category: "Features",
    },
  ],
} as const;

export const VI_PATIO_FAQS = VI_PATIO_FAQ_PAGE.faqs;
