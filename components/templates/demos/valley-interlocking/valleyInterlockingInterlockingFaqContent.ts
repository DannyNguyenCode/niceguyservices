/** Interlocking & paving service FAQs — demo content aligned with service page topics. */

export const VI_INTERLOCKING_FAQ_PAGE = {
  heading: "Interlocking & Paving FAQs",
  intro:
    "Common questions about paver selection, installation standards, maintenance, and what to expect from a professional hardscaping project.",
  faqs: [
    {
      question: "How long do interlocking pavers last?",
      answer: [
        "When installed on a properly compacted base with correct drainage, interlocking pavers typically last 25 to 40 years or more.",
        "Their modular design means individual units can be lifted and replaced without disturbing the surrounding surface, which extends the life of the overall installation.",
      ],
      category: "Durability",
    },
    {
      question: "What is the difference between interlocking pavers and poured concrete?",
      answer: [
        "Poured concrete is a single rigid slab that can crack with freeze-thaw cycles and ground movement. Interlocking pavers are individual units with flexible joints that absorb movement.",
        "Pavers also offer more design flexibility — colours, patterns, and textures — and damaged sections can be repaired without replacing the entire surface.",
      ],
      category: "Materials",
    },
    {
      question: "How deep should the base be for a driveway?",
      answer: [
        "Base depth depends on expected load. Walkways generally need 3 to 4 inches of compacted aggregate; residential driveways need 4 to 6 inches.",
        "Areas with heavy vehicles or commercial traffic may require 6 to 8 inches. We assess soil conditions on site and build to the depth your project demands.",
      ],
      category: "Installation",
    },
    {
      question: "Can pavers be installed over an existing driveway?",
      answer: [
        "In some cases, yes — if the existing surface is structurally sound, well drained, and can support the added height at transitions and garage entries.",
        "We evaluate the current base during consultation. When the existing surface is cracked, heaving, or poorly drained, full excavation and a new base is the better long-term solution.",
      ],
      category: "Installation",
    },
    {
      question: "How do you prevent weeds from growing between pavers?",
      answer: [
        "Proper edge restraint, polymeric joint sand, and a well-compacted base significantly reduce weed growth.",
        "Routine maintenance — sweeping, occasional rinsing, and reapplying joint sand when needed — keeps joints tight. Sealing can provide an additional barrier on high-traffic areas.",
      ],
      category: "Maintenance",
    },
    {
      question: "Are interlocking pavers slippery in winter?",
      answer: [
        "Textured pavers with the right surface finish provide better traction than smooth poured concrete in wet and icy conditions.",
        "We recommend slip-resistant paver profiles for pool decks, steps, and steep driveways. Salt and sand can be used in winter, though rinsing in spring helps preserve joint sand and surface finish.",
      ],
      category: "Safety",
    },
    {
      question: "How long does a typical interlocking project take?",
      answer: [
        "A standard residential driveway or patio usually takes 3 to 5 days from excavation to final compaction, depending on size, access, and weather.",
        "Larger projects, curved designs, or sites requiring significant grading may take one to two weeks. We provide a timeline after the on-site consultation.",
      ],
      category: "Project Planning",
    },
    {
      question: "Can a single damaged paver be replaced?",
      answer: [
        "Yes — one of the main advantages of interlocking systems is that individual pavers can be removed and reinstalled without cutting or patching.",
        "We recommend keeping a few spare pavers from the original batch so colour and texture match as closely as possible over time.",
      ],
      category: "Maintenance",
    },
  ],
} as const;

export const VI_INTERLOCKING_FAQS = VI_INTERLOCKING_FAQ_PAGE.faqs;
