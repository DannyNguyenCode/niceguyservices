import "server-only";

import { isMongoDbConfigured } from "@/lib/templates/db";
import { findPetMarketProducts } from "../model";
import type { SpecialistChatMessage, SpecialistChatReply } from "./types";

type KnowledgeEntry = {
  keywords: string[];
  answer: string;
  suggestions?: string[];
};

const SPM_SPECIALIST_NAME = "Marcie";

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["delivery", "deliver", "shipping", "ship", "same-day", "same day"],
    answer:
      "We offer same-day delivery for neighbors within 10 miles — orders placed before noon usually arrive that afternoon in our vintage teal truck. You can also choose curbside pickup at any Saturday Morning location.",
    suggestions: ["How does pickup work?", "Store locations"],
  },
  {
    keywords: ["pickup", "curbside", "pick up"],
    answer:
      "Choose Curbside at checkout, pull up under our striped awning, ring the brass bell, and we'll bring your order to your car. Easy peasy!",
    suggestions: ["Store locations", "Return policy"],
  },
  {
    keywords: ["return", "refund", "exchange"],
    answer:
      "We want every tail to wag! Returns are accepted within 30 days. Unused goods get a full refund; opened food is donated to our local shelter partners.",
    suggestions: ["Delivery options", "Talk to a human"],
  },
  {
    keywords: ["reward", "paws", "points", "membership", "club", "loyalty"],
    answer:
      "Saturday Morning Rewards Club members earn 1 Paws Point per dollar spent, plus perks like 10% off purchases, early access to fresh deliveries, and birthday treats for your best friend. New members get 50 bonus points when they sign up!",
    suggestions: ["How do I join?", "Vet-approved products"],
  },
  {
    keywords: ["join", "register", "sign up", "account", "create account"],
    answer:
      "Tap Join the Pack on our login page to enroll in the Rewards Club. You'll need your name, pet's name, email, and a password — takes less than a minute!",
    suggestions: ["Rewards perks", "Same-day delivery?"],
  },
  {
    keywords: ["dog", "puppy", "puppies", "canine"],
    answer:
      "For dogs, I usually start with age-appropriate kibble, a sturdy chew toy, and a cozy bed. Puppies do best on smaller kibble sizes and gentle training treats. Browse our Dog Supplies aisle or tell me your pup's age and I'll narrow it down!",
    suggestions: ["Vet-approved treats", "Training tips"],
  },
  {
    keywords: ["cat", "kitten", "feline"],
    answer:
      "Cats love a mix of quality wet and dry food, a scratching post, and interactive toys. Kittens need higher-protein formulas — check our Cat Supplies section for neighborhood favorites.",
    suggestions: ["Nutrition advice", "Shop cat food"],
  },
  {
    keywords: ["bird", "small pet", "hamster", "rabbit", "guinea"],
    answer:
      "Our Bird & Small Pet aisle has species-appropriate bedding, hay, and fortified pellets. Always match food to your pet's size and life stage — happy to help you compare options!",
    suggestions: ["Store locations", "Delivery options"],
  },
  {
    keywords: ["food", "kibble", "nutrition", "diet", "eat", "feeding"],
    answer:
      "Nutrition depends on species, age, and activity level. Look for vet-approved labels on packaging, and transition to new foods gradually over 7–10 days. Our Resource Center has full guides if you want to dig deeper!",
    suggestions: ["Vet-approved products", "Puppy food tips"],
  },
  {
    keywords: ["vet", "veterinarian", "approved", "health", "sick", "illness"],
    answer:
      "Products marked Vet Approved on our shelves have been reviewed for quality and safety. For medical concerns, always consult your veterinarian — I'm here for product and shopping guidance, not diagnoses.",
    suggestions: ["Find vet-approved items", "Return policy"],
  },
  {
    keywords: ["train", "training", "behavior", "bark", "leash"],
    answer:
      "Positive reinforcement works wonders! Short training sessions, high-value treats, and consistency are key. Our training guides in the Resource Center cover basics from leash manners to crate comfort.",
    suggestions: ["Training treats", "Rewards club"],
  },
  {
    keywords: ["checkout", "cart", "order", "pay", "payment"],
    answer:
      "Add items to your cart, head to checkout, and we'll hold your stock for 15 minutes while you complete your order. Demo checkout collects shipping info — payment integration is coming soon!",
    suggestions: ["Delivery options", "Return policy"],
  },
  {
    keywords: ["location", "store", "hours", "address", "where"],
    answer:
      "We have neighborhood shops across town! Visit our Locations page for addresses, Saturday walk schedules, and which stores offer curbside pickup.",
    suggestions: ["Same-day delivery?", "Contact us"],
  },
  {
    keywords: ["contact", "phone", "email", "human", "call", "speak"],
    answer:
      "You can reach our team through the Contact page, or stop by any store on a Saturday morning — we love meeting neighbors and their pets in person!",
    suggestions: ["Store locations", "FAQ"],
  },
  {
    keywords: ["hello", "hi", "hey", "howdy", "good morning"],
    answer: `Howdy! I'm ${SPM_SPECIALIST_NAME}, your neighborhood pet specialist. Ask me about food, treats, delivery, rewards, or finding the right gear for your furry friend!`,
    suggestions: ["Same-day delivery?", "Rewards club perks", "Food for my puppy"],
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    answer:
      "You're so welcome! If anything else comes up, I'm right here. Give your pet an extra scratch behind the ears from us!",
    suggestions: ["Shop recommendations", "Store locations"],
  },
];

