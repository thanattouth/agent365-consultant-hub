import type {
  ChatTrace,
  ChatTurn,
  Citation,
  ConsultantMode,
  GuardrailResult,
  SafetyLevel,
} from "@/lib/chat/types";
import type { RetrievalResult } from "@/lib/retrieval/types";

export type ChatProviderId = "local" | "azure-openai";

export type DraftConsultantResponseInput = {
  message: string;
  mode: ConsultantMode;
  messages?: ChatTurn[];
};

export type DraftConsultantResponse = {
  content: string;
  citations: Citation[];
  retrievalResults: RetrievalResult[];
  mode: ConsultantMode;
  confidence: number;
  requiresCitation: boolean;
  safetyLevel: SafetyLevel;
  guardrails: GuardrailResult;
  followUpQuestions: string[];
  contractVersion: string;
  provider: ChatProviderId;
  trace: ChatTrace;
};

export type ChatAnswerProvider = {
  id: ChatProviderId;
  draftResponse(input: DraftConsultantResponseInput): Promise<DraftConsultantResponse>;
};
