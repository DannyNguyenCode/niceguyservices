export type SpecialistChatRole = "user" | "assistant";

export type SpecialistChatMessage = {
  role: SpecialistChatRole;
  content: string;
};

export type SpecialistChatReply = {
  content: string;
  suggestions?: string[];
};

export type SpecialistChatRequest = {
  messages: SpecialistChatMessage[];
};
