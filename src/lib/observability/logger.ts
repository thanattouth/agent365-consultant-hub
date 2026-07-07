type ChatLogEvent = {
  event: "chat.request.completed" | "chat.request.failed";
  requestId: string;
  provider?: string;
  mode?: string;
  latencyMs: number;
  status: number;
  retrievalResultCount?: number;
  citationCount?: number;
  confidence?: number;
  safetyLevel?: string;
  guardrailStatus?: string;
  riskFlags?: string[];
  requiresHumanReview?: boolean;
  errorCategory?: string;
};

export function logChatEvent(event: ChatLogEvent) {
  console.info(JSON.stringify(event));
}
