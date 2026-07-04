export const SPM_SPECIALIST = {
  name: "Marcie",
  title: "Neighborhood Pet Specialist",
  status: "Usually replies in a minute",
} as const;

export const SPM_SPECIALIST_GREETING = `Hi there! I'm ${SPM_SPECIALIST.name}, your Saturday Morning pet specialist. Ask about food, delivery, rewards, or finding the right gear for your pet!`;

export const SPM_SPECIALIST_QUICK_PROMPTS = [
  "Same-day delivery?",
  "Rewards club perks",
  "Food for my puppy",
  "Vet-approved treats",
] as const;

export const SPM_SPECIALIST_CHAT_STORAGE_KEY = "spm-specialist-chat-messages";
