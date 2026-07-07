export type ChatRole = "user" | "assistant" | "system";

export const consultantModeIds = ["architect", "admin", "security", "licensing"] as const;

export type ConsultantMode = (typeof consultantModeIds)[number];

export type SafetyLevel = "standard" | "sensitive" | "high";

export type Citation = {
  title: string;
  source: string;
  url?: string;
};

export type ChatTrace = {
  requestId?: string;
  provider: string;
  mode: ConsultantMode;
  latencyMs?: number;
  retrievalResultCount: number;
  citationCount: number;
  confidence: number;
  safetyLevel: SafetyLevel;
  retrieval: Array<{
    id: string;
    title: string;
    source: string;
    product: string;
    scenario: string;
    sensitivity: string;
    score: number;
    matchedKeywords: string[];
  }>;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  author: string;
  content: string;
  createdAt: string;
  citations?: Citation[];
  mode?: ConsultantMode;
  confidence?: number;
  requiresCitation?: boolean;
  safetyLevel?: SafetyLevel;
  followUpQuestions?: string[];
  contractVersion?: string;
  provider?: string;
  trace?: ChatTrace;
};

export type ConversationSummary = {
  id: string;
  title: string;
  icon: "chat" | "cloud" | "shield" | "workflow";
  updatedAt: string;
};
