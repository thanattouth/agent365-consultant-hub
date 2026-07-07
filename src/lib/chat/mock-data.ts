import type { ChatMessage, ConversationSummary } from "./types";

export const conversations: ConversationSummary[] = [
  {
    id: "current",
    title: "New conversation",
    icon: "chat",
    updatedAt: "Now",
  },
];

export const initialMessages: ChatMessage[] = [];
