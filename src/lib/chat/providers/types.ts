import type { Citation, ConsultantMode, SafetyLevel } from "@/lib/chat/types";
import type { RetrievalResult } from "@/lib/retrieval/types";

export type ChatProviderId = "local" | "azure-openai";

export type DraftConsultantResponseInput = {
  message: string;
  mode: ConsultantMode;
};

export type DraftConsultantResponse = {
  content: string;
  citations: Citation[];
  retrievalResults: RetrievalResult[];
  mode: ConsultantMode;
  confidence: number;
  requiresCitation: boolean;
  safetyLevel: SafetyLevel;
  followUpQuestions: string[];
  contractVersion: string;
  provider: ChatProviderId;
};

export type ChatAnswerProvider = {
  id: ChatProviderId;
  draftResponse(input: DraftConsultantResponseInput): Promise<DraftConsultantResponse>;
};
