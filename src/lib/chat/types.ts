export type ChatRole = "user" | "assistant" | "system";

export type Citation = {
  title: string;
  source: string;
  url?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  author: string;
  content: string;
  createdAt: string;
  citations?: Citation[];
};

export type ConversationSummary = {
  id: string;
  title: string;
  icon: "chat" | "cloud" | "shield" | "workflow";
  updatedAt: string;
};

export type ConsultantMode = "architect" | "admin" | "security" | "licensing";
