export type ChatRole = "user" | "assistant" | "system";

export const consultantModeIds = ["architect", "admin", "security", "licensing"] as const;

export type ConsultantMode = (typeof consultantModeIds)[number];

export type SafetyLevel = "standard" | "sensitive" | "high";

export type GuardrailStatus = "pass" | "review" | "block";

export type RiskFlag =
  | "prompt_injection"
  | "secret_request"
  | "permission_bypass"
  | "destructive_admin_action"
  | "licensing_certainty"
  | "production_risk";

export type GuardrailResult = {
  status: GuardrailStatus;
  riskFlags: RiskFlag[];
  requiresHumanReview: boolean;
  guidance: string[];
};

export type ChatTurn = {
  role: Exclude<ChatRole, "system">;
  content: string;
};

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
  guardrailStatus: GuardrailStatus;
  riskFlags: RiskFlag[];
  requiresHumanReview: boolean;
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
  guardrailStatus?: GuardrailStatus;
  riskFlags?: RiskFlag[];
  requiresHumanReview?: boolean;
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