const DEFAULT_REPLY: SpecialistChatReply = {
  content: `I'm not sure I caught that, but I'm happy to help with delivery, returns, rewards, nutrition, or product picks. What would you like to know?`,
  suggestions: ["Same-day delivery?", "Rewards club perks", "Vet-approved treats", "Store locations"],
};

function lastUserMessage(messages: SpecialistChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user") return messages[i].content.trim();
  }
  return "";
}

function matchKnowledge(text: string): KnowledgeEntry | null {
  const lower = text.toLowerCase();
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) score += keyword.includes(" ") ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}

function extractProductQuery(text: string): string | null {
  const lower = text.toLowerCase();
  const productIntent =
    /\b(recommend|suggestion|suggest|find|looking for|need|buy|shop|product|treat|toy|kibble|food)\b/.test(
      lower,
    );
  if (!productIntent) return null;

  const cleaned = text
    .replace(/\b(can you|could you|please|i'm|i am|looking for|find me|recommend|suggest|some|any)\b/gi, "")
    .replace(/\b(dog|cat|bird|pet|puppy|kitten)\b/gi, "")
    .trim();

  return cleaned.length >= 2 ? cleaned : text.trim();
}

async function tryProductRecommendations(query: string): Promise<SpecialistChatReply | null> {
  if (!isMongoDbConfigured()) return null;

  try {
    const result = await findPetMarketProducts({
      q: query,
      page: 1,
      pageSize: 3,
      sort: "name-asc",
    });

    if (result.items.length === 0) return null;

    const lines = result.items.map(
      (item) => `• ${item.product_name} (${item.brand}) — $${item.price.toFixed(2)}`,
    );

    return {
      content: `Here are a few neighborhood favorites that might fit:\n\n${lines.join("\n")}\n\nWant me to narrow by pet type, budget, or vet-approved options?`,
      suggestions: ["Vet-approved treats", "Dog supplies", "Cat food tips"],
    };
  } catch {
    return null;
  }
}

export async function generateSpecialistReply(
  messages: SpecialistChatMessage[],
): Promise<SpecialistChatReply> {
  const text = lastUserMessage(messages);
  if (!text) {
    return {
      content: `Hi there! I'm ${SPM_SPECIALIST_NAME}, your Saturday Morning pet specialist. What can I help you and your pet with today?`,
      suggestions: ["Same-day delivery?", "Rewards club perks", "Food for my puppy"],
    };
  }

  const productQuery = extractProductQuery(text);
  if (productQuery) {
    const productReply = await tryProductRecommendations(productQuery);
    if (productReply) return productReply;
  }

  const match = matchKnowledge(text);
  if (match) {
    return {
      content: match.answer,
      suggestions: match.suggestions ?? DEFAULT_REPLY.suggestions,
    };
  }

  return DEFAULT_REPLY;
}

export { SPM_SPECIALIST_NAME };
